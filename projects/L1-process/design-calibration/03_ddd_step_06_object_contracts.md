# Step 6. 逐模块定义对象实现契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节:`03-详细设计.md` §5 模块实现契约中的对象实现契约;§6 全局对象 / Trait / API 索引

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_05_module_contracts.md`
- 上游正式文档:
  - `projects/L1-process/02-概要设计.md` §6 / §9 / §12
- 概要设计校准来源:
  - `projects/L1-process/design-calibration/02_hld_step_06_key_objects.md`
  - `projects/L1-process/design-calibration/02_hld_step_06_key_objects_truth_execution.md`
  - `projects/L1-process/design-calibration/02_hld_step_06_key_objects_gate_recovery_timing.md`
  - `projects/L1-process/design-calibration/02_hld_step_06_key_objects_policies.md`
  - `projects/L1-process/design-calibration/02_hld_step_06_key_objects_projections.md`
  - `projects/L1-process/design-calibration/02_hld_step_06_key_objects_references_audit.md`
- 规范输入:
  - `standards/document/详细设计书写规范.md` §5.5 / §5.6
  - `standards/document/设计真相源闭环与可落码性标准.md`

### 3. SOP 问题回答

1. 每个模块中需要定义哪些 struct / enum / value object / service?

   回答:本 Step 只定义对象契约,service 的调用契约后移 Step 9。`contracts` 模块定义 public protocol 共享的 id / ref / reason / marker / state-visible enum / DTO helper。`domain` 模块定义 Process truth object、state enum、policy、projection state、snapshot / reference、trace / audit / outbox record。`application`、`infra`、`api`、`worker`、`jobs` 中的 service、trait、handler、adapter 和 runner 不在本 Step 展开字段,分别进入 Step 7~9。

2. 每个对象的主要责任和不变量是什么?

   回答:每个对象必须保护一个明确边界:truth object 保护 Process-owned fact;reference / snapshot 只保存外部引用和摘要;projection / report 只读可重建;trace / audit / outbox 只记录已成立 truth 的追溯和传播意图;policy 只判断,不保存业务 truth。

3. 每个字段的类型、作用和约束是什么?

   回答:本 Step 以字段表给出字段名、类型、作用和约束。所有 id / ref / reason / marker 类型必须在 `contracts::refs` 或 core contracts 有正式归属;domain 对象不得引用未定义裸字符串。

4. 每个成员函数的完整签名、参数类型、返回类型和副作用是什么?

   回答:本 Step 给出 domain object / value object / policy 的 Rust 风格签名。函数返回 `Result<_, DomainError>` 的地方表示状态迁移或不变量校验可能失败;纯判断函数返回 bool 或具体 marker。

5. 哪些函数是工厂函数或静态函数?

   回答:每个 truth object、record、snapshot 和 projection 都必须提供从正式来源构造的工厂函数,且工厂函数必须说明来源对象或请求字段。工厂不得临时生成外部 truth 或保存正文。

6. 哪些状态 enum 需要写变体、允许来源和允许去向?

   回答:所有状态 enum 都写变体表,包括 RuntimeProcessShapeState、ProcessProfileState、ProcessInstanceState、ActivityState、TokenState、GatewayState、WaitingGateState、CheckpointState、RecoveryAttemptState、StageState、TimeboxBindingState、ProjectionFreshnessState、ReferenceResolutionLifecycleState、OutboxPublicationState、TraceHandoffState。

7. 每个 enum variant 的 Rustdoc 注释是什么?带载荷 variant 的载荷类型承载什么语义?

   回答:本 Step 的 Rust code block 使用英文 rustdoc,以满足 `standards/coding/rust.md`。变体表中的 Rustdoc 注释必须可直接转写到 enum variant。带载荷 variant 必须在作用列说明载荷语义。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` §6 | 对象只给关键字段骨架和函数骨架 | 本 Step 补字段约束、正式函数签名、工厂和不变量 |
| `02-概要设计.md` §9 | 状态集合已固定,但没有 enum 归属和变体表 | 本 Step 固定 enum 归属与变体表;Step 10 再补完整状态矩阵 |
| 旧 `03-详细设计.md` | 保留旧 `ProcessTemplate` / `WaitingGateState` struct 心智 | 本 Step 不继承旧对象;只承接新版 `RuntimeProcessShape` / `WaitingGate` / `ProcessCheckpoint` 等对象 |
| public protocol 二级类型 | ref、reason、state marker 容易在 Step 8 才发现缺 schema | 本 Step 先把共享 id / ref / reason / marker 归属到 `contracts::refs` |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象粒度 | 概要骨架 | 可落码 struct / enum / value object 契约 | 满足 1:1 实现 |
| 状态定义 | 状态名集合 | enum 代码片段 + 变体表 + 归属 | 防止状态多真相 |
| ref / reason | 多处只出现类型名 | 统一归属 `contracts::refs` 或 core contracts | 防止协议二级类型缺 schema |
| policy | 只说明判断职责 | 给字段、函数和禁止事项 | 支撑 domain tests |
| projection / outbox | 只说明派生 / 发布边界 | 给 truth source、状态和工厂 | 支撑 rebuild / publish flow |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只在 Step 6 定 domain 对象,ref / DTO helper 留给 Step 8 | Step 6 更短 | Step 8 会再次出现 public secondary type 缺口 | 不采用 |
| B. Step 6 定义 domain 对象和共享 ref / reason / marker 归属,Step 8 复用 | 协议闭环更稳定 | Step 6 内容更重 | 采用 |
| C. snapshot / reference 使用裸字符串 | 初始实现简单 | 违反可落码性标准,无法和相邻仓 contracts 对齐 | 不采用 |
| D. projection 从 projection 自己重建 | 实现方便 | 违反 committed truth source 闭环 | 不采用 |

### 7. 结构化中间产物

#### 7.1 对象归属索引

| 模块 | 文件 | 对象 / 类型 |
|---|---|---|
| `contracts` | `refs.rs` | 所有 `*Id`、`*Ref`、`*Reason`、`*Kind`、public state enum、scope、cursor、marker、command intent helper;显式包括 `ProcessTruthRef`、`ProcessTruthRefKind`、`ProcessTruthCursorRef`、`ProcessTruthChangeRef`、`TraceHandoffRef`、`GovernanceDecisionRef`、`ArtifactEvidenceMarker`、`RuntimeFeedbackRef`、`ConversationContextRef`、`ReferenceResolutionState`、`ReferenceResolutionLifecycleState`、`ActivityKind`、`GatewayKind`、`RuntimeFeedbackKind`、`RecoveryHistoryKind`、`RuntimeFeedbackSummaryRef`、`ProcessStartIntentRef`、`ProcessStartReason`、`ActivityProgressionIntentRef`、`ActivityProgressionTransition`、`ActivityFlowControlIntent`、`SourceDigest` |
| `contracts` | `events.rs` | `ProcessOutboxEventKind`、`ProcessOutboundEventPayload` 及 outbound event payload DTO |
| `contracts` | `views.rs` | `RuntimeProcessShapeView`、`ProcessProfileView`、`ProcessInstanceView`、`ActivityStatusView`、`ProcessTimelineView`、`ProcessProgressSummaryView`、`ReconciliationReportView` |
| `domain` | `runtime_shape.rs` | `RuntimeProcessShape`、`RuntimeProcessShapeState` |
| `domain` | `process_profile.rs` | `ProcessProfile`、`ProcessProfileState`、`ProfileChangeRecord` |
| `domain` | `process_instance.rs` | `ProcessInstance`、`ProcessInstanceState` |
| `domain` | `activity.rs` | `Activity`、`ActivityState`、`ActivityTransitionOutcome`、`ActivityProgressionRecord` |
| `domain` | `token_gateway.rs` | `Token`、`TokenState`、`TokenSet`、`TokenSnapshot`、`Gateway`、`GatewayState`、`GatewayRouteSet` |
| `domain` | `waiting_gate.rs` | `WaitingGate`、`WaitingGateState`、`PauseContext`、`WaitingGateChangeRecord` |
| `domain` | `checkpoint.rs` | `ProcessCheckpoint`、`CheckpointState` |
| `domain` | `recovery.rs` | `RecoveryAttempt`、`RecoveryAttemptState`、`RecoveryHistoryRecord`;`RecoveryHistoryKind` 归 `contracts::refs` |
| `domain` | `rhythm.rs` | `ProcessStageState`、`StageState`、`ProcessTimeboxBinding`、`TimeboxBindingState` |
| `domain` | `reference.rs` | `MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackSummary` |
| `domain` | `projection.rs` | `DerivedProcessViewState`、`ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ActivityStatusView`、`ReconciliationReport` |
| `domain` | `trace.rs` | `ProcessTraceRecord`、`ProcessAuditTrail`、`TraceHandoffRecord`;使用 `contracts::refs::TraceHandoffRef` 作为 handoff record identity |
| `domain` | `outbox.rs` | `ProcessOutboxRecord`、`ProcessTruthChange` |
| `domain` | `policies.rs` | `ProcessTruthPolicy`、`ShapeDefinitionPolicy`、`ProfileTailoringPolicy`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`WaitingGatePolicy`、`RecoveryContinuityPolicy`、`ProcessRhythmPolicy`、`ReadVisibilityPolicy`、`DerivedProcessViewPolicy` |

#### 7.2 contracts shared 类型口径

`contracts::refs` 必须定义本仓 public protocol 和 domain 共同使用的 lightweight shared types。每个 newtype 均按以下规则实现:

```rust
/// Stable process-local identifier or external reference token.
pub struct ExampleRef {
    /// Stable reference value assigned by the owning boundary.
    pub value: String,
}
```

| 类型组 | 归属 | 最小字段 / 变体口径 |
|---|---|---|
| `*Id` / `*Ref` newtype | `contracts::refs` | `value: String`,非空,不得包含外部正文 |
| `*Reason` newtype | `contracts::refs` | `value: String`,非空,表达原因引用或分类文本;正文解释留 trace / audit |
| `*Kind` enum | `contracts::refs` | 每个 variant 必须有 Rustdoc;public protocol 可直接引用 |
| event reason enum | `contracts::refs` | 若 outbound payload 需要统一表达多种 domain reason,必须定义 enum 及从 domain reason 的映射 |
| public state enum | `contracts::refs` | 若会进入 DTO / Event / View,归 contracts;domain 复用同一 enum |
| public reference state struct | `contracts::refs` | 若 struct 会被 public ref、DTO、Event、View、Job 或 application port 直接引用,归 contracts;domain 只能复用或通过 policy / guard 校验 |
| command intent helper | `contracts::refs` | 若 request 需要用 intent 选择 domain transition,必须定义结构化 enum / struct 和 variant 到 domain method 的映射;不得用裸字符串或 opaque ref 让 service 猜分支 |
| internal-only state enum | `domain::<file>` | 不进入 public protocol;若后续 Step 8 需要暴露,必须上提到 contracts |
| external refs | `contracts::refs` | `value: String` + kind / source 字段,只表达外部稳定引用,不得保存正文 |

##### 7.2.1 PH-03 execution shared enum / reason schema

以下类型已经进入 ProcessInstance / Activity / Token / Gateway / RuntimeFeedback 的 public protocol 或 domain object 签名,必须在 `contracts::refs` 中显式定义,不得只依赖裸字符串或实现侧临时 enum。

```rust
/// Runtime shape activity category supported by the process execution boundary.
pub enum ActivityKind {
    /// A human participant performs the activity.
    HumanTask,
    /// A configured runtime or integration performs the activity.
    AutomatedTask,
    /// The activity collects or waits for runtime/member feedback.
    FeedbackTask,
    /// The activity performs a review or approval step.
    ReviewTask,
    /// The activity records a decision point without owning the decision body.
    DecisionTask,
}

/// Runtime gateway category supported by the process execution boundary.
pub enum GatewayKind {
    /// Select exactly one route from the available route set.
    ExclusiveDecision,
    /// Split one active token into multiple configured routes.
    ParallelSplit,
    /// Join the required incoming tokens before continuing.
    ParallelJoin,
}

/// Kind of runtime or member feedback visible to L1-process.
pub enum RuntimeFeedbackKind {
    /// Feedback states that an activity can be completed by command policy.
    Completion,
    /// Feedback states partial progress without completing the activity.
    Progress,
    /// Feedback states a runtime or member failure.
    Failure,
    /// Feedback states explicit cancellation by the source boundary.
    Cancellation,
    /// Feedback is observational and must not change activity truth by itself.
    Observation,
}
```

| 类型 | 归属 | 最小 schema | validation / 语义 |
|---|---|---|---|
| `ProcessCancelReason` | `contracts::refs` | `value: String` | 非空;表达取消分类或原因引用;正文说明进入 trace / audit |
| `ActivityCompletionReason` | `contracts::refs` | `value: String` | 非空;完成活动时必填;不得保存 runtime body |
| `ActivitySkipReason` | `contracts::refs` | `value: String` | 非空;跳过活动时必填 |
| `ActivityFailureReason` | `contracts::refs` | `value: String` | 非空;失败活动时必填 |
| `TokenTerminationReason` | `contracts::refs` | `value: String` | 非空;终止 token 时必填 |
| `GatewayDecisionReason` | `contracts::refs` | `value: String` | 非空;选择 route 的解释依据;不得保存 governance / runtime 正文 |
| `GatewayInvalidReason` | `contracts::refs` | `value: String` | 非空;标记 gateway invalid 的分类或原因引用 |
| `ProcessTokenRef` | `contracts::refs` | `value: String` | 非空;指向 process-local token;不保存 token body |
| `GatewayRouteRef` | `contracts::refs` | `value: String` | 非空;指向 runtime shape 中的 route;不保存 shape body |
| `RuntimeFeedbackSummaryRef` | `contracts::refs` | `value: String` | 非空;指向无执行正文的 feedback summary |
| `SourceDigest` | `contracts::refs` | `value: String` | 非空;opaque source digest;Process 只比较稳定值,不解释算法 |

##### 7.2.2 process start intent schema

`StartProcessInstanceRequest.start_intent_ref` 必须使用以下结构化 schema。它虽然保留 `*Ref` 命名以兼容 protocol 字段,但不是 opaque string ref;实现必须用它选择 bootstrap start node、initial token position 和可选 gateway bootstrap,不得从 runtime shape body、profile 私有字段或字符串约定中自行推断 start 分支。

```rust
/// Structured command intent for bootstrapping a process instance.
pub struct ProcessStartIntentRef {
    /// Runtime shape node where the initial activity and token must be created.
    pub start_node_ref: ShapeNodeRef,
    /// Optional gateway that must be initialized when the start node enters gateway tracking.
    pub initial_gateway_ref: Option<GatewayRef>,
    /// Caller-supplied start reason or source reference.
    pub start_reason: ProcessStartReason,
}
```

| 字段 | 类型 | 来源 | Domain / flow 映射 | validation / 语义 |
|---|---|---|---|---|
| `start_node_ref` | `ShapeNodeRef` | caller + active profile / runtime shape summary | `Activity::from_shape_node(...)`;`Token::start_at(..., start_node_ref)` | 必须属于 active profile 的 runtime shape start node set;missing / unknown / not startable -> reject |
| `initial_gateway_ref` | `Option<GatewayRef>` | caller + runtime shape body-free gateway summary | 当 start node requires gateway tracking 时创建 initial `Gateway` state | start node requires gateway tracking 时必填;不需要 gateway tracking 时必须为空;gateway 必须属于同一 shape |
| `start_reason` | `ProcessStartReason` | caller | trace / audit / command result context;不进入 external body | 非空;表达启动分类或原因引用;正文说明进入 trace / audit |

`ProcessStartReason` 归 `contracts::refs`,schema 为 `value: String`,非空。StartProcessInstance bootstrap 不追加 `ActivityProgressionRecord`;`ProcessStartIntentRef` 只用于创建 initial `Activity`、`Token` 和可选 `Gateway`,并驱动 `ProcessInstance::start(&profile, initial_activity_ref, actor)`。

##### 7.2.3 activity progression intent schema

`AdvanceProcessActivityRequest.progression_ref` 必须使用以下结构化 schema。它虽然保留 `*Ref` 命名以兼容 protocol 字段,但不是 opaque string ref;实现必须按 variant 直接分派到 Step 6 domain method,不得通过字符串约定、runtime shape body 或 adapter 私有字段推断。

