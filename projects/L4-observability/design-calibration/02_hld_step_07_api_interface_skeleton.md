# L4-observability 02-概要设计 Step 07 · API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 08

---

## 1. 本步目标

把 `L4-observability` 的正式入口按 Command API、Query API、Inbound Event Consumer、Outbound Event 和 Operations Job 分类,明确每类接口的输入骨架、输出骨架、读写性质、对象承接和边界。

本步只收口概要层接口主语。可以点名正式 command / query / event / job 名称,可以写输入对象骨架、输出对象骨架、主要处理摘要和本地写入结果,但不写 HTTP path、RPC method、完整 JSON / proto schema、topic 命名规则、回调参数全集、repository trait、事务细节、handler 调用链、鉴权实现、真实 evidence alias、真实 run id、验收签署或测试结果。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、职责边界、对象候选池和跨部分接缝。 |
| `projects/L4-observability/design-calibration/02_hld_step_06_key_objects.md` + 6 个对象附录 | 已完成 | 提供 Step 07 接口必须承接的 truth / policy / projection / reference / history 对象主语。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供 log / metric / trace / audit event、redaction、correlation、evidence linkage、retention、report handoff、no-write 等需求边界。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供 observation-owned truth、audit projection、body-free linkage、event collaboration、no-write 和依赖裁剪边界。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 7 | 约束本步必须输出接口分类、五类接口表、接口归属停审和跨接口一致性审计。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.7 | 约束本步不得画流程图,不得写协议 / topic / schema / 实现细节,但必须显式写上下文和幂等骨架。 |
| `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 作为 Command / Query / Event / Job 五类表和组件映射粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 作为接口边界、Consumer 幂等、Job 非业务 command 的粒度参考。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 仅作 historical material,识别其把接口骨架压缩成主题摘要、缺少五类接口表和停审记录的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 07 标准、Step 05 / Step 06 和 L1 参考粒度 | done | 本文件 §2 |
| 回答 SOP 问题,先区分 Command / Query / Consumer / Event / Job | done | 本文件 §4 |
| 诊断旧 Step 07 与当前正式边界冲突 | done | 本文件 §5 |
| 完成接口分类取舍,明确 no-write 与 body-free 边界 | done | 本文件 §6~§7 |
| 输出 Command / Query / Consumer / Event / Job 五类骨架表 | done | 本文件 §8~§12 |
| 建立接口到 10 个主要组成部分的映射和停审记录 | done | 本文件 §13~§14 |
| 完成跨接口一致性审计和 Step 08 处理流移交门禁 | done | 本文件 §15~§16 |
| 完成回填草稿、待确认事项、自检和 Step 门禁 | done | 本文件 §17~§20 |

---

## 4. SOP 问题回答

### 4.1 哪些接口属于 Command,负责改写本仓 truth?

Command 只覆盖会改写 observation-owned truth、audit projection、body-free linkage、handoff record、retention marker、gap state、reference snapshot、peripheral preparation、maintenance state 或 history record 的用例入口。它们必须显式携带 `ActorContext`、`CommandMetadata`、idempotency key 和 trace context。

Command 不得写入 Governance truth、Artifact / evidence body、Identity truth、Runtime / Sandbox execution truth、Archive package truth、Console truth 或任何外部 product config truth。

### 4.2 哪些接口属于 Query,只读取投影或只读视图?

Query 只读取 `IntakeStatusView`、`SafeSignalProjectionView`、`SignalRollupView`、`AuditTimelineView`、`EvidenceIndexInputView`、`ObservationReadModel`、`DiagnosticView`、`GapStatusView`、`DashboardAlertExportView`、`ReferenceSnapshotView` 和 `RebuildProgressView` 等只读面。所有 Query 输入必须携带 `ActorContext` 和 `QueryMetadata`,用于可见性、分页、consistency hint、degraded surface 和读取审计关联。

Query 不得写 truth、不得刷新 reference、不得补造 gap、不得触发 replay、不得写 source truth,也不得把 not-visible / stale / unsafe 输出伪装成成功。

### 4.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

进入本仓的外部事实包括 observation material、source audit material、identity observation context、governance audit context、artifact evidence context、runtime / sandbox safe summary、archive handoff feedback 和 report consumer feedback。所有 Consumer 输入必须携带 event envelope、source event id、source ref、schema version、dedup key 和 trace context。

Consumer 只能更新本地 receipt / safety disposition / reference snapshot / audit projection input / handoff lifecycle / delivery state / gap marker / stale marker,不能绕过 Command 直接创建外部 truth,不能复制外部正文或 evidence body。

### 4.4 哪些已提交事实需要通过 Outbound Event 对外传播?

需要传播的事实包括 observation receipt、safety disposition、safe signal、audit projection、evidence linkage、report handoff、retention marker、no-write violation、gap state、reference snapshot、derived projection 和 peripheral delivery 的变化。Outbound Event 只能来自已提交的本仓事实或维护状态,下游失败不得回滚本仓 truth。

### 4.5 哪些恢复、发布、重建、对账动作属于 Operations Job?

outbox 发布、read model rebuild、signal rollup rebuild、reference snapshot refresh、gap scan、observation replay coordination、report handoff preparation、external audit export preparation 和 peripheral view rebuild 属于 Operations Job。Job 可以维护派生状态、handoff state、export preparation、stale marker、progress view 和 history record,不得作为业务 command,不得静默修复 source truth,不得伪造真实 run id、真实 evidence alias 或真实验收结果。

### 4.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入中的 `context` 均表示 `ActorContext` + `CommandMetadata` + idempotency key + trace context。缺失时不得进入 observation truth 写路径。

### 4.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入中的 `context` 均表示 `ActorContext` + `QueryMetadata`。读取路径必须保留可见性、redaction、degraded、retention hold 和 no-write 审计边界。

### 4.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、dedup key 和 trace context。重复、乱序、unsupported version 或 redaction failure 只能进入 duplicate / ignored / stale / quarantined / gap surface,不能产生 source truth 写入。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 07 | 只有 log / metric / trace / audit / evidence 等主题摘要,没有接口类别和输入输出骨架 | 重写为 Command / Query / Consumer / Event / Job 五类接口骨架。 |
| 旧 Step 07 | 未按 10 个主要组成部分分配接口归属,无法支撑 Step 08 处理流 | 补齐组件映射和逐组件停审记录。 |
| 旧 Step 07 | 混入 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord` 等未在当前 Step 06 正式化的对象名 | 当前只引用 Step 06 已正式化对象或明确作为后续详细设计可细分项处理。 |
| 旧材料 / README | 带有 TimescaleDB、Grafana、P95、hash chain、冷存天数等实现或产品假设 | 全部降级为 historical material;当前 Step 不继承产品或部署参数。 |
| 旧正式 `02-概要设计.md` | 未经过当前 Step 01~06 门禁,存在 schema 心智和产品心智 | 不作为当前接口真相源,只作为历史问题输入。 |
| 上游接口风险 | Observability 容易被写成全局审计 truth owner | 当前只写 observation-owned truth、audit projection、body-free linkage 和 handoff marker,不拥有上游业务 truth。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 输出结构 | 单表主题摘要 | 五类正式接口表 + 组件映射 + 停审 + 一致性审计 |
| 对象承接 | 多数接口未回指 Step 06 对象 | 每个接口都回指关键对象或对象能力 |
| 读写性质 | Query / Command / Job 边界不清 | Command 写本仓 truth,Query 只读,Consumer 写本地投影 / marker,Job 维护派生 |
| 外部事实 | 容易复制 source audit / evidence body | 统一使用 ref / safe summary / body-free linkage |
| Step 08 承接 | 处理流入口不稳定 | P0 command、写本地状态的 Consumer 和关键 Job 已可进入 Step 08 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只列 log / metric / trace / audit 四类接口主题 | 简短 | 无法说明读写性质、对象承接、幂等和 no-write 边界 | 不采用 |
| 方案 B: 按外部系统列接口,例如 Governance / Artifact / Runtime / Archive | 便于看依赖 | 容易把外部系统写成本仓编译期依赖或 truth source | 不采用 |
| 方案 C: 按 Command / Query / Consumer / Event / Job 五类接口,再映射到 10 个组成部分 | 与 SOP 和 L1 粒度一致,也能支撑 Step 08 / Step 09 | 文件较长,需要额外做一致性审计 | 采用 |
| 方案 D: 在概要层直接定义 HTTP path、topic、DTO 和错误码 | 对实现看似更直接 | 违反概要设计边界,会提前锁死详细设计 | 不采用 |
| 方案 E: 让 maintenance job 承担 replay repair 和 source cleanup | 后台修复简单 | 违反 no-write 和 source truth ownership | 不采用 |

