# Step 10. 状态机与转换矩阵

## 1. Step 状态

- 状态：`completed / stop_review`
- `gate_status=formal_stop_review`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10
- 回填章节：未来正式 `03-详细设计.md` §9 状态机与转换矩阵
- 框架参考：`projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`；采用“状态主语筛选→按状态族分批→每状态机 ASCII 图/语义/完整转换矩阵/单机停审→跨状态审计”粒度，不复制 Governance 状态、outbox、projection 或 Rust 表达。
- 前序门禁：Step 9 已完成 10 Command、13 Query、3 conditional Consumer、3 Job 的逐 flow 停审，并先回补 Step 6～8 发现的 callable/read/replay seam。
- 正式 03 写入：`false`；Step 11 写入：`false`。

### 1.1 状态矩阵批次表

| 批次 | 状态族 / 主语 | 数量 | 状态 | 单批停审 |
|---|---|---:|---|---|
| 10.0 | 主语筛选、通用规则、错误与副作用词汇 | n/a | completed | pass_with_blockers |
| 10.1 | CP1：`SyncOperation`、`AccessEvaluation`、`ExternalOwnerSnapshot` | 3 | completed | pass_with_blockers |
| 10.2 | CP2：`WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet` | 4 | completed | pass_with_blockers |
| 10.3 | CP3：`MaterializationPlan`、`PathChangeSet`、`MaterializationRun` | 3 | completed | pass_with_blockers |
| 10.4 | CP4：`ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord` | 4 | completed | pass_with_blockers |
| 10.5 | CP5：`ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord` | 3 | completed | pass_with_blockers |
| 10.6 | 技术 disposition、跨状态传播、forbidden transition、Step 11～16 handoff、最终审计 | n/a | completed | pass_with_blockers |

## 2. 本步目标与输入

本步把 Step 6 的正式 enum/state carrier、Step 9 的实际推进 flow 与 Step 7 repository/UoW seam 收敛为代码必须逐条拒绝非法迁移的矩阵。它不定义数据库列、锁实现、重试次数、CLI 文案或外部 owner lifecycle。

| 输入 | 本步用途 |
|---|---|
| `03_ddd_step_06_object_contracts.md` | 17 个 lifecycle carrier、exact state labels、factory/transition helper 与字段不变量。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | versioned read/save、UoW、external/tool/read-only capability 与 replay repository。 |
| `03_ddd_step_08_protocol_contracts.md` | 哪个 Command/Consumer/Job 可触发状态，Query 只暴露不得推进。 |
| `03_ddd_step_09_function_flows.md` | 每个 transition 所在 flow、prepare/call/finalize、known/unknown 与测试切口。 |
| 正式 02 §9 / HLD Step 9 | 17 主语、多轴状态与禁止传播的概要基线。 |
| Governance Step 10 | 单状态机矩阵和停审框架；不作为 Sync 业务真相。 |

## 3. SOP 问题回答

1. **哪些对象进入状态矩阵？** 仅 Step 6 有正式 state/outcome/integrity/continuity 字段、Step 9 会读取或推进且会改变允许操作的 17 个 local objects。
2. **哪些对象排除？** immutable `SyncSelection`、`WorkingCopyObservation`、`SourceDelta`，七个 stateless policies，derived `LayeredHandoffStatus`/`SyncStatusView`，全部 DTO/ref/marker，以及 Project/Artifact/Baseline/Review Gate/Decision/Workspace/Archive/Git remote truth。
3. **是否有 global sync state？** 没有。`Completed`、`Valid`、`Fresh`、`Finalized`、`TerminalKnown` 都必须带对象主语，不能合成 `Success`。
4. **谁能推进状态？** 只有 Step 9 明示的 Command、conditional Consumer、Job 或其 owning application service调用 Step 6 exact helper并通过 versioned local UoW提交。Query/view/adapter mapper不得推进。
5. **非法转换如何处理？** Domain helper返回 `SyncDomainError{kind:"invalid_transition",subjectRef,from,to}`；guard/context错误分别返回 `context_mismatch`、`invariant_violation`、`blocked` 或 `unsupported`，repository concurrency在 application层保留为 `ApplicationPortError.concurrency_conflict`。
6. **外部 effect 与本地状态如何关联？** durable prepare先提交；call在 UoW外；known result在新 UoW推进，unknown进入 checkpoint/probe轴。Local rollback不能声明 external effect未发生。
7. **状态恢复是否原地复活？** 除矩阵明确的 revalidation/self-revision外，terminal/degraded对象不原地变成 positive state；使用新 evaluation/snapshot/plan/run/probe/candidate或新 generation记录并保留 provenance。

## 4. 状态主语筛选

### 4.1 进入矩阵的 17 个主语

| 状态族 | 主语 | 正式 carrier | Step 9 读取/推进 | 为什么进入 |
|---|---|---|---|---|
| local operation | `SyncOperation` | `state: SyncOperationState` | 全部 mutation、Resume/Cancel/status | 决定 validation/stage/recovery/local terminal。 |
| access/reference | `AccessEvaluation` | `outcome: EligibilityOutcome` + `freshnessState` | shared gate、consumer、stale job/query | 决定 mutation eligibility；状态只可变得更保守。 |
| access/reference | `ExternalOwnerSnapshot` | `freshnessState: FreshnessState` | owner capture、consumer/job、status | 决定 snapshot 是否可作为 guard input，不是 owner truth。 |
| metadata | `WorkingCopyBinding` | `state: WorkingCopyBindingState` | Clone/Migrate/Rebind/scan/status | 决定 relation 可否用于 mutation。 |
| metadata | `MetadataManifest` | `integrityState: MetadataIntegrityState` | Clone/Migrate/scan/status | 决定 logical metadata 可写姿态。 |
| metadata | `CursorState` | `continuityState: CursorContinuityState` | Clone/Pull/invalidation/status | 决定增量 continuity 与 applied cursor资格。 |
| metadata | `MappingSet` | `integrityState: MappingIntegrityState` | Clone/Pull/invalidation/status | 决定 source-local mapping可否参与 plan/finalize。 |
| materialization | `MaterializationPlan` | `state: MaterializationPlanState` | Clone/Pull/Resume/consumer | 一次性 plan是否可消费。 |
| materialization | `PathChangeSet` | `safetyState: PathChangeSafetyState` | Clone/Pull/pre-apply | 决定 bounded path intent是否可 stage。 |
| materialization | `MaterializationRun` | `state: MaterializationRunState` | Clone/Pull/Resume/status | 区分 prepare/apply/local visibility/partial/unknown。 |
| recovery | `ConflictRecord` | `state: ConflictState` | detection/Resolution/Resume/query | 区分 conflict fact、intent与known-safe closure。 |
| recovery | `RecoveryCheckpoint` | `state: RecoveryCheckpointState` | all effect boundaries/Resume/Probe/Cancel | 决定 local resume、probe或停止。 |
| recovery | `ManualResolution` | `state: ManualResolutionState` | RecordResolution/Resume/query | 区分 actor intent、validation与actual effect。 |
| recovery | `ProbeRecord` | `state: ProbeRecordState` | Probe command/job/status | 正式保存 prior-attempt probe history。 |
| handoff | `ReviewCandidate` | `state: ReviewCandidateState` | PushReview/consumer/drift/query | 决定 candidate是否 frozen且未漂移。 |
| handoff | `HandoffAttempt` | `state: HandoffAttemptState` | Push/Probe/Refresh/consumer/query | 分离 local attempt、transport、unknown、external owner层。 |
| provenance | `ProvenanceRecord` | `state: ProvenanceRecordState` | all mutation/scan/query | 决定 relation保护、替代与完整性可见性。 |

### 4.2 明确排除

| 排除类别 | 对象 / carrier | 原因与处置 |
|---|---|---|
| immutable value/classification | `SyncSelection`、`WorkingCopyObservation`、`SourceDelta` | factory后不做 lifecycle transition；内部 dirty/delta等分类只作为 guard输入。 |
| stateless policy | `OperationEligibilityPolicy`、`WorkingCopySafetyPolicy`、`MetadataIntegrityPolicy`、`MaterializationSafetyPolicy`、`RecoverySafetyPolicy`、`CandidateEligibilityPolicy`、`HandoffResultPolicy` | 只产生 typed decision，无 repository lifecycle。 |
| derived view | `LayeredHandoffStatus`、`SyncStatusView`、`SyncReadCompleteness` | 聚合来源状态与读取完整性；query no-write，不得反向推进 truth。 |
| application/entry result | `CommandDisposition`、`ConsumerDisposition`、`JobDisposition`、adapter availability | 是一次调用/读取/报告分类；§13 审计映射，不新增 durable global lifecycle。 |
| replay carrier | `SyncIdempotencyRecord`、`StoredSyncOperationResult`、`StoredConsumerReceipt`、`StoredSyncJobResult` | 本轮只定义 duplicate/unknown纪律；其精确 persistence state由 Step 11/13，不能在此发明 enum。 |
| external truth | Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote | L5-sync只能保存 ref/body-free snapshot；绝不迁移 owner lifecycle。 |
| infrastructure detail | lock、transaction、retry counter、process exit、connection/cache/UI | 不属于 domain truth；Step 11～15分别处理。 |

筛选结论：17 个进入，其他全部排除；不新增 `GlobalSyncState`、`OverallStatus` 或第 18 个 lifecycle object。

## 5. 通用状态矩阵规则

1. `factory` 表示尚无该 identity的 repository record；create 使用 `ExpectedLocalVersion.absent`。
2. 所有 existing-object transition先 `getVersioned`，helper成功后以 repository返回的 version作为 expected version保存；并发冲突不重算、不覆盖。
3. “state-preserving revision”不是绕过状态机：它只更新该状态允许的附属 ref/summary，仍需 helper、guard、versioned save与测试。
4. grouped `From` 只代表表内明确列出的 states；不得把 `active/nonterminal`自行扩展到 terminal states。
5. `Terminal=是` 表示同一 identity不再发生 lifecycle迁移；它仍必须可读、可被 provenance引用且不得物理伪删。
6. positive state只能由 formal proof产生；network恢复、cache、时间戳、Git commit、ACK、日志或 retry次数不是 proof。
7. cross-object propagation必须由 §12 的显式 flow + UoW提交；不存在 observer side effect。
8. Domain非法迁移统一返回 `SyncDomainError.invalid_transition`；缺 proof/ref/context时在进入 helper前或helper内返回稳定 typed error，绝不 silent no-op。Duplicate只有 request digest相同且已有 stored result时才是 replay no-op。

### 5.1 单状态机停审模板

每个状态机均必须同时具备：ASCII图、状态语义/终态/允许操作、完整 From→To 矩阵、Step 6 exact helper、Step 9 flow、前置读取/guard、state副作用、flow副作用、非法错误、合法与非法测试切口。表外转换全部非法。

