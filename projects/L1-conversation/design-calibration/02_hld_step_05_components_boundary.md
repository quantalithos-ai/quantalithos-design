# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 已经区分业务主要组成部分与实现分层的基础上,收稳 `L1-conversation` 的主要组成部分、各自职责、不承担职责、包含的代码主体 / 模块和对象发现线索。

本步建立 Step 6 的对象候选池,但不展开对象字段、状态集合、成员函数、工厂函数、接口 schema、repository 函数或事务细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth center、数据归属、授权视野、派生只读、通信分层和配置不可越界约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供业务主要组成部分、代码主体骨架和实现分层区别 |
| `01-架构设计.md` §4 / §6 / §8 / §9 / §10 | 已完成 | 提供职责边界、上下文划分、依赖方向、数据所有权和通信方式 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 作为旧对象线索和串层问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面，本仓应被划分为哪些主要组成部分？

当前概要设计层面,`L1-conversation` 划分为 8 个主要组成部分:

1. `Conversation truth core`
2. `Space / scope management`
3. `Collaborative fact append`
4. `Authorized consumption`
5. `Cross-domain manifestation`
6. `History trace / review`
7. `Derived consumption support`
8. `Local reference / snapshot / projection support`

这些是业务结构主语,不是代码目录、外部系统、类名或函数名。每个主要组成部分后续都可以跨越 Inbound、Application Services、Domain Model、Ports、Persistence、Projection、Outbox、Operations 等实现分层。

### 3.2 每个主要组成部分分别承担什么职责？

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Conversation truth core` | 保护 Conversation truth 的统一边界、关键不变量、一致性和 outbox 成立口径 | `ConversationTruthState`、`ConversationTruthPolicy`、`ConversationTruthRepository`、`ConversationOutboxRepository` | 不定义 UI、外部平台、runtime、governance、artifact、identity 或 archive truth |
| `Space / scope management` | 建立和维护对话空间、参与范围、可见范围 | `ConversationSpaceCommandService`、`ParticipantScopeCommandService`、`VisibilityScopeCommandService`、`ConversationSpace`、`ParticipantScope`、`VisibilityScope` | 不拥有成员生命周期、项目生命周期或全局授权裁决 |
| `Collaborative fact append` | 将人类、AI member 和系统结果性事实追加为正式对话事实 | `ConversationFactAppendService`、`ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`ConversationFactHistoryRepository` | 不保存 runtime 推理过程、tool 调用过程或外部消息正文 |
| `Authorized consumption` | 在参与范围和可见范围内提供查询、订阅、变化感知和下游读取 | `AuthorizedConversationQueryService`、`VisibilityPolicy`、`ConversationReadModel`、`ConversationChangeCursor`、`ConversationProjectionRepository` | 不绕过可见范围,不把 read model 反写真相 |
| `Cross-domain manifestation` | 将来源仓正式事实以引用、快照或显化记录方式进入对话视野 | `ConversationManifestationService`、`CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ReferenceValidityPolicy` | 不拥有来源仓正文、裁决、版本、成员或外部平台生命周期 |
| `History trace / review` | 支撑对话历史、关键变化、显化记录的复盘、审计和追溯交接 | `ConversationTraceReviewService`、`ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord` | 不拥有全局 trace store、metrics、长期归档包正文或恢复主体 |
| `Derived consumption support` | 维护派生视图、索引、变化游标、检索定位和重建状态 | `ConversationDerivedMaintenanceService`、`ProjectionRebuildJob`、`ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection` | 不生成新业务事实,不阻塞核心 truth 成立 |
| `Local reference / snapshot / projection support` | 承载外部引用、展示快照、解析状态和本地影子投影 | `ExternalSnapshotRefreshJob`、`ExternalReferenceSnapshotRepository`、`ExternalReferenceProjection`、`ReferenceResolutionState` | 不保存外部正文,不替代 Identity / Work / Governance / Artifact truth |

### 3.3 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

