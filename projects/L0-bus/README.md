# quantalithos-bus

> **仓使命**:Event Bus 抽象 + 多后端适配(NATS JetStream / Redis Streams / Kafka / In-memory)。Quantalithos **跨域通信的唯一主干**。  

---

## 仓定位

- **层**:L0 共享契约层
- **同层兄弟**:`quantalithos-core` / `quantalithos-sdk`
- **稳定性**:高;接口 breaking 必须 ADR

---

## 主要对齐

- **CloudEvents 1.0**(事件包络)
- **W3C Trace Context**(trace 贯穿)
- **at-least-once 语义 + 订阅方幂等**(默认)
- **Outbox 模式**(业务事务 + 事件发布原子性)

---

## 关键依赖

### 上游
- `quantalithos-core`(CloudEvent + TraceContext + ErrorCode)

### 下游
- 所有 L1 六域服务(publish + subscribe)
- L2 Member 运行层(Member Process B2/B3)
- L3 method-library / capability-hub(Policy / MCP 事件)
- L4 observability(全量 tap)
- L4 archive(归档事件订阅)
- L5 UI(通过 conversation 的 StreamEvents 间接消费)
- L6 Bridges / Marketplace

---

## 目录结构

```
quantalithos-bus/
├── README.md
├── Cargo.toml(workspace)
├── crates/
│   ├── quantalithos-bus-api/        EventBus trait + 共享类型
│   ├── quantalithos-bus-nats/       NATS JetStream 实现(默认)
│   ├── quantalithos-bus-redis/      Redis Streams 实现
│   ├── quantalithos-bus-kafka/      Kafka 实现
│   ├── quantalithos-bus-inmem/      In-memory(测试用)
│   ├── quantalithos-bus-outbox/     Outbox worker + schema
│   └── quantalithos-bus-cli/        bus-ops 运维工具
├── sdk-python/                      Python binding(同时发 PyPI)
├── sdk-typescript/                  TS binding(同时发 npm)
├── docs/
│   ├── backends-comparison.md
│   ├── outbox-guide.md
│   ├── subscription-contract.md
│   └── ops-runbook.md
└── .github/workflows/
```

---

## 构建与测试

```bash
# Rust 主栈
cargo build --workspace
cargo test --workspace

# 压测(需要 NATS 本地)
docker-compose -f docker-compose.test.yml up -d
cargo bench

# 跨语言 binding
cd sdk-python && make generate && pytest
cd sdk-typescript && pnpm generate && pnpm test
```

---

## 维护纪律

对齐 `标准对齐全景图.md` bus 条目 + `子项目遵循规范清单.md` BS 条目:

- **BS1** 至少 4 个后端(NATS / Redis / Kafka / InMem)
- **BS2** 接口抽象,切后端不改上层
- **BS3** 幂等投递语义
- **BS4** Dead Letter Queue 失败不丢
- **BS5** W3C Trace Context 自动传播

后端扩展必须走 ADR(影响性能 + 运维)。

---

## 详细设计参考

- `architecture/bus-draft/README.md` — 完整草案
- `architecture/标准对齐全景图.md` §一 bus 对齐
- `product/六域模型.md` §2.2 跨域通信规则
- 7 个开放问题见 `bus-draft` §十

---

## 开放问题

- Outbox worker 部署形态(内嵌 / sidecar / CDC)
- Effectively-once 启用范围
- 多租户隔离策略
- EventFilter DSL 选型(与 governance Policy DSL 一致?)
- 消息压缩策略
- DLQ 的 Console 可视化

---

## 运维

**生产部署默认**:NATS JetStream 3 节点集群;Outbox worker 内嵌各 L1 服务。

**关键告警**:
- Outbox 积压 > 1000 条 60 秒未清 → major
- 消费组 lag > 60 秒 → major
- DLQ 新增 > 10 条/分 → major
- 后端不可用 → critical

详见 `docs/ops-runbook.md`。
