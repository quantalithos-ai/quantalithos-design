# L4-observability 02-概要设计 Step 06 · 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 07

---

## 1. 本步目标

从 Step 05 已建立的对象候选池中正式筛出 `L4-observability` 在概要设计层必须点名的关键对象,并为这些对象给出所属部分、对象类型、关键字段骨架、状态集合、成员函数骨架、工厂函数骨架和禁止事项。

本步只收口“可实现结构骨架”,不写完整 Rust struct / enum、完整序列化 schema、repository trait、数据库表 / 索引、事件 payload、事务边界、缓存实现、调度参数或外部产品配置。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、redaction-first、body-free、只读 / no-write、留存约束和依赖裁剪硬边界。 |
| `projects/L4-observability/design-calibration/02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架、实现分层和 Step 06 不可越层的结构边界。 |
| `projects/L4-observability/design-calibration/02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、对象发现维度表、各部分对象线索和 Step 06 展开门禁。 |
| `projects/L4-observability/00-需求文档.md` §9~§11 | 当前正式需求基线 | 提供 `FR-OBS-001~013`、`BR-OBS-001~026`、`DO-OBS-001~034` 等对象存在理由和归属边界。 |
| `projects/L4-observability/01-架构设计.md` §4 / §6 / §9 / §10 | 当前正式架构基线 | 提供职责边界、子域划分、数据所有权、一致性和关键交互对对象的结构约束。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 6 | 约束本步必须按主要组成部分完成对象正式化,并产出单对象小节、对象筛选说明、停审记录和反查清单。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.6 | 约束本步必须独立成章、字段表为 `字段 / 类型 / 作用`,函数参数必须写 `TypeName param_name`。 |
| `projects/L1-governance/design-calibration/02_hld_step_06_key_objects*.md` | 已读取 | 作为“主控文件 + 多个对象附录 + 逐对象骨架”的粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_06_key_objects*.md` | 已读取 | 作为“对象正式化筛选 + 字段 / 状态 / 函数 / 禁止事项完整展开”的粒度参考。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_06_key_objects.md` | 已读取 | 仅作 historical material,识别其未按 Step 05 候选池正式筛选、缺少单对象小节和附录的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 06 标准、L1 对标和 Step 05 候选池 | done | 本文件 §2 |
| 回答对象正式化问题,先区分正式对象与非对象名 | done | 本文件 §4、§8.1 |
| 决定对象附录拆分方案,避免全仓大表压缩对象 | done | 本文件 §7、§8.3 |
| 按主要组成部分逐个完成对象正式化停审 | done | 本文件 §9 |
| 为 Step 8 / Step 9 建立反查清单 | done | 本文件 §10 |
| 完成跨对象 / 跨组成部分一致性审计 | done | 本文件 §11 |
| 完成附录对象骨架、回写 flow / 台账和自检 | done | 附录文件;本文件 §13~§16 |

---

## 4. SOP 问题回答

### 4.1 哪些对象如果不在概要设计层点名,后续详细设计最容易重新发明主语?

最不能留给 `03-详细设计` 现场发明的对象有 5 组:

1. 入口与安全主语:
   - `ObservationReceipt`
   - `SafetyDisposition`
   - `ObservationSourceRef`
   - `IntakeDecisionRecord`
2. 关联与运行观察主语:
   - `CorrelationContext`
   - `SafeSignal`
   - `SignalRollupWindow`
   - `RuntimeSandboxSignalRef`
3. 审计 / 证据 / 交接主语:
   - `AuditProjection`
   - `EvidenceLinkage`
   - `GovernanceArtifactEvidenceReference`
   - `ReportHandoffRecord`
   - `AuthenticityHint`
4. 留存 / no-write / 读侧主语:
   - `RetentionMarker`
   - `ActiveReferenceProtection`
   - `ReplayScope`
   - `NoWriteViolation`
   - `ReadVisibilityState`
   - `DiagnosticSummary`
   - `GapState`
5. 外围 / 引用 / 维护主语:
   - `PeripheralDeliveryState`
   - `ReferenceSnapshotState`
   - `ProjectionMaintenanceState`
   - `ReplayCoordinationState`
   - `MaintenanceTargetRef`

这些对象都直接承接 `FR-OBS-*`、`BR-OBS-*`、`DO-OBS-*` 中已成立的边界事实。如果不在 Step 06 点名,Step 07~09 很容易退化成接口名 / 处理流名 / 状态名驱动的临时对象拼装。

### 4.2 Step 05 的候选池中,哪些候选名称正式进入本步独立展开?

正式进入本步独立展开的对象分为 5 类:

