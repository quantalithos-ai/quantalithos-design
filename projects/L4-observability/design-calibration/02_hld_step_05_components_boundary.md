# L4-observability 02-概要设计 Step 05 · 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 06

---

## 1. 本步目标

在 Step 04 已明确“业务主要组成部分”和“实现分层”是两条不同组织轴的前提下,收稳 `L4-observability` 的主要组成部分、各自职责、不承担职责、包含的代码主体 / 模块和对象发现线索。

本步建立 Step 06 的对象候选池,但不展开关键对象的字段骨架、成员函数骨架、工厂函数骨架、接口 schema、repository 函数、事务细节、数据库结构或实现流程。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、redaction-first、body-free、只读 / no-write、留存分层和依赖裁剪硬约束。 |
| `projects/L4-observability/design-calibration/02_hld_step_04_code_subject_framework.md` | 已完成 | 提供 10 个业务主要组成部分、代码主体骨架和实现分层区分。 |
| `projects/L4-observability/00-需求文档.md` §9~§12 | 当前正式需求基线 | 提供 `C-OBS-1~5`、`FR-OBS-001~013`、规则边界、数据归属和接口 / 依赖边界。 |
| `projects/L4-observability/01-架构设计.md` §4 / §6 / §7 / §8 / §9 / §10 | 当前正式架构基线 | 提供职责边界、核心 / 支撑子域、运行承载、依赖方向、数据所有权和关键交互。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 5 | 约束本步必须产出组成部分总表、对象发现维度表、各部分交互总图、每个部分的停审记录和跨组成部分闭环审计表。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.5 与 `5.3.4 ASCII 图统一格式` | 约束正式 §5 的表、图和各部分小节格式。 |
| `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 作为 Step 05 粒度参考,对齐“功能 / capability 清单 + 对象发现维度表 + 停审记录 + 跨部分审计”的完整度。 |
| `projects/L1-artifact/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 作为 Step 05 粒度参考,对齐“业务组成部分主语稳定、代码主体回指 Step 04、对象候选不越级”的写法。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 仅作为 historical material,识别旧 Step 05 直接沿用 Step 03 对象 / schema 心智且缺少对象发现维度表、停审记录和交互总图的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 05 标准、L1 对标和前序 Step 结果 | done | 本文件 §2 |
| 从 Step 04 收稳业务主要组成部分 | done | 本文件 §4.1、§8.1 |
| 从 `00` / `01` 提炼各组成部分职责、非职责和交互边界 | done | 本文件 §4.2、§4.3、§8.1、§8.3 |
| 为 Step 06 建立对象发现维度表和候选池 | done | 本文件 §4.4、§8.2、§9 |
| 逐组成部分写功能 / capability、代码主体、对象线索和停审记录 | done | 本文件 §9 |
| 完成跨组成部分闭环审计和后续展开一致性检查 | done | 本文件 §11、§12 |
| 完成自检并回写 flow / 项目台账 | done | 本文件 §15、§16 |

---

## 4. SOP 问题回答

### 4.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

当前概要设计层面,`L4-observability` 划分为以下 10 个主要组成部分:

1. `Observation Intake and Safety`
2. `Correlation and Safe Signal`
3. `Audit Projection and Body-free Evidence Linkage`
4. `Report Handoff and Authenticity`
5. `Retention, Replay and No-write Guard`
6. `Read Query and Diagnostic Consumption`
7. `Gap and Degraded Expression`
8. `Peripheral Consumption and Export`
9. `Product-neutral Adapter and Reference Support`
10. `Derived Maintenance and Replay Coordination`

这 10 个名字都是概要设计层的业务结构主语,不是代码目录名、实现分层名、外部系统名、协议对象名或字段名。它们后续会跨越 `Inbound`、`Operations`、`Application Services`、`Domain Model`、`Ports`、`Persistence`、`Projection` 和 `Outbox` 等实现分层继续展开。

