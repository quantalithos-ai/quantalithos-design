# L4-observability 02-概要设计 Step 04 · 代码主体框架总览

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 05

---

## 1. 本步目标

把 `01-架构设计.md` 已收稳的核心子域、支撑子域、运行承载、依赖方向和同步 / 异步 / 后台分层,转译为后续 `03-详细设计.md` 可以继续展开的代码主体框架。

本步只回答三件事:

- 哪些名称是 `L4-observability` 在概要设计层必须固定的业务主要组成部分。
- 这些组成部分分别会落到哪些正式代码主体骨架上。
- Inbound / Operations / Application Services / Domain Model / Ports / Persistence / Projection / Outbox 这些实现分层如何安放这些主体。

本步不定义代码目录、crate、文件路径、完整 trait / struct、完整 DTO / schema、数据库表、topic、外部产品选型或部署结构。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/02_hld_step_01_upstream_boundary.md` | 已完成 | 提供 `02` 当前只能承接什么、不能重写什么、历史材料如何处理。 |
| `projects/L4-observability/design-calibration/02_hld_step_02_scope.md` | 已完成 | 提供“可实现结构骨架层”的目标、非范围和深度口径。 |
| `projects/L4-observability/design-calibration/02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、redaction-first、body-free、只读 / no-write、路径分层和依赖裁剪硬约束。 |
| `projects/L4-observability/01-架构设计.md` §6 | 当前正式架构基线 | 提供核心子域、支撑子域、本地索引 / 投影 / 引用层的正式划分。 |
| `projects/L4-observability/01-架构设计.md` §7 | 当前正式架构基线 | 提供同步入口、异步观察材料消费、后台维护与交接派生、真相承载和派生承载的运行承载骨架。 |
| `projects/L4-observability/01-架构设计.md` §8 | 当前正式架构基线 | 提供核心语义角色、编排 / 承接角色、外部能力接缝角色、派生消费辅助角色和技术承载角色的依赖方向。 |
| `projects/L4-observability/01-架构设计.md` §9~§10 | 当前正式架构基线 | 提供正式真相、派生数据、引用数据、一致性策略和关键交互方式。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 4 | 约束本步必须产出 `架构模块到代码主体映射图`、`实现分层视图`、关系说明和关键判断。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.4 与 `5.3.4 ASCII 图统一格式` | 约束图必须采用统一 ASCII 格式,且必须区分业务主要组成部分与实现分层。 |
| `projects/L1-governance/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 作为 Step 04 粒度参考,对齐“业务主语 + 实现分层 + 两张图 + 关键判断”的写法。 |
| `projects/L1-artifact/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 作为 Step 04 粒度参考,对齐“不要把运行承载方式或技术层名误写成业务组成部分”的收口方式。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 仅作为 historical material,识别旧 Step 04 直接复用 Step 03 对象 / schema 心智且缺少两张图的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 04 标准、L1 对标和前序 Step 结果 | done | 本文件 §2 |
| 从 `01-架构设计` 提炼业务主要组成部分和运行承载骨架 | done | 本文件 §4.1、§4.2、§8.1 |
| 从 `01-架构设计` 提炼实现分层和依赖方向 | done | 本文件 §4.3、§8.3 |
| 诊断旧 Step 04 和旧正式 `02` 的结构漂移问题 | done | 本文件 §5 |
| 输出两张 ASCII 图和业务模块 / 实现分层关系说明 | done | 本文件 §8.2、§8.3、§8.4 |
| 写出正式 §4 的回填草稿 | done | 本文件 §9 |
| 完成自检并回写 flow / 项目台账 | done | 本文件 §11、§12 |

---

## 4. SOP 问题回答

### 4.1 架构层已经收稳的模块,分别应落到哪些代码主体骨架上?

当前架构模块到代码主体骨架的映射应按以下口径承接:

