# Step 10. 定义状态机与转换矩阵

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
- 回填章节: `projects/L1-conversation/03-详细设计.md` §9 状态机与转换矩阵

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `02_hld_step_09_state_machine.md` | 概要设计层状态机、状态传播和禁止迁移口径 | 作为状态机分组和上游边界 |
| `03_ddd_step_06_object_contracts.md` | 正式 enum 变体、成员函数、允许来源和允许去向 | 作为状态集合真相源 |
| `03_ddd_step_09_function_flows.md` | 触发状态变化的 Command、Consumer、Publish、Job 处理流 | 作为触发函数和副作用来源 |
| `standards/document/详细设计书写规范.md` §5.9 | 状态集合表、ASCII 状态图、转换矩阵和非法转换表格式 | 作为输出格式约束 |

已确认约束:

```text
状态名必须与 Step 6 enum 变体一致。
状态转换必须能回指 Step 6 成员函数或 Step 9 处理流。
派生状态、outbox 状态、handoff 状态不能反向决定 Conversation truth 是否成立。
非法转换必须返回明确 DomainError / ApplicationError / JobError,不得静默忽略。
```

---

## 3. SOP 问题回答

### 3.1 当前仓有哪些正式状态机？

本仓正式状态机以 Step 6 enum 为准,共 14 组生命周期 / freshness / outcome 状态:

| 状态机组 | 状态 enum | 主对象 | 是否进入转换矩阵 |
|---|---|---|---|
| truth core | `ConversationTruthState` | conversation truth policy | 是 |
| space lifecycle | `ConversationSpaceLifecycleState` | `ConversationSpace` | 是 |
| participant scope | `ParticipantScopeState` | `ParticipantScope` | 是 |
| visibility scope | `VisibilityScopeState` | `VisibilityScope` | 是 |
| scope change | `ScopeChangeState` | `ScopeChangeRecord` | 是 |
| fact lifecycle | `ConversationFactState` | `ConversationFact` | 是 |
| append outcome | `FactAppendResult` | `FactAppendReceipt` | 结果型状态,只列集合和禁止事项 |
| manifestation lifecycle | `ManifestationState` | `CrossDomainManifestation` | 是 |
| reference resolution | `ReferenceResolutionState` | `ExternalFactSnapshot` / `ExternalReferenceProjection` | 是 |
| projection freshness | `ProjectionFreshnessState` | `ConversationProjectionState` | 是 |
| change cursor | `ConversationChangeCursorState` | `ConversationChangeCursor` | 是 |
| outbox publication | `ConversationOutboxPublicationState` | `ConversationOutboxRecord` | 是 |
| trace retention | `TraceRetentionState` | `ConversationTraceContext` | 是 |
| handoff lifecycle | `TraceHandoffState` / `ArchiveHandoffState` | `TraceHandoffRecord` / `ArchiveHandoffRecord` | 是 |

`ConversationOutboxEventKind`、`ConversationTruthRefKind` 是分类 enum,不是状态机,只在 §6.12 列出排除原因。

### 3.2 每个状态机的状态集合是什么？

状态集合必须逐字使用 Step 6 enum 变体:

| 状态 enum | 正式状态集合 |
|---|---|
| `ConversationTruthState` | `Open`、`ReadOnly`、`Restricted`、`HandoffPending`、`Closed` |
| `ConversationSpaceLifecycleState` | `Active`、`ReadOnly`、`Closed`、`Archived` |
| `ParticipantScopeState` | `Active`、`Restricted`、`Closed` |
| `VisibilityScopeState` | `Open`、`Restricted`、`Sealed` |
| `ScopeChangeState` | `Applied`、`Superseded`、`Rejected` |
| `ConversationFactState` | `Accepted`、`VisibilityRestricted`、`Retracted`、`Quarantined` |
| `FactAppendResult` | `Accepted`、`Duplicate`、`Rejected` |
| `ManifestationState` | `Manifested`、`Stale`、`Revoked`、`Unresolved` |
| `ReferenceResolutionState` | `Fresh`、`Stale`、`Pending`、`Unresolved`、`Invalid` |
| `ProjectionFreshnessState` | `Fresh`、`Stale`、`Rebuilding`、`Failed`、`Disabled` |
| `ConversationChangeCursorState` | `Active`、`Stale`、`Expired`、`Invalidated` |
| `ConversationOutboxPublicationState` | `Pending`、`Published`、`RetryPending`、`Failed`、`Suppressed` |
| `TraceRetentionState` | `Open`、`Sealed`、`HandoffPending`、`Expired` |
| `TraceHandoffState` | `Pending`、`HandedOff`、`RetryPending`、`Failed`、`Cancelled` |
| `ArchiveHandoffState` | `Pending`、`Archived`、`RetryPending`、`Failed`、`Cancelled` |

### 3.3 哪些函数会触发状态转换？

触发函数来自 Step 6 对象函数和 Step 9 处理流:

| 触发来源 | 触发函数 / 处理流 | 影响状态机 |
|---|---|---|
| Command | `CreateConversationSpaceFlow` | truth open、space active、scope active / open |
| Command | `CloseConversationSpaceFlow` | truth read-only / closed、space closed、trace retention handoff pending |
| Command | `UpdateParticipantScopeFlow` | participant active / restricted / closed、scope change applied / superseded |
| Command | `UpdateVisibilityScopeFlow` | visibility open / restricted / sealed、projection stale、cursor invalidated |
| Command / Consumer | `AppendConversationFactFlow`、`ConsumeRuntimeResultCommittedFlow`、`ConsumeBridgeMappedFactReceivedFlow` | fact accepted / restricted / quarantined、receipt accepted / rejected / duplicate |
| Command | `RetractConversationFactFlow` | fact retracted、projection stale |
| Command / Consumer / Job | `ManifestExternalFactFlow`、`ConsumeGovernanceFactCommittedFlow`、`RefreshExternalReferenceSnapshotsFlow` | manifestation manifested / stale / unresolved、reference fresh / stale / unresolved |
| Consumer / Job | `ConsumeWorkContextChangedFlow`、`ConsumeArtifactFactCommittedFlow`、`ConsumeIdentityActorChangedFlow`、projection rebuild jobs | projection fresh / stale / rebuilding / failed |
| Job | `MaintainConversationChangeCursorsFlow`、`CleanupExpiredConversationCursorsFlow` | cursor active / stale / expired / invalidated |
| Job | `PublishConversationOutboxFlow` | outbox pending / published / retry pending / failed / suppressed |
| Command / Job | `RequestTraceHandoffFlow`、`DeliverTraceHandoffFlow` | trace handoff pending / handed off / retry pending / failed |
| Command / Job | `RequestArchiveHandoffFlow`、`DeliverArchiveHandoffFlow` | archive handoff pending / archived / retry pending / failed |

### 3.4 每个转换的前置条件、副作用和错误是什么？

