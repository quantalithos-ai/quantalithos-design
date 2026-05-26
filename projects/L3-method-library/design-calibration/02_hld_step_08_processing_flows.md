# Step 8. 关键处理流 / 重要函数数据流

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L3-method-library/02-概要设计.md` §8 关键处理流 / 重要函数数据流

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 7 API / 接口骨架 | Command、Query、Inbound Event、Outbound Event、Operations Job 分类和输入输出骨架 |
| Step 6 关键对象 | MethodContent、Lifecycle、Fingerprint、AuditRecord、OutboxEvent、DefinitionSnapshot、Projection |
| Step 5 主要组成部分 | 生命周期与发布治理、定义真相、边界保护、同步快照、查询追溯、恢复运维、P1 组装 |
| 当前 02 §12 | 已有 Publish、Downstream Sync、ResolveViewProfile、Operations、P1 路径,但不是按 Step 7 接口覆盖规则组织 |

已确认结论：

```text
Step 8 画处理流,不写完整伪代码、SQL、错误码、retry 参数或完整 Rust 签名。
异常细节留 Step 10,状态机细节留 Step 9。
```

依赖的前序 Step：

```text
Step 1~7 已确认上游边界、范围、约束、代码主体、主要组成部分、关键对象和接口骨架。
```

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何从入口进入 application service、domain object、repository / outbox？

回答：

P0 Command 分为 4 类写路径：

| Command 类别 | 处理流 |
|---|---|
| Create / Update draft | 草稿写路径,进入 MethodContentCommandService,创建或修改 draft,写 MethodContent |
| Submit review | 生命周期推进路径,进入 MethodContentCommandService,调用 MethodContent.submit_for_review(ActorContext actor),写 AuditRecord |
| Publish / Supersede | 发布写路径,进入 PublishGovernanceService,校验 gate / reference / boundary,计算 fingerprint,写 AuditRecord + OutboxEvent |
| Deprecate / Retire | 生命周期终止路径,进入 MethodContentCommandService,调用 MethodContent.deprecate(...) 或 retire(...),写 AuditRecord + OutboxEvent |

本步为每个 P0 Command 画独立处理流,但 `DeprecateMethodContent` 和 `RetireMethodContent` 可以使用同类结构表达,仍分别列入覆盖清单。

### 3.2 每个关键 Query 如何从入口读取 projection 或只读视图？

回答：

Query 分为 3 类：

| Query 类别 | 处理流 |
|---|---|
| 普通定义读取 | Get / List / Version 走通用只读 projection 路径 |
| Snapshot / Trace | ExportDefinitionSnapshot、GetDefinitionTrace 需要聚合 version / fingerprint / audit / event / snapshot,需要独立处理流 |
| ResolveViewProfile | 有匹配、fallback、默认 deny 边界,需要独立处理流 |

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录？

回答：

P0 只保留可选 governance gate event consumer。它只记录 gate projection 或 gate ref,不触发 publish。

### 3.4 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账？

回答：

| Job | 处理流 |
|---|---|
| SeedInitialMethodAssets | 进入受控 seed 主链,创建或确认基础定义,写 audit / outbox |
| ReplayDefinitionEvents | 读取已存在 outbox,重新发布,不改定义正文 |
| RebuildDefinitionIndex | 从定义真相、audit、outbox 重建 projection |
| RecalculateFingerprint | 读取 canonical definition,复算 fingerprint,输出对比结果 |

### 3.5 处理流中点名的关键函数调用，其参数分别是什么类型？

回答：

本步出现的函数调用参数统一写成 `TypeName param_name`,例如：

```text
MethodContent.create_draft(MethodContentDraftSpec spec, ActorContext actor)
MethodContent.publish(ApprovedGateRef gate_ref, ActorContext actor)
ReferenceValidationPolicy.validate(MethodContent content)
FingerprintPolicy.calculate(CanonicalDefinition canonical)
OutboxEvent.from_publish_result(PublishResult result)
```

### 3.6 哪些处理步骤必须在概要设计点名，哪些完整函数调用链应留给详细设计？

回答：

必须点名：

```text
入口分类
application service 主语
domain object / policy 主语
repository / unit of work / outbox / projection 主语
事务内外边界
最终结果或事件
```

留给详细设计：

```text
完整 handler 调用链
完整 service trait
SQL / DDL
错误码全集
retry 参数
完整事务伪代码
序列化字段
```

### 3.7 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流？

回答：

必须画独立处理流：

```text
CreateMethodContentDraft
UpdateMethodContentDraft
SubmitMethodContentForReview
PublishMethodContent
DeprecateMethodContent
RetireMethodContent
SupersedeMethodContent
GovernanceGateApprovedConsumer(可选)
SeedInitialMethodAssets
ReplayDefinitionEvents
RebuildDefinitionIndex
RecalculateFingerprint
```

### 3.8 哪些 Query 可以只走通用读路径，哪些 Query 必须画独立处理流？

回答：

| Query | 处理方式 |
|---|---|
| GetMethodContent | 通用读路径 |
| ListMethodContents | 通用读路径 |
| GetMethodContentVersion | 通用读路径 + version source |
| ExportDefinitionSnapshot | 独立处理流 |
| ResolveViewProfile | 独立处理流 |
| GetDefinitionTrace | 独立处理流 |
| CompareFingerprint | 独立处理流 |
| P1 Query | 本轮不展开 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §12 核心数据流 | 只覆盖几条代表性路径,没有按 Step 7 接口覆盖规则说明遗漏原因 | 不能判断所有 P0 Command / Job 是否有处理流承接 |
| §12.2 PublishMethodContent | 方向正确,但函数参数未按 `TypeName param_name` 规范表达 | 不符合最新 SOP |
| §12.3 Downstream Sync | 这是下游消费示例,更适合保留为同步说明,不是本仓 API 处理流主图 | 需要拆成 Outbox / Snapshot / Replay 的本仓处理流 |
| §12.4 ResolveViewProfile | 方向正确,但需要补 Query API -> service -> projection / fallback -> result 的结构化边界 |
| §12.5 Operations | 已有 seed / replay / recalc,但缺少覆盖 RebuildDefinitionIndex 和处理流关键设计点 |
| §12.6 P1 Plugin / Configuration | P1 路径存在,但本轮不应成为 P0 处理流门槛 | 保留取舍说明即可 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖方式 | 按代表性数据流写 | 按 Step 7 接口覆盖规则写 | 防止 P0 Command / Job 遗漏 |
| 图标题 | 业务路径标题 | `#### <接口名> 处理流` | 符合 SOP |
| 函数参数 | 多数为裸参数或自然语言 | `TypeName param_name` | 符合函数调用骨架规则 |
| Query | 只画 ResolveViewProfile | 区分通用读路径和独立 Query 流 | 降低重复,保留关键边界 |
| Operations | seed / replay / recalc | seed / replay / rebuild / recalc | 覆盖一致性与投影恢复 |
| P1 | 画 Plugin / Configuration 流 | 本轮只保留取舍说明 | P1 不阻塞 P0 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 为所有接口都画完整处理流 | 覆盖最全 | 正式文档会过长,且大量重复 | 不采用 |
| 只画 Publish / Resolve / Replay 三条代表流 | 简洁 | P0 Command 覆盖不满足 SOP | 不采用 |
| P0 Command 和关键 Job 独立画,普通 Query 走通用读路径,未展开项说明原因 | 覆盖完整且控制篇幅 | Step 8 中间产物较长 | 采用 |

