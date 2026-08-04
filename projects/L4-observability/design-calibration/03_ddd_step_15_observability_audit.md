# L4-observability 03-详细设计 Step 15 · 可观测性与审计埋点契约

> 对应正式文档章节: `03-详细设计.md` 第 14 章「可观测性与审计埋点契约」
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 当前状态: Step 15 的 M2 设计记录已完成，保留 inherited affected，完成后停在 Step 16 前
> 文件性质: 当前 full-restart 的 Step 15 中间产物,不是正式 `03-详细设计.md`

---

## 1. Step 状态

| 项 | 当前记录 |
|---|---|
| 当前文档 | `03-详细设计` |
| 当前 Step | Step 15「定义可观测性与审计埋点契约」 |
| 当前模块 | `observability-audit` |
| 当前模式 | `full-restart` |
| 上游完成状态 | Step 01~14 已形成当前设计记录；inherited affected 仍开放，不表述为无条件通过 |
| 当前输出 | 日志埋点表、指标埋点表、Trace / span 切口表、审计事件表、字段安全矩阵、递归保护和正式回填草稿 |
| 正式文档状态 | `projects/L4-observability/03-详细设计.md` 仍是 historical material,本 Step 不修改 |
| 当前 blocker | 未发现新的上游 blocker；inherited upstream/internal affected 继续登记 |
| gate_status | `Step15_M2_completed_waiting_before_Step16` |
| next_allowed_action | `stop_before_step_16;await_user_confirmation` |

## 2. 本步目标与非目标

### 2.1 目标

本 Step 把 Step 06~14 已闭合的对象、协议、处理流、错误、事务、并发和 runtime binding 转译为代码埋点契约,使实现者能够确定:

1. 哪些 entry、application、repository、UoW、worker、job、resolver、publisher、handoff 和 runtime builder 切口必须产生结构化日志。
2. 哪些关键路径必须产生 counter、histogram 或 gauge,以及每个指标允许使用哪些低基数标签。
3. 哪些 runtime trace / span 必须建立、如何传播 `TraceCorrelationRef`,以及 span 结果如何与 committed / rejected / indeterminate 语义对齐。
4. 哪些 accepted 本仓事实变化必须复用现有 history、audit append、outbox、marker、intent、report 和 stored replay surface 形成 durable audit trail。
5. 哪些 rejected、duplicate、in-flight、conflict、pre-UoW validation、Query 和 runtime failure 只能写 out-of-band telemetry,不能伪造成 accepted audit。
6. 日志、指标、trace、durable audit、report handoff 和外部 telemetry sink 分别允许记录什么,禁止记录什么。
7. 本仓如何避免“观测自己的观测输出”形成同步回灌、递归写入、重复审计或 retry authority。

### 2.2 非目标

本 Step 不定义:

- 告警阈值、SLO、错误预算、dashboard、pager、on-call 流程或人工 runbook。
- 日志级别动态配置、采样率、metric bucket 数值、日志 / metric / trace 保留周期或具体 retention days。
- OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC 或其他具体产品选型。
- 新的业务对象、通用 audit ledger、read-access ledger、public DTO、repository port、outbound event 或 durable telemetry schema。
- 真实测试 `run_id`、真实 evidence alias、测试结果、验收签署或 final verdict。
- `04-配置设计.md` 的 exact key、source precedence、endpoint、topic、secret provider、profile override 或 activation / rollback 细节。

若实现阶段发现必须新增 telemetry port、durable audit object、协议字段、store 或 adapter outcome,必须回到 Step 06~14 对应真相源重新闭口,不能在埋点代码中私补。

## 3. 输入材料与采用方式

| 输入 | 当前采用方式 |
|---|---|
| 详细设计 SOP Step 15 | 固定五个问题、三张必选表和“只写代码埋点、不写运维阈值”边界 |
| 详细设计书写规范 5.14 | 固定日志、指标、审计事件输出格式,并补齐目标明确要求的 trace 切口 |
| 正式 `01-架构设计.md` §13 | 固定 redaction-first、forbidden body、audit traceability、核心 / 外围可见性和 no-write 横切红线 |
| 正式 `02-概要设计.md` | 固定 observation truth、safe signal、audit projection、body-free evidence、handoff、retention 和 no-write owner |
| Step 06 对象契约 | 使用 `ObservationOperationContext`、`CorrelationContext`、`SafeSignal`、`AuditProjection`、`EvidenceLinkage`、history record、outbox、job report 等已定义载体 |
| Step 07 Port / Adapter 契约 | 埋点放在既有 entry、service、repository、UoW、resolver、publisher、delivery 和 fake 边界,不新增业务 port |
| Step 08 协议契约 | 覆盖 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event 和 9 Operations Job 的有限 operation namespace |
| Step 09 函数级处理流 | 以 shared accepted Command、read-only Query、accepted Consumer、staged Job 和 outbox publication 顺序确定打点位置 |
| Step 10 状态矩阵 | 状态标签只使用已定义有限 state / disposition,观测不能绕过 terminal guard |
| Step 11 持久化与事务 | durable audit 复用现有 history / audit / marker / report;runtime telemetry 不参与 accepted UoW 原子性 |
| Step 12 错误与恢复 | 使用 typed error layer、`ObservationRecoveryClass`、commit unknown、probe-before-retry 和 forbidden-body 规则 |
| Step 13 并发与幂等 | duplicate / in-flight / conflict / fence-loss 只记 telemetry,不得重放 durable side effect |
| Step 14 配置与外部绑定 | 记录 safe config / binding ref、adapter family、phase 和 startup issue;禁止 endpoint、topic、credential 和 provider body |
| L1-governance / L1-artifact / L1-identity / L0-bus Step 15 | 只参考日志、指标、trace、审计、redaction 与停审粒度,不复制相邻仓业务对象 |

### 3.1 真相源优先级

发生冲突时按以下优先级处理:

```text
当前正式 00 / 01 / 02
  > 当前 full-restart Step 01~14
  > 当前 Step 15 收口
  > 参考项目粒度
  > 旧 README / 旧正式 03 / 旧 Step 15 / 旧 04~07
```

旧材料中的 schema、产品、阈值、冷存期限、hash chain、事件数量或 implementation boundary 不得越级成为本 Step 结论。

## 4. 分批写入计划

| 批次 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| 15.0 | 输入、SOP 回答、historical material 诊断、信号分层 | done | runtime telemetry 与 durable truth 分离 |
| 15.1 | 字段安全词表、日志级别与日志埋点 | done | 关键 flow / error branch 均有安全日志切口 |
| 15.2 | 指标名称、类型、位置、低基数标签 | done | 禁止高基数 / 敏感标签 |
| 15.3 | Trace / span 拓扑、传播和结束语义 | done | trace 不升级为业务 truth,Query 保持 no-write |
| 15.4 | durable 审计载体与审计事件映射 | done | 复用现有 record / outbox / marker / report,不新增 ledger |
| 15.5 | redaction、递归保护、retention / handoff / no-write 边界 | done | telemetry 不同步回灌本仓 |
| 15.6 | flow 覆盖、cross-step audit、回填草稿、自检和门禁 | done | 用户确认前不得进入 Step 16 |

## 5. SOP 问题回答

### 5.1 哪些处理流必须记录审计?

| Flow family | durable audit 结论 |
|---|---|
| 16 个 Command | 只有 accepted 本仓 fact / marker / relation transition 才按 Step 09 / 11 在同一 UoW 保存 owner state、mandatory history / audit record、source index、outbox snapshot、stale marker、stored result 和 idempotency complete。普通 rejected / conflict / in-flight 不新增 durable audit。 |
| 14 个 Query | Query 只读。允许 out-of-band log / metric / span,禁止 append `ReadAccessRecord`、history、audit、outbox、stored result、idempotency、gap 或 repair marker。 |
| 9 个 Inbound Consumer | 只有 accepted local receipt / snapshot / projection input / marker / history 变化才形成 durable audit；unsupported、pre-parse reject、duplicate replay 和 temporary failure 不新增 accepted audit。 |
| 12 个 Outbound Event | accepted owner UoW 保存 exact stored outbox payload snapshot；publisher 只更新 publication state和 Job report,不新增第二套 event audit ledger。 |
| 9 个 Operations Job | start / item / finalize 只写 immutable plan、claim/fence、structured outcome、derived state、native history、intent、report 和 stored result；不得写 source truth repair audit。 |
| report / export delivery | 复用 `HandoffLifecycleRecord`、`PeripheralDeliveryRecord`、external intent / receipt 和 Job report；Delivered 只表达 transport handoff,不是 final verdict。 |

### 5.2 哪些错误分支必须记录日志?

必须记录结构化日志的分支包括:

- route / body mismatch、metadata / ref / envelope / page validation reject、unsupported schema 和 forbidden body detection。
- idempotency replay、conflict、in-flight、completed reservation result missing / wrong kind。
- domain / policy rejection、not-visible、stale、degraded、missing、blocked 和 quarantine。
- repository unavailable、version / unique conflict、mandatory history / outbox / result failure、commit known failure、commit unknown 和 rollback failure。
- consumer ack / dead-letter runtime failure、publisher retryable / permanent failure、payload missing / corrupt。
- job claim / fence conflict、item failure accounting failure、finalize incomplete / unknown。
- resolver disabled / unavailable / invalid、external prepare / deliver unknown、probe unsupported 和 local finalize failure。
- config validation、store capability、adapter construction、required capability 和 entry binding assembly failure。
- telemetry field redaction failure与self-observation recursion suppression。后两者不得通过同一失败 sink 递归记录。

### 5.3 哪些关键路径需要指标?

Command、Query、Consumer、Job、idempotency、UoW、repository、resolver、outbox publication、projection / rollup rebuild、reference refresh、gap scan、retention / no-write、handoff / export、config validation、runtime assembly、adapter availability 和 telemetry suppression 均需要计数、耗时或状态指标。指标只描述有限分类与趋势,不得成为单条业务记录、accepted truth、retry 决策或 evidence 的唯一来源。

### 5.4 日志、指标、trace 和审计字段分别记录什么?

| Channel | 记录内容 | 不承担的职责 |
|---|---|---|
| structured log | finite operation / phase / result / error / state、safe issue ref、必要的 body-free owner ref、duration / count | 不证明 durable commit,不替代 audit/history,不保存 body |
| metric | finite operation / result / error / state / adapter family / phase 标签及数值 | 不定位单条记录,不承载 ref / key / digest / body |
| runtime trace / span | parent-child runtime 调用、trusted trace correlation、finite span attributes、耗时和终止结果 | 不成为 `CorrelationContext`、`SafeSignal`、execution truth 或 durable audit |
| durable audit | accepted owner state、typed subject / actor safe ref、from/to state、reason / purpose、committed cursor、history / marker / report refs | 不复制 runtime log/span、raw body、provider response或外部 truth |

### 5.5 哪些监控和告警细节留给后续文档?

阈值、SLO、dashboard、采样率、bucket 数值、retention period、sink product、deployment route、pager 和 runbook 均不在本 Step 定义。`04` 只可补 exact config / binding,不能改变本 Step 的字段红线、递归保护、Query no-write、duplicate no-rerun 或 audit truth 边界。