### 4.2 每个主要组成部分分别承担什么职责? 各自不承担什么?

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Observation Intake and Safety` | 承接候选观察材料,形成 accepted / rejected / quarantined / degraded 的正式入口事实和安全处置语境 | `ObservationSyncEntry`;`ObservationAsyncMaterialConsumer`;`ObservationIntakeService`;`SafetyDispositionPolicy`;`ObservationTruthStore` | 不拥有 source truth、raw body、外部正文、治理裁决、制品正文、执行 truth 或最终验收事实 |
| `Correlation and Safe Signal` | 形成 source ref、trace、causation、actor / subject 语境与 safe log / metric / trace 的统一关联解释 | `CorrelationSignalService`;`CorrelationContext`;`SafeSignalPolicy`;`SafeSignalProjectionStore`;`ObservationSourceAdapterPort` | 不把 opaque id、runtime cache、原始 signal 或业务主键直接升级为业务 truth |
| `Audit Projection and Body-free Evidence Linkage` | 形成只读审计投影和不保存正文的证据关联语义 | `AuditEvidenceService`;`AuditProjection`;`EvidenceLinkage`;`EvidenceReferencePort`;`AuditProjectionStore` | 不拥有 Governance truth、Artifact / evidence body、Identity truth 或 source audit 正文 |
| `Report Handoff and Authenticity` | 形成 report handoff、evidence index input、缺口说明和真实性提示 | `ReportHandoffService`;`ReportHandoffRecord`;`AuthenticityHintPolicy`;`EvidenceIndexInputView`;`HandoffPreparationPort`;`HandoffOutboxStore` | 不生成最终 verdict、真实 `run_id`、真实 evidence alias、真实 signoff 或最终验收结论 |
| `Retention, Replay and No-write Guard` | 形成 retention marker、活动引用保护、rebuild / replay 边界和 no-write 违例事实 | `RetentionReplayGuardService`;`RetentionMarker`;`ActiveReferenceProtection`;`NoWriteGuardPolicy`;`ViolationRecordStore` | 不拥有 archive package、source cleanup truth、source repair truth 或外部恢复编排 truth |
| `Read Query and Diagnostic Consumption` | 向 SDK / console / source owner / runtime / sandbox 提供只读查询、诊断摘要和可见性判断 | `ObservationReadQueryService`;`DiagnosticViewService`;`ReadVisibilityPolicy`;`ObservationReadModelStore` | 不下发控制命令,不修复 source truth,不把查询 / 诊断面写成 truth source |
| `Gap and Degraded Expression` | 统一表达 missing、degraded、blocked、not-visible、unsafe output 等状态 | `GapVisibilityService`;`GapState`;`DegradedOutputPolicy`;`GapStatusView` | 不补造默认成功,不替代上游材料,不把缺口解释写成 source truth |
| `Peripheral Consumption and Export` | 承接 dashboard、alert、管理报表、external audit / GRC 导出和 anomaly analysis 的只读消费面 | `PeripheralConsumptionService`;`DashboardAlertExportView`;`ExternalAuditExportPreparation`;`PeripheralReadStore` | 不反写核心 observation truth,不替代审计投影、report handoff 或 source truth |
| `Product-neutral Adapter and Reference Support` | 承接外部 source / identity / governance / artifact / runtime / archive 的引用、快照、safe summary 和产品中立接入边界 | `ObservationSourceAdapterPort`;`IdentitySubjectReferencePort`;`GovernanceArtifactEvidenceReferencePort`;`RuntimeSandboxSummaryPort`;`ArchiveReportHandoffPort`;`ReferenceSnapshotStore` | 不拥有外部正文、外部 lifecycle、外部产品配置 truth 或下游消费 truth |
| `Derived Maintenance and Replay Coordination` | 承接 projection rebuild、reference refresh、gap scan、rollup rebuild、派生维护和 replay 协调 | `ProjectionMaintenanceJob`;`ReferenceRefreshJob`;`GapScanJob`;`RollupRebuildJob`;`DerivedMaintenanceService` | 不生成新业务事实,不覆盖 observation truth,不修复或删除 source truth |

### 4.3 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

| 相关内容 | 正确归属 | `L4-observability` 的处理口径 |
|---|---|---|
| source business truth / business payload / source cleanup | 对应 source owner | 只观察、引用、摘要或记录 gap,不得接管写路径 |
| Governance decision、Policy、Gate、Control、Nonconformity 正式结论 | `L1-governance` | 只保留审计语境、引用、handoff purpose 或可见性状态 |
| Artifact / evidence body、baseline 正文和 lineage truth | `L1-artifact` / evidence owner | 只保留 body-free evidence linkage、完整性线索和缺口 |
| Identity lifecycle、actor / role truth、认证授权 truth | `L1-identity` / 安全入口 | 只保留 actor / subject safe ref 和责任语境摘要 |
| runtime execution、sandbox control、tool result body | `L2-runtime` / `L4-sandbox` | 只保留来源摘要、safe signal、gap 和可见性状态 |
| archive package、recovery body、长期正文保存 | `L4-archive` | 只交接 retention marker、archive eligibility、活动引用保护和 handoff 状态 |
| SDK / console / dashboard layout / workspace view state | `L0-sdk` / `L5-console` / 展示层 | 只消费 observation truth 或派生读侧,不得反向定义 truth |
| OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC 导出产品配置 | 外部产品和配置设计 | 只作为产品中立候选,不得成为当前业务组成部分或 truth source |

### 4.4 哪些候选对象必须进入 Step 06 独立成节展开? 哪些名称不应被误写成领域对象?

Step 06 必须从本步对象候选池中正式筛选并独立展开以下对象线索:

- `Observation Intake and Safety`:
  - `ObservationReceipt`
  - `SafetyDisposition`
  - `IntakeAdmissionPolicy`
  - `ObservationSourceRef`
  - `IntakeDecisionRecord`
- `Correlation and Safe Signal`:
  - `CorrelationContext`
  - `SafeSignal`
  - `SignalRollupWindow`
  - `SafeSignalPolicy`
  - `RuntimeSandboxSignalRef`
  - `CorrelationLinkRecord`
- `Audit Projection and Body-free Evidence Linkage`:
  - `AuditProjection`
  - `EvidenceLinkage`
  - `BodyFreeLinkagePolicy`
  - `EvidenceVisibilityPolicy`
  - `GovernanceArtifactEvidenceRef`
  - `AuditAppendRecord`
- `Report Handoff and Authenticity`:
  - `ReportHandoffRecord`
  - `AuthenticityHint`
  - `HandoffReadinessState`
  - `AuthenticityHintPolicy`
  - `ReportConsumerRef`
  - `HandoffLifecycleRecord`
- `Retention, Replay and No-write Guard`:
  - `RetentionMarker`
  - `ActiveReferenceProtection`
  - `ReplayScope`
  - `NoWriteViolation`
  - `RetentionProtectionPolicy`
  - `NoWriteGuardPolicy`
  - `RetentionChangeRecord`
- `Read Query and Diagnostic Consumption`:
  - `ReadVisibilityState`
  - `DiagnosticSummary`
  - `DiagnosticScope`
  - `ReadVisibilityPolicy`
  - `DiagnosticRequestContext`
  - `ReadAccessRecord`
- `Gap and Degraded Expression`:
  - `GapState`
  - `DegradedOutputState`
  - `GapClassificationPolicy`
  - `DegradedOutputPolicy`
  - `GapSourceRef`
  - `GapTransitionRecord`
- `Peripheral Consumption and Export`:
  - `PeripheralDeliveryState`
  - `ExternalAuditExportPreparation`
  - `PeripheralExportPolicy`
  - `PeripheralConsumerRef`
  - `PeripheralDeliveryRecord`
- `Product-neutral Adapter and Reference Support`:
  - `ReferenceSnapshotState`
  - `ReferenceFreshnessPolicy`
  - `SubjectObservationReference`
  - `GovernanceArtifactEvidenceReference`
  - `RuntimeSandboxSummaryRef`
  - `ArchiveReportHandoffRef`
  - `ReferenceRefreshRecord`
- `Derived Maintenance and Replay Coordination`:
  - `ProjectionMaintenanceState`
  - `ReplayCoordinationState`
  - `RollupRebuildState`
  - `DerivedMaintenancePolicy`
  - `ReplayCoordinationPolicy`
  - `MaintenanceTargetRef`
  - `ProjectionMaintenanceRecord`
  - `GapScanRecord`
  - `ReplayExecutionRecord`

以下名称当前不应在 Step 06 被误写成领域对象:

- repository / store:
  - `ObservationTruthStore`
  - `AuditProjectionStore`
  - `ObservationReadModelStore`
  - `ReferenceSnapshotStore`
  - `ViolationRecordStore`
  - `HandoffOutboxStore`
- port / adapter:
  - `ObservationSourceAdapterPort`
  - `IdentitySubjectReferencePort`
  - `GovernanceArtifactEvidenceReferencePort`
  - `RuntimeSandboxSummaryPort`
  - `ArchiveReportHandoffPort`
  - `EvidenceReferencePort`
  - `HandoffPreparationPort`
- trigger / job / 运维主体:
  - `ProjectionMaintenanceJob`
  - `ReferenceRefreshJob`
  - `GapScanJob`
  - `RollupRebuildJob`
- 典型非领域对象:
  - HTTP request body
  - event payload
  - DTO
  - database table
  - raw provider response
  - raw log / metric / trace backend record

### 4.5 哪些职责如果不写清,后续最容易让概要设计滑进实现层或让不同部分串线?

最容易串线的边界有:

- `Observation Intake and Safety` 与 `Correlation and Safe Signal` 的边界。如果不分开,安全准入会被 runtime signal 或 trace 语境反向定义。
- `Audit Projection and Body-free Evidence Linkage` 与 `Report Handoff and Authenticity` 的边界。如果不分开,report handoff 很容易冒充最终证据或验收结论。
- `Retention, Replay and No-write Guard` 与 `Derived Maintenance and Replay Coordination` 的边界。如果不分开,后台维护很容易越权反写或清理 source truth。
- `Read Query and Diagnostic Consumption`、`Gap and Degraded Expression`、`Peripheral Consumption and Export` 三者的边界。如果不分开,读侧、降级态和外围导出会被混成第二 observation truth。
- `Product-neutral Adapter and Reference Support` 与全部核心部分的边界。如果不分开,外部仓 truth、产品配置或外部正文会被误吸入核心 observation truth。

---

## 5. 当前文档问题诊断

| 旧材料 / 当前风险 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `design-calibration/02_hld_step_05_components_boundary.md` | 实际内容仍是 Step 03 的对象 / schema 收口,没有真正展开主要组成部分 | 重新改写为真正的“组成部分 + 职责 + 非职责 + 对象线索 + 停审记录”结构 |
| 旧 Step 05 | 没有组成部分总表、对象发现维度表、各部分交互总图和跨组成部分审计 | 全部按新版 SOP 补齐 |
| 旧 Step 05 | 没有承接 Step 04 的业务主要组成部分,而是重新发明对象中心叙述 | 当前严格回指 Step 04 已收稳的 10 个组成部分 |
| 旧 Step 05 | 没有显式区分 Step 06 候选对象与非对象名称 | 当前增加对象候选池和被排除名称清单 |
| 旧自动顺推链 | 容易把 Step 05 写完后自动推进 Step 06 或正式装配 | 当前 gate 只允许 `wait_user_confirmation_before_step_06` |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 结构主语 | 对象 / schema / 产品心智混写 | 先稳定 10 个业务主要组成部分 |
| 职责边界 | 只讲 observation 平台抽象,没有逐部分职责 / 非职责 | 每个组成部分都显式写承担什么和不承担什么 |
| 对象候选池 | Step 06 无稳定输入 | 已按组成部分建立对象发现维度表和对象线索 |
| 交互关系 | 缺少各组成部分交互总图 | 已补齐总图和关键说明 |
| 可审查性 | 没有组成部分停审和跨部分审计 | 每部分单独停审,最后做闭环审计 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接沿用 Step 04 的 10 个名称,但只写一句话定义 | 改动最小 | 无法支撑 Step 06 的对象候选池和 Step 08 / Step 09 的后续承接 | 不采用 |
| 方案 B: 把 10 个组成部分再并成 4~5 个大块 | 看起来更简洁 | 会丢失 report handoff、gap、peripheral、adapter、maintenance 等边界 | 不采用 |
| 方案 C: 保持 Step 04 的 10 个业务组成部分,逐个补职责、非职责、代码主体和对象线索 | 与 Step 04 连续,也足以支撑 Step 06 | 篇幅更长,需要显式做跨部分审计 | 采用 |
| 方案 D: 按实现分层写 Step 05 | 技术层次清楚 | 会把业务边界变成 handler / service / store 的实现分层 | 不采用 |

---

## 8. 结构化中间产物

### 8.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Observation Intake and Safety` | 承接候选观察材料并形成正式准入 / 拒绝 / 隔离 / 降级事实 | `ObservationSyncEntry`;`ObservationAsyncMaterialConsumer`;`ObservationIntakeService`;`SafetyDispositionPolicy`;`ObservationTruthStore` | 不拥有 source truth、外部正文、治理裁决或执行 truth |
| `Correlation and Safe Signal` | 形成 correlation context 和 safe log / metric / trace 语境 | `CorrelationSignalService`;`CorrelationContext`;`SafeSignalPolicy`;`SafeSignalProjectionStore` | 不把 opaque id、runtime cache 或业务主键升级为业务 truth |
| `Audit Projection and Body-free Evidence Linkage` | 形成只读 audit projection 与 body-free evidence linkage | `AuditEvidenceService`;`AuditProjection`;`EvidenceLinkage`;`AuditProjectionStore` | 不拥有 Governance / Artifact / evidence / identity 正文 |
| `Report Handoff and Authenticity` | 形成 report handoff、evidence index input 和真实性提示 | `ReportHandoffService`;`ReportHandoffRecord`;`AuthenticityHintPolicy`;`HandoffOutboxStore` | 不生成最终 verdict、真实 `run_id` 或 signoff |
| `Retention, Replay and No-write Guard` | 形成 retention marker、活动引用保护和 no-write 违例防线 | `RetentionReplayGuardService`;`RetentionMarker`;`ActiveReferenceProtection`;`NoWriteGuardPolicy`;`ViolationRecordStore` | 不拥有 archive package、source cleanup 或 source repair truth |
| `Read Query and Diagnostic Consumption` | 提供只读查询、诊断摘要和可见性判断 | `ObservationReadQueryService`;`DiagnosticViewService`;`ReadVisibilityPolicy`;`ObservationReadModelStore` | 不下发控制命令,不修复 source truth |
| `Gap and Degraded Expression` | 统一表达 missing / degraded / blocked / not-visible / unsafe output | `GapVisibilityService`;`GapState`;`DegradedOutputPolicy`;`GapStatusView` | 不补造默认成功,不替代 observation truth |
| `Peripheral Consumption and Export` | 向 dashboard、alert、报表、external audit / GRC 导出提供只读消费面 | `PeripheralConsumptionService`;`DashboardAlertExportView`;`ExternalAuditExportPreparation`;`PeripheralReadStore` | 不反写 observation truth,不替代 report handoff |
| `Product-neutral Adapter and Reference Support` | 提供外部引用、快照、safe summary 和产品中立适配边界 | `ObservationSourceAdapterPort`;`IdentitySubjectReferencePort`;`GovernanceArtifactEvidenceReferencePort`;`RuntimeSandboxSummaryPort`;`ArchiveReportHandoffPort`;`ReferenceSnapshotStore` | 不拥有外部正文、外部 lifecycle 或产品配置 truth |
| `Derived Maintenance and Replay Coordination` | 承接 projection rebuild、reference refresh、gap scan、rollup rebuild 和派生维护 | `ProjectionMaintenanceJob`;`ReferenceRefreshJob`;`GapScanJob`;`RollupRebuildJob`;`DerivedMaintenanceService` | 不生成新业务事实,不覆盖 observation truth 或 source truth |

