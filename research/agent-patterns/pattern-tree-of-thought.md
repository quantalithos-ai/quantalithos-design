# Tree-of-Thought (ToT)

> 论文：Yao et al., 2023 (Princeton) — "Tree of Thoughts: Deliberate Problem Solving with Large Language Models"

---

## 核心思想

将推理过程建模为树，探索多条路径，评估后选择最优。

```
                    问题
                   ╱ │ ╲
                思路A 思路B 思路C
                 ↓     ↓     ↓
               评估   评估   评估
               (好)   (差)   (好)
                 ↓     ✗     ↓
              展开A         展开C
              ╱  ╲          ╱  ╲
            A1   A2       C1   C2
             ↓    ✗        ✗    ↓
           最终答案              备选答案
```

## 工作方式

```
1. 生成：对当前状态生成多个候选思路
2. 评估：用 LLM 评估每个思路的质量
3. 搜索：选择最优思路继续展开（BFS 或 DFS）
4. 回溯：如果当前路径不好，回退到上一层选其他思路
```

特点：
- 多次 LLM 调用（生成 + 评估 + 展开）
- 可以回溯（ReAct 不能回溯）
- 探索多种可能性

## 对我们的价值

```
直接价值：低
  ToT 的开销很大（每一步要生成多个候选 + 评估）
  不适合日常任务执行（写代码、跑测试）

潜在价值：中
  适合 TL 在阶段 2 做技术方案选择：
  "方案 A: 用 REST API，方案 B: 用 GraphQL，方案 C: 用 gRPC"
  → 评估每个方案的优劣
  → 选择最优方案

  但 Phase 1 不需要，可以用普通 ReAct + CoT 替代。
```

## 参考

- 论文：https://arxiv.org/abs/2305.10601
