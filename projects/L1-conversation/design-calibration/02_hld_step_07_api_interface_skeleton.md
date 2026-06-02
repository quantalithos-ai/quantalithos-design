# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在 Step 6 已收稳关键对象轮廓后,把 `L1-conversation` 的正式入口按 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 分类,明确每类接口的输入骨架、输出骨架、读写性质和边界。

本步不写 HTTP path、RPC route、topic 命名、JSON / proto schema、字段全集、错误码、repository 函数或内部处理流。处理流留到 Step 8,状态机留到 Step 9。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 8 个主要组成部分和每部分职责边界 |
| `02_hld_step_06_key_objects.md` | 已完成 | 提供 30 个关键对象、状态、字段和函数骨架 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供需求层能力级接口面和外部依赖边界 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步、后台承接的通信方式判断 |

---

## 3. 接口分类说明

```text
Command API
  改写 Conversation truth,必须显式调用,必须携带 ActorContext、CommandMetadata 和幂等信息。

Query API
  读取正式 truth、projection 或 read model,不得改写 truth,必须携带 ActorContext 或 ConsumerContext。

Inbound Event Consumer
  消费来源仓已提交事实或变化通知,转成本地引用、显化、快照、状态推进或投影刷新意图。

Outbound Event
  传播本仓已提交 Conversation truth、变化感知或 handoff 意图,发布失败不得回滚 truth。

Operations Job
  基于已持久化 truth 做投影重建、快照刷新、outbox 发布、交接或一致性检查,不得生成新业务事实。
```

---

## 4. SOP 问题回答

### 4.1 哪些接口属于 Command，负责改写真相？

改写真相的入口包括:创建 / 关闭对话空间、更新参与范围、更新可见范围、追加对话事实、显化外部事实、撤回对话事实、创建复盘锚点、请求 trace handoff 和请求 archive handoff。这些入口都必须同步返回成立、拒绝、幂等命中或暂不可处理结果。

### 4.2 哪些接口属于 Query，只读取投影或只读视图？

只读入口包括:读取授权对话视图、读取事实、列出可见事实、读取变化游标、查询变化、检索历史、读取显化记录、读取追溯上下文、读取复盘锚点、读取投影状态和读取外部引用投影。Query 不得创建 fact、scope、manifestation、outbox、trace 或 projection truth。

### 4.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓？

需要异步进入的外部事实包括:work / project 上下文变化、governance 结论提交、artifact 版本或证据提交、runtime 结果性输出、bridges 映射后的外部事实、identity actor / participant 变化。Consumer 只能把这些输入转成引用、快照、显化意图、状态变化或投影刷新意图,不得复制来源正文。

### 4.4 哪些已提交事实需要通过 Outbound Event 对外传播？

需要传播的本仓事实包括:conversation space 变化、participant / visibility scope 变化、fact append、fact retraction、cross-domain manifestation 变化、conversation change available、trace handoff requested、archive handoff requested 和 projection state changed。

### 4.5 哪些动作属于 Operations Job，而不是业务 command？

投影重建、搜索索引重建、变化游标维护、外部引用快照刷新、outbox 发布、trace handoff 交付、archive handoff 交付、一致性检查和过期游标清理属于 Operations Job。它们只维护派生、传播、交接或诊断结果,不隐式创建业务事实。

### 4.6 输入骨架的 metadata 口径是什么？

| 接口类别 | metadata 口径 |
|---|---|
| Command API | 必须携带 `ActorContext`、`CommandMetadata` 和 `IdempotencyKey`;系统触发入口可使用 `SystemActorRef` 作为 actor 来源 |
| Query API | 必须携带 `ActorContext` 或 `ConsumerContext`;可按需携带 `QueryMetadata`、分页和一致性要求 |
| Inbound Event Consumer | 必须携带来源事件、`EventEnvelopeRef`、`EventId`、`EventSourceRef` 和消费幂等键 |
| Outbound Event | 来自已提交 outbox record,必须能回指 committed truth ref 和 visibility / redaction 判断 |
| Operations Job | 必须携带 `JobMetadata`、`JobRunId`、范围输入和触发来源;不得伪装成用户 command |

---

