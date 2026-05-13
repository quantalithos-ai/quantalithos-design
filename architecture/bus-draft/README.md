# bus-draft — Event Bus 接口草案

> **文档定位**:Quantalithos A 方案段 3 第二件产出 —— `quantalithos-bus` 仓的接口抽象 + 多后端适配 + 订阅过滤 + 可靠投递 + Outbox 协议的**设计态草案**。  
>
> **最终归属**:本草案在段 3 末迁入 `quantalithos-bus` 独立仓。
>
> **上游依据**:
> - `product/六域模型.md` §2.2 跨域通信规则(CloudEvents + W3C TC + 最终一致 + 幂等)
> - `architecture/仓库拆分方案.md` §3.2 `quantalithos-bus`
> - `architecture/标准对齐全景图.md` §一 bus 仓对齐
> - `architecture/proto-draft/common/v1/events.proto`(CloudEvent 包络)
> - `architecture/proto-draft/common/v1/ids.proto`(TraceContext)
> - 6 份 domain README 的 §四 "事件 schema" 章节
> - `architecture/架构设计.md` §4.4 Outbox 模式
> - Research 结论:CloudEvents 1.0 / W3C Trace Context / 错误级联防御
>
> **下游承接**:
> - 6 个 L1 域仓(作为事件发布者 + 订阅者)
> - L2 Member 运行层(Member Process B2 Subscriber / B3 Publisher)
> - L3 method-library / capability-hub(Policy / MCP 事件)
> - L4 observability(审计全量订阅)
> - L4 archive(归档事件订阅)
> - L5 UI 层(Chat / Console 的 SSE / WS 转推层)
> - L6 Bridges / Marketplace
> - SDK 三语言 client

---

## 一、使命与定位

### 1.1 使命

**承载六域平权的事件编织**。在 Quantalithos 里,跨域不允许直接 RPC(`六域模型.md` §2.2 规则 1),所有跨域协作走事件。bus 仓是**事件的唯一主干**。

具体职责:
- 定义事件发布 / 订阅 / 确认 / 重试 / DLQ 的**抽象接口**
- 提供**多后端适配**(NATS JetStream / Redis Streams / Kafka / In-memory)
- 强制 **CloudEvents 1.0 包络** + **W3C Trace Context 贯穿**
- 提供 **Outbox 模式** 的客户端支持(业务事务 + 事件发布一致性)
- 提供 **DLQ + 重试策略** 的标准实现
- 提供 **订阅过滤器**(按 type / subject / project / severity 等)
- 提供 **幂等去重** 的客户端辅助(event_id LRU)
- 不做业务语义 —— 不理解 `identity.member.hired` 的含义

### 1.2 边界(不做的事)

- **不做业务逻辑** —— 事件内容由发布方定义,订阅方解析
- **不做事件 schema 校验** —— 那是 `core` 仓的责任(生成三语言 binding 时做 compile-time check)
- **不做审计持久化** —— 那是 `observability` 仓(bus 发 tap 给 observability)
- **不做 UI 推送** —— 那是 `conversation` 仓的 StreamEvents RPC(内部消费 bus 再推 AG-UI)
- **不自产事件** —— bus 不发任何业务事件;bus 自身的运维事件走 observability 的度量而非 bus 本身

### 1.3 与其他仓的协作全景

```
┌───────────────────────────────────────────────────────────────────┐
│  bus 仓(本文)                                                     │
│  EventBus trait + 多后端适配 + Outbox client + 订阅过滤            │
└──┬─────────────┬────────────┬────────────┬───────────────┬───────┘
   │ publish     │ subscribe  │ dlq        │ tap           │ binding
   ▼             ▼            ▼            ▼               ▼
 L1 六域服务    L1/L2/L3/    ops/console  observability   SDK 三语言
 (发布业务     L4/L5/L6     (消费 DLQ    (全量订阅 →     (Python/Rust/TS)
  事件 + 订阅   (订阅)      展示)        审计链)
  相关事件)
```

---

## 二、核心接口(语言无关抽象)

下面用 Rust 风格定义(后续翻译为 proto + 三语言 binding 时保持语义一致)。

### 2.1 `EventBus` trait

