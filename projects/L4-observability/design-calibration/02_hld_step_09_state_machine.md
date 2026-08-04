# L4-observability 02-概要设计 Step 09 · 状态定义与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户确认后进入 Step 10

---

## 1. 本步目标

把 Step 06 已点名对象、Step 07 已收敛接口和 Step 08 已建立处理流中的正式状态候选收束成概要层状态机,说明状态含义、主迁移方向、禁止迁移和状态传播关系,避免状态散落在对象轮廓、接口骨架和处理流章节里。

`L4-observability` 没有一个全局唯一状态机;它拥有多组并列的 observation-owned 状态机。每组状态都必须回指 Step 06 对象、Step 07 触发接口和 Step 08 处理流。本步不写状态机代码实现、完整错误码、数据库状态列、配置 JSON、UI 展示规则、补偿脚本、完整协议 schema、真实 run id、真实 evidence alias、验收签署或测试结果。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `02_hld_step_06_key_objects.md` + 6 个对象附录 | 已完成 | 提供状态承载对象、候选状态、函数骨架和禁止事项。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供触发状态迁移的 Command、Consumer、Outbound Event 和 Job。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供状态迁移所在处理流、传播关系和 Step 09 移交门禁。 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 redaction-first、body-free、query no-write、consumer 不写外部 truth、job 不修复 truth 等硬约束。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提供业务规则、数据归属、接口边界、真实性和验收否决线索。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供 observation-owned truth、一致性、通信、数据归属和下游传播边界。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 9 | 约束本步必须输出状态定义表、状态图、允许/禁止迁移、传播关系和停审记录。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.9 | 约束状态图和传播图只表达状态、动作、迁移和传播,禁止实现细节。 |
| `projects/L1-governance/design-calibration/02_hld_step_09_state_machine.md` | 已读取 | 作为多状态族、状态定义、迁移清单和传播图的粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_09_state_machine.md` | 已读取 | 作为多对象状态机、受限主线、派生 / handoff 状态的粒度参考。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_09_state_machine.md` | 已读取 | 仅作 historical material,识别其薄、未承接 Step 06~08 和仍含 schema 心智的问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 09 标准、Step 06~08、旧 Step 09 和 L1 参考粒度 | done | 本文件 §2 |
| 回答 SOP 问题,先确认本仓为多状态族而非全局单状态机 | done | 本文件 §4 |
| 诊断旧材料和状态边界风险 | done | 本文件 §5 |
| 输出状态机边界总览和状态定义表 | done | 本文件 §6~§7 |
| 输出状态流转图、允许迁移和禁止迁移 | done | 本文件 §8~§10 |
| 输出状态传播关系图和下游影响表 | done | 本文件 §11 |
| 完成组件状态归属、停审和一致性审计 | done | 本文件 §12~§14 |
| 完成 Step 10 移交、回填草稿、自检和门禁 | done | 本文件 §15~§19 |

---

## 4. SOP 问题回答

### 4.1 本仓有哪些影响主线成立的正式状态?

`L4-observability` 存在 11 组正式状态族:

1. intake / safety admission 状态。
2. correlation / safe signal / rollup 状态。
3. audit projection / evidence linkage visibility 状态。
4. report handoff / authenticity / readiness 状态。
5. retention / active reference protection 状态。
6. replay / no-write violation 状态。
7. read visibility / diagnostic freshness 状态。
8. gap / degraded output 状态。
9. peripheral delivery / external audit export 状态。
10. reference snapshot / freshness / resolution 状态。
11. projection maintenance / rollup rebuild / outbox publication 状态。

这些状态均属于 observation side,不拥有 Governance、Artifact、Identity、Runtime、Sandbox、Archive、Console 或外部 product truth。

### 4.2 每个状态的含义是什么,是否可以进入正常主线?

正常主线只能依赖明确可消费或受限可消费的状态:

- `ObservationReceiptState::Accepted` 可进入 correlation、audit、read 和 maintenance 主线。
- `SafetyDispositionState::Safe` 可进入 safe signal 和 audit projection;`Quarantined` / `Rejected` 只能进入 gap / diagnostic / audit history。
- `CorrelationContextState::Bound`、`SafeSignalState::Recorded`、`SignalRollupState::Fresh` 可供 audit、read、dashboard 或 rollup 查询消费。
- `AuditProjectionState::Appended`、`EvidenceLinkageState::Linked` 可供 handoff、read、external audit export 消费;`BodyBlocked` / `NotVisible` 只能以 degraded / gap surface 出现。
- `ReportHandoffState::Prepared` / `Ready` 可进入 delivery;`Placeholder`、`Blocked`、`PendingEvidence` 必须显式可见,不得冒充验收证据。
- `RetentionMarkerState::ActiveHold`、`ActiveReferenceProtectionState::Protected` 是 cleanup / replay / export 的硬约束。
- `ReadVisibilityState::Visible`、`DiagnosticFreshnessState::Fresh` 可正常供给;`Restricted`、`Stale`、`Degraded` 只能受限或降级供给。
- `GapState::Open`、`DegradedOutputState::Active` 是正常可审查输出,但不是成功状态。
- `ReferenceSnapshotState::Resolved` / `Fresh` 可作为 safe summary 输入;其他状态只能 pending、degraded 或 blocked。
- `ProjectionMaintenanceState::Fresh` / `OutboxPublicationState::Published` 表示派生或传播完成,但不得反写 truth。

### 4.3 哪些接口、事件或动作会触发状态迁移?

- Command 触发本仓 observation truth、marker、history 或 handoff 状态迁移,例如 `SubmitObservationMaterial`、`RecordSafeSignal`、`AppendAuditProjection`、`PrepareReportHandoff`、`SetRetentionMarker`、`RecordGapState`、`PrepareExternalAuditExport`、`RegisterReferenceSnapshot`。
- Inbound Event Consumer 只触发本地 receipt / projection input / reference snapshot / stale marker / delivery marker / gap marker 迁移,不得直接创建外部业务 truth。
- Operations Job 触发 outbox publication、projection maintenance、rollup rebuild、reference refresh、gap scan、replay coordination、handoff delivery 和 export preparation 状态迁移,不得修复 source truth。
- Query 不触发核心状态迁移;它只读取状态并返回 visibility、freshness、degraded、blocked 或 not-visible surface。

### 4.4 哪些迁移明确允许,哪些明确禁止?

允许迁移见 §9。禁止迁移见 §10。概要层只保留主线迁移、受限迁移和红线迁移;详细设计继续补齐幂等重复、expected version、并发冲突、错误映射和审计字段。

### 4.5 状态变化如何影响 outbox、projection、下游感知或只读供给?

- observation truth / audit projection / evidence linkage / handoff / gap / retention 状态变化必须产生 history record、按需生成 outbox event,并标记受影响 read / diagnostic / peripheral / handoff projection stale。
- reference snapshot 变化只影响本地 freshness、gap、diagnostic 和 handoff readiness,不得改变外部 source truth。
- maintenance / rebuild / publication 状态只影响派生面、传播可见性和运维可见性,不得改写 core observation truth。
- query 只能读取传播后的 surface,不能为了让读面变新而触发 rebuild、refresh 或 replay。

### 4.6 每个状态属于哪个主要组成部分或关键对象?

