# Step 9. 逐接口定义函数级处理流

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：为每个需要实现的 Command / Query / Event / Job 定义函数级数据流、调用链、事务边界、错误映射、状态与事件副作用和测试切口。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 9 | 每个需要实现的协议必须有函数级处理流，必须包含 ASCII 调用图、伪代码、事务、错误、状态副作用和测试切口 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.8 | 单处理流固定结构、图示格式、伪代码标注格式 | 约束正式文档回填格式 |
| `projects/L0-bus/design-calibration/03_ddd_step_06_object_contracts.md` | 已定义 domain object、成员函数、状态 enum 和不变量 | 决定 domain method 调用和状态变化 |
| `projects/L0-bus/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已定义 repository / port / adapter 函数签名 | 决定 repository、backend、publisher、unit of work 调用 |
| `projects/L0-bus/design-calibration/03_ddd_step_08_protocol_contracts.md` | 已定义协议清单、route / topic / job name、schema、错误映射和处理方 | 决定本步覆盖范围和入口函数 |
| `projects/L0-bus/02-概要设计.md` §8 | 已定义概要处理流和主要边界 | 作为函数级处理流的上游轮廓 |

---

## 3. SOP 问题回答

### 3.1 哪些协议必须拥有函数级处理流？

| 处理流类别 | 协议 | 处理方式 |
|---|---|---|
| Command API | `AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` | 每个协议独立处理流 |
| Inbound Event Consumer | `ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` | 每个 consumer 独立处理流 |
| Operations Job | `RunOutboxRelay`、`RunDeliveryProgression`、`RunRetryCycle`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability` | 每个 job 独立处理流 |
| Query API | 7 个 Query API | 使用一个通用只读处理流，逐个列入口差异 |
| Outbound Event | 9 个 Outbound Event | 使用一个通用发布处理流，逐个列 event kind 差异 |

### 3.2 每个处理流的入口函数是什么？

入口函数在 §7.1 处理流总表中列出，命名规则如下：

```text
api handler:
  <ApiName>Handler.handle(<Command / Query> command, ActorContext actor, CommandMetadata meta)

worker consumer:
  <ConsumerName>.consume(<Input> input, ActorContext actor, EventMetadata meta)

job runner:
  <JobRunner>.run(<Job> job, ActorContext actor, JobMetadata meta)
```

### 3.3 入口函数调用哪些 application service、domain method、repository 和 outbox？

本步每个处理流都包含：

- `函数级调用图`
- `关键伪代码`
- `状态与事件副作用`

其中伪代码必须按 `// [对象.函数(Type 参数名)]` 标注关键调用。

### 3.4 事务在哪里开始，在哪里提交，哪些错误触发回滚？

通用规则：

| 流类型 | 事务边界 | 回滚错误 |
|---|---|---|
| Command 写路径 | application service 内部 `UnitOfWork.begin()` 到 `UnitOfWork.commit()` | validation 之后的 repository / domain / outbox staging 错误 |
| Inbound Event Consumer | consumer service 内部 `UnitOfWork.begin()` 到 `UnitOfWork.commit()` | 幂等冲突以外的写入错误 |
| Operations Job | 每个 item 一个事务，job summary 可单独提交 | 单 item 错误只回滚该 item，不回滚整个 batch |
| Query API | 不开启写事务 | 不适用 |
| Outbound Event 发布 | 已提交事实之后执行；publisher 失败不回滚 truth | publisher error 进入 retry / evidence |

### 3.5 哪些状态会被修改，哪些事件会被写入？

状态和事件副作用在每个处理流 §7.x.6 中列出。状态矩阵本身留给 Step 10，本步只说明本流程触发的状态变化。

### 3.6 每个处理流至少需要哪些测试切口？

每个处理流 §7.x.7 都给出最小测试切口。完整测试矩阵在 Step 16 汇总。

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 概要设计 §8 只给流程轮廓 | 实现者仍不知道具体函数、事务和错误处理 | 本步补函数级调用图和 Rust 风格伪代码 |
| Step 8 定义了协议，但未定义内部调用链 | handler / consumer / job 可能各自实现一套逻辑 | 本步强制全部进入 application service |
| Job 流程容易按 batch 开一个大事务 | 单条失败会影响整批，恢复困难 | 本步规定 job 按 item 建事务，summary 单独记录 |
| Query 容易隐式修复 projection | 查询产生隐藏写副作用 | 本步规定 Query 不写 truth，不自动 rebuild |
| outbound event 容易和 truth 写入混在一个外部调用里 | publisher 失败可能回滚已提交 truth | 本步规定 publisher 在 committed fact 后运行，失败进入 retry / evidence |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 处理流粒度 | 概要级步骤 | 可编码的函数级调用图和伪代码 |
| 事务边界 | 只说 `UnitOfWork` | 明确 begin / commit / rollback 位置 |
| repository / port | 只列关键端口名 | 在伪代码中标注具体函数调用 |
| 错误处理 | 只列错误类别 | 每个流程列错误映射和回滚策略 |
| 状态副作用 | 散落描述 | 每个流程单独列状态变化和事件 |
| 测试切口 | 未逐流程列出 | 每个流程给最小验证切口 |

---

## 6. 设计取舍

### 6.1 Query API 是否逐个写完整处理流

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：7 个 Query API 每个完整写一遍 | 形式完整，但大量重复只读、projection、audit 逻辑 | 不采用 |
| 方案 B：写一个通用只读流，逐个列入口差异 | 能避免重复，同时保留实现差异 | 推荐 |
| 方案 C：不写 Query 处理流 | 实现者缺少 consistency marker 和 projection missing 规则 | 不采用 |

推荐方案 B。Query 不改写真相，核心差异在 query DTO 和 repository read target，不需要复制 7 份几乎相同的流程。

### 6.2 Operations Job batch 事务如何处理

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：整个 batch 一个事务 | 简单，但单条失败会拖垮整批 | 不采用 |
| 方案 B：每个 item 一个事务，job summary 单独记录 | 更适合 retry、skip 和部分成功 | 推荐 |
| 方案 C：不使用事务 | 状态、history、audit 容易不一致 | 不采用 |

推荐方案 B。Job 是后台推进器，天然需要容忍部分成功和可重试失败。

### 6.3 Outbound Event 发布是否参与 truth 事务

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：truth 写入事务内直接调用外部 event bus | publisher 失败会污染 truth 提交 | 不采用 |
| 方案 B：truth 提交后由 outbox publisher 发布 committed fact | 推荐 |
| 方案 C：不发布事件，只靠 query | 下游无法订阅事实变化 | 不采用 |

推荐方案 B。它符合 outbox 语义，能让 truth 与外部发布解耦。

---

## 7. 结构化中间产物

### 7.1 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `AcceptPublicationFlow` | `AcceptPublication` | `BusCommandApi.accept_publication(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)` | 单命令写事务 | `PublicationAcceptanceStatus: Pending -> Accepted / Rejected` | accepted、payload 越界、幂等重复、repository failure |
| `ConsumeCommittedOutboxFactFlow` | `ConsumeCommittedOutboxFact` | `OutboxRelayConsumer.consume(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)` | 单 fact 写事务 | `PublicationAcceptanceStatus: Pending -> Accepted / Rejected` | accepted、duplicate event、payload 越界、source ack failure |
| `RunOutboxRelayFlow` | `RunOutboxRelay` | `OutboxRelayJobRunner.run(RunOutboxRelayJob job, ActorContext actor, JobMetadata meta)` | 每个 fact 一个写事务 | 多个 `PublicationAcceptance` 创建 | batch partial success、cursor 推进、source unavailable |
| `RunDeliveryProgressionFlow` | `RunDeliveryProgression` | `DeliveryProgressionJobRunner.run(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)` | 每个 delivery 一个写事务 | `DeliveryStatus: Scheduled -> Dispatching -> Delivered / Failed` | dispatch success、backend retryable failure、state conflict |
| `RecordDeliveryFeedbackFlow` | `RecordDeliveryFeedback` | `DeliveryFeedbackApi.record_feedback(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)` | 单 feedback 写事务 | `DeliveryStatus: Delivered -> Completed / Failed`; timeout 表达为 `FeedbackStatus::Timeout` | ack、fail、duplicate feedback、unknown delivery |
| `ConsumeBackendDeliverySignalFlow` | `ConsumeBackendDeliverySignal` | `BackendSignalConsumer.consume(BackendDeliverySignalInput input, ActorContext actor, EventMetadata meta)` | 单 signal 写事务 | `DeliveryAttempt` finish，`DeliveryRecord` 变更 | delivered、failed、unknown delivery、backend private body rejected |
| `ConsumeTimeoutSignalFlow` | `ConsumeTimeoutSignal` | `TimeoutSignalConsumer.consume(DeliveryTimeoutSignalInput input, ActorContext actor, EventMetadata meta)` | 单 timeout 写事务 | `DeliveryStatus: Dispatching / Delivered -> Failed`; timeout 表达为 `FeedbackStatus::Timeout` | timeout recorded、duplicate timeout、state conflict |
| `RequestRetryFlow` | `RequestRetry` | `RecoveryOperationsApi.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)` | 单 retry request 写事务 | `RetryPlanStatus: New -> Scheduled` | allowed retry、not eligible、existing active plan |
| `RunRetryCycleFlow` | `RunRetryCycle` | `RetryCycleJobRunner.run(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)` | 每个 retry plan 一个写事务 | `RetryPlanStatus: Scheduled -> Exhausted / Cancelled`，due retry 保持 `Scheduled` 并创建 attempt metadata | due retry、exhausted、backend failure |
| `MoveDeliveryToDeadLetterFlow` | `MoveDeliveryToDeadLetter` | `RecoveryOperationsApi.move_delivery_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)` | 单 DLQ 写事务 | `DeadLetterStatus: New -> Open`，`DeliveryStatus: Failed -> DeadLettered` | created、not eligible、missing failure material |
| `PrepareReplayFlow` | `PrepareReplay` | `RecoveryOperationsApi.prepare_replay(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)` | 单 replay preparation 写事务 | `ReplayPreparationStatus: New -> Draft -> Ready / Rejected / Superseded` | ready、missing approval、audit chain invalid |
| `RunReadOutputProjectionFlow` | `RunReadOutputProjection` | `ReadOutputProjectionJobRunner.run(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)` | 每个 projection item 一个写事务 | `ProjectionStatus: stale -> current` | incremental update、projection write failure、payload boundary |
| `RebuildReadProjectionFlow` | `RebuildReadProjection` | `ProjectionRebuildJobRunner.run(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)` | 每个 rebuild batch 一个事务 | projection batch replace | dry run、batch replace、version conflict |
| `CheckBackendCapabilityFlow` | `CheckBackendCapability` | `BackendCapabilityJobRunner.run(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)` | 单 capability check 写事务 | backend health projection updated | available、degraded、secret unavailable |
| `QueryReadOnlyFlow` | 7 个 Query API | `BusQueryApi.query(QueryRequest query, ActorContext actor)` | 无写事务 | 无 truth 状态变化 | not found、projection stale、audit access |
| `OutboundEventPublishFlow` | 9 个 Outbound Event | `OutboxPublisherService.publish_committed(BusOutboundEvent event, TraceContextRef trace)` | truth 已提交后发布 | 无 truth 状态变化 | publish success、retryable publisher failure、schema violation |

### 7.2 通用函数级规则

#### 7.2.1 写路径通用图

```text
[Inbound Adapter / Handler / Job Runner]
  | call parse_and_validate(ProtocolInput input, ActorContext actor, Metadata meta)
  v
[Application Service]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)
  v
[Domain Object / Policy]
  | call <DomainObject>.<method>(TypedInput input, ActorContext actor)
  v
[Repository]
  | save entity
  | append audit
  | bind idempotency anchor
  v
[UnitOfWork]
  | tx commit
  v
[Post Commit]
  | append / publish outbound event reference
```

关键说明：

- 写路径的业务状态修改只能发生在 application service 调用 domain object / policy 后。
- 幂等检查必须早于状态修改；幂等锚点写入必须与 truth 写入在同一提交边界内协调。
- 事件发布不直接调用外部 event bus；提交后交给 outbox publisher。

#### 7.2.2 Job batch 通用图

```text
[Job Runner]
  | call poll_cursor(JobCursor cursor, PageLimit limit)
  v
[For Each Item]
  | tx begin item transaction
  | call ApplicationService.process_item(Item item, ActorContext actor, JobMetadata meta)
  | save truth / projection / audit
  | tx commit item transaction
  v
[Job Summary]
  | record scanned / succeeded / skipped / failed / next_cursor
```

