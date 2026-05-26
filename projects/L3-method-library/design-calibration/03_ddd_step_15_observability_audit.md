# Step 15. 定义可观测性与审计埋点契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15
- 回填章节：`03-详细设计.md` §14 可观测性与审计埋点契约

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| 架构设计横切关注点 | 已确认本仓需要支撑审计追溯、可靠同步、outbox replay、下游 resync 和故障恢复 |
| Step 7 Port / Adapter 契约 | 已确认 `AuditRepository`、`LifecycleHistoryRepository`、`ObservabilityPort`、`OutboxRepository`、`JobRunRepository` 等 port |
| Step 8 协议契约 | 已确认所有请求携带 `request_id / trace_id / actor_ref`,Command / Job 携带幂等键,Query 默认不写 audit |
| Step 9 处理流 | 已确认 Command 写 audit/outbox/idempotency,Query 只读,outbox relay / inbound event / operations job 有独立处理流 |
| Step 11 事务与一致性 | 已确认业务状态变化、audit、outbox、idempotency 必须同事务提交 |
| Step 12 错误模型 | 已确认失败请求不写 lifecycle history/outbox,失败 audit 可选,但 structured log / metric 必须记录 |
| Step 13 并发幂等 | 已确认 idempotency conflict、revision conflict、outbox claim、checkpoint conflict、dry_run 写入禁止等需要可观察 |
| Step 14 配置绑定 | 已确认 observability backend 通过 `ObservabilityPort` 注入,失败默认不阻断业务 |

已确认结论：

```text
业务审计、结构化日志、指标是三类不同记录。
AuditRecord 记录业务事实,不能把失败请求伪造成状态变化事实。
Structured log 记录请求、异常、恢复和排障上下文。
Metric 记录聚合趋势、错误计数、延迟、队列积压和恢复进展。
Query 第一版默认不写 audit,只写日志/指标;GetDefinitionTrace 读取 audit 链,不新增 audit。
```

依赖的前序 Step：

```text
Step 1~14 已确认范围、协议、处理流、事务、错误、幂等和配置绑定。
```

---

## 3. SOP 问题回答

1. 哪些处理流必须记录审计？

   回答：所有成功改变业务状态或发布证据链的 P0 Command 必须写 `AuditRecord`:create/update/submit/publish/deprecate/retire/supersede。publish / supersede 还必须记录 gate、version、fingerprint、snapshot、outbox 相关字段。Seed job 如果实际创建或发布资产,必须通过 Command service 形成对应 audit。Query 不写 audit。失败 Command 的失败 audit 不是 P0 强制项,但必须有 structured log 和 metric。

2. 哪些错误分支必须记录日志？

   回答：Gateway context 缺失、DTO 校验失败、idempotency conflict、revision conflict、lifecycle illegal、boundary/reference/gate 失败、governance/object storage/database/bus 不可用、outbox dead-letter、inbound event malformed、checkpoint conflict、projection rebuild failed、job dry_run 写入禁止都必须记录结构化日志。日志必须带 `request_id`、`trace_id`、错误码、target ref 和可恢复性,不得记录 secret 或完整 payload。

3. 哪些关键路径需要指标？

   回答：API 请求量/延迟/错误、Command 成功/失败、publish/deprecate/retire/supersede 计数、outbox pending/backlog/retry/dead-letter、bus publish latency、snapshot build latency、governance validation latency、idempotency conflict、revision conflict、projection stale/rebuild、job run status、checkpoint advance、external dependency failure 都需要指标。

4. 日志、指标、审计字段分别记录什么？

   回答：日志记录排障上下文,字段包括 request_id、trace_id、actor_ref、operation、target、error_code、retryable、duration_ms、dependency 等。指标记录聚合维度,标签只保留低基数字段,例如 operation、kind、status、error_code、dependency。审计记录业务事实,字段包括 actor_ref、content_id、kind、action、from/to lifecycle、version、fingerprint、gate_ref、snapshot_ref、outbox_event_ref、reason、occurred_at。

