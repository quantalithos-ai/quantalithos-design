# work — 工作域详细设计

> **域定位**:工作域的详细设计文档。回答"在做什么软件项目"。聚合根是 **Project**(内部含 ProjectMember / Backlog 作为实体)/ **WorkItem** / **Iteration**。
>
> **上游依据**:
> - `product/最终目的.md` §3.4 工作对象是软件项目
> - `product/六域模型.md` §五 工作域
> - `architecture/仓库拆分方案.md` §4.3 `quantalithos-work`
> - `architecture/标准对齐全景图.md` §一 `quantalithos-work`
> - `architecture/ai-member设计.md` §六 双层 Member 模型
> - `domain/identity/README.md`(上游:GlobalMember 的 hire / active / retire 事件驱动本域 ProjectMember 同步)
> - ADR-0004(GlobalMember 在 identity,ProjectMember 在 work)
> - 14 标准主对齐:**ISO 12207 技术过程 + Scrum + Kanban**;次对齐:ISO 15288 SoI / 29110 Profile / 25010 Context of Use
>
> **本文不承载**:GlobalMember 档案(在 identity 域)/ 过程编排细节(在 process 域)/ 容器编排(在 L2 member-service)/ NFR 的 25010 特性语义(在 artifact 域)。

---

## 一、使命与边界

### 1.1 使命

**承载 Quantalithos "软件项目"这一工作对象**。产品叙事强调项目不是"一次问答"而是"有生命周期的软件系统",本域把这个叙事落到独立的聚合根。

具体职责:
- **Project 聚合根**:软件项目的身份 / 生命周期 / 上下文
- **ProjectMember 实体**(Project 内部):双层 Member 模型的"项目分配层"
- **Backlog 实体**(Project 内部):待办集合
- **WorkItem 聚合根**:Story / Task / Bug / Prototype / Spike / Review / NFR 七种类型
- **Iteration 聚合根**:Sprint / Kanban Cadence 的时间段载体
- **Baseline 引用**:Project 知道自己冻结了哪些 Artifact,但 Baseline 本身在 artifact 域

### 1.2 边界(不做的事)

- **不持 GlobalMember 档案** —— 那在 identity 域(ADR-0004)
- **不做过程编排** —— 过程模板 / Profile / Instance 在 process 域
- **不做 Activity 的执行** —— 那在 L2 Member 运行层
- **不做 Gate 决策** —— 那在 governance 域
- **不做 Artifact 内容存储** —— 那在 artifact 域(work 只引用)
- **不做 Conversation 管理** —— project 的 group 由 conversation 域创建

### 1.3 与其他域的协作全景

```
┌────────────────────────────────────────────────────────────────┐
│  work 域(本文)                                                 │
│  Project + ProjectMember + Backlog + WorkItem + Iteration      │
└──┬──────────────────┬──────────────────┬────────────────────┬──┘
   │ 发事件            │ 发事件           │ 发事件              │ 发事件
   ▼                  ▼                  ▼                    ▼
 identity           conversation       member-service         process + governance
 (career entry     (group 创建        (容器启停)              (流程初始化 +
  同步)            与归档)                                     Gate 触发)
   │                                     │
   │ 订阅                                │ 订阅
   ▼                                     ▼
 identity.member.*                    identity.member.*
 (同步 ProjectMember lifecycle)       (Role 映射 image_variant)
```

---

## 二、聚合根详细设计

### 2.1 Project 聚合根

#### 2.1.1 完整字段

```
Project {
    project_id:              ULID,
    owner_user_id:           UserId,              // 发起用户(管理者)
    title:                   String,              // 项目名
    description:             String,

    // 使用上下文(25010 要求 + 42001 Scope)
    context_of_use:          ContextOfUse {
        target_users:            Vec<UserProfile>,       // 目标用户画像
        deployment_env:          DeploymentEnv,           // 目标部署环境
        compliance_profile:      Vec<ComplianceCode>,    // GDPR / HIPAA / EU AI Act / ...
        quality_priorities:      Vec<QualityCharacteristic>,  // 25010 关注的特性
    },

    // 过程绑定
    process_template_id:      Option<TemplateRef>,       // method-library 中的模板
    process_profile_id:       Option<ProcessProfileId>,  // 裁剪后的 Profile(在 process 域)
    process_instance_id:      Option<ProcessInstanceId>, // 当前运行实例(在 process 域)

    // 成员(Project 聚合内,双层 Member 的项目层)
    project_members:          Vec<ProjectMemberId>,      // 聚合内引用

    // Backlog
    backlog_id:               BacklogId,                  // 1:1 绑定

    // 迭代与基线
    current_iteration_id:     Option<IterationId>,
    iteration_history:        Vec<IterationId>,
    baseline_ids:             Vec<BaselineRef>,          // 引用 artifact 域 Baseline

    // AI 治理(42001)
    aiia_ref:                 Option<ArtifactRef>,       // kind=impact-assessment

    // 生命周期
    lifecycle:                ProjectLifecycle,          // draft / active / paused / archived / dissolved / restored
    created_at:               Timestamp,
    started_at:               Option<Timestamp>,
    archived_at:              Option<Timestamp>,
    dissolved_at:             Option<Timestamp>,

    // 审计
    trace_id:                 TraceId,
    audit_log_ref:            AuditLogRef,
    version:                  u64,
}
```

#### 2.1.2 生命周期状态机

```
              [用户立项 dm 发起]
                     │
                     ▼
               ┌──────────┐
               │  draft   │  起草中,尚未经 kickoff Gate 批准
               └────┬─────┘
                    │ start(经 kickoff Gate)
                    ▼
               ┌──────────┐
               │  active  │  活跃中,可做工作
               └──┬────┬──┘
                  │    │
         [pause]  │    │   [archive]
                  │    │
                  ▼    ▼
          ┌─────────┐ ┌────────────┐
          │ paused  │ │  archived  │  归档,可恢复 / 只读
          └───┬─────┘ └──┬──────┬──┘
              │ resume   │      │
              ▼          │      │
          回 active   [restore] │ [dissolve]
                         │      │
                         ▼      ▼
                    回 active  ┌─────────────┐
                               │  dissolved  │  解散,不可恢复
                               └─────────────┘
```

**状态说明**:

| 状态 | 说明 |
|---|---|
| `draft` | 立项讨论中,未经批准;可改配置;未启动过程 |
| `active` | 正常运行,WorkItem 可创建 / 推进;过程实例活跃 |
| `paused` | 暂停,WorkItem 保留但不推进;容器进 paused(见 ai-member 设计) |
| `archived` | 归档(只读),可恢复;所有容器 GracefulShutdown |
| `restored` | `archived` → `active` 的瞬时状态,执行恢复逻辑后立即转 `active`(事件命名用 `project.restored`) |
| `dissolved` | 解散,不可恢复(GDPR 场景的"删除"前置状态);数据进归档但不可还原为运行 |

### 2.1.3 不变量(INV-1 到 INV-15)

**INV-1** `project_id` 永不复用
**INV-2** `dissolved` 单向,不可回任何 active 系状态
**INV-3** `archived` 和 `dissolved` 必填对应时间戳
**INV-4** `process_profile_id` 一旦设定**整个项目周期不可更换**(更换等于新项目)
**INV-5** `context_of_use.compliance_profile` 修改必须经 Gate(可能影响 AIIA)
**INV-6** `baseline_ids` 只 append,不允许移除(基线一旦加入 Project 永久引用)
**INV-7** `dissolved` 后 24h 内 conversation 相关 group 必须 archived(跨域最终一致)
**INV-8** 有活跃 `iteration` 时不能直接 archived,必须先 close current_iteration
**INV-9** state 转为 active 必须有 `kickoff Gate` 决策记录(related_gate_id 引用)
**INV-10** `aiia_ref` 在以下情况必填:compliance_profile 非空 OR 存在 AI 系统部署 OR 被 Policy 强制
**INV-11** `owner_user_id` 一旦设定不可修改(只能 Member transfer ownership 的场景未来走 ADR)
**INV-12** `title` / `description` / `context_of_use` 修改发事件便于审计
**INV-13** 已 archived / dissolved 项目不可创建新 WorkItem / Iteration / ProjectMember
**INV-14** Project 必须与 conversation 域的一个 kind=group 一对一绑定(conversation 域 INV-2)
**INV-15** `lifecycle=active` 时必须有 `process_instance_id != null`(除非过程域显式未启动)

**项目完成判据(ADR-0008)**:

