# A2A — Agent-to-Agent Protocol

> Google 2025 年发布，已捐赠 Linux Foundation，150+ 组织支持
> 对我们的价值：NodeAssignment/NodeResult 应参考 A2A Task 模型，未来支持外部 Agent 接入

---

## 一、概述

A2A 解决的核心问题：**不同框架构建的 Agent 之间如何互相发现、认证和协作。**

```
没有 A2A：
  LangGraph Agent 不能和 CrewAI Agent 协作
  每个框架是孤岛

有了 A2A：
  任何框架的 Agent 都可以通过 A2A 协议互相委托任务
  Agent A（LangGraph）→ A2A → Agent B（CrewAI）
```

与 MCP 的区别：
```
MCP：Agent ←→ 工具（人和锤子的关系）
A2A：Agent ←→ Agent（人和人的关系）

MCP 解决：Agent 怎么用工具
A2A 解决：Agent 怎么和其他 Agent 协作
```

## 二、核心概念

### 2.1 Agent Card（Agent 能力描述）

每个 Agent 发布一个 Agent Card，描述自己的能力：

```json
{
  "name": "Backend Developer",
  "description": "负责后端编码实现和 API 开发",
  "url": "https://agents.example.com/backend-dev",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "skills": [
    {
      "id": "implement_feature",
      "name": "实现功能",
      "description": "按任务卡要求实现后端功能",
      "inputModes": ["text"],
      "outputModes": ["text", "file"]
    },
    {
      "id": "fix_bug",
      "name": "修复缺陷",
      "description": "复现、定位、修复 BUG",
      "inputModes": ["text"],
      "outputModes": ["text", "file"]
    }
  ],
  "authentication": {
    "schemes": ["bearer"]
  }
}
```

与我们的对比：
```
A2A Agent Card          我们的 RoleDefinition
─────────────────────────────────────────────
name                    role_name
description             description
skills                  tools + workflows
capabilities            （我们没有显式声明）
authentication          （由 gate 统一处理）
```

### 2.2 Task（跨 Agent 任务委托）

A2A 的核心交互单元是 Task：

```json
// Client Agent 创建 Task
POST /tasks/send
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "id": "task-003",
    "message": {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "实现文章标签系统，支持多标签"
        }
      ]
    }
  }
}

// Server Agent 返回结果
{
  "jsonrpc": "2.0",
  "result": {
    "id": "task-003",
    "status": {
      "state": "completed"
    },
    "artifacts": [
      {
        "name": "implementation_result",
        "parts": [
          {
            "type": "text",
            "text": "标签系统实现完成，3 个文件修改，12 个测试通过"
          }
        ]
      }
    ]
  }
}
```

Task 的状态机：
```
submitted → working → input-required → completed
                │                         │
                └── failed ───────────────┘
```

### 2.3 与我们的 NodeAssignment/NodeResult 对比

```
A2A Task                    我们的 NodeAssignment + NodeResult
──────────────────────────────────────────────────────────────
Task.id                     assignment_id
Task.message                action（自然语言任务描述）
Task.status.state           NodeResult.result_type
Task.artifacts              NodeResult.output
Task.status = input-required 等待用户输入（我们的门禁/ask_teammate）

关键差异：
  A2A：一个 Task 对象，状态在 Task 上流转
  我们：分成两个对象（Assignment 下发 + Result 上报）

  A2A：消息格式是 parts（text/file/data）
  我们：action 是纯文本，output 是 JSON

  A2A：支持流式更新（SSE）
  我们：Phase 1 不支持，Phase 2 通过 WebSocket
```

## 三、兼容方案

### 3.1 短期（Phase 1）：不兼容，但设计上预留

```
Phase 1 不实现 A2A，但确保：
  - NodeAssignment 的字段可以映射到 A2A Task
  - NodeResult 的字段可以映射到 A2A Task.artifacts
  - 未来加一个适配层就能兼容
```

### 3.2 中期（Phase 2）：A2A 适配层

```
外部 A2A Agent                    我们的系统
     │                               │
     │  A2A Task                      │
     │ ──────────────────────────>    │
     │                               │
     │                    ┌──────────┴──────────┐
     │                    │  A2A Adapter         │
     │                    │                      │
     │                    │  A2A Task             │
     │                    │    → NodeAssignment   │
     │                    │                      │
     │                    │  NodeResult           │
     │                    │    → A2A Task.artifacts│
     │                    └──────────┬──────────┘
     │                               │
     │  A2A Task (completed)          │
     │ <──────────────────────────    │
```

### 3.3 长期（Phase 3）：我们的 Agent 也发布 Agent Card

```
外部系统可以通过 A2A 协议调用我们的 Agent：
  - 发布 Agent Card（描述每个角色的能力）
  - 接收 A2A Task → 转换为 NodeAssignment → 执行 → 返回 A2A Task
  - 支持 Agent 发现（/.well-known/agent.json）
```

## 四、参考

- GitHub：https://github.com/google/A2A
- 规范：https://google.github.io/A2A/
- 深度分析：https://justin3go.com/en/posts/2025/04/10-in-depth-research-report-google-agent2agent-a2a-protocol
- 协议对比论文：https://arxiv.org/abs/2505.02279