### 8.2 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Observation Intake and Safety` | `ObservationReceipt`;`SafetyDisposition`;`MaterialAdmissionState` | `IntakeAdmissionPolicy`;`SafetyDispositionPolicy` | `IntakeStatusView` | `ObservationSourceRef`;`SubmissionPurposeRef` | `IntakeDecisionRecord` | `ObservationReceipt`;`SafetyDisposition`;`SafetyDispositionPolicy`;`ObservationSourceRef`;`IntakeDecisionRecord` |
| `Correlation and Safe Signal` | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow` | `CorrelationIntegrityPolicy`;`SafeSignalPolicy` | `SafeSignalProjectionView`;`SignalRollupView` | `ActorSubjectObservationRef`;`RuntimeSandboxSignalRef` | `CorrelationLinkRecord` | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`SafeSignalPolicy`;`RuntimeSandboxSignalRef` |
| `Audit Projection and Body-free Evidence Linkage` | `AuditProjection`;`EvidenceLinkage`;`AuditProjectionVisibilityState` | `BodyFreeLinkagePolicy`;`EvidenceVisibilityPolicy` | `AuditTimelineView`;`EvidenceLinkageSummaryView` | `GovernanceArtifactEvidenceRef` | `AuditAppendRecord` | `AuditProjection`;`EvidenceLinkage`;`BodyFreeLinkagePolicy`;`EvidenceVisibilityPolicy`;`GovernanceArtifactEvidenceRef`;`AuditAppendRecord` |
| `Report Handoff and Authenticity` | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState` | `AuthenticityHintPolicy`;`HandoffReadinessPolicy` | `EvidenceIndexInputView`;`HandoffSummaryView` | `ReportConsumerRef`;`ExternalAuditHandoffRef` | `HandoffLifecycleRecord` | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`AuthenticityHintPolicy`;`ReportConsumerRef`;`HandoffLifecycleRecord` |
| `Retention, Replay and No-write Guard` | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation` | `RetentionProtectionPolicy`;`ReplayBoundaryPolicy`;`NoWriteGuardPolicy` | `RetentionProtectionView`;`ViolationSummaryView` | `ProtectedObservationRef`;`ArchiveEligibilityRef` | `RetentionChangeRecord`;`NoWriteViolationRecord` | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation`;`RetentionProtectionPolicy`;`NoWriteGuardPolicy` |
| `Read Query and Diagnostic Consumption` | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope` | `ReadVisibilityPolicy`;`DiagnosticScopePolicy` | `ObservationReadModel`;`DiagnosticView`;`DiagnosticSummaryView` | `QueryScopeRef`;`DiagnosticRequestContext` | `ReadAccessRecord` | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope`;`ReadVisibilityPolicy`;`DiagnosticRequestContext` |
| `Gap and Degraded Expression` | `GapState`;`DegradedOutputState`;`BlockedVisibilityState` | `GapClassificationPolicy`;`DegradedOutputPolicy` | `GapStatusView`;`DegradationSummaryView` | `GapSourceRef`;`VisibilityConstraintRef` | `GapTransitionRecord` | `GapState`;`DegradedOutputState`;`GapClassificationPolicy`;`DegradedOutputPolicy`;`GapSourceRef`;`GapTransitionRecord` |
| `Peripheral Consumption and Export` | `PeripheralDeliveryState`;`ExternalAuditExportPreparation` | `PeripheralExportPolicy`;`ConsumerReadScopePolicy` | `DashboardAlertExportView`;`ManagementReportView`;`AnalysisMaterialView` | `PeripheralConsumerRef`;`ExternalAuditConsumerRef`;`AlertConsumerRef` | `PeripheralDeliveryRecord`;`ExportPreparationRecord` | `PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`PeripheralExportPolicy`;`PeripheralConsumerRef`;`PeripheralDeliveryRecord` |
| `Product-neutral Adapter and Reference Support` | `ReferenceSnapshotState` | `ReferenceFreshnessPolicy`;`AdapterBoundaryPolicy` | `ReferenceSnapshotView`;`AdapterReadinessView` | `SubjectObservationReference`;`GovernanceArtifactEvidenceReference`;`RuntimeSandboxSummaryRef`;`ArchiveReportHandoffRef` | `ReferenceRefreshRecord` | `ReferenceSnapshotState`;`ReferenceFreshnessPolicy`;`SubjectObservationReference`;`GovernanceArtifactEvidenceReference`;`RuntimeSandboxSummaryRef`;`ArchiveReportHandoffRef` |
| `Derived Maintenance and Replay Coordination` | `ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState` | `DerivedMaintenancePolicy`;`ReplayCoordinationPolicy` | `RebuildProgressView`;`MaintenanceOutcomeView` | `MaintenanceTargetRef`;`ReplayTargetRef` | `ProjectionMaintenanceRecord`;`GapScanRecord`;`ReplayExecutionRecord` | `ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState`;`DerivedMaintenancePolicy`;`ReplayCoordinationPolicy`;`MaintenanceTargetRef`;`ProjectionMaintenanceRecord`;`ReplayExecutionRecord` |

#### 各部分交互总图

```text
L4-observability
│
├─ Product-neutral Adapter and Reference Support
│  ├─ supports Observation Intake and Safety
│  ├─ supports Correlation and Safe Signal
│  ├─ supports Audit Projection and Body-free Evidence Linkage
│  └─ supports Derived Maintenance and Replay Coordination
│
├─ Observation Intake and Safety
│  └─ feeds Correlation and Safe Signal
│      └─ feeds Audit Projection and Body-free Evidence Linkage
│          ├─ feeds Report Handoff and Authenticity
│          └─ feeds Read Query and Diagnostic Consumption
│
├─ Gap and Degraded Expression
│  ├─ supports Audit Projection and Body-free Evidence Linkage
│  ├─ supports Report Handoff and Authenticity
│  ├─ supports Read Query and Diagnostic Consumption
│  └─ supports Peripheral Consumption and Export
│
├─ Retention, Replay and No-write Guard
│  ├─ constrains core components
│  └─ constrains Derived Maintenance and Replay Coordination
│
├─ Read Query and Diagnostic Consumption
│  └─ feeds Peripheral Consumption and Export
│
└─ Derived Maintenance and Replay Coordination
   ├─ rebuilds read / diagnostic / gap / peripheral projections
   └─ must not rewrite source truth