- **项目是否完成 = 所有 WorkItem 的 state ∈ {done, cancelled}**
- **与 ProcessInstance 是否 completed 独立判断**
- 看板、进度汇总、Retrospective 统计都**以 WorkItem 为准**,不以 Activity 状态为准
- ProcessInstance.completed 仅表示流程引擎推进完毕,不作为项目验收依据

#### 2.1.4 操作契约(Project)

| 操作 | 前置 | 后置 | 事件 |
|---|---|---|---|
| `CreateProject(owner, title, context, ...)` | owner 是有效 User | 创建,state=draft | `work.project.created` |
| `StartProject(project_id, kickoff_gate_id)` | state=draft,Gate 已 decided=approve | state=active;创建 Backlog + Iteration 0(可选) | `work.project.started` |
| `PauseProject(project_id, reason)` | state=active | state=paused | `work.project.paused` |
| `ResumeProject(project_id)` | state=paused | state=active | `work.project.resumed` |
| `ArchiveProject(project_id)` | state ∈ {active, paused},无活跃 iteration | state=archived | `work.project.archived` |
| `RestoreProject(project_id, gate_id)` | state=archived,Gate 批准 | state=active,执行恢复(跨域链) | `work.project.restored` |
| `DissolveProject(project_id, gate_id)` | state=archived,Gate 批准 | state=dissolved | `work.project.dissolved` |
| `UpdateContextOfUse(project_id, ...)` | state ∈ {draft, active, paused} | context 更新 | `work.project.context_of_use_updated` |
| `AttachAIIA(project_id, aiia_ref)` | aiia Artifact 是 approved | aiia_ref 写入 | `work.project.aiia_attached` |

### 2.2 ProjectMember(Project 聚合内实体)

#### 2.2.1 完整字段

```
ProjectMember {
    project_member_id:         ULID,                    // 项目内唯一
    project_id:                ProjectId,
    global_member_id:          GlobalMemberId,          // 引用 identity.GlobalMember

    // 项目内角色(可覆盖 Global 的 main role)
    role_in_project:           RoleId,                  // 默认继承 GlobalMember.role_id

    // 项目级 Profile(29110 Tailoring)
    tool_scope:                ToolScope {
        allowed_tools:         Vec<ToolRef>,            // 允许的工具集
        denied_tools:          Vec<ToolRef>,            // 显式拒绝
        extra_grants:          Vec<ToolGrantEvidence>,  // 扩展授权证据(超出 Role default 的要走 Policy)
    },
    policy_overrides:          PolicyOverrides {
        autonomy_level:        Option<AutonomyLevel>,    // 覆盖 Role default
        shared_rules_refs:     Vec<PolicyRef>,           // 项目级 shared rule(低于组织级)
        approval_requirements: Vec<ApprovalRule>,
    },

    // 项目级记忆槽(引用,实际存储在外部向量库)
    memory_slot_ref:           EpisodicMemoryRef,       // identity.GlobalMember.episodic_memory_refs 里的一项

    // 工作跟踪
    current_workitems:         Vec<WorkItemId>,         // 当前 assigned
    workitem_history:          Vec<WorkItemRef>,        // 历史(按时间)

    // 生命周期
    lifecycle:                 ProjectMemberLifecycle,  // assigned / active / paused / retired_from_project / archived
    assigned_at:               Timestamp,
    activated_at:              Option<Timestamp>,
    paused_at:                 Option<Timestamp>,
    retired_from_project_at:   Option<Timestamp>,

    // 与 identity 的双向引用
    career_entry_ref:          CareerEntryRef,          // identity.GlobalMember.career_history 里对应条目

    // 审计
    trace_id:                  TraceId,
    audit_log_ref:             AuditLogRef,
}
```

#### 2.2.2 生命周期状态机

```
         [Project.StartMember]
              │
              ▼
        ┌──────────┐
        │ assigned │  已分配,等待 member-service 启动容器
        └────┬─────┘
             │ 容器 Register 到位
             ▼
        ┌──────────┐
        │  active  │  容器运行中,能接 Activity
        └──┬────┬──┘
           │    │
   [pause] │    │   [retire_from_project]
           │    │
           ▼    ▼
     ┌─────────┐ ┌────────────────────────┐
     │ paused  │ │  retired_from_project  │  从项目退出,容器 shutdown
     └───┬─────┘ └──────┬─────────────────┘
         │ resume       │
         ▼              │
     回 active       Project archived / dissolved 时全体转 archived
                       ▼
                    ┌───────────┐
                    │ archived  │ 归档,容器不存在
                    └───────────┘
```

#### 2.2.3 不变量(INV-16 到 INV-25)

**INV-16** 同 (project_id, global_member_id) 只能有**一个 active 或 paused**的 ProjectMember;`retired_from_project` / `archived` 的不算
**INV-17** `global_member_id` 指向的 GlobalMember 必须 `lifecycle ∈ {active, paused}`(不能给 hired / retired / tombstoned 的 Member 分配 ProjectMember)
**INV-18** `retired_from_project` 单向
**INV-19** Project archived 时所有非 retired_from_project 的 ProjectMember 自动转 archived
**INV-20** Project dissolved 时所有 ProjectMember 转 archived(archived 后不再变化)
**INV-21** `tool_scope.allowed_tools` 必须是 Role.default_tool_scope 的**子集或扩展(需 extra_grants 支持)**
**INV-22** `tool_scope.denied_tools` 优先级高于 allowed_tools
**INV-23** `policy_overrides` 不得放宽组织级 shared_rules(Research 指令优先级)
**INV-24** `memory_slot_ref` 在 lifecycle=active 时必须有效;retired 后保留但可迁冷
**INV-25** `role_in_project` 若与 `GlobalMember.role_id` 不同,必须有充分理由(审计)

#### 2.2.4 操作契约(ProjectMember)

| 操作 | 前置 | 后置 | 事件 |
|---|---|---|---|
| `AssignMember(project_id, global_member_id, role_in_project, tool_scope)` | Project active,INV-16/17 | 创建,state=assigned | `work.project.member_assigned` |
| `ActivateMember(pm_id)` | state=assigned,容器 Register | state=active | `work.project.member_activated` |
| `PauseMember(pm_id)` | state=active | state=paused | `work.project.member_paused` |
| `ResumeMember(pm_id)` | state=paused | state=active | `work.project.member_resumed` |
| `RetireMemberFromProject(pm_id, reason)` | state ∈ {active, paused} | state=retired_from_project | `work.project.member_retired_from_project` |
| `UpdateToolScope(pm_id, tool_scope, evidence)` | state ∈ {active, paused} | tool_scope 更新,INV-21/22 验证 | `work.project.member_tool_scope_updated` |
| `UpdatePolicyOverrides(pm_id, overrides)` | state ∈ {active, paused} | overrides 更新,INV-23 验证 | `work.project.member_policy_overrides_updated` |

### 2.3 Backlog 实体(Project 内部)

#### 2.3.1 完整字段

```
Backlog {
    backlog_id:            ULID,
    project_id:            ProjectId,

    workitem_refs:         Vec<OrderedWorkItemRef>,     // 有序列表(优先级决定顺序)
    refinement_state:      RefinementState,             // unrefined / partially_refined / refined
    last_refined_at:       Option<Timestamp>,

    // 规模度量(可选)
    total_effort_estimate: Option<EffortEstimate>,      // 累计估算
    velocity_rolling:      Option<VelocityMetric>,      // 滚动速率

    trace_id:              TraceId,
}

OrderedWorkItemRef {
    workitem_id:           WorkItemId,
    order_index:           i64,                         // 优先级顺序
    added_at:              Timestamp,
    added_by:              ActorRef,
}
```

#### 2.3.2 不变量

**INV-26** 每个 Project 有且仅有一个 Backlog(1:1)
**INV-27** Backlog 的 workitem_refs 的 order_index 必须连续(每次 reorder 重新编号)
**INV-28** 已 `done` / `cancelled` 的 WorkItem 从 Backlog 移到 history(不在当前 Backlog)

#### 2.3.3 Scrum 借鉴

Scrum 区分 Product Backlog 和 Sprint Backlog。A 方案下:
- `Backlog` 对应 **Product Backlog**(整体未完成工作)
- **Sprint Backlog** 不单独建聚合,用 **Iteration 的 planned_workitems** 表达

---

### 2.4 WorkItem 聚合根

#### 2.4.1 完整字段

