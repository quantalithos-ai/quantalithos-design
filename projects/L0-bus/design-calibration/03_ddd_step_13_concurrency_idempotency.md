# Step 13. 定义并发、幂等与重入保护

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 的并发更新控制、重复请求 / 重复事件 / job 重跑处理、幂等键计算规则和重入保护策略。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 13 | 必须输出并发场景表、幂等键表和重入保护表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.12 | 只写真实影响实现的并发和幂等场景，幂等键必须可计算 | 约束正式文档回填 |
| `projects/L0-bus/design-calibration/03_ddd_step_08_protocol_contracts.md` | 已定义 Command / Event / Job 的幂等要求和 key 来源 | 决定幂等键表 |
| `projects/L0-bus/design-calibration/03_ddd_step_09_function_flows.md` | 已定义每个处理流的事务边界、item 粒度和错误分支 | 决定重入保护和 job 重跑行为 |
| `projects/L0-bus/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | 已定义 `get_for_update`、`expected_version`、唯一约束、source ack 和 projection 恢复 | 决定并发控制方式 |
| `projects/L0-bus/design-calibration/03_ddd_step_12_error_recovery.md` | 已定义 `VersionConflict`、`UniqueViolation`、duplicate / conflict / retryable 的错误映射 | 决定失败错误和重复请求处理 |

---

## 3. SOP 问题回答

### 3.1 哪些处理流可能并发修改同一资源？

| 冲突资源 | 可能并发的处理流 | 主要风险 | 控制口径 |
|---|---|---|---|
| `PublicationAcceptance` | `AcceptPublicationFlow`、`ConsumeCommittedOutboxFactFlow`、`RunOutboxRelayFlow` | 同一 source fact 或同一 idempotency key 被重复接入 | `source_system + source_record_ref` 唯一约束 + `IdempotencyAnchor` |
| `DeliveryRecord` | `RunDeliveryProgressionFlow`、`RecordDeliveryFeedbackFlow`、`ConsumeBackendDeliverySignalFlow`、`ConsumeTimeoutSignalFlow`、`RunRetryCycleFlow`、`MoveDeliveryToDeadLetterFlow` | delivery 状态被并发推进、完成、失败、重试或移入 DLQ | `get_for_update` + `expected_version` + 状态机校验 |
| `FeedbackResult` | `RecordDeliveryFeedbackFlow`、`ConsumeBackendDeliverySignalFlow`、`ConsumeTimeoutSignalFlow` | 同一 feedback / signal 被重复记录，或 late feedback 改写终态 | feedback 唯一键 + idempotency key + delivery lock |
| `RetryPlan` | `RequestRetryFlow`、`RunRetryCycleFlow`、并发 operator 请求 | active retry plan 重复创建，或 retry attempt 重复执行 | active retry 唯一约束 + `retry_plan_id + attempt_index` |
| `DeadLetterEntry` / `FailureMaterial` | `MoveDeliveryToDeadLetterFlow`、`RunRetryCycleFlow` exhausted 后 operator 处理 | failed delivery 同时 retry 与 DLQ | delivery lock + active DLQ 唯一约束 + recovery policy |
| `ReplayPreparation` | `PrepareReplayFlow`、operator 重复提交 | 同一 DLQ + approval ref 重复准备 replay | `dead_letter_id + approval_ref` 唯一约束 |
| Read projection | `RunReadOutputProjectionFlow`、`RebuildReadProjectionFlow` | 增量 projection 与 rebuild 覆盖同一 projection key | `ProjectionVersion` + replace batch version check |
| outbound publish evidence | `OutboundEventPublishFlow`、publisher retry | 同一 event 重复发布或重复写 receipt | `event_id + source_record_ref + schema_version` |
| backend health projection | `CheckBackendCapabilityFlow` 多实例运行 | 同一 backend health view 被并发刷新 | `backend_id` key + projection version |
| audit append sequence | 所有写路径 | audit sequence 冲突或覆盖 | append-only sequence，不允许 update / delete |

### 3.2 哪些接口、事件或 job 可能被重复调用？

| 类型 | 可能重复的入口 | 重复来源 | 默认结果 |
|---|---|---|---|
| Command API | `AcceptPublication`、`RecordDeliveryFeedback` | HTTP 客户端超时重试、网关重放 | same key + same digest 返回既有结果；different digest 返回 `409` |
| Recovery Command API | `RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` | operator 重复点击、自动化恢复脚本重跑 | 有 key 时按 idempotency anchor；无 key 时依赖目标唯一约束 |
| Inbound Event Consumer | `ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` | event bus at-least-once、source ack 失败后重复投递 | duplicate 返回 existing result 或 audited no-op |
| Outbound Event Publisher | 9 个 outbound event publish | publisher retry、receipt 丢失 | duplicate publish 返回已有 receipt |
| Operations Job | `RunOutboxRelay`、`RunDeliveryProgression`、`RunRetryCycle`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability` | scheduler 重跑、同一 job 多实例、部分失败后恢复 | 按 item key 去重；单 item 不重复写 truth |
| Query API | 所有 Query | 客户端重复读取 | 不需要幂等键，只读返回当前 projection / truth view |

