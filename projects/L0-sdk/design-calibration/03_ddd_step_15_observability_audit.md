# Step 15. 定义可观测性与审计埋点契约

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 15 中间产物。
> 本步只收稳 SDK 代码中必须记录的日志、指标、trace 和审计 / evidence 切口。
> 本步不写告警阈值、dashboard、日志保留周期或运维 runbook。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15
- 回填章节：`projects/L0-sdk/03-详细设计.md` §14 可观测性与审计埋点契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` 横切关注点 | trace、error mapping、redaction、credential、freshness、compatibility、candidate evidence | 固定观测字段红线 |
| `02-概要设计.md` §5 / §8 / §10 / §11 | SDK 不保存服务端 truth，不保存 raw body / secret，fake 不能伪装生产成功 | 固定日志、审计和 evidence 禁止字段 |
| Step 8 协议契约 | Command、Query、Inbound Event、Outbound Event、Operations Job 的 DTO 和错误模型 | 固定入口和操作名 |
| Step 9 函数级处理流 | 每个 flow 的事务、boundary、outbox、projection 和 evidence 副作用 | 固定埋点位置 |
| Step 12 错误与恢复 | validation、not found、conflict、dependency、boundary violation、internal 分类 | 固定日志级别和错误字段 |
| Step 13 并发与幂等 | replay、conflict、duplicate event、job 重跑、outbox 重放 | 固定重复调用观测切口 |
| Step 14 配置与依赖 | runtime builder、formal / fake / bus boundary、runner、artifact、projection、outbox | 固定 adapter 失败观测切口 |

已确认结论：

```text
SDK 的日志用于排错，指标用于统计，审计 / evidence 用于证明 SDK 本地维护事实和验证事实。
runtime boundary 调用可以记录 boundary diagnostic / audit ref，但不得把服务端业务事实写成 SDK truth。
trace context 贯穿 client、cli、jobs、application service、adapter、outbox 和 evidence。
日志、指标、审计、evidence、diagnostic 均不得保存 raw request body、raw response body、payload body、token 或 raw secret。
```

---

## 3. SOP 问题回答

### 3.1 哪些处理流必须记录审计？

| 处理流 | 审计 / evidence 要求 | 说明 |
|---|---|---|
| `UpdateSdkSemanticBaselineFlow` | 必须 | 更新 SDK 官方语义基线，是本地 truth 变化 |
| `RefreshDerivedBindingViewFlow` | 必须 | 刷新 core / bus / formal API 派生视图和 freshness |
| `InvokeServiceCapabilityFlow` | 记录 boundary diagnostic / access audit | 不写服务端 truth，只保存调用引用、trace 和脱敏错误 |
| `PublishBusEventFlow` | 记录 boundary diagnostic / publish ref | 不生成 bus publication / delivery truth |
| `RecordCompatibilityDecisionFlow` | 必须 | 形成 compatibility decision 和 migration ref |
| `DeprecateSdkApiFlow` | 必须 | 形成 deprecated API lifecycle 事实 |
| 4 个 inbound event consumer | 必须 | 上游变化、bus semantic、formal API、validation finished 会改变 freshness / evidence |
| 6 个 outbound event publish | 必须记录 publish evidence | 发布 SDK 已提交维护事实，失败可重放 |
| 8 个 operations job | 必须 | candidate、artifact、smoke、docs、compatibility、boundary、projection 均需证据 |
| Query read-only flow | 普通查询只打日志 / 指标；敏感 evidence / compatibility / deprecated 查询可留 access audit | Query 不改写真相 |

### 3.2 哪些错误分支必须记录日志？

| 错误分支 | 日志级别 | 记录目的 |
|---|---|---|
| validation error / not found | `warn` 或 `info` | 定位调用方输入、ref 或视图缺失 |
| idempotency replay | `info` | 说明重复请求返回既有结果 |
| idempotency conflict / expected version conflict | `warn` | 定位并发写或同 key 不同 payload |
| boundary violation | `warn` / `error` | raw body、secret、fake success、unredacted evidence 是安全边界 |
| formal API / fake / bus boundary unavailable | `warn` | 外部边界不可用，不写 SDK truth |
| runner unavailable / package builder failed | `error` | 运行环境失败，区别于验证不通过 |
| verification failed / docs failed / compatibility breaking | `info` / `warn` | 这是已记录业务结果，不一定是系统故障 |
| repository / projection / artifact / outbox failure | `error` | 本地状态保存、证据或发布失败 |
| internal invariant broken | `error` | 需要人工排查 diagnostic ref |

### 3.3 哪些关键路径需要指标？

| 关键路径 | 指标目的 |
|---|---|
| Command API | 统计写路径成功、失败、冲突、重放和耗时 |
| Query API | 统计只读视图命中、stale、not found 和耗时 |
| runtime boundary | 统计 formal / fake / bus 调用结果、fake marker 缺失和边界失败 |
| inbound event consumer | 统计上游变化、重复事件、拒绝事件和处理耗时 |
| outbound event publisher | 统计 SDK outbox 发布成功、失败、重放和积压 |
| operations job | 统计 candidate、build、smoke、docs、compatibility、boundary、projection 的结果 |
| evidence / compatibility | 统计 passed / failed / skipped / unredacted / breaking / migration required |
| repository / artifact / projection | 统计存储错误、版本冲突和 projection stale |

### 3.4 日志、指标、审计字段分别记录什么？

| 类型 | 必须字段 | 禁止字段 |
|---|---|---|
| 日志 | `trace_id`、`request_id`、`operation`、`actor_ref`、`resource_ref`、`status`、`error_code`、`diagnostic_ref`、`duration_ms` | raw request / response body、payload body、token、raw secret、外部返回全文 |
| 指标 | `operation`、`result`、`error_category`、`boundary_kind`、`job_kind`、`evidence_kind` | 高基数字段、用户正文、secret ref 明文、payload digest 全量 |
| 审计 / evidence | `audit_id`、`trace_ref`、`actor_ref`、`subject_ref`、`before_ref`、`after_ref`、`evidence_ref`、`occurred_at` | 原始正文、凭据、生产请求响应正文、服务端业务事实正文 |

### 3.5 哪些监控和告警细节应留给运维手册？

| 留给运维手册的内容 | 本步只定义什么 |
|---|---|
| 告警阈值、SLO、dashboard | 指标名、类型、位置和标签 |
| 日志采集系统、保留周期、索引策略 | 日志字段和禁止字段 |
| 事故响应流程和值班 runbook | 哪些错误必须产生 diagnostic ref |
| 生产 formal API / bus endpoint 健康阈值 | boundary 调用指标和失败日志 |
| candidate 发布门禁人工流程 | evidence / compatibility 事实与状态，不定义审批流程 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 / 9 已定义很多 evidence 和 outbox 副作用，但未集中到观测表 | 实现者可能只返回错误，不保存可追溯材料 | 本步输出日志、指标、审计 / evidence 三张表 |
| runtime boundary 不写 SDK truth，容易被误解为不需要观测 | formal / fake / bus 调用失败难以定位 | 本步定义 boundary diagnostic / access audit |
| 验证失败和 runner 不可用容易混淆 | 可能把 failed evidence 当系统故障，或把 runner failure 当 failed evidence | 本步区分业务验证结果和依赖失败 |
| fake / fixture 和 redaction 是一票否决边界 | 日志或 evidence 可能泄露正文或误标 production success | 本步明确所有观测材料的禁止字段 |
| 指标标签若包含 record id / payload digest 会高基数或泄露 | 观测系统不可用且有安全风险 | 本步限制指标只用低基数标签 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 日志 | 错误章节只说明需要 diagnostic ref | 明确每类入口、错误和 boundary 的日志级别与字段 |
| 指标 | 架构层要求可观察 | 明确 command、query、boundary、event、job、outbox、evidence 的指标 |
| 审计 / evidence | 分散在 candidate、compatibility、outbox、projection 中 | 汇总为审计事件表，固定触发位置和字段 |
| 安全边界 | redaction / credential 分散在 policy 和 error 中 | 统一约束日志、指标、审计、evidence、diagnostic 禁止字段 |
| 运维边界 | 容易写成告警方案 | 本步只写代码埋点切口，阈值和 runbook 后移 |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| runtime boundary 是否写审计 | 完全不记录 | 记录 boundary diagnostic / access audit，不写服务端 truth | B | 能排查调用问题，同时不越过服务端 truth 边界 |
| 验证失败是否记 error 日志 | 全部 error | failed / skipped evidence 记 info / warn；runner unavailable 记 error | B | 业务验证失败和运行故障语义不同 |
| 指标标签是否包含资源 id | 包含完整 id | 只用低基数标签，单记录走 trace / audit | B | 避免高基数和敏感信息泄露 |
| 审计是否保存正文 | 保存完整上下文 | 只保存 ref、状态、结果和脱敏 evidence | B | 符合 SDK 不保存 raw body / secret 的边界 |
| 是否在本步定义告警阈值 | 定义 | 不定义，留给运维手册 | B | Step 15 是实现埋点契约，不是运维方案 |

---

## 7. 结构化中间产物

### 7.1 可观测性与审计边界图

```text
Client / CLI / Event / Job entry
  |
  | trace_id / request_id / actor_ref
  v
