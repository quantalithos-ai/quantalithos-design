# Step 15. 可观测性与审计埋点契约

> 对应正式文档章节: `03-详细设计.md` 第 14 章 可观测性与审计埋点契约
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 当前状态: Step 15.5 cross-step closure / Step 16 handoff / 回填草稿 已写入;Step 15 已完成,等待用户审核后进入 Step 16 test cuts
> 本文件性质: 详细设计 Step 15 中间产物,不是正式 `03-详细设计.md`

---

## 1. 15.0 framework / input boundary / batch plan

本批只建立 Step 15 的执行框架、输入边界、SOP 问题初答、材料诊断、设计原则、分批计划和 Step 14 handoff 承接。日志埋点表、指标埋点表、审计事件表、trace/span 切口和 redaction 规则在后续小批次逐步写入。

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 15 可观测性与审计埋点契约 |
| 当前批次 | 15.5 cross-step closure / Step 16 handoff / 回填草稿 |
| 当前结论 | Step 15 已完成;日志、指标、业务审计、runtime/config/adapter/fake redaction 和 Step 16 handoff 均已闭合,当前无未解决 blocker |
| 本批边界 | 不新增 object、port、state、error、DTO、stored replay material、metric backend、alert threshold、SLO、dashboard、runbook 或测试 ID |
| 输出文件 | `projects/L1-identity/design-calibration/03_ddd_step_15_observability_audit.md` |
| 下一步 | Step 16 test cuts |

### 1.2 Step 15 总体目标

Step 15 的目标是让实现者知道:

- 哪些 API、worker、jobs、application service、repository、adapter、runtime builder 和 fake/controlled fixture 路径必须记录结构化日志。
- 哪些关键路径需要 counter、histogram 或 gauge,以及指标标签只能使用哪些低基数字段。
- 哪些 accepted identity truth change、consumer/callback marker、outbox publication、handoff delivery、projection/reference maintenance、reconciliation report、job report 和 config/runtime failure 必须形成业务 trace / audit / report / marker。
- runtime log / metric、`IdentityTraceRecord`、`AuditTrail`、outbox record、handoff intent、job report、stored result 和 external audit sink 的边界。
- 哪些 rejected / failed / unsupported / degraded / duplicate replay path 只能写 runtime log / metric / safe issue marker,不得伪造成 accepted trace。
- 哪些 raw body、secret、external response、fixture private map、diagnostic dump 和 package material 永远不得进入日志、指标、审计、trace、report、outbox、handoff 或 stored replay。

本 Step 不定义告警阈值、SLO、dashboard、采样率、日志保留周期、观测后端产品、pager 流程、人工恢复 runbook、部署 endpoint、broker topic raw string、secret provider 或测试用例 ID。这些分别由配置设计、运维材料、测试方案或实施计划承接。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定 `IdentityTraceRecord`、`AuditTrail`、`IdentityOutboxRecord`、`TraceHandoffIntent`、`IdentityJobRunReport`、runtime/adapter/entry state 和 body-free object 边界 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 trace/audit repositories、outbox、handoff、projection、reference、result/idempotency、job report、UoW、Clock/IdGenerator、resolver/publisher/handoff adapter 和 entry facade |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 6 个 Command、14 个 Query、5 个 Inbound Event / Callback、10 个 Outbound Event、6 个 Operations Job 的 metadata、receipt、report、surface 和 safe issue refs |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 command accepted transaction、query no-write、consumer/callback accepted write、outbox publish、maintenance job、handoff/job flow 的顺序和副作用边界 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定 lifecycle、source/reference、read surface、projection/reference/report、outbox/handoff、idempotency/job、runtime/adapter/entry 状态和 terminal guard |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 same-UoW、append-only、stored replay、optimistic version、cursor、payload marker、reference bundle 和 fake/durable parity |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定 rejected、not-visible、degraded、unsupported、delayed、retryable、terminal、manual recovery 和 forbidden body 口径 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 duplicate replay no-rerun、in-flight no second writer、stored result/report/receipt replay、retry guard 和 digest body-free 规则 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 config/runtime/adapter/entry/external resolver/outbox/handoff/audit/fake 的 observability handoff 和 forbidden material |
| `projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md` | 参考材料 | 只参考 Step 15 粒度、表结构和分层方式,不复制 governance 业务对象 |

### 1.4 SOP 问题初答

| SOP 问题 | Step 15 初答 |
|---|---|
| 哪些处理流必须记录审计? | 所有 accepted identity truth change 必须追加 `IdentityTraceRecord`、更新或创建 `AuditTrail`、同事务 append `IdentityOutboxRecord`、mark projection stale 并保存 stored result。Consumer/callback accepted path 只在 Step 9 要求时写 marker trace、receipt、reference/projection marker 或 outbox。Operations job 只对 projection/reference/report/outbox/handoff/job report 写 operations audit/report,不得写 core truth repair。Query 不写业务 audit。 |
| 哪些错误分支必须记录日志? | Entry validation reject、dispatch target missing/disabled、protocol/domain rejected、not visible、degraded/stale/missing、version/unique conflict、idempotency duplicate/conflict/in-flight/result missing、unsupported event version、consumer delayed/quarantined、publisher retryable/permanent failed、handoff failed/cancelled/unsupported、projection rebuild failed、reference refresh failed、reconciliation failed、UoW commit unknown/rollback failed、config validation rejected、runtime assembly failed 和 adapter unavailable 都必须有结构化日志。 |
| 哪些关键路径需要指标? | Command、Query、Consumer/Callback、Outbox Publisher、Handoff Delivery、Operations Job、repository/UoW、idempotency/stored replay、external resolver/reference refresh、projection freshness/rebuild、reconciliation、config validation、runtime assembly 和 adapter availability 需要计数、耗时或状态类指标。 |
| 日志、指标、审计字段分别记录什么? | 日志记录 trace context ref、entry/request/event/job refs、operation kind、actor/consumer refs、subject/source refs、state/disposition、safe issue refs、diagnostic refs、duration 和 counts。指标只记录低基数 kind/state/result/error/adapter/source family。审计/trace/report 只记录正式 refs、from/to state、cursor、attempt/receipt/issue refs、actor/time 和 safe material marker。 |
| 哪些监控和告警细节应留给运维手册? | alert threshold、SLO、dashboard、metric backend、log retention、sampling、pager、manual runbook、endpoint health threshold、secret redaction implementation 和 deployment-specific route/topic/path 留给运维、配置设计或实施计划。本 Step 只定义代码必须暴露的埋点切口和字段边界。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 当前问题 | Step 15 处理 |
|---|---|---|
| Step 6 已定义 trace/audit/outbox/handoff/report 对象 | 仍需说明 runtime log / metric 与业务 trace/audit 的边界 | 后续批次固定两层边界:日志/指标不替代业务审计,业务审计不保存 raw log |
| Step 7 已有 repository/adapter/facade port | repository、UoW、resolver、publisher、handoff adapter 的日志和指标字段还未统一 | 15.1/15.2 给出打点位置和字段/标签规则 |
| Step 8 protocol surface 已闭合 | entry metadata、receipt、job report、query surface 的观测口径分散 | 按 Command/Query/Consumer/Callback/Event/Job family 汇总 |
| Step 9 flow 固定事务顺序 | accepted/rejected/duplicate/failed 的可观测性容易混写 | 后续表格按 flow family 区分 log、metric、audit/trace 和禁止副作用 |
| Step 12/13 固定错误和 duplicate replay | duplicate replay 若再次写 trace/audit/outbox 会破坏真相源 | 固定 duplicate 只写 replay log/metric,业务 trace/outbox 不重放 |
| Step 14 固定 config/runtime/fake 边界 | config issue、adapter availability、fake controlled outcome 需要可定位但不能泄漏 raw config/body | 15.4 专门写 runtime/config/adapter observability 和 redaction |
| 运维观测需求容易扩大 | 可能把 alert threshold、SLO、dashboard、runbook 写进详细设计 | 本 Step 明确只写 code instrumentation cuts |

### 1.6 设计原则

| 原则 | 正式口径 |
|---|---|
| observe refs and kinds, not bodies | 只记录 safe refs、state kind、issue refs、outcome kind、counts、duration 和 redacted digest |
| logs are not business audit | runtime log 不能替代 accepted `IdentityTraceRecord`、`AuditTrail`、outbox、handoff marker 或 job report |
| business audit is not observability ledger | `IdentityTraceRecord` / `AuditTrail` 不保存 raw log、span body、debug dump、adapter response 或 external observability body |
| query no-write | Query 可写日志和指标,但不得 append trace/audit、reserve idempotency、repair projection/reference 或保存 stored result |
| duplicate no-rerun | duplicate replay 只读 stored result/receipt/report,只记录 replay log/metric,不新增业务 trace/outbox/report item |
| failed path is not accepted trace | rejected、unsupported、not-visible、degraded、adapter failed 不能伪造成 accepted truth trace |
| metric labels are low-cardinality | 指标 label 只用 finite kind/state/result/error category/adapter kind/source family,高基数 ref 进入日志或审计 refs |
| entry surface remains technical | entry valid、dispatch success、runtime assembled、adapter available 不等于 application accepted、published 或 delivered |
| fake/durable parity | fake/controlled/disabled 运行时必须暴露同一正式打点类别,不得输出 private map 或默认 success |
| missing instrumentation schema is a blocker | 若实现需要新 log field enum、metric label enum、audit event DTO、port 或 stored material,必须回 Step 6~14 闭口 |

### 1.7 Step 15 分批计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 15.0 | framework / input boundary / batch plan | [x] 已写入 |
| 15.1 | log instrumentation cuts | [x] 已写入 |
| 15.2 | metric instrumentation cuts | [x] 已写入 |
| 15.3 | business trace / audit / report / marker event cuts | [x] 已写入 |
| 15.4 | runtime / config / adapter / fake observability and redaction boundary | [x] 已写入 |
| 15.5 | cross-step closure / Step 16 handoff / 回填草稿 | [x] 已写入 |

### 1.8 Step 15 写入红线

