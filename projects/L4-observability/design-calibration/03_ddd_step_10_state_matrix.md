# L4-observability 03-详细设计 Step 10 · 状态机与转换矩阵

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填章节: `03-详细设计.md` §9 状态机与转换矩阵
> 当前模式: full-restart
> 当前门禁: Step 10 完成后停审,等待用户确认后才进入 Step 11

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 10 `定义状态机与转换矩阵` |
| 输出文件 | `design-calibration/03_ddd_step_10_state_matrix.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | `completed_design_record_with_affected_open` |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | wait_user_confirmation_before_step_11 |

本文件的 `pass` 行只表示某一状态族的局部矩阵已经写出；当前 Step 的权威结论是
`pass_with_affected_open`。协议、状态机和技术结果均已有设计记录，但上游 schema、owner、
UoW、recovery 和 external phase affected 仍必须保留，不能由状态矩阵默认补齐。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 10 | 已读取 | 约束先筛选状态主语、按状态族分批、逐状态机停审、最后做跨状态机命名 / 触发 / 测试审计 |
| `standards/document/详细设计书写规范.md` 5.9 | 已读取 | 约束状态集合、ASCII 图、转换矩阵、非法转换错误和正式状态名 |
| `design-calibration/02_hld_step_09_state_machine.md` | 已完成 | 提供概要层状态族、允许 / 禁止迁移和传播关系 |
| `design-calibration/03_ddd_step_06_object_contracts.md` | 已完成并由本步闭口缺口 | 提供对象字段、state enum、factory、member method、policy 和 entry / report carrier |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 versioned read、repository save、outbox publication marker update 和 projection / handoff / reference 持久化面 |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 Command / Consumer / Job outcome surface,用于区分 lifecycle state 与一次性结果 |
| `design-calibration/03_ddd_step_09_function_flows.md` | 已完成 | 提供 16 Command、14 Query、9 Consumer、12 Outbound、9 Job 的状态触发、事务和副作用 |
| 旧 `03_ddd_step_10_state_matrix.md` | historical material | 旧文件仅 45 行,使用 `ObservationIngestReceipt`、`RedactionDecision`、`AuditEventProjection` 等旧对象名;本步全量替换 |
| `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` | 已读取 | 作为 1303 行逐状态机矩阵、停审、reserved transition 和 cross-state audit 粒度参考 |
| `projects/L1-artifact/design-calibration/03_ddd_step_10_state_matrix.md` | 已读取 | 作为 937 行状态族分批、技术状态分类和回填草稿粒度参考 |

## 3. 本步目标

本 Step 把 Step 06 的对象状态、Step 07 的 version / repository / publication 更新面、Step 08 的协议结果和 Step 09 的函数级 flow 串成实现可直接编码的状态契约。

每个正式状态机必须明确:

- 状态集合和终态。
- factory / policy / member method / repository marker update 对应的合法转换。
- 每条转换可落码的前置字段或 policy decision。
- object state、history / record、outbox、projection stale、stored result 等副作用边界。
- 非法转换返回的错误类型和无写入纪律。
- 当前 flow 可调用、phase reserved、必须创建新对象三类边界。
- 后续 Step 16 可直接承接的正向 / 反向测试切口。

本 Step 不定义:

- table / collection / index / DDL / isolation,留给 Step 11。
- 完整 error taxonomy、transport mapping 和 rejected audit policy,留给 Step 12。
- retry interval、exhaustion、optimistic conflict retry 和幂等窗口,留给 Step 13。
- adapter / topic / cron / config key,留给 Step 14。
- 正式 `03-详细设计.md` 装配,留给 Step 19。

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Step 06 / 09 中有哪些候选状态主语? | observation truth / marker、handoff / retention / gap、read / reference / maintenance、outbox / idempotency / stored job report,以及 protocol outcome、runtime availability、entry loop carrier 等候选。 |
| 哪些候选必须排除? | 纯 ref/id、append-only record、DTO wrapper、query surface、external truth state、one-shot Command/Consumer/Job outcome、adapter probe snapshot、worker loop cursor、retry counter / SQL lock。 |
| 当前正式状态机数量? | 27 个:6 个 observation truth / safety,9 个 handoff / retention / gap,7 个 read / reference / maintenance,5 个 propagation / replay support。 |
| 状态名来源? | 全部来自修正后的 Step 06 state enum / state value;outbox、handoff readiness、job report 缺口已在本步回写 Step 06。 |
| 触发函数来源? | Step 06 factory/member/policy、Step 07 repository marker update 或 Step 09 application flow。 |
| 非法转换是否写审计? | domain / state object 只返回错误且不写;application 是否保存 rejected surface 由 Step 12 决定,不得在失败事务中写半成品 history / outbox。 |
| phase reserved 如何处理? | 在矩阵中标 `reserved`;当前 handler / worker / job 不得调用,实现不得自行补 protocol 或 route。 |
| Query 是否触发状态变化? | 否。Query 只读取和暴露 visibility / freshness / gap / maintenance surface。 |
| Consumer / Job 是否能修外部或业务 truth? | 否。Consumer 只写本地 receipt / marker / snapshot / gap / history;Job 只维护 projection / reference / publication / delivery / report。 |

## 5. 当前问题诊断与设计取舍

### 5.1 旧材料问题

| 位置 | 问题 | 本步处理 |
|---|---|---|
| 旧 Step 10 | 只有 7 个混合状态主语,且对象名与当前 Step 06 / 09 不一致 | 全量替换,按当前 27 个正式状态机逐机展开 |
| 旧 Step 10 | 没有状态主语筛选、状态族、单机停审或 cross-state audit | 按 SOP 补齐 |
| 概要状态稿 | `PeripheralDelivery::Retryable`、`ExternalAuditExportState` 等口语名与 Step 06 enum 不一致 | 以 Step 06 `PeripheralDeliveryKind::Failed`、`ExportPreparationState` 为正式名 |
| Step 06 | `HandoffReadinessState`、outbox publication、`JobReportState` 只被引用或完全缺失 | 本步先回写正式 enum / object contract,再写矩阵 |
| Step 06 | reference invalid/unavailable、maintenance failure、replay completion、delivery result 等当前 flow 缺 trigger helper | 本步补齐 object method 契约 |

### 5.2 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 用一个 `ObservabilityGlobalState` 管理全部状态 | 表面统一 | 混淆 truth、visibility、delivery、job report,违反 SOP | 不采用 |
| 把所有 enum / outcome 都写成 lifecycle | 看起来覆盖多 | one-shot outcome 和 runtime snapshot 会产生伪转换 | 不采用 |
| 只复述 Step 06 允许来源 / 去向 | 篇幅短 | 缺 flow、前置条件、副作用、错误和 phase boundary | 不采用 |
| 27 个正式状态机逐机矩阵 + 技术结果分类表 | 可落码,边界清楚,可直接生成测试 | 文档较长 | 采用 |

## 6. 状态主语筛选

### 6.1 进入 Step 10 的正式状态主语

| 候选主语 | 来源对象 / 字段 | 是否进入 | 原因 | 状态族 |
|---|---|---|---|---|
| `ObservationReceiptState` | `ObservationReceipt.admission_state` | 是 | observation-owned admission lifecycle,由 Command / Consumer 推进 | observation truth |
| `SafetyDispositionState` | `SafetyDisposition.state` | 是 | redaction-first / quarantine lifecycle | observation truth |
| `CorrelationContextState` | `CorrelationContext.state` | 是 | body-free correlation binding lifecycle | observation truth support |
| `SafeSignalState` | `SafeSignal.state` | 是 | safe signal candidate / recorded / suppressed / stale lifecycle | observation truth |
| `AuditProjectionState` | `AuditProjection.state` | 是 | append-only audit projection visibility lifecycle | audit projection |
| `EvidenceLinkageState` | `EvidenceLinkage.state` | 是 | body-free linkage and visibility lifecycle | audit projection |
| `ReportHandoffState` | `ReportHandoffRecord.state` | 是 | handoff preparation / delivery lifecycle | handoff |
| `HandoffReadinessState` | `ReportHandoffRecord.readiness` | 是 | persisted readiness co-state,由 policy evaluation 推进 | handoff |
| `AuthenticityHintState` | `AuthenticityHint.state` | 是 | real / placeholder / insufficient hint lifecycle | handoff |
| `RetentionMarkerState` | `RetentionMarker.state` | 是 | observation-side hold / release candidate / conflict lifecycle | retention |
| `ActiveReferenceProtectionState` | `ActiveReferenceProtection.state` | 是 | active consumer protection lifecycle | retention |
| `ReplayScopeState` | `ReplayScope.state` | 是 | observation-only replay authorization lifecycle | replay |
| `NoWriteViolationState` | `NoWriteViolation.state` | 是 | forbidden write detection / block / escalation lifecycle | no-write |
| `GapLifecycleState` | `GapState.state` | 是 | missing / not-visible / unsafe gap lifecycle | gap |
| `DegradedOutputKind` | `DegradedOutputState.state` | 是 | persisted degraded / blocked output state | gap |
| `SignalRollupState` | `SignalRollupWindow.state` | 是 | read-side rollup freshness lifecycle | derived |
| `ReadVisibilityKind` | `ReadVisibilityState.kind` | 是 | per-context visibility decision state | read |
| `DiagnosticFreshnessState` | `DiagnosticSummary.freshness` | 是 | diagnostic derived freshness lifecycle | read / derived |
| `ReferenceSnapshotStateKind` | `ReferenceSnapshotState.state` | 是 | body-free external reference resolution / freshness lifecycle | reference |
| `ProjectionMaintenanceStateKind` | `ProjectionMaintenanceState.state` | 是 | projection freshness / rebuild lifecycle | maintenance |
| `ReplayCoordinationKind` | `ReplayCoordinationState.state` | 是 | one replay execution coordination lifecycle | maintenance |
| `RollupRebuildKind` | `RollupRebuildState.state` | 是 | one rollup rebuild execution lifecycle | maintenance |
| `PeripheralDeliveryKind` | `PeripheralDeliveryState.state` | 是 | body-free peripheral delivery lifecycle | propagation |
| `ExportPreparationState` | `ExternalAuditExportPreparation.state` | 是 | external audit export preparation / delivery lifecycle | propagation |
| `OutboxPublicationState` | `ObservationOutboxRecord.state` | 是 | committed payload snapshot publication lifecycle | propagation |
| `IdempotencyReservationState` | `ObservationIdempotencyReservation.state` | 是 | reserve / complete / replay / conflict lifecycle | idempotency |
| `JobReportState` | `ObservationJobReportDraft.state` | 是 | stored job report outcome lifecycle | job report |

### 6.2 排除项

| 候选 | 是否进入状态矩阵 | 原因 | 正式处理 |
|---|---|---|---|
| `ObservationCommandOutcome` | 否 | 一次 Command response outcome,不是持久对象生命周期 | §13 技术结果分类 |
| `ObservationConsumerOutcome` | 否 | 一次 event receipt outcome | §13 技术结果分类 |
| `ObservationJobOutcome` | 否 | public response outcome;`DuplicateReplayed` 不改 stored report | §13 技术结果分类 |
| `EntryDisposition` | 否 | handler / runner one-shot result | §13 技术结果分类 |
| `OperationResultDisposition` | 否 | stored result classification,没有独立 transition method | Step 12 / 13 映射 |
| `AdapterAvailabilityKind` | 否 | runtime probe / config validation 生成的不可变 snapshot | §13 replacement semantics |
| `ObservationCommandHandlerState` / `ObservationQueryHandlerState` | 否 | entry carrier,不持久化、不拥有状态生命周期 | entry tests only |
| `OutboxPublisherLoopState` / `ProjectionWorkerLoopState` | 否 | runtime loop cursor / error carrier;durable state 已由 outbox / maintenance 覆盖 | worker tests only |
| `IntakeDecisionRecord` / `AuditAppendRecord` / 各类 history record | 否 | append-only transition evidence,不允许 in-place state transition | Step 11 持久化 |
| public Query surface / view DTO | 否 | 只投影正式状态,不得反向驱动状态 | Step 08 / 09 Query contract |
| external Governance / Artifact / Identity / Runtime / Sandbox / Archive state | 否 | 外部业务 truth,Observability 无权对象化或推进 | 仅保存 body-free reference snapshot |
| ref / id / cursor / digest / lock / retry counter | 否 | value / technical primitive,无独立生命周期 | Step 11 / 13 |

## 7. 状态族与批次

### 7.1 状态族分组表

| 状态族 | 状态机 | 所属模块 | 主要触发来源 | 停审顺序 |
|---|---|---|---|---|
| observation truth / safety | receipt、safety、correlation、safe signal、audit projection、evidence linkage | `domain` + `application` | intake / signal / audit Commands and Consumers | 10.1 |
| handoff / retention / gap | report handoff、readiness、authenticity、retention、active protection、replay scope、no-write、gap、degraded output | `domain` + `application` | handoff / retention / replay / gap Commands and Jobs | 10.2 |
| read / reference / maintenance | signal rollup、read visibility、diagnostic freshness、reference snapshot、projection maintenance、replay coordination、rollup rebuild | `domain` + `application` + `jobs` | Query exposure、reference Consumer、maintenance Jobs | 10.3 |
| propagation / idempotency / report | peripheral delivery、export preparation、outbox publication、idempotency reservation、job report | `application` + `worker` + `jobs` | export / feedback / publish / shared templates | 10.4 |

### 7.2 状态矩阵批次表

| 批次 | 状态机 | 状态 enum | 主要触发 flow / 函数 | 停审状态 |
|---|---|---|---|---|
| 10.1 | ObservationReceipt | `ObservationReceiptState` | `SubmitObservationMaterialFlow`;consumer intake;`accept/reject/quarantine/degrade` | pass |
| 10.1 | SafetyDisposition | `SafetyDispositionState` | `RecordSafetyDispositionFlow`;sandbox consumer | pass |
| 10.1 | CorrelationContext | `CorrelationContextState` | `BindCorrelationContextFlow`;runtime / sandbox consumer | pass |
| 10.1 | SafeSignal | `SafeSignalState` | `RecordSafeSignalFlow`;runtime / sandbox consumer | pass |
| 10.1 | AuditProjection | `AuditProjectionState` | `AppendAuditProjectionFlow`;source audit consumer | pass |
| 10.1 | EvidenceLinkage | `EvidenceLinkageState` | `LinkBodyFreeEvidenceFlow`;artifact / governance consumer | pass |
| 10.2 | ReportHandoff | `ReportHandoffState` | `PrepareReportHandoffFlow`;delivery job;archive feedback | pass |
| 10.2 | HandoffReadiness | `HandoffReadinessState` | readiness policy in handoff Command / delivery Job | pass |
| 10.2 | AuthenticityHint | `AuthenticityHintState` | `EvaluateAuthenticityHintFlow` | pass |
| 10.2 | RetentionMarker | `RetentionMarkerState` | `SetRetentionMarkerFlow` | pass |
| 10.2 | ActiveReferenceProtection | `ActiveReferenceProtectionState` | `ProtectActiveReferenceFlow` | pass |
| 10.2 | ReplayScope | `ReplayScopeState` | `DefineReplayScopeFlow`;replay Job | pass |
| 10.2 | NoWriteViolation | `NoWriteViolationState` | `RecordNoWriteViolationFlow`;replay/export guards | pass |
| 10.2 | Gap | `GapLifecycleState` | `RecordGapStateFlow`;gap scan;feedback consumer | pass |
| 10.2 | DegradedOutput | `DegradedOutputKind` | gap policy / read / handoff / export assembly | pass |
| 10.3 | SignalRollup | `SignalRollupState` | `RecordSafeSignalFlow`;`RebuildSignalRollupsFlow` | pass |
| 10.3 | ReadVisibility | `ReadVisibilityKind` | read / evidence / handoff visibility policy | pass |
| 10.3 | DiagnosticFreshness | `DiagnosticFreshnessState` | read model rebuild / gap / reference update | pass |
| 10.3 | ReferenceSnapshot | `ReferenceSnapshotStateKind` | snapshot Commands / context Consumers / refresh Job | pass |
| 10.3 | ProjectionMaintenance | `ProjectionMaintenanceStateKind` | accepted stale marker / rebuild Jobs | pass |
| 10.3 | ReplayCoordination | `ReplayCoordinationKind` | `CoordinateObservationReplayFlow` | pass |
| 10.3 | RollupRebuild | `RollupRebuildKind` | `RebuildSignalRollupsFlow` | pass |
| 10.4 | PeripheralDelivery | `PeripheralDeliveryKind` | export Command / delivery Job / feedback Consumer | pass |
| 10.4 | ExportPreparation | `ExportPreparationState` | external audit export Command / delivery Job | pass |
| 10.4 | OutboxPublication | `OutboxPublicationState` | accepted append / `PublishObservationOutboxFlow` | pass |
| 10.4 | IdempotencyReservation | `IdempotencyReservationState` | Command / Consumer / Job shared templates | pass |
| 10.4 | JobReport | `JobReportState` | all 9 Operations Job flows | pass |

### 7.3 27 个状态机与 60 个协议的触发覆盖

下表是本 Step 的 cross-protocol closure index。它只说明哪个协议族可以触发或读取状态主语，
不把一次性 outcome、Query surface 或外部业务 truth升级为状态机。每个状态机的完整转换矩阵
仍以本文件对应章节为准，协议的 exact entry/port/UoW 则以 Step 09 cards 为准。

| 状态族 | 正式状态机 | 触发协议 / 读取协议 | 当前闭合结论 |
|---|---|---|---|
| observation truth / safety | `ObservationReceiptState`, `SafetyDispositionState`, `CorrelationContextState`, `SafeSignalState`, `AuditProjectionState`, `EvidenceLinkageState` | C01-C06; I01-I07; Q01-Q06 | `pass_with_affected_open`; I03/I04/I05 schema、dependency slice 和 body-free authority affected 保留 |
| handoff / retention / gap | `ReportHandoffState`, `HandoffReadinessState`, `AuthenticityHintState`, `RetentionMarkerState`, `ActiveReferenceProtectionState`, `ReplayScopeState`, `NoWriteViolationState`, `GapLifecycleState`, `DegradedOutputKind` | C07-C13; C14; I02/I04/I08/I09; J05-J08; Q06-Q08/Q11-Q12 | `pass_with_affected_open`; report-ref、H13、UoW、external phase affected 保留 |
| read / reference / maintenance | `SignalRollupState`, `ReadVisibilityKind`, `DiagnosticFreshnessState`, `ReferenceSnapshotStateKind`, `ProjectionMaintenanceStateKind`, `ReplayCoordinationKind`, `RollupRebuildKind` | C04/C13/C15-C16; I03/I06; Q03-Q04/Q09-Q14; J02-J06/J09 | `pass_with_affected_open`; query carrier、reference head、progress relation 和 maintenance owner affected 保留 |
| propagation / idempotency / report | `PeripheralDeliveryKind`, `ExportPreparationState`, `OutboxPublicationState`, `IdempotencyReservationState`, `JobReportState` | C14; I08-I09; E01-E12; J01-J09; all mutation protocols | `pass_with_affected_open`; consumer outbox surface、job report ref、external phase/retry accounting affected 保留 |
| 技术结果排除面 | 不新增状态机 | Q01-Q14 的 surface、Command/Consumer/Job outcome、adapter availability、entry carrier | `pass`;这些结果只能由既有 typed mapper 暴露，Query 不推进状态 |

状态矩阵的总量检查为 `27` 个正式状态机、`60` 个协议。`ObservationJobPlanItemState`、
worker loop state 和 adapter probe snapshot 仍是技术协调对象，不计入 27 个正式状态机。

## 8. 通用状态矩阵规则

| 规则 | 正式口径 |
|---|---|
| state name | 必须逐字使用 Step 06 enum variant;不得引入 `Healthy`、`Done`、`Retryable` 等口语别名 |
| trigger | 必须回指 Step 06 factory/member/policy、Step 07 repository marker update 或 Step 09 flow |
| precondition | 只能引用 DTO field、loaded/versioned object、resolver safe outcome、policy decision、stored payload snapshot 或 typed reason |
| domain side effect | member method 只更新对象字段并返回 record / decision;不直接访问 repository / outbox / adapter |
| application side effect | accepted flow 才能 save object/history、append outbox snapshot、mark projection stale、save stored result |
| invalid transition | domain 返回 `DomainError::InvalidStateTransition`;application marker 返回 `ApplicationError::InvalidStateTransition`;job report 返回 `JobError::InvalidReportTransition` |
| invalid write discipline | transition error 时不得 save changed object、history、outbox 或 stale marker;是否保存 rejected protocol surface 由 Step 12 定义 |
| terminal | 终态不可复活;需要重试时创建新对象 / 新 execution / 新 delivery,或使用矩阵明确允许的 retry transition |
| state-preserving operation | 必须显式标为 no state change,仍可更新安全字段或 append record |
| query | Query 不进入 write UoW,不得推进任何状态 |
| external truth | state 只能表达 observation-side truth / marker / projection / delivery,不得表示外部业务 truth 已改变 |
| version | existing object transition 必须使用 Step 07 versioned read / list 的 `expected_version` |
| reserved | 标为 reserved 的状态 / 转换当前没有 public protocol 或 flow,实现不得调用 |

### 8.1 状态机写法模板

```text
[StateMachineName]
  Initial -> Active -> Terminal
  Initial -> RejectedTerminal
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|

