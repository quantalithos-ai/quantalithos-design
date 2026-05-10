# process — 过程域详细设计

> **域定位**:过程域的详细设计文档。回答"按什么规矩推进"。聚合根是 **ProcessTemplate** / **ProcessProfile** / **ProcessInstance**;Activity 是 Instance 内部实体;Token 是运行时值对象。
>
> **上游依据**:
> - `product/最终目的.md` §3.5 关键节点强制人类 + §3.6 过程始终可观察
> - `product/六域模型.md` §六 过程域
> - `architecture/仓库拆分方案.md` §4.4 `quantalithos-process`
> - `architecture/标准对齐全景图.md` §一 / §三.1
> - `architecture/ai-member设计.md` §七 运行时协作时序
> - `methodology/standards-discussion/BPMN-2.0.md` 全套(过程域的图模型基石)
> - `methodology/standards-discussion/SPEM-2.0.md`(Definition vs Use 分离)
> - `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(8 种生命周期模型 + Tailoring)
> - `methodology/standards-discussion/ISO-IEC-29110.md`(Profile 裁剪机制)
> - `domain/governance/README.md`(Gate 是 Activity 挂起态的决策对象)
> - `domain/work/README.md`(Project / WorkItem / Iteration 的过程绑定)
> - 14 标准主对齐:**BPMN 2.0 + SPEM 2.0 + 24748-2 + 29110**;次对齐:12207 / LangGraph / Temporal
>
> **本文不承载**:Method Content 内容本身(在 method-library)/ Activity 的实际执行(在 L2 Member 运行层)/ Gate 决策逻辑(在 governance)/ 对话 UI(在 conversation / Chat)。

---

## 一、使命与边界

### 1.1 使命

**承载"按什么规矩推进"—— Quantalithos 过程执行的技术引擎**。

本域是 **BPMN 2.0 引擎 + SPEM 2.0 Definition/Use 分离 + 29110 Profile 裁剪 + Temporal 持久执行** 四套国际标准和成熟模式的综合落地。

具体职责:
- **ProcessTemplate 聚合根**:通用过程模板(SPEM Method Content 的服务端索引 + 执行能力)
- **ProcessProfile 聚合根**:被裁剪后的 Template,绑定具体 Project(29110 Tailoring)
- **ProcessInstance 聚合根**:运行时实例(BPMN Process + Temporal Checkpoint)
- **Activity 实体**:Instance 内部执行单位(BPMN Activity 的领域化)
- **Token 值对象**:BPMN Token 的实现(并行 / Gateway 的 flow control)
- **Stage 概念**:24748-2 阶段的时间段承载(Instance 的"时间切片")

### 1.2 边界(不做的事)

- **不存 Method Content 内容** —— 那在 `method-library` 仓,本域只持**索引 + 执行能力**
- **不实现 Activity 的业务逻辑** —— 那在 L2 Member 运行层(Runtime 执行)
- **不做 Gate 决策** —— 那在 governance,本域只**发起** Gate(Activity 挂起时)
- **不做 WorkItem 管理** —— 那在 work,Activity ↔ WorkItem 弱绑定(`六域模型.md` §5.6)
- **不做 Artifact 产出** —— 本域触发 Artifact 事件,artifact 域执行持久化
- **不做 Sprint Planning / Backlog** —— 那在 work,过程域只**消费** Iteration 边界

### 1.3 与其他域的协作全景

```
┌──────────────────────────────────────────────────────────────────┐
│  process 域(本文)                                                │
│  ProcessTemplate(索引) + ProcessProfile + ProcessInstance       │
│  + Activity + Token                                               │
└──┬────────────────┬────────────────┬───────────────────┬─────────┘
   │ 索引引用        │ 发事件          │ 发事件            │ 订阅事件
   ▼                ▼                ▼                   ▼
 method-library   governance       work / artifact     governance / work /
 (Method Content) (Gate 挂起决策)  / identity / L2    artifact / identity
                                   (Activity 执行)
```

### 1.4 与"八条原则"的对应

对齐 `六域模型.md` §2.3 八条原则:
- **B** Definition vs Use 严格分离 → 本域核心设计决策(三段式)
- **E** Gate 是一等流程控制对象 → Activity.waiting_gate 状态驱动 governance
- **F** 过程模板+裁剪+实例三段式 → 本域三聚合根结构
- **H** 可观察性内置 → 每次 Activity 状态转移 + checkpoint 都发事件

---

## 二、聚合根详细设计

### 2.1 ProcessTemplate 聚合根

> **重要边界澄清**:ProcessTemplate 的"内容"(Activity 定义 / Role 要求 / Artifact 要求)**存在 method-library** 仓(SPEM Method Content)。本域的 ProcessTemplate 只存**索引 + 运行时执行能力**(BPMN 引擎能识别的结构化数据)。
>
> 为什么不全放 method-library?因为 process 引擎需要**高频查询 + 严格一致性**,跨仓调用性能不够。方案:method-library 是**内容源(source of truth)**,process 持有**执行副本(执行时需要的结构化形式)**,通过事件同步。

#### 2.1.1 完整字段

```
ProcessTemplate {
    template_id:             ULID,

    // SPEM 元数据(与 method-library 同步)
    family:                  TemplateFamily,        // 24748-2 八种之一
    display_name:            String,
    version:                 Semver,
    spec_source:             MethodContentRef {     // → method-library
        method_content_id:   ULID,
        method_content_version: Semver,
        last_synced_at:      Timestamp,
    },

    // BPMN 执行结构(从 Method Content 派生的结构化形式)
    lifecycle_model:         LifecycleModelSpec {
        stages:              Vec<StageSpec {
            stage_id:        String,               // 如 "concept" / "development"
            display_name:    String,
            order:           i32,
            entry_criteria:  Vec<CriterionExpr>,   // 进入条件
            exit_criteria:   Vec<CriterionExpr>,   // 退出条件
        }>,
        stage_sequence_mode: enum {
            linear,                                 // 线性(瀑布)
            iterative,                              // 迭代(可回退)
            parallel,                               // 部分并行(V 模型右腿)
            event_driven,                           // 事件驱动(DevOps)
        },
    },
    activity_graph:          BPMNActivityGraph {
        activities:          Vec<ActivityDef>,
        sequence_flows:      Vec<SequenceFlowDef>,
        gateways:            Vec<GatewayDef>,
        events:              Vec<EventDef>,
    },

    // Role 和 Artifact 契约
    roles_required:          Vec<RoleRef>,         // identity Role 引用
    artifacts_required:      Vec<ArtifactKindSpec { // 各阶段预期产出
        kind:                ArtifactKind,
        at_stage:            String,
        optional:            bool,
    }>,

    // Gate 配置
    gates_required:          Vec<GateRequirementSpec {
        gate_id_in_template: String,               // 模板内标识
        kind:                GateKind,
        at_activity:         Option<String>,       // 绑定到哪个 Activity 出口
        at_stage_transition: Option<StageTransition>,  // 或阶段转换点
        decision_maker:      DecisionMakerSpec,
        autonomy_level:      AutonomyLevel,
        mandatory:           bool,                 // 是否强制(裁剪时能否跳过)
    }>,

    // 生命周期
    lifecycle:               TemplateLifecycle,    // draft / published / deprecated / retired
    published_at:            Option<Timestamp>,
    retired_at:              Option<Timestamp>,

    // 审计
    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
    source_check:            SourceCheckMeta {     // 与 method-library 一致性
        source_fingerprint:  String,               // Method Content 哈希
        verified_at:         Timestamp,
    },
}

ActivityDef {
    activity_id:             String,               // 模板内唯一
    name:                    String,
    kind:                    BPMNActivityKind,     // user-task / service-task / manual-task /
                                                   //  sub-process / call-activity / send-task / receive-task
    assignable_roles:        Vec<RoleRef>,         // 可承担的 Role
    inputs:                  Vec<ArtifactInputSpec>,
    outputs:                 Vec<ArtifactOutputSpec>,
    timeout:                 Option<Duration>,
    retry_policy:            RetryPolicy,
    on_gate_trigger:         Option<GateRequirementRef>,  // Activity 挂起时触发哪个 Gate
    completion_policy:       CompletionPolicy,     // complete 时如何处理 related_workitems
                                                   //  (见 ADR-0008,四种策略)
                                                   //  未指定时默认 auto_complete
}

// ADR-0008 引入:Activity 想 complete 时,如何处理 related_workitems 的策略
CompletionPolicy = oneof {
    auto_complete {},                              // 默认:纯流程节点,不检查 WorkItem
    enforce_workitems_done {                       // 强制对齐:卡住直到全部 done
        on_incomplete:       BlockBehavior,        // block / wait
        wait_timeout:        Option<Duration>,
        on_timeout:          enum { raise_gate / fail_activity },
    },
    raise_gate {                                    // 必起 Gate 人类决策(复用已有 kind)
        gate_kind:           GateKind,              // quality-gate / design-choice / release-confirm
        evidence:            EvidenceRequirementSpec,
        decision_maker:      DecisionMakerSpec,
        autonomy_level:      AutonomyLevel,
    },
    try_auto_then_gate {                           // 先试 AutoAction,处理不了再 Gate
        auto_actions:        Vec<AutoActionSpec>,  // defer / reduce_priority / split / spillover
        required_autonomy_level: AutonomyLevel,    // Policy 需授权至此级别,否则退化为 Gate
        on_unhandled:        GateRequirementSpec,
    },
}
```

#### 2.1.2 八种 Template 家族(24748-2)

```
waterfall-classic           瀑布
v-model                     V 模型
incremental-release         增量发布
evolutionary-discovery      演进式
iterative-standard          标准迭代(默认)
spiral-risk-driven          螺旋
agile/scrum                 敏捷 Scrum
agile/kanban                敏捷 Kanban
agile/safe                  敏捷 SAFe
devops-continuous           DevOps
```

**扩展**通过 method-library 发布新 Template,本域索引刷新。

#### 2.1.3 生命周期状态机

```
[创建] → draft → publish → published → deprecate → deprecated → retire → retired
         (草稿)  (Gate)    (可被 Profile 引用)  (不建议新用)           (不再可用)