## 5. Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `CreateConversationSpace` | `CreateConversationSpaceCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `ConversationSpaceCommandResult` | 建立对话空间、初始参与范围、初始可见范围和 truth state | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationTruthState`、`ScopeChangeRecord`、`ConversationOutboxRecord` |
| `CloseConversationSpace` | `CloseConversationSpaceCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `ConversationSpaceCommandResult` | 校验空间状态和 actor 权限,关闭或转只读 | `ConversationSpace` lifecycle、`ConversationTruthState`、`ScopeChangeRecord`、`ConversationOutboxRecord` |
| `UpdateParticipantScope` | `UpdateParticipantScopeCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `ParticipantScopeCommandResult` | 变更对话参与范围并记录变化依据 | `ParticipantScope`、`ScopeChangeRecord`、`ConversationOutboxRecord` |
| `UpdateVisibilityScope` | `UpdateVisibilityScopeCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `VisibilityScopeCommandResult` | 变更可见范围并使受影响读取视图或游标失效 | `VisibilityScope`、`ScopeChangeRecord`、`ConversationChangeCursor` state、`ConversationOutboxRecord` |
| `AppendConversationFact` | `AppendConversationFactCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `FactAppendReceipt` | 校验 space、participant、visibility、source 和 append policy 后追加事实 | `ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext`、`ConversationOutboxRecord` |
| `RetractConversationFact` | `RetractConversationFactCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `FactAppendReceipt` | 按可见范围和策略撤回事实,保留追溯依据 | `ConversationFact` state、`ConversationTraceContext`、`ConversationOutboxRecord` |
| `ManifestExternalFact` | `ManifestExternalFactCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `ManifestExternalFactResult` | 校验外部引用、快照、可见范围和显化策略后形成显化记录 | `CrossDomainManifestation`、`ExternalFactSnapshot`、`ConversationFact`、`ConversationTraceContext`、`ConversationOutboxRecord` |
| `CreateReviewAnchor` | `CreateReviewAnchorCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `ReviewAnchorCommandResult` | 为事实、显化、scope change 或 handoff 创建复盘定位点 | `ReviewAnchor`、`ConversationTraceContext`、`ConversationOutboxRecord` |
| `RequestTraceHandoff` | `RequestTraceHandoffCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `TraceHandoffCommandResult` | 为追溯上下文创建 observability 交接意图 | `TraceHandoffRecord`、`ConversationOutboxRecord` |
| `RequestArchiveHandoff` | `RequestArchiveHandoffCommand`、`ActorContext`、`CommandMetadata`、`IdempotencyKey` | `ArchiveHandoffCommandResult` | 为对话空间或追溯上下文创建 archive 交接意图 | `ArchiveHandoffRecord`、`ConversationOutboxRecord` |

Command 边界说明:

- Command 成功只表示 Conversation 本仓同步边界内的 truth 或 handoff 意图已成立。
- outbox 发布、投影重建、快照刷新、trace / archive 实际交付不属于 Command 成功前置。
- Command 不直接保存外部来源正文、runtime 推理过程、bridge message body、artifact body 或 governance decision body。

---

## 6. Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetConversationReadModel` | `GetConversationReadModelQuery`、`ConsumerContext`、`QueryMetadata` | `ConversationReadModel` | read projection、visibility scope、external reference projection | 只读;必须经过 `VisibilityPolicy` 裁剪 |
| `ListConversationFacts` | `ListConversationFactsQuery`、`ConsumerContext`、`QueryMetadata`、`PageRequest` | `ConversationFactPage` | fact history、read model、visibility scope | 只读;不可通过分页或排序绕过可见范围 |
| `GetConversationFact` | `GetConversationFactQuery`、`ConsumerContext`、`QueryMetadata` | `ConversationFactView` | fact history、visibility scope、external snapshot | 只读;不可输出不可见 fact |
| `GetConversationChangeCursor` | `GetConversationChangeCursorQuery`、`ConsumerContext`、`QueryMetadata` | `ConversationChangeCursor` | cursor store、visibility scope、projection state | 只读;游标不可成为事实顺序 truth |
| `PollConversationChanges` | `PollConversationChangesQuery`、`ConsumerContext`、`QueryMetadata` | `ConversationChangePage` | change cursor projection、outbox projection、visibility scope | 只读;只返回 consumer 可见变化 |
| `SearchConversationHistory` | `SearchConversationHistoryQuery`、`ConsumerContext`、`QueryMetadata`、`PageRequest` | `ConversationSearchResultPage` | search index projection、read model、visibility scope | 只读;搜索结果必须回指 fact / manifestation ref |
| `GetCrossDomainManifestation` | `GetCrossDomainManifestationQuery`、`ConsumerContext`、`QueryMetadata` | `CrossDomainManifestationView` | manifestation store、external snapshot、reference projection | 只读;不解析或拉取来源正文 |
| `GetConversationTraceContext` | `GetConversationTraceContextQuery`、`ActorContext`、`QueryMetadata` | `ConversationTraceContextView` | trace context store、review anchors、visibility policy | 只读;仅输出允许复盘的引用和摘要 |
| `GetReviewAnchor` | `GetReviewAnchorQuery`、`ActorContext`、`QueryMetadata` | `ReviewAnchorView` | review anchor store、trace context store | 只读;不替代 governance decision |
| `GetConversationProjectionState` | `GetConversationProjectionStateQuery`、`ActorContext`、`QueryMetadata` | `ConversationProjectionStateView` | projection state store | 只读;用于维护和诊断,不得反写真相 |
| `GetExternalReferenceProjection` | `GetExternalReferenceProjectionQuery`、`ConsumerContext`、`QueryMetadata` | `ExternalReferenceProjectionView` | external reference projection、snapshot store | 只读;必须暴露 stale / unresolved / invalid 状态 |