| 相关内容 | 归属 | 本仓正确处理方式 |
|---|---|---|
| Chat UI 展示、输入框、已读、折叠、草稿 | `L5-chat` | 只消费授权 Conversation facts 或 read model |
| Workspace 个人视野、项目视野、inbox 聚合 | `L1-workspace` | 只消费授权事实、变化感知或派生视图 |
| Runtime 推理过程、memory、tool 调用轨迹 | `L2-runtime` / `L2-tools` | 只将结果性事实通过正式边界追加 |
| Bridges 外部平台 message / channel / account lifecycle | `L6-bridges` | 只通过映射结果、引用或外部消息快照进入对话 |
| Governance Gate / Policy / Approval 裁决正文 | `L1-governance` | 只显化治理结论引用或快照 |
| Artifact 正文、版本、证据链真相 | `L1-artifact` | 只显化产物引用、摘要或快照 |
| Identity 成员生命周期、认证、全局授权裁决 | `L1-identity` 或安全 / 治理边界 | 只保存 actor / participant 引用和展示快照 |
| 全局观测日志、metrics、长期归档包正文 | `L4-observability` / `L4-archive` | 只提供追溯上下文、交接记录和引用 |

### 3.4 哪些候选对象必须进入 Step 6 独立成节展开？

Step 6 必须从本步对象候选池中正式筛选并独立展开以下对象候选:

- truth / state: `ConversationTruthState`、`ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationFact`、`CrossDomainManifestation`、`ConversationProjectionState`、`ReferenceResolutionState`
- policy / invariant: `ConversationTruthPolicy`、`VisibilityPolicy`、`FactAppendPolicy`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`DerivedViewPolicy`、`TraceRetentionPolicy`
- projection / read model: `ConversationReadModel`、`ConversationChangeCursor`、`SearchIndexProjection`、`ChangeCursorProjection`、`ExternalReferenceProjection`
- reference / boundary: `FactSourceRef`、`ExternalFactRef`、`ExternalFactSnapshot`
- audit / history: `ScopeChangeRecord`、`FactAppendReceipt`、`ConversationOutboxRecord`、`ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`

Repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table 和 job runner 不在 Step 6 当领域对象展开;它们后续进入 Step 7、Step 8 或详细设计。

---

## 4. 结构化中间产物

### 4.1 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Conversation truth core` | `ConversationTruthState` | `ConversationTruthPolicy` | - | - | `ConversationOutboxRecord` | `ConversationTruthState`、`ConversationTruthPolicy`、`ConversationOutboxRecord` |
| `Space / scope management` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope` | `VisibilityPolicy` | visibility snapshot 线索 | actor / project scope ref 线索 | `ScopeChangeRecord` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`VisibilityPolicy`、`ScopeChangeRecord` |
| `Collaborative fact append` | `ConversationFact` | `FactAppendPolicy` | - | `FactSourceRef` | `FactAppendReceipt` | `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt` |
| `Authorized consumption` | cursor state 线索 | `VisibilityPolicy` | `ConversationReadModel`、`ConversationChangeCursor` | consumer scope ref 线索 | read audit marker 线索 | `ConversationReadModel`、`ConversationChangeCursor`、`VisibilityPolicy` |
| `Cross-domain manifestation` | `CrossDomainManifestation` | `ManifestationPolicy`、`ReferenceValidityPolicy` | manifestation view 线索 | `ExternalFactRef`、`ExternalFactSnapshot` | manifestation audit 线索 | `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy` |
| `History trace / review` | trace handoff state 线索 | `TraceRetentionPolicy` | review read model 线索 | trace / archive handoff ref 线索 | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord` | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` |
| `Derived consumption support` | `ConversationProjectionState`、rebuild state 线索 | `DerivedViewPolicy` | `SearchIndexProjection`、`ChangeCursorProjection` | projection source ref 线索 | rebuild history 线索 | `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`DerivedViewPolicy` |
| `Local reference / snapshot / projection support` | `ReferenceResolutionState` | `ReferenceValidityPolicy` | `ExternalReferenceProjection` | `ExternalFactSnapshot`、external object ref 线索 | snapshot refresh history 线索 | `ReferenceResolutionState`、`ExternalReferenceProjection`、`ExternalFactSnapshot`、`ReferenceValidityPolicy` |

### 4.2 各部分交互总图

```text
+====================================================================+
|                  L1-conversation component flow                    |
+====================================================================+
|                                                                    |
|  Space / scope management                                          |
|       | establishes space / participant / visibility                |
|       v                                                            |
|  +-------------------------+                                       |
|  | Conversation truth core |<-------------------------------+      |
|  +-----------+-------------+                                |      |
|              ^                                              |      |
|              | appends facts                                |      |
|  Collaborative fact append                                  |      |
|              |                                              |      |
|              v                                              |      |
|  Cross-domain manifestation ---- uses refs / snapshots -----+      |
|              |                                                     |
|              v                                                     |
|  History trace / review ---- handoff ----> observability / archive |
|              ^                                                     |
|              |                                                     |
|  Authorized consumption <---- Derived consumption support           |
|              ^                    ^                                |
|              |                    | refresh / rebuild              |
|              +---- Local reference / snapshot / projection support |
|                                                                    |
+====================================================================+
```

