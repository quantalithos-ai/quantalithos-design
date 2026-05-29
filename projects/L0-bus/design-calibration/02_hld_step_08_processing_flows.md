# Step 8. 关键处理流 / 重要函数数据流

## 1. Step 状态

- 状态：[x] 已重写
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-bus/02-概要设计.md` §8 关键处理流 / 重要函数数据流

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 7 API / 接口骨架 | Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 分类，以及 Step 8 处理流承接清单 |
| Step 6 关键对象 | `PublicationAcceptance`、`DeliveryRecord`、`DeliveryAttempt`、`FeedbackResult`、`IdempotencyAnchor`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`BusAuditEntry`、projection、backend capability 等 |
| Step 5 主要组成部分 | 发布材料接入、delivery 推进、反馈幂等、失败恢复、审计只读输出、后端适配边界 |
| 本步规范约束 | 必须画关键处理流 ASCII 图；函数调用参数写成 `TypeName param_name`；不写完整伪代码、SQL、错误码全集、retry 参数、HTTP path、topic 或完整 Rust 签名 |

已确认结论：

```text
Step 8 的主语来自 Step 7。
凡 Step 7 标记为“需要独立处理流”的接口 / Consumer / Job，本步必须独立展开或明确说明变更理由。
```

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何从入口进入 application service、domain object、repository / outbox？

回答：

`AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` 都必须经过 API / command adapter、application service、domain object / policy、repository / unit of work、audit / history / outbox。入口不能直接写 repository，worker 也不能绕过 domain policy 改状态。

### 3.2 每个关键 Query 如何从入口读取 projection 或只读视图？

回答：

Query 走通用只读路径：Query API 接收 `ActorContext actor`，Query service 读取 projection / history / audit / readonly repository，经过 `ReadOnlyOutputPolicy` 检查后返回 view 和 consistency marker。普通 Query 不画逐个独立流；如果详细设计发现某个 Query 需要复杂裁剪、fallback 或 projection not ready 分支，再在 03 中独立展开。

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录？

回答：

`ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` 必须先校验 event id、source reference 和幂等键，再转换成本地 `PublicationMaterial`、`DeliveryAttempt` 或 `FeedbackResult`。事件消费不能把外部事实当成本地真相直接保存，必须经过本仓对象和策略归一化。

### 3.4 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账？

回答：

`RunOutboxRelay`、`RunDeliveryProgression`、`RunRetryCycle`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability` 基于已持久化 truth、cursor、checkpoint 或 capability source 推进后台流程。Job 可以写 truth、history、audit、projection 或运行状态，但必须遵守与 Command 相同的 domain rule。

### 3.5 处理流中点名的关键函数调用，其参数分别是什么类型？

回答：

图中函数调用统一写成：

```text
Object.method(TypeName param_name, TypeName param_name)
TypeName::factory(TypeName param_name, TypeName param_name)
```

不允许写裸参数名，例如 `record(actor)`。

### 3.6 哪些处理步骤必须在概要设计点名，哪些完整函数调用链应留给详细设计？

回答：

必须点名：入口类型、application service、domain object / policy、repository / port、unit of work、audit / history、projection / outbox publisher 和最终 result / event。完整 handler、trait、返回类型、错误码、数据库锁、SQL、retry interval、adapter SDK 调用留给详细设计。

### 3.7 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流？

回答：

本步独立展开：`AcceptPublication`、`ConsumeCommittedOutboxFact`、`RunDeliveryProgression`、`RecordDeliveryFeedback`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal`、`RequestRetry`、`RunRetryCycle`、`MoveDeliveryToDeadLetter`、`PrepareReplay`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability`。

### 3.8 哪些 Query 可以只走通用读路径，哪些 Query 必须画独立处理流？

回答：

`GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` 当前走通用只读路径即可。`GetFailureSummary` 和 `GetBackendHealthView` 的读取来源差异在覆盖清单中说明，详细设计可再补独立分支。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 Step 8 §7.6 | 把 retry、DLQ、replay preparation 合并成一个恢复流 | 无法分别承接 `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation` 的状态和规则 |
| 旧 Step 8 | 未独立展开 backend signal、timeout signal | 后端归一化和 timeout 反馈边界不清 |
| 旧 Step 8 | `CheckBackendCapability` 被标记为不独立展开 | 后端能力、secret 隔离和 capability view 边界不够清楚 |
| 旧 Step 8 | Query 和 outbound event 的未展开原因不够系统 | 不能判断是设计取舍还是遗漏 |
| 旧 Step 8 | 部分图不符合最新 Step 7 覆盖清单 | 新版接口骨架无法被处理流完整承接 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖依据 | 按代表性流程选择 | 按 Step 7 承接清单逐项覆盖 | 防止关键接口遗漏 |
| 恢复路径 | retry / DLQ / replay 合并 | `RequestRetry`、`RunRetryCycle`、`MoveDeliveryToDeadLetter`、`PrepareReplay` 分开 | 每个对象和状态边界不同 |
| 信号消费 | backend signal / timeout 未独立 | 分别独立画流 | 区分后端归一化和 timeout 反馈 |
| Projection | 只写增量 projection | 增量 projection 和 rebuild 分开 | 两者一致性边界不同 |
| 后端能力 | 不独立 | `CheckBackendCapability` 独立展开 | secret 隔离和 capability policy 需要明确 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只画一条 publish -> delivery -> feedback 总链路 | 文档短 | 无法支撑详细设计一比一还原 | 不采用 |
| 方案 B：为每个 Query / Event 都画独立流 | 覆盖最全 | Query 和 event publisher 大量重复，概要设计过重 | 不采用 |
| 方案 C：P0 写路径、事件消费、关键 job 独立画；普通 Query / Outbound Event 用通用流和覆盖说明 | 覆盖关键一致性路径，篇幅可控 | 详细设计仍需补协议和异常 | 采用 |

---

## 7. 结构化中间产物

### 7.1 处理流覆盖清单

| 接口 / Job / Consumer | 处理方式 | 原因 |
|---|---|---|
| `AcceptPublication` | 独立处理流 | 发布材料进入 bus truth 的主写路径 |
| `ConsumeCommittedOutboxFact` | 独立处理流 | core outbox fact 转本地接入事实 |
| `RunDeliveryProgression` | 独立处理流 | delivery / attempt 推进主路径 |
| `RecordDeliveryFeedback` | 独立处理流 | feedback、幂等、history 和 recovery 候选写路径 |
| `ConsumeBackendDeliverySignal` | 独立处理流 | 后端信号必须归一化后影响本地状态 |
| `ConsumeTimeoutSignal` | 独立处理流 | timeout 形成 bus 级反馈和恢复候选 |
| `RequestRetry` | 独立处理流 | 创建或更新 retry plan |
| `RunRetryCycle` | 独立处理流 | due retry 到新 attempt 的后台推进 |
| `MoveDeliveryToDeadLetter` | 独立处理流 | DLQ 和 failure material 边界独立 |
| `PrepareReplay` | 独立处理流 | replay 前置材料和审计链独立 |
| `RunReadOutputProjection` | 独立处理流 | truth 到 projection 的增量派生 |
| `RebuildReadProjection` | 独立处理流 | 受控重建 projection，不改 truth |
| `CheckBackendCapability` | 独立处理流 | 后端能力和 secret 隔离边界 |
| Query API | 通用只读流 | 不改写真相，逐个画会重复 |
| Outbound Event | 通用事实发布流 | 统一通过已提交事实和 outbox publisher 传播 |

### 7.2 通用写路径骨架