每个转换矩阵必须写:

| 项 | 规则 |
|---|---|
| 前置条件 | 必须回指对象当前状态、scope / visibility、source resolution、retry policy 或 job input |
| 副作用 | 必须说明是否写 repository、outbox、projection state、handoff state 或 job receipt |
| 错误 | 状态非法时优先返回 `DomainError::InvalidStateTransition`;协议 / job 输入非法返回 `ProtocolError` 或 `JobError`;外部失败按 resolver / publish / handoff error 映射 |
| 审计 | 影响 truth、scope、fact、outbox、handoff 的非法转换必须写审计或 job evidence;纯只读 query 不写状态审计 |

### 3.5 非法转换应该返回什么错误，是否写审计？

非法转换统一口径:

| 非法转换类型 | 错误类型 | 是否写审计 / evidence |
|---|---|---|
| 终态反向打开 | `DomainError::InvalidStateTransition` | 是 |
| 派生状态反向改 truth | `DomainError::BoundaryViolation` | 是 |
| outbox 发布失败回滚 truth | `DomainError::BoundaryViolation` | 是 |
| source unresolved 时补造 external fact | `DomainError::SourceTruthViolation` | 是 |
| cursor expired / invalidated 仍续读 | `ApplicationError::CursorNotResumable` | 是,作为 read / job evidence |
| publish / handoff transient failure | `PublishError` / `HandoffError` -> retry marker | 是,写 retry evidence |
| query 遇到 stale / unresolved | 不作为非法转换 | 读取结果必须暴露 marker |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 6 已列 enum 允许来源 / 去向,但还没有函数级触发矩阵 | 实现者无法直接写状态校验代码 | 本步补转换矩阵和非法转换表 |
| Step 9 有状态副作用,但按 flow 分散 | 测试和实现容易遗漏某个状态机 | 本步按状态机聚合 |
| HLD 中 `Accepted`、`Manifested`、`Fresh`、`Published` 等状态被描述为正常主线 | 需要落成 DDD 层正式 enum 名称 | 本步逐字对齐 Step 6 |
| projection / outbox / handoff 都可能失败 | 容易误以为失败会回滚 truth | 本步明确失败只影响派生 / 发布 / 交接状态 |
| `FactAppendResult` 是 outcome,不是可变生命周期 | 若按普通状态机写会误导实现 | 本步单独列为结果型状态 |

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把 14 组状态揉成一张矩阵 | A. 单张大矩阵;B. 按状态机分组 | 采用 B。每个状态机有自己的触发函数、错误和副作用,混写会隐藏边界 |
| 是否把 projection stale 当作 truth 状态 | A. 合并到 truth;B. 独立 projection freshness | 采用 B。projection 是派生状态,不能反向决定 fact / scope truth |
| 是否把 outbox publish success 当作 truth commit | A. publish 成功后 truth 才成立;B. truth 先提交,outbox 后传播 | 采用 B。Step 9 已明确 command 事务提交 truth 和 outbox,发布失败只推进 outbox 状态 |
| 是否为 `FactAppendResult` 写转换矩阵 | A. 写完整矩阵;B. 作为一次性 outcome | 采用 B。receipt outcome 创建后不可变,不应设计后续迁移 |
| 是否为 `ConversationOutboxEventKind` 写状态机 | A. 写状态矩阵;B. 排除为分类 enum | 采用 B。event kind 是路由分类,不是生命周期 |
## 6. 结构化中间产物

### 6.1 状态机总表

| 状态机 | 主对象 | 状态字段 | 初始状态 | 终态 | 主要触发函数 |
|---|---|---|---|---|---|
| Conversation truth | truth policy / aggregate root | `ConversationTruthState` | `Open` | `Closed` | `CreateConversationSpaceFlow`、`CloseConversationSpaceFlow`、handoff request |
| Space lifecycle | `ConversationSpace` | `lifecycle_state` | `Active` | `Archived` | `ConversationSpace::close(...)`、`ConversationSpace::archive(...)` |
| Participant scope | `ParticipantScope` | `scope_state` | `Active` | `Closed` | `add_participant(...)`、`remove_participant(...)`、restriction policy |
| Visibility scope | `VisibilityScope` | `scope_state` | `Open` | `Sealed` | `UpdateVisibilityScopeFlow`、visibility restriction |
| Scope change | `ScopeChangeRecord` | `change_state` | `Applied` / `Rejected` | `Superseded` / `Rejected` | `mark_superseded(...)`、scope command rejection |
| Fact lifecycle | `ConversationFact` | `fact_state` | `Accepted` / `Quarantined` | `Retracted` | `restrict_visibility(...)`、`retract(...)`、quarantine policy |
| Append receipt outcome | `FactAppendReceipt` | `append_result` | `Accepted` / `Duplicate` / `Rejected` | 不适用 | receipt factory |
| Manifestation lifecycle | `CrossDomainManifestation` | `manifestation_state` | `Manifested` / `Unresolved` | `Revoked` | `mark_stale(...)`、`refresh_snapshot(...)`、`revoke(...)` |
| Reference resolution | `ExternalFactSnapshot` / `ExternalReferenceProjection` | `resolution_state` | `Pending` / `Fresh` / `Unresolved` | `Invalid` | resolver / refresh job |
| Projection freshness | `ConversationProjectionState` | `freshness_state` | `Fresh` | `Disabled` | `mark_stale(...)`、`begin_rebuild(...)`、`complete_rebuild(...)`、`fail_rebuild(...)` |
| Change cursor | `ConversationChangeCursor` | `cursor_state` | `Active` | `Expired` / `Invalidated` | `advance(...)`、`mark_stale(...)`、`invalidate(...)` |
| Outbox publication | `ConversationOutboxRecord` | `publication_state` | `Pending` | `Published` / `Failed` / `Suppressed` | `mark_published(...)`、`mark_retry(...)`、`mark_failed(...)` |
| Trace retention | `ConversationTraceContext` | `retention_state` | `Open` | `Expired` | trace seal / handoff / retention policy |
| Trace handoff | `TraceHandoffRecord` | `handoff_state` | `Pending` | `HandedOff` / `Failed` / `Cancelled` | `mark_handed_off(...)`、`mark_retry(...)`、`mark_failed(...)`、`cancel(...)` |
| Archive handoff | `ArchiveHandoffRecord` | `handoff_state` | `Pending` | `Archived` / `Failed` / `Cancelled` | `mark_archived(...)`、`mark_retry(...)`、`mark_failed(...)` |

### 6.2 全局状态传播图

#### 状态转换图: conversation state propagation

```text
[Command / Consumer]
  | commit truth state change
  v
[Conversation Truth / Scope / Fact / Manifestation]
  | enqueue outbox and mark projections stale
  v
[OutboxPublicationState + ProjectionFreshnessState]
  | publish / rebuild / expose marker
  v
[Downstream Event + Authorized Query]

[Trace / Handoff Intent]
  | deliver by job
  v
[TraceHandoffState / ArchiveHandoffState]
  | write receipt or retry evidence
  v
[Operations Evidence]
```

