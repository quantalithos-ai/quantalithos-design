# L4-observability 03-详细设计 Step 06 - R06.4 boundary / read / maintenance 专项

> 主控文件: `03_ddd_step_06_object_contracts.md`
> 前置 contracts 专项: `03_ddd_step_06_contracts_carriers.md`
> 前置 domain core 专项: `03_ddd_step_06_domain_truth_signal_audit.md`
> 修复批次: `R06.4 handoff / retention / replay / no-write / read / diagnostic / gap / peripheral / reference / maintenance`
> 当前模式: full-restart 定向粒度修复
> 专项完成状态: R06.4_pass_historical_checkpoint;R06.5-G_affected_definition_sync_done;R06.6-F2_affected_definition_sync_done
> 当前整体恢复点: R06.6-F2_done_waiting_user_before_R06.7
> 当前下一动作: wait_user_confirmation_before_R06.7
> 正式回填状态: blocked_until_R06.8_and_step_19

## 1. 本批边界与停止规则

| 项 | 当前裁定 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 06 `逐模块定义对象实现契约` |
| 本批唯一目标 | 将 boundary guard、read/diagnostic/gap、peripheral/reference/maintenance 对象和六个 public view 压到逐对象可落码粒度 |
| 本批正式对象组 | `ReportHandoffRecord`、`AuthenticityHint`、`RetentionMarker`、`ActiveReferenceProtection`、`ReplayScope`、`NoWriteViolation`、`ReadVisibilityState`、`DiagnosticScope`、`DiagnosticRequestContext`、`DiagnosticSummary`、`GapState`、`DegradedOutputState`、`PeripheralDeliveryState`、`ExternalAuditExportPreparation`、`ReferenceSnapshotState`、`ProjectionMaintenanceState`、`ReplayCoordinationState`、`RollupRebuildState` |
| 本批 public view | `ObservationReadModel`、`DiagnosticView`、`GapStatusView`、`DashboardAlertExportView`、`ReferenceSnapshotView`、`RebuildProgressView` |
| shared carrier owner | public ref / metadata / state / reason / scope / outcome / view schema归`observability-contracts`;domain truth、transition delta、target-bound policy result归`observability-domain` |
| R06.4 执行时禁止范围（historical） | 当时尚未获准的R06.5 policy/record完整对象卡、R06.6 application、R06.7 runtime/entry、Step07~19与formal回填 |
| 当前禁止写入 | R06.7~R06.8、Step 07~19、正式 `03-详细设计.md`、任何 `04` 文件、实现代码、implementation ledger / boundary skeleton；F2 owner回灌已完成，当前不得继续写下一批 |
| 直接上游 blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`；formal `02`把`DefineReplayScope`映射到H13，而current H13只接受per-target coordination transition |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`;R06.6-F2已完成并停审，Step 06仍需R06.7~R06.8及后续受影响审计；`R06-F-AFFECT-UOW-01=open_controlled_downstream` |
| R06.4 历史停止规则 | 本文件、主控、flow、ledger同步并通过自检后停审；该门禁随后经用户确认解除并已完成R06.5-A |
| 当前停止规则 | 本文件的 G 批与F2 affected-definition均已完成；旧checkpoint保留为historical，current authority为§25及主控/flow/ledger的`R06.6-F2_done_waiting_user_before_R06.7` |

本批只承载 observability 自己的 boundary fact、read/projection state、derived maintenance state 和 body-free handoff 输入。它不拥有 source material、Identity、Governance、Artifact、Runtime、Sandbox、Archive package、Report verdict、验收签署、执行结果或证据正文 truth。

`Delivered` 只表示本仓记录的交付结果；`Ready` 只表示本仓输入满足当前 policy；`Completed` 只表示 observation-side derived maintenance 完成；`Resolved` 只表示本仓 reference snapshot 进入可用状态。上述状态均不得解释为外部业务成功、外部事实修复、证据真实性或最终签署。

## 2. 本批输入与使用结论

| 输入 | 本批使用结论 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 06 | 先建立批次、模块顺序、capability、功能到对象映射，再逐对象写字段、factory、member、state、来源和停审卡 |
| `standards/document/详细设计书写规范.md` 5.5 / 5.6 | 每个对象独立小节；公开类型、字段、函数参数和 enum variant 必须有 Rustdoc-facing schema；public view 不得引用 domain-only type |
| `standards/document/设计真相源闭环与可落码性标准.md` | secondary carrier、状态条件字段、transition delta、no-write、query no-write、phase-reserved 和 owner registry必须闭环 |
| 正式 `02-概要设计.md` §6 / §12 | handoff、retention、replay、no-write、read、diagnostic、gap、peripheral、reference、maintenance 的语义边界 |
| `02_hld_step_06_key_objects_truth_guard_consumption.md` | B1-B15 guard/read/maintenance对象的概要字段和状态骨架；不直接沿用其旧状态名和 record 返回值 |
| `02_hld_step_06_key_objects_references.md` | R1-R12 structured reference 的 field shape、body-free 和 external truth boundary；R06.2已闭口的 typed ref 不在本批重复定义 |
| `02_hld_step_06_key_objects_projections.md` | V6-V11 read/projection view 的字段、只读能力和禁止反写规则；本批回灌为 current view schema |
| current Step 05 | contracts / domain / application / infra / api / worker / jobs 的依赖方向；public view归contracts，domain不反向依赖contracts view assembly |
| R06.2 contracts专项 | 复用 `ReportConsumerRef`、`ProtectedObservationRef`、`PeripheralConsumerRef`、`MaintenanceTargetRef`、`ReferenceSnapshotStateRef`、既有 ref-set、visibility / degraded surface；不得生成同名 alias |
| R06.3 domain core专项 | 复用 `GapStateRef`、`SafeSignalRefSet`、`EvidenceIndexInputView`、`ObservationProjectionFreshnessSurface`、`Accepted receipt` 前置和 target-bound decision 规则 |
| current Step 08 / 09 / 10 | 只做 affected definition/use 反查；后置协议、flow、state matrix不成为本批 definition owner |

## 3. 依赖、owner 与 boundary 裁定

### 3.1 单向依赖闭环

```text
core-contracts
      |
      v
observability-contracts  <-  observability-domain
      ^                          |
      |                          v
public views             boundary truth / transitions
```

`contracts`不能引用`domain`。因此本批所有 protocol/view 会直接使用的有限状态、reason、scope、result、structured ref 和 public view schema归`contracts`；domain对象只持有这些类型并负责状态迁移。domain transition返回 typed delta，不直接构造 R06.5 persisted record。

| concern | definition owner | mutation / assembly owner | 禁止事项 |
|---|---|---|---|
| handoff scope / consumer / delivery carrier | `contracts::{refs,metadata,scopes}` | application assembly；domain handoff object消费 | 不保存 destination locator、credential、report body |
| retention / active protection state | `contracts::metadata` | domain retention objects推进 | 不执行 cleanup、不声明 archive 已完成 |
| replay / maintenance target carrier | R06.2 `contracts::refs/metadata` | domain boundary object校验 membership/effect | 不把 replay target升级为source truth target |
| no-write trigger / target / reason | `contracts::{refs,metadata}` | domain no-write object记录 boundary fact | 不执行补偿写入、不返回“source repaired” |
| read visibility / diagnostic scope | `contracts::{refs,metadata,scopes}` | application query assembler；domain read object只读迁移 | 不把 visibility 变成业务授权 truth |
| gap / degraded carrier | `contracts::{metadata,refs,surfaces}` | domain gap object和surface policy | 不以empty代替gap、不把degraded当成功 |
| reference snapshot | canonical ref/state在contracts；snapshot truth在`domain::reference` | resolver result通过application写入 | 不保存外部正文或provider response |
| maintenance / replay progress | `contracts` stable state/ref/result；domain state object持有 | job/application在UoW内组装 | 不回写 source truth，不把完成转译为验收 |
| public view schema | `contracts::views` | application assembler；infra mapper | view不得依赖domain type或调用domain mutation |

### 3.2 旧内容与当前 canonical 名称

| historical / 概要名称 | current canonical | 当前处理 |
|---|---|---|
| `ReferenceSnapshotRef` | `ReferenceSnapshotStateRef` | R06.2已闭口；不生成type alias，所有R06.4字段统一使用canonical名称 |
| `ReadVisibilityState`同时表示 kind、context 和 view status | `ReadVisibilityState` domain object + `ReadVisibilityKind` contracts enum | object lifecycle与public surface分离，view使用`VisibilitySurface` |
| `DiagnosticScope`的`Defined/Restricted/Invalid`生命周期 | `DiagnosticScope` value object + construction error；限制由`ReadVisibilityState`表达 | 不新增第三套scope状态机 |
| `GapState`的`Mitigated/Resolved`混用 | `GapLifecycleState::{Open,Acknowledged,Resolved,Suppressed}` | degraded是输出语义，不是gap事实；`Suppressed`不删除gap |
| `PeripheralDeliveryState`的delivery/result/status混写 | `PeripheralDeliveryState` object + `PeripheralDeliveryKind` + `PeripheralDeliveryResult` | adapter result不等于业务truth，不把`Ready`和`Delivered`合并 |
| `ProjectionMaintenanceState`的`Idle/Scheduled/Running/Completed` | `ProjectionMaintenanceStateKind::{Fresh,Stale,Rebuilding,Failed}` | fresh/stale/rebuilding/failed是projection maintenance lifecycle；job execution state留后续application/job |
| `ReplayCoordinationState`的`Draft/Approved/Running` | `ReplayCoordinationKind::{Pending,Coordinating,Blocked,Completed,Failed}` | replay approval truth归`ReplayScopeState::Approved`；coordination只表达执行协调 |
| `HandoffSurface` | 不生成 | 旧capability placeholder；交接使用具名view/record/result |
| `JobReportSurface` | `ObservationJobReportSurface` | Step 08唯一public job report；R06.4只提供state/ref输入，不复制report schema |
| `ArchiveReportHandoffRef` | 保留为 structured boundary ref | 不等同`ReportHandoffRecordRef`；前者跨archive/report boundary，后者是本仓handoff record identity |

### 3.3 R06.4 批次与模块顺序

| 批次 | 覆盖范围 | 写入状态 | 完成证据 | 停审 |
|---|---|---|---|---|
| `R06.4-A` | 骨架、owner、support carrier、state enum、capability与对象映射 | done | 本文件§1~§8 | 已完成第一批写入，继续同一R06.4 |
| `R06.4-B` | handoff / retention / replay / no-write 对象卡 | done | 本文件§8/§10 | 模块内检查已完成 |
| `R06.4-C` | read / diagnostic / gap / peripheral / reference / maintenance 对象卡 | done | 本文件§9 | 模块内检查已完成 |
| `R06.4-D` | 六个view、字段来源、状态闭环、no-write、Step 7+承接、全文门禁 | done | 本文件§11~§19 | historical_confirmed_consumed；R06.5-A已完成 |

### 3.4 非contracts / domain模块闭口决策

| 模块 | 当前 Step 06 是否闭口 | 本批需要闭口的对象组 | defer理由 | 后续承接 |
|---|---|---|---|---|
| `contracts` | 是 | 所有R06.4 public ref、state、reason、scope、result、view | public schema必须先于protocol闭口 | Step 08只做DTO wrapper / mapping |
| `domain` | 是 | handoff、retention、replay、no-write、read、diagnostic、gap、peripheral、reference、maintenance truth/state object | 这些对象是概要正式主语，不能推给Step 07临时补 | Step 07 port；Step 09 flow；Step 10矩阵 |
| `application` | 部分闭口 | assembler input/output与query/job handoff carrier引用 | service constructor、idempotency、stored result、outbox留R06.6 | Step 07 / R06.6 |
| `infra` | defer | resolver/store/adapter只使用本批typed input/output | port、repository函数和adapter error不是本批职责 | Step 07 |
| `api` | defer | public wrapper必须引用本批views和surfaces | API handler mapping在Step 08/R06.7逐接口闭口 | Step 08 / R06.7 |
| `worker` / `jobs` | 部分闭口 | maintenance target、replay authorization、progress view输入边界 | claim/fence/report/outbox留R06.6/R06.7 | R06.6 / R06.7 |

## 4. R06.4 capability 与对象映射

### 4.1 capability清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续Step承接 |
|---|---|---|---|---|---|
| report handoff preparation | immutable evidence input、consumer、scope、visibility、gap、retention | handoff record、readiness、delivery result | 本仓handoff lifecycle；不生成signoff | `ReportHandoffRecord`、`AuthenticityHint` | R06.5 record/policy；Step 08/09 |
| retention protection | protected observation ref、purpose、active consumers、archive eligibility | marker、protection state | hold/release/conflict；不cleanup | `RetentionMarker`、`ActiveReferenceProtection` | R06.5 record/policy；Step 10/11 |
| replay boundary | target set、allowed effect、no-write scope、retention | approved/blocked replay scope | 只允许derived/observation-side effect | `ReplayScope` | R06.5 policy；R06.6 job |
| no-write enforcement | trigger context、forbidden target、operation boundary | violation fact、blocked/escalated state | fail closed；append audit handoff | `NoWriteViolation` | R06.5 record；Step 09 |
| read visibility | actor、scope、purpose、visibility constraint、safety result | visibility state/surface | query no-write；body presence由surface决定 | `ReadVisibilityState` | Step 08/09 |
| diagnostic scope and summary | typed target set、time window、read context、saved observations | immutable diagnostic summary | fresh/stale/partial/unavailable | `DiagnosticScope`、`DiagnosticRequestContext`、`DiagnosticSummary` | Step 07/08/09 |
| gap classification | source reference outcome、visibility、snapshot、affected object | gap state、degraded output | explicit missing/not-visible/unresolved/unsafe | `GapState`、`DegradedOutputState` | Step 09/10/16 |
| peripheral export preparation | consumer、public view、visibility、gap、handoff input | preparation/delivery state/result | no truth write；delivery independent | `PeripheralDeliveryState`、`ExternalAuditExportPreparation` | R06.5；R06.6/Step 07 |
| reference freshness | subject reference、source version、safe summary、resolver outcome | snapshot state | pending/resolved/stale/unresolved/invalid/unavailable | `ReferenceSnapshotState` | Step 07 resolver；Step 09/10 |
| projection maintenance | typed target、snapshot cursor、policy authorization | maintenance/rebuild/coordination state | rebuild derived only；progress visible | `ProjectionMaintenanceState`、`ReplayCoordinationState`、`RollupRebuildState` | R06.6 jobs；Step 11 |

### 4.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接 / 禁止 |
|---|---|---|---|---|
| `ReportHandoffRecord` | report handoff preparation | domain aggregate | immutable input snapshot、readiness、delivery lifecycle | final verdict、signoff、真实run id |
| `AuthenticityHint` | handoff authenticity | domain entity | placeholder/insufficient/body-free origin hint | authenticity verdict、真实evidence alias |
| `RetentionMarker` | retention protection | domain aggregate | hold、release eligibility、conflict、archive hint | cleanup、archive package |
| `ActiveReferenceProtection` | active reference protection | domain entity | consumer set、release gate、conflict | 修复或删除外部引用 |
| `ReplayScope` | replay boundary | domain value/truth object | target/effect/no-write approval/close | source write、scope expansion |
| `NoWriteViolation` | no-write enforcement | domain entity | detect、block、escalate、close | compensation write、source repair |
| `ReadVisibilityState` | read visibility | domain state object | visibility evaluation、restrict、block、degrade | business authorization |
| `DiagnosticScope` | diagnostic selection | contracts/domain value | canonical target/time/scope boundary | UI layout、write command |
| `DiagnosticRequestContext` | query audit context | process-local context | actor/scope/purpose/requested time | persistence、mutation |
| `DiagnosticSummary` | diagnostic aggregation | domain derived object | attach safe refs/gaps/no-write refs、freshness | control command、source repair |
| `GapState` | gap classification | domain entity | open/acknowledge/resolve/suppress | default success、source repair claim |
| `DegradedOutputState` | degraded expression | domain output state | limited/blocked mapping、gap linkage | replacement success、gap deletion |
| `PeripheralDeliveryState` | peripheral delivery | domain state object | prepare、deliver、fail、block、retryable reprepare | core truth mutation、product lifecycle |
| `ExternalAuditExportPreparation` | external audit/export preparation | domain state object | apply readiness、prepare、block、deliver/fail、retryable reprepare | external audit truth、collect/cancel lifecycle |
| `ReferenceSnapshotState` | reference freshness | domain state object | track、resolve、stale、unresolved、invalid、unavailable | external lifecycle/body |
| `ProjectionMaintenanceState` | derived projection maintenance | domain state object | stale/rebuilding/fail/fresh | source truth mutation |
| `ReplayCoordinationState` | replay coordination | domain state object | pending/coordinating/blocked/completed/failed | approval bypass、source repair |
| `RollupRebuildState` | rollup rebuild | domain state object | pending/running/completed/failed/cancelled | raw signal mutation |

## 5. R06.4 support carrier owner registry

### 5.1 新增或本批上下文闭口的 contracts carrier

| 类型 | owner | 资格 | exact use | 本批要求 |
|---|---|---|---|---|
| `ReportHandoffScopeRef` | `contracts::refs` | TC | handoff scope identity | body-free typed ref；不能由consumer或view ref代替 |
| `ArchiveEligibilityRef` | `contracts::refs` | TC | archive eligibility hint | 只表示本仓可交给archive boundary继续评估 |
| `NoWriteTriggerContextRef` | `contracts::refs` | TC | no-write attempt context | 不携带raw command/body/locator |
| `ForbiddenWriteTargetRef` | `contracts::refs` | structured TC | forbidden source/external target | `NoWriteGuardScope`与target kind必须一致 |
| `VisibilityScopeRef` | `contracts::refs` | structured TC | read visibility scope | 不等于authorization scope或consumer identity |
| `ReferenceSubjectRef` | `contracts::refs` | structured TC | subject of snapshot | 只允许body-free subject family + safe ref |
| `ExternalAuditExportPreparationRef` | `contracts::refs` | TC | export preparation identity | 不等于 delivery/provider receipt |
| `ReplayCoordinationRef` | `contracts::refs` | TC | replay coordination identity | 不等于 replay scope或job execution ref |
| `RollupRebuildRef` | `contracts::refs` | TC | rollup rebuild identity | 不等于 signal rollup window ref |
| `ReadModelScope` | historical conceptual name | HX | 旧 read-model lookup scope 名称 | 不生成；统一复用 R06.2 `ObservationProjectionScope` |
| `GapViewScope` | historical aggregation scope | HX | 概要聚合 gap view 的旧 selector | current single-gap/page protocol以 `GapStateRef` / `GapSourceRef` selector承接；不生成该 type |
| `HandoffDeliveryResult` | `contracts::metadata` | FC | adapter-independent delivery outcome | finite result；不由错误字符串分类 |
| `AuthenticityGapReason` | `contracts::metadata` | FC | insufficient authenticity basis | finite body-free reason；不与placeholder classification混用 |
| `ReferenceRefreshResult` | `contracts::metadata` | FC | resolver refresh outcome | result与snapshot state total mapping |
| `PeripheralDeliveryResult` | `contracts::metadata` | FC | peripheral adapter result | delivery != source truth |
| `MaintenanceProgressSummary` | `contracts::metadata` | FC | body-free progress summary | bounded count + observation/reference dual watermark + failed refs；按target namespace requirement校验，不含run id/verdict |
| `ReferenceFreshnessSummary` | historical aggregation shape | HX | 旧多snapshot统计摘要 | current `ReferenceSnapshotView` 是单snapshot surface，直接使用 `ReferenceSnapshotStateKind`；不生成该type |
| `DiagnosticFreshnessState` | `contracts::metadata` | FC | diagnostic summary lifecycle | `Fresh/Stale/Partial/Unavailable` |
| `ReadVisibilityKind` | `contracts::metadata` | FC | read visibility lifecycle value | exact variants；not-visible != missing |
| `GapKind` | `contracts::metadata` | FC | gap classification | missing/unresolved/not-visible/unsafe categories |
| `GapLifecycleState` | `contracts::metadata` | FC | gap lifecycle | state-preserving suppression is explicit |
| `DegradedOutputKind` | `contracts::metadata` | FC | none/active/blocked degraded surface | no synthetic success |
| `PeripheralDeliveryKind` | `contracts::metadata` | FC | delivery state | pending/prepared/delivered/failed/blocked/cancelled |
| `ExportPreparationState` | `contracts::metadata` | FC | export preparation lifecycle | draft/prepared/blocked/delivered/failed |
| `ReferenceSnapshotStateKind` | `contracts::metadata` | FC | reference snapshot lifecycle | pending/resolved/stale/unresolved/invalid/unavailable |
| `ProjectionMaintenanceStateKind` | `contracts::metadata` | FC | projection maintenance lifecycle | fresh/stale/rebuilding/failed |
| `ReplayCoordinationKind` | `contracts::metadata` | FC | replay coordination lifecycle | pending/coordinating/blocked/completed/failed |
| `RollupRebuildKind` | `contracts::metadata` | FC | rollup rebuild lifecycle | pending/running/completed/failed/cancelled |

### 5.2 reason / marker / policy-input carrier owner

| 类型 | owner | allowed source | forbidden substitution |
|---|---|---|---|
| `RetentionPurpose` | `contracts::metadata` | retention command/config snapshot | no free text / retention days |
| `ActiveProtectionReason` | `contracts::metadata` | protection policy | no consumer label |
| `ProtectionConflictReason` | `contracts::metadata` | retention policy/repository conflict mapper | no SQL/network string |
| `RetentionReleaseReason` | R06.2 `contracts::metadata` | release policy/operator input | cannot authorize cleanup alone |
| `ReplayAllowedEffect` | R06.2 `contracts::metadata` | replay scope input | cannot contain source write |
| `ReplayBlockReason` | R06.2 `contracts::metadata` | replay boundary policy | no final rejection/verdict |
| `ReplayCloseReason` | R06.2 `contracts::metadata` | replay lifecycle | no source repaired claim |
| `NoWriteEscalationReason` | `contracts::metadata` | no-write guard | no compensation action |
| `NoWriteCloseReason` | `contracts::metadata` | no-write lifecycle | no deletion of history |
| `ReadBlockReason` | R06.2 `contracts::metadata` | visibility/no-write policy | no authorization decision |
| `DiagnosticScopeInvalidReason` | `contracts::metadata` | scope factory | no raw validation text |
| `DiagnosticUnavailableReason` | `contracts::metadata` | summary builder | no provider body |
| `StalenessReason` | R06.2 `contracts::metadata` | freshness policy | no local timestamp guess |
| `GapCloseReason` | R06.2 `contracts::metadata` | gap transition | no external repair assertion |
| `DegradedBlockReason` | R06.2 `contracts::metadata` | degraded policy | no hidden gap |
| `PeripheralBlockReason` | R06.2 `contracts::metadata` | export policy | no product-specific reason |
| `ExportBlockReason` | `contracts::metadata` | external export policy | no audit conclusion |
| `ExportFailureReason` | `contracts::metadata` | delivery adapter mapping | no untyped error string |
| `MaintenanceBlockReason` | R06.2 `contracts::metadata` | maintenance guard | no source repair claim |
| `MaintenanceFailureReason` | R06.3 `contracts::metadata` | maintenance result | no raw provider error |
| `MaintenanceCancelReason` | `contracts::metadata` | maintenance command/job | no implicit rollback |
| `ReferenceResolutionReason` | R06.2 `contracts::metadata` | resolver outcome | preserve missing/not-visible distinction |
| `ReferenceStaleReason` | R06.2 `contracts::metadata` | source-version/freshness policy | no timestamp/cursor substitution |
| `ReferenceInvalidReason` | `contracts::metadata` | reference boundary validation | invalid is terminal for snapshot |

### 5.3 R06.4 state owner rule

R06.4 state enum 的 wire/value definition归`contracts::metadata`，但只有 owning domain object 的 member 能推进它。下表是 current state owner，不是允许 public caller 直接构造终态的清单。

| state enum | owner object | initial factory | current transition owner | reserved / terminal |
|---|---|---|---|---|
| `ReportHandoffState` | `ReportHandoffRecord` | `Draft` | handoff member | `Delivered` terminal；`Cancelled` terminal/reserved with no current producer；permanent/rejected `Failed` terminal |
| `HandoffReadinessState` | `ReportHandoffRecord` | `PendingEvidence` | readiness policy result + object apply | no independent lifecycle |
| `AuthenticityHintState` | `AuthenticityHint` | `Unassessed` | hint member | no authenticity verdict |
| `RetentionMarkerState` | `RetentionMarker` | `Unmarked` | retention member | `Released` terminal/reserved；当前 phase 不允许 callable 到达 |
| `ActiveReferenceProtectionState` | `ActiveReferenceProtection` | `Unprotected` | protection member | `Released` terminal;`Expired` is release re-evaluation, not Released |
| `ReplayScopeState` | `ReplayScope` | `Defined` | replay member | `Completed/Cancelled` terminal |
| `NoWriteViolationState` | `NoWriteViolation` | `Detected` | guard member | `Closed` terminal |
| `ReadVisibilityKind` | `ReadVisibilityState` | policy result | visibility member | no global lifecycle |
| `DiagnosticFreshnessState` | `DiagnosticSummary` | `Unavailable` or `Partial` based on complete input | summary member | no source truth claim |
| `GapLifecycleState` | `GapState` | `Open` | gap member | `Resolved` terminal for current gap; suppression preserves audit |
| `DegradedOutputKind` | `DegradedOutputState` | `None` / `Active` by factory | degraded member | `Blocked` forbids body |
| `PeripheralDeliveryKind` | `PeripheralDeliveryState` | `Pending` | delivery member | `Delivered/Cancelled` and permanent/rejected `Failed` terminal；retryable `Failed` may reprepare after new policy decision |
| `ExportPreparationState` | `ExternalAuditExportPreparation` | `Draft` | export preparation member | `Delivered` and permanent/rejected `Failed` terminal；retryable `Failed` may consume a new decision；no external audit lifecycle |
| `ReferenceSnapshotStateKind` | `ReferenceSnapshotState` | `Pending` | resolver outcome application | `Invalid` terminal |
| `ProjectionMaintenanceStateKind` | `ProjectionMaintenanceState` | `Stale` for missing projection | maintenance member | `Failed` requires explicit retry/new state |
| `ReplayCoordinationKind` | `ReplayCoordinationState` | `Pending` | coordination member | `Completed/Failed` terminal for coordination attempt |
| `RollupRebuildKind` | `RollupRebuildState` | `Pending` | rebuild member | `Completed/Failed/Cancelled` terminal for attempt |

## 6. R06.4 shared support card format

本批新 carrier 必须遵循以下最小 schema，不得只在字段表中点名：

1. exact Rust type 或 enum variant。
2. owner、mint/source、wire、factory/member。
3. empty/bound/state compatibility。
4. 不得互换的相邻类型。
5. error / no-write / body-free redline。
6. tests / stop，不把测试结果伪写成已执行。

## 7. R06.4-A 批次检查点

| 检查项 | 结论 |
|---|---|
| 是否先建立R06.4批次和模块顺序 | pass |
| 是否明确contracts/domain/application/infra/entry owner | pass |
| 是否保留R06.2 canonical ref并禁止alias | pass |
| 是否把policy/record/application对象错误提前闭口 | pass_no_R06.5/R06.6_write |
| 是否定义本批support carrier owner | pass_for_known_R06.4_inventory |
| 是否声明状态enum的definition与mutation分离 | pass |
| 是否发现外部上游 blocker | none |
| 当前写入批次 | `R06.4-A` completed;继续 `R06.4-B` |

## 8. R06.4-B support / state exact cards

### 8.1 `EvidenceOriginKind`

```rust
/// Body-free origin classification used only by an authenticity hint.
pub enum EvidenceOriginKind {
    /// A body-free reference was supplied by a trusted boundary mapper.
    TrustedBoundary,

    /// The input is a placeholder or synthetic development reference.
    Placeholder,

    /// The origin cannot be established from the current safe inputs.
    InsufficientBasis,
}
```

| variant | wire | allowed source | allowed use | forbidden substitution |
|---|---|---|---|---|
| `TrustedBoundary` | `trusted_boundary` | resolver / handoff policy | authenticity hint only | not authenticity verdict |
| `Placeholder` | `placeholder` | typed placeholder classifier | block or qualify handoff | not real evidence alias |
| `InsufficientBasis` | `insufficient_basis` | gap/evidence policy | pending hint | not missing source truth |

Factory is private to the R06.5 authenticity policy result; no public constructor accepts a free string. The value contains no provider name, URI, body, run id or signoff.

### 8.2 `PlaceholderReason`

```rust
/// Finite reason why a body-free evidence input is treated as a placeholder.
pub enum PlaceholderReason {
    /// The input is explicitly marked as a fixture or example.
    ExplicitFixture,

    /// The reference lacks a trusted boundary origin.
    UntrustedOrigin,

    /// The input is missing a required immutable snapshot.
    MissingSnapshot,

    /// The input is a synthetic value that cannot support handoff.
    SyntheticReference,
}
```

| factory / member | contract |
|---|---|
| `as_token(&self) -> &'static str` | exact lowercase snake case; no dynamic variant |
| `from_policy_token(token: &str) -> Result<Self, ProtocolError>` | unknown/alias/empty rejected |
| source | authenticity policy or typed handoff input |
| invariant | reason only explains placeholder classification; it never creates or deletes evidence |
| tests / stop | four variants, unknown, missing snapshot, synthetic reference; planned only, not executed |

### 8.3 `HandoffDeliveryResult`

```rust
/// Product-neutral result returned by a handoff delivery boundary.
pub enum HandoffDeliveryResult {
    /// The local boundary recorded delivery to the configured consumer seam.
    Delivered,

    /// Delivery can be retried without changing the immutable handoff input.
    RetryableFailure,

    /// Delivery is permanently blocked for this handoff attempt.
    PermanentFailure,

    /// The consumer boundary refused the body-free input without accepting it.
    Rejected,
}
```

| field / method | source and rule |
|---|---|
| wire | `delivered`, `retryable_failure`, `permanent_failure`, `rejected` |
| source | adapter port outcome mapper; never parsed from error text |
| `can_retry()` | true only `RetryableFailure` |
| `is_terminal()` | true `Delivered`, `PermanentFailure`, `Rejected` |
| boundary | result says nothing about external acceptance, report correctness or signoff |

### 8.3.1 `AuthenticityGapReason`

```rust
/// Finite body-free reason why an authenticity hint lacks a sufficient basis.
pub enum AuthenticityGapReason {
    /// The immutable evidence-index input is not yet available.
    MissingImmutableInput,
    /// A required body-free evidence linkage is unresolved.
    UnresolvedEvidenceLinkage,
    /// Required evidence exists but is not visible under this boundary.
    EvidenceNotVisible,
    /// An explicit observation-side gap blocks a sufficient assessment.
    OpenObservationGap,
    /// A trusted body-free origin cannot currently be established.
    TrustedOriginUnavailable,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; R06.5 `AuthenticityHintPolicy` maps the exact immutable input/linkage/visibility/gap snapshot |
| wire | `missing_immutable_input`;`unresolved_evidence_linkage`;`evidence_not_visible`;`open_observation_gap`;`trusted_origin_unavailable` |
| state use | required by `AuthenticityHintState::Insufficient`;`OpenObservationGap` additionally requires non-empty `gap_refs` |
| invariant | not a placeholder reason, authenticity verdict, provider error, run id or evidence alias |
| tests / stop | five variants, placeholder substitution, open-gap-with-empty-set, unknown token; planned only |

### 8.4 `RetentionMarker`

#### 8.4.1 `RetentionMarkerDecision`

```rust
/// Domain-only target-bound policy decision for one retention marker snapshot.
pub struct RetentionMarkerDecision {
    /// Exact immutable P8 policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete marker pre-state observed by P8.
    marker_snapshot: RetentionMarkerPolicySnapshot,

    /// Reconciled protection post-snapshot, when the marker has a relation.
    reconciled_protection_snapshot: Option<ActiveProtectionPolicySnapshot>,

    /// Allowed next marker state; Released is never accepted here.
    to_state: RetentionMarkerState,

    /// Typed release-candidate basis, required only for ReleaseEligible.
    release_reason: Option<RetentionReleaseReason>,

    /// Typed conflict basis, required only for Conflict.
    conflict_reason: Option<RetentionConflictReason>,
}
```

| contract item | rule |
|---|---|
| owner / producer | `domain::retention`; private constructor owned by R06.5 `RetentionProtectionPolicy` |
| marker binding | `marker_snapshot`逐字段等于current loaded marker；expected repository version由application在消费前检查 |
| mandatory order | protection decision已被same relation成功应用后，P8从post-state构造`reconciled_protection_snapshot`；pre-reconciliation snapshot不能用于marker decision |
| protection matrix | marker relation与snapshot Option成对；Some时ref/target exact；Protected要求non-empty current set，Unprotected/Expired/Released要求empty，Conflicted保留exact set |
| allowed target | only `ActiveHold`、`ReleaseEligible`、`Conflict`；`Unmarked` is factory-only and `Released` is current-phase reserved |
| target payload | ActiveHold requires Protected + non-empty set；ReleaseEligible requires no active consumer + release reason；Conflict requires conflict reason；all preserve the exact reconciled relation identity when present |
| factory / members | `pub(crate) fn new(...)` only P8；`applies_to(marker, reconciled_protection)`；read-only basis/snapshot/outcome accessors；H5使用`pub(crate) fn proves_accepted_transition(&self, transition: &RetentionMarkerTransition, post_marker: &RetentionMarker, reconciled_protection: Option<&ActiveReferenceProtection>) -> bool`比较pre/change/post，不重新evaluate P8 |
| forbidden | no public/entry/config construction；reason alone cannot establish release eligibility；decision never authorizes cleanup |

#### 8.4.2 `RetentionMarker` object contract

```rust
/// Observation-owned retention marker that blocks cleanup without performing cleanup.
pub struct RetentionMarker {
    /// Stable retention marker identity.
    pub marker_ref: RetentionMarkerRef,

    /// Observation-side object protected by the marker.
    pub protected_ref: ProtectedObservationRef,

    /// Current retention lifecycle state.
    pub state: RetentionMarkerState,

    /// Protection relation evaluated with this marker, when one exists.
    pub active_protection_ref: Option<ActiveReferenceProtectionRef>,

    /// Optional archive eligibility hint owned by the boundary, not by archive.
    pub archive_eligibility_ref: Option<ArchiveEligibilityRef>,

    /// Purpose for which the observation material must remain available.
    pub purpose: RetentionPurpose,

    /// Typed basis retained while release eligibility is active.
    pub release_reason: Option<RetentionReleaseReason>,