| 红线 | 说明 |
|---|---|
| 不新增协议或存储材料 | 不新增 public DTO、stored replay body、audit event body、report payload 或 repository surface |
| 不定义运维策略 | 不写 threshold、SLO、dashboard、runbook、retention、sampling、pager 或 backend product |
| 不定义测试 ID | 测试切口和 ID 留 Step 16 |
| 不保存 raw body / secret | request/event/job body、RoleDefinition body、ProjectMember truth、memory text、archive package、artifact body、governance policy body、adapter response、raw config/env、secret 和 endpoint credential 禁止出现 |
| 不把指标做成定位真相源 | metric label 禁止高基数 ref、trace id、request id、actor id、subject id、idempotency key、topic raw string、free text |
| 不让 query 写业务审计 | read log/metric 不能变成 trace/audit append 或 projection/reference repair |
| 不让失败伪成功 | disabled/unavailable/fake/adapter failed 不得记录为 accepted/published/delivered |
| 不绕过正式 mapper | trace/audit/outbox/handoff/marker subject 只能来自 Step 7 mapper,不得从字符串或 route 推导 |

### 1.9 Step 14 handoff 承接表

| Step 14 handoff topic | Step 15 承接方式 | 不可记录材料 |
|---|---|---|
| config load / validate | 15.4 写 config validation log/metric/audit cut,字段限 config evidence ref、profile ref、issue ref、source kind、redacted digest | raw config body、env raw value、secret、endpoint credential |
| runtime assembly | 15.4 写 assembly state transition and readiness failure cut | adapter raw health body、endpoint URL as label、secret |
| adapter availability | 15.4 写 disabled/degraded/unavailable/available log and metric cut | raw health response、credential、external body |
| entry dispatch guard | 15.1 写 pre-dispatch failure、unknown route/binding/job、target disabled log cut | raw request/event/job body、page payload、secret |
| external resolver calls | 15.1/15.2 写 resolver success/failure log and metric cut | RoleDefinition body、ProjectMember truth、memory text、artifact body、governance policy body |
| outbox publish | 15.1/15.2/15.3 写 publish attempt outcome、retryable/terminal、publication audit cut | broker topic raw string、payload body、adapter response body |
| handoff delivery | 15.1/15.2/15.3 写 target resolution、delivery attempt、receipt/failure outcome cut | bucket/path/raw endpoint、archive package、receipt body |
| audit compensation | 15.3/15.4 写 audit sink unavailable and compensation marker cut | raw log/debug body、secret、external response body |
| job-run-start config | 15.1/15.2 写 job config frozen/rejected and run input/output ref cuts | raw replay input、historical body、secret path material |
| fake/controlled fixture | 15.4 写 fixture load and controlled outcome observability cut | fixture raw body、private fake map |
| cross-repo dependency guard | 15.4 写 disallowed compile dependency guard log/audit cut | local filesystem secret、source code body |

### 1.10 15.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 14 handoff | 通过 | §1.9 已逐项承接 |
| 是否限定 Step 15 范围 | 通过 | 只写 observability / audit cut points,不写运维或测试实现 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只写计划和红线 |
| 是否保持 1:1 真相源 | 通过 | 输入均回指 Step 6~14、SOP 和 governance Step 15 粒度参考 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 15.1 | log instrumentation cuts |

---

## 2. 15.1 log instrumentation cuts

本批定义 L1-identity 的结构化日志切口。日志只用于运行定位、审计线索串联和安全诊断,不能替代 `IdentityTraceRecord`、`AuditTrail`、outbox、handoff marker、stored result、consumer receipt 或 job report。日志字段只能使用 safe refs、kind、state、issue refs、diagnostic refs、counts、duration 和 redacted digest。

本批不定义 metric 名称、audit event 名称、alert threshold、SLO、dashboard、runbook、测试 ID 或具体日志后端。

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 15.1 log instrumentation cuts |
| 当前结论 | 已覆盖 API、worker、jobs、application、repository/UoW、resolver、publisher、handoff、maintenance、runtime/config、adapter/fake 的日志切口 |
| 本批边界 | 只定义日志位置、级别、字段和 forbidden material;不写 metric table、audit event table、trace/span table、测试 ID |
| 关闭事项 | DDD-S15-OPEN-001 |
| 下一批 | 15.2 metric instrumentation cuts |

### 2.2 日志字段词表

| 字段 | 允许来源 | 用途 | 禁止替代 / 禁止内容 |
|---|---|---|---|
| `trace_context_ref` | Step 8 metadata / envelope / job request | 串联 entry、application、adapter 和 job log | 不用随机 log id 替代缺失 protocol trace context |
| `operation_name` | `IdentityOperationContext.operation_name` / protocol name | 标识 command/query/consumer/callback/job | 不用 route path 或 handler 函数名作为唯一真相源 |
| `operation_channel` | `IdentityOperationContext.channel` | 区分 API command、query、inbound event、handoff callback、job | 不从 operation name 字符串猜 channel |
| `request_or_entry_ref` | API/worker/job entry marker | 定位入口请求 | 不记录 raw request/event/job body |
| `actor_ref` / `consumer_ref` | metadata / query request / worker binding | 定位调用方或读方 | 不记录 credential、token、auth header |
| `member_ref` / `subject_ref` | typed truth ref or Step 7 subject mapper | 定位 body-free subject | 不解析 raw member id 生成 subject |
| `source_ref` / `reference_ref` / `basis_ref` | resolver input/output typed refs | 定位外部来源 | 不记录 RoleDefinition、ProjectMember、memory、artifact、governance body |
| `state_kind` / `disposition` / `outcome_kind` | Step 10 state / Step 8 public surface / Step 7 adapter outcome | 说明结果分类 | 不把 adapter success 直接写成 accepted/published/delivered |
| `issue_ref` / `diagnostic_ref` | Step 6/8/12 safe issue marker | 关联安全诊断 | 不记录 stack trace、HTTP body、SQL、adapter raw response |
| `idempotency_key_hash` / `dedupe_key_hash` | one-way redacted digest | 排查 duplicate / conflict | 不记录 caller supplied raw key |
| `stored_result_ref` / `receipt_ref` / `report_ref` | Step 8/13 replay surface | 证明 replay 来源 | 不从 current truth 重构结果 |
| `duration_ms` / `count` | handler/application/job boundary 计时和计数 | 性能定位与批处理规模 | domain object 不读取 clock 或日志后端 |

### 2.3 日志级别规则

| 级别 | 使用场景 | 不使用场景 |
|---|---|---|
| `debug` | 高频成功细节,如 resolver success、repository read completed、idempotency first-run reserved、projection target expanded | 不用于唯一证明 accepted truth 或 delivered receipt |
| `info` | command accepted、query completed、duplicate replay、consumer accepted、job summary、outbox published、handoff delivered、runtime assembled | 不记录 raw body 或 secret;不把 entry dispatched 记为 application accepted |
| `warn` | validation/domain rejected、not-visible、degraded、stale-visible、duplicate conflict、in-flight、unsupported version、delayed/quarantined、retryable adapter failure、projection/reference item failed | 不用于 commit unknown、rollback failed、forbidden body persistence attempt |
| `error` | repository unavailable、UoW commit unknown、rollback failed、stored replay missing/wrong-kind、forbidden body persistence attempt、terminal outbox/handoff failure、config validation failed、runtime assembly failed | 不记录 stack trace / adapter raw response body;只记录 safe diagnostic ref |

### 2.4 Entry and application log cuts

| 位置 | 级别 | 字段 | 目的 |
|---|---|---|---|
| API command entry received | `info` | `trace_context_ref`, `request_or_entry_ref`, `operation_name`, `actor_ref`, `idempotency_key_hash` | 记录写入口和幂等指纹 |
| API command validation rejected | `warn` | `trace_context_ref`, `request_or_entry_ref`, `operation_name`, `issue_ref`, `diagnostic_ref` | 定位 metadata、route、idempotency、body-free validation failure |
| API command dispatch target missing/disabled | `warn` | `trace_context_ref`, `request_or_entry_ref`, `operation_name`, `dispatch_target_ref`, `state_kind`, `issue_ref` | 区分 entry failure 与 application rejected |
| Command idempotency reserved | `debug` | `trace_context_ref`, `operation_name`, `operation_channel`, `idempotency_key_hash`, `state_kind` | 排查 first-run reservation |
| Command duplicate replay | `info` | `trace_context_ref`, `operation_name`, `idempotency_key_hash`, `stored_result_ref`, `disposition` | 证明读取 stored result,没有重跑 mutation |
| Command idempotency conflict / in-flight | `warn` | `trace_context_ref`, `operation_name`, `idempotency_key_hash`, `state_kind`, `issue_ref` | 区分 same key different digest 和 in-flight no second writer |
| Command accepted | `info` | `trace_context_ref`, `operation_name`, `actor_ref`, `member_ref`, `subject_ref`, `stored_result_ref`, `duration_ms`, `count` | 串联 accepted result、trace/audit/outbox/stale refs |
| Command domain/application rejected | `warn` | `trace_context_ref`, `operation_name`, `actor_ref`, `subject_ref`, `outcome_kind`, `issue_ref`, `diagnostic_ref` | 定位 policy denied、invalid transition、not found、conflict |
| API query entry received | `debug` | `trace_context_ref`, `request_or_entry_ref`, `operation_name`, `consumer_ref` | 记录读入口 |
| Query completed | `info` | `trace_context_ref`, `operation_name`, `consumer_ref`, `disposition`, `state_kind`, `duration_ms`, `count` | 说明 visible / empty / stale-visible / degraded / not-visible surface |
| Query not visible | `info` | `trace_context_ref`, `operation_name`, `consumer_ref`, `subject_ref`, `disposition`, `issue_ref` | 证明 body-free not-visible,不泄漏存在性细节之外的信息 |
| Query degraded / missing / stale-visible | `warn` | `trace_context_ref`, `operation_name`, `consumer_ref`, `subject_ref`, `state_kind`, `issue_ref` | 解释 projection/reference/report read 降级 |

### 2.5 Worker / consumer / callback log cuts