关键说明:

- truth / scope / fact / manifestation 是上游主状态。
- outbox、projection、cursor、handoff 是传播、读取、恢复或交接状态。
- query 不触发 truth 状态迁移,但必须暴露 stale、unresolved、failed、expired、invalidated marker。
- 外部 publish / handoff 失败不得回滚已提交 truth。

### 6.3 Conversation truth 与 space lifecycle 状态机

#### 状态集合表: `ConversationTruthState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | truth 可按 scope / policy 追加事实和读取 | 否 | append fact、manifest external fact、update scope、request handoff |
| `ReadOnly` | truth 停止新增事实,仍允许读取、review、handoff | 否 | query、create review anchor、request handoff、close |
| `Restricted` | truth 只能通过受限读写路径使用 | 否 | restricted query、policy recovery、close |
| `HandoffPending` | 存在待发布或待交接工作 | 否 | publish outbox、deliver handoff、close |
| `Closed` | truth 关闭,只支持受控 trace / handoff | 是 | query history、trace / archive handoff |

#### 状态转换图: `ConversationTruthState`

```text
<Open>
  | close request
  v
<ReadOnly>
  | request handoff
  v
<HandoffPending>
  | all handoff done
  v
<Closed>

<Open>
  | restriction detected
  v
<Restricted>
  | policy release
  v
<Open>
```

#### 转换矩阵: `ConversationTruthState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Open` | `ConversationTruthState::open_for_space(ConversationSpaceId space_id, ActorRef actor)` | `CreateConversationSpaceFlow` 通过 owner、participant、visibility 校验 | 创建 space / scope / visibility truth 和 outbox | `DomainError::InvalidInitialState` |
| `Open` | `ReadOnly` | `CloseConversationSpaceFlow` | actor 可关闭 space,且无必须先提交的 append command | 写 `ScopeChangeRecord`,enqueue space changed outbox | `DomainError::InvalidStateTransition` |
| `Open` | `Restricted` | `ConversationTruthState::restricted(RestrictionReason reason)` | 可见性、来源或边界策略判定受限 | query 输出 restricted marker,projection stale | `DomainError::BoundaryViolation` |
| `Restricted` | `Open` | policy recovery flow | restriction reason 已解除且有审计依据 | 写 recovery evidence,projection stale | `DomainError::InvalidStateTransition` |
| `ReadOnly` | `HandoffPending` | `RequestTraceHandoffFlow` / `RequestArchiveHandoffFlow` | trace context / archive scope 可交接 | 保存 handoff intent 和 outbox | `DomainError::InvalidStateTransition` |
| `Open` | `HandoffPending` | handoff request while space remains readable | handoff 不要求先关闭写入 | 保存 handoff intent 和 outbox | `DomainError::InvalidStateTransition` |
| `HandoffPending` | `Closed` | handoff completion evidence | 必须发布或交接完成 / 被运维确认 | 关闭 truth,保留 trace refs | `DomainError::InvalidStateTransition` |
| `Open` / `ReadOnly` / `Restricted` | `Closed` | `CloseConversationSpaceFlow` | close policy 允许直接关闭 | 保存 close scope change 和 outbox | `DomainError::InvalidStateTransition` |

#### 状态集合表: `ConversationSpaceLifecycleState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | space 可写可读 | 否 | append fact、scope update、query |
| `ReadOnly` | space 停止新 fact,允许读取和 trace | 否 | query、review、handoff、close |
| `Closed` | space 关闭,只支持历史和交接 | 否 | query history、archive |
| `Archived` | space 已交由 archive 承接 | 是 | read archive ref、audit |

#### 状态转换图: `ConversationSpaceLifecycleState`

```text
<Active>
  | close(actor, reason)
  v
<ReadOnly>
  | close confirmed
  v
<Closed>
  | archive(actor, archive_intent_ref)
  v
<Archived>
```

#### 转换矩阵: `ConversationSpaceLifecycleState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Active` | `ConversationSpace::create_project_space(...)` / `create_personal_space(...)` / `create_system_space(...)` | owner ref、actor、default scope 有效 | 创建初始 participant / visibility scope | `DomainError::InvalidInitialState` |
| `Active` | `ReadOnly` | `ConversationSpace::close(ActorRef actor, SpaceCloseReason reason)` | close 允许停写但仍需读取 / trace | 产生 `ScopeChangeRecord` | `DomainError::InvalidStateTransition` |
| `Active` | `Closed` | `ConversationSpace::close(...)` | policy 允许直接关闭 | 产生 close scope change,outbox | `DomainError::InvalidStateTransition` |
| `ReadOnly` | `Closed` | `ConversationSpace::close(...)` | pending append 已处理 | 产生 close evidence | `DomainError::InvalidStateTransition` |
| `Active` / `ReadOnly` / `Closed` | `Archived` | `ConversationSpace::archive(ActorRef actor, ArchiveIntentRef archive_intent_ref)` | archive handoff 或 archive intent 已成立 | 标记归档承接,不生成 archive 包正文 | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: truth / space

| 非法转换 | 处理 |
|---|---|
| `Closed` -> `Open` / `ReadOnly` | 返回 `DomainError::InvalidStateTransition`,写 close reopen attempt audit |
| `Archived` -> 任意非归档状态 | 返回 `DomainError::InvalidStateTransition`,写 archive boundary violation evidence |
| projection stale 试图修改 `ConversationTruthState` | 返回 `DomainError::BoundaryViolation` |
| publish success 试图创建 truth | 返回 `DomainError::BoundaryViolation` |

### 6.4 Scope 状态机

#### 状态集合表: `ParticipantScopeState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 可用于参与和读取判断 | 否 | add participant、remove participant、query role |
| `Restricted` | 需要额外 policy 判断 | 否 | restricted query、policy recovery、close |
| `Closed` | 只用于历史追溯 | 是 | trace / history read |

#### 状态集合表: `VisibilityScopeState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | 默认规则可授权读取和输出 | 否 | can_read、can_manifest、update visibility |
| `Restricted` | 需要额外 policy 判断 | 否 | restricted read、policy recovery、seal |
| `Sealed` | 可见性不可扩张 | 是 | historical read only |

#### 状态集合表: `ScopeChangeState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Applied` | scope change 已生效 | 否 | mark superseded、read history |
| `Superseded` | 被后续变更覆盖 | 是 | read history |
| `Rejected` | 被拒绝并保留审计 | 是 | read audit |

#### 状态转换图: scope states

