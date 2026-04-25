# Orchestrator-Worker

> 来源：分布式系统经典模式，在 AI Agent 领域广泛应用
> 框架实现：CrewAI (hierarchical process)、LangGraph (supervisor pattern)

---

## 核心思想

一个编排者（Orchestrator）负责分配任务，多个工人（Worker）负责执行。编排者不做具体工作，只做调度决策。

```
              ┌──────────────┐
              │ Orchestrator │
              │ (编排者)      │
              │              │
              │ 分析任务      │
              │ 分配给谁      │
              │ 收集结果      │
              │ 判断是否完成  │
              └──────┬───────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Worker A│ │ Worker B│ │ Worker C│
   │ 后端开发 │ │ 前端开发 │ │ 测试    │
   │         │ │         │ │         │
   │ 执行任务 │ │ 执行任务 │ │ 执行任务 │
   │ 返回结果 │ │ 返回结果 │ │ 返回结果 │
   └─────────┘ └─────────┘ └─────────┘
```

## 工作方式

```
1. Orchestrator 收到总任务
2. 分析任务，拆解为子任务
3. 将子任务分配给合适的 Worker
4. Worker 独立执行（ReAct 模式）
5. Worker 返回结果给 Orchestrator
6. Orchestrator 判断：
   ├── 全部完成 → 汇总结果，任务结束
   ├── 部分失败 → 重新分配或修正
   └── 需要更多工作 → 分配新子任务
```

## 两种实现方式

```
方式 A：LLM 做编排者（CrewAI hierarchical）
  Orchestrator 是一个 LLM Agent
  它用 LLM 决定"把这个任务给谁"
  灵活但不确定（LLM 可能分配错）

方式 B：代码做编排者（我们的 flow）
  Orchestrator 是代码逻辑（ProcessDefinition + 调度器）
  按 nodes + edges 确定性分配
  可靠但不灵活（流程是预定义的）
```

## 对我们的价值

```
核心价值：最高 — 这就是我们的整体架构

我们的 flow = Orchestrator
  读取 ProcessDefinition
  按 nodes + edges 调度
  下发 NodeAssignment
  收集 NodeResult
  判断推进/回退

我们的 Agent = Worker
  收到 NodeAssignment
  独立执行（ReAct 模式）
  返回 NodeResult

区别：
  我们的 Orchestrator 是代码（flow），不是 LLM
  → 确定性调度，不会分配错
  → 但不能动态调整（除非 TL 提议修改流程）
```

## 参考

- CrewAI hierarchical process
- LangGraph supervisor pattern
- Anthropic "Building effective agents" guide
