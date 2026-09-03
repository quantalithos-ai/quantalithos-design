# L2-member-images 06 验收标准 Step 9：非功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9  
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.9  
> 回填位置：正式 `06-验收标准.md` 第 9 章“非功能验收门禁”  
> 方法粒度：沿用 L1-governance 的“验收项 → 设计契约 → TC → EV family → fixed future report path → 单项停审 → 跨门禁审计”方法；不继承其治理对象、阈值、outbox、外部 observability backend、报告事实或签署语义。  
> 文档模式：full-restart；本文件定义 future acceptance contract，不是实现、benchmark、测试报告、evidence instance 或验收结论。

## 1. Step 状态、开工确认与本步边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 9：定义非功能验收门禁。 |
| 输出文件 | `projects/L2-member-images/design-calibration/06_acceptance_step_09_nonfunctional.md`。 |
| 开工恢复 | 已先核对项目台账、06 flow、已完成 Step 8；并读取验收 SOP Step 9、书写规范 §5.9、中间产物规范、L1-governance Step 9 的粒度参考、正式 00 §13~§15、01 §8/§13~§15、03 §10~§15、04 §8~§11、05 §5/§6/§10/§13/§14。 |
| 本步状态 | `completed_stop_review`。非功能需求—设计约束—planned TC/EV/path、残余与失败裁决已收稳；不修改正式 06。 |
| 本步目标 | 将性能、可用性/恢复、安全/静态-live、配置韧性、依赖分类、可观测/审计和证据完整性转为可判定门禁，并把无 authority 的量化项目隔离为 baseline input / residual。 |
| 本步不做 | 不发明 latency、throughput、capacity、SLO/SLA、image size、扫描品类、签名算法、retention、backend、alert、dashboard、sampling、真实环境、run、digest、report、evidence、verdict、signoff 或 readiness。 |

### 1.1 本 Step 的设计与实际验收分界

| 语境 | 本 Step 可以定义 | 本 Step 不得声称 |
|---|---|---|
| 设计校准 | P0 structural gate、future pass/failure、量化阈值缺失时的不可裁决/残余口径、planned TC/EV/path 与 VETO candidate 方向。 | 某项性能、可用性、安全、依赖、配置、观测或证据已经通过。 |
| 当前可判定边界 | B01/B02 zero-effect、Query/inbound no-write、strict config reject、forbidden material rejection、dependency/outbound zero、low-cardinality/no-audit 设计断言。 | 正向 build、gate、Artifact、consumer、container、外部 availability、recovery 或 production capacity 已成立。 |
| future actual acceptance | 同一 `<run_id>` 的 raw artifact/report pair 如何支撑 P0 structural gate，benchmark sample 如何仅形成后续 baseline input。 | planned TC、EV family、固定目录、fake 或静态表本身就是 evidence instance。 |
| owner / sibling pending | gap、blocked、unavailable、marker、negative seam 与 reopen 条件。 | L2-member、L2-member-service、runtime/tools/method/artifact/builder/gate/Bus/sandbox 的正向结果或 readiness。 |

### 1.2 输入与使用边界

