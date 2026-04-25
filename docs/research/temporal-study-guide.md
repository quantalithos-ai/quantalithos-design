# Temporal 调研

> 分布式工作流引擎，持久化执行
> 对我们的价值：长时间运行的工作流、崩溃恢复、等待人类操作

---

## 一、定位

Temporal 不是 AI Agent 框架，是通用的分布式工作流引擎。核心思想是**工作流 = 代码，执行状态自动持久化**。

与 BPMN 引擎（如 Camunda）的区别：
- BPMN：工作流用 XML/YAML 定义，引擎解释执行
- Temporal：工作流用代码定义，引擎保证持久化执行

## 二、核心概念

### 2.1 Workflow（工作流）

```python
from temporalio import workflow

@workflow.defn
class ProjectStartupWorkflow:
    @workflow.run
    async def run(self, user_request: str) -> dict:
        # 步骤 1：识别意图
        intent = await workflow.execute_activity(
            identify_intent,
            user_request,
            start_to_close_timeout=timedelta(minutes=5),
        )

        # 步骤 2：收集信息（可能需要等待用户）
        context = await workflow.execute_activity(
            collect_context,
            intent,
            start_to_close_timeout=timedelta(hours=24),  # 等用户最多 24 小时
        )

        # 步骤 3：创建项目
        project = await workflow.execute_activity(
            create_project,
            context,
            start_to_close_timeout=timedelta(minutes=5),
        )

        return project
```

关键：**这就是普通的 Python 代码**，但 Temporal 保证：
- 每一步执行后自动保存状态
- 进程崩溃后从上次保存的状态恢复
- 不会重复执行已完成的步骤

### 2.2 Activity（活动）

```python
from temporalio import activity

@activity.defn
async def identify_intent(user_request: str) -> str:
    """调用 LLM 判断意图 — 这是一个 Activity"""
    response = await llm.chat([
        {"role": "user", "content": user_request}
    ])
    return response.content

@activity.defn
async def collect_context(intent: str) -> dict:
    """收集项目信息 — 可能需要等待用户输入"""
    # 发送消息给用户
    await send_message_to_user("请提供项目信息：名称、技术栈、功能需求")
    # 等待用户回复（Temporal 会持久化等待状态）
    user_reply = await wait_for_user_reply(timeout=timedelta(hours=24))
    return parse_context(user_reply)
```

Activity 的特点：
- 可重试（失败后自动重试，可配置策略）
- 有超时（start_to_close_timeout）
- 可以是任何操作（LLM 调用、API 调用、等待人类）

### 2.3 Signal（外部信号）

```python
@workflow.defn
class ProjectWorkflow:
    def __init__(self):
        self.user_reply = None

    @workflow.signal
    async def receive_user_reply(self, reply: str):
        """接收用户回复 — 外部通过 Signal 发送"""
        self.user_reply = reply

    @workflow.run
    async def run(self, request: str):
        # 等待用户回复
        await send_question_to_user("请确认申请表")
        await workflow.wait_condition(lambda: self.user_reply is not None)
        # self.user_reply 现在有值了
        if self.user_reply == "confirm":
            await workflow.execute_activity(create_project, ...)
```

Signal 的工作方式：
- 工作流在 `wait_condition` 处暂停
- 外部系统（如 chat）通过 Signal 发送数据
- 工作流从暂停处恢复继续
- 等待期间进程可以重启，状态不丢失

### 2.4 持久化执行

```
Temporal 的持久化机制：

  Workflow 代码执行
      │
      ├── execute_activity(step_1) → 结果保存到 Temporal Server
      │                               │
      │   ← 进程崩溃 →                │
      │                               │
      ├── 进程重启                     │
      │   Temporal 重放 Workflow 代码  │
      │   step_1 已有结果 → 跳过       │
      │                               │
      ├── execute_activity(step_2) → 继续执行
      │
      └── ...

  关键：Workflow 代码会被"重放"（replay），
  但已完成的 Activity 不会重新执行，直接用保存的结果。
```

## 三、对我们项目的启示

### 3.1 Temporal 的 Workflow = 我们的 ProcessDefinition

```
Temporal：
  工作流 = Python 代码（函数调用顺序 = 流程）
  步骤 = Activity（可重试、有超时）
  状态 = 自动持久化

我们：
  工作流 = ProcessDefinition（YAML，nodes + edges）
  步骤 = ActivityNode（Agent 执行）
  状态 = ProcessInstance.node_states

区别：
  Temporal 的流程是代码，我们的流程是配置
  Temporal 的持久化是自动的，我们需要手动保存快照
  Temporal 的重试是内置的，我们需要自己实现
```

### 3.2 Signal 解决了"等待用户"的问题

```
我们的场景：
  Assistant 问用户"请确认申请表" → 等待用户回复
  门禁审批 → 等待用户点击确认

Temporal 的方案：
  workflow.wait_condition() → 暂停
  外部 Signal → 恢复

我们可以借鉴：
  AgentWorkflowEngine 在等待用户时暂停
  用户回复通过某种机制（API 调用）触发恢复
  等待期间状态持久化（不怕进程重启）
```

### 3.3 是否直接用 Temporal？

```
优点：
  - 持久化执行开箱即用
  - 重试、超时、Signal 都是内置的
  - 生产级可靠性

缺点：
  - 需要部署 Temporal Server（额外的基础设施）
  - 工作流是代码不是配置（不能用 YAML 定义）
  - 学习曲线
  - 和我们的 BPMN ProcessDefinition 格式不兼容

结论：
  Phase 1 不用 Temporal，自己实现轻量版
  Phase 3 如果需要生产级持久化，可以考虑引入
  或者借鉴 Temporal 的 Signal 和重放机制
```

## 四、参考

- 官方文档：https://docs.temporal.io/
- Python SDK：https://github.com/temporalio/sdk-python
- Temporal 与 AI Agent：https://temporal.io/ai
