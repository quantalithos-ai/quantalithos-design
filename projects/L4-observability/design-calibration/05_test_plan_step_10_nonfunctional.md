# L4-observability 05-测试方案 Step 10 · 专项测试与非功能验证

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `10 / 设计专项测试与非功能验证` |
| mode | `full-restart` |
| status | `completed_current_step_10_with_inherited_affected_open` |
| current_module | `all_nonfunctional_axes` |
| direct_input | current `00~04`、Step 05~09、`03` Step 11~15/16、`04` Step 11~12 |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / pipeline | `not_started / not_established` |
| test_execution | `not_run` |
| artifact / report / evidence | `absent_by_design`; `EV-CAND-OBS-*` 仍只是 planned linkage |
| new_upstream_blocker | `none` |
| inherited_blocker | 12 项 inherited blocker / affected 保持开放，见 §12 |
| next_allowed_action | 完成本 Step 自检后按连续 M4 授权进入 Step 11 |
| commit | 不需要；用户未要求提交 |

本文件是 Step 10 中间产物，不是正式 `05-测试方案.md`。旧 81 行 Step 10 仅保存了已废弃对象名和
泛化摘要，已作为 `historical_material` 后置审计；本轮按 current `OBS` 需求编号、current `03` schema
和 Step 09 suite contract 全量重建。

## 1. 本步目标与输入边界

### 1.1 本步目标

本 Step 把性能、可用性 / 降级、安全与 redaction、truth ownership、no-write、幂等 / 一致性、恢复 / 重放、
可观测性 / 审计、证据链、留存和依赖 / 配置边界收敛为可执行的专项验证设计。专项验证的主语是
`L4-observability` 的观测与审计投影行为，不是上游业务 truth 或外部产品的运行质量。

本 Step 必须回答：

1. 哪些 `NFR-OBS-*`、`AC-OBS-*` 和 `VF-OBS-*` 必须进入专项验证。
2. 哪些红线必须以负向测试、静态检查或 write spy 作为 P0 阻断。
3. 哪些一致性、commit unknown、重复、重放和部分失败场景需要 fault injection。
4. 哪些 log / metric / trace / audit / evidence / retention / handoff 材料必须存在，且哪些内容绝对禁止出现。
5. 性能和可用性判断的来源是什么；没有正式来源的数字如何保持为 sample / trend，而不是伪造阈值。

### 1.2 权威顺序

| 优先级 | 输入 | 本 Step 消费内容 |
|---|---|---|
| 1 | `projects/L4-observability/00-需求文档.md` §10~§14 | current `FR-OBS-*`、`BR-OBS-*`、`DO-OBS-*`、`NFR-OBS-001~024`、`AC-OBS-*`、`VF-OBS-001~010` 和非目标 |
| 2 | `projects/L4-observability/03-详细设计.md` §8~§15 | exact protocol flow、UoW / commit 语义、错误恢复、幂等、观测 schema、redaction、correlation、evidence、retention、handoff、Query no-write |
| 3 | `projects/L4-observability/04-配置设计.md` §6~§13 | profile、配置校验、fail-fast、degraded / blocked、redaction 和 downstream handoff 边界 |
| 4 | current `05_test_plan_step_05_traceability_coverage.md` | NFR / AC / VF 到切口、TC 和 candidate EV 的追溯基线 |
| 5 | current `05_test_plan_step_06_cases.md`、`07_test_data.md`、`08_environment_config.md`、`09_automation_gates.md` | 99 个 TC、82 个 dataset、6 lane、3 profile、9 suite、artifact/report 和 script contract |
| 6 | L1-governance / L1-artifact Step 10 | 粒度、专项矩阵、fault injection、redaction 和 no-truth-repair 的结构参考；不复制其业务 truth |
| 7 | README、旧正式 `05`、旧 Step 10 | 仅作 historical discrepancy；不得反向定义 current 结论 |

### 1.3 真实性边界

| 事项 | 当前状态 | 本 Step 允许的表述 |
|---|---|---|
| target implementation repository | 不存在于当前工作区 | 只写 planned test seam / boundary，不声称已实现 |
| CI / runtime instance | `not_established` | 只写 lane、profile、依赖和不可用处置，不声称环境可用 |
| test execution | `not_run` | 只写方法、输入、断言和候选 evidence linkage |
| run / artifact / report | 不存在 | 只固定未来路径和 producer contract，不生成 `<run_id>` 事实 |
| formal evidence | 不存在 | `EV-CAND-OBS-*` 不能当作正式 evidence alias、verdict 或 signoff |
| performance numbers | 没有正式负载基线 | 只记录 duration / count sample 和 trend；不固化旧 P95/SLA |
| external truth | 由上游 owner 持有 | 只验证 safe ref、snapshot、marker、projection 和 no-write，不验证业务结论真伪 |

### 1.4 本步不重新定义的内容

- 不重新定义 `00` 的需求、规则、数据归属、NFR 或验收编号。
- 不重新定义 `03` 的 DTO、enum、repository、UoW、错误、状态或五个 planned script。
- 不把 log / metric / trace / audit projection、evidence linkage、retention marker 或 report handoff 升级为业务 truth。
- 不把外部 bus、Governance、Artifact、Identity、runtime / sandbox、archive 或 observability backend 的 SLA 写成本仓 P0。
- 不在本 Step 生成正式 `EV-*`、真实 report、acceptance verdict、risk signoff、commit 或测试结果。

## 2. SOP 问题回答

### 2.1 哪些性能指标必须验证

