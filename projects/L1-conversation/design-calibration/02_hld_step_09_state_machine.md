# Step 9. 状态机与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在 Step 6 关键对象和 Step 8 处理流已经收稳的前提下,把 `L1-conversation` 的正式状态集合、状态含义、核心迁移、禁止迁移和状态传播关系单独收口。

本步只写概要设计层状态机:状态名称、状态含义、触发动作、迁移方向、下游感知和传播关系。本步不写状态机代码、数据库状态列、完整错误码、重试参数、补偿脚本或 UI 展示规则。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` | 已完成 | 提供正式对象、状态集合和成员函数骨架 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供会触发状态变化的 Command、Consumer 和 Job |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供状态迁移发生在哪些处理流中 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供 outbox、projection、handoff 和下游传播边界 |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态？

本仓存在正式状态机。影响主线成立的状态分为 6 组:

| 状态机组 | 覆盖对象 | 影响范围 |
|---|---|---|
| Conversation truth / space / scope 状态 | `ConversationTruthState`、`ConversationSpaceLifecycleState`、`ParticipantScopeState`、`VisibilityScopeState`、`ScopeChangeRecord` | 决定是否可写、可读、可显化和是否需要交接 |
| Fact append 状态 | `ConversationFactState`、`FactAppendResult` | 决定事实是否成立、是否可读、是否被撤回或隔离 |
| Manifestation / reference 状态 | `ManifestationState`、`ReferenceResolutionState` | 决定外部事实显化、快照刷新和降级展示 |
| Projection / cursor 状态 | `ConversationProjectionState`、`ConversationChangeCursorState` | 决定 read model、search、cursor 是否 fresh、可续读或必须重建 |
| Outbox 状态 | `ConversationOutboxPublicationState` | 决定已提交 truth 是否已传播、待重试、失败或被抑制 |
| Trace / handoff 状态 | `TraceRetentionState`、`TraceHandoffState`、`ArchiveHandoffState` | 决定追溯材料是否开放、封存、待交接、已交接或失败 |

### 3.2 每个状态是否可以进入正常主线？

`Open`、`Active`、`Accepted`、`Manifested`、`Fresh`、`Published`、`HandedOff`、`Archived` 可以进入正常读取或传播主线。`ReadOnly`、`Restricted`、`VisibilityRestricted`、`Stale`、`Pending`、`RetryPending` 属于受限主线,可以读取或恢复,但必须暴露 marker。`Closed`、`Retracted`、`Quarantined`、`Revoked`、`Unresolved`、`Invalid`、`Failed`、`Expired`、`Cancelled` 不能伪装为正常主线,必须由显式 Command、后台 Job 或人工处理承接。

### 3.3 哪些接口、事件或动作会触发状态迁移？

主要触发点如下:

| 触发来源 | 触发动作 | 主要迁移 |
|---|---|---|
| Command | `CreateConversationSpace` | truth / space / scope 从初始状态进入可写可读状态 |
| Command | `CloseConversationSpace` | space / truth 进入 read-only、closed 或 handoff pending |
| Command | `UpdateParticipantScope`、`UpdateVisibilityScope` | scope 版本变化,旧 record superseded,受影响 cursor / projection stale 或 invalidated |
| Command / Consumer | `AppendConversationFact`、`ConsumeRuntimeResultCommitted`、`ConsumeBridgeMappedFactReceived` | fact accepted / restricted / quarantined,receipt accepted / duplicate / rejected |
| Command | `RetractConversationFact` | fact retracted,read model / search / cursor stale |
| Command / Consumer / Job | `ManifestExternalFact`、来源事件 consumer、`RefreshExternalReferenceSnapshots` | manifestation manifested / stale / unresolved / revoked,reference fresh / stale / pending / unresolved / invalid |
| Job | `RebuildConversationReadModels`、`RebuildConversationSearchIndex`、`MaintainConversationChangeCursors` | projection fresh / stale / rebuilding / failed,cursor active / stale / expired / invalidated |
| Job | `PublishConversationOutbox` | outbox pending / published / retry pending / failed / suppressed |
| Command / Job | `RequestTraceHandoff`、`RequestArchiveHandoff`、`DeliverTraceHandoff`、`DeliverArchiveHandoff` | trace handoff pending / handed off / archived / retry / failed / cancelled |

### 3.4 哪些迁移明确允许，哪些迁移明确禁止？

允许迁移必须来自 Step 7 / Step 8 已定义的 Command、Consumer 或 Job。禁止迁移主要是:

- 派生状态反向改变 truth 状态。
- outbox 发布失败回滚 fact / manifestation / scope truth。
- source unresolved 时补造外部事实。
- visibility / participant scope 变化后继续静默复用旧 cursor。
- handoff 成功或失败反向决定 Conversation fact 是否成立。

### 3.5 状态变化如何影响 outbox、projection、下游感知或只读供给？

状态变化的传播方向固定为:

```text
<Conversation Truth State Change>
  │
  ▼
<ConversationOutboxRecord>
  │
  ▼
<Bus / Downstream Awareness>

<Conversation Truth State Change>
  │
  ▼
<ConversationProjectionState / Cursor State>
  │
  ▼
<Authorized Query Marker>

<External Reference State Change>
  │
  ▼
<ExternalReferenceProjection / Manifestation State>
  │
  ▼
