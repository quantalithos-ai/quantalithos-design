# Step 15. 可观测性与审计埋点契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15
> 书写规范：`standards/document/详细设计书写规范.md` §5.14
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md`
> 回填位置：未来正式 `03-详细设计.md` §14
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 15 |
| current_module | `observability_audit:safe_telemetry_and_audit_boundary` |
| gate_status | `pass_for_step_16` |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| observability_truth_owner | L4-observability；Runner 只产生安全本地 telemetry/handoff refs |
| next_allowed_action | 创建 Step 16 测试切口与最小验证清单 |

本步只定义代码埋点切口、字段边界和业务审计分层，不定义告警阈值、SLO、后端、保留期、pager、runbook 或 evidence verdict。

## 2. 总原则

| 场景 | Runner 口径 |
|---|---|
| accepted local truth | 在同一语义 UoW 内写 local trace/history/result/marker；运行日志和指标只做定位，不替代 audit |
| rejected/blocked/unsupported | 写 redacted error log/metric/issue/report；不得伪造成 accepted truth/audit/evidence |
| duplicate replay | 写 replay log/metric；不新增业务 transition、owner call、outbox 或 audit truth |
| Query | 可写 runtime log/metric；不得写 idempotency、projection repair、audit、refresh 或 reconciliation |
| external effect unknown | 记录 Unknown/recovery correlation；不写 success/evidence，不重放 |
| handoff | 只记录 local marker/receipt refs；不保存 L4 observability/archive/GRC body |

## 3. 日志埋点表

| 位置 | 级别 | 必填安全字段 | 目的 |
|---|---|---|---|
| command entry/validation | info/warn | trace context ref、command kind、actor/scope ref、request ref、error kind、key fingerprint | 追踪入口与拒绝 |
| idempotency reserve/duplicate/conflict | debug/info/warn | operation kind、key hash、reservation state、result ref/issue ref | 证明 duplicate 无副作用 |
| command accepted/rejected/unknown | info/warn | subject ref、from/to local state、result/recovery ref、duration | 区分本地结果与 owner truth |
| Query completion/denied/degraded | debug/info/warn | query kind、surface/freshness/visibility、subject ref、duration | 解释 safe read surface |
| repository/UoW | debug/error | repository kind、operation、expected version、UoW phase、diagnostic ref | 定位 version/commit/rollback failure |
| adapter/readiness | info/warn | adapter slot/kind、availability marker、issue ref、checked-at | 说明 blocked/unavailable，不泄露 endpoint |
| Consumer header/readiness | info/warn | consumer kind、source family/schema、event ref、dedup hash、disposition | 证明 header-first negative path |
| Job entry/claim/checkpoint/report | info/warn/error | job kind/run ref、claim/checkpoint/report ref、disposition、counts | 追踪本地 job，不等 owner success |
| projection/read-section refresh | info/warn | section kind/ref、generation、source cursor、conflict/failed ref | 解释 stale/degraded/guard conflict |
| diagnostic/redaction/handoff | info/warn | diagnosis/handoff ref、target ref、redaction posture、receipt/failure ref | 追踪安全摘要和交接 |
| config/builder | warn/error | config source ref、section、slot、validation issue ref、builder state | 定位 config/readiness failure |

### 3.1 日志字段边界

- `idempotency_key`、dedup key 只能记录 one-way hash/fingerprint；不得记录原值。
- 可记录 typed refs、kind、state、counts、duration、safe source/version refs；不得记录 raw request/query/event body、adapter response、URL、token、secret、host path、PID/port/socket、stack trace。
- 日志中的 `diagnostic_ref` 必须指向已 redacted 的 safe issue；不能把异常字符串直接作为业务 reason。
- local log 不是 formal audit/evidence/report/verdict/signoff。

## 4. 指标埋点表

| 指标 | 类型 | 打点位置 | 低基数标签 |
|---|---|---|---|
| `runner_command_total` | counter | command handler result | command kind、outcome category |
| `runner_command_duration` | histogram | command completion | command kind、outcome category |
| `runner_query_total` / duration | counter/histogram | Query handler | query kind、surface category |
| `runner_idempotency_total` | counter | reserve/duplicate/conflict | operation kind、reservation category |
| `runner_repository_conflict_total` | counter | repository save | repository kind、conflict category |
| `runner_uow_total` / duration | counter/histogram | UoW begin/commit/unknown | operation family、terminal category |
| `runner_adapter_availability` | gauge | builder/readiness checks | adapter slot/kind、availability state |
| `runner_consumer_total` | counter | header/readiness result | consumer kind、disposition |
| `runner_job_total` / duration | counter/histogram | job report | job kind、disposition |
| `runner_recovery_case_total` | counter | Unknown/open/manual review | recovery kind、state |
| `runner_projection_freshness_total` | counter | stale/rebuild/replace | section kind、freshness outcome |
| `runner_handoff_total` | counter | handoff marker/receipt | handoff kind、outcome |
| `runner_redaction_total` | counter | preview/diagnosis/handoff | redaction outcome |

Metric labels must not contain actor/subject/request/result/projection/trace IDs, free text, raw URL/topic/SQL/HTTP body, or secret. High-cardinality lookup belongs in structured logs, trace refs or reports, not metric labels.

## 5. 业务审计 / trace / marker 表

| 事件/记录 | 触发位置 | 记录字段 | 归属与边界 |
|---|---|---|---|
| local selection/material truth change | C01～C06/J01 | local object ref、from/to state、generation、reason、result/trace ref | Runner local trace/history；不改 Release/Artifact |
| local run/control intent change | C07～C09/J03 | intent/control ref、kind、basis、from/to、owner receipt/result ref | Runner local trace；不等 Running/Cleaned |
| recovery case change | C07～C11/J03 | case ref、subject/basis、from/to local recovery state、diagnostic ref | local recovery audit；不等 owner resolution |
| bounded preview/diagnosis/handoff | J04/C11 | preview/diagnosis/handoff ref、redaction posture、target/receipt ref | local safe record；不等 evidence/report |
| Consumer negative receipt | E01～E04 | source/schema/event/dedup safe header、disposition、result ref | body-free worker receipt；不写 owner cursor |
| Job state/report | J01～J05 | job/claim/checkpoint/report refs、counts、disposition | local operations record；不等 business success |
| projection freshness/replacement | J05 | section/projection ref、generation/version、from/to freshness、reason | derived local audit；Query 不写 |
| config/builder/adapter marker | infra | config section/slot、marker state、issue ref | infra observability；不写 domain truth |

Accepted local transition and its required trace/history/result/marker must be committed according to Step 11. Rejected, blocked, unsupported, duplicate and failed paths may have operational log/metric/report, but never an accepted business trace or outbound event. Runner has zero outbound event flow.

## 6. Trace/span cuts

| Span | Start | Required fields | End |
|---|---|---|---|
| `runner.command` | command entry | command kind、request/actor/scope refs、trace context、key hash | typed command outcome |
| `runner.query` | query entry | query kind、subject/scope、trace context | safe query surface |
| `runner.consumer` | header inspection | consumer/source/schema/event refs | receipt/disposition |
| `runner.job` | job dispatch | job kind/run/key hash | report/result |
| `runner.repository` / `runner.uow` | repository/UoW call | operation/repository kind、expected version | result/commit/rollback/unknown |
| `runner.adapter` | semantic port call | adapter slot/kind、safe source ref | safe outcome/blocked/unknown |
| `runner.projection` | section refresh | section/generation/source cursor | guarded replace/conflict |
| `runner.handoff` | handoff request | handoff kind/target/trace count | marker/receipt/failure |

Trace context must come from command/query/consumer/job metadata; domain must not invent a replacement context. Runtime span data is not a `RunnerTraceRecord` and neither is formal L4 audit evidence.

## 7. Redaction / forbidden-field 表

| 载体 | 允许 | 永久禁止 |
|---|---|---|
| logs | safe refs/kinds/states/counts/duration/diagnostic refs | raw body、secret、credential、token、URL、host path、stack |
| metrics | low-cardinality categories | IDs、free text、raw endpoint/topic/SQL/body |
| local trace/history | local refs、actor ref、from/to、reason ref、source version | external body、raw logs、evidence/verdict body |
| stored result/job report | safe public surface、bounded refs/counts | payload dump、adapter response、package/document body |
| consumer receipt | trusted header fields、disposition、issue/result refs | unsupported payload bytes、owner cursor |
| handoff marker | trace/target/package/receipt refs | observability/archive/GRC package body |
| config issue | source/section/slot/redacted issue | complete config、secret、credential、raw URL/topic |

## 8. Flow 观测闭环矩阵

| Flow family | 必须观测 | 禁止副作用 |
|---|---|---|
| 11 Command | entry、validation、idempotency、local transition、result/recovery | rejection/duplicate 不写 accepted trace；不升 owner truth |
| 12 Query | read/visibility/freshness/duration | reserve/save/refresh/reconcile/job dispatch |
| 4 Consumer | header/readiness/disposition/receipt | parse/hash/store payload、owner cursor、positive ACK |
| 5 Job | entry/claim/checkpoint/report/duplicate | auto reclaim/replay、owner mutation、evidence generation |
| J05/read sections | generation/version conflict/stale | Query replacement、missing identity upsert |
| diagnostics/handoff | redaction and safe refs | raw stdout/stderr/log/package body |

## 9. Step 16 handoff

Step 16 must turn these tables into future test cuts for: no-raw-field assertions, low-cardinality metric checks, accepted/rejected audit separation, duplicate zero-side-effect, Query no-write, Unknown/recovery correlation, generation conflict, consumer header-only and job report mappings. No test result is claimed here.

## 10. Cross-step closure audit

| 审计项 | 结论 |
|---|---|
| logs cover command/query/consumer/job/repository/adapter/config | pass |
| metrics have low-cardinality labels | pass |
| accepted vs rejected audit separation | pass |
| trace context and handoff refs | pass for semantic contract |
| raw body/secret/path forbidden | pass |
| L4 observability truth boundary | pass; Runner does not own it |
| exact telemetry backend/retention/SLO | blocked/pending, intentionally not selected |

## 11. Step 15 完成条件

| 条件 | 结论 |
|---|---|
| 日志埋点表 | completed |
| 指标埋点表 | completed |
| 审计事件/marker 规则 | completed |
| trace/redaction/forbidden boundary | completed |
| 运维阈值/backend/runbook | excluded and pending downstream docs |
| next gate | `pass_for_step_16` |

Step 15 完成。本文不证明 telemetry backend、审计证据、报告、测试或 readiness 存在。