## 6. Historical material 诊断

### 6.1 旧 Step 15 诊断

旧文件仅 81 行,将多类 schema 先行写成当前 truth,缺少正式日志表、指标表、trace 表、审计事件到既有 durable owner 的映射、错误分支和递归保护。以下旧对象全部降级为 historical material:

| 旧对象 / 口径 | 冲突 | 当前处理 |
|---|---|---|
| `NormalizedLogRecord` | 当前 Step 06 没有该 durable owner；会把 runtime log 当本仓通用 truth | 删除,运行日志保持 out-of-band |
| `MetricPoint` / `MetricRollup` | 与当前 `SafeSignal`、`SignalRollupWindow` 及 projection job 契约冲突 | 删除,本 Step 指标只指 service runtime metric |
| `TraceSpanRecord` | 当前未定义 durable runtime span store；会混同 span 与 `CorrelationContext` | 删除,span 仅 out-of-band runtime telemetry |
| `AuditEventProjection` | 与 `AuditProjection` / `AuditAppendRecord` 重复 owner | 删除,复用当前正式对象 |
| `RedactionDecision` | 当前 redaction-first 由 safety / policy / boundary guard 承接,不是独立万能对象 | 删除,定义 emission 前字段 allowlist |
| `EvidenceLink` | 与 `EvidenceLinkage` 及其 purpose / digest / visibility 契约冲突 | 删除,只引用当前正式对象 |
| `raw_payload_ref` | 可能成为 forbidden body 的间接保存路径 | 禁止进入 log / metric / trace / audit |
| hash linkage / cold retention / product binding | 当前未在上游闭口且越过 Step 15 范围 | 继续 historical / deferred |

### 6.2 当前上游缺口判断

| 检查项 | 结论 |
|---|---|
| 是否需要新增通用 audit ledger | 否。history、audit append、outbox、marker、intent、report 已覆盖 durable trail。 |
| 是否需要让 Query 同步写 read audit | 否。Step 11 已 phase-reserve `ReadAccessRecord`,当前无独立异步 accepted flow,Query 必须 no-write。 |
| 是否需要新增 runtime telemetry business port | 否。埋点由 entry / application / infra boundary 的 telemetry facade 承接,不得进入 domain；若实现必须引入自定义 port,需回 Step 07 / 14。 |
| 是否需要给 telemetry backend 增加 `RetentionMarker` | 否。backend retention 与本仓 durable marker 是两个边界。 |
| 是否存在上游 blocker | 否。Step 06~14 足以定义本 Step,目标实现仓缺失仍后移 Step 17 / `07`。 |

## 7. 信号分层与唯一 owner

### 7.1 四层信号模型

```text
Layer A: process runtime telemetry
  structured logs + runtime metrics + runtime spans
  out-of-band, best-effort, no business UoW, no replay authority

Layer B: observability-owned durable facts
  receipt / safety / correlation / safe signal / audit projection / evidence linkage
  handoff / retention / no-write / gap / reference / derived state + mandatory history

Layer C: durable propagation and execution material
  outbox payload snapshot / publication state / immutable job plan
  claim + fence / external intent + token / structured item outcome / job report

Layer D: read and handoff surfaces
  query view / diagnostic / evidence-index input / report handoff / peripheral export
  read-only or formally prepared local handoff,never upstream business truth
```

### 7.2 层间规则

| 规则 | 正式要求 |
|---|---|
| Layer A 不替代 Layer B | 有 accepted mutation 时,日志成功或 span OK 不能替代 mandatory history / audit record；history write 失败必须 rollback accepted UoW。 |
| Layer B 不保存 Layer A body | `SafeSignal` 是经正式 intake / safety / redaction 后的 observation-owned fact,不是将本进程日志、metric sample 或 span body直接落库。 |
| Layer C 不由 telemetry 重建 | outbox snapshot、intent、token、plan、report 缺失时必须 consistency failure,不能从日志或 trace 重建。 |
| Layer D 不反写 Layer B / upstream truth | Query / diagnostic / report / export 不因读取结果自动刷新、补 gap、修 source 或创建 accepted audit。 |
| telemetry sink 不成为 source | backend ack、availability、retention、dashboard state 或 query result不能成为 accepted / retry / published / delivered 的判定来源。 |

## 8. 设计原则与红线

| 原则 | 正式口径 |
|---|---|
| fixed vocabulary before emission | 日志 message、field key、metric name / label、span name / attribute 必须来自本 Step 有限词表,禁止把 free text 当分类字段。 |
| emit after semantic decision | accepted / published / delivered 指标和日志只能在对应 durable commit / finalize 后产生；commit unknown 必须记 `indeterminate`。 |
| logs are not audit | runtime log 可帮助定位,但不满足 history / audit / outbox 原子性。 |
| metrics are not record lookup | metric 标签只允许低基数 enum family,禁止 refs、IDs、keys、digests 和 free text。 |
| spans are not correlation truth | local span context 可帮助 runtime tracing,但不得回填或覆盖 `TraceCorrelationRef`、`CausationRef` 或 `CorrelationContext`。 |
| accepted audit reuses owners | 只使用 Step 06~14 已定义的 owner record / marker / report,不创建通用 `OperationAuditEvent`。 |
| query no-write | Query 只产生 Layer A telemetry,且 telemetry emitter不得同步调用本仓 write façade。 |
| duplicate no-rerun | duplicate / replay只记录一次 runtime replay结果,不新增 history、outbox、intent、report item或 accepted metric。 |
| indeterminate stays indeterminate | commit / external call outcome unknown 时不得记录 accepted / failed as certain；先按 Step 12 probe。 |
| redaction before serialization | 任一字段不能通过 allowlist 时丢弃整条 signal或字段集,禁止先序列化 body再做后处理。 |
| no self-observation loop | 本仓 Layer A sink不得同步或异步无界回灌本仓 Command / Consumer形成第二次 observation fact。 |
| telemetry is non-authoritative | sink failure不回滚 committed business fact,也不触发业务 retry；durable audit failure仍按 accepted UoW失败处理。 |

## 9. 公共字段安全契约

### 9.1 字段词表

| 字段族 | 合法来源 | 用途 | 约束 |
|---|---|---|---|
| `operation_name` | Step 06 finite `ObservationOperationName` | Command / Query / Consumer / Job 分类 | 不从 route / handler 字符串猜测 |
| `operation_family` | command / query / consumer / job / publisher / runtime | 低基数 channel 分类 | finite enum only |
| `phase` | entry / validate / reserve / load / transition / persist / commit / external / finalize | 定位处理阶段 | 不用函数名或 SQL 当 phase |
| `result_kind` | Step 08 outcome / Step 10 state / formal adapter outcome | 结果分类 | accepted 仅在正式落点后使用 |
| `error_layer` | contracts / domain / application / api / worker / jobs / infra / startup | 错误归属 | 不记录 raw error message |
| `error_kind` | typed variant 映射后的有限类别 | 错误分类 | 不解析 message text |
| `recovery_class` | `ObservationRecoveryClass` | 恢复姿态 | 只描述允许动作,不授权立即 retry |
| `trace_ref` | trusted metadata / envelope / job request | runtime 与 durable correlation | opaque,不得解析业务含义 |
| `correlation_context_ref` | committed `CorrelationContext` | 关联本仓 fact | 仅在visibility / safe-ref边界允许的 channel |
| `issue_ref` / `reason_ref` | typed safe issue / reason | 关联诊断 | 不展开 issue body |
| owner refs | committed receipt / signal / audit / handoff / retention / gap / outbox / report ref | 单记录定位 | 只允许 body-free typed ref,metrics 禁止 |
| `config_ref` | validated `ConfigBindingRef` | runtime assembly correlation | 不展开 raw config |
| `adapter_family` | Step 14 `AdapterFamily` | adapter 分类 | metrics 可用,raw adapter name / endpoint 不可用 |
| `effect_phase` | Step 14 `ExternalEffectPhase` | prepare / probe / deliver / publish阶段 | finite only |
| `duration_ms` / `item_count` | boundary timer / bounded collection | latency / batch magnitude | 不由 domain object产生 |

### 9.2 Channel 字段矩阵

`allow` 表示可按具体埋点表使用；`restricted` 表示仅在 typed safe ref、visibility 与 redaction guard 均通过时使用；`deny` 表示不得进入该 channel。

| 字段 / material | Log | Metric label | Span attribute | Durable audit / report |
|---|---|---|---|---|
| finite operation / family / phase | allow | allow | allow | allow when semantically relevant |
| finite result / state / error / recovery | allow | allow | allow | allow when owner record defines it |
| `TraceCorrelationRef` | restricted | deny | allow as propagated context,不重复明文 attribute | allow only existing object / snapshot field |
| `CausationRef` | deny by default | deny | restricted | allow only existing correlation/history relation |
| `CorrelationContextRef` | restricted | deny | restricted | allow |
| actor safe ref | deny by default | deny | deny by default | allow in mandatory history / audit owner |
| subject / source / event / owner typed ref | restricted | deny | restricted | allow when current record schema owns it |
| result / outbox / report / issue ref | allow when needed | deny | restricted | allow when current record schema owns it |
| idempotency key / dedup key | deny | deny | deny | only existing reservation store,not copied to audit |
| request / payload digest | deny | deny | deny | only existing snapshot / plan / reservation field,not copied |
| source version token | deny | deny | deny | only existing reference snapshot / envelope store semantics |
| repository version / cursor | restricted | deny | restricted kind only | allow only existing record / snapshot field |
| fencing token / external effect token | deny | deny | deny | only existing claim / intent / plan storage |
| config / external binding ref | restricted | deny | restricted | allow only plan / snapshot / intent owner |
| adapter family / mode / availability | allow | allow | allow | existing report only,not business audit |
| endpoint / topic / route / path / credential ref | deny | deny | deny | deny except infra-private binding store already defined |
| count / duration | allow | metric value | allow | report count only when schema already defines it |
| raw request / event / log / metric / trace / evidence / config / provider body | deny | deny | deny | deny |
| real `run_id`, evidence alias, signoff, verdict | deny | deny | deny | deny unless future real execution flow owns it;当前无此 flow |

### 9.3 日志级别规则

| Level | 使用场景 | 禁止用法 |
|---|---|---|
| `debug` | 高频 entry start、repository read、resolver success、UoW begin、claim acquire、normal item detail | 不作为 accepted / delivered 唯一证明 |
| `info` | committed accepted、duplicate replay、consumer accepted、job terminal summary、published / delivered finalize、runtime assembled | commit 前不得提前写 accepted；assembled 不等于 adapter healthy |
| `warn` | validation / domain reject、conflict / in-flight、not-visible / stale / degraded、temporary adapter failure、quarantine、CAS / fence loss | 不写 raw rejected body或 winner data |
| `error` | consistency defect、stored material missing / corrupt、commit unknown、rollback failure、dead-letter、forbidden-body emission attempt、runtime assembly failure | 不直接格式化 raw error / stack / provider response |