- `观测材料准入与安全处置核心` 落到 `ObservationSyncEntry`、`ObservationAsyncMaterialConsumer`、`ObservationIntakeService`、`SafetyDispositionPolicy`、`ObservationTruthStore` 这组主体上,负责把候选观察材料转成 accepted / rejected / quarantined / degraded 的正式观察面事实。
- `关联语境与安全信号核心` 落到 `CorrelationSignalService`、`CorrelationContext`、`SafeSignalPolicy`、`SafeSignalProjectionStore` 和来源引用 / 摘要 port 上,负责让 safe log / metric / trace 与 source ref、trace、causation 和 actor / subject 语境共同成立。
- `审计投影与 body-free 证据关联核心` 落到 `AuditEvidenceService`、`AuditProjection`、`EvidenceLinkage`、`EvidenceReferencePort`、`AuditProjectionStore` 这组主体上,负责形成只读审计投影和不保存正文的证据关联。
- `报告交接与证据真实性核心` 落到 `ReportHandoffService`、`ReportHandoffRecord`、`AuthenticityHintPolicy`、`EvidenceIndexInputView`、`HandoffPreparationPort`、`HandoffOutboxStore` 这组主体上,负责交接报告材料线索、脱敏状态、缺口说明和真实性提示。
- `留存重建与 no-write 防线核心` 落到 `RetentionReplayGuardService`、`RetentionMarker`、`ActiveReferenceProtection`、`NoWriteGuardPolicy`、`ViolationRecordStore` 这组主体上,负责留存保护、rebuild / replay 约束和 no-write 违例记录。
- `只读查询与诊断消费上下文` 落到 `ObservationReadQueryService`、`DiagnosticViewService`、`ReadVisibilityPolicy`、`ObservationReadModelStore` 这组主体上,负责只读查询、诊断摘要读取和可见性判断。
- `缺口降级表达上下文` 落到 `GapVisibilityService`、`GapState`、`DegradedOutputPolicy`、`GapStatusView` 这组主体上,负责 missing / degraded / blocked / not-visible / unsafe output 的统一表达。
- `外围消费与导出上下文` 落到 `PeripheralConsumptionService`、`DashboardAlertExportView`、`ExternalAuditExportPreparation`、`PeripheralReadStore` 这组主体上,负责 dashboard、alert、管理报表、GRC 导出和 anomaly analysis 这类只读消费材料。
- `产品中立适配边界上下文` 与本地 `引用 / 快照 / 交接支撑` 共同落到 `ObservationSourceAdapterPort`、`IdentitySubjectReferencePort`、`GovernanceArtifactEvidenceReferencePort`、`RuntimeSandboxSummaryPort`、`ArchiveReportHandoffPort`、`ReferenceSnapshotStore` 这组主体上,负责外部协作语境的受控进入。
- `派生维护与重放协调上下文` 落到 `ProjectionMaintenanceJob`、`ReferenceRefreshJob`、`GapScanJob`、`RollupRebuildJob`、`DerivedMaintenanceService` 这组主体上,负责派生视图维护、引用刷新、gap scan 和 rollup rebuild,但不反写 source truth。

### 4.2 哪些主体属于 Inbound / Operations,哪些属于 Application Services?

当前应按如下口径区分:

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Inbound | `ObservationSyncEntry` | 承接只读查询、诊断读取、交接读取、受控材料提交和管理触发,把外部请求变成内部应用输入。 |
| Inbound | `ObservationAsyncMaterialConsumer` | 承接 `L0-bus`、source owner、identity、governance、artifact、runtime、sandbox 的观察材料或安全摘要送达。 |
| Operations | `ProjectionMaintenanceJob`;`ReferenceRefreshJob`;`GapScanJob`;`RollupRebuildJob` | 只负责派生维护、引用刷新、gap scan 和 rebuild / replay 协调,不得生成新的外部业务事实。 |
| Application Services | `ObservationIntakeService`;`CorrelationSignalService`;`AuditEvidenceService`;`ReportHandoffService`;`RetentionReplayGuardService`;`ObservationReadQueryService`;`DiagnosticViewService`;`GapVisibilityService`;`PeripheralConsumptionService`;`DerivedMaintenanceService` | 负责事务编排、策略调用、store / port 调用、handoff / outbox 形成和失败状态落点。 |

Inbound 和 Operations 描述的是“系统如何被触发”;Application Services 描述的是“用例如何被编排”。它们都不是业务主要组成部分名称。

### 4.3 哪些主体属于 Domain Model,哪些属于 Ports / Persistence / Projection / Outbox?

