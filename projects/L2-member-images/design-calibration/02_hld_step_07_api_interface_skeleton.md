# L2-member-images 02 概要 Step 7: API / 接口骨架

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 7 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 8 文件；不定义 HTTP / RPC 路径、完整 payload、topic、错误码或 exact pending schema

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 5 主要组成部分与接缝、Step 6 正式对象、正式 01 交互 / dependency / event 边界 |
| 规范 | 已读取概要设计 SOP Step 7 与书写规范 §4.7 |
| 本步目标 | 按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分类，固定接口主语、对象承接、读写性质和 pending 失败语义 |
| 本步禁止 | 完整协议、route / topic、JSON / proto schema、外部鉴权实现、未闭口 positive contract、内部 helper 冒充 API |

## 1. 接口分类说明

```text
Command API
  改写本仓正式 truth；输入需携带 command metadata / 幂等语境，按接口判断 ActorContext。

Query API
  读取 ImageDerivedReadModel 或正式只读 view；不得改写真相，明确 freshness / gap。

Inbound Event Consumer
  当前只保留 conditional verified build-request 入口；先验证 authority、event identity 和 envelope，arrival 不等于 intent。

Outbound Event
  当前没有已授权的镜像域 outbound build / publish event；不可把 availability transition 写成 event output。

Operations Job
  基于已持久化 truth 做 nightly intent、ref refresh、projection rebuild、handoff reconciliation 或 pending reevaluation；不替代同步合法性判断。
```

Command 输入的共同骨架是 `CommandMetadata metadata`、必要时 `ActorContext actor`、稳定 `IdempotencyKey idempotency_key` 与相关对象 ref；Query 默认需要 `ActorContext actor` 以限定安全读范围，但不做鉴权实现；Event 输入需要 `EventEnvelope envelope`、event id / source identity / correlation / idempotency information；Job 输入需要 `JobContext context` 和已持久化对象范围。

## 2. 按主要组成部分组织的接口骨架总表

| 主要组成部分 | Command | Query | Inbound Event | Operations Job | 当前 boundary |
|---|---|---|---|---|---|
| `DefinitionAssembly` | `DefineImageVariant`、`CaptureAssemblyBaseline`、`ProposeVariantRevision` | `GetImageVariantDefinition`、`GetAssemblyDerivation` | 无直接 active event | `RefreshDefinitionReferences` | MI-UP-003 / 006 未闭口时 source gap 保持 blocked |
| `BuildCandidate` | `RequestBuildIntent`、`RecordBuildOutcome` | `GetBuildTrace` | `ConsumeVerifiedBuildRequest`（conditional） | `RunNightlyBuildSweep`、`ReconcileBuildAttempts` | MI-UP-005 未闭口时 event lane unavailable |
| `Qualification` | `EvaluateCandidateEligibility`、`RecordArtifactHandoff` | `GetProvenanceAndEligibility` | 无 active event | `ReevaluatePendingQualifications` | Q-MI-004 / MI-UP-007 未闭口时 positive lane blocked |
| `SupplyEntry` | `PublishInstantiableEntry`、`TransitionAvailability`、`RollbackOrRetireEntry` | `ResolveInstantiableEntry`、`ListAvailableVariants`、`GetAvailabilityHistory` | 无 active event | `ReconcileConsumerHandoffs` | MI-UP-001 未闭口时 entry resolve 可返回 gap / unavailable |
| `ReferenceDerived` | 不直接提供业务 truth command | `GetImageTrace`、`GetContractGaps`、`GetProjectionFreshness` | 只消费经授权的 source update（未形成当前 active contract） | `RefreshExternalReferenceSnapshots`、`RebuildImageDerivedViews` | projection / snapshot 只读不反写 |

