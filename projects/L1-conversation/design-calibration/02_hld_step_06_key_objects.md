# Step 6. 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

从 Step 5 已形成的对象候选池中完成对象正式化筛选,把 `L1-conversation` 后续详细设计必须承接的关键对象逐一独立展开。

本步只写概要设计层对象骨架:对象责任、归属、关键字段类型、状态集合、成员函数骨架、工厂函数骨架和禁止事项。本步不写完整 Rust struct / enum、返回类型、trait、repository 函数、DTO schema、数据库列或实现代码。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体框架、业务组成部分和实现分层区别 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 8 个主要组成部分、对象发现维度表和 Step 6 候选池 |
| `00-需求文档.md` | 已重建 | 提供 Conversation truth、授权视野、跨域显化和追溯需求边界 |
| `01-架构设计.md` | 已重建 | 提供 Conversation 真相核心、支撑上下文、数据所有权和跨仓依赖方向 |

---

## 3. SOP 问题回答

### 3.1 哪些对象如果不在概要设计层点名，详细设计会重新发明主语？

以下对象必须在概要设计层点名:

- truth / state 对象:Conversation truth、对话空间、参与范围、可见范围、对话事实、跨域显化记录、投影状态和外部引用解析状态。
- policy / guard 对象:truth 归属、可见性、事实追加、显化、引用有效性、派生只读和追溯保留规则。
- projection / read model 对象:授权读取视图、变化游标、搜索索引投影、变化游标投影和外部引用投影。
- reference / snapshot 对象:事实来源引用、外部正式事实引用和外部事实展示快照。
- audit / history / handoff 对象:范围变化记录、事实追加回执、outbox 记录、追溯上下文、复盘锚点、观测交接记录和归档交接记录。

这些对象共同支撑 Step 8 处理流和 Step 9 状态机。如果本步不收稳,后续会在详细设计中重新发明对象边界,并容易把外部仓 truth、派生视图或协议 DTO 混入 Conversation truth。

### 3.2 哪些候选对象正式进入本步独立展开？

本步正式展开 Step 5 标记为 `Step 6 独立成节` 的 30 个对象。它们全部可能成为 struct、enum、value object、projection、policy、audit record、history record 或 outbox record。

### 3.3 哪些候选名称不作为关键对象展开？

| 名称类型 | 示例 | 本步处理 |
|---|---|---|
| Application service | `ConversationFactAppendService`、`ConversationManifestationService` | 留到 Step 7 / Step 8 定义 API / 用例编排骨架 |
| Repository / store | `ConversationTruthRepository`、`ConversationProjectionRepository` | 留给 Step 7 / 详细设计定义 port / persistence contract |
| External port | `ActorReferencePort`、`TraceHandoffPort`、`ArchiveHandoffPort` | 留到 Step 7 定义接口轮廓 |
| Operations job | `ProjectionRebuildJob`、`ExternalSnapshotRefreshJob` | 留到 Step 7 / Step 8 定义 job input / flow 轮廓 |
| 普通字段类型 | actor ref、project ref、work context ref、consumer scope ref | 只作为字段类型或接口输入出现,不独立成领域对象 |
| 临时实现结构 | cache entry、batch item、handler local context | 留给详细设计或实现,不得在概要设计层升级为对象主语 |

---

## 4. 对象候选池筛选说明

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `ConversationTruthState` | Truth / State | 正式关键对象 | 表达 Conversation truth 是否可写、可读、受限或待交接 |
| `ConversationSpace` | Truth / State | 正式关键对象 | 表达对话空间归属、类型和生命周期 |
| `ParticipantScope` | Truth / State | 正式关键对象 | 表达哪些 actor 被纳入参与范围 |
| `VisibilityScope` | Truth / State | 正式关键对象 | 表达事实对哪些消费方可见 |
| `ConversationFact` | Truth / State | 正式关键对象 | 表达已追加的对话事实 |
| `CrossDomainManifestation` | Truth / State | 正式关键对象 | 表达外部正式事实在对话中的显化记录 |
| `ConversationProjectionState` | Truth / State | 正式关键对象 | 表达 read model、index、cursor 等派生状态 |
| `ReferenceResolutionState` | Truth / State | 正式关键对象 | 表达外部引用是否 fresh、stale、pending、invalid 或 unresolved |
| `ConversationTruthPolicy` | Policy / Invariant | 正式关键对象 | 保护本仓 truth 归属、正文排除和派生不反写 |
| `VisibilityPolicy` | Policy / Invariant | 正式关键对象 | 统一写入、读取、显化和派生读取的可见性判断 |
| `FactAppendPolicy` | Policy / Invariant | 正式关键对象 | 判断输入是否可追加为正式对话事实 |
| `ManifestationPolicy` | Policy / Invariant | 正式关键对象 | 判断外部正式事实是否可显化到对话 |
| `ReferenceValidityPolicy` | Policy / Invariant | 正式关键对象 | 判断引用可解析、可展示、可追溯或必须降级 |
| `DerivedViewPolicy` | Policy / Invariant | 正式关键对象 | 保护派生只读、可重建和不反写真相 |
| `TraceRetentionPolicy` | Policy / Invariant | 正式关键对象 | 约束追溯材料保留、交接和正文排除 |
| `ConversationReadModel` | Projection / Read model | 正式关键对象 | 表达授权消费所需的对话读取视图 |
| `ConversationChangeCursor` | Projection / Read model | 正式关键对象 | 表达变化感知、订阅或增量读取游标 |
| `SearchIndexProjection` | Projection / Read model | 正式关键对象 | 支撑长历史检索和定位 |
| `ChangeCursorProjection` | Projection / Read model | 正式关键对象 | 支撑变化感知投影和订阅游标维护 |
| `ExternalReferenceProjection` | Projection / Read model | 正式关键对象 | 聚合外部引用、展示摘要和解析状态 |
| `FactSourceRef` | Reference / Boundary | 正式关键对象 | 记录事实来源 actor、runtime、bridge、system 或 source event 引用 |
| `ExternalFactRef` | Reference / Boundary | 正式关键对象 | 指向来源仓正式事实 |
| `ExternalFactSnapshot` | Reference / Boundary | 正式关键对象 | 保存降级展示或历史阅读需要的来源摘要 |
| `ScopeChangeRecord` | Audit / History | 正式关键对象 | 记录 space、participant scope 或 visibility scope 正式变化 |
| `FactAppendReceipt` | Audit / History | 正式关键对象 | 表达追加结果、拒绝原因或幂等命中 |
| `ConversationOutboxRecord` | Audit / History | 正式关键对象 | 表达已成立 truth 的传播、交接或重试意图 |
| `ConversationTraceContext` | Audit / History | 正式关键对象 | 表达对话域内追溯上下文 |
| `ReviewAnchor` | Audit / History | 正式关键对象 | 标识复盘或责任边界定位点 |
| `TraceHandoffRecord` | Audit / History | 正式关键对象 | 表达对 observability 的交接意图和状态 |
| `ArchiveHandoffRecord` | Audit / History | 正式关键对象 | 表达对 archive 的交接意图和状态 |

---

## 5. 关键对象分布说明

| 主要组成部分 | 正式关键对象 |
|---|---|
| `Conversation truth core` | `ConversationTruthState`、`ConversationTruthPolicy`、`ConversationOutboxRecord` |
| `Space / scope management` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`VisibilityPolicy`、`ScopeChangeRecord` |
| `Collaborative fact append` | `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt` |
| `Authorized consumption` | `ConversationReadModel`、`ConversationChangeCursor`、`VisibilityPolicy` |
| `Cross-domain manifestation` | `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy` |
| `History trace / review` | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` |
| `Derived consumption support` | `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`DerivedViewPolicy` |
| `Local reference / snapshot / projection support` | `ReferenceResolutionState`、`ExternalReferenceProjection`、`ExternalFactSnapshot`、`ReferenceValidityPolicy` |

说明:

- `VisibilityPolicy` 同时服务 Space / scope management 和 Authorized consumption,但主归属是 Space / scope management。
- `ReferenceValidityPolicy` 同时服务 Cross-domain manifestation 和 Local reference / snapshot / projection support,但主归属是 Local reference / snapshot / projection support。
- `ExternalFactSnapshot` 同时服务 Cross-domain manifestation、Authorized consumption 和 History trace / review,但主归属是 Cross-domain manifestation。

---

## 6. Conversation truth core 对象

### 6.1 `ConversationTruthState`

#### 6.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Conversation truth core` |
| 对象类型 | state enum |
| 主要责任 | 表达 Conversation truth 当前是否允许写入、读取、交接或需要受限处理 |

#### 6.1.2 状态集合

| 状态 | 作用 |
|---|---|
| `Open` | 对话空间 truth 已成立,允许按 scope / policy 追加事实和读取 |
| `ReadOnly` | 对话空间停止新增事实,但允许授权读取、追溯和交接 |
| `Restricted` | 对话空间因可见性、治理或来源异常进入受限读取 / 写入状态 |
| `HandoffPending` | 已成立 truth 存在观测、归档或外部传播交接待处理 |
| `Closed` | 对话空间正式关闭,只允许受控追溯和必要交接 |