5. 哪些监控和告警细节应留给运维手册？

   回答：告警阈值、SLO、日志采样率、指标采样窗口、仪表盘布局、pager 路由、dead-letter 人工处理流程、trace exporter、日志保留策略、敏感字段脱敏策略的具体落地、容量预估和 on-call runbook 留给运维手册或可观测性设计文档。本步只定义代码埋点切口。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` audit / outbox / trace 分散 | 审计字段、日志字段和指标字段混在不同章节 | 实现者容易把 audit 当普通日志,或遗漏指标 |
| Step 9 处理流 | 每个 flow 写了 audit/outbox/checkpoint,但没有集中定义日志和指标打点 | 难以形成统一埋点约定 |
| Step 12 错误模型 | 已区分业务 audit、failure audit/log/dead-letter,但未列具体代码位置 | 实现时可能只返回错误不记录排障上下文 |
| Step 13 并发幂等 | 并发冲突和重入保护已明确,但缺少对应 metric | 后续无法观察 retry、conflict、backlog 和 lease 恢复 |
| Step 14 配置 | ObservabilityPort 已绑定,但未定义哪些调用必须经过它 | Adapter 有了,埋点切口仍不完整 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 审计 | 分散在 Command 事务中 | 集中定义审计事件表 | 保证业务事实可追溯 |
| 日志 | 主要由错误分支自然语言描述 | 明确日志级别、字段和目的 | 支撑排障和错误定位 |
| 指标 | 缺少统一指标清单 | 明确计数、直方图、Gauge 类指标 | 支撑容量、可靠性和恢复观察 |
| Query | 只说不写 audit | 明确 Query 记录日志/指标,但不写 `AuditRecord` | 保持只读边界 |
| 失败处理 | 失败 audit 可选口径不够落地 | 强制 structured log / metric,失败 audit 后置可选 | 避免失败被写成业务状态事实 |
| 敏感字段 | 没有集中红线 | 明确 secret、完整 payload、raw idempotency key 不进日志/audit | 避免越过安全和隐私边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有请求都写 `AuditRecord` | 查询和失败都可追踪 | Query 产生写副作用,失败请求容易污染业务事实 | 不采用 |
| 只有日志,不做业务审计 | 实现简单 | 不能支撑 version/fingerprint/gate/outbox 的审计链 | 不采用 |
| 业务事实写 audit,异常和技术状态写 structured log / metric | 边界清晰,可审计也可排障 | 需要维护三类记录 | 采用 |
| 指标标签携带 content_id / actor_id | 定位具体对象方便 | 高基数,且可能暴露敏感上下文 | 不采用 |
| 指标标签只保留 operation/kind/status/error_code/dependency | 稳定且适合聚合 | 具体对象定位需查日志/trace | 采用 |
| observability 后端失败阻断业务 | 能确保日志都发出 | 会让观测系统故障影响 P0 主链 | 不采用,关键审计仍走本地 audit store |

---

## 7. 结构化中间产物

### 7.1 三类记录关系图

```text
[Command / Query / Event / Job]
        |
        +--> Structured Log
        |      - request_id / trace_id
        |      - operation / target / error_code
        |      - duration / dependency / retryable
        |
        +--> Metrics
        |      - count / latency / gauge
        |      - low-cardinality labels
        |
        +--> AuditRecord
               - only business facts
               - lifecycle / version / fingerprint / gate / outbox refs
               - append-only, queryable by trace
