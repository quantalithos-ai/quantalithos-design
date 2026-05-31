# Step 9. 逐接口定义函数级处理流

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 9 中间产物。
> 本步为 Step 8 中需要实现的 Command / Query / Inbound Event / Outbound Event / Operations Job 定义函数级数据流、调用链、事务边界、错误映射、状态与事件副作用和测试切口。
> 本步不定义新协议字段，不新增 Step 7 未定义的 port，不扩展状态集合；如果发现缺口，必须回退前序 Step。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-sdk/03-详细设计.md` §8 逐接口函数级处理流

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已确认 domain 对象、状态 enum、对象函数和 Rust client facade 对象 | 作为 domain method、状态变化和不变量来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已确认 repository、source、boundary、runner、artifact、projection、outbox port | 作为调用链中的 port 函数来源 |
| `03_ddd_step_08_protocol_contracts.md` | 已确认 Command、Query、Event、Job DTO、topic、binary、字段闭环和错误映射 | 作为入口函数、输入 DTO 和处理方来源 |
| `projects/L0-sdk/02-概要设计.md` §8 | 已确认关键处理流轮廓 | 作为本步函数级处理流的上游轮廓 |
| `standards/document/详细设计书写规范.md` §5.8 | 要求处理流总表、ASCII 调用图、伪代码、事务、错误、状态副作用和测试切口 | 作为本步格式依据 |

已确认结论：

```text
Command / Inbound Event / Operations Job 必须有可编码的函数级处理流。
Query API 使用一个通用只读流并列入口差异。
Outbound Event 使用一个通用 outbox 发布流并列 event kind 差异。
关键伪代码必须按 // [对象.函数(Type 参数名)] 标注调用作用。
```

---

## 3. SOP 问题回答

### 3.1 哪些协议必须拥有函数级处理流？

| 处理流类别 | 协议 | 处理方式 |
|---|---|---|
| Command API | `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` | 每个协议独立处理流 |
| Inbound Event Consumer | `ConsumeCoreContractChanged`、`ConsumeBusSemanticChanged`、`ConsumeFormalApiChanged`、`ConsumeValidationRunFinished` | 每个 consumer 独立处理流 |
| Operations Job | `CheckUpstreamFreshness`、`GeneratePackageCandidate`、`BuildLanguagePackages`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`、`RebuildSdkProjections` | 每个 job 独立处理流 |
| Query API | 12 个 Query API | 一个通用只读流，逐个列入口差异 |
| Outbound Event | 7 个 Outbound Event | 一个通用 outbox 发布流，逐个列 event kind 差异 |

### 3.2 每个处理流的入口函数是什么？

本步在 §7.1 处理流总表中列出入口函数。命名规则：

```text
command:
  <Service>.handle_<command>(CommandDto command, ActorContext actor, CommandMetadata meta)

runtime client:
  <Client>.call_or_read(<CommandOrQuery> input, ClientCallContext context, Metadata meta)

event consumer:
  <Consumer>.consume(<EventDto> event, EventConsumeMetadata meta)

job:
  <JobRunner>.run(<JobInput> input, JobMetadata meta)
```

### 3.3 入口 DTO 在哪一步被校验、派生、转换或用于构造 Domain 对象？

规则：

- 协议字段基础校验在 entry / consumer / job runner 完成。
- 幂等检查在 application service 开启写事务前或刚进入事务时完成。
- 需要 repository lookup 的字段在 application service 中补齐。
- 状态和目标对象由 Step 6 的 domain method / factory 生成，不由 DTO 直接指定终态。
- 外部 source / boundary / runner 调用必须经 Step 7 port。

### 3.4 事务在哪里开始，在哪里提交，哪些错误触发回滚？

| 流类型 | 事务边界 | 回滚错误 |
|---|---|---|
| 本地写 Command | application service 内部 `UnitOfWork.begin()` 到 `UnitOfWork.commit()` | validation 之后的 repository / domain / outbox staging 错误 |
| runtime boundary Command / Query | 不写 SDK domain truth，不开启本地 domain 写事务；write-like runtime call 可写幂等技术记录 | 不适用 |
| Inbound Event Consumer | consumer service 内部每个 event 一个事务 | 幂等冲突以外的写入错误 |
| Operations Job | 每个 target item 一个事务，job summary 单独记录 | 单 item 错误只回滚该 item |
| Query API | 不开启写事务 | 不适用 |
| Outbound Event 发布 | truth 已提交后执行 | publisher error 不回滚 truth，进入 retry |

### 3.5 哪些状态会被修改，哪些事件会被写入？

状态和事件副作用在每个处理流中列出。完整状态矩阵由 Step 10 收口，本步只记录哪个流触发状态变化。

### 3.6 每个处理流至少需要哪些测试切口？

每个处理流的最小测试切口列在对应小节中，Step 16 再统一整理测试矩阵。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| Step 8 | 已定义协议字段，但未定义内部调用链 | 实现者可能直接在 handler / job 写业务逻辑 | 本步强制进入 application service |
| Step 7 | port 已定义，但尚未进入具体函数流 | 实现者不知道哪些 port 在何时调用 | 本步在伪代码中标注 port 函数 |
| Query API | 12 个 query 容易被写成会自动修复 projection | 查询产生隐藏写副作用 | 本步规定 query 只读，不自动 rebuild |
| Runtime boundary | `InvokeServiceCapability` / `PublishBusEvent` 容易写入 SDK truth | SDK 滑向 server gateway 或 bus runtime | 本步规定 runtime boundary 不写本地 truth |
| Job | job 容易绕过 application service 直接调用 runner / repository | evidence、状态和 outbox 不一致 | 本步规定 job 通过 application service |
| Outbound Event | event 发布可能与 truth 写事务混在一起 | publisher 失败污染 truth 提交 | 本步规定 outbox committed 后发布 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 处理流粒度 | 概要级步骤和 Step 8 协议表 | 函数级调用图、伪代码和事务边界 | 支撑编码 |
| DTO 使用 | 只知道字段 | 明确校验、lookup、domain factory / method 和 port 调用顺序 | 防止 DTO 直接变状态 |
| 事务 | 只知道 `UnitOfWork` | 明确 begin / commit / rollback 位置 | 支撑一致性 |
| 错误 | 只有协议错误类别 | 每个流列检测位置和映射 | 支撑实现测试 |
| 状态副作用 | 分散在对象和协议文档 | 每个流列触发状态和 outbox event | 支撑 Step 10 |
| 测试切口 | 未逐流列出 | 每个流给最小测试切口 | 支撑 Step 16 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有 36 个协议逐个完整展开 | 表面完整 | Query 和 Outbound Event 会大量重复，文件难以 review | 不采用 |
| Command / Inbound / Job 独立，Query / Outbound Event 使用通用流加入口差异 | 保留关键写路径完整度，减少重复 | Query 单例特殊差异需要表格列清 | 采用 |
| 只写总图和总伪代码 | 文件短 | 不能 1:1 指导实现 | 不采用 |
| job 直接调用 runner / repository | 实施快 | 破坏 evidence、状态和 outbox 一致性 | 不采用 |

推荐方案：Command / Inbound / Job 独立展开，Query / Outbound Event 使用通用流。

原因：

- SDK 的高风险路径是写路径、上游消费、candidate/evidence/compatibility job 和 runtime boundary。
- Query 不改写真相，核心差异是读取来源和返回 view。
- Outbound Event 不改写真相，核心差异是 event kind 和 payload 来源。

---

## 7. 结构化中间产物

### 7.1 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `UpdateSdkSemanticBaselineFlow` | `UpdateSdkSemanticBaseline` | `SdkSemanticBaselineService.update_baseline(UpdateSdkSemanticBaselineCommand command, ActorContext actor, CommandMetadata meta)` | 单命令写事务 | 新 baseline version committed | language missing、capability source missing、idempotent replay、outbox append |
| `RefreshDerivedBindingViewFlow` | `RefreshDerivedBindingView` | `ContractConsumptionService.refresh_views(RefreshDerivedBindingViewCommand command, ActorContext actor, CommandMetadata meta)` | 单命令写事务 | freshness -> `Fresh` / stale affected views refreshed | source unavailable、snapshot digest mismatch、view save conflict |
| `InvokeServiceCapabilityFlow` | `InvokeServiceCapability` | `ServiceClientAssemblyService.invoke(ServiceCapabilityCall command, ClientCallContext context, CommandMetadata meta)` | 无本地写事务 | 无 SDK truth 状态变化 | unsupported capability、fake marker missing、formal dependency failure |
| `PublishBusEventFlow` | `PublishBusEvent` | `EventClientAssemblyService.publish(PublishBusEventCommand command, ClientCallContext context, CommandMetadata meta)` | 无本地写事务 | 无 SDK truth 状态变化 | payload body rejected、mapping missing、bus boundary unavailable |
| `RecordCompatibilityDecisionFlow` | `RecordCompatibilityDecision` | `CompatibilityGovernanceService.record_decision(RecordCompatibilityDecisionCommand command, ActorContext actor, CommandMetadata meta)` | 单命令写事务 | compatibility decision recorded | missing evidence、migration required、outbox append |
| `DeprecateSdkApiFlow` | `DeprecateSdkApi` | `CompatibilityGovernanceService.deprecate_api(DeprecateSdkApiCommand command, ActorContext actor, CommandMetadata meta)` | 单命令写事务 | deprecated API lifecycle changed | missing migration ref、invalid lifecycle transition、outbox append |
| `ConsumeCoreContractChangedFlow` | `ConsumeCoreContractChanged` | `ContractConsumptionService.consume_core_contract_changed(CoreContractChangedEvent event, EventConsumeMetadata meta)` | 单 event 写事务 | affected views stale | duplicate event、missing snapshot ref |
| `ConsumeBusSemanticChangedFlow` | `ConsumeBusSemanticChanged` | `ContractConsumptionService.consume_bus_semantic_changed(BusSemanticChangedEvent event, EventConsumeMetadata meta)` | 单 event 写事务 | event view refreshed / stale | duplicate event、missing bus semantic ref、bus snapshot unavailable |
| `ConsumeFormalApiChangedFlow` | `ConsumeFormalApiChanged` | `ContractConsumptionService.consume_formal_api_changed(FormalApiChangedEvent event, EventConsumeMetadata meta)` | 单 event 写事务 | service view stale / compatibility impacted | duplicate event、missing formal API ref |
| `ConsumeValidationRunFinishedFlow` | `ConsumeValidationRunFinished` | `CandidateValidationService.consume_validation_finished(ValidationRunFinishedEvent event, EventConsumeMetadata meta)` | 单 event 写事务 | evidence recorded、candidate may advance | duplicate run、unredacted evidence rejected |
| `QueryReadOnlyFlow` | 12 个 Query API | `QueryService.query(QueryRequest query, ActorContext actor, QueryMetadata meta)` | 无写事务 | 无 truth 状态变化 | not found、projection stale marker、pagination |
| `OutboundEventPublishFlow` | 7 个 Outbound Event | `SdkOutboxPublisher.publish_committed(SdkOutboxEvent event, TraceContext trace)` | truth 已提交后发布 | 无 truth 状态变化 | schema violation、publisher retry、no raw body |
| `CheckUpstreamFreshnessFlow` | `CheckUpstreamFreshness` | `CheckUpstreamFreshnessRunner.run(CheckUpstreamFreshnessJobInput input, JobMetadata meta)` | 每 source 一个事务或只读检查 | optional affected views stale | stale detected、source unavailable |
| `GeneratePackageCandidateFlow` | `GeneratePackageCandidate` | `GeneratePackageCandidateRunner.run(GeneratePackageCandidateJobInput input, JobMetadata meta)` | 单 candidate 写事务 | `PackageCandidateStatus: Draft` | stale view blocked、candidate duplicate |
| `BuildLanguagePackagesFlow` | `BuildLanguagePackages` | `BuildLanguagePackagesRunner.run(BuildLanguagePackagesJobInput input, JobMetadata meta)` | 单 candidate 写事务 | candidate artifacts attached / built | builder failure、digest mismatch |
| `RunCrossLanguageSmokeFlow` | `RunCrossLanguageSmoke` | `RunCrossLanguageSmokeRunner.run(RunCrossLanguageSmokeJobInput input, JobMetadata meta)` | 单 evidence 写事务 | evidence recorded、candidate may verified | fake marker, redaction, failed smoke |
| `ValidateDocsExamplesFlow` | `ValidateDocsExamples` | `ValidateDocsExamplesRunner.run(ValidateDocsExamplesJobInput input, JobMetadata meta)` | 单 evidence 写事务 | docs evidence recorded | failed example、artifact missing |
| `CheckCompatibilityFlow` | `CheckCompatibility` | `CheckCompatibilityRunner.run(CheckCompatibilityJobInput input, JobMetadata meta)` | 单 decision 写事务 | compatibility decision recorded | missing evidence、breaking change |
| `VerifyBoundaryPoliciesFlow` | `VerifyBoundaryPolicies` | `VerifyBoundaryPoliciesRunner.run(VerifyBoundaryPoliciesJobInput input, JobMetadata meta)` | 单 evidence 写事务 | boundary evidence recorded | plain secret rejected、raw body rejected |
| `RebuildSdkProjectionsFlow` | `RebuildSdkProjections` | `RebuildSdkProjectionsRunner.run(RebuildSdkProjectionsJobInput input, JobMetadata meta)` | 每 projection batch 一个事务 | projection rebuilt | dry run、batch failure |