```text
<Command / Event / Job>
  |
  v
<Inbound Adapter / Consumer / Job>
  - 接收 ActorContext actor / CommandMetadata meta / JobMetadata meta
  - 校验 event id 或 IdempotencyKey idempotency_key
  |
  v
<Application Service>
  - 编排 UnitOfWork uow
  - 调用 domain object / policy
  |
  v
<Domain Object / Policy>
  - 维护 truth / state / invariant
  - 生成 history / audit / projection material
  |
  v
<Repository / Port / Outbox>
  - 保存 truth / history / audit
  - 发布 committed fact 或 projection signal
  |
  v
<Result / Event / Projection>
```

关键设计点：

- 写路径必须经过 application service 和 domain object / policy。
- repository、port、worker 不能直接绕过领域规则改状态。
- `UnitOfWork` 只表达写边界，具体事务隔离和锁留给详细设计。

#### `AcceptPublication` 处理流

```text
AcceptPublication
  |
  v
BusCommandApi.accept_publication(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
PublicationAcceptanceService.accept(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
PublicationMaterial::from_publish_command(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
PayloadBoundaryGuard.rejects_body(PublicationMaterial material)
  |
  v
PublicationAcceptance::start(PublicationMaterial material, ActorContext actor)
  |
  v
TransportSemantic::derive(PublicationMaterial material, BackendCapabilityRef capability_ref)
  |
  v
PublicationRepository.insert(PublicationAcceptance acceptance)
  |
  v
AuditTrailRepository.append(BusAuditEntry audit_entry)
  |
  v
PublicationAcceptanceResult / PublicationAcceptedEvent
```

关键设计点：

- payload 正文必须在写入 `PublicationAcceptance` 前被拒绝。
- `TransportSemantic` 只表达平台传递语义，不保存后端裸参数。
- acceptance、audit 和 accepted event 必须来自同一已提交事实。

#### `ConsumeCommittedOutboxFact` 处理流

```text
ConsumeCommittedOutboxFact
  |
  v
OutboxRelayConsumer.consume(CommittedOutboxFact fact, EventId event_id, EventSourceRef source_ref, IdempotencyKey idempotency_key)
  |
  v
IdempotencyAnchor::bind(IdempotencyScope scope, IdempotencyKey idempotency_key, RecordRef record_ref)
  |
  v
PublicationMaterial::from_outbox_fact(CommittedOutboxFact fact, ActorContext actor, CommandMetadata meta)
  |
  v
PublicationAcceptanceService.accept_material(PublicationMaterial material, ActorContext actor, CommandMetadata meta)
  |
  v
PublicationRepository.insert(PublicationAcceptance acceptance)
  |
  v
AuditTrailRepository.append(BusAuditEntry audit_entry)
  |
  v
OutboxRelayResult / PublicationAcceptedEvent
```

关键设计点：

- 只消费已提交 outbox fact，不读取业务域未提交状态。
- 幂等锚点基于 event id、source ref 和 outbox fact reference。
- outbox relay 复用接入规则，不发明第二套 publish 语义。

#### `RunDeliveryProgression` 处理流

```text
RunDeliveryProgression
  |
  v
DeliveryWorkerJob.run(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)
  |
  v
DeliveryRepository.find_schedulable(DeliveryScanCursor cursor)
  |
  v
DeliveryProgressionService.progress(DeliveryRecord delivery, ActorContext actor, JobMetadata meta)
  |
  v
DeliveryLifecycle.can_transition(DeliveryStatus from_status, DeliveryStatus to_status)
  |
  v
DeliveryRecord.start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)
  |
  v
TransportBackendPort.dispatch(TransportSemantic semantic, DeliveryAttempt attempt)
  |
  v
DeliveryAttempt.finish(BackendDeliveryResult result, Timestamp occurred_at)
  |
  v
DeliveryRepository.save(DeliveryRecord delivery)
  |
  v
DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason)
```

关键设计点：

- worker 只能通过 `DeliveryLifecycle` 迁移状态。
- 后端投递必须经 `TransportBackendPort`，不能在 worker 里绑定具体 SDK。
- attempt、delivery、history 和 audit 的具体事务顺序留给详细设计。