#### 6.1.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows_append(ConversationSpace space, ActorRef actor_ref)` | 判断当前 truth 状态是否允许该 actor 发起事实追加 |
| `allows_read(VisibilityScope visibility_scope, ConsumerRef consumer_ref)` | 判断当前 truth 状态是否允许在可见范围内读取 |
| `requires_handoff()` | 判断是否存在必须由 outbox / handoff 承接的待交接状态 |
| `is_terminal()` | 判断状态是否已经终止,用于阻止后续写入流程 |

#### 6.1.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open_for_space(ConversationSpaceId space_id, ActorRef actor_ref)` | 在对话空间创建完成后形成初始可写 truth 状态 |
| `restricted(ConversationSpaceId space_id, RestrictionReason reason)` | 因边界、可见性或治理原因形成受限状态 |

#### 6.1.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 projection stale 当成 truth 关闭 | 派生失败不能反向改变 Conversation truth 状态 |
| 把 outbox 发布成功作为 truth 成立前置 | outbox 是已成立 truth 的传播意图,不是 truth 成立条件 |
| 在状态枚举中携带外部正文 | 状态只表达本仓 truth 口径,不能保存外部 payload |

### 6.2 `ConversationTruthPolicy`

#### 6.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Conversation truth core` |
| 对象类型 | policy / guard |
| 主要责任 | 保护 Conversation truth 归属、正文排除、派生不反写和跨仓边界成立 |

#### 6.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `ownership_rules` | `ConversationOwnershipRuleSet` | 约束哪些对象属于本仓 truth,哪些只能作为外部引用 |
| `body_exclusion_rules` | `BodyExclusionRuleSet` | 防止 runtime、bridge、artifact、governance 等外部正文进入本仓 truth |
| `derived_write_rules` | `DerivedWriteRuleSet` | 约束 projection、index、cursor、snapshot 不得反写真相 |
| `handoff_rules` | `ConversationHandoffRuleSet` | 约束 outbox、trace handoff 和 archive handoff 与 truth 的关系 |

#### 6.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_truth_owner(ConversationFact fact, ConversationSpace space)` | 校验事实归属本仓对话空间 |
| `assert_external_body_excluded(ExternalFactSnapshot snapshot)` | 校验外部快照只包含可展示摘要和引用,不含来源正文 |
| `assert_projection_read_only(ConversationProjectionState projection_state)` | 校验派生对象只能读、刷新或重建,不得生成业务 truth |
| `assert_handoff_after_commit(ConversationOutboxRecord outbox_record)` | 校验传播 / 交接意图只来自已成立 truth |

#### 6.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造本仓默认 truth policy |
| `from_boundary_rules(ConversationBoundaryRuleSet boundary_rules)` | 从上游边界规则形成 truth policy |

#### 6.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 在 policy 中调用外部系统 | policy 只做本地判断,外部读取通过 port / service 编排 |
| 把来源仓引用解析结果写成来源 truth | 本仓只能记录引用、快照或显化记录 |
| 把详细配置项写入概要对象 | 具体配置字段留到配置设计和详细设计 |

### 6.3 `ConversationOutboxRecord`

#### 6.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Conversation truth core` |
| 对象类型 | outbox record |
| 主要责任 | 表达已成立 Conversation truth 需要传播、交接、重试或保留发布证据的意图 |

#### 6.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbox_record_id` | `ConversationOutboxRecordId` | 标识 outbox 记录 |
| `space_id` | `ConversationSpaceId` | 标识该传播意图所属对话空间 |
| `truth_ref` | `ConversationTruthRef` | 指向已提交的事实、显化、scope change 或 handoff truth |
| `event_kind` | `ConversationOutboxEventKind` | 表达需要传播的事件类别 |
| `payload_ref` | `ConversationOutboxPayloadRef` | 指向可发布的脱敏 payload 引用 |
| `publication_state` | `ConversationOutboxPublicationState` | 表达 pending、published、retry 或 failed |

#### 6.3.3 状态集合

| 状态 | 作用 |
|---|---|
| `Pending` | truth 已提交,等待发布或交接 |
| `Published` | 已完成发布或交接标记 |
| `RetryPending` | 上次发布失败,等待重试 |
| `Failed` | 达到失败门槛,需要人工或运维处理 |
| `Suppressed` | 因可见性或边界规则不应发布,仅保留内部证据 |

#### 6.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_published(PublishedEventRef published_ref, Timestamp published_at)` | 标记发布完成并保留发布引用 |
| `mark_retry(RetryReason retry_reason, Timestamp next_retry_at)` | 标记发布失败后的重试意图 |
| `mark_failed(OutboxFailureReason failure_reason, ActorRef actor_ref)` | 标记发布失败且需要人工处理 |
| `can_publish(VisibilityScope visibility_scope)` | 判断当前 outbox payload 是否允许发布 |

#### 6.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_fact_append(ConversationFact fact, FactAppendReceipt receipt)` | 从已追加事实形成 outbox 记录 |
| `from_manifestation(CrossDomainManifestation manifestation)` | 从已提交显化记录形成 outbox 记录 |
| `from_scope_change(ScopeChangeRecord scope_change_record)` | 从范围变化记录形成 outbox 记录 |

#### 6.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 让 outbox 记录决定 truth 是否成立 | outbox 只能在 truth 成立后产生 |
| 在 outbox payload 中携带外部正文 | outbox 只能携带 ref、状态、摘要和 marker |
| 发布失败时回滚核心 truth | 发布是异步传播动作,不能反向取消已提交事实 |

---

## 7. Space / scope management 对象

### 7.1 `ConversationSpace`

#### 7.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Space / scope management` |
| 对象类型 | domain aggregate |
| 主要责任 | 表达对话空间的归属、类型、生命周期和默认边界 |

#### 7.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `space_id` | `ConversationSpaceId` | 标识对话空间 |
| `space_kind` | `ConversationSpaceKind` | 区分项目对话、个人对话、系统对话或跨域显化对话 |
| `owner_ref` | `ConversationOwnerRef` | 指向 workspace、project、work item 或 system owner |
| `lifecycle_state` | `ConversationSpaceLifecycleState` | 表达空间是否 active、read-only、closed 或 archived |
| `default_visibility_scope_id` | `VisibilityScopeId` | 指向默认可见范围 |
| `created_by` | `ActorRef` | 记录创建该空间的 actor 引用 |

#### 7.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Active` | 允许在 scope / policy 内追加事实和读取 |
| `ReadOnly` | 不再接受新事实,但允许读取和追溯 |
| `Closed` | 对话空间关闭,只允许受控交接和审计 |
| `Archived` | 对话空间已交由归档视角承接,本仓只保留引用和必要索引 |

#### 7.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `can_accept_fact(ActorRef actor_ref, ParticipantScope participant_scope)` | 判断 actor 是否能在该空间追加事实 |
| `close(ActorRef actor_ref, SpaceCloseReason reason)` | 将空间转为关闭状态 |
| `archive(ActorRef actor_ref, ArchiveIntentRef archive_intent_ref)` | 标记空间进入归档承接 |
| `assert_owner_matches(ConversationOwnerRef owner_ref)` | 校验请求 owner 与空间 owner 一致 |

#### 7.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_project_space(ConversationOwnerRef owner_ref, ActorRef actor_ref)` | 创建项目或工作上下文内的对话空间 |
| `create_personal_space(ConversationOwnerRef owner_ref, ActorRef actor_ref)` | 创建个人视野或私有对话空间 |
| `create_system_space(ConversationOwnerRef owner_ref, SystemActorRef system_actor_ref)` | 创建系统触发的对话空间 |

#### 7.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 拥有 project / workspace 生命周期 | 空间只引用 owner,不创建或关闭项目 |
| 保存 Chat UI 状态 | 已读、折叠、草稿等属于下游 UI |
| 绕过 participant / visibility scope | 空间存在不等于所有 actor 都可见或可写 |

### 7.2 `ParticipantScope`

#### 7.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Space / scope management` |
| 对象类型 | domain entity |
| 主要责任 | 表达对话空间内哪些 actor 被纳入参与范围以及参与能力 |

#### 7.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `participant_scope_id` | `ParticipantScopeId` | 标识参与范围 |
| `space_id` | `ConversationSpaceId` | 标识所属对话空间 |
| `participants` | `Vec<ConversationParticipantRef>` | 记录参与者引用和参与角色 |
| `scope_version` | `ScopeVersion` | 支撑范围变更并发和追溯 |
| `scope_state` | `ParticipantScopeState` | 表达 active、restricted 或 closed |

#### 7.2.3 状态集合

| 状态 | 作用 |
|---|---|
| `Active` | 参与范围有效,可用于事实追加和授权读取 |
| `Restricted` | 参与范围受限,需要额外 visibility / governance 判断 |
| `Closed` | 参与范围关闭,只用于历史追溯 |

#### 7.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `contains_actor(ActorRef actor_ref)` | 判断 actor 是否在参与范围内 |
| `add_participant(ConversationParticipantRef participant_ref, ActorRef actor_ref)` | 在受控情况下加入参与者 |
| `remove_participant(ConversationParticipantRef participant_ref, ActorRef actor_ref)` | 在受控情况下移除参与者 |
| `participant_role(ActorRef actor_ref)` | 查询 actor 在该对话中的参与角色 |

#### 7.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_initial_participants(ConversationSpaceId space_id, Vec<ConversationParticipantRef> participants)` | 从初始参与者集合创建参与范围 |
| `restricted_from_scope(ParticipantScope participant_scope, RestrictionReason reason)` | 从现有范围派生受限参与范围 |