<Read Model Degraded Marker>
```

关键说明:

- 状态传播是单向的:truth 影响 outbox / projection / query marker,派生失败不能反向改写 truth。
- 下游必须能看到 stale、unresolved、failed、retry pending、invalidated 等 marker。
- 传播细节、event schema、topic、retry 和告警策略留给详细设计。

---

## 4. 状态机覆盖清单

| 状态机 | 是否正式收稳 | 主要对象 | 来源 |
|---|---|---|---|
| Conversation truth 状态机 | 是 | `ConversationTruthState` | Step 6 §6.1,Step 8 §6 |
| Conversation space lifecycle 状态机 | 是 | `ConversationSpace` | Step 6 §7.1,Step 8 §6 |
| Participant scope 状态机 | 是 | `ParticipantScope` | Step 6 §7.2,Step 8 §6 |
| Visibility scope 状态机 | 是 | `VisibilityScope` | Step 6 §7.3,Step 8 §6 |
| Scope change record 状态机 | 是 | `ScopeChangeRecord` | Step 6 §7.5,Step 8 §6 |
| Conversation fact 状态机 | 是 | `ConversationFact` | Step 6 §8.1,Step 8 §6 / §8 |
| Fact append receipt 状态机 | 是 | `FactAppendReceipt` | Step 6 §8.4,Step 8 §6 |
| Cross-domain manifestation 状态机 | 是 | `CrossDomainManifestation` | Step 6 §10.1,Step 8 §6 / §8 |
| Reference resolution 状态机 | 是 | `ReferenceResolutionState` | Step 6 §13.1,Step 8 §7 / §8 / §9 |
| Projection freshness 状态机 | 是 | `ConversationProjectionState` | Step 6 §12.1,Step 8 §7 / §9 |
| Change cursor 状态机 | 是 | `ConversationChangeCursor` | Step 6 §9.2,Step 8 §7 / §9 |
| Outbox publication 状态机 | 是 | `ConversationOutboxRecord` | Step 6 §6.3,Step 8 §9 |
| Trace context retention 状态机 | 是 | `ConversationTraceContext` | Step 6 §11.1,Step 8 §6 / §7 |
| Trace handoff 状态机 | 是 | `TraceHandoffRecord` | Step 6 §11.3,Step 8 §6 / §9 |
| Archive handoff 状态机 | 是 | `ArchiveHandoffRecord` | Step 6 §11.4,Step 8 §6 / §9 |

说明:

- `ConversationReadModel`、`SearchIndexProjection`、`ChangeCursorProjection` 和 `ExternalReferenceProjection` 自身不另设独立状态机,它们通过 `ConversationProjectionState`、`ConversationChangeCursorState` 或 `ReferenceResolutionState` 暴露状态。
- `ReviewAnchor` 不设生命周期状态,它是稳定定位点,是否可读由 `VisibilityPolicy` 和 trace retention 决定。
- `FactSourceRef`、`ExternalFactRef` 是引用对象,不表达本仓生命周期状态。

---

## 5. 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `ConversationTruthState.Open` | Conversation truth 已成立并允许按 scope / policy 追加事实和读取 | 是 | 正常写入和读取主线入口 |
| `ConversationTruthState.ReadOnly` | truth 停止新增事实,但允许授权读取、追溯和交接 | 受限 | Command 写入受限,Query 和 handoff 仍可进行 |
| `ConversationTruthState.Restricted` | truth 因可见性、治理或来源异常进入受限处理 | 受限 | 必须暴露受限 marker,不能静默当作 Open |
| `ConversationTruthState.HandoffPending` | 已成立 truth 存在传播、观测或归档交接待处理 | 受限 | 允许读取和交接 Job,不表示 truth 未成立 |
| `ConversationTruthState.Closed` | 对话空间正式关闭,只允许受控追溯和必要交接 | 否 | 新 fact / scope 扩展必须被拒绝 |
| `ConversationSpaceLifecycleState.Active` | 对话空间可在 scope / policy 内追加事实和读取 | 是 | 与 `ConversationTruthState.Open` 通常同步出现 |
| `ConversationSpaceLifecycleState.ReadOnly` | 空间不再接受新事实,但允许读取和追溯 | 受限 | 适用于关闭前、冻结或交接准备 |
| `ConversationSpaceLifecycleState.Closed` | 空间关闭,只允许受控交接和审计 | 否 | 不关闭项目或 workspace,只关闭 Conversation space |
| `ConversationSpaceLifecycleState.Archived` | 空间已交由归档视角承接,本仓保留引用和必要索引 | 受限 | 读取以历史和归档引用为主 |
| `ParticipantScopeState.Active` | 参与范围有效,可用于事实追加和授权读取 | 是 | 参与者仍需通过 visibility 判断 |
| `ParticipantScopeState.Restricted` | 参与范围受限,需要额外 visibility / governance 判断 | 受限 | 不能自动扩大读取或写入能力 |
| `ParticipantScopeState.Closed` | 参与范围关闭,只用于历史追溯 | 否 | 不允许新增参与能力 |
| `VisibilityScopeState.Open` | 按默认规则和参与范围授权读取 | 是 | 正常读写可见性状态 |
| `VisibilityScopeState.Restricted` | 需要额外规则判断或治理结果才能读取 | 受限 | Query 必须输出裁剪或限制 marker |
| `VisibilityScopeState.Sealed` | 历史可追溯但不允许新增可见性扩展 | 受限 | 新可见性扩展必须走新 scope 变更或被拒绝 |
| `ScopeChangeRecord.Applied` | 范围变化已正式生效 | 是 | 会影响 projection、cursor 和 outbox |
| `ScopeChangeRecord.Superseded` | 范围变化被后续变更覆盖,仅用于追溯 | 不适用 | 不能作为当前 scope truth |
| `ScopeChangeRecord.Rejected` | 范围变化被拒绝并保留拒绝依据 | 否 | 不改变当前 scope truth |
| `ConversationFactState.Accepted` | 事实已正式追加并可按可见范围读取 | 是 | 正常 fact 主线状态 |
| `ConversationFactState.VisibilityRestricted` | 事实成立,但读取必须受更严格可见范围约束 | 受限 | 下游只能看到授权裁剪结果 |
| `ConversationFactState.Retracted` | 事实被正式撤回或废止,保留追溯记录 | 否 | 不删除历史,但不能作为 fresh fact 输出 |
| `ConversationFactState.Quarantined` | 事实因安全、边界或来源问题暂时隔离 | 否 | 需要人工或后续明确动作处理 |
| `FactAppendResult.Accepted` | 事实追加成功 | 是 | 可形成 fact、receipt、trace 和 outbox |
| `FactAppendResult.Duplicate` | 请求命中已有追加结果 | 是 | 幂等成功,不得重复生成 fact |
| `FactAppendResult.Rejected` | 请求因边界、来源、可见性或幂等冲突被拒绝 | 否 | 只保留拒绝原因和脱敏 marker |
| `ManifestationState.Manifested` | 外部事实已被正式显化到对话中 | 是 | 可形成对话内显化记录和可读 fact |
| `ManifestationState.Stale` | 来源版本或快照过期,需要刷新 | 受限 | Query 必须暴露 stale marker |
| `ManifestationState.Revoked` | 显化记录被撤销,但保留追溯 | 否 | 不能继续作为可用显化输出 |
| `ManifestationState.Unresolved` | 来源暂不可解析,只能保留引用和降级状态 | 受限 | 不得补造来源事实 |
| `ReferenceResolutionState.Fresh` | 引用已解析且快照与来源版本对齐 | 是 | 可用于正常读取和显化 |
| `ReferenceResolutionState.Stale` | 引用可用但来源版本或快照过期 | 受限 | 允许降级读取,必须触发 refresh 需求 |
| `ReferenceResolutionState.Pending` | 引用刷新或解析正在等待后台处理 | 受限 | 读取可返回 pending marker |
| `ReferenceResolutionState.Unresolved` | 来源暂不可解析,可以降级展示引用 | 受限 | 不改变已成立 Conversation truth |
| `ReferenceResolutionState.Invalid` | 引用格式、来源或权限不合法 | 否 | 不得显化或展示为有效事实 |
| `ProjectionFreshnessState.Fresh` | 派生结果与来源位置一致 | 是 | Query 可作为正常读取依据 |
| `ProjectionFreshnessState.Stale` | 派生结果落后于 truth | 受限 | Query 必须暴露 stale 或降级 marker |
| `ProjectionFreshnessState.Rebuilding` | 派生正在重建或刷新 | 受限 | Query 可降级读取或返回 rebuilding marker |
| `ProjectionFreshnessState.Failed` | 派生失败,读取必须降级或返回失败 marker | 否 | 不能伪装为 fresh |
| `ProjectionFreshnessState.Disabled` | 投影被显式禁用,不得作为读取依据 | 否 | 需要 fallback 或显式不支持 |
| `ConversationChangeCursorState.Active` | 游标可继续增量读取 | 是 | 每次续读仍需 visibility 复核 |
| `ConversationChangeCursorState.Stale` | 游标位置落后,需要 projection 或 read model 刷新 | 受限 | 可通过维护 Job 恢复 |
| `ConversationChangeCursorState.Expired` | 游标超过保留窗口,需要重新建立读取视图 | 否 | 不能继续续读旧 cursor |
| `ConversationChangeCursorState.Invalidated` | 可见范围或参与范围变化导致游标不可继续使用 | 否 | 必须重新建 cursor 或重新读取 |
| `ConversationOutboxPublicationState.Pending` | truth 已提交,等待发布或交接 | 受限 | 表示传播未完成,不影响 truth 成立 |
| `ConversationOutboxPublicationState.Published` | 已完成发布或交接标记 | 是 | 可以作为下游已感知证据 |
| `ConversationOutboxPublicationState.RetryPending` | 上次发布失败,等待重试 | 受限 | 需要 Job 重试或人工处理 |
| `ConversationOutboxPublicationState.Failed` | 达到失败门槛,需要人工或运维处理 | 否 | 不得回滚 truth |
| `ConversationOutboxPublicationState.Suppressed` | 因可见性或边界规则不应发布,仅保留内部证据 | 不适用 | 不再进入跨仓传播主线 |
| `TraceRetentionState.Open` | 追溯上下文可继续追加关联材料 | 是 | 正常 trace 主线状态 |
| `TraceRetentionState.Sealed` | 追溯上下文已封存,只允许读取和交接 | 受限 | 不允许继续追加关联材料 |
| `TraceRetentionState.HandoffPending` | 追溯上下文需要交给 observability 或 archive | 受限 | 由 handoff Job 承接 |
| `TraceRetentionState.Expired` | 本地保留窗口已过,只能保留引用 | 受限 | 读取必须依赖归档或引用 |
| `TraceHandoffState.Pending` | 等待交给 observability | 受限 | 由 `DeliverTraceHandoff` 承接 |
| `TraceHandoffState.HandedOff` | 已完成交接并保留引用 | 是 | 可作为观测交接证据 |
| `TraceHandoffState.RetryPending` | 交接失败但可重试 | 受限 | 需要 Job 重试 |
| `TraceHandoffState.Failed` | 交接失败且需要人工处理 | 否 | 不影响 fact truth 成立 |
| `TraceHandoffState.Cancelled` | 交接意图被正式取消 | 否 | 不再进入交接主线 |
| `ArchiveHandoffState.Pending` | 等待归档交接 | 受限 | 由 `DeliverArchiveHandoff` 承接 |
| `ArchiveHandoffState.Archived` | 归档交接完成并保留 archive 引用 | 是 | 可作为归档交接证据 |
| `ArchiveHandoffState.RetryPending` | 归档交接失败但可重试 | 受限 | 需要 Job 重试 |
| `ArchiveHandoffState.Failed` | 归档交接失败且需要处理 | 否 | 不删除 Conversation history |
| `ArchiveHandoffState.Cancelled` | 归档交接被取消 | 否 | 不再进入归档主线 |

---

## 6. 状态流转图

#### Conversation truth / space lifecycle 状态流转图

```text
<Initial>
  │ CreateConversationSpace
  ▼