#### `RecordDeliveryFeedback` 处理流

```text
RecordDeliveryFeedback
  |
  v
DeliveryFeedbackApi.record_feedback(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
FeedbackRecordingService.record(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
DeliveryRepository.get_for_update(DeliveryId delivery_id)
  |
  v
IdempotencyAnchor::bind(IdempotencyScope scope, IdempotencyKey idempotency_key, RecordRef record_ref)
  |
  v
FeedbackResult::ack(DeliveryId delivery_id, ActorContext actor) / FeedbackResult::fail(DeliveryId delivery_id, FeedbackReason reason, ActorContext actor)
  |
  v
DeliveryRecord.mark_completed(FeedbackResult feedback, ActorContext actor) / DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)
  |
  v
DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason)
  |
  v
FeedbackRecordResult / FeedbackRecordedEvent
```

关键设计点：

- feedback 是 bus 级结果，不表达业务补偿逻辑。
- duplicate feedback 必须通过 `IdempotencyAnchor` 识别。
- fail 只进入恢复候选，不直接形成 governance decision。

#### `ConsumeBackendDeliverySignal` 处理流

```text
ConsumeBackendDeliverySignal
  |
  v
BackendSignalConsumer.consume(BackendDeliverySignal signal, EventId event_id, EventSourceRef source_ref, BackendCapabilityRef capability_ref, IdempotencyKey idempotency_key)
  |
  v
BackendCapabilityPolicy.allows_mapping(TransportSemantic semantic, BackendCapabilityRef capability_ref)
  |
  v
DeliveryRepository.get_for_update(DeliveryId delivery_id)
  |
  v
DeliveryAttempt.finish(BackendDeliveryResult result, Timestamp occurred_at)
  |
  v
FeedbackResult::ack(DeliveryId delivery_id, ActorContext actor) / FeedbackResult::fail(DeliveryId delivery_id, FeedbackReason reason, ActorContext actor)
  |
  v
DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason)
  |
  v
BackendSignalResult / DeliveryStateChangedEvent
```

关键设计点：

- 后端 signal 必须先归一化，不能保存后端私有响应正文。
- backend capability 只以引用和 policy 参与映射，不暴露 secret。
- 后端结果是否转成 feedback 的细节留给详细设计。

#### `ConsumeTimeoutSignal` 处理流

```text
ConsumeTimeoutSignal
  |
  v
TimeoutSignalConsumer.consume(DeliveryTimeoutSignal signal, EventId event_id, EventSourceRef source_ref, IdempotencyKey idempotency_key)
  |
  v
DeliveryRepository.get_for_update(DeliveryId delivery_id)
  |
  v
FeedbackResult::timeout(DeliveryId delivery_id, TimeoutReason reason)
  |
  v
DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)
  |
  v
DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason)
  |
  v
RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)
  |
  v
TimeoutRecordResult / FailureMaterialAvailableEvent
```

关键设计点：

- timeout 是 bus 级反馈，不等同业务处理失败正文。
- timeout 可以进入 retry 候选，但不直接创建 replay preparation。
- clock / scheduler 的具体实现留给详细设计和配置设计。

#### `RequestRetry` 处理流

```text
RequestRetry
  |
  v
RecoveryOperationsApi.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
RecoveryService.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
DeliveryRepository.get_for_update(DeliveryId delivery_id)
  |
  v
RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)
  |
  v
RetryPlan::create(DeliveryRecord delivery, FailureReason reason, RetryPolicyRef policy_ref)
  |
  v
DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason)
  |
  v
RetryPlanResult / DeliveryStateChangedEvent
```

关键设计点：

- retry 是受控恢复入口，不是重新 publish。
- retry 参数和调度间隔不在概要设计层固定。
- exhausted / cancelled 的状态边界交给 Step 9 收口。

#### `RunRetryCycle` 处理流