当前应按如下口径区分:

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Domain Model | `ObservationReceipt`;`SafetyDisposition`;`CorrelationContext`;`SafeSignal`;`AuditProjection`;`EvidenceLinkage`;`ReportHandoffRecord`;`AuthenticityHint`;`RetentionMarker`;`ActiveReferenceProtection`;`NoWriteViolation`;`GapState` | 表达本仓正式 observation truth、marker、可见性和禁止事项。 |
| Domain Policy | `SafetyDispositionPolicy`;`SafeSignalPolicy`;`EvidenceVisibilityPolicy`;`AuthenticityHintPolicy`;`NoWriteGuardPolicy`;`ReadVisibilityPolicy`;`DegradedOutputPolicy` | 表达 redaction-first、body-free、只读、真实性提示、visibility 和 no-write 规则。 |
| Ports | `ObservationSourceAdapterPort`;`IdentitySubjectReferencePort`;`GovernanceArtifactEvidenceReferencePort`;`RuntimeSandboxSummaryPort`;`ArchiveReportHandoffPort`;`EvidenceReferencePort`;`HandoffPreparationPort` | 表达外部协作能力,不把外部正文或外部 truth 拉入本仓。 |
| Persistence | `ObservationTruthStore`;`AuditProjectionStore`;`ViolationRecordStore`;`ReferenceSnapshotStore` | 承载 observation truth、审计投影、违例记录和引用 / 快照事实。 |
| Projection | `SafeSignalProjectionStore`;`ObservationReadModelStore`;`GapStatusView`;`DashboardAlertExportView`;`PeripheralReadStore`;`EvidenceIndexInputView` | 承载查询、诊断、外围消费和交接准备所需的只读派生结构。 |
| Outbox / Handoff | `HandoffOutboxStore` | 承载 report handoff、外部交接和变化传播意图,传播失败不取消本仓 truth。 |

### 4.4 哪些名称必须在概要设计层先点名,否则详细设计会重新发明主语?

本步必须先固定以下正式代码主体主语:

- 业务主要组成部分名称:
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

这些名称先作为骨架主语出现,完整字段、函数签名、DTO、错误、持久化契约和产品参数留给 `03~07`。

### 4.5 哪些内容已经是代码目录、文件路径或框架实现,不应在本步展开?

本步不展开:

- crate / module / file tree
- handler / service / repo 的具体文件路径
- trait / struct / enum 的完整定义
- HTTP path、topic、event payload、JSON / proto / handoff schema
- 数据库表、索引、对象存储、消息产品、搜索或调度产品
- OTel、Prometheus、Grafana、TimescaleDB、GRC export 产品和旧性能指标
- DI 框架、任务执行器、缓存、重试策略、事务脚本和部署结构

---

## 5. 当前文档问题诊断

| 旧材料 / 当前风险 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `design-calibration/02_hld_step_04_code_subject_framework.md` | 实际上延续了 Step 03 的对象 / schema 列表,没有真正把架构模块转译为代码主体框架 | 重新改写为真正的 `代码主体框架总览`,并补齐两张 ASCII 图 |
| 旧 Step 04 | 没有区分业务主要组成部分和实现分层 | 当前显式区分 “业务主要组成部分” 与 `Inbound / Operations / Application / Domain / Ports / Projection / Outbox` |
| 旧 Step 04 | 没有稳定同步入口、异步消费和后台维护的运行分层主语 | 当前从 `01` 的运行承载和依赖方向回推正式代码主体骨架 |
| 旧正式 `02-概要设计.md` | 容易直接从 log / metric / trace / audit 对象或产品候选开始讲,缺少第一层代码主体结构 | 本步先钉住“哪些是业务主语、哪些是承载层” |
| 旧自动顺推链 | 容易把 Step 04 写完后直接推进 Step 05 或装配正式文档 | 当前 gate 只允许 `wait_user_confirmation_before_step_05` |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 第一层结构 | 对象 / schema / 产品心智混写 | 先稳定业务主要组成部分与代码主体骨架 |
| 运行承载 | 同步 / 异步 / 后台路径未形成正式主语 | 明确 `ObservationSyncEntry`、`ObservationAsyncMaterialConsumer` 和维护 jobs |
| 实现分层 | 容易把 Application / Domain / Ports 混成业务模块名 | 显式区分业务主要组成部分与实现分层 |
| 外部关系 | 外部仓和外部产品容易被误写成本仓内部模块 | 外部对象只能通过 port、reference、snapshot、handoff 或 outbox 协作进入 |
| 下游承接 | 详细设计需要重新发明 service / store / port / job 主语 | Step 04 先固定可继续展开的代码主体骨架 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接按架构子域名展开整章,不点名代码主体 | 与 `01` 承接最直接 | `03` 仍需重新发明 service、store、job 和 port 主语 | 不采用 |
| 方案 B: 直接按 `Inbound / Application / Domain / Ports` 展开整章 | 技术分层清楚 | 会丢失观测材料准入、审计证据、留存 no-write 等业务主线 | 不采用 |
| 方案 C: 采用“业务主要组成部分 + 代码主体骨架 + 实现分层”三层映射 | 同时保护业务边界和后续可实现安放方式 | 需要额外说明哪些名称不能混用 | 采用 |
| 方案 D: 把同步 / 异步 / 后台三类运行单元直接当最终业务组成部分 | 运行视角直观 | 会把承载方式误当业务结构中心 | 不采用 |