Application service
  |
  +-- structured logs -----------> runtime log sink
  +-- metrics -------------------> metrics collector
  +-- audit / evidence ----------> SDK repositories / artifact refs
  +-- diagnostic refs -----------> safe diagnostic store
  |
  v
Adapters / boundaries / runners
  |
  +-- boundary result refs
  +-- runner result refs
  +-- publish evidence refs
```

关键说明：

- trace 贯穿入口、application service、adapter、runner、outbox 和 evidence。
- 审计 / evidence 只证明 SDK 本地维护事实、验证事实和边界调用引用。
- formal API 和 bus 的业务 truth 不进入 SDK 审计事实。
- 所有观测材料都不得保存 raw body、payload body、token 或 raw secret。

### 7.2 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| Command 入口开始 / 结束 | `info` | `trace_id`、`request_id`、`operation`、`actor_ref`、`status`、`duration_ms` | 追踪写请求 |
| Query 入口结束 | `debug` / `info` | `trace_id`、`request_id`、`query`、`result`、`consistency_marker` | 追踪读面状态 |
| Inbound Event consumer | `info` | `trace_id`、`event_id`、`source_ref`、`operation`、`result` | 追踪上游变化消费 |
| Operations Job item | `info` | `trace_id`、`job_run_id`、`job_kind`、`item_ref`、`result`、`duration_ms` | 追踪后台任务 |
| Idempotency replay | `info` | `trace_id`、`operation`、`idempotency_scope`、`result_ref` | 说明重复请求复用结果 |
| Idempotency / version conflict | `warn` | `trace_id`、`operation`、`resource_ref`、`error_code` | 排查并发和重复输入 |
| Boundary violation | `warn` / `error` | `trace_id`、`operation`、`boundary_kind`、`error_code`、`diagnostic_ref` | 排查 forbidden body、secret、fake success |
| Formal / fake / bus boundary failure | `warn` | `trace_id`、`operation`、`boundary_kind`、`retryable`、`diagnostic_ref` | 排查运行期边界不可用 |
| Runner unavailable / builder failed | `error` | `trace_id`、`job_kind`、`runner_kind`、`error_code`、`diagnostic_ref` | 排查工具链失败 |
| Verification failed / skipped | `info` / `warn` | `trace_id`、`candidate_id`、`evidence_kind`、`result`、`evidence_ref` | 记录验证业务结果 |
| Outbox publish success / failure | `info` / `warn` | `trace_id`、`outbox_event_id`、`event_kind`、`result`、`diagnostic_ref` | 追踪事件发布和重放 |
| Repository / projection / artifact failure | `error` | `trace_id`、`operation`、`store_kind`、`error_code`、`retryable` | 排查本地状态写失败 |
| Config validation rejected | `error` | `operation`、`config_source_ref`、`error_code`、`diagnostic_ref` | 防止配置绕过红线 |

### 7.3 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `sdk_command_total` | counter | Command 完成时 | `operation`, `result` |
| `sdk_command_latency_ms` | histogram | Command 完成时 | `operation`, `result` |
| `sdk_query_total` | counter | Query 完成时 | `query`, `result` |
| `sdk_query_latency_ms` | histogram | Query 完成时 | `query`, `result` |
| `sdk_boundary_call_total` | counter | formal / fake / bus boundary 返回后 | `boundary_kind`, `operation`, `result` |
| `sdk_boundary_latency_ms` | histogram | boundary 返回后 | `boundary_kind`, `operation`, `result` |
| `sdk_inbound_event_total` | counter | consumer 完成时 | `event_kind`, `result` |
| `sdk_outbox_publish_total` | counter | outbox publish 完成时 | `event_kind`, `result` |
| `sdk_outbox_pending_total` | gauge | publisher poll 时 | `event_kind` |
| `sdk_job_total` | counter | job item 完成时 | `job_kind`, `result` |
| `sdk_job_latency_ms` | histogram | job item 完成时 | `job_kind`, `result` |
| `sdk_evidence_total` | counter | evidence 保存后 | `evidence_kind`, `result`, `redaction_status` |
| `sdk_compatibility_decision_total` | counter | decision 保存后 | `decision_state` |
| `sdk_candidate_status_total` | counter | candidate 状态变化后 | `from_status`, `to_status` |
| `sdk_idempotency_total` | counter | 幂等检查后 | `operation`, `result=miss/hit/conflict` |
| `sdk_projection_stale_total` | gauge | freshness / rebuild 更新时 | `projection_kind`, `freshness_state` |
| `sdk_repository_error_total` | counter | repository / artifact / projection error | `store_kind`, `error_category` |

### 7.4 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `SdkSemanticBaselineUpdatedAudit` | `UpdateSdkSemanticBaselineFlow` 提交后 | `audit_id`、`trace_ref`、`actor_ref`、`baseline_id`、`before_ref`、`after_ref` | maintainer、docs、compatibility |
| `DerivedBindingViewRefreshedAudit` | `RefreshDerivedBindingViewFlow` 提交后 | `audit_id`、`trace_ref`、`source_refs`、`view_ref`、`freshness_state` | candidate、reports、maintainer |
| `ServiceBoundaryCallRecordedAudit` | `InvokeServiceCapabilityFlow` 返回后 | `audit_id`、`trace_ref`、`capability_ref`、`boundary_kind`、`result_ref`、`diagnostic_ref` | maintainer、support |
| `BusEventBoundaryCallRecordedAudit` | `PublishBusEventFlow` 返回后 | `audit_id`、`trace_ref`、`event_mapping_ref`、`boundary_result_ref`、`diagnostic_ref` | maintainer、support |
| `CompatibilityDecisionRecordedAudit` | `RecordCompatibilityDecisionFlow` 提交后 | `audit_id`、`trace_ref`、`candidate_id`、`decision_state`、`evidence_refs`、`migration_ref` | release review、docs |
| `DeprecatedApiRecordedAudit` | `DeprecateSdkApiFlow` 提交后 | `audit_id`、`trace_ref`、`api_ref`、`from_state`、`to_state`、`migration_ref` | docs、downstream consumers |
| `UpstreamChangeConsumedAudit` | core / bus / formal API consumer 提交后 | `audit_id`、`trace_ref`、`event_id`、`source_ref`、`affected_view_refs` | freshness job、maintainer |
| `ValidationEvidenceRecordedAudit` | validation event / runner 提交后 | `audit_id`、`trace_ref`、`candidate_id`、`evidence_kind`、`result`、`redaction_status`、`artifact_ref` | candidate gate、reports |
| `PackageCandidateGeneratedAudit` | candidate 生成提交后 | `audit_id`、`trace_ref`、`candidate_id`、`baseline_ref`、`language_set` | smoke/docs/compatibility jobs |
| `PackageArtifactAttachedAudit` | package build 成功提交后 | `audit_id`、`trace_ref`、`candidate_id`、`artifact_ref`、`digest_ref` | validation jobs、reports |
| `BoundaryPolicyVerifiedAudit` | boundary policy job 提交后 | `audit_id`、`trace_ref`、`candidate_id`、`evidence_ref`、`result` | release review、security review |
| `SdkOutboxPublishedAudit` | outbound event publish 标记后 | `audit_id`、`trace_ref`、`outbox_event_id`、`event_kind`、`publish_status` | automation、reports |
| `ProjectionRebuiltAudit` | projection rebuild 提交后 | `audit_id`、`trace_ref`、`projection_kind`、`rebuild_scope`、`watermark` | query、reports |
| `BoundaryViolationAudit` | redaction / credential / fake success 违规拒绝后 | `audit_id`、`trace_ref`、`operation`、`subject_ref`、`reason_code`、`diagnostic_ref` | security review、maintainer |

### 7.5 观测字段禁止表

| 材料类型 | 允许字段 | 禁止字段 |
|---|---|---|
| 日志 | stable refs、status、error_code、diagnostic_ref、duration | raw request body、raw response body、payload body、token、raw secret |
| 指标 | low-cardinality status / kind / category | resource id、payload digest 全量、secret ref、自由文本 |
| 审计 / evidence | subject ref、actor ref、trace ref、state、result、artifact ref | 服务端业务正文、生产请求响应正文、raw credential |
| diagnostic | safe summary、error_code、supporting refs | forbidden body、backend private body、unredacted evidence |

---

## 8. 回填草稿

正式 `03-详细设计.md` §14 建议按以下结构回填：

```text
14. 可观测性与审计埋点契约
  14.1 可观测性与审计边界图
  14.2 日志埋点表
  14.3 指标埋点表
  14.4 审计事件表
  14.5 观测字段禁止表