```

#### 2.1.4 不变量(INV-1 到 INV-10)

**INV-1** `template_id` 永不复用
**INV-2** `lifecycle=retired` 单向
**INV-3** 有任何 active ProcessProfile 引用时,不允许 retire Template
**INV-4** Template published 前必须经 governance.Gate(kind=template-publish)
**INV-5** Template published 后**不可修改** `activity_graph` / `lifecycle_model` / `gates_required`(要改发新版本 + supersede)
**INV-6** `spec_source` 指向的 method-library Method Content 必须已发布
**INV-7** `source_fingerprint` 与 method-library 的 Method Content 不一致时,**拒绝新 Profile 创建**(一致性保护),发 `process.template.source_drift` 告警
**INV-8** `family` 定义后不可修改
**INV-9** `activity_graph` 必须是**合法 BPMN 2.0 图**(通过引擎 schema 校验)
**INV-10** `gates_required.mandatory=true` 的 Gate 必须**无法在 Profile 中裁剪掉**(下游 Profile 约束)

### 2.2 ProcessProfile 聚合根(29110 Tailoring 载体)

#### 2.2.1 完整字段

```
ProcessProfile {
    profile_id:              ULID,
    project_id:              ProjectId,            // 1:1 绑定 Project
    template_id:              TemplateId,
    template_version:         Semver,

    // 29110 Profile Group
    profile_group:            ProfileGroup,        // entry / basic / intermediate / advanced / custom
    tailoring_level:          TailoringLevel,      // tight / moderate / loose

    // 裁剪决策(24748-2 §5.3 Tailoring Record 格式)
    tailoring_decisions:      Vec<TailoringDecision {
        decision_id:          String,
        action:               TailoringAction,     // reduction / extension / adaptation
        target:               TailoringTarget {
            target_type:      enum { activity / gate / role_requirement / artifact_requirement / stage },
            target_id:        String,
        },
        change_detail:        String,              // 改动描述
        rationale:            String,              // 理由
        risk_mitigation:      String,              // 风险缓解
        approved_by:          ActorRef,
        approved_via_gate:    GateRef,
        effective_from:       Timestamp,
    }>,

    // 生效的运行结构(Template + tailoring_decisions 合并后)
    effective_activity_graph: BPMNActivityGraph,   // 裁剪后的执行图
    effective_gates_required: Vec<GateRequirementSpec>,

    // 生命周期
    lifecycle:                ProfileLifecycle,    // draft / active / superseded / retired
    effective_from:           Timestamp,
    effective_until:          Option<Timestamp>,

    supersedes:               Option<ProfileId>,
    superseded_by:            Option<ProfileId>,

    // 审计
    trace_id:                 TraceId,
    audit_log_ref:            AuditLogRef,
}
```

#### 2.2.2 关键设计:Profile = Template + Tailoring 的确定性快照

Profile 一旦 active,**整个 Project 生命周期不可修改**(对齐 `domain/work/README.md` INV-4):

- `effective_activity_graph` 和 `effective_gates_required` 在 active 时冻结
- 要调整过程必须发新 Profile(supersede)+ work 域 Project 决定是否切换(实际上 INV-4 work 说 Project 不可换 Profile,所以现实做法是**新项目用新 Profile**)

这个约束强是为了**避免 Activity 运行时脚下的图被改**(并发安全 + 可追溯)。

#### 2.2.3 不变量(INV-11 到 INV-17)

**INV-11** `profile_id` 永不复用
**INV-12** Profile active 后 `effective_activity_graph` / `effective_gates_required` 不可修改
**INV-13** `tailoring_decisions` 只 append(不可修改历史);纠正通过新 decision 附加
**INV-14** 裁剪必须保留 `mandatory=true` 的 Gate(INV-10 对偶)
**INV-15** `profile_group=custom` 必须有完整 `tailoring_decisions` 证据(不允许"无裁剪声明就叫 custom")
**INV-16** Profile active 前必须经 governance.Gate(kind=profile-activate)
**INV-17** superseded 必须有 superseded_by

### 2.3 ProcessInstance 聚合根

#### 2.3.1 完整字段

```
ProcessInstance {
    instance_id:             ULID,
    project_id:              ProjectId,
    profile_id:              ProfileId,            // 引用 Profile

    // 运行时状态
    state:                   InstanceState,        // draft / running / paused / completed / failed / cancelled
    current_stage:           Option<StageId>,      // 24748-2 Stage
    current_activities:      Vec<ActivityId>,      // 当前进行中的 Activity(可并行)
    completed_activities:    Vec<ActivityRef>,     // 已完成
    pending_gates:           Vec<GateRef>,         // 当前挂起的 Gate

    // Token(BPMN Token 模型,并行 Gateway)
    active_tokens:           Vec<Token {
        token_id:            String,
        at_node_id:          String,               // 当前所在节点
        created_from_gateway: Option<String>,       // 由哪个 gateway 产生
    }>,

    // Checkpoint(Temporal 持久执行)
    checkpoint:               Checkpoint {
        checkpoint_id:        ULID,
        snapshot_at:          Timestamp,
        complete_state:       jsonb,                // 完整状态快照(用于崩溃恢复)
        reasoning_trace:      Option<ReasoningTraceRef>,  // 指向 observability
        parent_checkpoint_id: Option<ULID>,         // 链式
    },

    // 时间
    started_at:               Option<Timestamp>,
    ended_at:                 Option<Timestamp>,
    last_activity_at:         Timestamp,

    // 审计
    trace_id:                 TraceId,             // 整个 Instance 的根 trace
    audit_log_ref:            AuditLogRef,
    version:                  u64,
}
```

#### 2.3.2 状态机

```
             [CreateInstance + Start]
                     │
                     ▼
                ┌─────────┐
                │  draft  │  Profile 已绑定,但未执行
                └────┬────┘
                     │ start
                     ▼
                ┌─────────┐
                │ running │  正常执行
                └──┬───┬──┘
                   │   │
       [pause]     │   │      [any activity fails]
                   │   │
                   ▼   ▼
             ┌────────┐ ┌────────┐
             │ paused │ │ failed │
             └───┬────┘ └────────┘
                 │ resume
                 ▼
             回 running
                 │
                 │ [all activities completed / explicit complete]
                 ▼
             ┌──────────┐
             │completed │
             └──────────┘

         任意状态下可 cancel → cancelled(单向)
```

#### 2.3.3 不变量(INV-18 到 INV-30)

**INV-18** `instance_id` 永不复用
**INV-19** 同 project 在同一时刻最多有**一个 running 或 paused** ProcessInstance(Project 与 Instance 1:1)
**INV-20** `state=running` 必须 `current_activities` 非空(或所有 activities 都处于 waiting_gate 状态)
**INV-21** `current_activities` 必须是 Profile.effective_activity_graph 里声明的 Activity
**INV-22** `active_tokens` 的位置必须指向合法节点(activity / gateway / event)
**INV-23** Instance 的 Activity 状态转移必须遵守 BPMN 2.0 语义(验证 sequence_flow 和 gateway 条件)
**INV-24** `checkpoint` **每次 Activity 完成后立即更新**(Temporal 模式,对齐 ai-member 设计 RT5)
**INV-25** checkpoint 写失败**3 次重试**后,Instance 进 failed 状态
**INV-26** `completed` 状态必须所有 Activity 都是 completed 状态,没有 pending_gate
**INV-27** `cancelled` 单向
**INV-28** `failed` 可恢复(通过 recovery Activity + explicit resume),也可转 cancelled
**INV-29** `reasoning_trace` 必须完整持久化(42001 可解释性,ai-member 设计 RT6)
**INV-30** Instance pause / cancel 时,所有 pending_gates **必须级联 cancel**(governance 订阅)

### 2.4 Activity 实体(Instance 内部)

#### 2.4.1 完整字段

```
Activity {
    activity_id:             ULID,                 // 运行时生成
    instance_id:             InstanceId,
    stage:                   Option<StageId>,      // 所属 Stage
    definition_ref:          ActivityDefRef,       // 指向 Profile.effective_activity_graph 的定义

    // BPMN 分类
    kind:                    BPMNActivityKind,     // user-task / service-task / manual-task /
                                                   //  sub-process / call-activity / send-task / receive-task /
                                                   //  gateway / start-event / end-event / intermediate-event

    // 执行绑定
    assignee:                Option<AssigneeRef>,  // ProjectMember(Runtime 执行)/ user / system
    inputs:                  Vec<ArtifactRef>,
    outputs:                 Vec<ArtifactRef>,
    related_workitems:       Vec<WorkItemRef>,

    // 状态
    state:                   ActivityState,        // scheduled / in_progress / waiting_gate /
                                                   //  completed / failed / skipped / cancelled

    // Gate 挂起
    pending_gate_id:         Option<GateRef>,      // 若 state=waiting_gate
    gate_timeout_at:         Option<Timestamp>,

    // 时间
    scheduled_at:            Timestamp,
    started_at:              Option<Timestamp>,
    ended_at:                Option<Timestamp>,

    // Retry
    retry_count:             i32,
    max_retries:             i32,                  // 从 ActivityDef.retry_policy 来

    // 执行证据(42001 可解释性)
    reasoning_trace_ref:     Option<TraceRef>,     // 指向 observability 的 trace

    // 审计
    trace_id:                TraceId,
    audit_log_ref:           AuditLogRef,
}
```

#### 2.4.2 状态机(对齐 BPMN + Temporal)

```
   [Schedule]
       │
       ▼
  ┌────────────┐
  │ scheduled  │  已调度,等待 assignee 就绪
  └──────┬─────┘
         │ assignee ready(容器 online + 满足 inputs)
         ▼
  ┌──────────────┐
  │ in_progress  │  Runtime 正在执行
  └──┬──────┬────┘
     │      │