关键说明：

- Job 不使用整批大事务；每个 item 单独提交。
- 单 item 失败只能影响该 item，不能阻断已成功 item 的提交。
- cursor 推进必须与已处理 item 的结果一致，避免重复跳过未处理项。

#### 7.2.3 Query 通用图

```text
[HTTP Query Handler]
  | call parse_query(QueryInput input, ActorContext actor)
  v
[ReadOutputService]
  | no write transaction
  | call ReadProjectionRepository.get(...)
  | call AuditTrailRepository.list(...) when needed
  v
[ReadOnlyOutputPolicy]
  | call allows_read(...)
  v
[Query Result]
  | return view with consistency marker
```

关键说明：

- Query 不开启写事务。
- projection missing / stale 只返回 consistency marker 或 not ready，不自动 rebuild。
- Query 不调用 domain state transition method。

### 7.3 `AcceptPublicationFlow`

#### 7.3.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `AcceptPublication` |
| 入口函数 | `BusCommandApi.accept_publication(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)` |
| application service | `PublicationAcceptanceService.accept(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 创建或拒绝 publication acceptance，保存 audit，并准备 outbound event；不派生 transport semantic |

PH-02 范围说明：`AcceptPublicationFlow` 只形成 accepted / rejected publication fact、audit 和幂等锚点。`TransportSemantic::derive(...)` 属于 PH-03，基于 accepted material 与 backend capability 派生，不属于 `AcceptPublicationCommand` 输入，也不属于 commit-02-a 的实现范围。

#### 7.3.2 函数级调用图

```text
[BusCommandApi]
  | call accept_publication(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)
  v
[PublicationAcceptanceService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)
  v
[PublicationMaterial + PayloadBoundaryGuard]
  | call PublicationMaterial::from_accept_publication_command(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)
  | call PayloadBoundaryGuard.rejects_body(PublicationMaterial material)
  v
[PublicationAcceptance]
  | call PublicationAcceptance::start_pending(PublicationMaterial material, ActorContext actor)
  v
[Repositories]
  | save PublicationRepository.insert(PublicationAcceptance acceptance, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | bind IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)
  v
[UnitOfWork + Outbox]
  | tx commit
  | stage PublicationAcceptedEvent or PublicationRejectedEvent
```

关键说明：

- `PayloadBoundaryGuard` 必须早于 `PublicationRepository.insert()`。
- `PublicationAcceptedEvent` 只能来自已提交 acceptance fact。
- 幂等重复返回已有 result，不重复创建 publication。

#### 7.3.3 关键伪代码

```rust
// [BusCommandApi.accept_publication(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)]
// HTTP handler 只负责解析协议 DTO、actor 和 meta，然后进入 application service。
pub async fn accept_publication(command: AcceptPublicationCommand, actor: ActorContext, meta: CommandMetadata) -> Result<PublicationAcceptanceResult, ApiError> {
    service.accept(command, actor, meta).await.map_err(ApiError::from)
}

