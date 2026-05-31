## Step 8. 关键处理流 / 重要函数数据流

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-sdk/02-概要设计.md` §8 关键处理流 / 重要函数数据流

### 2. 本步输入

- Step 7 已收敛的 API / 接口骨架：
  - `projects/L0-sdk/design-calibration/02_hld_step_07_api_interface_skeleton.md` §7.1 ~ §7.10
- Step 6 已收敛的关键对象轮廓：
  - `projects/L0-sdk/design-calibration/02_hld_step_06_key_objects.md` §7.1 ~ §7.24
- Step 5 已收敛的主要组成部分、职责与边界：
  - `projects/L0-sdk/design-calibration/02_hld_step_05_components_boundary.md` §7.1 ~ §7.13
- 架构设计已收稳的交互方式、依赖方向和横切边界：
  - `projects/L0-sdk/01-架构设计.md` §8 / §9 / §10 / §13

### 3. SOP 问题回答

1. 每个关键 Command 的写路径如何从入口进入 application service、domain object、repository / outbox？

   回答：SDK 本地 truth command 经过 entry / command adapter、application service、domain object / policy、repository、projection material 和 outbound event。runtime client command 经过 public client entry、assembly service、boundary guard、formal API / bus boundary adapter 和 result mapper；它不写 SDK truth,只记录必要的脱敏 evidence / diagnostic reference。

2. 每个关键 Query 如何从入口读取 projection 或只读视图？

   回答：SDK 本地 Query 走通用只读路径：query entry 接收 `ActorContext actor` 或 `QueryContext context`，query service 读取 projection / repository，应用 redaction / capability boundary，再返回 view。runtime read / subscription query 只通过 formal API read boundary 或 `L0-bus` subscription boundary 读取外部结果,不保存业务正文或事件 payload。

3. 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录？

   回答：上游变化 Consumer 统一先校验 event id、source ref、envelope ref 和 idempotency key，再转成 `UpstreamVersionRef` 与 `SnapshotFreshnessState` 变化。验证结果 Consumer 单独展开,因为它会生成 `VerificationEvidence` 并推进 `PackageCandidate` 状态。

4. 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账？

   回答：Job 从 repository / projection / artifact ref 读取已持久化事实,通过 application service 编排 runner / builder / generator port,输出 candidate、evidence、projection 或 compatibility decision。Job 不绕过 domain object / policy,也不等同公共 registry 发布。

5. 处理流中点名的关键函数调用，其参数分别是什么类型？

   回答：图中函数调用统一写成 `Object.method(TypeName param_name, TypeName param_name)` 或 `TypeName::factory(TypeName param_name)`。本步不写返回类型、泛型、生命周期、完整 Rust 签名或实现体。

6. 哪些处理步骤必须在概要设计点名，哪些完整函数调用链应留给详细设计？

   回答：必须点名 entry / consumer / job、application service、关键 domain object / policy、repository / port / projection / outbox 和最终 result / event / projection。完整 handler、trait 方法、错误码、事务隔离、runner 命令、artifact 文件、HTTP path、stream callback 和 retry 参数留给详细设计或测试方案。

7. 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流？

   回答：本步独立展开 `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi`、`ConsumeValidationRunFinished`、`GeneratePackageCandidate`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`。上游变化 Consumer 合并为一条独立流并列来源差异；Query、Outbound Event 和 projection rebuild 使用通用流说明。

8. 哪些 Query 可以只走通用读路径，哪些 Query 必须画独立处理流？

   回答：当前 Query API 均不改写 SDK truth,可走通用只读路径。`ReadServiceCapability` 和 `OpenEventSubscription` 虽然涉及 runtime read boundary,但当前只需在通用读路径中列出 formal API / bus subscription 分支；详细设计再展开 stream / callback / fallback。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 缺少从 Step 7 接口到 Step 6 对象的处理流 | 详细设计无法判断接口如何落到对象、策略和端口 |