[tool    [LLM 要求 wait_gate]
 suc]    │
     │   ▼
     │  ┌──────────────┐
     │  │ waiting_gate │  挂起,等 governance.gate.decided
     │  └──────┬───────┘
     │         │ gate.decided
     │         ▼
     │       继续 in_progress
     │
     ▼
  ┌───────────┐
  │ completed │  产出 ≥ 1 Artifact(若 ActivityDef.outputs 要求)
  └───────────┘

  任意状态下:
  [fail]     → failed(可重试)
  [skip]     → skipped(通过 ExclusiveGateway 路由)
  [cancel]   → cancelled(Instance 级 cancel 触发)
```

**Activity.state=completed 的含义(ADR-0008)**:

- Activity.completed **表示"流程规定的 Runtime 执行动作已完成"**,即 BPMN 节点语义上的推进
- **不等于** `related_workitems` 全部 `done` —— Activity 和 WorkItem 是两套独立状态机
- **项目完成的判据在 WorkItem 侧**(`domain/work/README.md`),不以 Activity completed 为准
- **complete 时如何处理未完成的 related_workitems** 由 `ActivityDef.completion_policy` 配置:
  - `auto_complete`(默认):不检查 WorkItem,流程节点直接推进
  - `enforce_workitems_done`:卡住直到全部 done
  - `raise_gate`:必起 Gate(复用 quality-gate / design-choice / release-confirm,**不新增 stage-exit**)
  - `try_auto_then_gate`:先尝试 AutoAction,处理不了再起 Gate(AutoAction 默认禁止,需 Policy 授权)

#### 2.4.3 不变量(INV-31 到 INV-44)

**INV-31** `activity_id` 永不复用(同一 instance 内)
**INV-32** `state=in_progress` 必须 started_at 非空
**INV-33** `state=completed` 必须 ended_at 非空
**INV-34** `state=waiting_gate` 必须 pending_gate_id 非空
**INV-35** `waiting_gate` 状态下收到 `gate.decided(reject)` → 转 failed(或按 Profile 决定 cancelled / alternative path)
**INV-36** Activity 的 outputs 必须在 state=completed 前产出(产出是 artifact 域事件触发的)
**INV-37** retry_count ≤ max_retries;超过后进 failed(除非 Gate 批准额外重试)
**INV-38** Activity 状态转移必须发事件(可观察性红线)
**INV-39** Activity 的 inputs / outputs 指向的 Artifact 必须是 approved / baselined(除非 inputs 本就是 initiated / reviewed 的草案)
**INV-40** ServiceTask 的 assignee 必须是 system 或具备对应 Capability 的 ProjectMember
**INV-41(ADR-0008)** `completion_policy=try_auto_then_gate` 时,运行时查当前 Project × ActivityDef 的有效 `autonomy_level`;级别 < `required_autonomy_level` → AutoAction 不执行,**静默退化为 raise_gate**(走 `on_unhandled`)
**INV-42(ADR-0008)** 每次 AutoAction 执行必须发 `process.activity.auto_action_executed` 事件,audit_trail 留痕(不得静默执行)
**INV-43(ADR-0008)** `completion_policy=raise_gate` / `try_auto_then_gate` 的 Gate 必须用已有 kind(quality-gate / design-choice / release-confirm),不得新造 stage-exit 之类的 kind
**INV-44(ADR-0008)** Activity.state=completed 仅表示流程节点推进完毕,引擎**不**强制 `related_workitems` 状态与 Activity 状态同步

#### 2.4.4 Activity 与 WorkItem 的交互语义(澄清)

> 这一节澄清 Activity 和 WorkItem 之间**容易被误解**的关系。ADR-0008 锁定了"两套状态机独立",本节进一步说清**"操作关系"而不是"所有权关系"**的语义。

##### 核心判断

**Activity 不"拥有"WorkItem;Activity 是"对 WorkItem 的加工工位"。**

- WorkItem **住在 work 域**(归属 Project.Backlog + 可能被 Iteration 圈住),不归属 Activity
- Activity **在自己的执行期内**对 WorkItem 做操作(创建 / 挑选 / 查询 / 标记 / 验收)
- Activity 结束后,WorkItem **继续存在**,保留在 Backlog / Iteration 里

##### 不是什么(常见误解)

❌ **"Sprint Planning 这个 Activity 包含了 6 个 WorkItem"**
—— 错。WorkItem 不在 Activity 的生命周期内。Activity completed 后 WorkItem 不会消失,也不属于"这个 Activity 的数据"。

❌ **"Daily Standup 也包含那 6 个 WorkItem"**
—— 错。如果 Activity 包含 WorkItem,同一个 WorkItem 就会"同时属于多个 Activity",所有权无法解释。

❌ **"Activity completed 意味着它关联的 WorkItem 都 done"**
—— 错。ADR-0008 明确:两套状态机独立,WorkItem 状态由 work 域的业务流程驱动(assign / submit / approve),不受 Activity 状态影响。

##### 是什么(正确语义)

✅ **Activity 是"工位",WorkItem 是"从工位上流过的货物"**

- 工位有职责(Planning 负责挑选 / Daily 负责同步 / Review 负责验收)
- 货物不住在工位上,货物在流水线(Backlog / Iteration)里流动
- 工位在自己的执行期内对流经的货物做加工,加工完继续流

✅ **`Activity.related_workitems` 是"弱引用"**

这个字段的语义是:"这个 Activity **执行时**关心了哪些 WorkItem"。它不代表:
- 所有权(WorkItem 不归属 Activity)
- 生命周期绑定(Activity completed 不销毁 WorkItem)
- 数量一致(一个 WorkItem 可能被多个 Activity 提及,N:N 关系)

##### 典型操作类型(按 Activity kind 分类)

不同 Activity 对 WorkItem 做不同类型的操作:

| Activity 典型 | 对 WorkItem 的操作 | 副作用 |
|---|---|---|
| Sprint Planning | 创建 / 从 Backlog 挑选 / 估算 / 建依赖 | Backlog 可能新增 / Iteration.planned 填充 |
| Daily Standup | 查询状态 / 标记 blocked / 调整优先级 | WorkItem.state / priority / blocker_note 可能变 |
| 需求澄清 Activity | 创建 story kind WorkItem / 加验收标准 | Backlog 新增 |
| 编码 Activity | 消费(由 assignee 执行)/ 提交 | WorkItem.state: in_progress → in_review |
| Sprint Review | 查询 done 清单 / 分流 spillover | Iteration.actual_workitems / spillover_workitems 填充 |
| Retrospective | 创建 lessons-learned Artifact | 不直接操作 WorkItem |

**注意**:上表的 Activity 名是**示例**,实际 Activity 的职责取决于 Template 作者在 method-library 里怎么写的,引擎只认 BPMN kind(user-task / service-task 等)+ `completion_policy`。

##### 数据模型层的反映

```
process 域:
  Activity.related_workitems: Vec<WorkItemRef>  // 弱引用,审计便利

work 域:
  WorkItem.project_id:     ProjectId         // 强聚合,真正归属
  WorkItem.iteration_id:   Option<IterationId>  // 被 Iteration 圈住
  WorkItem.related_activities: Vec<ActivityRef>  // 反向弱引用(也是弱)
```

**单向"强聚合"只有一条**:`WorkItem.project_id → Project`。其他都是弱引用,跨域事件传播,对方看到引用不存在时不崩溃(容错)。

##### 与"两轨并行"模型的关系

把本节的澄清画一下,就是 ADR-0008 的两轨模型:

```
Template 轨道(process 域,节拍 + 关卡)
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Planning ─▶ Daily ─▶ Daily ─▶ Review
    │           │         │        │
    │ 操作      │ 操作    │ 操作   │ 操作
    ▼           ▼         ▼        ▼
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WorkItem 轨道(work 域,业务 + 依赖)
     (WorkItem 在 Backlog / Iteration 里流动)