```text
ParticipantScopeState:
<Active>
  | restriction detected
  v
<Restricted>
  | policy release
  v
<Active>
  | close space
  v
<Closed>

VisibilityScopeState:
<Open>
  | restriction detected
  v
<Restricted>
  | policy release
  v
<Open>
  | seal visibility
  v
<Sealed>

ScopeChangeState:
<Applied>
  | later scope change
  v
<Superseded>

<Rejected>
```

#### 转换矩阵: scope states

| 状态机 | From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|
| `ParticipantScopeState` | 初始 | `Active` | `ParticipantScope::from_initial_participants(ConversationSpaceId space_id, Vec<ConversationParticipantRef> participants)` | space 创建成功,participants 可解析 | 创建初始 participant scope | `DomainError::InvalidInitialState` |
| `ParticipantScopeState` | `Active` | `Restricted` | `ParticipantScope::restricted_from_scope(ParticipantScope scope, RestrictionReason reason)` | policy 判定参与范围受限 | projection stale,cursor invalidated or stale | `DomainError::InvalidStateTransition` |
| `ParticipantScopeState` | `Restricted` | `Active` | policy recovery flow | restriction reason 已解除 | 写 recovery evidence,projection stale | `DomainError::InvalidStateTransition` |
| `ParticipantScopeState` | `Active` / `Restricted` | `Closed` | `CloseConversationSpaceFlow` | space close 成立 | scope 不再参与新 append | `DomainError::InvalidStateTransition` |
| `VisibilityScopeState` | 初始 | `Open` | `VisibilityScope::from_participant_scope(&ParticipantScope scope, VisibilityLevel default_visibility)` | participant scope active | 创建默认 visibility scope | `DomainError::InvalidInitialState` |
| `VisibilityScopeState` | `Open` | `Restricted` | `UpdateVisibilityScopeFlow` / policy restriction | visibility rules 需要收紧 | read model / cursor / reference projection stale | `DomainError::InvalidStateTransition` |
| `VisibilityScopeState` | `Restricted` | `Open` | policy recovery flow | restriction reason 已解除 | projection stale | `DomainError::InvalidStateTransition` |
| `VisibilityScopeState` | `Open` / `Restricted` | `Sealed` | `UpdateVisibilityScopeFlow` / close flow | 不允许继续扩张可见性 | cursor invalidated,read model stale | `DomainError::InvalidStateTransition` |
| `ScopeChangeState` | 初始 | `Applied` | `ScopeChangeRecord::from_*_change(...)` | scope command 成功 | enqueue scope / space changed outbox | `DomainError::InvalidInitialState` |
| `ScopeChangeState` | 初始 | `Rejected` | scope command reject path | policy / validation 拒绝 | 写 rejected audit,不改当前 scope truth | `DomainError::InvalidInitialState` |
| `ScopeChangeState` | `Applied` | `Superseded` | `ScopeChangeRecord::mark_superseded(ScopeChangeRecordId successor_id)` | successor 已提交 | 旧记录保留历史 | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: scope states

| 非法转换 | 处理 |
|---|---|
| `ParticipantScopeState.Closed` -> `Active` / `Restricted` | 返回 `DomainError::InvalidStateTransition`,必须创建新 scope 变更而不是复活旧 scope |
| `VisibilityScopeState.Sealed` -> `Open` / `Restricted` | 返回 `DomainError::InvalidStateTransition`,写 visibility expansion denied evidence |
| `ScopeChangeState.Superseded` -> `Applied` | 返回 `DomainError::InvalidStateTransition`,不允许旧 history record 重新成为当前 truth |
| `ScopeChangeState.Rejected` -> `Applied` | 返回 `DomainError::InvalidStateTransition`,必须重新提交新的 scope command |

### 6.5 Fact 与 append receipt 状态机

#### 状态集合表: `ConversationFactState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | fact 已成立,可按 visibility 读取 | 否 | restrict visibility、retract、query |
| `VisibilityRestricted` | fact 成立但读取更严格 | 否 | query with marker、release restriction、retract |
| `Retracted` | fact 已撤回但保留追溯 | 是 | query audit / trace |
| `Quarantined` | fact 隔离,不能作为正常事实输出 | 否 | manual review、retract |

#### 状态集合表: `FactAppendResult`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | append 请求成功形成 fact | 是 | read receipt |
| `Duplicate` | 幂等命中已有 append 结果 | 是 | read receipt |
| `Rejected` | append 请求被拒绝 | 是 | read rejection reason |

`FactAppendResult` 是 receipt outcome,不是可变生命周期。创建后不可迁移,因此不写普通 From / To 矩阵。

#### 状态转换图: fact lifecycle

```text
<Append Request>
  | accepted
  v
<Accepted>
  | restrict_visibility(reason, actor)
  v
<VisibilityRestricted>
  | policy release
  v
<Accepted>

<Accepted> or <VisibilityRestricted>
  | retract(actor, reason)
  v
<Retracted>

<Accepted> or <VisibilityRestricted>
  | quarantine policy
  v
<Quarantined>
  | retract(actor, reason)
  v
<Retracted>
```

#### 转换矩阵: `ConversationFactState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Accepted` | `ConversationFact::from_append_input(...)` / `ConversationFact::from_manifestation(...)` | space 可接受 fact,source ref 和 visibility 有效 | 保存 fact、receipt、trace、outbox | `DomainError::InvalidInitialState` |
| 初始 | `Quarantined` | append / consumer quarantine path | source、payload、boundary 或 safety 校验失败但需留证 | 写 quarantine receipt / evidence,不发布正常 fact event | `DomainError::BoundaryViolation` |
| `Accepted` | `VisibilityRestricted` | `ConversationFact::restrict_visibility(VisibilityRestrictionReason reason, ActorRef actor)` | visibility policy 收紧或 participant scope 变更 | read model / cursor stale | `DomainError::InvalidStateTransition` |
| `VisibilityRestricted` | `Accepted` | policy recovery flow | restriction reason 已解除 | read model stale | `DomainError::InvalidStateTransition` |
| `Accepted` / `VisibilityRestricted` | `Retracted` | `ConversationFact::retract(ActorRef actor, FactRetractionReason reason)` | actor 可撤回且 fact 未终止 | 保存 fact state、retraction receipt、outbox | `DomainError::InvalidStateTransition` |
| `Accepted` / `VisibilityRestricted` | `Quarantined` | quarantine policy flow | 发现来源、可见性或安全边界问题 | 停止正常输出,写 audit | `DomainError::BoundaryViolation` |
| `Quarantined` | `Retracted` | `ConversationFact::retract(...)` | review 认定应撤回 | 写 retraction evidence | `DomainError::InvalidStateTransition` |

#### 结果型状态表: `FactAppendResult`

