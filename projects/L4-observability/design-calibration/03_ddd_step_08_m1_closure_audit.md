# L4-observability 03-详细设计 Step 08 M1 closure audit

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `completed_design_record_with_affected_open_waiting_before_step09`
> 正式回填: 只在 Step 19 重装 `03-详细设计.md`
> 本产物性质: Step 08 M1 的 current closure record，不是实现、测试、运行或验收证据

## 1. Closure scope

本产物完成压缩任务台账中的 M1：收口 Step 08 的 60 个协议设计记录，并把每个未闭合
的 owner、source、flow、state、transaction、recovery、external phase 或 secondary type
缺口登记为 affected/blocker。M1 结束后停在 Step 09 之前；不读取 Step 09 材料，不修改正式
`03-详细设计.md`，也不创建 implementation ledger 或 planned boundary skeleton。

本批 current 设计真相源由以下文件组成：

| 类型 | current 输入或产物 |
|---|---|
| 标准 | `详细设计讨论流程_SOP.md` Step 08；`详细设计书写规范.md` 5.6/5.7；闭环与可落码性标准 |
| 上游 owner | `03_ddd_step_06_*` current object/input/result/report/error/UoW 产物；`03_ddd_step_07_*` current callable/port/adapter 产物 |
| 协议总表 | `03_ddd_step_08_protocol_contracts.md` |
| affected register | `03_ddd_step_08_affected_inventory.md` |
| 独立协议卡 | Consumer I01-I09、Event E01-E12、Job J01-J09 的对应 `03_ddd_step_08_*` 文件 |
| 流程与恢复点 | `03_ddd_calibration_flow.md`、`project_execution_ledger.md` |
| 粒度参考 | `projects/L1-governance`、`projects/L1-artifact` 的同类 Step 08 产物；只参考粒度，不复制 truth |

旧正式文档、旧 Step 08 总表和旧 `done/pass` 状态继续保持 `historical_material`，不因本批
协议卡存在而恢复为 current owner。任何只在 Step 08 use-site 出现、且未在 Step 06/07 找到
canonical declaration/factory/rehydration owner 的类型，均保持 affected，不创建同名 alias。

## 2. 60-protocol result

协议全集固定为 `16 + 14 + 9 + 12 + 9 = 60`。M1 的 `defined` 只表示协议卡已具备字段级
设计记录、边界、来源、缺失行为、错误/幂等/审计目标和后续 flow reservation；它不表示
affected 已关闭、runtime slot 已启用、实现已完成或可直接发布。

| family | count | current design record | current status | unconditional complete |
|---|---:|---:|---|---:|
| Command C01-C16 | 16 | 每个协议有独立记录 | `defined_with_affected_open` | 0 |
| Query Q01-Q14 | 14 | 每个协议有独立记录 | `defined_with_affected_open` | 0 |
| Inbound Consumer I01-I09 | 9 | 每个协议有独立记录；I05 的历史分节已由 M1 closure 承接 | `defined_with_affected_open` | 0 |
| Outbound Event E01-E12 | 12 | 每个事件有独立 source/encoder/snapshot/subscriber 卡 | `defined_with_affected_open` | 0 |
| Operations Job J01-J09 | 9 | 每个 Job 有独立 plan/claim/item/report 卡 | `defined_with_affected_open` | 0 |
| **Total** | **60** | **60/60 可回指** | **`60/60 defined_with_affected_open`** | **0/60** |

60 项总审计的判断规则如下：

1. 每一项必须有 typed family、public name、当前 callable/producer、target boundary 和唯一 Step 09 flow reservation。
2. 每一项必须说明字段或计划 material 的 sole source、缺失/歧义处理、no-current-truth-rebuild 规则和不拥有的 truth。
3. Command/Consumer/Job 必须复用 current reservation、stored result、report、claim/fence、UoW 和 C-05/worker action owner；不创建平行 carrier。
4. Outbound Event 必须从 accepted local UoW 的 transition/post-state 形成 typed immutable snapshot；J01 只能发布已冻结 bytes/token/binding。
5. Query 仍是 zero-write；Event subscriber、Consumer、Job 不能借观测投影回写业务 truth、source truth、外部 acceptance 或 signoff。
6. 未满足上述条件的项仍可标记 `defined_with_affected_open`，但必须保留 affected；不能写成 `complete` 或 `runtime-ready`。

## 3. Consumer I05-I09 closure

### 3.1 I05 `ConsumeArtifactEvidenceContext`