```

两轨各有自己的 DAG:
- **Template 轨道**:Activity DAG,由模板作者在 method-library 定义
- **WorkItem 轨道**:依赖 DAG(depends_on / blocks),由用户在运行时动态建立

两轨只在**节拍点交汇**(Activity 执行时对 WorkItem 做操作),平时各走各的。

##### 对 completion_policy 的再解释

ADR-0008 的 `completion_policy` 字段,本质是**定义"Activity 完成时如何处理交汇产生的不一致"**:

- `auto_complete` = "Activity 做完自己的工作就走,不管 WorkItem 进度"
- `enforce_workitems_done` = "Activity 必须等 WorkItem 都 done 才能走"
- `raise_gate` = "Activity 完成时必起 Gate 让人拍板"
- `try_auto_then_gate` = "先尝试自动处理未 done 的 WorkItem,处理不了再起 Gate"

四种策略都**不改变"两轨独立"的事实**,只是配置交汇点上的合流行为。

### 2.5 Token 值对象(BPMN 并行控制)

#### 2.5.1 作用

BPMN 的 **Token Model**:流程的"执行位置"用 Token 表示。Parallel Gateway 分叉多 Token,Exclusive Gateway 合并 Token。

```
Token {
    token_id:                String,
    instance_id:             InstanceId,
    at_node_id:              String,               // 当前所在节点
    created_from_gateway:    Option<String>,
    created_at:              Timestamp,
    state:                   TokenState,           // active / consumed
}
```

#### 2.5.2 Gateway 类型(BPMN 2.0)

| Gateway | 分叉行为 | 合并行为 |
|---|---|---|
| ExclusiveGateway(X) | 按条件选一条路径 | 需 1 个 Token 到达 |
| ParallelGateway(+) | 所有路径分叉(N Token) | 需 N 个 Token 都到达 |
| InclusiveGateway(O) | 按条件可能多条 | 需 subset 的 Token |
| EventBasedGateway | 按最先到达的 Event | 类似 Exclusive |

#### 2.5.3 Token 的不变量

**INV-41** 每个 active Token 必须在 `ProcessInstance.active_tokens` 里
**INV-42** Token 消费后不可重用(consumed 单向)
**INV-43** ParallelGateway 合并必须等**所有**预期 Token 到达(即使超时也不放行,需 Gate 决策)

### 2.6 Stage 概念(24748-2 时间承载)

Stage **不是聚合根**,而是 Instance 的时间切片属性。

- Template 定义 Stage 序列
- Instance 记录 current_stage + stage_history
- Stage 转换点可触发 Gate(`at_stage_transition`)

**为什么不做聚合根**:Stage 本身无业务操作,只是"时间标签"。做聚合根会过度设计。

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.process.v1;

service ProcessService {
    // === ProcessTemplate 管理(索引层)===
    rpc SyncTemplateFromMethodLibrary(SyncTemplateRequest) returns (SyncTemplateResponse);
      // 由 method-library 事件触发:同步新发布的 Method Content 到本域索引
    rpc PublishTemplate(PublishTemplateRequest) returns (PublishTemplateResponse);
    rpc DeprecateTemplate(DeprecateTemplateRequest) returns (DeprecateTemplateResponse);
    rpc RetireTemplate(RetireTemplateRequest) returns (RetireTemplateResponse);

    rpc GetTemplate(GetTemplateRequest) returns (ProcessTemplate);
    rpc ListTemplates(ListTemplatesRequest) returns (ListTemplatesResponse);

    // === ProcessProfile 管理(Tailoring)===
    rpc DraftProfile(DraftProfileRequest) returns (DraftProfileResponse);
    rpc AddTailoringDecision(AddTailoringDecisionRequest) returns (AddTailoringDecisionResponse);
    rpc ActivateProfile(ActivateProfileRequest) returns (ActivateProfileResponse);
    rpc SupersedeProfile(SupersedeProfileRequest) returns (SupersedeProfileResponse);

    rpc GetProfile(GetProfileRequest) returns (ProcessProfile);
    rpc ListProfilesForProject(ListProfilesForProjectRequest) returns (ListProfilesForProjectResponse);
    rpc GetEffectiveActivityGraph(GetEffectiveGraphRequest) returns (BPMNActivityGraph);
      // 供 Console / Chat 看板展示用

    // === ProcessInstance 管理 ===
    rpc CreateInstance(CreateInstanceRequest) returns (CreateInstanceResponse);
    rpc StartInstance(StartInstanceRequest) returns (StartInstanceResponse);
    rpc PauseInstance(PauseInstanceRequest) returns (PauseInstanceResponse);
    rpc ResumeInstance(ResumeInstanceRequest) returns (ResumeInstanceResponse);
    rpc CancelInstance(CancelInstanceRequest) returns (CancelInstanceResponse);

    rpc GetInstance(GetInstanceRequest) returns (ProcessInstance);
    rpc GetInstanceState(GetInstanceStateRequest) returns (InstanceStateSnapshot);
      // 完整状态快照(current_activities / pending_gates / tokens / checkpoint 简要)

    // === Activity 控制 ===
    rpc ScheduleActivity(ScheduleActivityRequest) returns (ScheduleActivityResponse);
      // 内部调用,由 Instance 推进引擎触发
    rpc StartActivity(StartActivityRequest) returns (StartActivityResponse);
      // 由 L2 member-service 确认容器就绪后调用
    rpc CompleteActivity(CompleteActivityRequest) returns (CompleteActivityResponse);
      // 由 L2 runtime 完成后调用
    rpc FailActivity(FailActivityRequest) returns (FailActivityResponse);
    rpc TransitionActivityToWaitGate(TransitionToWaitGateRequest)
        returns (TransitionToWaitGateResponse);
    rpc ResumeFromWaitGate(ResumeFromWaitGateRequest) returns (ResumeFromWaitGateResponse);

    rpc GetActivity(GetActivityRequest) returns (Activity);
    rpc ListActivities(ListActivitiesRequest) returns (ListActivitiesResponse);

    // === Checkpoint & 恢复 ===
    rpc GetLatestCheckpoint(GetLatestCheckpointRequest) returns (Checkpoint);
    rpc RecoverInstance(RecoverInstanceRequest) returns (RecoverInstanceResponse);
      // 崩溃 / 重启后调用,从 checkpoint 重建状态

    // === 查询 ===
    rpc QueryActiveInstances(QueryActiveInstancesRequest) returns (QueryActiveInstancesResponse);
    rpc GetInstanceTimeline(GetInstanceTimelineRequest) returns (InstanceTimeline);
      // 返回 Activity 时间线 + Gate 挂起点 + Stage 边界(Console / Chat 展示)
}
```

### 3.2 关键请求示例

#### ActivateProfile(Tailoring 定稿)

```proto
message ActivateProfileRequest {
    string profile_id = 1;
    string gate_id = 2;               // profile-activate Gate 引用(governance)
    audit.ActorContext actor = 3;
}

message ActivateProfileResponse {
    string profile_id = 1;
    BPMNActivityGraph effective_graph = 2;
    repeated GateRequirementSpec effective_gates_required = 3;
    google.protobuf.Timestamp effective_from = 4;
}
```

ActivateProfile 会:
1. 校验 Profile 草稿的完整性(所有 tailoring_decisions 有 gate 引用)
2. 校验 mandatory gates 未被移除(INV-14)
3. 生成 effective_activity_graph(Template + tailoring 合并)
4. 冻结(不可再改)
5. 发 `process.profile.activated` 事件

#### StartInstance

```proto
message StartInstanceRequest {
    string project_id = 1;
    string profile_id = 2;
    string kickoff_gate_id = 3;       // kickoff Gate 已批准的引用
    audit.ActorContext actor = 4;
}

message StartInstanceResponse {
    string instance_id = 1;
    InstanceState state = 2;           // 预期 running
    repeated string initial_activity_ids = 3;  // 起始 Activity(进入队列)
    google.protobuf.Timestamp started_at = 4;
}
```

#### CompleteActivity(L2 runtime 调用)

```proto
message CompleteActivityRequest {
    string activity_id = 1;
    repeated string produced_artifact_ids = 2;   // 产出的 Artifact(已经过 artifact.created)
    optional string reasoning_trace_ref = 3;     // 指向 observability
    optional string gateway_decision = 4;        // 如果下一节点是 gateway,Runtime 的决策路径
    audit.ActorContext actor = 5;
}

message CompleteActivityResponse {
    string activity_id = 1;
    ActivityState state = 2;           // 预期 completed
    repeated string next_activity_ids = 3; // 触发的下一 Activity(可能多个,若并行 gateway)
    optional string instance_state_change = 4; // 若 Instance 状态变化(如 completed)
}
```

### 3.3 权限与认证

- **内部**:mTLS + 白名单服务
- **外部(Console / Chat)**:OAuth2
- **写操作**:
  - Template 管理:method-library 事件驱动为主;人工操作需 Gate
  - Profile 管理:ActivateProfile 必须经 profile-activate Gate
  - Instance 创建:必须绑定 active Profile + kickoff Gate
  - Activity 控制:主要由 L2 runtime 通过 member-service 代理调用(不对外直接暴露)

### 3.4 常见错误码