| 类别 | 正式对象族 |
|---|---|
| Truth / State | `ObservationReceipt`;`SafetyDisposition`;`CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`AuditProjection`;`EvidenceLinkage`;`ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation`;`ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope`;`GapState`;`DegradedOutputState`;`PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`ReferenceSnapshotState`;`ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState` |
| Policy / Guard | `IntakeAdmissionPolicy`;`SafetyDispositionPolicy`;`SafeSignalPolicy`;`BodyFreeLinkagePolicy`;`EvidenceVisibilityPolicy`;`AuthenticityHintPolicy`;`HandoffReadinessPolicy`;`RetentionProtectionPolicy`;`ReplayBoundaryPolicy`;`NoWriteGuardPolicy`;`ReadVisibilityPolicy`;`GapClassificationPolicy`;`DegradedOutputPolicy`;`PeripheralExportPolicy`;`ReferenceFreshnessPolicy`;`AdapterBoundaryPolicy`;`DerivedMaintenancePolicy`;`ReplayCoordinationPolicy` |
| Projection / Read model | `IntakeStatusView`;`SafeSignalProjectionView`;`SignalRollupView`;`AuditTimelineView`;`EvidenceIndexInputView`;`ObservationReadModel`;`DiagnosticView`;`GapStatusView`;`DashboardAlertExportView`;`ReferenceSnapshotView`;`RebuildProgressView` |
| Reference / Boundary | `ObservationSourceRef`;`RuntimeSandboxSignalRef`;`ReportConsumerRef`;`ProtectedObservationRef`;`DiagnosticRequestContext`;`GapSourceRef`;`PeripheralConsumerRef`;`SubjectObservationReference`;`GovernanceArtifactEvidenceReference`;`RuntimeSandboxSummaryRef`;`ArchiveReportHandoffRef`;`MaintenanceTargetRef` |
| Audit / History | `IntakeDecisionRecord`;`CorrelationLinkRecord`;`AuditAppendRecord`;`HandoffLifecycleRecord`;`RetentionChangeRecord`;`NoWriteViolationRecord`;`ReadAccessRecord`;`GapTransitionRecord`;`PeripheralDeliveryRecord`;`ReferenceRefreshRecord`;`ProjectionMaintenanceRecord`;`GapScanRecord`;`ReplayExecutionRecord` |

### 4.3 哪些名称不应在 Step 06 被误写成关键对象?

以下名称本轮不独立成节,只作为字段类型、状态值、对象家族成员或 Step 07 / 详细设计输入:

| 名称 | 当前处理口径 |
|---|---|
| `MaterialAdmissionState` | 作为 `ObservationReceipt` 的状态集合,不单独成节。 |
| `CorrelationIntegrityPolicy` | 合并进 `CorrelationContext` 的不变量和 `SafeSignalPolicy`。 |
| `ActorSubjectObservationRef` | 作为 `CorrelationContext` 字段类型,不单独成节。 |
| `AuditProjectionVisibilityState` | 作为 `AuditProjection` 的状态语义,不单独成节。 |
| `GovernanceArtifactEvidenceRef` | 作为 `EvidenceLinkage` 字段类型;正式边界对象使用 `GovernanceArtifactEvidenceReference`。 |
| `ExternalAuditHandoffRef` | 作为 `ReportHandoffRecord` 的字段类型,不单独成节。 |
| `ArchiveEligibilityRef` | 作为 `RetentionMarker` 字段类型,不单独成节。 |
| `DiagnosticScopePolicy` | 合并进 `DiagnosticScope` 和 `ReadVisibilityPolicy`。 |
| `BlockedVisibilityState` | 合并进 `ReadVisibilityState` / `DegradedOutputState` 的状态集合。 |
| `QueryScopeRef` | 作为 `ReadVisibilityState` / `ObservationReadModel` 的字段类型。 |
| `VisibilityConstraintRef` | 作为 `GapState` / `ReadVisibilityState` 的字段类型。 |
| `ConsumerReadScopePolicy` | 合并进 `PeripheralExportPolicy`。 |
| `ExternalAuditConsumerRef`;`AlertConsumerRef` | 作为 `PeripheralConsumerRef` 的特化字段类型。 |
| `HandoffSummaryView`;`DiagnosticSummaryView`;`DegradationSummaryView`;`ManagementReportView`;`AdapterReadinessView`;`MaintenanceOutcomeView` | 作为已正式展开 projection 的消费者特化视图,不单独成节。 |
| `ExportPreparationRecord` | 合并进 `PeripheralDeliveryRecord` 的交付历史语义。 |
| `ReplayTargetRef` | 作为 `ReplayScope` / `ReplayCoordinationState` 的字段类型。 |
| repository / port / adapter / store 名称 | 留给 Step 07 和详细设计。 |
| DTO、request body、event payload、database table、raw backend record | 不作为领域对象展开。 |

### 4.4 本步字段 / 状态 / 函数骨架应该写到多深?

当前深度规则如下:

- 字段只写 `字段 | 类型 | 作用`,不写 Rust 字段声明、数据库列类型或 JSON schema。
- 状态只写状态名和作用,不写完整迁移矩阵;状态迁移留给 Step 09。
- 成员函数 / 工厂函数只写名称和 typed parameters,不写返回类型、泛型、生命周期和实现代码。
- reference object 只承接边界语义和 safe summary / resolution 语义,不承接外部 truth 正文。
- projection / read model 只表达只读承载面,不承接 source truth 和 write path。

### 4.5 本步最容易串线或越层的地方是什么?

最危险的越层点有:

1. 把 `SafeSignal` 写成 runtime / sandbox execution truth。
2. 把 `AuditProjection` 或 `EvidenceLinkage` 写成 Governance / Artifact 正文副本。
3. 把 `ReportHandoffRecord` 写成真实验收结论、真实 `run_id` 或真实 evidence alias。
4. 把 `ObservationReadModel` / `DiagnosticView` / `DashboardAlertExportView` 写成第二 observation truth。
5. 把 `ReplayScope`、`ProjectionMaintenanceState` 或 `NoWriteViolation` 写成 source truth 修复入口。