| 输入 | 当前状态 | 本 Step 使用 | 不得推导 |
|---|---|---|---|
| 正式 00 §13 | 已停审 | `NFR-MI-001~022` 的六类质量要求、无 measurement baseline 的离散判断口径。 | 任何数值 SLA/SLO、容量、扫描、保留或真实质量结果。 |
| 正式 00 §14.7 / §15 | 已停审 | `VETO-MI-001~007` 的非功能相关方向、`R-MI-009` 数量化缺口和 owner pending。 | VETO 已命中、风险已接受或 owner 已关闭。 |
| 正式 01 §8 / §13 | 已停审 | dependency crop、fake isolation、safe observable state、阶段等待可归因、量化数字 deferred。 | sibling source dependency、observability product 或生产兼容结论。 |
| 正式 03 §10~§15 | 已停审 | UoW/recovery/no-write、config binding、safe log/metric/span/trace、redaction、低基数、test seam。 | backend、告警、SLO、dashboard、sampling、retention、外部 success 或已实现的 signal。 |
| 正式 04 §8~§11 | 已停审 | five-domain config、strict parse、fixed redaction floor、profile isolation、startup-only、fail-fast/fail-closed。 | secret provider、remote config、reload/LKG、运行时修复或实际启动成功。 |
| 正式 05 §5/§6/§10/§13/§14 | 已停审 | planned TC、EV family、suite、artifact/report path、专项验证、P1/P2 residual。 | 测试执行、artifact、report、benchmark 数值、EV instance、defect/verdict。 |
| Step 5~8 | 已停审 | P0 functional/redline/protocol/state gate 的非功能失败影响与 phase boundary。 | 当前 boundary pass 可替代 selected positive capability pass。 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 | 依据 |
|---|---|---|
| 哪些非功能指标是 P0？ | P0 是能由正式需求/设计裁决的结构性要求：read/no-long-work、fail-closed degradation、static/live/redaction、no-`latest`/immutable pin、strict config/profile、same-object consistency/recovery upper bound、dependency/outbound cut、safe low-cardinality observability 与实际证据完整性。它们不是生产性能数字。 | 00 §13；01 §8/§13；03 §10~§15；04 §8~§11；05 §10/§13。 |
| 阈值来自需求、设计还是运行基线？ | security、redaction、strict reject、no-write、no-fallback、dependency/outbound zero、low-cardinality、history/trace direction 是离散硬门禁，直接来自正式约束。时延、吞吐、容量、SLO/SLA、size、retention 没有获权 workload/measurement baseline；`TC-PERF-001` / `EV-PERF-001` 只能产出 future baseline input，不能判 P0 pass/fail。 | 00 §13、§15 `R-MI-009`；01 §13、§15；05 §6、§10、§14。 |
| 哪些专项未覆盖，是否影响验收？ | production-like capacity/SLO、真实 registry/Artifact/consumer、外部 scanner/signature/gate policy、observability backend、长期 retention、remote config/secret provider 均未覆盖。它们不自动污染当前 P0 structural gate，但必须保留 P1/P2 residual / blocker；若被 selected delivery 明确纳入，须重开 Step 2~4、9、13。 | 00 §15；03 §13~§15；04 §11；05 §10、§14。 |
| 哪些非功能失败会阻断发布？ | forbidden body/secret/live-state 或 mutable/latest 进入域、strict config fail-open/unsafe fake、Query/inbound/Job 越界写、history/version/UoW/replay 违规、sibling compile dependency/unauthorized outbound、low-cardinality/redaction boundary 违规、actual evidence/report pairing or integrity failure，均使相关 P0 gate failed；VETO 归属留 Step 11 正式核验。 | 00 §14.7；03 §10~§15；04 §8~§11；05 §10~§13。 |
| 证据来自哪里？ | future actual evidence 只能来自 `pr-contract-domain`、`pr-boundary-no-write`、`pr-config-security`、`ci-integration-seams`、`ci-entry-contracts`、`ci-dependency-redaction`、`nightly-risk` 的同 `<run_id>` raw artifact/report pair，并以 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF-*` family 回指。 | 05 §9/§10/§13。 |
| 是否能将 fake 或 config `Assembled` 视为 nonfunctional readiness？ | 不能。fake 只验证 boundary parity；`Assembled`/slot `Available` 只表示 local composition validation。它们不能证明 build、digest、gate、Artifact、consumer、runtime、container、availability、性能或 readiness。 | 03 §13~§14；04 §9；05 §10。 |

## 3. 当前材料诊断、改动对比与裁决取舍

### 3.1 当前材料诊断

| 诊断点 | 若不收敛的风险 | 本 Step 处置 |
|---|---|---|
| historical 06 含旧 P95/SLA、产品/容器、泛化 API/DB 和报告结论。 | 无来源数字会伪装为 P0 阈值，外部能力会被写成已通过。 | 不继承；量化项固定为 baseline input only，真实 external quality保持 P1/P2/pending。 |
| 22 条 NFR 横跨五 capability 和多个技术层。 | 每条都单独写 gate 会重复 state/UoW/接口裁决，或遗漏跨链质量。 | 聚合为 9 个非功能 AC；需求 ID、state/flow/TC/EV/path 在闭环表中完整回指。 |
| redaction、dependency、outbound、config、Query no-write 已分散在 Step 6~8。 | “非功能”会变成泛化软约束，无法阻断硬红线。 | 作为 P0 structural requirements 重申其验收影响，但不重新定义红线细节或 VETO 结论。 |
| 05 的 EV/PERF、suite 与路径均为 planned。 | 用 planned evidence 或 benchmark design 填充实际验收结果。 | 所有表格固定写 planned/future；actual-evidence gate 留 Step 10。 |
| owner/builder/gate/consumer 未闭合且真实环境不存在。 | 把 unavailable 误记性能失败，或把 fake 成功当 availability。 | 本仓 boundary violation = failure；外部正向 oracle 缺失 = blocked/not_evaluable，不降为 P0 pass。 |

### 3.2 改动前后对比

| 项 | 进入 Step 9 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| 性能裁决 | 有 read-only benchmark direction，缺统一验收上限。 | `AC-NFR-MI-001` 仅要求 read path 不触发长时/外部工作与 future sample 可追；无数值 pass/fail。 | 无 workload、baseline、环境或 owner authority。 |
| 可用性与恢复 | flow/state 中分散有 blocked/unknown/PF 规则。 | `AC-NFR-MI-002` 明确 failure mapping、旧 truth 不反写、no blind retry/repair 与 blocked ≠ pass。 | 防止外部失败或 PF 缺口被伪恢复。 |
| 安全与 immutable input | Step 6/04 有 redline，缺 NFR 闭环。 | `AC-NFR-MI-003~004` 把 forbidden material、no-`latest`、pin/static-live 与 safe output 纳入 P0 structural gate。 | 静态镜像层不能吸收 live/secret/external body。 |
| 配置与依赖 | 04/01 已有 fail-fast 和 crop。 | `AC-NFR-MI-005~006` 固定 config/profile/fake 与 compile/runtime/event/ref/adapter/fake 分类的验收影响。 | 防止配置或消费关系偷偷跨越 owner 边界。 |
| 观测、证据与量化 residual | 03/05 有 signal/evidence contract，缺 NFR→裁决收口。 | `AC-NFR-MI-007~009` 区分 safe signal、actual evidence integrity、future performance baseline/residual。 | 防止 signal/EV family 变成 readiness 或虚构阈值。 |

### 3.3 验收裁决取舍

| 议题 | 备选方案 | 结论 | 理由 |
|---|---|---|---|
| 性能是否设置固定 P95/SLA/容量阈值 | A. 继承旧数字；B. 只要求结构性 read boundary 与 baseline sample。 | 采用 B。 | 正式 00、01、05 均明确没有获权量化 baseline。 |
| external unavailable 是否等同 NFR failure | A. 一律失败；B. 本仓 boundary 错误才失败，owner positive oracle 缺失为 blocked/not_evaluable。 | 采用 B。 | P0 不拥有外部 owner truth；不得强行制造 real-like pass/fail。 |
| redaction/dependency/config fail-open 是否可进入 residual | A. 可以；B. 不可以。 | 采用 B。 | 它们违反 P0 boundary，且可触发 VETO candidate，不能用风险接受或 benchmark 解释覆盖。 |
| 观测 signal 是否可充当 audit/evidence | A. 可以；B. 只作为 future diagnostic cut，actual evidence 必须 artifact/report pair。 | 采用 B。 | log/metric/span/trace 和 report/evidence 的 owner、生命周期不同。 |
| `Assembled`/fake parity 是否可证明 availability | A. 可以；B. 只验证 local composition/boundary。 | 采用 B。 | staged state 与 fake 不拥有 external outcome/readiness 语义。 |

## 4. 非功能范围、阈值来源与统一裁决规则

### 4.1 P0 structural requirements 与量化 residual 的分界

| 类别 | P0 是否可裁决 | 当前阈值 / 判断方式 | 不能替代 |
|---|---|---|---|
| read-path performance structure | 是 | existing local read 不触发 build、registry、instantiation、external body fetch、repair 或 long-work；duration 仅可作为 planned sample 字段。 | latency/throughput/capacity/SLO pass。 |
| availability / degradation / recovery | 是 | failure 返回 formal `Blocked`/`Unavailable`/`Unknown`/`Gap`/marker，旧 truth 不被反写，未定义 recovery 不盲重试。 | external provider health、consumer confirmation、availability SLO。 |
| security / static-live / pin | 是 | forbidden material rejected/not output；only immutable body-free ref/approved template placement；no `latest`/guess/default. | scanner/signature policy pass、external security certification。 |
| config / profile / fake | 是 | strict parse、whole-config reject、fixed redaction floor、TestOnly isolation、startup-only/no LKG/reload. | secret/config center availability、actual process/container start。 |
| dependency / outbound | 是 | only approved conditional Core compile relation; active sibling compile dependency zero; outbound inventory `NoneAuthorized`。 | cross-repository integration or delivery success。 |
| observability / audit | 是 | safe fixed fields、finite labels、no-audit paths、trace/UoW direction；no raw output。 | backend ingestion, alert, dashboard, sampling/retention or evidence success。 |
| actual evidence/report integrity | 是，但只在 actual run 存在时 | same `<run_id>` artifact/report pair、case/EV mapping、blocked/failed separation、redaction. | Step 9 static table、EV family、planned path 或 stdout。 |
| performance/capacity/SLO/size/retention | 否，P2 baseline/residual | `TC-PERF-001` / `EV-PERF-001` only create future baseline input; no current numeric threshold。 | P0 pass、conditional pass 或 production readiness。 |
| real builder/registry/gate/Artifact/consumer quality | 否，owner-controlled P1/P2 | formal owner oracle + selected environment after contract closure。 | local fake, adapter marker, ref, cache or `Assembled`。 |

### 4.2 通用失败与阻断规则

1. 对本仓 P0 structural requirement，真实 run 接受 forbidden material、mutable/latest/default、silent fallback、write/repair、history overwrite、version drift、fake/readiness、unauthorized dependency/outbound、unsafe signal 或 evidence integrity defect，即为 relevant AC failed；不得降为 warning。
2. external owner 的实际 SLA、performance、health、consumer confirmation、Artifact result 或 gate policy无正式 oracle 时，相关 positive quality verdict 是 `blocked/not_evaluable`，不能写 `pass`、`conditional pass` 或“已跳过”。
3. 量化 benchmark 无样本时，不可用“未超阈值”推断通过；若 selected delivery声明必须达到数量化目标，则缺正式 workload/baseline 是 Step 4 entry blocker，并需重开 Step 2/3/9。
4. actual evidence/report pair 缺失时，不得用 planned TC、EV family、config table、static scan declaration、log、stdout 或历史 report 代替；此项的最终证据裁决留 Step 10。
5. `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009`、`Q-MI-001~004` 均不自动构成 observed defect 或 risk acceptance；它们限制受影响正向 lane，并要求 reopen。

## 5. 结构化中间产物：非功能验收表

### 5.1 非功能验收表：AC-NFR-MI-001~009

| 验收项 ID | 维度 / 需求范围 | future 通过条件 | failure 条件 | planned evidence |
|---|---|---|---|---|
| `AC-NFR-MI-001` | read-path performance structure；`NFR-MI-001/013/017`。 | existing definition/assembly/availability/query/status read 只读取 permitted local truth/view/ref；不触发 build、registry、instantiation、container、external body fetch、Query repair、projection rebuild 或 unbounded scan。future benchmark 若执行，只输出 repeatable read-only sample 作为 baseline input。 | read path 触发上述工作、以 cache/body补 truth，或将 duration/count/sample absence/number 写成 P0 latency/throughput/capacity/SLO verdict。 | `TC-QUERY-001~010`、`TC-PERF-001`；`EV-SVC-001`、`EV-ENTRY-001`、`EV-PERF-001`；`reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`reports/runs/<run_id>/suites/nightly-risk.md`。 |
| `AC-NFR-MI-002` | availability, degradation and recovery；`NFR-MI-002/007/014/018`。 | missing/stale/conflict/unavailable/owner pending maps to formal safe disposition; existing local truth/history remains intact; current Command/Job remain zero-effect; Query/inbound remain no-write/marker-only; `Unavailable` recovery remains blocked until formally defined. | external failure rewrites truth/history, unknown blind retry, Query/cache/fake repair, `Unavailable -> Rebuilding/Fresh` invention, owner unavailable written as candidate/eligibility/entry/consumer success. | `TC-CON-004~005`、`TC-REC-001`、`TC-QUERY-002/010`、`TC-JOB-004~005`；`EV-REC-001`、`EV-INT-001`、`EV-SVC-001`；`reports/runs/<run_id>/suites/ci-integration-seams.md`；`reports/runs/<run_id>/suites/nightly-risk.md`；`reports/runs/<run_id>/suites/pr-boundary-no-write.md`。 |
| `AC-NFR-MI-003` | security/static-live/body boundary；`NFR-MI-004/010/019`。 | raw secret, credential, endpoint, mapping/component/seed/external body, live memory/checkpoint/workspace and provider result are rejected before local truth/build input/view/trace/log/report; gate missing/failed/conflict/unknown remains fail-closed. | any forbidden material persists or outputs; safe ref is replaced by body; gate missing/default/fake is promoted to Passed/Eligible; redaction leak occurs. | `TC-SEC-001`、`TC-CMD-002/005~007`、`TC-QUERY-008`；`EV-SEC-001`、`EV-CONFIG-001`、`EV-OBS-001`；`reports/runs/<run_id>/suites/pr-config-security.md`；`reports/runs/<run_id>/redaction-check.md`；`reports/runs/<run_id>/suites/ci-dependency-redaction.md`。 |
| `AC-NFR-MI-004` | immutable pin, derivation and trace continuity；`NFR-MI-003/005/011/015/020`。 | all necessary local relations can trace definition → revision → intent → attempt → provenance → eligibility → availability/entry or exact gap; baseline/snapshot immutable; trace/history append-only; repair uses new context/replacement/supersede. | `latest`/mutable/guessed/default ref, missing predecessor/pin/placement, current/old provenance or availability history overwrite, digest/ref/trace body misused as external or global truth. | `TC-STATE-001~010`、`TC-QUERY-003/007~008`、`TC-SEC-001~002`；`EV-UNIT-001`、`EV-INT-001`、`EV-SEC-001`；`reports/runs/<run_id>/suites/pr-contract-domain.md`；`reports/runs/<run_id>/suites/ci-integration-seams.md`；`reports/runs/<run_id>/redaction-check.md`。 |
| `AC-NFR-MI-005` | consistency, idempotency and replay upper bound；`NFR-MI-006/008/012/016/021`。 | current B01/B02 zero-effect is preserved; future/reopen duplicate only replays matching stored result; different stable input conflicts; same-object Exact/Absent, UoW rollback, append-only and unknown/manual rules hold; no second truth/replay side effect. | duplicate mutation/adapter/page/rebuild, last-write-wins/upsert, wrong version source, partial commit, stored-result reconstitution from truth/cache, blind retry/compensation/lease/cleanup or state overwrite. | `TC-CON-001~005`、`TC-STATE-001~012`、`TC-CMD-004~010`、`TC-JOB-001~006`；`EV-SVC-001`、`EV-INT-001`、`EV-REC-001`；`reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`reports/runs/<run_id>/suites/ci-integration-seams.md`；`reports/runs/<run_id>/suites/nightly-risk.md`。 |
| `AC-NFR-MI-006` | config resilience, profile isolation and fake restriction。 | all five config domains use strict JSON/allowlisted source/type/ref/sensitive/cross-field validation; invalid high-priority input rejects whole effective config; mandatory slot failure is `Blocked`; fixed redaction floor holds; TestOnly fake is `ci-test` only; P0 is startup-only/no reload/LKG/partial apply. | silent fallback, partial facade/apply, raw value output, weaker redaction, profile/fake mixing, provider probing, online override/reload/LKG, config `Assembled` interpreted as external or business readiness. | `TC-CONFIG-001~005`、`TC-SEC-001`、`TC-OBS-001`；`EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`；`reports/runs/<run_id>/suites/pr-config-security.md`；`reports/runs/<run_id>/redaction-check.md`。 |
| `AC-NFR-MI-007` | dependency classification and zero outbound；`NFR-MI-018/019`、`AC-MI-027/030` direction。 | only formally approved conditional L0-core relation may be compile; active sibling compile dependency remains zero; runtime/event/ref/adapter/fake preserve category; fake remains TestOnly; inbound remains marker-only and outbound remains `ImageOutboundEventInventory::NoneAuthorized`. | sibling package/path dependency, copied owner schema/body, unclassified consumption, fake/adapter readiness, inbound acceptance/receipt/dedup, outbound DTO/outbox/publisher/topic/retry/delivery. | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-SEC-001~002`；`EV-GATE-001`、`EV-SEC-001`、`EV-ENTRY-001`；`reports/runs/<run_id>/gate-results.md`；`reports/runs/<run_id>/redaction-check.md`；`reports/runs/<run_id>/suites/ci-dependency-redaction.md`；`reports/runs/<run_id>/suites/ci-entry-contracts.md`。 |
| `AC-NFR-MI-008` | safe observability and local audit boundary；`NFR-MI-009/022`。 | logs/metrics/spans only use formal safe typed/body-free refs, finite operation/state/disposition/error/seam/slot classes, redacted diagnostic refs, duration and bounded counts; no-audit paths remain no audit; trace is local append-only and future UoW-bound only. | raw/high-cardinality/sensitive labels, trace/audit written by Query/current stop/inbound/composition, signal treated as evidence/backend/external truth, outbox/publisher/delivery metric/span, `Assembled`/slot Available signal treated as readiness. | `TC-OBS-001~002`、`TC-STATE-018`、`TC-SEC-001`；`EV-OBS-001`、`EV-SEC-001`；`reports/runs/<run_id>/suites/ci-dependency-redaction.md`；`reports/runs/<run_id>/suites/ci-entry-contracts.md`；`reports/runs/<run_id>/redaction-check.md`。 |
| `AC-NFR-MI-009` | actual evidence/report integrity and quantitative residual handling。 | once a future actual run is authorized, every blocking NFR assertion has same `<run_id>` raw artifact/report pair, case/TC/EV mapping, redaction and blocked/failed separation; `EV-PERF-001` remains baseline input only until formal threshold change. | static/planned material, log/stdout, historical report or fake substituted for pair; missing/overwritten/mismatched artifact/report; blocked marked pass; performance sample or absent threshold represented as acceptance success/failure without authority. | `TC-PERF-001`、`TC-SEC-001~002`、`TC-DEP-001`、`TC-OBS-001~002`；`EV-PERF-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001`；`reports/runs/<run_id>/evidence-index.md`；`reports/runs/<run_id>/gate-results.md`；`reports/runs/<run_id>/redaction-check.md`。 |