| Outcome | 触发路径 | 后续状态迁移 | 非法处理 |
|---|---|---|---|
| `Accepted` | `FactAppendReceipt::accepted(&ConversationFact fact, IdempotencyKey key, Timestamp recorded_at)` | 不迁移 | 不允许改成 duplicate / rejected |
| `Duplicate` | `FactAppendReceipt::duplicate(ConversationFactId fact_id, IdempotencyKey key, Timestamp recorded_at)` | 不迁移 | 不允许重复生成 fact |
| `Rejected` | `FactAppendReceipt::rejected(ConversationSpaceId space_id, IdempotencyKey key, FactAppendRejectionReason reason, Timestamp recorded_at)` | 不迁移 | 不允许事后变成 accepted;必须重新提交 command |

#### 非法转换处理表: fact / receipt

| 非法转换 | 处理 |
|---|---|
| `Retracted` -> `Accepted` / `VisibilityRestricted` | 返回 `DomainError::InvalidStateTransition`,保留 retraction audit |
| `Quarantined` -> `Accepted` | 返回 `DomainError::InvalidStateTransition`;需要新的 accepted fact 或人工 recovery 设计,不能复活同一 fact |
| `FactAppendResult.Rejected` -> `Accepted` | 返回 `DomainError::ImmutableReceipt`,重新提交 request 才能形成新 receipt |
| duplicate path 生成新 `ConversationFact` | 返回 `IdempotencyError::Conflict` 或 `DomainError::DuplicateAppend` |

### 6.6 Manifestation 与 reference resolution 状态机

#### 状态集合表: `ManifestationState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Manifested` | 外部事实已显化并可按 visibility 读取 | 否 | mark stale、refresh snapshot、revoke、query |
| `Stale` | 显化快照或来源版本过期 | 否 | refresh snapshot、revoke、query degraded |
| `Revoked` | 显化被撤销,保留追溯 | 是 | query audit / trace |
| `Unresolved` | 来源暂不可解析 | 否 | refresh / resolve、revoke、query marker |

#### 状态集合表: `ReferenceResolutionState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | 引用已解析且与来源版本对齐 | 否 | display、mark stale、invalidate |
| `Stale` | 引用已解析但来源变化或快照过期 | 否 | refresh、display degraded、invalidate |
| `Pending` | 等待异步解析 | 否 | refresh、mark unresolved、invalidate |
| `Unresolved` | 当前不可解析 | 否 | retry refresh、display marker、invalidate |
| `Invalid` | 引用无效,不得展示为有效事实 | 是 | audit only |

#### 状态转换图: manifestation / reference

```text
ManifestationState:
<Manifested>
  | mark_stale(latest_version_ref)
  v
<Stale>
  | refresh_snapshot(snapshot)
  v
<Manifested>

<Manifested> or <Stale> or <Unresolved>
  | revoke(actor, reason)
  v
<Revoked>

<Unresolved>
  | source resolved
  v
<Manifested>

ReferenceResolutionState:
<Pending>
  | resolver success
  v
<Fresh>
  | source changed
  v
<Stale>
  | resolver success
  v
<Fresh>

<Pending> or <Fresh> or <Stale>
  | resolver failure
  v
<Unresolved>

<Any non-terminal>
  | invalid source or permission
  v
<Invalid>
```

#### 转换矩阵: `ManifestationState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Manifested` | `CrossDomainManifestation::from_external_fact(...)` / `from_snapshot(...)` | source ref 有效,visibility 允许显化 | 保存 manifestation,outbox,trace | `DomainError::InvalidInitialState` |
| 初始 | `Unresolved` | manifestation unresolved path | source ref 可保存但 resolver 当前不可用 | 保存 unresolved marker,不补造来源事实 | `ResolverError` -> `ApplicationError::UnresolvedReference` |
| `Manifested` | `Stale` | `CrossDomainManifestation::mark_stale(ExternalSourceVersionRef latest_version_ref)` | 来源版本变化或 snapshot 过期 | projection stale,query degraded marker | `DomainError::InvalidStateTransition` |
| `Stale` | `Manifested` | `CrossDomainManifestation::refresh_snapshot(ExternalFactSnapshot snapshot)` | snapshot 匹配 external fact ref 且通过 visibility | 更新 snapshot ref,outbox changed | `DomainError::SnapshotMismatch` |
| `Unresolved` | `Manifested` | `CrossDomainManifestation::refresh_snapshot(...)` | resolver 重新成功 | 更新 snapshot ref,清除 unresolved marker | `DomainError::InvalidStateTransition` |
| `Manifested` / `Stale` / `Unresolved` | `Revoked` | `CrossDomainManifestation::revoke(ActorRef actor, ManifestationRevokeReason reason)` | actor 可撤销,保留 trace | 保存 revoked state,outbox changed | `DomainError::InvalidStateTransition` |

#### 转换矩阵: `ReferenceResolutionState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Pending` | `ReferenceResolutionState::pending(ReferenceResolutionReason reason)` | 异步解析未完成 | projection 显示 pending marker | `DomainError::InvalidInitialState` |
| 初始 | `Fresh` | `ExternalFactSnapshot::from_resolved_reference(...)` | resolver 返回安全快照 | upsert snapshot,attach snapshot ref | `ResolverError` |
| 初始 | `Unresolved` | `ReferenceResolutionState::unresolved(ReferenceResolutionReason reason)` | resolver 失败或来源暂不可用 | projection 显示 unresolved marker | `ResolverError` |
| `Fresh` | `Stale` | `ExternalFactSnapshot::mark_stale(ExternalSourceVersionRef latest_version_ref)` | source digest / version 不匹配 | query degraded marker,refresh job evidence | `DomainError::InvalidStateTransition` |
| `Stale` / `Pending` / `Unresolved` | `Fresh` | `RefreshExternalReferenceSnapshotsFlow` | resolver 成功且 digest 合法 | upsert snapshot,attach snapshot ref | `DomainError::DigestMismatch` |
| `Pending` / `Fresh` / `Stale` | `Unresolved` | `RefreshExternalReferenceSnapshotsFlow` | resolver failure 可重试 | mark unresolved,job evidence | `ResolverError` |
| 任意非终态 | `Invalid` | reference validation policy | source ref 格式、权限或边界非法 | invalid marker,不可展示 | `DomainError::InvalidExternalReference` |

#### 非法转换处理表: manifestation / reference

| 非法转换 | 处理 |
|---|---|
| `Revoked` -> `Manifested` / `Stale` / `Unresolved` | 返回 `DomainError::InvalidStateTransition`,必须创建新的 manifestation |
| `Invalid` -> `Fresh` | 返回 `DomainError::InvalidStateTransition`,必须创建新 external ref 或修正来源后重新显化 |
| unresolved path 写入来源正文 | 返回 `DomainError::SourceTruthViolation`,写 boundary audit |
| stale reference 在 query 中伪装为 fresh | 返回 / 暴露 degraded marker,不得静默 |

### 6.7 Projection freshness 与 change cursor 状态机

