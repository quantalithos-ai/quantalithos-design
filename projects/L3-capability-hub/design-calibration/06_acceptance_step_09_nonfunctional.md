# L3-capability-hub 06 验收标准 Step 9: 定义非功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/验收标准书写规范.md` §5.9
> 回填章节: `06-验收标准.md` §9
> Step 状态: `completed-designed / not-evaluated`
> 日期: 2026-07-26

本 Step 将 `NFR-CH-001..020` 与 `AC-CH-033..037` 转成结构性、可复验的非功能门禁。没有正式负载模型、环境基线和 numeric target 的性能/容量/SLO字段只记录 sample contract，不形成 pass/fail。本文不创建 benchmark、environment、run、report 或 measured result。

## 1. Step 状态、目标与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 9 非功能验收门禁 |
| NFR inventory | `20/20`，性能3、可用性3、安全4、审计/追溯3、幂等/一致性4、可观测性3 |
| AC primary owner | `AC-CH-033` 性能/结构；`AC-CH-034` 可用性；`AC-CH-035` 安全；`AC-CH-036` trace/consistency；`AC-CH-037` observability |
| P0 hard gates | truth fidelity、zero-effect、redaction、dependency boundary、config fail-fast、replay/recovery、required safe observation、report integrity |
| Numeric treatment | duration/count/capacity samples may be collected; no active numeric threshold, so verdict remains `not_evaluated` |
| P1/P2 | real DB/bus/search/object storage、production-like SLO、external product parity、long retention and capacity remain residual/future |
| 不在本步 | evidence authenticity primary (Step 10), VETO (Step 11), defects/risk/signoff (Steps 12~14) |

## 2. 输入与禁止推断

| 输入 | 本步用途 | 不得推断 |
|---|---|---|
| `00-需求文档.md` §13 | 20 NFR、六类质量轴、历史阈值排除 | NFR 已执行 |
| `03-详细设计.md` §§10~14 | transaction/recovery/config/observation structural oracle | backend/production ready |
| `04-配置设计.md` §§6~11 | profile isolation、fail-fast、binding/failure | selected config exists |
| `05` Steps 5/6/9/10/13/14 | exact cases, suites, checks, NFR methods, evidence contracts | sample/result/report exists |
| Steps 5~8 | functionality, redline, interface, state/TX boundaries | later gate already passed |

Historical `P95 < 50ms`, `Policy refresh < 30s`, `99.9% SLA`, `100% allow/cost/recovery` and similar values are denylisted. They cannot be reintroduced by acceptance prose, smoke reports or risk tables.

## 3. SOP 五问回答

| 问题 | 收口答案 |
|---|---|
| 哪些 NFR 是 P0？ | Structural correctness of core reads/changes, typed degradation, forbidden-body/redaction, dependency/config boundaries, idempotency/recovery, safe observation and report integrity are P0. Numeric performance and production capacity are not currently P0 verdict metrics. |
| 阈值来自哪里？ | Hard conditions come from formal 00~04 invariants/cardinality and 05 exact oracle. No numeric threshold has an active source. |
| 哪些专项缺失影响验收？ | Missing P0 structural evidence blocks or makes acceptance undecidable. Missing selected product/production/capacity evidence affects only the manifest-selected layer and cannot compensate or invalidate a complete P0 semantic contract. |
| 哪些失败阻断？ | redaction leak, forbidden responsibility/body, non-core compile dependency, silent config fallback, P0 dependency marked passed, Query/Job truth repair, duplicate mutation, missing required safe evidence or invalid report pairing. |
| 证据来自哪里？ | Existing canonical `TC/DS/EV-CH-*`, 10 primary suites, 9 checks and fixed raw/report roots; no new EV identity is created here. |

## 4. Non-functional verdict semantics

| Status | Meaning | Acceptance impact |
|---|---|---|
| `passed` | Structural oracle and required raw-derived evidence satisfy the NFR in one explicit run | contributes to AC-CH-033..037; not final verdict alone |
| `failed` | Structural/security/ownership/recovery/report oracle violated | blocks the owning P0 AC; may become Step 11 veto |
| `blocked_dependency` | Required P0 prerequisite unavailable | no pass; P0 cannot exit |
| `invalid_artifact` | raw/report/digest/path/pairing/static evidence invalid | no adjudication; rerun/new baseline required |
| `not_evaluated` | Numeric target or real execution absent | not a pass and not a failure result |
| `not_decided` | evidence exists but required review/authorization absent | no verdict |

## 5. NFR-to-gate matrix

