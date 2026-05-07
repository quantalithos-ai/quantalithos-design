# Debate / Discussion

> 论文：Du et al., 2023 — "Improving Factuality and Reasoning in Language Models through Multiagent Debate"
> 框架实现：AutoGen GroupChat、ChatDev

---

## 核心思想

多个 Agent 对同一个问题发表不同观点，通过辩论/讨论达成共识。每个 Agent 看到其他人的观点后可以修正自己的看法。

```
Round 1：
  Agent A："标签系统建议用多对多关联表"
  Agent B："我觉得用 JSON 数组更简单"
  Agent C："JSON 数组查询性能差，关联表更好"

Round 2：
  Agent A："同意 C 的观点，关联表 + 索引性能好"
  Agent B："被说服了，关联表确实更合适"
  Agent C："补充一点，需要加唯一索引防止重复"

共识：用多对多关联表 + 唯一索引
```

## 工作方式

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Agent A │  │ Agent B │  │ Agent C │
│ 后端视角 │  │ 前端视角 │  │ 测试视角 │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     ▼            ▼            ▼
  观点 A       观点 B       观点 C
     │            │            │
     └────────────┼────────────┘
                  │
                  ▼ 所有人看到所有观点
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
  修正 A'      修正 B'      修正 C'
     │            │            │
     └────────────┼────────────┘
                  │
                  ▼
              达成共识
```

特点：
- 多视角（不同角色看到不同问题）
- 自我修正（看到别人观点后改变看法）
- 涌现智慧（群体讨论 > 个体思考）

## 对我们的价值

```
核心价值：高 — 映射到我们的 session（collaboration 模式）

我们的头脑风暴（阶段 1 brainstorm）就是 Debate 模式：
  TL、后端、前端、测试各自发表观点
  看到别人的观点后补充或修正
  TL（moderator）总结共识

我们的设计评审（阶段 2 design_review）也是：
  全员审查技术方案
  从各自角色角度提出问题
  讨论后达成共识

与 AutoGen GroupChat 的区别：
  AutoGen：LLM 决定谁发言（speaker_selection_method="auto"）
  我们：free 模式（所有人都能发言）+ moderator 总结
```

## 参考

- 论文：https://arxiv.org/abs/2305.14325
- AutoGen GroupChat
- ChatDev
