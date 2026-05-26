# Step 7. API / 接口骨架

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L3-method-library/02-概要设计.md` §7 API / 接口骨架

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 6 关键对象 | MethodContent、7 类 definition、Lifecycle、Fingerprint、AuditRecord、OutboxEvent、DefinitionSnapshot、Projection、P1 对象 |
| Step 5 主要组成部分 | 生命周期与发布治理、定义真相、边界保护、同步快照、查询追溯、恢复运维、P1 组装 |
| 架构设计交互方式 | Command / Query 同步接口,Outbound Event 通过 outbox + L0-bus,Snapshot Query,Operations Job |
| 需求接口清单 | Create / Update / Submit / Publish / Deprecate / Retire / Supersede,Get / List / Export / Resolve / Trace / Compare,content events,seed / replay / rebuild / recalc |
| 当前 02 §11 | 已有接口族,但表格缺少输入骨架、输出骨架、写入结果、读取来源和边界 |

已确认结论：

```text
Step 7 只收稳接口主语和输入输出骨架。
不画处理流,不写 HTTP path、JSON / proto schema、topic 字段全集或错误码。
```

依赖的前序 Step：

```text
Step 1~6 已确认上游边界、范围、约束、代码主体、主要组成部分和关键对象。
```

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command，负责改写真相？

回答：

P0 Command 聚焦 MethodContent 定义生命周期和发布治理。

| Command | 写入真相 |
|---|---|
| CreateMethodContentDraft | 创建 draft MethodContent |
| UpdateMethodContentDraft | 更新 draft 内容 |
| SubmitMethodContentForReview | 推进到 in_review |
| PublishMethodContent | 推进到 published,写 version / fingerprint / audit / outbox |
| DeprecateMethodContent | 推进到 deprecated,写 audit / outbox |
| RetireMethodContent | 推进到 retired,写 audit / outbox |
| SupersedeMethodContent | 建立 supersede 链,写 audit / outbox |

P1 Command 只保留接口位置：

```text
PublishMethodPlugin
ActivateMethodConfiguration
```

### 3.2 哪些接口属于 Query，只读取投影或只读视图？

回答：

| Query | 读取来源 |
|---|---|
| GetMethodContent | MethodContent / DefinitionReadModel |
| ListMethodContents | DefinitionReadModel |
| GetMethodContentVersion | MethodContent version store / trace projection |
| ExportDefinitionSnapshot | DefinitionSnapshot / MethodContent |
| ResolveViewProfile | ViewProfileProjection / ViewProfile |
| GetDefinitionTrace | DefinitionTraceProjection / AuditRecord / OutboxEvent |
| CompareFingerprint | MethodContent / Fingerprint |
| ListMethodPlugins(P1) | MethodPlugin read model |
| GetMethodConfiguration(P1) | MethodConfiguration read model |

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓？

回答：

本仓 P0 的 Inbound Event 很少。核心是 governance gate 结果,并且更推荐作为 `approved_gate_ref` 被 Command 显式携带。

| 外部事实 | 是否作为 Inbound Event | 说明 |
|---|---|---|
| governance.publish_gate.approved | 可选 | 可由 event consumer 记录 gate 可用性,也可由 Publish Command 直接携带 approved_gate_ref |
| governance.publish_gate.rejected | 可选 | 可用于保留 in_review 或记录审核结果,不直接发布 |
| 下游同步完成事件 | 否 | 下游消费成功不是本仓强一致责任 |
| identity / process / artifact 本地索引变化 | 否 | 属于下游 Use truth 或本地索引事实 |

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播？

回答：

| Outbound Event | 已提交事实 |
|---|---|
| method_library.content.published | 任一 MethodContent 已发布 |
| method_library.content.retired | 任一 MethodContent 已退役 |
| method_library.content.fingerprint_changed | 任一 MethodContent fingerprint 变化 |
| method_library.qualification.published / retired / fingerprint_changed | Qualification 定义变化 |
| method_library.role_definition.published | RoleDefinition 发布 |
| method_library.task_definition.published | TaskDefinition 发布 |
| method_library.work_product_definition.published | WorkProductDefinition 发布 |
| method_library.process_template_def.published | ProcessTemplateDef 发布 |
| method_library.view_profile.published | ViewProfile 发布 |
| method_library.ai_policy_def.published | AIPolicyDef 发布 |
| method_library.plugin.published(P1) | MethodPlugin 发布 |
| method_library.configuration.activated(P1) | MethodConfiguration 激活 |

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job，而不是业务 command？

回答：

| Operations Job | 原因 |
|---|---|
| SeedInitialMethodAssets | 初始化基线资产,不是普通用户业务写入 |
| ReplayDefinitionEvents | 基于已提交事实重放事件,不改变定义正文 |
| RebuildDefinitionIndex | 重建 read model / projection |
| RecalculateFingerprint | 复算和对账 fingerprint,不直接修改定义正文 |
| ExportAllSnapshots(P1) | 批量导出,属于维护任务 |
| DetectDefinitionDrift(P1) | 主动对账增强,不阻塞 P0 |

### 3.6 Command 输入骨架是否需要 ActorContext、CommandMetadata、IdempotencyKey？

回答：

需要。所有 Command 输入骨架必须显式包含：

```text
ActorContext actor
CommandMetadata metadata
IdempotencyKey idempotency_key
```

发布类 Command 还必须包含：

```text
ExpectedVersion expected_version
ApprovedGateRef approved_gate_ref
```

原因：Command 会改写真相,必须可审计、可幂等、可并发控制。

### 3.7 Query 输入骨架是否需要 ActorContext？

回答：

需要携带 `ActorContext actor`,但本仓不做身份认证实现。actor 用于：

```text
审计读取
视图解析上下文
调用边界记录
未来查询裁剪或 deny 判断
```

安全入口由外层 gateway / nginx-like 层处理,本仓只承接 actor / context。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope？

回答：

需要。Inbound Event Consumer 如果存在,输入骨架必须包含：

```text
EventEnvelope envelope
ExternalEventId event_id
IdempotencyKey idempotency_key
```

Outbound Event 通过 outbox 发布,也必须保留：

```text
OutboxEventId event_id
MethodLibraryEventKind event_kind
SnapshotRef snapshot_ref
```

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §11.2 Command 接口族 | 只列接口、用途、同步与事件,缺少输入骨架、输出骨架、主要处理和写入结果 | 详细设计仍需重新发明 Command 契约 |
| §11.3 Query 接口族 | 只列调用方和用途,缺少输入骨架、输出骨架、读取来源和边界 | Query 与处理流边界不够清楚 |
| §11.4 Outbound Event 接口族 | 事件清单有效,但缺少产生来源和说明骨架 | 后续事件 schema 难以承接 |
| §11.5 Inbound Event / 外部依赖接口 | 混合了 governance、PostgreSQL、object storage、L0-bus 等不同层次 | 新版应只把真正 Inbound Event Consumer 单列,外部依赖放边界说明 |
| §11.6 Operations Job | 已有 Job 清单,但缺少输入来源、输出结果和边界 | Step 8 处理流覆盖不易判断 |
| 全文 | A / H 旧部分仍出现在接口承接部分 | 需要改为 Step 5 的 7 个业务部分和实现分层名 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Command 表 | 接口 / 优先级 / 调用方 / 用途 / 同步 / 事件 | API / 输入骨架 / 输出骨架 / 主要处理 / 写入结果 | 对齐书写规范,支撑详细设计协议展开 |
| Query 表 | 接口 / 优先级 / 调用方 / 用途 / 同步 | API / 输入骨架 / 输出骨架 / 读取来源 / 边界 | 明确只读边界和数据来源 |
| Inbound Event | 混合外部依赖 | 只列真正外部事实事件 | 避免把数据库、bus、object storage 当事件接口 |
| Outbound Event | 事件清单 | Event / 产生来源 / 主要消费者 / 说明 | 明确事件来自已提交事实 |
| Operations Job | Job / 优先级 / 触发方 / 用途 / 是否改变正文 | Job / 输入来源 / 输出结果 / 边界 | 明确 Job 不是业务 Command 后门 |
| 安全 | 未统一表达 | actor/context 作为输入骨架,认证在外层 | 符合当前架构边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只保留旧接口清单 | 短,迁移成本低 | 不能驱动协议、错误码和处理流详细设计 | 不采用 |
| 在概要设计写完整 JSON / proto | 最清楚 | 下沉到详细设计层,会让 02 过重 | 不采用 |
| 按规范写输入 / 输出骨架和边界,不写完整 schema | 粒度适中,能承接 Step 8 和 03 | 需要在详细设计继续展开完整契约 | 采用 |

---

## 7. 结构化中间产物

### 7.1 接口分类说明

```text
Command API
  改写 method-library 定义真相,必须携带 ActorContext / CommandMetadata / IdempotencyKey。