    /// Typed reason retained while the marker is conflicted.
    pub conflict_reason: Option<RetentionConflictReason>,
}
```

| field | type | source | invariant |
|---|---|---|---|
| `marker_ref` | `RetentionMarkerRef` | application id generator | stable across state changes |
| `protected_ref` | `ProtectedObservationRef` | command input + repository validation | target must be observation-side |
| `state` | `RetentionMarkerState` | factory/member | `Released` cannot reopen |
| `active_protection_ref` | `Option<ActiveReferenceProtectionRef>` | same-UoW lookup | `ActiveHold/Conflict` must have compatible protection evidence |
| `archive_eligibility_ref` | `Option<ArchiveEligibilityRef>` | resolver/policy output | hint only; no archive body/package |
| `purpose` | `RetentionPurpose` | typed command/config snapshot | no retention duration/free text |
| `release_reason` | `Option<RetentionReleaseReason>` | owning member | Some only in `ReleaseEligible` |
| `conflict_reason` | `Option<RetentionConflictReason>` | owning member | Some only in `Conflict` |

| factory / member | result and transition |
|---|---|
| `for_observation(marker_ref, protected_ref, purpose) -> Result<Self, DomainError>` | `Unmarked`; no cleanup side effect |
| `apply_decision(&mut self, reconciled_protection: Option<&ActiveReferenceProtection>, decision: &RetentionMarkerDecision) -> Result<Option<RetentionMarkerTransition>, DomainError>` | rebuilds complete marker/protection snapshots and validates P8 basis binding before one atomic mutation；copies only ActiveHold/ReleaseEligible/Conflict and compatible relation/reasons；exact replay returns `Ok(None)` |
| `mark_archive_eligible(&mut self, archive_ref: ArchiveEligibilityRef) -> Result<Option<RetentionMarkerTransition>, DomainError>` | only `ReleaseEligible`; writes hint, not archive truth；exact duplicate returns `Ok(None)` |
| `release(&mut self) -> Result<RetentionMarkerTransition, DomainError>` | current phase reserved；无论 `ReleaseEligible` 是否满足条件都返回 `DomainError::ReservedTransition`，不产生 `Released` delta、不执行 cleanup |

Redlines: direct `ActiveHold -> Released`、current phase callable `ReleaseEligible -> Released`、empty protection proof、source/external target、archive package、deletion command and retention-policy string are rejected. `Released` remains a reserved/terminal enum value for the later state-matrix and persistence batches; R06.5 owns the exact transition record.

### 8.5 `ActiveReferenceProtection`

#### 8.5.1 `ActiveProtectionReleaseDecision`

```rust
/// Domain-only target-bound decision for one active-protection release evaluation.
pub struct ActiveProtectionReleaseDecision {
    /// Exact immutable P8 policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete protection pre-state observed by P8.
    protection_snapshot: ActiveProtectionPolicySnapshot,

    /// Complete current state loaded for every observed consumer.
    consumer_state_snapshots: RetentionConsumerStateSnapshotSet,

    /// Revalidated consumers that remain active for this exact evaluation.
    active_consumer_refs: ObservationConsumerRefSet,

    /// Typed release basis for Expired/Releasable, absent for Protected/Conflicted.
    release_reason: Option<RetentionReleaseReason>,

    /// Finite policy outcome for this exact snapshot.
    outcome: ActiveProtectionReleaseOutcome,
}
```

| contract item | rule |
|---|---|
| owner / producer | `domain::retention`; private constructor owned by R06.5 `RetentionProtectionPolicy` |
| target binding | complete `protection_snapshot` must equal the loaded object；consumer state set refs must equal its observed consumer set one-to-one；stale or partial snapshots reject |
| reconciliation | `active_consumer_refs` is the canonical retained subset selected by the 21-state P8 table：both KeepActive and Conflict consumers remain protected，only ReleaseCandidate refs may be removed；same identity may update only its typed current state, never kind/scope/owner |
| active set | non-empty `active_consumer_refs` with no rule conflict produces `Protected`；an explicit rule/snapshot conflict produces `Conflicted`；the object retains that exact active set and no active consumer is silently discarded |
| expired / releasable | both require empty revalidated active set and `release_reason=Some`；`Expired` requires a non-empty observed set；`Releasable` requires a fresh empty observed snapshot on an eligible pre-state |
| conflicted | requires `release_reason=None` and typed `ProtectionConflictReason`;active set may be empty only for an explicit snapshot/release-basis conflict |
| factory / members | `pub(crate) fn new(...)` only P8；`applies_to(protection, consumer_states)`；read-only basis/snapshot/outcome accessors；H5使用`pub(crate) fn proves_accepted_transition(&self, transition: &ActiveReferenceProtectionTransition, post_protection: &ActiveReferenceProtection, consumer_states: &RetentionConsumerStateSnapshotSet) -> bool`比较pre/change/post，不重新evaluate P8 |
| forbidden | no entry/config/adapter construction; decision cannot delete observation material or authorize cleanup |

#### 8.5.2 `ActiveProtectionReleaseOutcome`

```rust
/// Finite result of active-protection release evaluation.
pub enum ActiveProtectionReleaseOutcome {
    /// One or more valid current consumers keep this relation protected.
    Protected,
    /// All associated consumers are expired and release must be re-evaluated.
    Expired,
    /// A typed consumer, snapshot, or boundary conflict blocks normal reconciliation.
    Conflicted(ProtectionConflictReason),
    /// Current snapshot permits releasing this protection relation only.
    Releasable,
}
```

| contract item | rule |
|---|---|
| owner / constructor | `domain::retention`; only `RetentionProtectionPolicy` may select an outcome while constructing the target-bound decision |
| `Protected` | revalidated active set is non-empty, every retained consumer is a valid stable-identity current dependency, and release/conflict reasons are absent |
| `Expired` | observed pre-state set was non-empty but the revalidated active subset is empty；expiration retains a typed release reason and still requires a later fresh policy re-evaluation |
| `Conflicted` | typed consumer/snapshot/release-basis conflict remains; a reason is mandatory；every conflict consumer remains in the retained active set；empty is legal only for a set-level/release-basis conflict not attributable to one consumer |
| `Releasable` | observed pre-state set and revalidated active set are both empty, and the loaded policy basis permits releasing this relation only |
| boundary | none of the variants authorizes source cleanup, observation deletion or archive-package mutation |

```rust
/// Protection relation that prevents releasing an observation object while consumers still depend on it.
pub struct ActiveReferenceProtection {
    /// Stable active-protection identity.
    pub protection_ref: ActiveReferenceProtectionRef,

    /// Protected observation-side object and scope.
    pub protected_ref: ProtectedObservationRef,

    /// Reason explaining why the relation exists.
    pub reason: ActiveProtectionReason,

    /// Current protection lifecycle state.
    pub state: ActiveReferenceProtectionState,

    /// Canonical consumers that remain active in the latest accepted snapshot.
    pub consumer_refs: ObservationConsumerRefSet,

    /// Typed release basis retained by Expired or Released state.
    pub release_reason: Option<RetentionReleaseReason>,

    /// Typed reason retained while the relation is conflicted.
    pub conflict_reason: Option<ProtectionConflictReason>,
}
```

| factory / member | result and invariant |
|---|---|
| `protect(protection_ref, protected_ref, reason) -> Result<Self, DomainError>` | `Unprotected`; consumer set empty; protected target validated |
| `attach_consumer(&mut self, consumer_ref: ObservationConsumerRef) -> Result<Option<ActiveReferenceProtectionTransition>, DomainError>` | `Unprotected/Protected/Expired/Conflicted -> Protected`; exact duplicate returns `Ok(None)`；accepted attach clears stale release/conflict reasons |
| `mark_conflict(&mut self, reason: ProtectionConflictReason) -> Result<Option<ActiveReferenceProtectionTransition>, DomainError>` | non-Released -> `Conflicted`; does not clear consumers；same state/reason returns `Ok(None)` |
| `apply_release_decision(&mut self, consumer_states: &RetentionConsumerStateSnapshotSet, decision: &ActiveProtectionReleaseDecision) -> Result<Option<ActiveReferenceProtectionTransition>, DomainError>` | rebuilds complete pre-snapshot and consumer binding；atomically replaces current active set；non-empty/Protected -> Protected；explicit conflict -> Conflicted；empty/Expired from Protected/Conflicted -> Expired；empty/Releasable only from Unprotected/Expired/Conflicted -> Released；Protected cannot jump to Released；exact replay returns `Ok(None)` |

The canonical state enum is the R06.4 contracts `ActiveReferenceProtectionState`; this card fixes contextual rules. `consumer_refs` contains only currently active consumers. Historical associations belong to R06.5 append-only records, not this mutable set. Neither an empty set nor `Expired` proves that no historical reference existed.

### 8.6 `ReplayScope`

```rust
/// Approved observation-side replay boundary with an explicit no-write effect.
pub struct ReplayScope {
    /// Stable replay scope identity.
    pub scope_ref: ReplayScopeRef,

    /// Non-empty canonical observation-side target set.
    pub target_refs: ReplayTargetRefSet,

    /// Exact effect allowed for this scope.
    pub allowed_effect: ReplayAllowedEffect,

    /// Current replay scope lifecycle.
    pub state: ReplayScopeState,

    /// Guard scope proving source and external truth remain unwritable.
    pub no_write_guard_scope: NoWriteGuardScope,

    /// Typed reason retained while this scope is blocked.
    pub block_reason: Option<ReplayBlockReason>,

    /// Typed reason retained when this scope completed or was cancelled.
    pub close_reason: Option<ReplayCloseReason>,
}
```

| factory / member | result and invariant |
|---|---|
| `define(scope_ref, target_refs, allowed_effect, no_write_guard_scope) -> Result<Self, DomainError>` | `Defined`; target set non-empty; effect and target kind compatible; guard must include observation maintenance boundary |
| `apply_boundary_decision(&mut self, target_boundaries: &ReplayTargetBoundarySnapshotSet, decision: &ReplayApprovalSnapshot) -> Result<ReplayScopeTransition, DomainError>` | 唯一public policy入口；只接受`Defined` pre-state，先重建complete scope/per-target snapshot并执行`decision.applies_to`；`Approved`调用private `approve()`，`Blocked { reason, .. }`调用private `block(reason)`，两者均保留exact target/effect/guard |
| private `approve(&mut self) -> Result<ReplayScopeTransition, DomainError>` | 仅由`apply_boundary_decision`调用；`Defined -> Approved`；没有decision参数、public visibility或application绕过路径 |
| private `block(&mut self, reason: ReplayBlockReason) -> Result<ReplayScopeTransition, DomainError>` | 仅由`apply_boundary_decision`调用；`Defined -> Blocked`；reason来自已绑定P9 outcome，targets retained |
| `narrow_to(&mut self, target: ReplayTargetRef) -> Result<Option<ReplayScopeTransition>, DomainError>` | only `Defined`; target must be a member; cannot add or broaden; an already-singleton exact target returns `Ok(None)` |
| `close(&mut self, reason: ReplayCloseReason) -> Result<ReplayScopeTransition, DomainError>` | `Approved -> Completed` for `CompletedWithinScope`; `Defined/Approved -> Cancelled` for cancellation/supersession; `Blocked` is terminal and rejects close |

`ReplayApprovalSnapshot` is a domain-only, complete scope/per-target decision produced by P9; it is not a public DTO and cannot be constructed by an entry handler. A single global retention/protection state cannot approve a multi-target scope. `ReplayScopeState::Approved` is the only state that may feed replay coordination.

### 8.7 `NoWriteViolation`

```rust
/// Recorded attempt to write source or external truth from an observability-only operation.
pub struct NoWriteViolation {
    /// Stable no-write violation identity.
    pub violation_ref: NoWriteViolationRef,

    /// Body-free context identifying the attempted operation boundary.
    pub trigger_context_ref: NoWriteTriggerContextRef,

    /// Typed target that the operation attempted to mutate.
    pub attempted_write_target: ForbiddenWriteTargetRef,

    /// Current violation lifecycle.
    pub state: NoWriteViolationState,

    /// Typed reason retained while the violation is escalated.
    pub escalation_reason: Option<NoWriteEscalationReason>,

    /// Typed reason retained after local handling is closed.
    pub close_reason: Option<NoWriteCloseReason>,

}
```

| factory / member | result and invariant |
|---|---|
| `detect(violation_ref, trigger_context_ref, attempted_write_target) -> Result<Self, DomainError>` | `Detected`; target must be SourceTruth or ExternalTruth; no body/message |
| `block(&mut self) -> Result<NoWriteViolationTransition, DomainError>` | `Detected -> Blocked`; must fail closed before adapter write |
| `escalate(&mut self, reason: NoWriteEscalationReason) -> Result<NoWriteViolationTransition, DomainError>` | `Detected/Blocked -> Escalated`; escalation does not authorize any write |
| `close(&mut self, reason: NoWriteCloseReason) -> Result<NoWriteViolationTransition, DomainError>` | `Blocked/Escalated -> Closed`; preserves violation identity; append/history linkage is assembled by R06.5 outside this object |

`NoWriteViolationRecord` and `NoWriteViolationRecordRef` are R06.5-owned and intentionally absent from this Step 06 state object and transition. Application assembly may correlate the accepted transition with a later record in the same UoW; this object never fabricates record identity or timestamp.

### 8.8 `R06.4-B` 模块内停审

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| handoff | handoff readiness与delivery lifecycle是否分离 | pass | readiness由policy结果提供，delivery使用typed outcome |
| retention | hold/release是否不等于cleanup | pass | release要求active protection为空且policy闭合 |
| replay | target/effect/no-write是否闭合 | pass | `Approved`仅由target-bound approval产生，entry不能构造 |
| no-write | source/external write是否fail closed | pass | violation先block，record由R06.5补齐 |
| cross-module | 是否误依赖R06.5 record schema | pass_no_record_definition | 仅返回transition delta；record type/ref/metadata全部留R06.5 |
| external truth | 是否引入source/archive/report/evidence truth | pass_no_external_truth | 全部body-free，保留 boundary marker |

| 当前写入批次 | `R06.4-B` completed;下一批为 `R06.4-C` |

## 9. R06.4-C read / diagnostic / gap support and object cards

### 9.1 `ReadPurpose`

```rust
/// Product-neutral purpose for one read-side evaluation.
pub enum ReadPurpose {
    /// A normal read of already committed observation material.
    Query,

    /// An explain-only diagnostic read.
    Diagnostic,

    /// A read-only preview before report handoff preparation.
    HandoffPreview,

    /// A read-only preview before peripheral export preparation.
    ExportPreparation,
}
```

| field / method | contract |
|---|---|
| wire | `query`, `diagnostic`, `handoff_preview`, `export_preparation` |
| owner | `contracts::metadata`; shared by query context and read policy |
| source | typed protocol input or application assembler; not config free text |
| invariant | purpose never authorizes write, refresh, replay or export by itself |
| tests / stop | four variants, unknown token, purpose-to-surface compatibility; planned only |

### 9.2 `DiagnosticTimeWindow`

```rust
/// Bounded time selection over committed observation material.
pub struct DiagnosticTimeWindow {
    /// Optional lower bound; absence means from the earliest retained material.
    pub starts_at: Option<ObservedAt>,

    /// Inclusive upper bound for the selected material.
    pub ends_at: ObservedAt,
}
```

| factory / member | contract |
|---|---|
| `try_new(starts_at: Option<ObservedAt>, ends_at: ObservedAt) -> Result<Self, ProtocolError>` | `starts_at <= ends_at`; no local clock default |
| `contains(&self, observed_at: ObservedAt) -> bool` | pure bounded comparison |
| wire | canonical object with `starts_at` optional and required `ends_at` |
| source | query/job typed input or loaded immutable diagnostic scope |
| invariant | no unbounded upper window, no UI paging semantics, no source scan permission |
| tests / stop | lower/upper equal, lower after upper, missing upper, canonical round-trip; planned only |

### 9.3 historical `ReadModelScope` 与 canonical projection scope

`ReadModelScope` 仅是旧概要中的概念名称，不再生成 Rust type、kind enum 或 wire token。read model、diagnostic 和 maintenance lookup 统一使用 R06.2 已闭口的 `ObservationProjectionScope`，其 canonical variants 为 `ByObservation`、`ByCorrelation`、`ByAuditSubject`、`ByReportHandoff`、`ByMaintenanceTarget`。

| replacement use | contract |
|---|---|
| `ObservationReadModel::scope` | `ObservationProjectionScope`；不引入 view-specific scope wrapper |
| diagnostic / rebuild input | 复用 `ObservationProjectionScope` 并另带 owning `DiagnosticScopeRef` 或 `MaintenanceTargetRef` |
| lookup encoding | 调用 canonical scope 的 `kind()` / `canonical_bytes()`；scope 不生成 view identity |
| forbidden | `ReadModelScope`、`ReadModelScopeKind`、`All` variant、free string lookup、scope-to-authorization promotion |
| tests / stop | implementation must have no `ReadModelScope*` symbol; planned canonical scope round-trip and cross-scope rejection |

### 9.4 historical `GapViewScope`

概要 V8 曾把 `GapStatusView` 写成聚合 view，并为其点名 `GapViewScope`。current Step 08 / Step 09 已收敛为 identity=`GapStateRef` 的单项 `GapStatusView`，查询使用 typed `GapStateRef` 或 `GapSourceRef` selector并由 generic public page承接集合。因此本批不生成 `GapViewScope`，也不允许它与 `VisibilityScopeRef` 合并成新的授权或 projection identity。

### 9.5 named read-side ref sets

R06.3 已闭口的 `SafeSignalRefSet` 和 `AuditProjectionRefSet` 是 read model / diagnostic 的 canonical member sets。本批不生成 `SafeSignalProjectionViewRefSet` 或 `AuditTimelineViewRefSet`；view identity 与 underlying signal/audit truth identity 不再建立第二套集合。

`DegradedOutputStateRefSet` 同属概要聚合 shape，不生成 active Rust type。每个 `GapStatusView` 只携带与该 gap 对应的 `Option<DegradedOutputRef>`；page 通过 `ObservationPublicPage<GapStatusView>` 表达多个 gap/degraded 关系。禁止同时保留单项 view 和聚合 ref-set 形成两套 cardinality truth。

### 9.6 `ReplayApprovalSnapshot`

```rust
/// Domain-local P9 decision over one complete replay scope boundary.
pub struct ReplayApprovalSnapshot {
    /// Exact immutable P9 policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete replay-scope pre-state observed by P9.
    scope_snapshot: ReplayScopePolicySnapshot,

    /// One complete retention/protection/no-write snapshot for every target.
    target_boundary_snapshots: ReplayTargetBoundarySnapshotSet,

    /// Finite scope result selected after every target is evaluated.
    outcome: ReplayBoundaryOutcome,
}
```

| factory / member | contract |
|---|---|
| `pub(crate) fn new(policy_basis, scope_snapshot, target_boundary_snapshots, outcome) -> Result<Self, DomainError>` | constructor仅P9可调用；family必须`ReplayBoundary`；set与scope targets一一相等且canonical；outcome中的blocked target必须属于set并是按canonical order得到的first blocked target |
| `applies_to(&self, scope: &ReplayScope, target_boundaries: &ReplayTargetBoundarySnapshotSet) -> bool` | 重新构造scope全部字段及每target retention/protection/P10 complete snapshot；任一target、state、consumer set、guard decision、effect、order或policy basis变化都使decision失效 |
| `policy_basis()` / `scope_snapshot()` / `target_boundary_snapshots()` / `outcome()` | 只读借用；不提供bool approval、public deserialize或generic conversion |
| source | application在一个consistent observation snapshot中加载`ReplayScope`和每target relation，并先取得same-target P10 decision；P9只消费complete set |
| invariant | `Approved`要求所有target allow；`Blocked`是expected outcome，不是`DomainError`；decision本身不移动scope、不建立job plan或execution truth |
| tests / stop | missing/extra/duplicate target、cross-scope P10、single global state、first-block stability、stale complete snapshot；planned only |

### 9.6.1 `ReadVisibilityDecision`

```rust
/// Domain-only target-bound result produced by read visibility policy.
pub struct ReadVisibilityDecision {
    /// Exact immutable P11 policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete one-shot request, target, projection, gap and P10 snapshot.
    input_snapshot: ReadVisibilityInputSnapshot,

    /// Finite visibility outcome.
    kind: ReadVisibilityKind,

    /// Constraint that requires a restricted surface, when applicable.
    constraint_ref: Option<VisibilityConstraintRef>,

    /// Explicit gap required for not-visible and retained when a blocked outcome has a real gap.
    gap_ref: Option<GapStateRef>,

    /// Typed hard-block reason, when applicable.
    block_reason: Option<ReadBlockReason>,
}
```

| contract item | rule |
|---|---|
| owner / producer | `domain::read`; `pub(crate)` constructor仅R06.5 P11 `ReadVisibilityPolicy`可调用 |
| complete input | `ReadVisibilityInputSnapshot`保存one-shot visibility identity、完整request context、exact read target/projection/freshness/source provenance/complete gap revisions、scope及same-target P10 decision |
| target binding | `applies_to(input)`逐字段比较完整input；另一个request、actor、target、projection head、freshness、gap revision、constraint/block provenance、scope或P10 decision不能复用 |
| outcome matrix | `Visible` has no optional payload;`Restricted` requires only `constraint_ref`;`NotVisible` requires only `gap_ref`;`Blocked` requires `block_reason` and permits `gap_ref=None` only when no real classified gap backs the guard block |
| accessors | `policy_basis()`、`input_snapshot()`、`kind()`、optional payload只读；H7 future sibling records module还可使用`pub(crate) fn no_write_policy_basis(&self) -> &PolicyEvaluationBasis`和`pub(crate) fn proves_post_state(&self, post_state: &ReadVisibilityState) -> bool`；不暴露public constructor、serde decode、bool visibility conversion或authorization token |
| forbidden | entry/config/adapter cannot construct it; no authorization grant, body, locator or persistence side effect；不能把flattened ref替代complete snapshot |
| tests / stop | cross-request/actor/target/P10 reuse、scope mismatch、visible-with-blocking-gap、not-visible-without-gap；planned only |

### 9.7 transition delta carriers

These four types are domain-owned process-local outputs. They do not contain actor, timestamp, record identity, outbox identity or external adapter result; R06.5/application assembles those fields later.

#### `RetentionMarkerTransition`

```rust
/// Accepted operation that produced one retention-marker delta.
pub enum RetentionMarkerTransitionKind {
    DecisionApplied,
    ArchiveEligibilityAttached,
}

/// Typed state delta emitted by a retention marker mutation.
pub struct RetentionMarkerTransition {
    /// Retention marker changed by the transition.
    pub marker_ref: RetentionMarkerRef,

    /// Exact owning operation that produced the delta.
    pub change_kind: RetentionMarkerTransitionKind,

    /// State before the mutation.
    pub from_state: RetentionMarkerState,

    /// State after the mutation.
    pub to_state: RetentionMarkerState,

    /// Protection relation before the mutation, when one existed.
    pub previous_active_protection_ref: Option<ActiveReferenceProtectionRef>,

    /// Archive eligibility hint before the mutation, when one existed.
    pub previous_archive_eligibility_ref: Option<ArchiveEligibilityRef>,

    /// Release-candidate reason before the mutation, when one existed.
    pub previous_release_reason: Option<RetentionReleaseReason>,

    /// Conflict reason before the mutation, when one existed.
    pub previous_conflict_reason: Option<RetentionConflictReason>,

    /// Protection state evaluated by a policy decision, absent for hint-only attachment.
    pub evaluated_active_protection_state: Option<ActiveReferenceProtectionState>,

    /// Exact active-consumer set evaluated by a policy decision.
    pub evaluated_active_consumer_refs: ObservationConsumerRefSet,
}
```

The post-mutation `RetentionMarker` supplies the complete current relation/archive/reason fields. The delta preserves every overwritten prior value; the accepted P8 decision separately supplies the policy basis that is not stored on the marker. `DecisionApplied` must match that decision's protection state/set. `ArchiveEligibilityAttached` has no evaluated protection state, an empty evaluated set and a state-preserving archive-ref change. At least one state/relation/archive/reason value changes, otherwise the member returns `Ok(None)`. The kind is finite and domain-owned; application cannot relabel it.

#### `ActiveReferenceProtectionTransition`

```rust
/// Accepted operation that produced one active-protection delta.
pub enum ActiveReferenceProtectionTransitionKind {
    ConsumerAttached,
    ConflictMarked,
    ReleaseDecisionApplied,
}

/// Typed state delta emitted by active-reference protection mutation.
pub struct ActiveReferenceProtectionTransition {
    /// Protection relation changed by the transition.
    pub protection_ref: ActiveReferenceProtectionRef,

    /// Exact owning operation that produced the delta.
    pub change_kind: ActiveReferenceProtectionTransitionKind,

    /// State before the mutation.
    pub from_state: ActiveReferenceProtectionState,

    /// State after the mutation.
    pub to_state: ActiveReferenceProtectionState,

    /// Consumer affected by the transition, if any.
    pub affected_consumer_ref: Option<ObservationConsumerRef>,

    /// Canonical active-consumer snapshot before the transition.
    pub previous_consumer_refs: ObservationConsumerRefSet,

    /// Canonical active-consumer snapshot after the transition.
    pub current_consumer_refs: ObservationConsumerRefSet,

    /// Release-evaluation reason before the mutation, when any.
    pub previous_release_reason: Option<RetentionReleaseReason>,

    /// Release-evaluation reason after the mutation, when any.
    pub current_release_reason: Option<RetentionReleaseReason>,

    /// Conflict reason before the mutation, when any.
    pub previous_conflict_reason: Option<ProtectionConflictReason>,

    /// Conflict reason after the mutation, when any.
    pub current_conflict_reason: Option<ProtectionConflictReason>,
}
```

The previous/current set and reason pairs are mandatory change proof because attach and release evaluation may clear stale reasons while preserving or replacing state. `ConsumerAttached` requires `affected_consumer_ref=Some(exact newly inserted consumer)`; the other kinds require None. `ConflictMarked` carries a direct current conflict reason and no P8 decision. `ReleaseDecisionApplied` must bind a P8 decision and may produce Protected/Expired/Released/Conflicted. Exact state/set/reason replay returns `Ok(None)` and emits no transition. The kind prevents H5 from guessing operation provenance from an identical target state.

#### `ReplayScopeTransition`

```rust
/// Typed state delta emitted by replay-scope mutation.
pub struct ReplayScopeTransition {
    /// Replay scope changed by the transition.
    pub scope_ref: ReplayScopeRef,

    /// State before the mutation.
    pub from_state: ReplayScopeState,

    /// State after the mutation.
    pub to_state: ReplayScopeState,

    /// Target set before the mutation.
    pub previous_target_refs: ReplayTargetRefSet,

    /// Target set after the mutation.
    pub current_target_refs: ReplayTargetRefSet,

    /// Effect remains the exact validated effect.
    pub allowed_effect: ReplayAllowedEffect,

    /// Block reason before the mutation, when any.
    pub previous_block_reason: Option<ReplayBlockReason>,

    /// Block reason after the mutation, when any.
    pub current_block_reason: Option<ReplayBlockReason>,

    /// Close reason before the mutation, when any.
    pub previous_close_reason: Option<ReplayCloseReason>,

    /// Close reason after the mutation, when any.
    pub current_close_reason: Option<ReplayCloseReason>,
}
```

Approval preserves target/effect and clears no reason; narrowing changes only the target pair; blocking sets only the current block reason; completion/cancellation sets only the current close reason. The post-mutation aggregate supplies the unchanged no-write guard. An already-singleton exact narrow returns `Ok(None)`.

#### `NoWriteViolationTransition`

```rust
/// Typed state delta emitted by no-write violation mutation.
pub struct NoWriteViolationTransition {
    /// Violation changed by the transition.
    pub violation_ref: NoWriteViolationRef,

    /// Immutable trigger context attached to the violation.
    pub trigger_context_ref: NoWriteTriggerContextRef,

    /// State before the mutation.
    pub from_state: NoWriteViolationState,

    /// State after the mutation.
    pub to_state: NoWriteViolationState,

    /// Forbidden target remains attached for audit explanation.
    pub attempted_write_target: ForbiddenWriteTargetRef,

    /// Escalation reason before the mutation, when any.
    pub previous_escalation_reason: Option<NoWriteEscalationReason>,

    /// Escalation reason after the mutation, when any.
    pub current_escalation_reason: Option<NoWriteEscalationReason>,

    /// Close reason before the mutation, when any.
    pub previous_close_reason: Option<NoWriteCloseReason>,

    /// Close reason after the mutation, when any.
    pub current_close_reason: Option<NoWriteCloseReason>,
}
```

`trigger_context_ref` and `attempted_write_target` must equal the owning violation's immutable relation before and after mutation. Blocking has no reasons before/after. Escalation sets only the current escalation reason. Closing preserves the prior escalation reason for history while setting the current close reason on the aggregate; the delta records both pairs so a record factory never infers whether close followed Blocked or Escalated from current truth. Affected checkpoint: `pass_R06.5-F_affected_sync`.

All four delta factories/members reject `from_state == to_state` unless the operation is an explicitly documented state-preserving attachment/evaluation with a changed conditional payload. Exact duplicates return `Ok(None)` and no delta. No delta may be serialized as an append-only record directly.

### 9.8 `ReadVisibilityState`

```rust
/// Request-scoped visibility decision for an observation read surface.
pub struct ReadVisibilityState {
    /// Stable identity of the visibility evaluation when it is recorded.
    pub visibility_ref: ReadVisibilityRef,

    /// Exact visibility classification for this request context.
    pub kind: ReadVisibilityKind,

    /// One-shot request context used to derive the decision.
    pub request_context_ref: DiagnosticRequestContextRef,

    /// Visibility scope evaluated by the policy.
    pub visibility_scope_ref: VisibilityScopeRef,

    /// Constraint retained by a restricted result, when applicable.
    pub constraint_ref: Option<VisibilityConstraintRef>,

    /// Explicit gap explaining not-visible output or a gap-backed blocked output.
    pub gap_ref: Option<GapStateRef>,

    /// Typed reason retained by a blocked result, when required.
    pub block_reason: Option<ReadBlockReason>,
}
```

| factory / member | result and invariant |
|---|---|
| phase-reserved private `from_decision(decision: &ReadVisibilityDecision) -> Result<Self, DomainError>` | 只为未来明确启用的asynchronous read-audit flow保留；copies complete target-bound decision after exact input/payload checks；current Command/Query/Consumer/Job均无producer权限 |
| phase-reserved private `apply_decision(&mut self, decision: &ReadVisibilityDecision) -> Result<Option<ReadVisibilityTransition>, DomainError>` | 只允许未来async read-audit对same visibility/request/scope/target identity重评；current phase不可调用；exact replay returns `Ok(None)` |
| `is_visible(&self) -> bool` | true only `Visible` or `Restricted` according to surface rules |

Current synchronous Query does not construct、persist或mutate this object，也没有current `ReadVisibilityState` producer。Query只借用P11 `ReadVisibilityDecision`组装response，且不得创建H7、transition、request-context row或outbox。只有未来明确开启、具有`ObservationRecordOrigin::AsynchronousReadAudit`和独立Command/Consumer UoW的read-audit flow，才可解除上述private phase gate；R06.5-F只允许定义H7 schema和禁用条件，不得据此宣称writer已存在。

### 9.9 `DiagnosticScope`

```rust
/// Stable versioned scope selecting committed observation material for diagnostics.
pub struct DiagnosticScope {
    /// Stable scope identity preserved across derived replacements.
    pub scope_ref: DiagnosticScopeRef,

    /// Projection scope whose target kinds are compatible with target_refs.
    pub projection_scope: ObservationProjectionScope,

    /// Canonical bounded body-free target set.
    pub target_refs: BodyFreeRefSet,

    /// Inclusive observation time window.
    pub time_window: DiagnosticTimeWindow,

    /// Visibility boundary applied to the scope.
    pub visibility_scope_ref: VisibilityScopeRef,
}
```

| factory / member | result and invariant |
|---|---|
| `define(scope_ref, projection_scope, target_refs, time_window, visibility_scope_ref) -> Result<Self, DomainError>` | application supplies the exact observation-object members selected from one consistent projection snapshot; factory canonicalizes the non-empty set, rejects source/external/generic-unowned refs, checks projection-scope-compatible member kinds and `starts_at <= ends_at` |
| `contains(&self, target_ref: &BodyFreeRef) -> bool` | pure membership check |
| `replace_targets(&mut self, target_refs: BodyFreeRefSet) -> Result<DiagnosticScopeTransition, DomainError>` | only accepted maintenance replacement; validates/canonicalizes the complete new set before one atomic replacement, preserves scope identity and returns a delta only on success; invalid input returns typed `DomainError` carrying `DiagnosticScopeInvalidReason`, with zero mutation and zero delta |

`Defined/Restricted/Invalid` from the overview is not a second state machine: successful construction is defined, visibility restriction is `ReadVisibilityState`, and invalid construction or replacement is a typed failure. There is no `invalidate` member and no rejected-operation transition; Query cannot call `replace_targets`.

`projection_scope` is the stable lookup/root selector; `target_refs` is the exact selected member set beneath that root, not a duplicate root list and not a permission scope. Application establishes root-to-member dependency from one repository snapshot before calling `define`; later object members can prove inclusion only by converting their typed observation-owned identity to canonical `BodyFreeRef` and checking this set. A ref absent from the set is out of scope even if it has the same broad kind.

### 9.10 `DiagnosticRequestContext`

```rust
/// One-shot read context for query or diagnostic evaluation.
pub struct DiagnosticRequestContext {
    /// One-shot context identity.
    pub request_context_ref: DiagnosticRequestContextRef,

    /// Safe actor projection used for visibility evaluation.
    pub actor_ref: ActorSafeRef,

    /// Read purpose for this request.
    pub read_purpose: ReadPurpose,

    /// Projection scope selected by the request.
    pub projection_scope: ObservationProjectionScope,

    /// Diagnostic scope loaded for the request.
    pub diagnostic_scope_ref: DiagnosticScopeRef,

    /// Visibility scope supplied by the caller's trusted boundary.
    pub visibility_scope_ref: VisibilityScopeRef,

    /// Request timestamp from canonical metadata.
    pub requested_at: ObservedAt,
}
```

| factory / member | contract |
|---|---|
| `for_read(request_context_ref, actor_ref, read_purpose, projection_scope, diagnostic_scope_ref, visibility_scope_ref, requested_at) -> Result<Self, DomainError>` | lossless typed construction; `ReadPurpose` cannot be a write command; scope owner must match projection scope |
| `matches_scope(&self, scope: &DiagnosticScope) -> bool` | exact projection and diagnostic scope identity check |
| persistence | never persisted by synchronous Query; only safe ref may enter a read-access history later |
| forbidden | no command payload, source body, credentials, authorization grant or UI state |

### 9.11 `DiagnosticSummary`

```rust
/// Immutable derived-summary revision assembled from one committed diagnostic selection.
pub struct DiagnosticSummary {
    /// Identity of this immutable revision; every accepted replacement gets a new ref.
    pub summary_ref: DiagnosticSummaryRef,