<Open / Active>
  │ CloseConversationSpace or freeze writing
  ▼
<ReadOnly>
  │ RequestTraceHandoff / RequestArchiveHandoff / pending outbox
  ▼
<HandoffPending>
  │ DeliverTraceHandoff / DeliverArchiveHandoff completed
  ▼
<Closed>
  │ archive accepted
  ▼
<Archived>

<Open / Active>
  │ restriction detected
  ▼
<Restricted>
  │ explicit recovery or policy release
  ▼
<Open / Active>
```

关键说明:

- `ConversationTruthState` 与 `ConversationSpaceLifecycleState` 不要求一一同名,但必须保持语义一致。
- `HandoffPending` 表示后置传播或交接未完成,不表示 truth 未成立。
- `Archived` 是 space lifecycle 的归档承接状态,不是 fact 或 manifestation 状态。

#### Participant / visibility scope 状态流转图

```text
<Active / Open>
  │ UpdateParticipantScope / UpdateVisibilityScope
  ▼
<Active / Open with new ScopeVersion>
  │ restriction detected
  ▼
<Restricted>
  │ policy release or new explicit scope update
  ▼
<Active / Open>
  │ close space or seal visibility
  ▼
<Closed / Sealed>

<ScopeChangeRecord.Applied>
  │ later scope change applied
  ▼