| NFR | Dimension / formal owner | Required structural oracle | TC / DS / EV selectors | Fixed primary suite/report | Failure / verdict impact |
|---|---|---|---|---|---|
| `NFR-CH-001` | performance; 03 core reads/exposure | identity/registry/descriptor/seam/relation/exposure reads remain executable independent of derived surfaces; duration/count sample is present when measured | QUERY `001..019`; FOUNDATION `003`; TX `013,014`; corresponding DS/EV | `service-command-query`; `reports/runs/<run_id>/suites/service-command-query.md` | derived dependency or missing required sample blocks structural gate; numeric value remains `not_evaluated` |
| `NFR-CH-002` | performance/truth; 03 UoW/TX | latency pressure/fault injection never bypasses expected version, UoW, idempotency, trace or truth owner | TX `001..022`; CMD `001..026`; STATE `001..024` selected exact pairs | `repository-transaction`; same-run suite report | bypass/partial commit/duplicate effect fails P0; no P95 threshold |
| `NFR-CH-003` | performance/derived isolation; 03 Q/J | derived/search/export/reconciliation delay or failure leaves core reads/changes independent and core-write count zero | QUERY `024..028`; JOB `001..006`; TX `013,014,020,021`; STATE `015..017,024` | `jobs-lifecycle` + `service-command-query`; both reports required | blocking derived path or core repair fails; duration trend only residual |
| `NFR-CH-004` | availability; 03 view/material states | peripheral unavailable/partial/stale produces typed surface while C-CH-1..5 truth remains readable/unchanged | STATE `014..017,024`; QUERY `017,024..028`; JOB `001..06` | `domain-state`,`jobs-lifecycle` | truth loss, synthetic ready or silent fallback fails; selected unavailable is not P0 pass |
| `NFR-CH-005` | availability/dependency; 03 references/inbound | unavailable/timeout/forbidden external source yields typed ref/state/failure; no synthetic approval/descriptor/method/exposure truth | INBOUND `001..006`; QUERY `008..13,29..33`; STATE `005..08,18`; BIND/CONFIG | `entry-inbound`,`service-command-query`,`runtime-binding`,`configuration-strict` | generic text, fake success or body load fails |
| `NFR-CH-006` | availability/collaboration; 03 O/J phase | external collaboration/downstream delay leaves local Durable truth unchanged; Job/Inbound records typed outcome | OUTBOUND `001..010`; JOB `007..08`; STATE `019,023`; TX `017..20` | `outbound-collaboration`,`jobs-lifecycle` | local truth rollback, local delivery lifecycle or lost capture fails |
| `NFR-CH-007` | security/forbidden data; 00/01/03/04 | forbidden body corpus rejected before persistence/emission; no secret/provider/execution/approval/method/SDK/marketplace/observability body in surfaces | FOUNDATION `001,005,008..011`; INBOUND `001..06`; OBS `006,008,012`; CONFIG `008,016` | `static-contract-docs`,`entry-inbound`,`observability-redaction`,`configuration-strict` | any leak is hard failure and Step 11 candidate; no risk acceptance |
| `NFR-CH-008` | security/safe summary; 03 descriptor/ref | ref/safe summary remains body-free and cannot advance external truth or enforcement | CMD `009..17`; QUERY `007..13`; STATE `004..08`; OBS `006,008,012` | `service-command-query`,`observability-redaction` | body or owner substitution fails |
| `NFR-CH-009` | security/exposure; 03 formal visibility | unresolved/draft/ungoverned/incomplete prerequisites cannot become FormalVisible/consumable | CMD `018..21`; QUERY `015..18`; STATE `007,009,010,014` | `service-command-query`,`domain-state` | visibility bypass fails and may trigger `VF-CH-008` |
| `NFR-CH-010` | security/governance separation | access review/risk summary cannot create approval/Policy/shared_rules or effective enforcement | CMD `004,013..15`; QUERY `012`; STATE `002,007`; OBS `012` | `service-command-query`,`observability-redaction` | responsibility leakage fails; no waiver |
| `NFR-CH-011` | traceability; 03 change/trace/capture | identity/registry/descriptor/seam/relation/exposure changes carry source/scope/trace/impact/capture symmetry | CMD `001..23`; QUERY `020..23`; OUTBOUND `001..08`; STATE `011..13`; OBS `004` | `outbound-collaboration`,`service-command-query`,`observability-redaction` | missing source/trace/capture fails |
| `NFR-CH-012` | traceability/reference; 03 protocol/ref | all eight reference kinds retain exact subject/kind/digest/state/source and body-free explanation | CMD `024..26`; QUERY `029..33`; INBOUND `001,002,004..06`; OUTBOUND `010`; STATE `018` | `service-command-query`,`entry-inbound`,`outbound-collaboration` | generic state/body/owner mismatch fails |
| `NFR-CH-013` | traceability/derived; 03 material/jobs | search/export/reconcile/maintenance output has explicit source, scope, version and terminal result | QUERY `024..28`; OUTBOUND `009`; JOB `001..07`; STATE `015..17,24` | `jobs-lifecycle`,`outbound-collaboration` | report/source ambiguity or core repair fails |
| `NFR-CH-014` | idempotency/consistency; 03 state/TX | one winner, stable digest, immutable stored replay and duplicate truth count zero | STATE `001,003,020`; TX `008..16,22`; CMD/INBOUND/JOB duplicate branches | `repository-transaction`,`domain-state` | duplicate mutation/conflict overwrite fails |
| `NFR-CH-015` | explicit mutation; 03 Command/state | only declared Commands mutate descriptor/seam/relation/exposure; Query/Event/Job/derived are no-write as specified | CMD `009..21`; QUERY `001..33`; STATE `004..10`; TX `013,014,20,21` | `service-command-query`,`repository-transaction` | implicit mutation fails |
| `NFR-CH-016` | degraded consistency; 03 material/ref state | stale/partial/unavailable remains typed; no current-truth reconstruction or silent fallback | QUERY `017,024..28`; STATE `014..18,24`; TX `016,21` | `service-command-query`,`domain-state`,`repository-transaction` | fabricated Ready/current truth fails |
| `NFR-CH-017` | consumer boundary; 03 exposure/SDK | runtime/tools/SDK consume one server boundary; consumer writes and execution/client/cache truth remain zero | CMD `026`; QUERY `018,019,31,32`; OUTBOUND `006,007`; STATE `014` | `service-command-query`,`outbound-collaboration`,`observability-redaction` | consumer authority leakage fails |
| `NFR-CH-018` | observability; 03 §14 profiles | required state/change/error ownership is observable with safe low-cardinality projection | OBS `001..012`; FOUNDATION `011`; relevant flow/STATE selectors | `observability-redaction`,`static-contract-docs` | missing mandatory profile or forbidden label fails; no claim that backend exists |
| `NFR-CH-019` | observability/dependency | source/collaboration/consumer/maintenance/config failures have typed owner and do not cancel business flow | INBOUND `001..06`; OUTBOUND `001..10`; JOB `001..08`; OBS `001..04,010`; CONFIG `001..18` | `entry-inbound`,`outbound-collaboration`,`jobs-lifecycle`,`configuration-strict` | unclassified failure/cancellation/core mutation fails |
| `NFR-CH-020` | observability boundary/security | observer cannot source truth, persist body, alter carrier/UoW/retry or change business outcome | QUERY `033`; OBS `004..12`; CONFIG `016`; FOUNDATION `010,011` | `observability-redaction`,`service-command-query`,`configuration-strict` | observer side effect/leak fails |

