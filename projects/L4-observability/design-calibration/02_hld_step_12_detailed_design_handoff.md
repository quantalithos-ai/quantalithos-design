# L4-observability 02-概要设计 Step 12 · 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户确认后进入 Step 13

---

## 1. 本步目标

把 Step 04 ~ Step 11 已经收稳的代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响显式列为 `03-详细设计.md` 的稳定输入,防止详细设计重新发明 `L4-observability` 的主语,或在落字段、协议、函数、状态、事务、配置和测试时暗改概要设计结论。

本步不新增未经讨论的新对象、新接口、新流程或新状态;不写开发任务、排期、测试用例全集、实施 commit boundary、完整 DTO schema、完整 trait、DDL、配置项清单、产品选型结论、真实 run id、真实 evidence alias、验收签署或实现代码。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 12 | 已读取 | 约束本步只输出详细设计承接清单、继续展开方向和概要设计回退规则。 |
| `standards/document/概要设计书写规范.md` 4.12 | 已读取 | 约束本步必须用承接清单表,不得画图,不得写实施任务或新增主语。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体框架、实现分层、Inbound / Operations / Application / Domain / Ports / Projection / Outbox 主语。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、职责、非职责、对象候选池和跨部分接缝。 |
| `02_hld_step_06_key_objects.md` 及 6 个对象附录 | 已完成 | 提供关键对象主语、对象分类、对象归属、反查清单和对象附录边界。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五类接口骨架。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供通用处理流、关键接口处理流、函数参数骨架和跨流一致性边界。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供 11 组状态族、状态定义、允许 / 禁止迁移和状态传播关系。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供异常与边界场景、处理流族异常口径和状态机影响清单。 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响轮廓、禁止配置化边界、配置实现契约方向和 `04` 后移边界。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供核心能力、业务规则、数据归属、接口边界、非功能约束和验收否决线。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供依赖方向、一致性策略、运行承载、产品中立适配和横切红线。 |
| `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 作为 Step 12 承接清单和回退规则粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 作为 Step 12 大对象池、接口 / 状态 / 配置承接粒度参考。 |
| 旧 `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 仅作 historical material,识别其 schema 摘要化、承接清单缺失和旧自动顺推门禁问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 12 标准、Step 04~11、旧 Step 12 和 L1 参考粒度 | done | 本文件 §2 |
| 回答 SOP 问题,限定详细设计承接边界 | done | 本文件 §4 |
| 诊断旧材料和承接风险 | done | 本文件 §5 |
| 输出设计取舍 | done | 本文件 §6 |
| 输出详细设计承接清单表 | done | 本文件 §7 |
| 输出详细设计继续展开方向 | done | 本文件 §8 |
| 输出概要设计回退规则 | done | 本文件 §9 |
| 明确不进入承接清单的内容 | done | 本文件 §10 |
| 完成 Step 13 移交、回填草稿、自检和门禁 | done | 本文件 §11~§15 |

---

## 4. SOP 问题回答

### 4.1 哪些代码主体框架已经由概要设计收稳,详细设计不能重新发明?

已收稳的代码主体框架包括:

- 业务主要组成部分:
  - `Observation Intake and Safety`
  - `Correlation and Safe Signal`
  - `Audit Projection and Body-free Evidence Linkage`
  - `Report Handoff and Authenticity`
  - `Retention, Replay and No-write Guard`
  - `Read Query and Diagnostic Consumption`
  - `Gap and Degraded Expression`
  - `Peripheral Consumption and Export`
  - `Product-neutral Adapter and Reference Support`
  - `Derived Maintenance and Replay Coordination`
- 实现分层:
  - Inbound
  - Operations
  - Application Services
  - Domain Model
  - Domain Policy
  - Ports
  - Persistence
  - Projection
  - Outbox / Handoff
- 入口与运维主体:
  - `ObservationSyncEntry`
  - `ObservationAsyncMaterialConsumer`
  - `ProjectionMaintenanceJob`
  - `ReferenceRefreshJob`
  - `GapScanJob`
  - `RollupRebuildJob`
- 应用编排主体:
  - `ObservationIntakeService`
  - `CorrelationSignalService`
  - `AuditEvidenceService`
  - `ReportHandoffService`
  - `RetentionReplayGuardService`
  - `ObservationReadQueryService`
  - `DiagnosticViewService`
  - `GapVisibilityService`
  - `PeripheralConsumptionService`
  - `DerivedMaintenanceService`