### 3.3 幂等键来自请求、事件、job 参数还是数据库唯一约束？

| 来源 | 使用位置 | 说明 |
|---|---|---|
| HTTP header `x-idempotency-key` | 写 Command API | `AcceptPublication`、`RecordDeliveryFeedback` 必需；recovery command 建议提供 |
| 请求摘要 `RequestDigest` | 写 Command API | 与 idempotency key 绑定，区分“同 key 同请求”和“同 key 不同请求” |
| Event metadata `event_id` | Inbound Event Consumer | 与 `source_ref`、事件内 `idempotency_key` 组成事件幂等键 |
| Source reference | outbox fact / backend signal / timeout signal | 防止不同 source 重放产生同一本地 truth |
| Job metadata `job_run_id` | job summary | 标识一次 job run 的 summary，不单独作为业务 item 幂等 |
| Cursor + target ID | job item | `cursor` 约束扫描范围，`delivery_id` / `retry_plan_id` / `projection_key` 约束 item |
| Repository unique constraint | truth / projection / evidence | 最后一层保护，覆盖 idempotency anchor 写失败或并发竞态 |

### 3.4 重复请求应该返回既有结果、跳过、覆盖还是报错？

| 重复类型 | 处理方式 | 说明 |
|---|---|---|
| same idempotency key + same digest | 返回既有结果 | 不重复写 truth，不重复发布状态事件 |
| same idempotency key + different digest | 报错 `409 ConflictError` | 写 conflict anchor / audit，不覆盖原 anchor |
| same event id + same source ref + same digest | 返回 existing / duplicate result | consumer ack 可以继续执行 |
| same event id + different source / digest | rejected / conflict | 防止跨 source 混淆 |
| same job run + same item key | 跳过或返回 previous item result | job summary 可记录 duplicate skipped |
| new job run 扫描到已处理 item | 读取当前状态后 skip / existing result | 不依赖旧 job_run_id，依赖 truth 状态和 item key |
| version conflict | 不覆盖，返回 conflict 或 retryable item | 由调用方重新读取后决策 |
| unique constraint hit but digest unknown | 保守返回 conflict | 防止误把不同请求当重复成功 |

### 3.5 并发冲突如何测试？