---

## 8. 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须携带的上下文 | 不得做什么 |
|---|---|---|---|---|
| Command API | 改写本仓 observation truth / audit projection / marker / history | intake、safety、correlation、safe signal、audit projection、body-free linkage、handoff、retention、gap、reference、export preparation 的正式变化 | `ActorContext`、`CommandMetadata`、idempotency key、trace context | 不写 source truth;不保存 raw body / evidence body;不伪造 evidence / signoff / run result |
| Query API | 只读 | 读取 intake、signal、audit timeline、evidence index input、handoff、retention protection、diagnostic、gap、peripheral、reference 和 rebuild progress | `ActorContext`、`QueryMetadata`、page / consistency hint / visibility scope | 不写 truth、projection、snapshot、marker 或 outbox |
| Inbound Event Consumer | 写本地 receipt / projection input / reference snapshot / marker / stale state | 承接外部事实和反馈,把它们转换为本仓可审计观察面 | event envelope、source event id、source ref、schema version、dedup key、trace context | 不直接生成外部业务 truth;不复制外部正文;不绕过 redaction |
| Outbound Event | 输出已提交 observation 事实或维护状态 | 向 Governance、Artifact、Archive、Runtime、SDK、Console、dashboard、external audit 等消费面传播 body-free 观察事实 | outbox event id、committed fact ref、trace context | 不携带 raw payload、evidence body、source body 或外部配置 |
| Operations Job | 后台发布 / 重建 / 刷新 / 扫描 / 协调 / 导出准备 | 维护派生视图、rollup、reference snapshot、handoff readiness、export preparation 和 progress view | `JobMetadata`、system / operator actor、job idempotency key、trace context | 不作为业务 command;不修 source truth;不伪造真实 run id 或验收结果 |

