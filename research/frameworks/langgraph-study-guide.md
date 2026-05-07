# LangGraph 调研

> 状态图驱动的 Agent 编排框架，LangChain 团队出品
> 对我们的价值：AgentWorkflowEngine 的核心参考

---

## 一、定位

LangGraph 是 LangChain 生态中的 Agent 编排框架，核心思想是**把 Agent 的执行流程建模为有向图（StateGraph）**。

与 LangChain 的关系：
- LangChain = 工具链（LLM 调用、工具、记忆、RAG）
- LangGraph = 编排层（控制 Agent 的执行流程）

## 二、核心概念

### 2.1 StateGraph

```python
from langgraph.graph import StateGraph, END

# 定义状态（所有节点共享）
class State(TypedDict):
    messages: list
    intent: str
    context: dict

# 创建图
graph = StateGraph(State)

# 添加节点（每个节点是一个函数）
graph.add_node("identify_intent", identify_intent_fn)
graph.add_node("collect_context", collect_context_fn)
graph.add_node("draft_application", draft_application_fn)

# 添加边（节点之间的连接）
graph.add_edge("identify_intent", "collect_context")
graph.add_edge("collect_context", "draft_application")
graph.add_edge("draft_application", END)

# 编译
app = graph.compile()
```

关键：**图的结构是代码定义的，LLM 不能修改图的边。** LLM 只在节点内部做决策。

### 2.2 节点（Node）

每个节点是一个函数，接收 State，返回更新后的 State：

```python
def identify_intent(state: State) -> dict:
    """节点函数 — 调用 LLM 判断意图"""
    messages = state["messages"]
    response = llm.invoke(messages + [
        {"role": "system", "content": "判断用户意图：new_project / existing / inquiry"}
    ])
    return {"intent": response.content}
```

节点可以包含：
- LLM 调用
- 工具调用
- 纯逻辑（不调 LLM）
- 人类输入等待

### 2.3 条件边（Conditional Edges）

```python
def route_by_intent(state: State) -> str:
    """条件路由函数 — 返回下一个节点的名称"""
    if state["intent"] == "new_project":
        return "collect_context"
    elif state["intent"] == "existing":
        return "load_project"
    else:
        return "free_chat"

graph.add_conditional_edges(
    "identify_intent",
    route_by_intent,
    {
        "collect_context": "collect_context",
        "load_project": "load_project",
        "free_chat": "free_chat",
    }
)
```

条件路由函数是**普通 Python 函数**，不是 LLM 调用。路由逻辑是确定性的。

### 2.4 Checkpoint（持久化 + 等待用户）

```python
from langgraph.checkpoint.memory import MemorySaver

# 编译时指定 checkpoint
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

# 执行到某个节点时暂停
config = {"configurable": {"thread_id": "user-001"}}
result = app.invoke({"messages": [user_msg]}, config)

# 用户回复后，从 checkpoint 恢复继续
result = app.invoke({"messages": [user_reply]}, config)
```

Checkpoint 保存完整的图状态（当前节点、State 数据），支持：
- 崩溃恢复
- 等待用户输入
- 时间旅行（回到之前的状态）

### 2.5 Human-in-the-Loop

```python
from langgraph.graph import interrupt

def user_confirmation(state: State) -> dict:
    """等待用户确认"""
    # interrupt 会暂停图的执行，等待外部输入
    user_response = interrupt(
        {"question": "请确认以下申请表", "data": state["application"]}
    )
    return {"user_confirmed": user_response == "confirm"}
```

## 三、对我们项目的启示

### 3.1 AgentWorkflowEngine 应该参考 LangGraph 的 StateGraph

```
LangGraph 的做法：
  图的边 = 硬约束（代码定义，LLM 不能修改）
  节点内部 = LLM 自由决策
  条件路由 = 普通函数（确定性）
  状态 = 所有节点共享的 TypedDict

映射到我们的设计：
  ProcessDefinition 的 edges = 硬约束
  ActivityNode 内部 = Agent think→act 循环
  GatewayNode 的条件 = 读取上一步 output 的字段值
  State = 各节点的 output 累积
```

### 3.2 Checkpoint 解决了"等待用户"的问题

```
我们的场景：
  Assistant 执行启动流程 → 需要等待用户回复
  Agent 执行任务 → 用户隔天回来继续

LangGraph 的方案：
  interrupt() 暂停 → 保存 checkpoint → 用户回复 → 恢复继续

我们可以借鉴：
  AgentWorkflowEngine 在等待用户时保存状态
  用户回复后从状态恢复继续
  不需要重新执行之前的步骤
```

### 3.3 与我们的方案 C 的对比

```
方案 C（分步 prompt 注入）：
  每一步追加 system 消息到对话历史
  对话历史持续膨胀
  状态 = 对话历史本身

LangGraph 的做法：
  每一步是独立的函数调用
  状态 = 显式的 State 对象（不是对话历史）
  节点之间通过 State 传递数据，不通过对话历史

启示：
  AgentWorkflowEngine 应该维护一个显式的 workflow_state
  而不是把所有信息塞进对话历史
  节点之间通过 workflow_state 传递数据
```

## 四、关键代码模式

### 4.1 Agent 内部工作流（ReAct 模式）

```python
# LangGraph 内置的 ReAct Agent
from langgraph.prebuilt import create_react_agent

agent = create_react_agent(
    model=ChatOpenAI(model="gpt-4"),
    tools=[file_read, file_write, code_execute],
)

# 这个 agent 内部就是一个图：
# call_model → should_continue? → call_tool → call_model → ...
# 循环直到 LLM 不再调用工具
```

### 4.2 多步骤工作流

```python
# 把多个 Agent 串成工作流
graph = StateGraph(State)
graph.add_node("tl_review", tl_agent)
graph.add_node("dev_implement", dev_agent)
graph.add_node("qa_test", qa_agent)

graph.add_edge("tl_review", "dev_implement")
graph.add_conditional_edges("dev_implement", check_review)
graph.add_edge("qa_test", END)
```

## 五、参考

- 官方文档：https://langchain-ai.github.io/langgraph/
- GitHub：https://github.com/langchain-ai/langgraph