| 位置 | 级别 | 字段 | 目的 |
|---|---|---|---|
| Worker envelope received | `info` | `trace_context_ref`, `request_or_entry_ref`, `operation_name`, `source_ref`, `dedupe_key_hash` | 记录 inbound event / callback 入口 |
| Worker envelope validation rejected | `warn` | `trace_context_ref`, `request_or_entry_ref`, `operation_name`, `issue_ref`, `diagnostic_ref` | 定位 malformed envelope、missing dedupe key、body boundary 违规 |
| Unsupported event version | `warn` | `trace_context_ref`, `operation_name`, `source_ref`, `state_kind`, `issue_ref` | 证明未解析 payload、未写 accepted marker |
| Consumer/callback duplicate replay | `info` | `trace_context_ref`, `operation_name`, `dedupe_key_hash`, `stored_result_ref`, `receipt_ref` | 证明 replay stored receipt,没有重写 state |
| Consumer accepted | `info` | `trace_context_ref`, `operation_name`, `source_ref`, `reference_ref`, `receipt_ref`, `stored_result_ref`, `count` | 串联 reference/projection/outbox/receipt 成功 |
| Handoff callback accepted | `info` | `trace_context_ref`, `operation_name`, `handoff_intent_ref`, `attempt_ref`, `receipt_ref`, `state_kind` | 证明 delivered / failed state 来自 formal callback marker |
| Consumer delayed / quarantined / rejected | `warn` | `trace_context_ref`, `operation_name`, `source_ref`, `disposition`, `issue_ref`, `diagnostic_ref` | 定位外部依赖不可用、forbidden body、target missing |

### 2.6 Repository / UoW / stored replay log cuts

| 位置 | 级别 | 字段 | 目的 |
|---|---|---|---|
| Repository version conflict | `warn` | `trace_context_ref`, `operation_name`, `repository_kind`, `subject_ref`, `state_kind`, `issue_ref` | 定位 optimistic conflict |
| Repository unique conflict | `warn` | `trace_context_ref`, `operation_name`, `repository_kind`, `subject_ref`, `issue_ref` | 区分 formal unique conflict 与 duplicate replay |
| Repository unavailable | `error` | `trace_context_ref`, `operation_name`, `repository_kind`, `issue_ref`, `diagnostic_ref` | 定位 durable/fake store 不可用 |
| UoW begin / commit completed | `debug` | `trace_context_ref`, `operation_name`, `operation_channel`, `count` | 串联事务生命周期 |
| UoW commit unknown | `error` | `trace_context_ref`, `operation_name`, `operation_channel`, `idempotency_key_hash`, `diagnostic_ref` | 触发 Step 12/13 commit unknown recovery |
| UoW rollback failed | `error` | `trace_context_ref`, `operation_name`, `operation_channel`, `diagnostic_ref` | 标记人工恢复风险 |
| Stored replay missing / wrong-kind | `error` | `trace_context_ref`, `operation_name`, `idempotency_key_hash`, `stored_result_ref`, `issue_ref` | 防止 duplicate 重跑 mutation/job |

### 2.7 External resolver / reference / adapter log cuts

| 位置 | 级别 | 字段 | 目的 |
|---|---|---|---|
| External resolver called | `debug` | `trace_context_ref`, `operation_name`, `adapter_ref`, `source_ref`, `reference_ref` | 记录 body-free resolver 调用 |
| External resolver success | `debug` | `trace_context_ref`, `operation_name`, `adapter_ref`, `source_ref`, `reference_ref`, `state_kind`, `duration_ms` | 定位 safe summary / reference state 成功 |
| External resolver unavailable / invalid | `warn` | `trace_context_ref`, `operation_name`, `adapter_ref`, `source_ref`, `reference_ref`, `outcome_kind`, `issue_ref` | 区分 unavailable、unrecognized、invalid material |
| Reference refresh item success | `info` | `trace_context_ref`, `operation_name`, `reference_ref`, `state_kind`, `report_ref`, `duration_ms` | 追踪 refresh job item 成功 |
| Reference refresh item failed | `warn` | `trace_context_ref`, `operation_name`, `reference_ref`, `state_kind`, `issue_ref`, `report_ref` | 解释 unresolved/unavailable state 和 job report item |
| Adapter availability checked | `info` / `warn` | `adapter_ref`, `adapter_mode_ref`, `state_kind`, `issue_ref` | 记录 disabled/degraded/unavailable/available |

### 2.8 Outbox / handoff / maintenance job log cuts

| 位置 | 级别 | 字段 | 目的 |
|---|---|---|---|
| Outbox append material saved | `debug` | `trace_context_ref`, `operation_name`, `subject_ref`, `outbox_record_ref`, `state_kind` | 证明 accepted-only outbox material 已保存 |
| Publish job scanned | `info` | `trace_context_ref`, `operation_name`, `job_run_ref`, `topic_key_ref`, `count` | 记录 pending/retryable 扫描范围 |
| Outbox publish success | `info` | `trace_context_ref`, `job_run_ref`, `outbox_record_ref`, `attempt_ref`, `outcome_kind`, `duration_ms` | 证明 Published 只来自 publisher outcome |
| Outbox publish retryable failure | `warn` | `trace_context_ref`, `job_run_ref`, `outbox_record_ref`, `attempt_ref`, `issue_ref`, `outcome_kind` | 记录 retryable failed state |
| Outbox publish terminal failure / skipped | `error` / `warn` | `trace_context_ref`, `job_run_ref`, `outbox_record_ref`, `issue_ref`, `outcome_kind`, `report_ref` | 定位 terminal failure 或 policy skip |
| Prepare handoff accepted | `info` | `trace_context_ref`, `operation_name`, `handoff_intent_ref`, `target_ref`, `scope_ref`, `state_kind` | 证明只创建 pending intent,不执行 delivery |
| Handoff delivery success | `info` | `trace_context_ref`, `job_run_ref`, `handoff_intent_ref`, `attempt_ref`, `receipt_ref`, `state_kind` | 证明 Delivered 带 formal receipt |
| Handoff delivery retryable failure | `warn` | `trace_context_ref`, `job_run_ref`, `handoff_intent_ref`, `attempt_ref`, `issue_ref`, `state_kind` | 记录 retryable handoff failure |
| Handoff delivery terminal failure / cancelled / unsupported | `error` / `warn` | `trace_context_ref`, `job_run_ref`, `handoff_intent_ref`, `issue_ref`, `state_kind`, `report_ref` | 定位 terminal handoff outcome |
| Projection stale marker saved | `info` | `trace_context_ref`, `operation_name`, `projection_ref`, `state_kind`, `count` | 追踪 accepted write 后的 stale marker |
| Projection rebuild item success | `info` | `trace_context_ref`, `job_run_ref`, `projection_ref`, `state_kind`, `report_ref`, `duration_ms` | 追踪 rebuild 成功 |
| Projection rebuild item failed | `warn` | `trace_context_ref`, `job_run_ref`, `projection_ref`, `state_kind`, `issue_ref`, `report_ref` | 解释 query degraded / rebuild failed |
| Reconciliation report saved | `info` | `trace_context_ref`, `job_run_ref`, `report_ref`, `state_kind`, `count` | 记录 report-only finding material |
| Operations job summary | `info` | `trace_context_ref`, `operation_name`, `job_run_ref`, `disposition`, `report_ref`, `count`, `duration_ms` | 汇总 job run,供 duplicate replay 和排查使用 |
| Operations job failed before report | `error` | `trace_context_ref`, `operation_name`, `job_run_ref`, `issue_ref`, `diagnostic_ref` | 区分 entry/pre-report failure 与 stored job report failure |

### 2.9 Runtime / config / fake log cuts

| 位置 | 级别 | 字段 | 目的 |
|---|---|---|---|
| Config source loaded | `info` | `config_source_ref`, `profile_ref`, `state_kind`, `diagnostic_ref` | 记录 config loading surface,不输出 raw config |
| Config validation rejected | `error` | `config_source_ref`, `profile_ref`, `state_kind`, `issue_ref`, `diagnostic_ref` | fail-fast 定位配置红线 |
| Runtime assembly started | `info` | `runtime_assembly_ref`, `profile_ref`, `state_kind` | 记录 runtime builder lifecycle |
| Runtime assembly degraded / failed | `warn` / `error` | `runtime_assembly_ref`, `profile_ref`, `state_kind`, `issue_ref`, `diagnostic_ref` | 区分 wiring degraded / failed,不等于业务 rejected |
| Runtime assembled | `info` | `runtime_assembly_ref`, `profile_ref`, `state_kind`, `count` | 只证明 wiring ready |
| Fake / controlled fixture loaded | `info` | `profile_ref`, `fixture_ref_digest`, `adapter_mode_ref`, `state_kind` | 证明测试 fixture 通过正式 port 装配 |
| Fake / controlled outcome used | `debug` | `adapter_ref`, `adapter_mode_ref`, `outcome_kind`, `issue_ref` | 记录 controlled outcome,不暴露 private fake map |
| Disallowed dependency/config redline detected | `error` | `config_source_ref`, `operation_name`, `issue_ref`, `diagnostic_ref` | 发现跨仓编译依赖、raw body、secret 或 invariant bypass |

### 2.10 错误分支日志优先级

| 错误分支 | 必须记录 | 不得记录 / 不得做 |
|---|---|---|
| Entry pre-dispatch failure | entry ref、operation name、dispatch target ref、issue ref | 不写 stored result、consumer receipt、job report 或 accepted trace |
| Command rejected | operation、actor、subject、outcome kind、issue ref | 不写 accepted truth trace/outbox/stale marker |
| Query not-visible/degraded | query name、consumer、subject/scope、surface disposition | 不写 audit/idempotency/projection repair/reference refresh |
| Duplicate replay | idempotency hash、stored result/receipt/report ref、replay disposition | 不重跑 mutation/job,不追加第二份 business trace/outbox |
| Stored replay missing/wrong-kind | idempotency hash、expected stored kind、issue ref | 不从 current truth 反推结果 |
| Unsupported event version | event source、version state、issue ref | 不解析 payload、不写 accepted marker |
| Adapter unavailable | adapter ref/mode、availability state、issue ref | 不记录 raw health response、不伪成功 |
| Publisher/handoff terminal failure | outbox/handoff ref、attempt/issue/report ref、terminal state | 不回滚 accepted truth、不标 delivered/published success |
| Forbidden body persistence attempt | source/operation、issue ref、diagnostic ref | 不记录 forbidden body 本身;必须按 Step 12 安全错误处理 |
| Commit unknown / rollback failed | operation、channel、idempotency hash、diagnostic ref | 不声明 accepted/rejected 结论;交 Step 12/13 recovery |