### 5.5 SOP 六列表回填索引

书写规范要求非功能验收至少能够按“验收项 ID → 维度 → 指标 / 要求 → 阈值 → 证据来源 → 结论口径”复核。下表是 5.1 详细表的索引版；阈值只采用有来源的离散结构约束，未执行项统一进入后续风险接受队列，当前不形成任何实际结论。

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 / 来源 | 证据来源（planned） | 结论口径（future） |
|---|---|---|---|---|---|
| `AC-NFR-MI-001` | read-path 性能结构 | existing read 不触发 build、registry、instantiation、container、external body fetch、repair、projection rebuild 或无界扫描。 | 离散硬门禁：上述工作次数为零；无获权 latency/throughput/capacity/SLO 数值。来源：00 `NFR-MI-001/013/017`、03 §7.2/§8/§10、05 §10。 | `TC-QUERY-001~010`、`TC-PERF-001`；`EV-SVC-001`、`EV-ENTRY-001`、`EV-PERF-001`；`reports/runs/<run_id>/suites/pr-boundary-no-write.md`。 | 结构违规为 P0 failed；样本仅作 baseline input；无样本不等 numeric pass。 |
| `AC-NFR-MI-002` | 可用性 / 降级 / 恢复 | missing、stale、conflict、unavailable、owner pending 映射为 safe disposition；不反写既有 truth/history；不盲 retry 或修复。 | 必须保持 `Blocked` / `Unavailable` / `Unknown` / `Gap` / marker 与 phase 上限；`Unavailable -> Rebuilding/Fresh` 未获授权。来源：00 `NFR-MI-002/007/014/018`、03 §9~§12。 | `TC-CON-004~005`、`TC-REC-001`、`TC-QUERY-002/010`、`TC-JOB-004~005`；`EV-REC-001`、`EV-INT-001`。 | 本仓反写或虚构 recovery 为 P0 failed；外部 positive oracle 缺失为 blocked/not_evaluable。 |
| `AC-NFR-MI-003` | 安全 / static-live / redaction | secret、credential、endpoint、mapping/component/seed/external body、live memory/checkpoint/workspace、provider result 不进入 truth、build input、view、trace、log、report 或 artifact。 | 禁止材料出现次数为零；gate 缺失/failed/conflict/unknown 不得变为 positive；body-free ref 才可保留。来源：00 `NFR-MI-004/010/019`、VETO direction、03 §13~§14、04 §8/§11。 | `TC-SEC-001`、`TC-CMD-002/005~007`、`TC-QUERY-008`；`EV-SEC-001`、`EV-CONFIG-001`、`EV-OBS-001`；`reports/runs/<run_id>/redaction-check.md`。 | 任一泄露、绕过或 fake/default positive 为 P0 failed，并留 Step 11 VETO candidate；不可风险接受。 |
| `AC-NFR-MI-004` | immutable pin / 派生追溯 | definition → revision → intent → attempt → provenance → eligibility → availability/entry 或 exact gap 连续可追；baseline/snapshot、trace/history 不原地改写。 | `latest`/mutable/guessed/default ref 禁止；输入与历史仅 append、replacement 或 supersede。来源：00 `NFR-MI-003/005/011/015/020`、03 §9~§10。 | `TC-STATE-001~010`、`TC-QUERY-003/007~008`、`TC-SEC-001~002`；`EV-UNIT-001`、`EV-INT-001`。 | pin/trace/history 违规为 P0 failed；local ref/digest 不得替代 external truth。 |
| `AC-NFR-MI-005` | 一致性 / 幂等 / replay | current B01/B02 zero-effect；future duplicate 只 replay matching stored result；same-key different input conflict；UoW/version/rollback/replay 上限不变。 | current 不得 begin UoW/reserve/write；future existing 仅同对象 `Exact`、new 仅 `Absent`；无 partial commit、blind retry 或 second effect。来源：00 `NFR-MI-006/008/012/016/021`、03 §10~§12。 | `TC-CON-001~005`、`TC-STATE-001~012`、`TC-CMD-004~010`、`TC-JOB-001~006`；`EV-SVC-001`、`EV-INT-001`、`EV-REC-001`。 | side effect、stale overwrite、partial commit、重跑或伪造 replay 为 P0 failed；未闭 blocker 的 positive lane 保持 blocked。 |
| `AC-NFR-MI-006` | 配置韧性 / profile / fake | 五域严格 JSON、来源/类型/ref/sensitive/cross-field 校验；高优先级非法输入整体拒绝；startup-only；TestOnly fake 只在 `ci-test`。 | fail-fast/fail-closed；无 silent fallback、partial apply、LKG/reload 或 redaction weakening。来源：03 §13、04 §5、§8~§11。 | `TC-CONFIG-001~005`、`TC-SEC-001`、`TC-OBS-001`；`EV-CONFIG-001`、`EV-SEC-001`；`reports/runs/<run_id>/suites/pr-config-security.md`。 | 配置越界为 P0 failed；`Assembled`/slot `Available` 仅 local composition，不是 readiness。 |
| `AC-NFR-MI-007` | 依赖分类 / zero outbound | compile/runtime/event/ref/adapter/fake 分类不漂移；active sibling compile dependency 为零；inbound marker-only；outbound inventory 为 `ImageOutboundEventInventory::NoneAuthorized`。 | 仅未来获批的 conditional Core carrier 可 compile；outbound DTO/outbox/publisher/topic/delivery 数为零。来源：00 `NFR-MI-018/019`、`AC-MI-027/030`、01 §5/§8/§13、03 §7.3/§13。 | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-SEC-001~002`；`EV-GATE-001`、`EV-ENTRY-001`；`reports/runs/<run_id>/gate-results.md`。 | unauthorized compile/event/output 为 P0 failed / VETO candidate；ref/adapter/fake 不证明外部成功。 |
| `AC-NFR-MI-008` | 安全可观测 / 本地审计边界 | log/metric/span/trace 仅使用 safe typed/body-free ref、有限标签、redacted reason；Query、current stop、marker inbound、composition 不写 audit。 | forbidden/high-cardinality/raw field 为零；trace 仅 future local UoW-bound append-only；无 backend/readiness signal。来源：00 `NFR-MI-009/022`、03 §14、04 §8。 | `TC-OBS-001~002`、`TC-STATE-018`、`TC-SEC-001`；`EV-OBS-001`、`EV-SEC-001`；`reports/runs/<run_id>/redaction-check.md`。 | unsafe signal/no-audit violation 为 P0 failed；signal 不可替代 evidence/report/backend。 |
| `AC-NFR-MI-009` | 实际证据 / 报告完整性与量化残余 | future authorized run 的 blocking NFR assertion 需同 `<run_id>` raw artifact/report pair、case/TC/EV mapping、redaction 与 blocked/failed 分离。 | pair 完整性是离散门禁；`EV-PERF-001` 仅 baseline input；当前无 run、pair 或 verdict。来源：00 `R-MI-009`、05 §9/§13、Step 3/4。 | `TC-PERF-001`、`TC-SEC-001~002`、`TC-DEP-001`、`TC-OBS-001~002`；`EV-PERF-001`、`EV-GATE-001`；`reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`redaction-check.md`。 | missing/mismatch/blocked-as-pass 为 actual non-evaluable/failed；最终 evidence gate 留 Step 10。 |