### 7.1.1 实施阶段边界

| 处理流 | phase boundary |
|---|---|
| `ConsumeCoreContractChangedFlow` | PH-02 / `commit-02-b`。只允许写 version ref、derived / language freshness stale mark 和 outbox。 |
| `ConsumeBusSemanticChangedFlow` | PH-03 / `commit-03-a`。该流会读写 `BusEventClientView`,不得放入 `commit-02-b`。 |
| `ConsumeFormalApiChangedFlow` | PH-03 / `commit-03-a`。该流会读写 `ServiceClientView`,不得放入 `commit-02-b`。 |

补充边界:

- PH-02 / `commit-02-b` 的 `RefreshDerivedBindingViewFlow` 可以只读 `commit-02-a` 已交付的 `SdkSemanticBaseline` / `CrossLanguageConceptMap`,用于构造 `LanguageBindingView`。
- `commit-02-b` 不得改写 semantic baseline 或 concept map;语义基线变更仍只属于 `UpdateSdkSemanticBaselineFlow` / `commit-02-a`。

PH-02 的 upstream changed consumer 不得提前引入 `domain_service_client` 或 `domain_event_client` 对象。若当前实现阶段需要处理 bus semantic 或 formal API changed event,必须先进入 PH-03 并完成对应 client view 对象。

### 7.2 通用函数级规则

#### 7.2.1 本地写路径通用图

```text
[Client / CLI / Job / Event Consumer]
  | call parse_and_validate(ProtocolInput input, ActorContext actor, Metadata meta)
  v
[Application Service]
  | call SdkIdempotencyRepository.find(IdempotencyKey key)
  | tx UnitOfWork.begin()
  v
[Domain Object / Policy]
  | call DomainObject.method(TypedInput input, ActorContext actor)
  v
[Repository / Projection / Outbox]
  | save truth
  | update projection when required
  | append SdkOutboxEvent
  v
[UnitOfWork]
  | tx commit
```

关键说明：

- 幂等检查必须早于状态修改。
- repository 写入、projection 更新和 outbox append 的事务细节由 Step 11 收口；本步只固定调用顺序。
- event bus 外部发布不在写事务内执行。

#### 7.2.2 Runtime boundary 通用图

```text
[Rust Client Facade]
  | call ServiceClient.call(ServiceCapabilityCall command, CommandMetadata meta)
  | call EventClient.publish(PublishBusEventCommand command, CommandMetadata meta)
  v
[Application Service]
  | call RuntimeIdempotencyRepository.find/reserve(IdempotencyKey key)
  | call ViewRepository.get_current()
  | call BoundaryGuard.assert_capability_allowed(ClientCapabilityId capability_id)
  | call BoundaryGuard.assert_event_mapping_allowed(EventSemanticMapping mapping)
  | call CredentialProtectionPolicy.assert_no_plain_secret(ClientCallContext context)
  | call RedactionPolicy.assert_ref_only(PayloadRef ref)
  v
[Boundary Port]
  | call FormalApiBoundaryPort.call_service(...)
  | call FakeFixtureEndpointPort.call_fake(...)
  | call BusEventBoundaryPort.publish_event(...)
  v
[Boundary Result]
  | return ref / digest / diagnostic only
```

关键说明：

- runtime boundary 不开启 SDK domain truth 写事务；write-like runtime call 可写幂等技术记录。
- fake result 必须保留 fake marker。
- boundary result 不包含 raw request / response body。

#### 7.2.3 Query 通用图

```text
[Rust Client / CLI]
  | call QueryService.query(QueryRequest query, ActorContext actor, QueryMetadata meta)
  v
[QueryService]
  | validate query fields
  | call ProjectionPort.get(...)
  | call Repository.get(...) only for read model fallback allowed by flow
  v
[View]
  | return view + consistency marker
```

关键说明：

- Query 不开启写事务。
- Query 不自动 refresh source、不生成 candidate、不重建 projection。
- projection stale 通过 consistency marker 返回。

#### 7.2.4 Job batch 通用图

```text
[Job Runner]
  | call RuntimeBuilder.build()
  | call ApplicationService.run_job(JobInput input, JobMetadata meta)
  v
[Application Service]
  | for each target item
  | tx UnitOfWork.begin()
  | process item through domain object / runner port
  | save result / evidence / projection
  | tx UnitOfWork.commit()
  v
[Job Summary]
  | record scanned / succeeded / skipped / failed / next cursor
```

关键说明：

- Job 不使用整批大事务。
- 单 item 失败只回滚该 item。
- job runner 不直接调用 repository 或 runner port；通过 application service 编排。

### 7.3 Command API 处理流

#### 7.3.1 `UpdateSdkSemanticBaselineFlow`

##### 函数级调用图

```text
[CLI / Admin Client]
  | call SdkSemanticBaselineService.update_baseline(UpdateSdkSemanticBaselineCommand command, ActorContext actor, CommandMetadata meta)
  v
[SdkSemanticBaselineService]
  | call SdkIdempotencyRepository.find(IdempotencyKey key)
  | tx UnitOfWork.begin()
  | call SemanticBaselineRepository.get_for_update(UnitOfWorkHandle uow)
  v
[SdkSemanticBaseline]
  | call SdkSemanticBaseline.derive_next(SdkBaselineChange change, ActorContext actor, Timestamp now)
  v
[Repository + Projection + Outbox]
  | call SemanticBaselineRepository.save(SdkSemanticBaseline baseline, ExpectedVersion expected_version, UnitOfWorkHandle uow)
  | call SdkCapabilityProjectionPort.upsert_summary(SdkCapabilitySummaryView summary, UnitOfWorkHandle uow)
  | call SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)
  | tx UnitOfWork.commit(UnitOfWorkHandle uow)
```

##### 关键伪代码

```rust
// [SdkIdempotencyRepository.find(IdempotencyKey key)]
// 使用 meta.request.idempotency_key 检查是否为重复命令；缺失时返回 validation。
let replay = idempotency.find(required_idempotency_key(meta.request.idempotency_key)?).await?;

// [UnitOfWork.begin()]
// 开启语义基线更新写事务。
let uow = unit_of_work.begin().await?;

// [SemanticBaselineRepository.get_for_update(UnitOfWorkHandle uow)]
// 读取并锁定当前语义基线。
let current = baseline_repo.get_for_update(uow.clone()).await?;

// [SdkSemanticBaseline.derive_next(SdkBaselineChange change, ActorContext actor, Timestamp now)]
// 根据 command.baseline_change 派生下一版语义基线。
let next = current.derive_next(command.baseline_change, actor, clock.now())?;

// [SemanticBaselineRepository.save(SdkSemanticBaseline baseline, ExpectedVersion expected_version, UnitOfWorkHandle uow)]
// 保存新基线并执行乐观锁校验。
let version = baseline_repo.save(next, expected_version, uow.clone()).await?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 SdkSemanticBaselineChangedEvent 对应的 outbox fact。
outbox.append(event, uow.clone()).await?;

// [UnitOfWork.commit(UnitOfWorkHandle uow)]
// 提交基线、projection 和 outbox。
unit_of_work.commit(uow).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| `SdkSemanticBaselineService.update_baseline` | `UnitOfWork.commit` | domain 校验失败、repository 保存失败、projection 更新失败、outbox append 失败 | baseline 保存、capability projection 更新、outbox append、幂等完成 |

##### 错误映射

| 场景 | 检测位置 | 错误 |
|---|---|---|
| supported languages 不完整 | `SdkSemanticBaseline.derive_next` | `Validation` |
| capability source 不存在 | source / repository lookup | `NotFound` |
| expected version 冲突 | `SemanticBaselineRepository.save` | `Conflict` |

##### 状态与事件副作用

- 生成新 `SdkSemanticBaseline.baseline_version`。
- 更新 `SdkCapabilitySummaryView`。
- 写入 `SdkSemanticBaselineChangedEvent` outbox。

##### 测试切口

- 三语言缺失时 reject。
- 相同幂等键重复提交返回同一结果。
- repository version conflict 返回 `Conflict`。
- outbox append 失败触发事务回滚。

#### 7.3.2 `RefreshDerivedBindingViewFlow`

##### 函数级调用图

```text
[CLI / Job]
  | call ContractConsumptionService.refresh_views(RefreshDerivedBindingViewCommand command, ActorContext actor, CommandMetadata meta)
  v
[Source Ports]
  | call CoreContractSourcePort.fetch_snapshot(UpstreamVersionRef ref)
  | call BusSemanticSourcePort.fetch_snapshot(UpstreamVersionRef ref)
  | call FormalApiSourcePort.fetch_snapshot(UpstreamVersionRef ref)
  | call SemanticBaselineRepository.get_current()
  v
[Application Derivation]
  | extract Vec<UpstreamVersionRef> from snapshot metadata
  | derive Vec<CapabilitySymbol> from snapshot content
  v
