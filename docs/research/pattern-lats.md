# LATS (Language Agent Tree Search)

> 论文：Zhou et al., 2023 — "Language Agent Tree Search Unifies Reasoning Acting and Planning in Language Models"

---

## 核心思想

将蒙特卡洛树搜索（MCTS）应用到 Agent 决策中。Agent 在每一步探索多个可能的行动，评估结果，选择最优路径，失败时回溯。

```
                        当前状态
                       ╱    │    ╲
                  Action A  Action B  Action C
                    ↓         ↓         ↓
                 State A   State B   State C
                  评分:0.8   评分:0.3   评分:0.7
                    ↓         ✗         ↓
               继续探索 A           继续探索 C
               ╱      ╲           ╱      ╲
            A→D      A→E       C→F      C→G
           评分:0.9  评分:0.4  评分:0.6  评分:0.8
              ↓        ✗        ✗        ↓
           选择 A→D                   备选 C→G
```

## 工作方式

```
1. Selection（选择）：从根节点选择最有前途的路径
2. Expansion（扩展）：在选中的节点生成新的候选行动
3. Simulation（模拟）：用 LLM 评估每个行动的预期结果
4. Backpropagation（回传）：将评估结果回传到父节点
5. 重复直到找到满意的解决方案
```

特点：
- 可以回溯（ReAct 不能）
- 探索多条路径（ReAct 只走一条）
- 有全局最优的趋势（不是贪心）
- 开销大（每步要探索多个候选）

## 与 ReAct / ToT 的对比

```
ReAct：一条路走到底，不回溯
  A → B → C → D（如果 D 失败，只能在 D 上重试）

ToT：探索多条路径，但没有评估反馈
  探索 A/B/C → 评估 → 选最优 → 继续

LATS：探索 + 评估 + 回溯 + 反馈
  探索 A/B/C → 评估 → 选 A → 探索 A→D/A→E → 评估
  → A→D 失败 → 回溯到 C → 探索 C→F/C→G → 成功
```

## 对我们的价值

```
直接价值：低
  LATS 的开销太大（每步探索多个候选 × 评估 × 回溯）
  不适合日常编码任务

潜在价值：中
  适合复杂调试场景（阶段 3 的 debugging_workflow）：
  "BUG 可能是 A 原因、B 原因、C 原因"
  → 分别探索每个原因
  → 评估哪个最可能
  → 验证 → 不对 → 回溯尝试其他原因

  但 Phase 1 不需要，用 ReAct + 系统化调试流程替代。
```

## 参考

- 论文：https://arxiv.org/abs/2310.04406