```text
RunRetryCycle
  |
  v
RetryWorkerJob.run(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)
  |
  v
RecoveryRepository.find_due_retry(RetryScanCursor cursor)
  |
  v
RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)
  |
  v
RetryPlan.has_remaining_attempts()
  |
  v
DeliveryRecord.start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)
  |
  v
TransportBackendPort.dispatch(TransportSemantic semantic, DeliveryAttempt attempt)
  |
  v
RetryCycleResult / DeliveryStateChangedEvent
```

关键设计点：

- due retry 只能推进已有 retry plan，不能绕过 `RequestRetry` 创建恢复事实。
- 新 attempt 仍然走 delivery / backend port 边界。
- retry worker 的并发控制和 backoff 细节留给详细设计。

#### `MoveDeliveryToDeadLetter` 处理流

```text
MoveDeliveryToDeadLetter
  |
  v
RecoveryOperationsApi.move_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
DeliveryRepository.get_for_update(DeliveryId delivery_id)
  |
  v
FeedbackRepository.get_failure(DeliveryId delivery_id)
  |
  v
DeliveryRepository.load_history(DeliveryId delivery_id)
  |
  v
FailureMaterial::from_feedback(FeedbackResult feedback, DeliveryHistoryEntry history)
  |
  v
RecoveryEligibilityPolicy.can_dead_letter(DeliveryRecord delivery, FailureMaterial material)
  |
  v
DeadLetterEntry::from_failed_delivery(DeliveryRecord delivery, FailureMaterial material)
  |
  v
AuditTrailRepository.append(BusAuditEntry audit_entry)
  |
  v
DeadLetterResult / DeadLetterCreatedEvent
```

关键设计点：

- DLQ 是失败事实收纳，不等同 replay 执行。
- `FailureMaterial` 只表达 bus 失败材料，不生成治理决策。
- dead-letter 后是否可 replay 由 `ReplayPreparation` 另行判断。

#### `PrepareReplay` 处理流

```text
PrepareReplay
  |
  v
RecoveryOperationsApi.prepare_replay(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
RecoveryRepository.get_dead_letter(DeadLetterId dead_letter_id)
  |
  v
AuditTrailRepository.load_chain(AuditChainRef audit_chain_ref)
  |
  v
RecoveryEligibilityPolicy.can_prepare_replay(DeadLetterEntry entry, AuditChainRef audit_chain_ref)
  |
  v
ReplayPreparation::prepare(DeadLetterEntry entry, ActorContext actor)
  |
  v
AuditTrailRepository.append(BusAuditEntry audit_entry)
  |
  v
ReplayPreparationResult / ReplayPreparationReadyEvent
```

关键设计点：

- replay preparation 只是形成可审计前置材料，不代表 replay 已执行。
- 必须依赖 dead-letter、audit chain 和审批引用等前置条件。
- 真正 replay executor、授权和重放 payload 细节不在概要设计展开。

#### `RunReadOutputProjection` 处理流

```text
RunReadOutputProjection
  |
  v
ReadOutputWorkerJob.run(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)
  |
  v
AuditTrailRepository.scan_committed(AuditCursor cursor)
  |
  v
TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)
  |
  v
FailureSummaryProjection::derive(FailureMaterial material, BusAuditEntry audit)
  |
  v
ReadOnlyOutputPolicy.allows_projection_write(ProjectionWriteIntent intent)
  |
  v
ReadProjectionRepository.upsert(ProjectionRecord projection)
  |
  v
ProjectionJobResult / TransportViewUpdatedEvent
```

关键设计点：

- projection 从已提交 truth / audit 派生，不参与 truth 写入。
- projection 写失败不能反向撤销已提交 bus truth。
- projection 输出不得包含 payload body 或后端私有响应正文。

#### `RebuildReadProjection` 处理流