| 测试方向 | 验证方式 |
|---|---|
| 双写同一 delivery | 使用 deterministic in-memory store 并发执行两个写事务，一个成功，一个 `VersionConflict` |
| 重复 Command | 使用同一 `x-idempotency-key` 和相同 / 不同 request digest 分别验证 existing result / conflict |
| 重复 Event | 使用同一 `event_id + source_ref + idempotency_key` 消费两次，第二次不重复写 truth |
| job 重跑 | 使用同一 cursor / target item 重跑 job，验证 processed item 不重复写 |
| projection rebuild 并发 | 增量 projection 与 rebuild 同时写同一 key，验证 version conflict 和 stale marker |
| source ack failure | bus truth 已提交但 ack 失败后重复消费，验证 idempotency anchor 返回既有结果 |
| publisher retry | 同一 event 重复 publish，验证 receipt / evidence 幂等 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 已列幂等要求，但分散在每个协议下 | 实现者难以统一 key 计算方式 | 本步汇总成幂等键表和 key 计算规则 |
| Step 11 已定义锁和唯一约束，但未映射到每个并发场景 | 实现者不知道哪些 flow 会互相冲突 | 本步列并发场景表 |
| job 的 `job_run_id` 容易被误认为业务幂等键 | 同一业务 item 在新 job run 中可能重复写 truth | 本步区分 job run summary key 和 item idempotency key |
| recovery command 的幂等键在 Step 8 是“建议提供” | 没有 key 时仍需防止重复创建 retry / DLQ / replay | 本步规定 optional key + 目标唯一约束双层保护 |
| source ack 失败和 publisher retry 已有恢复口径 | 缺少重复消费 / 重复发布的具体行为 | 本步补 duplicate result、existing receipt 和 evidence 幂等 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 并发资源 | 只在存储契约中列锁 / 版本 | 明确每个冲突资源对应哪些处理流 |
| 幂等键 | 分散在协议表 | 统一给出 Command / Event / Job / Outbound Event key 计算方式 |
| 重复请求 | 只说 duplicate / conflict | 明确 same digest 返回既有结果，different digest 返回 `409` |
| job 重跑 | 只说每个 item 一个事务 | 明确 job summary 与 item 幂等分离 |
| recovery command | 只建议 `x-idempotency-key` | 增加目标唯一约束兜底 |
| 测试切口 | 分散在处理流 | 汇总并发、重复调用、重跑和 projection 冲突测试 |

---

## 6. 设计取舍

### 6.1 是否只依赖数据库唯一约束实现幂等

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：只依赖唯一约束 | 实现简单，但无法返回既有 result，也难区分同 key 不同请求 | 不采用 |
| 方案 B：`IdempotencyAnchor` + repository 唯一约束双层保护 | 推荐 |
| 方案 C：只依赖内存缓存 | 不能跨进程 / 重启保持语义 | 不采用 |

推荐方案 B。`IdempotencyAnchor` 提供可解释结果，唯一约束提供最后防线。

### 6.2 job 幂等是否只使用 `job_run_id`

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：只用 `job_run_id` | 同一业务 item 被新 job run 扫描时仍可能重复写 | 不采用 |
| 方案 B：job summary 用 `job_run_id`，业务 item 用稳定 item key | 推荐 |
| 方案 C：job 完全不做幂等，依赖状态机报错 | 会产生大量冲突噪声 | 不采用 |

推荐方案 B。job run 是调度事实，item key 才是业务去重边界。

### 6.3 recovery command 是否强制 `x-idempotency-key`

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：强制所有 recovery command 必填 | 更统一，但会修改 Step 8 已确认的“建议提供”口径 | 不采用 |
| 方案 B：保持建议提供；提供时按 idempotency anchor，未提供时按目标唯一约束 | 推荐 |
| 方案 C：完全不支持 recovery command 幂等键 | operator 重复点击体验差 | 不采用 |

推荐方案 B。它不推翻上游协议，同时能保证不会重复创建 retry / DLQ / replay。

### 6.4 并发冲突是否自动重试

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：所有 `VersionConflict` 自动重试 | 可能把状态冲突隐藏成成功 | 不采用 |
| 方案 B：只对 scan/job item 的暂时冲突允许有限重试；Command 返回 `409` | 推荐 |
| 方案 C：所有冲突都直接失败 | 可行但 job 在高并发下噪声较大 | 不采用 |

推荐方案 B。Command 调用方需要看到冲突，job 可以在受控 item 粒度做有限重试或 skip。

---

## 7. 结构化中间产物

### 7.1 并发与幂等控制图

```text
Inbound Command / Event / Job item
  |
  v
Compute idempotency scope + key + request digest
  |
  +-- existing anchor + same digest ------> return existing result
  |
  +-- existing anchor + different digest -> ConflictError
  |
  v
UnitOfWork.begin(...)
  |
  v
load target with get_for_update(...) / check unique constraint
  |
  v
domain state transition
  |
  v
save truth + audit/history + idempotency anchor
  |
  v
UnitOfWork.commit(...)
```

关键说明：

- 幂等检查先于主要写入，但 anchor 绑定必须与业务 truth 同一 `UnitOfWork` 协调。
- `get_for_update` 和 `expected_version` 保护同一 truth 的并发更新。
- repository 唯一约束是幂等 anchor 之外的最后防线。
- job summary 的幂等不等于业务 item 幂等，业务 item 必须有稳定 key。