## 6. CP1 Selection & Access 状态矩阵

### 6.1 `SyncOperationState`

```text
[SyncOperation]
  factory -> Planned -> Validating -> Ready -> Running -> Completed
                  |         |         |          |\
                  |         |         |          | +-> FailedKnown
                  |         |         |          +---> NeedsAction
                  |         |         +-------------> Completed
                  |         +----------------------> NeedsAction
                  +--------------------------------> Cancelled
  NeedsAction -> Validating
  every non-terminal state --explicit cancel--> Cancelled
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Planned` | explicit selection/operation intent 已记录，尚未开始 eligibility validation | 否 | begin validation、cancel、known fail |
| `Validating` | 正在以 current owner/local facts执行门禁 | 否 | ready、needs-action、cancel、known fail |
| `Ready` | 当前门禁通过，可准备一个明确 stage | 否 | durable checkpoint后 begin stage；无-effect local no-op可 complete；cancel/fail |
| `Running` | 一个明确 local/external stage 已 durable prepare并开始 | 否 | complete、needs-action、cancel、known fail |
| `NeedsAction` | 必须显式 revalidate/replan/probe/manual/stop | 否 | explicit Resume引导 begin validation；cancel/fail |
| `Completed` | owning local use case结果已知完成 | 是 | read/replay only；不表示 owner/Review成功 |
| `Cancelled` | local continuation已停止 | 是 | read/replay/probe related external attempt only |
| `FailedKnown` | local use case已知失败且effect边界明确 | 是 | read/replay/new operation only |

| From | To | Step 6 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Planned` | `planSyncMutation(input)` | every Command first-use | explicit selection已构造；operation id/correlation/kind来自 request/context/IdPort | 新 identity、selection/kind/correlation/transition ref | append selection/operation + reserve idempotency | invalid_input / context_mismatch |
| `Planned` | `Validating` | `beginOperationValidation(operation,evaluationRef,transitionRef)` | shared eligibility gate | versioned operation；evaluation属于same selection/action | state/lastTransition更新 | save operation，关联评价依据 | invalid_transition / context_mismatch |
| `NeedsAction` | `Validating` | `beginOperationValidation(operation,evaluationRef,transitionRef)` | `ResumeSyncOperationFlow` | explicit resume；current checkpoint/fingerprint；不得直接Running | state/transition更新，保留checkpoint历史 | revalidation branch保存revision | invalid_transition / blocked |
| `Validating` | `Ready` | `markOperationReady(operation,proofRef,transitionRef)` | Clone/Pull/Push/Rebind and owning Commands | `LocalExecutionRecordRepository.getEligibilityProof` returns current Fresh+Eligible same-context proof；local hard gates通过；transition record同UoW append | state/transition更新 | versioned save before stage preparation | invalid_transition / blocked |
| `Ready` | `Running` | `beginOperationStage(operation,stage,checkpointRef,transitionRef)` | Clone/Pull/Push/Probe/Resume owning stage | durable checkpoint/attempt/run已先提交且ref匹配 | active checkpoint + state/transition | versioned save；facility/external call随后且在UoW外 | invalid_transition / invariant_violation |
| `Validating` / `Running` | `NeedsAction` | `requireOperationAction(...)` | any blocked/conflict/unknown branch | typed reason；optional conflict/checkpoint属于operation | state + checkpoint/transition，历史保留 | save conflict/checkpoint/provenance/result | invalid_transition / context_mismatch |
| `Ready` / `Running` | `Completed` | `completeLocalOperation(operation,resultRef,transitionRef)` | known local/no-op/finalize paths | construct and append `LocalOperationResultRecord` + `LocalTransitionRecord` in same UoW；materialization时Run Finalized | terminal state/result transition ref | same UoW保存result/idempotency/provenance | invalid_transition / invariant_violation |
| `Planned` / `Validating` / `Ready` / `Running` / `NeedsAction` | `Cancelled` | `cancelSyncOperation(...)` | `CancelSyncOperationFlow` | explicit actor/reason；保留possible external attempt | terminal local state；不修改external layer | save checkpoint posture/provenance/stored result | invalid_transition |
| `Planned` / `Validating` / `Ready` / `Running` / `NeedsAction` | `FailedKnown` | `failOperationKnown(...)` | any pre-effect or known-result failure branch | safe failure且effect boundary可证明；raw error禁止 | terminal local state | save safe result/provenance/idempotency | invalid_transition / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| enum/helper/flow一致 | pass；8 labels均来自Step 6，所有迁移有exact helper与flow。 |
| 合法测试 | factory、Planned→Validating→Ready→Running→Completed、NeedsAction→Validating、Ready no-op→Completed、每个active→Cancelled/FailedKnown。 |
| 非法测试 | terminal reopen；Planned→Ready；NeedsAction→Running/Completed；Running无result→Completed；Cancelled冒充external rollback。 |
| blocker | positive Ready受 `SYNC-UP-001/003`；external unknown受 `004/005`，blocker不改变矩阵。 |

### 6.2 `EligibilityOutcome`（`AccessEvaluation`）

```text
[AccessEvaluation]
  factory -> Eligible / Denied / Blocked / Unknown
  Eligible / Denied / Blocked / Unknown -> Stale
  Eligible / Denied / Unknown          -> Blocked
  non-positive -> new evaluation record (never mutate to Eligible)
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Eligible` | current selection/action的全部正式 checks fresh且通过 | 否 | mutation guard input；后续只可 stale/block |
| `Denied` | owner明确拒绝当前 action | 否（可因basis失效转Stale） | read/replay；新请求需新 evaluation |
| `Blocked` | contract/posture/local hard blocker阻止结论或动作 | 否（可因basis失效转Stale） | read/needs-action；新 evaluation |
| `Unknown` | 无法取得权威完整结论 | 否（可 stale/block） | read/needs-action；新 evaluation |
| `Stale` | basis snapshot/action/context已不可用于 mutation | 是（对本 record） | read/history；创建新 evaluation |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Eligible` / `Denied` / `Blocked` / `Unknown` | `evaluateAccess(input,policy)` | shared eligibility gate | runtime-validated owner result set + same selection/action + clock；缺required check不得Eligible | 写 outcome/freshness/reasons/snapshot refs | append/save evaluation and snapshots | invalid_input / blocked / unsupported |
| `Eligible` / `Denied` / `Blocked` / `Unknown` | `Stale` | `markAccessEvaluationStale(evaluation,reason)` | invalidation consumers、`MarkStaleOwnerSnapshotsFlow` | versioned evaluation；typed invalidated snapshot/action/context | outcome=`Stale`且freshness=`Stale` | save revision；使unconsumed plan/candidate更保守 | invalid_transition / context_mismatch |
| `Eligible` / `Denied` / `Unknown` | `Blocked` | `blockAccessEvaluation(evaluation,reason)` | shared gate/local hard blocker propagation | typed hard blocker；不得用adapter error text构造 | outcome=`Blocked` + safe reason | save revision/operation NeedsAction | invalid_transition / invariant_violation |
| `Eligible` / `Denied` / `Blocked` / `Unknown` during pre-persistence construction | same outcome | `attachOwnerSnapshot(evaluation,snapshotRef)` | shared gate before first durable evaluation | construction-phase only；snapshot subject/context match且去重；persisted evaluation不可借此扩充basis | snapshot ref set更新；不改变outcome | 与snapshot/evaluation同UoW首次保存 | context_mismatch / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| 双字段不变量 | `Eligible`必须fresh；`Stale`同时收紧freshness；不得出现Eligible+Stale snapshot。 |
| 合法测试 | factory四种结论；各非Stale→Stale；Eligible/Denied/Unknown→Blocked；snapshot去重。 |
| 非法测试 | Denied/Blocked/Unknown/Stale→Eligible；Stale原地恢复；跨selection/action复用；缺check默认allow。 |
| blocker | `SYNC-UP-001/003` 未闭合时positive Eligible adapter path blocked；negative/unknown矩阵仍可实现。 |

### 6.3 `FreshnessState`（`ExternalOwnerSnapshot`）

