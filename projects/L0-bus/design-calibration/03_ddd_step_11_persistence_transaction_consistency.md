# Step 11. 定义持久化、事务与一致性契约

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 的数据所有权、存储对象、repository 函数、事务边界、一致性策略、outbox 发布恢复和 projection 更新恢复。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 11 | 必须输出数据所有权表、存储对象契约表、repository 函数表、事务边界表、一致性策略表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.10 | 不强制写数据库迁移脚本，但必须写清 repository 函数、事务边界和一致性策略 | 约束正式文档回填 |
| `projects/L0-bus/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已定义 repository、outbox、transport、unit of work 和 projection port | 决定持久化端口和函数签名 |
| `projects/L0-bus/design-calibration/03_ddd_step_09_function_flows.md` | 已定义每个处理流的事务开始、提交、回滚和异步发布边界 | 决定事务边界 |
| `projects/L0-bus/design-calibration/03_ddd_step_10_state_matrix.md` | 已定义状态转换矩阵和非法转换 | 决定版本、锁和状态变更一致性 |
| `projects/L0-bus/01-架构设计.md` / `02-概要设计.md` | L0-bus 拥有 bus truth、history、audit 和 read projection，不拥有业务 payload body | 决定数据所有权 |

---

## 3. SOP 问题回答

### 3.1 哪些数据对象由本仓拥有？

| 数据对象 | 是否本仓拥有 | 说明 |
|---|---|---|
| `PublicationAcceptance` | 是 | bus 对发布材料接入判定的 truth |
| `DeliveryRecord` / `DeliveryAttempt` | 是 | bus delivery 主生命周期 truth |
| `FeedbackResult` | 是 | bus 级反馈归一化结果 |
| `IdempotencyAnchor` | 是 | 本仓命令、事件和 job item 幂等 truth |
| `RetryPlan` | 是 | 本仓恢复重试计划 |
| `DeadLetterEntry` / `FailureMaterial` | 是 | 本仓失败材料和 DLQ truth |
| `ReplayPreparation` | 是 | 本仓 replay 前置材料 truth |
| `BusAuditEntry` / `DeliveryHistoryEntry` | 是 | 本仓审计和状态历史 |
| `TransportViewProjection` / `FailureSummaryProjection` / `BackendHealthView` | 是，但属于只读投影 | 从本仓 truth / audit 派生，不反写真相 |
| outbound publish evidence | 是，作为发布恢复材料 | 记录发布成功、可重试失败或拒绝原因 |

### 3.2 哪些只是引用、快照或投影？

| 对象 | 类型 | 说明 |
|---|---|---|
| `PayloadRef` / `PayloadDigest` | 引用 | 只引用 payload，不保存 payload body |
| `CoreEventEnvelopeRef` / `CommittedOutboxFactRef` | 外部已提交事实引用 | 引用 L0-core outbox / event envelope |
| `BackendCapabilityRef` / `BackendResultRef` | 外部能力 / 结果引用 | 不保存 secret 或后端私有响应正文 |
| `ReplayApprovalRef` / `AuditChainRef` | 外部治理 / 审计链引用 | replay preparation 的前置引用 |
| `TransportViewProjection` / `FailureSummaryProjection` / `BackendHealthView` | 投影 | 只读输出，不拥有业务真相 |

### 3.3 repository 函数如何命名，参数和返回是什么？

本步直接承接 Step 7 的函数签名，不新增新的 application repository trait。`BusStorePort` 只作为 infra 内部持久化实现细节，不进入 application service 调用面。

### 3.4 哪些处理流需要事务，事务内必须完成哪些写入？

| 流类型 | 是否需要写事务 | 事务粒度 |
|---|---|---|
| Command API 写路径 | 是 | 单命令一个 `UnitOfWork` |
| Inbound Event Consumer | 是 | 单 event / signal 一个 `UnitOfWork` |
| Operations Job | 是 | 每个 item 一个 `UnitOfWork`，job summary 单独记录 |
| Query API | 否 | 只读，不调用 `UnitOfWork.begin()` |
| Outbound Event publish | 不参与原 truth 事务 | truth 提交后发布，失败写 evidence / retry |

### 3.5 是否需要乐观锁、行锁、版本号、outbox 或 projection？

| 能力 | 是否需要 | 说明 |
|---|---|---|
| 乐观锁 / 版本号 | 是 | `DeliveryRecord`、`RetryPlan`、projection replace 等需要 `Version` / `ProjectionVersion` |
| 行锁 / for update | 是 | 写路径通过 `get_for_update(..., UnitOfWorkHandle uow)` 锁定 truth |
| 唯一约束 | 是 | idempotency key、publication source ref、event id、dead letter / replay 等需要唯一约束 |
| Outbox / publisher evidence | 是 | outbound event 不在 truth 事务中直接调用外部 bus |
| Projection | 是 | projection 从 truth / audit 派生，写失败不反向撤销 truth |

### 3.6 如果事件发布或 projection 更新失败，如何恢复？

| 失败类型 | 恢复策略 |
|---|---|
| outbound publish retryable failure | 保留 publish evidence，后续 publisher retry，不回滚 truth |
| outbound publish schema / boundary violation | 记录 rejected evidence，进入人工或修复流程，不回滚 truth |
| projection upsert failure | projection item 回滚，truth 保持已提交；下次 projection job 可重试 |
| projection stale / missing | Query 返回 consistency marker，不自动 rebuild |
| source ack failure | 已提交 bus truth 不回滚；重复消费时依赖 idempotency anchor |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 7 已有 repository trait，但没有存储对象和唯一约束 | 实现者不知道 collection / key / version 如何设计 | 本步补存储对象契约表 |
| Step 9 写了事务边界，但分散在每个处理流中 | 实现者难以统一事务策略 | 本步汇总为事务边界表 |
| outbound event 与 truth 提交关系容易混淆 | 可能在 truth 事务内直接调用外部 event bus | 本步规定 truth commit 后发布，失败写 evidence |
| projection 从 truth 派生但写失败口径未集中 | 可能导致 projection 失败回滚 truth | 本步规定 projection 失败不反向撤销 truth |
| 当前尚未开发 | 不应提前写数据库迁移脚本 | 本步只定义实现契约，不写迁移 SQL |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 数据所有权 | 散落在需求 / 架构 / 概要中 | 统一列出 truth、引用、投影和 evidence |
| 存储对象 | 只有 repository 名称 | 明确存储对象、主键、唯一键、索引和版本字段 |
| 事务边界 | 分散在 Step 9 | 汇总为统一事务表 |
| 锁 / 版本 | 只在函数签名里出现 | 明确哪些对象需要 optimistic version 和 for update |
| outbox / projection | 只说明异步 | 明确失败恢复和一致性策略 |

---

## 6. 设计取舍

### 6.1 P0 是否写具体数据库迁移脚本

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：现在写 SQL / migration | 看似完整，但会提前绑定数据库产品 | 不采用 |
| 方案 B：只写存储对象契约、key、index、version，迁移脚本等实现阶段决定 | 推荐 |
| 方案 C：完全不写存储对象 | 实现者无法 1:1 还原 repository | 不采用 |

推荐方案 B。当前 L0-bus P0 有 in-memory default path，尚未确认 durable store 产品；写实现契约比写具体迁移更稳。

### 6.2 application service 是否直接依赖 generic `BusStorePort`

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：application 直接调用 `BusStorePort` | 隐藏业务语义，service 会操作 generic record | 不采用 |
| 方案 B：application 只调用业务 repository trait，generic store 作为 infra 内部实现细节 | 推荐 |
| 方案 C：每个对象一个底层 store trait | 过度拆分 | 不采用 |

推荐方案 B。业务 repository 是 application port，具体 store 只在 infra adapter 内部存在。

### 6.3 outbound event 是否与 truth 同事务发布到外部 event bus

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：truth 事务内直接调用外部 event bus | publisher 失败会污染 truth 事务 | 不采用 |
| 方案 B：truth 提交后发布，失败写 evidence / retry | 推荐 |
| 方案 C：不发布事件，只靠 query | 下游无法订阅 bus fact | 不采用 |

推荐方案 B。它保持 truth 优先，event publishing 可恢复。

### 6.4 Projection 更新是否与 truth 同事务

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：truth 与 projection 同事务 | query 新鲜度高，但写路径更重 | 不采用为 P0 默认 |
| 方案 B：projection 异步派生，Query 返回 consistency marker | 推荐 |
| 方案 C：projection 缺失时 Query 自动修复 | 查询出现隐藏写副作用 | 不采用 |

推荐方案 B。projection 是只读输出，不应反向影响 truth。

---

## 7. 结构化中间产物

### 7.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `PublicationAcceptance` | `domain` truth / `infra` store | `PublicationAcceptanceService` | Command result、Query、projection job | source ref + idempotency key 唯一；写入后不可从终态回退 |
| `DeliveryRecord` | `domain` truth / `infra` store | delivery / feedback / recovery services | worker、Query、projection job | 写路径必须 `get_for_update`；保存必须带 `expected_version` |
| `DeliveryAttempt` | `domain` child record / `infra` store | `DeliveryRecord.start_attempt(...)` 相关 service | delivery / retry / audit | attempt no 在 delivery 内递增唯一 |
| `DeliveryHistoryEntry` | `domain` history / `infra` store | 所有 delivery 状态变更写路径 | Query、projection、audit | 每次 delivery 状态变化必须写 history |
| `FeedbackResult` | `domain` truth / `infra` store | feedback / backend signal / timeout service | recovery、Query、projection | feedback id 唯一；幂等重复不重复写 feedback |
| `IdempotencyAnchor` | `domain` truth / `infra` store | Command / consumer 写路径 | Command / consumer / job item | `scope + key` 唯一；与业务 truth 同事务协调 |
| `RetryPlan` | `domain` truth / `infra` store | recovery service / retry job | retry job、operator Query | retry plan version 乐观锁；active plan 约束 |
| `DeadLetterEntry` | `domain` truth / `infra` store | recovery service | replay preparation、Query | delivery id 维度最多一个 active DLQ |
| `FailureMaterial` | `domain` truth / `infra` store | recovery service / feedback flow | governance、replay preparation、projection | 不保存 governance decision 正文 |
| `ReplayPreparation` | `domain` truth / `infra` store | replay preparation service | operator / replay executor boundary | dead letter + approval ref 唯一或幂等 |
| `BusAuditEntry` | `domain` audit / `infra` store | 所有写路径、projection / capability job | Query、projection、audit viewer | append-only，不允许 update / delete |
| `TransportViewProjection` | read projection / `infra` store | read output projection job | Query、SDK / consumer | projection version 独立，不能反写真相 |
| `FailureSummaryProjection` | read projection / `infra` store | read output projection job | Query、governance / operator | 不生成 governance decision |
| `BackendHealthView` | read projection / `infra` store | backend capability job | Query、observability | 不保存 secret |
| outbound publish evidence | infra recovery material | `OutboxPublisherService` | publisher retry / observability | truth 已提交后记录，不回滚 truth |

### 7.2 引用、快照和投影边界表

| 对象 | 归类 | 本仓是否保存正文 | 保存内容 |
|---|---|---|---|
| `PayloadRef` | 外部 payload 引用 | 否 | ref、digest、kind |
| `CommittedOutboxFactRef` | L0-core committed fact 引用 | 否 | ref、source、event id、digest |
| `CoreEventEnvelopeRef` | L0-core event envelope 引用 | 否 | envelope ref、trace ref |
| `BackendCapabilityRef` | backend 能力引用 | 否 | profile ref、backend kind、capability version |
| `BackendResultRef` | backend 结果引用 | 否 | result ref、归一化状态摘要 |
| `ReplayApprovalRef` | 外部 replay 审批引用 | 否 | approval ref |
| `AuditChainRef` | 审计链引用 | 否 | audit chain ref |
| `TransportViewProjection` | 投影 | 是，只读 projection | delivery 状态视图和 consistency marker |
| `FailureSummaryProjection` | 投影 | 是，只读 projection | failure material ref 和失败摘要 |
| `BackendHealthView` | 投影 | 是，只读 projection | backend availability / checked_at，不含 secret |

### 7.3 存储对象契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `publication_acceptances` | 保存 publication acceptance truth | `publication_id`；唯一 `source_system + source_record_ref` | `status`、`payload_ref`、`created_at` | `version` |
| `delivery_records` | 保存 delivery truth | `delivery_id`；唯一 `publication_id + subscriber_ref` | `status`、`publication_id`、`next_run_at`、`backend_capability_ref` | `version` |
| `delivery_attempts` | 保存 delivery attempts | `attempt_id`；唯一 `delivery_id + attempt_no` | `delivery_id`、`status`、`started_at` | `version` |
| `delivery_history_entries` | 保存 delivery 状态历史 | `history_id` | `delivery_id`、`from_status + to_status`、`occurred_at` | append-only，无业务 version |
| `feedback_results` | 保存 feedback result | `feedback_id`；唯一 `delivery_id + external_feedback_ref` | `delivery_id`、`status`、`observed_at` | `version` |
| `idempotency_anchors` | 保存幂等锚点 | `anchor_id`；唯一 `scope + idempotency_key` | `record_ref`、`created_at` | `version` |
| `retry_plans` | 保存 retry plan | `retry_plan_id`；唯一 active `delivery_id` | `status`、`next_run_at`、`delivery_id` | `version` |
| `dead_letter_entries` | 保存 dead letter | `dead_letter_id`；唯一 active `delivery_id` | `status`、`failure_material_id`、`created_at` | `version` |
| `failure_materials` | 保存失败材料 | `failure_material_id` | `delivery_id`、`failure_kind`、`created_at` | `version` |
| `replay_preparations` | 保存 replay preparation | `replay_preparation_id`；唯一 `dead_letter_id + approval_ref` | `status`、`dead_letter_id`、`created_at` | `version` |
| `bus_audit_entries` | 保存 append-only audit | `audit_id` / `audit_sequence` | `record_ref`、`event_kind`、`occurred_at`、`trace_id` | append-only sequence |
| `transport_view_projection` | 保存 transport view | `transport_view_id`；唯一 `delivery_id` | `status`、`projection_version`、`updated_at` | `projection_version` |
| `failure_summary_projection` | 保存 failure summary | `failure_summary_id`；唯一 `failure_material_id` | `delivery_id`、`failure_kind`、`updated_at` | `projection_version` |
| `backend_health_projection` | 保存 backend health view | `backend_id` | `backend_kind`、`capability_status`、`last_checked_at` | `projection_version` |
| `outbound_publish_evidence` | 保存 outbound event 发布证据 | `publish_evidence_id`；唯一 `event_id + schema_version` | `status`、`source_record_ref`、`next_retry_at` | `version` |

说明：

- 上表是实现契约，不是数据库迁移脚本。
- P0 in-memory adapter 可以用 HashMap / indexed map 满足这些 key 和 index 语义。
- durable adapter 必须保持同样唯一约束、append-only 约束和 version 语义。

### 7.4 Repository 到存储对象映射

| Repository / Port | 主要存储对象 | 说明 |
|---|---|---|
| `PublicationRepository` | `publication_acceptances` | publication acceptance truth |
| `DeliveryRepository` | `delivery_records`、`delivery_attempts`、`delivery_history_entries` | delivery truth、attempt 和 history |
| `FeedbackRepository` | `feedback_results` | feedback truth 和失败查询 |
| `IdempotencyRepository` | `idempotency_anchors` | 幂等锚点 |
| `RecoveryRepository` | `retry_plans`、`dead_letter_entries`、`failure_materials`、`replay_preparations` | 恢复闭环 truth |
| `AuditTrailRepository` | `bus_audit_entries` | append-only audit |
| `ReadProjectionRepository` | `transport_view_projection`、`failure_summary_projection`、`backend_health_projection` | 只读投影 |
| `OutboxFactSourcePort` | 外部 source / in-memory source queue | 不拥有 L0-core outbox truth |
| `OutboxPublisherPort` | 外部 event bus / in-memory sink、`outbound_publish_evidence` | 发布已提交 bus fact |
| `UnitOfWork` | infra store transaction / memory transaction | 不暴露底层事务对象 |

### 7.5 Repository 函数契约表

#### 7.5.1 Publication / Delivery / Feedback

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `PublicationRepository.insert(PublicationAcceptance acceptance, UnitOfWorkHandle uow)` | 插入 publication acceptance | 必须在写事务内；检查 source 唯一 | `Version` | `RepositoryError` |
| `PublicationRepository.get(PublicationId publication_id)` | 只读查询 acceptance | 无写锁 | `Option<PublicationAcceptance>` | `RepositoryError` |
| `PublicationRepository.get_for_update(PublicationId publication_id, UnitOfWorkHandle uow)` | 写事务内读取并锁定 acceptance | 必须持有 `uow` | `Option<PublicationAcceptance>` | `RepositoryError` |
| `DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)` | 锁定 delivery truth | 必须持有 `uow`；P0 memory adapter 用 per-record lock 模拟 | `Option<DeliveryRecord>` | `RepositoryError` |
| `DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)` | 保存 delivery truth | 必须检查 `expected_version`；状态变更同事务写 history / audit | `Version` | `RepositoryError` |
| `DeliveryRepository.find_schedulable(DeliveryScanCursor cursor, PageLimit limit)` | 扫描可推进 delivery | 只读；不锁定候选 | `Vec<DeliveryRecord>` | `RepositoryError` |
| `DeliveryRepository.scan_truth(TruthScanCursor cursor, PageLimit limit)` | 扫描 truth 用于 projection rebuild | 只读；必须稳定分页 | `TruthScanPage<DeliveryRecord>` | `RepositoryError` |
| `DeliveryRepository.load_history(DeliveryId delivery_id, PageRequest page)` | 读取 delivery history | 只读 | `DeliveryHistoryPage` | `RepositoryError` |
| `FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)` | 插入 feedback result | 必须在写事务内；检查 external feedback 唯一 | `Version` | `RepositoryError` |
| `FeedbackRepository.find_by_delivery(DeliveryId delivery_id, PageRequest page)` | 查询 feedback | 只读 | `FeedbackResultPage` | `RepositoryError` |
| `FeedbackRepository.get_failure(DeliveryId delivery_id)` | 获取失败 feedback | 只读；用于 recovery | `Option<FeedbackResult>` | `RepositoryError` |

#### 7.5.2 Idempotency / Recovery / Audit

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)` | 查询幂等锚点 | 只读；可在写事务前或事务内调用 | `Option<IdempotencyAnchor>` | `RepositoryError` |
| `IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)` | 写入幂等锚点 | 必须与业务 truth 同事务协调；`scope + key` 唯一 | `()` | `RepositoryError` |
| `IdempotencyRepository.mark_conflict(IdempotencyScope scope, IdempotencyKey key, IdempotencyConflict conflict, UnitOfWorkHandle uow)` | 记录幂等冲突 | 写事务内；不覆盖原 anchor | `()` | `RepositoryError` |
| `RecoveryRepository.save_retry_plan(RetryPlan retry_plan, Option<Version> expected_version, UnitOfWorkHandle uow)` | 创建或更新 retry plan | 新建时检查 active delivery 唯一；更新时检查 version | `Version` | `RepositoryError` |
| `RecoveryRepository.find_due_retry(RetryScanCursor cursor, PageLimit limit, Timestamp now)` | 扫描到期 retry plan | 只读；不锁定候选 | `Vec<RetryPlan>` | `RepositoryError` |
| `RecoveryRepository.save_dead_letter(DeadLetterEntry entry, FailureMaterial material, UnitOfWorkHandle uow)` | 保存 DLQ 和 failure material | 必须与 delivery dead-letter 状态同事务 | `Version` | `RepositoryError` |
| `RecoveryRepository.get_dead_letter(DeadLetterId dead_letter_id)` | 读取 DLQ | 只读 | `Option<DeadLetterEntry>` | `RepositoryError` |
| `RecoveryRepository.save_replay_preparation(ReplayPreparation preparation, UnitOfWorkHandle uow)` | 保存 replay preparation | 检查 `dead_letter_id + approval_ref` 唯一 | `Version` | `RepositoryError` |
| `RecoveryRepository.get_failure_material(FailureMaterialId failure_material_id)` | 读取 failure material | 只读；不得返回 governance decision 正文 | `Option<FailureMaterial>` | `RepositoryError` |
| `AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)` | 追加 audit entry | append-only；必须在写事务内 | `AuditSequence` | `RepositoryError` |
| `AuditTrailRepository.scan_committed(AuditCursor cursor, PageLimit limit)` | 扫描 committed audit | 只读；稳定 cursor | `AuditScanPage` | `RepositoryError` |
| `AuditTrailRepository.list(AuditFilter filter, PageRequest page)` | 查询 audit trail | 只读 | `BusAuditTrailView` | `RepositoryError` |
| `AuditTrailRepository.load_chain(AuditChainRef chain_ref)` | 读取 audit chain | 只读；用于 replay preparation | `AuditChain` | `RepositoryError` |

