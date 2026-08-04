# L4-observability 05-测试方案 Step 07 · 测试数据设计

## Step 状态

| 字段 | 当前值 |
|---|---|
| 文档 / Step | `05-测试方案 / Step 07 设计测试数据` |
| mode | `full-restart` |
| status | `completed_current_with_inherited_affected_open` |
| current_module | `all` |
| direct_input | current Step 06：99 个唯一 TC / candidate EV、16 切口、60 协议、27+1 状态和 phase 矩阵 |
| historical_material | 旧 81 行稿使用已废弃 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等对象并缺数据隔离/清理/用例映射，已删除，不继承 |
| implementation / test execution | `not_started` |
| real run_id / evidence / result | `absent_by_design` |
| new_upstream_blocker | `none` |
| inherited_blocker | I05 schema/binding、J06 H13 及其余 affected 保持开放 |
| next_allowed_action | 读取 Step 08 标准与 current 环境 / 配置输入，重建测试环境与配置矩阵 |

## 1. 本步输入

| 输入 | 使用内容 |
|---|---|
| `05_test_plan_step_06_cases.md` | 99 TC 的前置 fixture class、assertion、protocol/state/phase 映射 |
| `03-详细设计.md` §5~§13 | exact typed ref、owner/state、DTO/envelope、logical store、UoW、idempotency、source version、plan/claim/fence/token |
| `03-详细设计.md` §15 | planned module/protocol/state/fault/concurrency/config/redaction 数据需求 |
| `04-配置设计.md` §5~§11 | `LocalTest` / `IntegrationLike` / `RuntimeLike` 合法组合、typed snapshot、secret/locator、availability、activation |
| 测试 SOP Step 07 / 书写规范 §5.7 | 可重复生成、独立负向数据、隔离、清理、替身与逐切口停审 |
| L1-governance / L1-artifact Step 07 | 数据集粒度与审计结构参考，不复制业务对象 |

## 2. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 基础数据 | typed ref/metadata、accepted local owner graph、committed read facets、immutable event snapshots、idempotency/result、Job plan/item/report、typed config snapshot 必须可重复构造 |
| 边界/异常/并发/恢复数据 | missing/wrong-owner/body-bearing、visibility/freshness variants、terminal/reserved state、same/conflict digest、CAS/fence race、commit/external unknown、corrupt immutable material 各用独立 dataset |
| 隔离 | harness-local `fixture_namespace` + `case_id` 是最高隔离键；durable identity、operation key、source event、scope、work key和binding在该 namespace 内唯一。它不是产品 `run_id` |
| 清理 | unit/contract 数据 drop value；fake reset namespace；durable-like 数据按 namespace 删除或 transaction rollback；forbidden sentinel corpus只存在于隔离输入文件/内存，不进入 shared store |
| 外部依赖替身 | `LocalTest` 用 formal fake/controlled/disabled；`IntegrationLike` 用 durable repository + controlled/endpoint-like non-production adapter；`RuntimeLike` 不允许 synthetic fake/fixture shortcut，具体环境由 Step 08 决定 |
| P0 数据可构造性 | 99 TC 均映射到本步 dataset。若正式 DTO/state只能靠私改字段构造，视为上游可测试性 blocker，不在测试侧创设 schema/helper truth |
| 单独数据集 | redaction sentinel、corrupt store、unsupported schema、source-version ordering、commit unknown、external phase、claim/fence、config redline、dependency/history scan均与 happy path 分离 |
| 人工造数 | 不允许。所有 fixture由 deterministic builder、formal factory、repository conformance seed、finite corpus或controlled fake outcome产生 |

## 3. 当前材料诊断与改动前后对比

| 维度 | historical Step 07 | current 重建 |
|---|---|---|
| 对象 | 使用旧 log/metric/trace/audit 类 | 只使用 current owner、typed ref、DTO、state、snapshot、plan与report |
| 用例承接 | 未引用 current TC | 99/99 TC 通过切口映射到 dataset |
| 状态 | 无 27+1 状态 corpus | legal/illegal/terminal/reserved 形成有限 state corpus |
| 事务/恢复 | 无 fault schedule 或 uncertain outcome 数据 | stage failpoint、commit known/unknown、external outcome、fence race 独立数据集 |
| blocker | 将 I05/J06 当普通正向数据 | I05 只构造 missing activation/header gate；J06 只构造 controlled blocked inputs |
| 隔离/清理 | 未定义 | namespace、fake reset、durable cleanup与 sentinel disposal明确 |
| 敏感材料 | 未区分 fixture 与真实 secret | 只用不可误认的 synthetic sentinel；严禁真实 credential/body/evidence |

## 4. 数据设计取舍

| 议题 | 采用 | 放弃 | 理由 |
|---|---|---|---|
| 构造入口 | public DTO builder、domain factory/member、repository conformance seed | 测试直接修改 private state/row | 保证 fixture 与可落码契约一致 |
| 可损坏数据 | 仅 corruption test 通过 adapter-level raw seed 注入，并标 `corrupt_fixture_only` | 用 domain builder制造不可能状态 | 明确区分输入拒绝与已持久化一致性缺陷 |
| 外部数据 | body-free typed refs + finite fake outcome | 拉取真实 sibling repo/产品数据 | 保持依赖裁剪和可重复性 |
| forbidden material | synthetic sentinel corpus | 真实 secret、用户正文、provider response | 可验证泄漏且无敏感风险 |
| fixture 文件/函数路径 | 本步固定 dataset contract，不固定实现文件名 | 提前设计测试代码目录 | 路径由 Step 09/`07` implementation boundary 固定 |
| RuntimeLike | 只定义禁止 synthetic shortcut 与 body-free canary约束 | 在本步声称 staging 数据已存在 | 环境实例与可用性属于 Step 08 |

## 5. 通用 fixture / builder / seed 规则

### 5.1 身份、时钟与命名空间

| 规则 | 数据契约 |
|---|---|
| namespace | 每次 suite execution 生成 harness-local `fixture_namespace`;不得作为 application `JobRunId`、external run或 evidence identity |
| typed IDs | 由 deterministic ID port 或 durable test allocator 按 owner type分别生成；相同 opaque bytes 也不得跨 ref type复用 |
| clock | `LocalTest` fixed monotonic clock；`IntegrationLike` controlled system clock envelope；time不充当 version/source order/abort proof |
| actor | API使用 synthetic authenticated actor ref；Consumer使用 route-bound synthetic system actor；Job使用 synthetic operator/system actor |
| operation key | raw key在 `(exact operation, actor)` scope内生成；同 key跨 actor/operation专门用于隔离测试 |
| source event | producer + source event ref + optional source version在 namespace 内唯一；dedup key不是其 identity substitute |
| no real run | dataset 中的 `execution_ref` 仅为 local Job execution fixture；不得命名/解释为真实运行 run_id |

### 5.2 构造与变异纪律

1. 先由 canonical valid builder 产生最小合法对象，再通过一个 named mutator 构造 missing/wrong-owner/unsupported/forbidden case；一个 negative fixture 默认只改变一个变量。
2. Domain state通过 formal factory/member sequence产生。Terminal/reserved/illegal case从合法 pre-state开始调用非法 action，不直接 seed伪造 post-state。
3. Corruption fixture例外地在 repository adapter边界注入 dangling ref、wrong digest、duplicate head或partial row；必须与正常 builder隔离并在 case结束销毁。
4. Event fixture保存 exact serialized body-free bytes、digest、schema、binding、subject、cursor与trace snapshot；owner后续变化不更新该 fixture。
5. Job fixture在 start时冻结 plan/config/items/digest；resume fixture只能读取该快照，不能重新 list或读取 current config。
6. I05 fixture不定义 `ArtifactEvidenceContextPayload` body/schema，也不伪造 producer event；只构造 slot-disabled、missing-registration与 unparsed opaque sentinel。
7. J06 fixture不构造 positive H13、Completed execution或 external replay receipt；只构造 Approved scope guard input与 H13 capability absent/blocked outcome。

### 5.3 隔离与清理

| 数据形态 | 隔离键 | 清理方式 | 禁止 |
|---|---|---|---|
| value/DTO/state table | `fixture_namespace + case_id` | drop value / process reset | global mutable singleton |
| fake repository/adapter | namespace + exact port subject | `reset(namespace)` 或新 instance | 在 case间共享 call history |
| durable-like repository | namespace + typed owner/work key | transaction rollback或 verified namespace cleanup | truncate共享环境、人工删行 |
| concurrency barrier | namespace + race case + participant | join all participants后销毁 | background worker跨 case存活 |
| forbidden sentinel | sentinel case ID | memory zero/drop或删除 isolated fixture artifact | 写入 durable store/log/report |
| config candidate | profile + config case + digest | drop candidate/secret fake | 修改 shared defaults/env |
| document/dependency corpus | content digest | read-only，无清理 | 修改目标源码作为 fixture |

## 6. Canonical 数据集目录

### 6.1 Harness、protocol 与 reference 数据