## 9. Batch 10.1 · Observation truth / safety 状态矩阵

### 9.1 `ObservationReceiptState`

```text
[ObservationReceipt]
  factory -> Received -> Accepted -> Superseded [reserved]
                      -> Rejected
                      -> Quarantined -> Rejected / Superseded [reserved]
                      -> Degraded -> Accepted / Rejected / Quarantined / Superseded [reserved]
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Received` | 已记录候选材料,尚未完成安全准入 | 否 | accept / reject / quarantine / degrade |
| `Accepted` | 可进入 observation-owned 主线 | 否 | read;reserved supersede |
| `Rejected` | 准入拒绝 | 是 | history / diagnostic read |
| `Quarantined` | forbidden body 或安全未闭口 | 否 | reject;reserved supersede |
| `Degraded` | 仅可按受限语义使用 | 否 | accept / reject / quarantine;reserved supersede |
| `Superseded` | 被更安全或更完整 receipt 替代 | 是 | history read |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Received` | `ObservationReceipt::receive(...)` | submit / bus consumer | body-free `source_ref`,typed purpose,clock | 创建 receipt | save receipt;continue safety evaluation | `DomainError::MissingRequiredReference` |
| `Received` / `Degraded` | `Accepted` | `accept(disposition_ref, actor_ref)` | submit / safety disposition | disposition loaded as `Safe` or `Redacted` | bind disposition;return decision record | save receipt + decision + outbox | `DomainError::InvalidStateTransition` |
| `Received` / `Degraded` / `Quarantined` | `Rejected` | `reject(reason, actor_ref)` | submit / safety disposition | typed reject reason | set rejected;return decision record | save decision;no safe-signal eligibility | `DomainError::InvalidStateTransition` |
| `Received` / `Degraded` | `Quarantined` | `quarantine(reason, actor_ref)` | submit / bus/sandbox consumer | forbidden-body or unclosed safety marker | set quarantined | save quarantine surface;no raw body | `DomainError::InvalidStateTransition` |
| `Received` | `Degraded` | `degrade(reason, actor_ref)` | submit / consumer delayed branch | typed degraded reason | set degraded | save gap/degraded refs when present | `DomainError::InvalidStateTransition` |
| `Accepted` / `Degraded` / `Quarantined` | `Superseded` | reserved;no current callable method | no current flow | future replacement receipt must be persisted and linked | reserved | current implementation must reject | `DomainError::ReservedTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / terminal / trigger | pass | 6 variants match Step 06;supersede explicitly reserved |
| guard / side effect | pass | accepted requires safe/redacted disposition;quarantine never stores body |
| tests | pass | Received accepted/rejected/quarantined/degraded;terminal rewrite rejected;reserved supersede rejected |

### 9.2 `SafetyDispositionState`

