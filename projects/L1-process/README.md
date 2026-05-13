# quantalithos-process

> **仓使命**:过程域服务 —— ProcessTemplate / ProcessProfile / ProcessInstance 三段式。BPMN 2.0 引擎 + 29110 Tailoring + Temporal 持久执行的综合落地。  

---

## 仓定位

- **层**:L1 六域服务层
- **技术栈**:Python + PostgreSQL(BPMN 引擎生态丰富)

---

## 主要对齐

- **BPMN 2.0 整套**(Activity / Gateway / Event / SequenceFlow / Token)
- **SPEM 2.0 Definition vs Use**(Template → Profile → Instance)
- **ISO 24748-2**(8 种生命周期模型 + Decision Gate)
- **ISO 29110 Profile**(Tailoring 三机制)
- **LangGraph**(StateGraph 硬约束)
- **Temporal**(持久执行 + Activity 重试 + Checkpoint 每步)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`
- `quantalithos-method-library`(Method Content 同步)
- 外部:PG(含按月分区的 activities 表)+ 对象存储(大 checkpoint 外置)

### 下游
- `quantalithos-governance`(Activity.waiting_gate → Gate 创建)
- `quantalithos-work`(Instance 状态 ↔ Project)
- `quantalithos-artifact`(Activity.outputs 产出)
- `quantalithos-member-service`(Activity 调度容器)
- `quantalithos-observability`

---

## 目录结构

```
quantalithos-process/
├── pyproject.toml
├── src/quantalithos_process/
│   ├── domain/             Template / Profile / Instance / Activity / Token
│   ├── engine/             BPMN 引擎(基于开源核心 + 定制)
│   ├── rpc/
│   ├── checkpoint/         ADR-0007:inline + external blob(> 256KB)
│   ├── subscriptions/
│   └── infra/
├── migrations/             按月分区 activities / checkpoints / outbox
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` PR 条目:
- **PR1** Template/Profile/Instance 三段不可合并
- **PR2** Tailoring Record 遵循 24748-2 §5.3 格式
- **PR3** 每 Activity 完成立即 checkpoint
- **PR4** waiting_gate 状态不占调度资源
- **PR5** 引擎实现走 BPMN 2.0 元模型
- **PR6** Python 栈

**43 条不变量** 参见 `domain/process/README.md`。

---

## 详细设计参考

- `domain/process/README.md`(1552 行)
- `architecture/adr/0007-checkpoint-persistence-in-process.md`
- `methodology/standards-discussion/BPMN-2.0.md`
- `architecture/proto-draft/process/v1/process_service.proto`

---

## 开放问题

Checkpoint 归属已 ADR-0007 决;Sub-Process/Call-Activity 边界 / Template 版本演进 / assignee 算法 / 重试细化 / Token 超时 / Stage 显式化。

---

## 性能目标

- CompleteActivity P95 < 200ms(含 checkpoint)
- Checkpoint 写入 P95 < 50ms inline / < 500ms external
- 崩溃恢复 < 30s 小 Instance / < 3min 大 Instance
- 10w 活跃 Instance / 5000w Activity 年