- 关键承载主体:
  - `ObservationTruthStore`
  - `SafeSignalProjectionStore`
  - `AuditProjectionStore`
  - `ObservationReadModelStore`
  - `ViolationRecordStore`
  - `ReferenceSnapshotStore`
  - `HandoffOutboxStore`

详细设计可以继续把这些主体落为 crate、module、trait、struct、constructor、repository 和 adapter,但不能改变“谁承接入口、谁拥有 observation truth、谁只做派生、谁只做交接、谁只消费外部引用”的职责分工。

### 4.2 哪些对象、接口、处理流和状态机已经成为详细设计输入?

以下内容已经成为详细设计稳定输入:

- Step 05 的 10 个主要组成部分。
- Step 06 的对象主表和 6 个对象附录:
  - truth / signal / audit 主线对象
  - truth guard / consumption 对象
  - policy / invariant / guard 对象
  - projection / read model 对象
  - reference / boundary / context 对象
  - audit / history / change / execution record 对象
- Step 07 的五类接口:
  - Command
  - Query
  - Inbound Event Consumer
  - Outbound Event
  - Operations Job
- Step 08 的 10 组处理流族:
  - observation material intake / safety disposition
  - correlation binding and safe signal
  - audit projection and body-free evidence linkage
  - report handoff and authenticity
  - retention / replay / no-write guard
  - read query and diagnostic
  - gap and degraded expression
  - peripheral delivery and external export
  - reference snapshot and adapter
  - derived maintenance and outbox publication
- Step 09 的 11 组状态族:
  - intake / safety admission
  - correlation / safe signal / rollup
  - audit projection / evidence linkage
  - report handoff / authenticity
  - retention / active protection
  - replay / no-write guard
  - read / diagnostic
  - gap / degraded
  - peripheral / export
  - reference snapshot / adapter
  - maintenance / publication
- Step 10 的异常与边界场景。
- Step 11 的配置影响与禁止配置化边界。

### 4.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容?

详细设计应继续展开:

- 每个关键对象的正式 struct / enum / value object、字段、typed ref、summary、cursor、reason、kind、scope、policy basis、状态字段、factory、member function、DomainError 和 serialization / fixture 策略。
- 每个 Command / Query / Consumer / Outbound Event / Job 的 request / response DTO、event envelope、job input / report、idempotency、authorization、stored result、trace context、schema version、source id 和 error surface。
- 每个处理流的 application service 编排、port / repository trait、unit-of-work、expected version、save order、history / outbox / stale marker / command result 成立边界。
- 每个状态族的正式 enum、初始态、终态、允许 / 禁止迁移矩阵、可重入规则、并发冲突、错误映射和状态传播规则。
- 异常 taxonomy、degraded / restricted / not-visible / unavailable / failed response mapping、duplicate replay、quarantine、dead-letter、retry、recovery cut 和 negative tests。
- 配置 owner、builder 注入、ConfigLoader / ConfigValidator / ConfigError、AdapterConfig、JobConfig、ReadConfig、ConsumerConfig、PublisherConfig、HandoffConfig 和 future `04-配置设计.md` 承接口径。
- query no-write、consumer 不写外部 truth、job 不修 source truth、redaction-first、body-free、not-visible、retention protection、handoff non-signoff、outbox non-rollback 和 forbidden configuration 的测试矩阵。

### 4.4 如果详细设计发现主语需要变更,应回退到哪里修正?

如果详细设计发现需要新增、删除、合并、重命名或改职责归属,说明概要设计还没有真正收稳,必须回退到对应 Step 修正:

- 代码主体 / 实现分层变更:回退 Step 04。
- 主要组成部分 / 职责边界变更:回退 Step 05。
- 关键对象主语或对象归属变更:回退 Step 06。
- 接口分类、接口族或入口类型变更:回退 Step 07。
- 处理流顺序、处理流族或跨流接缝变更:回退 Step 08。
- 状态组、主状态、禁止迁移或状态传播关系变更:回退 Step 09。
- 异常边界、no-write、body-free、not-visible 或 handoff non-signoff 口径变更:回退 Step 10。
- 配置影响或禁止配置化边界变更:回退 Step 11。
- truth ownership、外部正文边界、依赖裁剪或核心能力闭环变更:回退 Step 01~03 或更上游 `00/01`。

### 4.5 哪些配置影响需要交给详细设计收口为实现契约?