| 旧处理流 | binding 生成、wrapper 调用和 release 验证混写 | 无法区分 SDK 本地 truth、runtime boundary 和验证 job |
| 旧 runtime 流 | 服务能力调用容易被写成 server facade | 可能让 SDK 拥有服务端业务 truth |
| 旧 event 流 | event client 容易被写成 bus runtime | 可能重写 `L0-bus` publication / delivery 语义 |
| 旧验证流 | candidate、smoke、docs example、compatibility 和 boundary verification 没有独立主线 | 实施计划难以形成可执行阶段和证据链 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖依据 | 按旧 SDK 主题选择代表性流程 | 按 Step 7 承接清单逐项覆盖或说明合并原因 | 防止关键接口遗漏 |
| 写路径 | 本地状态与外部 runtime 调用混合 | 区分 SDK 本地 truth command 与 runtime client command | 保护服务端和 bus truth |
| 上游变化 | 没有统一 freshness 消费流 | 用一条上游变化消费流承接 core / bus / formal API 变化 | 结构相近但影响对象不同 |
| 验证链 | package、smoke、docs、compatibility 混在 release 叙述里 | 拆成 candidate、smoke、docs、compatibility、boundary verification | 支撑 evidence 和状态机 |
| Query / event | 缺少未独立展开理由 | 用通用读路径和通用事实发布路径说明 | 避免遗漏与重复 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只画一条 SDK 总流程 | 篇幅短 | 无法支撑详细设计 1:1 还原 | 不采用 |
| 方案 B：为每个 Query、Event 和 Job 都画独立流程 | 覆盖最全 | Query 和 outbound event 大量重复,概要设计过重 | 不采用 |
| 方案 C：P0 command、改写本地状态的 consumer、关键验证 job 独立画;普通 query / outbound event 使用通用流 | 覆盖关键一致性路径,同时控制粒度 | 详细设计仍需补协议、错误码和事务细节 | 采用 |

### 7. 结构化中间产物

#### 7.1 处理流覆盖清单

| 接口 / Job / Consumer | 处理方式 | 原因 |
|---|---|---|
| `UpdateSdkSemanticBaseline` | 独立处理流 | 改写 SDK 共同语义、能力模型和概念映射 |
| `RefreshDerivedBindingView` | 独立处理流 | 上游快照到派生视图和 freshness 的主写路径 |
| `InvokeServiceCapability` | 独立处理流 | formal API / fake boundary、error / trace / redaction / credential 边界复杂 |
| `PublishBusEvent` | 独立处理流 | SDK event client 到 `L0-bus` 的语义边界 |
| `RecordCompatibilityDecision` | 独立处理流 | compatibility 会影响 stable / breaking / migration 口径 |
| `DeprecateSdkApi` | 独立处理流 | deprecated lifecycle 和 migration guide 需要正式链路 |
| `ConsumeCoreContractChanged` / `ConsumeBusSemanticChanged` / `ConsumeFormalApiChanged` | 合并为上游变化消费流 | 事件消费结构相近,但图后列影响对象差异 |
| `ConsumeValidationRunFinished` | 独立处理流 | 验证运行结果会生成 evidence 并推进 candidate |
| `GeneratePackageCandidate` | 独立处理流 | P0 candidate 生成主路径 |
| `BuildLanguagePackages` | 并入 candidate 生成流 | 是 candidate 生成内部阶段 |
| `RunCrossLanguageSmoke` | 独立处理流 | 证明三语言一致、错误、trace、redaction 和最小接入 |
| `ValidateDocsExamples` | 独立处理流 | 验证 quickstart / docstring / examples 与真实 client 行为一致 |
| `CheckCompatibility` | 独立处理流 | 生成 compatibility decision 和 migration / breaking 口径 |
| `VerifyBoundaryPolicies` | 独立处理流 | forbidden body、credential、fake success 是横切底线 |
| `RebuildSdkProjections` | 通用 projection rebuild 流 | 不改写真相,但影响只读一致性 |
| Query API | 通用只读流 | 均不改写 SDK truth |
| Outbound Event | 通用事实发布流 | 统一传播 SDK 已提交维护事实 |

#### 7.2 通用本地写路径骨架

```text
<SDK Local Command / Event Consumer / Job>
  |
  v
<Entry / Consumer / Job Trigger>
  - 接收 ActorContext actor / CommandMetadata meta / JobMetadata meta
  - 校验 EventId event_id 或 IdempotencyKey idempotency_key
  |
  v
<Application Service>
  - 编排 UnitOfWork uow
  - 调用 domain object / policy / runner port
  |
  v
<Domain Object / Policy>
  - 维护 SDK truth / state / invariant
  - 生成 projection material / evidence / outbound fact
  |
  v
<Repository / Projection / Outbox>
  - 保存 SDK truth / evidence / reference
  - 更新 projection 或写 outbound event
  |
  v
<Result / Event / Projection>
```