---

## 9. Command API 骨架表

所有 Command 输入中的 `context` 均表示 `ActorContext` + `CommandMetadata` + idempotency key + trace context。本表只写输入 / 输出骨架,不定义 DTO 字段全集。

| Command | 输入骨架 | 输出骨架 | 写入对象 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `SubmitObservationMaterial` | source ref + material kind + safe summary hint + context | `ObservationReceiptCommandResult` | `ObservationReceipt`;`IntakeDecisionRecord` | `Observation Intake and Safety` | 候选材料进入 observation side;不保存 raw body 或 source truth。 |
| `RecordSafetyDisposition` | observation receipt ref + disposition intent + redaction / quarantine reason + context | `SafetyDispositionCommandResult` | `SafetyDisposition`;`IntakeDecisionRecord` | `Observation Intake and Safety` | disposition 只表达安全处置,不裁决业务事实。 |
| `BindCorrelationContext` | observation receipt ref + correlation hints + source event refs + context | `CorrelationContextCommandResult` | `CorrelationContext`;`CorrelationLinkRecord` | `Correlation and Safe Signal` | correlation id 不反推业务 truth,不补造外部关系。 |
| `RecordSafeSignal` | correlation context ref + safe signal kind + safe labels + context | `SafeSignalCommandResult` | `SafeSignal`;`SignalRollupWindow`;`CorrelationLinkRecord` | `Correlation and Safe Signal` | signal 已 redaction-first;不保存原始 log / metric / trace 正文。 |
| `AppendAuditProjection` | correlation context ref + source audit ref + audit action summary + context | `AuditProjectionCommandResult` | `AuditProjection`;`AuditAppendRecord` | `Audit Projection and Body-free Evidence Linkage` | audit projection 是只读投影,不拥有 Governance / Artifact truth。 |
| `LinkBodyFreeEvidence` | audit projection ref + governance / artifact evidence ref + linkage purpose + context | `EvidenceLinkageCommandResult` | `EvidenceLinkage`;`AuditAppendRecord` | `Audit Projection and Body-free Evidence Linkage` | 只保存 body-free ref / digest / visibility,不保存 evidence body。 |
| `PrepareReportHandoff` | handoff scope + evidence index input ref + consumer ref + context | `ReportHandoffCommandResult` | `ReportHandoffRecord`;`HandoffReadinessState`;`HandoffLifecycleRecord` | `Report Handoff and Authenticity` | 只准备交接记录,不生成最终 verdict、signoff 或真实证据别名。 |
| `EvaluateAuthenticityHint` | report handoff ref + audit / evidence / gap refs + context | `AuthenticityHintCommandResult` | `AuthenticityHint`;`HandoffLifecycleRecord` | `Report Handoff and Authenticity` | authenticity 是提示与缺口说明,不是验收签署。 |
| `SetRetentionMarker` | protected observation ref + retention intent + hold / release reason + context | `RetentionMarkerCommandResult` | `RetentionMarker`;`RetentionChangeRecord` | `Retention, Replay and No-write Guard` | 只标记本仓 observation material 生命周期,不删除 source truth。 |
| `ProtectActiveReference` | protected observation ref + active reference reason + context | `ActiveReferenceProtectionCommandResult` | `ActiveReferenceProtection`;`RetentionChangeRecord` | `Retention, Replay and No-write Guard` | 活动引用保护优先于清理,不替代 archive eligibility truth。 |
| `DefineReplayScope` | maintenance target ref + replay purpose + boundary constraints + context | `ReplayScopeCommandResult` | `ReplayScope`;`ReplayExecutionRecord` | `Retention, Replay and No-write Guard` | replay scope 只允许 observation side,不修复 source truth。 |
| `RecordNoWriteViolation` | attempted write source + protected target ref + violation reason + context | `NoWriteViolationCommandResult` | `NoWriteViolation`;`NoWriteViolationRecord` | `Retention, Replay and No-write Guard` | 记录违例和阻断结果,不执行补偿写入。 |
| `RecordGapState` | gap source ref + classification intent + degraded output hint + context | `GapStateCommandResult` | `GapState`;`DegradedOutputState`;`GapTransitionRecord` | `Gap and Degraded Expression` | 显式表达 missing / not-visible / unsafe,不补造默认成功。 |
| `PrepareExternalAuditExport` | export scope + peripheral consumer ref + policy context + context | `ExternalAuditExportCommandResult` | `ExternalAuditExportPreparation`;`PeripheralDeliveryState`;`PeripheralDeliveryRecord` | `Peripheral Consumption and Export` | 只准备 body-free 导出面,external audit / GRC 不成为 truth owner。 |
| `RegisterReferenceSnapshot` | source ref + snapshot summary + freshness hint + context | `ReferenceSnapshotCommandResult` | `ReferenceSnapshotState`;`ReferenceRefreshRecord` | `Product-neutral Adapter and Reference Support` | snapshot 只保存 safe summary / freshness,不保存外部正文。 |
| `UpdateReferenceSnapshotState` | reference snapshot ref + resolution state + reason + context | `ReferenceSnapshotCommandResult` | `ReferenceSnapshotState`;`ReferenceRefreshRecord` | `Product-neutral Adapter and Reference Support` | stale / unresolved / invalid 必须显式表达,不得静默成功。 |