```

关键说明：
- 这张图只表达主要组成部分之间的大体交互和约束方向,不表达协议字段、函数调用链或详细时序。
- `Observation Intake and Safety`、`Correlation and Safe Signal`、`Audit Projection and Body-free Evidence Linkage` 构成核心 truth 建立主线。
- `Gap and Degraded Expression` 与 `Retention, Replay and No-write Guard` 都是横切约束,它们支撑或约束多个部分,但不替代核心部分的 truth owner。
- `Derived Maintenance and Replay Coordination` 只能维护派生结果,不能回写 observation truth,也不能越权触碰 source truth。

---

## 9. 各主要组成部分

### 9.1 Observation Intake and Safety

#### 本部分职责

承接候选观察材料,在进入 observation truth 前完成准入判断、安全处置、拒绝 / 隔离 / 降级判断和正式 receipt 建立。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 受控观察材料准入 | source material、safe summary、管理触发 | accepted / rejected / quarantined receipt | 建立 observation truth 入口事实 | Step 6 / Step 8 / Step 9 |
| 安全处置与脱敏判断 | candidate material、visibility constraints | safety disposition | 形成 redaction / forbidden body 决策 | Step 6 / Step 8 |
| 拒绝 / 隔离 / 降级状态成立 | unsafe input、missing source、insufficient context | degraded / blocked / quarantined state | 防止默认成功补造事实 | Step 6 / Step 9 / Step 10 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ObservationSyncEntry` | inbound | 承接同步只读和受控入口请求 | Step 7 / Step 8 |
| `ObservationAsyncMaterialConsumer` | inbound | 承接异步观察材料和安全摘要送达 | Step 7 / Step 8 |
| `ObservationIntakeService` | application service | 编排准入、安全处置和正式 receipt 建立 | Step 7 / Step 8 |
| `SafetyDispositionPolicy` | domain policy | 判断是否允许进入 observation truth | Step 6 |
| `ObservationTruthStore` | persistence | 保存准入与安全事实 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ObservationReceipt` | Step 6 独立成节 |
| Truth / State | `SafetyDisposition` | Step 6 独立成节 |
| Policy / Invariant | `IntakeAdmissionPolicy`;`SafetyDispositionPolicy` | Step 6 独立成节 |
| Reference / Boundary | `ObservationSourceRef` | Step 6 独立成节 |
| Audit / History | `IntakeDecisionRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不拥有 source truth、raw body、治理结论、artifact / evidence 正文、runtime execution truth、archive package truth 或最终验收事实。

#### 与其他部分的接缝

向 `Correlation and Safe Signal` 输出已安全收束的材料语境,向 `Gap and Degraded Expression` 输出 rejected / quarantined / degraded 线索,受 `Product-neutral Adapter and Reference Support` 提供的来源引用和摘要支撑。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-001~003` |
| 候选对象是否有功能来源 | pass | receipt / disposition / source ref 均有明确来源 |
| 接缝是否清楚 | pass | 上接 adapter / reference,下接 correlation / gap |
| 禁止事项是否清楚 | pass | 已排除 raw body、source truth 和外部正文 |
| 是否越界 | pass | 未展开字段、schema、repo 函数或实现流程 |

### 9.2 Correlation and Safe Signal

#### 本部分职责

在已安全收束的观察材料基础上,形成 correlation context、source attribution 和 safe log / metric / trace 语义,让后续 audit、diagnostic 和 handoff 都围绕同一关联语境解释。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成 correlation context | accepted material、source ref、trace / causation clue | `CorrelationContext` | 为 audit / diagnostic / handoff 提供统一关联锚点 | Step 6 / Step 8 |
| 形成 safe signal | redacted material、runtime / sandbox summary | safe log / metric / trace | 支撑运行观察面和诊断读取 | Step 6 / Step 8 / Step 9 |
| 形成 rollup / signal summary 语义 | safe signal stream、window context | safe rollup meaning | 允许派生查询和外围消费 | Step 6 / Step 8 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CorrelationSignalService` | application service | 编排关联语境和安全信号成立 | Step 7 / Step 8 |
| `CorrelationContext` | domain model | 表达 trace / causation / source / actor / subject 语境 | Step 6 |
| `SafeSignalPolicy` | domain policy | 判断 signal 是否可作为安全观察输出成立 | Step 6 |
| `SafeSignalProjectionStore` | projection | 保存安全信号只读派生承载 | Step 7 / 详细设计 |
| `ObservationSourceAdapterPort` | port | 提供来源安全摘要和引用语境 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow` | Step 6 独立成节 |
| Policy / Invariant | `CorrelationIntegrityPolicy`;`SafeSignalPolicy` | Step 6 独立成节 |
| Reference / Boundary | `RuntimeSandboxSignalRef`;`ActorSubjectObservationRef` | Step 6 独立成节 |
| Audit / History | `CorrelationLinkRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不把 opaque id、runtime cache、业务主键、原始 metric backend record 或 trace backend record 直接升级为业务 truth 或 execution truth。

