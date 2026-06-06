# Step 6 附录 B1. Policy / Guard 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Policy 只表达判断边界,不保存业务 truth。

---

## B1. `ProcessTruthPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process truth core` |
| 对象类型 | policy / guard |
| 结构责任 | 判断核心 Process truth 变化是否允许成立 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `ProcessPolicyScope` | 限定判断范围 |
| `truth_snapshot` | `ProcessTruthSnapshot` | 提供当前 Process truth 摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_truth_change_allowed(ProcessTruthChange change, ActorRef actor)` | 校验核心变化是否允许 |
| `assert_no_external_body(ExternalContextSummary source)` | 校验未吸收外部正文 |

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot(ProcessTruthSnapshot truth_snapshot)` | 从当前 truth 摘要形成策略上下文 |

| 禁止事项 | 说明 |
|---|---|
| 不替代具体对象状态迁移 | 具体状态变化仍由对象自身表达 |
| 不允许配置改变 truth 归属 | 配置只能影响参数,不能改变边界 |

---

## B2. `ShapeDefinitionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Runtime shape management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 method definition 来源是否可形成 runtime shape |

| 字段 | 类型 | 作用 |
|---|---|---|
| `definition_ref` | `MethodDefinitionRef` | 被判断定义来源 |
| `snapshot_state` | `ReferenceResolutionState` | 定义来源解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_index(MethodDefinitionSnapshot snapshot)` | 校验定义快照可索引 |
| `assert_definition_version_allowed(MethodDefinitionVersionRef version_ref)` | 校验定义版本可用于当前 shape |
| `assert_no_definition_body(MethodDefinitionSnapshot snapshot)` | 校验快照未携带 method 正文 |

| 工厂函数 | 作用 |
|---|---|
| `for_definition(MethodDefinitionSnapshot snapshot)` | 从定义快照形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 method-library truth | 只判断引用和摘要 |
| 不硬锁 BPMN engine | 当前只判断基础可执行形态 |

---

## B3. `ProfileTailoringPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Profile adoption management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 profile 采用、裁剪、切换和退役是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `profile_ref` | `ProcessProfileRef` | 被判断 profile |
| `shape_ref` | `RuntimeProcessShapeRef` | 关联运行时形态 |
| `change_context` | `ProfileChangeContext` | 变化上下文摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_adopt(RuntimeProcessShape shape, ProjectRef project_ref)` | 校验项目是否可采用该形态 |
| `assert_can_switch(ProcessProfile profile, RuntimeProcessShape next_shape, ProfileChangeReason reason)` | 校验 profile 切换 |
| `assert_high_risk_change_has_evidence(ProfileChangeContext context)` | 校验高风险裁剪有正式依据 |

| 工厂函数 | 作用 |
|---|---|
| `for_profile(ProcessProfile profile)` | 从 profile 建立裁剪策略 |

| 禁止事项 | 说明 |
|---|---|
| 不生成治理决策 | 高风险依据来自外部正式来源 |
| 不改变 Project truth | 项目状态归属 Work / Workspace 边界 |

---

## B4. `InstanceProgressionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 ProcessInstance 生命周期和推进是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `instance_ref` | `ProcessInstanceRef` | 被判断实例 |
| `profile_snapshot` | `ProcessProfileSnapshot` | 当前 profile 摘要 |
| `current_state` | `ProcessInstanceState` | 当前实例状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_start(ProcessProfile profile, ProjectRef project_ref)` | 校验实例可启动 |
| `assert_can_advance(ProcessInstance instance, ActivityRef next_activity_ref)` | 校验实例可推进 |
| `assert_can_pause(ProcessInstance instance, PauseContext pause_context)` | 校验实例可暂停 |
| `assert_can_resume(ProcessInstance instance, WaitingGate gate)` | 校验实例可从等待恢复 |
| `assert_can_complete(ProcessInstance instance)` | 校验实例可完成 |

| 工厂函数 | 作用 |
|---|---|
| `for_instance(ProcessInstance instance, ProcessProfileSnapshot profile_snapshot)` | 从实例和 profile 摘要形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不跳过 Activity / Gate / Recovery 判断 | 推进必须经对应对象边界 |
| 不把下游消费成功作为完成前置 | 下游最终一致不反向决定 truth |

---

## B5. `ActivityFeedbackPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断外部 runtime feedback 是否可绑定到 Activity |

| 字段 | 类型 | 作用 |
|---|---|---|
| `activity_ref` | `ActivityRef` | 被判断 Activity |
| `runtime_feedback_ref` | `RuntimeFeedbackRef` | 外部反馈引用 |
| `feedback_summary` | `RuntimeFeedbackSummary` | 反馈摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_feedback_matches_activity(Activity activity, RuntimeFeedbackRef feedback_ref)` | 校验反馈属于该活动 |
| `assert_feedback_can_complete(Activity activity, RuntimeFeedbackSummary summary)` | 校验反馈可完成活动 |
| `assert_no_runtime_body(RuntimeFeedbackSummary summary)` | 校验反馈摘要不包含执行正文 |

| 工厂函数 | 作用 |
|---|---|
| `for_activity(Activity activity)` | 从 Activity 建立反馈策略 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 runtime log | 只保存反馈引用和摘要 |
| 不直接执行 runtime step | Process 只承接结果 |

---

## B6. `GatewayRoutingPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 gateway 路线选择、合流和 token 变化是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gateway_ref` | `GatewayRef` | 被判断 gateway |
| `available_routes` | `GatewayRouteSet` | 可选路线集合 |
| `token_snapshot` | `TokenSnapshot` | 当前 token 摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_route_allowed(Gateway gateway, GatewayRouteRef route_ref, GatewayDecisionReason reason)` | 校验路线选择 |
| `assert_can_join(Gateway gateway, TokenSet tokens)` | 校验 token 合流 |
| `assert_no_orphan_token(Token token)` | 校验不会产生孤儿 token |

