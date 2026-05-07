# Chain-of-Thought (CoT)

> 论文：Wei et al., 2022 (Google) — "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"

---

## 核心思想

让 LLM 在给出答案前，先逐步展示推理过程。

```
普通 prompt：
  Q: 标签系统需要几张表？
  A: 2 张

CoT prompt：
  Q: 标签系统需要几张表？让我们一步步想。
  A: 让我想想...
     1. 需要一张 tags 表存储标签本身（id, name）
     2. 文章和标签是多对多关系
     3. 多对多关系需要关联表 article_tags（article_id, tag_id）
     所以需要 2 张表：tags + article_tags
```

## 工作方式

```
用户问题
    │
    ▼
LLM 逐步推理（一次调用）
    │
    ├── Step 1: 分析问题
    ├── Step 2: 拆解子问题
    ├── Step 3: 逐个解决
    └── Step 4: 综合答案
    │
    ▼
最终答案
```

特点：
- 一次 LLM 调用，不循环
- 不调用工具
- 推理过程在 LLM 输出中可见

## 变体

- Zero-shot CoT：只加"Let's think step by step"
- Few-shot CoT：给几个推理示例
- Auto-CoT：自动生成推理示例

## 对我们的价值

```
直接价值：低
  CoT 是推理技巧，不是 Agent 架构模式。
  我们的 Agent 需要执行操作（写代码、跑测试），不只是推理。

间接价值：中
  Agent 的 system prompt 里可以加入 CoT 引导：
  "在执行操作前，先分析任务需求，列出步骤，再逐步执行。"
  → 提高 Agent 的决策质量
```

## 参考

- 论文：https://arxiv.org/abs/2201.11903
