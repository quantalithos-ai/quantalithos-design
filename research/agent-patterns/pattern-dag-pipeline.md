# DAG Pipeline (有向无环图流水线)

> 框架实现：Airflow、Prefect、Dagster、GitHub Actions
> 对我们的价值：阶段 3 多任务并行调度

---

## 核心思想

任务之间有依赖关系，形成有向无环图（DAG）。没有依赖的任务可以并行执行，有依赖的任务必须等前置完成。

```
        TASK-001 (脚手架)
           │
           ▼
        TASK-002 (文章 CRUD)
        ╱          ╲
       ▼            ▼
  TASK-003       TASK-004
  (标签系统)     (评论系统)
       ╲          ╱
        ▼        ▼
        TASK-005 (前端页面)
           │
           ▼
      集成测试
```

## 工作方式

```
1. 构建依赖图（从任务的 dependencies 字段）
2. 找出所有"就绪"任务（依赖全部完成 + 有空闲 Agent）
3. 并行启动就绪任务
4. 任务完成后，重新检查哪些任务变为就绪
5. 重复直到所有任务完成

调度循环：
  while 有未完成任务:
    ready = [t for t in tasks if t.deps_met and t.status == "ready"]
    for task in ready:
      agent = find_available_agent(task)
      if agent:
        dispatch(task, agent)
    wait_for_any_completion()
```

## 与 State Machine 的区别

```
State Machine：
  线性或分支流程（一条路径）
  一次只执行一个节点
  适合：单任务的步骤流程

DAG Pipeline：
  图结构（多条并行路径）
  多个节点可以同时执行
  适合：多任务的并行调度

结合：
  项目级用 DAG（多任务并行）
  每个任务内部用 State Machine（步骤顺序）
```

## 对我们的价值

```
核心价值：高 — 阶段 3 多任务并行调度

我们的 TaskScheduler 就是 DAG Pipeline：
  1. 从 TaskInstance 列表构建依赖图
  2. 按波次调度（wave 1 → wave 2 → ...）
  3. 同一波次内的任务并行执行
  4. 任务完成后检查下一波次是否就绪

BPMN 的 Parallel Gateway 也是 DAG 的一种表达：
  fork → 多个并行分支 → join
  = DAG 中的并行路径
```

## 参考

- Apache Airflow DAG
- GitHub Actions job dependencies
- 我们的 TaskScheduler 设计（flow 概要设计第六章）