| 数据集 | 用途 / 内容 | 构造方式 | 隔离 / 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-OBS-NS-001` | namespace、typed ID ranges、actors、fixed/controlled clock | harness seed，不进入 public DTO except generated typed refs/time | namespace drop | 全部动态 TC |
| `DS-OBS-REF-001` | receipt/signal/audit/evidence/handoff/retention/gap/outbox/report等合法 typed refs | owner-specific validated builders | value drop | contract/owner及所有主线 |
| `DS-OBS-REF-NEG-001` | missing、malformed、wrong-owner、same-bytes-different-type refs | one-variable mutators；无 raw正文 | value drop | `COR-002`,`AUD-002`,`EVD-002`,`OWN-004` |
| `DS-OBS-META-001` | 16 Command、14 Query、9 Consumer、9 Job合法 metadata/envelope header | exact operation/actor/key/schema/producer builders | value drop | protocol positive rows |
| `DS-OBS-META-NEG-001` | missing field、route-body mismatch、unsupported schema、ambiguous selector/page cursor | named protocol mutators | value drop | `QRY-002/003`,`EVD-004`,`CFG-002` |
| `DS-OBS-DIGEST-001` | canonical Option/enum/ref/set/list corpus + same/conflict digest pairs | canonicalizer golden candidates；不含 raw key/time/trace | value drop | `ING-003/004`,`UOW-004`,`NFR-001` |
| `DS-OBS-SOURCE-VERSION-001` | same producer/source 的 Older/Equal/Newer 与 cross-source Uncomparable | typed comparator fake + opaque tokens | fake reset | I01~I09 ordering、`DEG-005` |

### 6.2 Observation truth / safety / audit 数据

| 数据集 | 用途 / 内容 | 构造方式 | 隔离 / 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-OBS-INTAKE-001` | Received receipt + Pending disposition，含 matching body-free source/safe summary | C01-compatible builders/factories | owner namespace cleanup | `ING-001`,`RED-001`,`REL-001` |
| `DS-OBS-INTAKE-NEG-001` | rejected/quarantined/degraded preconditions、missing summary、forbidden marker | formal transition sequence + isolated sentinel | cleanup owner + sentinel | `ING-002`,`RED-002/004` |
| `DS-OBS-CORRELATION-001` | accepted receipt、matching source/trace/causation/seed，Unbound/Partial/Bound contexts | formal C03 factory/member sequence | owner namespace cleanup | `COR-001~003` |
| `DS-OBS-SIGNAL-001` | body-free safe summary、Candidate/Recorded/Stale/Suppressed signal、rollup window | formal signal/rollup factories | owner namespace cleanup | `SIG-001/003~005`,`REL-003` |
| `DS-OBS-AUDIT-001` | body-free source audit relation、Pending/Restricted/Appended projection、H3 append input | formal relation fake + C05 owner builders | owner namespace cleanup | `AUD-001/003/004`,`REL-002` |
| `DS-OBS-EVIDENCE-001` | existing projection、body-free evidence boundary/digest summary、Candidate/Linked/Stale/NotVisible | formal resolver outcomes + owner builders | reset resolver + cleanup owner | `EVD-001/003`,`AUT-001` |
| `DS-OBS-EVIDENCE-NEG-001` | body response、missing digest、wrong owner、BodyBlocked、I05 registration absent | isolated sentinel + finite resolver/activation outcomes；无 I05 canonical DTO | reset/delete isolated data | `EVD-002/004`,`AUT-003` |

### 6.3 Read、handoff、retention 与 gap 数据

| 数据集 | 用途 / 内容 | 构造方式 | 隔离 / 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-OBS-READ-001` | Q01~Q14 visible hit/empty/page fixtures与same-binding cursors | committed read facet seeds from formal owners | read namespace cleanup | `QRY-001/002`,`NW-001` |
| `DS-OBS-READ-SURFACE-001` | Missing/NotVisible/Restricted/Stale/Rebuilding/Unavailable/Degraded exact variants | policy/freshness builders；每 variant独立 | read namespace cleanup | `DEG-001~003`,`QRY-003` |
| `DS-OBS-READ-CORRUPT-001` | dangling relation、wrong scope/binding、duplicate current head、missing progress | `corrupt_fixture_only` adapter seed | mandatory namespace delete | `DEG-004`,`DIA-002`,`QRY-003` |
| `DS-OBS-DIAGNOSTIC-001` | consistent view/summary/freshness/progress/target/binding composite | projection assembler compatible seed | namespace cleanup | `DIA-001`,`QRY-004` |
| `DS-OBS-HANDOFF-001` | complete canonical linkage/audit/gap set、immutable input、Draft/Prepared/readiness/hint | Query preview builder then C07-style revalidation/snapshot seed | handoff namespace cleanup | `RPT-001`,`AUT-001/002`,`REL-004` |
| `DS-OBS-HANDOFF-NEG-001` | constituent mismatch、blocking gap、NotVisible、hold/no-write block、missing report ref | one-variable relation/policy mutators | namespace cleanup | `RPT-002/005`,`AUT-003` |
| `DS-OBS-RETENTION-001` | Unmarked/ActiveHold/ReleaseEligible/Conflict marker + canonical active consumer set | formal C09/C10 transition sequence | namespace cleanup | `RET-001~005`,`REL-005` |
| `DS-OBS-GAP-001` | Open/Acknowledged/Resolved、degraded None/Active/Blocked与真实 local resolution basis | formal C13/scan builders；reserved variants只作 action target | namespace cleanup | `DEG-002/005`,`REB-002` |

### 6.4 Persistence、UoW、幂等、cursor 与 corruption 数据

| 数据集 | 用途 / 内容 | 构造方式 | 隔离 / 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-OBS-UOW-ORDER-001` | accepted mutation 的 reserve、load、transition、owner/membership、single tagged cursor、history/index/outbox/stale、result/completion、commit 调用序列 | 以 exact façade 对应的 recording UoW 和 formal owner builders 组成；每 stage 有稳定 ordinal | 每 case 新 UoW spy；drop call log | `UOW-001`,`AUD-001`,`REL-001/002` |
| `DS-OBS-UOW-FAILPOINT-001` | transition 后至 commit 前每个 mandatory stage 的 known failure schedule，另含 begin/reserve/load/commit known-abort | one-failpoint-at-a-time repository/UoW fake；成功 baseline 与 fault row 分离 | namespace rollback + fake reset；逐 row 检查 zero residue | `AUD-004`,`RET-004`,`UOW-002`,`NW-003` |
| `DS-OBS-COMMIT-UNKNOWN-001` | commit 返回 unknown，durable probe 分为 actually committed、actually aborted、still unknown、inconsistent material | ambiguity-capable UoW fake + read-only reservation/result/owner/outbox probe seed | scenario namespace cleanup；probe call history reset | `UOW-003`,`REB-004`,`NFR-003` |
| `DS-OBS-IDEMPOTENCY-001` | Absent、Reserved same/conflict digest、Completed same digest + compatible result、Completed missing/mismatched result | atomic reservation fake 或 durable conformance seed；scope 固定为 exact operation + actor + raw key | operation/actor/case namespace；rollback/delete | `ING-003/004`,`UOW-003/004`,`OWN-004` |
| `DS-OBS-CAS-CURSOR-001` | current/fresh/stale expected version、unique conflict、observation/reference cursor、second assignment、cursor allocation fault | versioned owner seed + namespace-tagged cursor allocator fake | namespace reset；durable row delete | `COR-003`,`SIG-004`,`RET-003`,`UOW-005` |
| `DS-OBS-READ-FENCE-001` | source revision before/after mutation、one consistent committed read fence、mismatched source capture | deterministic concurrency barrier + versioned read repository | join participants then namespace cleanup | `QRY-004`,`DEG-004`,`REB-001/002` |
| `DS-OBS-OUTBOX-001` | E01~E12 exact committed serialized bytes、digest、schema、binding、cursor、stable event token与 Pending/Published/Failed/DeadLettered marker | accepted UoW snapshot builder；owner 后续 mutation 使用独立 version | outbox work identity namespace；delete marker/snapshot | `AUD-001/004`,`UOW-001/002/006/007` |
| `DS-OBS-OUTBOX-CORRUPT-001` | missing payload、digest mismatch、binding mismatch、duplicate current marker、payload/schema incompatibility | 仅 adapter-level `corrupt_fixture_only` seed；不得从 current owner 修补 | mandatory isolated durable cleanup | `DEG-004`,`UOW-006`,`REB-002`,`NFR-003` |
| `DS-OBS-RECOVERY-CLASS-001` | 八类 recovery class 各一组 typed trigger 与 allowed/forbidden action expectation | finite outcome table，直接引用 current error/recovery enum；不按 message 分类 | value drop + fake call reset | `SIG-005`,`RPT-004`,`UOW-003/007`,`NFR-003` |
| `DS-OBS-WRITE-SPY-001` | reservation/UoW/owner/history/cursor/outbox/stale/job/external/source writer 的独立计数与调用参数摘要 | least-authority spy ports；forbidden writer 只暴露 fail-on-call | 每 case 新 instance，drop/reset | `QRY-001~004`,`DIA-003/004`,`NW-001~005`,`OWN-002/003` |

### 6.5 Job plan、claim/fence、report、resume 与 external phase 数据