### 2.11 15.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S15-OPEN-001 | 通过 | §2.4~§2.9 覆盖 API、worker、jobs、application、repository/UoW、resolver、publisher、handoff、maintenance、runtime/config、adapter/fake |
| 是否保持 Step 15 范围 | 通过 | 未写 metric table、audit event table、trace/span table、测试 ID 或运维策略 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 只引用 Step 6~14 已有 refs、states、issues、surfaces |
| 是否保持 body-free / secret-free | 通过 | §2.2、§2.10 明确禁止 raw body、secret、raw response、private fake map |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 15.2 | metric instrumentation cuts |

---

## 3. 15.2 metric instrumentation cuts

本批定义 L1-identity 的指标埋点切口。指标用于趋势、容量、错误类别和状态分布观察,不能成为单条记录定位真相源。单记录定位必须走结构化日志、trace/audit/report refs、stored result refs 或 safe diagnostic refs。

本批不定义指标后端、采样率、告警阈值、SLO、dashboard、runbook、audit event 表、trace/span 表或测试 ID。

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 15.2 metric instrumentation cuts |
| 当前结论 | 已覆盖 command、query、consumer/callback、repository/UoW、idempotency、resolver/reference、outbox、handoff、projection、reconciliation、job、runtime/config/adapter/fake 的指标切口 |
| 本批边界 | 只定义 metric name、类型、打点位置和允许标签;不写 alert threshold、SLO、audit event、trace/span、测试 ID |
| 关闭事项 | DDD-S15-OPEN-002 |
| 下一批 | 15.3 business trace / audit / report / marker event cuts |

### 3.2 指标命名与类型规则

| 规则 | 正式要求 |
|---|---|
| prefix | 所有指标使用 `identity_` 前缀;不得复用 governance / work / method-library 指标名 |
| counter | 事件次数、结果次数、错误次数、duplicate/replay 次数使用 counter |
| histogram | handler/application/adapter/job item duration 使用 histogram;单位统一为 `_duration_ms` |
| gauge | 当前状态分布、pending count、availability state、runtime assembly state 使用 gauge |
| label source | 标签只能来自 Step 8 protocol kind、Step 10 state/disposition、Step 12 error category、Step 14 adapter/config source family |
| no domain dependency | domain object 不依赖 metric backend;指标由 API/worker/jobs entry、application service、infra adapter 或 runtime boundary 记录 |
| no metric-only truth | 指标不能作为 replay、audit、accepted truth、delivery receipt 或 reconciliation evidence 的唯一来源 |

### 3.3 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `identity_command_total` | counter | API command handler 返回前 | `command_kind`, `result_kind`, `error_kind` |
| `identity_command_duration_ms` | histogram | API command handler 包裹 facade dispatch | `command_kind`, `result_kind` |
| `identity_command_truth_change_total` | counter | accepted command truth change 保存后 | `truth_change_kind`, `subject_kind` |
| `identity_command_rejected_total` | counter | command rejected surface 形成后 | `command_kind`, `rejection_kind`, `error_kind` |
| `identity_query_total` | counter | API query handler 返回前 | `query_kind`, `surface_kind`, `freshness_state` |
| `identity_query_duration_ms` | histogram | API query handler 包裹 facade dispatch | `query_kind`, `surface_kind` |
| `identity_query_no_write_guard_total` | counter | query path 发现 forbidden write attempt 后 | `query_kind`, `guard_result` |
| `identity_visibility_decision_total` | counter | visibility decision 形成后 | `read_family`, `decision_kind` |
| `identity_inbound_event_total` | counter | worker consumer/callback 返回前 | `consumer_kind`, `source_family`, `disposition` |
| `identity_inbound_event_duration_ms` | histogram | worker entry 包裹 facade dispatch | `consumer_kind`, `disposition` |
| `identity_unsupported_event_version_total` | counter | unsupported version receipt 形成后 | `consumer_kind`, `source_family` |
| `identity_callback_total` | counter | handoff/archive callback 返回前 | `callback_kind`, `disposition` |
| `identity_callback_duration_ms` | histogram | callback entry 包裹 facade dispatch | `callback_kind`, `disposition` |
| `identity_idempotency_total` | counter | reserve / complete / conflict / in-flight / replay 后 | `operation_group`, `channel_kind`, `reservation_result` |
| `identity_stored_replay_total` | counter | stored result/receipt/report replay 后 | `operation_group`, `stored_result_kind`, `replay_result` |
| `identity_stored_replay_defect_total` | counter | stored missing / wrong-kind 检测后 | `operation_group`, `stored_result_kind`, `defect_kind` |
| `identity_uow_total` | counter | UoW begin / commit / rollback 返回后 | `phase`, `result_kind` |
| `identity_repository_error_total` | counter | repository / UoW error 映射时 | `repository_kind`, `error_kind` |
| `identity_version_conflict_total` | counter | optimistic version conflict 映射时 | `repository_kind`, `resource_kind` |
| `identity_unique_conflict_total` | counter | formal unique conflict 映射时 | `repository_kind`, `resource_kind` |
| `identity_external_resolver_total` | counter | external resolver 调用完成后 | `resolver_kind`, `source_family`, `result_kind` |
| `identity_external_resolver_duration_ms` | histogram | resolver port 调用前后 | `resolver_kind`, `source_family`, `result_kind` |
| `identity_reference_state_total` | gauge | reference state 保存后或 refresh scan 后 | `reference_kind`, `resolution_state` |
| `identity_reference_refresh_total` | counter | refresh item 完成后 | `reference_kind`, `result_kind` |
| `identity_reference_refresh_duration_ms` | histogram | refresh item resolver call 前后 | `reference_kind`, `result_kind` |
| `identity_projection_freshness_total` | gauge | projection state 保存或 query 读取后 | `projection_kind`, `freshness_state` |
| `identity_projection_rebuild_total` | counter | rebuild item 完成后 | `projection_kind`, `result_kind` |
| `identity_projection_rebuild_duration_ms` | histogram | rebuild job item 前后 | `projection_kind`, `result_kind` |
| `identity_reconciliation_total` | counter | reconciliation report 保存后 | `result_state` |
| `identity_reconciliation_finding_total` | counter | reconciliation report 生成后 | `finding_kind`, `severity_kind` |
| `identity_outbox_pending_total` | gauge | publish job scan 后 | `event_kind`, `outbox_state` |
| `identity_outbox_publish_total` | counter | 每条 outbox publish 完成后 | `event_kind`, `result_kind` |
| `identity_outbox_publish_duration_ms` | histogram | publisher port 调用前后 | `event_kind`, `result_kind` |
| `identity_outbox_terminal_failure_total` | counter | outbox terminal failed / skipped 后 | `event_kind`, `failure_kind` |
| `identity_handoff_total` | counter | prepare / deliver / callback / retry 完成后 | `handoff_kind`, `target_kind`, `result_kind` |
| `identity_handoff_duration_ms` | histogram | handoff delivery port 调用前后 | `handoff_kind`, `target_kind`, `result_kind` |
| `identity_handoff_terminal_failure_total` | counter | handoff failed / cancelled / unsupported 后 | `handoff_kind`, `target_kind`, `failure_kind` |
| `identity_job_total` | counter | operations job 返回前 | `job_kind`, `disposition` |
| `identity_job_duration_ms` | histogram | job runner 包裹 facade dispatch | `job_kind`, `disposition` |
| `identity_job_item_total` | counter | job item loop 每项完成后 | `job_kind`, `item_kind`, `item_result` |
| `identity_job_duplicate_replay_total` | counter | job duplicate replay 完成后 | `job_kind`, `replay_result` |
| `identity_config_validation_total` | counter | runtime config validation 后 | `config_section`, `result_kind` |
| `identity_runtime_assembly_total` | counter | runtime assembly state 进入 terminal/ready surface 后 | `profile_kind`, `assembly_state` |
| `identity_runtime_assembly_state` | gauge | runtime assembly state 保存/发布后 | `profile_kind`, `assembly_state` |
| `identity_adapter_availability_state` | gauge | adapter registry / availability check 后 | `adapter_kind`, `adapter_mode`, `availability_state` |
| `identity_adapter_call_total` | counter | adapter call 完成后 | `adapter_kind`, `adapter_mode`, `result_kind` |
| `identity_fake_controlled_outcome_total` | counter | fake/controlled outcome 被消费后 | `adapter_kind`, `adapter_mode`, `outcome_kind` |
| `identity_redline_violation_total` | counter | config/runtime/implementation redline 检测后 | `redline_kind`, `detected_at` |

### 3.4 标签允许值边界

| 标签 | 允许值来源 | 禁止值 |
|---|---|---|
| `command_kind` | 6 个 Step 8 command canonical name 的有限集合 | request ref、route path、handler function、free text |
| `query_kind` | 14 个 Step 8 query canonical name 的有限集合 | query body、page cursor、subject ref |
| `consumer_kind` / `callback_kind` | 5 个 Step 8 consumer/callback canonical name 的有限集合 | source event id、broker topic raw string |
| `job_kind` | 6 个 Step 8 operations job canonical name 的有限集合 | job run ref、operator input、scope ref |
| `operation_group` | command、consumer、callback、job、handoff、publisher 等有限 group | operation ref、idempotency key |
| `channel_kind` | Step 6/7 operation channel enum | actor id、trace id |
| `result_kind` / `disposition` | Step 8 public outcome、Step 10 state 或 Step 12 recovery category | diagnostic text、error message、external status body |
| `error_kind` / `failure_kind` | Step 12 taxonomy category 或 Step 7 adapter outcome category | stack trace、SQL、HTTP response body |
| `repository_kind` | Step 7 repository family name | table name with tenant/id、SQL statement |
| `resource_kind` / `subject_kind` | Step 6 object/state family | typed ref value、member id |
| `source_family` / `reference_kind` | role、governance、work、artifact、memory/archive 等有限 family | external URL、source token、external object id |
| `adapter_kind` / `adapter_mode` | Step 14 adapter catalog finite kind/mode | endpoint URL、credential ref value、secret |
| `event_kind` | 10 个 Step 8 outbound event canonical name 的有限集合 | broker topic raw string、payload marker ref |
| `target_kind` | Step 14 handoff target family | bucket/path/raw endpoint/tenant |
| `config_section` / `profile_kind` | Step 14 config section/profile category | raw profile file path、env var value |
| `redline_kind` | Step 14 redline category | source code body、secret path |