#### 7.5.3 Projection / Source / Publisher / UnitOfWork

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `ReadProjectionRepository.upsert_transport_view(TransportViewProjection projection, UnitOfWorkHandle uow)` | 写 transport view | projection 写事务内；不写 truth | `ProjectionVersion` | `RepositoryError` |
| `ReadProjectionRepository.upsert_failure_summary(FailureSummaryProjection projection, UnitOfWorkHandle uow)` | 写 failure summary | projection 写事务内；不得生成 governance decision | `ProjectionVersion` | `RepositoryError` |
| `ReadProjectionRepository.upsert_backend_health(BackendHealthView view, UnitOfWorkHandle uow)` | 写 backend health view | projection 写事务内；不得保存 secret | `ProjectionVersion` | `RepositoryError` |
| `ReadProjectionRepository.get_transport_view(ProjectionKey key)` | 读 transport view | 只读 | `Option<TransportView>` | `RepositoryError` |
| `ReadProjectionRepository.get_failure_summary(ProjectionKey key)` | 读 failure summary | 只读 | `Option<FailureSummaryView>` | `RepositoryError` |
| `ReadProjectionRepository.replace_batch(ProjectionBatch batch, UnitOfWorkHandle uow)` | projection rebuild 批量替换 | 单 batch 写事务；检查 projection version | `ProjectionReplaceReceipt` | `RepositoryError` |
| `OutboxFactSourcePort.poll_committed(OutboxCursor cursor, PageLimit limit)` | 拉取上游 committed facts | 只读 source；不拥有 source truth | `CommittedOutboxFactPage` | `SourcePortError` |
| `OutboxFactSourcePort.ack_consumed(CommittedOutboxFactRef fact_ref, ConsumerMarker marker)` | 确认 source fact 已消费 | bus truth 提交后调用；失败不回滚 truth | `()` | `SourcePortError` |
| `OutboxPublisherPort.publish(BusOutboundEvent event, TraceContextRef trace)` | 发布 outbound event | truth 提交后调用；失败写 evidence | `PublishReceipt` | `PublisherPortError` |
| `OutboxPublisherPort.publish_batch(BusOutboundEventBatch batch, TraceContextRef trace)` | 批量发布 outbound event | 每个 event 必须可幂等 | `PublishBatchReceipt` | `PublisherPortError` |
| `UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)` | 开启写事务 | application service 调用 | `UnitOfWorkHandle` | `UnitOfWorkError` |
| `UnitOfWork.commit(UnitOfWorkHandle handle)` | 提交写事务 | 所有同事务写入成功后调用 | `CommitReceipt` | `UnitOfWorkError` |
| `UnitOfWork.rollback(UnitOfWorkHandle handle, RollbackReason reason)` | 回滚写事务 | repository / domain / boundary error 后调用 | `()` | `UnitOfWorkError` |