### 7.2 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 同一 publication 被 HTTP command 与 outbox fact 同时接入 | `publication_acceptances.source_system + source_record_ref`、`idempotency_anchors` | source 唯一约束 + `IdempotencyAnchor` | `RepositoryError::UniqueViolation` / `ConflictError` | 两个并发 accept，一个成功，一个 existing / conflict |
| 同一 idempotency key 被两个不同 request 使用 | `idempotency_anchors.scope + key` | anchor digest 比对 | `ApplicationError::IdempotencyConflict` | same key different digest 返回 `409` |
| 两个 worker 同时推进同一 delivery | `delivery_records.delivery_id` | `DeliveryRepository.get_for_update(...)` + `expected_version` | `RepositoryError::VersionConflict` | 双 worker 并发 `RunDeliveryProgression` |
| delivery progression 与 backend signal 同时更新 delivery | `delivery_records.delivery_id`、`delivery_attempts` | delivery lock + attempt status 校验 | `VersionConflict` / `InvalidStateTransition` | dispatching delivery 同时 delivered / failed |
| feedback command 与 timeout signal 同时写 feedback | `feedback_results.delivery_id + external_feedback_ref`、`delivery_records.delivery_id` | feedback 唯一键 + delivery lock | `DuplicateFeedback` / `VersionConflict` | ack 与 timeout 并发 |
| late feedback 到达已 dead-lettered delivery | `delivery_records.delivery_id` | 状态机终态保护 | `TerminalStateReopenRejected` / conflict | dead-letter 后重复 ack |
| RequestRetry 与 RunRetryCycle 同时处理 retry plan | `retry_plans.retry_plan_id`、`delivery_records.delivery_id` | retry plan version + delivery lock | `VersionConflict` / `RetryNotAllowed` | operator 请求与 retry job 并发 |
| RequestRetry 重复创建 active retry | active `retry_plans.delivery_id` | active retry 唯一约束 | `UniqueViolation` / `RetryNotAllowed` | 同一 failed delivery 重复 request retry |
| RetryCycle 与 MoveDeliveryToDeadLetter 同时处理 failed delivery | `delivery_records.delivery_id`、`retry_plans`、`dead_letter_entries` | delivery lock + active DLQ / retry 约束 | `RecoveryConflict` / `VersionConflict` | retry exhausted 与 DLQ command 并发 |
| MoveDeliveryToDeadLetter 重复提交 | active `dead_letter_entries.delivery_id` | active DLQ 唯一约束 | `UniqueViolation` / existing result | operator 双击 DLQ |
| PrepareReplay 重复提交 | `replay_preparations.dead_letter_id + approval_ref` | 唯一约束 | `UniqueViolation` / existing result | 同 approval ref 重复 prepare |
| 增量 projection 与 rebuild 同时写同一 projection | projection key / `projection_version` | projection version check | `ProjectionVersionConflict` | rebuild 与 projection job 并发 |
| outbound publisher retry 重复发布同一 event | `event_id + source_record_ref + schema_version` | publish evidence 唯一约束 | `PublisherPortError::Duplicate` | receipt 丢失后 retry |
| backend capability check 多实例并发 | `backend_health_projection.backend_id` | backend health projection version | `ProjectionVersionConflict` | 两个 capability job 同时写 |
| audit append 并发 | `audit_sequence` | append-only sequence 分配 | `RepositoryError::SequenceConflict` | 高并发写 audit |

### 7.3 幂等数据模型契约

```rust
/// 幂等作用域。
///
/// 作用域必须至少包含入口类型和业务动作，避免不同接口共用同一个 key。
pub struct IdempotencyScope {
    /// 入口类型，例如 command、event、job_item、publish。
    pub entry_kind: IdempotencyEntryKind,
    /// 业务动作，例如 accept_publication、record_feedback。
    pub action: IdempotencyAction,
    /// 可选租户、项目或 subscriber 维度。
    pub boundary_ref: Option<BoundaryRef>,
}

/// 幂等键。
///
/// 来自请求 header、事件 metadata、job item 参数或 publish event identity。
pub struct IdempotencyKey {
    /// 对外或内部计算得到的稳定 key。
    pub value: String,
}

/// 请求摘要。
///
/// 用于区分同一幂等 key 下是否为同一个逻辑请求。
pub struct RequestDigest {
    /// 规范化请求或事件后的摘要值。
    pub value: String,
    /// 摘要算法版本。
    pub algorithm_version: DigestAlgorithmVersion,
}

/// 幂等锚点。
///
/// 绑定 scope、key、digest 和已经提交的本地结果引用。
pub struct IdempotencyAnchor {
    /// 幂等作用域。
    pub scope: IdempotencyScope,
    /// 幂等键。
    pub key: IdempotencyKey,
    /// 请求摘要。
    pub request_digest: RequestDigest,
    /// 已提交结果引用。
    pub result_ref: LocalRecordRef,
    /// 创建该锚点的 trace 引用。
    pub trace_ref: TraceContextRef,
}
```

