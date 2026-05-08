# ADR-0006:Memory 持久化归属 —— identity 扩展 + 外部向量库

> Status: **Accepted**
> Date: 2026-05-08
> Deciders: Aris
> Consulted: `architecture/ai-member设计.md` §4.4 + §十一 Q1 / `domain/identity/README.md` §十 Q1
> Informed: identity 仓 / runtime 仓 / observability 仓 / archive 仓 / 未来 memory 相关工作

---

## 1. 背景

AI Member 的 Runtime(L2 大脑进程)有**三层记忆**(对齐 Research 记忆三层架构):

- **Working Memory** — 当前 Activity 的对话 / 观察 / 推理,单次 Activity 生命周期
- **Episodic Memory** — 过往协作事件 / 反思 / 教训,跨 Activity / 跨项目累积
- **Semantic Memory** — 领域知识 / 技能,长期稳定,跨项目共享

**Working Memory** 由 Runtime C7 Checkpoint Store 落盘(见 ADR-0007 将讨论 checkpoint 位置),不在本 ADR 范围。

**Episodic + Semantic** 两层是"需要长期存活的记忆",需要决定**由哪个域 / 仓承载其引用与生命周期元数据**。

讨论于 `ai-member设计.md` §十一 Q1 和 `domain/identity/README.md` §十 Q1 反复出现。本 ADR 落定。

## 2. 决策

**采用候选 C**:

- **Semantic Memory** 的引用(`semantic_memory_ref`)挂在 `identity.GlobalMember` 聚合根上
- **Episodic Memory** 的引用(`episodic_memory_refs: Vec<EpisodicMemoryRef>`)也挂在 `identity.GlobalMember` 上,按 (member_id, project_id) 分片,每个 ProjectMember 对应一个 slot
- **记忆的实际向量 / 文档** 存在**外部**(S3 / MinIO 对象存储 + Qdrant / pgvector 向量索引),identity 只存 URI + 元数据
- `work.ProjectMember` 不持有 memory_ref,只引用 `identity.GlobalMember.episodic_memory_refs` 里对应项的 slot_id

### 2.1 具体字段

在 `identity.GlobalMember` 增加 / 保留两字段:

```
semantic_memory_ref:    MemoryRef {
    slot_id:          UUID,                     // 外部向量库的 collection id
    backend:          enum { qdrant, pgvector, ... },
    endpoint:         URL,
    created_at:       Timestamp,
    size_estimate:    bytes,
    storage_tier:     enum { hot, warm, cold },
}

episodic_memory_refs:   Vec<EpisodicMemoryRef {
    slot_id:          UUID,
    project_id:       UUID,                     // 所属项目(分片键)
    project_member_id: UUID,                    // 绑定的 ProjectMember
    backend:          enum { qdrant, pgvector, ... },
    endpoint:         URL,
    created_at:       Timestamp,
    last_written_at:  Timestamp,
    size_estimate:    bytes,
    storage_tier:     enum { hot, warm, cold },
    status:           enum { active, paused, migrating, archived },
}>
```

### 2.2 Runtime(L2)的访问路径

```
Runtime Process
  │
  │ 启动时通过 member-service.ResolveMemberForContainer
  │ 获取 semantic_memory_ref + episodic_memory_ref(仅当前 ProjectMember)
  │
  ▼
C3 Memory Store 使用外部向量库 client(Qdrant / pgvector)
  直接读写向量库(不经 identity 中转)
  │
  ▼
写入时发事件(member.memory_written)
  ├─ 携带 member_id / project_id / slot_id / trace_id
  └─ 供 observability 记审计 + 可选的血缘分析
```

**关键**:identity **不是** memory 数据的读写路径。identity 只管 ref 的生命周期(创建 / 迁移 / 归档)。

## 3. 理由

### 3.1 为什么选 C

| 维度 | A 新增 memory 域 | B observability 承载 | **C identity 扩展** | D L3 memory-store |
|---|---|---|---|---|
| 破坏六域平权 | ⚠ 打破六域数量 | — | — | — |
| 语义契合 | Memory 独立成域 | 记忆≠观测,语义模糊 | **记忆是身份的一部分** | 工具性,非领域 |
| 短期改动 | ❌ 最大(新域) | ❌ 大(扩 observability 职责) | ✅ **小(扩 identity 字段)** | ❌ 新仓 |
| 长期演进 | ✅ 最纯粹 | ❌ 语义越来越错 | ⚠ 有扩展压力 | ⚠ 和 identity 割裂 |
| 与 42001 对齐 | ✅ | ⚠ | ✅ **A.7 Data for AI** | ⚠ |
| 与产品叙事对齐 | ⚠ 引入新概念 | ❌ | ✅ **"员工有记忆"直接落地** | ⚠ |

**决定因素**:

1. **产品叙事**:`最终目的.md` §3.2 明确"员工有记忆"是**员工身份的一部分**,不是独立系统
2. **六域数量稳定性**:六域平权已写入记忆和多份权威文档,不轻易打破
3. **最小改动原则**(架构设计.md §1.2 推迟不可逆决策):当前 identity 扩展是可逆的(数据未长期绑死),未来切 A 只需建新域 + 迁移字段
4. **42001 A.7 Data for AI 对齐**:数据治理的血缘、PII、保留政策天然适合 identity 承载(和 GlobalMember 的合规属性同层)

