# Anthropic Claude Agent SDK 调研

> Claude 官方 Agent 框架，Agent Loop + Sub-Agent + Tool Use
> 对我们的价值：think→act 循环实现参考、Sub-Agent 派发机制

---

## 一、定位

Anthropic Agent SDK 是 Claude 官方的 Agent 构建框架，核心思想是**Agent Loop（循环调用 LLM 直到任务完成）+ 工具系统**。

与 OpenAI Agents SDK 的区别：
- OpenAI：多 Agent Handoff 为核心
- Anthropic：单 Agent Loop 为核心，Sub-Agent 是辅助

## 二、核心概念

### 2.1 Agent Loop

```python
import anthropic

client = anthropic.Anthropic()

# Agent Loop 的核心：循环调用 LLM，直到不再调用工具
messages = [{"role": "user", "content": "实现标签系统"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=messages,
        tools=tool_definitions,
        max_tokens=4096,
    )

    # 记录 assistant 回复
    messages.append({"role": "assistant", "content": response.content})

    # 检查是否有工具调用
    tool_uses = [b for b in response.content if b.type == "tool_use"]

    if not tool_uses:
        break  # 没有工具调用 → 任务完成

    # 执行工具，记录结果
    tool_results = []
    for tool_use in tool_uses:
        result = execute_tool(tool_use.name, tool_use.input)
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": tool_use.id,
            "content": result,
        })

    messages.append({"role": "user", "content": tool_results})
```

关键：**循环的退出条件是 LLM 不再调用工具**。LLM 自己决定什么时候"做完了"。

### 2.2 Tool Use（工具调用）

```python
tool_definitions = [
    {
        "name": "file_write",
        "description": "写入文件",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"},
            },
            "required": ["path", "content"],
        },
    },
    {
        "name": "code_execute",
        "description": "执行命令",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {"type": "string"},
            },
            "required": ["command"],
        },
    },
]
```

Claude 的 Tool Use 特点：
- 原生支持（不是 function calling 的包装）
- 支持并行工具调用（一次回复里多个 tool_use）
- 支持嵌套工具调用（工具结果触发新的工具调用）

### 2.3 Sub-Agent（子 Agent 派发）

```python
# Claude Agent SDK 的 Sub-Agent 模式
# 父 Agent 通过工具调用派发子 Agent

sub_agent_tool = {
    "name": "delegate_to_specialist",
    "description": "派发任务给专家 Agent",
    "input_schema": {
        "type": "object",
        "properties": {
            "specialist": {"type": "string", "enum": ["backend_dev", "frontend_dev", "tester"]},
            "task": {"type": "string"},
            "context": {"type": "string"},
        },
        "required": ["specialist", "task"],
    },
}

# 父 Agent 调用 delegate_to_specialist
# → 创建子 Agent 实例
# → 子 Agent 独立执行 Agent Loop
# → 子 Agent 完成后结果返回给父 Agent 作为工具结果
```

Sub-Agent 的特点：
- 子 Agent 有独立的对话历史（不继承父 Agent 的全部历史）
- 父 Agent 显式构造子 Agent 的上下文（只传递需要的信息）
- 子 Agent 完成后，结果作为工具调用的返回值回到父 Agent
- 子 Agent 可以有自己的工具集（和父 Agent 不同）

### 2.4 Claude Code 的实现（参考）

Claude Code（Anthropic 的 CLI 工具）的架构：

```
用户输入
    │
    ▼
Main Agent Loop
    │
    ├── think：调用 Claude
    │
    ├── act：执行工具
    │   ├── file_read / file_write
    │   ├── code_execute (bash)
    │   ├── search
    │   └── spawn_sub_agent        ← 派发子 Agent
    │       │
    │       ▼
    │   Sub-Agent Loop（独立上下文）
    │       │
    │       └── 结果返回给 Main Agent
    │
    └── 循环直到 Claude 不再调用工具
```

Claude Code 的关键设计：
- 子 Agent 不继承父 Agent 的对话历史
- 父 Agent 为子 Agent 构造精确的上下文（"你需要做 X，相关文件是 Y"）
- 子 Agent 的结果被压缩后返回（不是完整的对话历史）

## 三、对我们项目的启示

### 3.1 Agent Loop 就是我们的 think→act 循环

```
Anthropic 的 Agent Loop：
  while True:
    response = llm.call(messages, tools)
    if no tool_calls: break
    execute tools, append results

我们的 AgentExecutor：
  while round < max_rounds:
    response = llm.chat(messages, tools)
    if tool_call == submit_step_result: return output
    if no tool_calls: continue
    execute tools, append results

区别：
  Anthropic：LLM 不调用工具 = 完成
  我们：LLM 调用 submit_step_result = 完成
  → 我们的退出条件更明确（必须显式提交）
```

### 3.2 Sub-Agent 可以用于 AgentWorkflowEngine

```
当前方案 C（分步 prompt 注入）的问题：
  对话历史膨胀，token 消耗高

Sub-Agent 方案：
  每个工作流节点 = 一个 Sub-Agent
  Sub-Agent 有独立的对话历史
  完成后结果压缩返回给父 Agent

例：TDD 工作流
  父 Agent（后端开发）收到 NodeAssignment
    │
    ├── spawn Sub-Agent: write_test
    │   上下文："写一个标签系统的失败测试"
    │   工具：[file_write, code_execute]
    │   独立对话历史（3~5 轮）
    │   结果："tests/test_tags.rs 已创建，测试失败 ✓"
    │
    ├── spawn Sub-Agent: write_code
    │   上下文："实现标签系统，让测试通过" + 上一步结果
    │   工具：[file_read, file_write, code_execute]
    │   独立对话历史（5~8 轮）
    │   结果："src/models/tag.rs 已创建，测试通过 ✓"
    │
    └── 父 Agent 调用 submit_step_result

  优点：
    每个 Sub-Agent 的对话历史短（3~8 轮）
    不会膨胀
    token 消耗和自由执行差不多

  缺点：
    每个 Sub-Agent 需要单独调 LLM 初始化
    上下文传递需要精心构造
```

### 3.3 与 LangGraph 的互补

```
LangGraph：图的边 = 硬约束，控制节点顺序
Anthropic Sub-Agent：每个节点 = 独立的 Agent Loop

结合：
  AgentWorkflowEngine 用 LangGraph 的图模型控制节点顺序
  每个节点内部用 Anthropic 的 Sub-Agent 模式执行
  → 强制流程 + 独立上下文 + 不膨胀
```

## 四、参考

- Claude Tool Use 文档：https://docs.anthropic.com/en/docs/build-with-claude/tool-use
- Claude Agent SDK：https://github.com/anthropics/anthropic-sdk-python
- Claude Code 架构分析：https://www.thakurcoder.com/blog/claude-code-leaked-typescript-ai-agents-architecture