必须验证核心观察链的结构性可运行性：材料准入 / 安全处置、审计投影、只读查询、诊断摘要、报告交接准备、
留存保护和观察面重建在 `LocalTest` / `IntegrationLike` / controlled `RuntimeLike` 语境下，不依赖高级 dashboard、
外部 APM、真实 GRC、archive package 或未冻结的产品能力。每次未来执行应记录 operation kind、profile、duration
sample、item / record count、degraded marker 和输入完整性。

当前没有正式负载模型、容量基线或数值 SLO，因此：

- `NFR-OBS-001`、`005`、`009`、`013` 的“不得成为结构性瓶颈”以主链不依赖外围能力、能产出 duration/count sample 和无静默超时作为当前可判定口径。
- 旧材料中的 P95、SLA、冷存天数、事件数量和数据库吞吐数字只记录为 historical candidate，不能作为 P0 pass threshold。
- 若后续需要 numeric performance gate，必须先回写需求 / 环境 / 数据 / automation / acceptance，并补充负载来源、样本量、统计方法和 owner。

### 2.2 哪些安全和边界红线必须负向测试

以下红线属于 P0 blocking，至少由 negative fixture、serialization boundary assertion、write spy、静态依赖检查或
report scan 中的一种可重复方式验证：

| 红线 | 必须证明的负向结论 | 对应 current 输入 |
|---|---|---|
| body-free | raw body、secret、credential、provider response、payload body、artifact/evidence/governance/identity/runtime/archive body 不进入观察面或报告 | `BR-OBS-002`、`BR-OBS-012`、`NFR-OBS-003/006/011`、`VF-OBS-002/003` |
| redaction-first | redaction 发生在 serialization / append / report materialization 前；失败进入 reject / quarantine / blocked，不输出“清洁”结果 | `FR-OBS-003`、`BR-OBS-005`、`VF-OBS-002` |
| low-cardinality metric | metric name、label key 和 label value 只来自有限 allowlist；trace/ref/key/digest/free text 不得成为 label | `NFR-OBS-011/012`、`03` §15.4 |
| truth separation | observation summary、audit projection、trace、metric、report 或 evidence hint 不替代 source truth、execution truth 或 final verdict | `BR-OBS-004/014/025`、`VF-OBS-004` |
| no-write | Query、diagnostic、maintenance、rebuild、report assembly、export 和 telemetry sink 不调用 source writer，也不修复外部 truth | `BR-OBS-015/023`、`VF-OBS-005` |
| evidence authenticity | planned / blocked / not-run 材料不能生成 passed evidence、真实 run、verdict 或 signoff | `BR-OBS-017/018`、`VF-OBS-006` |
| retention protection | active / held / referenced observation material 不得被清理；backend retention 不得冒充 `RetentionMarker` | `BR-OBS-020/021`、`VF-OBS-007` |
| dependency boundary | 非 `core-contracts` sibling 不成为 compile dependency；运行期 / event 依赖不能被写成编译期依赖 | `BR-OBS-024~026`、`VF-OBS-008/009` |

### 2.3 哪些一致性和恢复场景必须故障注入

P0 必须使用 fake / controlled seam 验证语义，而不是依赖 sleep、日志文本或真实外部产品：

- UoW begin / append / commit / rollback failure；commit unknown 和 result lookup unknown。
- version conflict、unique conflict、duplicate material、same correlation / same idempotency key 重放。
- stored result / native audit / projection / report ref 缺失或类型不匹配。
- outbox append、event publish、external prepare / probe / finalize、report handoff 目标不可用、retryable 或 permanent failure。
- reference refresh、retention protection、projection rebuild、gap scan 和 replay coordination 的 partial failure / race。
- 非法 config、profile / lane 不兼容、依赖快照缺失、redaction corpus 缺失、metric descriptor 无法解析。

每个故障必须断言：失败类别、已发生的本地安全投影、未发生的 source write、是否允许 retry、是否允许 ack / completion、
是否留下可审计 marker / report，以及是否保持 `blocked` / `conditional` / `not_run` 原语义。

### 2.4 哪些 log、metric、trace 和 audit 证据必须存在

| 观察面 | 最小必须材料 | 禁止替代关系 |
|---|---|---|
| log | operation / phase / disposition / result / error kind、safe diagnostic ref、correlation context、redaction decision | log success 不等于业务 accepted 或 source commit |
| metric | finite operation / result / error / state / profile labels、duration/count、degraded / blocked counters | metric backend health 或 counter value 不等于业务 truth |
| trace | root/child span、parent relation、phase、status、trusted correlation propagation | trace completion 不等于 external completion、evidence authenticity 或 acceptance |
| durable audit / native record | accepted projection、safety disposition、evidence linkage、retention / protection、no-write violation、handoff / report owner record | 不新增 generic audit ledger，不把 Query read 变成 durable business audit |
| report / marker | missing、blocked、degraded、gap、redaction、provenance、handoff state、safe source refs | report prepared/delivered 不等于 verdict、signoff、real evidence alias |

`03` 的 native owner record、history、outbox、marker、intent、receipt 和 Job report 是 durable evidence 的候选来源；
runtime telemetry 只作为 out-of-band observation material。正式证据索引留给 Step 13。

### 2.5 阈值来自哪里

当前可判定阈值只能来自：`00` 的 NFR / BR / AC / VF、`03` 的字段与 phase 不变量、`04` 的 fail-fast / degraded
规则、Step 06 的 exact assertion 和 Step 09 的 gate 输入完整性规则。旧 README、历史正式文档、未引用的 P95 / SLA、
产品默认值或实现者经验都不能成为当前阈值来源。

## 3. 当前材料诊断与设计取舍

### 3.1 Historical material 诊断