- `TEMPLATE_NOT_FOUND` / `PROFILE_NOT_FOUND` / `INSTANCE_NOT_FOUND`
- `TEMPLATE_SOURCE_DRIFT`(INV-7 违反)
- `TAILORING_REMOVES_MANDATORY_GATE`(INV-14 违反)
- `PROFILE_ALREADY_ACTIVE_CANNOT_MODIFY`(INV-12 违反)
- `INSTANCE_ALREADY_ACTIVE`(INV-19 违反)
- `CHECKPOINT_SAVE_FAILED`(INV-25)
- `INVALID_BPMN_GRAPH`(INV-9 / INV-23 违反)

---

## 四、事件 schema 细节

### 4.1 事件清单

#### Template 级

| 事件 | 订阅方 |
|---|---|
| `process.template.synced_from_method_library` | observability |
| `process.template.published` | work(Project 可选用)/ Console(展示新模板)|
| `process.template.deprecated / retired` | work(现有引用告警) |
| `process.template.source_drift` | **审计告警**:Method Content 与本域索引不一致 |

#### Profile 级

| 事件 | 订阅方 |
|---|---|
| `process.profile.drafted` | observability |
| `process.profile.tailoring_decision_added` | observability |
| `process.profile.activated` | work(Project 可启动)/ Console |
| `process.profile.superseded` | work / observability |

#### Instance 级(最高频)

| 事件 | 订阅方 |
|---|---|
| `process.instance.created` | observability |
| `process.instance.started` | conversation(发通知 Turn)/ observability |
| `process.instance.paused / resumed` | member-service(容器 pause/resume)/ observability |
| `process.instance.completed` | work(Project 可 archive)/ archive(归档准备)/ observability |
| `process.instance.failed` | governance(可能触发 Nonconformity)/ observability(告警) |
| `process.instance.cancelled` | member-service(全部容器 shutdown)/ observability |
| `process.instance.checkpoint_saved` | observability(可溯源) |
| `process.instance.recovered_from_checkpoint` | observability |

#### Activity 级(最高频)

| 事件 | 订阅方 |
|---|---|
| `process.activity.scheduled` | member-service(准备容器)/ work(WorkItem 联动) |
| `process.activity.started` | conversation(可选发通知)/ observability |
| `process.activity.completed` | work(事件通知;按 ADR-0008,work 不强同步 WorkItem 状态)/ artifact(outputs 产出联动)/ observability |
| `process.activity.failed` | governance(触发 retry / Nonconformity)/ observability |
| `process.activity.waiting_gate` | **governance(核心:触发 Gate)**/ observability |
| `process.activity.resumed_from_gate` | observability |
| `process.activity.skipped` | observability(通过 Gateway 路由) |
| `process.activity.artifact_produced` | artifact(创建 Artifact)/ work(WorkItem) |
| `process.activity.auto_action_executed`(ADR-0008) | governance(审计留痕)/ work(WorkItem 被 AutoAction 处理)/ observability |

#### Stage 级

| 事件 | 订阅方 |
|---|---|
| `process.stage.entered` | conversation(发 stage 节点通知)/ observability |
| `process.stage.exited` | observability;可能触发 stage-transition Gate |

### 4.2 核心事件 schema

#### process.activity.waiting_gate(核心枢纽)

```
type:       process.activity.waiting_gate
subject:    activity_id

data: {
    activity_id,
    instance_id,
    project_id,
    activity_def_id,              // 原模板活动定义
    at_stage,
    expected_gate_kind,           // GateRequirementSpec.kind(如 requirements-confirm)
    expected_decision_maker:      { ... },       // 从 GateRequirementSpec 派生
    required_artifacts:           Vec<ArtifactRef>,  // 证据基础(inputs + outputs)
    timeout_at,
    trace_id,
}
```

**governance 订阅响应**:
1. 根据 `expected_gate_kind` 自动创建 Gate(填充六段)
2. 发 `governance.gate.raised`
3. 后续 `governance.gate.decided` 返回时,process 接收并触发 `ResumeFromWaitGate`

#### process.activity.completed

```
subject:    activity_id
data: {
    activity_id,
    instance_id,
    project_id,
    duration_ms,
    assignee_ref,
    produced_artifact_ids,
    next_activity_ids,            // 下一 Activity(若已调度)
    gateway_decisions,            // 若涉及 gateway,路径选择
    reasoning_trace_ref,
    trace_id,
}
```

#### process.instance.checkpoint_saved

```
subject:    instance_id
data: {
    instance_id,
    checkpoint_id,
    parent_checkpoint_id,         // 链式
    activities_completed_count,
    current_state_digest,         // 简要
    stored_at:                    enum { inline / external_storage_ref },
}
```

**关键**:checkpoint 不在事件 payload 里带完整状态(太大);数据在 Instance 表或外部 blob store,事件只带引用。

#### process.template.source_drift(审计严重)

```
severity:   critical
data: {
    template_id,
    last_synced_fingerprint,
    method_library_fingerprint,
    drift_detected_at,
    affected_active_profiles:    Vec<ProfileId>,
    affected_active_instances:   Vec<InstanceId>,
}
```

source_drift 发生时,**默认停止新 Profile 创建**,直到人工介入同步 Template 或决定容忍。

### 4.3 订阅事件(来自其他域)

| 来源 | 事件 | 本域动作 |
|---|---|---|
| method-library | `method_library.process_template.published` | 触发 SyncTemplateFromMethodLibrary;刷新 Template 索引 + fingerprint |
| method-library | `method_library.content.fingerprint_changed`(涉及 ProcessTemplateDef)| 对比本域 Template.fingerprint;不匹配发 `process.template.source_drift` |
| method-library | `method_library.content.deprecated / retired`(涉及 ProcessTemplateDef)| 冻结基于该 Template 的新 Profile 创建 |
| method-library | `method_library.configuration.activated` | 若新 Configuration 改变了可用 Template 集合,重评 active Profile 是否仍合法 |
| governance | `governance.gate.decided` | 匹配 pending_gates,推进 Activity(ResumeFromWaitGate);kind=profile-activate 的 Gate decided 后本域发 `process.profile.activated` |
| governance | `governance.gate.expired / cancelled` | 对应 Activity 按 timeout_policy 处理 |
| governance | `governance.policy.activated`(涉及 process 的 Policy)| 重评 active Instance 的 Activity 是否需要新增/调整 Gate |
| governance | `governance.policy.updated`(涉及 autonomy_level)| 重评 completion_policy=try_auto_then_gate 的 Activity,级别变更影响 AutoAction 授权(ADR-0008) |
| work | `work.project.started` | 触发 StartInstance |
| work | `work.project.paused / resumed / archived / dissolved` | 对应 Instance 状态转移 |
| artifact | `artifact.approved / baselined` | 推进 Activity(若在等待该 Artifact approval) |
| identity | `identity.member.paused / retired` | 检查受影响 Activity,重派或进 failed |
| identity | `identity.role.catalog_updated` | 刷新 Activity.assignable_roles 的 Role 索引缓存 |
| observability | 周期:checkpoint 健康检查 | 检查各 Instance 的 checkpoint 新鲜度 |

### 4.4 事件幂等

- `process.activity.waiting_gate` 幂等 key:`activity_id + version`
- `process.activity.completed` 幂等 key:`activity_id + completion_count`
- checkpoint_saved 幂等 key:`checkpoint_id`
- 所有订阅方事件处理带 event_id LRU 去重

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+

**理由**:
- Instance / Activity 状态转移需要强一致性
- BPMN Activity Graph 用 JSONB 存储,灵活性 + 可查询
- Checkpoint 链是典型关系型结构
- 与其他域同栈便于跨域事务最终一致性协调

**次存储**:
- **Checkpoint 大状态** 可选外部 blob store(S3 / MinIO)—— 当 complete_state 超过 256KB 时自动外置
- **Timeline 查询** 可选 ClickHouse 加速(未来,若 Activity 事件量爆炸)

### 5.2 表结构

#### table: `process_templates`

| 列 | 类型 | 约束 |
|---|---|---|
| template_id | ULID PK | |
| family | enum | not null |
| display_name | varchar(256) | not null |
| version | varchar(32) | not null |
| spec_source | jsonb | not null |
| lifecycle_model | jsonb | not null |
| activity_graph | jsonb | not null |
| roles_required | jsonb | default '[]' |
| artifacts_required | jsonb | default '[]' |
| gates_required | jsonb | default '[]' |
| lifecycle | enum | not null |
| published_at / retired_at | timestamptz | |
| source_fingerprint | varchar(128) | not null |
| source_verified_at | timestamptz | |

**索引**:
- `idx_templates_family_lifecycle` on (family, lifecycle)
- `unique (template_id, version)` ← 强制版本唯一

#### table: `process_profiles`

| 列 | 类型 |
|---|---|
| profile_id | ULID PK |
| project_id | ULID FK unique(1:1 绑定 Project,INV) |
| template_id | ULID FK |
| template_version | varchar(32) |
| profile_group | enum |
| tailoring_level | enum |
| tailoring_decisions | jsonb default '[]' |
| effective_activity_graph | jsonb |
| effective_gates_required | jsonb |
| lifecycle | enum |
| effective_from / effective_until | timestamptz |
| supersedes / superseded_by | ULID |

**索引**:
- `idx_profiles_project_lifecycle` on (project_id, lifecycle)
- **unique partial** on (project_id) where (lifecycle='active') —— 强制 project 唯一 active profile