```text
[SafetyDisposition]
  factory -> Pending -> Safe
                     -> Redacted
                     -> Rejected
                     -> Quarantined -> Rejected
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | 安全评估未闭口 | 否 | allow redacted/safe / reject / quarantine |
| `Safe` | 可在 observation side 使用 | 是 | read / downstream eligibility |
| `Redacted` | 经裁剪后可使用 | 是 | body-free read / downstream eligibility |
| `Rejected` | 安全策略拒绝 | 是 | diagnostic/history read |
| `Quarantined` | 隔离等待受控处置 | 否 | reject |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `SafetyDisposition::evaluate(...)` | submit / bus consumer | body-free material summary | create pending disposition | same UoW as receipt | `DomainError::MissingRequiredReference` |
| `Pending` | `Safe` | `allow_redacted(marker, summary_ref)` with clean marker | safety disposition | `forbidden_body = false`;safe summary present | state safe;bind summary | receipt may accept;outbox snapshot | `DomainError::SafetyBoundaryViolation` |
| `Pending` | `Redacted` | `allow_redacted(marker, summary_ref)` with redacted marker | safety disposition | valid redaction marker;safe summary present | state redacted | receipt may accept;redacted surface | `DomainError::SafetyBoundaryViolation` |
| `Pending` / `Quarantined` | `Rejected` | `reject_unsafe(evidence)` | submit / safety disposition | body-free forbidden-body evidence marker | state rejected;no body retained | decision/history/outbox as configured | `DomainError::InvalidStateTransition` |
| `Pending` | `Quarantined` | `quarantine(reason)` | submit / sandbox consumer | typed quarantine reason | state quarantined | quarantine receipt;no downstream eligibility | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | all Step 06 variants have current trigger |
| boundary | pass | Safe/Redacted require body-free summary;Rejected/Quarantined never persist body |
| tests | pass | clean/redacted/unsafe/quarantine and all terminal rewrites |

### 9.3 `CorrelationContextState`

```text
[CorrelationContext]
  factory -> Unbound -> Bound <-> Partial
                      \           /
                       -> Invalid <-
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Unbound` | 尚无稳定安全关联 | 否 | bind / degrade / invalidate |
| `Bound` | safe refs 足以支持主线 | 否 | link runtime signal / degrade / invalidate |
| `Partial` | 只具备部分关联线索 | 否 | bind missing refs / invalidate |
| `Invalid` | 关联冲突或不合法 | 是 | diagnostic read |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unbound` | `CorrelationContext::from_receipt(...)` | bind correlation | loaded receipt accepted or degraded-allowed | create context with opaque refs | staged before link record | `DomainError::MissingRequiredReference` |
| `Unbound` / `Partial` | `Bound` | `bind_source(...)` / `link_runtime_signal(...)` | bind / runtime consumer | source matches receipt;required refs now complete | set bound;return link record | save context + link record;mark views stale | `DomainError::CorrelationConflict` |
| `Unbound` / `Bound` | `Partial` | `degrade(reason)` | bind / runtime consumer | typed missing/stale correlation reason | set partial;return link record | gap/degraded surface | `DomainError::InvalidStateTransition` |
| `Unbound` / `Bound` / `Partial` | `Invalid` | `invalidate(reason)` | bind / consumer conflict | conflicting or invalid opaque refs | set invalid;return link record | no safe signal/audit eligibility | `DomainError::InvalidStateTransition` |
| `Bound` | `Bound` | `link_runtime_signal(runtime_signal_ref)` | record safe signal / consumer | body-free runtime/sandbox ref;no conflict | state unchanged;append link | save link only | `DomainError::CorrelationConflict` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | bind/degrade/invalidate functions exist |
| ownership | pass | Bound never upgrades opaque refs into business relationship truth |
| tests | pass | partial recovery,conflicting refs invalid,Invalid terminal,Bound state-preserving link |

### 9.4 `SafeSignalState`

```text
[SafeSignal]
  factory -> Candidate -> Recorded <-> Stale
               |            |          |
               +--------> Suppressed <-+
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Candidate` | signal 尚未通过 safe policy | 否 | record / suppress |
| `Recorded` | observation-owned safe signal 已成立 | 否 | mark degraded/stale / suppress / rollup |
| `Suppressed` | 不得进入 rollup / normal export | 是 | diagnostic read |
| `Stale` | 依赖 reference / projection 已过期 | 否 | revalidate / suppress |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Candidate` | `SafeSignal::from_summary(...)` | record safe signal | valid context + safe summary ref + typed kind | create candidate | no outbox until recorded | `DomainError::MissingRequiredReference` |
| `Candidate` / `Stale` | `Recorded` | `record(policy)` | record safe signal / refresh-backed consumer | policy passes;context not Invalid;safe summary fresh enough | set recorded | save signal;append `SafeSignalRecorded`;rollup stale | `DomainError::PolicyRejected` |
| `Recorded` | `Stale` | `mark_degraded(degraded)` | record signal resolver branch / reference refresh | degraded state Active and stale reason typed | set stale;summary unchanged | mark rollup/read views stale | `DomainError::InvalidStateTransition` |
| `Candidate` / `Recorded` / `Stale` | `Suppressed` | `suppress(reason, actor_ref)` | record signal / sandbox consumer | safety or visibility suppression reason | set suppressed;return link record | no rollup acceptance;diagnostic/gap visible | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | all variants have flow-backed trigger |
| body-free / rollup | pass | summary ref only;Suppressed never enters normal rollup |
| tests | pass | candidate record,stale revalidation,suppress from all nonterminal states,Suppressed terminal |

### 9.5 `AuditProjectionState`

```text
[AuditProjection]
  factory -> PendingAppend -> Appended <-> VisibilityRestricted
                 |               |                |
                 +----------> Suppressed [reserved] <-
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `PendingAppend` | 投影候选尚未形成 append fact | 否 | append / restrict;reserved suppress |
| `Appended` | observation audit projection 已追加 | 否 | append record / restrict;reserved suppress |
| `VisibilityRestricted` | 投影存在但读取受限 | 否 | restore append visibility;reserved suppress |
| `Suppressed` | safety / visibility policy 抑制 | 是 | internal audit read only |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingAppend` | `AuditProjection::create(...)` | append audit / source consumer | body-free audit subject + source audit ref + correlation context | create pending projection | no source audit body | `DomainError::MissingRequiredReference` |
| `PendingAppend` / `VisibilityRestricted` | `Appended` | `append_fact(linkage_ref, actor_ref)` | append audit | valid body-free linkage;visibility permits append | set appended;return append record | save append-only record + outbox | `DomainError::InvalidStateTransition` |
| `PendingAppend` / `Appended` | `VisibilityRestricted` | `restrict_visibility(reason)` | append audit / consumer | typed visibility reason | set restricted;return append record | timeline/handoff expose restricted | `DomainError::InvalidStateTransition` |
| any nonterminal | `Suppressed` | reserved;no current callable method | no current flow | future explicit safety suppression protocol required | reserved | current implementation rejects | `DomainError::ReservedTransition` |
| any nonterminal | same | `attach_gap(gap_ref)` | append audit / consumer gap branch | existing body-free gap ref | state unchanged;append record | mark evidence/handoff views stale | `DomainError::MissingRequiredReference` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | Suppressed is phase reserved;attach_gap is state-preserving |
| ownership | pass | append-only projection never stores or mutates source audit truth |
| tests | pass | append/restrict/restore,attach gap no state change,reserved suppress rejected |

### 9.6 `EvidenceLinkageState`

```text
[EvidenceLinkage]
  factory -> Candidate -> Linked <-> Stale
                 |          |         |
                 |          +<-> NotVisible
                 +------> BodyBlocked
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Candidate` | linkage 尚未通过 body-free / visibility policy | 否 | link / body block / not visible |
| `Linked` | body-free linkage 可用 | 否 | mark stale / not visible |
| `BodyBlocked` | 检测到正文材料 | 是 | diagnostic / quarantine read |
| `NotVisible` | linkage 存在但当前 consumer 不可见 | 否 | re-evaluate to linked / stale |
| `Stale` | 依赖 reference 已过期 | 否 | re-link / not visible |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Candidate` | `EvidenceLinkage::candidate(...)` | link evidence | loaded projection ref + boundary ref + typed evidence purpose + digest summary body-free | create candidate with projection/purpose relation | no handoff eligibility yet | `DomainError::MissingRequiredReference` |
| `Candidate` / `Stale` / `NotVisible` | `Linked` | `link(policy)` | link evidence / reference refresh | body-free policy passes;consumer visibility permits | set linked;clear visibility reason | save linkage + audit record + outbox | `DomainError::BodyFreeBoundaryViolation` |
| `Candidate` | `BodyBlocked` | `body_block(reason)` | link evidence / artifact consumer | resolver detected body material | set body blocked;do not retain body | quarantine/gap surface;no handoff | `DomainError::InvalidStateTransition` |
| `Candidate` / `Linked` / `Stale` | `NotVisible` | `mark_not_visible(reason)` | link evidence / governance consumer | typed visibility decision | set not visible;store reason | evidence index says not-visible,not missing | `DomainError::InvalidStateTransition` |
| `Linked` / `NotVisible` | `Stale` | `mark_stale(reason)` | reference refresh / consumer | formal stale resolver outcome | set stale | mark handoff/evidence views stale | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | all 5 variants and recovery paths closed |
| evidence boundary | pass | BodyBlocked terminal;NotVisible distinct from missing |
| tests | pass | linked/body-blocked/not-visible/stale/relink and terminal rewrite rejection |

### 9.7 Batch 10.1 stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 6 个状态机是否逐机覆盖 | pass_with_affected_open | §9.1~§9.6；上游 owner affected 继续登记 |
| state name 是否逐字匹配 Step 06 | pass_with_affected_open | 当前名称已对齐；secondary type owner 尚未全部闭口 |
| current / reserved trigger 是否区分 | pass | receipt supersede、audit suppress 等 reserved transition 显式禁止 |
| redaction-first / body-free / no external truth 是否保持 | pass | safety、signal、audit、evidence 全部闭口 |
| Step 16 测试切口是否可生成 | pass_with_affected_open | 已有 planned cuts，但不能解释为测试已执行或 affected 已解决 |

## 10. Batch 10.2 · Handoff / retention / gap 状态矩阵

### 10.1 `ReportHandoffState`

```text
[ReportHandoffRecord.lifecycle]
  factory -> Draft -> Prepared -> Delivered
                 |       |
                 +----> Failed -> Prepared
                 \       /
                  -> Cancelled [reserved]
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Draft` | handoff record 已创建,尚未准备 | 否 | prepare / block;reserved cancel |
| `Prepared` | body-free handoff material 已准备 | 否 | deliver / fail;reserved cancel |
| `Delivered` | 已交付 consumer boundary | 是 | read / lifecycle history |
| `Failed` | prepare / delivery 失败 | 否 | re-prepare with fresh policy;reserved cancel |
| `Cancelled` | 本 handoff 不再交付 | 是 | read only |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `ReportHandoffRecord::draft(...)` | prepare report handoff | handoff scope + consumer present;complete evidence-index preview constituents validated and immutable snapshot staged in the same UoW | state Draft;readiness PendingEvidence | stage handoff record referencing exact saved input | `DomainError::MissingRequiredReference` |
| `Draft` / `Failed` | `Prepared` | `prepare(policy)` | prepare handoff / delivery job retry | readiness decision Ready or Degraded;no-write/retention pass | state Prepared;readiness copied | save lifecycle record + outbox | `DomainError::HandoffNotReady` |
| `Prepared` | `Delivered` | `deliver(success_result)` | handoff delivery / archive feedback | adapter receipt body-free;expected version matches | state Delivered | save lifecycle/delivery refs;outbox;not signoff | `DomainError::InvalidStateTransition` |
| `Draft` / `Prepared` | `Failed` | `block(reason)` or `deliver(failure_result)` | prepare / delivery / feedback | typed block/failure reason | state Failed;readiness Blocked when policy block | save failed lifecycle;gap/report refs | `DomainError::InvalidStateTransition` |
| `Draft` / `Prepared` / `Failed` | `Cancelled` | reserved;no current callable method | no current flow | future explicit cancellation protocol | reserved | current implementation rejects | `DomainError::ReservedTransition` |
| any nonterminal | same | `attach_authenticity_hint(hint_ref)` | evaluate authenticity | persisted hint belongs to handoff | bind hint;state unchanged | append lifecycle record;reevaluate readiness if flow requests | `DomainError::MissingRequiredReference` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| lifecycle / readiness separation | pass | lifecycle uses ReportHandoffState;policy co-state uses §10.2 |
| non-signoff boundary | pass | Delivered means delivery only,never final verdict or acceptance |
| tests | pass | prepare/deliver/fail/retry,hint no-state-change,Delivered/Cancelled terminal |

### 10.2 `HandoffReadinessState`