```
WorkItem {
    workitem_id:           ULID,
    project_id:            ProjectId,

    // 分类
    kind:                  WorkItemKind,         // story / task / bug / prototype / spike / review / nfr
    title:                 String,
    description:           String,               // markdown

    // 验收与估算
    acceptance_criteria:   Vec<AcceptanceCriterion>,
    estimated_effort:      Option<EffortEstimate>,  // 点数 / 小时 / T-shirt size
    actual_effort:         Option<EffortEstimate>,
    priority:              Priority,                // critical / high / normal / low

    // 责任
    assignee:              Option<ProjectMemberRef>,
    reviewers:             Vec<ProjectMemberRef>,
    watchers:              Vec<ActorRef>,

    // 依赖(DAG)
    depends_on:            Vec<WorkItemId>,          // 本 WorkItem 依赖的前置
    blocks:                Vec<WorkItemId>,          // 本 WorkItem 阻塞的后置
    blocker_note:          Option<String>,          // state=blocked 时的说明

    // 关联
    iteration_id:          Option<IterationId>,
    related_artifacts:     Vec<ArtifactRef>,         // 引用 / 产出的制品
    related_turns:         Vec<TurnRef>,             // 起源 / 讨论 Turn
    parent_workitem_id:    Option<WorkItemId>,       // 若为 epic 的子任务

    // 状态
    state:                 WorkItemState,            // todo / in_progress / blocked / in_review / done / cancelled
    state_history:         Vec<StateTransition>,

    // NFR 特化(当 kind=nfr)
    nfr_spec:              Option<NFRSpec>,          // 25010 映射,见 2.4.3

    // 审计
    created_at:            Timestamp,
    updated_at:            Timestamp,
    trace_id:              TraceId,
    audit_log_ref:         AuditLogRef,
    version:               u64,
}
```

#### 2.4.2 7 种 kind

| kind | 含义 | 标准来源 | 典型生命周期 |
|---|---|---|---|
| `story` | 用户故事 | Scrum | 需 acceptance_criteria,通常对应 1 迭代 |
| `task` | 工程任务 | 通用 | 实现性任务,可附属于 story |
| `bug` | 缺陷 | 通用 | 必须有复现步骤 |
| `prototype` | 原型 | 24748-2 | 产出 artifact kind=prototype |
| `spike` | 技术探索 | XP | 时间盒限制,产出 adr / lessons-learned |
| `review` | 评审任务 | 12207 V&V | 产出 artifact kind=test-report 或 lessons-learned |
| `nfr` | 非功能需求 | 25010 | 必须映射 25010 特性 |

#### 2.4.3 NFRSpec(nfr kind 专用)

```
NFRSpec {
    characteristic:         QualityCharacteristic,   // 25010 的 9 个
    sub_characteristic:     QualitySubCharacteristic, // 31 个子特性
    target_attribute:       String,                  // 可度量属性名
    measurement:            Measurement {
        method:             String,                  // 度量方法
        window:             Duration,                // 窗口
        threshold:          Threshold,               // 阈值
        datasource:         String,                  // 来源(prometheus / OTel / 人工)
    },
    verification:           Verification {
        verification_type:   enum { continuous_monitoring / gate / test / inspection },
        gate_trigger:       Option<String>,          // 违反触发的 Gate 类型
    },
    traceability:           Traceability {
        stakeholder:        String,
        context_of_use:     String,
        rationale:          String,
    },
}
```

**对齐**:`standards/产品遵循规范清单.md` §二 NFR 模板;`methodology/standards-discussion/ISO-25010.md` §5.3。

#### 2.4.4 状态机

```
             [创建]
               │
               ▼
          ┌────────┐
          │  todo  │
          └───┬────┘
              │ assign + start
              ▼
        ┌──────────────┐
        │ in_progress  │
        └──┬────────┬──┘
           │        │
   [block] │        │  [submit_for_review]
           │        │
           ▼        ▼
     ┌─────────┐ ┌──────────┐
     │ blocked │ │in_review │
     └───┬─────┘ └─────┬────┘
         │ unblock     │ approve
         ▼             ▼
     回 in_progress  ┌──────┐
                    │ done │  完成
                    └──────┘

  任何状态下可 cancel → cancelled(单向)
```

#### 2.4.5 不变量(INV-29 到 INV-40)

**INV-29** `workitem_id` 永不复用
**INV-30** `state=done` 必须有 ≥ 1 个 `approved` 状态的 Artifact 在 related_artifacts 中
**INV-31** `state=blocked` 必须有 `blocker_note` 非空
**INV-32** `state=in_progress` 必须有 assignee
**INV-33** 依赖图(depends_on / blocks)严格 DAG(无环)
**INV-34** `cancelled` 单向;其他状态都可转 cancelled
**INV-35** `state` 转移严格按状态机(越级禁)
**INV-36** `kind=nfr` 必须有完整 `nfr_spec`(INV-13 在 artifact 侧镜像)
**INV-37** `kind=bug` 必须有复现步骤(放在 description 或 acceptance_criteria)
**INV-38** `assignee` 的 ProjectMember 必须 active(不能 assign 给 paused / retired_from_project 的 Member)
**INV-39** 父子 WorkItem(parent_workitem_id)不能跨 project_id
**INV-40** 依赖的 WorkItem 必须同 project_id

### 2.5 Iteration 聚合根

#### 2.5.1 完整字段

```
Iteration {
    iteration_id:           ULID,
    project_id:             ProjectId,

    sequence_num:           i32,                     // 第几次迭代(Sprint N)
    name:                   Option<String>,          // "Sprint 5 / Login 功能"
    goal:                   String,                  // Sprint Goal

    // 计划与实际
    planned_workitems:      Vec<WorkItemId>,         // 计划完成(即 Sprint Backlog)
    actual_workitems:       Vec<WorkItemId>,         // 实际完成(close 时填)
    spillover_workitems:    Vec<WorkItemId>,         // 未完成,转下迭代

    // 时间
    started_at:             Option<Timestamp>,
    planned_end_at:         Timestamp,
    ended_at:               Option<Timestamp>,

    // 回顾(Scrum Retrospective)
    retrospective_notes:    Option<RetrospectiveNotes>,
    retrospective_artifact_ref: Option<ArtifactRef>,  // 指向 kind=lessons-learned

    // 度量
    velocity:               Option<Velocity>,        // 本迭代速率
    burndown_data:          Option<BurndownData>,

    // 状态
    state:                  IterationState,          // planned / in_progress / closed / cancelled

    trace_id:               TraceId,
    audit_log_ref:          AuditLogRef,
}
```

#### 2.5.2 状态机

```
[plan] → planned → start → in_progress → close → closed
                             │
                             └── cancel → cancelled
```

#### 2.5.3 不变量(INV-41 到 INV-46)

**INV-41** `iteration_id` 永不复用
**INV-42** 同 project 的 sequence_num 严格递增(不回退)
**INV-43** 同 project 在同一时刻最多只有 **一个** `in_progress` Iteration
**INV-44** `closed` / `cancelled` 单向(closed 不能回 in_progress)
**INV-45** `state=in_progress` 时 `started_at` 必填
**INV-46** `state=closed` 时 `ended_at` 必填,且 `actual_workitems` 不为空

#### 2.5.4 Scrum / Kanban 语义映射

- **Scrum Sprint** = Iteration(goal + fixed duration + retrospective)
- **Kanban Flow** = 不使用 Iteration(WorkItem 直接走 Backlog → in_progress → done,按 WIP limit 拉动)
- **Scrumban** = 使用 Iteration 作为 Cadence,但放弃严格 Sprint Backlog 锁定

Kanban 项目的 `process_template_id` 指向 kanban 家族 Template,Project 不强制创建 Iteration(但可以用 Iteration 做"review cadence")。

### 2.6 双层 Member 模型全景

对齐 ADR-0004 和 `ai-member设计.md` §六,把双层模型在本域的落地集中表达:

```
┌──────────────────────────────────────────────────────────────┐
│ identity 域                                                    │
│                                                                │
│  GlobalMember (持久档案)                                        │
│  ├─ member_id                                                  │
│  ├─ name / avatar / profile                                   │
│  ├─ role_id(主职业)                                           │
│  ├─ capability_profile                                         │
│  ├─ semantic_memory_ref       (跨项目,GlobalMember 级)        │
│  ├─ episodic_memory_refs[]    (按 project 分片,指向外部向量库)│
│  ├─ career_history[]          (append-only 生涯)              │
│  └─ lifecycle(hired..tombstoned)                              │
└────────────────────────┬───────────────────────────────────────┘
                         │ 引用(project_member.global_member_id)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ work 域(本文)                                                 │
│                                                                │
│  Project                                                       │
│  └─ ProjectMember (项目分配层,Project 聚合内实体)              │
│     ├─ project_member_id                                       │
│     ├─ project_id                                              │
│     ├─ global_member_id → identity.GlobalMember               │
│     ├─ role_in_project(默认继承,可覆盖)                      │
│     ├─ tool_scope(29110 Profile Tailoring)                    │
│     ├─ policy_overrides                                        │
│     ├─ memory_slot_ref → identity.episodic_memory_refs[i]     │
│     ├─ current_workitems[]                                     │
│     └─ lifecycle(assigned..archived)                          │
└────────────────────────┬───────────────────────────────────────┘
                         │ 引用(ProjectMember.memory_slot_ref)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 外部向量库(S3 + Qdrant / pgvector)                            │
│  按 (global_member_id, project_id) 分片的 episodic memory     │
└──────────────────────────────────────────────────────────────┘
                         │
                         │ Runtime 读取(不经 identity 中转)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ L2 Member 运行层                                               │
│                                                                │
│  Container(每个 active ProjectMember 一个)                     │
│  ├─ launch_token(带 global_member_id + project_member_id)     │
│  ├─ Runtime 通过 member-service.ResolveMemberForContainer     │
│  │   一次获取:Role / Capability / Semantic + Episodic ref     │
│  └─ Memory 直连外部向量库(符合 ADR-0006)                      │
└──────────────────────────────────────────────────────────────┘
```

**核心规则**(对齐 INV):
- 同一 (project, global_member) 只能有 1 个 active/paused 容器
- 一个 GlobalMember 同时活跃在多个 Project = 多个 ProjectMember = 多个独立容器
- Episodic Memory 按项目隔离;Semantic Memory 跨项目共享(乐观锁)
- Role 升级(identity.role.updated)可能触发所有相关 ProjectMember 对应容器滚动重启

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.work.v1;

service WorkService {
    // === Project 管理 ===
    rpc CreateProject(CreateProjectRequest) returns (CreateProjectResponse);
    rpc StartProject(StartProjectRequest) returns (StartProjectResponse);
    rpc PauseProject(PauseProjectRequest) returns (PauseProjectResponse);
    rpc ResumeProject(ResumeProjectRequest) returns (ResumeProjectResponse);
    rpc ArchiveProject(ArchiveProjectRequest) returns (ArchiveProjectResponse);
    rpc RestoreProject(RestoreProjectRequest) returns (RestoreProjectResponse);
    rpc DissolveProject(DissolveProjectRequest) returns (DissolveProjectResponse);

    rpc UpdateContextOfUse(UpdateContextOfUseRequest) returns (UpdateContextOfUseResponse);
    rpc AttachAIIA(AttachAIIARequest) returns (AttachAIIAResponse);
    rpc GetProject(GetProjectRequest) returns (Project);
    rpc ListProjects(ListProjectsRequest) returns (ListProjectsResponse);

    // === ProjectMember 管理 ===
    rpc AssignMember(AssignMemberRequest) returns (AssignMemberResponse);
    rpc ActivateProjectMember(ActivateProjectMemberRequest) returns (ActivateProjectMemberResponse);
    rpc PauseProjectMember(PauseProjectMemberRequest) returns (PauseProjectMemberResponse);
    rpc ResumeProjectMember(ResumeProjectMemberRequest) returns (ResumeProjectMemberResponse);
    rpc RetireMemberFromProject(RetireMemberRequest) returns (RetireMemberResponse);
    rpc UpdateToolScope(UpdateToolScopeRequest) returns (UpdateToolScopeResponse);
    rpc UpdatePolicyOverrides(UpdatePolicyOverridesRequest) returns (UpdatePolicyOverridesResponse);

    rpc GetProjectMember(GetProjectMemberRequest) returns (ProjectMember);
    rpc ListProjectMembers(ListProjectMembersRequest) returns (ListProjectMembersResponse);

    // === WorkItem 管理 ===
    rpc CreateWorkItem(CreateWorkItemRequest) returns (CreateWorkItemResponse);
    rpc UpdateWorkItem(UpdateWorkItemRequest) returns (UpdateWorkItemResponse);
    rpc TransitionWorkItemState(TransitionStateRequest) returns (TransitionStateResponse);
    rpc AssignWorkItem(AssignWorkItemRequest) returns (AssignWorkItemResponse);
    rpc AddDependency(AddDependencyRequest) returns (AddDependencyResponse);

    rpc GetWorkItem(GetWorkItemRequest) returns (WorkItem);
    rpc ListWorkItems(ListWorkItemsRequest) returns (ListWorkItemsResponse);
    rpc QueryWorkItems(QueryWorkItemsRequest) returns (QueryWorkItemsResponse);

    // === Iteration 管理 ===
    rpc PlanIteration(PlanIterationRequest) returns (PlanIterationResponse);
    rpc StartIteration(StartIterationRequest) returns (StartIterationResponse);
    rpc CloseIteration(CloseIterationRequest) returns (CloseIterationResponse);
    rpc CancelIteration(CancelIterationRequest) returns (CancelIterationResponse);

    rpc GetIteration(GetIterationRequest) returns (Iteration);
    rpc ListIterations(ListIterationsRequest) returns (ListIterationsResponse);

    // === Backlog 管理 ===
    rpc AddToBacklog(AddToBacklogRequest) returns (AddToBacklogResponse);
    rpc ReorderBacklog(ReorderBacklogRequest) returns (ReorderBacklogResponse);
    rpc RefineBacklog(RefineBacklogRequest) returns (RefineBacklogResponse);
    rpc GetBacklog(GetBacklogRequest) returns (Backlog);

    // === 内部接口(Console 看板等) ===
    rpc GetProjectBoard(GetProjectBoardRequest) returns (ProjectBoard);
    // 返回 Kanban 视图:按 state 分组的 WorkItem 列表
}
```

### 3.2 关键请求示例

#### CreateProject

```proto
message CreateProjectRequest {
    string owner_user_id = 1;
    string title = 2;
    string description = 3;
    ContextOfUse context_of_use = 4;
    optional string process_template_id = 5;
    audit.ActorContext actor = 6;
}
```

#### AssignMember

```proto
message AssignMemberRequest {
    string project_id = 1;
    string global_member_id = 2;
    string role_in_project = 3;          // 默认继承 GlobalMember.role_id
    optional ToolScope tool_scope = 4;
    optional PolicyOverrides policy_overrides = 5;
    audit.ActorContext actor = 6;
}

message AssignMemberResponse {
    string project_member_id = 1;
    google.protobuf.Timestamp assigned_at = 2;
}
```

#### GetProjectBoard(Console / Chat 看板视图)

```proto
message GetProjectBoardRequest {
    string project_id = 1;
    optional string iteration_id = 2;    // 可选按迭代过滤
    BoardView view = 3;                  // kanban / sprint / dependency_graph
}