## 3. Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `DefineImageVariant` | `DefineImageVariantCommand command`（含 `ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key`、`ImageFamilyRef family_ref`、`MappingSourceSnapshot mapping_snapshot`） | `ImageVariantDefinitionRef` 或 `ContractGap` | 校验来源、范围和幂等，建立 / 修订 variant definition | `ImageVariantDefinition` history；不写 mapping body |
| `CaptureAssemblyBaseline` | `CaptureAssemblyBaselineCommand command`（`ActorContext actor`、metadata、idempotency、`ImageVariantRef variant_ref`、受控 ref 集） | `AssemblyBaselineRef` 或 incomplete / conflict result | 固化完整 static pinned baseline 与 seed placement | `AssemblyBaseline` 或 blocked gap |
| `ProposeVariantRevision` | `ProposeVariantRevisionCommand command`（actor、metadata、idempotency、`AssemblyBaselineRef baseline_ref`、`DerivationRecordRef derivation_ref`） | `VariantRevisionRef` / invalid result | 运行 completeness / pin guard，追加 revision | `VariantRevision` proposed / buildable / invalid |
| `RequestBuildIntent` | `RequestBuildIntentCommand command`（可由 Job 代发；metadata、idempotency、`VariantRevisionRef revision_ref`、`BuildTriggerContext trigger_context`；actor 按入口而定） | `BuildIntentRef` 或 pending / blocked | 判断 revision 可构建并记录 intent | `BuildIntent` accepted / pending / blocked |
| `RecordBuildOutcome` | `RecordBuildOutcomeCommand command`（metadata、idempotency、`BuildAttemptRef attempt_ref`、`BuildOutcomeConclusion outcome`） | `CandidateImageRef`、failed / unknown / gap | 验证 outcome 归属和 output identity，必要时形成 candidate | `BuildAttempt` outcome 与 `CandidateImage`；不写外部 job body |
| `EvaluateCandidateEligibility` | `EvaluateCandidateEligibilityCommand command`（actor、metadata、idempotency、`CandidateImageRef candidate_ref`、`ProvenanceBindingRef provenance_ref`、`GateEvaluationRef evaluation_ref`） | `EligibilityDecisionRef` 或 pending / blocked | 运行 provenance / applicable gate guard | `GateEvaluation`、`EligibilityDecision` |
| `RecordArtifactHandoff` | `RecordArtifactHandoffCommand command`（metadata、idempotency、`CandidateImageRef candidate_ref`、`EligibilityDecisionRef eligibility_ref`、optional `ArtifactConsumableRef artifact_ref`） | `ArtifactHandoffRecordRef` / `ContractGap` | 记录 Artifact handoff attempt / gap；MI-UP-007 未闭口不生成 positive ref | `ArtifactHandoffRecord` |
| `PublishInstantiableEntry` | `PublishInstantiableEntryCommand command`（actor、metadata、idempotency、`EligibilityDecisionRef eligibility_ref`、`ImmutableImageRef image_ref`、`ProvenanceBindingRef provenance_ref`） | `InstantiableEntryRef` 或 rejected / blocked | 运行 entry pin / availability guard，形成 entry 候选 | `AvailabilityTransition` 与 `InstantiableEntry`（仅本地 available 事实） |
| `TransitionAvailability` | `TransitionAvailabilityCommand command`（actor、metadata、idempotency、`ImageVariantRef variant_ref`、`AvailabilityTransitionKind transition_kind`、target refs） | `AvailabilityTransitionRef` / rejected | 提交 publish / replace / rollback / retire transition | append-only availability history |
| `RollbackOrRetireEntry` | `RollbackOrRetireEntryCommand command`（actor、metadata、idempotency、`InstantiableEntryRef entry_ref`、`TransitionReason reason`） | new `AvailabilityTransitionRef` | 以新 transition 指向既有安全语境 | 不删除 candidate / digest / old entry history |

Command 共性边界：

- Command 只写本仓 owner 的 truth；external adapter、projection、consumer 或 registry 不拥有直接写权限。
- `ActorContext` 只表达已由上游入口提供的责任语境，不在本章定义认证 / 授权实现。
- `IdempotencyKey`、correlation 和 object refs 是协议骨架；具体 key 算法、事务和错误映射留给 03。
- pending exact seam 的输出只能是 `ContractGap`、`blocked`、`unavailable`、`pending` 或明确失败，不是 positive success。