Step 11 已收稳的配置影响需要在详细设计中变成实现契约,包括:

- runtime config owner、ConfigLoader、ConfigValidator、runtime builder、application service 注入边界。
- command / query / consumer / job / outbox / handoff / export / adapter / projection 配置分类和校验关系。
- redaction / safety、evidence / audit、read visibility、consumer admission、publisher / outbox、retention / replay、handoff / export 和 product-neutral adapter 的配置实现契约。
- 配置校验失败时的 startup blocked、adapter disabled、consumer delayed、job skipped、read degraded、handoff blocked、export unavailable 等 surface。
- 配置变更审计、configuration snapshot evidence candidate 和高风险配置变更的追溯口径。

配置 key、默认值、环境变量、密钥名、endpoint、产品参数、retry 数字、cron、batch、retention days、freshness threshold、SLO 和容量数字仍留给 `04-配置设计.md`、测试方案、验收标准或实施计划。

### 4.6 哪些未闭环内容不能写入承接清单,而应进入风险与待确认事项?

以下内容不能当作“已稳定输入”写入本承接清单,应进入 Step 13 或后续文档:

- 具体 DB、queue、object store、search、APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert、GRC、external audit 产品选型。
- 旧 P95 / P99 / SLA、冷存期限、hash chain、事件数量是否升级为 SLO / 容量 / 留存约束。
- SafeSignal 是否拆成 log / metric / trace 子对象、`PrepareExternalAuditExport` Command / Job 是否改名、source audit consumer 是否拆分 source family。
- `OutboxPublicationState` 是否独立对象化、`DiagnosticFreshnessState` 落在 `DiagnosticSummary` 还是 `DiagnosticView`。
- freshness threshold、retention days、batch size、parallelism、retry class 和 dead-letter payload 的具体配置值。
- 完整配置 key、默认值、环境变量、密钥、部署挂载、完整测试用例全集、验收 evidence 路径、实施 commit boundary 和开发排期。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 12 | 内容仍是 log / metric / trace / audit schema 摘要,没有给出详细设计承接清单 | 全量替换为 Step 04~11 的稳定输入索引和回退规则。 |
| 旧 Step 12 | gate 使用旧自动顺推门禁,违背当前“一 Step 一确认”纪律 | 改为 `wait_user_confirmation_before_step_13`。 |
| 旧正式 `02-概要设计.md` | 没有明确哪些是 `03-详细设计.md` 稳定输入 | 本步集中列出代码主体、组成部分、对象、接口、流、状态、异常和配置影响。 |
| Step 06 对象池很大 | 详细设计可能弱化 reference / projection / history / policy 对象,只实现 truth 对象 | 本步按对象族明确全部进入 `03` 承接。 |
| Step 07 / Step 08 接口与流存在同名或跨分类情况 | `PrepareExternalAuditExport` 等可能在详细设计中被误改主语 | 本步允许落码命名细化,但要求职责主语变更回退概要。 |
| Step 13 风险边界 | 待确认问题容易被误写成“已稳定输入” | 本步单列不进入承接清单内容,交给 Step 13。 |

---

## 6. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 Step 04~11 全文机械粘贴 | 不粘贴全文 | Step 12 需要稳定索引和详细设计展开方向,细节仍以各 Step 文件为准。 |
| 是否在本步新增对象、接口、流程或状态 | 不新增 | 承接清单只能承接已收稳结论。 |
| 是否列开发任务或排期 | 不列 | 开发任务属于 `07-实施计划.md`。 |
| 是否把风险项写成稳定承接项 | 不写 | 未闭环问题进入 Step 13。 |
| 是否允许 `03` 细化命名 | 允许细化,不允许改概要主语和职责 | 详细设计可以落 exact type / function / module 名,但不能改业务边界。 |
| 是否把配置 key 和默认值交给 `03` | 不交给 `03` | `03` 负责配置实现契约,具体填写说明和默认值留给 `04-配置设计.md`。 |

---