Query API
  读取定义、snapshot、trace、projection 或解析视图,不得改变 MethodContent 状态。

Inbound Event Consumer
  消费外部已发生事实。P0 仅保留 governance gate 结果的可选 consumer。

Outbound Event
  传播本仓已提交定义事实,必须通过 outbox 发布。

Operations Job
  基于已持久化事实执行 seed、replay、rebuild、recalculate 等维护动作,不得绕过 application / domain 规则。
```

### 7.2 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| CreateMethodContentDraft | CreateMethodContentDraftCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | MethodContentDraftResult | 创建 draft MethodContent | MethodContent.lifecycle=draft |
| UpdateMethodContentDraft | UpdateMethodContentDraftCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentDraftResult | 更新 draft definition_body 并校验引用骨架 | MethodContent draft 更新 |
| SubmitMethodContentForReview | SubmitMethodContentForReviewCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentLifecycleResult | 将 draft 提交为 in_review | MethodContent.lifecycle=in_review,AuditRecord |
| PublishMethodContent | PublishMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version + ApprovedGateRef approved_gate_ref | PublishMethodContentResult | gate 校验、引用校验、fingerprint、audit、outbox | MethodContent.lifecycle=published,DefinitionVersion,Fingerprint,AuditRecord,OutboxEvent |
| DeprecateMethodContent | DeprecateMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentLifecycleResult | 标记 deprecated 并记录审计和事件 | MethodContent.lifecycle=deprecated,AuditRecord,OutboxEvent |
| RetireMethodContent | RetireMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentLifecycleResult | 标记 retired 并记录审计和事件 | MethodContent.lifecycle=retired,AuditRecord,OutboxEvent |
| SupersedeMethodContent | SupersedeMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version + ApprovedGateRef approved_gate_ref | SupersedeMethodContentResult | 建立新旧版本替代关系并发布新版本 | old.lifecycle=superseded,new.lifecycle=published,AuditRecord,OutboxEvent |
| PublishMethodPlugin(P1) | PublishMethodPluginCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ApprovedGateRef approved_gate_ref | PublishMethodPluginResult | 发布 MethodPlugin package metadata | MethodPlugin.lifecycle=published,plugin event |
| ActivateMethodConfiguration(P1) | ActivateMethodConfigurationCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | ActivateMethodConfigurationResult | 激活 MethodConfiguration effective_content_set | MethodConfiguration.lifecycle=active,configuration event |

### 7.3 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodContent | GetMethodContentQuery + ActorContext actor | MethodContentView | MethodContent / DefinitionReadModel | 不改变状态;返回 version / fingerprint |
| ListMethodContents | ListMethodContentsQuery + ActorContext actor + PageRequest page | MethodContentSummaryPage | DefinitionReadModel | 不改变状态;可读 projection |
| GetMethodContentVersion | GetMethodContentVersionQuery + ActorContext actor | MethodContentVersionView | version store / trace projection | 不改变状态;历史版本只读 |
| ExportDefinitionSnapshot | ExportDefinitionSnapshotQuery + ActorContext actor | DefinitionSnapshot | MethodContent / SnapshotProjection | 不改变状态;snapshot 不是第二真相 |
| ResolveViewProfile | ResolveViewProfileQuery + ActorContext actor | ResolveViewProfileResult | ViewProfileProjection / ViewProfile | 不改变状态;未匹配生产默认 deny |
| GetDefinitionTrace | GetDefinitionTraceQuery + ActorContext actor | DefinitionTraceView | DefinitionTraceProjection / AuditRecord / OutboxEvent | 不改变状态;返回审计链 |
| CompareFingerprint | CompareFingerprintQuery + ActorContext actor | FingerprintCompareResult | MethodContent / Fingerprint | 不改变状态;只返回 match / drift |
| ListMethodPlugins(P1) | ListMethodPluginsQuery + ActorContext actor + PageRequest page | MethodPluginSummaryPage | MethodPlugin read model | P1 只读 |
| GetMethodConfiguration(P1) | GetMethodConfigurationQuery + ActorContext actor | MethodConfigurationView | MethodConfiguration read model | P1 只读 |

### 7.4 Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| GovernanceGateApprovedConsumer(可选) | governance.publish_gate.approved | EventEnvelope envelope + ExternalEventId event_id + IdempotencyKey idempotency_key + GovernanceGateApprovedEvent event | 记录可引用的 ApprovedGateRef 或 gate projection | 不执行 publish;PublishMethodContent 仍需显式携带 approved_gate_ref 或等价引用 |
| GovernanceGateRejectedConsumer(可选) | governance.publish_gate.rejected | EventEnvelope envelope + ExternalEventId event_id + IdempotencyKey idempotency_key + GovernanceGateRejectedEvent event | 记录 gate rejected 事实或保留 in_review | 不改变为 published;不保存 enforce result |

### 7.5 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| method_library.content.published | PublishMethodContent / SupersedeMethodContent | 通用订阅方 | 任一 MethodContent 发布;携带 content_id、kind、version、fingerprint、snapshot_ref 骨架 |
| method_library.content.retired | RetireMethodContent | 通用订阅方 | 任一 MethodContent 退役 |
| method_library.content.fingerprint_changed | PublishMethodContent / RecalculateFingerprint | 下游系统 / Auditor | 定义语义指纹变化 |
| method_library.qualification.published | PublishMethodContent(kind=Qualification) | identity、capability-hub | Qualification 定义发布 |
| method_library.qualification.retired | RetireMethodContent(kind=Qualification) | identity、capability-hub | Qualification 定义退役 |
| method_library.qualification.fingerprint_changed | Fingerprint change(kind=Qualification) | identity、capability-hub | Qualification drift 感知 |
| method_library.role_definition.published | PublishMethodContent(kind=RoleDefinition) | identity | RoleDefinition 发布 |
| method_library.task_definition.published | PublishMethodContent(kind=TaskDefinition) | process | TaskDefinition 发布 |
| method_library.work_product_definition.published | PublishMethodContent(kind=WorkProductDefinition) | artifact | WorkProductDefinition 发布 |
| method_library.process_template_def.published | PublishMethodContent(kind=ProcessTemplateDef) | process | ProcessTemplateDef 发布 |
| method_library.view_profile.published | PublishMethodContent(kind=ViewProfile) | UI / console | ViewProfile 发布 |
| method_library.ai_policy_def.published | PublishMethodContent(kind=AIPolicyDef) | governance | AIPolicyDef 发布 |
| method_library.plugin.published(P1) | PublishMethodPlugin | marketplace / Console | MethodPlugin package metadata 发布 |
| method_library.configuration.activated(P1) | ActivateMethodConfiguration | Console / organization runtime | MethodConfiguration 激活 |

### 7.6 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| SeedInitialMethodAssets | SeedInitialMethodAssetsJobInput + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | SeedInitialMethodAssetsResult | 可创建或确认基础定义;必须幂等、可审计,不绕过规则 |
| RebuildDefinitionIndex | RebuildDefinitionIndexJobInput + ActorContext actor + CommandMetadata metadata | RebuildDefinitionIndexResult | 重建 read model / projection;不修改定义正文 |
| ReplayDefinitionEvents | ReplayDefinitionEventsJobInput + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | ReplayDefinitionEventsResult | 重放已存在 outbox / event;snapshot 可重导出;不修改定义正文 |
| RecalculateFingerprint | RecalculateFingerprintJobInput + ActorContext actor + CommandMetadata metadata | RecalculateFingerprintResult | 复算 fingerprint 并输出对比结果;不直接改正文 |
| ExportAllSnapshots(P1) | ExportAllSnapshotsJobInput + ActorContext actor + CommandMetadata metadata | ExportAllSnapshotsResult | 批量导出 snapshot;P1 / 运维增强 |
| DetectDefinitionDrift(P1) | DetectDefinitionDriftJobInput + ActorContext actor + CommandMetadata metadata | DetectDefinitionDriftResult | 输出 drift report;不替下游自动修复 |

### 7.7 接口边界红线

```text
本仓不提供创建或更新 QualificationProfile 的接口。
本仓不提供创建或更新 QualificationBinding 的接口。
本仓不提供创建或更新 CapabilityAccessDecision 的接口。
本仓不提供创建或更新 ProcessInstance / Activity execution 的接口。
本仓不提供创建或更新 WorkItem / Backlog / Iteration 的接口。
本仓不提供保存 Artifact instance 正文或 evidence instance 的接口。
本仓不提供执行 Policy enforce result 的接口。
本仓不提供 marketplace listing / transaction / install record 的写入接口。
```

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §7。正式回填时应保留接口分类说明和五类接口表,但可以裁剪 P1 说明。

```md
## 7. API / 接口骨架

