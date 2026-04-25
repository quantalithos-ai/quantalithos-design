# 持久执行（Durable Execution）

> 来源：Temporal, Inngest, Diagrid 分析
> 对我们的价值：flow daemon 从"手动快照"升级为"自动持久化 + 崩溃恢复"

---

## 一、Checkpoint ≠ 持久执行

```
Checkpoint（LangGraph/CrewAI 的做法）：
  在特定时间点保存状态
  崩溃后从 checkpoint 恢复
  
  问题：
  - 需要手动决定何时保存
  - checkpoint 之间的操作可能丢失
  - 恢复后可能重复执行已完成的操作

持久执行（Temporal 的做法）：
  运行时自动记录每一步操作
  崩溃后自动从精确位置恢复
  已完成的操作不会重复执行
  
  类比：
  Checkpoint = 游戏手动存档（忘了存就丢进度）
  持久执行 = 游戏自动存档（每一步都自动保存）
```

## 二、Temporal 的持久执行模型

```
Temporal Workflow：

@workflow.defn
class ProjectWorkflow:
    @workflow.run
    async def run(self, project_id: str):
        # 每个 await 都是一个持久化点
        # 如果这里崩溃，重启后从这里继续
        
        alignment = await workflow.execute_activity(
            goal_alignment, args=[project_id]
        )
        
        # 如果这里崩溃，alignment 的结果已经持久化
        # 重启后不会重新执行 goal_alignment
        
        requirement = await workflow.execute_activity(
            requirement_analysis, args=[project_id, alignment]
        )
        
        # 等待用户确认（可以等几天）
        await workflow.wait_condition(
            lambda: self.user_confirmed
        )
        
        # 用户确认后继续
        design = await workflow.execute_activity(
            design_and_planning, args=[project_id, requirement]
        )

关键特性：
  1. 每个 Activity 的结果自动持久化
  2. 崩溃重启后，已完成的 Activity 不重复执行
  3. wait_condition 可以等待任意长时间（天/周/月）
  4. Activity 自动重试（可配置重试策略）
```

## 三、与我们的 flow daemon 对比

```
当前设计：
  daemon 在内存中维护 ProcessInstance
  阶段切换时手动保存快照到 snapshots/workflow/
  崩溃后从快照恢复

问题：
  1. 快照之间的操作丢失
     daemon 下发了 NodeAssignment 但还没收到 NodeResult
     → 崩溃 → 恢复后不知道这个 Assignment 的状态
     → 可能重复下发

  2. 门禁等待期间崩溃
     用户还没确认 PRD，daemon 崩溃
     → 恢复后不知道门禁状态
     → 可能重新发送审批卡片

  3. 并行任务状态丢失
     5 个任务并行执行，3 个完成了 2 个还在跑
     → 崩溃 → 恢复后不知道哪些完成了
```

## 四、升级方案

### Phase 1：每步写入状态文件

```
最简单的持久执行：每次状态变更都写入文件

daemon 下发 NodeAssignment：
  → 写入 snapshots/workflow/current.yaml
  → 记录 assignment_id + 状态 = "dispatched"

daemon 收到 NodeResult：
  → 更新 current.yaml
  → 记录 assignment_id + 状态 = "completed"

daemon 崩溃重启：
  → 读取 current.yaml
  → 检查每个 assignment 的状态
  → dispatched 但没有 completed → 查询 runtime 确认状态
  → 从精确位置继续
```

### Phase 2：引入事件日志（Event Sourcing）

```
不只保存当前状态，保存所有事件：

events.jsonl:
  {"type": "assignment_dispatched", "assignment_id": "a-042", "agent_id": "be-1", "ts": "..."}
  {"type": "result_received", "assignment_id": "a-042", "result_type": "completed", "ts": "..."}
  {"type": "node_advanced", "from": "implement", "to": "code_review", "ts": "..."}
  {"type": "assignment_dispatched", "assignment_id": "a-043", "agent_id": "tl", "ts": "..."}

恢复时：
  重放事件日志 → 重建完整状态
  → 不丢失任何操作
```

### Phase 3：引入 Temporal

```
把 flow daemon 的核心逻辑迁移到 Temporal Workflow：
  - 每个项目是一个 Temporal Workflow
  - 每个 NodeAssignment 是一个 Activity
  - 门禁等待用 Signal
  - 自动持久化 + 崩溃恢复 + Activity 重试
```

## 五、Phase 分期

| Phase | 范围 |
|-------|------|
| Phase 1 | 每步写入状态文件（current.yaml） |
| Phase 2 | 事件日志（Event Sourcing） |
| Phase 3 | Temporal 持久执行 |

## 六、参考

- Inngest 分析：https://www.inngest.com/blog/durable-execution-key-to-harnessing-ai-agents
- Diagrid 对比：https://www.diagrid.io/blog/checkpoints-are-not-durable-execution
- Temporal + AI：https://temporal.io/blog/building-durable-agents-with-temporal-and-ai-sdk-by-vercel