---

## 10. Query API 骨架表

所有 Query 输入中的 `context` 均表示 `ActorContext` + `QueryMetadata`。Query 可以返回 stale / degraded / not-visible / unsafe / blocked surface,但不得修复状态。

| Query | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetObservationReceipt` | observation receipt ref + context | `ObservationReceiptView` | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` | `Observation Intake and Safety` | 不读取 source raw body。 |
| `GetIntakeStatus` | intake scope + page / consistency hint + context | `IntakeStatusView` | intake status projection | `Observation Intake and Safety` | 不重跑 redaction 或 admission。 |
| `GetSafeSignal` | safe signal ref or correlation context ref + context | `SafeSignalProjectionView` | `SafeSignal`;`CorrelationContext`;signal projection | `Correlation and Safe Signal` | 不暴露原始 log / metric / trace payload。 |
| `GetSignalRollup` | rollup window ref + filters + context | `SignalRollupView` | `SignalRollupWindow`;rollup projection | `Correlation and Safe Signal` | rollup stale 时返回 freshness surface。 |
| `GetAuditTimeline` | audit subject ref + page + context | `AuditTimelineView` | `AuditProjection`;`AuditAppendRecord`;`EvidenceLinkage` | `Audit Projection and Body-free Evidence Linkage` | timeline 是审计投影,不替代 source audit truth。 |
| `GetEvidenceIndexInput` | report / audit scope + context | `EvidenceIndexInputView` | `EvidenceLinkage`;`AuditTimelineView`;gap view | `Audit Projection and Body-free Evidence Linkage` / `Report Handoff and Authenticity` | 只返回 body-free evidence index input,不读取 evidence body。 |
| `GetReportHandoff` | report handoff ref + context | `ReportHandoffView` | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffLifecycleRecord` | `Report Handoff and Authenticity` | 不生成最终报告正文或验收结论。 |
| `GetRetentionProtection` | protected observation ref + context | `RetentionProtectionView` | `RetentionMarker`;`ActiveReferenceProtection`;`RetentionChangeRecord` | `Retention, Replay and No-write Guard` | 不执行 release / cleanup。 |
| `GetObservationReadModel` | read scope + filters + page + context | `ObservationReadModel` | read model projection + visibility state | `Read Query and Diagnostic Consumption` | 只读 canonical read model,不修 projection。 |
| `GetDiagnosticView` | diagnostic request context + context | `DiagnosticView` | `DiagnosticSummary`;`DiagnosticScope`;`ReadAccessRecord` | `Read Query and Diagnostic Consumption` | diagnostic 是 explain-only,不下发控制命令。 |
| `GetGapStatus` | gap source ref or scope + context | `GapStatusView` | `GapState`;`DegradedOutputState`;`GapTransitionRecord` | `Gap and Degraded Expression` | 缺口状态只读,不自动关闭 gap。 |
| `GetPeripheralExportView` | peripheral consumer ref + export scope + context | `DashboardAlertExportView` | peripheral read projection + delivery state | `Peripheral Consumption and Export` | 外围消费只读,不得形成第二 observation truth。 |
| `GetReferenceSnapshotView` | subject / evidence / runtime / archive ref + context | `ReferenceSnapshotView` | `ReferenceSnapshotState`;`ReferenceRefreshRecord` | `Product-neutral Adapter and Reference Support` | 不触发 refresh,不解析外部正文。 |
| `GetRebuildProgress` | maintenance target ref + context | `RebuildProgressView` | `ProjectionMaintenanceState`;`RollupRebuildState`;`ReplayCoordinationState` | `Derived Maintenance and Replay Coordination` | progress 只读,不启动维护任务。 |

---

## 11. Inbound Event Consumer 骨架表

所有 Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、dedup key 和 trace context。本地结果只能是 observation side 的 receipt、projection input、reference snapshot、handoff / delivery state、gap / stale marker 或 history record。

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ConsumeBusObservationMaterial` | `L0-bus` event collaboration | observation material envelope + source event id + source ref + dedup key | `ObservationReceipt`;`IntakeDecisionRecord` | `Observation Intake and Safety` | bus 是协作通道,不是编译期依赖或 truth owner。 |
| `ConsumeSourceAuditMaterial` | governance / artifact / runtime / source audit producer | source audit envelope + audit ref + schema version + dedup key | `AuditProjection` input marker;`AuditAppendRecord` | `Audit Projection and Body-free Evidence Linkage` | 只投影 audit ref / safe summary,不拥有 source audit body。 |
| `ConsumeIdentityObservationContext` | `L1-identity` | actor / subject observation context envelope + identity ref | `SubjectObservationReference`;`ReferenceSnapshotState` | `Product-neutral Adapter and Reference Support` | 不写 GlobalMember、Role 或 identity lifecycle truth。 |
| `ConsumeGovernanceAuditContext` | `L1-governance` | governance audit context envelope + decision / control / nonconformity refs | `GovernanceArtifactEvidenceReference`;`ReferenceSnapshotState`;audit stale marker | `Audit Projection and Body-free Evidence Linkage` / `Product-neutral Adapter and Reference Support` | 不写 Governance decision / policy / control truth。 |
| `ConsumeArtifactEvidenceContext` | `L1-artifact` | artifact evidence context envelope + evidence ref + digest / visibility summary | `GovernanceArtifactEvidenceReference`;`EvidenceLinkage` input marker | `Audit Projection and Body-free Evidence Linkage` | 不保存 artifact content 或 evidence body。 |
| `ConsumeRuntimeSignalSummary` | runtime / capability producer | runtime signal summary envelope + runtime ref + safe signal hints | `RuntimeSandboxSummaryRef`;`SafeSignal` input marker | `Correlation and Safe Signal` / `Product-neutral Adapter and Reference Support` | safe summary 不是 execution truth。 |
| `ConsumeSandboxSignalSummary` | sandbox producer | sandbox signal summary envelope + sandbox ref + safety hints | `RuntimeSandboxSignalRef`;`SafetyDisposition` input marker | `Observation Intake and Safety` / `Correlation and Safe Signal` | 不拥有 sandbox execution body 或 result truth。 |
| `ConsumeArchiveHandoffFeedback` | archive / report handoff consumer | archive handoff feedback envelope + archive handoff ref | `ArchiveReportHandoffRef`;`HandoffLifecycleRecord`;delivery state marker | `Report Handoff and Authenticity` / `Product-neutral Adapter and Reference Support` | 不拥有 archive package truth。 |
| `ConsumeReportConsumerFeedback` | report / external audit / dashboard consumer | consumer feedback envelope + report consumer ref + delivery result summary | `PeripheralDeliveryState`;`PeripheralDeliveryRecord`;`GapState` input marker | `Peripheral Consumption and Export` / `Gap and Degraded Expression` | consumer feedback 不反写 report truth 或 source truth。 |