### 3.5 禁止高基数 / 敏感标签

下列字段不得作为 metric label:

- request ref、entry ref、trace context ref、trace id、actor ref、consumer ref、member ref、subject ref、source ref、reference ref、basis ref。
- result ref、stored result ref、receipt ref、report ref、outbox record ref、handoff intent ref、attempt ref、issue ref、diagnostic ref。
- idempotency key、dedupe key、raw digest、payload marker ref、page cursor、source event ref、job run ref。
- raw endpoint、broker topic string、bucket/path、tenant string、SQL、HTTP status body、adapter response body、stack trace。
- secret、token、credential、auth header、raw config/env value、fixture private key、free text。

这些字段只能进入结构化日志、trace/audit/report refs、safe diagnostic refs 或 redacted evidence material。

### 3.6 指标打点边界

| 边界 | 正式要求 |
|---|---|
| API/worker/jobs entry | 记录 request/job/event 总量和 duration;entry validation failure 可以打指标,但不得写 stored result/report |
| application service | 记录 command/query/consumer/job result、idempotency、stored replay、truth change、projection stale、job item result |
| repository/UoW | 记录 version/unique conflict、unavailable、commit/rollback result;不记录 SQL、table partition 或 row id |
| resolver/adapter | 记录 adapter kind/mode/source family/result/duration;不记录 endpoint、response body 或 external object id |
| outbox/handoff | 记录 pending/published/failed/delivered/retryable/terminal state;Published/Delivered 指标不表示 downstream business accepted |
| query | 记录 read surface、visibility decision 和 freshness;不得触发 repair 指标对应的写动作 |
| duplicate replay | 记录 replay 结果和 defect;不得用 metric 增量替代 stored replay surface |
| fake/controlled | 记录 same formal adapter kind/mode/outcome;不得按 private fake map key 打标签 |
| runtime/config | 记录 config validation、assembly state、adapter availability;runtime assembled 指标不表示 business accepted |

### 3.7 15.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S15-OPEN-002 | 通过 | §3.3 覆盖 command、query、consumer/callback、repository/UoW、idempotency、resolver/reference、projection/report、outbox/handoff、job、runtime/config/adapter/fake |
| 是否保持标签低基数 | 通过 | §3.4~§3.5 明确允许标签来源和禁止高基数字段 |
| 是否保持 Step 15 范围 | 通过 | 未写 alert threshold、SLO、audit event table、trace/span table、测试 ID 或运维策略 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 只引用 Step 6~14 已有 kind、state、disposition、adapter family |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 15.3 | business trace / audit / report / marker event cuts |

---

## 4. 15.3 business trace / audit / report / marker event cuts

本批定义业务可追溯与审计事件切口。这里的“事件”不是新增 public DTO 或外部事件,而是说明 Step 6~13 已定义对象在什么 flow 后必须形成 trace、audit、outbox、handoff marker、receipt、job report 或 report-only material。

本批不定义 runtime span、metric、alert threshold、SLO、dashboard、runbook、测试 ID、审计后端协议或新的 audit event DTO。

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 15.3 business trace / audit / report / marker event cuts |
| 当前结论 | 已覆盖 accepted command truth、consumer/callback marker、outbox publication、handoff delivery、projection/reference/reconciliation maintenance、stored replay 和 failed/rejected 分支的业务审计边界 |
| 本批边界 | 只定义已存在对象的 trace/audit/report/marker 写入 cut;不新增审计对象、DTO、repository 或外部 ledger schema |
| 关闭事项 | DDD-S15-OPEN-003 |
| 下一批 | 15.4 runtime / config / adapter / fake observability and redaction boundary |

### 4.2 业务审计载体边界

| 载体 | 来源对象 / port | 承载内容 | 不承载内容 |
|---|---|---|---|
| `IdentityTraceRecord` | Step 6 trace object;Step 7 trace repository | accepted identity truth change、formal marker trace、member、subject、change kind、source cursor、actor/time、safe markers | runtime log body、span body、raw request/event body、external body、debug dump |
| `AuditTrail` / `AuditTrailEntry` | Step 6 audit object;Step 7 audit repository | audit subject 下的 trace refs、scope、visibility/read surface、redacted entries | raw log、trace body copy、truth object body copy、external source body |
| `IdentityOutboxRecord` | Step 6 outbox object;Step 7 outbox repository | accepted fact 的 body-free payload marker、topic key ref、trace ref、outbox state | serialized event body、broker response、downstream receipt、current truth dump |
| `TraceHandoffIntent` | Step 6 handoff object;Step 7 handoff repository | non-empty trace refs、optional audit trail ref、target/scope refs、safe material ref、handoff state、attempt/receipt/issue refs | archive package、observability raw log、target path、receipt body |
| `IdentityConsumerReceipt` / receipt envelope | Step 8 protocol;Step 13 stored replay | consumer/callback accepted/rejected/noop/delayed/unsupported public receipt and replay marker | unsupported payload body、callback raw receipt body、external adapter response |
| `IdentityJobRunReport` / `IdentityJobReportSurface` | Step 6/8 job report;Step 13 stored replay | job run result kind、item refs、counts、issue refs、report refs、outbox/handoff/receipt refs | raw job log、adapter response body、repair action body |
| `ReconciliationReport` | Step 6 report-only object;Step 7 report repository | report state、target refs、finding refs、issue refs、generated metadata | truth repair、external body、raw diagnostic、automatic remediation plan |
| `StoredIdentityOperationResult` | Step 6/7/13 stored result surface | replay pointer for accepted/rejected command、consumer receipt、handoff callback receipt、job report | public response body dump、raw input、current truth reconstruction |

### 4.3 业务审计事件切口表

| 事件切口 | 触发 flow | 必须写入 / 引用 | 禁止事项 |
|---|---|---|---|
| `MemberEstablishedTraceCut` | `EstablishGlobalMemberFlow` accepted | `IdentityTraceRecord::from_accepted_change(...)`, `AuditTrailEntry`, optional outbox, projection stale, stored command result | entry validation success 不能生成 trace;duplicate replay 不追加第二条 trace |
| `LifecycleStateChangedTraceCut` | `UpdateGlobalLifecycleStateFlow` accepted | lifecycle truth save、accepted truth cursor、trace/audit/outbox/stale/effect/stored result | high-risk basis missing/rejected 不写 accepted trace |
| `RoleCapabilitySummaryChangedTraceCut` | `MaintainRoleCapabilitySummaryFlow` accepted | role summary/source snapshot safe markers、trace/audit/outbox/stale/stored result | RoleDefinition/CapabilityDefinition/evidence body 不进入 trace/outbox |
| `CareerRecordAppendedTraceCut` | `AppendCareerRecordFlow` accepted | append-only career record ref、trace/audit/outbox/stale/stored result | duplicate source no-new-history 不追加第二份 career trace |
| `MemoryReferenceChangedTraceCut` | `MaintainMemoryReferenceFlow` accepted | memory relation/state refs、archive/handoff marker refs where applicable、trace/audit/outbox/stale/stored result | memory text、embedding、archive package、receipt body 不进入 |
| `TraceHandoffPreparedCut` | `PrepareTraceHandoffFlow` accepted | pending `TraceHandoffIntent` with non-empty trace refs、optional audit trail、safe material、stored result | prepare 不执行 delivery;target path/package/body 不保存 |
| `RoleCapabilitySourceConsumerCut` | `HandleRoleCapabilitySourceChangedFlow` accepted | source snapshot/reference sidecar、receipt envelope、stored receipt、marker/accepted trace if required、projection stale | unsupported/rejected event 不写 accepted marker trace |
| `WorkParticipationConsumerCut` | `HandleWorkParticipationAcceptedFlow` accepted | career record append or formal noop receipt、trace/outbox/stale、stored receipt | worker ack 不能替代 application receipt |
| `MemorySourceConsumerCut` | `HandleMemoryReferenceSourceStateChangedFlow` accepted | memory relation/reference sidecar、receipt envelope、trace/outbox/stale where required | external memory/archive body 不保存 |
| `ArchiveHandoffCallbackCut` | `HandleArchiveHandoffResultFlow` accepted | memory relation state update、formal receipt/issue marker、callback receipt envelope、trace/outbox/stale | callback raw receipt body 不能推进 state |
| `TraceHandoffCallbackCut` | `HandleTraceHandoffResultFlow` accepted | handoff intent state update、attempt/receipt/issue marker、callback receipt envelope、trace/outbox/stale | Delivered 必须有 `HandoffAttemptRef` + `HandoffReceiptRef` |
| `OutboundMaterialAcceptedCut` | 10 个 outbound material accepted source | `IdentityOutboxRecord` with accepted trace ref、outbox subject、payload marker、topic key | publisher 不能回读 current truth 重构 payload |
| `OutboxPublicationCut` | `PublishIdentityOutboxFlow` item completed | outbox state update、attempt/issue refs、job report item refs、stored job report | publish failure 不回滚 accepted truth;Published 不等于 downstream consumed |
| `ProjectionMaintenanceCut` | `RebuildIdentityProjectionFlow` item completed | projection state transition、rebuilt/failed projection refs、job report issue refs | job 不修 core truth;query 不触发 rebuild |
| `ReferenceRefreshCut` | `RefreshExternalReferenceStateFlow` item completed | reference state / typed sidecar with same bundle version、refreshed/failed refs、job report | business source ref/source version 不替代 bundle version |
| `ReconciliationReportCut` | `RunIdentityReconciliationFlow` completed | `ReconciliationReport` generated/no-finding/failed, finding refs、issue refs、stored job report | finding 不等于 repair action |
| `HandoffDeliveryCut` | `DeliverTraceHandoffFlow` item completed | handoff state update、attempt/receipt/issue refs、delivered/failed refs、stored job report | HTTP 2xx/job log success 不等于 Delivered |
| `PropagationRetryCut` | `RetryIdentityPropagationFailuresFlow` item completed | retryable outbox/handoff state updates、published/delivered/failed refs、stored job report | terminal failed/skipped/cancelled/published/delivered 不重试 |
| `ConfigValidationFailureCut` | runtime config validation failed | config issue refs、runtime assembly failed/degraded marker、structured log;15.4 细化 | 不写 business trace/outbox/stored command result |

### 4.4 写入规则