#### table: `process_instances`

| 列 | 类型 |
|---|---|
| instance_id | ULID PK |
| project_id | ULID FK |
| profile_id | ULID FK |
| state | enum |
| current_stage | varchar(64) |
| current_activities | jsonb default '[]' |
| completed_activities | jsonb default '[]' |
| pending_gates | jsonb default '[]' |
| active_tokens | jsonb default '[]' |
| checkpoint | jsonb | not null |
| started_at / ended_at / last_activity_at | timestamptz | |
| trace_id | varchar(64) | not null |
| version | bigint default 1 |

**索引**:
- **unique partial** on (project_id) where (state in ('running','paused')) —— 强制 INV-19

#### table: `activities`(高频写,按月分区)

```
activities (partitioned by RANGE (scheduled_at))
├── activities_2026_01
├── activities_2026_02
...
```

| 列 | 类型 |
|---|---|
| activity_id | ULID |
| instance_id | ULID FK |
| stage | varchar(64) |
| definition_ref | jsonb |
| kind | enum |
| assignee | jsonb |
| inputs / outputs | jsonb |
| related_workitems | jsonb |
| state | enum |
| pending_gate_id | ULID nullable |
| gate_timeout_at | timestamptz |
| scheduled_at / started_at / ended_at | timestamptz |
| retry_count / max_retries | int |
| reasoning_trace_ref | varchar(128) |
| trace_id | varchar(64) |

**索引**:
- `idx_activities_instance_state` on (instance_id, state)
- `idx_activities_assignee_state` on ((assignee->>'member_id'), state)
- `idx_activities_pending_gate` on (pending_gate_id) where pending_gate_id is not null
- `idx_activities_gate_timeout` on (gate_timeout_at) where state='waiting_gate'

#### table: `checkpoints`(每 Activity 完成后写,高频)

| 列 | 类型 |
|---|---|
| checkpoint_id | ULID PK |
| instance_id | ULID FK |
| parent_checkpoint_id | ULID nullable FK self |
| snapshot_at | timestamptz |
| complete_state | jsonb(或 external_blob_ref 当 > 256KB) |
| activities_completed_count | int |
| reasoning_trace_ref | varchar(128) |
| storage_mode | enum { inline / external } |
| external_blob_ref | varchar(512) nullable |

**索引**:
- `idx_checkpoints_instance_snapshot` on (instance_id, snapshot_at desc)
- `idx_checkpoints_parent` on (parent_checkpoint_id)

#### table: `process_events_outbox`

同其他域。

### 5.3 一致性策略

- **Instance + Activity 转移单事务**(state 更新 + checkpoint 写入 + Outbox 事件)
- **Checkpoint 先写再回调**(Temporal 模式):
  1. L2 runtime 完成 Activity → 调用 CompleteActivity
  2. process 写 Activity.state=completed + Checkpoint + Outbox 同一事务
  3. 事务提交后推进下一 Activity
- **Profile 冻结保护**:active Profile 的 effective_graph 不可修改(数据库层 trigger 拒绝 UPDATE)
- **跨域**:Gate 决策 / Artifact 状态 / WorkItem 状态 通过事件最终一致

### 5.4 Checkpoint 持久化策略(对齐 ADR-0007 待落地)

当前方案:
- checkpoint 挂在 process 域(本表 `checkpoints`)
- 每个 Activity 完成后新 checkpoint(parent 指向上一个)
- complete_state 优先 JSONB 存,超过 256KB 走外部 blob
- checkpoint_saved 事件发 observability 审计

**ADR-0007(待产出)**决策点:
- 候选 A:扩展 process 域 ProcessInstance.checkpoint(当前方案)
- 候选 B:observability 仓承载
- 候选 C:独立 process-runtime 存储(L1 新增)

**当前走候选 A**,但预留外部 blob 扩展点。

### 5.5 容量估算

- 典型 Activity 量:每 Project 200-500 Activity × 10w 项目 = 2000w-5000w
- Checkpoint 量:Activity 数 × 1-2(每步 + 阶段性) = 4000w-1 亿
- QPS 峰值:Activity 状态转移 500 QPS,Checkpoint 写入 1000 QPS
- PG 分区 + 未来可按 project_id hash 分片

### 5.6 恢复流程

崩溃恢复(L2 runtime 或 process 服务自身重启):

```
[process 服务启动]
  │
  ▼
扫描 active Instance(state ∈ {running, paused})
  │
  ▼
对每个 Instance:
  1. 读最新 checkpoint
  2. 重建 current_activities + active_tokens + current_stage
  3. 检查 pending_gates 是否仍有效(governance.Gate 还存在)
  4. 若 Activity state=in_progress,联系 member-service 确认容器状态:
     - 容器存活 → 继续
     - 容器已 crashed → Activity 重试(按 retry_policy)
  5. 发 instance.recovered_from_checkpoint 事件
```

---

## 六、与其他域的事件订阅链路

### 6.1 事件流全景

```
process 域 → 其他域
────────────────────
process.activity.waiting_gate       → **governance(触发 Gate)** / observability
process.activity.completed           → work(WorkItem 状态)/ artifact(Artifact 联动)/ observability
process.activity.failed               → governance(Nonconformity 可能)/ observability(告警)
process.activity.scheduled            → member-service(准备容器)
process.instance.started / paused / resumed / completed / failed / cancelled → 相应域
process.instance.checkpoint_saved     → observability
process.template.source_drift         → **审计告警**

其他域 → process 域
────────────────────
method_library.content_published      → SyncTemplateFromMethodLibrary
governance.gate.decided               → ResumeFromWaitGate(唤醒 Activity);kind=profile-activate 后发 process.profile.activated
work.project.started                  → StartInstance
work.project.paused/resumed/archived/dissolved → Instance 状态
artifact.approved / baselined         → 推进等待该 Artifact 的 Activity
identity.member.retired               → 重派 Activity assignee
```

### 6.2 典型场景 A:Activity 的 Gate 挂起与恢复

```
[T0] Activity A 执行中(state=in_progress)
     Runtime 执行到某步需要 Gate(如原型产出后需审批)
     Runtime 调用 TransitionActivityToWaitGate
        │
        ▼
[T1] process 内部:
     - Activity.state = in_progress → waiting_gate
     - Activity.pending_gate_id 设为占位 / 空
     - 发 process.activity.waiting_gate 事件
        │
        │ governance 订阅
        ▼
[T2] governance.RaiseGate(kind=prototype-approval, ...)
     - 填充六段
     - 返回 gate_id 给 process(通过后续事件)
     - process 更新 Activity.pending_gate_id = gate_id
     - [governance.gate.raised]
        │
        ├──→ conversation:发 gate Turn
        │
        └──→ Chat 用户看到审批卡片

[T3] 用户在 Chat 审批 approve
     governance.DecideGate(approve)
     [governance.gate.decided]
        │
        │ process 订阅
        ▼
[T4] process.ResumeFromWaitGate(activity_id)
     - Activity.state = waiting_gate → in_progress
     - 通知 L2 runtime:Gate 已 decided,继续
     - [process.activity.resumed_from_gate]
        │
        ▼
Runtime 继续执行 Activity A

[T5] Activity A 完成
     Runtime 调用 CompleteActivity(produced_artifact_ids=[...])
        │
        ▼
[T6] process 内部:
     - Activity.state = in_progress → completed
     - checkpoint 新增
     - 推进下一 Activity(按 BPMN graph + gateway 决策)
     - [process.activity.completed]
     - [process.instance.checkpoint_saved]
```

### 6.3 典型场景 B:并行 Activity(ParallelGateway)

```
[T0] Activity "需求分析" 完成
     Runtime 调用 CompleteActivity,reaches ParallelGateway "开发-测试 分岔"
        │
        ▼
[T1] process 引擎解析 ParallelGateway:
     - 创建 2 个 Token(一个到"开发",一个到"测试准备")
     - 调度两个并行 Activity:
       - "开发 Activity" → assignee=backend-dev
       - "测试准备 Activity" → assignee=qa
     - 发 process.activity.scheduled × 2
        │
        ▼
两个 Activity 独立执行(各自容器 / 各自 Runtime)
     │
     │ 各自完成后
     ▼
[T2] 两个 Activity completed
     - 两个 Token 合并到 "并行合并 Gateway"
     - 等待两个 Token 都到达(INV-43)
        │
        ▼
[T3] 合并完成,推进下一 Activity(通常是"集成测试")
```

### 6.4 典型场景 C:Instance 崩溃恢复

```
[T0] Instance 运行中,已完成 5 个 Activity,checkpoint_5 已存
     Activity 6 (code-review) in_progress
        │
        ▼
[T1] process 服务意外重启
        │
        ▼
[T2] process 服务启动 → 扫描 active Instance
     - 找到该 Instance,state=running
     - 读 checkpoint_5(最新)
        │
        ▼
[T3] 重建内存状态:
     - current_activities=[Activity 6]
     - completed_activities=[1..5]
     - active_tokens=[token_at_activity_6]
        │
        ▼
[T4] 询问 member-service:Activity 6 的容器还在?
     - 容器存活 → Runtime 自己从本地 checkpoint 恢复(已完成部分 step 不重跑)
     - 容器 crashed → process.FailActivity + retry 按 retry_policy
        │
        ▼
[T5] 发 process.instance.recovered_from_checkpoint 事件
     observability 记录恢复轨迹

[T6] 继续正常执行
```