---

## 7. 结构化中间产物

### 7.1 通用处理流骨架

#### 通用写路径骨架

```text
Command
  |
  v
Command API
  - parse command
  - pass ActorContext actor / CommandMetadata metadata
  |
  v
Application Service
  - load aggregate through repository
  - call domain object / domain policy
  - prepare audit / outbox if state changes
  |
  v
UnitOfWork / Repository / Outbox
  - persist MethodContent / AuditRecord / OutboxEvent
  |
  v
Command Result
```

关键设计点：

- Command 会改写真相,必须经过 application service 和 domain rule。
- Command 不直接由 API handler 写 repository。
- 完整事务、错误码和并发冲突处理留给详细设计。

#### 通用读路径骨架

```text
Query
  |
  v
Query API
  - parse query
  - pass ActorContext actor
  |
  v
Query Service
  - read projection or definition truth
  - fallback when projection unavailable if allowed
  |
  v
Query Result
```

关键设计点：

- Query 不改变 MethodContent 状态。
- projection / cache 可重建,不是 definition truth。
- 查询裁剪、分页、缓存策略留给详细设计。

### 7.2 处理流覆盖清单

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| CreateMethodContentDraft | 是 | P0 Command,创建定义真相 |
| UpdateMethodContentDraft | 是 | P0 Command,改写 draft 内容 |
| SubmitMethodContentForReview | 是 | P0 Command,推进生命周期 |
| PublishMethodContent | 是 | P0 核心发布链 |
| DeprecateMethodContent | 是 | P0 状态变化 + event |
| RetireMethodContent | 是 | P0 状态变化 + event |
| SupersedeMethodContent | 是 | P0 版本链变化 |
| GetMethodContent / ListMethodContents / GetMethodContentVersion | 否 | 走通用读路径,无额外边界 |
| ExportDefinitionSnapshot | 是 | 下游恢复兜底入口 |
| ResolveViewProfile | 是 | 有匹配、fallback、默认 deny 边界 |
| GetDefinitionTrace | 是 | 聚合 audit / event / snapshot |
| CompareFingerprint | 是 | drift 判断关键路径 |
| GovernanceGateApprovedConsumer | 是 | 可选 Inbound Event,会写本地 gate projection |
| GovernanceGateRejectedConsumer | 否 | 与 approved consumer 同类,本轮用同类说明覆盖 |
| SeedInitialMethodAssets | 是 | P0 seed 幂等和审计 |
| ReplayDefinitionEvents | 是 | 影响传播可靠性 |
| RebuildDefinitionIndex | 是 | 影响查询一致性 |
| RecalculateFingerprint | 是 | 影响 drift 对账 |
| P1 Plugin / Configuration 接口 | 否 | P1 后置,本轮只保留边界 |