```rust
#[async_trait]
pub trait EventBus: Send + Sync {
    /// 发布单条事件。返回 event_id(若 CloudEvent 未指定则 bus 生成)。
    /// 语义:at-least-once(允许订阅方收到重复,要幂等处理)。
    async fn publish(&self, event: CloudEvent) -> Result<EventId, BusError>;

    /// 批量发布(同一后端事务内尽可能原子;不保证跨 partition 原子性)。
    async fn publish_batch(&self, events: Vec<CloudEvent>) -> Result<Vec<EventId>, BusError>;

    /// 订阅事件流。返回 Subscription 句柄,可 await 拉取 / 取消。
    /// filter:按 type_pattern / subject / project_id / severity 过滤。
    /// consumer_group:同组内负载均衡(exclusive per-event);跨组广播。
    async fn subscribe(&self, req: SubscribeRequest) -> Result<Subscription, BusError>;

    /// 请求重投 DLQ 中的事件(运维操作,需权限)。
    async fn retry_dlq(&self, filter: DlqFilter) -> Result<DlqRetryReport, BusError>;

    /// 后端健康检查。
    async fn health(&self) -> Result<HealthReport, BusError>;
}
```

### 2.2 订阅请求

```rust
pub struct SubscribeRequest {
    /// 消费者分组:同组竞争消费(点对点),跨组广播。
    pub consumer_group: ConsumerGroup,

    /// 订阅过滤器(服务端下推,不把全量事件都拉到客户端再过滤)。
    pub filter: EventFilter,

    /// 起始位置:latest / from-offset / from-event-id / from-timestamp。
    pub start_from: StartPosition,

    /// 消费语义:at-least-once(默认)/ effectively-once(需后端支持)。
    pub delivery_semantics: DeliverySemantics,

    /// 重试策略(未 ack 的事件,多久重投,最多几次)。
    pub retry_policy: SubscribeRetryPolicy,

    /// 超时未 ack 进 DLQ 的等待时间。
    pub ack_timeout: Duration,
}

pub struct EventFilter {
    pub type_patterns: Vec<String>,    // 如 ["identity.member.*", "work.project.*"]
    pub subjects: Vec<String>,          // 精确匹配
    pub project_ids: Vec<String>,       // 从 data 中提取过滤(发布时由 bus 索引)
    pub min_severity: Option<Severity>,
    pub tenant: Option<TenantId>,
    pub custom_predicate: Option<String>, // 高级:CEL / Rego 表达式(Q5 待决)
}

pub enum StartPosition {
    Latest,                              // 从订阅时刻开始
    FromOffset(String),                  // 后端原生 offset(NATS stream seq / Kafka offset)
    FromEventId(EventId),                // 断点续传(AG-UI last_event_id 场景)
    FromTimestamp(Timestamp),            // 按时间回溯
    FromStart,                           // 从流起点(审计回放场景)
}

pub enum DeliverySemantics {
    AtLeastOnce,                         // 默认。订阅方必须幂等
    EffectivelyOnce,                     // 后端需支持 exactly-once 或去重窗口
}
```

### 2.3 订阅句柄

```rust
pub struct Subscription {
    subscription_id: String,
    consumer_group: ConsumerGroup,
    // ... 后端特定状态
}

impl Subscription {
    /// 拉取下一条事件(或超时返回 None)。
    pub async fn next(&mut self) -> Option<Delivery>;

    /// 取消订阅(释放后端资源)。
    pub async fn unsubscribe(self) -> Result<(), BusError>;

    /// 查询 lag / 消费进度。
    pub async fn lag(&self) -> Result<ConsumerLag, BusError>;
}

pub struct Delivery {
    pub event: CloudEvent,
    pub meta: DeliveryMeta,
    pub offset: String,              // 后端原生 offset,用于断点续传
}

impl Delivery {
    /// 成功处理,后端可以推进 offset。
    pub async fn ack(self) -> Result<(), BusError>;

    /// 处理失败,进入 retry 或 DLQ(按 retry_policy)。
    pub async fn nack(self, reason: String) -> Result<(), BusError>;

    /// 请求延迟重投(退避场景)。
    pub async fn retry_later(self, after: Duration) -> Result<(), BusError>;
}
```

### 2.4 Outbox client

对齐 `架构设计.md` §4.4 Outbox 模式。业务服务**在单事务内写业务状态 + 写 outbox 表**,由 bus client 的 outbox publisher worker 异步消费 outbox 表发布到 bus。

```rust
#[async_trait]
pub trait OutboxPublisher: Send + Sync {
    /// 启动 outbox 发布 worker(后台轮询 outbox 表,发 bus,标 published)。
    /// 服务启动时调用一次。
    async fn start(&self, config: OutboxConfig) -> Result<OutboxHandle, BusError>;
}

pub struct OutboxConfig {
    pub table_name: String,              // 默认 <domain>_events_outbox
    pub poll_interval: Duration,         // 默认 200ms
    pub batch_size: usize,                // 默认 100
    pub max_retries: u32,                 // 单条事件的最大发布重试
    pub backoff: BackoffPolicy,
}

pub struct OutboxEntry {
    pub event_id: EventId,
    pub event_type: String,
    pub subject: String,
    pub payload: Vec<u8>,                 // 预序列化的 CloudEvent
    pub trace_context: TraceContext,
    pub created_at: Timestamp,
    pub published_at: Option<Timestamp>,
    pub published_attempts: u32,
    pub last_error: Option<String>,
}
```