成员函数约束：

| 函数签名 | 作用 | 关键规则 |
|---|---|---|
| `IdempotencyScope::for_command(CommandKind kind, BoundaryRef boundary_ref) -> IdempotencyScope` | 构造 Command 作用域 | 不同 command kind 不共用 scope |
| `IdempotencyScope::for_event(EventKind kind, SourceRef source_ref) -> IdempotencyScope` | 构造 Event 作用域 | 必须包含 source ref |
| `IdempotencyScope::for_job_item(JobKind kind, JobItemRef item_ref) -> IdempotencyScope` | 构造 Job item 作用域 | 不能只用 `job_run_id` |
| `RequestDigest::from_command(CommandEnvelope command) -> RequestDigest` | 计算 Command 摘要 | 不含 volatile header；不含 payload body |
| `RequestDigest::from_event(EventEnvelope event) -> RequestDigest` | 计算 Event 摘要 | 使用 event id、source ref、payload ref / digest |
| `IdempotencyAnchor.matches(RequestDigest digest) -> bool` | 判断是否同一逻辑请求 | mismatch 必须返回 conflict |

### 7.4 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| `AcceptPublication` | `scope=command.accept_publication + x-idempotency-key`；兜底 `source_system + source_record_ref` | 与 acceptance truth 同生命周期 | same digest 返回 existing acceptance；different digest 返回 `409` |
| `RecordDeliveryFeedback` | `scope=command.record_feedback + x-idempotency-key`；兜底 `delivery_id + external_feedback_ref` | 与 feedback truth 同生命周期 | same digest 返回 existing feedback；different digest 返回 `409` |
| `RequestRetry` | 有 header 时 `scope=command.request_retry + x-idempotency-key`；无 header 时 `delivery_id + failure_material_ref + retry_policy_ref + max_attempts` | retry plan active 生命周期 | 返回 existing retry plan 或 `409 active retry conflict` |
| `MoveDeliveryToDeadLetter` | 有 header 时 `scope=command.move_to_dead_letter + x-idempotency-key`；无 header 时 `delivery_id + failure_material_ref` | DLQ active 生命周期 | existing DLQ 返回既有结果；不一致返回 `409` |
| `PrepareReplay` | 有 header 时 `scope=command.prepare_replay + x-idempotency-key`；无 header 时 `dead_letter_id + approval_ref` | replay preparation 生命周期 | existing preparation 返回既有结果；closed DLQ 返回 conflict |
| `GetPublicationAcceptance` | 不需要 | 不适用 | 重复查询返回当前结果 |
| `GetDeliveryStatus` | 不需要 | 不适用 | 重复查询返回当前结果和 consistency marker |
| `ListDeliveryHistory` | 不需要 | 不适用 | 重复查询返回当前分页结果 |
| `GetTransportView` | 不需要 | 不适用 | 重复查询返回当前 projection / stale marker |
| `GetFailureSummary` | 不需要 | 不适用 | 重复查询返回当前 projection |
| `GetBusAuditTrail` | 不需要 | 不适用 | 重复查询返回当前 audit page |
| `GetBackendHealthView` | 不需要 | 不适用 | 重复查询返回当前 health view |
| `ConsumeCommittedOutboxFact` | `event_id + source_ref + idempotency_key` | 与 accepted / rejected publication truth 同生命周期 | duplicate 返回 existing result；ack 可继续 |
| `ConsumeBackendDeliverySignal` | `event_id + source_ref + idempotency_key` | 与 feedback truth 同生命周期 | duplicate 返回 existing feedback / no-op |
| `ConsumeTimeoutSignal` | `event_id + source_ref + idempotency_key` | 与 timeout feedback truth 同生命周期 | duplicate 返回 existing timeout result / no-op |
| `PublicationAcceptedEvent` 等 outbound event | `event_id + source_record_ref + schema_version` | publish evidence 生命周期 | duplicate 返回 existing receipt，不重复发布 |
| `RunOutboxRelay` job summary | `job_run_id + outbox_cursor` | job run 生命周期 | 重复 job summary 返回 previous summary；单条 fact 仍按 event key 去重 |
| `RunOutboxRelay` item | `committed_outbox_fact_ref` 或 `event_id + source_ref + idempotency_key` | fact 本地接入生命周期 | processed item 返回 existing acceptance |
| `RunDeliveryProgression` job summary | `job_run_id + delivery_cursor` | job run 生命周期 | 重复 summary 返回 previous summary |
| `RunDeliveryProgression` item | `delivery_id + expected_version + progression_purpose`；attempt 创建后关联 `attempt_id` | delivery 当前版本生命周期 | 已推进则 skip；版本冲突则 item conflict / limited retry |
| `RunRetryCycle` job summary | `job_run_id + retry_cursor` | job run 生命周期 | 重复 summary 返回 previous summary |
| `RunRetryCycle` item | `retry_plan_id + attempt_index` | retry plan 生命周期 | 已尝试返回 existing attempt；exhausted 返回 non-retryable result |
| `RunReadOutputProjection` item | `projection_key + source_audit_sequence` | projection source audit 生命周期 | 已投影则 skip / existing projection |
| `RebuildReadProjection` job | `job_run_id + rebuild_scope` | rebuild run 生命周期 | 重复 run 返回 previous rebuild summary；batch 写入按 projection version |
| `CheckBackendCapability` item | `job_run_id + backend_id` | job run 生命周期 | 同 run 重复返回 previous item；新 run 覆盖 health projection version |