| 规则 | 正式要求 |
|---|---|
| accepted truth trace first | accepted command truth change 保存后必须使用 Step 7 mapper 生成 trace/audit/outbox subject,再 append `IdentityTraceRecord` |
| same-UoW side effects | command accepted 的 truth、trace、audit、outbox、projection stale、effect summary、stored result、idempotency complete 必须在同一 UoW 中 staged |
| audit trail only refs | `AuditTrailEntry` 只引用 `IdentityTraceRecordRef` 和 safe metadata,不得复制 trace body 或 truth body |
| outbox requires accepted trace | `IdentityOutboxRecord::from_accepted_change(...)` 必须引用 accepted trace ref;rejected / query / job retry 不创建 accepted outbox |
| marker trace requires mapper | consumer/callback/job/reference marker trace 只有 Step 9 要求时写入,且 subject 必须来自 `IdentityMarkerSubjectMapper` |
| handoff trace refs non-empty | `TraceHandoffIntent` 必须包含非空 trace refs;optional audit trail 不能替代 trace refs |
| delivered receipt guard | `HandoffState::Delivered` 必须有 formal attempt + receipt refs;adapter success / HTTP 2xx / request sent / job log success 不足以 delivered |
| report-only maintenance | projection/reference/reconciliation jobs 只能写 maintenance state/report/issue refs,不得修 member/lifecycle/role/career/memory truth |
| duplicate replay no append | duplicate command/consumer/callback/job 读取 stored result/receipt/report replay,不得追加第二份 trace、outbox、receipt、job report item |
| failed path not accepted | validation/domain rejected、unsupported event、not-visible query、degraded query、adapter failure、config failure 不得写 accepted truth trace |
| query no audit write | query 可读取 trace/audit/report,但不得创建 audit trail、修复缺失 trace 或追加 read audit |

### 4.5 Flow 到业务审计闭环表

| Flow family | trace / audit | outbox / handoff | report / stored replay | 禁止副作用 |
|---|---|---|---|---|
| 6 command flows | accepted 写 `IdentityTraceRecord` + `AuditTrailEntry`;rejected 不写 accepted trace | accepted 按 canonical outbound material 创建 outbox;prepare handoff 只创建 pending intent | accepted/rejected replay 走 stored command result/effect summary | duplicate 不重跑;rejected 不写 outbox/stale |
| 14 query flows | 只读 trace/audit/report/view;不写 read audit | 不创建、不发布、不 retry handoff/outbox | 不保存 stored query result | query no-write,no repair |
| 5 consumer/callback flows | accepted 按 Step 9 要求写 marker/accepted trace;unsupported/rejected 不写 accepted marker | accepted 可创建 outbox/stale 或推进 handoff/memory state | typed receipt envelope + stored result 支撑 replay | worker ack 不等于 receipt;callback raw body 不推进 state |
| 10 outbound material | 来源必须是 accepted command/consumer/callback trace/material | `IdentityOutboxRecord` 保存 payload marker/topic/trace only | owning flow stored result 包含 outbox refs | publisher 不从 current truth 重构 payload |
| `PublishIdentityOutboxFlow` | 不写 business truth trace | 更新 outbox publication state | job report item refs + stored job report | publish failure 不回滚 accepted truth |
| `RebuildIdentityProjectionFlow` | 不写 business truth trace | 不创建 outbox/handoff | projection refs/issues in job report | 不修 core truth;query 不触发 |
| `RefreshExternalReferenceStateFlow` | marker trace only if formally required | affected projection stale marker where required | refreshed/failed refs in job report | 不保存 external body |
| `RunIdentityReconciliationFlow` | 不替代 accepted trace | 不发布 outbox/handoff | `ReconciliationReport` + stored job report | finding 不等于 repair |
| `DeliverTraceHandoffFlow` | handoff intent history/marker only | delivered/retryable/failed/cancelled state with attempt/receipt/issue | delivered/failed/receipt refs in job report | no receipt,no delivered |
| `RetryIdentityPropagationFailuresFlow` | 不写 accepted truth trace | retry only retryable outbox/handoff | retried/published/delivered/failed refs in report | terminal state 不重开 |
| runtime/config/fake | 不写 business trace | 不创建 outbox/handoff | config/runtime issue refs only;15.4 细化 | runtime assembled / fake success 不等于 business accepted |

### 4.6 Rejected / failed path 审计边界

| 分支 | 允许写入 | 禁止写入 |
|---|---|---|
| entry validation / dispatch failure | structured log、metric、entry issue marker | stored command result、consumer receipt、job report、accepted trace |
| command rejected | rejected public surface,stored rejected result only when Step 12/13 says replayable,log/metric | accepted trace、accepted outbox、projection stale |
| query not visible / degraded / missing | query surface、log/metric | audit append、projection/reference repair、stored result |
| unsupported event version | unsupported receipt/log/metric without payload parsing | accepted marker trace、snapshot/reference mutation |
| consumer delayed/quarantined | safe receipt/issue/log/metric as Step 12 allows | accepted truth/outbox unless accepted branch completed |
| adapter unavailable / invalid material | safe issue marker、failed state/report item、log/metric | adapter response body、fake default success |
| outbox/handoff terminal failure | outbox/handoff native issue refs、job report issue refs、log/metric | rollback accepted truth、mark downstream consumed/delivered without receipt |
| stored replay defect | replay consistency issue/log/metric | mutation rerun、current truth reconstruction |
| config/runtime failure | config issue/runtime assembly state/log/metric | business trace/outbox/stored operation result |

### 4.7 15.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S15-OPEN-003 | 通过 | §4.2~§4.6 覆盖 trace/audit/outbox/handoff/report/stored replay 和 rejected/failed 边界 |
| 是否保持 Step 15 范围 | 通过 | 未新增 audit DTO、repository、stored material、runtime span table、测试 ID 或运维策略 |
| 是否保持 query no-write | 通过 | §4.4~§4.6 明确 query 只读 trace/audit/report,不写 read audit |
| 是否保持 duplicate no-rerun | 通过 | duplicate replay 不追加 trace/outbox/receipt/job report item |
| 是否保持 body-free / secret-free | 通过 | 所有载体只保存 safe refs、state、issue、marker,不保存 raw body |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 15.4 | runtime / config / adapter / fake observability and redaction boundary |

---

## 5. 15.4 runtime / config / adapter / fake observability and redaction boundary

本批定义 runtime、config、adapter、entry 和 fake/controlled/disabled 的观测与脱敏边界。这里的观测只覆盖 Step 6/14 已定义的 safe refs、state kind、issue refs、adapter mode、profile marker 和 redacted digest,不得把 raw config、secret、endpoint、adapter response、fixture private map 或外部正文写入日志、指标、审计、report、trace、outbox、handoff 或 stored replay。

本批不定义配置 schema、loader API、secret provider、adapter trait、runtime health check 协议、trace/span table、alert threshold、SLO、dashboard、runbook 或测试 ID。

### 5.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 15.4 runtime / config / adapter / fake observability and redaction boundary |
| 当前结论 | 已覆盖 config load/validation、runtime assembly、adapter availability、entry dispatch、external resolver、publisher/handoff、audit compensation、job-run-start、fake/controlled fixture 和 cross-repo guard 的 safe observability / redaction boundary |
| 本批边界 | 只定义 safe fields / forbidden material / redaction rules;不新增 config schema、adapter port、runtime protocol 或审计 DTO |
| 关闭事项 | DDD-S15-OPEN-004 |
| 下一批 | 15.5 cross-step closure / Step 16 handoff / 回填草稿 |

### 5.2 Runtime / config observability boundary

| 观测切口 | 允许记录 | 禁止记录 | 失败归属 |
|---|---|---|---|
| config source load | `config_source_ref`, `profile_ref`, `source_kind`, `config_evidence_ref`, `redacted_digest` | raw config file body、env raw value、secret、credential、endpoint URL | config validation / runtime assembly issue |
| config parse/type/range validation | `config_issue_ref`, `config_section`, `state_kind`, `diagnostic_ref` | invalid raw value、secret value、full parse dump、stack trace | `IdentityConfigValidationStateKind::Invalid` or rejected runtime build |
| config cross-field validation | `profile_ref`, `config_section`, `issue_ref`, `redline_kind` | full config snapshot、secret ref target、endpoint credential | config validation issue;no business trace |
| sensitive ref resolution | `config_evidence_ref`, `config_section`, `issue_ref`, `redacted_digest` | resolved secret、token、credential、raw path | infra-only failure;no application facade call |
| runtime assembly start | `runtime_assembly_ref`, `profile_ref`, `state_kind` | adapter instance、connection string、endpoint URL | runtime assembly state |
| runtime assembly degraded / failed | `runtime_assembly_ref`, `profile_ref`, `state_kind`, `issue_ref` | raw health check response、panic stack、secret、raw config body | assembly issue;entry not ready or degraded |
| runtime assembled | `runtime_assembly_ref`, `profile_ref`, `state_kind`, adapter count | adapter health details、business accepted marker | wiring ready only;not adapter success |
| runtime redline violation | `redline_kind`, `config_issue_ref`, `diagnostic_ref` | offending raw source code body、secret path content、raw config value | fail-fast or degraded runtime issue |

`IdentityRuntimeAssemblyState::Assembled` 只表示 wiring ready。它不得被日志、指标、审计或 entry guard 解释为 resolver valid、publisher delivered、handoff delivered、query visible、command accepted 或 job succeeded。

### 5.3 Adapter / resolver / publisher / handoff observability boundary

