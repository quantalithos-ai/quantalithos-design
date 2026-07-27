# L3-capability-hub 05 测试方案 Step 10: 专项测试与非功能验证

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/测试方案书写规范.md` §5.10
> 回填章节: `projects/L3-capability-hub/05-测试方案.md` §10
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> Step 状态: `accepted-designed`
> 当前任务: `T032`

---

## 1. 本步目标、输入与禁止范围

### 1.1 目标

把 formal `00` 的 `NFR-CH-001..020`、`AC-CH-033..037`方向，以及 formal `03` 的事务、并发、恢复、观测与安全投影契约，转译为性能、可用性、安全、审计/追溯、幂等/一致性、可观测性六类可执行专项。

本步必须闭合：

- 20/20 NFR均有方法、环境、exact canonical case/suite、通过条件和候选证据来源；
- 性能专项不继承旧`P95 < 50ms`、`30s`、`99.9% SLA`或任何无来源数字；
- 结构性性能/可用性仍有blocking oracle，不以“无数字”退化成无测试；
- forbidden body、truth ownership、approval/method/runtime/tools/marketplace/provider/SDK责任边界均有负向验证；
- 22 TX、12 OBS、18 CONFIG及关键Job/Outbound故障均有故障注入与恢复oracle；
- 可观测材料能证明可识别性，同时不能反过来成为business truth或正文存储；
- 不创建benchmark、压测环境、报告、run、阈值测量或正式evidence。

### 1.2 权威输入

| 输入 | 本步用途 | 不得改写 |
|---|---|---|
| formal `00` §13 | 20 NFR、六类质量轴及明确排除的历史数字 | 不新增SLA/延迟/吞吐目标 |
| formal `00` §14 | `AC-CH-033..037` future裁决方向 | 不提前给验收结论 |
| formal `01/02` | truth/derived/reference/forbidden ownership和产品中立性 | 不选择backend/拓扑/产品 |
| formal `03` §§10~12 | UoW、commit tri-state、concurrency、idempotency、reentry和recovery redlines | 不发明恢复算法或状态 |
| formal `03` §14 | 60 log、48 metric、27 span、3 event、20 durable profile及Off/Redacted | 不新增观测profile或backend truth |
| formal `04` §§7~12 | strict config、timeout/retry policy、binding/failure/frozen root | 不改配置值、边界或fallback |
| Step 5 | 20 NFR到exact cuts的覆盖方向 | 不把family placeholder升格为证据 |
| Steps 6~9 | 189 TC/DS/EVC candidate、7 environments、10 suites、gate/artifact/report contract | 不新增canonical case或声称已执行 |

### 1.3 禁止范围

- 不将duration sample写成性能通过结论；没有正式numeric baseline时，只能形成采样材料和结构性判定。
- 不把产品staging、真实DB/bus/provider、生产流量、容量模型或observer backend写成已存在。
- 不通过故障注入改变正式error/state/retry/transaction contract。
- 不把安全扫描“0 findings”写成实际结果；只定义未来必须为0的blocking oracle。
- 不把audit/log/metric/span/report/evidence candidate作为capability access truth。
- 不新增`TC-*`或正式`EV-*`；所有专项使用Step 6既有canonical case与`EVC-CH-*` candidate。

## 2. SOP 五问回答

| 问题 | 设计结论 |
|---|---|
| 1. 哪些性能指标必须验证？ | 必须验证核心read/change不调用外围增强、派生/协作延迟不阻断本地truth、性能压力不绕过UoW/idempotency/trace；每次运行采集duration/count/call-count/status但当前没有numeric pass阈值。 |
| 2. 哪些安全和边界红线负向测试？ | 禁止正文/secret/private ref、safe summary越权、formal exposure绕过governance、access review冒充approval，以及runtime/tools execution、method body、marketplace listing、provider route/cost、SDK client/cache等责任吸收全部阻断。 |
| 3. 哪些一致性和恢复场景故障注入？ | 22 TX全量，含begin/save/commit Durable/NotDurable/Unknown/rollback、CAS/unique/race、duplicate/result corruption、cursor/index、Outbound A/B/C、Job target/final crash、shutdown与cleanup。 |
| 4. 哪些日志、指标和审计证据必须存在？ | formal 60/48/27+3/20 profile中适用row必须按exact owner/terminal生成safe projection；Off为零调用，Redacted禁止正文；business carrier/result不因observer成败变化。 |
| 5. 阈值来自哪里？ | hard semantic/count thresholds来自formal 00~04 exact invariants/cardinality；numeric performance threshold当前不存在，旧数字已被formal 00明确排除，只采样不判定。 |

## 3. 当前问题诊断、改动前后与取舍

### 3.1 问题诊断

| 问题 | 风险 | 本步处理 |
|---|---|---|
| NFR描述为结构性语义 | 被误解为不可测试 | 转译成call-count、write-set、state/ref/version、typed failure与profile presence硬oracle |
| historical性能数字仍可能回流 | 无来源门槛伪造失败或通过 | 建立明确denylist和controlled-reopen条件 |
| 189 functional cases可能只测结果 | NFR truth/security属性未证明 | 为每类专项绑定zero-effect、fault、redaction、provenance断言 |
| 可观测性既要求存在又禁止正文 | 只扫泄漏会遗漏缺失 | 同时检查required presence、exact profile、forbidden material和business neutrality |
| recovery可能被写成自动修复 | consistency defect被掩盖 | 每故障固定可恢复/不可安全terminalize/需人工三类结论 |
| selected产品未选 | 误把P1不可用算P0通过 | P0用controlled harness，P1 unavailable保持blocked |

### 3.2 改动前后

| 维度 | Step 10前 | Step 10后 |
|---|---|---|
| NFR覆盖 | 20条有cut family方向 | 20条有exact suite/case、方法、环境、oracle与candidate来源 |
| 性能 | 无旧数字、只有结构性目标 | 数字采样与结构性blocking判定分离 |
| 安全 | case中分散负向断言 | forbidden material/ownership/governance/exposure综合专项 |
| consistency/recovery | 22 TX与Job/Outbound cases | fault point到terminal/reentry/prohibited repair矩阵 |
| observation | 12 OBS cases | required presence、cardinality、redaction、neutrality、artifact scan闭环 |
| evidence | EVC candidates分散 | 专项聚合仍回指同一canonical raw result，不产生新EV |

### 3.3 设计取舍

| 方案 | 裁决 | 理由 |
|---|---|---|
| 继承旧P95/SLA | reject | formal 00明确排除，无现行source/baseline |
| 性能完全不测 | reject | 结构依赖、zero peripheral call和完整性优先可硬判定 |
| 先采样并标记pass | reject | sample没有baseline不能形成numeric verdict |
| sample字段mandatory、数值not_evaluated | accept | 为未来baseline留真实输入且不伪造阈值 |
| 真实产品故障演练作为P0 | reject | 产品未选，P0 contract semantics由controlled harness证明 |
| 只扫report做redaction | reject | 泄漏可发生在raw artifact/stdout/stderr |
| observer缺失视为可选 | reject | formal profile声明为required的row必须可定位 |

## 4. 六类专项总矩阵

| 专项 ID | NFR | 风险 / 指标 | 方法 | P0环境 | 阈值 / 通过条件 | Primary suite / cases | Candidate source |
|---|---|---|---|---|---|---|---|
| `NF-CH-PERF-01` | 001 | 基础read被外围增强阻断 | delayed/failed peripheral Port + call graph/write audit + duration sample | CI deterministic/integration controlled | search/export/ecosystem/SDK-enhancement calls=0；typed read terminal；sample fields present | service-command-query / Q01..23,29..33 | same ordinal `EVC-CH-QUERY-*` |
| `NF-CH-PERF-02` | 002 | 延迟压力绕过truth完整性 | timeout/race at save/commit/collaboration + exact UoW assertion | recovery controlled | UoW/idempotency/version/trace不被绕过；无numeric latency verdict | repository-transaction / TX01..22 | `EVC-CH-TX-*` |
| `NF-CH-PERF-03` | 003 | derived/maintenance输出阻塞core | freeze Q24..28/J01..07/O09 dependencies while core C/Q executes | integration/recovery | core terminal独立；derived core-write=0；duration sampled only | service-command-query + jobs-lifecycle + outbound | corresponding candidates |
| `NF-CH-AVAIL-01` | 004 | 外围增强失效拖垮C1~C5 | all peripheral Disabled/unavailable/failure permutations | integration controlled | core truth仍exact readable/decidable；无synthetic derived success | service-command-query/runtime-binding/configuration | corresponding candidates |
| `NF-CH-AVAIL-02` | 005 | upstream延迟产生假结论 | source/governance/method/secret/audit resolver timeout/unavailable | integration/recovery | exact pending/unresolved/unavailable/error；approval/relation/descriptor fabrication=0 | inbound/service/runtime-binding | corresponding candidates |
| `NF-CH-AVAIL-03` | 006 | collaboration/downstream延迟反写truth | Outbound B/C failure and downstream unavailable | recovery controlled | Phase A Durable truth byte/version unchanged；delivery truth local rows=0 | outbound-collaboration + repository-transaction | O01..10/TX17..20 candidates |
| `NF-CH-SEC-01` | 007 | forbidden body/ownership enters store/output | forbidden corpus across codec/domain/service/repo/observer/artifact | CI/integration/release scan | accepted forbidden material count=0；finding不回显材料 | static/domain/service/observability/configuration | relevant candidates |
| `NF-CH-SEC-02` | 008 | safe summary/ref becomes upstream truth | mutate summary/ref then assert owner state and no external lifecycle | CI deterministic | only body-free ref/summary changes；secret/provider/governance/method truth writes=0 | domain-state + service-command-query | CMD11..15/Q08..13/STATE05..08 candidates |
| `NF-CH-SEC-03` | 009 | formal exposure bypasses prerequisite | all governance/descriptor/registry/reference state permutations | CI deterministic | formal-visible/consumable only exact eligible pairs；all others blocked/degraded | domain-state + service-command-query | CMD18..21/Q15..19/STATE07,09,10,14 candidates |
| `NF-CH-SEC-04` | 010 | review fact becomes approval | review positive/negative plus governance seam differential | CI deterministic | access review changes review/identity trace only；approval/policy/shared_rules writes=0 | service-command-query + domain-state | CMD04,13..15/Q12/STATE02,07 candidates |
| `NF-CH-TRACE-01` | 011 | key changes not explainable | accepted/no-op/rejected Command and Outbound trace/capture symmetry | CI/recovery | source/scope/impact/trace/current-result exact；rejected success trace=0 | service/outbound/domain | corresponding candidates |
| `NF-CH-TRACE-02` | 012 | cross-owner refs lose context or absorb body | six inbound/reference queries and reference-state matrix | CI/integration | exact kind/subject/state/source; body bytes=0; owner explainable | entry-inbound + service + domain | corresponding candidates |
| `NF-CH-TRACE-03` | 013 | derived/job output lacks source/scope/result | Q24..28/O09/J01..07 and final report formations | recovery controlled | source versions, frozen scope, per-target/final result explicit；truth repair=0 | jobs/outbound/service/domain | corresponding candidates |
| `NF-CH-CONS-01` | 014 | duplicate identity/registry truth | duplicate/race/replay/commit unknown/digest permutations | CI/recovery | one winner, stable digest, stored replay, second truth=0 | repository-transaction + domain-state | TX08..16,22/STATE01,03,20 candidates |
| `NF-CH-CONS-02` | 015 | undeclared actor mutates formal truth | all Query/Inbound/Job/derived/output mutation audit | CI/recovery | only declared Commands change formal objects；all prohibited writes=0 | service/entry/jobs/outbound | corresponding candidates |
| `NF-CH-CONS-03` | 016 | stale/partial state silently reconstructed | stale/partial/unavailable/corrupt sidecar differential | CI/recovery | explicit state or consistency defect；fallback/rebuild/current-truth reconstruction=0 | service/domain/repository | corresponding candidates |
| `NF-CH-CONS-04` | 017 | consumers establish second exposure truth | runtime/tools/SDK ref and formal boundary read/output negative | CI/integration | one server exposure semantic；consumer truth writes/cache authority=0 | service/outbound/domain | corresponding candidates |
| `NF-CH-OBS-01` | 018 | core state/change/boundary not identifiable | exact 60/48/27+3/20 profile parameter matrix | CI/integration | every declared applicable profile one exact owner/terminal projection; undeclared=0 | observability-redaction | OBS01..04,09,11,12 candidates |
| `NF-CH-OBS-02` | 019 | dependency/collaboration/job failure indistinguishable | typed failure injections across inbound/outbound/jobs/Ports | integration/recovery | exact safe error/phase/owner/terminal category observable; no cancellation rewrite | entry/outbound/jobs/runtime/observation | corresponding candidates |
| `NF-CH-OBS-03` | 020 | observer becomes truth/body store | Off/Redacted differential, redactor/sink failure, cross-plane source audit | CI/integration/release scan | business result/carrier/write-set byte-equivalent；forbidden material=0；observer-sourced decision=0 | observability-redaction + configuration | OBS04..12/CONFIG16 candidates |

Count audit: `3 performance + 3 availability + 4 security + 3 trace + 4 consistency + 3 observability = 20` exact NFR owners.

## 5. 性能专项：结构性门禁与数值采样分离

### 5.1 Current authoritative threshold classes

| Threshold class | Source | Blocking? | Examples |
|---|---|---|---|
| exact structural count | formal 03/04 | yes | one UoW authority, zero peripheral calls on core read, 22/110 repository parity, 9/14 external calls, 6 sources, 10 routes |
| semantic integrity | formal 00/03 | yes | no latency optimization may omit trace, version, idempotency, state or zero-effect oracle |
| bounded config validity | formal 04 catalog | yes | configured timeout/retry/batch/parallel values satisfy exact type/range and frozen-root rules |
| measurement presence | Step 9 raw schema | yes when suite runs | duration, item/count/call-count, profile/entry, terminal status and sample context are present |
| numeric latency/throughput/SLA | no active source | no verdict | collected value remains `not_evaluated` against numeric target |

### 5.2 Required performance measurements

| Operation family | Sample fields | Structural oracle | Numeric status |
|---|---|---|---|
| core Queries Q01..23,29..33 | duration, repository/Port call counts, page/item count, profile/entry, result kind | undeclared peripheral calls=0; Query writes=0; exact result remains complete/degraded by design | `not_evaluated` |
| Commands C01..26 | duration by pre-UoW/UoW/post-commit phase, method counts, staged object count | exactly one formal UoW family; trace/result/capture not skipped | `not_evaluated` |
| Inbound I01..06 | header/decode/dispatch/terminal durations and call counts | invalid header decode/dispatch=0; accepted owned invocation terminalizes | `not_evaluated` |
| Outbound O01..10 | Phase A/B/C durations, attempt/result class | Phase B duration/failure never mutates Phase A truth | `not_evaluated` |
| Jobs J01..08 | planning/target/final durations, target counts, terminal distribution | frozen plan and ordinal target journal; deadline does not cancel owned run | `not_evaluated` |
| assembly/entry | V0~V8 and Stage 0~7 durations, cleanup count | no partial graph/root/entry exposure; original failure precedence | `not_evaluated` |

Historical denylist:

| Historical value | Current disposition |
|---|---|
| `QueryCapabilities P95 < 50ms` | excluded; old object/operation and no current baseline |
| policy propagation / refresh `< 30s` | excluded; Hub does not own Policy refresh |
| SLA `99.9%` | excluded; no selected deployment topology/SLO source |
| cost coverage `100%` | excluded; provider cost is outside ownership |
| any inferred P95/P99/throughput from one run | forbidden as acceptance threshold |

Numeric threshold controlled reopen requires a named owner, selected environment/profile/entry/topology, workload/data distribution, warmup/sample method, percentile/window, resource envelope, failure budget, formal `00/05/06/07/09` impact review and user confirmation.

## 6. 可用性与隔离专项

| Failure domain | Injection | Required available/degraded behavior | Forbidden effect | Suite/cases |
|---|---|---|---|---|
| search/browse/export/ecosystem/SDK explanation | delayed/unavailable/failed | core identity/registry/descriptor/seam/relation/exposure read and declared mutation remain executable | core terminal depends on peripheral result; derived result becomes truth | service/jobs |
| external source resolver | timeout/unavailable/invalid return | typed unresolved/unavailable/quarantine/consistency behavior by exact flow | synthetic identity/descriptor/reference truth | inbound/runtime |
| governance reference | unavailable/expired/forbidden | seam/exposure remains pending/unavailable/blocked as defined | approval or policy synthesis | service/domain |
| method asset ref | unresolved/unavailable/invalid | body-free relation remains explicit or mutation rejects | method body/source lookup or lifecycle ownership | service/domain |
| secret/audit/document ref | unavailable/forbidden | safe ref state/summary only or exact rejection | secret/audit/document body fallback | service/runtime |
| event collaboration | timeout/temporary/permanent/invalid response | local Durable truth and capture remain; exact outcome/failure | rollback/delete local truth or local delivery status fabrication | outbound/TX |
| runtime/tools/SDK/product consumer | unavailable/delayed feedback | server exposure truth unchanged; impact/ref state only where declared | consumer cache/execution state as Hub truth | service/outbound |
| observer sink | redactor reject/sink fail/off | business bytes, write-set, terminal and retry behavior unchanged | observer failure cancellation/rollback/retry | observation/config |

P0 demonstrates these semantics with deterministic Fake/Controlled/Disabled dependencies. It does not claim a production availability percentage or disaster-recovery capability.

## 7. 安全与责任边界专项

### 7.1 Forbidden-material corpus and sinks

| Material class | Injection surfaces | Sinks scanned/asserted | Hard oracle |
|---|---|---|---|
| secret/token/password/key/cert/trust body | config/env/provider response/DTO/adapter error | object/repository/event/log/metric/span/audit/raw artifact/report/stdout/stderr | accepted/emitted body count=0 |
| MCP/A2A/API request/response/provider body | descriptor/inbound/resolver/collaboration | protocol/domain/store/snapshot except declared bounded immutable event bytes, observer/report | no public/domain body field or reconstructed payload; snapshot only exact declared event contract |
| governance approval/Policy/shared_rules body | review/seam/inbound/query | review/seam/store/event/report | only body-free ref/safe summary; approval truth writes=0 |
| method source/body/lifecycle | relation/inbound/query/job | relation/store/view/export/report | only method asset ref and body-free relation |
| runtime/tools execution/body/state | consumer ref/feedback/query | exposure/view/store/event/report | only consumer ref/impact; execution truth writes=0 |
| marketplace listing/transaction | ecosystem summary/input/query | projection/store/event/report | read-only summary/ref only; listing truth=0 |
| provider route/cost/failover/quota | descriptor/config/query | descriptor/store/output/report | route/cost truth fields and lifecycle=0 |
| SDK client/package/cache | exposure/ref/query/output | Hub store/view/report | server boundary/ref only; client/cache authority=0 |
| observability/audit backend body | audit ref/export/observer failure | Hub store/report/fallback | ref/safe projection only; backend body=0 |

### 7.2 Exposure and governance differential

| Input pair | Expected distinction | Veto condition |
|---|---|---|
| access review Recorded vs governance seam Active | review is traceable local fact; only seam can satisfy governance prerequisite | review alone yields formal visible/consumable |
| descriptor Accepted vs Unresolved | only policy-complete exact state may advance relevant exposure route | unresolved treated as complete |
| seam Unresolved/Expired/Forbidden vs Active | non-active states remain explicit and block/degrade | fallback Active or omitted prerequisite |
| method relation Active/Unresolved/Removed | exact route uses current eligible state only | method body lookup or terminal resurrection |
| formal visibility applicable vs consumer merely referenced | typed applicability decides | ref existence used as authorization |
| safe summary Available/Partial vs absent | exact completeness semantics preserved | absent treated as low risk/default safe |

Security scan is release-blocking and must include raw artifacts and generated reports. A finding contains material class and source location/digest only, never the matched secret/body.

## 8. 审计、追溯与派生来源专项

| Subject | Accepted-path required chain | Rejected/no-op requirement | Derived/output requirement |
|---|---|---|---|
| identity | source/context -> identity -> ordered change -> trace -> result/capture | no success change/trace/capture; exact no-op effects=0 | derived refs retain exact identity/version |
| registry | identity -> registry lifecycle/basis -> change/trace/result | stale/illegal/terminal leaves winner unchanged | search/browse does not become current registry source |
| descriptor/safe summary | registry -> descriptor/summary -> ordered changes/capture | forbidden body and invalid predecessor produce no accepted chain | view/export carries body-free source versions |
| governance seam | exact identity + governance ref/source -> seam/history | review fact never substitutes seam | visibility can explain exact seam source only |
| method relation | identity + method asset ref -> relation/history | body/source lifecycle reads=0 | trace/view keeps body-free relation ref |
| exposure/visibility | registry/descriptor/seam/relation prerequisites -> exposure/visibility change | incomplete prerequisite yields no formal-visible success | consumer view source exposure/version exact |
| collaboration | local source/change/snapshot/capture -> external outcome -> optional stable intent bind | Phase B failure never erases local chain | no local external delivery truth row |
| Job/derived | frozen plan -> ordinal target journal -> final result/report | unsafe control-plane failure remains nonterminal/error | source scope/version/result/ref subset explicit |

Auditable means the typed local chain is reconstructable from formal repositories and body-free carriers. It does not require or claim an external audit-store record.

## 9. Consistency, concurrency and recovery fault matrix

| Fault family | Exact injection points | Required terminal/recovery | Forbidden recovery | Primary cases |
|---|---|---|---|---|
| begin/load/save | UoW begin; each repository load/save | typed failure, zero durable mutation, original owner retained | partial commit, fallback authority, generic success | TX01..04 |
| commit Durable | after complete staged set | exact accepted carrier and post-commit eligibility | pre-Durable event/observer acceptance | TX05 |
| commit NotDurable | after staging | no durable effect/accepted carrier | success/result/capture projection | TX06 |
| commit Unknown | mutation families and post-commit boundary | resolve exact transaction/idempotency/truth before retry; unresolved stays typed | blind retry, overwrite winner, inference from observer | TX07,11,19,20 |
| rollback/cleanup | rollback and reverse cleanup at every owned prefix | original failure + ordered typed cleanup causes | cleanup overwrites/erases original, hidden survivor | TX04, CONFIG09, BIND10 |
| duplicate/replay | same key/digest/result; wrong digest/kind/missing result | stable stored replay or exact consistency/idempotency error | current-truth recomputation, second mutation | TX08..13 |
| race/CAS/unique | same/different key concurrent writers | at most one winner; loser observes exact conflict; winner unchanged | last-write-wins or merge invention | TX09,10,15,19 |
| corrupted sidecar/index/cursor | owner/version/current/index/page asymmetry | exact `ConsistencyDefect`/invalid cursor; prior state unchanged | scan/sort/first-row guess/auto repair | TX14,16,21 |
| Outbound A/B/C | each source/snapshot/capture/collaborate/bind point | A atomic, B external and nonrollback, C one stable bind | local delivery status/queue, second capture, truth rollback | TX17..19/O01..10 |
| Job initial/target/final | reserve/plan, each effect+journal, collaboration, final result/report/complete | independently recoverable exact ordinal; only safe known target terminalization | rescan/replan/reexecute committed target, fabricate report | TX20/J01..08 |
| canonical digest | domain/frame/map order/excluded metadata/codec faults | same semantics stable; domain/business delta separates | Debug/Display/raw body/fallback hash | TX22/FOUNDATION15 |
| startup/shutdown | each Stage/start/spawn/barrier/stop/drain/join point | complete prefix disposal; owned invocation reaches terminal | detached task, partial graph, failure flattening | BIND01,06,09,10/CONFIG09,10 |

All exact cases are main-blocking. Nightly expands deterministic schedules/permutations but cannot supply a missing main canonical result.

## 10. 可观测性与审计投影专项

### 10.1 Exact inventory checks

| Plane | Formal inventory | Required validation | Hard failure |
|---|---:|---|---|
| structured log | 60 profiles | exact owner/event/terminal/level/safe-field selector; required vs optional source semantics | missing/duplicate/undeclared profile or forbidden field |
| metric | 48 profiles = 34 counter + 12 histogram + 2 gauge | exact selector/unit/value and closed low-cardinality labels | dynamic/free-text/full-ref/secret labels or wrong kind |
| span | 27 profiles | exact lifecycle, terminal, parent/current/historical links | synthetic/partial link, caller cancellation rewrite |
| fixed event | 3 | only formally declared fixed event and source | event synthesis from another plane |
| durable projection | 20 profiles | exact Durable carrier, owner/ref/version symmetry | request-local/NotDurable/Unknown emission |
| count readers | 11 = 4 inbound + 6 jobs + 1 conditional audit | exact reader-owned nonnegative count and absence rule | private wrapper/list reconstruction |

### 10.2 Mode and failure differential

| Scenario | Business side | Observation side | Pass condition |
|---|---|---|---|
| Off | exact baseline result/carrier/write/call order | profile selection, field construction, redactor, sink and violation calls all 0 | business baseline byte/semantic equality |
| Redacted valid | same business baseline | exact safe projections where profile applies | no forbidden material and exact profile identity |
| required field missing/forbidden | same business baseline | whole affected emission omitted/rejected as defined | no partial required emission or fallback body |
| optional field missing | same business baseline | optional field absent | no null/placeholder/synthetic value |
| atomic correlation incomplete | same business baseline | whole correlation group absent | no partial group |
| redactor/sink failure | same business baseline | at most one safe nonrecursive fallback where defined | no retry/rollback/cancel/state mutation |
| four-plane coexistence | same business baseline | each plane sources same formal carrier independently | no plane-to-plane sourcing or missing-plane synthesis |

The future `check_redaction.sh` scans all suite/check raw outputs, logs and reports. Profile assertions prove required presence; scanning alone is insufficient.

## 11. Configuration and dependency non-functional gates

| Risk | Method | Hard pass condition | Cases/check |
|---|---|---|---|
| strict source/parser drift | malformed/unknown/duplicate/null/coercion/precedence corpus | exact stage rejection; later calls=0; no lower-source fallback | CONFIG01..04 |
| graph/family/Missing drift | orphan/cycle/wrong family/Missing vs Disabled matrix | complete graph only; Missing rejects; Disabled exact `NotConfigured` | CONFIG05..07 |
| sensitive material | controlled provider failures and forbidden output scan | fail closed; raw material output=0; no fake fallback | CONFIG08 |
| partial activation | V0~V8, Stage 0~7 and API/Worker/Jobs barrier faults | partial graph/listener/task/facade exposure=0; cleanup complete | CONFIG09..11 |
| runtime retry/failure drift | every 9-Port/14-call phase/kind/effect proof | only exact temporary/timeout + formal safety proof may bounded-retry | CONFIG12..14/BIND09 |
| frozen root/drift | mutate artifact/ref/material after activation | active root unchanged; new candidate validates independently | CONFIG15 |
| observer failure | Off/Redacted forbidden/redactor/sink differential | business output unchanged; forbidden output=0 | CONFIG16 |
| dynamic control leakage | scan/admin/watch/hot-reload inputs | unsupported surface count=0 or exact rejection | CONFIG17 |
| rollback eligibility | unsafe prior credential/TLS/digest/profile target | reject unsafe target; no cutover claim | CONFIG18 |
| dependency direction | manifests/imports/public types | only declared sibling `core-contracts` compile candidate; forbidden sibling compile edges=0 | FOUNDATION08..10/BIND12 + dependency check |
| public documentation | future source scanner | complete English `///` on every declaration, struct field, enum variant/payload, trait/method/callable; enum struct-variant fields have no field-level `pub` | FOUNDATION11 + Rustdoc check |