    /// Scope used to assemble the summary.
    pub scope_ref: DiagnosticScopeRef,

    /// Freshness of this derived summary.
    pub freshness: DiagnosticFreshnessState,

    /// Typed reason retained while the summary is stale.
    pub staleness_reason: Option<StalenessReason>,

    /// Typed reason retained while the summary is unavailable.
    pub unavailable_reason: Option<DiagnosticUnavailableReason>,

    /// Safe signal view identities included in the summary.
    pub safe_signal_refs: SafeSignalRefSet,

    /// Explicit gaps included in the summary.
    pub gap_refs: GapStateRefSet,

    /// No-write violations included in the explanation.
    pub no_write_violation_refs: NoWriteViolationRefSet,

    /// Committed cursor used to assemble this summary.
    pub as_of_cursor: Option<ObservationCommittedCursor>,

    /// Time when the derived summary was assembled.
    pub assembled_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `from_consistent_snapshot(summary_ref, scope: &DiagnosticScope, request_context: &DiagnosticRequestContext, freshness, staleness_reason, unavailable_reason, safe_signals: &[SafeSignal], gaps: &[GapState], no_write_violations: &[NoWriteViolation], as_of_cursor, assembled_at) -> Result<Self, DomainError>` | context must bind the same diagnostic/projection/visibility scopes; each loaded object's typed identity must be an exact `scope.target_refs` member; Candidate signal is rejected; sets are derived from loaded objects, never caller-supplied refs; freshness/reason/gap/cursor matrix is total and non-empty committed inputs require a cursor |
| `with_signal(previous: &Self, replacement_ref, scope: &DiagnosticScope, signal: &SafeSignal, committed_cursor, assembled_at) -> Result<Option<(Self, DiagnosticSummaryTransition)>, DomainError>` | maintenance-only replacement; same scope, exact target membership and non-Candidate saved signal required; cursor/time cannot regress; copies all prior members and inserts one signal; duplicate returns `Ok(None)`; attachment never promotes freshness |
| `with_gap(previous: &Self, replacement_ref, scope: &DiagnosticScope, gap: &GapState, committed_cursor, assembled_at) -> Result<Option<(Self, DiagnosticSummaryTransition)>, DomainError>` | maintenance-only replacement; exact selected gap identity required; cursor/time cannot regress; duplicate returns `Ok(None)`; an unresolved gap changes `Fresh -> Partial` in the same replacement |
| `with_no_write_violation(previous: &Self, replacement_ref, scope: &DiagnosticScope, violation: &NoWriteViolation, committed_cursor, assembled_at) -> Result<Option<(Self, DiagnosticSummaryTransition)>, DomainError>` | maintenance-only replacement; exact selected violation identity required; cursor/time cannot regress; duplicate returns `Ok(None)`; attachment is explanatory and cannot by itself claim source repair or promote freshness |
| `as_stale(previous: &Self, replacement_ref, reason: StalenessReason, assembled_at) -> Result<Option<(Self, DiagnosticSummaryTransition)>, DomainError>` | `Fresh/Partial -> Stale`; changed reason may replace Stale; exact duplicate returns `Ok(None)`; member sets/cursor remain auditable and source truth is unchanged |
| `as_unavailable(previous: &Self, replacement_ref, reason: DiagnosticUnavailableReason, assembled_at) -> Result<Option<(Self, DiagnosticSummaryTransition)>, DomainError>` | any revision -> `Unavailable`; changed reason may replace Unavailable; exact duplicate returns `Ok(None)`; old safe refs/cursor remain auditable but normal body is unavailable |

Every accepted replacement requires `replacement_ref != previous.summary_ref`, preserves `scope_ref`, derives the new sets from the previous revision plus the loaded object, and returns the complete new revision together with its delta. The old revision is never mutated or overwritten by Query. Repository save appends/replaces the current-head pointer under expected-head/CAS in the same UoW as any history record; losing CAS discards both new revision and delta.

### 9.12 `GapState`

```rust
/// Explicit observable gap that explains missing, unresolved, not-visible or unsafe output.
pub struct GapState {
    /// Stable gap identity.
    pub gap_ref: GapStateRef,

    /// Body-free source explaining the gap.
    pub source_ref: GapSourceRef,

    /// Gap category.
    pub gap_kind: GapKind,

    /// Gap lifecycle.
    pub state: GapLifecycleState,

    /// Observation-side object affected by the gap.
    pub affected_object_ref: AffectedObservationObjectRef,

    /// Degraded output linked to this gap, when one exists.
    pub degraded_ref: Option<DegradedOutputRef>,

    /// Time when the gap was opened.
    pub opened_at: ObservedAt,

    /// Time when the gap was resolved inside this boundary, if resolved.
    pub closed_at: Option<ObservedAt>,

    /// Local body-free basis retained when the gap is resolved.
    pub close_reason: Option<GapCloseReason>,
}
```

| factory / member | result and invariant |
|---|---|
| `open_from_decision(gap_ref, decision: &GapClassificationDecision, opened_at) -> Result<Self, DomainError>` | 唯一public opening factory；只接受P12 `Classified(kind)`，从complete decision basis复制source/affected/kind并重新验证binding；`NoGap`拒绝且不建立object |
| private `open(gap_ref, source_ref, gap_kind, affected_object_ref, opened_at) -> Result<Self, DomainError>` | 仅由`open_from_decision`调用；state `Open`；source/affected kind compatibility checked；application/entry不能提交bare `GapKind` |
| `acknowledge(&mut self, actor_ref: ActorSafeRef) -> Result<GapTransition, DomainError>` | `Open -> Acknowledged`; acknowledgement is not resolution |
| `mitigate(&mut self, degraded: &DegradedOutputState) -> Result<Option<GapTransition>, DomainError>` | `Open/Acknowledged -> Acknowledged`; loaded degraded revision must point to this exact gap and be `Active/Blocked`; exact same revision returns `Ok(None)` |
| `close(&mut self, reason: GapCloseReason, closed_at: ObservedAt) -> Result<GapTransition, DomainError>` | `Open/Acknowledged/Suppressed -> Resolved` only with typed local resolution evidence; does not claim source repair |
| `suppress(&mut self, ...)` / `unsuppress(&mut self, ...)` | reserved; current boundary rejects with `DomainError::ReservedTransition` |

`Suppressed` is a surface-specific future state and is not a current callable path. Empty `GapStateRefSet` in a view means no gap in that selected surface, not no gap globally. Existing persisted gap rehydration validates the stored kind and lifecycle without rerunning the current policy; P12 controls new gap opening only and cannot rewrite historical classification.

### 9.13 `DegradedOutputState`

```rust
/// Immutable derived-output revision produced by one target-bound policy evaluation.
pub struct DegradedOutputState {
    /// Identity of this immutable degraded-output revision.
    pub degraded_ref: DegradedOutputRef,

    /// Exact observation-side object evaluated for this revision.
    pub affected_object_ref: AffectedObservationObjectRef,

    /// Current degraded state.
    pub state: DegradedOutputKind,

    /// Typed reason for reduced output, when active.
    pub reason: Option<DegradedReason>,

    /// Typed reason requiring body absence, when blocked.
    pub block_reason: Option<DegradedBlockReason>,

    /// Gap that caused the degraded state, when applicable.
    pub gap_ref: Option<GapStateRef>,

    /// Exact visibility scope evaluated for this output.
    pub visibility_scope_ref: VisibilityScopeRef,

    /// Whether a consumer may receive a limited body-free surface.
    pub limited_consumption_allowed: bool,
}
```

| factory / member | result and invariant |
|---|---|
| `create_from_decision(degraded_ref: DegradedOutputRef, decision: &DegradedOutputDecision) -> Result<Self, DomainError>` | only public creation path for a durable revision; copies exact affected object + visibility scope and total Normal/Limited/Blocked conditional fields from a complete P13 decision; synchronous Query must not call it |
| `replace_from_decision(previous: &Self, replacement_ref: DegradedOutputRef, decision: &DegradedOutputDecision) -> Result<Option<(Self, DegradedOutputTransition)>, DomainError>` | only public replacement path; previous and decision must bind the same affected object + visibility scope, replacement identity must differ, and exact output replay returns `Ok(None)`; old revision remains immutable |
| `is_deliverable(&self) -> bool` | true only `None` or `Active` with limited flag; `Blocked` false |

`DegradedSurface` is a body-free contracts carrier, not an authorization supplied by a public caller. Both public factories consume the complete P13 decision, not caller-selected surface/safety/read state. The former `normal/from_policy_output/replace_from_policy` signatures are historical private-helper input only and cannot be implemented as public APIs. `ReadBlockReason` maps losslessly to `DegradedBlockReason`: visibility/safety/no-write/retention/inconsistent map to their matching variants, while unresolved required gap uses `RequiredGapUnresolved`; no fallback exists. Recovery from `Active/Blocked` to `None` is a new policy-evaluated revision. `DegradedOutputState` never replaces `GapState` and never manufactures a successful body.

### 9.14 `R06.4-C` read/diagnostic/gap module stop review

| module | review | result | correction / defer |
|---|---|---|---|
| read visibility | not-visible, blocked, restricted and body presence are lossless | pass | public wrapper uses `VisibilitySurface`; Query remains no-write |
| diagnostic | scope, request context and summary are distinct | pass | request context is one-shot; summary only stores typed refs/cursor |
| gap | gap truth and degraded output are separate | pass | suppression is reserved; empty sets do not hide gaps |
| support | all new scope/ref-set/reason/result carriers have owners | pass_for_known_C | R06.4-D will run zero-unowned scan |

### 9.15 `PeripheralDeliveryDecision`

```rust
/// Domain-only target-bound decision used to prepare one peripheral delivery.
pub struct PeripheralDeliveryDecision {
    /// Exact immutable P14 policy basis used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete delivery-side input observed by P14.
    input_snapshot: PeripheralDeliveryInputSnapshot,

    /// Delivery identity evaluated by the policy.
    pub delivery_ref: PeripheralDeliveryRef,

    /// Consumer boundary evaluated by the policy.
    pub consumer_ref: PeripheralConsumerRef,

    /// Public view to deliver, identified without carrying domain truth.
    pub view_ref: DashboardAlertExportViewRef,

    /// Visibility surface allowed for this delivery.
    pub visibility: VisibilitySurface,

    /// Gap references that must remain visible to the consumer.
    pub gap_refs: GapStateRefSet,

    /// Exact export preparation used as immutable input.
    pub preparation_ref: ExternalAuditExportPreparationRef,

    /// Whether the delivery attempt may be prepared.
    pub allowed: bool,

    /// Typed block reason when preparation is not allowed.
    pub block_reason: Option<PeripheralBlockReason>,
}
```

| contract item | rule |
|---|---|
| owner | `domain::peripheral` result; exact producer is R06.5 `PeripheralExportPolicy` |
| constructor | `pub(crate)` and P14-only; requires exact delivery/preparation/consumer/view/input/P10/P13 identity match and a lossless visibility surface |
| `allowed` matrix | `false` requires `block_reason Some` and visibility `Blocked` or `NotVisible`; `true` cannot carry `PeripheralBlockReason` |
| source / stale gate | complete `PeripheralDeliveryInputSnapshot`; any delivery/preparation/consumer/view/head/gap/retention/protection/P10/P13 change invalidates the decision |
| forbidden | entry handler, config string or adapter response may not construct this decision |

### 9.16 `ExportPreparationDecision`

```rust
/// Domain-only target-bound decision for external-audit export preparation.
pub struct ExportPreparationDecision {
    /// Exact immutable P14 policy basis used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete preparation-side input observed by P14.
    input_snapshot: ExportPreparationInputSnapshot,

    /// Preparation identity evaluated by the policy.
    pub preparation_ref: ExternalAuditExportPreparationRef,

    /// Consumer boundary used for the export.
    pub consumer_ref: PeripheralConsumerRef,

    /// Immutable body-free input used by the preparation.
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,

    /// Read surface allowed for this preparation, absent while required input is pending.
    pub visibility: Option<VisibilitySurface>,

    /// Readiness result for this preparation.
    pub readiness: HandoffReadinessState,

    /// Gaps that must remain attached to the export preparation.
    pub gap_refs: GapStateRefSet,

    /// Typed policy block reason for a blocked decision.
    pub block_reason: Option<ExportBlockReason>,
}
```

| contract item | rule |
|---|---|
| owner | `domain::peripheral` result; exact producer is R06.5 `PeripheralExportPolicy` / handoff readiness input |
| constructor | `pub(crate)` and P14-only; preparation, consumer, view, evidence input, gap, retention/protection and P10 must match the complete loaded snapshot |
| readiness | `Ready` requires visible/restricted body-free input and no hard gap；`Degraded` requires limited degraded surface + gap；`Blocked` requires `block_reason Some`；`PendingEvidence` permits visibility None and requires no block reason |
| stale gate | any preparation/consumer/view/input/freshness/gap/retention/protection/P10 change invalidates the decision; it cannot be converted to a delivery decision |
| forbidden | decision does not certify external audit, report correctness, evidence authenticity or acceptance |

### 9.17 `ReferenceRefreshResult`

```rust
/// Resolver result that maps one body-free refresh attempt to a local snapshot state.
pub enum ReferenceRefreshResult {
    /// A new safe summary and source version were accepted.
    Resolved {
        /// Safe summary produced by the trusted boundary mapper.
        summary_ref: SafeExternalSummaryRef,
        /// Producer version bound to the exact source stream.
        source_version: ObservationSourceVersionRef,
        /// Time at which the result was observed.
        observed_at: ObservedAt,
    },

    /// The snapshot is known but no longer fresh.
    Stale {
        /// Typed reason for staleness.
        reason: ReferenceStaleReason,
        /// Time at which staleness was observed.
        observed_at: ObservedAt,
    },

    /// The reference could not be resolved without fabricating a result.
    Unresolved {
        /// Typed resolution reason.
        reason: ReferenceResolutionReason,
        /// Time at which the outcome was observed.
        observed_at: ObservedAt,
    },

    /// The reference is invalid for this boundary.
    Invalid {
        /// Typed invalidity reason.
        reason: ReferenceInvalidReason,
        /// Time at which invalidity was observed.
        observed_at: ObservedAt,
    },

    /// The resolver or adapter is not available.
    Unavailable {
        /// Typed availability/resolution reason.
        reason: ReferenceResolutionReason,
        /// Time at which unavailability was observed.
        observed_at: ObservedAt,
    },
}
```

| contract item | rule |
|---|---|
| owner | `contracts::metadata` result; resolver adapter maps into this finite type |
| wire | tagged result; nested reason and summary fields use canonical types |
| source | resolver port outcome; no provider error string parsing |
| invariant | `Resolved` requires both safe summary and source version; `Invalid` never contains a usable summary; `Unavailable` never becomes `Resolved` without a later result |
| tests / stop | total state mapping, missing summary/version, invalid-vs-unresolved, stale reason; planned only |

### 9.18 `MaintenanceAuthorizationMode` and `MaintenanceExecutionAuthorization`

```rust
/// Exact mode under which one derived maintenance target is authorized.
pub enum MaintenanceAuthorizationMode {
    /// Normal scheduled maintenance limited to the target's allowed effect.
    Scheduled,

    /// Replay-derived maintenance bound to one approved replay scope.
    ApprovedReplay(ReplayScopeRef),
}

/// Target-bound authorization result consumed by maintenance state objects.
pub struct MaintenanceExecutionAuthorization {
    /// Validated maintenance target.
    pub target_ref: MaintenanceTargetRef,

    /// Exact effect authorized for the target.
    pub allowed_effect: MaintenanceAllowedEffect,

    /// Authorization mode and, for replay, the approved scope identity.
    pub mode: MaintenanceAuthorizationMode,

    /// No-write scope captured by the policy.
    pub no_write_guard_scope: NoWriteGuardScope,
}
```

| contract item | rule |
|---|---|
| owner | `domain::maintenance` result; exact producer R06.5 `DerivedMaintenancePolicy`；`domain::policies`不得复制definition |
| constructor | `pub(crate)` and P17-only; requires loaded target/scope/dependency snapshot, compatible effect and complete no-write guard |
| scheduled | may rebuild/refresh only the target's observation/derived surface; never source or external truth |
| replay | `ApprovedReplay` requires loaded `ReplayScopeState::Approved`, target membership and exact effect match |
| forbidden | `None`, temporary scope, default target or public entry construction cannot authorize maintenance |

### 9.19 `PeripheralDeliveryState`

```rust
/// Local delivery lifecycle for a product-neutral peripheral observation surface.
pub struct PeripheralDeliveryState {
    /// Stable delivery attempt identity.
    pub delivery_ref: PeripheralDeliveryRef,

    /// Export preparation used as the immutable delivery input.
    pub preparation_ref: ExternalAuditExportPreparationRef,

    /// Consumer boundary receiving the public view.
    pub consumer_ref: PeripheralConsumerRef,

    /// Public view identity delivered by this attempt.
    pub view_ref: DashboardAlertExportViewRef,

    /// Visibility surface accepted by policy, absent before preparation.
    pub visibility: Option<VisibilitySurface>,

    /// Current delivery lifecycle.
    pub state: PeripheralDeliveryKind,

    /// Adapter-independent delivery outcome, when one has been recorded.
    pub result: Option<PeripheralDeliveryResult>,

    /// Typed policy reason retained while the attempt is blocked.
    pub block_reason: Option<PeripheralBlockReason>,

    /// Typed adapter-independent reason retained while the attempt failed.
    pub failure_reason: Option<ExportFailureReason>,

    /// Gap refs preserved in the delivered or blocked surface.
    pub gap_refs: GapStateRefSet,

    /// Last local transition time.
    pub updated_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `pending(delivery_ref, preparation_ref, consumer_ref, view_ref, updated_at) -> Result<Self, DomainError>` | initial `Pending`; visibility/result/reasons are None because no policy outcome is accepted yet |
| `prepare(&mut self, input: &PeripheralDeliveryInputSnapshot, decision: &PeripheralDeliveryDecision, updated_at: ObservedAt) -> Result<PeripheralDeliveryTransition, DomainError>` | current public P14 allow path；先逐字段重建delivery/preparation/consumer/view/visibility/freshness/gap/retention/protection/P10/P13 complete binding，再解释`allowed=true`；`Pending/Blocked -> Prepared`，或prior result为`RetryableFailure`时`Failed -> Prepared`；原子替换visibility/gaps并清空旧result/block/failure；disallowed decision、stale input与permanent/rejected Failed均零mutation |
| `record_delivery(&mut self, result: PeripheralDeliveryResult, failure_reason: Option<ExportFailureReason>, updated_at: ObservedAt) -> Result<PeripheralDeliveryTransition, DomainError>` | `Prepared -> Delivered/Failed`; `Delivered` requires no failure reason; every non-delivered result requires one; `RetryableFailure` requires a retryable reason, while `PermanentFailure/Rejected` require a non-retryable reason |
| `block(&mut self, input: &PeripheralDeliveryInputSnapshot, decision: &PeripheralDeliveryDecision, updated_at: ObservedAt) -> Result<Option<PeripheralDeliveryTransition>, DomainError>` | current public P14 block path；complete binding先于outcome；`Pending/Prepared/Blocked -> Blocked`，或retryable `Failed -> Blocked`；只接受same-target `allowed=false`，原子替换visibility/gaps/block reason并清空adapter result/failure；exact decision/input replay为`Ok(None)`，allowed decision、stale snapshot与terminal failure均零mutation |
| `cancel(&mut self, reason: MaintenanceCancelReason) -> Result<PeripheralDeliveryTransition, DomainError>` | current phase reserved; always returns `DomainError::ReservedTransition` and emits no `Cancelled` delta |

Delivered, `PermanentFailure` and `Rejected` are terminal for the local delivery attempt. A `RetryableFailure` or policy `Blocked` row may be re-prepared under the same identity only after a new target-bound decision is evaluated against the current immutable preparation/consumer/view snapshot; an old decision cannot reopen it. The object never contains endpoint, credential, provider receipt, product locator or raw body.

旧`prepare(decision, ...)`与`block(decision, ...)`签名只可作为`domain::peripheral` module-private mutation helper；application、entry、infra与adapter不得绕过complete P14 input。policy-driven transition复制P14 `PolicyEvaluationBasis`作为G批H9的accepted basis；adapter-result transition不伪造policy basis。

### 9.20 `ExternalAuditExportPreparation`

```rust
/// Body-free preparation state for external-audit or GRC export consumption.
pub struct ExternalAuditExportPreparation {
    /// Stable preparation identity.
    pub preparation_ref: ExternalAuditExportPreparationRef,

    /// Consumer boundary for this preparation.
    pub consumer_ref: PeripheralConsumerRef,

    /// Immutable evidence index input used for preparation.
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,

    /// Public export view being prepared.
    pub view_ref: DashboardAlertExportViewRef,

    /// Visibility result for this consumer, absent before policy evaluation.
    pub visibility: Option<VisibilitySurface>,

    /// Current preparation lifecycle.
    pub state: ExportPreparationState,

    /// Gaps that must remain visible in the export surface.
    pub gap_refs: GapStateRefSet,

    /// Readiness result attached by policy.
    pub readiness: HandoffReadinessState,

    /// Typed failure reason, when preparation failed.
    pub failure_reason: Option<ExportFailureReason>,

    /// Typed policy reason, when preparation is blocked.
    pub block_reason: Option<ExportBlockReason>,

    /// Adapter-independent delivery result, when delivery was attempted.
    pub delivery_result: Option<PeripheralDeliveryResult>,

    /// Last local preparation time.
    pub updated_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `draft(preparation_ref, consumer_ref, evidence_index_input_ref, view_ref, updated_at) -> Result<Self, DomainError>` | initial `Draft/PendingEvidence`; immutable input refs must be loaded and body-free;visibility/result/reasons are None |
| `apply_decision(&mut self, input: &ExportPreparationInputSnapshot, decision: &ExportPreparationDecision, updated_at: ObservedAt) -> Result<Option<ExportPreparationTransition>, DomainError>` | current public P14 path；先重建preparation/consumer/view/evidence boundary/freshness/gap/retention/protection/P10 complete binding；`Draft/Blocked`或retryable `Failed`可接受decision并原子替换readiness/visibility/gaps：`PendingEvidence`进入/保持`Draft`且清空旧delivery/failure/block，`Ready/Degraded -> Prepared`且清空旧result/reason，`Blocked -> Blocked`且只保存new block；exact decision/input replay为`Ok(None)`；stale input、Delivered、permanent/rejected failure均零mutation |
| `attach_gap(&mut self, gap: &GapState, updated_at: ObservedAt) -> Result<Option<ExportPreparationTransition>, DomainError>` | only `Draft/PendingEvidence`; loaded gap must belong to the preparation input/view dependency set; adds one explicit gap and advances local time while remaining pending, duplicate returns `Ok(None)` without changing time; other readiness/lifecycle combinations must consume a newly evaluated decision |
| `record_delivery(&mut self, result: PeripheralDeliveryResult, failure_reason: Option<ExportFailureReason>, updated_at: ObservedAt) -> Result<ExportPreparationTransition, DomainError>` | only `Prepared`; `Delivered` requires no failure reason; every non-delivered result requires one and enters `Failed`; `RetryableFailure` requires a retryable reason, while `PermanentFailure/Rejected` require a non-retryable reason; local result is not external acceptance |
| `fail_retryable(&mut self, reason: ExportFailureReason, updated_at: ObservedAt) -> Result<ExportPreparationTransition, DomainError>` | `Draft/Prepared -> Failed` only for a preparation-originated reason whose `can_retry()` is true; delivery result remains None, failure reason is required, and retry requires a new target-bound application decision; non-retryable reason returns typed error and zero mutation |
| `cancel(&mut self, reason: MaintenanceCancelReason) -> Result<ExportPreparationTransition, DomainError>` | no `Cancelled` variant exists; current phase always rejects with `DomainError::ReservedTransition` and emits no delta |

旧`apply_decision(decision, ...)`只可作为module-private helper。accepted P14 transition复制decision的`PolicyEvaluationBasis`；`attach_gap`、adapter delivery result与retryable local failure不是policy decision，不得伪造该basis。任何adapter调用只能发生在Prepared mutation提交之后的application external-effect cut。

### 9.21 `ReferenceSnapshotState`

```rust
/// Local body-free freshness and resolution state for one external reference subject.
pub struct ReferenceSnapshotState {
    /// Stable snapshot-state identity.
    pub snapshot_ref: ReferenceSnapshotStateRef,

    /// Subject whose safe reference is being tracked.
    pub subject_ref: ReferenceSubjectRef,

    /// Current local resolution/freshness state.
    pub state: ReferenceSnapshotStateKind,

    /// Safe summary accepted by the resolver, when available.
    pub safe_summary_ref: Option<SafeExternalSummaryRef>,

    /// Source version accepted with the safe summary, when available.
    pub source_version: Option<ObservationSourceVersionRef>,

    /// Typed stale reason, when state is stale.
    pub stale_reason: Option<ReferenceStaleReason>,

    /// Typed resolution reason, when state is unresolved or unavailable.
    pub resolution_reason: Option<ReferenceResolutionReason>,

    /// Typed invalid reason, when state is invalid.
    pub invalid_reason: Option<ReferenceInvalidReason>,

    /// Time when the current state was observed.
    pub observed_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `pending(snapshot_ref, subject_ref, observed_at) -> Result<Self, DomainError>` | state `Pending`; all outcome fields None |
| `apply_freshness_decision(&mut self, target: &MaintenanceTargetPolicySnapshot, maintenance: &DerivedMaintenanceDecision, decision: &ReferenceFreshnessDecision) -> Result<Option<ReferenceSnapshotTransition>, DomainError>` | only public in-place refresh path；先complete-bind P17 Authorized target/scope/dependency/mode/P10，再绑定current snapshot全部conditional fields、refresh result、adapter family/version relation与P15 decision；两个decision必须same exact target/P10；ApplyResolved/Stale/Unresolved/Invalid/Unavailable形成transition，PreserveCurrent为`Ok(None)`，Blocked/RequireNewSnapshot/Reject零mutation |
| `create_from_required_new_snapshot(snapshot_ref: ReferenceSnapshotStateRef, previous: &ReferenceSnapshotState, target: &MaintenanceTargetPolicySnapshot, maintenance: &DerivedMaintenanceDecision, decision: &ReferenceFreshnessDecision) -> Result<Self, DomainError>` | only public Invalid recovery path；P17必须Authorized且与P15 same target/P10；只接受RequireNewSnapshot、different identity、same subject与same complete result；旧Invalid revision保持不变，新identity建立完整finite state；不能伪造old-row transition |
| private `apply_refresh(result)` / `mark_stale(...)` / `mark_unresolved(...)` / `mark_invalid(...)` | 仅由`apply_freshness_decision`在complete binding后调用；observed time不得回退，Resolved要求summary+version，Invalid清空usable pair；application/entry/resolver不得直接调用 |

The snapshot is local observation truth about resolver availability and safe summary freshness only. It is not an external object lifecycle and never stores provider response or source body. In-place accepted transition分别复制P17 maintenance与P15 freshness `PolicyEvaluationBasis`；new-identity creation由G批H10的typed new-snapshot accepted input承接并同样保存两个basis，不能伪造`Invalid -> Resolved` transition。P16成功不是proof/marker，P15仍重复校验safe-output结构。

### 9.22 `ProjectionMaintenanceState`

```rust
/// Derived projection maintenance state for a typed observation-side target.
pub struct ProjectionMaintenanceState {
    /// Stable maintenance identity.
    pub maintenance_ref: ProjectionMaintenanceRef,

    /// Structured target guarded by no-write policy.
    pub target_ref: MaintenanceTargetRef,

    /// Current projection maintenance lifecycle.
    pub state: ProjectionMaintenanceStateKind,

    /// Whether the immutable target binding requires observation-namespace coverage.
    pub requires_observation_cursor: bool,

    /// Whether the immutable target binding requires reference-namespace coverage.
    pub requires_reference_cursor: bool,

    /// Observation-namespace upper position captured for this target, when required.
    pub observation_cursor: Option<ObservationCursor>,

    /// Reference-namespace upper position captured for this target, when required.
    pub reference_cursor: Option<ReferenceCursor>,

    /// Progress view identity, when exposed.
    pub progress_ref: Option<RebuildProgressViewRef>,

    /// Typed failure reason, when the attempt failed.
    pub failure_reason: Option<MaintenanceFailureReason>,

    /// Last local state transition time.
    pub updated_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `for_missing_projection(maintenance_ref, target: &MaintenanceTargetPolicySnapshot, updated_at) -> Result<Self, DomainError>` | 从complete canonical target/scope/dependency snapshot复制target，并由typed `MaintenanceDependencyNamespaceSet`无损派生两个immutable requirement flags；set必须non-empty且与target kind/effect一致；initial `Stale`、两个namespace position均None；caller不得提交两个bool |
| `mark_stale(&mut self, observation_cursor: Option<ObservationCursor>, reference_cursor: Option<ReferenceCursor>, updated_at: ObservedAt) -> Result<ProjectionMaintenanceTransition, DomainError>` | `Fresh/Failed -> Stale`; each provided cursor is an observed namespace upper bound, not a start offset; target dependency declaration decides which None values are legal |
| `start_from_decision(&mut self, target: &MaintenanceTargetPolicySnapshot, decision: &DerivedMaintenanceDecision, captured_observation_cursor: Option<ObservationCursor>, captured_reference_cursor: Option<ReferenceCursor>, progress_ref: RebuildProgressViewRef, updated_at: ObservedAt) -> Result<ProjectionMaintenanceTransition, DomainError>` | only public P17 start path；重建current target/scope/dependency/requirement binding并调用decision complete `applies_to`；只接受Authorized，`Stale -> Rebuilding`，namespace positions必须精确覆盖required set，原子替换双cursor、绑定progress、清空failure；Blocked/stale decision零mutation |
| `complete(&mut self, completed_observation_cursor: Option<ObservationCursor>, completed_reference_cursor: Option<ReferenceCursor>, updated_at: ObservedAt) -> Result<ProjectionMaintenanceTransition, DomainError>` | `Rebuilding -> Fresh` only when all target members are replaced through both captured namespace positions; each required cursor is present and non-regressing, each non-required cursor remains None, then both positions are replaced while preserving same-target progress identity |
| `fail(&mut self, reason: MaintenanceFailureReason, updated_at: ObservedAt) -> Result<ProjectionMaintenanceTransition, DomainError>` | `Rebuilding -> Failed`; preserves captured cursor/progress, stores failure, and affected views remain stale/degraded |

The two requirement flags are immutable for the maintenance identity. They are copied from a versioned `MaintenanceTargetScopeBinding` at first creation; a later binding mismatch requires a new maintenance identity and cannot mutate the flags in place. `mark_stale` atomically replaces both observed namespace positions and clears old progress/failure; it cannot retain a failed reason in `Stale`. `Fresh` means the derived projection reached every required captured namespace position for this target; it never means source truth was repaired. Observation and reference cursors are compared only within their own namespaces; neither may substitute for the other or be collapsed into one tagged cursor. Step 07 `ProjectionReadFence` remains the transaction-local consistent-read proof and is not persisted in this aggregate.

旧`start(MaintenanceExecutionAuthorization, ...)`降为`domain::maintenance` private helper；裸authorization不含complete target-scope/dependency/policy basis，不能作为application/public入口或跨UoW token。start transition复制enclosing P17 decision basis，而不是从authorization猜basis。

### 9.23 `ReplayCoordinationState`

```rust
/// One execution's coordination state for an already approved observation-side replay scope.
pub struct ReplayCoordinationState {
    /// Stable coordination identity.
    pub coordination_ref: ReplayCoordinationRef,

    /// Approved replay scope being coordinated.
    pub scope_ref: ReplayScopeRef,

    /// Exact maintenance target coordinated inside the approved scope.
    pub target_ref: MaintenanceTargetRef,

    /// Current coordination lifecycle.
    pub state: ReplayCoordinationKind,

    /// No-write boundary required for this execution.
    pub no_write_guard_scope: NoWriteGuardScope,

    /// No-write violation that blocked this execution, when applicable.
    pub no_write_violation_ref: Option<NoWriteViolationRef>,

    /// Typed replay boundary reason, when coordination is blocked.
    pub block_reason: Option<ReplayBlockReason>,

    /// Typed failure reason, when coordination failed.
    pub failure_reason: Option<MaintenanceFailureReason>,

    /// Last local transition time.
    pub updated_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `pending(coordination_ref, approved_scope: &ReplayScope, target_ref: MaintenanceTargetRef, updated_at) -> Result<Self, DomainError>` | exact scope must already be `Approved`; target identity/kind/object/effect/guard must map to one member of that scope and be eligible for this execution; copied guard is the exact scope/target guard and no execution side effect occurs |
| `apply_policy_decision(&mut self, input: &ReplayCoordinationInputSnapshot, decision: &ReplayCoordinationDecision, updated_at: ObservedAt) -> Result<ReplayCoordinationTransition, DomainError>` | only public P18 entry；重建Pending coordination + Approved scope + one exact target/current retention/protection + P17/P10 complete binding；Start调用private same-target start并只做`Pending -> Coordinating`，Blocked调用private block且固定`violation_ref=None`；两者均不执行target effect、不创建job/claim/progress/changed refs |
| private `start(authorization, ...)` / `block(reason, violation_ref, ...)` | 只由`apply_policy_decision`在complete binding后调用；P18不得制造`NoWriteViolationRef`；未来独立violation flow若要附加typed ref必须另有accepted member设计 |
| `complete(&mut self, approved_scope: &ReplayScope, changed_refs: AffectedObservationObjectRefSet, updated_at: ObservedAt) -> Result<ReplayCoordinationTransition, DomainError>` | `Coordinating -> Completed`; loaded scope must match and remain Approved; set is either empty for explicit no-change or one member whose inner object ref exactly equals the stored target object and remains a scope member; another target, supporting progress object or multi-member set is rejected; completion never proves source repair |
| `fail(&mut self, reason: MaintenanceFailureReason, updated_at: ObservedAt) -> Result<ReplayCoordinationTransition, DomainError>` | `Coordinating -> Failed`; stores only failure, clears violation/block fields, and requires a new execution identity for retry |

`ReplayCoordinationState` is one target execution inside an approved scope, matching the frozen `CoordinateObservationReplay` input shape `replay_scope_ref + target_ref`. Scope-wide iteration belongs to the R06.6 immutable job plan and creates one coordination identity per target. Supporting maintenance/progress transitions are recorded by their own owners; neither this object nor its record may infer an omitted target, silently coordinate every scope member or fold support objects into `changed_refs`.

P18 Start/Blocked transition复制P18 decision basis；Start所用P17 authorization字段仍只用于target/effect/mode/guard audit，不可替代P17 complete decision。`complete`和`fail`属于实际maintenance后续路径，不携带P18 basis，也不得把record/job result反向解释为policy authorization。

### 9.24 `RollupRebuildState`

```rust
/// One derived signal-rollup rebuild attempt.
pub struct RollupRebuildState {
    /// Stable rebuild attempt identity.
    pub rebuild_ref: RollupRebuildRef,