未执行非功能项的风险接受纪律：所有当前没有 authorized run、raw artifact/report pair、外部 owner oracle 或量化 baseline 的条目，均须在后续 Step 13 的 `reports/acceptance/risk-acceptance.md` 中以风险/遗留项登记；当前状态只能是 `not_created` / `not_accepted` / `blocked`，没有接受人、动作和截止时间不得支撑“有条件通过”。该队列登记不等于已经风险接受，也不改变本 Step 的 P0 structural failure 规则。

### 5.2 设计契约 → flow → TC → EV → future report path 闭环

下表中的 TC、EV family、artifact 与 report 都是 future contract。只有获得授权的实际验收在同一 `<run_id>` 下同时存在 raw artifact 与由其生成的 report 时，才可在 Step 10 核验它们；本表不是 evidence instance，也不产生通过结论。

| 验收项 | 正式设计契约 | 受控 flow / 当前上限 | planned TC | planned EV family | fixed future report path | future 裁决影响 |
|---|---|---|---|---|---|---|
| `AC-NFR-MI-001` | 00 §13 `NFR-MI-001/013/017`；03 §7.2、§8、§10 的 existing local read / no-write；05 §10 `TC-PERF-001`。 | ten Query、existing local status/definition/entry read；当前不发起 build、registry、instantiation、external fetch、repair 或 rebuild。 | `TC-QUERY-001~010`、`TC-PERF-001`。 | `EV-SVC-001`、`EV-ENTRY-001`、`EV-PERF-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`reports/runs/<run_id>/suites/nightly-risk.md`。 | read-side work/repair 或把 sample 写成数值 pass 均为 P0 failure；benchmark 仅形成 future baseline input。 |
| `AC-NFR-MI-002` | 00 §13 `NFR-MI-002/007/014/018`；03 §9~§12 的 `Blocked`/`Unavailable`/`Unknown`/Gap、zero-effect 与 `PF-UNAVAILABLE-RECOVERY` 上限。 | Query、marker-only inbound、bounded Job 与 future recovery seam；当前 Command/Job 仍止于 B01/B02，外部 owner 不可用只保留 safe disposition。 | `TC-CON-004~005`、`TC-REC-001`、`TC-QUERY-002/010`、`TC-JOB-004~005`。 | `EV-REC-001`、`EV-INT-001`、`EV-SVC-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`reports/runs/<run_id>/suites/ci-integration-seams.md`；`reports/runs/<run_id>/suites/nightly-risk.md`。 | 本仓反写 truth、盲 retry 或虚构 recovery 为 P0 failure；外部正向 oracle 缺失为 `blocked/not_evaluable`，不是 pass 或 observed defect。 |
| `AC-NFR-MI-003` | 00 §13 `NFR-MI-004/010/019` 与 `VETO-MI-003~005` direction；03 §13~§14；04 §8、§11 的 body-free / redaction / fail-closed 约束。 | definition、assembly、qualification、Query/trace/log/report output；当前只接受 body-free typed ref、safe conclusion 或 gap。 | `TC-SEC-001`、`TC-CMD-002/005~007`、`TC-QUERY-008`。 | `EV-SEC-001`、`EV-CONFIG-001`、`EV-OBS-001`。 | `reports/runs/<run_id>/suites/pr-config-security.md`；`reports/runs/<run_id>/suites/ci-dependency-redaction.md`；`reports/runs/<run_id>/redaction-check.md`。 | forbidden body/secret/live state、default/fake positive gate 或 leak 为 P0 failure / Step 11 VETO candidate；不以 hash、manual note 或 risk acceptance 覆盖。 |
| `AC-NFR-MI-004` | 00 §13 `NFR-MI-003/005/011/020`；03 §9~§10 的 immutable baseline/snapshot、append-only trace/history、replacement 与 versioned relation。 | Definition → revision → intent → attempt → provenance → eligibility → availability/entry 或 exact gap；当前受 B01/B02、B03 和 owner gap 限制。 | `TC-STATE-001~010`、`TC-QUERY-003/007~008`、`TC-SEC-001~002`。 | `EV-UNIT-001`、`EV-INT-001`、`EV-SEC-001`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`；`reports/runs/<run_id>/suites/ci-integration-seams.md`；`reports/runs/<run_id>/redaction-check.md`。 | `latest`、mutable/guessed/default relation、overwrite 或把 local ref/trace 当外部 truth 为 P0 failure；positive handoff/consumer quality仍 blocked。 |
| `AC-NFR-MI-005` | 00 §13 `NFR-MI-006/008/012/016/021`；03 §10~§12 的 UoW、same-object `Exact`/`Absent`、stored replay、unknown/manual consistency。 | current 10 Command/6 Job zero-effect；future/reopen local write、duplicate、race、commit-unknown only after affected contracts close。 | `TC-CON-001~005`、`TC-STATE-001~012`、`TC-CMD-004~010`、`TC-JOB-001~006`。 | `EV-SVC-001`、`EV-INT-001`、`EV-REC-001`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`；`reports/runs/<run_id>/suites/ci-integration-seams.md`；`reports/runs/<run_id>/suites/nightly-risk.md`。 | current side effect、stale overwrite、partial commit、second replay effect or blind retry is P0 failure; B01/B02 and `DDD-S13-OPEN-01/02` still block positive replay judgment. |
| `AC-NFR-MI-006` | 03 §13；04 §5、§8~§11 的 five-domain strict JSON、source priority、redaction floor、profile / fake / startup-only contract。 | `infra/config.rs` validation 与 `runtime_builder` local composition；`Assembled`/slot `Available` only exposes local composition validation. | `TC-CONFIG-001~005`、`TC-SEC-001`、`TC-OBS-001`。 | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`。 | `reports/runs/<run_id>/suites/pr-config-security.md`；`reports/runs/<run_id>/redaction-check.md`。 | silent fallback, partial apply, redaction weakening, profile/fake mixing, reload/LKG or readiness promotion is P0 failure; provider/product availability remains outside this local gate. |
| `AC-NFR-MI-007` | 00 §13 `NFR-MI-018/019`、`AC-MI-027/030` direction；01 §5/§8/§13；03 §7.3、§13 的 dependency crop and `ImageOutboundEventInventory::NoneAuthorized`。 | six dependency categories and 2 marker-only inbound surfaces; current outbound count stays zero, and no sibling source relation is activated. | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`、`TC-SEC-001~002`。 | `EV-GATE-001`、`EV-SEC-001`、`EV-ENTRY-001`。 | `reports/runs/<run_id>/suites/ci-dependency-redaction.md`；`reports/runs/<run_id>/suites/ci-entry-contracts.md`；`reports/runs/<run_id>/gate-results.md`；`reports/runs/<run_id>/redaction-check.md`。 | sibling compile edge, copied owner body, accepted inbound or any outbound surface is P0 failure / VETO candidate; ref/adapter/fake does not prove external success. |
| `AC-NFR-MI-008` | 00 §13 `NFR-MI-009/022`；03 §14 local log/metric/span/trace and no-audit paths；04 §8 redaction floor。 | local diagnostics and future UoW-bound trace only; Query, current stop, marker inbound and composition remain no-audit paths. | `TC-OBS-001~002`、`TC-STATE-018`、`TC-SEC-001`。 | `EV-OBS-001`、`EV-SEC-001`。 | `reports/runs/<run_id>/suites/ci-dependency-redaction.md`；`reports/runs/<run_id>/suites/ci-entry-contracts.md`；`reports/runs/<run_id>/redaction-check.md`。 | raw/high-cardinality output, forbidden audit write, output-as-truth or readiness promotion is P0 failure; signals are not backend, report or evidence substitutes. |
| `AC-NFR-MI-009` | 05 §9、§13 and Step 3/4 fixed baseline rules; 00 §15 `R-MI-009`; actual evidence completeness is expanded by Step 10. | future authorized actual run only; static calibration, fake, config `Assembled`, planned suite or historical material remain non-evidence. | `TC-PERF-001`、`TC-SEC-001~002`、`TC-DEP-001`、`TC-OBS-001~002`。 | `EV-PERF-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001`。 | `reports/runs/<run_id>/evidence-index.md`；`reports/runs/<run_id>/gate-results.md`；`reports/runs/<run_id>/redaction-check.md`。 | missing/mismatched artifact-report pair, false pass for blocked, or invented numerical verdict makes actual acceptance non-evaluable/failed as applicable; full evidence gate is Step 10. |