关键设计点：

- 本地写路径必须经过 application service 和 domain object / policy。
- repository、runner、adapter 不能绕过领域对象直接推进状态。
- `UnitOfWork` 只表达概要级写边界,具体事务隔离、锁和错误码留给详细设计。

#### 7.3 通用只读路径骨架

```text
<SDK Query / Runtime Read Query>
  |
  v
<CapabilityQueryEntry / ServiceClientEntry / EventClientEntry>
  - 接收 ActorContext actor 或 ClientCallContext context
  - 不执行认证或授权裁决
  |
  v
<Query Service>
  - 读取 projection / view / reference / evidence
  - 或调用 formal API read boundary / bus subscription boundary
  |
  v
<Policy / Guard>
  - 调用 BoundaryGuard.assert_capability_allowed(ClientCapabilityId capability_id)
  - 调用 RedactionPolicy.redact_message(ObservedMessage message)
  |
  v
<View / Result>
  - 返回只读 view / read result / subscription view
```

关键设计点：

- Query 不改写 SDK truth,也不触发 refresh、candidate 或 compatibility 状态推进。
- runtime read 只封装 formal API / bus subscription,不保存外部业务事实或事件 payload。
- projection not ready、fallback 和分页细节留给详细设计。

#### 7.4 `UpdateSdkSemanticBaseline` 处理流

```text
UpdateSdkSemanticBaseline
  |
  v
SdkClientEntry.update_sdk_semantic_baseline(UpdateSdkSemanticBaselineCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
SdkSemanticBaselineService.update_baseline(UpdateSdkSemanticBaselineCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
SdkSemanticBaseline.derive_next(SdkSemanticBaseline previous_baseline, BaselineChangeSet change_set)
  |
  v
ClientCapabilityModel.from_semantic_baseline(SdkSemanticBaseline baseline)
  |
  v
CrossLanguageConceptMap.from_baseline(SdkSemanticBaseline baseline)
  |
  v
BaselineRepository.save(SdkSemanticBaseline baseline, ExpectedVersion expected_version)
  |
  v
ProjectionRepository.update(SdkCapabilityProjection projection)
  |
  v
OutboxPublisherPort.publish(SdkSemanticBaselineChangedEvent event)
  |
  v
SdkSemanticBaselineResult
```

关键设计点：

- 语义基线更新是 SDK 本地 truth 写路径,必须携带 `ActorContext actor`、`CommandMetadata meta` 和幂等信息。
- 共同语义、能力模型和跨语言概念映射必须在同一处理边界内保持一致。
- 该流程只能引用上游版本和设计文档,不能复制 `L0-core`、`L0-bus` 或 formal API truth。
- 具体 optimistic locking、event payload schema 和错误码留给详细设计。

#### 7.5 `RefreshDerivedBindingView` 处理流

```text
RefreshDerivedBindingView
  |
  v
SdkClientEntry.refresh_derived_binding_view(RefreshDerivedBindingViewCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
ContractConsumptionService.refresh_views(RefreshDerivedBindingViewCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
CoreContractSourcePort.load_snapshot(UpstreamVersionRef upstream_ref)
  |
  v
BusSemanticSourcePort.load_snapshot(UpstreamVersionRef upstream_ref)
  |
  v
FormalApiBoundaryPort.load_snapshot(FormalApiRef formal_api_ref)
  |
  v
ApplicationExtraction.collect_refs_and_symbols(source snapshots)
  |
  v
DerivedBindingView.from_upstream_refs_and_symbols(Vec<UpstreamVersionRef> refs, Vec<CapabilitySymbol> symbols)
  |
  v
LanguageBindingView.derive_for_language(LanguageId language_id, DerivedBindingView derived_view)
  |
  v
SnapshotFreshnessState.mark_fresh(UpstreamVersionRef latest_ref)
  |
  v
VersionRefRepository.save(UpstreamVersionRefSet upstream_refs)
  |
  v
ProjectionRepository.update(DerivedBindingProjection projection)
  |
  v
DerivedBindingRefreshResult
```

关键设计点：