#### 7.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 创建或退休 Identity member | 参与范围只引用 identity / actor,不拥有成员生命周期 |
| 替代全局授权系统 | 本对象只表达对话内参与边界 |
| 把外部群组成员列表复制为永久 truth | 外部 membership 只能通过引用或快照进入 |

### 7.3 `VisibilityScope`

#### 7.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Space / scope management` |
| 对象类型 | domain entity |
| 主要责任 | 表达对话事实、显化记录和读取输出对哪些 consumer 可见 |

#### 7.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `visibility_scope_id` | `VisibilityScopeId` | 标识可见范围 |
| `space_id` | `ConversationSpaceId` | 标识所属对话空间 |
| `visibility_rules` | `VisibilityRuleSet` | 记录事实、显化和读取输出的可见规则 |
| `default_visibility` | `VisibilityLevel` | 表达默认可见级别 |
| `scope_version` | `ScopeVersion` | 支撑可见范围变更并发和追溯 |
| `scope_state` | `VisibilityScopeState` | 表达 open、restricted 或 sealed |

#### 7.3.3 状态集合

| 状态 | 作用 |
|---|---|
| `Open` | 按默认规则和参与范围授权读取 |
| `Restricted` | 需要额外规则判断或治理结果才能读取 |
| `Sealed` | 历史可追溯但不允许新增可见性扩展 |

#### 7.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `can_read(ConsumerRef consumer_ref, ConversationFact fact)` | 判断 consumer 是否可读取某个事实 |
| `can_manifest(ActorRef actor_ref, ExternalFactRef external_fact_ref)` | 判断 actor 是否可显化外部事实 |
| `narrow_to(VisibilityRuleSet visibility_rules, ActorRef actor_ref)` | 收窄可见范围并形成新版本 |
| `includes_scope(VisibilityScopeId visibility_scope_id)` | 判断是否包含某个下级可见范围 |

#### 7.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_participant_scope(ParticipantScope participant_scope, VisibilityLevel default_visibility)` | 基于参与范围创建默认可见范围 |
| `restricted(ConversationSpaceId space_id, VisibilityRestrictionReason reason)` | 创建受限可见范围 |

#### 7.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把可见范围当成认证结果 | 认证和全局授权来自外部安全 / identity 边界 |
| 在可见范围中保存外部正文 | 可见范围只保存规则和引用 |
| 让 read model 绕过可见范围 | 所有授权消费必须经过本对象或 `VisibilityPolicy` |

### 7.4 `VisibilityPolicy`

#### 7.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Space / scope management` |
| 对象类型 | policy / guard |
| 主要责任 | 统一判断写入、读取、显化、追溯和派生输出是否满足可见范围 |

#### 7.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `read_rules` | `VisibilityReadRuleSet` | 约束授权读取和订阅输出 |
| `append_rules` | `VisibilityAppendRuleSet` | 约束事实追加时的可见范围选择 |
| `manifestation_rules` | `VisibilityManifestationRuleSet` | 约束外部事实显化后的可见性 |
| `review_rules` | `VisibilityReviewRuleSet` | 约束复盘和追溯读取边界 |

#### 7.4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_can_append(ActorRef actor_ref, ConversationFact fact, VisibilityScope visibility_scope)` | 校验事实追加是否满足可见规则 |
| `assert_can_read(ConsumerRef consumer_ref, ConversationFact fact, VisibilityScope visibility_scope)` | 校验读取是否满足可见规则 |
| `filter_read_model(ConversationReadModel read_model, ConsumerRef consumer_ref)` | 对 read model 做可见性裁剪 |
| `assert_review_allowed(ReviewAnchor review_anchor, ActorRef actor_ref)` | 校验复盘锚点是否可被 actor 读取 |

#### 7.4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造默认可见性策略 |
| `from_scope_rules(VisibilityRuleSet visibility_rules)` | 从可见范围规则构造 policy |

#### 7.4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 替代 identity / governance 最终裁决 | 本 policy 只在本仓边界内应用可见性约束 |
| 在 policy 中保存完整 participant 快照 | 参与者集合由 `ParticipantScope` 承载 |
| 让下游 UI 自行重建可见性 | 本仓输出必须已经完成授权裁剪 |

### 7.5 `ScopeChangeRecord`

#### 7.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Space / scope management` |
| 对象类型 | history record |
| 主要责任 | 记录 space、participant scope 或 visibility scope 的正式变化和追溯依据 |

#### 7.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `scope_change_id` | `ScopeChangeRecordId` | 标识范围变化记录 |
| `space_id` | `ConversationSpaceId` | 标识变化所属对话空间 |
| `scope_kind` | `ScopeKind` | 区分 space、participant scope 或 visibility scope |
| `previous_scope_ref` | `ScopeSnapshotRef` | 指向变化前范围快照 |
| `new_scope_ref` | `ScopeSnapshotRef` | 指向变化后范围快照 |
| `changed_by` | `ActorRef` | 记录发起变化的 actor |
| `change_reason` | `ScopeChangeReason` | 表达变化原因 |

#### 7.5.3 状态集合

| 状态 | 作用 |
|---|---|
| `Applied` | 范围变化已正式生效 |
| `Superseded` | 范围变化被后续变更覆盖,仅用于追溯 |
| `Rejected` | 范围变化被拒绝,保留拒绝依据 |

#### 7.5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `relates_to_space(ConversationSpaceId space_id)` | 判断记录是否属于指定对话空间 |
| `mark_superseded(ScopeChangeRecordId successor_id)` | 标记被后续范围变化覆盖 |
| `visible_to(VisibilityScope visibility_scope, ConsumerRef consumer_ref)` | 判断该变化记录是否可被读取 |

#### 7.5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_space_change(ConversationSpace previous_space, ConversationSpace new_space, ActorRef actor_ref)` | 从空间变化形成 history record |
| `from_participant_scope_change(ParticipantScope previous_scope, ParticipantScope new_scope, ActorRef actor_ref)` | 从参与范围变化形成 history record |
| `from_visibility_scope_change(VisibilityScope previous_scope, VisibilityScope new_scope, ActorRef actor_ref)` | 从可见范围变化形成 history record |

#### 7.5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 history record 替代当前 scope truth | 当前范围由正式 scope 对象表达 |
| 保存完整外部成员正文 | 只能保存 scope snapshot ref 和 actor ref |
| 允许下游修改 history | history record 只能追加或标记 superseded,不能被下游反写 |

---

## 8. Collaborative fact append 对象

### 8.1 `ConversationFact`

#### 8.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Collaborative fact append` |
| 对象类型 | domain entity / history object |
| 主要责任 | 表达已经被追加到对话空间内的正式对话事实 |

#### 8.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `fact_id` | `ConversationFactId` | 标识对话事实 |
| `space_id` | `ConversationSpaceId` | 标识事实所属对话空间 |
| `fact_kind` | `ConversationFactKind` | 区分 human、AI member、system、manifestation 或 bridge mapped fact |
| `source_ref` | `FactSourceRef` | 指向事实来源 |
| `visibility_scope_id` | `VisibilityScopeId` | 指向该事实的可见范围 |
| `payload_ref` | `ConversationFactPayloadRef` | 指向本仓允许保存或引用的事实内容载体 |
| `append_sequence` | `ConversationFactSequence` | 表达事实追加顺序 |
| `fact_state` | `ConversationFactState` | 表达 accepted、restricted、retracted 等状态 |

#### 8.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Accepted` | 事实已正式追加并可按可见范围读取 |
| `VisibilityRestricted` | 事实成立,但读取必须受更严格可见范围约束 |
| `Retracted` | 事实被正式撤回或废止,保留追溯记录 |
| `Quarantined` | 事实因安全、边界或来源问题暂时隔离 |

#### 8.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_visibility(VisibilityScope visibility_scope)` | 将事实绑定到可见范围 |
| `restrict_visibility(VisibilityRestrictionReason reason, ActorRef actor_ref)` | 将事实标记为可见性受限 |
| `retract(ActorRef actor_ref, FactRetractionReason reason)` | 正式撤回事实并保留追溯依据 |
| `is_visible_to(ConsumerRef consumer_ref, VisibilityPolicy visibility_policy)` | 判断事实是否可被 consumer 读取 |

#### 8.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_append_input(ConversationSpace space, FactSourceRef source_ref, VisibilityScope visibility_scope)` | 从追加输入形成正式事实骨架 |
| `from_manifestation(CrossDomainManifestation manifestation, VisibilityScope visibility_scope)` | 从跨域显化记录形成可读对话事实 |
| `system_fact(ConversationSpaceId space_id, SystemActorRef system_actor_ref, SystemFactRef system_fact_ref)` | 从系统结果性事实形成对话事实 |

#### 8.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 runtime 推理过程 | Conversation fact 只能保存结果性事实或引用 |
| 保存 bridge 外部消息正文 | 外部消息正文由 bridges 拥有,本仓只能保存引用或安全摘要 |
| 用事实状态表达 UI 已读 / 折叠 | UI 状态属于下游 Chat / Workspace |

### 8.2 `FactSourceRef`

#### 8.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Collaborative fact append` |
| 对象类型 | reference object |
| 主要责任 | 记录对话事实来自 actor、runtime、bridge、system 或 source event 的可追溯引用 |

