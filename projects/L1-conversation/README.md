# quantalithos-conversation

> **仓使命**:对话域服务 —— Conversation(四形态)+ Turn(五 kind)的持久化、实时推送、AG-UI 17 事件映射。

---

## 仓定位

- **层**:L1 六域服务层
- **技术栈**:Rust + PostgreSQL(按月分区) + 全文检索 + WebSocket/SSE

---

## 主要对齐

- **BPMN 2.0 Collaboration View**(Conversation 四形态 + MessageFlow)
- **AG-UI 17 事件类型**(实时推送)
- **Scrum 5 事件**(群聊 Turn 序列映射)
- **ISO 9001 §7.5**(对话即 Documented Information)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`
- 外部:PG + 全文检索(PG tsvector 或 OpenSearch)

### 下游
- `quantalithos-chat`(StreamEvents 订阅)
- `quantalithos-bridges`(桥接映射)
- `quantalithos-governance`(订阅 gate 事件发 Gate Turn)
- `quantalithos-observability`

---

## 目录结构

```
quantalithos-conversation/
├── Cargo.toml
├── src/
│   ├── domain/             Conversation / Turn 聚合
│   ├── rpc/                ConversationService 实现
│   ├── streaming/          AG-UI 17 事件推送
│   ├── subscriptions/      订阅 work/governance/identity 事件
│   └── infra/              PG(分区)+ 全文检索
├── migrations/             conversations / turns(partitioned by month)/ outbox
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` CV 条目:
- **CV1** 四形态强约束(group/channel/dm/thread)
- **CV2** Turn 不可变(修改用新 Turn 覆盖显示)
- **CV3** AG-UI 17 事件推送
- **CV4** 发布事件对齐 domain README
- **CV5** 高并发写严格事务

**22 条不变量(INV-1 到 INV-22)** 参见 `domain/conversation/README.md` §2.1.4 / §2.2.3。

---

## 详细设计参考

- `domain/conversation/README.md`(967 行)
- `architecture/proto-draft/conversation/v1/conversation_service.proto`

---

## 开放问题

Turn 编辑 UX / 全文检索选型 / 通知独立服务 / thread visibility / bridged lifecycle / @ 泛 mention。

---

## 性能目标

- PostTurn P95 < 100ms
- StreamEvents 端到端 P95 < 500ms
- 5000 读 QPS / 500 写 QPS(10w 用户规模)
- 1.5 亿 Turn/月(按月分区 + 冷存)