message ProjectBoard {
    string project_id = 1;
    BoardView view = 2;
    // 按 state 分组的 WorkItem(kanban view)
    map<string, WorkItemSummaryList> columns = 3;
    // 或者依赖图(dependency view)
    optional DependencyGraph dependency_graph = 4;
}
```

### 3.3 权限与认证

- **内部**:mTLS + 白名单服务(identity / conversation / process / governance / member-service / archive)
- **外部**:OAuth2
- **项目可见性**:项目 owner / ProjectMember / 组织审计员可读
- **写操作**:
  - `CreateProject` 需要 owner 的授权
  - `StartProject` 必须有 `kickoff Gate` 决策
  - `ArchiveProject` / `DissolveProject` 必须经 Gate
  - `AssignMember` 必须 owner 或 tech-lead 的 ProjectMember
  - `UpdateToolScope` 扩展出 Role default 的部分必须有 Policy 授权证据

**字段级视图裁剪(ADR-0009)**:本域 Get / List / Query 类 RPC **不接受 Role 参数**,返回全量字段;按 Role 的字段可见性、脱敏、派生字段由 UI 仓消费 method-library 的 ViewProfile 实现。actor 仅用于鉴权(能否读取整个对象)和审计留痕。

### 3.4 常见错误码

- `PROJECT_NOT_FOUND` / `WORKITEM_NOT_FOUND` / `ITERATION_NOT_FOUND`
- `INVALID_STATE_TRANSITION` / `DEPENDENCY_CYCLE` / `WIP_LIMIT_EXCEEDED`
- `DUPLICATE_ACTIVE_PROJECT_MEMBER`(INV-16 违反)
- `GLOBAL_MEMBER_NOT_ACTIVE`(INV-17 违反)
- `TOOL_SCOPE_EXCEEDS_ROLE_DEFAULT`(缺 extra_grants)
- `ARCHIVED_PROJECT_CANNOT_CREATE_WORKITEM`(INV-13)

---

## 四、事件 schema 细节

### 4.1 事件清单

#### Project 级

| 事件 | 订阅方 |
|---|---|
| `work.project.created` | conversation(auto create group)/ observability |
| `work.project.started` | process(创建 ProcessInstance)/ conversation |
| `work.project.paused / resumed` | member-service / process |
| `work.project.archived` | member-service(GracefulShutdown)/ conversation(archive groups)/ artifact(冻结引用)/ archive(准备归档) |
| `work.project.restored` | 所有上述订阅方反向 |
| `work.project.dissolved` | archive(最终归档)/ conversation(group dissolved) |
| `work.project.context_of_use_updated` | governance(可能触发 AIIA 重评)|
| `work.project.aiia_attached` | governance(AIIA 治理联动) |

#### ProjectMember 级

| 事件 | 订阅方 |
|---|---|
| `work.project.member_assigned` | identity(career_entry_added) / member-service(启动容器) / conversation(加入 group.participants) |
| `work.project.member_activated` | conversation(标记可见)|
| `work.project.member_paused / resumed` | member-service(pause/resume 容器) |
| `work.project.member_retired_from_project` | identity(更新 career_entry.status) / member-service(GracefulShutdown) / conversation(移除 participants) |
| `work.project.member_tool_scope_updated` | member-service(推 policy 更新到 Runtime) |
| `work.project.member_policy_overrides_updated` | member-service(同上) |

#### WorkItem 级

| 事件 | 订阅方 |
|---|---|
| `work.workitem.created` | process(如触发 Activity)/ conversation(可选发 Turn 通知) |
| `work.workitem.state_changed` | process(Activity 同步)/ artifact(检查关联 approved 状态)/ observability |
| `work.workitem.assigned` | member-service(通知对应 Member 容器)/ conversation |
| `work.workitem.dependency_added` | process(如触发调度调整) |
| `work.workitem.artifact_attached` | artifact(联动)|

#### Iteration / Backlog 级

| 事件 | 订阅方 |
|---|---|
| `work.iteration.planned` | observability(度量基准)|
| `work.iteration.started` | conversation(发 Sprint 起 Turn) |
| `work.iteration.closed` | artifact(retrospective_artifact 创建)/ observability(velocity 计算) |
| `work.iteration.retrospective_recorded` | artifact(lessons-learned 关联) |
| `work.backlog.refined` | observability |

### 4.2 核心事件 schema 示例

#### work.project.member_assigned

```
type:       work.project.member_assigned
subject:    project_member_id

data: {
    project_member_id,
    project_id,
    global_member_id,
    role_in_project,
    tool_scope_summary,       // allowed + denied + extra_grants 简要
    policy_overrides_summary,
    assigned_by,
    assigned_at,
    trace_id,
}
```

**关键**:

- identity 订阅 → 在 GlobalMember.career_history 添加 `in_progress` 条目
- member-service 订阅 → 触发 `StartMember`(拉镜像 + 启容器 + Register)
- conversation 订阅 → 在项目 group 添加 participant

#### work.workitem.state_changed

```
subject:    workitem_id
data: {
    workitem_id,
    project_id,
    kind,
    previous_state,
    new_state,
    changed_by,
    assignee,                 // 冗余便于过滤
    blocker_note,             // 若 new_state=blocked
    related_artifacts,        // 冗余
    related_gate_id,          // 若通过 Gate 触发
}
```

#### work.project.dissolved

```
subject:    project_id
data: {
    project_id,
    reason,
    dissolved_by,
    related_gate_id,
    retention_policy,         // GDPR 等保留政策
    trace_id,
}
```

**关键**:此事件 **severity=major**,archive 域必须在 24h 内完成最终归档;conversation 必须在 24h 内 archived 所有相关 group(INV-7)。

### 4.3 订阅事件(来自其他域)

| 来源 | 事件 | 本域响应 |
|---|---|---|
| identity | `identity.member.paused` | 所有相关 ProjectMember 转 paused;发 `member_paused` 事件 |
| identity | `identity.member.retired` | 所有相关 ProjectMember 转 retired_from_project;发对应事件 |
| identity | `identity.role.updated` | 查受影响 ProjectMember 清单,触发相关容器的 Role 刷新 |
| process | `process.activity.completed` | **不**强同步 WorkItem 状态(ADR-0008)。Activity 和 WorkItem 是独立状态机,本域仅记录事件到 WorkItem 时间线 / related_turns 便于展示;WorkItem 状态转移由自身工作流驱动(submit_for_review / approve 等) |
| process | `process.activity.auto_action_executed`(ADR-0008) | 按 AutoAction 类型更新对应 WorkItem(defer / reduce_priority / split_off_incomplete / spillover),全部动作留审计 |
| process | `process.activity.artifact_produced` | 更新对应 WorkItem 的 related_artifacts |
| governance | `governance.gate.decided(kickoff)` | state=draft → active 的确认 |
| governance | `governance.gate.decided(archive-confirm)` | state=active → archived |
| governance | `governance.policy.updated` | 重评所有 active ProjectMember 的 tool_scope 合法性 |
| artifact | `artifact.approved` | 检查对应 WorkItem 是否可 done(INV-30) |
| artifact | `artifact.baselined` | 写入 Project.baseline_ids |

### 4.4 事件幂等

- `work.project.member_assigned` 幂等 key:`project_id + global_member_id + version`
- `work.workitem.state_changed` 幂等 key:`workitem_id + previous_state + new_state + at`
- 所有订阅方必须用 event_id LRU 去重(基础保障)

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+

**理由**:
- Project 聚合根的强一致性(ProjectMember / Backlog / Iteration 都是 Project 内部)
- 复杂查询(看板视图 / 依赖图 / 项目搜索)走 SQL 强于 KV
- JSONB 存可变结构(tool_scope / policy_overrides / context_of_use)
- 与 identity / artifact 同栈运维

### 5.2 表结构

#### table: `projects`

| 列 | 类型 | 约束 |
|---|---|---|
| project_id | ULID PK | |
| owner_user_id | varchar(128) | not null |
| title | varchar(512) | not null |
| description | text | |
| context_of_use | jsonb | not null |
| process_template_id | varchar(128) | nullable |
| process_profile_id | ULID | nullable |
| process_instance_id | ULID | nullable |
| backlog_id | ULID | not null FK |
| current_iteration_id | ULID | nullable FK |
| iteration_history | jsonb | default '[]' |
| baseline_ids | jsonb | default '[]' |
| aiia_ref | jsonb | nullable |
| lifecycle | enum | not null |
| created_at / started_at / archived_at / dissolved_at | timestamptz | |
| trace_id | varchar(64) | not null |
| version | bigint | default 1 |

**索引**:
- `idx_projects_owner` on (owner_user_id)
- `idx_projects_lifecycle` on (lifecycle)
- `idx_projects_title_trgm` gin on (title gin_trgm_ops)

#### table: `project_members`

| 列 | 类型 | 约束 |
|---|---|---|
| project_member_id | ULID PK | |
| project_id | ULID | not null FK |
| global_member_id | ULID | not null(引用 identity,不强 FK 跨域) |
| role_in_project | varchar(128) | not null |
| tool_scope | jsonb | not null |
| policy_overrides | jsonb | not null |
| memory_slot_ref | jsonb | nullable |
| current_workitems | jsonb | default '[]' |
| lifecycle | enum | not null |
| assigned_at / activated_at / paused_at / retired_from_project_at | timestamptz | |
| career_entry_ref | jsonb | nullable |
| trace_id | varchar(64) | not null |

**索引**:
- `idx_pm_project_lifecycle` on (project_id, lifecycle)
- `idx_pm_global_member` on (global_member_id)
- **unique partial** index on (project_id, global_member_id) where (lifecycle in ('assigned','active','paused')) —— 强制 INV-16

#### table: `workitems`

| 列 | 类型 |
|---|---|
| workitem_id | ULID PK |
| project_id | ULID FK |
| kind | enum |
| title / description | varchar(512) / text |
| acceptance_criteria | jsonb |
| estimated_effort / actual_effort | jsonb |
| priority | enum |
| assignee | ULID(ProjectMember) nullable |
| reviewers | jsonb |
| watchers | jsonb |
| depends_on / blocks | jsonb |
| blocker_note | text nullable |
| iteration_id | ULID nullable FK |
| related_artifacts | jsonb |
| related_turns | jsonb |
| parent_workitem_id | ULID nullable FK |
| state | enum |
| state_history | jsonb |
| nfr_spec | jsonb nullable(kind=nfr 时必填) |
| created_at / updated_at | timestamptz |
| trace_id | varchar(64) |
| version | bigint |

**索引**:
- `idx_wi_project_state` on (project_id, state)
- `idx_wi_assignee_state` on (assignee, state) where assignee is not null
- `idx_wi_iteration` on (iteration_id) where iteration_id is not null
- `idx_wi_kind_state` on (kind, state)
- `idx_wi_parent` on (parent_workitem_id) where parent_workitem_id is not null

**DAG 约束**(depends_on):
- 每次 `AddDependency` 递归 CTE 检查环
- 失败返回 `DEPENDENCY_CYCLE` 错误码

#### table: `iterations`

| 列 | 类型 |
|---|---|
| iteration_id | ULID PK |
| project_id | ULID FK |
| sequence_num | int |
| name / goal | varchar / text |
| planned_workitems / actual_workitems / spillover_workitems | jsonb |
| started_at / planned_end_at / ended_at | timestamptz |
| retrospective_notes | jsonb nullable |
| retrospective_artifact_ref | jsonb nullable |
| velocity | numeric nullable |
| burndown_data | jsonb nullable |
| state | enum |

**索引**:
- `idx_it_project_seq` on (project_id, sequence_num) unique
- `idx_it_project_state` on (project_id, state)
- **unique partial** on (project_id) where (state='in_progress') —— 强制 INV-43

#### table: `backlogs`

| 列 | 类型 |
|---|---|
| backlog_id | ULID PK |
| project_id | ULID FK unique |
| workitem_refs | jsonb |
| refinement_state | enum |
| last_refined_at | timestamptz |
| total_effort_estimate | jsonb |
| velocity_rolling | jsonb |

#### table: `work_events_outbox`

同 identity / conversation / artifact 的 Outbox 模式。

### 5.3 一致性策略

- **Project 聚合根内的多表更新**(projects / project_members / backlogs)使用单事务
- **WorkItem 的依赖图修改**使用行级锁 + 递归 CTE 环检测(单事务)
- **Iteration.state=in_progress 唯一性**用 unique partial index 保证
- **跨聚合**(Project + WorkItem + Iteration)通过事件最终一致
- **跨域**(work + identity + member-service)通过事件 + 幂等订阅

### 5.4 容量估算

- 10w 活跃项目 × 平均 4 ProjectMember = 40w 活跃 ProjectMember
- 10w 项目 × 平均 50 WorkItem = 500w WorkItem
- 10w 项目 × 平均 10 迭代 = 100w Iteration(大部分已 closed)
- QPS 峰值估:WorkItem 写 200 / 秒,读 2000 / 秒(Console 看板)

### 5.5 读优化

- 看板视图(`GetProjectBoard`)用物化视图 + 增量刷新
- 依赖图查询用递归 CTE,对大项目(> 200 WorkItem)用缓存层
- 历史 Iteration 走读副本

### 5.6 迁移策略

- Schema migration 走 refinery / sqlx-cli
- **INV 变更** 走 migration + backfill,不可直接改约束

---

## 六、与其他域的事件订阅链路

### 6.1 典型场景 A:从用户立项到 Member 上线

```
[T0] 用户在 Chat dm 里说"做读书博客"
  [conversation.turn_posted(dm, author=user)]
    │ Assistant 处理
    ▼