    /// Rollup window being rebuilt.
    pub window_ref: SignalRollupWindowRef,

    /// Structured maintenance target for the window.
    pub target_ref: MaintenanceTargetRef,

    /// Current rebuild lifecycle.
    pub state: RollupRebuildKind,

    /// Captured source cursor used by this rebuild.
    pub source_cursor: Option<ObservationCursor>,

    /// Number of committed safe signals folded by the attempt.
    pub rebuilt_count: Option<SignalCount>,

    /// Progress view identity, when exposed.
    pub progress_ref: Option<RebuildProgressViewRef>,

    /// Typed failure reason, when failed.
    pub failure_reason: Option<MaintenanceFailureReason>,

    /// Last local transition time.
    pub updated_at: ObservedAt,
}
```

| factory / member | result and invariant |
|---|---|
| `for_window(rebuild_ref, window_ref, target_ref, source_cursor, updated_at) -> Result<Self, DomainError>` | initial `Pending`; target kind/effect must be `SignalRollup/RebuildSignalRollup` |
| `start_from_decision(&mut self, target: &MaintenanceTargetPolicySnapshot, decision: &DerivedMaintenanceDecision, progress_ref: RebuildProgressViewRef, updated_at: ObservedAt) -> Result<RollupRebuildTransition, DomainError>` | only public P17 start path；complete-bindtarget/scope/dependency/mode/P10并只接受Authorized；`Pending -> Running`，authorization target/window/effect/guard必须exact，保留captured cursor、绑定progress、清空count/failure；Blocked/stale decision零mutation |
| `complete(&mut self, rebuilt_count: SignalCount, source_cursor: ObservationCursor, updated_at: ObservedAt) -> Result<RollupRebuildTransition, DomainError>` | `Running -> Completed`; cursor cannot precede the captured cursor, count/cursor are committed saved-signal result, progress remains same-target, and failure is clear |
| `fail(&mut self, reason: MaintenanceFailureReason, updated_at: ObservedAt) -> Result<RollupRebuildTransition, DomainError>` | `Running -> Failed`; preserves captured cursor/progress, clears rebuilt count, stores failure, and original window remains auditable |
| `cancel(&mut self, reason: MaintenanceCancelReason, updated_at: ObservedAt) -> Result<RollupRebuildTransition, DomainError>` | current phase reserved; always returns `DomainError::ReservedTransition` and emits no `Cancelled` delta |

旧`start(MaintenanceExecutionAuthorization, ...)`是module-private helper。accepted start transition从完整P17 decision复制policy basis；裸authorization不能由application、job runner、entry或record replay直接消费。

### 9.25 `R06.4-C` peripheral/reference/maintenance module stop review

| module | review | result | correction / defer |
|---|---|---|---|
| peripheral | delivery/preparation/result/visibility are distinct | pass | delivery does not imply external acceptance; decision producer remains R06.5 |
| reference | state outcome has summary/version/reason closure | pass | `Resolved` requires safe summary + source version; invalid is terminal |
| maintenance | immutable target descriptor、四组一一对应effect、authorization与observation/reference dual watermarks均显式 | pass | target不保存state/maintenance ref/block reason；只允许projection rebuild、body-free reference refresh、gap scan、signal rollup rebuild |
| replay coordination | approved scope + one exact target是前置条件 | pass | 每个coordination identity只绑定一个target；scope-wide replay由R06.6 immutable job plan逐target展开，changed set只能empty或exact target singleton |
| cross-module | no new policy/record schema leakage | pass_for_C | D batch will complete owner scan |

## 10. R06.4-D support cards and handoff objects

### 10.1 `ReportHandoffRecord`

#### `HandoffReadinessDecision`

```rust
/// Domain-only target-bound readiness decision for one immutable handoff input.
pub struct HandoffReadinessDecision {
    /// Exact immutable P7 policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,

    /// Complete handoff/input/hint/gap/retention/no-write pre-state.
    input_snapshot: HandoffReadinessInputSnapshot,

    /// Finite readiness outcome.
    readiness: HandoffReadinessState,

    /// Visibility surface used by this exact decision, absent while evidence is pending.
    visibility: Option<VisibilitySurface>,

    /// Current Open/Acknowledged gaps that remain effective in this decision.
    gap_refs: GapStateRefSet,

    /// Retention marker evaluated by the policy, when required.
    retention_marker_ref: Option<RetentionMarkerRef>,

    /// No-write boundary captured by the policy.
    no_write_guard_scope: NoWriteGuardScope,

    /// Typed hard-block reason, when readiness is blocked.
    block_reason: Option<HandoffBlockReason>,
}
```

| contract item | rule |
|---|---|
| owner / producer | `domain::handoff`; private constructor owned by R06.5 `HandoffReadinessPolicy` |
| target binding | complete snapshot binds loaded handoff、repository-proven committed input、current catalog consumer、current attached hint、all input gaps、optional marker/protection and exact P10 decision；another handoff/input/consumer revision/scope cannot reuse it |
| readiness matrix | `Ready` requires RealEvidenceLinked + Fresh + visible/allowed restricted + no open gap + ActiveHold/Protected current report consumer + P10 Allowed；Placeholder/Insufficient never Ready；Pending/Blocked/Degraded follow P7 total matrix |
| gap layers | `input_snapshot.gaps`保存input引用的一一对应complete revisions，包括Resolved/Suppressed；flattened `gap_refs`只保存本次`Open/Acknowledged` effective subset；Ready必须empty，历史resolved ref不重新成为阻断 |
| no-write | snapshot contains exact HandoffOrExport/Handoff/local-effect P10 decision；flattened guard scope is output inspection only and cannot replace decision binding |
| factory / members | `pub(crate) fn new(...)` only P7；`applies_to(...)` rebuilds all complete snapshots；read-only basis/input/outcome accessors；H4使用`pub(crate) fn proves_accepted_transition(&self, transition: &ReportHandoffTransition, post_handoff: &ReportHandoffRecord) -> bool`比较stored pre-snapshot、outcome、transition与post-state，不重新evaluate P7 |
| forbidden | no public constructor, free-text reason, report body, signoff, verdict, run id or evidence alias |
| tests / stop | preview-vs-committed、hint/gap/retention/P10 stale replay、Placeholder/Insufficient no Ready、Ready full necessary conditions、blocked prepare；planned only |

```rust
/// Observation-owned handoff lifecycle for an immutable body-free input snapshot.
pub struct ReportHandoffRecord {
    /// Stable handoff record identity.
    pub handoff_ref: ReportHandoffRecordRef,

    /// Observation-side scope prepared by this handoff.
    pub handoff_scope_ref: ReportHandoffScopeRef,

    /// Structured consumer boundary receiving the input.
    pub consumer_ref: ReportConsumerRef,

    /// Current handoff lifecycle.
    pub state: ReportHandoffState,

    /// Current policy readiness co-state.
    pub readiness: HandoffReadinessState,

    /// Immutable body-free evidence input snapshot.
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,

    /// Authenticity hint attached to this handoff, when evaluated.
    pub authenticity_hint_ref: Option<AuthenticityHintRef>,

    /// Current Open/Acknowledged gaps that must remain visible to the consumer.
    pub gap_refs: GapStateRefSet,

    /// Visibility result used for this handoff surface after evaluation.
    pub visibility: Option<VisibilitySurface>,

    /// Retention marker that must remain compatible with delivery.
    pub retention_marker_ref: Option<RetentionMarkerRef>,

    /// No-write scope captured for the handoff operation after evaluation.
    pub no_write_guard_scope: Option<NoWriteGuardScope>,

    /// Adapter-independent delivery result retained after a delivery attempt.
    pub delivery_result: Option<HandoffDeliveryResult>,

    /// Typed policy reason retained when preparation is blocked.
    pub block_reason: Option<HandoffBlockReason>,

    /// Last local lifecycle update time.
    pub updated_at: ObservedAt,
}
```

| field | type | source | invariant |
|---|---|---|---|
| `handoff_ref` | `ReportHandoffRecordRef` | application id generator | stable across lifecycle changes |
| `handoff_scope_ref` | `ReportHandoffScopeRef` | typed command input | body-free and consumer-compatible |
| `consumer_ref` | `ReportConsumerRef` | validated catalog/repository | consumer must be non-retired for preparation |
| `state` | `ReportHandoffState` | factory/member | `Delivered` and `Cancelled` are terminal |
| `readiness` | `HandoffReadinessState` | target-bound `HandoffReadinessDecision` | `Ready` does not itself change lifecycle to Prepared |
| `evidence_index_input_ref` | `EvidenceIndexInputViewRef` | accepted immutable snapshot UoW | snapshot is append-once and body-free |
| `authenticity_hint_ref` | `Option<AuthenticityHintRef>` | same-UoW policy/lookup | placeholder or insufficient hint remains visible |
| `gap_refs` | `GapStateRefSet` | target-bound readiness decision的effective subset | 只含current `Open/Acknowledged` refs；Resolved/Suppressed revisions保留在decision complete snapshot而不进入aggregate current set；empty不证明外部完整 |
| `visibility` | `Option<VisibilitySurface>` | target-bound readiness decision | None only while `Draft/PendingEvidence`; NotVisible/Blocked cannot be delivered as body |
| `retention_marker_ref` | `Option<RetentionMarkerRef>` | target-bound readiness decision | active hold blocks release/delivery where policy requires |
| `no_write_guard_scope` | `Option<NoWriteGuardScope>` | target-bound readiness decision | None only before first evaluation; accepted value never permits source/external write |
| `delivery_result` | `Option<HandoffDeliveryResult>` | body-free delivery adapter outcome | Some only for `Delivered` or delivery-originated `Failed`;Delivered variant required in Delivered state |
| `block_reason` | `Option<HandoffBlockReason>` | readiness policy / explicit block member | Some whenever readiness is `Blocked`;delivery-originated Failed keeps it None |
| `updated_at` | `ObservedAt` | same accepted UoW clock | not an external delivery timestamp |

| factory / member | result and invariant |
|---|---|
| `draft(handoff_ref, handoff_scope_ref, consumer_ref, evidence_index_input_ref, updated_at) -> Result<Self, DomainError>` | state `Draft`, readiness `PendingEvidence`, empty gaps, all optional policy/delivery/reason fields None; factory cannot declare Ready or fabricate a policy basis |
| `apply_readiness(&mut self, input: &CommittedEvidenceIndexInputSnapshot, current_consumer: &ReportConsumerRef, hint: Option<&AuthenticityHint>, gaps: &[GapState], marker: Option<&RetentionMarker>, protection: Option<&ActiveReferenceProtection>, no_write: &NoWriteGuardDecision, decision: &HandoffReadinessDecision, updated_at: ObservedAt) -> Result<Option<ReportHandoffTransition>, DomainError>` | rebuilds complete P7 input before mutation；current consumer stable fields must match saved consumer and current state is authoritative；Draft accepts total matrix；Prepared accepts changed Ready/Degraded snapshot；retryable/policy-blocked Failed accepts only Blocked reevaluation；exact replay None |
| `prepare(&mut self, input: &CommittedEvidenceIndexInputSnapshot, current_consumer: &ReportConsumerRef, hint: Option<&AuthenticityHint>, gaps: &[GapState], marker: Option<&RetentionMarker>, protection: Option<&ActiveReferenceProtection>, no_write: &NoWriteGuardDecision, decision: &HandoffReadinessDecision, updated_at: ObservedAt) -> Result<ReportHandoffTransition, DomainError>` | complete binding first；current consumer must still beActive；Draft/eligible Failed -> Prepared only for Ready or explicitly allowed Degraded；atomically replaces policy snapshot and clears retryable delivery/block fields；no verdict |
| `attach_authenticity_hint(&mut self, hint: &AuthenticityHint, updated_at: ObservedAt) -> Result<Option<ReportHandoffTransition>, DomainError>` | loaded hint must belong to the same handoff; attaches its ref with state unchanged; exact duplicate returns `Ok(None)` |
| `deliver(&mut self, result: HandoffDeliveryResult, updated_at: ObservedAt) -> Result<ReportHandoffTransition, DomainError>` | `Prepared -> Delivered/Failed`; stores finite result,clears policy block reason;delivered is local delivery fact only |
| `block(&mut self, input: &CommittedEvidenceIndexInputSnapshot, current_consumer: &ReportConsumerRef, hint: Option<&AuthenticityHint>, gaps: &[GapState], marker: Option<&RetentionMarker>, protection: Option<&ActiveReferenceProtection>, no_write: &NoWriteGuardDecision, decision: &HandoffReadinessDecision, updated_at: ObservedAt) -> Result<ReportHandoffTransition, DomainError>` | Draft/Prepared -> Failed only after complete binding of a fresh Blocked decision including current consumer；atomically replaces policy fields；no delivery adapter call follows |
| `cancel(&mut self, ...)` | reserved; current boundary returns `DomainError::ReservedTransition` |

The object never stores report body, destination locator, credentials, final verdict, signoff, real run id or evidence alias. R06.5 creates lifecycle records from the transition delta.

### 10.2 `AuthenticityHint`

```rust
/// Non-fabricating hint about the origin quality of a body-free handoff input.
pub struct AuthenticityHint {
    /// Stable authenticity-hint identity.
    pub hint_ref: AuthenticityHintRef,

    /// Handoff record to which the hint belongs.
    pub handoff_ref: ReportHandoffRecordRef,

    /// Current hint lifecycle.
    pub state: AuthenticityHintState,

    /// Origin classification, when one is established.
    pub evidence_origin: Option<EvidenceOriginKind>,

    /// Placeholder reason, when the input is classified as a placeholder.
    pub placeholder_reason: Option<PlaceholderReason>,

    /// Gaps explaining insufficient basis.
    pub gap_refs: GapStateRefSet,

    /// Explicit typed basis retained when the assessment is insufficient.
    pub insufficient_reason: Option<AuthenticityGapReason>,

    /// Time of the current local assessment.
    pub evaluated_at: ObservedAt,
}
```

| field | type | source | invariant |
|---|---|---|---|
| `hint_ref` | `AuthenticityHintRef` | application id generator | identity never proves authenticity |
| `handoff_ref` | `ReportHandoffRecordRef` | loaded handoff | exact relation; cannot be changed |
| `state` | `AuthenticityHintState` | policy/member | `RealEvidenceLinked` and `PlaceholderDetected` are terminal for this hint |
| `evidence_origin` | `Option<EvidenceOriginKind>` | typed policy result | no URI/provider/body/run id |
| `placeholder_reason` | `Option<PlaceholderReason>` | typed classifier | Some only for `PlaceholderDetected` |
| `gap_refs` | `GapStateRefSet` | evidence/gap snapshot | `Insufficient` requires non-empty gaps or explicit insufficient basis |
| `insufficient_reason` | `Option<AuthenticityGapReason>` | typed policy result | Some only for `Insufficient`;`OpenObservationGap` requires non-empty gaps |
| `evaluated_at` | `ObservedAt` | accepted UoW clock | local assessment time, not evidence time |

| factory / member | result and invariant |
|---|---|
| `assess(hint_ref, handoff_ref, evaluated_at) -> Result<Self, DomainError>` | initial `Unassessed`; origin/reasons absent and gap set empty |
| `apply_decision(&mut self, handoff: &ReportHandoffRecord, input: &EvidenceIndexInputView, loaded_linkages: &[EvidenceLinkage], assessments: Option<&EvidenceOriginAssessmentSet>, loaded_gaps: &[GapState], decision: &AuthenticityHintDecision, evaluated_at: ObservedAt) -> Result<Option<AuthenticityHintTransition>, DomainError>` | validates complete hint/handoff/input/linkage/origin/gap snapshots and policy basis before mutation；Unassessed may enter all three outcomes；Insufficient may enter Real/Placeholder or a changed Insufficient snapshot；exact replay returns `Ok(None)` without changing time |
| `reevaluate(&mut self, ...)` | terminal states cannot be rewritten; new hint identity required |

`confirm_real_evidence`、`mark_placeholder`与`mark_insufficient`保留为`domain::handoff` module-private helpers，只能由`apply_decision`在P6 decision完成全量binding后调用。application、entry、config、infra和public DTO不能提交origin/reason后直接调用；decision按借用消费，使same-UoW H4 record factory仍可读取policy basis和完整assessment set。

### 10.3 `ReportHandoffTransition`

```rust
/// Domain-local lifecycle delta emitted by a report handoff mutation.
pub struct ReportHandoffTransition {
    /// Handoff identity changed by this delta.
    pub handoff_ref: ReportHandoffRecordRef,

    /// Lifecycle state before the mutation.
    pub from_state: ReportHandoffState,

    /// Lifecycle state after the mutation.
    pub to_state: ReportHandoffState,

    /// Readiness before the mutation or reevaluation.
    pub from_readiness: HandoffReadinessState,

    /// Readiness after the mutation or reevaluation.
    pub to_readiness: HandoffReadinessState,

    /// Delivery result before the mutation, when any.
    pub previous_delivery_result: Option<HandoffDeliveryResult>,

    /// Authenticity hint before the mutation, when any.
    pub previous_authenticity_hint_ref: Option<AuthenticityHintRef>,

    /// Gaps before the mutation.
    pub previous_gap_refs: GapStateRefSet,

    /// Visibility before the mutation, when any.
    pub previous_visibility: Option<VisibilitySurface>,

    /// Retention marker before the mutation, when any.
    pub previous_retention_marker_ref: Option<RetentionMarkerRef>,

    /// No-write scope before the mutation, when any.
    pub previous_no_write_guard_scope: Option<NoWriteGuardScope>,

    /// Policy block reason before the mutation, when any.
    pub previous_block_reason: Option<HandoffBlockReason>,

    /// Local update time before the mutation.
    pub previous_updated_at: ObservedAt,

    /// Local update time after the mutation.
    pub current_updated_at: ObservedAt,
}
```

The post-mutation `ReportHandoffRecord` supplies the complete current delivery/hint/gap/visibility/retention/no-write/block snapshot. The delta stores every overwritten previous value and the before/after lifecycle/readiness/time. `Failed -> Prepared` is therefore auditable as clearing a retryable result or policy block while replacing the policy snapshot. A hint attachment changes only the current hint and time; policy reevaluation changes the relevant snapshot; exact duplicates return `Ok(None)`. Permanent/rejected failure has no outgoing delta. The delta has no actor, record identity or outbox identity.

### 10.4 `AuthenticityHintTransition`

```rust
/// Domain-local lifecycle delta emitted by an authenticity-hint mutation.
pub struct AuthenticityHintTransition {
    /// Hint identity changed by this delta.
    pub hint_ref: AuthenticityHintRef,

    /// Immutable handoff identity owning the changed hint.
    pub handoff_ref: ReportHandoffRecordRef,

    /// State before the mutation.
    pub from_state: AuthenticityHintState,

    /// State after the mutation.
    pub to_state: AuthenticityHintState,

    /// Origin classification before the mutation.
    pub previous_evidence_origin: Option<EvidenceOriginKind>,

    /// Origin classification after the mutation.
    pub current_evidence_origin: Option<EvidenceOriginKind>,

    /// Placeholder reason before the mutation.
    pub previous_placeholder_reason: Option<PlaceholderReason>,

    /// Placeholder reason after the mutation.
    pub current_placeholder_reason: Option<PlaceholderReason>,

    /// Gap refs before the mutation.
    pub previous_gap_refs: GapStateRefSet,

    /// Gap refs after the mutation.
    pub current_gap_refs: GapStateRefSet,

    /// Insufficient basis before the mutation, when any.
    pub previous_insufficient_reason: Option<AuthenticityGapReason>,

    /// Insufficient basis after the mutation, when any.
    pub current_insufficient_reason: Option<AuthenticityGapReason>,

    /// Evaluation time before the mutation.
    pub previous_evaluated_at: ObservedAt,

    /// Evaluation time after the mutation.
    pub current_evaluated_at: ObservedAt,
}
```

Every changed transition preserves exact `hint_ref/handoff_ref`, advances time, and records fields cleared when `Insufficient -> RealEvidenceLinked/PlaceholderDetected` or replaced when `Insufficient -> Insufficient` changes reason/gaps. An exact same snapshot replay returns `Ok(None)` and does not advance time. The post-mutation hint supplies the complete current shape. Terminal states have no outgoing transition. H4 factory rejects a transition whose `handoff_ref` differs from the same-UoW hint or loaded owning handoff; the field is body-free identity, not evidence alias or authenticity proof. Affected checkpoint: `pass_R06.5-F_affected_sync`.

### 10.5 `ReportHandoffScopeRef`

```rust
/// Typed identity for one immutable observation-side handoff selection.
pub struct ReportHandoffScopeRef(BodyFreeRef);
```

| contract item | rule |
|---|---|
| owner / mint | `contracts::refs`; application id generator before handoff draft |
| factory | `new(BodyFreeRef) -> Self`; raw input must pass `BodyFreeRef` validation |
| member / wire | `as_body_free_ref`; wire field `handoff_scope_ref` |
| invariant | not a report id, consumer id, evidence alias or page cursor; same scope replacement retains identity |
| tests / stop | owner mismatch, raw locator, scope/view confusion; planned only |

### 10.6 `ArchiveEligibilityRef`

```rust
/// Body-free hint that observation material may be evaluated by an archive boundary.
pub struct ArchiveEligibilityRef(BodyFreeRef);
```

| contract item | rule |
|---|---|
| owner / mint | `contracts::refs`; resolver or retention policy result |
| factory / member | `new/as_body_free_ref`; no direct public generation from a timestamp or policy key |
| invariant | does not contain archive package, destination, retention days or acceptance result |
| tests / stop | raw path/locator, marker ref substitution, archive truth claim; planned only |

### 10.7 `NoWriteTriggerKind`

```rust
/// Finite operation family that may attempt a forbidden write.
pub enum NoWriteTriggerKind {
    /// A read query or diagnostic path attempted a write.
    ReadOrDiagnostic,

    /// A projection or derived maintenance path attempted a source write.
    Maintenance,

    /// A handoff or export preparation path attempted a source write.
    HandoffOrExport,

    /// A replay coordination path attempted a source or external write.
    Replay,
}
```

| variant | wire | source | invariant |
|---|---|---|---|
| `ReadOrDiagnostic` | `read_or_diagnostic` | query/diagnostic guard | Query remains no-write |
| `Maintenance` | `maintenance` | derived maintenance guard | only observation/derived target can be changed |
| `HandoffOrExport` | `handoff_or_export` | handoff/export guard | delivery cannot mutate truth |
| `Replay` | `replay` | replay guard | approved scope cannot include source write |

### 10.8 `NoWriteTriggerContextRef`

```rust
/// Body-free context identifying the boundary that attempted a forbidden write.
pub struct NoWriteTriggerContextRef {
    /// Stable local trigger identity.
    pub trigger_ref: BodyFreeRef,

    /// Operation family that produced the attempt.
    pub trigger_kind: NoWriteTriggerKind,

    /// Guard scope applied to the attempted operation.
    pub guard_scope: NoWriteGuardScope,
}
```

| factory / member | rule |
|---|---|
| `new(trigger_ref, trigger_kind, guard_scope) -> Result<Self, ProtocolError>` | typed body-free construction; `trigger_ref` cannot be empty or locator-like |
| `kind(&self) -> NoWriteTriggerKind` | pure inspection |
| source | trusted application/job guard; not raw request body |
| invariant | no actor profile, credentials, command payload, provider error or SQL text |
| tests / stop | kind/scope compatibility, raw body rejection, wrong owner; planned only |

### 10.9 `ForbiddenWriteTargetKind`

```rust
/// Finite truth boundary that observability is forbidden to mutate.
pub enum ForbiddenWriteTargetKind {
    /// A source business or source-material truth boundary.
    SourceTruth,

    /// An external governance, artifact, evidence, identity, runtime or archive truth boundary.
    ExternalTruth,
}
```

| wire | source | invariant |
|---|---|---|
| `source_truth` | no-write policy | never allowed by observation maintenance |
| `external_truth` | no-write policy | never allowed by observation maintenance or replay |

### 10.10 `ForbiddenWriteTargetRef`

```rust
/// Structured body-free target that an operation must not mutate.
pub struct ForbiddenWriteTargetRef {
    /// Target classification.
    pub target_kind: ForbiddenWriteTargetKind,

    /// Safe external target identity.
    pub target_ref: ExternalObjectRef,

    /// No-write scope proving why the target is forbidden.
    pub guard_scope: NoWriteGuardScope,
}
```

| factory / member | rule |
|---|---|
| `new(target_kind, target_ref, guard_scope) -> Result<Self, ProtocolError>` | only body-free external target; source/external kind and guard scope must agree |
| `is_forbidden(&self) -> bool` | always true; no method grants write permission |
| source | boundary mapper / no-write policy |
| invariant | no source body, locator, credential or compensating target; not interchangeable with `MaintenanceTargetRef` |
| tests / stop | SourceTruth/ExternalTruth matrix, ObservationMaintenance misuse, raw target rejection; planned only |

### 10.11 `VisibilityScopeKind`

```rust
/// Finite scope family used to compute read visibility.
pub enum VisibilityScopeKind {
    /// Scope is tied to one observation surface.
    Observation,

    /// Scope is tied to one diagnostic request.
    Diagnostic,

    /// Scope is tied to one handoff consumer.
    Handoff,

    /// Scope is tied to one peripheral export consumer.
    Export,
}
```

### 10.12 `VisibilityScopeRef`

```rust
/// Structured body-free visibility scope; it is not an authorization grant.
pub struct VisibilityScopeRef {
    /// Stable local visibility scope identity.
    pub scope_ref: BodyFreeRef,

    /// Scope family used by the visibility policy.
    pub scope_kind: VisibilityScopeKind,
}
```

| factory / member | rule |
|---|---|
| `new(scope_ref, scope_kind) -> Result<Self, ProtocolError>` | body-free identity and exact kind |
| `kind(&self) -> VisibilityScopeKind` | inspection only; no permission grant |
| source | trusted actor/consumer boundary mapper |
| invariant | not `ConsumerScope`, not actor role, not credential, not business authorization |
| tests / stop | kind/consumer mismatch, raw locator, empty ref; planned only |

### 10.13 `ReferenceSubjectRef`

```rust
/// Safe subject reference used as the immutable subject of a reference snapshot.
pub struct ReferenceSubjectRef {
    /// Subject classification.
    pub subject_kind: ObservationSubjectKind,