```

回填来源：

| 正式章节 | 回填来源 |
|---|---|
| §14.1 | 本文件 §7.1 |
| §14.2 | 本文件 §7.2 |
| §14.3 | 本文件 §7.3 |
| §14.4 | 本文件 §7.4 |
| §14.5 | 本文件 §7.5 |

如果正式文档完全引用本文件 §7 的表格和图，Step 19 直接摘录即可，本节不重复粘贴。

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| runtime boundary 调用是否写 SDK 审计 | A. 不记录；B. 记录 boundary diagnostic / access audit | B | 不写服务端 truth，但需要定位 SDK 调用问题 | 已按 B 写入 |
| verification failed 是否算 error 日志 | A. 全部 error；B. failed evidence 为 info / warn，runner unavailable 为 error | B | 验证失败是业务事实，runner 不可用是依赖故障 | 已按 B 写入 |
| 指标是否允许资源 id 标签 | A. 允许；B. 禁止，高基数定位走 trace / audit | B | 避免观测系统高基数和敏感信息泄露 | 已按 B 写入 |
| 审计是否保存请求 / 响应正文 | A. 保存；B. 只保存引用和脱敏 evidence | B | 符合 redaction、credential 和服务端 truth 边界 | 已按 B 写入 |

---

## 10. 进入下一步条件

进入 Step 16 前必须满足：

- 实现者知道在 Command、Query、Event、Job、boundary、runner、outbox、projection 的哪些位置打日志、指标和审计。
- 日志、指标、审计 / evidence、diagnostic 的字段边界和禁止字段已经明确。
- runtime boundary 的观测不会被误写成服务端业务 truth。
- 告警阈值、dashboard、日志保留和值班流程已明确留给运维手册。
- 可以进入 Step 16 “定义测试切口与最小验证清单”。