```text
[ReportHandoffRecord.readiness]
  factory -> PendingEvidence -> Ready
                 |             |  \
                 +-> Blocked <-+   -> Degraded
                       \             /
                        +-----------+
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `PendingEvidence` | 必要 evidence / visibility / gap input 未闭口 | 否 | policy reevaluate |
| `Ready` | body-free、visibility、retention、no-write guard 均通过 | 否 | prepare / deliver;policy reevaluate |
| `Blocked` | policy guard 阻断 | 否 | diagnostic read / policy reevaluate |
| `Degraded` | 受控缺口下可交付 | 否 | prepare with degraded surface / reevaluate |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingEvidence` | `ReportHandoffRecord::draft(...)` | prepare handoff | evidence index input is complete,validated and immutable snapshot staged;readiness policy has not yet produced a terminal decision | readiness pending | no delivery | `DomainError::MissingRequiredReference` |
| any | `Ready` | `HandoffReadinessPolicy::evaluate(...)` + `prepare(...)` | prepare / delivery job | body-free links visible;no open blocking gap;retention/no-write pass | set readiness Ready | lifecycle may become Prepared | `DomainError::HandoffNotReady` |
| any | `Blocked` | policy evaluate + `block(reason)` | prepare / delivery / export guard | blocking gap,NotVisible,hold conflict or no-write failure | set readiness Blocked | lifecycle Failed or remains non-deliverable;gap refs exposed | `DomainError::PolicyRejected` |
| any | `Degraded` | policy evaluate + `prepare(...)` | prepare / delivery job | only explicitly allowed partial/stale gaps;no hard block | set readiness Degraded | Prepared allowed with degraded surface | `DomainError::PolicyRejected` |
| `Ready` / `Blocked` / `Degraded` | `PendingEvidence` | policy reevaluation in accepted mutation | reference/evidence input replaced and incomplete | set pending evidence | mark handoff view stale;no delivery | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum closure | pass | enum was missing and has been added to Step 06 |
| trigger / query boundary | pass | only Command/Job/feedback accepted mutation persists reevaluation;Query read-only |
| tests | pass | each policy result,Ready invalid when blocking gap,Degraded distinct from Ready/Blocked |

### 10.3 `AuthenticityHintState`

```text
[AuthenticityHint]
  factory -> Unassessed -> RealEvidenceLinked
                        -> PlaceholderDetected
                        -> Insufficient -> RealEvidenceLinked / PlaceholderDetected
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Unassessed` | 尚未评估 | 否 | confirm real / mark placeholder / insufficient |
| `RealEvidenceLinked` | body-free real evidence origin ref 已成立 | 是 | read / attach to handoff |
| `PlaceholderDetected` | 发现占位或非真实 evidence | 是 | read / block handoff |
| `Insufficient` | 当前依据不足 | 否 | reevaluate when new evidence/gaps arrive |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unassessed` | `AuthenticityHintPolicy::assess(...)` creates hint | evaluate authenticity | handoff loaded;evidence index input + gap refs loaded | create unassessed with immutable handoff ref | same UoW evaluation | `DomainError::MissingRequiredReference` |
| `Unassessed` / `Insufficient` | `RealEvidenceLinked` | `confirm_real_evidence(origin)` | evaluate authenticity | origin backed by body-free real evidence ref;no placeholder | set real evidence linked | attach hint;reevaluate handoff readiness | `DomainError::AuthenticityBoundaryViolation` |
| `Unassessed` / `Insufficient` | `PlaceholderDetected` | `mark_placeholder(reason)` | evaluate authenticity | typed placeholder reason | set placeholder;save reason | block/pending handoff;no alias/run id | `DomainError::InvalidStateTransition` |
| `Unassessed` | `Insufficient` | `mark_insufficient(gaps)` | evaluate authenticity | non-empty typed gaps or missing body-free basis | set insufficient | attach gap refs;handoff remains pending/blocked | `DomainError::MissingRequiredReference` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | `mark_insufficient` added to Step 06 |
| authenticity boundary | pass | no true alias,run id,signoff or verdict is generated |
| tests | pass | real/placeholder/insufficient,insufficient recovery,terminal rewrite rejected |

### 10.4 `RetentionMarkerState`

```text
[RetentionMarker]
  factory -> Unmarked -> ActiveHold <-> ReleaseEligible -> Released [reserved]
                 \          |            /
                  +-------> Conflict <----+
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Unmarked` | 尚无 observation-side hold | 否 | hold / release candidate / conflict |
| `ActiveHold` | hold 生效,阻断 cleanup / destructive replay | 否 | release candidate / conflict / archive hint |
| `ReleaseEligible` | 可评估释放,尚未释放 | 否 | hold / conflict;reserved release |
| `Released` | 本仓 hold 已释放 | 是 | read only;不表示 source cleanup |
| `Conflict` | hold/release/active reference/handoff 冲突 | 否 | re-evaluate to hold or release candidate |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unmarked` | `RetentionMarker::for_observation(...)` | set retention | protected ref is observation-owned/body-free | create marker | no cleanup side effect | `DomainError::MissingRequiredReference` |
| `Unmarked` / `ReleaseEligible` / `Conflict` | `ActiveHold` | `place_hold(protection_ref, actor_ref)` | set retention / protect reference | active protection loaded and belongs to protected ref | set hold;bind protection | save change record + outbox;block maintenance/export | `DomainError::RetentionConflict` |
| `Unmarked` / `ActiveHold` / `Conflict` | `ReleaseEligible` | `mark_release_candidate(reason, actor_ref)` | set retention | no active consumer protection;policy permits candidate | set release eligible | save change record;no deletion | `DomainError::RetentionConflict` |
| any nonterminal | `Conflict` | `mark_conflict(reason)` | set retention / protect reference | typed active-reference/handoff/policy conflict | set conflict | diagnostic/gap/outbox;no cleanup | `DomainError::InvalidStateTransition` |
| `ReleaseEligible` | `Released` | reserved;no current callable method | no current flow | future explicit release protocol + Step 11 atomic guard | reserved | current implementation rejects | `DomainError::ReservedTransition` |
| any nonterminal | same | `mark_archive_eligible(archive_ref)` | set retention | body-free archive eligibility ref | bind hint;state unchanged | no archive package truth write | `DomainError::MissingRequiredReference` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / phase boundary | pass | Released reserved until explicit release flow exists |
| ownership | pass | no source cleanup or archive package truth mutation |
| tests | pass | hold/release-candidate/conflict,archive hint no-state-change,reserved release rejected |

### 10.5 `ActiveReferenceProtectionState`

```text
[ActiveReferenceProtection]
  factory -> Unprotected -> Protected -> Expired -> Released
                   |           |          /
                   +--------> Conflicted -+
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Unprotected` | 尚无 active consumer | 否 | attach consumer / release when policy permits |
| `Protected` | 存在 active consumer refs | 否 | attach / request release / expire / conflict |
| `Expired` | protection 过期,必须重查 consumers | 否 | attach / release / conflict |
| `Released` | 本 protection 已释放 | 是 | read only |
| `Conflicted` | release 与 active refs 冲突 | 否 | attach / release after conflict resolution |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unprotected` | protection factory in `ProtectActiveReferenceFlow` | protect reference | protected ref valid | create empty protection | stage before attach | `DomainError::MissingRequiredReference` |
| `Unprotected` / `Expired` / `Conflicted` / `Protected` | `Protected` | `attach_consumer(consumer_ref)` | protect reference | consumer ref valid and unique | add consumer;state protected | save protection + retention change/outbox | `DomainError::ReferenceConflict` |
| `Protected` | `Conflicted` | `request_release(reason)` / `mark_conflicted(reason)` | protect / set retention | consumer_refs non-empty or retention policy conflict | set conflicted | retention marker conflict;no release | `DomainError::RetentionConflict` |
| `Protected` | `Expired` | `mark_expired(reason)` | maintenance/reference feedback | typed expiry reason;no implicit release | set expired | mark retention view stale | `DomainError::InvalidStateTransition` |
| `Unprotected` / `Expired` / `Conflicted` | `Released` | `release(actor_ref)` | protect / future maintenance branch | repository confirms consumer_refs empty;retention guard passes | set released | append change record;never delete source | `DomainError::RetentionConflict` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / triggers | pass | expiry/conflict helpers added to Step 06 |
| protection guard | pass | Protected with consumers cannot release |
| tests | pass | attach/idempotent duplicate/conflict/expire/release and Released terminal |

### 10.6 `ReplayScopeState`

```text
[ReplayScope]
  factory -> Defined -> Approved -> Completed
                |          |
                +------> Blocked
                \          /
                 -> Cancelled
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Defined` | target refs 和 allowed effect 已固定 | 否 | approve / block / cancel |
| `Approved` | 可在 observation side 协调 replay | 否 | coordinate / block / complete / cancel |
| `Blocked` | no-write、retention 或 scope guard 阻断 | 是,当前 scope | read / cancel record only |
| `Completed` | observation-side replay 已完成 | 是 | report / history read |
| `Cancelled` | scope 已取消 | 是 | read only |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Defined` | replay scope factory in `DefineReplayScopeFlow` | define replay | non-empty target refs;all targets observation/projection side;allowed effect typed | create defined scope | save only after boundary validation | `DomainError::ReplayBoundaryViolation` |
| `Defined` | `Approved` | `approve(no_write_policy, actor_ref)` | define replay | no-write passes;retention/active refs permit;effect observation-only | set approved | save execution record + stale/outbox marker | `DomainError::PolicyRejected` |
| `Defined` / `Approved` | `Blocked` | `block(reason)` | define replay / coordinate job | source-write target,active hold or no-write failure | set blocked | record violation/gap/report;no replay side effect | `DomainError::ReplayBoundaryViolation` |
| `Approved` | `Completed` | `close(completed_reason)` | coordinate replay job | coordination state Completed;changed refs observation-side only | set completed | save execution/job report;no external truth repair | `DomainError::InvalidStateTransition` |
| `Defined` / `Approved` | `Cancelled` | `close(cancel_reason)` | define / coordinate job | typed cancellation reason;no active execution commit | set cancelled | save execution record | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| scope / terminal | pass | Blocked,Completed,Cancelled require new scope for retry |
| no-write | pass | Approved never permits source truth mutation |
| tests | pass | empty/external target rejection,approve/block/complete/cancel,terminal rewrite |

### 10.7 `NoWriteViolationState`

```text
[NoWriteViolation]
  factory -> Detected -> Blocked -> Closed
                 |          |
                 +------> Escalated -> Closed
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Detected` | 发现 forbidden write attempt | 否 | block / escalate |
| `Blocked` | attempt 已被阻断 | 否 | escalate / close |
| `Escalated` | 进入 operations review | 否 | close |
| `Closed` | violation handling context 已闭口 | 是 | audit/history read |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Detected` | `NoWriteViolation::detect(...)` | record violation / replay/export guard | trigger context + forbidden target present | create detected violation | no attempted write executed | `DomainError::MissingRequiredReference` |
| `Detected` | `Blocked` | `block(policy, actor_ref)` | record violation / replay job | guard proves target outside ownership | set blocked;return violation record | save record + outbox;no compensation write | `DomainError::PolicyRejected` |
| `Detected` / `Blocked` | `Escalated` | `escalate(reason)` | record violation / operations branch | typed escalation reason | set escalated;append record | diagnostic/operations visibility only | `DomainError::InvalidStateTransition` |
| `Blocked` / `Escalated` | `Closed` | `close(reason, actor_ref)` | record violation / future review | typed close reason + actor | set closed;append record | history retained;no deletion | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | all variants have typed member methods |
| no compensation write | pass | all flow side effects remain local audit/diagnostic markers |
| tests | pass | block/escalate/close and Closed terminal;attempted adapter write never called |

### 10.8 `GapLifecycleState`

```text
[GapState]
  factory -> Open -> Acknowledged -> Resolved
                |          |
                +------> Suppressed [reserved] -> Open [reserved]
                           |
                           +-> Resolved
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Open` | gap 必须对相关下游可见 | 否 | acknowledge / mitigate / close;reserved suppress |
| `Acknowledged` | gap 已被承认,尚未解决 | 否 | mitigate / close;reserved suppress |
| `Resolved` | observation boundary 内关闭 gap | 是 | history read |
| `Suppressed` | 对当前 surface 隐藏但仍可审计 | 否 | close;reserved unsuppress |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `GapState::open(...)` | record gap / gap scan / consumer | source ref + classified gap kind | create open gap | save gap;mark degraded/handoff/export views stale | `DomainError::MissingRequiredReference` |
| `Open` | `Acknowledged` | `acknowledge(actor_ref)` | record gap | actor present | set acknowledged;return transition record | save history/outbox as configured | `DomainError::InvalidStateTransition` |
| `Open` | `Acknowledged` | `mitigate(degraded)` | record gap / scan | degraded ref belongs to gap;state Active/Blocked | bind degraded;acknowledge | save degraded + gap transition | `DomainError::GapInvariantViolation` |
| `Acknowledged` | `Acknowledged` | `mitigate(degraded)` | record gap / scan | replacement degraded state valid | update degraded ref;state unchanged | save transition;no success fabrication | `DomainError::GapInvariantViolation` |
| `Open` / `Acknowledged` / `Suppressed` | `Resolved` | `close(reason, actor_ref)` | record gap / scan / feedback | typed close reason backed by real local state change or safe reference resolution | set resolved;return transition | save outbox/stale marker;does not claim source repair | `DomainError::InvalidStateTransition` |
| `Open` / `Acknowledged` | `Suppressed` | reserved;no current `suppress` method | no current flow | future explicit visibility-scoped suppression protocol | reserved | current implementation rejects | `DomainError::ReservedTransition` |
| `Suppressed` | `Open` | reserved;no current `unsuppress` method | no current flow | future visibility scope change | reserved | current implementation rejects | `DomainError::ReservedTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| state / reserved trigger | pass | suppress/unsuppress are not callable in current boundary |
| gap semantics | pass | Suppressed != Resolved;Resolved != source truth repaired |
| tests | pass | open/ack/mitigate/close,wrong degraded ref,reserved paths,Resolved terminal |