- 派生视图只能消费上游 snapshot 和 formal API 引用,不能制造第二套契约 truth。
- `SnapshotFreshnessState` 必须随派生视图一起更新,避免 stale 视图被 candidate 使用。
- 单语言视图由 `LanguageBindingView.derive_for_language(LanguageId language_id, DerivedBindingView derived_view)` 派生,不能单独改写平台语义。
- snapshot 加载细节、schema diff 和生成器参数留给详细设计。

#### 7.6 `RecordCompatibilityDecision` 处理流

```text
RecordCompatibilityDecision
  |
  v
CapabilityQueryEntry.record_compatibility_decision(RecordCompatibilityDecisionCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
CompatibilityGovernanceService.record_decision(RecordCompatibilityDecisionCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
CandidateRepository.get(PackageCandidateRef candidate_ref)
  |
  v
EvidenceRepository.list(VerificationEvidenceRefSet evidence_refs)
  |
  v
CompatibilityDecision.from_candidate(PackageCandidate candidate, SdkSemanticBaseline baseline)
  |
  v
CompatibilityDecision.attach_evidence(VerificationEvidence evidence)
  |
  v
CompatibilityDecision.attach_migration_guide(MigrationGuideRef migration_ref)
  |
  v
CompatibilityRepository.save(CompatibilityDecision decision)
  |
  v
OutboxPublisherPort.publish(CompatibilityDecisionRecordedEvent event)
  |
  v
CompatibilityDecisionResult
```

关键设计点：

- 兼容判断必须引用 candidate、语义基线、上游版本和 evidence,不能只靠人工口头结论。
- breaking change、requires migration 和 pending evidence 会影响 Step 9 状态机。
- 迁移说明只保存 `MigrationGuideRef`,不复制完整迁移正文。
- 兼容策略细节、证据充分性规则和 ADR 关联留给详细设计。

#### 7.7 `DeprecateSdkApi` 处理流

```text
DeprecateSdkApi
  |
  v
CapabilityQueryEntry.deprecate_sdk_api(DeprecateSdkApiCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
CompatibilityGovernanceService.deprecate_api(DeprecateSdkApiCommand command, ActorContext actor, CommandMetadata meta)
  |
  v
MigrationGuideRef.from_document(DesignDocumentRef document_ref)
  |
  v
DeprecatedApiRecord.create_record(SdkApiRef api_ref, MigrationGuideRef migration_ref)
  |
  v
DeprecatedApiRecord.mark_deprecated(SemanticVersion deprecated_since)
  |
  v
DeprecatedApiRepository.save(DeprecatedApiRecord deprecated_record)
  |
  v
OutboxPublisherPort.publish(DeprecatedApiRecordedEvent event)
  |
  v
DeprecatedApiResult
```

关键设计点：

- deprecated 记录必须绑定迁移说明引用,不能只在文档中口头提示。
- 平台级 deprecated 必须跨语言可见,不能只标记某个语言 package。
- API 移除计划和 replacement 关系会进入 Step 9 状态机,但完整 removal policy 留给详细设计。

#### 7.8 `InvokeServiceCapability` 处理流

```text
InvokeServiceCapability
  |
  v
ServiceClientEntry.invoke(ServiceCapabilityCall command, ClientCallContext context, CommandMetadata meta)
  |
  v
ServiceClientAssemblyService.resolve_call(ServiceCapabilityCall command, ClientCallContext context)
  |
  v
ServiceClientView.resolve_capability(ServiceCapabilityRef capability_ref)
  |
  v
BoundaryGuard.assert_capability_allowed(ClientCapabilityId capability_id)
  |
  v
CredentialProtectionPolicy.protect(CredentialMaterial credential_material)
  |
  v
TracePropagationPolicy.inject_trace(TraceContext trace_context, ClientRequestEnvelope request_envelope)
  |
  v
FormalApiBoundaryPort.invoke(ServiceCapabilityCall command, ClientCallContext context)
  |
  v
ErrorMappingPolicy.map_source_error(SourceErrorDescriptor source_error)
  |
  v
RedactionPolicy.redact_message(ObservedMessage message)
  |
  v
ServiceCapabilityCallResult
```

关键设计点：

- 该流程是 runtime client command,不写 SDK 本地 truth,也不拥有服务端业务事实。
- formal API / fake boundary 是唯一服务能力访问边界,不能源码依赖服务仓实现。
- credential、trace、error mapping 和 redaction 必须在调用边界前后生效。
- 完整请求 / 响应 schema、transport adapter、重试和错误码留给详细设计。

#### 7.9 `PublishBusEvent` 处理流