<ScopeChangeRecord.Superseded>

<ScopeChangeCommand>
  │ rejected by policy
  ▼
<ScopeChangeRecord.Rejected>
```

关键说明:

- scope 变化必须显式发生,Query、projection 或 downstream 不能隐式改变参与范围或可见范围。
- visibility sealed 以后仍允许历史追溯,但不允许新增可见性扩展。
- `ScopeChangeRecord` 是 history,不能替代当前 `ParticipantScope` 或 `VisibilityScope` truth。

#### Conversation fact / append receipt 状态流转图

```text
<AppendConversationFact>
  │ accepted
  ▼
<ConversationFactState.Accepted>
  │ restrict visibility
  ▼
<ConversationFactState.VisibilityRestricted>
  │ policy release or explicit scope update
  ▼
<ConversationFactState.Accepted>

<ConversationFactState.Accepted>
  │ RetractConversationFact
  ▼
<ConversationFactState.Retracted>

<AppendConversationFact>
  │ source / boundary risk detected
  ▼
<ConversationFactState.Quarantined>

<AppendConversationFact>
  │ duplicate idempotency
  ▼
<FactAppendResult.Duplicate>

<AppendConversationFact>
  │ rejected by policy
  ▼
<FactAppendResult.Rejected>
```

关键说明:

- `Retracted` 不删除事实历史,只改变读取和传播状态。
- `Duplicate` 是幂等结果,不得重复生成 fact、trace 或 outbox。
- `Quarantined` 不能进入正常读取主线,必须由后续异常处理或人工决策承接。

#### Manifestation / reference 状态流转图

```text
<ManifestExternalFact>
  │ reference accepted and snapshot available
  ▼
<ManifestationState.Manifested>
  │ source version changed
  ▼
<ManifestationState.Stale>
  │ RefreshExternalReferenceSnapshots completed
  ▼
<ManifestationState.Manifested>

<ManifestationState.Manifested>
  │ revoke manifestation
  ▼
<ManifestationState.Revoked>

<ExternalFactRef>
  │ resolve started
  ▼
<ReferenceResolutionState.Pending>
  │ resolved and digest matched
  ▼
<ReferenceResolutionState.Fresh>
  │ source version changed
  ▼
<ReferenceResolutionState.Stale>
  │ refresh failed but reference displayable
  ▼
<ReferenceResolutionState.Unresolved>
  │ invalid source / permission / digest
  ▼
<ReferenceResolutionState.Invalid>
```

关键说明:

- `ManifestationState.Stale` 可以恢复为 `Manifested`,但必须保留来源版本变化的追溯。
- `ReferenceResolutionState.Invalid` 不能自动恢复为 `Fresh`,必须通过新的有效引用或人工处理。
- reference unresolved 不代表来源事实不存在,只代表本仓当前无法解析。

#### Projection / cursor 状态流转图

```text
<ProjectionFreshnessState.Fresh>
  │ truth changed or source changed
  ▼
<ProjectionFreshnessState.Stale>
  │ rebuild job started
  ▼
<ProjectionFreshnessState.Rebuilding>
  │ rebuild completed
  ▼
<ProjectionFreshnessState.Fresh>

<ProjectionFreshnessState.Rebuilding>
  │ rebuild failed
  ▼
<ProjectionFreshnessState.Failed>
  │ retry rebuild
  ▼
<ProjectionFreshnessState.Rebuilding>

<ProjectionFreshnessState.Fresh>
  │ projection explicitly disabled
  ▼
<ProjectionFreshnessState.Disabled>

<ConversationChangeCursorState.Active>
  │ projection behind truth
  ▼
<ConversationChangeCursorState.Stale>
  │ maintenance catches up
  ▼
<ConversationChangeCursorState.Active>

<ConversationChangeCursorState.Active>
  │ retention window exceeded
  ▼
<ConversationChangeCursorState.Expired>

<ConversationChangeCursorState.Active>
  │ participant / visibility scope changed
  ▼
<ConversationChangeCursorState.Invalidated>
```

关键说明:

- projection 状态只影响读取、降级和维护,不能反向改变 fact、scope 或 manifestation truth。
- cursor 续读必须重新校验 visibility,`Invalidated` 不能静默恢复为 `Active`。
- `Failed` 和 `Disabled` 都不能伪装为 fresh,Query 必须返回明确 marker 或 fallback。

#### Outbox publication 状态流转图

```text
<ConversationOutboxPublicationState.Pending>
  │ PublishConversationOutbox success
  ▼