```rust
/// Structured command intent for advancing one activity and its flow-control state.
pub struct ActivityProgressionIntentRef {
    /// Activity transition requested by the command.
    pub activity_transition: ActivityProgressionTransition,
    /// Token / gateway effect requested by the same command.
    pub flow_control: ActivityFlowControlIntent,
}

/// Activity transition selected by AdvanceProcessActivity.
pub enum ActivityProgressionTransition {
    /// Mark a planned activity as ready.
    Ready,
    /// Start a ready activity.
    Start,
    /// Complete an in-progress or feedback-waiting activity.
    Complete {
        /// Completion reason supplied by the caller.
        reason: ActivityCompletionReason,
        /// Body-free feedback summary consumed by completion policy when the activity has feedback.
        feedback_summary_ref: Option<RuntimeFeedbackSummaryRef>,
    },
    /// Skip a non-terminal activity.
    Skip {
        /// Skip reason supplied by the caller.
        reason: ActivitySkipReason,
    },
    /// Fail a non-terminal activity.
    Fail {
        /// Failure reason supplied by the caller.
        reason: ActivityFailureReason,
    },
}

/// Flow-control effect requested by the same progression command.
pub enum ActivityFlowControlIntent {
    /// No token or gateway state changes in this command.
    None,
    /// Move one active token to a new runtime shape node.
    MoveToken {
        /// Token expected at the request expected_position_ref.
        token_ref: ProcessTokenRef,
        /// Target runtime shape node.
        next_position_ref: ShapeNodeRef,
    },
    /// Consume one token after a normal terminal path.
    ConsumeToken {
        /// Token to consume.
        token_ref: ProcessTokenRef,
    },
    /// Terminate one token after cancellation or failure.
    TerminateToken {
        /// Token to terminate.
        token_ref: ProcessTokenRef,
        /// Termination reason.
        reason: TokenTerminationReason,
    },
    /// Select one gateway route and move the affected token to the selected route target.
    SelectGatewayRoute {
        /// Token affected by the selected route.
        token_ref: ProcessTokenRef,
        /// Gateway where the route is selected.
        gateway_ref: GatewayRef,
        /// Route selected from the gateway route set.
        route_ref: GatewayRouteRef,
        /// Token target node after route selection.
        next_position_ref: ShapeNodeRef,
        /// Route decision reason.
        decision_reason: GatewayDecisionReason,
    },
    /// Join a gateway using a stable set of process tokens.
    JoinGateway {
        /// Gateway to join.
        gateway_ref: GatewayRef,
        /// Tokens participating in the join.
        token_refs: Vec<ProcessTokenRef>,
    },
}
```

| `activity_transition` variant | 必填字段 | Domain method 映射 | policy / validation |
|---|---|---|---|
| `Ready` | 无 | `Activity.ready(progression_id, actor) -> ActivityTransitionOutcome` | 当前状态必须为 `Planned`;flow control 可为 `None` 或合法 token move;`progression_id` 由 application 生成 |
| `Start` | 无 | `Activity.start(progression_id, actor) -> ActivityTransitionOutcome` | 当前状态必须为 `Ready`;assignee / actor policy 满足;`progression_id` 由 application 生成 |
| `Complete` | `reason`;有 `Activity.feedback_ref` 或 `WaitingFeedback` 时必须带 `feedback_summary_ref` | `Activity.complete(progression_id, reason, actor) -> ActivityTransitionOutcome` | 若带 feedback,必须读取 matching `RuntimeFeedbackSummary` 并通过 `ActivityFeedbackPolicy.assert_feedback_can_complete(...)` 和 `assert_no_runtime_body(...)`;`progression_id` 由 application 生成 |
| `Skip` | `reason` | `Activity.skip(progression_id, reason, actor) -> ActivityTransitionOutcome` | skip reason 合法;若影响 token,flow control 必须显式给出 `ConsumeToken` / `MoveToken`;`progression_id` 由 application 生成 |
| `Fail` | `reason` | `Activity.fail(progression_id, reason, actor) -> ActivityTransitionOutcome` | failure reason 合法;若影响 token,flow control 必须显式给出 `TerminateToken`;`progression_id` 由 application 生成 |

`ActivityTransitionOutcome` 只承载 activity 自身 transition delta:`progression_id`、`activity_ref`、`from_state`、`to_state`、`feedback_ref`。它不是 append-only history,也不包含 token / gateway / selected route。完整 `ActivityProgressionRecord` 必须由 application flow 在 activity transition 和 token / gateway flow-control 都完成后,用同一个 outcome 加同事务 changed truth 统一构造。

| `flow_control` variant | 必填字段 | Domain method 映射 | policy / validation |
|---|---|---|---|
| `None` | 无 | 无 token / gateway method | 仅在本次 progression 不改变 flow-control truth 时允许 |
| `MoveToken` | `token_ref`;`next_position_ref` | `Token.move_to(next_position_ref)` | loaded token 必须属于 instance,且当前位置等于 `AdvanceProcessActivityRequest.expected_position_ref` |
| `ConsumeToken` | `token_ref` | `Token.consume()` | token 必须属于 instance 且处于可消费状态 |
| `TerminateToken` | `token_ref`;`reason` | `Token.terminate(reason)` | token 必须属于 instance 且处于可终止状态 |
| `SelectGatewayRoute` | `token_ref`;`gateway_ref`;`route_ref`;`next_position_ref`;`decision_reason` | `GatewayRoutingPolicy.assert_route_allowed(...)` -> `Gateway.select_route(route_ref, decision_reason, actor)` -> `Token.move_to(next_position_ref)` | route 必须属于 gateway route set;`Gateway.select_route` 必须写入 `Gateway.selected_route_ref = Some(route_ref)` |
| `JoinGateway` | `gateway_ref`;非空 `token_refs` | build `TokenSet` from loaded tokens -> `GatewayRoutingPolicy.assert_can_join(...)` -> `Gateway.join_tokens(token_set)` | tokens 必须属于同一 process instance,且 token set ref 使用 owning instance 的 `token_set_ref` |

##### 7.2.4 feedback summary and gateway policy input schema

`RuntimeFeedbackSummary`、`TokenSet`、`TokenSnapshot` 和 `GatewayRouteSet` 是 PH-03 domain policy input,归 `domain::reference` 或 `domain::token_gateway`。它们可以进入测试 fixture 和 fake resolver output,但不得保存外部正文、runtime queue、method shape body 或 provider response body。`RuntimeFeedbackSummary.runtime_feedback_ref` 与 `RuntimeFeedbackSummary.feedback_state` 复用 `contracts::refs` 中的 `RuntimeFeedbackRef` 与 `ReferenceResolutionState`。

```rust
/// Body-free summary used by ActivityFeedbackPolicy.
pub struct RuntimeFeedbackSummary {
    /// Stable summary reference supplied by runtime/member source or resolver.
    pub feedback_summary_ref: RuntimeFeedbackSummaryRef,
    /// Process-visible feedback marker.
    pub runtime_feedback_ref: RuntimeFeedbackRef,
    /// Activity the feedback claims to describe.
    pub activity_ref: ActivityRef,
    /// Feedback kind used by completion policy.
    pub feedback_kind: RuntimeFeedbackKind,
    /// Resolution state of the feedback source.
    pub feedback_state: ReferenceResolutionState,
    /// Optional source digest proving the summary material.
    pub source_digest: Option<SourceDigest>,
    /// Must be false; true means the summary leaked runtime body and is rejected.
    pub contains_runtime_body: bool,
}

/// Explicit token set passed to gateway join policy.
pub struct TokenSet {
    /// Token set reference owned by the process instance.
    pub token_set_ref: ProcessTokenSetRef,
    /// Owning process instance.
    pub process_instance_id: ProcessInstanceId,
    /// Tokens participating in this operation.
    pub token_refs: Vec<ProcessTokenRef>,
}

/// Body-free token state summary used by GatewayRoutingPolicy.
pub struct TokenSnapshot {
    /// Token set reference owned by the process instance.
    pub token_set_ref: ProcessTokenSetRef,
    /// Owning process instance.
    pub process_instance_id: ProcessInstanceId,
    /// Tokens visible in the snapshot.
    pub token_refs: Vec<ProcessTokenRef>,
    /// Number of active tokens in this set.
    pub active_count: u32,
    /// Number of waiting tokens in this set.
    pub waiting_count: u32,
    /// Number of consumed tokens in this set.
    pub consumed_count: u32,
    /// Number of terminated tokens in this set.
    pub terminated_count: u32,
}

/// Route set available to one gateway according to the runtime shape summary.
pub struct GatewayRouteSet {
    /// Gateway whose routes are described.
    pub gateway_ref: GatewayRef,
    /// Available route references for this gateway.
    pub route_refs: Vec<GatewayRouteRef>,
}
```

| 类型 | 字段闭环 | validation / policy 使用 |
|---|---|---|
| `RuntimeFeedbackSummary` | `feedback_summary_ref` 来自 request / inbound event;`runtime_feedback_ref` 来自 resolver marker;`activity_ref` 必须匹配 `Activity.activity_id`;`source_digest` 来自 source event / resolver | `assert_feedback_can_complete` 要求 `feedback_kind = Completion`、`feedback_state` 可用、activity 匹配;`assert_no_runtime_body` 要求 `contains_runtime_body = false` |
| `TokenSet` | `token_set_ref` 必须匹配 `ProcessInstance.token_set_ref`;`token_refs` 来自 token repository / command candidate | gateway join 时 `token_refs` 必须非空且全部属于同一 `process_instance_id` |
| `TokenSnapshot` | counts 和 `token_refs` 来自 token repository committed truth | counts 必须与 repository snapshot 一致;不得从 runtime queue 反推 |
| `GatewayRouteSet` | `gateway_ref` 来自 `Gateway`;`route_refs` 来自 `ProcessShapeRepository::get_gateway_route_set(gateway_ref)` 的 body-free route summary | `assert_route_allowed` 要求 route 属于 `route_refs`;空 route set 只能导致 policy reject;不得读取 method definition body |

#### 7.3 Start bootstrap summary

`StartProcessInstanceFlow` 校验 `ProcessStartIntentRef` 和创建 initial `Activity` / `Token` / optional `Gateway` 时,必须读取 body-free runtime shape bootstrap summary。该 summary 只暴露可落码的 start 节点元数据,不得包含 method definition body、条件表达式正文、脚本文本、runtime 执行正文或外部 GRC / artifact 正文。

```rust
/// Body-free start-node summary used to validate and bootstrap StartProcessInstance.
pub struct ProcessStartBootstrapSummary {
    /// Runtime shape that owns the start node.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Start node selected by ProcessStartIntentRef.
    pub start_node_ref: ShapeNodeRef,
    /// Activity kind declared by the runtime shape for the start node.
    pub activity_kind: ActivityKind,
    /// Whether this start node requires initial gateway tracking.
    pub requires_gateway_tracking: bool,
    /// Gateway identity and node/kind to initialize when gateway tracking is required.
    pub initial_gateway: Option<ProcessStartGatewayBootstrapSummary>,
}

/// Body-free gateway bootstrap summary for a start node.
pub struct ProcessStartGatewayBootstrapSummary {
    /// Stable gateway reference declared by the runtime shape summary.
    pub gateway_ref: GatewayRef,
    /// Runtime shape node represented by the gateway.
    pub shape_node_ref: ShapeNodeRef,
    /// Gateway kind declared by the runtime shape.
    pub gateway_kind: GatewayKind,
}
```

| 字段 | 来源 | 使用口径 | validation / 缺失处理 |
|---|---|---|---|
| `shape_ref` | `ProcessProfile.shape_ref` + `ProcessShapeRepository.get_start_bootstrap_summary(...)` | 确认 summary 属于 active profile runtime shape | 不匹配 -> repository error / reject |
| `start_node_ref` | request `ProcessStartIntentRef.start_node_ref` + shape indexed summary | 传入 `Activity::from_shape_node(...)` 和 `Token::start_at(...)` | missing / unknown / not startable -> `None` 或 reject |
| `activity_kind` | runtime shape body-free node summary | 传入 `Activity::from_shape_node(activity_id, instance_id, start_node_ref, activity_kind)` | 缺失时 reject;不得由 service 根据 node id 字符串推断 |
| `requires_gateway_tracking` | runtime shape body-free node summary | 决定 request `initial_gateway_ref` 是否必填 / 必须为空 | `true` 且 request 为空 -> reject;`false` 且 request 非空 -> reject |
| `initial_gateway.gateway_ref` | runtime shape body-free gateway summary | 与 request `initial_gateway_ref` 精确匹配 | 不匹配 -> reject;该 ref 不作为 generated `GatewayId` 来源 |
| `initial_gateway.shape_node_ref` | runtime shape body-free gateway summary | 传入 `Gateway::from_shape_node(gateway_id, shape_node_ref, gateway_kind)` | requires gateway tracking 时缺失 -> reject |
| `initial_gateway.gateway_kind` | runtime shape body-free gateway summary | 传入 `Gateway::from_shape_node(...)` | 缺失时 reject;不得由 service 根据 gateway ref 字符串推断 |

`ProcessStartBootstrapSummary` 归 `domain::runtime_shape` 或等价 body-free summary module;`ActivityKind` / `GatewayKind` 仍归 `contracts::refs`。application service 只能通过 `ProcessShapeRepository.get_start_bootstrap_summary(profile.shape_ref, start_intent_ref.start_node_ref)` 读取该 summary。`initial_gateway_ref` 是 caller intent 中对 runtime shape gateway summary 的选择和校验输入,不是本仓生成 `Gateway` truth identity 的来源;创建 `Gateway` truth 时仍由 `IdGeneratorPort::new_gateway_id()` 生成 `GatewayId`。

### 8. domain truth / execution 对象契约

#### 8.1 `RuntimeProcessShape`