#### 与其他部分的接缝

消费 `Observation Intake and Safety` 输出的安全语境,向 `Audit Projection and Body-free Evidence Linkage`、`Read Query and Diagnostic Consumption`、`Gap and Degraded Expression` 输出统一关联语境。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-002~007` |
| 候选对象是否有功能来源 | pass | correlation / safe signal / rollup 均有来源 |
| 接缝是否清楚 | pass | 上接 intake,下接 audit / read / gap |
| 禁止事项是否清楚 | pass | 已排除 opaque id 反推业务真相 |
| 是否越界 | pass | 未展开 signal schema、window 算法或存储实现 |

### 9.3 Audit Projection and Body-free Evidence Linkage

#### 本部分职责

形成只读 audit projection,并在不保存 evidence / artifact body 的前提下建立证据关联、完整性线索、缺口和可见性语境。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 追加只读 audit projection | accepted material、correlation context、责任语境 | `AuditProjection` | 形成可审计只读投影 | Step 6 / Step 8 |
| 形成 body-free evidence linkage | evidence ref、artifact ref、visibility context | `EvidenceLinkage` | 形成引用、摘要、缺口和完整性线索 | Step 6 / Step 8 |
| 明确缺失 / 不可见 / 不可追溯状态 | missing evidence、blocked visibility | linkage gap state | 防止保存正文补齐 | Step 6 / Step 10 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AuditEvidenceService` | application service | 编排 audit projection 和 evidence linkage 成立 | Step 7 / Step 8 |
| `AuditProjection` | domain model | 表达只读审计投影主语 | Step 6 |
| `EvidenceLinkage` | domain model | 表达 body-free 证据关联主语 | Step 6 |
| `EvidenceReferencePort` | port | 提供 evidence / artifact 安全引用 | Step 7 / 详细设计 |
| `AuditProjectionStore` | persistence | 保存 audit projection 和关联事实 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `AuditProjection`;`EvidenceLinkage`;`AuditProjectionVisibilityState` | Step 6 独立成节 |
| Policy / Invariant | `BodyFreeLinkagePolicy`;`EvidenceVisibilityPolicy` | Step 6 独立成节 |
| Reference / Boundary | `GovernanceArtifactEvidenceRef` | Step 6 独立成节 |
| Audit / History | `AuditAppendRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不拥有 Governance truth、Artifact truth、evidence body、artifact body、identity body、source audit 正文或任何外部正文 lifecycle。

#### 与其他部分的接缝

消费 `Correlation and Safe Signal` 的关联语境,向 `Report Handoff and Authenticity`、`Read Query and Diagnostic Consumption`、`Gap and Degraded Expression` 输出审计和证据线索。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-004~005` |
| 候选对象是否有功能来源 | pass | audit / evidence / visibility 均有来源 |
| 接缝是否清楚 | pass | 上接 correlation,下接 handoff / read / gap |
| 禁止事项是否清楚 | pass | 已排除外部正文和外部 truth ownership |
| 是否越界 | pass | 未展开 digest 算法、schema 或持久化结构 |

### 9.4 Report Handoff and Authenticity

#### 本部分职责

形成 report handoff、evidence index input、真实性提示、交接阻塞与缺口说明,但不替代真实运行事实、真实证据或最终验收结论。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成 report handoff record | audit projection、evidence linkage、visibility context | `ReportHandoffRecord` | 产生对外可交接的观察线索 | Step 6 / Step 8 |
| 形成真实性提示 | evidence index input、gap / placeholder context | `AuthenticityHint` | 区分真实执行证据、待补齐材料和设计期占位 | Step 6 / Step 8 |
| 形成 handoff readiness 状态 | read scope、visibility、no-write guard | ready / blocked / pending / failed | 防止伪造真实 evidence 和 verdict | Step 6 / Step 9 / Step 10 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ReportHandoffService` | application service | 编排交接材料准备、可读性判断和状态输出 | Step 7 / Step 8 |
| `ReportHandoffRecord` | domain model | 表达正式交接事实 | Step 6 |
| `AuthenticityHintPolicy` | domain policy | 判断真实性提示和占位边界 | Step 6 |
| `EvidenceIndexInputView` | projection | 提供交接输入读侧 | Step 6 / Step 7 |
| `HandoffPreparationPort` | port | 对接 archive / report / audit 消费边界 | Step 7 / 详细设计 |
| `HandoffOutboxStore` | outbox | 保存交接传播意图 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState` | Step 6 独立成节 |
| Policy / Invariant | `AuthenticityHintPolicy`;`HandoffReadinessPolicy` | Step 6 独立成节 |
| Projection / Read model | `EvidenceIndexInputView`;`HandoffSummaryView` | Step 6 独立成节 |
| Reference / Boundary | `ReportConsumerRef`;`ExternalAuditHandoffRef` | Step 6 独立成节 |
| Audit / History | `HandoffLifecycleRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不生成最终 verdict、真实 `run_id`、真实 evidence alias、真实 signoff、archive package 正文或最终验收结论。

#### 与其他部分的接缝

消费 `Audit Projection and Body-free Evidence Linkage` 的证据线索与 `Gap and Degraded Expression` 的缺口状态,受 `Retention, Replay and No-write Guard` 约束,向 `Peripheral Consumption and Export` 和外部 handoff consumer 提供只读交接面。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-010~011` |
| 候选对象是否有功能来源 | pass | handoff / authenticity / readiness 均有来源 |
| 接缝是否清楚 | pass | 上接 audit / gap,下接 peripheral / external handoff |
| 禁止事项是否清楚 | pass | 已排除真实 evidence / verdict / signoff |
| 是否越界 | pass | 未展开 handoff schema、consumer 协议或 archive 包格式 |

### 9.5 Retention, Replay and No-write Guard

#### 本部分职责

形成 retention marker、活动引用保护、rebuild / replay 范围和 no-write 违例事实,持续约束所有读侧、派生侧、维护侧和交接侧。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成 retention marker | hold / release / eligibility context | `RetentionMarker` | 形成留存生命周期事实 | Step 6 / Step 8 / Step 9 |
| 保护活动引用 | audit / diagnostic / report / replay references | `ActiveReferenceProtection` | 防止误清仍被合法引用的材料 | Step 6 / Step 8 |
| 记录 no-write 违例 | query / diagnostic / maintenance / export action | `NoWriteViolation` | 拒绝、挂起或记录越权写源尝试 | Step 6 / Step 8 / Step 10 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `RetentionReplayGuardService` | application service | 编排留存保护、replay scope 和违例判断 | Step 7 / Step 8 |
| `RetentionMarker` | domain model | 表达留存生命周期事实 | Step 6 |
| `ActiveReferenceProtection` | domain model | 表达活动引用保护事实 | Step 6 |
| `NoWriteGuardPolicy` | domain policy | 判断是否发生越权写源 | Step 6 |
| `ViolationRecordStore` | persistence | 保存违例事实和追溯记录 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation` | Step 6 独立成节 |
| Policy / Invariant | `RetentionProtectionPolicy`;`ReplayBoundaryPolicy`;`NoWriteGuardPolicy` | Step 6 独立成节 |
| Reference / Boundary | `ProtectedObservationRef`;`ArchiveEligibilityRef` | Step 6 独立成节 |
| Audit / History | `RetentionChangeRecord`;`NoWriteViolationRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不拥有 archive package、source cleanup truth、source repair truth、外部恢复编排 truth 或任何 source truth 的修复权限。

