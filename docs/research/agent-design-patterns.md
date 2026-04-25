# LLM Agent 设计模式全景

> 社区和论文中的主要 Agent 设计模式分类与对比
> 对我们的价值：选择 Quantalithos AI 各层的最佳模式组合

---

## 一、模式分类

```
┌─────────────────────────────────────────────────────────────┐
│  单步推理（不循环）                                          │
│  1. Chain-of-Thought (CoT)     一次推理，逐步思考           │
│  2. Tree-of-Thought (ToT)      多路径探索，选最优           │
├─────────────────────────────────────────────────────────────┤
│  循环执行（Agent 核心）                                      │
│  3. ReAct                      想一步做一步，交替循环        │
│  4. Plan-and-Execute           先规划再执行，可修正          │
│  5. LATS                       蒙特卡洛树搜索，探索+回溯     │
├─────────────────────────────────────────────────────────────┤
│  自我改进                                                    │
│  6. Reflexion                  执行→反思→改进→重试           │
│  7. Self-Refine                生成→自评→修改→再评           │
├─────────────────────────────────────────────────────────────┤
│  多 Agent 协作                                               │
│  8. Orchestrator-Worker        编排者分配，工人执行          │
│  9. Debate / Discussion        多 Agent 辩论达成共识         │
│  10. Handoff Chain             控制权链式转交                │
│  11. Hierarchical              层级管理（经理→组长→员工）    │
├─────────────────────────────────────────────────────────────┤
│  工作流控制                                                  │
│  12. State Machine             状态图驱动，硬约束            │
│  13. DAG Pipeline              有向无环图，数据流水线        │
│  14. Event-Driven              事件触发，异步响应            │
└─────────────────────────────────────────────────────────────┘
```

## 二、与 Quantalithos AI 的映射

| 我们的组件 | 使用的模式 | 说明 |
|-----------|-----------|------|
| AgentExecutor（think→act 循环） | ReAct | 每个节点内部的执行方式 |
| AgentWorkflowEngine | State Machine (LangGraph 式) | Agent 级工作流的强制控制 |
| flow 项目级编排 | Orchestrator-Worker | flow 是编排者，Agent 是工人 |
| session（头脑风暴） | Debate / Discussion | 多 Agent 自由讨论 |
| Assistant → TL 交接 | Handoff Chain | 控制权转交 |
| TL 拆解任务 | Plan-and-Execute | 先规划（阶段 2）再执行（阶段 3） |
| 代码审查 | Reflexion | 审查不通过 → 反思 → 修改 → 重新审查 |
| 门禁审批 | Event-Driven | 等待用户事件触发 |

## 三、各模式详细文档

| 模式 | 文档 |
|------|------|
| Chain-of-Thought | [pattern-chain-of-thought.md](pattern-chain-of-thought.md) |
| Tree-of-Thought | [pattern-tree-of-thought.md](pattern-tree-of-thought.md) |
| ReAct | [pattern-react.md](pattern-react.md) |
| Plan-and-Execute | [pattern-plan-and-execute.md](pattern-plan-and-execute.md) |
| LATS | [pattern-lats.md](pattern-lats.md) |
| Reflexion | [pattern-reflexion.md](pattern-reflexion.md) |
| Self-Refine | [pattern-self-refine.md](pattern-self-refine.md) |
| Orchestrator-Worker | [pattern-orchestrator-worker.md](pattern-orchestrator-worker.md) |
| Debate / Discussion | [pattern-debate.md](pattern-debate.md) |
| Handoff Chain | [pattern-handoff.md](pattern-handoff.md) |
| Hierarchical | [pattern-hierarchical.md](pattern-hierarchical.md) |
| State Machine | [pattern-state-machine.md](pattern-state-machine.md) |
| DAG Pipeline | [pattern-dag-pipeline.md](pattern-dag-pipeline.md) |
| Event-Driven | [pattern-event-driven.md](pattern-event-driven.md) |