状态归属见 §6 和 §12。当前状态全部能回指 Step 06 对象,触发动作全部能回指 Step 07 接口和 Step 08 处理流。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 09 | 只有主题摘要,没有状态定义、状态图、允许/禁止迁移和传播关系 | 重写为多状态族状态机。 |
| 旧 Step 09 | 混入 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord` 等未在 Step 06 正式化对象 | 当前只使用 Step 06/07/08 已收稳对象;log / metric / trace 细分留给详细设计。 |
| 旧 Step 09 | 未区分 success、degraded、blocked、not-visible、placeholder | 当前把 gap、degraded、visibility、handoff authenticity 分为正式状态。 |
| 旧材料 / README | P95、冷存天数、hash chain、Grafana 等技术或产品假设可能变成状态 | 全部保留为 historical material,不进入状态机。 |
| 上游协作风险 | retention / replay / maintenance 状态可能被误写成 source repair 状态 | 当前明确它们只作用于 observation side 和 derived side。 |
| 真实性风险 | report handoff 状态可能伪造验收结果 | 当前明确 `Prepared` / `Ready` / `Delivered` 不等于 final verdict、真实 evidence alias 或 signoff。 |

---

## 6. 状态机边界总览

| 状态组 | 承载对象 | 主要触发 | 说明 |
|---|---|---|---|
| Intake / safety admission | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` | `SubmitObservationMaterial`;`RecordSafetyDisposition`;`ConsumeBusObservationMaterial` | 判断候选材料能否进入 observation side。 |
| Correlation / safe signal / rollup | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`CorrelationLinkRecord` | `BindCorrelationContext`;`RecordSafeSignal`;runtime / sandbox summary consumer;`RebuildSignalRollups` | 表达关联语境、安全信号和 rollup freshness。 |
| Audit projection / evidence linkage | `AuditProjection`;`EvidenceLinkage`;`AuditAppendRecord` | `AppendAuditProjection`;`LinkBodyFreeEvidence`;source audit / artifact evidence consumers | 表达审计投影和 body-free evidence linkage 是否成立、可见或阻断。 |
| Report handoff / authenticity | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`HandoffLifecycleRecord` | `PrepareReportHandoff`;`EvaluateAuthenticityHint`;`PrepareReportHandoffDelivery`;archive feedback consumer | 表达 handoff 准备、真实性提示和交接生命周期。 |
| Retention / active protection | `RetentionMarker`;`ActiveReferenceProtection`;`RetentionChangeRecord` | `SetRetentionMarker`;`ProtectActiveReference` | 表达留存、活动引用保护和清理阻断状态。 |
| Replay / no-write guard | `ReplayScope`;`NoWriteViolation`;`ReplayCoordinationState`;`ReplayExecutionRecord` | `DefineReplayScope`;`RecordNoWriteViolation`;`CoordinateObservationReplay` | 表达 replay 边界、执行协调和越权写源阻断。 |
| Read / diagnostic | `ReadVisibilityState`;`DiagnosticSummary`;`DiagnosticScope`;`ObservationReadModel`;`DiagnosticView`;`ReadAccessRecord` | `GetObservationReadModel`;`GetDiagnosticView`;`RebuildObservationReadModels` | 表达只读可见性、诊断 freshness 和 explain-only surface。 |
| Gap / degraded | `GapState`;`DegradedOutputState`;`GapTransitionRecord`;`GapStatusView` | `RecordGapState`;`ScanObservationGaps`;consumer feedback | 表达缺口、降级、blocked、not-visible、unsafe output。 |
| Peripheral / export | `PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`PeripheralDeliveryRecord` | `PrepareExternalAuditExport`;`RebuildPeripheralViews`;report consumer feedback | 表达 dashboard / alert / external audit / GRC 消费准备与交付状态。 |
| Reference snapshot / adapter | `ReferenceSnapshotState`;`ReferenceSnapshotView`;`ReferenceRefreshRecord` | `RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState`;external context consumers;`RefreshReferenceSnapshots` | 表达外部引用 safe summary、freshness 和 resolution。 |
| Maintenance / publication | `ProjectionMaintenanceState`;`RollupRebuildState`;`RebuildProgressView`;`ProjectionMaintenanceRecord` | `PublishObservationOutbox`;`RebuildObservationReadModels`;`RebuildSignalRollups`;maintenance jobs | 表达派生维护、rollup rebuild、outbox publication 和 progress。 |

---

## 7. 状态定义表

### 7.1 Intake / Safety Admission 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ObservationReceiptState` | `Received` | 候选材料已进入 observation intake 边界,尚未安全处置 | 否 | 只能等待 redaction / admission 判断。 |
| `ObservationReceiptState` | `Accepted` | 材料通过 redaction-first 和准入规则,成为 observation-owned 入口事实 | 是 | 可进入 correlation、audit、read、maintenance 主线。 |
| `ObservationReceiptState` | `Rejected` | 材料不符合观察边界或安全规则 | 否,终态 | 必须保留 `IntakeDecisionRecord`,不得静默丢弃。 |
| `ObservationReceiptState` | `Quarantined` | 材料含 forbidden body 或安全未闭口,进入隔离 | 否 | 可进入 diagnostic / gap,不能进入 safe signal。 |
| `ObservationReceiptState` | `Degraded` | 材料部分可解释但缺少完整安全语境 | 受限 | 只能以 degraded surface 进入 read / handoff。 |
| `ObservationReceiptState` | `Superseded` | 该 receipt 被后续更完整或更安全的 receipt 替代 | 否,历史态 | 保留追溯,不再作为默认输入。 |
| `SafetyDispositionState` | `Pending` | 安全处置尚未完成 | 否 | 不允许 downstream 误读为安全。 |
| `SafetyDispositionState` | `Safe` | 已通过脱敏、body-free 和 visibility 检查 | 是 | 可支撑 safe signal 和 audit projection。 |
| `SafetyDispositionState` | `Redacted` | 已完成安全裁剪,可输出脱敏摘要 | 是,但受限 | 不代表 raw body 可见。 |
| `SafetyDispositionState` | `Rejected` | 因安全或边界原因拒绝 | 否,终态 | 必须说明 reason class。 |
| `SafetyDispositionState` | `Quarantined` | 需隔离审查 | 否 | 只能进入 diagnostic / gap。 |

### 7.2 Correlation / Safe Signal / Rollup 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `CorrelationContextState` | `Unbound` | receipt 尚未绑定 correlation context | 否 | 不能进入 audit timeline。 |
| `CorrelationContextState` | `Bound` | 已绑定 trace / causation / source refs | 是 | 只表达观察关联,不定义业务关系。 |
| `CorrelationContextState` | `Partial` | 只有部分关联线索可用 | 受限 | read / diagnostic 必须暴露 partial。 |
| `CorrelationContextState` | `Invalid` | correlation hints 冲突或不合法 | 否,终态 | 不能自动补造关联。 |
| `SafeSignalState` | `Candidate` | 安全信号候选已出现但未通过 policy | 否 | 不可进入 rollup 或 audit。 |
| `SafeSignalState` | `Recorded` | 安全信号已成立 | 是 | 可进入 projection、rollup、read。 |
| `SafeSignalState` | `Suppressed` | 信号因 safety / visibility 被压制 | 否 | 必须进入 diagnostic / gap surface。 |
| `SafeSignalState` | `Stale` | 信号对应 reference 或 rollup 已过期 | 受限 | 可查询但必须带 freshness。 |
| `SignalRollupState` | `Pending` | rollup 尚未构建或等待窗口闭口 | 否 | Query 返回 pending / stale。 |
| `SignalRollupState` | `Fresh` | rollup 已追上安全信号窗口 | 是 | 可供 dashboard / diagnostic。 |
| `SignalRollupState` | `Stale` | rollup 落后 | 受限 | 不得冒充最新指标。 |
| `SignalRollupState` | `Rebuilding` | rollup 重建中 | 受限 | Query 不触发同步修复。 |
| `SignalRollupState` | `Failed` | rollup 构建失败 | 否 | 需运维可见。 |

