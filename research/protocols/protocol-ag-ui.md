# AG-UI — Agent-User Interaction Protocol

> CopilotKit 发布，LangGraph/CrewAI/Oracle/Microsoft 已接入
> 对我们的价值：chat↔runtime/flow 的实时通信协议参考

---

## 一、概述

AG-UI 解决的核心问题：**Agent 在执行过程中，如何把实时状态反馈给用户界面。**

```
没有 AG-UI：
  用户发送消息 → 等待 → 等待 → 等待 → 收到最终结果
  中间发生了什么完全不知道

有了 AG-UI：
  用户发送消息
    → Agent 开始思考（实时反馈）
    → Agent 调用工具 file_write（用户看到）
    → Agent 调用工具 code_execute（用户看到执行结果）
    → Agent 完成（用户看到最终结果）
```

与 MCP/A2A 的关系：
```
MCP：Agent ←→ 工具（后端）
A2A：Agent ←→ Agent（后端）
AG-UI：Agent ←→ 用户界面（前端）

三个协议覆盖了 Agent 的三个通信方向
```

## 二、17 种事件类型

```
┌─────────────────────────────────────────────────────────────┐
│  生命周期事件                                                │
├─────────────────────────────────────────────────────────────┤
│  RUN_STARTED        Agent 开始执行                          │
│  RUN_FINISHED       Agent 执行完成                          │
│  RUN_ERROR          Agent 执行出错                          │
│  STEP_STARTED       工作流步骤开始                           │
│  STEP_FINISHED      工作流步骤完成                           │
├─────────────────────────────────────────────────────────────┤
│  消息流事件                                                  │
├─────────────────────────────────────────────────────────────┤
│  TEXT_MESSAGE_START  文本消息开始（流式）                     │
│  TEXT_MESSAGE_CONTENT 文本消息内容片段（流式）                │
│  TEXT_MESSAGE_END    文本消息结束                            │
├─────────────────────────────────────────────────────────────┤
│  工具调用事件                                                │
├─────────────────────────────────────────────────────────────┤
│  TOOL_CALL_START     工具调用开始（用户看到 Agent 在做什么）  │
│  TOOL_CALL_ARGS      工具调用参数（流式）                    │
│  TOOL_CALL_END       工具调用结束                            │
├─────────────────────────────────────────────────────────────┤
│  状态事件                                                    │
├─────────────────────────────────────────────────────────────┤
│  STATE_SNAPSHOT      完整状态快照                            │
│  STATE_DELTA         状态增量更新（补丁）                    │
├─────────────────────────────────────────────────────────────┤
│  自定义事件                                                  │
├─────────────────────────────────────────────────────────────┤
│  CUSTOM              自定义事件（扩展用）                    │
├─────────────────────────────────────────────────────────────┤
│  交互事件                                                    │
├─────────────────────────────────────────────────────────────┤
│  MESSAGES_SNAPSHOT   完整消息历史快照                        │
│  RAW                 原始事件（透传）                        │
└─────────────────────────────────────────────────────────────┘
```

## 三、与我们的场景映射

```
AG-UI 事件                    我们的场景
──────────────────────────────────────────────────────────────

RUN_STARTED                   Agent 收到 NodeAssignment，开始执行
RUN_FINISHED                  Agent 提交 NodeResult
RUN_ERROR                     Agent 执行失败

STEP_STARTED                  AgentWorkflowEngine 推进到新节点
STEP_FINISHED                 AgentWorkflowEngine 节点完成

TEXT_MESSAGE_START/CONTENT/END Agent 在群聊中发言（流式输出）

TOOL_CALL_START               Agent 调用 file_write / code_execute
TOOL_CALL_ARGS                工具参数（用户看到 Agent 在写什么文件）
TOOL_CALL_END                 工具执行完成（用户看到结果）

STATE_SNAPSHOT                项目进度完整快照（Pipeline + 当前阶段）
STATE_DELTA                   工单状态变更（TASK-003: in_review → completed）

CUSTOM                        门禁审批卡片（GateCard）
                              任务分配通知
                              阶段推进通知
```

## 四、对 chat 前端的影响

### 4.1 当前设计（Phase 1 轮询）

```
chat 每 3 秒轮询一次：
  GET /api/projects/blog/workitems?status=changed_since=...
  GET /api/flow/assignments/current

问题：
  - 延迟高（最多 3 秒）
  - 看不到 Agent 的实时执行过程
  - 看不到工具调用
```

### 4.2 Phase 2 设计（参考 AG-UI）

```
chat 通过 WebSocket 接收事件流：

Agent 开始执行 TASK-003：
  → RUN_STARTED { agent: "backend-dev-1", node: "implement" }
  → 用户看到："后端开发-1 开始执行 TASK-003"

Agent 写代码：
  → TOOL_CALL_START { tool: "file_write", file: "src/models/tag.rs" }
  → 用户看到："后端开发-1 正在编写 src/models/tag.rs"
  → TOOL_CALL_END { result: "success" }

Agent 跑测试：
  → TOOL_CALL_START { tool: "code_execute", command: "cargo test" }
  → 用户看到："后端开发-1 正在运行测试"
  → TOOL_CALL_END { result: "12 passed, 0 failed" }
  → 用户看到："测试通过 ✅"

Agent 完成：
  → RUN_FINISHED { result_type: "completed" }
  → STATE_DELTA { workitem: "TASK-003", status: "in_review" }
  → 用户看到看板自动更新

门禁审批：
  → CUSTOM { type: "gate_card", gate: { title: "需求评审确认", ... } }
  → 用户看到审批卡片
```

### 4.3 实现方案

```
gate WebSocket 的事件格式参考 AG-UI：

{
  "type": "TOOL_CALL_START",       // AG-UI 事件类型
  "timestamp": "2026-04-20T14:32:00Z",
  "data": {
    "agent_id": "backend-dev-1",
    "project_id": "blog",
    "tool": "file_write",
    "args": {
      "path": "src/models/tag.rs"
    }
  }
}

chat 前端按事件类型渲染不同的 UI：
  RUN_STARTED → 系统消息"Agent 开始执行"
  TOOL_CALL_* → 工具调用卡片（可折叠）
  TEXT_MESSAGE_* → 消息气泡（流式渲染）
  STATE_DELTA → 看板/进度自动更新
  CUSTOM(gate_card) → 门禁审批卡片
```

## 五、Phase 分期

| Phase | 范围 |
|-------|------|
| Phase 1 | 不实现 AG-UI，chat 用轮询 |
| Phase 2 | gate WebSocket 事件格式参考 AG-UI，实现核心事件类型 |
| Phase 3 | 完整 AG-UI 兼容，支持第三方 UI 接入 |

## 六、参考

- 协议文档：https://docs.copilotkit.ai/ag-ui-protocol
- 介绍：https://www.copilotkit.ai/blog/introducing-ag-ui-the-protocol-where-agents-meet-users/
