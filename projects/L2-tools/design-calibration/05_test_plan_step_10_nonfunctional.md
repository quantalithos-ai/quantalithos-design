# L2-tools 05 测试方案 · Step 10 专项测试与非功能验证

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 10「设计专项测试与非功能验证」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §10
>
> 直接输入：`00_req_step_13_non_functional_requirements.md`、`03_ddd_step_15_observability_audit.md`、
> `03_ddd_step_16_test_cuts.md`、Step 6/8/9 中间产物。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 10 / 设计专项测试与非功能验证 |
| 状态 | `accepted_for_step_10 / proceed_to_step_11` |
| 当前模块 | `specialized_and_nonfunctional_validation` |
| 本步结论 | 性能/可用性结构性口径、安全红线、一致性与恢复、并发幂等、观测审计、配置失效和依赖边界均有验证方法与 P0 阻断条件；无未经 authority 的数字阈值。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | Step 11 缺陷管理与复验规则。 |

### 1.1 Step 内计划

- [x] 读取 00 NFR、03 事务/错误/并发/观测契约和 Step 6/9 用例门禁。
- [x] 形成性能、可用性、安全、一致性/恢复、观测/审计专项矩阵。
- [x] 固定专项环境、fixture/fault injection、断言和 candidate EV 方向。
- [x] 明确无量化 authority 时的 sample-only 口径和 P1/P2 条件边界。
- [x] 完成专项到 suite/TC 的映射与跨专项审计。

## 2. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些性能指标必须验证？ | 当前只验证核心合同/读取/前置判断不被外围增强阻塞、核心正确性不被优化牺牲，并采集可追溯 duration/count sample；不定义 P95/P99/QPS/SLA。 | `NFR-L2T-001~003`；`00` §13 |
| 哪些安全红线必须负向测试？ | forbidden body/secret/full ref、self-authorization、sandbox host bypass、Hub registry copy、downstream reverse write、fake-as-ready、unsafe config override、phase/unknown retry。 | `NFR-L2T-007~010`、`VF-L2T-001~013`、`NC-L2T-001~025` |
| 哪些一致性/恢复场景需要故障注入？ | UoW stage/commit known/unknown、outcome-audit half pair、stale CAS、semantic duplicate/conflict、Prepared/call unknown、projection stale、Job partial、late material 和 missing replay surface。 | `03` §10~§13；`TC-L2T-TX-*`、`TC-L2T-CONC-*`、`TC-L2T-ERR-*`、`TC-L2T-JOB-*` |
| 哪些日志/指标/审计证据必须存在？ | structured safe log、closed low-cardinality metric、TraceContext/span、ToolAuditEntry pair、typed error/gap/ref、Query/Job no-write markers 和 redaction scan；不要求 Observability store 已闭口。 | `03` §14、`OBS-001~009` |
| 阈值来自哪里？ | 只有未来正式负载模型、测量对象、部署 profile 和 evidence authority 可提供数字阈值；当前按可判定行为和 sample completeness 设计。 | `NFR-L2T-*`、`L2T-UP-006~007` |

## 3. 当前诊断与专项取舍

| 历史/当前问题 | 处理 |
|---|---|
| 旧文档把 `100%`、`99.9%`、固定毫秒和事件覆盖率当作当前 NFR | 标记为 `historical_material`；不进入 P0 threshold 或通过分母。 |
| 只做 happy-path 性能 benchmark | 拒绝；性能专项必须同时验证 Query no-write、Job bounded/no-repair、外围隔离和正确性红线。 |
| 把日志存在当作业务事实 | 拒绝；日志/指标/trace 只证明观测契约，ToolAuditEntry 和 local outcome 仍由本地 UoW oracle拥有。 |
| provider positive unavailable 时跳过整个安全/恢复专项 | 拒绝；negative/blocked/unknown 和 local truth first 仍在 `ci-test` 完成。 |
| 用加密/哈希 raw body 作为安全例外 | 拒绝；forbidden body 不能进入任何 surface，摘要也必须遵守 redaction floor。 |

## 4. 专项测试矩阵