### 7.6 锁、版本与唯一约束

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 说明 |
|---|---|---|---|---|
| 两个 worker 同时推进同一 delivery | `delivery_records.delivery_id` | `get_for_update` + `expected_version` | `RepositoryError::VersionConflict` | 一个成功，另一个重试或 skip |
| feedback 与 backend signal 同时更新 delivery | `delivery_records.delivery_id`、`feedback_results` | delivery lock + feedback 唯一键 | `RepositoryError::VersionConflict` / `ApplicationError::DuplicateFeedback` | 防止重复完成或失败 |
| retry cycle 与 dead-letter 同时处理 failed delivery | `delivery_records.delivery_id`、`retry_plans`、`dead_letter_entries` | delivery lock + active retry / DLQ 唯一约束 | `ApplicationError::RecoveryConflict` | DLQ 和 retry 不能同时越权 |
| replay preparation 重复提交 | `replay_preparations.dead_letter_id + approval_ref` | 唯一约束 | `RepositoryError::UniqueViolation` | 返回已有或 conflict |
| Command / Event 重放 | `idempotency_anchors.scope + idempotency_key` | 唯一约束 + anchor read | `ApplicationError::IdempotencyConflict` | 重复请求返回已有结果 |
| projection rebuild 与增量 projection 并发 | projection key / version | `projection_version` | `DomainError::ProjectionVersionConflict` | 失败方重试 |
| audit append 并发 | `audit_sequence` | 单调 sequence / append-only | `RepositoryError::SequenceConflict` | 不允许覆盖 |