| 数据集 | 用途 / 内容 | 构造方式 | 隔离 / 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-OBS-JOB-PLAN-001` | J01~J09 的 exact operation、canonical work key、bounded immutable item set、input digest、binding/config snapshot、Draft report ref | public Job input builder -> start service -> committed immutable plan seed；不直接写 terminal plan | execution fixture namespace；delete plan/items/report | `REB-001/002/004`,`UOW-008`,`CFG-003` |
| `DS-OBS-JOB-PLAN-NEG-001` | empty/oversized/incomplete scope、duplicate work key、missing stored input、changed resume digest/binding | canonical plan candidate 的 one-variable mutator；invalid candidate不得持久化 | value drop；若 start 已触发则 rollback namespace | `REB-002/004`,`RPT-002`,`UOW-008` |
| `DS-OBS-JOB-ITEM-001` | Planned、Running、Succeeded、FailedRetryable、FailedPermanent、Blocked、SkippedTerminal item 与 exact changed/progress/failure refs | formal plan item factory/member sequence；每 terminal classification 单独 item | execution + work key；namespace cleanup | `REB-001~004`,`UOW-008` |
| `DS-OBS-CLAIM-FENCE-001` | no claim、fresh Active claim、Expired/Released claim、strictly increasing fence、two-worker race与 stale commit | durable claim repository conformance seed + deterministic barrier | join workers；release/delete claim namespace | `REB-003/004`,`UOW-005/008` |
| `DS-OBS-JOB-REPORT-001` | Draft 及 Completed/PartiallyCompleted/FailedRetryable/FailedPermanent/Blocked canonical folds；compatible stored result | fold 只读取 fresh-fence committed terminal item outcomes；counts/refs canonical sort | execution/report namespace cleanup | `REB-001/004/005`,`UOW-008` |
| `DS-OBS-JOB-REPORT-NEG-001` | Planned/Running item仍存在、tampered count/ref、missing/wrong report ref、terminal refinalize、parallel finalizer | report candidate mutator + report CAS barrier；不 mint fallback report ref | namespace cleanup + barrier join | `RPT-002`,`REB-003/004`,`UOW-008` |
| `DS-OBS-JOB-RESUME-001` | earlier committed terminal items、one retryable item、one unclassified item、frozen plan/config/binding 与 terminal duplicate | start/execute/fail/commit 的 formal sequence生成；resume listing spy必须为0 | execution namespace cleanup | `REB-004`,`UOW-008`,`REL-005` |
| `DS-OBS-EXTERNAL-INTENT-001` | J01/J07/J08 durable prepare intent、historical binding、stable token、immutable material digest、local phase marker | prepare UoW builder；call 只能读取 committed intent view | intent/work namespace cleanup | `RPT-003/004`,`UOW-007`,`NW-004` |
| `DS-OBS-EXTERNAL-OUTCOME-001` | known success + receipt、known failure、unknown、unsupported、probe existing/missing/unknown、local finalize known/unknown | finite controlled adapter/probe schedule keyed by same token/binding/material | fake schedule reset；local intent namespace cleanup | `RPT-003/004`,`EXT-002`,`UOW-007`,`NFR-003` |
| `DS-OBS-J06-BLOCKED-001` | approved observation-side replay scope、immutable plan、H13 capability absent/mismatch、controlled Blocked/manual classification | formal local scope/plan builder + capability fake；无 positive H13 response | namespace cleanup；no external receipt exists | `REB-005/006`,`NW-002`,`REL-005` |
| `DS-OBS-PERIPHERAL-001` | product-neutral consumer/scope/view/preparation/binding 与 Pending/Prepared/Delivered/Failed/Blocked local states | typed seam builders + controlled adapter outcomes；不含 dashboard/GRC/vendor DTO | consumer/scope namespace cleanup | `EXT-001/002`,`RPT-003/004`,`NW-004` |

### 6.6 Profile、config redline、activation、sentinel 与静态 corpus

| 数据集 | 用途 / 内容 | 构造方式 | 隔离 / 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-OBS-CONFIG-PROFILES-001` | `LocalTest`、`IntegrationLike`、`RuntimeLike` 三组完整 raw candidate、validated typed snapshot、binding/config identity | 仅使用 formal `04` canonical root、61 ENV 与 finite enum；每 profile 由正式 loader/validator 输入生成 | profile + config case + digest；drop candidate/private handles | `CFG-001/003`,`REB-004`,`UOW-007` |
| `DS-OBS-CONFIG-REDLINE-001` | missing required、unknown/duplicate key、wrong type/range、cross-field/profile invariant、forbidden secret/locator/public config、schema/state/security override | 对合法 candidate 每次只施加一个 named mutator；不引入 alias/default | candidate drop；secret fake teardown | `CFG-002/006`,`RED-003`,`NFR-002` |
| `DS-OBS-ACTIVATION-FAULT-001` | 13-stage builder 与 registrar prepare/arm Nth failure、duplicate activation、cross-profile opaque set、revoke/join failure observation | deterministic failpoint schedule + registration call recorder；不形成 activated fact | fresh assembly per row；revoke/join/reset all handles | `CFG-004`,`NFR-003` |
| `DS-OBS-AVAILABILITY-001` | Disabled、Unavailable、Misconfigured、Degraded 及 required capability Available probe；slot/binding/history capability variants | body-free controlled capability fake；health/ack不映射业务成功 | fake reset；snapshot drop | `CFG-001/005`,`EVD-004`,`EXT-002` |
| `DS-OBS-SENSITIVE-REF-001` | synthetic locator/credential refs、private resolved handles、rotation old/new binding identity、missing historical resolution | dedicated secret/locator fake；public observation只记录 bounded safe issue | private handle teardown/zero；namespace drop | `CFG-002/005`,`RPT-004`,`UOW-007` |
| `DS-OBS-SENTINEL-001` | 唯一且可搜索的 synthetic raw body、secret、endpoint、provider response、runtime result、fake verdict/signoff/run/evidence alias markers | generated marker带 `fixture_namespace/case_id`；只注入 pre-redaction input或isolated source corpus | memory drop/zero，删除 isolated corpus；禁止 durable cleanup依赖搜索 | `ING-002`,`RED-002~004`,`SIG-002/006`,`RPT-005`,`AUT-003` |
| `DS-OBS-TELEMETRY-SCHEMA-001` | log field、metric label、span attribute、audit event、error/report/event DTO finite declaration corpus及 cardinality candidate | 从 current formal schema/source declaration只读提取；与 forbidden name/value corpus 对照 | read-only；无清理 | `RED-003`,`SIG-006`,`TRUTH-003`,`NFR-002` |
| `DS-OBS-DEPENDENCY-CORPUS-001` | manifests、module graph、public API、route/catalog、trait/capability index与 sibling writer denylist | repository snapshot/content digest；不修改 source | read-only；无清理 | `DEP-001~003`,`DIA-004`,`NW-005`,`OWN-001/002/004`,`EXT-003` |
| `DS-OBS-HISTORY-CORPUS-001` | current formal/calibration 与 README/旧 formal/pre-M3 名称、key、state、profile 差异 corpus | path + content digest + classification(`current_truth`/`historical_material`) | read-only；无清理 | `HIST-001/002`,`NFR-001/002` |
| `DS-OBS-TRUTH-COMPARISON-001` | observation projection/signal/summary/handoff/report 与 source business truth、acceptance truth 的 role pairs | finite contract comparison table；只含 typed refs和role，不含业务 body | value drop | `TRUTH-001~003`,`EXT-001`,`OWN-003` |
| `DS-OBS-EVIDENCE-DESIGN-001` | 99 TC、99 candidate EV、assertion set、artifact class、AC/VF 引用的 planned index | 从 Step 05/06 current ID只读生成；candidate不是alias或artifact | read-only generated view；无 real run cleanup | `NFR-001`,`REL-001~005` |

## 7. 27 个正式状态 owner + 1 个技术协调状态数据 corpus

### 7.1 Corpus 构造规则

1. 每个 owner 的 canonical row 从 formal factory 或合法 member sequence开始；测试不能直接 seed private enum 字段。
2. `legal seed` 用于验证 exact transition 与 accepted write-set；`negative action` 从合法 pre-state调用非法、terminal或reserved action，并断言 owner/version/history/outbox/result不变。
3. 同名 variant 不跨 owner复用。`Blocked`、`Failed`、`Fresh` 等只能由其 exact owner builder解释。
4. `ReadVisibilityKind` 是 per-context 决策数据；不持久推进。`ObservationJobPlanItemState` 是 durable coordination state，但不计入27个业务/投影 owner。

### 7.2 状态数据集目录