[Domain View]
  | call DerivedBindingView::from_upstream_refs_and_symbols(Vec<UpstreamVersionRef> refs, Vec<CapabilitySymbol> symbols)
  | call LanguageBindingView::derive_for_language(DerivedBindingView view, LanguageId language_id, CrossLanguageConceptMap concept_map)
  | call SnapshotFreshnessState.mark_fresh(Timestamp now)
  v
[Repository + Outbox]
  | tx begin
  | save derived view / language views / version refs
  | call IdGeneratorPort.next_outbox_event_id()
  | append SdkSnapshotFreshnessChangedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [CoreContractSourcePort.fetch_snapshot(UpstreamVersionRef version_ref)]
// 按 command.source_refs 读取 core snapshot。
let core_snapshot = core_source.fetch_snapshot(core_ref).await?;

// [BusSemanticSourcePort.fetch_snapshot(UpstreamVersionRef version_ref)]
// 读取 bus semantic snapshot。
let bus_snapshot = bus_source.fetch_snapshot(bus_ref).await?;

// [FormalApiSourcePort.fetch_snapshot(UpstreamVersionRef version_ref)]
// 读取 formal API snapshot。
let formal_snapshot = formal_source.fetch_snapshot(formal_ref).await?;

// [SemanticBaselineRepository.get_current()]
// 读取当前 semantic baseline,用于取得 CrossLanguageConceptMap。
let baseline = semantic_baseline_repo.get_current().await?;

// [SdkSemanticBaseline.concept_map()]
// 取得当前共同概念映射,RefreshDerivedBindingViewCommand 不携带该对象。
let concept_map = baseline.concept_map()?;

// [Application derivation]
// 从 snapshot metadata 收集参与派生的上游版本引用。
let source_refs = collect_upstream_refs(&core_snapshot, &bus_snapshot, &formal_snapshot)?;

// [Application derivation]
// 从 source snapshot 内容提取 SDK 领域符号;不得把 source snapshot DTO 传入 domain 工厂。
let symbols = derive_capability_symbols(&core_snapshot, &bus_snapshot, &formal_snapshot, &baseline)?;

// [UnitOfWork.begin()]
// 开启派生视图保存事务。
let uow = unit_of_work.begin().await?;

// [DerivedBindingView::from_upstream_refs_and_symbols(Vec<UpstreamVersionRef> refs, Vec<CapabilitySymbol> symbols)]
// 从上游引用和应用层提取出的能力符号创建 SDK 本地视图,不复制上游正文。
let view = DerivedBindingView::from_upstream_refs_and_symbols(source_refs.clone(), symbols)?;

// [LanguageBindingView::derive_for_language(DerivedBindingView view, LanguageId language_id, CrossLanguageConceptMap concept_map)]
// 基于共同派生视图和当前 concept map 派生语言视图。
let language_views = command
    .refresh_scope
    .languages
    .iter()
    .map(|language_id| LanguageBindingView::derive_for_language(view.clone(), language_id.clone(), concept_map.clone()))
    .collect::<Result<Vec<_>, _>>()?;

// [DerivedViewRepository.save_binding_view(DerivedBindingView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)]
// 保存派生视图。
derived_repo.save_binding_view(view, expected_version, uow.clone()).await?;

// [DerivedViewRepository.save_language_view(LanguageBindingView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)]
// 保存每个语言视图;语言视图不得新增 derived view 中不存在的能力。
for language_view in language_views {
    derived_repo.save_language_view(language_view, expected_version, uow.clone()).await?;
}

// [VersionRefRepository.upsert_upstream_ref(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)]
// 保存当前上游版本引用。
for source_ref in source_refs {
    version_repo.upsert_upstream_ref(source_ref, uow.clone()).await?;
}

// [IdGeneratorPort.next_outbox_event_id()]
// 生成 outbox event id;不得从 digest、业务字段或 repository 返回值拼接。
let outbox_event_id = id_generator.next_outbox_event_id();

// [SdkSnapshotFreshnessChangedEvent::from_refresh(...)]
// 基于已保存 view 和生成的 outbox event id 构造待发布事件。
let event = SdkSnapshotFreshnessChangedEvent::from_refresh(outbox_event_id, view.view_id.clone(), actor, meta)?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 freshness changed event。
outbox.append(event, uow.clone()).await?;

// [UnitOfWork.commit(UnitOfWorkHandle uow)]
// 提交派生视图、版本引用和 outbox。
unit_of_work.commit(uow).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| source snapshot 和 current semantic baseline / concept map 成功读取后 | view / ref / outbox 保存后 | snapshot digest mismatch、concept map missing / mismatch、view 保存失败、outbox append 失败 | derived view、language view、version refs、freshness event |

##### 错误映射

| 场景 | 检测位置 | 错误 |
|---|---|---|
| source 暂不可用 | source port | `Dependency` |
| semantic baseline 或 concept map 缺失 | `SemanticBaselineRepository.get_current` / baseline validation | `Validation` |
| snapshot digest 不匹配 | application service | `Validation` |
| view version 冲突 | repository | `Conflict` |

##### 状态与事件副作用

- `SnapshotFreshnessState` 进入 `Fresh` 或标记 affected stale 后刷新。
- 写入 `SdkSnapshotFreshnessChangedEvent`。

##### 测试切口

- core source unavailable 返回 retryable dependency error。
- digest mismatch 不保存 view。
- stale view refresh 后 freshness 为 `Fresh`。

#### 7.3.3 `InvokeServiceCapabilityFlow`

##### 函数级调用图

```text
[ServiceClient]
  | call ServiceClient.call(ServiceCapabilityCall command, CommandMetadata meta)
  v
[ServiceClientAssemblyService]
  | call RuntimeIdempotencyRepository.find/reserve(canonical invoke key)
  | call ServiceClientViewRepository.get_current()
  | call ServiceClientView.resolve_capability(ServiceCapabilityRefId capability_ref)
  | call BoundaryGuard.assert_capability_allowed(ClientCapabilityId capability_id)
  | call CredentialProtectionPolicy.assert_no_plain_secret(ClientCallContext context)
  | call RedactionPolicy.assert_ref_only(PayloadRef input_ref)
  v
[Boundary Port]
  | call FormalApiBoundaryPort.call_service(...) OR FakeFixtureEndpointPort.call_fake(...)
  v
[Result]
  | return ServiceCapabilityCallResult with ref / digest / diagnostic
```

##### 关键伪代码

```rust
// [RuntimeIdempotencyRepository.find/reserve(IdempotencyKey key, CommandDigest digest)]
// runtime write-like call 虽不写 SDK domain truth,但必须防止 caller retry 重复触发外部边界。
let key = IdempotencyKey::for_runtime_invoke(meta.request.idempotency_key, command.capability_ref.clone())?;
let digest = CommandDigest::from_service_call(&command, &context)?;
let replay = runtime_idempotency.find(key.clone()).await?;
let reservation = runtime_idempotency.reserve(key.clone(), digest.clone()).await?;

// [ServiceClientViewRepository.get_current()]
// 读取当前 service client view。
let view = service_view_repo.get_current().await?;

// [ServiceClientView.resolve_capability(ServiceCapabilityRefId ref_id)]
// command.capability_ref 是稳定引用 ID,不是完整 ServiceCapabilityRef 对象。
let capability = view.resolve_capability(command.capability_ref.clone())?;

// [BoundaryGuard.assert_capability_allowed(ClientCapabilityId capability_id)]
// 校验 capability 是否可由 SDK 暴露。
boundary_guard.assert_capability_allowed(capability.capability_id.clone())?;

// [CredentialProtectionPolicy.assert_no_plain_secret(ClientCallContext context)]
// 确认上下文中不含明文 secret。
credential_policy.assert_no_plain_secret(context.clone())?;

// [RedactionPolicy.assert_ref_only(PayloadRef input_ref)]
// 确认协议只传 payload ref / digest。
redaction_policy.assert_ref_only(command.input_ref)?;

// [FormalApiBoundaryPort.call_service(ServiceCapabilityCall command, ClientCallContext context)]
// formal profile 走正式边界。
let result = formal_boundary.call_service(command, context).await?;

// [FakeFixtureEndpointPort.assert_fake_marker(FakeBoundaryResultRef result_ref)]
// fake profile 必须校验 fake marker。
fake_boundary.assert_fake_marker(result.fake_result_ref).await?;

// [RuntimeIdempotencyRepository.complete(IdempotencyKey key, CommandReceiptRef receipt_ref)]
// 将 ref-only result 记录为幂等结果;该记录是技术控制记录,不是 SDK domain truth。
runtime_idempotency.complete(key, result.result_ref.clone().into()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| 不开启 domain 写事务；只允许 `RuntimeIdempotencyRepository` 技术记录 | boundary 返回并完成 runtime 幂等记录后 | capability unsupported、payload 越界、boundary failure、idempotency conflict | 不写 SDK domain truth；不使用 `UnitOfWorkHandle`；可写 runtime idempotency 记录 |

##### 错误映射

| 场景 | 检测位置 | 错误 |
|---|---|---|
| capability 不支持 | `BoundaryGuard` | `Validation` |
| 明文 secret | `CredentialProtectionPolicy` | `BoundaryViolation` |
| fake marker 缺失 | `FakeFixtureEndpointPort.assert_fake_marker` | `BoundaryViolation` |
| formal API unavailable | `FormalApiBoundaryPort` | `Dependency` |

##### 状态与事件副作用

- 无 SDK truth 状态变化。
- 不写 outbox。

##### 测试切口

- unsupported capability 被拒绝。
- fake result 缺 marker 被拒绝。
- payload body 直接输入被拒绝。

#### 7.3.4 `PublishBusEventFlow`

##### 函数级调用图

```text
[EventClient]
  | call EventClient.publish(PublishBusEventCommand command, CommandMetadata meta)
  v
[EventClientAssemblyService]
  | call RuntimeIdempotencyRepository.find/reserve(canonical publish key)
  | call EventClientViewRepository.get_current()
  | call BusEventClientView.mapping_by_ref(EventSemanticMappingRef event_mapping_ref)
  | call BoundaryGuard.assert_event_mapping_allowed(EventSemanticMapping mapping)
  | call TracePropagationPolicy.build_trace(TraceContext context)
  | call RedactionPolicy.assert_ref_only(PayloadRef payload_ref)
  v
[BusEventBoundaryPort]
  | call publish_event(PublishBusEventCommand command, ClientCallContext context)
  v
[BusEventPublishResult]
```

##### 关键伪代码

```rust
// [RuntimeIdempotencyRepository.find/reserve(IdempotencyKey key, CommandDigest digest)]
// runtime write-like publish 必须防止 caller retry 重复触发 bus boundary。
let key = IdempotencyKey::for_runtime_publish(meta.request.idempotency_key, command.event_mapping_ref.clone())?;
let digest = CommandDigest::from_publish_command(&command, &context)?;
let replay = runtime_idempotency.find(key.clone()).await?;
let reservation = runtime_idempotency.reserve(key.clone(), digest.clone()).await?;

// [EventClientViewRepository.get_current()]
// 读取 event client view 和 semantic mapping。
let view = event_view_repo.get_current().await?;

// [BusEventClientView.mapping_by_ref(EventSemanticMappingRef event_mapping_ref)]
// 解析 event semantic mapping。
let mapping = view.mapping_by_ref(command.event_mapping_ref.clone())?;