**业务侧 SDK helper**(伪码):

```python
# 业务服务单事务示例(Python SDK)
async with db.transaction() as tx:
    await tx.update_aggregate(...)
    await bus_outbox.enqueue(
        event_type="identity.member.hired",
        subject=str(member_id),
        data=MemberHiredEventData(...),
        actor=actor_context.actor,
        trace=actor_context.trace,
    )
    # 事务提交后,Outbox worker 异步扫表发 bus
```

### 2.5 DLQ(Dead Letter Queue)

```rust
pub struct DlqFilter {
    pub consumer_group: Option<ConsumerGroup>,
    pub type_patterns: Vec<String>,
    pub time_range: Option<DateRange>,
    pub max_count: Option<usize>,
}

pub struct DlqRetryReport {
    pub retried_count: usize,
    pub skipped_count: usize,
    pub retry_batch_id: String,
}

pub struct DlqEntry {
    pub original_event: CloudEvent,
    pub consumer_group: ConsumerGroup,
    pub failure_reason: String,
    pub first_failed_at: Timestamp,
    pub last_failed_at: Timestamp,
    pub failure_count: u32,
    pub last_trace_context: TraceContext,
}
```

### 2.6 错误类型

```rust
pub enum BusError {
    // 连接 / 基础设施
    BackendUnavailable { backend: BackendId, inner: String },
    ConnectionTimeout,
    AuthenticationFailed,

    // 协议
    InvalidCloudEvent { field: String, reason: String },
    UnsupportedFeature { feature: String, backend: BackendId },

    // 语义
    SubscriptionExists { subscription_id: String },
    DuplicateEventId { event_id: EventId },  // effectively-once 模式下

    // 运行时
    BackpressureRejected,  // 发布被限流拒绝
    DlqFull,
    Internal { message: String },
}
```

---

## 三、可靠性语义

### 3.1 发布语义(默认 at-least-once)

| 场景 | 行为 |
|---|---|
| 发布成功 + bus 持久化 | 订阅方必将收到(可能重复) |
| 发布成功 + bus 未持久化就崩 | Outbox 模式保证业务事务回滚;事件不丢 |
| 发布前业务事务回滚 | 事件未进 outbox,不会发出 |
| bus 整体不可用 | Outbox 积压 → 告警 → 恢复后追投 |

### 3.2 订阅语义

默认 **at-least-once** + 订阅方幂等:
- 订阅方用 `event_id` LRU 去重(推荐 10000 条窗口)
- 不 ack 的事件 ack_timeout 后重投
- 重投 max_retries 次后进 DLQ

可选 **effectively-once**(需后端支持,如 NATS JetStream 的去重窗口):
- 发布端在指定 dedup 窗口内对同 event_id 去重
- 订阅端去重交给后端
- 吞吐降低,不作默认

### 3.3 顺序保证

**分区内有序,跨分区无序**:
- 按 `subject`(聚合根 ID)分区:**同一聚合根的事件订阅端严格有序**
- 跨聚合根 / 跨域的事件**不保证顺序**
- 订阅方若依赖跨分区顺序,需要自己基于 `time` 字段重排

**对齐 BPMN / Temporal 的执行模型**:Activity 级事件按 `instance_id` 分区;Project 级事件按 `project_id` 分区。

### 3.4 幂等与去重

- **发布幂等**:Outbox 表对 event_id 唯一;重复 enqueue 无副作用
- **订阅幂等**:订阅方用 LRU / DB 去重表记录已处理 event_id
- **重投与 DLQ**:失败事件按指数退避重试,超限进 DLQ

### 3.5 Trace 传播

- 每条 CloudEvent **必带** `traceparent`(INV)
- 发布方从当前 span 提取 TraceContext 注入
- 订阅方处理时基于 `traceparent` 创建子 span
- observability 仓消费全量事件重建完整 trace tree

---

## 四、多后端适配

### 4.1 后端对比

| 后端 | 定位 | 优势 | 限制 |
|---|---|---|---|
| **NATS JetStream** | 默认(开发 + 中小生产) | 轻量 / 低延迟 / 内置去重 / 原生 KV | 单集群规模上限约 10 亿消息 |
| **Redis Streams** | 轻量部署 / 边缘 | 部署简单 / 低内存场景友好 | 保留政策配置复杂;多消费组较弱 |
| **Apache Kafka** | 企业 / 大规模 | 成熟生态 / 水平扩展 / 大吞吐 | 运维重 / 延迟高于 NATS |
| **In-memory** | 单元测试 / 本地开发 | 零依赖 / 确定性 | 进程内无持久;只测试用 |