## 7. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 10 个业务主要组成部分 | 为每个组成部分定义 module boundary、service ownership、对象归属、读写面、跨部分接缝和不可越界职责。 |
| `ObservationSyncEntry`;`ObservationAsyncMaterialConsumer`;Operations jobs | 定义 handler / consumer / job runner、metadata、builder 注入、idempotency、run report 和 operations surface。 |
| `ObservationIntakeService`;`CorrelationSignalService`;`AuditEvidenceService`;`ReportHandoffService`;`RetentionReplayGuardService`;`ObservationReadQueryService`;`DiagnosticViewService`;`GapVisibilityService`;`PeripheralConsumptionService`;`DerivedMaintenanceService` | 定义 application service 函数、输入输出类型、port / repository 依赖、unit-of-work、transaction boundary 和 result surface。 |
| Domain Model / Domain Policy / Ports / Persistence / Projection / Outbox 实现分层 | 定义 crate / module / trait / struct / constructor / dependency injection 关系,同时保持 Domain 不直接读取配置。 |
| `ObservationTruthStore`;`AuditProjectionStore`;`ViolationRecordStore`;`ReferenceSnapshotStore`;`HandoffOutboxStore` 等承载主体 | 定义 repository trait、versioned save / load、history record、stored result、outbox persistence、projection stale marker 和 transaction boundary。 |
| `Observation Intake and Safety` 对象组 | 定义 `ObservationReceipt`、`SafetyDisposition`、`IntakeAdmissionPolicy`、`SafetyDispositionPolicy`、`IntakeStatusView`、`ObservationSourceRef`、`IntakeDecisionRecord` 的字段、状态、factory、guard、history 和 fixtures。 |
| `Correlation and Safe Signal` 对象组 | 定义 `CorrelationContext`、`SafeSignal`、`SignalRollupWindow`、`SafeSignalPolicy`、`SafeSignalProjectionView`、`SignalRollupView`、`RuntimeSandboxSignalRef`、`CorrelationLinkRecord` 的类型、状态和 rollup 契约。 |
| `Audit Projection and Body-free Evidence Linkage` 对象组 | 定义 `AuditProjection`、`EvidenceLinkage`、`BodyFreeLinkagePolicy`、`EvidenceVisibilityPolicy`、`AuditTimelineView`、`EvidenceIndexInputView`、`GovernanceArtifactEvidenceReference`、`AuditAppendRecord` 的字段、visibility、digest / ref 和 body-free guard。 |
| `Report Handoff and Authenticity` 对象组 | 定义 `ReportHandoffRecord`、`AuthenticityHint`、`HandoffReadinessState`、`AuthenticityHintPolicy`、`HandoffReadinessPolicy`、`ReportConsumerRef`、`HandoffLifecycleRecord` 的 readiness、placeholder、delivery、receipt 和 non-signoff 契约。 |
| `Retention, Replay and No-write Guard` 对象组 | 定义 `RetentionMarker`、`ActiveReferenceProtection`、`ReplayScope`、`NoWriteViolation`、`RetentionProtectionPolicy`、`ReplayBoundaryPolicy`、`NoWriteGuardPolicy`、`ProtectedObservationRef`、`RetentionChangeRecord`、`NoWriteViolationRecord` 的 hold、release、blocked、violation、replay 和 audit 规则。 |
| `Read Query and Diagnostic Consumption` 对象组 | 定义 `ReadVisibilityState`、`DiagnosticSummary`、`DiagnosticScope`、`ReadVisibilityPolicy`、`ObservationReadModel`、`DiagnosticView`、`DiagnosticRequestContext`、`ReadAccessRecord` 的 visibility、freshness、no-write 和 read surface。 |
| `Gap and Degraded Expression` 对象组 | 定义 `GapState`、`DegradedOutputState`、`GapClassificationPolicy`、`DegradedOutputPolicy`、`GapStatusView`、`GapSourceRef`、`GapTransitionRecord` 的 missing / unresolved / not-visible / unsafe / blocked 语义和 transition。 |
| `Peripheral Consumption and Export` 对象组 | 定义 `PeripheralDeliveryState`、`ExternalAuditExportPreparation`、`PeripheralExportPolicy`、`DashboardAlertExportView`、`PeripheralConsumerRef`、`PeripheralDeliveryRecord` 的 export scope、delivery、failure 和 product-neutral consumer contract。 |
| `Product-neutral Adapter and Reference Support` 对象组 | 定义 `ReferenceSnapshotState`、`ReferenceFreshnessPolicy`、`AdapterBoundaryPolicy`、`ReferenceSnapshotView`、`SubjectObservationReference`、`GovernanceArtifactEvidenceReference`、`RuntimeSandboxSummaryRef`、`ArchiveReportHandoffRef`、`ReferenceRefreshRecord` 的 safe summary、freshness、source version 和 adapter boundary。 |
| `Derived Maintenance and Replay Coordination` 对象组 | 定义 `ProjectionMaintenanceState`、`ReplayCoordinationState`、`RollupRebuildState`、`DerivedMaintenancePolicy`、`ReplayCoordinationPolicy`、`RebuildProgressView`、`MaintenanceTargetRef`、`ProjectionMaintenanceRecord`、`GapScanRecord`、`ReplayExecutionRecord` 的 job result、progress、replay 和 no-repair 契约。 |
| Step 06 policy / invariant / guard 对象族 | 定义 guard 输入、返回面、DomainError、policy basis、snapshot 依赖、negative tests 和 config non-bypass tests。 |
| Step 06 projection / read model 对象族 | 定义 view ref、view body、freshness、visibility、degraded / restricted / unavailable surface、rebuild source 和 persistence shape。 |
| Step 06 reference / boundary / context 对象族 | 定义 typed ref family、safe summary、source version、resolution state、visibility context、trace context 和外部正文排除。 |
| Step 06 audit / history / record 对象族 | 定义 change record、transition record、read access record、delivery record、refresh record、execution record 的 persisted shape 和 traceability。 |
| Step 07 Command 骨架 | 逐 command 定义 request / response DTO、`ActorContext`、`CommandMetadata`、idempotency、expected version、stored result、authorization 和 error mapping。 |
| Step 07 Query 骨架 | 逐 query 定义 request / response DTO、page、filter、visibility、freshness、restricted / not-visible / degraded / unavailable surface 和 query no-write tests。 |
| Step 07 Inbound Event Consumer 骨架 | 定义 event envelope、source event id、source ref、schema version、dedup key、trace context、accepted / duplicate / delayed / rejected / quarantine receipt。 |
| Step 07 Outbound Event 骨架 | 定义 event payload、outbox source、publication envelope、routing abstraction、consumer unsupported version 和 partial publication failure surface。 |
| Step 07 Operations Job 骨架 | 定义 job input / report、`JobMetadata`、operator actor、job idempotency、cursor、batch、retry class、failed refs、stored report 和 progress view。 |
| Step 08 通用 Command 写路径 | 定义 validation、load current truth、apply domain transition、save truth / marker / history / outbox / projection stale marker / command result 的 exact order。 |
| Step 08 通用 Query 只读路径 | 定义 read authorization、projection load、fallback、degraded response、not-visible response、read access record 策略和 no-write tests。 |
| Step 08 通用 Consumer 路径 | 定义 envelope validation、dedup、forbidden body rejection、snapshot / marker upsert、affected projection / gap / handoff stale marker。 |
| Step 08 通用 Operations Job 路径 | 定义 committed fact scan、cursor、job report、partial failure、idempotency、retry class 和 operations visibility。 |
| intake / safety processing flow | 定义 `SubmitObservationMaterial` / `RecordSafetyDisposition` application contract、redaction / quarantine decision、intake history、gap stale marker 和 forbidden body negative tests。 |
| correlation / safe signal processing flow | 定义 `BindCorrelationContext` / `RecordSafeSignal` contract、correlation hints、signal candidate、rollup stale marker 和 safe label validation。 |
| audit / evidence linkage processing flow | 定义 `AppendAuditProjection` / `LinkBodyFreeEvidence` contract、audit projection repository、body-free linkage guard、evidence visibility 和 handoff readiness marker。 |
| report handoff / authenticity processing flow | 定义 `PrepareReportHandoff` / `EvaluateAuthenticityHint` / handoff job contract、evidence index input、gap status、authenticity hint、lifecycle record 和 receipt surface。 |
| retention / replay / no-write processing flow | 定义 `SetRetentionMarker`、`ProtectActiveReference`、`DefineReplayScope`、`RecordNoWriteViolation`、`CoordinateObservationReplay` 的 guard、history、active reference lookup 和 no-repair tests。 |
| read / diagnostic processing flow | 定义 `GetObservationReadModel`、`GetDiagnosticView`、read visibility、diagnostic freshness、projection fallback 和 explain-only response contract。 |
| gap / degraded processing flow | 定义 `RecordGapState`、`GetGapStatus`、`ScanObservationGaps`、gap classification、degraded output、suppression 和 blocked response mapping。 |
| peripheral / export processing flow | 定义 `PrepareExternalAuditExport`、`GetPeripheralExportView`、`RebuildPeripheralViews`、export scope、consumer ref、body-free export guard、delivery record 和 failed marker。 |
| reference snapshot / adapter processing flow | 定义 `RegisterReferenceSnapshot`、`UpdateReferenceSnapshotState`、`RefreshReferenceSnapshots`、source family、schema version、safe summary、freshness、unresolved / invalid / unavailable surface。 |
| outbox / derived maintenance processing flow | 定义 `PublishObservationOutbox`、`RebuildObservationReadModels`、`RebuildSignalRollups`、publication state、dead-lettered visibility、projection rebuild 和 progress persistence。 |
| Step 09 intake / safety 状态族 | 定义 `ObservationReceiptState`、`SafetyDispositionState` 的正式 enum、initial / terminal、allowed transitions、reason classes 和 serialization。 |
| Step 09 correlation / signal / rollup 状态族 | 定义 `CorrelationContextState`、`SafeSignalState`、`SignalRollupState` 的 formal enum、freshness、partial / invalid 和 rollup rebuild rules。 |
| Step 09 audit / evidence 状态族 | 定义 `AuditProjectionState`、`EvidenceLinkageState` 的 append、restricted、suppressed、body-blocked、not-visible、stale 和 transition guards。 |
| Step 09 handoff / authenticity 状态族 | 定义 `HandoffReadinessState`、`ReportHandoffState`、`AuthenticityHintState` 的 pending、ready、blocked、degraded、delivered、placeholder 和 insufficient rules。 |
| Step 09 retention / replay / no-write 状态族 | 定义 `RetentionMarkerState`、`ActiveReferenceProtectionState`、`ReplayScopeState`、`NoWriteViolationState` 的 active hold、release eligible、protected、blocked、escalated 和 closed rules。 |
| Step 09 read / diagnostic / gap 状态族 | 定义 `ReadVisibilityState`、`DiagnosticFreshnessState`、`GapState`、`DegradedOutputState` 的 restricted、not-visible、stale、partial、open、suppressed、blocked 语义。 |
| Step 09 peripheral / reference / maintenance 状态族 | 定义 `PeripheralDeliveryState`、`ExternalAuditExportState`、`ReferenceSnapshotStateKind`、`ProjectionMaintenanceStateKind`、`RollupRebuildStateKind`、`OutboxPublicationState` 的 failed / retryable / dead-lettered / unavailable rules。 |
| Step 09 允许 / 禁止迁移清单 | 补状态矩阵、guard、DomainError、expected version、duplicate replay、concurrency 和 state transition tests。 |
| Step 09 状态传播关系 | 补 truth change -> history / outbox / projection stale / read surface / handoff / peripheral / operations visibility 的正式传播规则。 |
| Step 10 异常与边界场景 | 定义 error taxonomy、response mapping、quarantine、dead-letter、retry cut、recovery cut、negative tests 和 operations report surface。 |
| Step 10 处理流族异常口径 | 定义 Command / Query / Consumer / Job 异常在 application、domain、repository、outbox、projection、handoff 的落点和不可越界行为。 |
| Step 11 配置影响轮廓 | 定义 config owner、RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、ReadConfig、ConsumerConfig、PublisherConfig、HandoffConfig、ConfigError 和 runtime builder 注入关系。 |
| Step 11 禁止配置化边界 | 定义 config validation tests 和 safety gates,确保配置不能绕过 redaction-first、body-free、no-write、retention protection、not-visible、placeholder、job non-repair 和 outbox non-rollback。 |