### 7.7 UnitOfWork 实现契约

```text
Application Service
  | UnitOfWork.begin(purpose, actor)
  v
UnitOfWorkHandle
  | passed to repository write methods
  v
Repository Adapter
  | stage writes in memory transaction / durable transaction
  v
UnitOfWork.commit(handle)
  | atomically publish staged writes to local store
```

关键说明：

- `UnitOfWorkHandle` 只能在 application service 内部流转，不暴露给 API / worker / jobs handler。
- repository write method 必须校验 `UnitOfWorkHandle` 与当前 adapter store 兼容。
- `commit` 成功后，truth / audit / idempotency / history 才被视为 committed。
- `rollback` 必须清理 staged writes 和 locks。

### 7.8 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `AcceptPublicationFlow` | `PublicationAcceptanceService.accept(...)` 调用 `UnitOfWork.begin(...)` | acceptance、audit、idempotency 写入后 | validation 后的 domain / repository / boundary error | `PublicationAcceptance`、`BusAuditEntry`、`IdempotencyAnchor` |
| `ConsumeCommittedOutboxFactFlow` | `accept_from_outbox_fact(...)` 调用 `UnitOfWork.begin(...)` | acceptance、audit、idempotency 写入后 | invalid fact、repository failure、boundary violation | `PublicationAcceptance`、`BusAuditEntry`、`IdempotencyAnchor` |
| `RunOutboxRelayFlow` | 每个 fact 进入 `accept_from_outbox_fact(...)` | 每个 fact 单独提交 | 单 fact 处理失败 | 单 fact 的 acceptance / audit / idempotency |
| `RunDeliveryProgressionFlow` | `progress_one(...)` 调用 `UnitOfWork.begin(...)` | delivery、attempt、history、audit 写入后 | state conflict、backend result violation、repository conflict | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryHistoryEntry`、`BusAuditEntry` |
| `RecordDeliveryFeedbackFlow` | `FeedbackRecordingService.record(...)` 调用 `UnitOfWork.begin(...)` | feedback、delivery、audit、idempotency 写入后 | duplicate conflict 以外错误、invalid transition、repository failure | `FeedbackResult`、`DeliveryRecord`、`DeliveryHistoryEntry`、`BusAuditEntry`、`IdempotencyAnchor` |
| `ConsumeBackendDeliverySignalFlow` | `record_backend_signal(...)` 调用 `UnitOfWork.begin(...)` | feedback、delivery、audit、idempotency 写入后 | unknown delivery、invalid backend status、repository failure | `FeedbackResult`、`DeliveryRecord`、`DeliveryHistoryEntry`、`BusAuditEntry`、`IdempotencyAnchor` |
| `ConsumeTimeoutSignalFlow` | `record_timeout(...)` 调用 `UnitOfWork.begin(...)` | feedback、delivery、audit、idempotency 写入后 | unknown delivery、invalid transition、repository failure | `FeedbackResult`、`DeliveryRecord`、`DeliveryHistoryEntry`、`BusAuditEntry`、`IdempotencyAnchor` |
| `RequestRetryFlow` | `request_retry(...)` 调用 `UnitOfWork.begin(...)` | retry plan、audit 写入后 | missing failure material、not eligible、active retry conflict | `RetryPlan`、`BusAuditEntry` |
| `RunRetryCycleFlow` | 每个 retry plan 调用 `UnitOfWork.begin(...)` | delivery、retry plan、audit 写入后 | delivery missing、version conflict、backend boundary violation | `DeliveryRecord`、`DeliveryAttempt`、`RetryPlan`、`BusAuditEntry` |
| `MoveDeliveryToDeadLetterFlow` | `move_to_dead_letter(...)` 调用 `UnitOfWork.begin(...)` | DLQ、failure material、delivery、audit 写入后 | missing failure、not eligible、repository failure | `DeadLetterEntry`、`FailureMaterial`、`DeliveryRecord`、`BusAuditEntry` |
| `PrepareReplayFlow` | `ReplayPreparationService.prepare(...)` 调用 `UnitOfWork.begin(...)` | replay preparation、audit 写入后 | dead letter missing、audit chain invalid、approval invalid | `ReplayPreparation`、`BusAuditEntry` |
| `RunReadOutputProjectionFlow` | 每个 audit item 调用 `UnitOfWork.begin(...)` | projection upsert 后 | projection source missing、boundary violation、store failure | `TransportViewProjection` / `FailureSummaryProjection` |
| `RebuildReadProjectionFlow` | batch derive 完成后调用 `UnitOfWork.begin(...)` | `replace_batch` 和 rebuild audit 后 | version conflict、boundary violation、store failure | projection batch、`BusAuditEntry` |
| `CheckBackendCapabilityFlow` | backend check 完成后调用 `UnitOfWork.begin(...)` | backend health view、audit 写入后 | report boundary violation、projection store failure | `BackendHealthView`、`BusAuditEntry` |
| `QueryReadOnlyFlow` | 不开启写事务 | 不适用 | 不适用 | 不写任何 truth |
| `OutboundEventPublishFlow` | 不参与原 truth 事务 | publisher receipt / evidence 记录完成后 | publisher unavailable、schema violation | publish evidence，不回滚 truth |

### 7.9 一致性策略表

| 一致性场景 | 策略 | 实现要求 | 失败恢复 |
|---|---|---|---|
| truth + audit | 同一 `UnitOfWork` 提交 | 所有状态变更必须写 `BusAuditEntry` 或 history | 提交失败整体回滚 |
| truth + idempotency anchor | 同一 `UnitOfWork` 协调 | 成功写 truth 后必须 bind anchor | anchor 写失败则 truth 回滚 |
| delivery + history | 同一 `UnitOfWork` 提交 | `DeliveryStatus` 变化必须写 `DeliveryHistoryEntry` | history 写失败则 delivery 回滚 |
| retry + delivery | 同一 `UnitOfWork` 提交 | retry attempt 更新 delivery 与 retry plan | 任一写失败整体回滚 |
| dead letter + failure material + delivery | 同一 `UnitOfWork` 提交 | DLQ 与 `DeliveryStatus::DeadLettered` 原子化 | 任一写失败整体回滚 |
| replay preparation + audit | 同一 `UnitOfWork` 提交 | preparation ready 必须可审计 | audit 写失败则 preparation 回滚 |
| source ack + bus truth | bus truth 先提交，ack 后执行 | ack 不在 bus truth 事务内 | ack 失败时重复消费由 idempotency anchor 兜底 |
| outbound event + truth | truth 先提交，event 后发布 | publisher 不在 truth 事务内 | publish failure 写 evidence，后续 retry |
| projection + truth | 异步派生 | projection 只从 committed truth / audit 读取 | projection 失败不回滚 truth；下次 job 重试 |
| query + projection | eventual consistency | Query 返回 consistency marker | stale / missing 不自动 rebuild |
| backend check + delivery truth | 隔离 | capability check 只更新 health view | 不重调度 delivery |

### 7.10 Outbox / Publisher 恢复契约

#### 7.10.1 发布状态

| 状态 | 说明 | 后续动作 |
|---|---|---|
| `Published` | event 已成功发布，收到 receipt | 记录 receipt，结束 |
| `RetryableFailed` | publisher 暂时不可用或超时 | 写 evidence，按 retry policy 重试 |
| `Rejected` | schema / boundary violation | 写 rejected evidence，进入人工修复 |
| `Duplicate` | event id 已发布 | 返回已有 receipt，不重复发布 |

#### 7.10.2 发布恢复流程

```text
Committed Bus Fact
  |
  v