关键说明：

- 图只表达主要组成部分之间的大体交互和交接方向,不表达协议字段、函数调用链、详细时序或数据库结构。
- `Conversation truth core` 是中心边界,但业务操作通过 Space / scope、Fact append、Manifestation、Consumption、Trace 和 Derived support 承接。
- Derived support 和 Local reference / snapshot / projection support 只能支撑读取、显化、追溯和降级显示,不能反写真相。
- Observability / Archive 只作为交接方向出现,不是本仓内部主要组成部分。

---

## 5. 各主要组成部分

### 5.1 Conversation truth core

#### 5.1.1 本部分职责

- 维护 Conversation truth 的统一边界和不变量。
- 约束对话空间、范围、事实、显化记录和追溯上下文必须在同一 truth 口径下成立。
- 为已成立事实形成 outbox / handoff 意图,但不负责外部传播成功。

#### 5.1.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConversationTruthState` | state object | 表达 Conversation truth 是否成立、可写、可读、待交接或受限 | Step 6 / Step 9 |
| `ConversationTruthPolicy` | policy | 保护 truth 归属、正文排除、派生不反写和同步成立边界 | Step 6 |
| `ConversationOutboxRecord` | outbox record | 表达已成立 Conversation truth 需要传播、交接或重试的意图和状态 | Step 6 / Step 8 / Step 9 |
| `ConversationTruthRepository` | persistence port | 保存对话空间、范围、事实、显化和追溯核心 truth | 留给详细设计 |
| `ConversationOutboxRepository` | outbox store | 保存已成立事实的传播或交接意图 | Step 7 / Step 8 / 详细设计 |

#### 5.1.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ConversationTruthState` | Step 6 独立成节 |
| Policy / Invariant | `ConversationTruthPolicy` | Step 6 独立成节 |
| Projection / Read model | - | 不展开 |
| Reference / Boundary | - | 不展开 |
| Audit / History | `ConversationOutboxRecord` | Step 6 独立成节 |

#### 5.1.4 本部分不承担什么

- 不定义 Chat UI 展示状态。
- 不拥有 Runtime memory、tool 调用过程或 Bridges 外部消息生命周期。
- 不拥有 Governance、Artifact、Work、Identity、Observability 或 Archive 的正文 truth。

#### 5.1.5 与其他部分的接缝

- 接收 Space / scope management 已成立的空间和范围变化。
- 接收 Collaborative fact append 和 Cross-domain manifestation 的正式写入结果。
- 为 Authorized consumption、History trace / review 和 Derived consumption support 提供 truth 来源。

### 5.2 Space / scope management

#### 5.2.1 本部分职责

- 建立和维护对话空间、参与范围和可见范围。
- 判断 actor、项目上下文或系统触发是否允许改变空间 / 范围。
- 为事实追加、授权消费、显化和追溯提供空间与范围边界。

#### 5.2.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConversationSpaceCommandService` | application service | 编排创建、关闭、归档或恢复对话空间 | Step 7 / Step 8 |
| `ParticipantScopeCommandService` | application service | 编排参与范围变更 | Step 7 / Step 8 |
| `VisibilityScopeCommandService` | application service | 编排可见范围变更 | Step 7 / Step 8 |
| `ConversationSpace` | truth object | 表达对话空间归属、类型和生命周期边界 | Step 6 / Step 9 |
| `ParticipantScope` | truth object | 表达哪些 actor 被纳入对话参与范围 | Step 6 / Step 9 |
| `VisibilityScope` | truth object | 表达哪些事实对哪些消费方可见 | Step 6 / Step 9 |
| `VisibilityPolicy` | policy | 判断读取、订阅、显化和维护是否满足可见边界 | Step 6 |
| `ScopeChangeRecord` | history record | 记录 space、participant scope 或 visibility scope 的正式变化和追溯依据 | Step 6 / Step 8 / Step 9 |