### 7.5 重复调用处理矩阵

| 重复来源 | 检测位置 | same digest | different digest | 审计 / 事件 |
|---|---|---|---|---|
| HTTP client retry | `IdempotencyRepository.find(...)` | 返回 existing result | `409 ConflictError` | 可写 duplicate / conflict audit |
| operator 双击 recovery command | idempotency anchor 或目标唯一约束 | 返回 existing retry / DLQ / replay | `409 ConflictError` | 可写 duplicate audit |
| event bus 重投 | event consumer 幂等检查 | 返回 duplicate / existing result | rejected / conflict | duplicate 可追踪，不重复发布成功事件 |
| source ack 失败后重读 fact | `ConsumeCommittedOutboxFact` | 返回 existing acceptance，并重新 ack | conflict 时进入 rejected / manual | 写 ack failure evidence |
| scheduler 重跑同一 job run | job summary repository / item anchor | 返回 previous summary 或 skip processed item | conflict item 进入 summary | 不重复写业务 audit |
| 新 job run 扫描旧 item | truth 状态 / item key | skip / existing result | 状态冲突则 skipped with audit | job summary 记录 skipped |
| publisher receipt 丢失后 retry | publish evidence | 返回 existing receipt | schema / boundary rejected | 不重复发业务事件 |