---

## 5. 当前文档问题诊断

| 旧材料 / 当前风险 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `design-calibration/02_hld_step_06_key_objects.md` | 只有一张粗糙概念表,没有从 Step 05 候选池正式筛选对象 | 重写为“主控文件 + 6 个对象附录”的结构 |
| 旧 Step 06 | 没有单对象小节,缺少字段 / 状态 / 函数 / 禁止事项 | 每个正式对象独立成节展开 |
| 旧 Step 06 | 没有逐主要组成部分停审 | 当前为 10 个组成部分逐个补对象正式化停审记录 |
| 旧 Step 06 | 把 schema 主题、平台主题和对象主语混写 | 当前严格按 Step 05 的对象候选池和主要组成部分回指 |
| 旧 Step 06 | 没有说明哪些名称只是字段类型或 Step 07 输入 | 当前补齐筛选说明和排除原因 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 对象来源 | 从旧 README / 旧正文抽词 | 只从 Step 05 候选池和 `00` / `01` 已收稳边界正式化 |
| 输出结构 | 单文件概念列表 | 主控文件 + 对象附录 + 逐对象骨架 |
| 对象深度 | 没有字段 / 状态 / 函数骨架 | 每个对象至少给出基本信息和禁止事项,并按需补字段 / 状态 / 函数 |
| 边界清晰度 | DTO / port / trigger / schema 心智混入 | 明确区分关键对象、字段类型和留给 Step 07 / 详细设计的主语 |
| 承接性 | Step 07~09 无稳定对象输入 | 反查清单已明确后续处理流和状态机要回指的对象 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 一张全仓对象总表 | 最短 | 无法满足“每个对象独立成节”,也无法提供字段 / 状态 / 函数骨架 | 不采用 |
| 方案 B: 只展开 truth / state,把 policy / projection / ref / history 全部留给后续 | 篇幅较短 | Step 07~09 会重新发明边界对象和读侧对象 | 不采用 |
| 方案 C: 主控文件负责筛选和停审,附录按对象类别逐个展开 | 粒度与 L1 参考对齐,也便于 Step 07~09 直接引用 | 文档较长,需要显式做跨对象审计 | 采用 |
| 方案 D: 把每个组成部分的对象继续嵌回 Step 05 | 组织主语单一 | 会打破“第 5 章按组成部分,第 6 章按对象”的组织轴 | 不采用 |

---

## 8. 结构化中间产物

### 8.1 对象候选池筛选说明