| Adapter family | 允许记录 | 禁止记录 | 正式结果边界 |
|---|---|---|---|
| store / repository adapter | `repository_kind`, `operation_group`, `result_kind`, `issue_ref`, duration | SQL text、row id、table partition、connection string、storage error body | repository result / `ApplicationError` only |
| role/capability resolver | `adapter_ref`, `adapter_mode_ref`, `source_ref`, `safe_summary_ref`, `state_kind`, `issue_ref` | RoleDefinition body、CapabilityDefinition body、method-library response body | body-free resolver outcome |
| governance basis resolver | `adapter_ref`, `basis_ref`, `state_kind`, `issue_ref` | governance policy body、approval body、raw decision material | safe basis summary only |
| work / career source resolver | `adapter_ref`, `source_ref`, `safe_summary_ref`, `state_kind`, `issue_ref` | ProjectMember truth、work record body、external event body | safe source summary only |
| artifact resolver | `adapter_ref`, `source_ref`, `safe_summary_ref`, `state_kind`, `issue_ref` | artifact body、file path、blob hash with secret meaning | safe artifact marker only |
| memory / archive resolver | `adapter_ref`, `source_ref`, `safe_summary_ref`, `state_kind`, `issue_ref` | memory text、embedding、archive package、receipt body | safe memory/archive marker only |
| topic binding / publisher | `adapter_ref`, `topic_key_ref`, `outbox_record_ref`, `attempt_ref`, `outcome_kind`, `issue_ref` | broker topic raw string、payload body、broker response body、credential | Published is outbound boundary only |
| handoff target / delivery | `adapter_ref`, `handoff_intent_ref`, `target_ref`, `scope_ref`, `attempt_ref`, `receipt_ref`, `issue_ref` | bucket/path/raw endpoint、archive package、receipt body、target secret | Delivered requires formal receipt |
| audit / trace sink | `audit_subject_ref`, `audit_trail_ref`, `compensation_marker`, `issue_ref` | raw log/debug body、external observability body、sink response body | sink failure cannot disable accepted audit |

Adapter observability must record adapter kind/mode and formal outcome category, not transport internals. If implementation needs a new adapter outcome category to distinguish retryable/permanent/disabled/unsupported, that category must already exist in Step 7/12;otherwise implementation must pause and return to the design truth source.

### 5.4 Entry / dispatch / job-run-start observability boundary

| Entry family | 允许记录 | 禁止记录 | 边界 |
|---|---|---|---|
| API command entry | `api_entry_ref`, `route_ref`, `request_marker_ref`, `operation_name`, `actor_ref`, `issue_ref` | raw request body、raw header、credential、token、response body | entry valid is not command accepted |
| API query entry | `api_entry_ref`, `route_ref`, `request_marker_ref`, `operation_name`, `consumer_ref`, `issue_ref` | query body dump、page payload raw value、authorization internals | entry dispatch is not query visible |
| worker event entry | `worker_entry_ref`, `consumer_binding_ref`, `envelope_marker_ref`, `source_event_ref`, `issue_ref` | event payload body、raw broker headers、broker topic raw string | worker ack is not application receipt |
| handoff callback entry | `worker_entry_ref`, `handoff_intent_ref`, `attempt_ref`, `receipt_ref`, `issue_ref` | callback raw receipt body、adapter response、archive package | callback dispatch is not delivered without state update |
| jobs entry | `job_entry_ref`, `job_run_ref`, `job_kind`, `scope_marker_ref`, `input_cursor_ref`, `issue_ref` | raw CLI args、env secret、raw replay input、historical body | job entry valid is not job succeeded |
| dispatch guard | `dispatch_ref`, `dispatch_target_ref`, `dispatch_kind`, `runtime_state_kind`, `issue_ref` | service function pointer dump、repository target、adapter target | target must be application facade target only |
| job-run-start config | `job_run_ref`, `job_kind`, `profile_ref`, `scope_marker_ref`, `batch_marker`, `issue_ref` | raw path material、secret path, raw schedule payload | frozen config marker only |

Entry observability must preserve the Step 7/14 rule that API、worker and jobs entry modules only see entry marker、validated runtime snapshot、dispatch catalog and application facade. Entry logs/metrics cannot prove application accepted/rejected,consumer receipt,callback receipt or job report.

### 5.5 Fake / controlled / disabled observability boundary

| Runtime mode | 允许记录 | 禁止记录 | 正式语义 |
|---|---|---|---|
| fake repository | `adapter_ref`, `adapter_mode_ref`, `repository_kind`, `result_kind`, `issue_ref` | private map keys、in-memory row body、test-only hidden lookup rule | same port semantics as durable repository |
| fake resolver | `adapter_ref`, `source_family`, `state_kind`, `safe_summary_ref`, `issue_ref` | fixture body、opaque ref auto-valid rule、external body string | returns formal safe summary / unavailable / invalid |
| fake publisher | `adapter_ref`, `topic_key_ref`, `attempt_ref`, `outcome_kind`, `issue_ref` | broker topic raw string、payload body、downstream consumed claim | Published means outbound boundary only |
| fake handoff | `adapter_ref`, `handoff_intent_ref`, `attempt_ref`, `receipt_ref`, `issue_ref` | generated receipt body、target path、archive package | Delivered requires formal receipt marker |
| controlled mode | `adapter_ref`, `adapter_mode_ref`, `controlled_outcome_kind`, `issue_ref` | private control map、scenario body、secret fixture material | controlled outcome must map to formal port outcome |
| disabled mode | `adapter_ref`, `adapter_mode_ref`, `availability_state`, `issue_ref` | silent skip、fake success marker | disabled returns disabled/unavailable/degraded surface |
| deterministic clock/id | `adapter_ref`, `adapter_mode_ref`, `result_kind` | seed raw body、private sequence table | deterministic result must still use formal id/clock ports |

Fake/controlled observability is allowed to explain which formal outcome was selected, but not how a private fixture map produced it. If a test needs to assert detailed fixture contents, Step 16 must define a formal test cut or evidence rule;Step 15 does not expose private fixture material.

### 5.6 Redaction matrix

| Material family | Allowed observability material | Forbidden material |
|---|---|---|
| config | `config_source_ref`, `profile_ref`, `config_evidence_ref`, `config_issue_ref`, `redacted_digest` | raw config body、env raw value、secret、token、credential、endpoint URL |
| runtime assembly | `runtime_assembly_ref`, `assembly_state`, `adapter_ref`, `issue_ref` | adapter object dump、connection string、raw health response |
| API request | `api_entry_ref`, `route_ref`, `request_marker_ref`, `actor_ref`, `trace_context_ref` | request body、raw header、credential、token、response body |
| worker envelope | `worker_entry_ref`, `consumer_binding_ref`, `envelope_marker_ref`, `source_event_ref` | event payload body、broker headers、topic raw string |
| job request | `job_entry_ref`, `job_run_ref`, `job_kind`, `scope_marker_ref`, `input_cursor_ref` | raw CLI args、raw job input body、secret path、historical body |
| resolver output | `source_ref`, `reference_ref`, `safe_summary_ref`, `state_kind`, `source_version_ref` | RoleDefinition body、ProjectMember truth、memory text、artifact body、governance policy body |
| publisher output | `outbox_record_ref`, `topic_key_ref`, `attempt_ref`, `outcome_kind`, `issue_ref` | payload body、broker response body、broker topic raw string |
| handoff output | `handoff_intent_ref`, `target_ref`, `scope_ref`, `attempt_ref`, `receipt_ref`, `issue_ref` | bucket/path/raw endpoint、archive package、receipt body |
| diagnostic | stable error category、safe issue ref、safe summary、redacted digest | stack trace、SQL、HTTP body、adapter response body、free-text secret |
| fake fixture | profile ref、fixture ref digest、adapter mode、controlled outcome kind | fixture raw body、private fake map、hidden lookup key |

### 5.7 Redaction enforcement rules

| 规则 | 正式要求 |
|---|---|
| redaction before emission | log / metric / audit / report emission 前必须先映射到 safe refs/kinds;不得先输出后清洗 |
| diagnostic is by ref | diagnostic 只记录 `diagnostic_ref` / `issue_ref`;raw diagnostic body 不进入 identity observability |
| secret remains infra-local | secret value 只允许存在于 infra adapter memory boundary;application/domain/contracts/report/log 不接收 secret |
| endpoint is not label | endpoint URL、broker topic raw string、bucket/path、tenant route 不得作为 metric label 或 log primary id |
| body-free failure | forbidden body detection 记录 issue ref and category,不记录 forbidden material itself |
| fake parity | fake/durable must emit same formal categories;fake 不能暴露 extra private state to service/log/metric |
| disabled is explicit | disabled adapter 必须产生 disabled/unavailable/degraded surface and issue ref,不得静默成功 |
| assembled is not healthy | runtime assembled 不能提升 adapter availability,也不能写 business accepted trace/outbox |

### 5.8 Runtime / adapter failure observability mapping

| Failure family | Observable surface | Must not do |
|---|---|---|
| config parse/type/range invalid | config validation issue、runtime assembly failed/degraded log/metric | call application facade or create business rejected result |
| redline config violation | redline issue、config validation failed | weaken state matrix、query no-write、job no-repair or body-free boundary |
| adapter disabled | adapter availability disabled/unavailable,issue ref | fake accepted/published/delivered |
| adapter degraded | degraded availability state,issue ref,query degraded / job failed item as flow requires | hide degradation behind visible success |
| resolver unavailable | resolver unavailable issue,command rejected/dependency surface or job failed item | save external body or mark reference resolved |
| publisher unavailable | outbox retryable/permanent issue and job report | rollback accepted truth or mark downstream consumed |
| handoff target unavailable | handoff issue and pending/retryable/failed/cancelled state as Step 10/12 allows | invent fallback target/path |
| audit sink unavailable | compensation marker / local issue,accepted audit still required | disable accepted audit or store raw log body |
| fake controlled missing outcome | controlled issue / disabled-like failure surface | default to valid/published/delivered |
| disallowed compile dependency | redline issue / implementation gate failure log | treat sibling implementation dependency as runtime adapter |

### 5.9 15.4 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S15-OPEN-004 | 通过 | §5.2~§5.8 覆盖 runtime/config/adapter/entry/fake redaction boundary |
| 是否保持 Step 15 范围 | 通过 | 未新增 config schema、adapter port、runtime protocol、trace/span table、测试 ID 或运维策略 |
| 是否保持 raw config / secret exclusion | 通过 | config、runtime、entry、adapter、fake 均禁止 raw body/secret/endpoint credential |
| 是否保持 fake/durable parity | 通过 | fake/controlled/disabled 只暴露 formal outcome kind and issue refs |
| 是否保持 runtime assembled not business accepted | 通过 | assembly state 不等于 adapter healthy、publisher delivered、handoff delivered 或 business accepted |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 15.5 | cross-step closure / Step 16 handoff / 回填草稿 |

---

## 6. 15.5 cross-step closure / Step 16 handoff / 回填草稿