```text
PublishBusEvent
  |
  v
EventClientEntry.publish(PublishBusEventCommand command, ClientCallContext context, CommandMetadata meta)
  |
  v
EventClientAssemblyService.resolve_publish(PublishBusEventCommand command, ClientCallContext context)
  |
  v
BusEventClientView.resolve_event_mapping(TransportSemanticId transport_semantic_id)
  |
  v
EventSemanticMapping.assert_transport_semantic(TransportSemanticId transport_semantic_id)
  |
  v
BoundaryGuard.assert_body_allowed(BodyDescriptor body_descriptor)
  |
  v
TracePropagationPolicy.inject_trace(TraceContext trace_context, ClientRequestEnvelope request_envelope)
  |
  v
RedactionPolicy.reject_forbidden_body(BodyDescriptor body_descriptor)
  |
  v
BusSemanticBoundaryPort.publish(PublishBusEventCommand command, ClientCallContext context)
  |
  v
BusEventPublishResult
```

关键设计点：

- SDK 只提供基于 `L0-bus` 语义的 event client view,不实现 bus runtime。
- publication、delivery、feedback、retry、DLQ 和 replay truth 仍归 `L0-bus`。
- 事件 payload 正文不能进入 SDK truth、evidence 或日志正文。
- topic、CloudEvent schema、stream callback 和 bus adapter 细节留给详细设计。

#### 7.10 上游变化消费处理流

```text
ConsumeCoreContractChanged / ConsumeBusSemanticChanged / ConsumeFormalApiChanged
  |
  v
UpstreamChangeConsumer.consume(UpstreamChangedEvent event, EventId event_id, EventSourceRef source_ref, IdempotencyKey idempotency_key)
  |
  v
ContractConsumptionService.record_upstream_change(UpstreamChangedEvent event, EventSourceRef source_ref)
  |
  v
UpstreamVersionRef.from_design_document(DesignDocumentRef document_ref)
  |
  v
SnapshotFreshnessState.from_refs(UpstreamVersionRef observed_ref, UpstreamVersionRef latest_known_ref)
  |
  v
SnapshotFreshnessState.mark_pending(UpstreamVersionRef latest_ref, FreshnessReason reason)
  |
  v
VersionRefRepository.save(UpstreamVersionRef upstream_ref)
  |
  v
ProjectionRepository.update(SnapshotFreshnessProjection projection)
  |
  v
OutboxPublisherPort.publish(SdkSnapshotFreshnessChangedEvent event / SdkClientViewFreshnessChangedEvent event)
  |
  v
UpstreamChangeResult
```

关键设计点：

- 三类上游变化事件共享消费骨架,差异在影响对象：core 影响 `DerivedBindingView`,bus 影响 `BusEventClientView`,formal API 影响 `ServiceClientView`。
- core changed 使用 `SdkSnapshotFreshnessChangedEvent`;bus / formal API changed 使用 `SdkClientViewFreshnessChangedEvent`,不得把 `ServiceViewId` / `EventViewId` 塞进 `DerivedViewId`。
- 该流程只记录版本引用和 freshness 影响,不复制上游契约正文。
- freshness 进入 pending / stale 后会阻止 candidate 被标记 verified 或 stable。
- event envelope 字段全集、幂等存储结构和上游 diff 细节留给详细设计。

#### 7.11 `ConsumeValidationRunFinished` 处理流

```text
ConsumeValidationRunFinished
  |
  v
ValidationRunConsumer.consume(ValidationRunFinishedEvent event, EventId event_id, EventSourceRef source_ref, ValidationRunRef run_ref)
  |
  v
CandidateValidationService.record_validation_result(ValidationRunFinishedEvent event, ValidationRunRef run_ref)
  |
  v
VerificationEvidence.from_validation_run(ValidationRun run)
  |
  v
RedactionPolicy.mark_evidence_redacted(VerificationEvidence evidence)
  |
  v
VerificationEvidence.assert_redacted(RedactionPolicy redaction_policy)
  |
  v
PackageCandidate.attach_evidence(VerificationEvidence evidence)
  |
  v
CandidateRepository.save(PackageCandidate candidate, ExpectedVersion expected_version)
  |
  v
EvidenceRepository.append(VerificationEvidence evidence)
  |
  v
OutboxPublisherPort.publish(VerificationEvidenceRecordedEvent event)
  |
  v
VerificationEvidenceRecordResult
```

