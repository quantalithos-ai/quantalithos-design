# Plan-and-Execute

> 论文：Wang et al., 2023 — "Plan-and-Solve Prompting"
> LangGraph 实现：Plan-and-Execute Agent

---

## 核心思想

先让 LLM 制定完整计划，再按计划逐步执行。执行中发现问题可以回到规划阶段修正。

```
Phase 1 — Plan（规划）：
  LLM 生成计划：
  1. 创建 tags 表模型
  2. 创建 article_tags 关联表
  3. 实现 CRUD API
  4. 写单元测试
  5. 跑测试验证

Phase 2 — Execute（执行）：
  按计划逐步执行，每步用 ReAct 模式
  Step 1: 创建 tags 表模型 → file_write → 完成
  Step 2: 创建关联表 → file_write → 完成
  Step 3: 实现 API → file_write × 3 → 完成
  Step 4: 写测试 → file_write → 完成
  Step 5: 跑测试 → code_execute → 2 failed!

Phase 3 — Replan（修正）：
  测试失败了，回到规划：
  修正计划：
  5.1 修复 tag_name 唯一约束
  5.2 重新跑测试
```

## 工作方式

```
┌──────────┐     ┌──────────────────────────┐
│  Planner │────>│  Executor (ReAct 循环)    │
│  (LLM)   │     │                          │
│          │     │  Step 1 → Step 2 → ...   │
│  生成计划 │     │                          │
└──────────┘     └────────────┬─────────────┘
     ↑                        │
     │    执行失败或需要修正    │
     └────────────────────────┘
```

特点：
- 两阶段：先规划后执行
- 有全局视野（ReAct 没有）
- 可以修正计划（不是一成不变）
- Planner 和 Executor 可以是不同的 LLM

## 与 ReAct 的对比

```
ReAct：
  想一步做一步，没有全局计划
  优点：灵活，每步都能调整
  缺点：可能走弯路，没有全局最优

Plan-and-Execute：
  先想好全部步骤，再逐步执行
  优点：有全局视野，步骤更合理
  缺点：计划可能不准确，需要修正机制
```

## 对我们的价值

```
核心价值：高 — 映射到我们的两层设计

我们的 TL 在阶段 2 做的事 = Plan 阶段：
  TL 分析需求 → 设计方案 → 拆解任务 → 生成任务列表
  这就是"制定计划"

我们的 flow 在阶段 3 做的事 = Execute 阶段：
  按任务列表逐个分配给 Agent 执行
  每个任务用 ReAct 模式完成

我们的回退机制 = Replan：
  代码审查不通过 → 回到开发
  测试失败 → 回到开发
  用户验收不通过 → 可能回到阶段 2 重新规划

所以我们的整体架构就是 Plan-and-Execute 模式：
  阶段 2 = Plan
  阶段 3 = Execute（每个任务内部用 ReAct）
  回退 = Replan
```

## 参考

- 论文：https://arxiv.org/abs/2305.04091
- LangGraph 实现：https://langchain-ai.github.io/langgraph/tutorials/plan-and-execute/plan-and-execute/