### 4.2 后端抽象层设计

```rust
pub trait BusBackend: Send + Sync {
    async fn publish(&self, event: &CloudEvent) -> Result<String, BackendError>;
    async fn subscribe(&self, req: &SubscribeRequest) -> Result<BackendSubscription, BackendError>;
    async fn ack(&self, sub: &BackendSubscription, offset: &str) -> Result<(), BackendError>;
    async fn nack(&self, sub: &BackendSubscription, offset: &str, reason: &str) -> Result<(), BackendError>;
    // ... 生命周期 / DLQ / 健康检查
}

pub struct NatsJetstreamBackend { /* ... */ }
pub struct RedisStreamsBackend { /* ... */ }
pub struct KafkaBackend { /* ... */ }
pub struct InMemoryBackend { /* ... */ }
```

`EventBus` trait 的默认实现 `DefaultEventBus<B: BusBackend>` 封装后端,加共享逻辑(幂等去重 / TraceContext 注入 / DLQ 协议)。

### 4.3 NATS JetStream 映射(默认)

**流与 subject 设计**:

```
Stream QUANTALITHOS.EVENTS
  │
  subjects:
  ├── identity.member.*
  ├── identity.role.*
  ├── conversation.*
  ├── work.project.*
  ├── work.workitem.*
  ├── work.iteration.*
  ├── work.backlog.*
  ├── process.template.*
  ├── process.profile.*
  ├── process.instance.*
  ├── process.activity.*
  ├── process.stage.*
  ├── governance.gate.*
  ├── governance.policy.*
  ├── governance.control.*
  ├── governance.aiia.*
  ├── governance.soa.*
  ├── governance.nonconformity.*
  ├── artifact.*
  ├── baseline.*
  └── member.*                         (L2 Member 运行层事件)

Stream QUANTALITHOS.AUDIT
  │ 只写 observability(critical / audit)事件,长期保留
  subjects:
  ├── *.audit.*
  └── *.*.content_tampered
```

**消费组映射**:
- NATS Consumer 对应 `consumer_group`
- `durable` 名称:`<service>.<consumer_group>`(如 `conversation.gate-subscriber`)
- `AckPolicy: Explicit` + 订阅方手动 ack

**保留策略**:
- `QUANTALITHOS.EVENTS` 保留 90 天(可配置)
- `QUANTALITHOS.AUDIT` 保留 7 年(合规基线)或按 `governance Policy` 配置

### 4.4 Redis Streams 映射(轻量)

- 每个 `<domain>.events` 一条 stream
- `XADD` 发布 / `XREADGROUP` 订阅
- 保留用 `MAXLEN` 近似 trimming
- DLQ 用独立 stream `<domain>.dlq`

### 4.5 Kafka 映射(企业)

- Topic per domain:`quantalithos.identity` / `quantalithos.work` / ...
- Partition key 用 `subject`(聚合根 ID)
- 订阅用 consumer group,offset 提交机制
- DLQ 用专门 topic `quantalithos.<domain>.dlq`

### 4.6 In-memory 映射(测试)

- 线程安全的 queue + 订阅 callback
- 不持久化,进程退出事件丢失
- 不实现 effectively-once(默认不支持 dedup)
- 仅用于单元 / 集成测试

### 4.7 后端选型决策矩阵

| 场景 | 推荐后端 | 原因 |
|---|---|---|
| 开发 / 本地 | NATS JetStream embedded or In-memory | 零依赖或轻量 |
| 小规模 SaaS | NATS JetStream | 默认 |
| 大规模 SaaS | Kafka | 水平扩展 / 生态 |
| 企业自托管 | NATS JetStream or Kafka | 看运维能力 |
| 边缘 / 资源受限 | Redis Streams | 部署简单 |
| 单元测试 | In-memory | 确定性 |

---
## 五、Outbox 模式细节

### 5.1 业务事务 + Outbox 表

每个 L1 服务(identity / conversation / work / process / governance / artifact)拥有自己的 Outbox 表:

```
CREATE TABLE <domain>_events_outbox (
    event_id              UUID PRIMARY KEY,        -- ULID 字符串解析(或直接 varchar(26))
    event_type            varchar(128) NOT NULL,
    subject               varchar(128) NOT NULL,
    payload               bytea NOT NULL,           -- 预序列化的 CloudEvent(proto)
    trace_parent          varchar(64) NOT NULL,
    trace_state           text,
    actor_id              varchar(128) NOT NULL,
    actor_kind            smallint NOT NULL,
    tenant_id             varchar(64),
    severity              smallint NOT NULL DEFAULT 1,
    created_at            timestamptz NOT NULL DEFAULT now(),
    published_at          timestamptz,
    published_attempts    int NOT NULL DEFAULT 0,
    last_error            text,
    partition_key         varchar(128)              -- 默认 subject,影响 bus 分区
);

CREATE INDEX idx_outbox_unpublished
    ON <domain>_events_outbox (created_at)
    WHERE published_at IS NULL;
```