<ConversationOutboxPublicationState.Published>

<ConversationOutboxPublicationState.Pending>
  │ publish failed and retry allowed
  ▼
<ConversationOutboxPublicationState.RetryPending>
  │ retry publish
  ▼
<ConversationOutboxPublicationState.Pending>

<ConversationOutboxPublicationState.RetryPending>
  │ retry exhausted or non-retryable failure
  ▼
<ConversationOutboxPublicationState.Failed>

<ConversationOutboxPublicationState.Pending>
  │ visibility / boundary suppresses publication
  ▼
<ConversationOutboxPublicationState.Suppressed>
```

关键说明:

- outbox 从已提交 truth 产生,不参与判断 truth 是否成立。
- `Failed` 不得回滚 fact、scope、manifestation 或 handoff truth。
- `Suppressed` 是正式发布取舍,不是丢失事件。

#### Trace / handoff 状态流转图

```text
<TraceRetentionState.Open>
  │ seal trace context
  ▼
<TraceRetentionState.Sealed>
  │ RequestTraceHandoff / RequestArchiveHandoff
  ▼
<TraceRetentionState.HandoffPending>
  │ retention window expired
  ▼
<TraceRetentionState.Expired>

<TraceHandoffState.Pending>
  │ DeliverTraceHandoff success
  ▼
<TraceHandoffState.HandedOff>

<TraceHandoffState.Pending>
  │ delivery failed and retry allowed
  ▼
<TraceHandoffState.RetryPending>
  │ retry delivery
  ▼
<TraceHandoffState.Pending>

<TraceHandoffState.RetryPending>
  │ retry exhausted
  ▼
<TraceHandoffState.Failed>

<TraceHandoffState.Pending>
  │ cancel handoff
  ▼
<TraceHandoffState.Cancelled>

<ArchiveHandoffState.Pending>
  │ DeliverArchiveHandoff success
  ▼
<ArchiveHandoffState.Archived>

<ArchiveHandoffState.Pending>
  │ delivery failed and retry allowed
  ▼
<ArchiveHandoffState.RetryPending>
  │ retry delivery
  ▼
<ArchiveHandoffState.Pending>

<ArchiveHandoffState.RetryPending>
  │ retry exhausted
  ▼
<ArchiveHandoffState.Failed>

<ArchiveHandoffState.Pending>
  │ cancel handoff
  ▼