[T1] work.CreateProject(owner=user, title=..., context={ ... })
  [work.project.created]
    │
    ├──→ conversation 订阅:auto create group
    │    [conversation.created(kind=group, project=P1)]
    │
    └──→ observability:记录项目生命周期开始
    
[T2] Assistant / Planner 触发 governance.RaiseGate(kind=kickoff)
  [governance.gate.raised]
    │
    ├──→ conversation:在 dm(或未来 group)发 gate-kind Turn
    │
    ▼
[T3] 用户在 Chat 点 approve
  [governance.gate.decided(kind=kickoff, approve)]
    │
    │ work 订阅
    ▼
[T4] work.StartProject(kickoff_gate_id)
  [work.project.started]
    │
    ├──→ process 订阅:创建 ProcessInstance
    │    [process.instance.created]
    │
    └──→ conversation:在 group 发 message-kind Turn("项目已启动")

[T5] 根据过程模板决定需要哪些 Role → 自动 AssignMember
  [work.project.member_assigned] × N
    │
    ├──→ identity:追加 career_entry(in_progress)
    │    [identity.member.career_entry_added]
    │
    ├──→ member-service:启动容器
    │    [member.launching] → [member.registered] → [member.online]
    │    │ member-service 完成后回调
    │    ▼
    │   work.ActivateProjectMember(pm_id)
    │   [work.project.member_activated]
    │
    └──→ conversation:加入 group.participants
         [conversation.participant_added]
```

### 6.2 场景 B:WorkItem 完整生命周期

```
[T0] 用户 / Tech Lead 提出需求 → Runtime 产出 story
  work.CreateWorkItem(kind=story, title=..., acceptance_criteria=...)
  [work.workitem.created]
    │
    ├──→ 自动放入 Backlog
    │    [work.backlog.refined(若计算优先级)]
    │
    └──→ (可选)在相关 Turn 发 artifact-kind 引用
    
[T1] Iteration planning
  work.PlanIteration(iteration_id, planned_workitems=[story_A])
  [work.iteration.planned]

[T2] 迭代启动
  work.StartIteration(iteration_id)
  [work.iteration.started]
    │
    └──→ conversation:在 group 发 "Sprint N started" Turn

[T3] Assign story_A 给 backend-dev ProjectMember
  work.AssignWorkItem(story_A, pm_id=zhao)
  [work.workitem.assigned]
    │
    └──→ member-service → Runtime:推送 Activity
    
[T4] WorkItem 状态 todo → in_progress
  work.TransitionWorkItemState(story_A, in_progress)
  [work.workitem.state_changed]
    │
    ├──→ process:对应 Activity 已被 Member 处理
    │
    └──→ observability

[T5] Member 产出 code Artifact
  [artifact.created(kind=code)]
  [artifact.approved(经 code-review Gate)]
    │
    │ work 订阅
    ▼
work.UpdateWorkItem(story_A, related_artifacts += code_artifact)

[T6] 提交 in_review
  work.TransitionWorkItemState(story_A, in_review)
  [work.workitem.state_changed]

[T7] Review Gate approve
  [governance.gate.decided(approve)]
    │
    │ work 订阅
    ▼
work.TransitionWorkItemState(story_A, done)
  [work.workitem.state_changed(done)]
    │
    └──→ 检查 INV-30:related_artifacts 至少一个 approved ✓
```

### 6.3 场景 C:项目归档与解散

```
项目完成 / 中止 → governance.Gate(kind=archive-confirm)批准
  [governance.gate.decided(archive-confirm, approve)]
    │
    │ work 订阅
    ▼
work.ArchiveProject(project_id)
  [work.project.archived]
    │
    ├──→ 级联转 所有 ProjectMember → archived(INV-19)
    │    [work.project.member_archived] × N
    │
    ├──→ conversation:group 和所有 channel archived
    │    [conversation.archived] × M
    │
    ├──→ member-service:对所有相关容器触发 GracefulShutdown
    │
    ├──→ process:ProcessInstance → completed / cancelled
    │
    └──→ archive:准备归档包(archive 仓处理 AIIA / SoA / ComplianceDeclaration 汇总)

(几个月或几年后,合规要求彻底解散)
governance.Gate(kind=dissolve-confirm) 批准
  work.DissolveProject(project_id)
  [work.project.dissolved]
    │
    └──→ archive:最终归档 + GDPR 场景下触发数据处理
```

### 6.4 GlobalMember lifecycle 的影响传递

identity.member.retired 触发的链路(对齐 identity §六.3 场景 C):

```
[identity.member.retired(member=Zhao)]
    │
    │ work 订阅
    ▼
查找所有 Zhao 的 ProjectMember,lifecycle ∈ {assigned, active, paused}
    │
    ▼
每个 ProjectMember 触发:
  work.RetireMemberFromProject(pm_id, reason="global retired")
  [work.project.member_retired_from_project]
    │
    ├──→ identity:career_entry.status → completed
    │
    ├──→ member-service:GracefulShutdown 容器
    │
    └──→ conversation:从 group.participants 移除