I05 已完成 §1-§12 的 authority、payload admission、header/payload、concrete input、digest/identity、
result/receipt/replay、durable landing/UoW、error/recovery/C-05 和 telemetry/no-write 设计记录。
L1-artifact canonical payload 与有限 producer-event binding 仍缺失，因此 slot 保持 disabled/fail
closed；I05 的 13 项专属 affected 全部开放，不能产生真实 callback、reservation、stored result、
receipt 或 completion。

### 3.2 I06-I09

| consumer | accepted local boundary | local affected | 外部 truth 禁止项 |
|---|---|---|---|
| I06 `ConsumeRuntimeSignalSummary` | authenticated Runtime body-free signal summary -> safe signal/correlation/reference observation | `S08-E-I06-DURABLE-LANDING-01`、`S08-E-I06-ACTION-MATRIX-01`、`S08-E-I06-DOWNSTREAM-WRITE-CAPABILITY-01` | runtime execution/run lifecycle、raw log/metric/trace、provider result、业务 truth |
| I07 `ConsumeSandboxSignalSummary` | authenticated Sandbox body-free summary -> owner-approved observation or durable no-change | `S08-E-I07-DURABLE-LANDING-01`、`S08-E-I07-SAFETY-AUTHORITY-01`、`S08-E-I07-ACTION-MATRIX-01`、`S08-E-I07-DOWNSTREAM-WRITE-CAPABILITY-01` | sandbox execution/result、local safety state overwrite、raw output、retention/handoff |
| I08 `ConsumeArchiveHandoffFeedback` | authenticated Archive feedback -> local handoff observation relation | `S08-E-I08-FEEDBACK-RELATION-01`、`S08-E-I08-DURABLE-LANDING-01`、`S08-E-I08-ACTION-MATRIX-01`、`S08-E-I08-DOWNSTREAM-WRITE-CAPABILITY-01` | archive package/storage/acceptance/retention/signoff |
| I09 `ConsumeReportConsumerFeedback` | authenticated report/peripheral feedback -> local delivery/gap observation | `S08-E-I09-DELIVERY-RELATION-01`、`S08-E-I09-GAP-AUTHORITY-01`、`S08-E-I09-DURABLE-LANDING-01`、`S08-E-I09-ACTION-MATRIX-01`、`S08-E-I09-DOWNSTREAM-WRITE-CAPABILITY-01` | report truth、external acceptance、provider body、业务 truth backwrite |

I06-I09 均已形成独立字段级协议卡。它们的 result、receipt、recovery、outbox/quarantine、
indeterminate completion 和 UoW 语义继续复用 shared owner；任何未闭合 landing/action/dependency
都必须 fail closed，不能用 generic “signal marker” 或默认 action 补齐。

## 4. Outbound Event E01-E12 closure

E01-E12 全部采用同一 publication boundary，但每个事件仍有独立 payload/source/cardinality 卡，
不能以 shared template 代替 Step 09 的逐事件 flow。共同规则为：

```text
accepted local transition or creation post-state
  -> same-UoW typed event mapper
  -> immutable encoded payload snapshot + digest + historical binding
  -> outbox follower pair
  -> commit source/result/outbox atomically
  -> J01 publishes exact retained bytes
```

| event range | current design decision | remaining affected |
|---|---|---|
| E01-E10 | 既有 receipt/safety/signal/audit/linkage/handoff/retention/no-write/gap/reference source 只发布 body-free committed projection | 每事件 `S08-F-E0x-FLOW-CARDINALITY-01`；Step 09 逐 creation/transition/no-op 分支闭合 |
| E11 | 使用 tagged `DerivedProjectionSubject`，区分 read model、diagnostic、maintenance、rollup、replay coordination；`DerivedProjectionState` 不被当作新 domain owner | `S08-F-E11-FLOW-CARDINALITY-01`；Step 06/07 owner-specific state matrix 与 secondary type owner |
| E12 | 使用 tagged preparation/delivery subject，严格区分 `ExternalAuditExportPreparation` 与 `PeripheralDeliveryState`；`Delivered` 只代表本地 delivery result | `S08-F-E12-FLOW-CARDINALITY-01`；Step 09 phase/cardinality 与 external phase accounting |

所有事件的 publication subscriber 只能更新自己的 derived projection。publisher 不得查询 current
truth 重建 payload，不得把 provider response、endpoint、credential、raw body、report verdict、
evidence alias 或 external acceptance 写进事件。