## 12. NFR-to-suite/gate coverage

| NFR range | Primary suites | Secondary confidence | Main blocking | Release handoff |
|---|---|---|---|---|
| 001..003 | service-command-query, repository-transaction, jobs-lifecycle | entry/outbound/runtime samples | structural oracle and sample presence | report values remain numeric `not_evaluated` |
| 004..006 | service, entry, outbound, jobs, runtime-binding | configuration fault matrix | yes | unavailable/product gaps explicit |
| 007..010 | static/domain/service/observation/config | responsibility/redaction/Rustdoc checks | yes | redaction and responsibility checks veto |
| 011..013 | service/domain/outbound/jobs | suite/report pairing | yes | candidate index preserves raw provenance |
| 014..017 | domain/service/repository/outbound/jobs | nightly schedules | yes, including all canonical TX | no secondary run compensates main |
| 018..020 | observability-redaction + entry/outbound/jobs/runtime/config | release redaction/report checks | yes | exact inventory + safe reports required |

P1 selected durable/provider/observer parity is additional confidence. `blocked_dependency` remains a selected/release incompleteness and does not alter the P0 semantic result.

## 13. 专项停审与跨专项审计

### 13.1 Per-specialty stop review

| Specialty | Source completeness | Method/environment/oracle | Candidate provenance | Conclusion |
|---|---|---|---|---|
| performance | NFR 001..003 exact | structural hard gate + mandatory sample; no fake numeric threshold | existing TC raw results | pass-designed |
| availability | NFR 004..006 exact | controlled delayed/unavailable/failure + truth isolation | existing candidates | pass-designed |
| security | NFR 007..010 exact | forbidden corpus, differential and responsibility scan | existing candidates | pass-designed |
| traceability | NFR 011..013 exact | accepted/rejected/derived chain audit | existing candidates | pass-designed |
| consistency | NFR 014..017 exact | 22 TX plus flow/state/write audit | existing candidates | pass-designed |
| observability | NFR 018..020 exact | exact profile presence + redaction + neutrality | existing candidates | pass-designed |