### 7.3 Audit Projection / Evidence Linkage 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `AuditProjectionState` | `PendingAppend` | 审计投影候选尚未写入 | 否 | 等待 correlation / safety / source audit ref。 |
| `AuditProjectionState` | `Appended` | 审计投影已追加成立 | 是 | 可进入 timeline、handoff、export。 |
| `AuditProjectionState` | `VisibilityRestricted` | 投影可审计但当前不可完全读取 | 受限 | read / handoff 必须显示 restricted。 |
| `AuditProjectionState` | `Suppressed` | 因安全或边界规则不对外暴露 | 否 | 可保留内部审计历史。 |
| `EvidenceLinkageState` | `Candidate` | evidence linkage 候选已生成 | 否 | 未通过 body-free / visibility policy。 |
| `EvidenceLinkageState` | `Linked` | body-free evidence linkage 已成立 | 是 | 可进入 evidence index input。 |
| `EvidenceLinkageState` | `BodyBlocked` | evidence ref 或 payload 违反 body-free 规则 | 否 | 不能进入 report handoff。 |
| `EvidenceLinkageState` | `NotVisible` | evidence ref 存在但对当前读取/交接不可见 | 受限 | 必须表现为 not-visible,不得伪造缺失或成功。 |
| `EvidenceLinkageState` | `Stale` | linkage 所依赖 reference freshness 已过期 | 受限 | handoff / query 必须带 stale。 |

### 7.4 Report Handoff / Authenticity 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `HandoffReadinessState` | `PendingEvidence` | handoff 缺少必要 evidence index input 或 visibility | 否 | 不得导出为 ready。 |
| `HandoffReadinessState` | `Ready` | handoff 输入已满足 body-free、visibility 和 gap 约束 | 是 | 可进入 delivery / archive handoff。 |
| `HandoffReadinessState` | `Blocked` | 被 gap、not-visible、retention 或 no-write 边界阻断 | 否 | 必须可诊断。 |
| `HandoffReadinessState` | `Degraded` | 可交接但存在受控缺口或 stale | 受限 | 下游必须感知 degraded。 |
| `ReportHandoffState` | `Draft` | handoff record 已创建但未完成准备 | 否 | 不代表可交付。 |
| `ReportHandoffState` | `Prepared` | handoff 材料已准备 | 是,但需 readiness 判断 | 不等于 delivered 或验收通过。 |
| `ReportHandoffState` | `Delivered` | 已交付到目标 consumer | 是 | 不回写 report truth 或验收结论。 |
| `ReportHandoffState` | `Failed` | delivery 失败 | 受限 | 可重试或进入 blocked。 |
| `ReportHandoffState` | `Cancelled` | handoff 被取消 | 否,终态 | 需要新 handoff record。 |
| `AuthenticityHintState` | `Unassessed` | 真实性提示尚未评估 | 否 | 不允许被当作真实证据。 |
| `AuthenticityHintState` | `RealEvidenceLinked` | 已链接真实执行证据 ref | 是,但仍不等于验收签署 | 只说明 evidence linkage 成立。 |
| `AuthenticityHintState` | `PlaceholderDetected` | 发现设计期占位或非真实证据 | 否 | 必须阻断 final evidence 表达。 |
| `AuthenticityHintState` | `Insufficient` | 依据不足 | 否 | 进入 gap / pending evidence。 |

### 7.5 Retention / Protection / Replay / No-write 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `RetentionMarkerState` | `Unmarked` | 尚无留存标记 | 受限 | 不能据此执行清理。 |
| `RetentionMarkerState` | `ActiveHold` | 处于合法留存 hold | 是,作为约束 | 阻止 cleanup / destructive replay。 |
| `RetentionMarkerState` | `ReleaseEligible` | 满足释放候选条件 | 受限 | 还需 active reference 检查。 |
| `RetentionMarkerState` | `Released` | 已释放本仓 observation hold | 否,终态 | 不代表 source cleanup。 |
| `RetentionMarkerState` | `Conflict` | hold / release / archive eligibility 冲突 | 否 | 需要诊断或人工处置。 |
| `ActiveReferenceProtectionState` | `Unprotected` | 没有活动引用保护 | 受限 | 仍需其他 policy 检查。 |
| `ActiveReferenceProtectionState` | `Protected` | 存在活动引用保护 | 是,作为阻断约束 | 阻止 release / cleanup。 |
| `ActiveReferenceProtectionState` | `Expired` | 保护已过期 | 受限 | 需要重新检查引用。 |
| `ReplayScopeState` | `Defined` | replay scope 已定义 | 是,但只对 replay job 可用 | 不代表已执行。 |
| `ReplayScopeState` | `Approved` | replay 已被允许在 observation side 执行 | 是 | 仍受 no-write guard。 |
| `ReplayScopeState` | `Blocked` | replay 被边界或引用保护阻断 | 否 | 不得绕过执行。 |
| `ReplayScopeState` | `Completed` | replay 在 observation side 完成 | 是,但不代表 source 修复 | 只能影响派生/观察面。 |
| `ReplayScopeState` | `Cancelled` | replay 被取消 | 否,终态 | 需要新 scope。 |
| `NoWriteViolationState` | `Detected` | 发现越权写源尝试 | 否 | 必须记录审计。 |
| `NoWriteViolationState` | `Blocked` | 越权写源已被阻断 | 是,作为安全事实 | 可进入 audit / diagnostic。 |
| `NoWriteViolationState` | `Escalated` | 违例需升级处理 | 受限 | 可能影响 maintenance。 |
| `NoWriteViolationState` | `Closed` | 违例处理闭口 | 否,历史态 | 不删除 history。 |

