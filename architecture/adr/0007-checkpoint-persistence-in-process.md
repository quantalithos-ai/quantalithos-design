# ADR-0007:Checkpoint 持久化位置 —— 过程域扩展 + 外部 blob 回落

> Status: **Accepted**
> Date: 2026-05-08
> Deciders: Aris
> Consulted: `architecture/ai-member设计.md` §4.8 + §十一 Q2 / `domain/process/README.md` §5.4 + §十 Q1
> Informed: process 仓 / runtime 仓 / observability 仓 / member-service 仓

---

## 1. 背景

AI Member 的 Runtime(L2 大脑)在执行 Activity 时每步产生 Checkpoint(Temporal 持久执行模式,对齐 Research Temporal / LangGraph),用于:

- **崩溃恢复** — Runtime 或容器重启后从 checkpoint 继续,不重跑已完成步
- **可观察性** — checkpoint 链承载 reasoning_trace(42001 可解释性要求)
- **调试与回滚** — 支持 Instance 状态回溯

**但 Checkpoint 数据有两种粒度**:

1. **Runtime 内部 checkpoint(Runtime C7 Checkpoint Store)**:每次 think-act-observe 微步骤的状态(Working Memory 快照 + Goal 栈 + 当前 thought)
2. **Instance 级 checkpoint(process 域 Instance Checkpoint)**:整个 ProcessInstance 的状态(current_activities / pending_gates / active_tokens / current_stage / reasoning_trace_ref)

**这两种 checkpoint 不同粒度,各有作用**:
- Runtime C7 负责**微步恢复**(同一 Activity 内的进度)
- Instance Checkpoint 负责**宏观恢复**(哪些 Activity 已完成,当前 Instance 在图的哪里)

讨论于 `ai-member设计.md` §十一 Q2 和 `domain/process/README.md` §5.4 + §十 Q1 反复出现。本 ADR 落定**Instance 级 Checkpoint** 的持久化位置。

Runtime C7 微步 Checkpoint 的位置由 Runtime 仓内部决策(不涉及跨域边界)。

## 2. 决策

**采用候选 A + 弹性扩展**:

- **Instance 级 Checkpoint 数据**挂在 **process 域**(`process.ProcessInstance.checkpoint` 字段 + `process.checkpoints` 表)
- **大状态(> 256KB)自动外置**到对象存储(S3 / MinIO),PG 表只存 `external_blob_ref`
- **reasoning_trace 本身**存 **observability 仓**,Checkpoint 只存 `reasoning_trace_ref` 引用
- **Runtime C7 微步 Checkpoint** 不跨域,存 Runtime 进程内部 + 崩溃时回传 Instance Checkpoint(通过 Member Process.B3 发事件)

### 2.1 持久化分层

```
[Runtime 微步 Checkpoint]
    位置:Runtime Process 进程内存 + 进程级临时 blob
    粒度:每次 think-act-observe
    生命周期:Activity 完成即清理
    跨域:否(Runtime 内部)

        ↓ Activity 完成时聚合上升为 ↓

[Instance 级 Checkpoint]
    位置:process 域(PG 主 + 外部 blob)
    粒度:每 Activity 完成 / 关键 Gate 转移
    生命周期:Instance 生命周期内保留
    跨域:通过事件对 observability 公开

        ↓ 引用 ↓

[Reasoning Trace]
    位置:observability 仓(append-only + 哈希链)
    粒度:LLM 调用 / Tool 调用级
    生命周期:永久(审计要求)
    跨域:Instance Checkpoint 持引用
```

### 2.2 Instance Checkpoint 数据结构