| 工厂函数 | 作用 |
|---|---|
| `for_gateway(Gateway gateway, TokenSnapshot token_snapshot)` | 从 gateway 和 token 摘要形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不实现完整 BPMN 表达力 | 当前只表达基础流控判断 |
| 不自造外部决策依据 | 路由依据必须可解释 |

---

## B7. `WaitingGatePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate coordination` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 waiting gate 建立、外部依据解析和恢复是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `waiting_gate_ref` | `WaitingGateRef` | 被判断等待点 |
| `pause_context` | `PauseContext` | 暂停语境 |
| `decision_state` | `ReferenceResolutionState` | 外部依据解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_open(Activity activity, PauseContext pause_context)` | 校验可建立等待点 |
| `assert_decision_matches(WaitingGate gate, GovernanceDecisionRef decision_ref)` | 校验外部决策匹配等待要求 |
| `assert_can_resume(WaitingGate gate)` | 校验可恢复 |
| `assert_waiting_not_expired(WaitingGate gate)` | 校验等待未过期 |

| 工厂函数 | 作用 |
|---|---|
| `for_gate(WaitingGate gate, PauseContext pause_context)` | 从等待点和暂停语境形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不生成 decision truth | 只校验外部正式依据 |
| 不允许后台静默恢复 | 恢复必须可解释 |

---

## B8. `RecoveryContinuityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Checkpoint and recovery` |
| 对象类型 | policy / guard |
| 结构责任 | 判断恢复是否保持同一 Process truth 连续性 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `process_instance_ref` | `ProcessInstanceRef` | 被恢复实例 |
| `checkpoint_ref` | `ProcessCheckpointRef` | 恢复使用的 checkpoint |
| `recovery_context` | `RecoveryContext` | 恢复上下文摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_checkpoint_matches_instance(ProcessCheckpoint checkpoint, ProcessInstance instance)` | 校验 checkpoint 属于同一实例 |
| `assert_can_apply(ProcessCheckpoint checkpoint, RecoveryContext context)` | 校验 checkpoint 可应用 |
| `assert_no_truth_fork(RecoveryAttempt attempt)` | 校验不会创建第二份 Process truth |

| 工厂函数 | 作用 |
|---|---|
| `for_recovery(ProcessInstance instance, ProcessCheckpoint checkpoint)` | 从实例和 checkpoint 形成恢复策略 |

| 禁止事项 | 说明 |
|---|---|
| 不创建新实例替代恢复 | recovery 必须服务同一实例 |
| 不保存 archive / runtime 正文 | 只引用恢复证据 |

---

## B9. `ProcessRhythmPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process timing and rhythm` |
| 对象类型 | policy / guard |
| 结构责任 | 判断过程阶段、节奏和 timebox 绑定是否允许变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `stage_ref` | `ProcessStageRef` | 被判断阶段 |
| `timebox_binding_ref` | `Option<ProcessTimeboxBindingRef>` | 可选 timebox 绑定 |
| `rhythm_context` | `ProcessRhythmContext` | 节奏上下文摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_stage_transition_allowed(ProcessStageState stage, StageTarget target, StageChangeReason reason)` | 校验阶段状态变化 |
| `assert_timebox_binding_allowed(ProcessTimeboxBinding binding, WorkContextSnapshot snapshot)` | 校验 timebox 绑定 |
| `assert_not_iteration_truth(ProcessTimeboxBinding binding)` | 校验未接管 Work Iteration truth |

| 工厂函数 | 作用 |
|---|---|
| `for_stage(ProcessStageState stage, ProcessRhythmContext context)` | 从阶段和节奏上下文形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不决定 Iteration commitment | Work 承诺范围归 L1-work |
| 不保存会议正文 | 只表达节奏事实 |

---

## B10. `ReadVisibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process consumption and traceability` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 process query、timeline 和 trace 是否可被授权读取 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumer_ref` | `ProcessConsumerRef` | 读取方 |
| `visibility_context` | `ProcessVisibilityContext` | 可见性上下文摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_read(ProcessReadSubjectRef subject_ref, ProcessConsumerRef consumer_ref)` | 校验读取权限 |
| `filter_timeline(ProcessTimelineView timeline, ProcessConsumerRef consumer_ref)` | 按可见性裁剪 timeline |
| `assert_trace_handoff_allowed(TraceHandoffRef handoff_ref, ProcessConsumerRef consumer_ref)` | 校验追溯交接可见性 |

| 工厂函数 | 作用 |
|---|---|
| `from_context(ProcessVisibilityContext visibility_context)` | 从可见性上下文形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不写业务 truth | 查询和 trace 读取不得反写 |
| 不拥有 conversation visibility truth | 只按正式上下文裁剪 |

---

## B11. `DerivedProcessViewPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | policy / guard |
| 结构责任 | 判断派生视图是否可读、需重建或失败可见 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_state` | `DerivedProcessViewState` | 当前派生状态 |
| `source_cursor_ref` | `ProcessTruthCursorRef` | truth 来源位置 |

| 成员函数 | 作用 |
|---|---|
| `assert_view_readable(DerivedProcessViewState view_state)` | 判断派生视图是否可读 |
| `should_rebuild(DerivedProcessViewState view_state)` | 判断是否需要重建 |
| `assert_rebuild_does_not_write_truth()` | 校验重建不会反写真相 |

| 工厂函数 | 作用 |
|---|---|
| `for_view(DerivedProcessViewState view_state)` | 从派生状态形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不生成业务事实 | 派生维护只能消费 truth |
| 不隐藏 stale / failed | 失败和过期必须显式可见 |