### 7.1 接口分类说明

Command API 改写 method-library 定义真相,必须携带 `ActorContext`、`CommandMetadata`、`IdempotencyKey`。

Query API 读取定义、snapshot、trace、projection 或解析视图,不得改变 MethodContent 状态。

Inbound Event Consumer 消费外部已发生事实。P0 仅保留 governance gate 结果的可选 consumer。

Outbound Event 传播本仓已提交定义事实,必须通过 outbox 发布。

Operations Job 基于已持久化事实执行 seed、replay、rebuild、recalculate 等维护动作,不得绕过 application / domain 规则。

### 7.2 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| CreateMethodContentDraft | CreateMethodContentDraftCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | MethodContentDraftResult | 创建 draft MethodContent | MethodContent.lifecycle=draft |
| UpdateMethodContentDraft | UpdateMethodContentDraftCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentDraftResult | 更新 draft definition_body 并校验引用骨架 | MethodContent draft 更新 |
| SubmitMethodContentForReview | SubmitMethodContentForReviewCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentLifecycleResult | 将 draft 提交为 in_review | MethodContent.lifecycle=in_review,AuditRecord |
| PublishMethodContent | PublishMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version + ApprovedGateRef approved_gate_ref | PublishMethodContentResult | gate 校验、引用校验、fingerprint、audit、outbox | MethodContent.lifecycle=published,DefinitionVersion,Fingerprint,AuditRecord,OutboxEvent |
| DeprecateMethodContent | DeprecateMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentLifecycleResult | 标记 deprecated 并记录审计和事件 | MethodContent.lifecycle=deprecated,AuditRecord,OutboxEvent |
| RetireMethodContent | RetireMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version | MethodContentLifecycleResult | 标记 retired 并记录审计和事件 | MethodContent.lifecycle=retired,AuditRecord,OutboxEvent |
| SupersedeMethodContent | SupersedeMethodContentCommand + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key + ExpectedVersion expected_version + ApprovedGateRef approved_gate_ref | SupersedeMethodContentResult | 建立新旧版本替代关系并发布新版本 | old.lifecycle=superseded,new.lifecycle=published,AuditRecord,OutboxEvent |