---

## 8. 结构化中间产物

### 8.1 架构模块到代码主体映射表

| 架构模块 / 上下文 | 代码主体骨架 | 所在实现分层 | 当前说明 |
|---|---|---|---|
| 观测材料准入与安全处置核心 | `ObservationSyncEntry`;`ObservationAsyncMaterialConsumer`;`ObservationIntakeService`;`SafetyDispositionPolicy`;`ObservationTruthStore` | `Inbound`;`Application Services`;`Domain Policy`;`Persistence` | 负责把候选观察材料变成正式 observation truth 入口事实 |
| 关联语境与安全信号核心 | `CorrelationSignalService`;`CorrelationContext`;`SafeSignalPolicy`;`SafeSignalProjectionStore`;`ObservationSourceAdapterPort` | `Application Services`;`Domain Model`;`Domain Policy`;`Projection`;`Ports` | 负责 safe log / metric / trace 与 source / trace / causation 语境成立 |
| 审计投影与 body-free 证据关联核心 | `AuditEvidenceService`;`AuditProjection`;`EvidenceLinkage`;`EvidenceReferencePort`;`AuditProjectionStore` | `Application Services`;`Domain Model`;`Ports`;`Persistence` | 负责只读审计投影和 body-free 证据线索 |
| 报告交接与证据真实性核心 | `ReportHandoffService`;`ReportHandoffRecord`;`AuthenticityHintPolicy`;`EvidenceIndexInputView`;`HandoffPreparationPort`;`HandoffOutboxStore` | `Application Services`;`Domain Model`;`Domain Policy`;`Projection`;`Ports`;`Outbox` | 负责交接线索、缺口说明和真实性提示 |
| 留存重建与 no-write 防线核心 | `RetentionReplayGuardService`;`RetentionMarker`;`ActiveReferenceProtection`;`NoWriteGuardPolicy`;`ViolationRecordStore` | `Application Services`;`Domain Model`;`Domain Policy`;`Persistence` | 负责留存保护、重放 / 重建边界和违例事实 |
| 只读查询与诊断消费上下文 | `ObservationReadQueryService`;`DiagnosticViewService`;`ReadVisibilityPolicy`;`ObservationReadModelStore` | `Application Services`;`Domain Policy`;`Projection` | 负责只读读取面与诊断消费面 |
| 缺口降级表达上下文 | `GapVisibilityService`;`GapState`;`DegradedOutputPolicy`;`GapStatusView` | `Application Services`;`Domain Model`;`Domain Policy`;`Projection` | 负责统一表达 missing / degraded / blocked / not-visible |
| 外围消费与导出上下文 | `PeripheralConsumptionService`;`DashboardAlertExportView`;`ExternalAuditExportPreparation`;`PeripheralReadStore` | `Application Services`;`Projection`;`Persistence` | 负责 dashboard、alert、报表、GRC 导出等外围只读消费 |
| 产品中立适配与引用支撑 | `IdentitySubjectReferencePort`;`GovernanceArtifactEvidenceReferencePort`;`RuntimeSandboxSummaryPort`;`ArchiveReportHandoffPort`;`ReferenceSnapshotStore` | `Ports`;`Persistence` | 负责外部协作语境、引用、快照和交接引用支撑 |
| 派生维护与重放协调上下文 | `ProjectionMaintenanceJob`;`ReferenceRefreshJob`;`GapScanJob`;`RollupRebuildJob`;`DerivedMaintenanceService` | `Operations`;`Application Services` | 负责派生维护、引用刷新、gap scan 和 rebuild 协调 |