---

## 8. 详细设计继续展开方向

### 8.1 对象与状态契约

详细设计必须把 Step 06 / Step 09 闭成可落码对象契约:

- 关键对象的字段、newtype、typed ref、enum variant、状态字段、summary、reason、basis carrier、scope、cursor、source version、freshness 和 visibility 类型。
- 工厂函数、成员函数、状态迁移函数、DomainError、history / trace / outbox / stale marker / handoff 副作用。
- 每个状态族的初始态、终态、可重入迁移、禁止迁移、expected version、并发冲突和序列化 / migration 规则。

### 8.2 协议与接口契约

详细设计必须把 Step 07 闭成正式接口契约:

- Command / Query request / response DTO。
- Consumer / Outbound Event envelope、schema version、trace context、dedup key、source event id、source ref、source family。
- Job input / report、run metadata、cursor、batch、retry result、failed refs、dead-letter visibility。
- not-visible、restricted、stale、unavailable、failed、duplicate、unsupported version、quarantine、blocked、degraded response surface。

### 8.3 Application flow 与事务契约

详细设计必须把 Step 08 闭成 application / transaction 契约:

- service 编排顺序、port / repository trait、save order、result store、outbox trigger、projection stale marker。
- truth、marker、history、trace、audit、handoff、stale marker、stored result 的事务边界。
- Query no-write、Consumer non-truth-write、Job no-truth-repair、Replay observation-side-only 的显式约束和测试。