#### 8.1.1 正式关键对象

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `ObservationReceipt` | Truth / State | 正式关键对象 | 承接 `FR-OBS-001~003` 的准入事实和 `DO-OBS-001`。 |
| `SafetyDisposition` | Truth / State | 正式关键对象 | 承接安全处置和 `DO-OBS-002`。 |
| `IntakeAdmissionPolicy` | Policy / Invariant | 正式关键对象 | 承接 `BR-OBS-001`;`BR-OBS-003` 的准入不变量。 |
| `SafetyDispositionPolicy` | Policy / Invariant | 正式关键对象 | 承接 `BR-OBS-002`;`BR-OBS-005` 的安全处置边界。 |
| `IntakeStatusView` | Projection / Read model | 正式关键对象 | 是查询 / 诊断读取入口必须回指的 intake 读侧。 |
| `ObservationSourceRef` | Reference / Boundary | 正式关键对象 | 是所有观察面来源解释的正式边界对象。 |
| `IntakeDecisionRecord` | Audit / History | 正式关键对象 | 记录准入 / 拒绝 / 隔离的可审计变化。 |
| `CorrelationContext` | Truth / State | 正式关键对象 | 承接 `FR-OBS-002`;`FR-OBS-006` 的统一关联语境。 |
| `SafeSignal` | Truth / State | 正式关键对象 | 承接安全 log / metric / trace 观察事实。 |
| `SignalRollupWindow` | Truth / State | 正式关键对象 | 为 rollup / rebuild / read model 提供正式窗口主语。 |
| `SafeSignalPolicy` | Policy / Invariant | 正式关键对象 | 限制 signal 如何成为安全观察输出。 |
| `SafeSignalProjectionView` | Projection / Read model | 正式关键对象 | 是 read / diagnostic / peripheral 的统一 signal 读侧。 |
| `SignalRollupView` | Projection / Read model | 正式关键对象 | 是指标 / 追踪聚合解释的正式只读承载。 |
| `RuntimeSandboxSignalRef` | Reference / Boundary | 正式关键对象 | 承接 runtime / sandbox 安全观察来源。 |
| `CorrelationLinkRecord` | Audit / History | 正式关键对象 | 审计关联语境的建立、失效和降级。 |
| `AuditProjection` | Truth / State | 正式关键对象 | 承接 `FR-OBS-004` 和 `DO-OBS-009`。 |
| `EvidenceLinkage` | Truth / State | 正式关键对象 | 承接 `FR-OBS-005` 和 `DO-OBS-010`。 |
| `BodyFreeLinkagePolicy` | Policy / Invariant | 正式关键对象 | 防止 evidence / artifact body 回流。 |
| `EvidenceVisibilityPolicy` | Policy / Invariant | 正式关键对象 | 防止 not-visible / blocked 被写成默认成功。 |
| `AuditTimelineView` | Projection / Read model | 正式关键对象 | 是报告、审查和追溯的 canonical audit 读侧。 |
| `EvidenceIndexInputView` | Projection / Read model | 正式关键对象 | 是 report handoff 的正式输入读侧。 |
| `GovernanceArtifactEvidenceReference` | Reference / Boundary | 正式关键对象 | 承接 governance / artifact / evidence 的 body-free 跨域引用。 |
| `AuditAppendRecord` | Audit / History | 正式关键对象 | 记录 audit projection 的追加变化。 |
| `ReportHandoffRecord` | Truth / State | 正式关键对象 | 承接 `FR-OBS-010` 和 `DO-OBS-023`。 |
| `AuthenticityHint` | Truth / State | 正式关键对象 | 承接 `FR-OBS-011` 和 `DO-OBS-025`。 |
| `HandoffReadinessState` | Truth / State | 正式关键对象 | Step 07/08/09 必须回指的 readiness 主语。 |
| `AuthenticityHintPolicy` | Policy / Invariant | 正式关键对象 | 防止设计期占位被误当真实证据。 |
| `HandoffReadinessPolicy` | Policy / Invariant | 正式关键对象 | 承接 handoff ready / blocked / pending 判断。 |
| `ReportConsumerRef` | Reference / Boundary | 正式关键对象 | 是 report / acceptance / archive 消费边界的正式主语。 |
| `HandoffLifecycleRecord` | Audit / History | 正式关键对象 | 记录 handoff 状态变化和消费结果。 |
| `RetentionMarker` | Truth / State | 正式关键对象 | 承接 `FR-OBS-012` 和 `DO-OBS-028`。 |
| `ActiveReferenceProtection` | Truth / State | 正式关键对象 | 承接 `DO-OBS-029` 的活动引用保护。 |
| `ReplayScope` | Truth / State | 正式关键对象 | 承接 `FR-OBS-013` 的重放范围边界。 |
| `NoWriteViolation` | Truth / State | 正式关键对象 | 承接 `DO-OBS-031` 的违例事实。 |
| `RetentionProtectionPolicy` | Policy / Invariant | 正式关键对象 | 限制 hold / release / archive eligibility。 |
| `ReplayBoundaryPolicy` | Policy / Invariant | 正式关键对象 | 限制 replay / rebuild 只影响 observation side。 |
| `NoWriteGuardPolicy` | Policy / Invariant | 正式关键对象 | 阻断 query / diagnostic / maintenance / export 写源。 |
| `ProtectedObservationRef` | Reference / Boundary | 正式关键对象 | 是留存保护和 replay 范围的正式边界对象。 |
| `RetentionChangeRecord` | Audit / History | 正式关键对象 | 记录 hold / release / conflict 显式变化。 |
| `NoWriteViolationRecord` | Audit / History | 正式关键对象 | 记录 no-write 违例的审计轨迹。 |
| `ReadVisibilityState` | Truth / State | 正式关键对象 | 承接只读查询的可见性真相。 |
| `DiagnosticSummary` | Truth / State | 正式关键对象 | 是 explain-only 诊断主语,不只是视图文本。 |
| `DiagnosticScope` | Truth / State | 正式关键对象 | 为诊断和 handoff 范围提供正式边界。 |
| `ReadVisibilityPolicy` | Policy / Invariant | 正式关键对象 | 承接 `BR-OBS-013`;`BR-OBS-015`。 |
| `ObservationReadModel` | Projection / Read model | 正式关键对象 | 是 Step 07 查询接口和 Step 08 查询流的 canonical read model。 |
| `DiagnosticView` | Projection / Read model | 正式关键对象 | 是 diagnostic 读取面的 canonical view。 |
| `DiagnosticRequestContext` | Reference / Boundary | 正式关键对象 | 诊断读取边界和 no-write 审计都需要此上下文对象。 |
| `ReadAccessRecord` | Audit / History | 正式关键对象 | 记录可见性判断和读取行为。 |
| `GapState` | Truth / State | 正式关键对象 | 承接 `FR-OBS-007` 和 `DO-OBS-018`。 |
| `DegradedOutputState` | Truth / State | 正式关键对象 | 把 degraded / blocked / partial 输出正式化。 |
| `GapClassificationPolicy` | Policy / Invariant | 正式关键对象 | 区分 missing / unresolved / not-visible / unsafe。 |
| `DegradedOutputPolicy` | Policy / Invariant | 正式关键对象 | 限制何时只能输出 degraded / blocked 语义。 |
| `GapStatusView` | Projection / Read model | 正式关键对象 | 是诊断、handoff 和外围消费共享的 gap 读侧。 |
| `GapSourceRef` | Reference / Boundary | 正式关键对象 | 让 gap 能回指来源而不吸收正文。 |
| `GapTransitionRecord` | Audit / History | 正式关键对象 | 记录 gap 的发现、恢复和升级。 |
| `PeripheralDeliveryState` | Truth / State | 正式关键对象 | 承接外围消费与导出的交付状态。 |
| `ExternalAuditExportPreparation` | Truth / State | 正式关键对象 | 是外部导出准备态,不能退化成临时 view。 |
| `PeripheralExportPolicy` | Policy / Invariant | 正式关键对象 | 限制 dashboard / alert / GRC / report 的只读消费边界。 |
| `DashboardAlertExportView` | Projection / Read model | 正式关键对象 | 是外围消费的 canonical read surface。 |
| `PeripheralConsumerRef` | Reference / Boundary | 正式关键对象 | 表达 dashboard / alert / GRC / analysis 消费边界。 |
| `PeripheralDeliveryRecord` | Audit / History | 正式关键对象 | 记录外围消费准备、发送、失败和撤销。 |
| `ReferenceSnapshotState` | Truth / State | 正式关键对象 | 承接外部引用快照的 freshness / resolution truth。 |
| `ReferenceFreshnessPolicy` | Policy / Invariant | 正式关键对象 | 限制 stale / unresolved / invalid snapshot 的处理。 |
| `AdapterBoundaryPolicy` | Policy / Invariant | 正式关键对象 | 防止具名产品或外部正文穿透核心。 |
| `ReferenceSnapshotView` | Projection / Read model | 正式关键对象 | 为 read / maintenance / gap 提供 canonical snapshot 读侧。 |
| `SubjectObservationReference` | Reference / Boundary | 正式关键对象 | 承接 actor / subject / governed entity 的观察引用。 |
| `RuntimeSandboxSummaryRef` | Reference / Boundary | 正式关键对象 | 承接 runtime / sandbox safe summary 边界。 |
| `ArchiveReportHandoffRef` | Reference / Boundary | 正式关键对象 | 承接 archive / report / external audit 的交接引用边界。 |
| `ReferenceRefreshRecord` | Audit / History | 正式关键对象 | 记录外部引用刷新和 resolution 变化。 |
| `ProjectionMaintenanceState` | Truth / State | 正式关键对象 | 是 projection rebuild / refresh 的正式状态主语。 |
| `ReplayCoordinationState` | Truth / State | 正式关键对象 | 是 replay 协调和 no-write 审批的正式主语。 |
| `RollupRebuildState` | Truth / State | 正式关键对象 | 是 rollup rebuild 的正式状态主语。 |
| `DerivedMaintenancePolicy` | Policy / Invariant | 正式关键对象 | 限制 maintenance 只能作用于观察面和派生面。 |
| `ReplayCoordinationPolicy` | Policy / Invariant | 正式关键对象 | 限制 replay 的批准、阻塞和影响解释。 |
| `RebuildProgressView` | Projection / Read model | 正式关键对象 | 是维护 / replay / gap scan 对外解释的 canonical progress view。 |
| `MaintenanceTargetRef` | Reference / Boundary | 正式关键对象 | 为 rebuild / refresh / replay 提供正式 target 边界。 |
| `ProjectionMaintenanceRecord` | Audit / History | 正式关键对象 | 记录 projection maintenance 的执行与结果。 |
| `GapScanRecord` | Audit / History | 正式关键对象 | 记录 gap scan 的触发、发现和关闭。 |
| `ReplayExecutionRecord` | Audit / History | 正式关键对象 | 记录 replay 的边界、执行和影响。 |