```text
[ExternalOwnerSnapshot]
  factory -> Fresh / Stale / Unknown / Invalidated / Unavailable
  Fresh -> Stale / Invalidated / Unavailable
  any non-Fresh state -X-> Fresh       (create a new snapshot instead)
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Fresh` | formal owner result在对应action/rule下可作为一个guard input | 否 | subject match、eligibility basis、invalidate |
| `Stale` | 已超出正式freshness或收到可归属stale fact | 是（本record） | read/history；传播保守状态 |
| `Unknown` | 不能证明freshness/reference closure | 是（本record） | read/degraded；新owner read产生新snapshot |
| `Invalidated` | 正式owner invalidation已到达且匹配 | 是（本record） | read/history/propagation |
| `Unavailable` | owner/capability当前不可用 | 是（本record） | read/degraded；不得本地恢复Fresh |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Fresh` / `Stale` / `Unknown` / `Invalidated` / `Unavailable` | `captureExternalOwnerSnapshot(input)` | shared gate、Refresh handoff、Decision consumer | validated owner kind/subject/version/visibility/safe summary；无法证明时只能Unknown/Unavailable | 新body-free snapshot | append/save snapshot；不得保存owner body | invalid_input / invalid_external_response |
| `Fresh` | `Stale` / `Invalidated` / `Unavailable` | `invalidateOwnerSnapshot(snapshot,reason)` | two invalidation consumers、stale job | versioned snapshot；formal reason/order/subject匹配 | freshness收紧；source version不伪改 | save revision + affected evaluation/plan/candidate transitions | invalid_transition / context_mismatch |
| `Fresh` / `Stale` / `Unknown` / `Invalidated` / `Unavailable` | same/read-only decision | `redactOwnerSnapshot(...)` / `ownerSnapshotUsableForMutation(...)` | Queries/shared gate | pure read；rule/action explicit | none | none | not_applicable; pure result |

| 停审项 | 结论 / 测试切口 |
|---|---|
| owner边界 | pass；状态只描述local snapshot可用性，不迁移Project/Review/Archive。 |
| 合法测试 | factory每variant；Fresh→三种保守状态；stale event no-op via flow ordering而非非法write。 |
| 非法测试 | non-Fresh→Fresh；local clock/cache/network恢复Fresh；subject/version mismatch；raw body进入snapshot。 |
| blocker | freshness/owner exact rule受 `SYNC-UP-001/003/004`。 |

### 6.4 CP1 批次停审

| 审查项 | 结论 |
|---|---|
| 三轴独立 | pass；Operation Ready不等于evaluation/snapshot永远有效，危险stage前仍revalidate。 |
| positive proof | pass_with_blockers；Fresh/Eligible只能由正式owner adapter产生新record。 |
| terminal/replay | pass；operation terminal可回放，evaluation/snapshot历史可读但不原地复活。 |
| query no-write | pass；GetAccessEvaluation/GetSyncOperation只暴露，不触发状态。 |

## 7. CP2 Working Copy & Metadata 状态矩阵

### 7.1 `WorkingCopyBindingState`

```text
[WorkingCopyBinding]
  factory -> Initializing -> Bound -> Restricted
                 |            |  \-> NeedsMigration -> Bound
                 |            |  \-> NeedsRebind
                 |            +----> Invalidated
                 +---------------> NeedsRebind / Invalidated
  Restricted -> NeedsMigration / NeedsRebind / Invalidated
  NeedsMigration -> NeedsRebind / Invalidated
  NeedsRebind -> Invalidated
  explicit rebind => a new Initializing identity (old binding retained)
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Initializing` | explicit selection/canonical target/generation已绑定，但initial local visibility尚未证明 | 否 | attach mutation observation、Bound、NeedsRebind、Invalidated |
| `Bound` | relation/manifest/provenance已闭合；不表示tree clean/cursor continuous | 否 | plan/status、restrict、require migration/rebind、invalidate |
| `Restricted` | relation仍可读，但mutation因姿态/安全/完整性受限 | 否 | read、require migration/rebind、invalidate；不得直接恢复Bound |
| `NeedsMigration` | logical schema/generation要求显式migration | 否 | Migrate、Rebind、invalidate、read-only protected operations |
| `NeedsRebind` | selection/source/target relation必须显式重建 | 否 | Rebind creates new identity；invalidate old relation |
| `Invalidated` | 该identity永久不再可用于mutation | 是 | read/history/provenance only |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Initializing` | `initializeWorkingCopyBinding(input)` | Clone/Rebind prepare | explicit selection、canonical target、generation、manifest/provenance refs；target uniqueness | new relation identity | expected-absent save with manifest/provenance | invalid_input / already_exists |
| `Initializing` | `Bound` | `markBindingBound(binding,transitionRef)` | Clone finalization | manifest/provenance/root and initial known local result；run Finalized when materialized | state/transition更新 | same UoW with run/cursor/mapping/provenance/stored result | invalid_transition / invariant_violation |
| `Bound` | `Restricted` | `restrictBinding(binding,reason)` | integrity scan / posture safety propagation | typed restriction；versioned binding | state收紧 | save binding + provenance/item result | invalid_transition |
| `Bound` / `Restricted` | `NeedsMigration` | `requireBindingMigration(binding,targetSchemaRef)` | Migrate precondition / integrity scan | manifest decision=NeedsMigration或schema support rule | state收紧；保留generation | save binding/manifest relation；no migration side effect | invalid_transition / unsupported |
| `NeedsMigration` | `Bound` | `completeBindingMigration(binding,newManifest,transitionRef)` | `MigrateSyncMetadataFlow` | new manifest Valid；generation严格递增；old chain protected | binding切换new generation/manifest | same UoW new manifest/cursor/mapping/provenance/index | invalid_transition / generation_mismatch |
| `Initializing` / `Bound` / `Restricted` / `NeedsMigration` | `NeedsRebind` | `requireBindingRebind(binding,reason)` | Rebind detection/consumer/guard path | typed selection/source/target mismatch；不从Git/dir推断 | state收紧 | save old binding posture/provenance；new relation另建 | invalid_transition / context_mismatch |
| `Initializing` / `Bound` / `Restricted` / `NeedsMigration` / `NeedsRebind` | `Invalidated` | `invalidateBinding(binding,reason)` | explicit Rebind finalization / formal invalidation | typed reason；history/provenance retained | terminal local relation | save old binding + transition provenance | invalid_transition |
| `Initializing` / `Bound` / `Restricted` / `NeedsMigration` / `NeedsRebind` | same state revision | `attachBindingObservation(...)` | mutation flows only | persisted observation same target；query observation forbidden | lastObservationRef revision | versioned save in owning mutation UoW | context_mismatch / invalid_transition |
| prior binding | new `Initializing` identity | `explicitlyRebindWorkingCopy(input)` | `RebindWorkingCopyFlow` | explicit new selection、safety/provenance guards | old object不改写成new truth | append new binding/generation and transition provenance | invalid_input / context_mismatch |

| 停审项 | 结论 / 测试切口 |
|---|---|
| 合法测试 | init→bound；bound→restricted/migration/rebind/invalidated；migration→bound with generation+1；explicit new binding identity。 |
| 非法测试 | partial/unknown run使Initializing→Bound；Restricted直接Bound；Invalidated复活；silent selection rewrite；query attach observation。 |
| blocker | physical schema/path/provenance exact transaction受 `SYNC-UP-006/010`。 |

### 7.2 `MetadataIntegrityState`（`MetadataManifest`）

```text
[MetadataManifest]
  factory -> Valid
  Valid -> NeedsMigration / Corrupt / Unknown / ReadOnlyProtected
  NeedsMigration -> new-generation Valid manifest
  Corrupt / Unknown / ReadOnlyProtected -> new-generation manifest only after explicit migration/rebind proof
  no degraded record mutates back to Valid
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Valid` | required same-generation refs与protected provenance closure已证明 | 否 | mutation guards、attach refs、protect provenance、degrade/migrate |
| `NeedsMigration` | schema受支持但必须显式新generation迁移，或当前schema不再可写 | 是（本manifest） | read/protect；explicit migration creates new manifest |
| `Corrupt` | 已知digest/ref/schema完整性失败 | 是（本manifest） | protected read/diagnosis；不得auto repair |
| `Unknown` | 无法证明closure或读取不完整 | 是（本manifest） | degraded read/manual action；不得默认Valid |
| `ReadOnlyProtected` | legacy/provenance保护要求禁止改写 | 是（本manifest） | read/export-safe reference；new generation only |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Valid` | `initializeMetadataManifest(input)` | Clone/Rebind/Migrate prepare | schema support、binding/generation、required refs/provenance root均闭合；否则factory error | new manifest identity/generation | expected-absent save in same UoW as binding/root refs | invalid_input / invariant_violation |
| `Valid` | `NeedsMigration` / `Corrupt` / `Unknown` / `ReadOnlyProtected` | `markManifestIntegrity(manifest,state,failure,transitionRef)` | `ScanMetadataIntegrityFlow` / mutation load guard | pure policy returns exact non-Valid state；versioned reload | integrity + transition ref更新；refs不删除 | save manifest；binding restriction/migration + provenance/item result | invalid_transition / invariant_violation |
| `Valid` | `Valid` state-preserving revision | `attachManifestCursor(manifest,cursorStateRef)` / `attachManifestMapping(manifest,mappingSetRef)` | Clone/Pull finalization | same binding/generation | cursor/mapping ref更新，integrity不变 | same UoW with referenced records | invalid_transition / context_mismatch |
| `Valid` / `NeedsMigration` / `Corrupt` / `Unknown` / `ReadOnlyProtected` | same integrity state | `protectManifestProvenance(manifest,provenanceRef)` | all protection/migration paths | provenance ref真实且same context；append-only | protected set只增 | versioned save with provenance relation | invalid_transition / context_mismatch |
| `NeedsMigration` / `Corrupt` / `Unknown` / `ReadOnlyProtected` | new identity `Valid` | `migrateMetadataGeneration(input,policy)` | `MigrateSyncMetadataFlow` | explicit command；old→new closure validation；protected refs retained；new generation | old manifest不变；new manifest Valid | append new manifest and transition provenance；update binding atomically | blocked / unsupported / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| 合法测试 | valid factory；四种降级；same-generation attach；each degraded→new identity via explicit migration proof。 |
| 非法测试 | invalid init creates Valid；query/scan repairs Corrupt/Unknown→Valid；protected ref removal；cross-generation attach；in-place migration。 |
| blocker | schema/support/physical closure `SYNC-UP-006`。 |

### 7.3 `CursorContinuityState`（`CursorState`）

```text
[CursorState]
  factory -> Unset -> Continuous -> Continuous
                |         |  \-> Gap / Unknown / Unsupported
                |         +----> new-generation Unknown (old record)
                +-------------> Gap / Unknown / Unsupported
  Gap / Unknown / Unsupported -> new plan or new-generation cursor; never in-place Continuous
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Unset` | 当前generation尚无 proven locally applied cursor | 否 | observe source、first finalize、mark gap/unknown/unsupported |
| `Continuous` | observed/applied cursor关系由正式 comparator/continuity proof闭合 | 否 | read delta、incremental finalize、mark conservative state、generation invalidation |
| `Gap` | formal proof显示存在不可跨越gap | 是（本continuity chain） | block/replan/manual/full only if owner contract separately proves |
| `Unknown` | continuity/comparator/authority无法证明，或旧generation失效 | 是（本record） | read/degraded/new cursor identity |
| `Unsupported` | owner/source没有所需cursor/comparator capability | 是（本record） | blocked/full only if formal source contract explicitly supports |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unset` | `initializeCursorState(id,bindingRef,generation)` | Clone/Rebind/Migrate prepare | same binding/generation；local id | cursor refs null | expected-absent save with manifest | invalid_input |
| `Unset` / `Continuous` | same state revision | `observeSourceCursor(cursor,sourceCursorRef,comparatorRef)` | Clone/Pull source-read phase | formal source result；comparator ref not guessed | sourceObserved/comparator更新；applied不变 | versioned save only if owning mutation records observation | context_mismatch / unsupported |
| `Unset` | `Continuous` | `markInitialCursorContinuous(cursor,appliedCursorRef,run,generation)` | Clone final UoW | run AppliedPendingFinalize；same generation；target cursor/proof match | applied/observed/lastRun + continuity | commit with Finalized run/mapping/provenance | invalid_transition / generation_mismatch |
| `Continuous` | `Continuous` | `finalizeAppliedCursor(cursor,appliedCursorRef,run,generation)` | Pull known-complete final UoW | AppliedPendingFinalize；formal comparator says monotonic/continuous；same generation | applied/lastRun advance; observed retained/updated | commit with Finalized run/mapping/provenance | invalid_transition / invariant_violation |
| `Unset` / `Continuous` | `Gap` | `markCursorGap(cursor,reason)` | Pull source classification | formal comparator/continuity proof identifies gap | continuity only收紧；applied值不伪改 | save cursor; operation NeedsAction; no apply | invalid_transition / invariant_violation |
| `Unset` / `Continuous` | `Unknown` | `markCursorUnknown(cursor,reason)` | source invalidation consumer / read-contract loss | typed reason/order；versioned cursor | continuity收紧；applied history retained | save cursor + plan/candidate invalidation/provenance | invalid_transition |
| `Unset` / `Continuous` | `Unsupported` | `markCursorUnsupported(cursor,capability)` | Clone/Pull capability gate | formal adapter/source capability absent | continuity收紧 | save result/NeedsAction；no apply | invalid_transition / unsupported |
| `Unset` / `Continuous` | `Unknown` | `invalidateCursorForGeneration(cursor,newGeneration)` | Migrate/Rebind | generation strictly differs；new cursor另建 | old record Unknown/history retained | save old + new Unset cursor/provenance in UoW | generation_mismatch / invalid_transition |