#### 5.2.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ConversationSpace`、`ParticipantScope`、`VisibilityScope` | Step 6 独立成节 |
| Policy / Invariant | `VisibilityPolicy` | Step 6 独立成节 |
| Projection / Read model | visibility snapshot 线索 | 可作为 read model 输入,本步不独立成节 |
| Reference / Boundary | actor ref、project / work context ref 线索 | 字段类型或 port 输入,不当领域对象展开 |
| Audit / History | `ScopeChangeRecord` | Step 6 独立成节 |

#### 5.2.4 本部分不承担什么

- 不创建、退休或改变 Identity member 生命周期。
- 不拥有项目、工作项或 workspace 个人 / 项目视野。
- 不做全局认证、全局授权裁决或治理审批。

#### 5.2.5 与其他部分的接缝

- 向 Conversation truth core 提交已成立的 space / scope truth。
- 为 Collaborative fact append 和 Authorized consumption 提供必要边界。
- 通过 Local reference / snapshot / projection support 读取 actor、项目或工作上下文快照,但不拥有其正文。

### 5.3 Collaborative fact append

#### 5.3.1 本部分职责

- 将人类发言、AI member 结果性输出、系统可见事实和外部映射结果追加为正式 Conversation fact。
- 校验事实必须归属于已成立的 space / participant / visibility boundary。
- 保留事实来源引用和追加结果,支撑追溯与后续传播。

#### 5.3.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConversationFactAppendService` | application service | 编排事实追加、幂等、policy 校验、history 写入和 outbox 形成 | Step 7 / Step 8 |
| `ConversationFact` | truth / history object | 表达已追加的对话事实 | Step 6 / Step 9 |
| `FactSourceRef` | reference object | 记录事实来源 actor、runtime、bridge、system 或 source event 引用 | Step 6 |
| `FactAppendPolicy` | policy | 判断输入是否可追加为正式事实 | Step 6 |
| `FactAppendReceipt` | audit record | 表达追加结果、拒绝原因或幂等命中 | Step 6 / Step 8 |
| `ConversationFactHistoryRepository` | persistence port | 保存 append-only fact history | 留给详细设计 |

#### 5.3.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ConversationFact` | Step 6 独立成节 |
| Policy / Invariant | `FactAppendPolicy` | Step 6 独立成节 |
| Projection / Read model | - | 不展开 |
| Reference / Boundary | `FactSourceRef` | Step 6 独立成节 |
| Audit / History | `FactAppendReceipt` | Step 6 独立成节 |

#### 5.3.4 本部分不承担什么

- 不保存 Runtime 推理过程、chain-of-thought、tool 原始调用轨迹或 memory 正文。
- 不保存 Bridges 外部消息正文或外部平台生命周期。
- 不把维护任务、投影重建或下游展示状态写成正式事实。

#### 5.3.5 与其他部分的接缝

- 依赖 Space / scope management 提供已成立空间、参与范围和可见范围。
- 写入 Conversation truth core 并产生 outbox / trace 线索。
- 为 Authorized consumption、History trace / review 和 Derived consumption support 提供事实来源。

### 5.4 Authorized consumption

#### 5.4.1 本部分职责

- 在授权视野内提供对话事实查询、历史读取、订阅、变化感知和下游消费。
- 确保所有 read model、cursor、subscription 和 projection 输出都经过 visibility boundary。
- 表达旧视图、过期视图、不可见、不可解析和待刷新状态,不得伪装为完整 truth。

#### 5.4.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AuthorizedConversationQueryService` | application service | 编排授权读取、可见性校验和 projection fallback | Step 7 / Step 8 |
| `ConversationReadModel` | projection / read model | 表达授权消费所需的对话读取视图 | Step 6 |
| `ConversationChangeCursor` | state / projection object | 表达变化感知、订阅或增量读取游标 | Step 6 / Step 9 |
| `VisibilityPolicy` | policy | 复用 Space / scope 的可见性规则并应用到读取输出 | Step 6 |
| `ConversationProjectionRepository` | projection store | 保存 read model、cursor 和可重建派生视图 | 留给详细设计 |

#### 5.4.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | cursor state 线索 | 并入 `ConversationChangeCursor` |
| Policy / Invariant | `VisibilityPolicy` | Step 6 独立成节 |
| Projection / Read model | `ConversationReadModel`、`ConversationChangeCursor` | Step 6 独立成节 |
| Reference / Boundary | consumer scope ref 线索 | 字段类型或 query input,不独立成节 |
| Audit / History | read audit marker 线索 | 留给详细设计 |