```text
RebuildReadProjection
  |
  v
ReadOutputOperationsApi.rebuild_projection(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)
  |
  v
ProjectionRebuildService.rebuild(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)
  |
  v
DeliveryRepository.scan_truth(TruthScanCursor cursor)
  |
  v
AuditTrailRepository.scan_committed(AuditCursor cursor)
  |
  v
TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)
  |
  v
ReadProjectionRepository.replace_batch(ProjectionBatch batch)
  |
  v
ProjectionRebuildResult
```

关键设计点：

- rebuild 是受控重建，不改写 `DeliveryRecord`、`FeedbackResult`、DLQ 或 replay truth。
- rebuild cursor、批大小和一致性窗口留给详细设计。
- rebuild 结果必须可审计，避免 silent projection drift。

#### `CheckBackendCapability` 处理流

```text
CheckBackendCapability
  |
  v
BackendCapabilityJob.run(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)
  |
  v
BackendCapabilityRef::from_profile(BackendProfileRef profile_ref, BackendKind backend_kind)
  |
  v
BackendCapabilityPolicy::from_capability(BackendCapabilityRef capability_ref)
  |
  v
TransportBackendPort.check_capability(BackendCapabilityRef capability_ref)
  |
  v
BackendCapabilityPolicy.allows_mapping(TransportSemantic semantic, BackendCapabilityRef capability_ref)
  |
  v
AuditTrailRepository.append(BusAuditEntry audit_entry)
  |
  v
BackendCapabilityCheckResult / BackendCapabilityChangedEvent
```

关键设计点：

- capability check 只输出能力状态和引用，不保存 secret。
- 具体后端探测协议和凭据加载属于详细设计 / 配置设计。
- capability 变化不能直接改变已提交 delivery truth。

### 7.3 Query 通用只读处理流

```text
Query API
  |
  v
BusQueryApi.query(QueryRequest query, ActorContext actor)
  |
  v
ReadOutputService.read(QueryRequest query, ActorContext actor)
  |
  v
ReadProjectionRepository.get(ProjectionKey key)
  |
  v
AuditTrailRepository.list(AuditFilter filter)
  |
  v
ReadOnlyOutputPolicy read-only boundary check
  |
  v
QueryResult with consistency marker
```

关键设计点：

- Query 不打开写事务，不调用状态变更方法。
- projection missing / stale 时返回一致性标记或重建建议，不隐式修写真相。
- `ActorContext` 表达上游安全上下文和审计读取边界，认证实现不在本步展开。

### 7.4 Outbound Event 通用发布处理流

```text
Committed Bus Fact
  |
  v
OutboxPublisherService.collect(BusAuditEntry audit_entry, EventKind event_kind)
  |
  v
PayloadBoundaryGuard.allows_reference(PayloadRef payload_ref)
  |
  v
OutboxPublisherPort.publish(OutboundEvent event, TraceContextRef trace_ref)
  |
  v
PublicationAcceptedEvent / DeliveryStateChangedEvent / DeadLetterCreatedEvent / ProjectionUpdatedEvent
```

关键设计点：

- Outbound Event 只能传播已提交事实或只读材料。
- outbound payload 不包含业务 payload body、后端私有响应正文或 secret。
- topic、CloudEvent 字段和 publisher retry 策略留给详细设计。

### 7.5 处理流与对象 / 接口对应关系