| # / 数据集 | exact owner | canonical / legal seed | 独立 negative / terminal / reserved seed | 关联 TC |
|---|---|---|---|---|
| 01 `DS-OBS-STATE-RECEIPT-001` | `ObservationReceiptState` | factory `Received`，再按 guard 生成 Accepted/Rejected/Quarantined/Degraded | Rejected/Superseded重开、Accepted回Received、reserved Superseded action | `ING-001/002`,`RED-002` |
| 02 `DS-OBS-STATE-SAFETY-001` | `SafetyDispositionState` | Pending -> Safe/Redacted/Rejected/Quarantined；Quarantined -> Rejected | terminal互转/回Pending、marker-summary incompatibility | `RED-001/002` |
| 03 `DS-OBS-STATE-CORRELATION-001` | `CorrelationContextState` | Unbound/Partial -> Bound，允许有依据Partial/Invalid与Bound保态 link | Invalid重开、opaque ref冲突或source mismatch | `COR-001~003` |
| 04 `DS-OBS-STATE-SIGNAL-001` | `SafeSignalState` | Candidate/Stale -> Recorded；Recorded -> Stale；nonterminal -> Suppressed | Suppressed恢复、missing context/raw body/invalid summary | `SIG-001~005` |
| 05 `DS-OBS-STATE-AUDIT-001` | `AuditProjectionState` | PendingAppend/VisibilityRestricted -> Appended；正式 Restricted路径 | reserved Suppressed action、wrong relation append | `AUD-001~004` |
| 06 `DS-OBS-STATE-EVIDENCE-001` | `EvidenceLinkageState` | Candidate/Stale/NotVisible -> Linked；Candidate -> BodyBlocked | BodyBlocked恢复、body-bearing/wrong-owner Linked | `EVD-001~003` |
| 07 `DS-OBS-STATE-HANDOFF-001` | `ReportHandoffState` | Draft/Failed -> Prepared；Prepared -> Delivered/Failed | Draft直达Delivered、Delivered重开、reserved Cancelled | `RPT-001~005` |
| 08 `DS-OBS-STATE-READINESS-001` | `HandoffReadinessState` | immutable input policy生成 PendingEvidence/Ready/Blocked/Degraded | blocking gap/NotVisible/hold下 Ready、Query持久 reevaluate | `RPT-001/002`,`QRY-003` |
| 09 `DS-OBS-STATE-AUTHENTICITY-001` | `AuthenticityHintState` | Unassessed/Insufficient -> RealEvidenceLinked/PlaceholderDetected；Unassessed -> Insufficient | no-origin Real、terminal hint重写 | `AUT-001~003` |
| 10 `DS-OBS-STATE-RETENTION-001` | `RetentionMarkerState` | Unmarked/ReleaseEligible/Conflict -> ActiveHold；正式ReleaseEligible/Conflict | Released重开、reserved release、active ref下release | `RET-001~005` |
| 11 `DS-OBS-STATE-PROTECTION-001` | `ActiveReferenceProtectionState` | attach -> Protected；Protected -> Expired/Conflicted；empty guarded owner -> Released | non-empty release、Released重开、duplicate ref分叉 | `RET-002~005` |
| 12 `DS-OBS-STATE-REPLAY-SCOPE-001` | `ReplayScopeState` | Defined -> Approved/Blocked/Cancelled；Approved允许受控Blocked/Cancelled | empty/external target、terminal重开、H13缺失却Completed | `REB-005/006`,`NW-002` |
| 13 `DS-OBS-STATE-NOWRITE-001` | `NoWriteViolationState` | Detected -> Blocked/Escalated；Blocked -> Escalated/Closed；Escalated -> Closed | Closed重开、missing target、persistence fail冒充durable | `NW-003`,`UOW-002/003` |
| 14 `DS-OBS-STATE-GAP-001` | `GapLifecycleState` | Open -> Acknowledged；mitigate；formal basis -> Resolved | no-basis close、Resolved重开、reserved suppress/unsuppress | `DEG-002/005`,`UOW-005` |
| 15 `DS-OBS-STATE-DEGRADED-001` | `DegradedOutputKind` | policy产生新的 None/Active/Blocked owner replacement | Active/Blocked原地reset、Blocked返回替代success、Query reset | `DEG-001~005` |
| 16 `DS-OBS-STATE-ROLLUP-001` | `SignalRollupState` | allowed Pending/Fresh/Stale/Failed -> Rebuilding；complete cursor -> Fresh；failure -> Failed | incomplete/raw source -> Fresh、wrong target、Query start | `SIG-004/005`,`REB-001~004` |
| 17 `DS-OBS-STATE-VISIBILITY-001` | `ReadVisibilityKind` | 每request独立生成 Visible/Restricted/NotVisible/Blocked | NotVisible当Missing、跨actor复用、持久推进 | `QRY-001~004`,`NW-001` |
| 18 `DS-OBS-STATE-DIAGNOSTIC-001` | `DiagnosticFreshnessState` | assembler生成 Fresh/Partial/Unavailable；accepted mutation -> Stale；maintenance replacement | Query repair、old summary原地Fresh、missing progress默认Fresh | `DIA-001/002`,`DEG-003~005` |
| 19 `DS-OBS-STATE-REFERENCE-001` | `ReferenceSnapshotStateKind` | Pending -> typed Resolved/Stale/Unresolved/Unavailable/Invalid | Invalid重开、Older/Equal mismatch覆盖、Resolved无safe summary | `DEG-001/004/005`,`UOW-005` |
| 20 `DS-OBS-STATE-MAINTENANCE-001` | `ProjectionMaintenanceStateKind` | Fresh/Failed -> Stale；Stale -> Rebuilding；fenced complete -> Fresh；failure -> Failed | Fresh直达Rebuilding、incomplete capture Fresh、Query start | `REB-001~004`,`QRY-003` |
| 21 `DS-OBS-STATE-REPLAY-COORD-001` | `ReplayCoordinationKind` | Pending -> Coordinating/Blocked；current可落地lane仅受控Blocked/manual | terminal重开、scope mismatch、H13缺失却Completed | `REB-005/006` |
| 22 `DS-OBS-STATE-ROLLUP-REBUILD-001` | `RollupRebuildKind` | Pending -> Running -> Completed/Failed，Completed需fixed cursor+seal | terminal回Running、reserved Cancelled、raw source | `REB-001~004`,`SIG-005` |
| 23 `DS-OBS-STATE-PERIPHERAL-001` | `PeripheralDeliveryKind` | Pending/Failed/Blocked -> Prepared；Prepared -> Delivered/Failed/Blocked | Delivered重开、reserved Cancelled、body receipt | `EXT-001/002`,`UOW-007/008` |
| 24 `DS-OBS-STATE-EXPORT-001` | `ExportPreparationState` | Draft/Failed/Blocked -> Prepared；Prepared -> Delivered/Failed/Blocked | Delivered重开、final conclusion字段、Blocked仍外调 | `EXT-001~003`,`UOW-007/008` |
| 25 `DS-OBS-STATE-OUTBOX-001` | `OutboxPublicationState` | Pending -> Published/Failed/DeadLettered；Failed same-token transition | Failed -> Pending、terminal重开、current-truth payload rebuild | `UOW-006/007`,`REB-003/004` |
| 26 `DS-OBS-STATE-IDEMPOTENCY-001` | `IdempotencyReservationState` | atomic empty -> Reserved；result-before-complete -> Completed；same digest Replay/InFlight | Completed -> Reserved、different digest覆盖、missing/mismatch result replay | `ING-003/004`,`UOW-003/004` |
| 27 `DS-OBS-STATE-JOB-REPORT-001` | `JobReportState` | Draft -> exact Completed/PartiallyCompleted/FailedRetryable/FailedPermanent/Blocked fold | terminal refinalize/edit、DuplicateReplayed写state、nonterminal item finalize | `REB-004/005`,`UOW-008` |
| T1 `DS-OBS-STATE-JOB-ITEM-001` | `ObservationJobPlanItemState` | Planned -> Running -> Succeeded/classified failure/SkippedTerminal；FailedRetryable -> Running | stale fence、changed plan、terminal report、unsupported retry/reopen | `REB-001~004`,`UOW-007/008` |

## 8. 99 个 P0 TC 的数据前置映射

本节的每一行只定义数据前置，不重复 Step 06 的操作和断言。`controlled` 是 finite fake outcome，
`durable-like` 是 repository/UoW conformance environment，`read-only` 是 source/document corpus。每个动态行隐含
`DS-OBS-NS-001`；表中仍明确列出会改变断言的 canonical、negative、fault 或 static dataset。

### 8.1 Intake、correlation、redaction、audit、evidence 与 signal：25 TC

| TC | canonical 数据 | 独立负向 / fault 数据 | 协作替身 | 隔离与清理 |
|---|---|---|---|---|
| `TC-OBS-ING-001` | `DS-OBS-INTAKE-001`,`DS-OBS-UOW-ORDER-001` | 无；clean safe-summary row | fake policy + durable-like UoW | owner namespace rollback/delete |
| `TC-OBS-ING-002` | `DS-OBS-INTAKE-NEG-001` | `DS-OBS-SENTINEL-001`,`DS-OBS-WRITE-SPY-001` | redaction/policy controlled fake | owner cleanup + sentinel drop |
| `TC-OBS-ING-003` | `DS-OBS-INTAKE-001`,`DS-OBS-IDEMPOTENCY-001` | same key + same `DS-OBS-DIGEST-001` completed row | reservation fake/durable-like | reservation/owner namespace cleanup |
| `TC-OBS-ING-004` | `DS-OBS-IDEMPOTENCY-001`,`DS-OBS-DIGEST-001` | conflict digest + Reserved in-flight row | atomic reserve fake + barrier | join participants;namespace cleanup |
| `TC-OBS-COR-001` | `DS-OBS-CORRELATION-001`,`DS-OBS-STATE-CORRELATION-001` | matching source/trace/causation row | relation resolver fake | owner namespace cleanup |
| `TC-OBS-COR-002` | `DS-OBS-CORRELATION-001`,`DS-OBS-REF-NEG-001` | absent/ambiguous/wrong-owner/source-mismatch mutator | finite relation resolver | value drop + fake reset |
| `TC-OBS-COR-003` | `DS-OBS-CORRELATION-001`,`DS-OBS-CAS-CURSOR-001` | equal-version two-writer barrier | durable-like CAS repository | join participants;owner cleanup |
| `TC-OBS-RED-001` | `DS-OBS-STATE-SAFETY-001`,`DS-OBS-INTAKE-001` | clean/redacted marker-summary pair | deterministic safety policy | value/owner cleanup |
| `TC-OBS-RED-002` | `DS-OBS-STATE-SAFETY-001`,`DS-OBS-INTAKE-NEG-001` | `DS-OBS-SENTINEL-001` + terminal/incompatible row | policy + write spies | sentinel drop;owner cleanup |
| `TC-OBS-RED-003` | `DS-OBS-TELEMETRY-SCHEMA-001` | forbidden field-name/value corpus | read-only schema/source corpus | no cleanup |
| `TC-OBS-RED-004` | `DS-OBS-SENTINEL-001`,`DS-OBS-WRITE-SPY-001` | pre/post serializer phase marker | serializer/outbox/telemetry spies | sentinel drop;spy reset |
| `TC-OBS-AUD-001` | `DS-OBS-AUDIT-001`,`DS-OBS-UOW-ORDER-001`,`DS-OBS-OUTBOX-001` | 无；visible body-free relation | source audit fake + durable-like UoW | projection/outbox namespace cleanup |
| `TC-OBS-AUD-002` | `DS-OBS-REF-NEG-001`,`DS-OBS-AUDIT-001` | missing/ambiguous/wrong-owner/body sentinel | relation fake + write spies | sentinel/value drop;owner cleanup |
| `TC-OBS-AUD-003` | `DS-OBS-AUDIT-001`,`DS-OBS-READ-SURFACE-001` | exact Restricted visibility row | visibility policy fake | projection/read namespace cleanup |
| `TC-OBS-AUD-004` | `DS-OBS-AUDIT-001`,`DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-OUTBOX-001` | H3/cursor/E04/stale/result single failpoint rows | durable-like fault UoW | rollback proof + namespace delete |
| `TC-OBS-EVD-001` | `DS-OBS-EVIDENCE-001`,`DS-OBS-STATE-EVIDENCE-001` | owner-backed body-free digest row | body-free resolver fake | linkage namespace cleanup |
| `TC-OBS-EVD-002` | `DS-OBS-EVIDENCE-NEG-001`,`DS-OBS-SENTINEL-001` | body/missing-digest/wrong-owner rows | finite resolver + sink spies | sentinel drop;fake reset;owner cleanup |
| `TC-OBS-EVD-003` | `DS-OBS-EVIDENCE-001`,`DS-OBS-READ-SURFACE-001` | NotVisible/Stale/Unavailable rows独立 | resolver/availability fake | linkage/read cleanup + fake reset |
| `TC-OBS-EVD-004` | `DS-OBS-EVIDENCE-NEG-001`,`DS-OBS-AVAILABILITY-001` | I05 registration/schema/binding absent；opaque unparsed sentinel | activation + parse/ack/write spies | no owner data；sentinel/spy reset |
| `TC-OBS-SIG-001` | `DS-OBS-SIGNAL-001`,`DS-OBS-CORRELATION-001`,`DS-OBS-UOW-ORDER-001` | 无；safe summary + valid context | signal relation fake + durable-like UoW | signal/rollup namespace cleanup |
| `TC-OBS-SIG-002` | `DS-OBS-SENTINEL-001`,`DS-OBS-WRITE-SPY-001` | raw log/metric/trace/runtime/provider markers独立 | redaction + sink spies | sentinel drop;all spies reset |
| `TC-OBS-SIG-003` | `DS-OBS-SIGNAL-001`,`DS-OBS-READ-SURFACE-001` | missing/partial/invalid context与stale ref rows | context resolver fake | signal/read cleanup + fake reset |
| `TC-OBS-SIG-004` | `DS-OBS-SIGNAL-001`,`DS-OBS-CAS-CURSOR-001` | same rollup/window two-writer barrier | CAS repository | join participants;namespace cleanup |
| `TC-OBS-SIG-005` | `DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-RECOVERY-CLASS-001` | resolver unavailable / rollup CAS failure rows | controlled resolver + fault UoW | rollback;fake reset;namespace cleanup |
| `TC-OBS-SIG-006` | `DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-SENTINEL-001` | forbidden/high-cardinality label/attribute corpus | read-only schema/cardinality scan | no durable data;sentinel corpus delete |