<ArchiveHandoffState.Cancelled>
```

关键说明:

- trace / archive handoff 是后置交接,不决定 fact 或 manifestation 是否成立。
- `Expired` 只限制本地追溯材料保留,不表示历史 fact 被删除。
- handoff payload 必须保持脱敏引用化,状态机不承载 payload 实现细节。

---

## 7. 允许迁移清单

### 7.1 Truth / space / scope 允许迁移

- `Initial` -> `ConversationTruthState.Open`,触发动作:`CreateConversationSpace`。
- `ConversationTruthState.Open` -> `ConversationTruthState.ReadOnly`,触发动作:`CloseConversationSpace` 或写入冻结。
- `ConversationTruthState.Open` -> `ConversationTruthState.Restricted`,触发动作:可见性、治理或来源异常被确认。
- `ConversationTruthState.Restricted` -> `ConversationTruthState.Open`,触发动作:显式恢复或 policy release。
- `ConversationTruthState.ReadOnly` -> `ConversationTruthState.HandoffPending`,触发动作:`RequestTraceHandoff`、`RequestArchiveHandoff` 或 pending outbox。
- `ConversationTruthState.HandoffPending` -> `ConversationTruthState.Closed`,触发动作:必要 handoff 完成或关闭条件满足。
- `ConversationSpaceLifecycleState.Active` -> `ConversationSpaceLifecycleState.ReadOnly`,触发动作:`CloseConversationSpace` 或写入冻结。
- `ConversationSpaceLifecycleState.ReadOnly` -> `ConversationSpaceLifecycleState.Closed`,触发动作:space close 收口。
- `ConversationSpaceLifecycleState.Closed` -> `ConversationSpaceLifecycleState.Archived`,触发动作:archive handoff accepted。
- `ParticipantScopeState.Active` -> `ParticipantScopeState.Restricted`,触发动作:参与范围受限。
- `ParticipantScopeState.Restricted` -> `ParticipantScopeState.Active`,触发动作:显式范围更新或 policy release。
- `ParticipantScopeState.Active` -> `ParticipantScopeState.Closed`,触发动作:space close。
- `VisibilityScopeState.Open` -> `VisibilityScopeState.Restricted`,触发动作:`UpdateVisibilityScope` 收窄或治理限制。
- `VisibilityScopeState.Restricted` -> `VisibilityScopeState.Open`,触发动作:显式范围更新或 policy release。
- `VisibilityScopeState.Open` -> `VisibilityScopeState.Sealed`,触发动作:space close、archive 或显式封存。
- `ScopeChangeRecord.Applied` -> `ScopeChangeRecord.Superseded`,触发动作:后续 scope change applied。

### 7.2 Fact / manifestation / reference 允许迁移

- `AppendConversationFact` -> `ConversationFactState.Accepted`,触发动作:append policy 通过。
- `AppendConversationFact` -> `ConversationFactState.VisibilityRestricted`,触发动作:事实成立但读取受限。
- `ConversationFactState.Accepted` -> `ConversationFactState.VisibilityRestricted`,触发动作:visibility 收窄。
- `ConversationFactState.VisibilityRestricted` -> `ConversationFactState.Accepted`,触发动作:显式 visibility release。
- `ConversationFactState.Accepted` -> `ConversationFactState.Retracted`,触发动作:`RetractConversationFact`。
- `AppendConversationFact` -> `ConversationFactState.Quarantined`,触发动作:安全、边界或来源风险确认。
- `AppendConversationFact` -> `FactAppendResult.Duplicate`,触发动作:幂等命中。
- `AppendConversationFact` -> `FactAppendResult.Rejected`,触发动作:policy 拒绝或幂等冲突。
- `ManifestExternalFact` -> `ManifestationState.Manifested`,触发动作:引用和显化 policy 通过。
- `ManifestationState.Manifested` -> `ManifestationState.Stale`,触发动作:来源版本或 snapshot 过期。
- `ManifestationState.Stale` -> `ManifestationState.Manifested`,触发动作:`RefreshExternalReferenceSnapshots` 成功。
- `ManifestationState.Manifested` -> `ManifestationState.Revoked`,触发动作:显式撤销显化。
- `ManifestExternalFact` -> `ManifestationState.Unresolved`,触发动作:来源暂不可解析但引用可保留。
- `ReferenceResolutionState.Pending` -> `ReferenceResolutionState.Fresh`,触发动作:解析成功且 digest 匹配。
- `ReferenceResolutionState.Fresh` -> `ReferenceResolutionState.Stale`,触发动作:来源版本变化。
- `ReferenceResolutionState.Stale` -> `ReferenceResolutionState.Pending`,触发动作:刷新开始。
- `ReferenceResolutionState.Pending` -> `ReferenceResolutionState.Unresolved`,触发动作:解析失败但可降级展示。
- `ReferenceResolutionState.Pending` -> `ReferenceResolutionState.Invalid`,触发动作:引用格式、权限或 digest 无效。

### 7.3 Projection / cursor 允许迁移

- `ProjectionFreshnessState.Fresh` -> `ProjectionFreshnessState.Stale`,触发动作:truth、scope、reference 或 source position 变化。
- `ProjectionFreshnessState.Stale` -> `ProjectionFreshnessState.Rebuilding`,触发动作:rebuild job started。
- `ProjectionFreshnessState.Rebuilding` -> `ProjectionFreshnessState.Fresh`,触发动作:rebuild completed。
- `ProjectionFreshnessState.Rebuilding` -> `ProjectionFreshnessState.Failed`,触发动作:rebuild failed。
- `ProjectionFreshnessState.Failed` -> `ProjectionFreshnessState.Rebuilding`,触发动作:retry rebuild。
- `ProjectionFreshnessState.Fresh` -> `ProjectionFreshnessState.Disabled`,触发动作:projection explicitly disabled。
- `ConversationChangeCursorState.Active` -> `ConversationChangeCursorState.Stale`,触发动作:projection behind truth。
- `ConversationChangeCursorState.Stale` -> `ConversationChangeCursorState.Active`,触发动作:cursor maintenance catches up。
- `ConversationChangeCursorState.Active` -> `ConversationChangeCursorState.Expired`,触发动作:retention window exceeded。
- `ConversationChangeCursorState.Active` -> `ConversationChangeCursorState.Invalidated`,触发动作:participant / visibility scope changed。

### 7.4 Outbox / handoff 允许迁移

- `ConversationOutboxPublicationState.Pending` -> `ConversationOutboxPublicationState.Published`,触发动作:`PublishConversationOutbox` 成功。
- `ConversationOutboxPublicationState.Pending` -> `ConversationOutboxPublicationState.RetryPending`,触发动作:发布失败且允许重试。
- `ConversationOutboxPublicationState.RetryPending` -> `ConversationOutboxPublicationState.Pending`,触发动作:进入下一次发布尝试。
- `ConversationOutboxPublicationState.RetryPending` -> `ConversationOutboxPublicationState.Failed`,触发动作:重试耗尽或不可重试失败。
- `ConversationOutboxPublicationState.Pending` -> `ConversationOutboxPublicationState.Suppressed`,触发动作:visibility / boundary 明确不允许发布。
- `TraceRetentionState.Open` -> `TraceRetentionState.Sealed`,触发动作:seal trace context。
- `TraceRetentionState.Sealed` -> `TraceRetentionState.HandoffPending`,触发动作:`RequestTraceHandoff` 或 `RequestArchiveHandoff`。
- `TraceRetentionState.HandoffPending` -> `TraceRetentionState.Expired`,触发动作:本地保留窗口过期。
- `TraceHandoffState.Pending` -> `TraceHandoffState.HandedOff`,触发动作:`DeliverTraceHandoff` 成功。
- `TraceHandoffState.Pending` -> `TraceHandoffState.RetryPending`,触发动作:交接失败且允许重试。
- `TraceHandoffState.RetryPending` -> `TraceHandoffState.Pending`,触发动作:进入下一次交接尝试。
- `TraceHandoffState.RetryPending` -> `TraceHandoffState.Failed`,触发动作:重试耗尽。
- `TraceHandoffState.Pending` -> `TraceHandoffState.Cancelled`,触发动作:显式取消交接。
- `ArchiveHandoffState.Pending` -> `ArchiveHandoffState.Archived`,触发动作:`DeliverArchiveHandoff` 成功。
- `ArchiveHandoffState.Pending` -> `ArchiveHandoffState.RetryPending`,触发动作:归档交接失败且允许重试。
- `ArchiveHandoffState.RetryPending` -> `ArchiveHandoffState.Pending`,触发动作:进入下一次归档交接尝试。
- `ArchiveHandoffState.RetryPending` -> `ArchiveHandoffState.Failed`,触发动作:重试耗尽。
- `ArchiveHandoffState.Pending` -> `ArchiveHandoffState.Cancelled`,触发动作:显式取消归档交接。

---

## 8. 禁止迁移清单

### 8.1 Truth / space / scope 禁止迁移

- `ConversationTruthState.Closed` -> `ConversationTruthState.Open`:关闭后的 truth 不得被隐式重新打开,必须新建明确空间或走详细设计定义的人工恢复流程。
- `ConversationTruthState.HandoffPending` -> `ConversationTruthState.Open`:交接待处理不能被当作正常写入恢复。
- `ConversationSpaceLifecycleState.Archived` -> `ConversationSpaceLifecycleState.Active`:归档承接后不得恢复普通写入空间。
- `ParticipantScopeState.Closed` -> `ParticipantScopeState.Active`:关闭的参与范围不得隐式恢复。
- `VisibilityScopeState.Sealed` -> `VisibilityScopeState.Open`:封存可见范围不能被 Query 或 projection 打开。
- `ScopeChangeRecord.Rejected` -> `ScopeChangeRecord.Applied`:被拒绝的范围变化不得后续补写为成功。
- `ScopeChangeRecord.Superseded` -> current scope truth:历史记录不能替代当前 scope 对象。

### 8.2 Fact / manifestation / reference 禁止迁移

- `ConversationFactState.Retracted` -> `ConversationFactState.Accepted`:撤回事实不得被静默恢复为 fresh fact。
- `ConversationFactState.Quarantined` -> `ConversationFactState.Accepted`:隔离事实必须经过显式处理,不能自动进入正常主线。
- `FactAppendResult.Rejected` -> `ConversationFactState.Accepted`:拒绝结果不能后来补写成成功事实。
- `FactAppendResult.Duplicate` -> new `ConversationFactState.Accepted`:幂等命中不能创建新的 fact。
- `ManifestationState.Revoked` -> `ManifestationState.Manifested`:撤销显化不能自动恢复,必须重新显化并保留新记录。
- `ManifestationState.Unresolved` -> `ManifestationState.Manifested` without reference validation:不可解析来源不能绕过引用校验变成显化。
- `ReferenceResolutionState.Invalid` -> `ReferenceResolutionState.Fresh`:无效引用不能自动恢复,必须换成有效引用或人工处理。
- `ReferenceResolutionState.Unresolved` -> source truth:不可解析状态不能补造来源事实。

### 8.3 Projection / cursor 禁止迁移

- `ProjectionFreshnessState.Failed` -> `ProjectionFreshnessState.Fresh` without rebuild:失败投影不能不经重建直接标记为 fresh。
- `ProjectionFreshnessState.Disabled` -> `ProjectionFreshnessState.Fresh` by Query:Query 不能启用投影。
- `ProjectionFreshnessState.Stale` -> truth mutation:过期投影不能反向修改 truth。
- `ConversationChangeCursorState.Expired` -> `ConversationChangeCursorState.Active`:过期 cursor 不能继续续读,必须重新建立读取视图。
- `ConversationChangeCursorState.Invalidated` -> `ConversationChangeCursorState.Active`:范围变化导致失效的 cursor 不能静默恢复。
- `ChangeCursorProjection` -> fact sequence truth:cursor projection 不能改写事实序列。

### 8.4 Outbox / handoff 禁止迁移

- `ConversationOutboxPublicationState.Failed` -> rollback truth:发布失败不得回滚事实、范围、显化或 handoff truth。
- `ConversationOutboxPublicationState.Suppressed` -> `ConversationOutboxPublicationState.Published`:被抑制记录不能绕过 visibility / boundary 发布。
- `ConversationOutboxPublicationState.Published` -> `ConversationOutboxPublicationState.Pending`:已发布证据不能被静默重置。
- `TraceHandoffState.HandedOff` -> `TraceHandoffState.Pending`:交接成功不能被静默重置。
- `ArchiveHandoffState.Archived` -> `ArchiveHandoffState.Pending`:归档成功不能被静默重置。
- `TraceHandoffState.Failed` -> fact retraction:追溯交接失败不能导致事实撤回。
- `ArchiveHandoffState.Failed` -> history deletion:归档交接失败不能删除 Conversation history。

---

## 9. 状态传播关系图

#### Truth 状态变化传播关系图

```text
<Conversation Truth Change>
  │
  ▼