### 10.9 `DegradedOutputKind`

```text
[DegradedOutputState]
  policy/factory -> None -> Active -> Blocked
                     \------------> Blocked
  Active / Blocked -> None only by a new policy-evaluated replacement object
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `None` | 当前无需降级 | 否 | allow limited / block |
| `Active` | 输出必须携带 degraded surface | 否 | block / replacement recovery |
| `Blocked` | 当前不能输出 | 是,当前对象 | create new evaluated replacement after cause resolution |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| policy/factory | `None` | `DegradedOutputPolicy::evaluate(...)` | record gap / query assembly | no open blocking gap,safety or visibility restriction | create None decision | Query may return normal surface;no write in Query |
| `None` | `Active` | `allow_limited(reason)` | record gap / handoff/export preparation | reason explicitly allows limited output | set active | save sidecar only in accepted mutation;surface exposes reason | `DomainError::PolicyRejected` |
| `None` / `Active` | `Blocked` | `block(reason)` | record gap / handoff/export guard | unsafe/not-visible/no-write hard block | set blocked | prevent body/output delivery;save gap refs | `DomainError::PolicyRejected` |
| `Active` / `Blocked` | new `None` object | policy reevaluation + projection replacement | gap close / maintenance job | old cause resolved with traceable gap/reference change | old object unchanged;new object None | versioned sidecar replacement;Query never performs it | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| lifecycle vs decision replacement | pass | recovery uses new policy-evaluated object,not in-place hidden reset |
| blocked output | pass | no alternative success body generated |
| tests | pass | None/Active/Blocked,Query no-write,recovery requires accepted replacement |

### 10.10 Batch 10.2 stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 9 个状态机是否逐机覆盖 | pass | §10.1~§10.9 |
| lifecycle / readiness / authenticity 是否分离 | pass | 三个 enum 各自独立,通过 handoff flow 协调 |
| retention / protection / replay 是否不触碰 source cleanup | pass | Released/Completed 仅代表 observation-side state |
| no-write 是否只阻断和记录 | pass | 无 compensation write |
| gap / degraded 是否不伪造成功 | pass | Suppressed、Resolved、Active、Blocked 语义独立 |

## 11. Batch 10.3 · Read / reference / maintenance 状态矩阵

### 11.1 `SignalRollupState`

```text
[SignalRollupWindow]
  factory -> Pending -> Fresh -> Stale -> Rebuilding -> Fresh
                |         |         \                 /
                +---------+----------> Failed <-------+
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | 窗口尚未 seal | 否 | accept signal / seal / rebuild |
| `Fresh` | rollup 已追上 committed safe signals | 否 | accept signal -> stale / rebuild |
| `Stale` | rollup 落后于 safe signal cursor | 否 | rebuild / seal when fully recalculated |
| `Rebuilding` | rollup 重建中 | 否 | complete / fail |
| `Failed` | rollup 构建失败 | 否 | reopen for a new rebuild attempt |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | rollup window factory | record safe signal | typed window + scope | create pending window | save with signal transaction if new | `DomainError::MissingRequiredReference` |
| `Pending` | `Pending` | `accept_signal(signal_ref)` | record safe signal | signal Recorded and belongs to window | increment/dedup signal;state unchanged | save window;read surface pending | `DomainError::RollupInvariantViolation` |
| `Fresh` | `Stale` | `accept_signal(signal_ref)` | record safe signal | new Recorded signal after rollup cursor | add signal;set stale | mark rollup/read views stale | `DomainError::RollupInvariantViolation` |
| `Pending` / `Stale` / `Rebuilding` | `Fresh` | `seal(actor_ref)` | record signal or rebuild completion | all saved safe signals through target cursor included | set fresh;freeze count/cursor | replace rollup view;job report changed ref | `DomainError::RollupIncomplete` |
| `Fresh` / `Stale` / `Failed` | `Rebuilding` | `reopen_for_rebuild(target_ref)` | rebuild signal rollups | target belongs to window;policy permits | set rebuilding | create RollupRebuildState Running/progress | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Failed` | `fail(reason)` | rebuild signal rollups | typed maintenance failure | set failed | job report failed ref;no raw metric/trace read | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| freshness / execution separation | pass | rollup state separate from §11.7 rebuild execution |
| source boundary | pass | only saved SafeSignal is aggregated;no raw log/metric/trace body |
| tests | pass | pending/fresh/stale/rebuilding/failed,duplicate signal,incomplete seal |

### 11.2 `ReadVisibilityKind`

```text
[ReadVisibilityState per request context]
  policy -> Visible -> Restricted -> Blocked
            |            |
            +-> NotVisible -> Blocked
  A new request context receives a new policy-evaluated state.
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Visible` | 当前 request context 可读取 body-free view | 是,当前 evaluation | assemble view |
| `Restricted` | 只允许受限字段 / surface | 是,当前 evaluation | assemble restricted view |
| `NotVisible` | 对当前 consumer 不可见 | 是,当前 evaluation | return body none + explicit surface |
| `Blocked` | hard guard 阻断读取或交付 | 是,当前 evaluation | return blocked surface |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| policy | `Visible` | visibility policy builds `ReadVisibilityState` | all Query / handoff / export precheck | actor/scope permitted;redaction/body-free pass | create visible decision | Query returns body;no write |
| `Visible` | `Restricted` | `restrict(constraint_ref)` | Query/handoff assembler | typed field/scope constraint | set restricted | omit/reduce fields;surface explicit;no write |
| policy | `NotVisible` | visibility policy builds decision | Query/evidence/handoff | object exists but actor/scope cannot see it | create not-visible decision | body none;not missing;no write |
| `Visible` / `Restricted` / `NotVisible` | `Blocked` | `block(reason)` | Query/handoff/export guard | safety,retention or no-write hard block | set blocked | return blocked surface;no repair |
| any state | new evaluated state | `ReadVisibilityPolicy::assert_can_read(...)` | new request only | new `DiagnosticRequestContext` | old decision unchanged | no persistent transition in Query | `DomainError::ReadNotAllowed` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| request-scoped semantics | pass | states are not shared business authorization truth |
| Query no-write | pass | no repository save/refresh/outbox |
| tests | pass | visible/restricted/not-visible/blocked and not-visible != missing |

### 11.3 `DiagnosticFreshnessState`

```text
[DiagnosticSummary]
  assembler -> Fresh -> Stale
             -> Partial -> Stale
             -> Unavailable
  maintenance replacement: Stale / Partial / Unavailable -> Fresh / Partial / Unavailable
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Fresh` | diagnostic summary 已追上 projection/gap cursor | 否 | attach signal/gap / mark stale |
| `Stale` | summary 落后 | 否 | maintenance replacement |
| `Partial` | 只有部分 safe signals/gaps 可解释 | 否 | attach / mark stale / replacement |
| `Unavailable` | diagnostic 无法组装 | 否 | maintenance replacement |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| assembler | `Fresh` / `Partial` / `Unavailable` | diagnostic assembler | rebuild read models | committed safe signal/gap/reference inputs classified | create summary at derived cursor | replace diagnostic view + progress | `ApplicationError::ProjectionAssemblyFailed` |
| `Fresh` / `Partial` | `Stale` | `mark_stale(reason)` | accepted truth/reference mutation | affected view ref resolved formally | set stale | projection store mark stale | `DomainError::InvalidStateTransition` |
| any nonterminal | same | `attach_signal` / `attach_gap` | rebuild read models | body-free ref belongs to scope | add ref;state unchanged | no truth write | `DomainError::ScopeMismatch` |
| `Stale` / `Partial` / `Unavailable` | replacement state | rebuild assembler + projection replace | rebuild read models | maintenance state Rebuilding;source cursor fixed | old summary unchanged;new state from assembly result | versioned projection replacement;job report | `ApplicationError::OptimisticConflict` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| carrier | pass | freshness lives in DiagnosticSummary;DiagnosticView only projects it |
| recovery | pass | maintenance replacement only;Query never repairs |
| tests | pass | stale/partial/unavailable surfaces,scope mismatch,rebuild replacement |

### 11.4 `ReferenceSnapshotStateKind`

```text
[ReferenceSnapshotState]
  factory -> Pending -> Resolved -> Stale -> Resolved
                |          |         |
                +------> Unresolved -+
                +------> Unavailable -> Resolved / Stale / Unresolved
                +------> Invalid [terminal]
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | 等待 resolver outcome | 否 | refresh / stale / unresolved / invalid / unavailable |
| `Resolved` | safe summary 足够且 fresh | 否 | stale / unresolved / invalid / unavailable / refresh |
| `Stale` | snapshot 过期 | 否 | refresh / unresolved / invalid |
| `Unresolved` | 当前不能解析 | 否 | refresh / invalid |
| `Invalid` | target 对本 boundary 无效 | 是 | read/history only;new snapshot required |
| `Unavailable` | resolver / adapter 暂不可用 | 否 | refresh / stale / unresolved |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `ReferenceSnapshotState::pending(...)` | register snapshot / context consumer | typed subject owner and snapshot ref | create pending | stage before resolver decision | `DomainError::MissingRequiredReference` |
| `Pending` / `Stale` / `Unresolved` / `Unavailable` / `Resolved` | `Resolved` | `refresh(record, Some(summary_ref))` | register/update / refresh job / consumer | body-free safe summary + refresh record;subject unchanged | set resolved;bind summary/record | save snapshot + outbox;mark dependent views stale | `DomainError::ReferenceBoundaryViolation` |
| `Resolved` / `Unavailable` | `Stale` | `mark_stale(reason)` | update / reference feedback / refresh job | typed stale reason | set stale;return refresh record | gap/diagnostic/handoff stale | `DomainError::InvalidStateTransition` |
| `Pending` / `Resolved` / `Stale` / `Unavailable` | `Unresolved` | `mark_unresolved(reason)` | register/update / consumer / job | resolver outcome unresolved;not missing fabrication | set unresolved | save record;open/update gap | `DomainError::InvalidStateTransition` |
| any non-`Invalid` | `Invalid` | `mark_invalid(reason)` | update / consumer validation | target owner/schema invalid for boundary | set invalid | save record;no external truth | `DomainError::ReferenceBoundaryViolation` |
| `Pending` / `Resolved` / `Stale` / `Unresolved` | `Unavailable` | `mark_unavailable(reason)` | register/update / consumer / refresh job | adapter/resolver unavailable | set unavailable | delayed/job report/gap;no fake summary | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | invalid/unavailable helpers added to Step 06 |
| external truth boundary | pass | Resolved is local safe snapshot,not external lifecycle truth |
| tests | pass | all outcomes,recovery with summary,Invalid terminal,subject mismatch/body input |

### 11.5 `ProjectionMaintenanceStateKind`

```text
[ProjectionMaintenanceState]
  factory(missing projection) -> Stale -> Rebuilding -> Fresh
  Fresh -> Stale
  Rebuilding -> Failed -> Stale
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Fresh` | projection 已追上 committed cursor | 否 | schedule stale |
| `Stale` | projection 落后 | 否 | start rebuild |
| `Rebuilding` | maintenance 正在执行 | 否 | complete / fail |
| `Failed` | maintenance attempt 失败 | 否 | reschedule stale |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory after successful baseline / `Rebuilding` | `Fresh` | successful-baseline factory / `complete(record)` | initial projection finalize / rebuild | all target member projections independently fresh and target membership fence valid | set fresh;bind progress | replace target progress/view;job report | `DomainError::MaintenanceIncomplete` |
| factory for missing projection | `Stale` | `for_missing_projection(maintenance_ref,target_ref)` | rebuild start | target has no current maintenance row and canonical target-scope membership is valid | create stale maintenance identity | same start UoW must transition to Rebuilding or roll back | `DomainError::ScopeMismatch` |
| `Fresh` / `Failed` | `Stale` | `schedule(policy)` / projection store `mark_views_stale` | any accepted truth/reference mutation | affected target resolved by formal helper;policy permits | set stale | persist stale marker in accepted UoW | `DomainError::InvalidStateTransition` |
| `Stale` | `Rebuilding` | `start(record)` | rebuild read/peripheral views | Scheduled authorization or Approved replay target passes maintenance/no-write policy;target-scope binding stable | set rebuilding;bind progress | job report draft;no truth repair | `DomainError::PolicyRejected` |
| `Rebuilding` | `Fresh` | `complete(record)` | rebuild job | every canonical target member replaced through its own captured cursor;target membership fence and all member freshness markers still valid | set fresh | target progress complete;outbox optional;stored report | `DomainError::MaintenanceIncomplete` |
| `Rebuilding` | `Failed` | `fail(reason)` | rebuild job | typed failure with failed refs | set failed | progress failed;job report;views remain stale/degraded | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / failure trigger | pass | `fail` added to Step 06 |
| no-repair | pass | rebuild replaces projections only,never core observation truth |
| tests | pass | stale/start/complete/fail/reschedule,Query cannot start |