### 8.2 Degraded、Query、diagnostic、handoff、authenticity 与 retention：26 TC

| TC | canonical 数据 | 独立负向 / fault 数据 | 协作替身 | 隔离与清理 |
|---|---|---|---|---|
| `TC-OBS-DEG-001` | `DS-OBS-READ-SURFACE-001`,`DS-OBS-STATE-DEGRADED-001` | Missing/NotVisible/Stale/Rebuilding/Unavailable rows独立 | policy/availability fake | read namespace cleanup + fake reset |
| `TC-OBS-DEG-002` | `DS-OBS-GAP-001`,`DS-OBS-HANDOFF-NEG-001` | Open/Acknowledged/Blocked guard rows | external/write spies | gap/handoff cleanup;spies reset |
| `TC-OBS-DEG-003` | `DS-OBS-READ-SURFACE-001`,`DS-OBS-WRITE-SPY-001` | stale/partial diagnostic/rollup/read/reference rows | query repositories + fail-on-write spies | read cleanup;spies reset |
| `TC-OBS-DEG-004` | `DS-OBS-READ-CORRUPT-001`,`DS-OBS-OUTBOX-CORRUPT-001` | dangling/mismatch/duplicate-head/progress defect | durable-like corrupt adapter seed | mandatory namespace delete |
| `TC-OBS-DEG-005` | `DS-OBS-GAP-001`,`DS-OBS-SOURCE-VERSION-001`,`DS-OBS-READ-FENCE-001` | dependency unavailable then proven recovered | controlled dependency + mutation service | join/cleanup owner/read data |
| `TC-OBS-QRY-001` | `DS-OBS-READ-001`,`DS-OBS-WRITE-SPY-001` | Q01~Q14 visible hit/empty parameter rows | read repositories + exhaustive write spies | read namespace cleanup;spy reset |
| `TC-OBS-QRY-002` | `DS-OBS-READ-001`,`DS-OBS-META-NEG-001` | empty/last/same-binding/wrong-binding cursor rows | cursor codec repository | value/read cleanup |
| `TC-OBS-QRY-003` | `DS-OBS-READ-SURFACE-001`,`DS-OBS-READ-CORRUPT-001`,`DS-OBS-WRITE-SPY-001` | each Q missing/not-visible/stale/corrupt/unavailable | read/availability fake + write spies | mandatory corrupt cleanup;reset |
| `TC-OBS-QRY-004` | `DS-OBS-READ-FENCE-001`,`DS-OBS-WRITE-SPY-001` | mutation/finalize barrier around one read fence | durable-like snapshot read + barrier | join;read/owner cleanup;spy reset |
| `TC-OBS-DIA-001` | `DS-OBS-DIAGNOSTIC-001`,`DS-OBS-WRITE-SPY-001` | one consistent committed composite | read repositories | read namespace cleanup;spy reset |
| `TC-OBS-DIA-002` | `DS-OBS-READ-CORRUPT-001`,`DS-OBS-DEPENDENCY-CORPUS-001` | missing progress/wrong target/binding/forbidden capability | corrupt seed + compile capability scan | corrupt delete;static corpus read-only |
| `TC-OBS-DIA-003` | `DS-OBS-SIGNAL-001`,`DS-OBS-WRITE-SPY-001` | own-signal recursion + sink failure schedule | telemetry sink/façade spies | fake reset;signal namespace cleanup |
| `TC-OBS-DIA-004` | `DS-OBS-DEPENDENCY-CORPUS-001` | emitter/query capability denylist | read-only compile/source scan | no cleanup |
| `TC-OBS-RPT-001` | `DS-OBS-HANDOFF-001`,`DS-OBS-EVIDENCE-001`,`DS-OBS-UOW-ORDER-001` | complete visible immutable linkage set | query preview + durable-like UoW | handoff/input namespace cleanup |
| `TC-OBS-RPT-002` | `DS-OBS-HANDOFF-NEG-001`,`DS-OBS-JOB-REPORT-NEG-001` | mismatch/gap/not-visible/hold/no-write/missing report ref rows | policy/external write spies | handoff/report cleanup;spies reset |
| `TC-OBS-RPT-003` | `DS-OBS-EXTERNAL-INTENT-001`,`DS-OBS-EXTERNAL-OUTCOME-001` | committed prepare -> known success -> local finalize row | controlled external adapter | intent/handoff namespace cleanup;fake reset |
| `TC-OBS-RPT-004` | `DS-OBS-EXTERNAL-INTENT-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-RECOVERY-CLASS-001` | success+finalize fail/unknown、external unknown/probe rows | controlled adapter/probe | preserve then cleanup intent;fake reset |
| `TC-OBS-RPT-005` | `DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-SENTINEL-001` | verdict/signoff/run/EV alias/evidence-body forbidden corpus | read-only schema/report scan | no durable data;sentinel corpus delete |
| `TC-OBS-AUT-001` | `DS-OBS-HANDOFF-001`,`DS-OBS-EVIDENCE-001`,`DS-OBS-STATE-AUTHENTICITY-001` | owner-backed origin + immutable input | body-free resolver + durable-like UoW | handoff/linkage namespace cleanup |
| `TC-OBS-AUT-002` | `DS-OBS-HANDOFF-NEG-001`,`DS-OBS-STATE-AUTHENTICITY-001` | placeholder / non-empty gap / insufficient basis rows | policy fake | handoff/hint namespace cleanup |
| `TC-OBS-AUT-003` | `DS-OBS-STATE-AUTHENTICITY-001`,`DS-OBS-SENTINEL-001`,`DS-OBS-TELEMETRY-SCHEMA-001` | no-origin Real、terminal rewrite、static verdict | write spies + read-only scan | owner unchanged;sentinel delete |
| `TC-OBS-RET-001` | `DS-OBS-RETENTION-001`,`DS-OBS-STATE-RETENTION-001` | no-active-consumer / active-hold canonical rows | protection query fake + durable-like UoW | retention namespace cleanup |
| `TC-OBS-RET-002` | `DS-OBS-RETENTION-001`,`DS-OBS-STATE-PROTECTION-001`,`DS-OBS-WRITE-SPY-001` | active consumer / mismatched relation row | cleanup/archive/source writer spies | retention cleanup;spies reset |
| `TC-OBS-RET-003` | `DS-OBS-RETENTION-001`,`DS-OBS-CAS-CURSOR-001` | attach/release/expire barrier | durable-like CAS repository | join participants;namespace cleanup |
| `TC-OBS-RET-004` | `DS-OBS-RETENTION-001`,`DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-OUTBOX-001` | protection/H7/cursor/E07/stale/result failpoint rows | fault UoW | rollback proof;namespace delete |
| `TC-OBS-RET-005` | `DS-OBS-STATE-RETENTION-001`,`DS-OBS-DEPENDENCY-CORPUS-001` | reserved Released action + source cleanup capability denylist | domain table + read-only call scan | value drop;no durable cleanup |

### 8.3 Rebuild、UoW 与配置：20 TC

