# Step 15. 定义可观测性与审计埋点契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 15
- 回填章节:`03-详细设计.md` §5.14 可观测性与审计埋点契约 / §11 错误恢复

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` | Work 是 Project / WorkItem / Iteration truth center,observability / archive 是外部交接边界 | 固定审计归属和 handoff 边界 |
| `02-概要设计.md` | outbox、trace、archive handoff、reference / projection degraded surface | 固定观测对象和降级状态 |
| `03_ddd_step_06_object_contracts.md` | `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、`TraceHandoffMarker`、`ArchiveHandoffMarker` | 固定审计事件可写对象 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `AuditRepository`、`WorkOutboxRepository`、`TraceHandoffPort`、`ArchiveHandoffPort`、`IdempotencyRepository` | 固定 port / adapter 打点位置 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Inbound Event / Outbound Event / Job 的协议审计要求 | 固定入口类别和字段来源 |
| `03_ddd_step_09_function_flows.md` | 写路径 UoW、audit、outbox、projection stale、consumer、publish、handoff 处理顺序 | 固定日志、指标、审计触发点 |
| `03_ddd_step_12_error_recovery.md` | 错误分类、审计 / outbox / marker 规则 | 固定失败分支是否写业务审计 |
| `03_ddd_step_13_concurrency_idempotency.md` | duplicate、conflict、commit unknown、job rerun | 固定重入和幂等观测切口 |
| `03_ddd_step_14_config_external_binding.md` | runtime config、外部 adapter、handoff、outbox、projection 绑定 | 固定外部依赖失败和配置边界日志 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 15.1 | 文件骨架、SOP 问题回答、当前文档问题诊断 | [x] |
| 15.2 | 日志埋点表、指标埋点表 | [x] |
| 15.3 | 审计事件表、字段边界、trace / handoff 口径 | [x] |
| 15.4 | 回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 哪些处理流必须记录审计?

   回答:accepted business truth change 必须写 `WorkTraceRecord` 和 `WorkAuditTrail`,并 enqueue `WorkOutboxRecord`。Inbound Event 只在写本地 snapshot / reference state / pending intake 时写本地 trace 或 marker。Operations Job 写 projection / reference / outbox / handoff marker 时记录 job report 或 marker ref。Query 不写业务 audit。

2. 哪些错误分支必须记录日志?

   回答:invalid request、domain reject、not visible、not found、version conflict、idempotency duplicate / conflict、resolver failure、consumer dead-letter、outbox publish failure、projection rebuild failure、reference refresh failure、handoff failure、commit status unknown、config validation reject 都必须有结构化日志。

3. 哪些关键路径需要指标?

   回答:Command、Query、Inbound Event Consumer、Outbound Publisher、Operations Job、repository / UoW、idempotency、projection、reference resolver、handoff 和 config validation 都需要计数和耗时指标。指标标签只使用低基数类别,不使用 record id、actor profile、digest 全量或自由文本。

4. 日志、指标、审计字段分别记录什么?

   回答:日志记录 `trace_context_ref`、`request_id`、`operation`、`actor_ref`、`subject_ref`、`status`、`error_kind`、`result_ref`、`duration_ms` 和 safe diagnostic ref。指标记录 operation / result / error_kind / view_kind / job_kind / adapter_kind 等低基数标签。审计记录 trace、actor、subject、from / to state、reason、result、outbox / marker / handoff refs。

5. 哪些监控和告警细节应留给运维手册?

   回答:告警阈值、SLO、dashboard、日志采集和保留周期、值班 runbook、人工恢复步骤、生产 adapter endpoint 健康阈值留给运维手册或配置设计。本 Step 只定义代码必须暴露的日志、指标和审计切口。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 8 协议审计矩阵 | 已说明 Command / Query / Event / Job 的审计要求,但未给具体日志和指标字段 | 本 Step 给出三张实现表 |