#### 架构模块到代码主体映射图

```text
L4-observability
│
├─ 1. Observation Intake and Safety
│  ├─ ObservationSyncEntry                    受控同步入口
│  ├─ ObservationAsyncMaterialConsumer        异步观察材料消费
│  ├─ ObservationIntakeService                准入与安全处置编排
│  ├─ SafetyDispositionPolicy                 redaction / forbidden body 规则
│  └─ ObservationTruthStore                   保存准入与安全事实
│
├─ 2. Correlation and Safe Signal
│  ├─ CorrelationSignalService                关联语境与安全信号编排
│  ├─ CorrelationContext                      trace / causation / source ref 语境
│  ├─ SafeSignalPolicy                        safe log / metric / trace 规则
│  ├─ SafeSignalProjectionStore               安全信号读侧承载
│  └─ ObservationSourceAdapterPort            来源安全摘要接缝
│
├─ 3. Audit Projection and Body-free Evidence Linkage
│  ├─ AuditEvidenceService                    审计投影与证据线索编排
│  ├─ AuditProjection                         只读审计投影主语
│  ├─ EvidenceLinkage                         body-free 证据关联主语
│  ├─ EvidenceReferencePort                   证据引用接缝
│  └─ AuditProjectionStore                    审计投影承载
│
├─ 4. Report Handoff and Authenticity
│  ├─ ReportHandoffService                    交接编排
│  ├─ ReportHandoffRecord                     交接事实主语
│  ├─ AuthenticityHintPolicy                  真实性提示规则
│  ├─ EvidenceIndexInputView                  交接输入读侧
│  ├─ HandoffPreparationPort                  对外交接接缝
│  └─ HandoffOutboxStore                      交接传播意图
│
├─ 5. Retention, Replay and No-write Guard
│  ├─ RetentionReplayGuardService             留存与重放边界编排
│  ├─ RetentionMarker                         留存标记主语
│  ├─ ActiveReferenceProtection               活动引用保护主语
│  ├─ NoWriteGuardPolicy                      no-write 规则
│  └─ ViolationRecordStore                    违例事实承载
│
├─ 6. Read Query and Diagnostic Consumption
│  ├─ ObservationReadQueryService             只读查询编排
│  ├─ DiagnosticViewService                   诊断读取编排
│  ├─ ReadVisibilityPolicy                    可见性规则
│  └─ ObservationReadModelStore               查询 / 诊断读侧
│
├─ 7. Gap and Degraded Expression
│  ├─ GapVisibilityService                    缺口与降级编排
│  ├─ GapState                                缺口状态主语
│  ├─ DegradedOutputPolicy                    降级输出规则
│  └─ GapStatusView                           缺口状态读侧
│
├─ 8. Peripheral Consumption and Export
│  ├─ PeripheralConsumptionService            外围消费编排
│  ├─ DashboardAlertExportView                dashboard / alert / export 读侧
│  ├─ ExternalAuditExportPreparation          外部审计导出准备
│  └─ PeripheralReadStore                     外围消费承载
│
├─ 9. Product-neutral Adapter and Reference Support
│  ├─ IdentitySubjectReferencePort            身份引用接缝
│  ├─ GovernanceArtifactEvidenceReferencePort 治理 / 制品 / 证据引用接缝
│  ├─ RuntimeSandboxSummaryPort               运行 / sandbox 摘要接缝
│  ├─ ArchiveReportHandoffPort                archive / report 交接接缝
│  └─ ReferenceSnapshotStore                  引用 / 快照承载
│
└─ 10. Derived Maintenance and Replay Coordination
   ├─ ProjectionMaintenanceJob                派生维护任务
   ├─ ReferenceRefreshJob                     引用刷新任务
   ├─ GapScanJob                              缺口扫描任务
   ├─ RollupRebuildJob                        rollup 重建任务
   └─ DerivedMaintenanceService               维护编排服务
```