| 停审项 | 结论 / 测试切口 |
|---|---|
| observed/applied | pass；observe绝不advance applied，only same-UoW finalize helper可advance。 |
| 合法测试 | init；initial/incremental finalize；gap/unknown/unsupported；generation invalidation。 |
| 非法测试 | gap/unknown/unsupported→continuous；partial/unknown run advance；opaque string/time/Git commit comparator；cross-generation run。 |
| blocker | source authority/comparator/gap contract `SYNC-UP-002/007/008`。 |

### 7.4 `MappingIntegrityState`（`MappingSet`）

```text
[MappingSet]
  factory -> Valid -> Valid
               | \-> Conflict -> Unknown / Invalidated
               |       \-> Valid (explicit resolution + proven finalize)
               \-----> Unknown / Invalidated
  Unknown -> Invalidated
  Invalidated -X-> any active state
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Valid` | same-generation source item↔local path entries闭合且无collision | 否 | plan lookup/validation、proven final update、mark conservative |
| `Conflict` | mapping/path关系有已知collision/ambiguity | 否 | explicit resolution/replan；mark unknown/invalidate |
| `Unknown` | 无法证明entry/ref/generation closure | 否（只可invalidate） | degraded read、new mapping identity；不得用于apply |
| `Invalidated` | generation/source change使本mapping永久失效 | 是 | read/history only |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Valid` | `initializeMappingSet(input)` | Clone/Rebind/Migrate prepare | empty mapping合法且binding/generation闭合；否则factory error/blocked | new identity/version | expected-absent save with manifest | invalid_input / invariant_violation |
| `Valid` | `Valid` | `prepareFinalizedMappingChanges(...)` | Clone/Pull final UoW | run AppliedPendingFinalize；validated change set；same generation；next mapping version | entries/version/lastRun revision | commit with run/cursor/provenance | invalid_transition / context_mismatch |
| `Conflict` | `Valid` | `prepareResolvedMappingChanges(mappingSet,changes,resolution,run,nextVersionRef)` | explicit Resume after RecordResolution | `ManualResolution.state=Validated`且scope覆盖changes + new plan/run AppliedPendingFinalize | resolved entries/new version/lastRun | commit with run/cursor/provenance; close conflict only after known result | invalid_transition / invariant_violation |
| `Valid` | `Conflict` | `markMappingConflict(mapping,reason)` | Clone/Pull plan guard | typed collision/rename/delete/path ambiguity | state收紧 | save mapping + conflict/checkpoint/operation NeedsAction | invalid_transition |
| `Valid` / `Conflict` | `Unknown` | `markMappingUnknown(mapping,reason)` | source invalidation/integrity guard | closure/comparator unavailable；typed reason | state收紧 | save mapping + invalidate plan/candidate | invalid_transition |
| `Valid` / `Conflict` / `Unknown` | `Invalidated` | `invalidateMappingSet(mapping,reason)` | Migrate/Rebind/source-generation invalidation | typed generation/source reason | terminal; entries retained | save old mapping + provenance; new generation mapping另建 | invalid_transition |
| `Valid` / `Conflict` / `Unknown` / `Invalidated` | same/read-only decision | `resolveMappedLocalTarget` / `validateMappingChangeSet` | plan/query guard | pure read；onlyValid可yield usable mapping decision | none | none | pure Missing/Blocked result |

| 停审项 | 结论 / 测试切口 |
|---|---|
| explicit resolution | pass；Conflict→Valid必须有resolution proof + new AppliedPendingFinalize run，不是单纯actor点击。 |
| 合法测试 | init/update/conflict/unknown/invalidate/resolved finalization；mapping version monotonic。 |
| 非法测试 | Unknown/Invalidated→Valid；Finalized-before-cursor circular guard；cross-generation reuse；auto choose collision。 |
| blocker | mapping/path/Git relation `SYNC-UP-007/008/010`。 |

### 7.5 CP2 批次停审

| 审查项 | 结论 |
|---|---|
| 四轴独立 | pass；Bound、Valid manifest、Continuous cursor、Valid mapping互不替代。 |
| generation | pass；migration/rebind建新 identities，旧cursor/mapping/provenance保留且失效。 |
| query/scan | pass；query纯读；scan只可收紧manifest/binding，不能repair。 |
| non-overwrite | pass_with_blocker；dirty/path/tool由observation/policy阻断，不靠状态机自动clean。 |

## 8. CP3 Source Materialization 状态矩阵

### 8.1 `MaterializationPlanState`

```text
[MaterializationPlan]
  factory -> Draft -> Validated -> Consumed
                \          \
                 +----------> Invalidated
  Invalidated / Consumed -X-> reusable
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Draft` | selection/binding/generation/evaluation/delta/path/fingerprint已固定，尚未全门禁通过 | 否 | validate、invalidate |
| `Validated` | 当前evaluation/cursor/observation/mapping/policy下可准备一次run | 否 | recheck、consume once、invalidate |
| `Invalidated` | 任一basis漂移/冲突/阻塞，plan不可执行 | 是 | read/history；创建新plan |
| `Consumed` | 已关联唯一 durable `MaterializationRun.Prepared` | 是 | read/history；继续由run轴推进 |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `draftMaterializationPlan(input)` | Clone/Pull/Replan | all typed refs same operation/binding/generation；fingerprint由DigestPort；gap/unsupported target cursor null | new plan/basis refs | expected-absent save with delta/path refs | invalid_input / context_mismatch |
| `Draft` | `Validated` | `validateMaterializationPlan(plan,evaluation,cursor,observation,mapping,policy)` | Clone/Pull validation | Fresh Eligible；continuity/capability支持；binding/generation/fingerprint match；path Safe；mapping Valid | state=`Validated` | versioned save before run prepare | invalid_transition / blocked / context_mismatch |
| `Draft` / `Validated` | `Invalidated` | `invalidateMaterializationPlan(plan,reason)` | drift, invalidation consumers/jobs, Resume replan | typed owner/source/generation/observation/conflict reason | terminal state; basis retained | save plan + operation NeedsAction/candidate invalidation/provenance | invalid_transition |
| `Validated` | `Consumed` | `consumeMaterializationPlan(plan,runRef)` | Clone/Pull/Resume prepare | unique Run.Prepared已构造、same plan/checkpoint；prepare UoW atomic | consumedByRunRef set | save plan+run+checkpoint before apply | invalid_transition / invariant_violation |
| `Validated` | same/read-only decision | `materializationPlanMatchesGeneration(plan,generation)` / `materializationPlanMatchesObservation(plan,observation)` | immediate pre-apply recheck | pure check only；false触发显式invalidate，不暗改 | none | none | pure boolean |

| 停审项 | 结论 / 测试切口 |
|---|---|
| one-shot | pass；Validated只能consume一次，resume/replan建新plan/run identity。 |
| 合法测试 | draft/validate/invalidate from both states/consume；pre-apply match true/false。 |
| 非法测试 | Draft/Invalidated/Consumed apply；Consumed reuse；fingerprint/generation drift仍validate；gap自动full。 |
| blocker | source/comparator/path contract `SYNC-UP-002/007/008/010`。 |

### 8.2 `PathChangeSafetyState`（`PathChangeSet`）

```text
[PathChangeSet]
  factory -> Draft -> Safe / Conflict / Blocked / Unknown
  Draft / Safe -> Conflict
  Conflict / Blocked / Unknown -X-> Safe
  changed facts => create a new PathChangeSet
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Draft` | bounded path/mapping intent已派生，尚未对current observation评价 | 否 | evaluate、mark conflict |
| `Safe` | current observation/mapping/policy下允许stage；并非永久安全 | 否（可因pre-apply drift转Conflict） | bounded select、fingerprint recheck、stage |
| `Conflict` | dirty/collision/rename-delete/path overlap等需显式处理 | 是（本change set） | read/conflict creation/new plan |
| `Blocked` | known hard path/tool/capability blocker | 是 | read/needs-action/new plan |
| `Unknown` | 无法证明fingerprint/path/symlink/mapping安全 | 是 | read/manual/new observation+new change set |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `derivePathChangeSet(input,mappingRule)` | Clone/Pull planning | validated SourceDelta + MappingSet + canonical root；entries typed/non-overwrite；no absolute/root escape | new path-set identity with Draft | expected-absent save before plan | invalid_input / blocked |
| `Draft` | `Safe` / `Conflict` / `Blocked` / `Unknown` | `evaluatePathChangeSafety(pathChanges,observation,mapping,policy)` | Clone/Pull validation | current observation/mapping and exact policy；all required axes known forSafe | safety state + conflict hints as applicable | append evaluated revision/plan input；Conflict creates CP4 record | context_mismatch / invariant_violation |
| `Draft` / `Safe` | `Conflict` | `markPathChangeConflict(pathChanges,hints)` | pre-apply drift / collision detection | typed non-empty hints；same root/fingerprint context | state=`Conflict` + hints | versioned save + conflict/checkpoint；no apply | invalid_transition / invariant_violation |
| `Draft` / `Safe` / `Conflict` / `Blocked` / `Unknown` | same/read-only decision | `selectAffectedPaths(pathChanges,scope)` / `pathChangesMatchFingerprints(pathChanges,observation)` | scope/pre-apply guard | pure; scope only narrows；unknown fingerprint=false | none | false leads explicit invalidate/conflict path | invalid_input for scope escape |

| 停审项 | 结论 / 测试切口 |
|---|---|
| non-overwrite | pass；只有Safe + matching fingerprints可stage；Safe可因drift显式Conflict。 |
| 合法测试 | Draft four outcomes；Safe→Conflict；bounded include/exclude；fingerprint mismatch。 |
| 非法测试 | Conflict/Blocked/Unknown→Safe原地；empty/unsafe path默认Safe；scope扩大；auto resolve/overwrite。 |
| blocker | path mapping/symlink/manual exact rules `SYNC-UP-007/008/010`。 |

### 8.3 `MaterializationRunState`

```text
[MaterializationRun]
  factory -> Prepared -> Applying -> AppliedPendingFinalize -> Finalized
                 |           |  \
                 |           |   +-> Partial / OutcomeUnknown
                 |           +-----> Blocked / FailedKnown
                 +-----------------> Blocked / FailedKnown
  Partial / OutcomeUnknown / Blocked / FailedKnown -> new plan/run via explicit recovery
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Prepared` | validated plan/checkpoint已durable，尚未开始local apply | 否 | precondition recheck、begin apply、known block/fail |
| `Applying` | bounded Git/fs stage/apply正在执行；已完成segment单独记录 | 否 | record segment、pending-finalize、partial/unknown/known-safe block/fail |
| `AppliedPendingFinalize` | planned file changes已知完成，但metadata/cursor/mapping/provenance尚未同UoW可见 | 否 | only atomic local finalize；不得重复apply |
| `Finalized` | run/cursor/mapping/provenance revisions已同一local commit可见 | 是 | read/replay；operation may complete |
| `Partial` | 已知只有部分local segments完成 | 是（本run） | checkpoint/manual/resume creates new run；cursor不推进 |
| `OutcomeUnknown` | local effect范围无法证明 | 是（本run） | checkpoint/manual inspection/new run only after explicit recovery |
| `Blocked` | known safe boundary阻止执行或继续，且未隐藏partial effect | 是（本run） | needs-action/new plan/run |
| `FailedKnown` | 已知失败且effect边界明确 | 是（本run） | read/recovery/new run |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Prepared` | `prepareMaterializationRun(id,plan,checkpointRef)` | Clone/Pull/Resume prepare | plan Validated；checkpoint Captured；ids/refs same operation | new run/checkpoint ref | expected-absent save + plan→Consumed before apply | invalid_input / context_mismatch |
| `Prepared` | `Applying` | `beginMaterializationApply(run,plan,observation)` | Clone/Pull/Resume facility phase | plan consumed by this run；current fingerprint/generation match；path Safe | state=`Applying` | versioned save/transition then bounded tool call | invalid_transition / context_mismatch |
| `Applying` | `Applying` | `recordAppliedSegment(run,segmentRef,fingerprintRef)` | bounded apply loop | segment belongs to plan；known completed；dedup | append progress refs | checkpoint/progress save according Step11 crash design | invalid_transition / invariant_violation |
| `Applying` | `AppliedPendingFinalize` | `markApplyPendingFinalize(run,resultFingerprintRef)` | known complete facility result | all planned segments known complete；post observation fingerprint valid | result fingerprint + state | save run; begin new final UoW | invalid_transition / invariant_violation |
| `AppliedPendingFinalize` | `Finalized` | `finalizeMaterializationRun(run,cursorRef,mappingVersionRef,provenanceRef)` | Clone/Pull/Resume final UoW | matching cursor/mapping/provenance candidate revisions prepared；same generation | final refs + terminal state | same commit makes run/cursor/mapping/provenance visible；then operation complete | invalid_transition / context_mismatch |
| `Applying` | `Partial` | `checkpointPartialRun(run,checkpointRef,failure)` | facility known partial branch | safe summary + durable checkpoint；known affected segments | state/checkpoint/failure | save run/checkpoint/conflict/provenance；cursor unchanged | invalid_transition |
| `Applying` | `OutcomeUnknown` | `markRunOutcomeUnknown(run,checkpointRef,reason)` | facility ambiguous branch | effect cannot be bounded；durable checkpoint | state/checkpoint/failure posture | save NeedsAction; no blind retry/cursor advance | invalid_transition |
| `Prepared` / `Applying` | `Blocked` | `blockMaterializationRun(run,blocker)` | known guard/facility branch | zero-effect boundary proven；if any partial possibility usePartial/Unknown | terminal block | save checkpoint/result; no cursor | invalid_transition / invariant_violation |
| `Prepared` / `Applying` | `FailedKnown` | `failMaterializationRunKnown(run,failure)` | known failure branch | effect boundary known；raw failure excluded | terminal failure | save safe result/checkpoint as needed | invalid_transition / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| atomic visibility | pass；AppliedPendingFinalize调用三个候选revision helper，单一local UoW commit后才成为Finalized/advanced。 |
| 合法测试 | full mainline；segments dedup；each terminal branch；same-generation finalization；crash before/after each commit boundary。 |
| 非法测试 | Prepared→Finalized；Applying→Finalized；Partial/Unknown/Blocked/Failed→Finalized；repeat apply；cursor advance before commit。 |
| blocker | Git/fs staging/dirty/path/crash exact contract `SYNC-UP-006/007/009/010`。 |