### 7.6 Read / Diagnostic / Gap 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ReadVisibilityState` | `Visible` | 当前 actor / scope 可读取 | 是 | 仍必须 redaction / body-free。 |
| `ReadVisibilityState` | `Restricted` | 可读性受限 | 受限 | 返回 restricted surface。 |
| `ReadVisibilityState` | `NotVisible` | 当前不可见 | 否 | 不得泄露正文或伪装为缺失。 |
| `ReadVisibilityState` | `Blocked` | 被 retention / no-write / safety guard 阻断 | 否 | 必须说明 blocked class。 |
| `DiagnosticFreshnessState` | `Fresh` | diagnostic 已追上当前 projection / gap | 是 | 可正常解释。 |
| `DiagnosticFreshnessState` | `Stale` | diagnostic 过期 | 受限 | 必须带 stale 标记。 |
| `DiagnosticFreshnessState` | `Partial` | 只有部分线索可解释 | 受限 | 不得补造完整结论。 |
| `DiagnosticFreshnessState` | `Unavailable` | diagnostic 不可用 | 否 | 返回 unavailable surface。 |
| `GapState` | `Open` | 缺口已确认且尚未关闭 | 是,但表示受控缺口 | 支撑 degraded / blocked 表达。 |
| `GapState` | `Acknowledged` | 缺口已被承认并进入处置或等待 | 是,但非成功 | 可用于 handoff 解释。 |
| `GapState` | `Resolved` | 缺口已被真实材料或状态变化关闭 | 是 | 必须可追溯到触发。 |
| `GapState` | `Suppressed` | 缺口因 visibility / policy 不对当前消费面展示 | 受限 | 不能变成成功。 |
| `DegradedOutputState` | `None` | 当前无需降级 | 是 | 正常输出。 |
| `DegradedOutputState` | `Active` | 当前输出必须降级 | 受限 | read / export / handoff 必须标注。 |
| `DegradedOutputState` | `Blocked` | 当前不能输出 | 否 | 不能生成替代成功输出。 |

### 7.7 Peripheral / Reference / Maintenance 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `PeripheralDeliveryState` | `Prepared` | 外围消费材料已准备 | 是 | 仍不等于 delivered。 |
| `PeripheralDeliveryState` | `Delivered` | 外围消费材料已送达 | 是 | 不反写 observation truth。 |
| `PeripheralDeliveryState` | `Failed` | 交付失败 | 受限 | 需可重试或可诊断。 |
| `PeripheralDeliveryState` | `Retryable` | 失败但允许重试 | 受限 | 运维可见。 |
| `PeripheralDeliveryState` | `Cancelled` | 交付取消 | 否,终态 | 需要新记录。 |
| `ExternalAuditExportState` | `Draft` | external audit export 准备尚未完成 | 否 | 不允许对外交付。 |
| `ExternalAuditExportState` | `Prepared` | body-free export 已准备 | 是 | 不携带 evidence body。 |
| `ExternalAuditExportState` | `Blocked` | export 被 visibility / gap / retention 阻断 | 否 | 不得导出替代成功。 |
| `ExternalAuditExportState` | `Delivered` | export 已交付 | 是 | 不成为 external audit truth。 |
| `ReferenceSnapshotStateKind` | `Pending` | reference snapshot 等待解析 | 否 | 依赖路径 pending / degraded。 |
| `ReferenceSnapshotStateKind` | `Resolved` | 已解析 safe summary / source version | 是 | 可作为本仓输入。 |
| `ReferenceSnapshotStateKind` | `Stale` | snapshot 已过期 | 受限 | 必须显式 freshness。 |
| `ReferenceSnapshotStateKind` | `Unresolved` | 无法解析 | 否 | 不能补造外部 truth。 |
| `ReferenceSnapshotStateKind` | `Invalid` | reference 无效 | 否,终态 | 需重建 reference。 |
| `ReferenceSnapshotStateKind` | `Unavailable` | 来源暂不可用 | 否 | 可等待或 degraded。 |
| `ProjectionMaintenanceStateKind` | `Fresh` | projection 已追上来源 cursor | 是 | Query 可正常使用。 |
| `ProjectionMaintenanceStateKind` | `Stale` | projection 过期 | 受限 | Query 必须带 stale。 |
| `ProjectionMaintenanceStateKind` | `Rebuilding` | projection 正在重建 | 受限 | Query 不触发同步 repair。 |
| `ProjectionMaintenanceStateKind` | `Failed` | projection 维护失败 | 否 | 运维可见。 |
| `RollupRebuildStateKind` | `Pending` | rollup rebuild 等待执行 | 否 | Query 返回 stale / pending。 |
| `RollupRebuildStateKind` | `Running` | rollup rebuild 执行中 | 受限 | 不影响 source truth。 |
| `RollupRebuildStateKind` | `Completed` | rollup rebuild 完成 | 是 | 可推进 rollup fresh。 |
| `RollupRebuildStateKind` | `Failed` | rollup rebuild 失败 | 否 | 需 job report。 |
| `OutboxPublicationState` | `Pending` | 已提交事实等待传播 | 是,传播未完成 | truth 已成立。 |
| `OutboxPublicationState` | `Published` | 已传播成功 | 是 | 只代表传播成功。 |
| `OutboxPublicationState` | `Failed` | 发布失败 | 受限 | 不回滚 truth。 |
| `OutboxPublicationState` | `DeadLettered` | 不可恢复发布失败 | 否 | 必须运维可见。 |

---

## 8. 状态流转图

### 8.1 Intake / Safety / Correlation / Signal

```text
+====================================================================+
|            Intake / Safety / Correlation / Signal State Flow        |
+====================================================================+
| ObservationReceipt                                                  |
|   Received ---- accept ----> Accepted ---- supersede ----> Superseded |
|      | reject             | quarantine              | degrade       |
|      v                    v                         v              |
|   Rejected             Quarantined               Degraded           |
|                                                                     |
| SafetyDisposition                                                   |
|   Pending ---- mark_safe ----> Safe ---- redact ----> Redacted       |
|      | reject / quarantine                                          |
|      v                                                              |
|   Rejected / Quarantined                                            |
|                                                                     |
| CorrelationContext                                                  |
|   Unbound ---- bind ----> Bound                                     |
|      | partial_bind            | invalidate                         |
|      v                         v                                    |
|   Partial                   Invalid                                 |
|                                                                     |
| SafeSignal                                                          |
|   Candidate ---- record ----> Recorded ---- mark_stale ----> Stale   |
|      | suppress                                                       |
|      v                                                              |
|   Suppressed                                                        |
+====================================================================+
```

关键说明:
- `Accepted` receipt 和 `Safe` / `Redacted` disposition 才能进入 safe signal 与 audit 主线。
- `Partial` correlation 和 `Stale` signal 可以被读取,但必须传播 freshness / degraded。
- `Rejected`、`Quarantined`、`Suppressed` 不允许被 downstream 当作成功观察材料。
- 该图不表达完整错误码、重试或 quarantine 处置细节,这些留给 Step 10 和详细设计。

### 8.2 Audit / Evidence / Handoff / Authenticity

```text
+====================================================================+
|              Audit / Evidence / Handoff / Authenticity Flow         |
+====================================================================+
| AuditProjection                                                     |
|   PendingAppend ---- append ----> Appended                          |
|      | restrict_visibility       | suppress                         |
|      v                           v                                  |
|   VisibilityRestricted        Suppressed                            |
|                                                                     |
| EvidenceLinkage                                                     |
|   Candidate ---- link ----> Linked ---- mark_stale ----> Stale       |
|      | body_block          | mark_not_visible                       |
|      v                     v                                        |
|   BodyBlocked           NotVisible                                  |
|                                                                     |
| HandoffReadiness                                                   |
|   PendingEvidence ---- ready ----> Ready                            |
|      | block                 | degrade                              |
|      v                       v                                      |
|   Blocked                Degraded                                   |
|                                                                     |
| ReportHandoff                                                       |
|   Draft ---- prepare ----> Prepared ---- deliver ----> Delivered     |
|      | cancel                 | fail                                 |
|      v                        v                                     |
|   Cancelled                 Failed                                  |
|                                                                     |
| AuthenticityHint                                                    |
|   Unassessed ---- real_evidence_linked ----> RealEvidenceLinked     |
|      | placeholder_detected       | mark_insufficient                 |
|      v                            v                                |
|   PlaceholderDetected          Insufficient                         |
+====================================================================+
```