#### 8.1.2 不独立展开的候选名称

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `MaterialAdmissionState` | Truth / State | 只作状态集合 | 已并入 `ObservationReceipt`。 |
| `SubmissionPurposeRef` | Reference / Boundary | 只作字段类型 | 是 intake purpose 的窄字段语义。 |
| `CorrelationIntegrityPolicy` | Policy / Invariant | 合并处理 | 已并入 `CorrelationContext` / `SafeSignalPolicy`。 |
| `ActorSubjectObservationRef` | Reference / Boundary | 只作字段类型 | 作为 `CorrelationContext` 的引用字段足够。 |
| `AuditProjectionVisibilityState` | Truth / State | 只作状态集合 | 已并入 `AuditProjection`。 |
| `GovernanceArtifactEvidenceRef` | Reference / Boundary | 只作字段类型 | 被 `GovernanceArtifactEvidenceReference` 取代为正式边界对象。 |
| `HandoffSummaryView` | Projection / Read model | 合并处理 | 已并入 `EvidenceIndexInputView` 和 `ReportHandoffRecord` 的状态解释。 |
| `ExternalAuditHandoffRef` | Reference / Boundary | 只作字段类型 | 被 `ReportConsumerRef` / `ArchiveReportHandoffRef` 统一承接。 |
| `ArchiveEligibilityRef` | Reference / Boundary | 只作字段类型 | 作为 `RetentionMarker` 的字段足够。 |
| `DiagnosticScopePolicy` | Policy / Invariant | 合并处理 | 已并入 `DiagnosticScope` / `ReadVisibilityPolicy`。 |
| `DiagnosticSummaryView` | Projection / Read model | 合并处理 | 已并入 `DiagnosticView`。 |
| `BlockedVisibilityState` | Truth / State | 只作状态集合 | 已并入 `ReadVisibilityState` / `DegradedOutputState`。 |
| `DegradationSummaryView` | Projection / Read model | 合并处理 | 已并入 `GapStatusView`。 |
| `QueryScopeRef` | Reference / Boundary | 只作字段类型 | 是 query scope 的窄字段类型。 |
| `VisibilityConstraintRef` | Reference / Boundary | 只作字段类型 | 作为 gap / read visibility 的字段足够。 |
| `ConsumerReadScopePolicy` | Policy / Invariant | 合并处理 | 已并入 `PeripheralExportPolicy`。 |
| `ManagementReportView` | Projection / Read model | 合并处理 | 是 `DashboardAlertExportView` 的消费特化。 |
| `AnalysisMaterialView` | Projection / Read model | 合并处理 | 是 `DashboardAlertExportView` 的消费特化。 |
| `ExternalAuditConsumerRef` | Reference / Boundary | 只作字段类型 | 是 `PeripheralConsumerRef` 的特化字段类型。 |
| `AlertConsumerRef` | Reference / Boundary | 只作字段类型 | 是 `PeripheralConsumerRef` 的特化字段类型。 |
| `AdapterReadinessView` | Projection / Read model | 合并处理 | 是 `ReferenceSnapshotView` 的 readiness 子视图。 |
| `ReplayTargetRef` | Reference / Boundary | 只作字段类型 | 已并入 `ReplayScope` / `ReplayCoordinationState`。 |
| `MaintenanceOutcomeView` | Projection / Read model | 合并处理 | 是 `RebuildProgressView` 的 outcome 子视图。 |
| `ExportPreparationRecord` | Audit / History | 合并处理 | 已并入 `PeripheralDeliveryRecord` 的导出生命周期。 |
| repository / port / store / adapter / outbox 名称 | 实现主体 | 留给 Step 07 / 详细设计 | 它们不是 Step 06 的领域对象主语。 |
| DTO / request / result / database table / raw provider record | 实现细节 | 不进入 Step 06 | 不承接概要对象责任。 |