| Step 9 flow | 每条写路径有 audit / outbox / projection stale,但实现者仍可能漏打点 | 本 Step 固定 handler、service、repository、publisher、job 的观测位置 |
| Step 12 错误恢复 | 已区分是否写 audit / outbox / marker,但未固定日志级别和指标 | 本 Step 把错误类别映射到日志和指标 |
| Step 13 commit unknown | 已定义只读幂等审计,但未给观测切口 | 本 Step 增加 commit unknown 日志和指标 |
| Step 14 外部依赖 | adapter timeout / retry 由配置注入,但未给观测字段 | 本 Step 增加 resolver / publisher / handoff / config validation 打点 |
| Work trace / handoff | `WorkTraceRecord` 不替代 global observability body | 本 Step 明确只保存 refs / marker,不保存外部观测或归档正文 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 日志 | 错误章节只说要记录 runtime log / metric | 明确位置、级别、字段、目的 | 支撑 handler / service / adapter 实现 |
| 指标 | 只有需要可观察的方向 | 明确 counter / gauge / histogram 和标签 | 支撑后续实现和测试 |
| 审计 | 分散在 `WorkTraceRecord`、outbox、marker 和 protocol matrix | 统一为审计事件表 | 防止实现漏掉 trace / audit trail |
| Query | 已规定 no-write | 明确只打日志 / 指标,不写 audit / outbox / idempotency | 防止 query 触发副作用 |
| 外部依赖失败 | Step 14 只定义超时 / 重试绑定 | 增加 resolver / publisher / handoff failure 打点 | 支撑恢复定位 |
| 安全边界 | 不保存外部正文分散在对象和错误章节 | 统一日志、指标、审计、diagnostic 禁止字段 | 防止 debug log 泄露 |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 为所有入口新增独立 audit event store | 审计统一 | 会绕过 Step 7 / Step 11 既有 `AuditRepository` 契约 | 不采用 |
| 只依赖 runtime log,不写 `WorkTraceRecord` | 实现简单 | 无法证明 accepted business truth change | 不采用 |
| accepted truth change 写 `WorkTraceRecord` + `WorkAuditTrail` + outbox | 与 Step 6 / 7 / 9 一致 | 写路径需要更多对象 | 采用 |
| 所有 Query 写审计 | 追溯完整 | 破坏 query no-write,噪声高 | 不采用 |
| Query 只写日志 / 指标,trace 查询读取 `AuditRepository` | 保持只读 | 普通读审计不足 | 采用 |
| 指标标签包含资源 id | 定位方便 | 高基数且可能泄露 | 不采用 |
| 指标只用低基数标签,单记录定位走 trace / audit ref | 可稳定接入观测系统 | 需要日志和 trace 关联 | 采用 |

### 8. 结构化中间产物

#### 8.1 可观测性与审计总原则

| 规则 | 正式口径 |
|---|---|
| Command accepted | 已提交业务 truth change 必须写 `WorkTraceRecord`、更新 `WorkAuditTrail`、enqueue `WorkOutboxRecord`、记录日志和指标 |
| Command rejected | invalid / domain reject / visibility / not found / resolver reject 不写业务 trace / outbox,只写日志和指标 |
| Duplicate replay | same digest duplicate 返回 stored result,不新增业务 trace / outbox,写 replay 日志和幂等指标 |
| Idempotency conflict | 不写 business truth / trace / outbox,写 conflict 日志和指标;可按 Step 13 写 idempotency conflict marker |
| Query | 只读,不写 audit / outbox / idempotency / freshness marker;可记录 read log / metric |
| Inbound Event | 成功写本地 snapshot / reference state / pending intake 时记录本地 trace 或 marker;dead-letter 只写运行日志 / metric |
| Outbound Event | publisher 只发布 committed outbox;publish failure 只更新 publication failed marker,不产生新业务 outbox |
| Operations Job | 写 projection / reference / handoff marker 时记录 report / marker;job 不修 business truth |
| Handoff | Work 只保存 handoff ref / marker,不保存 observability log body 或 archive 长期正文 |
| Diagnostic | 只能保存 safe summary、stable error code、supporting refs,不得保存外部正文或 secret |