| TC | canonical 数据 | 独立负向 / fault 数据 | 协作替身 | 隔离与清理 |
|---|---|---|---|---|
| `TC-OBS-REB-001` | `DS-OBS-JOB-PLAN-001`,`DS-OBS-JOB-ITEM-001`,`DS-OBS-READ-FENCE-001` | complete committed source capture | durable-like Job/source repositories | plan/source/view/report namespace cleanup |
| `TC-OBS-REB-002` | `DS-OBS-JOB-PLAN-NEG-001`,`DS-OBS-READ-CORRUPT-001`,`DS-OBS-SENTINEL-001` | incomplete/oversized/missing input/raw fallback rows | failure-class fake + write spies | corrupt/sentinel delete;plan cleanup |
| `TC-OBS-REB-003` | `DS-OBS-CLAIM-FENCE-001`,`DS-OBS-STATE-JOB-ITEM-001` | two-worker lease expiry/stale commit barrier | durable-like claim/item repository | join;release/delete claim/plan data |
| `TC-OBS-REB-004` | `DS-OBS-JOB-RESUME-001`,`DS-OBS-COMMIT-UNKNOWN-001`,`DS-OBS-JOB-REPORT-001` | retryable/terminal duplicate/unknown rows | durable-like Job + probe fake | execution/report namespace cleanup |
| `TC-OBS-REB-005` | `DS-OBS-J06-BLOCKED-001`,`DS-OBS-STATE-REPLAY-COORD-001` | H13 absent/mismatch controlled rows | capability fake；no positive external fake | local plan/report cleanup only |
| `TC-OBS-REB-006` | `DS-OBS-DEPENDENCY-CORPUS-001` | J02/J03/J05/J06/J09 writer denylist | read-only compile/source scan | no cleanup |
| `TC-OBS-UOW-001` | `DS-OBS-UOW-ORDER-001`,`DS-OBS-OUTBOX-001` | exact façade-specific accepted stage list | recording UoW | rollback/delete owner/outbox/result |
| `TC-OBS-UOW-002` | `DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-WRITE-SPY-001` | each mandatory stage known failure row | fault UoW + external spy | rollback proof;reset all spies |
| `TC-OBS-UOW-003` | `DS-OBS-COMMIT-UNKNOWN-001`,`DS-OBS-IDEMPOTENCY-001` | committed/aborted/still-unknown/inconsistent probe rows | ambiguity UoW + read-only probe | scenario namespace cleanup |
| `TC-OBS-UOW-004` | `DS-OBS-IDEMPOTENCY-001`,`DS-OBS-DIGEST-001` | replay/conflict/in-flight concurrency rows | atomic reservation fake + barrier | join;reservation/owner cleanup |
| `TC-OBS-UOW-005` | `DS-OBS-CAS-CURSOR-001` | stale version/second assign/mixed namespace rows | durable-like CAS/cursor repository | rollback/delete namespace |
| `TC-OBS-UOW-006` | `DS-OBS-OUTBOX-001`,`DS-OBS-OUTBOX-CORRUPT-001` | owner-after-snapshot mutation + stored-only publisher | publisher/current-owner read spies | outbox/corrupt namespace cleanup |
| `TC-OBS-UOW-007` | `DS-OBS-EXTERNAL-INTENT-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-RECOVERY-CLASS-001` | unknown/success/finalize failure and probe rows | controlled adapter/probe | intent/marker cleanup;fake reset |
| `TC-OBS-UOW-008` | `DS-OBS-JOB-ITEM-001`,`DS-OBS-JOB-REPORT-001`,`DS-OBS-JOB-REPORT-NEG-001` | mixed outcome + stale fence + tampered fold rows | durable-like report/item repository | execution/report cleanup |
| `TC-OBS-CFG-001` | `DS-OBS-CONFIG-PROFILES-001`,`DS-OBS-AVAILABILITY-001` | three complete profile rows | formal loader/validator/builders | private handle teardown;candidate drop |
| `TC-OBS-CFG-002` | `DS-OBS-CONFIG-REDLINE-001`,`DS-OBS-SENSITIVE-REF-001` | one invalid field/invariant/sensitivity row per case | validator + fail-on-write spies | candidate/private handle teardown |
| `TC-OBS-CFG-003` | `DS-OBS-CONFIG-PROFILES-001`,`DS-OBS-JOB-PLAN-001` | same protocol/state/UoW/redline across profiles | three profile assemblies | teardown assemblies;plan cleanup |
| `TC-OBS-CFG-004` | `DS-OBS-ACTIVATION-FAULT-001` | Nth builder/prepare/arm failure + duplicate/cross-profile rows | registrar/host controlled fake | revoke/join/reset every assembly |
| `TC-OBS-CFG-005` | `DS-OBS-AVAILABILITY-001`,`DS-OBS-ACTIVATION-FAULT-001` | required/optional Disabled/Unavailable/Misconfigured/Degraded rows | capability/activation fake | teardown assembly;fake reset |
| `TC-OBS-CFG-006` | `DS-OBS-CONFIG-REDLINE-001`,`DS-OBS-TELEMETRY-SCHEMA-001` | forbidden schema/owner/UoW/redaction/no-write override corpus | read-only config/schema scan | no durable data;candidate drop |

### 8.4 Dependency、ownership、truth、no-write、release 与 evidence-design：28 TC

| TC | canonical 数据 | 独立负向 / fault 数据 | 协作替身 | 隔离与清理 |
|---|---|---|---|---|
| `TC-OBS-DEP-001` | `DS-OBS-DEPENDENCY-CORPUS-001` | manifest path/compile-dependency denylist | read-only manifest graph | no cleanup |
| `TC-OBS-DEP-002` | `DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-META-001` | 60 exact entry/capability mapping与private concrete type denylist | compile/source index | no cleanup |
| `TC-OBS-DEP-003` | `DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-AVAILABILITY-001` | producer/route/catalog missing/unknown/broad-subscription rows | static catalog + activation fake | fake reset;corpus read-only |
| `TC-OBS-HIST-001` | `DS-OBS-HISTORY-CORPUS-001` | old type/key/state/profile names against current index | read-only document scan | no cleanup |
| `TC-OBS-HIST-002` | `DS-OBS-HISTORY-CORPUS-001`,`DS-OBS-DEPENDENCY-CORPUS-001` | README/old formal source used as active fallback | read-only source/document scan | no cleanup |
| `TC-OBS-EXT-001` | `DS-OBS-PERIPHERAL-001`,`DS-OBS-TRUTH-COMPARISON-001` | five product-neutral consumer seam rows | adapter contract fake | peripheral namespace cleanup |
| `TC-OBS-EXT-002` | `DS-OBS-PERIPHERAL-001`,`DS-OBS-AVAILABILITY-001`,`DS-OBS-WRITE-SPY-001` | disabled/unavailable/not-visible/stale rows | controlled adapter + writer spies | peripheral cleanup;fake/spy reset |
| `TC-OBS-EXT-003` | `DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-TELEMETRY-SCHEMA-001` | product/vendor semantic denylist | read-only source/schema scan | no cleanup |
| `TC-OBS-OWN-001` | `DS-OBS-DEPENDENCY-CORPUS-001` | 34 DO owner/forbidden-store index | read-only owner/schema audit | no cleanup |
| `TC-OBS-OWN-002` | `DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-WRITE-SPY-001` | minimal capability views + forbidden writer/locator denylist | compile-fail/source scan | no durable data;spies reset |
| `TC-OBS-OWN-003` | `DS-OBS-TRUTH-COMPARISON-001`,`DS-OBS-WRITE-SPY-001` | adjacent fake truth store before/after snapshots | multi-store spies | local namespace cleanup;all spies reset |
| `TC-OBS-OWN-004` | `DS-OBS-REF-NEG-001`,`DS-OBS-DEPENDENCY-CORPUS-001` | same-bytes typed refs + declaration/use/owner index | compile/source index | value drop;no static cleanup |
| `TC-OBS-TRUTH-001` | `DS-OBS-TRUTH-COMPARISON-001` | projection/signal/summary/diagnostic vs source fact pairs | contract/service fake | value/local owner cleanup |
| `TC-OBS-TRUTH-002` | `DS-OBS-TRUTH-COMPARISON-001`,`DS-OBS-SENTINEL-001` | Delivered/hint/report vs verdict/signoff/run/EV markers | report/schema scan | sentinel delete;no real artifact |
| `TC-OBS-TRUTH-003` | `DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-DEPENDENCY-CORPUS-001` | telemetry outcome -> authority transition denylist | read-only call graph | no cleanup |
| `TC-OBS-NW-001` | `DS-OBS-READ-001`,`DS-OBS-READ-SURFACE-001`,`DS-OBS-WRITE-SPY-001` | Q01~Q14 all surface variants | exhaustive write spies | read cleanup;spy reset |
| `TC-OBS-NW-002` | `DS-OBS-JOB-PLAN-001`,`DS-OBS-J06-BLOCKED-001`,`DS-OBS-WRITE-SPY-001` | J02/J03/J05/J06/J09 success/failure/recovery rows | local Job + source/upstream writer spies | execution cleanup;spies reset |
| `TC-OBS-NW-003` | `DS-OBS-STATE-NOWRITE-001`,`DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-WRITE-SPY-001` | violation persistence success/failure rows | fail-on-call forbidden adapter | rollback/owner cleanup;spies reset |
| `TC-OBS-NW-004` | `DS-OBS-HANDOFF-NEG-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-WRITE-SPY-001` | block/unknown/finalize-fail rows | external/probe/source writer spies | intent/handoff cleanup;spies reset |
| `TC-OBS-NW-005` | `DS-OBS-DEPENDENCY-CORPUS-001` | façade/delegate/port/runtime writer denylist | compile/source scan | no cleanup |
| `TC-OBS-REL-001` | `DS-OBS-INTAKE-001`,`DS-OBS-CORRELATION-001`,`DS-OBS-SENTINEL-001`,`DS-OBS-IDEMPOTENCY-001` | C-OBS-1组合 row set | composed formal fakes | all component namespaces cleanup |
| `TC-OBS-REL-002` | `DS-OBS-AUDIT-001`,`DS-OBS-EVIDENCE-001`,`DS-OBS-READ-SURFACE-001` | C-OBS-2 body/visibility/gap rows | relation/resolver fake | projection/linkage/read cleanup |
| `TC-OBS-REL-003` | `DS-OBS-SIGNAL-001`,`DS-OBS-DIAGNOSTIC-001`,`DS-OBS-WRITE-SPY-001` | C-OBS-3 freshness/recursion rows | query/sink spies | signal/read cleanup;spies reset |
| `TC-OBS-REL-004` | `DS-OBS-HANDOFF-001`,`DS-OBS-PERIPHERAL-001`,`DS-OBS-TRUTH-COMPARISON-001` | C-OBS-4 phase/no-verdict rows | external controlled fake | handoff/peripheral cleanup |
| `TC-OBS-REL-005` | `DS-OBS-RETENTION-001`,`DS-OBS-JOB-PLAN-001`,`DS-OBS-J06-BLOCKED-001`,`DS-OBS-UOW-FAILPOINT-001` | C-OBS-5 active/fence/blocked/rollback rows | Job/UoW controlled fake | retention/execution namespace cleanup |
| `TC-OBS-NFR-001` | `DS-OBS-EVIDENCE-DESIGN-001` | orphan/duplicate/missing traceability row | read-only generated planned index | no run/artifact cleanup exists |
| `TC-OBS-NFR-002` | `DS-OBS-CONFIG-REDLINE-001`,`DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-HISTORY-CORPUS-001` | invented threshold/SLO/target/legacy number corpus | read-only documentation/config scan | candidate drop;corpus read-only |
| `TC-OBS-NFR-003` | `DS-OBS-RECOVERY-CLASS-001`,`DS-OBS-COMMIT-UNKNOWN-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-CLAIM-FENCE-001` | unavailable/unknown/stale-fence/blocked/manual rows | controlled dependency/UoW/adapter/claim fakes | scenario cleanup;all fakes reset |