### 13.2 Cross-specialty audit

| Audit item | Result | Gap / disposition |
|---|---|---|
| NFR IDs | 20 expected / 20 mapped / missing 0 / duplicate primary 0 | six categories exact |
| acceptance directions | AC-CH-033..037 all have specialty inputs | formal decision deferred to 06 |
| historical numeric leakage | 0 active threshold | five excluded examples retained as denylist |
| structural performance gate | present | numeric values remain not_evaluated |
| security ownership families | forbidden body + seven responsibility families covered | no positive out-of-scope E2E |
| transaction/recovery | 22/22 canonical TX present | nightly adds schedules only |
| observation inventories | 60/48/27+3/20 and 11 readers exact | no generic profile |
| config failure | 18/18 represented | no dynamic fallback/control |
| P0 automation | all specialties use Step 9 blocking suites/checks | manual-only NFR gap=0 |
| evidence identity | only existing `EVC-CH-*` candidates | no formal EV or aggregate fake evidence |
| product/environment claim | 0 | selected numeric/product parity remains blocked prerequisite |
| upstream contradiction | 0 | no writeback/blocker |

`pass-designed` is a design stop-review status only. No benchmark, suite, environment, scan, sample, report or non-functional result is claimed to exist.

## 14. Upstream impact, formal fill draft and Step 11 gate