关键说明:
- `Linked` evidence linkage 和 `Ready` handoff readiness 仍不等于 final verdict 或 signoff。
- `BodyBlocked`、`NotVisible`、`PlaceholderDetected` 必须阻断真实证据表达。
- `Delivered` 只表达 handoff delivery,不反写 report / acceptance truth。
- 受限、降级和阻断状态必须传播到 read、gap、peripheral export。

### 8.3 Retention / Replay / No-write

```text
+====================================================================+
|                    Retention / Replay / No-write Flow               |
+====================================================================+
| RetentionMarker                                                     |
|   Unmarked ---- set_hold ----> ActiveHold ---- mark_release_ok ----> ReleaseEligible |
|      | conflict                 | conflict                  | release |
|      v                          v                           v       |
|   Conflict                    Conflict                    Released   |
|                                                                     |
| ActiveReferenceProtection                                           |
|   Unprotected ---- protect ----> Protected ---- expire ----> Expired |
|                                                                     |
| ReplayScope                                                         |
|   Defined ---- approve ----> Approved ---- complete ----> Completed  |
|      | block              | cancel                                |
|      v                   v                                         |
|   Blocked             Cancelled                                    |
|                                                                     |
| NoWriteViolation                                                    |
|   Detected ---- block ----> Blocked ---- escalate ----> Escalated    |
|                                   | close                            |
|                                   v                                  |
|                                 Closed                              |
+====================================================================+
```

关键说明:
- `ActiveHold` 和 `Protected` 是清理、replay、handoff、export 的硬约束。
- `ReleaseEligible` 不是 release 成功;详细设计必须继续检查 active reference。
- replay 只能从 `Approved` 到 observation / projection side,不能触碰 source truth。
- `NoWriteViolation::Blocked` 是安全事实,不是补偿写入入口。

### 8.4 Read / Diagnostic / Gap / Degraded

```text
+====================================================================+
|                 Read / Diagnostic / Gap / Degraded Flow             |
+====================================================================+
| ReadVisibility                                                      |
|   Visible ---- restrict ----> Restricted ---- block ----> Blocked    |
|      | mark_not_visible                                             |
|      v                                                              |
|   NotVisible                                                        |
|                                                                     |
| DiagnosticFreshness                                                 |
|   Fresh ---- mark_stale ----> Stale ---- partial ----> Partial       |
|      | unavailable                                                  |
|      v                                                              |
|   Unavailable                                                       |
|                                                                     |
| GapState                                                            |
|   Open ---- acknowledge ----> Acknowledged ---- resolve ----> Resolved |
|      | suppress                                                     |
|      v                                                              |
|   Suppressed                                                        |
|                                                                     |
| DegradedOutput                                                      |
|   None ---- activate ----> Active ---- block ----> Blocked           |
|      ^                         | resolve                            |
|      +-------------------------+                                    |
+====================================================================+
```

关键说明:
- Query 不触发这些迁移;Command、Consumer、Job 或 projection freshness 变化触发迁移。
- `NotVisible` 与 `Open gap` 语义不同:不可见不能被误报为缺失。
- `DegradedOutput::Active` 是受控输出状态,必须被 handoff、export、read surface 感知。
- `Blocked` 表示不能输出,不得生成替代成功结果。

### 8.5 Peripheral / Reference / Maintenance / Publication

```text
+====================================================================+
|          Peripheral / Reference / Maintenance / Publication Flow    |
+====================================================================+
| PeripheralDelivery                                                  |
|   Prepared ---- deliver ----> Delivered                             |
|      | fail             | cancel                                    |
|      v                  v                                           |
|   Failed ---- retryable ----> Retryable                           Cancelled |
|                                                                     |
| ExternalAuditExport                                                 |
|   Draft ---- prepare ----> Prepared ---- deliver ----> Delivered     |
|      | block                                                        |
|      v                                                              |
|   Blocked                                                           |
|                                                                     |
| ReferenceSnapshot                                                   |
|   Pending ---- resolve ----> Resolved ---- mark_stale ----> Stale    |
|      | unresolved / invalid / unavailable                           |
|      v                                                              |
|   Unresolved / Invalid / Unavailable                                |
|                                                                     |
| ProjectionMaintenance                                               |
|   Fresh ---- mark_stale ----> Stale ---- rebuild ----> Rebuilding    |
|      ^                                      | complete              |
|      |                                      v                       |
|      +------------------------------- Completed / Fresh             |
|                                             | fail                  |
|                                             v                       |
|                                           Failed                    |
|                                                                     |
| OutboxPublication                                                   |
|   Pending ---- publish ----> Published                              |
|      | fail                                                        |
|      v                                                             |
|   Failed ---- retry ----> Pending ---- dead_letter ----> DeadLettered|
+====================================================================+
```

关键说明:
- delivery / export 只表达外围消费状态,不反写 observation truth 或 external audit truth。
- reference `Resolved` 只表示本地 safe summary 可用,不是外部 lifecycle truth。
- projection / rollup / read model 维护状态只影响派生可读性。
- outbox `Failed` 不回滚已提交 truth,`DeadLettered` 必须运维可见。

---

## 9. 允许迁移清单