---

## 12. Outbound Event 骨架表

Outbound Event 只传播已提交 observation fact、audit projection、handoff / retention / gap / reference / maintenance 状态。事件 payload 由详细设计继续定义,本步只给输出骨架和边界。

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `ObservationReceiptChanged` | `ObservationReceipt` / `SafetyDisposition` change | observation receipt ref + disposition state + trace context | source owner、diagnostic consumer、gap scan、observability read surface | 不携带 raw material。 |
| `SafetyDispositionChanged` | safety disposition accepted / rejected / quarantined / degraded | disposition ref + reason class + trace context | diagnostic、dashboard、gap expression | reason class 不泄露 unsafe body。 |
| `SafeSignalRecorded` | `SafeSignal` / `SignalRollupWindow` change | safe signal ref + signal kind + rollup window ref + trace context | read model、dashboard、runtime diagnostics | 不输出原始 log / metric / trace。 |
| `AuditProjectionAppended` | `AuditProjection` append | audit projection ref + source audit ref + visibility state + trace context | Governance、Artifact、Archive、report handoff、external audit prep | 不携带 source audit body。 |
| `EvidenceLinkageChanged` | `EvidenceLinkage` create / update / blocked | evidence linkage ref + evidence source family + visibility state + trace context | report handoff、evidence index input、Archive、external audit prep | body-free only。 |
| `ReportHandoffChanged` | `ReportHandoffRecord` / `HandoffReadinessState` change | report handoff ref + readiness state + consumer ref + trace context | Archive、external audit、management report、console | 不携带 final verdict 或 signoff。 |
| `RetentionMarkerChanged` | `RetentionMarker` / `ActiveReferenceProtection` change | protected observation ref + retention state + protection reason + trace context | maintenance、archive handoff、diagnostic | 不代表 source cleanup 已执行。 |
| `NoWriteViolationRecorded` | `NoWriteViolation` recorded | violation ref + attempted target summary + blocked reason + trace context | governance audit consumer、diagnostic、operations review | 不执行补偿写入。 |
| `GapStateChanged` | `GapState` / `DegradedOutputState` change | gap ref + classification + degraded state + trace context | read query、report handoff、peripheral consumer | gap 不是 source truth 修复。 |
| `ReferenceSnapshotChanged` | `ReferenceSnapshotState` change | reference snapshot ref + freshness / resolution state + trace context | query、maintenance、gap scan、handoff | 不携带外部正文。 |
| `DerivedProjectionChanged` | `ProjectionMaintenanceState` / rebuild completion | maintenance target ref + freshness state + source cursor summary | SDK、console、dashboard、diagnostic | 派生变化不代表新业务 truth。 |
| `PeripheralDeliveryChanged` | `PeripheralDeliveryState` / export preparation change | peripheral delivery ref + consumer ref + delivery state + trace context | dashboard、alert、external audit / GRC、management report | 下游失败不得回滚本仓 truth。 |

---

## 13. Operations Job 骨架表

Operations Job 输入中的 `job context` 表示 `JobMetadata` + system / operator actor + job idempotency key + trace context。Job 只能基于已提交事实维护派生状态、发布状态、snapshot、handoff / export readiness 和 progress view。