### 7.6 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command 在 commit 前失败后重试 | client timeout / network retry | 未绑定 anchor，旧事务 rollback；新请求重新执行 | 如果旧事务未提交，重试可正常创建 truth |
| Command commit 成功但 response 丢失 | HTTP response timeout | anchor 已绑定 `result_ref` | 重试返回 existing result |
| Command commit 状态不确定 | store / process crash | `CommitUncertain` 不自动盲重试 | 人工确认 truth / anchor 后修复 |
| Event 处理成功但 source ack 失败 | source ack failure | event idempotency anchor + source ref | 重复消费返回 existing result 并重新 ack |
| Event 处理中途失败 | consumer crash / dependency failure | 单 event 一个 `UnitOfWork`；未 commit 不可见 | source 重投后重新处理 |
| Delivery job 创建 attempt 后 job summary 未写 | job crash after item commit | item key + delivery status + attempt id | 新 job run 看到状态已推进，skip / existing |
| Backend signal 重复到达 | backend at-least-once callback | `event_id + source_ref + idempotency_key` + feedback unique key | 重复 signal 返回 existing feedback |
| Timeout signal 与 backend ack 交错 | scheduler / backend race | delivery lock + feedback 状态校验 | 一个成功，另一个 late feedback / conflict |
| Retry job 重跑同一 retry plan | scheduler retry | `retry_plan_id + attempt_index` | 已执行 attempt 返回 existing；exhausted 返回 non-retryable |
| DLQ command 与 retry job 交错 | operator / scheduler race | delivery lock + active retry / DLQ unique | 冲突方返回 conflict / skipped |
| Projection job item commit 后 summary 丢失 | job crash | `projection_key + source_audit_sequence` | 重跑时 skip / existing projection |
| Rebuild projection 与增量 projection 交错 | operator rebuild / scheduler | `ProjectionVersion` / rebuild scope | version conflict 后重读并重试 |
| Publisher publish 成功但 receipt 记录失败 | process crash / event bus timeout | `event_id + source_record_ref + schema_version` | retry publish must be idempotent；已有 receipt 返回 existing |
| Rollback failed 后重入 | adapter bug / lock leak | 当前 handle 标记 invalid | 人工清理 staged writes / locks 后恢复 |

### 7.7 Repository / Port 实现约束

| 组件 | 必须实现的并发 / 幂等能力 |
|---|---|
| `IdempotencyRepository` | `find`、`bind`、`mark_conflict` 必须基于 `scope + key` 唯一；`bind` 必须保存 request digest 与 result ref |
| `PublicationRepository` | `source_system + source_record_ref` 唯一；insert 竞态必须返回 `UniqueViolation` |
| `DeliveryRepository` | `get_for_update` 必须锁定单个 delivery；`save` 必须检查 `expected_version` |
| `FeedbackRepository` | 必须保证 `delivery_id + external_feedback_ref` 或等价反馈来源唯一 |
| `RecoveryRepository` | active retry、active DLQ、`dead_letter_id + approval_ref` 必须唯一 |
| `ReadProjectionRepository` | projection write 必须检查 `projection_version` 或 `source_audit_sequence` |
| `OutboxFactSourcePort` | ack 失败不得修改 bus truth；重复 poll 必须允许由 consumer 幂等兜底 |
| `OutboxPublisherPort` | publish 必须接受 event idempotency key；duplicate publish 返回 existing receipt |
| `UnitOfWork` | staged writes commit 前不可见；rollback 清理 staged writes 和 locks；invalid handle 不可复用 |

### 7.8 幂等处理伪代码

```rust
/// 处理写命令的幂等外壳。
///
/// `scope` 表示入口和业务动作，`key` 来自请求或计算得到的稳定 key。
pub async fn run_idempotent_command(
    scope: IdempotencyScope,
    key: IdempotencyKey,
    digest: RequestDigest,
    actor: ActorContext,
    meta: CommandMetadata,
) -> Result<CommandResult, ApplicationError> {
    // [IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)]
    // 如果 anchor 已存在，先判断 digest 是否一致。
    if let Some(anchor) = idempotency_repository.find(scope.clone(), key.clone()).await? {
        if anchor.matches(digest.clone()) {
            return load_existing_result(anchor.result_ref()).await;
        }

        return Err(ApplicationError::idempotency_conflict(scope, key));
    }

    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启写事务，后续 truth、audit 和 anchor 必须同事务提交。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::Command, actor.clone()).await?;

    // [application-specific write flow]
    // 这里执行具体业务写入，例如保存 acceptance、feedback 或 retry plan。
    let result = execute_write_flow(uow.clone(), actor, meta).await?;

    // [IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)]
    // 成功写入业务 truth 后绑定 anchor，确保重试能返回既有结果。
    idempotency_repository.bind(
        IdempotencyAnchor::new(scope, key, digest, result.record_ref(), result.trace_ref()),
        uow.clone(),
    ).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle handle)]
    // 提交后 result 与 anchor 同时可见。
    unit_of_work.commit(uow).await?;

    Ok(result)
}
```

说明：

- 上述伪代码是处理模式，不要求所有 flow 共用同一个函数。
- 对 event / job item 也应使用同样的 `scope + key + digest + result_ref` 思路。
- recovery command 没有 header key 时，`key` 可以由目标唯一维度计算，但仍必须能稳定复现。