### 7.3 CreateMethodContentDraft 处理流

```text
CreateMethodContentDraft
  |
  v
Command API
  - parse CreateMethodContentDraftCommand command
  - pass ActorContext actor / CommandMetadata metadata
  |
  v
MethodContentCommandService
  - call MethodContent.create_draft(MethodContentDraftSpec spec, ActorContext actor)
  - call ReferenceValidationPolicy.validate_draft(MethodContent content)
  |
  v
UnitOfWork / MethodContentRepository
  - insert MethodContent draft
  |
  v
MethodContentDraftResult
```

关键设计点：

- 创建草稿只产生 draft,不发布 outbox event。
- draft 不能包含下游 Use truth 字段。
- 字段校验、重复检测和具体错误码留给详细设计。

### 7.4 UpdateMethodContentDraft 处理流

```text
UpdateMethodContentDraft
  |
  v
Command API
  - parse UpdateMethodContentDraftCommand command
  - pass ExpectedVersion expected_version
  |
  v
MethodContentCommandService
  - load MethodContent by MethodContentId content_id
  - verify draft lifecycle
  - update DefinitionBody definition_body
  - call ReferenceValidationPolicy.validate_draft(MethodContent content)
  |
  v
UnitOfWork / MethodContentRepository
  - save draft with ExpectedVersion expected_version
  |
  v
MethodContentDraftResult
```

关键设计点：

- 只允许修改 draft。
- published 核心字段不能原地修改。
- 并发冲突处理细节留给详细设计。

### 7.5 SubmitMethodContentForReview 处理流

```text
SubmitMethodContentForReview
  |
  v
Command API
  - parse SubmitMethodContentForReviewCommand command
  |
  v
MethodContentCommandService
  - load MethodContent
  - call ReferenceValidationPolicy.validate_review_ready(MethodContent content)
  - call MethodContent.submit_for_review(ActorContext actor)
  - create AuditRecord.from_lifecycle_change(LifecycleChange change)
  |
  v
UnitOfWork / Repository / AuditLog
  - save MethodContent lifecycle=in_review
  - append AuditRecord
  |
  v
MethodContentLifecycleResult
```

关键设计点：

- Submit 只推进到 in_review,不发布给下游。
- 审核入口和 gate 详情不在本仓实现。
- 具体 review workflow 留给 governance / 详细设计边界。