#### 5.4.4 本部分不承担什么

- 不绕过参与范围和可见范围输出事实。
- 不把 query、subscription、change cursor 或 projection 反写为 truth。
- 不选择具体 SSE、WebSocket、AG-UI 或外部 streaming 协议。

#### 5.4.5 与其他部分的接缝

- 从 Conversation truth core 读取正式 truth,从 Derived consumption support 读取派生视图。
- 依赖 Space / scope management 的 visibility boundary。
- 使用 Local reference / snapshot / projection support 补充展示快照,但必须表达快照旧或不可解析状态。

### 5.5 Cross-domain manifestation

#### 5.5.1 本部分职责

- 将 Work、Governance、Artifact、Identity、Runtime、Bridges 等来源仓正式事实以引用、快照或显化记录方式进入对话视野。
- 校验来源引用是否可接受、是否可见、是否能形成对话内显化记录。
- 保留来源 truth 不转移的边界,并为历史追溯提供显化依据。

#### 5.5.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConversationManifestationService` | application service | 编排显化请求、入站事件显化、引用校验和记录写入 | Step 7 / Step 8 |
| `CrossDomainManifestation` | truth / manifestation record | 表达某个外部正式事实在本对话中被显化 | Step 6 / Step 9 |
| `ExternalFactRef` | reference object | 指向来源仓正式事实 | Step 6 |
| `ExternalFactSnapshot` | snapshot object | 保存降级展示或历史阅读需要的来源摘要 | Step 6 |
| `ManifestationPolicy` | policy | 判断来源事实是否允许显化 | Step 6 |
| `ReferenceValidityPolicy` | policy | 判断引用可解析、失效、待刷新或不可接受 | Step 6 / Step 9 |
| `ManifestationRepository` | persistence port | 保存显化记录 | 留给详细设计 |

#### 5.5.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CrossDomainManifestation` | Step 6 独立成节 |
| Policy / Invariant | `ManifestationPolicy`、`ReferenceValidityPolicy` | Step 6 独立成节 |
| Projection / Read model | manifestation view 线索 | 可并入 `ConversationReadModel` 或详细设计 projection |
| Reference / Boundary | `ExternalFactRef`、`ExternalFactSnapshot` | Step 6 独立成节 |
| Audit / History | manifestation audit 线索 | 留给 `ConversationTraceContext` 或详细设计 |

#### 5.5.4 本部分不承担什么

- 不拥有 Work、Governance、Artifact、Identity、Runtime 或 Bridges 的来源正文。
- 不裁决 governance 结论,不生成 artifact 版本,不改变 project / member lifecycle。
- 不在来源不可用时补造来源事实。

#### 5.5.5 与其他部分的接缝

- 依赖 Local reference / snapshot / projection support 获取引用解析和展示快照。
- 写入 Conversation truth core 的显化记录。
- 为 Authorized consumption 提供可见显化结果,为 History trace / review 提供来源回链。

### 5.6 History trace / review

#### 5.6.1 本部分职责

- 支撑对话历史、空间 / 范围变化、事实追加、显化记录和维护动作的追溯与复盘。
- 形成对话域内 review anchor、trace context 和交接记录。
- 将需要外部观测或长期归档的材料通过正式 handoff 边界交给 `L4-observability` 或 `L4-archive`。

#### 5.6.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConversationTraceReviewService` | application service | 编排追溯读取、复盘入口和交接状态查询 | Step 7 / Step 8 |
| `ConversationTraceContext` | audit / history object | 表达对话域内追溯上下文 | Step 6 |
| `ReviewAnchor` | audit / history object | 标识复盘或责任边界定位点 | Step 6 |
| `TraceHandoffRecord` | handoff record | 表达对 observability 的交接意图和状态 | Step 6 / Step 9 |
| `ArchiveHandoffRecord` | handoff record | 表达对 archive 的交接意图和状态 | Step 6 / Step 9 |
| `TraceRetentionPolicy` | policy | 约束追溯材料保留、交接和引用口径 | Step 6 |
| `TraceHandoffPort` / `ArchiveHandoffPort` | external port | 对接外部观测或归档系统 | Step 7 / 详细设计 |