| 材料 | 问题 | current 处置 |
|---|---|---|
| 旧 Step 10 81 行稿 | 使用废弃 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等摘要名；没有 `OBS` NFR/AC/VF 矩阵、fault schedule、suite / lane / artifact 关系 | 不继承；本文件按 `03` current schema 和现有 TC 重建 |
| 旧 `05-测试方案.md` | 仍是 historical 摘要，性能、产品栈和证据口径未经过 current Step 01~09 闭环 | 不修改；Step 15 才从 Step 01~14 装配 |
| README / 历史产品栈 | 可能出现 Grafana、TimescaleDB、OTel、旧事件数量、P95/SLA 或冷存假设 | 只保留方向性风险，标记为 historical，不进入 P0 数值或依赖 |
| L1-governance / L1-artifact Step 10 | 粒度可参考，但业务 truth、suite 和编号不同 | 只借鉴专项矩阵、反向映射、fault injection 和停审结构 |
| current Step 09 | 已有 9 suite、5 script、99 TC/EV 和 6 lane，但未聚合 NFR / redline / fault 视图 | 本 Step 反向聚合，不改 Step 09 的 TC、suite、script 或路径 contract |

### 3.2 设计取舍

| 议题 | 采用方案 | 放弃方案 | 理由 |
|---|---|---|---|
| 性能 | 结构性 sample / trend + 主链独立性 | 继承历史 P95/SLA 作为 P0 | 当前无正式负载来源，硬化会制造伪验收口径 |
| 故障验证 | fake / controlled / replay-backed fault injection | 依赖真实外部服务或 sleep | 先验证本仓语义、write boundary 和失败分类 |
| 安全扫描 | raw artifact + stdout/stderr + report + forbidden corpus 全面扫描 | 只扫描最终 report | 泄漏可能发生在中间 artifact 或命令输出 |
| truth boundary | source writer spy / dependency graph / state comparison 三重断言 | 仅检查日志或最终摘要 | 观察面不应以文字承诺证明 no-write |
| 证据 | candidate EV 只作为 planned linkage，从真实 raw artifact 推导 | 从静态表或模板生成 pass | 保持证据真实性边界，正式 EV 由 Step 13 / `06` 收口 |
| 外部 phase | 只验证 prepare/call/finalize、probe 和 unknown 语义 | 伪造 provider success 或 H13 positive | inherited affected 仍开放，不能把 controlled seam当能力已存在 |

## 4. 专项测试总矩阵

下表是本 Step 的主索引。`P0 blocking` 表示未来执行时断言失败或输入缺失会阻断对应 gate；不表示当前已经通过。

| 专项 ID | 专项 | 风险 / 目标 | 主方法 | 主 lane / profile | primary suite | P0 口径 | 候选证据族 |
|---|---|---|---|---|---|---|---|
| `NFS-OBS-01` | 入口安全与降级 | unsafe / incomplete material 被静默接受或补造 | pre-parse negative、redaction、source/header validation、disposition assertion | `ENV-CI-ISO` / `LocalTest` | `S-OBS-ENTRY-CAPABILITY` | reject / quarantine / gap / degraded 必须显式；无 ack、无 source write | `EV-CAND-OBS-ING-*`、`RED-*`、`DEG-*` |
| `NFS-OBS-02` | body-free 与 redaction | 禁止正文或敏感 ref 进入任何输出面 | forbidden corpus、serialization spy、raw artifact/report scan | `ENV-CI-ISO` / `LocalTest` | `S-OBS-TELEMETRY-SAFETY` | 任一 forbidden material 命中即阻断，且失败输出不能回显原文 | `EV-CAND-OBS-RED-*`、`SIG-*` |
| `NFS-OBS-03` | correlation 安全关联 | 关联链断裂或由 opaque id 推导 truth | propagation matrix、parent/causation assertion、missing-context negative | `ENV-CI-ISO` / `LocalTest` | `S-OBS-CONTRACT-DOMAIN` | trusted context按 phase传播；缺失只能形成 typed gap，不推导 actor / truth | `EV-CAND-OBS-COR-*` |
| `NFS-OBS-04` | audit / evidence traceability | accepted projection或linkage不可追溯、body-free边界丢失 | native owner assertion、source/ref relation audit、duplicate linkage | `ENV-CI-ISO` + `ENV-CI-INT` | `S-OBS-SERVICE-FLOW` | 来源、purpose、visibility、gap、redaction和relation可回指；不拥有外部正文 | `EV-CAND-OBS-AUD-*`、`EVD-*` |
| `NFS-OBS-05` | truth ownership / no-write | query、diagnostic、rebuild、handoff或export反写外部 truth | write spy、before/after source snapshot、dependency scan | `ENV-CI-ISO` / `LocalTest` + `ENV-CI-INT` | `S-OBS-SERVICE-FLOW` | source writer调用数为0，source snapshot不变；违例只记录本仓 violation | `EV-CAND-OBS-NW-*`、`TRUTH-*`、`DEP-*` |
| `NFS-OBS-06` | consistency / idempotency | duplicate、version conflict、stored result缺失造成分叉 | fake UoW/repository、same-key replay、version race | `ENV-CI-INT` / `IntegrationLike` | `S-OBS-REPOSITORY-CONFORMANCE` | 重放不产生第二正式语义；冲突不覆盖新状态；缺失结果不从当前 truth重算 | `EV-CAND-OBS-UOW-*`、`RET-*` |
| `NFS-OBS-07` | recovery / partial failure | publish、refresh、handoff、rebuild、retention部分失败被伪造成成功 | fault schedule、probe / finalize、replay report | `ENV-CI-INT` / `IntegrationLike`; controlled `ENV-STG-RT` | `S-OBS-RECOVERY-REPLAY` | failure kind、retry/blocked/manual、marker/report和no-write均符合正式规则 | `EV-CAND-OBS-REB-*`、`RPT-*` |
| `NFS-OBS-08` | log / metric / trace safety | 关键错误不可诊断或 telemetry 泄漏 / 高基数 | schema allowlist、metric label check、redaction scan、trace relation check | `ENV-CI-ISO` / `LocalTest` | `S-OBS-TELEMETRY-SAFETY` | safe fields存在；forbidden fields不存在；label有限；trace不冒充truth | `EV-CAND-OBS-SIG-*`、`RED-*` |
| `NFS-OBS-09` | retention / active reference | active / held / referenced material误清理或保护分叉 | hold/release/conflict matrix、CAS/version、cleanup spy | `ENV-CI-INT` / `IntegrationLike` | `S-OBS-REPOSITORY-CONFORMANCE` | active reference保护优先；backend retention不能改本仓 marker语义 | `EV-CAND-OBS-RET-*` |
| `NFS-OBS-10` | report handoff / authenticity | report交接被误当 verdict / evidence / signoff | handoff state matrix、provenance audit、static evidence scan | `ENV-CI-ISO` + controlled `ENV-STG-RT` | `S-OBS-RELEASE-SMOKE` | source、visibility、redaction、gap和consumer purpose齐全；不得生成真实验收事实 | `EV-CAND-OBS-RPT-*`、`AUT-*` |
| `NFS-OBS-11` | config / dependency redline | 非法 profile fallback、非 core compile edge、外围产品硬绑定 | config failure matrix、Cargo graph、static historical scan | `ENV-CI-ISO` / `LocalTest` | `S-OBS-CONFIG-REDLINE` + `S-OBS-STATIC-REDLINE` | invalid config fail-closed；compile dependency只承接 `core-contracts`；历史产品不成为P0前置 | `EV-CAND-OBS-CFG-*`、`DEP-*`、`HIST-*` |
| `NFS-OBS-12` | structural performance / availability | 核心观察链被高级产品或外部依赖阻塞 | duration/count sample、controlled unavailable、release smoke | `ENV-CI-ISO`; `ENV-CI-INT`; `ENV-STG-RT` follow-up | `S-OBS-RELEASE-SMOKE` | 产出可解释 sample；外围失效只造成显式 degraded / blocked；不使用无来源数值阈值 | `EV-CAND-OBS-NFR-*`、`REL-*` |