### 7.6 PublishMethodContent 处理流

```text
PublishMethodContent
  |
  v
Command API
  - parse PublishMethodContentCommand command
  - pass ApprovedGateRef approved_gate_ref
  |
  v
PublishGovernanceService
  - load MethodContent
  - verify ExpectedVersion expected_version
  - verify ApprovedGateRef approved_gate_ref
  - call ReferenceValidationPolicy.validate_publish(MethodContent content)
  - call DefinitionUseBoundaryGuard.reject_use_truth(MethodContent content)
  |
  v
Domain Model / Policies
  - call MethodContent.publish(ApprovedGateRef gate_ref, ActorContext actor)
  - call FingerprintPolicy.calculate(CanonicalDefinition canonical)
  - create AuditRecord.from_publish_result(PublishResult result)
  - create OutboxEvent.from_publish_result(PublishResult result)
  |
  v
UnitOfWork / Repository / AuditLog / Outbox
  - save MethodContent lifecycle=published
  - append AuditRecord
  - append OutboxEvent
  |
  v
PublishMethodContentResult
```

关键设计点：

- publish 成功必须同时具备 state、version、fingerprint、audit、outbox。
- 下游不可用不阻断本仓发布,由 outbox / replay / snapshot 恢复。
- 事务实现、gate 校验细节和错误码留给详细设计。

### 7.7 DeprecateMethodContent 处理流

```text
DeprecateMethodContent
  |
  v
Command API
  - parse DeprecateMethodContentCommand command
  |
  v
MethodContentCommandService
  - load MethodContent
  - verify ExpectedVersion expected_version
  - call MethodContent.deprecate(LifecycleReason reason, ActorContext actor)
  - create AuditRecord.from_lifecycle_change(LifecycleChange change)
  - create OutboxEvent.from_lifecycle_change(LifecycleChange change)
  |
  v
UnitOfWork / Repository / AuditLog / Outbox
  - save MethodContent lifecycle=deprecated
  - append AuditRecord
  - append OutboxEvent
  |
  v
MethodContentLifecycleResult
```

关键设计点：

- deprecated 允许保留历史引用,但新引用应避免。
- 是否阻断新引用由状态机和引用校验规则继续展开。
- 具体事件子类和下游提示规则留给详细设计。

### 7.8 RetireMethodContent 处理流

```text
RetireMethodContent
  |
  v
Command API
  - parse RetireMethodContentCommand command
  |
  v
MethodContentCommandService
  - load MethodContent
  - verify ExpectedVersion expected_version
  - call MethodContent.retire(LifecycleReason reason, ActorContext actor)
  - create AuditRecord.from_lifecycle_change(LifecycleChange change)
  - create OutboxEvent.from_retire_result(RetireResult result)
  |
  v
UnitOfWork / Repository / AuditLog / Outbox
  - save MethodContent lifecycle=retired
  - append AuditRecord
  - append OutboxEvent
  |
  v
MethodContentLifecycleResult
```

关键设计点：

- retired 拒绝新引用。
- 历史追溯必须保留。
- 已运行下游实例如何处理不归本仓。

### 7.9 SupersedeMethodContent 处理流

```text
SupersedeMethodContent
  |
  v
Command API
  - parse SupersedeMethodContentCommand command
  |
  v
PublishGovernanceService
  - load old MethodContent
  - create or load new MethodContent draft
  - verify ApprovedGateRef approved_gate_ref
  - call ReferenceValidationPolicy.validate_publish(MethodContent new_content)
  |
  v
Domain Model / Policies
  - call old_content.supersede(MethodContentId new_content_id, ActorContext actor)
  - call new_content.publish(ApprovedGateRef gate_ref, ActorContext actor)
  - call FingerprintPolicy.calculate(CanonicalDefinition canonical)
  - create AuditRecord.from_publish_result(PublishResult result)
  - create OutboxEvent.from_publish_result(PublishResult result)
  |
  v
UnitOfWork / Repository / AuditLog / Outbox
  - save old lifecycle=superseded
  - save new lifecycle=published
  - append AuditRecord
  - append OutboxEvent
  |
  v
SupersedeMethodContentResult
```

关键设计点：