Query 边界说明:

- Query 不开启 truth 写入,不追加 fact,不改变 scope,不隐式显化外部事实。
- Query 可以返回 stale、unresolved、not visible、projection rebuilding 等状态,不得伪装为 fresh。
- Query 可以读取 projection,但 projection 不是第二 truth。

---

## 7. Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeWorkContextChanged` | `L1-work` / `L0-bus` | `WorkContextChangedEvent`、`EventEnvelopeRef`、`EventId`、`EventSourceRef`、`IdempotencyKey` | 更新 `ExternalReferenceProjection` 或标记相关 reference stale | 不复制 project / work 正文,不创建 conversation fact |
| `ConsumeGovernanceFactCommitted` | `L1-governance` / `L0-bus` | `GovernanceFactCommittedEvent`、`EventEnvelopeRef`、`EventId`、`EventSourceRef`、`IdempotencyKey` | 形成显化候选、更新 `ExternalFactRef` / `ExternalFactSnapshot` 或触发 manifest review | 不裁决 governance,不保存裁决正文 |
| `ConsumeArtifactFactCommitted` | `L1-artifact` / `L0-bus` | `ArtifactFactCommittedEvent`、`EventEnvelopeRef`、`EventId`、`EventSourceRef`、`IdempotencyKey` | 更新 artifact 外部引用投影或形成显化候选 | 不保存 artifact body、version body 或 evidence body |
| `ConsumeRuntimeResultCommitted` | `L2-runtime` / formal boundary | `RuntimeResultCommittedEvent`、`EventEnvelopeRef`、`EventId`、`EventSourceRef`、`IdempotencyKey` | 将 runtime 结果性输出转为 `FactSourceRef` 并按策略追加或挂起 | 不保存推理过程、memory 或 tool 原始调用过程 |
| `ConsumeBridgeMappedFactReceived` | `L6-bridges` / formal boundary | `BridgeMappedFactReceivedEvent`、`EventEnvelopeRef`、`EventId`、`EventSourceRef`、`IdempotencyKey` | 将外部平台映射结果转成 fact append 输入或 external ref snapshot | 不直接理解外部平台协议,不保存 message body |
| `ConsumeIdentityActorChanged` | `L1-identity` / formal boundary | `IdentityActorChangedEvent`、`EventEnvelopeRef`、`EventId`、`EventSourceRef`、`IdempotencyKey` | 更新 actor 展示快照、引用解析状态或使相关 read model stale | 不改变 member lifecycle,不替代 identity truth |

Inbound 边界说明:

- Consumer 处理的来源事件必须携带 event id、source ref、envelope ref 和幂等键。
- Consumer 不能绕过 Command policy 直接写不满足 space / scope / visibility 的 fact。
- 来源仓事实进入本仓只能形成 reference、snapshot、manifestation、fact append input 或 projection state,不得复制来源正文。

---