### 11.6 `ReplayCoordinationKind`

```text
[ReplayCoordinationState]
  factory -> Pending -> Coordinating -> Completed
                |            |
                +--------> Blocked
                             |
                             +-> Failed
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | coordination record 尚未执行 | 否 | coordinate / block |
| `Coordinating` | observation-side replay 正在编排 | 否 | complete / fail / block |
| `Blocked` | no-write / retention / replay scope 阻断 | 是,本 execution | report only |
| `Completed` | 本 execution 完成 | 是 | report/history read |
| `Failed` | 本 execution 失败 | 是,本 execution | new execution required |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | coordination factory | coordinate replay | ReplayScope Approved + no-write guard ref | create pending | stage execution/report | `DomainError::ReplayBoundaryViolation` |
| `Pending` | `Coordinating` | `coordinate(policy)` | coordinate replay | target refs observation-side;retention/no-write pass | set coordinating | schedule derived/reference operations only | `DomainError::PolicyRejected` |
| `Pending` / `Coordinating` | `Blocked` | `block(reason)` | coordinate replay | guard fails or active hold | set blocked | save violation/gap/job report;no repair | `DomainError::ReplayBoundaryViolation` |
| `Coordinating` | `Completed` | `complete(record)` | coordinate replay | all changed refs observation-side and execution record complete | set completed | save progress/report;scope may close Completed | `DomainError::MaintenanceIncomplete` |
| `Coordinating` | `Failed` | `fail(reason)` | coordinate replay | typed failure;failed refs captured | set failed | job report failed refs;scope not falsely completed | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| execution terminal | pass | retry creates a new coordination execution |
| no-write | pass | no source/runtime/artifact/governance/identity mutation |
| tests | pass | coordinate/block/complete/fail and scope completion coupling |

### 11.7 `RollupRebuildKind`

```text
[RollupRebuildState]
  factory -> Pending -> Running -> Completed
                |          |
                |          +-> Failed
                +-> Cancelled [reserved]
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | rebuild execution 等待运行 | 否 | start;reserved cancel |
| `Running` | rebuild 正在读取 saved SafeSignal | 否 | complete / fail |
| `Completed` | 本 execution 成功 | 是 | report read |
| `Failed` | 本 execution 失败 | 是 | new execution required |
| `Cancelled` | 本 execution 取消 | 是 | report read |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | rebuild state factory | rebuild signal rollups | window + source cursor fixed | create pending | save report draft/progress |
| `Pending` | `Running` | `start(target_ref)` | rebuild signal rollups | target belongs to window;SignalRollup Rebuilding | set running | read saved SafeSignal page only | `DomainError::ScopeMismatch` |
| `Running` | `Completed` | `complete(rebuilt_count)` | rebuild signal rollups | full target cursor processed;count verified | set completed | seal rollup Fresh;report changed refs | `DomainError::MaintenanceIncomplete` |
| `Running` | `Failed` | `fail(reason)` | rebuild signal rollups | typed failure | set failed | rollup Failed/Stale;report failed refs | `DomainError::InvalidStateTransition` |
| `Pending` | `Cancelled` | reserved;no current callable method | no current flow | future explicit cancellation | reserved | current implementation rejects | `DomainError::ReservedTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | Cancelled explicitly reserved |
| rollup coupling | pass | Completed requires rollup seal;Failed cannot mark rollup Fresh |
| tests | pass | start/complete/fail,reserved cancel,raw metric/trace source forbidden |

### 11.8 Batch 10.3 stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 7 个状态机是否逐机覆盖 | pass | §11.1~§11.7 |
| Query 是否只暴露状态 | pass | visibility/diagnostic/projection 无 Query write |
| reference 是否只保存 safe summary | pass | Resolved 不替代 external lifecycle |
| freshness 与 execution 是否分离 | pass | SignalRollup vs RollupRebuild;ProjectionMaintenance vs JobReport |
| maintenance 是否不修 truth | pass | only projection/reference/progress/report writes |

## 12. Batch 10.4 · Propagation / idempotency / job report 状态矩阵

### 12.1 `PeripheralDeliveryKind`

```text
[PeripheralDeliveryState]
  factory -> Pending -> Prepared -> Delivered
                |          |
                +------> Blocked
                           |
                           +-> Failed -> Prepared
  Pending / Prepared / Failed -> Cancelled [reserved]
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | delivery marker 已创建,尚未准备 | 否 | prepare / block;reserved cancel |
| `Prepared` | body-free view 已准备 | 否 | record delivery / block |
| `Delivered` | consumer boundary 已接收 | 是 | report/history read |
| `Failed` | delivery attempt 失败 | 否 | re-prepare / block;reserved cancel |
| `Blocked` | visibility / retention / no-write policy 阻断 | 否 | re-prepare after policy change;reserved cancel |
| `Cancelled` | delivery 已取消 | 是 | read only |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | delivery factory in export flow | prepare external export / feedback | consumer + view refs valid | create pending | stage with preparation | `DomainError::MissingRequiredReference` |
| `Pending` / `Failed` / `Blocked` | `Prepared` | `prepare(policy)` | export command / delivery job | view visible or explicitly degraded;retention/no-write pass | set prepared | save delivery/preparation + outbox | `DomainError::PolicyRejected` |
| `Prepared` | `Delivered` | `record_delivery(success_result)` | export delivery / feedback consumer | body-free receipt;expected version matches | set delivered;return delivery record | report/outbox;no truth writeback | `DomainError::InvalidStateTransition` |
| `Prepared` | `Failed` | `record_delivery(failure_result)` | export delivery / feedback consumer | typed adapter/consumer failure | set failed;return record | job report failed ref;truth unchanged | `DomainError::InvalidStateTransition` |
| `Pending` / `Prepared` / `Failed` | `Blocked` | `block(reason)` | export command / delivery guard | visibility,retention,gap or no-write hard block | set blocked;return record | gap/degraded surface;no delivery call | `DomainError::PolicyRejected` |
| `Pending` / `Prepared` / `Failed` / `Blocked` | `Cancelled` | reserved;no current callable method | no current flow | future explicit cancellation protocol | reserved | current implementation rejects | `DomainError::ReservedTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| state name | pass | no HLD-only `Retryable`;retryability belongs Step 12/13 failure policy |
| ownership | pass | Delivered never changes consumer truth or observation truth |
| tests | pass | prepare/deliver/fail/block/retry,reserved cancel,terminal rewrite |

### 12.2 `ExportPreparationState`

```text
[ExternalAuditExportPreparation]
  factory -> Draft -> Prepared -> Delivered
                |        |
                +----> Blocked
                         |
                         +-> Failed -> Prepared
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Draft` | export preparation 尚未通过 policy | 否 | prepare / block |
| `Prepared` | body-free export package input 已准备 | 否 | record delivery / block |
| `Blocked` | export policy 阻断 | 否 | re-prepare after policy change |
| `Delivered` | export 已交付 | 是 | report/history read |
| `Failed` | preparation / delivery 失败 | 否 | re-prepare |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | export preparation factory | prepare external audit export | consumer + export view refs valid;visibility captured | create draft | no external call | `DomainError::MissingRequiredReference` |
| `Draft` / `Failed` / `Blocked` | `Prepared` | `prepare(policy)` | export command / delivery job retry | body-free view;policy passes;no final conclusion field | set prepared | save preparation;create/prepare delivery marker | `DomainError::PolicyRejected` |
| `Draft` / `Prepared` / `Failed` | `Blocked` | `block(reason)` | export command / delivery guard | visibility/gap/retention/no-write hard block | set blocked | save blocked surface;do not call adapter | `DomainError::PolicyRejected` |
| `Prepared` | `Delivered` | `record_delivery(success_result)` | export delivery job / feedback | body-free delivery receipt | set delivered | save delivery state/report/outbox | `DomainError::InvalidStateTransition` |
| `Prepared` | `Failed` | `record_delivery(failure_result)` | export delivery job / feedback | typed delivery failure | set failed | failed refs;truth unchanged | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | delivery result helper added to Step 06 |
| export boundary | pass | Prepared/Delivered are propagation states,not external audit truth or signoff |
| tests | pass | draft/prepare/block/deliver/fail/retry and final conclusion input rejection |

### 12.3 `OutboxPublicationState`

```text
[ObservationOutboxRecord]
  accepted mutation -> Pending -> Published
                          |
                          +-> Failed --same-token retry--> Published
                          |      |
                          +------> DeadLettered
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Pending` | committed immutable payload snapshot 等待发布 | 否 | publish / mark failed / dead-letter |
| `Published` | stored snapshot 已发布 | 是 | operations read |
| `Failed` | publication attempt 失败 | 否 | typed retry eligibility / same-token publish / dead-letter；state不回到Pending |
| `DeadLettered` | permanent / corrupt / exhausted failure | 是 | operations read / future operator recovery design |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| accepted mutation | `Pending` | `ObservationOutboxRecord::pending(...)` + repository `append` | all accepted Command/Consumer/Job mutations | truth/marker change staged;immutable payload snapshot built in same UoW | create pending marker linked to snapshot | append record+snapshot atomically;commit truth | `ApplicationError::OutboxInvariantViolation` |
| `Pending` | `Published` | repository `mark_published(...)` / record `mark_published` | publish outbox | publisher success receipt;expected version matches | set published;bind receipt | publication state UoW only;truth unchanged | `ApplicationError::OptimisticConflict` |
| `Pending` | `Failed` | repository `mark_failed(...)` / record `mark_failed` | publish outbox | retryable or classified failure;stored snapshot unchanged | set failed;bind failure | report retryable/failed ref;truth unchanged | `ApplicationError::OptimisticConflict` |
| `Pending` / `Failed` | `DeadLettered` | repository `mark_dead_letter(...)` / record `mark_dead_letter` | publish outbox | payload corrupt,permanent failure or Step 13 exhaustion | set dead-lettered;bind ref | operations visibility;never rebuild payload | `ApplicationError::OptimisticConflict` |
| `Failed` | `Published` | same-token retry + repository `mark_published(...)` | publish outbox | typed retryable failure,eligible plan item,current global claim/fence,stable publication token,expected version | set published;bind receipt | no intermediate Pending rewrite;truth unchanged | `ApplicationError::OptimisticConflict` / `ExecutionFenceConflict` |
| `Failed` | `Failed` | same-token retry failure + `mark_failed(...)` | publish outbox | current claim/fence + expected version | replace typed body-free failure classification | report item retryable/permanent bypolicy | `ApplicationError::OptimisticConflict` / `ExecutionFenceConflict` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| object / enum closure | pass | `ObservationOutboxRecord` and enum added to Step 06 |
| stored snapshot | pass | publisher cannot query current truth or rewrite payload |
| tests | pass | append/publish/fail/same-token retry/dead-letter,expected-version/fence conflict,terminal rewrite |

### 12.4 `IdempotencyReservationState`

```text
[ObservationIdempotencyReservation]
  atomic acquire -> Reserved -> Completed

  incoming reserve outcomes:
    absent row                  -> Acquired(Reserved)
    Reserved + same digest      -> InFlight
    Completed + same digest     -> Replay(result_ref)
    any existing + other digest -> Conflict
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Reserved` | 当前 operation 获得执行权 | 否 | acquired writer executes body / attach stored result；incoming duplicate只得到InFlight/Conflict outcome |
| `Completed` | stored result 已绑定 | 是 | read-only replay decision |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| empty | `Reserved` | `reserve_or_load(context,tx)` returns `Acquired` | Command/Consumer/Job shared templates | typed operation + actor + key unused;digest available;Consumer source-event secondary identity unused | create reserved record | only acquired branch may run body | repository/validation error |
| `Reserved` | `Completed` | `attach_result(result_ref)` + repository `mark_completed` | accepted mutation/job/receipt | stored result saved in same UoW | bind result;set completed | commit only after truth/outbox/result staged | `ApplicationError::CompletedReservationResultMissing` |

| Incoming existing state | Atomic reserve outcome | Durable state effect | Flow action | Error when invalid |
|---|---|---|---|---|
| `Reserved` + same operation/actor/key/digest | `InFlight` | none;remainsReserved | rollback incoming UoW;no second writer | `ApplicationError::IdempotencyInFlight` |
| `Completed` + same operation/actor/key/digest | `Replay(result_ref)` | none;remainsCompleted | rollback incoming UoW;validate/replay exact result | missing/mismatch consistency error |
| `Reserved` / `Completed` + different digest | `Conflict` | none;old row unchanged | rollback;no body/result exposure | `ApplicationError::IdempotencyConflict` |
| Consumer same source-event identity but changed dedup key | outcome follows original reservation digest/state | none | replay/in-flight/conflict against original row | event identity mismatch/quarantine |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| command/consumer/job parity | pass | all use one atomic outcome discipline;actor/operation scoped;Consumer secondary event identity;Query excluded |
| stored result ordering | pass | result saved before mark completed in same UoW |
| tests | pass | new/same digest/different digest/missing stored result/duplicate no side effect |

### 12.5 `JobReportState`

```text
[ObservationJobReportDraft]
  factory -> Draft -> Completed
                   -> PartiallyCompleted
                   -> FailedRetryable
                   -> FailedPermanent
                   -> Blocked
  duplicate: load stored terminal report;do not change its state
