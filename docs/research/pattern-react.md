# ReAct (Reasoning + Acting)

> 论文：Yao et al., 2022 (Princeton + Google) — "ReAct: Synergizing Reasoning and Acting in Language Models"

---

## 核心思想

LLM 交替进行推理（Thought）和行动（Action），每次行动后观察结果（Observation），再决定下一步。

```
Thought: 需要先读任务卡了解要做什么
Action:  task_read("TASK-003")
Observation: {title: "标签系统", description: "..."}

Thought: 按 TDD，先写失败测试
Action:  file_write("tests/test_tags.rs", "...")
Observation: File written successfully

Thought: 跑测试确认失败
Action:  code_execute("cargo test tests::tags")
Observation: 1 test failed: test_create_tag

Thought: 测试失败了（红），现在写实现代码
Action:  file_write("src/models/tag.rs", "...")
Observation: File written successfully

Thought: 再跑测试看是否通过
Action:  code_execute("cargo test tests::tags")
Observation: 1 test passed

Thought: 测试通过了（绿），任务完成，提交结果
Action:  submit_step_result({changed_files: [...], test_result: "passed"})
```

## 工作方式

```
         ┌──────────────────────────────────┐
         │                                  │
         ▼                                  │
    ┌─────────┐     ┌─────────┐     ┌──────┴────┐
    │ Thought │────>│ Action  │────>│Observation│
    │ (LLM)   │     │ (Tool)  │     │ (Result)  │
    └─────────┘     └─────────┘     └───────────┘
         │
         │ 没有更多工具调用
         ▼
    ┌─────────┐
    │  完成   │
    └─────────┘
```

特点：
- 每步都有推理（不是盲目调工具）
- 观察结果影响下一步决策（闭环反馈）
- LLM 自己决定什么时候停止

## 与其他模式的区别

```
CoT：只推理不行动
  Thought → Thought → Thought → Answer

ReAct：推理和行动交替
  Thought → Action → Observation → Thought → Action → ...

Plan-and-Execute：先全部规划再执行
  Plan → Execute(step1) → Execute(step2) → ...

ReAct 的优势：每步都能根据观察调整策略
ReAct 的劣势：逐步决策，可能陷入局部最优（没有全局规划）
```

## 对我们的价值

```
核心价值：最高 — 这就是我们 AgentExecutor 的基础模式

我们的 AgentExecutor.run() 就是 ReAct 循环：
  while round < max_rounds:
    response = llm.chat(messages, tools)     # Thought
    if tool_calls:
      result = tool_executor.execute(...)     # Action
      messages.append(tool_result)            # Observation
    if submit_step_result called:
      return output                           # 完成

所有主流框架的 Agent 内部执行都是 ReAct：
  LangGraph: create_react_agent()
  OpenAI SDK: Runner 循环
  Anthropic SDK: Agent Loop
  CrewAI: Agent 内部执行
```

## 参考

- 论文：https://arxiv.org/abs/2210.03629