### 5.2 Outbox worker 轮询逻辑

```python
# 伪码
async def outbox_worker(db, bus, config: OutboxConfig):
    while not shutdown:
        batch = await db.fetch_unpublished(limit=config.batch_size)
        if not batch:
            await sleep(config.poll_interval)
            continue
        for entry in batch:
            try:
                event = deserialize_cloud_event(entry.payload)
                await bus.publish(event)
                await db.mark_published(entry.event_id)
            except BackpressureRejected:
                await sleep(backoff(entry.published_attempts))
                await db.increment_attempts(entry.event_id)
            except Exception as e:
                if entry.published_attempts >= config.max_retries:
                    await db.move_to_poison(entry.event_id, str(e))
                else:
                    await db.increment_attempts(entry.event_id, str(e))
```

### 5.3 Outbox worker 部署形态

**选项 A(推荐默认)**:每个 L1 服务进程内嵌 Outbox worker,与业务 server 同部署单元

- 优点:零额外运维;worker 崩了服务就崩了,不会孤儿
- 缺点:水平扩展时多实例都跑 worker,需要 PG advisory lock 做 leader 选举

**选项 B**:独立 outbox-publisher sidecar

- 优点:业务服务零负担;可统一做流控
- 缺点:多一个部署单元

**选项 C**:Debezium 类的 CDC

- 优点:不需要业务 worker;天然补偿历史数据
- 缺点:运维复杂;PG logical replication 配置门槛

**决策**:选 A 起步(见 §十 Q1),未来规模爆发时可切 C。

### 5.4 Outbox 积压监控

- 每分钟统计 `SELECT count(*) WHERE published_at IS NULL AND created_at < now() - interval '1 minute'`
- 超过阈值(默认 1000 条)发 observability 告警
- 积压超过 10000 条:bus client `publish()` 方法返回 `BackpressureRejected`(业务服务自行决定是否重试)

### 5.5 Poison 处理

- 连续 `max_retries` 失败的 Outbox 条目进 `<domain>_events_poison` 表
- 不自动重试;人工介入(运维通过 Console 或 CLI `bus-ops retry-poison`)

---

## 六、订阅契约(跨域一致)

> **事件清单的单一真相源**:`architecture/bus-draft/event-catalog.md`(2026-05-10 首版,147 事件)。
>
> 本节只承载**跨域订阅的机制规则**(幂等 / Ack / Trace / 消费者分组 / 复放 / Tap),具体的"哪个事件被哪些域订阅、severity 是什么、保留期多久"全部查 event-catalog.md。
>
> 任何域新增 / 修改事件必须**先更 event-catalog.md,再同步各域 README §4**,详见 event-catalog.md §七 维护纪律。

### 6.1 通用订阅规则

所有订阅方必须遵守(写入 `standards/子项目遵循规范清单.md` 的 R2-R3 的延伸):

1. **幂等处理**:基于 `event.id` 做 LRU 去重(默认 10000 窗口);业务级幂等 key 规则见 event-catalog.md §三
2. **Ack only on success**:业务副作用完成后才 ack
3. **nack with reason**:失败时带人类可读原因,进 DLQ 时便于诊断
4. **Trace 传播**:处理事件时以 `event.traceparent` 为父 span 创建子 span
5. **错误级联防御**(Research 结论):不盲信上游事件内容,关键字段做业务合理性校验

### 6.2 订阅方的典型模板

```python
# 伪码(Python SDK)
sub = await bus.subscribe(
    consumer_group="governance.gate-decided-watcher",
    filter=EventFilter(
        type_patterns=["governance.gate.decided"],
        project_ids=[project_id] if project_id else [],
    ),
    start_from=StartPosition.Latest,
)

async for delivery in sub:
    event_id = delivery.event.id
    if dedup_lru.contains(event_id):
        await delivery.ack()
        continue
    try:
        with tracer.start_as_current_span("handle.gate.decided", links=[delivery.event.traceparent]):
            await handle_gate_decided(delivery.event)
            dedup_lru.add(event_id)
            await delivery.ack()
    except Exception as e:
        await delivery.nack(reason=str(e))
```

### 6.3 消费者分组命名约定

`<subscriber_service>.<purpose>` 例如:

- `conversation.gate-subscriber` — conversation 订阅 gate 事件发 gate Turn
- `work.gate-decided-watcher` — work 订阅 gate 事件驱动 WorkItem 状态
- `member-service.identity-sync` — member-service 订阅 identity 事件同步本地缓存
- `observability.full-audit` — observability 订阅全量(跨所有 type)
- `archive.project-dissolved` — archive 订阅 project dissolved 准备归档

### 6.4 保留与复放

- 事件流默认保留 90 天(可配置)
- 审计流保留 7 年或按 `governance Policy` 配置
- **复放场景**:
  - Debug:从某 event_id 回溯
  - 新订阅方冷启动:`StartPosition::FromTimestamp` 回溯 N 天
  - Disaster recovery:从 snapshot + 复放事件

### 6.5 Tap(观测订阅)

observability 仓对 bus 有特殊"全量 tap"订阅:
- Consumer group:`observability.tap-all`
- Filter:无(接收所有流的所有事件)
- Ack 语义:at-least-once
- 不进业务 DLQ(observability 自己有审计链保护)
- 特殊权限(仅 observability 服务身份能创建此消费组)

---

## 七、安全与鉴权

### 7.1 发布 / 订阅权限模型

**发布端**:
- 每个服务有 `publish_scope:<domain>`(如 `publish_scope:identity` 仅允许发 `identity.*` 事件)
- `publish_scope:*` 是运维级权限,仅特殊服务(如迁移工具)拥有
- 发布时 bus 校验 CloudEvent.source 与调用方身份一致

**订阅端**:
- `subscribe_scope:<pattern>`(如 `subscribe_scope:governance.*` 允许订阅 governance 所有)
- 多租户场景 `subscribe_scope:tenant:<tenant_id>:<pattern>`
- 跨租户订阅需要 `subscribe_scope:tenant:*:<pattern>` 特殊权限

### 7.2 mTLS

内部服务间全程 mTLS。bus client 启动时加载服务身份证书:

```
# Rust 示例
let client = BusClient::builder()
    .backend(NatsBackend::default())
    .client_cert("/etc/quantalithos/certs/<service>.crt")
    .client_key("/etc/quantalithos/certs/<service>.key")
    .ca_cert("/etc/quantalithos/certs/ca.crt")
    .build()?;
```

### 7.3 Payload 加密

- **默认**:TLS 保护传输层,payload 不单独加密
- **敏感 payload**(含 PII 字段):payload 内 `data` 部分可选 envelope encryption(KMS key wrapping)
- envelope encryption 触发条件:`CloudEvent.extensions["encrypted"] = true`,订阅方必须能解密否则 nack

### 7.4 Audit 不可篡改

bus 自身不保证 audit 不变性(那是 observability 的责任)。但 bus 保证:
- Outbox 表写入后**不允许改 payload**(app 层 INV,DB 触发器强制)
- event.id 一旦生成不可修改
- 订阅方无法伪造 publisher 身份(CloudEvent.source 与连接身份校验)

### 7.5 Prompt Injection 不在 bus 层处理

事件 data 内容的 Prompt Injection 检测**由订阅方的 Attention 子模块处理**(`ai-member设计.md` §3.6 B5)。bus 不做内容过滤,避免性能开销和误杀。

---

## 八、可观测性

### 8.1 bus 自身的指标

bus 发 OTel Metrics 给 observability:

| 指标 | 维度 | 用途 |
|---|---|---|
| `bus.publish.count` | backend, domain, event_type | 发布量 |
| `bus.publish.duration_ms` | backend | 发布延迟(P50/P95/P99) |
| `bus.subscribe.delivery.count` | consumer_group, event_type | 投递量 |
| `bus.subscribe.lag_seconds` | consumer_group | 消费滞后(关键健康指标) |
| `bus.outbox.pending.count` | domain | Outbox 积压深度 |
| `bus.outbox.publish.duration_ms` | domain | Outbox → bus 延迟 |
| `bus.dlq.count` | consumer_group | DLQ 进入量 |
| `bus.backend.up` | backend | 后端健康 |

### 8.2 bus 自身的日志

- 事件发布 / 订阅 / ack / nack 走 structured logging
- 敏感字段(payload)不入日志(只记 event_id / type / subject / actor)

### 8.3 Trace 完整性

- 每个 publish 创建一个 span `bus.publish`
- 每个 delivery 创建一个 span `bus.subscribe.deliver`(作为订阅方处理的父 span)
- observability 的全量订阅基于 traceparent 重建完整 trace tree

### 8.4 告警