### 5.3 P1/P2 quantitative 与 external-quality residual

| residual / pending topic | 当前为何不能进入 P0 quantitative pass/fail | 当前允许的验收处理 | 重开条件 |
|---|---|---|---|
| latency、throughput、capacity、SLO/SLA、image size、retention | 没有获权 workload、measurement baseline、selected environment 或阈值 owner；`R-MI-009` 明确禁止提前承诺。 | `TC-PERF-001` / `EV-PERF-001` 只能保留可重复 read-only sample 的 future baseline-input contract。 | 正式需求变更同时固定 workload、measurement method、environment、threshold owner 与 acceptance scope；重开 Step 2~4、9、13。 |
| real builder / registry / qualification gate / Artifact / consumer quality | 这些 outcome、body、policy 和 availability 不属于本仓 truth，且 owner oracle、field/schema、selected delivery均未闭合。 | 本仓只验 ref/adapter/gap/marker/no-body/no-fake-readiness 边界；正向结果为 `blocked/not_evaluable`。 | relevant `MI-UP-*` / `Q-MI-*` and owner formal contract close, then reopen affected 03/04/05/06 gates before controlled run. |
| scanner、BOM、signature、vulnerability class or supply-chain policy | `Q-MI-004` 未确定 evidence kind、gate priority、policy owner 或 acceptance oracle。 | 禁止把 digest、provenance relation、planned scan 或 external tool output写成 policy pass；仅保留 pending. | policy owner supplies formal contract, selected evidence categories and fail disposition; reopen security/evidence/VETO gates. |
| remote config、secret provider、production process/container startup | 04 只定义 strict local configuration and composition boundary，未定义 remote provider、credential、runtime lifecycle or deployment truth。 | invalid local configuration fail-closed; `Assembled` does not prove process/container availability. | owner-approved provider/lifecycle contract and selected profile; reopen config, entry/exit and NFR gate. |
| observability backend、alert/dashboard/sampling、long-term retention | 03 only owns safe local signal schema and local trace boundary, not backend operation or operational policy. | verify safe field/no-audit/redaction boundary only; backend quality remains P1/P2 residual. | observability owner publishes backend/retention/SLO contract and acceptance environment. |
| multi-architecture、restricted variant、hardened base、usage summary | conditional enhancement namespaces are not selected core P0 and their base/security/consumer input remains pending. | ensure they do not alter current core truth, dependency class, config or readiness denominator. | selected delivery expressly includes one, then reopen scope, baseline, config, test and NFR gates. |

