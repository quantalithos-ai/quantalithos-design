# L4-observability 02-概要设计 Step 08 · 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户确认后进入 Step 09

---

## 1. 本步目标

围绕 Step 07 已收敛的 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 骨架,说明关键接口如何经过 inbound / consumer / job、application service、domain object / policy、projection / outbox / history 形成可继续详细设计的处理流。

本步只收口概要层处理流骨架。可以点名关键 service、domain method、projection builder、outbox publisher、repository port 和事务内外的大体边界;处理流中函数调用参数必须带类型名。本步不写完整 DTO schema、完整 Rust 函数签名、repository trait、事务脚本、错误码全集、retry 参数、SQL / DDL、topic 名称、测试用例、真实 run id、真实 evidence alias、验收签署或实现代码。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、capability、代码主体和跨部分接缝。 |
| `02_hld_step_06_key_objects.md` + 6 个对象附录 | 已完成 | 提供处理流中允许点名的 truth / policy / projection / reference / history 对象。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供接口分类、接口到组成部分映射和 Step 08 处理流移交门禁。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供 redaction-first、body-free evidence、correlation、audit projection、retention、report handoff 和 no-write 规则来源。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供 observation-owned truth、依赖方向、一致性策略、事件协作和不反写业务 truth 边界。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 8 | 约束本步必须输出通用处理流、关键接口处理流图、覆盖清单、停审和一致性审计。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.8 与 ASCII 图约束 | 约束本步必须画关键处理流 ASCII 图,函数参数写类型名,禁止完整实现细节。 |
| `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md` | 已读取 | 作为“通用路径 + 流族 + 覆盖清单”的粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_08_processing_flows.md` | 已读取 | 作为“多图处理流 + 函数骨架 + 未展开说明”的粒度参考。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_08_processing_flows.md` | 已读取 | 仅作 historical material,识别其薄、未画图、未承接 Step 07 的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 08 标准、Step 05~07、旧 Step 08 和 L1 参考粒度 | done | 本文件 §2 |
| 回答 SOP 问题,先确定处理流选择规则 | done | 本文件 §4 |
| 诊断旧材料和当前风险 | done | 本文件 §5 |
| 选择通用路径 + 关键流族方案,避免逐接口机械重复 | done | 本文件 §6 |
| 输出通用 Command / Query / Consumer / Job 路径 | done | 本文件 §7 |
| 输出关键处理流清单、覆盖清单和 10 个独立处理流图 | done | 本文件 §8~§10 |
| 完成接口到处理流族映射、组件停审和一致性审计 | done | 本文件 §11~§13 |
| 完成 Step 09 状态机移交、回填草稿、自检和门禁 | done | 本文件 §14~§18 |

---

## 4. SOP 问题回答

### 4.1 每个关键 Command 的写路径如何进入 application service、domain object、repository / outbox?

`L4-observability` 的关键 Command 共用一个 observation write path:

1. Inbound entry 校验 `ActorContext`、`CommandMetadata`、idempotency key、trace context 和 no-write boundary。
2. Application service 读取 source ref、safe summary、当前 observation truth、reference snapshot、policy 和必要的 projection state。
3. Domain policy 判断 redaction-first、body-free、correlation integrity、retention protection、gap classification、adapter boundary 或 derived maintenance 不变量。
4. Domain object factory / transition 形成本仓 observation truth、audit projection、linkage、marker、history 或 stale marker。
5. 同一写入边界保存本仓 truth / marker / history / outbox / projection stale marker / command result。
6. Outbound event 只能从已提交 outbox / history 传播,不得由 publisher 重新计算业务 truth。

Command 不得保存 raw body、source audit body、evidence body、外部业务 truth、archive package truth 或外部产品配置。

### 4.2 每个关键 Query 如何读取 projection 或只读视图?

Query 只读,必须携带 `ActorContext` 和 `QueryMetadata`。简单 ref 查询走通用只读路径;涉及 visibility、redaction state、retention hold、projection stale / missing、gap / degraded / not-visible / unsafe surface 的 Query 必须经过 `ObservationReadQueryService`、`ReadVisibilityPolicy`、`DegradedOutputPolicy` 和对应 read model / view。

Query 不刷新 reference,不修复 projection,不写 read access 以外的业务状态,不触发 replay,不把缺口或不可见材料伪装成成功。

### 4.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录?

Inbound Event Consumer 必须先验证 envelope、source event id、source ref、schema version、dedup key、trace context 和 source family boundary。Consumer 只能写 `ObservationReceipt`、`SafetyDisposition` input marker、`AuditProjection` input marker、`EvidenceLinkage` input marker、`ReferenceSnapshotState`、`HandoffLifecycleRecord`、`PeripheralDeliveryState`、`GapState` input marker、stale marker 或 history record。

Consumer 不得直接生成外部 business truth,不得复制 source / artifact / evidence / runtime body,不得绕过 redaction 或 body-free policy。

### 4.4 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账?

Operations Job 必须从已持久化 observation fact、audit projection、history record、reference snapshot、retention marker、gap state、outbox 或 projection state 出发。`PublishObservationOutbox` 影响传播可靠性;`RebuildObservationReadModels`、`RebuildSignalRollups`、`RefreshReferenceSnapshots`、`ScanObservationGaps` 和 `RebuildPeripheralViews` 影响查询一致性;`CoordinateObservationReplay`、`PrepareReportHandoffDelivery`、`PrepareExternalAuditExport` 影响 replay / handoff / export 可解释性。

Job 不得作为业务 command,不得修复 source truth,不得清理外部 truth,不得伪造真实 run id、真实 evidence alias、signoff 或验收结果。

### 4.5 处理流中点名的关键函数调用,参数分别是什么类型?

本步只点名概要层函数骨架,参数必须带类型名:

| 函数骨架 | 参数类型骨架 | 使用流 |
|---|---|---|
| `IntakeAdmissionPolicy.assert_admissible(...)` | `ObservationSourceRef source_ref`;`SafeSummary safe_summary`;`ActorContext actor_context` | intake |
| `SafetyDispositionPolicy.assert_redaction_safe(...)` | `ObservationReceipt receipt`;`SafetyDisposition disposition`;`CommandMetadata command_metadata` | intake / safety |
| `CorrelationSignalService.bind_context(...)` | `ObservationReceipt receipt`;`CorrelationHintSet correlation_hints`;`ActorContext actor_context` | correlation |
| `SafeSignalPolicy.assert_signal_safe(...)` | `CorrelationContext correlation_context`;`SafeSignalCandidate signal_candidate`;`RuntimeSandboxSignalRef runtime_ref` | safe signal |
| `BodyFreeLinkagePolicy.assert_body_free(...)` | `GovernanceArtifactEvidenceReference evidence_ref`;`EvidenceLinkage linkage`;`ActorContext actor_context` | audit / evidence |
| `EvidenceVisibilityPolicy.assert_link_visible(...)` | `EvidenceLinkage linkage`;`ReadVisibilityState visibility_state`;`QueryMetadata query_metadata` | audit / query |
| `HandoffReadinessPolicy.evaluate_readiness(...)` | `EvidenceIndexInputView evidence_index_input`;`GapStatusView gap_status`;`ReportConsumerRef consumer_ref` | report handoff |
| `AuthenticityHintPolicy.evaluate_hint(...)` | `ReportHandoffRecord handoff_record`;`EvidenceLinkageSet evidence_links`;`GapStateSet gap_states` | authenticity |
| `RetentionProtectionPolicy.assert_marker_allowed(...)` | `ProtectedObservationRef protected_ref`;`RetentionMarker marker`;`ActorContext actor_context` | retention |
| `NoWriteGuardPolicy.assert_no_source_write(...)` | `MaintenanceTargetRef target_ref`;`NoWriteAttempt attempt`;`ActorContext actor_context` | no-write / replay |
| `ReadVisibilityPolicy.assert_can_read(...)` | `DiagnosticRequestContext request_context`;`ReadVisibilityState visibility_state`;`ActorContext actor_context` | query |
| `GapClassificationPolicy.classify_gap(...)` | `GapSourceRef gap_source_ref`;`ReferenceSnapshotState reference_snapshot`;`ReadVisibilityState visibility_state` | gap |
| `PeripheralExportPolicy.assert_export_allowed(...)` | `PeripheralConsumerRef consumer_ref`;`DashboardAlertExportView export_view`;`ActorContext actor_context` | peripheral export |
| `ReferenceFreshnessPolicy.assert_refresh_allowed(...)` | `ReferenceSnapshotState snapshot_state`;`MaintenanceTargetRef target_ref`;`JobMetadata job_metadata` | reference refresh |
| `DerivedMaintenancePolicy.assert_rebuild_allowed(...)` | `MaintenanceTargetRef target_ref`;`ProjectionMaintenanceState maintenance_state`;`ReplayScope replay_scope` | rebuild / replay |

这些名称是概要层处理流锚点,详细设计必须决定正式签名、返回类型、错误映射、transaction boundary、repository / port trait 和测试切口。

### 4.6 哪些处理步骤必须在概要设计点名,哪些完整函数调用链留给详细设计?

概要设计必须点名:

- redaction-first 在 intake 和 signal 之前生效。
- body-free evidence linkage 在 audit / handoff / export 前生效。
- correlation context 只能绑定 ref / safe summary,不能反推业务 truth。
- query / diagnostic / export / maintenance 都必须经过 no-write guard。
- accepted / changed fact 伴随 history / outbox / stale marker,发布失败不回滚 truth。
- gap / degraded / not-visible / unsafe 必须是显式 surface。

详细设计继续定义:

- DTO 字段、协议 envelope、错误码、幂等结果、retry / dead-letter、repository trait、事务和版本。
- projection builder 的完整输入字段、索引、分页、缓存、并发和异常分支。
- 真正 evidence alias、run id、测试证据和验收签署来源。

### 4.7 哪些 P0 Command、Consumer、Job 必须画独立处理流?

本步按 Step 07 移交门禁和 10 个主要组成部分画独立处理流族:

- `SubmitObservationMaterial` / `RecordSafetyDisposition` / `ConsumeBusObservationMaterial`
- `BindCorrelationContext` / `RecordSafeSignal` / `ConsumeRuntimeSignalSummary`
- `AppendAuditProjection` / `LinkBodyFreeEvidence` / `ConsumeSourceAuditMaterial` / `ConsumeArtifactEvidenceContext`
- `PrepareReportHandoff` / `EvaluateAuthenticityHint` / `PrepareReportHandoffDelivery`
- `SetRetentionMarker` / `ProtectActiveReference` / `DefineReplayScope` / `RecordNoWriteViolation` / `CoordinateObservationReplay`
- `GetObservationReadModel` / `GetDiagnosticView` / `RebuildObservationReadModels`
- `RecordGapState` / `GetGapStatus` / `ScanObservationGaps`
- `PrepareExternalAuditExport` / `GetPeripheralExportView` / `RebuildPeripheralViews`
- `RegisterReferenceSnapshot` / `UpdateReferenceSnapshotState` / `RefreshReferenceSnapshots`
- `PublishObservationOutbox` / `RebuildSignalRollups` / derived maintenance family

### 4.8 哪些 Query 可以只走通用读路径,哪些 Query 必须独立处理?