### 3.2 为什么不是 A(新增 memory 域)

虽然 A 最"纯粹",但:
- 破坏已固化的六域模型(记忆已多次出现在文档中)
- 当前 Memory 逻辑复杂度不足以支撑独立域
- 新域会带来新的聚合根 / 事件 / 持久化栈,ROI 不划算
- C 是 A 的**演进前奏**,若未来 Memory 逻辑膨胀(LLM 驱动的自动反思 / 跨 Member 记忆共享等),可平滑切换

### 3.3 为什么不是 B(observability 承载)

- 记忆是**业务数据**(Member 的工作记录),不是**观测数据**(系统行为指标)
- 混入 observability 会让审计事件链被业务数据污染,违反三红线可审计性
- B 唯一的好处是"事件化",但这可以通过 Outbox 模式在 C 下同样实现

### 3.4 为什么不是 D(L3 新仓)

- 和 identity 割裂(memory ref 和 Member 本该同生命周期)
- 新仓增加架构成本,不抵消其带来的"集中能力"
- L3 定位是"横切能力",但 Memory 是**按 Member 分片的业务数据**,不是横切

## 4. 后果

### 4.1 正面

- **identity 仓成为员工信息的"一站式"权威**(档案 + 能力 + 记忆引用 + 生涯)
- **Memory 治理与 Member 生命周期绑定**(tombstoned 时 memory 自动冷存)
- **Runtime 访问路径清晰**(通过 member-service.ResolveMemberForContainer 一次获取所有 ref)
- **演进灵活**:未来切 A 只需迁移字段,不影响 Runtime

### 4.2 负面

- **identity 仓 schema 变复杂**(增加两个 ref 字段 + 相关事件)
- **identity 仓需要支持高频 ref 生命周期变更**(每个 ProjectMember 诞生 / 归档都触发 slot 操作)
- **member-service 的 ResolveMemberForContainer 响应变大**(含两个 ref)
- **跨 Member 记忆共享** 场景(未来 feature)会比 A 方案麻烦

### 4.3 风险缓解

- 把 `episodic_memory_refs` 作为**独立 JSONB 字段**(而非嵌入 capability_profile),保留未来独立抽出的可能
- 建立 `identity.memory.*` 事件族(memory_slot_created / migrated / archived / deleted),观测所有 ref 生命周期
- 写入 Memory 的 side-effect 仍走 Runtime 直接访问外部库,identity 只是元数据 CRUD,不承担数据量压力
- 若未来需要切 A,提供专用迁移脚本(ADR 扩展说明迁移步骤)

## 5. 约束与边界

### 本 ADR 锁定

- `semantic_memory_ref` 和 `episodic_memory_refs` 作为 identity.GlobalMember 的字段
- Runtime 访问 Memory 不经 identity(直连外部向量库)
- Memory slot 的生命周期事件从 identity 发出
- `work.ProjectMember` 不持有 memory_ref(只能通过 identity 查询)

### 本 ADR 不锁定

- **具体向量库选型**(Qdrant vs pgvector vs Milvus)— 由 L4 基础设施决策
- **向量化模型选型**(embedding 模型)— 由 capability-hub 决策
- **冷热分层策略细节**(多久变 warm、多久变 cold)— 由 Policy 下发,Policy 由 governance 管理
- **跨 Member 记忆共享**(未来 feature)— 届时评估是否需要演进到 A

## 6. 标准对齐

- **ISO 42001 A.7 Data for AI**:Data Provenance / Data Privacy / Data Quality 通过 MemoryRef 的元数据实现
- **ISO 42001 A.6 AI Life Cycle Retirement**:tombstoned 触发 memory 冷存 → 最终删除
- **ISO 27001**:Memory 存储加密;访问受 RBAC 控制
- **ISO 9001 文档化信息**:Memory ref 本身是 Documented Information(识别信息)
- **Research 记忆三层架构**(arxiv 2507.22925 / 2512.22087):三层显式分离
- **架构设计.md §1.2 推迟不可逆决策**:选 C 是最小改动,保留演进空间

## 7. 后续行动

1. **本 ADR 接受后**:`domain/identity/README.md` §2.1.1 已预留的字段结构生效,§十 Q1 标记为"已由 ADR-0006 决策"
2. **短期(段 3)**:identity 仓 schema migration 添加 `episodic_memory_refs` 字段;添加 `identity.memory.*` 事件族
3. **中期(段 3 末)**:建立 Memory slot 的生命周期运维 runbook
4. **长期监控**:当 Memory 管理逻辑行数超过 identity 仓的 30% 时,重新评估是否演进到 A

## 8. 参考

- `architecture/ai-member设计.md` §4.4 Memory Store + §十一 Q1
- `domain/identity/README.md` §2.1.1 字段 + §十 Q1
- `product/六域模型.md` §3.2.1 GlobalMember 聚合根
- `product/最终目的.md` §3.2 员工叙事
- `methodology/standards-discussion/ISO-42001.md` §A.7 Data for AI
- Research:记忆三层架构(arxiv 2507.22925 / 2512.22087)
- 相关未决 ADR:ADR-0007 Checkpoint 持久化位置(Working Memory 那半边)