    /// Safe subject identity supplied by the trusted boundary.
    pub subject_safe_ref: SubjectSafeRef,
}
```

| factory / member | rule |
|---|---|
| `from_safe_ref(subject_kind, subject_safe_ref) -> Result<Self, ProtocolError>` | exact subject kind/ref compatibility |
| `kind(&self) -> ObservationSubjectKind` | pure inspection |
| source | Identity/source resolver boundary; not local identity truth |
| invariant | no profile, role, display name, credential or identity lifecycle; snapshot state is separate |
| tests / stop | kind/ref mismatch, marker substitution, body/PII rejection; planned only |

### 10.14 `ExternalAuditExportPreparationRef`

```rust
/// Typed identity for one external-audit export preparation attempt.
pub struct ExternalAuditExportPreparationRef(BodyFreeRef);
```

| contract item | rule |
|---|---|
| owner / mint | `contracts::refs`; application id generator at preparation draft |
| invariant | not a provider delivery receipt, external audit id, evidence alias or signoff |
| tests / stop | wrapper discriminator and raw locator rejection; planned only |

### 10.15 `ReplayCoordinationRef`

```rust
/// Typed identity for one replay coordination execution.
pub struct ReplayCoordinationRef(BodyFreeRef);
```

| contract item | rule |
|---|---|
| owner / mint | `contracts::refs`; application/job execution boundary |
| invariant | not a replay scope identity, job run id or source replay id |
| tests / stop | identity owner separation and no external run id; planned only |

### 10.16 `RollupRebuildRef`

```rust
/// Typed identity for one signal-rollup rebuild attempt.
pub struct RollupRebuildRef(BodyFreeRef);
```

| contract item | rule |
|---|---|
| owner / mint | `contracts::refs`; application/job boundary |
| invariant | not a rollup window ref, source cursor or raw metric job id |
| tests / stop | wrapper discriminator, window/ref separation, raw provider id rejection; planned only |

### 10.17 `RetentionPurpose`

```rust
/// Finite observation-side purpose for retaining body-free material.
pub enum RetentionPurpose {
    /// Keeps material referenced by a body-free evidence linkage.
    EvidenceLinkageProtection,
    /// Keeps immutable material required by a report handoff.
    ReportHandoffProtection,
    /// Keeps material referenced by an active observation consumer.
    ActiveConsumerProtection,
    /// Keeps the basis required to evaluate replay safely.
    ReplaySafety,
    /// Keeps derived material needed for local auditability.
    DerivedProjectionAuditability,
}
```

| contract item | rule |
|---|---|
| owner / wire | `contracts::metadata`; exact snake_case tokens matching the five variants |
| source | typed retention command or validated policy/config snapshot |
| allowed use | marker creation, release eligibility and history explanation |
| forbidden | no duration, timestamp, storage tier, product name or cleanup authorization |
| tests / stop | five round-trips, unknown/alias rejection, purpose-to-protected-target matrix; planned only |

### 10.18 `ActiveProtectionReason`

```rust
/// Finite reason why an observation-side reference remains protected.
pub enum ActiveProtectionReason {
    /// A report consumer still references the protected material.
    ReportConsumerReference,
    /// A peripheral consumer still references the protected material.
    PeripheralConsumerReference,
    /// A read model still references the protected material.
    ReadModelReference,
    /// A diagnostic surface still references the protected material.
    DiagnosticReference,
    /// An archive handoff still references the protected material.
    ArchiveHandoffReference,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; retention policy maps a structured `ObservationConsumerRef` family |
| compatibility | reason family must match the first accepted consumer family; later mixed consumers remain in the canonical set |
| invariant | describes why protection exists, not consumer identity or retention duration |
| tests / stop | all consumer families, wrong-family construction, unknown token; planned only |

### 10.19 `RetentionConflictReason`

```rust
/// Finite reason why a retention marker cannot advance normally.
pub enum RetentionConflictReason {
    /// An active-reference protection relation blocks the marker.
    ActiveReferenceProtection,
    /// A pending report handoff still requires the material.
    PendingReportHandoff,
    /// An active replay scope still requires the retained basis.
    ActiveReplayScope,
    /// Archive eligibility has not been resolved locally.
    ArchiveEligibilityUnresolved,
    /// The loaded protection snapshot conflicts with the marker version.
    ProtectionSnapshotConflict,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; target-bound retention policy result |
| state use | accepted reason can move a non-Released marker to `Conflict` |
| invariant | no SQL/network/provider text and no statement that cleanup failed or source truth changed |
| tests / stop | five variants, state mapping, `Released` rejection; planned only |

### 10.20 `ProtectionConflictReason`

```rust
/// Finite reason why active-reference release evaluation conflicts.
pub enum ProtectionConflictReason {
    /// At least one evaluated consumer remains active.
    ActiveConsumerPresent,
    /// The consumer snapshot changed during release evaluation.
    ConsumerSnapshotChanged,
    /// The evaluated protected target does not match the relation.
    ProtectedTargetMismatch,
    /// The release basis is stale and must be reloaded.
    ReleaseBasisStale,
    /// A retention hold still blocks releasing the relation.
    RetentionHoldActive,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; `RetentionProtectionPolicy` or repository-version mapper |
| state use | only `ActiveProtectionReleaseOutcome::Conflicted` or explicit `mark_conflict` |
| invariant | does not clear consumers, release marker, delete material or expose repository errors |
| tests / stop | active-set relation, stale-version conflict, target mismatch, unknown token; planned only |

### 10.21 `ReplayAllowedEffect`

```rust
/// Exact observation-side effect allowed by one replay scope.
pub enum ReplayAllowedEffect {
    /// Replaces an observation-owned derived projection.
    RebuildDerivedProjection,
    /// Refreshes a body-free local reference snapshot.
    RefreshBodyFreeReference,
    /// Scans observation-owned gap state without repairing source truth.
    ScanObservationGap,
    /// Rebuilds a rollup from committed safe-signal facts.
    RebuildSignalRollup,
}
```

| contract item | rule |
|---|---|
| owner / wire | `contracts::metadata`; four exact snake_case tokens |
| compatibility | one-to-one mapping to the matching `MaintenanceTargetKind` / `MaintenanceAllowedEffect` pair |
| invariant | no source truth write, external truth write, raw replay or generic `Other` effect；`CoordinateObservationReplay` is the application operation that consumes one of these effects, not a recursive domain effect |
| tests / stop | four target/effect pairs, cross-pair rejection, source/external target rejection, legacy coordinate effect rejection; planned only |

### 10.22 `ReplayBlockReason`

```rust
/// Finite reason why replay definition or coordination is blocked.
pub enum ReplayBlockReason {
    /// A target lies outside the observation or derived boundary.
    TargetOutsideObservationBoundary,
    /// The allowed effect is incompatible with at least one target.
    EffectTargetMismatch,
    /// A retention hold blocks replay for the captured target.
    RetentionHoldActive,
    /// An active-reference relation blocks replay for the target.
    ActiveReferenceProtection,
    /// The no-write guard rejected the replay boundary.
    NoWriteGuardBlocked,
    /// The replay scope snapshot is stale or version-conflicted.
    ScopeSnapshotStale,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; replay boundary/coordination policy |
| state use | `ReplayScope -> Blocked` or `ReplayCoordinationState -> Blocked` with exact target retained |
| invariant | block is not final verdict, source repair result or adapter error string |
| tests / stop | six variants, target/effect/no-write mappings, unknown token; planned only |

### 10.23 `ReplayCloseReason`

```rust
/// Finite reason for closing one replay scope without a source-repair claim.
pub enum ReplayCloseReason {
    /// The approved observation-side effect completed within scope.
    CompletedWithinScope,
    /// The scope was cancelled before coordination started.
    CancelledBeforeExecution,
    /// The scope was cancelled after a non-mutating block.
    CancelledAfterBlock,
    /// A separately identified immutable scope superseded this scope.
    SupersededByNewScope,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; accepted replay lifecycle command/result |
| target state | `CompletedWithinScope -> Completed`; all other variants -> `Cancelled` |
| invariant | completed means allowed observation-side effect only; superseded does not mutate the replacement scope |
| tests / stop | four total state mappings, terminal re-close rejection, unknown token; planned only |

### 10.24 `NoWriteEscalationReason`

```rust
/// Finite reason for escalating an already blocked no-write violation.
pub enum NoWriteEscalationReason {
    /// The same forbidden operation boundary attempted another write.
    RepeatedAttempt,
    /// The attempted target belongs to source truth.
    SourceTruthTarget,
    /// The attempted target belongs to an external truth owner.
    ExternalTruthTarget,
    /// The operation attempted to bypass its no-write guard.
    GuardBypassAttempt,
    /// Target and guard classifications conflict and require review.
    BoundaryClassificationConflict,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; no-write guard over an accepted violation snapshot |
| state use | `Detected/Blocked -> Escalated`; forbidden adapter call remains zero |
| invariant | no compensation command, raw payload, SQL, endpoint or operator free text |
| tests / stop | five variants, escalation-before-write ordering, unknown token; planned only |

### 10.25 `NoWriteCloseReason`

```rust
/// Finite reason for closing no-write violation handling while preserving history.
pub enum NoWriteCloseReason {
    /// The forbidden attempt was blocked before any adapter call.
    AttemptBlocked,
    /// The violation was an exact duplicate of an immutable observation.
    DuplicateObservation,
    /// A separately identified operation scope superseded this context.
    ScopeSuperseded,
    /// Local operations review completed without changing source truth.
    OperatorReviewed,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; violation lifecycle command or duplicate classifier |
| state use | `Blocked/Escalated -> Closed` only |
| invariant | close never means source repaired, history deleted, compensation succeeded or incident accepted |
| tests / stop | four variants, direct Detected close rejection, history preservation; planned only |

### 10.26 `ReadBlockReason`

```rust
/// Finite local boundary reason for blocking a read surface.
pub enum ReadBlockReason {
    /// A validated visibility constraint requires body absence.
    VisibilityConstraint,
    /// The safety boundary forbids exposing the selected body.
    SafetyBoundary,
    /// A no-write invariant blocks the requested operation surface.
    NoWriteGuard,
    /// A retention boundary prevents this read-side handoff.
    RetentionBoundary,
    /// The required committed snapshot is internally inconsistent.
    InconsistentSnapshot,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; target-bound read visibility decision |
| state use | moves one request-scoped evaluation to `Blocked`;reason mandatory，gap optional only for guard-only block |
| invariant | not an authorization decision, not-found result or business denial truth |
| tests / stop | five variants, guard-only blocked-without-gap, gap-backed block binding, missing/not-visible distinction; planned only |

### 10.27 `DiagnosticScopeInvalidReason`

```rust
/// Finite reason why a diagnostic scope cannot be constructed or replaced.
pub enum DiagnosticScopeInvalidReason {
    /// The diagnostic selection contains no target.
    EmptyTargetSet,
    /// At least one selected target is incompatible with the projection scope.
    ScopeTargetMismatch,
    /// The diagnostic time window is missing or not ordered.
    InvalidTimeWindow,
    /// The visibility scope is incompatible with the diagnostic selection.
    VisibilityScopeMismatch,
    /// The selected target family is not supported for diagnostics.
    UnsupportedTarget,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; `DiagnosticScope` factory/replacement validation |
| result use | typed payload carried by `DomainError` for rejected construction/replacement; no persisted invalid state and no transition delta |
| invariant | no raw validation message, product target, locator or source scan permission |
| tests / stop | five exact failures and valid control case; planned only |

### 10.28 `DiagnosticUnavailableReason`

```rust
/// Finite reason why a diagnostic summary cannot currently be assembled.
pub enum DiagnosticUnavailableReason {
    /// No committed cursor or equivalent boundary can anchor the summary.
    NoCommittedBoundary,
    /// A required derived projection is missing.
    RequiredProjectionMissing,
    /// A body-free reference dependency is unavailable.
    ReferenceUnavailable,
    /// Visibility policy requires an unavailable body surface.
    VisibilityBlocked,
    /// The loaded committed inputs do not form one consistent snapshot.
    SnapshotInconsistent,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; diagnostic assembler over committed inputs |
| state use | `DiagnosticSummary -> Unavailable`; existing safe refs remain auditable but not normally visible |
| invariant | no provider body/error, synthetic empty success, automatic refresh or rebuild |
| tests / stop | five variants, unavailable visibility matrix, no-query-write spy; planned only |

### 10.29 `StalenessReason`

```rust
/// Finite reason why a derived diagnostic or read projection became stale.
pub enum StalenessReason {
    /// The committed cursor advanced past the assembled summary.
    CommittedCursorAdvanced,
    /// A dependency snapshot changed after assembly.
    DependencySnapshotChanged,
    /// A required body-free reference snapshot became stale.
    ReferenceSnapshotStale,
    /// A derived rebuild is pending for this surface.
    RebuildPending,
    /// The persisted freshness marker is unavailable.
    FreshnessMarkerMissing,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; committed cursor/freshness comparison, never local time guess |
| state use | `Fresh/Partial -> Stale`; reason does not itself start maintenance |
| invariant | distinct from R06.2 `ReferenceStaleReason`, which describes one reference boundary |
| tests / stop | five mappings, cross-reason confusion, no wall-clock-only staleness; planned only |

### 10.30 `GapCloseReason`

```rust
/// Finite local basis for resolving one observation gap.
pub enum GapCloseReason {
    /// A local body-free reference resolution closed the gap basis.
    LocalReferenceResolved,
    /// A derived projection rebuild restored the selected surface.
    DerivedProjectionRebuilt,
    /// A new visibility evaluation made the local material usable.
    VisibilityReevaluated,
    /// A newly accepted safe summary replaced the incomplete basis.
    SafeSummaryReplaced,
    /// This gap was merged into an equivalent canonical gap record.
    DuplicateGapMerged,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; loaded local resolution evidence plus gap policy |
| state use | `Open/Acknowledged -> Resolved`; `Suppressed -> Resolved` remains unreachable while suppression is reserved |
| invariant | no assertion that source material, identity, artifact or evidence truth was repaired |
| tests / stop | basis/gap-kind matrix, missing basis, external-repair wording rejection; planned only |

### 10.31 `DegradedBlockReason`

```rust
/// Finite reason why a degraded output must expose no body.
pub enum DegradedBlockReason {
    /// The safety boundary requires body absence.
    SafetyBlocked,
    /// The visibility boundary requires body absence.
    VisibilityBlocked,
    /// A no-write guard blocks the requested derived surface.
    NoWriteGuardBlocked,
    /// A retention boundary blocks the requested derived surface.
    RetentionBoundaryBlocked,
    /// A required explicit gap remains unresolved.
    RequiredGapUnresolved,
    /// The assembled committed snapshot is inconsistent.
    InconsistentSnapshot,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; degraded-output policy |
| state use | `None/Active -> Blocked`; clears limited-consumption permission and requires body absence |
| invariant | cannot hide the owning gap or manufacture replacement success |
| tests / stop | six variants, total read-block mapping, body-presence matrix, gap linkage preservation; planned only |

### 10.32 `ExportBlockReason`

```rust
/// Finite policy reason why one external-audit export preparation is blocked.
pub enum ExportBlockReason {
    /// The structured consumer boundary is unavailable or retired.
    ConsumerUnavailable,
    /// The selected body-free view is not visible to the consumer.
    VisibilityBlocked,
    /// A required evidence or observation gap blocks preparation.
    EvidenceGap,
    /// An active retention hold blocks preparation or delivery.
    RetentionHoldActive,
    /// The no-write guard rejected the export operation boundary.
    NoWriteGuardBlocked,
    /// The validated consumer snapshot disables export.
    ExportDisabled,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; target-bound peripheral export policy |
| state use | disallowed delivery/preparation decision; no adapter call |
| invariant | no product/provider name, audit conclusion, external rejection body or signoff |
| tests / stop | six variants, decision allowed/reason matrix, zero adapter call; planned only |

### 10.33 `ExportFailureReason`

```rust
/// Product-neutral finite failure of one export preparation or delivery attempt.
pub enum ExportFailureReason {
    /// The product-neutral delivery adapter is unavailable.
    AdapterUnavailable,
    /// The delivery boundary timed out without a committed success result.
    DeliveryTimeout,
    /// A temporary product-neutral boundary failure occurred.
    TemporaryBoundaryFailure,
    /// The boundary rejected the immutable body-free input.
    BoundaryRejected,
    /// The boundary returned a response that cannot be mapped safely.
    InvalidBoundaryResponse,
    /// The immutable local input snapshot is no longer available.
    ImmutableInputUnavailable,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; finite adapter outcome mapper, never error-string parsing |
| retryability | first three variants retryable; last three require a new reviewed attempt or remain terminal |
| `can_retry()` | true only `AdapterUnavailable/DeliveryTimeout/TemporaryBoundaryFailure`; total, no default branch |
| state use | accepted failure moves `Draft/Prepared -> Failed`; no external audit conclusion |
| tests / stop | six wire values, retryability total map, raw provider error exclusion; planned only |

### 10.34 `MaintenanceCancelReason`

```rust
/// Finite future reason for cancelling one derived maintenance attempt.
pub enum MaintenanceCancelReason {
    /// An explicit future operator command cancelled the attempt.
    OperatorCancelled,
    /// A separately identified immutable plan superseded the attempt.
    SupersededPlan,
    /// A required dependency was formally retired.
    DependencyRetired,
    /// The local maintenance boundary entered controlled shutdown.
    BoundaryShutdown,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; future typed maintenance/job command |
| current phase | schema is reserved; every current `cancel` callable returns `ReservedTransition` and emits no delta |
| invariant | cancellation never implies rollback, source repair, delivery retraction or history deletion |
| tests / stop | four wire values plus all current callable rejection paths; planned only |

### 10.35 `ReferenceInvalidReason`

```rust
/// Finite reason why a reference subject is invalid for this boundary.
pub enum ReferenceInvalidReason {
    /// The subject family is unsupported by the reference boundary.
    UnsupportedSubjectKind,
    /// The supplied body-free subject identity is malformed.
    SubjectReferenceMalformed,
    /// The subject kind and typed reference owner do not match.
    SubjectKindMismatch,
    /// The reference belongs to a different boundary owner.
    BoundaryOwnerMismatch,
    /// The supplied reference contains forbidden body or locator semantics.
    UnsafeReferencePayload,
}
```

| contract item | rule |
|---|---|
| owner / source | `contracts::metadata`; trusted reference boundary validator |
| state use | non-Invalid snapshot -> terminal `Invalid`; usable summary/version cleared |
| invariant | no provider error/body, identity lifecycle conclusion or external object mutation |
| tests / stop | five variants, invalid terminal, subject mismatch and forbidden-body cases; planned only |

## 11. R06.4 state / result / transition exact schema

### 11.1 `GapKind`

```rust
/// Finite category explaining why an observation-side gap exists.
pub enum GapKind {
    /// Expected observation material is absent from the local boundary.
    MissingMaterial,

    /// A tracked reference cannot currently be resolved.
    UnresolvedReference,

    /// Material exists but is not visible in the current consumer scope.
    NotVisibleMaterial,

    /// Material cannot be safely exposed under the current redaction boundary.
    UnsafeOutput,
}
```

| variant | wire | allowed source | allowed destination | invariant |
|---|---|---|---|---|
| `MissingMaterial` | `missing_material` | source/reference/gap classifier | `GapState::Open` | missing is not not-visible and does not imply source deletion |
| `UnresolvedReference` | `unresolved_reference` | reference snapshot / resolver outcome | `GapState::Open` | no default reference is synthesized |
| `NotVisibleMaterial` | `not_visible_material` | visibility policy | `GapState::Open` | must remain distinct from missing |
| `UnsafeOutput` | `unsafe_output` | safety/redaction policy | `GapState::Open` + blocked/degraded surface | no forbidden body is retained |

`GapKind` is contracts-owned metadata. It has no `Other(String)` variant, does not hold provider detail and does not itself close a gap.

### 11.2 `RetentionMarkerState` and `ActiveReferenceProtectionState`

The exact variants are contracts-owned and already fixed by the current Step 10 matrix:

```rust
/// Retention lifecycle owned by the observation boundary.
pub enum RetentionMarkerState {
    /// No observation-side hold is currently applied.
    Unmarked,
    /// A retention hold blocks cleanup or destructive derived work.
    ActiveHold,
    /// Release may be evaluated but is not yet performed.
    ReleaseEligible,
    /// The local observation-side hold was released.
    Released,
    /// Retention conflicts with an active reference or handoff requirement.
    Conflict,
}

/// Active-reference protection lifecycle.
pub enum ActiveReferenceProtectionState {
    /// The protection relation exists without an attached active consumer.
    Unprotected,
    /// At least one active consumer requires the protected object to remain.
    Protected,
    /// Protection expired and consumers must be re-evaluated before release.
    Expired,
    /// The protection relation was released and is terminal.
    Released,
    /// Release or protection rules conflict.
    Conflicted,
}
```

`ReleaseEligible` and `Expired` are evaluation states, not cleanup authorization. `Released` is reserved/terminal according to current phase rules; direct re-open is rejected.

### 11.2.1 `ReplayScopeState`

```rust
/// Lifecycle of one immutable observation-side replay scope.
pub enum ReplayScopeState {
    /// Targets and allowed effect are fixed but not yet approved.
    Defined,
    /// A target-bound policy snapshot approved observation-side coordination.
    Approved,
    /// Retention, scope, or no-write policy terminally blocked this scope.
    Blocked,
    /// The approved observation-side effect completed within this scope.
    Completed,
    /// The scope was cancelled before an accepted completion.
    Cancelled,
}
```

| state | wire | callable source | terminal / boundary |
|---|---|---|---|
| `Defined` | `defined` | `ReplayScope::define` | may approve, block, narrow or cancel |
| `Approved` | `approved` | target-bound `ReplayApprovalSnapshot` | may coordinate, block, complete or cancel |
| `Blocked` | `blocked` | `ReplayBlockReason` | terminal for this scope; cannot close to Cancelled |
| `Completed` | `completed` | `CompletedWithinScope` after coordination completion | terminal; no source-repair meaning |
| `Cancelled` | `cancelled` | typed pre-completion close reason | terminal; no rollback meaning |

### 11.2.2 `NoWriteViolationState`

```rust
/// Lifecycle of one locally observed forbidden-write attempt.
pub enum NoWriteViolationState {
    /// A forbidden target was detected before the attempted adapter call.
    Detected,
    /// The attempted write was fail-closed and did not execute.
    Blocked,
    /// The blocked attempt was escalated for local operations review.
    Escalated,
    /// Local handling closed while immutable history remains available.
    Closed,
}
```

| state | wire | callable source | terminal / boundary |
|---|---|---|---|
| `Detected` | `detected` | `NoWriteViolation::detect` | forbidden call must still be zero |
| `Blocked` | `blocked` | `block` | may escalate or close |
| `Escalated` | `escalated` | typed escalation reason | may close; never grants compensation write |
| `Closed` | `closed` | typed close reason | terminal; does not mean source repaired or history deleted |

### 11.2.3 `GapLifecycleState`

```rust
/// Lifecycle of one explicit observation-side gap.
pub enum GapLifecycleState {
    /// The gap is open and must remain visible to affected consumers.
    Open,
    /// The gap was acknowledged without being resolved.
    Acknowledged,
    /// A local body-free resolution basis closed this gap.
    Resolved,
    /// A future visibility-scoped suppression keeps the gap auditable.
    Suppressed,
}
```

| state | wire | callable source | terminal / reserved |
|---|---|---|---|
| `Open` | `open` | `GapState::open` | may acknowledge, mitigate or resolve |
| `Acknowledged` | `acknowledged` | acknowledge/mitigate | may mitigate again or resolve |
| `Resolved` | `resolved` | typed local close basis | terminal for this gap; not source repair |
| `Suppressed` | `suppressed` | no current callable source | reserved; suppress/unsuppress always reject in this phase |

### 11.3 `ReportHandoffState`, `HandoffReadinessState`, `AuthenticityHintState`

```rust
/// Report handoff lifecycle inside observability.
pub enum ReportHandoffState {
    /// Handoff record exists but has not been prepared.
    Draft,
    /// Body-free handoff input has been prepared.
    Prepared,
    /// Local delivery was recorded.
    Delivered,
    /// Preparation or delivery failed for this attempt.
    Failed,
    /// Handoff was cancelled by an explicit future boundary.
    Cancelled,
}

/// Policy readiness co-state for one report handoff.
pub enum HandoffReadinessState {
    /// Required evidence, visibility or gap input is incomplete.
    PendingEvidence,
    /// Current body-free and boundary checks permit preparation.
    Ready,
    /// A hard policy or boundary guard blocks preparation.
    Blocked,
    /// Preparation is allowed only with explicit degraded semantics.
    Degraded,
}

/// Non-fabricating authenticity hint lifecycle.
pub enum AuthenticityHintState {
    /// No origin assessment has been completed.
    Unassessed,
    /// A trusted body-free origin was linked.
    RealEvidenceLinked,
    /// The input was identified as a placeholder.
    PlaceholderDetected,
    /// The available safe basis is insufficient.
    Insufficient,
}
```

`Delivered` is never mapped to acceptance/signoff; `RealEvidenceLinked` is never mapped to authenticity verdict.

### 11.4 `ReadVisibilityKind` and `DiagnosticFreshnessState`

```rust
/// Visibility of one read surface under one request-scoped evaluation.
pub enum ReadVisibilityKind {
    /// Body-free output is visible under the evaluated scope.
    Visible,
    /// Only a restricted body-free subset is visible.
    Restricted,
    /// The object exists but is not visible to this consumer.
    NotVisible,
    /// A hard safety, no-write or boundary guard blocks output.
    Blocked,
}

/// Freshness of a derived diagnostic summary.
pub enum DiagnosticFreshnessState {
    /// Summary covers the captured committed input boundary.
    Fresh,
    /// Summary is known to lag its input boundary.
    Stale,
    /// Summary is usable only with explicit incomplete-input semantics.
    Partial,
    /// Summary cannot currently be assembled.
    Unavailable,
}
```

### 11.5 `DegradedOutputKind`, `PeripheralDeliveryKind`, `ExportPreparationState`

```rust
/// Lifecycle for a derived degraded-output sidecar.
pub enum DegradedOutputKind {
    /// No degraded condition is attached to this sidecar.
    None,
    /// Limited or explicitly degraded output is allowed.
    Active,
    /// Output is blocked and must not carry a body.
    Blocked,
}

/// Local lifecycle of one peripheral delivery attempt.
pub enum PeripheralDeliveryKind {
    /// Delivery marker exists but preparation has not started.
    Pending,
    /// Body-free view is prepared for delivery.
    Prepared,
    /// Local boundary recorded delivery.
    Delivered,
    /// Delivery failed for this attempt.
    Failed,
    /// Delivery is blocked by a local policy or boundary.
    Blocked,
    /// Delivery was cancelled by an explicit future boundary.
    Cancelled,
}

/// Local lifecycle of external-audit export preparation.
pub enum ExportPreparationState {
    /// Preparation draft exists.
    Draft,
    /// Body-free export input is prepared.
    Prepared,
    /// Preparation is blocked.
    Blocked,
    /// Local delivery was recorded.
    Delivered,
    /// Preparation or delivery failed.
    Failed,
}
```

### 11.6 `ReferenceSnapshotStateKind`, `ProjectionMaintenanceStateKind`, `ReplayCoordinationKind`, `RollupRebuildKind`

```rust
/// Local resolution and freshness lifecycle of one reference snapshot.
pub enum ReferenceSnapshotStateKind {
    /// Snapshot is awaiting a resolver outcome.
    Pending,
    /// Snapshot has a safe summary and accepted source version.
    Resolved,
    /// Snapshot is known but stale.
    Stale,
    /// Snapshot cannot currently be resolved.
    Unresolved,
    /// Snapshot target is invalid for this boundary.
    Invalid,
    /// Resolver or adapter is unavailable.
    Unavailable,
}

/// Lifecycle of derived projection maintenance.
pub enum ProjectionMaintenanceStateKind {
    /// Derived projection covers its captured committed boundary.
    Fresh,
    /// Derived projection is behind or missing.
    Stale,
    /// Derived projection replacement is running.
    Rebuilding,
    /// Current maintenance attempt failed.
    Failed,
}

/// Lifecycle of one replay coordination execution.
pub enum ReplayCoordinationKind {
    /// Coordination record exists but has not started.
    Pending,
    /// Approved observation-side replay is being coordinated.
    Coordinating,
    /// Execution was blocked by a local boundary.
    Blocked,
    /// Coordination completed for this execution.
    Completed,
    /// Coordination failed for this execution.
    Failed,
}

/// Lifecycle of one rollup rebuild attempt.
pub enum RollupRebuildKind {
    /// Rebuild attempt is queued.
    Pending,
    /// Rebuild is reading saved safe-signal facts.
    Running,
    /// Rebuild completed for its captured cursor.
    Completed,
    /// Rebuild failed.
    Failed,
    /// Rebuild was cancelled by an explicit future boundary.
    Cancelled,
}
```

All state enum definitions above are in `contracts::metadata`; only the owning object cards in §§8-10 can transition them. Unknown, alias, numeric and free-string tokens reject with `ProtocolError::UnknownEnumToken`.

### 11.7 `PeripheralDeliveryResult`

```rust
/// Product-neutral result of one peripheral delivery adapter boundary.
pub enum PeripheralDeliveryResult {
    /// The local delivery boundary recorded success.
    Delivered,
    /// The attempt may be retried with the same immutable input.
    RetryableFailure,
    /// The attempt failed permanently or is not retryable.
    PermanentFailure,
    /// Policy or consumer boundary rejected the input.
    Rejected,
}
```

| method / source | rule |
|---|---|
| `can_retry()` | only `RetryableFailure` |
| `is_terminal()` | `Delivered`, `PermanentFailure`, `Rejected` |
| source | adapter outcome mapper; never error-string parsing |
| invariant | no provider receipt/body, no external acceptance, no final audit conclusion |

### 11.8 transition delta exact schema

All R06.4 deltas are domain-owned immutable process-local outputs. A delta proves one accepted mutation and carries its change-specific before/after payload, but it does not have to duplicate every immutable aggregate relation. An R06.5 record factory must consume the successful delta together with the same-UoW post-mutation aggregate snapshot and typed record metadata; it may never consume a delta alone or infer a historical change from current truth alone. Deltas never contain actor/time/record/outbox/job identity. The six exact structs already defined in §§9.7/10.3/10.4 remain authoritative; the remaining eleven types are fixed below.

#### 11.8.1 `ReadVisibilityTransition`

```rust
/// Accepted change to one request-scoped read visibility evaluation.
pub struct ReadVisibilityTransition {
    /// Visibility evaluation changed by this delta.
    pub visibility_ref: ReadVisibilityRef,
    /// One-shot request context bound to the evaluation.
    pub request_context_ref: DiagnosticRequestContextRef,
    /// Exact visibility scope evaluated by the policy.
    pub visibility_scope_ref: VisibilityScopeRef,
    /// Visibility kind before mutation.
    pub from_kind: ReadVisibilityKind,
    /// Visibility kind after mutation.
    pub to_kind: ReadVisibilityKind,
    /// Constraint before reevaluation, when any.
    pub previous_constraint_ref: Option<VisibilityConstraintRef>,
    /// Constraint after reevaluation, when any.
    pub current_constraint_ref: Option<VisibilityConstraintRef>,
    /// Gap before reevaluation, when any.
    pub previous_gap_ref: Option<GapStateRef>,
    /// Gap after reevaluation, when any.
    pub current_gap_ref: Option<GapStateRef>,
    /// Block reason before reevaluation, when any.
    pub previous_block_reason: Option<ReadBlockReason>,
    /// Block reason after reevaluation, when any.
    pub current_block_reason: Option<ReadBlockReason>,
}
```

The current payload follows the exact decision matrix: `Restricted` requires only current constraint, `NotVisible` requires only current gap, and `Blocked` requires current block reason while current gap is optional and, when Some, must identify a real classified gap from the complete input snapshot. Previous fields preserve values cleared by reevaluation. At least one kind/conditional value changes; exact replay returns `Ok(None)`. This delta is optional diagnostic/history input and does not make Query persistent.

#### 11.8.2 `DiagnosticScopeTransition`

```rust
/// Accepted target-set replacement for one diagnostic scope.
pub struct DiagnosticScopeTransition {
    /// Diagnostic scope changed by this successful delta.
    pub scope_ref: DiagnosticScopeRef,
    /// Unchanged projection scope that constrains both target sets.
    pub projection_scope: ObservationProjectionScope,
    /// Canonical target set before replacement.
    pub previous_target_refs: BodyFreeRefSet,
    /// Canonical target set after replacement.
    pub new_target_refs: BodyFreeRefSet,
}
```

Both target sets are concrete, canonical and compatible with the unchanged projection scope; the new set is non-empty and differs from the previous set. Invalid construction, incompatible replacement and exact duplicate replacement return typed `DomainError`, leave the object byte-for-byte unchanged and emit no `DiagnosticScopeTransition`.

#### 11.8.3 `DiagnosticSummaryTransition`

```rust
/// Exact operation and payload that produced one diagnostic-summary replacement.
pub enum DiagnosticSummaryTransitionChange {
    SignalAttached(SafeSignalRef),
    GapAttached(GapStateRef),
    NoWriteViolationAttached(NoWriteViolationRef),
    MarkedStale(StalenessReason),
    MarkedUnavailable(DiagnosticUnavailableReason),
}

/// Accepted change to one derived diagnostic summary.
pub struct DiagnosticSummaryTransition {
    /// Immutable summary revision replaced by this delta.
    pub previous_summary_ref: DiagnosticSummaryRef,
    /// New immutable summary revision produced by this delta.
    pub current_summary_ref: DiagnosticSummaryRef,
    /// Immutable diagnostic scope represented by the summary.
    pub scope_ref: DiagnosticScopeRef,
    /// Owning member operation and exact typed payload that produced this replacement.
    pub change: DiagnosticSummaryTransitionChange,
    /// Freshness before mutation.
    pub from_freshness: DiagnosticFreshnessState,
    /// Freshness after mutation.
    pub to_freshness: DiagnosticFreshnessState,
    /// Safe-signal membership before replacement.
    pub previous_safe_signal_refs: SafeSignalRefSet,
    /// Safe-signal membership after replacement.
    pub current_safe_signal_refs: SafeSignalRefSet,
    /// Gap membership before replacement.
    pub previous_gap_refs: GapStateRefSet,
    /// Gap membership after replacement.
    pub current_gap_refs: GapStateRefSet,
    /// No-write violation membership before replacement.
    pub previous_no_write_violation_refs: NoWriteViolationRefSet,
    /// No-write violation membership after replacement.
    pub current_no_write_violation_refs: NoWriteViolationRefSet,
    /// Staleness reason before replacement, when applicable.
    pub previous_staleness_reason: Option<StalenessReason>,
    /// Staleness reason after replacement, when applicable.
    pub current_staleness_reason: Option<StalenessReason>,
    /// Unavailable reason before replacement, when applicable.
    pub previous_unavailable_reason: Option<DiagnosticUnavailableReason>,
    /// Unavailable reason after replacement, when applicable.
    pub current_unavailable_reason: Option<DiagnosticUnavailableReason>,
    /// Committed cursor represented by the previous revision.
    pub previous_as_of_cursor: Option<ObservationCommittedCursor>,
    /// Committed cursor represented by the new revision.
    pub current_as_of_cursor: Option<ObservationCommittedCursor>,
    /// Assembly time of the previous revision.
    pub previous_assembled_at: ObservedAt,
    /// Assembly time of the new revision.
    pub current_assembled_at: ObservedAt,
}
```

The two summary refs must differ, scope identity is unchanged, cursor/time never regress, and at least one member/freshness/reason/cursor value must change. Exactly one member set may add one identity for `with_*`; stale/unavailable replacements preserve all sets. `Stale` requires only current staleness reason; `Unavailable` requires only current unavailable reason. Exact duplicate input returns `Ok(None)`, creates no replacement revision and emits no delta; attachments cannot silently promote freshness to `Fresh`.

#### 11.8.4 `GapTransition`

```rust
/// Accepted lifecycle or mitigation change to one explicit gap.
pub struct GapTransition {
    /// Gap changed by this delta.
    pub gap_ref: GapStateRef,
    /// Observation-side object affected by the gap.
    pub affected_object_ref: AffectedObservationObjectRef,
    /// Gap lifecycle before mutation.
    pub from_state: GapLifecycleState,
    /// Gap lifecycle after mutation.
    pub to_state: GapLifecycleState,
    /// Degraded-output revision before the mutation, when any.
    pub previous_degraded_ref: Option<DegradedOutputRef>,
    /// Degraded-output revision after the mutation, when any.
    pub current_degraded_ref: Option<DegradedOutputRef>,
    /// Actor that acknowledged the gap, when applicable.
    pub acknowledged_by: Option<ActorSafeRef>,
    /// Local close basis before the mutation, when any.
    pub previous_close_reason: Option<GapCloseReason>,
    /// Local close basis after the mutation, when any.
    pub current_close_reason: Option<GapCloseReason>,
    /// Local resolution time before the mutation, when any.
    pub previous_closed_at: Option<ObservedAt>,
    /// Local resolution time after the mutation, when any.
    pub current_closed_at: Option<ObservedAt>,
}
```

Acknowledgement requires actor and leaves degraded/close pairs unchanged. Mitigation changes current degraded ref to the loaded revision and has no actor/close change; exact same revision returns `Ok(None)`. Resolution changes only current close reason/time and preserves the degraded relation for audit. No current delta may target `Suppressed` or originate from a rehydrated `Suppressed` state through `unsuppress`.

#### 11.8.5 `DegradedOutputTransition`

```rust
/// Accepted change to one derived degraded-output sidecar.
pub struct DegradedOutputTransition {
    /// Immutable degraded-output revision replaced by this delta.
    pub previous_degraded_ref: DegradedOutputRef,
    /// New immutable degraded-output revision produced by this delta.
    pub current_degraded_ref: DegradedOutputRef,
    /// Observation-side target bound to the previous revision.
    pub previous_affected_object_ref: AffectedObservationObjectRef,
    /// Observation-side target bound to the current revision.
    pub current_affected_object_ref: AffectedObservationObjectRef,
    /// Exact P13 basis accepted for the replacement revision.
    pub policy_basis: PolicyEvaluationBasis,
    /// Degraded kind before mutation.
    pub from_kind: DegradedOutputKind,
    /// Degraded kind after mutation.
    pub to_kind: DegradedOutputKind,
    /// Reduced-output reason before mutation.
    pub previous_reason: Option<DegradedReason>,
    /// Reduced-output reason after mutation.
    pub current_reason: Option<DegradedReason>,
    /// Hard block reason before mutation.
    pub previous_block_reason: Option<DegradedBlockReason>,
    /// Hard block reason after mutation.
    pub current_block_reason: Option<DegradedBlockReason>,
    /// Gap relation before mutation, when any.
    pub previous_gap_ref: Option<GapStateRef>,
    /// Gap relation after mutation, when any.
    pub current_gap_ref: Option<GapStateRef>,
    /// Visibility scope before mutation.
    pub previous_visibility_scope_ref: VisibilityScopeRef,
    /// Visibility scope after mutation.
    pub current_visibility_scope_ref: VisibilityScopeRef,
    /// Whether limited consumption was allowed before mutation.
    pub previous_limited_consumption_allowed: bool,
    /// Whether limited consumption is allowed after mutation.
    pub current_limited_consumption_allowed: bool,
}
```

The two revision refs must differ. Both affected-object refs and both visibility-scope refs must be exactly equal because replacement cannot retarget a revision chain; the explicit before/after pairs prevent H8 from inferring target continuity from current truth. `policy_basis` must equal the accepted P13 decision basis. `Active` requires current reduced-output reason and limited permission; `Blocked` requires current reduced-output reason + block reason and false permission. At least one kind/conditional value must change; an exact target/outcome replay returns `Ok(None)` and does not consume the candidate replacement identity. Initial creation has no replacement delta and is handled by G-batch H8 only through an explicit creation branch, never by inventing a previous ref.

#### 11.8.6 `PeripheralDeliveryTransition`

```rust
/// Accepted local state change for one peripheral delivery attempt.
pub struct PeripheralDeliveryTransition {
    /// Delivery attempt changed by this delta.
    pub delivery_ref: PeripheralDeliveryRef,
    /// Immutable export preparation consumed by the attempt.
    pub preparation_ref: ExternalAuditExportPreparationRef,
    /// Structured consumer bound to the attempt.
    pub consumer_ref: PeripheralConsumerRef,
    /// Body-free public view bound to the attempt.
    pub view_ref: DashboardAlertExportViewRef,
    /// Delivery state before mutation.
    pub from_state: PeripheralDeliveryKind,
    /// Delivery state after mutation.
    pub to_state: PeripheralDeliveryKind,
    /// Visibility before the mutation, when any.
    pub previous_visibility: Option<VisibilitySurface>,
    /// Adapter result before the mutation, when any.
    pub previous_result: Option<PeripheralDeliveryResult>,
    /// Policy block reason before the mutation, when any.
    pub previous_block_reason: Option<PeripheralBlockReason>,
    /// Adapter failure reason before the mutation, when any.
    pub previous_failure_reason: Option<ExportFailureReason>,
    /// Gaps before the mutation.
    pub previous_gap_refs: GapStateRefSet,
    /// P14 basis accepted by prepare/block, absent for adapter-result transitions.
    pub accepted_policy_basis: Option<PolicyEvaluationBasis>,
    /// Local transition time before the mutation.
    pub previous_updated_at: ObservedAt,
    /// Local transition time after the mutation.
    pub current_updated_at: ObservedAt,
}
```

The post-mutation `PeripheralDeliveryState` supplies current visibility/result/block/failure/gaps. `Pending/Blocked/Failed -> Prepared` and any transition to `Blocked` require `accepted_policy_basis=Some(exact P14 basis)`; `Prepared -> Delivered/Failed` requires None because an adapter result is not a policy evaluation. `Delivered` requires current `Delivered`; `Failed` requires compatible current non-delivered result + failure reason; `Blocked` requires current block reason and no result/failure. Retry/reprepare deltas preserve the old retryable result/reason or block reason while the aggregate shows those fields cleared and policy snapshot replaced. Permanent/rejected failure has no outgoing delta; `Cancelled` has no current delta. Delivery success remains local and cannot mutate consumer, view or observation truth.

#### 11.8.7 `ExportPreparationTransition`

```rust
/// Accepted local state change for one external-audit export preparation.
pub struct ExportPreparationTransition {
    /// Export preparation changed by this delta.
    pub preparation_ref: ExternalAuditExportPreparationRef,
    /// Structured consumer bound to the preparation.
    pub consumer_ref: PeripheralConsumerRef,
    /// Body-free public view bound to the preparation.
    pub view_ref: DashboardAlertExportViewRef,
    /// Preparation state before mutation.
    pub from_state: ExportPreparationState,
    /// Preparation state after mutation.
    pub to_state: ExportPreparationState,
    /// Readiness before the mutation.
    pub previous_readiness: HandoffReadinessState,
    /// Visibility before the mutation, when any.
    pub previous_visibility: Option<VisibilitySurface>,
    /// Local delivery result before the mutation, when any.
    pub previous_delivery_result: Option<PeripheralDeliveryResult>,
    /// Failure reason before the mutation, when any.
    pub previous_failure_reason: Option<ExportFailureReason>,
    /// Policy block reason before the mutation, when any.
    pub previous_block_reason: Option<ExportBlockReason>,
    /// Gaps before the mutation.
    pub previous_gap_refs: GapStateRefSet,
    /// P14 basis accepted by policy application, absent for non-policy local changes.
    pub accepted_policy_basis: Option<PolicyEvaluationBasis>,
    /// Local update time before the mutation.
    pub previous_updated_at: ObservedAt,
    /// Local update time after the mutation.
    pub current_updated_at: ObservedAt,
}
```

The post-mutation `ExternalAuditExportPreparation` supplies current readiness/visibility/result/failure/block/gaps. Any transition accepted by `apply_decision` requires `accepted_policy_basis=Some(exact P14 basis)`; `attach_gap`、`record_delivery`与`fail_retryable` require None and cannot borrow an earlier policy basis. Retry/reprepare deltas preserve the old retryable result/failure or block payload while the aggregate shows clearing and the new policy snapshot. PendingEvidence replacement likewise proves that old result/reasons were cleared. Permanent/rejected failure has no outgoing delta. There is no `Collecting` or `Cancelled` target.

#### 11.8.8 `ReferenceSnapshotTransition`

```rust
/// Accepted local resolution/freshness change for one reference snapshot.
pub struct ReferenceSnapshotTransition {
    /// Reference snapshot changed by this delta.
    pub snapshot_ref: ReferenceSnapshotStateRef,
    /// Immutable safe subject represented by the snapshot.
    pub subject_ref: ReferenceSubjectRef,
    /// Snapshot state before mutation.
    pub from_state: ReferenceSnapshotStateKind,
    /// Snapshot state after mutation.
    pub to_state: ReferenceSnapshotStateKind,
    /// Exact P17 maintenance basis accepted for this in-place refresh.
    pub maintenance_policy_basis: PolicyEvaluationBasis,
    /// Exact P15 freshness basis accepted for this in-place refresh.
    pub freshness_policy_basis: PolicyEvaluationBasis,
    /// Safe summary before the mutation, when usable.
    pub previous_safe_summary_ref: Option<SafeExternalSummaryRef>,
    /// Source version before the mutation, when usable.
    pub previous_source_version: Option<ObservationSourceVersionRef>,
    /// Staleness reason before the mutation, when any.
    pub previous_stale_reason: Option<ReferenceStaleReason>,
    /// Resolution reason before the mutation, when any.
    pub previous_resolution_reason: Option<ReferenceResolutionReason>,
    /// Invalidity reason before the mutation, when any.
    pub previous_invalid_reason: Option<ReferenceInvalidReason>,
    /// Local observation time before the mutation.
    pub previous_observed_at: ObservedAt,
    /// Local observation time after the mutation.
    pub current_observed_at: ObservedAt,
}
```

The post-mutation snapshot supplies the complete current summary/version/reason fields. The delta preserves every overwritten previous value and before/after state/time. `maintenance_policy_basis` and `freshness_policy_basis` must respectively equal the accepted P17 and P15 decisions after their same-target/P10 gate; neither can substitute for the other. `Resolved` current state requires summary/version; `Stale` requires stale reason; `Unresolved/Unavailable` require resolution reason; `Invalid` requires invalid reason and clears usable summary/version. Exact full replay returns `Ok(None)`. `RequireNewSnapshot` produces no old-row delta; G-batch H10 must define a distinct typed new-snapshot accepted-input branch carrying previous ref plus both bases. No `ReferenceRefreshRecordRef` appears before R06.5.

#### 11.8.9 `ProjectionMaintenanceTransition`

```rust
/// Accepted derived-projection maintenance state change.
pub struct ProjectionMaintenanceTransition {
    /// Projection maintenance state changed by this delta.
    pub maintenance_ref: ProjectionMaintenanceRef,
    /// Exact observation-side maintenance target.
    pub target_ref: MaintenanceTargetRef,
    /// Maintenance state before mutation.
    pub from_state: ProjectionMaintenanceStateKind,
    /// Maintenance state after mutation.
    pub to_state: ProjectionMaintenanceStateKind,
    /// Observation-namespace position before the mutation, when any.
    pub previous_observation_cursor: Option<ObservationCursor>,
    /// Reference-namespace position before the mutation, when any.
    pub previous_reference_cursor: Option<ReferenceCursor>,
    /// Progress identity before the mutation, when any.
    pub previous_progress_ref: Option<RebuildProgressViewRef>,
    /// Failure reason before the mutation, when any.
    pub previous_failure_reason: Option<MaintenanceFailureReason>,
    /// P17 basis accepted by start, absent for non-policy lifecycle changes.
    pub accepted_policy_basis: Option<PolicyEvaluationBasis>,
    /// Authorization mode consumed by start, when applicable.
    pub authorization_mode: Option<MaintenanceAuthorizationMode>,
    /// Effect authorized for start, when applicable.
    pub authorized_effect: Option<MaintenanceAllowedEffect>,
    /// No-write scope authorized for start, when applicable.
    pub authorization_no_write_guard_scope: Option<NoWriteGuardScope>,
    /// Local transition time before the mutation.
    pub previous_updated_at: ObservedAt,
    /// Local transition time after the mutation.
    pub current_updated_at: ObservedAt,
}
```

The post-mutation maintenance aggregate supplies both current namespace positions plus progress/failure. Only `Stale -> Rebuilding` carries `accepted_policy_basis=Some(exact P17 basis)` and all three authorization fields copied from the enclosed target-bound authorization; all four fields are None on mark-stale/complete/fail. Start's previous cursor pair proves which stale bounds were replaced, while the post-mutation aggregate contains the newly captured dual watermarks. Mark-stale from Failed preserves both old cursors plus progress/failure in the delta while the aggregate clears progress/failure. `Fresh` requires every target-required completed namespace position; `Failed` requires current failure reason. Time and each namespace cursor cannot regress. The delta changes only derived maintenance truth.

#### 11.8.10 `ReplayCoordinationTransition`

```rust
/// Accepted state change for one approved replay coordination execution.
pub struct ReplayCoordinationTransition {
    /// Replay coordination execution changed by this delta.
    pub coordination_ref: ReplayCoordinationRef,
    /// Approved immutable replay scope bound to the execution.
    pub scope_ref: ReplayScopeRef,
    /// Exact maintenance target coordinated by this execution.
    pub target_ref: MaintenanceTargetRef,
    /// Coordination state before mutation.
    pub from_state: ReplayCoordinationKind,
    /// Coordination state after mutation.
    pub to_state: ReplayCoordinationKind,
    /// No-write violation before the mutation, when any.
    pub previous_no_write_violation_ref: Option<NoWriteViolationRef>,
    /// Replay block reason before the mutation, when any.
    pub previous_block_reason: Option<ReplayBlockReason>,
    /// Failure reason before the mutation, when any.
    pub previous_failure_reason: Option<MaintenanceFailureReason>,
    /// P18 basis accepted by Start or Blocked, absent after actual execution work.
    pub accepted_policy_basis: Option<PolicyEvaluationBasis>,
    /// Authorization mode consumed by start, when applicable.
    pub authorization_mode: Option<MaintenanceAuthorizationMode>,
    /// Effect authorized for start, when applicable.
    pub authorized_effect: Option<MaintenanceAllowedEffect>,
    /// No-write scope authorized for start, when applicable.
    pub authorization_no_write_guard_scope: Option<NoWriteGuardScope>,
    /// Exact observation-owned/derived objects changed on completion.
    pub changed_refs: AffectedObservationObjectRefSet,
    /// Local transition time before the mutation.
    pub previous_updated_at: ObservedAt,
    /// Local transition time after the mutation.
    pub current_updated_at: ObservedAt,
}
```

The post-mutation coordination aggregate supplies its immutable scope/target/guard and current violation/block/failure. P18 Start and P18 Blocked both require `accepted_policy_basis=Some(exact P18 basis)`; only Start additionally carries ApprovedReplay authorization mode/effect/no-write scope, and both carry an empty changed set. Completion/fail require basis None because they consume actual execution results, not P18; completion carries either an empty explicit no-change set or the singleton exact stored target object and no authorization fields. P18 Blocked always has no current violation ref because P18 has no formal violation identity source; a future independent violation attachment needs another transition path. `Failed` requires current failure reason; `Completed` carries neither block nor failure and means observation-side coordination only. No execution-record or job-run identity appears here.

#### 11.8.11 `RollupRebuildTransition`

```rust
/// Accepted state change for one derived signal-rollup rebuild attempt.
pub struct RollupRebuildTransition {
    /// Rollup rebuild attempt changed by this delta.
    pub rebuild_ref: RollupRebuildRef,
    /// Signal-rollup window rebuilt by the attempt.
    pub window_ref: SignalRollupWindowRef,
    /// Exact observation-side maintenance target.
    pub target_ref: MaintenanceTargetRef,
    /// Rebuild state before mutation.
    pub from_state: RollupRebuildKind,
    /// Rebuild state after mutation.
    pub to_state: RollupRebuildKind,
    /// Captured safe-signal cursor before the mutation, when any.
    pub previous_source_cursor: Option<ObservationCursor>,
    /// Rebuilt count before the mutation, when any.
    pub previous_rebuilt_count: Option<SignalCount>,
    /// Progress identity before the mutation, when any.
    pub previous_progress_ref: Option<RebuildProgressViewRef>,
    /// Failure reason before the mutation, when any.
    pub previous_failure_reason: Option<MaintenanceFailureReason>,
    /// P17 basis accepted by start, absent for complete/fail transitions.
    pub accepted_policy_basis: Option<PolicyEvaluationBasis>,
    /// Authorization mode consumed by start, when applicable.
    pub authorization_mode: Option<MaintenanceAuthorizationMode>,
    /// Effect authorized for start, when applicable.
    pub authorized_effect: Option<MaintenanceAllowedEffect>,
    /// No-write scope authorized for start, when applicable.
    pub authorization_no_write_guard_scope: Option<NoWriteGuardScope>,
    /// Local transition time before the mutation.
    pub previous_updated_at: ObservedAt,
    /// Local transition time after the mutation.
    pub current_updated_at: ObservedAt,
}
```

The post-mutation rebuild aggregate supplies current cursor/count/progress/failure. Only start carries `accepted_policy_basis=Some(exact P17 basis)` plus all authorization fields; complete/fail carry None for all four. Start preserves the factory-captured cursor and replaces progress/count/failure as specified by the member contract. `Running` requires current progress identity; `Completed` requires current committed cursor/count; `Failed` requires current failure reason and no rebuilt count. Time/cursor cannot regress. `Cancelled` is reserved and has no current delta. Only saved `SafeSignal` facts may contribute to count/cursor.

#### 11.8.12 common delta gate

Every delta factory rejects an incompatible payload matrix before mutation. State-preserving operations are allowed only for documented attachments or policy-snapshot replacements and must contain a newly accepted ref or a changed, target-bound policy basis; exact duplicates return typed no-op and no delta. Rejected operations, including invalid `DiagnosticScope` construction/replacement, never emit a delta.

R06.5/application must consume a successful delta in the mutation UoW or discard it when that UoW rolls back. Record construction requires all three inputs: `(1)` the successful delta as proof of the accepted operation, historical before/change payload and exact accepted policy basis when the mutation was policy-driven, `(2)` the same-UoW post-mutation aggregate snapshot for immutable relations and complete after-state conditional fields, and `(3)` typed record metadata such as record identity, actor, accepted time and trace/causation fields required by that record schema. The factory cross-validates subject identity and after-state across the three inputs. Optional basis fields obey each transition's total branch matrix; a non-policy transition cannot borrow current/previous policy state, and a policy-driven branch cannot omit basis. The factory must not serialize the delta directly, replay policy, guess omitted fields, or reconstruct a historical record from current aggregate truth alone.

## 12. `contracts::views` R06.4 public view contracts

### 12.1 common assembly and body rules

| rule | contract |
|---|---|
| owner | all six schemas belong to `contracts::views`; contracts never imports domain |
| assembler | application loads committed domain/reference/maintenance state and calls `from_fields`; infra only maps stored rows |
| identity | generated typed ref is stable across replacement; `GapStatusView` reuses `GapStateRef`; `ReferenceSnapshotView` reuses `ReferenceSnapshotStateRef` |
| freshness | always copied from persisted `ObservationProjectionFreshnessSurface`; Query cannot mark Fresh or trigger rebuild |
| visibility | Visible/Restricted may carry body; limited Degraded may carry reduced body; NotVisible/Blocked/blocked Degraded require outer wrapper `body=None` |
| body-free | no raw log/metric/trace/audit/evidence/provider body, locator, credential, profile, final verdict, signoff or real run id |
| mutation | view has inspection methods only; no repository access, domain transition, refresh or maintenance method |

### 12.2 `ObservationReadModel`

```rust
/// Canonical body-free read model assembled from committed observation-owned facts.
pub struct ObservationReadModel {
    /// Stable generated projection identity.
    pub read_model_ref: ObservationReadModelRef,