#### 8.2 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| Command handler 入口 / 完成 | `info` | `trace_context_ref`、`request_id`、`operation`、`actor_ref`、`status`、`duration_ms` | 追踪写请求生命周期 |
| Command envelope / metadata validation failed | `warn` | `trace_context_ref`、`request_id`、`operation`、`error_kind`、`diagnostic_ref` | 定位缺 actor / metadata / idempotency key / body |
| Command accepted truth change | `info` | `trace_context_ref`、`operation`、`actor_ref`、`subject_ref`、`trace_id`、`outbox_id`、`result_ref` | 关联 truth、audit、outbox 和 result |
| Domain rejected / not found / not visible | `warn` | `trace_context_ref`、`operation`、`actor_ref`、`subject_ref`、`error_kind`、`reason_ref` | 排查业务拒绝和访问边界 |
| Idempotency duplicate replay | `info` | `trace_context_ref`、`operation`、`idempotency_key_hash`、`result_ref` | 说明复用既有 result,没有重放 domain |
| Idempotency conflict / in-flight | `warn` | `trace_context_ref`、`operation`、`idempotency_key_hash`、`error_kind`、`diagnostic_ref` | 排查 same key different digest 或处理中请求 |
| Version / unique key conflict | `warn` | `trace_context_ref`、`operation`、`subject_ref`、`expected_version`、`error_kind` | 排查并发覆盖和唯一键冲突 |
| External resolver failure in command | `warn` | `trace_context_ref`、`operation`、`adapter_kind`、`external_ref`、`error_kind`、`retryable` | 解释 unresolved / temporarily unavailable |
| Query handler 完成 | `debug` / `info` | `trace_context_ref`、`request_id`、`query`、`actor_ref`、`surface`、`duration_ms` | 追踪读面命中、empty、stale、failed |
| Query not visible / degraded | `warn` | `trace_context_ref`、`query`、`actor_ref`、`subject_ref`、`surface`、`freshness_state` | 排查访问拒绝和 projection 降级 |
| Inbound consumer accepted | `info` | `trace_context_ref`、`consumer_event_key`、`event_topic`、`source_ref`、`result_ref` | 追踪上游事件消费成功 |
| Inbound consumer duplicate / dead-letter | `info` / `warn` | `trace_context_ref`、`consumer_event_key`、`event_topic`、`source_ref`、`disposition`、`error_kind` | 解释 redelivery 或不可接受事件 |
| Reference snapshot / refresh failed | `warn` / `error` | `trace_context_ref`、`reference_ref`、`adapter_kind`、`resolution_status`、`error_kind` | 解释 failed / unresolved marker |
| Outbox publish success | `info` | `trace_context_ref`、`outbox_id`、`event_kind`、`publication_ref`、`duration_ms` | 追踪发布成功 |
| Outbox publish failed / retry | `warn` / `error` | `trace_context_ref`、`outbox_id`、`event_kind`、`publication_state`、`error_kind`、`retryable` | 定位发布失败和重试 |
| Projection rebuild start / finish | `info` | `trace_context_ref`、`job_run_id`、`view_kind`、`source_cursor`、`freshness_state`、`duration_ms` | 追踪 projection 维护 |
| Projection rebuild failed / source gap | `warn` / `error` | `trace_context_ref`、`job_run_id`、`view_kind`、`source_cursor`、`error_kind`、`report_ref` | 解释 stale / failed read surface |
| Handoff delivered | `info` | `trace_context_ref`、`job_run_id`、`handoff_kind`、`handoff_ref`、`marker_ref`、`duration_ms` | 追踪 trace / archive handoff 成功 |
| Handoff failed | `warn` / `error` | `trace_context_ref`、`job_run_id`、`handoff_kind`、`target_ref`、`error_kind`、`report_ref` | 排查 handoff adapter 失败 |
| UnitOfWork commit unknown / rollback failed | `error` | `trace_context_ref`、`operation`、`idempotency_key_hash`、`error_kind`、`diagnostic_ref` | 触发幂等审计和 reconciliation |
| Operations job summary | `info` | `trace_context_ref`、`job_run_id`、`job_kind`、`result`、`item_count`、`failed_count`、`report_ref` | 记录批处理结果 |
| Config validation rejected | `error` | `config_source_ref`、`config_section`、`error_kind`、`diagnostic_ref` | 防止配置绕过架构和安全边界 |