## 4. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetImageVariantDefinition` | `GetImageVariantDefinitionQuery query`（`ActorContext actor`、`ImageVariantRef variant_ref`、optional freshness） | `SafeDefinitionSummary` / `ImageDerivedReadModel` | `ImageVariantDefinition`、`VariantRevision` 与 projection | 不返回 Role / component / seed 正文；stale 要显式表达 |
| `GetAssemblyDerivation` | `GetAssemblyDerivationQuery query`（actor、`VariantRevisionRef revision_ref`） | `AssemblyDerivationView` | baseline / revision / trace projection | 不反写 baseline；缺 source 只返回 gap |
| `GetBuildTrace` | `GetBuildTraceQuery query`（actor、`BuildIntentRef intent_ref` 或 variant ref） | `BuildTraceView` / `ContractGap` | intent / attempt / outcome / candidate / trace | 不暴露 raw job / log / report body |
| `GetProvenanceAndEligibility` | `GetProvenanceQuery query`（actor、`CandidateImageRef candidate_ref`） | provenance / gate / eligibility safe view | `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision` | 不将 eligibility 改写为 availability / Artifact accepted |
| `ResolveInstantiableEntry` | `ResolveInstantiableEntryQuery query`（actor、`ImageVariantRef variant_ref`、`ConsumerContractRef consumer_contract_ref`） | `InstantiableEntryView` / `ConsumerHandoffGap` / unavailable | availability truth + entry projection | 不直接解析 mapping；不等待 launch / container health；MI-UP-001 未闭口时 positive resolve blocked |
| `ListAvailableVariants` | `ListAvailableVariantsQuery query`（actor、scope / freshness） | `AvailableVariantCatalogView` | availability projection | 只列本地 available 语义，必须区分 stale / rebuilding |
| `GetAvailabilityHistory` | `GetAvailabilityHistoryQuery query`（actor、`ImageVariantRef variant_ref`） | availability transition history view | append-only transition truth | 不删除或重排旧历史 |
| `GetImageTrace` | `GetImageTraceQuery query`（actor、`TraceSubjectRef subject_ref`） | `ImageTraceView` | `ImageTraceRecord` + safe refs | 不把 trace 当 source truth |
| `GetContractGaps` | `GetContractGapsQuery query`（actor、optional owner / lane filter） | `GapSummaryView` | `ContractGap` / handoff gaps | 不关闭 gap；只读解释 |
| `GetProjectionFreshness` | `GetProjectionFreshnessQuery query`（actor、`ProjectionName projection_name`） | `ProjectionFreshness` | projection state | freshness 不代表业务 ready |

Query 共性边界：

- Query 只读正式 truth 或可重建 projection，不能通过 fallback 写回或触发长时 build / container work。
- 任何 `stale`、`rebuilding`、`unavailable`、`gap` 都是可见输出类别，不压成空结果或 ready。
- 具体读取授权、分页、排序、协议和 serialization 留给 03 / 04，不在本章定义。

## 5. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeVerifiedBuildRequest` | `L0-bus` / Core 认可的 conditional inbound source（`MI-UP-005`） | `EventEnvelope envelope`（event id、source identity、correlation、幂等信息、opaque payload carrier） | 验证通过后调用 `RequestBuildIntent`；未知 / 未授权 -> rejected / unavailable | arrival 不等于 intent；当前 event family / schema 未闭口，不声明 active positive readiness |
| `ConsumeVerifiedSourceRefresh` | 正式 owner source update（conditional；当前 exact contract pending） | `EventEnvelope envelope` + source ref / freshness category | 只形成 `ExternalReferenceSnapshot` 更新候选或 `ContractGap` | 不直接写 definition / eligibility / availability；未获 authority 时为 unavailable |

Event Consumer 共性边界：

- 必须先验证 source authority、event identity、correlation 和 idempotency，再将事件转成本地 command / snapshot。
- Event consumer 不能把 transport ACK、arrival 或重复事件当作 candidate / availability。
- 当前没有任何 outbound event consumer 对应的本仓产出；`MI-UP-009` 仍开放。

## 6. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| 当前无已授权 outbound event | 不适用 | 不适用 | Availability / eligibility / publish 事实只通过查询 / ref / handoff seam 提供；不得伪造 event family、schema、delivery 或 observation success。 |

这不是遗漏：正式 01 明确当前没有镜像域 outbound event authority。若未来 `MI-UP-009` 关闭，必须先重开 Step 2、3、7、8、9、11~13，重新定义 event object、outbox / delivery seam 和失败语义。