<ConversationOutboxRecord.Pending>
  │
  ▼
<PublishConversationOutbox>
  │
  ▼
<Bus / Downstream Awareness>

<Conversation Truth Change>
  │
  ▼
<ConversationProjectionState.Stale>
  │
  ▼
<Authorized Query Marker>
```

关键说明:

- truth 状态变化先形成 outbox 和 projection stale marker,不直接调用下游实现。
- outbox 发布结果只影响传播证据,不能反向改变 truth。
- Query 必须能看到 projection stale / failed / rebuilding marker。

#### Scope 状态变化传播关系图

```text
<ParticipantScope / VisibilityScope Change>
  │
  ▼
<ScopeChangeRecord.Applied>
  │
  ▼
<ConversationChangeCursor.Invalidated>
  │
  ▼
<Read Model / Search Projection Stale>
  │
  ▼
<Authorized Query Requires Recheck>
```

关键说明:

- scope 变化会导致 cursor 和读取投影需要重新校验,不能复用旧授权快照。
- downstream 只能收到已授权裁剪后的变化感知。
- 具体受影响 consumer 定位和批量失效策略留给详细设计。

#### Fact / manifestation 状态变化传播关系图

```text
<ConversationFact / CrossDomainManifestation State Change>
  │
  ▼
<ConversationTraceContext Updated>
  │
  ▼
<ConversationOutboxRecord.Pending>
  │
  ▼
<Read Model / Search / Cursor Projection Stale>
```

关键说明:

- fact 和 manifestation 的正式变化必须进入 trace 和 outbox。
- projection stale 是派生状态,不能替代 fact 或 manifestation truth。
- `Retracted`、`Revoked`、`Unresolved` 必须传递给只读视图或降级 marker。

#### Reference 状态变化传播关系图

```text
<ReferenceResolutionState Change>
  │
  ▼