## 6. AC-CH-033..037 primary acceptance gates

| AC | Primary gate | Pass condition | Failure / blocked condition | Evidence/report contract | Verdict impact |
|---|---|---|---|---|---|
| `AC-CH-033` | NFR001~003 structural performance/truth fidelity | core paths remain independent of derived/P1 surfaces; mandatory duration/count sample is raw-derived when a run is claimed; no path bypasses TX/state/idempotency | core blocked by derived path, missing required sample, or semantic bypass; a value merely above an historical threshold is not itself a failure because no threshold is active | related canonical EVs plus `reports/runs/<run_id>/summary.md`, suite reports and evidence index | structural failure blocks; numeric result stays `not_evaluated` and cannot support pass |
| `AC-CH-034` | NFR004~006 availability/degradation/collaboration | typed unavailable/partial/stale/delayed/failed surfaces preserve local truth; external and downstream failures do not create synthetic success or rollback | silent fallback, lost capture, truth rewrite, unexpected P0 prerequisite unavailable | STATE/TX/INBOUND/OUTBOUND/JOB EVs; fixed suite report paths | P0 structural failure blocks; selected product unavailability is selected-blocked only |
| `AC-CH-035` | NFR007~010 security/redaction/responsibility | forbidden corpus is rejected and absent from active surfaces; dependency/exposure/governance boundaries remain exact; redaction findings safe | any forbidden body, secret, approval/method/runtime/marketplace/SDK ownership or non-core compile edge | FOUNDATION/OBS/BIND/CONFIG EVs; `reports/runs/<run_id>/checks/redaction` and dependency reports | hard block; never risk-accepted |
| `AC-CH-036` | NFR011~017 trace/consistency | source/scope/trace/capture/result symmetry, one winner, explicit mutations, typed stale/degraded and server exposure/no reverse write all pass | missing provenance, duplicate truth, implicit mutation, fabricated current state, consumer authority | flow/state/TX/OBS EVs; suite reports and evidence index | P0 block; may map to VF009/010 |
| `AC-CH-037` | NFR018~020 observability/audit | required safe profiles/refs/errors are present where applicable; observer is business-neutral and redacted; failure itself typed | missing required observation, high-cardinality/forbidden field, observer changes truth/UoW/retry or hides failure | OBS/CONFIG/FOUNDATION/flow EVs; `reports/runs/<run_id>/suites/observability-redaction.md` | P0 block if required profile/evidence missing; no backend readiness claim |