## 10. 日志埋点表

### 10.1 Entry 与 route

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API Command entry accepted for validation | `debug` | `operation_name`,`operation_family=command`,`phase=entry`,`trace_ref?` | 证明进入静态 route mapper,不记录 request body |
| API Query entry accepted for validation | `debug` | `operation_name`,`operation_family=query`,`phase=entry`,`trace_ref?` | 记录只读入口 |
| route / concrete body mismatch | `warn` | `operation_family`,`phase=validate`,`error_layer=contracts`,`error_kind` | 证明 UoW / repository 未被调用 |
| metadata / typed ref / page validation rejected | `warn` | `operation_name?`,`operation_family`,`phase=validate`,`error_kind`,`issue_ref?` | 定位 pre-UoW failure |
| entry availability guard disabled / unavailable | `warn` | `operation_name`,`adapter_family`,`result_kind`,`issue_ref?` | 区分 entry 不可用与 application rejection |
| response mapping completed | `debug` | `operation_name`,`result_kind`,`error_layer?`,`duration_ms` | 记录最终 public surface,不输出 response body |

### 10.2 Command、幂等与 accepted UoW

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| operation context created | `debug` | `operation_name`,`phase=validate`,`trace_ref?` | 证明 static operation mapping完成 |
| idempotency reservation acquired | `debug` | `operation_name`,`phase=reserve`,`result_kind=acquired` | 标识 first writer,不记录 key / digest |
| duplicate stored result replayed | `info` | `operation_name`,`result_kind=duplicate_replayed`,`result_ref` | 证明未重跑 domain / outbox |
| idempotency conflict | `warn` | `operation_name`,`result_kind=conflict`,`error_kind` | 区分 same key different digest,不泄漏旧 result |
| idempotency in-flight | `warn` | `operation_name`,`result_kind=in_flight`,`recovery_class` | 证明 no second writer |
| owner state / dependency missing | `warn` | `operation_name`,`phase=load`,`error_kind`,`issue_ref?` | 记录 typed not-found / delayed,不猜 source truth |
| domain / policy transition rejected | `warn` | `operation_name`,`phase=transition`,`error_layer=domain`,`error_kind`,`reason_ref?` | 证明所有 staged write rollback |
| version / unique conflict | `warn` | `operation_name`,`phase=persist`,`error_kind`,`recovery_class=RetryAfterReload` | 定位 winner conflict,不记录 version值 |
| mandatory history / index / outbox / result write failed | `error` | `operation_name`,`phase=persist`,`error_kind`,`issue_ref?` | 证明 accepted UoW不可部分提交 |
| commit known failure | `error` | `operation_name`,`phase=commit`,`result_kind=aborted`,`error_kind` | 说明 backend确认未提交 |
| commit outcome unknown | `error` | `operation_name`,`phase=commit`,`result_kind=indeterminate`,`recovery_class=ProbeBeforeRetry`,`issue_ref?` | 禁止记录 accepted / rejected certainty |
| rollback failed / unknown | `error` | `operation_name`,`phase=rollback`,`result_kind=indeterminate`,`recovery_class=ManualIntervention`,`issue_ref?` | 标记人工分类风险 |
| Command accepted commit completed | `info` | `operation_name`,`result_kind=accepted`,`result_ref`,`changed_count`,`outbox_count`,`duration_ms` | commit 后串联 public result；owner refs由具体 flow按需加入 |
| formal quarantine committed | `warn` | `operation_name`,`result_kind=quarantined`,`quarantine_ref?`,`gap_count`,`result_ref?` | 只说明 body-free marker committed |

### 10.3 Query no-write

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| Query repository / projection read completed | `debug` | `operation_name`,`phase=load`,`result_kind`,`duration_ms`,`item_count?` | 记录读路径,不触发 write |
| visible / empty Query returned | `debug` | `operation_name`,`result_kind=visible_or_empty`,`item_count`,`duration_ms` | 区分 empty success 与 missing |
| Query not-visible / blocked | `info` | `operation_name`,`result_kind`,`issue_ref?` | 不泄漏不可见 body或额外存在性 |
| Query stale / rebuilding / degraded / disabled | `warn` | `operation_name`,`result_kind`,`state_kind`,`progress_ref?`,`gap_count?` | 解释 exact read surface |
| Query consistency defect | `error` | `operation_name`,`error_kind`,`issue_ref?`,`recovery_class=ManualIntervention` | no-write / no placeholder / no inline repair |
| Query write attempt blocked before call | `error` | `operation_name`,`phase=validate`,`error_kind=no_write_boundary`,`issue_ref?` | 证明 forbidden write未执行；不自动创建 violation flow |

### 10.4 Inbound Consumer 与 worker runtime

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| envelope received | `debug` | `operation_name`,`producer_family`,`phase=entry`,`trace_ref?` | 记录 consumer入口,不输出event ref或payload |
| envelope field missing / duplicate field | `warn` | `operation_name?`,`producer_family?`,`phase=validate`,`error_kind` | 证明 payload未进入application |
| unsupported schema | `warn` | `operation_name`,`producer_family`,`result_kind=unsupported_schema`,`error_kind` | 证明 payload未解析、无stale marker |
| forbidden body detected | `error` | `operation_name`,`producer_family`,`result_kind=quarantined_or_rejected`,`issue_ref?` | 只记录检测类别,不记录body |
| Consumer duplicate replay | `info` | `operation_name`,`result_kind=duplicate`,`result_ref?` | 证明未重写snapshot / marker / outbox |
| older / equal source version no-write classification | `info` | `operation_name`,`producer_family`,`result_kind=noop_or_duplicate`,`reason_ref?` | 证明未按occurred_at猜顺序 |
| Consumer accepted local commit | `info` | `operation_name`,`producer_family`,`result_kind=accepted`,`result_ref?`,`changed_count`,`outbox_count` | 记录local fact,不升级上游truth |
| Consumer delayed / rejected / dead-lettered | `warn` / `error` | `operation_name`,`producer_family`,`result_kind`,`error_kind`,`gap_count?`,`issue_ref?` | 区分 formal surface |
| ack failed after local commit | `warn` | `operation_name`,`phase=ack`,`result_kind=failed`,`error_kind`,`result_ref?` | broker重投应走duplicate replay |
| dead-letter runtime handoff failed | `error` | `operation_name`,`phase=dead_letter`,`error_kind`,`issue_ref?` | 已有local marker不变,不复制payload |

### 10.5 Repository、UoW、cursor 与 consistency

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| UoW begin / known commit / rollback completed | `debug` | `operation_name`,`phase`,`result_kind` | 串联事务阶段,不记录transaction handle |
| repository call failed | `warn` / `error` | `operation_name`,`repository_family`,`phase`,`error_kind`,`recovery_class` | 使用logical repository family,不输出SQL / table / driver body |
| observation / reference cursor assigned | `debug` | `operation_name`,`cursor_kind`,`phase=persist` | 只记录tag kind,不把数值当业务顺序证据 |
| projection membership / target aggregate invariant failed | `error` | `operation_name`,`phase=persist`,`error_kind`,`issue_ref?` | 证明owner mutation rollback |
| stored result missing / wrong kind | `error` | `operation_name`,`result_ref`,`error_kind`,`recovery_class=ManualIntervention` | 禁止从current truth重构 |
| outbox snapshot missing / corrupt | `error` | `operation_name=PublishObservationOutbox`,`outbox_ref`,`error_kind`,`recovery_class` | 不重建payload bytes |
| no-write marker persistence failed | `error` | `operation_name`,`error_kind`,`issue_ref?` | forbidden target仍被阻断,不宣称violation已durable保存 |

### 10.6 Job、claim、fence 与 finalize

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| Job entry / start plan capture | `debug` | `operation_name`,`job_execution_ref`,`phase=start`,`trace_ref?` | `job_execution_ref`仅本仓job identity,不是real run id |
| terminal Job duplicate replay | `info` | `operation_name`,`result_kind=duplicate_replayed`,`report_ref`,`result_ref` | 证明不重新扫描或执行item |
| nonterminal Job in-flight | `warn` | `operation_name`,`result_kind=in_flight`,`recovery_class=RetryAfterStateChange` | 不创建second plan/report |
| immutable plan / config snapshot saved | `info` | `operation_name`,`plan_ref`,`report_ref`,`config_ref`,`item_count` | 不记录plan digest / raw config |
| item claim acquired / released / expired | `debug` | `operation_name`,`item_kind`,`claim_state`,`phase=item` | 不记录fencing token值 |
| stale worker fence rejected | `warn` | `operation_name`,`item_kind`,`error_kind=execution_fence_conflict`,`recovery_class=RetryAfterReload` | stale worker不得写failure classification |
| item completed | `debug` / `info` | `operation_name`,`item_kind`,`result_kind`,`report_ref`,`duration_ms` | 只记录structured outcome,不记录item body |
| item failure accounting failed | `error` | `operation_name`,`item_kind`,`error_kind`,`report_ref`,`recovery_class=ManualIntervention` | 停止调度,不遗忘item |
| finalize incomplete / CAS conflict | `warn` | `operation_name`,`phase=finalize`,`result_kind`,`error_kind`,`report_ref` | 不重做items |
| Job terminal finalize committed | `info` | `operation_name`,`result_kind`,`report_ref`,`result_ref`,`changed_count`,`failed_count`,`duration_ms` | report不是验收结论 |
| Job finalize commit unknown | `error` | `operation_name`,`phase=finalize`,`result_kind=indeterminate`,`report_ref`,`recovery_class=ProbeBeforeRetry` | 先probe report/result/idempotency |

### 10.7 Outbox、resolver 与 external effect

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| resolver call completed | `debug` / `warn` | `operation_name`,`adapter_family`,`result_kind`,`duration_ms`,`issue_ref?` | 只记录safe summary outcome,不输出external body |
| outbox item preflight | `debug` | `operation_name=PublishObservationOutbox`,`outbox_ref`,`event_name`,`effect_phase=publish` | 证明使用stored snapshot / historical binding |
| publication call returned success | `debug` | `outbox_ref`,`event_name`,`result_kind=provider_reported_success`,`duration_ms` | 仍需local finalize后才记录Published |
| publication finalize committed Published | `info` | `outbox_ref`,`event_name`,`result_kind=published`,`report_ref?` | 不等于downstream consumed |
| publication retryable / permanent failure committed | `warn` / `error` | `outbox_ref`,`event_name`,`result_kind`,`error_kind`,`report_ref?` | 不回滚source truth |
| publication call outcome unknown | `error` | `outbox_ref`,`event_name`,`result_kind=indeterminate`,`recovery_class=ProbeBeforeRetry`,`issue_ref?` | 禁止blind republish |
| external intent committed before call | `debug` | `operation_name`,`effect_phase`,`adapter_family`,`intent_ref`,`config_ref` | 不记录token / endpoint / material digest |
| handoff / export prepare or deliver success returned | `debug` | `operation_name`,`effect_phase`,`result_kind=provider_reported_success`,`receipt_ref?` | local finalize前不得写Prepared / Delivered |
| handoff / export finalize committed | `info` | `operation_name`,`effect_phase`,`result_kind`,`handoff_ref?`,`delivery_ref?`,`receipt_ref?`,`report_ref` | transport fact不是verdict / signoff |
| external outcome unknown / probe unsupported | `error` | `operation_name`,`effect_phase`,`result_kind=indeterminate`,`recovery_class=ManualIntervention`,`issue_ref?` | 不换token / binding / target |