## 5. 性能、可用性与降级专项

### 5.1 性能口径与来源矩阵

| 观察对象 | current 来源 | 必采样字段 | 当前通过条件 | 当前不定义 |
|---|---|---|---|---|
| observation material intake / safety disposition | `NFR-OBS-001`、`004`；`C-OBS-1` | `operation_kind`、`profile`、`phase`、`duration_sample`、`material_count`、`disposition` | 基础准入能独立运行并形成安全 disposition；无高级产品依赖或静默阻塞 | P95/P99、吞吐、SLA |
| audit projection / evidence linkage | `NFR-OBS-005`、`007`、`008`；`AC-OBS-002` | projection count、linkage count、duration、gap / visibility state | body-free relation可解析；重复输入保持单一语义；缺口显式 | 外部 GRC / evidence backend latency |
| signal log / metric / trace surface | `NFR-OBS-009~012`；`AC-OBS-003` | signal count、duration、safe disposition、degraded count、metric sample count | safe observation面可独立消费；缺失 / not-visible / degraded可解释 | dashboard refresh、APM ingestion SLA |
| query / diagnostic / report preparation | `NFR-OBS-013~016`；`AC-OBS-004` | query count、duration、visibility、gap、handoff state | 只读查询和交接准备不依赖外围增强；不可用时 `blocked` / `pending` / `degraded` | report export throughput、acceptance turnaround |
| retention / replay / rebuild | `NFR-OBS-017~020`；`AC-OBS-005` | item count、duration、hold/conflict count、rebuild marker、violation count | 派生面可受控重建；active reference不被清理；no-write violation可观察 | retention days、rebuild window、capacity |

### 5.2 结构性性能测试步骤

未来每个 sample run 按以下顺序执行，任何步骤缺输入都记录 `blocked` 或 `not_run`：

```text
validate profile / lane / dataset / run identity
        |
        v
execute core observation operation with peripheral enhancement disabled
        |
        v
capture safe duration/count sample and native disposition
        |
        v
run redaction + metric-label + dependency checks
        |
        v
generate same-run report with provenance and missing-input list
```

关键约束：

1. sample 只能说明本次输入和 profile 下的结构性表现，不能外推产品 SLA。
2. 不得因 sample 数值较低或 suite 启动成功而跳过 safety、truth 或 no-write 断言。
3. `RuntimeLike` / staging sample 缺失不能由 `LocalTest` 结果升级填充。
4. 未来若要建立硬阈值，必须记录负载模型、样本量、统计方法、环境版本、配置 profile、阈值 owner 和变更回写位置。

### 5.3 可用性 / 降级矩阵