#### 状态集合表: `ProjectionFreshnessState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | 派生与 source position 对齐 | 否 | query、mark stale、begin rebuild、disable |
| `Stale` | 派生落后于 truth | 否 | degraded query、begin rebuild、disable |
| `Rebuilding` | 派生正在重建 | 否 | complete rebuild、fail rebuild |
| `Failed` | 派生重建失败 | 否 | degraded query、begin rebuild、mark stale、disable |
| `Disabled` | 派生被禁用 | 是 | explicit unsupported / fallback |

#### 状态集合表: `ConversationChangeCursorState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | cursor 可继续增量读取 | 否 | advance、mark stale、expire、invalidate |
| `Stale` | cursor 落后但可恢复 | 否 | advance after refresh、expire、invalidate |
| `Expired` | cursor 超出保留窗口 | 是 | cleanup only |
| `Invalidated` | scope / visibility 变化导致不可续读 | 是 | recreate cursor only |

#### 状态转换图: projection / cursor

```text
ProjectionFreshnessState:
<Fresh>
  | truth or source changed
  v
<Stale>
  | begin_rebuild(rebuild_ref)
  v
<Rebuilding>
  | complete_rebuild(source_position)
  v
<Fresh>

<Rebuilding>
  | fail_rebuild(error_ref)
  v
<Failed>
  | begin_rebuild(rebuild_ref)
  v
<Rebuilding>

<Any non-terminal>
  | disable projection
  v
<Disabled>

ConversationChangeCursorState:
<Active>
  | mark_stale(reason)
  v
<Stale>
  | advance(fact_sequence, outbox_sequence)
  v
<Active>

<Active> or <Stale>
  | retention window passed
  v
<Expired>

<Active> or <Stale>
  | invalidate(scope_change)
  v
<Invalidated>
```

#### 转换矩阵: `ProjectionFreshnessState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Fresh` | `ConversationProjectionState::initial(ConversationProjectionKind kind, ConversationSourcePosition source_position)` | 初始 projection 覆盖当前位置 | 可供 query 使用 | `DomainError::InvalidInitialState` |
| 初始 | `Disabled` | `ConversationProjectionState::disabled(ConversationProjectionKind kind, ProjectionDisableReason reason)` | 配置或能力声明不启用该 projection | query 使用 fallback / unsupported marker | `DomainError::InvalidInitialState` |
| `Fresh` / `Failed` | `Stale` | `ConversationProjectionState::mark_stale(ProjectionStaleReason reason)` | truth / source / actor / visibility 变化 | 保存 projection state,可发布 projection state changed | `DomainError::InvalidStateTransition` |
| `Fresh` / `Stale` / `Failed` | `Rebuilding` | `ConversationProjectionState::begin_rebuild(ProjectionRebuildRef rebuild_ref)` | rebuild job 输入合法,projection 未 disabled | 保存 rebuilding state | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Fresh` | `ConversationProjectionState::complete_rebuild(ConversationSourcePosition source_position)` | source position 只能前进,重建成功 | upsert read model / search / cursor projection,save fresh state | `DomainError::SourcePositionRegression` |
| `Rebuilding` | `Failed` | `ConversationProjectionState::fail_rebuild(ProjectionErrorRef error_ref)` | rebuild 失败且有错误引用 | 保存 failed marker,query 必须降级 | `DomainError::InvalidStateTransition` |
| 任意非终态 | `Disabled` | disable projection policy | 配置或运维禁用 | 保存 disabled state | `DomainError::InvalidStateTransition` |

#### 转换矩阵: `ConversationChangeCursorState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Active` | `ConversationChangeCursor::start_from(...)` / `from_read_model(...)` | read model 可见性有效 | 保存 cursor | `DomainError::InvalidInitialState` |
| `Active` | `Active` | `ConversationChangeCursor::advance(ConversationFactSequence fact_sequence, ConversationOutboxSequence outbox_sequence)` | sequence 单调前进,visibility 仍允许 | 保存新 cursor position | `DomainError::SequenceRegression` |
| `Stale` | `Active` | `ConversationChangeCursor::advance(...)` | cursor projection 已刷新且 sequence 合法 | 保存恢复后位置 | `ApplicationError::CursorNotResumable` |
| `Active` | `Stale` | `ConversationChangeCursor::mark_stale(CursorStaleReason reason)` | outbox gap、projection lag 或 source change | query 输出 stale marker | `DomainError::InvalidStateTransition` |
| `Active` / `Stale` | `Expired` | cursor retention policy | `expired_before` 早于 cursor last position | cleanup job 可删除 cursor | `ApplicationError::CursorNotResumable` |
| `Active` / `Stale` | `Invalidated` | `ConversationChangeCursor::invalidate(&ScopeChangeRecord change)` | participant / visibility scope 变化影响该 consumer | query 要求重新建立 cursor | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: projection / cursor

| 非法转换 | 处理 |
|---|---|
| `Disabled` -> 任意状态 | 返回 `DomainError::InvalidStateTransition`,必须通过配置设计重新启用后创建新 state |
| `Fresh` -> `Failed` 跳过 `Rebuilding` | 返回 `DomainError::InvalidStateTransition`,失败必须来自 rebuild attempt |
| `Expired` / `Invalidated` -> `Active` | 返回 `ApplicationError::CursorNotResumable`,要求新建 cursor |
| cursor sequence 逆行 | 返回 `DomainError::SequenceRegression`,写 concurrency evidence |

### 6.8 Outbox publication 状态机

#### 状态集合表: `ConversationOutboxPublicationState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 等待发布或交接 | 否 | publish、suppress、retry decision |
| `Published` | 发布 / 交接标记完成 | 是 | read evidence |
| `RetryPending` | 发布失败并等待重试 | 否 | publish retry、mark failed |
| `Failed` | 发布失败达到处理门槛 | 是 | operations review |
| `Suppressed` | 因可见性或边界规则不发布 | 是 | read evidence |

#### 状态转换图: `ConversationOutboxPublicationState`

```text
<Pending>
  | mark_published(published_ref, published_at)
  v
<Published>

<Pending>
  | mark_retry(reason, next_retry_at)
  v
<RetryPending>
  | mark_published(published_ref, published_at)
  v
<Published>

<RetryPending>
  | retry exhausted
  v
<Failed>

<Pending>
  | visibility or boundary suppress
  v
<Suppressed>
```