```
Checkpoint {
    checkpoint_id:            ULID,
    instance_id:              InstanceId,
    parent_checkpoint_id:     Option<ULID>,         // 链式
    snapshot_at:              Timestamp,
    activities_completed_count: i32,

    // 完整状态
    complete_state:           CheckpointState,

    // 存储模式
    storage_mode:             enum {
        inline,                                        // JSONB 直接存(≤ 256KB)
        external,                                      // 外部 blob
    },
    external_blob_ref:        Option<String>,        // 外部 URI

    // 引用
    reasoning_trace_ref:      Option<TraceRef>,      // 指向 observability

    created_at:               Timestamp,
}

CheckpointState {
    instance_state:           InstanceState,
    current_stage:            Option<StageId>,
    current_activities:       Vec<ActivityId>,
    completed_activities:     Vec<ActivityRef>,
    pending_gates:            Vec<GateRef>,
    active_tokens:            Vec<Token>,
    workitem_associations:    Map<ActivityId, Vec<WorkItemRef>>,
    stage_history:            Vec<StageTransitionRecord>,
}
```

### 2.3 写入流程

```
L2 Runtime 完成 Activity
  │
  ▼
Member Process.B3 发 process.activity.completed 事件
  │
  │ process 域订阅
  ▼
CompleteActivity(activity_id, ...) 单事务:
  1. 更新 Activity.state = completed
  2. 更新 Instance.completed_activities / current_activities
  3. 按 BPMN graph 推进下一 Activity(scheduled)
  4. 写 Checkpoint:
     - 若 complete_state 序列化 ≤ 256KB → JSONB inline
     - 否则 → 写 S3 / MinIO,保留 external_blob_ref
  5. 发 process.instance.checkpoint_saved 事件(含 reasoning_trace_ref)
  6. 提交事务

事件 observability 订阅 → 记录 checkpoint_saved + 关联 reasoning_trace
```

### 2.4 恢复流程

```
process 服务重启或崩溃恢复:
  │
  ▼
扫描 active Instance(state ∈ {running, paused})
  │
  ▼
对每个 Instance:
  1. 读最新 Checkpoint(按 checkpoint_id 降序)
  2. 根据 storage_mode 加载 complete_state:
     - inline → 直接从 JSONB 解码
     - external → 从 S3 拉取
  3. 重建 Instance 内存状态
  4. 询问 member-service:current_activities 的容器状态
     - 容器存活 → Runtime 自己从微步 checkpoint 恢复
     - 容器 crashed → Activity 进 retry 或 failed
  5. 发 process.instance.recovered_from_checkpoint 事件
```

## 3. 理由

### 3.1 为什么选 A(process 扩展)

| 维度 | **A process 扩展** | B observability 承载 | C 新 L1 仓 |
|---|---|---|---|
| 语义契合 | ✅ Instance 状态是过程域的核心数据 | ❌ 业务数据与观测数据混淆 | ⚠ 纯技术拆分 |
| 跨域成本 | ✅ 低(本域查本域) | ❌ process 每次查要跨仓 | ❌ 增加新仓 |
| 一致性 | ✅ 强(Activity + Checkpoint 单事务) | ❌ 事件驱动最终一致,恢复复杂 | ⚠ 同 B |
| 演进空间 | ✅ 外部 blob 已提供扩展路径 | ⚠ | ✅ 纯粹 |
| 审计可查 | ✅ 通过 checkpoint_saved 事件到 observability | ✅ 直接在 obs | ⚠ 多一跳 |

**决定因素**:

1. **Checkpoint 是 Instance 的"状态快照",就是过程域的业务数据**(不像 reasoning trace 那样是跨域通用"观测数据")
2. **强一致要求**:Activity 状态转移和 Checkpoint 必须单事务,跨域做不到
3. **恢复场景高频 + 延迟敏感**:崩溃恢复要读最新 Checkpoint,跨域查询延迟不可接受
4. **外部 blob 机制**提供了对大状态的弹性,避免 PG 行超大

### 3.2 为什么不是 B(observability)

- observability 定位是**观测数据**(事件 / 指标 / trace),不是业务数据
- append-only 哈希链不适合频繁 UPDATE 的 Checkpoint(尽管最新 Checkpoint 是追加,但查询时要按 instance_id 最新排序,observability 表结构不适合)
- 混合会让 observability 仓职责膨胀,违反 SRP

### 3.3 为什么不是 C(新 L1 仓)

- Checkpoint 独立成域没有足够的业务语义支撑
- 会打破六域模型的数量稳定性
- 增加新仓的架构成本不抵消"独立"带来的好处