#### 8.3 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `work_command_total` | counter | Command 完成时 | `operation`, `result`, `error_kind` |
| `work_command_duration_ms` | histogram | Command 完成时 | `operation`, `result` |
| `work_query_total` | counter | Query 完成时 | `query`, `surface`, `freshness_state` |
| `work_query_duration_ms` | histogram | Query 完成时 | `query`, `surface` |
| `work_idempotency_total` | counter | reserve / duplicate / complete / conflict 后 | `operation`, `result` |
| `work_version_conflict_total` | counter | repository version conflict 映射后 | `operation`, `resource_kind` |
| `work_inbound_event_total` | counter | consumer 完成时 | `event_topic`, `disposition` |
| `work_inbound_event_duration_ms` | histogram | consumer 完成时 | `event_topic`, `disposition` |
| `work_reference_resolution_total` | counter | resolver / refresh item 完成时 | `adapter_kind`, `result` |
| `work_reference_resolution_duration_ms` | histogram | resolver / refresh item 完成时 | `adapter_kind`, `result` |
| `work_outbox_pending_total` | gauge | outbox job list pending 后 | `event_kind`, `publication_state` |
| `work_outbox_publish_total` | counter | publish item 完成时 | `event_kind`, `result` |
| `work_outbox_publish_duration_ms` | histogram | publisher port 返回后 | `event_kind`, `result` |
| `work_projection_freshness_total` | gauge | freshness marker 保存后 | `view_kind`, `freshness_state` |
| `work_projection_rebuild_total` | counter | rebuild item 完成时 | `view_kind`, `result` |
| `work_projection_rebuild_duration_ms` | histogram | rebuild item 完成时 | `view_kind`, `result` |
| `work_handoff_total` | counter | trace / archive handoff item 完成时 | `handoff_kind`, `result` |
| `work_handoff_duration_ms` | histogram | handoff adapter 返回后 | `handoff_kind`, `result` |
| `work_job_total` | counter | Operations job 完成时 | `job_kind`, `result` |
| `work_job_duration_ms` | histogram | Operations job 完成时 | `job_kind`, `result` |
| `work_repository_error_total` | counter | repository / UoW error 返回时 | `repository_kind`, `error_kind` |
| `work_config_validation_total` | counter | runtime config validation 后 | `config_section`, `result` |