### 9.1 Intake / Correlation / Audit

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ObservationReceipt` | `Received -> Accepted` | `SubmitObservationMaterial`;`ConsumeBusObservationMaterial` accepted |
| `ObservationReceipt` | `Received -> Rejected` | `RecordSafetyDisposition` reject |
| `ObservationReceipt` | `Received -> Quarantined` | forbidden body / safety unresolved |
| `ObservationReceipt` | `Accepted / Degraded -> Superseded` | safer or more complete receipt replaces prior receipt |
| `SafetyDisposition` | `Pending -> Safe` | safety / redaction policy passed |
| `SafetyDisposition` | `Safe -> Redacted` | redaction applied for outward surface |
| `SafetyDisposition` | `Pending -> Rejected / Quarantined` | policy rejects or isolates material |
| `CorrelationContext` | `Unbound -> Bound` | `BindCorrelationContext` |
| `CorrelationContext` | `Unbound -> Partial` | partial correlation accepted |
| `CorrelationContext` | `Unbound / Partial -> Invalid` | conflicting or unsafe hints |
| `SafeSignal` | `Candidate -> Recorded` | `RecordSafeSignal` |
| `SafeSignal` | `Candidate -> Suppressed` | safety / visibility policy suppresses signal |
| `SafeSignal` | `Recorded -> Stale` | reference / rollup freshness changes |
| `SignalRollupWindow` | `Pending -> Fresh` | `RebuildSignalRollups` succeeds |
| `SignalRollupWindow` | `Fresh -> Stale` | new safe signal or source cursor advances |
| `SignalRollupWindow` | `Stale -> Rebuilding -> Fresh` | rollup rebuild job |
| `AuditProjection` | `PendingAppend -> Appended` | `AppendAuditProjection` |
| `AuditProjection` | `Appended -> VisibilityRestricted` | visibility changes |
| `AuditProjection` | `PendingAppend / Appended -> Suppressed` | safety or policy suppresses projection |
| `EvidenceLinkage` | `Candidate -> Linked` | `LinkBodyFreeEvidence` |
| `EvidenceLinkage` | `Candidate -> BodyBlocked` | body-free policy blocks linkage |
| `EvidenceLinkage` | `Linked -> NotVisible / Stale` | visibility / freshness changes |

### 9.2 Handoff / Retention / Gap

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `HandoffReadinessState` | `PendingEvidence -> Ready` | evidence index and gap checks pass |
| `HandoffReadinessState` | `PendingEvidence / Ready -> Blocked` | gap, retention, visibility or no-write block |
| `HandoffReadinessState` | `PendingEvidence / Ready -> Degraded` | partial but controlled handoff |
| `ReportHandoffRecord` | `Draft -> Prepared` | `PrepareReportHandoff` |
| `ReportHandoffRecord` | `Prepared -> Delivered` | `PrepareReportHandoffDelivery` succeeds |
| `ReportHandoffRecord` | `Prepared -> Failed` | delivery fails |
| `ReportHandoffRecord` | `Draft / Prepared -> Cancelled` | handoff cancelled |
| `AuthenticityHint` | `Unassessed -> RealEvidenceLinked` | real evidence linkage exists |
| `AuthenticityHint` | `Unassessed -> PlaceholderDetected / Insufficient` | placeholder or evidence gap detected |
| `RetentionMarker` | `Unmarked -> ActiveHold` | `SetRetentionMarker` hold |
| `RetentionMarker` | `ActiveHold -> ReleaseEligible` | release candidate check |
| `RetentionMarker` | `ReleaseEligible -> Released` | release confirmed after protection check |
| `RetentionMarker` | `Unmarked / ActiveHold / ReleaseEligible -> Conflict` | conflicting retention / archive / reference rule |
| `ActiveReferenceProtection` | `Unprotected -> Protected` | `ProtectActiveReference` |
| `ActiveReferenceProtection` | `Protected -> Expired` | protection window or reference expires |
| `GapState` | `Open -> Acknowledged` | gap accepted as known degraded condition |
| `GapState` | `Open / Acknowledged -> Resolved` | source material, evidence or snapshot becomes available |
| `GapState` | `Open / Acknowledged -> Suppressed` | visibility policy suppresses gap for consumer |
| `DegradedOutputState` | `None -> Active` | gap, stale, partial or not-visible condition appears |
| `DegradedOutputState` | `Active -> None` | condition resolved |
| `DegradedOutputState` | `Active -> Blocked` | output must stop |

### 9.3 Replay / Read / Peripheral / Reference / Maintenance

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ReplayScope` | `Defined -> Approved` | replay boundary approved |
| `ReplayScope` | `Defined / Approved -> Blocked` | no-write / retention / active ref blocks replay |
| `ReplayScope` | `Approved -> Completed` | `CoordinateObservationReplay` completes |
| `ReplayScope` | `Defined / Approved -> Cancelled` | replay cancelled |
| `NoWriteViolation` | `Detected -> Blocked` | no-write guard blocks attempt |
| `NoWriteViolation` | `Blocked -> Escalated` | escalation needed |
| `NoWriteViolation` | `Blocked / Escalated -> Closed` | review closes violation |
| `ReadVisibilityState` | `Visible -> Restricted / NotVisible / Blocked` | policy / retention / no-write / safety changes |
| `ReadVisibilityState` | `Restricted / NotVisible / Blocked -> Visible` | policy or reference condition resolves |
| `DiagnosticSummary` | `Fresh -> Stale / Partial / Unavailable` | projection / reference / gap changes |
| `DiagnosticSummary` | `Stale / Partial -> Fresh` | read model rebuild or reference refresh |
| `PeripheralDeliveryState` | `Prepared -> Delivered` | delivery succeeds |
| `PeripheralDeliveryState` | `Prepared -> Failed / Cancelled` | delivery fails or cancels |
| `PeripheralDeliveryState` | `Failed -> Retryable` | retry eligible |
| `ExternalAuditExportPreparation` | `Draft -> Prepared` | export prepared |
| `ExternalAuditExportPreparation` | `Draft / Prepared -> Blocked` | visibility / gap / retention block |
| `ExternalAuditExportPreparation` | `Prepared -> Delivered` | export delivered |
| `ReferenceSnapshotState` | `Pending -> Resolved` | reference refresh / external consumer succeeds |
| `ReferenceSnapshotState` | `Resolved -> Stale` | source version or freshness moves |
| `ReferenceSnapshotState` | `Pending / Stale -> Unresolved / Invalid / Unavailable` | source cannot be resolved or is invalid |
| `ProjectionMaintenanceState` | `Fresh -> Stale` | source cursor advances |
| `ProjectionMaintenanceState` | `Stale -> Rebuilding` | rebuild job starts |
| `ProjectionMaintenanceState` | `Rebuilding -> Fresh / Failed` | rebuild succeeds / fails |
| `RollupRebuildState` | `Pending -> Running -> Completed` | rollup rebuild job |
| `RollupRebuildState` | `Pending / Running -> Failed` | rollup rebuild fails |
| `OutboxPublicationState` | `Pending -> Published` | publish succeeds |
| `OutboxPublicationState` | `Pending -> Failed` | publish fails |
| `OutboxPublicationState` | `Failed -> Pending` | retry scheduled |
| `OutboxPublicationState` | `Pending / Failed -> DeadLettered` | unrecoverable publish failure |

---

## 10. 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `ObservationReceipt::Received` 未经 safety disposition 直接进入 `Accepted` | redaction-first 是硬边界。 |
| `ObservationReceipt::Rejected / Quarantined` 自动进入 safe signal 或 audit projection | 被拒绝 / 隔离材料不能冒充安全材料。 |
| `SafetyDisposition::Quarantined` 被 Query 或 Job 修成 `Safe` | 安全处置必须走受控 Command / policy。 |
| `CorrelationContext::Partial` 被当作完整 `Bound` 进入 report handoff | partial correlation 必须显式传播 degraded。 |
| `SafeSignal::Suppressed` 进入 rollup 或 dashboard 正常指标 | 被压制信号不能形成正常观测输出。 |
| `AuditProjection::Appended` 携带 source audit body | audit projection 只保存观察投影和 safe summary。 |
| `EvidenceLinkage::BodyBlocked` 进入 `Linked` 而无 body-free 重新判断 | body-free 是 evidence linkage 成立前置。 |
| `EvidenceLinkage::NotVisible` 被 handoff 表达为 evidence missing | not-visible 与 missing 语义不同。 |
| `HandoffReadiness::Blocked / Degraded` 被导出为 final verdict 或 signoff | handoff 不拥有验收 truth。 |
| `AuthenticityHint::PlaceholderDetected` 被写成 `RealEvidenceLinked` | 不能伪造真实 evidence alias 或测试证据。 |
| `RetentionMarker::ReleaseEligible` 直接删除 source truth 或 archive package | L4 不拥有 source cleanup / archive truth。 |
| `ActiveReferenceProtection::Protected` 下执行 cleanup / destructive replay | 活动引用保护必须阻断破坏性操作。 |
| `ReplayScope::Approved / Completed` 改写 runtime、artifact、governance 或 identity truth | replay 只作用于 observation side。 |
| `NoWriteViolation::Detected` 触发补偿写源 | no-write guard 只能阻断和记录。 |
| Query 改变 `ReadVisibilityState`、`DiagnosticFreshnessState`、`GapState`、reference 或 projection 状态 | Query no-write 是架构红线。 |
| Inbound Event Consumer 直接创建外部业务 truth 或关闭 gap | Consumer 只能写本地 marker / snapshot / projection input。 |
| `GapState::Suppressed` 被当作 `Resolved` | suppression 不等于缺口解决。 |
| `DegradedOutput::Blocked` 生成替代成功输出 | blocked 必须阻断输出。 |
| `ExternalAuditExportState::Prepared / Delivered` 成为 external audit truth | export 只是消费面交付。 |
| `ReferenceSnapshotState::Resolved` 替代外部仓 lifecycle state | snapshot 只表达本地 safe summary 可用。 |
| `ProjectionMaintenanceState::Fresh` 反写 observation truth | projection 是派生面。 |
| `OutboxPublicationState::Failed` 回滚已提交 observation truth | 发布失败不影响 truth 成立。 |
| `DeadLettered` 被 query / ops 静默隐藏 | 不可恢复传播失败必须运维可见。 |