- Outbox 积压 > 阈值(默认 1000 条且超过 60 秒未清空)→ major
- 消费组 lag > 阈值(默认 1000 条或 60 秒)→ major
- DLQ 新增速率异常(每分钟 > 10 条)→ major
- 后端不可用 → critical
- 哈希链断裂(audit 流)→ critical(由 observability 发,bus 本身不做)

---

## 九、性能目标

### 9.1 单实例指标(参考 NATS JetStream)

| 指标 | 目标 |
|---|---|
| Publish P95 | < 20ms |
| End-to-end(publish → subscribe)P95 | < 100ms |
| Throughput per backend(NATS) | ≥ 10k msg/s per stream |
| Outbox 同步延迟 P95 | < 5s |
| DLQ 事件保留 | 30 天 |

### 9.2 容量假设(10w 活跃用户规模)

- 峰值发布:3000 msg/s(所有域合计)
- 峰值订阅:12000 msg/s(4 倍广播系数:observability + conversation + governance + work)
- 每日事件量:~2 亿

### 9.3 压测基线

段 3 末进行:

- NATS JetStream 单节点:10k msg/s 持续 1 小时
- Outbox worker 对 PG 的压力:5000 row/s insert + 批量 update
- 订阅方 lag 不超过 5 秒(峰值)

---

## 十、开放问题

### Q1. Outbox worker 部署形态

**背景**:§5.3 列了三种。

**候选**:
- **A** 内嵌 worker + PG advisory lock(当前倾向)
- **B** sidecar
- **C** CDC / Debezium

**推进**:段 3 末原型阶段决策;走独立 ADR。

### Q2. 消息持久化保留期

**背景**:业务流 90 天 / 审计流 7 年(默认)。是否允许更长 / 更短?

**候选**:
- A 全局默认固定(90d / 7y)
- B governance Policy 可按 type 细化
- C tenant 级可覆盖(合规要求高的客户更长)

**倾向**:B + C

**推进**:多租户功能阶段。

### Q3. Effectively-once 在哪些场景启用

**背景**:默认 at-least-once。Effectively-once 有性能成本。

**候选**:
- A 全流默认 at-least-once(当前)
- B 审计流强制 effectively-once
- C governance Policy 决定(按事件类型)

**倾向**:A 起步;若发现重复事件导致审计困扰(observability 反馈)考虑 B

**推进**:实际运行后数据驱动。

### Q4. 跨租户隔离实现

**背景**:SaaS 多租户场景,租户间严格隔离。

**候选**:
- A 共享 stream + 按 tenant_id 过滤(简单,但运维风险)
- B 每 tenant 独立 stream(干净,运维重)
- C 混合:大租户独立 stream,小租户共享

**倾向**:A 起步,企业客户触发 B/C

**推进**:多租户功能阶段。

### Q5. EventFilter 的 custom_predicate 用什么 DSL

**背景**:§2.2 EventFilter.custom_predicate 允许高级过滤。

**候选**:
- A 不支持 custom_predicate(去字段)
- B CEL(Google Common Expression Language)
- C Rego(与 governance Policy DSL 可能一致,见 governance Q2)

**倾向**:A 起步,Q5 若与 governance Q2 一致,取相同 DSL

**推进**:governance Policy DSL 决策后。

### Q6. 事件压缩与批次发布

**背景**:小事件高频,网络带宽浪费。

**候选**:
- A 单条发布(简单)
- B 客户端批量发布(batch API 已暴露)
- C 后端级压缩(NATS 已支持)

**倾向**:B + C

**推进**:压测后按需。

### Q7. 失败事件的通知与处置 UI

**背景**:DLQ 需要人工检查,在 Console 里展示?

**候选**:
- A Console 有 DLQ 面板
- B 只有 CLI 工具
- C 两者兼有

**倾向**:C(Console 负责日常,CLI 负责运维紧急)

**推进**:Console 设计阶段。

---

## 十一、与下游文档的关系

### 11.1 本草案与 `quantalithos-bus` 仓 README(段 3 末)

```
architecture/bus-draft/README.md(本文)    ↔    quantalithos-bus 仓
─────────────────────────────────                ──────────────────
§二 核心接口                                     src/api/        Rust trait + proto 生成
§三 可靠性语义                                   src/semantics/  幂等 / 去重 / retry
§四 多后端适配                                   src/backends/   NATS / Redis / Kafka / InMem
§五 Outbox                                       src/outbox/     worker + schema migration
§六 订阅契约                                     src/subscriber/ 订阅辅助库
§七 安全                                         src/auth/
§八 可观测性                                     内置 OTel
```

### 11.2 与 `quantalithos-core` 的关系

- core 提供 CloudEvent 包络 + TraceContext + ErrorCode
- bus 消费 core 的类型,不反向

### 11.3 与 `quantalithos-sdk`