### 7.9 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `accept_publication_same_key_same_digest_returns_existing` | Command idempotency | 同 key 同 digest 不重复 insert | application service 单元测试 |
| `accept_publication_same_key_different_digest_conflicts` | digest mismatch | 返回 `409` / `IdempotencyConflict` | application service 单元测试 |
| `consume_outbox_fact_duplicate_returns_existing` | Event idempotency | 重复 fact 不重复写 acceptance | consumer 测试 |
| `record_feedback_races_with_timeout` | delivery lock + feedback unique | 一个成功，另一个 duplicate / conflict | 并发单元测试 |
| `delivery_progression_double_worker_version_conflict` | `get_for_update` + `expected_version` | 双 worker 只有一个推进 delivery | repository + service 测试 |
| `request_retry_duplicate_active_plan` | active retry unique | 重复 retry 返回 existing / conflict | application service 测试 |
| `dead_letter_races_with_retry_cycle` | recovery conflict | DLQ 与 retry 不会同时成功 | 并发单元测试 |
| `prepare_replay_duplicate_approval_ref` | replay unique key | 同 `dead_letter_id + approval_ref` 不重复创建 | application service 测试 |
| `projection_incremental_races_with_rebuild` | projection version | 一个写成功，另一个 version conflict | projection repository 测试 |
| `source_ack_failure_then_redelivery` | source ack recovery | bus truth 不回滚，重复消费 existing | consumer 集成测试 |
| `publisher_retry_duplicate_event` | publish evidence idempotency | 重复 publish 返回 existing receipt | publisher adapter 测试 |
| `job_rerun_skips_processed_item` | job item idempotency | job 重跑不重复写 truth | job runner 测试 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §12 按以下方式回填：

```md
## 12. 并发、幂等与重入保护

### 12.1 并发与幂等控制图

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.1 摘录。

### 12.2 并发场景表

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.2 摘录。

### 12.3 幂等数据模型契约

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.3 摘录。

### 12.4 幂等键表

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.4 摘录。

### 12.5 重复调用处理矩阵

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.5 摘录。

### 12.6 重入保护表

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.6 摘录。

### 12.7 Repository / Port 实现约束

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.7 摘录。

### 12.8 幂等处理伪代码与测试切口

从 `design-calibration/03_ddd_step_13_concurrency_idempotency.md` §7.8~§7.9 摘录。
```

说明：

- 正式文档不得把 Query 写成需要幂等键的入口。
- 正式文档必须保留“job summary key 不等于业务 item idempotency key”的约束。
- Step 14 需要承接本步的 retry / timeout / backend / publisher 行为，定义配置引用和外部依赖绑定。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| recovery command 是否改为强制 `x-idempotency-key` | A. 强制；B. 保持建议提供，并用目标唯一约束兜底；C. 不支持 header key | 推荐 B | 不推翻 Step 8 口径，同时避免重复创建恢复对象 |
| job item key 是否包含 `job_run_id` | A. 包含；B. 不包含，job item 使用业务稳定 key，summary 才用 `job_run_id`；C. 两者都不用 | 推荐 B | 新 job run 也必须能识别旧 item，不能只按 run 去重 |
| `VersionConflict` 是否自动重试 | A. 所有场景自动重试；B. Command 返回冲突，job item 可有限重试或 skip；C. 全部直接失败 | 推荐 B | Command 要暴露冲突，job 需要保持批处理韧性 |
| source ack 失败后重复消费是否重新写 audit | A. 重写完整 audit；B. 返回 existing result，可写 duplicate / ack recovery audit；C. 完全静默 | 推荐 B | 保留恢复证据，同时不重复写业务状态 audit |
| publisher duplicate 是否视为成功 | A. 是，返回 existing receipt；B. 视为冲突；C. 重新发布 | 推荐 A | event 发布天然需要幂等，重复发布不应扩散下游副作用 |

---

## 10. 进入下一步条件

```text
并发、幂等和重入场景均已有实现策略，且能映射到测试切口。
冲突资源、幂等键、重复请求处理、job 重跑、source ack 恢复、publisher retry 和 projection 并发均已定义。
可以进入 Step 14,定义配置引用与外部依赖绑定。
```
