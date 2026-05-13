# quantalithos-work

> **仓使命**:工作域服务 —— Project / ProjectMember / Backlog / WorkItem / Iteration 聚合。承载软件项目的完整生命周期与双层 Member 模型的"项目分配层"。  

---

## 仓定位

- **层**:L1 六域服务层
- **技术栈**:Rust + PostgreSQL

---

## 主要对齐

- **ISO 12207 §6.4 技术过程**(WorkItem type 参考)
- **Scrum**(Backlog / Iteration / Sprint Goal / Retrospective)
- **Kanban**(Flow / Pull / Cadence / WIP)
- **ISO 15288 SoI**(Project 作为 SoI)
- **ISO 29110 Profile**(tool_scope + policy_overrides)
- **ISO 25010 Context of Use**
- **双层 Member 模型**(ADR-0004:ProjectMember 在本仓,GlobalMember 在 identity)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`
- `quantalithos-identity`(订阅 Member 生命周期事件)
- `quantalithos-process`(Project.process_profile_id 引用)
- 外部:PG

### 下游
- `quantalithos-conversation`(Project → group 自动创建)
- `quantalithos-member-service`(ProjectMember → 容器启停)
- `quantalithos-process`(Project 启动 → ProcessInstance 创建)
- `quantalithos-governance`(Gate 联动)
- `quantalithos-artifact`(WorkItem → Artifact 关联)
- `quantalithos-archive`(dissolved 归档)

---

## 目录结构

```
quantalithos-work/
├── Cargo.toml
├── src/
│   ├── domain/             Project / ProjectMember / WorkItem / Iteration / Backlog
│   ├── rpc/                WorkService 实现
│   ├── board/              GetProjectBoard 看板视图(物化视图)
│   ├── subscriptions/      订阅 identity / governance / artifact / process 事件
│   └── infra/
├── migrations/             5 聚合 + outbox;unique partial index for INV-16/INV-43
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` WK 条目:
- **WK1** ProjectMember 在本仓,identity 不反向依赖
- **WK2** WorkItem 依赖 DAG(插入时递归 CTE 检查环)
- **WK3** state=done 必有 approved Artifact
- **WK4** Project 生命周期严格单向(dissolved 不可复活)
- **WK5** Iteration 可选,Backlog 必须
- **WK6** tool_scope 遵守 29110 Profile 语义

**46 条不变量(INV-1 到 INV-46)** 跨五聚合,参见 `domain/work/README.md`。

---

## 详细设计参考

- `domain/work/README.md`(1569 行)—— 权威
- `architecture/proto-draft/work/v1/work_service.proto`
- ADR-0004 / 0006

---

## 开放问题

多 owner / Iteration 可选性 / epic 层级 / 扩展授权 / archived 恢复限制 / 跨项目复用 / pause 传导。

---

## 性能目标

- CreateWorkItem P95 < 100ms
- GetProjectBoard P95 < 300ms
- 2000 读 QPS / 200 写 QPS
- 500w 活跃 WorkItem(10w 项目 × 50)