## 8. Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ConversationSpaceChangedEvent` | `ConversationSpace` / `ScopeChangeRecord` committed | Chat、Workspace、Runtime、reports | 表达对话空间生命周期或 owner 边界变化 |
| `ConversationScopeChangedEvent` | `ParticipantScope` / `VisibilityScope` / `ScopeChangeRecord` committed | Chat、Workspace、Runtime、projection maintenance | 表达参与范围或可见范围变化,下游必须重新裁剪视图 |
| `ConversationFactAppendedEvent` | `ConversationFact` / `FactAppendReceipt` committed | Chat、Workspace、Runtime、Bridges、projection maintenance | 表达新事实已追加,只传播 ref、状态、摘要 marker |
| `ConversationFactRetractedEvent` | `ConversationFact` state changed | Chat、Workspace、Runtime、projection maintenance | 表达事实被撤回或受限,下游不得继续当作可见 fresh fact |
| `CrossDomainManifestationChangedEvent` | `CrossDomainManifestation` committed / state changed | Chat、Workspace、Runtime、reports | 表达跨域显化新增、过期、撤销或不可解析 |
| `ConversationChangeAvailableEvent` | `ConversationOutboxRecord` / change cursor projection | Chat、Workspace、Runtime、SDK consumers | 表达有新的可感知变化,不等于完整 fact payload |
| `TraceHandoffRequestedEvent` | `TraceHandoffRecord` pending | Observability、reports | 表达追溯材料需要 observability 承接 |
| `ArchiveHandoffRequestedEvent` | `ArchiveHandoffRecord` pending | Archive、reports | 表达对话历史或追溯材料需要 archive 承接 |
| `ConversationProjectionStateChangedEvent` | `ConversationProjectionState` state changed | Operations、reports、read consumers | 表达 read model、index、cursor 或 reference projection freshness 变化 |

Outbound 边界说明:

- Outbound Event 必须来自已提交 truth、handoff record、outbox record 或 projection state。
- 发布失败只改变 outbox / handoff 状态,不得回滚已提交 truth。
- Event payload 只携带 ref、state、summary marker、digest 或 visibility marker,不携带来源正文。

---

## 9. Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `PublishConversationOutbox` | `ConversationOutboxRecord` pending page、`JobMetadata`、`JobRunId` | published marker、retry marker 或 failure marker | 只发布已提交 outbox,不得创建新业务事实 |
| `RebuildConversationReadModels` | conversation truth range、projection state、`JobMetadata`、`JobRunId` | `ConversationReadModel` projection、`ConversationProjectionState` | 可重建、可失败、可延迟,不得反写真相 |
| `RebuildConversationSearchIndex` | fact / manifestation range、search projection state、`JobMetadata`、`JobRunId` | `SearchIndexProjection`、projection state | 只维护检索辅助,不得保存 forbidden body |
| `MaintainConversationChangeCursors` | outbox / fact sequence range、cursor projection state、`JobMetadata`、`JobRunId` | `ChangeCursorProjection`、cursor stale / invalid marker | 只维护变化位置,不绑定具体推送协议 |
| `RefreshExternalReferenceSnapshots` | external reference projection range、source resolver boundary、`JobMetadata`、`JobRunId` | `ExternalFactSnapshot`、`ReferenceResolutionState`、`ExternalReferenceProjection` | 只刷新快照和解析状态,不拥有来源 truth |
| `DeliverTraceHandoff` | `TraceHandoffRecord` pending page、`JobMetadata`、`JobRunId` | handed off、retry 或 failed handoff state | 只交接脱敏追溯材料,observability 不反写 truth |
| `DeliverArchiveHandoff` | `ArchiveHandoffRecord` pending page、`JobMetadata`、`JobRunId` | archived、retry 或 failed handoff state | 只交接 archive 引用或材料,不保存归档包正文 |
| `ValidateConversationConsistency` | conversation truth range、projection state、reference state、`JobMetadata`、`JobRunId` | consistency report ref、diagnostic marker | 只输出诊断和修复建议,不得自动覆盖 truth |
| `CleanupExpiredConversationCursors` | expired cursor range、retention policy、`JobMetadata`、`JobRunId` | expired marker、cleanup evidence ref | 只清理派生消费状态,不得删除正式事实 |

Operations 边界说明:

- Job 成功不等于业务 fact 成立,只代表维护、重建、交接或诊断动作完成。
- Job 失败必须保留 stale、retry、failed、unresolved 或 diagnostic marker。
- Job 不得把维护结果写成 `ConversationFact` 或 `CrossDomainManifestation`。

---

## 10. 接口与对象承接矩阵