#### 5.6.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | trace handoff state 线索 | 并入 handoff record 状态 |
| Policy / Invariant | `TraceRetentionPolicy` | Step 6 独立成节 |
| Projection / Read model | review read model 线索 | 本步不独立成节,后续按查询接口处理 |
| Reference / Boundary | trace / archive handoff ref 线索 | 并入 handoff record |
| Audit / History | `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord` | Step 6 独立成节 |

#### 5.6.4 本部分不承担什么

- 不拥有全局 trace store、metrics、alert、log pipeline 或长期归档包正文。
- 不让 observability / archive 反向改变 Conversation truth。
- 不把交接成功伪装成核心事实成立前置。

#### 5.6.5 与其他部分的接缝

- 从 Conversation truth core、Fact append、Manifestation 和 Scope changes 获取追溯材料。
- 为 Authorized consumption 提供受控 review 读取。
- 通过 handoff port 向 Observability / Archive 交接材料,交接失败只改变 handoff 状态。

### 5.7 Derived consumption support

#### 5.7.1 本部分职责

- 维护从 Conversation truth 派生出的 read projection、search index、change cursor 和定位辅助。
- 执行投影重建、索引刷新、变化游标维护和派生状态标记。
- 表达 stale、pending、rebuilding、failed 等派生状态,并保证派生失败不污染核心 truth。

#### 5.7.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConversationDerivedMaintenanceService` | application service | 编排派生刷新、重建和状态转换 | Step 7 / Step 8 |
| `ProjectionRebuildJob` | operations job | 触发投影重建和重放 | Step 7 / Step 8 |
| `ChangeCursorMaintenanceJob` | operations job | 维护变化游标和增量消费位置 | Step 7 / Step 8 |
| `ConversationProjectionState` | state object | 表达派生视图状态 | Step 6 / Step 9 |
| `SearchIndexProjection` | projection object | 支撑长历史检索和定位 | Step 6 |
| `ChangeCursorProjection` | projection object | 支撑变化感知和订阅游标 | Step 6 |
| `DerivedViewPolicy` | policy | 约束派生只读、可重建和不反写 | Step 6 |

#### 5.7.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ConversationProjectionState`、rebuild state 线索 | Step 6 独立成节 |
| Policy / Invariant | `DerivedViewPolicy` | Step 6 独立成节 |
| Projection / Read model | `SearchIndexProjection`、`ChangeCursorProjection` | Step 6 独立成节 |
| Reference / Boundary | projection source ref 线索 | 字段类型,不独立成节 |
| Audit / History | rebuild history 线索 | 留给详细设计 |

#### 5.7.4 本部分不承担什么

- 不生成新的 Conversation fact。
- 不将 search result、projection、cursor、notification state 或 stale marker 反写真相。
- 不阻塞核心同步写入、显化和授权读取的成立判断。

#### 5.7.5 与其他部分的接缝

- 从 Conversation truth core 读取正式 truth 作为派生来源。
- 为 Authorized consumption 提供 read model、index 和 cursor。
- 使用 Local reference / snapshot / projection support 的外部快照来改善展示,但必须保留快照状态。

### 5.8 Local reference / snapshot / projection support

#### 5.8.1 本部分职责

- 承载 actor、project、work、governance、artifact、bridge、trace、archive 等外部对象的引用、展示快照、解析状态和本地影子投影。
- 支撑跨域显化、授权消费、历史追溯和派生视图在外部来源不可用时仍能表达降级状态。
- 明确本地 snapshot / projection 只服务显示、读取和复盘,不拥有外部正文。

#### 5.8.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ExternalSnapshotRefreshJob` | operations job | 刷新外部展示快照和解析状态 | Step 7 / Step 8 |
| `ExternalReferenceSnapshotRepository` | snapshot store | 保存外部对象的展示快照和新鲜度状态 | 留给详细设计 |
| `ExternalReferenceProjection` | projection object | 聚合外部引用、展示摘要和解析状态 | Step 6 |
| `ReferenceResolutionState` | state object | 表达引用 fresh、stale、unresolved、invalid、pending 等状态 | Step 6 / Step 9 |
| `ReferenceValidityPolicy` | policy | 约束引用是否可显化、可读取或可追溯 | Step 6 |
| `ActorReferencePort` / `WorkContextPort` / `GovernanceReferencePort` / `ArtifactReferencePort` | external port | 读取外部引用和快照来源 | Step 7 / 详细设计 |