#### 8.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref_id` | `FactSourceRefId` | 标识事实来源引用 |
| `source_kind` | `FactSourceKind` | 区分 human actor、AI member、runtime result、bridge mapped event、system |
| `actor_ref` | `ActorRef` | 记录产生或代表事实的 actor 引用 |
| `runtime_result_ref` | `RuntimeResultRef` | 指向 runtime 结果性输出,不含推理过程 |
| `bridge_source_ref` | `BridgeSourceRef` | 指向外部平台消息或事件映射来源 |
| `source_event_ref` | `SourceEventRef` | 指向触发事实追加的入站事件 |

#### 8.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_result_only()` | 校验来源引用不包含推理过程或原始调用正文 |
| `matches_actor(ActorRef actor_ref)` | 判断来源是否对应指定 actor |
| `source_family()` | 返回来源所属家族,用于 policy 和追溯分类 |

#### 8.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_actor(ActorRef actor_ref)` | 从人类或 AI member actor 形成来源引用 |
| `from_runtime_result(RuntimeResultRef runtime_result_ref, ActorRef actor_ref)` | 从 runtime 结果性输出形成来源引用 |
| `from_bridge_mapping(BridgeSourceRef bridge_source_ref, ActorRef actor_ref)` | 从 bridges 映射结果形成来源引用 |
| `from_system(SystemActorRef system_actor_ref, SourceEventRef source_event_ref)` | 从系统触发事件形成来源引用 |

#### 8.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 chain-of-thought | 只能引用 runtime 结果性输出 |
| 保存外部平台 message body | 外部正文由 bridges 管理 |
| 混淆 actor ref 与 identity truth | 本对象只引用 actor,不维护 member 生命周期 |

### 8.3 `FactAppendPolicy`

#### 8.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Collaborative fact append` |
| 对象类型 | policy / guard |
| 主要责任 | 判断输入是否可以追加为正式 Conversation fact |

#### 8.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `allowed_fact_kinds` | `FactKindRuleSet` | 约束哪些事实类型可追加 |
| `source_rules` | `FactSourceRuleSet` | 约束来源引用必须可追溯且不含禁止正文 |
| `scope_rules` | `FactScopeRuleSet` | 约束事实必须归属于已成立 space / scope |
| `idempotency_rules` | `FactAppendIdempotencyRuleSet` | 约束重复追加和幂等命中处理 |

#### 8.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_append_allowed(ConversationSpace space, ParticipantScope participant_scope, VisibilityScope visibility_scope)` | 校验空间、参与范围和可见范围允许追加 |
| `assert_source_allowed(FactSourceRef source_ref)` | 校验事实来源可接受 |
| `assert_fact_kind_allowed(ConversationFactKind fact_kind)` | 校验事实类型可追加 |
| `detect_duplicate(IdempotencyKey idempotency_key, FactSourceRef source_ref)` | 判断是否为重复追加 |

#### 8.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造默认事实追加策略 |
| `for_space(ConversationSpace space, VisibilityScope visibility_scope)` | 为指定空间和可见范围构造追加策略 |

#### 8.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 在 policy 中写事实 | policy 只判断,写入由 application service 编排 |
| 接受不可追溯来源 | 所有正式事实必须能回链到来源引用 |
| 允许派生维护任务生成业务事实 | projection / rebuild 不能追加业务事实 |

### 8.4 `FactAppendReceipt`

#### 8.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Collaborative fact append` |
| 对象类型 | audit record |
| 主要责任 | 表达事实追加的结果、拒绝原因、幂等命中和追溯引用 |

#### 8.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `append_receipt_id` | `FactAppendReceiptId` | 标识追加回执 |
| `space_id` | `ConversationSpaceId` | 标识追加所属对话空间 |
| `fact_id` | `ConversationFactId` | 指向成功追加或幂等命中的事实 |
| `append_result` | `FactAppendResult` | 表达 accepted、duplicate 或 rejected |
| `idempotency_key` | `IdempotencyKey` | 记录追加幂等键 |
| `rejection_reason` | `FactAppendRejectionReason` | 记录拒绝原因 |
| `recorded_at` | `Timestamp` | 记录回执形成时间 |

#### 8.4.3 状态集合

| 状态 | 作用 |
|---|---|
| `Accepted` | 事实已成功追加 |
| `Duplicate` | 请求命中已有追加结果 |
| `Rejected` | 请求因边界、来源、可见性或幂等冲突被拒绝 |

#### 8.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_success()` | 判断追加是否成功或幂等成功 |
| `is_duplicate()` | 判断追加是否命中幂等结果 |
| `has_rejection_reason(FactAppendRejectionReason reason)` | 判断回执是否包含指定拒绝原因 |

#### 8.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `accepted(ConversationFact fact, IdempotencyKey idempotency_key)` | 为成功追加形成回执 |
| `duplicate(ConversationFactId fact_id, IdempotencyKey idempotency_key)` | 为幂等命中形成回执 |
| `rejected(ConversationSpaceId space_id, FactAppendRejectionReason reason)` | 为拒绝追加形成回执 |

#### 8.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 receipt 替代 fact truth | 回执只表达追加结果,不承载正式事实正文 |
| 在回执中保存拒绝输入正文 | 拒绝只能保存原因、引用和脱敏 marker |
| 用 duplicate 掩盖冲突 | 幂等命中与幂等冲突必须区分 |

---

## 9. Authorized consumption 对象

### 9.1 `ConversationReadModel`

#### 9.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Authorized consumption` |
| 对象类型 | projection / read model |
| 主要责任 | 表达面向授权 consumer 的对话读取视图 |

#### 9.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `read_model_id` | `ConversationReadModelId` | 标识读取视图 |
| `space_id` | `ConversationSpaceId` | 标识视图所属对话空间 |
| `consumer_ref` | `ConsumerRef` | 标识读取视图面向的 consumer |
| `visible_fact_refs` | `Vec<ConversationFactRef>` | 列出授权可见的事实引用 |
| `visible_manifestation_refs` | `Vec<CrossDomainManifestationRef>` | 列出授权可见的显化记录引用 |
| `cursor_ref` | `ConversationChangeCursorRef` | 指向增量读取或订阅游标 |
| `projection_state` | `ConversationProjectionState` | 表达读取视图 freshness / rebuild 状态 |

#### 9.1.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_visibility(VisibilityPolicy visibility_policy, ConsumerRef consumer_ref)` | 对读取视图进行可见性裁剪 |
| `mark_stale(ProjectionStaleReason reason)` | 标记读取视图过期 |
| `attach_cursor(ConversationChangeCursor cursor)` | 将读取视图与变化游标关联 |
| `contains_fact(ConversationFactId fact_id)` | 判断读取视图是否包含指定事实 |

#### 9.1.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_visible_facts(ConversationSpace space, Vec<ConversationFactRef> fact_refs, ConsumerRef consumer_ref)` | 从已授权事实集合形成读取视图 |
| `empty_for_consumer(ConversationSpaceId space_id, ConsumerRef consumer_ref)` | 为无可见事实的 consumer 形成空读取视图 |

#### 9.1.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 read model 反写真相 | 读取视图是派生对象,不能生成或修改事实 |
| 输出未裁剪事实 | read model 必须已经通过可见性裁剪 |
| 隐藏 stale 状态 | 过期视图必须明确表达 stale / rebuilding / failed |

### 9.2 `ConversationChangeCursor`

#### 9.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Authorized consumption` |
| 对象类型 | state / projection object |
| 主要责任 | 表达授权 consumer 的变化感知、订阅或增量读取位置 |

#### 9.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `cursor_id` | `ConversationChangeCursorId` | 标识变化游标 |
| `space_id` | `ConversationSpaceId` | 标识游标所属对话空间 |
| `consumer_ref` | `ConsumerRef` | 标识游标面向的 consumer |
| `last_fact_sequence` | `ConversationFactSequence` | 记录已消费事实位置 |
| `last_outbox_sequence` | `ConversationOutboxSequence` | 记录已消费 outbox / change 位置 |
| `cursor_state` | `ConversationChangeCursorState` | 表达 active、stale、expired 或 invalidated |

#### 9.2.3 状态集合

| 状态 | 作用 |
|---|---|
| `Active` | 游标可继续增量读取 |
| `Stale` | 游标位置落后,需要 projection 或 read model 刷新 |
| `Expired` | 游标超过保留窗口,需要重新建立读取视图 |
| `Invalidated` | 可见范围或参与范围变化导致游标不可继续使用 |

#### 9.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `advance(ConversationFactSequence fact_sequence, ConversationOutboxSequence outbox_sequence)` | 推进游标位置 |
| `mark_stale(CursorStaleReason reason)` | 标记游标过期但可恢复 |
| `invalidate(ScopeChangeRecord scope_change_record)` | 因范围变化使游标失效 |
| `can_resume(VisibilityScope visibility_scope, ConsumerRef consumer_ref)` | 判断 consumer 是否可继续使用游标 |

#### 9.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `start_from(ConversationSpaceId space_id, ConsumerRef consumer_ref, ConversationFactSequence sequence)` | 从指定事实位置创建游标 |
| `from_read_model(ConversationReadModel read_model)` | 从读取视图创建游标 |