---

## 11. 状态传播关系

```text
+====================================================================+
|                    Observation State Propagation                    |
+====================================================================+
| Observation-owned truth or marker changes                           |
|   |                                                                 |
|   +--> History record / audit append record / transition record     |
|   |                                                                 |
|   +--> OutboxPublicationState(Pending) when downstream must know     |
|   |                                                                 |
|   +--> ProjectionMaintenanceState(Stale) / SignalRollupState(Stale) |
|   |                                                                 |
|   +--> Read / diagnostic / gap / handoff / peripheral surface       |
|                                                                     |
| External event or reference snapshot changes                         |
|   |                                                                 |
|   +--> ReferenceSnapshotState / ReferenceRefreshRecord              |
|   |                                                                 |
|   +--> GapState(Open or Resolved) and DegradedOutputState           |
|   |                                                                 |
|   +--> HandoffReadinessState and DiagnosticFreshnessState           |
|                                                                     |
| Operations job result                                                |
|   |                                                                 |
|   +--> ProjectionMaintenanceState / RollupRebuildState              |
|   |                                                                 |
|   +--> OutboxPublicationState or PeripheralDeliveryState            |
|   |                                                                 |
|   +--> RebuildProgressView and job report surface                   |
+====================================================================+
```

关键说明:
- core observation state changes 是 history、outbox、projection stale 和下游感知的来源。
- reference / consumer 状态变化只能影响本地 snapshot、gap、degraded、handoff readiness 和派生 freshness。
- Operations Job 状态变化只影响派生、发布、交接、导出和运维可见面。
- Query 只能读取传播后的状态 surface,不能为改善 surface 触发 refresh / rebuild / replay。

### 11.1 状态变化对下游的影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `ObservationReceipt::Accepted / Rejected / Quarantined / Degraded` | intake status view、history、gap / diagnostic、outbox optional | source truth 或 runtime execution truth |
| `SafetyDisposition::Safe / Redacted / Quarantined` | safe signal eligibility、audit projection eligibility、diagnostic surface | raw body 或 evidence body |
| `CorrelationContext::Bound / Partial / Invalid` | safe signal、audit timeline、diagnostic、gap surface | business relationship truth |
| `SafeSignal::Recorded / Suppressed / Stale` | signal projection、rollup stale、dashboard / diagnostic | raw log / metric / trace body |
| `AuditProjection::Appended / VisibilityRestricted / Suppressed` | audit timeline、evidence index input、handoff readiness | source audit truth |
| `EvidenceLinkage::Linked / BodyBlocked / NotVisible / Stale` | evidence index input、gap、handoff、external export | evidence body 或 artifact truth |
| `HandoffReadiness::Ready / Blocked / Degraded` | report handoff、peripheral export、archive handoff | final verdict / signoff |
| `RetentionMarker::ActiveHold / ReleaseEligible / Conflict` | maintenance、replay、handoff、export guard | source cleanup truth |
| `NoWriteViolation::Detected / Blocked / Escalated` | audit / diagnostic / operations review | compensation write |
| `ReadVisibility::Restricted / NotVisible / Blocked` | query response、diagnostic view、gap / degraded | UI-only hidden state 或 source truth |
| `GapState::Open / Resolved / Suppressed` | degraded output、handoff readiness、peripheral export | auto repair 或 default success |
| `PeripheralDelivery::Failed / Retryable / Delivered` | delivery record、management report、operations review | observation truth rollback |
| `ReferenceSnapshot::Resolved / Stale / Unresolved` | gap scan、diagnostic freshness、handoff readiness、read freshness | external lifecycle state |
| `ProjectionMaintenance::Stale / Fresh / Failed` | query freshness、rebuild progress、dashboard / diagnostic | core truth mutation |
| `OutboxPublication::Published / Failed / DeadLettered` | downstream propagation visibility、operations review | truth rollback |

---

## 12. 按主要组成部分组织的状态归属表