| 接口组 | 主要承接对象 | 后续处理流位置 |
|---|---|---|
| Space / scope Commands | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord`、`ConversationOutboxRecord` | Step 8 |
| Fact append Commands / Consumers | `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt`、`ConversationTraceContext` | Step 8 / Step 9 |
| Manifestation Commands / Consumers | `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy` | Step 8 / Step 9 |
| Authorized Query APIs | `ConversationReadModel`、`ConversationChangeCursor`、`VisibilityPolicy`、`ExternalReferenceProjection` | Step 8 |
| Trace / review APIs | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` | Step 8 / Step 9 |
| Derived / operations jobs | `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`ExternalReferenceProjection`、`ReferenceResolutionState` | Step 8 / Step 9 |

---

## 11. 当前文档问题诊断

| 旧线索 | 问题 | 本步处理 |
|---|---|---|
| `StreamEvents` / AG-UI 事件映射 | 把传输协议提前写成接口主线 | 改为 `ConversationChangeAvailableEvent` 和 cursor / read model 查询骨架,协议后移 |
| Turn / message CRUD | 会把对话事实退化为消息表 | 改为 `AppendConversationFact`、`ConversationFact` 和 append-only history |
| 外部仓事件直接转 Turn | 容易复制来源正文或接管来源 truth | 改为 Inbound Consumer 只形成 ref、snapshot、manifestation 或 fact append input |
| Search / projection 当核心能力 | 会让派生辅助阻塞核心 truth | 改为 Operations Job 和 Query 读取 projection |
| Archive / observability 同步完成 | 横切系统失败可能反向污染业务状态 | 改为 handoff record + outbound event + delivery job |

---

## 12. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只沿用需求层能力接口名 | 简洁 | 不能支撑详细设计定义 command / query / event / job | 不采用 |
| 方案 B: 按 Command / Query / Event / Job 收稳正式接口骨架 | 能直接支撑 Step 8 处理流和详细设计协议契约 | 名称更多,需要后续保持一致 | 采用 |
| 方案 C: 直接写 HTTP / topic / JSON schema | 实现看起来直接 | 越过概要设计边界,也会过早锁死协议 | 不采用 |
| 方案 D: 把所有异步输入都作为 Command | 统一入口 | 会混淆来源事实送达、幂等消费和同步成立判断 | 不采用 |

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”应摘录本文件 §3 的接口分类说明。
- §7 必须保留本文件 §5~§9 的 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 骨架表。
- §7 可摘录本文件 §10 的接口与对象承接矩阵,用于说明 Step 8 / Step 9 如何继续展开。
- 不在正式概要设计中补 HTTP path、topic、JSON / proto schema、错误码或 repository 函数。

---

## 14. 待确认事项

### 14.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 `StreamEvents` / AG-UI 作为本仓正式接口名 | A. 保留;B. 不保留,只保留变化感知事件和 cursor 查询骨架 | B | AG-UI / stream 是下游协议形态,不是 Conversation truth 接口主语 | 已按 B 执行 |
| `Runtime` 结果进入 Conversation 走 Command 还是 Consumer | A. 只走 Command;B. 只走 Consumer;C. 两种入口均可,但都必须经过 append policy | C | Runtime 可能同步提交结果性 fact,也可能异步送达结果;关键是不能保存推理过程 | 已按 C 执行 |
| `TraceHandoff` / `ArchiveHandoff` 是 Command 还是 Job | A. 都是 Command;B. 请求是 Command,交付是 Job;C. 都是 Job | B | 请求会形成本仓 handoff intent,实际交付是运维 / 外部协作动作 | 已按 B 执行 |
| 是否把外部引用刷新写成业务 Command | A. 是;B. 否,写成 Operations Job | B | 引用刷新只维护 snapshot / projection,不能生成业务事实 | 已按 B 执行 |

### 14.2 本 Step 未确认事项

本步不新增阻塞 Step 8 的待确认事项。若 Step 8 发现某个处理流需要新的正式入口,必须先回到本文件补接口骨架,再展开处理流。

---

## 15. 进入下一步条件

- 已明确 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 五类接口。
- Command 输入骨架已显式携带 `ActorContext`、`CommandMetadata` 和 `IdempotencyKey`。
- Query 输入骨架已显式携带 `ActorContext` 或 `ConsumerContext`。
- Event Consumer 输入骨架已显式携带 event、envelope、event id、source ref 和幂等键。
- 已明确每类接口的读写性质、边界和本地结果。
- 未写 HTTP path、完整 JSON / proto schema、topic 目录、回调参数全集、错误码或内部处理流。
- 可以进入 Step 8“关键处理流 / 重要函数数据流”。