#### 8.4 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `ProjectCreatedAudit` | `CreateProjectFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`project_ref`、`backlog_ref`、`result_ref`、`outbox_id` | trace query / downstream reports |
| `ProjectLifecycleChangedAudit` | `UpdateProjectLifecycleFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`project_ref`、`from_state`、`to_state`、`reason_ref`、`outbox_id` | trace query / archive |
| `BacklogAvailabilityChangedAudit` | `UpdateBacklogAvailabilityFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`backlog_ref`、`from_state`、`to_state`、`reason_ref` | trace query / projection rebuild |
| `ProjectMemberAssignedAudit` | `AssignProjectMemberFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`project_member_ref`、`responsibility_state`、`snapshot_ref`、`outbox_id` | trace query / member reports |
| `ProjectMemberResponsibilityChangedAudit` | `UpdateProjectMemberResponsibilityFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`project_member_ref`、`from_state`、`to_state`、`reason_ref` | trace query / downstream |
| `WorkItemCreatedAudit` | `CreateWorkItemFlow` / `CreateChildWorkItemFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`formal_work_ref`、`backlog_ref`、`source_ref`、`result_ref`、`outbox_id` | trace query / workspace / archive |
| `WorkItemLifecycleChangedAudit` | `UpdateWorkItemLifecycleFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`formal_work_ref`、`from_state`、`to_state`、`reason_ref`、`evidence_ref` | trace query / downstream |
| `WorkPromotionRequestedAudit` | `RequestWorkPromotionFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`promote_result_ref`、`source_ref`、`reason_ref`、`outbox_id` | runtime / trace query |
| `WorkPromotionReviewedAudit` | `ReviewWorkPromotionFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`promote_result_ref`、`decision_state`、`created_work_ref`、`outbox_id` | runtime / archive / trace query |
| `WorkDependencyChangedAudit` | `LinkWorkDependencyFlow` / `UpdateWorkDependencyStateFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`dependency_ref`、`from_state`、`to_state`、`change_id`、`change_reason_kind`、`outbox_id` | trace query / governance |
| `WorkBlockerChangedAudit` | `OpenWorkBlockerFlow` / `ResolveWorkBlockerFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`blocker_ref`、`from_state`、`to_state`、`cause_ref`、`outbox_id` | trace query / governance |
| `IterationOpenedAudit` | `OpenIterationFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`iteration_ref`、`timebox_ref`、`from_state`、`to_state`、`outbox_id` | process / trace query |
| `IterationCommitmentChangedAudit` | `CommitIterationScopeFlow` / `UpdateIterationCommitmentFlow` 提交后 | `trace_id`、`trace_context_ref`、`actor_ref`、`iteration_ref`、`commitment_ref`、`changed_work_refs`、`change_id` | process / trace query |
| `InboundReferenceSnapshotChangedAudit` | inbound consumer 成功提交本地 snapshot / reference state 后 | `trace_id`、`trace_context_ref`、`consumer_event_key`、`event_topic`、`reference_ref`、`resolution_status`、`snapshot_ref` | operations / projection rebuild |
| `PendingPromoteIntakeRecordedAudit` | `ConsumeRuntimePromoteRequested` 成功提交后 | `trace_id`、`trace_context_ref`、`consumer_event_key`、`source_ref`、`pending_intake_ref` | promote service / operations |
| `OutboxPublishedAudit` | `PublishWorkOutbox` 标记 published 后 | `trace_id`、`trace_context_ref`、`outbox_id`、`event_kind`、`publication_ref`、`published_at` | operations / downstream |
| `OutboxPublicationFailedAudit` | `PublishWorkOutbox` 标记 failed 后 | `trace_id`、`trace_context_ref`、`outbox_id`、`event_kind`、`failure_reason`、`report_ref` | operations |
| `ProjectionFreshnessChangedAudit` | projection stale / rebuild marker 保存后 | `trace_id`、`trace_context_ref`、`view_ref`、`from_state`、`to_state`、`source_cursor`、`report_ref` | query service / operations |
| `ReferenceResolutionFailedAudit` | refresh job 保存 failed marker 后 | `trace_id`、`trace_context_ref`、`reference_ref`、`adapter_kind`、`failure_reason`、`last_successful_snapshot_ref` | operations / query surface |
| `TraceHandoffPreparedAudit` | `PrepareWorkTraceHandoff` 保存 marker 后 | `trace_id`、`trace_context_ref`、`subject_ref`、`handoff_ref`、`target_ref`、`marker_ref` | L4-observability / archive |
| `ArchiveHandoffPreparedAudit` | `PrepareArchiveHandoff` 保存 marker 后 | `trace_id`、`trace_context_ref`、`archive_scope`、`archive_ref`、`target_ref`、`marker_ref` | L4-archive / operations |
| `ReconciliationReportedAudit` | `RunWorkReconciliation` 生成 report 后 | `trace_id`、`trace_context_ref`、`job_run_id`、`scope_ref`、`report_ref`、`issue_count` | operations |
| `CommitStatusUnknownAudit` | UoW commit unknown 后的 idempotency audit | `trace_context_ref`、`operation`、`idempotency_key_hash`、`digest_match_state`、`result_ref`、`diagnostic_ref` | operations / reconciliation |

#### 8.5 观测字段边界

| 材料类型 | 允许字段 | 禁止字段 |
|---|---|---|
| 日志 | stable refs、operation、state、error kind、duration、safe diagnostic ref | 外部正文、raw request / response body、secret、token、credential、未脱敏 actor profile |
| 指标 | low-cardinality kind / status / result / error category | record id、payload digest 全量、actor id、free text、secret ref 明文 |
| WorkTraceRecord | `trace_id`、`subject_ref`、`trace_context_ref` | observability span body、archive package body、外部 source body |
| WorkAuditTrail | subject ref、trace record refs | 业务正文副本、外部正文、secret |
| Outbox event | committed truth ref、trace context、event kind、safe payload refs | 未提交 truth、debug dump、外部正文 |
| Diagnostic | stable error code、safe summary、supporting refs | HTTP body、resolver raw response、private profile、authorization rule internals |
| Handoff marker | handoff ref、target ref、covered trace / archive scope | observability log body、archive long-term body |

#### 8.6 Trace / handoff 绑定规则

```text
accepted truth change
  -> WorkTraceRecord::from_truth_change(...)
  -> AuditRepository.append_trace(...)
  -> WorkAuditTrail.append(...)
  -> WorkOutboxRecord::from_truth_change(...)
  -> WorkOutboxRepository.enqueue(...)