| 故障条件 | 允许的观察面结果 | 禁止结果 | 主要 TC / suite |
|---|---|---|---|
| source material缺失 | `Gap` / `NotVisible` / `Blocked`，带 safe reason/ref | 空结果被解释为 accepted 或 source truth | `TC-OBS-DEG-001`、`S-OBS-CONTRACT-DOMAIN` |
| source不可达或事件协作延迟 | `Pending` / `Degraded` / `Blocked`，保留来源和时序语境 | 默认补造材料、默认 success、静默丢弃 | `TC-OBS-DEG-002`、`TC-OBS-DEG-003` / `S-OBS-SERVICE-FLOW` |
| redaction失败 | `Rejected` / `Quarantined`，不序列化危险正文 | 截断、hash、base64后当作清洁 | `TC-OBS-RED-001~004`、`S-OBS-TELEMETRY-SAFETY` |
| report consumer不可用 | handoff `Pending` / `Blocked`，本地 report/handoff marker可审计 | final verdict、signoff或delivery success | `TC-OBS-RPT-002~004`、`S-OBS-RECOVERY-REPLAY` |
| archive / external target不可用 | local observation state不变，失败 marker/report可重试或人工处理 | 修改 source truth、删除 active material | `TC-OBS-EXT-002`、`TC-OBS-EXT-003`、`S-OBS-RELEASE-SMOKE` |
| RuntimeLike lane未建立 | `planned_not_evaluated` / `not_run` | 用 CI lane结果冒充 staging/runtime结果 | `TC-OBS-REL-001~005`、`S-OBS-RELEASE-SMOKE` |

## 6. 安全、redaction、truth ownership 与 no-write 矩阵

本节把需求层的 veto 和详细设计的 boundary 变成可执行断言。每一行都必须由当前已有的
`TC-OBS-*`、dataset 和 suite 承载；不得为了填充专项而新造一个未进入 Step 06/07/09 的测试对象。
`P0` 表示未来执行时输入缺失或断言失败会阻断 gate，不表示设计阶段已经通过。

### 6.1 安全与正文边界

| 红线 | 负向输入 / dataset | 最小断言 | TC / suite / gate | 失败处置 |
|---|---|---|---|---|
| raw body 不得进入 observation material | `DS-OBS-SENTINEL-001`、`DS-OBS-TELEMETRY-SCHEMA-001` | serialization 前只能产生 safe ref、摘要或 typed omission；输出树、stdout、stderr、report 均不得命中 sentinel | `TC-OBS-ING-002`、`TC-OBS-RED-001~004` / `S-OBS-TELEMETRY-SAFETY` / redaction gate | `Rejected` 或 `Quarantined`；不得 ack、append 或生成 clean report |
| secret / credential / provider body 不得逃逸 | `DS-OBS-SENTINEL-001`、`DS-OBS-SENSITIVE-REF-001` | forbidden corpus 在 raw artifact、派生 artifact 和 report 上均为零命中；错误消息不得回显原值 | `TC-OBS-RED-001~004` / `S-OBS-TELEMETRY-SAFETY` | 保留 typed redaction failure；不得以截断、hash、base64 或 debug 字符串替代脱敏 |
| redaction 必须先于序列化和 append | `DS-OBS-INTAKE-NEG-001`、`DS-OBS-SENTINEL-001` | redaction decision 未为 `Allowed` 时，serializer、local append、outbox 和 report materializer 调用数均为零 | `TC-OBS-ING-002`、`TC-OBS-RED-002` / `S-OBS-ENTRY-CAPABILITY` | `ack=0`、local write=0、outbox=0；仅可留下安全拒绝诊断 |
| 敏感 ref 不得成为 metric label | `DS-OBS-SENSITIVE-REF-001`、`DS-OBS-TELEMETRY-SCHEMA-001` | label key/value 只来自有限 allowlist；ref、key、digest、trace id、actor、subject 和自由文本均不出现 | `TC-OBS-SIG-002`、`TC-OBS-DEP-002` / `S-OBS-TELEMETRY-SAFETY`、`S-OBS-STATIC-REDLINE` | metric sample 丢弃或转为 safe state；不得降级为高基数输出 |
| trace/log 不得携带禁止正文 | `DS-OBS-SENTINEL-001`、`DS-OBS-STATE-SIGNAL-001` | message template、span attributes、event fields 通过同一 forbidden scan；trace parent/causation 只保留可信上下文 | `TC-OBS-SIG-001~003` / `S-OBS-TELEMETRY-SAFETY` | signal 进入 `Rejected` / `Degraded`，不影响已提交 owner truth |
| historical 产品名不成为硬依赖 | `DS-OBS-HISTORY-CORPUS-001`、`DS-OBS-DEPENDENCY-CORPUS-001` | README、历史正文和产品名扫描结果只能形成 `historical_material`；Cargo / runtime graph 不引入其依赖 | `TC-OBS-HIST-001~002`、`TC-OBS-DEP-001~003` / `S-OBS-STATIC-REDLINE` | gate 阻断并记录来源；不得将历史数字转成性能 pass/fail |

### 6.2 truth ownership 与 no-write