### 10.8 Config、runtime assembly、adapter 与 telemetry guard

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| raw config source load started / completed | `debug` | `phase=config_load`,`result_kind` | 不记录path、env value或raw config |
| config validation rejected | `error` | `phase=config_validate`,`config_ref?`,`error_kind`,`issue_ref` | fail-fast,无application call |
| sensitive ref unavailable | `error` | `phase=runtime_assembly`,`config_ref`,`adapter_family`,`error_kind`,`issue_ref` | 不记录secret / endpoint |
| store capability mismatch | `error` | `phase=runtime_assembly`,`config_ref`,`adapter_family`,`error_kind`,`issue_ref` | 不能best-effort降级原子性 |
| adapter construction / capability failed | `error` | `phase=runtime_assembly`,`config_ref`,`adapter_family`,`effect_phase?`,`error_kind`,`issue_ref` | 不记录provider body |
| runtime assembly completed | `info` | `phase=runtime_assembly`,`result_kind=assembled`,`adapter_count` | 只表示wiring ready |
| adapter availability observed | `debug` / `warn` | `adapter_family`,`availability_state`,`issue_ref?` | health不等于operation success |
| telemetry field rejected by allowlist | no recursive log on same sink | process-local suppression counter only | 禁止将被拒字段拼进fallback message |
| telemetry sink emission failed | no recursive log on same sink | process-local sink-failure counter only | 不调用本仓Command / Consumer记录失败 |
| self-observation recursion detected | no nested span/log | `observability_runtime_telemetry_suppressed_total{reason=self_recursion}` | fail closed for signal emission,业务flow继续按原语义 |

### 10.9 错误分支日志优先级

| Branch | 必须表达 | 禁止表达 |
|---|---|---|
| pre-UoW reject | operation family、phase、typed error kind | accepted、result ref、outbox ref、history ref |
| ordinary domain reject | exact error / reason category、rollback outcome | accepted audit或隐藏rejection transaction |
| duplicate | duplicate + stored result / report ref | accepted count、第二份history / outbox |
| conflict / in-flight | conflict class / recovery class | key、digest、old result content |
| commit unknown | indeterminate + probe-before-retry | accepted / failed certainty |
| Query consistency defect | typed defect + no-write | inline repair / placeholder success |
| forbidden body | detection category + issue ref | body、debug representation、hash as surrogate body |
| external unknown | phase + indeterminate + exact local intent ref | blind retry、new token、fallback target |
| runtime assembly failure | startup variant + safe refs | application rejected / job failed / evidence |

## 11. 指标埋点契约

### 11.1 命名与类型规则

| 规则 | 正式要求 |
|---|---|
| prefix | 所有本仓 runtime metric 使用 `observability_` 前缀 |
| counter | operation / transition / error / replay / suppression次数 |
| histogram | handler、service、repository、adapter、job item 与 external phase耗时,后缀 `_duration_ms` |
| gauge | 某次正式扫描或registry snapshot得到的current count / availability state；不得靠事件加减猜 durable truth |
| emit owner | entry、application、worker、jobs、infra adapter或runtime builder；domain对象不依赖metric backend |
| success timing | accepted / published / delivered只在对应commit / finalize完成后计数 |
| no metric-only truth | metric不能驱动retry、idempotency、retention、audit、evidence或report signoff |

### 11.2 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `observability_command_total` | counter | Command handler最终surface形成后 | `operation`,`result_kind`,`error_layer`；成功使用`none` |
| `observability_command_duration_ms` | histogram | Command entry到最终surface | `operation`,`result_kind` |
| `observability_command_committed_change_total` | counter | accepted commit完成后 | `operation`,`change_family` |
| `observability_query_total` | counter | Query最终surface形成后 | `operation`,`surface_kind`,`freshness_state` |
| `observability_query_duration_ms` | histogram | Query entry到response | `operation`,`surface_kind` |
| `observability_query_consistency_defect_total` | counter | Query typed consistency defect映射后 | `operation`,`defect_kind` |
| `observability_inbound_event_total` | counter | Consumer receipt形成后 | `operation`,`producer_family`,`result_kind` |
| `observability_inbound_event_duration_ms` | histogram | worker envelope到receipt | `operation`,`result_kind` |
| `observability_inbound_schema_rejected_total` | counter | unsupported / malformed envelope判定后 | `operation`,`producer_family`,`rejection_kind` |
| `observability_worker_delivery_total` | counter | ack / dead-letter runtime调用完成后 | `delivery_phase`,`result_kind` |
| `observability_idempotency_total` | counter | reserve / complete / replay / conflict / in-flight判定后 | `operation_family`,`result_kind` |
| `observability_stored_replay_defect_total` | counter | missing / wrong-kind stored surface检测后 | `operation_family`,`defect_kind` |
| `observability_uow_total` | counter | begin / commit / rollback返回后 | `operation_family`,`phase`,`result_kind` |
| `observability_uow_duration_ms` | histogram | 单个UoW边界 | `operation_family`,`result_kind` |
| `observability_repository_operation_total` | counter | repository call完成后 | `repository_family`,`operation_class`,`result_kind` |
| `observability_repository_duration_ms` | histogram | repository call前后 | `repository_family`,`operation_class`,`result_kind` |
| `observability_concurrency_conflict_total` | counter | CAS / unique / fence conflict映射后 | `resource_family`,`conflict_kind` |
| `observability_resolver_call_total` | counter | resolver formal outcome形成后 | `adapter_family`,`source_family`,`result_kind` |
| `observability_resolver_duration_ms` | histogram | resolver port调用前后 | `adapter_family`,`source_family`,`result_kind` |
| `observability_outbox_publication_total` | counter | publication item完成local finalize后 | `event_name`,`result_kind` |
| `observability_outbox_publish_duration_ms` | histogram | publish / probe external phase | `event_name`,`effect_phase`,`result_kind` |
| `observability_outbox_items` | gauge | formal pending scan snapshot形成后 | `event_name`,`publication_state` |
| `observability_job_total` | counter | Job terminal / duplicate surface形成后 | `operation`,`result_kind` |
| `observability_job_duration_ms` | histogram | Job entry到terminal response | `operation`,`result_kind` |
| `observability_job_item_total` | counter | structured item outcome committed后 | `operation`,`item_family`,`result_kind` |
| `observability_job_claim_total` | counter | claim acquire / release / expire / fence reject后 | `operation`,`claim_result` |
| `observability_projection_rebuild_total` | counter | read-model / rollup / peripheral item outcome committed后 | `projection_family`,`result_kind` |
| `observability_projection_rebuild_duration_ms` | histogram | rebuild item边界 | `projection_family`,`result_kind` |
| `observability_projection_items` | gauge | formal projection scan / read snapshot后 | `projection_family`,`freshness_state` |
| `observability_reference_refresh_total` | counter | reference item outcome committed后 | `source_family`,`result_kind` |
| `observability_gap_transition_total` | counter | formal gap transition committed后 | `gap_kind`,`to_state` |
| `observability_retention_transition_total` | counter | marker / protection transition committed后 | `transition_kind`,`to_state` |
| `observability_no_write_violation_total` | counter | formal violation transition committed后 | `violation_kind`,`to_state` |
| `observability_handoff_total` | counter | handoff prepare / deliver / feedback transition committed后 | `effect_phase`,`result_kind` |
| `observability_handoff_duration_ms` | histogram | handoff external phase | `effect_phase`,`result_kind` |
| `observability_peripheral_delivery_total` | counter | export / feedback delivery state committed后 | `delivery_family`,`result_kind` |
| `observability_config_validation_total` | counter | config candidate validation完成后 | `validation_stage`,`result_kind` |
| `observability_runtime_assembly_total` | counter | builder返回complete runtime或error后 | `assembly_stage`,`result_kind`,`error_kind`；成功使用`none` |
| `observability_adapter_availability_state` | gauge | availability registry snapshot | `adapter_family`,`adapter_mode`,`availability_state` |
| `observability_runtime_telemetry_suppressed_total` | counter | emission allowlist / recursion guard拒绝时 | `signal_kind`,`reason_kind` |
| `observability_runtime_telemetry_sink_failure_total` | counter | sink返回失败时,不得递归emit | `signal_kind`,`sink_result` |

### 11.3 标签允许值

| 标签 | 允许值来源 |
|---|---|
| `operation` | 16 Command、14 Query、9 Consumer、9 Job finite variant |
| `operation_family` | command / query / consumer / job / publisher / runtime |
| `result_kind` | Step 08 outcome、Step 10 state或Step 12 finite recovery result |
| `error_layer` / `error_kind` | Step 12 typed error taxonomy的有限映射 |
| `repository_family` | Step 07 logical repository family |
| `operation_class` | read / append / save / replace / reserve / complete / scan |
| `resource_family` | receipt / signal / audit / evidence / handoff / retention / outbox / projection / job等有限family |
| `producer_family` / `source_family` | formal producer / resolver family enum |
| `event_name` | 12 个 Step 08 outbound event名称 |
| `projection_family` | observation read model / diagnostic / rollup / peripheral / progress |
| `adapter_family` / `adapter_mode` | Step 14 finite catalog |
| `effect_phase` | publication / prepare / prepare-probe / delivery / delivery-probe |
| `reason_kind` | redaction / forbidden-field / recursion / sink failure等有限类别 |
| `change_family` | intake / safety / correlation / signal / audit / evidence / handoff / retention / no-write / gap / reference / derived / peripheral |
| `surface_kind` / `freshness_state` | Step 08 query surface与Step 10 projection freshness有限状态 |
| `defect_kind` / `rejection_kind` / `conflict_kind` | Step 12 consistency、validation和concurrency有限类别 |
| `delivery_phase` / `publication_state` | ack / dead-letter及Step 10 outbox publication有限状态 |
| `item_family` / `claim_result` | Step 13 immutable plan item family与claim / fence有限结果 |
| `gap_kind` / `transition_kind` / `violation_kind` / `to_state` | Step 06 / 10对应domain有限enum |
| `delivery_family` | report handoff / peripheral export / feedback有限family |
| `validation_stage` / `assembly_stage` | Step 14 builder / validator固定阶段 |
| `signal_kind` / `sink_result` | log / metric / span与emitted / suppressed / failed有限结果 |

### 11.4 禁止高基数与敏感标签

以下字段不得成为 metric label:

- actor、subject、source、event、receipt、signal、audit projection、evidence linkage、handoff、retention、gap、reference、outbox、report、plan、intent、issue等任何具体 ref。
- trace id / `TraceCorrelationRef`、`CausationRef`、correlation context ref、request ref、job execution ref。
- idempotency key、dedup key、request digest、payload digest、config ref、effect binding ref、token、cursor、version、fence。
- endpoint、topic、route、path、tenant、credential ref、secret、raw config value、SQL、HTTP status body、provider response。
- free text error / reason / message、raw body、debug dump或动态产品名称。