#### 转换矩阵: `ConversationOutboxPublicationState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Pending` | `ConversationOutboxRecord::from_fact_append(...)` / `from_fact_retraction(...)` / `from_manifestation(...)` / `from_scope_change(...)` / `from_trace_handoff(...)` / `from_archive_handoff(...)` | truth 已在 command / consumer 事务内提交 | outbox 入队,truth 不等待 publish 成功 | `DomainError::InvalidInitialState` |
| `Pending` / `RetryPending` | `Published` | `ConversationOutboxRecord::mark_published(PublishedEventRef published_ref, Timestamp published_at)` | publisher 返回 `PublishedEventRef` | 保存 published state,清空 retry marker | `DomainError::InvalidStateTransition` |
| `Pending` | `RetryPending` | `ConversationOutboxRecord::mark_retry(RetryReason reason, Timestamp next_retry_at)` | publish transient failure 且未超 retry limit | 保存 retry marker | `DomainError::InvalidStateTransition` |
| `RetryPending` | `RetryPending` | `mark_retry(...)` | retry 再次失败但仍可重试 | 更新 retry marker / next retry | `DomainError::RetryLimitExceeded` |
| `Pending` / `RetryPending` | `Failed` | `ConversationOutboxRecord::mark_failed(OutboxFailureReason reason, ActorRef actor)` | non-retry failure 或 retry exhausted | 保存 failed evidence,truth 不回滚 | `DomainError::InvalidStateTransition` |
| `Pending` | `Suppressed` | visibility / boundary suppression path | event 不应跨边界发布 | 保存 suppressed evidence | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: outbox publication

| 非法转换 | 处理 |
|---|---|
| `Published` -> `RetryPending` / `Failed` | 返回 `DomainError::InvalidStateTransition`,避免重复发布覆盖成功证据 |
| `Failed` -> `Published` | 返回 `DomainError::InvalidStateTransition`;需要新 outbox 或 manual resolution 设计 |
| `Suppressed` -> `Published` | 返回 `DomainError::BoundaryViolation`;不能绕过 visibility / boundary suppression |
| publish failure 回滚 fact / scope / manifestation | 返回 `DomainError::BoundaryViolation`,写 operations evidence |

### 6.9 Trace retention 状态机

#### 状态集合表: `TraceRetentionState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | trace context 可追加关联材料 | 否 | attach fact / manifestation / scope change、seal、request handoff |
| `Sealed` | trace context 已封存,只允许读取和交接 | 否 | query trace、request handoff、expire |
| `HandoffPending` | trace 需要交给 observability 或 archive | 否 | deliver trace / archive handoff、seal、expire |
| `Expired` | 本地保留过期,只留引用 | 是 | query refs、archive lookup |

#### 状态转换图: `TraceRetentionState`

```text
<Open>
  | seal retention
  v
<Sealed>
  | request handoff
  v
<HandoffPending>
  | handoff delivered or policy sealed
  v
<Sealed>

<Open> or <Sealed> or <HandoffPending>
  | retention window expired
  v
<Expired>
```

#### 转换矩阵: `TraceRetentionState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Open` | `ConversationTraceContext::from_fact_append(...)` / `from_manifestation(...)` | fact / manifestation 已提交 | 保存 trace context | `DomainError::InvalidInitialState` |
| `Open` | `Sealed` | trace seal policy | 不再允许追加 trace link | trace 只读,允许 handoff | `DomainError::InvalidStateTransition` |
| `Open` / `Sealed` | `HandoffPending` | `RequestTraceHandoffFlow` / `RequestArchiveHandoffFlow` | handoff intent 已创建 | 保存 handoff record,outbox | `DomainError::InvalidStateTransition` |
| `HandoffPending` | `Sealed` | handoff completion policy | handoff delivered 或归档请求已承接 | 保留 receipt / archive ref | `DomainError::InvalidStateTransition` |
| `Open` / `Sealed` / `HandoffPending` | `Expired` | retention cleanup policy | retention window 到期 | 只保留 refs,query 返回 expired marker | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: trace retention

| 非法转换 | 处理 |
|---|---|
| `Expired` -> `Open` / `Sealed` / `HandoffPending` | 返回 `DomainError::InvalidStateTransition`,不得恢复本地 trace material |
| `Sealed` 状态继续 attach fact | 返回 `DomainError::InvalidStateTransition`,必须创建新 trace context 或只读引用 |
| handoff failure 改写 trace truth | 返回 `DomainError::BoundaryViolation`,只写 handoff state |

### 6.10 Trace handoff 状态机

#### 状态集合表: `TraceHandoffState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 等待交给 observability | 否 | deliver、mark retry、mark failed、cancel |
| `HandedOff` | 已完成 observability 交接 | 是 | read receipt |
| `RetryPending` | 交接失败但可重试 | 否 | deliver retry、mark failed、cancel |
| `Failed` | 交接失败且需处理 | 是 | operations review |
| `Cancelled` | 交接意图被取消 | 是 | read audit |

#### 状态转换图: `TraceHandoffState`

```text
<Pending>
  | mark_handed_off(receipt_ref, handed_off_at)
  v
<HandedOff>

<Pending>
  | mark_retry(reason, next_retry_at)
  v
<RetryPending>
  | mark_handed_off(receipt_ref, handed_off_at)
  v
<HandedOff>

<RetryPending>
  | retry exhausted
  v
<Failed>

<Pending> or <RetryPending>
  | cancel(actor, reason)
  v
<Cancelled>
```

#### 转换矩阵: `TraceHandoffState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Pending` | `TraceHandoffRecord::from_trace_context(&ConversationTraceContext trace_context, ObservabilityDestinationRef destination_ref)` | trace context 存在且 handoff allowed | 保存 handoff intent,outbox | `DomainError::InvalidInitialState` |
| `Pending` / `RetryPending` | `HandedOff` | `TraceHandoffRecord::mark_handed_off(ObservabilityReceiptRef receipt_ref, Timestamp handed_off_at)` | `TraceHandoffPort.deliver_trace_handoff(...)` 成功 | 保存 receipt ref,清空 retry marker | `DomainError::InvalidStateTransition` |
| `Pending` | `RetryPending` | `TraceHandoffRecord::mark_retry(HandoffRetryReason reason, Timestamp next_retry_at)` | handoff transient failure 且 retry allowed | 保存 retry marker | `DomainError::InvalidStateTransition` |
| `RetryPending` | `RetryPending` | `mark_retry(...)` | retry 仍未超限 | 更新 retry marker | `DomainError::RetryLimitExceeded` |
| `Pending` / `RetryPending` | `Failed` | `TraceHandoffRecord::mark_failed(HandoffFailureReason reason, ActorRef actor)` | permanent failure 或 retry exhausted | 保存 failed evidence | `DomainError::InvalidStateTransition` |
| `Pending` / `RetryPending` | `Cancelled` | `TraceHandoffRecord::cancel(ActorRef actor, HandoffCancelReason reason)` | actor 可取消且未完成 | 保存 cancel evidence | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: trace handoff

| 非法转换 | 处理 |
|---|---|
| `HandedOff` -> `RetryPending` / `Failed` / `Cancelled` | 返回 `DomainError::InvalidStateTransition`,不得覆盖成功交接证据 |
| `Failed` -> `HandedOff` | 返回 `DomainError::InvalidStateTransition`;需要新 handoff retry record 或 manual resolution |
| `Cancelled` -> `Pending` | 返回 `DomainError::InvalidStateTransition`;必须创建新 handoff intent |
| observability 反写 fact truth | 返回 `DomainError::BoundaryViolation` |