### 8.4 Persistence / projection / outbox / handoff 契约

详细设计必须定义:

- truth repository、history repository、read model repository、reference snapshot repository、outbox repository、handoff repository。
- trace / audit / transition / refresh / delivery / gap scan / replay execution / projection maintenance record 的 persisted shape。
- projection rebuild、freshness marker、read degraded source、receipt validation、partial failure report、dead-lettered visibility 和 operations report。

### 8.5 配置与运行承载契约

详细设计必须定义:

- config owner、builder 注入、validation failure surface、adapter disabled / consumer delayed / read degraded / job skipped / handoff blocked / export unavailable 语义。
- job schedule / batch / cursor / retry class / parallelism 的 formal config surface,但不写具体值。
- read degraded、handoff retry、external refresh cadence、redaction / body-free / retention / replay policy 的实现级接缝。
- 对未来 `04-配置设计.md` 的参数、默认值、密钥、产品参数和填写说明承接口径。

### 8.6 测试与验收承接

详细设计必须为后续 `05-测试方案.md` 和 `06-验收标准.md` 提供结构化输入:

- state transition tests。
- DTO / event / report contract roundtrip tests。
- query no-write / visibility / degraded tests。
- consumer duplicate / unsupported version / forbidden body tests。
- outbox partial failure / dead-letter tests。
- rebuild / refresh / gap scan / replay / handoff job tests。
- forbidden configuration / boundary violation negative tests。