#### 9.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用游标表达事实顺序 truth | 事实顺序由 `ConversationFact` 的 append sequence 表达 |
| 绕过 visibility scope 续读 | 游标恢复必须重新校验可见性 |
| 绑定具体传输协议 | SSE、WebSocket、AG-UI 等协议留给接口设计或下游 |

---

## 10. Cross-domain manifestation 对象

### 10.1 `CrossDomainManifestation`

#### 10.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Cross-domain manifestation` |
| 对象类型 | truth / manifestation record |
| 主要责任 | 表达某个外部正式事实在本对话空间中被显化为可讨论、可读取、可追溯记录 |

#### 10.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `manifestation_id` | `CrossDomainManifestationId` | 标识显化记录 |
| `space_id` | `ConversationSpaceId` | 标识显化所属对话空间 |
| `external_fact_ref` | `ExternalFactRef` | 指向来源仓正式事实 |
| `snapshot_ref` | `ExternalFactSnapshotRef` | 指向用于展示或追溯的安全快照 |
| `visibility_scope_id` | `VisibilityScopeId` | 指向显化记录的可见范围 |
| `manifestation_state` | `ManifestationState` | 表达 manifested、stale、revoked 等状态 |
| `source_version_ref` | `ExternalSourceVersionRef` | 记录来源事实版本引用 |

#### 10.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Manifested` | 外部事实已被正式显化到对话中 |
| `Stale` | 来源版本或快照过期,需要刷新 |
| `Revoked` | 显化记录被撤销,但保留追溯 |
| `Unresolved` | 来源暂不可解析,只能保留引用和降级状态 |

#### 10.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ExternalSourceVersionRef latest_version_ref)` | 标记来源版本变化导致显化过期 |
| `refresh_snapshot(ExternalFactSnapshot snapshot)` | 绑定新的安全展示快照 |
| `revoke(ActorRef actor_ref, ManifestationRevokeReason reason)` | 撤销显化记录并保留原因 |
| `visible_to(ConsumerRef consumer_ref, VisibilityPolicy visibility_policy)` | 判断显化记录是否可被 consumer 读取 |

#### 10.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_external_fact(ConversationSpace space, ExternalFactRef external_fact_ref, VisibilityScope visibility_scope)` | 从外部正式事实引用形成显化记录 |
| `from_snapshot(ExternalFactRef external_fact_ref, ExternalFactSnapshot snapshot, VisibilityScope visibility_scope)` | 从已解析快照形成显化记录 |

#### 10.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 转移来源仓 truth 所有权 | 显化只表达对话内可见记录,不拥有来源事实 |
| 保存来源正文 | 只允许引用和安全摘要快照 |
| 在来源不可用时补造事实 | 只能表达 unresolved / stale 状态 |

### 10.2 `ExternalFactRef`

#### 10.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Cross-domain manifestation` |
| 对象类型 | reference object |
| 主要责任 | 以稳定引用形式指向 Work、Governance、Artifact、Identity、Runtime、Bridges 等来源仓正式事实 |

#### 10.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `external_fact_ref_id` | `ExternalFactRefId` | 标识外部事实引用 |
| `source_system` | `ExternalSourceSystem` | 标识来源仓或来源系统 |
| `source_kind` | `ExternalFactKind` | 区分 work、governance、artifact、identity、runtime、bridge 等事实类型 |
| `source_object_ref` | `ExternalSourceObjectRef` | 指向来源对象 |
| `source_version_ref` | `ExternalSourceVersionRef` | 指向来源事实版本 |
| `source_digest` | `ExternalSourceDigest` | 支撑引用完整性校验 |

#### 10.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `belongs_to_source(ExternalSourceSystem source_system)` | 判断引用是否属于指定来源系统 |
| `same_identity(ExternalFactRef external_fact_ref)` | 判断两个引用是否指向同一来源事实身份 |
| `requires_snapshot()` | 判断该引用是否必须有展示快照才能显化 |

#### 10.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_work_fact(WorkFactRef work_fact_ref, ExternalSourceVersionRef version_ref)` | 从 work 正式事实形成外部引用 |
| `from_governance_decision(GovernanceDecisionRef decision_ref, ExternalSourceVersionRef version_ref)` | 从治理结论形成外部引用 |
| `from_artifact_version(ArtifactVersionRef artifact_version_ref)` | 从产物版本形成外部引用 |
| `from_bridge_event(BridgeEventRef bridge_event_ref)` | 从 bridges 映射结果形成外部引用 |

#### 10.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 包含来源正文 | ref 只能包含来源身份、版本和摘要 |
| 替代来源仓主键规范 | 本对象只在 Conversation 内封装引用 |
| 隐式改变来源事实状态 | Conversation 不能修改来源仓 truth |

### 10.3 `ExternalFactSnapshot`

#### 10.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Cross-domain manifestation` |
| 对象类型 | snapshot object |
| 主要责任 | 保存降级展示、历史阅读或追溯需要的外部事实安全摘要 |

#### 10.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `ExternalFactSnapshotId` | 标识外部事实快照 |
| `external_fact_ref` | `ExternalFactRef` | 指向来源正式事实 |
| `display_summary_ref` | `DisplaySummaryRef` | 指向可展示摘要,不含来源正文 |
| `source_digest` | `ExternalSourceDigest` | 支撑快照与来源版本对齐 |
| `captured_at` | `Timestamp` | 记录快照采集时间 |
| `resolution_state` | `ReferenceResolutionState` | 表达快照是否 fresh、stale、unresolved 或 invalid |

#### 10.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ExternalSourceVersionRef latest_version_ref)` | 标记快照相对来源版本过期 |
| `redact_for_visibility(VisibilityScope visibility_scope, ConsumerRef consumer_ref)` | 根据可见范围形成可输出摘要 |
| `matches_digest(ExternalSourceDigest source_digest)` | 校验快照摘要是否与来源摘要一致 |

#### 10.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_resolved_reference(ExternalFactRef external_fact_ref, DisplaySummaryRef display_summary_ref)` | 从已解析外部引用形成安全快照 |
| `unresolved(ExternalFactRef external_fact_ref, ReferenceResolutionReason reason)` | 为不可解析引用形成降级快照 |

#### 10.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存来源正文或 secret | 快照只能承载安全摘要和引用 |
| 用快照替代来源事实 | 快照是显示和追溯辅助,不是来源 truth |
| 在 stale 时伪装 fresh | resolution state 必须如实暴露 |

### 10.4 `ManifestationPolicy`

#### 10.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Cross-domain manifestation` |
| 对象类型 | policy / guard |
| 主要责任 | 判断某个外部正式事实是否允许被显化到指定对话空间 |

#### 10.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `allowed_source_rules` | `ManifestationSourceRuleSet` | 约束允许显化的来源系统和事实类型 |
| `visibility_rules` | `ManifestationVisibilityRuleSet` | 约束显化后的可见范围 |
| `snapshot_rules` | `ManifestationSnapshotRuleSet` | 约束显化是否必须携带安全快照 |
| `ownership_rules` | `ManifestationOwnershipRuleSet` | 防止显化转移来源仓 truth |

> 字段级 schema、默认值和 digest mismatch 口径以 `03_ddd_step_06_object_contracts.md` §7.7.0 为准;本节只保留概要层字段骨架。

#### 10.4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_manifestable(ExternalFactRef external_fact_ref, ConversationSpace space)` | 校验外部事实是否可显化到该空间 |
| `assert_snapshot_allowed(ExternalFactSnapshot snapshot, VisibilityScope visibility_scope)` | 校验快照可用于该可见范围 |
| `assert_source_not_owned(ExternalFactRef external_fact_ref)` | 校验本仓没有接管来源 truth |

#### 10.4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造默认显化策略 |
| `from_allowed_sources(ManifestationSourceRuleSet allowed_source_rules)` | 从允许来源规则形成显化策略 |

#### 10.4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 允许来源正文直接进入 fact | 显化只能形成引用、快照和显化记录 |
| 让显化改变来源状态 | 来源仓状态只能由来源仓改变 |
| 绕过 visibility policy | 显化后的读取仍受可见范围约束 |

### 10.5 `ReferenceValidityPolicy`

#### 10.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference / snapshot / projection support` |
| 对象类型 | policy / guard |
| 主要责任 | 判断外部引用是否可解析、可显化、可读取、可追溯或必须降级 |

#### 10.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `resolution_rules` | `ReferenceResolutionRuleSet` | 约束引用解析成功、失败和降级判断 |
| `freshness_rules` | `ReferenceFreshnessRuleSet` | 约束 snapshot / projection 新鲜度 |
| `digest_rules` | `ReferenceDigestRuleSet` | 约束来源摘要对齐 |
| `degraded_view_rules` | `DegradedViewRuleSet` | 约束不可解析时的降级展示 |

> 字段级 schema、默认值和 `DegradedViewDecision` 口径以 `03_ddd_step_06_object_contracts.md` §7.7.0 为准;本节只保留概要层字段骨架。

#### 10.5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_reference_acceptable(ExternalFactRef external_fact_ref)` | 校验外部引用格式和来源是否可接受 |
| `assert_snapshot_valid(ExternalFactSnapshot snapshot)` | 校验快照可用于显示或追溯 |
| `choose_degraded_view(ExternalFactRef external_fact_ref, ReferenceResolutionState resolution_state)` | 为不可解析引用选择降级展示方式 |
| `requires_refresh(ReferenceResolutionState resolution_state)` | 判断引用是否需要后台刷新 |