| 操作 | source writer 约束 | before/after 断言 | TC / dataset | 合法本地结果 |
|---|---|---|---|---|
| Query / diagnostic | 不得取得任何上游 source-writer capability | `DS-OBS-TRUTH-COMPARISON-001` 的 owner snapshot byte-identical；write spy 为 0 | `TC-OBS-QRY-001~004`、`TC-OBS-DIA-001~004` / `DS-OBS-WRITE-SPY-001` / `S-OBS-SERVICE-FLOW` | 只读 projection、safe summary、gap 或 not-visible |
| projection rebuild / rollup rebuild | 只可写本仓派生 projection 和 rebuild marker | source truth、native history、已提交 result 不变；新 cursor 不覆盖旧 freshness | `TC-OBS-REB-001~006` / `DS-OBS-TRUTH-COMPARISON-001`、`DS-OBS-READ-FENCE-001` | projection 更新、stale marker 或 blocked report |
| retention / cleanup | 只可处理未被 active/held/referenced 的本仓 material | active reference、hold 和 source snapshot 不变；删除候选可解释 | `TC-OBS-RET-001~005` / `DS-OBS-RETENTION-001`、`DS-OBS-STATE-PROTECTION-001` | `Protected`、`Blocked` 或明确 cleanup marker |
| report assembly / export | 不得写 source truth 或补全缺口 | source snapshot unchanged；report 只引用已提交 projection/linkage/gap | `TC-OBS-RPT-001~005`、`TC-OBS-EXT-001~003` / `DS-OBS-HANDOFF-001` | `Prepared`、`Pending`、`Blocked` 或 `Degraded` |
| telemetry sink / recursive observation | sink 失败不能回滚 owner，也不能触发新的业务写入 | write spy=0；递归深度受 guard 限制；owner commit outcome 不被 sink 改写 | `TC-OBS-SIG-004~006`、`TC-OBS-NW-004~005` / `DS-OBS-WRITE-SPY-001`、`DS-OBS-STATE-NOWRITE-001` | safe drop、degraded signal 或 local violation record |
| external handoff / archive preparation | 只发送 body-free handoff material | source truth 和本仓 owner record 不被目标回调覆盖；失败不伪造成 delivered | `TC-OBS-EXT-002~003`、`TC-OBS-RPT-002~004` / `DS-OBS-EXTERNAL-OUTCOME-001` | retryable、manual、blocked；不得生成 execution truth |

## 7. 一致性、恢复、并发与 fault injection 矩阵

故障注入必须在可控 seam 发生，并记录 `fault_id`、注入 phase、预期 failure class、允许的 retry / probe、
ack/completion 规则、已提交本地材料和 no-write 断言。不得用 sleep、日志字符串或真实外部成功替代协议状态。

| fault id | 注入点 | 必须覆盖的场景 | 预期状态 / 动作 | TC / dataset / suite |
|---|---|---|---|---|
| `FI-UOW-01` | UoW begin / stage | begin fail、stage fail、append fail | 无 owner commit；ack=0；只留 safe failure material | `TC-OBS-UOW-001~003` / `DS-OBS-UOW-FAILPOINT-001` / `S-OBS-REPOSITORY-CONFORMANCE` |
| `FI-UOW-02` | commit / rollback | commit known failure、rollback failure | failure class 不丢失；不得补偿性改写 source truth；必要时 `Manual` | `TC-OBS-UOW-004~005` / `DS-OBS-UOW-FAILPOINT-001` |
| `FI-CU-01` | commit outcome probe | commit unknown、probe known committed、probe unknown | 进入 `ProbeBeforeRetry`；同 key 先查 reservation/result；不得重复执行 | `TC-OBS-UOW-006`、`TC-OBS-REB-004` / `DS-OBS-COMMIT-UNKNOWN-001` |
| `FI-REPLAY-01` | idempotency / stored result | duplicate、same correlation、missing/corrupt stored result | duplicate 返回原语义；missing/corrupt 是 consistency defect；不得从 current truth 重算 | `TC-OBS-UOW-007~008` / `DS-OBS-IDEMPOTENCY-001`、`DS-OBS-READ-CORRUPT-001` |
| `FI-CONFLICT-01` | repository CAS / unique key | version conflict、unique conflict、in-flight reservation | 不覆盖较新状态；冲突显式；retry 受 policy 限制 | `TC-OBS-REB-002`、`TC-OBS-RET-003` / `DS-OBS-CAS-CURSOR-001` |
| `FI-OUTBOX-01` | outbox snapshot / publish | snapshot 缺失、payload corrupt、publish retryable / terminal | owner outcome 与 peripheral delivery 分离；只更新 outbox/report marker | `TC-OBS-REB-003`、`TC-OBS-EXT-001` / `DS-OBS-OUTBOX-001`、`DS-OBS-OUTBOX-CORRUPT-001` |
| `FI-EXT-01` | prepare / probe / finalize | external outcome pending、known success、unknown、permanent failure | 只允许协议定义的 `Prepared` / `Delivered` / `Blocked` / `Manual`；不创建 H13 positive truth | `TC-OBS-EXT-002~003` / `DS-OBS-EXTERNAL-INTENT-001`、`DS-OBS-EXTERNAL-OUTCOME-001` |
| `FI-FENCE-01` | projection fence / job claim | stale cursor、claim loss、fence mismatch、duplicate worker | 新鲜度单调；失去 claim 后停止写；不重复 finalize | `TC-OBS-REB-005~006` / `DS-OBS-CLAIM-FENCE-001` |
| `FI-REPORT-01` | job report fold | report ref missing、wrong kind、negative report、partial item | report 为 `Blocked` / `Degraded`；不得折叠为 `Completed` 或 positive execution | `TC-OBS-RPT-003~005` / `DS-OBS-JOB-REPORT-001`、`DS-OBS-JOB-REPORT-NEG-001` |
| `FI-RET-01` | retention protection race | hold/release race、active reference refresh race、cleanup retry | protection 优先；CAS conflict 不删；留下 marker / manual action | `TC-OBS-RET-001~005` / `DS-OBS-RETENTION-001`、`DS-OBS-STATE-PROTECTION-001` |
| `FI-CFG-01` | config activation | invalid profile、missing redaction corpus、activation failure | fail-closed；不 silent fallback；无半激活配置 | `TC-OBS-CFG-001~006` / `DS-OBS-ACTIVATION-FAULT-001`、`DS-OBS-CONFIG-REDLINE-001` |
| `FI-J06-01` | replay coordinator | J06 upstream capability absent / controlled blocked | `Blocked/manual`；不创建 H13 positive execution、真实 run、EV 或 signoff | `TC-OBS-REL-004~005` / `DS-OBS-J06-BLOCKED-001` / `S-OBS-J06-BLOCKED-001` |