`GetObservationReceipt`、`GetIntakeStatus`、`GetSafeSignal`、`GetSignalRollup`、`GetAuditTimeline`、`GetReportHandoff`、`GetRetentionProtection`、`GetReferenceSnapshotView`、`GetRebuildProgress` 这类单主题 Query 复用通用只读路径或对应处理流族。`GetObservationReadModel`、`GetDiagnosticView`、`GetGapStatus`、`GetPeripheralExportView`、`GetEvidenceIndexInput` 涉及 visibility、degraded、projection readiness、body-free 和 gap surface,必须在关键流中体现。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 08 | 只有主题摘要,没有通用路径、独立处理流图、函数参数类型骨架和覆盖清单 | 重写为通用路径 + 10 个关键处理流图 + 覆盖清单 + 审计。 |
| 旧 Step 08 | 混入 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord` 等未在当前 Step 06 正式化对象 | 当前只使用 Step 06/07 已收稳对象;log / metric / trace 细分留给详细设计。 |
| 旧 Step 08 | 未说明 redaction、body-free、no-write 在处理流中的位置 | 当前在 intake、audit/evidence、query/export、maintenance/replay 中显式放置 guard。 |
| 旧材料 / README | TimescaleDB、Grafana、P95、hash chain、冷存天数和事件数量容易变成实现约束 | 全部保留为 historical material,不进入处理流骨架。 |
| 上游协作风险 | Consumer / Job 可能被误写成业务 truth 修复入口 | 当前明确 Consumer 写本地 marker / projection input / snapshot,Job 只维护派生和交接。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 给 Step 07 每个接口都画独立处理流 | 覆盖直观 | 40+ 接口会产生大量重复图,正式 02 难以审查 | 不采用 |
| 方案 B: 只画一个通用写路径和一个通用读路径 | 篇幅短 | 无法承接 body-free、handoff、retention、gap、reference refresh、outbox 等差异 | 不采用 |
| 方案 C: 通用路径 + 10 个关键处理流族 + 覆盖清单 | 粒度对齐 L1,能支撑详细设计展开 | 文档较长,需要停审和一致性审计 | 采用 |
| 方案 D: 在概要层写事务脚本、repository trait 和错误码 | 对实现看似直接 | 越过概要设计边界,也会锁死详细设计 | 不采用 |
| 方案 E: 把 report / export / dashboard 作为核心写路径 | 交付面更快 | 会形成第二 observation truth 或外部 truth 反写 | 不采用 |

---

## 7. 通用处理流骨架

### 7.1 通用 Command 写路径

```text
+====================================================================+
|                 Generic Observation Command Write Path              |
+====================================================================+
| Command request                                                     |
|   | validate ActorContext + CommandMetadata + idempotency key       |
|   | validate trace context + no-write boundary                      |
|   v                                                                 |
| Application service                                                  |
|   | load source refs, current observation state and policy context  |
|   | call Guard.assert_allowed(TypedInput input, ActorContext actor) |
|   v                                                                 |
| Domain policy + domain object                                        |
|   | assert redaction / body-free / retention / gap / adapter rules  |
|   | create or transition observation-owned object                   |
|   v                                                                 |
| Persistence boundary                                                 |
|   | save truth or marker + history + outbox + projection stale mark |
|   v                                                                 |
| Command result                                                       |
|   | return accepted / rejected / quarantined / duplicate surface    |
+====================================================================+
```

关键设计点：
- Command 只写本仓 observation truth、audit projection、body-free linkage、marker、history、outbox 或 stale marker。
- Command 输入中的 external material 必须先变成 ref / safe summary / visibility state,不能保存 raw body 或 evidence body。
- 详细设计继续定义幂等存储、transaction boundary、repository trait、错误码和 duplicate replay surface。

### 7.2 通用 Query 只读路径

```text
+====================================================================+
|                  Generic Observation Query Read Path                |
+====================================================================+
| Query request                                                       |
|   | validate ActorContext + QueryMetadata + visibility scope        |
|   v                                                                 |
| ObservationReadQueryService / DiagnosticViewService                 |
|   | ReadVisibilityPolicy.assert_can_read(                           |
|   |   DiagnosticRequestContext request_context,                     |
|   |   ReadVisibilityState visibility_state,                         |
|   |   ActorContext actor_context)                                   |
|   v                                                                 |
| Projection / read model / history repository                         |
|   | read only; no refresh; no repair; no source write                |
|   v                                                                 |
| Response assembler                                                   |
|   | return view + freshness + degraded + not-visible surface        |
+====================================================================+
```

关键设计点：
- Query 不刷新 reference snapshot,不重建 projection,不补 gap,不写 source truth。
- stale、missing、not-visible、unsafe、quarantined 或 blocked 必须显式进入 response surface。
- 详细设计继续定义分页、consistency hint、view assembler 字段和读取审计记录。

### 7.3 通用 Inbound Event Consumer 路径

```text
+====================================================================+
|              Generic Observation Inbound Consumer Path              |
+====================================================================+
| Inbound event envelope                                              |
|   | validate source event id + source ref + schema version          |
|   | validate dedup key + trace context + source family boundary     |
|   v                                                                 |
| Consumer application service                                         |
|   | map event to allowed ref / safe summary / input marker          |
|   | reject or quarantine forbidden body                             |
|   v                                                                 |
| Local observation boundary                                           |
|   | save receipt / projection input / snapshot / stale / gap marker |
|   v                                                                 |
| Consumer receipt                                                     |
|   | accepted / duplicate / delayed / rejected / quarantined surface |
+====================================================================+
```

关键设计点：
- Consumer 只写本仓本地投影输入、snapshot、marker 或 history,不能直接形成外部业务 truth。
- unsupported version、duplicate、body rejected 和 source unavailable 的完整处置留给详细设计。
- affected projection / gap / handoff 范围必须从 Step 07 映射反查,不能由实现临时拼接。

### 7.4 通用 Operations Job 维护路径

```text
+====================================================================+
|                 Generic Observation Operations Job Path             |
+====================================================================+
| Job input                                                           |
|   | JobMetadata + system/operator actor + job idempotency key       |
|   | scope / cursor / target / replay or handoff context             |
|   v                                                                 |
| DerivedMaintenanceService / specific job service                    |
|   | load committed observation facts, snapshots and markers         |
|   | DerivedMaintenancePolicy.assert_rebuild_allowed(                |
|   |   MaintenanceTargetRef target_ref,                              |
|   |   ProjectionMaintenanceState maintenance_state,                 |
|   |   ReplayScope replay_scope)                                     |
|   v                                                                 |
| Derived / snapshot / outbox / handoff store                          |
|   | write derived view, refresh record, delivery state or job report |
|   v                                                                 |
| Job report                                                           |
|   | expose changed refs, unresolved refs, failures and blocked refs |
+====================================================================+
```

关键设计点：
- Job 只维护 outbox、projection、rollup、snapshot、gap、handoff、export 和 progress。
- Job 失败不得回滚已提交 observation truth,也不得修复 source truth。
- 详细设计继续定义调度、cursor、retry、dead-letter、job report schema 和并发控制。

---

## 8. 按主要组成部分组织的关键处理流清单

| 主要组成部分 | 关键接口 | 处理流 |
|---|---|---|
| `Observation Intake and Safety` | `SubmitObservationMaterial`;`RecordSafetyDisposition`;`ConsumeBusObservationMaterial` | observation material intake / safety disposition flow |
| `Correlation and Safe Signal` | `BindCorrelationContext`;`RecordSafeSignal`;`ConsumeRuntimeSignalSummary`;`RebuildSignalRollups` | correlation binding and safe signal flow |
| `Audit Projection and Body-free Evidence Linkage` | `AppendAuditProjection`;`LinkBodyFreeEvidence`;`ConsumeSourceAuditMaterial`;`ConsumeArtifactEvidenceContext` | audit projection and body-free evidence flow |
| `Report Handoff and Authenticity` | `PrepareReportHandoff`;`EvaluateAuthenticityHint`;`PrepareReportHandoffDelivery` | report handoff and authenticity flow |
| `Retention, Replay and No-write Guard` | `SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation`;`CoordinateObservationReplay` | retention / replay / no-write guard flow |
| `Read Query and Diagnostic Consumption` | `GetObservationReadModel`;`GetDiagnosticView`;`RebuildObservationReadModels` | read query and diagnostic flow |
| `Gap and Degraded Expression` | `RecordGapState`;`GetGapStatus`;`ScanObservationGaps` | gap and degraded expression flow |
| `Peripheral Consumption and Export` | `PrepareExternalAuditExport`;`GetPeripheralExportView`;`RebuildPeripheralViews` | peripheral delivery and external export flow |
| `Product-neutral Adapter and Reference Support` | `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState`;`RefreshReferenceSnapshots`;external context consumers | reference snapshot and adapter flow |
| `Derived Maintenance and Replay Coordination` | `PublishObservationOutbox`;`RebuildObservationReadModels`;`RebuildSignalRollups`;`ScanObservationGaps`;`CoordinateObservationReplay`;`RebuildPeripheralViews` | derived maintenance and outbox publication flow |

---

## 9. 处理流覆盖清单

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| `SubmitObservationMaterial` | 是 | P0 write path,决定 observation truth 入口。 |
| `RecordSafetyDisposition` | 是 | 与 intake 同流,决定 redaction / quarantine / rejection。 |
| `BindCorrelationContext` | 是 | P0 write path,决定 correlation anchor。 |
| `RecordSafeSignal` | 是 | 与 correlation 同流,决定 safe log / metric / trace 观察事实。 |
| `AppendAuditProjection` | 是 | P0 write path,决定 audit projection。 |
| `LinkBodyFreeEvidence` | 是 | 与 audit 同流,决定 body-free evidence linkage。 |
| `PrepareReportHandoff` | 是 | P0 write path,决定 report handoff readiness。 |
| `EvaluateAuthenticityHint` | 是 | 与 handoff 同流,决定真实性提示和占位识别。 |
| `SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation` | 是 | retention / replay / no-write 是硬边界。 |
| `RecordGapState` | 是 | gap / degraded 是防止默认成功的关键状态。 |
| `PrepareExternalAuditExport` | 是 | 外围导出可能被误写成 truth owner,需独立收口。 |
| `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState` | 是 | 引用快照是外部 truth 隔离边界。 |
| `GetObservationReadModel`;`GetDiagnosticView`;`GetGapStatus`;`GetPeripheralExportView`;`GetEvidenceIndexInput` | 是 | 涉及 visibility、degraded、body-free、projection readiness 或 gap surface。 |
| 其他单对象 Query | 否 | 复用通用 Query 只读路径或所属处理流族。 |
| 所有 Inbound Event Consumer | 是 | 会改写本地 receipt / marker / snapshot / projection input,必须有 consumer 流口径。 |
| 所有 Outbound Event | 否 | 通过 `PublishObservationOutbox` 的统一 outbox publication flow 传播。 |
| 所有 Operations Job | 是 | 会影响查询一致性、传播可靠性、handoff / export 或 replay 可解释性。 |

---

## 10. 关键接口处理流

#### SubmitObservationMaterial / RecordSafetyDisposition 处理流

```text
+====================================================================+
|           SubmitObservationMaterial and Safety Disposition Flow     |
+====================================================================+
| SubmitObservationMaterial / ConsumeBusObservationMaterial           |
|   | ObservationSourceRef + safe summary hint + ActorContext         |
|   v                                                                 |
| ObservationIntakeService                                             |
|   | IntakeAdmissionPolicy.assert_admissible(                        |
|   |   ObservationSourceRef source_ref,                              |
|   |   SafeSummary safe_summary,                                     |
|   |   ActorContext actor_context)                                   |
|   v                                                                 |
| SafetyDispositionPolicy                                              |
|   | assert_redaction_safe(ObservationReceipt receipt,               |
|   |                       SafetyDisposition disposition,            |
|   |                       CommandMetadata command_metadata)          |
|   v                                                                 |
| ObservationReceipt + SafetyDisposition + IntakeDecisionRecord       |
|   | create accepted / rejected / quarantined / degraded receipt     |
|   v                                                                 |
| Intake store + outbox + gap stale marker                            |
|   | save receipt, disposition, history and status projection marker |
+====================================================================+
```

关键设计点：
- raw material body 不进入本仓;只允许 source ref、safe summary、redaction / quarantine disposition 进入。
- rejected / quarantined / degraded 不是失败静默丢弃,必须产生可审计 `IntakeDecisionRecord`。
- 详细设计继续定义幂等结果、forbidden body detection、quarantine receipt 和具体错误映射。

#### BindCorrelationContext / RecordSafeSignal 处理流

```text
+====================================================================+
|              Correlation Binding and Safe Signal Flow               |
+====================================================================+
| BindCorrelationContext / RecordSafeSignal / runtime summary event   |
|   | ObservationReceipt + CorrelationHintSet + SafeSignalCandidate   |
|   v                                                                 |
| CorrelationSignalService                                            |
|   | bind_context(ObservationReceipt receipt,                        |
|   |              CorrelationHintSet correlation_hints,              |
|   |              ActorContext actor_context)                        |
|   v                                                                 |
| SafeSignalPolicy                                                     |
|   | assert_signal_safe(CorrelationContext correlation_context,      |
|   |                    SafeSignalCandidate signal_candidate,        |
|   |                    RuntimeSandboxSignalRef runtime_ref)          |
|   v                                                                 |
| CorrelationContext + SafeSignal + SignalRollupWindow                |
|   | bind trace / causation refs; record safe signal; mark rollup     |
|   v                                                                 |
| Signal projection + correlation history                             |
|   | save signal, CorrelationLinkRecord and rollup stale marker      |
+====================================================================+
```

关键设计点：
- correlation id、trace id、causation id 和 source event ref 只能建立观察关联,不能反向定义业务 truth。
- safe signal 可承接 log / metric / trace 观察事实,但不保存原始 runtime / sandbox body。
- 详细设计可以把 `SafeSignal` 细分为 log / metric / trace DTO,但不得破坏统一安全信号主语。

#### AppendAuditProjection / LinkBodyFreeEvidence 处理流

```text
+====================================================================+
|          Audit Projection and Body-free Evidence Linkage Flow       |
+====================================================================+
| AppendAuditProjection / LinkBodyFreeEvidence / source audit event   |
|   | CorrelationContext + source audit ref + evidence ref summary    |
|   v                                                                 |
| AuditEvidenceService                                                 |
|   | load correlation, source audit ref and evidence visibility      |
|   v                                                                 |
| BodyFreeLinkagePolicy + EvidenceVisibilityPolicy                    |
|   | assert_body_free(GovernanceArtifactEvidenceReference ref,       |
|   |                  EvidenceLinkage linkage,                       |
|   |                  ActorContext actor_context)                    |
|   | assert_link_visible(EvidenceLinkage linkage,                    |
|   |                     ReadVisibilityState visibility_state,        |
|   |                     QueryMetadata query_metadata)                |
|   v                                                                 |
| AuditProjection + EvidenceLinkage + AuditAppendRecord               |
|   | append audit projection; create or block linkage                |
|   v                                                                 |
| Audit timeline + evidence index stale marker                        |
|   | save projection, linkage, history and handoff readiness marker  |
+====================================================================+
```

关键设计点：
- audit projection 是本仓观察投影,不拥有 Governance decision、Artifact lineage 或 evidence body。
- evidence linkage 只能保存 body-free ref、digest / visibility / source family 等概要骨架。
- 详细设计继续定义 linkage visibility、blocked reason、dedup key 和 projection builder 字段。

#### PrepareReportHandoff / EvaluateAuthenticityHint 处理流

```text
+====================================================================+
|              Report Handoff and Authenticity Evaluation Flow        |
+====================================================================+
| PrepareReportHandoff / EvaluateAuthenticityHint / handoff job      |
|   | EvidenceIndexInputView + GapStatusView + ReportConsumerRef      |
|   v                                                                 |
| ReportHandoffService                                                |
|   | HandoffReadinessPolicy.evaluate_readiness(                     |
|   |   EvidenceIndexInputView evidence_index_input,                  |
|   |   GapStatusView gap_status,                                     |
|   |   ReportConsumerRef consumer_ref)                               |
|   v                                                                 |
| AuthenticityHintPolicy                                               |
|   | evaluate_hint(ReportHandoffRecord handoff_record,              |
|   |               EvidenceLinkageSet evidence_links,                |
|   |               GapStateSet gap_states)                            |
|   v                                                                 |
| ReportHandoffRecord + AuthenticityHint + HandoffReadinessState      |
|   | prepare handoff; mark ready / blocked / pending / placeholder   |
|   v                                                                 |
| Handoff lifecycle + optional outbox marker                          |
|   | save lifecycle record and report handoff changed signal         |
+====================================================================+
```

关键设计点：
- handoff 只准备 report / archive / external audit 可消费的 body-free 输入,不生成 final verdict、signoff 或真实 evidence alias。
- authenticity hint 区分真实执行证据、待补齐材料、设计期占位和不可见材料。
- 详细设计继续定义 handoff receipt、consumer-specific envelope、failed marker 和 report schema。

#### Retention / Replay / No-write Guard 处理流

```text
+====================================================================+
|                 Retention, Replay and No-write Guard Flow           |
+====================================================================+
| SetRetentionMarker / DefineReplayScope / CoordinateObservationReplay|
|   | ProtectedObservationRef + MaintenanceTargetRef + replay context |
|   v                                                                 |
| RetentionReplayGuardService                                         |
|   | RetentionProtectionPolicy.assert_marker_allowed(               |
|   |   ProtectedObservationRef protected_ref,                        |
|   |   RetentionMarker marker,                                       |
|   |   ActorContext actor_context)                                   |
|   v                                                                 |
| NoWriteGuardPolicy                                                   |
|   | assert_no_source_write(MaintenanceTargetRef target_ref,         |
|   |                        NoWriteAttempt attempt,                  |
|   |                        ActorContext actor_context)               |
|   v                                                                 |
| RetentionMarker + ActiveReferenceProtection + ReplayScope           |
|   | hold / release / protect / define replay boundary               |
|   v                                                                 |
| NoWriteViolation / ReplayExecutionRecord / RetentionChangeRecord    |
|   | record blocked attempts, replay boundary and protection history |
+====================================================================+
```

关键设计点：
- retention marker 只标记本仓 observation material 生命周期,不删除 source truth 或 archive package。
- replay 只作用于 observation / projection side,不得修复 runtime、artifact、governance 或 identity truth。
- 详细设计继续定义 cleanup eligibility、active reference lookup、violation severity 和 replay idempotency。

#### GetObservationReadModel / GetDiagnosticView 处理流

```text
+====================================================================+
|                 Read Query and Diagnostic Consumption Flow          |
+====================================================================+
| GetObservationReadModel / GetDiagnosticView                         |
|   | DiagnosticRequestContext + ActorContext + QueryMetadata         |
|   v                                                                 |
| ObservationReadQueryService / DiagnosticViewService                 |
|   | load read scope, audit timeline, signal view and gap status     |
|   v                                                                 |
| ReadVisibilityPolicy + DegradedOutputPolicy                         |
|   | assert_can_read(DiagnosticRequestContext request_context,       |
|   |                 ReadVisibilityState visibility_state,           |
|   |                 ActorContext actor_context)                     |
|   v                                                                 |
| ObservationReadModel + DiagnosticView + ReadAccessRecord            |
|   | assemble body-free, redacted, freshness-aware read surface      |
|   v                                                                 |
| Query response                                                       |
|   | return view + diagnostic summary + stale / degraded markers     |
+====================================================================+
```

关键设计点：
- diagnostic 是 explain-only 读取面,不能下发控制命令、修复 source truth 或触发 replay。
- not-visible、unsafe、quarantined、stale、projection missing 必须显式返回,不能伪装成功。
- 详细设计继续定义 read access record 写入策略、pagination、projection freshness 和 response shape。

#### RecordGapState / ScanObservationGaps 处理流

```text
+====================================================================+
|                    Gap and Degraded Expression Flow                 |
+====================================================================+
| RecordGapState / GetGapStatus / ScanObservationGaps                 |
|   | GapSourceRef + ReferenceSnapshotState + visibility constraints |
|   v                                                                 |
| GapVisibilityService / GapScanJob                                   |
|   | load expected source refs, evidence refs and read visibility    |
|   v                                                                 |
| GapClassificationPolicy + DegradedOutputPolicy                      |
|   | classify_gap(GapSourceRef gap_source_ref,                       |
|   |              ReferenceSnapshotState reference_snapshot,         |
|   |              ReadVisibilityState visibility_state)              |
|   v                                                                 |
| GapState + DegradedOutputState + GapTransitionRecord                |
|   | record missing / unresolved / not-visible / unsafe / blocked    |
|   v                                                                 |
| GapStatusView + affected stale marker                               |
|   | update gap read surface and notify handoff / peripheral users   |
+====================================================================+
```

关键设计点：
- gap 是显式可审计状态,不是默认成功、默认失败或 source material 补造入口。
- degraded output 约束 read、handoff、peripheral export 和 diagnostic 输出。
- 详细设计继续定义 gap closure、escalation、scan cursor、classification enum 和 notification mapping。

#### PrepareExternalAuditExport / RebuildPeripheralViews 处理流

```text
+====================================================================+
|              Peripheral Delivery and External Export Flow           |
+====================================================================+
| PrepareExternalAuditExport / GetPeripheralExportView / rebuild job  |
|   | PeripheralConsumerRef + DashboardAlertExportView + export scope |
|   v                                                                 |
| PeripheralConsumptionService                                         |
|   | load read model, diagnostic view, gap status and handoff record |
|   v                                                                 |
| PeripheralExportPolicy                                               |
|   | assert_export_allowed(PeripheralConsumerRef consumer_ref,       |
|   |                       DashboardAlertExportView export_view,      |
|   |                       ActorContext actor_context)               |
|   v                                                                 |
| ExternalAuditExportPreparation + PeripheralDeliveryState            |
|   | prepare export / dashboard / alert material as body-free view   |
|   v                                                                 |
| PeripheralDeliveryRecord + delivery outbox marker                   |
|   | save prepared / blocked / retryable / failed delivery state     |
+====================================================================+
```

关键设计点：
- dashboard、alert、external audit / GRC 和 management report 都是只读消费面,不得成为 truth owner。
- export preparation 不能携带 evidence body、source body、final verdict 或 signoff。
- 详细设计继续定义 consumer-specific mapping、delivery receipt、retry policy 和 export schema。

#### RegisterReferenceSnapshot / RefreshReferenceSnapshots 处理流

```text
+====================================================================+
|              Reference Snapshot and Product-neutral Adapter Flow     |
+====================================================================+
| RegisterReferenceSnapshot / UpdateReferenceSnapshotState / refresh  |
|   | source ref + safe summary + freshness policy + JobMetadata      |
|   v                                                                 |
| ReferenceSnapshotService / ReferenceRefreshJob                      |
|   | load subject / evidence / runtime / archive refs and snapshots  |
|   v                                                                 |
| ReferenceFreshnessPolicy + AdapterBoundaryPolicy                    |
|   | assert_refresh_allowed(ReferenceSnapshotState snapshot_state,   |
|   |                        MaintenanceTargetRef target_ref,         |
|   |                        JobMetadata job_metadata)                |
|   v                                                                 |
| ReferenceSnapshotState + ReferenceSnapshotView                      |
|   | mark resolved / stale / unresolved / invalid / unavailable      |
|   v                                                                 |
| ReferenceRefreshRecord + affected gap / read stale markers          |
|   | save refresh history and notify gap / diagnostic surfaces       |
+====================================================================+
```

关键设计点：
- adapter / snapshot 只保存产品中立 ref、safe summary、freshness 和 resolution state,不保存外部正文。
- stale / unresolved / invalid 是正式 surface,不得静默降级为成功。
- 详细设计继续定义 external port、snapshot schema、refresh concurrency、source-specific adapter mapping。

#### PublishObservationOutbox / Derived Maintenance 处理流

```text
+====================================================================+
|             Outbox Publication and Derived Maintenance Flow          |
+====================================================================+
| PublishObservationOutbox / RebuildReadModels / RebuildSignalRollups |
|   | outbox cursor or maintenance target + JobMetadata               |
|   v                                                                 |
| DerivedMaintenanceService / OutboxPublisher                         |
|   | load committed observation facts, history, outbox and snapshots |
|   v                                                                 |
| DerivedMaintenancePolicy                                            |
|   | assert_rebuild_allowed(MaintenanceTargetRef target_ref,         |
|   |                        ProjectionMaintenanceState state,        |
|   |                        ReplayScope replay_scope)                |
|   v                                                                 |
| ProjectionMaintenanceState + RollupRebuildState + RebuildProgress   |
|   | publish outbox or rebuild read / diagnostic / rollup projections|
|   v                                                                 |
| ProjectionMaintenanceRecord + job report                            |
|   | record changed refs, unresolved refs, failed publication refs   |
+====================================================================+
```

关键设计点：
- publisher 只复制已提交 outbox payload snapshot,不得按 current projection 重算事件语义。
- rebuild 只从 committed observation facts、history、snapshot 和 safe summary 构造派生视图。
- 详细设计继续定义 cursor、batch、retry、partial failure、publication receipt 和 idempotent job report。

---

## 11. 接口到处理流族映射

| 接口组 | 处理流族 | 说明 |
|---|---|---|
| `SubmitObservationMaterial`;`RecordSafetyDisposition`;`ConsumeBusObservationMaterial`;`ConsumeSandboxSignalSummary` | intake / safety flow | sandbox summary 只作为 safety input marker,不带 execution body。 |
| `BindCorrelationContext`;`RecordSafeSignal`;`ConsumeRuntimeSignalSummary`;`GetSafeSignal`;`GetSignalRollup`;`RebuildSignalRollups` | correlation / safe signal flow | Query 走通用只读路径,rollup rebuild 复用 derived maintenance。 |
| `AppendAuditProjection`;`LinkBodyFreeEvidence`;`ConsumeSourceAuditMaterial`;`ConsumeGovernanceAuditContext`;`ConsumeArtifactEvidenceContext`;`GetAuditTimeline`;`GetEvidenceIndexInput` | audit / evidence linkage flow | evidence index input 读取 body-free linkage 和 gap surface。 |
| `PrepareReportHandoff`;`EvaluateAuthenticityHint`;`ConsumeArchiveHandoffFeedback`;`GetReportHandoff`;`PrepareReportHandoffDelivery` | report handoff flow | feedback 只改 lifecycle / delivery marker。 |
| `SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation`;`GetRetentionProtection`;`CoordinateObservationReplay` | retention / replay / no-write flow | retention query 只读,coordinate replay 只作用于 observation side。 |
| `GetObservationReadModel`;`GetDiagnosticView`;`RebuildObservationReadModels` | read / diagnostic flow | rebuild 复用 derived maintenance,但必须服务 read freshness。 |
| `RecordGapState`;`GetGapStatus`;`ScanObservationGaps`;`ConsumeReportConsumerFeedback` | gap / degraded flow | feedback 可产生 gap input marker,不反写 report truth。 |
| `PrepareExternalAuditExport`;`GetPeripheralExportView`;`RebuildPeripheralViews`;`ConsumeReportConsumerFeedback` | peripheral / export flow | external audit / GRC 只消费导出面。 |
| `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState`;`RefreshReferenceSnapshots`;all external context consumers | reference snapshot flow | external consumers 只更新 snapshot / stale / input marker。 |
| `PublishObservationOutbox`;all outbound events;all rebuild jobs | outbox / maintenance flow | outbound event 从 outbox 发布,job 不修复 truth。 |

---

## 12. 每个主要组成部分的处理流停审记录

| 主要组成部分 | 处理流承接 | 跨部分接缝 | 停审结论 |
|---|---|---|---|
| `Observation Intake and Safety` | intake / safety flow 已覆盖 receipt、disposition、history 和 status marker | 向 correlation、gap、read model 输出安全语境 | pass |
| `Correlation and Safe Signal` | correlation / safe signal flow 已覆盖 context、signal、rollup 和 history | 消费 intake,输出 audit / read / peripheral 观察线索 | pass |
| `Audit Projection and Body-free Evidence Linkage` | audit / evidence flow 已覆盖 projection、linkage、visibility 和 history | 消费 correlation 与 external evidence refs,输出 handoff / read | pass |
| `Report Handoff and Authenticity` | handoff flow 已覆盖 readiness、authenticity hint 和 lifecycle | 消费 evidence index 与 gap,输出 archive / external audit handoff | pass |
| `Retention, Replay and No-write Guard` | retention / replay / no-write flow 已覆盖 marker、protection、replay、violation | 约束 maintenance、handoff、query 和 export | pass |
| `Read Query and Diagnostic Consumption` | read / diagnostic flow 已覆盖 visibility、read model、diagnostic 和 response surface | 消费 audit、signal、gap、handoff,不写 source truth | pass |
| `Gap and Degraded Expression` | gap / degraded flow 已覆盖 classification、degraded surface、transition | 支撑 read、handoff、peripheral 和 maintenance | pass |
| `Peripheral Consumption and Export` | peripheral / export flow 已覆盖 delivery state、export preparation 和 consumer refs | 消费 read / diagnostic / handoff / gap,不反写 truth | pass |
| `Product-neutral Adapter and Reference Support` | reference snapshot flow 已覆盖 snapshot、freshness、resolution 和 refresh history | 为全部核心流提供 safe ref / summary,不拥有外部正文 | pass |
| `Derived Maintenance and Replay Coordination` | outbox / maintenance flow 已覆盖 publish、rebuild、refresh、scan、replay、progress | 维护派生面,受 no-write / replay boundary 约束 | pass |

---

## 13. 跨处理流一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| Step 07 的关键接口是否都有处理流口径 | pass | 已通过 §9 和 §11 覆盖 Command、Query、Consumer、Outbound Event 和 Job。 |
| 处理流点名对象是否都来自 Step 06 | pass | 主要对象均来自 Step 06;`SafeSummary`、`CorrelationHintSet`、`EvidenceLinkageSet` 等仅作为详细设计输入类型骨架。 |
| 是否存在 raw body / evidence body / source audit body 回流 | pass | intake、audit、handoff、export、reference flow 均显式 body-free / safe summary。 |
| Query 是否保持只读 | pass | 通用 Query 和 read / diagnostic flow 均禁止 refresh、repair、replay 和 source write。 |
| Consumer 是否绕过 Command 写核心 truth | pass | Consumer 只写 receipt / marker / projection input / snapshot / history。 |
| Job 是否修复 source truth | pass | Job 只维护 outbox、projection、snapshot、gap、handoff、export、progress。 |
| 是否出现 report handoff 伪造验收结果 | pass | handoff flow 明确不生成 final verdict、signoff、真实 evidence alias。 |
| 函数调用参数是否带类型名 | pass | §4.5 和处理流图中的函数骨架均使用 typed parameters。 |
| 是否滑入完整实现 | pass | 未写完整 DTO、Rust 签名、repository trait、SQL、错误码、retry 参数或测试用例。 |

---

## 14. Step 09 状态机移交门禁

Step 09 必须从本步处理流中提取状态主题,不得重新发明状态主语。

| Step 09 状态主题 | 来源处理流 | 必须回指对象 |
|---|---|---|
| intake lifecycle | intake / safety flow | `ObservationReceipt`;`SafetyDisposition` |
| correlation / safe signal lifecycle | correlation / safe signal flow | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow` |
| audit / evidence visibility lifecycle | audit / evidence flow | `AuditProjection`;`EvidenceLinkage` |
| handoff readiness / authenticity lifecycle | report handoff flow | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState` |
| retention / protection lifecycle | retention / replay / no-write flow | `RetentionMarker`;`ActiveReferenceProtection` |
| replay / no-write lifecycle | retention / replay / no-write flow; maintenance flow | `ReplayScope`;`NoWriteViolation`;`ReplayCoordinationState` |
| read visibility / diagnostic freshness lifecycle | read / diagnostic flow; maintenance flow | `ReadVisibilityState`;`DiagnosticSummary`;`ObservationReadModel`;`DiagnosticView` |
| gap / degraded lifecycle | gap / degraded flow | `GapState`;`DegradedOutputState` |
| peripheral delivery / export lifecycle | peripheral / export flow | `PeripheralDeliveryState`;`ExternalAuditExportPreparation` |
| reference freshness lifecycle | reference snapshot flow | `ReferenceSnapshotState`;`ReferenceSnapshotView` |
| maintenance / rebuild lifecycle | outbox / maintenance flow | `ProjectionMaintenanceState`;`RollupRebuildState`;`RebuildProgressView` |

进入 Step 09 的条件: 仅当用户确认后,Step 09 才能读取本文件并开始状态定义与状态流转;不得自动跨 Step,不得触碰正式 `02-概要设计.md`。

---

## 15. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §8 “关键处理流 / 重要函数数据流”引用本文件 §7 的通用 Command / Query / Consumer / Job 路径。
- §8 摘录本文件 §10 的 10 个关键处理流图,可在正式正文中压缩部分图后说明,但不得删除 redaction-first、body-free、no-write、degraded surface 和 job non-repair 边界。
- §8 保留本文件 §11 的接口到处理流族映射,避免正式文档逐接口重复同一图。
- §8 不新增 Step 08 未收稳的新接口、新对象或新状态。
- `03-详细设计.md` 继续定义正式 DTO、函数签名、repository / port、事务、异常分支、幂等、版本、错误码和测试切口。

---

## 16. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP08-001` | `SafeSummary`、`SafeSignalCandidate`、`CorrelationHintSet` 是否在详细设计中成为 DTO / value object | 当前只作为函数参数类型骨架,不在 Step 08 提前正式化为关键对象。 |
| `Q-HLD-STEP08-002` | `ReadAccessRecord` 是否由 Query 同步写入还是由审计侧异步生成 | 当前只声明读取审计关联,具体写入策略留给详细设计。 |
| `Q-HLD-STEP08-003` | `PublishObservationOutbox` 的 publication state 是否进入 Step 09 状态机 | 当前作为 maintenance / outbox publication 状态候选,Step 09 再判断是否独立成状态主题。 |
| `Q-HLD-STEP08-004` | `PrepareExternalAuditExport` 的 Command 与 Job 是否在详细设计改名区分 | 当前沿用 Step 07 分类差异,详细设计可重命名以降低实现歧义。 |

---

## 17. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 08 SOP、书写规范、Step 05~07、旧 Step 08 和 L1 参考粒度 | pass |
| 是否输出通用 Command / Query / Consumer / Job 路径 | pass |
| 是否为 P0 Command、写本地状态的 Consumer 和关键 Job 画独立处理流 | pass |
| 是否说明未逐接口展开的原因 | pass |
| 是否每个独立处理流都有 `text` 图和关键设计点 | pass |
| 是否点名关键函数骨架且参数包含类型名 | pass |
| 是否完成处理流到 10 个主要组成部分的归属停审 | pass |
| 是否保持 redaction-first、body-free、no-write 和不拥有业务 truth 边界 | pass |
| 是否未写完整 DTO schema、repository trait、事务脚本、SQL、错误码、retry 或测试细节 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 09 的上游 blocker | no |

---

## 18. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 8、概要书写规范 4.8、Step 05 主要组成部分、Step 06 关键对象、Step 07 接口骨架、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 08;旧 Step 08 已降级为 historical material | wait_user_confirmation_before_step_09 |