#### 10.5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造默认引用有效性策略 |
| `from_source_rules(ReferenceResolutionRuleSet resolution_rules)` | 从来源解析规则形成 policy |

#### 10.5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 在 policy 中保存外部对象正文 | policy 只保存规则和判断口径 |
| 把 unresolved 当作 missing truth | unresolved 表示引用解析状态,不改变已成立 Conversation truth |
| 用刷新结果直接改写来源事实 | 刷新只能更新本地 snapshot / projection |

---

## 11. History trace / review 对象

### 11.1 `ConversationTraceContext`

#### 11.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `History trace / review` |
| 对象类型 | context object / audit object |
| 主要责任 | 表达对话域内可追溯上下文,把事实、显化、范围变化和复盘锚点关联起来 |

#### 11.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_context_id` | `ConversationTraceContextId` | 标识追溯上下文 |
| `space_id` | `ConversationSpaceId` | 标识追溯上下文所属对话空间 |
| `fact_refs` | `Vec<ConversationFactRef>` | 记录关联事实引用 |
| `manifestation_refs` | `Vec<CrossDomainManifestationRef>` | 记录关联显化记录引用 |
| `scope_change_refs` | `Vec<ScopeChangeRecordRef>` | 记录关联范围变化 |
| `review_anchor_ref` | `ReviewAnchorRef` | 指向复盘定位点 |
| `retention_state` | `TraceRetentionState` | 表达追溯材料保留或交接状态 |

#### 11.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Open` | 追溯上下文可继续追加关联材料 |
| `Sealed` | 追溯上下文已封存,只允许读取和交接 |
| `HandoffPending` | 追溯上下文需要交给 observability 或 archive |
| `Expired` | 本地保留窗口已过,只能保留引用 |

#### 11.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_fact(ConversationFact fact)` | 将事实加入追溯上下文 |
| `attach_manifestation(CrossDomainManifestation manifestation)` | 将显化记录加入追溯上下文 |
| `attach_scope_change(ScopeChangeRecord scope_change_record)` | 将范围变化记录加入追溯上下文 |
| `seal(ActorRef actor_ref, TraceSealReason reason)` | 封存追溯上下文 |

#### 11.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_fact_append(ConversationFact fact, FactAppendReceipt receipt)` | 从事实追加结果形成追溯上下文 |
| `from_manifestation(CrossDomainManifestation manifestation)` | 从显化记录形成追溯上下文 |

#### 11.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 替代全局 trace store | 本对象只表达对话域追溯上下文 |
| 保存完整日志正文 | 只能保存引用、锚点和脱敏摘要 |
| 让 trace 改写事实 | 追溯上下文只能引用事实,不能修改事实 |

### 11.2 `ReviewAnchor`

#### 11.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `History trace / review` |
| 对象类型 | audit record / value object |
| 主要责任 | 标识复盘、责任边界、历史定位或人工审查的稳定锚点 |

#### 11.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `review_anchor_id` | `ReviewAnchorId` | 标识复盘锚点 |
| `space_id` | `ConversationSpaceId` | 标识锚点所属对话空间 |
| `anchor_kind` | `ReviewAnchorKind` | 区分 fact、manifestation、scope change、handoff 或 projection issue |
| `target_ref` | `ReviewTargetRef` | 指向被复盘对象 |
| `created_by` | `ActorRef` | 记录创建锚点的 actor |
| `reason_ref` | `ReviewReasonRef` | 记录复盘原因引用 |

#### 11.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `points_to_fact(ConversationFactId fact_id)` | 判断锚点是否指向指定事实 |
| `points_to_manifestation(CrossDomainManifestationId manifestation_id)` | 判断锚点是否指向指定显化记录 |
| `visible_under(VisibilityScope visibility_scope, ConsumerRef consumer_ref)` | 判断锚点是否可被 consumer 读取 |

#### 11.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_fact(ConversationFact fact, ActorRef actor_ref, ReviewReasonRef reason_ref)` | 为事实创建复盘锚点 |
| `for_manifestation(CrossDomainManifestation manifestation, ActorRef actor_ref, ReviewReasonRef reason_ref)` | 为显化记录创建复盘锚点 |
| `for_scope_change(ScopeChangeRecord scope_change_record, ActorRef actor_ref, ReviewReasonRef reason_ref)` | 为范围变化创建复盘锚点 |

#### 11.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 替代 governance decision | 复盘锚点只定位审查对象,不裁决 |
| 包含审查正文全集 | 复盘正文、长报告或证据包留在对应系统 |
| 绕过可见性读取 | 锚点输出仍需经过 `VisibilityPolicy` |

### 11.3 `TraceHandoffRecord`

#### 11.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `History trace / review` |
| 对象类型 | handoff record |
| 主要责任 | 表达对话追溯材料向 `L4-observability` 交接的意图、状态和证据 |

#### 11.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_handoff_id` | `TraceHandoffRecordId` | 标识 trace handoff 记录 |
| `trace_context_id` | `ConversationTraceContextId` | 指向被交接追溯上下文 |
| `destination_ref` | `ObservabilityDestinationRef` | 指向观测系统接收目标 |
| `handoff_payload_ref` | `TraceHandoffPayloadRef` | 指向脱敏交接 payload |
| `handoff_state` | `TraceHandoffState` | 表达 pending、handed_off、retry 或 failed |
| `retry_marker` | `HandoffRetryMarker` | 记录重试意图 |

#### 11.3.3 状态集合

| 状态 | 作用 |
|---|---|
| `Pending` | 等待交给 observability |
| `HandedOff` | 已完成交接并保留引用 |
| `RetryPending` | 交接失败但可重试 |
| `Failed` | 交接失败且需要人工处理 |
| `Cancelled` | 交接意图被正式取消 |

#### 11.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_handed_off(ObservabilityReceiptRef receipt_ref, Timestamp handed_off_at)` | 标记交接成功 |
| `mark_retry(HandoffRetryReason retry_reason, Timestamp next_retry_at)` | 标记交接重试 |
| `mark_failed(HandoffFailureReason failure_reason, ActorRef actor_ref)` | 标记交接失败 |
| `cancel(ActorRef actor_ref, HandoffCancelReason reason)` | 正式取消交接意图 |

#### 11.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_trace_context(ConversationTraceContext trace_context, ObservabilityDestinationRef destination_ref)` | 从追溯上下文形成观测交接记录 |
| `retry_from_failure(TraceHandoffRecord handoff_record, HandoffRetryReason retry_reason)` | 从失败交接记录形成重试记录 |

#### 11.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 让交接成功决定 truth 成立 | trace handoff 是后置交接 |
| 在 handoff payload 中保存 forbidden body | 交接 payload 必须脱敏并只含允许材料 |
| 让 observability 反写 Conversation truth | 观测系统只能接收,不能成为 truth owner |

### 11.4 `ArchiveHandoffRecord`

#### 11.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `History trace / review` |
| 对象类型 | handoff record |
| 主要责任 | 表达对话历史材料向 `L4-archive` 交接的意图、状态和归档引用 |

#### 11.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `archive_handoff_id` | `ArchiveHandoffRecordId` | 标识 archive handoff 记录 |
| `space_id` | `ConversationSpaceId` | 标识归档所属对话空间 |
| `archive_scope` | `ArchiveScope` | 表达归档范围 |
| `archive_package_ref` | `ArchivePackageRef` | 指向归档包引用 |
| `handoff_state` | `ArchiveHandoffState` | 表达 pending、archived、retry 或 failed |
| `retention_policy_ref` | `TraceRetentionPolicyRef` | 指向保留策略 |

#### 11.4.3 状态集合

| 状态 | 作用 |
|---|---|
| `Pending` | 等待归档交接 |
| `Archived` | 归档交接完成并保留 archive 引用 |
| `RetryPending` | 归档交接失败但可重试 |
| `Failed` | 归档交接失败且需要处理 |
| `Cancelled` | 归档交接被取消 |

#### 11.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_archived(ArchivePackageRef archive_package_ref, Timestamp archived_at)` | 标记归档完成 |
| `mark_retry(HandoffRetryReason retry_reason, Timestamp next_retry_at)` | 标记归档重试 |
| `mark_failed(HandoffFailureReason failure_reason, ActorRef actor_ref)` | 标记归档失败 |
| `covers_space(ConversationSpaceId space_id)` | 判断归档范围是否覆盖指定空间 |

#### 11.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_trace_context(ConversationTraceContext trace_context, ArchiveScope archive_scope)` | 从追溯上下文形成归档交接记录 |
| `from_space_close(ConversationSpace space, TraceRetentionPolicy retention_policy)` | 从空间关闭形成归档交接记录 |

#### 11.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存归档包正文 | 本对象只保存归档包引用 |
| 用 archive 状态替代 conversation 状态 | 归档是后置交接,不等于事实状态 |
| 允许 archive 反写对话事实 | archive 只能接收交接材料 |

### 11.5 `TraceRetentionPolicy`

#### 11.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `History trace / review` |
| 对象类型 | policy / guard |
| 主要责任 | 约束追溯材料在本仓保留、脱敏、交接和归档的边界 |