| 主要组成部分 | 状态承载对象 | 关键状态族 |
|---|---|---|
| `Observation Intake and Safety` | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` | receipt lifecycle、safety disposition |
| `Correlation and Safe Signal` | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow`;`CorrelationLinkRecord` | correlation binding、safe signal、rollup freshness |
| `Audit Projection and Body-free Evidence Linkage` | `AuditProjection`;`EvidenceLinkage`;`AuditAppendRecord` | audit append、visibility restriction、body-free linkage |
| `Report Handoff and Authenticity` | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffReadinessState`;`HandoffLifecycleRecord` | readiness、authenticity、delivery lifecycle |
| `Retention, Replay and No-write Guard` | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation` | retention hold、active protection、replay boundary、no-write violation |
| `Read Query and Diagnostic Consumption` | `ReadVisibilityState`;`DiagnosticSummary`;`ObservationReadModel`;`DiagnosticView`;`ReadAccessRecord` | read visibility、diagnostic freshness |
| `Gap and Degraded Expression` | `GapState`;`DegradedOutputState`;`GapTransitionRecord`;`GapStatusView` | gap lifecycle、degraded / blocked output |
| `Peripheral Consumption and Export` | `PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`PeripheralDeliveryRecord` | peripheral delivery、external audit export |
| `Product-neutral Adapter and Reference Support` | `ReferenceSnapshotState`;`ReferenceSnapshotView`;`ReferenceRefreshRecord` | reference resolution、freshness、adapter boundary |
| `Derived Maintenance and Replay Coordination` | `ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState`;`RebuildProgressView` | projection freshness、rollup rebuild、outbox publication、replay coordination |

---

## 13. 状态归属停审记录

| 主要组成部分 | 状态集合是否完整 | 触发接口 / 处理流是否存在 | 停审结论 |
|---|---|---|---|
| `Observation Intake and Safety` | receipt / disposition 状态覆盖 accepted、rejected、quarantined、degraded | `SubmitObservationMaterial`;`RecordSafetyDisposition`;intake flow | pass |
| `Correlation and Safe Signal` | correlation、safe signal、rollup freshness 覆盖 bound、partial、recorded、suppressed、stale | `BindCorrelationContext`;`RecordSafeSignal`;correlation flow | pass |
| `Audit Projection and Body-free Evidence Linkage` | audit projection 与 evidence linkage 覆盖 appended、restricted、linked、body-blocked、not-visible | `AppendAuditProjection`;`LinkBodyFreeEvidence`;audit/evidence flow | pass |
| `Report Handoff and Authenticity` | readiness、handoff、authenticity 覆盖 ready、blocked、degraded、placeholder、delivered | `PrepareReportHandoff`;`EvaluateAuthenticityHint`;handoff flow | pass |
| `Retention, Replay and No-write Guard` | retention、protection、replay、no-write 覆盖 active hold、protected、approved、blocked、violation | `SetRetentionMarker`;`ProtectActiveReference`;`CoordinateObservationReplay`;retention flow | pass |
| `Read Query and Diagnostic Consumption` | read visibility 与 diagnostic freshness 覆盖 visible、restricted、not-visible、fresh、stale、partial | query / diagnostic flow | pass |
| `Gap and Degraded Expression` | gap 与 degraded 输出覆盖 open、acknowledged、resolved、suppressed、active、blocked | `RecordGapState`;`ScanObservationGaps`;gap flow | pass |
| `Peripheral Consumption and Export` | delivery / export 覆盖 prepared、delivered、failed、retryable、blocked | `PrepareExternalAuditExport`;peripheral flow | pass |
| `Product-neutral Adapter and Reference Support` | reference snapshot 覆盖 pending、resolved、stale、unresolved、invalid、unavailable | external consumers;reference refresh flow | pass |
| `Derived Maintenance and Replay Coordination` | maintenance / rollup / publication 覆盖 fresh、stale、rebuilding、failed、published、dead-lettered | maintenance / outbox flow | pass |

---

## 14. 跨状态一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在全局单状态机误建模 | pass | 已明确本仓为多组并列 observation-owned 状态族。 |
| 状态承载对象是否都来自 Step 06 | pass | 状态均回指 Step 06 对象;少量状态类型为对象内状态集合。 |
| 状态触发动作是否能回指 Step 07 / Step 08 | pass | 允许迁移清单均能回指接口或处理流族。 |
| 是否存在同名 / 近义状态冲突 | pass | `Blocked`、`Stale`、`Degraded` 按对象和传播面区分语义。 |
| 是否存在 source truth / evidence body 回流 | pass | 状态均限制在 observation side / body-free / safe summary。 |
| Query 是否触发状态迁移 | pass | Query 只读取状态 surface,不迁移核心状态。 |
| Consumer 是否写外部 truth | pass | Consumer 只写本地 snapshot / marker / projection input。 |
| Job 是否修复 source truth | pass | Job 只维护派生、发布、交接和 progress。 |
| handoff / authenticity 是否伪造验收结果 | pass | 状态明确不代表 final verdict、signoff 或真实 evidence alias。 |
| 是否滑入状态机实现 | pass | 未写代码、数据库列、错误码全集、UI 规则或补偿脚本。 |

---

## 15. Step 10 异常与边界场景移交门禁

Step 10 必须从本步状态红线和禁止迁移中提取异常 / 边界场景,不得重新发明状态语义。

| Step 10 预计异常 / 边界主题 | 来源状态 / 禁止迁移 | 必须守住的边界 |
|---|---|---|
| forbidden body / unsafe material | `Quarantined`;`BodyBlocked`;`SafetyDisposition::Rejected` | raw body / evidence body 不进入本仓。 |
| not-visible vs missing | `EvidenceLinkage::NotVisible`;`ReadVisibility::NotVisible`;`GapState::Open` | 不可见不能被误报为缺失。 |
| placeholder evidence | `AuthenticityHint::PlaceholderDetected`;`Insufficient` | 不伪造真实 evidence alias 或验收签署。 |
| retention conflict / active reference | `RetentionMarker::Conflict`;`ActiveReferenceProtection::Protected` | 不删除仍被引用材料,不触碰 source cleanup。 |
| replay blocked / no-write violation | `ReplayScope::Blocked`;`NoWriteViolation::Detected / Blocked` | replay 不修 source truth。 |
| stale / failed projections | `ProjectionMaintenanceState::Stale / Failed`;`SignalRollupState::Failed` | Query 只能 degraded / stale,不同步修复。 |
| reference unresolved / invalid | `ReferenceSnapshotState::Unresolved / Invalid / Unavailable` | 不补造外部 truth。 |
| peripheral / handoff delivery failed | `PeripheralDelivery::Failed`;`ReportHandoff::Failed`;`OutboxPublication::Failed` | 传播失败不回滚 truth。 |

进入 Step 10 的条件: 仅当用户确认后,Step 10 才能读取本文件并开始异常与边界场景轮廓;不得自动跨 Step,不得触碰正式 `02-概要设计.md`。

---

## 16. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §9 “状态定义与状态流转”引用本文件 §6 的状态机边界总览。
- §9 摘录本文件 §7 的状态定义表,正式正文可按状态族压缩,但不得删除正常主线 / 受限 / 否 的判断。
- §9 摘录本文件 §8 的状态流转图和 §11 的状态传播关系图。
- §9 保留 §9 / §10 的允许 / 禁止迁移清单摘要,尤其保留 redaction-first、body-free、no-write、query no-write、job non-repair 和 handoff non-signoff 红线。
- `03-详细设计.md` 继续展开正式 enum、字段、guard、错误映射、事务、幂等、并发和测试矩阵。

---

## 17. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP09-001` | `OutboxPublicationState` 是否需要在 Step 09 独立对象化 | 当前作为 publication 状态族保留,对象化细节留给详细设计或 Step 12 handoff。 |
| `Q-HLD-STEP09-002` | `DiagnosticFreshnessState` 是否落在 `DiagnosticSummary` 还是 `DiagnosticView` | 当前作为 read / diagnostic 状态族处理,详细设计再选择字段承载。 |
| `Q-HLD-STEP09-003` | `SignalRollupState` 与 `RollupRebuildStateKind` 是否合并 | 当前保留区分:前者面向读侧 freshness,后者面向维护 job execution。 |
| `Q-HLD-STEP09-004` | `Prepared` / `Delivered` 在 handoff、peripheral、external export 中是否统一命名 | 当前统一语义但按对象区分,避免交付成功误写成 truth 成立。 |

---

## 18. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 09 SOP、书写规范、Step 06~08、旧 Step 09 和 L1 参考粒度 | pass |
| 是否明确本仓为多组并列状态机而非全局单状态机 | pass |
| 是否输出状态定义表、状态流转图、允许 / 禁止迁移和传播关系图 | pass |
| 是否按主要组成部分标注状态归属 | pass |
| 状态触发动作是否能回指 Step 07 接口和 Step 08 处理流 | pass |
| 是否区分正常主线、受限主线、否和终态 / 历史态 | pass |
| 是否保持 redaction-first、body-free、no-write 和不拥有业务 truth 边界 | pass |
| 是否未写状态机代码、数据库状态列、错误码全集、UI 规则或补偿脚本 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 10 的上游 blocker | no |

---

## 19. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 9、概要书写规范 4.9、Step 06 关键对象、Step 07 接口骨架、Step 08 处理流、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 09;旧 Step 09 已降级为 historical material | wait_user_confirmation_before_step_10 |