本批只做 Step 15 收口,不新增 log field enum、metric label enum、audit DTO、trace/span schema、port、state、error、stored material、测试 ID 或运维策略。它把 15.1~15.4 的观测与审计契约整理成 Step 16 可验证切口,并给 Step 19 的正式第 14 章装配留下章节草稿。

### 6.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 15.5 cross-step closure / Step 16 handoff / 回填草稿 |
| 当前结论 | Step 15 已完成;没有未闭合的 Step 15 blocker |
| 本批关闭事项 | DDD-S15-OPEN-005 |
| 本批输出 | cross-step closure audit、Step 16 handoff、open item closure、正式回填草稿 |
| 下一步 | 用户审核 Step 15 后进入 Step 16 test cuts |

### 6.2 Cross-step closure audit

| 上游 Step | Step 15 收口结论 | 闭合状态 |
|---|---|---|
| Step 6 object contracts | trace、audit、outbox、handoff、job report、stored result、runtime/adapter/entry object 只记录正式 refs、state、issue refs、cursor 和 marker;不保存 raw body / secret | 已闭合 |
| Step 7 trait / port / adapter contracts | repository、UoW、resolver、publisher、handoff、config、runtime、fake 的 observability 只依赖既有 port 和正式 outcome;不新增读取面或保存面 | 已闭合 |
| Step 8 protocol contracts | Command、Query、Inbound Event / Callback、Outbound Event、Operations Job 的 metadata、receipt、report、surface 均有日志和指标切口;query 不写业务审计 | 已闭合 |
| Step 9 function flows | accepted write path、query no-write path、consumer/callback marker path、outbox publish、maintenance job、handoff job 的观测副作用与 flow 顺序一致 | 已闭合 |
| Step 10 state matrix | lifecycle、source/reference、read surface、projection/reference/report、outbox/handoff、idempotency/job、runtime/adapter/entry 状态均有状态类 log/metric 或 report cut,terminal guard 不被观测绕过 | 已闭合 |
| Step 11 persistence / transaction consistency | same-UoW accepted trace/audit/outbox/stale/stored result、append-only、stored replay、optimistic conflict、cursor 和 fake/durable parity 的观测边界一致 | 已闭合 |
| Step 12 error / recovery | rejected、not-visible、degraded、unsupported、delayed、retryable、terminal、manual recovery 和 forbidden body 均有 safe log/metric 或 safe issue marker 口径 | 已闭合 |
| Step 13 concurrency / idempotency | duplicate replay、in-flight、digest conflict、stored result/report/receipt replay、retry guard 均只写 replay log/metric,不重放业务 trace/outbox/report | 已闭合 |
| Step 14 config / external binding | config/runtime/adapter/entry/fake 的 redaction、disabled/degraded/unavailable、controlled outcome 和 forbidden material 均被 Step 15 承接 | 已闭合 |
| Step 15 observability / audit | 15.1 日志、15.2 指标、15.3 业务审计、15.4 runtime/config/adapter/fake redaction、15.5 Step 16 handoff 均已写入 | 已闭合 |

### 6.3 Step 16 handoff

Step 16 必须把下列 handoff 转成最小测试切口和证据扫描规则。Step 15 不分配正式测试 ID,只给测试覆盖主题、断言方向和禁止事项。

| Handoff topic | Step 16 应验证的内容 | 禁止替代 |
|---|---|---|
| log cuts coverage | API、worker、jobs、application service、repository/UoW、resolver/adapter、runtime builder、fake/controlled/disabled path 均有结构化日志切口 | 只测 happy path 或只检查 free text log |
| metric low-cardinality labels | counter、histogram、gauge 只使用有限 kind/state/result/error/source family/adapter kind label | ref、request id、actor id、subject id、idempotency key、topic raw string 或 free text label |
| accepted truth observability | accepted command 同一 UoW 内追加 trace/audit/outbox/stale/stored result,并记录 accepted log/metric | 通过日志代替业务 trace/audit/outbox |
| query no-write observability | query 可写 log/metric,但不写 trace/audit、stored result、projection/reference repair 或 idempotency record | 把 visible query success 当成 accepted truth |
| duplicate replay | command、consumer/callback、job duplicate replay 只读取 stored result/receipt/report,不新增 trace/outbox/report item | 重跑 mutation 或补写业务审计 |
| consumer / callback receipt replay | accepted receipt replay 与 unsupported/delayed/quarantined 路径可观测,unsupported 不写 accepted marker | 把 unsupported event 记录成 accepted trace |
| outbox publish | publish attempt success/failure 有 log/metric/report,失败不回滚已提交 truth,也不重建 current truth | 失败时修改 accepted truth 或用 topic raw string 做 label |
| handoff delivery | delivered 必须有正式 attempt、receipt 和 handoff/report refs,failed/cancelled/unsupported 只写 safe outcome | 只凭 adapter healthy 判断 delivered |
| projection / reference / reconciliation jobs | rebuild、refresh、reconciliation 的 item refs、failed refs、report refs、state transition 和 no truth repair 规则可验证 | job 直接修 core truth 或从 private fake map 推导结果 |
| config / runtime redaction | raw config、env raw value、secret、endpoint credential、adapter response、diagnostic dump 不进入 log/metric/audit/report/outbox/stored replay | 用人工约定替代自动扫描 |
| runtime / adapter state boundary | runtime assembled、adapter healthy、publisher delivered、handoff delivered、application accepted 是不同语义 | runtime ready 直接断言业务 accepted |
| fake / controlled / disabled parity | fake/controlled/disabled 暴露 formal outcome kind、issue refs、state 和 metric,不输出 private fixture map 或默认 success | 用 fake 私有 map 作为测试真相源 |
| forbidden body negative tests | request/event/job body、RoleDefinition body、ProjectMember truth、memory text、archive package、artifact body、governance policy body、broker payload body 均不得出现在观测材料中 | 只检查 secret,漏掉业务 raw body |

### 6.4 Remaining open item closure

| 编号 | 原问题 | 闭合批次 | 当前处理 |
|---|---|---|---|
| DDD-S15-OPEN-001 | 日志埋点表是否覆盖 API、worker、jobs、application、repository、adapter、runtime、fake | 15.1 | 已闭合 |
| DDD-S15-OPEN-002 | 指标埋点表是否覆盖关键路径且标签低基数 | 15.2 | 已闭合 |
| DDD-S15-OPEN-003 | business trace / audit / report / marker event 是否与 Step 6~13 写入面一致 | 15.3 | 已闭合 |
| DDD-S15-OPEN-004 | runtime/config/adapter/fake redaction boundary 是否承接 Step 14 | 15.4 | 已闭合 |
| DDD-S15-OPEN-005 | Step 16 test cut handoff 和回填草稿是否闭合 | 15.5 | 已闭合 |

### 6.5 15.5 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 cross-step closure | 通过 | §6.2 回指 Step 6~15,未发现新的 Step 15 blocker |
| 是否完成 Step 16 handoff | 通过 | §6.3 给出测试切口主题、断言方向和禁止替代 |
| 是否关闭 DDD-S15-OPEN-005 | 通过 | §6.4 已关闭全部 Step 15 open item |
| 是否保持 Step 15 范围 | 通过 | 未新增 schema、port、state、error、stored material、测试 ID、alert threshold、SLO、dashboard 或 runbook |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | Step 16 | test cuts and minimal validation checklist |

---

## 7. 回填草稿

正式 `03-详细设计.md` 第 14 章后续应从已审核的 15.1~15.5 装配,建议拆成以下小节。

| 正式小节 | 回填来源 | 应写内容 |
|---|---|---|
| 14.1 Observability principles | 15.0、15.5 | Step 15 目标、红线、logs are not business audit、query no-write、duplicate no-rerun、failed path is not accepted trace、low-cardinality labels、forbidden material |
| 14.2 Log instrumentation cuts | 15.1 | 日志字段词表、日志级别规则、entry/application/worker/repository/resolver/outbox/handoff/job/runtime/fake log cuts、错误分支日志优先级 |
| 14.3 Metric instrumentation cuts | 15.2 | 指标命名与类型规则、metric cuts、标签允许值边界、禁止高基数 / 敏感标签、指标打点边界 |
| 14.4 Business trace / audit / report / marker cuts | 15.3 | 业务审计载体边界、业务审计事件切口表、写入规则、flow 到业务审计闭环表、rejected / failed path 审计边界 |
| 14.5 Runtime / config / adapter / fake redaction boundary | 15.4 | runtime/config observability boundary、adapter/entry/fake observability boundary、redaction matrix、redaction enforcement rules、runtime/adapter failure observability mapping |
| 14.6 Forbidden material and Step 16 handoff | 15.5 | cross-step closure 结论、Step 16 handoff topics、剩余 open item closure、正式文档不包含测试 ID 和运维策略 |

正式第 14 章应保持代码埋点契约粒度:定义必须出现的 log/metric/audit/report/handoff cut、允许字段、禁止字段和跨 Step 约束,不定义具体 alert threshold、SLO、dashboard、runbook、metric backend、日志采样率、保留周期、测试 ID 或部署产品。

---

## 8. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S15-OPEN-001 | 日志埋点表是否覆盖 API、worker、jobs、application、repository、adapter、runtime、fake | 15.1 | 已闭合 |
| DDD-S15-OPEN-002 | 指标埋点表是否覆盖关键路径且标签低基数 | 15.2 | 已闭合 |
| DDD-S15-OPEN-003 | business trace / audit / report / marker event 是否与 Step 6~13 写入面一致 | 15.3 | 已闭合 |
| DDD-S15-OPEN-004 | runtime/config/adapter/fake redaction boundary 是否承接 Step 14 | 15.4 | 已闭合 |
| DDD-S15-OPEN-005 | Step 16 test cut handoff 和回填草稿是否闭合 | 15.5 | 已闭合 |

---

## 9. 进入下一步条件

进入 Step 16 前必须满足:

- 用户审核通过 Step 15。
- Step 16 只定义测试切口与最小验证清单,不得直接修改正式 `03-详细设计.md`。
- Step 16 必须把本 Step 的日志、指标、业务审计、redaction、duplicate replay、query no-write、fake/durable parity 和 forbidden body 规则转成可验证测试入口或证据扫描项。
- 若 Step 16 发现需要新增 object、port、state、error、schema、stored material 或正式 protocol field,必须回到对应 Step 6~15 闭口,不得在测试方案中自行补契约。