### 11.5 指标语义边界

| Metric outcome | 唯一合法打点时机 | 不代表 |
|---|---|---|
| `accepted` | accepted UoW commit成功后 | downstream published / business truth accepted |
| `duplicate_replayed` | exact stored surface兼容校验成功后 | 新mutation |
| `published` | provider result已由local publication finalize commit确认后 | downstream consumed |
| `prepared` / `delivered` | corresponding local handoff finalize commit后 | final verdict / signoff |
| `fresh` | projection replacement + target finalize正式成立后 | source truth repaired |
| `assembled` | complete runtime builder返回后 | adapter available / operation successful |
| `sink_failure` | runtime telemetry sink调用失败后 | business operation failed |

Gauge必须来自一次完整snapshot而不是事件增减推算。`observability_outbox_items`和`observability_projection_items`设置当前绝对count；`observability_adapter_availability_state`采用one-hot current-state语义,当前state为`1`,同一adapter family / mode的旧state为`0`或从snapshot移除。Gauge更新失败不改变durable state。

## 12. Trace / span 契约

### 12.1 Context 与传播规则

| 规则 | 正式要求 |
|---|---|
| trusted context source | 只有 Step 08 metadata / envelope / Job metadata中的 `trace_ref` 可进入 `ObservationOperationContext`和durable snapshot |
| local runtime span | 当协议 `trace_ref=None` 时,telemetry facade可建立process-local span context,但不得回填DTO、request digest、`CorrelationContext`、outbox snapshot或stored result |
| causation boundary | `CausationRef` 只能来自已验证 correlation input / object,不能从span parent、route或timestamp推导 |
| parent-child | entry span是root或trusted parent的child；repository / resolver / external / item span是当前operation span child |
| async handoff | outbox / Job / Consumer只传播其stored / incoming trusted `trace_ref`;不能用current worker span覆盖历史snapshot |
| no business inference | trace success、parent relation和duration不能证明accepted、execution success、evidence authenticity或source ownership |
| no durable span store | 当前不保存 `TraceSpanRecord`;runtime backend retention不受`RetentionMarker`控制 |

### 12.2 Trace / span 切口表

| Span cut | Start | Required attributes | End condition |
|---|---|---|---|
| `observability.command` | Command静态route校验通过、调用application前 | `operation`,`operation_family=command` | final response;`accepted`仅commit后,unknown为`indeterminate` |
| `observability.query` | Query静态route校验通过 | `operation`,`operation_family=query` | visible / empty / not-visible / stale / degraded / error surface |
| `observability.consumer` | envelope header校验通过、payload parse前 | `operation`,`producer_family` | typed `ObservationConsumerReceipt`或pre-write error |
| `observability.job` | Job metadata / route校验通过 | `operation`,`operation_family=job` | terminal / duplicate response或start failure |
| `observability.uow` | `ObservationUnitOfWorkManager.begin`调用前 | `operation_family`,`phase` | commit / rollback / indeterminate |
| `observability.repository` | application调用一个logical repository前 | `repository_family`,`operation_class` | typed repository result / application error |
| `observability.idempotency` | reserve / complete调用前 | `operation_family`,`phase=reserve_or_complete` | acquired / replay / conflict / in-flight / error |
| `observability.resolver` | external safe-summary resolver调用前 | `adapter_family`,`source_family` | resolved / not-visible / stale / unresolved / unavailable |
| `observability.job.item` | immutable plan item加载并获claim后 | `operation`,`item_family`,`effect_phase?` | structured item outcome committed或accounting failure |
| `observability.outbox.publish` | stored snapshot / binding / token preflight通过后 | `event_name`,`effect_phase=publication` | local Published / Failed / DeadLettered finalize或indeterminate |
| `observability.external.effect` | committed intent与exact historical binding preflight通过后 | `adapter_family`,`effect_phase` | provider result + local finalize classification或indeterminate |
| `observability.projection.rebuild` | item source capture开始 | `projection_family`,`item_family` | replacement / failure accounting outcome |
| `observability.runtime.assembly` | raw source load开始 | `assembly_stage` | complete `BuiltObservabilityRuntime`或`RuntimeAssemblyError` |

### 12.3 Span attribute 规则

| Attribute class | 允许 | 禁止 |
|---|---|---|
| operation | finite name / family / phase | route path、handler private name、raw CLI arg |
| result | finite outcome / state / error / recovery | raw error message、stack、SQL、provider body |
| reference | 仅表中切口明确需要的body-free ref,并经过safe-field guard | actor、credential、token、digest、full sensitive ref |
| timing / size | duration、bounded item count | payload size若可反推敏感正文；unbounded dynamic map |
| external | adapter family、mode、phase、formal result | endpoint、topic、path、credential、external object body |

### 12.4 Span 结束语义

```text
entry validation reject         -> invalid
ordinary domain/policy reject   -> rejected
duplicate stored replay         -> duplicate_replayed
accepted commit completed       -> accepted
commit outcome unknown          -> indeterminate
external call unknown           -> indeterminate
provider returned then finalize failed known
                                -> finalize_failed,not delivered/published
Query not-visible / stale       -> successful semantic surface,not internal error
consistency defect              -> error / manual_intervention
```

Span status不能驱动业务 branch。实现必须先得到 Step 08 / 10 / 12 typed outcome,再映射 span status。

## 13. Durable 审计事件契约

### 13.1 审计载体边界

| 载体 | Owner / landing | 承载内容 | 不承载内容 |
|---|---|---|---|
| `IntakeDecisionRecord` | `ObservationIntakeRepository` | receipt / safety accepted decision、actor / reason、time | raw material body |
| `CorrelationLinkRecord` | `CorrelationSignalRepository` | correlation / signal relation transition | raw trace / log / metric body |
| `AuditAppendRecord` | `AuditEvidenceRepository` | audit projection / evidence linkage append kind、subject relation | source audit / evidence body |
| `HandoffLifecycleRecord` | `ReportHandoffRepository` | handoff / authenticity / delivery lifecycle | verdict、signoff、real run id |
| `RetentionChangeRecord` | `RetentionGuardRepository` | marker / active protection transition | cleanup authorization / retention days |
| `NoWriteViolationRecord` | `RetentionGuardRepository` | blocked / escalated / closed local violation | source repaired claim |
| `GapTransitionRecord` / `GapScanRecord` | retention / maintenance repository | gap lifecycle / scan result | fabricated missing material |
| `PeripheralDeliveryRecord` | peripheral owner repository | export preparation / delivery transition | external audit truth / product state |
| `ReferenceRefreshRecord` | reference repository | reference resolution / refresh transition | external body / lifecycle truth |
| `ProjectionMaintenanceRecord` | maintenance repository | stale / rebuild / replacement lifecycle | source truth repair |
| `ReplayExecutionRecord` | retention / maintenance repository | observation-side replay scope / execution result | upstream replay truth / repair claim |
| `ObservationOutboxRecord` + snapshot | outbox repository | committed propagation fact / publication state | current truth rebuild / downstream consume proof |
| plan / intent / item outcome / Job report | execution repositories | exact execution authority、external phase和structured result | test result、acceptance evidence、signoff |

“审计事件”在本 Step 表示上述既有载体的写入切口,不是新增同名 Rust DTO或第二套 ledger。

### 13.2 Command 审计事件表

| 审计事件切口 | 触发位置 | 记录字段 / existing landing | 消费方 |
|---|---|---|---|
| observation intake decision | `SubmitObservationMaterialFlow` accepted UoW | receipt / safety refs、decision kind / reason、actor safe ref、committed cursor、`IntakeDecisionRecord`、outbox/result refs | intake query、diagnostic、downstream observation consumer |
| safety disposition changed | `RecordSafetyDispositionFlow` accepted UoW | receipt / disposition refs、from/to state、reason、actor、`IntakeDecisionRecord`、outbox/result refs | intake / gap / diagnostic |
| correlation context changed | `BindCorrelationContextFlow` accepted UoW | context / receipt / source refs、from/to state、change reason、`CorrelationLinkRecord` | signal、audit、diagnostic |
| safe signal recorded / suppressed | `RecordSafeSignalFlow` accepted UoW | signal / context / summary refs、signal kind、from/to state、`CorrelationLinkRecord`、outbox/result refs | signal query、rollup、diagnostic |
| audit projection appended / restricted | `AppendAuditProjectionFlow` accepted UoW | projection / audit subject / context / source-audit refs、append kind、state、`AuditAppendRecord` | audit timeline、handoff、report consumer |
| evidence linkage changed | `LinkBodyFreeEvidenceFlow` accepted UoW | linkage / projection / boundary refs、purpose、digest summary existing field、visibility/state、`AuditAppendRecord` | evidence index、handoff、audit query |
| report handoff prepared / blocked | `PrepareReportHandoffFlow` accepted UoW | handoff / scope / consumer / immutable input refs、readiness/state、`HandoffLifecycleRecord`、outbox/result | report / archive / external audit handoff |
| authenticity hint changed | `EvaluateAuthenticityHintFlow` accepted UoW | handoff / hint / input / gap refs、hint kind、`HandoffLifecycleRecord` | handoff query、review consumer |
| retention marker changed | `SetRetentionMarkerFlow` accepted UoW | marker / protected ref、from/to state、protection / eligibility refs、`RetentionChangeRecord` | retention query、maintenance、handoff guard |
| active reference protection changed | `ProtectActiveReferenceFlow` accepted UoW | marker / protection / protected refs、from/to state、`RetentionChangeRecord` | retention、replay、handoff |
| replay scope defined | `DefineReplayScopeFlow` accepted UoW | scope ref、allowed observation-side effects、state、`ReplayExecutionRecord` or existing scope history landing | replay coordinator、operations |
| no-write violation changed | `RecordNoWriteViolationFlow` accepted UoW | violation / trigger / forbidden-target refs、from/to state、`NoWriteViolationRecord` | diagnostic、operations、audit timeline |
| gap state changed | `RecordGapStateFlow` accepted UoW | gap / source refs、kind、from/to state、`GapTransitionRecord` | query、handoff、maintenance |
| external audit export prepared | `PrepareExternalAuditExportFlow` accepted UoW | preparation / consumer / view refs、delivery state、`PeripheralDeliveryRecord` | peripheral delivery job、operations |
| reference snapshot registered | `RegisterReferenceSnapshotFlow` accepted UoW | snapshot / source refs、resolution state、source-version existing field、`ReferenceRefreshRecord` | query、handoff、refresh job |
| reference snapshot state changed | `UpdateReferenceSnapshotStateFlow` accepted UoW | snapshot ref、from/to state、reason、`ReferenceRefreshRecord` | query、maintenance、diagnostic |

### 13.3 Consumer、publication 与 Job 审计事件表