```

关键说明：

- 日志和指标服务于运行观察;审计服务于业务事实追溯。
- Query 不写 `AuditRecord`,但可以写 access log 和指标。
- observability backend 失败不阻断业务;本地 `AuditRecord` 写失败会让 P0 写路径失败。

### 7.2 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API handler 收到请求 | `info` | `request_id`、`trace_id`、`operation`、`method`、`path_template`、`actor_ref`、`idempotency_key_hash` | 建立入口访问日志,不记录完整 body |
| Gateway context 缺失或不可信 | `warn` | `request_id`、`trace_id`、`operation`、`error_code=GATEWAY_CONTEXT_INVALID`、`header_presence` | 排查 gateway / ingress 配置错误 |
| DTO / path-body 校验失败 | `warn` | `request_id`、`trace_id`、`operation`、`error_code`、`field_path` | 定位调用方请求错误 |
| Command 开始处理 | `info` | `request_id`、`trace_id`、`operation`、`content_id`、`kind`、`expected_revision`、`actor_ref` | 追踪写路径入口 |
| Command 成功提交 | `info` | `request_id`、`trace_id`、`operation`、`content_id`、`kind`、`from_state`、`to_state`、`new_revision`、`duration_ms` | 追踪写路径成功和状态变化 |
| Command 业务校验失败 | `warn` | `request_id`、`trace_id`、`operation`、`target_ref`、`error_code`、`retryable=false` | 排查 validation / boundary / lifecycle 失败 |
| Command 并发或幂等冲突 | `warn` | `request_id`、`trace_id`、`operation`、`target_ref`、`error_code`、`expected_revision`、`actual_revision`、`idempotency_scope` | 排查重复请求和并发覆盖 |
| Command 本地事务失败 | `error` | `request_id`、`trace_id`、`operation`、`error_code`、`tx_phase` | 排查 DB / commit / repository 失败 |
| publish gate 校验失败 | `warn` | `request_id`、`trace_id`、`content_id`、`gate_ref`、`error_code`、`dependency=governance` | 排查治理前置条件 |
| 外部依赖不可用 | `error` | `request_id`、`trace_id`、`operation`、`dependency`、`error_code`、`timeout_ms`、`retryable` | 排查 governance / storage / bus / database 故障 |
| Query 成功 | `info` | `request_id`、`trace_id`、`operation`、`read_mode`、`page_size`、`consistency`、`duration_ms` | 观察查询性能和一致性状态 |
| Query not found / stale | `warn` | `request_id`、`trace_id`、`operation`、`target_ref`、`error_code`、`projection_checkpoint` | 排查 projection 或调用 ID 问题 |
| Outbox relay claim | `info` | `trace_id`、`worker_id`、`batch_size`、`claimed_count`、`lease_timeout_ms` | 观察 relay worker 工作量 |
| Outbox publish 成功 | `info` | `trace_id`、`event_id`、`event_type`、`topic`、`attempt_count`、`duration_ms` | 追踪事件发布 |
| Outbox publish 失败 | `warn` / `error` | `trace_id`、`event_id`、`event_type`、`topic`、`attempt_count`、`error_code`、`next_retry_at` | 排查 bus 故障和重试 |
| Outbox dead-letter | `error` | `trace_id`、`event_id`、`event_type`、`failure_reason`、`attempt_count` | 触发人工恢复入口 |
| Inbound event 重复 | `info` | `trace_id`、`source_module`、`external_event_id`、`payload_hash`、`idempotency_status` | 观察上游重投 |
| Inbound event malformed | `warn` / `error` | `trace_id`、`source_module`、`external_event_id`、`error_code`、`dead_letter_id` | 排查入站事件兼容性 |
| Operations Job 开始 | `info` | `trace_id`、`job_name`、`job_run_id`、`scope_hash`、`dry_run`、`batch_size` | 追踪 job 执行 |
| Operations Job batch 失败 | `warn` / `error` | `trace_id`、`job_name`、`job_run_id`、`cursor`、`error_code`、`processed_count` | 排查 batch 处理失败 |
| Operations Job 完成 | `info` | `trace_id`、`job_name`、`job_run_id`、`status`、`processed_count`、`failed_count`、`duration_ms` | 记录 job 结果 |
| dry_run 写入被阻断 | `error` | `trace_id`、`job_name`、`job_run_id`、`error_code=JOB_DRY_RUN_WRITE_FORBIDDEN`、`attempted_write` | 发现实现越界 |

### 7.3 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `method_library_api_requests_total` | counter | API handler 结束 | `operation`、`status_code`、`result` |
| `method_library_api_request_duration_ms` | histogram | API handler 结束 | `operation`、`status_code` |
| `method_library_command_total` | counter | Command service 结束 | `command`、`kind`、`result`、`error_code` |
| `method_library_command_duration_ms` | histogram | Command service 结束 | `command`、`kind`、`result` |
| `method_library_lifecycle_transition_total` | counter | lifecycle 成功变化后 | `action`、`kind`、`from_state`、`to_state` |
| `method_library_revision_conflict_total` | counter | repository save 返回 revision conflict | `operation`、`kind` |
| `method_library_idempotency_conflict_total` | counter | idempotency conflict / status conflict | `scope`、`error_code` |
| `method_library_publish_gate_validation_total` | counter | `PublishGovernanceService` 结束 | `result`、`error_code` |
| `method_library_publish_gate_validation_duration_ms` | histogram | `GovernancePort.validate_approved_gate(...)` | `result` |
| `method_library_snapshot_build_duration_ms` | histogram | snapshot build / put payload | `kind`、`result` |
| `method_library_outbox_pending` | gauge | outbox relay scan 前后 | `event_type` |
| `method_library_outbox_claim_total` | counter | outbox claim | `result`、`event_type` |
| `method_library_outbox_publish_total` | counter | bus publish result | `event_type`、`topic`、`result`、`error_code` |
| `method_library_outbox_publish_duration_ms` | histogram | bus publish result | `event_type`、`topic`、`result` |
| `method_library_outbox_dead_letter_total` | counter | mark dead-letter | `event_type`、`error_code` |
| `method_library_projection_stale_total` | counter | query detects stale projection | `query`、`projection_name` |
| `method_library_projection_rebuild_total` | counter | rebuild job batch end | `projection_name`、`result` |
| `method_library_checkpoint_conflict_total` | counter | checkpoint CAS conflict | `job_name`、`checkpoint_name` |
| `method_library_job_run_total` | counter | job completion | `job_name`、`status`、`dry_run` |
| `method_library_job_duration_ms` | histogram | job completion | `job_name`、`status`、`dry_run` |
| `method_library_external_dependency_errors_total` | counter | outbound adapter error | `dependency`、`operation`、`error_code` |
| `method_library_inbound_event_total` | counter | inbound event handler end | `source_module`、`event_type`、`result` |
| `method_library_inbound_dead_letter_total` | counter | inbound dead-letter write | `source_module`、`event_type`、`error_code` |

指标标签约束：

- 不使用 `content_id`、`actor_id`、`request_id`、`trace_id`、raw `idempotency_key` 作为指标标签。
- 需要定位单个对象时通过日志和 trace 关联。

### 7.4 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `MethodContentDraftCreated` | `CreateMethodContentDraftFlow` 成功提交 | `audit_id`、`request_id`、`trace_id`、`actor_ref`、`content_id`、`content_family_id`、`kind`、`action=create_draft`、`revision`、`occurred_at` | audit query、trace query、operations |
| `MethodContentDraftUpdated` | `UpdateMethodContentDraftFlow` 成功提交 | `audit_id`、`request_id`、`trace_id`、`actor_ref`、`content_id`、`kind`、`action=update_draft`、`old_revision`、`new_revision`、`occurred_at` | audit query、trace query |
| `MethodContentSubmittedForReview` | `SubmitMethodContentForReviewFlow` 成功提交 | `audit_id`、`actor_ref`、`content_id`、`kind`、`from_state=draft`、`to_state=in_review`、`reason`、`revision`、`occurred_at` | audit query、trace query、governance / reviewer view |
| `MethodContentPublished` | `PublishMethodContentFlow` 成功提交 | `audit_id`、`actor_ref`、`content_id`、`kind`、`from_state`、`to_state=published`、`version`、`fingerprint`、`gate_ref`、`snapshot_ref`、`outbox_event_refs`、`revision`、`occurred_at` | trace query、downstream resync、auditor |
| `MethodContentDeprecated` | `DeprecateMethodContentFlow` 成功提交 | `audit_id`、`actor_ref`、`content_id`、`kind`、`from_state=published`、`to_state=deprecated`、`version`、`fingerprint`、`reason`、`effective_at`、`outbox_event_refs` | trace query、downstream consumers、auditor |
| `MethodContentRetired` | `RetireMethodContentFlow` 成功提交 | `audit_id`、`actor_ref`、`content_id`、`kind`、`from_state`、`to_state=retired`、`version`、`fingerprint`、`reason`、`retire_policy`、`outbox_event_refs` | trace query、downstream consumers、auditor |
| `MethodContentSuperseded` | `SupersedeMethodContentFlow` 成功提交 | `audit_id`、`actor_ref`、`old_content_id`、`new_content_id`、`kind`、`old_version`、`new_version`、`old_fingerprint`、`new_fingerprint`、`supersede_link_id`、`gate_ref`、`snapshot_ref`、`outbox_event_refs`、`occurred_at` | trace query、downstream resync、auditor |
| `SeedAssetApplied` | `SeedInitialMethodAssets` 通过 Command service 创建或发布资产后 | `audit_id`、`actor_ref`、`job_run_id`、`asset_set`、`content_id`、`kind`、`action`、`version`、`fingerprint`、`occurred_at` | operations、auditor |
| `FingerprintMismatchReported` | `RecalculateFingerprint(dry_run=true)` 发现 mismatch | `job_run_id`、`content_id`、`kind`、`stored_fingerprint`、`calculated_fingerprint`、`canonical_schema_version`、`occurred_at` | operations、auditor |
| `ReadModelRebuildCompleted` | `RebuildReadModels` 完成 | `job_run_id`、`projection_name`、`from_cursor`、`to_cursor`、`processed_count`、`status`、`occurred_at` | operations |

审计事件约束：

- `AuditRecord` 不保存完整 `MethodContentPayload`、snapshot payload、secret、raw idempotency key。
- 审计中的 actor 只保存可信 `actor_ref` / `actor_id` 摘要,不保存登录凭证。
- 失败 audit 如果后续启用,必须单独使用 `result=failed` 类型,不得写成 lifecycle 成功变化。

### 7.5 字段边界表

| 记录类型 | 必须字段 | 禁止字段 |
|---|---|---|
| structured log | `request_id`、`trace_id`、`operation`、`result`、`error_code`、`duration_ms`、必要 target ref | secret、token、database URL、完整 payload、raw idempotency key |
| metric | `operation`、`kind`、`result`、`error_code`、`dependency` 等低基数标签 | content_id、actor_id、request_id、trace_id、payload hash 大量唯一值 |
| audit | `audit_id`、`actor_ref`、`target_ref`、`action`、业务状态字段、`occurred_at` | secret、认证凭据、完整 body、完整 snapshot payload |
| dead-letter | `dead_letter_id`、`source_module`、`event_type`、`event_id`、`payload_hash`、`error_code`、失败摘要 | 上游凭据、未经脱敏的大 payload |

### 7.6 实现红线

| 红线 | 说明 |
|---|---|
| 不允许用日志替代 `AuditRecord` | 业务状态变化必须进入 append-only audit |
| 不允许 Query 写 audit | 第一版 Query 只读,除非后续单独设计 query audit |
| 不允许失败请求写成业务成功 audit | validation / lifecycle / gate 失败不能产生 lifecycle success 记录 |
| 不允许 observability backend 失败阻断 P0 主链 | 关键审计走本地 repository,日志/指标 exporter 失败只记录/降级 |
| 不允许指标标签使用高基数字段 | 避免 content_id / actor_id / request_id 进入 metric label |
| 不允许日志和审计记录 secret 或完整 payload | 遵守安全和隐私边界 |
| 不允许 outbox dead-letter 静默失败 | 必须有日志、指标和 dead-letter record |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 14. 可观测性与审计埋点契约

### 14.1 三类记录关系

```text
[处理流] -> Structured Log / Metrics / AuditRecord
```

### 14.2 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|

### 14.3 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|

### 14.4 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|

### 14.5 字段边界

| 记录类型 | 必须字段 | 禁止字段 |
|---|---|---|

### 14.6 实现红线

| 红线 | 说明 |
|---|---|
````

---

## 9. 待确认事项

- 失败 Command 是否第一版写 `AuditRecord(result=failed)`。当前建议不作为 P0 强制项,但 structured log 和 metric 必须实现。
- `ReadModelRebuildCompleted` 是否进入 `AuditRecord` 还是 operations log。当前建议作为 operations audit / job result,不混入 MethodContent lifecycle audit。
- `FingerprintMismatchReported` 是否作为 audit record 持久化,还是只进入 job result。当前建议至少进入 job result,是否同步 audit 留给正式回填时确认。
- 指标命名是否需要遵守全局 L0 observability 命名规范。当前先给建议名,最终以全局规范为准。

---

## 10. 进入下一步条件

- 日志埋点表已经覆盖 API、Command、Query、outbox relay、inbound event 和 operations job。
- 指标埋点表已经覆盖请求、Command、生命周期、幂等、outbox、projection、job 和外部依赖。
- 审计事件表已经覆盖所有 P0 成功业务状态变化和 seed / fingerprint / rebuild 的 operations 证据。
- 字段边界已经明确,不会越过安全和隐私边界。
- 可观测性后端失败与本地审计失败的业务影响已经区分。
- 可以进入 Step 16 定义测试切口与最小验证清单。