### 5.4 非功能失败裁决表

本表只定义 future observed result 的处理方式。`failed`、`blocked/not_evaluable` 与尚未生成任何 run 的 `absent` 三者不可互换；VETO 是否最终命中仍须由 Step 11 的固定清单核验。

| future finding / evidence condition | 本 Step 的裁决 | 可否以 residual、manual note 或风险接受覆盖 | 后续处理 |
|---|---|---|---|
| Query/read path starts build、registry、instantiation、external body fetch、repair/rebuild or unbounded scan | `AC-NFR-MI-001` failed。 | 不可。 | 修复 read boundary，重跑 affected Query/negative suite；若已改变设计 flow，回写 03/05。 |
| external or owner failure overwrites local truth/history, starts blind retry, or invents `Unavailable -> Rebuilding/Fresh` | `AC-NFR-MI-002` failed。 | 不可。 | 保留 failed evidence；未定义 recovery仍 blocked，先重开 03 recovery/state contract。 |
| secret/body/live state leaks, mutable/`latest`/guessed/default ref enters any permitted surface, or missing gate becomes positive | `AC-NFR-MI-003` or `AC-NFR-MI-004` failed; Step 11 VETO candidate。 | 不可。 | 停止 affected delivery lane，执行 redaction/boundary复验；不得用 digest、hash、fake 或手工脱敏说明替代。 |
| current stop produces UoW/write/adapter/trace/result, or future local write violates version/UoW/replay/append-only rules | `AC-NFR-MI-005` failed; core truth/history issue is VETO candidate。 | 不可。 | 受影响 command/job/replay lane 不通过；修复并按 state/UoW/negative concurrency 复验。 |
| invalid config silently falls back, applies partially, weakens redaction, mixes profile/fake, reloads or treats `Assembled` as readiness | `AC-NFR-MI-006` failed。 | 不可。 | 修复 strict configuration boundary；重跑 config/security/redaction suite。 |
| sibling compile dependency, copied owner truth, accepted inbound/event receipt, or outbound DTO/outbox/publisher/topic/delivery appears | `AC-NFR-MI-007` failed; dependency/outbound VETO candidate。 | 不可。 | 移除 unauthorized surface，重新执行 dependency/outbound checks；owner relation仍回到 category/gap。 |
| unsafe/high-cardinality/raw diagnostic output, forbidden no-audit trace/write, or signal promoted to external/readiness truth | `AC-NFR-MI-008` failed。 | 不可。 | 修复 safe-field/no-audit boundary；重跑 observability/redaction checks。 |
| actual authorized run lacks matching raw artifact/report, mapping/redaction is incomplete, or blocked is represented as pass | `AC-NFR-MI-009` failed / actual acceptance not evaluable, subject to Step 10 evidence audit。 | 不可。 | 不作 final acceptance conclusion；重建 from same-run raw material only，不能补写静态 EV。 |
| no future benchmark sample, or sample value exceeds an old/unstated number | not a P0 numerical performance failure because no formal threshold exists; record as absent baseline input / residual. | 不适用；不得反向写成 pass。 | 不影响 structural boundary failure判断；若 delivery requires number，先满足 §5.3 重开条件。 |
| owner-controlled actual quality has no formal oracle or selected environment | `blocked/not_evaluable` for that positive external-quality assertion, not local P0 pass/fail。 | 不得把 fake、adapter marker、local ref/entry、cache 或 `Assembled` 变成 acceptance substitute。 | Keep explicit gap; owner closure triggers affected reopening. |