### 8.2 关键对象与主要组成部分分布

| 主要组成部分 | 关键对象 |
|---|---|
| `Observation Intake and Safety` | `ObservationReceipt`;`SafetyDisposition`;`IntakeAdmissionPolicy`;`SafetyDispositionPolicy`;`IntakeStatusView`;`ObservationSourceRef`;`IntakeDecisionRecord` |
| `Correlation and Safe Signal` | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`SafeSignalPolicy`;`SafeSignalProjectionView`;`SignalRollupView`;`RuntimeSandboxSignalRef`;`CorrelationLinkRecord` |
| `Audit Projection and Body-free Evidence Linkage` | `AuditProjection`;`EvidenceLinkage`;`BodyFreeLinkagePolicy`;`EvidenceVisibilityPolicy`;`AuditTimelineView`;`EvidenceIndexInputView`;`GovernanceArtifactEvidenceReference`;`AuditAppendRecord` |
| `Report Handoff and Authenticity` | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`AuthenticityHintPolicy`;`HandoffReadinessPolicy`;`ReportConsumerRef`;`HandoffLifecycleRecord` |
| `Retention, Replay and No-write Guard` | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation`;`RetentionProtectionPolicy`;`ReplayBoundaryPolicy`;`NoWriteGuardPolicy`;`ProtectedObservationRef`;`RetentionChangeRecord`;`NoWriteViolationRecord` |
| `Read Query and Diagnostic Consumption` | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope`;`ReadVisibilityPolicy`;`ObservationReadModel`;`DiagnosticView`;`DiagnosticRequestContext`;`ReadAccessRecord` |
| `Gap and Degraded Expression` | `GapState`;`DegradedOutputState`;`GapClassificationPolicy`;`DegradedOutputPolicy`;`GapStatusView`;`GapSourceRef`;`GapTransitionRecord` |
| `Peripheral Consumption and Export` | `PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`PeripheralExportPolicy`;`DashboardAlertExportView`;`PeripheralConsumerRef`;`PeripheralDeliveryRecord` |
| `Product-neutral Adapter and Reference Support` | `ReferenceSnapshotState`;`ReferenceFreshnessPolicy`;`AdapterBoundaryPolicy`;`ReferenceSnapshotView`;`SubjectObservationReference`;`GovernanceArtifactEvidenceReference`;`RuntimeSandboxSummaryRef`;`ArchiveReportHandoffRef`;`ReferenceRefreshRecord` |
| `Derived Maintenance and Replay Coordination` | `ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState`;`DerivedMaintenancePolicy`;`ReplayCoordinationPolicy`;`RebuildProgressView`;`MaintenanceTargetRef`;`ProjectionMaintenanceRecord`;`GapScanRecord`;`ReplayExecutionRecord` |

### 8.3 对象附录文件

本步对象数量已经超过单文件可维护上限。为保持 Step 06 既达到 `L1-governance` / `L1-artifact` 粒度,又不把主控文件膨胀成不可审查长表,当前拆成以下 7 个文件:

| 文件 | 内容 |
|---|---|
| `02_hld_step_06_key_objects.md` | 对象筛选说明、对象分布、停审记录、反查清单和一致性审计 |
| `02_hld_step_06_key_objects_truth_signal_audit.md` | intake / safety / correlation / signal / audit / handoff 主线对象骨架 |
| `02_hld_step_06_key_objects_truth_guard_consumption.md` | retention / no-write / read / diagnostic / gap / peripheral / snapshot / maintenance 状态对象骨架 |
| `02_hld_step_06_key_objects_policies.md` | policy / invariant / guard 对象骨架 |
| `02_hld_step_06_key_objects_projections.md` | canonical projection / read model 对象骨架 |
| `02_hld_step_06_key_objects_references.md` | reference / boundary / context 对象骨架 |
| `02_hld_step_06_key_objects_history_records.md` | audit / history / change / execution record 对象骨架 |

正式 `02-概要设计.md` 后续只摘录对象筛选说明、对象分布和核心对象摘要,不会机械粘贴全部附录。

---

## 9. 每个主要组成部分的对象正式化停审记录

| 主要组成部分 | 正式对象化结论 | 字段类型 / 排除名称处理 | 停审结果 |
|---|---|---|---|
| `Observation Intake and Safety` | 已形成 receipt / disposition / policy / source ref / history 组合 | `MaterialAdmissionState`;`SubmissionPurposeRef` 降为字段 / 状态类型 | pass |
| `Correlation and Safe Signal` | 已形成 correlation / signal / rollup / policy / runtime ref / history 组合 | `CorrelationIntegrityPolicy`;`ActorSubjectObservationRef` 不独立成节 | pass |
| `Audit Projection and Body-free Evidence Linkage` | 已形成 audit / linkage / visibility policy / reference / history 组合 | `GovernanceArtifactEvidenceRef` 降为字段类型 | pass |
| `Report Handoff and Authenticity` | 已形成 handoff / authenticity / readiness / policy / consumer ref / history 组合 | `ExternalAuditHandoffRef`;`HandoffSummaryView` 不独立成节 | pass |
| `Retention, Replay and No-write Guard` | 已形成 retention / protection / replay scope / violation / policy / history 组合 | `ArchiveEligibilityRef` 降为字段类型 | pass |
| `Read Query and Diagnostic Consumption` | 已形成 visibility / diagnostic / read model / request context / history 组合 | `DiagnosticScopePolicy`;`DiagnosticSummaryView`;`QueryScopeRef` 不独立成节 | pass |
| `Gap and Degraded Expression` | 已形成 gap / degraded / policy / view / source ref / history 组合 | `BlockedVisibilityState`;`VisibilityConstraintRef`;`DegradationSummaryView` 不独立成节 | pass |
| `Peripheral Consumption and Export` | 已形成 delivery / export preparation / export policy / canonical view / consumer ref / history 组合 | `ConsumerReadScopePolicy`;`ManagementReportView`;`AnalysisMaterialView`;`ExternalAuditConsumerRef`;`AlertConsumerRef`;`ExportPreparationRecord` 不独立成节 | pass |
| `Product-neutral Adapter and Reference Support` | 已形成 snapshot / freshness / adapter boundary / canonical view / cross-domain refs / history 组合 | `AdapterReadinessView` 不独立成节 | pass |
| `Derived Maintenance and Replay Coordination` | 已形成 maintenance / replay / rebuild / maintenance policy / target ref / execution history 组合 | `ReplayTargetRef`;`MaintenanceOutcomeView` 不独立成节 | pass |

---

## 10. Step 8 / Step 9 反查清单

### 10.1 Step 8 关键处理流反查

| 预计处理流 | 必须能反查到的对象 |
|---|---|
| observation material intake / reject / quarantine / degrade | `ObservationReceipt`;`SafetyDisposition`;`IntakeAdmissionPolicy`;`SafetyDispositionPolicy`;`ObservationSourceRef`;`IntakeDecisionRecord` |
| correlation binding and safe signal projection | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`SafeSignalPolicy`;`RuntimeSandboxSignalRef`;`CorrelationLinkRecord` |
| audit projection append and body-free evidence linkage | `AuditProjection`;`EvidenceLinkage`;`BodyFreeLinkagePolicy`;`EvidenceVisibilityPolicy`;`GovernanceArtifactEvidenceReference`;`AuditAppendRecord` |
| report handoff preparation and authenticity evaluation | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`AuthenticityHintPolicy`;`HandoffReadinessPolicy`;`ReportConsumerRef`;`HandoffLifecycleRecord` |
| retention hold / release / active reference protection | `RetentionMarker`;`ActiveReferenceProtection`;`RetentionProtectionPolicy`;`ProtectedObservationRef`;`RetentionChangeRecord` |
| replay / rebuild / no-write guard | `ReplayScope`;`NoWriteViolation`;`ReplayBoundaryPolicy`;`NoWriteGuardPolicy`;`ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState`;`ProjectionMaintenanceRecord`;`ReplayExecutionRecord` |
| read query / visibility / diagnostic summary | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope`;`ReadVisibilityPolicy`;`ObservationReadModel`;`DiagnosticView`;`DiagnosticRequestContext`;`ReadAccessRecord` |
| gap / degraded / blocked surface expression | `GapState`;`DegradedOutputState`;`GapClassificationPolicy`;`DegradedOutputPolicy`;`GapStatusView`;`GapSourceRef`;`GapTransitionRecord` |
| peripheral delivery / external export preparation | `PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`PeripheralExportPolicy`;`DashboardAlertExportView`;`PeripheralConsumerRef`;`PeripheralDeliveryRecord` |
| reference refresh / snapshot resolution / adapter neutrality | `ReferenceSnapshotState`;`ReferenceFreshnessPolicy`;`AdapterBoundaryPolicy`;`ReferenceSnapshotView`;`SubjectObservationReference`;`GovernanceArtifactEvidenceReference`;`RuntimeSandboxSummaryRef`;`ArchiveReportHandoffRef`;`ReferenceRefreshRecord` |

### 10.2 Step 9 状态机反查

| 状态主题 | Step 06 对象来源 |
|---|---|
| intake lifecycle | `ObservationReceipt`;`SafetyDisposition` |
| correlation / safe signal lifecycle | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow` |
| audit visibility / evidence linkage lifecycle | `AuditProjection`;`EvidenceLinkage` |
| handoff readiness / delivery lifecycle | `ReportHandoffRecord`;`HandoffReadinessState`;`PeripheralDeliveryState`;`ExternalAuditExportPreparation` |
| retention / protection / release lifecycle | `RetentionMarker`;`ActiveReferenceProtection` |
| replay / no-write lifecycle | `ReplayScope`;`NoWriteViolation`;`ReplayCoordinationState`;`RollupRebuildState`;`ProjectionMaintenanceState` |
| read visibility / diagnostic freshness lifecycle | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope`;`ObservationReadModel`;`DiagnosticView` |
| gap / degraded lifecycle | `GapState`;`DegradedOutputState` |
| reference freshness / resolution lifecycle | `ReferenceSnapshotState`;`ReferenceSnapshotView` |
| maintenance execution lifecycle | `ProjectionMaintenanceState`;`GapScanRecord`;`ReplayExecutionRecord`;`ReferenceRefreshRecord` |

---

## 11. 跨对象 / 跨组成部分一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在 source truth / external body 回流为对象主语 | pass | external body 一律通过 ref / summary / snapshot 进入,未形成外部正文对象。 |
| 是否存在 projection / read model 冒充 truth owner | pass | `ObservationReadModel`、`DiagnosticView`、`DashboardAlertExportView` 等均保持只读承载。 |
| 是否存在 report handoff 冒充真实验收结论 | pass | `ReportHandoffRecord` 与 `AuthenticityHint` 已明确不得生成真实 `run_id`、evidence alias、signoff。 |
| 是否存在 retention / replay / maintenance 越权修复 source truth | pass | `ReplayBoundaryPolicy`、`NoWriteGuardPolicy`、`DerivedMaintenancePolicy` 已收住边界。 |
| 是否存在引用对象与字段类型重复建模 | pass | 已把 `GovernanceArtifactEvidenceRef`、`ReplayTargetRef` 等降为字段类型,保留 canonical boundary object。 |
| Step 08 / Step 09 是否会引用未定义对象 | pass | 反查清单已覆盖当前正式对象。 |
| 是否下沉到完整 schema / DDL / implementation | pass | 当前只停在概要骨架层。 |

---

## 12. Step 07 展开门禁

| 门禁项 | 结果 |
|---|---|
| 已从 Step 05 候选池完成对象正式化筛选 | pass |
| 每个正式对象都能回指至少一个主要组成部分 capability | pass |
| 未来可能成为正式代码主体的对象没有被压缩成对象组 | pass |
| DTO / port / repository / trigger / raw backend record 已被排除出 Step 06 | pass |
| Step 08 / Step 09 要使用的对象都能在本步找到定义 | pass |
| 字段 / 函数 / 状态仍停在概要骨架层,未滑入详细设计 | pass |

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §6 “关键对象轮廓”引用本文件 §8.1 的对象筛选说明和 §8.2 的对象分布表。
- 正文只摘录核心对象摘要:
  - `ObservationReceipt`
  - `SafetyDisposition`
  - `CorrelationContext`
  - `SafeSignal`
  - `AuditProjection`
  - `EvidenceLinkage`
  - `ReportHandoffRecord`
  - `RetentionMarker`
  - `ReadVisibilityState`
  - `DiagnosticSummary`
  - `GapState`
  - `ReferenceSnapshotState`
  - `ProjectionMaintenanceState`
- policy / projection / reference / history 的详细骨架保留在 Step 06 附录。
- Step 07~09 只能引用本步已正式化对象,不得重新发明对象主语。

---

## 14. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP06-001` | `SafeSignal` 是否在详细设计层继续细分为 log / metric / trace 三个正式对象 | 当前先以统一关键对象承接,后续 `03-详细设计` 再按不会破坏 Step 06 主语的前提细分。 |
| `Q-HLD-STEP06-002` | `ExternalAuditExportPreparation` 最终是 state object 还是 projection object | 当前按 `truth/state` 承接,因为其 ready / blocked / retryable 语义会直接进入 Step 09。 |
| `Q-HLD-STEP06-003` | `GovernanceArtifactEvidenceReference` 是否需要在后续细分 artifact / evidence / governance 三种 reference 子型 | 当前先保留统一 cross-domain boundary object,后续详细设计再做类型拆分。 |

---

## 15. 自检

| 检查项 | 结果 |
|---|---|
| 是否先从 Step 05 候选池筛选,而不是现场发明对象 | pass |
| 是否按对象独立成节,而不是只保留对象总表 | pass |
| 是否区分了正式对象、字段类型和留给 Step 07 / 详细设计的名称 | pass |
| 是否为后续 Step 8 / Step 9 建立了反查清单 | pass |
| 是否完成了每个主要组成部分的对象正式化停审 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 07 的上游 blocker | no |

---

## 16. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 6、概要书写规范 4.6、新版 `00`、新版 `01`、Step 03~05 当前产物和 L1 参考粒度重建 Step 06;旧 Step 06 已降级为 historical material | wait_user_confirmation_before_step_07 |