关键设计点：

- 验证运行结果必须转成脱敏后的 `VerificationEvidence`,不能保存测试日志正文、请求响应正文或 secret。
- evidence 是否能推进 candidate,由 evidence result 和 candidate 状态机在 Step 9 收稳。
- 重复 validation run event 必须幂等处理,不能重复推进 candidate。
- runner 输出格式、artifact 文件路径和 evidence schema 留给测试方案和详细设计。

#### 7.12 `GeneratePackageCandidate` 处理流

```text
GeneratePackageCandidate
  |
  v
GenerateCandidateTrigger.run(GenerateCandidateJobRequest request, ActorContext actor, JobMetadata meta)
  |
  v
PackageCandidateService.generate_candidate(GenerateCandidateJobRequest request, ActorContext actor, JobMetadata meta)
  |
  v
BaselineRepository.get(SdkBaselineId baseline_id)
  |
  v
DerivedBindingRepository.get(DerivedBindingViewId view_id)
  |
  v
SnapshotFreshnessState.is_usable_for_candidate()
  |
  v
LanguageBindingGeneratorPort.generate(LanguageBindingView language_view, SdkSemanticBaseline baseline)
  |
  v
PackageBuilderPort.build(LanguagePackageArtifactSet artifact_set, PackageBuildProfile build_profile)
  |
  v
PackageCandidate.from_language_artifacts(LanguagePackageArtifactSet artifact_set, UpstreamVersionRefSet upstream_refs)
  |
  v
CandidateRepository.insert(PackageCandidate candidate)
  |
  v
OutboxPublisherPort.publish(PackageCandidateGeneratedEvent event)
  |
  v
PackageCandidateJobResult
```

关键设计点：

- candidate 生成必须检查 freshness,stale / unsupported / unknown 视图不得生成 verified candidate。
- `BuildLanguagePackages` 是本流程中的 package build 阶段,不单独改写语义基线。
- candidate 是本地 package candidate,不等同公共 registry 发布。
- 语言目录、package manager、artifact layout 和构建命令留给详细设计和实施计划。

#### 7.13 `RunCrossLanguageSmoke` 处理流

```text
RunCrossLanguageSmoke
  |
  v
RunSmokeTrigger.run(CrossLanguageSmokeJobRequest request, ActorContext actor, JobMetadata meta)
  |
  v
CandidateValidationService.run_smoke(CrossLanguageSmokeJobRequest request, ActorContext actor, JobMetadata meta)
  |
  v
CandidateRepository.get(PackageCandidateRef candidate_ref)
  |
  v
SmokeRunnerPort.run(PackageCandidate candidate, SmokeTargetRef target_ref)
  |
  v
VerificationEvidence.from_validation_run(ValidationRun run)
  |
  v
BoundaryGuard.assert_not_fake_success(VerificationEvidence evidence)
  |
  v
RedactionPolicy.mark_evidence_redacted(VerificationEvidence evidence)
  |
  v
VerificationEvidence.is_passing()
  |
  v
PackageCandidate.attach_evidence(VerificationEvidence evidence)
  |
  v
EvidenceRepository.append(VerificationEvidence evidence)
  |
  v
CrossLanguageSmokeResult
```

关键设计点：

- smoke 必须覆盖三语言共同语义、错误映射、trace、redaction 和最小服务 / 事件接入边界。
- fake / fixture 结果必须在 evidence 中显式可见,不能伪装生产成功。
- smoke evidence 可支撑 candidate verified,但 stable 仍需 compatibility 和文档示例共同满足。
- smoke case、runner 命令、真实 / fake target 选择和报告格式留给测试方案。

#### 7.14 `ValidateDocsExamples` 处理流

```text
ValidateDocsExamples
  |
  v
ValidateDocsTrigger.run(DocsExampleValidationRequest request, ActorContext actor, JobMetadata meta)
  |
  v
DocsExampleValidationService.validate_examples(DocsExampleValidationRequest request, ActorContext actor, JobMetadata meta)
  |
  v
CandidateRepository.get(PackageCandidateRef candidate_ref)
  |
  v
DocsExampleRunnerPort.run(DocsExampleRef example_ref, PackageCandidate candidate)
  |
  v
VerificationEvidence.from_docs_example_run(DocsExampleRun run)
  |
  v
RedactionPolicy.mark_evidence_redacted(VerificationEvidence evidence)
  |
  v
VerificationEvidence.is_passing()
  |
  v
EvidenceRepository.append(VerificationEvidence evidence)
  |
  v
ProjectionRepository.update(DocsExampleProjection projection)
  |
  v
DocsExampleValidationResult
```