```

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| `Draft` | report 正在组装 | 否 | complete / partial / fail / block |
| `Completed` | requested scope 全部完成 | 是 | replay/read |
| `PartiallyCompleted` | changed / failed / gap refs 均已显式记录 | 是 | replay/read |
| `FailedRetryable` | 本 execution 失败,policy 可能允许新 execution | 是 | replay/read |
| `FailedPermanent` | 本 execution 永久失败 | 是 | replay/read |
| `Blocked` | retention/visibility/no-write/policy 阻断 | 是 | replay/read |

| From | To | 触发函数 | Step 09 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | job report draft factory | all 9 job flows | job input/context validated;report ref generated locally | create draft | no signoff/run id/evidence alias | `JobError::MissingReportReference` |
| `Draft` | `Completed` | `complete()` | job success | requested scope complete;failed refs empty;changed/progress refs body-free | set completed | save stored report + idempotency complete | `JobError::InvalidReportTransition` |
| `Draft` | `PartiallyCompleted` | `mark_partial(reason)` | job partial branch | changed and failed/skipped refs covered;partial policy allowed by Step 13 | set partial;bind reason | save report;partial transaction details deferred Step 13 | `JobError::InvalidReportTransition` |
| `Draft` | `FailedRetryable` | `fail_retryable(reason)` | job retryable failure | typed retryable class;failed refs captured | set failed retryable | save report;no automatic rerun in same execution | `JobError::InvalidReportTransition` |
| `Draft` | `FailedPermanent` | `fail_permanent(reason)` | permanent failure | typed permanent class;failed refs captured | set failed permanent | save report;operations visibility | `JobError::InvalidReportTransition` |
| `Draft` | `Blocked` | `block(reason)` | replay/handoff/export/maintenance guard | policy/visibility/retention/no-write block | set blocked | save gap refs;no protected side effect | `JobError::InvalidReportTransition` |
| stored terminal | same | stored report replay | duplicate job branch | same idempotency digest | no mutation | response outcome `DuplicateReplayed`;job body not rerun | `ApplicationError::CompletedReservationResultMissing` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum closure | pass | JobReportState added to Step 06;DuplicateReplayed excluded from stored state |
| report boundary | pass | report is draft execution evidence,not test result/acceptance/signoff |
| tests | pass | all terminal outcomes,invalid second finalization,duplicate replay with no side effect |

### 12.5-a `ObservationJobPlanItemState` coordination matrix

该enum是Step 13为staged Job落码补充的application coordination state，不新增业务/投影truth owner，也不改变本Step筛选出的27个正式领域/持久化状态机数量。它落在`observation_job_execution_plans`技术store，必须由current claim/fence + plan CAS驱动。

| From | To | 触发 | 前置条件 | Outcome规则 | 非法时错误 |
|---|---|---|---|---|---|
| factory | `Planned` | Job start freezes plan | work key canonical unique；planned input digest / observed version已冻结 | `outcome=None` | plan invariant error |
| `Planned` | `Running` | acquire global item claim | owning report仍Draft；claim Active；fresh monotonic fencing token | `outcome=None`；不得先写成功/失败ref | `ExecutionFenceConflict` |
| `Running` | `Succeeded` | item effect + plan/report CAS | local effect/derived state/marker与plan item在同fenced UoW成功 | exact outcome；failed refs empty；reason None | `ExecutionFenceConflict` / consistency error |
| `Running` | `FailedRetryable` | typed retryable item failure accounting | item effect UoW已rollback；report仍Draft；current fence有效 | exact failure/gap/progress refs + typed reason + digest | `ExecutionFenceConflict` / consistency error |
| `Running` | `FailedPermanent` | permanent failure accounting | deterministic/permanent class；current fence有效 | exact failed/gap/progress refs + typed reason + digest | consistency error |
| `Running` | `Blocked` | policy/visibility/retention/no-write guard | guard is formal and current；protected effect未执行 | exact gap/progress refs + typed reason + digest | consistency error |
| `Running` | `SkippedTerminal` | equivalent durable effect probe | matching work identity/token/material and durable terminal owner/marker verified | affected/progress refs identify equivalent fact；digest required | consistency error |
| `FailedRetryable` | `Running` | policy permits same-execution item retry | report仍Draft；immutable input unchanged；fresh claim/fence acquired | previous attempt remains inappend-only record；current outcome cleared/replaced only by guarded CAS | `ExecutionFenceConflict` |
| any finalizable item | same | idempotent same classification write | state、refs、reason、outcome digest exactly equal；current fence valid | no-op/CAS success byrepository contract | mismatch -> consistency error |

封存规则:

- `Succeeded`、`FailedPermanent`、`Blocked`、`SkippedTerminal`不进入`Running`。
- `FailedRetryable`只有在report仍`Draft`时可进入`Running`；一旦finalize把report置为任一terminal state，整个plan所有item均不可再变。
- finalize不得看到`Planned`或`Running`；每个finalizable item必须有compatible structured outcome，report sets/reason必须等于all current outcomes的canonical fold。
- `Running`不是worker心跳或process memory状态；它只能由durable claim/fence和plan CAS建立。

### 12.6 Batch 10.4 stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 5 个状态机是否逐机覆盖 | pass | §12.1~§12.5 |
| delivery / export / outbox 是否不反写真相 | pass | only propagation state changes |
| outbox 是否只发布 stored snapshot | pass | append/publish lifecycle closed |
| duplicate 是否 replay stored result/report | pass | no mutation or rerun |
| retry / exhaustion 是否越界提前定义 | pass | only state direction fixed;timing/policy deferred Step 13 |

## 13. 非 lifecycle 技术状态与一次性结果

这些类型会被 Step 09 读取、返回或回放,但不具备可持久推进的独立生命周期。实现必须按分类结果处理,不得为它们编造 transition repository。

### 13.1 Command outcome

| `ObservationCommandOutcome` | 产生条件 | 是否修改 domain state | stored result / outbox |
|---|---|---|---|
| `Accepted` | accepted mutation committed | 是,按对应正式状态机 | save result;append committed outbox when required |
| `DuplicateReplayed` | same key + same digest | 否 | load stored result;no new outbox |
| `Rejected` | validation/policy/state guard failed before commit | 否 | optional rejected surface per Step 12;no truth outbox |
| `Conflict` | same key + different digest / optimistic conflict mapping | 否 | old result unchanged |
| `Delayed` | safe dependency temporarily unavailable | 只允许显式 delayed receipt/gap marker transaction | no truth event unless marker committed |
| `Quarantined` | forbidden body / safety gate | 只允许 quarantine/gap state | no normal-path event |

### 13.2 Consumer outcome

| `ObservationConsumerOutcome` | 产生条件 | 生命周期判断 | 禁止事项 |
|---|---|---|---|
| `Accepted` | local observation-side state committed | one-shot receipt | 不创建外部 truth |
| `Duplicate` | same dedup key/digest | replay surface | 不解析 payload、不重跑 resolver |
| `Delayed` | resolver/adapter 暂不可用 | one-shot receipt;可配 gap | 不伪造 resolved snapshot |
| `Rejected` | schema valid but policy/input invalid | one-shot receipt | 不写 local truth |
| `Quarantined` | unsafe/forbidden body | one-shot receipt + marker | 不保存正文 |
| `DeadLettered` | permanent consumer failure | one-shot receipt + dead-letter ref | 不等于 outbox publication DeadLettered |
| `UnsupportedSchema` | envelope version unsupported | pre-parse result | 不解析 payload、不 mark stale |
| `NoOp` | valid event but no local change | stored receipt result | 不 append truth event |

### 13.3 Public Job outcome to stored report mapping

| `ObservationJobOutcome` | 对应 stored `JobReportState` | 说明 |
|---|---|---|
| `Completed` | `Completed` | all requested items complete |
| `PartiallyCompleted` | `PartiallyCompleted` | changed/failed/gap refs complete |
| `FailedRetryable` | `FailedRetryable` | retry policy belongs Step 13 |
| `FailedPermanent` | `FailedPermanent` | operations visible |
| `Blocked` | `Blocked` | no protected side effect |
| `DuplicateReplayed` | 原 stored report state 不变 | response-only outcome;load original report |

### 13.4 Adapter availability replacement semantics

| `AdapterAvailabilityKind` | 含义 | 更新方式 | 对状态机的影响 |
|---|---|---|---|
| `Available` | adapter 可调用 | runtime probe/config validation 生成新 snapshot | 可允许后续 accepted mutation |
| `Degraded` | 仅支持受限/read-only | 新 snapshot replacement | flow may return degraded/delayed |
| `Unavailable` | 暂不可用 | 新 snapshot replacement | reference Unavailable / job FailedRetryable |
| `Misconfigured` | 配置无效 | config validation snapshot | block entry;Step 14 closes config mapping |

`AdapterAvailabilityState` 不持久推进 external lifecycle;每次 probe 生成新的 product-neutral availability snapshot。Query 不得通过 probe result 写 reference/projection state。

### 13.5 Entry / loop carrier

| carrier | 正式语义 | 禁止事项 |
|---|---|---|
| `EntryDisposition` | accepted/rejected/quarantined/duplicate/blocked 的一次 handler result | 不替代 domain/protocol outcome |
| `ObservationCommandHandlerState` / `ObservationQueryHandlerState` | request mapper runtime carrier | 不访问 repository |
| `ObservationConsumerDisposition` | worker receipt mapping carrier | durable outcome 以 stored consumer receipt 为准 |
| `OutboxPublisherLoopState` | cursor + last worker error | 不替代 `OutboxPublicationState` |
| `ProjectionWorkerLoopState` | current maintenance target carrier | 不替代 `ProjectionMaintenanceStateKind` |
| `ObservationJobRunnerContext` | operation context input | `job_ref` 不是外部真实 run id |

## 14. 跨状态机副作用一致性

| 来源状态变化 | 必须的 application side effect | 可选副作用 | 禁止副作用 |
|---|---|---|---|
| Receipt Accepted/Rejected/Quarantined/Degraded | save receipt + IntakeDecisionRecord + stored result | `ObservationReceiptChanged`;gap/stale marker | source truth write;raw body save |
| Safety Safe/Redacted/Rejected/Quarantined | save disposition and linked receipt transition atomically | `SafetyDispositionChanged`;diagnostic stale | unsafe material entering signal/audit |
| Correlation Bound/Partial/Invalid | save context + CorrelationLinkRecord | projection stale;later signal event | business relationship truth |
| SafeSignal Recorded/Suppressed/Stale | save signal;rollup state update | `SafeSignalRecorded`;gap/diagnostic | raw log/metric/trace persistence |
| AuditProjection Appended/Restricted | save projection + append-only AuditAppendRecord | `AuditProjectionAppended`;view stale | source audit body/truth mutation |
| EvidenceLinkage state change | save linkage + audit record | `EvidenceLinkageChanged`;handoff stale | evidence body/real alias creation |
| Handoff lifecycle/readiness/hint | save handoff/hint/lifecycle record | `ReportHandoffChanged`;gap refs | final verdict/signoff/acceptance |
| Retention/protection state change | save marker/protection + RetentionChangeRecord | `RetentionMarkerChanged`;maintenance block | source cleanup/archive package write |
| Replay/no-write state change | save scope/coordination/violation/execution record | violation/gap/outbox/report | source/runtime/artifact/governance/identity repair |
| Gap/degraded state change | save gap/degraded + GapTransitionRecord | `GapStateChanged`;affected views stale | synthetic success/source repair |
| Reference snapshot state change | save snapshot + ReferenceRefreshRecord | `ReferenceSnapshotChanged`;gap/stale | external lifecycle/body copy |
| Projection/rollup maintenance | save derived state/progress/view/report | `DerivedProjectionChanged` | core observation truth mutation |
| Peripheral/export state change | save preparation/delivery record/report | `PeripheralDeliveryChanged` | external audit/GRC/report truth |
| Outbox publication state change | versioned marker update | publication report/operations diagnostic | rollback original truth;payload rebuild |
| Idempotency/job report state change | save stored result/report before complete | duplicate replay response | rerun side effect on duplicate |

## 15. Forbidden transition summary

| 状态机 | 禁止转换 / 操作 | 正式处理 |
|---|---|---|
| ObservationReceipt | Rejected/Superseded -> any;Accepted -> Received | reject;new receipt required |
| SafetyDisposition | Safe/Redacted/Rejected -> Pending/other terminal | reject;new disposition required |
| CorrelationContext | Invalid -> Bound/Partial | reject;new context required |
| SafeSignal | Suppressed -> Recorded/Stale | reject;new signal required |
| AuditProjection | Suppressed -> Appended/Restricted | reject;new projection/explicit future replacement |
| EvidenceLinkage | BodyBlocked -> Linked/NotVisible/Stale | reject;new linkage after body-free input |
| ReportHandoff | Delivered/Cancelled -> any;Draft -> Delivered | reject;new handoff or proper prepare first |
| HandoffReadiness | Query path reevaluation persisted | return surface only;no write |
| AuthenticityHint | PlaceholderDetected -> RealEvidenceLinked | reject;new hint evaluation object |
| RetentionMarker | Released -> hold/conflict;ReleaseEligible -> delete source | reject;source cleanup out of scope |
| ActiveReferenceProtection | Protected with consumers -> Released | `RetentionConflict` |
| ReplayScope | Blocked/Completed/Cancelled -> Approved | reject;new scope required |
| NoWriteViolation | Closed -> Detected/Blocked/Escalated | reject;new violation required |
| Gap | Resolved -> Open/Acknowledged;Suppressed treated as Resolved | reject;new gap or reserved explicit reopen |
| DegradedOutput | Blocked -> None in place | create policy-evaluated replacement in accepted flow |
| SignalRollup | Query Stale -> Fresh;Failed -> Fresh without rebuild | Query exposes state;formal rebuild required |
| ReadVisibility | NotVisible treated as missing or Visible across contexts | explicit surface;new request evaluation |
| DiagnosticFreshness | Query Stale/Unavailable -> Fresh | maintenance replacement required |
| ReferenceSnapshot | Invalid -> Resolved;Resolved without safe summary | new snapshot / reject |
| ProjectionMaintenance | Fresh -> Rebuilding without Stale/schedule | reject;formal target/stale marker required |
| ReplayCoordination | Blocked/Completed/Failed -> Coordinating | new execution required |
| RollupRebuild | Completed/Failed/Cancelled -> Running | new execution required |
| PeripheralDelivery | Delivered/Cancelled -> Prepared/Failed | new delivery required |
| ExportPreparation | Delivered -> Prepared/Failed/Blocked | new preparation required |
| OutboxPublication | Published/DeadLettered -> Pending/Failed;publish from mutable truth | reject;operator recovery requires future design |
| Idempotency | Completed -> Reserved；将incoming Replay/Conflict/InFlight写成durable state | reject；reservation只有Reserved -> Completed，incoming outcome不改旧row |
| JobReport | any terminal -> Draft/another terminal | reject;duplicate replays original report |

## 16. Step 09 / 概要待决项闭口

| 待决项 | Step 10 决议 | 实现口径 |
|---|---|---|
| Outbox publication 是否独立对象化 | 是 | Step 06 已补 `ObservationOutboxRecord` + `OutboxPublicationState` |
| Diagnostic freshness 承载位置 | `DiagnosticSummary.freshness` | `DiagnosticView` 只投影;Query 不更新 |
| SignalRollup 与 RollupRebuild 是否合并 | 不合并 | 前者是 read freshness,后者是单次 job execution |
| Handoff / peripheral / export 的 Prepared/Delivered 是否共用 enum | 不共用 | 同名只表示各自 propagation phase,不得推导 truth/signoff |
| Failed outbox 如何重试 | 不开放`Failed -> Pending`；typed retryable Failed可被eligible selector选中 | Step 13固定same-token retry、global item claim/fence和terminal不重开；interval/exhaustion后移配置 |
| Command/Consumer/Job outcome 是否进入状态矩阵 | 不进入 | one-shot response/receipt outcome;stored lifecycle 另由 idempotency/job report 承担 |
| Gap Suppressed 如何恢复 | suppress/unsuppress 当前 reserved | 当前 flow 不调用;不得把 Suppressed 当 Resolved |
| Receipt supersede / audit suppress / retention release / delivery cancel | phase reserved | 当前无 protocol/flow/helper 时实现不得暴露 |

## 17. 本步发现并修正的设计缺口

| 文件 | 修正 | 原因 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 增加 `HandoffReadinessState` enum 与四个正式 variant | `ReportHandoffRecord.readiness` 和 policy 已引用,但状态集合未落码 |
| 同上 | 增加 `ReferenceSnapshotState.mark_invalid/mark_unavailable` | Step 09 Commands/Consumers/Job 实际产生 Invalid/Unavailable |
| 同上 | 补 SignalRollup/AuthenticityHint/ActiveReferenceProtection/PeripheralDelivery/Export/ProjectionMaintenance/ReplayCoordination 的当前 trigger helper | enum variant 与当前 flow 原先缺触发函数闭环 |
| 同上 | 增加 `ObservationOutboxRecord`、`OutboxPublicationState` 和 publication methods | Step 07/09 已有 append/publish/fail/dead-letter,但 Step 06 无正式状态 owner |
| 同上 | 增加 `JobReportState` 和 job report finalization methods | Step 09 要求 stored report replay,但 Step 06 只引用未定义 state |
| 当前 Step 10 | 旧 45 行旧对象/旧状态摘要全量替换 | 与当前 full-restart Step 06~09 冲突 |

本步没有修改正式 `03-详细设计.md`,也没有创建实现代码、commit、run id、evidence alias、验收签署或测试结果。

## 18. Step 11~16 handoff items

| 后续 Step | 必须承接的事项 |
|---|---|
| Step 11 persistence / consistency | 27 个状态 owner 的 table/collection/column/index/version source;truth/history/outbox snapshot/stored result atomicity;replacement object persistence |
| Step 11 persistence / consistency | Handoff lifecycle + readiness co-state invariant;ReferenceSnapshot Invalid terminal;Outbox record/snapshot field consistency |
| Step 12 error / recovery | 精确化 `InvalidStateTransition`、boundary/policy/missing/optimistic/report errors 与 Command/Consumer/Job surface mapping |
| Step 12 error / recovery | rejected transition 是否保存 diagnostic/audit surface;terminal recovery / new-object requirement |
| Step 13 concurrency / idempotency | Failed outbox retry/exhaustion;job partial commit;duplicate report replay;reference/projection optimistic conflict |
| Step 13 concurrency / idempotency | concurrent handoff delivery,retention/protection race,gap close vs scan,rollup rebuild re-entry |
| Step 14 config / external binding | adapter availability/config mapping,delivery targets,publication binding,maintenance limits |
| Step 15 observability / audit | transition success/reject counters,terminal/reserved violation logs,outbox dead-letter and no-write audit fields |
| Step 16 tests | 每个状态机至少合法路径、非法路径、terminal/reserved、side-effect/no-side-effect 和 Query no-write 测试 |

## 19. 跨状态机命名 / 触发 / 测试审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态主语筛选是否排除伪状态机 | pass | outcomes、availability、entry/loop carrier、record/ref/view 已分流 |
| 27 个正式状态机是否全部有状态集合、ASCII 图、矩阵和停审 | pass | §9~§12 |
| state name 是否来自 Step 06 | pass | missing enum 已先回写 Step 06;未使用旧口语名 |
| trigger 是否来自 Step 06/07/09 | pass | current trigger 有 factory/member/policy/repository/flow 回指;reserved 无当前调用 |
| 前置条件是否可落码 | pass | 仅使用 typed DTO/ref/reason、versioned load、resolver outcome、policy decision、stored snapshot |
| 非法转换错误是否明确 | pass | domain/application/job error class 已固定;精确 taxonomy 留 Step 12 |
| 同名 `Pending/Failed/Blocked/Delivered` 是否混义 | pass | 每个名字限定 owner;跨 owner 不自动传播 |
| terminal 是否明确 | pass | terminal recovery 要求 new object/execution/delivery/scope |
| phase reserved 是否被当前 flow 调用 | pass | supersede/suppress/release/cancel/retry 等均显式禁止当前调用 |
| Query no-write 是否保持 | pass | visibility/freshness/gap/reference/projection 只读 exposure |
| Consumer no external truth 是否保持 | pass | local receipt/snapshot/marker/gap/history only |
| Job no truth repair 是否保持 | pass | derived/reference/publication/delivery/report only |
| outbox stored snapshot 是否保持 | pass | publication state never rebuilds payload |
| handoff/export no-signoff 是否保持 | pass | Prepared/Delivered/report outcome 均非验收 truth |
| test / acceptance formal names 是否可复用 | pass | Step 16、05、06 必须使用本文件 enum variant |

## 20. 回填草稿

> 正式回填位置: `03-详细设计.md` §9 状态机与转换矩阵

Step 19 装配时建议采用:

```markdown
## 9. 状态机与转换矩阵