### 7.3 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodContent | GetMethodContentQuery + ActorContext actor | MethodContentView | MethodContent / DefinitionReadModel | 不改变状态;返回 version / fingerprint |
| ListMethodContents | ListMethodContentsQuery + ActorContext actor + PageRequest page | MethodContentSummaryPage | DefinitionReadModel | 不改变状态;可读 projection |
| GetMethodContentVersion | GetMethodContentVersionQuery + ActorContext actor | MethodContentVersionView | version store / trace projection | 不改变状态;历史版本只读 |
| ExportDefinitionSnapshot | ExportDefinitionSnapshotQuery + ActorContext actor | DefinitionSnapshot | MethodContent / SnapshotProjection | 不改变状态;snapshot 不是第二真相 |
| ResolveViewProfile | ResolveViewProfileQuery + ActorContext actor | ResolveViewProfileResult | ViewProfileProjection / ViewProfile | 不改变状态;未匹配生产默认 deny |
| GetDefinitionTrace | GetDefinitionTraceQuery + ActorContext actor | DefinitionTraceView | DefinitionTraceProjection / AuditRecord / OutboxEvent | 不改变状态;返回审计链 |
| CompareFingerprint | CompareFingerprintQuery + ActorContext actor | FingerprintCompareResult | MethodContent / Fingerprint | 不改变状态;只返回 match / drift |