## 6. 非功能验收项逐项停审

| 验收项 | 需求 / 设计契约已核对 | flow 和 phase 上限明确 | planned TC / EV / path 已固定 | 无来源阈值或外部 readiness 未混入 | 结论 |
|---|---|---|---|---|---|
| `AC-NFR-MI-001` | 是：00 `NFR-MI-001/013/017`、03 read boundary。 | 是：Query/read only；benchmark only baseline input。 | 是。 | 是：无 numeric SLO/SLA/size pass。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-002` | 是：00 `NFR-MI-002/007/014/018`、03 recovery/error contract。 | 是：current zero-effect/no-write；PF recovery blocked。 | 是。 | 是：owner health/consumer result not claimed。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-003` | 是：00 security NFR/VETO direction、03/04 redline。 | 是：body-free/fail-closed only。 | 是。 | 是：scanner/policy external result remains pending。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-004` | 是：00 traceability NFR、03 state/UoW/history contract。 | 是：immutable/append-only; B03 and owner lanes explicit。 | 是。 | 是：digest/ref is not external truth or global readiness。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-005` | 是：00 consistency NFR、03 UoW/idempotency contract。 | 是：B01/B02 current stop; future positive lane reopen-only。 | 是。 | 是：no lease/TTL/cleanup/invented replay。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-006` | 是：03 config binding、04 strict configuration contract。 | 是：startup-only local composition and `ci-test` fake isolation。 | 是。 | 是：no remote provider/process/container readiness。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-007` | 是：00/01/03 dependency and zero-outbound contract。 | 是：six relation classes, marker-only inbound, zero outbound。 | 是。 | 是：sibling pending/fake/adapter not promoted。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-008` | 是：00 observability NFR、03 §14 safe signal/no-audit contract。 | 是：only local safe signal; future trace UoW-bound。 | 是。 | 是：no backend/report/evidence/readiness substitution。 | `pass_with_explicit_blockers` |
| `AC-NFR-MI-009` | 是：05 evidence path and Step 3/4 baseline contract。 | 是：only future authorized actual run can instantiate pair。 | 是。 | 是：planned table/EV/fake/static output never evidence。 | `pass_with_explicit_blockers` |

以上停审只表示 9 个 future gate 的 requirement、design contract、phase boundary、planned TC/EV/path、failure disposition 与 residual 分类之间无已知设计冲突。它不表示任何 nonfunctional suite、benchmark、redaction scan、dependency audit、artifact/report pair 或 acceptance verdict 已存在。

## 7. 跨非功能门禁审计

| 审计项 | 结论 | 审计说明 / remaining boundary |
|---|---|---|
| 22 个 `NFR-MI-*` 是否都有可归属的非功能 gate | pass | `AC-NFR-MI-001~009` 聚合覆盖 read、availability、security、traceability、consistency、config、dependency、observability 与 evidence/quantitative residual；未把新指标写入需求。 |
| P0 structural gate 与 P1/P2 quantitative/external quality 是否分离 | pass | structural failure可判定；workload/SLO/size/retention、real external outcome、scanner/signature policy和backend仍留 §5.3 residual。 |
| threshold 是否都有正式来源 | pass | 所有 P0 threshold均为离散禁止/要求；没有任一 latency、throughput、capacity、SLO/SLA、image size、retention或扫描数字。 |
| read/no-write、recovery、state/UoW/idempotency 是否与 Step 7/8 一致 | pass_with_explicit_blockers | 10 Query、2 inbound、6 Job、10 Command current stop、19 matrix / 20 subject 的定义未变；B01/B02、B03、OPEN、PF仍阻断受影响正向 lane。 |
| static/live、redaction、pin、config、dependency/outbound 与 readiness 防污染是否一致 | pass | forbidden material、`latest`、fake/adapter/`Assembled` promotion、sibling compile and outbound are all P0 failure directions；VETO disposition deferred to Step 11。 |
| observability 与 actual evidence 是否被混淆 | pass | safe log/metric/span/trace只是诊断切口；same-run artifact/report/evidence-index完整性由 Step 10 扩展核验。 |
| planned TC/EV/path 是否被写成实际 evidence | pass | 全文只使用 planned/future/family/path；没有 run id instance、artifact、report、digest、verdict、signoff或 readiness。 |
| sibling/owner pending 是否被闭合或被当作本仓 defect | pass | `MI-UP-*`、`Q-MI-*`与外部 oracle缺失仍为 blocked/not_evaluable；不会被fake、gap、marker或local entry转成 pass。 |
| 是否存在孤儿、重复或冲突的 P0 nonfunctional gate | pass | 九项均有正式来源、flow、TC、EV family和future report path；Step 10仍必须对实际 evidence/index形成最终闭环。 |

跨审计结论：Step 9 的非功能裁决口径已闭合到当前正式设计和 planned testing contract，且没有发现无来源量化阈值、P1/P2 污染 P0、外部 readiness 提升、planned evidence 伪造或与 Step 6~8 冲突的设计级问题。所有实际证据、VETO、defect、risk acceptance和最终结论仍未生成。

## 8. 回填草稿（正式 §9）

> 校准来源：  
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`  
>
> 延伸阅读：  
> - 建议继续阅读本中间产物的“非功能验收表”“设计契约 → flow → TC → EV → future report path 闭环”“P1/P2 quantitative 与 external-quality residual”“非功能失败裁决表”“逐项停审”和“跨非功能门禁审计”。