### 8.5 TC 数据映射完整性

| 检查 | 期望 | 本节记录 | 结论 |
|---|---:|---:|---|
| unique TC row | 99 | 99 | pass |
| execution / contract TC 有 deterministic builder/seed | 80 | 80 | pass；均有 namespace/cleanup 或明确 value-only cleanup |
| static / compile / design-audit TC 有只读或隔离 corpus | 19 | 19 | pass；见下方完整 ID，不得人工改源码造样本 |
| I05 positive payload fixture | 0 | 0 | pass；只保留 pre-parse blocked dataset |
| J06 positive H13/completed fixture | 0 | 0 | pass；只保留 controlled Blocked/manual dataset |
| 真实 run/evidence/result/verdict/signoff | 0 | 0 | pass |

19 个 static / compile / design-audit TC 固定为：`RED-003`、`SIG-006`、`DIA-004`、`RPT-005`、
`AUT-003`、`RET-005`、`REB-006`、`CFG-006`、`DEP-001`、`DEP-002`、`HIST-001`、`HIST-002`、
`EXT-003`、`OWN-001`、`OWN-002`、`OWN-004`、`TRUTH-003`、`NW-005`、`NFR-001`。其中
`AUT-003`、`RET-005`、`OWN-004` 还带 value/domain negative seed，但其主门禁仍是 static/compile audit。其余
80 个 TC 均需要 executable builder、fake、durable-like seed 或 deterministic concurrency/fault schedule。

## 9. 按 16 个 canonical 测试切口组织的数据前置映射

| 测试切口 | 用例 ID | canonical / 独立负向数据集 | fixture / builder / seed | fake / controlled / durable-like / read-only | 清理方式 |
|---|---|---|---|---|---|
| `CUT-INGEST-ADMISSION` | `ING-001~004` | intake、sentinel、idempotency、digest、UoW order | receipt/safety builder + same/conflict reservation seed | policy fake + durable-like UoW | owner/reservation namespace cleanup；sentinel drop |
| `CUT-CORRELATION-SOURCE` | `COR-001~003` | correlation、typed-ref negative、CAS/cursor | accepted receipt + source/trace/causation seed；two-writer barrier | relation resolver fake + durable-like CAS | join participants；owner namespace cleanup |
| `CUT-REDACTION-SAFETY` | `RED-001~004` | safety state、negative intake、sentinel、telemetry schema、write spies | marker-summary table + pre/post serializer sentinel | policy/serializer/outbox/sink spies + read-only scan | owner cleanup；sentinel drop；spy reset |
| `CUT-AUDIT-PROJECTION` | `AUD-001~004` | audit、read surface、UoW failpoint、outbox | body-free relation/projection builder + one-stage fault rows | source audit fake + durable-like UoW | projection/outbox cleanup；fault reset |
| `CUT-EVIDENCE-BODY-FREE` | `EVD-001~004` | evidence positive/negative、sentinel、availability | linkage builder + body/missing/wrong-owner outcomes；I05 absent registration | body-free resolver + controlled activation/parse spies | linkage cleanup；sentinel/fake reset；I05无positive数据 |
| `CUT-SIGNAL-PROJECTION` | `SIG-001~006` | signal、correlation、sentinel、CAS、recovery、schema | safe summary/context/rollup builder + raw/CAS/failure rows | resolver/CAS durable-like + sink/read-only scans | signal/rollup cleanup；join/reset/sentinel drop |
| `CUT-DEGRADED-VISIBILITY` | `DEG-001~005` | read surfaces/corrupt、gap、source version、read fence | exact surface rows + adapter corruption seed + recovery mutation | policy/availability fake + durable-like read/source | corrupt mandatory delete；join；read/owner cleanup |
| `CUT-QUERY-NOWRITE` | `QRY-001~004`,`NW-001` | read/page/surface/corrupt/fence + exhaustive write spies | Q01~Q14 parameter table + wrong cursor + race barrier | read repositories + fail-on-write ports | join；read/corrupt cleanup；all spies reset |
| `CUT-DIAGNOSTIC-GUARD` | `DIA-001~004` | diagnostic、corrupt read、dependency corpus、signal/write spies | committed composite + recursion schedule + capability denylist | read/sink/façade spies + read-only compile scan | read/corrupt cleanup；fake reset |
| `CUT-REPORT-HANDOFF` | `RPT-001~005` | handoff positive/negative、job-report negative、external intent/outcome、sentinel | immutable input + phase intent/token/binding + unknown/finalize rows | query/policy fake + durable-like UoW + controlled external | handoff/intent/report cleanup；sentinel/fake reset |
| `CUT-EVIDENCE-AUTHENTICITY` | `AUT-001~003` | handoff/evidence/state-authenticity/sentinel/schema | owner-backed/placeholder/insufficient/no-origin rows | body-free resolver + write spies + read-only scan | linkage/handoff/hint cleanup；sentinel reset |
| `CUT-RETENTION-PROTECTION` | `RET-001~005` | retention/state、CAS、UoW failpoint、outbox、dependency corpus | marker/protection/consumer set builder + race/fault/reserved action | durable-like CAS/UoW + writer spies + read-only scan | join；rollback；retention/outbox cleanup；spy reset |
| `CUT-REBUILD-REPLAY-NOWRITE` | `REB-001~006`,`NW-002` | Job plan/item/resume/claim/fence/report、corrupt source、J06 blocked | frozen plan/work-set/config + two-worker barrier + H13 absent lane | durable-like Job/source + capability/writer spies | join；plan/item/report/source cleanup；J06无positive数据 |
| `CUT-UOW-IDEMPOTENCY-RECOVERY` | `UOW-001~008`,`NFR-003` | order/failpoint/commit unknown/idempotency/CAS/outbox/external/report/recovery | exact phase recorder + fault/ambiguity/race/fold schedules | durable-like UoW/repository + controlled adapter/probe | rollback/probe；join；all namespace/fakes cleanup |
| `CUT-CONFIG-RUNTIME-REDLINE` | `CFG-001~006` | three profiles、redline、activation faults、availability、sensitive refs、schema | formal raw candidate -> typed snapshot；Nth builder/registrar failpoint | formal loader/validator + capability/host controlled fake | teardown handles/assemblies；drop candidate；reset fake |
| `CUT-DEPENDENCY-REDLINE` | `DEP-001~003`,`HIST-001~002` | dependency/history/availability corpus | content-digest manifest/module/catalog/document snapshots | read-only scan + activation fake only for missing binding | no source mutation；reset activation fake |

## 10. 测试数据停审记录

### 10.1 逐切口停审

| 测试切口 | 构造稳定性 | 隔离键 | 清理完备性 | 外部依赖替身 | 结论 / affected |
|---|---|---|---|---|---|
| `CUT-INGEST-ADMISSION` | canonical builder + atomic reservation outcomes完整 | namespace + receipt/source + operation/actor/key | owner/reservation cleanup与sentinel disposal明确 | policy/resolver fake | `pass_planned` |
| `CUT-CORRELATION-SOURCE` | source/ref/version/race均可重复 | namespace + context + participant | barrier join + context cleanup | finite relation resolver | `pass_planned` |
| `CUT-REDACTION-SAFETY` | marker-summary表与唯一sentinel稳定 | namespace + sentinel case | sentinel永不进入shared store；spies reset | serializer/outbox/sink spies | `pass_planned` |
| `CUT-AUDIT-PROJECTION` | append relation与逐stage fault可构造 | namespace + projection + fault ordinal | rollback residue/cursor洞/outbox orphan均检查 | source audit fake | `pass_planned` |
| `CUT-EVIDENCE-BODY-FREE` | current C06 数据完整；I05只可构造pre-parse gate | namespace + linkage / activation case | linkage/sentinel/fake cleanup完整 | resolver/activation controlled | `pass_conditional`;I05两项开放 |
| `CUT-SIGNAL-PROJECTION` | safe/raw/CAS/recovery/schema rows分离 | namespace + signal/window/participant | join + owner cleanup + sink reset | resolver/CAS/sink fake | `pass_planned` |
| `CUT-DEGRADED-VISIBILITY` | exact surfaces、corruption、recovery互不复用 | namespace + scope + defect id | corruption mandatory delete；recovery owner cleanup | policy/availability controlled | `pass_conditional`;durable implementation仍affected |
| `CUT-QUERY-NOWRITE` | 14 Query × surface table可参数化 | namespace + query/case/binding | read cleanup；write call history reset | read repositories + exhaustive writer spies | `pass_planned` |
| `CUT-DIAGNOSTIC-GUARD` | composite/defect/recursion/capability均独立 | namespace + diagnostic/sink case | corrupt cleanup；sink/façade reset | controlled sink + read-only scan | `pass_planned` |
| `CUT-REPORT-HANDOFF` | immutable input、block和三phase outcome完整 | namespace + handoff/intent/token | durable intent保留到断言后再cleanup；fake reset | controlled external/probe | `pass_conditional`;phase/report owner affected开放 |
| `CUT-EVIDENCE-AUTHENTICITY` | owner-backed与placeholder/no-origin分离 | namespace + handoff/hint case | hint/linkage cleanup；sentinel disposal | body-free resolver | `pass_planned` |
| `CUT-RETENTION-PROTECTION` | marker/set/CAS/fault/reserved rows完整 | namespace + protected ref + participant | join + rollback + owner/outbox cleanup | source/archive writer spies | `pass_planned` |
| `CUT-REBUILD-REPLAY-NOWRITE` | plan/item/fence/resume可构造；J06只有controlled lane | namespace + execution/work/fence | all worker joined；plan/report/claim cleanup | Job/source fake + H13 capability absent | `pass_conditional`;H13开放 |
| `CUT-UOW-IDEMPOTENCY-RECOVERY` | stage/fault/unknown/race/external/fold表完整 | namespace + exact operation/work/intent | rollback/probe/join/fake reset均明确 | durable-like UoW + controlled external | `pass_conditional`;UoW/recovery/external affected开放 |
| `CUT-CONFIG-RUNTIME-REDLINE` | 3 profile、one-variable redline和13-stage failpoints稳定 | profile + config case + digest | all handles revoke/join/teardown；private material清除 | formal loader + capability/host fake | `pass_planned` |
| `CUT-DEPENDENCY-REDLINE` | content-digest corpus可重复且不改源码 | repository snapshot digest | read-only；activation fake reset | no sibling runtime；controlled missing-binding fake | `pass_planned` |