### 8.4 CP3 批次停审

| 审查项 | 结论 |
|---|---|
| plan/path/run分轴 | pass；Validated plan不替代Safe path或Prepared run。 |
| prepare/apply/finalize | pass；外部/local facility不与metadata UoW伪装分布式事务。 |
| unknown/recovery | pass；Partial/OutcomeUnknown永不原地Finalized，cursor/mapping保持旧值。 |
| forbidden Git | pass；状态矩阵没有merge/rebase/push/stash/remote fetch或overwrite transition。 |

## 9. CP4 Conflict & Recovery 状态矩阵

### 9.1 `ConflictState`

```text
[ConflictRecord]
  factory -> Open -> AwaitingDecision -> ResolutionRecorded -> Closed
                \          \                 \
                 +----------+-----------------> Superseded
  Open ---------------------> ResolutionRecorded  (valid explicit resolution)
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Open` | typed conflict fact已记录，尚未要求或记录处理意图 | 否 | await decision、record resolution、supersede |
| `AwaitingDecision` | 必须等待有权actor显式选择；系统不自动选边 | 否 | record resolution、supersede |
| `ResolutionRecorded` | validated resolution intent已关联；actual action尚未证明完成 | 否 | Resume/Replan；known-safe result后close；supersede |
| `Superseded` | 新conflict fact替代旧basis | 是 | read/history only |
| `Closed` | new action取得known-safe local result，conflict lifecycle收束 | 是 | read/history only |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `detectSyncConflict(input)` | Clone/Pull/Resume detection | operation/ref set/body-free basis/checkpoint typed且same context | new conflict identity | append/save conflict + operation NeedsAction + provenance | invalid_input / context_mismatch |
| `Open` | `AwaitingDecision` | `awaitConflictDecision(conflict,allowed)` | conflict detection/Resume manual branch | non-empty allowed decision set from policy；system不选择 | state update | save conflict/checkpoint/result | invalid_transition / invariant_violation |
| `Open` / `AwaitingDecision` | `ResolutionRecorded` | `recordConflictResolution(conflict,resolution)` | `RecordConflictResolutionFlow` | resolution Validated、same conflict/actor scope；仅intent | resolution ref + state | same UoW resolution/conflict/provenance/stored result | invalid_transition / context_mismatch |
| `Open` / `AwaitingDecision` / `ResolutionRecorded` | `Superseded` | `supersedeConflict(conflict,replacementRef)` | new detection / Replan | replacement真实存在、same operation、new basis | replacement ref/state；history retained | save both relation/provenance | invalid_transition / invariant_violation |
| `ResolutionRecorded` | `Closed` | `closeConflict(conflict,reason,resultRef)` | Resume/Replan known-safe completion | new owning action known local result；resolution applied if relevant | close result + terminal state | save conflict/resolution/checkpoint/provenance/result | invalid_transition / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| intent/effect | pass；ResolutionRecorded不等于Closed。 |
| 合法测试 | detect；await；direct/await resolution；supersede each active；close after known result。 |
| 非法测试 | Open/Awaiting直接Closed；actor click/Git clean/log closes；terminal reopen/delete；replacement missing。 |
| blocker | manual/path conflict contract `SYNC-UP-010`。 |

### 9.2 `RecoveryCheckpointState`

```text
[RecoveryCheckpoint]
  factory -> Captured -> Resumable -> Completed
                 |          \
                 |           +-> Invalidated
                 +-> ProbeRequired -> Completed (only owning known terminal result)
                 |          \
                 |           +-> Invalidated
                 +-> Invalidated
  invalidated or completed checkpoint never reopens
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Captured` | stage/input fingerprint/completed local steps/next action已durable | 否 | classify then mark resumable/probe/invalidate |
| `Resumable` | current context证明只需bounded local-safe reentry | 否 | explicit Resume；complete on known result；invalidate on drift |
| `Invalidated` | fingerprint/generation/basis漂移，checkpoint不可再用 | 是 | read/history/new checkpoint |
| `ProbeRequired` | possible external effect存在，必须formal probe | 否 | prepare probe；only owning known terminal result may complete；invalidate |
| `Completed` | owning flow已以known result收束checkpoint | 是 | read/replay only |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Captured` | `captureRecoveryCheckpoint(input)` | all prepare/effect boundaries | operation/stage/fingerprint/completed steps/next action；related attempt optional by stage | new checkpoint identity | durable save before facility/external call | invalid_input / context_mismatch |
| `Captured` | decision only | `evaluateCheckpointResume(checkpoint,current,policy)` | `ResumeSyncOperationFlow` | loaded current context from explicit ports/repos；pure classification | none | flow must call one exact transition below | not_applicable; typed decision |
| `Captured` | `Resumable` | `markCheckpointResumable(checkpoint,nextAction)` | Resume local-safe branch | decision=ResumeLocal；no possible external effect；fingerprint exact | state/nextAction | versioned save before local reentry | invalid_transition / blocked |
| `Captured` | `ProbeRequired` | `requireCheckpointProbe(checkpoint,attemptRef)` | Push/Probe/Resume unknown branch | prior durable external attempt matches operation/context | state/attempt/nextAction | save checkpoint before probe record/call | invalid_transition / context_mismatch |
| `Captured` / `Resumable` / `ProbeRequired` | `Invalidated` | `invalidateCheckpoint(checkpoint,reason)` | Resume drift/Rebind/Migrate | typed fingerprint/generation/basis drift | terminal state; history retained | save + new plan/checkpoint path/provenance | invalid_transition |
| `Resumable` | `Completed` | `completeCheckpoint(checkpoint,resultRef)` | Resume known local result / Cancel safe local path | owning result known and references same operation/stage | completion result + terminal state | save with operation/result/provenance | invalid_transition / invariant_violation |
| `ProbeRequired` | `Completed` | `completeCheckpoint(checkpoint,resultRef)` | Probe/Refresh owning terminal-known branch | formal probe/read known **and** owning policy maps to known terminal result；pending/ACK alone不足 | completion result + terminal state | save with attempt/probe/provenance/result | invalid_transition / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| classification/helper | pass；pure decision不暗改，三个exact transition helper闭合。 |
| 合法测试 | capture→each branch；resumable completion；probe-required terminal completion；drift invalidation。 |
| 非法测试 | Invalidated→Resumable；Captured direct Completed；possible effect→Resumable；probe ACK/pending→Completed。 |
| blocker | equivalence/probe contract `SYNC-UP-004/005/010`。 |

### 9.3 `ManualResolutionState`

```text
[ManualResolution]
  factory -> Recorded -> Validated -> Applied
                |           \
                |            +-> Superseded
                +-> Rejected / Superseded
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Recorded` | actor/decision/scope/revalidation要求已记录，尚未对current context验证 | 否 | validate、reject、supersede |
| `Validated` | 当前conflict/context/policy允许后续显式恢复动作 | 否 | Resume owning action、mark applied、supersede |
| `Applied` | 对应local action已有known result | 是 | read/history；不表示owner/Review Decision |
| `Superseded` | 新resolution intent替代本record | 是 | read/history only |
| `Rejected` | scope/actor/state/policy已知不允许 | 是 | read/history/new resolution |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Recorded` | `recordManualResolution(input)` | `RecordConflictResolutionFlow` | explicit human actor；active conflict；bounded scope；decision kind typed | new resolution identity | expected-absent save in same UoW as conflict relation | invalid_input / blocked |
| `Recorded` | `Validated` | `validateManualResolution(resolution,conflict,current,policy)` | RecordResolution | same conflict/current refs；scope/actor/kind/revalidation policy passes | state=`Validated` | save resolution + conflict ResolutionRecorded + provenance | invalid_transition / context_mismatch |
| `Recorded` | `Rejected` | `rejectManualResolution(resolution,reason)` or validation failure branch | RecordResolution | stable typed reject reason | terminal state | save rejected intent/result; no action | invalid_transition |
| `Recorded` / `Validated` | `Superseded` | `supersedeManualResolution(resolution,replacementRef)` | new explicit resolution / Resume replan | replacement exists/same conflict；history retained | terminal + replacement ref relation | save provenance; old record remains | invalid_transition / context_mismatch |
| `Validated` | `Applied` | `markManualResolutionApplied(resolution,resultRef)` | Resume known local action | actual bounded action known complete；same operation/conflict/scope | applied result + terminal state | save with conflict close/checkpoint/result/provenance | invalid_transition / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| actor/intention | pass；system job不能冒充actor，Validated不执行file change。 |
| 合法测试 | record→validate→apply；reject；supersede from two states。 |
| 非法测试 | Recorded→Applied；Rejected/Superseded复活；scope escape；KeepLocal/ApplySource直接overwrite。 |
| blocker | exact manual-resolution/path protection `SYNC-UP-010`。 |

