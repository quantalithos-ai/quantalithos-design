# Step 6 附录 A1. Truth / Execution 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A1. `RuntimeProcessShape`

| 项 | 内容 |
|---|---|
| 所属部分 | `Runtime shape management` |
| 对象类型 | 聚合 / runtime index truth |
| 结构责任 | 表达从 method-library 定义来源形成的可执行过程形态,不保存定义正文 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `shape_id` | `RuntimeProcessShapeId` | 稳定运行时形态身份 |
| `definition_ref` | `MethodDefinitionRef` | 指向 method-library 定义来源 |
| `definition_version_ref` | `MethodDefinitionVersionRef` | 标识运行时形态基于哪个定义版本 |
| `shape_state` | `RuntimeShapeState` | 表达形态是否可采用、过期或不可用 |

| 状态 | 作用 |
|---|---|
| `DraftIndexed` / `Active` / `Stale` / `Invalid` / `Retired` | 已索引草稿、可采用、来源过期、不可用和已退役 |

| 成员函数 | 作用 |
|---|---|
| `activate(MethodDefinitionSnapshot snapshot, ActorRef actor)` | 基于定义快照激活运行时形态 |
| `mark_stale(ReferenceStaleReason reason)` | 标记定义来源过期 |
| `retire(ShapeRetireReason reason, ActorRef actor)` | 退役不再可采用的运行时形态 |

| 工厂函数 | 作用 |
|---|---|
| `from_definition(MethodDefinitionSnapshot snapshot, ActorRef actor)` | 从 method-library 摘要形成运行时形态 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 method definition body | 只保存引用、版本和可执行索引语义 |
| 不成为 BPMN engine 语义容器 | 完整 BPMN 表达力后移,当前只承载基础过程形态 |

---

## A2. `ProcessProfile`

| 项 | 内容 |
|---|---|
| 所属部分 | `Profile adoption management` |
| 对象类型 | 聚合 / truth root |
| 结构责任 | 表达项目采用、裁剪和切换后的过程语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `profile_id` | `ProcessProfileId` | 稳定 profile 身份 |
| `project_ref` | `ProjectRef` | 关联项目语境 |
| `shape_ref` | `RuntimeProcessShapeRef` | 所采用的运行时过程形态 |
| `profile_state` | `ProcessProfileState` | 表达 profile 生命周期 |

| 状态 | 作用 |
|---|---|
| `Proposed` / `Active` / `Suspended` / `Retired` | 待采用、当前采用、暂停和已退役 |

| 成员函数 | 作用 |
|---|---|
| `activate(RuntimeProcessShape shape, ActorRef actor)` | 将 profile 设为项目当前采用语境 |
| `switch_to(RuntimeProcessShape shape, ProfileChangeReason reason, ActorRef actor)` | 切换到新的运行时形态 |
| `suspend(ProfileChangeReason reason, ActorRef actor)` | 暂停 profile 使用 |
| `retire(ProfileChangeReason reason, ActorRef actor)` | 退役 profile |

| 工厂函数 | 作用 |
|---|---|
| `propose(ProjectRef project_ref, RuntimeProcessShapeRef shape_ref, ActorRef actor)` | 从采用意图形成待采用 profile |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 Project truth | `project_ref` 只是外部项目引用 |
| 不绕过 method / governance 约束 | 高风险裁剪必须保留正式来源或治理依据 |

---

## A3. `ProcessInstance`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | 聚合 / execution truth root |
| 结构责任 | 表达一次项目过程运行事实和当前推进语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `process_instance_id` | `ProcessInstanceId` | 稳定实例身份 |
| `profile_ref` | `ProcessProfileRef` | 当前实例采用的 profile |
| `project_ref` | `ProjectRef` | 所属项目引用 |
| `instance_state` | `ProcessInstanceState` | 控制实例是否可推进、等待、恢复或终止 |
| `current_activity_ref` | `Option<ActivityRef>` | 当前过程节点引用 |

| 状态 | 作用 |
|---|---|
| `NotStarted` / `Running` / `Waiting` / `Recovering` / `Completed` / `Cancelled` / `Failed` | 未开始、运行中、等待中、恢复中、完成、取消和失败 |

| 成员函数 | 作用 |
|---|---|
| `start(ProcessProfile profile, ActorRef actor)` | 启动实例并进入运行态 |
| `advance(ActivityRef activity_ref, ActorRef actor)` | 推进到指定活动节点 |
| `pause_for_gate(WaitingGateChangeId change_id, WaitingGate gate, ActorRef actor)` | 因等待点进入 Waiting |
| `resume_from_gate(WaitingGateChangeId change_id, WaitingGate gate, ActorRef actor)` | 从正式等待恢复依据继续运行 |
| `mark_recovering(ProcessCheckpoint checkpoint, ActorRef actor)` | 进入恢复中状态 |
| `complete(ActorRef actor)` | 标记实例完成 |
| `cancel(ProcessCancelReason reason, ActorRef actor)` | 显式取消实例 |