### 6.5 典型场景 D:Template / Profile 的 source drift 检测

```
[T0] method-library 发布 Method Content 新版本
     [method_library.content_updated]
        │
        │ process 订阅
        ▼
[T1] process 检查现有 Template 的 source_fingerprint
     - 若 fingerprint 不匹配 → drift 检测
        │
        ▼
[T2] 发 process.template.source_drift 事件(severity=critical)
     - 列出受影响的 active Profile / Instance
        │
        ▼
[T3] governance 决策:
     - 冻结新 Profile 创建(不允许基于旧 fingerprint 的 Template 新建 Profile)
     - 已有 active Instance 继续运行(不影响正在跑的)
     - 人工介入:决定升级 Template 到新版本 还是 容忍 drift

[T4] 人工决策后:
     - 升级:SyncTemplateFromMethodLibrary + 可能强制某些 Profile supersede
     - 容忍:发 Gate 明示批准 drift(记录审计)
```

---

## 七、性能与可用性目标

### 7.1 业务指标

| 指标 | 目标 |
|---|---|
| StartInstance P95 | < 300ms |
| CompleteActivity P95 | < 200ms(含 checkpoint 写 + Outbox) |
| Checkpoint 写入 P95 | < 50ms(inline)/ < 500ms(external blob) |
| TransitionActivityToWaitGate P95 | < 150ms |
| ResumeFromWaitGate(gate.decided 到 Activity 恢复)P95 | < 500ms |
| GetInstanceTimeline P95 | < 500ms |
| Instance 崩溃恢复 | < 30s(小 Instance)/ < 3min(大 Instance) |
| Availability | ≥ 99.95% |

### 7.2 容量假设

- 10w 活跃 Instance,5000w Activity / 年
- Checkpoint 写入 QPS 峰值 1000
- Activity 状态转移 QPS 峰值 500
- source drift 检测频率:每次 method-library 事件

### 7.3 降级策略

- **Checkpoint 外部 blob 不可用**:降级为 inline(限大小);大 Instance 暂停
- **governance 不可达**:waiting_gate 状态保留,不强制超时
- **L2 member-service 不可达**:Activity scheduled 状态积累,触发告警
- **method-library 不可达**:禁用 Profile 新建,现有 Instance 继续

### 7.4 监控关键点

- Active Instance 数量分布
- Activity 状态分布(scheduled / in_progress / waiting_gate / ...)
- Checkpoint 写入延迟
- Gate 挂起时长(waiting_gate → resumed 的时长,过长提示用户批慢)
- source drift 次数
- 崩溃恢复次数 + 耗时
- 并行 Activity 的 token 合并等待时长

---

## 八、安全与合规对齐

### 8.1 BPMN 2.0 对齐

- Activity 7 种 kind 全对齐 BPMN 2.0 语义
- Gateway 4 种类型(Exclusive / Parallel / Inclusive / EventBased)
- Token 模型对齐
- SequenceFlow / Event 语义对齐
- 图合法性校验走 BPMN XML schema(INV-9)

### 8.2 SPEM 2.0 对齐

- **Definition vs Use 严格分离**:ProcessTemplate 的内容在 method-library(Definition),本域持索引;ProcessInstance(Use)不触内容
- **Method Plugin 机制**:通过 spec_source 引用不同 Method Content 版本
- 八条原则中的 B 条直接落地

### 8.3 24748-2 对齐

- 生命周期模型八种家族(§2.1.2)对齐 24748-2 Annex A
- Tailoring Record 格式对齐 §5.3
- Baseline 概念由 artifact 域承载(process 发事件触发 Baseline 创建)
- Decision Gate 通过 governance.Gate 一等对象落地
- 可追溯:Activity → trace_id → observability 完整链

### 8.4 29110 Profile 对齐

- ProcessProfile 就是 29110 Profile Group 的落地
- profile_group 字段:entry / basic / intermediate / advanced / custom
- tailoring_decisions 按三种机制(Reduction / Extension / Adaptation)

### 8.5 LangGraph / Temporal 对齐

- **StateGraph 硬约束**:Activity 状态机由代码决定,Runtime 不能自由跳转
- **Checkpoint**:每步持久化
- **Signal 等待**:waiting_gate 状态 + gate.decided 唤醒
- **持久执行**:崩溃恢复从 checkpoint 继续,不重跑

### 8.6 ISO 42001 对齐

- A.6 AI System Life Cycle:Instance 全生命周期对齐
- A.6 Operation:Activity 实时监控
- A.6 Re-evaluation:source_drift 检测对应 "AI System 需要重评"
- §9.1 监视测量:每 Activity 发事件,observability 聚合指标
- 可解释性:reasoning_trace_ref 完整持久化

### 8.7 横切红线

- **可审计性**:每次 Activity / Instance 状态转移发事件;checkpoint 链不可篡改
- **可追溯性**:trace_id 贯穿;Activity → WorkItem / Artifact / Turn 多维引用
- **可裁剪性**:29110 Profile 机制 + Tailoring 记录;不硬编码过程

---

## 九、测试策略

### 9.1 单元测试重点

- **BPMN Graph 合法性**(INV-9):非法图结构立即拒
- **状态机**:Instance / Activity 所有合法 / 非法转移
- **Token 并行合并**(INV-43):ParallelGateway 只能全部 Token 到达才继续
- **Checkpoint 完整性**(INV-24 / INV-25):每步写入,失败重试 3 次
- **Profile 冻结**(INV-12):active Profile 修改被拒
- **INV-19 唯一性**:同 project 唯一 active Instance
- 关键聚合覆盖率 ≥ 90%

### 9.2 集成测试重点

- Activity 完成 → 下一 Activity 调度 的完整链路
- Gate 挂起 → 恢复 的跨域事件
- 并行 Activity 的 Token 管理
- Checkpoint 外部 blob 回落
- source drift 检测

### 9.3 E2E 场景

- 场景 A Activity Gate 挂起与恢复
- 场景 B 并行 Activity
- 场景 C Instance 崩溃恢复
- 场景 D Template source drift 检测

### 9.4 性能压测

- 500 QPS Activity 状态转移
- 1000 QPS Checkpoint 写入
- 10w active Instance 的状态扫描
- 大 Instance(500+ Activity)的 timeline 查询

### 9.5 安全测试

- active Profile 修改被拒
- Template source_fingerprint 伪造检测
- non-member 调用 Activity 控制接口被拒
- Gate 结果伪造(不经 governance 直接唤醒 Activity)被拒

---

## 十、开放问题

### Q1. Checkpoint 持久化归属(ADR-0007)

**背景**:`ai-member 设计.md` §十一 Q2 + 本文 §5.4。

**候选**:
- A 扩展 process 域 ProcessInstance.checkpoint(当前方案)
- B observability 仓承载
- C 独立 process-runtime 存储(L1 新增)

**倾向**:A

**推进**:**已由 ADR-0007 决策**(A + 大状态外部 blob 回落),本节保留作为索引。

### Q2. Sub-Process 和 Call-Activity 的嵌套边界

**背景**:BPMN 支持 SubProcess(内联)和 CallActivity(引用另一流程)。Quantalithos 如何实现?

**候选**:
- A SubProcess 内联实现(同 Instance 的 nested Activity)
- B CallActivity 创建子 Instance(独立 Instance,父子关系)
- C 混合(SubProcess=nested,CallActivity=子 Instance)

**倾向**:C

**推进**:原型阶段决策;可能走 ADR。

### Q3. Template / Profile / Instance 的版本演进管理

**背景**:Template 升级后已 active 的 Profile 如何处理?已 running 的 Instance 如何处理?

**候选**:
- A 不影响(旧版本继续跑)
- B 触发告警让人工决策
- C 自动升级(对 non-breaking)

**倾向**:B

**推进**:method-library 设计 + source_drift 机制原型后决策。

### Q4. Activity 的 assignee 选择算法

**背景**:当 ActivityDef 允许多 Role 承担,具体 assign 给哪个 ProjectMember?

**候选**:
- A 轮询(简单)
- B 按负载(查容器 workload)
- C 按能力匹配(LLM 判断哪个 Member 适合)
- D 组合(能力优先 + 负载后备)

**倾向**:D

**推进**:原型阶段 + 观察实际使用后调。

### Q5. 失败 Activity 的重试策略细化

**背景**:retry_policy 当前简单(max_retries + backoff)。实际需要更细的语义。

**候选**:
- A 仅简单重试(当前)
- B 按错误类型分类(LLM 错误 / 工具错误 / 网络错误 不同策略)
- C 允许 Runtime 自主决定"我要不要重试"(但受 Policy 约束)

**倾向**:B

**推进**:实际运行中观察失败模式后。

### Q6. Token 合并超时策略

**背景**:ParallelGateway 等所有 Token 到达。若某 Token 永不到达怎么办?

**候选**:
- A 无限等(当前 INV-43)
- B 设超时,超时后进 failed 或走 Gate 决策
- C 支持 InclusiveGateway 的 "等 subset" 语义

**倾向**:B

**推进**:Gate 决策机制完整后。

### Q7. Stage 的显式 vs 隐式