trace handoff job
  -> AuditRepository.list_trace_records(...)
  -> TraceHandoffPort.prepare_trace_handoff(...)
  -> TraceHandoffMarker::from_trace(...)
  -> AuditRepository.save_trace_handoff_marker(...)

archive handoff job
  -> truth repositories + AuditRepository list records
  -> ArchiveHandoffIntent::from_work_summaries(...)
  -> ArchiveHandoffPort.prepare_archive_handoff(...)
  -> ArchiveHandoffMarker::from_archive_ref(...)
  -> AuditRepository.save_archive_handoff_marker(...)
```

绑定规则:

- `trace_context_ref` 来自 core metadata,贯穿 command / query / event / job / outbox。
- `WorkTraceRecord` 是 Work 本地追溯事实,不是 L4 observability trace body。
- `TraceHandoffPort` 和 `ArchiveHandoffPort` 只返回 handoff ref,不得把外部长期正文写回 Work。
- `WorkTraceAvailable` outbox event 只能基于已保存 trace / handoff marker 构造。
- handoff failure 写 job report / marker 日志和指标,不新增 business truth outbox。

### 9. 前序契约回填记录

| 回填文件 | 回填内容 | 原因 |
|---|---|---|
| `03_ddd_calibration_flow.md` | Step 14 标为已完成,Step 15 标为待审核 | 反映当前进度 |
| `03_ddd_step_14_config_external_binding.md` | Step 状态改为已确认 | 用户已审核通过 Step 14 |

### 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_15_observability_audit.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“日志埋点表”“指标埋点表”“审计事件表”和“观测字段边界”小节。

#### 5.14 可观测性与审计埋点契约

L1-work 的可观测性契约只定义代码必须暴露的日志、指标、trace 和审计切口,不定义告警阈值、dashboard、日志采集系统、保留周期或运维处置流程。

accepted business truth change 必须写 `WorkTraceRecord`、更新 `WorkAuditTrail`、enqueue `WorkOutboxRecord`,并记录 structured log / metric。invalid request、domain reject、not visible、not found、idempotency conflict、version conflict、external resolver failure 不写业务 trace / outbox,只记录日志和指标。Query 是只读入口,不得写 audit、outbox、idempotency、freshness marker 或 reference state。

日志必须使用 `trace_context_ref`、`request_id`、`operation`、`actor_ref`、`subject_ref`、`status`、`error_kind`、`result_ref`、`duration_ms` 和 safe diagnostic ref 等字段。指标只允许 low-cardinality 标签,如 `operation`、`result`、`error_kind`、`view_kind`、`event_kind`、`job_kind`、`adapter_kind`。审计材料只保存 stable refs、state transition、reason 和 marker refs,不得保存外部正文、raw request / response body、secret、token、credential 或归档长期正文。

`TraceHandoffPort` 和 `ArchiveHandoffPort` 是外部交接边界。Work 只保存 handoff ref / marker,不持有 L4 observability log body 或 archive package body。

### 11. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD15-OPEN-001 | 具体 metric backend / log sink | 本 Step 不锁定产品 | 运维手册 / runtime adapter |
| DDD15-OPEN-002 | 告警阈值和 SLO | 本 Step 不定义 | 运维手册 |
| DDD15-OPEN-003 | safe diagnostic ref 的持久化位置 | 当前只定义禁止字段和引用口径 | 后续若需要 durable diagnostic store,需回 Step 7 / 11 补 port |

### 12. 进入下一步条件

- [x] 日志埋点表覆盖 command、query、consumer、outbox、projection、handoff、job、config validation。
- [x] 指标埋点表覆盖计数、耗时、gauge 和低基数标签。
- [x] 审计事件表覆盖 accepted truth change、inbound snapshot、outbox、projection、reference、handoff、reconciliation、commit unknown。
- [x] 明确 Query no-write,不写 audit / outbox / idempotency / freshness marker。
- [x] 明确日志、指标、审计、diagnostic 和 handoff marker 的禁止字段。
- [x] 明确本 Step 不写告警阈值、dashboard、日志保留周期或运维 runbook。