关键设计点：

- quickstart、docstring 和 examples 必须与 candidate 中真实 client 行为一致。
- docs example 可以使用 fake / fixture,但 fake 来源必须进入 evidence。
- 示例输出不得保存生产请求、响应、事件 payload 或凭据正文。
- 示例命令、文档路径、assert 细节和报告格式留给测试方案与实施计划。

#### 7.15 `CheckCompatibility` 处理流

```text
CheckCompatibility
  |
  v
CompatibilityCheckTrigger.run(CompatibilityCheckRequest request, ActorContext actor, JobMetadata meta)
  |
  v
CompatibilityGovernanceService.check_compatibility(CompatibilityCheckRequest request, ActorContext actor, JobMetadata meta)
  |
  v
CandidateRepository.get(PackageCandidateRef candidate_ref)
  |
  v
BaselineRepository.get(SdkBaselineId baseline_id)
  |
  v
EvidenceRepository.list(VerificationEvidenceRefSet evidence_refs)
  |
  v
CompatibilityDecision.from_candidate(PackageCandidate candidate, SdkSemanticBaseline baseline)
  |
  v
CompatibilityDecision.attach_evidence(VerificationEvidence evidence)
  |
  v
MigrationGuideRef.from_document(DesignDocumentRef document_ref)
  |
  v
CompatibilityDecision.attach_migration_guide(MigrationGuideRef migration_ref)
  |
  v
CompatibilityRepository.save(CompatibilityDecision decision)
  |
  v
CompatibilityCheckResult
```

关键设计点：

- compatibility 不能只检查单语言 package,必须回到共同语义、上游版本和 evidence。
- `PendingEvidence`、`RequiresMigration`、`Breaking` 等状态会影响 candidate 是否可 stable。
- migration guide 只以引用方式进入对象,不复制正文。
- breaking 判断规则、semver 细则和 ADR 触发条件留给详细设计。

#### 7.16 `VerifyBoundaryPolicies` 处理流

```text
VerifyBoundaryPolicies
  |
  v
BoundaryPolicyVerificationJob.run(BoundaryPolicyVerificationRequest request, ActorContext actor, JobMetadata meta)
  |
  v
CandidateValidationService.verify_boundaries(BoundaryPolicyVerificationRequest request, ActorContext actor, JobMetadata meta)
  |
  v
BoundaryGuard.from_default_policies(ClientCapabilityModel capability_model, RedactionPolicy redaction_policy, CredentialProtectionPolicy credential_policy)
  |
  v
BoundaryGuard.assert_body_allowed(BodyDescriptor body_descriptor)
  |
  v
CredentialProtectionPolicy.reject_plain_secret(CredentialMaterial credential_material)
  |
  v
RedactionPolicy.assert_no_forbidden_body(ObservedMessage message)
  |
  v
BoundaryGuard.assert_not_fake_success(VerificationEvidence evidence)
  |
  v
VerificationEvidence.from_validation_run(ValidationRun run)
  |
  v
EvidenceRepository.append(VerificationEvidence evidence)
  |
  v
BoundaryPolicyVerificationResult
```

关键设计点：

- forbidden body、plain secret、redaction 和 fake success 是 SDK 底线,配置不能绕过。
- 本流程验证的是 SDK 边界策略,不执行身份认证、授权或治理审批。
- 违规必须形成 failed / not verified evidence,不能被吞掉或伪装为通过。
- 具体敏感字段规则、测试 fixture 和泄漏检测脚本留给测试方案和详细设计。

#### 7.17 `RebuildSdkProjections` 处理流

```text
RebuildSdkProjections
  |
  v
ProjectionRebuildJob.run(ProjectionRebuildRequest request, ActorContext actor, JobMetadata meta)
  |
  v
ProjectionRebuildService.rebuild(ProjectionRebuildRequest request, ActorContext actor, JobMetadata meta)
  |
  v
BaselineRepository.scan(SdkTruthCursor cursor)
  |
  v
CandidateRepository.scan(SdkTruthCursor cursor)
  |
  v
EvidenceRepository.scan(SdkTruthCursor cursor)
  |
  v
ProjectionBuilder.apply(SdkTruthSnapshot snapshot)
  |
  v
ProjectionRepository.replace(ProjectionSnapshot projection_snapshot)
  |
  v
ProjectionRebuildResult
```