```

---

## 七、性能与可用性目标

### 7.1 业务指标

| 指标 | 目标 | 说明 |
|---|---|---|
| CreateProject P95 | < 200ms | 含 Backlog 初始化 |
| CreateWorkItem P95 | < 100ms | |
| TransitionWorkItemState P95 | < 150ms | 含事件 Outbox |
| GetProjectBoard P95 | < 300ms | 看板视图 |
| GetWorkItem Dependency Graph P95 | < 500ms | 深度 < 5 |
| AssignMember P95 | < 300ms | 含跨域事件触发 |
| Availability | ≥ 99.9% | 业务关键 |

### 7.2 容量假设

- 10w 活跃项目,40w 活跃 ProjectMember
- 500w 活跃 WorkItem
- 峰值 CreateWorkItem 200 QPS
- 峰值看板查询 2000 QPS
- 依赖图查询深度典型 < 7

### 7.3 降级策略

- member-service 不可达:AssignMember 仍写入 work 域,但返回 `pending_container_start`,member-service 恢复后重试
- identity 查询超时:ResolveMemberForContainer 用缓存快照,容器启动标记 `stale_identity`(审计可见)
- governance 不可达:Gate 触发类事件入 outbox 积压,不阻塞 work 写入
- 看板视图高并发:降级为只读副本 + 缓存

### 7.4 监控关键点

- Project 状态分布(draft / active / paused / archived / dissolved)
- ProjectMember 活跃数
- WorkItem 积压(todo > 某阈值的项目)
- Iteration velocity 异常(突升 / 突降)
- 依赖 DAG 检测的失败次数(INV-33)
- tool_scope 扩展 extra_grants 使用频率(安全关键)

---

## 八、安全与合规对齐

### 8.1 42001 控制项对齐

| 控制族 | 项 | 本域落地 |
|---|---|---|
| A.3 | AI Actor 责任链 | ProjectMember.global_member_id 串联责任链 |
| A.5 | AIIA | Project.aiia_ref(INV-10) |
| A.6 AI Life Cycle | Inception → Retirement | Project 生命周期状态机完整覆盖 |
| A.6 | Operation | ProjectMember.lifecycle + 容器编排 |
| A.6 | Re-evaluation | AIIA 重评通过 context_of_use_updated 事件触发 |
| A.7 | Data for AI | memory_slot_ref(ADR-0006) |
| A.9 | Responsible Use | policy_overrides 不得放宽组织 shared_rules(INV-23) |

### 8.2 24748-2 对齐

- Project 生命周期模型选型(process_template_id)直接映射 24748-2 的 8 种生命周期模型
- context_of_use.compliance_profile 驱动 ProcessProfile 的 Tailoring
- Baseline 引用对齐 24748-2 Baseline 语义

### 8.3 29110 Profile 对齐

- Project.process_profile_id 就是 29110 Profile 的落地
- tool_scope + policy_overrides 是 Profile Tailoring 的运行时表达
- `custom` profile_group 作为组织级自定义 Profile

### 8.4 25010 Context of Use 对齐

- `context_of_use.target_users` / `deployment_env` / `quality_priorities` 直接对齐 25010 §5.1
- NFR 作为 WorkItem(kind=nfr)+ NFRSpec 对齐 25010 §5.3

### 8.5 Scrum / Kanban 对齐

- Scrum 5 事件(Planning / Daily / Review / Retro / Refinement)通过 conversation 的 Turn + Iteration 的 retrospective_notes 承载
- Kanban Flow(WIP limit / Pull / Cadence)通过 Board View + Policy 实现
- Sprint Backlog = Iteration.planned_workitems(不单独建聚合)

### 8.6 横切红线

- **可审计性**:所有生命周期事件 append-only;audit_log_ref 贯穿
- **可追溯性**:Project → Iteration → WorkItem → Artifact 链完整;related_turns 反查对话
- **可裁剪性**:tool_scope / policy_overrides 项目级裁剪;Iteration 可选不用(Kanban 模式)

---

## 九、测试策略

### 9.1 单元测试重点

- **Project 状态机**:INV-2 / INV-7 / INV-8 / INV-9 全覆盖
- **ProjectMember 状态机**:INV-16(unique partial index)/ INV-17(active 校验)/ INV-19 级联
- **WorkItem 状态机**:INV-29 到 INV-40 全覆盖,特别是 INV-30 done 必须有 approved Artifact
- **依赖 DAG**:尝试添加成环立即拒
- **Iteration 唯一 active**:INV-43 并发测试
- 关键聚合覆盖率 ≥ 90%

### 9.2 集成测试重点

- Project + Backlog + Iteration + WorkItem 的单事务一致性
- Outbox 事件发布幂等
- 跨 ProjectMember 的 unique partial index 并发
- tool_scope 扩展 extra_grants 的 Policy 校验链路

### 9.3 E2E 场景

- 场景 A(用户立项 → Member 上线)完整链路
- 场景 B(WorkItem 生命周期)完整链路
- 场景 C(项目归档 + 解散)级联影响
- GlobalMember retire 触发 work 级联

### 9.4 性能压测

- 200 QPS CreateWorkItem 持续 30 分钟
- 2000 QPS GetProjectBoard 并发
- 依赖图查询深度 10 的大项目(含 500 WorkItem)

### 9.5 安全测试

- 非 owner 创建 Project 被拒
- 非 owner / tech-lead AssignMember 被拒
- tool_scope 未声明 extra_grants 扩出 Role default 被拒
- policy_overrides 尝试放宽组织 shared_rules 被拒
- archived / dissolved 项目新创建 WorkItem 被拒

---

## 十、开放问题

### Q1. 多 owner / 共享 Project 的场景

**背景**:INV-11 只有单 owner_user_id。企业场景可能需要多 owner 或团队负责。

**候选**:
- A 维持单 owner(简单)
- B 引入 `owners: Vec<UserId>`,主 owner 有特殊权限
- C 独立的 ProjectAccessControl 机制(RBAC)

**倾向**:A 起步,企业场景触发时走 ADR 扩 B 或 C

**推进**:多租户 / 企业功能阶段决策。

### Q2. Iteration 的可选性语义

**背景**:Kanban 项目无 Iteration,但产品层面可能仍需"周期节点"来做评审。

**候选**:
- A Kanban 项目强制使用"复评 Iteration"(名义上 Iteration,含 goal=review-cadence)
- B Kanban 项目无 Iteration,评审节点通过 Gate 触发
- C 引入独立 `Cadence` 实体(未来 L1 新增)

**倾向**:B

**推进**:Kanban 项目大量使用时评估;走 ADR。

### Q3. WorkItem 的 epic 与子任务层级

**背景**:INV-39 支持 parent_workitem_id,但只支持 1 层。epic → story → sub-task 多层如何?

**候选**:
- A 多层递归(parent_workitem_id 可链式)
- B 只支持 2 层(epic → story 一层,story → task 另一层)
- C 不支持 epic(只在 story 层组织)

**倾向**:A(灵活)

**推进**:UX 设计 + 原型阶段决策。

### Q4. ProjectMember 的 tool_scope 扩展授权机制

**背景**:INV-21 要求 extra_grants 带证据。授权流程如何?

**候选**:
- A 每次扩展必须经 Gate
- B 组织 Policy 预批准某些扩展(如 backend-dev 可扩 deploy 工具)
- C 完全由 ProjectMember 的 role_in_project 决定,无单独扩展流程

**倾向**:A + B 组合

**推进**:governance Policy 机制落地后走 ADR。

### Q5. 已 archive 项目的恢复限制

**背景**:archive → restore 当前无时间限制。archive 数年后 Role 定义 / 工具栈大变,还能 restore 吗?

**候选**:
- A 无限制(restore 后容器用当时镜像版本)
- B 有时间窗口(如 2 年),过期必须 dissolve 或"迁移 restore"(升级后恢复)
- C 每次 restore 需 Gate,评估是否需要"迁移"

**倾向**:C

**推进**:archive 域详细设计时 + 归档实际使用触发。

### Q6. 跨项目的 Backlog 共享 / 复制

**背景**:同类项目启动时,希望从相似项目复制 Backlog 起步。

**候选**:
- A 不支持,每项目独立
- B 支持显式 clone(复制 WorkItem 结构 + references 关系)
- C 从 method-library 的 ProcessTemplate 带初始 Backlog 模板

**倾向**:C(一致)+ B(特殊场景)

**推进**:Marketplace 阶段决策。

### Q7. GlobalMember pause 对 ProjectMember 的传导

**背景**:`identity.member.paused` 触发所有相关 ProjectMember 转 paused。是否总是正确?

**候选**:
- A 严格级联(当前方案)
- B 允许 ProjectMember 层面"独立"(GlobalMember paused 不自动传导,要人工触发)
- C 按 Role / Project 的策略决定

**倾向**:A(一致性优先)

**推进**:实际使用中观察,原则变更走 ADR。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-work` 仓 README(段 3)