// [BoundaryGuard.assert_event_mapping_allowed(EventSemanticMapping mapping)]
// 校验该 SDK event mapping 可以通过 SDK event boundary 暴露。
boundary_guard.assert_event_mapping_allowed(mapping.clone())?;

// [RedactionPolicy.assert_ref_only(PayloadRef payload_ref)]
// 确保不传 payload body。
redaction_policy.assert_ref_only(command.payload_ref)?;

// [BusEventBoundaryPort.publish_event(PublishBusEventCommand command, ClientCallContext context)]
// 通过 L0-bus 边界发布请求。
let result = bus_boundary.publish_event(command, context).await?;

// [RuntimeIdempotencyRepository.complete(IdempotencyKey key, CommandReceiptRef receipt_ref)]
// 将 bus publish ref 记录为幂等结果;不生成 L0-bus publication / delivery truth。
runtime_idempotency.complete(key, result.bus_publish_ref.clone().into()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| 不开启 domain 写事务；只允许 `RuntimeIdempotencyRepository` 技术记录 | bus boundary 返回并完成 runtime 幂等记录后 | mapping missing、payload 越界、boundary failure、idempotency conflict | 不写 SDK domain truth；不使用 `UnitOfWorkHandle`；不生成 bus runtime truth |

##### 错误映射

| 场景 | 检测位置 | 错误 |
|---|---|---|
| event mapping 不存在 | `EventClientView` | `NotFound` |
| payload body 越界 | `RedactionPolicy` | `BoundaryViolation` |
| bus boundary unavailable | `BusEventBoundaryPort` | `Dependency` |

##### 状态与事件副作用

- 无 SDK truth 状态变化。
- 不生成 `L0-bus` publication / delivery truth。

##### 测试切口

- mapping missing 返回 not_found。
- raw payload body 被拒绝。
- bus boundary failure 返回 retryable dependency error。

#### 7.3.5 `RecordCompatibilityDecisionFlow`

##### 函数级调用图

```text
[CLI / Compatibility Job]
  | call CompatibilityGovernanceService.record_decision(RecordCompatibilityDecisionCommand command, ActorContext actor, CommandMetadata meta)
  v
[Application Service]
  | tx begin
  | call CandidateRepository.get(PackageCandidateId candidate_id)
  | call EvidenceRepository.list_by_candidate(PackageCandidateId candidate_id)
  | call IdGeneratorPort.next_compatibility_decision_id()
  v
[CompatibilityDecision]
  | call CompatibilityDecision.record(...)
  v
[Repository + Projection + Outbox]
  | save decision
  | update compatibility projection
  | append CompatibilityDecisionRecordedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [CandidateRepository.get(PackageCandidateId candidate_id)]
// 读取 candidate。
let candidate = candidate_repo.get(command.candidate_id).await?;

// [EvidenceRepository.list_by_candidate(PackageCandidateId candidate_id)]
// 读取 candidate evidence 集合。
let evidence = evidence_repo.list_by_candidate(command.candidate_id).await?;

// [UnitOfWork.begin()]
// 开启 compatibility decision 写事务。
let uow = unit_of_work.begin().await?;

// [IdGeneratorPort.next_compatibility_decision_id()]
// 生成 compatibility decision ID。
let decision_id = id_generator.next_compatibility_decision_id();

// [CompatibilityDecision::record(CompatibilityDecisionId decision_id, PackageCandidateId candidate_id, SdkBaselineVersion baseline_version, CompatibilityDecisionState decision_state, Vec<VerificationEvidenceRef> evidence_refs, Option<MigrationGuideRef> migration_ref)]
// 根据证据形成兼容判断。
let decision = CompatibilityDecision::record(
    decision_id,
    command.candidate_id,
    command.baseline_version,
    command.decision_state,
    evidence_refs,
    command.migration_ref,
)?;

// [CompatibilityRepository.save_decision(CompatibilityDecision decision, UnitOfWorkHandle uow)]
// 保存 compatibility decision。
compat_repo.save_decision(decision, uow.clone()).await?;

// [CompatibilityProjectionPort.upsert_compatibility_view(CompatibilityView view, UnitOfWorkHandle uow)]
// 更新 compatibility projection。
compat_projection.upsert_compatibility_view(view, uow.clone()).await?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 CompatibilityDecisionRecordedEvent。
outbox.append(event, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| candidate / evidence lookup 成功后 | decision / projection / outbox 保存后 | evidence 不合格、repository failure、outbox failure | decision、projection、outbox、幂等完成 |

##### 错误映射

| 场景 | 检测位置 | 错误 |
|---|---|---|
| candidate 不存在 | repository lookup | `NotFound` |
| evidence missing / failed / unredacted | domain policy | `Validation` |
| migration required 但缺 migration ref | domain object | `Validation` |

##### 状态与事件副作用

- 记录 `CompatibilityDecisionState`。
- 写入 `CompatibilityDecisionRecordedEvent`。

##### 测试切口

- missing evidence blocks compatible。
- requires migration 时 migration ref 必填。
- outbox append 失败回滚 decision。

#### 7.3.6 `DeprecateSdkApiFlow`

##### 函数级调用图

```text
[CLI / Admin Client]
  | call CompatibilityGovernanceService.deprecate_api(DeprecateSdkApiCommand command, ActorContext actor, CommandMetadata meta)
  v
[Application Service]
  | call PublicSdkApiSurfacePort.resolve_api(SdkApiRef api_ref)
  | call PublicSdkApiSurfacePort.resolve_api(replacement_api_ref) when present
  | tx begin
  | call CompatibilityRepository.get_deprecated_api(SdkApiRef api_ref)
  | call IdGeneratorPort.next_removal_plan_ref() when target is PendingRemoval
  v
[DeprecatedApiRecord]
  | call DeprecatedApiRecord.announce(...) OR mark_deprecated(...) OR schedule_removal(...)
  v
[Repository + Outbox]
  | save deprecated record
  | append DeprecatedApiRecordedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [PublicSdkApiSurfacePort.resolve_api(SdkApiRef api_ref)]
// 校验被 deprecated 的 API 必须属于 SDK public surface,并取得当前 API 所属版本。
let api_entry = public_api_surface
    .resolve_api(command.api_ref)
    .await?
    .ok_or(SdkApplicationError::NotFound)?;
if !api_entry.is_public {
    return Err(SdkProtocolError::Validation);
}

// [PublicSdkApiSurfacePort.resolve_api(SdkApiRef replacement_api_ref)]
// replacement API 有值时也必须解析到 public surface。
if let Some(replacement_api_ref) = command.removal_plan.as_ref().and_then(|plan| plan.replacement_api_ref) {
    let replacement_entry = public_api_surface
        .resolve_api(replacement_api_ref)
        .await?
        .ok_or(SdkApplicationError::NotFound)?;
    if !replacement_entry.is_public {
        return Err(SdkProtocolError::Validation);
    }
}

// [CompatibilityRepository.get_deprecated_api(SdkApiRef api_ref)]
// 读取已有 deprecated API 记录。
let current = compat_repo.get_deprecated_api(command.api_ref).await?;

// [UnitOfWork.begin()]
// 开启 deprecated API 写事务。
let uow = unit_of_work.begin().await?;

let record = match command.target_lifecycle_state {
    DeprecatedApiLifecycleState::Deprecated => {
        // [DeprecatedApiRecord.mark_deprecated(MigrationGuideRef migration_ref, Timestamp now)]
        // 目标状态为 Deprecated 时推进状态。
        current.mark_deprecated(command.migration_ref, clock.now())?
    }
    DeprecatedApiLifecycleState::PendingRemoval => {
        // [IdGeneratorPort.next_removal_plan_ref()]
        // 目标状态为 PendingRemoval 时，先生成 removal plan ref。
        let removal_plan_ref = id_generator.next_removal_plan_ref();

        // [RemovalPlan::create(RemovalPlanRef removal_plan_ref, PackageCandidateVersion target_removal_version, PackageCandidateVersion current_api_version, Timestamp removal_not_before, Option<SdkApiRef> replacement_api_ref, DocumentRef document_ref)]
        // 由 command.removal_plan input 和 public API surface entry 构造 domain RemovalPlan。
        let plan_input = command.removal_plan.ok_or(SdkDomainError::RemovalPlanRequired)?;
        let removal_plan = RemovalPlan::create(
            removal_plan_ref,
            plan_input.target_removal_version,
            api_entry.api_version,
            plan_input.removal_not_before,
            plan_input.replacement_api_ref,
            plan_input.document_ref,
        )?;

        // [DeprecatedApiRecord.schedule_removal(RemovalPlan removal_plan, Timestamp now)]
        // 目标状态为 PendingRemoval 时推进状态。
        current.schedule_removal(removal_plan, clock.now())?
    }
    DeprecatedApiLifecycleState::Removed => {
        current.mark_removed(clock.now())?
    }
    _ => return Err(SdkDomainError::InvalidStateTransition),
};

// [CompatibilityRepository.save_deprecated_api(DeprecatedApiRecord record, ExpectedVersion expected_version, UnitOfWorkHandle uow)]
// 保存 deprecated API 记录。
compat_repo.save_deprecated_api(record, expected_version, uow.clone()).await?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 DeprecatedApiRecordedEvent。
outbox.append(event, uow.clone()).await?;

// [UnitOfWork.commit(UnitOfWorkHandle uow)]
// 提交 lifecycle 变化。
unit_of_work.commit(uow).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| public API surface 解析成功并读取当前 deprecated record 后 | record / outbox 保存后 | API ref missing、replacement not public、target removal version invalid、lifecycle illegal、migration missing、repository failure | deprecated record、outbox、幂等完成 |

##### 错误映射

| 场景 | 检测位置 | 错误 |
|---|---|---|
| API ref 不存在 | lookup | `NotFound` |
| replacement API ref 不存在或不是 public surface | public API surface lookup | `NotFound` / `Validation` |
| target removal version 不大于当前 API 所属版本 | `RemovalPlan::create(...)` | `Validation` |
| migration ref 缺失 | domain object | `Validation` |
| lifecycle 非法迁移 | domain object | `Conflict` |

##### 状态与事件副作用

- 推进 `DeprecatedApiLifecycleState`。
- 写入 `DeprecatedApiRecordedEvent`。

##### 测试切口

- deprecated without migration rejected。
- pending removal without removal plan rejected。
- API ref not in public SDK surface rejected。
- replacement API ref not in public SDK surface rejected。
- target removal version not greater than public surface entry version rejected。
- removed 后再次修改 rejected。

### 7.4 Inbound Event Consumer 处理流

#### 7.4.1 `ConsumeCoreContractChangedFlow`

##### 函数级调用图

```text
[Event Consumer]
  | call ContractConsumptionService.consume_core_contract_changed(CoreContractChangedEvent event, EventConsumeMetadata meta)
  v
[Application Service]
  | call SdkIdempotencyRepository.find(IdempotencyKey key)
  | tx begin
  | call VersionRefRepository.upsert_upstream_ref(UpstreamVersionRef ref)
  | call DerivedViewRepository.mark_stale_by_upstream(UpstreamVersionRef ref)
  | append SdkSnapshotFreshnessChangedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [SdkIdempotencyRepository.find(IdempotencyKey key)]
// 使用 event_id + source_ref + idempotency_key 形成消费幂等键并判断重复消费。
let consume_key = EventConsumeIdempotencyKey::from(meta.event_id, meta.source_ref, meta.idempotency_key)?;
let replay = idempotency.find(consume_key).await?;

// [UnitOfWork.begin()]
// 开启 event 消费事务。
let uow = unit_of_work.begin().await?;

// [VersionRefRepository.upsert_upstream_ref(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)]
// 保存 core snapshot 版本引用。
version_repo.upsert_upstream_ref(event.core_snapshot_ref.into(), uow.clone()).await?;

// [DerivedViewRepository.mark_stale_by_upstream(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)]
// 标记受影响派生视图 stale。
derived_repo.mark_stale_by_upstream(event.core_snapshot_ref.into(), uow.clone()).await?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 freshness changed event。
outbox.append(freshness_event, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| event 字段校验后 | version ref / stale mark / outbox 保存后 | ref 缺失、repository failure、outbox failure | version ref、stale mark、outbox、幂等完成 |

##### 错误映射

| 场景 | 错误 |
|---|---|
| core snapshot ref 缺失 | `Validation` |
| duplicate event | idempotent replay |
| repository unavailable | `Dependency` |

##### 状态与事件副作用

- affected `SnapshotFreshnessState` 标记 stale。
- 写入 `SdkSnapshotFreshnessChangedEvent`。

##### 测试切口

- duplicate event 不重复写 stale mark。
- missing snapshot ref rejected。
- outbox append failure 回滚 ref update。

#### 7.4.2 `ConsumeBusSemanticChangedFlow`

实施阶段: PH-03 / `commit-03-a`。该流读写 `BusEventClientView`,不得作为 PH-02 / `commit-02-b` 的实现内容。

##### 函数级调用图

```text
[Event Consumer]
  | call ContractConsumptionService.consume_bus_semantic_changed(BusSemanticChangedEvent event, EventConsumeMetadata meta)
  v
[Application Service]
  | call SdkIdempotencyRepository.find(IdempotencyKey key)
  | fetch BusSemanticSnapshot via BusSemanticSourcePort
  | tx begin
  | save bus upstream ref
  | derive EventSemanticMapping set
  | save event client view
  | append SdkClientViewFreshnessChangedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [SdkIdempotencyRepository.find(IdempotencyKey key)]
// 使用 event_id + source_ref + idempotency_key 形成消费幂等键并判断重复消费。
let consume_key = EventConsumeIdempotencyKey::from(meta.event_id, meta.source_ref, meta.idempotency_key)?;
let replay = idempotency.find(consume_key).await?;

// [BusSemanticSourcePort.fetch_snapshot(UpstreamVersionRef version_ref)]
// 事件只携带 bus 侧 ref / version;SDK 通过 source port 拉取语义 snapshot,不得要求 L0-bus 事件携带 SDK 专属字段。
let bus_snapshot = bus_source.fetch_snapshot(event.version_ref.clone()).await?;

// [BusSemanticSnapshot.assert_contains(TransportSemanticId transport_semantic_id, SnapshotDigest digest)]
// 校验 event 中的 semantic ref / digest 与 source snapshot 一致。
bus_snapshot.assert_contains(event.transport_semantic_id.clone(), event.digest.clone())?;

// [SemanticBaselineRepository.get_current()]
// 读取当前 SDK semantic baseline / concept map,用于把 bus semantic 派生为 SDK 事件映射。
let baseline = semantic_repo.get_current().await?;

// [UnitOfWork.begin()]
// 开启 event 消费事务;外部 source 读取不放入本地写事务。
let uow = unit_of_work.begin().await?;

// [VersionRefRepository.upsert_upstream_ref(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)]
// 保存 bus semantic 版本引用。
version_repo.upsert_upstream_ref(event.version_ref, uow.clone()).await?;

// [EventClientViewRepository.get_current()]
// 读取当前 event client view。
let event_view = event_view_repo.get_current().await?;

// [Application mapping extraction]
// application 层从 bus snapshot + concept map 提取 typed mapping input;不得把 source snapshot DTO 直接传入 domain factory。
let mapping_inputs: Vec<EventSemanticMappingInput> =
    ContractConsumptionService::extract_event_mapping_inputs(bus_snapshot, baseline.concept_map())?;

// [EventSemanticMapping::from_input(EventSemanticMappingInput input)]
// domain factory 根据 typed input 创建 mapping,并由 SDK event name + bus transport semantic id + operation 稳定生成 mapping_ref。
let mappings = mapping_inputs
    .into_iter()
    .map(EventSemanticMapping::from_input)
    .collect::<Result<Vec<_>, _>>()?;

// [BusEventClientView::from_bus_semantics(Vec<EventSemanticMapping> mappings, SnapshotFreshnessState freshness_state)]
// 保存刷新后的 event client view;若只能确认变化而无法拉取 snapshot,则保存 stale 视图并返回 retryable dependency。
let refreshed_view = event_view.refresh_mappings(mappings, event.version_ref.clone(), clock.now())?;

// [SdkClientViewFreshnessChangedEvent]
// 为 event client view 写入 freshness changed event;不得复用 DerivedViewId / affected_languages schema。
let freshness_event = SdkClientViewFreshnessChangedEvent {
    target_view: SdkClientViewFreshnessTarget::Event(refreshed_view.event_view_id.clone()),
    freshness_state: refreshed_view.freshness_state.clone(),
    upstream_refs: vec![event.version_ref.clone()],
    changed_at: clock.now(),
};

// [EventClientViewRepository.save(BusEventClientView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)]
// 保存 event client view。
event_view_repo.save(refreshed_view, expected_version, uow.clone()).await?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 client view freshness changed event。
outbox.append(freshness_event, uow.clone()).await?;

// [SdkIdempotencyRepository.complete(IdempotencyKey key, CommandReceiptRef receipt_ref)]
// 完成 event 消费幂等记录。
idempotency.complete(consume_key, event.event_id.clone().into(), uow.clone()).await?;

// [UnitOfWork.commit(UnitOfWorkHandle uow)]
// 提交 bus ref、event client view、outbox 和幂等完成记录。
unit_of_work.commit(uow).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| event 校验和 bus semantic snapshot 读取成功后 | bus ref / event view / outbox 保存后 | missing ref、snapshot dependency failure、view conflict、outbox failure | version ref、event mapping 派生、event view、outbox |

##### 错误映射

| 场景 | 错误 |
|---|---|
| bus semantic ref 缺失 | `Validation` |
| event view version conflict | `Conflict` |
| repository unavailable | `Dependency` |

##### 状态与事件副作用

- 正常路径刷新 `BusEventClientView.mapping_set` 并更新 freshness / upstream version。
- 正常路径写入 `SdkClientViewFreshnessChangedEvent`，目标为 `Event(EventViewId)`。
- snapshot 暂不可用时只允许保留或标记 stale 状态并返回 retryable dependency。
- 不修改 bus runtime truth。

##### 测试切口

- duplicate bus event 幂等。
- missing semantic ref rejected。
- event mapping 刷新后保存 event view。

#### 7.4.3 `ConsumeFormalApiChangedFlow`

实施阶段: PH-03 / `commit-03-a`。该流读写 `ServiceClientView`,不得作为 PH-02 / `commit-02-b` 的实现内容。

##### 函数级调用图

```text
[Event Consumer]
  | call ContractConsumptionService.consume_formal_api_changed(FormalApiChangedEvent event, EventConsumeMetadata meta)
  v
[Application Service]
  | tx begin
  | save formal API upstream ref
  | mark service client view stale
  | mark related compatibility affected
  | append SdkClientViewFreshnessChangedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [VersionRefRepository.upsert_upstream_ref(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)]
// 保存 formal API 版本引用。
version_repo.upsert_upstream_ref(event.version_ref, uow.clone()).await?;

// [ServiceClientViewRepository.get_current()]
// 读取当前 service client view。
let service_view = service_view_repo.get_current().await?;

// [ServiceClientView.mark_stale(FormalApiRef formal_api_ref, Timestamp now)]
// 标记受影响 service client view stale。
let stale_view = service_view.mark_stale(event.formal_api_ref, clock.now())?;

// [SdkClientViewFreshnessChangedEvent]
// 为 service client view 写入 freshness changed event;不得复用 DerivedViewId / affected_languages schema。
let freshness_event = SdkClientViewFreshnessChangedEvent {
    target_view: SdkClientViewFreshnessTarget::Service(stale_view.service_view_id.clone()),
    freshness_state: stale_view.freshness_state.clone(),
    upstream_refs: vec![event.version_ref.clone()],
    changed_at: clock.now(),
};

// [ServiceClientViewRepository.save(ServiceClientView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)]
// 保存 stale service view。
service_view_repo.save(stale_view, expected_version, uow.clone()).await?;

// [SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)]
// 写入 client view freshness changed event。
outbox.append(freshness_event, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| event 校验后 | formal ref / service view / outbox 保存后 | missing formal ref、view conflict、outbox failure | version ref、service view stale、outbox |

##### 错误映射

| 场景 | 错误 |
|---|---|
| formal API ref 缺失 | `Validation` |
| view conflict | `Conflict` |
| repository unavailable | `Dependency` |

##### 状态与事件副作用

- `ServiceClientView` freshness 变为 stale。
- 写入 `SdkClientViewFreshnessChangedEvent`，目标为 `Service(ServiceViewId)`。
- compatibility 后续由 job / command 重新判断。

##### 测试切口

- formal API ref 缺失被拒绝。
- 不依赖服务仓源码。
- service view stale event emitted。

#### 7.4.4 `ConsumeValidationRunFinishedFlow`

##### 函数级调用图

```text
[Event Consumer]
  | call CandidateValidationService.consume_validation_finished(ValidationRunFinishedEvent event, EventConsumeMetadata meta)
  v
[Application Service]
  | tx begin
  | call CandidateRepository.get_for_update(PackageCandidateId candidate_id, UnitOfWorkHandle uow)
  | call VerificationEvidence::from_validation_run(...)
  | call EvidenceRepository.insert(VerificationEvidence evidence, UnitOfWorkHandle uow)
  | update candidate validation status when allowed
  | append VerificationEvidenceRecordedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [CandidateRepository.get_for_update(PackageCandidateId candidate_id, UnitOfWorkHandle uow)]
// 锁定 candidate。
let candidate = candidate_repo.get_for_update(event.candidate_id, uow.clone()).await?;

// [VerificationEvidence::from_validation_run(ValidationRunFinishedEvent event, ActorContext actor, Timestamp now)]
// 将 runner event 转为 verification evidence。
let evidence = VerificationEvidence::from_validation_run(event, actor, clock.now())?;

// [VerificationEvidence.assert_redacted()]
// 确认证据不含 raw body / secret。
evidence.assert_redacted()?;

// [EvidenceRepository.insert(VerificationEvidence evidence, UnitOfWorkHandle uow)]
// 保存 evidence。
evidence_repo.insert(evidence, uow.clone()).await?;

// [PackageCandidate.apply_evidence(VerificationEvidence evidence, Timestamp now)]
// 如果满足条件，推进 candidate 验证状态。
candidate.apply_evidence(evidence, clock.now())?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| event 校验后 | evidence / candidate / projection / outbox 保存后 | candidate missing、evidence unredacted、repository failure | evidence、candidate update、projection、outbox |

##### 错误映射

| 场景 | 错误 |
|---|---|
| candidate 不存在 | `NotFound` |
| redaction status 不合格 | `BoundaryViolation` |
| duplicate run | idempotent replay |

##### 状态与事件副作用

- 记录 `VerificationEvidence`。
- candidate 可从 built / validating 推进到 verified，具体矩阵由 Step 10 定义。
- 写入 `VerificationEvidenceRecordedEvent`。

##### 测试切口

- unredacted evidence 不得推进 candidate。
- failed evidence 不能支撑 stable。
- duplicate validation run 不重复写 evidence。

### 7.5 Query 与 Outbound Event 通用处理流

#### 7.5.1 `QueryReadOnlyFlow`

##### 函数级调用图

```text
[Rust Client / CLI]
  | call QueryService.query(QueryRequest query, ActorContext actor, QueryMetadata meta)
  v
[QueryService]
  | validate query
  | call ProjectionPort.get(...) OR Repository.get(...)
  | attach consistency marker
  v
[View Result]
```

##### 入口差异表

| Query | 主要读取来源 | 返回 |
|---|---|---|
| `GetSdkCapabilitySummary` | `SdkCapabilityProjectionPort` | `SdkCapabilitySummaryView` |
| `GetUpstreamVersionRefs` | `VersionRefRepository` | `UpstreamVersionRefsView` |
| `GetSnapshotFreshness` | `DerivedViewRepository` / projection | `SnapshotFreshnessView` |
| `GetServiceClientView` | `ServiceClientViewRepository` | `ServiceClientView` |
| `GetEventClientView` | `EventClientViewRepository` | `BusEventClientView` |
| `ReadServiceCapability` | `ServiceClientAssemblyService` + boundary port | `ServiceCapabilityReadResult` |
| `OpenEventSubscription` | `EventClientAssemblyService` + bus boundary port | `EventSubscriptionView` |
| `GetPackageCandidateStatus` | `CandidateRepository` | `PackageCandidateStatusView` |
| `GetVerificationEvidence` | `EvidenceRepository` / `EvidenceProjectionPort` | `VerificationEvidenceView` |
| `GetCompatibilityDecision` | `CompatibilityRepository` / `CompatibilityProjectionPort` | `CompatibilityDecisionView` |
| `ListDeprecatedApis` | `CompatibilityProjectionPort` | `DeprecatedApiPage` |
| `GetMigrationGuideRef` | `CompatibilityRepository.get_deprecated_api(api_ref)`，再匹配 `DeprecatedApiRecord.migration_ref` 的版本范围 | `MigrationGuideRefView` |

##### 关键伪代码

```rust
// [QueryService.validate(QueryRequest query)]
// 校验 query 必填字段和分页参数。
query_service.validate(query)?;

// [ProjectionPort.get(QueryDto query)]
// 优先读取 projection / read model。
let view = projection.get(query).await?;

// [ConsistencyMarker::from_projection(ProjectionVersion version)]
// 返回 projection consistency marker,不自动重建。
let marker = ConsistencyMarker::from_projection(view.version);
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| 不开启写事务 | 不适用 | 不适用 | 不改写真相 |

##### 错误映射

| 场景 | 错误 |
|---|---|
| 必填 query 字段缺失 | `Validation` |
| 对象不存在 | `NotFound` |
| projection stale | 成功返回 stale consistency marker 或 `Dependency`，不自动修复 |

##### 状态与事件副作用

- 无状态变化。
- 不写 outbox。

##### 测试切口

- query 不调用 `UnitOfWork.begin()`。
- projection stale 不触发 rebuild。
- pagination 参数越界被拒绝或 cap。

#### 7.5.2 `OutboundEventPublishFlow`

##### 函数级调用图

```text
[SdkOutboxPublisher]
  | call SdkOutboxPort.load_pending(OutboxCursor cursor, PageLimit limit)
  v
[Event Serializer]
  | validate event schema
  | assert no raw body / secret
  v
[Bus Boundary / Publisher]
  | publish event topic + payload
  v
[SdkOutboxPort]
  | mark_published(event_id, published_ref)
```

##### Event 差异表

| Event | 来源对象 | Topic | 发布后动作 |
|---|---|---|---|
| `SdkSemanticBaselineChangedEvent` | `SdkSemanticBaseline` | `sdk.semantic_baseline.changed.v1` | mark published |
| `SdkSnapshotFreshnessChangedEvent` | `DerivedBindingView` / freshness | `sdk.snapshot_freshness.changed.v1` | mark published |
| `SdkClientViewFreshnessChangedEvent` | `ServiceClientView` / `BusEventClientView` / freshness | `sdk.client_view_freshness.changed.v1` | mark published |
| `PackageCandidateGeneratedEvent` | `PackageCandidate` | `sdk.package_candidate.generated.v1` | mark published |
| `VerificationEvidenceRecordedEvent` | `VerificationEvidence` | `sdk.verification_evidence.recorded.v1` | mark published |
| `CompatibilityDecisionRecordedEvent` | `CompatibilityDecision` | `sdk.compatibility_decision.recorded.v1` | mark published |
| `DeprecatedApiRecordedEvent` | `DeprecatedApiRecord` | `sdk.deprecated_api.recorded.v1` | mark published |

##### 关键伪代码

```rust
// [SdkOutboxPort.load_pending(OutboxCursor cursor, PageLimit limit)]
// 读取已提交但未发布的 SDK outbox event。
let page = outbox.load_pending(cursor, limit).await?;

// [SdkEventSerializer.serialize(SdkOutboxEvent event)]
// 将 outbox event 序列化为 topic payload。
let payload = serializer.serialize(event)?;

// [BoundaryGuard.assert_no_body_or_secret(EventPayload payload)]
// 确认 event 不包含 raw body / secret。
boundary_guard.assert_no_body_or_secret(payload.clone())?;

// [BusEventBoundaryPort.publish_event(PublishBusEventCommand command, ClientCallContext context)]
// 通过 bus boundary 发布 event。
let published = bus_boundary.publish_event(command, context).await?;

// [SdkOutboxPort.mark_published(SdkOutboxEventId event_id, PublishedEventRef published_ref, UnitOfWorkHandle uow)]
// 标记 outbox event 已发布。
outbox.mark_published(event_id, published.ref, uow).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| truth 已提交后 | mark published 小事务 | mark published failure | 只更新 outbox 发布状态 |

##### 错误映射

| 场景 | 错误 |
|---|---|
| event schema invalid | `Validation` |
| payload contains body / secret | `BoundaryViolation` |
| publisher unavailable | `Dependency`，保留 pending |

##### 状态与事件副作用

- 不改写 domain truth。
- 更新 outbox 发布状态。

##### 测试切口

- publisher failure 不回滚 domain truth。
- raw body event 被拒绝。
- duplicate publish 使用 outbox idempotency。

### 7.6 Operations Job 处理流

#### 7.6.1 `CheckUpstreamFreshnessFlow`

##### 函数级调用图

```text
[check_upstream_freshness binary]
  | call ContractConsumptionService.check_freshness(CheckUpstreamFreshnessJobInput input, JobMetadata meta)
  v
[Source Ports]
  | call latest_version()
  v
[Repository]
  | call VersionRefRepository.list_current()
  | compare current vs latest
  v
[Result]
  | return FreshnessCheckResult
```

##### 关键伪代码

```rust
// [CoreContractSourcePort.latest_version()]
// 读取 core 最新版本引用。
let latest_core = core_source.latest_version().await?;

// [VersionRefRepository.list_current()]
// 读取 SDK 当前记录的上游引用。
let current_refs = version_repo.list_current().await?;

// [SnapshotFreshnessState::compare(UpstreamVersionRef current, UpstreamVersionRef latest)]
// 比较当前版本与上游最新版本。
let result = SnapshotFreshnessState::compare(current_refs, latest_refs)?;
```

##### 事务边界

| 场景 | 事务 |
|---|---|
| `refresh_if_stale=false` | 不开启写事务 |
| `refresh_if_stale=true` | 调用 `RefreshDerivedBindingViewFlow`，使用该 flow 的事务 |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | source unavailable -> `Dependency` |
| 状态副作用 | 默认无；可选触发 refresh |
| 测试切口 | stale detected、source unavailable、refresh disabled 不写 repository |

#### 7.6.2 `GeneratePackageCandidateFlow`

##### 函数级调用图

```text
[generate_package_candidate binary]
  | call PackageCandidateService.generate_candidate(GeneratePackageCandidateJobInput input, JobMetadata meta)
  v
[Application Service]
  | read baseline / derived views / service view / event view
  | tx begin
  | call PackageCandidate::create_candidate(...)
  | save candidate
  | append PackageCandidateGeneratedEvent
  | tx commit
```

##### 关键伪代码

```rust
// [SemanticBaselineRepository.get_current()]
// 读取当前 semantic baseline。
let baseline = baseline_repo.get_current().await?;

// [DerivedViewRepository.get_binding_view(DerivedViewId view_id)]
// 读取派生视图并检查 freshness。
let view = derived_repo.get_binding_view(view_id).await?;

// [PackageCandidate::create_candidate(PackageCandidateSpec spec, SdkSemanticBaseline baseline, DerivedBindingView view, ActorContext actor)]
// 创建 Draft candidate。
let candidate = PackageCandidate::create_candidate(spec, baseline, view, actor)?;

// [CandidateRepository.insert(PackageCandidate candidate, UnitOfWorkHandle uow)]
// 保存 candidate。
candidate_repo.insert(candidate, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| baseline / view 校验成功后 | candidate / outbox 保存后 | freshness 非 fresh、candidate duplicate、outbox failure | candidate insert、outbox append、幂等完成 |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | stale view -> `Conflict`；baseline missing -> `NotFound` |
| 状态副作用 | `PackageCandidateStatus::Draft` |
| 测试切口 | stale view blocks candidate、duplicate candidate idempotent、outbox rollback |

#### 7.6.3 `BuildLanguagePackagesFlow`

##### 函数级调用图

```text
[build_language_packages binary]
  | call PackageCandidateService.build_language_packages(BuildLanguagePackagesJobInput input, JobMetadata meta)
  v
[Application Service]
  | tx begin
  | lock candidate
  | call LanguageBindingGeneratorPort.generate(...)
  | call PackageBuilderPort.build_candidate(...)
  | call PackageArtifactStorePort.put_artifact(...)
  | update candidate artifacts
  | tx commit
```

##### 关键伪代码

```rust
// [CandidateRepository.get_for_update(PackageCandidateId candidate_id, UnitOfWorkHandle uow)]
// 锁定 candidate。
let mut candidate = candidate_repo.get_for_update(input.candidate_id, uow.clone()).await?;

// [SemanticBaselineRepository.get_current()]
// 读取当前 concept map,用于校验语言视图语义仍对齐。
let baseline = baseline_repo.get_current().await?;
let concept_map = baseline.concept_map()?;

// [DerivedViewRepository.get_language_view(LanguageId language_id)]
// 按构建语言读取当前语言视图;artifact 必须追溯到该视图的 stable language_view_id。
let language_views = input
    .language_set
    .iter()
    .map(|language_id| derived_repo.get_language_view(language_id.clone()))
    .collect::<Result<Vec<_>, _>>()?
    .into_iter()
    .map(|view| view.ok_or(SdkApplicationError::NotFound)?)
    .collect::<Result<Vec<LanguageBindingView>, _>>()?;

for language_view in language_views {
    // [LanguageBindingView.assert_semantic_alignment(CrossLanguageConceptMap concept_map)]
    // 校验语言视图仍与当前共同概念映射对齐。
    language_view.assert_semantic_alignment(concept_map.clone())?;

    // [LanguageBindingGeneratorPort.generate(LanguageBindingGenerationInput input)]
    // 基于语言视图生成语言 binding;不得脱离 LanguageBindingView 独立生成。
    let generated = generator.generate(LanguageBindingGenerationInput {
        candidate_id: candidate.candidate_id.clone(),
        language_view: language_view.clone(),
        output_root_ref: input.output_root_ref.clone(),
    }).await?;

    // [PackageBuilderPort.build_candidate(PackageBuildInput input)]
    // 构建该语言的 package artifact。
    let built = package_builder.build_candidate(PackageBuildInput {
        candidate_id: candidate.candidate_id.clone(),
        language_id: language_view.language_id.clone(),
        language_view_id: language_view.language_view_id.clone(),
        generated_binding_ref: generated.generated_binding_ref,
        output_root_ref: input.output_root_ref.clone(),
    }).await?;

    // [PackageArtifactStorePort.put_artifact(PackageArtifactWrite artifact)]
    // 保存 artifact 并返回 artifact ref。
    let artifact_ref = artifact_store.put_artifact(built.artifact).await?;

    // [LanguageArtifact::record(LanguageId language_id, PackageArtifactRef artifact_ref, ContentDigest artifact_digest, LanguageBindingViewId language_view_id)]
    // artifact 的 language_view_id 必须来自参与构建的 LanguageBindingView,不得由 artifact digest 或 candidate version 派生。
    let language_artifact = LanguageArtifact::record(
        language_view.language_id.clone(),
        artifact_ref,
        built.artifact_digest,
        language_view.language_view_id.clone(),
    )?;

    // [PackageCandidate.attach_artifact(LanguageArtifact artifact, Timestamp now)]
    // 将 artifact 关联到 candidate。
    candidate.attach_artifact(language_artifact, clock.now())?;
}
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| candidate lock 后 | candidate save 后 | generator / builder / artifact digest failure | artifact metadata、candidate artifact refs |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | builder failure -> `Dependency`；digest mismatch -> `Validation` |
| 状态副作用 | candidate 可进入 built / artifacts attached，正式状态矩阵由 Step 10 定义 |
| 测试切口 | missing candidate、builder failure no candidate update、digest mismatch rejected |

#### 7.6.4 `RunCrossLanguageSmokeFlow`

##### 函数级调用图

```text
[run_cross_language_smoke binary]
  | call CandidateValidationService.run_smoke(RunCrossLanguageSmokeJobInput input, JobMetadata meta)
  v
[Application Service]
  | load candidate
  | call PackageArtifactStorePort.materialize_artifacts(...)
  | call SmokeRunnerPort.run_cross_language_smoke(...)
  | call VerificationEvidence::from_runner_result(...)
  | save evidence
  | update candidate when allowed
```

##### 关键伪代码

```rust
// [CandidateRepository.get(PackageCandidateId candidate_id)]
// 只读加载 candidate,用于确认三语言 artifact 输入。
let candidate = candidate_repo.get(input.candidate_id.clone()).await?.ok_or(SdkApplicationError::NotFound)?;

// [PackageArtifactStorePort.materialize_artifacts(PackageArtifactMaterializationInput input)]
// 将 candidate artifact 物化到本次 job run 的 runner 可读位置。
let materialized = artifact_store.materialize_artifacts(PackageArtifactMaterializationInput {
    candidate_id: input.candidate_id.clone(),
    language_set: candidate.required_language_set(),
    job_run_id: meta.job_run_id.clone(),
    purpose: ArtifactMaterializationPurpose::Smoke,
}).await?;

// [SmokeRunnerPort.run_cross_language_smoke(CrossLanguageSmokeInput input)]
// 运行三语言 smoke。
let smoke = smoke_runner.run_cross_language_smoke(CrossLanguageSmokeInput {
    candidate_id: input.candidate_id.clone(),
    target_profile: input.target_profile.clone(),
    suite_ref: input.suite_ref.clone(),
    materialized_artifacts: materialized.artifacts,
    materialization_ref: materialized.materialization_ref,
}).await?;

// [VerificationEvidence::from_runner_result(RunnerResult result, PackageCandidateId candidate_id, Timestamp now)]
// 生成 smoke evidence。
let evidence = VerificationEvidence::from_runner_result(smoke, input.candidate_id, clock.now())?;

// [VerificationEvidence.assert_redacted()]
// 检查 redaction status。
evidence.assert_redacted()?;

// [PackageCandidate.apply_evidence(VerificationEvidence evidence, Timestamp now)]
// 根据 evidence 推进 candidate。
candidate.apply_evidence(evidence, clock.now())?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| runner result 返回后 | evidence / candidate / projection / outbox 保存后 | unredacted、fake marker missing、repository failure | evidence、candidate update、projection、outbox |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | artifact missing / materialization failure -> `Dependency`；runner unavailable -> `Dependency`；unredacted -> `BoundaryViolation` |
| 状态副作用 | evidence recorded；candidate 可推进验证状态 |
| 测试切口 | missing artifact blocks smoke、fake marker present、failed smoke cannot verify、unredacted rejected |

#### 7.6.5 `ValidateDocsExamplesFlow`

##### 函数级调用图

```text
[validate_docs_examples binary]
  | call DocsExampleValidationService.validate_examples(ValidateDocsExamplesJobInput input, JobMetadata meta)
  v
[PackageArtifactStorePort]
  | materialize candidate artifacts for docs examples
  v
[DocsExampleRunnerPort]
  | run_examples(...)
  v
[Evidence + Projection]
  | create evidence
  | update docs example projection
```

##### 关键伪代码

```rust
// [CandidateRepository.get(PackageCandidateId candidate_id)]
// 只读加载 candidate,用于确认 docs runner 的目标 candidate 存在。
let candidate = candidate_repo.get(input.candidate_id.clone()).await?.ok_or(SdkApplicationError::NotFound)?;

// [PackageArtifactStorePort.materialize_artifacts(PackageArtifactMaterializationInput input)]
// 根据 candidate_id 和 language_set 物化 docs runner 可执行的本地 package artifact。
let materialized = artifact_store.materialize_artifacts(PackageArtifactMaterializationInput {
    candidate_id: candidate.candidate_id.clone(),
    language_set: input.language_set.clone(),
    job_run_id: meta.job_run_id.clone(),
    purpose: ArtifactMaterializationPurpose::DocsExamples,
}).await?;

// [DocsExampleRunnerPort.run_examples(DocsExampleRunInput input)]
// 运行文档示例验证。
let docs_result = docs_runner.run_examples(DocsExampleRunInput {
    candidate_id: input.candidate_id.clone(),
    docs_example_set_ref: input.docs_example_set_ref.clone(),
    language_set: input.language_set.clone(),
    materialized_artifacts: materialized.artifacts,
    materialization_ref: materialized.materialization_ref,
}).await?;

// [Vec<DocsExampleView>]
// 同步生成当前写路径 projection 行;这些行与 evidence artifact replay payload 同源。
let checked_at = clock.now();
let examples = docs_result.example_results.iter().map(|item| DocsExampleView {
    candidate_id: input.candidate_id.clone(),
    docs_example_set_ref: input.docs_example_set_ref.clone(),
    language_id: item.language_id.clone(),
    example_ref: item.example_ref.clone(),
    result: item.result,
    checked_at: checked_at.clone(),
}).collect::<Vec<_>>();

// [VerificationEvidence::from_docs_result(DocsExampleRunResult result, PackageCandidateId candidate_id, Timestamp now)]
// 生成 docs evidence。docs_result.artifact_ref 指向已脱敏 artifact,该 artifact 必须包含
// candidate_id、docs_example_set_ref、checked_at 和逐 example 结果,用于后续 projection rebuild。
let evidence = VerificationEvidence::from_docs_result(docs_result, input.candidate_id.clone(), checked_at)?;

// [DocsExampleProjectionPort.replace_examples(Vec<DocsExampleView> examples, UnitOfWorkHandle uow)]
// 更新 docs example projection。
docs_projection.replace_examples(examples, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| docs runner 返回后 | evidence / docs projection / outbox 保存后 | failed docs evidence save、projection failure | evidence、docs projection、outbox |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | artifact missing / materialization failure -> `Dependency`; docs runner unavailable -> `Dependency`; example failure -> evidence failed |
| 状态副作用 | docs evidence recorded |
| 测试切口 | missing candidate artifact blocks docs runner、failed example creates failed evidence、docs pass does not imply compatibility pass |

#### 7.6.6 `CheckCompatibilityFlow`

##### 函数级调用图

```text
[check_compatibility binary]
  | call CompatibilityGovernanceService.check_compatibility(CheckCompatibilityJobInput input, JobMetadata meta)
  v
[Application Service]
  | call CompatibilityRunnerPort.check_compatibility(...)
  | call IdGeneratorPort.next_compatibility_decision_id()
  v
[CompatibilityDecision]
  | record decision
  | save decision / projection / outbox
```

##### 关键伪代码

```rust
// [EvidenceRepository.list_by_candidate(PackageCandidateId candidate_id)]
// 读取 candidate evidence。
let evidence = evidence_repo.list_by_candidate(input.candidate_id).await?;

// [CompatibilityRunnerPort.check_compatibility(CompatibilityCheckInput input)]
// 执行兼容检查。
let result = compatibility_runner.check_compatibility(check_input).await?;

// [IdGeneratorPort.next_compatibility_decision_id()]
// 生成 compatibility decision ID。
let decision_id = id_generator.next_compatibility_decision_id();

// [CompatibilityDecision::from_runner_result(CompatibilityDecisionId decision_id, PackageCandidateId candidate_id, SdkBaselineVersion baseline_version, CompatibilityCheckResult result, Vec<VerificationEvidence> evidence, ActorContext actor)]
// 生成 compatibility decision。
let decision = CompatibilityDecision::from_runner_result(
    decision_id,
    input.candidate_id,
    input.baseline_version,
    result,
    evidence,
    actor,
)?;

// [CompatibilityRepository.save_decision(CompatibilityDecision decision, UnitOfWorkHandle uow)]
// 保存 decision。
compat_repo.save_decision(decision, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| runner result + evidence 校验后 | decision / projection / outbox 保存后 | missing evidence、runner failure、outbox failure | decision、projection、outbox |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | missing evidence -> `Validation`; breaking change -> decision state not compatible |
| 状态副作用 | `CompatibilityDecisionState` recorded |
| 测试切口 | breaking change produces breaking decision、missing evidence rejects compatible |

#### 7.6.7 `VerifyBoundaryPoliciesFlow`

##### 函数级调用图

```text
[verify_boundary_policies binary]
  | call CandidateValidationService.verify_boundary_policies(VerifyBoundaryPoliciesJobInput input, JobMetadata meta)
  v
[PackageArtifactStorePort]
  | materialize candidate artifacts for boundary verification
  v
[BoundaryPolicyVerifierPort]
  | verify(...)
  v
[VerificationEvidence]
  | record boundary evidence
```

##### 关键伪代码

```rust
// [CandidateRepository.get(PackageCandidateId candidate_id)]
// 只读加载 candidate,用于派生需要扫描的语言 artifact 集合。
let candidate = candidate_repo.get(input.candidate_id.clone()).await?.ok_or(SdkApplicationError::NotFound)?;

// [PackageArtifactStorePort.materialize_artifacts(PackageArtifactMaterializationInput input)]
// 物化 candidate artifact,供 verifier 扫描 package surface、fixture 和生成物边界。
let materialized = artifact_store.materialize_artifacts(PackageArtifactMaterializationInput {
    candidate_id: input.candidate_id.clone(),
    language_set: candidate.required_language_set(),
    job_run_id: meta.job_run_id.clone(),
    purpose: ArtifactMaterializationPurpose::BoundaryVerification,
}).await?;

// [BoundaryPolicyVerifierPort.verify(BoundaryPolicyVerificationInput input)]
// 验证 redaction / credential / fake boundary 底线。
let result = verifier.verify(BoundaryPolicyVerificationInput {
    candidate_id: input.candidate_id.clone(),
    policy_set_ref: input.policy_set_ref.clone(),
    fixture_ref: input.fixture_ref.clone(),
    materialized_artifacts: materialized.artifacts,
    materialization_ref: materialized.materialization_ref,
}).await?;

// [VerificationEvidence::from_boundary_policy_result(BoundaryPolicyVerificationResult result, PackageCandidateId candidate_id, Timestamp now)]
// 生成 boundary evidence。
let evidence = VerificationEvidence::from_boundary_policy_result(result, input.candidate_id, clock.now())?;

// [EvidenceRepository.insert(VerificationEvidence evidence, UnitOfWorkHandle uow)]
// 保存 boundary evidence。
evidence_repo.insert(evidence, uow.clone()).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| verifier 返回后 | evidence / projection / outbox 保存后 | violation、repository failure | evidence、projection、outbox |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | raw body / secret / fake success violation -> failed evidence |
| 状态副作用 | boundary evidence recorded |
| 测试切口 | plain secret fails、raw body fails、fake success fails |

#### 7.6.8 `RebuildSdkProjectionsFlow`

##### 函数级调用图

```text
[rebuild_sdk_projections binary]
  | call ProjectionRebuildService.rebuild(RebuildSdkProjectionsJobInput input, JobMetadata meta)
  v
[Truth Repositories]
  | read semantic / candidate / evidence / compatibility truth
  | read docs evidence artifact through EvidenceArtifactReplayPort
  v
[Projection Ports]
  | rebuild capability / evidence / compatibility / docs example projection
  v
[Job Summary]
```

##### 关键伪代码

```rust
// [SemanticBaselineRepository.get_current()]
// 读取 semantic truth。
let baseline = baseline_repo.get_current().await?;

// [EvidenceRepository.list_by_candidate(PackageCandidateId candidate_id)]
// 读取 evidence truth。
let evidence = evidence_repo.list_by_candidate(candidate_id).await?;

// [EvidenceArtifactReplayPort.replay_docs_examples(VerificationEvidence evidence)]
// 仅对 EvidenceKind::DocsExample 且 Redacted 的 committed evidence 读取 artifact_ref,
// 从 redacted docs evidence artifact 重放 DocsExampleView 明细。
let mut docs_examples = Vec::new();
for item in evidence.iter().filter(|item| item.evidence_kind == EvidenceKind::DocsExample) {
    let mut replayed = evidence_artifact_replay.replay_docs_examples(item.clone()).await?;
    docs_examples.append(&mut replayed);
}

// [UnitOfWork.begin()]
// 开启 projection batch replace 事务。
let uow = unit_of_work.begin().await?;

// [SdkCapabilityProjectionPort.rebuild_from_truth(CapabilityProjectionRebuildInput input, UnitOfWorkHandle uow)]
// 从 truth 重建 capability projection。
cap_projection.rebuild_from_truth(input, uow.clone()).await?;

// [DocsExampleProjectionPort.replace_examples(Vec<DocsExampleView> examples, UnitOfWorkHandle uow)]
// 从 committed docs evidence artifact 重建 docs example projection。
docs_projection.replace_examples(docs_examples, uow.clone()).await?;

// [UnitOfWork.commit(UnitOfWorkHandle uow)]
// 提交 projection batch。
unit_of_work.commit(uow).await?;
```

##### 事务边界

| 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|
| truth 读取后 | 每个 projection batch 保存后 | projection write failure | projection batch replace |

##### 错误映射 / 状态 / 测试

| 项 | 内容 |
|---|---|
| 错误 | projection write failure -> `Dependency`; invalid projection set -> `Validation` |
| 状态副作用 | projection marker 更新；truth 不变 |
| 测试切口 | dry run 不写 projection、projection failure 不改 truth、docs evidence artifact 缺失 / schema drift 时 rebuild failed |

### 7.7 Step 9 统一复核

#### 7.7.1 处理流覆盖复核

| 覆盖项 | 是否覆盖 | 说明 |
|---|---|---|
| 6 个 Command API | 是 | §7.3 |
| 4 个 Inbound Event Consumer | 是 | §7.4 |
| 12 个 Query API | 是 | §7.5.1 通用只读流 + 入口差异 |
| 7 个 Outbound Event | 是 | §7.5.2 通用发布流 + event 差异 |
| 8 个 Operations Job | 是 | §7.6 |
| 事务边界 | 是 | 每个写流均列 begin / commit / rollback 规则 |
| DTO 构造闭环 | 是 | 每个流回指 Step 8 DTO 和 Step 6 domain 对象 |
| Port 调用 | 是 | 关键伪代码均使用 Step 7 port 名称 |
| 测试切口 | 是 | 每个流至少列出最小切口 |

#### 7.7.2 状态副作用输入 Step 10

| 状态主语 | 被哪些处理流触发 | Step 10 需要收口 |
|---|---|---|
| `SnapshotFreshnessState` | `RefreshDerivedBindingViewFlow`、三个上游 consumer、`CheckUpstreamFreshnessFlow` | Fresh / Stale / Pending 等状态转换矩阵 |
| `CapabilitySupportState` | `RefreshDerivedBindingViewFlow`、`InvokeServiceCapabilityFlow` 的校验读取 | support 状态如何由 source / boundary 派生 |
| `PackageCandidateStatus` | `GeneratePackageCandidateFlow`、`BuildLanguagePackagesFlow`、validation jobs | Draft / built / verified / stable 口径 |
| `EvidenceResult` / `EvidenceRedactionStatus` | validation consumer、smoke/docs/boundary jobs | result 与 redaction 的独立状态矩阵 |
| `CompatibilityDecisionState` | `RecordCompatibilityDecisionFlow`、`CheckCompatibilityFlow` | compatible / migration / breaking 等状态 |
| `DeprecatedApiLifecycleState` | `DeprecateSdkApiFlow` | announced / deprecated / pending removal / removed |

#### 7.7.3 禁止漂移复核

| 禁止漂移项 | 本 Step 固定口径 |
|---|---|
| handler / job 直接写 repository | 禁止；必须经过 application service |
| DTO 直接指定终态 | 禁止；状态由 domain method 或 runner result 派生 |
| Query 自动修复 projection | 禁止；query 只返回 stale marker |
| runtime boundary 写 SDK truth | 禁止；`InvokeServiceCapability` 和 `PublishBusEvent` 不写本地 truth |
| event publish 回滚 truth | 禁止；outbox publish 在 truth 提交后执行 |
| job 整批大事务 | 禁止；每 item 或每 projection batch 独立事务 |
| raw body / secret 出现在流内保存或事件中 | 禁止；只能保存 ref、digest、diagnostic ref |

---

## 8. 回填草稿

正式 `projects/L0-sdk/03-详细设计.md` 回填时，§8 应按以下方式引用本文件：

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §8.1 处理流总表 | 本文件 §7.1 | 摘录处理流、入口函数、事务和状态变化 |
| §8.2 通用规则 | 本文件 §7.2 | 摘录本地写路径、runtime boundary、query、job batch 通用图 |
| §8.3 Command API 处理流 | 本文件 §7.3 | 按 6 个 command 分节回填 |
| §8.4 Inbound Event Consumer 处理流 | 本文件 §7.4 | 按 4 个 consumer 分节回填 |
| §8.5 Query / Outbound Event 通用流 | 本文件 §7.5 | 回填通用只读流和通用发布流 |
| §8.6 Operations Job 处理流 | 本文件 §7.6 | 按 8 个 job 分节回填 |
| §9 状态机与转换矩阵 | 本文件 §7.7.2 | 作为 Step 10 输入 |
| §15 测试切口 | 本文件各流测试切口 | 作为 Step 16 输入 |

回填规则：

- 正式文档不新增 Step 8 未定义的协议字段。
- 正式文档不新增 Step 7 未定义的 port。
- 如果 Step 10 状态矩阵发现本文件中状态名不一致，必须回到本 Step 修正处理流中的状态名。
- 如果 Step 11 事务一致性发现事务边界不成立，必须回到本 Step 修正对应处理流。

---

## 9. 待确认事项

| 待确认项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| Query API 是否逐个完整写处理流 | A. 每个 query 单独完整展开；B. 通用只读流 + 入口差异 | 推荐 B | Query 不改写真相，差异主要是读取来源，B 避免重复且可编码 |
| Outbound Event 是否逐个完整写处理流 | A. 每个 event 单独完整展开；B. 通用 outbox 发布流 + event 差异 | 推荐 B | 发布机制一致，差异是来源对象和 topic |
| Runtime boundary 是否写本地审计 truth | A. 写；B. 不写 truth，仅返回 ref / diagnostic | 推荐 B | SDK 不能拥有服务端业务 truth 或 bus runtime truth |
| Job 是否可直接调用 runner / repository | A. 可以；B. 只能经 application service 编排 | 推荐 B | 保持 evidence、状态、事务和 outbox 统一 |
| Projection rebuild 是否允许修正 truth | A. 允许；B. 禁止，只重建 read model | 推荐 B | projection 不能反写真相 |

当前推荐方案已写入本 Step。若后续需要改变任一结论，必须回到本文件和 Step 8 / Step 7 同步修正。

---

## 10. 进入下一步条件

进入 Step 10 的条件：

- 每个关键接口已经具备函数级调用图、关键伪代码、事务边界、错误映射、状态与事件副作用和测试切口。
- 每个关键调用均能回指 Step 6 对象、Step 7 port 或 Step 8 DTO。
- 写路径、runtime boundary、query、job batch 和 outbound event 的通用规则已固定。
- Step 10 所需的状态触发来源已经在 §7.7.2 汇总。

下一步：

```text
Step 10. 定义状态机与转换矩阵

重点问题:
1. Step 6 定义的每个状态 enum 的正式状态集合是什么?
2. Step 9 哪些处理流触发状态转换?
3. 每个 From -> To 的前置条件、副作用和非法转换错误是什么?
4. 状态名是否与 Step 6 enum variant、Step 8 协议和后续测试 / 验收口径一致?
```