| 审计事件切口 | 触发位置 | 记录字段 / existing landing | 消费方 |
|---|---|---|---|
| inbound intake material accepted | bus / sandbox consumer accepted UoW | local receipt / safety / decision / gap refs、consumer result、native history、outbox | intake / diagnostic |
| source audit material accepted | source-audit consumer accepted UoW | projection / context / source-audit refs、`AuditAppendRecord`、gap / outbox refs | audit timeline、handoff |
| identity / governance context accepted | corresponding consumer accepted UoW | reference snapshot / boundary refs、visibility / gap、`ReferenceRefreshRecord` or current native record | audit / evidence / diagnostic |
| artifact evidence context accepted | artifact consumer accepted UoW | evidence linkage input / boundary / digest existing field、reference / gap refs、native audit / refresh record | evidence index、handoff |
| runtime / sandbox signal summary accepted | signal consumer accepted UoW | safe signal / context / runtime safe ref、native correlation / intake record | signal query、rollup |
| archive / report feedback accepted | feedback consumer accepted UoW | handoff / delivery / receipt refs、from/to state、native lifecycle / delivery record | report / peripheral query、operations |
| outbox publication finalized | `PublishObservationOutboxFlow` item finalize UoW | outbox / event refs、publication state、stable provider identity existing field、structured item outcome、report ref | operations、downstream delivery diagnostics |
| read model / diagnostic rebuilt | `RebuildObservationReadModelsFlow` item / finalize | target / view / progress refs、source cursor、maintenance record、item outcome、report | Query、operations |
| signal rollup rebuilt | `RebuildSignalRollupsFlow` item / finalize | rollup / source signal / progress refs、maintenance record、report | signal query、operations |
| reference refresh finalized | `RefreshReferenceSnapshotsFlow` item / finalize | snapshot / source / resolution refs、`ReferenceRefreshRecord`、report | Query、handoff、operations |
| gap scan finalized | `ScanObservationGapsFlow` item / finalize | target / gap refs、`GapScanRecord` / transition record、report | Query、handoff、operations |
| replay coordination finalized | `CoordinateObservationReplayFlow` item / finalize | replay scope / coordination / violation / gap refs、`ReplayExecutionRecord`、report | operations、diagnostic |
| report handoff delivery finalized | `PrepareReportHandoffDeliveryFlow` local finalize | handoff / preparation / receipt refs、state、`HandoffLifecycleRecord`、report | report / archive consumer、operations |
| external audit export delivery finalized | `PrepareExternalAuditExportDeliveryFlow` local finalize | preparation / delivery / receipt refs、`PeripheralDeliveryRecord`、report | external audit / GRC boundary、operations |
| peripheral views rebuilt | `RebuildPeripheralViewsFlow` item / finalize | view / progress refs、maintenance record、report | dashboard / alert / export read consumer |

### 13.4 Accepted 写入顺序

```text
validate protocol / context
  -> reserve idempotency
  -> load owner + guard
  -> domain transition
  -> stage owner state / relation
  -> append mandatory native history / audit record
  -> assign one tagged committed cursor
  -> record typed source membership
  -> append exact outbox snapshot where flow requires
  -> mark affected projections stale
  -> save exact stored result / consumer receipt
  -> complete idempotency
  -> commit
  -> emit runtime accepted log / metric and finish span
```

Runtime log / metric / span emission不进入该UoW,不能使事务成功或失败。Mandatory native history / audit record属于该UoW,写入失败必须整体rollback。

### 13.5 Rejected / failed / duplicate 审计边界

| Branch | Durable write | Runtime telemetry | 禁止事项 |
|---|---|---|---|
| pre-UoW invalid request / unsupported schema | none | log / metric / span | 创建audit/history/result/outbox |
| ordinary domain / policy rejection | none after rollback,除非Step 12明确formal owned negative fact | log / metric / span | 隐藏第二事务写generic rejection audit |
| accepted negative decision | exact receipt / safety / gap / no-write owner + native history | log / metric / span | 混同ordinary reject |
| duplicate replay | none in current attempt | replay log / metric / span | 第二份history / outbox / report item |
| conflict / in-flight | none | log / metric / span | 泄漏old result或创建new key绕过 |
| Query not-visible / stale / consistency defect | none | log / metric / span | append read audit / repair |
| temporary dependency failure | none by default | log / metric / span | 自动创建gap；gap必须走formal flow |
| commit unknown | no compensation event | indeterminate log / metric / span | accepted / rejected certainty |
| publisher / delivery failure | native outbox / delivery state和report,仅在formal short UoW commit后 | log / metric / span | rollback original truth或generic ErrorOccurred event |
| startup / config failure | none in business stores | runtime log / metric / assembly span | business audit、job report、evidence |

### 13.6 Outbound Event 与审计关系

12 个 outbound event都是 accepted local change的durable propagation snapshot,不是新审计 owner。它们必须回指 committed subject、tagged cursor、trace ref optional和exact stored payload；publication后只更新 native outbox state。禁止:

- 为发布失败创建通用 durable `ErrorOccurred` / `AuditFailure` event。
- 从 current truth、runtime log或span重建 payload。
- 把 Published 当 downstream consumed、accepted、reported或signed off。
- 把 telemetry backend ack 当 outbox publication receipt。

## 14. Redaction 与 forbidden material

### 14.1 Redaction matrix

| Material family | 允许记录 | 禁止记录 |
|---|---|---|
| API / Command / Query | finite operation、result、safe issue / result refs、duration / count | request / response body、header、credential、visibility internals、page cursor |
| Inbound Event | operation、producer family、schema result、safe receipt / gap refs | payload、broker header、topic、source-version token、dedup key |
| SafeSignal / correlation | signal kind/state、signal / context refs when required | raw log / metric / trace body、opaque trace text、runtime payload |
| Audit / evidence | projection / linkage / boundary refs、purpose/state、existing digest field in durable owner | source audit body、evidence / artifact / governance / identity body、digest in log/metric/span |
| Repository / UoW | logical family、operation class、result / error / recovery | SQL、table、row dump、driver message、connection string |
| Outbox | event name、outbox / snapshot refs where needed、publication state | serialized payload、payload digest、topic、route、provider response |
| Job | finite job / item kind、plan / report refs、counts、outcome | raw input、plan body / digest、fence token、claim private state、real run id |
| External effect | adapter family、phase、intent / receipt refs、formal outcome | endpoint、path、credential、token、material digest、provider body |
| Config / runtime | config ref、adapter family、assembly variant、issue ref | raw config、env value、secret、credential、endpoint、private registry dump |
| Diagnostic / error | typed error / recovery category、safe issue ref | free text error、stack trace、panic dump、HTTP body、provider body |
| Test / fake | formal adapter mode / outcome family | fixture body、private map、hidden key、fabricated evidence / test result |

### 14.2 Enforcement rules

| Rule | 实现要求 |
|---|---|
| structured fields only | 每个埋点使用固定message template和显式field list,禁止 `Debug` 整个 request / object / error / config。 |
| allowlist first | 先将typed input映射为本Step字段词表,映射失败则suppressed；不得先序列化后正则清洗。 |
| error mapper | raw infra error立即映射Step 12 typed category和safe issue ref；日志 / span不得读取source error display chain。 |
| ref visibility | body-free ref只有在该埋点表列出且当前visibility允许时输出；actor默认只留durable native audit。 |
| no hash escape hatch | 对 forbidden body、secret、token、source-version、payload不得以hash / digest / base64替代后输出。 |
| fixed metric labels | label必须由finite enum映射,unknown映射固定`unknown`类别或suppressed,不得把原值作为label。 |
| no fallback dump | redaction / serialization失败时不输出fallback debug body,只增加non-recursive suppression counter。 |
| fake parity | fake / controlled / disabled只暴露正式outcome category,不能比durable adapter输出更多private material。 |

## 15. Self-observation recursion guard

### 15.1 必须成立的不变量

| 编号 | 不变量 |
|---|---|
| `OBS-TELEM-001` | runtime log / metric / span emitter不得同步调用 `ObservationTruthWriteService`、`ObservationInboundEventService`、`ObservationMaintenanceService`或`ObservationPublicationService`。 |
| `OBS-TELEM-002` | telemetry sink失败不得创建 Command、Consumer envelope、outbox、gap、no-write violation、Job或retry本次业务operation。 |
| `OBS-TELEM-003` | 本仓runtime telemetry不得通过同一process / route / topic无界回流为 `SubmitObservationMaterial`、`RecordSafeSignal`或任一 `Consume*` 输入。 |
| `OBS-TELEM-004` | sink ack、drop、retry、retention或query result不得成为 accepted、published、delivered、fresh、healthy、evidence或signoff authority。 |
| `OBS-TELEM-005` | emitter内部不得为自身emit动作创建nested log/span；suppression / sink failure只更新process-local non-recursive counter。 |
| `OBS-TELEM-006` | 若未来deployment允许异步回采,必须在`04/07`重新设计明确origin / hop guard和bounded route；当前默认禁止,不能由实现私加。 |

### 15.2 调用方向

```text
business / application / infra cut
  -> safe-field mapper
  -> recursion guard
  -> process telemetry facade
  -> external or host-managed sink

forbidden directions:
  telemetry facade -> own Command / Consumer / Job façade
  sink callback     -> own accepted mutation
  sink failure      -> business retry / idempotency decision
  own runtime span  -> SafeSignal durable write
```

### 15.3 Failure behavior

| Failure | Required behavior | Business effect |
|---|---|---|
| unsafe field | suppress field set / signal,increment safe counter | original operation unchanged |
| recursive emission attempt | suppress nested signal,increment recursion counter | original operation unchanged |
| sink unavailable / timeout | return to emitter boundary without business retry | accepted truth remains committed;failed business flow remains failed for original reason |
| sink outcome unknown | do not probe through own application services | no durable marker |
| telemetry initialization unavailable | expose startup/process issue through host boundary as configured later | must not fabricate business rejection / evidence |

## 16. Correlation、evidence、retention、handoff 与 no-write 边界

### 16.1 Correlation

- `TraceCorrelationRef`、`CausationRef`、`CorrelationContextRef`和safe refs只用于关联,不得反推actor identity、business key、source truth或execution outcome。
- Missing protocol `trace_ref`允许本地runtime span继续,但不能生成durable correlation fact。
- Outbox publisher、Job resume和external finalize必须使用stored trace / context refs；current worker context不得覆盖历史关联。

### 16.2 Evidence linkage

- `EvidenceLinkage` durable owner可保存其既有 `digest_summary`,但runtime log、metric label和span不得复制digest。
- telemetry log / span、dashboard screenshot、sink receipt或metric sample不自动成为evidence。
- report handoff只能引用已commit的body-free projection / linkage / gap / authenticity material,不得从runtime telemetry临时拼装evidence。

### 16.3 Retention

| Retention subject | Owner | 本 Step 结论 |
|---|---|---|
| observation-owned durable material | `RetentionMarker` / `ActiveReferenceProtection` | 依现有state / history / guard管理,本Step不定义days或physical delete |
| outbox / plan / intent / report technical material | Step 11 logical store + later config | 保留规则不得破坏replay / finalize / audit解释能力 |
| runtime log / metric / span backend | host / deployment telemetry backend | 与`RetentionMarker`无等价关系,不由本仓marker自动控制 |
| report / archive handoff | `ReportHandoffRecord` + external owner | handoff只表达交接,不转移archive package truth |