## 5. Operations Job J01-J09 closure

### 5.1 Shared Job contract

J01-J09 均复用 `ObservationJobRequest<T>`、`ObservationJobReportSurface`、
`ObservationStoredJobSurface<T>`、`ObservationJobResponse<T>`、immutable plan、global typed
`ObservationJobWorkKey`、claim/fence、item fold、stored result-before-reservation-completion 和 exact
duplicate replay。public `JobRunId` 只是入口 correlation；`ObservationJobExecutionRef` 是 local durable
identity；二者都不是 external/runtime run id。

每个 Job 的 `Delivered`/`Completed` 只表示 Observability 本地结果或报告状态。它不表示外部
acceptance、报告正确性、验收或签署。external call 的 prepare/probe/retry/finalize 分层与
`R07-EXTERNAL-PHASE-*` 后置影响保持开放。

### 5.2 Per-job record

| job | current target | work identity | current affected |
|---|---|---|---|
| J01 `PublishObservationOutbox` | exact immutable outbox snapshot publication | `ObservationJobWorkKey::Outbox` | `S08-G-J01-CANDIDATE-CARDINALITY-01`、`S08-G-J01-PUBLICATION-RETRY-ACCOUNTING-01`、`S08-G-J01-PROBE-OWNER-01` |
| J02 `RebuildObservationReadModels` | committed observation/reference facts -> read model/diagnostic projection | `ProjectionScope` | `S08-G-J02-SCOPE-CARDINALITY-01`、`S08-G-J02-SOURCE-BUNDLE-01`、`S08-G-J02-FRESHNESS-MAPPER-01` |
| J03 `RebuildSignalRollups` | bounded SafeSignal/correlation facts -> rollup window | `SignalRollupWindow` | `S08-G-J03-WINDOW-CARDINALITY-01`、`S08-G-J03-SOURCE-CURSOR-01`、`S08-G-J03-CANCELLED-SURFACE-01` |
| J04 `RefreshReferenceSnapshots` | resolver-backed body-free snapshot refresh | `ReferenceSnapshotState` | `S08-G-J04-SNAPSHOT-CARDINALITY-01`、`S08-G-J04-RESOLVER-OUTCOME-MAPPER-01`、`S08-G-J04-NEW-SNAPSHOT-PROOF-01` |
| J05 `ScanObservationGaps` | bounded scan -> explicit gap/H12 associations | typed scan scope | `S08-G-J05-SCOPE-EMPTY-SEMANTICS-01`、`S08-G-J05-H12-RESULT-BINDING-01`、`S08-G-J05-GAP-CLOSE-AUTHORITY-01` |
| J06 `CoordinateObservationReplay` | per-target observation-side replay coordination | typed target/coordination item | `S08-G-J06-H13-CAPABILITY-01`、`S08-G-J06-TARGET-CARDINALITY-01`、`S08-G-J06-POLICY-PROOF-01`；受 `R06.6-F2-H13-UPSTREAM=open_controlled` 约束 |
| J07 `PrepareReportHandoffDelivery` | body-free report handoff preparation/delivery phases | handoff preparation item | `S08-G-J07-PREPARATION-DELIVERY-SEPARATION-01`、`S08-G-J07-HANDOFF-INPUT-SOURCE-01`、`S08-G-J07-EXTERNAL-PHASE-ACCOUNTING-01` |
| J08 `PrepareExternalAuditExport` | local preparation and typed external phase handoff | preparation/delivery item | `S08-G-J08-PREPARATION-SOURCE-01`、`S08-G-J08-VIEW-RELATION-01`、`S08-G-J08-EXTERNAL-PHASE-ACCOUNTING-01`；`S08-EXPORT-NAME-COLLISION-01` 继续总审计 |
| J09 `RebuildPeripheralViews` | committed peripheral input -> derived peripheral view | typed peripheral target | `S08-G-J09-TARGET-CARDINALITY-01`、`S08-G-J09-SOURCE-BUNDLE-01`、`S08-G-J09-FRESHNESS-VISIBILITY-MAPPER-01` |

## 6. Canonical owner audit

### 6.1 Verified reuse

以下类型在 Step 06/07 已找到 current owner，本批只复用，不创建别名：

