# L4-observability 03-详细设计 Step 08 - API / Command / Query / Event / Job 协议契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 回填目标: `03-详细设计.md` §7；正式文档仅允许在 Step 19 重新装配
> 当前模式: full-restart / affected-only rebuild
> 当前批次: S08-G M1 cross-protocol closure（Consumer I05-I09、Outbound Event E01-E12、Operations Job J01-J09 与 60 项总审计）
> 当前边界: 60 项协议均已形成独立设计记录并保持 `defined_with_affected_open`；M1 已完成但 affected、owner gap 与 Step 09 flow 仍开放。当前停审，等待用户确认后才进入 Step 09

## 1. Step 状态

| 项 | Current value |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08 `定义 API / Command / Query / Event / Job 协议契约` |
| 进入授权 | 用户已确认由 Step 07 进入 Step 08 |
| 当前批次 | `S08-G M1 cross-protocol closure` |
| 本文件状态 | `Step08_M1_completed_waiting_before_Step09` |
| Step 08 总状态 | `completed_design_record_with_affected_open`；C01-C16、Q01-Q14、I01-I09、E01-E12、J01-J09 均有独立协议卡，累计 `60/60 defined_with_affected_open`，`0/60` unconditional complete。M1 只完成设计记录、总审计和 affected 路由，不表示 runtime-ready、实现完成或测试/验收完成 |
| 正式回填 | `frozen_until_step19_reassembly` |
| gate_status | `Step08_M1_completed_waiting_before_Step09` |
| next_allowed_action | 停审并等待用户明确确认；确认后只读取 Step 09 标准与上游 callable，进入 Step 09 |
| 禁止动作 | 未经确认不读取或写入 Step 09、Step 10 以后、正式`03`、任何`04`文件、实现代码、implementation ledger 或 boundary skeleton |
| 是否需要提交 | 不需要；用户未要求提交 |

本文件取代冻结的 3017 行 Step 08 主产物的 current 地位。冻结文件中的 schema、`done/pass`、owner 和 route-neutral 结论均只作为 historical affected inventory。S08-G 的 M1 closure 由 `03_ddd_step_08_m1_closure_audit.md` 承接；该产物只证明 60 项设计记录和 affected 路由已形成，不关闭后置 owner，不激活任何 runtime slot，也不改变正式 `03` 的 frozen 状态。

## 2. Historical S08-A / I02 输入与权威顺序

本节保留S08-A与I02批次形成时的输入、产出和禁止项，用于历史回溯；其中
“本批”均指I02 checkpoint，不代表当前I04 §2。当前I04的实际读取、authority
冲突和下一读取边界只以独立I04产物§1~§2及本文件§34为准。

### 2.1 本批实际读取

| 顺序 | 输入 | 本批消费内容 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08 | 23 问、五类协议、逐协议独立小节、协议族停审、跨协议 closure | 不用旧批次总表替代逐协议审查 |
| 2 | `详细设计书写规范.md` 5.6/5.7 | 协议总表、logical route/event/job binding、Rust DTO、字段来源、错误、幂等、审计和二级类型闭口 | S08-A 不提前伪造字段 schema |
| 3 | `设计真相源闭环与可落码性标准.md` | DTO 到对象、query surface、duplicate replay、outbox snapshot、actor authority 闭环 | 不新增业务 truth owner |
| 4 | current 正式 `00/01/02`、HLD Step 07/12 | observation-only 边界、同步/异步/后台类别、`16/14/9/12/9` 协议骨架 | HLD 骨架不能覆盖 current Step 06/07 owner |
| 5 | current Step 05/06/07 及 R06.8-A/B | contracts owner、48 concrete input、三个 assembler、四 façade、stored result、outbox、Job identity、runtime/entry 边界 | 不恢复裸 context factory、旧 façade 或 resident publisher |
| 6 | L1-governance / L1-artifact Step 08 | 仅参考逐协议字段级深度、shared carrier、停审和 closure 结构 | 不复制相邻域对象、类型、路由或 truth |
| 7 | 冻结的旧 Step 08 | 只识别旧 use-site、类型和 owner 冲突 | 旧 `done/pass` 无 current 效力 |

### 2.2 本批产出与非产出

| 本批必须形成 | 本批明确不形成 |
|---|---|
| I02单一SourceOwner producer、typed payload、assembler/service、projection/H3、receipt/action与`ConsumeSourceAuditMaterialFlow`审查 | Q14、其他Consumer、Outbound Event、Job 的具体 schema |
| I02 envelope/header-before-payload、source/ref/audit/subject/version字段来源、digest、redaction、same-UoW、projection relation、outcome/action、duplicate与indeterminate边界 | transport locator、broker/topic、credential、provider detail或产品绑定 |
| I02十六项开放 affected register 与 protocol stop review | Step 09 正文、I03~I09、其他后续协议族或实现 |
| 复用S08-B shared Consumer carrier、Step06唯一 result/receipt/ref owner和C-05 action carrier | 创建第二receipt/result/quarantine owner、保存raw body、让application选择transport action或读取时反写业务truth |

## 3. Current protocol authority

### 3.1 Truth 与 owner 边界

1. Public Command、Query、Consumer envelope/payload、Outbound Event payload 和 Job DTO 归 `contracts`；entry handler/runner 分别归 `api`、`worker`、`jobs`。
2. Concrete application input 归 `application::inputs`；entry 只能调用 matching assembler facet，再调用 matching service façade。entry 不得取得 `ObservationOperationContextFactory`、canonicalizer、repository、UoW、resolver 或 external adapter。
3. Command 只改写 observation-owned truth、marker、record、stored result 和 outbox；不得改写 source/business truth、保存 raw body、生成真实 evidence alias、verdict 或 signoff。
4. Query 只读取 committed truth/projection/view/resolver safe surface；不得 reserve、refresh、repair、rebuild、replay、append outbox 或产生 read-access durable side effect。
5. Consumer 只把 trusted producer envelope 转为本地 receipt/projection input/reference snapshot/marker/history；producer authority、source event、schema version、actor、trace 和 idempotency 不得从 payload body 猜测。
6. Outbound payload 必须在 accepted local UoW 中由 typed encoder 形成 immutable snapshot；publisher 只消费 stored snapshot/token，不读取 current truth 重建 payload。
7. Operations Job 是后台或 operator one-shot 协议，不是业务 Command。Public correlation 使用 `JobRunId`；application-local durable identity 使用 `ObservationJobExecutionRef`；二者均不得冒充 external/runtime run identity。
8. Observability 只拥有观测与审计投影、body-free linkage、retention/gap/reference/maintenance marker；Governance、Artifact、Identity、Runtime、Archive、report consumer 和 external audit 的业务事实仍由各自 owner 持有。

### 3.2 通信类别与 logical binding

| 协议族 | 通信语义 | Current entry / producer | Current application owner | 本 Step logical binding | locator owner |
|---|---|---|---|---|---|
| Command | 同步 request/response | `api` exact handler | API assembler -> TruthWrite façade | typed `Command + operation + body` | Step 14 / `04` |
| Query | 同步 request/response | `api` exact handler | API assembler -> Read façade | typed `Query + operation + body` | Step 14 / `04` |
| Inbound Consumer | 异步 delivery/completion | `worker` exact callback | Inbound assembler -> InboundEvent façade | typed `InboundEvent + consumer + payload` | Step 14 / `04` |
| Outbound Event | 异步 immutable publication | accepted application UoW | typed encoder -> outbox snapshot -> publication Job | typed `OutboundEvent + event kind + payload` | Step 14 / `04` |
| Operations Job | scheduled 或 operator one-shot | `jobs` finite handler catalog | Job assembler -> OperationsJob façade | typed `OperationsJob + job kind + body` | Step 14 / `04` |

`route-neutral surface` 不是有效 binding。S08-B 必须把 family 与 operation/body type 定义成有限 typed relation；S08-C~G 再逐协议证明 handler totality。实际 endpoint、topic、schedule locator 和 credential 继续由 Step 14 / `04` 持有，Step 08 不猜产品。

### 3.3 SOP 23 问的批次承接

| SOP 问题 | S08-A 结论 | 后续关闭批次 |
|---|---|---|
| 1~2 协议全集与分批 | 固定 `16/14/9/12/9=60`，按 S08-B~G 分批 | S08-G 做总量复核 |
| 3~4 调用方、处理方、传输方式 | 固定同步/异步/后台类别与有限 logical binding；实际 locator 后置 | S08-B 定义 typed family；S08-C~G 逐协议绑定 |
| 5~10 schema、目标对象、字段来源、缺失行为、Step06/07/09 回指 | 本批只登记 owner/target/flow reservation，不判定闭合 | S08-C~G 逐协议关闭 |
| 11~16 Query view/page/marker、状态、ref/cursor、shared type、命名 | 确认必须独立定义且 repository page 不得外泄 | S08-B、S08-D |
| 17~18 result/envelope/receipt/report 与 Consumer outcome | 确认所有二级 public type 必须有 schema/owner/缺失规则 | S08-B、S08-C、S08-E、S08-G |
| 19~20 actor 与 trusted source actor | authority 不从 payload 推断，例外必须绑定有限 producer/source kind | S08-B、S08-C、S08-E、S08-G |
| 21~22 error、幂等、审计 | 禁止共享模板一次性标 pass | S08-C~G |
| 23 跨协议 public surface closure | 本批只建立审计基线，60 项全部 pending | S08-G |

## 4. Historical material 隔离

| Frozen claim / use | Current conflict | Required rebuild |
|---|---|---|
| Step 状态和全部协议族为 `done/pass` | `03-RPR-S08-PER-PROTOCOL` 仍 open，60 项没有 current 逐协议证明 | 状态全部废止；从 S08-A 重新计数 |
| entry 直接调用 `ObservationOperationContextFactory.for_*` | factory/canonicalizer 为 application-private；entry 只有 matching assembler | S08-C~G 使用 exact assembler -> exact service |
| `ObservationMaintenanceService` | current 只有四个 façade | 九个 Job 全部映射 `ObservationOperationsJobService` |
| entry-visible `ObservationPublicationService` | publication collaborator 是 `pub(crate)`，不构成第五 façade | publication 仅经 `PublishObservationOutbox` Job |
| worker resident publication/scheduler loop | worker 只有九个 Consumer callback | 删除 worker publication protocol authority |
| public `JobExecutionRef` / `JobRunRef` | public correlation 与 local durable execution identity 被混同 | public 使用 `JobRunId`；local identity不暴露 |
| `ReferenceSnapshotRef` | current canonical ref 为 `ReferenceSnapshotStateRef` | 所有 public use-site 精确替换 |
| `PeripheralConsumerScopeRef` | current target 是 `PeripheralConsumerRef + ObservationProjectionScope` | 不创建新 opaque wrapper |
| public 使用 repository `Page<T>/PageInfo` | repository helper application-local，cursor 有 exact binding codec | S08-B 定义 public page；S08-D 逐 Query 映射 |
| 所有 API 仅写 `route-neutral command/query surface` | 无法证明 operation/body/handler totality | 使用有限 family + logical operation；locator仍后置 |
| Command/Job 同名 `PrepareExternalAuditExport` 靠字符串上下文消歧 | public 名称不应擅改，但内部 callable 已分化 | 保留两个 public 名；使用 typed family；Job 映射 Delivery operation |
| `DefineReplayScope` 直接产生 H13 | current H13 只接受 approved scope + exact coordination/target/transition | Command 明确 scope-only/zero-H13；仅 replay Job 可承接 H13 |
| Query 通过共享 surface 临时拼 bool/status | visibility/freshness/degraded/missing 必须来自 current owner | S08-D 逐 Query 定义字段级映射 |
| publisher 从 current truth 重建 outbound payload | current payload 在 accepted UoW 中已冻结 | S08-F 逐事件定义 source -> encoder -> snapshot |

## 5. Current 60-protocol skeleton

### 5.1 Register conventions

- `logical binding` 是 family 内的有限 operation/event/job 名称，不是 transport locator。
- `current callable / producer` 只登记已由 Step 06/07 固定的 owner；S08-A 不重复其签名或对象字段。
- `required flow handoff` 是 Step 09 的唯一 reservation label，当前不是已完成 flow。冻结 Step 09 中同名内容没有 current 效力。
- M1 closure 后 60 行均为 `defined_with_affected_open`；这只表示独立设计记录已形成。只有对应协议的全部 affected 关闭、Step 09 flow 和后续 Step 审计完成后，才可标为无条件 complete。

### 5.2 Command inventory - 16

| ID | Public protocol | Logical binding | Current callable | Target / boundary | Required Step 09 handoff | 状态 |
|---|---|---|---|---|---|---|
| C01 | `SubmitObservationMaterial` | `Command / SubmitObservationMaterial` | API assembler -> TruthWrite `submit_observation_material` | receipt/intake observation truth；no raw/source truth | `SubmitObservationMaterialFlow` | `defined_with_affected_open` |
| C02 | `RecordSafetyDisposition` | `Command / RecordSafetyDisposition` | API assembler -> TruthWrite `record_safety_disposition` | local safety disposition/intake record；no business verdict | `RecordSafetyDispositionFlow` | `defined_with_affected_open` |
| C03 | `BindCorrelationContext` | `Command / BindCorrelationContext` | API assembler -> TruthWrite `bind_correlation_context` | local correlation/link record；no inferred business relation | `BindCorrelationContextFlow` | `defined_with_affected_open` |
| C04 | `RecordSafeSignal` | `Command / RecordSafeSignal` | API assembler -> TruthWrite `record_safe_signal` | redacted safe signal/rollup input；no raw log/metric/trace | `RecordSafeSignalFlow` | `defined_with_affected_open` |
| C05 | `AppendAuditProjection` | `Command / AppendAuditProjection` | API assembler -> TruthWrite `append_audit_projection` | observation audit projection；source audit remains external truth | `AppendAuditProjectionFlow` | `defined_with_affected_open` |
| C06 | `LinkBodyFreeEvidence` | `Command / LinkBodyFreeEvidence` | API assembler -> TruthWrite `link_body_free_evidence` | body-free linkage only；no evidence body/alias mint | `LinkBodyFreeEvidenceFlow` | `defined_with_affected_open` |
| C07 | `PrepareReportHandoff` | `Command / PrepareReportHandoff` | API assembler -> TruthWrite `prepare_report_handoff` | local handoff/readiness；no final report/verdict/signoff | `PrepareReportHandoffFlow` | `defined_with_affected_open` |
| C08 | `EvaluateAuthenticityHint` | `Command / EvaluateAuthenticityHint` | API assembler -> TruthWrite `evaluate_authenticity_hint` | hint/gap expression；no authenticity truth | `EvaluateAuthenticityHintFlow` | `defined_with_affected_open` |
| C09 | `SetRetentionMarker` | `Command / SetRetentionMarker` | API assembler -> TruthWrite `set_retention_marker` | local retention marker；no source deletion | `SetRetentionMarkerFlow` | `defined_with_affected_open` |
| C10 | `ProtectActiveReference` | `Command / ProtectActiveReference` | API assembler -> TruthWrite `protect_active_reference` | active-reference protection；no archive eligibility truth | `ProtectActiveReferenceFlow` | `defined_with_affected_open` |
| C11 | `DefineReplayScope` | `Command / DefineReplayScope` | API assembler -> TruthWrite `define_replay_scope` | scope-only and zero-H13；no replay execution | `DefineReplayScopeFlow` | `defined_with_affected_open` |
| C12 | `RecordNoWriteViolation` | `Command / RecordNoWriteViolation` | API assembler -> TruthWrite `record_no_write_violation` | records blocked attempt；does not perform compensation | `RecordNoWriteViolationFlow` | `defined_with_affected_open` |
| C13 | `RecordGapState` | `Command / RecordGapState` | API assembler -> TruthWrite `record_gap_state` | explicit local gap/degraded state；no source repair | `RecordGapStateFlow` | `defined_with_affected_open` |
| C14 | `PrepareExternalAuditExport` | `Command / PrepareExternalAuditExport` | API assembler -> TruthWrite `prepare_external_audit_export` | local preparation only；no external call/truth transfer | `PrepareExternalAuditExportFlow` | `defined_with_affected_open` |
| C15 | `RegisterReferenceSnapshot` | `Command / RegisterReferenceSnapshot` | API assembler -> TruthWrite `register_reference_snapshot` | body-free reference snapshot；no external body/lifecycle write | `RegisterReferenceSnapshotFlow` | `defined_with_affected_open` |
| C16 | `UpdateReferenceSnapshotState` | `Command / UpdateReferenceSnapshotState` | API assembler -> TruthWrite `update_reference_snapshot_state` | local freshness/resolution state；no external mutation | `UpdateReferenceSnapshotStateFlow` | `defined_with_affected_open` |

### 5.3 Query inventory - 14

| ID | Public protocol | Logical binding | Current callable | View / read boundary | Required Step 09 handoff | 状态 |
|---|---|---|---|---|---|---|
| Q01 | `GetObservationReceipt` | `Query / GetObservationReceipt` | API assembler -> Read `get_observation_receipt` | receipt/safety view；no raw source body | `GetObservationReceiptFlow` | `defined_with_affected_open` |
| Q02 | `GetIntakeStatus` | `Query / GetIntakeStatus` | API assembler -> Read `get_intake_status` | bounded intake page/status；no admission rerun | `GetIntakeStatusFlow` | `defined_with_affected_open` |
| Q03 | `GetSafeSignal` | `Query / GetSafeSignal` | API assembler -> Read `get_safe_signal` | safe signal projection；no raw telemetry | `GetSafeSignalFlow` | `defined_with_affected_open` |
| Q04 | `GetSignalRollup` | `Query / GetSignalRollup` | API assembler -> Read `get_signal_rollup` | rollup/freshness surface；no rebuild-on-read | `GetSignalRollupFlow` | `defined_with_affected_open` |
| Q05 | `GetAuditTimeline` | `Query / GetAuditTimeline` | API assembler -> Read `get_audit_timeline` | body-free timeline page；not source audit truth | `GetAuditTimelineFlow` | `defined_with_affected_open` |
| Q06 | `GetEvidenceIndexInput` | `Query / GetEvidenceIndexInput` | API assembler -> Read `get_evidence_index_input` | body-free index input/gap surface；no evidence fetch | `GetEvidenceIndexInputFlow` | `defined_with_affected_open` |
| Q07 | `GetReportHandoff` | `Query / GetReportHandoff` | API assembler -> Read `get_report_handoff` | handoff/readiness/hint view；no final report | `GetReportHandoffFlow` | `defined_with_affected_open` |
| Q08 | `GetRetentionProtection` | `Query / GetRetentionProtection` | API assembler -> Read `get_retention_protection` | marker/protection surface；no release/cleanup | `GetRetentionProtectionFlow` | `defined_with_affected_open` |
| Q09 | `GetObservationReadModel` | `Query / GetObservationReadModel` | API assembler -> Read `get_observation_read_model` | committed point read model；no projection repair | `GetObservationReadModelFlow` | `defined_with_affected_open` |
| Q10 | `GetDiagnosticView` | `Query / GetDiagnosticView` | API assembler -> Read `get_diagnostic_view` | explain-only diagnostic；no control action | `GetDiagnosticViewFlow` | `defined_with_affected_open` |
| Q11 | `GetGapStatus` | `Query / GetGapStatus` | API assembler -> Read `get_gap_status` | point/full-lifecycle page；no P12 rerun or auto-close | `GetGapStatusFlow` | `defined_with_affected_open` |
| Q12 | `GetPeripheralExportView` | `Query / GetPeripheralExportView` | API assembler -> Read `get_peripheral_export_view` | read-only peripheral projection；no second truth | `GetPeripheralExportViewFlow` | `defined_with_affected_open` |
| Q13 | `GetReferenceSnapshotView` | `Query / GetReferenceSnapshotView` | API assembler -> Read `get_reference_snapshot_view` | body-free snapshot state；no refresh | `GetReferenceSnapshotViewFlow` | `defined_with_affected_open` |
| Q14 | `GetRebuildProgress` | `Query / GetRebuildProgress` | API assembler -> Read `get_rebuild_progress` | maintenance progress surface；no start/resume | `GetRebuildProgressFlow` | `defined_with_affected_open` |

### 5.4 Inbound Event Consumer inventory - 9

| ID | Public protocol | Logical binding | Current callable | Producer / local boundary | Required Step 09 handoff | 状态 |
|---|---|---|---|---|---|---|
| I01 | `ConsumeBusObservationMaterial` | `InboundEvent / ConsumeBusObservationMaterial` | Inbound assembler -> InboundEvent `consume_bus_observation_material` | L0-bus collaboration -> local receipt/intake；bus not truth owner | `ConsumeBusObservationMaterialFlow` | `defined_with_affected_open` |
| I02 | `ConsumeSourceAuditMaterial` | `InboundEvent / ConsumeSourceAuditMaterial` | Inbound assembler -> InboundEvent `consume_source_audit_material` | finite source-audit producers -> body-free local projection | `ConsumeSourceAuditMaterialFlow` | `defined_with_affected_open` |
| I03 | `ConsumeIdentityObservationContext` | `InboundEvent / ConsumeIdentityObservationContext` | Inbound assembler -> InboundEvent `consume_identity_observation_context` | L1-identity -> local reference snapshot；no identity truth write | `ConsumeIdentityObservationContextFlow` | `defined_with_affected_open` |
| I04 | `ConsumeGovernanceAuditContext` | `InboundEvent / ConsumeGovernanceAuditContext` | Inbound assembler -> InboundEvent `consume_governance_audit_context` | L1-governance -> body-free evidence/reference surface | `ConsumeGovernanceAuditContextFlow` | `defined_with_affected_open` |
| I05 | `ConsumeArtifactEvidenceContext` | `InboundEvent / ConsumeArtifactEvidenceContext` | Inbound assembler -> InboundEvent `consume_artifact_evidence_context` | L1-artifact -> linkage/reference input；no artifact body | `ConsumeArtifactEvidenceContextFlow` | `defined_with_affected_open` |
| I06 | `ConsumeRuntimeSignalSummary` | `InboundEvent / ConsumeRuntimeSignalSummary` | Inbound assembler -> InboundEvent `consume_runtime_signal_summary` | runtime/capability -> safe signal/reference input；no run truth | `ConsumeRuntimeSignalSummaryFlow` | `defined_with_affected_open` |
| I07 | `ConsumeSandboxSignalSummary` | `InboundEvent / ConsumeSandboxSignalSummary` | Inbound assembler -> InboundEvent `consume_sandbox_signal_summary` | sandbox -> safety/signal marker；no execution body/result | `ConsumeSandboxSignalSummaryFlow` | `defined_with_affected_open` |
| I08 | `ConsumeArchiveHandoffFeedback` | `InboundEvent / ConsumeArchiveHandoffFeedback` | Inbound assembler -> InboundEvent `consume_archive_handoff_feedback` | archive/handoff consumer -> local lifecycle marker | `ConsumeArchiveHandoffFeedbackFlow` | `defined_with_affected_open` |
| I09 | `ConsumeReportConsumerFeedback` | `InboundEvent / ConsumeReportConsumerFeedback` | Inbound assembler -> InboundEvent `consume_report_consumer_feedback` | report/peripheral consumer -> delivery/gap marker；no truth backwrite | `ConsumeReportConsumerFeedbackFlow` | `defined_with_affected_open` |

### 5.5 Outbound Event inventory - 12

| ID | Public event | Logical binding | Current production owner | Committed source / boundary | Required Step 09 handoff | 状态 |
|---|---|---|---|---|---|---|
| E01 | `ObservationReceiptChanged` | `OutboundEvent / ObservationReceiptChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed receipt/disposition change；no raw material | `ProduceObservationReceiptChangedFlow` | `defined_with_affected_open` |
| E02 | `SafetyDispositionChanged` | `OutboundEvent / SafetyDispositionChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed safety change；safe reason class only | `ProduceSafetyDispositionChangedFlow` | `defined_with_affected_open` |
| E03 | `SafeSignalRecorded` | `OutboundEvent / SafeSignalRecorded` | accepted UoW -> typed follower seed -> immutable outbox pair | committed safe signal/rollup relation；no raw telemetry | `ProduceSafeSignalRecordedFlow` | `defined_with_affected_open` |
| E04 | `AuditProjectionAppended` | `OutboundEvent / AuditProjectionAppended` | accepted UoW -> typed follower seed -> immutable outbox pair | committed audit projection；no source audit body | `ProduceAuditProjectionAppendedFlow` | `defined_with_affected_open` |
| E05 | `EvidenceLinkageChanged` | `OutboundEvent / EvidenceLinkageChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed body-free linkage；no evidence body/alias | `ProduceEvidenceLinkageChangedFlow` | `defined_with_affected_open` |
| E06 | `ReportHandoffChanged` | `OutboundEvent / ReportHandoffChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed handoff/readiness change；no verdict/signoff | `ProduceReportHandoffChangedFlow` | `defined_with_affected_open` |
| E07 | `RetentionMarkerChanged` | `OutboundEvent / RetentionMarkerChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed retention/protection change；not cleanup proof | `ProduceRetentionMarkerChangedFlow` | `defined_with_affected_open` |
| E08 | `NoWriteViolationRecorded` | `OutboundEvent / NoWriteViolationRecorded` | accepted UoW -> typed follower seed -> immutable outbox pair | committed blocked-write record；no compensation | `ProduceNoWriteViolationRecordedFlow` | `defined_with_affected_open` |
| E09 | `GapStateChanged` | `OutboundEvent / GapStateChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed gap/degraded change；not source repair | `ProduceGapStateChangedFlow` | `defined_with_affected_open` |
| E10 | `ReferenceSnapshotChanged` | `OutboundEvent / ReferenceSnapshotChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed body-free snapshot state；no external body | `ProduceReferenceSnapshotChangedFlow` | `defined_with_affected_open` |
| E11 | `DerivedProjectionChanged` | `OutboundEvent / DerivedProjectionChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed maintenance/projection marker；not business truth | `ProduceDerivedProjectionChangedFlow` | `defined_with_affected_open` |
| E12 | `PeripheralDeliveryChanged` | `OutboundEvent / PeripheralDeliveryChanged` | accepted UoW -> typed follower seed -> immutable outbox pair | committed local preparation/delivery state；external failure no rollback | `ProducePeripheralDeliveryChangedFlow` | `defined_with_affected_open` |

All twelve events are later published only through the `PublishObservationOutbox` Operations Job. The publisher is not the event schema owner and cannot select an event kind from free text, deserialize-and-reinterpret stored bytes, or rebuild payload from current truth.

### 5.6 Operations Job inventory - 9

| ID | Public protocol | Logical binding | Current callable | Job boundary | Required Step 09 handoff | 状态 |
|---|---|---|---|---|---|---|
| J01 | `PublishObservationOutbox` | `OperationsJob / PublishObservationOutbox` | Job assembler -> OperationsJob `publish_observation_outbox` | publishes claimed immutable snapshots；no truth rollback/rebuild | `PublishObservationOutboxFlow` | `defined_with_affected_open` |
| J02 | `RebuildObservationReadModels` | `OperationsJob / RebuildObservationReadModels` | Job assembler -> OperationsJob `rebuild_observation_read_models` | derived read model only；committed observation facts as source | `RebuildObservationReadModelsFlow` | `defined_with_affected_open` |
| J03 | `RebuildSignalRollups` | `OperationsJob / RebuildSignalRollups` | Job assembler -> OperationsJob `rebuild_signal_rollups` | safe-signal rollup only；no raw telemetry reinterpretation | `RebuildSignalRollupsFlow` | `defined_with_affected_open` |
| J04 | `RefreshReferenceSnapshots` | `OperationsJob / RefreshReferenceSnapshots` | Job assembler -> OperationsJob `refresh_reference_snapshots` | body-free resolver refresh；no external lifecycle mutation | `RefreshReferenceSnapshotsFlow` | `defined_with_affected_open` |
| J05 | `ScanObservationGaps` | `OperationsJob / ScanObservationGaps` | Job assembler -> OperationsJob `scan_observation_gaps` | detects/expresses gaps；no synthetic source fact | `ScanObservationGapsFlow` | `defined_with_affected_open` |
| J06 | `CoordinateObservationReplay` | `OperationsJob / CoordinateObservationReplay` | Job assembler -> OperationsJob `coordinate_observation_replay` | observation-side per-target replay；only current H13-capable protocol | `CoordinateObservationReplayFlow` | `defined_with_affected_open` |
| J07 | `PrepareReportHandoffDelivery` | `OperationsJob / PrepareReportHandoffDelivery` | Job assembler -> OperationsJob `prepare_report_handoff_delivery` | body-free handoff delivery phases；no verdict/signoff/run fabrication | `PrepareReportHandoffDeliveryFlow` | `defined_with_affected_open` |
| J08 | `PrepareExternalAuditExport` | `OperationsJob / PrepareExternalAuditExport` | Job assembler -> OperationsJob `prepare_external_audit_export_delivery` | public body remains `PrepareExternalAuditExportJobInput`;internal operation/input use Delivery suffix | `PrepareExternalAuditExportDeliveryFlow` | `defined_with_affected_open` |
| J09 | `RebuildPeripheralViews` | `OperationsJob / RebuildPeripheralViews` | Job assembler -> OperationsJob `rebuild_peripheral_views` | derived peripheral views only；no core/source truth backwrite | `RebuildPeripheralViewsFlow` | `defined_with_affected_open` |

J08 intentionally keeps the HLD public Job name `PrepareExternalAuditExport`. Dispatch must use the typed `OperationsJob` family plus its body type, and then statically map to `prepare_external_audit_export_delivery` / `PrepareExternalAuditExportDeliveryInput`. No naked string can dispatch both C14 and J08.

## 6. S08-B shared public carrier

### 6.1 本批输入、产出与 owner 决策

| 输入 | 本批实际消费 | 权威限制 |
|---|---|---|
| Step 08 SOP 23问与书写规范5.7 | public secondary type、Query page/surface、Consumer envelope/receipt、Job report和逐协议停审 | shared carrier不能替代S08-C~G逐协议schema |
| current Step 06 contracts carrier | `SchemaVersion`、source/producer family、digest、cursor、visibility/degraded、refs/sets与`ProtocolError` | 已有类型只引用，不复制定义 |
| current Step 06 application | 48 operation、operation context、stored result、four application result carriers、Job report与outbox immutable snapshot | application-private类型不得出现在public字段中 |
| current Step 07 | 3 assembler facets、4 service facade、public-page到repository-page映射、entry最小权限 | shared wrapper不得开放generic dispatch或repository capability |
| L1-governance / L1-artifact Step 08 | shared helper的字段级深度、duplicate replay和owner registry结构 | 不复制相邻域类型、truth、route或outcome |
| 冻结正式`03`与旧Step08 | 只识别`JobExecutionRef`、generic page、free-name wrapper等历史冲突 | 旧schema与`pass`不具current authority |

S08-B新增定义只落在`observability-contracts`既定文件：`metadata.rs`承接family/name/metadata，`surfaces.rs`承接result access与共享visibility/availability/missing surface，`commands.rs`承接Command wrapper，`queries.rs`承接Query/page，`events.rs`承接inbound/outbound envelope，`jobs.rs`承接Job wrapper/report，`errors.rs`承接public error。`application`只实现静态映射和response assembler；`api/worker/jobs`只消费matching public类型。

### 6.2 Finite protocol family 与 operation vocabulary

```rust
/// L4-observability公开协议的有限通信族。
pub enum ObservationProtocolFamily {
    /// 同步修改本仓观测事实或标记的命令。
    Command,
    /// 只读取已提交事实或投影的查询。
    Query,
    /// 由可信生产方投递的异步入站事件。
    InboundEvent,
    /// 在已接受UoW内冻结的异步出站事件。
    OutboundEvent,
    /// 调度或操作员触发的一次性后台任务。
    OperationsJob,
}

/// Command族的16个公开逻辑操作名。
pub enum ObservationCommandName {
    SubmitObservationMaterial,
    RecordSafetyDisposition,
    BindCorrelationContext,
    RecordSafeSignal,
    AppendAuditProjection,
    LinkBodyFreeEvidence,
    PrepareReportHandoff,
    EvaluateAuthenticityHint,
    SetRetentionMarker,
    ProtectActiveReference,
    DefineReplayScope,
    RecordNoWriteViolation,
    RecordGapState,
    PrepareExternalAuditExport,
    RegisterReferenceSnapshot,
    UpdateReferenceSnapshotState,
}

/// Query族的14个公开逻辑操作名。
pub enum ObservationQueryName {
    GetObservationReceipt,
    GetIntakeStatus,
    GetSafeSignal,
    GetSignalRollup,
    GetAuditTimeline,
    GetEvidenceIndexInput,
    GetReportHandoff,
    GetRetentionProtection,
    GetObservationReadModel,
    GetDiagnosticView,
    GetGapStatus,
    GetPeripheralExportView,
    GetReferenceSnapshotView,
    GetRebuildProgress,
}

/// Inbound Event族的9个公开consumer逻辑名。
pub enum ObservationInboundConsumerName {
    ConsumeBusObservationMaterial,
    ConsumeSourceAuditMaterial,
    ConsumeIdentityObservationContext,
    ConsumeGovernanceAuditContext,
    ConsumeArtifactEvidenceContext,
    ConsumeRuntimeSignalSummary,
    ConsumeSandboxSignalSummary,
    ConsumeArchiveHandoffFeedback,
    ConsumeReportConsumerFeedback,
}

/// Outbound Event族的12个公开事件名。
pub enum ObservationOutboundEventName {
    ObservationReceiptChanged,
    SafetyDispositionChanged,
    SafeSignalRecorded,
    AuditProjectionAppended,
    EvidenceLinkageChanged,
    ReportHandoffChanged,
    RetentionMarkerChanged,
    NoWriteViolationRecorded,
    GapStateChanged,
    ReferenceSnapshotChanged,
    DerivedProjectionChanged,
    PeripheralDeliveryChanged,
}

/// Operations Job族的9个公开任务名。
pub enum ObservationJobName {
    PublishObservationOutbox,
    RebuildObservationReadModels,
    RebuildSignalRollups,
    RefreshReferenceSnapshots,
    ScanObservationGaps,
    CoordinateObservationReplay,
    PrepareReportHandoffDelivery,
    PrepareExternalAuditExport,
    RebuildPeripheralViews,
}

/// 带协议族标签的公开逻辑操作，禁止脱离family使用裸名称。
pub enum ObservationProtocolOperation {
    Command(ObservationCommandName),
    Query(ObservationQueryName),
    InboundEvent(ObservationInboundConsumerName),
    OutboundEvent(ObservationOutboundEventName),
    OperationsJob(ObservationJobName),
}
```

五个name enum分别按§5 inventory顺序使用显式稳定code：Command=`0x01xx`、Query=`0x02xx`、Inbound=`0x03xx`、Outbound=`0x05xx`、Job=`0x04xx`；`xx`从1开始且不得使用Rust ordinal。Outbound使用独立`0x05` family，避免与48个application callable discriminator混合。wire token是上方variant的exact PascalCase拼写；unknown、空值、数字、大小写别名、trim后匹配和`Other(String)`全部返回`ProtocolError::UnknownEnumToken`。

| public family | public name -> current internal owner | static mapping count | 特殊规则 |
|---|---|---:|---|
| Command | `ObservationCommandName` -> `ObservationOperationName::Command(ObservationCommandOperation)` | 16/16 | 同名export只能到Command variant |
| Query | `ObservationQueryName` -> `ObservationOperationName::Query(ObservationQueryOperation)` | 14/14 | 无idempotency reservation |
| Inbound Event | `ObservationInboundConsumerName` -> `ObservationOperationName::InboundConsumer(ObservationInboundConsumerOperation)` | 9/9 | 还需static producer compatibility |
| Outbound Event | `ObservationOutboundEventName` -> typed follower seed/encoder variant | 12/12 | 不构造application operation context |
| Operations Job | `ObservationJobName` -> `ObservationOperationName::Job(ObservationJobOperation)` | 9/9 | public export名映射internal `PrepareExternalAuditExportDelivery` |

`ObservationProtocolOperation::family()`、各name的`stable_code()`/`as_token()`和exact `parse()`必须以穷举`match`实现。不得提供dynamic registry、`String` constructor、跨family `From`、route/topic/schedule lookup或从handler名反推operation。

### 6.3 Operation 与 concrete body 的 sealed binding

```rust
/// 由contracts内具体Command request DTO实现的封闭绑定。
pub trait ObservationCommandBody: private::Sealed {
    const COMMAND: ObservationCommandName;
}

/// 由contracts内具体Query request DTO实现的封闭绑定。
pub trait ObservationQueryBody: private::Sealed {
    const QUERY: ObservationQueryName;
}

/// 由contracts内具体Inbound payload DTO实现的封闭绑定。
pub trait ObservationInboundPayload: private::Sealed {
    const CONSUMER: ObservationInboundConsumerName;
    const PRODUCER: ObservationProducerFamily;
}

/// 由contracts内具体Outbound payload DTO实现的封闭绑定。
pub trait ObservationOutboundPayload: private::Sealed {
    const EVENT: ObservationOutboundEventName;
}

/// 由contracts内具体Job input DTO实现的封闭绑定。
pub trait ObservationJobInputBody: private::Sealed {
    const JOB: ObservationJobName;
}

/// 由contracts内具体Command result DTO实现的封闭绑定。
pub trait ObservationCommandResultBody: private::Sealed {
    const COMMAND: ObservationCommandName;
}

/// 由contracts内具体Query view/item DTO实现的封闭绑定。
pub trait ObservationQueryViewBody: private::Sealed {
    const QUERY: ObservationQueryName;
}

/// 由contracts内具体Job output DTO实现的封闭绑定。
pub trait ObservationJobOutputBody: private::Sealed {
    const JOB: ObservationJobName;
}
```

五个request/event trait和三个response trait都不作为插件扩展点。`private::Sealed`只允许本crate中的current concrete DTO实现；一个具体协议可拥有独立request、result/view/output type，因此response trait实现数不计入60协议总数。Request/envelope/response factory必须检查显式name等于`T`的associated constant；wire decoder先由已选择的finite entry slot确定expected name，再解析exact `T`，不能先解析无标签JSON后猜variant。S08-C~G逐协议登记每个implementation；S08-B只固定机制，S08-C当前已增加C01-C16的独立记录，十六项仍有affected，故当前为`16/60 defined_with_affected_open`、`0/60 complete`。

`PrepareExternalAuditExportRequest`只能实现`ObservationCommandBody<COMMAND=ObservationCommandName::PrepareExternalAuditExport>`；`PrepareExternalAuditExportJobInput`只能实现`ObservationJobInputBody<JOB=ObservationJobName::PrepareExternalAuditExport>`。二者进入不同wrapper、不同assembler method和不同application operation，不能以同一个字符串dispatch。

Command、Query和Job的`SchemaVersion`由static entry slot的validated frame在反序列化wrapper前绑定，不重复放入body或metadata。P0只允许`V1`；expected version进入decoder、public error surface和stored replay surface，但不进入Step 06这三族application input的既有control fields。Consumer必须把version交给application做source/schema兼容校验，Outbound必须把version冻结进immutable snapshot，因此两族envelope显式携带`schema_version`。任何入口都不得从body字段、operation name或current default猜版本。

### 6.4 Shared request metadata and result access

```rust
/// 所有Command共享的可信请求metadata。
pub struct ObservationCommandMetadata {
    /// 经认证入口投影的body-free actor；不包含profile或credential。
    pub actor_ref: ActorSafeRef,
    /// 可选的分布式trace相关引用；缺失时不得伪造。
    pub trace_ref: Option<TraceCorrelationRef>,
    /// Command逻辑幂等键；不得用request time、cursor或run id替代。
    pub idempotency_key: IdempotencyKey,
    /// 调用方按当前公开profile声明的request digest。
    pub request_digest: RequestDigest,
    /// 可信边界记录的请求时点，不进入request digest。
    pub requested_at: ObservedAt,
}

/// 所有Query共享的可信请求metadata。
pub struct ObservationQueryMetadata {
    /// 经认证入口投影的body-free actor。
    pub actor_ref: ActorSafeRef,
    /// 可选trace相关引用；不参与授权或分页binding。
    pub trace_ref: Option<TraceCorrelationRef>,
    /// 已验证的读取可见性scope，不从page cursor推导。
    pub visibility_scope_ref: VisibilityScopeRef,
    /// 对已提交projection的只读一致性偏好。
    pub consistency: ObservationConsistencyHint,
    /// 可信边界记录的查询时点；不得触发refresh或rebuild。
    pub requested_at: ObservedAt,
}

/// 所有Operations Job共享的可信调用metadata。
pub struct ObservationJobMetadata {
    /// 公开调用相关性ID；不是真实runtime/external run identity。
    pub job_run_id: JobRunId,
    /// operator/system actor的body-free投影。
    pub actor_ref: ActorSafeRef,
    /// 可选trace相关引用；缺失时保持None。
    pub trace_ref: Option<TraceCorrelationRef>,
    /// Job逻辑幂等键；不得用job_run_id、attempt或claim代替。
    pub idempotency_key: IdempotencyKey,
    /// 可信边界记录的调用时点；不进入request或plan digest。
    pub requested_at: ObservedAt,
}

/// Public projection of how this invocation obtained an immutable stored result.
pub enum ObservationProtocolResultAccess {
    /// This invocation committed the returned stored surface.
    FreshlyCommitted,
    /// This invocation loaded and validated the original stored surface.
    Replayed,
}
```

| metadata | assembler映射 | 缺失/冲突 | 明确排除 |
|---|---|---|---|
| Command | local canonicalizer从validated body生成`RequestDigestCandidates`，supplied digest只与current write candidate比较；然后private context factory组合actor/trace/key | 任一required字段缺失=`InvalidEnvelope`；profile/value mismatch在reserve/UoW前失败 | caller digest成为authoritative、entry自行hash、payload actor |
| Query | exact assembler生成query digest并构造zero-key context；visibility/consistency原样进入input | actor/scope/consistency缺失或unknown拒绝；trace可None | idempotency key、stored result、write capability |
| Job | exact assembler生成candidates/context并原样复制`JobRunId` correlation | run/key/actor/time缺失拒绝；trace可None | `ObservationJobExecutionRef`、plan/report/claim/fence、real run ID |

Consumer actor不在public payload或untrusted envelope body中声明。`worker` exact callback从authenticated entry binding取得`ActorSafeRef`，再与validated `ObservationInboundEventEnvelope<T>`一起调用matching assembler；payload中的actor-like字段即使存在也不得成为effective actor。

| carrier concern | 唯一 authority | public重复值的处理 | 禁止双承载 |
|---|---|---|---|
| Command request digest | application canonicalizer生成的current write candidate | metadata中的supplied digest只做profile/value equivalence check，验证后丢弃 | supplied digest不得进入concrete input、reservation的第二字段或覆盖local digest |
| Query / Job / Consumer request digest | matching application assembler的typed canonical material | Query/Job没有public digest字段；Consumer envelope也不携带digest | entry、payload、schedule或adapter不得补算另一摘要 |
| Command / Query / Job schema | static finite entry slot先绑定expected `SchemaVersion` | decoder、error surface与stored replay metadata使用同一个validated value | body/metadata/current config不得重复声明或覆盖schema |
| Consumer / Outbound schema | validated typed envelope的`schema_version` | Consumer继续传入application compatibility check；Outbound原样冻结进snapshot | payload字段、producer default或publisher不得改写 |
| trace correlation | authenticated metadata/envelope提供的optional `TraceCorrelationRef` | application context只复制；Outbound只复制accepted context；replay保留首次stored surface | trace不参与actor授权、idempotency key、request digest、source event identity或业务因果判定 |

`BindCorrelationContext` body中的semantic trace字段属于该Command要写入的observation-owned correlation input，与metadata中的调用链`trace_ref`是两个具名角色；S08-C必须分别映射且禁止互相fallback。其他具体body若需要trace-like业务字段，也必须在逐协议审查中证明其owner和用途，不能复用metadata字段省略schema。

`ObservationProtocolResultAccess`归`contracts::surfaces`，由application response assembler从`ObservationResultAccess`一对一映射。它不是业务结果、durable state、retry decision或transport action：`Replayed`必须与原stored outcome/report/refs/error同时返回，不能覆盖为一个泛化duplicate终态；pre-UoW且没有stored result的分支必须为`None`或没有response，不能伪造`FreshlyCommitted`。

### 6.5 Command shared carrier

```rust
/// 一个具体Command的公开请求wrapper。
pub struct ObservationCommandRequest<T: ObservationCommandBody> {
    /// 必须等于`T::COMMAND`的有限逻辑名。
    pub command_name: ObservationCommandName,
    /// actor、trace、idempotency、digest和可信请求时点。
    pub metadata: ObservationCommandMetadata,
    /// 具体Command request DTO。
    pub body: T,
}

/// 一个Command结果surface的公开事实分类；不是调用access或durable lifecycle。
pub enum ObservationCommandOutcome {
    /// Stored surface表示允许的本地结果已提交。
    Accepted,
    /// 请求、policy或state guard在正常truth commit前拒绝。
    Rejected,
    /// 同logical key material冲突或optimistic version冲突。
    Conflict,
    /// 安全依赖暂不可用，调用未被当作正常成功。
    Delayed,
    /// 只提交了允许的body-free quarantine/gap结果。
    Quarantined,
    /// Stored surface表示请求有效且形成了无变化结果。
    NoOp,
    /// 明确guard阻止正常结果；可能是pre-UoW或已保存的formal block。
    Blocked,
}

/// 可被exact encoder持久化并逐字节回放的Command结果surface。
pub struct ObservationStoredCommandSurface<T: ObservationCommandResultBody> {
    /// 与具体result DTO静态一致的Command名。
    pub command_name: ObservationCommandName,
    /// 首次已保存的结果事实；replay时保持不变。
    pub outcome: ObservationCommandOutcome,
    /// 已提交结果的公开identity。
    pub result_ref: BodyFreeRef,
    /// operation-specific result body；presence由逐Command矩阵决定。
    pub result: Option<T>,
    /// 首次提交形成的canonical changed refs。
    pub changed_refs: BodyFreeRefSet,
    /// 首次提交形成的outbox refs。
    pub outbox_refs: Vec<OutboxRecordRef>,
    /// 与stored结果关联的canonical gap refs；空集合有明确语义。
    pub gap_refs: GapStateRefSet,
    /// durable rejection/quarantine/block的安全错误投影。
    pub error: Option<ObservationProtocolErrorSurface>,
}

/// 一个具体Command的调用级公开响应。
pub enum ObservationCommandResponse<T: ObservationCommandResultBody> {
    /// Fresh commit或duplicate replay包装同一immutable stored surface。
    Stored {
        result_access: ObservationProtocolResultAccess,
        surface: ObservationStoredCommandSurface<T>,
    },
    /// 当前调用没有可验证stored surface可返回；按shape不可能携带refs/body。
    Ephemeral {
        command_name: ObservationCommandName,
        outcome: ObservationCommandOutcome,
        error: ObservationProtocolErrorSurface,
    },
}
```

`ObservationStoredCommandSurface`是Step06 `StoredObservationReplaySurface.serialized_surface`对Command的exact typed decode target。其`result_ref`直接使用`StoredObservationResult.public_result_ref: BodyFreeRef`，不新增`ObservationProtocolResultRef` wrapper；它不是application `StoredObservationResultRef`、repository locator、evidence alias或outbox ref。`result_access`明确不进入stored bytes或stored digest：fresh与replay只更换外层wrapper，inner surface必须byte-for-byte相同。`outbox_refs`在stable surface factory内按canonical typed bytes排序并拒绝duplicate；不得定义未经owner审查的临时`OutboxRecordRefSet`。

| outcome | response branch / access | `result_ref` | `result` | refs / error | application来源 |
|---|---|---|---|---|---|
| `Accepted` fresh | `Stored/FreshlyCommitted` | required | required | exact stored refs；error None | compatible `Accepted` disposition |
| original stored outcome replay | `Stored/Replayed` | original required | original operation-specific value/presence | original refs/error逐字段回放；没有新outbox | validated immutable surface；outcome仍映射原stored disposition |
| `Rejected` pre-UoW | `Ephemeral` | structurally absent | structurally absent | refs structurally absent；error required | typed protocol/application mapping；不得造stored rejection |
| `Rejected` durable | `Stored/FreshlyCommitted` | required | operation-specific optional result | 只允许stored safe refs；error required | compatible `CommandRejection + Rejected` disposition |
| `Conflict` | `Ephemeral` | structurally absent | structurally absent | refs structurally absent；typed conflict error | reserve/CAS conflict；old result不作为本次result返回 |
| `Delayed` known no-write | `Ephemeral` | structurally absent | structurally absent | refs structurally absent；dependency/in-flight error | dependency/in-flight在mutation前已确定零写入 |
| `Delayed` indeterminate | `Ephemeral` | structurally absent | structurally absent | `CommitOutcomeUnknown`且`retryable=false` | 只表示当前调用无法安全返回stored surface；不声称零写入，必须先probe |
| `Quarantined` | `Stored/FreshlyCommitted` | required | 按具体DTO决定 | 仅已提交body-free quarantine/gap/result refs；error required | compatible durable `Quarantined` disposition；未提交时只能Rejected或entry failure |
| `NoOp` | `Stored/FreshlyCommitted` | required | 具体DTO定义的exact presence | no changed/outbox；error None | compatible durable `NoOp` disposition |
| `Blocked` | durable=`Stored/FreshlyCommitted`；pre-UoW=`Ephemeral` | branch决定 | stored时按具体DTO决定 | durable safe refs或ephemeral required guard error | formal stored `Blocked`或pre-UoW guard |

`ObservationStoredCommandSurface::try_new(...)`校验stable presence matrix、`command_name`与具体result type binding、所有集合canonicality和error/outcome compatibility；它只接受可映射到`OperationResultDisposition::{Accepted,Rejected,Quarantined,NoOp,Blocked}`的outcome，`Conflict/Delayed`只能进入`Ephemeral`。`try_ephemeral`只接受`Rejected/Conflict/Delayed/Blocked`，明确拒绝`Accepted/Quarantined/NoOp`；尤其不能在quarantine fact/result未提交时返回`Quarantined`。`ObservationCommandResponse::{try_stored,try_ephemeral}`再校验branch允许的outcome。application response assembler另行验证`ObservationCommandResult`的stored kind/access/disposition；`Replayed`必须先exact decode原surface，再把原disposition映射回原outcome并仅包装`Replayed`，不能重新编码inner surface。contracts factory不导入application。不存在generic `success: bool`、generic duplicate终态、默认空result或从domain object current state临时重建response。

### 6.6 Public error projection

```rust
/// 对外稳定、低基数的协议错误分类。
pub enum ObservationProtocolErrorCode {
    MissingRequiredField,
    InvalidReference,
    ActorNotAllowed,
    BodyFreeBoundaryViolation,
    IdempotencyConflict,
    NotVisible,
    StaleProjection,
    DependencyUnavailable,
    UnsupportedSchemaVersion,
    NoWriteGuardViolation,
    InvalidRequest,
    TargetNotFound,
    InvalidStateTransition,
    PolicyRejected,
    VersionConflict,
    ConsistencyFailure,
    CommitOutcomeUnknown,
    ExternalDeliveryFailure,
}

/// 当前协议调用发生错误的有限定位面。
pub struct ObservationProtocolSurfaceRef {
    /// 发生错误的有限family/name组合。
    pub operation: ObservationProtocolOperation,
    /// 错误所属schema version；header无法解析时由expected entry slot提供。
    pub schema_version: SchemaVersion,
}

/// 可安全返回给调用方或异步完成面的错误投影。
pub struct ObservationProtocolErrorSurface {
    /// route/topic/handler-neutral的有限协议定位。
    pub surface_ref: ObservationProtocolSurfaceRef,
    /// 由typed mapper选择的稳定错误code。
    pub code: ObservationProtocolErrorCode,
    /// 已存在的body-free原因引用；不得临时mint为evidence。
    pub reason_ref: Option<BodyFreeRef>,
    /// 已提交gap存在时保留其identity；不得为错误伪造gap。
    pub gap_ref: Option<GapStateRef>,
    /// 由Step 12 recovery class total map派生；不是caller重试许可。
    pub retryable: bool,
}
```

`ObservationProtocolSurfaceRef`不mint identity，也不实现任意字符串parse；`new(operation, schema_version)`只接受supported schema和finite operation。`ObservationProtocolErrorSurface::try_new(...)`校验code/reason/gap/retryable矩阵；`ProtocolError`、`DomainError`、`ApplicationError`、`ApiError`、`WorkerError`和provider exception均不得作为字段或通过`Debug/Display`文本泄漏。

| source layer | public mapping owner | 关键映射 | 缺失行为 |
|---|---|---|---|
| contracts `ProtocolError` | family-specific entry decoder | malformed/empty/wrong owner -> invalid request/reference；unsupported schema保留专用code | header缺失仍使用expected static slot；不解析payload补值 |
| domain typed rejection | application response assembler | actor/policy/state/no-write映射有限code | 无formal reason ref时`reason_ref=None`，不得造字符串或ref |
| `ApplicationError` | Step 12 total mapper | conflict/dependency/version/consistency/commit/external分类 | 未有total mapping时返回entry failure并暂停对应协议，不fallback generic internal |
| Query state surface | Query response assembler | normal missing/not-visible/stale/rebuilding/disabled优先进入Query surface | 不把所有状态提升为error |
| Consumer pre-handler | worker exact mapper | unsupported/rejected/delayed outcome + optional error | 不伪造stored result或transport action |
| Job pre-report failure | jobs exact mapper | 直接返回protocol/entry failure | 不构造假的Job response/report/result ref |

`retryable`必须由Step 12的八类`ObservationRecoveryClass`做total mapping，且只有`RetryAfterReload`、`RetryAfterDependencyRecovery`、`RetryFinalizeOnly`为`true`；`DoNotRetrySameInput`、`RetryAfterInputChange`、`RetryAfterStateChange`、`ProbeBeforeRetry`、`ManualIntervention`全部为`false`。该bool只表示未来另一次尝试在满足前置条件后可能合法，不授权立即循环、跳过reload/probe或重做已完成external effect。具体HTTP/RPC/event completion code、broker action和schedule exit binding不在本类型中，由entry/Step 14持有。

### 6.7 Query shared request and result carrier

```rust
/// 一个具体Query的公开请求wrapper。
pub struct ObservationQueryRequest<T: ObservationQueryBody> {
    /// 必须等于`T::QUERY`的有限逻辑名。
    pub query_name: ObservationQueryName,
    /// actor、visibility、consistency、trace和可信请求时点。
    pub metadata: ObservationQueryMetadata,
    /// 具体Query request DTO；是否分页由该DTO显式决定。
    pub body: T,
}

/// Query结果中目标存在性的公开分类。
pub enum ObservationQueryPresence {
    /// 具名目标或非空集合存在，body按visibility规则返回。
    Present,
    /// 精确具名目标在本地committed read boundary内不存在。
    Missing,
    /// 集合查询成功完成但当前页没有item。
    Empty,
    /// 目标是否存在不能在当前安全边界内建立。
    Unknown,
}

/// Query读取依赖对本次surface的可用性投影。
pub enum ObservationAvailabilitySurface {
    Available,
    Degraded { adapter_family: AdapterFamily },
    Unavailable { adapter_family: AdapterFamily },
    Disabled { adapter_family: AdapterFamily },
    Failed { adapter_family: AdapterFamily },
}

/// 目标缺失的有限、安全说明；不含repository key或原始错误。
pub enum ObservationMissingSurface {
    NotFound,
    NotYetProjected,
    OutsideRetainedObservationWindow,
    SourceReferenceUnavailable,
}

/// 一个具体Query的非分页公开响应。
pub struct ObservationQueryResponse<T: ObservationQueryViewBody> {
    pub query_name: ObservationQueryName,
    pub presence: ObservationQueryPresence,
    pub view: Option<T>,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
    pub degraded: Option<DegradedSurface>,
    pub availability: ObservationAvailabilitySurface,
    pub missing: Option<ObservationMissingSurface>,
    pub rebuild: Option<ObservationRebuildSurface>,
    pub error: Option<ObservationProtocolErrorSurface>,
}
```

`ObservationAvailabilitySurface`的owner是`contracts::surfaces`。`Available`只能来自所需read owner均可用且返回的committed material通过一致性校验；`Degraded`表示已由policy允许返回有限旧值/局部值，不能作为默认成功；`Unavailable/Disabled/Failed`保留精确`AdapterFamily`但不包含adapter实例、endpoint、credential、provider code或message。多个依赖失败时，S08-D具体Query必须给出有限优先级或具名composite view，不得由shared carrier任意选第一个错误。

`ObservationMissingSurface`同样归`contracts::surfaces`。`NotFound`只表示本地owned target不存在；`NotYetProjected`要求source anchor或projection reservation存在但目标view尚未形成；`OutsideRetainedObservationWindow`要求current retention marker明确证明查询位置不再可读；`SourceReferenceUnavailable`要求reference state明确不可解析。它不表示NotVisible，不得由repository exception、空page、resolver timeout或HTTP status反推。

| presence | `view` | `missing` | visibility / availability | error | exact meaning |
|---|---|---|---|---|---|
| `Present` | `Some` | `None` | body必须被visibility允许；availability为Available或policy允许的Degraded | 通常None | committed view存在；不证明source truth完整 |
| `Missing` | `None` | `Some` | visibility不得为NotVisible的伪装；availability不得为Failed fallback | None | 精确单体目标缺失且原因已分类 |
| `Empty` | collection response中使用；非分页single response禁止 | `None` | 已完成一次可见的bounded read | None | 空集合/空页，不等于missing |
| `Unknown` | 仅policy允许的limited degraded body可Some，否则None | `None` | freshness/availability/degraded必须说明未知来源 | optional typed error only for true protocol/application failure | 不把不确定性压成empty或missing |

`ObservationQueryResponse::try_new(...)`必须验证上述presence matrix、`query_name`与具体view binding、visibility/body、freshness/rebuild、availability/degraded和missing的交叉关系。application exact response assembler只能从`ObservationQueryResult<T>`逐字段复制或把domain view转换成同一contracts type；不得在entry层读取repository补字段。Query没有stored result、idempotency outcome、changed/outbox refs或durable read receipt。

### 6.8 Public pagination and repository-page mapping

```rust
/// Caller可原样回传、但不可解释或构造内部位置的public cursor。
pub struct ObservationPageCursor(String);

/// Public分页limit，P0允许`1..=200`。
pub struct ObservationPageLimit(u16);

/// 由具体Query request DTO嵌入的public分页请求。
pub struct ObservationPageRequest {
    pub cursor: Option<ObservationPageCursor>,
    pub limit: ObservationPageLimit,
}

/// 一次public page的连续性说明。
pub struct ObservationPageInfo {
    pub returned_count: u16,
    pub next_cursor: Option<ObservationPageCursor>,
    pub has_more: bool,
}

/// Query专属view item与同一binding continuation。
pub struct ObservationPublicPage<T: ObservationQueryViewBody> {
    pub items: Vec<T>,
    pub page_info: ObservationPageInfo,
}

/// 分页Query的完整公开响应。
pub struct ObservationPagedQueryResponse<T: ObservationQueryViewBody> {
    pub query_name: ObservationQueryName,
    pub presence: ObservationQueryPresence,
    pub page: ObservationPublicPage<T>,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
    pub degraded: Option<DegradedSurface>,
    pub availability: ObservationAvailabilitySurface,
    pub rebuild: Option<ObservationRebuildSurface>,
    pub error: Option<ObservationProtocolErrorSurface>,
}
```

`ObservationPageCursor::parse`只做canonical unpadded base64url与完整opaque token ASCII byte length `1..=4096`的语法/边界校验，不trim、不case-fold、不向caller解释内容；custom `Debug`只显示redacted长度。`4096`约束的是Step 07 binary envelope编码后的完整public token，内部repository position仍由`ObservationRepositoryCursor::try_rehydrate(expected_binding)`限制为nonempty且最多`1024` bytes；public factory不得把两层上限混同。该factory不声称token来自可信application codec，method/selector/order authority必须在application rehydrate中建立。`ObservationPageLimit::try_new`只接受`1..=200`；没有`0=default`、negative、unbounded或entry自选limit。未来调整任一上限必须经过Step 07/08/11/13和配置影响审查，不能由adapter悄然改变。

`ObservationPageInfo::try_new(returned_count, next_cursor, requested_limit)`要求`returned_count <= requested_limit <= 200`、`has_more == next_cursor.is_some()`，并拒绝`returned_count == 0 && next_cursor.is_some()`；empty page必须是`next_cursor=None, has_more=false`。不得靠`items.len()==limit`猜`has_more`，也不得在application assembler或entry层自动扫描后续页来掩盖adapter返回的非法empty continuation。`ObservationPublicPage::try_new`校验items数量与page info；exact Query response assembler另行证明items已按该Query的固定order canonical排列并拒绝重复identity。Generic contracts factory不读取item identity或重做repository ordering；超过limit、foreign cursor、empty continuation或无法证明确定顺序均不产生public page。

Public到application的精确转换顺序固定为：

1. exact Query assembler先校验`query_name == T::QUERY`、typed selector、visibility scope与limit；
2. assembler调用该repository method唯一的`ObservationRepositoryCursorBinding::for_*` factory；
3. assembler消费`ObservationPageCursor`并只取其validated opaque `String`，转换public limit为application `PositiveLimit`，再调用`ObservationRepositoryPage::try_new(opaque_cursor, limit, exact_binding)`；application codec验证method、selector fingerprint和order revision；
4. repository返回`ObservationRepositoryPageResult<U>`，application在同一validated result内取得items与next cursor，不接受adapter提供public page/info；
5. exact response assembler逐item做view/visibility/redaction映射，再把application cursor的`opaque_token()`封装为新的`ObservationPageCursor`；
6. 任一binding、cursor framing、item ordering、count或view assembly失败均不返回partial page，也不把cursor error改成empty。

| public/application pair | allowed mapping | prohibited leakage |
|---|---|---|
| `ObservationPageRequest` -> `ObservationRepositoryPage` | exact selector binding + bounded limit + optional opaque token | `ObservationRepositoryPageMethod`、selector fingerprint、order revision、repository position |
| `ObservationRepositoryPageResult<U>` -> `ObservationPublicPage<T>` | canonical item map + same-binding opaque continuation | `Versioned<T>` row version、application cursor object、adapter page object |
| empty repository page | 仅接受`presence=Empty`, `items=[]`, `next_cursor=None`, `has_more=false` | `missing=NotFound`、保留/伪造continuation、auto-scan next page |
| inaccessible body | body/item list empty only under explicit visibility surface | leaking item count/identity to infer hidden target |
| stale/degraded page | preserve persisted freshness/degraded/availability across the whole consistent page | mixing items from fresh retry or rebuild-on-read |

Paged response不携带`ObservationMissingSurface`：空集合由`presence=Empty`表达；若整个selector target本身可被精确定义为缺失，S08-D必须使用具名单体response或在具体view中定义target surface，不能让shared page同时表示“目标缺失”和“集合为空”。`ObservationPagedQueryResponse::try_new`还要求`Present`对应非空items，`Empty`对应空items，`Missing`禁止，`Unknown`只允许符合policy的limited degraded page。

### 6.9 Inbound Consumer envelope and receipt

`SourceEventRef` 是本节 envelope、stored receipt 与 application-private inbound identity 共同依赖的 public secondary identity。Current Step 06 多处把它当作“既有 contracts owner”使用，却没有给出可落码声明卡；S08-B 在既定 `contracts::refs` 中补齐唯一 canonical declaration：

```rust
/// Body-free identity of one event supplied by an authenticated upstream producer.
#[repr(transparent)]
pub struct SourceEventRef(BodyFreeRef);
```

| contract item | exact rule |
|---|---|
| owner | `observability-contracts::refs::SourceEventRef`；不得在 `application`、`worker`、具体 Consumer payload 或上游项目中复制声明或创建 type alias |
| construction | `pub fn new(value: BodyFreeRef) -> Self` 只包装已通过 `BodyFreeRef::parse` 的值；`as_body_free_ref` / `into_body_free_ref` 只提供 typed borrow / move，不暴露 raw string shortcut |
| authority source | 新值不由本仓 ID generator mint；只有 static Consumer slot 已匹配、producer registration 已认证且 source-event header 已按 `BodyFreeRef` 校验后，exact worker decoder 才可构造并交给 assembler；stored receipt decoder只可逐值 rehydrate 原值 |
| wire / digest | 在具名 source-event 字段中编码为 canonical opaque string；canonical material必须包含 `source_event_ref` wrapper discriminator和inner bytes，不能只折叠裸值 |
| redaction | custom `Debug` 只输出类型名与 redacted token；不实现 `Display`，不得进入 log message、metric label、trace attribute、error detail或report attachment的明文值 |
| non-interchangeability | 不提供到/从 `IdempotencyKey`、`TraceCorrelationRef`、application-local `InboundEventRef`、`OutboundEventRef`、delivery attempt、offset/cursor、locator或任一业务对象 ref 的 `From` / alias / parse fallback |

Wrapper 本身只证明“这是一个语法有效的 source-event identity”，不证明 producer 已认证；authority 必须来自上述 exact decoder path。`dedup_key`、`trace_ref` 和 `source_event_ref` 即使底层 token 恰好相同也保持三个独立角色，不得互相 fallback。Step 06 旧“已有 contracts owner”口径登记为 `S08-SOURCE-EVENT-REF-OWNER-01`，后续 affected 修订只回指本声明并删除模糊 owner claim，不得再定义第二个 wrapper。

```rust
/// 由可信header与一个具体payload组成的Inbound Consumer envelope。
pub struct ObservationInboundEventEnvelope<T: ObservationInboundPayload> {
    /// 必须等于`T::CONSUMER`的有限consumer名。
    pub consumer_name: ObservationInboundConsumerName,
    /// 上游事件的body-free稳定identity；不是delivery attempt或offset。
    pub source_event_ref: SourceEventRef,
    /// 上游业务/技术source的结构化安全引用。
    pub source_ref: ObservationSourceRef,
    /// 可选producer version；缺失时不得从时间、offset或cursor合成。
    pub source_version_ref: Option<ObservationSourceVersionRef>,
    /// 必须等于`T::PRODUCER`且与authenticated registration一致。
    pub producer_family: ObservationProducerFamily,
    /// 用于选择exact payload decoder的协议schema。
    pub schema_version: SchemaVersion,
    /// Consumer逻辑幂等键；不能由delivery attempt生成。
    pub dedup_key: IdempotencyKey,
    /// producer声明并由adapter规范化的事件发生时间；不提供source ordering。
    pub occurred_at: ObservedAt,
    /// 可选body-free correlation；不授权producer或actor。
    pub trace_ref: Option<TraceCorrelationRef>,
    /// 不得重复header authority字段的具体body-free payload。
    pub payload: T,
}

/// 一次Inbound Consumer公开处理结果；不是transport action或durable lifecycle。
pub enum ObservationConsumerOutcome {
    Accepted,
    Delayed,
    Rejected,
    Quarantined,
    DeadLettered,
    UnsupportedSchema,
    NoOp,
}

/// 可被exact encoder持久化并逐字节回放的Consumer receipt surface。
pub struct ObservationStoredConsumerReceipt {
    pub consumer_name: ObservationInboundConsumerName,
    pub source_event_ref: SourceEventRef,
    /// 首次已保存的processing outcome；replay时保持不变。
    pub outcome: ObservationConsumerOutcome,
    pub result_ref: BodyFreeRef,
    pub changed_refs: BodyFreeRefSet,
    pub outbox_refs: Vec<OutboxRecordRef>,
    pub gap_refs: GapStateRefSet,
    pub dead_letter_ref: Option<DeadLetterRef>,
    pub error: Option<ObservationProtocolErrorSurface>,
}

/// 当前Consumer delivery的调用级公开完成surface。
pub enum ObservationConsumerReceipt {
    /// Fresh commit或duplicate replay包装同一immutable stored receipt。
    Stored {
        result_access: ObservationProtocolResultAccess,
        surface: ObservationStoredConsumerReceipt,
    },
    /// 未形成stored receipt的pre-handler结果；按shape不可能携带refs。
    Ephemeral {
        consumer_name: ObservationInboundConsumerName,
        /// Header已验证时保留；missing/malformed source-event header时为None。
        source_event_ref: Option<SourceEventRef>,
        outcome: ObservationConsumerOutcome,
        error: ObservationProtocolErrorSurface,
    },
}
```

Envelope header先于payload解析，顺序固定为：选择expected static consumer slot；解析producer/source-event/source/schema/dedup/trace/time header；校验registration的producer与supported schema；再调用exact `T` decoder。`consumer_name != T::CONSUMER`、`producer_family != T::PRODUCER`、registration不匹配、source/version relation不匹配或unknown schema均不得尝试另一payload variant。

`ObservationInboundEventEnvelope::try_new`还要求`source_version_ref`出现时，其producer和source与envelope逐字段相等。`ObservationInboundEventIdentity`不进入public envelope：matching assembler从`consumer_name + authenticated producer_family + source_event_ref`构造application-private identity。effective `ActorSafeRef`来自authenticated worker binding，与envelope一并传给assembler；payload/header自报actor、tenant、credential或role均不生效。

| outcome / invocation | response branch / access | result ref | changed/outbox/gap refs | dead-letter / error | exact source |
|---|---|---|---|---|---|
| `Accepted` fresh | `Stored/FreshlyCommitted` | required | exact stored receipt surface；允许operation-specific非空 | dead-letter None；error None | fresh committed local Consumer result |
| original stored outcome replay | `Stored/Replayed` | original required | original stored surface；本次不新增任何ref | exact original dead-letter/error surface | compatible reservation replay；inner outcome保留原值 |
| `Delayed` pre-UoW | `Ephemeral` | structurally absent | structurally absent | source event Some；typed dependency/in-flight error | validated header之后的resolver/dependency/in-flight branch |
| `Rejected` pre-handler | `Ephemeral` | structurally absent | structurally absent | malformed/missing source event时None，否则Some；error required | validly classified envelope/request/policy rejection |
| `Rejected` durable | `Stored/FreshlyCommitted` | required | changed refs empty；gap可按stored surface存在 | dead-letter None；error Some | formal committed rejection receipt |
| `Quarantined` | `Stored/FreshlyCommitted` | required | 仅已提交body-free safety/gap/outbox marker relation | dead-letter None；error required | compatible durable `Quarantined` disposition；raw payload永不进入receipt |
| `DeadLettered` | `Stored/FreshlyCommitted` | required | no normal-path changed/outbox refs；gap按stored surface | dead-letter Some；error Some | local dead-letter fact已提交 |
| `UnsupportedSchema` | `Ephemeral` | structurally absent | structurally absent | source event必须已从safe header建立；`UnsupportedSchemaVersion` | exact header gate；payload未解析、未reserve |
| `NoOp` | `Stored/FreshlyCommitted` | required | all empty | dead-letter/error None | committed durable no-change receipt |

`ObservationStoredConsumerReceipt::try_new(...)`必须校验stable outcome矩阵、consumer/source/error surface一致性、canonical collection和dead-letter co-presence；它只接受可映射到current stored disposition的`Accepted/Rejected/Quarantined/DeadLettered/NoOp`，其中`DeadLettered`还须由stored rejected/blocked disposition与dead-letter ref共同证明。`ObservationConsumerReceipt::try_ephemeral(...)`只接受`Delayed/Rejected/UnsupportedSchema`，明确拒绝`Accepted/Quarantined/DeadLettered/NoOp`；`source_event_ref=None`又只允许missing/malformed source-event header导致的`Rejected`，其他ephemeral分支必须为Some。该类型是Step06 stored replay bytes的exact typed decode target。`ObservationConsumerReceipt::{try_stored,try_ephemeral}`再校验branch允许的outcome。`Replayed`只作为outer overlay，inner receipt必须byte-for-byte保留原stored `outcome`、refs和safe error；本次delivery的duplicate事实由access表达，不新增`Duplicate` outcome，也不重跑handler。`result_ref`继续复用stored result的`public_result_ref`，不得暴露`StoredObservationResultRef`。`outbox_refs`属于exact stored receipt surface；Step 06 `ObservationConsumerResult`当前struct未显式携带该字段但文字允许stored receipt outbox，因此登记`S08-CONSUMER-OUTBOX-SURFACE-01`，由application response assembler从validated stored surface lossless映射，禁止查询current outbox补值。

Current Step 06仅一次引用但未给出canonical owner/mint的`QuarantineRef`，因此public receipt不暴露该类型，也不新增替代wrapper。`Quarantined`通过已提交的`result_ref`、typed outcome、gap/changed/outbox refs和safe error表达；内部悬空use登记为`S08-CONSUMER-QUARANTINE-REF-01`，后续affected修订必须删除该字段或回指一个已有owner，不能由Step 08临时mint。

`InboundConsumerCompletion::{Acknowledge, Retry, DeadLetter}(ObservationConsumerReceipt)`保持Step 06 C-05唯一process-local transport action carrier。Receipt factory不选择action；worker exact mapper依据逐consumer flow和Step 12 recovery classification选择一种variant，registrar只执行，不可重分类。S08-B只固定任何validated `Replayed` receipt均不得重跑且应ack当前重复delivery、fresh `Accepted`必须commit后ack、fresh `DeadLettered`要求local marker先提交；其余fresh `Delayed/Rejected/UnsupportedSchema/Quarantined/NoOp`的total action矩阵留S08-E逐协议闭合。若commit outcome尚不确定，worker必须先probe；但current C-05只有三个terminal transport actions且handler不能返回typed pending/failure，probe后仍indeterminate时没有合法completion shape。该内部接缝登记为`S08-CONSUMER-INDETERMINATE-COMPLETION-01`，在Step06/07 affected repair与S08-E关闭前禁止把`Retry`当默认占位。

### 6.10 Outbound Event envelope and immutable snapshot

```rust
/// 由一个accepted observation-side change形成的body-free outbound envelope。
pub struct ObservationOutboundEventEnvelope<T: ObservationOutboundPayload> {
    /// application在accepted UoW内mint的稳定event identity。
    pub event_ref: OutboundEventRef,
    /// 必须等于`T::EVENT`的有限事件名。
    pub event_name: ObservationOutboundEventName,
    /// exact retained event schema。
    pub schema_version: SchemaVersion,
    /// committed local subject的body-free identity。
    pub subject_ref: BodyFreeRef,
    /// accepted UoW分配的tagged committed cursor。
    pub committed_cursor: ObservationCommittedCursor,
    /// 可选accepted operation correlation。
    pub trace_ref: Option<TraceCorrelationRef>,
    /// 与outbox record committed time相同的本地可信时点。
    pub committed_at: ObservedAt,
    /// 事件专属、sealed、body-free payload。
    pub payload: T,
}

/// Pure protocol snapshot；不是publication marker或external delivery truth。
pub struct ObservationOutboundEventPayloadSnapshot {
    payload_snapshot_ref: OutboxPayloadSnapshotRef,
    event_ref: OutboundEventRef,
    event_name: ObservationOutboundEventName,
    subject_ref: BodyFreeRef,
    schema_version: SchemaVersion,
    canonical_envelope: Vec<u8>,
    payload_digest: DigestSummary,
    committed_cursor: ObservationCommittedCursor,
    trace_ref: Option<TraceCorrelationRef>,
    committed_at: ObservedAt,
}
```

`ObservationOutboundEventEnvelope::try_new(...)`只接受静态event/payload匹配、supported schema、nonempty typed identities和已分配committed cursor。`subject_ref`必须由S08-F逐事件登记的committed source change提供，不能从payload首个ref、event name或current repository lookup猜测。Envelope没有outbox ref、binding、topic、partition、credential、attempt、claim/fence、publication state或external receipt。

`ObservationOutboundEventPayloadSnapshot`位于`contracts::events`，字段private且不作为第二条wire message发布。唯一current materialization owner是application的cursor-bound follower：

```rust
pub(crate) fn encode_observation_outbound_snapshot<T: ObservationOutboundPayload>(
    canonicalizer: &ObservationDigestCanonicalizer,
    payload_snapshot_ref: OutboxPayloadSnapshotRef,
    envelope: ObservationOutboundEventEnvelope<T>,
) -> Result<ObservationOutboundEventPayloadSnapshot, ApplicationError>;
```

该pure函数先使用既定`contracts::events::observation_outbound_envelope_v1` sealed encoder按有限字段顺序编码完整envelope，再由唯一`application::digest` canonicalizer以`outbox_payload_snapshot` material kind计算`DigestSummary`，最后调用snapshot的validated constructor。contracts event encoder拥有wire field order和sealed payload serialization；application canonicalizer唯一拥有digest framing/profile/SHA-256。不得为此新增Step 04未规划的`contracts::encoding`模块或`encoding.rs`。两者都无repository、config、clock、resolver、publisher或current truth access。

Snapshot constructor验证encoded byte length `1..=262_144`、event/name/schema/subject/cursor/trace/time与envelope完全相等，并只保存exact bytes；它不自行hash，也不接受任意serializer/debug output。custom `Debug`不得显示bytes或payload。`canonical_envelope`只供application映射为`BodyFreeSerializedEvent`、retained decoder和publisher adapter；不得成为log field、metric label、evidence body或report attachment。

| protocol snapshot field | application `ObservationOutboxPayloadSnapshot` field | mapping rule |
|---|---|---|
| `payload_snapshot_ref` | same | exact typed identity；one snapshot per outbox marker |
| `event_ref/event_name` | same | exact equality；publisher不从bytes猜event |
| `subject_ref` | same | committed body-free subject；不重读current truth |
| `schema_version` | same | retained exact version；不in-place upgrade |
| `canonical_envelope` | `BodyFreeSerializedEvent` | byte-for-byte bounded wrap；不得重新serialize |
| `payload_digest` | same | canonicalizer重新验证后copy，不生成第二摘要 |
| `committed_cursor` | same | tagged namespace/value完全相等 |
| `trace_ref/committed_at` | `trace_ref/stored_at` | exact copy；record committed time也必须相等 |
| absent from protocol snapshot | `effect_binding_ref` | only application seed supplies frozen binding；明确排除event bytes |

`ObservationOutboxFollowerSeed::materialize`必须先获得assigned cursor，再构造typed envelope/snapshot、application snapshot和Pending record pair，最后在owner mutation的同一UoW append。Publisher只取得stored pair和stable token；snapshot缺失、digest/framing不一致、event/body type mismatch或retained binding不可解析均fail closed，绝不读取current truth重建。S08-F仍需逐事件证明12个payload implementation、source change、subject、schema和subscriber boundary；本节不把E01~E12标为完成。

### 6.11 Operations Job request, report and response

```rust
/// 一个具体Operations Job的公开调用wrapper。
pub struct ObservationJobRequest<T: ObservationJobInputBody> {
    /// 必须等于`T::JOB`的有限public Job名。
    pub job_name: ObservationJobName,
    /// correlation、actor、trace、idempotency和可信请求时点。
    pub metadata: ObservationJobMetadata,
    /// Job专属input DTO；不得包含schedule locator或execution identity。
    pub body: T,
}

/// 一次public Job调用结果；不是durable report state。
pub enum ObservationJobOutcome {
    Completed,
    PartiallyCompleted,
    FailedRetryable,
    FailedPermanent,
    Blocked,
}

/// 从application complete item fold派生的public计数投影。
pub struct ObservationJobReportCounts {
    pub planned: u32,
    pub terminal: u32,
    pub pending: u32,
    pub succeeded: u32,
    pub skipped: u32,
    pub retryable_failed: u32,
    pub permanent_failed: u32,
    pub blocked: u32,
}

/// 可持久化、可重放且不泄漏local execution authority的public report surface。
pub struct ObservationJobReportSurface {
    /// 复用StoredObservationResult.public_result_ref；不是local JobReportRef。
    pub report_ref: BodyFreeRef,
    pub job_name: ObservationJobName,
    /// 首次accepted invocation的public correlation；duplicate不得覆盖。
    pub job_run_id: JobRunId,
    /// 原terminal report state的public投影；replay时保持不变。
    pub outcome: ObservationJobOutcome,
    /// 从完整application item fold派生的计数。
    pub counts: ObservationJobReportCounts,
    pub affected_refs: BodyFreeRefSet,
    pub failed_refs: BodyFreeRefSet,
    pub gap_refs: GapStateRefSet,
    pub progress_refs: BodyFreeRefSet,
    /// 复制application plan/fold/state report digest；不是public字段摘要或evidence digest。
    pub report_digest: DigestSummary,
    /// report-level failure/block时的安全公开投影。
    pub error: Option<ObservationProtocolErrorSurface>,
}

/// 可被exact encoder持久化并逐字节回放的terminal Job surface。
pub struct ObservationStoredJobSurface<T: ObservationJobOutputBody> {
    /// Job专属body-free output；blocked/failure时可按逐Job矩阵为空。
    pub output: Option<T>,
    /// 唯一持有name/correlation/public identity/outcome/error的terminal report。
    pub report: ObservationJobReportSurface,
}

/// 一个具体Job的调用级terminal公开response。
pub struct ObservationJobResponse<T: ObservationJobOutputBody> {
    /// 当前调用提交还是回放inner stored surface。
    pub result_access: ObservationProtocolResultAccess,
    /// 与stored bytes一致的完整terminal surface。
    pub surface: ObservationStoredJobSurface<T>,
}
```

`ObservationJobRequest::try_new`校验`job_name == T::JOB`、`JobRunId`格式、actor/key/time presence和具体input invariants。`JobRunId`接受`1..=256` ASCII `[A-Za-z0-9][A-Za-z0-9._:-]*`，禁止slash、whitespace、control和locator；只允许redacted debug。它不进入request digest/idempotency logical key，不转换为`BodyFreeRef`、`ObservationJobExecutionRef`、plan/report/claim ref或真实runtime run identity。

`ObservationJobReportCounts::try_new`要求所有计数均来自同一`JobReportItemFold`，并验证：`terminal + pending = planned`；`succeeded + skipped + retryable_failed + permanent_failed + blocked = terminal`；所有加法用checked arithmetic。计数不能替代pending work-key集合的application durable truth，也不能单独证明report complete。Public report故意不暴露`ObservationJobWorkKey`，因为其variant含application coordination target；recover/resume由application按原report/plan处理，不由public response提交work key。

| public outcome | application `JobReportState` | access | count and output rule | error rule |
|---|---|---|---|---|
| `Completed` | `Completed` | fresh或replayed | pending/failure/blocked均0；output按具体Job required/optional | report error None |
| `PartiallyCompleted` | `PartiallyCompleted` | fresh或replayed | pending=0且至少一个failure/blocked；output按具体Job部分结果矩阵 | report可含同source safe error |
| `FailedRetryable` | `FailedRetryable` | fresh或replayed | pending可非0；不得把pending计入失败；output通常None或明确partial | required typed retryable report error |
| `FailedPermanent` | `FailedPermanent` | fresh或replayed | pending可非0；保留已分类refs/counts | required non-retryable report error |
| `Blocked` | `Blocked` | fresh或replayed | pending可非0；仅明确blocked item计入blocked | required guard/no-write/policy error |

`ObservationJobReportSurface::try_from_application(stored_result, report, summary, public_error)`是application exact response assembler拥有的mapping。它要求stored kind=`JobReport`、operation/job name、`report_ref == stored_result.public_result_ref`、request/report digest、terminal state、public outcome和complete fold summary逐项相容；从`JobReportFoldSummary`复制counts/affected/failed/gap/progress refs，并原样复制已按`job_report` material kind验证的application `report_digest`。该digest覆盖plan ref/digest、terminal state、完整semantic fold、scope rows与report failure，明确排除自身、report/execution identity、`job_run_id`、claim/fence、derived counts/ref sets与invocation access；Step08不得按public DTO字段另算第二摘要。Assembler不得读取current plan/items/repositories补齐summary，也不得把`JobReportRef`、`ObservationJobExecutionRef`、`ObservationJobExecutionPlanRef`、`IdempotencyRef`、claim/fence/row version、config snapshot、external token或provider detail投影出去。`ObservationJobReportSurface`是public job name、首次correlation、public result/report identity、terminal outcome和safe error的唯一inner owner；`ObservationStoredJobSurface`只在其外增加operation-specific output，禁止重复同义字段。二者合成Step06 stored replay bytes的exact typed decode target；`result_access`不进入inner bytes/digest。

Application当前使用的local `JobReportRef`没有在current Step 06产物中找到独立声明卡，登记`S08-JOB-REPORT-REF-OWNER-01`。这不阻塞public carrier，因为`StoredObservationResult.public_result_ref`已提供公开report identity；但后续Step 06 affected修订/正式重装配必须给local ref唯一owner/mint/rehydrate card，不能让public `BodyFreeRef`反向充当repository PK。

`ObservationStoredJobSurface::try_new(output, report)`校验`report.job_name == T::JOB`以及该Job的outcome/output、counts、refs和error全矩阵；没有top-level name/run/ref/outcome/error副本可发生漂移。`ObservationJobResponse::try_new(access,surface)`只接受已验证inner surface。合法Job body在application创建local execution/plan/report后失败，只有在terminal report与stored result已安全提交时才可返回Job response；在report形成前的invalid input、missing dependency、reservation conflict/in-flight、commit unknown或consistency failure直接返回protocol/entry error，不构造假的result/report。Duplicate先验证并exact decode原stored surface，再只以`result_access=Replayed`包装report中的原`job_run_id`、原terminal outcome与原safe error，incoming不同correlation不得覆盖，也不得重新编码inner surface；不能用generic `DuplicateReplayed`遮蔽原report state。

J08 public name `PrepareExternalAuditExport`在request/body trait中仍属于`ObservationJobName`，exact assembler静态映射到internal `ObservationJobOperation::PrepareExternalAuditExportDelivery`和`PrepareExternalAuditExportDeliveryInput`；Command同名类型不实现Job trait。该typed collision机制在S08-B结构层已闭合，但需S08-G逐Job totality审计后才关闭`S08-EXPORT-NAME-COLLISION-01`。

### 6.12 Shared owner, factory and absence registry

| shared type | canonical owner | constructor / mapping owner | absence / invalid behavior |
|---|---|---|---|
| protocol family/name/operation | `contracts::metadata` | exhaustive static match in contracts | unknown/mismatch pre-handler reject；no Other/default |
| Command/Query/Job metadata | `contracts::{commands,queries,jobs}` | trusted entry parser + exact application assembler | required missing reject；optional trace remainsNone |
| invocation result access | `contracts::surfaces::ObservationProtocolResultAccess` | application exact response assembler maps process-local `ObservationResultAccess` | absent only on ephemeral/no-stored branch；never enters stored bytes/digest |
| public error code/surface | `contracts::errors` | contracts shape factory + Step12 application mapper | unmapped internal error stops protocol assembly |
| Command request/stored surface/response | `contracts::commands` | exact API decoder + stable surface encoder/decoder + response assembler | ephemeral branch structurally has no result/ref sets；replay only wraps exact stored surface |
| Query request/response | `contracts::queries` | exact API decoder/read assembler | missing/empty/not-visible/unavailable remain distinct |
| public page/cursor/info | `contracts::queries` | contracts bounds + application binding codec | malformed/foreign cursor fails, never empty fallback |
| source event identity | `contracts::refs::SourceEventRef` | authenticated exact worker decoder wraps validated `BodyFreeRef`; stored receipt decoder rehydrates exact value | required in validated envelope/stored receipt；only malformed/missing pre-handler rejection may omit it |
| Inbound envelope/payload | `contracts::events` | exact worker decoder; application constructs private event identity | unsupported schema before payload parse |
| Consumer stored receipt/invocation receipt/outcome | `contracts::events` | stable receipt encoder/decoder + exact worker/application response assembler | ephemeral branch structurally has no refs；replay access does not replace original outcome；action selected separately |
| Outbound envelope/protocol snapshot | `contracts::events` | accepted follower + contracts encoder + application digest canonicalizer | missing/corrupt snapshot stops publication |
| application outbox snapshot/record | `application::outbox` | application follower/pair factory | never exposed as public DTO or rebuilt from truth |
| Job request/outcome/stored surface/response/report | `contracts::jobs` | stable surface encoder/decoder + exact jobs response assembler | no response before valid stored report；replay only changes outer access |
| public result/report identity | `contracts::refs::BodyFreeRef` as stored public identity | same-UoW result/report assembler | never aliases application stored/local identity |

Shared constructors have no I/O and only validate local shape. Application assemblers may canonicalize/digest/map already validated values but cannot choose transport locators or use repository reads except through the matching service flow. Entry response mappers cannot call domain objects, repositories, resolvers, outbox, publisher or config to repair missing fields. Every optional field means a documented absence branch; no optional field means “implementation can decide later.”

### 6.13 S08-B shared carrier closure audit

| Check | Result |
|---|---|
| five finite families and stable discriminator | pass；`16/14/9/12/9` names, no dynamic registry |
| sealed name/body relation | pass_at_shared_depth；60 implementations remain S08-C~G |
| metadata actor/key/trace/run authority | pass；Consumer actor stays outside payload;JobRunId correlation only |
| stored surface / invocation access layering | pass；inner bytes/outcome/refs/error immutable，fresh/replay只由outer access表达 |
| Command stored replay/result identity | pass；public BodyFreeRef, no application ref leak |
| Query visibility/freshness/availability/missing/page | pass_at_shared_depth；per-Query source map remains S08-D |
| public cursor/page与Step07 codec一致性 | pass；完整token `<=4096` ASCII bytes、内部position `<=1024` bytes、empty page禁止continuation |
| SourceEventRef owner/wire/redaction | pass_at_shared_depth；canonical declaration=`contracts::refs`，Step06旧owner claim按affected item回指修订 |
| Consumer envelope/receipt/action split | pass_at_shared_depth_with_internal_affected；C-05 total action matrix remains S08-E，probe后仍indeterminate没有合法completion shape |
| Outbound immutable snapshot/no rebuild | pass_at_shared_depth；12 payload/source maps remain S08-F |
| outbound encoder文件owner | pass；sealed encoder固定在既定`contracts::events`，未新增`encoding.rs` |
| Job report/replay/private identity exclusion | pass_at_shared_depth；9 input/output maps remain S08-G |
| route/topic/schedule/config leakage | none；actual locator remains Step14/`04` |
| business/source truth ownership | unchanged；all surfaces are observation/audit projection only |
| protocol completion count | S08-B checkpoint为`0/60`；shared carrier本身不完成协议。合并当前S08-C后为`16/60 defined_with_affected_open`，无条件完成仍为`0/60` |
| new external upstream blocker | none |

S08-B closes `S08-ROUTE-BINDING-01` at the shared structural layer: finite family/name/body/operation relations now exist. Handler totality remains an explicit per-protocol gate in S08-C~G, so the affected item state becomes`shared_binding_closed_per_protocol_totality_open` rather than global resolved.

## 7. Per-protocol completion template

Every S08-C~G protocol must receive an independent section with all rows below. A family-level declaration may define shared carriers, but it cannot mark an individual protocol complete.

| Required subsection | Minimum closure |
|---|---|
| purpose and truth boundary | caller/producer, handler/subscriber, owned target and explicit non-owned truth |
| function signature and logical binding | exact public request/payload/job type, exact handler, assembler/service or encoder path, finite family binding |
| request/payload/input schema | Rust DTO fields, nested public type owner, source, validation and absence behavior |
| response/event/report schema | all variants/fields, stored-result or replay behavior, no bool/naked-id shortcut |
| field-to-object/view mapping | every required field maps to input, lookup, derivation, clock/ID or current committed object |
| error mapping | protocol-safe error/rejection/action; provider/domain raw detail cannot escape |
| idempotency and duplicate behavior | key authority, canonical digest profile, duplicate result/receipt/report replay |
| actor/visibility authority | participant/system/integration/trusted source kind and non-bypassable gate |
| audit/redaction | durable record/event expectation, safe diagnostic detail, forbidden raw body/credential/evidence |
| Step 06/07/09 closure | exact object/input/result owner, exact callable/port, unique flow handoff |
| protocol stop review | no unowned public type, no locator leakage, no second truth owner, status changed only with evidence |

## 8. S08-C protocol records: C01-C16

本节是 S08-C 的 current protocol record。C01-C16 均使用 S08-B 的 shared carrier，但不能以 shared carrier 代替 operation-specific body、target、record、outbox 和 error 审查。`ObservationCommandResult` 是当前唯一 application result carrier；本批不恢复历史 operation-specific result carrier 名称。由于 Step 06 目前没有给十六个 operation-specific result body 一个唯一 owner，本节只固定 result body 的语义字段、presence matrix 和 owner gap，并把该缺口登记为 `S08-COMMAND-RESULT-BODY-OWNER-01`。C01-C12 为前序记录，C13-C16 为当前批次记录；全部保持 affected-open，不能据此宣称无条件完成。

### 8.1 C01 `SubmitObservationMaterial`

#### 8.1.1 Purpose and truth boundary

`SubmitObservationMaterial` 是 API 同步 Command，用于把一个已通过入口 typed validation 的 body-free observation source boundary 交给 Observability，形成本仓 `ObservationReceipt`、安全处置和 intake history。它不接收或保存 source body，不确认 source/business truth，不生成 evidence alias、verdict 或 signoff。

| boundary | current rule |
|---|---|
| caller | `api` exact Command handler；actor 来自 authenticated `ObservationCommandMetadata.actor_ref` |
| handler path | `ObservationApiInputAssembler::submit_observation_material` -> `ObservationTruthWriteService::submit_observation_material` |
| owned target | `ObservationReceipt`、对应 `SafetyDisposition`、H1 `IntakeDecisionRecord`、accepted outbox snapshot、stored result |
| non-owned truth | source material、source version truth、business admission truth、raw log/metric/trace/audit body |
| flow handoff | `SubmitObservationMaterialFlow`；Step 09 仍未 current close |

#### 8.1.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::submit_observation_material(
    request: ObservationCommandRequest<SubmitObservationMaterialRequest>,
) -> Result<SubmitObservationMaterialInput, ApplicationError>

ObservationTruthWriteService::submit_observation_material(
    input: SubmitObservationMaterialInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

All Command control fields are present in `ObservationCommandMetadata` and are not repeated in the body:
`actor_ref: ActorSafeRef`、`trace_ref: Option<TraceCorrelationRef>`、`idempotency_key: IdempotencyKey`、`request_digest: RequestDigest`、`requested_at: ObservedAt`。

| body field | type | source / validation | absence or forbidden behavior |
|---|---|---|---|
| `source_ref` | `ObservationSourceRef` | public typed body-free ref; source family and identity discriminator must be valid | missing/invalid -> `MissingRequiredField` or `InvalidReference`; never derive from body |
| `source_family` | `SourceFamilyKind` | finite compatibility check against source ref and submission policy | unknown/mismatch -> `InvalidRequest`; no fallback to `Bus` or first variant |
| `submission_purpose` | `SubmissionPurpose` | finite purpose; compatibility checked before digest and reservation | missing/unsupported -> `InvalidRequest` |
| `safe_summary_ref` | `Option<SafeSignalSummaryRef>` | canonical safe-summary ref; old `SafeSummaryRef` spelling is historical and must not create an alias | `None` is explicit absence; resolver unavailable is not treated as empty |
| `redaction_marker` | `Option<RedactionMarker>` | independent typed marker; must be compatible with summary and safety path | marker cannot stand in for summary or source body |

Assembler order is fixed: finite operation/name validation, trusted metadata validation, body and nested-type validation, exact digest material construction, candidate calculation, supplied-digest comparison, immutable context construction, then concrete input construction. It must not call a repository, resolver, UoW or domain factory. The concrete input contains the validated context, `RequestDigestCandidates`, `requested_at` and the five body fields by value.

#### 8.1.3 Request digest and target mapping

The write digest semantic order is:

```text
source_ref; source_family; submission_purpose; safe_summary_ref; redaction_marker
```

`actor_ref`、metadata `trace_ref`、idempotency key、supplied digest and `requested_at` are excluded. `safe_summary_ref` and `redaction_marker` use explicit `Option` presence encoding. No source body, path, provider payload, debug representation or body hash may enter the material.

| stage | exact owner and operation |
|---|---|
| receipt creation | `ObservationReceipt::receive(receipt_ref, source_ref, submission_purpose, received_at)`; `receipt_ref` and `received_at` come from `IdGeneratorPort` / `ClockPort` |
| safety creation | `SafetyDisposition::evaluate(disposition_ref, &receipt, received_material_summary, safety_context)`; summary is body-free and source-exact |
| admission | `ObservationReceipt::apply_admission(&disposition, &admission_decision)`; the decision must prove complete pre/post snapshots |
| safety mutation | `SafetyDisposition::apply_decision(&receipt, &safety_decision)`; this is a separate transition from receipt admission |
| H1 record | receipt admission uses `IntakeDecisionAcceptedInput::ReceiptAdmission`; the post-state carries receipt and disposition snapshots |
| repository | `ObservationIntakeRepository::stage_receipt`, `stage_disposition`, one cursor allocation, then `append_intake_decision` |
| outbox | accepted receipt may emit `ObservationReceiptChanged`; accepted safety mutation may emit `SafetyDispositionChanged`; each uses a separate immutable snapshot |

The receipt admission H1 record and safety mutation H1 record must have different `IntakeDecisionRecordRef` values and distinct accepted-input variants. They may share a UoW and cursor policy, but cannot be merged because they explain different transitions. If no canonical event exists, `outbox_refs` is an empty set with that fact preserved in the stored result; the publisher never reconstructs an event from current receipt state.

#### 8.1.4 Result and error matrix

The public response is `ObservationCommandResponse<T>` over the operation-specific result body `T`. The body owner is open under `S08-COMMAND-RESULT-BODY-OWNER-01`; the following semantic fields and presence rules are nevertheless mandatory.

| outcome | response branch | required result semantics | refs / error |
|---|---|---|---|
| accepted | `Stored { FreshlyCommitted, surface }` | body required; receipt ref and committed admission state required; disposition ref/state present when a safety mutation committed | changed/outbox/gap sets equal exact UoW writes; error absent |
| duplicate | `Stored { Replayed, surface }` | byte-for-byte original body and original outcome; no current-state reconstruction | original result/changed/outbox/gap/error replayed; no new outbox |
| durable quarantine | `Stored { FreshlyCommitted, surface }` | body only contains allowed body-free quarantine/result projection | error required; no raw quarantine material |
| pre-UoW reject | `Ephemeral { Rejected, ... }` | no result body or identity | typed protocol error; no refs |
| conflict | `Ephemeral { Conflict, ... }` | no winner material and no result body | `IdempotencyConflict` or version conflict; no refs |
| dependency delayed | `Ephemeral { Delayed, ... }` | no claim of zero write if commit outcome is unknown | dependency error or `CommitOutcomeUnknown`; no fabricated result |

`ObservationCommandResult` maps the application disposition to this carrier. A duplicate changes only outer `result_access` to `Replayed`; it does not introduce a `DuplicateReplayed` durable outcome and does not overwrite the original body.

#### 8.1.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| error mapping | malformed ref/name/field -> protocol error; policy or state rejection -> typed application error; resolver unavailable -> delayed; commit uncertainty -> `CommitOutcomeUnknown`; raw domain/provider text never escapes |
| idempotency | logical scope is `(Command operation, effective actor, idempotency_key)`; application builds candidates before atomic reserve; same retained-profile material replays, different material conflicts, in-flight does not rerun |
| actor | effective actor is authenticated metadata only; source-like actor fields are not accepted from body and cannot authorize admission |
| visibility | this Command has no caller-selected visibility field; safe summary and stored result are filtered by their own body-free owner rules |
| audit | accepted receipt and safety transitions append H1 records in the same accepted UoW; record refs and outbox refs are exact committed sets |
| redaction | only typed `SafeSignalSummaryRef` and `RedactionMarker` may cross the boundary; raw source, raw summary, labels, attributes, credentials and evidence body are rejected or quarantined without persistence |

#### 8.1.6 Protocol stop review

`C01` has a unique finite binding, exact assembler/service methods, source/body schema, digest order, domain target and H1/outbox expectations. It remains `defined_with_affected_open`, not unconditional complete, until the operation-specific result body owner and the Step 06 `SafeSignalSummaryRef` use-site correction are closed. No Step 09 implementation flow is written here.

### 8.2 C02 `RecordSafetyDisposition`

#### 8.2.1 Purpose and truth boundary

`RecordSafetyDisposition` records or advances the observation-owned safety disposition for an existing receipt. It is not a source admission command, does not mutate `ObservationReceipt.admission_state`, and does not own a business safety verdict. A simultaneous receipt admission is a separate C01 branch and must not be silently folded into C02.

| boundary | current rule |
|---|---|
| caller | `api` exact Command handler with authenticated actor metadata |
| handler path | `ObservationApiInputAssembler::record_safety_disposition` -> `ObservationTruthWriteService::record_safety_disposition` |
| owned target | versioned `SafetyDisposition` and one H1 safety mutation record; optional `SafetyDispositionChanged` snapshot |
| non-owned truth | source body, business verdict, receipt admission state unless a separately designed branch is explicitly supplied |
| flow handoff | `RecordSafetyDispositionFlow` |

#### 8.2.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::record_safety_disposition(
    request: ObservationCommandRequest<RecordSafetyDispositionRequest>,
) -> Result<RecordSafetyDispositionInput, ApplicationError>

ObservationTruthWriteService::record_safety_disposition(
    input: RecordSafetyDispositionInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

| body field | type | source / validation | absence or forbidden behavior |
|---|---|---|---|
| `receipt_ref` | `ObservationReceiptRef` | exact typed local identity; load receipt and current disposition with versions | missing -> `InvalidReference`; no lookup by source body |
| `disposition_state` | `SafetyDispositionState` | finite requested state; validated against current state and decision matrix | invalid transition -> `InvalidStateTransition`; no direct field assignment |
| `redaction_marker` | `RedactionMarker` | independent safety output marker | cannot encode summary or quarantine reason |
| `sanitized_summary_ref` | `Option<SafeSignalSummaryRef>` | canonical body-free safe summary | `Some` required for `Safe`/`Redacted`; forbidden for `Rejected`/`Quarantined` |
| `quarantine_reason` | `Option<QuarantineReason>` | independent typed reason | required only for applicable quarantine/rejection branches; never carries body |

The legal combination matrix is checked before digest and reservation:

| requested state | marker | forbidden-body flag | summary | reason |
|---|---|---|---|---|
| `Safe` | `Clean` | `NotDetected` | `Some` | `None` |
| `Redacted` | `Redacted` | `NotDetected` | `Some` | `None` |
| `Rejected` | owner-defined rejected marker | `Detected` or policy-compatible value | `None` | required when policy says so |
| `Quarantined` | quarantine-compatible marker | `Detected` | `None` | required |

`redaction_marker`, `sanitized_summary_ref` and `quarantine_reason` are independent semantic fields. The assembler may not derive one from another or use a missing summary as an implicit quarantine reason.

#### 8.2.3 Digest, transition and persistence mapping

The request digest order is:

```text
receipt_ref; disposition_state; redaction_marker; sanitized_summary_ref; quarantine_reason
```

Metadata trace, idempotency key, supplied digest and requested time remain excluded. The service reserves the command, loads the receipt and disposition using expected versions, calls the domain safety decision and transition, then stages only the disposition mutation.

| stage | exact contract |
|---|---|
| policy/domain | `SafetyDisposition::apply_decision(&receipt, &decision)`; decision basis and snapshots must prove the post-state |
| H1 | `IntakeDecisionAcceptedInput::SafetyDisposition` with `IntakeDecisionPolicyBasis::Safety`; post-state is `SafetyDisposition` only |
| repository | load receipt/disposition; `ObservationIntakeRepository::stage_disposition`; allocate cursor; `append_intake_decision` |
| outbox | accepted mutation may append `SafetyDispositionChanged`; no receipt-changed event unless a separately modeled receipt transition actually occurred |
| transaction | disposition, H1 record, immutable outbox snapshot, affected projection stale markers, stored result and idempotency completion share the accepted UoW |

The service must not write a safety state into `ObservationReceipt.admission_state`. If the current receipt is not compatible, it returns a typed rejection or delayed/gap result without mutating either object.

#### 8.2.4 Result, errors and duplicate behavior

The response uses `ObservationCommandResponse<T>` and the shared stored/ephemeral matrix. The operation-specific body owner remains covered by `S08-COMMAND-RESULT-BODY-OWNER-01`; its minimum semantic fields are `receipt_ref`, `disposition_ref`, committed safety state, marker and optional safe-summary ref. `Rejected` and `Quarantined` bodies must not contain raw reason material.

| case | required behavior |
|---|---|
| accepted transition | stored body and exact changed/outbox/gap refs; `SafetyDispositionChanged` only when transition exists |
| duplicate | replay original state, body, refs and error; no second H1 or outbox |
| invalid combination | pre-reservation typed `InvalidRequest`; no result/ref and no write |
| missing receipt/disposition | typed `InvalidReference` or dependency classification; no synthetic object |
| version conflict | ephemeral conflict; do not return winner or retry with current state |
| resolver/dependency unavailable | delayed only when no accepted mutation committed; unknown commit requires probe classification |

Actor authority is the authenticated `ActorSafeRef`. The Command has no visibility override. Audit detail is the typed H1 transition and safe marker only; forbidden body evidence is not stored in the disposition or result.

#### 8.2.5 Step closure and stop review

Step 06 owners are `SafetyDisposition`, `SafetyDispositionTransition`, `SafetyDispositionDecision` and H1 record assembly. Step 07 owners are the exact assembler and TruthWrite method above plus `ObservationIntakeRepository`. Step 09 reservation is `RecordSafetyDispositionFlow`. The protocol is `defined_with_affected_open` until result-body ownership is closed; no receipt-state mutation or business-verdict authority may be added in a later mapper.

### 8.3 C03 `BindCorrelationContext`

#### 8.3.1 Purpose and truth boundary

`BindCorrelationContext` creates or advances a local correlation context anchored to an accepted observation receipt. It records body-free association hints for tracing and safe signal linkage. It does not infer business causation, identity ownership, execution success or source truth from opaque IDs.

#### 8.3.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::bind_correlation_context(
    request: ObservationCommandRequest<BindCorrelationContextRequest>,
) -> Result<BindCorrelationContextInput, ApplicationError>

ObservationTruthWriteService::bind_correlation_context(
    input: BindCorrelationContextInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

| body field | type | semantic role | validation |
|---|---|---|---|
| `receipt_ref` | `ObservationReceiptRef` | local anchor | receipt must be accepted; missing/rejected/quarantined/received cannot create context |
| `trace_ref` | `Option<TraceCorrelationRef>` | semantic correlation hint carried by this Command | distinct from metadata trace; no metadata fallback |
| `causation_ref` | `Option<CausationRef>` | opaque causation hint | never upgraded to business causation |
| `source_ref` | `ObservationSourceRef` | source equality guard | must exactly match the loaded receipt source |
| `correlation_seed` | `Option<CorrelationSeed>` | typed pending seed | current domain factory requires non-empty `CorrelationSeed`; combination rule is open and must fail closed |

The semantic body `trace_ref` and `ObservationCommandMetadata.trace_ref` are different fields with different owners. They must both be preserved according to their role and cannot be merged, renamed or used as fallback for each other.

#### 8.3.3 Open seed contract and fail-closed rule

`CorrelationSeed::new(...)` currently requires at least one valid semantic hint, while the current public input table permits `correlation_seed: None` and also exposes independent `trace_ref` / `causation_ref`. The design does not choose an implicit merge rule. Until Step 06 affected revision gives one authoritative assembly rule:

- `None` seed is rejected before reservation unless a future approved input contract explicitly makes the independent fields the canonical seed source.
- A non-empty nested seed plus independent fields is accepted only if exact equality/precedence is defined by the revised owner; otherwise it is `InvalidRequest`.
- The assembler must not synthesize a seed, fall back to metadata trace, use `source_ref` as a seed, or silently discard one field.
- No `CorrelationContext` or H2 record is created on the ambiguous branch.

This is `S08-COMMAND-CORRELATION-SEED-OPTIONALITY-01`, an open affected item rather than an implementation choice.

The digest order for a resolved future contract remains:

```text
receipt_ref; trace_ref; causation_ref; source_ref; correlation_seed
```

The metadata trace, idempotency key, supplied digest and requested time are excluded.

#### 8.3.4 Domain, H2 and repository mapping

For an accepted, unambiguous seed the service performs:

1. reserve the exact Command idempotency scope;
2. load receipt and existing context with versions;
3. verify `source_ref` exact equality;
4. allocate `context_ref` only for a new context;
5. call `CorrelationContext::from_receipt(context_ref, &receipt, seed)`, yielding `Unbound` with `pending_seed`;
6. call `bind_seed()` only after the seed and receipt snapshot pass validation;
7. stage context with expected version;
8. create H2 only for an explicit `CorrelationContextTransition` such as `SeedBound`, using `CorrelationLinkAcceptedInput`;
9. allocate the observation cursor and append `CorrelationLinkRecord` through `CorrelationSignalRepository::append_correlation_record`;
10. save exact stored result and any canonical outbox snapshot in the same accepted UoW.

`Suppressed`, no transition, partial seed replacement and inferred relations do not create H2. A context ref or signal ref alone is never evidence of a correlation transition. If the protocol is later allowed to record `Partial`, that branch needs an explicit transition and record policy; it cannot be inferred from `Option` presence.

#### 8.3.5 Result, errors, actor and stop review

Minimum result semantics are `context_ref`, `receipt_ref`, local correlation state and active body-free hint refs. A stored duplicate replays the original state and H2/outbox/gap sets. Pre-UoW ambiguity, invalid receipt, source mismatch, seed conflict and version conflict are ephemeral typed errors. An indeterminate commit is `CommitOutcomeUnknown` and is not mapped to either “context created” or “context absent”.

Actor is authenticated metadata; there is no visibility override. Audit is an H2 `CorrelationLinkRecord` only when a real transition exists. Trace/causation/subject/runtime refs are redacted typed references, never raw spans, event bodies, URLs, actor profiles or business IDs. Step 06 object/input/record owners and Step 07 exact methods are identified, but this protocol remains `defined_with_affected_open` until `S08-COMMAND-CORRELATION-SEED-OPTIONALITY-01` and result-body ownership close.

### 8.4 C04 `RecordSafeSignal`

#### 8.4.1 Purpose and truth boundary

`RecordSafeSignal` records a safe, body-free signal candidate under an existing correlation context and may accept an explicitly named rollup window. It is the observation-side projection of a safe summary, not a log/metric/trace backend, execution result or business truth owner.

| boundary | current rule |
|---|---|
| caller / handler | `api` exact Command handler |
| assembler / service | `ObservationApiInputAssembler::record_safe_signal` -> `ObservationTruthWriteService::record_safe_signal` |
| owned target | `SafeSignal`, optional existing `SignalRollupWindow`, explicit H2 linkage and optional H11 maintenance record |
| forbidden target | raw telemetry, runtime/sandbox body, provider payload, source/business truth, implicit rollup creation |
| flow handoff | `RecordSafeSignalFlow` |

#### 8.4.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::record_safe_signal(
    request: ObservationCommandRequest<RecordSafeSignalRequest>,
) -> Result<RecordSafeSignalInput, ApplicationError>

ObservationTruthWriteService::record_safe_signal(
    input: RecordSafeSignalInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

| body field | type | source / validation | absence behavior |
|---|---|---|---|
| `correlation_context_ref` | `CorrelationContextRef` | exact local context identity; load current context | missing/invalid/`Invalid` context -> typed reject |
| `signal_kind` | `SafeSignalKind` | finite kind; policy compatibility check | unknown/mismatch -> `InvalidRequest` |
| `summary_ref` | `SafeSignalSummaryRef` | body-free safe summary | required; unresolved/unavailable -> delayed or explicit stale branch, never raw fallback |
| `runtime_signal_ref` | `Option<RuntimeSandboxSignalRef>` | structured safe runtime/sandbox boundary only | `None` is explicit; no resolver payload substitution |
| `rollup_window_ref` | `Option<SignalRollupWindowRef>` | existing named window | `None` means no rollup branch; service must not create one automatically |

#### 8.4.3 Digest, domain and H2/H11 mapping

The request digest order is:

```text
correlation_context_ref; signal_kind; summary_ref; runtime_signal_ref; rollup_window_ref
```

Metadata trace, idempotency key, supplied digest and requested time are excluded. The service validates the context, calls `SafeSignal::from_summary(signal_ref, &context, summary_ref, signal_kind, runtime_signal_ref)`, evaluates the P3 `SignalDecision`, and calls `SafeSignal::apply_decision`.

| branch | record / persistence rule |
|---|---|
| `Recorded` or explicit `Revalidated` | stage signal; H2 only when `CorrelationSignalLinkageEffect::Recorded` or `Revalidated` explicitly proves a transition |
| `Suppressed` | stage only the allowed signal result/diagnostic state; no H2 inferred from the attempted request |
| `MarkedStale` | no H2; stale marker is not a new correlation relation |
| explicit `rollup_window_ref` | load the existing window and call `SignalRollupWindow::accept_signal(&signal, &context, committed_cursor)` after cursor assignment; form H11 with `ProjectionMaintenanceAcceptedInput::SignalRollupAccepted` |
| no `rollup_window_ref` | do not load or create a rollup; no H11 |
| duplicate/no-op | classify before building a record obligation; after obligation exists, no transition is an assembly failure and the UoW rolls back |

Repository calls are `stage_signal`, optional `stage_rollup`, one cursor allocation, then exact H2/H11 append methods. The signal outbox is `SafeSignalRecorded` only for a committed recorded transition. An accepted rollup/maintenance transition may form `DerivedProjectionChanged`; publisher consumes its immutable snapshot and does not recompute current rollup state.

#### 8.4.4 Result, errors, actor, redaction and stop review

Minimum result semantics are `signal_ref`, `correlation_context_ref`, `signal_kind`, committed signal state, summary ref and optional rollup ref. The operation-specific result body owner remains open under `S08-COMMAND-RESULT-BODY-OWNER-01`; `SafeSignalCommandResult` and similar historical names are forbidden.

| case | mapping |
|---|---|
| missing/invalid context | ephemeral `Rejected` with `InvalidReference` or `InvalidStateTransition`; no signal |
| missing summary or resolver unavailable | `Delayed` unless a separately committed stale/gap marker is explicitly modeled; no raw body |
| policy suppress | stored `Suppressed` only if the domain/result contract allows it; no H2 |
| rollup CAS/version failure | rollback signal, rollup, records, outbox and stored result together |
| duplicate | exact original stored surface, `Replayed` access, no new H2/H11/outbox |
| commit uncertainty | `CommitOutcomeUnknown`; do not claim signal recorded or absent |

Actor comes only from authenticated Command metadata. Visibility is determined by committed signal/context and safe-summary owners, not by the request. Redaction permits only `SafeSignalSummaryRef`, `RuntimeSandboxSignalRef`, typed state and bounded diagnostic categories; raw log lines, metric values/series, spans, labels, attributes and provider responses are forbidden.

The protocol is `defined_with_affected_open` until result-body ownership and the exact Step 06 accepted-input/accessor wording are closed. Its H11 cursor dependency is recorded here but its full function flow remains reserved for Step 09.

### 8.5 C05 `AppendAuditProjection`

#### 8.5.1 Purpose and truth boundary

`AppendAuditProjection` appends one body-free audit fact or an explicitly named local audit-projection change. It owns only the observation-side `AuditProjection` and its H3 append record. It does not ingest the source audit event, become the source audit system of record, or preserve an audit action body.

| boundary | current rule |
|---|---|
| caller | `api` exact Command handler; actor is authenticated Command metadata |
| handler path | `ObservationApiInputAssembler::append_audit_projection` -> `ObservationTruthWriteService::append_audit_projection` |
| logical binding | `Command / AppendAuditProjection`; no transport locator is selected here |
| owned target | `AuditProjection`, one applicable H3 `AuditAppendRecord`, stored command result and any typed projection follower |
| non-owned truth | source audit event/body, Governance audit decision, provider response, evidence body, final report or signoff |
| flow handoff | `AppendAuditProjectionFlow` |

The source audit reference is an upstream identity. The local projection may retain its typed reference and a trusted safe summary, but it cannot mint or rewrite the source event identity. `Appended` means that the local projection append was committed; it is not a claim that the upstream audit action succeeded or that an external audit record is complete.

#### 8.5.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::append_audit_projection(
    request: ObservationCommandRequest<AppendAuditProjectionRequest>,
) -> Result<AppendAuditProjectionInput, ApplicationError>

ObservationTruthWriteService::append_audit_projection(
    input: AppendAuditProjectionInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

Command control fields remain in `ObservationCommandMetadata`: `actor_ref`, metadata `trace_ref`, `idempotency_key`, supplied `request_digest` and `requested_at`. They are not repeated in the operation body.

| body field | current type | authoritative source | absence / conflict behavior |
|---|---|---|---|
| `subject_ref` | `AuditSubjectRef` | typed body-free subject supplied by the trusted source mapper or preceding local operation | missing or variant mismatch -> protocol `InvalidRequest`; no projection identity is derived |
| `correlation_context_ref` | `CorrelationContextRef` | accepted local correlation context relation | missing, non-`Bound`, or subject/context mismatch -> `InvalidReference` or typed relation rejection |
| `source_audit_ref` | `SourceAuditRef` | upstream source-audit identity carried by a typed boundary | missing/invalid -> `InvalidReference`; never parse from an event body or URL |
| `source_audit_summary_ref` | `SafeExternalSummaryRef` | trusted source-audit safe-summary mapping | unavailable is not an empty summary; unresolved mapping is delayed or rejected before reservation |
| `visibility` | `Option<VisibilitySurface>` | bounded caller/request surface, if the current public carrier permits it | it is a cap/input to policy, never an assertion of `Visible`; invalid widening is rejected |

The historical Step 06 row names the fourth field `audit_action_summary_ref: SafeSummaryRef`. That spelling and type are not current canonical schema. `source_audit_summary_ref: SafeExternalSummaryRef` is the intended current field, but its exact public use-site and trusted producer still require `S08-C05-SUMMARY-SOURCE-01`; until that affected item is repaired, an assembler must fail closed rather than accept either alias.

#### 8.5.3 Request digest and field-to-object mapping

The operation digest material is ordered and presence-sensitive:

```text
subject_ref; correlation_context_ref; source_audit_ref;
source_audit_summary_ref; visibility
```

Metadata actor/trace, idempotency key, supplied digest and requested time are excluded. The digest contains the canonical typed safe-summary reference, not an audit body, action text, debug representation or an ad hoc hash of source material.

| stage | exact mapping |
|---|---|
| assembler | validate finite operation/body types, validate the trusted summary carrier, build candidates, compare the supplied digest, then construct the matching concrete input; no repository, resolver or UoW call |
| projection lookup | resolve an existing projection by its exact local identity/relation; a new projection ref is generated by the application id generator only when the accepted branch needs one |
| domain creation | `AuditProjection::create(projection_ref, subject_ref, &bound_context, source_audit_ref, source_audit_summary_ref)`; the context must be `Bound` and the source summary must be body-free |
| source-fact transition | for a new/pending projection, reserve an `AuditAppendRecordRef`, call `append_source_fact`, and require the transition's append ref to equal the record metadata ref |
| existing projection | exact same committed source fact is a duplicate/no-op; a changed immutable source relation or summary is a typed conflict, not an in-place overwrite |
| visibility branch | if a separately modeled target-bound visibility decision is part of this operation, use the matching `restrict_visibility`/`restore_visibility` branch and H3 policy basis; do not accept a caller-provided final state |
| H3 record | construct `AuditAppendRecord::from_accepted(...)` from the transition, same-UoW post-state and typed `ObservationRecordMetadata<AuditAppendRecordRef>` |
| repository | `AuditEvidenceRepository::stage_projection`, allocate the one Observation cursor, then `append_audit_record`; all stages remain private until commit |
| follower/outbox | create the typed immutable projection-change follower in the accepted UoW when the current outbox owner requires one; publisher later consumes the stored snapshot and never rebuilds the projection |

An H3 record is one local audit explanation for one accepted transition. A source-fact append and a linkage lifecycle change cannot be silently merged into one record. A no-op duplicate consumes neither a new append record ref nor a second outbox item.

#### 8.5.4 Result, error and duplicate matrix

The public carrier remains `ObservationCommandResponse<T>` over an operation-specific body whose unique owner is still open under `S08-COMMAND-RESULT-BODY-OWNER-01`. The minimum body semantics for this operation are `projection_ref`, `subject_ref`, `source_audit_ref`, committed projection state, `latest_append_record_ref` when a transition exists, and exact `changed_refs`/`outbox_refs`/`gap_refs`.

| case | public/application behavior | write rule |
|---|---|---|
| source fact appended | stored `Accepted` surface with `FreshlyCommitted` access and exact projection/H3/outbox refs | projection, H3, follower, stored result and idempotency completion share one UoW |
| exact duplicate | stored original surface with `Replayed` access | no new projection mutation, H3 record, outbox or result body reconstruction |
| source summary unavailable | typed `Delayed` or safe dependency error before acceptance | no projection, identity, H3 or outbox is fabricated |
| source relation/body conflict | typed `InvalidReference`, `BodyFreeBoundaryViolation` or idempotency conflict | zero mutation; raw audit material is not persisted |
| policy/state rejection | typed rejection or durable blocked/quarantined surface only if the operation's current result contract explicitly permits it | no H3 append unless a real local transition was accepted |
| version/CAS conflict | ephemeral conflict; do not return the winning projection | UoW rolls back all staged local material |
| commit outcome unknown | `CommitOutcomeUnknown` | do not claim appended or absent; recovery probes the idempotency/stored-result relation |

#### 8.5.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(AppendAuditProjection, authenticated actor, idempotency_key)`; same retained digest replays the stored surface, different digest conflicts, in-flight does not rerun the append |
| actor | only authenticated `ActorSafeRef` from metadata; source-audit actor fields are not accepted and cannot authorize the local projection |
| visibility | request visibility is a bounded input; policy/domain state and persisted safe summary determine the committed projection surface |
| audit | one accepted transition maps to one H3 record; the H3 record is local audit history, not source-audit truth |
| redaction | retain typed source/audit refs, `SafeExternalSummaryRef`, finite state/reason and bounded gap refs only; reject or quarantine raw action text, event body, labels, provider payload, credentials and locator material |
| no-write | no source-audit write, replay, repair, external delivery or report generation is reachable from this Command |

#### 8.5.6 Step closure and protocol stop review

Step 06 owners are `AuditProjection`, `AuditProjectionTransition`, `SafeExternalSummaryRef` and H3 `AuditAppendRecord`. Step 07 owners are the exact assembler/service methods, `AuditEvidenceRepository::stage_projection` and `append_audit_record`. The unique Step 09 reservation is `AppendAuditProjectionFlow`.

`C05` is `defined_with_affected_open`: the operation has an exact callable, digest order, domain/H3/UoW mapping, replay matrix and redaction boundary, but the canonical safe-summary field/source and operation-specific result body owner are not yet closed. No source-audit truth, external audit acceptance or Step 09 flow is claimed.

### 8.6 C06 `LinkBodyFreeEvidence`

#### 8.6.1 Purpose and truth boundary

`LinkBodyFreeEvidence` creates or advances one observation-owned, body-free relation between an appended `AuditProjection` and a typed external evidence boundary. It can record `Linked`, `NotVisible`, `BodyBlocked` or a policy-safe local outcome, but it never stores evidence content, mints a real evidence alias, or decides authenticity.

| boundary | current rule |
|---|---|
| caller | `api` exact Command handler; actor comes from authenticated metadata |
| handler path | `ObservationApiInputAssembler::link_body_free_evidence` -> `ObservationTruthWriteService::link_body_free_evidence` |
| logical binding | `Command / LinkBodyFreeEvidence` |
| owned target | `EvidenceLinkage`, owning projection linkage set, one applicable H3 linkage record and stored result |
| non-owned truth | evidence body, external evidence lifecycle, artifact/governance truth, authenticity verdict, final report or signoff |
| flow handoff | `LinkBodyFreeEvidenceFlow` |

`Linked` means that the target-bound visibility policy accepted a local body-free linkage. It does not mean that an evidence consumer accepted the material or that the evidence is authentic.

#### 8.6.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::link_body_free_evidence(
    request: ObservationCommandRequest<LinkBodyFreeEvidenceRequest>,
) -> Result<LinkBodyFreeEvidenceInput, ApplicationError>

ObservationTruthWriteService::link_body_free_evidence(
    input: LinkBodyFreeEvidenceInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

| body field | current type | source / validation | absence behavior |
|---|---|---|---|
| `projection_ref` | `AuditProjectionRef` | exact local projection identity | missing or not appended -> `InvalidReference`/state rejection |
| `boundary_ref` | `GovernanceArtifactEvidenceReference` | trusted body-free external boundary mapper | Missing/Invalid boundary is not converted to a linkage; body/locator material is rejected |
| `evidence_purpose` | `EvidenceConsumerPurpose` | finite purpose | unknown or policy-incompatible purpose -> `InvalidRequest` |
| `consumer_scope` | `EvidenceConsumerScope` | exact consumer and selection scope from the trusted caller/consumer contract | required; no derivation from purpose, boundary, product name or default |
| `digest_summary` | `DigestSummary` | trusted boundary snapshot; semantic linkage digest, not Command request digest | missing/mismatch -> `ReferenceConflict` or delayed safe-resolution result |

The current Step 06 input table omits `consumer_scope`. `EvidenceLinkage::candidate`, P4 and `find_linkage_by_relation` all require it. This is registered as `S08-C06-CONSUMER-SCOPE-SOURCE-01`; until the upstream input contract is revised, missing scope is fail-closed and no linkage ref is generated. `evidence_purpose` cannot be used as a scope substitute.

#### 8.6.3 Digest and linkage transition mapping

```text
projection_ref; boundary_ref; evidence_purpose; consumer_scope; digest_summary
```

Metadata actor/trace, idempotency key, supplied request digest and requested time are excluded. `digest_summary` is included as a typed semantic snapshot, but the protocol never hashes or stores an evidence body.

| stage | exact contract |
|---|---|
| assembler | validate the finite request, require explicit `consumer_scope`, canonicalize its typed set/order, validate boundary shape and digest, then build the concrete input; no repository or resolver call is hidden in the entry |
| projection load | load the versioned `AuditProjection`; it must be `Appended` or visibility-restricted with a founded source fact |
| structural guard | call P4 `BodyFreeLinkagePolicy::validate(projection, boundary_ref, purpose, &consumer_scope, &digest_summary)`; `Ok(())` is only a structural pass, not `Linked` authorization |
| relation lookup | use `AuditEvidenceRepository::find_linkage_by_relation(projection_ref, boundary_ref, purpose, &consumer_scope)`; a duplicate relation with changed immutable fields is a consistency conflict |
| creation | if absent, allocate `EvidenceLinkageRef` and call `EvidenceLinkage::candidate(..., consumer_scope, digest_summary)`; no ref is minted on a failed guard |
| visibility decision | load the current boundary/safe digest and evaluate P5 `EvidenceVisibilityPolicy`; call `EvidenceLinkage::apply_visibility` with the complete target-bound decision |
| persistence | stage the linkage with expected version; if an owning projection linkage set transition is required, stage that projection CAS separately and preserve both borrows |
| H3 | `Linked`, `NotVisible`, `BodyBlocked` and `MarkedStale` transition branches map to the H3 linkage subject; linkage branches never use projection `AuditAppendKind::EvidenceLinkageAppended` as a shortcut |
| cursor/UoW | allocate one Observation cursor after all accepted mutations are known, construct H3 with same-UoW post-state and metadata, append it, then save stored result/follower material before commit |

If a resolver returns no usable typed boundary/digest, the operation is delayed or produces an explicit safe gap outcome before creating a candidate. It must not create an empty candidate and later infer `Linked` from a ref alone. If a candidate is created and policy cannot produce a legal transition, the service either rolls back the candidate or returns the explicitly modeled local blocked surface; it must not report a completed link without a corresponding state/record rule.

#### 8.6.4 Result and replay matrix

Minimum operation-specific result semantics are `projection_ref`, `linkage_ref` when created or already present, exact `consumer_scope`, `evidence_purpose`, committed `EvidenceLinkageState`, boundary identity, digest summary and exact H3/gap refs. The body owner remains `S08-COMMAND-RESULT-BODY-OWNER-01`.

| case | result behavior | durable side effect |
|---|---|---|
| `Linked` | stored accepted surface with `FreshlyCommitted` access | linkage/projection CAS as applicable, one H3 linkage record, stored result and any typed follower |
| `NotVisible` | stored safe restricted surface; no evidence body | H3 `NotVisible` branch only when the target-bound decision and transition are accepted |
| `BodyBlocked` | stored body-free blocked/quarantined surface with finite reason | H3 `BodyBlocked` branch; reason never contains body or provider text |
| exact duplicate | original surface with `Replayed` access | no second linkage, H3, outbox or current-boundary reconstruction |
| missing scope/boundary/digest | typed invalid/delayed result | no linkage identity, record or outbox |
| version/relation conflict | ephemeral conflict | rollback; do not return another consumer's linkage |
| commit unknown | `CommitOutcomeUnknown` | probe idempotency/stored relation; do not assume `Linked` or absent |

#### 8.6.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(LinkBodyFreeEvidence, authenticated actor, idempotency_key)`; request digest includes explicit scope and digest summary; same material replays, changed scope/boundary/digest conflicts |
| actor | authenticated actor only; external evidence owner/consumer actor is a relation field, not an authorization override |
| scope | `EvidenceConsumerScope` is required and must match purpose, boundary relation and any loaded handoff/consumer; no implicit all-observations scope |
| audit | one linkage transition maps to one H3 linkage record; a projection append and linkage lifecycle are separate records when both occur in distinct transitions |
| redaction | allow typed boundary ref, digest summary, purpose/scope, finite visibility/body-block reason and local refs only; forbid evidence body, URI/path, credentials, provider response, raw hash material and real alias |
| external truth | no external evidence call, mutation, acceptance, verdict or report delivery occurs in this Command |

#### 8.6.6 Step closure and protocol stop review

Step 06 owners are `EvidenceLinkage`, P4 `BodyFreeLinkagePolicy`, P5 visibility decision and H3 linkage record. Step 07 owners are the exact assembler/service methods, `AuditEvidenceRepository::stage_linkage`, `find_linkage_by_relation` and `append_audit_record`. The unique Step 09 reservation is `LinkBodyFreeEvidenceFlow`.

`C06` is `defined_with_affected_open`: the scope requirement is explicit and fail-closed, but the current upstream concrete input still lacks its only legal source. Result-body ownership also remains open. No evidence alias, body persistence or external acceptance is claimed.

### 8.7 C07 `PrepareReportHandoff`

#### 8.7.1 Purpose and truth boundary

`PrepareReportHandoff` freezes one body-free evidence-index input and prepares the local `ReportHandoffRecord` against a typed report consumer. It owns the local handoff/readiness lifecycle and H4 record. It does not generate a final report, verdict, signoff, external delivery receipt or real run identity.

| boundary | current rule |
|---|---|
| caller | `api` exact Command handler; actor is authenticated metadata |
| handler path | `ObservationApiInputAssembler::prepare_report_handoff` -> `ObservationTruthWriteService::prepare_report_handoff` |
| logical binding | `Command / PrepareReportHandoff` |
| owned target | append-once `EvidenceIndexInputView`, `ReportHandoffRecord`, optional attached local hint, H4 lifecycle record and stored result |
| non-owned truth | evidence/report body, destination locator, archive package, provider acceptance, final report/verdict/signoff |
| flow handoff | `PrepareReportHandoffFlow` |

`Ready` and `Prepared` are local policy/lifecycle states. They only establish that the observation-side input passed the current local gate. They do not authorize a provider call by themselves; external preparation/delivery remains a later phase with its own stable intent and retry accounting.

#### 8.7.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::prepare_report_handoff(
    request: ObservationCommandRequest<PrepareReportHandoffRequest>,
) -> Result<PrepareReportHandoffInput, ApplicationError>

ObservationTruthWriteService::prepare_report_handoff(
    input: PrepareReportHandoffInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

| body field | current type | source / validation | absence / conflict behavior |
|---|---|---|---|
| `handoff_scope_ref` | `ReportHandoffScopeRef` | typed scope selection | missing/unknown scope -> `InvalidReference`; scope is not decoded from an opaque string |
| `evidence_index_input` | `EvidenceIndexInputView` | one consistent, body-free snapshot assembled from validated refs and markers | assembler/service must not query current evidence to rebuild it; invalid visibility/content matrix -> `InvalidRequest` |
| `consumer_ref` | `ReportConsumerRef` | typed report-consumer catalog relation | missing/retired/incompatible consumer -> typed dependency or policy rejection |
| `visibility` | `Option<VisibilitySurface>` | bounded requested surface, if present | cannot assert `Visible`, `Ready` or delivery success |

The immutable input view must carry an exact `EvidenceConsumerScope` whose report consumer and purpose match this handoff. The current input row treats the view as supplied, but it does not fully state who mints `EvidenceIndexInputViewRef`. That authority, and the trusted boundary between preview and committed snapshot, remain registered as `S08-C07-IMMUTABLE-INPUT-REF-01`.

Current fail-closed rule: a wire caller cannot mint an arbitrary durable input ref, and the service cannot derive one from scope, digest, timestamp or product name. The accepted path must receive a validated view with an application-authorized ref, or the assembler returns an owner/authority error. No alias or compatibility wrapper is created while this affected item is open.

#### 8.7.3 Digest, append-once and handoff mapping

The command digest uses the immutable input's canonical body-free bytes and the explicit relation fields:

```text
handoff_scope_ref; evidence_index_input; consumer_ref; visibility
```

`EvidenceIndexInputViewRef` is part of the typed input material but is not re-minted or substituted by digest calculation. Actor/metadata trace, idempotency key, supplied digest and requested time are excluded.

| stage | exact contract |
|---|---|
| assembler | validate view factory invariants, visibility/content matrix, consumer-scope relation and digest candidates; no current repository scan or evidence reconstruction |
| input authority | application id generation/validated trusted input path owns the input ref; caller-provided raw ref is not sufficient |
| append-once | call `ReportHandoffRepository::append_evidence_index_input` before or together with handoff staging in the accepted UoW; input row is immutable after commit |
| duplicate input | same ref + identical canonical bytes + identical consumer/scope relation is an idempotent append/no-op inside the acquired logical operation |
| input conflict | same ref + different bytes, scope, purpose or relation is a whole-UoW consistency conflict; neither version is silently replaced |
| handoff creation | allocate `ReportHandoffRecordRef`, call `ReportHandoffRecord::draft(...)`, then load/derive complete P7 inputs from the committed-or-same-UoW input and current consumer |
| readiness | evaluate `HandoffReadinessPolicy`, then call `prepare` or `block` only with the exact target-bound decision; caller cannot submit `Ready`/`Prepared` as a state |
| H4 | a real handoff lifecycle transition maps to `HandoffLifecycleRecord::from_accepted` with same-UoW post-handoff and typed metadata; attaching a hint is a separate H4 branch |
| repository | `append_evidence_index_input`, `stage_handoff`, optional `stage_authenticity_hint` only for an explicit branch, allocate one Observation cursor, then `append_lifecycle_record` |
| transaction | input, handoff, H4, stored result, idempotency completion and any immutable follower commit or roll back together |

If the input is already committed, the repository does not append it again; the service uses the exact stored snapshot and relation guard. It never re-reads current linkages/gaps to produce a replacement snapshot. A later change makes the handoff/readiness stale or requires a new explicitly identified input, not an in-place mutation of the old input.

#### 8.7.4 Result, error and replay matrix

Minimum result semantics are `handoff_ref`, `evidence_index_input_ref`, `consumer_ref`, local handoff state, readiness, visibility, effective gap refs, optional authenticity hint ref and exact H4/outbox refs. The operation-specific body owner remains `S08-COMMAND-RESULT-BODY-OWNER-01`.

| case | result behavior | durable rule |
|---|---|---|
| prepared locally | stored accepted surface with `FreshlyCommitted` access | immutable input and handoff transition/H4 share one accepted UoW |
| blocked or insufficient local basis | typed stored blocked/rejected surface only when current application result contract allows it; no final report | H4 block branch may be written only for a real handoff transition |
| same request duplicate | original body and refs with `Replayed` access | no second input, handoff transition, H4 or outbox |
| same input ref, different content | typed conflict | rollback; do not overwrite append-once input |
| missing consumer/input/scope | `InvalidReference`/dependency classification | no synthetic handoff or input ref |
| resolver/policy unavailable before commit | delayed safe result | no claim of readiness or preparation |
| commit outcome unknown | `CommitOutcomeUnknown` | probe idempotency/input/handoff stored relation; do not claim prepared or absent |

#### 8.7.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(PrepareReportHandoff, authenticated actor, idempotency_key)`; digest includes the exact immutable input material and consumer/scope relation |
| actor | authenticated actor metadata only; report consumer is a target relation, not a trusted source actor or signoff authority |
| audit | every accepted handoff lifecycle transition has one H4 record; input append itself is immutable support material and is not confused with a final report record |
| redaction | input and result contain typed refs, state, visibility, freshness, gap and bounded summaries only; no report/evidence body, destination, credential, provider receipt, run id or alias |
| external phase | preparation/delivery token, provider call, retry and finalization are reserved for later flow/job design; this Command never calls the delivery port |
| no-write | the handoff can only create local observation projections and markers; it never writes report, archive, artifact or source truth |

#### 8.7.6 Step closure and protocol stop review

Step 06 owners are `EvidenceIndexInputView`, `ReportHandoffRecord` and P7 `HandoffReadinessPolicy`; Step 07 owners are `ReportHandoffRepository::append_evidence_index_input`, `stage_handoff`, `append_lifecycle_record` and the exact assembler/service methods. The unique Step 09 reservation is `PrepareReportHandoffFlow`.

`C07` is `defined_with_affected_open`: append-once semantics, same-UoW ordering, conflict behavior and no-final-report boundary are closed, but input-ref mint authority and operation-specific result-body ownership remain open. `R07-EXTERNAL-PHASE-LINK-01` remains a downstream affected item; no provider acceptance or delivery evidence is claimed.

### 8.8 C08 `EvaluateAuthenticityHint`

#### 8.8.1 Purpose and truth boundary

`EvaluateAuthenticityHint` evaluates a body-free handoff input using resolver-owned origin assessments and records an observation-side `AuthenticityHint`. It does not accept a caller-supplied authenticity conclusion. `TrustedBoundary` is a local hint state produced through the trusted resolver/policy path; it is not authenticity truth, evidence acceptance, a verdict, signoff or a real execution identity.

| boundary | current rule |
|---|---|
| caller | `api` exact Command handler; caller supplies only typed target refs and expected gap relation |
| handler path | `ObservationApiInputAssembler::evaluate_authenticity_hint` -> `ObservationTruthWriteService::evaluate_authenticity_hint` |
| logical binding | `Command / EvaluateAuthenticityHint` |
| owned target | `AuthenticityHint`, optional handoff hint relation and one H4 hint lifecycle record |
| non-owned truth | evidence body/origin truth, external authenticity verdict, evidence alias, provider acceptance, final report/signoff |
| flow handoff | `EvaluateAuthenticityHintFlow` |

#### 8.8.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::evaluate_authenticity_hint(
    request: ObservationCommandRequest<EvaluateAuthenticityHintRequest>,
) -> Result<EvaluateAuthenticityHintInput, ApplicationError>

ObservationTruthWriteService::evaluate_authenticity_hint(
    input: EvaluateAuthenticityHintInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

| body field | current type | source / validation | absence behavior |
|---|---|---|---|
| `handoff_ref` | `ReportHandoffRecordRef` | exact local handoff identity | missing/unknown/terminal handoff -> `InvalidReference` or policy rejection |
| `evidence_index_input_ref` | `EvidenceIndexInputViewRef` | exact immutable input bound to the loaded handoff | mismatch -> relation error; no hint is created |
| `gap_refs` | canonical `GapStateRefSet` after decoding a typed request set | caller provides expected relation only; application loads and verifies exact current gap rows | missing/extra/unsorted or cross-input refs -> typed relation error; no default empty set |

`evidence_origin: EvidenceOriginKind` from the old Step 06 input row is historical affected material and is intentionally absent from the current request. The caller cannot submit `TrustedBoundary`, `Placeholder` or `Insufficient`. The application must obtain `EvidenceOriginResolution` from `GovernanceArtifactEvidenceResolver::EvidenceSafeSummary.origin_resolution`, construct target-bound `EvidenceOriginAssessment` values, and let P6 create the `AuthenticityHintDecision`.

#### 8.8.3 Digest and resolver/policy mapping

The command digest material is:

```text
handoff_ref; evidence_index_input_ref; gap_refs
```

The resolver response, origin assessment snapshots, current handoff/input rows and policy basis are not caller-controlled request fields and are not substituted into the request digest. A new logical invocation can reevaluate current safe resolution; an exact retained duplicate replays its stored result without reevaluating or mutating.

| stage | exact contract |
|---|---|
| assembler | validate target refs and canonical gap set, verify operation/name and supplied digest, then construct input; no origin assertion or resolver call in entry |
| load | load handoff, its committed immutable input, all linkage/projection rows named by the input and the exact expected gap rows; verify handoff/input/consumer scope identity |
| hint identity | load the sole current hint by handoff; create a new `AuthenticityHintRef` only for an allowed new/reevaluation branch; terminal Real/Placeholder hint is not rewritten |
| resolver | call the exact body-free evidence resolver for each linkage; only a resolved `EvidenceSafeSummary` carries `EvidenceOriginResolution`; raw provider/body material is discarded inside the trust boundary |
| assessment | build `EvidenceOriginAssessment::from_resolver_mapping(linkage, resolution)` and an exact `EvidenceOriginAssessmentSet` matching the immutable input linkage set; `TrustedBoundary` requires the linkage/boundary/digest relation to pass |
| policy | P6 `AuthenticityHintPolicy::assess` consumes complete handoff/input/linkage/assessment/gap snapshots and returns `AuthenticityHintDecision`; it is not supplied by the caller |
| domain mutation | `AuthenticityHint::apply_decision(...)` applies the decision; exact replay returns `Ok(None)` and does not change evaluation time |
| repository/record | stage the hint, optionally stage the handoff's attached hint relation when the exact local transition requires it, allocate the Observation cursor, construct H4 hint record and append it, then store the result |

Resolver absence and resolver insufficiency are distinct. An unavailable resolver/adapter before an accepted local mutation maps to delayed/no-write. A resolver result carrying typed `Insufficient(...)` is valid policy input and can produce a local `Insufficient` hint. Neither branch creates a real authenticity claim.

#### 8.8.4 Result, error and replay matrix

Minimum result semantics are `handoff_ref`, `evidence_index_input_ref`, `hint_ref`, `AuthenticityHintState`, optional origin/reason, canonical gap refs and exact H4 refs. `evidence_origin` in this result is a policy-produced local hint field, not caller input; the result body owner remains `S08-COMMAND-RESULT-BODY-OWNER-01`.

| case | result behavior | durable rule |
|---|---|---|
| `ConfirmTrustedBoundary` | stored local `RealEvidenceLinked` hint surface | H4 hint transition records the policy-bound local state; no authenticity verdict |
| `MarkPlaceholder` | stored `PlaceholderDetected` with finite reason | H4 retains typed placeholder reason only; no evidence body or alias |
| `MarkInsufficient` | stored `Insufficient` with finite reason/gap set, when policy accepts the branch | H4 records the hint transition; unresolved gap remains explicit |
| exact duplicate | original hint/result surface with `Replayed` access | no resolver rerun, new hint transition, H4 or outbox |
| missing/mismatched input or handoff | typed invalid/relation error | no hint identity or record |
| resolver unavailable | delayed safe result | no local authenticity state is fabricated |
| policy/domain mismatch | typed application/domain error | zero mutation and no H4 |
| commit outcome unknown | `CommitOutcomeUnknown` | probe stored result/hint relation; do not claim any hint state |

#### 8.8.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(EvaluateAuthenticityHint, authenticated actor, idempotency_key)`; request digest excludes mutable resolver output and caller origin assertions |
| actor | authenticated actor metadata; resolver trust is established by the resolver boundary and source kind, not by a body actor field |
| audit | each changed hint transition maps to one H4 `HandoffLifecycleRecord`; exact replay has no second lifecycle row |
| redaction | retain typed origin enum/reason, handoff/input/linkage/gap refs and bounded policy basis; forbid evidence body, URI/path, provider message, raw hash, credentials, alias, real run id and verdict |
| no-write | this Command only writes the local hint/handoff audit projection; it cannot modify source evidence, report, artifact, governance or runtime truth |
| trusted-source gate | only the exact resolver result and `EvidenceOriginAssessment::from_resolver_mapping` may produce origin assessments; config/default/request/replay payload cannot upgrade `Insufficient` or `Placeholder` |

#### 8.8.6 Step closure and protocol stop review

Step 06 owners are `AuthenticityHint`, P6 `AuthenticityHintPolicy`, `EvidenceOriginResolution`, `EvidenceOriginAssessment` and H4 hint records. Step 07 owners are the exact assembler/service methods, resolver boundary, `ReportHandoffRepository::stage_authenticity_hint` and `append_lifecycle_record`. The unique Step 09 reservation is `EvaluateAuthenticityHintFlow`.

`C08` is `defined_with_affected_open`: caller-origin removal, resolver trust boundary and P6 target binding are current rules, but the old input table/use-site still needs affected repair and the operation-specific result body owner remains open. No authenticity truth, evidence alias, real run id, acceptance or signoff is claimed.

以下四节构成本文件当前的 S08-C C09-C12 批次。它们复用 S08-B shared carrier，
但分别保留自己的 request、target、field source、result presence、error、
idempotency、audit 和 Step 09 handoff；本批仍有开放 affected，不能标为无条件完成。

### 8.9 C09 `SetRetentionMarker`

#### 8.9.1 用途与 truth boundary

`SetRetentionMarker` 是 API 同步 Command，用于在 Observability-owned 的
`ProtectedObservationRef` 上建立或重新评估 retention marker。它只形成
`RetentionMarker`、可能关联的 `ActiveReferenceProtection` 变更、H5
`RetentionChangeRecord`、stored command result 和必要的本地 follower。

它不执行 cleanup、删除、归档 package 生成、source truth 写入或外部 consumer
生命周期操作。`ReleaseEligible` 是 observation-side 释放候选，不是删除授权；
当前阶段 `Released` marker transition 仍是 reserved，不能因请求包含
`release_reason` 就直接写成 `Released`。

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler；actor 只来自 `ObservationCommandMetadata.actor_ref` |
| logical binding | `Command / SetRetentionMarker` |
| application path | `ObservationApiInputAssembler::set_retention_marker` -> `ObservationTruthWriteService::set_retention_marker` |
| owned target | `RetentionMarker`；若已有或新建活动保护关系被 P8 重新协调，则同时拥有对应 protection post-state；H5 record 与 stored result 属于本地承接面 |
| non-owned truth | archive、source、business record、consumer product lifecycle、cleanup result、external acceptance |
| Step 09 reservation | `SetRetentionMarkerFlow` |

#### 8.9.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::set_retention_marker(
    request: ObservationCommandRequest<SetRetentionMarkerRequest>,
) -> Result<SetRetentionMarkerInput, ApplicationError>

ObservationTruthWriteService::set_retention_marker(
    input: SetRetentionMarkerInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

Command control fields remain in `ObservationCommandMetadata` and are not repeated
in the body:

```rust
pub struct SetRetentionMarkerRequest {
    pub protected_ref: ProtectedObservationRef,
    pub retention_purpose: RetentionPurpose,
    pub hold_reason: Option<RetentionHoldReason>,
    pub release_reason: Option<RetentionReleaseReason>,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `protected_ref` | typed observation-side target supplied by the validated request boundary | missing, malformed, or non-observation target rejects before reservation; no marker ref is minted |
| `retention_purpose` | finite `contracts::metadata` value | unknown token or purpose/target incompatibility rejects; no free-text retention duration |
| `hold_reason` | explicit typed request intent | `Some` is preserved in candidate material; it is not by itself proof of `ActiveHold` |
| `release_reason` | explicit typed request intent | `Some` is preserved in candidate material; it is not by itself proof of `ReleaseEligible` or `Released` |

The two optional reasons are independently encoded. Both `Some` is invalid before
request digest calculation. Both `None` is not silently converted to hold or release;
the service must let the loaded marker/protection snapshot and P8 determine whether
there is a legal policy transition or an explicit no-op/rejection branch.

#### 8.9.3 Digest and field-to-object mapping

The write digest material is ordered and presence-sensitive:

```text
protected_ref; retention_purpose; hold_reason; release_reason
```

Metadata actor, metadata trace, idempotency key, supplied digest and requested time
are excluded. The supplied `request_digest` is only compared with the locally derived
candidate and is discarded after verification.

| stage | exact mapping |
|---|---|
| assembler | validate finite operation/body binding, option exclusivity, nested reason tokens and body-free target; calculate candidates and verify supplied digest; do not read repository or config |
| marker lookup | use `RetentionGuardRepository::find_retention_by_protected_ref` or the exact marker lookup selected by the service; duplicate current rows or target mismatch are consistency failures |
| protection lookup | when marker relation or P8 requires protection, load the exact `ActiveReferenceProtection` and complete consumer snapshot; absence is an explicit `None`/unprotected observation, not permission to clean |
| policy order | evaluate/reconcile protection first with `RetentionProtectionPolicy`; only after the accepted protection post-snapshot is available may P8 construct and consume `RetentionMarkerDecision` |
| domain mutation | `ActiveReferenceProtection::apply_release_decision` and/or `RetentionMarker::apply_decision` are the only public policy-consuming mutation paths; direct state assignment and direct `Released` transition are forbidden |
| identity | application `IdGeneratorPort::new_retention_marker_ref` and, when needed, `new_retention_change_record_ref`; no generic ref or ref derived from target/digest/time |
| record | each accepted marker or protection transition maps to its own H5 `RetentionChangeRecord`; marker and protection records use distinct record refs |
| persistence | stage marker/protection with expected versions in one `ObservationUnitOfWork`; append H5 after the one observation cursor is assigned; stored result/idempotency completion joins the same accepted UoW |
| follower | only a current typed retention/protection follower may be staged; publisher later consumes an immutable stored snapshot and never rebuilds marker state |

If both protection and marker transitions are accepted, the result is two H5 records,
not one composite record. They share the accepted UoW cursor but retain separate
subjects, record identities, before/change/after revisions and policy basis. Any
factory, CAS, append, result or commit failure rolls back both object mutations and
both records.

#### 8.9.4 Result and duplicate matrix

The public response remains `ObservationCommandResponse<T>` over an operation-specific
body. Its unique owner is unresolved under `S08-COMMAND-RESULT-BODY-OWNER-01`; this
section fixes required semantics only.

Minimum body semantics are:

```text
protected_ref; marker_ref; marker_state; retention_purpose;
active_protection_ref; release_reason; conflict_reason;
accepted_retention_change_record_refs; changed_refs; outbox_refs; gap_refs
```

Optional fields retain explicit absence. A protection ref or record ref is present only
when the corresponding accepted UoW actually produced it.

| case | public/application result | durable rule |
|---|---|---|
| new marker accepted | stored `Accepted` with `FreshlyCommitted` access and exact marker/H5 refs | marker and any required protection reconciliation, records, followers, stored result and idempotency completion commit together |
| hold/release candidate evaluated to `ReleaseEligible` | stored local state surface with typed release reason | no cleanup or source deletion; H5 exists only for an accepted transition |
| policy conflict | stored `Blocked`/safe rejected surface only if a legal local transition is accepted; otherwise typed ephemeral policy rejection | no marker/protection identity or H5 is fabricated |
| exact duplicate | original immutable surface with `Replayed` access | no second marker mutation, protection mutation, H5 record, outbox or current-truth reconstruction |
| current version conflict | ephemeral `VersionConflict`/typed conflict | all staged local material rolls back; winning state is not returned as this request's result |
| missing dependency or malformed relation | typed invalid/dependency/consistency error | no cleanup fallback and no partial marker |
| commit outcome unknown | ephemeral `CommitOutcomeUnknown` | do not claim marker changed or unchanged; recovery probes idempotency/stored-result relation |

#### 8.9.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | logical scope is `(SetRetentionMarker, authenticated actor, idempotency_key)`; equal retained digest replays; changed purpose/reason/target conflicts; in-flight does not rerun P8 |
| actor | only authenticated metadata actor; reason enums cannot elevate actor authority |
| visibility | retention record visibility follows H5 owner ceiling; request does not select audit visibility or external publication |
| audit | accepted marker/protection transition maps to H5; no transition means no H5; protection and marker changes are never merged |
| redaction | allow typed refs, finite purpose/state/reason, consumer ref sets and bounded policy basis; forbid raw body, retention days as free text, archive package, URI/path, credential, provider response and signoff |
| no-write | no source cleanup, source repair, archive mutation, external delivery or business truth write is reachable |

#### 8.9.6 Step closure and affected status

Step 06 owners are `RetentionMarker`, `ActiveReferenceProtection`, P8
`RetentionProtectionPolicy`, `RetentionMarkerDecision`,
`ActiveProtectionReleaseDecision`, H5 `RetentionChangeRecord` and their typed refs.
Step 07 owners are the exact assembler/service methods,
`RetentionGuardRepository::{find_retention_by_protected_ref,get_retention_with_version,
get_active_protection_with_version,stage_retention,stage_active_protection,
append_retention_record}` as applicable, and the shared idempotency/stored-result
ports.

`C09` is `defined_with_affected_open`: the input, policy order, two-record possibility,
UoW boundary and no-cleanup redlines are closed. The operation-specific result body
owner remains open. No archive deletion, source truth mutation or acceptance claim is
made. The unique Step 09 handoff is `SetRetentionMarkerFlow`.

### 8.10 C10 `ProtectActiveReference`

#### 8.10.1 用途与 truth boundary

`ProtectActiveReference` establishes or strengthens an observation-owned active
consumer protection relation for one `ProtectedObservationRef`. It prevents a local
retention decision from treating an actively referenced observation as releasable.
It does not repair the consumer, delete material, modify consumer truth or declare
archive eligibility.

The primary transition is on `ActiveReferenceProtection`. A related marker may be
reconciled only through the explicit P8 relation and an independently accepted marker
transition. A marker and protection change never share one H5 record.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; actor from authenticated metadata |
| logical binding | `Command / ProtectActiveReference` |
| application path | `ObservationApiInputAssembler::protect_active_reference` -> `ObservationTruthWriteService::protect_active_reference` |
| owned target | `ActiveReferenceProtection`, optional compatible marker follower, H5 record(s), stored result |
| non-owned truth | consumer product state, source/business truth, cleanup/archive result, evidence body and external acceptance |
| Step 09 reservation | `ProtectActiveReferenceFlow` |

#### 8.10.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::protect_active_reference(
    request: ObservationCommandRequest<ProtectActiveReferenceRequest>,
) -> Result<ProtectActiveReferenceInput, ApplicationError>

ObservationTruthWriteService::protect_active_reference(
    input: ProtectActiveReferenceInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct ProtectActiveReferenceRequest {
    pub protected_ref: ProtectedObservationRef,
    pub consumer_ref: ObservationConsumerRef,
    pub protection_reason: ActiveReferenceReason,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `protected_ref` | typed observation-side protected target | target kind and protection scope must be compatible; no source/business identifier conversion |
| `consumer_ref` | typed observation consumer boundary | full consumer identity is required; it cannot be reduced to product name, route or actor |
| `protection_reason` | finite typed boundary reason | unknown token rejects; reason does not prove that the consumer is currently active outside this accepted local relation |

All three fields are required. There is no default consumer, inferred scope or
fallback to the marker's current consumer set.

#### 8.10.3 Digest and target mapping

```text
protected_ref; consumer_ref; protection_reason
```

The assembler validates and digests the complete structured consumer identity. It
does not query the current consumer product, resolve a route, or call an adapter.

| stage | exact mapping |
|---|---|
| lookup | load current protection by exact ref or protected target; duplicate current rows and target mismatch are consistency failures |
| marker relation | load the current marker when the protected target has one; do not infer a marker from absence or create a cleanup permission |
| domain create | if no relation exists, use `ActiveReferenceProtection::protect(protection_ref, protected_ref, protection_reason)` with a typed generated ref; initial state is `Unprotected` and consumer set is empty |
| domain attach | call `attach_consumer(consumer_ref)`; exact existing consumer attachment is an idempotent no-op, while a changed immutable relation is a conflict |
| reconciliation | if policy requires a marker/protection relation update, use P8 complete snapshots and independently stage the accepted post-state; never directly mutate `consumer_refs` or marker relation fields |
| identity | `IdGeneratorPort::new_active_reference_protection_ref` for a new relation and `new_retention_change_record_ref` per accepted H5 record |
| record | the accepted protection transition maps to one H5 ActiveProtection branch; an independently accepted marker transition maps to a second H5 Marker branch |
| persistence | `stage_active_protection` and any marker stage share the accepted UoW; append typed H5 records after the single observation cursor is assigned |

`ProtectionConsumerAttached` is a real H5 transition only when a previously absent
consumer is attached. An exact duplicate returns the stored original surface without
another record. An empty active set never means that a historical consumer did not
exist; historical relations belong to H5, not the mutable current set.

#### 8.10.4 Result and duplicate matrix

Minimum operation-specific result semantics are:

```text
protected_ref; protection_ref; protection_state; consumer_refs;
protection_reason; optional marker_ref/marker_state;
accepted_retention_change_record_refs; changed_refs; outbox_refs; gap_refs
```

| case | public/application result | durable rule |
|---|---|---|
| new protection + consumer attached | stored `Accepted`/`FreshlyCommitted` | protection post-state, H5 record, followers, stored result and idempotency completion share one UoW |
| existing protection, new consumer | stored accepted surface with exact updated set | one H5 protection record; no record for an unrelated marker unless its transition is independently accepted |
| exact duplicate consumer | original stored surface with `Replayed` or committed no-op surface | no second attach, H5, outbox or current consumer lookup reconstruction |
| protection conflict | typed policy/conflict result; durable `Conflicted` only if the domain transition is accepted | conflict never clears consumers or authorizes release |
| missing protected object/marker relation | typed `InvalidReference`/`TargetNotFound`/consistency error | no protection ref or H5 is fabricated |
| version/CAS conflict | ephemeral `VersionConflict` | rollback all staged relation changes |
| commit unknown | `CommitOutcomeUnknown` | probe idempotency/stored result; do not claim consumer attached or absent |

The result body owner is still the shared affected item
`S08-COMMAND-RESULT-BODY-OWNER-01`; Step 08 does not introduce
`ActiveReferenceProtectionCommandResult`.

#### 8.10.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(ProtectActiveReference, authenticated actor, idempotency_key)`; digest includes complete consumer ref; changed reason or target conflicts |
| actor | authenticated actor only; `consumer_ref` identifies a boundary, not an authorization actor |
| audit | one accepted protection transition -> one H5 record; marker transition, if any, is separately represented |
| redaction | retain typed protected/consumer refs, finite state/reason and bounded relation snapshots; forbid consumer payload, URI/path, credentials, provider response and source body |
| no-write | no consumer mutation, cleanup, archive package change, source repair or external call |

#### 8.10.6 Step closure and affected status

Step 06 owners are `ActiveReferenceProtection`, P8 protection decision and H5
`RetentionChangeRecord`. Step 07 owners are the exact assembler/service methods,
retention/protection repository lookup and stage methods, H5 append method and shared
stored-result/idempotency ports.

`C10` is `defined_with_affected_open`: its exact body, consumer-set semantics,
idempotency, H5 mapping and no-cleanup boundary are defined; result-body ownership
and downstream UoW/flow propagation remain open. The unique Step 09 handoff is
`ProtectActiveReferenceFlow`.

### 8.11 C11 `DefineReplayScope`

#### 8.11.1 用途与 truth boundary

`DefineReplayScope` defines and evaluates a bounded observation-only replay scope. It
may create or transition `ReplayScope` through `Defined`, `Approved` or `Blocked`
according to the target-bound P9/P10 decision. It does not execute replay, mutate a
source/business truth, choose a target implicitly, or create a per-target execution
record.

The current H13 rule is explicit: `ReplayScopeTransition` has
`explicit_no_record` status under `R06.6-F2-H13-UPSTREAM`. Only the
`CoordinateObservationReplay` Operations Job can append an H13
`ReplayExecutionRecord`, and only after it has an Approved scope plus exact
coordination, target and transition input.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; actor from authenticated metadata |
| logical binding | `Command / DefineReplayScope` |
| application path | `ObservationApiInputAssembler::define_replay_scope` -> `ObservationTruthWriteService::define_replay_scope` |
| owned target | `ReplayScope`, scope-local state/marker and stored result; optional typed local follower only if a current owner requires it |
| non-owned truth | replay execution, source repair, business truth, H13 execution history, external run identity and adapter result |
| Step 09 reservation | `DefineReplayScopeFlow` |

#### 8.11.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::define_replay_scope(
    request: ObservationCommandRequest<DefineReplayScopeRequest>,
) -> Result<DefineReplayScopeInput, ApplicationError>

ObservationTruthWriteService::define_replay_scope(
    input: DefineReplayScopeInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct DefineReplayScopeRequest {
    pub target_refs: ReplayTargetRefSet,
    pub allowed_effect: ReplayAllowedEffect,
    pub boundary_constraint_ref: NoWriteTriggerContextRef,
    pub replay_purpose: ReplayPurpose,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `target_refs` | canonical `ReplayTargetRefSet` | must be non-empty, sorted/unique under owner codec, bounded and observation-side; permutation, duplicate or source-repair member rejects |
| `allowed_effect` | finite allowlisted replay effect | target/effect pair must be one of the P9 allowlist; no source-write or external-truth effect exists |
| `boundary_constraint_ref` | typed no-write trigger context | required and exact; it is not a boolean pass, not a forbidden target, and not an H13 ref |
| `replay_purpose` | finite purpose | unknown or target/effect-incompatible purpose rejects; no free-text job or route selector |

#### 8.11.3 Digest, P9/P10 mapping and zero-H13 rule

```text
target_refs(canonical set bytes); allowed_effect;
boundary_constraint_ref; replay_purpose
```

The request digest includes the complete canonical target set. Metadata actor, trace,
idempotency key, supplied digest and requested time are excluded.

| stage | exact mapping |
|---|---|
| assembler | validate operation/body binding, canonical set, bounded target/effect relation and boundary ref; verify supplied digest; no replay execution or adapter call |
| scope identity | call `IdGeneratorPort::new_replay_scope_ref` only after local validation; identity is not derived from target bytes, purpose or digest |
| domain factory | `ReplayScope::define(scope_ref, target_refs, allowed_effect, no_write_guard_scope)` creates `Defined`; empty or incompatible target sets never create a scope |
| target-bound lookup | load retention/protection/no-write boundary snapshots for every exact target; one representative/global snapshot cannot approve a multi-target scope |
| P10 | evaluate the exact trigger/effect/target relation with `NoWriteGuardPolicy`; local `Blocked` is a normal guard outcome and does not create a violation or H6 by itself |
| P9 | evaluate `ReplayBoundaryPolicy` over complete scope/per-target snapshots; `ReplayScope::apply_boundary_decision` is the only public policy-consuming mutation path |
| persistence | stage the scope with expected version; no H13 factory, no `append_replay_execution_record`, no target inference and no scope-wide execution row |
| result | save the exact stored result and any current typed follower in the accepted local UoW; publication never reconstructs a scope from current truth |

`Approved` is only a policy-bound state. It does not mean replay has started. A later
Job must reload the versioned Approved scope, verify target membership/effect and then
create per-target coordination state. C11 must not mint `ReplayExecutionRecordRef`.

#### 8.11.4 Result and duplicate matrix

Minimum operation-specific result semantics are:

```text
scope_ref; canonical target_refs; allowed_effect; replay_purpose;
boundary_constraint_ref; scope_state; optional block_reason;
changed_refs; outbox_refs; gap_refs; no H13 record/ref
```

| case | public/application result | durable rule |
|---|---|---|
| scope defined and approved | stored `Accepted`/`FreshlyCommitted` | only `ReplayScope` and allowed local followers commit; no H13 |
| scope blocked by P9/P10 | stored safe `Blocked` surface only when the blocked scope transition is accepted | block reason is typed; no execution, H13 or source write |
| exact duplicate | original immutable surface with `Replayed` access | no scope replacement, target expansion, H13 or current boundary rebuild |
| changed target/effect/constraint under same key | ephemeral `IdempotencyConflict` or typed boundary conflict | no winner scope returned and no mutation |
| missing/stale target boundary | typed dependency/consistency/policy error | no Approved state or execution identity fabricated |
| commit unknown | `CommitOutcomeUnknown` | probe idempotency/stored scope relation; do not assume Approved, Blocked or absent |

No result branch may contain a `ReplayExecutionRecordRef`, per-target execution
receipt, external run id or source-repair verdict. The operation-specific result body
owner remains `S08-COMMAND-RESULT-BODY-OWNER-01`.

#### 8.11.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(DefineReplayScope, authenticated actor, idempotency_key)`; canonical target permutation has one digest; changed membership/effect/boundary conflicts |
| actor | authenticated actor only; an operator actor does not bypass P9/P10 or target membership |
| audit | current scope transition is explicitly no-record under the H13 blocker; any local typed follower must be separately named by its owner, never relabeled H13 |
| redaction | retain typed scope/target/effect/guard/purpose/state/reason; forbid source body, repair instruction, adapter payload, endpoint, credentials, external run id and execution receipt |
| no-write | all target effects are observation-side derived effects; source/external truth write is structurally forbidden |

#### 8.11.6 Step closure and blocker status

Step 06 owners are `ReplayScope`, P9 `ReplayBoundaryPolicy`, P10
`NoWriteGuardPolicy`, `ReplayApprovalSnapshot`, `NoWriteGuardDecision` and typed
boundary refs. Step 07 owners are the exact assembler/service methods,
`RetentionGuardRepository::{get_replay_scope_with_version,stage_replay_scope}` and
the exact boundary lookup ports.

`C11` is `defined_with_affected_open`: request, canonical target set, P9/P10 binding,
zero-H13 boundary and replay result semantics are closed. It remains affected by
`R06.6-F2-H13-UPSTREAM`; formal `02` still contains the conflicting scope-to-H13
mapping. The unique Step 09 handoff is `DefineReplayScopeFlow`. No replay execution
is claimed.

### 8.12 C12 `RecordNoWriteViolation`

#### 8.12.1 用途与 truth boundary

`RecordNoWriteViolation` records and blocks a newly detected attempted write outside
the Observability-owned boundary. It is a local fail-closed Command: the forbidden
adapter/source write must not be performed before or after the violation is staged.
The public contract is deliberately limited to creating a new
`NoWriteViolation::Detected` object and accepting its `Detected -> Blocked`
transition. It does not accept an existing `violation_ref`; escalation and closure
of an existing violation remain a separately defined internal lane and cannot be
inferred from this request.

The initial detection object does not itself create H6. H6 begins at an accepted
violation transition. `stage_no_write_violation` runs before cursor assignment;
`append_no_write_violation_record` runs after the F2 batch/cursor exists. The
historical composite `save_no_write_violation(violation, record, ...)` is forbidden.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; an internal guard may separately use the domain lane, but is not this public protocol |
| logical binding | `Command / RecordNoWriteViolation` |
| application path | `ObservationApiInputAssembler::record_no_write_violation` -> `ObservationTruthWriteService::record_no_write_violation` |
| owned target | `NoWriteViolation`, H6 `NoWriteViolationRecord`, stored result and any typed local diagnostic follower |
| non-owned truth | attempted payload/body, source/external repair, compensation result, adapter response, incident acceptance or business truth |
| Step 09 reservation | `RecordNoWriteViolationFlow` |

#### 8.12.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::record_no_write_violation(
    request: ObservationCommandRequest<RecordNoWriteViolationRequest>,
) -> Result<RecordNoWriteViolationInput, ApplicationError>

ObservationTruthWriteService::record_no_write_violation(
    input: RecordNoWriteViolationInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct RecordNoWriteViolationRequest {
    pub trigger_context_ref: NoWriteTriggerContextRef,
    pub attempted_write_target: ForbiddenWriteTargetRef,
    pub violation_reason: NoWriteViolationReason,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `trigger_context_ref` | body-free application guard context | required; it cannot carry command body, SQL, endpoint, payload or credential |
| `attempted_write_target` | typed `SourceTruth` or `ExternalTruth` forbidden target | required; local observation targets are not encoded as forbidden external/source targets |
| `violation_reason` | intended finite reason for the accepted request | required and must not be dropped; current Step 06 has no unique owner/variant/wire contract, so unresolved reason material fails closed under `S08-C12-VIOLATION-REASON-OWNER-01` |

`NoWriteViolationReason` must not be replaced by `NoWriteViolationRecordReason`:
the latter describes H6 `Escalated`/`Closed` record branches and has no `Blocked`
variant, while this request is accepted at the violation-entry boundary. Until the
owner is repaired, the assembler cannot silently omit, stringify or fold the reason
into the trigger context.

#### 8.12.3 Digest and staged UoW mapping

```text
trigger_context_ref; attempted_write_target; violation_reason
```

Metadata actor, trace, idempotency key, supplied digest and requested time are
excluded. No attempted body or body hash is included.

| stage | exact mapping |
|---|---|
| assembler | validate exact typed operation/body, target kind, trigger scope and current reason owner; verify supplied digest; on unresolved reason return before service/reservation |
| guard ordering | ensure the no-write guard blocks before any source/external adapter invocation; a P10 local `Blocked` without a forbidden target/violation identity is not converted into H6 |
| identity/factory | for a new violation, mint `NoWriteViolationRef` with `IdGeneratorPort::new_no_write_violation_ref`, then call `NoWriteViolation::detect`; no violation identity is derived from payload, target or digest |
| domain transition | call the owning new-violation `block` transition; existing `escalate`/`close` transitions are outside this public contract and must not be inferred |
| pre-cursor stage | call `RetentionGuardRepository::stage_no_write_violation(&violation, expected_version, uow)` before cursor assignment; initial Detected-only creation may have no H6 obligation |
| cursor and record | for an accepted transition, allocate one Observation cursor, mint `NoWriteViolationRecordRef`, construct H6 from `NoWriteViolationTransition` plus same-UoW post-state, then call `append_no_write_violation_record` |
| result/followers | stage stored result, idempotency completion and any typed diagnostic follower in the same accepted UoW; no composite violation/record save helper exists |
| failure | any stage/factory/append/CAS/commit failure rolls back violation, H6, followers, stored result and idempotency completion; the forbidden write remains unperformed |

The H6 `Blocked` record has no free-form reason in its current total matrix. The
request reason, once its owner is repaired, must have an explicit lossless mapping to
the accepted input or trigger context; it cannot be silently copied into H6's
`NoWriteViolationRecordReason`.

#### 8.12.4 Result and duplicate matrix

Minimum operation-specific result semantics are:

```text
violation_ref; trigger_context_ref; attempted_write_target;
violation_state; no_write_violation_record_ref;
changed_refs; outbox_refs; gap_refs; safe error/handling marker
```

`no_write_violation_record_ref` is present only after an accepted lifecycle
transition has produced H6. A Detected-only local object cannot claim an H6 record.

| case | public/application result | durable rule |
|---|---|---|
| new attempt blocked | stored `Accepted`/`FreshlyCommitted` surface after violation + H6 commit | violation staging precedes cursor; H6 append follows cursor; all writes are one UoW |
| existing violation lifecycle action requested | typed unsupported/invalid request | no existing violation identity is accepted or inferred; no transition, H6 record or source action |
| exact duplicate | original stored surface with `Replayed` access | no second violation transition, H6 record, outbox or current-state reconstruction |
| unresolved reason owner | typed protocol/application failure before reservation | no violation identity, adapter call or H6 record |
| local guard blocked without a forbidden target identity | typed blocked/no-write guard result without H6 | do not fabricate `ForbiddenWriteTargetRef` or violation ref |
| target/trigger mismatch | `InvalidReference`/`NoWriteGuardViolation` typed error | zero mutation and zero adapter call |
| commit outcome unknown | `CommitOutcomeUnknown` | probe idempotency/stored relation; do not claim blocked record was committed or absent |

The operation-specific result body remains affected by
`S08-COMMAND-RESULT-BODY-OWNER-01`; Step 08 does not define a
`NoWriteViolationCommandResult` type.

#### 8.12.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(RecordNoWriteViolation, authenticated actor, idempotency_key)`; exact typed reason/trigger/target changes conflict; in-flight never repeats a forbidden attempt |
| actor | authenticated actor metadata; attempted target or trigger context cannot authorize a write |
| audit | the accepted public `Detected -> Blocked` transition maps to one H6 record; initial detection alone does not. Other H6 lifecycle transitions remain outside this Command |
| redaction | retain typed trigger/target/reason/state/record refs and bounded internal visibility; forbid attempted body, SQL, endpoint, path, credential, provider response, source-repaired claim and compensation result |
| no-write | adapter/source write count must remain zero on every validation, conflict, duplicate, failure and accepted-block path |

#### 8.12.6 Step closure and affected status

Step 06 owners are `NoWriteViolation`, P10 `NoWriteGuardPolicy`,
`NoWriteViolationTransition`, H6 `NoWriteViolationRecord` and typed trigger/target
refs. Step 07 owners are the exact assembler/service methods,
`RetentionGuardRepository::{get_no_write_violation_with_version,
stage_no_write_violation,append_no_write_violation_record}`, typed ID generation,
cursor/UoW and stored-result ports.

`C12` is `defined_with_affected_open` for two independent reasons: the shared result
body owner remains open, and `NoWriteViolationReason` has no unique current owner.
The two-stage no-write/H6 order and no-adapter-call boundary are nevertheless fixed.
The unique Step 09 handoff is `RecordNoWriteViolationFlow`.

### 8.13 C09-C12 batch stop review

| check | conclusion |
|---|---|
| four protocols have independent signature/body/source/result/error/idempotency/audit sections | pass |
| C09 protection-before-marker order and two-H5 possibility | pass; no merged record |
| C10 consumer identity and active-set semantics | pass; no inferred consumer/product truth |
| C11 target/effect canonicality and zero-H13 rule | pass; existing `R06.6-F2-H13-UPSTREAM` remains open |
| C12 violation staging/H6 append split | pass; pre-cursor stage and post-cursor append are separate |
| C12 reason owner | affected; `S08-C12-VIOLATION-REASON-OWNER-01` newly registered |
| result body owner | affected; inherited `S08-COMMAND-RESULT-BODY-OWNER-01` |
| formal `03`, Step 09, `04`, implementation | unchanged/frozen |
| batch status | `C09-C12 defined_with_affected_open`; count `12/60`, unconditional complete `0/60` |
| next action | stop review and wait for explicit user confirmation before C13-C16 |

The C09-C12 checkpoint above is retained as the previous accepted stop record. The
user subsequently authorized only the final Command batch. The following four
sections are the current C13-C16 write and do not authorize Query, Consumer, Event,
Job, Step 09, formal-document, configuration, or implementation work.

### 8.14 C13 `RecordGapState`

#### 8.14.1 用途与 truth boundary

`RecordGapState` classifies one already identified body-free observation gap source
against one exact affected observation-owned object. It may open a new `GapState`
from P12 and may create or replace a P13-derived immutable `DegradedOutputState`
revision. The two objects keep separate identities and accepted-input proofs; a gap
does not become a degraded revision and a degraded revision does not repair, close,
or reclassify its source.

The caller supplies selectors only. It cannot submit `GapKind`, degraded reason,
block reason, limited-consumption permission, safety/visibility signals, P11/P12/P13
decisions, or a source-repaired assertion. `affected_object_ref` is not membership
proof: application must load a typed source-to-affected relation before P12.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; actor comes only from `ObservationCommandMetadata.actor_ref` |
| logical binding | `Command / RecordGapState` |
| application path | `ObservationApiInputAssembler::record_gap_state` -> `ObservationTruthWriteService::record_gap_state` |
| owned target | optional new `GapState`; optional immutable `DegradedOutputState` revision; corresponding H8 branches, stored result and typed local followers |
| non-owned truth | source state repair, external reference lifecycle, raw error/provider text, business correctness, report verdict or signoff |
| Step 09 reservation | `RecordGapStateFlow` |

#### 8.14.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::record_gap_state(
    request: ObservationCommandRequest<RecordGapStateRequest>,
) -> Result<RecordGapStateInput, ApplicationError>

ObservationTruthWriteService::record_gap_state(
    input: RecordGapStateInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct RecordGapStateRequest {
    pub source_ref: GapSourceRef,
    pub affected_object_ref: AffectedObservationObjectRef,
    pub visibility_scope_ref: VisibilityScopeRef,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `source_ref` | body-free upstream/local observation reference already admitted by its owner | required; malformed or unknown source kind rejects before reservation; source body/error text cannot substitute |
| `affected_object_ref` | caller selector for one observation-owned target | required but non-authoritative; typed dependency lookup must prove this exact source affects this exact object |
| `visibility_scope_ref` | validated body-free consumer/read scope selector | required; it selects the P11/P13 scope but does not grant visibility or authorization |

The corrected digest material is presence-free and ordered:

```text
source_ref; affected_object_ref; visibility_scope_ref
```

Historical `gap_kind`, `degraded_reason`, and `limited_consumption_allowed` digest
members are forbidden policy outcomes. They remain affected material under
`S08-C13-GAP-REQUEST-AUTHORITY-01` and cannot be retained for compatibility.

#### 8.14.3 Loaded facts, policy order and staged UoW

| stage | exact mapping |
|---|---|
| assembler | validate exact operation/body, typed refs and corrected digest; do not query repositories or construct P12/P13 inputs |
| relation lookup | load a typed source-to-affected dependency and reject absent, ambiguous, stale or cross-object relations; entry-supplied equality is never proof |
| P12 input | load exact source state plus required reference, visibility and safety signals; construct `GapSourceAffectedBinding` and `GapClassificationBasis`; evaluate P12 |
| P12 `NoGap` | return a typed no-new-gap branch; do not mint gap/degraded/H8 identity and do not convert no-write/retention blocking into a gap |
| P12 `Classified` | resolve the current nonterminal gap for the exact source and affected object; a new gap uses `new_gap_state_ref` and `GapState::open_from_decision`, retaining `GapOpened` |
| existing gap | exact same source/affected/kind is duplicate/no-new-gap; a changed kind or changed affected relation has no accepted replacement contract and fails closed |
| P11/P13 input | load the complete read target, safety disposition, visibility decision and current gap revisions for `affected_object_ref + visibility_scope_ref`; caller fields cannot fill any missing component |
| degraded revision | P13 decides Normal/Limited/Blocked. New revision uses `new_degraded_output_ref` plus `create_from_decision`; replacement uses a distinct ref plus `replace_from_decision`; exact replay is `Ok(None)` |
| gap mitigation | only a durable degraded revision carrying the exact `gap_ref` may call `gap.mitigate(&degraded)`; this direct lifecycle transition is independent from the degraded H8 branch |
| persistence | stage gap before cursor assignment and append each new degraded revision; assign one Observation cursor; build one H8 per accepted proof/transition; append records, followers, stored result and idempotency completion in one UoW |

One accepted request may therefore produce an H8 `Opened`, an H8
`DegradedOutputCreated/Replaced`, and an H8 `Mitigated` record. These are separate
record identities sharing one commit cursor; they are not merged into one composite
history row. A gapless P13 revision is explicit no-H8 even when durable.

Four Step 06/07 joins remain affected: the public input/digest authority, the missing
source-to-affected lookup, `find_current_gap_by_source` being keyed only by source
while P12 binds source+affected, and the missing unique source for complete P11/P13
target-bound inputs. The service must fail closed at the relevant join; it cannot
claim a degraded revision is always possible.

#### 8.14.4 Result and duplicate matrix

Minimum operation-specific body semantics are:

```text
source_ref; affected_object_ref; visibility_scope_ref;
gap_classification_outcome; gap_ref; gap_state; gap_kind;
degraded_ref; degraded_state; limited_consumption_allowed;
gap_transition_record_refs; changed_refs; outbox_refs; gap_refs
```

The body owner remains open under `S08-COMMAND-RESULT-BODY-OWNER-01`; these are
required semantics, not a new Step 08 result type.

| case | public/application result | durable rule |
|---|---|---|
| P12 `NoGap` | stored accepted no-new-gap surface only when the Command contract intentionally stores the outcome | no gap/degraded/H8 identity; no source-success assertion |
| new gap only | stored accepted surface with new gap and exact H8 `Opened` ref | gap, H8, stored result and idempotency completion commit together |
| gap plus degraded revision | stored accepted surface with every separate gap/degraded/mitigation record ref | all accepted branches commit atomically or all roll back |
| exact current classification/revision duplicate | original stored surface with `Replayed` access or explicit no-op result selected before new identity consumption | no second gap, degraded revision, H8 or outbox |
| changed classification without owner contract | typed conflict/unsupported transition | current row remains unchanged; no replacement inferred |
| relation/input lookup absent or ambiguous | typed dependency/consistency error | zero identity, mutation, record and source action |
| commit outcome unknown | `CommitOutcomeUnknown` | probe idempotency/stored relation; do not report the gap as present or absent from this attempt |

#### 8.14.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(RecordGapState, authenticated actor, idempotency_key)`; source/affected/scope changes conflict; in-flight never reruns policy or consumes a second identity |
| actor | authenticated metadata actor only; source/ref/scope cannot elevate authority |
| audit | H8 exists only from `GapOpened`, exact gap transition, `DegradedOutputCreated` or replacement transition; no decision/no-op/current lookup alone is history |
| redaction | retain typed refs, finite kind/state/reason, policy basis refs and bounded visibility; forbid source/provider body, error text, URI/path, credential, external lifecycle, repair/verdict/signoff |
| no-write | every path writes only observation-owned gap/degraded/history/result/follower material; source/business/external adapter write count remains zero |

#### 8.14.6 Step closure and affected status

Step 06 owners are P11/P12/P13, `GapState`, `DegradedOutputState`, `GapOpened`,
`DegradedOutputCreated`, their transitions and H8. Step 07 owners are the exact
assembler/service methods, `RetentionGuardRepository::{get_gap_with_version,
find_current_gap_by_source,stage_gap,stage_new_degraded_output_revision,
append_gap_record}`, projection/read lookups, typed IDs, UoW and stored-result ports.

`C13` is `defined_with_affected_open`. The request authority, policy ordering,
multi-H8/no-record matrix and no-source-repair boundary are fixed. Open internal
affected items are `S08-C13-GAP-REQUEST-AUTHORITY-01`,
`S08-C13-SOURCE-AFFECTED-LOOKUP-01`, `S08-C13-CURRENT-GAP-KEY-01` and
`S08-C13-DEGRADED-INPUT-SOURCE-01`, plus the shared result body owner. The unique
Step 09 handoff is `RecordGapStateFlow`.

### 8.15 C14 `PrepareExternalAuditExport`

#### 8.15.1 用途与 truth boundary

`PrepareExternalAuditExport` creates or advances one local
`ExternalAuditExportPreparation` for one exact immutable body-free evidence-input
identity, an existing `DashboardAlertExportView`, the exact peripheral consumer and
P14. When exact lookup yields a committed input snapshot, that snapshot is the
evidence authority; exact absence is represented only by P14 `PendingEvidence`, while
lookup failure is never absence. The Command ends at local
Draft/PendingEvidence/Prepared/Blocked state. It does not create
`PeripheralDeliveryState`, prepare an external package, select an endpoint, invoke
an adapter, or claim external audit acceptance, delivery, verdict or signoff.

The canonical projection scope is loaded from `DashboardAlertExportView.scope`.
There is no current owner for historical `ExternalAuditExportScopeRef`, so the
caller cannot submit a second scope or final visibility/readiness/gap outcome.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; local actor from Command metadata |
| logical binding | `Command / PrepareExternalAuditExport`; typed family keeps it distinct from the same-named J08 Delivery Job |
| application path | `ObservationApiInputAssembler::prepare_external_audit_export` -> `ObservationTruthWriteService::prepare_external_audit_export` |
| owned target | `ExternalAuditExportPreparation`, accepted H9 preparation branch, stored result and typed local follower |
| non-owned truth | peripheral delivery attempt, package/endpoint/credential/provider receipt, external audit product state, acceptance, verdict or signoff |
| Step 09 reservation | `PrepareExternalAuditExportFlow` |

#### 8.15.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::prepare_external_audit_export(
    request: ObservationCommandRequest<PrepareExternalAuditExportRequest>,
) -> Result<PrepareExternalAuditExportInput, ApplicationError>

ObservationTruthWriteService::prepare_external_audit_export(
    input: PrepareExternalAuditExportInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct PrepareExternalAuditExportRequest {
    pub consumer_ref: PeripheralConsumerRef,
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,
    pub export_view_ref: DashboardAlertExportViewRef,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `consumer_ref` | validated product-neutral peripheral consumer catalog identity | required; retired/blocked/denied state is loaded for P14, not encoded in this ref |
| `evidence_index_input_ref` | identity of an immutable body-free evidence index input | required; exact committed lookup may return typed absence/Pending, while lookup failure is not Pending |
| `export_view_ref` | existing generated peripheral projection identity | required; application loads the view and obtains its canonical consumer and `ObservationProjectionScope` |

Corrected digest material is:

```text
consumer_ref; evidence_index_input_ref; export_view_ref
```

It excludes historical `export_scope_ref` and caller-selected `visibility`. The
loaded view's scope/visibility/freshness are trusted committed facts and are not
rehashable caller assertions.

#### 8.15.3 Loaded facts, P14 and staged UoW

| stage | exact mapping |
|---|---|
| assembler | validate exact typed body and corrected digest; do not load current view/input or construct P14 decision |
| view/input relation | load `get_peripheral_export_view_by_ref`, then complete exact `get_evidence_index_input` lookup. The view consumer must equal request consumer. `Some(committed input)` must match expected ref, purpose `ExternalAuditPreparation`, peripheral consumer and view scope; exact `None` is retained as the P14 Pending boundary; lookup error or malformed/cross-relation `Some` is an error |
| complete boundary | construct `ExportEvidenceInputBoundarySnapshot::from_lookup_result` only after the exact lookup above; load consumer state/export flag, view freshness/visibility, exact gap revisions, retention marker/protection and P10 `ExportPreparation + PrepareBodyFreeHandoff` input without fabricating committed-input fields for `None` |
| identity/factory | resolve an exact current preparation relation when one exists; otherwise mint `new_external_audit_export_preparation_ref` and call `ExternalAuditExportPreparation::draft`; initial Draft is explicit no-H9 |
| policy | construct `ExportPreparationInputSnapshot`, evaluate P14 `evaluate_preparation`, then call `apply_decision` with the same complete snapshot |
| transition | accepted PendingEvidence/Ready/Degraded/Blocked replacement returns `Some(ExportPreparationTransition)` and maps to one H9 `PreparationDecision`; exact `Ok(None)` is no-record |
| persistence | stage only the local preparation before cursor assignment; allocate one Observation cursor; append H9 if present, then followers/stored result/idempotency completion in one UoW |
| external phase | no `PeripheralDeliveryState`, external token/intent, package, adapter invocation or provider result is reachable from this Command |

Step 07 currently has `get_export_preparation_with_version` but no uniquely named
lookup that resolves the current preparation by the complete
consumer/input/view relation. The exact create-or-load owner and ambiguity behavior
remain part of `S08-C14-PREPARATION-INPUT-SOURCE-01`; absence cannot silently create
parallel current preparations.

#### 8.15.4 Result and duplicate matrix

Minimum result body semantics are:

```text
preparation_ref; consumer_ref; evidence_index_input_ref; export_view_ref;
projection_scope: ObservationProjectionScope; preparation_state; readiness;
visibility; gap_refs; block_reason;
peripheral_delivery_record_ref; changed_refs; outbox_refs
```

`projection_scope` is copied from the loaded `DashboardAlertExportView.scope`.
Historical result wording named `export_scope` would reintroduce an ownerless export
scope concept and is therefore forbidden even while
`S08-C14-EXPORT-SCOPE-OWNER-01` remains open for the affected Step 06 input/digest
rows.

`peripheral_delivery_record_ref` is present only for an accepted H9 preparation
transition. It is not a delivery ref or provider receipt.

| case | public/application result | durable rule |
|---|---|---|
| initial draft plus accepted P14 decision | stored surface for resulting Draft/Prepared/Blocked state; H9 only if `apply_decision` returned a transition | draft construction alone has no H9 |
| committed input absent after exact lookup | P14 `PendingEvidence` surface | no fabricated missing gap, external request or success |
| Ready/Degraded | local `Prepared` result with exact visibility/gaps | this authorizes only later application external-effect preparation cuts, not delivery or acceptance |
| policy Blocked | local `Blocked` result with typed reason | no adapter call/token/package/delivery state |
| exact duplicate/no-op | original stored surface with `Replayed` access | no second preparation/H9/outbox and no current-state reconstruction |
| relation mismatch/corrupt snapshot | typed reference/handoff/consistency error | no parallel preparation identity or partial row |
| commit outcome unknown | `CommitOutcomeUnknown` | probe stored relation; never retry an external phase because none occurred here |

#### 8.15.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(PrepareExternalAuditExport Command family, authenticated actor, idempotency_key)`; consumer/input/view changes conflict; the J08 Job namespace cannot collide |
| actor | only authenticated metadata actor; consumer/view identifiers do not confer external authority |
| audit | initial draft is no-H9; each accepted `ExportPreparationTransition` creates at most one H9 preparation record from same-UoW post-state |
| redaction | retain local refs, structured projection scope, finite readiness/visibility/gap/block state; forbid endpoint, credential, package body, provider payload/receipt, product status, evidence alias, verdict and signoff |
| no-write | only local preparation/history/result/follower writers are reachable; external/source/business truth remains unchanged |

#### 8.15.6 Step closure and affected status

Step 06 owners are `DashboardAlertExportView`, `EvidenceIndexInputView`, P10/P14,
`ExternalAuditExportPreparation`, `ExportPreparationTransition` and H9. Step 07
owners are the exact assembler/service methods, `ReportHandoffRepository::
get_evidence_index_input`, `ObservationProjectionStore::
get_peripheral_export_view_by_ref`, `PeripheralDeliveryRepository::{
get_export_preparation_with_version,stage_export_preparation,
append_delivery_record}`, typed IDs, UoW and stored-result ports.

`C14` is `defined_with_affected_open`. Open internal affected items are
`S08-C14-EXPORT-SCOPE-OWNER-01`,
`S08-C14-PREPARATION-INPUT-SOURCE-01` and
`S08-C14-VISIBILITY-AUTHORITY-01`, plus the shared result owner and downstream
`R07-EXTERNAL-PHASE-LINK-01`. The unique Step 09 handoff is
`PrepareExternalAuditExportFlow`; no delivery or provider success is claimed.

### 8.16 C15 `RegisterReferenceSnapshot`

#### 8.16.1 用途与 truth boundary

`RegisterReferenceSnapshot` registers local tracking for one body-free
`ReferenceSubjectRef`. It creates only a `ReferenceSnapshotState::Pending` row when
no current tracking exists. Registration does not resolve the subject, fetch a safe
summary, compare source versions, assert freshness, or mutate any external reference
lifecycle.

The caller therefore supplies only the subject. Safe summary, source version,
freshness/state and reasons belong to the resolver plus P15/P17 refresh path. An
initial Pending object has neither `ReferenceSnapshotTransition` nor
`ReferenceSnapshotCreated`; it cannot be mapped to H10 merely because the identity
was first persisted.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; authenticated actor remains request metadata |
| logical binding | `Command / RegisterReferenceSnapshot` |
| application path | `ObservationApiInputAssembler::register_reference_snapshot` -> `ObservationTruthWriteService::register_reference_snapshot` |
| owned target | optional new Pending `ReferenceSnapshotState`, stored result and explicitly owned local follower |
| non-owned truth | resolver result, safe-summary body, provider/source version truth, external object lifecycle, freshness verdict or identity truth |
| Step 09 reservation | `RegisterReferenceSnapshotFlow` |

#### 8.16.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::register_reference_snapshot(
    request: ObservationCommandRequest<RegisterReferenceSnapshotRequest>,
) -> Result<RegisterReferenceSnapshotInput, ApplicationError>

ObservationTruthWriteService::register_reference_snapshot(
    input: RegisterReferenceSnapshotInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct RegisterReferenceSnapshotRequest {
    pub subject_ref: ReferenceSubjectRef,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `subject_ref` | typed body-free subject boundary admitted by `ReferenceSubjectRef::from_safe_ref` | required; kind/safe-ref mismatch, raw subject/body/PII, locator or credential rejects before reservation |

Corrected digest material is exactly:

```text
subject_ref
```

Historical `safe_summary_ref`, `freshness` and `source_version_ref` fields bypass the
resolver/P16/P15/P17 authority chain and are affected under
`S08-C15-REGISTRATION-AUTHORITY-01`. They are removed rather than retained as
optional compatibility fields.

#### 8.16.3 Registration sequence and persistence

| stage | exact mapping |
|---|---|
| assembler | validate operation/body, subject structure and subject-only digest; do not call resolver or choose snapshot state |
| lookup | `ReferenceMaintenanceRepository::find_current_snapshot_by_subject` distinguishes exact absence, one current usable tracking row, and duplicate/inconsistent rows |
| absent | mint `new_reference_snapshot_state_ref`, obtain boundary `ObservedAt`, call `ReferenceSnapshotState::pending`, then stage the row with `expected_version=None` |
| existing exact current | return original/replayed or explicit no-op surface according to shared idempotency relation; do not replace, refresh or mint a new identity |
| existing Invalid historical row | C15 does not recover it; new-identity recovery requires a typed refresh result plus P17/P15 `RequireNewSnapshot` and belongs to C16 |
| record | initial Pending has no accepted H10 source; do not fabricate a transition, creation proof or H10 to justify registration |
| UoW | stage Pending snapshot, stored result, idempotency completion and only an explicitly owned follower atomically; use the repository/UoW cursor contract without inventing H10 |

If the shared accepted UoW requires a cursor-bearing follower, that follower's own
owner supplies the requirement. H10 cannot be used as a generic creation event. The
current F2 mapping that associates Register with H10 is affected under
`S08-C15-INITIAL-H10-MAPPING-01`.

C15 also cannot claim that the resolver-ready structured subject relation already
exists. Step 06 currently says `SubjectObservationReferenceId` is minted at first
safe-subject snapshot registration, but its only listed creation factory starts the
structured reference in `SubjectReferenceState::Resolved`; that would contradict
C15's Pending/no-resolver boundary. Step 07 has neither a typed ID mint nor an exact
lookup/stage owner for this relation. The cross-command affected item
`S08-C15-C16-RESOLVER-SUBJECT-BINDING-01` must decide whether C15 atomically links an
already committed trusted `SubjectObservationReference` or introduces a
pending-compatible body-free relation with an exact owner/state matrix. Until that
repair, C15 must not synthesize a reference id, identity marker, state or visibility
constraint and must not invoke the resolver.

#### 8.16.4 Result and duplicate matrix

Minimum result body semantics are:

```text
snapshot_ref; subject_ref; snapshot_state;
safe_summary_ref; source_version_ref; stale_reason; resolution_reason;
invalid_reason; reference_refresh_record_ref;
changed_refs; outbox_refs; gap_refs
```

For a successful registration, state is exactly `Pending`; all summary/version/reason
and H10 fields are absent.

| case | public/application result | durable rule |
|---|---|---|
| subject absent | stored accepted Pending surface with newly generated snapshot ref | one local snapshot row; no resolver, H10 or external assertion |
| exact duplicate/idempotent replay | original stored Pending/current surface with `Replayed` access | no second identity, row, H10, outbox or current-state reconstruction |
| current tracking already exists without matching idempotency | explicit already-tracked/no-op or typed conflict selected by Step 09, preserving existing identity | no refresh or replacement is inferred |
| duplicate current rows or subject mismatch | typed consistency/reference error | no new identity or partial row |
| Invalid current requires recovery | typed route/transition error directing the operation to the refresh lane | C15 does not create a replacement |
| commit outcome unknown | `CommitOutcomeUnknown` | probe stored result/subject uniqueness; do not create a second snapshot identity |

#### 8.16.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(RegisterReferenceSnapshot, authenticated actor, idempotency_key)`; changed subject conflicts; subject uniqueness is additionally repository-enforced |
| actor | authenticated metadata actor only; subject kind/ref does not convey identity-owner authority |
| audit | initial Pending registration is explicit no-H10; no append-only reference refresh history is fabricated |
| redaction | retain typed snapshot/subject refs, Pending state and local time where owned; forbid subject profile/PII, provider body, summary body, credential, source lifecycle, verdict/signoff |
| no-write | only local body-free tracking/result/follower state is staged; identity/source/external truth remains untouched |

#### 8.16.6 Step closure and affected status

Step 06 owners are `ReferenceSubjectRef`, `ReferenceSnapshotState::pending` and the
H10 accepted-input matrix. Step 07 owners are the exact assembler/service methods,
`ReferenceMaintenanceRepository::{find_current_snapshot_by_subject,stage_snapshot}`,
typed ID/clock, UoW and stored-result ports.

`C15` is `defined_with_affected_open`. Open internal affected items are
`S08-C15-REGISTRATION-AUTHORITY-01` and
`S08-C15-INITIAL-H10-MAPPING-01`, plus cross-command
`S08-C15-C16-RESOLVER-SUBJECT-BINDING-01` and the shared result body owner. The
unique Step 09 handoff is `RegisterReferenceSnapshotFlow`; no reference
resolution/freshness or external lifecycle claim is made.

### 8.17 C16 `UpdateReferenceSnapshotState`

#### 8.17.1 用途与 truth boundary

`UpdateReferenceSnapshotState` refreshes one existing local body-free snapshot by
selecting its canonical maintenance target, loading the exact committed
`SubjectObservationReference` bound to the snapshot subject, invoking Step 07
`SubjectObservationResolver`, mapping the finite lookup result, and applying
P16/P17/P15. It may update the current identity in place or, only for P15
`RequireNewSnapshot`, create a different identity while preserving the old Invalid
row.

The caller selects the local snapshot and maintenance target only. It cannot submit
`ReferenceRefreshResult`, final `ReferenceSnapshotStateKind`, summary/version,
freshness, generic `ReasonRef`, policy decision, adapter family, external body or
provider status. A safe resolver result is a non-mutating lookup carrier and must be
mapped by application; it is not public request authority.

| 边界项 | current contract |
|---|---|
| caller | `api` exact Command handler; target selector is not maintenance authorization |
| logical binding | `Command / UpdateReferenceSnapshotState` |
| application path | `ObservationApiInputAssembler::update_reference_snapshot_state` -> `ObservationTruthWriteService::update_reference_snapshot_state` |
| owned target | current local snapshot CAS or new replacement snapshot identity, accepted H10 branch, stored result and typed local followers |
| non-owned truth | external reference lifecycle, source write/repair, provider body/error text, identity/business state, acceptance or verdict |
| Step 09 reservation | `UpdateReferenceSnapshotStateFlow` |

#### 8.17.2 Exact signature and request schema

```rust
ObservationApiInputAssembler::update_reference_snapshot_state(
    request: ObservationCommandRequest<UpdateReferenceSnapshotStateRequest>,
) -> Result<UpdateReferenceSnapshotStateInput, ApplicationError>

ObservationTruthWriteService::update_reference_snapshot_state(
    input: UpdateReferenceSnapshotStateInput,
) -> ApplicationServiceFuture<'_, ObservationCommandResult>
```

```rust
pub struct UpdateReferenceSnapshotStateRequest {
    pub snapshot_ref: ReferenceSnapshotStateRef,
    pub maintenance_target_ref: MaintenanceTargetRef,
}
```

| body field | authoritative source | validation and absence behavior |
|---|---|---|
| `snapshot_ref` | identity of one existing local `ReferenceSnapshotState` | required; historical `ReferenceSnapshotRef`, external object ref or subject ref cannot substitute |
| `maintenance_target_ref` | canonical structured target selector for `ReferenceSnapshotState / RefreshBodyFreeReference` | required; application must load target/scope/dependency binding and prove it names this snapshot subject; the ref itself is not authorization |

Corrected digest material is:

```text
snapshot_ref; maintenance_target_ref
```

Final state, summary/version, generic reason and refresh-result fields are excluded.
The resolver output is obtained after idempotency admission and is not caller digest
material.

#### 8.17.3 Resolver, policy and UoW sequence

| stage | exact mapping |
|---|---|
| assembler | validate exact body and corrected digest; do not invoke a resolver or accept a refresh outcome |
| load current | get versioned snapshot; load `MaintenanceTargetPolicySnapshot`, immutable target-scope/dependency binding, current retention/protection and same-target P10 material |
| load resolver subject | use an application-owned exact lookup/binding to obtain one committed `SubjectObservationReference` for the loaded snapshot and `ReferenceSubjectRef`; snapshot ref, subject kind/safe ref, identity boundary marker and owner-defined state/visibility relation must all match, while absence/ambiguity/mismatch fails before resolver invocation |
| invoke/map | call `SubjectObservationResolver::resolve_subject_observation` exactly once. `Resolved` must match the complete structured subject and trusted mapper output; Stale/Unresolved/Unavailable preserve typed reasons. `NotVisible` remains a typed no-mutation/limited branch unless a current owner defines a lossless persisted refresh mapping; adapter `Err` remains an error and is never parsed into state |
| P16/version | for `Resolved`, construct/validate `AdapterSafeOutputSnapshot` through P16 and compare typed source versions on the same stream; non-Resolved persisted refresh variants use `NotApplicable` relation |
| P17 | evaluate `DerivedMaintenancePolicy` for the exact `ReferenceSnapshotState / RefreshBodyFreeReference` target; `Blocked` is a typed no-mutation result, not authorization |
| P15 | build `ReferenceFreshnessInputSnapshot` from the loaded snapshot, mapped finite refresh result, target, adapter family, version relation and P10; evaluate P15 |
| preserve | `PreserveCurrent` returns no mutation, H10, outbox or new identity |
| in-place | Authorized P17 plus Apply* P15 calls `apply_freshness_decision`; retain `ReferenceSnapshotTransition`, stage with expected version, assign one Reference or Observation tagged cursor and append one H10 |
| new identity | `RequireNewSnapshot` mints a different `ReferenceSnapshotStateRef`; `create_from_required_new_snapshot` must return `(ReferenceSnapshotState, ReferenceSnapshotCreated)`; old Invalid row stays immutable, only new row is staged, and H10 uses the creation proof |
| commit | accepted snapshot mutation/new row, H10, followers, stored result and idempotency completion commit atomically; CAS/factory/append/commit failure rolls everything back |

The public `maintenance_target_ref` source, complete target/subject authority lane
and exact resolver-subject binding remain affected. `ReferenceSubjectRef` cannot be
passed directly to any Step 07 resolver: it lacks the
`SubjectObservationReferenceId`, identity boundary marker, snapshot relation,
subject-reference state and visibility constraint required by
`SubjectObservationResolver`. The service cannot synthesize those fields, mint a
replacement structured reference during refresh, select one of the three unrelated
source/runtime/evidence resolvers, use a generic target, fall back to current config,
or treat a P17 outcome bool as authority. The older Step 06 object card returning only
`Result<Self, DomainError>` for new-identity creation conflicts with H10's
authoritative creation-proof signature and is affected.

#### 8.17.4 Result and duplicate matrix

Minimum result body semantics are:

```text
previous_snapshot_ref; snapshot_ref; subject_ref; snapshot_state;
safe_summary_ref; source_version_ref; stale_reason; resolution_reason;
invalid_reason; refresh_access_kind; reference_refresh_record_ref;
changed_refs; outbox_refs; gap_refs
```

| case | public/application result | durable rule |
|---|---|---|
| accepted in-place Apply* | stored accepted current-state surface with exact H10 ref | snapshot CAS, H10, followers and result commit together |
| Invalid recovery/new identity | stored accepted surface with old and new refs, access `NewIdentity`, exact H10 ref | old Invalid row unchanged; H10 uses `ReferenceSnapshotCreated` |
| `PreserveCurrent` | explicit unchanged stored/no-op surface | no timestamp update, H10, outbox or identity consumption |
| resolver `NotVisible` without a lossless refresh mapping | typed limited/no-mutation result | do not map to Unresolved/Invalid or erase visibility constraint |
| P17 Blocked | typed local blocked/no-mutation result | no snapshot transition/H10; no source or adapter write |
| exact idempotent duplicate | original stored surface with `Replayed` access | resolver/policy must not be rerun after completed reservation |
| same version/different summary, stale target or cross-subject result | typed conflict/relation error | zero mutation and H10 |
| commit outcome unknown | `CommitOutcomeUnknown` | probe stored relation; do not rerun resolver or claim either identity committed |

#### 8.17.5 Error, idempotency, actor, audit and redaction

| concern | rule |
|---|---|
| idempotency | scope is `(UpdateReferenceSnapshotState, authenticated actor, idempotency_key)`; snapshot/target changes conflict; completed duplicates return stored bytes without a second resolver call |
| actor | authenticated metadata actor; maintenance target and resolver family do not grant identity/source authority |
| audit | accepted in-place transition produces one H10; accepted new-identity creation produces one H10; PreserveCurrent, NotVisible-no-map, P17 Blocked and all errors produce none |
| redaction | retain typed local/subject/target/summary/version refs and finite reasons/bases; forbid provider payload/error text, raw source/reference body, PII/profile, endpoint/credential, external lifecycle, verdict/signoff |
| no-write | resolver is read-only; durable effects remain local snapshot/history/result/follower state; no source/business/external mutation is reachable |

#### 8.17.6 Step closure and affected status

Step 06 owners are `ReferenceSnapshotState`, `ReferenceRefreshResult`, P10/P15/P16/P17,
`ReferenceSnapshotTransition`, `ReferenceSnapshotCreated` and H10. Step 07 owners are
`SubjectObservationResolver`, `SubjectObservationSafeSummary`, the exact
assembler/service methods,
`ReferenceMaintenanceRepository::{get_snapshot_with_version,
get_maintenance_target_scope_binding,stage_snapshot,append_refresh_record}`, typed
version comparison, ID/UoW and stored-result ports.

`C16` is `defined_with_affected_open`. Open internal affected items are
`S08-C16-REFRESH-REQUEST-AUTHORITY-01`,
`S08-C16-MAINTENANCE-TARGET-SOURCE-01`,
`S08-C15-C16-RESOLVER-SUBJECT-BINDING-01` and
`S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01`, plus the shared result body owner. The
unique Step 09 handoff is `UpdateReferenceSnapshotStateFlow`; no provider/source or
external lifecycle truth is claimed.

### 8.18 C13-C16 batch stop review

| check | conclusion |
|---|---|
| four protocols have independent purpose/signature/body/source/result/error/idempotency/audit sections | pass_with_affected_open |
| caller policy-outcome authority removed | pass; C13 kind/degraded fields, C14 scope/visibility, C15 freshness/summary/version, C16 state/result/reason are not public authority |
| C13 P12/P13/H8 boundary | pass_with_affected_open; multi-record and explicit no-record branches are fixed; lookup/input/key owners remain registered |
| C14 local preparation/external phase split | pass_with_affected_open; initial Draft is no-H9 and no delivery/adapter/package/provider claim exists |
| C15 initial Pending/H10 matrix | pass_with_affected_open; registration is no-H10 and the historical F2 mapping is affected |
| C16 resolver/P16/P17/P15/H10 order | pass_with_affected_open; only the subject-observation resolver is semantically compatible, its exact structured-subject binding remains registered, NotVisible is not guessed into a durable state and new identity requires creation proof |
| exact assembler/service methods | pass; all four Step 07 callables exist and are uniquely named |
| shared operation-specific result owner | affected; `S08-COMMAND-RESULT-BODY-OWNER-01` remains open for C01-C16 |
| new external upstream blocker | none; thirteen new items are internal Step 06/07 affected, not external dependency blockers |
| formal `03`, S08-D~G, Step09, `04`, implementation | unchanged/frozen |
| batch status | `C13-C16 defined_with_affected_open`; Command count `16/16`, total `16/60`, unconditional complete `0/60` |
| next action | stop and wait for explicit user confirmation before S08-D Query Q01-Q04 |



## 9. Writing batches and gates

| Batch | Scope | Required output | Completion gate | 状态 |
|---|---|---|---|---|
| S08-A | authority / historical inventory / skeleton | current truth, 60-item register, affected list, worklist and recovery point | old `done/pass` isolated; all protocols remain pending | `completed` |
| S08-B | shared public carrier | operation/metadata/envelope/page/surface/result/receipt/event/job shared types | every secondary type has owner/schema/factory/absence rule; no domain-only leak | `completed_waiting_user_before_S08-C` |
| S08-C | 16 Command | sixteen independent protocol sections | `16/16` exact assembler/service, object/source/error/idempotency/audit/flow closure | `completed_design_record_with_affected_open_waiting_user_before_S08-D_Q01-Q04` |
| S08-D | 14 Query | fourteen request/view/page/marker sections | `14/14` read-only field mapping, page/cursor and degraded surface closure | `historical_checkpoint_completed_design_record_with_affected_open` |
| S08-E | 9 Consumer | nine envelope/payload/receipt/action sections | `9/9` static producer, exact callable and C-05 action closure | `completed_design_record_with_affected_open` |
| S08-F | 12 Outbound Event | twelve source/encoder/snapshot/version/subscriber sections | `12/12` immutable snapshot and no-current-truth-rebuild closure | `completed_design_record_with_affected_open` |
| S08-G | 9 Job + cross-protocol closure | nine Job sections, collision decision, 60-protocol audit and Step 09 handoff | `9/9` Job and `60/60` total closure; no unowned public type | `completed_design_record_with_affected_open_waiting_before_step09` |

每批开始前重新读取对应 Step 06 input/object/result owner和 Step 07 exact callable。每批完成后停审；未经用户明确确认不得进入下一批。Step 08 全部完成后仍须停审，不能自动进入 Step 09。

## 9. Blocker and affected register

| ID | Current state | S08 responsibility | Prohibited claim |
|---|---|---|---|
| `03-RPR-S08-PER-PROTOCOL` | `in_progress_after_S08-E_I05_S12_34_of_60_with_affected_open` | S08-C~G逐个关闭60协议authority/source/schema/error/idempotency/audit/flow/binding；C01-C16、Q01-Q14与I01~I04已形成记录，I05完成§1~§12但尚未计入defined；complete input、durable landing、result surface、recovery owner与action仍受affected阻断，I06~I09/Event/Job待审查 | 用旧schema或shared carrier一次性标pass |
| `R06.8-AFFECT-08-PROTOCOL` | `C01-C16_Q01-Q14_I01-I04_propagated_I05_S01-S12_affected_open` | S08-B已传播四façade、`JobRunId`、snapshot/public result隔离；C01-C16、Q01-Q14与I01~I04已完成matching assembler/service或具名affected映射；I05 §1~§12已登记13项专属affected，完成23问路由、truth/event admission、exact chain、header/payload/input、digest/identity、result/UoW/replay、error/public projection、recovery/C-05 eligibility、一致性与telemetry边界，尚未传播完整input、唯一durable landing、recovery owner或exact action mapper | 恢复旧type/owner、让entry自行hash、发布control-only input、保存raw body、从repository capability任选landing、因primary consumer或字段相似度接入Artifact event、事后补event alias、用telemetry证明truth、默认terminal action或把本地use-site误报为canonical upstream schema |
| `S08-ROUTE-BINDING-01` | `shared_binding_closed_per_protocol_totality_open` | S08-B已定义有限typed family/name/body/operation relation；S08-C~G逐协议证明exact handler totality | 误报60项已闭合、继续route-neutral占位或提前猜产品locator |
| `S08-EXPORT-NAME-COLLISION-01` | `shared_typed_collision_closed_job_totality_open` | S08-B已由typed family区分C14/J08并静态映射J08 Delivery callable；S08-G复核具体Job totality | 重命名public Job或用裸字符串猜family |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | C11 明确 zero-H13；J06 才可承接 per-target H13 | 声称上游冲突已裁定或擅造 scope lifecycle record |
| `R06-F-AFFECT-UOW-01` | `step07_surface_closed_downstream_open` | 协议传播 input/result/record expectation；顺序仍留 Step 09/11/13/16 | 在 Step 08 提前关闭事务传播 |
| `R06.7-D-PUBLICATION-JOB-SEAM` | `step07_use_closed_step08_propagating` | E01~E12 与 J01 固定统一 publication lifecycle | 恢复 worker loop 或第五 façade |
| `R06-F2-AFFECT-08-OUTBOX-ENCODER` | `shared_encoder_defined_event_totality_open` | S08-B已固定typed encoder、canonical bytes、digest owner与application outbox snapshot lossless mapping；S08-F逐事件证明12种payload/source totality | publisher重读current truth、任意serializer/debug bytes或提前声称12/12 |
| `S08-SOURCE-EVENT-REF-OWNER-01` | `resolved_in_S08-B_step06_affected_open` | S08-B已在`contracts::refs`补唯一transparent typed newtype及factory/wire/redaction/authority规则；Step06 affected修订回指该声明并删除“已有类型”模糊口径 | 在application/payload复制wrapper、本仓mint上游identity、或与dedup/trace/local event/locator互换 |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `open_internal_affected` | S08-E逐Consumer闭合stored receipt到public `outbox_refs`的lossless来源；Step06 affected修订补齐application carrier或明确validated stored surface accessor | response assembler查询current outbox补值或把文字承诺当struct字段 |
| `S08-CONSUMER-QUARANTINE-REF-01` | `open_internal_affected` | Step06 affected修订删除悬空字段或回指已有canonical owner；S08-E只使用body-free public receipt surface | 由Step08临时定义`QuarantineRef`或把raw quarantine material外泄 |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `open_internal_affected` | Step06/07 affected修订须提供probe后仍indeterminate时的typed no-completion return shape，或等价地收紧handler/mapper签名；S08-E在此基础上关闭九Consumer total action matrix | 用`Retry`、`Acknowledge`或`DeadLetter`作默认占位，伪造receipt，或声称commit为已写/未写 |
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | 保持I04 accepted payload set为空，直到L1-governance或明确跨项目contracts owner提供canonical payload、encoder与registration | 从Observability use-site、旧三字段row或Governance正文反推canonical schema |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 等待上游提供十三个具体Governance event到I04的有限binding/adapter，或正式裁定拆分Consumer | 全订阅、任选event、按名称匹配或拼接字段并集 |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | Step06/07收敛最小上游body-free refs与本地授权factory/relation，保持完整local reference由Observability构造 | 信任producer提交本地identity/state/reason或直接反序列化完整reference |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | Step06/07传播六个control fields的exact private struct、constructor与accessor | 由entry/service重构字段，或用payload回填header |
| `S08-E-I04-DIGEST-AUTHORITY-01` | `open_internal_affected` | 固定semantic digest唯一owner、profile/material/order、absence与conflict规则 | hash raw body/event/debug/topic/timestamp，或把`RequestDigest`与`DigestSummary`互换 |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | 将local visibility留在Observability policy/gap mapper，或等待独立上游observation DTO | 让producer构造local visibility，或缺失时默认`Visible` |
| `S08-E-I04-DIGEST-ORDER-01` | `open_internal_affected` | Step06/07/09传播唯一`inbound_consumer_request` frame、未决payload segment、排除集与一次candidate | 沿用旧三字段顺序、各层重算，或加入dedup/trace/time/local effects |
| `S08-E-I04-REDACTION-PROPAGATION-01` | `open_internal_affected` | Step06/07/09/15/16让decoder、canonicalizer、private input、public error/receipt、telemetry、persistence与dead-letter共用同一allowlist/exclusion ceiling | 宽松接收unknown field、保存raw payload，或用hash、截断、base64、debug输出冒充redaction |
| `S08-E-I04-DURABLE-LANDING-01` | `open_internal_affected` | Step06/07/09唯一闭合primary object/transition、repository relation/version、H-family或explicit-no-record、commit class/cursor、result refs与optional outbox mapping | 从HLD多域候选、冻结正式`03`或repository方法存在性任选EvidenceLinkage、AuditProjection、ReferenceSnapshotState、GapState、H3、H8、H10或cursor namespace |
| `S08-E-I04-ACTION-MATRIX-01` | `open_internal_affected` | Step06/07提供I04具名pure/total/no-wildcard mapper，输入覆盖activation、commit certainty、Stored/Ephemeral、inner outcome/access、refs/error、recovery与exact policy；Step09在receipt/probe后只调用一次，Step16表驱动验证 | generic/default/error-string/outcome-only/retryable-only action、unknown默认Retry或registrar再次分类 |
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | 保持I05 accepted payload set为空，直到L1-artifact或明确跨项目contracts owner提供canonical `ArtifactEvidenceContextPayload`、encoder、registration与兼容规则 | 从Observability use-site、Step06四字段、`ConsumableArtifactReferenceChangedPayload`或`ArtifactTraceAvailablePayload`反推schema，或创建同名alias |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 等待L1-artifact与binding owner提供有限event-to-I05 adapter/registration，或正式裁定I05拆分为具体Consumer | 全量订阅、任选event、按名称/字段相似度匹配、字段并集或由Observability制造aggregate event |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | `open_internal_affected` | Step06/07收敛Artifact最小body-free source reference与本地授权relation/factory；完整`GovernanceArtifactEvidenceReference`必须由Observability构造或解析 | 直接反序列化producer提交的完整本地对象、信任local state/reason/visibility、临时mint alias或按ref prefix/digest绑定 |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | Step06/07传播I05六个shared Consumer control fields的exact private struct、`from_assembled`参数、validation与accessor，并证明header与payload不能互相覆盖 | generic map、entry/service重构context或digest、payload回填header、arrival time/cursor替代source version |
| `S08-E-I05-DIGEST-AUTHORITY-01` | `open_internal_affected` | 固定I05 semantic digest的唯一upstream-or-local owner、profile/material/order、optional digest冲突矩阵与single-computation路径 | hash Artifact body/raw event/transport/debug/topic/timestamp，复制optional digest，或用空/default digest补齐 |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | `open_internal_affected` | 由本地operation/binding policy或明确上游observation经finite total mapper生成`EvidenceConsumerPurpose`，并固定family/purpose/scope组合 | producer任选purpose、按产品名/event name推导或缺失时默认 |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | 将`VisibilitySurface`移出producer payload，由本地policy/result mapper基于reference/linkage/gap/degraded与consumer scope生成，并固定not-visible/degraded precedence | producer提交local surface、默认`Visible`、absence-as-visible或以Artifact state授权 |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | `open_internal_affected` | Step06/07明确I05的`projection_ref`、`consumer_scope`及最小typed selector/lookup，或修订concrete input，并固定missing/duplicate/version/scope矩阵 | 用visibility/purpose/ref prefix、第一条projection row或产品名替代relation字段 |
| `S08-E-I05-DEPENDENCY-SLICE-01` | `open_internal_affected` | 提供I05 private least-authority dependency delegate，逐项回指Step07 port/Step09 flow，并从类型边界排除evidence/retention/handoff/external writer | 把wide bundle当owner、复制trait，或只靠评审文字证明no-write |
| `S08-E-I05-RESULT-SURFACE-01` | `open_internal_affected` | I05 operation-specific result、outcome、refs、error presence尚未绑定到唯一lossless result/receipt mapper；fresh/replay必须共享同一immutable stored surface | Step06/07提供唯一result surface owner、stored accessor、I05 field/presence matrix，并由Step09只消费不补字段 | generic disposition、empty Stored、current rows补refs、从Artifact truth重建 |
| `S08-E-I05-ACTION-MATRIX-01` | `open_internal_affected` | I05缺具名pure/total/no-wildcard C-05 mapper，known result、ephemeral、unknown、replay与post-commit action failure尚未全分支闭合 | mapper覆盖activation、certainty、Stored/Ephemeral、outcome/access、refs/error、recovery和I05 policy；Step09 receipt/probe后只调用一次 | generic Consumer policy、default Retry、outcome-only switch、registrar重新分类、unknown terminal action |
| `S08-RECOVERY-CLASS-OWNER-01` | `open_internal_affected` | 后序Step12重审唯一`ObservationRecoveryClass` owner、八类enum、`ApplicationError` total mapper、public `retryable`派生与no-wildcard tests；Step08只记录逐协议target mapping | 把冻结Step12反向当current authority、在每个协议复制enum、entry手写retryable或从outcome/error text猜恢复类 |
| `S08-JOB-REPORT-REF-OWNER-01` | `open_internal_affected` | Step06 affected修订为application-local `JobReportRef`补唯一owner/mint/rehydrate card；S08-G只投影public `BodyFreeRef` | 让public result ref充当repository PK或暴露local report identity |
| `S08-RESULT-ACCESS-LAYER-01` | `resolved_in_S08-B_step06_affected_open` | S08-B已固定stable stored inner surface + invocation-level `FreshlyCommitted/Replayed` overlay；Step06 affected修订删除“`DuplicateReplayed`是public outcome”旧口径 | 把duplicate写成durable state、覆盖原outcome/report，或把access写入stored bytes/digest |
| `S08-COMMAND-RESULT-BODY-OWNER-01` | `open_internal_affected` | C01-C16已固定各自结果 body 的最小语义字段和 presence matrix，但 Step06/07尚未给十六个 operation-specific body 唯一 current owner；后续修订必须补唯一 owner/constructor/rehydrate 关系，不得恢复历史 `*CommandResult` 名称 | 由协议层临时创建结果 owner、让 generic `ObservationCommandResult` 吞掉 operation-specific body，或把结果字段散落在 entry mapper |
| `S08-COMMAND-SAFE-SUMMARY-TYPE-01` | `open_internal_affected` | C01/C02/C04使用 canonical `SafeSignalSummaryRef`；Step06旧表仍出现`SafeSummaryRef`，必须按当前类型修订 use-site，不得创建 alias或第二wrapper | 沿用旧 `SafeSummaryRef`、创建兼容 alias或从 raw summary/body补值 |
| `S08-COMMAND-CORRELATION-SEED-OPTIONALITY-01` | `open_internal_affected` | C03当前允许`correlation_seed: Option<CorrelationSeed>`并同时保留独立`trace_ref`/`causation_ref`，而`CorrelationSeed::new`要求非空语义hint；Step06 affected修订必须给出唯一组合/缺失规则，当前fail-closed | 隐式合并字段、用metadata `trace_ref`替代语义字段、或在assembler中猜测seed |
| `S08-C05-SUMMARY-SOURCE-01` | `open_internal_affected` | C05已拒绝历史 `SafeSummaryRef` / `audit_action_summary_ref` alias并保留 `SafeExternalSummaryRef` 方向，但 canonical source/use-site 与 trusted producer 尚未由 Step06/07 唯一闭合；当前缺失必须 fail-closed | 沿用旧 alias、创建兼容 wrapper、从 raw audit summary/body 补值或猜测 source |
| `S08-C06-CONSUMER-SCOPE-SOURCE-01` | `open_internal_affected` | C06的 `EvidenceConsumerScope` 是 linkage candidate、P4 policy和relation lookup的必需输入；当前 concrete input未给出唯一来源，不能从 purpose、boundary、产品名或默认值推导 | 缺 scope 仍生成 linkage、使用 purpose/boundary fallback或临时创建 scope wrapper |
| `S08-C07-IMMUTABLE-INPUT-REF-01` | `open_internal_affected` | C07要求 immutable、body-free、append-once 的 `EvidenceIndexInputView`；`EvidenceIndexInputViewRef` 的唯一 mint/rehydrate owner与同ref冲突规则仍需上游闭合 | 从 current evidence 重建 snapshot、让同ref不同内容覆盖旧值、或把 local repository ref当 public identity |
| `S08-C08-ORIGIN-SOURCE-01` | `open_internal_affected` | C08已禁止 caller 提交 authenticity origin；resolver origin resolution、target-bound assessment与P6 decision的 use-site仍需 Step06/07 affected 修订唯一化 | 从 request/config/default/replay payload升级 origin、直接接受 caller verdict或把 hint当真实性 truth |
| `S08-C12-VIOLATION-REASON-OWNER-01` | `open_internal_affected` | C12 public input需要`NoWriteViolationReason`，但Step 06尚未给出唯一owner、variant和wire contract；reason缺失时必须在assembler前置失败 | 用`NoWriteViolationRecordReason`替代、字符串化reason、从trigger context猜reason或静默丢弃reason |
| `S08-C13-GAP-REQUEST-AUTHORITY-01` | `open_internal_affected` | C13 historical input/digest接受caller `GapKind`、degraded reason和limited bool，且缺affected-object/visibility selectors；current request已收缩为三个selector | 保留caller policy outcome、兼容双schema或从旧digest重放新语义 |
| `S08-C13-SOURCE-AFFECTED-LOOKUP-01` | `open_internal_affected` | Step07缺少证明`GapSourceRef`影响exact `AffectedObservationObjectRef`的typed lookup；C13 relation缺失/歧义必须fail-closed | 以request equality、ref prefix、当前projection membership猜dependency |
| `S08-C13-CURRENT-GAP-KEY-01` | `open_internal_affected` | P12绑定source+affected，现有`find_current_gap_by_source`只按source唯一；changed affected relation没有安全选择规则 | 任取第一行、把不同affected gap视为duplicate或覆盖current gap |
| `S08-C13-DEGRADED-INPUT-SOURCE-01` | `open_internal_affected` | C13尚无唯一owner可从loaded facts构造complete P11/P13 target-bound input；不能保证每次classification都生成degraded revision | 使用caller reason/bool/default visibility，或从gap kind直接构造P13 outcome |
| `S08-C14-EXPORT-SCOPE-OWNER-01` | `open_internal_affected` | historical `ExternalAuditExportScopeRef`无current owner；current scope只能从loaded `DashboardAlertExportView.scope`取得 | 临时定义opaque scope ref、接受caller scope覆盖view scope |
| `S08-C14-PREPARATION-INPUT-SOURCE-01` | `open_internal_affected` | historical input遗漏`evidence_index_input_ref`，Step07也缺按consumer/input/view唯一解析current preparation的owner与歧义规则 | current evidence重建input、并行创建重复preparation或把lookup error当absence |
| `S08-C14-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | historical input/digest让caller提交final visibility；current readiness/visibility/gaps/block只能来自complete P14 decision | 复用caller surface、把view visibility直接当preparation decision或跳过P14 |
| `S08-C15-REGISTRATION-AUTHORITY-01` | `open_internal_affected` | historical C15接受summary/freshness/source version；current registration只能提交subject并创建Pending | 以注册命令写Resolved/Fresh、调用resolver或接受caller source-version truth |
| `S08-C15-INITIAL-H10-MAPPING-01` | `open_internal_affected` | current H10只接受transition或new-snapshot proof；initial Pending没有accepted input，F2把Register映射H10的旧口径需修订 | 为获得cursor/history伪造Pending transition或creation proof |
| `S08-C16-REFRESH-REQUEST-AUTHORITY-01` | `open_internal_affected` | historical C16接受final state/summary/version/generic reason；current public request只含snapshot+target，refresh result由application resolver mapping形成 | 让普通caller提交`ReferenceRefreshResult`、解析provider error文字或直接赋state |
| `S08-C16-MAINTENANCE-TARGET-SOURCE-01` | `open_internal_affected` | current public/assembler contract尚未唯一闭合snapshot subject到canonical maintenance target/scope/dependency/P17 authority lane | family-level target、config fallback、target ref即authorization或cross-subject refresh |
| `S08-C15-C16-RESOLVER-SUBJECT-BINDING-01` | `open_internal_affected` | C15首次注册与C16刷新之间缺少完整`SubjectObservationReference`的唯一生命周期/持久化owner：现有ID来源声称首次注册mint，但factory直接`Resolved`且Step07无typed mint/lookup/stage；C16又不能只用`ReferenceSubjectRef`调用resolver | C15合成Resolved关系、从kind/safe ref补id/marker/state/visibility、refresh时临时mint、选择其他三个resolver或把missing/error当可解析subject |
| `S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01` | `open_internal_affected` | H10要求`create_from_required_new_snapshot`返回`(State, ReferenceSnapshotCreated)`，部分旧对象卡仍写`Result<Self>` | 从repository absence制造proof、原地恢复Invalid或无proof写H10 |
| `R07-EXTERNAL-PHASE-LINK-01` | `step06_07_closed_downstream_open` | C07/C14、J07/J08 只引用 stable intent/result expectation | 提前宣称 external phase flow已验证 |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `step06_07_closed_downstream_open` | Job protocol保留 typed report/retry handoff | 伪造 external acceptance/exactly-once/test evidence |
| `03-RPR-S09-PER-FLOW` | `open` | 每协议登记唯一 reservation；完整 flow仍冻结 | 读取旧 pass 即视为 current 或进入 Step 09 |

本批未发现新的外部上游 blocker。`R06.6-F2-H13-UPSTREAM` 是已知 controlled upstream blocker。C13-C16新增的13项均为Step06/07内部authority/lookup/signature affected，不要求本批修改正式`02`，但与既有Command affected共同阻止C01-C16标为无条件complete。

## 10. S08-B closure audit

### 10.1 Count and owner audit (historical S08-B checkpoint plus current S08-C)

| Family | Expected | Registered | Current owner totality | Per-protocol status |
|---|---:|---:|---|---|
| Command | 16 | 16 | API assembler `16` -> TruthWrite `16` | `16/16 defined_with_affected_open；0/16 complete` |
| Query | 14 | 14 | API assembler `14` -> Read `14` | `5/14 defined_with_affected_open；0/14 complete` |
| Inbound Consumer | 9 | 9 | Inbound assembler `9` -> InboundEvent `9` | `0/9 complete` |
| Outbound Event | 12 | 12 | 12 typed follower seeds -> immutable outbox -> J01 | `0/12 complete` |
| Operations Job | 9 | 9 | Job assembler `9` -> OperationsJob `9` | `0/9 complete` |
| total | 60 | 60 | `30/9/9 assembler + 16/14/9/9 façade` | `21/60 defined_with_affected_open；0/60 complete` |

### 10.2 Boundary audit

| Check | Result |
|---|---|
| 60 项名称是否与 current HLD Step 07 一致 | pass；public 名称未擅自增删或改名 |
| 48 entry inputs 是否与 Step 06/07 callable 一一对应 | pass；Command/Query/Consumer/Job=`16/14/9/9` |
| Outbound Event 是否有 current production owner | pass；12 个 typed follower seed在 accepted UoW 形成 immutable outbox pair |
| C14/J08 同名是否依赖字符串猜测 | no；S08-B已固定typed family、sealed body和Job Delivery mapping，具体Job totality待S08-G |
| C11 是否错误承诺 H13 | no；skeleton固定 scope-only/zero-H13 |
| Query 是否取得写 capability | no；只登记 Read façade与 committed read boundary |
| publisher 是否可重建 current truth | no；只消费 stored immutable snapshot/token |
| shared secondary type是否有owner/schema/factory/absence规则 | pass；§6.2~§6.13逐类闭合，`SourceEventRef`已补唯一声明卡，发现的内部缺口均已登记affected item |
| duplicate replay是否保留原结果事实 | pass；Command/Consumer/Job均以stable inner surface + invocation access分层，replay不覆盖原outcome/report |
| 是否把shared carrier误报为具体协议完成 | no；S08-B只完成shared层，当前具体协议分别为`16/16 defined_with_affected_open`、`0/14`、`0/9`、`0/12`、`0/9`，无条件完成仍为`0/60` |
| 是否修改正式 `03`、Step 09、`04` 或实现 | no |
| 是否伪造 commit/run/evidence/test/acceptance | no |

## 11. Stop review and S08-C C13-C16 checkpoint

| Stop item | Conclusion |
|---|---|
| S08-A authority 是否继续唯一 | pass；Step06/07 current owner优先，旧Step08只作historical material |
| S08-B shared carrier是否达到字段级落码深度 | pass_at_S08-B_checkpoint；有限enum/sealed binding、metadata、request/response、page、receipt、snapshot、report及factory矩阵均已定义 |
| C13-C16是否各自形成独立协议记录 | pass_with_affected_open；四个协议均有独立 purpose/signature/schema/source/policy/UoW/result/error/idempotency/actor/audit/handoff 小节，13项内部affected均已登记 |
| C01-C12既有记录是否被继承且未误报完成 | pass_with_affected_open；既有十二个 Command 的 affected继续保留，旧C09-C12 checkpoint仍作为historical stop record存在 |
| 五类协议全集与完成数是否诚实 | pass；`16+14+9+12+9=60`，当前为`16/60 defined_with_affected_open`，`0/60`无条件 complete |
| public/application边界是否闭合 | pass；stored/execution/plan/report/claim/fence均不进入public DTO，public identity只复用`BodyFreeRef` |
| internal issues 是否登记 | pass；既有Command/Consumer/Job/outbound/result-access affected与C13-C16的13项authority/lookup/signature affected均已登记 |
| 上游 blocker 是否登记 | pass；H13 保持 `open_controlled`，无新外部 blocker |
| 下一允许批次 | 仅S08-D Query Q01-Q04；不得回写正式 `03`，不得读取/写入Q05-Q14、S08-E~G或Step09 |
| 下一批开始条件 | 用户明确确认后，只重新读取Q01-Q04所需的Step06 request/view/page/visibility/freshness owners与Step07 API assembler/Read façade/repository methods；不得按Query family模板一次性关闭14项 |

当前恢复点为`Step08_S08-C_C13-C16_defined_with_affected_open_waiting_user_before_S08-D_Q01-Q04`。现在必须停审；未经用户确认不得读取或写入Q01-Q14、S08-E~G、进入Step09、修改正式`03`或任何`04`文件。当前不需要提交。

> 注：上面的 §8.18、§9~§11 是 S08-C C13-C16 的历史 checkpoint，保留其当时的停审事实。当前 S08-D Q01-Q04 的唯一 current 记录从本节 §12 开始；不得用历史 checkpoint 的 `16/60` 或 `before S08-D` 文案覆盖本节和台账的 current 状态。

## 12. Historical checkpoint: S08-D Query Q01-Q04

> 本节保留 Q01-Q04 批次的原始停审记录，仅用于历史回溯。当前 Step 08 恢复点以本文件 §13 Q05、`03_ddd_step_08_query_q05_audit_timeline.md` 及同步台账为准。

### 12.1 Batch boundary and shared Query rules

本批只覆盖四个 Query：`GetObservationReceipt`、`GetIntakeStatus`、`GetSafeSignal` 和 `GetSignalRollup`。它们的入口均是 API exact handler -> `ObservationApiInputAssembler` -> `ObservationReadService`，只读取 committed observation truth、projection 或 view；不拥有 source、business、raw telemetry、evidence、provider 或 acceptance truth。

| 项 | current ruling |
|---|---|
| shared request | 使用 `ObservationQueryRequest<T>`；`query_name` 必须等于 sealed body 的 `T::QUERY`，actor、visibility scope、consistency、trace 和 request time 来自 `ObservationQueryMetadata` |
| shared result | Step 07 current application carrier 是 `ObservationQueryResult<T>`；本批需要将单体结果映射为 `ObservationQueryResponse<T>`，将分页结果映射为 `ObservationPagedQueryResponse<T>`。Q02-Q04 所需 paged application result 尚无唯一 owner，登记 `S08-D-PAGED-RESULT-CARRIER-01` |
| page request name | S08-B current public owner 是 `ObservationPageRequest`；Step 06 input registry 仍出现 `ObservationPublicPageRequest`，未找到其正式声明或 alias，登记 `S08-D-PAGE-REQUEST-TYPE-01`，不创建兼容 alias |
| Q01 view | Step 07 trait / inventory 要求 `ObservationReceiptView`，但 Step 06 没有唯一 owner、字段 schema、factory 或 mapping；登记 `S08-D-Q01-VIEW-OWNER-01`，不把 `IntakeStatusView` 偷换为该类型 |
| Q02 view | `IntakeStatusView`，current Step 06 `contracts::views` owner |
| Q03 view | `SafeSignalProjectionView`，current Step 06 `contracts::views` owner |
| Q04 view | `SignalRollupView`，current Step 06 `contracts::views` owner |
| query idempotency | 不创建 reservation、stored result、duplicate replay 或 read-access record；request digest 只用于 input/context integrity，不进入 write lane |
| query side effect | 不开始 UoW、不 stage/save/append、不刷新 reference、不重建 projection/rollup、不调用 external adapter、不修改 gap/retention/business truth |

Current Step 07 callable signatures are observed inputs, not a silent closure of the open carriers:

```rust
fn get_observation_receipt(
    &self,
    input: GetObservationReceiptInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<ObservationReceiptView>>;

fn get_intake_status(
    &self,
    input: GetIntakeStatusInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<IntakeStatusView>>;

fn get_safe_signal(
    &self,
    input: GetSafeSignalInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<SafeSignalProjectionView>>;

fn get_signal_rollup(
    &self,
    input: GetSignalRollupInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<SignalRollupView>>;
```

Until the Step 06/07 affected repair selects the paged result carrier, `ObservationQueryResult<T>` must not be interpreted as both a single-object and page carrier. The API handler must not consume `ObservationRepositoryPageResult` directly or assemble a public page from repository internals.

All four Query assemblers follow this order:

1. The exact decoder validates `ObservationQueryName`, schema slot, required metadata and the concrete body variant.
2. The matching API assembler validates selector cardinality, body/page type, visibility scope and cursor syntax, then constructs one concrete application input.
3. The application service calls the formal repository key for that Query; display strings, ref prefixes, latest timestamps and global scans are not selectors.
4. The application reads the target object/page, visibility decision, persisted freshness and material degradation from one committed read boundary. The entry layer cannot add missing fields.
5. The exact response assembler maps fields or invokes the current view factory. Missing fields, relation mismatch and invalid state combinations fail closed; no partial body/page is returned.
6. `Missing`, `Empty`, `NotVisible`, `Stale`, `Rebuilding`, `Disabled` and `Failed` remain Query surfaces unless the condition is malformed input, repository failure or a persisted consistency defect.

| capability | Q01-Q04 | design proof |
|---|---|---|
| `ObservationUnitOfWorkManager` | unavailable | Read composition receives read repositories / `ObservationProjectionQueryStore`, not a UoW manager |
| `stage_*`, `save_*`, append record | unavailable | mutation callables require a borrowed UoW; Query composition has no commit handle |
| idempotency / stored-result repository | unavailable | Query digest does not reserve and the Read service has no writer dependency |
| outbox / external-effect / publisher | unavailable | Query creates no snapshot, intent, token or external phase |
| projection replacement / stale marking / rebuild | unavailable | Query receives a read facet and cannot downcast it to a writable store |
| source/business truth writer | unavailable | source/business refs are body-free selectors or summaries only |

### 12.2 Q01 `GetObservationReceipt`

Q01 reads one observability-owned intake receipt and its safe/visibility projection. It does not read source raw body, rerun admission or safety policy, create an `ObservationReceipt`, or treat source existence as a visibility proof.

```rust
pub struct GetObservationReceiptRequest {
    pub receipt_ref: ObservationReceiptRef,
}
```

| item | contract |
|---|---|
| logical binding | `Query / GetObservationReceipt / GetObservationReceiptRequest` |
| caller / handler | API exact `GetObservationReceipt` handler |
| assembler | `ObservationApiInputAssembler::get_observation_receipt` |
| service | `ObservationReadService::get_observation_receipt` |
| repository key | `ObservationIntakeRepository::get_receipt_with_version(receipt_ref)`; exact PK, never source, purpose or time guessing |
| secondary read | only when the current receipt relation explicitly requires it, `find_disposition_by_receipt(receipt_ref)`; `None` never becomes Pending |
| target view | Step 07 requires `ObservationReceiptView`; current Step 06 has no unique owner, see `S08-D-Q01-VIEW-OWNER-01` |
| Step 09 handoff | `GetObservationReceiptFlow` |
| idempotency / audit | none; no read-access audit, history or outbox append |

#### 12.2.1 `ObservationReceiptView` owner gap

Current Step 06 `contracts::views` defines `IntakeStatusView` with receipt ref, source ref, admission state, optional safety disposition ref/state, visibility, freshness and last-updated fields. It does not define `ObservationReceiptView`, its field schema, factory, rehydrate rule, source mapping or public/domain conversion. The two names and contracts are not interchangeable.

Until the upstream repair selects one canonical owner and propagates the exact mapping through Step 06 and Step 07, Q01 is fail-closed:

| situation | current rule |
|---|---|
| valid receipt request | assembler may create `GetObservationReceiptInput`; it may not change the request shape |
| committed receipt exists | application may read it, but may not rename `IntakeStatusView` to `ObservationReceiptView` |
| safety disposition absent | preserve `None`; do not manufacture Pending or infer safe/unsafe |
| view factory / response binding absent | typed persistence/application consistency failure or design blocker; never a fabricated public body |
| not visible / blocked | body-free shared Query surface; do not leak receipt/source identity |

Q01 cannot become unconditional complete until the owner, fields, factory, Step 06 mapping and Step 07 response mapping are closed. An alias, wrapper or API-layer conversion is prohibited.

#### 12.2.2 Q01 surface and field source

| state | presence | body | marker / rule |
|---|---|---|---|
| receipt exists and is visible | `Present` | `Some` only after the view owner closes | visibility and freshness copied from committed read/policy; source raw body is not implied |
| receipt exists but stale and old value is allowed | `Present` or `Unknown` | old view only when policy allows | preserve persisted stale marker and degraded surface; no refresh |
| receipt exists but is `NotVisible` / `Blocked` | `Unknown` or policy-defined hidden branch | `None` | do not rewrite to Missing or leak existence/source/safety state |
| receipt absent after successful exact PK read | `Missing` | `None` | `missing=NotFound`; repository failure is not NotFound |
| read store disabled / unavailable / failed | `Unknown` | `None` | availability is `Disabled` / `Unavailable` / `Failed`; no adapter activation or fallback |
| persisted relation/view corrupt | no valid success surface | `None` | typed consistency error; do not reconstruct a view from receipt fields |

| public field group | sole source | allowed mapping | prohibited mapping |
|---|---|---|---|
| receipt identity | loaded `ObservationReceipt.receipt_ref`, equal to request ref | typed ref copy | string, row id, source ref or display identity derivation |
| source identity / admission | committed receipt through visibility policy | exact typed copy or whole-body hiding | raw source body, path, payload, display name or current source truth |
| safety relation | unique committed `find_disposition_by_receipt` result | ref/state both Some or both None | None -> Pending, first-row selection or policy rerun |
| visibility | `ReadVisibilityDecision` / application surface | copy `VisibilitySurface` | handler bool, HTTP status or row existence |
| freshness | persisted projection/read marker | exact marker copy | query time, cache age or receipt time -> Fresh |

| condition | detection | external surface | side effect |
|---|---|---|---|
| malformed ref/body | decoder or assembler | `InvalidRequest` | no repository call |
| valid ref, no row | exact committed repository | `Present=Missing`, `missing=NotFound` | none |
| repository unavailable | read port | `RepositoryUnavailable`; do not fake Missing | none |
| duplicate/dangling disposition | relation validation | persistence invariant / consistency error | none |
| view owner absent | response assembly | `S08-D-Q01-VIEW-OWNER-01`, fail closed | no alias or fallback write |
| repeated request | no idempotency lane | ordinary read repeat, no Duplicate surface | no reservation/result/history |

| Q01 stop item | conclusion |
|---|---|
| request / assembler / service | defined |
| exact repository selector | defined: `get_receipt_with_version(receipt_ref)` |
| response view owner | blocked: `ObservationReceiptView` has no current Step 06 owner |
| visibility / freshness / missing | defined with fail-closed branches |
| no-write capability | design-only pass |
| Step 09 handoff | reserved: `GetObservationReceiptFlow` |
| protocol status | `defined_with_affected_open` |

### 12.3 Q02 `GetIntakeStatus`

Q02 returns a bounded committed receipt page within an exact `IntakeStatusScope`. It exposes local admission/safety projection only; it does not rerun admission, redaction or source fetch.

```rust
pub struct GetIntakeStatusRequest {
    pub scope: IntakeStatusScope,
    pub page: ObservationPageRequest,
}
```

| item | contract |
|---|---|
| logical binding | `Query / GetIntakeStatus / GetIntakeStatusRequest` |
| assembler / service | `ObservationApiInputAssembler::get_intake_status` -> `ObservationReadService::get_intake_status` |
| repository method | `ObservationIntakeRepository::page_receipts_by_status_scope(&scope, ObservationRepositoryPage)` |
| cursor binding | `ObservationRepositoryCursorBinding::for_receipts_by_status_scope(&scope)` |
| repository order | `(received_at, receipt_ref canonical bytes)` ascending, revision 1 |
| repository result | `ObservationRepositoryPageResult<Versioned<ObservationReceipt>>`; row version is application-local and never public |
| item view | each committed receipt plus optional unique disposition -> `IntakeStatusView` |
| public response | `ObservationPagedQueryResponse<IntakeStatusView>` at protocol level; application paged carrier remains affected |
| Step 09 handoff | `GetIntakeStatusFlow` |

#### 12.3.1 Item field mapping

`IntakeStatusView` is uniquely owned by Step 06 `contracts::views`. Every page item must satisfy:

| view field | source | absence / mismatch |
|---|---|---|
| `receipt_ref` | `Versioned<ObservationReceipt>.value.receipt_ref` | mismatch with selector/index identity -> consistency error |
| `source_ref` | committed receipt | hidden by whole-body visibility policy; never locally substituted |
| `admission_state` | committed receipt state | invalid persisted variant -> consistency error |
| `safety_disposition_ref` | unique `find_disposition_by_receipt(receipt_ref)` | `None` is factual; dangling/duplicate/mismatch -> consistency error |
| `safety_state` | same disposition row | ref/state must co-occur or both be absent |
| `visibility` | page/item `ReadVisibilityDecision` | never derived from row existence or error |
| `freshness` | persisted projection/read marker | never derived from query time or `received_at` |
| `last_updated_at` | projection replacement marker | not the receipt receive time |

#### 12.3.2 Page mapping and empty semantics

1. The assembler validates scope and page syntax, constructs the exact receipt binding, rehydrates the caller cursor against that binding and creates `ObservationRepositoryPage`.
2. The repository returns one validated page result. Application rejects over-limit items, wrong binding, noncanonical order, duplicate receipt identity and continuation on an empty result.
3. For each item, application loads only the formal current disposition relation and assembles `IntakeStatusView`; it does not query current outbox, source or raw material.
4. The application maps a same-binding repository continuation to an opaque `ObservationPageCursor`; public output contains no repository position, fingerprint, order revision or row version.

| case | public surface |
|---|---|
| visible page with items | `Present`, non-empty items, `has_more` from validated continuation |
| visible scope with no items | `Empty`, `items=[]`, no next cursor, `has_more=false`; never `NotFound` |
| hidden page items | page visibility policy controls redaction/omission; hidden count and identity cannot be inferred |
| stale projection with old values allowed | preserve page-consistent persisted freshness and degraded marker; no retry/rebuild |
| rebuilding / disabled / unavailable | expose committed rebuild or availability marker; no start/repair call |
| malformed/foreign cursor | `InvalidPageCursor`; never return an empty page |

| condition | mapping | retry/write rule |
|---|---|---|
| invalid scope or limit | `InvalidRequest` | caller correction; no read call beyond validation |
| invalid/foreign cursor | `InvalidPageCursor` | no auto-reset or fallback page |
| repository unavailable | `RepositoryUnavailable` or explicit failed availability surface | no fallback scan or write |
| malformed receipt/disposition relation | persistence invariant violation | fail closed; no item substitution |
| invalid item view state | `InvalidCarrierState` / consistency error | no partial page |
| repeated request | ordinary read repeat | no idempotency record, stored result, audit or outbox |

| Q02 stop item | conclusion |
|---|---|
| request/page DTO | defined at protocol level; canonical page request name remains affected |
| view fields/source | defined by `IntakeStatusView` |
| repository key/order/cursor | defined by `page_receipts_by_status_scope` and exact binding |
| empty/not-visible/stale/rebuilding/disabled/failed | defined with fail-closed branches |
| public/application page mapping | defined at protocol depth; `S08-D-PAGED-RESULT-CARRIER-01` open |
| no-write capability | design-only pass |
| Step 09 handoff | reserved: `GetIntakeStatusFlow` |
| protocol status | `defined_with_affected_open` |


### 12.4 Q03 `GetSafeSignal`

Q03 reads one exact safe signal or a bounded page under one exact `CorrelationContextRef`. It exposes product-neutral safe summary/ref and local signal lifecycle only; raw log, metric, trace, runtime execution body and provider response remain outside the surface.

```rust
pub struct GetSafeSignalRequest {
    pub signal_ref: Option<SafeSignalRef>,
    pub correlation_context_ref: Option<CorrelationContextRef>,
    pub page: Option<ObservationPageRequest>,
}
```

The selector matrix is finite:

| selector | repository callable | public shape | cardinality rule |
|---|---|---|---|
| `signal_ref=Some`, context=None, page=None | `CorrelationSignalRepository::get_signal_with_version(signal_ref)` | single `ObservationQueryResponse<SafeSignalProjectionView>` | exactly one point selector |
| signal=None, context=Some, page=Some | `page_signals_by_context(context_ref, page)` | `ObservationPagedQueryResponse<SafeSignalProjectionView>` at protocol level | exactly one bounded context page |
| both selectors Some | none | invalid request | reject before repository |
| both selectors None | none | invalid request | no global scan or default scope |
| signal Some + page Some | none | invalid request | point/page mismatch |
| context Some + page None | none | invalid request | collection must be explicitly bounded |

`SafeSignalProjectionView` is owned by Step 06 `contracts::views`. Its fields are sourced as follows:

| view field | source | constraint |
|---|---|---|
| `signal_ref` | committed `SafeSignal.signal_ref` | exact point selector match or page identity |
| `signal_kind` | committed signal kind | finite contracts enum; caller cannot override |
| `correlation_context_ref` | committed signal relation | relation must exist and equal the page selector |
| `summary_ref` | committed body-free safe signal summary | ref only; no summary body expansion |
| `runtime_signal_ref` | committed optional boundary ref | does not prove runtime or sandbox success |
| `signal_state` | committed local safe signal state | Candidate/Suppressed rules remain those of Step 06 |
| `visibility` | matching read visibility decision | body allowed only under the declared visibility surface |
| `freshness` | persisted marker plus signal state | Stale cannot become Fresh; Rebuilding cannot rewrite state |

For the context page, `ObservationRepositoryCursorBinding::for_signals_by_context(&context_ref)` binds method tag `signals_by_context`, selector fingerprint and order revision 1. Repository order is ascending `SafeSignalRef` canonical bytes. A point read accepts no public page/cursor; the repository row version is discarded after validation.

| case | public surface |
|---|---|
| recorded, visible and fresh | single Present body or non-empty Present page; availability `Available` |
| recorded but stale and old body allowed | preserve persisted Stale freshness and typed degraded marker; no inline rebuild |
| Candidate or Suppressed | body absent or limited diagnostic-only surface according to Step 06; never default normal success body |
| context has no visible signals | `Empty` page, no continuation; not Missing and not proof of no source telemetry |
| exact signal absent | single Missing/NotFound only after successful committed point read; no placeholder |
| signal not visible / blocked | body None and explicit visibility; do not convert to NotFound |
| rebuilding | old committed body only if policy allows; matching rebuild/freshness marker; no progress mutation |
| disabled / unavailable / failed dependency | explicit availability surface; no raw adapter details or fallback to current signal truth |

| condition | mapping | side-effect rule |
|---|---|---|
| selector cardinality or page mismatch | `InvalidRequest` before repository | no read call |
| invalid/foreign cursor | `InvalidPageCursor` | never return Empty |
| missing/mismatched context relation | persistence consistency error | do not return unrelated signal |
| invalid signal state/freshness view | `InvalidCarrierState` | no partial response/page |
| repository unavailable | `RepositoryUnavailable` or explicit failed availability surface | no adapter activation |
| repeated point/page request | ordinary read repeat | no reservation, stored result, history or outbox |

| Q03 stop item | conclusion |
|---|---|
| request selector/page DTO | defined at protocol level; canonical page request name remains affected |
| view fields/source/redaction | defined by `SafeSignalProjectionView` |
| point/context repository mapping | defined at protocol depth |
| cursor/order/empty semantics | defined at protocol depth for context page; paged result carrier remains affected |
| Candidate/Suppressed/Stale/Rebuilding/Disabled/Failed | defined with fail-closed branches |
| no-write capability | design-only pass |
| Step 09 handoff | reserved: `GetSafeSignalFlow` |
| protocol status | `defined_with_affected_open` |

### 12.5 Q04 `GetSignalRollup`

Q04 reads one exact rollup window or a bounded page under one exact `SignalRollupScope`. It projects local `SignalRollupWindow` count, window, state and source cursor; it never rescans raw signals/metrics/traces or invokes `RebuildSignalRollups` on read.

```rust
pub struct GetSignalRollupRequest {
    pub window_ref: Option<SignalRollupWindowRef>,
    pub scope: Option<SignalRollupScope>,
    pub page: ObservationPageRequest,
}
```

The current Step 06 input includes `page` for both branches, so the exact assembler must normalize the selector/page combinations without inventing a second request shape:

| selector | page interpretation | repository callable | public shape |
|---|---|---|---|
| `window_ref=Some`, scope=None | cursor must be None; bounded limit still validates | `get_rollup_with_version(window_ref)` | single `ObservationQueryResponse<SignalRollupView>` |
| window=None, scope=Some | cursor/limit are valid | `page_rollups_by_scope(scope, page)` | `ObservationPagedQueryResponse<SignalRollupView>` at protocol level |
| both Some | invalid | none | reject |
| both None | invalid | none | reject; no global rollup scan |
| window Some + non-empty cursor | invalid | none | a point target cannot carry collection continuation |

`SignalRollupView` is owned by Step 06 `contracts::views`:

| view field | source | constraint |
|---|---|---|
| `window_ref` | committed `SignalRollupWindow.window_ref` | exact point selector or page identity |
| `scope` | committed complete rollup scope | must equal page selector scope |
| `window_kind` | committed window kind | finite kind; no caller filter substitution |
| `window_start_at` / `window_end_at` | committed closed-open bounds | view factory validates duration/order |
| `state` | committed lifecycle | Pending/Fresh/Stale/Rebuilding/Failed preserved |
| `signal_count` | committed sealed/last-known count | no raw signal rescan |
| `source_cursor` | committed rollup source cursor | not page cursor and not row version |
| `visibility` | matching read policy | whole-body presence control |
| `freshness` | persisted rollup/projection marker | Pending/Failed cannot become Fresh |

Point reads use `get_rollup_with_version(window_ref)`. Scope pages use `ObservationRepositoryCursorBinding::for_rollups_by_scope(&scope)` and `page_rollups_by_scope(&scope, page)`, method tag `rollups_by_scope`, revision 1, position `window_ref` canonical bytes ascending. `ObservationRepositoryPageResult<Versioned<SignalRollupWindow>>` remains application-local; row version and repository cursor internals never cross the public boundary.

| committed state | required public marker | body rule |
|---|---|---|
| `Pending` | freshness `Unknown` or `Rebuilding` | zero/empty body only under explicit policy; never Fresh |
| `Fresh` | freshness `Fresh` | count/cursor matrix must validate |
| `Stale` | `Stale(marker)` or `Rebuilding` | last-known values only if policy allows; no inline rebuild |
| `Rebuilding` | `Rebuilding` and matching persisted surface when required | query cannot advance progress |
| `Failed` | `Stale(marker)` or `Unknown` | never Fresh; local failure is not source truth failure |
| no exact point target | `Missing/NotFound` | only after successful exact lookup; no placeholder |
| empty scope page | `Empty` | empty items, no continuation; not Missing |
| not visible / disabled / unavailable | shared visibility/availability surface | body absent unless explicit limited-degraded policy |

| condition | mapping | prohibited fallback |
|---|---|---|
| dual/missing selector or page mismatch | `InvalidRequest` | infer selector from string |
| invalid cursor or wrong scope binding | `InvalidPageCursor` | reset to first page or return Empty |
| scope/window relation mismatch | persistence consistency error | return row under another scope |
| invalid count/cursor/state/freshness combination | `InvalidCarrierState` | recompute from current signals |
| repository unavailable/disabled | application error or availability surface | adapter activation or provider detail |
| repeated query | ordinary read repeat | no idempotency, stored result, record, outbox or rebuild |

| Q04 stop item | conclusion |
|---|---|
| request selector/page DTO | defined with cardinality rule; canonical page request name remains affected |
| view fields/source | defined by `SignalRollupView` |
| point/scope repository mapping | defined at protocol depth |
| cursor/order/empty semantics | defined at protocol depth for scope page; paged result carrier remains affected |
| Pending/Fresh/Stale/Rebuilding/Failed/Disabled | defined with fail-closed branches |
| no-write capability | design-only pass |
| Step 09 handoff | reserved: `GetSignalRollupFlow` |
| protocol status | `defined_with_affected_open` |

### 12.6 Q01-Q04 cross-protocol audit and affected register

| audit item | Q01 | Q02 | Q03 | Q04 |
|---|---|---|---|---|
| HLD Query -> DDD request -> Rust DTO | request exists; view owner mismatch | protocol mapping defined | protocol mapping defined | protocol mapping defined |
| exact API assembler -> Read method | pass at observed owner level | pass at observed owner level | pass at observed owner level | pass at observed owner level |
| public view owner | blocker | Step 06 owner | Step 06 owner | Step 06 owner |
| repository selector/key | exact point read | exact bounded scope | exact point/context | exact point/scope |
| page helper mapping | not applicable | protocol mapping; carrier open | protocol mapping; carrier open | protocol mapping; carrier open |
| empty / missing distinction | defined | defined | defined | defined |
| visibility / freshness / degraded source | policy + persisted marker | policy + persisted marker | policy + marker + signal state | policy + marker + rollup state |
| query no-write | design-only pass | design-only pass | design-only pass | design-only pass |
| raw body / business truth boundary | closed | closed | closed | closed |
| Step 09 handoff | reserved | reserved | reserved | reserved |

The four records inherit global Step 08 affected items for result ownership, route totality, Step 06/07 propagation, UoW downstream propagation and later protocol-to-flow closure. This batch does not modify formal `03`.

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q01-VIEW-OWNER-01` | `open_upstream_internal` | Q01 inventory, HLD skeleton and Step 07 trait require `ObservationReceiptView`, but Step 06 has no unique declaration, schema, factory or mapping; `IntakeStatusView` is not equivalent | Step 06/07 must select one canonical owner and exact mapping, then update Q01 binding | create the view in Step 08, alias it, or map in API entry |
| `S08-D-QUERY-SURFACE-MAPPER-01` | `open_internal_affected` | `ObservationQueryResult<T>` has common surfaces, but per-query degraded precedence and material source map is not recorded in Step 07 | bind each Query's mismatch/partial material to a finite degraded/error mapper | derive degraded kind from ref text, exception or first failed dependency |
| `S08-D-Q02-PAGE-DISPOSITION-01` | `open_internal_affected` | Q02 page item needs lossless receipt->disposition relation mapping and missing/duplicate precedence; the exact response assembler owner is not propagated | assign per-item mapper and page atomicity rule in Step 06/07 repair | query current outbox or manufacture Pending |
| `S08-D-Q03-SELECTOR-CARDINALITY-01` | `open_internal_affected` | Q03 optional signal/context/page branches lack a named Step 07 mapper/owner for exact cardinality | bind all selector branches to assembler/service signatures | global scan, default context or point-read substitution |
| `S08-D-Q04-SELECTOR-CARDINALITY-01` | `open_internal_affected` | Q04 point/scope branches share a page field but use different repository shapes; normalization and point-cursor prohibition lack an explicit owner | bind branch normalization and page semantics before implementation | infer selector, accept point cursor or rebuild on read |
| `S08-D-PAGED-RESULT-CARRIER-01` | `open_internal_affected` | Step 07 returns `ObservationQueryResult<T>` for all queries, while Q02-Q04 require an application carrier for items and same-binding continuation; no unique owner or exact signature mapping exists | select/define the canonical application paged-result carrier in Step 06/07 and bind Q02-Q04; Step 08 must not invent it | cast a single result into a page, assemble in API handler or expose repository page result |
| `S08-D-PAGE-REQUEST-TYPE-01` | `open_upstream_internal` | Step 06 input registry uses `ObservationPublicPageRequest`, while S08-B current public owner is `ObservationPageRequest`; no formal declaration/alias for the former was found | select one canonical owner and propagate exact name/fields through input, assembler and protocol | compatibility alias, Step 08-only rename or dual schema |

### 12.7 Historical S08-D Q01-Q04 batch stop gate

| check | conclusion |
|---|---|
| Q01-Q04 each has independent request, response, source, branch, error, no-write and Step 09 handoff record | pass with affected open |
| Q02-Q04 public view fields map to unique Step 06 owners | design-only pass |
| Q01 public view owner closed | no; `S08-D-Q01-VIEW-OWNER-01` open |
| paged application result carrier uniquely owned | no; `S08-D-PAGED-RESULT-CARRIER-01` open |
| public page request type has one canonical owner | no; `S08-D-PAGE-REQUEST-TYPE-01` open |
| repository page helper mapped without leaking application cursor | protocol-depth pass for Q02-Q04 |
| empty/missing/not-visible/stale/rebuilding/disabled/failed distinguished | pass with affected open |
| Query cannot reserve/write/refresh/rebuild/repair/call external adapter | design-only pass |
| new external upstream blocker | none |
| known controlled upstream blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`, unrelated to Q01-Q04 semantics |
| protocol count after this batch | `20/60 defined_with_affected_open`; `0/60 unconditional complete` |
| next action | stop and wait for explicit user confirmation before the next Query sub-batch beginning with Q05; do not enter S08-E or read later protocol families |

This is a historical design-only checkpoint, not the current Step 08 recovery point. The current recovery point is recorded in §13 and the synchronized calibration ledgers.

## 13. S08-D Query Q05 current batch

### 13.1 Batch boundary and shared Query rules

本批只覆盖 `GetAuditTimeline`。Q05 是只读的 observability-owned audit projection 查询：它读取本地 `AuditProjection` 的 append projection、已验证的 body-free linkage/gap relation 和正式 read markers；它不读取 source audit body，不拥有 source audit truth、业务审计结论、evidence body、验收签署或 report body。

| 项 | current ruling |
|---|---|
| request wrapper | `ObservationQueryRequest<GetAuditTimelineRequest>`；query name 必须与 sealed body 一致，actor/visibility/consistency/trace 来自 `ObservationQueryMetadata` |
| request body | typed `AuditSubjectRef + ObservationPageRequest`；不接受 actor、window marker、gap set、source body 或 external locator |
| response shape | protocol-level `ObservationPagedQueryResponse<AuditTimelineView>`；application paged carrier 尚无唯一 current owner，登记 `S08-D-Q05-QUERY-CARRIER-01` |
| read façade | 当前上游仍是 `ObservationReadService::get_audit_timeline -> ObservationQueryResult<AuditTimelineView>`；不得把该单体 carrier解释成分页 carrier |
| repository | `AuditEvidenceRepository::page_audit_timeline(subject_ref, repository_page)`；只返回 body-free、relation-validated `AuditTimelineEntryView` 页面 |
| cursor binding | `ObservationRepositoryCursorBinding::for_audit_timeline(subject_ref)`；public continuation 与 local `ObservationCursor` 不同 |
| order | `(appended_at ASC, append_record_ref canonical bytes ASC)`，revision 1，keyset only |
| write lane | none；不创建 UoW、reservation、stored result、read-access audit、history、outbox 或 retention mutation |
| next gate | Q05 停审后等待用户确认，确认后才读取 Q06 所需输入 |

### 13.2 Logical binding and callable chain

```rust
pub struct GetAuditTimelineRequest {
    /// Stable observability-owned subject selector; never source audit body.
    pub subject_ref: AuditSubjectRef,
    /// Opaque public continuation and bounded item limit.
    pub page: ObservationPageRequest,
}
```

```text
Query / GetAuditTimeline / GetAuditTimelineRequest
  -> API exact GetAuditTimeline handler
  -> ObservationApiInputAssembler::get_audit_timeline
  -> ObservationReadService::get_audit_timeline
  -> ObservationRepositoryCursorBinding::for_audit_timeline(subject_ref)
  -> AuditEvidenceRepository::page_audit_timeline(subject_ref, repository_page)
  -> AuditTimelineEntryList
  -> AuditTimelineView
  -> ObservationPublicPage<AuditTimelineView>
  -> ObservationPagedQueryResponse<AuditTimelineView>
```

当前 Step 06 input registry 仍使用 `ObservationPublicPageRequest` 的旧拼写，而 S08-B canonical public owner 是 `ObservationPageRequest`。Q05 使用 canonical public name，但不创建 alias、双字段或 Step 08-only compatibility mapping；该冲突继续由 `S08-D-PAGE-REQUEST-TYPE-01` 约束。

当前 input 没有 `AuditTimelineWindow` 字段。Q05 不得使用 query time、source event time、subject ref 解析或 full-history default 补齐窗口；必须由 Step 06/07 的正式 typed input/resolver 先闭合，否则 Q05 fail closed，登记 `S08-D-Q05-WINDOW-SOURCE-01`。

### 13.3 Response view and field-source closure

Q05 的 canonical response body 是 Step 06 `AuditTimelineView`，不在 Step 08 创建替代 view：

| field | type | current source | rule |
|---|---|---|---|
| `subject_ref` | `AuditSubjectRef` | exact request selector | must equal the request; never parse strings |
| `time_window` | `AuditTimelineWindow` | typed query input or formal window resolver | source is not uniquely propagated; fail closed and keep `S08-D-Q05-WINDOW-SOURCE-01` open |
| `entries` | `AuditTimelineEntryList` | repository page mapped through Step 06 list factory | only body-free, same-subject, same-window, relation-validated entries |
| `gap_refs` | `GapStateRefSet` | formal same-subject/window gap projection | empty is allowed only when the formal source proves no known gap; keep `S08-D-Q05-GAP-SOURCE-01` open |
| `visibility` | `VisibilitySurface` | committed `ReadVisibilityDecision` and exact application mapper | never row existence, HTTP status, cursor or actor inference |
| `freshness` | `ObservationProjectionFreshnessSurface` | committed projection/read marker | query time cannot create `Fresh`; keep `S08-D-Q05-FRESHNESS-SOURCE-01` open |
| `as_of_cursor` | `Option<ObservationCursor>` | same committed observation snapshot boundary used for view assembly | local snapshot marker, never public continuation cursor |

`AuditTimelineEntryView` is body-free. Its permitted fields are `append_record_ref`, `projection_ref`, finite `append_kind`, body-free `source_audit_ref`, safe `source_audit_summary_ref`, kind-specific linkage/gap ref, local `projection_state`, item visibility and local `appended_at`. `appended_at` is not source occurred-at. Raw log/metric/trace/audit/evidence body, provider response, credential, locator, actor profile, final verdict, signoff and real run identity are prohibited.

The entry relation is atomic: a dangling linkage/gap ref, conflicting duplicate append ref, invalid kind-specific field combination or noncanonical order is a consistency/invariant failure. Q05 must not omit the row, fabricate a gap, select the first relation or return a partial page.

### 13.4 Page and cursor mapping

The public page mapping is:

```text
ObservationPageRequest
  -> ObservationRepositoryPage
  -> ObservationRepositoryPageResult<AuditTimelineEntryView>
  -> AuditTimelineEntryList
  -> AuditTimelineView
  -> ObservationPublicPage<AuditTimelineView>
  -> ObservationPagedQueryResponse<AuditTimelineView>
```

`ObservationRepositoryPage` and `ObservationRepositoryPageResult` remain application-local. The API handler cannot consume the repository result directly, and it cannot cast `ObservationQueryResult<AuditTimelineView>` into a public page. The exact application carrier and final response assembler are not uniquely owned by current Step 07 material; this is `S08-D-Q05-QUERY-CARRIER-01`.

The selector is exactly one `AuditSubjectRef`. The repository call is exactly `page_audit_timeline(subject_ref, repository_page)`. The cursor is accepted only when its method tag, subject fingerprint and order revision match `for_audit_timeline(subject_ref)`. Foreign, malformed, non-advancing, over-limit or order-conflicting continuation is `InvalidPageCursor`, never Empty and never an automatic reset to the first page.

`AuditTimelineWindow` is closed-open `[start_at, end_at)`. It must be applied before or together with page selection, and every returned entry must match the selected subject and window. An out-of-window entry is a consistency defect, not an item to silently drop. Offset pagination, provider cursor, row version and adapter-selected order are forbidden.

### 13.5 Empty, visibility, freshness and degraded behavior

| condition | public Q05 surface | rule |
|---|---|---|
| visible non-empty page | `Present` with non-empty items and validated continuation | all entries remain within outer visibility |
| visible empty page | `Empty`, empty items, no continuation | empty local projection does not prove source audit absence |
| hidden subject/page | body absent or policy-defined redaction with `NotVisible`/`Unknown` | do not disclose existence, count or source identity |
| restricted/limited degraded | body only when policy permits; preserve gap/reason markers | do not synthesize normal success or widen item visibility |
| stale projection | persisted stale marker and old values only if policy permits | no refresh, repair or rebuild |
| rebuilding | persisted rebuilding/progress surface when available | Q05 cannot start or advance maintenance |
| disabled/unavailable | typed availability/error surface | no adapter activation or source fallback |
| relation/shape corruption | consistency/invariant error | no partial response or fabricated gap |

An empty page has no item from which to derive visibility. A dedicated page/list visibility seed and resolver are therefore required; deriving visibility from the empty result, cursor, first item or route is forbidden. This is `S08-D-Q05-PAGE-VISIBILITY-01`.

The generic `ObservationQueryResult<T>` does not provide Q05-specific degraded precedence or a material source map for gap, partial-entry, marker-mismatch and availability cases. Q05 must use a finite typed mapper supplied by Step 07; it cannot select the first failed dependency or parse error text. This is `S08-D-Q05-SURFACE-MAPPER-01`.

`gap_refs`, `freshness` and `as_of_cursor` must be sourced from formal typed committed material. They cannot be inferred from an empty entries list, last entry timestamp, row version, page cursor, current rebuild state or query clock. The missing gap and freshness source contracts remain `S08-D-Q05-GAP-SOURCE-01` and `S08-D-Q05-FRESHNESS-SOURCE-01`.

### 13.6 Error and no-write matrix

| condition | mapping | side effect |
|---|---|---|
| malformed query name, subject or page | `InvalidRequest` | reject before repository; no write |
| foreign/malformed cursor | `InvalidPageCursor` | no fallback page, no UoW |
| valid scope with no visible local entries | `Empty` | none; not Missing |
| exact subject/window absence proven by a formal lookup | typed missing surface only if the Q05 mapper defines it | do not convert to Empty without source authority |
| hidden/not-visible | visibility surface with body/count/identity redaction | none |
| stale/rebuilding/disabled | persisted freshness/rebuild/availability surface | no refresh/repair/rebuild |
| dangling relation or invalid entry combination | persistence invariant/consistency error | no partial page |
| repository unavailable | `RepositoryUnavailable` or typed availability surface | no external adapter activation or source fallback |
| repeated identical query | ordinary read repeat | no reservation, stored result, read-access audit or outbox |

Q05 has no idempotency key, duplicate result, synchronous read audit or durable read history. Query digest, if carried by shared metadata, is input integrity only and never enters a write lane.

### 13.7 Step 09 handoff

`GetAuditTimelineFlow` is the sole reserved Step 09 handoff. It must consume the Q05 contract without redefining it:

```text
GetAuditTimelineInput
  -> exact visibility resolution for AuditTimeline(subject, window)
  -> for_audit_timeline(subject) + page_audit_timeline(subject, page)
  -> subject/window/order/relation validation
  -> typed gap/freshness/degraded source mapper
  -> AuditTimelineEntryList + AuditTimelineView
  -> public paged response assembler
```

The historical `AuditTimelineQuery` placeholder is not a current repository argument or public DTO. Step 09 must not add a UoW, mutation, source adapter call, projection repair, timeline rebuild or business-truth write to this chain.

### 13.8 Q05 current stop review

| check | conclusion |
|---|---|
| independent request, response, page, cursor, error, no-write and handoff record | pass with affected open |
| truth boundary remains observability-owned projection only | pass |
| source audit/business truth/body/evidence/signoff ownership remains external | pass |
| exact repository method, binding and order | pass: `page_audit_timeline`, `for_audit_timeline`, `(appended_at, append_record_ref)` |
| window source | open: `S08-D-Q05-WINDOW-SOURCE-01` |
| application page carrier and final mapper | open: `S08-D-Q05-QUERY-CARRIER-01`, `S08-D-Q05-SURFACE-MAPPER-01` |
| empty-page visibility seed | open: `S08-D-Q05-PAGE-VISIBILITY-01` |
| freshness/as-of source | open: `S08-D-Q05-FRESHNESS-SOURCE-01` |
| gap source | open: `S08-D-Q05-GAP-SOURCE-01` |
| zero-write boundary | design-only pass; no UoW/reservation/stored result/audit/outbox/repair/rebuild/external call |
| new external upstream blocker | none |
| current protocol count | `21/60 defined_with_affected_open`; `0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q06 |

This current Q05 section and its standalone calibration artifact are design-only discussion material. They are not formal `03` backfill, implementation result, test result, evidence alias, acceptance sign-off or commit.

## 14. Historical Q05 recovery checkpoint

Q05 批次结束时的历史恢复点为：

```text
Step08_S08-D_Q05_defined_with_affected_open_waiting_user_before_Q06
```

该恢复点已由当前 Q06 批次承接；Q05 standalone 产物仍是 Q05 的独立历史停审记录，不代表当前恢复点。正式 `03` 仍冻结，Q05 不产生实现、测试、验收或提交结论。

## 15. S08-D Query Q06 `GetEvidenceIndexInput`

Q06 的完整逐协议讨论位于 `03_ddd_step_08_query_q06_evidence_index_input.md`。本节只登记 Step 08 总协议所需的 current binding、字段来源、分支、边界和停审结论；不在总表中创建第二个 view owner。

### 15.1 Batch boundary and logical binding

| 项 | current contract |
|---|---|
| protocol | `Query / GetEvidenceIndexInput / GetEvidenceIndexInputRequest` |
| request body | `scope_ref: EvidenceIndexScopeRef`; `handoff_ref: Option<ReportHandoffRecordRef>` |
| application input | `GetEvidenceIndexInputInput`，名称沿用 Step 06/07；禁止重命名 |
| exact assembler | `ObservationApiInputAssembler::get_evidence_index_input(ObservationQueryRequest<GetEvidenceIndexInputRequest>) -> Result<GetEvidenceIndexInputInput, ApplicationError>` |
| exact read façade | `ObservationReadService::get_evidence_index_input(GetEvidenceIndexInputInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<EvidenceIndexInputView>>`；public carrier仍需 Q06 mapper closure |
| canonical view | Step 06 §16.6 `EvidenceIndexInputView` |
| public response target | non-paged `ObservationQueryResponse<EvidenceIndexInputView>` |
| Step 09 handoff | `GetEvidenceIndexInputFlow` |
| write lane | none |

Q06 request 没有 public page。`scope_ref` 不等于 `EvidenceConsumerScope`，也不承担访问授权；`handoff_ref` present 只选择已提交 snapshot lookup 分支，不触发 prepare、append 或 delivery。

### 15.2 Current repository bindings

```rust
AuditEvidenceRepository::page_linkages_by_evidence_scope(
    &EvidenceIndexScopeRef,
    ObservationRepositoryPage
) -> ApplicationPortFuture<
    '_,
    ObservationRepositoryPageResult<Versioned<EvidenceLinkage>>
>
```

```rust
ObservationRepositoryCursorBinding::for_linkages_by_evidence_scope(
    &EvidenceIndexScopeRef
)
```

The fixed internal order is `linkage_ref ASC`. The repository page and cursor binding remain application-private. They do not provide a public continuation cursor and do not by themselves prove complete projection/gap aggregation, common freshness, visibility or snapshot cursor.

```rust
ReportHandoffRepository::get_evidence_index_input(
    &EvidenceIndexInputViewRef
) -> ApplicationPortFuture<Option<EvidenceIndexInputView>>
```

`ReportHandoffRepository::append_evidence_index_input` is a write-UoW callable for Command / handoff preparation only. Q06 must never call it.

### 15.3 Response field-source closure

| field | canonical owner | current source rule |
|---|---|---|
| `input_ref` | Step 06 `EvidenceIndexInputView` | immutable snapshot identity；preview mint/rehydrate authority remains affected by `S08-C07-IMMUTABLE-INPUT-REF-01` |
| `consumer_scope` | Step 06 contracts scope carrier | must come from formal scope-to-consumer relation；cannot be derived from request ref/purpose/default |
| `linkage_refs` | Step 06 `EvidenceLinkageRefSet` | bounded linkage material from exact evidence scope；max 1024；internal page is not public page |
| `audit_projection_refs` | Step 06 `AuditProjectionRefSet` | validated linkage-to-projection relation；max 256；no ref-byte inference |
| `gap_refs` | Step 06 `GapStateRefSet` | same scope/consumer/committed boundary typed gap relation；empty cannot hide known gap |
| `visibility` | formal read/evidence policy surface | Q06-specific decision/source and empty/hidden mapping remain affected |
| `freshness` | persisted observation marker | must share one committed boundary with all sets；query time/row version forbidden |
| `as_of_cursor` | committed observation snapshot cursor | same boundary as all material；not repository page cursor |
| `assembled_at` | Step 06 local assembly clock | local assembly time only；not evidence/source/report time |

`EvidenceIndexInputView::from_snapshot(...)` remains the sole shape validator. It rejects a Visible empty input and enforces the Step 06 visibility/content matrix; Q06 does not relax those rules or expose any raw body, locator, credential, provider response, verdict, signoff or real run identity.

### 15.4 Two read branches

| branch | read contract | prohibited action |
|---|---|---|
| `handoff_ref = None` | resolve formal scope and consumer relation; read bounded linkage/projection/gap material under one committed boundary; obtain policy visibility, freshness and cursor; construct transient `EvidenceIndexInputView` preview | append snapshot, create UoW, scan unknown pages, rebuild current material or infer missing fields |
| `handoff_ref = Some(_)` | read committed handoff; validate requested scope, handoff scope, consumer scope and input-ref relation; call exact immutable input lookup; return stored snapshot without rebuilding | fall back to preview, reconstruct from current linkage/projection/gap, overwrite or refresh snapshot |

The internal linkage page can only be consumed through a future bounded composite application carrier or a finite internal aggregation contract. Until Step 06/07 supplies that carrier, Q06 must fail closed on unknown-page aggregation, overflow, cross-boundary material or incomplete relation proof. The repository page cannot be exposed as `ObservationPublicPage`.

### 15.5 Presence, visibility, freshness and error boundary

| condition | Q06 surface | rule |
|---|---|---|
| valid visible candidate | `ObservationQueryResponse<EvidenceIndexInputView>` with `Present` body | all set bounds, relation, policy and factory checks pass |
| Visible empty candidate | typed empty/blocked/degraded policy surface | do not construct a Visible empty `EvidenceIndexInputView` |
| hidden or restricted | `NotVisible` / policy-defined restricted surface | no set count, scope membership, handoff existence or identity leak |
| limited degraded | typed `DegradedSurface` with explicit limited allowance | only permitted body-free refs; preserve gap/reason |
| stale/rebuilding | persisted freshness/rebuild surface | no refresh, repair or rebuild on read |
| bound overflow or relation mismatch | typed bound/consistency error | no truncation or partial body |
| handoff missing | typed missing/availability surface | no preview fallback |
| repository unavailable | typed availability/error surface | no external adapter or source fallback |

Degraded precedence and material source mapping must be supplied by a finite Step 07 Q06 mapper. Q06 cannot derive a surface from error text, ref text, empty vectors or first-failed-dependency order.

### 15.6 Affected register and stop review

Q06 registers the following eight affected items in `03_ddd_step_08_affected_inventory.md` and in the standalone artifact:

| ID | status |
|---|---|
| `S08-D-Q06-SCOPE-OWNER-01` | `open_upstream_internal` |
| `S08-D-Q06-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q06-CONSUMER-SCOPE-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q06-SCOPE-READ-CARRIER-01` | `open_internal_affected` |
| `S08-D-Q06-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q06-FRESHNESS-CURSOR-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q06-GAP-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q06-HANDOFF-BINDING-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/view/branch/source/error/no-write/handoff record | `pass_with_affected_open` |
| canonical view and body-free boundary | pass; Step 06 §16.6 remains owner |
| exact assembler, service and linkage page binding | pass at observed owner level; composite carrier remains affected |
| handoff branch no-write and immutable return rule | pass by design; cross-relation binding remains affected |
| all eight new affected registered | pass |
| new external upstream blocker | none; `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `22/60 defined_with_affected_open`; `0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q07 |

Q06 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 16. Historical Q06 recovery checkpoint

Q06 批次结束时的历史恢复点为：

```text
Step08_S08-D_Q06_defined_with_affected_open_waiting_user_before_Q07
```

该恢复点已由当前 Q07 批次承接；Q06 standalone 产物仍是 Q06 的独立历史停审记录，不代表当前恢复点。正式 `03` 仍冻结，Q06 不产生实现、测试、验收或提交结论。

## 17. S08-D Query Q07 `GetReportHandoff`

Q07 的完整逐协议讨论位于 `03_ddd_step_08_query_q07_report_handoff.md`。本节只登记 Step 08 总协议所需的 request、目标 view、只读关系链、surface 和 affected；不在总表中创建 `ReportHandoffView` 或 public state type 的第二 owner。

### 17.1 Batch boundary and logical binding

| 项 | current contract |
|---|---|
| protocol | `Query / GetReportHandoff / GetReportHandoffRequest` |
| request body | `handoff_ref: ReportHandoffRecordRef` |
| application input | `GetReportHandoffInput` |
| exact assembler | `ObservationApiInputAssembler::get_report_handoff(ObservationQueryRequest<GetReportHandoffRequest>) -> Result<GetReportHandoffInput, ApplicationError>` |
| exact read facade | `ObservationReadService::get_report_handoff(GetReportHandoffInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<ReportHandoffView>>` |
| public response target | non-paged `ObservationQueryResponse<ReportHandoffView>` |
| Step 09 handoff | `GetReportHandoffFlow` |
| page / cursor / write lane | none |

The request accepts only one exact handoff ref. Consumer, scope, input, hint, state, readiness, visibility, actor, page, cursor, report body, provider locator and retry controls are not request fields. The standalone public request declaration and decoder binding remain affected.

### 17.2 Current repository bindings and forbidden calls

```rust
ReportHandoffRepository::get_handoff_with_version(
    &ReportHandoffRecordRef
) -> ApplicationPortFuture<Option<Versioned<ReportHandoffRecord>>>
```

```rust
ReportHandoffRepository::get_evidence_index_input(
    &EvidenceIndexInputViewRef
) -> ApplicationPortFuture<Option<EvidenceIndexInputView>>
```

```rust
ReportHandoffRepository::get_authenticity_hint_with_version(
    &AuthenticityHintRef
) -> ApplicationPortFuture<Option<Versioned<AuthenticityHint>>>
```

```rust
ReportHandoffRepository::find_authenticity_hint_by_handoff(
    &ReportHandoffRecordRef
) -> ApplicationPortFuture<Option<Versioned<AuthenticityHint>>>
```

`Versioned<T>` remains application-private; row version is neither a public field nor a freshness marker. Q07 must not call `append_evidence_index_input`, `stage_handoff`, `stage_authenticity_hint`, `append_lifecycle_record`, either handoff read guard, any UoW, P6/P7 evaluation, prepare/deliver logic or an external adapter.

### 17.3 Target `ReportHandoffView` semantics

Current Step 07 uses `ReportHandoffView`, but Step 06 has no unique declaration, module, factory or mapper. Q07 therefore fixes the minimum semantics that the eventual contracts owner must carry without declaring a Step 08 owner:

| semantic field | exact source | rule |
|---|---|---|
| handoff/scope/consumer/input refs | committed `ReportHandoffRecord` | request ref must match; immutable relation fields cannot be parsed from one another |
| lifecycle state | committed handoff current state | Draft/Prepared/Delivered/Failed/Cancelled remain Present local states |
| readiness | committed persisted P7 result | Pending/Ready/Blocked/Degraded are read data; Query never re-evaluates P7 |
| optional authenticity view | attached ref + direct hint lookup + current-by-handoff lookup | all identities and handoff ownership must agree; no boolean verdict shortcut |
| aggregate gap refs | committed handoff current effective set | kept separate from hint gaps; empty does not prove external completeness |
| readiness visibility | committed handoff P7 snapshot field | distinct from current request-scoped response visibility |
| retention marker ref | committed handoff relation | ref only; no hold/release/cleanup |
| delivery result and block reason | committed finite local values | `Delivered` is not external acceptance; blocked reason is not parsed from error text |
| local update/evaluation times | committed aggregate/hint times | displayable local times, never response freshness |

`no_write_guard_scope`, repository version, policy basis, H4 payload, external intent/token/receipt, report/evidence body, provider locator, credentials, real run id, evidence alias, verdict and signoff are excluded from the public view.

Domain handoff/readiness/hint/delivery/reason/origin enums require finite contracts-owned public secondary types or an explicitly allowed low-dependency reuse. Direct domain leakage, serde/debug string casts and compatibility aliases are prohibited.

### 17.4 Composite read and relation closure

The target read chain is:

```text
exact request + metadata validation
  -> request-scoped visibility / existence-disclosure decision
  -> exact handoff lookup
  -> immutable input lookup by the stored input ref
  -> optional direct hint lookup plus current-by-handoff lookup
  -> handoff/input/hint relation and condition validation
  -> composite freshness/availability summary
  -> finite public type mapping
  -> ReportHandoffView
  -> ObservationQueryResponse<ReportHandoffView>
```

The handoff, immutable input and hint must be observed under one named composite read boundary or a proven read transaction. Cross-time row stitching cannot produce a normal body. Required relation checks include:

1. loaded handoff identity equals the request;
2. the stored immutable input exists and its identity equals the handoff field;
3. handoff scope/consumer and input consumer/snapshot relation pass a typed mapping;
4. absent attached hint requires no current-by-handoff hint;
5. an attached hint must exist, belong to the same handoff and equal the sole current-by-handoff hint;
6. dangling, duplicate or mismatched relation returns a consistency failure, never partial body or Missing.

H4 `HandoffLifecycleRecord` is append-only audit truth, but current Step 07 exposes only its writer. Q07 therefore returns aggregate current state only. The final design must either confirm current-state-only behavior or add a bounded, ordered H4 read projection; Q07 does not scan history or fabricate a latest record from time/version.

### 17.5 Presence, visibility, freshness and no-write boundary

| condition | Q07 surface | rule |
|---|---|---|
| visible relation-valid handoff | `Present` with one view | all aggregate/input/hint/type checks pass |
| exact handoff absent and existence may be disclosed | `Missing(NotFound)` | no Draft creation or selector fallback |
| hidden / existence not safely classifiable | NotVisible or policy-defined `Unknown` | no scope, consumer, input, hint or state leak |
| input/hint relation broken | typed consistency error | not Missing, not limited partial body |
| repository unavailable | typed availability/error | no external/source fallback |
| local Failed/Blocked/Degraded/Cancelled state | `Present` local state | state name does not trigger retry, repair or write |

Q07 is a point read; `ObservationQueryPresence::Empty` is invalid. Current response visibility comes from request metadata and a formal read mapper; persisted handoff readiness visibility cannot replace it. Response freshness must cover handoff, input, hint and visibility together. `updated_at`, `evaluated_at`, row version, input-only freshness, query time and rebuild state cannot fabricate `Fresh`.

`Delivered` records only a local boundary result, not external acceptance, report correctness or signoff. `RealEvidenceLinked` is a body-free origin hint, not an authenticity verdict. Repeated Q07 calls create no reservation, stored result, read audit, H4 record, outbox or mutation.

### 17.6 Affected register and stop review

Q07 registers the following ten affected items:

| ID | status |
|---|---|
| `S08-D-Q07-VIEW-OWNER-01` | `open_upstream_internal` |
| `S08-D-Q07-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q07-HANDOFF-READ-CARRIER-01` | `open_internal_affected` |
| `S08-D-Q07-INPUT-RELATION-01` | `open_internal_affected` |
| `S08-D-Q07-HINT-RELATION-01` | `open_internal_affected` |
| `S08-D-Q07-LIFECYCLE-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q07-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q07-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q07-SURFACE-MAPPER-01` | `open_internal_affected` |
| `S08-D-Q07-PUBLIC-TYPE-MAPPING-01` | `open_upstream_internal` |

| stop item | conclusion |
|---|---|
| independent request/view/source/read-chain/relation/error/no-write/handoff record | `pass_with_affected_open` |
| exact assembler, Read facade and four read callables | pass at observed owner level; composite carrier remains affected |
| target view semantics without a Step 08 owner | pass; unique owner and public secondary mappings remain affected |
| immutable input and hint relation matrices | target behavior defined; exact relation owners remain affected |
| lifecycle history boundary | current-state-only for Q07; final upstream decision remains affected |
| zero-write and no external truth upgrade | pass |
| all ten Q07 affected registered | pass |
| new external upstream blocker | none; `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `23/60 defined_with_affected_open`; `0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q08 |

Q07 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 18. Historical Q07 recovery checkpoint

Q07批次结束时的历史恢复点为：

```text
Step08_S08-D_Q07_defined_with_affected_open_waiting_user_before_Q08
```

该恢复点已由当前Q08批次承接；Q07 standalone产物仍是Q07的独立历史停审记录，不代表当前恢复点。正式`03`仍冻结，Q07不产生实现、测试、验收或提交结论。

## 19. Historical S08-D Query Q08 `GetRetentionProtection`

Q08的完整逐协议讨论位于`03_ddd_step_08_query_q08_retention_protection.md`。本节只登记Step08总协议所需的request、目标view、retention只读关系链、surface和affected；不在总表中创建`RetentionProtectionView`或application input的第二owner。

### 19.1 Protocol binding and exact callable

| item | current contract |
|---|---|
| logical binding | `Query / GetRetentionProtection / GetRetentionProtectionRequest` |
| request body | one complete `protected_ref: ProtectedObservationRef`; public declaration remains affected |
| exact assembler | `ObservationApiInputAssembler::get_retention_protection(ObservationQueryRequest<GetRetentionProtectionRequest>) -> Result<GetRetentionProtectionInput, ApplicationError>` |
| exact Read facade | `ObservationReadService::get_retention_protection(GetRetentionProtectionInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<RetentionProtectionView>>` |
| public response | non-paged `ObservationQueryResponse<RetentionProtectionView>`; `Empty` is invalid |
| truth boundary | current observation-owned retention marker/protection only; no cleanup, archive, source or consumer business truth |
| later flow | `GetRetentionProtectionFlow` |

`GetRetentionProtectionInput` and its four Query control fields reuse the unique `application::inputs` owner closed by R06.8-A; Q08 does not register a duplicate input-carrier affected item. The request's complete `ProtectedObservationRef` includes state and an optional marker ref; those fields are selector snapshot inputs, not current repository truth.

### 19.2 Read owners and relation boundary

The known read callables are:

- `find_retention_by_protected_ref` for the intended sole current marker;
- `get_retention_with_version` for exact marker point parity when required;
- `get_active_protection_with_version` for the marker-attached relation;
- `page_active_protections_by_protected_ref` for the bounded protection lifecycle.

Q08 must resolve a canonical selector authority, load the sole marker, validate the request/marker target and nested marker relation, point-load an attached protection, and boundedly prove that no conflicting current protection exists. It cannot read only the first internal page or pick the first `protection_ref`. The marker, protection, relation proof, current visibility and freshness must belong to one named composite committed boundary.

H5 `RetentionChangeRecord` remains append-only audit truth. Step07 exposes only `append_retention_record`, so Q08 is current-state-only: it does not return a timeline, latest record or historical consumer association and does not infer one from row version, state, time or repository order.

### 19.3 Target view semantics

`RetentionProtectionView` has no current canonical owner. The eventual contracts owner must preserve, at minimum:

| section | required safe semantics |
|---|---|
| protected target | canonical resolved `ProtectedObservationRef`, not a blind echo of a stale request snapshot |
| marker | identity, current state, purpose, attached protection ref, archive eligibility hint, conditional release/conflict reason |
| active protection | optional exact relation with identity, reason, current state, canonical current consumer set and conditional release/conflict reason |
| public secondary types | owned with the `RetentionProtectionView` schema and total mapper, or explicitly allowed low-dependency reuse; no domain object leakage or string cast |
| consumer disclosure | operation-specific visibility/redaction rule; no endpoint, credential, display name, config or business status |

`ReleaseEligible`, `Expired` and relation `Released` are local evaluation/lifecycle states. None means cleanup authorized/executed, source deleted, archive package deleted or Archive accepted. `archive_eligibility_ref` is a local hint only. The view cannot collapse these states into `protected: bool` or `cleanup_allowed: bool`.

### 19.4 Presence, visibility, freshness and no-write

| condition | Q08 surface | rule |
|---|---|---|
| visible selector/relation-valid marker | `Present` with one view | protection may be absent only when the complete relation proof permits it |
| canonical visible target conclusively has no marker | `Missing(NotFound)` | no synthetic `Unmarked` marker |
| hidden/existence not safely classifiable | NotVisible or policy-defined `Unknown` | no target/marker/protection/consumer/state leak |
| stale selector or nested marker mismatch | typed selector conflict/error | not Missing and no request-snapshot fallback |
| marker/protection relation broken | typed consistency error | no partial marker-only body |
| repository or bounded relation proof unavailable | typed availability/Unknown | no first-page/first-row fallback |
| Conflict/Conflicted/ReleaseEligible/Expired/Released state | `Present` local state | state name does not trigger P8, release, cleanup or archive action |

Response visibility comes from current request metadata and a formal read mapper. Marker/protection state, purpose, consumers and row existence cannot authorize disclosure. Response freshness must cover selector resolution, marker, protection, relation proof and visibility together; row version, request time/state, domain state and repository cursor cannot fabricate`Fresh`.

Repeated Q08 calls create no reservation, stored result, read audit, H5 record, outbox, marker/protection mutation or cleanup task. Q08 never callsP8, release, archive/cleanup adapter, refresh, repair or rebuild.

### 19.5 Affected register and stop review

Q08 registers the following ten affected items:

| ID | status |
|---|---|
| `S08-D-Q08-VIEW-OWNER-01` | `open_upstream_internal` |
| `S08-D-Q08-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q08-SELECTOR-AUTHORITY-01` | `open_internal_affected` |
| `S08-D-Q08-RETENTION-READ-CARRIER-01` | `open_internal_affected` |
| `S08-D-Q08-PROTECTION-RELATION-01` | `open_internal_affected` |
| `S08-D-Q08-HISTORY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q08-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q08-CONSUMER-DISCLOSURE-01` | `open_internal_affected` |
| `S08-D-Q08-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q08-SURFACE-MAPPER-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/view/source/read-chain/relation/error/no-write/handoff record | `pass_with_affected_open` |
| exact assembler, Read facade and four retention read callables | pass at observed owner level; composite carrier remains affected |
| target view semantics without a Step08 owner | pass; the unique view owner also carries nested public mapping, while consumer disclosure remains separately affected |
| stateful selector and marker/protection relation matrices | target behavior defined; exact resolver/current relation owners remain affected |
| H5 history boundary | current-state-only for Q08; final upstream decision remains affected |
| zero-write and no cleanup/archive truth upgrade | pass |
| all ten Q08 affected registered | pass |
| new external upstream blocker | none; `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `24/60 defined_with_affected_open`; `0/60` unconditional complete |
| next action | historical checkpoint；当前已由Q09独立记录承接，不得把本节的`24/60`计数当作current恢复点 |

Q08 is design-only discussion material. It does not modify formal`03`, does not claim implementation/test/acceptance evidence, and does not create a commit. Its standalone product remains the historical Q08 stop record.

## 20. S08-D Query Q09 `GetObservationReadModel`

Q09的完整逐协议讨论位于`03_ddd_step_08_query_q09_observation_read_model.md`。本节只登记Step08总协议所需的point request、read-model source、presence/surface、same-snapshot约束、affected与handoff；不复制Step06唯一`ObservationReadModel` owner。

### 20.1 Protocol binding and exact callable

| item | current contract |
|---|---|
| logical binding | `Query / GetObservationReadModel / GetObservationReadModelRequest` |
| request body | one canonical `scope: ObservationProjectionScope`；public declaration remains affected |
| exact assembler | `ObservationApiInputAssembler::get_observation_read_model(ObservationQueryRequest<GetObservationReadModelRequest>) -> Result<GetObservationReadModelInput, ApplicationError>` |
| exact Read façade | `ObservationReadService::get_observation_read_model(GetObservationReadModelInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<ObservationReadModel>>` |
| public response | point `ObservationQueryResponse<ObservationReadModel>`；`ObservationQueryPresence::Empty`非法 |
| query authority | only `Arc<dyn ObservationProjectionQueryStore>` and only `get_observation_read_model(scope)`；不得调用`page_observation_read_models` |
| truth boundary | observation-owned committed projection/read surface only；不拥有source/business truth，不repair或反写任何truth |
| later flow | `GetObservationReadModelFlow` |

`(projection kind, ObservationProjectionScope)`是唯一lookup key。已存在但三个成员集合为空的read model仍为`Present`，且只能证明当前观测投影没有成员，不能证明source truth为空。`read_model_ref`与`freshness_marker_ref`在首次创建时生成并在replacement时保持稳定；不得由scope hash、request digest、row version或cursor派生。

### 20.2 Same-committed-boundary and surface rules

正常body要求三个成员集合、scope、完整visibility provenance、freshness marker、current gap revisions、rebuild relation和as-of cursor来自同一committed boundary。当前point callable只返回view，尚未给出该复合证明；不得跨调用、跨时间拼装，也不得把row version当freshness。

`None`没有足够信息区分从未投影、visible local absence、hidden、stale/rebuilding、index corruption或dependency unavailable，因此不能默认映射为`NotFound`、`NotYetProjected`、`Empty`或synthetic empty view。`NotYetProjected`必须由source anchor或projection reservation正式证明；当前没有exact read callable提供该证明。

`Rebuilding`只校验既有`freshness progress_ref -> RebuildProgressView -> MaintenanceTarget -> immutable MaintenanceTargetScopeBinding`关系，不生成、启动、恢复、等待、推进或修复rebuild。P11必须消费完整one-shot visibility provenance、P10 decision与gap revisions；P13只能消费完整target、P11 decision、explicit safety input与current gap revisions。availability和所有public surface必须由有限typed mapper无损投影，不解析provider/error文本。

Q09全程zero-write：不创建UoW、reservation、stored result、read audit、outbox、gap/degraded revision或maintenance task，不读取current source truth补值，也不调用任何writer、external adapter、repair或rebuild入口。

### 20.3 Affected register and stop review

| ID | status |
|---|---|
| `S08-D-Q09-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q09-POINT-PAGE-CONFLICT-01` | `open_internal_affected` |
| `S08-D-Q09-READ-CARRIER-01` | `open_internal_affected` |
| `S08-D-Q09-MISSING-PRESENCE-01` | `open_internal_affected` |
| `S08-D-Q09-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q09-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q09-REBUILD-RELATION-01` | `open_internal_affected` |
| `S08-D-Q09-DEGRADED-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q09-AVAILABILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q09-SURFACE-MAPPER-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/view/source/read-chain/presence/error/no-write/handoff record | `pass_with_affected_open` |
| exact assembler、Read façade与least-authority query facet | pass at observed owner level；composite read carrier remains affected |
| point/page cardinality | Q09固定point-only；R06.8-A optional page与Step07 page callable冲突已登记，不做双模式兼容 |
| missing、visibility、freshness、rebuild、degraded与availability source | target behavior已定义；exact sources/mappers仍为affected |
| `ObservationReadModel` owner | 复用Step06唯一`contracts::views` owner；未创建第二owner |
| zero-write and no business-truth upgrade | pass |
| all ten Q09 affected registered | pass |
| new external upstream blocker | none；`R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `25/60 defined_with_affected_open`；Query `9/14`；`0/60` unconditional complete |
| next action | historical checkpoint；当前已由Q10独立记录承接；不得把本节的`25/60`计数当作current恢复点 |

Q09 is design-only discussion material. It does not modify formal`03`, does not claim implementation/test/acceptance evidence, and does not create a commit. Its standalone product remains the historical Q09 stop record.

## 21. S08-D Query Q10 `GetDiagnosticView`

Q10 的完整逐协议讨论位于 `03_ddd_step_08_query_q10_diagnostic_view.md`。本节只登记 Step 08 总协议所需的 scope-only request、diagnostic composite relation、identity/replacement、dual freshness、surface、affected 与 handoff；不复制 Step 06 的 `DiagnosticView`、`DiagnosticScope` 或 `DiagnosticSummary` owner。

### 21.1 Protocol binding and exact callable

| item | current contract |
|---|---|
| logical binding | `Query / GetDiagnosticView / GetDiagnosticViewRequest` |
| request body | one canonical `scope: ObservationProjectionScope`；public declaration与non-body one-shot context carrier仍affected |
| exact assembler | `ObservationApiInputAssembler::get_diagnostic_view(ObservationQueryRequest<GetDiagnosticViewRequest>) -> Result<GetDiagnosticViewInput, ApplicationError>` |
| exact Read façade | `ObservationReadService::get_diagnostic_view(GetDiagnosticViewInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<DiagnosticView>>` |
| public response | point `ObservationQueryResponse<DiagnosticView>`；`ObservationQueryPresence::Empty`非法 |
| current query authority | `Arc<dyn ObservationProjectionQueryStore>`；current `get_diagnostic_view(scope) -> Option<DiagnosticView>` 不足以证明完整bundle |
| unique lookup | `(projection kind=DiagnosticView, canonical ObservationProjectionScope)`；request context/scope ref/summary ref均不是第二public selector |
| truth boundary | observation-owned explain-only committed projection；不拥有source/business/evidence/report/acceptance truth，不触发control action |
| later flow | `GetDiagnosticViewFlow` |

`DiagnosticRequestContextRef`是trusted API/query entry生成的one-shot correlation/audit identity，不得进入public body、projection lookup或view persistence。`DiagnosticViewRef`、`DiagnosticScopeRef`和`ProjectionFreshnessMarkerRef`在replacement中保持稳定；`DiagnosticSummaryRef`标识immutable revision，每次accepted replacement换新ref，并与view/scope/summary head/dependency/marker在同一UoW/CAS boundary原子切换。

### 21.2 Composite relation、dual freshness and no-write

Q10 normal/limited body要求view、scope、current summary head、summary member revisions、gap/no-write sets、as-of cursor、projection marker、visibility provenance、availability和existing rebuild relation来自一个Query-safe committed boundary。Current point callable只返回`Option<DiagnosticView>`，writer-side `Versioned<DiagnosticProjectionSnapshot>`又不能授予Query，因此必须由Step06/07 affected repair提供least-authority composite carrier；禁止跨调用拼装、按latest summary选择、返回partial bundle或调用full writer store。

Summary freshness `Fresh/Partial/Stale/Unavailable` 与 projection freshness `Fresh/Stale/Rebuilding/Unknown`是两个owner，不能互相升级。P10绑定exact DiagnosticView read target，P11只保持/收窄committed visibility，P13只消费exact target、P11 decision、explicit `NotApplicable` safety和complete current gap revisions。`None`没有typed absence/visibility/availability proof时只能Unknown/error，不能默认NotFound/NotYetProjected/Empty。

Q10全程zero-write：不创建UoW、reservation、stored result、request-context row、H7、outbox、summary/view/scope/marker/gap/degraded revision或maintenance task；不调用source reader、writer、resolver writer、external adapter、repair、refresh、rebuild、replay或wait-for-fresh。

### 21.3 Affected register and stop review

| ID | status |
|---|---|
| `S08-D-Q10-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q10-REQUEST-CONTEXT-CARRIER-01` | `open_upstream_internal` |
| `S08-D-Q10-DIAGNOSTIC-READ-CARRIER-01` | `open_internal_affected` |
| `S08-D-Q10-SUMMARY-HEAD-RELATION-01` | `open_internal_affected` |
| `S08-D-Q10-MISSING-PRESENCE-01` | `open_internal_affected` |
| `S08-D-Q10-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q10-DUAL-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q10-REBUILD-RELATION-01` | `open_internal_affected` |
| `S08-D-Q10-DEGRADED-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q10-AVAILABILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q10-SURFACE-MAPPER-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/input/view/identity/composite/replacement/freshness/surface/no-write/handoff record | `pass_with_affected_open` |
| exact assembler、Read façade和least-authority query facet | pass at observed owner level；Query-safe diagnostic composite carrier remains affected |
| unique view/scope/summary owner and identity split | pass；复用Step06 owner，未由Step08创建第二owner |
| summary-head/current bundle proof | target behavior defined；read carrier/current-head relation仍affected |
| missing、visibility、dual freshness、rebuild、degraded和availability source | target behavior defined；exact sources/mappers仍affected |
| zero-write and no source/business/evidence/report truth upgrade | pass |
| all eleven Q10 affected registered | pass |
| new external upstream blocker | none；`R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `26/60 defined_with_affected_open`；Query `10/14`；`0/60` unconditional complete |
| next action | historical checkpoint；当前已由Q11独立记录承接；不得把本节的`26/60`计数当作current恢复点 |

Q10 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 22. S08-D Query Q11 `GetGapStatus`

Q11 的完整逐协议讨论位于 `03_ddd_step_08_query_q11_gap_status.md`。本节只登记 Step 08 总协议所需的 tagged selector、point/page cardinality、least-authority read capability、完整 gap lifecycle、policy/surface、affected 与 handoff；不复制 Step 06 的 `GapStatusView`、`GapStateRef` 或 gap lifecycle owner。

### 22.1 Logical binding、selector 与 cardinality

| item | current contract |
|---|---|
| logical binding | `Query / GetGapStatus / GetGapStatusRequest`；只保留一个逻辑协议，不增加第十五个 Query |
| public request target | finite tagged selector：`Point { gap_ref }` 或 `BySource { source_ref, page }`；canonical declaration与wire/decoder owner仍affected |
| normalized input target | `GapStatusSelectorInput::Point { gap_ref }` 或 `::BySource { source_ref, page }`；替换当前三个`Option`的非法状态空间 |
| exact assembler | `ObservationApiInputAssembler::get_gap_status(ObservationQueryRequest<GetGapStatusRequest>) -> Result<GetGapStatusInput, ApplicationError>` |
| current Read façade | `ObservationReadService::get_gap_status(GetGapStatusInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<GapStatusView>>`；只能表达单体，result cardinality仍affected |
| point response | `ObservationQueryResponse<GapStatusView>`；`ObservationQueryPresence::Empty`非法 |
| source response | `ObservationPagedQueryResponse<GapStatusView>`；`Present`必须非空，`Empty`必须空且无continuation，generic page不使用`Missing` |
| unique view identity | 复用 Step 06 `GapStatusView`，并以`GapStateRef`同时作为gap和view identity；不创建`GapViewScope`或`GapStatusViewRef` |
| truth boundary | 只读observation-owned committed gap projection；不拥有source/business truth，不重跑P12，不把gap状态升级为source修复结论 |
| later flow | `GetGapStatusFlow` |

Selector 与 result 必须保持静态一一对应：point不能携带page，source必须携带page；两个selector同时存在、同时缺失、page无source或不完整`GapSourceRef`均在repository/policy调用前作为typed invalid request失败。不得first-wins、创建默认page、退化为global scan，或由source id、inner ref、kind、request digest重建`GapSourceRef`。

Current `GetGapStatusInput` 的 `gap_ref/source_ref/page` 三个 `Option` 允许八种presence组合，current Read façade又只返回单体。Step06/07必须唯一化normalized application selector、operation-specific point/page result carrier、Read façade signature和response assembler；Step08只固定target shape，不创建第二owner或并行façade。

### 22.2 Least-authority read、page order 与 lifecycle

Current Query authority只能取得`Arc<dyn ObservationProjectionQueryStore>`。其`get_gap_status(gap_ref) -> Option<GapStatusView>`只能提供point use-site，不能证明view、gap revision、degraded relation、marker、visibility、typed absence和availability来自同一committed boundary。Source page在该facet中不存在；full `ObservationUnitOfWork::page_gaps_by_source`又返回`Versioned<GapState>`并携带writer capability，因此不能授予Query，也不能用N+1 point lookup拼页。

Required repair必须分别提供：

1. 一个least-authority point composite carrier，闭合`gap_ref/source/kind/lifecycle/affected/degraded/marker/freshness/visibility/absence/availability`的same-boundary parity；
2. 一个least-authority bounded source lifecycle page carrier，同时返回items、continuation、source existence/relation、per-item material、page-level visibility/freshness/availability和必要policy/rebuild provenance；
3. branch-matched application result，使point只能映射point response、source只能映射paged response。

Source page使用`ObservationRepositoryCursorBinding::for_gaps_by_source(source_ref)`。Current exact cursor registry裁定revision 1、`gap_ref ASC`，而Step07 §7.19摘要写为`(opened_at, gap_ref)`；Q11以exact registry作为provisional target并登记order affected，不声称冲突已关闭。Cursor必须绑定method、完整source selector和order revision，不能跨source重放、使用offset/provider cursor或在相同revision下改变key shape。

By-source page是一个source的完整有界gap lifecycle projection，不是current-gap list：必须保留`Resolved`以及可安全rehydrate的历史`Suppressed`。`Acknowledged`不等于mitigated/closed，`Suppressed`不等于`Resolved`，`Resolved`只表达observation-side typed close basis，不证明source repaired。Source mismatch、duplicate gap、marker/degraded relation损坏或任一hidden/corrupt member均不得通过过滤成员或partial page伪装成功。

### 22.3 Policy、presence、freshness 与 zero-write

Point P10 target固定为`ReadEvaluationTargetRef::Object(ObservationObjectRef::GapState(gap_ref))`。Current P10/P11 target vocabulary没有精确的`GapSourceRef` lifecycle-page variant，且`GapSourceRef`不是`ObservationProjectionScope`；source page不能借first item或伪造projection scope绕过policy target，所需有限target owner保持affected。

P11必须消费exact branch target、request visibility scope、committed freshness、complete gap policy snapshots与P10 decision。Point使用same-gap provenance；page同时需要source-level decision、per-item provenance和不改变cardinality/cursor的whole-page disclosure规则。Hidden item不能被静默过滤；outer visibility只能保持或收窄committed surface。

P13只做response mapping，且仅在exact target、complete P11 decision、explicit safety input和complete current gap revisions均可证明时运行。Persisted`degraded_ref`必须指向同一gap/affected/scope revision；Query不mint、create或replace degraded revision，也不从gap kind/state/count/error推导degraded。

| condition | point surface | source page surface |
|---|---|---|
| visible relation-valid committed material | `Present` with exactly one view | non-empty `Present` page，保持每项lifecycle与same-binding continuation |
| definitive visible local absence | typed `Missing`；不得synthetic view | source存在且bounded read完成时才可`Empty`，且无continuation |
| hidden/existence not safely disclosable | `Unknown`/NotVisible；无identity/body | disclosure-safe limited/unknown；不泄露item/count/cursor |
| dependency unavailable/disabled/failed | finite availability或typed error | finite availability或typed error；不得partial/Empty fallback |
| stale/rebuilding/degraded | 保留exact ceiling，不升级Fresh | 只有完整outer mapper时可返回；不得复制first item或混合snapshot |
| relation/marker/cursor corrupt | typed consistency/invalid cursor error | whole-page failure；无partial body或continuation |

Point/page freshness必须来自各自的committed carrier。Page outer freshness不能取first/last item、min/max、time、row version或cursor；每个item marker还必须属于同一page boundary。`Rebuilding`只验证persisted marker/progress/maintenance target/immutable binding relation；Q11不start、resume、wait、advance、cancel、complete或repair rebuild。

Q11全程zero-write：不创建UoW、idempotency reservation、stored result、read audit、H6/H7/H8/H12、outbox、gap transition、degraded revision、projection marker或maintenance task；不调用writer、source resolver fallback、P12、repair/rebuild或external adapter。重复调用只是普通读取，不产生Command replay/idempotency surface。

### 22.4 Affected register and stop review

| ID | status |
|---|---|
| `S08-D-Q11-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q11-SELECTOR-CARDINALITY-01` | `open_internal_affected` |
| `S08-D-Q11-RESULT-CARDINALITY-01` | `open_internal_affected` |
| `S08-D-Q11-POINT-READ-BUNDLE-01` | `open_internal_affected` |
| `S08-D-Q11-SOURCE-PAGE-READ-BUNDLE-01` | `open_internal_affected` |
| `S08-D-Q11-PAGE-ORDER-01` | `open_internal_affected` |
| `S08-D-Q11-POLICY-TARGET-01` | `open_upstream_internal` |
| `S08-D-Q11-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q11-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q11-REBUILD-RELATION-01` | `open_internal_affected` |
| `S08-D-Q11-DEGRADED-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q11-MISSING-PRESENCE-01` | `open_internal_affected` |
| `S08-D-Q11-AVAILABILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q11-SURFACE-MAPPER-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/input/result/view/read-chain/page/policy/presence/error/no-write/handoff record | `pass_with_affected_open` |
| one logical Query and exact point/source-page cardinality | target contract pass；request/input/result owners仍affected |
| exact assembler、Read façade和least-authority point/page capability | observed callables已记录；point/page composite carrier与result cardinality仍affected |
| unique `GapStatusView`/`GapStateRef` owner | pass；复用Step06 owner，未创建scope/view ref/degraded ref set |
| complete source lifecycle | target contract保留Resolved/Suppressed；least-authority page carrier仍affected |
| page cursor/order | exact binding采用`gap_ref ASC` revision 1；Step07重复表述冲突已登记，未误报closed |
| P10/P11/P13、presence、freshness、rebuild、availability和surface | target behavior已定义；exact sources/mappers仍affected |
| zero-write and no source/business-truth upgrade | pass |
| all fourteen Q11 affected registered | pass |
| new external upstream blocker | none；`R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `27/60 defined_with_affected_open`；Query `11/14`；`0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q12 |

Q11 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 23. S08-D Query Q12 `GetPeripheralExportView`

Q12 的完整逐协议讨论位于 `03_ddd_step_08_query_q12_peripheral_export_view.md`。本节只登记 Step 08 总协议所需的 structured consumer + projection scope selector、peripheral view identity、least-authority read capability、P10/P11/P13/P14 separation、surface、affected 与 handoff；不复制 Step 06 的 `DashboardAlertExportView`、`PeripheralConsumerRef`、`ObservationProjectionScope` 或 peripheral preparation/delivery owner。

### 23.1 Logical binding、request 与 exact callable

| item | current contract |
|---|---|
| logical binding | `Query / GetPeripheralExportView / GetPeripheralExportViewRequest`；只保留一个point Query，不增加route/product/preparation selector |
| public request target | `consumer_ref: PeripheralConsumerRef` + `scope: ObservationProjectionScope` 两个required fields；canonical declaration、wire/decoder owner仍affected |
| exact assembler | `ObservationApiInputAssembler::get_peripheral_export_view(ObservationQueryRequest<GetPeripheralExportViewRequest>) -> Result<GetPeripheralExportViewInput, ApplicationError>` |
| exact Read façade | `ObservationReadService::get_peripheral_export_view(GetPeripheralExportViewInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<DashboardAlertExportView>>` |
| current query authority | `Arc<dyn ObservationProjectionQueryStore>`；current `get_peripheral_export_view(&consumer_ref, &scope) -> Option<DashboardAlertExportView>`不足以证明完整bundle |
| public response | point `ObservationQueryResponse<DashboardAlertExportView>`；`ObservationQueryPresence::Empty`非法 |
| unique lookup | `(PeripheralConsumerRef stable identity, canonical ObservationProjectionScope)`；consumer state/export flag不是第二identity，也不授予export权限 |
| truth boundary | 只读observation-owned、product-neutral committed projection；不拥有source/business/external audit/delivery truth，不执行P14或external adapter |
| later flow | `GetPeripheralExportViewFlow` |

`PeripheralConsumerRef`是包含id、kind、consumer scope、export flag和consumer state的structured carrier，其完整字段必须进入wire与digest；但caller提交的state/export flag只作为selector snapshot，不是授权来源。Read path必须用trusted current consumer snapshot/provenance验证stable identity、kind、scope及current state/flag relation，不能把request值改写为current catalog truth，也不能用旧`PeripheralConsumerScopeRef`、route、product或endpoint替代selector。

`DashboardAlertExportView`复用Step06唯一owner，字段为`view_ref`、`freshness_marker_ref`、`consumer_ref`、`scope`、`read_model_ref`、optional diagnostic/gap refs、`visibility`与`freshness`。`view_ref`和marker identity在首次committed projection创建时生成并在replacement中保持稳定，不能由consumer/scope hash、request digest、row version、cursor或query time派生。View保持body-free和product-neutral，不携带destination、credential、provider state、raw log/metric/trace/audit/evidence body、external verdict、delivery receipt或signoff。

### 23.2 Least-authority read、consumer authority 与 surface

Current point callable只返回`Option<DashboardAlertExportView>`，无法证明view、read model、optional diagnostic/gap relation、trusted consumer snapshot、visibility provenance、gap revisions、freshness marker、rebuild relation、degraded relation、availability和typed absence来自同一个Query-safe committed boundary。Required repair是bounded read-only `PeripheralExportViewPointBundle`或等价唯一carrier；它不得暴露repository version、writer handle、full UoW或provider body，也不得以N+1 lookup、current source scan或writer-side`get_*_with_version`拼装。

P10/P11必须绑定exact consumer+projection-scope target；current target vocabulary不足，不能用scope-only、view-ref-only、first object或旧opaque wrapper替代。P11只保持或收窄committed visibility，request `VisibilityScopeRef`和caller consumer fields均不能直接产生`Visible`。P13只在exact target、complete P11 decision、explicit safety input和current gap revisions齐备时做response-only degraded mapping；它不创建durable degraded revision。

P14 `PeripheralExportPolicy`只属于preparation/delivery写侧。Q12不得调用preparation/delivery decision，不创建`ExternalAuditExportPreparation`或`PeripheralDeliveryState`，不调用external export adapter。External delivery的`Disabled/Unavailable/Failed`与local projection presence相互独立，不能映射为local view `Missing`，也不能阻断对已提交local view的安全读取。

| condition | Q12 surface rule |
|---|---|
| visible relation-valid committed material | `Present`且恰有一个view；consumer/scope、view/read-model/marker/optional relation均通过same-boundary校验 |
| definitive visible local absence | typed `Missing`，必须有anchor/retention/reference或not-yet-projected proof；不得synthetic view |
| hidden或existence不可安全披露 | `Unknown`/NotVisible，无unproven identity/body；不得伪装Missing |
| dependency unavailable/failed | finite availability或typed error；不得把timeout/error/adapter disabled映射为Missing |
| stale/rebuilding/degraded | 保留persisted ceiling；`Fresh`要求marker parity，`Rebuilding`只校验既有progress relation |
| relation/marker/consumer snapshot corrupt | typed consistency/reference error；不得退回caller state或partial body |

Q12全程zero-write：不创建UoW、reservation、stored result、read audit、outbox、view/read-model replacement、gap/degraded revision、freshness marker、rebuild task、preparation或delivery state；不start、wait、advance、complete或repair rebuild，也不读取source/business truth补值。重复调用只是普通读取，不产生Command replay/idempotency outcome。

### 23.3 Affected register and stop review

| ID | status |
|---|---|
| `S08-D-Q12-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q12-CONSUMER-AUTHORITY-01` | `open_internal_affected` |
| `S08-D-Q12-POINT-READ-BUNDLE-01` | `open_internal_affected` |
| `S08-D-Q12-IDENTITY-RELATION-01` | `open_internal_affected` |
| `S08-D-Q12-POLICY-TARGET-01` | `open_upstream_internal` |
| `S08-D-Q12-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q12-PRESENCE-01` | `open_internal_affected` |
| `S08-D-Q12-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q12-REBUILD-RELATION-01` | `open_internal_affected` |
| `S08-D-Q12-DEGRADED-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q12-AVAILABILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q12-SURFACE-MAPPER-01` | `open_internal_affected` |
| `S08-D-Q12-P14-BOUNDARY-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/input/view/identity/read-chain/policy/presence/error/no-write/handoff record | `pass_with_affected_open` |
| one logical Query and exact consumer+scope point selector | target contract pass；request owner remains affected |
| exact assembler、Read façade和least-authority point capability | observed callables已记录；same-boundary point bundle与consumer authority仍affected |
| unique `DashboardAlertExportView`/structured consumer owner | pass；复用Step06 owner，拒绝`PeripheralConsumerScopeRef`与第二view/ref owner |
| stable view/marker identity | target contract pass；replacement/rehydration relation proof remains affected |
| caller state/export flag authority | no；trusted current consumer snapshot/provenance required and affected |
| P10/P11/P13/P14 separation | target behavior defined；P13 response-only，P14 preparation/delivery完全排除；exact target/provenance仍affected |
| presence、freshness、rebuild、degraded、availability和surface | target behavior已定义；exact sources/mappers仍affected |
| zero-write and no source/business/external-delivery truth upgrade | pass |
| all thirteen Q12 affected registered | pass |
| new external upstream blocker | none；`R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `28/60 defined_with_affected_open`；Query `12/14`；`0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q13 |

Q12 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 24. Historical S08-D Query Q13 `GetReferenceSnapshotView`

Q13 的完整逐协议讨论位于 `03_ddd_step_08_query_q13_reference_snapshot_view.md`。本节保留为 historical checkpoint，只登记当时的 tagged selector、reference snapshot view、current-head relation、least-authority point read、P10/P11/P13 separation、双 freshness、surface、affected 与 handoff；不复制 Step 06 的 `ReferenceSnapshotState`、`ReferenceSnapshotView`、typed ref 或 resolver owner。当前恢复点已由 Q14 独立记录承接。

### 24.1 Logical binding、request 与 exact callable

| item | current contract |
|---|---|
| logical binding | `Query / GetReferenceSnapshotView / GetReferenceSnapshotViewRequest`；只保留一个 point Query，不增加按 subject 的第二 Query、refresh alias或aggregate freshness Query |
| public request target | `selector: ReferenceSnapshotViewSelector` 一个 required field；tagged variants为 `BySnapshot(ReferenceSnapshotStateRef)` 与 `BySubject(ReferenceSubjectRef)` |
| current conflicting shape | `snapshot_ref: Option<_>` + `subject_ref: Option<_>` 会产生四种组合；登记 affected，不能继续作为 wire/canonical selector |
| exact assembler | `ObservationApiInputAssembler::get_reference_snapshot_view(ObservationQueryRequest<GetReferenceSnapshotViewRequest>) -> Result<GetReferenceSnapshotViewInput, ApplicationError>` |
| exact Read façade | `ObservationReadService::get_reference_snapshot_view(GetReferenceSnapshotViewInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<ReferenceSnapshotView>>` |
| current Query facet | `ObservationProjectionQueryStore::get_reference_snapshot_view(&ReferenceSnapshotStateRef) -> Option<ReferenceSnapshotView>`；只覆盖 BySnapshot且不足以证明完整 point bundle |
| BySubject authority | 必须由 Query-safe current-head carrier解析 sole current head，包括 current `Invalid`；禁止复用 writer-oriented `find_current_snapshot_by_subject` |
| public response | point `ObservationQueryResponse<ReferenceSnapshotView>`；`ObservationQueryPresence::Empty`非法 |
| unique view owner | Step 06 `contracts::views::ReferenceSnapshotView`；Q13不创建第二 view/state/ref owner |
| later flow | `GetReferenceSnapshotViewFlow` |
| truth boundary | 只读本地 observation-owned committed snapshot/projection surface；不拥有 external reference truth，不调用 resolver或 refresh |

目标 selector 的 wire/digest material必须包含 discriminator和完整 typed payload。BySnapshot允许读取仍保留的历史 snapshot identity；BySubject只解析 subject 的 sole current head，不从 subject mint snapshot identity。`ReferenceSnapshotStateRef`同时是 canonical snapshot/view identity，普通 replacement保持稳定；`ProjectionFreshnessMarkerRef`独立且保持稳定，二者均不得由 selector、digest、时间、row version、cursor或state派生。

### 24.2 View fields、state matrix 与双 freshness

`ReferenceSnapshotView`的唯一字段为：`snapshot_ref`、`freshness_marker_ref`、`subject_ref`、`state`、`safe_summary_ref`、`source_version`、`gap_refs`、`visibility`、`freshness`。字段必须由一个 Query-safe committed boundary losslessly提供；Query不得从 raw resolver/source body或另一个 store补值。

| state | summary/version | Q13 rule |
|---|---|---|
| `Resolved` | 必须 `Some/Some` | 只表示 local reference resolution state，不自动表示 projection `Fresh` |
| `Stale` | `Some/Some` 或 `None/None` | 可保留完整 pair或同时缺失；不得只保留一项 |
| `Pending` / `Unresolved` / `Invalid` / `Unavailable` | 必须 `None/None` | `Invalid`必须能被 BySubject current-head读取；`Unavailable`是 local reference state，不是 Query store failure |

projection `ObservationProjectionFreshnessSurface` 是独立轴：`Fresh`必须由 persisted marker parity证明；`Stale`保留 marker；`Rebuilding`只验证既有 `progress_ref` 到 immutable target/scope binding 的关系；`Unknown`不升级为 Fresh。`Resolved + Stale`、`Unavailable + projection Available`和`Resolved + projection Unavailable`都是可表达的不同组合，不能合并。

### 24.3 Read authority、policy、surface 与 no-write

Q13需要一个 bounded `ReferenceSnapshotViewPointBundle`或等价唯一 carrier，一次证明 selector branch、snapshot/view/subject relation、BySubject current-head cardinality、state pair、marker/freshness、gap current revisions、visibility provenance、typed absence anchor与 local dependency availability。不得使用 N+1 lookup、跨 transaction 拼装、full UoW、writer `Versioned` carrier、current source scan或 resolver fallback。

P10必须绑定 exact reference read target和`ReadCommittedSurface`。现有 target vocabulary不能完整表达 BySubject current-head/absence anchor，登记 policy-target affected；不得把 subject 强转为 `ObservationObjectRef`或跳过 P10。P11只能保持或收窄 committed visibility；caller selector、subject kind、request scope和state均不能直接授予 `Visible`。当前 `DiagnosticRequestContext`要求 projection/diagnostic scope，而 shared Q13 input缺少可信 non-body carrier，必须 fail closed，不能从 snapshot、subject、trace、digest或requested time伪造。

P13只做 response-only limited/blocked mapping，必须有 exact target、完整 P11 decision、explicit safety和 current gap revisions；不创建 durable `DegradedOutputState`。Q13不调用 P15/P16/P17/P18、resolver或 external adapter，不刷新 snapshot，不启动/等待/推进/修复 rebuild，不写 H10/H11、gap、marker、audit、outbox、stored result、UoW或 reservation。

| condition | public surface |
|---|---|
| complete visible relation-valid view | `Present` + exactly one view |
| typed no-head/retention/reference absence proof | `Missing` + typed missing surface；不得 synthetic view |
| hidden/existence不可披露 | `Unknown`/`NotVisible`；不得用 Missing 泄露存在性 |
| projection/read/policy dependency failure | finite availability或typed error；不映射 Missing |
| duplicate head、marker/gap/relation corruption | typed consistency/reference error；不返回 partial body |
| local snapshot `Unavailable` | 保留 local state 语义；不覆盖 Query dependency availability |
| point Query空集合 | `Empty`非法 |

BySnapshot的不存在、BySubject无head、head/view不一致和index不可用必须分别保留 typed 语义。重复调用是普通读取，不形成 Command replay/idempotency outcome。Query全分支不反写 source/business truth、external reference truth或 delivery truth。

### 24.4 Q13 affected register and stop review

| ID | status |
|---|---|
| `S08-D-Q13-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q13-SELECTOR-CARDINALITY-01` | `open_internal_affected` |
| `S08-D-Q13-SUBJECT-CURRENT-HEAD-01` | `open_internal_affected` |
| `S08-D-Q13-POINT-READ-BUNDLE-01` | `open_internal_affected` |
| `S08-D-Q13-IDENTITY-RELATION-01` | `open_internal_affected` |
| `S08-D-Q13-POLICY-TARGET-01` | `open_upstream_internal` |
| `S08-D-Q13-REQUEST-CONTEXT-CARRIER-01` | `open_upstream_internal` |
| `S08-D-Q13-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q13-PRESENCE-01` | `open_internal_affected` |
| `S08-D-Q13-STATE-SURFACE-01` | `open_internal_affected` |
| `S08-D-Q13-DUAL-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q13-GAP-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q13-REBUILD-RELATION-01` | `open_internal_affected` |
| `S08-D-Q13-DEGRADED-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q13-AVAILABILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q13-AVAILABILITY-STATE-SEPARATION-01` | `open_internal_affected` |
| `S08-D-Q13-SURFACE-MAPPER-01` | `open_internal_affected` |
| `S08-D-Q13-REFRESH-BOUNDARY-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/input/view/read-chain/identity/state/policy/presence/freshness/error/no-write/handoff record | `pass_with_affected_open` |
| one logical Query and mutually exclusive tagged selector | target contract pass；request/cardinality owner remains affected |
| BySnapshot historical identity and BySubject sole current head | target behavior defined；Query-safe carrier、Invalid inclusion和absence proof affected |
| writer maintenance lookup excluded | pass；`find_current_snapshot_by_subject`不作为 Q13 Query source |
| unique `ReferenceSnapshotState`/`ReferenceSnapshotView`/typed ref owner | pass；Q13未创建第二 owner |
| state summary/version matrix | target invariant defined；lossless mapper/validation affected |
| stable snapshot/marker identity | target contract pass；rehydration/replacement proof affected |
| P10/P11 exact target and trusted context | target behavior defined；subject absence target和one-shot carrier affected |
| local reference state vs projection freshness | pass_design_record；common source/hint mapper affected |
| presence/visibility/availability/degraded/rebuild surface | target behavior defined；typed carriers/mappers affected |
| resolver/refresh/P15-P18/external boundary | pass；Q13 zero-call/zero-write boundary fixed |
| all eighteen Q13 affected registered | pass |
| new external upstream blocker | none；`R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `29/60 defined_with_affected_open`；Query `13/14`；`0/60` unconditional complete |
| next action | historical checkpoint；当前已由 Q14 独立记录承接；不得把本节的 `29/60` 计数当作 current 恢复点 |

Q13 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 25. Historical Q13 recovery checkpoint

Q13 批次结束时的恢复点为：

```text
Step08_S08-D_Q13_defined_with_affected_open_waiting_user_before_Q14
```

该恢复点仅用于历史回溯；Q13 独立产物与本节不再代表 current 状态。正式 `03` 仍冻结，Q13 不产生实现、测试、验收或提交结论。

## 26. Historical S08-D Query Q14 `GetRebuildProgress`

Q14 的完整逐协议讨论位于 `03_ddd_step_08_query_q14_rebuild_progress.md`。本节是历史 checkpoint，只登记当时形成的 public binding、target selector、view/source boundary、read chain、surface、affected 与 Step 09 handoff；不复制 Step 06/07 的 `RebuildProgressView`、`MaintenanceTargetRef`、summary/state 或 typed-ref owner。Q14 不再代表当前恢复点。

### 26.1 Logical binding、request 与 exact callable

| item | current contract |
|---|---|
| logical binding | `Query / GetRebuildProgress / GetRebuildProgressRequest`；只保留一个 point Query，不增加按 `RebuildProgressViewRef`、maintenance ref、job/run ref 或窗口查询的第二 public Query |
| public request target | `target_ref: MaintenanceTargetRef` 一个 required selector；progress ref、owner ref、window、page、scope fallback 均不进入 public request |
| exact assembler | `ObservationApiInputAssembler::get_rebuild_progress(ObservationQueryRequest<GetRebuildProgressRequest>) -> Result<GetRebuildProgressInput, ApplicationError>` |
| exact Read façade | `ObservationReadService::get_rebuild_progress(GetRebuildProgressInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<RebuildProgressView>>` |
| current Query facet | `ObservationProjectionQueryStore::get_rebuild_progress(&MaintenanceTargetRef) -> Option<RebuildProgressView>`；可由内部 `get_rebuild_progress_by_ref(&RebuildProgressViewRef)` 做关系校验，但不得成为第二 public selector |
| repository key | `affected_projection.rebuild_progress.v1` + `MaintenanceTargetRefId`；key 不由 request digest、cursor、timestamp 或 row version 派生 |
| public response | point `ObservationQueryResponse<RebuildProgressView>`；`ObservationQueryPresence::Empty` 非法 |
| unique view owner | Step 06 唯一 `contracts::views::RebuildProgressView`；Q14 不创建第二 view、state、summary、progress-ref 或 owner wrapper |
| later flow | `GetRebuildProgressFlow` |
| truth boundary | 只读 observation-owned maintenance/projection progress surface；不拥有 source/business truth、repair truth、external execution truth、evidence、report、acceptance 或 signoff |

`MaintenanceTargetRef` 是查询选择器，不是授权事实。request 的 wire/digest material 必须包含完整 typed target descriptor 和 discriminator；不得用 progress ref、maintenance execution identity或外部 run identity替代 target selector。

### 26.2 View fields、owner relation 与 watermark invariants

`RebuildProgressView` 必须由同一 Query-safe committed boundary 无损提供 target、stable progress/view identity、freshness marker、恰好一个 owner discriminator/ref、lifecycle surface、summary、rebuild surface、projection freshness 与 `updated_at`。Q14 只复用既有 Step 06 owner，不在 Step 08 重新声明字段 owner。

| invariant | required rule |
|---|---|
| owner cardinality | maintenance / replay / rollup 三类 owner 中恰好一个；缺失、重复或 target/type 不一致均为 typed consistency failure |
| lifecycle | `Queued`、`Running`、`Completed`、`Failed`、`Blocked` 必须按 persisted owner state 有限映射；`Completed` 只表示 observation-side derived target 完成 |
| cancelled | `RollupRebuildKind::Cancelled` 当前没有直接 public surface；必须由 upstream typed extension 或显式 unsupported/consistency mapping 处理，不得静默映射为 `Completed` |
| summary | counts、processed/total、failed refs、gap refs 与 state-specific optionality必须来自 persisted summary；不得从列表长度、错误文本或当前读取时间补齐 |
| watermark | observation namespace 与 reference namespace watermark 保持独立；scope revision、row version、cursor、timestamp 不能拼造单一 source revision |
| projection freshness | `Fresh` 仅由 persisted marker parity 证明；`Completed`、`updated_at`、row version、successful read 或 cursor 不能升级 freshness |
| identity | target、progress/view ref、marker 与 owner relation 具稳定 identity；replacement/rehydration 必须保持 owner 生成的 identity，不得 read-time mint |

Q14 的局部 owner state 和 projection freshness 是两个独立轴。`Completed + Stale`、`Failed + Unknown`、`Queued + Stale` 等组合必须保留；不把完成、失败或 blocked surface 解释为 source repair、业务成功、外部执行成功或验收通过。

### 26.3 Same-boundary read chain and policy boundary

Q14 要求 least-authority 的 `RebuildProgressPointBundle` 或等价 carrier。其最小 material 为 target、optional progress view、owner relation、projection freshness、trusted visibility provenance、typed absence proof 和 availability surface；exact Rust owner仍由 Step 06/07 affected repair决定。

```text
API exact handler
  -> ObservationApiInputAssembler::get_rebuild_progress
  -> ObservationReadService::get_rebuild_progress
  -> ObservationProjectionQueryStore::get_rebuild_progress(target_ref)
  -> optional get_rebuild_progress_by_ref(progress_ref)
  -> finite target/owner/state/summary/marker mapper
  -> P10 -> P11 -> response-only P13
  -> ObservationQueryResult<RebuildProgressView>
  -> ObservationQueryResponse<RebuildProgressView>
```

P10 必须绑定 `GetRebuildProgress` 的 exact committed-read target 和 `ReadCommittedSurface`；不能把 `MaintenanceTargetRef` 强转成无关 `ObservationObjectRef`，也不能跳过 target-bound absence anchor。P11 只能保持或收窄 persisted visibility；caller target、owner state、progress count、`Completed`、actor/body metadata 和 row existence 都不是 visibility authority。P13 只能做 response-only limited/blocked mapping，不能创建或修改 durable degraded/gap/marker state。

Query service 只能取得 `Arc<dyn ObservationProjectionQueryStore>` 的 read-safe capability，不能 downcast 到 writer store，不能取得 UoW、writer `Versioned<T>`、source/business repository、resolver、external adapter、scheduler 或当前配置读取能力。N+1、跨 transaction 拼装、first-row-wins、fallback scan、read-time rebuild/repair/wait/advance/retry 全部禁止。

### 26.4 Presence、availability、redaction and zero-write

| condition | public outcome |
|---|---|
| visible relation-valid progress row | `Present` + exactly one complete `RebuildProgressView` |
| target exists and typed not-started/not-yet-projected proof exists | `Missing(NotYetProjected)` only when shared absence proof supports it；不得合成 `Queued` |
| target absent with safe disclosure proof | `Missing(NotFound)` |
| target/progress existence hidden | `Unknown` / `NotVisible`；不返回 target、owner、count、cursor 或 marker body |
| projection/index/marker dependency unavailable | finite availability surface or typed dependency error；不映射为 Missing |
| progress ref/owner/marker/summary relation contradictory | typed consistency/reference error；不返回 partial body |
| local owner state is `Failed` | visible local `Failed(summary)`；不映射为 Query dependency failure |
| point query returns zero rows without typed proof | typed absence/availability/consistency outcome；不返回 synthetic empty view |

输出只允许 body-free typed refs、有限 enum、bounded counts、双 watermark、local observed time、marker 及允许披露的 gap/failed refs。必须剥离 raw log/metric/trace/audit/evidence body、provider detail、endpoint、credential、external run identity、evidence alias、report verdict、signoff 和任意错误文本。重复调用是普通 zero-write read，不创建 replay outcome、idempotency reservation、stored result、outbox、read audit 或其他 durable side effect。

### 26.5 Q14 affected register and stop review

Q14 的 21 项 affected 逐项完整定义位于独立产物 §14；总索引保留如下 ID 与状态，不在此创建第二 owner：

| ID | status |
|---|---|
| `S08-D-Q14-REQUEST-SCHEMA-01` | `open_upstream_internal` |
| `S08-D-Q14-SELECTOR-CARDINALITY-01` | `open_internal_affected` |
| `S08-D-Q14-TARGET-LOOKUP-KEY-01` | `open_internal_affected` |
| `S08-D-Q14-POINT-READ-BUNDLE-01` | `open_internal_affected` |
| `S08-D-Q14-IDENTITY-RELATION-01` | `open_internal_affected` |
| `S08-D-Q14-OWNER-DISCRIMINATOR-01` | `open_internal_affected` |
| `S08-D-Q14-SUMMARY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q14-DUAL-WATERMARK-01` | `open_internal_affected` |
| `S08-D-Q14-SOURCE-REVISION-01` | `open_internal_affected` |
| `S08-D-Q14-LIFECYCLE-MAPPER-01` | `open_internal_affected` |
| `S08-D-Q14-CANCELLED-SURFACE-01` | `open_internal_affected` |
| `S08-D-Q14-MISSING-PRESENCE-01` | `open_internal_affected` |
| `S08-D-Q14-FRESHNESS-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q14-POLICY-TARGET-01` | `open_upstream_internal` |
| `S08-D-Q14-REQUEST-CONTEXT-CARRIER-01` | `open_upstream_internal` |
| `S08-D-Q14-VISIBILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q14-DEGRADED-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q14-AVAILABILITY-SOURCE-01` | `open_internal_affected` |
| `S08-D-Q14-ERROR-PRECEDENCE-01` | `open_internal_affected` |
| `S08-D-Q14-STEP09-FLOW-CARRIER-01` | `open_internal_affected` |
| `S08-D-Q14-REHYDRATION-PARITY-01` | `open_internal_affected` |

| stop item | conclusion |
|---|---|
| independent request/input/view/field-source/read-chain/presence/error/no-write/handoff record | `pass_with_affected_open` |
| one logical point Query and one required target selector | target shape defined；request/cardinality owner affected |
| target lookup key, stable identity and exactly-one owner relation | target invariants defined；same-boundary carrier and rehydration proof affected |
| summary counts, failed/gap refs and dual watermarks | invariants recorded；persisted source and mapper affected |
| lifecycle including cancelled handling | finite target matrix defined；cancelled surface and lossless mapper affected |
| independent projection freshness | `Fresh` marker-parity rule fixed；marker/provenance source affected |
| P10/P11/P13 separation | no-write and response-only boundary fixed；exact target/context/provenance mapper affected |
| missing/hidden/availability/consistency precedence | finite matrix recorded；typed source and mapper affected |
| redaction, correlation, idempotency, audit and zero-write | boundary fixed；no durable side effect introduced |
| one Step 09 handoff | `GetRebuildProgressFlow` only；downstream carrier remains affected |
| all 21 affected registered | pass |
| new external upstream blocker | none；known `R06.6-F2-H13-UPSTREAM=open_controlled` is unrelated |
| historical protocol count | `30/60 defined_with_affected_open`；Query `14/14`；`0/60` unconditional complete |
| next action | historical checkpoint；当前已由 S08-E Consumer I01 独立记录承接，不得把本节计数当作 current 恢复点 |

Q14 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 27. Historical Q14 recovery checkpoint

Q14 批次结束时的历史恢复点为：

```text
Step08_S08-D_Q14_defined_with_affected_open_waiting_user_before_S08-E
```

该恢复点仅用于历史回溯；Q14 独立产物与本节不再代表 current 状态。正式 `03` 仍冻结，Q14 不产生实现、测试、验收或提交结论。

## 28. Historical S08-E Consumer I01 `ConsumeBusObservationMaterial`

I01 的完整逐协议讨论位于 `03_ddd_step_08_consumer_i01_bus_observation_material.md`。本节保留其历史 index，不复制 Step 06/07 的 application input、stored result、receipt 或 C-05 owner；I01 已由 I02 current checkpoint 承接，不再代表当前恢复点。

### 28.1 Logical binding and boundary

| item | current contract |
|---|---|
| logical binding | `InboundEvent / ConsumeBusObservationMaterial / BusObservationMaterialPayload` |
| producer | `ObservationProducerFamily::Bus`；只表示已认证 producer namespace，不表示 source/business success |
| source relation | `SourceFamilyKind::Bus` 与 producer family 是不同 Rust 类型，只允许 static exact compatibility；不得用隐式转换或 wire string 猜测 |
| exact assembler | `ObservationInboundInputAssembler::consume_bus_observation_material` |
| exact service | `ObservationInboundEventService::consume_bus_observation_material` |
| exact flow handoff | `ConsumeBusObservationMaterialFlow`，且仅此一个 Step 09 handoff |
| actor source | 仅来自 authenticated worker delivery 的 `ActorSafeRef`；payload actor-like 字段不生效 |
| owned facts | intake decision、safety disposition、body-free correlation/projection marker、Consumer receipt、stored result 和 validated outbox snapshot refs |
| non-owned facts | L0-bus transport state、raw/provider/business body、source truth、evidence/report/signoff、external acceptance；Observability 不反写这些 truth |

I01 固定先解析并校验 header，再选择 typed payload decoder。consumer、producer、source event、schema version、dedup key、trace/correlation 与 actor 均来自各自可信来源，不能从 payload body 补算。raw payload/provider body 不得进入 input、digest、receipt、log 或 error surface；application result 不携带 transport action，action 由 worker exact mapper 选择。

### 28.2 Receipt, outcome and completion boundary

| design surface | current rule |
|---|---|
| valid outcomes | `Accepted`、`Delayed`、`Rejected`、`Quarantined`、`DeadLettered`、`UnsupportedSchema`、`NoOp`；不增加 `Duplicate` durable outcome |
| duplicate replay | 通过 `ObservationProtocolResultAccess::Replayed` overlay 表达；inner stored receipt、原 outcome、refs 和 safe error 保持不变，不重跑 handler |
| local UoW | receipt、safety disposition、H1 `IntakeDecisionRecord`、stored result 与对应 outbox refs 在同一 accepted UoW 内 lossless 关联；不以 current outbox lookup 补值 |
| quarantine | 不创建新的 `QuarantineRef`；若上游没有 canonical owner，public receipt 只表达已有 body-free result/disposition/ref surface，并保持 affected |
| C-05 action | `Acknowledge`、`Retry`、`DeadLetter` 由 per-flow worker mapper 选择；receipt factory 不选择 action，application 不返回 action 字段 |
| indeterminate commit | probe 后仍无法确定 commit 状态时 fail-closed；在 C-05 没有合法 no-completion shape 前，不得默认 ack、retry、dead-letter 或伪造 receipt |
| transport failure after commit | 不回滚或重写已提交 local truth；后续 probe/replay 使用稳定 I01 identity 与原 stored surface |

### 28.3 I01 affected register

以下 13 个 ID 与独立 I01 产物 §15 一一对应，全部保持 `open_internal_affected`；它们是设计闭环缺口，不是实现失败或新的外部 blocker。

| ID | status | required closure |
|---|---|---|
| `S08-E-I01-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 将六个 Consumer control field 绑定到唯一 Step 06/07 private input/accessor source；禁止 entry/service 重构字段 |
| `S08-E-I01-SAFE-SUMMARY-TYPE-01` | `open_internal_affected` | 将历史 `SafeSummaryRef` use-site 修订为 canonical `SafeSignalSummaryRef`；禁止 alias/second wrapper |
| `S08-E-I01-PAYLOAD-COMBINATION-01` | `open_internal_affected` | 由一个 owner 传播 marker/summary 七行组合矩阵与 typed rejection；禁止默认补 marker/summary |
| `S08-E-I01-PRODUCER-SOURCE-MAP-01` | `open_internal_affected` | 建立 Bus producer/source-family 的有限静态 registration relation；禁止字符串比较或 `From` 猜测 |
| `S08-E-I01-DIGEST-ORDER-01` | `open_internal_affected` | assembler、reservation、stored replay 共用 `inbound_consumer_request` 的固定字段顺序和排除集 |
| `S08-E-I01-SOURCE-VERSION-01` | `open_internal_affected` | 提供 typed same-stream source-version relation，或保留显式 fail-closed 分支；禁止以时间/cursor/row version排序 |
| `S08-E-I01-UOW-RECEIPT-SAFETY-01` | `open_internal_affected` | 传播 receipt、disposition、H1 与 stored result 的同一 UoW staging/commit proof |
| `S08-E-I01-OUTBOX-REF-LOSSLESS-01` | `open_internal_affected` | 在 canonical stored surface 提供 outbox refs 的 validated lossless source/accessor；禁止 current outbox lookup |
| `S08-E-I01-RESULT-SURFACE-01` | `open_internal_affected` | 闭合 application result 到 public receipt 的 result-kind、outcome、refs、error presence mapper |
| `S08-E-I01-QUARANTINE-SURFACE-01` | `open_internal_affected` | 删除悬空 `QuarantineRef` 或回指已有 canonical owner；禁止 Step 08 新建 wrapper |
| `S08-E-I01-ACTION-MATRIX-01` | `open_internal_affected` | 为 Rejected/Quarantined/UnsupportedSchema/Delayed/NoOp 传播 exact C-05 action/recovery mapper |
| `S08-E-I01-INDETERMINATE-01` | `open_internal_affected` | 提供 typed no-completion shape 或收紧 handler return contract；禁止未知 commit 状态下选择 terminal action |
| `S08-E-I01-STEP09-HANDOFF-01` | `open_internal_affected` | Step 09 仅消费一个 I01 flow carrier，保持 exact input、receipt、outbox 与 no-write/save-order boundary |

Shared `S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-QUARANTINE-REF-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-SOURCE-EVENT-REF-OWNER-01`、`R06-F-AFFECT-UOW-01` 与 `03-RPR-S09-PER-FLOW` 继续开放；I01 不以本节断言关闭它们。

### 28.4 I01 stop review

| stop item | conclusion |
|---|---|
| independent envelope/payload/input/field-source/digest/redaction/UoW/receipt/outcome/action/handoff record | `pass_with_affected_open`；完整细节回指 I01 独立产物 §4~§14 |
| header-before-payload、static producer compatibility、actor authority与identity separation | target contract fixed；producer/source catalog、field propagation和version relation affected |
| raw body rejection、safe summary、redaction与no-business-truth-write boundary | pass at design-record level；不得保存、hash、log、传播 raw body |
| stored receipt、duplicate replay、outbox/ref/quarantine surface | target behavior fixed；lossless application carrier与canonical quarantine owner affected |
| seven outcome variants and C-05 action matrix | outcome set fixed；per-flow mapper仍 affected，不能 wildcard ack/retry/dead-letter |
| commit probe after indeterminate | fail-closed rule fixed；typed no-completion contract remains affected |
| exactly one Step 09 handoff | pass；`ConsumeBusObservationMaterialFlow` only |
| all 13 I01-specific affected registered | pass；13/13 `open_internal_affected` |
| new external upstream blocker | none; known `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `31/60 defined_with_affected_open`；Query `14/14`；Consumer `1/9`；`0/60` unconditional complete |
| formal / implementation / test / evidence | formal `03` remains frozen; no implementation, test, evidence alias, run id or acceptance claim |
| next action | historical checkpoint；当前已由 I02 独立记录承接 |

## 29. Historical I01 recovery checkpoint

I01 批次结束时的历史恢复点为：

```text
Step08_S08-E_I01_defined_with_affected_open_waiting_user_before_I02
```

该恢复点仅用于历史回溯；I01 独立产物与本节不再代表 current 状态。正式 `03` 仍冻结，I01 不产生实现、测试、验收或提交结论。

## 30. Historical S08-E Consumer I02 `ConsumeSourceAuditMaterial`

I02 的完整逐协议讨论位于 `03_ddd_step_08_consumer_i02_source_audit_material.md`。本节只登记 current logical binding、projection/H3/receipt 边界、16 个 protocol-specific affected 与停审结论；不复制 Step 06/07 的 domain、repository、stored result 或 C-05 owner。

### 30.1 Logical binding and truth boundary

| item | current contract |
|---|---|
| logical binding | `InboundEvent / ConsumeSourceAuditMaterial / SourceAuditMaterialPayload`；operation discriminator `0x0302` |
| required producer | `ObservationProducerFamily::SourceOwner`；与 payload `SourceFamilyKind` 是不同 Rust 类型，只允许有限静态 compatibility |
| exact assembler | `ObservationInboundInputAssembler::consume_source_audit_material` |
| exact service | `ObservationInboundEventService::consume_source_audit_material` |
| exact Step 09 handoff | `ConsumeSourceAuditMaterialFlow`，且仅此一个 flow reservation |
| payload | body-free `source_audit_ref + subject_ref + optional correlation_context_ref + SafeExternalSummaryRef + source_family` |
| owned facts | local `AuditProjection`、accepted `AuditProjectionTransition`、H3 `AuditAppendRecord`、stored Consumer result/receipt 与同一 accepted UoW 的 immutable outbox refs |
| non-owned facts | source audit body/action/success、Governance/Artifact/Identity/Runtime/Sandbox truth、external acceptance、report verdict/signoff 与 transport state |

Header必须先于payload解析；unsupported schema不decode、不reserve。`source_event_ref`、`source_ref`、`source_version_ref`、`source_audit_ref`、`subject_ref`、`CorrelationContextRef`、`dedup_key`、`trace_ref`和actor保持独立。I02不从route/ref prefix/body/error text推导任何identity或truth。

### 30.2 Digest, relation, UoW and receipt boundary

| design surface | current rule |
|---|---|
| canonical digest | fixed `inbound_consumer_request` order includes operation、actor、producer、event/source/version/schema与五个payload字段；排除dedup、occurred_at、trace、transport、generated refs与raw body |
| reservation | logical `(operation, actor, dedup_key)` 与 secondary `(operation, producer, source_event_ref)` 在同一边界检查 |
| semantic relation | typed `(source_ref, source_family, source_audit_ref, subject_ref)` 必须sole-row解析；当前lookup owner/uniqueness为affected，禁止先mint projection ref或first-row-wins |
| projection transition | only `AuditProjection::create` / `append_source_fact` over bound context and `SafeExternalSummaryRef`；禁止直接字段赋值 |
| H3 | accepted transition + same-UoW post-state -> one projection-branch `AuditAppendRecord`；不reload、不从after state猜change kind |
| replay | `ObservationProtocolResultAccess::Replayed`只包装原stored surface；不新增`Duplicate` outcome、不重跑append、不新建H3/outbox |
| source version | opaque owner token；无typed comparator时fail closed，禁止按time/cursor/schema/row version排序 |
| public receipt | stored/fresh、stored/replayed或ephemeral；changed/outbox/gap/dead-letter/error必须lossless，禁止current lookup补值 |
| C-05 | application result不含action；worker per-flow mapper选择action；commit probe仍unknown时无合法completion，禁止默认terminal action |

I02只表示“Observability本地body-free audit projection已提交或未提交”的有限事实。即使本地`Accepted`，也不证明source audit action、Governance decision、external audit或report handoff成功。

### 30.3 I02 affected register

以下 16 个 ID 与 I02 独立产物 §15 一一对应；除 source-version comparator 为 `open_upstream_internal` 外，其余均为 `open_internal_affected`。

| ID | status | required closure |
|---|---|---|
| `S08-E-I02-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 传播六个 Consumer control field 的唯一 private input/accessor source |
| `S08-E-I02-SAFE-SUMMARY-OWNER-01` | `open_internal_affected` | 将历史 `SafeSummaryRef` use-site修订为canonical `SafeExternalSummaryRef`，禁止alias |
| `S08-E-I02-PRODUCER-SOURCE-CATALOG-01` | `open_internal_affected` | 传播`SourceOwner`与finite source-family的typed registration relation |
| `S08-E-I02-SOURCE-AUDIT-RELATION-01` | `open_internal_affected` | 定义source/ref/family/audit/subject typed relation key与mismatch precedence |
| `S08-E-I02-SUBJECT-RELATION-SOURCE-01` | `open_internal_affected` | 绑定`AuditSubjectRef`的source mapper与absence/ambiguity规则 |
| `S08-E-I02-CORRELATION-CONTEXT-RELATION-01` | `open_internal_affected` | 在projection create前证明context为Bound且subject匹配 |
| `S08-E-I02-DIGEST-ORDER-01` | `open_internal_affected` | assembler、reservation和probe共用固定digest order/exclusion set |
| `S08-E-I02-SOURCE-VERSION-01` | `open_upstream_internal` | 提供typed same-stream comparator或保留显式fail-closed分支 |
| `S08-E-I02-PROJECTION-LOOKUP-UNIQUENESS-01` | `open_internal_affected` | 为`AuditEvidenceRepository`传播bounded semantic lookup和duplicate handling |
| `S08-E-I02-H3-SAME-UOW-01` | `open_internal_affected` | 闭合transition/post-state/cursor/projection/H3的一致staging和commit proof |
| `S08-E-I02-RECEIPT-OUTBOX-LOSSLESS-01` | `open_internal_affected` | 在canonical stored surface提供outbox refs validated source/accessor |
| `S08-E-I02-RESULT-SURFACE-01` | `open_internal_affected` | 闭合application result到public receipt的outcome/ref/error mapper |
| `S08-E-I02-QUARANTINE-SURFACE-01` | `open_internal_affected` | 删除悬空`QuarantineRef`或回指已有owner；不新建Step08 wrapper |
| `S08-E-I02-ACTION-MATRIX-01` | `open_internal_affected` | 传播I02逐分支C-05 action/recovery mapper |
| `S08-E-I02-INDETERMINATE-01` | `open_internal_affected` | 增加typed no-completion或收紧handler签名，禁止unknown时选择action |
| `S08-E-I02-STEP09-HANDOFF-01` | `open_internal_affected` | Step09只消费一个I02 flow carrier并保持relation/UoW/receipt/no-write边界 |

Shared `S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-QUARANTINE-REF-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-SOURCE-EVENT-REF-OWNER-01`、`R06-F-AFFECT-UOW-01`和`03-RPR-S09-PER-FLOW`继续开放；I02不以本节断言关闭它们。

### 30.4 I02 stop review

| stop item | conclusion |
|---|---|
| independent binding/payload/input/digest/redaction/relation/UoW/H3/receipt/outcome/action/handoff record | `pass_with_affected_open`；完整细节回指I02独立产物§4~§14 |
| header-before-payload、actor/identity separation与body-free boundary | pass at design-record level |
| source-owner/source-family catalog与semantic relation uniqueness | target fixed；catalog、relation owner与lookup capability affected |
| projection/H3 same-UoW and no source-truth write-back | target fixed；save/cursor/outbox/result propagation affected |
| replay/source-version/action/indeterminate | fail-closed rules fixed；comparator、mapper和no-completion carrier affected |
| exactly one Step09 handoff | pass；`ConsumeSourceAuditMaterialFlow` only |
| all 16 I02-specific affected registered | pass；15 internal + 1 upstream internal |
| new external upstream blocker | none；known `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60` unconditional complete |
| formal / implementation / test / evidence | formal `03` remains frozen；no implementation/test/evidence/run/acceptance claim |
| next action | stop and wait for explicit user confirmation；after confirmation read only I03-required Step06/07/current shared materials |

## 31. Historical I02 recovery checkpoint

当前恢复点为：

```text
Step08_S08-E_I02_defined_with_affected_open_waiting_user_before_I03
```

未经用户明确确认，不得读取或写入 I03~I09、S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该恢复点只作历史回溯，已由I03完整协议记录及下方I04 §1 current checkpoint承接。

## 32. Historical S08-E Consumer I03 `ConsumeIdentityObservationContext`

I03完整逐协议记录位于`03_ddd_step_08_consumer_i03_identity_observation_context.md`。
其§17已判定为`defined_with_affected_open`，因此I03计入第三个Consumer定义记录；
8项I03专属affected及8项shared/cross-protocol affected仍开放或待传播，不能解释为
unconditional complete或implementation-ready。I03历史恢复点为：

```text
Step08_S08-E_I03_defined_with_affected_open_waiting_user_before_I04
```

## 33. Historical S08-E Consumer I04 §1 checkpoint

I04 §1完整开工记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md`。本批只确认logical
binding、expected Governance producer family、Observability use-site、exact
assembler/service、Step09 reservation与no-business-truth-write边界；未定义payload、
字段authority、result、UoW、action或flow。

| ID | 状态 | current disposition |
|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | L1-governance未提供`GovernanceAuditContextPayload` canonical schema/encoder/registration；Observability不得从use-site反推或复制owner |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 十三个具体Governance outbound event与I04之间没有有限binding/转换契约；不得任选、全订阅或拼字段并集 |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | 完整`GovernanceArtifactEvidenceReference`含本地identity/state/reason，不能由外部producer构造；Step06/07须收敛最小上游DTO与本地factory/relation |

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态仅为`in_progress_S01_with_affected_open`。

该历史恢复点为：

```text
Step08_S08-E_I04_S01_recorded_with_affected_open_waiting_user_before_I04_S02
```

该门禁已由用户确认解除，current状态由下方§34承接。

## 34. Historical S08-E Consumer I04 §2 checkpoint

I04 §2完整输入与authority记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md`。本批逐项读取Step08
规范、Step06对象与input owner、Step07 callable/resolver surface、shared Consumer
carrier及L1-governance十三个outbound event，确认以下current结论：

1. Governance只拥有具体event kind、typed payload、outbound schema/version、source cursor与stored outbound envelope；Observability不拥有或重写这些truth。
2. shared/cross-project binding owner必须显式负责具体Governance event到I04 slot/header/payload的有限转换；当前没有该owner。
3. `GovernanceArtifactEvidenceReference`、`DigestSummary`和`VisibilitySurface`均为Observability类型，不能作为Governance producer可直接构造的三个wire字段。
4. Step07 matching assembler/service只证明callable slot存在，不拥有payload schema，也没有补齐digest/visibility的I04专属转换依赖。
5. Governance current outbound envelope与I04 header不能按字段名直接cast；尤其source cursor不等于source version，outbox ref不自动等于source event ref，arrival time不等于occurred-at。

| ID | 状态 | current disposition |
|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | canonical `GovernanceAuditContextPayload`及encoder/registration仍不存在 |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 十三个具体event到I04的有限binding仍不存在；两个面向Observability的候选event也不能合并 |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | producer不能构造含本地identity/snapshot/state/reason的完整reference |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六个control fields缺I04 concrete struct/constructor/accessor传播证明 |
| `S08-E-I04-DIGEST-AUTHORITY-01` | `open_internal_affected` | semantic digest缺唯一upstream-or-local生成owner、profile/material/order及optional-digest冲突规则 |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | response-only local visibility surface被错误放入producer-facing input row，缺local policy/gap mapper |

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S02_with_affected_open`，仍不计入defined；没有新增外部上游
blocker，也没有关闭§1的两个上游内部blocker。

该历史恢复点为：

```text
Step08_S08-E_I04_S01-S02_recorded_with_affected_open_waiting_user_before_I04_S03
```

该门禁已由用户确认解除，current状态由下方§35承接；不得再用本段状态覆盖
I04 §3完成后的恢复点。

## 35. Historical S08-E Consumer I04 §3 checkpoint

I04 §3完整SOP 23问回答位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md`。本批确认：

1. 23项问题均有I04回答和disposition；Query专属11~16逐项标为`not_applicable_by_family`，没有用Consumer receipt替代Query surface。
2. I04只允许body-free Governance evidence/reference observation进入Observability本地投影，不拥有或反写Governance business truth。
3. scope/family/caller/typed async方向已记录；payload、event binding、local reference、control fields、digest和visibility仍由既有六项affected承接。
4. trusted actor只来自C-03 authenticated delivery；payload actor-like字段、topic、ref或Governance state不能绕过consumer/producer/schema/source/event gate。
5. shared envelope/receipt只提供目标carrier；I04-specific payload、field construction、result reachability、error、UoW、audit与action仍待后续小节，不能据此计入defined。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S03_with_affected_open`，仍不计入defined；没有新增或关闭
上游blocker及本仓affected。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S03_recorded_with_affected_open_waiting_user_before_I04_S04
```

未经用户明确确认，不得进入I04 §4；不得读取或写入I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §3 的历史 checkpoint；current 状态由下方 I04 §4 checkpoint 承接。

## 36. Historical S08-E Consumer I04 §4 checkpoint

I04 §4完整truth boundary、finite logical binding与candidate fail-closed规则位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §4。本批确认：

1. I04只承接body-free Governance evidence/reference observation及其
   Observability-owned local projection；不拥有或反写Governance context、gate、
   decision、policy、control、review、conclusion、nonconformity、trace或report
   verdict truth。
2. evidence linkage、retention marker和report handoff只在Observability-owned
   observation/reference及明确的后续lifecycle/handoff contract上成立；I04不创建
   Governance retention policy、报告结论、验收签署或external delivery acceptance。
3. exact local binding已定位为`InboundEvent / ConsumeGovernanceAuditContext`、
   `ObservationInboundConsumerName::ConsumeGovernanceAuditContext`、
   `ObservationInboundConsumerOperation::ConsumeGovernanceAuditContext`、`0x0304`、
   `ObservationProducerFamily::Governance`、matching assembler/service和唯一
   `ConsumeGovernanceAuditContextFlow` reservation；transport locator仍归entry/config。
4. `NonconformityChanged`、`GovernanceTraceAvailable`及其他Governance event均未
   自动成为I04 producer；缺少canonical payload或有限event binding时，必须在
   decode/digest/reservation/UoW前fail closed，禁止全订阅、任选或字段并集。
5. 六项I04专属affected均保持开放；§4没有新增或关闭affected。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S04_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S04_recorded_with_affected_open_waiting_user_before_I04_S05
```

未经用户明确确认，不得进入I04 §5；不得读取或写入I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §4 的历史 checkpoint；current 状态由下方 I04 §5 checkpoint 承接。

## 37. Historical S08-E Consumer I04 §5 checkpoint

I04 §5完整callable chain与signature记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §5。本批确认：

1. startup只允许worker构造exact I04 handler并放入C-06具名slot；registrar按
   prepare-all -> totality -> arm-all原子激活，成功前不触发callback或暴露partial handle。
2. per-delivery链唯一收敛为validated registration -> C-03 -> exact shared handler ->
   header-before-payload gate -> registered I04 decoder -> matching assembler -> matching
   service -> exact worker mapper -> C-05 -> private registrar action；没有generic/default旁路。
3. shared `InboundConsumerHandler` / `InboundConsumerRegistrar`及I04 assembler/service签名
   均逐字回指current Step07；本批没有新增trait、handler type、receipt、completion variant或
   transport action port。
4. assembler保持同步且I/O-free，service按值消费concrete input并返回
   `ApplicationServiceFuture<ObservationConsumerResult>`；result不是transport completion，
   C-05不从outcome自动推导action。
5. 本批未定义payload/input字段、constructor/accessor、UoW、result/error branch或action
   matrix；六项I04专属affected及shared Consumer affected均保持开放，没有新增blocker。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S05_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S05_recorded_with_affected_open_waiting_user_before_I04_S06
```

未经用户明确确认，不得进入I04 §6；不得读取或写入I04后续小节、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §5 的历史 checkpoint；current 状态由下方 I04 §6 checkpoint 承接。

## 38. Historical S08-E Consumer I04 §6 checkpoint

I04 §6完整shared envelope、typed payload admission与upstream diagnosis记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §6。本批确认：

1. I04只复用S08-B唯一shared envelope；十个header/payload字段的authority、禁止推导与
   `slot -> typed header -> exact producer/event/schema binding -> one decoder -> assembler`
   校验顺序已经固定，trusted actor继续由C-03独立提供。
2. Governance outbound的`event_version/outbox_ref/subject_ref/source_cursor/trace_ref/
   core_trace_id/topic_key`均不能按名称直接映射为I04 header；dedup、occurred-at与trusted
   actor也没有可默认补齐的上游authority。
3. `ObservationInboundEventEnvelope<GovernanceAuditContextPayload>`只保留为use-site；
   current上游没有canonical payload struct、wire schema、factory、encoder、registration或
   compatibility contract，本仓没有虚构同名DTO或字段。
4. `NonconformityChangedPayload`与`GovernanceTraceAvailablePayload`schema、truth owner及
   生命周期不同，不能合并、取交集、任选、多decoder试探或装入generic map；其余event也
   没有positive registration。
5. header adapter缺口由既有producer-event binding blocker承接；§6没有新增或关闭
   affected。两个上游blocker及reference/control-field/digest/visibility四项本仓affected
   继续开放。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S06_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S06_recorded_with_affected_open_waiting_user_before_I04_S07
```

未经用户明确确认，不得进入I04 §7；不得读取或写入I04后续小节、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §6 的历史 checkpoint；current 状态由下方 I04 §7 checkpoint 承接。

## 39. Historical S08-E Consumer I04 §7 checkpoint

I04 §7完整concrete input constructability、field provenance与constructor/accessor记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §7。本批确认：

1. 当前只能固定六个Consumer control fields的target prefix，不能发布完整、可实例化的
   `ConsumeGovernanceAuditContextInput`；control-only input会绕过payload gate，必须禁止。
2. `governance_evidence_ref`从producer-facing input target删除。完整
   `GovernanceArtifactEvidenceReference`只能由未来最小上游DTO与本地授权relation、load或
   create路径共同产生；resolver只能解析已有完整local reference，不能承担首次构造。
3. `digest_summary`当前不得进入constructor；必须先唯一裁定upstream-owned或local-owned
   digest路径、profile/material/order及其与reference optional digest的冲突矩阵。
4. `visibility`从I04 input删除，只允许由本地policy/gap/result mapper生成；producer、entry
   或assembler均无权提交、默认或推导local visibility。
5. future `from_assembled`须原子校验operation、inbound identity、request digest、source
   version relation、schema registration及全部owner-approved operation fields；字段保持
   private，并由matching service通过唯一consuming decomposition取得。
6. current repository仍需要未映射的`ReferenceSubjectRef`，`IdGeneratorPort`也缺I04
   reference first-create/uniqueness路径；这些缺口继续由既有reference/control-field affected
   承接，§7没有新增或关闭affected ID。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S07_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S07_recorded_with_affected_open_waiting_user_before_I04_S08
```

未经用户明确确认，不得进入I04 §8；不得读取或写入I04 §9以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §7 的历史 checkpoint；current 状态由下方 I04 §8 checkpoint 承接。

## 40. Historical S08-E Consumer I04 §8 checkpoint

I04 §8完整canonical request digest、identity与correlation记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §8。本批确认：

1. I04唯一request material kind为`DigestMaterialKind::InboundConsumerRequest`，v1
   `profile/kind/value` framing不变；公共prefix固定为operation、trusted actor、Governance
   producer、source event、source、optional source version与registered schema version。
2. operation-specific `payload` segment仍unresolved。旧Step06
   `governance_evidence_ref; digest_summary; visibility`行和`REQ-I-04` fixture不能作为current
   canonical order；缺payload owner或finite event binding时不生成digest candidate。
3. `dedup_key`属于logical idempotency scope并排除于request digest；`source_event_ref`属于
   secondary delivery identity并进入request digest。两种identity必须在同一atomic reservation
   boundary指向同一row，禁止alias reservation。
4. `RequestDigest`与业务`DigestSummary`按owner、purpose和value type分离，即使profile/hex
   相同也不得转换、复制或互相替代；reference optional digest保留独立semantic conflict规则。
5. `occurred_at`、`trace_ref`、transport facts、supplied digest、generated local refs/result/outbox、
   current truth与Governance forbidden body均排除于request material。失败分支也不得先hash或
   serialize forbidden material再声称redacted。
6. actor、trace、source event、source、source version、dedup、occurred-at与future local refs保持
   typed role分离；Governance `trace_ref/core_trace_id`没有显式adapter时不得任选、拼接或fallback。
7. 新增`S08-E-I04-DIGEST-ORDER-01=open_internal_affected`，用于承接公共frame、未决payload、
   固定排除集及assembler/reservation/replay的一次candidate传播；它不与业务semantic digest
   authority affected合并。既有六项affected全部保持开放，没有新增上游blocker。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S08_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S08_recorded_with_affected_open_waiting_user_before_I04_S09
```

未经用户明确确认，不得进入I04 §9；不得读取或写入I04 §10以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §8 的历史 checkpoint；current 状态由下方 I04 §9 checkpoint 承接。

## 41. Historical S08-E Consumer I04 §9 checkpoint

I04 §9完整redaction与body-free admission记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §9。本批确认：

1. I04使用redaction-first 13-stage admission：static slot/frame -> trusted actor -> shared
   header -> operation/producer -> finite event binding -> schema registration -> payload owner ->
   exact body-free decode -> cross-field authority -> canonical material -> digest candidates ->
   private input -> future local admission。前一阶段失败后不得继续解释后一阶段。
2. canonical payload owner发布positive allowlist前，实际accepted payload set为空。ownerless、
   unsupported、malformed、unknown/duplicate/forbidden、relation mismatch与explicit absence保持
   不同分类；不得用generic map、旧三字段row、default、current lookup或第二decoder补洞。
3. Governance decision/gate/policy/control/review/conclusion/nonconformity/trace/evidence/report body，
   raw envelope/payload、provider response、transport事实、error text与local current truth不得进入
   input、digest、log、metric、trace、error、receipt、audit、outbox、persistence、retry或dead-letter。
   hash、truncate、base64、debug dump或所谓safe copy均不构成redaction。
4. public safe error复用`ObservationProtocolErrorSurface`与既有finite code；I04不创建专属
   error enum、string reason或quarantine ref。pre-admission分支不写accepted audit/outbox，
   也不由error severity直接选择C-05 action。
5. `governance_evidence_ref`、`digest_summary`、`visibility`继续遵守§7~§8 authority裁定；给旧
   字段加redaction标记不会改变owner。future accepted只可能表示known-committed本地
   observation/audit projection，不表示Governance truth、report signoff或外部验收。
6. 新增`S08-E-I04-REDACTION-PROPAGATION-01=open_internal_affected`，要求Step06/07/09/15/16
   证明同一allowlist/exclusion ceiling在decoder、canonicalizer、input、error/receipt、telemetry、
   persistence和dead-letter全部出口不可绕过。既有七项I04 affected保持开放，无新上游blocker。

当前协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer
`3/9`，`0/60`无条件complete。I04状态为
`in_progress_S01-S09_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S09_recorded_with_affected_open_waiting_user_before_I04_S10
```

未经用户明确确认，不得进入I04 §10；不得读取或写入I04 §11以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §9 的历史 checkpoint；current 状态由下方 I04 §10 checkpoint 承接。

## 42. Historical S08-E Consumer I04 §10 checkpoint

I04 §10完整local UoW与durable landing boundary记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §10。本批确认：

1. canonical payload、finite producer-event binding、complete private input和request digest
   candidates均不可构造，因此current actual accepted payload set与accepted write set都为空。
   当前无UoW writer、reservation、primary mutation、cursor、H-family record、stored result、
   completed reservation、accepted receipt、outbox或C-05 action。
2. HLD同时把I04放入audit/evidence和reference-support域，Step06只给family-level
   linkage/visibility/gap定位，冻结formal`03`又列出boundary snapshot、audit/reference record、
   gap等多选项；这些均不足以选择唯一durable target，只作为affected/historical input。
3. future accepted lane复用existing `ObservationUnitOfWorkManager`、atomic idempotency、stored
   result、typed repository与F2 assembly owner；顺序固定为one fresh UoW -> atomic logical/event
   reservation -> exact target/version/transition -> stage primary -> actual-primary-derived commit class ->
   at most one cursor -> mapped H-family或owner-authorized explicit-no-record -> optional registered outbox ->
   save result -> mark completed -> commit。
4. `AuditEvidenceRepository`和`ReferenceMaintenanceRepository`的方法存在只表示capability，不能
   反向授权I04选择`EvidenceLinkage`、`AuditProjection`、`ReferenceSnapshotState`、`GapState`、
   H3、H8、H10或Observation/Reference cursor。没有primary mutation时也不能由record、outbox或
   result制造accepted commit。
5. result必须从same accepted post-state和实际staged record/outbox refs形成，
   `ObservationStoredResultRepository::save_result`必须先于
   `ObservationIdempotencyRepository::mark_completed`；known failure whole-set rollback，unknown
   commit/probe不得构造C-05 completion或选择terminal action。
6. 新增`S08-E-I04-DURABLE-LANDING-01=open_internal_affected`，用于一次性闭合primary、
   repository relation/version、transition、record/no-record、commit class/cursor、result refs与outbox。
   它不替代reference authority affected，也不是新的上游blocker。

当前I04共有九项专属affected：2项`open_upstream_internal`和7项
`open_internal_affected`；没有关闭项或第三项Governance上游blocker。协议计数保持
`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`，`0/60`无条件complete；
I04为`in_progress_S01-S10_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S10_recorded_with_affected_open_waiting_user_before_I04_S11
```

未经用户明确确认，不得进入I04 §11；不得读取或写入I04 §12以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §10 的历史 checkpoint；current 状态由下方 I04 §11 checkpoint 承接。

## 43. Historical S08-E Consumer I04 §11 checkpoint

I04 §11完整stored result reachability、exact replay与Consumer receipt记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §11。本批确认：

1. current I04因canonical producer-event binding、payload、完整input与request digest
   candidates均不可构造，不调用reserve，也不存在`StoredObservationResult`、
   `ObservationConsumerResult`、fresh/replayed stored receipt或C-05 action；current failure最多进入
   body-free typed ephemeral/no-completion mapper。
2. future replay只能从原reservation返回的internal `StoredObservationResultRef`开始，交叉验证
   logical scope与I04/Governance/source-event identity，再验证Completed state、pointer、operation、
   actor、request digest、ConsumerReceipt kind、retained schema、exact bytes/digest及receipt presence。
3. `FreshlyCommitted`与`Replayed`只作为invocation-level outer overlay；inner outcome、public result
   ref、changed/outbox/gap/dead-letter refs与safe error保持immutable且lossless。Internal pointer不能
   作为public result identity。
4. `Stored`与`Ephemeral`为互斥shape。Current zero-write不等于durable `NoOp`，missing/corrupt
   completed result也不能降级为ephemeral rejection/delay或从current linkage/snapshot/gap/H-record/
   outbox/Governance truth重建。
5. §11不选择C-05 action，不新增I04-specific result/receipt affected。九项I04专属affected与shared
   outbox/quarantine/indeterminate、result-access及UoW传播项保持原状态；没有新增上游blocker或关闭项。

协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`，`0/60`
无条件complete。I04为`in_progress_S01-S11_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S11_recorded_with_affected_open_waiting_user_before_I04_S12
```

未经用户明确确认，不得进入I04 §12；不得读取或写入I04 §13以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §11 的历史 checkpoint；current 状态由下方 I04 §12 checkpoint 承接。

## 44. Historical S08-E Consumer I04 §12 checkpoint

I04 §12完整 protocol error mapping、exception branches 与 recovery handoff 记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §12。本批确认：

1. Current canonical payload、finite producer-event binding或durable landing缺失属于activation/design
   gap，不映射为`UnsupportedSchemaVersion`、`DependencyUnavailable`、manual public receipt或默认
   `Retry`；composition root不得暴露未闭合I04 slot。
2. Future合法slot复用current Step06唯一`ProtocolError`、20-variant `DomainError`和
   `ApplicationError` owner；header/schema/payload/body-free/reference/digest/visibility、idempotency、
   CAS、dependency、UoW、result、commit/rollback与post-commit transport均有finite target mapping。
3. Pre-admission保持零写；known pre-commit failure whole-set rollback；commit/rollback unknown无terminal
   receipt或C-05 action；known local commit后的ack/dead-letter failure不得回滚或重跑application。
4. S08-B只前向引用八类`ObservationRecoveryClass`，Step06没有current enum owner，冻结后序Step12
   不能反向授权。因此新增shared `S08-RECOVERY-CLASS-OWNER-01=open_internal_affected`，由后序
   Step12重审唯一owner、total `ApplicationError` mapping、public bool派生与no-wildcard tests。
5. §12只固定C-05 eligibility/prohibition，不选择exact I04 action；九项I04专属affected、shared
   outbox/quarantine/indeterminate/result-access与UoW传播均保持开放，没有新增上游blocker或关闭项。

协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`，`0/60`
无条件complete。I04为`in_progress_S01-S12_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S12_recorded_with_affected_open_waiting_user_before_I04_S13
```

未经用户明确确认，不得进入I04 §13；不得读取或写入I04 §14以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §12 historical checkpoint；current 状态由下方 §45 承接。

## 45. Historical S08-E Consumer I04 §13 checkpoint

I04 §13完整 concurrency、idempotency、reentry 与 C-05 mapper prerequisite 记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §13。本批确认：

1. Current canonical payload、finite producer-event binding、complete input和digest candidates不可构造，
   因此`reserve`、accepted writer、stored result和C-05 action均不可达；structural gap不伪装成
   ephemeral rejection或runtime Retry。
2. Future logical key固定为`(ConsumeGovernanceAuditContext, effective ActorSafeRef, dedup_key)`，
   secondary identity固定为`(ConsumeGovernanceAuditContext, Governance, source_event_ref)`；两者必须
   由`ObservationIdempotencyRepository::reserve`原子建立，禁止logical row first / event alias later。
3. Retained-profile digest comparison、`Acquired/Replay/Conflict/InFlight`、
   `PersistedDigestProfileUnreadable`、cross-index corruption与result-pointer consistency均有finite行为；
   只有`Acquired`进入writer，Replay只读取exact immutable result，Conflict不暴露winner surface。
4. Reservation与future primary CAS/create是两个独立guard。Durable landing未裁定前不选择snapshot、
   H3/H8/H10、cursor namespace、source-version ordering或任一repository capability；known failure whole-set
   rollback，unknown commit只按原scope+event identity双索引probe。
5. Post-commit ack/dead-letter failure不得重开application writer；redelivery只走exact replay。Probe仍unknown
   时无合法C-05 completion，shared indeterminate affected继续开放。
6. 新增`S08-E-I04-ACTION-MATRIX-01=open_internal_affected`：Step06/07须提供I04具名pure/total/
   no-wildcard mapper，输入覆盖activation、commit certainty、Stored/Ephemeral、inner outcome/access、
   refs/error、recovery与exact policy；Step09只在receipt/probe后调用一次，Step16表驱动验证。
7. I04-specific affected现为十项：2 upstream + 8 local；没有新增上游blocker或关闭项。计数保持
   `33/60 defined_with_affected_open`、Query `14/14`、Consumer `3/9`、`0/60` unconditional complete。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S13_recorded_with_affected_open_waiting_user_before_I04_S14
```

未经用户明确确认，不得进入I04 §14；不得读取或写入I04 §15以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §13 historical checkpoint；current 状态由下方 §46 承接。

## 46. Historical S08-E Consumer I04 §14 checkpoint

I04 §14完整 protocol observability、audit projection 与 safety boundary 记录位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §14。本批确认：

1. Current I04 slot不满足payload/binding/input/landing activation prerequisites，只有config/runtime
   assembly owner可报告finite activation failure；不得产生假想delivery、schema rejection、reservation、
   UoW、receipt、accepted metric、native audit或C-05 action。
2. Future合法delivery严格分成Layer A0 activation telemetry、Layer A1 delivery telemetry、Layer B
   local durable truth与Layer C downstream projection。Log/metric/span只消费已经确定的typed事实，
   emission失败不改变result、commit certainty、action或durable truth，也不创建generic audit。
3. Inbound `trace_ref`只作future真实调用相关性；current activation只用process-local host context。
   Trace不承担actor、source-event、dedup、digest、source ordering、commit proof或Governance truth。
4. §14复用§9 allowlist-before-serialization ceiling和Step15 finite log/metric/span vocabulary；metric label
   禁止任何ref/key/digest/body。没有新建I04 telemetry business port/facade，也没有声称sink/dashboard/
   alert/bucket、adapter或测试存在。
5. Durable landing仍未裁定。Current local write为零；future只允许selected canonical primary的native
   record或explicit no-record以及same-UoW result/completion/outbox set，未选择AuditProjection、
   EvidenceLinkage、ReferenceSnapshotState、GapState、H3/H8/H10、cursor或repository。
6. Evidence linkage、retention/protection与report handoff在activation、invalid、Replay、Conflict、
   InFlight、accepted/no-op/negative、rollback、unknown、post-commit action和telemetry failure全部分支保持
   zero direct write；receipt、telemetry、ack不是evidence、retention或handoff proof。
7. 新增`S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected`：shared wide
   `ObservationInboundEventDependencies`暴露evidence/retention/handoff writer，须由I04 minimal dependency
   view、Step09 call audit与Step16 compile-time/forbidden-call cut收敛。I04专属affected现为
   2 upstream + 9 local；没有新增上游blocker或关闭项。

协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`，`0/60`
无条件complete。I04为`in_progress_S01-S14_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S14_recorded_with_affected_open_waiting_user_before_I04_S15
```

未经用户明确确认，不得进入I04 §15；不得读取或写入I04 §16以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §14 historical checkpoint；current 状态由下方 §47 承接。

## 47. Historical S08-E Consumer I04 §15 checkpoint

I04 §15完整 affected register 与 closure dependency order 位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §15。本批确认：

1. I04专属affected完整集合为十一项：`S08-E-I04-PAYLOAD-SCHEMA-01`、
   `S08-E-I04-PRODUCER-EVENT-BINDING-01`两项`open_upstream_internal`，以及reference
   authority、control-field source、semantic digest authority、local visibility authority、request
   digest order、redaction propagation、durable landing、exact action matrix与downstream write
   capability九项`open_internal_affected`。
2. 每项均已固定affected question、canonical closure required与forbidden shortcut。关闭要求覆盖
   owner、全部I04 use-site、absence/error行为、durable/telemetry出口及后续验证回指；类型名、trait
   method、说明文字、fixture shape或计划项均不能单独关闭affected。
3. Closure依赖顺序固定为五层：upstream payload/schema + finite event binding；complete input +
   semantic/request digest + redaction；reference + local visibility + unique durable landing；I04 minimal
   dependency view；shared result/recovery/indeterminate carrier + exact C-05 mapper。顺序只表示依赖，
   不授权批量关闭或提前实现。
4. I04消费八项shared/cross-protocol事项：Consumer outbox、quarantine、indeterminate completion、
   recovery class owner、source-event ref owner、result access layer、cross-step UoW与per-flow repair。
   这些事项保持其原owner/status；I04不得用局部矩阵越权关闭。
5. `R06.6-F2-H13-UPSTREAM=open_controlled`仍为项目级blocker，但不是I04 direct dependency；不计入
   I04专属或shared集合。§15没有发现新上游blocker、独立owner gap或需要新增的affected ID。
6. §15没有激活slot或关闭affected。Current delivery/reservation/writer/result/action仍不可达，
   Governance truth、evidence linkage、retention/protection与report handoff仍为zero direct write；代码、
   测试、compile/runtime evidence与验收均未执行、未声称。

协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`，`0/60`
无条件complete。I04为`in_progress_S01-S15_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S15_recorded_with_affected_open_waiting_user_before_I04_S16
```

未经用户明确确认，不得进入I04 §16；不得读取或写入I04 §17以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §15 historical checkpoint；current 状态由下方 §48 承接。

## 48. Historical S08-E Consumer I04 §16 checkpoint

I04 §16完整 static closure checklist 位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §16。本批确认：

1. 检查按protocol/schema、field/admission、truth/UoW/result、telemetry/audit、Step08 SOP问题覆盖及
   affected/handoff六个分域执行。`pass`、`pass_at_design_record_level`、
   `pass_with_affected_open`、`deferred_to_named_step`、`not_applicable_by_family`与
   `not_run_not_claimed`均有严格含义，不能互相升级。
2. Step08 SOP 23问全部有I04证据边界：1~10、17~22分别回指§§3~15；Query专属11~16明确
   `not_applicable_by_family`；问题23保持deferred，因为I05~I09、S08-F/G及跨协议总审计未开始。
3. Current payload/binding/input/candidates不可构造，故slot activation、delivery admission、reservation、
   writer、stored result与C-05 action仍不可达。Static checklist没有把target contract、fail-closed行为
   或表格覆盖误报为runtime-ready。
4. Governance truth与Observability local truth继续分离；telemetry不证明commit或business truth。
   Evidence linkage、retention/protection和report handoff全部分支保持zero direct write；wide dependency
   capability gap继续由既有affected承接。
5. 十一项I04专属affected与八项shared/cross-protocol事项保持§15原owner/status，五层closure order
   未反向补造。没有发现新的canonical owner/schema/signature/carrier/landing/capability缺口，
   没有新增或关闭affected，也没有新增上游blocker。
6. 唯一Step09 handoff仍为`ConsumeGovernanceAuditContextFlow`；§16没有展开函数级flow、实现、配置
   locator或项目级测试切口。Compile-time cut、forbidden scan、no-wildcard test及runtime evidence均
   `not_run_not_claimed`。

协议计数保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`，`0/60`
无条件complete。I04为`in_progress_S01-S16_with_affected_open`，仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S16_recorded_with_affected_open_waiting_user_before_I04_S17
```

未经用户明确确认，不得进入I04 §17；不得读取或写入I05~I09、S08-F/G、Step09~19、
正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §16 historical checkpoint；current 状态由下方 §49 承接。

## 49. Historical S08-E Consumer I04 §17 final stop review

I04 §17完整 final stop review 位于
`03_ddd_step_08_consumer_i04_governance_audit_context.md` §17。本批确认：

1. I04 §1~§17已形成可独立回指的协议记录，覆盖authority、binding、callable、schema/input
   constructability、digest/identity/correlation、redaction、truth/UoW/result、error/recovery、
   concurrency/reentry、telemetry/audit、affected与唯一Step09 handoff。
2. I04状态为`defined_with_affected_open`。这只允许将其计入逐协议定义数，不表示slot已激活、
   affected已关闭、协议可独立实现或任何runtime行为已存在。
3. 两项L1-governance `open_upstream_internal`与九项本仓`open_internal_affected`保持开放；
   八项shared/cross-protocol事项保持原owner/status。§17没有创建替代owner、默认值、alias或
   inference shortcut，也没有发现新的未登记gap。
4. Current payload/input/digest candidates不可构造，故delivery admission、reservation、writer、
   stored result和C-05 action仍不可达。Governance truth不可反写；evidence linkage、
   retention/protection与report handoff全部分支保持zero direct write。
5. 唯一Step09 handoff仍为`ConsumeGovernanceAuditContextFlow`，`03-RPR-S09-PER-FLOW`继续open；
   formal、实现、测试、scan、runtime evidence与验收均未进入或运行。
6. 没有新增上游blocker。`R06.6-F2-H13-UPSTREAM=open_controlled`继续是项目级非I04 direct
   dependency；两个I04 direct upstream gaps保持原状态。

协议计数更新为`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`，`0/60`
无条件complete。

当前恢复点为：

```text
Step08_S08-E_I04_defined_with_affected_open_waiting_user_before_I05
```

该段为 I04 §17 historical checkpoint；current 状态由下方 §50 承接。

## 50. Historical S08-E Consumer I05 §1 checkpoint

I05 §1完整开工确认与上游冲突诊断位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §1。本批确认：

1. Logical protocol固定为`ConsumeArtifactEvidenceContext`，discriminator为`0x0305`，expected
   producer为`ObservationProducerFamily::Artifact`，唯一Step09 reservation为
   `ConsumeArtifactEvidenceContextFlow`；这些use-site不证明上游payload或event binding已存在。
2. Current Step06业务字段仍为`artifact_evidence_ref: GovernanceArtifactEvidenceReference`、
   `digest_summary: DigestSummary`、`evidence_purpose: EvidenceConsumerPurpose`与
   `visibility: VisibilitySurface`。§1不裁定字段authority、组合或constructor/accessor。
3. L1-artifact存在`ConsumableArtifactReferenceChangedPayload`和`ArtifactTraceAvailablePayload`等
   typed outbound payload，但没有canonical `ArtifactEvidenceContextPayload`、encoder/registration
   或唯一event-to-I05 binding；候选字段不兼容，不能任选、合并或由Observability制造aggregate。
4. 新增`S08-E-I05-PAYLOAD-SCHEMA-01=open_upstream_internal`、
   `S08-E-I05-PRODUCER-EVENT-BINDING-01=open_upstream_internal`与
   `S08-E-I05-REFERENCE-AUTHORITY-01=open_internal_affected`。完整本地reference含Observability
   identity/state/reason，Artifact producer无构造authority。
5. I05只允许接收受认证、显式binding授权的最小body-free Artifact reference material，并转换为
   Observability自有观测、审计或linkage输入；不得保存Artifact content/evidence body、创建evidence
   alias、生成verdict/signoff/report readiness，或反写Artifact truth。
6. I05当前为`in_progress_S01_with_affected_open`，不计入defined。协议计数保持
   `34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`，`0/60`无条件complete；
   formal、实现、测试、scan、runtime evidence与验收均未进入或运行。

当前恢复点为：

```text
Step08_S08-E_I05_S01_recorded_with_affected_open_waiting_user_before_I05_S02
```

现在必须停审。未经用户明确确认，不得进入I05 §2；确认后只允许读取I05四个业务字段的
Step06 object/factory/accessor、Step07 relation/resolver/dependency surface、shared Consumer
result/receipt owner与Artifact payload/source binding的字段级证据。不得进入I05 §3、I06~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为I05 §1 historical checkpoint；current状态由下方§51承接。

## 51. Historical S08-E Consumer I05 §2 checkpoint

I05 §2完整字段级authority与构造闭环位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §2。本批确认：

1. 四个业务字段已逐项确定合法authority方向。Artifact只可提供canonical binding授权的最小
   body-free source reference；完整`GovernanceArtifactEvidenceReference`必须由Observability本地
   relation/factory形成或解析，`DigestSummary`须有唯一semantic authority，`EvidenceConsumerPurpose`
   来自本地有限policy/binding，`VisibilitySurface`只能由本地policy/result mapper生成。
2. `GovernanceArtifactEvidenceResolver`只能解析已经存在的完整本地reference，不能隐式执行
   `Artifact ref -> local reference`转换；current `IdGeneratorPort`也没有专用reference ID mint。
   因此`S08-E-I05-REFERENCE-AUTHORITY-01`保持开放。
3. 六个shared Consumer control fields的header/source与传播规则已记录，但I05 concrete
   `from_assembled`、private fields/accessors和least-authority proof尚未闭合；新增
   `S08-E-I05-CONTROL-FIELD-SOURCE-01`。
4. Current I05 input缺少`projection_ref`与`consumer_scope`，不能证明可创建或唯一读取完整
   `EvidenceLinkage` relation；wide dependency bundle又暴露非I05写能力。新增
   `S08-E-I05-LINKAGE-RELATION-SOURCE-01`与`S08-E-I05-DEPENDENCY-SLICE-01`。
5. 另新增semantic digest、purpose与visibility三项authority affected。I05专属集合现为9项：
   2项`open_upstream_internal`、7项`open_internal_affected`；没有关闭任何项，也没有新增外部
   上游blocker。
6. I05只拥有body-free observation/audit/linkage输入边界，不拥有Artifact truth/content/evidence
   body、verdict、signoff、report readiness或真实evidence alias，也不直接写evidence、retention、
   report handoff或反写Artifact truth。
7. I05当前为`in_progress_S01-S02_with_affected_open`，仍不计入defined。协议计数保持
   `34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`，`0/60`无条件complete；
   formal、实现、测试、scan、runtime evidence与验收均未进入或运行。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S02_recorded_with_affected_open_waiting_user_before_I05_S03
```

现在必须停审。未经用户明确确认，不得进入I05 §3；确认后只允许读取Step08 SOP的23问、
shared Consumer carrier与I05 §1~§2。不得进入I05 §4、I06~I09、S08-F/G、Step09~19、
正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为I05 §2 historical checkpoint；current状态由下方§52承接。

## 52. Historical S08-E Consumer I05 §3 checkpoint

I05 §3完整Step 08 SOP 23问回答与路由位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §3。本批确认：

1. 23问均已逐项回答并给出disposition；1~4固定I05 scope、family、caller与product-neutral
   asynchronous boundary，具体Artifact event binding继续开放。
2. 5~10只记录schema、target、field source、missing behavior与Step09 handoff目标态；canonical
   payload、完整input、local reference/linkage construction和least-authority dependency仍受既有
   9项I05 affected约束，没有创建临时owner或default。
3. Query专属11~16逐项标记`not_applicable_by_family`；Consumer receipt、relation lookup或
   disabled slot均未被冒充为Query view/page/presence contract。
4. 17~22固定shared Consumer carrier复用边界、trusted source actor与不可绕过gate、错误分类、
   idempotency与audit目标态；I05-specific result/recovery/action、durable landing和UoW仍后置。
5. 问题23保持open；I06~I09、S08-F/G及60协议cross-protocol audit尚未完成。
6. I05专属affected保持9项：2项`open_upstream_internal`、7项`open_internal_affected`；本批没有
   新增或关闭affected，也没有新增外部上游blocker。
7. I05当前为`in_progress_S01-S03_with_affected_open`，仍不计入defined。协议计数保持
   `34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`，`0/60`无条件complete；
   formal、实现、测试、scan、runtime evidence与验收均未进入或运行。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S03_recorded_with_affected_open_waiting_user_before_I05_S04
```

现在必须停审。未经用户明确确认，不得进入I05 §4；确认后只允许读取shared finite binding、
I05 §1~§3、Step06/07 exact use-site/callable与Artifact event registry，只定义truth boundary和
exact logical binding。不得进入I05 §5、I06~I09、S08-F/G、Step09~19、正式`03`、任何`04`
文件或实现代码。当前不需要提交。

该段为I05 §3 historical checkpoint；current状态由下方§53承接。

## 53. Historical S08-E Consumer I05 §4 checkpoint

I05 §4完整truth boundary、exact logical binding与Artifact event admission记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §4。本批确认：

1. I05只承接Observability-owned body-free observation/reference/linkage projection，不拥有或
   反写Artifact fact、version、lineage、baseline、review、consumable reference、trace、derived
   view、relay、handoff、evidence、retention或report truth。
2. 唯一本地目标绑定固定为`ObservationProtocolFamily::InboundEvent`、
   `ObservationInboundConsumerName::ConsumeArtifactEvidenceContext`、同名internal operation、
   discriminator `0x0305`、`ObservationProducerFamily::Artifact`、matching assembler/service和
   `ConsumeArtifactEvidenceContextFlow`。这些target/use-site不证明concrete payload或registration存在。
3. 唯一sealed目标关系为`ArtifactEvidenceContextPayload:
   ObservationInboundPayload<CONSUMER = ConsumeArtifactEvidenceContext, PRODUCER = Artifact>`；
   canonical declaration/implementation缺失，因此static slot必须disabled/fail closed。
4. L1-artifact current 8个outbound event已逐项审查，没有任何一个可直接进入I05。
   `ArtifactLineageChanged`与`ArtifactTraceAvailable`只有Observability recipient direction，缺
   consumer/schema/adapter/source mapping；`ConsumableArtifactReferenceChanged`仅语义接近且
   registry未列Observability，均不得静默订阅、合并字段或按名称/相似度接入。
5. I05专属affected保持9项：2项`open_upstream_internal`、7项`open_internal_affected`；本批没有
   新增或关闭事项，也没有新增外部上游blocker。完整input、assembler invocation、service、
   reservation、writer、stored result、receipt与C-05 action仍不可达。
6. I05当前为`in_progress_S01-S04_with_affected_open`，仍不计入defined。协议计数保持
   `34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`，`0/60`无条件complete；
   formal、实现、测试、scan、runtime evidence与验收均未进入或运行。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S04_recorded_with_affected_open_waiting_user_before_I05_S05
```

现在必须停审。未经用户明确确认不得进入I05 §5；确认后只允许读取Step07 matching
assembler/service、shared worker callback/registration与typed completion边界，定义exact call
chain和callable/capability boundary。不得读取或写入I05 §6以后、I06~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为I05 §4 historical checkpoint；current状态由下方§54承接。

## 54. Historical S08-E Consumer I05 §5 checkpoint

I05 §5完整exact call chain与callable/capability boundary记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §5。本批确认：

1. Worker activation只接收同一builder invocation形成的`ValidatedWorkerEntryConfig`、9-method
   inbound assembler、9-method inbound service façade与prebuilt registrar；构造9个finite optional
   slots并只调用一次`register_all`。
2. Registration transaction固定为`prepare_all -> totality_check -> arm_all -> opaque handle`；任一步
   失败均revoke/join本批全部registration，`register_all=Ok`前不暴露callback或partial worker root。
3. I05未来唯一per-delivery链固定为C-03 -> slot/operation equality -> header-before-payload -> exact
   registered decoder -> matching assembler -> matching service -> exact I05 mapper -> C-05 -> private
   registrar。不存在generic/default handler、fallback decoder或registrar reclassification旁路。
4. Assembler保持同步、I/O-free且只能返回完整input或error；失败后不得调用service、repository、
   resolver、UoW或external adapter。Inbound service只按值接收concrete input，不拥有transport
   ack/dead-letter、raw archive或Artifact source write。
5. C-05仍是唯一transport completion carrier，receipt/application result不选择action；ack/dead-letter
   执行失败不回滚已提交的Observability truth。Probe后commit仍indeterminate时没有合法terminal
   completion，不能默认`Retry`或伪造第四variant。
6. Canonical payload与finite event binding仍缺失，因此I05 optional slot保持disabled；callback、C-03、
   decoder、assembler、service、result、receipt与C-05均不可达。Disabled不以`UnsupportedSchema`、
   `Rejected`或`NoOp`伪handler表达。
7. I05专属9项affected保持2项`open_upstream_internal`和7项`open_internal_affected`；本批没有新增
   或关闭事项，也没有新增外部上游blocker。I05为
   `in_progress_S01-S05_with_affected_open`，仍不计入defined。
8. 协议计数保持`34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`，`0/60`
   无条件complete；formal、实现、测试、scan、runtime evidence与验收均未进入或运行。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S05_recorded_with_affected_open_waiting_user_before_I05_S06
```

现在必须停审。未经用户明确确认不得进入I05 §6；确认后只允许读取shared Consumer
envelope/header schema、I05 §1~§5、Step06 I05 use-site及L1-artifact outbound envelope/event
schema证据，只定义header authority、validation order与typed payload boundary。不得读取或写入
I05 §7以后、I06~I09、S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为I05 §5 historical checkpoint；current状态由下方§55承接。

## 55. Historical S08-E Consumer I05 §6 checkpoint

I05 §6完整header authority、validation order、Artifact outbound non-mapping与typed payload
boundary记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §6。本批确认：

1. I05复用唯一shared `ObservationInboundEventEnvelope<T>`，十个字段的authority已逐项固定；
   `ActorSafeRef`继续由C-03 authenticated worker binding独立提供，不进入wire envelope。
2. Future admission顺序固定为finite static slot -> operation/registration gate -> typed header parse
   -> consumer/producer/source relation -> positive Artifact event/schema binding -> optional source-version
   equality -> supported schema -> exact payload decoder -> typed envelope -> matching assembler。Payload不得
   先于header解析，unknown或未注册schema不得试探其他decoder。
3. L1-artifact outbound envelope的event kind/name、schema version、relay/snapshot refs、subject、truth
   cursor、trace、topic，以及缺失的dedup/occurred-at/producer/actor均不得直接cast为I05 header；
   adapter必须由`S08-E-I05-PRODUCER-EVENT-BINDING-01`提供positive finite mapping。
4. `ArtifactEvidenceContextPayload`仍只有Observability use-site；没有canonical owner、wire fields、
   encoder、registration或compatibility policy。不得在本仓创建同名DTO、alias、aggregate payload、
   generic map或fallback decoder。
5. 当前I05 slot仍disabled/fail closed；没有delivery、decoder、typed envelope、assembler、service、
   reservation、receipt或C-05 action。Disabled不伪造`UnsupportedSchema`、`Rejected`或`NoOp`运行结果。
6. I05专属9项affected原样开放：2项`open_upstream_internal`、7项`open_internal_affected`；没有新增
   或关闭事项，也没有新增外部上游blocker。计数保持`34/60 defined_with_affected_open`，I05不计入defined。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S06_recorded_with_affected_open_waiting_user_before_I05_S07
```

现在必须停审。未经用户明确确认不得进入I05 §7；不得读取或写入I05 §8以后、I06~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码；当前不需要提交。

该段为I05 §6 historical checkpoint；current状态由下方§56承接。

## 56. Historical S08-E Consumer I05 §7 checkpoint

I05 §7完整concrete input shape、field provenance与constructor/accessor boundary记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §7。本批确认：

1. `ConsumeArtifactEvidenceContextInput`只能是application内部、process-local、按值移动的matching
   service input；六个Consumer control fields只能形成target prefix，不能发布control-only struct。
2. 六个control fields的authority、传播和constructor invariant已逐项固定；`ActorSafeRef`仍只由C-03
   提供并进入context，payload/header无actor提交权。
3. Step06四个候选业务字段不在同一authority层：完整local reference、semantic digest和purpose仍待
   唯一来源；`VisibilitySurface`移出producer-facing input，只能由local policy/result mapper形成。
4. Current input缺`projection_ref`与`consumer_scope`的typed source；resolver只接受完整local reference，
   `BodyFreeLinkagePolicy`也只验证已加载relation，因此不能证明candidate/sole lookup/replay relation。
5. 只记录crate-private atomic `from_assembled`目标形状、zero-I/O recheck、private immutable borrow和
   consuming decomposition边界；未发布完整constructor、`into_parts`、public getter或placeholder type。
6. I05 slot继续disabled/fail closed；complete input、assembler/service、reservation、result、receipt与
   C-05均不可达。九项专属affected原样开放，没有新增或关闭项，也没有新增上游blocker。
7. 计数保持`34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`、`0/60`无条件complete；
   I05为`in_progress_S01-S07_with_affected_open`，尚未计入defined。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S07_recorded_with_affected_open_waiting_user_before_I05_S08
```

现在必须停审。未经用户明确确认不得进入I05 §8；确认后只读取Step08协议result/identity与digest
相关标准、I04 §8粒度参考和I05 §1~§7，只审查semantic/request digest、identity分层与correlation
boundary。不得读取或写入I05 §9以后、I06~I09、S08-F/G、Step09~19、正式`03`、任何`04`文件或
实现代码；当前不需要提交。

该段为 I05 §8 historical checkpoint；current 状态由下方 §58 承接。

## 57. Historical S08-E Consumer I05 §8 checkpoint

I05 §8完整 semantic/request digest、identity layering 与 correlation boundary 记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §8。本批确认：

1. I05 复用 Step 06 唯一 `application::digest::ObservationDigestCanonicalizer` 与
   `DigestMaterialKind::InboundConsumerRequest`；不创建第二个 canonicalizer、digest value owner
   或本地 hash path。
2. v1 request frame 的 target order 固定为 operation、trusted actor、Artifact producer、
   source event、source、optional source version、I05 schema、future canonical payload；
   `dedup_key`、`occurred_at`、`trace_ref`、transport facts、supplied digest、local effects 与
   Artifact body/truth 均排除，payload segment 未闭合时不生成 candidate。
3. `RequestDigest`、`DigestSummary`、Artifact semantic digest、source/event/version identity 和
   local reference identity 保持不同 owner/type/role；不得按相同 profile/hex、prefix 或字符串
   推导相等。
4. logical scope 固定为`(ConsumeArtifactEvidenceContext, effective ActorSafeRef, dedup_key)`；
   secondary delivery identity 固定为`(ConsumeArtifactEvidenceContext, Artifact, source_event_ref)`；
   两者必须在同一 atomic reservation boundary 检查并指向同一 row，不得先建 logical row 再附加
   source event alias。
5. correlation 只允许在 typed shared binding、redaction 和 public-surface policy通过后用于
   safe telemetry/audit linkage；`trace_ref` 缺失保持缺失，Artifact `core_trace_id`没有显式
   adapter时不得cast、拼接、择优或fallback；actor、source event、source/version、dedup和
   occurred-at不互相替代。
6. conflict branch 只固定 fail-closed/no-mutation boundary，不预选 public receipt/result/error/
   C-05 action；candidate必须由 canonicalizer单次生成并以opaque value传入reservation/replay，
   不得各层重算或从 current truth重建。
7. 既有9项I05专属affected全部保持开放，本批新增独立
   `S08-E-I05-DIGEST-ORDER-01=open_internal_affected`；没有新增上游 blocker，也没有关闭任何
   affected。I05仍不计入defined。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S08_recorded_with_affected_open_waiting_user_before_I05_S09
```

该段为 I05 §8 historical checkpoint；current 状态由下方 §58 承接。

## 58. Historical S08-E Consumer I05 §9 stop review

I05 §9完整 result、receipt、error、replay 与 C-05 action reachability 记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §9。本批确认：

1. I05 复用既有 shared result、receipt、error、recovery、access 与 completion owner；不创建平行 result、receipt、error、quarantine、replay 或 action 类型。`Stored` 只来自同一 UoW 的 known commit，`Ephemeral` 不携带 durable refs。
2. `FreshlyCommitted` 必须由同一 I05 UoW 的 known commit 证明；`Replayed` 必须从原 reservation 的 exact stored-result pointer 开始，逐项验证 scope、event identity、actor、digest、kind、schema、bytes、refs 与 error presence；不得重跑 handler、从 current truth 重建或 mint 新 identity。
3. commit、rollback 或 probe unknown 时，不伪造 receipt，不生成 Stored/Ephemeral completion，也不选择 terminal C-05 action。结构性 owner gap 不伪装为 `UnsupportedSchema`、`Rejected`、`Delayed` 或 `Retry`。
4. C-05 action 只能由具名 I05 mapper 在 receipt/probe 完成后调用一次；mapper 必须 pure、total、显式覆盖已登记分支且无 wildcard/default，registrar 只执行选定 action，不重新分类。
5. result、receipt、error、telemetry 与 dead-letter surface 保持 body-free；不携带 Artifact body、provider response、digest hex/bytes、stack、transport locator、raw trace 或 debug dump。I05 不拥有 Artifact truth、evidence body、retention、report handoff，也不反写业务 truth。
6. I05 专属 affected 统一为 12 项：2 项上游 `open_upstream_internal` 与 10 项本仓 `open_internal_affected`；本批新增 `S08-E-I05-RESULT-SURFACE-01`、`S08-E-I05-ACTION-MATRIX-01`，没有新增上游 blocker，也没有关闭项。I05 仍不计入 defined。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S09_recorded_with_affected_open_waiting_user_before_I05_S10
```

该段为 I05 §9 historical checkpoint；current 状态由下方 §59~§60 承接。

## 59. Historical S08-E Consumer I05 §10 stop review

I05 §10 durable landing、UoW/save order、commit/probe 与 result persistence handoff 的完整记录
位于 `03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §10。本批确认：

1. current I05 的 accepted write set 仍为空；canonical payload、positive Artifact binding、
   complete input、candidate 与唯一 durable landing 未闭合，不能伪造 reservation、primary、
   record、stored result、receipt 或 C-05 action。
2. future writer 只允许一个 UoW、一个 cursor 和一个 operation-specific landing；顺序固定为
   primary / record / follower / outbox staging -> `save_result` -> `mark_completed` -> `commit`。
   `save_result` 必须先于 completion，commit/probe unknown 不产生 completion。
3. EvidenceLinkage、ReferenceSnapshotState、AuditProjection 与 GapState仍只是候选能力；不
   从 repository capability、第一行 relation 或历史 formal 文本任选 primary、record 或 cursor。
4. 新增 `S08-E-I05-DURABLE-LANDING-01` 后，I05 专属 affected 为13项：2项上游、11项本仓；
   没有关闭项或新的上游 blocker，I05仍不计入defined。

该段为 I05 §10 historical checkpoint；current 状态由下方 §60 承接。

## 60. Historical S08-E Consumer I05 §11 stop review

I05 §11 stored result reachability、exact replay、receipt surface 与 completion eligibility 的
完整记录位于 `03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §11。本批确认：

1. current canonical payload、positive producer-event binding、complete input 与 candidate
   仍缺失，因此 I05 slot 继续 disabled/fail closed；没有 stored result、receipt 或 C-05
   completion 可被声称为 runtime fact。
2. future fresh path 只能从同一 accepted UoW 的 immutable `StoredObservationResult` 产生
   `Stored/FreshlyCommitted`；`save_result` 成功或 reservation 存在本身都不等于 known commit。
3. future replay 必须由原 reservation 返回的 exact `StoredObservationResultRef` 开始，交叉
   验证 logical/secondary identity、Completed state、pointer、operation、actor、digest、kind、
   retained schema、canonical bytes、integrity digest 与 I05 receipt presence；不得重跑 handler、
   从 current truth 补 refs 或创建第二 result。
4. `Stored` 与 `Ephemeral` shape 互斥；Stored 保留 immutable `result_ref` 和 stored fields，
   Ephemeral 不携带 durable refs。`FreshlyCommitted` / `Replayed` 只是调用级 access overlay，
   不进入 stored bytes、digest、reservation row 或 inner outcome。
5. missing、duplicate、wrong kind/schema、pointer mismatch、corrupt bytes、presence mismatch
   和 commit/rollback/probe unknown 都是 consistency/indeterminate boundary，不降级为Ephemeral、
   不重建 current truth、不选择 terminal C-05 action。
6. I05 13项专属 affected 全部保持开放；本批没有新增 blocker、没有关闭 affected；协议计数
   保持 `34/60 defined_with_affected_open`，Query `14/14`、Consumer `4/9`，I05不计入defined。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S11_recorded_with_affected_open_waiting_user_before_I05_S12
```

现在必须停审。未经用户明确确认不得进入 I05 §12；确认后只读取 I05 §12 所需的错误映射、
异常分支与 recovery handoff 材料。不得读取或写入 I05 §13 以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码；当前不需要提交。

该段为I05 §11 historical checkpoint；current状态由下方§61承接。

## 61. Historical S08-E Consumer I05 §12 checkpoint

I05 §12 protocol error mapping、exception branches与recovery handoff的完整记录位于
`03_ddd_step_08_consumer_i05_artifact_evidence_context.md` §12。本批确认：

1. I05不创建专属error、recovery或action enum。`ProtocolError`、`DomainError`、
   `ApplicationError`分别保持`contracts::errors`、`domain::errors`、`application::errors`唯一
   owner；public projection复用`ObservationProtocolErrorCode/Surface`，transport action只经C-05。
2. Current ownerless payload、event binding、local constructor或durable landing属于activation
   failure，不是runtime `UnsupportedSchemaVersion`、dependency outage、`Delayed`或`Retry`。
   I05 callback保持disabled/fail closed，不能产生public receipt或completion。
3. Future合法slot的mapping order固定为static/header -> finite event/schema -> redaction-first
   payload -> reference/digest/purpose/visibility/linkage authority -> one candidate/reserve -> one UoW
   -> result/completion/known commit -> public projection -> exact action mapper。
4. Internal inventory与public projection已覆盖malformed input、forbidden body、reference/linkage、
   digest/purpose/visibility、idempotency、dependency、CAS、result/UoW、commit unknown、corrupt replay
   与post-commit transport failure；normal restricted/degraded decision不自动提升为error。
5. `ObservationRecoveryClass`的八个名称仍只是forward target vocabulary。
   `S08-RECOVERY-CLASS-OWNER-01`继续要求后序全局Step12重审唯一owner、`ApplicationError` total
   mapper、`retryable`派生与no-wildcard tests。I05没有`RetryFinalizeOnly` application branch。
6. Commit/rollback unknown只能进入`ProbeBeforeRetry`目标姿态；current没有transaction-status probe，
   exact reads仍无法确认时不得选择任何C-05 action。Missing/corrupt result同样无completion，不能
   降级Ephemeral或从current truth重建。
7. Known commit后的ack/dead-letter执行失败使用existing
   `WorkerError::AckFailed/DeadLetterFailed`；保留immutable local result/marker，后续只exact replay/
   transport probe，不回滚、不重跑application。
8. Error、receipt、telemetry与dead-letter保持body-free，不拥有或反写Artifact truth、evidence body、
   retention、report handoff或external delivery。I05专属13项affected全部开放，没有新增上游blocker
   或关闭项；计数保持`34/60`，I05不计入defined。

当前恢复点为：

```text
Step08_S08-E_I05_S01-S12_recorded_with_affected_open_waiting_user_before_I05_S13
```

现在必须停审。未经用户明确确认不得进入I05 §13；确认后只读取concurrency、idempotency与
reentry protection材料。不得读取或写入I05 §14以后、I06~I09、S08-F/G、Step09~19、正式`03`、
任何`04`文件或实现代码；当前不需要提交。

该段为 I05 §12 historical checkpoint；M1 current closure 由下方 §62 承接。

## 62. Current S08-G M1 closure

本节是 Step 08 的唯一 current M1 closure。前文 I05 §1~§12 的逐阶段停审段落全部保留为
historical material；它们的阶段性计数和“下一步进入 I05 §13”只用于回溯，不覆盖本节的
current pointer。M1 不表示任何协议 runtime-ready、实现完成、测试通过或验收完成。

### 62.1 60 项总审计

| 协议族 | 数量 | current 独立设计记录 | 当前状态 | 无条件完成 |
|---|---:|---|---|---:|
| Command C01-C16 | 16 | 16/16 | `defined_with_affected_open` | 0 |
| Query Q01-Q14 | 14 | 14/14 | `defined_with_affected_open` | 0 |
| Inbound Consumer I01-I09 | 9 | 9/9 | `defined_with_affected_open` | 0 |
| Outbound Event E01-E12 | 12 | 12/12 | `defined_with_affected_open` | 0 |
| Operations Job J01-J09 | 9 | 9/9 | `defined_with_affected_open` | 0 |
| **Total** | **60** | **60/60** | **`60/60 defined_with_affected_open`** | **0/60** |

审计口径是“有独立字段级协议卡、有限 typed binding、current callable/producer、target
boundary、唯一 Step 09 flow reservation，并显式登记缺口”。它不把 affected 关闭、owner
补齐、flow 实现、运行时激活或测试结果混入 defined 状态。

### 62.2 批次收口

| 批次 | current 结论 | 仍开放的内容 |
|---|---|---|
| S08-E Consumer I05-I09 | 9/9 独立协议卡已形成，全部 `defined_with_affected_open` | 上游 payload/binding、landing、action/dependency/UoW、shared recovery 与 Step 09 flow |
| S08-F Outbound Event E01-E12 | 12/12 独立 source/encoder/snapshot/subscriber 卡已形成，全部 `defined_with_affected_open` | 每事件 cardinality、source transition/no-op、typed encoder totality与下游 subscriber flow |
| S08-G Operations Job J01-J09 | 9/9 独立 plan/claim/input/result/report 卡已形成，全部 `defined_with_affected_open` | claim/work-key cardinality、H12/H13、external phase、secondary owner与逐 Job flow |
| S08-G cross-protocol | family collision、60 项计数、affected 路由与 no-write 边界已审计 | 后置 owner、Step 09~15 传播和实现前一致性审计 |

### 62.3 当前 blocker 与 owner 路由

1. `S08-E-I05-PAYLOAD-SCHEMA-01` 与 `S08-E-I05-PRODUCER-EVENT-BINDING-01` 仍是
   L1-artifact 上游内部 blocker。Observability 不反推 Artifact payload、encoder、registration
   或 event subscription。
2. `R06.6-F2-H13-UPSTREAM=open_controlled` 仍约束 J06；C11 保持 scope-only/zero-H13，不能
   把 controlled gap 写成已解决。
3. `R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
   `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01` 和
   `S08-CONSUMER-INDETERMINATE-COMPLETION-01` 继续由后续唯一 owner/Step 承接。
4. `S08-M1-SECONDARY-TYPE-OWNER-01` 统一登记本批未能在 Step 06/07 证明 canonical
   declaration、factory、set validation 或 rehydration 的二级类型；协议卡中的相关字段只
   是 planned surface，不得被实现 agent 当作批准的 public owner。

### 62.4 Truth、运行与提交边界

- 所有 Consumer/Event/Job 仍只承载 observation、audit projection、body-free linkage、
  retention/gap/reference/maintenance marker 或本地 handoff；不拥有 source/business truth，
  不反写 Artifact、Governance、Identity、Runtime、Archive、report consumer 或外部 provider truth。
- Event payload 只能由 accepted local UoW 内的 typed encoder 冻结；J01 只能发布已 claim 的
  immutable snapshot，不能从 current truth 重建。
- 当前没有实现 commit、运行 `run_id`、真实 evidence alias、测试结果、验收签署或 external
  acceptance；正式 `03-详细设计.md` 继续 frozen。

M1 当前状态为：

```text
M1-A completed
M1-B completed
M1-C completed
M1-D completed
M1-E completed
Step08_M1_completed_waiting_before_Step09
```

现在停审。只有用户明确确认后，下一步才读取 Step 09 的 SOP、书写规范与 current 上游
callable/owner 材料；不得在确认前读取或写入 Step 09、Step 10 以后、正式 `03`、任何 `04`
文件、implementation ledger、boundary skeleton 或实现代码。当前不需要提交。