**背景**:当前 Stage 是 Instance 的属性(隐式由 Template 定义),不是独立实体。若 Stage 需要复杂状态(如 Stage-level Baseline)怎么办?

**候选**:
- A 维持当前(Stage 为属性)
- B 升级 Stage 为 Instance 内部实体
- C Stage 作为独立聚合根

**倾向**:A 起步

**推进**:实际使用后若 Stage 语义太弱,考虑 B。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-process` 仓 README(段 3)

- §二 聚合根 → src/domain/
- §三 RPC → proto/
- §四 事件 → src/events/
- §五 持久化 → migrations/
- §六 跨域 → src/subscriptions/
- §九 测试 → tests/
- BPMN 引擎代码 → src/engine/

### 11.2 与 method-library 仓

- method-library 是 Template 内容的**source of truth**
- 本域持**执行索引**(结构化形式)
- 通过事件同步 + source_fingerprint 保持一致

### 11.3 与 governance / work / artifact

- governance:Gate 是 Activity 挂起态的决策对象;本域不决策,只发起
- work:Project / WorkItem / Iteration 驱动 Instance 创建和节奏
- artifact:Activity outputs 触发 Artifact 创建

**Activity 与 WorkItem 关系(ADR-0008 锁定)**:
- 两套状态机严格独立:Activity(BPMN 语义)/ WorkItem(Scrum 业务语义),不同步字段
- 项目完成判据以 **WorkItem 为准**(work 域),Activity completed 仅表示流程节点推进
- 不一致处理由 `ActivityDef.completion_policy` 配置,AutoAction 默认禁止
- 不新增 `stage-exit` 类 Gate kind,复用 `quality-gate` / `design-choice` / `release-confirm`

**RPC 不按 Role 过滤字段(ADR-0009 锁定)**:
- 本域 Get / List / Query 类 RPC 的字段返回 **不接受 Role 参数**,不按 Role 裁剪
- actor 仅用于鉴权(读不读得到对象)和审计留痕
- 字段级视图裁剪由 UI 仓消费 method-library 的 ViewProfile 完成

### 11.4 与 L2 Member 运行层

- Runtime 是 Activity 的实际执行方
- CompleteActivity / FailActivity / TransitionToWaitGate 由 Runtime 通过 member-service 代理调用
- Checkpoint 与 Runtime C7 Checkpoint Store 的**对偶关系**:
  - Runtime C7:Member 内部的 think-act-observe 单步 checkpoint
  - process Checkpoint:Activity 级别的 Instance 状态 checkpoint
  - 两者**不同粒度**,互补不重复

### 11.5 修订纪律

- 三聚合根(Template / Profile / Instance)字段结构修改必须 ADR
- Activity / Token 语义修改必须 ADR(影响 BPMN 对齐)
- tailoring_decisions 格式修改必须 ADR(影响 24748-2 对齐)
- Checkpoint 格式修改必须向后兼容或迁移 ADR

---

## 十二、总结

本文把过程域从"一节六域模型叙事 + 一个标准对齐摘要"展开到"可以实现"的程度。关键产出:

1. **三聚合根完整设计**(ProcessTemplate / ProcessProfile / ProcessInstance)+ Activity 实体 + Token 值对象
2. **43 条不变量**(INV-1 到 INV-43)覆盖四类对象
3. **BPMN 2.0 + SPEM 2.0 + 24748-2 + 29110 + LangGraph + Temporal** 六套标准综合落地
4. **Template 索引与 method-library 同步机制**(source_fingerprint + drift 检测)
5. **Profile 的 29110 Tailoring 结构** + active 后冻结保护
6. **Instance 的 Temporal 持久执行模式**(每 Activity 后 checkpoint)
7. **四个典型场景**(Gate 挂起恢复 / 并行 Activity / 崩溃恢复 / source drift)串联跨域
8. **7 个开放问题**,其中 Q1 同步产出 ADR-0007

**关键承诺**:

- **Template / Profile / Instance 三段式不可合并**(SPEM Definition vs Use)
- **Profile active 后冻结**(并发安全 + 可追溯)
- **每 Activity 后 checkpoint**(Temporal 模式,不是"长运行才 checkpoint")
- **StateGraph 硬约束**(LangGraph,状态机不由 LLM 决定)
- **Gate 一等对象化**(waiting_gate 状态 + governance 决策)
- **Source drift 保护**(Template 与 method-library 不一致时冻结新 Profile)
- **可解释性**(reasoning_trace 完整持久化)

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 节 |
|---|---|---|
| INV-1 | template_id 永不复用 | §2.1.4 |
| INV-2 | Template retired 单向 | §2.1.4 |
| INV-3 | 有 active Profile 不能 retire Template | §2.1.4 |
| INV-4 | Template published 必经 Gate | §2.1.4 |
| INV-5 | Template published 不可修改结构 | §2.1.4 |
| INV-6 | spec_source 指向已发布 Method Content | §2.1.4 |
| INV-7 | source_fingerprint 不一致拒绝新 Profile | §2.1.4 |
| INV-8 | family 定义不可修改 | §2.1.4 |
| INV-9 | activity_graph 必须合法 BPMN 图 | §2.1.4 |
| INV-10 | mandatory Gate 在 Profile 不可裁剪 | §2.1.4 |
| INV-11 | profile_id 永不复用 | §2.2.3 |
| INV-12 | Profile active 后不可修改 | §2.2.3 |
| INV-13 | tailoring_decisions 只 append | §2.2.3 |
| INV-14 | 不可裁剪 mandatory Gate | §2.2.3 |
| INV-15 | profile_group=custom 必须有裁剪证据 | §2.2.3 |
| INV-16 | Profile active 必经 Gate | §2.2.3 |
| INV-17 | superseded 必有 superseded_by | §2.2.3 |
| INV-18 | instance_id 永不复用 | §2.3.3 |
| INV-19 | 同 project 唯一 running/paused Instance | §2.3.3 |
| INV-20 | running 必有 current_activities | §2.3.3 |
| INV-21 | current_activities 必在 Profile 图内 | §2.3.3 |
| INV-22 | active_tokens 位置合法 | §2.3.3 |
| INV-23 | Activity 转移遵守 BPMN 语义 | §2.3.3 |
| INV-24 | 每 Activity 后立即 checkpoint | §2.3.3 |
| INV-25 | checkpoint 3 次失败进 failed | §2.3.3 |
| INV-26 | completed 必所有 Activity completed | §2.3.3 |
| INV-27 | cancelled 单向 | §2.3.3 |
| INV-28 | failed 可恢复 | §2.3.3 |
| INV-29 | reasoning_trace 必持久化 | §2.3.3 |
| INV-30 | Instance pause/cancel 级联 cancel pending_gates | §2.3.3 |
| INV-31 | activity_id 同 instance 内永不复用 | §2.4.3 |
| INV-32 | in_progress 必 started_at | §2.4.3 |
| INV-33 | completed 必 ended_at | §2.4.3 |
| INV-34 | waiting_gate 必 pending_gate_id | §2.4.3 |
| INV-35 | gate=reject 转 failed | §2.4.3 |
| INV-36 | completed 前 outputs 产出 | §2.4.3 |
| INV-37 | retry_count ≤ max_retries | §2.4.3 |
| INV-38 | Activity 转移必发事件 | §2.4.3 |
| INV-39 | inputs/outputs 必须是合法 Artifact 状态 | §2.4.3 |
| INV-40 | ServiceTask assignee 系统或能力匹配 | §2.4.3 |
| INV-41 | active Token 在 active_tokens 里 | §2.5.3 |
| INV-42 | Token consumed 单向 | §2.5.3 |
| INV-43 | Parallel 合并等全部 Token | §2.5.3 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | Template(索引)/ Profile(裁剪)/ Instance(运行)/ Activity(执行)四层清晰 |
| OCP | Template 家族可扩展(via method-library);Gateway 类型扩展走 ADR |
| DIP | Runtime 不直接访问 method-library(通过 process 域索引) |
| DRY | BPMN 语义复用(Activity / Gateway / Event 统一模型) |
| KISS | Stage 不做聚合根(属性够用) |
| YAGNI | SubProcess / CallActivity 边界留开放问题(Q2) |
| 不可变优先 | Checkpoint 链不可变;active Profile 不可变 |
| 显式优于隐式 | 43 条不变量显式 |
| Fail Fast | 非法 BPMN 图立即拒;source drift 立即告警;Profile active 修改拒 |
| 幂等性 | Outbox + Activity state machine + Checkpoint chain |

---

## 附录 C:订正标记

- [ ] §2.1.1 ActivityDef 的详细字段待 BPMN 引擎库选型后复核
- [ ] §5.2 activities 分区策略(pg_partman 配置)待段 3 落地
- [ ] §5.4 Checkpoint 外部 blob 的触发阈值(256KB)待原型压测后调
- [ ] §Q2 SubProcess vs CallActivity 边界待原型阶段决策
- [ ] §Q3 Template 版本演进策略待 method-library 定稿后决策
- [ ] §Q4 Assignee 选择算法细节待原型阶段

---

> 本文是 Quantalithos A 方案段 2 的第七件文档(也是最后一件 domain 文档)。过程域的详细设计以本文为单一真相源。BPMN + SPEM + 24748-2 + 29110 + LangGraph + Temporal 六套国际标准和成熟模式的综合落地。
