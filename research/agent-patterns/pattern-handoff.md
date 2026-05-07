# Handoff Chain

> 框架实现：OpenAI Agents SDK (handoff)、Anthropic (tool-based delegation)

---

## 核心思想

Agent 之间通过"交接"转移控制权。当前 Agent 完成自己的部分后，把控制权交给下一个 Agent，同时传递必要的上下文。

```
Agent A (Triage)
  │ "这是一个新项目需求"
  │ handoff → Agent B
  ▼
Agent B (Tech Lead)
  │ "需求分析完成，开始设计"
  │ handoff → Agent C
  ▼
Agent C (Developer)
  │ "代码实现完成"
  │ handoff → Agent D
  ▼
Agent D (Tester)
  │ "测试通过"
  │ 完成
```

## 工作方式

```
Agent A 执行中
    │
    │ LLM 决定：我的部分做完了，应该交给 B
    │
    │ handoff(target=B, context="需求分析结果是...")
    │
    ▼
Agent A 退出
Agent B 启动
  │ 继承 A 的对话历史（或只接收 context）
  │ 开始执行自己的任务
  │
  │ handoff(target=C, context="设计方案是...")
  │
  ▼
Agent B 退出
Agent C 启动
  ...
```

特点：
- 链式传递（A → B → C → D）
- 控制权完全转移（A 交出后不再参与）
- LLM 决定何时交接（半强制）

## 与 Orchestrator-Worker 的区别

```
Orchestrator-Worker：
  中心化 — Orchestrator 始终在场，控制全局
  Worker 完成后结果回到 Orchestrator
  Orchestrator 决定下一步

Handoff Chain：
  去中心化 — 没有全局控制者
  每个 Agent 自己决定交给谁
  控制权单向传递，不回到起点

Orchestrator-Worker 更可控（有全局视野）
Handoff Chain 更简单（不需要中心节点）
```

## 对我们的价值

```
价值：中

映射到 Assistant → TL 的交接：
  Assistant 完成启动流程 → handoff → TL 开始目标校准
  这是一次 Handoff

但我们的整体架构不是 Handoff Chain：
  我们用 Orchestrator-Worker（flow 是编排者）
  Agent 之间不直接 handoff，而是通过 flow 调度

Handoff 适合简单场景（如 Assistant → TL）
不适合复杂场景（如阶段 3 多任务并行）
```

## 参考

- OpenAI Agents SDK handoff
- Anthropic tool-based delegation