### 7.4 Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| GovernanceGateApprovedConsumer(可选) | governance.publish_gate.approved | EventEnvelope envelope + ExternalEventId event_id + IdempotencyKey idempotency_key + GovernanceGateApprovedEvent event | 记录可引用的 ApprovedGateRef 或 gate projection | 不执行 publish;PublishMethodContent 仍需显式携带 approved_gate_ref 或等价引用 |
| GovernanceGateRejectedConsumer(可选) | governance.publish_gate.rejected | EventEnvelope envelope + ExternalEventId event_id + IdempotencyKey idempotency_key + GovernanceGateRejectedEvent event | 记录 gate rejected 事实或保留 in_review | 不改变为 published;不保存 enforce result |

### 7.5 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| method_library.content.published | PublishMethodContent / SupersedeMethodContent | 通用订阅方 | 任一 MethodContent 发布;携带 content_id、kind、version、fingerprint、snapshot_ref 骨架 |
| method_library.content.retired | RetireMethodContent | 通用订阅方 | 任一 MethodContent 退役 |
| method_library.content.fingerprint_changed | PublishMethodContent / RecalculateFingerprint | 下游系统 / Auditor | 定义语义指纹变化 |
| method_library.qualification.published | PublishMethodContent(kind=Qualification) | identity、capability-hub | Qualification 定义发布 |
| method_library.role_definition.published | PublishMethodContent(kind=RoleDefinition) | identity | RoleDefinition 发布 |
| method_library.task_definition.published | PublishMethodContent(kind=TaskDefinition) | process | TaskDefinition 发布 |
| method_library.work_product_definition.published | PublishMethodContent(kind=WorkProductDefinition) | artifact | WorkProductDefinition 发布 |
| method_library.process_template_def.published | PublishMethodContent(kind=ProcessTemplateDef) | process | ProcessTemplateDef 发布 |
| method_library.view_profile.published | PublishMethodContent(kind=ViewProfile) | UI / console | ViewProfile 发布 |
| method_library.ai_policy_def.published | PublishMethodContent(kind=AIPolicyDef) | governance | AIPolicyDef 发布 |