关键说明：
- 这张图表达的是“架构模块如何落到代码主体骨架”,不是代码目录、文件路径或 crate 结构。
- 图中的 10 个顶层名称是业务主要组成部分候选,其下的 service / policy / store / port / job 才是代码主体骨架。
- `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L2-runtime`、`L4-archive` 和外部产品没有出现在树内,因为它们只通过接缝和引用协作,不是本仓内部主体。
- `DashboardAlertExportView`、`EvidenceIndexInputView`、`GapStatusView` 这些读侧主体只能消费 observation truth,不能反向成为 truth source。

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌──────────────────────────────────────────────┐
│ Inbound / Operations                         │
│ ObservationSyncEntry                         │
│ ObservationAsyncMaterialConsumer             │
│ ProjectionMaintenanceJob / ReferenceRefresh  │
│ GapScanJob / RollupRebuildJob                │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Application Services                         │
│ ObservationIntake / CorrelationSignal        │
│ AuditEvidence / ReportHandoff                │
│ RetentionReplayGuard / ReadQuery / Diagnostic│
│ GapVisibility / Peripheral / DerivedMaintain │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Domain Model                                 │
│ ObservationReceipt / CorrelationContext      │
│ AuditProjection / EvidenceLinkage            │
│ ReportHandoffRecord / RetentionMarker        │
│ ActiveReferenceProtection / NoWriteViolation │
│ GapState / domain policies                   │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Ports / Persistence / Projection / Outbox    │
│ ObservationTruthStore / AuditProjectionStore │
│ ObservationReadModelStore / ReferenceSnapshot│
│ HandoffPreparationPort / evidence refs       │
│ Archive / runtime / identity / gov-artifact  │
│ HandoffOutboxStore / projection stores       │
└──────────────────────────────────────────────┘
```

关键说明：
- 这张图表达“外部调用、外部事件和运维任务如何进入实现分层”,不表达业务组成部分总表。
- Inbound / Operations 负责进入和触发;Application Services 负责编排;Domain Model 负责 observation truth 主语与规则;Ports / Persistence / Projection / Outbox 负责承载与协作。
- 同一个业务主要组成部分会跨越多个实现分层,例如 `Retention, Replay and No-write Guard` 同时需要 service、domain、store、job 和 outbox。
- 同一个实现分层也会服务多个业务主要组成部分,因此不能把 `Application Services`、`Domain Model` 或 `Projection` 当作 Step 05 的业务组成部分名称。

### 8.4 业务模块与实现分层关系说明表

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 指 `Observation Intake and Safety`、`Correlation and Safe Signal`、`Audit Projection and Body-free Evidence Linkage`、`Report Handoff and Authenticity`、`Retention, Replay and No-write Guard`、`Read Query and Diagnostic Consumption`、`Gap and Degraded Expression`、`Peripheral Consumption and Export`、`Product-neutral Adapter and Reference Support`、`Derived Maintenance and Replay Coordination` 这些从架构设计承接而来的结构主语。 |
| 实现分层 | 指 `Inbound`、`Operations`、`Application Services`、`Domain Model`、`Ports`、`Persistence`、`Projection`、`Outbox` 这些代码组织层,它们说明“代码如何安放这些主体”。 |
| 共享支撑代码主体族 | `ObservationTruthStore`、`ReferenceSnapshotStore`、`HandoffOutboxStore`、各类 reference port、各类 read model store 会同时服务多个业务主要组成部分,但它们不是业务组成部分本身。 |
| 二者关系 | 业务主要组成部分回答“本仓做什么”;实现分层回答“这些事情分别通过哪类代码主体承载”;一个业务组成部分通常跨多个实现分层,一个实现分层通常承载多个业务组成部分。 |
| 不可混用原因 | 把实现分层当业务模块,会让 Step 05 失去稳定业务边界;把业务模块当代码层名,会让 Step 06~09 误把对象、接口、流程和状态直接绑定到目录或技术层。 |

### 8.5 关键判断

1. `Observation Intake and Safety` 到 `Derived Maintenance and Replay Coordination` 这 10 个名称是后续 Step 05 应继续展开的业务主要组成部分,因为它们直接承接架构子域、接缝主线和关键观察事实。
2. `ObservationSyncEntry`、`ObservationAsyncMaterialConsumer` 和各类 `*Job` 是运行承载方式,不是业务主要组成部分;它们描述“如何进入系统”,不描述“业务上在做什么”。
3. `ObservationIntakeService`、`AuditEvidenceService`、`ReportHandoffService`、`RetentionReplayGuardService` 等是应用编排主体,它们负责组织用例,但不等于业务组成部分名称本身。
4. `ObservationTruthStore`、`ObservationReadModelStore`、`ReferenceSnapshotStore`、`HandoffOutboxStore`、各类 port 和 projection store 是承载层主体,它们保护 truth / read / handoff / reference 边界,但不能反向定义 observation truth。
5. `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L2-runtime`、`L4-sandbox`、`L4-archive`、SDK / console 和外部产品都不是本仓内部代码主体;它们只能通过 ref、summary、signal、handoff、adapter 或 export boundary 参与协作。

---

## 9. 回填草稿

以下内容供 Step 14 重建正式 `02-概要设计.md` 时回填。正式正文只摘录已确认结论,不重复问题回答、旧材料诊断或取舍过程。

```md
## 4. 代码主体框架总览