### 9.4 `ProbeRecordState`

```text
[ProbeRecord]
  factory -> Prepared -> InFlight -> ResolvedKnown
                 |          |  \-> StillUnknown
                 |          |  \-> Unsupported
                 |          +----> FailedKnown
                 +-------------> Unsupported
  StillUnknown => later explicit command/job creates a new Prepared record
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Prepared` | prior attempt/idempotency context/probe kind已durable | 否 | begin formal probe、mark unsupported |
| `InFlight` | formal probe call已开始 | 否 | resolve known/still unknown/unsupported/failed-known |
| `ResolvedKnown` | probe返回可归属known result；不自动等于accepted | 是 | owning policy interpret/read/history |
| `StillUnknown` | probe后effect仍不可判定 | 是（本probe） | new explicit probe record；no submit replay |
| `Unsupported` | 无正式probe capability | 是 | manual/stop/read |
| `FailedKnown` | probe调用本身已知失败；original attempt保持原outcome | 是 | read/manual/new explicit probe if policy allows |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Prepared` | `prepareProbeRecord(input)` | Probe command/job prepare | durable prior attempt + idempotency context + formal probe kind；new id | new probe identity | expected-absent save + link checkpoint/attempt before call | invalid_input / context_mismatch |
| `Prepared` | `InFlight` | `beginProbe(record,invocationRef)` | Probe command/job | `ProbeInvocationIdentity`由IdPort构造，`probeRef`/`probedAttemptRef`/correlation/idempotency逐项匹配并同UoW append；adapter capability asserted | invocation + state | versioned save/commit then call outside UoW using same ref | invalid_transition / unsupported |
| `InFlight` | `ResolvedKnown` | `resolveProbeKnown(record,summary,resultRef,observedAt)` | Probe finalize | validated safe formal result belongs to prior attempt | result/summary/time + terminal state | save probe; owning attempt/checkpoint policy transition | invalid_transition / invalid_external_response |
| `InFlight` | `StillUnknown` | `keepProbeUnknown(record,reason,observedAt)` | ambiguous probe finalize | response/effect仍unattributable | reason/time + terminal state | attempt/checkpoint remain ProbeRequired; stored result no replay | invalid_transition |
| `Prepared` / `InFlight` | `Unsupported` | `markProbeUnsupported(record,reason)` | capability/response branch | formal capability absent/not supported | terminal safe reason | save result/manual next action | invalid_transition / unsupported |
| `InFlight` | `FailedKnown` | `failProbeKnown(record,failure)` | known probe failure | safe failure；original attempt不得被改为not-happened | terminal failure | save probe/report item；checkpoint remains | invalid_transition |

| 停审项 | 结论 / 测试切口 |
|---|---|
| durable-before-call | pass；Prepared与InFlight都在call前/开始时可恢复。 |
| 合法测试 | main known；unknown；unsupported from two states；failed；later new probe identity。 |
| 非法测试 | no prior attempt；Prepared→ResolvedKnown；terminal reopen；StillUnknown重放submit；telemetry/log作为known。 |
| blocker | formal Governance/SDK probe surface `SYNC-UP-004/005`。 |

### 9.5 CP4 批次停审

| 审查项 | 结论 |
|---|---|
| conflict/intent/effect | pass；Open fact、Resolution intent、Applied action、Closed result分层。 |
| checkpoint/probe | pass；possible external effect必须ProbeRequired，probe known仍经owning policy解释。 |
| history | pass；supersede/terminal records保留，不删除/重写。 |
| blind replay | pass；StillUnknown/OutcomeUnknown均创建新probe或manual，不重放submit/apply。 |

## 10. CP5 Review Handoff & Provenance 状态矩阵

### 10.1 `ReviewCandidateState`

```text
[ReviewCandidate]
  factory -> Inspecting -> Eligible -> Frozen -> HandedOff
                 |           |          |          |
                 +-----------+----------+----------> Invalidated
  Invalidated -X-> Eligible / Frozen / HandedOff
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Inspecting` | operation/binding/source/observation/eligibility ref已固定，正在评价 | 否 | evaluate、invalidate |
| `Eligible` | current access/source/cursor/binding/local/conflict/recovery gates通过 | 否 | digest/scope freeze、invalidate |
| `Frozen` | candidate digest/scope/generation/observation不可变，可durable prepare attempt | 否 | pre-call revalidate、attach one attempt、invalidate |
| `HandedOff` | 已关联 durable `HandoffAttempt.Prepared`；不表示call/ACK/Decision成功 | 否 | read/status、invalidate on later drift；attempt轴推进 |
| `Invalidated` | 任一basis漂移或formal invalidation，identity不可复用 | 是 | read/history；创建new candidate |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Inspecting` | `inspectReviewCandidate(input)` | PushReview prepare | explicit operation/binding/generation/source/observation/evaluation refs same context | new candidate identity | expected-absent save/evaluation sidecar | invalid_input / context_mismatch |
| `Inspecting` | `Eligible` | `evaluateCandidate(candidate,context,policy)` | PushReview | Fresh Eligible access；binding/manifest/cursor/mapping/local observation safe；no open conflict；archive posture allows | state=`Eligible` | save candidate + eligibility evaluation | invalid_transition / blocked |
| `Inspecting` / `Eligible` / `Frozen` / `HandedOff` | `Invalidated` | `invalidateReviewCandidate(candidate,reason)` | Push drift / invalidation consumers/jobs / Rebind/Migrate | typed facts/ref set；versioned candidate | terminal local candidate state；attempt untouched | save candidate/provenance/operation NeedsAction as applicable | invalid_transition |
| `Eligible` | `Frozen` | `freezeReviewCandidate(candidate,digestRef,scope,observationRef)` | PushReview | canonical bounded digest input；scope non-expanding；current generation/observation | digest/scope/observation fixed | save candidate before attempt prepare | invalid_transition / invariant_violation |
| `Frozen` | state-preserving guard | `validateCandidateUnchanged(candidate,observation,generation)` | immediately before handoff call | same fingerprint/scope/generation and policy basis | none | false branch explicitly invalidates; no call | context_mismatch / blocked |
| `Frozen` | `HandedOff` | `attachCandidateHandoff(candidate,attempt)` | PushReview durable prepare | HandoffAttempt Prepared、references exact candidate、single attempt association | attemptRef + state | same UoW attempt/checkpoint/provenance prepare | invalid_transition / context_mismatch |

| 停审项 | 结论 / 测试切口 |
|---|---|
| candidate≠Artifact | pass；input/fields没有Git commit→Artifact/Baseline elevation。 |
| 合法测试 | inspect/evaluate/freeze/attach；invalidate from all active states；pre-call drift false path。 |
| 非法测试 | Inspecting→Frozen；Eligible→HandedOff；Invalidated复活；Frozen修改scope/digest；multiple attempt attach。 |
| blocker | Governance/source/access/schema contracts `SYNC-UP-001/002/003/004/006/008/010`。 |

### 10.2 `HandoffAttemptState`