| Job | 输入骨架 | 输出骨架 | 允许写入 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `PublishObservationOutbox` | outbox cursor / event class filters + job context | publication report | outbound publication state;failed marker | `Derived Maintenance and Replay Coordination` | 发布失败不回滚 observation truth。 |
| `RebuildObservationReadModels` | read model set + observation scope + source cursor + job context | rebuild report | `ObservationReadModel`;`DiagnosticView`;`ProjectionMaintenanceState`;`RebuildProgressView` | `Derived Maintenance and Replay Coordination` / `Read Query and Diagnostic Consumption` | 只从 committed observation facts 重建。 |
| `RebuildSignalRollups` | rollup window scope + safe signal cursor + job context | rollup rebuild report | `SignalRollupWindow`;`SignalRollupView`;`RollupRebuildState` | `Correlation and Safe Signal` / `Derived Maintenance and Replay Coordination` | 不重新解释 raw metric / trace body。 |
| `RefreshReferenceSnapshots` | reference family + freshness policy scope + job context | refresh report | `ReferenceSnapshotState`;`ReferenceRefreshRecord`;`ReferenceSnapshotView` | `Product-neutral Adapter and Reference Support` | 不复制外部正文或改变外部 lifecycle。 |
| `ScanObservationGaps` | scan scope + expected source refs + visibility constraints + job context | gap scan report | `GapState`;`GapScanRecord`;`GapStatusView` | `Gap and Degraded Expression` / `Derived Maintenance and Replay Coordination` | 只发现和表达缺口,不补造 source material。 |
| `CoordinateObservationReplay` | replay scope + maintenance target ref + no-write guard context + job context | replay coordination report | `ReplayCoordinationState`;`ReplayExecutionRecord`;`ProjectionMaintenanceState` | `Retention, Replay and No-write Guard` / `Derived Maintenance and Replay Coordination` | replay 只作用于 observation / projection side。 |
| `PrepareReportHandoffDelivery` | report handoff scope + consumer ref + readiness policy + job context | handoff preparation report | `ReportHandoffRecord`;`HandoffLifecycleRecord`;handoff outbox marker | `Report Handoff and Authenticity` | 不生成最终验收结论、真实 evidence alias 或 signoff。 |
| `PrepareExternalAuditExport` | export scope + peripheral consumer ref + body-free policy + job context | export preparation report | `ExternalAuditExportPreparation`;`PeripheralDeliveryState`;`PeripheralDeliveryRecord` | `Peripheral Consumption and Export` | external audit / GRC 只能消费导出面,不得成为 truth source。 |
| `RebuildPeripheralViews` | peripheral view set + source cursor + consumer scopes + job context | peripheral rebuild report | `DashboardAlertExportView`;`PeripheralDeliveryState`;`RebuildProgressView` | `Peripheral Consumption and Export` / `Derived Maintenance and Replay Coordination` | peripheral view stale 不反写核心 observation truth。 |

---

## 14. 接口到主要组成部分映射

| 主要组成部分 | Command | Query | Consumer | Outbound Event | Job |
|---|---|---|---|---|---|
| `Observation Intake and Safety` | `SubmitObservationMaterial`;`RecordSafetyDisposition` | `GetObservationReceipt`;`GetIntakeStatus` | `ConsumeBusObservationMaterial`;`ConsumeSandboxSignalSummary` | `ObservationReceiptChanged`;`SafetyDispositionChanged` | gap scan / read model rebuild 间接消费 intake facts |
| `Correlation and Safe Signal` | `BindCorrelationContext`;`RecordSafeSignal` | `GetSafeSignal`;`GetSignalRollup` | `ConsumeRuntimeSignalSummary`;`ConsumeSandboxSignalSummary` | `SafeSignalRecorded` | `RebuildSignalRollups` |
| `Audit Projection and Body-free Evidence Linkage` | `AppendAuditProjection`;`LinkBodyFreeEvidence` | `GetAuditTimeline`;`GetEvidenceIndexInput` | `ConsumeSourceAuditMaterial`;`ConsumeGovernanceAuditContext`;`ConsumeArtifactEvidenceContext` | `AuditProjectionAppended`;`EvidenceLinkageChanged` | read model rebuild / report handoff preparation |
| `Report Handoff and Authenticity` | `PrepareReportHandoff`;`EvaluateAuthenticityHint` | `GetReportHandoff`;`GetEvidenceIndexInput` | `ConsumeArchiveHandoffFeedback` | `ReportHandoffChanged` | `PrepareReportHandoffDelivery` |
| `Retention, Replay and No-write Guard` | `SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation` | `GetRetentionProtection` | retention-related stale / feedback consumers only through explicit mapping | `RetentionMarkerChanged`;`NoWriteViolationRecorded` | `CoordinateObservationReplay` |
| `Read Query and Diagnostic Consumption` | - | `GetObservationReadModel`;`GetDiagnosticView` | read-side stale marker consumers through projection rebuild | derived / read freshness via `DerivedProjectionChanged` | `RebuildObservationReadModels` |
| `Gap and Degraded Expression` | `RecordGapState` | `GetGapStatus` | `ConsumeReportConsumerFeedback` | `GapStateChanged` | `ScanObservationGaps` |
| `Peripheral Consumption and Export` | `PrepareExternalAuditExport` | `GetPeripheralExportView` | `ConsumeReportConsumerFeedback` | `PeripheralDeliveryChanged` | `PrepareExternalAuditExport`;`RebuildPeripheralViews` |
| `Product-neutral Adapter and Reference Support` | `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState` | `GetReferenceSnapshotView` | `ConsumeIdentityObservationContext`;`ConsumeGovernanceAuditContext`;`ConsumeArtifactEvidenceContext`;`ConsumeRuntimeSignalSummary`;`ConsumeArchiveHandoffFeedback` | `ReferenceSnapshotChanged` | `RefreshReferenceSnapshots` |
| `Derived Maintenance and Replay Coordination` | - | `GetRebuildProgress` | stale / feedback consumers only update local maintenance markers | `DerivedProjectionChanged` | `PublishObservationOutbox`;`RebuildObservationReadModels`;`RebuildSignalRollups`;`RefreshReferenceSnapshots`;`ScanObservationGaps`;`CoordinateObservationReplay`;`RebuildPeripheralViews` |