### 3.4 为什么 reasoning_trace 独立存 observability

reasoning_trace 的特性:
- **append-only**(思考历史不改)
- **大量小条目**(每次 LLM 调用 / Tool 调用一条)
- **跨 Activity 可关联**(同一 trace_id 下跨 Activity 的推理)
- **审计永久保留**(42001 可解释性)

这些特性**完全契合 observability 仓的设计**,所以 reasoning_trace 走 observability,Checkpoint 只存引用。

## 4. 后果

### 4.1 正面

- **强一致性保证**:Activity 转移 + Checkpoint 单事务,不丢不乱
- **查询性能**:崩溃恢复无跨域调用,快速
- **语义清晰**:Checkpoint 是过程域业务数据,reasoning_trace 是观测数据,各归其位
- **扩展灵活**:外部 blob 自动托底大状态

### 4.2 负面

- **process 域数据量增长**:每 Activity 一个 Checkpoint,Instance 多 Activity 时 Checkpoint 多
- **外部 blob 引入运维复杂度**:S3 / MinIO 可用性影响恢复
- **Checkpoint 清理策略**需要定义(Instance completed 后 Checkpoint 是否清理?)

### 4.3 风险缓解

- **容量**:Checkpoint 表分区(按月)+ 历史冷存
- **blob 可用性**:多副本 + 异地备份;blob 不可用时降级为 inline(限大小,可能拒绝超大 Instance)
- **清理策略**:Instance completed 后 Checkpoint 保留 90 天,之后归入冷存(archive 仓协调);关键 Checkpoint(经 baseline 的)永久保留

## 5. 约束与边界

### 本 ADR 锁定

- Instance 级 Checkpoint 存 process 域
- 256KB 阈值触发外部 blob
- reasoning_trace 存 observability,Checkpoint 只存引用
- Checkpoint 写入与 Activity 状态转移单事务
- 恢复流程从 Checkpoint 读取,不依赖 observability

### 本 ADR 不锁定

- **256KB 阈值**:是经验值,可调(但修改要发 ADR 补充说明)
- **外部 blob 实现**:S3 / MinIO / Azure Blob 等具体选型,由 L4 基础设施决策
- **Checkpoint 保留周期**:Instance completed 后保留多久(当前暂 90 天),可能由 governance Policy 下发
- **Runtime C7 微步 Checkpoint 细节**:Runtime 仓内部决策,不跨域

## 6. 标准对齐

- **Temporal 持久执行**:每步 Checkpoint,崩溃从 Checkpoint 恢复
- **LangGraph Checkpoint**:状态机驱动的 checkpoint
- **ISO 42001 §A.6 Operation + Re-evaluation**:Instance 状态可恢复,支持运行时审查
- **ISO 42001 可解释性**:reasoning_trace 完整持久化(通过引用到 observability)
- **架构设计.md §4.4 Outbox 模式**:Checkpoint 写 + 事件发布同事务
- **SRP**:过程域管业务状态,observability 管观测数据

## 7. 后续行动

1. **本 ADR 接受后**:`domain/process/README.md` §5.4 和 §十 Q1 标记为"已由 ADR-0007 决策"
2. **短期(段 3)**:process 仓实现 Checkpoint 读写 + 外部 blob 回落
3. **中期**:Checkpoint 清理策略由 governance Policy 细化,可配置
4. **长期监控**:Checkpoint 数据量 / 外部 blob 命中率 / 恢复延迟,按实际情况调阈值

## 8. 参考

- `architecture/ai-member设计.md` §4.8 Checkpoint Store + §十一 Q2
- `domain/process/README.md` §2.3(Checkpoint 字段)+ §5.4(持久化策略)+ §十 Q1
- `product/六域模型.md` §六 过程域 + §九.1 观测横切
- `methodology/standards-discussion/BPMN-2.0.md`(Activity 状态机对齐)
- Research:Temporal 持久执行 + LangGraph Checkpoint
- 相关 ADR:ADR-0006 Memory 持久化归属(Working Memory 的那部分对偶)