### 16.4 Report handoff

- `ReportHandoffRecord`、immutable `EvidenceIndexInputView`、`HandoffLifecycleRecord`和delivery intent / receipt共同解释交接。
- Prepared / Delivered只在local finalize commit后产生；adapter返回、HTTP状态、sink ack或span success不足以证明。
- `job_execution_ref` / `JobReportRef`是本仓技术identity,不得标为真实测试 `run_id`、验收报告或evidence alias。
- report / external audit / GRC consumer反馈只通过正式Consumer更新local handoff / delivery state,不得直接修改audit projection或上游truth。

### 16.5 No-write

| Path | 允许 | 禁止 |
|---|---|---|
| Query / diagnostic | out-of-band log / metric / span | durable read audit、repair、gap / stale write |
| projection / rollup rebuild | derived state / native maintenance history / report | source truth mutation |
| replay coordination | approved observation-side effects / native violation or gap flow | upstream replay / repair command |
| handoff / export | local intent / lifecycle / receipt / report | consumer truth / verdict writeback |
| telemetry emitter | out-of-band emission | 调用任何own write façade |

## 17. Flow 到 log / metric / trace / audit 闭环

### 17.1 Protocol family coverage

| Family | Count | Log | Metric | Span | Durable audit |
|---|---:|---|---|---|---|
| Command | 16 | entry / reserve / reject / commit / accepted | total / duration / committed change / idempotency | `observability.command` + child UoW/repo/resolver | accepted native owner history / outbox / result only |
| Query | 14 | visible / empty / not-visible / stale / defect | total / duration / freshness / defect | `observability.query` + read children | none;strict no-write |
| Inbound Consumer | 9 | envelope / schema / duplicate / accepted / ack | total / duration / schema / delivery | `observability.consumer` | accepted local native history / snapshot / outbox / receipt only |
| Outbound Event | 12 | append / preflight / publish / finalize | pending snapshot / publication / duration | `observability.outbox.publish` | existing outbox record / snapshot / state,无second ledger |
| Operations Job | 9 | start / replay / claim / item / finalize | total / item / claim / duration | `observability.job` + `job.item` | plan / intent / native history / structured outcome / report |

### 17.1.1 五协议族 telemetry / audit schema closure index

本表把前述埋点细表收束成一个实现审计入口。四类信号共享 typed、有限、body-free 的逻辑 envelope；具体
runtime carrier 可以由实现选择，但不得改变字段来源、提交时点或禁止项。`durable audit` 只表示已有 owner
record/history/marker/intent/report 的正式落地，不表示新增通用 audit ledger。

| 协议族 | 数量 | Log schema / timing | Metric schema / labels | Trace schema / correlation | Durable audit / report landing | Safety and truth boundary | 当前结论 |
|---|---:|---|---|---|---|---|---|
| Command C01-C16 | 16 | `operation_name`,`operation_family=command`,`phase`,`result_kind`,`error_kind?`,`safe refs?`; reserve/reject/commit/accepted 按真实阶段记录，accepted 只在 UoW commit 后 | `observability_command_*`、idempotency/UoW/repository counters；只用 finite operation/result/error/resource labels | `observability.command` root + UoW/repository child spans；只传播 trusted `trace_ref`，不把 span success 当 accepted | accepted flow 复用 owner history、audit append、marker、outbox snapshot、stored result；ordinary reject/duplicate 不新增 accepted audit | redaction 在 serialization 前；禁止 request body、key/digest、secret、provider response；不反写 source/business truth | `pass_with_affected_open` |
| Query Q01-Q14 | 14 | read entry/load/result/defect；not-visible、stale、rebuilding、missing、consistency defect 都是 typed read surface | `observability_query_*`、freshness/defect counters；无 ref、key、digest、body 标签 | `observability.query` + read child spans；correlation 只用于本次 read，不能生成 durable fact | 无 durable audit、reservation、stored result、history、outbox、gap、refresh、rebuild 或 read-audit | telemetry emitter 也不得同步调用 write façade；严格 no-write | `pass_with_affected_open` |
| Inbound Consumer I01-I09 | 9 | envelope/schema/producer binding/duplicate/accepted/ack；payload parse 前只记安全 header 分类 | inbound/schema/delivery/idempotency counters；producer/source 使用 finite family，不用 event/subject ref | `observability.consumer`；仅传播 incoming trusted trace/correlation，不能从 occurred time 推导 source truth | accepted local receipt/snapshot/projection/marker/history、optional local outbox；redelivery 只 replay 原 surface | forbidden body 只记 detection kind/issue ref；不把 upstream truth 或 ack 成功升级为本仓 truth | `pass_with_affected_open` |
| Outbound Event E01-E12 | 12 | snapshot append/preflight/publish/probe/finalize；provider reported success 不是 Published，local finalize 才是 | `observability_outbox_*`、event/effect phase/result；不使用 route/topic/binding/token/payload digest label | `observability.outbox.publish`；使用 snapshot 中 trusted correlation，不能从 current truth 重建或改写 span 成功 | accepted UoW 的 immutable payload snapshot + outbox state；J01 report 复用 existing outbox/report landing，不建 second ledger | redaction 已在 typed encoder 前完成；external Unknown 先 probe；不反写 downstream/business truth | `pass_with_affected_open` |
| Operations Job J01-J09 | 9 | start/replay/claim/item/finalize/probe/terminal；report 与 job execution ref 只作本仓技术 identity | job/claim/item/finalize/handoff/export metrics；labels 只用 finite operation/item/result/phase | `observability.job` + `job.item`；claim/fence/token 不进入 span attributes，trace 不证明 completion | immutable plan/config snapshot、claim/fence、item outcome、native history、intent、receipt、Job report/result；handoff/export 只表达 local projection | report handoff 的 Prepared/Delivered 是 transport fact；不生成 verdict、signoff、真实 run_id/evidence alias | `pass_with_affected_open` |
| **Total** | **60** | **所有入口都有 phase/result/error 的结构化位置，accepted timing 与 no-write timing 已固定** | **finite low-cardinality labels；无敏感或高基数材料** | **五类 flow 都有 correlation 传播/终止语义，不以 trace 推导业务 truth** | **仅复用既有 native owner；Query 无 durable effect** | **redaction-first、body-free、no truth writeback、no self-recursion** | **`60/60 recorded_with_affected_open`；`0/60` 无条件完成** |

统一 schema 约束：

1. 序列化前先完成字段 allowlist、forbidden-material 检查和 redaction；禁止用 hash、截断、base64、debug
   字符串或异常 display 逃逸 raw body、secret、endpoint、topic、provider response 或 evidence body。
2. `trace_ref`、correlation id、causation ref 都是 opaque 关联材料。只有已提交 owner record 允许携带其既有字段；
   telemetry correlation 不能推导 actor、source version、业务状态、evidence authenticity 或 acceptance。
3. Evidence linkage 只能引用已提交的 body-free `EvidenceLinkage`、`EvidenceIndexInput`、digest summary 和
   boundary ref；log/metric/span/sink receipt 不自动升级为 evidence，也不拥有 evidence body。
4. Retention telemetry 只能报告既有 `RetentionChangeRecord`、protection state 或 report ref；backend telemetry
   retention 不创建、释放或修改 `RetentionMarker`，也不授权 source cleanup。
5. Report handoff 只能引用本地 handoff lifecycle、intent、preparation/delivery receipt 和 Job report；
   `Prepared` / `Delivered` 不等于 final verdict、signoff、real run id 或 evidence alias。
6. Query、telemetry sink、redaction failure 和 recursion guard 均不得调用本仓 Command、Consumer、Job 或
   repair façade；sink failure 只产生 non-recursive suppression/failure counter，不回滚业务 UoW。

### 17.2 16 Command coverage audit

| Command group | Included operations | Audit landing |
|---|---|---|
| intake / safety | `SubmitObservationMaterial`,`RecordSafetyDisposition` | `IntakeDecisionRecord` |
| correlation / signal | `BindCorrelationContext`,`RecordSafeSignal` | `CorrelationLinkRecord` |
| audit / evidence | `AppendAuditProjection`,`LinkBodyFreeEvidence` | `AuditAppendRecord` |
| handoff / authenticity | `PrepareReportHandoff`,`EvaluateAuthenticityHint` | `HandoffLifecycleRecord` |
| retention / protection | `SetRetentionMarker`,`ProtectActiveReference` | `RetentionChangeRecord` |
| replay / no-write / gap | `DefineReplayScope`,`RecordNoWriteViolation`,`RecordGapState` | `ReplayExecutionRecord`,`NoWriteViolationRecord`,`GapTransitionRecord` |
| external export | `PrepareExternalAuditExport` | `PeripheralDeliveryRecord` |
| reference | `RegisterReferenceSnapshot`,`UpdateReferenceSnapshotState` | `ReferenceRefreshRecord` |

### 17.3 9 Consumer coverage audit

| Consumer | Local durable landing |
|---|---|
| `ConsumeBusObservationMaterial` | receipt / safety / intake decision / optional gap + outbox |
| `ConsumeSourceAuditMaterial` | `AuditProjection` + `AuditAppendRecord` + optional gap / outbox |
| `ConsumeIdentityObservationContext` | reference snapshot / refresh record / gap |
| `ConsumeGovernanceAuditContext` | boundary snapshot / audit or reference native record / gap |
| `ConsumeArtifactEvidenceContext` | evidence linkage input / audit or reference native record / gap |
| `ConsumeRuntimeSignalSummary` | `SafeSignal` / correlation native record / reference snapshot |
| `ConsumeSandboxSignalSummary` | safety / signal / intake / correlation native record |
| `ConsumeArchiveHandoffFeedback` | handoff lifecycle / receipt native record |
| `ConsumeReportConsumerFeedback` | peripheral delivery / receipt native record |

### 17.4 9 Job coverage audit

| Job | Native audit / report landing |
|---|---|
| `PublishObservationOutbox` | outbox publication state + item outcome + Job report |
| `RebuildObservationReadModels` | projection maintenance record / progress / report |
| `RebuildSignalRollups` | rollup maintenance state / report |
| `RefreshReferenceSnapshots` | reference refresh record / report |
| `ScanObservationGaps` | gap scan / transition record / report |
| `CoordinateObservationReplay` | replay execution / violation / gap native record / report |
| `PrepareReportHandoffDelivery` | handoff lifecycle / intent / receipt / report |
| `PrepareExternalAuditExport`（public Job；internal operation为`PrepareExternalAuditExportDelivery`） | peripheral delivery record / intent / receipt / report |
| `RebuildPeripheralViews` | projection maintenance record / progress / report |

### 17.5 12 Outbound Event coverage audit

所有行使用同一条 accepted snapshot -> publish / probe -> local finalize 观测模板。表中的 owner landing 是outbox snapshot来源,不是新增audit event。