> 校准来源:
> - `design-calibration/02_hld_step_04_code_subject_framework.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_04_code_subject_framework.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节。

当前 `L4-observability` 的代码主体框架不是按目录、产品或对象字段组织,而是先按业务主要组成部分稳定 observation truth 主线,再通过 `Inbound / Operations / Application Services / Domain Model / Ports / Persistence / Projection / Outbox` 等实现分层承载这些主体。业务主要组成部分包括 observation intake、安全信号、审计证据、report handoff、留存 no-write、只读诊断、gap 表达、外围消费、产品中立适配与引用支撑、派生维护与 replay 协调。

#### 架构模块到代码主体映射图

```text
L4-observability
│
├─ 1. Observation Intake and Safety
│  ├─ ObservationSyncEntry
│  ├─ ObservationAsyncMaterialConsumer
│  ├─ ObservationIntakeService
│  └─ ObservationTruthStore
│
├─ 2. Correlation and Safe Signal
│  ├─ CorrelationSignalService
│  ├─ CorrelationContext
│  ├─ SafeSignalPolicy
│  └─ SafeSignalProjectionStore
│
└─ ...
```

关键说明：
- 该图表达业务主要组成部分与代码主体骨架的映射
- 不表达目录结构、文件路径或完整实现细节

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌──────────────────────────┐
│ Inbound / Operations     │
└───────────┬──────────────┘
            ▼
┌──────────────────────────┐
│ Application Services     │
└───────────┬──────────────┘
            ▼
┌──────────────────────────┐
│ Domain Model             │
└───────────┬──────────────┘
            ▼
┌──────────────────────────┐
│ Ports / Persistence      │
└──────────────────────────┘
```

关键说明：
- 该图表达外部入口如何进入实现分层
- 不表达业务组成部分之间的详细职责和接缝

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 回答本仓“做什么” |
| 实现分层 | 回答代码“如何安放这些主体” |
| 关系 | 一个业务组成部分跨多个实现分层,一个实现分层承载多个业务组成部分 |
```

---

## 10. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP04-001` | Step 05 是否保持当前 10 个业务主要组成部分,还是在职责展开时做少量并合 | 当前先按 10 个业务主要组成部分保持稳定,Step 05 若做并合必须证明不损失边界可审查性 |
| `Q-HLD-STEP04-002` | `引用 / 快照 / 交接支撑` 是否在 Step 05 中单列成独立组成部分 | 当前先并入 `Product-neutral Adapter and Reference Support`,Step 05 再根据职责边界决定是否拆开 |
| `Q-HLD-STEP04-003` | 旧 Step 04 文件是否需要立即删除 | 当前不做删除,统一作为 `historical_material_replaced`;后续只承认本轮 Step 04 产物 |

---

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否产出了 `架构模块到代码主体映射图` | pass |
| 是否产出了 `实现分层视图` | pass |
| 是否明确区分了业务主要组成部分与实现分层 | pass |
| 是否未把外部仓、角色、产品或上下文对象写成本仓内部代码主体 | pass |
| 是否未下沉到代码目录、文件路径、完整 trait / struct、数据库表或接口 schema | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 05 的上游 blocker | no |

---

## 12. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 4、概要书写规范 4.4、新版 `01`、Step 01~03 当前产物和 L1 参考粒度重建 Step 04;旧 Step 04 已降级为 historical material | wait_user_confirmation_before_step_05 |
