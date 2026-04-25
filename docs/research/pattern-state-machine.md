# State Machine (状态图驱动)

> 框架实现：LangGraph (StateGraph)、XState、BPMN 引擎
> 对我们的价值：AgentWorkflowEngine 和 flow 引擎的核心模式

---

## 核心思想

Agent 的执行流程建模为状态图。每个状态是一个节点（执行某个操作），状态之间的转换由边（条件）决定。Agent 不能自己决定跳到哪个状态，图的结构是硬约束。

```
         ┌─────────┐
         │  idle   │
         └────┬────┘
              │ 收到任务
              ▼
         ┌─────────┐
         │ planning│
         └────┬────┘
              │ 计划完成
              ▼
         ┌─────────┐     失败
         │executing│ ──────────┐
         └────┬────┘           │
              │ 成功            │
              ▼                ▼
         ┌─────────┐    ┌──────────┐
         │reviewing│    │ debugging│
         └────┬────┘    └────┬─────┘
              │              │ 修复完成
              │              └──> executing
              │ 审查通过
              ▼
         ┌─────────┐
         │completed│
         └─────────┘
```

## 工作方式

```
1. 定义状态图（nodes + edges）
2. 初始化到起始状态
3. 执行当前状态的操作（可以是 LLM 调用、工具调用等）
4. 根据操作结果，按边的条件转换到下一个状态
5. 重复直到到达终止状态

关键：状态转换由图的边决定，不由 LLM 决定
     LLM 只在状态内部做决策（如"写什么代码"）
     LLM 不能决定"跳过审查直接完成"
```

## 与 ReAct 的对比

```
ReAct：
  LLM 自己决定下一步做什么
  没有预定义的状态图
  灵活但不可控

State Machine：
  图的边决定下一步
  LLM 只在节点内部做决策
  可控但不灵活

结合：
  外层用 State Machine 控制流程顺序
  内层用 ReAct 执行每个节点的具体操作
  → 这就是我们的 AgentWorkflowEngine + AgentExecutor
```

## LangGraph 的实现

```python
from langgraph.graph import StateGraph, END

graph = StateGraph(State)

# 节点 = 函数
graph.add_node("plan", plan_fn)
graph.add_node("execute", execute_fn)
graph.add_node("review", review_fn)

# 边 = 状态转换
graph.add_edge("plan", "execute")
graph.add_conditional_edges("execute", check_result, {
    "success": "review",
    "failure": "execute",  # 重试
})
graph.add_conditional_edges("review", check_review, {
    "approved": END,
    "rejected": "execute",  # 打回
})

app = graph.compile()
```

## 对我们的价值

```
核心价值：最高

1. flow 的项目级编排 = State Machine
   ProcessDefinition 的 nodes + edges = 状态图
   GatewayNode 的条件路由 = conditional_edges
   阶段推进 = 状态转换

2. AgentWorkflowEngine = State Machine
   Agent 级工作流（如 TDD）= 状态图
   每个节点 = 一个 ReAct 执行
   节点之间的推进 = 状态转换

3. 任务状态机 = State Machine
   created → assigned → in_progress → in_review → completed
   状态转换规则 = 边的条件
```

## 参考

- LangGraph StateGraph
- XState (JavaScript 状态机库)
- BPMN 2.0 执行语义