### 7.1 故障结果分类

| 分类 | 允许的语义 | ack / completion | 必须留下的材料 |
|---|---|---|---|
| `Rejected` | 输入不安全或协议不合法 | `ack=0` | safe rejection reason、correlation、redaction decision |
| `Retryable` | 本地可安全重试且没有未知 owner outcome | 不完成；允许 policy 限定的 retry | failure marker、attempt count、safe diagnostic ref |
| `ProbeBeforeRetry` | owner outcome 未知 | 不直接重试 handler；先 probe | probe record、same-key identity、unknown marker |
| `Blocked` | 依赖 / 能力 / 输入未建立 | 不生成 positive completion | blocked report、missing dependency / input list |
| `Manual` | rollback / external / ownership 状态无法自动判定 | 不伪造完成 | manual action marker、审计引用、source snapshot |
| `Degraded` | 观察能力部分可用但信息不完整 | 可返回 degraded observation，不等于业务成功 | degraded marker、gap、safe summary |

## 8. log / metric / trace / durable audit 契约

### 8.1 字段来源与时点

| 面 | 必须字段 | 来源 / 提交时点 | 禁止字段或解释 |
|---|---|---|---|
| log | operation kind、phase、disposition、result、error kind、safe diagnostic ref、correlation context、redaction decision | operation context、typed result；入口拒绝可在 owner commit 前记录，accepted projection 仅在本地提交后记录 | raw body、secret、完整 provider response、stack/raw debug；log success 不等于 owner accepted |
| metric | finite operation、result、error、state、profile、degraded/blocked counters、duration/count | allowlisted descriptor；不依赖外部 backend commit | ref、key、digest、trace id、actor、subject、自由文本不得成为 label；metric value 不等于 truth |
| trace | trace/span/parent、span kind、phase、status、trusted correlation、start/end sample | 由可信 operation context 传播；telemetry sink out-of-band | trace completion 不等于 external completion、execution truth、verdict 或 evidence |
| durable audit projection | source audit ref、purpose、visibility、safe actor/subject ref、action kind、evidence linkage、gap、redaction/protection state | 仅在本仓定义的 accepted projection / safety disposition / handoff / violation owner transaction 中提交 | 不新建外部业务 audit ledger；Query read 不自动变成 durable business audit |

### 8.2 correlation 与递归防护

1. root operation 生成或接收可信 `CorrelationContext`；child span 只能继承并补充 parent/causation 关系。
2. 缺失或不可信 correlation 只能形成 typed `Gap` / `NotVisible`，不得由 trace id、digest 或任意 opaque id 推导 actor、subject 或业务结论。
3. telemetry emission 必须有 recursion guard；sink failure、serialization failure 和 metric rejection 不得重新触发业务写入或无限递归。
4. cross-repo handoff 只携带 body-free source ref、purpose、visibility、digest / marker 和 correlation relation；目标反馈不能回写 owner truth。

## 9. evidence linkage、retention marker 与 report handoff 专项矩阵

| 主语 | 必须验证 | 禁止升级 | TC / dataset / report |
|---|---|---|---|
| evidence linkage | body-free relation、source family、source ref、purpose、visibility、digest / schema、gap 和 provenance 可回指 | runtime telemetry、dashboard、sink receipt、metric sample 不能自动成为 evidence | `TC-OBS-EVD-001~004` / `DS-OBS-EVIDENCE-001`、`DS-OBS-EVIDENCE-NEG-001` / `S-OBS-SERVICE-FLOW` |
| retention marker | marker owner、state、hold、active reference、reason、version/CAS、created/updated context 可重放 | backend TTL、archive acknowledgment 或 cleanup success 不等于本仓 `RetentionMarker` | `TC-OBS-RET-001~005` / `DS-OBS-RETENTION-001` / `S-OBS-REPOSITORY-CONFORMANCE` |
| report handoff | report input refs、redaction state、gap、source/provenance、consumer purpose、handoff state、failure reason 完整 | `Prepared` / `Delivered` 不等于 verdict、signoff、真实 run 或 evidence alias；design planned 不得填真实 ID | `TC-OBS-RPT-001~005` / `DS-OBS-HANDOFF-001`、`DS-OBS-HANDOFF-NEG-001` / Step 09 各 TC exact primary suite + `generate_reports.sh` provenance 阶段 |
| report authenticity | report 只能从已提交 projection/linkage/gap/authenticity material fold；missing raw artifact 阻断 | static mapping、empty artifact、`latest`、手写 passed | `TC-OBS-AUT-001~003` / `DS-OBS-EVIDENCE-DESIGN-001` / Step 09 各 TC exact primary suite + `generate_reports.sh` provenance 阶段 |

## 10. NFR / AC / VF 双向覆盖审计