| 专项 ID | 指标/风险 | 方法与故障注入 | 环境 | 阈值/通过口径 | 主 suite / candidate EV |
|---|---|---|---|---|---|
| `NFS-PERF-01` | 核心读取/判断被外围阻塞 | 对 QF、合同/Binding读取和 CF-09 前置判断分别开启/关闭 search/diff/job/event/observer peripheral；记录 duration/count 和 dependency call journal | `ci-test`、`integration-like` | 核心 surface 可独立完成或显式收束；无 numeric pass；必须有完整 sample 和无外围隐式调用 | `query-purity`、`local-closure`;`EV-CAND-L2T-NFR-AVAIL-001` |
| `NFS-PERF-02` | 优化绕过正确性/安全 | 对 page/batch/parallelism/retry candidate 做 bounded variation；比较 state/error/key/digest/redaction parity | `ci-test` | 任何变体不得改变 BR/NC/phase/no-write/result-error XOR；duration 仅趋势输入 | `transaction-concurrency`、`config-assembly`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-AVAIL-01` | 外围/下游失败拖垮核心 | scripted Bus/Obs/SDK/optional feature unavailable；读取和本地 outcome/audit 先行 | `ci-test`、`integration-like` | local truth 可读或显式 degraded；不回滚/覆盖；外部状态独立 gap/ref | `application-core`、`observability-redaction`;`EV-CAND-L2T-NFR-AVAIL-001` |
| `NFS-AVAIL-02` | Hub/Auth/Sandbox 必要输入缺失 | blocked/stale/conflicting/unverifiable Port scripts；检查 no-execution/awaiting/fail-closed | `ci-test`、`integration-like` | 受影响路径保守收束；不 default allow、host bypass、run/receipt 推断 | `application-core`、`controlled-seam`;`EV-CAND-L2T-NFR-AVAIL-001` |
| `NFS-SEC-01` | forbidden body/secret 泄露 | dummy raw request/prompt/capture/provider/credential/full-ref corpus 贯穿 carrier、error、log、metric、audit、report、material 全面扫描 | `ci-test`、release check | scan clean；任何泄露 P0 veto；失败输出只含 safe issue/ref | `observability-redaction`、`config-validator`;`EV-CAND-L2T-NFR-SEC-001` |
| `NFS-SEC-02` | self-auth/host/direct/provider truth 越界 | 注入 authorization missing、Sandbox-required、Hub blocked、fake health marker、local registry candidate | `ci-test`、`integration-like` | fail-closed/no-host/no-local-registry；不产生 accepted/executed/ready | `static-boundary`、`application-core`;`EV-CAND-L2T-NFR-SEC-001` |
| `NFS-SEC-03` | safe handoff 四门失守 | 分别破坏 minimal/body-free/redacted/correlated，检查 eligibility/material/Port zero surface | `ci-test` | 任一门失败即 Ineligible/Unverifiable；无 material/Port | `contract-domain`、`application-core`;`EV-CAND-L2T-NFR-SEC-001` |
| `NFS-CONS-01` | outcome/audit pair 非原子 | UoW 在两条写入之间故障；读取 half pair、commit unknown、replay missing | `ci-test` | 同 UoW 成对；half/missing 为 IntegrityFailure/unknown，不补写/重算 | `transaction-concurrency`、`query-purity`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-CONS-02` | duplicate/key/digest 分叉 | same key/same digest、same key/different digest、semantic equal/divergent、consumer/job duplicate | `ci-test` | exact stored replay 或 typed conflict；无第二 truth/Port call | `application-core`、`transaction-concurrency`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-CONS-03` | late material 改写历史 | terminal outcome、binding/invocation anchor、handoff attempt 后注入 late source/status/gap | `ci-test`、`integration-like` | 只 append assessment/ref/gap；既有 terminal/attempt immutable | `application-core`、`controlled-seam`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-REC-01` | phase/unknown 误重试 | Prepared marker、call crossing boundary、SubmissionOutcomeUnknown、CommitOutcomeUnknown、stale phase-2 CAS | `ci-test`、nightly | one call；manual/resolve marker；无 generic retry/second call | `application-core`、`transaction-concurrency`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-REC-02` | bounded Job 失控/修复 | per-target success/failure、cursor/watermark stale、report write fault、duplicate Job | `ci-test`、nightly | bounded Partial/Blocked/Failed report；保留 refs；无 whole scan/replan/core repair | `entry-worker-job`、`transaction-concurrency`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-REC-03` | projection/reference/status recovery 越界 | stale/rebuilding/unavailable/failed projection、missing authority、status conflict | `ci-test`、integration-like | Query zero-write；Job only report/projection/gap；不补 core truth | `query-purity`、`entry-worker-job`;`EV-CAND-L2T-NFR-AVAIL-001` |
| `NFS-CONC-01` | mutable CAS race | two writers same loaded version、successor uniqueness、terminal overwrite race | `ci-test`、nightly | one CAS winner；loser typed conflict；history/terminal unchanged | `transaction-concurrency`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-CONC-02` | handoff/consumer re-entry race | duplicate envelope, IF-03 only formal re-entry, Prepared replay, feedback duplicate | `ci-test`、integration-like | claim/receipt/attempt replay；IF-03 only CF-11 re-entry；no second side effect | `entry-worker-job`、`controlled-seam`;`EV-CAND-L2T-NFR-CONS-001` |
| `NFS-OBS-01` | structured log/metric/trace contract | each command/query/consumer/job/Store/UoW/Port/config branch; missing metadata and unknown/error variants | `ci-test` | required safe fields and phase/error/state present；TraceContext only metadata-derived | `observability-redaction`;`EV-CAND-L2T-NFR-OBS-001` |
| `NFS-OBS-02` | low-cardinality / owner separation | vary actor/subject/request/key/body/provider/status; inspect labels and source refs | `ci-test` | labels closed enums only；no body/high-cardinality；owner/error/status distinguishable | `observability-redaction`;`EV-CAND-L2T-NFR-OBS-001` |
| `NFS-OBS-03` | local truth first | local outcome/audit known/unknown + Bus/Obs status missing/stale/conflict | `ci-test`、integration-like | local pair immutable；status independent；no Delivered/Observed inference | `observability-redaction`、`application-core`;`EV-CAND-L2T-NFR-OBS-001` |
| `NFS-CONFIG-01` | strict parse/source/profile | V0~V8 malformed/high-source/profile/fixture/redline matrix | `ci-test` | fail-fast/no-fallback/no-partial graph；no raw diagnostic | `config-validator`;`EV-CAND-L2T-CFG-T-001` |
| `NFS-CONFIG-02` | builder/adapter capability | B0~B8 stage faults、Store/UoW/replay/Port disabled/blocked/unavailable | `ci-test`、integration-like | dispose prefix；blocked-aware plan；no entry/readiness | `config-assembly`;`EV-CAND-L2T-CFG-F-001` |
| `NFS-DEP-01` | dependency boundary drift | static graph/import/public signature scan；历史 material/SDK/provider path injection negative | `ci-test` | compile only Core；runtime/event seams no sibling package；historical IDs absent | `static-boundary`;`EV-CAND-L2T-VETO-001` |

## 5. 性能专项口径

### 5.1 当前可判定口径

| 口径 | 必须证明 | 当前不能证明 |
|---|---|---|
| Core isolation | 外围 search/diff/job/event/observer 不阻塞核心读取、判断和 local outcome/audit | 具体 latency、throughput、capacity 或 SLO |
| Correctness first | page/batch/parallelism/timeout/retry candidate 不改变 state/error/key/digest/redaction/phase/no-write | 数值优化收益 |
| Sample provenance | duration/count sample 具备 profile、run、suite、case、dataset、clock/ref context | 正式 benchmark baseline、趋势结论或验收 pass |
| Blocked honesty | unavailable/blocked/unknown 不被性能 harness 改名为 success | provider/route readiness |

### 5.2 性能测试禁止事项

- 不恢复旧 `100%`、`99.9%`、P95/P99、QPS、固定毫秒或 replay 百分比。
- 不用 sleep、wall clock、随机 ID 或日志文本作为业务 oracle。
- 不因 benchmark 方便而关闭 UoW、CAS、pair atomicity、redaction、phase fence、Query no-write 或 Job boundedness。
- 不把 fake/deterministic sample 称为 production-like 性能证据。

## 6. 安全/边界专项断言

| 红线组 | 必须断言 | 失败级别 |
|---|---|---|
| identity/registry | display/provider/inventory/SDK/local registry 不能替代 ToolId/Definition/Binding truth | S/P0 veto |
| authorization | owner/source 缺失、stale、conflict、unverifiable 不得 default allow；L2 不生成 effective decision | S/P0 veto |
| sandbox | sandbox-required 不得 host/direct execution；不得伪造 run/receipt/capture/cleanup | S/P0 veto |
| result/audit | raw capture/provider response/Bus/Obs/Runtime state 不得替代 normalized outcome/error/ToolAuditEntry | S/P0 veto |
| handoff | minimal/body-free/redacted/correlated 四门同时满足；否则无 material/Port | S/P0 veto |
| config | NC-001~025、hot/admin/remote/LKG/unsafe redaction override 全部 typed reject | S/P0 veto |
| evidence | planned EV、fake、endpoint、health marker、static mapping 不得升级 evidence/readiness/accepted | S/P0 veto |

## 7. 故障注入与恢复矩阵

| Fault point | 预置/注入 | 预期局部 surface | 禁止恢复 |
|---|---|---|---|
| pre-UoW validation | missing/wrong kind/version/body | typed InvalidInput/ProtocolError；zero write/Port | placeholder/default/coercion |
| staged local write | Store/UoW failure at each stage | rollback/abort；no partial truth | compensating half transaction |
| commit | KnownRolledBack vs CommitOutcomeUnknown | distinct typed recovery surface | infer accepted or blind replay |
| phase-1 handoff | Prepared commit then crash | Prepared marker only | assume call happened |
| external call | known failure vs CallOutcomeUnknown | local failure/unavailable vs unknown/manual | second call/host fallback |
| phase-2 CAS | stale Loaded token | preserve existing marker/terminal; gap/manual | rebuild handoff/current truth |
| result/audit pair | half insert or missing sidecar | IntegrityFailure/unknown/duplicate-result-missing | append missing half from query |
| projection/job | stale watermark/rebuild/partial target | degraded/Partial/Blocked/Failed report | Query repair/whole scan/subject mutation |
| late material | source/status/gap after terminal | append assessment/ref/gap | overwrite terminal/attempt |

## 8. 观测与审计专项矩阵

| 观测面 | 必须存在的安全字段 | 必须排除 | 检查方式 |
|---|---|---|---|
| structured log | trace/context ref、operation/kind、safe subject/request ref、state/disposition、error kind、phase、diagnostic ref | raw body、secret、stack、provider/transport body、full sensitive ref | schema + redaction scan |
| metric | closed operation/result/error/state/freshness/port/view enums、count/duration | actor/subject/request/key/body/digest/credential/high-cardinality | label cardinality/property test |
| trace/span | metadata-derived parent/child context、operation、phase、safe attrs | random business identity、full payload、span=commit truth | metadata mutation + span scan |
| ToolAuditEntry | invocation/anchor/judgment/outcome/source/gap refs、actor/correlation/time | result/error正文、external response、Sandbox/Obs body、Runtime state | same-UoW pair + field allowlist |
| Query/Job observer | read telemetry、freshness、bounded report、cursor/watermark、gap | write/repair/rebuild side effect、accepted/executed inference | effect journal + report scan |
| safe handoff | minimal、body-free、redacted、correlated refs/summary | raw request/capture/provider/event/evidence正文 | four-gate negative matrix |

## 9. 专项到自动化映射

| 专项 | Primary suite | Secondary check | P0 blocking |
|---|---|---|---|
| 性能结构性 sample | `local-closure`、`query-purity` | `check_query_no_write.sh`、duration provenance | 缺 sample、外围阻塞或 correctness drift：是；numeric threshold：当前不判 |
| 可用性/blocked | `application-core`、`controlled-seam` | `check_blocker_truth.sh` | fail-open、fake-as-ready、local truth rollback：是 |
| 安全/redaction | `observability-redaction`、`config-validator` | `check_redaction_boundary.sh` | 是；任何 forbidden leak 或 unsafe override veto |
| 一致性/幂等 | `transaction-concurrency`、`application-core` | `check_outcome_audit_pair.sh` | 是 |
| 恢复/维护 | `entry-worker-job`、`transaction-concurrency` | `check_phase_unknown_fence.sh`、`check_job_boundedness.sh` | 是 |
| 观测/审计 | `observability-redaction` | artifact/report audit | 是 |
| 依赖边界 | `static-boundary` | `check_dependency_boundary.sh`、profile check | 是 |

## 10. 专项停审与跨专项审计

### 10.1 停审记录

| 专项 | 来源是否明确 | 方法/fixture是否可执行 | 断言是否越界 | 结论 |
|---|---|---|---|---|
| 性能/可用性 | `NFR-L2T-001~006` | ci/integration controlled toggle/fault | 无 numeric authority、无 provider readiness | `pass_for_step_10` |
| 安全/边界 | `NFR-L2T-007~010`、VF/NC | dummy forbidden corpus + static/negative scripts | 不吸收 authorization/Sandbox/Obs owner | `pass_for_step_10` |
| 一致性/恢复/幂等 | `NFR-L2T-014~016`、03 §10~§13 | UoW/Store/Port/job fault injection | unknown 不自动 retry、Job 不修 truth | `pass_for_step_10` |
| 观测/审计 | `NFR-L2T-011~013/017~019`、03 §14 | safe sink/schema/field/cardinality scan | observation 不替代 local truth | `pass_for_step_10` |
| 配置/依赖 | 04 V0~V8/B0~B8、NC | strict candidate/profile/static graph | 不新增 key/依赖类型 | `pass_for_step_10` |

### 10.2 跨专项审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 每个 P0 NFR 是否有方法、环境、oracle 和 candidate EV | 通过；六类 NFR 与配置/观测专项均有映射 | Step 13 绑定真实 artifact/report schema。 |
| 是否存在无来源数字阈值 | 未发现；仅保留 duration/count sample | 后续 authority 闭口后才可添加数字。 |
| 安全专项是否覆盖失败 artifact/report | 通过；所有 formal gate 都执行 redaction check | leak 直接 P0 veto。 |
| 一致性与恢复是否只测 known failure | 否；覆盖 commit/call unknown、half pair、late material、partial job | unknown 保持 manual fence。 |
| provider blocker 是否导致专项被整体跳过 | 否；本地 negative/blocked/controlled seam 仍执行 | positive provider 单列 conditional。 |
| 观测是否误作 business oracle | 未发现；ToolAudit/UoW/local state 优先 | observer 仅验证 safe observability contract。 |

## 11. 回填草稿（正式 05 §10）

> 校准来源：
> - `design-calibration/05_test_plan_step_10_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“专项测试矩阵”“性能专项口径”“安全/边界专项断言”“故障注入与恢复矩阵”“观测与审计专项矩阵”和“跨专项审计”小节。