#### 与其他部分的接缝

横切约束全部核心和支撑组成部分,尤其约束 `Report Handoff and Authenticity` 与 `Derived Maintenance and Replay Coordination`,并向 `Gap and Degraded Expression` 输出 blocked / conflict / retryable 线索。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-012~013` |
| 候选对象是否有功能来源 | pass | retention / protection / violation 均有来源 |
| 接缝是否清楚 | pass | 横切约束 core / read / handoff / maintenance |
| 禁止事项是否清楚 | pass | 已排除 source cleanup / source repair truth |
| 是否越界 | pass | 未展开 retention days、legal hold 参数或 cleanup 算法 |

### 9.6 Read Query and Diagnostic Consumption

#### 本部分职责

向 SDK / console / source owner / runtime / sandbox 提供只读查询、诊断摘要、只读可见性判断和受控读取范围。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 提供只读观察查询 | read scope、visibility context、projection state | observation read result | 不改变 observation truth | Step 6 / Step 7 / Step 8 |
| 提供诊断摘要读取 | audit / signal / gap / handoff lineages | diagnostic summary | 形成 explain-only 读取面 | Step 6 / Step 8 |
| 提供可见性判断 | actor / subject / consumer scope | visible / blocked / not-visible state | 阻止越权读取与 unsafe output | Step 6 / Step 9 / Step 10 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ObservationReadQueryService` | application service | 编排只读查询和聚合读取面 | Step 7 / Step 8 |
| `DiagnosticViewService` | application service | 编排诊断摘要和 explain-only 读取 | Step 7 / Step 8 |
| `ReadVisibilityPolicy` | domain policy | 判断读取范围和可见性 | Step 6 |
| `ObservationReadModelStore` | projection | 保存查询 / 诊断读侧 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope` | Step 6 独立成节 |
| Policy / Invariant | `ReadVisibilityPolicy`;`DiagnosticScopePolicy` | Step 6 独立成节 |
| Projection / Read model | `ObservationReadModel`;`DiagnosticView`;`DiagnosticSummaryView` | Step 6 独立成节 |
| Reference / Boundary | `QueryScopeRef`;`DiagnosticRequestContext` | Step 6 独立成节 |
| Audit / History | `ReadAccessRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不下发 kill、retry、recovery、business command 或其他执行控制命令;不修复 source truth;不把读侧读取面变成第二 observation truth。

#### 与其他部分的接缝

消费 `Correlation and Safe Signal`、`Audit Projection and Body-free Evidence Linkage`、`Gap and Degraded Expression` 和 `Report Handoff and Authenticity` 的只读投影;向 `Peripheral Consumption and Export` 提供稳定读取面。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-008~009` |
| 候选对象是否有功能来源 | pass | query / diagnostic / visibility 均有来源 |
| 接缝是否清楚 | pass | 上接 signal / audit / gap / handoff,下接 peripheral |
| 禁止事项是否清楚 | pass | 已排除控制命令和修复路径 |
| 是否越界 | pass | 未展开 query protocol、参数 schema 或缓存实现 |

### 9.7 Gap and Degraded Expression

#### 本部分职责

统一表达材料缺失、降级、阻塞、不可见、不可安全输出和不完整来源等状态,防止空结果或默认成功补造事实。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成 gap state | missing source、missing evidence、unresolved ref | `GapState` | 输出可审查缺口事实 | Step 6 / Step 8 / Step 9 |
| 形成 degraded output 语义 | unsafe signal、partial handoff、stale projection | degraded output state | 防止读侧和导出伪装成功 | Step 6 / Step 8 / Step 10 |
| 形成 blocked / not-visible 语义 | visibility block、no-write block、handoff block | blocked / not-visible state | 统一向 read / handoff / peripheral 解释 | Step 6 / Step 9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `GapVisibilityService` | application service | 编排缺口、降级和可见性状态 | Step 7 / Step 8 |
| `GapState` | domain model | 表达缺口主语 | Step 6 |
| `DegradedOutputPolicy` | domain policy | 判断何时只能输出 degraded / blocked 语义 | Step 6 |
| `GapStatusView` | projection | 保存 gap / degraded 状态读侧 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `GapState`;`DegradedOutputState`;`BlockedVisibilityState` | Step 6 独立成节 |
| Policy / Invariant | `GapClassificationPolicy`;`DegradedOutputPolicy` | Step 6 独立成节 |
| Projection / Read model | `GapStatusView`;`DegradationSummaryView` | Step 6 独立成节 |
| Reference / Boundary | `GapSourceRef`;`VisibilityConstraintRef` | Step 6 独立成节 |
| Audit / History | `GapTransitionRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不替代 observation truth,不补造默认成功,不把缺口解释写成 source truth 或外部 truth 修复结果。

#### 与其他部分的接缝

横切支撑 `Audit Projection and Body-free Evidence Linkage`、`Report Handoff and Authenticity`、`Read Query and Diagnostic Consumption`、`Peripheral Consumption and Export` 和 `Derived Maintenance and Replay Coordination`。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 `FR-OBS-006~007` 与相关 NFR |
| 候选对象是否有功能来源 | pass | gap / degraded / blocked 均有来源 |
| 接缝是否清楚 | pass | 横切支撑 read / handoff / peripheral / maintenance |
| 禁止事项是否清楚 | pass | 已排除默认成功补造和 truth 替代 |
| 是否越界 | pass | 未展开错误码、fallback 算法或 UI 展示结构 |

### 9.8 Peripheral Consumption and Export

#### 本部分职责