```text
[HandoffAttempt]
  factory -> Prepared -> Calling -> TransportKnown -> ExternalPending -> TerminalKnown
                              \           \              /
                               \           +------------+
                                +-> OutcomeUnknown -> ProbeRequired
                                                       |  \
                                                       |   +-> TerminalKnown
                                                       +----> ExternalPending
  OutcomeUnknown / ProbeRequired -X-> Calling
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Prepared` | frozen candidate/target/idempotency context已durable，尚未调用 | 否 | begin call |
| `Calling` | formal handoff invocation已开始 | 否 | record known transport或unknown |
| `TransportKnown` | transport outcome已知；可含official external handoff ref；不是accepted | 否 | mark external pending、attach decision snapshot、terminal owner result |
| `OutcomeUnknown` | call可能产生effect但response不可归属 | 否 | require formal probe；no resubmit |
| `ProbeRequired` | probe record/next action已关联 | 否 | formal probe/read mapping；remain via new probe record |
| `ExternalPending` | official external ref exists，owner Decision pending/unknown/nonterminal | 否 | attach snapshot、explicit Refresh/probe to terminal |
| `TerminalKnown` | formal owner read/probe返回terminal external state ref | 是 | read/layered status only；不本地重解释verdict |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Prepared` | `prepareHandoffAttempt(input)` | PushReview prepare | candidate Frozen；target/context/idempotency/clock valid；one attempt identity | new attempt | expected-absent save with candidate HandedOff/checkpoint/provenance before call | invalid_input / context_mismatch |
| `Prepared` | `Calling` | `beginHandoffCall(attempt,invocationRef)` | PushReview | durable Prepared revision；`HandoffInvocationIdentity`由IdPort构造，`handoffAttemptRef`/correlation/idempotency逐项匹配并同UoW append；pre-call revalidation passed | invocation/state | versioned save/commit then submit outside UoW using same ref | invalid_transition / blocked |
| `Calling` | `TransportKnown` | `recordHandoffTransport(attempt,outcome,externalRef?)` | PushReview finalize | typed known transport/rejection/ACK result；external ref only if formal response | transport/external ref/state | save attempt/provenance/stored layered result | invalid_transition / invalid_external_response |
| `Calling` | `OutcomeUnknown` | `markHandoffOutcomeUnknown(attempt,reason,checkpointRef)` | PushReview ambiguous finalize | effect cannot be ruled out；durable checkpoint belongs to attempt | unknown checkpoint/state | save attempt/checkpoint/operation NeedsAction/result | invalid_transition |
| `OutcomeUnknown` | `ProbeRequired` | `requireHandoffProbe(attempt,probeRef)` | Probe prepare / Push finalize | new ProbeRecord.Prepared references this attempt | probe ref/state | save attempt/probe/checkpoint before probe call | invalid_transition / context_mismatch |
| `TransportKnown` / `ProbeRequired` | `ExternalPending` | `markHandoffExternalPending(attempt,externalRef)` | Push/Probe/Refresh known nonterminal branch | official external ref from formal call/read/probe；not ACK-only inferred ref | state/ref | save attempt/provenance; Decision layer remains pending/unknown | invalid_transition / invariant_violation |
| `TransportKnown` / `ExternalPending` / `ProbeRequired` | same state revision | `attachHandoffDecisionSnapshot(attempt,snapshot)` | Refresh / Decision consumer | snapshot official owner/context/ref/version match；body-free | decisionSnapshotRef only | save snapshot/attempt/provenance/receipt/result | context_mismatch / invalid_transition |
| `TransportKnown` / `ExternalPending` / `ProbeRequired` | `TerminalKnown` | `finalizeKnownExternalState(attempt,stateRef)` | Refresh/Probe/Decision consumer known terminal path | formal owner read/probe supplies terminal external state ref；visibility/mapping valid | terminal external ref/state | save attempt/snapshot/provenance/layered result | invalid_transition / invariant_violation |

| 停审项 | 结论 / 测试切口 |
|---|---|
| ACK/Decision | pass；TransportKnown、ExternalPending、TerminalKnown均不等于accepted；verdict只在owner snapshot view。 |
| 合法测试 | prepare/call/transport/pending/terminal；unknown→probe→pending/terminal；state-preserving snapshot attach。 |
| 非法测试 | Prepared→TransportKnown；OutcomeUnknown/ProbeRequired→Calling；ACK→TerminalKnown；missing ref→ExternalPending；terminal reopen。 |
| blocker | handoff/Decision/probe/idempotency `SYNC-UP-001/004/005`。 |

### 10.3 `ProvenanceRecordState`

```text
[ProvenanceRecord]
  factory -> Active -> Protected
                |  \       \
                |   \       +-> Superseded
                |    +--------> IntegrityUnknown
                +-------------> Superseded
  terminal/degraded records are never deleted or restored in place
```

| 状态 | 语义 | 终态 | 允许关键操作 |
|---|---|---|---|
| `Active` | relation/digest/parent closure当前已知，尚未因active reference强保护 | 否 | link during construction, protect, supersede, mark integrity unknown |
| `Protected` | active truth/history引用要求永久保护 | 否（只可supersede/degrade） | read、supersede、mark integrity unknown；no delete |
| `Superseded` | replacement relation显式回链，旧record仍保留 | 是 | read/history only |
| `IntegrityUnknown` | digest/parent/ref closure无法证明 | 是（本record） | degraded read/manual diagnosis；不得补造恢复Active |

| From | To | 触发函数 | Step 9 flow | 前置读取 / guard | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Active` | `recordProvenanceRelation(input)` | all accepted mutation/consumer/job transitions | subject/source/parent refs真实可读、same context；digest from canonical bounded input；redacted | new append-only record | repository append in owning UoW | invalid_input / invariant_violation |
| `Active` | `Active` construction revision | `linkProvenanceParent(record,parentRef)` | record construction before append | no self-cycle/duplicate；parent exists/same context | parent set update | append final record only; no hidden repair | invariant_violation / context_mismatch |
| `Active` | `Protected` | `protectProvenance(record,reason)` | Clone/Migrate/Rebind/active relation flows | typed active-reference/protection reason | state/protection posture | versioned protected transition; manifest ref retained | invalid_transition |
| `Active` / `Protected` | `Superseded` | `supersedeProvenance(record,replacementRef)` | Migrate/Rebind/relation replacement | replacement exists and backlinks; old record retained | terminal + replacement relation | save transition + append replacement in same UoW | invalid_transition / invariant_violation |
| `Active` / `Protected` | `IntegrityUnknown` | `markProvenanceIntegrityUnknown(record,reason)` | integrity scan/read-detected accepted mutation path | typed missing/digest/gap reason；never fabricate parent | terminal degraded state | save explicit degraded visibility; block dependent mutation | invalid_transition |
| `Active` / `Protected` / `Superseded` / `IntegrityUnknown` | same/read decision | `verifyProvenanceIntegrity(record,rule)` | Scan/query/mutation guard | pure verification against loaded summaries | none | query only exposes; job may call explicit degrade transition | not_applicable; typed decision |

| 停审项 | 结论 / 测试切口 |
|---|---|
| append/protect | pass；所有records retained；没有delete/repair/fabricate transition。 |
| 合法测试 | active factory/link/protect/supersede/degrade；cycle/duplicate detection；query IntegrityUnknown visible。 |
| 非法测试 | Superseded/IntegrityUnknown→Active；missing parent synthesize；delete protected；raw body/digest placeholder。 |
| blocker | physical preservation/digest schema `SYNC-UP-006`。 |

### 10.4 CP5 批次停审

| 审查项 | 结论 |
|---|---|
| candidate/attempt分轴 | pass；candidate HandedOff仅表明attempt durable，transport/Decision另轴。 |
| external truth | pass；Gate/Decision只通过refs/body-free snapshots读取，L5-sync无其状态机。 |
| unknown/replay | pass；OutcomeUnknown→ProbeRequired，绝不回Calling或resubmit。 |
| provenance | pass；append/protect/supersede/degrade，无删除/伪造。 |

## 11. Technical disposition 与 read surface 审计

本节不新增状态机，只核对 Step 8/9 技术分类不会被误当 durable business truth。

| Carrier | labels | 产生/读取处 | 状态机关系 | 禁止解释 |
|---|---|---|---|---|
| `CommandDisposition` | completed-known/no-op/needs-action/conflict/blocked/cancelled/failed-known/outcome-unknown | Command response + stored result | 映射一个 owning flow的结果；必须回指operation/run/attempt等actual state | 全局sync success、Review accepted、retry permission |
| `QueryReadDisposition` / `SyncReadCompleteness` | complete/partial/missing/not-visible/blocked/unavailable | 13 Queries | 只描述read/view completeness，无transition/repository write | synchronized、clean、ready、accepted |
| `ConsumerDisposition` | processed/duplicate/no-op/blocked/unsupported-version/invalid-source/quarantined/failed-known | three conditional consumers / stored receipt | 单次delivery处理结果；duplicate replay exact receipt | owner event truth、subscription readiness、自动动作 |
| `JobDisposition` | completed/completed-with-blockers/partial/duplicate/blocked/failed-known | three jobs / stored job result | batch result；item states保留各自主语 | all targets resolved、system readiness、evidence/report verdict |
| adapter availability | supported/unsupported/blocked/unknown | composition/status/diagnostic query | runtime capability snapshot；不推进domain | authorization、freshness、implementation readiness |
| transport/probe/external Decision views | layered variants | Handoff result/query | 映射Candidate/Attempt/Probe/Snapshot各轴 | 单一accepted/success bool |

测试切口：每个 disposition必须能在没有truth state mutation的validation/missing/duplicate路径出现；反向断言 disposition不能被repository当作第18个domain state保存，也不能使 Query获得write capability。

## 12. 跨状态机传播与副作用一致性

| 触发事实 | 源状态 / proof | 允许传播 | owning flow + UoW | 明确不传播 |
|---|---|---|---|---|
| access/posture invalidation | fresh owner event/order mapping | Snapshot Fresh→non-Fresh；Evaluation→Stale；unconsumed Plan/Candidate→Invalidated；Operation may NeedsAction | access invalidation consumer / stale job；resolver refs + versioned local UoW | 不取消external call、不改Project/Archive、不改Finalized files/cursor |
| material source invalidation | formal source event/version | Cursor Unset/Continuous→Unknown；Plan/Candidate→Invalidated | source invalidation consumer; one local UoW per bounded set | 不auto pull/full/rollback；不rewrite applied cursor |
| metadata/schema degradation | integrity policy result | Manifest→nonValid；Binding→Restricted/NeedsMigration；Plan/Candidate invalidation where affected | integrity scan / mutation guard per-item UoW | 不repair/migrate/rebind/delete |
| generation/rebind | explicit Command + new generation | old Binding→Invalidated/NeedsRebind；Cursor→Unknown；Mapping→Invalidated；Plan/Candidate→Invalidated；new identities created | Migrate/Rebind local UoW + provenance | 不rewrite old identity/provenance；不auto materialize |
| working-copy/path drift | fresh observation/fingerprint mismatch | PathSet Safe→Conflict；Plan/Candidate→Invalidated；Conflict Open；Operation NeedsAction | Clone/Pull/Push pre-call/pre-apply guards | 不stash/merge/rebase/overwrite；cursor unchanged |
| materialization partial/unknown | typed facility result | Run→Partial/OutcomeUnknown；Checkpoint captured/classified；Operation NeedsAction；optional Conflict | Clone/Pull/Resume finalization UoW | 不advance cursor/mapping；不blind retry |
| manual known-safe recovery | Validated resolution + new run/result | Resolution→Applied；Conflict→Closed；Checkpoint→Completed；Operation may Completed | explicit Resume final UoW | 不把intent当效果；不改owner truth |
| handoff call unknown | ambiguous external call | Attempt→OutcomeUnknown→ProbeRequired；Checkpoint ProbeRequired；Probe new record；Operation NeedsAction | Push/Probe durable local UoWs | 不resubmit、不开Gate/Decision、不标accepted |
| formal Decision changed/read | official ref/version/safe snapshot | Attempt snapshot relation and possibly ExternalPending/TerminalKnown；layered view更新 | Refresh or Decision consumer local UoW | 不改candidate content/files/Project/Artifact/Baseline/Gate/Decision |
| provenance gap | verified missing/digest gap | Provenance Active/Protected→IntegrityUnknown；dependent mutation blocked/degraded | Scan or owning mutation UoW | 不补造parent/digest、不隐藏或删除记录 |

跨状态提交仍是 local-only transaction；SDK/Git/filesystem effect不在其事务内。Step 11必须逐表/record给出哪些传播能在同一UoW原子提交，Step 13必须定义并发/duplicate/crash后的重新读取规则。

## 13. Forbidden transition summary