| 工厂函数 | 作用 |
|---|---|
| `create(ProcessProfile profile, ProjectRef project_ref, ActorRef actor)` | 为项目和 profile 建立过程实例 |

| 禁止事项 | 说明 |
|---|---|
| 不等同 Project / Work truth | 只表达过程运行事实,不拥有项目或工作项生命周期 |
| recovery 不创建第二份实例 | 恢复必须保持同一 Process truth 连续 |

---

## A4. `Activity`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | 实体 / process node truth |
| 结构责任 | 表达 ProcessInstance 内的过程节点、承担语境和反馈绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `activity_id` | `ActivityId` | 活动节点身份 |
| `process_instance_id` | `ProcessInstanceId` | 所属过程实例 |
| `activity_kind` | `ActivityKind` | 过程节点类别 |
| `assignee_ref` | `Option<ActorRef>` | 当前承担 actor 引用 |
| `activity_state` | `ActivityState` | 当前节点状态 |
| `feedback_ref` | `Option<RuntimeFeedbackRef>` | 外部执行反馈引用 |

| 状态 | 作用 |
|---|---|
| `Planned` / `Ready` / `InProgress` / `WaitingFeedback` / `Completed` / `Skipped` / `Failed` | 计划、可执行、进行中、等待反馈、完成、跳过和失败 |

| 成员函数 | 作用 |
|---|---|
| `assign(ActorRef actor_ref, ActorRef requested_by)` | 指定节点承担者 |
| `start(ActorRef actor)` | 开始活动 |
| `attach_feedback(RuntimeFeedbackRef feedback_ref)` | 绑定外部执行反馈 |
| `complete(ActivityCompletionReason reason, ActorRef actor)` | 完成活动 |
| `skip(ActivitySkipReason reason, ActorRef actor)` | 跳过活动 |
| `fail(ActivityFailureReason reason, ActorRef actor)` | 标记活动失败 |

| 工厂函数 | 作用 |
|---|---|
| `from_shape_node(ProcessInstanceId process_instance_id, ShapeNodeRef node_ref)` | 从运行时过程形态节点创建 Activity |

| 禁止事项 | 说明 |
|---|---|
| 不等同 WorkItem | Activity 是过程节点,不是工作事实 |
| 不保存 runtime execution body | 只保存反馈引用或摘要边界 |

---

## A5. `Token`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | value object / flow position |
| 结构责任 | 表达实例在过程图中的流控位置 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `token_id` | `ProcessTokenId` | 流控 token 身份 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 |
| `position_ref` | `ShapeNodeRef` | 当前所处过程节点 |
| `token_state` | `TokenState` | token 是否可推进、等待或终止 |

| 状态 | 作用 |
|---|---|
| `Active` / `Waiting` / `Consumed` / `Terminated` | 活跃、等待、已消费和终止 |

| 成员函数 | 作用 |
|---|---|
| `move_to(ShapeNodeRef position_ref)` | 移动到新的过程节点位置 |
| `wait_at(ShapeNodeRef position_ref)` | 在等待点停止推进 |
| `consume()` | 消费 token 并结束该路径 |
| `terminate(TokenTerminationReason reason)` | 显式终止 token |

| 工厂函数 | 作用 |
|---|---|
| `start_at(ProcessInstanceId process_instance_id, ShapeNodeRef start_node_ref)` | 在实例起点创建 token |

| 禁止事项 | 说明 |
|---|---|
| 不作为 runtime queue item | token 只表达过程流控,不调度容器或 tool |
| 不保存完整 BPMN token 语义 | 当前只承载基础流控位置 |

---

## A6. `Gateway`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | value object / routing node |
| 结构责任 | 表达过程路径选择和分支约束 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gateway_id` | `GatewayId` | 网关身份 |
| `shape_node_ref` | `ShapeNodeRef` | 对应运行时形态节点 |
| `gateway_kind` | `GatewayKind` | 分支 / 合流类别 |
| `routing_state` | `GatewayRoutingState` | 当前路径选择状态 |

| 状态 | 作用 |
|---|---|
| `PendingDecision` / `RouteSelected` / `PendingJoin` / `Joined` / `Invalid` | 待选择、已选择、待合流、已合流和不可用 |

| 成员函数 | 作用 |
|---|---|
| `select_route(GatewayRouteRef route_ref, GatewayDecisionReason reason, ActorRef actor)` | 选择可解释路线 |
| `join_tokens(TokenSet tokens)` | 合并多个 token |
| `mark_invalid(GatewayInvalidReason reason)` | 标记网关不可用 |

| 工厂函数 | 作用 |
|---|---|
| `from_shape_node(ShapeNodeRef shape_node_ref, GatewayKind gateway_kind)` | 从运行时过程形态节点形成网关 |

| 禁止事项 | 说明 |
|---|---|
| 不实现完整 BPMN 引擎 | 当前只表达基础路径选择和合流 |
| 不自造 governance decision | 路线选择依据来自正式上下文或 policy |