### 7.6 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| SeedInitialMethodAssets | SeedInitialMethodAssetsJobInput + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | SeedInitialMethodAssetsResult | 可创建或确认基础定义;必须幂等、可审计,不绕过规则 |
| RebuildDefinitionIndex | RebuildDefinitionIndexJobInput + ActorContext actor + CommandMetadata metadata | RebuildDefinitionIndexResult | 重建 read model / projection;不修改定义正文 |
| ReplayDefinitionEvents | ReplayDefinitionEventsJobInput + ActorContext actor + CommandMetadata metadata + IdempotencyKey idempotency_key | ReplayDefinitionEventsResult | 重放已存在 outbox / event;snapshot 可重导出;不修改定义正文 |
| RecalculateFingerprint | RecalculateFingerprintJobInput + ActorContext actor + CommandMetadata metadata | RecalculateFingerprintResult | 复算 fingerprint 并输出对比结果;不直接改正文 |
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 7 |
|---|---|---|
| 是否同意 Command / Query / Event / Job 按本步五类表表达 | 建议同意,符合书写规范 | 阻塞 |
| 是否同意 governance gate consumer 只作为可选 Inbound Event | 建议同意,核心 publish 仍由 approved_gate_ref 驱动 | 阻塞 |
| 是否同意 Query 都携带 ActorContext,但不写鉴权实现 | 建议同意,符合外层安全入口架构 | 不阻塞 |
| 是否同意 P1 接口保留位置但正式回填可裁剪 | 建议同意,不阻塞 P0 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 8 前需要确认：

- [x] 是否同意本步的接口分类方式
- [x] 是否同意 Command / Query 的输入输出骨架粒度
- [x] 是否同意 governance gate 作为可选 Inbound Event Consumer
- [x] 是否同意 Step 8 再为关键接口画处理流,本步不画流程图