| 覆盖族 | 当前映射 | 审计结论 |
|---|---|---|
| `NFR-OBS-001~004` | `NFS-OBS-01`、`NFS-OBS-12`、`TC-OBS-ING-001~004`、`TC-OBS-DEG-001~005`、`DS-OBS-INTAKE-001`、`DS-OBS-INTAKE-NEG-001` | 每项有入口安全、结构性 sample 和降级断言 |
| `NFR-OBS-005~008` | `NFS-OBS-04`、`NFS-OBS-06`、`NFS-OBS-07`、`TC-OBS-AUD-001~004`、`TC-OBS-EVD-001~004`、`TC-OBS-UOW-001~008`、`TC-OBS-REB-001~006` | audit/evidence/consistency/recovery 均有切口；缺失结果不重算 |
| `NFR-OBS-009~012` | `NFS-OBS-03`、`NFS-OBS-08`、`NFS-OBS-12`、`TC-OBS-COR-001~003`、`TC-OBS-SIG-001~006`、`DS-OBS-CORRELATION-001`、`DS-OBS-TELEMETRY-SCHEMA-001` | log/metric/trace schema、关联和低基数标签均有断言 |
| `NFR-OBS-013~016` | `NFS-OBS-05`、`NFS-OBS-07`、`NFS-OBS-10`、`TC-OBS-QRY-001~004`、`TC-OBS-DIA-001~004`、`TC-OBS-RPT-001~005`、`TC-OBS-EXT-001~003` | query no-write、diagnostic、handoff 和 authenticity 均有断言 |
| `NFR-OBS-017~020` | `NFS-OBS-06`、`NFS-OBS-07`、`NFS-OBS-09`、`TC-OBS-RET-001~005`、`TC-OBS-REB-001~006`、`TC-OBS-UOW-001~008` | retention、rebuild、replay 和 partial failure 均有 controlled seam |
| `NFR-OBS-021~024` | `NFS-OBS-05`、`NFS-OBS-08`、`NFS-OBS-11`、`NFS-OBS-12`、`TC-OBS-OWN-001~004`、`TC-OBS-NW-001~005`、`TC-OBS-DEP-001~003`、`TC-OBS-HIST-001~002`、`TC-OBS-NFR-001~003` | 全仓 truth、外围失效、第二 truth、历史误用均有 P0 或结构性 gate |
| `AC-OBS-001~031` | Step 05 baseline、Step 06 TC matrix、Step 09 gates、本 Step 1~12 专项 | 无孤儿 AC；`AC-OBS-029~031` 由 NFR/redline/authenticity 专项承接 |
| `VF-OBS-001~010` | `TC-OBS-ING-001~004`、`TC-OBS-SIG-001~006`、`TC-OBS-AUD-001~004`、`TC-OBS-QRY-001~004`、`TC-OBS-REB-001~006`、`TC-OBS-RET-001~005`、`TC-OBS-RPT-001~005`、`TC-OBS-DEP-001~003`、`TC-OBS-HIST-001~002` 与五个 scripts | 每个 veto 有负向测试或静态 gate；设计阶段不声称通过 |

### 10.1 反向审计

| 审计项 | 结果 |
|---|---|
| 是否存在没有 NFR/AC/VF 来源的专项 | 否；`NFS-OBS-01~12` 均回指 current 编号或结构性实现约束 |
| 是否存在有来源但没有 TC/dataset/suite 的 P0 红线 | 否；当前 99 TC、82 dataset 和 9 suite 可承载本 Step 主轴 |
| 是否将 RuntimeLike、外部产品或历史数字冒充当前结果 | 否；未建立项保持 `planned_not_evaluated` / `not_run` |
| 是否将 candidate EV 当正式 evidence | 否；只保留 planned linkage，正式 evidence 仍待真实执行和后续验收 |
| 是否允许观察面反写业务 truth | 否；write spy、snapshot comparison 和 dependency scan 三重阻断 |
| 是否产生真实测试、run、artifact、report、verdict 或 signoff | 否 |

## 11. 回填草稿

正式 `05-测试方案.md` §10 只装配以下收口结论：

1. 以 `NFS-OBS-01~12` 覆盖结构性性能、可用性 / 降级、安全、redaction、correlation、audit/evidence、
   truth ownership、no-write、一致性、恢复、retention、report handoff、配置和依赖边界。
2. P0 红线必须通过 negative fixture、serialization boundary、write spy、snapshot comparison、static
   dependency check 或 report scan 验证；不能用日志文本、空 artifact 或静态映射代替。
3. commit unknown、stored result 缺失、outbox / external phase、claim/fence、report fold、retention race、
   config activation failure 和 J06 controlled blocked 均保持 typed failure / blocked 语义。
4. log/metric/trace/durable audit 均有字段来源、提交时点、禁止字段和 truth separation；evidence linkage
   只保存 body-free relation；retention marker 不等于 backend retention；report handoff 不等于 verdict。
5. 没有正式负载来源时只记录 duration/count sample 和 trend，不固化历史 P95/P99/SLA；`RuntimeLike` 未建立时不
   用 CI 结果填充。

## 12. blocker、待确认事项与 Step 门禁

### 12.1 inherited blocker / affected

以下项从上游继承，本 Step 不关闭，也不把它们改写成 pass：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

### 12.2 本 Step 新发现

未发现新的上游 blocker。`RuntimeLike` / `ENV-STG-RT`、目标实现仓、真实 pipeline、真实 artifact/report
和 formal evidence 均未建立，属于真实性状态或 inherited affected，不得被写成 blocker 已关闭。

### 12.3 Step 自检

| 检查项 | 结论 |
|---|---|
| SOP 五个问题均有回答 | pass |
| 专项均有风险、方法、输入、环境、断言和候选证据关系 | pass |
| 安全 / truth / no-write P0 红线可由已有 TC/dataset/suite 承载 | pass |
| fault injection 覆盖 UoW、commit unknown、replay、outbox、fence、report、retention、config、J06 | pass_with_inherited_affected_open |
| log/metric/trace/audit、evidence、retention、handoff 契约已闭合 | pass |
| NFR/AC/VF 双向覆盖无孤儿 | pass |
| 真实执行事实是否存在 | no; `not_run` by design |
| gate_status | `pass_current_step_10_with_inherited_affected_open` |
| next_allowed_action | `rebuild_current_05_step_11` |
| commit | 不需要；用户未要求提交 |