### 14.1 Upstream impact and controlled reopen

| Conclusion | Upstream impact | Disposition |
|---|---|---|
| all 20 NFR translate to existing exact oracles | none | no formal 00~04 writeback |
| no active numeric performance threshold exists | none | preserve formal 00 decision; record residual in Step 14 |
| P0 controlled harness can prove semantics | none | product selection remains downstream prerequisite |
| future numeric SLO requested | controlled reopen | reopen formal 00 §13, 05 Steps 7~10/14, 06, 07 and 09 with workload/topology owner |
| future selected product becomes P0 | controlled reopen | reopen environment/config/gate/acceptance scope |

Current writeback / blocking confirmation / unresolved upstream blocker = `0 / 0 / 0`.

### 14.2 Formal `05` §10 fill draft

Formal §10 must include:

- 20 NFR across six specialties with exact method/environment/oracle/suite/candidate source;
- structural performance hard gates and mandatory samples separated from absent numeric thresholds;
- availability isolation, forbidden-material/security/governance differential and responsibility boundaries;
- accepted/rejected/derived trace chains;
- 22-TX concurrency/recovery fault matrix and prohibited repair behaviors;
- exact observation inventories, Off/Redacted and observer-neutrality tests;
- 18 configuration failure and dependency/Rustdoc gates;
- per-specialty and cross-specialty audits, plus truthful `not_evaluated` numeric status.

Formal `05-测试方案.md` remains historical material until Step 15.

### 14.3 Step 11 entry gate

| Condition | Status | Basis |
|---|---|---|
| all 20 NFR have a P0 verification method | pass-designed | §§4,12~13 |
| performance has no unsupported hard number | pass-designed | §5 historical denylist |
| security/consistency/recovery/observation redlines are blocking | pass-designed | §§7,9~11 |
| evidence remains candidate-only and raw-derived | pass-designed | §§4,12~13 |
| no unresolved upstream conflict exists | pass-designed | §14.1 |

Next allowed action: read Test Plan SOP/writing-standard Step 11, this Step 10, Step 9 failure semantics and formal `00` acceptance/veto direction; then create `05_test_plan_step_11_defects_retest.md` without modifying formal `05`.