- supersede 是版本链变化,不是 published 原地修改。
- old / new 两端关系必须可追溯。
- 新内容发布失败时不能留下半条替代链,事务细节留给详细设计。

### 7.10 ExportDefinitionSnapshot 处理流

```text
ExportDefinitionSnapshot
  |
  v
Query API
  - parse ExportDefinitionSnapshotQuery query
  - pass ActorContext actor
  |
  v
SnapshotExportService
  - load MethodContent by MethodContentId content_id
  - choose DefinitionVersion version
  - call DefinitionSnapshot.from_version(MethodContent content, DefinitionVersion version)
  |
  v
SnapshotProjection / Definition Truth
  - include lifecycle / version / fingerprint
  - include snapshot schema version
  |
  v
DefinitionSnapshot
```

关键设计点：

- snapshot 是同步制品,不是第二定义真相。
- snapshot 必须包含 version / fingerprint / lifecycle。
- snapshot schema、分页和大对象 ref 留给详细设计。

### 7.11 ResolveViewProfile 处理流

```text
ResolveViewProfile
  |
  v
Query API
  - parse ResolveViewProfileQuery query
  - pass ActorContext actor
  |
  v
ViewProfileResolveService
  - build ViewProfileMatchKey match_key
  - read ViewProfileProjection by ViewProfileMatchKey match_key
  - fallback to ViewProfile definition when projection unavailable
  - call ViewProfileMatchPolicy.match(ViewProfileMatchKey match_key)
  |
  v
Query Projection / Definition Truth
  - choose active ViewProfile
  - attach version / fingerprint
  |
  v
ResolveViewProfileResult
```

关键设计点：

- ResolveViewProfile 是 Query,不得改变 MethodContent。
- 未匹配时生产默认 deny 或受控空视图。
- 具体匹配优先级、缓存策略和性能优化留给详细设计。

### 7.12 GetDefinitionTrace 处理流

```text
GetDefinitionTrace
  |
  v
Query API
  - parse GetDefinitionTraceQuery query
  |
  v
DefinitionTraceQueryService
  - read DefinitionTraceProjection by MethodContentId content_id
  - fallback to AuditRecord / OutboxEvent / DefinitionVersion sources if allowed
  |
  v
Trace Projection
  - aggregate version history
  - aggregate fingerprint history
  - aggregate audit records
  - aggregate event / snapshot refs
  |
  v
DefinitionTraceView
```

关键设计点：

- trace 是只读追溯视图。
- trace 可以聚合 audit / event / snapshot,但不改写真相。
- 投影缺失时的 fallback 策略留给详细设计。

### 7.13 CompareFingerprint 处理流

```text
CompareFingerprint
  |
  v
Query API
  - parse CompareFingerprintQuery query
  |
  v
DefinitionTraceQueryService
  - load MethodContent by MethodContentId content_id
  - read stored Fingerprint fingerprint
  - compare with FingerprintValue submitted_fingerprint
  |
  v
Fingerprint
  - call fingerprint.matches(FingerprintValue submitted_fingerprint)
  - return match or drift
  |
  v
FingerprintCompareResult
```

关键设计点：

- CompareFingerprint 不自动修复下游。
- drift 结果可进入审计或后续 P1 drift report。
- 具体 drift 分类和告警策略留给详细设计。

### 7.14 GovernanceGateApprovedConsumer 处理流

```text
GovernanceGateApprovedConsumer
  |
  v
Inbound Event Consumer
  - parse EventEnvelope envelope
  - read ExternalEventId event_id
  - check IdempotencyKey idempotency_key
  |
  v
PublishGovernanceService
  - record ApprovedGateRef approved_gate_ref
  - link gate to MethodContentId content_id when provided
  |
  v
Gate Projection
  - store reusable gate decision reference
  |
  v
Consumer Ack
```

关键设计点：

- 该 consumer 是可选入口。
- 它不执行 publish,PublishMethodContent 仍必须显式携带 approved_gate_ref 或等价引用。
- 本仓不保存 governance enforce result。

### 7.15 SeedInitialMethodAssets 处理流

