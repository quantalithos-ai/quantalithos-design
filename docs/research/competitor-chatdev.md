# ChatDev 竞品分析

> GitHub: https://github.com/OpenBMB/ChatDev (⭐ 26k+)
> 论文: ChatDev 2.0: Multi-Agent Software Development through Cross-Team Collaboration (arxiv 2406.08979)
> 对我们的价值：聊天链（Chat Chain）概念、经验池（Experience Pool）

---

## 一、概述

ChatDev 模拟一个虚拟软件公司，Agent 之间通过**对话**协作完成软件开发。

```
ChatDev 的核心流程（Chat Chain）：

CEO ←→ CPO（需求讨论）
    │
    ▼
CEO ←→ CTO（技术方案讨论）
    │
    ▼
CTO ←→ Programmer（编码讨论）
    │
    ▼
Programmer ←→ Art Designer（UI 设计讨论）
    │
    ▼
CTO ←→ Tester（测试讨论）
    │
    ▼
产出：完整的软件项目
```

## 二、核心设计

### 2.1 Chat Chain（聊天链）

```
ChatDev 的每个阶段是一个"聊天"：
  两个 Agent 之间进行多轮对话
  对话有明确的目标和终止条件
  对话结束后产出结构化结果

例：CTO ←→ Programmer 的编码对话
  CTO："请实现标签系统，接口如下..."
  Programmer："好的，我先写模型..."
  CTO："模型看起来不错，但缺少唯一约束"
  Programmer："已添加，请审查"
  CTO："通过"
  → 产出：代码文件
```

与我们的对比：
```
ChatDev Chat Chain          我们的设计
─────────────────────────────────────────────────
两人对话                    session（多人讨论）或 solo（单人执行）
对话驱动                    NodeAssignment 驱动
对话终止 = 阶段完成         submit_step_result = 节点完成
线性链                      BPMN 图（支持分支、并行）
```

### 2.2 Experience Pool（经验池）— ChatDev 2.0

```
ChatDev 2.0 的核心创新：

Agent 完成项目后，把经验存入经验池：
  - 成功的代码模式
  - 失败的教训
  - 技术决策

下一个项目开始时，从经验池检索相关经验注入 prompt：
  "上次做标签系统时，用多对多关联表效果好"
  "上次忘了加唯一索引导致 BUG"
```

与我们的对比：
```
ChatDev Experience Pool     我们的设计
─────────────────────────────────────────────────
经验池                      长期记忆（Phase 3 向量库）
项目级经验                  Agent 级经验（每个角色积累自己的经验）
简单检索                    反思式检索（arxiv 2512.20237）
只存成功经验                成功 + 失败经验（arxiv 2509.25370）
```

### 2.3 Cross-Team Collaboration（跨团队协作）

```
ChatDev 2.0 支持多个"公司"协作：
  Company A 负责后端
  Company B 负责前端
  两个公司之间通过"联络人"沟通

与我们的对比：
  我们不需要跨团队 — 所有 Agent 在同一个项目群聊里
  但如果未来支持多项目并行，可以参考跨团队的通信机制
```

## 三、ChatDev 的局限性

```
┌──────────────────────┬──────────────────┬──────────────────────┐
│ 维度                 │ ChatDev          │ Quantalithos AI      │
├──────────────────────┼──────────────────┼──────────────────────┤
│ 协作方式             │ 两人对话链        │ 多人群聊 + 单人执行   │
│ 流程控制             │ 线性 Chat Chain   │ BPMN 图（分支/并行） │
│ 人在回路             │ 无               │ 5 级自主性门禁        │
│ 可视化               │ CLI 输出         │ 飞书式群聊 + 看板     │
│ 持久化               │ 无               │ 快照 + 持久执行       │
│ 经验积累             │ Experience Pool  │ 三层记忆 + 向量库     │
│ 工具系统             │ 代码执行         │ MCP 兼容 + 多种工具   │
└──────────────────────┴──────────────────┴──────────────────────┘
```

## 四、可借鉴的设计

```
1. Chat Chain 的对话终止机制
   ChatDev 用"<INFO> xxx </INFO>"标签标记对话结束
   我们用 submit_step_result 工具更优雅（function calling 保证格式）

2. Experience Pool
   ChatDev 2.0 的经验池是我们 Phase 3 长期记忆的直接参考
   特别是"失败经验比成功经验更有价值"的洞察

3. 角色间的对话模式
   ChatDev 的两人对话模式适合代码审查场景（TL ←→ 开发）
   我们的 ask_teammate 工具实现了类似功能
```

## 五、参考

- GitHub：https://github.com/OpenBMB/ChatDev
- ChatDev 2.0 论文：https://arxiv.org/html/2406.08979v1