### 6.11 Archive handoff 状态机

#### 状态集合表: `ArchiveHandoffState`

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 等待归档交接 | 否 | deliver、mark retry、mark failed、cancel |
| `Archived` | 已完成归档并持有 package ref | 是 | read archive package ref |
| `RetryPending` | 归档失败但可重试 | 否 | deliver retry、mark failed、cancel |
| `Failed` | 归档失败且需处理 | 是 | operations review |
| `Cancelled` | 归档意图被取消 | 是 | read audit |

#### 状态转换图: `ArchiveHandoffState`

```text
<Pending>
  | mark_archived(archive_package_ref, archived_at)
  v
<Archived>

<Pending>
  | mark_retry(reason, next_retry_at)
  v
<RetryPending>
  | mark_archived(archive_package_ref, archived_at)
  v
<Archived>

<RetryPending>
  | retry exhausted
  v
<Failed>

<Pending> or <RetryPending>
  | cancel
  v
<Cancelled>
```

#### 转换矩阵: `ArchiveHandoffState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 初始 | `Pending` | `ArchiveHandoffRecord::from_trace_context(...)` / `from_space_close(...)` | trace context、archive scope、retention policy 有效 | 保存 archive handoff intent,outbox | `DomainError::InvalidInitialState` |
| `Pending` / `RetryPending` | `Archived` | `ArchiveHandoffRecord::mark_archived(ArchivePackageRef archive_package_ref, Timestamp archived_at)` | `ArchiveHandoffPort.deliver_archive_handoff(...)` 成功 | 保存 package ref,清空 retry marker | `DomainError::InvalidStateTransition` |
| `Pending` | `RetryPending` | `ArchiveHandoffRecord::mark_retry(HandoffRetryReason reason, Timestamp next_retry_at)` | archive transient failure 且 retry allowed | 保存 retry marker | `DomainError::InvalidStateTransition` |
| `RetryPending` | `RetryPending` | `mark_retry(...)` | retry 仍未超限 | 更新 retry marker | `DomainError::RetryLimitExceeded` |
| `Pending` / `RetryPending` | `Failed` | `ArchiveHandoffRecord::mark_failed(HandoffFailureReason reason, ActorRef actor)` | permanent failure 或 retry exhausted | 保存 failed evidence | `DomainError::InvalidStateTransition` |
| `Pending` / `RetryPending` | `Cancelled` | archive cancel path | actor 可取消且未完成 | 保存 cancel evidence | `DomainError::InvalidStateTransition` |

#### 非法转换处理表: archive handoff

| 非法转换 | 处理 |
|---|---|
| `Archived` -> `RetryPending` / `Failed` / `Cancelled` | 返回 `DomainError::InvalidStateTransition`,不得覆盖 archive package ref |
| `Failed` -> `Archived` | 返回 `DomainError::InvalidStateTransition`;需要新 archive handoff record 或 manual resolution |
| `Cancelled` -> `Pending` | 返回 `DomainError::InvalidStateTransition`;必须创建新 archive handoff intent |
| archive adapter 返回 package body 而非 ref | 返回 `HandoffError::InvalidArchivePackage`,不得保存 archive body |

### 6.12 非状态 enum 排除表

| Enum | 为什么不是状态机 | 仍需遵守的规则 |
|---|---|---|
| `ConversationOutboxEventKind` | 表达 outbox event 路由类别,不会随生命周期变化 | 必须与 `ConversationTruthRefKind` 匹配,不匹配时 publish flow 返回错误 |
| `ConversationTruthRefKind` | 表达 truth ref 类型分类,不是对象生命周期 | 必须用于 outbox publish 校验,不得指向派生 projection |
| `ConversationSpaceKind` / `ConversationFactKind` 等分类值 | 表达对象类别,不是状态流转 | 只能影响策略选择,不能当作生命周期 |

## 7. 回填草稿

> 本节不重复粘贴 §6 的完整矩阵。正式 `03-详细设计.md` 生成 §9 时,应从本文件 §6 摘录并压缩。

正式文档 §9 建议采用以下结构:

```text
## 9. 状态机与转换矩阵

### 9.1 状态机总表
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.1

### 9.2 全局状态传播图
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.2

### 9.3 Conversation truth 与 space lifecycle
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.3

### 9.4 Scope 状态机
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.4

### 9.5 Fact 与 append receipt 状态机
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.5

### 9.6 Manifestation 与 reference resolution 状态机
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.6

### 9.7 Projection / cursor / outbox 状态机
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.7 与 §6.8

### 9.8 Trace / handoff 状态机
引用: design-calibration/03_ddd_step_10_state_matrix.md §6.9 ~ §6.11

### 9.9 非法转换统一处理
引用: design-calibration/03_ddd_step_10_state_matrix.md 各节非法转换表
```

正式回填时必须保留:

| 正式章节 | 必须保留内容 |
|---|---|
| §9.1 | 14 组状态机总表和非状态 enum 排除规则 |
| §9.2 | truth -> outbox / projection / query marker 的单向传播图 |
| §9.3 ~ §9.8 | 每组状态集合、ASCII 状态图、转换矩阵和非法转换处理 |
| §9.9 | `InvalidStateTransition`、`BoundaryViolation`、`CursorNotResumable`、`SourceTruthViolation` 等错误口径 |

## 8. 待确认事项

本步无阻塞性待确认事项。以下是后续 Step 需要继续承接的事项:

| 事项 | 当前口径 | 后续承接 |
|---|---|---|
| 具体错误 enum 命名 | 本步给出语义型错误名,实现时可在 Step 12 错误模型中最终落 enum | Step 12 |
| retry limit / next retry 计算 | 本步只定义 retry state 迁移,不定义具体退避配置 | Step 13 / Step 14 |
| projection disabled 来源 | 本步允许 disabled 状态,具体由配置或运维能力声明决定 | Step 14 |
| trace retention 过期策略 | 本步定义 `Expired` 终态,具体 retention window 来自配置设计 | Step 14 |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 状态集合与 Step 6 enum 一致 | 通过 | 所有正式状态名均来自 `03_ddd_step_06_object_contracts.md` |
| 触发函数可回指 Step 6 / Step 9 | 通过 | 矩阵使用对象成员函数、工厂函数或处理流名称 |
| 每组状态机都有 ASCII 图 | 通过 | §6.2 ~ §6.11 均有 `text` 图 |
| 非法转换错误明确 | 通过 | 每组状态机均有非法转换处理表 |
| 区分 truth、projection、outbox、handoff | 通过 | 全局传播图和各组矩阵明确单向边界 |
| 可进入 Step 11 持久化、事务与一致性契约 | 通过 | 下一步可基于状态变更和处理流定义 repository、事务和一致性规则 |