#### 5.8.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceResolutionState` | Step 6 独立成节 |
| Policy / Invariant | `ReferenceValidityPolicy` | Step 6 独立成节 |
| Projection / Read model | `ExternalReferenceProjection` | Step 6 独立成节 |
| Reference / Boundary | `ExternalFactSnapshot`、external object ref 线索 | `ExternalFactSnapshot` Step 6 独立成节;普通 ref 字段不展开 |
| Audit / History | snapshot refresh history 线索 | 留给详细设计 |

#### 5.8.4 本部分不承担什么

- 不保存外部对象正文、认证凭据、治理裁决正文、artifact 正文或外部平台消息正文。
- 不在来源仓不可用时补造来源 truth。
- 不让展示快照新鲜度决定 Conversation fact 是否成立。

#### 5.8.5 与其他部分的接缝

- 为 Cross-domain manifestation 提供引用解析和展示快照。
- 为 Authorized consumption 和 History trace / review 提供降级显示材料。
- 为 Derived consumption support 提供可派生的展示投影来源,但不允许反写 Conversation truth。

---

## 6. 总体边界说明

| 边界 | 当前口径 | 防止的问题 |
|---|---|---|
| 业务主要组成部分 vs 实现分层 | Step 5 按业务主要组成部分展开,实现分层只作为每部分内部承载方式 | 防止把 Inbound、Application、Domain、Ports 当成模块名称 |
| Conversation truth vs 外部来源 truth | 本仓只拥有对话空间、范围、事实、显化记录和追溯上下文 | 防止复制 Work、Governance、Artifact、Identity、Runtime、Bridges 正文 |
| Truth vs Projection | 派生 read model、index、cursor、snapshot 只能从 truth 派生 | 防止 read model、search result 或 stream cursor 成为第二 truth |
| 同步成立 vs 异步传播 / 后台维护 | 核心写入和授权读取同步收口;传播、派生、刷新、交接可延迟 | 防止把 outbox、projection、archive 成功伪装成核心成立 |
| 对象候选 vs 最终对象 | 本步只列对象发现线索;Step 6 才正式筛选对象并独立展开 | 防止在 Step 5 提前写字段、函数、状态矩阵 |
| outbox / history 显式承接 | 已成立 truth 的传播意图用 `ConversationOutboxRecord` 承接,scope 变化追溯用 `ScopeChangeRecord` 承接 | 防止 Step 8 / Step 9 临时发明 outbox 或 scope history 对象 |

---

## 7. Step 6 展开门禁

| 门禁项 | 判断规则 |
|---|---|
| 是否属于业务对象候选 | 候选必须来自本步对象发现线索,并能归属到某个主要组成部分 |
| 是否可能成为 struct / enum / value object / projection / policy / audit record / history record | 如果是,Step 6 需要独立成节或说明合并理由 |
| 是否只是 service / repository / port / adapter / trigger / DTO | 通常不进入 Step 6 对象轮廓,后移到 Step 7、Step 8 或详细设计 |
| 是否暗含外部正文 | 若对象字段或责任会保存来源仓正文,必须拒绝或改为 ref / snapshot |
| 是否会让派生反写真相 | 若候选来自 projection、index、cursor,必须标注 derived / read model 属性 |
| 是否跨多个主要组成部分 | 允许跨部分引用,但 Step 6 必须指定主归属部分和引用关系 |

Step 6 不得新增本步没有出现过的关键对象主语。若确实发现遗漏,必须先回补 Step 5 的对象发现线索,再进入对象正式化。

---

## 8. 后续展开一致性检查结论

| 检查项 | 结论 |
|---|---|
| 主要组成部分是否来自 Step 4 | 是,8 个主要组成部分均来自 Step 4 |
| 是否把实现分层误当主要组成部分 | 否,Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Outbox 只作为承载方式 |
| 是否覆盖 truth / state / policy / projection / reference / audit / history 维度 | 是,对象发现维度表已覆盖全部维度 |
| 每个主要组成部分是否有独立小节 | 是 |
| 每个主要组成部分是否列出代码主体 / 模块 | 是 |
| 每个主要组成部分是否列出对象发现线索 | 是 |
| 是否提前展开字段、函数、DTO、DDL、协议或事务 | 否 |
| 是否保留 Step 6 的对象正式化空间 | 是 |

---

