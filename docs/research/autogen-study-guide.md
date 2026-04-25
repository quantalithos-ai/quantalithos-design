# AutoGen 调研

> Microsoft 多 Agent 对话协作框架
> 对我们的价值：GroupChat 多人讨论机制、Agent 间对话模式

---

## 一、定位

AutoGen 是 Microsoft 的多 Agent 框架，核心思想是**Agent 之间通过对话协作**。与其他框架的区别：Agent 不是被编排器调度的，而是在对话中自组织。

## 二、核心概念

### 2.1 Agent 类型

```python
from autogen import ConversableAgent, AssistantAgent, UserProxyAgent

# AssistantAgent — LLM 驱动
assistant = AssistantAgent(
    name="Tech_Lead",
    system_message="你是项目负责人...",
    llm_config={"model": "gpt-4"},
)

# UserProxyAgent — 代表人类（可自动回复或等待人类输入）
user = UserProxyAgent(
    name="User",
    human_input_mode="ALWAYS",  # ALWAYS | NEVER | TERMINATE
    code_execution_config={"work_dir": "workspace"},
)
```

关键：UserProxyAgent 的 `human_input_mode`：
- ALWAYS：每次都等待人类输入
- NEVER：完全自动（用 LLM 或预设回复）
- TERMINATE：只在终止条件时等待人类

### 2.2 两人对话

```python
# 最简单的模式：两个 Agent 对话
user.initiate_chat(
    assistant,
    message="我想做一个博客系统",
)

# 对话循环：
# user → assistant → user → assistant → ...
# 直到满足终止条件（如 assistant 回复 "TERMINATE"）
```

### 2.3 GroupChat（多人讨论）

```python
from autogen import GroupChat, GroupChatManager

# 创建多个 Agent
tl = AssistantAgent(name="Tech_Lead", ...)
backend = AssistantAgent(name="Backend_Dev", ...)
frontend = AssistantAgent(name="Frontend_Dev", ...)
tester = AssistantAgent(name="Tester", ...)

# 创建群聊
group_chat = GroupChat(
    agents=[tl, backend, frontend, tester],
    messages=[],
    max_round=20,
    speaker_selection_method="auto",  # auto | round_robin | manual | random
)

# GroupChatManager 管理群聊
manager = GroupChatManager(
    groupchat=group_chat,
    llm_config={"model": "gpt-4"},
)

# 发起群聊
user.initiate_chat(
    manager,
    message="讨论博客系统的技术方案",
)
```

`speaker_selection_method` 决定谁发言：
- auto：LLM 决定下一个发言者（基于对话上下文）
- round_robin：轮流发言
- manual：人类选择
- random：随机
- 自定义函数：代码逻辑决定

### 2.4 Sequential Chat（顺序对话）

```python
# 多个对话按顺序执行，上一个对话的结果传给下一个
chat_results = user.initiate_chats([
    {
        "recipient": tl,
        "message": "分析需求",
        "summary_method": "reflection_with_llm",  # 自动总结
    },
    {
        "recipient": backend,
        "message": "根据需求设计技术方案",
        "summary_method": "reflection_with_llm",
    },
    {
        "recipient": tester,
        "message": "根据方案设计测试用例",
        "summary_method": "reflection_with_llm",
    },
])
```

每个对话的 summary 自动传递给下一个对话作为上下文。

### 2.5 Nested Chat（嵌套对话）

```python
# Agent 在对话中可以发起子对话
tl.register_nested_chats(
    [
        {
            "recipient": backend,
            "message": "评估这个方案的技术可行性",
            "summary_method": "last_msg",
        }
    ],
    trigger=lambda sender, message, ...: "需要技术评估" in message,
)

# 当 TL 收到包含"需要技术评估"的消息时
# 自动发起和 backend 的子对话
# 子对话结果作为 TL 的回复
```

## 三、对我们项目的启示

### 3.1 GroupChat 对应我们的 session（collaboration 模式）

```
AutoGen GroupChat：
  多个 Agent 在群聊中自由讨论
  GroupChatManager 用 LLM 决定谁发言
  max_round 控制讨论轮次

我们的 session：
  多个 Agent 在群聊中讨论
  moderator 负责总结和提交
  flow 路由消息

区别：
  AutoGen：LLM 决定谁发言（不确定性）
  我们：flow 路由消息（确定性）或 free 模式（自由发言）

启示：
  我们的 session 可以借鉴 AutoGen 的 speaker_selection_method
  但默认用 free 模式（所有人都能发言），不用 LLM 选人
  moderator 的角色 = GroupChatManager 的角色
```

### 3.2 Sequential Chat 对应我们的项目级工作流

```
AutoGen Sequential Chat：
  对话 1（TL 分析需求）→ summary → 对话 2（开发设计方案）→ summary → ...

我们的项目级工作流：
  节点 1（TL collect）→ output → 节点 2（brainstorm）→ output → ...

区别：
  AutoGen：每个"步骤"是一个完整的对话
  我们：每个"步骤"是一个 NodeAssignment

启示：
  AutoGen 的 summary_method 值得借鉴
  我们的 output_schema + submit_step_result 更精确
  但 AutoGen 的"自动总结上一步结果传给下一步"的思路
  可以用在 input_refs 的解析上
```

### 3.3 Nested Chat 对应我们的 ask_teammate

```
AutoGen Nested Chat：
  Agent 在对话中触发子对话
  子对话结果作为回复

我们的 ask_teammate：
  Agent 在执行任务时调用 ask_teammate 工具
  问题路由给目标 Agent
  回答作为工具结果返回

区别：
  AutoGen：trigger 是消息内容匹配（不确定性）
  我们：Agent 显式调用工具（确定性）

启示：
  我们的 ask_teammate 设计更好（显式调用 > 隐式触发）
```

## 四、参考

- 官方文档：https://microsoft.github.io/autogen/
- GitHub：https://github.com/microsoft/autogen