---

## 15. 每个主要组成部分的接口归属停审记录

| 主要组成部分 | 接口承接是否完整 | 分类风险 | 停审结论 |
|---|---|---|---|
| `Observation Intake and Safety` | receipt、disposition、intake status、bus material consumer 和 safety event 已覆盖 | `SubmitObservationMaterial` 可能被误解为 source truth 写入 | pass;已标注 raw body / source truth 禁止。 |
| `Correlation and Safe Signal` | correlation、safe signal、rollup query、runtime / sandbox summary 和 signal event 已覆盖 | safe signal 可能被误解为 execution truth | pass;已标注 safe summary / projection 边界。 |
| `Audit Projection and Body-free Evidence Linkage` | audit append、evidence linkage、timeline、evidence index input 和 source / governance / artifact consumers 已覆盖 | evidence linkage 可能携带 body | pass;已标注 body-free only。 |
| `Report Handoff and Authenticity` | handoff preparation、authenticity hint、handoff query、archive feedback 和 handoff event 已覆盖 | handoff 可能被误解为验收签署 | pass;已禁止 final verdict / signoff /真实证据别名。 |
| `Retention, Replay and No-write Guard` | retention、active protection、replay scope、no-write violation 和 replay job 已覆盖 | replay / job 可能越权修 source truth | pass;已以 no-write guard 和 replay boundary 限制。 |
| `Read Query and Diagnostic Consumption` | read model、diagnostic view、read rebuild 和 derived freshness 已覆盖 | Query 可能暗中刷新或修复 | pass;已标注 Query 只读且不触发 refresh。 |
| `Gap and Degraded Expression` | gap command、gap query、consumer feedback、gap event 和 scan job 已覆盖 | gap 可能被写成默认成功或 source repair | pass;已要求显式 degraded / not-visible / unsafe。 |
| `Peripheral Consumption and Export` | export preparation、peripheral query、consumer feedback、delivery event 和 peripheral rebuild 已覆盖 | external audit / GRC 可能成为 truth owner | pass;已标注只读导出消费面。 |
| `Product-neutral Adapter and Reference Support` | reference snapshot commands、query、外部 consumer 和 refresh job 已覆盖 | reference snapshot 可能复制外部正文 | pass;已限定 safe summary / freshness / resolution。 |
| `Derived Maintenance and Replay Coordination` | publish、rebuild、refresh、scan、replay、handoff、export 和 progress query 已覆盖 | job 可能冒充 business command | pass;已标注 job 只维护派生和进度。 |

---

## 16. 跨接口一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| Command 是否只写本仓 observation-owned truth / marker / history | pass | 所有 Command 写入对象均来自 Step 06,未写外部 truth。 |
| Query 是否保持只读 | pass | Query 只读取 projection / read model / view,不触发 refresh、replay 或 repair。 |
| Consumer 是否携带 envelope、source event id、source ref、schema version、dedup key 和 trace context | pass | §11 已统一声明,各 Consumer 只写本地 projection / marker / snapshot。 |
| Outbound Event 是否只传播已提交事实 | pass | §12 的事件均从本仓事实或维护状态产生,未携带正文。 |
| Operations Job 是否避免业务 command 化 | pass | §13 所有 Job 只维护 outbox、projection、snapshot、gap、handoff、export 或 progress。 |
| 是否存在 raw body / evidence body / source audit body 回流 | pass | 所有入口均使用 safe summary、ref、digest、visibility 或 body-free linkage。 |
| 是否存在 report handoff 伪造验收结论 | pass | handoff / authenticity / export 均不生成真实 signoff、evidence alias 或 run result。 |
| 是否存在接口无人承接 | pass | §14 已把所有接口映射到 10 个主要组成部分。 |
| 是否存在对象能力无入口 | pass | Step 06 的 truth / projection / reference / history 能力已由 Command、Query、Consumer 或 Job 覆盖。 |
| 是否滑入详细设计 | pass | 未写 HTTP path、topic 规则、完整 DTO schema、repository trait、事务或 handler 调用链。 |

---

## 17. Step 08 处理流移交门禁

Step 08 必须从本步接口中选择处理流入口,而不是重新发明入口主语。