<ExternalReferenceProjection Updated>
  │
  ▼
<CrossDomainManifestation Stale / Unresolved Marker>
  │
  ▼
<Read Model Degraded Display>
```

关键说明:

- reference 状态变化只影响本地 projection、manifestation freshness 和读取降级。
- 来源仓 truth 不会因为本仓 unresolved / invalid 而改变。
- display marker 不能包含来源正文或 secret。

#### Handoff 状态变化传播关系图

```text
<Trace / Archive Handoff State Change>
  │
  ▼
<Handoff Evidence Marker>
  │
  ▼
<ConversationTraceContext Retention Marker>
  │
  ▼
<Operations Report / Query Marker>
```

关键说明:

- handoff 状态变化只影响交接证据、retention marker 和运维报告。
- observability / archive 不能反写 Conversation fact truth。
- 失败和重试状态必须可审查,不能在后台静默吞掉。

---

## 10. 状态与处理流反查清单

| 状态机 | 触发处理流 | 需要详细设计继续展开 |
|---|---|---|
| Conversation truth / space | `CreateConversationSpace`、`CloseConversationSpace` | truth 与 space lifecycle 同步规则、并发检查、关闭前置条件 |
| Participant / visibility scope | `UpdateParticipantScope`、`UpdateVisibilityScope` | scope version、受影响 projection / cursor 定位、scope change history |
| Fact append | `AppendConversationFact`、`RetractConversationFact`、runtime / bridge consumer | 幂等冲突、隔离处理、撤回权限、receipt 与 fact 的一致性 |
| Manifestation / reference | `ManifestExternalFact`、来源 event consumer、`RefreshExternalReferenceSnapshots` | resolver port、digest 校验、snapshot freshness、unresolved / invalid 区分 |
| Projection / cursor | read model / search / cursor rebuild job、cursor query | fallback 策略、rebuild 并发、cursor token、过期窗口 |
| Outbox | `PublishConversationOutbox` | 发布批次、重试策略、抑制依据、发布证据 |
| Trace / handoff | `RequestTraceHandoff`、`RequestArchiveHandoff`、`DeliverTraceHandoff`、`DeliverArchiveHandoff` | payload 脱敏、handoff port、失败诊断、归档引用 |

---

## 11. 当前文档问题诊断与修正结果

| 诊断项 | 修正前风险 | 本步修正 |
|---|---|---|
| 状态散落在对象章节 | 详细设计容易自行推断状态迁移 | 将状态集合集中成 6 组状态机 |
| 处理流只写动作不写状态后果 | 后续实现不知道哪些 marker 必须暴露 | 补状态传播关系图和反查清单 |
| 派生状态和 truth 状态容易混淆 | projection 失败可能被误解为 truth 失败 | 明确禁止派生反写真相 |
| outbox / handoff 失败语义不清 | 实现可能回滚 truth 或吞掉失败 | 明确失败只影响传播 / 交接证据 |
| reference unresolved 语义不清 | 实现可能补造来源事实 | 明确 unresolved / invalid 不改变来源 truth |

---

## 12. 输出约束检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓存在正式状态机 | 通过 | 已按 6 组状态机收口 |
| 是否使用状态定义表 | 通过 | §5 使用规范要求的四列表 |
| 是否画状态流转 ASCII 图 | 通过 | §6 覆盖 truth、scope、fact、manifestation、projection、outbox、handoff |
| 是否列出允许迁移 | 通过 | §7 按状态机组列出核心允许迁移 |
| 是否列出禁止迁移 | 通过 | §8 按状态机组列出核心禁止迁移 |
| 是否画状态传播关系图 | 通过 | §9 覆盖 truth、scope、fact / manifestation、reference、handoff 传播 |
| 是否避免详细设计细节 | 通过 | 未写状态机代码、数据库列、错误码全集、重试参数、topic 或 UI 规则 |

---

## 13. 回填草稿

正式 `02-概要设计.md` §9 可以按以下结构回填:

```text
## 9. 状态定义与状态流转

### 9.1 状态机覆盖清单
摘录 `design-calibration/02_hld_step_09_state_machine.md` §4。

### 9.2 状态定义表
摘录 `design-calibration/02_hld_step_09_state_machine.md` §5。

### 9.3 状态流转图
摘录 `design-calibration/02_hld_step_09_state_machine.md` §6。

### 9.4 允许迁移清单
摘录 `design-calibration/02_hld_step_09_state_machine.md` §7。

### 9.5 禁止迁移清单
摘录 `design-calibration/02_hld_step_09_state_machine.md` §8。

### 9.6 状态传播关系
摘录 `design-calibration/02_hld_step_09_state_machine.md` §9。

### 9.7 状态与处理流反查
摘录 `design-calibration/02_hld_step_09_state_machine.md` §10。
```

回填时必须在 §9 开头列出本章引用来源:

- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`

---

## 14. 待确认事项

当前 Step 9 无阻塞性待确认事项。

后续 Step 10 需要继续确认:

- 哪些异常场景会使 `ConversationFactState.Quarantined`、`ReferenceResolutionState.Invalid`、`ProjectionFreshnessState.Failed` 或 handoff `Failed` 成为必经状态。
- 哪些边界场景只返回 rejected / unresolved / stale marker,不进入正式 truth 状态迁移。
- 哪些异常需要进入测试方案和验收标准的证据清单。

---

## 15. 进入下一步条件

Step 9 已满足进入 Step 10 的条件:

- 已明确本仓存在正式状态机。
- 状态集合、状态含义、核心允许迁移、核心禁止迁移和传播关系已收稳。
- 状态机与 Step 6 对象、Step 7 接口、Step 8 处理流可以互相反查。
- 状态机粒度足以支撑 Step 10 异常与边界场景继续展开。