关键设计点：

- projection rebuild 只重建只读视图,不改写 `SdkSemanticBaseline`、`PackageCandidate`、`VerificationEvidence` 或 `CompatibilityDecision`。
- rebuild 必须基于已提交 truth snapshot,不能用外部未确认输入补造 projection。
- rebuild checkpoint、并发读取和一致性 marker 留给详细设计。

#### 7.18 通用 Outbound Event 发布流

```text
<Committed SDK Fact>
  |
  v
OutboxPublisherPort.publish(SdkOutboundEvent event)
  |
  v
RedactionPolicy.redact_message(ObservedMessage message)
  |
  v
OutboxRepository.append(SdkOutboundEvent event)
  |
  v
Automation / Reports / Downstream Notification
```

关键设计点：

- Outbound Event 只传播 SDK 已提交维护事实,不传播外部服务业务事实。
- event 只能携带 id、version ref、state、evidence ref、migration ref 等骨架信息。
- event payload schema、topic 命名、relay 机制和重试策略留给详细设计。

#### 7.19 未独立展开处理流的取舍说明

| 接口 / Job / Event | 未独立展开原因 | 后续承接 |
|---|---|---|
| `GetSdkCapabilitySummary` 等本地 Query | 均走通用只读路径,不改写真相 | 详细设计补 query service、projection、分页和 consistency marker |
| `ReadServiceCapability` | runtime read 与 `InvokeServiceCapability` 边界相同,但不写外部 truth | 详细设计补 formal API read adapter |
| `OpenEventSubscription` | 当前按只读 event view 处理,不实现 bus runtime | 详细设计补 stream / callback / subscription adapter |
| `BuildLanguagePackages` | 是 `GeneratePackageCandidate` 的内部 build 阶段 | 详细设计补 package builder port 和 artifact contract |
| `ConsumeCoreContractChanged` / `ConsumeBusSemanticChanged` / `ConsumeFormalApiChanged` | 已合并为上游变化消费流 | 详细设计分别补 event envelope 和影响对象差异 |
| Outbound Event 单项 | 统一通过通用事实发布流 | 详细设计补 event schema 和 publisher adapter |

### 8. 回填草稿

正式 `02-概要设计.md` §8 “关键处理流 / 重要函数数据流”直接摘录并润色本文件：

- §7.1 “处理流覆盖清单”
- §7.2 “通用本地写路径骨架”
- §7.3 “通用只读路径骨架”
- §7.4 ~ §7.18 各关键处理流
- §7.19 “未独立展开处理流的取舍说明”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 上游变化 Consumer 是否拆成三条正式流程 | A：拆开;B：保留合并流并在详细设计列来源差异 | 建议 B | 概要层处理骨架相同,合并更清楚;详细设计再拆 event schema |
| `ReadServiceCapability` 是否独立画图 | A：独立;B：沿用通用只读路径 | 建议 B | 当前没有本地状态推进,与 runtime command 的关键差异可在详细设计展开 |
| `OpenEventSubscription` 是否独立画图 | A：独立;B：沿用通用只读路径 | 建议 B | 当前不实现 bus runtime,概要层只需守住只读订阅边界 |
| projection rebuild 是否进入 Step 9 状态机 | A：进入;B：不作为正式状态机,只作为 job result | 建议 B | rebuild 不改变核心 truth 状态,Step 9 可只说明 projection propagation |

以上待确认项不阻塞进入 Step 9。除非后续讨论明确改变,后续 Step 按“建议方案”继续展开。

### 10. 进入下一步条件

- 已按 Step 7 承接清单覆盖关键 command、consumer、job、query 和 outbound event。
- 已区分 SDK 本地 truth 写路径、runtime client boundary、上游变化消费、验证 job 和只读 query。
- 每个独立处理流均使用 `text` ASCII 图,并在图后补关键设计点。
- 图中函数调用参数均写明类型名和参数名。
- 未独立展开的接口均说明原因和后续承接位置。
- 未写完整 Rust 签名、完整伪代码、HTTP path、topic、协议 schema、错误码全集、SQL、retry 参数或 runner 命令。
