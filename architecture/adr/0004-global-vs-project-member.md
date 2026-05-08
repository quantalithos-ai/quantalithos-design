# ADR-0004:GlobalMember 与 ProjectMember 双层分离

> Status: **Accepted**
> Date: 2026-05-08
> Deciders: Aris
> Consulted: 讨论回溯(AI Member 架构的 6 轮对话)+ `product/最终目的.md` §3.2
> Informed: L1 `identity` 和 `work` 仓 / L2 `member` 运行层 / 所有涉及"员工"字段的文档

---

## 1. 背景

AI Member 的 6 轮设计讨论里暴露出一个根本矛盾:

- 一个员工 Marcus **跨多个项目活跃**时,需要多份**项目特定状态**(tool_scope / policy_overrides / 项目级记忆槽 / 当前 WorkItem 进度)
- 但他的**档案**(名字 / 能力 / 生涯 / 长期 semantic memory)只有一份,随他的整个职业生涯持续存在

单层 Member 模型(只有一个 `Member` 聚合)会出现以下失败:

1. **容器不唯一** — 一个 Member 同时跑多个项目时,要么只能一个容器(上下文混杂),要么容器 key 不再是 member_id(模型崩塌)
2. **项目级配置无处安放** — 同一 Role 在不同项目的 tool_scope 不同,既不是全局属性,也不能散在自由字段里
3. **恢复语义模糊** — "恢复 Marcus 的现场"是恢复档案?恢复项目位置?恢复权限?三者混在一起无法分辨

## 2. 决策

**引入双层 Member 模型**:

```
┌────────────── 身份域 quantalithos-identity ──────────────┐
│                                                          │
│  GlobalMember(聚合根)                                   │
│  ├─ member_id                 全局唯一 ULID              │
│  ├─ name / avatar / profile                              │
│  ├─ role                      长期职业                   │
│  ├─ capability_profile        能力画像                   │
│  ├─ semantic_memory_ref       指向向量库的句柄(外部存储)│
│  ├─ career_history            参与过的项目列表           │
│  └─ lifecycle: hired/active/paused/retired/tombstoned    │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         │
                         │ 被 ProjectMember 引用
                         ▼
┌────────────── 工作域 quantalithos-work ──────────────────┐
│                                                          │
│  ProjectMember(Project 聚合下的实体)                    │
│  ├─ project_member_id         项目内唯一                 │
│  ├─ global_member_id          指向 GlobalMember          │
│  ├─ project_id                归属项目                   │
│  ├─ role_in_project           项目内角色(可覆盖全局)   │
│  ├─ tool_scope                项目级工具权限             │
│  ├─ policy_overrides          项目级策略裁剪             │
│  ├─ memory_slot_ref           项目级记忆槽(短期 + 情景) │
│  ├─ current_workitems         当前任务                   │
│  └─ lifecycle: assigned/active/paused/retired_from_project/archived │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**一个运行时容器对应一个 ProjectMember 实例,不是对应一个 GlobalMember。**

## 3. 理由

### 3.1 边界清晰

- GlobalMember 是**持久身份档案**,生命周期独立于任何项目,和"HR 里的员工档案"一一对应
- ProjectMember 是**项目上下文中的员工角色分配**,生命周期绑定项目,和"项目组花名册"一一对应
- 两者的一致性边界完全不同:档案修改不应触发所有项目的 ProjectMember 变更

### 3.2 恢复语义明确

- **恢复档案**:读 GlobalMember 聚合 + 外部 semantic_memory 对象
- **恢复项目现场**:读 ProjectMember + 其引用的 WorkItem + ProcessInstance checkpoint
- **恢复权限**:读 ProjectMember 的 tool_scope + policy_overrides

三者分离,归档服务(L4 archive)能精确打包、精确还原。

### 3.3 多项目并发支持

- 同一 GlobalMember 在多个 Project 下各自有独立 ProjectMember
- 每个 ProjectMember 独立起容器,互不干扰
- `member-service`(L2)按 ProjectMember 调度,不会出现"一个容器服务多项目"的上下文污染

### 3.4 与标准对齐

- **SPEM 2.0** Definition vs Use:GlobalMember(档案定义)vs ProjectMember(项目使用)正好映射
- **ISO 42001** AI Actor:GlobalMember 对应"AI Producer 个体身份",ProjectMember 对应"具体 AIMS 内的 AI Actor 实例"
- **ISO 29110** Profile 机制:ProjectMember 的 `tool_scope / policy_overrides` 正是 29110 Profile Tailoring 的落地

## 4. 不采纳的替代方案

| 替代 | 为什么不采纳 |
|---|---|
| 单层 Member + 多实例字段 | Member 聚合膨胀,多项目字段无处安放,一致性边界混乱 |
| 三层(Global + Team + Project) | 过度抽象,Team 边界不清,YAGNI |
| Global 在 identity,Project 在 identity | 违反六域分离,ProjectMember 本质属于"项目的组成",不是"员工档案" |
| Project 在独立 project-member 仓 | 过度拆分,ProjectMember 和 Project 聚合强耦合,分仓会引入分布式事务 |

## 5. 后果

### 5.1 正面

- GlobalMember 和 ProjectMember 各自在自然的域内,聚合根边界清晰
- 项目归档时,ProjectMember 归属项目切片;员工档案独立保留,无冗余复制
- 员工跨项目的 semantic memory 积累不受单个项目归档影响
- Role 作为 SPEM Method Content 存在 `method-library`,GlobalMember 带 Role,ProjectMember 可 override

### 5.2 负面

- **跨仓事件同步**:GlobalMember 某些变化(名字 / 头像 / 退休)需要 work 域订阅事件同步到 ProjectMember 展示层
- **双写风险**:招聘新员工并立即分配到项目,是两个域的两个事务;需要最终一致性保证
- **UI 层需要聚合两份数据**:显示员工卡片时既要读 GlobalMember 又要读 ProjectMember

### 5.3 风险缓解

- 跨域事件通过 `quantalithos-bus` 最终一致,不追求强一致(符合六域事件编织原则)
- 双写通过 Saga 模式(Outbox + 补偿事件)保证
- UI 通过 L5 聚合 API(由 sdk 提供)封装,不让前端拼接

## 6. 约束与边界

- **本 ADR 锁定**:GlobalMember 归 `identity` 仓,ProjectMember 归 `work` 仓
- **本 ADR 不锁定**:具体字段的详细设计(留给 `domain/identity/` 和 `domain/work/` 设计文档)
- **本 ADR 不锁定**:Member 在运行时的容器粒度(由 ADR-0005 决定)

## 7. 标准对齐

- SPEM 2.0 Definition vs Use(`methodology/standards-discussion/SPEM-2.0.md`)
- ISO 29110 Profile 裁剪(`methodology/standards-discussion/ISO-IEC-29110.md`)
- ISO 42001 AI Actor(`methodology/standards-discussion/ISO-42001.md` §0.2 术语 C)
- `feedback_design_principles.md` 指向的 `architecture/架构设计.md` §1.2 推迟不可逆决策:双层分离让未来可演进

## 8. 参考

- `product/最终目的.md` §3.2(员工是有身份的个体)
- `project_six_domains.md` 记忆(已更新:identity 只管 GlobalMember,ProjectMember 归 work)
- 讨论回溯:本轮会话中 AI Member 架构的第 2 / 3 / 4 / 5 / 6 轮
- 后续 ADR:ADR-0005(Member 镜像按 Role 预构建)