    /// Stable freshness marker identity preserved across replacements.
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,

    /// Canonical lookup scope for this read model.
    pub scope: ObservationProjectionScope,

    /// Observation receipt facts represented by this view.
    pub receipt_refs: ObservationReceiptRefSet,

    /// Safe signal facts represented by this view.
    pub signal_refs: SafeSignalRefSet,

    /// Audit projection facts represented by this view.
    pub audit_projection_refs: AuditProjectionRefSet,

    /// Consumer-safe visibility of the body.
    pub visibility: VisibilitySurface,

    /// Persisted freshness of this projection replacement.
    pub freshness: ObservationProjectionFreshnessSurface,

    /// Consistent committed cursor used by the assembler.
    pub as_of_cursor: Option<ObservationCommittedCursor>,
}
```

| field | assembly source | invariant |
|---|---|---|
| identities/scope | projection index and persisted row | view ref/marker stable; scope cannot mint identity |
| receipt/signal/audit sets | one consistent repository snapshot | canonical bounded sets; cross-scope members rejected |
| visibility | loaded read policy result | body-present matrix from §12.1 |
| freshness | persisted marker | marker in stale/rebuilding surface must equal `freshness_marker_ref` |
| cursor | same snapshot | non-empty constituent sets require a committed cursor |

Factory: `from_fields(read_model_ref, freshness_marker_ref, scope, receipt_refs, signal_refs, audit_projection_refs, visibility, freshness, as_of_cursor) -> Result<Self, ProtocolError>`. Inspection methods: `identity`, `is_empty`, `is_fresh`, `contains_signal`. Empty visible body is allowed only when the selected scope is known and the wrapper explicitly represents an empty local result; it does not prove source truth has no facts.

### 12.3 `DiagnosticView`

```rust
/// Explain-only diagnostic projection over one immutable diagnostic summary.
pub struct DiagnosticView {
    /// Stable generated projection identity.
    pub view_ref: DiagnosticViewRef,

    /// Stable freshness marker identity.
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,

    /// Canonical projection scope used for lookup.
    pub scope: ObservationProjectionScope,

    /// Immutable diagnostic summary represented by this view.
    pub diagnostic_summary_ref: DiagnosticSummaryRef,

    /// Diagnostic scope represented by the summary.
    pub diagnostic_scope_ref: DiagnosticScopeRef,

    /// Freshness copied from the diagnostic summary.
    pub diagnostic_freshness: DiagnosticFreshnessState,

    /// Typed stale reason copied from the summary, when applicable.
    pub staleness_reason: Option<StalenessReason>,

    /// Typed unavailable reason copied from the summary, when applicable.
    pub unavailable_reason: Option<DiagnosticUnavailableReason>,

    /// Projection freshness copied from the persisted marker.
    pub freshness: ObservationProjectionFreshnessSurface,

    /// Consumer-safe visibility.
    pub visibility: VisibilitySurface,

    /// Explicit gaps explaining partial, stale or unavailable output.
    pub gap_refs: GapStateRefSet,

    /// No-write violations included in the explanation.
    pub no_write_violation_refs: NoWriteViolationRefSet,
}
```

Factory `from_fields(...) -> Result<Self, ProtocolError>` verifies summary/scope/freshness/reason/gap combinations: `Fresh/Partial` have no stale/unavailable reason;`Stale` requires only `staleness_reason`;`Unavailable` requires only `unavailable_reason` and cannot expose a normal visible body. `Fresh` cannot carry an open blocking gap;`Partial` requires a gap or explicit limited degraded surface. One-shot `DiagnosticRequestContextRef` is deliberately absent and never persisted in the projection.

### 12.4 `GapStatusView`

```rust
/// Public body-free state of one explicit observation gap.
pub struct GapStatusView {
    /// Gap identity and canonical public view identity.
    pub gap_ref: GapStateRef,

    /// Stable freshness marker for the projection body.
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,

    /// Body-free source explaining the gap.
    pub source_ref: GapSourceRef,

    /// Gap classification.
    pub gap_kind: GapKind,

    /// Gap lifecycle.
    pub state: GapLifecycleState,

    /// Observation-side object affected by the gap.
    pub affected_object_ref: AffectedObservationObjectRef,

    /// Degraded output linked to the gap, when any.
    pub degraded_ref: Option<DegradedOutputRef>,

    /// Consumer-safe visibility of this gap body.
    pub visibility: VisibilitySurface,

    /// Persisted projection freshness.
    pub freshness: ObservationProjectionFreshnessSurface,

    /// Last local projection replacement time.
    pub last_updated_at: ObservedAt,
}
```

Factory verifies source/kind/affected compatibility, lifecycle/degraded relation and visibility. `Resolved` remains visible in history queries; `Suppressed` does not mean resolved. No separate `GapStatusViewRef` is generated.

### 12.5 `DashboardAlertExportView`

```rust
/// Product-neutral read-only surface for dashboard, alert, analysis and export consumers.
pub struct DashboardAlertExportView {
    /// Stable generated projection identity.
    pub view_ref: DashboardAlertExportViewRef,

    /// Stable freshness marker identity.
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,

    /// Structured peripheral consumer boundary.
    pub consumer_ref: PeripheralConsumerRef,

    /// Canonical observation scope paired with the consumer.
    pub scope: ObservationProjectionScope,

    /// Read model used to assemble this peripheral surface.
    pub read_model_ref: ObservationReadModelRef,

    /// Optional explain-only diagnostic projection.
    pub diagnostic_view_ref: Option<DiagnosticViewRef>,

    /// Optional gap-status identity, which is the gap identity itself.
    pub gap_ref: Option<GapStateRef>,

    /// Consumer-safe visibility and suppression result.
    pub visibility: VisibilitySurface,

    /// Persisted projection freshness.
    pub freshness: ObservationProjectionFreshnessSurface,
}
```

Factory requires consumer state/scope/export flag compatibility supplied by the application assembler. The view contains no product name, endpoint, destination, credential or provider state. A delivery result cannot mutate this view or its underlying read model.

### 12.6 `ReferenceSnapshotView`

```rust
/// Public body-free view of one local reference snapshot state.
pub struct ReferenceSnapshotView {
    /// Snapshot-state identity and canonical view identity.
    pub snapshot_ref: ReferenceSnapshotStateRef,

    /// Stable freshness marker identity.
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,

    /// Safe reference subject represented by the snapshot.
    pub subject_ref: ReferenceSubjectRef,

    /// Current local reference state.
    pub state: ReferenceSnapshotStateKind,

    /// Safe summary available for a resolved or stale snapshot.
    pub safe_summary_ref: Option<SafeExternalSummaryRef>,

    /// Source version associated with the safe summary.
    pub source_version: Option<ObservationSourceVersionRef>,

    /// Explicit gaps associated with the snapshot.
    pub gap_refs: GapStateRefSet,

    /// Consumer-safe visibility.
    pub visibility: VisibilitySurface,

    /// Persisted projection freshness.
    pub freshness: ObservationProjectionFreshnessSurface,
}
```

Factory requires `Resolved` to have summary + source version; `Stale` may retain the last known summary/version with an explicit stale projection surface; `Pending/Unresolved/Invalid/Unavailable` cannot expose a normal visible summary body. `state` is the exact per-snapshot resolution/freshness value; the assembler must not derive an aggregate counter for this single-object response. It never uses historical `ReferenceSnapshotRef`.

### 12.7 `MaintenanceProgressSummary`

```rust
/// Body-free summary of one derived maintenance or replay execution.
pub struct MaintenanceProgressSummary {
    /// Total number of target items captured by the immutable plan.
    pub total_items: u32,

    /// Number of items completed inside the observation boundary.
    pub completed_items: u32,

    /// Number of items that failed or were blocked.
    pub failed_items: u32,

    /// Observation-namespace position reached by the current progress, when applicable.
    pub observation_cursor: Option<ObservationCursor>,

    /// Reference-namespace position reached by the current progress, when applicable.
    pub reference_cursor: Option<ReferenceCursor>,

    /// Body-free refs explaining failed or blocked target items.
    pub failed_refs: BodyFreeRefSet,
}
```

Factory `try_new(total_items, completed_items, failed_items, observation_cursor, reference_cursor, failed_refs) -> Result<Self, ProtocolError>` enforces `completed + failed <= total`, failed count/ref consistency, bounded counts and target-dependency-compatible dual watermarks. A required namespace cannot be None on Running/Completed progress, a non-required namespace must remain None, and the two values are never compared or collapsed into a global cursor. The summary has no percentage float, external run id, verdict or source-repair claim.

### 12.8 historical `ReferenceFreshnessSummary`

`ReferenceFreshnessSummary` 是旧多 snapshot 聚合 shape，不生成 current Rust type。current protocol 的 `GetReferenceSnapshotView` 返回一个 `ReferenceSnapshotView`，其 `state` 已无损表达该 snapshot 的 `Pending/Resolved/Stale/Unresolved/Invalid/Unavailable`；再附加六个聚合计数会要求 query 扩大读取范围，并产生没有 canonical scope、page boundary 或一致性 cursor 的第二份 freshness truth。

若未来新增 reference inventory / statistics 协议，必须先独立定义查询 scope、分页或完整 snapshot boundary、consistent cursor 和 visibility 聚合规则，再建立新的具名 aggregate view。不得把该 historical 名称塞回单 snapshot 响应，也不得将 `Pending` 折叠成 `Unavailable`。

### 12.9 `ObservationRebuildSurface`

```rust
/// Public body-free state of derived observation rebuild progress.
pub enum ObservationRebuildSurface {
    /// Work is queued but has not started.
    Queued,

    /// Work is running with a body-free progress summary.
    Running(MaintenanceProgressSummary),

    /// Work completed for the captured observation-side target.
    Completed(MaintenanceProgressSummary),

    /// Work failed with a body-free progress summary.
    Failed(MaintenanceProgressSummary),

    /// Work is blocked by replay, retention or no-write boundary.
    Blocked {
        /// Typed block reason.
        reason: MaintenanceBlockReason,
        /// Body-free progress at the block point.
        progress: MaintenanceProgressSummary,
    },
}
```

`Completed` means derived target completion only. It cannot be mapped to source repair, final acceptance or external execution success.

### 12.10 `RebuildProgressView`

```rust
/// Public progress projection for derived maintenance and replay coordination.
pub struct RebuildProgressView {
    /// Stable generated progress projection identity.
    pub progress_ref: RebuildProgressViewRef,

    /// Stable freshness marker identity.
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,

    /// Structured maintenance target.
    pub target_ref: MaintenanceTargetRef,

    /// Projection maintenance identity, when this is a projection rebuild.
    pub maintenance_ref: Option<ProjectionMaintenanceRef>,

    /// Replay coordination identity, when replay-driven.
    pub replay_coordination_ref: Option<ReplayCoordinationRef>,

    /// Rollup rebuild identity, when rollup-driven.
    pub rollup_rebuild_ref: Option<RollupRebuildRef>,

    /// Current body-free rebuild progress.
    pub rebuild: ObservationRebuildSurface,

    /// Persisted projection freshness.
    pub freshness: ObservationProjectionFreshnessSurface,