## 9. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 以 Conversation / Turn / participant / StreamEvents 建立结构 | 旧对象线索未覆盖新版 truth、scope、manifestation、trace、derived、local reference 支撑层 | 改为 8 个主要组成部分,并保留旧线索为对象候选或接口候选 |
| 将事件转 Turn 作为核心解释 | 容易把跨域显化简化为“转消息” | 单列 Cross-domain manifestation,明确 ref / snapshot / manifestation record 边界 |
| 将实时推送作为主要结构 | 容易把协议形态当成业务模块 | 归入 Authorized consumption 和 Derived consumption support,协议后移 |
| 检索与 archive 位置不清 | 容易让外围增强或长期归档回流成 truth | 单列 Derived consumption support 与 History trace / review,并明确非职责 |

---

## 10. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 主要结构 | Conversation / Turn / participant / StreamEvents 等旧线索 | 8 个业务主要组成部分 |
| 对象发现 | 旧文档直接谈对象,缺少候选池维度 | 先按 truth / state / policy / projection / reference / audit / history 建对象候选池 |
| 边界表达 | 非目标散落在文字中 | 每个主要组成部分都有“不承担什么”和“与其他部分的接缝” |
| 下游承接 | Step 6 可能重新发明对象 | Step 6 必须从本步候选池筛选 |
| 外部仓关系 | 容易写成内部模块或消息转换 | 统一写成 reference、snapshot、port、event、handoff 边界 |

---

## 11. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按旧 Conversation / Turn / StreamEvents 展开 | 旧文档迁移快 | 覆盖不足,且协议线索容易反向绑定 truth | 不采用 |
| 方案 B: 按 Step 4 的 8 个业务主要组成部分展开 | 覆盖完整,能自然衔接对象、接口、流程和状态机 | 文档更长,需要对象候选池门禁 | 采用 |
| 方案 C: 按 Application / Domain / Ports 等实现分层展开 | 贴近代码分层 | 会把实现分层误当业务模块,后续对象归属不清 | 不采用 |
| 方案 D: 把 Local reference / snapshot / projection support 并入 Derived support | 组成部分更少 | 会遮蔽外部引用解析、展示快照和来源不可用降级边界 | 不采用 |

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §5 “主要组成部分、职责与边界”摘录本文件 §3.2 的组成部分总表。
- §5 必须摘录本文件 §4.1 的对象发现维度表和 §4.2 的各部分交互总图。
- §5 的每个主要组成部分小节从本文件 §5 摘录,但可压缩文字说明,保留表格主结构。
- §6 “关键对象轮廓”必须从本文件 §4.1 和 §5 的对象发现线索筛选正式对象。
- 不在本 Step 重复粘贴正式全文,后续 Step 14 从结构化中间产物摘录生成正式文档。

---

## 13. 待确认事项

### 13.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否保留 8 个主要组成部分 | A. 合并为 5 个;B. 保留 8 个;C. 按实现分层重组 | B | 8 个组成部分分别对应新版架构上下文和 Step 4 代码主体骨架,能支撑对象候选池完整性 | 已确认采用 B |
| `Local reference / snapshot / projection support` 是否独立 | A. 并入 Cross-domain manifestation;B. 并入 Derived support;C. 独立为支撑部分 | C | 它同时服务显化、授权消费、追溯和派生,独立更能守住外部正文不入仓边界 | 已确认采用 C |
| Step 6 是否可以新增本步没有出现的对象 | A. 可以;B. 不可以,必须先回补 Step 5 | B | 对象发现线索是 Step 6 的输入门禁,否则会回到随写随增对象的问题 | 已确认采用 B |

### 13.2 本 Step 未确认事项

本步不新增阻塞 Step 6 的待确认事项。Step 6 需要从本步候选池中完成对象正式化筛选,并为每个关键对象补齐所属部分、对象类型、主要责任、字段骨架、状态集合、成员函数、工厂函数和禁止事项。

---

## 14. 进入下一步条件

- 已明确本仓由 8 个主要组成部分构成。
- 已明确每个主要组成部分承担什么和不承担什么。
- 已明确每个主要组成部分包含哪些代码主体 / 模块,且后续展开位置没有悬空。
- 已形成对象发现维度表和每个组成部分的对象发现线索。
- 已明确 Step 6 只能从本步候选池做对象正式化。
- 未提前展开对象字段、状态、成员函数、工厂函数、DTO、repository、协议或事务细节。
- 可以进入 Step 6“关键对象轮廓”。