向 dashboard、alert、管理报表、external audit / GRC 导出和 anomaly analysis 提供只读消费材料,但不反写 observation truth。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 生成外围消费读侧 | observation read models、diagnostic summaries、gap states | dashboard / alert / report / analysis material | 形成只读消费材料 | Step 6 / Step 8 |
| 形成 external audit / GRC export 准备 | handoff-ready summaries、visibility state | export preparation material | 可 blocked / pending / retryable | Step 6 / Step 8 / Step 10 |
| 形成消费者范围约束 | consumer scope、authenticity hint、no-write guard | permitted / limited delivery | 防止外围消费越权解释为 truth | Step 6 / Step 9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `PeripheralConsumptionService` | application service | 编排 dashboard / alert / export / analysis 的只读消费准备 | Step 7 / Step 8 |
| `DashboardAlertExportView` | projection | 保存外围消费读侧 | Step 6 / Step 7 |
| `ExternalAuditExportPreparation` | projection / state | 保存 external audit / GRC 导出准备态 | Step 6 |
| `PeripheralReadStore` | projection persistence | 保存外围消费承载 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `PeripheralDeliveryState`;`ExternalAuditExportPreparation` | Step 6 独立成节 |
| Policy / Invariant | `PeripheralExportPolicy`;`ConsumerReadScopePolicy` | Step 6 独立成节 |
| Projection / Read model | `DashboardAlertExportView`;`ManagementReportView`;`AnalysisMaterialView` | Step 6 独立成节 |
| Reference / Boundary | `PeripheralConsumerRef`;`ExternalAuditConsumerRef`;`AlertConsumerRef` | Step 6 独立成节 |
| Audit / History | `PeripheralDeliveryRecord`;`ExportPreparationRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不反写 observation truth,不替代 report handoff、audit projection 或 source truth,不绑定具名产品配置为核心结构前提。

#### 与其他部分的接缝

消费 `Read Query and Diagnostic Consumption`、`Gap and Degraded Expression` 和 `Report Handoff and Authenticity` 的只读结果;受 `Retention, Replay and No-write Guard` 和 `Product-neutral Adapter and Reference Support` 约束。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接外围增强与导出边界 |
| 候选对象是否有功能来源 | pass | delivery / export / consumer refs 均有来源 |
| 接缝是否清楚 | pass | 上接 read / gap / handoff,下接外部消费者 |
| 禁止事项是否清楚 | pass | 已排除 truth 回写和产品前置 |
| 是否越界 | pass | 未展开 dashboard schema、alert payload 或 GRC 产品参数 |

### 9.9 Product-neutral Adapter and Reference Support

#### 本部分职责

承接 source / identity / governance / artifact / runtime / archive 等外部协作边界的引用、快照、safe summary 和产品中立接入边界,为核心 observation truth 主线提供受控外部语境。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 保存受控引用 / 快照 | source / identity / governance / artifact / runtime summaries | reference snapshot state | 形成外部语境支撑,不接管正文 | Step 6 / Step 8 |
| 形成引用 freshness / resolution 状态 | stale / unresolved / invalid source | snapshot freshness / resolution state | 支撑 gap 和 degraded 判断 | Step 6 / Step 9 / Step 10 |
| 提供产品中立接入边界 | collector / storage / display / export candidates | adapter boundary context | 防止具名产品反向定义核心结构 | Step 6 / Step 11 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ObservationSourceAdapterPort` | port | 提供 source / bus 观察材料和安全摘要接缝 | Step 7 / 详细设计 |
| `IdentitySubjectReferencePort` | port | 提供 actor / subject safe ref 接缝 | Step 7 / 详细设计 |
| `GovernanceArtifactEvidenceReferencePort` | port | 提供 governance / artifact / evidence body-free 引用接缝 | Step 7 / 详细设计 |
| `RuntimeSandboxSummaryPort` | port | 提供 runtime / sandbox 安全摘要接缝 | Step 7 / 详细设计 |
| `ArchiveReportHandoffPort` | port | 提供 archive / report handoff 接缝 | Step 7 / 详细设计 |
| `ReferenceSnapshotStore` | persistence | 保存外部引用和快照状态 | Step 7 / 详细设计 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceSnapshotState` | Step 6 独立成节 |
| Policy / Invariant | `ReferenceFreshnessPolicy`;`AdapterBoundaryPolicy` | Step 6 独立成节 |
| Projection / Read model | `ReferenceSnapshotView`;`AdapterReadinessView` | Step 6 独立成节 |
| Reference / Boundary | `SubjectObservationReference`;`GovernanceArtifactEvidenceReference`;`RuntimeSandboxSummaryRef`;`ArchiveReportHandoffRef` | Step 6 独立成节 |
| Audit / History | `ReferenceRefreshRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不拥有外部正文、外部 lifecycle、外部产品配置 truth、downstream consumer truth 或 source truth 主干。

#### 与其他部分的接缝

为 `Observation Intake and Safety`、`Correlation and Safe Signal`、`Audit Projection and Body-free Evidence Linkage`、`Report Handoff and Authenticity` 和 `Derived Maintenance and Replay Coordination` 提供外部语境支撑。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接外部引用、快照和产品中立适配边界 |
| 候选对象是否有功能来源 | pass | snapshot / ref / freshness 均有来源 |
| 接缝是否清楚 | pass | 对 core / read / maintenance 提供统一支撑 |
| 禁止事项是否清楚 | pass | 已排除外部正文和外部产品配置 truth |
| 是否越界 | pass | 未展开 adapter product、协议或缓存实现 |

### 9.10 Derived Maintenance and Replay Coordination

#### 本部分职责

承接 projection rebuild、reference refresh、gap scan、rollup rebuild、派生维护和 replay 协调,但只作用于 observation truth 的派生结果和维护结果解释。

#### 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 执行派生维护 | truth changes、projection state | projection maintenance state | 维护 read / diagnostic / peripheral projections | Step 6 / Step 8 |
| 执行 reference refresh / gap scan | stale refs、missing refs、visibility changes | refresh / gap scan result | 输出 gap / degraded 解释 | Step 6 / Step 8 / Step 10 |
| 执行 replay / rollup rebuild 协调 | replay scope、maintenance target | replay / rebuild state | 只影响本仓 observation 派生面 | Step 6 / Step 8 / Step 9 |

#### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ProjectionMaintenanceJob` | operation job | 执行投影维护任务 | Step 7 / Step 8 |
| `ReferenceRefreshJob` | operation job | 执行引用刷新任务 | Step 7 / Step 8 |
| `GapScanJob` | operation job | 执行缺口扫描任务 | Step 7 / Step 8 |
| `RollupRebuildJob` | operation job | 执行 rollup 重建任务 | Step 7 / Step 8 |
| `DerivedMaintenanceService` | application service | 编排维护任务、范围判断和状态回写 | Step 7 / Step 8 |

#### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState` | Step 6 独立成节 |
| Policy / Invariant | `DerivedMaintenancePolicy`;`ReplayCoordinationPolicy` | Step 6 独立成节 |
| Projection / Read model | `RebuildProgressView`;`MaintenanceOutcomeView` | Step 6 独立成节 |
| Reference / Boundary | `MaintenanceTargetRef`;`ReplayTargetRef` | Step 6 独立成节 |
| Audit / History | `ProjectionMaintenanceRecord`;`GapScanRecord`;`ReplayExecutionRecord` | Step 6 独立成节 |

#### 本部分不承担什么

不生成新业务事实,不覆盖 observation truth,不修复或删除 source truth,不生成最终验收结论或 archive package truth。

#### 与其他部分的接缝

受 `Retention, Replay and No-write Guard` 约束,消费 `Product-neutral Adapter and Reference Support` 的刷新语境,维护 `Read Query and Diagnostic Consumption`、`Gap and Degraded Expression`、`Peripheral Consumption and Export` 所依赖的派生结构。

#### 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 直接承接 rebuild / replay / maintenance / gap 相关能力 |
| 候选对象是否有功能来源 | pass | maintenance / replay / rebuild / gap scan 均有来源 |
| 接缝是否清楚 | pass | 上接 guard / adapter,下接 read / gap / peripheral |
| 禁止事项是否清楚 | pass | 已排除 source truth 修复和新业务事实生成 |
| 是否越界 | pass | 未展开任务调度、批处理、重试或并发实现 |

---

## 10. 总体边界说明

Step 05 要先把 10 个主要组成部分的职责切面钉住,否则 Step 06 以后很容易把对象、接口、流程和状态写成“观测平台大杂烩”。对 `L4-observability` 来说,最关键的是把 intake、signal、audit / evidence、handoff、retention / no-write、read / diagnostic、gap、peripheral、adapter support 和 maintenance 分开,这样读侧、派生侧、导出侧和外部协作才不会反向吞并 observation truth。