专项测试覆盖结构性性能与可用性、安全红线、一致性/幂等、恢复/故障注入、并发、观测/审计、配置和依赖边界。性能只验证核心主链不被外围阻塞、优化不改变正确性并产生带 provenance 的 duration/count sample；当前没有正式数字阈值。安全专项以 forbidden corpus、self-authorization、sandbox no-host、Hub truth isolation、safe handoff 四门、NC/VF redline 和 evidence boundary 为 P0 veto。故障注入覆盖 UoW/CAS、pair atomicity、Prepared/unknown、projection/Job partial、late material 和 replay missing；观测专项验证 safe fields、low cardinality、TraceContext、ToolAuditEntry pair 和 local truth first。开放 provider/route/readiness 仍以 blocked/conditional 处理，不伪造正向结果。

## 12. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 正式负载模型、测量对象、SLO/evidence authority | 数字性能/容量/可用率验收 | 只保留结构性口径和 sample provenance；不写阈值。 |
| Sandbox mapping/receipt/cleanup 与 authorization taxonomy | provider positive recovery/security | negative/blocked/no-host/unknown 持续 P0；positive P1 conditional。 |
| Observability producer/source/route/workspace baseline | external observation qualification | safe sink/status separation；不产 observed/readiness。 |
| durable backend/CI runner | 高组合并发和 real-like parity | deterministic fake/controlled candidate；实现缺口回写 blocker。 |

## 13. 进入下一步条件

- [x] P0 NFR、security redlines、consistency/recovery、observability/audit 均有专项方法与 candidate EV。
- [x] 性能没有无来源 numeric threshold；sample provenance 和 correctness-first 规则明确。
- [x] unknown、partial、blocked、unavailable、fail-closed 均有独立故障注入和断言。
- [x] 专项已映射 Step 9 suite/check，未新增业务 oracle、配置 key 或依赖类型。
- [x] 未创建 benchmark run、性能结果、真实 provider evidence、报告或签署。

## 14. Step 10 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_10 / proceed_to_step_11` |
| 停审时间 | 2026-08-06（设计审查记录；非专项执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；provider/route/readiness 正向专项保持 conditional/blocked |
| 正式文档写入 | 未写；Step 15 前保持锁定 |
| 下一步 | Step 11 缺陷管理与复验规则 |