OutboxPublisherService.collect(...)
  |
  v
PayloadBoundaryGuard.allows_reference(...)
  |
  v
OutboxPublisherPort.publish(...)
  |
  +-- success -----> record Published evidence
  |
  +-- retryable ---> record RetryableFailed evidence -> retry later
  |
  +-- rejected ----> record Rejected evidence -> manual fix
```

关键说明：

- publisher failure 不得回滚已经 committed 的 bus truth。
- evidence 必须包含 `event_id`、`source_record_ref`、`schema_version`、`trace_ref` 和错误分类。
- P0 in-memory adapter 可以用 in-memory sink 和 evidence map 实现；durable adapter 后续保持同语义。

### 7.11 Projection 恢复契约

| 场景 | 检测位置 | 处理方式 | 对 Query 的影响 |
|---|---|---|---|
| projection upsert failure | `RunReadOutputProjectionFlow` | item 回滚，job summary 标记 failed | 旧 projection 继续可读或返回 stale marker |
| projection source missing | projection job | item skipped，记录 consistency evidence | Query 返回 not ready / source missing marker |
| projection stale | Query / projection job | 不自动修复；由 job 或 operator rebuild | Query 返回 stale marker |
| rebuild version conflict | `RebuildReadProjectionFlow` | batch 回滚，返回 conflict | Query 继续读旧 projection / stale marker |
| projection boundary violation | projection derive / policy | 拒绝写 projection，记录 audit / evidence | Query 不返回违规字段 |

### 7.12 In-memory default path 约束

| 约束 | 实现要求 |
|---|---|
| 必须模拟唯一约束 | HashMap key 必须覆盖 `scope + idempotency_key`、`delivery_id + attempt_no` 等唯一键 |
| 必须模拟乐观版本 | 每次 save 递增 version，`expected_version` 不匹配时报 conflict |
| 必须模拟 UnitOfWork | staged writes 在 commit 前不可见，rollback 清理 staged writes |
| 必须模拟 append-only audit | audit entry 只能 append，不能 update / delete |
| 必须支持 deterministic tests | clock / id generator 可替换，store 可 reset |

### 7.13 不在本步落地的内容

| 内容 | 原因 | 后续位置 |
|---|---|---|
| SQL migration / DDL | 当前未确认 durable store 产品 | 实现阶段或持久化 adapter 专项 |
| 具体数据库隔离级别 | P0 in-memory default path 先行 | durable store adapter 设计 |
| publisher retry 调度参数 | 属于配置 / 运维策略 | Step 14 配置引用与外部依赖绑定 |
| 详细错误类型枚举 | 属于错误模型 | Step 12 |
| 幂等窗口和重入保护 | 属于并发 / 幂等专项 | Step 13 |
| 可观测性字段和指标 | 属于审计埋点专项 | Step 15 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §10 按以下方式回填：

```md
## 10. 数据持久化、事务与一致性契约