---

## 9. 概要设计回退规则

如果详细设计发现上述主语需要变更,说明概要设计尚未真正收稳,应先回到概要设计修正,而不是在 `03-详细设计.md` 中暗改。

| 详细设计发现的问题 | 回退位置 | 说明 |
|---|---|---|
| 需要新增或删除代码主体骨架、运行主体或实现分层 | Step 04 | 代码主体决定谁承接入口、谁拥有 truth、谁只做派生和交接。 |
| 需要新增、删除或合并主要组成部分 | Step 05 | 业务组成部分不是实现期可私改项。 |
| 需要新增关键对象、删除对象或改变对象归属 | Step 06 | 对象主语必须先在概要层正式化。 |
| 需要新增接口族、接口类别或改变接口读写性质 | Step 07 | Command / Query / Consumer / Event / Job 分类必须先在接口骨架收稳。 |
| 需要新增处理流族、改变主路径顺序或改变跨流接缝 | Step 08 | 这会直接影响 application 编排、事务语义和 outbox / projection 落点。 |
| 需要改变状态组、主状态、允许 / 禁止迁移或状态传播关系 | Step 09 | 状态机红线不能在详细设计临时修改。 |
| 需要改变异常边界、让 Query 写状态、Consumer 写外部 truth 或 Job 修 source truth | Step 10 | 这已经触动概要层边界规则。 |
| 需要改变配置影响或允许配置绕过 redaction / body-free / no-write / retention / handoff 红线 | Step 11 | 配置不可越界是概要层门禁。 |
| 需要改变 truth ownership、外部正文边界、依赖裁剪、核心能力闭环或验收否决项 | Step 01~03 或回到 `00/01` | 这已超出概要局部调整范围。 |

---

## 10. 不进入本承接清单的内容

以下内容不写入本承接清单,应进入 Step 13 或后续文档:

| 内容 | 后续归属 |
|---|---|
| DB、queue、object store、search、APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert、GRC、external audit 的具体产品选型 | Step 13 / `04-配置设计.md` / ADR / 实施计划 |
| SLO、P95 / P99、容量、吞吐、告警阈值、冷存期限、retention days | Step 13 / `05-测试方案.md` / `06-验收标准.md` / `04-配置设计.md` |
| 完整配置 key、默认值、env var、secret、endpoint、部署挂载和 network policy | 未来 `04-配置设计.md` |
| 完整测试用例全集、mock 数据、真实 evidence 路径和验收签署 | `05-测试方案.md` / `06-验收标准.md` |
| 实施 commit boundary、开发排期、提交顺序、implementation ledger 和 planned boundary skeleton | `07-实施计划.md` |
| `SafeSignal` 是否拆成 log / metric / trace 三套正式对象 | Step 13 待确认;当前只允许在不破坏 `SafeSignal` 主语的前提下由详细设计细分 |
| `PrepareExternalAuditExport` Command 与 Job 是否改名区分 | Step 13 待确认;当前通过接口类别和 context 区分 |
| `ConsumeSourceAuditMaterial` 是否按 source family 拆分 | Step 13 待确认;当前用 source family / ref 区分 |
| `OutboxPublicationState` 是否独立对象化 | Step 13 待确认;当前作为 publication 状态族承接 |
| `DiagnosticFreshnessState` 落在 `DiagnosticSummary` 还是 `DiagnosticView` | Step 13 待确认;当前作为 read / diagnostic 状态族处理 |

---

## 11. Step 13 设计风险与待确认事项移交门禁

Step 13 必须只收纳当前概要设计层仍未闭环的风险和待确认事项,不得把本步已经列入详细设计承接清单的稳定结论重新写成待确认。

| Step 13 预计收纳主题 | 来源 | Step 13 必须守住的边界 |
|---|---|---|
| `SafeSignal` 是否拆分 log / metric / trace 对象 | Step 06 / Step 07 待确认 | 可作为详细设计细化问题,不能改变 `SafeSignal` 统一主语。 |
| `ExternalAuditExportPreparation` 是 state object 还是 projection object | Step 06 待确认 | 当前按 truth/state 承接,除非回退 Step 06。 |
| `PrepareExternalAuditExport` Command / Job 命名 | Step 07 / Step 08 待确认 | 可改落码名,不能改变接口分类和 no-truth 边界。 |
| `ConsumeSourceAuditMaterial` source family 拆分 | Step 07 待确认 | 可拆 consumer 实现,不能吸收 source audit body。 |
| `OutboxPublicationState` 独立对象化 | Step 09 待确认 | 当前作为 publication 状态族承接,不能让 publish failure 回滚 truth。 |
| `DiagnosticFreshnessState` 承载位置 | Step 09 待确认 | 当前按 read / diagnostic 状态族承接,Query 仍 no-write。 |
| 外部产品选型、旧性能数字、配置值硬化 | Step 11 / 需求风险 | 不得升级为当前概要稳定输入。 |

进入 Step 13 的条件: 仅当用户确认后,Step 13 才能读取本文件并开始设计风险与待确认事项;不得自动跨 Step,不得触碰正式 `02-概要设计.md`。

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §12 “详细设计承接清单”引用本文件 §7 的详细设计承接清单表。
- §12 摘录本文件 §8 的详细设计继续展开方向。
- §12 摘录本文件 §9 的概要设计回退规则。
- §12 摘录本文件 §10 的“不进入本承接清单的内容”,并把这些内容交给 Step 13 或后续文档。
- 正式文档中应明确:如果 `03-详细设计.md` 发现主语需要变更,应先回到 `02-概要设计.md` 对应 Step 修正,不得暗改。

---

## 13. 待确认事项

本步不新增阻塞 Step 13 的待确认事项。Step 13 将专门收纳当前概要设计层尚未闭合的设计风险、待确认事项和后续文档缺口。

---

## 14. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 12 SOP、书写规范、Step 04~11、旧 Step 12 和 L1 参考粒度 | pass |
| 是否输出详细设计承接清单表 | pass |
| 是否只写已经由 Step 04~11 收稳的结论 | pass |
| 是否未新增未经讨论的新对象、新接口、新流程或新状态 | pass |
| 是否明确详细设计继续展开对象、接口、流程、状态、异常、配置、持久化和测试 | pass |
| 是否明确详细设计发现主语变更时必须回退概要设计 | pass |
| 是否区分承接清单与 Step 13 风险 / 待确认事项 | pass |
| 是否未写开发任务、排期、测试用例全集、实施指令、配置项清单或产品选型结论 | pass |
| 是否未伪造真实 run id、真实 evidence alias、验收签署、测试结果或 implementation evidence | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 13 的上游 blocker | no |

---

## 15. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 12、概要书写规范 4.12、Step 04~11、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 12;旧 Step 12 已降级为 historical material | wait_user_confirmation_before_step_13 |