## 7. Numeric and residual boundary

| Candidate metric | Current status | What a future run may record | What it cannot prove now |
|---|---|---|---|
| core read/change duration | `not_evaluated` | raw duration/count/sample with environment/profile/config digest | no pass/fail without approved workload and threshold |
| propagation/collaboration delay | `not_evaluated` | source/capture/intent timestamps and typed status | no 30s/latency promise |
| capacity/throughput/concurrency | `not_evaluated` | bounded sample under selected environment | no production capacity/SLO |
| availability percentage/SLA | `not_evaluated` | explicit selected-run observations | no 99.9% claim |
| retention duration | no active numeric policy | event-gated retention state | no invented 30/90/180 day rule |

Numeric material is never a substitute for structural gates. `release-main-smoke` may demonstrate representative chain wiring and collect samples, but cannot replace detailed Command/Query/Inbound/Outbound/Job or 638-pair evidence.

## 8. P1/P2 residual matrix

| Residual | Scope | Acceptance treatment |
|---|---|---|
| real DB/bus/search/object storage parity | P1/P2 | selected evidence only; controlled/fake P0 remains authoritative for Hub semantics |
| production-like load/SLO/capacity | P2 | not claimed; requires new baseline and approved numeric source |
| external provider/GRC deep integration | P1/P2 | seam/unavailable boundary only; no full product truth |
| observer backend/long retention | P1/P2 operations | safe ref/report contract now; operational policy later |
| selected adapter/TLS/route | P1/R4 | immutable manifest decides applicability; cannot compensate P0 |

## 9. NFR stop-review and cross-specialty audit

| Specialty | IDs | Source/method/oracle fixed | Numeric leakage | Design result |
|---|---|---|---|---|
| performance | NFR001~003 / AC033 | yes; structural + sample | `0` active thresholds | `pass-designed` |
| availability | NFR004~006 / AC034 | yes; typed degradation/fault | n/a | `pass-designed` |
| security | NFR007~010 / AC035 | yes; forbidden corpus/redaction/dependency | n/a | `pass-designed` |
| traceability | NFR011~013 | yes; source/scope/capture | n/a | `pass-designed` |
| consistency | NFR014~017 / AC036 | yes; 22 TX/state/flow | n/a | `pass-designed` |
| observability | NFR018~020 / AC037 | yes; profile presence/neutrality | n/a | `pass-designed` |

| Cross audit | Result |
|---|---|
| NFR primary coverage | `20/20`, missing=0, duplicate primary=0 |
| AC primary coverage | `5/5` AC033~037 |
| hard structural gates | present for all P0 quality axes |
| historic numeric re-entry | `0` |
| P1/production/capacity compensation | `0` |
| manual-only P0 NFR gap | `0` by existing automation contracts |
| evidence identity inflation | `0`; existing EV only |
| unresolved upstream blocker | `0` |

## 10. 回填草稿：formal `06-验收标准.md` §9

正式章节只保留：

1. six NFR categories and AC-CH-033..037 primary gates;
2. structural hard conditions for truth, availability, security, configuration, recovery, traceability and observability;
3. mandatory sample contract with numeric values remaining `not_evaluated` absent an approved source;
4. P1/P2/production/capacity/retention residual boundary;
5. fixed TC/DS/EV and report paths, and hard failure conditions for redaction, responsibility, silent fallback, reverse write and report integrity.

## 11. 待确认事项与受控重开

| 事项 | 当前状态 | 处理 |
|---|---|---|
| future numeric performance/SLO | no active source | controlled reopen with workload, environment, threshold owner and new baseline |
| selected product/production scope | not selected | immutable scope manifest; no implicit expansion |
| evidence retention days | not selected | event-gated rule only; operational policy later |
| physical observer/backend | not selected | backend-neutral safe projection and redaction contract |

## 12. Step 9 完成门禁与下一步

| 条件 | 结果 |
|---|---|
| `NFR-CH-001..020` mapped | `20/20; pass-designed` |
| `AC-CH-033..037` primary gates | `5/5; pass-designed` |
| structural vs numeric separation | `closed; numeric not_evaluated` |
| P1/P2/production/capacity residual boundary | `closed` |
| redaction/dependency/config/recovery hard gates | `closed` |
| implementation/run/artifact/report/evidence/verdict/signoff facts | none claimed |
| unresolved upstream blocker | `0` |
| formal `06-验收标准.md` modified | `no; Step 15 only` |
| 下一步 | `enter_06_step_10_observability_evidence` |

Step 9 的 `pass-designed` 只表示非功能门禁设计闭合，不表示性能、可用性、安全或观测结果已经通过。