#### 11.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `retention_rules` | `TraceRetentionRuleSet` | 约束追溯材料保留窗口和范围 |
| `handoff_rules` | `TraceHandoffRuleSet` | 约束何时交给 observability 或 archive |
| `redaction_rules` | `TraceRedactionRuleSet` | 约束追溯材料脱敏 |
| `body_exclusion_rules` | `BodyExclusionRuleSet` | 防止日志正文、外部正文或 secret 进入追溯对象 |

#### 11.5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_retention_allowed(ConversationTraceContext trace_context)` | 校验追溯上下文是否允许本地保留 |
| `choose_archive_scope(ConversationSpace space, ConversationTraceContext trace_context)` | 判断归档范围 |
| `assert_handoff_allowed(TraceHandoffRecord handoff_record)` | 校验交接记录是否允许执行 |
| `assert_no_forbidden_body(TraceHandoffPayloadRef payload_ref)` | 校验交接材料不含禁止正文 |

#### 11.5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造默认追溯保留策略 |
| `from_retention_rules(TraceRetentionRuleSet retention_rules)` | 从保留规则形成 policy |

#### 11.5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 retention policy 决定事实是否成立 | 保留策略只约束追溯和交接 |
| 保留 forbidden body | 追溯材料必须引用化和脱敏 |
| 把 archive 当作本仓 truth store | Archive 是外部长期归档承接方 |

---

## 12. Derived consumption support 对象

### 12.1 `ConversationProjectionState`

#### 12.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | state object |
| 主要责任 | 表达 read model、search index、change cursor 和外部引用投影的派生状态 |

#### 12.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_state_id` | `ConversationProjectionStateId` | 标识派生状态 |
| `projection_kind` | `ConversationProjectionKind` | 区分 read model、search index、cursor、external reference projection |
| `source_position` | `ConversationSourcePosition` | 记录派生来源位置 |
| `freshness_state` | `ProjectionFreshnessState` | 表达 fresh、stale、rebuilding、failed 等状态 |
| `last_rebuild_ref` | `ProjectionRebuildRef` | 指向最近一次重建记录 |
| `last_error_ref` | `ProjectionErrorRef` | 指向最近一次派生失败诊断 |

#### 12.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Fresh` | 派生结果与来源位置一致 |
| `Stale` | 派生结果落后于 truth |
| `Rebuilding` | 正在重建或刷新 |
| `Failed` | 派生失败,读取必须降级或返回 stale marker |
| `Disabled` | 投影被显式禁用,不得作为读取依据 |

#### 12.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ProjectionStaleReason reason)` | 标记派生结果过期 |
| `begin_rebuild(ProjectionRebuildRef rebuild_ref)` | 标记派生进入重建 |
| `complete_rebuild(ConversationSourcePosition source_position)` | 标记重建完成并更新来源位置 |
| `fail_rebuild(ProjectionErrorRef error_ref)` | 标记重建失败并保存诊断引用 |

#### 12.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `initial(ConversationProjectionKind projection_kind, ConversationSourcePosition source_position)` | 创建初始派生状态 |
| `disabled(ConversationProjectionKind projection_kind, ProjectionDisableReason reason)` | 创建禁用状态 |

#### 12.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 projection state 改写 truth | 派生状态只能影响读取和维护 |
| 隐藏 failed / stale | 下游必须能感知派生状态 |
| 让 projection 成为第二事实源 | 所有派生必须能回到 Conversation truth |

### 12.2 `SearchIndexProjection`

#### 12.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | projection |
| 主要责任 | 支撑长历史检索、定位和复盘跳转的派生索引 |

#### 12.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `search_projection_id` | `SearchIndexProjectionId` | 标识搜索索引投影 |
| `space_id` | `ConversationSpaceId` | 标识索引所属对话空间 |
| `indexed_fact_refs` | `Vec<ConversationFactRef>` | 记录已进入索引的事实引用 |
| `indexed_manifestation_refs` | `Vec<CrossDomainManifestationRef>` | 记录已进入索引的显化引用 |
| `projection_state` | `ConversationProjectionState` | 表达索引 freshness / rebuild 状态 |
| `source_position` | `ConversationSourcePosition` | 记录索引覆盖的 truth 位置 |

#### 12.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ProjectionStaleReason reason)` | 标记索引过期 |
| `attach_fact_ref(ConversationFactRef fact_ref)` | 将事实引用纳入索引 |
| `attach_manifestation_ref(CrossDomainManifestationRef manifestation_ref)` | 将显化引用纳入索引 |
| `covers_position(ConversationSourcePosition source_position)` | 判断索引是否覆盖指定来源位置 |

#### 12.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_read_model(ConversationReadModel read_model)` | 从读取视图形成搜索索引投影 |
| `empty_for_space(ConversationSpaceId space_id)` | 为对话空间创建空搜索索引投影 |

#### 12.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存完整正文副本 | 索引投影只能保存可检索引用或允许摘要 |
| 把搜索结果当 truth | 搜索只用于定位和读取辅助 |
| 绕过 visibility policy | 查询结果输出仍需按 consumer 裁剪 |

### 12.3 `ChangeCursorProjection`

#### 12.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | projection |
| 主要责任 | 支撑变化感知、订阅增量和 cursor 维护的派生结构 |

#### 12.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_cursor_projection_id` | `ChangeCursorProjectionId` | 标识变化游标投影 |
| `space_id` | `ConversationSpaceId` | 标识投影所属对话空间 |
| `cursor_entries` | `Vec<ConversationChangeCursorEntry>` | 记录可被增量消费的变化位置 |
| `source_position` | `ConversationSourcePosition` | 记录投影覆盖的 truth 位置 |
| `projection_state` | `ConversationProjectionState` | 表达投影 freshness / rebuild 状态 |

#### 12.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `update_from_outbox(ConversationOutboxRecord outbox_record)` | 从 outbox 记录更新变化投影 |
| `mark_stale(ProjectionStaleReason reason)` | 标记变化投影过期 |
| `cursor_for(ConsumerRef consumer_ref)` | 为 consumer 定位可用游标 |
| `covers_sequence(ConversationFactSequence fact_sequence)` | 判断投影是否覆盖指定事实序列 |

#### 12.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_change_log(ConversationSpaceId space_id, Vec<ConversationOutboxRecord> outbox_records)` | 从变化记录形成 cursor projection |
| `empty_for_space(ConversationSpaceId space_id)` | 为对话空间创建空变化游标投影 |

#### 12.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 cursor projection 当成同步传输协议 | 投影只表达变化位置,不绑定 SSE / WebSocket / AG-UI |
| 反写 fact sequence | 事实序列由 truth append 产生 |
| 输出未授权变化 | consumer 游标必须受可见性裁剪 |

### 12.4 `DerivedViewPolicy`

#### 12.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | policy / guard |
| 主要责任 | 保护派生视图只读、可重建、不反写真相和状态可见 |

#### 12.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_rules` | `ProjectionRuleSet` | 约束哪些投影可被构建和读取 |
| `rebuild_rules` | `ProjectionRebuildRuleSet` | 约束重建触发、覆盖和失败处理 |
| `read_degradation_rules` | `ReadDegradationRuleSet` | 约束 stale / failed 时如何降级读取 |
| `truth_write_guard` | `DerivedTruthWriteGuard` | 防止派生对象反写核心 truth |

#### 12.4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_read_only(ConversationProjectionState projection_state)` | 校验派生对象只能读取或维护 |
| `assert_rebuild_allowed(ConversationProjectionState projection_state, ProjectionRebuildReason reason)` | 校验是否允许重建 |
| `assert_source_position_valid(ConversationSourcePosition source_position)` | 校验派生来源位置有效 |
| `choose_degraded_read(ConversationProjectionState projection_state)` | 为 stale / failed 状态选择降级读取方式 |

#### 12.4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 构造默认派生视图策略 |
| `from_projection_rules(ProjectionRuleSet projection_rules)` | 从投影规则形成 policy |

#### 12.4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 让派生结果生成事实 | projection / index / cursor 不能成为业务写入来源 |
| 隐藏投影失败 | stale / failed 必须作为读取状态暴露 |
| 把重建脚本细节写入概要对象 | 具体 job / runner / retry 留到详细设计 |

---

## 13. Local reference / snapshot / projection support 对象

### 13.1 `ReferenceResolutionState`

#### 13.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference / snapshot / projection support` |
| 对象类型 | state enum |
| 主要责任 | 表达外部引用或展示快照的解析、新鲜度和可用状态 |

#### 13.1.2 状态集合

| 状态 | 作用 |
|---|---|
| `Fresh` | 引用已解析且快照与来源版本对齐 |
| `Stale` | 引用可用但来源版本或快照过期 |
| `Pending` | 引用刷新或解析正在等待后台处理 |
| `Unresolved` | 来源暂不可解析,可以降级展示引用 |
| `Invalid` | 引用格式、来源或权限不合法,不得显化或展示为有效 |

#### 13.1.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows_display()` | 判断是否允许降级展示 |
| `requires_refresh()` | 判断是否需要后台刷新 |
| `is_invalid()` | 判断引用是否不可接受 |
| `is_terminal()` | 判断状态是否无法自动恢复 |

#### 13.1.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `fresh(ExternalSourceVersionRef version_ref)` | 从已解析来源版本形成 fresh 状态 |
| `stale(ExternalSourceVersionRef latest_version_ref)` | 从来源版本变化形成 stale 状态 |
| `unresolved(ReferenceResolutionReason reason)` | 从解析失败形成 unresolved 状态 |
| `invalid(ReferenceResolutionReason reason)` | 从引用校验失败形成 invalid 状态 |