| Step 08 预计处理流 | 入口接口 | 必须回指的对象 |
|---|---|---|
| observation material intake / safety disposition | `SubmitObservationMaterial`;`RecordSafetyDisposition`;`ConsumeBusObservationMaterial` | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` |
| correlation binding and safe signal recording | `BindCorrelationContext`;`RecordSafeSignal`;`ConsumeRuntimeSignalSummary` | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`CorrelationLinkRecord` |
| audit projection append and body-free evidence linkage | `AppendAuditProjection`;`LinkBodyFreeEvidence`;`ConsumeSourceAuditMaterial`;`ConsumeArtifactEvidenceContext` | `AuditProjection`;`EvidenceLinkage`;`GovernanceArtifactEvidenceReference`;`AuditAppendRecord` |
| report handoff and authenticity evaluation | `PrepareReportHandoff`;`EvaluateAuthenticityHint`;`PrepareReportHandoffDelivery` | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`HandoffLifecycleRecord` |
| retention / replay / no-write guard | `SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation`;`CoordinateObservationReplay` | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation`;`ReplayCoordinationState` |
| read query and diagnostic consumption | `GetObservationReadModel`;`GetDiagnosticView`;`RebuildObservationReadModels` | `ObservationReadModel`;`DiagnosticView`;`ReadVisibilityState`;`DiagnosticSummary` |
| gap / degraded expression | `RecordGapState`;`GetGapStatus`;`ScanObservationGaps` | `GapState`;`DegradedOutputState`;`GapStatusView`;`GapScanRecord` |
| peripheral delivery / external audit export | `PrepareExternalAuditExport`;`GetPeripheralExportView`;`RebuildPeripheralViews` | `ExternalAuditExportPreparation`;`PeripheralDeliveryState`;`DashboardAlertExportView` |
| reference snapshot refresh | `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState`;`RefreshReferenceSnapshots` | `ReferenceSnapshotState`;`ReferenceSnapshotView`;`ReferenceRefreshRecord` |
| derived maintenance and outbox publication | `PublishObservationOutbox`;`RebuildObservationReadModels`;`RebuildSignalRollups` | `ProjectionMaintenanceState`;`RollupRebuildState`;`RebuildProgressView`;`ProjectionMaintenanceRecord` |

进入 Step 08 的条件: 仅当用户确认后,Step 08 才能读取本文件并开始处理流展开;不得自动跨 Step,不得触碰正式 `02-概要设计.md`。

---

## 18. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”引用本文件 §8 的接口分类说明。
- §7 摘录 §9~§13 的五类接口骨架表,保留输入 / 输出对象名、读写性质和边界,不展开协议 schema。
- §7 保留 §14 的接口到主要组成部分映射,作为 §8 处理流和 §9 状态流转的入口索引。
- 正文必须继续声明 `L4-observability` 只承载观测与审计投影,不拥有 Governance、Artifact、Identity、Runtime、Archive 或外部产品 truth。
- 详细设计继续定义 DTO、错误码、幂等结果、envelope、port trait、事务边界和权限实现;概要设计不得提前锁定。

---

## 19. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP07-001` | `SafeSignal` 在详细设计是否拆为 log / metric / trace 三套 command / query | 当前概要层先使用统一 `RecordSafeSignal` / `GetSafeSignal`,后续 `03-详细设计` 可在不破坏 `SafeSignal` 主语的前提下拆分。 |
| `Q-HLD-STEP07-002` | `PrepareExternalAuditExport` 同名 Command 与 Job 是否需要在详细设计改名区分 | 当前保留同名业务意图,通过分类和上下文区分;详细设计可改为更明确的 command / job 名称。 |
| `Q-HLD-STEP07-003` | `ConsumeSourceAuditMaterial` 是否需要按 Governance / Artifact / Runtime source family 继续拆分 | 当前概要层先统一入口,用 source family / ref 区分;若 Step 08 处理流过重,可在详细设计拆 Consumer。 |
| `Q-HLD-STEP07-004` | 外围 dashboard / alert / external audit / GRC 是否需要独立 Query | 当前统一由 `GetPeripheralExportView` 承接,避免产品化消费面进入核心接口主线。 |

---

## 20. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 07 SOP、书写规范、Step 05、Step 06 和 L1 参考粒度 | pass |
| 是否输出 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 五类表 | pass |
| 是否显式说明 Command 需要 `ActorContext`、`CommandMetadata`、idempotency key 和 trace context | pass |
| 是否显式说明 Query 需要 `ActorContext` 和 `QueryMetadata` | pass |
| 是否显式说明 Consumer 需要 envelope、source event id、source ref、schema version、dedup key 和 trace context | pass |
| 是否完成接口到 10 个主要组成部分的映射和停审 | pass |
| 是否保持 body-free、redaction-first、no-write 和不拥有业务 truth 边界 | pass |
| 是否未写 HTTP path、topic 命名规则、完整 DTO schema、repository trait、事务或 handler 调用链 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 08 的上游 blocker | no |

---

## 21. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 7、概要书写规范 4.7、Step 05 主要组成部分、Step 06 关键对象、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 07;旧 Step 07 已降级为 historical material | wait_user_confirmation_before_step_08 |