| type group | owner conclusion |
|---|---|
| `GapStateRefSet` and existing body-free ref sets | `contracts::refs` canonical set/value owner；application 只负责已授权 mint/rehydrate relation |
| `RebuildProgressViewRef` and its existing view relation | Step 06/07 maintenance/reference owner；Event/Job 只能复制同一 committed relation |
| `ObservationPublicationItemResult` | `application::report`/publication result owner；不是 public Event、outbox state 或 external receipt |
| `JobReportFoldSummary`, `ObservationJobPlanItemOutcome`, `JobError` | Step 06 application report/error owner；Step 08 Job surface 只做 exact projection |
| `ObservationJobRequest/Response`, `ObservationJobReportSurface`, stored result/access | shared Step 06/08 carrier owner；不重建 generic Job result或report |
| `PeripheralDeliveryResult`, `ExternalAuditExportPreparation`, `PeripheralDeliveryState` | Step 06/07 domain/application owner；E12/J07/J08 不拥有其状态机 |

### 6.2 Open secondary-type owner affected

以下名称在 Step 08 use-site 被使用，但本轮在 Step 06/07 未找到足以作为 canonical declaration、
factory、set validation 或 rehydration owner 的 current definition。它们不得被实现 agent 当作已批准
public type；由 `S08-M1-SECONDARY-TYPE-OWNER-01` 统一登记，后续按最小责任拆分：

`DerivedProjectionState`、`DeadLetterRefSet`、`HandoffDeliveryPreparationRefSet`、
`MaintenanceTargetRefSet`、`PeripheralDeliveryResultSet`、`ExternalAuditExportPreparationRefSet`、
`ObservationReadModelRefSet`、`DiagnosticSummaryRefSet`、`ProjectionMaintenanceRefSet`、
`RebuildProgressViewRefSet`、`SignalRollupWindowRefSet` 和 `RollupRebuildRefSet`。

本 affected 不授权在 Step 08 新建同名 wrapper。Step 06/07 必须先决定是复用已有 bounded set、
补 canonical contracts owner、或将 Job output 收缩为已有 `JobReportFoldSummary` 的安全 projection；
在决定前，协议卡中的字段仅是 planned surface，不能声称 runtime-ready。

## 7. Cross-protocol M1 gate

| gate | result |
|---|---|
| 60 协议是否都有独立 current record | `pass`；16 Command、14 Query、9 Consumer、12 Event、9 Job 全部可回指 |
| 是否有协议族被 shared template 代替 | `pass`；I06-I09、E11/E12、J01-J09 均有独立卡；Step 09 仍须逐协议 flow |
| source/business truth ownership 是否被扩张 | `pass`；所有协议卡均保留 observation/audit projection-only boundary |
| Event 是否冻结 immutable snapshot 并禁止 current-truth rebuild | `pass_at_design_record_level`；E01-E12 与 J01 boundary 已固定，encoder/source cardinality 后置 |
| Job 是否具备 plan/claim/fence/report/replay handoff | `pass_at_design_record_level`；J01-J09 独立记录，secondary type owner 和 external phase 仍 affected |
| blocker 是否隐藏 | `pass`；上游 payload/binding、H13、recovery/UoW、external phase、secondary owner 均显式开放 |
| formal `03` 是否提前回填 | `pass`；正式文件保持 frozen，SHA 不在本批更新 |
| implementation/test/evidence 是否被伪造 | `pass`；没有实现、测试、run_id、evidence alias、验收或 commit claim |

## 8. M1 completion and stop review

M1 current status is:

```text
M1-A completed
M1-B completed
M1-C completed
M1-D completed
M1-E completed
Step08_M1_completed_waiting_before_Step09
```

本次完成不等于 Step 08 的所有 affected 已关闭；它只表示协议设计记录、总审计和后置 owner
路由已形成。当前必须停审。获得用户明确确认后，下一步才读取：

1. `standards/document/详细设计讨论流程_SOP.md` Step 09；
2. `standards/document/详细设计书写规范.md` 中 Step 09/function-flow 要求；
3. current Step 06/07 的每个协议 callable、UoW、claim/fence、result/report owner；
4. `projects/L1-governance` 与 `projects/L1-artifact` 的 Step 09 逐协议 flow 粒度参考；
5. 本 Step 08 的 60 项协议卡与本 closure record。

不得在用户确认前读取或写入 Step 09、Step 10 以后、正式 `03`、任何 `04` 文件、实现代码、
implementation ledger 或 boundary skeleton。

## 9. Evidence and submission boundary

本产物没有实现 commit、运行 `run_id`、测试结果、真实 evidence alias、验收签署或外部 acceptance。
当前提交状态为：不需要提交；用户未要求提交。