## 11. 跨组成部分闭环审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在重复业务主要组成部分 | pass | 当前 10 个组成部分均有独立职责切面,未出现同名或同义重复 |
| 是否存在职责重叠 | pass | `Gap and Degraded Expression` 只做状态表达,`Retention, Replay and No-write Guard` 只做边界防线,`Derived Maintenance and Replay Coordination` 只做维护协调,三者未混层 |
| 是否存在对象候选遗漏 | pass | 每个组成部分都已建立候选池,未出现“有职责无对象线索”的悬空区 |
| 是否存在接缝冲突 | pass | 外部协作统一由 `Product-neutral Adapter and Reference Support` 进入,未出现多个部分同时拥有外部正文 |
| 是否存在 Step 06 展开位置冲突 | pass | 需要独立成节的对象均已按组成部分标明,被排除名称也已说明理由 |
| 是否存在读侧 / 派生侧反写核心 truth 风险 | pass | 已由 `Retention, Replay and No-write Guard` 与各部分非职责共同约束 |
| 是否存在外部 truth 回流为本仓 truth 风险 | pass | 外部 truth 全部通过 ref / summary / handoff / snapshot 处理,未回流成 owner |

## 12. 后续展开一致性检查结论

| 后续 Step | 本步提供的正式输入 | 一致性结论 |
|---|---|---|
| Step 06 关键对象轮廓 | 10 个组成部分的对象发现维度表和各部分对象线索 | pass |
| Step 07 API / 接口骨架 | 各组成部分的代码主体 / 模块和与其他部分接缝 | pass |
| Step 08 关键处理流 / 重要函数数据流 | 各 capability 的输入、输出和副作用 | pass |
| Step 09 状态定义与状态流转 | accepted / rejected / quarantined / degraded / blocked / pending / replay 等状态主语线索 | pass |
| Step 10 异常与边界场景 | 各组成部分的不承担什么和 gap / no-write / visibility / handoff blocked 线索 | pass |

## 13. Step 06 展开门禁

| 门禁项 | 结果 |
|---|---|
| 已明确本仓由哪些主要组成部分构成 | pass |
| 每个组成部分承担什么和不承担什么已写清 | pass |
| 每个组成部分的 capability 清单已形成 | pass |
| 每个组成部分的代码主体 / 模块已回指 Step 04 | pass |
| 对象发现维度表已形成 | pass |
| 每个组成部分的对象线索已形成 | pass |
| 被排除名称已说明不进入 Step 06 的原因 | pass |
| 对象字段、状态、成员函数和工厂函数细节仍保留给 Step 06 | pass |

---

## 14. 回填草稿

以下内容供 Step 14 重建正式 `02-概要设计.md` 时回填。正式正文只摘录已确认结论,不重复问题回答、旧材料诊断或取舍过程。

```md
## 5. 主要组成部分、职责与边界

> 校准来源:
> - `design-calibration/02_hld_step_05_components_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_05_components_boundary.md` 的“结构化中间产物”“各主要组成部分”“跨组成部分闭环审计表”和“Step 06 展开门禁”小节。

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Observation Intake and Safety` | 承接候选观察材料并形成正式准入 / 拒绝 / 隔离 / 降级事实 | `ObservationSyncEntry`;`ObservationAsyncMaterialConsumer`;`ObservationIntakeService`;`SafetyDispositionPolicy`;`ObservationTruthStore` | 不拥有 source truth、外部正文或执行 truth |
| `Correlation and Safe Signal` | 形成 correlation context 和 safe log / metric / trace 语境 | `CorrelationSignalService`;`CorrelationContext`;`SafeSignalPolicy`;`SafeSignalProjectionStore` | 不把 opaque id 或 runtime cache 升级为业务 truth |
| `Audit Projection and Body-free Evidence Linkage` | 形成只读 audit projection 与 body-free evidence linkage | `AuditEvidenceService`;`AuditProjection`;`EvidenceLinkage`;`AuditProjectionStore` | 不拥有 Governance / Artifact / evidence 正文 |
| `Report Handoff and Authenticity` | 形成 report handoff、evidence index input 和真实性提示 | `ReportHandoffService`;`ReportHandoffRecord`;`AuthenticityHintPolicy`;`HandoffOutboxStore` | 不生成最终 verdict 或真实证据 |
| `Retention, Replay and No-write Guard` | 形成 retention marker、活动引用保护和 no-write 违例防线 | `RetentionReplayGuardService`;`RetentionMarker`;`ActiveReferenceProtection`;`NoWriteGuardPolicy`;`ViolationRecordStore` | 不拥有 archive package 或 source repair truth |
| `Read Query and Diagnostic Consumption` | 提供只读查询、诊断摘要和可见性判断 | `ObservationReadQueryService`;`DiagnosticViewService`;`ReadVisibilityPolicy`;`ObservationReadModelStore` | 不下发控制命令,不修复 source truth |
| `Gap and Degraded Expression` | 统一表达 missing / degraded / blocked / not-visible / unsafe output | `GapVisibilityService`;`GapState`;`DegradedOutputPolicy`;`GapStatusView` | 不补造默认成功 |
| `Peripheral Consumption and Export` | 向 dashboard、alert、报表和 external export 提供只读消费面 | `PeripheralConsumptionService`;`DashboardAlertExportView`;`ExternalAuditExportPreparation`;`PeripheralReadStore` | 不反写 observation truth |
| `Product-neutral Adapter and Reference Support` | 提供外部引用、快照、safe summary 和产品中立适配边界 | `ObservationSourceAdapterPort`;`IdentitySubjectReferencePort`;`GovernanceArtifactEvidenceReferencePort`;`RuntimeSandboxSummaryPort`;`ArchiveReportHandoffPort`;`ReferenceSnapshotStore` | 不拥有外部正文或产品配置 truth |
| `Derived Maintenance and Replay Coordination` | 承接 projection rebuild、reference refresh、gap scan、rollup rebuild 和派生维护 | `ProjectionMaintenanceJob`;`ReferenceRefreshJob`;`GapScanJob`;`RollupRebuildJob`;`DerivedMaintenanceService` | 不生成新业务事实,不覆盖 observation truth |
```

---

## 15. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP05-001` | Step 06 是否把 `Observation Intake and Safety` 下的 `ObservationReceipt` 与 `SafetyDisposition` 作为分开的独立对象,还是作为同一聚合内不同对象展开 | 当前先分别保留为候选对象,Step 06 再按对象骨架和状态边界收口 |
| `Q-HLD-STEP05-002` | `Peripheral Consumption and Export` 下的 `ExternalAuditExportPreparation` 是否最终作为 projection 还是 state object 落地 | 当前保留双重线索,Step 06 再按对象类型正式化 |
| `Q-HLD-STEP05-003` | 旧 Step 05 文件是否需要立即删除 | 当前不做删除,统一作为 `historical_material_replaced`;后续只承认本轮 Step 05 产物 |

---

## 16. 自检

| 检查项 | 结果 |
|---|---|
| 是否以 Step 04 的业务主要组成部分为主语 | pass |
| 是否为每个组成部分写清了承担什么和不承担什么 | pass |
| 是否为每个组成部分写清了 capability 清单、代码主体和对象线索 | pass |
| 是否形成了对象发现维度表 | pass |
| 是否形成了各部分交互总图 | pass |
| 是否形成了每个部分的停审记录和跨组成部分闭环审计 | pass |
| 是否未展开对象字段、状态函数、接口 schema 或实现流程 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 06 的上游 blocker | no |

---

## 17. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 5、概要书写规范 4.5、新版 `00`、新版 `01`、Step 03~04 当前产物和 L1 参考粒度重建 Step 05;旧 Step 05 已降级为 historical material | wait_user_confirmation_before_step_06 |