- §二 聚合根 → src/domain/
- §三 RPC → proto/
- §四 事件 → src/events/
- §五 持久化 → migrations/
- §六 跨域 → src/subscriptions/
- §九 测试 → tests/

### 11.2 与 `domain/identity/README.md`

- 本域 ProjectMember 引用 identity.GlobalMember,不反向
- career_entry 双向同步(本域 AssignMember → identity append career)
- Memory slot 的 ref 在 identity(ADR-0006),本域只引用

### 11.3 与 `domain/process/README.md`(待写)

- Project.process_template_id / process_profile_id / process_instance_id 都指向 process 域
- WorkItem ↔ Activity 弱绑定(`六域模型.md` §5.6)—— **两套独立状态机**,不同步字段(ADR-0008)
- 项目完成判据以 **WorkItem 为准**,不以 ProcessInstance.completed 为准(ADR-0008)
- Activity 完成时如何处理未完成的 related_workitems 由 `ActivityDef.completion_policy` 决定;本域**不被动同步** WorkItem 状态,只记录事件到时间线
- 过程模板的 Gate 定义来自 process 域,但由 governance 决策

### 11.4 与 `domain/conversation/README.md`

- Project 与 group 的 1:1 绑定(INV-14)
- project.member_assigned 驱动 conversation.participant_added
- project.archived 级联 conversation.archived

### 11.5 修订纪律

- 5 个聚合根的字段 / 不变量 / 状态机 修改必须 ADR
- 事件 schema breaking 变更必须 ADR
- RPC breaking 走 proto 版本策略 + 2 个 minor 过渡
- WorkItem kind 新增 / 删除必须 ADR
- tool_scope 语义 / extra_grants 机制 修改必须 ADR

---

## 十二、总结

本文把工作域从"一节六域模型叙事"展开到"可以实现"的程度。关键产出:

1. **Project + ProjectMember + Backlog + WorkItem + Iteration 五聚合完整设计**
2. **46 条不变量**(INV-1 到 INV-46)覆盖五聚合
3. **双层 Member 模型**在本域的具体落地(配合 identity / member-service)
4. **7 种 WorkItem kind** + **6 种状态机状态**的精细化
5. **NFR 作为 WorkItem** 承载 25010(不另建 NFR 系统)
6. **Scrum + Kanban 双模态**统一表达
7. **7 个开放问题**覆盖多 owner / Iteration 可选性 / epic 层级 / 扩展授权 / 恢复限制 / 跨项目复用 / pause 传导

**关键承诺**:

- Project 是 AI 协作的核心单元,有完整生命周期
- ProjectMember 是双层 Member 的"项目分配层",严格 INV-16 唯一性
- WorkItem 7 kind 硬枚举 + 状态机强约束
- 依赖 DAG 严格保证
- Scrum / Kanban 不在代码硬编码,由 ProcessTemplate 选择

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 节 |
|---|---|---|
| INV-1 | project_id 永不复用 | §2.1.3 |
| INV-2 | dissolved 单向 | §2.1.3 |
| INV-3 | archived / dissolved 必填时间戳 | §2.1.3 |
| INV-4 | process_profile_id 不可更换 | §2.1.3 |
| INV-5 | compliance_profile 修改需 Gate | §2.1.3 |
| INV-6 | baseline_ids 只 append | §2.1.3 |
| INV-7 | dissolved 24h 内级联 conv archived | §2.1.3 |
| INV-8 | 有活跃 iteration 不能 archive | §2.1.3 |
| INV-9 | active 需 kickoff Gate 证据 | §2.1.3 |
| INV-10 | aiia_ref 在特定条件必填 | §2.1.3 |
| INV-11 | owner_user_id 不可修改 | §2.1.3 |
| INV-12 | 关键字段修改发事件 | §2.1.3 |
| INV-13 | 已 archived/dissolved 不可新创建 | §2.1.3 |
| INV-14 | Project 1:1 绑定 group | §2.1.3 |
| INV-15 | active 时 process_instance_id 非空 | §2.1.3 |
| INV-16 | 同 (project, global_member) 唯一 active/paused ProjectMember | §2.2.3 |
| INV-17 | global_member_id 指向的 GlobalMember 必须 active/paused | §2.2.3 |
| INV-18 | retired_from_project 单向 | §2.2.3 |
| INV-19 | Project archived 时 ProjectMember 级联 archived | §2.2.3 |
| INV-20 | Project dissolved 时 ProjectMember archived | §2.2.3 |
| INV-21 | tool_scope 必须 Role default 子集或 extra_grants | §2.2.3 |
| INV-22 | denied_tools 优先级高 | §2.2.3 |
| INV-23 | policy_overrides 不得放宽 shared_rules | §2.2.3 |
| INV-24 | memory_slot_ref active 必须有效 | §2.2.3 |
| INV-25 | role_in_project 与 Global 不同需理由 | §2.2.3 |
| INV-26 | 每 Project 唯一 Backlog | §2.3.2 |
| INV-27 | Backlog order_index 连续 | §2.3.2 |
| INV-28 | done/cancelled 从 Backlog 移到 history | §2.3.2 |
| INV-29 | workitem_id 永不复用 | §2.4.5 |
| INV-30 | done 必须有 approved Artifact | §2.4.5 |
| INV-31 | blocked 必须 blocker_note | §2.4.5 |
| INV-32 | in_progress 必须 assignee | §2.4.5 |
| INV-33 | 依赖图 DAG | §2.4.5 |
| INV-34 | cancelled 单向 | §2.4.5 |
| INV-35 | state 严格状态机 | §2.4.5 |
| INV-36 | nfr kind 必填 nfr_spec | §2.4.5 |
| INV-37 | bug kind 必须复现步骤 | §2.4.5 |
| INV-38 | assignee 必须 active ProjectMember | §2.4.5 |
| INV-39 | parent/child 不跨 project | §2.4.5 |
| INV-40 | 依赖不跨 project | §2.4.5 |
| INV-41 | iteration_id 永不复用 | §2.5.3 |
| INV-42 | sequence_num 严格递增 | §2.5.3 |
| INV-43 | 同 project 唯一 in_progress iteration | §2.5.3 |
| INV-44 | closed/cancelled 单向 | §2.5.3 |
| INV-45 | in_progress 必须 started_at | §2.5.3 |
| INV-46 | closed 必须 ended_at + actual_workitems | §2.5.3 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | Project / WorkItem / Iteration / Backlog / ProjectMember 各一职 |
| OCP | WorkItem kind / ProcessTemplate 可扩展(走 ADR);NFR 通过 kind+spec 挂 25010 |
| DIP | ProjectMember 依赖 GlobalMember ID 不强 FK 跨域(事件驱动同步) |
| DRY | Scrum / Kanban 共用同一 WorkItem / Iteration,不重复 |
| KISS | Iteration 可选(Kanban 项目不用);Backlog 无 Sprint Backlog 独立实体 |
| YAGNI | epic 层级留开放问题(Q3);多 owner 不在起步支持 |
| 不可变优先 | state_history 记录转移;事件 append-only |
| 显式优于隐式 | 46 条不变量 |
| Fail Fast | 非法 state 转移 / 依赖成环立即拒 |
| 幂等性 | Outbox + 乐观锁 + partial unique index |

---

## 附录 C:订正标记

- [ ] §2.1.1 Project 字段中 `baseline_ids` 结构待 artifact 域 Baseline 定稿后复核
- [ ] §2.2.1 ProjectMember 的 career_entry_ref 精确结构待 identity 域进一步定稿
- [ ] §5.2 Workitems 表的 jsonb 子结构待段 3 压测后调优
- [ ] §Q4 tool_scope 扩展授权机制待 governance Policy 机制详细设计后决策
- [ ] §Q5 archived 恢复时间窗口待 archive 域详细设计后决策

---

> 本文是 Quantalithos A 方案段 2 的第五件文档。工作域的详细设计以本文为单一真相源。双层 Member 模型的项目分配层在本域落地,与 identity(档案层)+ L2 Member 运行层(容器层)共同构成完整体系。