```text
SeedInitialMethodAssets
  |
  v
Operations Trigger
  - parse SeedInitialMethodAssetsJobInput input
  - pass ActorContext actor / CommandMetadata metadata
  |
  v
MethodOperationsService
  - load seed package by SeedVersion seed_version
  - validate MethodContent kinds
  - create or confirm baseline definitions
  - call ReferenceValidationPolicy.validate_seed(MethodContent content)
  - create AuditRecord.from_lifecycle_change(LifecycleChange change)
  - create OutboxEvent when baseline published
  |
  v
UnitOfWork / Repository / AuditLog / Outbox
  - persist baseline definitions
  - append audit / outbox as needed
  |
  v
SeedInitialMethodAssetsResult
```

关键设计点：

- Seed 必须幂等,重复执行不得制造重复定义。
- Seed 不能绕过 definition / validation / audit 主链。
- seed 包格式和版本策略留给详细设计。

### 7.16 ReplayDefinitionEvents 处理流

```text
ReplayDefinitionEvents
  |
  v
Operations Trigger
  - parse ReplayDefinitionEventsJobInput input
  |
  v
MethodOperationsService
  - select existing OutboxEvent by range / kind
  - do not change MethodContent body
  - hand selected events to OutboxRelayWorker
  |
  v
OutboxRelayWorker / EventPublisherPort
  - republish OutboxEvent
  |
  v
ReplayDefinitionEventsResult
```

关键设计点：

- replay 只重放已存在事件,不修改定义正文。
- 下游通过 event replay / snapshot query 恢复。
- 批次、速率和失败重试参数留给详细设计。

### 7.17 RebuildDefinitionIndex 处理流

```text
RebuildDefinitionIndex
  |
  v
Operations Trigger
  - parse RebuildDefinitionIndexJobInput input
  |
  v
MethodOperationsService
  - load MethodContent source set
  - load AuditRecord / OutboxEvent when trace projection required
  - rebuild DefinitionReadModel
  - rebuild DefinitionTraceProjection
  - rebuild ViewProfileProjection
  |
  v
Projection Store
  - replace or refresh rebuildable projections
  |
  v
RebuildDefinitionIndexResult
```

关键设计点：

- projection 可重建,不是 definition truth。
- rebuild 不得覆盖 MethodContent write model。
- 增量 / 全量 rebuild 策略留给详细设计。

### 7.18 RecalculateFingerprint 处理流

```text
RecalculateFingerprint
  |
  v
Operations Trigger
  - parse RecalculateFingerprintJobInput input
  |
  v
MethodOperationsService
  - load MethodContent by MethodContentId content_id
  - build CanonicalDefinition canonical
  - call FingerprintPolicy.calculate(CanonicalDefinition canonical)
  - compare stored Fingerprint fingerprint
  |
  v
Audit / Reconciliation Record
  - record match or drift result when required
  |
  v
RecalculateFingerprintResult
```

关键设计点：

- fingerprint 复算不直接修改定义正文。
- 是否更新 stored fingerprint 需要受控策略,留给详细设计。
- P1 DetectDefinitionDrift 可复用该骨架但不阻塞 P0。

### 7.19 P1 接口处理流取舍说明

```text
PublishMethodPlugin
ActivateMethodConfiguration
ListMethodPlugins
GetMethodConfiguration
ExportAllSnapshots
DetectDefinitionDrift
```

这些接口本轮不画独立处理流。原因：

- 它们属于 P1 后置能力。
- 它们不得成为 P0 MethodContent 发布同步闭环的前置条件。
- 它们的对象位置和接口骨架已经在 Step 6 / Step 7 保留。
- 完整处理流留给 P1 详细设计。

### 7.20 处理流与对象 / 接口对应关系说明

| 处理流 | 主要接口 | 关键对象 |
|---|---|---|
| 草稿写路径 | Create / Update | MethodContent、DefinitionReference |
| 审核提交路径 | Submit | MethodContentLifecycle、AuditRecord |
| 发布路径 | Publish / Supersede | MethodContent、Fingerprint、AuditRecord、OutboxEvent |
| 废弃 / 退役路径 | Deprecate / Retire | MethodContentLifecycle、AuditRecord、OutboxEvent |
| 快照路径 | ExportDefinitionSnapshot | DefinitionSnapshot、MethodContent |
| 视图解析路径 | ResolveViewProfile | ViewProfile、ViewProfileProjection |
| 追溯路径 | GetDefinitionTrace | DefinitionTraceProjection、AuditRecord、OutboxEvent |
| 指纹对账路径 | Compare / Recalculate | Fingerprint、MethodContent |
| 恢复路径 | Replay / Rebuild | OutboxEvent、Projection |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §8。正式回填时建议保留覆盖清单和关键 P0 处理流,必要时裁剪 P1 取舍说明。