### 10.1 数据所有权实现表

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.1~§7.2 摘录。

### 10.2 存储对象契约表

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.3 摘录。

### 10.3 Repository 到存储对象映射

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.4 摘录。

### 10.4 Repository 函数契约表

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.5 摘录。

### 10.5 锁、版本与唯一约束

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.6 摘录。

### 10.6 UnitOfWork 实现契约

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.7 摘录。

### 10.7 事务边界表

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.8 摘录。

### 10.8 一致性策略

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.9~§7.12 摘录。

### 10.9 非本步范围

从 `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` §7.13 摘录。
```

说明：

- 正式文档不写 SQL migration。
- 正式文档必须明确 P0 in-memory default path 与未来 durable adapter 的同语义要求。
- Step 12 需要承接本步的 repository / UnitOfWork / publisher / projection failure，定义错误模型和恢复口径。
- Step 13 需要承接本步的锁、版本和唯一约束，定义并发、幂等与重入保护。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| P0 是否写 SQL migration | A. 写；B. 不写，只写存储契约；C. 完全不写持久化约束 | 推荐 B | 当前未确认 durable store，P0 in-memory default path 更适合先落实现 |
| application 是否暴露 `BusStorePort` | A. 暴露；B. 不暴露，只在 infra 内部使用；C. 删除 store 概念 | 推荐 B | application 应依赖业务 repository，避免 generic store 泄漏 |
| projection 是否与 truth 同事务 | A. 同事务；B. 异步派生；C. Query 自动修复 | 推荐 B | projection 是只读输出，失败不应回滚 truth |
| publisher evidence 是否需要独立 repository | A. 独立 repository；B. 先作为 publisher adapter / audit evidence，Step 15 细化；C. 只日志 | 推荐 B | 避免本步新增未定义 port，同时保留恢复证据 |
| backend dispatch 是否应移出 delivery truth 事务 | A. 现在移出；B. P0 保持 Step 9 口径，Step 11 标注后续 durable adapter 可细化；C. 永远在事务内 | 推荐 B | P0 in-memory 可测，外部 backend 一致性需要 durable adapter 专项再细化 |

---

## 10. 进入下一步条件

```text
所有会影响数据写入、事务、一致性和恢复的规则已经收稳。
数据所有权、存储对象、repository 函数、锁 / 版本、事务边界、outbox 和 projection 恢复均已定义。
可以进入 Step 12,定义错误模型、异常分支与恢复口径。
```