#### 13.1.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 unresolved 当作 fact 不存在 | 解析状态不改变已成立显化或事实 |
| 在状态中保存来源正文 | 状态只表达解析和 freshness |
| 将 stale 伪装为 fresh | 下游必须能识别过期快照 |

### 13.2 `ExternalReferenceProjection`

#### 13.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference / snapshot / projection support` |
| 对象类型 | projection |
| 主要责任 | 聚合外部引用、展示摘要、解析状态和本地降级显示材料 |

#### 13.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `external_reference_projection_id` | `ExternalReferenceProjectionId` | 标识外部引用投影 |
| `space_id` | `ConversationSpaceId` | 标识投影所属 conversation space |
| `external_fact_refs` | `Vec<ExternalFactRef>` | 指向来源仓正式事实集合 |
| `snapshot_refs` | `Vec<ExternalFactSnapshotRef>` | 指向当前可展示快照集合 |
| `resolution_state` | `ReferenceResolutionState` | 表达引用解析状态 |
| `degraded_display_ref` | `Option<DegradedDisplayRef>` | 表达降级、不可见或不可解析显示材料 |

> `ExternalReferenceProjectionId`、`DegradedDisplayRef` 和 `DisplayFragmentRef` 的字段级 schema 以 `03_ddd_step_06_object_contracts.md` §7.7.0 和 §7.10.2 为准;本节不另行定义第二套 projection schema。

#### 13.2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `update_snapshot(ExternalFactSnapshot snapshot)` | 使用新的安全快照更新投影 |
| `mark_unresolved(ReferenceResolutionReason reason)` | 标记引用不可解析 |
| `mark_invalid(ReferenceResolutionReason reason)` | 标记引用不可接受 |
| `display_fragment(ConsumerRef consumer_ref, VisibilityScope visibility_scope)` | 为授权读取形成可输出片段 |

#### 13.2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot(ExternalFactSnapshot snapshot)` | 从外部事实快照形成引用投影 |
| `from_unresolved_ref(ExternalFactRef external_fact_ref, ReferenceResolutionReason reason)` | 从不可解析引用形成降级投影 |

#### 13.2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存外部正文 | 投影只能保存引用、摘要和显示 marker |
| 改写 `CrossDomainManifestation` truth | 投影只能辅助读取和展示 |
| 隐藏不可解析状态 | unresolved / invalid 必须暴露给读取或追溯 |

---

## 14. Step 8 / Step 9 反查清单

| 后续使用位置 | 必须能反查到的对象 | 当前结论 |
|---|---|---|
| Space / scope 创建与变更流 | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord`、`ConversationOutboxRecord` | 已独立定义,可进入 Step 8 |
| 事实追加流 | `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt`、`ConversationTruthState`、`ConversationOutboxRecord` | 已独立定义,可进入 Step 8 / Step 9 |
| 授权读取与变化感知流 | `ConversationReadModel`、`ConversationChangeCursor`、`VisibilityPolicy`、`ConversationProjectionState`、`ChangeCursorProjection` | 已独立定义,可进入 Step 8 / Step 9 |
| 跨域显化流 | `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`ReferenceResolutionState` | 已独立定义,可进入 Step 8 / Step 9 |
| 追溯复盘与交接流 | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` | 已独立定义,可进入 Step 8 / Step 9 |
| 派生维护与重建流 | `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`ExternalReferenceProjection`、`DerivedViewPolicy` | 已独立定义,可进入 Step 8 / Step 9 |
| 状态机章节 | `ConversationTruthState`、`ConversationSpace` lifecycle、`ParticipantScope` state、`VisibilityScope` state、`ConversationFact` state、`CrossDomainManifestation` state、`ConversationProjectionState`、`ReferenceResolutionState`、handoff state、cursor state | 已在对象小节列出状态集合,Step 9 可继续收敛状态流转 |

### 14.1 后续不得隐式新增的对象

| 名称类型 | 后续处理规则 |
|---|---|
| 新 domain object | 必须先回到本步补对象小节,不得在 Step 8 / Step 9 临时发明 |
| 新状态 enum | 必须先回到对应对象小节补状态集合 |
| 新 policy / guard | 必须判断是否属于本步已有 policy,否则回补 Step 6 |
| 新 projection / cursor | 必须证明来源是 Conversation truth,并回补 Step 6 |
| 新 repository / port / DTO | 不回补 Step 6,应进入 Step 7 或详细设计 |

---

## 15. 输出约束检查

| 检查项 | 结论 |
|---|---|
| 是否先输出对象候选池筛选说明 | 是,见 §4 |
| 是否按对象独立成节 | 是,30 个对象均独立成节 |
| 是否把所有对象合并成一个对象总览表 | 否,§5 只是辅助分布说明 |
| 字段表是否使用 `字段 / 类型 / 作用` | 是 |
| 成员函数 / 工厂函数参数是否写明类型 | 是,均使用 `TypeName param_name` 形式 |
| 是否写完整 Rust 返回类型、泛型、生命周期或实现体 | 否 |
| 是否写 DTO schema、数据库列、repository 函数或外部 port 函数 | 否 |
| 是否从 Step 5 候选池外新增关键对象主语 | 否 |
| 是否解释 service / repository / port / job 不在本步展开 | 是,见 §3.3 |
| 是否默认不画图 | 是,本章表格足以表达对象归属,未补对象分布图 |

---

## 16. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §6 “关键对象轮廓”摘录本文件 §4 的对象候选池筛选说明。
- §6 可以保留本文件 §5 的关键对象分布说明作为辅助索引。
- §6 必须按本文件 §6 ~ §13 的对象小节逐一回填关键对象,不能压缩成单张对象总览表。
- §6 的对象字段、状态集合、成员函数、工厂函数和禁止事项从本文件摘录;如正式文档需要压缩,只能压缩说明文字,不能删掉对象独立小节。
- Step 8 处理流和 Step 9 状态机必须以本文件 §14 作为对象反查基线。

---

## 17. 当前文档问题诊断

| 旧 `02-概要设计.md` 倾向 | 问题 | 本步处理 |
|---|---|---|
| 以 Conversation / Turn / StreamEvents 作为对象主线 | 对象覆盖不足,无法表达 scope、manifestation、trace、projection、handoff 和 reference support | 改为从 Step 5 候选池展开 30 个正式对象 |
| 将读取、订阅、stream 视为核心对象 | 容易把传输协议当成业务对象 | 收敛为 `ConversationReadModel`、`ConversationChangeCursor` 和 `ChangeCursorProjection` |
| 将外部事实转成消息 | 容易复制来源仓 truth | 单列 `ExternalFactRef`、`ExternalFactSnapshot`、`CrossDomainManifestation` |
| 忽略 outbox / trace handoff | 处理流会临时补对象 | 单列 `ConversationOutboxRecord`、`TraceHandoffRecord`、`ArchiveHandoffRecord` |

---

## 18. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只列对象总览表 | 文档短 | 无法约束字段类型、状态、函数和详细设计承接 | 不采用 |
| 方案 B: 30 个候选对象全部独立展开 | 对象边界完整,Step 8 / Step 9 可直接反查 | 文档较长 | 采用 |
| 方案 C: 合并 policy / projection / history 对象 | 小节更少 | 会遮蔽 policy 与状态责任,后续详细设计仍需重新拆 | 不采用 |
| 方案 D: 提前写完整 Rust struct / enum | 对开发更直接 | 越过概要设计边界,会替代详细设计 | 不采用 |

---

## 19. 待确认事项

### 19.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否接受 Step 6 展开 30 个对象而不是压缩为对象组 | A. 压缩为对象组;B. 全部独立展开;C. 只展开 truth object | B | Step 5 已明确这些对象未来可能成为 struct、enum、value object、projection、policy、audit record 或 history record,压缩会导致后续重新发明边界 | 已按 B 执行 |
| `ReferenceValidityPolicy` 主归属放在哪里 | A. Cross-domain manifestation;B. Local reference support;C. 两处各写一份 | B | 该 policy 同时服务显化和本地引用支撑,但核心责任是引用解析、freshness 和降级显示 | 已按 B 执行 |
| 是否在本步画对象分布图 | A. 画图;B. 不画图 | B | 本章对象分布表已足够清楚,图会过长且容易误读成类图 | 已按 B 执行 |

### 19.2 本 Step 未确认事项

本步不新增阻塞 Step 7 的待确认事项。若 Step 8 / Step 9 发现需要新增正式对象或状态集合,应先回到本文件补充,再继续后续 Step。

---

## 20. 进入下一步条件

- 已从 Step 5 对象候选池完成对象正式化筛选。
- 已明确 30 个关键对象的所属部分、对象类型、主要责任和禁止事项。
- 关键字段表均写明字段类型和作用。
- 存在状态的对象均列出状态集合。
- 存在行为的对象均列出成员函数或工厂函数骨架。
- 成员函数和工厂函数参数均使用 `TypeName param_name` 形式。
- Step 8 / Step 9 将使用的对象均能在本步找到独立定义。
- 未写完整 Rust 签名、返回类型、实现代码、DTO schema、数据库列或 repository / port 函数。
- 可以进入 Step 7“API / 接口骨架”。