| 处理流 | 对应接口 / Job / Consumer | 关键对象 | 关键 repository / port |
|---|---|---|---|
| `AcceptPublication` | Command API | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic` | `PublicationRepository`、`AuditTrailRepository` |
| `ConsumeCommittedOutboxFact` | Inbound Event Consumer | `PublicationMaterial`、`IdempotencyAnchor`、`PublicationAcceptance` | `PublicationRepository`、`AuditTrailRepository` |
| `RunDeliveryProgression` | Operations Job | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle` | `DeliveryRepository`、`TransportBackendPort` |
| `RecordDeliveryFeedback` | Command API | `FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry` | `DeliveryRepository`、`AuditTrailRepository` |
| `ConsumeBackendDeliverySignal` | Inbound Event Consumer | `DeliveryAttempt`、`FeedbackResult`、`BackendCapabilityRef` | `DeliveryRepository`、`TransportBackendPort` |
| `ConsumeTimeoutSignal` | Inbound Event Consumer | `FeedbackResult`、`DeliveryRecord`、`RecoveryEligibilityPolicy` | `DeliveryRepository`、`AuditTrailRepository` |
| `RequestRetry` / `RunRetryCycle` | Command / Job | `RetryPlan`、`DeliveryRecord`、`DeliveryAttempt` | `RecoveryRepository`、`TransportBackendPort` |
| `MoveDeliveryToDeadLetter` | Command API | `DeadLetterEntry`、`FailureMaterial` | `RecoveryRepository`、`AuditTrailRepository` |
| `PrepareReplay` | Command API | `ReplayPreparation`、`DeadLetterEntry` | `RecoveryRepository`、`AuditTrailRepository` |
| Projection flows | Operations Job | `TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy` | `ReadProjectionRepository` |
| `CheckBackendCapability` | Operations Job | `BackendCapabilityRef`、`BackendCapabilityPolicy` | `TransportBackendPort`、`AuditTrailRepository` |

### 7.6 未展开独立处理流的取舍说明

| 接口 / Event | 当前不独立展开的原因 | 后续落点 |
|---|---|---|
| `GetPublicationAcceptance` | 走 Query 通用只读路径 | 详细设计补 query DTO 和 not-found 处理 |
| `GetDeliveryStatus` | 走 Query 通用只读路径 | 详细设计补 projection stale 分支 |
| `ListDeliveryHistory` | 走 Query 通用只读路径 | 详细设计补分页、过滤和审计读取 |
| `GetTransportView` | 走 Query 通用只读路径 | 详细设计补 view version / consistency marker |
| `GetFailureSummary` | 走 Query 通用只读路径 | 详细设计补 failure summary fallback |
| `GetBusAuditTrail` | 走 Query 通用只读路径 | 详细设计补 audit filter 和读取权限上下文 |
| `GetBackendHealthView` | 走 Query 通用只读路径 | 详细设计补 adapter status 读取 |
| 单个 Outbound Event | 走 Outbound Event 通用发布路径 | 详细设计补事件 schema、topic 和 publisher retry |

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §8 “关键处理流 / 重要函数数据流”应从本文件摘录并整理以下内容：

- §8.1 “处理流覆盖清单”
- §8.2 “通用写路径骨架”
- §8.3 ~ §8.15 各独立处理流
- §8.16 “Query 通用只读处理流”
- §8.17 “Outbound Event 通用发布处理流”
- §8.18 “处理流与对象 / 接口对应关系”
- §8.19 “未展开独立处理流的取舍说明”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| `ConsumeCommittedOutboxFact` 与 `RunOutboxRelay` 是否拆成两张图 | A：拆开；B：以 Consumer 为主，Job 作为触发来源 | 建议 B | Step 8 关注事实消费和本地写入，relay 扫描细节留给详细设计 |
| `GetFailureSummary` 是否独立画 Query 流 | A：独立；B：通用读路径 + fallback 留详细设计 | 建议 B | 当前不改 truth，独立画会重复 |
| `Outbound Event` 是否逐事件画图 | A：逐个画；B：统一发布路径 | 建议 B | 事件差异在来源和 payload，发布机制相同 |

以上待确认项不阻塞进入 Step 9。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已按 Step 7 承接清单覆盖关键 Command、Consumer、Job。
- 已把 retry、DLQ、replay preparation 拆成独立处理流。
- 已独立展开 backend signal、timeout signal、projection rebuild 和 backend capability check。
- 已为 Query 和 Outbound Event 给出通用处理流与不逐个展开原因。
- 已在图中使用 `TypeName param_name` 参数格式。
- 已避免写完整伪代码、SQL、错误码全集、HTTP path、topic、retry 参数和完整 Rust 签名。