### 10.2 数据集级停审补充

| 数据集族 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| canonical owner/ref/metadata | 是否只使用current typed builder与formal owner | pass | 旧 log/metric/trace/audit object 已删除，不生成兼容 fixture |
| negative/sentinel | 是否一次只改变一个变量且不污染happy path | pass | sentinel独立case/内存/文件；禁止写shared durable store |
| corruption | 是否只在adapter边界注入且有强制清理 | pass | 使用`corrupt_fixture_only`，case结束必须验证namespace为空 |
| concurrency | 是否有确定barrier、participant ID和join | pass | 禁止sleep/time作为并发顺序或后台worker跨case存活 |
| UoW/fault/unknown | known abort与unknown是否分开 | pass | unknown只能读probe；不得把timeout当abort或success |
| external phase | intent/token/material/binding是否冻结 | pass_with_affected_open | production capability待`07` reality/spike；数据侧无blind retry |
| Job plan/report | plan/item/config/report是否immutable/fenced | pass_with_affected_open | missing report owner保持fail closed，不mint ref |
| config/profile | 是否只使用formal enum/key/root | pass | 未使用旧 profile/key 或 test-only RuntimeLike shortcut |
| static/history corpus | 是否以content digest只读且current/historical分类明确 | pass | 不修改source来制造违规样本 |
| evidence design | candidate EV是否被误当真实alias/artifact | pass | 只有planned index；无run目录、结果或签署 |

## 11. 跨数据隔离 / 清理 / 替身一致性审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 最高隔离键 | pass | 所有动态数据以harness-local `fixture_namespace + case_id`隔离；它不是产品或真实`run_id` |
| typed identity | pass | 各ref由owner-specific builder/allocator生成；same bytes cross-type仅在negative value corpus出现 |
| operation/source identity | pass | operation key按exact operation+actor隔离；source event按producer+source ref+optional version隔离 |
| fixed clock | pass | time只作为受控数据，不替代version、source order、claim/fence或unknown证明 |
| happy/negative分离 | pass | body、wrong-owner、conflict、fault、corruption、invalid config均有独立dataset/case |
| corruption生命周期 | pass | corruption不经domain builder；adapter-level seed后必须verified namespace delete |
| concurrency生命周期 | pass | participant barrier稳定，case退出前join全部worker并销毁claim/fault schedule |
| background task泄漏 | pass | 不允许publisher/rebuild/registrar线程跨case；teardown failure使case本身失败 |
| fake call history | pass | 每case新instance或`reset(namespace)`；不共享resolver/publisher/adapter/write-spy历史 |
| fake语义保真 | pass | fake必须执行formal unique/CAS/UoW/fence/token/redaction；不能用always-success绕过guard |
| durable-like cleanup | pass | transaction rollback或verified namespace delete；禁止truncate共享环境或人工删行 |
| profile隔离 | pass | 三profile独立assembly/config digest；RuntimeLike不接受synthetic fake shortcut |
| activation teardown | pass | failed composition撤销并join全部prepared/armed handles；opaque set不跨profile复用 |
| sensitive material | pass | 只用synthetic locator/credential sentinel和private fake handle；不得使用真实secret |
| forbidden sentinel | pass | 仅存在pre-redaction input或isolated corpus；assert后drop/zero/delete，禁止以durable搜索充当cleanup |
| Query no-write | pass | Q01~Q14使用独立fail-on-write ports；read fixture不带可被Query调用的repair capability |
| external historical binding | pass_with_affected_open | intent读取stored binding/token/material；old binding缺失即manual，不fallback current config |
| I05数据真相 | pass_with_blocker_open | canonical payload/producer fixture为0；只测试registration/header/schema gate前zero parse/ack/write |
| J06数据真相 | pass_with_blocker_open | H13 positive/completed fixture为0；只测试local plan/guard与controlled Blocked/manual |
| adjacent business truth | pass | sibling truth只有read-only fake snapshot与write spy；测试结束前后byte-for-byte比较 |
| static corpus污染 | pass | manifest/source/doc只读并按content digest识别；不对目标文件打补丁制造测试数据 |
| fixture重复 | pass | shared canonical builder只负责合法基线；negative mutator/fault schedule不复制一套owner schema |
| 人工造数 | pass | 99 TC均绑定builder/seed/fake/corpus；无控制台、SQL、手改行或临时环境依赖 |
| 清理失败处理 | pass | cleanup/teardown不是best-effort；失败使suite不可接受并保留safe namespace诊断供后续清理 |
| fabricated execution事实 | pass | 未产生真实run_id、evidence alias、artifact、report、test result、verdict、signoff或commit |
| unresolved跨数据冲突 | none | inherited blocker影响positive lane但不造成Step07数据契约内部冲突 |

## 12. 对上游与下游的影响判定

| 结论 | 上游影响 | 当前处置 | 下游 owner |
|---|---|---|---|
| 99/99 TC均可映射到current正式类型/状态/port或明确blocked gate | 无新增 | 不回写`03/04` | Step08环境、Step09自动化 |
| 27+1状态均可通过formal factory/member sequence构造 | 无新增 | 测试不得私改字段；实现若缺public构造入口则重新登记可测试性blocker | `07` boundary审计 |
| I05 positive fixture不可构造 | 既有upstream blocker | 保持slot-disabled/pre-parse zero-effect；不反推payload/schema | L1-artifact owner + `07` I05 boundary |
| J06 positive H13/completion不可构造 | 既有controlled blocker | 保持local plan/guard + Blocked/manual | H13 owner + `06/07` J06 boundary |
| durable/external fake可表达语义但不证明production capability | inherited affected | Step07只定义conformance data，不声明real environment ready | Step08 + `07` reality/spike |
| fixture实现路径尚未固定 | 不影响上游 | 本Step固定data contract，不猜文件名 | Step09 suite/command + `07` file boundary |

## 13. 正式 `05` §7 回填草稿

正式正文应按下列顺序装配本 Step 收口结论，不携带historical诊断与执行过程：

1. `fixture_namespace`、typed ID、actor、clock、operation key、source event、builder/mutator/corruption纪律。
2. 基础owner/read、UoW/idempotency/cursor/outbox、Job/claim/fence/report/external、profile/config/sentinel/static corpus数据集目录。
3. 27个正式状态owner与`ObservationJobPlanItemState`的canonical/negative corpus。
4. 99个TC逐条数据前置映射，以及16个canonical切口的builder/seed/fake/cleanup矩阵。
5. 逐切口停审与跨数据隔离、清理、替身一致性、人工造数审计。
6. I05/J06 blocked data lane及inherited affected，不把fixture/fake能力写成production readiness。

正式正文必须声明：`fixture_namespace`不是`run_id`，`EV-CAND-*`不是evidence alias，synthetic sentinel不是
真实secret/body/evidence，controlled fake outcome不是测试结果或验收事实。

## 14. 待确认事项

| 事项 | 当前决定 | 最迟 owner |
|---|---|---|
| concrete fixture module/file/function | 本Step不固定；必须一一实现本数据集契约 | Step09 automation + `07` boundary |
| durable-like product/schema/cleanup command | 尚未建立target reality；保持logical conformance + namespace cleanup contract | Step08环境 + `07` store spike |
| real external adapter/probe capability | controlled fake only；不能据此声明production phase可恢复 | Step08 + `07` external boundary |
| RuntimeLike actual endpoint/credential/host | 本Step不准备真实环境或secret | Step08 environment/profile matrix |
| I05 payload/schema/producer binding | 继续open；无positive fixture | upstream owner + `07` activation boundary |
| J06 H13 owner | 继续controlled open；无positive fixture/completion | upstream owner + `06/07` |
| artifact/report/evidence path | 本Step只有candidate EV planned index | Step09/13 + `06/07` |

## 15. 进入下一步条件

- [x] 82个唯一canonical dataset覆盖基础、边界、异常、并发、恢复、配置与静态语料。
- [x] 27个正式状态owner + 1个技术协调状态均有canonical legal和独立illegal/terminal/reserved seed。
- [x] 99个唯一TC逐条绑定dataset，和Step06集合差集为空、重复数为0。
- [x] 16个canonical切口均完成构造稳定性、隔离键、清理和外部替身停审。
- [x] negative/corruption/fault/concurrency/external/config数据未复用会掩盖断言的happy-path row。
- [x] 跨数据审计没有unresolved污染、清理、fixture重复、替身不一致或人工造数依赖。
- [x] I05/J06只保留blocked/controlled数据，不伪造canonical payload、H13、Completed或execution事实。
- [x] 未修改正式`05`，未实现测试，未创建真实run/evidence/artifact/report/result/verdict/signoff/commit。

Step 07 gate 为 `pass_current_with_inherited_affected_open`。下一允许动作是读取测试方案 SOP Step 08、书写规范
§5.8、current Step01~07、current `03/04` dependency/profile/config/availability/activation，以及L1参考粒度，重建
测试环境与配置矩阵。

## 16. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 07
- `standards/document/测试方案书写规范.md` §5.7
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `projects/L4-observability/03-详细设计.md` §5~§15
- `projects/L4-observability/04-配置设计.md` §5~§14
- `projects/L4-observability/design-calibration/03_ddd_step_10_state_matrix.md`
- `projects/L4-observability/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
- `projects/L4-observability/design-calibration/03_ddd_step_12_error_recovery.md`
- `projects/L4-observability/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L1-governance/design-calibration/05_test_plan_step_07_test_data.md`
