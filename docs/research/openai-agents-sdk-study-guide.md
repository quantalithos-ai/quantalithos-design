# OpenAI Agents SDK 调研

> OpenAI 官方 Agent 框架，Handoff 机制 + Guardrails
> 对我们的价值：Agent 间控制权转交、输入输出校验

---

## 一、定位

OpenAI Agents SDK 是 OpenAI 官方的 Agent 构建框架，核心思想是**Agent 之间通过 Handoff 转交控制权**。

## 二、核心概念

### 2.1 Agent 定义

```python
from agents import Agent, Runner

agent = Agent(
    name="Tech Lead",
    instructions="你是项目负责人，负责需求分析和任务拆解。",
    model="gpt-4",
    tools=[file_read, task_create],
    handoffs=[dev_agent, tester_agent],  # 可以转交给谁
)
```

Agent 的组成：
- instructions：系统 prompt
- tools：可用工具
- handoffs：可以转交控制权的 Agent 列表
- model：使用的 LLM 模型

### 2.2 Handoff（控制权转交）

```python
triage_agent = Agent(
    name="Triage",
    instructions="判断用户需求，转交给合适的 Agent。",
    handoffs=[
        handoff(target=sales_agent, description="销售相关问题"),
        handoff(target=support_agent, description="技术支持问题"),
        handoff(target=billing_agent, description="账单问题"),
    ]
)
```

Handoff 的工作方式：
- LLM 决定是否 handoff（通过 function calling）
- handoff 后控制权完全转交，原 Agent 不再参与
- 被转交的 Agent 继承对话历史
- 可以 handoff 回来（如果定义了反向 handoff）

### 2.3 Guardrails（护栏）

```python
from agents import InputGuardrail, OutputGuardrail

# 输入护栏：在 Agent 处理前校验
input_guard = InputGuardrail(
    guardrail_function=check_no_pii,  # 检查是否包含个人信息
    name="PII Check",
)

# 输出护栏：在 Agent 回复后校验
output_guard = OutputGuardrail(
    guardrail_function=check_no_hallucination,
    name="Hallucination Check",
)

agent = Agent(
    name="Assistant",
    input_guardrails=[input_guard],
    output_guardrails=[output_guard],
)
```

Guardrails 是**硬约束**：
- 输入不通过 → Agent 不执行
- 输出不通过 → 回复不返回给用户，触发重试或报错

### 2.4 Runner（执行器）

```python
from agents import Runner

runner = Runner()
result = await runner.run(
    agent=triage_agent,
    input="我想退款",
)
# result 包含最终回复和执行轨迹
```

Runner 管理 Agent 的执行循环：
- 调用 LLM
- 处理 tool_calls
- 处理 handoffs
- 应用 guardrails
- 记录 tracing

### 2.5 Tracing（追踪）

内置执行追踪，记录每一步：
- LLM 调用（输入/输出/token）
- 工具调用（参数/结果）
- Handoff（从谁到谁）
- Guardrail 校验（通过/拒绝）

## 三、对我们项目的启示

### 3.1 Handoff 可以用于 Assistant → TL 的转交

```
我们的场景：
  Assistant 完成启动流程 → 需要把控制权交给 Tech Lead
  当前设计：Assistant 创建群聊 + 实例化 TL + 生成交接包

OpenAI 的做法：
  Assistant handoff → Tech Lead
  TL 继承对话历史，直接开始工作

启示：
  handoff 比"创建群聊 + 交接包"更简洁
  但我们的场景更复杂（不只是转交，还要创建项目资源）
  可以把 handoff 作为交接的最后一步
```

### 3.2 Guardrails 可以用于共享规则的硬约束

```
我们的场景：
  shared_rules/communication.yaml 的 schema 部分
  reply_types 只允许 result/blocked/clarification
  forbidden_patterns 禁止空洞回复

当前设计：runtime 在 Agent 回复后校验

OpenAI 的做法：
  OutputGuardrail 在回复返回前校验
  不通过则重试

启示：
  shared_rules 的 schema 部分可以实现为 OutputGuardrail
  Agent 回复不符合格式 → 自动重试，不需要人工干预
```

### 3.3 Handoff 的局限性

```
OpenAI Handoff 的问题：
  - 只能转交给预定义的 Agent 列表
  - 转交后原 Agent 完全退出（不能并行）
  - 没有"工作流"概念（不能定义步骤顺序）
  - LLM 决定是否 handoff（半强制）

我们需要的：
  - flow 决定谁执行（不是 LLM 决定）
  - 多 Agent 并行（不是转交）
  - 强制流程控制（不是 LLM 自觉）

结论：Handoff 适合简单的 Agent 间转交，
     不适合复杂的多 Agent 工作流编排。
     我们的 flow + NodeAssignment 更合适。
```

## 四、参考

- 官方文档：https://openai.github.io/openai-agents-python/
- GitHub：https://github.com/openai/openai-agents-python