正式 `06-验收标准.md` 第 9 章应保留以下结论：

- 非功能验收由 `AC-NFR-MI-001~009` 构成，覆盖 read-path structural boundary、availability/degradation/recovery、security/static-live、immutable pin and traceability、consistency/idempotency/replay、strict config/profile/fake isolation、dependency/zero outbound、safe observability 及 future actual evidence/report integrity。所有 P0 条目必须回指正式设计、planned TC/EV family 与固定的 `<run_id>` report path；这些引用在当前仅是规划，不能视为 evidence instance。
- P0 阈值只使用正式设计中已存在的离散约束：no build/registry/instantiation/external-body/repair on reads、fail-closed/no-write/no-blind-retry、body-free/no-`latest`、immutable/append-only、strict whole-config reject、TestOnly fake isolation、sibling compile zero、outbound inventory `ImageOutboundEventInventory::NoneAuthorized`、safe finite diagnostic fields与同 run artifact/report pairing。任何违反均使对应 P0 gate failed，且涉及红线时仅作为 Step 11 VETO candidate，不可由风险接受覆盖。
- 时延、吞吐、容量、SLO/SLA、image size、retention、scanner/signature/BOM policy、real builder/registry/gate/Artifact/consumer quality、remote provider/process/container、observability backend与生产级环境均没有当前获权阈值或 owner oracle。`TC-PERF-001` / `EV-PERF-001` 只能形成 future baseline input；external positive assertion必须为 `blocked/not_evaluable`，不得由 fake、adapter、marker、cache、local entry、slot `Available` 或 `Assembled` 升格为 pass/readiness。
- current 10 Command 与 6 Job 在 `DDD-S9-B01/B02` 前仍为 zero-effect；10 Query strict read-only；2 conditional inbound 恒为 `accepted_input=false` marker；PF、B03、OPEN、`MI-UP-*`、`Q-MI-*` 限制仍显式保留。actual artifact/report、evidence index、VETO、defect、risk acceptance、verdict、signoff和readiness均留后续 Step 与未来授权的实际验收处理。

## 9. 待确认事项、自检与进入下一步条件

| 事项 | 状态 | 当前处理 / 重开条件 |
|---|---|---|
| `DDD-S9-B01/B02` canonical input / result shell-body mapper | open | current Command/Job stays zero-effect; future local mutation/replay NFR remains reopen-only. Close formal design then reopen affected 03/05/06 items. |
| `DDD-S11-B03` availability transition terminal persistence | open | immutable/append-only requirement remains; positive supply history persistence is blocked, not failed or accepted. |
| `DDD-S13-OPEN-01/02` in-flight / namespace policy | open | no lease, TTL, cleanup, raw-key global index or invented replay; future concurrency quality remains blocked. |
| `PF-UNAVAILABLE-RECOVERY` | open | no `Unavailable -> Rebuilding/Fresh`, query repair or blind retry; requires formal recovery flow and UoW/version contract. |
| `MI-UP-001~009`、`Q-MI-001~004` | owner-controlled pending | local ref/gap/marker/no-write boundary only; closure requires owner formal contract, affected design/test/acceptance reopening and selected-run baseline. |
| quantitative workload/baseline and external quality oracle | absent / not authorized | retain §5.3 residual; no numeric assertion, scanner/signature claim or production quality verdict. |
| actual delivery, run, artifact/report pair, EV instance and acceptance result | absent by design | do not create or infer; Step 10 will only define evidence gate, not fabricate the material. |
| implementation, test execution and commit | not authorized / not performed | no code, test run, report, digest, verdict, signoff, readiness or commit. |

自检结论：

- 9 个非功能验收项均有可追溯正式来源、明确 future pass/failure、受控 flow/phase、planned TC、EV family 与 fixed future report path；没有孤儿 P0 gate。
- P0 structural constraints、量化残余、owner-controlled external quality与 actual-evidence integrity 已分层；未把缺 baseline/owner oracle 写成 pass、failure 或 risk acceptance。
- Query/no-write、current zero-effect、strict config、static/live、append-only、dependency classification、zero outbound、safe observability 和 no-readiness-promotion 与 Step 5~8 口径一致。
- 未创建或伪称 implementation、test execution、run、artifact、report、evidence instance、digest、verdict、signoff或 readiness；未修改正式 06。

进入下一步条件：

| 条件 | 状态 | 说明 |
|---|---|---|
| 非功能验收口径可裁决 | `pass_with_explicit_blockers` | 九个 P0 structural gate和残余边界见 §5~§7；external positive quality仍不具 oracle。 |
| 每个非功能验收项已停审 | `pass_with_explicit_blockers` | §6 已逐项核对正式契约、flow、TC/EV/path与阈值来源。 |
| 跨非功能门禁审计无 unresolved design conflict | `pass` | §7 未发现 threshold pollution、phase conflict、evidence substitution或P1/P2 contamination。 |
| 可进入 Step 10 | `pass` | 下一步只能定义可观测性、审计与证据门禁；不得提前生成实际 evidence、VETO或正式 06。 |

```text
step_09_status = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_10
next_allowed_action = create_and_complete_step_10_evidence_audit
formal_06_write_allowed = false_until_step_15
actual_evidence_generated = false
actual_verdict_generated = false
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