```md
## 8. 关键处理流 / 重要函数数据流

### 8.1 处理流覆盖清单

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| CreateMethodContentDraft | 是 | P0 Command,创建定义真相 |
| UpdateMethodContentDraft | 是 | P0 Command,改写 draft 内容 |
| SubmitMethodContentForReview | 是 | P0 Command,推进生命周期 |
| PublishMethodContent | 是 | P0 核心发布链 |
| DeprecateMethodContent | 是 | P0 状态变化 + event |
| RetireMethodContent | 是 | P0 状态变化 + event |
| SupersedeMethodContent | 是 | P0 版本链变化 |
| GetMethodContent / ListMethodContents / GetMethodContentVersion | 否 | 走通用读路径,无额外边界 |
| ExportDefinitionSnapshot | 是 | 下游恢复兜底入口 |
| ResolveViewProfile | 是 | 有匹配、fallback、默认 deny 边界 |
| GetDefinitionTrace | 是 | 聚合 audit / event / snapshot |
| CompareFingerprint | 是 | drift 判断关键路径 |
| GovernanceGateApprovedConsumer | 是 | 可选 Inbound Event,会写本地 gate projection |
| SeedInitialMethodAssets | 是 | P0 seed 幂等和审计 |
| ReplayDefinitionEvents | 是 | 影响传播可靠性 |
| RebuildDefinitionIndex | 是 | 影响查询一致性 |
| RecalculateFingerprint | 是 | 影响 drift 对账 |
| P1 Plugin / Configuration 接口 | 否 | P1 后置,本轮只保留边界 |

### 8.2 PublishMethodContent 处理流

```text
PublishMethodContent
  |
  v
Command API
  - parse PublishMethodContentCommand command
  - pass ApprovedGateRef approved_gate_ref
  |
  v
PublishGovernanceService
  - load MethodContent
  - verify ExpectedVersion expected_version
  - verify ApprovedGateRef approved_gate_ref
  - call ReferenceValidationPolicy.validate_publish(MethodContent content)
  - call DefinitionUseBoundaryGuard.reject_use_truth(MethodContent content)
  |
  v
Domain Model / Policies
  - call MethodContent.publish(ApprovedGateRef gate_ref, ActorContext actor)
  - call FingerprintPolicy.calculate(CanonicalDefinition canonical)
  - create AuditRecord.from_publish_result(PublishResult result)
  - create OutboxEvent.from_publish_result(PublishResult result)
  |
  v
UnitOfWork / Repository / AuditLog / Outbox
  - save MethodContent lifecycle=published
  - append AuditRecord
  - append OutboxEvent
  |
  v
PublishMethodContentResult
```

关键设计点：

- publish 成功必须同时具备 state、version、fingerprint、audit、outbox。
- 下游不可用不阻断本仓发布,由 outbox / replay / snapshot 恢复。
- 事务实现、gate 校验细节和错误码留给详细设计。
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 8 |
|---|---|---|
| 是否同意 P0 Command 都画独立处理流 | 建议同意,符合 SOP | 阻塞 |
| 是否同意普通 Get / List / Version Query 只走通用读路径 | 建议同意,避免重复 | 阻塞 |
| 是否同意 P1 接口本轮不画独立处理流 | 建议同意,P1 后置 | 不阻塞 |
| 是否同意异常细节和状态迁移细节分别留给 Step 10 / Step 9 | 建议同意,避免 Step 8 过重 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 9 前需要确认：

- [x] 是否同意本步的处理流覆盖范围
- [x] 是否同意 P0 Command 和关键 Job 的处理流粒度
- [x] 是否同意普通 Query 使用通用读路径说明
- [x] 是否同意 Step 9 再单独收稳状态机与状态流转