| Outbound Event | Committed owner landing | Runtime observation classification |
|---|---|---|
| `ObservationReceiptChanged` | saved `ObservationReceipt` / intake decision | `change_family=intake` |
| `SafetyDispositionChanged` | saved `SafetyDisposition` / intake decision | `change_family=safety` |
| `SafeSignalRecorded` | saved `SafeSignal` / correlation record | `change_family=signal` |
| `AuditProjectionAppended` | saved `AuditProjection` / audit append record | `change_family=audit` |
| `EvidenceLinkageChanged` | saved `EvidenceLinkage` / audit append record | `change_family=evidence` |
| `ReportHandoffChanged` | saved handoff / authenticity / lifecycle record | `change_family=handoff` |
| `RetentionMarkerChanged` | saved retention / protection / change record | `change_family=retention` |
| `NoWriteViolationRecorded` | saved violation / violation record | `change_family=no_write` |
| `GapStateChanged` | saved gap / transition record | `change_family=gap` |
| `ReferenceSnapshotChanged` | saved reference snapshot / refresh record | `change_family=reference` |
| `DerivedProjectionChanged` | committed derived view / maintenance record | `change_family=derived` |
| `PeripheralDeliveryChanged` | saved peripheral delivery / delivery record | `change_family=peripheral` |

每个event的metric label `event_name`使用上表canonical finite name。Transport topic、route、effect binding ref、payload digest和outbox ref均不得成为label。

### 17.6 14 Query coverage audit

| Query group | Included operations | Runtime telemetry | Durable effect |
|---|---|---|---|
| intake | `GetObservationReceipt`,`GetIntakeStatus` | query result / surface / duration | none |
| signal | `GetSafeSignal`,`GetSignalRollup` | query result / freshness / duration | none |
| audit / evidence | `GetAuditTimeline`,`GetEvidenceIndexInput` | visibility / empty / gap count / duration | none |
| handoff / retention | `GetReportHandoff`,`GetRetentionProtection` | readiness / state / visibility / duration | none |
| read model / diagnostic | `GetObservationReadModel`,`GetDiagnosticView` | freshness / rebuilding / defect / duration | none |
| gap / peripheral | `GetGapStatus`,`GetPeripheralExportView` | gap / degraded / availability / duration | none |
| reference / progress | `GetReferenceSnapshotView`,`GetRebuildProgress` | resolution / progress / consistency / duration | none |

全部14个Query共享严格no-write门禁。即使读取not-visible、stale、rebuilding、missing或consistency defect,也不得append `ReadAccessRecord`、创建gap、刷新reference、mark projection、保存stored result或调用telemetry sink以外的写边界。

## 18. 前序闭环与 Step 16 承接

### 18.1 Cross-step closure audit

| 上游 Step | 本 Step 闭合结论 | 状态 |
|---|---|---|
| Step 06 object | 只使用现有 operation context、owner state、history、outbox、plan、intent、report和safe refs；旧schema对象未恢复 | `pass_with_affected_open` |
| Step 07 ports / adapters | 埋点位于现有boundary,不新增business port；domain不依赖telemetry backend；telemetry sink不成为业务port | `pass_with_affected_open` |
| Step 08 protocol | 16 / 14 / 9 / 12 / 9协议family全部有观测切口；raw DTO body禁止输出；I05 schema/binding affected保持开放 | `pass_with_affected_open` |
| Step 09 flow | accepted / Query / Consumer / Job / publication顺序与打点timing一致；逐协议 flow affected 仍由指定 owner 承接 | `pass_with_affected_open` |
| Step 10 state | metric / log / span结果只使用finite state,不绕过terminal transition；27 state owner affected 不被 telemetry 代替 | `pass_with_affected_open` |
| Step 11 persistence | native durable audit与accepted UoW原子；runtime telemetry out-of-band；Query no-write；UoW affected 保留 | `pass_with_affected_open` |
| Step 12 error | rejected、indeterminate、probe、manual和forbidden body有安全观测口径；recovery class owner affected 保留 | `pass_with_affected_open` |
| Step 13 concurrency | duplicate / in-flight / fence-loss不重放audit / outbox / report；claim/token 不泄露；external phase affected 保留 | `pass_with_affected_open` |
| Step 14 config / binding | config / adapter / phase只输出safe ref与finite family,endpoint / secret / provider body禁止；old-binding affected 保留 | `pass_with_affected_open` |

本 Step 未发现新的 definition/use 断裂；已有 inherited affected 不因 telemetry 表格而关闭，也不被改写为 blocker none。

### 18.2 Step 16 测试切口 handoff

Step 16 应将以下主题转成最小验证入口,但本 Step 不分配测试 ID、不声称测试已执行:

| Topic | 必须验证 | 禁止替代 |
|---|---|---|
| log coverage | entry / application / repository / worker / job / adapter / runtime critical branch均有固定字段 | free-text日志人工目测 |
| metric labels | 只有finite operation / result / error / state / adapter / phase | refs、IDs、keys、digests、free text |
| accepted timing | accepted / published / delivered只在commit / finalize后emit | 在provider return或staged write后提前计数 |
| Query no-write | 可有log / metric / span,无任何durable write | 用mock不调用repository替代完整side-effect断言 |
| duplicate replay | 只读stored result / receipt / report,无history / outbox / item重复 | 只比较response相同 |
| indeterminate | commit / external unknown输出indeterminate并要求probe | 将timeout直接归failed |
| durable audit atomicity | native history失败回滚owner mutation；runtime sink失败不回滚 | 用日志替代history |
| redaction negative scan | raw body / secret / endpoint / topic / provider response / digest不进入四类channel | 只检查secret关键词 |
| self-recursion | telemetry sink不能调用own façade,nested emission被suppressed | 依赖部署约定但无代码guard |
| retention separation | backend telemetry retention不创建 / 修改`RetentionMarker` | 把sink retention当本仓marker |
| report truth boundary | Delivered不等于verdict / signoff / real evidence | 以adapter success断言验收通过 |
| fake parity | fake / controlled / disabled只输出formal category | 读取private fixture map作为evidence |

## 19. 正式文档回填草稿

正式 `03-详细设计.md` 第 14 章在 Step 19 装配时建议采用以下结构:

```md
## 14. 可观测性与审计埋点契约

### 14.1 信号分层与真相边界
### 14.2 公共字段安全与日志级别
### 14.3 日志埋点表
### 14.4 指标埋点表与标签约束
### 14.5 Trace / span 切口与传播规则
### 14.6 Durable 审计事件表与写入顺序
### 14.7 Redaction / forbidden material
### 14.8 Self-observation recursion guard
### 14.9 Correlation / evidence / retention / handoff / no-write 边界
### 14.10 Flow coverage 与后续测试承接
```

正式章节必须保留以下结论,不能压缩成“接入日志、指标和trace”:

1. Layer A runtime telemetry与Layer B/C durable truth彻底分离。
2. accepted durable audit复用native history / outbox / marker / intent / report,不新增generic audit ledger。
3. Query只允许out-of-band log / metric / span,不得写read audit或repair。
4. metrics只允许finite low-cardinality labels。
5. trace context只关联,不回填或推导业务truth。
6. redaction在serialization前执行,forbidden material无hash逃逸。
7. telemetry sink不得回灌own Command / Consumer / Job façade。
8. telemetry backend retention不等于`RetentionMarker`。
9. report handoff不生成real run id、evidence alias、verdict或signoff。

## 20. 待确认事项与 blocker

| 事项 | 当前处理 | 是否阻塞 Step 15 |
|---|---|---|
| runtime telemetry facade具体crate / backend | 后移implementation technology / config；当前固定行为和字段契约 | 否 |
| metric bucket、sampling、retention、threshold、dashboard | 后移`04`、测试 / 运维材料 | 否 |
| 是否未来允许本仓telemetry异步回采 | 当前明确禁止；若需要必须重开协议 / config / topology设计 | 否 |
| durable read-access audit | 当前phase-reserved；没有独立accepted flow前Query no-write | 否 |
| target implementation repo当前未发现 | Step 17 / `07` implementation precondition | 否 |
| 上游 blocker | 未发现新的上游 blocker；inherited upstream/internal affected 仍开放 | 否 |

## 21. 最终自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否回答SOP五个问题 | `pass_with_affected_open` | §5逐项回答，inherited owner/phase affected 继续开放 |
| 是否输出日志埋点表 | `pass_with_affected_open` | §10按entry / flow / infra展开 |
| 是否输出指标埋点表 | `pass_with_affected_open` | §11含名称、类型、位置、标签和禁止标签 |
| 是否输出Trace切口 | `pass_with_affected_open` | §12含context、span、attribute和end semantics |
| 是否输出审计事件表 | `pass_with_affected_open` | §13按Command / Consumer / Job映射existing landing |
| 是否区分runtime telemetry与durable audit | `pass_with_affected_open` | §7 / §13.4 / §17.1.1 |
| 是否保持Query no-write | `pass_with_affected_open` | §10.3 / §13.5 / §16.5 / §17.1.1 |
| 是否保持duplicate no-rerun | `pass_with_affected_open` | §10.2 / §13.5 / §18.2 |
| 是否处理redaction / forbidden body | `pass_with_affected_open` | §9 / §14 / §17.1.1 |
| 是否处理correlation / evidence linkage | `pass_with_affected_open` | §12 / §16.1~16.2 / §17.1.1 |
| 是否处理retention marker / report handoff | `pass_with_affected_open` | §16.3~16.4 / §17.1.1 |
| 是否处理self-observation recursion | `pass_with_affected_open` | §15 / §17.1.1 |
| 是否避免新增第二audit ledger | `pass_with_affected_open` | §13只复用既有载体；affected 不影响 owner boundary |
| 是否写入阈值、SLO、dashboard、采样率或产品 | pass | 明确未写 |
| 是否伪造commit、run id、evidence alias、测试结果或签署 | pass | 未伪造 |
| 是否修改正式`03-详细设计.md` | pass | 未修改,留Step 19 |
| 是否发现新的上游blocker | `pass` | 未发现；inherited affected 仍开放 |

## 22. 门禁

| gate | 状态 | 说明 |
|---|---|---|
| Step 15输入门禁 | `pass_with_affected_open` | SOP、书写规范、架构横切、Step 06~14及参考粒度已读取；上游 affected 仍显式保留 |
| Step 15内容门禁 | `pass_with_affected_open` | log / metric / trace / audit、redaction、recursion、retention、handoff和no-write已形成可落码闭环 |
| 上游blocker | 未发现新的上游 blocker | inherited upstream/internal affected 不被隐去 |
| 正式文档门禁 | blocked_until_step_19 | 本Step不修改正式`03-详细设计.md` |
| Step切换门禁 | `blocked_until_user_confirmation_for_step_16` | M2 已完成；当前必须停审，不得自动读取或进入 Step 16 |

当前恢复点:

```text
03-详细设计 / Step 15 可观测性与审计埋点契约
gate_status = Step15_M2_completed_waiting_before_Step16
next_allowed_action = stop_before_step_16;await_user_confirmation
```