    /// Last local projection replacement time.
    pub updated_at: ObservedAt,
}
```

Factory validates target kind against exactly one applicable maintenance/replay/rollup identity; incompatible multiple identities are rejected. `Queued/Running/Completed/Failed/Blocked` must match the loaded state object. No external run id or evidence alias is present.

### 12.11 contracts views module stop review

| check | result | evidence / boundary |
|---|---|---|
| contracts depends on domain | pass_no | all fields are contracts/core types |
| view identity and replacement | pass | stable typed refs/marker; Gap/Reference reuse canonical truth identity |
| visibility/body matrix | pass | §12.1 and each factory |
| query mutation | pass_no_write | inspection-only factories/members |
| raw body/product leakage | pass_none | body-free refs/summary/surface only |
| historical aliases | pass_removed | no `ReferenceSnapshotRef`, no view-id aliases, no generic HandoffSurface |

## 13. R06.4 字段来源与构造闭环审计

### 13.1 definition owner 终检

| 对象组 | 唯一 definition owner | mutation / assembly owner | 禁止的第二 owner |
|---|---|---|---|
| public ref、state、reason、scope、result、set、surface、view | `observability-contracts::{refs,metadata,scopes,surfaces,views}` | contracts factory只校验public shape；application组装view | domain同名enum、Step08重复view schema、infra mapper补默认 |
| handoff / retention / replay / no-write current object | `observability-domain::{handoff,retention,replay,no_write}` | owning factory/member | policy直接改字段、record replay替代aggregate validation |
| read / diagnostic / gap object | `observability-domain::{read,diagnostic,gap}` | target-bound decision + owning member；Query assembler只读 | Query handler写projection、contracts view推进domain state |
| peripheral / reference / maintenance object | `observability-domain::{peripheral,reference,maintenance}` | owning member消费adapter result或policy authorization | adapter response直接写state、job report成为state owner |
| target-bound decision / authorization | owning domain module；exact producer在R06.5 policy | loaded exact-version snapshot -> private constructor -> same-target member | entry/config/public DTO构造，跨target/version复用 |
| transition delta | owning domain module | owning member完成全量校验后返回successful change proof | contracts、repository或调用方struct literal构造；失败路径生成delta |
| append-only record / DomainError | R06.5 `domain::{records,errors}` | record factory在accepted UoW内消费successful delta + same-UoW post-mutation aggregate snapshot + typed record metadata | 本批对象制造record ref、actor/time/trace；仅凭delta或current truth组装history；factory重放policy/猜字段 |

本批出现的 `domain::policies` 是逻辑 owner 名称，不形成一个可绕过业务模块的反向依赖。R06.5 必须把 policy 放入对应 domain module，或由无状态 `domain::policies` 仅依赖 domain object snapshot；任何方案都不得让 `contracts` 依赖 `domain`。

Delta-to-record 的三输入规则不是要求 delta 复制完整 aggregate。Delta 固定历史上的 accepted operation 与 before/change payload；post-mutation snapshot 补齐 immutable relation 与完整 after-state；record metadata 提供 record identity、actor、accepted time、trace/causation 等审计字段。三者 subject/target/after-state 任一不一致均返回 typed error，并使 aggregate save、record append 与后续 outbox snapshot 在同一 UoW 回滚。

### 13.2 boundary truth object 必填字段来源

| 对象 | identity来源 | relation / immutable input | 初始 state 与条件字段 | mutable字段唯一来源 | 缺失 / 冲突处理 |
|---|---|---|---|---|---|
| `ReportHandoffRecord` | application id generator | loaded handoff scope、non-retired consumer、same-UoW saved immutable evidence input | `Draft/PendingEvidence`;sets empty；policy/delivery/reason fields None | exact `HandoffReadinessDecision`、same-handoff hint、finite delivery result、owning block member | input未保存、target mismatch或payload matrix错误时zero mutation；无record/outbox |
| `AuthenticityHint` | application id generator | loaded handoff identity | `Unassessed`;origin/reasons None；gaps empty | P6 `AuthenticityHintDecision` + owning `apply_decision`消费complete handoff/input/linkage/origin/gap snapshots | 缺少对象或snapshot冲突zero mutation；Insufficient changed snapshot可同态更新；exact replay None；terminal重评建立新hint |
| `RetentionMarker` | application id generator | validated observation-owned protected ref + typed purpose | `Unmarked`;relations/reasons None | exact `RetentionMarkerDecision` + owning archive-hint attachment | reason-only release、snapshot/protection mismatch或Released重开均拒绝；不cleanup |
| `ActiveReferenceProtection` | application id generator | validated protected ref + reason | `Unprotected`;active consumer set empty；reasons None | owning attach + exact-version decision that binds observed set and revalidated active subset | non-empty active subset不得expire/release；stale observed set、non-subset或identity mutation拒绝 |
| `ReplayScope` | application id generator | canonical non-empty target set + effect + no-write scope | `Defined`;block/close reasons None | owning narrow、target-bound approval、typed block/close | effect/target/guard mismatch不创建；terminal scope不重开 |
| `NoWriteViolation` | application id generator | typed trigger context + forbidden source/external target | `Detected`;reasons None | owning block/escalate/close | attempted adapter call必须仍为zero；Closed重开建立新violation |
| `ReadVisibilityState` | policy/application one-shot id | exact request context + visibility scope | complete target-bound decision shape | owning restrict/block/not-visible；Query可保持process-local | bare kind、跨request decision、reason/gap matrix错误拒绝 |
| `DiagnosticScope` | application id generator / canonical lookup | projection scope + bounded non-empty targets + time window + visibility scope | successful construction is the only defined state | accepted maintenance replacement only | query不得replace；invalid input返回携带`DiagnosticScopeInvalidReason`的typed error，zero mutation / zero delta |
| `DiagnosticRequestContext` | trusted entry one-shot id | safe actor + read purpose + exact loaded scopes + metadata time | immutable value object | none | scope mismatch拒绝；同步Query不持久化context body |
| `DiagnosticSummary` | each revision uses application id generator | loaded `DiagnosticScope` + `DiagnosticRequestContext` + one consistent committed set of loaded signal/gap/violation objects | factory derives validated Fresh/Stale/Partial/Unavailable + exact reason/set/cursor matrix | static immutable replacement factory returns new revision + complete before/change delta | Query不得mutation；ref不在scope exact member set、cursor/time regression、duplicate replacement或CAS conflict时不产生新head/history |
| `GapState` | application id generator / canonical gap key | typed source + kind + affected object + open time | `Open`;degraded/close fields None | owning acknowledge/mitigate/close | resolution必须有local typed basis/time；不声明source repair |
| `DegradedOutputState` | each revision uses application id generator | complete `DegradedSurface` + loaded safety/read visibility + optional exact gap | private policy factory yields `None/Active/Blocked` complete conditional matrix | static immutable policy replacement returns new revision + complete before/change delta | public surface不能直构domain truth；mapping不全、gap/scope mismatch、duplicate output时拒绝或`Ok(None)`；不得删除 owning gap |
| `PeripheralDeliveryState` | application attempt id | saved preparation + consumer + public view | `Pending`;visibility/result/reasons None；gaps empty | exact delivery decision、finite adapter result、owning block | missing preparation、identity mismatch或reason/result matrix错误zero mutation |
| `ExternalAuditExportPreparation` | application attempt id | non-retired consumer + saved evidence input + public view | `Draft/PendingEvidence`;visibility/result/reasons None；gaps empty | exact export decision、gap attachment、finite delivery result | 不读取locator/credential；blocked/failed不是external audit conclusion |
| `ReferenceSnapshotState` | application id generator / canonical subject lookup | body-free `ReferenceSubjectRef` | `Pending`;summary/version/reasons None | finite `ReferenceRefreshResult`或owning stale/unresolved/invalid member | summary/version不成对拒绝；Invalid恢复必须新snapshot identity |
| `ProjectionMaintenanceState` | application id generator / target lookup | validated derived `MaintenanceTargetRef` | missing projection factory为`Stale`;both namespace positions None | target-bound authorization + explicit dual-watermark capture + progress/cursor/failure members | source/external target、effect mismatch、missing required namespace、cross-namespace substitution/regression或incomplete member replacement拒绝 |
| `ReplayCoordinationState` | application execution id | loaded Approved replay scope + exact in-scope `MaintenanceTargetRef` + exact no-write guard | `Pending`;violation/reasons None | same-target ApprovedReplay authorization + owning block/complete/fail | 未Approved、target不在scope、scope/target/effect/guard mismatch或重复执行拒绝；新attempt新identity |
| `RollupRebuildState` | application execution id | saved rollup window + matching target + captured safe-signal cursor | `Pending`;result/progress/failure None | matching authorization + committed count/cursor + owning failure | raw metric/trace input、target mismatch或cursor regression拒绝 |

### 13.3 public view 构造闭环

| view | 构造所需正式来源 | identity / lookup | visibility / freshness / state规则 | 实现侧暂停条件 |
|---|---|---|---|---|
| `ObservationReadModel` | one consistent snapshot of saved receipt/signal/audit refs + persisted marker + read policy result | `(projection kind,ObservationProjectionScope)` lookup；view/marker ref replacement稳定 | outer visibility决定body；freshness直接复制marker；非空成员要求committed cursor | cross-scope member、marker mismatch、caller要求refresh/rebuild |
| `DiagnosticView` | saved diagnostic scope + immutable summary + persisted marker + read policy result | canonical projection scope lookup；view/scope/marker稳定，summary ref随replacement更新 | diagnostic state/reasons从summary逐字段复制；projection freshness独立；Unavailable无normal body | summary/scope/ref/reason不匹配，Rebuilding target chain缺失 |
| `GapStatusView` | saved gap + optional same-gap degraded sidecar + persisted marker + read policy result | identity复用`GapStateRef`；marker稳定 | Resolved仍可见；Suppressed不等于Resolved；NotVisible/Blocked无body | degraded不指向该gap、close字段矩阵错误、Query试图close gap |
| `DashboardAlertExportView` | loaded non-retired peripheral consumer + read model + optional diagnostic/gap + marker | `(consumer,ObservationProjectionScope)` canonical lookup；view/marker稳定 | consumer capability、visibility和freshness均由loaded snapshot提供；delivery不反写view | product/endpoint/credential进入view，consumer/view/scope mismatch |
| `ReferenceSnapshotView` | saved snapshot + persisted marker + associated gaps + read policy result | identity复用`ReferenceSnapshotStateRef`；marker稳定 | state/summary/version逐字段复制；单项view不生成aggregate freshness counts | Invalid仍带summary、Resolved缺version、historical snapshot ref/summary count出现 |
| `RebuildProgressView` | exactly one loaded maintenance/replay/rollup state + target + stored progress summary + marker | `(projection kind,target)` lookup；progress/marker ref稳定 | state到surface total mapping；Completed只表示captured derived target | 多个owner ref同时Some、target mismatch、external run id/evidence alias出现 |

### 13.4 rehydration 与字段写入规则

1. 每个 persisted domain object/revision 提供 repository-only `try_rehydrate(all persisted fields) -> Result<Self, DomainError>`，执行与factory/member结果相同的identity、relation、state/optional-field矩阵；mapper不得使用unchecked struct literal。`DiagnosticSummary`/`DegradedOutputState` revision rehydrate不加载或重跑policy，只校验已存完整shape。
2. `try_rehydrate` 不重放policy、不调用resolver、不重新读取current config、不生成transition/record/outbox，也不把旧snapshot按current rule自动修复。invalid persisted row返回consistency/domain error并停止该对象的业务使用。
3. target-bound decision、authorization、transition delta和`DiagnosticRequestContext`是process-local对象，不提供repository rehydration。需要审计的稳定事实由R06.5 record或R06.6 operation/stored-result对象承接，不能把临时delta直接序列化。
4. contracts ref/value/view decode必须重跑其public factory validation；wire payload不能构造无reason的Blocked、带body的NotVisible、Resolved-without-version或Fresh-with-stale-marker。
5. mutable aggregate member先校验expected state、target/version、全部optional payload和checked set/count/cursor，再一次性替换字段并返回delta；immutable revision factory先完成全部校验，再同时返回new revision + delta。任何错误保持原对象/head逐字段不变。
6. `ProtocolError`只表达contracts decode/factory shape；`DomainError`表达对象state/target/relation/policy结果不变量；repository/provider/transport error保持在application/infra owner，禁止塞入free-text reason。
7. record factory读取member返回的successful delta与同一UoW内变更后的aggregate snapshot，再注入typed record metadata；不得重放policy、从current truth倒推before-state、从错误文本猜reason，或让record append与aggregate save分属可独立提交的事务。

### 13.5 state / conditional-field compatibility

| 对象 | state | 必须字段 | 必须为空 / 禁止组合 |
|---|---|---|---|
| handoff | `Draft/PendingEvidence` | immutable input identities | delivery/block reason None；visibility may be None；gaps may explain pending input |
| handoff | `Draft/Ready` or `Draft/Degraded` | complete policy snapshot + allowed visibility | delivery/block reason None；prepare尚未被调用 |
| handoff | `Draft/Blocked` | block reason + no-write policy snapshot；gap/blocked visibility按reason需要 | delivery result None；不能prepare |
| handoff | `Prepared/Ready` or `Prepared/Degraded` | latest complete policy snapshot + allowed visibility | delivery/block reason None；`Failed -> Prepared`已清除旧delivery result/block reason并覆盖visibility/gaps/retention/no-write snapshot |
| handoff | `Delivered` | `HandoffDeliveryResult::Delivered` + prior allowed policy snapshot | block reason None；不携带signoff/verdict |
| handoff | `Failed/Blocked` | policy block reason | delivery result None |
| handoff | `Failed/Ready` or `Failed/Degraded` | non-delivered delivery result + prior allowed policy snapshot | block reason None；only `RetryableFailure` may reprepare after重新evaluate，PermanentFailure/Rejected terminal |
| authenticity | `Unassessed` | handoff ref + evaluated time | origin/reasons None；gaps empty |
| authenticity | `RealEvidenceLinked` | `TrustedBoundary` origin | placeholder/insufficient reason None |
| authenticity | `PlaceholderDetected` | origin Placeholder + placeholder reason | insufficient reason None |
| authenticity | `Insufficient` | `AuthenticityGapReason`;OpenObservationGap另需non-empty gaps | trusted origin/placeholder reason None |
| retention marker | `Unmarked/ActiveHold` | protected ref + purpose；ActiveHold需compatible protection | release/conflict reason None |
| retention marker | `ReleaseEligible/Conflict` | respective release/conflict reason | opposite reason absent；Released不可rehydrate为current callable output |
| active protection | `Unprotected` | empty active consumers | release/conflict reason None |
| active protection | `Protected` | non-empty active consumers | release/conflict reason None |
| active protection | `Expired/Released` | empty active consumers + release reason | conflict reason None；Released terminal |
| active protection | `Conflicted` | conflict reason | active set may be non-empty；exact set must equal last accepted revalidation and cannot be ignored |
| replay scope | `Defined/Approved` | non-empty targets + effect + guard | block/close reason None |
| replay scope | `Blocked` | block reason | close reason None；terminal |
| replay scope | `Completed/Cancelled` | close reason | block reason None；terminal |
| no-write violation | `Detected/Blocked` | forbidden target + trigger context | escalation/close reason None |
| no-write violation | `Escalated/Closed` | respective escalation/close reason | opposite reason absent；Closed terminal |
| diagnostic summary | `Fresh/Partial` | exact sets/cursor matrix | stale/unavailable reason None；Fresh无blocking gap |
| diagnostic summary | `Stale/Unavailable` | respective typed reason | opposite reason absent；Unavailable不得normal visible body |
| degraded output | `None` | downstream-eligible safety + `Visible/Restricted` visibility scope | reason/block/gap absent；limited false |
| degraded output | `Active` | complete limited `DegradedSurface` + reason + visibility scope；reason要求gap时需exact gap | block reason absent；limited true |
| degraded output | `Blocked` | complete blocked `DegradedSurface` + reason + typed block reason + visibility scope；required gap按reason存在 | limited false；不得normal body；revision不可原地恢复None |
| gap | `Open/Acknowledged` | source/kind/affected/open time | close reason/time None；degraded optional only when exact same gap |
| gap | `Resolved` | close reason + close time | close time不早于open；source-repaired claim禁止 |
| reference snapshot | `Pending` | subject + observed time | summary/version/reasons None |
| reference snapshot | `Resolved` | summary + source version | all reasons None |
| reference snapshot | `Stale` | stale reason；last summary/version both Some or both None | resolution/invalid reason None |
| reference snapshot | `Unresolved/Unavailable` | resolution reason | summary/version None；stale/invalid reason None |
| reference snapshot | `Invalid` | invalid reason | summary/version/stale/resolution reason None；terminal |
| projection maintenance | `Stale` | target；observation/reference stale upper positions按依赖可选 | progress/failure None |
| projection maintenance | `Rebuilding` | progress ref + every required captured namespace position | failure None；non-required namespace remains None |
| projection maintenance | `Fresh/Failed` | Fresh需每个required namespace completed position；Failed需failure reason | progress只保留same-target execution identity；mark-stale必须清除progress/failure |
| replay coordination | `Pending/Coordinating` | approved scope + exact maintenance target + guard | violation/block/failure None；Coordinating已消费same-target authorization |
| replay coordination | `Blocked/Failed/Completed` | Blocked需block reason；Failed需failure；Completed无reason且changed set只能empty或exact target singleton | terminal execution不能重新Coordinating |
| rollup rebuild | `Pending/Running` | target/window/captured cursor；Running另需progress | count/failure None |
| rollup rebuild | `Completed/Failed` | Completed需non-regressing count+cursor；Failed需failure且count None | progress保持same-target execution identity；terminal attempt不能重新Running |
| peripheral delivery | `Pending` | immutable preparation/consumer/view identities | visibility/result/reasons None；gaps empty |
| peripheral delivery | `Prepared` | latest allowed decision visibility + gap snapshot | result/block/failure None；`Failed/Blocked -> Prepared`已清除旧字段并覆盖policy snapshot |
| peripheral delivery | `Delivered` | `PeripheralDeliveryResult::Delivered` + prepared visibility/gaps | block/failure None；不表示consumer acceptance |
| peripheral delivery | `Blocked` | latest disallowed decision visibility/gaps + block reason | result/failure None；不得调用adapter |
| peripheral delivery | `Failed` | non-delivered adapter result + failure reason + prior prepared visibility/gaps | block reason None；only `RetryableFailure` may reprepare，PermanentFailure/Rejected terminal |
| export preparation | `Draft/PendingEvidence` | immutable consumer/input/view identities | visibility/delivery/failure/block None；gaps only explain pending evidence |
| export preparation | `Prepared/Ready` or `Prepared/Degraded` | latest decision visibility + gap snapshot | delivery/failure/block None；`Failed/Blocked -> Prepared`已清除旧字段并覆盖readiness/visibility/gaps |
| export preparation | `Delivered` | `PeripheralDeliveryResult::Delivered` + prior prepared policy snapshot | failure/block None；不表示external audit acceptance |
| export preparation | `Blocked` | latest blocked decision visibility/gaps + block reason | delivery/failure None；不得调用adapter |
| export preparation | `Failed` | failure reason + prior policy snapshot；delivery-originated failure另需non-delivered result | block reason None；preparation-originated failure的delivery result为None；only retryable reason/result may reprepare |

`Cancelled` 仅在 peripheral enum 中保留reserved value，current mapper若读到该值必须返回`DomainError::ReservedTransition`并停止使用该row，不能把未知future/historical schema静默当作current对象，也不能由current member生成。Export preparation没有`Cancelled` variant。

## 14. R06.4 状态与跨对象闭环审计

### 14.1 lifecycle owner 与 current callable source

| 状态主语 | 初始态 | current callable迁移 | terminal / reserved | exact trigger owner |
|---|---|---|---|---|
| report handoff | Draft/PendingEvidence | apply readiness、prepare、deliver/fail、block、attach hint | Delivered/permanent-or-rejected Failed terminal；retryable/policy-blocked Failed可经新decision重开；Cancelled reserved | `ReportHandoffRecord` |
| authenticity hint | Unassessed | `apply_decision` -> real/placeholder/insufficient；Insufficient可接受changed snapshot | real/placeholder terminal；exact replay None；new hint for terminal reevaluation | `AuthenticityHint` + P6 target-bound decision |
| retention marker | Unmarked | hold、release candidate、conflict、archive hint | Released reserved/terminal | `RetentionMarker` |
| active protection | Unprotected | attach、conflict、expire、release | Released terminal | `ActiveReferenceProtection` + target-bound decision |
| replay scope | Defined | narrow、approve、block、complete/cancel | Blocked/Completed/Cancelled terminal | `ReplayScope` + approval snapshot |
| no-write violation | Detected | block、escalate、close | Closed terminal | `NoWriteViolation` |
| read visibility | decision-provided kind | restrict、not-visible、block | request-scoped；no persistent terminal | `ReadVisibilityState` |
| diagnostic summary | consistent snapshot factory | immutable with-signal/gap/violation、stale、unavailable replacement | old revision never mutated；Query only reads current committed head | `DiagnosticSummary` static factories |
| gap | Open | acknowledge、mitigate、resolve | Resolved terminal；Suppressed reserved | `GapState` |
| degraded output | policy-evaluated None/Active/Blocked revision | immutable complete policy replacement | old revision never mutated；public `DegradedSurface`不能直构truth | `DegradedOutputPolicy` private factories |
| peripheral delivery | Pending | prepare、deliver/fail、block | Delivered/permanent-or-rejected Failed terminal；retryable Failed可经新decision重开；Cancelled reserved | `PeripheralDeliveryState` |
| export preparation | Draft/PendingEvidence | apply decision、attach gap、deliver/fail | Delivered/permanent-or-rejected Failed terminal；retryable Failed可经新decision重开；no Cancelled variant | `ExternalAuditExportPreparation` |
| reference snapshot | Pending | resolve/stale/unresolved/invalid/unavailable | Invalid terminal | `ReferenceSnapshotState` |
| projection maintenance | Stale | rebuilding、fresh、failed；mark stale | no source-repair terminal | `ProjectionMaintenanceState` |
| replay coordination | Pending | coordinating、blocked、completed、failed | Blocked/Completed/Failed terminal execution | `ReplayCoordinationState` |
| rollup rebuild | Pending | running、completed、failed | Completed/Failed terminal；Cancelled reserved | `RollupRebuildState` |

### 14.2 target-bound decisions 与 affected-only propagation

| decision / input | 必须绑定 | 消费前校验 | 只能影响 | 禁止复用 / 扩散 |
|---|---|---|---|---|
| `HandoffReadinessDecision` | handoff + scope + consumer + immutable input | all identities、visibility/gaps/retention/no-write snapshot与loaded version一致 | same handoff readiness/policy snapshot；prepare可推进same lifecycle | another handoff/input/consumer；external report truth |
| `RetentionMarkerDecision` | marker + protected target + from-state/purpose/archive + protection relation/state/active set | exact loaded marker/protection snapshot；target state/reason/active-set matrix | same retention marker state/relation/reasons | reason-only eligibility、Released、cleanup、another marker/target |
| `ActiveProtectionReleaseDecision` | protection + protected target + exact observed set + revalidated active subset | observed set/version exact match；active set must be stable-identity subset；non-empty且无冲突为Protected，显式冲突才Conflicted | same protection relation active set/state | consumer history deletion、retention marker release、cleanup、consumer retirement |
| `ReplayApprovalSnapshot` | replay scope + exact targets/effect + retention/protection/guard snapshot | loaded scope still Defined；all guards approvable | same replay scope Approved | coordination execution、source write、broader target set |
| `ReadVisibilityDecision` | one request context + visibility eval + scope | exact refs + optional payload matrix | process-local read visibility result | another request/actor、business authorization、projection state |
| `PeripheralDeliveryDecision` | delivery + preparation + consumer + view | all identities + allowed/reason/visibility/gaps | same delivery attempt | export preparation lifecycle、consumer/view truth |
| `ExportPreparationDecision` | preparation + consumer + immutable evidence input | identities + readiness/visibility/gap/reason matrix | same export preparation | external audit verdict、delivery success |
| `ReferenceRefreshResult` | one loaded snapshot subject/version boundary | result variant payload complete；application verifies expected version/subject | same local snapshot state；later affected views marked stale | another subject、external lifecycle、source body |
| `MaintenanceExecutionAuthorization` | one target + effect + guard + optional approved replay scope | exact target identity/kind/object/effect/guard；replay membership/state | one maintenance/replay/rollup execution target | source/external target、different target or scope member、default scope |

Propagation is affected-only: a reference change may mark only views/handoffs/gaps whose persisted dependency binding includes that `snapshot_ref`;a gap change may stale only views containing that `gap_ref` or affected object;retention/protection may block only target-bound handoff/export/maintenance inputs;replay/maintenance may replace only members captured by the immutable plan. Repository `list_all` followed by global stale,global gap close or global readiness rewrite is forbidden.

### 14.3 关键跨对象顺序

```text
EvidenceIndexInputView saved append-once
  -> ReportHandoffRecord::draft
  -> HandoffReadinessPolicy -> HandoffReadinessDecision
  -> ReportHandoffRecord::apply_readiness / prepare
  -> optional AuthenticityHint accepted and attached
  -> delivery adapter outside truth UoW
  -> ReportHandoffRecord::deliver(finite result)

Protected observation loaded
  -> ActiveReferenceProtection exact current consumer snapshot loaded
  -> RetentionProtectionPolicy revalidates a stable-identity active subset
  -> ActiveReferenceProtection atomically replaces active set/state
  -> RetentionProtectionPolicy evaluates exact marker + reconciled protection
  -> RetentionMarker atomically applies hold/candidate/conflict decision
  -> protection relation may separately expire/release
  -> marker release remains reserved; no cleanup

ReferenceSnapshotState loaded with expected version
  -> resolver returns body-free ReferenceRefreshResult
  -> snapshot applies exact result and saves transition/record in one UoW
  -> dependency index selects affected gap/diagnostic/handoff/view targets
  -> affected projections are marked stale
  -> later maintenance authorization rebuilds derived views

ReplayScope Defined
  -> consistent retention/protection/no-write snapshot
  -> ReplayBoundaryPolicy approval
  -> ReplayScope Approved
  -> ReplayCoordinationState Pending binds one exact in-scope MaintenanceTargetRef
  -> DerivedMaintenancePolicy same-target authorization
  -> only captured observation/derived targets mutate
  -> coordination completes or blocks/fails; source truth untouched
```

| 顺序红线 | 当前裁定 |
|---|---|
| draft handoff 前只有preview evidence input | 禁止；handoff必须引用same-UoW已保存的immutable input identity，rollback一起发生 |
| Query读取时发现stale/unresolved | 只返回stored state/freshness/gap；不得同步refresh、rebuild、close gap或persist readiness |
| handoff Ready但active hold或hard gap随后变化 | 通过dependency binding标记handoff/view stale或在delivery前重新versioned evaluate；不得沿用旧decision |
| revalidated active consumer非空仍release protection/marker | 禁止；protection保持Protected或显式Conflicted并保留exact active set，marker只能ActiveHold/Conflict，marker release当前始终reserved |
| replay先执行再补approval/no-write record | 禁止；Approved scope和target-bound authorization必须先于任何effect |
| replay coordination省略target并遍历整个scope | 禁止；每个coordination execution固定一个`MaintenanceTargetRef`，scope-wide iteration由immutable job plan显式展开 |
| resolver/provider返回body或untyped error | mapper拒绝/quarantine或映射finite unavailable/unresolved；不保存body、不从message猜state |
| maintenance完成后直接关闭gap/宣告source repaired | 禁止；Completed/Fresh只更新derived target，gap需独立typed local basis |
| delivery adapter成功后写consumer/report/external audit truth | 禁止；只记录本地 Delivered result与append-only history/outbox snapshot |

### 14.4 no-write / no-business-truth audit

| 本仓状态 / output | 只表达 | 明确不表达 |
|---|---|---|
| `Ready/Prepared` | current body-free input通过本地target-bound policy | report correctness、acceptance、signoff |
| `Delivered` | 本地boundary记录有限delivery result | external consumer accepted、audit passed、report truth |
| `RealEvidenceLinked` | trusted boundary的body-free origin ref已关联 | evidence authenticity verdict、真实alias |
| `ReleaseEligible/Expired/Released` | retention/protection relation本地评估状态 | source material cleanup、archive package deletion |
| `Approved/Completed` replay | captured observation-side effect获批/完成 | source/runtime replay成功、业务truth修复 |
| `Closed` no-write violation | 本地处理结束且history保留 | forbidden write已执行或补偿成功 |
| `Resolved` reference snapshot | local safe summary/version可用 | external object lifecycle正常或真实 |
| `Resolved` gap | 有本地typed gap closure basis | source缺陷修复、全局无gap |
| `Fresh/Completed` maintenance | derived target达到captured committed cursor |业务验收、source完整性、无未来事件 |

Every Query, diagnostic assembler and preview is read-only. Every Command/Consumer/Job accepted mutation is limited to observation-owned truth, local boundary marker, append-only local history, immutable outbox snapshot or derived projection. No flow may call source/Governance/Artifact/Identity/Runtime/Sandbox/Archive/Report/external-audit write port;`NoWriteViolation` records and blocks an attempted boundary breach but never authorizes compensation.

## 15. R06.4 差异裁定与 historical material

### 15.1 主控差异项状态

| delta | R06.4裁定 | 后续状态 |
|---|---|---|
| `R06-D01-INDIVIDUAL-CARD` | 本批110个active explicit Rust type均有独立heading或明确owner卡；18个truth/state object、6个public view逐对象闭口 | partial_resolved；仍需R06.5~R06.7对象卡与R06.8全文审计 |
| `R06-D04-MAINTENANCE-TARGET` | `MaintenanceTargetRef`只保留immutable id/kind/object/effect/no-write descriptor；旧target state/maintenance relation移除，四组target/effect一一对应，replay coordination不是target/effect | resolved_definition_reconciled_R06.4；affected propagation仍待R06.5~R06.8与Step08~11 |
| `R06-D05-PROJECTION-OWNER` | 六个view schema回灌`contracts::views`；Step08后置schema降为affected use | resolved_definition_for_R06.3_R06.4_views；传播仍待Step08 |
| `R06-D09-STATE-BACKFILL` | 17组本批current state、condition field、trigger/reserved/terminal和cross-object顺序闭口 | partial_resolved；R06.6 application/outbox/job states仍open |
| `R06-D11-SUPPORT-TYPE` | reason/result/scope/ref/set/decision/delta/view与rehydration owner均闭口；无聚合shape冒充current type | controlled_for_R06.4；R06.8仍需全文zero-unowned扫描 |
| `R06-D12-ERROR-OWNER` | contracts factory=`ProtocolError`;domain object=`DomainError`;repository/provider error不下沉 | partial_resolved；`DomainError` exact card仍在R06.5 |

### 15.2 historical / canonical 裁定

| historical name / shape | current处理 |
|---|---|
| `ReferenceSnapshotRef` | canonical `ReferenceSnapshotStateRef`;不生成alias |
| `ReadModelScope` | 复用`ObservationProjectionScope`;不生成type/kind |
| `GapViewScope` | 单gap selector + generic page；不生成aggregation scope |
| `SafeSignalProjectionViewRefSet` / `AuditTimelineViewRefSet` | 复用truth identity set `SafeSignalRefSet` / `AuditProjectionRefSet` |
| `DegradedOutputStateRefSet` | 单gap持有`Option<DegradedOutputRef>`；page表达集合 |
| `ReferenceFreshnessSummary` | historical aggregate shape；单snapshot view直接使用state，不生成count type |
| `ReportHandoffReadinessPolicy` | 非canonical旧名；统一为概要已固定的`HandoffReadinessPolicy` |
| `ExportPreparationState::Collecting` | 不存在；current初始态为`Draft/PendingEvidence` |
| `MaintenanceTargetState`、target内`maintenance_ref`/block reason | historical duplicate truth；current `MaintenanceTargetRef`只保存immutable id/kind/object/effect/no-write descriptor，eligibility归policy authorization，execution归三个owning state object |
| `ReplayCoordination` target kind / `CoordinateObservationReplay` maintenance effect | historical recursive target/effect；coordination是application operation，不是可再次授权的domain effect；current只保留四组target/effect |
| scope-wide `ReplayCoordinationState`或多target `changed_refs` | current每个coordination identity固定一个exact target；R06.6 immutable job plan负责逐target展开，completion changed set只能empty或stored target object singleton |
| 单一maintenance cursor / progress cursor | 无法证明跨observation/reference依赖；current `ProjectionMaintenanceState`、transition和`MaintenanceProgressSummary`保留独立dual watermarks，Step07 `ProjectionReadFence`仍只作transaction-local proof |
| object直接返回`*Record` / 持有`*RecordRef` | 使用process-local transition delta；R06.5在same UoW以successful delta + post-mutation aggregate snapshot + record metadata组装record |

上述变更没有删除正式概要的业务主语，只裁掉详细设计后置材料引入的重复/无scope shape，因此不触发回退修改正式`02`。Step08/09/10中的旧名和旧签名均登记为冻结的affected material，本批不修改。

### 15.3 affected-only传播登记

| affected location | 当前冲突 / use | 解冻后的动作 | 最早允许时点 |
|---|---|---|---|
| R06.5 policy / record | 需要本批target-bound decisions、immutable target descriptor、完整conditional fields和17个delta family | policy逐卡生成private decision且不得恢复target lifecycle；record factory消费successful delta + same-UoW post-mutation snapshot + typed metadata并交叉校验，不重放policy、不猜字段、不仅凭current truth重建history | 用户确认进入R06.5后 |
| R06.6 application | assembler、idempotency、stored result、outbox/job需要消费本批object/view；scope-wide replay尚缺plan owner | 固定same-UoW、external-call cut、dependency index和stored result；immutable job plan按scope member逐个生成独立coordination identity，不复制view schema或递归coordination effect | R06.5完成并确认后 |
| Step07 ports | old signatures/DTOs仍使用旧snapshot名、record-return、单cursor或缺exact canonical target load | affected-only复审versioned repository、dual-watermark snapshot、consistent read fence、resolver/result、target binding与dependency lookup | R06.8完成并确认后 |
| Step08 protocols | `ReferenceSnapshotRef`、旧target state/effect、后置view definitions、单协议卡仍冻结 | 逐协议引用current contracts view/state和immutable target descriptor；拒绝legacy replay target/effect；single snapshot无freshness counts；wrapper控制body presence | Step06/07稳定后 |
| Step09 flows | direct record return、旧handoff policy名、reference refresh旧签名、scope-wide replay或Query可能按旧view | 逐flow调用exact factory/member/delta/record顺序；每个replay flow固定exact target并传播dual watermarks，补zero-write/external-call cut | Step08稳定后 |
| Step10 states | old trigger参数、target lifecycle、single cursor、scope-wide coordination及reference旧refresh record输入 | 只复审affected enum/trigger/field backref；移除`MaintenanceTargetState`，保持per-target coordination、dual-watermark与reserved transition一致 | Step09稳定后 |
| Step11 persistence | current row需保存conditional reason/result、immutable target binding、dual watermarks和stable marker refs | mapper使用`try_rehydrate`;CAS + same-UoW delta/record；分别存储/比较observation与reference cursor，不持久化`ProjectionReadFence` | Step10复审后 |
| Step16 tests | 需要每对象rehydration、四组target/effect、target mismatch、dual-watermark、per-target replay singleton、body-free/no-write和reserved cut | 添加planned test cuts，不声明已执行 | downstream impact audit时 |
| formal03 / 04 | formal与04当前冻结且含修复前material | Step19全量重装配后再审计04 affected references | repair链完成后 |

## 16. R06.4 Step 7+ 承接清单

| 后续 owner | 必须承接的本批对象 / 规则 | 输出要求 | 未承接时 blocker |
|---|---|---|---|
| R06.5 policies | 8个target-bound decision/result/authorization输入、immutable target descriptor、四组exact effect与canonical policy名 | exact rule snapshot/input/output/private constructor/error/test；不可跨target复用，不得把target descriptor升级为eligibility/execution truth | public/entry可伪造Ready/Approved/Visible或恢复第二套target lifecycle |
| R06.5 records | 17个transition delta family、post-mutation aggregate snapshot与所有typed reasons | 每个append-only factory固定三输入和ref/subject/change/actor/time/trace/dual-watermark total mapping；delta无需复制immutable relation | aggregate可迁移但history需实现者猜，或record factory重放policy/current truth |
| R06.6 application / jobs | approved replay scope、exact target binding与per-target coordination | immutable job plan展开scope members；每个target独立coordination identity/authorization/result，禁止recursive coordination target/effect与scope-wide aggregate mutation | replay执行owner不清或一个execution跨多个target扩权 |
| Step07 repositories | 18个domain object versioned get/save、view consistent snapshot、target binding与dependency lookup | expected version、rehydration、stable lookup、affected-only index、observation/reference cursor分别存取；read fence保持transaction-local | object schema无法安全持久化/传播，或双水位被错误折叠 |
| Step07 outbound ports | handoff/peripheral finite delivery、reference finite resolver result | external call不持有truth transaction；body-free typed outcome；no message parsing | adapter可直接写state或泄露body |
| Step08 protocols | six views + canonical refs/state/reason/surface + immutable maintenance target | DTO只引用contracts definition；不暴露target lifecycle或legacy replay effect；single-object/page cardinality与body matrix明确 | protocol形成第二套truth source |
| Step09 flows | exact load-policy-member-delta-record-save-outbox顺序 | per-flow UoW、external-call cut、zero-write failure、affected-only propagation；replay每次固定一个target，maintenance传播dual watermarks | 对象方法有签名但无法编排或scope被隐式扩大 |
| Step10 states | 17组state conditional matrix、per-target replay和reserved values | from/to、trigger、reason/result、dual-watermark字段逐字一致；不得恢复`MaintenanceTargetState` | rehydration与状态矩阵分叉 |
| Step11 persistence | current aggregate + immutable input + append history + projection sidecar | CAS、same-UoW、try_rehydrate、dual cursor/set ordering、dependency index；不持久化transaction-local read fence | row可读但不满足对象不变量 |
| Step14 config | policy basis / enablement只注入typed snapshot | config不能构造decision/terminal state/locator-bearing view、target shape或额外effect | config升级为业务truth owner |

## 17. zero-unowned support type 与跨模块扫描

### 17.1 active explicit type accounting

| category | 结论 |
|---|---|
| explicit Rust types | 110个current `pub struct/enum` 均有独立heading或其owner对象下的具名子卡；`RetentionMarkerDecision`与`ActiveProtectionReleaseOutcome`均有独立卡 |
| contracts public types | refs/state/reason/result/scope/set/surface/view均有唯一contracts module owner；domain只import |
| domain-only types | truth/state object、target-bound decision、authorization、transition delta均有唯一domain module owner；不进入public DTO |
| historical shapes | 旧scope/ref-set/freshness aggregate、`MaintenanceTargetState`、recursive replay target/effect只保留文字裁定，不生成active Rust type/token |
| deferred types | policy、record、DomainError、application/job/runtime/entry carrier均有R06.5~R06.7唯一计划owner，不在本批伪定义 |

### 17.2 module dependency and body scan

| scan | 结论 | boundary |
|---|---|---|
| contracts -> domain | pass_no_dependency | six views and all public fields use contracts/core types only |
| domain -> view assembly | pass_no_reverse_assembly | domain stores only view refs where relation requires；application assembles view body |
| target decision public construction | pass_none | all decision/authorization constructors private/domain-only |
| raw log/metric/trace/audit/evidence body | pass_none | only safe summaries、typed refs、sets、counts、state/reasons |
| locator/credential/provider/product | pass_none | delivery/export object stores consumer/view/input identity only |
| real run id/evidence alias/verdict/signoff | pass_none | explicitly excluded from objects/views/progress |
| record identity before R06.5 | pass_none | transition delta contains no record ref/actor/time/trace/outbox id |
| Query mutation | pass_none | views inspection-only；read/request objects process-local；no refresh/rebuild/write |
| maintenance target lifecycle | pass_none | target只含immutable id/kind/object/effect/no-write descriptor；state、maintenance ref、block reason均由policy/execution owner承接 |
| replay target cardinality | pass_exact_one | coordination固定一个target；scope-wide expansion后置R06.6 immutable job plan；completion changed set只允许empty或exact target singleton |
| maintenance cursor namespaces | pass_dual_watermark | observation/reference cursor分别声明requirement、存储和比较；不存在global cursor替代，`ProjectionReadFence`不持久化 |

## 18. R06.4 自检、blocker 与停止点

| 自检项 | 结论 | 证据 / 限制 |
|---|---|---|
| 是否只写设计仓文档 | pass | 未实现代码、未创建implementation artifact |
| 是否按确认只推进R06.4 | pass | 未修改Step07~19、formal03、任何04文件 |
| 独立卡 / field / factory / member / state | pass_for_R06.4 | §§8~12；110 active explicit types、18 objects、6 views |
| 字段来源 / rehydration / conditional matrix | pass_for_R06.4 | §13；禁止mapper/default/replay bypass |
| target-bound / cross-object / affected-only | pass_for_R06.4 | §14；8类decision/input与四条关键顺序 |
| immutable target / replay / dual watermark | pass_for_R06.4 | §§9.22~9.25、12.7、14~17；四组effect、per-target coordination与双namespace cursor已闭口 |
| contracts no-domain / body-free / no-write | pass | §§3、12、14、17 |
| canonical names / historical isolation | pass | §15.2；single snapshot不含aggregate summary |
| 是否伪造commit/run/test/evidence/signoff | pass_none_created | 测试均为planned cut；无运行或验收声明 |
| external upstream blocker | none | current 00/01/02足以支撑本批 |
| internal blocker | `03-RPR-S06-GRANULARITY=open` | historical R06.4 checkpoint；current见§22.4 |
| R06.4 gate | historical_pass_consumed | 本批完成证据已由R06.5-A消费，不再是current停审点；本批不声明实现、测试或验收结果 |
| historical D gate | R06.5-D_done_waiting_user | P7~P12 affected definitions已同步；已由用户确认解除并被E批消费 |
| historical next action | wait_user_confirmation_before_R06.5-E | 已消费；current action见§22.4 |

## 19. R06.4 后续阅读清单（historical，已消费）

以下清单记录R06.4完成后曾等待用户确认的R06.5-A输入；该确认已经发生，且清单已由R06.5-A消费：

1. Step 06 SOP / 书写规范中policy、guard、append-only record、error与逐对象停审条款。
2. 正式`02-概要设计.md` §6/§12中的18个policy与13个record主语，以及相关概要Step06 policy/record附录。
3. R06.2 contracts专项§19.5、主控§6.5.4/§6.5.5和R06.3/R06.4 transition/decision承接清单。
4. Step07 repository/port、Step09 flow、Step10 state、Step11 persistence、Step12 error对policy/record的affected use，只作反向缺口检查。
5. `L1-governance`与`L1-artifact` Step06逐policy/record卡粒度。

原R06.5-C/D/E/F阅读入口已经由用户确认并消费。current下一阅读入口只见R06.5专项§65.8、主控§6.13、flow与ledger；用户确认前不得读取或写入R06.5-G H8~H13，不得进入R06.6，不修改Step07~19、formal`03`、任何`04`文件或实现代码。当前不需要提交。

## 20. R06.5-C authenticity affected-definition reconciliation

### 20.1 current P6 consumption contract

R06.5-C不改变`AuthenticityHint`的truth owner、字段或四态主语，只收窄mutation入口并闭合同态更新。`AuthenticityHintDecision`及其complete snapshots的authoritative schema在R06.5专项§26；本文件仍是`AuthenticityHint`与`AuthenticityHintTransition`的唯一owner。

| contract item | current ruling |
|---|---|
| unique public policy member | `apply_decision(handoff, input, loaded_linkages, assessments, loaded_gaps, &decision, evaluated_at) -> Result<Option<AuthenticityHintTransition>, DomainError>` |
| constructor / decision owner | hint仍由`assess`创建为Unassessed；decision仅由P6的`pub(crate)` constructor产生 |
| complete binding | hint、handoff、immutable input、all linkage snapshots、origin assessment set、all gap snapshots与policy basis逐项匹配 |
| Unassessed outcomes | ConfirmTrustedBoundary / MarkPlaceholder / MarkInsufficient均返回Some changed transition |
| Insufficient outcomes | 可进入Real/Placeholder；reason或gap set变化的Insufficient同态返回Some changed transition |
| exact replay | state/origin/reasons/gaps及完整decision snapshot均相同时返回None，不更新时间、不生成record |
| terminal | RealEvidenceLinked与PlaceholderDetected无outgoing transition；重评建立新hint identity |
| private helpers | confirm/placeholder/insufficient三个裸helper均不可从application/entry/config/infra调用 |

visibility、freshness与open-gap gate先于origin分类。NotVisible/Blocked、Degraded、Stale/Rebuilding/Unknown、open gap或incomplete assessment只能产生typed Insufficient；只有这些门禁全部通过后，才按Placeholder > Insufficient > TrustedBoundary分类。这样caller不能利用origin输入泄露被visibility阻断的placeholder/trusted信息。

### 20.2 transition、truth 与副作用边界

`AuthenticityHintTransition`继续保存before/after state、origin、placeholder reason、gap set、insufficient reason与evaluation time。changed Insufficient同态必须完整记录旧/新reason和gap set；exact replay没有transition。`EvidenceOriginKind::TrustedBoundary`只表达trusted mapper形成的本地body-free origin hint，不是真实证据verdict，不生成evidence alias、run id、signoff或acceptance。

任何decision binding、missing loaded object、handoff/input relation、boundary/digest或state错误均返回`DomainError`且hint/handoff/input/linkage/gap逐字段不变；不生成transition、H4 record、outbox或durable identity，不调用resolver/adapter。resolver必须先返回contracts-owned`EvidenceOriginResolution`，application再组装target-bound assessment；caller-supplied `EvidenceOriginKind`保持frozen affected material，后续Step08重组时删除。

### 20.3 checkpoint

| check | conclusion |
|---|---|
| P6 truth owner / state owner是否改变 | no；仍为`domain::handoff::AuthenticityHint` |
| P6 policy是否反写handoff或evidence truth | no；policy纯评估，member只改hint |
| exact replay与changed same-state是否可区分 | yes；None vs Some transition |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；仍需R06.5-D~G及R06.6~R06.8 |
| historical checkpoint | `R06.5-C_done_waiting_user`；已由D批消费 |
| historical D pointer | `R06.5-D_done_waiting_user`；已由E批消费；current只见§22.4、主控§6.12、R06.5专项§56.3、flow与ledger |

## 21. R06.5-D boundary affected-definition reconciliation

本节只回写P7~P12对R06.4 canonical decision、truth object member和phase gate的current增量，不复制R06.5专项中的policy/material/support声明。当§§8~10较早的扁平decision、全scope单一boundary值、裸policy mutation或Query暗写表述与本节冲突时，以已经原位更新的对象卡和本节为准。

### 21.1 reused decision 与 snapshot唯一shape

| canonical type | current authoritative shape | unique producer | stale-decision gate |
|---|---|---|---|
| `HandoffReadinessDecision` | P7 basis + complete `HandoffReadinessInputSnapshot` + readiness/visibility/gaps/marker/no-write inspection fields + typed block reason | P7 `HandoffReadinessPolicy` crate-private constructor | handoff/input/hint/gap lifecycle/retention consumer/P10任一字段变化均失效；preview不能替代committed input proof |
| `ActiveProtectionReleaseDecision` | P8 basis + complete protection pre-snapshot + 21-family current consumer snapshot set + exact retained active set + reason + outcome | P8第一阶段 | observed set与loaded current set必须一一相等；ref-only、state-only或missing-as-inactive均拒绝 |
| `RetentionMarkerDecision` | P8 basis + marker pre-snapshot + accepted protection post-snapshot + exact target state/reasons | P8第二阶段 | 必须在protection decision成功apply后重建；旧pre-state、foreign relation或reason-only decision均失效 |
| `ReplayApprovalSnapshot` | P9 basis + complete scope pre-snapshot + one-entry-per-target retention/protection/P10 set + Approved/Blocked outcome | P9 | set与scope target一一相等；same replay scope + same target + same effect的P10 binding逐项校验；全局单一retention/protection值非法 |
| `ReadVisibilityDecision` | P11 basis + complete one-shot request/actor/target/projection/freshness/gaps/scope/constraint/P10 input + finite output | P11 | request、actor、target、projection head、freshness、gap set、scope或P10 decision任一变化均失效 |

这些decision均为same-UoW或one-shot process-local domain value，不是repository version、authorization token、public DTO、idempotency stored result或append-only record。它们可以被owning member借用以保留policy basis给后续record factory，但不得serde持久化后跨UoW重放。P10 `NoWriteGuardDecision`与P12 `GapClassificationDecision`是D批新owner，authoritative声明只见R06.5专项，不在本文件复制。

### 21.2 owning member 与唯一policy消费入口

| owning object | current public entry | private / reserved path | accepted mutation boundary |
|---|---|---|---|
| `ReportHandoffRecord` | `apply_readiness(...)`、`prepare(...)`、`block(...)`均借用complete P7 inputs与decision | 不允许按bare readiness/block reason改state | binding先于outcome；Pending/Degraded/Blocked是expected result；delivery仍由独立adapter result member |
| `ActiveReferenceProtection` | `apply_release_decision(&RetentionConsumerStateSnapshotSet, &ActiveProtectionReleaseDecision)` | state/reason/set裸替换不可见 | complete pre-state与current consumer snapshots匹配后原子替换；Protected不能直达Released |
| `RetentionMarker` | `apply_decision(Option<&ActiveReferenceProtection>, &RetentionMarkerDecision)` | current `release()`仍reserved | 只消费reconciled protection post-state；ReleaseEligible不执行cleanup/archive/delete |
| `ReplayScope` | `apply_boundary_decision(&ReplayTargetBoundarySnapshotSet, &ReplayApprovalSnapshot)` | `approve()`与policy-originated `block()`均module-private | `Defined -> Approved/Blocked`；target/effect/guard保持不变；不创建coordination/job/execution truth |
| `GapState` | `open_from_decision(gap_ref, &GapClassificationDecision, opened_at)` | bare `open(..., GapKind, ...)`为module-private | 只有Classified建立Open；NoGap/error不建立object、不产生transition或record |

P7/P8/P9/P12所有public消费入口先执行complete binding，再解释expected outcome，最后一次性mutation。binding/error路径不得消耗record ref、outbox ref、gap ref或外部effect token；repository CAS和same-UoW rollback仍由Step11承接，decision snapshot不能替代CAS。

### 21.3 synchronous Query 与 phase-reserved read state

当前同步Query的固定链为`load committed snapshot -> P10 -> P11 -> response assembler`。它只借用`ReadVisibilityDecision`，没有`ReadVisibilityState` producer，不调用`from_decision/apply_decision`，不保存`DiagnosticRequestContext`，不创建`ReadVisibilityTransition`、H7 `ReadAccessRecord`、outbox、idempotency row或stored result，也不触发reference refresh、projection rebuild、gap mutation或source/external write。

`ReadVisibilityState`继续保留schema，只为未来显式asynchronous read-audit flow占位；两个decision member均为phase-reserved private。未来若启用，必须先有独立Command/Consumer UoW、`ObservationRecordOrigin::AsynchronousReadAudit`、persistence schema、H7 writer与Step09/11/13闭环，再由正式设计变更解除门禁。仅有该类型、transition或H7 schema不构成current producer证据。

### 21.4 no-write、gap 与truth边界

1. P10 `AllowedObservationEffect`只证明exact trigger/target/effect在本地观察边界内，不授予actor、不批准handoff/replay/maintenance，也不证明外部成功。
2. P10 `Blocked`是expected outcome。Forbidden source/external target可由mutating flow后续建立`NoWriteViolation`；合法local target被block时没有`ForbiddenWriteTargetRef`，不得伪造外部identity。
3. P11只能保持或收窄persisted visibility，不把NotVisible、Blocked、Degraded、Stale、Rebuilding或Unknown升级为Visible。
4. P12只从complete finite basis形成NoGap或四种既有`GapKind`；no-write/retention block本身不创建第五种gap，不解析provider/error message，也不反写source truth。
5. P9 Approved只允许后续按exact target建立replay coordination候选；它不执行replay、不建立job run、不宣称source repair或execution success。

### 21.5 affected propagation 与 checkpoint

| affected location | D批authoritative delta | current处理 |
|---|---|---|
| R06.4 §§8.4~8.6 / §10.1 | P7/P8/P9 complete decision与public member signature | 已原位同步；本节登记唯一owner与顺序 |
| R06.4 §§9.6/9.6.1/9.8/9.12 | replay per-target snapshot、read complete input、Query zero-write、gap decision-only open | 已原位同步；旧扁平shape为historical material |
| frozen Step07 | repository/load接口尚未表达部分complete snapshot和committed proof | affected-only；R06.8后逐trait review，不在D批修改 |
| frozen Step08/09 | request/flow仍可能传bare state、scope或reason | affected-only；逐协议/逐flow修复时使用本节入口 |
| frozen Step10/11/12 | state trigger、same-UoW/CAS、error mapping需消费D批decision | affected-only；当前保持冻结 |
| R06.5 F/G records | H4/H5/H6/H7/H8/H13需读取accepted transition/decision basis | 只登记输入；不得提前定义record schema或writer |

| checkpoint item | conclusion |
|---|---|
| duplicate canonical decision owner | none；五个reused decision仍归R06.4 owning modules，P10/P12新decision归R06.5专项 |
| Query writer | none current；`ReadVisibilityState`明确phase-reserved |
| business truth write | none；只改observation-owned handoff/retention/replay/gap state，且不执行cleanup、source repair或external delivery |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；historical D checkpoint，current见§22.4 |
| historical checkpoint | `R06.5-D_done_waiting_user`；已由E批消费 |
| historical next allowed | 等待用户确认后只进入R06.5-E；已消费，不再是current action |

## 22. R06.5-E boundary affected-definition reconciliation

本节回写P13~P18对R06.4 canonical degraded/peripheral/reference/maintenance/replay对象、decision与transition的current增量，不复制R06.5专项§§46~52中的policy/material/support声明。§§9/11中已原位更新的签名与本节共同构成current authority；更早的裸state/reason/result/authorization入口只作historical private-helper线索。

### 22.1 canonical decision / authorization owner

| canonical type | current authoritative shape / owner | unique producer | consumption gate |
|---|---|---|---|
| `DegradedOutputDecision` | P13 basis + complete exact object/scope/P11/safety/gap input + total outcome；`domain::gap` | P13 only | Query只映射surface；durable revision factory必须借用decision，不创建Query sidecar |
| `PeripheralDeliveryDecision` | P14 basis + complete delivery-side input + existing output fields；`domain::peripheral` | P14 delivery entry only | 与preparation decision不可互换；member必须同时借用complete input |
| `ExportPreparationDecision` | P14 basis + complete preparation-side input + existing output fields；`domain::peripheral` | P14 preparation entry only | Pending/Committed evidence boundary不可用P7 handoff decision替代 |
| `ReferenceFreshnessDecision` | P15 basis + complete snapshot/result/family/version/target/P10 input + action；`domain::reference` | P15 only | in-place/new-identity member还须消费same-target P17 Authorized decision |
| `MaintenanceExecutionAuthorization` | target/effect/mode/guard；唯一owner `domain::maintenance` | 仅由P17 Authorized outcome内建 | 无policy basis/scope set/dependency proof，禁止裸public消费或跨UoW重放 |
| `DerivedMaintenanceDecision` | P17 basis + complete target/scope/dependency/mode/P10 input + Authorized/Blocked；`domain::maintenance` | P17 only | projection/reference/rollup/gap-scan owning path先complete-bind，再提取authorization |
| `ReplayCoordinationDecision` | P18 basis + complete Pending coordination/Approved scope/current one-target boundary/P17/P10 input + Start/Blocked；`domain::replay` | P18 only | 只推进一个existing coordination；不迭代scope、不建job、不生成changed/violation ref |

所有decision与authorization constructor均非public protocol surface；无serde/default/builder。P16仍是pure structural guard且成功不产生decision、proof、Fresh/Resolved status或authorization。

### 22.2 owning public entry / private helper split

| owning object | current public entry | private / non-policy path | accepted mutation basis |
|---|---|---|---|
| `DegradedOutputState` | `create_from_decision` / `replace_from_decision` | caller-selected surface/reason/state helper不可见 | replacement换new identity并保持exact affected object/scope；transition保存P13 basis |
| `ExternalAuditExportPreparation` | `apply_decision(&ExportPreparationInputSnapshot, &ExportPreparationDecision, ...)` | `attach_gap`、delivery result、retryable failure是独立local path | 只有P14 apply branch保存P14 basis |
| `PeripheralDeliveryState` | `prepare/block(&PeripheralDeliveryInputSnapshot, &PeripheralDeliveryDecision, ...)` | `record_delivery`消费adapter-independent result | 只有prepare/block保存P14 basis；adapter result不借旧basis |
| `ReferenceSnapshotState` | `apply_freshness_decision(target, maintenance, freshness)`；`create_from_required_new_snapshot(...)` | raw refresh/state helpers均module-private | P17与P15必须same target/P10；in-place transition保存P17 + P15 bases；Invalid recovery使用new identity branch |
| `ProjectionMaintenanceState` | `start_from_decision(target, &DerivedMaintenanceDecision, ...)` | mark-stale/complete/fail不重放policy | start保存P17 basis + authorization audit fields；裸authorization private |
| `RollupRebuildState` | `start_from_decision(target, &DerivedMaintenanceDecision, ...)` | complete/fail是actual execution result path | start保存P17 basis；裸authorization private |
| `ReplayCoordinationState` | `apply_policy_decision(&ReplayCoordinationInputSnapshot, &ReplayCoordinationDecision, ...)` | complete/fail由actual maintenance result驱动 | P18 Start/Blocked保存P18 basis；Blocked violation ref固定None；changed refs固定empty |

`ReferenceSnapshotState`的P17 + P15双decision gate不是两个互相独立的授权：P17只允许尝试exact derived reference refresh，P15只决定本次resolver result如何改变local snapshot。任一Blocked、stale binding、cross-target或cross-P10关系均零mutation。P18 Start同理只推进coordination到Coordinating，不执行P17 authorized effect。

### 22.3 transition / H8~H13 handoff closure

| transition / accepted branch | identity / target proof | policy basis matrix | G-batch record handoff |
|---|---|---|---|
| `DegradedOutputTransition` replacement | previous/current revision refs + previous/current affected object + previous/current scope | required exact P13 basis | H8不能从post-state猜old revision；initial creation须另有typed creation branch |
| `PeripheralDeliveryTransition` | delivery/preparation/consumer/view + pre-state | Some P14 only for prepare/block；None for adapter result | H9 tagged branch区分policy与adapter result |
| `ExportPreparationTransition` | preparation/consumer/view + pre-state | Some P14 only for apply_decision；None for attach/result/failure | H9不能把local failure伪装成policy block |
| `ReferenceSnapshotTransition` | same snapshot + subject + pre-state/result fields | required P17 maintenance basis + P15 freshness basis | H10 in-place branch；RequireNewSnapshot另建typed new-snapshot accepted input并保存previous ref + both bases，不伪造old transition |
| `ProjectionMaintenanceTransition` | maintenance + exact target + dual cursor pre-state | Some P17 only for start；None otherwise | H11保留start authorization来源与non-policy lifecycle分支 |
| `RollupRebuildTransition` | rebuild/window/target + cursor/count pre-state | Some P17 only for start；None otherwise | H11 rollup branch不把completion称为policy result |
| `ReplayCoordinationTransition` | coordination/scope/exact target + pre-state | Some P18 for Start/Blocked；None for completion/fail | H13 per-target branch；P18 Blocked无violation，completion才允许empty/exact singleton changed set |

G批record factory仍必须消费`transition/accepted immutable input + same-UoW post-state + typed ObservationRecordMetadata`三类输入。transition中的basis只证明accepted mutation由哪次policy evaluation驱动，不替代complete decision input、repository CAS、post-state或metadata；non-policy branch不得借用aggregate中最近一次basis。

### 22.4 truth / side-effect / affected propagation gate

1. P13/P14的Normal/Ready/Delivered不形成业务truth、external acceptance、verdict或signoff；gap始终保留自身truth owner。
2. P15/P16不拥有external object lifecycle；typed version relation不使用wall clock，P16成功不形成可保存proof。
3. P17/P18只授权/协调observation-owned derived effect；不创建plan、claim、progress、job/run identity，不反写source/external truth。
4. P18每次只评估Approved scope中的一个exact target；scope-wide展开固定后移R06.6 immutable plan。
5. frozen Step07~12只登记affected use；R06.8后按用户确认逐Step传播，本批不修改。

| checkpoint item | conclusion |
|---|---|
| P13~P18 affected definition sync | pass；§§9.13/9.15~9.24、§11.8.5~§11.8.11与本节一致 |
| duplicate canonical owner | none；policy归`domain::policies`，decision/state归owning module，authorization唯一归`domain::maintenance` |
| complete snapshot / stale decision | pass；target/scope/version/dependency/current lookup与P10/P11/P13/P17按各入口total binding |
| business/source/external truth write | none |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；P1~P18与H1~H7已闭口，仍需H8~H13及R06.6~R06.8 |
| historical checkpoint | `R06.5-E_done_waiting_user`；已由F批消费 |
| historical pointer | `R06.5-G_done_waiting_user`；该 affected-definition 已被 R06.6 输入审查消费，当前入口见主控、flow、项目台账与 R06.6 输入专项 |

## 23. R06.5-F H4~H7 affected-definition reconciliation（historical，已由G批消费）

本节只登记F批H4~H7对R06.4 canonical handoff、retention、no-write与read对象的最终消费关系。H4~H7 concrete record schema和67-type账只见R06.5专项§§61~65；本文件不建立第二套record、revision、change或metadata definition。

### 23.1 H4 handoff / authenticity consumption

| accepted owner | historical affected shape / proof | H4 mapping | no-fabrication boundary |
|---|---|---|---|
| `ReportHandoffTransition` | complete previous lifecycle/readiness/delivery/hint/gap/visibility/retention/no-write/block/time pairs；post handoff补current fields | apply-readiness nonblocked/blocked、prepare、hint attach、delivery、policy block各由typed accepted tag映射H4 | cancel reserved；exact replay no transition/record |
| `HandoffReadinessDecision` | `pub(crate) proves_accepted_transition`比较P7 complete pre-snapshot、transition和post handoff | readiness/prepared/blocked branch复制exact P7 basis | Ready/Delivered不等于acceptance、verdict或signoff |
| `AuthenticityHintTransition` | exact `handoff_ref` + before/after origin/reason/gap/time | P6 outcome映射trusted/placeholder/insufficient三种H4 kind | hint identity不是真实evidence alias；terminal replay no record |
| `AuthenticityHintDecision` | records sibling proof比较complete handoff/input/linkage/origin/gap snapshot与post hint | hint branch复制exact P6 basis | no policy reevaluation inside record factory |

`ReadinessBlocked`专指lifecycle保持、readiness进入Blocked；`PreparationBlocked`专指fresh P7 Blocked decision使handoff进入Failed。DeliveryRecorded是adapter-independent local result且basis None；hint attachment也是direct branch，不能复制aggregate旧P6/P7 basis。

### 23.2 H5 retention / protection consumption

| canonical operation | current affected proof | H5 result |
|---|---|---|
| `RetentionMarkerTransitionKind::DecisionApplied` | transition保存previous relation/archive/reasons和evaluated protection state/set；`RetentionMarkerDecision`证明reconciled post protection binding | ActiveHold/ReleaseEligible/Conflict分别生成一条marker H5 + P8 basis |
| `RetentionMarkerTransitionKind::ArchiveEligibilityAttached` | state-preserving exact archive-ref change，evaluated set empty | one direct H5；basis None，不表示archive package/acceptance |
| `ActiveReferenceProtectionTransitionKind::ConsumerAttached` | exact newly inserted consumer + previous/current sets | one direct H5；basis None |
| `ConflictMarked` | exact direct current conflict reason | one direct H5；basis None |
| `ReleaseDecisionApplied` | `ActiveProtectionReleaseDecision::proves_accepted_transition`绑定complete consumer snapshot、pre/change/post | Protected/Expired/Released/Conflicted分别映射H5 + exact P8 basis |

P8 two-stage UoW在两个对象均变化时生成两个不同`RetentionChangeRecordRef`、共享一个Observation cursor。cursor不表达intra-UoW顺序；marker record必须通过decision binding和`evaluated_protection_state`证明它消费了reconciled protection post-state，reader不得按PK/time/row order猜先后。ReleaseEligible/Expired/relation Released均不执行cleanup、archive或delete。

### 23.3 H6 no-write / H7 read boundary

| family | current affected definition | record boundary |
|---|---|---|
| `NoWriteViolationTransition` | 增加exact `trigger_context_ref`，并保存target、from/to、before/after escalation/close reason | five legal lifecycle pairs映射H6；initial Detected creation无record |
| P10 `NoWriteGuardDecision::Blocked` | 只解释attempt boundary，不驱动violation member | alone explicit no-record；local target不得伪造`ForbiddenWriteTargetRef`、violation或H6 |
| H6 metadata origin | 本次accepted block/escalate/close writer lane | 与原始`NoWriteTriggerKind`是不同维度；不得强制相等或复制P10 basis |
| `ReadVisibilityDecision` | `no_write_policy_basis()`和`proves_post_state()`为future H7 sibling inspection | future initial async acceptance保存P11/P10 basis；current phase无producer |
| `ReadVisibilityTransition` | complete before/after kind/constraint/gap/block payload | future reevaluation H7 input；current synchronous Query不产生transition |
| `ReadVisibilityState` / async envelope | private phase-reserved factory/member优先返回`ReservedTransition` | current无id mint、UoW、cursor、record/outbox/context row或config enablement |

H6 Closed只表示local lifecycle closure，不表示source/external target已修复。H7的schema存在不构成writer证据，read visibility也不是actor authorization token；未来解除门禁必须重新设计explicit Command/Consumer protocol、idempotency、UoW、repository、flow和tests。

### 23.4 UoW affected propagation与checkpoint

F批H4~H6 durable record都要求`ObservationCommittedCursor::Observation`；H7 future contract同样要求Observation cursor。冻结Step07/09/11把record stage放在cursor allocation之前，无法构造typed metadata，故共同登记`R06-F-AFFECT-UOW-01=open_controlled`。current顺序固定为`borrow-stage truth/state -> assign one cursor -> construct/stage record -> outbox/stale/result -> commit`；save port必须保留record factory所需same-UoW post-state，当前合并的`save_no_write_violation(violation, record, ...)`必须拆成versioned violation stage与cursor后H6 append。本批不修改冻结文件，R06.8后解冻Step07时必须同步Step09/11/16，且不得要求aggregate实现`Clone`或重读row替代post-state。

| checkpoint item | conclusion |
|---|---|
| H4 handoff/hint mapping | pass；direct/P6/P7 provenance与lifecycle/readiness区别明确 |
| H5 marker/protection mapping | pass；five operation kinds、ten result rows、two-stage relation闭口 |
| H6 no-fabrication | pass；only existing accepted violation transition，P10 block alone no-record |
| H7 current writer | none；phase_reserved，Query zero-write |
| duplicate canonical owner | none；truth/transition/decision仍归owning R06.4 module，record归R06.5 logical `domain::records` |
| business/source/external truth write | none；无cleanup、repair、acceptance、verdict、signoff或body |
| downstream affected item | `R06-F-AFFECT-UOW-01=open_controlled`；未修改Step07~19/formal03/04 |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；仍需G及R06.6~R06.8 |
| historical checkpoint | `R06.5-G_done_waiting_user`；本节的F affected-definition已被G批消费，current gate见§24 |
| next allowed | 等待用户明确确认；确认后只读取R06.6输入标准，不自动写入R06.6；当前不需要提交 |

## 24. R06.5-G affected-definition addendum

本节只登记 H8~H13 对 R06.4 canonical transition、creation proof、state owner 与 public boundary 的消费关系；不复制 R06.5 record/revision/change schema。若旧章节仍出现 F checkpoint 或“从 current row 推断 before”的描述，以本节与 R06.5 专项 §§66~73 为 current authority。

### 24.1 gap / degraded creation proof（H8）

| canonical owner | G 批 required shape | H8 consumption | boundary |
|---|---|---|---|
| `GapState::open_from_decision` | 返回 `(GapState, GapOpened)`；proof 带 gap/source/kind/affected/opened-at/P12 basis | H8 `Opened` 使用 proof + same-UoW `GapState`，`before=None` | 不从 missing row、after state或repository absence推断 gap creation |
| `DegradedOutputState::create_from_decision` | 返回 `(DegradedOutputState, DegradedOutputCreated)`；proof 带新 revision/affected/scope/gap/P13 basis | H8 `DegradedOutputCreated` 使用 proof + same-UoW degraded/gap state | 无 exact `gap_ref` 的 normal/blocked revision显式 no-record |
| `DegradedOutputTransition` | 保留 previous/current revision refs、affected object/scope、conditional fields和P13 basis | H8 `DegradedOutputReplaced`使用完整 before/change/after | degraded branch不打开/关闭/重分类 gap |

`GapState::Suppressed` 仍是 current suppress/unsuppress 的 reserved state；只有已存在的 Suppressed row 通过 typed close 进入 Resolved 时才有 H8 lifecycle record。H8 不拥有 P12/P13 decision、不创建 identity、不写 source 或 view。

### 24.2 peripheral terminal wording（H9）

`PeripheralDeliveryTransition` 与 `ExportPreparationTransition` 继续是两个 canonical owner。H9 按 tagged subject 分开记录 preparation 和 delivery；P14 basis 只来自 policy-driven prepare/block/decision branch，adapter-independent result、gap attachment、retryable failure 不借用旧 basis。`Delivered` 仅表示本地 adapter boundary 已记录，不能改写为 external accepted、consumer received、audit verdict 或 signoff。`PermanentFailure` / `Rejected` 是 local terminal outcome；没有后续 outgoing delta，不等于 source 或 external lifecycle failure。

### 24.3 reference new-snapshot boundary（H10）

`ReferenceSnapshotTransition` 仅负责同一 `ReferenceSnapshotStateRef` 的 in-place 变化。`RequireNewSnapshot` 由 `ReferenceSnapshotState::create_from_required_new_snapshot(...)` 与新对象共同返回 `ReferenceSnapshotCreated` proof；H10 必须保存旧 Invalid snapshot 的完整 before 与新 identity after，并分别校验 P17 maintenance basis、P15 freshness basis、same-target/P10 关系。不得把旧 Invalid row覆盖为 Resolved，也不得从 absence伪造 creation transition。`PreserveCurrent`、P16 structural success、resolver rejected/error 或 malformed result均为 no-record/error boundary。

### 24.4 diagnostic change 与 H11 handoff

`DiagnosticSummaryTransitionChange` 是 R06.4 唯一 change carrier，五个 typed variant 分别为 signal/gap/no-write attachment、stale、unavailable。H11 必须消费该 carrier 与完整 previous/current set、reason、freshness、cursor/time pair；不得通过 set 差异猜测 change kind，也不能由同步 Query 暗写 H11。H11 的 `SignalRollupTransition` 另有 R06.3 §24 addendum，dual namespace cursor保持分离。

### 24.5 maintenance / replay handoff（H11/H13）

`ProjectionMaintenanceTransition`、`RollupRebuildTransition` 保留 start 分支的 P17 basis 与 authorization fields，complete/fail 分支固定无 basis；H11 只记录 observation-side derived maintenance，不创建 job/report 或 source repair。`ReplayCoordinationTransition` 绑定一个 Approved `ReplayScopeRef`、一个 `ReplayCoordinationRef` 与一个 exact `MaintenanceTargetRef`；H13 每个 target 独立记录，Start/Blocked 才保存 P18 basis，Completed/Failed 不借用旧 basis，changed refs 仅来自 Completed accepted result，空集或 target singleton均须显式。H13 不迭代 scope、不执行 replay、不创建 job/run/claim/report。

### 24.6 G affected gate

| check | conclusion |
|---|---|
| creation proof ownership | pass；H8/H10 creation proof由owning state factory与新对象共同产生 |
| peripheral terminal semantics | pass；local Delivered/Failure与external acceptance分离 |
| diagnostic/rollup change carrier | pass；typed change与完整 before/after字段已闭口 |
| per-target replay | pass；scope/coordination/target三重 identity不可折叠 |
| duplicate owner | none；R06.4拥有truth/transition，R06.5拥有record/revision/change |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；G已完成，但Step06仍需R06.6~R06.8与后续受影响审计 |
| planned verification | only；未执行测试、未生成commit/run/evidence/signoff |
| historical checkpoint | `R06.5-G_done_waiting_user` |
| historical next allowed | 读取 R06.6 输入标准；该动作与A/B批均已完成，当前指针为 `R06.6-B_done_waiting_user` |

## 25. R06.6-F2 boundary / maintenance affected-definition reconciliation

本节是本文件当前addendum，优先于§§23~24中的历史next pointer。它只回灌F2 assembler对R06.4 canonical truth/state/transition对象的借用、阶段和禁止副作用，不复制`application::unit_of_work` plan、record schema、repository trait或下游函数流。F2完整对象与顺序合同唯一见`03_ddd_step_06_application_record_uow_assembly.md`。

### 25.1 H11 cursor-dependent rollup closure

`SafeSignal`与`CorrelationContext`可以在cursor前完成accepted mutation并按borrow-stage规则暂存；`SignalRollupWindow::accept_signal`仍是唯一current cursor-dependent primary，因为其domain member必须取得exact `ObservationCursor`。application必须保留mutable rollup、loaded version、signal、context和H11 metadata seed，直到唯一Observation cursor分配后按以下局部顺序完成：

```text
assign one Observation cursor
  -> SignalRollupWindow.accept_signal(signal, context, observation_cursor)
  -> while local SignalRollupTransition is alive, construct exact H11 record
  -> borrow-stage save_rollup(&rollup, expected_version, uow)
  -> materialize remaining records and followers
```

该顺序不改变`SignalRollupWindow`、`SignalRollupTransition`或H11的owner。local transition不得跨函数/任务逃逸；rollup不得实现`Clone`来规避借用，也不得在record factory前重读repository。若planned obligation下`accept_signal`返回no transition，整个UoW按assembly invariant失败并回滚；不得只提交signal、只保存rollup或省略H11。

### 25.2 H12 shared post-state and Job commit guard

`GapScanPostState`由exact accepted gap-scan item result一次构造，并由H12 factory以`&GapScanPostState`借用。相同post-state字段继续供immutable item classification、`JobReportItemFold`与scope report fold使用；H12不得consume该值、从item outcome反向重建、从discovered refs推导H8 mutation，或重读current gap rows。

| phase | required boundary | prohibited shortcut |
|---|---|---|
| protected classification before cursor | exact claim tuple作为UoW commit guard只注册一次；item使用独立row version/CAS | naked fence boolean、只做preflight后不在commit重验、重复注册guard |
| pre-dispatch materialization | H12 record、typed item classification、Draft report item/scope fold均在首次record append前验证完成 | append H12后才发现fold失败、由report summary反推item truth |
| post-record follower stage | stage already-classified item并以独立report CAS保存already-folded Draft report | 重新分类item、重跑fold、把claim guard当follower row |
| commit | atomically revalidate once-registered claim guard、item CAS、report CAS及所有staged writes | claim-only success、record-only success或report-only fallback |

plan/start、claim/heartbeat、report seal、finalize-only UoW没有H12 accepted item，必须绕过F2 assembler。`ScanObservationGaps`只有在一个具体item形成H12-compatible accepted result时才写H12；每个独立H8 gap/degraded mutation仍须有自己的P12/H8 accepted proof，不能由H12 discovered set自动生成。

### 25.3 H13 controlled upstream conflict

`ReplayCoordinationState`和`ReplayCoordinationTransition`继续是R06.4 per-target truth/transition owner。current H13只接受一个Approved `ReplayScopeRef`、一个existing `ReplayCoordinationRef`、一个exact `MaintenanceTargetRef`和对应accepted transition；`CoordinateObservationReplay`是唯一current H13 operation writer。

formal `02`的`DefineReplayScope -> ReplayExecutionRecord`缺少coordination identity、target和transition，登记为`R06.6-F2-H13-UPSTREAM=open_controlled`。在该上游冲突被单独裁定并回灌前：

1. `DefineReplayScope`可以提交其observation-owned scope mutation和该操作自身明确要求的non-record follower；
2. scope-only branch不得mint `ReplayExecutionRecordRef`、构造H13 obligation或伪造coordination transition；
3. 不得把scope-wide target enumeration、Job plan、claim或report当作H13 accepted input；
4. 只有同UoW另有独立current H-family accepted transition时，才为那个独立transition调用F2 assembler。

本节不决定新增“replay scope lifecycle record”还是将scope mutation正式标为explicit-no-record，因为两者都会改变已完成概要对象/record pool。该裁定必须在formal `03`重装配前完成，且不能由实现agent自行选择。

### 25.4 observation-only truth and no-write boundary

F2只把accepted observation-side truth/state投影为typed append-only record、projection membership/stale marker、outbox snapshot、stored result和Job item/report follower。它不获得source/business truth writer，也不改变R06.4对象的含义：

- H11 `Completed`只表示本地derived maintenance完成，不表示source repaired或外部事实正确；
- H12 accepted item只表示本地bounded scan分类，不证明source completeness或absence；
- H13 `Completed`只表示exact target的local coordination result，不表示scope-wide replay成功；
- H10 Reference cursor只排序本仓reference snapshot mutation，不成为Identity/Governance/Artifact/Runtime版本truth；
- report/handoff/delivery follower不生成真实run id、evidence alias、verdict、signoff或external acceptance；
- Query、duplicate、claim-only、report-only、finalize-only和publisher marker-only路径不能借F2制造审计记录。

known pre-commit/commit failure回滚本仓同UoW全部可见write；`CommitOutcomeUnknown`保持ambiguous，不能声称rollback、自动重试或反写业务truth来“修复”。

### 25.5 F2 affected gate

| check | current conclusion |
|---|---|
| H11 cursor-dependent order | pass_design_only；cursor后member -> local transition内H11 factory -> borrow-stage rollup save |
| H12 post-state sharing | pass_design_only；`&GapScanPostState`供record、item与report fold共同消费 |
| claim/item/report ordering | pass_design_only；once-register guard、pre-append fold、independent CAS、commit revalidation |
| H13 operation authority | controlled；只有`CoordinateObservationReplay`可写H13，upstream conflict保持open |
| duplicate truth owner | none；R06.4仍拥有truth/transition，R06.5拥有record，F2只拥有process-local assembly |
| source/business truth write | none；无repair、cleanup、external acceptance、verdict或signoff |
| downstream propagation | `R06-F-AFFECT-UOW-01=open_controlled_downstream`；Step07/09/11/13/16保持冻结 |
| planned verification | only；未执行实现测试，未生成commit、run id、evidence alias或验收签署 |
| current pointer | `R06.6-F2_done_waiting_user_before_R06.7`；等待用户明确确认，不自动进入R06.7 |