```rust
/// Runtime process shape indexed from a method definition snapshot without storing method body.
pub struct RuntimeProcessShape {
    /// Stable runtime shape identifier owned by L1-process.
    pub shape_id: RuntimeProcessShapeId,
    /// External method definition reference used as the source of the shape.
    pub definition_ref: MethodDefinitionRef,
    /// External method definition version used to build this shape.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Lifecycle and validity state of the runtime shape.
    pub shape_state: RuntimeProcessShapeState,
    /// Cursor or digest proving which source snapshot was used.
    pub source_snapshot_ref: MethodDefinitionSnapshotRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `shape_id` | `RuntimeProcessShapeId` | 本仓运行时形态身份 | 必填,由 id generator 提供 |
| `definition_ref` | `MethodDefinitionRef` | method-library 定义来源 | 必填,只保存 ref |
| `definition_version_ref` | `MethodDefinitionVersionRef` | 定义版本 | 必填,用于 stale / invalid 判定 |
| `shape_state` | `RuntimeProcessShapeState` | 形态生命周期 | 必须为正式 enum |
| `source_snapshot_ref` | `MethodDefinitionSnapshotRef` | 构造来源快照 | 必填,不得保存 method body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn activate(&mut self, snapshot: &MethodDefinitionSnapshot, actor: ActorRef) -> Result<(), DomainError>` | 激活运行时形态 | `snapshot` 必须匹配 definition/version;`actor` 为发起者 | `Result<(), DomainError>` | 只允许 `DraftIndexed` / `Stale` -> `Active` |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记来源过期 | stale 原因 | `Result<(), DomainError>` | `Retired` 不得回到 stale |
| `pub fn mark_invalid(&mut self, reason: ShapeInvalidReason) -> Result<(), DomainError>` | 标记不可用 | invalid 原因 | `Result<(), DomainError>` | invalid 后不能普通 activate |
| `pub fn retire(&mut self, reason: ShapeRetireReason, actor: ActorRef) -> Result<(), DomainError>` | 退役形态 | 退役原因和 actor | `Result<(), DomainError>` | 进入 `Retired` 终态 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_definition(shape_id: RuntimeProcessShapeId, snapshot: MethodDefinitionSnapshot, actor: ActorRef) -> Result<Self, DomainError>` | 从定义快照构造 shape | id、合法 snapshot、actor | `Result<RuntimeProcessShape, DomainError>` | `SyncRuntimeProcessShape` |

```rust
/// Public reason category for runtime shape outbound events.
pub enum ShapeChangeReason {
    /// Shape was indexed from a method definition snapshot.
    Indexed,
    /// Shape was activated or re-activated from a valid snapshot.
    Activated,
    /// Shape source became stale.
    SourceStale,
    /// Shape source or boundary became invalid.
    Invalidated,
    /// Shape was retired by an explicit actor operation.
    Retired,
}
```

| `ShapeChangeReason` variant | 来源 |
|---|---|
| `Indexed` | `RuntimeProcessShape::from_definition(...)` accepted path |
| `Activated` | `RuntimeProcessShape.activate(...)` accepted path |
| `SourceStale` | `RuntimeProcessShape.mark_stale(ReferenceStaleReason)` accepted path |
| `Invalidated` | `RuntimeProcessShape.mark_invalid(ShapeInvalidReason)` accepted path |
| `Retired` | `RuntimeProcessShape.retire(ShapeRetireReason, ActorRef)` accepted path |

```rust
/// Runtime shape lifecycle and validity visible to public protocols.
pub enum RuntimeProcessShapeState {
    /// The shape was indexed from a source definition but is not active yet.
    DraftIndexed,
    /// The shape is active and may be adopted by a process profile.
    Active,
    /// The source definition changed or became older than the local index.
    Stale,
    /// The source definition cannot produce a valid runtime shape.
    Invalid,
    /// The shape was retired and cannot be reactivated by ordinary commands.
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `DraftIndexed` | `The shape was indexed from a source definition but is not active yet.` | 已索引未激活 | 工厂 | `Active` / `Invalid` / `Retired` |
| `Active` | `The shape is active and may be adopted by a process profile.` | 可采用 | `DraftIndexed` / `Stale` | `Stale` / `Invalid` / `Retired` |
| `Stale` | `The source definition changed or became older than the local index.` | 来源过期 | `Active` | `Active` / `Invalid` / `Retired` |
| `Invalid` | `The source definition cannot produce a valid runtime shape.` | 来源不可形成 shape | `DraftIndexed` / `Active` / `Stale` | `Retired` |
| `Retired` | `The shape was retired and cannot be reactivated by ordinary commands.` | 已退役 | 任意非终态 | 无 |

不变量与禁止事项:

- 不保存 method definition body。
- 不成为 BPMN 引擎语义容器。
- `Retired` 不允许普通路径重新激活。

#### 8.2 `ProcessProfile`

```rust
/// Adopted process context for a project, based on a runtime shape reference.
pub struct ProcessProfile {
    /// Stable profile identifier owned by L1-process.
    pub profile_id: ProcessProfileId,
    /// External project reference supplied by the work boundary.
    pub project_ref: ProjectRef,
    /// Runtime process shape adopted by this profile.
    pub shape_ref: RuntimeProcessShapeRef,
    /// Profile lifecycle state.
    pub profile_state: ProcessProfileState,
    /// Last accepted profile change record.
    pub last_change_ref: Option<ProfileChangeRecordRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `profile_id` | `ProcessProfileId` | profile 身份 | 必填 |
| `project_ref` | `ProjectRef` | 外部项目语境 | 只保存 ref,不保存 Project truth |
| `shape_ref` | `RuntimeProcessShapeRef` | 采用的 runtime shape | 必须指向 active 或显式接受 stale 的 shape |
| `profile_state` | `ProcessProfileState` | 生命周期 | 必须为正式 enum |
| `last_change_ref` | `Option<ProfileChangeRecordRef>` | 最近变化记录 | 变化时必须更新 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn activate(&mut self, shape: &RuntimeProcessShape, actor: ActorRef) -> Result<ProfileChangeRecord, DomainError>` | 激活 profile | shape 必须可采用 | `Result<ProfileChangeRecord, DomainError>` | `Proposed` / `Suspended` -> `Active` |
| `pub fn switch_to(&mut self, shape: &RuntimeProcessShape, reason: ProfileChangeReason, actor: ActorRef) -> Result<ProfileChangeRecord, DomainError>` | 切换 runtime shape | next shape、原因、actor | `Result<ProfileChangeRecord, DomainError>` | 只允许 active profile 显式切换 |
| `pub fn suspend(&mut self, reason: ProfileChangeReason, actor: ActorRef) -> Result<ProfileChangeRecord, DomainError>` | 暂停 profile | 原因、actor | `Result<ProfileChangeRecord, DomainError>` | `Active` -> `Suspended` |
| `pub fn retire(&mut self, reason: ProfileChangeReason, actor: ActorRef) -> Result<ProfileChangeRecord, DomainError>` | 退役 profile | 原因、actor | `Result<ProfileChangeRecord, DomainError>` | 进入 `Retired` 终态 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn propose(profile_id: ProcessProfileId, project_ref: ProjectRef, shape_ref: RuntimeProcessShapeRef, actor: ActorRef) -> Result<Self, DomainError>` | 建立待采用 profile | id、project、shape、actor | `Result<ProcessProfile, DomainError>` | `AdoptProcessProfile` |

```rust
/// Lifecycle of a process profile adopted by a project.
pub enum ProcessProfileState {
    /// The profile was proposed but is not the active process context yet.
    Proposed,
    /// The profile is active and may start process instances.
    Active,
    /// The profile is temporarily suspended and cannot start new instances.
    Suspended,
    /// The profile was retired and cannot be used by ordinary commands.
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Proposed` | `The profile was proposed but is not the active process context yet.` | 待采用 | 工厂 | `Active` / `Retired` |
| `Active` | `The profile is active and may start process instances.` | 可启动实例 | `Proposed` / `Suspended` | `Suspended` / `Retired` |
| `Suspended` | `The profile is temporarily suspended and cannot start new instances.` | 暂停使用 | `Active` | `Active` / `Retired` |
| `Retired` | `The profile was retired and cannot be used by ordinary commands.` | 已退役 | 任意非终态 | 无 |

不变量与禁止事项:

- 不拥有 Project truth。
- 不保存 method profile definition body。
- 高风险 tailoring 必须由 policy 校验正式依据。

#### 8.3 `ProcessInstance`

```rust
/// Process execution truth for one project process run.
pub struct ProcessInstance {
    /// Stable process instance identifier.
    pub process_instance_id: ProcessInstanceId,
    /// Profile used by this process instance.
    pub profile_ref: ProcessProfileRef,
    /// External project reference for the process context.
    pub project_ref: ProjectRef,
    /// Current lifecycle state of the process instance.
    pub instance_state: ProcessInstanceState,
    /// Current activity if the instance has a focused activity.
    pub current_activity_ref: Option<ActivityRef>,
    /// Current token set reference for flow control.
    pub token_set_ref: ProcessTokenSetRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `process_instance_id` | `ProcessInstanceId` | 实例身份 | 必填 |
| `profile_ref` | `ProcessProfileRef` | 采用 profile | 必填 |
| `project_ref` | `ProjectRef` | 外部项目语境 | 只保存 ref |
| `instance_state` | `ProcessInstanceState` | 实例生命周期 | 必须为正式 enum |
| `current_activity_ref` | `Option<ActivityRef>` | 当前活动 | Running / Waiting 可有当前活动 |
| `token_set_ref` | `ProcessTokenSetRef` | 流控 token 集合 | 不保存 runtime queue |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn start(&mut self, profile: &ProcessProfile, initial_activity_ref: ActivityRef, actor: ActorRef) -> Result<(), DomainError>` | 启动实例 | active profile、初始 activity ref、actor | `Result<(), DomainError>` | `NotStarted` -> `Running`;设置 `current_activity_ref = Some(initial_activity_ref)`;不生成 `ActivityProgressionRecord` |
| `pub fn advance(&mut self, activity_ref: ActivityRef, actor: ActorRef) -> Result<(), DomainError>` | 更新实例当前活动指针 | activity ref、actor | `Result<(), DomainError>` | 仅 `Running` 可推进;设置 `current_activity_ref = Some(activity_ref)`;不生成 `ActivityProgressionRecord` |
| `pub fn pause_for_gate(&mut self, gate: &WaitingGate, actor: ActorRef) -> Result<WaitingGateChangeRecord, DomainError>` | 进入等待 | waiting gate、actor | `Result<WaitingGateChangeRecord, DomainError>` | PH-04 reserved;`Running` -> `Waiting` |
| `pub fn resume_from_gate(&mut self, gate: &WaitingGate, actor: ActorRef) -> Result<WaitingGateChangeRecord, DomainError>` | 从等待恢复 | resumed gate、actor | `Result<WaitingGateChangeRecord, DomainError>` | PH-04 reserved;`Waiting` -> `Running` |
| `pub fn mark_recovering(&mut self, history_id: RecoveryHistoryId, checkpoint: &ProcessCheckpoint, attempt: &RecoveryAttempt, actor: ActorRef) -> Result<RecoveryHistoryRecord, DomainError>` | 进入恢复 | history id、checkpoint、attempt、actor | `Result<RecoveryHistoryRecord, DomainError>` | PH-04 reserved;非终态 -> `Recovering`;history kind = `InstanceRecovering` |
| `pub fn complete_recovery(&mut self, history_id: RecoveryHistoryId, attempt: &RecoveryAttempt, actor: ActorRef) -> Result<RecoveryHistoryRecord, DomainError>` | 完成恢复并回到运行 | history id、已 `Applied` 的 recovery attempt、actor | `Result<RecoveryHistoryRecord, DomainError>` | PH-04 reserved;`Recovering` -> `Running`;不得创建第二份 instance;history kind = `InstanceRecoveryCompleted` |
| `pub fn complete(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 完成实例 | actor | `Result<(), DomainError>` | `Running` -> `Completed`;只改变 instance truth;不生成 `ProcessTraceRecord` |
| `pub fn cancel(&mut self, reason: ProcessCancelReason, actor: ActorRef) -> Result<(), DomainError>` | 取消实例 | 原因、actor | `Result<(), DomainError>` | 非终态 -> `Cancelled`;只改变 instance truth;不生成 `ProcessTraceRecord` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(process_instance_id: ProcessInstanceId, profile: &ProcessProfile, project_ref: ProjectRef, token_set_ref: ProcessTokenSetRef, actor: ActorRef) -> Result<Self, DomainError>` | 创建实例 | id、profile、project、token set、actor | `Result<ProcessInstance, DomainError>` | `StartProcessInstance` |

```rust
/// Lifecycle of one process instance.
pub enum ProcessInstanceState {
    /// The instance exists but has not started running.
    NotStarted,
    /// The instance is running and can advance activities.
    Running,
    /// The instance is waiting for an explicit external resume condition.
    Waiting,
    /// The instance is being recovered from a checkpoint.
    Recovering,
    /// The instance completed successfully.
    Completed,
    /// The instance was explicitly cancelled.
    Cancelled,
    /// The instance failed and cannot continue by ordinary progression.
    Failed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `NotStarted` | `The instance exists but has not started running.` | 未开始 | 工厂 | `Running` / `Cancelled` |
| `Running` | `The instance is running and can advance activities.` | 可推进 | `NotStarted` / `Waiting` / `Recovering` | `Waiting` / `Recovering` / `Completed` / `Cancelled` / `Failed` |
| `Waiting` | `The instance is waiting for an explicit external resume condition.` | 等待中 | `Running` | `Running` / `Cancelled` / `Failed` |
| `Recovering` | `The instance is being recovered from a checkpoint.` | 恢复中 | 非终态 | `Running` / `Failed` / `Cancelled` |
| `Completed` | `The instance completed successfully.` | 已完成 | `Running` | 无 |
| `Cancelled` | `The instance was explicitly cancelled.` | 已取消 | 非终态 | 无 |
| `Failed` | `The instance failed and cannot continue by ordinary progression.` | 已失败 | 非终态 | 无 |

不变量与禁止事项:

- 不等同 Project / Work truth。
- commit-03-a 只落 `NotStarted` / `Running` / `Completed` / `Cancelled` 运行子集;`Waiting` / `Recovering` / `Failed` 及对应方法为 PH-04 waiting/recovery boundary reserved,当前 domain tests 只需确认这些路径不可由 commit-03-a public flow 推进。
- recovery 不创建第二份实例。
- Query、consumer、projection、job 不得隐式创建或推进实例。

#### 8.4 `Activity`

```rust
/// Process activity node state and feedback binding.
pub struct Activity {
    /// Stable activity identifier.
    pub activity_id: ActivityId,
    /// Owning process instance identifier.
    pub process_instance_id: ProcessInstanceId,
    /// Runtime shape node represented by this activity.
    pub shape_node_ref: ShapeNodeRef,
    /// Activity kind declared by the runtime shape.
    pub activity_kind: ActivityKind,
    /// Optional actor currently assigned to the activity.
    pub assignee_ref: Option<ActorRef>,
    /// Current activity lifecycle state.
    pub activity_state: ActivityState,
    /// Runtime feedback reference bound to this activity.
    pub feedback_ref: Option<RuntimeFeedbackRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `activity_id` | `ActivityId` | 活动身份 | 必填 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 | 必填 |
| `shape_node_ref` | `ShapeNodeRef` | 运行时形态节点 | 必填 |
| `activity_kind` | `ActivityKind` | 活动类别 | 必须来自 runtime shape |
| `assignee_ref` | `Option<ActorRef>` | 承担者 | 只保存 actor ref |
| `activity_state` | `ActivityState` | 活动状态 | 必须为正式 enum |
| `feedback_ref` | `Option<RuntimeFeedbackRef>` | 外部反馈 | 只保存 ref,不保存 execution body |

```rust
/// Activity-only transition delta returned before token / gateway flow-control is applied.
pub struct ActivityTransitionOutcome {
    /// Progression identifier generated by application.
    pub progression_id: ActivityProgressionId,
    /// Activity affected by the transition.
    pub activity_ref: ActivityRef,
    /// Activity state before the transition.
    pub from_state: ActivityState,
    /// Activity state after the transition.
    pub to_state: ActivityState,
    /// Runtime feedback reference after the transition when applicable.
    pub feedback_ref: Option<RuntimeFeedbackRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `progression_id` | `ActivityProgressionId` | 本次 activity progression 身份 | 必须由 application 通过 `IdGeneratorPort::new_activity_progression_id()` 生成后传入 |
| `activity_ref` | `ActivityRef` | 被推进的 activity | 必须来自当前 `Activity` |
| `from_state` | `ActivityState` | transition 前状态 | 必须是 mutation 前的 committed / loaded state |
| `to_state` | `ActivityState` | transition 后状态 | 必须是 mutation 后的当前 state |
| `feedback_ref` | `Option<RuntimeFeedbackRef>` | transition 后绑定的 feedback ref | 只保存 ref;不得保存 runtime execution body |

`ActivityTransitionOutcome` 是 application 构造完整 progression record 的中间 delta,不是持久化 history record。它不能包含 `token_refs`、`gateway_ref` 或 `selected_route_ref`,因为这些字段必须来自同一 UoW 中后续 token / gateway flow-control 的 changed truth。

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assign(&mut self, progression_id: ActivityProgressionId, actor_ref: ActorRef, requested_by: ActorRef) -> Result<ActivityTransitionOutcome, DomainError>` | 指定承担者 | progression id、assignee、请求 actor | `Result<ActivityTransitionOutcome, DomainError>` | 不改变外部 identity truth;outcome 使用调用方传入 id |
| `pub fn ready(&mut self, progression_id: ActivityProgressionId, actor: ActorRef) -> Result<ActivityTransitionOutcome, DomainError>` | 标记可执行 | progression id、actor | `Result<ActivityTransitionOutcome, DomainError>` | `Planned` -> `Ready`;outcome 使用调用方传入 id |
| `pub fn start(&mut self, progression_id: ActivityProgressionId, actor: ActorRef) -> Result<ActivityTransitionOutcome, DomainError>` | 开始活动 | progression id、actor | `Result<ActivityTransitionOutcome, DomainError>` | `Ready` -> `InProgress`;outcome 使用调用方传入 id |
| `pub fn attach_feedback(&mut self, progression_id: ActivityProgressionId, feedback_ref: RuntimeFeedbackRef) -> Result<ActivityTransitionOutcome, DomainError>` | 绑定外部反馈 | progression id、runtime feedback ref | `Result<ActivityTransitionOutcome, DomainError>` | 不保存 runtime body;outcome 使用调用方传入 id |
| `pub fn complete(&mut self, progression_id: ActivityProgressionId, reason: ActivityCompletionReason, actor: ActorRef) -> Result<ActivityTransitionOutcome, DomainError>` | 完成活动 | progression id、原因、actor | `Result<ActivityTransitionOutcome, DomainError>` | 合法状态 -> `Completed`;outcome 使用调用方传入 id |
| `pub fn skip(&mut self, progression_id: ActivityProgressionId, reason: ActivitySkipReason, actor: ActorRef) -> Result<ActivityTransitionOutcome, DomainError>` | 跳过活动 | progression id、原因、actor | `Result<ActivityTransitionOutcome, DomainError>` | 非终态 -> `Skipped`;outcome 使用调用方传入 id |
| `pub fn fail(&mut self, progression_id: ActivityProgressionId, reason: ActivityFailureReason, actor: ActorRef) -> Result<ActivityTransitionOutcome, DomainError>` | 标记失败 | progression id、原因、actor | `Result<ActivityTransitionOutcome, DomainError>` | 非终态 -> `Failed`;outcome 使用调用方传入 id |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_shape_node(activity_id: ActivityId, process_instance_id: ProcessInstanceId, shape_node_ref: ShapeNodeRef, activity_kind: ActivityKind) -> Result<Self, DomainError>` | 从 runtime shape 节点创建活动 | id、instance、node、kind | `Result<Activity, DomainError>` | instance start / progression |

```rust
/// Lifecycle and feedback state of a process activity.
pub enum ActivityState {
    /// The activity is planned but not actionable yet.
    Planned,
    /// The activity is ready to start.
    Ready,
    /// The activity is in progress.
    InProgress,
    /// The activity is waiting for runtime or member feedback.
    WaitingFeedback,
    /// The activity completed successfully.
    Completed,
    /// The activity was skipped by a valid process decision.
    Skipped,
    /// The activity failed and cannot continue by ordinary completion.
    Failed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Planned` | `The activity is planned but not actionable yet.` | 已计划 | 工厂 | `Ready` / `Skipped` / `Failed` |
| `Ready` | `The activity is ready to start.` | 可执行 | `Planned` | `InProgress` / `Skipped` / `Failed` |
| `InProgress` | `The activity is in progress.` | 进行中 | `Ready` | `WaitingFeedback` / `Completed` / `Failed` |
| `WaitingFeedback` | `The activity is waiting for runtime or member feedback.` | 等待反馈 | `InProgress` | `Completed` / `Failed` |
| `Completed` | `The activity completed successfully.` | 完成 | `InProgress` / `WaitingFeedback` | 无 |
| `Skipped` | `The activity was skipped by a valid process decision.` | 跳过 | `Planned` / `Ready` / `InProgress` | 无 |
| `Failed` | `The activity failed and cannot continue by ordinary completion.` | 失败 | 非终态 | 无 |

不变量与禁止事项:

- 不等同 WorkItem。
- 不保存 runtime execution log、tool call、agent loop 或 reasoning body。
- runtime feedback consumer 不能直接把活动完成;正式完成走 command / policy。

#### 8.5 `Token`

```rust
/// Flow-control token that records a process instance position.
pub struct Token {
    /// Stable token identifier.
    pub token_id: ProcessTokenId,
    /// Owning process instance identifier.
    pub process_instance_id: ProcessInstanceId,
    /// Runtime shape node where the token currently sits.
    pub position_ref: ShapeNodeRef,
    /// Current token lifecycle state.
    pub token_state: TokenState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `token_id` | `ProcessTokenId` | token 身份 | 必填 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 | 必填 |
| `position_ref` | `ShapeNodeRef` | 当前节点位置 | 必须来自 runtime shape |
| `token_state` | `TokenState` | 流控状态 | 必须为正式 enum |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn move_to(&mut self, position_ref: ShapeNodeRef) -> Result<(), DomainError>` | 移动到新节点 | next node ref | `Result<(), DomainError>` | 仅 `Active` 可移动 |
| `pub fn wait_at(&mut self, position_ref: ShapeNodeRef) -> Result<(), DomainError>` | 停在等待点 | wait node ref | `Result<(), DomainError>` | `Active` -> `Waiting` |
| `pub fn resume_at(&mut self, position_ref: ShapeNodeRef) -> Result<(), DomainError>` | 从等待恢复 | resume node ref | `Result<(), DomainError>` | `Waiting` -> `Active` |
| `pub fn consume(&mut self) -> Result<(), DomainError>` | 消费 token | 无 | `Result<(), DomainError>` | 非终态 -> `Consumed` |
| `pub fn terminate(&mut self, reason: TokenTerminationReason) -> Result<(), DomainError>` | 终止 token | 终止原因 | `Result<(), DomainError>` | 非终态 -> `Terminated` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start_at(token_id: ProcessTokenId, process_instance_id: ProcessInstanceId, start_node_ref: ShapeNodeRef) -> Result<Self, DomainError>` | 创建起点 token | id、instance、start node | `Result<Token, DomainError>` | `StartProcessInstance` |

```rust
/// Flow-control token state.
pub enum TokenState {
    /// The token can move to the next runtime shape node.
    Active,
    /// The token is blocked at a waiting point.
    Waiting,
    /// The token path was consumed by a normal process transition.
    Consumed,
    /// The token path was terminated by cancellation or failure.
    Terminated,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `The token can move to the next runtime shape node.` | 可推进 | 工厂 / `Waiting` | `Waiting` / `Consumed` / `Terminated` |
| `Waiting` | `The token is blocked at a waiting point.` | 等待 | `Active` | `Active` / `Terminated` |
| `Consumed` | `The token path was consumed by a normal process transition.` | 已消费 | `Active` / `Waiting` | 无 |
| `Terminated` | `The token path was terminated by cancellation or failure.` | 已终止 | `Active` / `Waiting` | 无 |

不变量与禁止事项:

- 不作为 runtime queue item。
- 不保存完整 BPMN token 语义。

#### 8.6 `Gateway`

```rust
/// Runtime shape gateway used to choose or join process routes.
pub struct Gateway {
    /// Stable gateway identifier.
    pub gateway_id: GatewayId,
    /// Runtime shape node represented by this gateway.
    pub shape_node_ref: ShapeNodeRef,
    /// Gateway routing kind.
    pub gateway_kind: GatewayKind,
    /// Current routing state.
    pub gateway_state: GatewayState,
    /// Route selected by select_route when gateway_state is RouteSelected or Joined.
    pub selected_route_ref: Option<GatewayRouteRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `gateway_id` | `GatewayId` | 网关身份 | 必填 |
| `shape_node_ref` | `ShapeNodeRef` | runtime shape 节点 | 必填 |
| `gateway_kind` | `GatewayKind` | 分支 / 合流类别 | 必须为正式 enum |
| `gateway_state` | `GatewayState` | 路由状态 | 必须为正式 enum |
| `selected_route_ref` | `Option<GatewayRouteRef>` | 已选择路线 | `PendingDecision` / `PendingJoin` / `Invalid` 必须为 `None`;`RouteSelected` 必须为 `Some`;`Joined` 若由 route selection 而来则保留同一个 `Some`,pure join 则为 `None` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn select_route(&mut self, route_ref: GatewayRouteRef, reason: GatewayDecisionReason, actor: ActorRef) -> Result<(), DomainError>` | 选择路线 | route、原因、actor | `Result<(), DomainError>` | `PendingDecision` -> `RouteSelected`;设置 `selected_route_ref = Some(route_ref)` |
| `pub fn join_tokens(&mut self, tokens: TokenSet) -> Result<(), DomainError>` | 合并 token | token set | `Result<(), DomainError>` | `PendingJoin` -> `Joined` 或 `RouteSelected` -> `Joined`;若已有 `selected_route_ref` 必须保留 |
| `pub fn mark_invalid(&mut self, reason: GatewayInvalidReason) -> Result<(), DomainError>` | 标记不可用 | invalid reason | `Result<(), DomainError>` | 非终态 -> `Invalid`;清空 `selected_route_ref` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_shape_node(gateway_id: GatewayId, shape_node_ref: ShapeNodeRef, gateway_kind: GatewayKind) -> Result<Self, DomainError>` | 从 shape 节点创建网关 | id、node、kind | `Result<Gateway, DomainError>` | instance start / progression |

```rust
/// Gateway routing state.
pub enum GatewayState {
    /// The gateway is waiting for a route decision.
    PendingDecision,
    /// A route was selected for this gateway.
    RouteSelected,
    /// The gateway is waiting for required incoming tokens to join.
    PendingJoin,
    /// The gateway joined all required incoming tokens.
    Joined,
    /// The gateway cannot be used because its shape or decision is invalid.
    Invalid,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `PendingDecision` | `The gateway is waiting for a route decision.` | 待决策 | 工厂 | `RouteSelected` / `Invalid` |
| `RouteSelected` | `A route was selected for this gateway.` | 已选路 | `PendingDecision` | `Joined` / `Invalid` |
| `PendingJoin` | `The gateway is waiting for required incoming tokens to join.` | 待合流 | 工厂 | `Joined` / `Invalid` |
| `Joined` | `The gateway joined all required incoming tokens.` | 已合流 | `PendingJoin` / `RouteSelected` | 无 |
| `Invalid` | `The gateway cannot be used because its shape or decision is invalid.` | 不可用 | 任意非终态 | 无 |

不变量与禁止事项:

- 不实现完整 BPMN 引擎。
- 不自造 governance decision。
- route selection 的唯一 truth 落点是 `Gateway.selected_route_ref`;`ActivityProgressionRecord`、command result 和 outbound event 只能复制同事务已保存的该字段,不得重新按当前 shape 或 adapter 输出推导。

### 9. gate / recovery / timing 对象契约

#### 9.1 `WaitingGate`

```rust
/// Waiting point that blocks a process instance until an explicit resume condition is met.
pub struct WaitingGate {
    /// Stable waiting gate identifier.
    pub waiting_gate_id: WaitingGateId,
    /// Owning process instance identifier.
    pub process_instance_id: ProcessInstanceId,
    /// Activity that opened the waiting gate.
    pub activity_ref: ActivityRef,
    /// Current waiting gate state.
    pub gate_state: WaitingGateState,
    /// Pause context captured when the gate was opened.
    pub pause_context_ref: PauseContextRef,
    /// Optional governance decision reference used as resume evidence.
    pub decision_ref: Option<GovernanceDecisionRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `waiting_gate_id` | `WaitingGateId` | 等待点身份 | 必填 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 | 必填 |
| `activity_ref` | `ActivityRef` | 触发等待的活动 | 必填 |
| `gate_state` | `WaitingGateState` | 等待状态 | 必须为正式 enum |
| `pause_context_ref` | `PauseContextRef` | 暂停上下文 | 必填 |
| `decision_ref` | `Option<GovernanceDecisionRef>` | 外部恢复依据 | 只保存 ref,不保存 decision body |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn attach_decision(&mut self, decision_ref: GovernanceDecisionRef, actor: ActorRef) -> Result<WaitingGateChangeRecord, DomainError>` | 绑定治理依据 | decision ref、actor | `Result<WaitingGateChangeRecord, DomainError>` | `Waiting` -> `DecisionResolved` |
| `pub fn resume(&mut self, reason: ResumeReason, actor: ActorRef) -> Result<WaitingGateChangeRecord, DomainError>` | 恢复等待 | 原因、actor | `Result<WaitingGateChangeRecord, DomainError>` | `DecisionResolved` -> `Resumed` |
| `pub fn cancel(&mut self, reason: WaitingCancelReason, actor: ActorRef) -> Result<WaitingGateChangeRecord, DomainError>` | 取消等待 | 原因、actor | `Result<WaitingGateChangeRecord, DomainError>` | 非终态 -> `Cancelled` |
| `pub fn expire(&mut self, reason: WaitingExpireReason) -> Result<WaitingGateChangeRecord, DomainError>` | 等待过期 | 过期原因 | `Result<WaitingGateChangeRecord, DomainError>` | `Waiting` / `DecisionResolved` -> `Expired` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open_for_activity(waiting_gate_id: WaitingGateId, process_instance_id: ProcessInstanceId, activity_ref: ActivityRef, pause_context: PauseContext) -> Result<Self, DomainError>` | 建立等待点 | id、instance、activity、pause context | `Result<WaitingGate, DomainError>` | `OpenWaitingGate` |

```rust
/// Waiting gate lifecycle state.
pub enum WaitingGateState {
    /// The gate is waiting for an external resume condition.
    Waiting,
    /// A matching external decision was resolved but resume has not been applied.
    DecisionResolved,
    /// The gate was resumed and no longer blocks the process instance.
    Resumed,
    /// The gate was cancelled by an explicit command.
    Cancelled,
    /// The gate expired before it could be resumed.
    Expired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Waiting` | `The gate is waiting for an external resume condition.` | 等待中 | 工厂 | `DecisionResolved` / `Cancelled` / `Expired` |
| `DecisionResolved` | `A matching external decision was resolved but resume has not been applied.` | 依据已解析 | `Waiting` | `Resumed` / `Cancelled` / `Expired` |
| `Resumed` | `The gate was resumed and no longer blocks the process instance.` | 已恢复 | `DecisionResolved` | 无 |
| `Cancelled` | `The gate was cancelled by an explicit command.` | 已取消 | `Waiting` / `DecisionResolved` | 无 |
| `Expired` | `The gate expired before it could be resumed.` | 已过期 | `Waiting` / `DecisionResolved` | 无 |

不变量与禁止事项:

- 不生成 governance decision。
- 不后台静默恢复。
- 恢复必须有 actor context 和正式依据。

#### 9.2 `PauseContext`

```rust
/// Context captured when a process instance pauses at a waiting gate.
pub struct PauseContext {
    /// Stable pause context identifier.
    pub pause_context_id: PauseContextId,
    /// Activity that created the pause context.
    pub activity_ref: ActivityRef,
    /// Reason for pausing the process instance.
    pub pause_reason: PauseReason,
    /// External requirement needed to resume.
    pub resume_requirement_ref: ResumeRequirementRef,
    /// Timestamp when the pause context was captured.
    pub captured_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `pause_context_id` | `PauseContextId` | 暂停上下文身份 | 必填 |
| `activity_ref` | `ActivityRef` | 暂停关联活动 | 必填 |
| `pause_reason` | `PauseReason` | 暂停原因 | 必填 |
| `resume_requirement_ref` | `ResumeRequirementRef` | 恢复所需依据 | 只保存 ref |
| `captured_at` | `Timestamp` | 捕获时间 | 来自 clock port |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_governance_decision(&self) -> bool` | 判断是否需要治理决策 | 无 | `bool` | 纯判断 |
| `pub fn matches_decision(&self, decision_ref: &GovernanceDecisionRef) -> bool` | 判断决策是否满足恢复要求 | decision ref | `bool` | 不读取 decision body |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_activity(pause_context_id: PauseContextId, activity_ref: ActivityRef, pause_reason: PauseReason, requirement_ref: ResumeRequirementRef, captured_at: Timestamp) -> Result<Self, DomainError>` | 从活动暂停意图形成上下文 | id、activity、reason、requirement、time | `Result<PauseContext, DomainError>` | `OpenWaitingGate` |

不变量与禁止事项:

- 不保存 decision body。
- 不替代 checkpoint。

#### 9.3 `ProcessCheckpoint`

```rust
/// Instance-level recovery checkpoint that preserves recovery continuity.
pub struct ProcessCheckpoint {
    /// Stable checkpoint identifier.
    pub checkpoint_id: ProcessCheckpointId,
    /// Owning process instance identifier.
    pub process_instance_id: ProcessInstanceId,
    /// Optional activity associated with the checkpoint.
    pub activity_ref: Option<ActivityRef>,
    /// Current checkpoint validity state.
    pub checkpoint_state: CheckpointState,
    /// Evidence reference for recovery.
    pub evidence_ref: CheckpointEvidenceRef,
    /// Optional next checkpoint that superseded this checkpoint.
    pub superseded_by: Option<ProcessCheckpointRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `checkpoint_id` | `ProcessCheckpointId` | checkpoint 身份 | 必填 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 | 必填 |
| `activity_ref` | `Option<ActivityRef>` | 对应活动 | 可空 |
| `checkpoint_state` | `CheckpointState` | 有效性 | 必须为正式 enum |
| `evidence_ref` | `CheckpointEvidenceRef` | 恢复依据 | 只保存 ref |
| `superseded_by` | `Option<ProcessCheckpointRef>` | 替代者 | Superseded 时必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_superseded(&mut self, next_ref: ProcessCheckpointRef) -> Result<(), DomainError>` | 标记被替代 | next checkpoint | `Result<(), DomainError>` | `Available` -> `Superseded` |
| `pub fn invalidate(&mut self, reason: CheckpointInvalidReason) -> Result<(), DomainError>` | 标记无效 | 原因 | `Result<(), DomainError>` | 非终态 -> `Invalid` |
| `pub fn expire(&mut self, reason: CheckpointExpireReason) -> Result<(), DomainError>` | 标记过期 | 原因 | `Result<(), DomainError>` | `Available` -> `Expired` |
| `pub fn can_resume(&self, instance: &ProcessInstance) -> bool` | 判断是否可恢复同一实例 | instance | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(checkpoint_id: ProcessCheckpointId, instance: &ProcessInstance, activity_ref: Option<ActivityRef>, evidence_ref: CheckpointEvidenceRef) -> Result<Self, DomainError>` | 捕获 checkpoint | id、instance、activity、evidence | `Result<ProcessCheckpoint, DomainError>` | `CreateProcessCheckpoint` |

```rust
/// Checkpoint validity state.
pub enum CheckpointState {
    /// The checkpoint can be used for recovery.
    Available,
    /// The checkpoint was superseded by a newer checkpoint.
    Superseded,
    /// The checkpoint is invalid and cannot be used.
    Invalid,
    /// The checkpoint expired by retention policy.
    Expired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Available` | `The checkpoint can be used for recovery.` | 可恢复 | 工厂 | `Superseded` / `Invalid` / `Expired` |
| `Superseded` | `The checkpoint was superseded by a newer checkpoint.` | 被替代 | `Available` | 无 |
| `Invalid` | `The checkpoint is invalid and cannot be used.` | 无效 | `Available` | 无 |
| `Expired` | `The checkpoint expired by retention policy.` | 过期 | `Available` | 无 |

不变量与禁止事项:

- 不保存 runtime micro checkpoint。
- 不创建第二份 Process truth。

#### 9.4 `RecoveryAttempt`

```rust
/// Recovery attempt for applying a checkpoint to the same process instance.
pub struct RecoveryAttempt {
    /// Stable recovery attempt identifier.
    pub recovery_attempt_id: RecoveryAttemptId,
    /// Process instance being recovered.
    pub process_instance_id: ProcessInstanceId,
    /// Checkpoint used by this attempt.
    pub checkpoint_ref: ProcessCheckpointRef,
    /// Current recovery attempt state.
    pub recovery_state: RecoveryAttemptState,
    /// Failure reason when recovery failed.
    pub failure_reason: Option<RecoveryFailureReason>,
    /// Abandon reason when recovery was abandoned.
    pub abandon_reason: Option<RecoveryAbandonReason>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `recovery_attempt_id` | `RecoveryAttemptId` | 恢复尝试身份 | 必填 |
| `process_instance_id` | `ProcessInstanceId` | 被恢复实例 | 必填 |
| `checkpoint_ref` | `ProcessCheckpointRef` | 使用的 checkpoint | 必填 |
| `recovery_state` | `RecoveryAttemptState` | 尝试状态 | 必须为正式 enum |
| `failure_reason` | `Option<RecoveryFailureReason>` | 失败原因 | Failed 时必填 |
| `abandon_reason` | `Option<RecoveryAbandonReason>` | 放弃原因 | Abandoned 时必填;其他状态必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_applied(&mut self, history_id: RecoveryHistoryId, actor: ActorRef) -> Result<RecoveryHistoryRecord, DomainError>` | 标记已应用 | history id、actor | `Result<RecoveryHistoryRecord, DomainError>` | `Pending` -> `Applied`;history kind = `AttemptApplied`;`failure_reason` / `abandon_reason` 必须为空 |
| `pub fn mark_failed(&mut self, history_id: RecoveryHistoryId, reason: RecoveryFailureReason) -> Result<RecoveryHistoryRecord, DomainError>` | 标记失败 | history id、reason | `Result<RecoveryHistoryRecord, DomainError>` | `Pending` -> `Failed`;保存 `failure_reason`;history kind = `AttemptFailed`;`abandon_reason` 必须为空 |
| `pub fn abandon(&mut self, history_id: RecoveryHistoryId, reason: RecoveryAbandonReason, actor: ActorRef) -> Result<RecoveryHistoryRecord, DomainError>` | 放弃恢复 | history id、reason、actor | `Result<RecoveryHistoryRecord, DomainError>` | `Pending` / `Failed` -> `Abandoned`;保存 `abandon_reason`;history kind = `AttemptAbandoned` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(recovery_attempt_id: RecoveryAttemptId, process_instance_id: ProcessInstanceId, checkpoint_ref: ProcessCheckpointRef, actor: ActorRef) -> Result<Self, DomainError>` | 建立恢复尝试 | id、instance、checkpoint、actor | `Result<RecoveryAttempt, DomainError>` | `StartRecoveryAttempt` |

```rust
/// Recovery attempt state.
pub enum RecoveryAttemptState {
    /// The recovery attempt is pending application.
    Pending,
    /// The recovery attempt was applied to the same process instance.
    Applied,
    /// The recovery attempt failed.
    Failed,
    /// The recovery attempt was abandoned and will not be applied.
    Abandoned,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The recovery attempt is pending application.` | 待应用 | 工厂 | `Applied` / `Failed` / `Abandoned` |
| `Applied` | `The recovery attempt was applied to the same process instance.` | 已应用 | `Pending` | 无 |
| `Failed` | `The recovery attempt failed.` | 失败 | `Pending` | `Abandoned` |
| `Abandoned` | `The recovery attempt was abandoned and will not be applied.` | 放弃 | `Pending` / `Failed` | 无 |

不变量与禁止事项:

- `failure_reason` 只能在 `recovery_state = Failed` 时填写。
- `abandon_reason` 只能在 `recovery_state = Abandoned` 时填写。
- recovery attempt 只延续同一 `ProcessInstance`,不得创建替代实例。

- 不覆盖 checkpoint truth。
- 不保存 reasoning trace 或 archive package。

#### 9.5 `ProcessStageState`

```rust
/// Process stage state used for rhythm and stage-level progress.
pub struct ProcessStageState {
    /// Stable stage identifier.
    pub stage_id: ProcessStageId,
    /// Owning process instance identifier.
    pub process_instance_id: ProcessInstanceId,
    /// Stage kind from the adopted profile.
    pub stage_kind: ProcessStageKind,
    /// Current stage lifecycle state.
    pub stage_state: StageState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `stage_id` | `ProcessStageId` | 阶段身份 | 必填 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 | 必填 |
| `stage_kind` | `ProcessStageKind` | 阶段类别 | 必须来自 profile |
| `stage_state` | `StageState` | 阶段状态 | 必须为正式 enum |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn activate(&mut self, actor: ActorRef) -> Result<(), DomainError>` | 进入阶段 | actor | `Result<(), DomainError>` | `Pending` -> `Active` |
| `pub fn pause(&mut self, reason: StagePauseReason, actor: ActorRef) -> Result<(), DomainError>` | 暂停阶段 | reason、actor | `Result<(), DomainError>` | `Active` -> `Paused` |
| `pub fn complete(&mut self, reason: StageCompletionReason, actor: ActorRef) -> Result<(), DomainError>` | 完成阶段 | reason、actor | `Result<(), DomainError>` | `Active` / `Paused` -> `Completed` |
| `pub fn skip(&mut self, reason: StageSkipReason, actor: ActorRef) -> Result<(), DomainError>` | 跳过阶段 | reason、actor | `Result<(), DomainError>` | `Pending` / `Active` -> `Skipped` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_profile_stage(stage_id: ProcessStageId, process_instance_id: ProcessInstanceId, stage_ref: ProfileStageRef) -> Result<Self, DomainError>` | 从 profile 阶段创建状态 | id、instance、stage ref | `Result<ProcessStageState, DomainError>` | `StartProcessInstance` / rhythm binding |

```rust
/// Stage lifecycle state.
pub enum StageState {
    /// The stage has not started yet.
    Pending,
    /// The stage is active.
    Active,
    /// The stage is paused.
    Paused,
    /// The stage completed.
    Completed,
    /// The stage was skipped by an explicit process decision.
    Skipped,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The stage has not started yet.` | 待进入 | 工厂 | `Active` / `Skipped` |
| `Active` | `The stage is active.` | 进行中 | `Pending` / `Paused` | `Paused` / `Completed` / `Skipped` |
| `Paused` | `The stage is paused.` | 暂停 | `Active` | `Active` / `Completed` / `Skipped` |
| `Completed` | `The stage completed.` | 完成 | `Active` / `Paused` | 无 |
| `Skipped` | `The stage was skipped by an explicit process decision.` | 跳过 | `Pending` / `Active` / `Paused` | 无 |

不变量与禁止事项:

- 不等同 Work Iteration。
- 不保存 planning / review / retro 会议正文。

#### 9.6 `ProcessTimeboxBinding`

```rust
/// Reference binding between a process timebox and an external work timebox.
pub struct ProcessTimeboxBinding {
    /// Stable binding identifier.
    pub binding_id: ProcessTimeboxBindingId,
    /// Process-owned timebox reference.
    pub process_timebox_ref: ProcessTimeboxRef,
    /// External work timebox or iteration reference.
    pub external_timebox_ref: ExternalTimeboxRef,
    /// Current binding state.
    pub binding_state: TimeboxBindingState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `binding_id` | `ProcessTimeboxBindingId` | 绑定身份 | 必填 |
| `process_timebox_ref` | `ProcessTimeboxRef` | 过程 timebox | 必填 |
| `external_timebox_ref` | `ExternalTimeboxRef` | 外部 timebox / iteration | 只保存 ref |
| `binding_state` | `TimeboxBindingState` | 绑定状态 | 必须为正式 enum |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | `Active` -> `Stale` |
| `pub fn mark_active(&mut self, snapshot: &WorkContextSnapshot) -> Result<(), DomainError>` | 重新确认绑定有效 | refreshed work context snapshot | `Result<(), DomainError>` | `Stale` -> `Active`;不得改写 Work truth |
| `pub fn release(&mut self, reason: TimeboxReleaseReason, actor: ActorRef) -> Result<(), DomainError>` | 解除绑定 | reason、actor | `Result<(), DomainError>` | `Active` / `Stale` -> `Released` |
| `pub fn mark_invalid(&mut self, reason: TimeboxInvalidReason) -> Result<(), DomainError>` | 标记不可用 | reason | `Result<(), DomainError>` | 非终态 -> `Invalid` |
| `pub fn is_active(&self) -> bool` | 判断是否生效 | 无 | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn bind(binding_id: ProcessTimeboxBindingId, process_timebox_ref: ProcessTimeboxRef, external_timebox_ref: ExternalTimeboxRef, actor: ActorRef) -> Result<Self, DomainError>` | 建立绑定 | id、process ref、external ref、actor | `Result<ProcessTimeboxBinding, DomainError>` | `BindProcessTimebox` |

```rust
/// Timebox binding lifecycle state.
pub enum TimeboxBindingState {
    /// The binding is active and can explain process rhythm.
    Active,
    /// The external timebox reference is stale.
    Stale,
    /// The binding was released explicitly.
    Released,
    /// The binding is invalid and cannot be used.
    Invalid,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `The binding is active and can explain process rhythm.` | 生效 | 工厂 | `Stale` / `Released` / `Invalid` |
| `Stale` | `The external timebox reference is stale.` | 外部过期 | `Active` | `Active` / `Released` / `Invalid` |
| `Released` | `The binding was released explicitly.` | 已解除 | `Active` / `Stale` | 无 |
| `Invalid` | `The binding is invalid and cannot be used.` | 不可用 | `Active` / `Stale` | 无 |

不变量与禁止事项:

- 不拥有 Work Iteration truth。
- 不决定 commitment scope。

#### 9.7 `DerivedProcessViewState`

```rust
/// Freshness and rebuild state for a derived process view.
pub struct DerivedProcessViewState {
    /// Stable derived view state identifier.
    pub view_state_id: DerivedProcessViewStateId,
    /// Projection kind governed by this state.
    pub projection_kind: ProcessProjectionKind,
    /// Freshness lifecycle state.
    pub freshness_state: ProjectionFreshnessState,
    /// Last process truth cursor consumed by the projection.
    pub source_cursor_ref: ProcessTruthCursorRef,
    /// Failure reason when the projection failed.
    pub failure_reason: Option<ProjectionFailureReason>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `view_state_id` | `DerivedProcessViewStateId` | 派生状态身份 | 必填 |
| `projection_kind` | `ProcessProjectionKind` | 派生类别 | 必须为正式 enum |
| `freshness_state` | `ProjectionFreshnessState` | 新鲜度状态 | 必须为正式 enum |
| `source_cursor_ref` | `ProcessTruthCursorRef` | truth 来源 cursor | 必须来自 committed truth / trace |
| `failure_reason` | `Option<ProjectionFailureReason>` | 失败原因 | Failed 时必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_fresh(&mut self, cursor_ref: ProcessTruthCursorRef) -> Result<(), DomainError>` | 标记已追上 cursor | committed truth cursor | `Result<(), DomainError>` | -> `Fresh` |
| `pub fn mark_stale(&mut self, reason: ProjectionStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | -> `Stale` |
| `pub fn mark_rebuilding(&mut self) -> Result<(), DomainError>` | 标记重建中 | 无 | `Result<(), DomainError>` | -> `Rebuilding` |
| `pub fn mark_failed(&mut self, reason: ProjectionFailureReason) -> Result<(), DomainError>` | 标记失败 | reason | `Result<(), DomainError>` | -> `Failed` |
| `pub fn disable(&mut self, reason: ProjectionDisabledReason) -> Result<(), DomainError>` | 禁用视图 | reason | `Result<(), DomainError>` | -> `Disabled` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_projection(view_state_id: DerivedProcessViewStateId, projection_kind: ProcessProjectionKind, cursor_ref: ProcessTruthCursorRef) -> Result<Self, DomainError>` | 建立派生状态 | id、kind、cursor | `Result<DerivedProcessViewState, DomainError>` | projection init |

```rust
/// Freshness state of a derived process view.
pub enum ProjectionFreshnessState {
    /// The derived view has consumed all committed truth up to its cursor.
    Fresh,
    /// The derived view is behind committed truth.
    Stale,
    /// The derived view is being rebuilt.
    Rebuilding,
    /// The derived view failed to rebuild or refresh.
    Failed,
    /// The derived view is disabled by configuration or operations policy.
    Disabled,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Fresh` | `The derived view has consumed all committed truth up to its cursor.` | 新鲜 | 工厂 / `Rebuilding` / `Stale` | `Stale` / `Rebuilding` / `Disabled` |
| `Stale` | `The derived view is behind committed truth.` | 过期 | `Fresh` / `Failed` | `Rebuilding` / `Fresh` / `Disabled` |
| `Rebuilding` | `The derived view is being rebuilt.` | 重建中 | `Fresh` / `Stale` / `Failed` | `Fresh` / `Failed` / `Disabled` |
| `Failed` | `The derived view failed to rebuild or refresh.` | 失败 | `Rebuilding` | `Rebuilding` / `Stale` / `Disabled` |
| `Disabled` | `The derived view is disabled by configuration or operations policy.` | 禁用 | 任意状态 | `Rebuilding` |

不变量与禁止事项:

- 不反写真相。
- stale / failed 必须对 query 或 operations 可见。

### 10. projection / read model 对象契约

#### 10.1 `ProcessReadModel`

```rust
/// Read model summarizing process truth for authorized queries.
pub struct ProcessReadModel {
    /// Stable read model identifier.
    pub read_model_id: ProcessReadModelId,
    /// Process instance represented by this read model.
    pub process_instance_ref: ProcessInstanceRef,
    /// Profile used by the process instance.
    pub profile_ref: ProcessProfileRef,
    /// Current activity reference when available.
    pub current_activity_ref: Option<ActivityRef>,
    /// Derived view state controlling freshness and degraded reads.
    pub view_state_ref: DerivedProcessViewStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `read_model_id` | `ProcessReadModelId` | read model 身份 | 必填 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应实例 | 必填 |
| `profile_ref` | `ProcessProfileRef` | profile 摘要 | 必填 |
| `current_activity_ref` | `Option<ActivityRef>` | 当前活动 | 可空 |
| `view_state_ref` | `DerivedProcessViewStateRef` | 派生状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_stale(&mut self, reason: ProjectionStaleReason) -> Result<(), DomainError>` | 标记视图过期 | reason | `Result<(), DomainError>` | 不改写 Process truth |
| `pub fn can_serve(&self, consumer_ref: ProcessConsumerRef) -> bool` | 判断能否服务读取方 | consumer ref | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_process_truth(read_model_id: ProcessReadModelId, snapshot: ProcessTruthSnapshot, view_state_ref: DerivedProcessViewStateRef) -> Result<Self, DomainError>` | 从 committed truth 摘要构建 read model | id、truth snapshot、view state | `Result<ProcessReadModel, DomainError>` | projection rebuild |

不变量与禁止事项:

- 不反写真相。
- 不隐藏 unresolved / stale marker。

#### 10.2 `ProcessTimelineView`

```rust
/// Timeline view built from process trace records.
pub struct ProcessTimelineView {
    /// Stable timeline identifier.
    pub timeline_id: ProcessTimelineId,
    /// Process instance represented by the timeline.
    pub process_instance_ref: ProcessInstanceRef,
    /// Ordered timeline entry references.
    pub entry_refs: ProcessTimelineEntryRefSet,
    /// Derived view state controlling freshness.
    pub view_state_ref: DerivedProcessViewStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `timeline_id` | `ProcessTimelineId` | timeline 身份 | 必填 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应实例 | 必填 |
| `entry_refs` | `ProcessTimelineEntryRefSet` | 条目集合 | 按 committed trace 顺序 |
| `view_state_ref` | `DerivedProcessViewStateRef` | 派生状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn append_entry(&mut self, record: ProcessTraceRecord) -> Result<(), DomainError>` | 追加 timeline 条目 | trace record | `Result<(), DomainError>` | 只追加 trace 引用 / 摘要 |
| `pub fn filter_for(&self, consumer_ref: ProcessConsumerRef, policy: &ReadVisibilityPolicy) -> Result<Self, DomainError>` | 按授权裁剪 | consumer、policy | `Result<ProcessTimelineView, DomainError>` | 不改变原 view |
| `pub fn has_gap(&self) -> bool` | 判断缺口 | 无 | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_trace_records(timeline_id: ProcessTimelineId, process_instance_ref: ProcessInstanceRef, records: ProcessTraceRecordSet, view_state_ref: DerivedProcessViewStateRef) -> Result<Self, DomainError>` | 从 trace 构建 timeline | id、instance、records、state | `Result<ProcessTimelineView, DomainError>` | timeline rebuild |

不变量与禁止事项:

- 不保存 conversation body。
- 不作为审计链唯一来源。

#### 10.3 `ProcessProgressSummary`

```rust
/// Summary projection for process progress and current state.
pub struct ProcessProgressSummary {
    /// Stable summary identifier.
    pub summary_id: ProcessProgressSummaryId,
    /// Process instance represented by this summary.
    pub process_instance_ref: ProcessInstanceRef,
    /// Current process stage when available.
    pub stage_ref: Option<ProcessStageRef>,
    /// Summary-level progress state.
    pub progress_state: ProcessProgressState,
    /// Derived view state controlling freshness.
    pub view_state_ref: DerivedProcessViewStateRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `summary_id` | `ProcessProgressSummaryId` | 摘要身份 | 必填 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应实例 | 必填 |
| `stage_ref` | `Option<ProcessStageRef>` | 当前阶段 | 可空 |
| `progress_state` | `ProcessProgressState` | 摘要进度状态 | view enum,不等同 ProcessInstanceState |
| `view_state_ref` | `DerivedProcessViewStateRef` | 派生状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_waiting(&mut self, waiting_gate_ref: WaitingGateRef) -> Result<(), DomainError>` | 展示等待 | waiting gate ref | `Result<(), DomainError>` | 只改 summary |
| `pub fn mark_recovering(&mut self, recovery_attempt_ref: RecoveryAttemptRef) -> Result<(), DomainError>` | 展示恢复 | recovery ref | `Result<(), DomainError>` | 只改 summary |
| `pub fn mark_completed(&mut self) -> Result<(), DomainError>` | 展示完成 | 无 | `Result<(), DomainError>` | 只改 summary |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_read_model(summary_id: ProcessProgressSummaryId, read_model: ProcessReadModel, stage_state: Option<ProcessStageState>) -> Result<Self, DomainError>` | 从 read model 形成摘要 | id、read model、stage | `Result<ProcessProgressSummary, DomainError>` | summary rebuild |

```rust
/// Summary-level progress state for process consumers.
pub enum ProcessProgressState {
    /// The represented process has not started.
    NotStarted,
    /// The represented process is in progress.
    InProgress,
    /// The represented process is waiting.
    Waiting,
    /// The represented process is recovering.
    Recovering,
    /// The represented process completed.
    Completed,
    /// The represented process is blocked for consumer-facing reasons.
    Blocked,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `NotStarted` | `The represented process has not started.` | 未开始摘要 | projection builder | 不适用 |
| `InProgress` | `The represented process is in progress.` | 进行中摘要 | projection builder | 不适用 |
| `Waiting` | `The represented process is waiting.` | 等待摘要 | projection builder | 不适用 |
| `Recovering` | `The represented process is recovering.` | 恢复摘要 | projection builder | 不适用 |
| `Completed` | `The represented process completed.` | 完成摘要 | projection builder | 不适用 |
| `Blocked` | `The represented process is blocked for consumer-facing reasons.` | 阻塞摘要 | projection builder | 不适用 |

不变量与禁止事项:

- 不成为 workspace dashboard truth。
- 不补写未知外部状态。

#### 10.4 `ActivityStatusView`

```rust
/// Read-only activity status view with feedback resolution state.
pub struct ActivityStatusView {
    /// Stable activity status view identifier.
    pub activity_status_view_id: ActivityStatusViewId,
    /// Activity represented by this view.
    pub activity_ref: ActivityRef,
    /// Current activity state copied from committed truth.
    pub activity_state: ActivityState,
    /// Current assignee when available.
    pub assignee_ref: Option<ActorRef>,
    /// Resolution state of runtime feedback.
    pub feedback_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `activity_status_view_id` | `ActivityStatusViewId` | 视图身份 | 必填 |
| `activity_ref` | `ActivityRef` | 对应活动 | 必填 |
| `activity_state` | `ActivityState` | 活动状态 | 从 committed Activity 复制 |
| `assignee_ref` | `Option<ActorRef>` | 承担者 | 只保存 actor ref |
| `feedback_state` | `ReferenceResolutionState` | 反馈解析状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_feedback_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记反馈过期 | reason | `Result<(), DomainError>` | 不改 Activity truth |
| `pub fn is_actionable(&self) -> bool` | 判断是否可行动 | 无 | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_activity(activity_status_view_id: ActivityStatusViewId, activity: Activity, feedback_state: ReferenceResolutionState) -> Result<Self, DomainError>` | 从 Activity 构建视图 | id、activity、feedback state | `Result<ActivityStatusView, DomainError>` | activity query / projection |

不变量与禁止事项:

- 不保存 runtime body。
- 不推进 Activity。

#### 10.5 `ReconciliationReport`

```rust
/// Report describing reconciliation between process truth, projections, and snapshots.
pub struct ReconciliationReport {
    /// Stable reconciliation report identifier.
    pub report_id: ReconciliationReportId,
    /// Scope covered by the report.
    pub scope_ref: ProcessReconciliationScopeRef,
    /// Result state of the reconciliation run.
    pub result_state: ReconciliationResultState,
    /// References to detected issues.
    pub issue_refs: ReconciliationIssueRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `report_id` | `ReconciliationReportId` | 报告身份 | 必填 |
| `scope_ref` | `ProcessReconciliationScopeRef` | 对账范围 | 必填 |
| `result_state` | `ReconciliationResultState` | 结果状态 | 必须为正式 enum |
| `issue_refs` | `ReconciliationIssueRefSet` | 问题引用 | 不保存外部正文 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn add_issue(&mut self, issue_ref: ReconciliationIssueRef) -> Result<(), DomainError>` | 增加问题 | issue ref | `Result<(), DomainError>` | `Clean` -> `HasIssues` |
| `pub fn mark_failed(&mut self, reason: ReconciliationFailureReason) -> Result<(), DomainError>` | 标记失败 | reason | `Result<(), DomainError>` | -> `Failed` |
| `pub fn is_clean(&self) -> bool` | 判断无问题 | 无 | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_scope(report_id: ReconciliationReportId, scope_ref: ProcessReconciliationScopeRef) -> Result<Self, DomainError>` | 创建报告 | id、scope | `Result<ReconciliationReport, DomainError>` | `RunProcessReconciliation` |

```rust
/// Reconciliation result state.
pub enum ReconciliationResultState {
    /// Reconciliation finished without detected issues.
    Clean,
    /// Reconciliation finished with detected issues.
    HasIssues,
    /// Reconciliation failed before producing a complete result.
    Failed,
    /// Reconciliation produced a partial result.
    Partial,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Clean` | `Reconciliation finished without detected issues.` | 无问题 | 工厂 / job finish | `HasIssues` / `Failed` / `Partial` |
| `HasIssues` | `Reconciliation finished with detected issues.` | 有问题 | `Clean` / job finish | `Failed` / `Partial` |
| `Failed` | `Reconciliation failed before producing a complete result.` | 失败 | 任意非终态 | 无 |
| `Partial` | `Reconciliation produced a partial result.` | 部分完成 | 任意非终态 | `Failed` |

不变量与禁止事项:

- 不修复业务 truth。
- 不保存外部正文。

### 11. reference / snapshot / trace / outbox 对象契约

#### 11.1 `ReferenceResolutionState`

`ReferenceResolutionState` 是 public/shared reference state object,归 `contracts::refs`,domain、application port、protocol DTO、query view 和 job 共同复用。它被 `GovernanceDecisionRef`、`ArtifactEvidenceMarker`、`RuntimeFeedbackRef`、`ConversationContextRef`、`RuntimeFeedbackSummary`、`ActivityStatusView`、resolver / repository port 和 external context refresh job 直接引用,因此不得放在 `domain::reference`,否则 `contracts` 会被迫反向依赖 domain。

`contracts::refs::ReferenceResolutionState` 只承载字段 schema 和轻量校验,不得返回 `DomainError`。需要表达状态迁移、不变量失败或边界拒绝时,由 `domain::reference` / `ReferenceResolutionPolicy` 提供 domain helper / guard,返回 `DomainError`。

```rust
/// Resolution state for an external reference or snapshot.
pub struct ReferenceResolutionState {
    /// Stable resolution state identifier.
    pub reference_state_id: ReferenceResolutionStateId,
    /// External context reference being tracked.
    pub reference_ref: ExternalContextRef,
    /// Current resolution lifecycle state.
    pub resolution_state: ReferenceResolutionLifecycleState,
    /// Snapshot reference when the external context was resolved.
    pub snapshot_ref: Option<ExternalSnapshotRef>,
    /// Reason explaining unresolved, stale, invalid, or unavailable state.
    pub reason_ref: Option<ReferenceResolutionReasonRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `reference_state_id` | `ReferenceResolutionStateId` | 解析状态身份 | 必填 |
| `reference_ref` | `ExternalContextRef` | 外部引用 | 必填,不得为正文 |
| `resolution_state` | `ReferenceResolutionLifecycleState` | 解析状态 | 必须为正式 enum |
| `snapshot_ref` | `Option<ExternalSnapshotRef>` | 快照引用 | Resolved 时可填 |
| `reason_ref` | `Option<ReferenceResolutionReasonRef>` | 解释原因 | 非 Resolved 时应填 |

| domain helper / guard 签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `ReferenceResolutionPolicy::mark_resolved(state: &mut ReferenceResolutionState, snapshot_ref: ExternalSnapshotRef) -> Result<(), DomainError>` | 标记已解析 | state、snapshot ref | `Result<(), DomainError>` | -> `Resolved` |
| `ReferenceResolutionPolicy::mark_unresolved(state: &mut ReferenceResolutionState, reason: ReferenceUnresolvedReason) -> Result<(), DomainError>` | 标记无法解析 | state、reason | `Result<(), DomainError>` | -> `Unresolved` |
| `ReferenceResolutionPolicy::mark_stale(state: &mut ReferenceResolutionState, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | state、reason | `Result<(), DomainError>` | -> `Stale` |
| `ReferenceResolutionPolicy::mark_invalid(state: &mut ReferenceResolutionState, reason: ReferenceInvalidReason) -> Result<(), DomainError>` | 标记非法 | state、reason | `Result<(), DomainError>` | -> `Invalid` |
| `ReferenceResolutionPolicy::mark_unavailable(state: &mut ReferenceResolutionState, reason: ReferenceUnavailableReason) -> Result<(), DomainError>` | 标记来源不可用 | state、reason | `Result<(), DomainError>` | -> `Unavailable` |

| contracts constructor / helper | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReferenceResolutionState { reference_state_id, reference_ref, resolution_state: Unresolved, snapshot_ref: None, reason_ref: Some(reason_ref) }` | 创建 unresolved 状态 | id、ref、reason ref | `ReferenceResolutionState` | consumer / refresh failure |

```rust
/// External reference resolution lifecycle state.
pub enum ReferenceResolutionLifecycleState {
    /// The external reference was resolved to a local snapshot reference.
    Resolved,
    /// The external reference could not be resolved.
    Unresolved,
    /// The local snapshot is older than the external source.
    Stale,
    /// The external reference is invalid for this process boundary.
    Invalid,
    /// The external source is temporarily unavailable.
    Unavailable,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Resolved` | `The external reference was resolved to a local snapshot reference.` | 已解析 | refresh / consumer | `Stale` / `Invalid` / `Unavailable` |
| `Unresolved` | `The external reference could not be resolved.` | 未解析 | 工厂 / refresh | `Resolved` / `Invalid` / `Unavailable` |
| `Stale` | `The local snapshot is older than the external source.` | 过期 | `Resolved` | `Resolved` / `Unavailable` / `Invalid` |
| `Invalid` | `The external reference is invalid for this process boundary.` | 非法 | 任意状态 | 无 |
| `Unavailable` | `The external source is temporarily unavailable.` | 来源不可用 | 任意非 invalid | `Resolved` / `Unresolved` / `Stale` |

不变量与禁止事项:

- 不降级为裸字符串。
- 不保存外部正文。
- 不在 `contracts::refs` 中依赖 `DomainError`;domain 侧失败由 `ReferenceResolutionPolicy` 或引用该 state 的 domain object / service 返回。

#### 11.2 `MethodDefinitionSnapshot`

```rust
/// Method definition source snapshot containing only reference and version summary.
pub struct MethodDefinitionSnapshot {
    /// External method definition reference.
    pub definition_ref: MethodDefinitionRef,
    /// External method definition version reference.
    pub definition_version_ref: MethodDefinitionVersionRef,
    /// Kind of method definition represented by this snapshot.
    pub definition_kind: MethodDefinitionKind,
    /// Resolution state for this snapshot.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `definition_ref` | `MethodDefinitionRef` | method 定义引用 | 必填 |
| `definition_version_ref` | `MethodDefinitionVersionRef` | 定义版本 | 必填 |
| `definition_kind` | `MethodDefinitionKind` | 定义类别 | 必须可区分 process shape source |
| `snapshot_state` | `ReferenceResolutionState` | 解析状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_process_shape_source(&self) -> bool` | 判断可否形成 runtime shape | 无 | `bool` | 纯判断 |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | 委托 snapshot_state |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_method_library(definition_ref: MethodDefinitionRef, version_ref: MethodDefinitionVersionRef, definition_kind: MethodDefinitionKind, snapshot_state: ReferenceResolutionState) -> Result<Self, DomainError>` | 从 method 摘要形成快照 | ref、version、kind、state | `Result<MethodDefinitionSnapshot, DomainError>` | shape sync / consumer |

不变量与禁止事项:

- 不保存 method definition body。
- 不成为 method truth。

#### 11.3 `WorkContextSnapshot`

```rust
/// External work context snapshot for project, work item, iteration, or timebox references.
pub struct WorkContextSnapshot {
    /// External work context reference.
    pub work_context_ref: WorkContextRef,
    /// Optional external project reference.
    pub project_ref: Option<ProjectRef>,
    /// Optional external iteration reference.
    pub iteration_ref: Option<IterationRef>,
    /// Resolution state for this snapshot.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `work_context_ref` | `WorkContextRef` | 外部工作语境引用 | 必填 |
| `project_ref` | `Option<ProjectRef>` | 外部项目 | 只保存 ref |
| `iteration_ref` | `Option<IterationRef>` | 外部 iteration | 只保存 ref |
| `snapshot_state` | `ReferenceResolutionState` | 解析状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_project(&self, project_ref: ProjectRef) -> bool` | 判断是否属于项目 | project ref | `bool` | 纯判断 |
| `pub fn supports_timebox(&self, process_timebox_ref: ProcessTimeboxRef) -> bool` | 判断是否解释 timebox | process timebox ref | `bool` | 纯判断 |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | 不写 Work truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_work_context(work_context_ref: WorkContextRef, project_ref: Option<ProjectRef>, iteration_ref: Option<IterationRef>, snapshot_state: ReferenceResolutionState) -> Result<Self, DomainError>` | 从 work 摘要形成快照 | refs、state | `Result<WorkContextSnapshot, DomainError>` | work context consumer |

不变量与禁止事项:

- 不拥有 Work truth。
- 不决定 commitment scope。

#### 11.4 `ActorCapabilitySnapshot`

```rust
/// Actor capability snapshot used to validate activity assignment and visibility context.
pub struct ActorCapabilitySnapshot {
    /// Actor reference.
    pub actor_ref: ActorRef,
    /// Optional global member reference.
    pub member_ref: Option<GlobalMemberRef>,
    /// Capability references available to the actor.
    pub capability_refs: CapabilityRefSet,
    /// Resolution state for this snapshot.
    pub snapshot_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `actor_ref` | `ActorRef` | actor 引用 | 必填 |
| `member_ref` | `Option<GlobalMemberRef>` | identity 成员引用 | 可空 |
| `capability_refs` | `CapabilityRefSet` | 能力集合 | 只保存 refs |
| `snapshot_state` | `ReferenceResolutionState` | 解析状态 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn supports_activity(&self, activity_kind: ActivityKind) -> bool` | 判断可承担活动 | activity kind | `bool` | 纯判断 |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<(), DomainError>` | 标记过期 | reason | `Result<(), DomainError>` | 不写 identity truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_identity(actor_ref: ActorRef, member_ref: Option<GlobalMemberRef>, capability_refs: CapabilityRefSet, snapshot_state: ReferenceResolutionState) -> Result<Self, DomainError>` | 从 identity 摘要形成快照 | refs、capabilities、state | `Result<ActorCapabilitySnapshot, DomainError>` | actor capability consumer |

不变量与禁止事项:

- 不拥有身份生命周期。
- 不替代授权策略。

#### 11.5 external reference objects

`GovernanceDecisionRef`、`ArtifactEvidenceMarker`、`RuntimeFeedbackRef`、`ConversationContextRef` 和 `TraceHandoffRef` 是 public/shared reference object,归 `contracts::refs`,domain 复用。它们不保存外部正文。`TraceHandoffRecord` 是 domain record,归 `domain::trace`,负责 handoff 状态机和 receipt / failure / cancel marker。

| 类型 | 最小字段 | 关键函数 | 禁止事项 |
|---|---|---|---|
| `GovernanceDecisionRef` | `decision_kind: GovernanceDecisionKind`;`external_ref: ExternalDecisionRef`;`decision_state: ReferenceResolutionState` | `is_resumable_decision()`;`same_decision(&self, other: &Self)`;`from_external(...)` | 不保存 decision body;不生成治理裁决 |
| `ArtifactEvidenceMarker` | `evidence_ref: ArtifactEvidenceRef`;`evidence_kind: ArtifactEvidenceKind`;`evidence_state: ReferenceResolutionState` | `same_evidence(&self, other: &Self)`;`from_artifact(...)` | 不保存 artifact body、package content 或 binary |
| `RuntimeFeedbackRef` | `feedback_kind: RuntimeFeedbackKind`;`external_ref: ExternalRuntimeFeedbackRef`;`feedback_state: ReferenceResolutionState` | `is_completion_feedback()`;`same_feedback(&self, other: &Self)`;`from_runtime(...)` | 不保存 execution log;不成为 runtime truth |
| `ConversationContextRef` | `conversation_ref: ConversationRef`;`context_kind: ConversationContextKind`;`context_state: ReferenceResolutionState` | `is_trace_context()`;`same_context(&self, other: &Self)`;`from_conversation(...)` | 不保存 conversation body;不拥有 visibility truth |
| `TraceHandoffRef` | `value: String` | 无 domain 方法;仅作为 handoff record identity / public ref | 不保存 observability / archive body;不决定 Process truth |
| `TraceHandoffRecord` | `handoff_ref: TraceHandoffRef`;`trace_record_ref: ProcessTraceRecordRef`;`target_ref: TraceHandoffTargetRef`;`handoff_kind: TraceHandoffKind`;`external_ref: Option<ExternalHandoffRef>`;`receipt_ref: Option<HandoffReceiptRef>`;`archive_package_ref: Option<ArchivePackageRef>`;`failure_ref: Option<HandoffFailureRef>`;`cancel_reason: Option<HandoffCancelReason>`;`handoff_state: TraceHandoffState`;`delivered_at: Option<Timestamp>` | `mark_delivered(receipt: TraceHandoffReceipt)`;`mark_archived(receipt: ArchiveHandoffReceipt)`;`mark_failed(failure_ref: HandoffFailureRef)`;`cancel(reason: HandoffCancelReason, actor: ActorRef)`;`prepare(...)` | 不保存 observability / archive body;不决定 Process truth |

```rust
/// Trace handoff lifecycle state.
pub enum TraceHandoffState {
    /// The handoff material reference was prepared.
    Prepared,
    /// The handoff was delivered to the target boundary.
    Delivered,
    /// The handoff failed.
    Failed,
    /// The handoff was cancelled.
    Cancelled,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Prepared` | `The handoff material reference was prepared.` | 已准备 | 工厂 | `Delivered` / `Failed` / `Cancelled` |
| `Delivered` | `The handoff was delivered to the target boundary.` | 已交付 | `Prepared` / `Failed` | 无 |
| `Failed` | `The handoff failed.` | 失败 | `Prepared` | `Delivered` / `Cancelled` |
| `Cancelled` | `The handoff was cancelled.` | 已取消 | `Prepared` / `Failed` | 无 |

`TraceHandoffRecord` 字段规则:

- `handoff_ref`、`trace_record_ref`、`target_ref`、`handoff_kind` 和 `handoff_state` 创建时必填。
- `external_ref` 和 `receipt_ref` 仅在 observability handoff `Delivered` 后填写。
- `archive_package_ref` 仅在 archive handoff `Delivered` 后填写,只保存 archive package ref,不得保存 package body。
- `failure_ref` 仅在 `Failed` 后填写;retryable / permanent 语义由 `HandoffFailureRef` / `HandoffError` 映射。
- `cancel_reason` 仅在 `Cancelled` 后填写。
- `delivered_at` 仅在 `Delivered` 后填写。

#### 11.6 `ProcessTraceRecord`

```rust
/// Trace record for a committed process truth change.
pub struct ProcessTraceRecord {
    /// Stable trace record identifier.
    pub trace_id: ProcessTraceId,
    /// Subject referenced by this trace record.
    pub subject_ref: ProcessTraceSubjectRef,
    /// Core trace context for correlation.
    pub trace_context: TraceContext,
    /// Committed process truth change reference.
    pub change_ref: ProcessTruthChangeRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `trace_id` | `ProcessTraceId` | trace 身份 | 必填 |
| `subject_ref` | `ProcessTraceSubjectRef` | 追溯对象 | 必填 |
| `trace_context` | `TraceContext` | core trace | 必填 |
| `change_ref` | `ProcessTruthChangeRef` | 已成立变化 | 必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn relates_to(&self, subject_ref: ProcessTraceSubjectRef) -> bool` | 判断关联对象 | subject | `bool` | 纯判断 |
| `pub fn prepare_handoff(&self, handoff_ref: TraceHandoffRef, target_ref: TraceHandoffTargetRef) -> Result<TraceHandoffRecord, DomainError>` | 形成交接意图 | handoff ref、target ref | `Result<TraceHandoffRecord, DomainError>` | 不保存外部正文 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_truth_change(trace_id: ProcessTraceId, change: ProcessTruthChange, trace_context: TraceContext) -> Result<Self, DomainError>` | 从已成立变化形成 trace | id、change、context | `Result<ProcessTraceRecord, DomainError>` | command success |

不变量与禁止事项:

- 不包含外部正文。
- 不替代当前 truth 状态。

#### 11.7 `ProcessAuditTrail`

```rust
/// Audit trail containing trace record references for one process subject.
pub struct ProcessAuditTrail {
    /// Stable audit trail identifier.
    pub audit_trail_id: ProcessAuditTrailId,
    /// Subject audited by this trail.
    pub subject_ref: ProcessAuditSubjectRef,
    /// Trace record references in this trail.
    pub record_refs: ProcessTraceRecordRefSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `audit_trail_id` | `ProcessAuditTrailId` | 审计链身份 | 必填 |
| `subject_ref` | `ProcessAuditSubjectRef` | 审计对象 | 必填 |
| `record_refs` | `ProcessTraceRecordRefSet` | trace 集合 | 只保存 ref |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn append(&mut self, record: ProcessTraceRecord) -> Result<(), DomainError>` | 追加记录 | trace record | `Result<(), DomainError>` | 只追加 ref |
| `pub fn has_gap(&self) -> bool` | 判断缺口 | 无 | `bool` | 纯判断 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start_for_subject(audit_trail_id: ProcessAuditTrailId, subject_ref: ProcessAuditSubjectRef) -> Result<Self, DomainError>` | 创建审计链 | id、subject | `Result<ProcessAuditTrail, DomainError>` | first truth change |

不变量与禁止事项:

- 不替代 truth repository。
- 不保存 observability ledger 正文。

#### 11.8 `ProcessOutboxRecord`

```rust
/// Outbox record created from committed process truth for eventual publication.
pub struct ProcessOutboxRecord {
    /// Stable outbox record identifier.
    pub outbox_id: ProcessOutboxId,
    /// Outbound event kind derived from the truth change.
    pub event_kind: ProcessOutboxEventKind,
    /// Committed process truth reference.
    pub truth_ref: ProcessTruthRef,
    /// Trace context copied at the same committed transition.
    pub trace_context: TraceContext,
    /// Visibility marker captured for the outbound envelope.
    pub visibility_marker: Option<ProcessVisibilityMarker>,
    /// Typed outbound payload snapshot captured before commit.
    pub payload_snapshot: ProcessOutboundEventPayload,
    /// Current publication state.
    pub publication_state: OutboxPublicationState,
    /// Optional publication reference after success.
    pub publication_ref: Option<OutboxPublicationRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `outbox_id` | `ProcessOutboxId` | outbox 身份 | 必填 |
| `event_kind` | `ProcessOutboxEventKind` | 事件类别 | 必须从 truth change 映射 |
| `truth_ref` | `ProcessTruthRef` | 已成立 truth | 必填 |
| `trace_context` | `TraceContext` | 发布关联 trace | 从 command / event / job metadata 在 accepted transition 同步复制 |
| `visibility_marker` | `Option<ProcessVisibilityMarker>` | outbound 可见性标记 | P0 默认为 `None`;若 flow 明确产生过滤事件,必须随 outbox 快照保存 |
| `payload_snapshot` | `ProcessOutboundEventPayload` | outbound payload 快照 | 必须在 accepted transaction 内从 Step 8 mapping table 构造;不得 publish 时重读 current truth 重算 |
| `publication_state` | `OutboxPublicationState` | 发布状态 | 必须为正式 enum |
| `publication_ref` | `Option<OutboxPublicationRef>` | 发布证据 | Published 时必填 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_published(&mut self, publication_ref: OutboxPublicationRef) -> Result<(), DomainError>` | 标记已发布 | publication ref | `Result<(), DomainError>` | `Pending` / `RetryPending` -> `Published` |
| `pub fn mark_retry(&mut self, reason: OutboxRetryReason) -> Result<(), DomainError>` | 标记重试 | reason | `Result<(), DomainError>` | `Pending` / `Failed` -> `RetryPending` |
| `pub fn mark_failed(&mut self, reason: OutboxFailureReason) -> Result<(), DomainError>` | 标记失败 | reason | `Result<(), DomainError>` | 非 published -> `Failed` |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_truth_change(outbox_id: ProcessOutboxId, change: ProcessTruthChange, trace_context: TraceContext, visibility_marker: Option<ProcessVisibilityMarker>, payload_snapshot: ProcessOutboundEventPayload) -> Result<Self, DomainError>` | 从已成立变化形成 outbox | id、truth change、trace、visibility、payload 快照 | `Result<ProcessOutboxRecord, DomainError>` | command / consumer / job accepted transaction |

```rust
/// Publication state of a process outbox record.
pub enum OutboxPublicationState {
    /// The record is waiting to be published.
    Pending,
    /// The record was published successfully.
    Published,
    /// The record failed publication.
    Failed,
    /// The record is waiting for a retry.
    RetryPending,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The record is waiting to be published.` | 待发布 | 工厂 | `Published` / `Failed` / `RetryPending` |
| `Published` | `The record was published successfully.` | 已发布 | `Pending` / `RetryPending` | 无 |
| `Failed` | `The record failed publication.` | 发布失败 | `Pending` / `RetryPending` | `RetryPending` |
| `RetryPending` | `The record is waiting for a retry.` | 待重试 | `Pending` / `Failed` | `Published` / `Failed` |

不变量与禁止事项:

- outbox 不决定 truth 是否成立。
- 下游确认不是主真相前置。
- `payload_snapshot` 是 committed transition snapshot,不是 publish job 根据当前 repository 状态重算的 current-state view。
- `ProcessOutboxRecord::from_truth_change(...)` 必须校验 `ProcessTruthChange`、`ProcessOutboxEventKind` 和 `ProcessOutboundEventPayload` variant 一致。
- `ProcessOutboxPublisherPort` 只能接收由 `ProcessOutboxRecord` 字段复制出的 `ProcessOutboundEventEnvelope`,不得访问 domain repository 拼 payload。

```rust
/// Outbox event kind derived from committed process truth.
pub enum ProcessOutboxEventKind {
    /// Runtime process shape changed.
    RuntimeProcessShapeChanged,
    /// Process profile changed.
    ProcessProfileChanged,
    /// Process instance changed.
    ProcessInstanceChanged,
    /// Activity progressed.
    ActivityProgressed,
    /// Waiting gate changed.
    WaitingGateChanged,
    /// Process checkpoint was created.
    ProcessCheckpointCreated,
    /// Recovery attempt changed.
    RecoveryAttemptChanged,
    /// Process timing changed.
    ProcessTimingChanged,
    /// Process trace became available.
    ProcessTraceAvailable,
    /// Derived process view changed.
    DerivedProcessViewChanged,
}
```

#### 11.9 history records

以下 history record 是 domain record,用于审计和 trace,不替代当前 truth。

| 类型 | 最小字段 | 工厂函数 | 禁止事项 |
|---|---|---|---|
| `ProfileChangeRecord` | `change_id: ProfileChangeId`;`profile_ref: ProcessProfileRef`;`change_reason: ProfileChangeReason`;`actor_ref: ActorRef` | `from_profile_change(profile: ProcessProfile, reason: ProfileChangeReason, actor: ActorRef) -> Result<Self, DomainError>` | 不替代 `ProcessProfile`;不保存 method body |
| `ActivityTransitionOutcome` | `progression_id: ActivityProgressionId`;`activity_ref: ActivityRef`;`from_state: ActivityState`;`to_state: ActivityState`;`feedback_ref: Option<RuntimeFeedbackRef>` | 由 `Activity.assign/ready/start/attach_feedback/complete/skip/fail(...)` 返回 | 只表达 activity truth delta;不追加保存;不包含 token / gateway / selected route |
| `ActivityProgressionRecord` | `progression_id: ActivityProgressionId`;`activity_ref: ActivityRef`;`from_state: ActivityState`;`to_state: ActivityState`;`feedback_ref: Option<RuntimeFeedbackRef>`;`token_refs: Vec<ProcessTokenRef>`;`gateway_ref: Option<GatewayRef>`;`selected_route_ref: Option<GatewayRouteRef>` | `from_activity_transition(outcome: ActivityTransitionOutcome, token_refs: Vec<ProcessTokenRef>, gateway: Option<Gateway>) -> Result<Self, DomainError>` | 不保存 runtime body;不替代 `Activity`;`progression_id` 来自 application 生成并已包含在 outcome 中,single-token flow 放 1 个 token ref,no-token flow 为空;`selected_route_ref` 只能复制同事务 committed `Gateway.selected_route_ref`;application 必须在 token / gateway flow-control 完成后构造 record |
| `WaitingGateChangeRecord` | `change_id: WaitingGateChangeId`;`waiting_gate_ref: WaitingGateRef`;`from_state: WaitingGateState`;`to_state: WaitingGateState`;`decision_ref: Option<GovernanceDecisionRef>` | `from_gate_transition(gate: WaitingGate, from_state: WaitingGateState, to_state: WaitingGateState) -> Result<Self, DomainError>` | 不生成 decision;不替代 `WaitingGate` |
| `RecoveryHistoryRecord` | `history_id: RecoveryHistoryId`;`process_instance_ref: ProcessInstanceRef`;`checkpoint_ref: Option<ProcessCheckpointRef>`;`attempt_ref: Option<RecoveryAttemptRef>`;`history_kind: RecoveryHistoryKind` | `from_checkpoint(history_id: RecoveryHistoryId, checkpoint: ProcessCheckpoint, history_kind: RecoveryHistoryKind) -> Result<Self, DomainError>`;`from_recovery_attempt(history_id: RecoveryHistoryId, attempt: RecoveryAttempt) -> Result<Self, DomainError>`;`from_instance_recovery_transition(history_id: RecoveryHistoryId, instance: ProcessInstance, checkpoint_ref: Option<ProcessCheckpointRef>, attempt_ref: Option<RecoveryAttemptRef>, history_kind: RecoveryHistoryKind) -> Result<Self, DomainError>` | 不保存 archive package;不替代 `RecoveryAttempt`;`history_id` 必须来自 application `IdGeneratorPort` |

```rust
/// Recovery history record kind.
pub enum RecoveryHistoryKind {
    /// A process checkpoint was captured.
    CheckpointCaptured,
    /// A process checkpoint was superseded by a newer checkpoint.
    CheckpointSuperseded,
    /// A process checkpoint was invalidated.
    CheckpointInvalidated,
    /// A process checkpoint expired.
    CheckpointExpired,
    /// A recovery attempt was started.
    AttemptStarted,
    /// A recovery attempt was applied.
    AttemptApplied,
    /// A recovery attempt failed.
    AttemptFailed,
    /// A recovery attempt was abandoned.
    AttemptAbandoned,
    /// A process instance entered recovery.
    InstanceRecovering,
    /// A process instance completed recovery and returned to running.
    InstanceRecoveryCompleted,
}
```

| 变体 | 来源 | `checkpoint_ref` | `attempt_ref` |
|---|---|---|---|
| `CheckpointCaptured` | `CreateProcessCheckpointFlow` after `ProcessCheckpoint::capture(...)` | 必填 | 空 |
| `CheckpointSuperseded` | checkpoint supersede policy after `ProcessCheckpoint.mark_superseded(...)` | 必填 | 空 |
| `CheckpointInvalidated` | checkpoint invalidation command / maintenance marker | 必填 | 空 |
| `CheckpointExpired` | checkpoint expiry maintenance marker | 必填 | 空 |
| `AttemptStarted` | `StartRecoveryAttemptFlow` after `RecoveryAttempt::start(...)` | 必填 | 必填 |
| `AttemptApplied` | `RecoveryAttempt.mark_applied(...)` | 必填 | 必填 |
| `AttemptFailed` | `RecoveryAttempt.mark_failed(...)` | 必填 | 必填 |
| `AttemptAbandoned` | `RecoveryAttempt.abandon(...)` | 必填 | 必填 |
| `InstanceRecovering` | `ProcessInstance.mark_recovering(...)` | 必填 | 必填 |
| `InstanceRecoveryCompleted` | `ProcessInstance.complete_recovery(...)` | 可空 | 必填 |

#### 11.10 `ProcessTruthChange` and public truth refs

`ProcessTruthChange` 是 domain-only committed source,用于 outbox、trace、audit、projection rebuild。`ProcessTruthRef`、`ProcessTruthRefKind` 和 `ProcessOutboxEventKind` 是 public/shared contracts 类型,因为 outbound event envelope、job scope 和 projection cursor 会直接引用它们。每个 `ProcessTruthChange` variant 必须能映射到 `ProcessTruthRefKind`、`ProcessOutboxEventKind` 和 Step 8 payload variant。

```rust
/// Committed process truth change used as source for trace, audit, outbox, and projections.
pub enum ProcessTruthChange {
    /// A runtime process shape changed.
    RuntimeShapeChanged(RuntimeProcessShapeRef),
    /// A process profile changed.
    ProfileChanged(ProcessProfileRef),
    /// A process instance changed.
    InstanceChanged(ProcessInstanceRef),
    /// A process activity progressed.
    ActivityProgressed(ActivityRef),
    /// A waiting gate changed.
    WaitingGateChanged(WaitingGateRef),
    /// A checkpoint was created or changed.
    CheckpointChanged(ProcessCheckpointRef),
    /// A recovery attempt changed.
    RecoveryAttemptChanged(RecoveryAttemptRef),
    /// Process rhythm or timebox binding changed.
    TimingChanged(ProcessTimingRef),
    /// Process trace became available for consumers or handoff.
    TraceAvailable(ProcessTraceRecordRef),
    /// A derived view state changed.
    DerivedViewChanged(DerivedProcessViewStateRef),
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `RuntimeShapeChanged(RuntimeProcessShapeRef)` | `A runtime process shape changed.` | shape 变化 | shape command / consumer | trace / outbox / projection |
| `ProfileChanged(ProcessProfileRef)` | `A process profile changed.` | profile 变化 | profile command | trace / outbox / projection |
| `InstanceChanged(ProcessInstanceRef)` | `A process instance changed.` | instance 变化 | instance command | trace / outbox / projection |
| `ActivityProgressed(ActivityRef)` | `A process activity progressed.` | activity 变化 | activity command | trace / outbox / projection |
| `WaitingGateChanged(WaitingGateRef)` | `A waiting gate changed.` | waiting gate 变化 | gate command / consumer marker | trace / outbox / projection |
| `CheckpointChanged(ProcessCheckpointRef)` | `A checkpoint was created or changed.` | checkpoint 变化 | checkpoint command | trace / outbox / projection |
| `RecoveryAttemptChanged(RecoveryAttemptRef)` | `A recovery attempt changed.` | recovery 变化 | recovery command / job | trace / outbox / projection |
| `TimingChanged(ProcessTimingRef)` | `Process rhythm or timebox binding changed.` | timing 变化 | rhythm command / consumer marker | trace / outbox / projection |
| `TraceAvailable(ProcessTraceRecordRef)` | `Process trace became available for consumers or handoff.` | trace 可用 | trace / handoff job marker | outbox / query visibility |
| `DerivedViewChanged(DerivedProcessViewStateRef)` | `A derived view state changed.` | 派生状态变化 | projection job | trace / outbox / query visibility |

```rust
/// Reference to committed process truth used by the outbox and projection rebuild flows.
pub struct ProcessTruthRef {
    /// Kind of committed truth.
    pub truth_kind: ProcessTruthRefKind,
    /// Stable reference value for the committed truth.
    pub truth_ref: String,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `truth_kind` | `ProcessTruthRefKind` | truth 类型 | 必须覆盖 `ProcessTruthChange` variants |
| `truth_ref` | `String` | 稳定引用值 | 非空;不得保存正文 |

```rust
/// Public kind for a committed process truth reference.
pub enum ProcessTruthRefKind {
    /// Runtime process shape truth.
    RuntimeShape,
    /// Process profile truth.
    ProcessProfile,
    /// Process instance truth.
    ProcessInstance,
    /// Process activity truth.
    Activity,
    /// Waiting gate truth.
    WaitingGate,
    /// Process checkpoint truth.
    Checkpoint,
    /// Recovery attempt truth.
    RecoveryAttempt,
    /// Process timing truth.
    Timing,
    /// Process trace record truth.
    TraceRecord,
    /// Derived process view state truth.
    DerivedView,
}
```

| `ProcessTruthChange` variant | `ProcessTruthRefKind` |
|---|---|
| `RuntimeShapeChanged(RuntimeProcessShapeRef)` | `RuntimeShape` |
| `ProfileChanged(ProcessProfileRef)` | `ProcessProfile` |
| `InstanceChanged(ProcessInstanceRef)` | `ProcessInstance` |
| `ActivityProgressed(ActivityRef)` | `Activity` |
| `WaitingGateChanged(WaitingGateRef)` | `WaitingGate` |
| `CheckpointChanged(ProcessCheckpointRef)` | `Checkpoint` |
| `RecoveryAttemptChanged(RecoveryAttemptRef)` | `RecoveryAttempt` |
| `TimingChanged(ProcessTimingRef)` | `Timing` |
| `TraceAvailable(ProcessTraceRecordRef)` | `TraceRecord` |
| `DerivedViewChanged(DerivedProcessViewStateRef)` | `DerivedView` |

不变量与禁止事项:

- `ProcessOutboxRecord::from_truth_change(...)` 必须使用该映射,不得临时发明 event kind。
- projection rebuild source 必须是 committed truth / trace,不得从 projection 自己重建。

### 12. policy / guard 对象契约

Policy 只表达判断边界,不保存业务 truth。所有 `assert_*` 函数失败时返回 `DomainError`,不得返回裸字符串。

#### 12.1 policy 总表

| Policy | 字段 | 关键函数 | 禁止事项 |
|---|---|---|---|
| `ProcessTruthPolicy` | `policy_scope: ProcessPolicyScope`;`truth_snapshot: ProcessTruthSnapshot` | `assert_truth_change_allowed(change: ProcessTruthChange, actor: ActorRef) -> Result<(), DomainError>`;`assert_no_external_body(source: ExternalContextSummary) -> Result<(), DomainError>` | 不替代具体对象状态迁移;配置不能改变 truth 归属 |
| `ShapeDefinitionPolicy` | `definition_ref: MethodDefinitionRef`;`snapshot_state: ReferenceResolutionState` | `assert_can_index(snapshot: MethodDefinitionSnapshot) -> Result<(), DomainError>`;`assert_definition_version_allowed(version_ref: MethodDefinitionVersionRef) -> Result<(), DomainError>`;`assert_no_definition_body(snapshot: MethodDefinitionSnapshot) -> Result<(), DomainError>` | 不拥有 method-library truth;不硬锁 BPMN engine |
| `ProfileTailoringPolicy` | `profile_ref: ProcessProfileRef`;`shape_ref: RuntimeProcessShapeRef`;`change_context: ProfileChangeContext` | `assert_can_adopt(shape: RuntimeProcessShape, project_ref: ProjectRef) -> Result<(), DomainError>`;`assert_can_switch(profile: ProcessProfile, next_shape: RuntimeProcessShape, reason: ProfileChangeReason) -> Result<(), DomainError>`;`assert_high_risk_change_has_evidence(context: ProfileChangeContext) -> Result<(), DomainError>` | 不生成治理决策;不改变 Project truth |
| `InstanceProgressionPolicy` | `instance_ref: ProcessInstanceRef`;`profile_snapshot: ProcessProfileSnapshot`;`current_state: ProcessInstanceState` | `assert_can_start(profile: ProcessProfile, project_ref: ProjectRef) -> Result<(), DomainError>`;`assert_can_advance(instance: ProcessInstance, next_activity_ref: ActivityRef) -> Result<(), DomainError>`;`assert_can_pause(instance: ProcessInstance, pause_context: PauseContext) -> Result<(), DomainError>`;`assert_can_resume(instance: ProcessInstance, gate: WaitingGate) -> Result<(), DomainError>` | 不跳过 Activity / Gate / Recovery 判断;下游消费成功不是完成前置 |
| `ActivityFeedbackPolicy` | `activity_ref: ActivityRef`;`runtime_feedback_ref: RuntimeFeedbackRef`;`feedback_summary: RuntimeFeedbackSummary` | `assert_feedback_matches_activity(activity: Activity, feedback_ref: RuntimeFeedbackRef) -> Result<(), DomainError>`;`assert_feedback_can_complete(activity: Activity, summary: RuntimeFeedbackSummary) -> Result<(), DomainError>`;`assert_no_runtime_body(summary: RuntimeFeedbackSummary) -> Result<(), DomainError>` | 不保存 runtime log;不直接执行 runtime step |
| `GatewayRoutingPolicy` | `gateway_ref: GatewayRef`;`available_routes: GatewayRouteSet`;`token_snapshot: TokenSnapshot` | `assert_route_allowed(gateway: Gateway, route_ref: GatewayRouteRef, reason: GatewayDecisionReason) -> Result<(), DomainError>`;`assert_can_join(gateway: Gateway, tokens: TokenSet) -> Result<(), DomainError>`;`assert_no_orphan_token(token: Token) -> Result<(), DomainError>` | 不实现完整 BPMN 表达力;不自造外部决策依据 |
| `WaitingGatePolicy` | `waiting_gate_ref: WaitingGateRef`;`pause_context: PauseContext`;`decision_state: ReferenceResolutionState` | `assert_can_open(activity: Activity, pause_context: PauseContext) -> Result<(), DomainError>`;`assert_decision_matches(gate: WaitingGate, decision_ref: GovernanceDecisionRef) -> Result<(), DomainError>`;`assert_can_resume(gate: WaitingGate) -> Result<(), DomainError>`;`assert_waiting_not_expired(gate: WaitingGate) -> Result<(), DomainError>` | 不生成 decision truth;不允许后台静默恢复 |
| `RecoveryContinuityPolicy` | `process_instance_ref: ProcessInstanceRef`;`checkpoint_ref: ProcessCheckpointRef`;`recovery_context: RecoveryContext` | `assert_checkpoint_matches_instance(checkpoint: ProcessCheckpoint, instance: ProcessInstance) -> Result<(), DomainError>`;`assert_can_apply(checkpoint: ProcessCheckpoint, context: RecoveryContext) -> Result<(), DomainError>`;`assert_no_truth_fork(attempt: RecoveryAttempt) -> Result<(), DomainError>` | 不创建新实例替代恢复;不保存 archive / runtime 正文 |
| `ProcessRhythmPolicy` | `stage_ref: ProcessStageRef`;`timebox_binding_ref: Option<ProcessTimeboxBindingRef>`;`rhythm_context: ProcessRhythmContext` | `assert_stage_transition_allowed(stage: ProcessStageState, target: StageTarget, reason: StageChangeReason) -> Result<(), DomainError>`;`assert_timebox_binding_allowed(binding: ProcessTimeboxBinding, snapshot: WorkContextSnapshot) -> Result<(), DomainError>`;`assert_not_iteration_truth(binding: ProcessTimeboxBinding) -> Result<(), DomainError>` | 不决定 Iteration commitment;不保存会议正文 |
| `ReadVisibilityPolicy` | `consumer_ref: ProcessConsumerRef`;`visibility_context: ProcessVisibilityContext` | `assert_can_read(subject_ref: ProcessReadSubjectRef, consumer_ref: ProcessConsumerRef) -> Result<(), DomainError>`;`filter_timeline(timeline: ProcessTimelineView, consumer_ref: ProcessConsumerRef) -> Result<ProcessTimelineView, DomainError>`;`assert_trace_handoff_allowed(handoff_ref: TraceHandoffRef, consumer_ref: ProcessConsumerRef) -> Result<(), DomainError>` | 不写业务 truth;不拥有 conversation visibility truth |
| `DerivedProcessViewPolicy` | `view_state: DerivedProcessViewState`;`source_cursor_ref: ProcessTruthCursorRef` | `assert_view_readable(view_state: DerivedProcessViewState) -> Result<(), DomainError>`;`should_rebuild(view_state: DerivedProcessViewState) -> bool`;`assert_rebuild_does_not_write_truth() -> Result<(), DomainError>` | 不生成业务事实;不隐藏 stale / failed |

#### 12.2 policy Rust 契约示例

```rust
/// Guards process truth changes against boundary violations.
pub struct ProcessTruthPolicy {
    /// Scope where the policy is evaluated.
    pub policy_scope: ProcessPolicyScope,
    /// Snapshot of committed process truth used by the guard.
    pub truth_snapshot: ProcessTruthSnapshot,
}

impl ProcessTruthPolicy {
    /// Builds a policy from a committed process truth snapshot.
    pub fn from_snapshot(truth_snapshot: ProcessTruthSnapshot) -> Self;

    /// Fails when the requested truth change violates process ownership or lifecycle boundaries.
    pub fn assert_truth_change_allowed(
        &self,
        change: ProcessTruthChange,
        actor: ActorRef,
    ) -> Result<(), DomainError>;

    /// Fails when an external summary contains body data that L1-process must not store.
    pub fn assert_no_external_body(
        &self,
        source: ExternalContextSummary,
    ) -> Result<(), DomainError>;
}
```

### 13. domain error and enum ownership

`DomainError` 归 `domain::errors`,但其中如果有需要进入 public protocol 的错误码,Step 12 必须定义 `contracts::errors` 映射。Step 6 不完整展开错误模型,只固定对象函数可返回的 domain error 类别。

```rust
/// Domain-level error returned by process objects and policies.
pub enum DomainError {
    /// A state transition is not allowed by the state matrix.
    InvalidStateTransition,
    /// A command or object tried to cross a process ownership boundary.
    BoundaryViolation,
    /// External source truth was missing, invalid, or not allowed.
    SourceTruthViolation,
    /// A required reference was unresolved, stale, invalid, or unavailable.
    ReferenceResolutionFailed,
    /// The requested operation would fork process recovery truth.
    RecoveryForkViolation,
    /// The requested operation would store an external body.
    ExternalBodyRejected,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `InvalidStateTransition` | `A state transition is not allowed by the state matrix.` | 非法状态迁移 | domain object / policy | Step 12 error mapping |
| `BoundaryViolation` | `A command or object tried to cross a process ownership boundary.` | 边界越界 | policy / factory | Step 12 error mapping |
| `SourceTruthViolation` | `External source truth was missing, invalid, or not allowed.` | 来源真相问题 | resolver input / policy | Step 12 error mapping |
| `ReferenceResolutionFailed` | `A required reference was unresolved, stale, invalid, or unavailable.` | 引用解析失败 | reference object / policy | Step 12 error mapping |
| `RecoveryForkViolation` | `The requested operation would fork process recovery truth.` | 恢复分叉风险 | recovery policy | Step 12 error mapping |
| `ExternalBodyRejected` | `The requested operation would store an external body.` | 外部正文拒绝 | snapshot / policy | Step 12 error mapping |

### 14. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_06_object_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“对象归属索引”“contracts shared 类型口径”“truth / execution 对象契约”“gate / recovery / timing 对象契约”“projection / read model 对象契约”“reference / snapshot / trace / outbox 对象契约”和“policy / guard 对象契约”小节。

`03-详细设计.md` §5 的对象实现契约必须按模块展开,但对象契约来源以本 Step 为准。所有 public protocol 会用到的 id / ref / reason / state-visible enum 归 `contracts::refs` 或 core contracts;domain-only 类型不得直接暴露给 DTO / Event / Job / View。所有 snapshot / reference 只保存 ref、version、digest、summary 或 marker,不得保存外部正文。所有 projection / report 只从 committed truth / trace 派生,不得反写 Process truth。所有 outbox record 必须从 `ProcessTruthChange` 映射,不得临时发明 event kind。

### 15. 待确认事项

- 无阻塞 Step 7 的待确认事项。
- Step 7 必须把 repository / resolver / publisher / handoff trait 的输入输出类型回指到本 Step 的对象或 contracts shared 类型。
- Step 8 必须检查所有 public DTO 中引用的 enum / ref / reason 是否已在本 Step 或 core contracts 有 schema。
- Step 10 必须把本 Step 的状态 enum 扩展为完整状态矩阵,不得增删状态名。

### 16. 进入下一步条件

- 已按模块固定对象归属。
- 已给出 truth、state、projection、reference、trace、audit、outbox、policy 和 domain error 的最小实现契约。
- 已明确 public shared type 归属。
- 已明确状态 enum 归属和变体表。
- 已明确外部正文排除、projection 不反写、outbox truth change mapping 和 recovery 不分叉不变量。