### 9.1 状态主语筛选与通用规则
- lifecycle state 与 one-shot outcome / runtime snapshot 的边界
- invalid transition / terminal / reserved / query no-write 规则

### 9.2 Observation truth / safety
- receipt / safety / correlation / safe signal
- audit projection / evidence linkage

### 9.3 Handoff / retention / gap
- report lifecycle / readiness / authenticity
- retention / active protection / replay / no-write
- gap / degraded output

### 9.4 Read / reference / maintenance
- rollup / visibility / diagnostic
- reference snapshot / projection maintenance
- replay coordination / rollup rebuild

### 9.5 Propagation / idempotency / report
- peripheral / export / outbox
- idempotency reservation / stored job report

### 9.6 技术结果与跨状态审计
- Command / Consumer / Job outcome mapping
- forbidden transitions
- cross-state side-effect consistency
```

## 21. 待确认事项

| 项 | 当前判断 | 处理方式 |
|---|---|---|
| 是否存在阻塞 Step 10 完成的上游 blocker | 否 | 当前可停审 |
| outbox Failed retry 的具体 policy | 非本 Step blocker | Step 13已固定不回Pending、eligible selection + claim/fence + same token；数字参数后移Step 14/`04` |
| receipt supersede / audit suppress / retention release / cancel 协议是否当前实现 | 否 | phase reserved,需未来设计显式新增 protocol/flow |
| 是否需要现在定义 DDL/error mapping/config | 否 | 分别留 Step 11/12/14 |
| 是否修改正式 `03-详细设计.md` | 否 | Step 19 才装配 |

## 22. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 是否先读取 Step 10 SOP、5.9、概要状态模型和 Step 06~09 | pass |
| 是否先筛选状态主语再写矩阵 | pass |
| 是否按状态机逐个定义,未创建全局状态机 | pass |
| 每个状态机是否有状态集合、ASCII 图、转换矩阵、非法错误和停审 | pass |
| 是否闭合 Step 06 enum / trigger 缺口 | pass |
| 是否完成跨状态命名 / 触发 / 测试审计 | pass |
| 是否保持 observation-only / body-free / no-write / no-signoff | pass |
| 是否未进入 Step 11 或装配正式 `03` | pass |
| 当前是否可进入 Step 11 | 可以,但必须等待用户确认 |

进入 Step 11 前必须先读取:

- `standards/document/详细设计讨论流程_SOP.md` Step 11
- `standards/document/详细设计书写规范.md` 5.10
- 本文件 `03_ddd_step_10_state_matrix.md`
- `03_ddd_step_06_object_contracts.md`
- `03_ddd_step_07_trait_port_adapter_contracts.md`
- `03_ddd_step_08_protocol_contracts.md`
- `03_ddd_step_09_function_flows.md`
- `02_hld_step_12_detailed_design_handoff.md` 中 persistence / transaction / consistency 承接项
- 正式 `02-概要设计.md` §8、§9、§12