| ID | 禁止转换 / 捷径 | 原因 | 必须返回/动作 |
|---|---|---|---|
| `FT-SYNC-01` | any operation terminal→active | terminal history不可改写 | `invalid_transition`; create new operation |
| `FT-SYNC-02` | NeedsAction→Running/Completed | 绕过explicit Resume/revalidation | `invalid_transition`; NeedsAction→Validating only |
| `FT-SYNC-03` | Denied/Blocked/Unknown/Stale evaluation→Eligible | local cache/default不能产生permission truth | create new evaluation from formal owner results |
| `FT-SYNC-04` | non-Fresh snapshot→Fresh | owner snapshot不可本地复活 | create new snapshot |
| `FT-SYNC-05` | Invalidated binding/mapping/plan/candidate→active | generation/basis history不可改写 | new identity/generation |
| `FT-SYNC-06` | Corrupt/Unknown/ReadOnly manifest→Valid in place | repair/proof不能伪造 | explicit new-generation migration/rebind |
| `FT-SYNC-07` | Gap/Unknown/Unsupported cursor→Continuous in place | comparator/continuity缺失 | block/new cursor after formal plan |
| `FT-SYNC-08` | Conflict/Blocked/Unknown path set→Safe in place | changed facts require new derived intent | new observation/change set/plan |
| `FT-SYNC-09` | Draft/Invalidated/Consumed plan→apply | plan不合法或已消费 | typed invalid transition/new plan |
| `FT-SYNC-10` | Prepared/Applying→Finalized skip pending-finalize | 隐藏file/metadata crash window | AppliedPendingFinalize + same UoW finalize |
| `FT-SYNC-11` | Partial/OutcomeUnknown/Blocked/Failed run→Finalized | 旧run不能被补写成成功 | explicit recovery creates new run |
| `FT-SYNC-12` | Open/Awaiting conflict→Closed | resolution intent/known result缺失 | record/validate/resume then close |
| `FT-SYNC-13` | Invalidated checkpoint→Resumable | stale fingerprint不可复活 | new checkpoint/replan |
| `FT-SYNC-14` | Recorded resolution→Applied | validation/effect被跳过 | validate then explicit Resume known result |
| `FT-SYNC-15` | StillUnknown probe→known via telemetry/log/retry count | 非正式proof | new formal probe/manual/stop |
| `FT-SYNC-16` | Invalidated candidate→Frozen/HandedOff | frozen basis已失效 | new candidate identity |
| `FT-SYNC-17` | Prepared attempt→TransportKnown without call | transport fact伪造 | begin formal call first |
| `FT-SYNC-18` | OutcomeUnknown/ProbeRequired attempt→Calling | blind resubmit | formal probe/read/manual only |
| `FT-SYNC-19` | ACK/HTTP 2xx/Git commit→TerminalKnown or Review accepted | transport/local Git不是Decision truth | retain layered transport; formal owner read/probe |
| `FT-SYNC-20` | Superseded/IntegrityUnknown provenance→Active或delete | provenance不可伪造/抹除 | append replacement or expose degraded |
| `FT-SYNC-21` | Query/read disposition推进任何 truth state | query no-write | zero writes; explicit Command/Consumer/Job |
| `FT-SYNC-22` | adapter/job/consumer自动merge/rebase/push/stash/overwrite/retry submit | 超出受控sync入口 | blocked/needs-action/manual |

## 14. Step 10 对 Step 6～9 的闭环修正

| 发现 | 已先回补文件 | 修正结论 |
|---|---|---|
| CP4/CP5 enum members缺独立JSDoc | Step 6 | 每个member已展开且有唯一语义。 |
| cursor/mapping/run finalization存在循环措辞 | Step 6/9 | AppliedPendingFinalize构造candidate revisions；单一UoW commit后共同可见为Finalized/advanced。 |
| migration后Binding恢复Bound无exact helper | Step 6/9 | 新增 `completeBindingMigration`并固定new-generation guard。 |
| Captured→Resumable只有decision无transition helper | Step 6/9 | 新增 `markCheckpointResumable`; pure classification不暗改。 |
| mapping Conflict/Unknown无同层helper | Step 6 | 新增 conflict/unknown/resolved mapping helpers。 |
| Handoff transport helper可能暗跳ExternalPending | Step 6/9 | transport只到TransportKnown；正式ref再调用 `markHandoffExternalPending`。 |
| state helper所需proof/transition/result/invocation ref来源不完整 | Step 6/7/9/10 | 补四类body-free technical carrier与`LocalExecutionRecordRepository`；ref由IdPort生成并与subject revision同UoW append；handoff/probe invocation使用判别variant。 |
| Consumer/job duplicate只写idempotency概念 | Step 7～9 | 增加typed receipt/job result repositories并要求完整原样replay。 |
| Query/Consumer协议与read index粒度不足 | Step 7/8/9 | 补13 Query/3 Consumer独立卡、binding conflict index、invalidation resolver、external-ref lookup、diagnostic read。 |
| candidate eligibility sidecar只有prose shape | Step 6/7 | 补`CandidateEligibilityDecision`判别联合与`CandidateEligibilityEvaluation`正式interface；repository只保存/读取该唯一类型。 |
| transition/result/invocation technical carrier过宽 | Step 6/7 | lifecycle subject/cause改为typed union；operation/metadata transition与handoff/probe invocation按判别项配对，并提供typed get surface。 |
| Step 6 grouped operation/recovery from-state不精确 | Step 6 | cancel/fail/supersede/invalidate helper全部展开exact labels，与本矩阵逐字一致。 |
| Step 8 port数量陈述已过期 | Step 8 | 移除易漂移数字，改为以Step 7当前命名清单及callable surface为准。 |

上述修正均是设计中间产物，不代表实现或测试已发生。

## 15. Step 11～16 handoff items

| 后续 Step | 必须承接 | 当前不可声称 |
|---|---|---|
| Step 11 persistence/transaction | 每个17主体的logical record/version/index；proof/transition/result/invocation append records；same-UoW传播；run/cursor/mapping/provenance atomic visibility；receipt/job result uniqueness；old generation/provenance retention；commit ambiguity reload | physical `.qs-sync` file/table/schema/migration已选、crash consistency已证明 |
| Step 12 error/recovery | `invalid_transition/context_mismatch/invariant_violation`稳定codes；每个forbidden transition的protocol/CLI mapping；safe summary/redaction；unknown/manual actions | 当前string reason可直接公开、retryable已确定 |
| Step 13 concurrency/idempotency | lock ordering、expected version冲突、digest equivalence、duplicate replay、unknown probe/new identity、per-item job reentry | timeout/retry count/idempotency provider合同已闭合 |
| Step 14 config/dependencies | hard gates不可关闭；schema/comparator/digest/page/tool capability settings；unsupported LFS/shallow/GUI姿态 | Node/package/parser/Git library/SDK methods已选 |
| Step 15 observability/audit | body-free transition diagnostics、correlation、state from/to、safe blockers；sink failure isolation | log/evidence/report/verdict/readiness存在 |
| Step 16 tests | 每个矩阵合法/非法转换；cross-state propagation；query zero-write；duplicate/unknown/crash seams；forbidden Git/owner actions spies | 测试已创建/运行/通过 |

## 16. 跨状态机命名、触发与测试审计

| 审计项 | 结论 | 依据 / 剩余 blocker |
|---|---|---|
| 主语筛选 | pass | 17 included；immutable/policy/view/external/technical明确排除。 |
| exact labels | pass | 与Step 6 17 enum/state fields逐字一致；无新GlobalState。 |
| exact helpers | pass | 每条状态改变都有Step 6 same-layer helper；pure guard/decision不暗改。 |
| Step 9 ownership | pass | 每条transition回指Command/Consumer/Job/owning service；Query全no-write。 |
| repository/UoW | pass_with_future_detail | versioned/absent/UoW与proof/transition/result/invocation append seam存在；physical/schema/crash由Step11，`SYNC-UP-006`。 |
| known/unknown | pass | Run/Attempt/Probe/Checkpoint轴分离；unknown不blind replay。 |
| multi-axis semantics | pass | no global success；read completeness/transport/job disposition不替代truth。 |
| external truth | pass | Project/Artifact/Baseline/Gate/Decision/Workspace/Archive/Git remote无本地状态机。 |
| non-overwrite/Git | pass_with_blocker | forbidden transitions闭合；exact tool/path contract `SYNC-UP-007/009/010`。 |
| ACK/Decision | pass_with_blocker | layered states闭合；formal handoff/Decision/probe `SYNC-UP-004/005`。 |
| provenance | pass_with_blocker | append/protect/supersede/degrade，无delete；physical preservation `SYNC-UP-006`。 |
| 测试切口 | pass as design | 每机含合法/非法切口；尚未创建或运行任何测试。 |

## 17. 回填草稿

未来正式 `03-详细设计.md` §9 按状态主语筛选、CP1～CP5 17状态机、technical disposition、跨状态传播、forbidden summary与后续handoff摘录。正式正文必须保留每个状态机的ASCII图、状态表、转换矩阵、非法处理和测试切口，不能压缩成单一overview图；完整审计依据继续保留在本文件。

## 18. 待确认事项

- `SYNC-UP-001~010` 全部保持 `pending/blocked`。矩阵固定的是local negative/safety语义；positive owner/source/handoff/probe和physical schema/tool path不能由状态名反推已可用。
- `SYNC-LOCAL-001~005` 仍pending：Node版本、package manager/package/bin、parser/validator/test/Git工具与SDK dependency syntax未选择。
- `EligibilityOutcome` 是评价结论轴、`FreshnessState` 是snapshot/evaluation freshness轴；实现可在同一 `AccessEvaluation` carrier暴露两个字段，但不得组合为未经定义的新enum。
- Consumer仍 `planned/blocked`，Job仅有planned protocol；本文件没有声明subscription/scheduler/run/report已存在。

## 19. 进入下一步与停审条件

- [x] 17 个状态主语全部具有ASCII图、语义、完整转换矩阵、非法错误与测试切口。
- [x] 每个转换使用Step 6 exact helper并回指Step 9 flow；发现的前序缺口已先回补。
- [x] 多轴、unknown、query no-write、dirty/path、no auto Git、ACK≠Decision、provenance边界通过。
- [x] 技术disposition与external truth明确排除，没有GlobalSyncState或第18个truth lifecycle。
- [x] Step 11～16 handoff完整，所有blocker保留；未伪造实现/测试/evidence/readiness。
- [x] calibration flow与project ledger已切换为Step 10 `formal_stop_review`；未创建Step 11。

结论：Step 10 完成 `completed / formal_stop_review`。17 个本地 lifecycle 状态机、跨状态传播、22 条 forbidden transition及后续 handoff 已完成静态机械审计；`SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 继续 pending。立即停审，未经用户明确确认不得创建或进入 Step 11。
