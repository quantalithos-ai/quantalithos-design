# Hierarchical (层级管理)

> 框架实现：CrewAI (hierarchical process)、AutoGen (nested chat)

---

## 核心思想

Agent 按层级组织，上级管理下级，下级向上级汇报。类似公司的管理结构。

```
         ┌──────────────┐
         │   Manager    │
         │  (项目经理)   │
         └──────┬───────┘
                │
       ┌────────┼────────┐
       │        │        │
       ▼        ▼        ▼
  ┌─────────┐ ┌──────┐ ┌──────┐
  │ Team    │ │ Team │ │ Team │
  │ Lead A  │ │Lead B│ │Lead C│
  │ (后端组) │ │(前端)│ │(测试)│
  └────┬────┘ └──┬───┘ └──┬───┘
       │         │        │
    ┌──┼──┐     │      ┌─┼─┐
    │  │  │     │      │ │ │
    ▼  ▼  ▼     ▼      ▼ ▼ ▼
   Dev Dev Dev  Dev   QA QA QA
```

## 工作方式

```
1. Manager 收到总任务
2. Manager 拆解为子任务，分配给 Team Lead
3. Team Lead 进一步拆解，分配给 Developer
4. Developer 执行，结果汇报给 Team Lead
5. Team Lead 汇总，汇报给 Manager
6. Manager 判断是否完成
```

特点：
- 多层级（不只是两层）
- 每层有自己的决策权限
- 信息逐层汇总（不是所有信息都到顶层）

## 与 Orchestrator-Worker 的区别

```
Orchestrator-Worker：两层（编排者 + 工人）
Hierarchical：多层（经理 → 组长 → 员工）

Orchestrator-Worker：编排者直接管理所有工人
Hierarchical：每层只管理下一层
```

## 对我们的价值

```
价值：高 — 我们的架构就是层级模式

我们的层级：
  flow（编排者）
    → TL（项目负责人，管理团队）
      → Backend Dev（执行编码）
      → Frontend Dev（执行编码）
      → Tester（执行测试）
      → DevOps（执行部署）

但我们的层级不是纯粹的 Hierarchical：
  flow 直接调度所有 Agent（不只是 TL）
  TL 不"管理"其他 Agent，而是做设计和审查
  其他 Agent 不向 TL "汇报"，而是向 flow 上报 NodeResult

所以我们是 Orchestrator-Worker + 部分 Hierarchical：
  flow = Orchestrator（调度所有 Agent）
  TL = 特殊 Worker（做规划和审查，不做编码）
  其他 Agent = Worker（做具体执行）
```

## 参考

- CrewAI hierarchical process
- AutoGen nested chat
