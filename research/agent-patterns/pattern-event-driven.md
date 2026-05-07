# Event-Driven (事件驱动)

> 框架实现：Temporal (Signal)、LangGraph (interrupt)、BPMN (Event)
> 对我们的价值：门禁审批、等待用户输入、Agent 间异步通信

---

## 核心思想

系统不主动轮询，而是等待事件发生后再响应。事件可以来自用户操作、外部系统、定时器等。

```
流程执行中
    │
    │ 到达等待点
    ▼
┌──────────────┐
│  等待事件    │  ← 暂停执行，保存状态
│              │
│  可能的事件：│
│  - 用户确认  │
│  - 超时      │
│  - 外部回调  │
└──────┬───────┘
       │ 事件到达
       ▼
继续执行
```

## 工作方式

```
事件源：
  1. 用户操作（点击确认/驳回）
  2. 定时器（超时触发）
  3. 外部系统（CI 构建完成、API 回调）
  4. 其他 Agent（ask_teammate 回复）

等待机制：
  - Temporal: Signal + wait_condition
  - LangGraph: interrupt() + checkpoint
  - BPMN: Intermediate Catch Event

恢复机制：
  事件到达 → 查找等待该事件的流程实例 → 恢复执行
```

## 各框架的实现

```
Temporal:
  @workflow.signal
  async def user_replied(self, reply):
      self.reply = reply

  await workflow.wait_condition(lambda: self.reply is not None)

LangGraph:
  response = interrupt({"question": "请确认"})
  # 外部调用 graph.invoke({"user_response": "confirm"}) 恢复

BPMN:
  <intermediateCatchEvent>
    <messageEventDefinition messageRef="user_confirm"/>
  </intermediateCatchEvent>
```

## 对我们的价值

```
核心价值：高 — 多个场景需要事件驱动

1. 门禁审批
   flow 发送 GateCard → 等待用户操作
   用户点击确认 → 事件到达 → flow 恢复推进

2. Assistant 等待用户回复
   Assistant 问"需要哪些功能？" → 等待用户输入
   用户回复 → 事件到达 → Assistant 继续处理

3. ask_teammate
   Agent A 问 Agent B 问题 → 等待 B 回复
   B 回复 → 事件到达 → A 继续执行

4. 外部系统回调
   触发 CI 构建 → 等待构建完成
   CI 回调 → 事件到达 → 继续流程

5. 超时处理
   等待用户确认 → 72 小时未操作
   定时器事件 → 项目暂停

我们的实现：
  Phase 1：轮询（简单但不优雅）
  Phase 2：WebSocket 事件推送
  Phase 3：考虑引入 Temporal 的 Signal 机制
```

## 参考

- Temporal Signal
- LangGraph interrupt
- BPMN 2.0 Event 体系
- 我们的门禁系统设计（flow 概要设计第八章）