// [PublicationAcceptanceService.accept(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)]
// 发布接入主写路径，负责事务、幂等、领域对象和 repository 编排。
pub async fn accept(command: AcceptPublicationCommand, actor: ActorContext, meta: CommandMetadata) -> Result<PublicationAcceptanceResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单命令写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::AcceptPublication, actor.clone()).await?;

    // [IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)]
    // 检查同 scope + key 是否已经处理过。
    if let Some(anchor) = idempotency_repository.find(IdempotencyScope::Publication, meta.idempotency_key.clone()).await? {
        return Ok(PublicationAcceptanceResult::from_anchor(anchor));
    }

    // [PublicationMaterial::from_accept_publication_command(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta)]
    // 将协议 DTO 转为领域材料，不复制 payload body。
    let material = PublicationMaterial::from_accept_publication_command(command, actor.clone(), meta.clone())?;

    // [PayloadBoundaryGuard.rejects_body(PublicationMaterial material)]
    // 检查 payload body / secret / backend private body 是否越界。
    if payload_guard.rejects_body(material.clone()) {
        let rejection = PublicationAcceptance::reject(material, PublicationRejectionReason::PayloadBoundaryViolation, actor.clone())?;
        publication_repository.insert(rejection.clone(), uow.clone()).await?;
        audit_repository.append(BusAuditEntry::publication_rejected(rejection.clone(), actor.clone()), uow.clone()).await?;
        unit_of_work.commit(uow).await?;
        return Ok(PublicationAcceptanceResult::rejected(rejection));
    }

    // [PublicationAcceptance::start_pending(PublicationMaterial material, ActorContext actor)]
    // 创建 pending publication acceptance，后续只能通过 accept/reject 成为终态。
    let acceptance = PublicationAcceptance::start_pending(material.clone(), actor.clone())?;

    // [PublicationRepository.insert(PublicationAcceptance acceptance, UnitOfWorkHandle uow)]
    // 保存 publication acceptance truth。
    let version = publication_repository.insert(acceptance.clone(), uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加接入审计记录。
    let audit_ref = audit_repository.append(BusAuditEntry::publication_accepted(acceptance.clone(), actor.clone()), uow.clone()).await?;

    // [IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)]
    // 绑定幂等键到 publication record。
    idempotency_repository.bind(IdempotencyAnchor::for_publication(meta.idempotency_key, acceptance.publication_id().clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 truth、audit 和 idempotency anchor。
    unit_of_work.commit(uow).await?;

    Ok(PublicationAcceptanceResult::accepted(acceptance, version, audit_ref))
}
```

#### 7.3.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| handler 解析 | 无 | 只解析 HTTP DTO |
| 幂等检查 | 同写事务前读取 | 命中已有 anchor 直接返回 |
| acceptance / audit / idempotency 写入 | `UnitOfWork` 内 | 三者必须同一提交边界 |
| outbound event | 提交后 | publisher 失败不回滚 acceptance truth |

#### 7.3.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| validation error | 返回 `400` | 未开启或回滚 |
| payload boundary violation | 保存 rejected acceptance，返回 `422` | 不回滚 rejected fact |
| idempotency conflict | 返回 `409` 或已有结果 | 不写新 truth |
| repository error | 返回 `503` / `500` | 回滚 |

#### 7.3.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `PublicationAcceptance` | `Pending -> Accepted` 或 `Pending -> Rejected` |
| `BusAuditEntry` | 追加 publication accepted / rejected audit |
| `IdempotencyAnchor` | 绑定 publication result |
| Outbound event | `PublicationAcceptedEvent` 或 `PublicationRejectedEvent` |

#### 7.3.7 测试切口

| 测试 | 验证内容 |
|---|---|
| accepted path | 创建 acceptance、audit、idempotency anchor |
| payload boundary violation | 请求带 body ref 以外内容时 rejected |
| duplicate idempotency key | 返回已有结果且不重复写入 |
| repository failure | 事务回滚，无半写 audit |

### 7.4 `ConsumeCommittedOutboxFactFlow`

#### 7.4.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeCommittedOutboxFact` |
| 入口函数 | `OutboxRelayConsumer.consume(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)` |
| application service | `PublicationAcceptanceService.accept_from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)` |
| 目标 | 将 L0-core 已提交 outbox fact 转为 bus publication acceptance |

#### 7.4.2 函数级调用图

```text
[OutboxRelayConsumer]
  | call consume(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)
  v
[PublicationAcceptanceService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)
  v
[PublicationMaterial]
  | call PublicationMaterial::from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)
  | call PayloadBoundaryGuard.rejects_body(PublicationMaterial material)
  v
[Repositories]
  | save PublicationRepository.insert(PublicationAcceptance acceptance, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | bind IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)
  v
[Result]
  | tx commit
  | return OutboxRelayResult
```

关键说明：

- 只消费 `CommittedOutboxFactInput`，不读取 L0-core 未提交状态。
- `CommittedOutboxFactInput` 必须已经包含 `core_event_ref`、`delivery_mode`、`target_scope`、`payload_kind` 和 `core_event_envelope_ref`，否则不得形成 accepted publication truth。
- `core_event_envelope_ref` 只是已提交 envelope 实例引用，不能被当成 `core_event_ref`；`core_event_ref` 必须由 outbox source adapter 从 envelope metadata 中解析或补齐。
- `source_ref + event_id + idempotency_key` 是幂等识别输入。
- 与 `AcceptPublicationFlow` 复用同一 acceptance 规则。

#### 7.4.3 关键伪代码

```rust
// [OutboxRelayConsumer.consume(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)]
// 事件 consumer 只做 envelope 校验并转入 application service。
pub async fn consume(input: CommittedOutboxFactInput, actor: ActorContext, meta: EventMetadata) -> Result<OutboxRelayResult, ConsumerError> {
    publication_service.accept_from_outbox_fact(input, actor, meta).await.map_err(ConsumerError::from)
}

// [PublicationAcceptanceService.accept_from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)]
// 将上游 committed fact 作为发布材料进入 bus。
pub async fn accept_from_outbox_fact(input: CommittedOutboxFactInput, actor: ActorContext, meta: EventMetadata) -> Result<OutboxRelayResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单 fact 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::ConsumeCommittedOutboxFact, actor.clone()).await?;

    // [IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)]
    // 检查 event 幂等。
    if let Some(anchor) = idempotency_repository.find(IdempotencyScope::OutboxFact, input.idempotency_key.clone()).await? {
        return Ok(OutboxRelayResult::duplicate(anchor));
    }

    // [PublicationMaterial::from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)]
    // 从上游 committed fact 构造 publication material；input 必须携带 core_event_ref、delivery_mode 和 target_scope。
    let material = PublicationMaterial::from_outbox_fact(input.clone(), actor.clone(), meta.clone())?;

    // [PayloadBoundaryGuard.rejects_body(PublicationMaterial material)]
    // 拒绝 payload body 越界。
    payload_guard.ensure_reference_only(material.clone())?;

    // [PublicationAcceptance::start_pending(PublicationMaterial material, ActorContext actor)]
    // 创建 accepted publication。
    let acceptance = PublicationAcceptance::start_pending(material, actor.clone())?;

    // [PublicationRepository.insert(PublicationAcceptance acceptance, UnitOfWorkHandle uow)]
    // 保存接入事实。
    publication_repository.insert(acceptance.clone(), uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 保存 outbox relay audit。
    let audit_ref = audit_repository.append(BusAuditEntry::outbox_fact_consumed(input.committed_fact_ref.clone(), acceptance.publication_id().clone(), actor.clone()), uow.clone()).await?;

    // [IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)]
    // 绑定 event 幂等锚点。
    idempotency_repository.bind(IdempotencyAnchor::for_outbox_fact(input.idempotency_key, acceptance.publication_id().clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 fact 消费结果。
    unit_of_work.commit(uow).await?;

    Ok(OutboxRelayResult::accepted(acceptance.publication_id().clone(), audit_ref))
}
```

#### 7.4.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| envelope 校验 | 无 | 无状态检查 |
| acceptance / audit / idempotency | `UnitOfWork` 内 | 单 fact 原子提交 |
| source ack | 提交后 | ack 失败不回滚 bus truth，进入重试或重复消费幂等 |

#### 7.4.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| invalid fact | rejected result | 回滚 |
| duplicate event | duplicate result | 不写新 truth |
| payload boundary violation | rejected result + audit | 可提交 rejected fact |
| repository failure | retryable consumer error | 回滚 |

#### 7.4.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `PublicationAcceptance` | 创建 accepted / rejected fact |
| `IdempotencyAnchor` | 绑定 outbox fact |
| `BusAuditEntry` | 追加 outbox fact consumed audit |
| Outbound event | 可产生 `PublicationAcceptedEvent` / `PublicationRejectedEvent` |

#### 7.4.7 测试切口

| 测试 | 验证内容 |
|---|---|
| committed fact accepted | fact 转 publication acceptance |
| duplicate fact | 不重复创建 acceptance |
| source ack failure | truth 已提交时重复消费仍幂等 |
| invalid payload boundary | 不写入 payload body |

### 7.5 `RunOutboxRelayFlow`

#### 7.5.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RunOutboxRelay` |
| 入口函数 | `OutboxRelayJobRunner.run(RunOutboxRelayJob job, ActorContext actor, JobMetadata meta)` |
| application service | `OutboxRelayService.run(RunOutboxRelayJob job, ActorContext actor, JobMetadata meta)` |
| 目标 | 批量拉取 committed outbox fact，并逐条调用 `ConsumeCommittedOutboxFactFlow` |

#### 7.5.2 函数级调用图

```text
[OutboxRelayJobRunner]
  | call run(RunOutboxRelayJob job, ActorContext actor, JobMetadata meta)
  v
[OutboxRelayService]
  | call OutboxFactSourcePort.poll_committed(OutboxCursor cursor, PageLimit limit)
  v
[For Each Fact]
  | call PublicationAcceptanceService.accept_from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)
  | call OutboxFactSourcePort.ack_consumed(CommittedOutboxFactRef fact_ref, ConsumerMarker marker)
  v
[Job Summary]
  | record scanned / accepted / rejected / failed / next_cursor
```

关键说明：

- `RunOutboxRelay` 本身不绕过接入规则。
- 每个 fact 单独进入 `ConsumeCommittedOutboxFactFlow` 的事务。
- source ack 在 bus truth 提交后执行，ack 失败由幂等兜底。

#### 7.5.3 关键伪代码

```rust
// [OutboxRelayJobRunner.run(RunOutboxRelayJob job, ActorContext actor, JobMetadata meta)]
// Job runner 装配运行上下文并进入 relay service。
pub async fn run(job: RunOutboxRelayJob, actor: ActorContext, meta: JobMetadata) -> Result<OutboxRelayJobResult, JobError> {
    relay_service.run(job, actor, meta).await.map_err(JobError::from)
}

// [OutboxRelayService.run(RunOutboxRelayJob job, ActorContext actor, JobMetadata meta)]
// 批量拉取 committed fact，并逐条处理。
pub async fn run(job: RunOutboxRelayJob, actor: ActorContext, meta: JobMetadata) -> Result<OutboxRelayJobResult, ApplicationError> {
    // [OutboxFactSourcePort.poll_committed(OutboxCursor cursor, PageLimit limit)]
    // 从上游 outbox source 拉取已提交 fact。
    let page = outbox_source.poll_committed(job.cursor.clone(), job.batch_size).await?;

    let mut summary = OutboxRelayJobResult::start(meta.job_run_id.clone(), page.next_cursor.clone());

    for fact in page.items {
        // [CommittedOutboxFactInput::from_fact(CommittedOutboxFact fact, JobMetadata meta)]
        // 将 source fact 转为 consumer input，并保留 core_event_ref 与 core_event_envelope_ref 的区别。
        let input = CommittedOutboxFactInput::from_fact(fact.clone(), meta.clone())?;

        // [PublicationAcceptanceService.accept_from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta)]
        // 每个 fact 单独进入接入事务。
        match publication_service.accept_from_outbox_fact(input, actor.clone(), EventMetadata::from_job(meta.clone())).await {
            Ok(result) => {
                // [OutboxFactSourcePort.ack_consumed(CommittedOutboxFactRef fact_ref, ConsumerMarker marker)]
                // bus truth 已提交后确认 source 消费。
                outbox_source.ack_consumed(fact.fact_ref.clone(), ConsumerMarker::bus()).await?;
                summary.accept(result);
            }
            Err(err) if err.is_rejected_item() => {
                summary.reject(fact.fact_ref.clone(), err);
            }
            Err(err) => {
                summary.fail(fact.fact_ref.clone(), err);
            }
        }
    }

    Ok(summary)
}
```

#### 7.5.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| poll committed facts | 无写事务 | 只读 source |
| 单 fact 接入 | 每个 fact 一个 `UnitOfWork` | 由 `accept_from_outbox_fact` 控制 |
| ack consumed | truth 提交后 | ack 失败可重复消费 |
| job summary | 可单独记录 | 不影响单 fact truth |

#### 7.5.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| source unavailable | job retryable failure | 无 bus 写入 |
| single fact rejected | item rejected，继续下一条 | 单 item 回滚或提交 rejected fact |
| ack failure | job partial failure | 不回滚已提交 truth |
| unexpected application error | item failed，继续或按配置停止 | 单 item 回滚 |

#### 7.5.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `PublicationAcceptance` | 每个 fact 可能创建 accepted / rejected |
| `BusAuditEntry` | 每个 fact 追加 audit |
| Source cursor | 返回 `next_cursor` |
| Outbound event | 每个成功接入 fact 可发布 publication event |

#### 7.5.7 测试切口

| 测试 | 验证内容 |
|---|---|
| batch all accepted | scanned / accepted / cursor 正确 |
| partial rejected | rejected item 不阻断后续 item |
| source unavailable | 返回 retryable job error |
| ack failure duplicate | 下次重复消费通过幂等返回已有结果 |

### 7.6 `RunDeliveryProgressionFlow`

#### 7.6.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RunDeliveryProgression` |
| 入口函数 | `DeliveryProgressionJobRunner.run(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)` |
| application service | `DeliveryProgressionService.progress_batch(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)` |
| 目标 | 扫描可投递 delivery，创建 attempt，经 `TransportBackendPort` 投递，并记录状态 / audit |

#### 7.6.2 函数级调用图

```text
[DeliveryProgressionJobRunner]
  | call run(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)
  v
[DeliveryProgressionService]
  | call DeliveryRepository.find_schedulable(DeliveryScanCursor cursor, PageLimit limit)
  v
[For Each Delivery]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  | call DeliveryLifecycle.can_transition(DeliveryStatus from_status, DeliveryStatus to_status)
  | call DeliveryRecord.start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)
  | call TransportBackendPort.dispatch(TransportSemantic semantic, DeliveryAttempt attempt, BackendDispatchContext context)
  | call DeliveryAttempt.finish(BackendDeliveryResult result, Timestamp occurred_at)
  | save DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- 后端投递必须经 `TransportBackendPort`。
- 单 delivery 单事务；单条失败不影响其他 delivery。
- 后端返回的私有响应正文不能写入 delivery truth。

#### 7.6.3 关键伪代码

```rust
// [DeliveryProgressionJobRunner.run(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)]
// Job runner 触发 delivery 批量推进。
pub async fn run(job: RunDeliveryProgressionJob, actor: ActorContext, meta: JobMetadata) -> Result<DeliveryProgressionResult, JobError> {
    delivery_service.progress_batch(job, actor, meta).await.map_err(JobError::from)
}

// [DeliveryProgressionService.progress_batch(RunDeliveryProgressionJob job, ActorContext actor, JobMetadata meta)]
// 扫描可推进 delivery，并逐条处理。
pub async fn progress_batch(job: RunDeliveryProgressionJob, actor: ActorContext, meta: JobMetadata) -> Result<DeliveryProgressionResult, ApplicationError> {
    // [DeliveryRepository.find_schedulable(DeliveryScanCursor cursor, PageLimit limit)]
    // 查询可推进 delivery。
    let deliveries = delivery_repository.find_schedulable(job.cursor.clone(), job.batch_size).await?;
    let mut result = DeliveryProgressionResult::start(meta.job_run_id.clone());

    for candidate in deliveries {
        match progress_one(candidate.delivery_id().clone(), actor.clone(), meta.clone()).await {
            Ok(item) => result.accept(item),
            Err(err) if err.is_state_conflict() => result.skip(candidate.delivery_id().clone(), err),
            Err(err) => result.fail(candidate.delivery_id().clone(), err),
        }
    }

    Ok(result)
}

// [DeliveryProgressionService.progress_one(DeliveryId delivery_id, ActorContext actor, JobMetadata meta)]
// 单条 delivery 推进，包含事务和后端投递。
pub async fn progress_one(delivery_id: DeliveryId, actor: ActorContext, meta: JobMetadata) -> Result<DeliveryProgressionItemResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单 delivery 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::RunDeliveryProgression, actor.clone()).await?;

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery，避免并发投递。
    let mut delivery = delivery_repository.get_for_update(delivery_id.clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(delivery_id.clone()))?;
    let expected_version = delivery.version();

    // [ClockPort.now()]
    // 获取 attempt 开始时间。
    let now = clock.now();

    // [DeliveryLifecycle.can_transition(DeliveryStatus from_status, DeliveryStatus to_status)]
    // 验证是否允许进入 Dispatching。
    DeliveryLifecycle::can_transition(delivery.status().clone(), DeliveryStatus::Dispatching)?;

    // [DeliveryRecord.start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)]
    // 创建新的 delivery attempt。
    let attempt = delivery.start_attempt(delivery.backend_capability_ref().clone(), now)?;

    // [TransportBackendPort.dispatch(TransportSemantic semantic, DeliveryAttempt attempt, BackendDispatchContext context)]
    // 调用后端传输端口，不直接调用 MQ SDK。
    let backend_result = transport_backend.dispatch(delivery.transport_semantic().clone(), attempt.clone(), BackendDispatchContext::from_job(meta.clone())).await?;

    // [DeliveryAttempt.finish(BackendDeliveryResult result, Timestamp occurred_at)]
    // 根据归一化后端结果结束 attempt。
    delivery.finish_attempt(attempt.attempt_id().clone(), backend_result.clone(), clock.now())?;

    // [DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)]
    // 保存 delivery truth。
    delivery_repository.save(delivery.clone(), expected_version, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 delivery progression audit。
    audit_repository.append(BusAuditEntry::delivery_progressed(delivery.clone(), backend_result, actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 delivery、attempt、history 和 audit。
    unit_of_work.commit(uow).await?;

    Ok(DeliveryProgressionItemResult::from_delivery(delivery))
}
```

#### 7.6.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| scan schedulable | 无写事务 | 只读候选 |
| single delivery progression | 单 delivery `UnitOfWork` | 锁定、attempt、state、audit 同一提交 |
| backend dispatch | 在单 item 事务中调用 | P0 可接受；后续可在 Step 11 细化外部调用一致性 |
| job summary | 事务外汇总 | 不影响单条 delivery truth |

#### 7.6.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| delivery not found | item skipped | 回滚 |
| state conflict | item skipped with audit option | 回滚 |
| backend retryable error | item failed / retry candidate | 回滚或保存 failed attempt，Step 11 细化 |
| repository conflict | item failed | 回滚 |

#### 7.6.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `DeliveryRecord` | `Scheduled -> Dispatching`，后续可能 `Delivered / Failed` |
| `DeliveryAttempt` | created -> dispatching -> succeeded/failed |
| `DeliveryHistoryEntry` | 记录状态迁移 |
| Outbound event | `DeliveryStateChangedEvent` |

#### 7.6.7 测试切口

| 测试 | 验证内容 |
|---|---|
| dispatch success | attempt 创建、backend dispatch、delivery 保存 |
| state conflict | 不调用 backend port |
| backend failure | 不保存后端私有正文 |
| partial batch | 单条失败不影响其他 delivery |

### 7.7 `RecordDeliveryFeedbackFlow`

#### 7.7.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RecordDeliveryFeedback` |
| 入口函数 | `DeliveryFeedbackApi.record_feedback(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)` |
| application service | `FeedbackRecordingService.record(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 记录 bus 级 feedback，更新 delivery 状态，生成 history / audit / event |

#### 7.7.2 函数级调用图

```text
[DeliveryFeedbackApi]
  | call record_feedback(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)
  v
[FeedbackRecordingService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  v
[FeedbackResult + DeliveryRecord]
  | call FeedbackResult::from_command(RecordDeliveryFeedbackCommand command, ActorContext actor)
  | call DeliveryRecord.mark_completed(FeedbackResult feedback, ActorContext actor)
  | call DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)
  v
[Repositories]
  | save FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)
  | save DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | bind IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- feedback 是 bus 级结果，不等于业务补偿。
- duplicate feedback 通过 `IdempotencyRepository` 返回已有结果。
- fail / timeout 只能形成恢复候选，不生成 governance decision。

#### 7.7.3 关键伪代码

```rust
// [DeliveryFeedbackApi.record_feedback(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)]
// HTTP handler 转入 feedback application service。
pub async fn record_feedback(command: RecordDeliveryFeedbackCommand, actor: ActorContext, meta: CommandMetadata) -> Result<FeedbackRecordResult, ApiError> {
    feedback_service.record(command, actor, meta).await.map_err(ApiError::from)
}

// [FeedbackRecordingService.record(RecordDeliveryFeedbackCommand command, ActorContext actor, CommandMetadata meta)]
// 记录反馈并更新 delivery。
pub async fn record(command: RecordDeliveryFeedbackCommand, actor: ActorContext, meta: CommandMetadata) -> Result<FeedbackRecordResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单 feedback 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::RecordDeliveryFeedback, actor.clone()).await?;

    // [IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)]
    // 检查 feedback 幂等。
    if let Some(anchor) = idempotency_repository.find(IdempotencyScope::Feedback, meta.idempotency_key.clone()).await? {
        return Ok(FeedbackRecordResult::from_anchor(anchor));
    }

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery。
    let mut delivery = delivery_repository.get_for_update(command.delivery_id.clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(command.delivery_id.clone()))?;
    let expected_version = delivery.version();

    // [FeedbackResult::from_command(RecordDeliveryFeedbackCommand command, ActorContext actor)]
    // 将协议 feedback 转成 bus 级 feedback result。
    let feedback = FeedbackResult::from_command(command.clone(), actor.clone())?;

    // [DeliveryRecord.mark_completed(FeedbackResult feedback, ActorContext actor)]
    // ack feedback 推动 delivery 从 Delivered 进入 Completed。
    // [DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)]
    // fail / timeout feedback 推动 delivery 进入 Failed。
    match feedback.status {
        FeedbackStatus::Ack => delivery.mark_completed(feedback.clone(), actor.clone())?,
        FeedbackStatus::Fail | FeedbackStatus::Timeout => {
            let reason = FailureReason::from_feedback(feedback.clone());
            delivery.mark_failed(reason, actor.clone())?;
        }
        FeedbackStatus::Duplicate => return Ok(FeedbackRecordResult::from_duplicate(feedback)),
    }

    // [FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)]
    // 保存 feedback。
    feedback_repository.insert(feedback.clone(), uow.clone()).await?;

    // [DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)]
    // 保存 delivery 状态。
    delivery_repository.save(delivery.clone(), expected_version, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 保存 feedback audit。
    let audit_ref = audit_repository.append(BusAuditEntry::feedback_recorded(feedback.clone(), delivery.clone(), actor.clone()), uow.clone()).await?;

    // [IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)]
    // 绑定 feedback 幂等锚点。
    idempotency_repository.bind(IdempotencyAnchor::for_feedback(meta.idempotency_key, feedback.feedback_id().clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 feedback、delivery、audit 和 idempotency。
    unit_of_work.commit(uow).await?;

    Ok(FeedbackRecordResult::recorded(feedback, delivery.status().clone(), audit_ref))
}
```

#### 7.7.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| DTO validation | 无 | 非法 feedback 直接拒绝 |
| delivery lock / feedback write / audit / idempotency | `UnitOfWork` 内 | 单反馈原子提交 |
| outbound event | 提交后 | 发布 `FeedbackRecordedEvent` / `DeliveryStateChangedEvent` |

#### 7.7.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| unknown delivery | `404` | 回滚 |
| duplicate feedback | 返回已有结果 | 不写新 truth |
| invalid transition | `409` | 回滚 |
| repository error | `503` / `500` | 回滚 |

#### 7.7.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `FeedbackResult` | 创建 recorded feedback |
| `DeliveryRecord` | `Delivered -> Completed / Failed`; timeout 表达为 `FeedbackStatus::Timeout` + `DeliveryStatus::Failed` |
| `DeliveryHistoryEntry` | 记录 feedback 触发的状态变化 |
| Outbound event | `FeedbackRecordedEvent`、可能 `DeliveryStateChangedEvent` |

#### 7.7.7 测试切口

| 测试 | 验证内容 |
|---|---|
| ack feedback | delivery completed，feedback 保存 |
| fail feedback | delivery failed，形成恢复候选 |
| duplicate feedback | 不重复写 history |
| invalid transition | 返回 conflict，事务回滚 |

### 7.8 `ConsumeBackendDeliverySignalFlow`

#### 7.8.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeBackendDeliverySignal` |
| 入口函数 | `BackendSignalConsumer.consume(BackendDeliverySignalInput input, ActorContext actor, EventMetadata meta)` |
| application service | `FeedbackRecordingService.record_backend_signal(BackendDeliverySignalInput input, ActorContext actor, EventMetadata meta)` |
| 目标 | 归一化后端 signal，更新 attempt / feedback / delivery |

#### 7.8.2 函数级调用图

```text
[BackendSignalConsumer]
  | call consume(BackendDeliverySignalInput input, ActorContext actor, EventMetadata meta)
  v
[FeedbackRecordingService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)
  | call TransportBackendPort.normalize_signal(BackendDeliverySignal signal, BackendCapabilityRef capability_ref)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  v
[DeliveryAttempt + FeedbackResult]
  | call DeliveryRecord.finish_attempt(AttemptId attempt_id, BackendDeliveryResult result, Timestamp occurred_at)
  | call FeedbackResult::from_backend_result(BackendDeliveryResult result, ActorContext actor)
  v
[Repositories]
  | save FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)
  | save DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)
  | append audit
  | tx commit
```

关键说明：

- 后端 signal 必须先经 `TransportBackendPort.normalize_signal()`。
- 本仓只保存归一化结果和后端结果引用。
- unknown delivery 可以形成 dead signal audit 或 ignored result，不能创建悬空 delivery。

#### 7.8.3 关键伪代码

```rust
// [BackendSignalConsumer.consume(BackendDeliverySignalInput input, ActorContext actor, EventMetadata meta)]
// 后端信号 consumer 进入 feedback recording service。
pub async fn consume(input: BackendDeliverySignalInput, actor: ActorContext, meta: EventMetadata) -> Result<BackendSignalResult, ConsumerError> {
    feedback_service.record_backend_signal(input, actor, meta).await.map_err(ConsumerError::from)
}

// [FeedbackRecordingService.record_backend_signal(BackendDeliverySignalInput input, ActorContext actor, EventMetadata meta)]
// 归一化后端信号并写入 bus feedback。
pub async fn record_backend_signal(input: BackendDeliverySignalInput, actor: ActorContext, meta: EventMetadata) -> Result<BackendSignalResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单 signal 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::ConsumeBackendSignal, actor.clone()).await?;

    // [IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)]
    // 检查 signal 幂等。
    if let Some(anchor) = idempotency_repository.find(IdempotencyScope::BackendSignal, input.idempotency_key.clone()).await? {
        return Ok(BackendSignalResult::duplicate(anchor));
    }

    // [TransportBackendPort.normalize_signal(BackendDeliverySignal signal, BackendCapabilityRef capability_ref)]
    // 将后端状态归一化为 bus backend result。
    let backend_result = transport_backend.normalize_signal(input.to_backend_signal(), input.backend_capability_ref.clone()).await?;

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery。
    let mut delivery = delivery_repository.get_for_update(input.delivery_id.clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(input.delivery_id.clone()))?;
    let expected_version = delivery.version();

    // [DeliveryRecord.finish_attempt(AttemptId attempt_id, BackendDeliveryResult result, Timestamp occurred_at)]
    // 完成本次 attempt。
    delivery.finish_attempt(input.attempt_id.clone(), backend_result.clone(), clock.now())?;

    // [FeedbackResult::from_backend_result(BackendDeliveryResult result, ActorContext actor)]
    // 生成 bus 级 feedback。
    let feedback = FeedbackResult::from_backend_result(backend_result.clone(), actor.clone())?;

    // [DeliveryRecord.mark_delivered(DeliveryAttempt attempt, ActorContext actor)]
    // 后端 delivered signal 只把 delivery 推进到 Delivered，不进入 Completed。
    // [DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)]
    // 后端 failed signal 推进 delivery 到 Failed。
    match backend_result.status {
        BackendDeliveryStatus::Delivered => {
            let attempt = delivery.current_attempt()?;
            delivery.mark_delivered(attempt, actor.clone())?;
        }
        BackendDeliveryStatus::Failed => {
            let reason = FailureReason::from_backend_result(backend_result.clone());
            delivery.mark_failed(reason, actor.clone())?;
        }
    }

    // [FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)]
    // 保存 feedback。
    feedback_repository.insert(feedback.clone(), uow.clone()).await?;

    // [DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)]
    // 保存 delivery。
    delivery_repository.save(delivery.clone(), expected_version, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加后端 signal audit。
    let audit_ref = audit_repository.append(BusAuditEntry::backend_signal_recorded(input.event_id.clone(), feedback.clone(), actor.clone()), uow.clone()).await?;

    // [IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)]
    // 绑定 signal 幂等锚点。
    idempotency_repository.bind(IdempotencyAnchor::for_backend_signal(input.idempotency_key, feedback.feedback_id().clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 signal 处理结果。
    unit_of_work.commit(uow).await?;

    Ok(BackendSignalResult::recorded(feedback, audit_ref))
}
```

#### 7.8.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| signal normalize | 当前写事务内 | 后续 Step 11 可细化为事务外归一化 |
| delivery / feedback / audit / idempotency | `UnitOfWork` 内 | 单 signal 原子提交 |
| outbound event | 提交后 | 发布 feedback / delivery state changed |

#### 7.8.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| invalid backend status | rejected signal | 回滚 |
| unknown delivery | ignored / audited dead signal | 回滚或只写 audit，Step 12 细化 |
| duplicate signal | duplicate result | 不写新 truth |
| backend private body present | boundary violation | 回滚 |

#### 7.8.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `DeliveryAttempt` | finished |
| `FeedbackResult` | created from backend result |
| `DeliveryRecord` | completed / failed |
| Outbound event | `FeedbackRecordedEvent`、`DeliveryStateChangedEvent` |

#### 7.8.7 测试切口

| 测试 | 验证内容 |
|---|---|
| delivered signal | attempt finished，feedback ack |
| failed signal | feedback fail，不保存后端正文 |
| duplicate signal | 不重复写 feedback |
| unknown delivery | 不创建悬空 delivery |

### 7.9 `ConsumeTimeoutSignalFlow`

#### 7.9.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ConsumeTimeoutSignal` |
| 入口函数 | `TimeoutSignalConsumer.consume(DeliveryTimeoutSignalInput input, ActorContext actor, EventMetadata meta)` |
| application service | `FeedbackRecordingService.record_timeout(DeliveryTimeoutSignalInput input, ActorContext actor, EventMetadata meta)` |
| 目标 | 将 timeout signal 记录为 bus 级 timeout feedback，并形成恢复候选 |

#### 7.9.2 函数级调用图

```text
[TimeoutSignalConsumer]
  | call consume(DeliveryTimeoutSignalInput input, ActorContext actor, EventMetadata meta)
  v
[FeedbackRecordingService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  v
[FeedbackResult + DeliveryRecord]
  | call FeedbackResult::timeout(DeliveryId delivery_id, TimeoutReason reason, Timestamp occurred_at)
  | call DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)
  | call RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)
  v
[Repositories]
  | save FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)
  | save DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)
  | append audit
  | tx commit
```

关键说明：

- timeout 是 bus 级反馈，不代表业务处理失败正文。
- timeout 可以形成 recovery candidate，但不直接创建 retry plan。
- duplicate timeout 返回已有处理结果。

#### 7.9.3 关键伪代码

```rust
// [TimeoutSignalConsumer.consume(DeliveryTimeoutSignalInput input, ActorContext actor, EventMetadata meta)]
// timeout consumer 进入 feedback service。
pub async fn consume(input: DeliveryTimeoutSignalInput, actor: ActorContext, meta: EventMetadata) -> Result<TimeoutRecordResult, ConsumerError> {
    feedback_service.record_timeout(input, actor, meta).await.map_err(ConsumerError::from)
}

// [FeedbackRecordingService.record_timeout(DeliveryTimeoutSignalInput input, ActorContext actor, EventMetadata meta)]
// 记录 timeout feedback。
pub async fn record_timeout(input: DeliveryTimeoutSignalInput, actor: ActorContext, meta: EventMetadata) -> Result<TimeoutRecordResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启 timeout 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::ConsumeTimeoutSignal, actor.clone()).await?;

    // [IdempotencyRepository.find(IdempotencyScope scope, IdempotencyKey key)]
    // 检查 timeout 幂等。
    if let Some(anchor) = idempotency_repository.find(IdempotencyScope::TimeoutSignal, input.idempotency_key.clone()).await? {
        return Ok(TimeoutRecordResult::duplicate(anchor));
    }

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery。
    let mut delivery = delivery_repository.get_for_update(input.delivery_id.clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(input.delivery_id.clone()))?;
    let expected_version = delivery.version();

    // [FeedbackResult::timeout(DeliveryId delivery_id, TimeoutReason reason, Timestamp occurred_at)]
    // 创建 timeout feedback。
    let feedback = FeedbackResult::timeout(input.delivery_id.clone(), input.timeout_reason.clone(), input.occurred_at)?;

    // [DeliveryRecord.mark_failed(FailureReason reason, ActorContext actor)]
    // timeout feedback 表达为 FailureReason 后推进 delivery 到 Failed。
    let reason = FailureReason::from_feedback(feedback.clone());
    delivery.mark_failed(reason, actor.clone())?;

    // [RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)]
    // 只判断恢复候选，不创建 retry plan。
    let recovery_candidate = recovery_policy.can_retry(delivery.clone(), RetryPlan::empty_for(delivery.delivery_id().clone()));

    // [FeedbackRepository.insert(FeedbackResult feedback, UnitOfWorkHandle uow)]
    // 保存 timeout feedback。
    feedback_repository.insert(feedback.clone(), uow.clone()).await?;

    // [DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)]
    // 保存 delivery 状态。
    delivery_repository.save(delivery.clone(), expected_version, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 保存 timeout audit。
    let audit_ref = audit_repository.append(BusAuditEntry::timeout_recorded(feedback.clone(), recovery_candidate, actor.clone()), uow.clone()).await?;

    // [IdempotencyRepository.bind(IdempotencyAnchor anchor, UnitOfWorkHandle uow)]
    // 绑定 timeout 幂等锚点。
    idempotency_repository.bind(IdempotencyAnchor::for_timeout(input.idempotency_key, feedback.feedback_id().clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 timeout 处理结果。
    unit_of_work.commit(uow).await?;

    Ok(TimeoutRecordResult::recorded(feedback, recovery_candidate, audit_ref))
}
```

#### 7.9.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| timeout DTO validation | 无 | 非法 signal 直接拒绝 |
| delivery / feedback / audit / idempotency | `UnitOfWork` 内 | 单 timeout 原子提交 |
| retry plan | 不在本流程创建 | 由 `RequestRetry` 或 `RunRetryCycle` 处理 |

#### 7.9.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| unknown delivery | ignored / not_found result | 回滚 |
| duplicate timeout | duplicate result | 不写新 truth |
| invalid transition | conflict result | 回滚 |
| repository error | retryable consumer error | 回滚 |

#### 7.9.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `FeedbackResult` | timeout feedback created |
| `DeliveryRecord` | `Dispatching / Delivered -> Failed`; timeout 表达为 `FeedbackStatus::Timeout` |
| `BusAuditEntry` | timeout audit |
| Outbound event | `FeedbackRecordedEvent`、`FailureMaterialAvailableEvent` 可选 |

#### 7.9.7 测试切口

| 测试 | 验证内容 |
|---|---|
| timeout recorded | feedback / delivery / audit 一致 |
| duplicate timeout | 不重复写入 |
| invalid transition | 回滚 |
| recovery candidate | 只标记候选，不创建 retry plan |

### 7.10 `RequestRetryFlow`

#### 7.10.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RequestRetry` |
| 入口函数 | `RecoveryOperationsApi.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)` |
| application service | `RecoveryOrchestrationService.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 基于 failure material 和 retry policy 创建或更新 retry plan |

#### 7.10.2 函数级调用图

```text
[RecoveryOperationsApi]
  | call request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)
  v
[RecoveryOrchestrationService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  | call RecoveryRepository.get_failure_material(FailureMaterialId failure_material_id)
  v
[RecoveryEligibilityPolicy + RetryPlan]
  | call RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)
  | call RetryPlan::create(DeliveryRecord delivery, FailureReason reason, RetryPolicyRef policy_ref)
  v
[Repositories]
  | save RecoveryRepository.save_retry_plan(RetryPlan retry_plan, Option<Version> expected_version, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- retry 是受控恢复入口，不是重新 publish。
- `RequestRetry` 不直接调用 backend。
- retry plan 创建后由 `RunRetryCycle` 执行。

#### 7.10.3 关键伪代码

```rust
// [RecoveryOperationsApi.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)]
// HTTP command handler 转入恢复编排服务。
pub async fn request_retry(command: RequestRetryCommand, actor: ActorContext, meta: CommandMetadata) -> Result<RetryPlanResult, ApiError> {
    recovery_service.request_retry(command, actor, meta).await.map_err(ApiError::from)
}

// [RecoveryOrchestrationService.request_retry(RequestRetryCommand command, ActorContext actor, CommandMetadata meta)]
// 创建或更新 retry plan。
pub async fn request_retry(command: RequestRetryCommand, actor: ActorContext, meta: CommandMetadata) -> Result<RetryPlanResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启 retry request 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::RequestRetry, actor.clone()).await?;

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery，避免同时进入 DLQ 或 replay preparation。
    let delivery = delivery_repository.get_for_update(command.delivery_id.clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(command.delivery_id.clone()))?;

    // [RecoveryRepository.get_failure_material(FailureMaterialId failure_material_id)]
    // 读取失败材料。
    let material = recovery_repository.get_failure_material(command.failure_material_ref.clone().into()).await?.ok_or(ApplicationError::missing_failure_material(command.failure_material_ref.clone()))?;

    // [RecoveryEligibilityPolicy.can_retry(DeliveryRecord delivery, RetryPlan plan)]
    // 判断是否允许 retry。
    recovery_policy.can_retry(delivery.clone(), RetryPlan::empty_for(delivery.delivery_id().clone()))?;

    // [RetryPlan::create(DeliveryRecord delivery, FailureReason reason, RetryPolicyRef policy_ref)]
    // 创建 retry plan。
    let retry_plan = RetryPlan::create(delivery.clone(), material.failure_reason().clone(), command.retry_policy_ref.clone())?;

    // [RecoveryRepository.save_retry_plan(RetryPlan retry_plan, Option<Version> expected_version, UnitOfWorkHandle uow)]
    // 保存 retry plan。
    let version = recovery_repository.save_retry_plan(retry_plan.clone(), None, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 retry request audit。
    let audit_ref = audit_repository.append(BusAuditEntry::retry_requested(retry_plan.clone(), actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 retry plan 和 audit。
    unit_of_work.commit(uow).await?;

    Ok(RetryPlanResult::scheduled(retry_plan, version, audit_ref))
}
```

#### 7.10.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| command validation | 无 | 参数非法直接拒绝 |
| delivery lock / retry plan / audit | `UnitOfWork` 内 | retry plan 与审计同一提交 |
| backend dispatch | 不发生 | 由 `RunRetryCycle` 执行 |

#### 7.10.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| delivery not found | `404` | 回滚 |
| missing failure material | `404` / `422` | 回滚 |
| not eligible | `409` | 回滚 |
| existing active retry plan | `409` 或返回已有计划 | 不写新计划 |

#### 7.10.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `RetryPlan` | `New -> Scheduled` |
| `BusAuditEntry` | retry requested audit |
| Outbound event | 可发布 `DeliveryStateChangedEvent` 或 recovery scheduled event，具体 event kind Step 12/15 细化 |

#### 7.10.7 测试切口

| 测试 | 验证内容 |
|---|---|
| eligible retry | 创建 scheduled retry plan |
| not eligible | 不创建 retry plan |
| missing failure material | 返回错误并回滚 |
| duplicate active plan | 不重复创建 |

### 7.11 `RunRetryCycleFlow`

#### 7.11.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RunRetryCycle` |
| 入口函数 | `RetryCycleJobRunner.run(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)` |
| application service | `RecoveryOrchestrationService.run_retry_cycle(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)` |
| 目标 | 扫描 due retry plan，触发新 delivery attempt 或标记 exhausted |

#### 7.11.2 函数级调用图

```text
[RetryCycleJobRunner]
  | call run(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)
  v
[RecoveryOrchestrationService]
  | call RecoveryRepository.find_due_retry(RetryScanCursor cursor, PageLimit limit, Timestamp now)
  v
[For Each RetryPlan]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  | call RetryPlan.has_remaining_attempts()
  | call DeliveryRecord.start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)
  | call TransportBackendPort.dispatch(TransportSemantic semantic, DeliveryAttempt attempt, BackendDispatchContext context)
  | save DeliveryRepository.save(...)
  | save RecoveryRepository.save_retry_plan(...)
  | append audit
  | tx commit
```

关键说明：

- `RunRetryCycle` 只能执行已有 retry plan。
- 新 attempt 仍然经 `TransportBackendPort`。
- exhausted 状态不自动进入 DLQ，DLQ 由 `MoveDeliveryToDeadLetter` 控制。

#### 7.11.3 关键伪代码

```rust
// [RetryCycleJobRunner.run(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)]
// Job runner 触发 retry cycle。
pub async fn run(job: RunRetryCycleJob, actor: ActorContext, meta: JobMetadata) -> Result<RetryCycleResult, JobError> {
    recovery_service.run_retry_cycle(job, actor, meta).await.map_err(JobError::from)
}

// [RecoveryOrchestrationService.run_retry_cycle(RunRetryCycleJob job, ActorContext actor, JobMetadata meta)]
// 扫描 due retry plan 并逐条处理。
pub async fn run_retry_cycle(job: RunRetryCycleJob, actor: ActorContext, meta: JobMetadata) -> Result<RetryCycleResult, ApplicationError> {
    // [ClockPort.now()]
    // 获取扫描时间。
    let now = clock.now();

    // [RecoveryRepository.find_due_retry(RetryScanCursor cursor, PageLimit limit, Timestamp now)]
    // 查询到期 retry plan。
    let retry_plans = recovery_repository.find_due_retry(job.cursor.clone(), job.batch_size, now).await?;
    let mut result = RetryCycleResult::start(meta.job_run_id.clone());

    for plan in retry_plans {
        match run_retry_plan(plan, actor.clone(), meta.clone()).await {
            Ok(item) => result.accept(item),
            Err(err) if err.is_not_eligible() => result.skip(err),
            Err(err) => result.fail(err),
        }
    }

    Ok(result)
}

// [RecoveryOrchestrationService.run_retry_plan(RetryPlan retry_plan, ActorContext actor, JobMetadata meta)]
// 单个 retry plan 执行。
pub async fn run_retry_plan(retry_plan: RetryPlan, actor: ActorContext, meta: JobMetadata) -> Result<RetryPlanRunResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单 retry plan 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::RunRetryCycle, actor.clone()).await?;

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery。
    let mut delivery = delivery_repository.get_for_update(retry_plan.delivery_id().clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(retry_plan.delivery_id().clone()))?;
    let delivery_version = delivery.version();

    // [RetryPlan.has_remaining_attempts()]
    // 判断 retry 次数。
    if !retry_plan.has_remaining_attempts() {
        let exhausted = retry_plan.mark_exhausted(actor.clone())?;
        recovery_repository.save_retry_plan(exhausted.clone(), Some(retry_plan.version()), uow.clone()).await?;
        audit_repository.append(BusAuditEntry::retry_exhausted(exhausted.clone(), actor.clone()), uow.clone()).await?;
        unit_of_work.commit(uow).await?;
        return Ok(RetryPlanRunResult::exhausted(exhausted));
    }

    // [DeliveryRecord.start_attempt(BackendCapabilityRef capability_ref, Timestamp occurred_at)]
    // 创建 retry attempt。
    let attempt = delivery.start_attempt(delivery.backend_capability_ref().clone(), clock.now())?;

    // [TransportBackendPort.dispatch(TransportSemantic semantic, DeliveryAttempt attempt, BackendDispatchContext context)]
    // 经后端端口执行 retry 投递。
    let backend_result = transport_backend.dispatch(delivery.transport_semantic().clone(), attempt.clone(), BackendDispatchContext::from_job(meta.clone())).await?;

    // [DeliveryRecord.finish_attempt(AttemptId attempt_id, BackendDeliveryResult result, Timestamp occurred_at)]
    // 记录 retry attempt 结果。
    delivery.finish_attempt(attempt.attempt_id().clone(), backend_result.clone(), clock.now())?;

    // [RetryPlan.mark_attempted(AttemptId attempt_id, BackendDeliveryResult result)]
    // 更新 retry plan 尝试次数和状态。
    let updated_plan = retry_plan.mark_attempted(attempt.attempt_id().clone(), backend_result.clone())?;

    // [DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)]
    // 保存 delivery。
    delivery_repository.save(delivery.clone(), delivery_version, uow.clone()).await?;

    // [RecoveryRepository.save_retry_plan(RetryPlan retry_plan, Option<Version> expected_version, UnitOfWorkHandle uow)]
    // 保存 retry plan。
    recovery_repository.save_retry_plan(updated_plan.clone(), Some(retry_plan.version()), uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 retry run audit。
    audit_repository.append(BusAuditEntry::retry_attempted(updated_plan.clone(), delivery.clone(), actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 retry attempt。
    unit_of_work.commit(uow).await?;

    Ok(RetryPlanRunResult::attempted(updated_plan, delivery))
}
```

#### 7.11.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| scan due retry | 无写事务 | 只读候选 |
| single retry plan | 单 plan `UnitOfWork` | delivery、retry plan、audit 同一提交 |
| backend dispatch | 单 plan 流程中调用 | 后续 Step 11 细化外部调用一致性 |

#### 7.11.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| delivery missing | item failed | 回滚 |
| no remaining attempts | mark exhausted | 提交 exhausted |
| backend failure | 保存失败 attempt 或 item failed，Step 11 细化 | 视失败类型 |
| version conflict | item retryable failure | 回滚 |

#### 7.11.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `RetryPlan` | `Scheduled -> Exhausted / Cancelled`; due retry 保持 `Scheduled` 并记录 attempt metadata |
| `DeliveryRecord` | 新增 retry attempt |
| `BusAuditEntry` | retry attempted / exhausted audit |
| Outbound event | `DeliveryStateChangedEvent` |

#### 7.11.7 测试切口

| 测试 | 验证内容 |
|---|---|
| due retry attempt prepared | 创建 attempt metadata 并保持 retry plan 为 `Scheduled` |
| exhausted plan | 不调用 backend，标记 exhausted |
| backend failure | 不保存后端私有正文 |
| partial batch | 单 plan 失败不影响其他 plan |

### 7.12 `MoveDeliveryToDeadLetterFlow`

#### 7.12.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `MoveDeliveryToDeadLetter` |
| 入口函数 | `RecoveryOperationsApi.move_delivery_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)` |
| application service | `RecoveryOrchestrationService.move_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 将失败 delivery 收纳为 dead letter，并保存 failure material |

#### 7.12.2 函数级调用图

```text
[RecoveryOperationsApi]
  | call move_delivery_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)
  v
[RecoveryOrchestrationService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)
  | call FeedbackRepository.get_failure(DeliveryId delivery_id)
  | call DeliveryRepository.load_history(DeliveryId delivery_id, PageRequest page)
  v
[FailureMaterial + DeadLetterEntry]
  | call FailureMaterial::from_feedback(FeedbackResult feedback, DeliveryHistoryEntry history)
  | call RecoveryEligibilityPolicy.can_dead_letter(DeliveryRecord delivery, FailureMaterial material)
  | call DeadLetterEntry::from_failed_delivery(DeliveryRecord delivery, FailureMaterial material)
  v
[Repositories]
  | save RecoveryRepository.save_dead_letter(DeadLetterEntry entry, FailureMaterial material, UnitOfWorkHandle uow)
  | save DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- DLQ 是失败事实收纳，不执行 replay。
- `FailureMaterial` 只保存失败材料引用和摘要。
- governance decision 不由本流程生成。

#### 7.12.3 关键伪代码

```rust
// [RecoveryOperationsApi.move_delivery_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)]
// HTTP command handler 转入恢复服务。
pub async fn move_delivery_to_dead_letter(command: MoveDeliveryToDeadLetterCommand, actor: ActorContext, meta: CommandMetadata) -> Result<DeadLetterResult, ApiError> {
    recovery_service.move_to_dead_letter(command, actor, meta).await.map_err(ApiError::from)
}

// [RecoveryOrchestrationService.move_to_dead_letter(MoveDeliveryToDeadLetterCommand command, ActorContext actor, CommandMetadata meta)]
// 创建 dead letter entry。
pub async fn move_to_dead_letter(command: MoveDeliveryToDeadLetterCommand, actor: ActorContext, meta: CommandMetadata) -> Result<DeadLetterResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启 DLQ 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::MoveDeliveryToDeadLetter, actor.clone()).await?;

    // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
    // 锁定 delivery。
    let mut delivery = delivery_repository.get_for_update(command.delivery_id.clone(), uow.clone()).await?.ok_or(ApplicationError::not_found(command.delivery_id.clone()))?;
    let expected_version = delivery.version();

    // [FeedbackRepository.get_failure(DeliveryId delivery_id)]
    // 获取失败 feedback。
    let feedback = feedback_repository.get_failure(command.delivery_id.clone()).await?.ok_or(ApplicationError::missing_failure(command.delivery_id.clone()))?;

    // [DeliveryRepository.load_history(DeliveryId delivery_id, PageRequest page)]
    // 读取必要 history，用于形成 failure material。
    let history = delivery_repository.load_history(command.delivery_id.clone(), PageRequest::latest()).await?;

    // [FailureMaterial::from_feedback(FeedbackResult feedback, DeliveryHistoryEntry history)]
    // 生成失败材料，不包含治理决策。
    let material = FailureMaterial::from_feedback(feedback.clone(), history.latest_entry()?)?;

    // [RecoveryEligibilityPolicy.can_dead_letter(DeliveryRecord delivery, FailureMaterial material)]
    // 判断是否允许进入 DLQ。
    recovery_policy.can_dead_letter(delivery.clone(), material.clone())?;

    // [DeadLetterEntry::from_failed_delivery(DeliveryRecord delivery, FailureMaterial material)]
    // 创建 DLQ entry。
    let entry = DeadLetterEntry::from_failed_delivery(delivery.clone(), material.clone())?;

    // [DeliveryRecord.mark_dead_lettered(DeadLetterId dead_letter_id, ActorContext actor)]
    // 标记 delivery 已进入 DLQ。
    delivery.mark_dead_lettered(entry.dead_letter_id().clone(), actor.clone())?;

    // [RecoveryRepository.save_dead_letter(DeadLetterEntry entry, FailureMaterial material, UnitOfWorkHandle uow)]
    // 保存 DLQ 和 failure material。
    recovery_repository.save_dead_letter(entry.clone(), material.clone(), uow.clone()).await?;

    // [DeliveryRepository.save(DeliveryRecord delivery, Version expected_version, UnitOfWorkHandle uow)]
    // 保存 delivery 状态。
    delivery_repository.save(delivery.clone(), expected_version, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 DLQ audit。
    let audit_ref = audit_repository.append(BusAuditEntry::dead_letter_created(entry.clone(), actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 DLQ 结果。
    unit_of_work.commit(uow).await?;

    Ok(DeadLetterResult::created(entry, material.failure_material_id().clone(), audit_ref))
}
```

#### 7.12.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| validation | 无 | DTO 非法直接拒绝 |
| delivery lock / DLQ / failure material / audit | `UnitOfWork` 内 | 原子提交 |
| outbound event | 提交后 | 发布 `DeadLetterCreatedEvent` |

#### 7.12.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| missing delivery | `404` | 回滚 |
| missing failure feedback | `404` / `422` | 回滚 |
| not eligible | `409` | 回滚 |
| repository failure | `503` / `500` | 回滚 |

#### 7.12.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `DeliveryRecord` | `Failed -> DeadLettered` |
| `DeadLetterEntry` | `New -> Open` |
| `FailureMaterial` | available |
| Outbound event | `DeadLetterCreatedEvent`、`FailureMaterialAvailableEvent` |

#### 7.12.7 测试切口

| 测试 | 验证内容 |
|---|---|
| dead letter created | entry、material、delivery 状态一致 |
| not eligible | 不保存 DLQ |
| missing failure material | 返回错误并回滚 |
| no governance decision | failure material 不含治理正文 |

### 7.13 `PrepareReplayFlow`

#### 7.13.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `PrepareReplay` |
| 入口函数 | `RecoveryOperationsApi.prepare_replay(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)` |
| application service | `ReplayPreparationService.prepare(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 基于 dead letter、audit chain 和 approval ref 创建 replay preparation |

#### 7.13.2 函数级调用图

```text
[RecoveryOperationsApi]
  | call prepare_replay(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)
  v
[ReplayPreparationService]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call RecoveryRepository.get_dead_letter(DeadLetterId dead_letter_id)
  | call AuditTrailRepository.load_chain(AuditChainRef chain_ref)
  v
[RecoveryEligibilityPolicy + ReplayPreparation]
  | call RecoveryEligibilityPolicy.can_prepare_replay(DeadLetterEntry entry, AuditChainRef audit_chain_ref)
  | call ReplayPreparation::prepare(DeadLetterEntry entry, ActorContext actor)
  v
[Repositories]
  | save RecoveryRepository.save_replay_preparation(ReplayPreparation preparation, UnitOfWorkHandle uow)
  | append AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- replay preparation 不是 replay execution。
- 必须有 dead letter、audit chain 和 approval ref。
- 不读取或写入 payload body。

#### 7.13.3 关键伪代码

```rust
// [RecoveryOperationsApi.prepare_replay(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)]
// HTTP command handler 转入 replay preparation service。
pub async fn prepare_replay(command: PrepareReplayCommand, actor: ActorContext, meta: CommandMetadata) -> Result<ReplayPreparationResult, ApiError> {
    replay_service.prepare(command, actor, meta).await.map_err(ApiError::from)
}

// [ReplayPreparationService.prepare(PrepareReplayCommand command, ActorContext actor, CommandMetadata meta)]
// 创建 replay preparation。
pub async fn prepare(command: PrepareReplayCommand, actor: ActorContext, meta: CommandMetadata) -> Result<ReplayPreparationResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启 replay preparation 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::PrepareReplay, actor.clone()).await?;

    // [RecoveryRepository.get_dead_letter(DeadLetterId dead_letter_id)]
    // 读取 dead letter entry。
    let entry = recovery_repository.get_dead_letter(command.dead_letter_id.clone()).await?.ok_or(ApplicationError::not_found(command.dead_letter_id.clone()))?;

    // [AuditTrailRepository.load_chain(AuditChainRef chain_ref)]
    // 读取审计链。
    let audit_chain = audit_repository.load_chain(command.audit_chain_ref.clone()).await?;

    // [RecoveryEligibilityPolicy.can_prepare_replay(DeadLetterEntry entry, AuditChainRef audit_chain_ref)]
    // 验证 replay 前置条件。
    recovery_policy.can_prepare_replay(entry.clone(), command.audit_chain_ref.clone())?;

    // [ReplayPreparation::prepare(DeadLetterEntry entry, ActorContext actor)]
    // 创建 ready replay preparation。
    let preparation = ReplayPreparation::prepare(entry.clone(), command.approval_ref.clone(), audit_chain.chain_ref().clone(), actor.clone())?;

    // [RecoveryRepository.save_replay_preparation(ReplayPreparation preparation, UnitOfWorkHandle uow)]
    // 保存 replay preparation。
    let version = recovery_repository.save_replay_preparation(preparation.clone(), uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 replay preparation audit。
    let audit_ref = audit_repository.append(BusAuditEntry::replay_preparation_ready(preparation.clone(), actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 replay preparation。
    unit_of_work.commit(uow).await?;

    Ok(ReplayPreparationResult::ready(preparation, version, audit_ref))
}
```

#### 7.13.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| dead letter / audit chain read | 可在事务内读取 | 与 preparation 写入保持一致视图 |
| replay preparation / audit | `UnitOfWork` 内 | 原子提交 |
| replay execution | 不发生 | 后续仓或后续能力处理 |

#### 7.13.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| dead letter not found | `404` | 回滚 |
| audit chain invalid | `422` | 回滚 |
| approval missing | `400` / `422` | 回滚 |
| already prepared | `409` 或返回已有 preparation | 不重复创建 |

#### 7.13.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `ReplayPreparation` | `New -> Draft -> Ready` |
| `BusAuditEntry` | replay preparation ready audit |
| Outbound event | `ReplayPreparationReadyEvent` |

#### 7.13.7 测试切口

| 测试 | 验证内容 |
|---|---|
| preparation ready | 保存 replay preparation 和 audit |
| missing approval | 不创建 preparation |
| invalid audit chain | 返回错误并回滚 |
| no replay execution | 不触发实际 replay |

### 7.14 `RunReadOutputProjectionFlow`

#### 7.14.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RunReadOutputProjection` |
| 入口函数 | `ReadOutputProjectionJobRunner.run(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)` |
| application service | `ReadOutputService.run_projection(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)` |
| 目标 | 基于已提交 truth / audit 增量更新只读投影 |

#### 7.14.2 函数级调用图

```text
[ReadOutputProjectionJobRunner]
  | call run(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)
  v
[ReadOutputService]
  | call AuditTrailRepository.scan_committed(AuditCursor cursor, PageLimit limit)
  v
[For Each Audit Entry]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)
  | call FailureSummaryProjection::derive(FailureMaterial material, BusAuditEntry audit)
  | call ReadOnlyOutputPolicy.allows_projection_write(ProjectionWriteIntent intent)
  | save ReadProjectionRepository.upsert_transport_view(...)
  | save ReadProjectionRepository.upsert_failure_summary(...)
  | tx commit
```

关键说明：

- projection 只从已提交 truth / audit 派生。
- projection 写失败不能反向撤销 truth。
- projection 输出不得包含 payload body、secret 或后端私有正文。

#### 7.14.3 关键伪代码

```rust
// [ReadOutputProjectionJobRunner.run(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)]
// Job runner 触发增量 projection。
pub async fn run(job: RunReadOutputProjectionJob, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionJobResult, JobError> {
    read_output_service.run_projection(job, actor, meta).await.map_err(JobError::from)
}

// [ReadOutputService.run_projection(RunReadOutputProjectionJob job, ActorContext actor, JobMetadata meta)]
// 扫描 audit 并派生 projection。
pub async fn run_projection(job: RunReadOutputProjectionJob, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionJobResult, ApplicationError> {
    // [AuditTrailRepository.scan_committed(AuditCursor cursor, PageLimit limit)]
    // 扫描已提交 audit。
    let page = audit_repository.scan_committed(job.audit_cursor.clone(), job.batch_size).await?;
    let mut result = ProjectionJobResult::start(meta.job_run_id.clone(), page.next_cursor.clone());

    for audit in page.items {
        match project_one(audit, actor.clone(), meta.clone()).await {
            Ok(item) => result.updated(item),
            Err(err) if err.is_projection_skip() => result.skipped(err),
            Err(err) => result.failed(err),
        }
    }

    Ok(result)
}

// [ReadOutputService.project_one(BusAuditEntry audit, ActorContext actor, JobMetadata meta)]
// 单条 audit 派生 projection。
pub async fn project_one(audit: BusAuditEntry, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionItemResult, ApplicationError> {
    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启单 projection item 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::RunReadOutputProjection, actor.clone()).await?;

    // [ReadOnlyOutputPolicy.allows_projection_write(ProjectionWriteIntent intent)]
    // 检查只读输出边界。
    read_only_policy.allows_projection_write(ProjectionWriteIntent::from_audit(audit.clone()))?;

    if audit.is_delivery_related() {
        // [DeliveryRepository.get_for_update(DeliveryId delivery_id, UnitOfWorkHandle uow)]
        // 读取 delivery truth 用于派生 projection。
        let delivery = delivery_repository.get_for_update(audit.delivery_id()?, uow.clone()).await?.ok_or(ApplicationError::projection_source_missing(audit.audit_id().clone()))?;

        // [TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)]
        // 派生 transport view。
        let transport_view = TransportViewProjection::derive(delivery, audit.clone())?;

        // [ReadProjectionRepository.upsert_transport_view(TransportViewProjection projection, UnitOfWorkHandle uow)]
        // 写入 transport view projection。
        read_projection_repository.upsert_transport_view(transport_view.clone(), uow.clone()).await?;
    }

    if audit.is_failure_related() {
        // [RecoveryRepository.get_failure_material(FailureMaterialId failure_material_id)]
        // 读取 failure material。
        let material = recovery_repository.get_failure_material(audit.failure_material_id()?).await?.ok_or(ApplicationError::projection_source_missing(audit.audit_id().clone()))?;

        // [FailureSummaryProjection::derive(FailureMaterial material, BusAuditEntry audit)]
        // 派生 failure summary。
        let failure_summary = FailureSummaryProjection::derive(material, audit.clone())?;

        // [ReadProjectionRepository.upsert_failure_summary(FailureSummaryProjection projection, UnitOfWorkHandle uow)]
        // 写入 failure summary projection。
        read_projection_repository.upsert_failure_summary(failure_summary.clone(), uow.clone()).await?;
    }

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 projection item。
    unit_of_work.commit(uow).await?;

    Ok(ProjectionItemResult::updated(audit.audit_id().clone()))
}
```

#### 7.14.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| scan audit | 无写事务 | 只读已提交 audit |
| single projection item | `UnitOfWork` | projection 写入单独提交 |
| truth | 不写 | projection 不反写真相 |

#### 7.14.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| source truth missing | skipped with consistency marker | 回滚 projection item |
| boundary violation | failed item | 回滚 |
| projection store unavailable | retryable failure | 回滚 |
| unsupported audit kind | skipped | 无写入 |

#### 7.14.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `TransportViewProjection` | upsert current view |
| `FailureSummaryProjection` | upsert current summary |
| truth object | 无变化 |
| Outbound event | `TransportViewUpdatedEvent`、`FailureMaterialAvailableEvent` 可选 |

#### 7.14.7 测试切口

| 测试 | 验证内容 |
|---|---|
| transport projection update | 从 delivery + audit 派生 view |
| failure summary update | 不生成 governance decision |
| missing source | 返回 consistency marker / skipped |
| write failure | 不影响 truth |

### 7.15 `RebuildReadProjectionFlow`

#### 7.15.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RebuildReadProjection` |
| 入口函数 | `ProjectionRebuildJobRunner.run(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)` |
| application service | `ProjectionRebuildService.rebuild(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)` |
| 目标 | 受控重建只读投影，不修改 bus truth |

#### 7.15.2 函数级调用图

```text
[ProjectionRebuildJobRunner]
  | call run(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)
  v
[ProjectionRebuildService]
  | call DeliveryRepository.scan_truth(TruthScanCursor cursor, PageLimit limit)
  | call AuditTrailRepository.scan_committed(AuditCursor cursor, PageLimit limit)
  v
[Projection Derivation]
  | call TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)
  | call ReadOnlyOutputPolicy.allows_projection_write(ProjectionWriteIntent intent)
  v
[Projection Repository]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call ReadProjectionRepository.replace_batch(ProjectionBatch batch, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- rebuild 可以 dry run。
- replace batch 不修改 delivery、feedback、DLQ 或 replay truth。
- projection version 必须可审计，避免 silent drift。

#### 7.15.3 关键伪代码

```rust
// [ProjectionRebuildJobRunner.run(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)]
// Job runner 触发受控 projection rebuild。
pub async fn run(job: RebuildReadProjectionJob, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionRebuildResult, JobError> {
    rebuild_service.rebuild(job, actor, meta).await.map_err(JobError::from)
}

// [ProjectionRebuildService.rebuild(RebuildReadProjectionJob job, ActorContext actor, JobMetadata meta)]
// 扫描 truth 并批量替换 projection。
pub async fn rebuild(job: RebuildReadProjectionJob, actor: ActorContext, meta: JobMetadata) -> Result<ProjectionRebuildResult, ApplicationError> {
    // [DeliveryRepository.scan_truth(TruthScanCursor cursor, PageLimit limit)]
    // 扫描 delivery truth。
    let truth_page = delivery_repository.scan_truth(job.rebuild_scope.from_cursor.clone(), job.batch_size).await?;

    // [AuditTrailRepository.scan_committed(AuditCursor cursor, PageLimit limit)]
    // 扫描 audit truth。
    let audit_page = audit_repository.scan_committed(job.rebuild_scope.audit_cursor.clone(), job.batch_size).await?;

    let mut batch = ProjectionBatch::new(job.rebuild_scope.clone());
    for delivery in truth_page.items {
        // [BusAuditEntry::match_delivery(DeliveryId delivery_id)]
        // 找到 delivery 对应 audit。
        let audit = audit_page.match_delivery(delivery.delivery_id().clone())?;

        // [TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit)]
        // 派生 projection。
        let projection = TransportViewProjection::derive(delivery, audit)?;

        // [ReadOnlyOutputPolicy.allows_projection_write(ProjectionWriteIntent intent)]
        // 检查只读输出边界。
        read_only_policy.allows_projection_write(ProjectionWriteIntent::from_transport_view(projection.clone()))?;

        batch.push_transport_view(projection);
    }

    if job.dry_run {
        return Ok(ProjectionRebuildResult::dry_run(batch.summary()));
    }

    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启 projection batch 替换事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::RebuildReadProjection, actor.clone()).await?;

    // [ReadProjectionRepository.replace_batch(ProjectionBatch batch, UnitOfWorkHandle uow)]
    // 批量替换 projection。
    let receipt = read_projection_repository.replace_batch(batch, uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 rebuild audit。
    audit_repository.append(BusAuditEntry::projection_rebuilt(receipt.clone(), actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 projection rebuild。
    unit_of_work.commit(uow).await?;

    Ok(ProjectionRebuildResult::replaced(receipt))
}
```

#### 7.15.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| truth scan | 无写事务 | 读取已提交 truth |
| derivation | 无写事务 | 生成 batch |
| replace batch | `UnitOfWork` | 只替换 projection |
| dry run | 无写事务 | 不写 projection |

#### 7.15.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| source mismatch | rebuild failed | 无写入 |
| projection version conflict | conflict result | 回滚 |
| boundary violation | failed | 回滚 |
| repository failure | retryable job failure | 回滚 |

#### 7.15.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| projection records | batch replaced |
| `BusAuditEntry` | projection rebuilt audit |
| truth object | 无变化 |
| Outbound event | `TransportViewUpdatedEvent` 可选 |

#### 7.15.7 测试切口

| 测试 | 验证内容 |
|---|---|
| dry run | 不写 repository |
| replace batch | projection version 更新 |
| source mismatch | 不产生半写 |
| truth unchanged | delivery / feedback 不被修改 |

### 7.16 `CheckBackendCapabilityFlow`

#### 7.16.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CheckBackendCapability` |
| 入口函数 | `BackendCapabilityJobRunner.run(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)` |
| application service | `BackendCapabilityService.check(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)` |
| 目标 | 检查后端能力，更新 backend health view，不暴露 secret |

#### 7.16.2 函数级调用图

```text
[BackendCapabilityJobRunner]
  | call run(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)
  v
[BackendCapabilityService]
  | call BackendCapabilityRef::from_profile(BackendProfileRef profile_ref, BackendKind backend_kind)
  | call BackendCapabilityPolicy::from_capability(BackendCapabilityRef capability_ref)
  | call TransportBackendPort.check_capability(BackendCapabilityRef capability_ref)
  v
[Projection + Audit]
  | tx UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)
  | call ReadProjectionRepository.upsert_backend_health(BackendHealthView view, UnitOfWorkHandle uow)
  | call AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)
  | tx commit
```

关键说明：

- capability check 只输出能力状态和引用。
- 不保存 secret 明文。
- capability 变化不能直接改写已提交 delivery truth。

#### 7.16.3 关键伪代码

```rust
// [BackendCapabilityJobRunner.run(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)]
// Job runner 触发后端能力检查。
pub async fn run(job: CheckBackendCapabilityJob, actor: ActorContext, meta: JobMetadata) -> Result<BackendCapabilityCheckResult, JobError> {
    backend_capability_service.check(job, actor, meta).await.map_err(JobError::from)
}

// [BackendCapabilityService.check(CheckBackendCapabilityJob job, ActorContext actor, JobMetadata meta)]
// 检查 backend capability 并写只读视图。
pub async fn check(job: CheckBackendCapabilityJob, actor: ActorContext, meta: JobMetadata) -> Result<BackendCapabilityCheckResult, ApplicationError> {
    // [BackendCapabilityRef::from_profile(BackendProfileRef profile_ref, BackendKind backend_kind)]
    // 构造后端能力引用，不解析 secret 明文。
    let capability_ref = BackendCapabilityRef::from_profile(job.backend_profile_ref.clone(), job.backend_kind.clone())?;

    // [BackendCapabilityPolicy::from_capability(BackendCapabilityRef capability_ref)]
    // 构造 capability policy。
    let policy = BackendCapabilityPolicy::from_capability(capability_ref.clone())?;

    // [TransportBackendPort.check_capability(BackendCapabilityRef capability_ref)]
    // 调用后端端口检查能力。
    let report = transport_backend.check_capability(capability_ref.clone()).await?;

    // [BackendCapabilityPolicy.allows_report(BackendCapabilityReport report)]
    // 校验 report 是否可进入只读输出。
    policy.allows_report(report.clone())?;

    // [UnitOfWork.begin(UnitOfWorkPurpose purpose, ActorContext actor)]
    // 开启 backend health projection 写事务。
    let uow = unit_of_work.begin(UnitOfWorkPurpose::CheckBackendCapability, actor.clone()).await?;

    // [BackendHealthView::from_report(BackendCapabilityReport report)]
    // 生成 backend health view，不包含 secret。
    let view = BackendHealthView::from_report(report.clone())?;

    // [ReadProjectionRepository.upsert_backend_health(BackendHealthView view, UnitOfWorkHandle uow)]
    // 写 backend health projection。
    read_projection_repository.upsert_backend_health(view.clone(), uow.clone()).await?;

    // [AuditTrailRepository.append(BusAuditEntry entry, UnitOfWorkHandle uow)]
    // 追加 capability check audit。
    let audit_ref = audit_repository.append(BusAuditEntry::backend_capability_checked(view.clone(), actor.clone()), uow.clone()).await?;

    // [UnitOfWork.commit(UnitOfWorkHandle uow)]
    // 提交 backend health view。
    unit_of_work.commit(uow).await?;

    Ok(BackendCapabilityCheckResult::from_view(view, audit_ref))
}
```

#### 7.16.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| backend check | 事务外 | 不占用写事务等待外部探测 |
| health view / audit write | `UnitOfWork` 内 | projection 和 audit 同一提交 |
| delivery truth | 不写 | capability 变化不改历史 delivery |

#### 7.16.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| secret unavailable | dependency error | 无写入 |
| backend unavailable | degraded view 或 dependency error | 视配置 |
| report boundary violation | failed | 回滚 |
| projection repository error | retryable job failure | 回滚 |

#### 7.16.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| `BackendHealthView` | updated |
| `BusAuditEntry` | backend capability checked audit |
| `DeliveryRecord` | 无变化 |
| Outbound event | `BackendCapabilityChangedEvent` |

#### 7.16.7 测试切口

| 测试 | 验证内容 |
|---|---|
| available backend | 写 available view |
| degraded backend | 写 degraded 或返回 dependency error |
| secret not exposed | view 和 audit 不含 secret |
| no delivery mutation | delivery repository 未被写入 |

### 7.17 `QueryReadOnlyFlow`

#### 7.17.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` |
| 入口函数 | `BusQueryApi.query(QueryRequest query, ActorContext actor)` |
| application service | `ReadOutputService.read(QueryRequest query, ActorContext actor)` |
| 目标 | 返回只读 view / page / consistency marker，不改写真相 |

#### 7.17.2 函数级调用图

```text
[BusQueryApi]
  | call query(QueryRequest query, ActorContext actor)
  v
[ReadOutputService]
  | no write transaction
  | call ReadOnlyOutputPolicy.allows_read(QueryRequest query, ActorContext actor)
  | call ReadProjectionRepository.get_transport_view(ProjectionKey key)
  | call ReadProjectionRepository.get_failure_summary(ProjectionKey key)
  | call AuditTrailRepository.list(AuditFilter filter, PageRequest page)
  v
[Query Result]
  | return view / page with consistency marker
```

关键说明：

- Query 不调用 `UnitOfWork.begin()`。
- projection missing / stale 不自动 rebuild。
- Query 不调用 domain transition method。

#### 7.17.3 关键伪代码

```rust
// [BusQueryApi.query(QueryRequest query, ActorContext actor)]
// Query handler 分派具体查询。
pub async fn query(query: QueryRequest, actor: ActorContext) -> Result<QueryResult, ApiError> {
    read_output_service.read(query, actor).await.map_err(ApiError::from)
}

// [ReadOutputService.read(QueryRequest query, ActorContext actor)]
// 统一只读查询入口。
pub async fn read(query: QueryRequest, actor: ActorContext) -> Result<QueryResult, ApplicationError> {
    // [ReadOnlyOutputPolicy.allows_read(QueryRequest query, ActorContext actor)]
    // 检查只读输出边界。
    read_only_policy.allows_read(query.clone(), actor.clone())?;

    match query {
        QueryRequest::GetTransportView(query) => {
            // [ReadProjectionRepository.get_transport_view(ProjectionKey key)]
            // 查询 transport view。
            let view = read_projection_repository.get_transport_view(query.transport_view_id.into()).await?;
            Ok(QueryResult::transport_view(view, ConsistencyMarker::from_projection(view.as_ref())))
        }
        QueryRequest::GetFailureSummary(query) => {
            // [ReadProjectionRepository.get_failure_summary(ProjectionKey key)]
            // 查询 failure summary。
            let view = read_projection_repository.get_failure_summary(query.failure_summary_id.into()).await?;
            Ok(QueryResult::failure_summary(view, ConsistencyMarker::from_projection(view.as_ref())))
        }
        QueryRequest::GetBusAuditTrail(query) => {
            // [AuditTrailRepository.list(AuditFilter filter, PageRequest page)]
            // 查询 audit trail。
            let page = audit_repository.list(query.filter, query.page).await?;
            Ok(QueryResult::audit_trail(page))
        }
        other => {
            // [ReadOutputService.read_direct_or_projection(QueryRequest query, ActorContext actor)]
            // 读取 publication / delivery / history / backend health 的对应 view。
            read_direct_or_projection(other, actor).await
        }
    }
}
```

#### 7.17.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| policy check | 无写事务 | 只读边界校验 |
| repository read | 无写事务 | 可用只读连接 |
| projection missing | 无写事务 | 返回 not ready / consistency marker |

#### 7.17.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| not found | `404` 或 empty page | 不适用 |
| projection stale | `409` with consistency marker 或 `200` with stale marker | 不适用 |
| repository unavailable | `503` | 不适用 |
| boundary violation | `422` | 不适用 |

#### 7.17.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| truth objects | 无变化 |
| projection | 无变化 |
| audit | 可选 access audit，不改写被查询 audit |
| outbound event | 无 |

#### 7.17.7 测试切口

| 测试 | 验证内容 |
|---|---|
| transport view found | 返回 view 和 committed marker |
| projection missing | 返回 not ready / consistency marker，不触发 rebuild |
| audit pagination | page cursor 正确 |
| no write transaction | Query 不调用 `UnitOfWork.begin()` |

### 7.18 `OutboundEventPublishFlow`

#### 7.18.1 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | 9 个 Outbound Event |
| 入口函数 | `OutboxPublisherService.publish_committed(BusOutboundEvent event, TraceContextRef trace)` |
| application port | `OutboxPublisherPort.publish(BusOutboundEvent event, TraceContextRef trace)` |
| 目标 | 发布已提交 bus fact 或 projection event，不回滚 truth |

#### 7.18.2 函数级调用图

```text
[Committed Bus Fact / Projection Update]
  | call OutboxPublisherService.collect(BusAuditEntry audit, EventKind event_kind)
  v
[PayloadBoundaryGuard]
  | call PayloadBoundaryGuard.allows_reference(PayloadRef payload_ref)
  v
[OutboxPublisherPort]
  | call publish(BusOutboundEvent event, TraceContextRef trace)
  v
[Publish Receipt]
  | record success / retryable failure / schema rejection
```

关键说明：

- outbound event 只能来自 committed fact。
- publisher failure 不回滚 truth。
- event payload 不包含 payload body、secret、后端私有响应正文或治理决策正文。

#### 7.18.3 关键伪代码

```rust
// [OutboxPublisherService.publish_committed(BusOutboundEvent event, TraceContextRef trace)]
// 发布已提交 fact 的 outbound event。
pub async fn publish_committed(event: BusOutboundEvent, trace: TraceContextRef) -> Result<PublishReceipt, PublisherError> {
    // [PayloadBoundaryGuard.allows_reference(PayloadRef payload_ref)]
    // 校验 outbound event 不携带正文。
    payload_guard.allows_reference(event.payload_ref().clone())?;

    // [BusOutboundEvent.validate_schema()]
    // 校验 event schema version 和禁止字段。
    event.validate_schema()?;

    // [OutboxPublisherPort.publish(BusOutboundEvent event, TraceContextRef trace)]
    // 调用发布端口。
    match outbox_publisher.publish(event.clone(), trace.clone()).await {
        Ok(receipt) => Ok(receipt),
        Err(err) if err.is_retryable() => {
            // [OutboxPublisherService.record_retryable_failure(BusOutboundEvent event, PublisherPortError error)]
            // 记录可重试发布失败 evidence，具体存储方式由 Step 11/15 细化。
            record_retryable_failure(event, err).await?;
            Err(PublisherError::retryable())
        }
        Err(err) => {
            // [OutboxPublisherService.record_rejected_failure(BusOutboundEvent event, PublisherPortError error)]
            // 记录不可重试 schema / boundary 错误，具体存储方式由 Step 11/15 细化。
            record_rejected_failure(event, err).await?;
            Err(PublisherError::rejected())
        }
    }
}
```

#### 7.18.4 事务边界

| 阶段 | 事务 | 说明 |
|---|---|---|
| truth commit | 已完成 | publisher 不参与原 truth 事务 |
| schema / boundary check | 无写事务 | 失败不改 truth |
| publish | port 调用 | 失败记录 evidence |
| retry evidence | 可独立保存 | 不影响原 truth |

#### 7.18.5 错误映射

| 错误 | 处理 | 回滚 |
|---|---|---|
| schema violation | rejected publish evidence | 不回滚 truth |
| boundary violation | rejected publish evidence | 不回滚 truth |
| publisher unavailable | retryable evidence | 不回滚 truth |
| duplicate publish | idempotent success | 不回滚 truth |

#### 7.18.6 状态与事件副作用

| 对象 | 状态变化 / 副作用 |
|---|---|
| truth object | 无变化 |
| publish evidence | success / retryable / rejected |
| external event bus | 发布 bus outbound event |
| audit | 可追加 publish receipt audit |

#### 7.18.7 测试切口

| 测试 | 验证内容 |
|---|---|
| publish success | 调用 publisher port 并返回 receipt |
| retryable failure | 记录 retry evidence，不回滚 truth |
| schema violation | 不调用 publisher port |
| payload body rejected | boundary guard 生效 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §8 按以下方式回填：

```md
## 8. 逐接口函数级处理流

### 8.1 处理流总表

从 `design-calibration/03_ddd_step_09_function_flows.md` §7.1 摘录。

### 8.2 通用函数级规则

从 `design-calibration/03_ddd_step_09_function_flows.md` §7.2 摘录。

### 8.3~8.18 各处理流

从 `design-calibration/03_ddd_step_09_function_flows.md` §7.3~§7.18 摘录。
```

说明：

- 正式文档如果完全引用本文件已有章节，不重复粘贴回填草稿本身。
- Step 10 需要从 §7.3~§7.18 提取状态变化，形成正式状态机与转换矩阵。
- Step 11 需要从 §7.3~§7.18 提取事务边界，形成持久化、事务与一致性契约。
- Step 12 需要从 §7.3~§7.18 提取错误映射，形成错误模型与恢复口径。
- Step 16 需要从 §7.3~§7.18 提取测试切口，形成测试切口汇总。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| `RunDeliveryProgression` 是否在事务内调用 `TransportBackendPort.dispatch()` | A. 事务内调用；B. 先创建 attempt 提交，再由后端回调完成；C. 完全异步 outbox dispatch | 推荐 A 作为 P0 | P0 in-memory default path 简单可测；Step 11 可继续细化外部 backend 一致性 |
| `RunRetryCycle` exhausted 是否自动进入 DLQ | A. 自动进入 DLQ；B. 只标记 exhausted，由 `MoveDeliveryToDeadLetter` 控制；C. 直接 replay preparation | 推荐 B | DLQ 是独立受控恢复动作，避免 retry job 越权 |
| `ConsumeBackendDeliverySignal` unknown delivery 是否写 audit | A. 写 dead signal audit；B. 直接 ignore；C. 创建悬空记录 | 推荐 A | 便于排查后端信号漂移；具体错误模型 Step 12 细化 |
| Query 是否记录 access audit | A. 所有 Query 记录；B. 只敏感查询记录；C. 不记录 | 推荐 B | 平衡审计价值和噪声；Step 15 细化可观测性和审计埋点 |
| Outbound publish failure evidence 存储在哪里 | A. 独立 repository；B. 复用 audit / publisher adapter evidence；C. 只打日志 | 推荐 B | 避免 Step 9 新增 port，Step 11/15 再明确持久化与观测落点 |

---

## 10. 进入下一步条件

```text
每个关键 Command / Query / Event / Job 已具备可编码的函数级处理流。
每个处理流已标注入口函数、ASCII 调用图、关键伪代码、事务边界、错误映射、状态与事件副作用和测试切口。
处理流能够回指 Step 6 的对象、Step 7 的 port 和 Step 8 的协议契约。
可以进入 Step 10,定义状态机与转换矩阵。
```