## 7. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `RunNightlyBuildSweep` | 已持久化 `ImageVariantDefinition` / `VariantRevision` 与 ADR nightly 语义 | 为符合条件的 revision 调用 `RequestBuildIntent`，或记录 blocked / skipped reason | Nightly 是 intent 来源，不代表 build / candidate / eligibility / availability 完成；不锁 scheduler 产品或时间参数 |
| `ReconcileBuildAttempts` | `BuildAttempt`、external outcome refs、unknown attempts | 新 outcome conclusion、new attempt suggestion 或 gap | 不盲重试 unknown，不覆盖旧 attempt |
| `ReevaluatePendingQualifications` | `CandidateImage`、`ProvenanceBinding`、`GateEvaluation`、owner safe conclusions | 新 evaluation / eligibility decision 或 blocked | 不默认关闭 gate，不读取 evidence body |
| `RefreshExternalReferenceSnapshots` | owner refs / source validity / safe conclusions | `ExternalReferenceSnapshot`、`ContractGap`、freshness update | 只更新 shadow；不生成 core positive truth |
| `RebuildImageDerivedViews` | 正式 truth watermark、trace、gap | `ImageDerivedReadModel` 与 `ProjectionFreshness` | 可重建、可滞后；不反写 truth |
| `ReconcileArtifactAndConsumerHandoffs` | `ArtifactHandoffRecord`、`ConsumerHandoffGap`、owner-side refs | handoff / gap 新语境或等待 | MI-UP-001/007 未闭口时只维持 pending / gap，不声称 confirmation |

Job 共性边界：

- Job 只基于已持久化事实进行延后工作，不能替代同步 Command 对合法性的即时判断。
- Job 的失败、unknown、stale、unavailable 必须形成可追溯的新记录或 freshness，不修改旧 truth。
- 具体调度、并发、retry、锁、batch、resource 和运行环境留给 03 / 07。

## 8. 接口归属停审记录

| 主要组成部分 | Command / Query | Event / Job | 对象承接 | 结果 |
|---|---|---|---|---|
| `DefinitionAssembly` | `DefineImageVariant`、`CaptureAssemblyBaseline`、`ProposeVariantRevision`、定义 / 装配 Query | reference refresh job | family / variant / baseline / revision | `pass` |
| `BuildCandidate` | `RequestBuildIntent`、`RecordBuildOutcome`、`GetBuildTrace` | conditional build event、nightly / attempt reconcile | intent / attempt / outcome / candidate | `pass` |
| `Qualification` | `EvaluateCandidateEligibility`、`RecordArtifactHandoff`、qualification Query | pending qualification job | provenance / gate / eligibility / handoff | `pass` |
| `SupplyEntry` | publish / transition / rollback commands、entry / catalog Query | consumer handoff reconcile | availability / entry / consumer gap | `pass` |
| `ReferenceDerived` | no direct truth command、trace / gap / freshness Query | snapshot refresh / view rebuild | snapshot / gap / trace / projection | `pass` |

## 9. 跨接口一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Command / Query / Event / Job 分类清楚 | `pass` | 写、读、条件输入、延后维护互不混淆。 |
| 每个 Command 有正式对象承接 | `pass` | 对象均来自 Step 6。 |
| 每个 Query 只读 truth / projection | `pass` | 无 query writeback 或 fallback success。 |
| Event authority 与 outbound absence 显式 | `pass` | MI-UP-005 / 009 保持开放。 |
| 每个 Job 有持久化输入与边界 | `pass` | 不把 scheduler / backend 当本仓 truth。 |
| exact pending schema 未被发明 | `pass` | 输入 / 输出为骨架类别与 gap。 |
| 是否有接口无人承接 | `none_found` | 五个部分与关键对象均有入口或 Job 口径。 |

## 10. 回填草稿与下一步门禁

正式第 7 章回填接口分类、五类接口表和 pending / outbound absence 说明；不回填本文件的问题诊断和过程停审。Step 8 必须为 P0 Command、状态改写 Event、关键 Job 画独立处理流，且只使用 Step 6 已定义对象。

`gate_status = pass_stop_review`。Step 7 足以支撑 Step 8；下一动作是读取 Step 7 与 Step 8 规范并创建 `02_hld_step_08_processing_flows.md`。