- sdk 三语言 client 封装 bus 的 publish / subscribe 到高层领域 API(如 `sdk.events.on("governance.gate.decided", handler)`)
- sdk 对 bus 的依赖走 `core` 生成的 binding,不直接 link bus 实现

### 11.4 与 observability 仓

- observability 是 bus 的特殊订阅者(全量 tap)
- bus 发自身指标 / 日志 / trace 给 observability
- observability 提供 DLQ 可视化

### 11.5 与 各 L1 服务

- 每个 L1 服务都是 bus 的发布者(通过 Outbox)+ 订阅者(通过 subscribe)
- 服务内的事件 schema 来自 core 的 domain proto
- 服务的 Outbox 表遵循 §5.1 结构

### 11.6 修订纪律

- `EventBus` trait 接口修改(breaking)必须 ADR
- Outbox 表结构修改必须 migration + ADR(影响 6 个域)
- 新增后端必须走 ADR(影响性能模型 + 运维)
- 保留策略默认值修改不需要 ADR(Policy 可覆盖)
- `EventFilter` 新增字段 non-breaking 无需 ADR

---

## 十二、总结

本草案把 bus 仓从"六域模型规则"展开到"可以实施"的程度。关键产出:

1. **`EventBus` trait + OutboxPublisher** 语言无关抽象
2. **at-least-once + 订阅方幂等** 默认语义;effectively-once 可选
3. **四后端适配**(NATS / Redis / Kafka / InMem)+ 选型矩阵
4. **Outbox 模式** 单事务保一致 + 独立 worker + 积压监控
5. **订阅契约** 跨域一致(幂等 / ack 语义 / trace 传播)
6. **安全模型** mTLS + 发布订阅权限 + envelope encryption(敏感 payload)
7. **可观测性** bus 自身指标 + 完整 trace
8. **7 个开放问题** 覆盖部署 / 保留 / 语义 / 租户 / DSL / 压缩 / DLQ UI

**关键承诺**:

- **跨域唯一主干,不允许直连 RPC**(六域模型 §2.2 规则 1)
- **CloudEvents 1.0 + W3C Trace Context 强制**
- **Outbox 保障业务 + 事件原子性**
- **分区内有序(同聚合根)跨分区无序**
- **订阅方幂等是硬契约,不是推荐**
- **DLQ 作为 fallback,不丢事件**

---

## 附录 A:关键默认值速查

| 配置 | 默认值 | 可调方式 |
|---|---|---|
| Outbox poll_interval | 200ms | OutboxConfig |
| Outbox batch_size | 100 | OutboxConfig |
| Outbox max_retries | 10 | OutboxConfig |
| 订阅 ack_timeout | 30s | SubscribeRequest |
| 订阅 retry 次数 | 3 | retry_policy |
| 事件流保留 | 90 天 | governance Policy |
| 审计流保留 | 7 年 | governance Policy |
| 幂等 LRU 窗口 | 10000 | 订阅方库配置 |
| Outbox 积压告警 | 1000 条 | 后端告警 |
| 消费滞后告警 | 60s | 后端告警 |

---

## 附录 B:设计原则审视

| 原则 | 本草案体现 |
|---|---|
| SRP | bus 只做"事件总线",不涉业务 / 审计 / 推送 |
| OCP | BusBackend trait 可扩展新后端,不改 EventBus 接口 |
| DIP | EventBus 依赖 BusBackend 抽象,不依赖具体后端 |
| DRY | Outbox + 幂等去重的实现由 bus 仓统一,各服务不各自发明 |
| KISS | 默认 at-least-once,避免 effectively-once 的复杂度,除非必要 |
| YAGNI | EventFilter.custom_predicate 留开放问题不先实现 |
| 最小知识 | bus 不懂业务语义,发布方订阅方自管 |
| 不可变优先 | Outbox 写入后不可修改 payload |
| 幂等性 | 发布(event_id 唯一)+ 订阅(LRU)双重保障 |
| 可观察性 | 所有关键环节都发 metric + log + trace |

---

## 附录 C:订正标记

- [ ] §4.3 NATS JetStream 流命名的精确 subject 模式待运维 runbook 定稿
- [ ] §5.1 Outbox 表列名待 domain 仓 PG migration 定稿后校准
- [ ] §7.3 envelope encryption 的 KMS 集成待 L4 基础设施决策
- [ ] §9 性能目标待段 3 末压测后复核
- [ ] §Q5 EventFilter DSL 决策待 governance Policy DSL 决策后

---

> 本草案是段 3 第二件产出。与 `proto-draft`(§3.1)互为上下游:proto 定义事件 schema,bus 定义事件流动。段 3 末迁入 `quantalithos-bus` 独立仓。
