# L4-archive 03 Step 10：状态机与转换矩阵

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填位置：未来正式 `03-详细设计.md` §9
> 日期：2026-09-11
> 状态：`completed / pass_with_upstream_blockers / stop_review`

## 1. Step 状态、输入与边界

| 项目 | 本 Step 结论 |
|---|---|
| 前置 | Step 01～09 已完成并停审；本轮用户明确授权 Step 10 |
| 直接输入 | 正式 `02-概要设计.md` §6/§9；`03_ddd_step_06_object_contracts.md` §5/§7/§10/§12；`03_ddd_step_09_processing_flows.md` |
| 本步目标 | 筛选真实状态主语，按状态族逐个定义状态集合、ASCII 图、转换矩阵、非法转换和副作用 |
| 不在本步 | 物理 schema/index、锁/重试算法、配置/provider、完整测试方案、正式 03 装配 |
| 状态真相 | 状态名、初值、transition helper、终态守卫均回指 Step 06；不得新增 `GlobalState`/`SystemState` |
| 持续 blocker | `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`；受影响正向 adapter/outbound 保持 fail-closed |

## 2. SOP 问题回答与筛选规则

### 2.1 问题回答

| 问题 | 回答 |
|---|---|
| 哪些对象进入矩阵？ | 只有 Step 06 已有正式状态字段/enum，且 Step 09 flow 会推进、读取、暴露或 replay 的对象；每个对象独立矩阵 |
| 哪些对象排除？ | 纯 ref/id/marker、只承载字段的 value object、DTO wrapper、外部 owner 状态、`ManifestClosurePosture`/`CaptureCoveragePosture`/`CompatibilityPosture` 等 immutable classification、Query/API surface、cache/lock/retry counter |
| 如何处理无迁移状态？ | `RequestAdmissionState`、不可变 assessment/posture 作为 state carrier 记录集合和终态，矩阵明确“无原地迁移，新 revision/new request 承接” |
| ACK、commit unknown、restore success 如何区分？ | 分别保留在 action/handoff/item/lifecycle 状态机中；ACK 不等 commit，Archive 不推导 owner/project archived/restored |
| 外部 blocker 如何影响状态？ | typed outcome 映射到 `Blocked`/`CommitUnknown`/`Unknown` 等已定义状态；不以 timeout、字符串或默认值推导确定失败 |

### 2.2 状态主语筛选表

| 候选主语 | 来源对象 / 字段 | 是否进入 | 原因 | 状态族 |
|---|---|---:|---|---|
| `ArchiveRequest.admission()` | `RequestAdmissionState` | 是 | C01/C02 读取并 replay；不可变 admission | business truth |
| `ArchiveJob.aggregate_posture` | `JobAggregatePosture` | 是 | J01/reports/Q01 读取与推进 | business truth |
| `ArchiveJob.current_stage` | `ArchiveJobStage` | 是 | J01 触发 stage edge，Q01 暴露 | business truth |
| `ArchiveSourceBinding.state` | `SourceBindingState` | 是 | J02/E02/J03 读取与推进 | source/reference |
| `CaptureAttempt.state` | `CaptureAttemptState` | 是 | J03/J04/E02 推进和 replay | source/reference |
| `ArchiveBundle.state` | `ArchiveBundleState` | 是 | J05/J06/Q02 推进和暴露 | business truth |
| `VerificationAssessment.posture` | `VerificationPosture` | 是 | J07/Q03 读取和映射 | assessment truth |
| `CompatibilityAssessment.posture` | `CompatibilityPosture` | 否 | immutable target classification，无原地迁移 | classification（排除） |
| `ArchivePlacement.state` | `PlacementState` | 是 | J09/J12/E04/Q02 读取和推进 | external-effect |
| `ArchivePlacement.retrieval_state` | `RetrievalState` | 是 | J10/Q02 读取和推进 | external-effect |
| `LifecycleExecution.state` | `LifecycleExecutionState` | 是 | C03/J11/J12-L/E03 推进 | external-effect |
| `ExternalActionRecord.posture` | `ExternalActionPosture` | 是 | J09/J11/J12/E04 记录 effect posture | external-effect |
| `RestorePlan.state` | `RestorePlanState` | 是 | J13/J16/Q04 聚合和暴露 | handoff |
| `RestoreItem.state` | `RestoreItemState` | 是 | J13～J17/E05/Q04 推进和 replay | handoff |
| `RestoreHandoff.state` | `RestoreHandoffState` | 是 | J15/J16/E05 读取和推进 | handoff |
| `CompensationRecord.state` | `CompensationState` | 是 | J17/Q04/Q05 读取和推进 | handoff |
| `ArchiveIdempotencyRecord.state` | `ArchiveIdempotencyState` | 是 | C/E/J reserve、complete、duplicate | idempotency/replay |
| `ArchiveOperationReport.disposition` | `ArchiveJobDisposition` | 否 | 每次 report 的 immutable outcome，不是可迁移 truth 状态 | report/result（排除） |
| `ArchiveConsumerReceipt.disposition` | `ArchiveConsumerDisposition` | 否 | receipt classification，不拥有业务生命周期 | report/result（排除） |
| `WorkerEntry.state` | `WorkerEntryState` | 是 | worker entry start/complete/fail flow 读取 | runtime/entry |
| `WorkerClaim.state` | `WorkerClaimState` | 是 | claim/fence/release/expiry 控制 worker effect | runtime/entry |
| `ArchiveRuntimeBuildState` | infra assembly state | 否 | Step 09 未推进；runtime assembly 不属于本地业务 flow | runtime（后续边界） |
| `ApiEntryDisposition` / `ArchiveQuerySurface` | API/protocol wrapper | 否 | transport-safe result，不是 truth lifecycle | entry/result（排除） |
| `ManifestClosurePosture`、`CaptureCoveragePosture` | immutable evidence classifications | 否 | 新 evidence 产生新记录，不原地迁移 | classification（排除） |
| owner project archived/restored/deleted | owning domains | 否 | 外部 canonical truth，Archive 只消费反馈 | external truth（排除） |

## 3. 状态族与批次顺序

| 状态族 | 状态机 | 所属模块 | 主要触发 flow / 函数 | 停审批次 |
|---|---|---|---|---:|
| business truth | RequestAdmissionState | domain CP1 | C01/C02 `admit/reject/block` | 1 |
| business truth | JobAggregatePosture | domain CP1 | J01 `recompute/block` | 2 |
| business truth | ArchiveJobStage | domain CP1 | J01 `ArchiveJob::advance` | 3 |
| source/reference | SourceBindingState | domain CP2 | J02 `bind/block` | 4 |
| source/reference | CaptureAttemptState | domain CP2 | J03/J04 `mark_in_progress/settle/block/fail/supersede` | 5 |
| business truth | ArchiveBundleState | domain CP3 | J05/J06 `begin_assembly/mark_closure_ready/seal/block/fail` | 6 |
| assessment | VerificationPosture | domain CP4 | J07 `mark_in_progress/settle` | 7 |
| external-effect | PlacementState | domain CP5 | J09/J12 `settle_placement` | 8 |
| external-effect | RetrievalState | domain CP5 | J10 `settle_retrieval` | 9 |
| external-effect | LifecycleExecutionState | domain CP5 | C03/J11/J12-L/E03 `record_intent/mark_dispatched/block/mark_compensated` | 10 |
| external-effect | ExternalActionPosture | domain CP5 | J09/J11/J12/E04 `record_intent/mark_dispatched/settle` | 11 |
| handoff | RestorePlanState | domain CP6 | J13/J16 `recompute/fail/supersede` | 12 |
| handoff | RestoreItemState | domain CP6 | J13～J17/E05 item helpers | 13 |
| handoff | RestoreHandoffState | domain CP6 | J15/J16/E05 handoff helpers | 14 |
| handoff | CompensationState | domain CP6 | J17 compensation helpers | 15 |
| idempotency/replay | ArchiveIdempotencyState | application | C/E/J reserve/complete/replay | 16 |
| runtime/entry | WorkerEntryState | worker | worker entry `start/complete/fail` | 17 |
| runtime/entry | WorkerClaimState | application control | claim `acquire/renew/release/supersede` | 18 |

## 4. 状态机矩阵

### 4.1 `RequestAdmissionState`

**状态集合**：`Accepted`、`Rejected`、`Blocked`；三者均为该 request admission 的终态。`Accepted` 仅表示 Archive 本地受理，不表示 owner 批准、archived、deleted 或 restored。

```text
validated command
   ├─ definite local rule ─> Rejected
   ├─ formal prerequisite unavailable ─> Blocked
   └─ local admission committed ─> Accepted
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | Accepted | `ArchiveRequest::admit(...)` / `RestoreRequest::admit(...)` | validated actor/key/scope/authority；同一 UoW 写 request/job/stage | 保存 admission basis、result、audit/trace；outbox blocked/no-op | `InvalidInput` / `ContractBlocked` |
| none | Rejected | `ArchiveRequest::reject(...)` | definite local validation or wrong-kind | 保存安全 rejection result；不写业务 intent | `InvalidInput` |
| none | Blocked | `ArchiveRequest::block(...)` | authority/scope/contract cannot be proven | 保存 typed basis/result；不伪造 acceptance | `ContractBlocked` |

禁止 `Rejected/Blocked→Accepted` 原地修复；改善必须新 request/admission context。duplicate 是 result replay overlay，不是 admission transition。

### 4.2 `JobAggregatePosture`

**状态集合**：`Queued`、`Running`、`Partial`、`Blocked`、`Failed`、`Completed`。`Completed` 为 Archive-owned workflow 的终态，不推出项目状态。

```text
Queued -> Running -> Partial -> Running
   │         ├────> Blocked -> Running
   │         ├────> Failed
   │         └────> Completed
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Queued | Running | `ArchiveJob::advance(next_stage, expected_version, basis)` | kind-specific first legal stage、CAS version | append stage record；保存 report/checkpoint | `InvalidTransition` / `VersionConflict` |
| Running | Partial | `ArchiveJob::recompute(component_postures, expected_version)` | committed components mixed/incomplete | 保存 component posture set、report | `VersionConflict` |
| Partial | Running | `ArchiveJob::recompute(...)` | required prerequisites restored且仍在执行 | 更新 aggregate/history | `InvalidTransition` |
| Running/Partial | Blocked | `ArchiveJob::block(basis, expected_version)` | typed prerequisite unavailable | 保存 block basis/history；不删 component | `InvalidTransition` / `VersionConflict` |
| Blocked | Running | `ArchiveJob::recompute(...)` | same frozen input formally unblocked | 保存解阻依据；不换 input | `ContractBlocked` / `VersionConflict` |
| Running/Partial | Failed | application 映射 definite plan/job failure | formal definite failure，不是 timeout/unknown | 保存 issue/report | `InvalidTransition` |
| Running/Partial | Completed | `ArchiveJob::recompute(...)` | all required Archive-owned components committed and no partial/blocked/unknown | append final stage/history；outbound remains blocked | `InvalidTransition` |

禁止 `Completed→Running`、单组件 Completed→aggregate Completed、Query 触发迁移。

### 4.3 `ArchiveJobStage`

**状态集合**：Archive 路径 `Queued → SourcePlanning → SourceCapture → ManifestAssembly → Verification → Placement → Sealing → Completed`；Restore 路径 `Queued → RestorePlanning → MaterialPreparation → RestoreHandoff → Reconciliation/Compensation → Completed`。stage 与 aggregate posture 独立。

```text
Archive: Queued -> SourcePlanning -> SourceCapture -> ManifestAssembly
       -> Verification -> Placement -> Sealing -> Completed
Restore: Queued -> RestorePlanning -> MaterialPreparation -> RestoreHandoff
       -> Reconciliation -> Compensation -> Completed
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Queued | SourcePlanning/RestorePlanning | `ArchiveJob::advance` | job kind 匹配 | append `ArchiveJobStageRecord` | `InvalidTransition` |
| SourcePlanning | SourceCapture | `ArchiveJob::advance` | required bindings planned/bound | stage history | `PreconditionFailed` |
| SourceCapture | ManifestAssembly | `ArchiveJob::advance` | required captures settled or explicit conservative disposition | stage history | `PreconditionFailed` |
| ManifestAssembly | Verification | `ArchiveJob::advance` | fixed manifest/closure available | stage history | `PreconditionFailed` |
| Verification | Placement | `ArchiveJob::advance` | required assessment results present; unsupported/unknown blocks | stage history | `PreconditionFailed` |
| Placement | Sealing | `ArchiveJob::advance` | placement/effect and seal basis satisfy exact guards | stage history | `PreconditionFailed` |
| Sealing | Completed | `ArchiveJob::advance` | sealed bundle and required local components complete | stage history | `PreconditionFailed` |
| RestorePlanning | MaterialPreparation | `ArchiveJob::advance` | plan fixed and items enumerated | stage history | `PreconditionFailed` |
| MaterialPreparation | RestoreHandoff | `ArchiveJob::advance` | eligible material ready | stage history | `PreconditionFailed` |
| RestoreHandoff | Reconciliation/Compensation | `ArchiveJob::advance` | unknown/failed handoff requires corresponding path | stage history | `PreconditionFailed` |
| Reconciliation/Compensation | Completed | `ArchiveJob::advance` | required owner-specific outcomes/compensation records complete | stage history | `PreconditionFailed` |

`Reconciliation`/`Compensation` 为 Step 06 已登记、但具体重试算法留 Step 12/13 的阶段；当前 flow 只能按已保存 target 进入，不能自行创建 retry policy。

### 4.4 `SourceBindingState`

**状态集合**：`Planned`、`Bound`、`Blocked`、`Retired`。

```text
Planned -> Bound -> Retired
    └──> Blocked -> Bound
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Planned/Blocked | Bound | `ArchiveSourceBinding::bind(authority_ref, contract_ref, expected_version)` | source class/owner 一致，正式 authority/contract 可核验 | save binding/version | `ContractBlocked` / `VersionConflict` |
| Planned/Bound | Blocked | `ArchiveSourceBinding::block(basis, expected_version)` | authority/contract/fence 不可证明 | append block history | `InvalidTransition` |
| Planned/Bound/Blocked | Retired | `ArchiveSourceBinding::retire(...)` | replacement request/revision persisted | 保存 retirement basis | `InvalidTransition` |

`Retired` 终态，不复活；workspace projection 不得使其变为 Bound。

### 4.5 `CaptureAttemptState`

**状态集合**：`Requested`、`InProgress`、`Settled`、`Blocked`、`Failed`、`Superseded`。

```text
Requested -> InProgress -> Settled
                    ├──> Blocked -> InProgress
                    ├──> Failed
                    └──> Superseded
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Requested/Blocked | InProgress | `CaptureAttempt::mark_in_progress(expected_version)` | fixed input、binding/fence 可读取 | save attempt state | `PreconditionFailed` / `VersionConflict` |
| InProgress | Settled | `CaptureAttempt::settle(...)` | exact binding/scope/material/version；coverage 可为非 Complete但如实保存 | append source/coverage/finding | `InputMismatch` / `VersionConflict` |
| InProgress | Blocked | `CaptureAttempt::block(basis, expected_version)` | formal prerequisite unavailable | save block basis | `InvalidTransition` |
| InProgress | Failed | `CaptureAttempt::fail(reason_ref, expected_version)` | definite source failure | save safe reason | `InvalidTransition` |
| Requested/InProgress/Blocked | Superseded | `CaptureAttempt::supersede(replacement_ref, expected_version)` | replacement != self | late result rejected; history preserved | `InvalidTransition` |

`Settled/Failed/Superseded` 当前 attempt 终态；timeout/possible dispatch 只能 `Blocked`/`CommitUnknown` 相关记录，不能直接 Failed。

### 4.6 `ArchiveBundleState`

**状态集合**：`Draft`、`Assembling`、`ClosureReady`、`Sealed`、`Blocked`、`Failed`。

```text
Draft -> Assembling -> ClosureReady -> Sealed
                  ├──> Blocked -> Assembling (new revision)
                  └──> Failed
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Draft/Blocked | Assembling | `ArchiveBundle::begin_assembly(expected_version)` | new manifest revision context | save assembly origin | `InvalidTransition` |
| Assembling | ClosureReady | `mark_closure_ready(manifest, expected_version)` | same revision，closure=`Complete` | save closure basis | `ClosureIncomplete` / `VersionConflict` |
| ClosureReady | Sealed | `seal(basis, manifest, verification, compatibility, placement, expected_version)` | exact closure、Verified、required Supported、Committed placement | save seal basis/history；outbound blocked | `SealGuardFailed` |
| Assembling/ClosureReady | Blocked | `block(reason_ref, expected_version)` | required formal prerequisite unavailable | save block history | `InvalidTransition` |
| Assembling/ClosureReady | Failed | `fail(reason_ref, expected_version)` | definite assembly/seal failure | save failure basis | `InvalidTransition` |

`Sealed` 终态；不推导 archived，旧 closure 不能解锁新 assembly。

### 4.7 `VerificationPosture`

**状态集合**：`Pending`、`InProgress`、`Verified`、`IntegrityFailed`、`Unknown`、`Blocked`。

```text
Pending -> InProgress -> Verified
                    ├──> IntegrityFailed
                    ├──> Unknown
                    └──> Blocked
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Pending | InProgress | `VerificationAssessment::mark_in_progress(...)` | capability ref 与 fixed input 存在 | save assessment attempt | `ContractBlocked` |
| InProgress | Verified/IntegrityFailed/Unknown/Blocked | `VerificationAssessment::settle(mapped_result, ...)` | typed capability result exact input | save immutable assessment/findings/report | `InputMismatch` / `InvalidTransition` |

所有结果为该 assessment 终态；重验必须创建新 assessment，不原地回退或由 fake/config 升格 Verified。

### 4.8 `PlacementState`

**状态集合**：`IntentRecorded`、`Dispatched`、`Committed`、`CommitUnknown`、`Blocked`、`Failed`。

```text
IntentRecorded -> Dispatched -> Committed
                              ├──> CommitUnknown -> Committed/Failed/CommitUnknown
                              ├──> Blocked
                              └──> Failed
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| IntentRecorded | Dispatched | `ArchivePlacement::mark_dispatched(...)` | action target/effect key exact | save action posture | `InputMismatch` |
| Dispatched/CommitUnknown | Committed/CommitUnknown/Blocked/Failed | `ArchivePlacement::settle_placement(...)` | typed storage observation | save location/tier/commit only on formal commit | `InvalidTransition` |

ACK/timeout 不得转 Committed；CommitUnknown 不得盲重发，必须 J12 probe。

### 4.9 `RetrievalState`

**状态集合**：`Unknown`、`NotRequested`、`Requested`、`Retrievable`、`Unavailable`、`Failed`。

```text
Unknown/NotRequested -> Requested -> Retrievable
                                      ├──> Unavailable
                                      └──> Failed
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Unknown/NotRequested | Requested | J10 retrieval intent writer | sealed revision、placement binding、stable effect key | save retrieval intent | `PreconditionFailed` |
| Requested | Retrievable/Unavailable/Failed/Unknown | `ArchivePlacement::settle_retrieval(...)` | typed retrieval observation | save independent retrievability evidence | `InvalidTransition` |

Placement `Committed` 不得推导 `Retrievable`；取回 unknown 不生成 restore material。

### 4.10 `LifecycleExecutionState`

**状态集合**：`Eligible`、`IntentRecorded`、`Dispatched`、`Acknowledged`、`Committed`、`CommitUnknown`、`Blocked`、`Failed`、`Compensated`。

```text
Eligible -> IntentRecorded -> Dispatched -> Acknowledged -> Committed
                                      ├──> CommitUnknown -> probe -> Committed/Failed
                                      ├──> Blocked
                                      └──> Failed -> Compensated
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Eligible | IntentRecorded | `LifecycleExecution::record_intent(...)` | formal decision applicability/no conflicting hold | save action intent | `ContractBlocked` |
| IntentRecorded | Dispatched | `mark_dispatched(...)` | action posture Dispatched、target exact | save dispatch observation | `InputMismatch` |
| Dispatched | Acknowledged/Committed/CommitUnknown/Blocked/Failed | `LifecycleExecution` settle mapper | typed storage/lifecycle observation | save action/effect history | `InvalidTransition` |
| Eligible/IntentRecorded/Dispatched/Acknowledged/CommitUnknown | Blocked | `LifecycleExecution::block(current_decision, reason_ref, ...)` | new hold/conflict/expiry before definite commit | save decision basis；保留 effect history | `InvalidTransition` |
| Failed/Blocked | Compensated | `mark_compensated(evidence_ref, ...)` | exact formal compensation completion | save compensation evidence；不删原 action | `CompensationNotAuthorized` |

`Acknowledged` 不等 `Committed`；`Committed` 与新 hold 不互相覆盖；`Compensated` 不抹除原效果。

### 4.11 `ExternalActionPosture`

**状态集合**：`IntentRecorded`、`Dispatched`、`Acknowledged`、`Committed`、`CommitUnknown`、`Failed`。它是 `ExternalActionRecord` 的 effect history，不取代 placement/lifecycle aggregate。

```text
IntentRecorded -> Dispatched -> Acknowledged/Committed/CommitUnknown/Failed
CommitUnknown -> probe -> Committed/Failed/CommitUnknown
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| IntentRecorded | Dispatched | `ExternalActionRecord::mark_dispatched(...)` | permit/target/effect key exact | save action history | `InputMismatch` |
| Dispatched/CommitUnknown | Acknowledged/Committed/CommitUnknown/Failed | `ExternalActionRecord::settle(observation, ...)` | typed observation matching action | save observation; raw provider body forbidden | `InvalidTransition` |

### 4.12 `RestorePlanState`

**状态集合**：`Draft`、`Ready`、`Blocked`、`InProgress`、`Partial`、`HandoffComplete`、`Failed`、`Superseded`。

```text
Draft -> Ready -> InProgress -> Partial -> InProgress
  └──> Blocked -> Ready
InProgress -> HandoffComplete/Failed
非终态 -> Superseded
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Draft/Blocked/Ready/InProgress/Partial | Ready/Blocked/InProgress/Partial/HandoffComplete | `RestorePlan::recompute(item_postures, ...)` | exact frozen item set、typed prerequisite/outcome | save plan transition/report | `InputMismatch` / `VersionConflict` |
| 非终态 | Failed | `RestorePlan::fail(basis_ref, ...)` | explicit plan-level definite failure | save plan failure basis | `PlanFailureBasisMissing` |
| Draft/Ready/Blocked/InProgress/Partial | Superseded | `RestorePlan::supersede(replacement_ref, ...)` | replacement != self | preserve old plan history | `InvalidTransition` |

`HandoffComplete` 只表示每个 item 有确定 receiver outcome，不代表全部成功或 project restored。

### 4.13 `RestoreItemState`

**状态集合**：`Planned`、`Blocked`、`MaterialReady`、`HandoffPending`、`InProgress`、`Succeeded`、`Rejected`、`Failed`、`CommitUnknown`、`CompensationPending`、`Compensated`。

```text
Planned -> MaterialReady -> HandoffPending -> InProgress
   └──> Blocked -> MaterialReady
InProgress -> Succeeded/Rejected/Failed/CommitUnknown
Failed/CommitUnknown -> CompensationPending -> Compensated
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Planned/Blocked | MaterialReady | `RestoreItem::bind_material(...)` | exact owner/revision/entries/material/eligibility basis | save material ref | `EligibilityMissing` |
| Planned/MaterialReady | Blocked | `RestoreItem::block(...)` | safety/authority/compatibility/retrieval unavailable | save safe basis | `InvalidTransition` |
| MaterialReady | HandoffPending | handoff intent writer | stable receiver input persisted | save handoff ref | `PreconditionFailed` |
| HandoffPending | InProgress | `RestoreItem::mark_in_progress(handoff, ...)` | handoff Dispatched/Acknowledged exact | save item state | `InputMismatch` |
| InProgress | Succeeded/Rejected/Failed/CommitUnknown | receiver feedback mapper | matching owner/receiver/effect outcome | append outcome/history | `InvalidTransition` |
| Failed/CommitUnknown | CompensationPending | `mark_compensation_pending(compensation, ...)` | authorized planned compensation | save current compensation ref | `CompensationNotAuthorized` |
| CompensationPending | Compensated | `mark_compensated(compensation, ...)` | compensation state Completed exact handoff | save item transition | `InputMismatch` |

owner 间不传播状态；conflicting/late feedback 不覆盖历史，转 CommitUnknown 或保留 finding。

### 4.14 `RestoreHandoffState`

**状态集合**：`IntentRecorded`、`Dispatched`、`Acknowledged`、`Succeeded`、`Rejected`、`Failed`、`CommitUnknown`、`ReconcileRequired`。

```text
IntentRecorded -> Dispatched -> Acknowledged/Succeeded/Rejected/Failed/CommitUnknown
CommitUnknown -> ReconcileRequired -> Succeeded/Rejected/Failed/CommitUnknown
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | IntentRecorded | `RestoreHandoff::record_intent(...)` | exact receiver/item/material input | save local intent before effect | `PreconditionFailed` |
| IntentRecorded | Dispatched | `mark_dispatched(...)` | permit、receiver target exact | save dispatch posture | `InputMismatch` |
| Dispatched/Acknowledged | Succeeded/Rejected/Failed/CommitUnknown/ReconcileRequired | receiver outcome mapper | typed owner feedback；ACK 不证明 commit | append outcome/history | `InvalidTransition` |
| CommitUnknown | ReconcileRequired | reconcile mapper | effect may have committed or feedback conflicts | schedule J16 target；不重发 | `InvalidTransition` |
| ReconcileRequired | Succeeded/Rejected/Failed/Acknowledged/CommitUnknown | `ReconcileRestoreHandoff` | probe result exact handoff key | append reconciliation result | `ProbeUnavailable` |

### 4.15 `CompensationState`

**状态集合**：`Planned`、`InProgress`、`Completed`、`Failed`、`CommitUnknown`、`Blocked`。

```text
Planned -> InProgress -> Completed
                    ├──> Failed
                    ├──> CommitUnknown -> probe -> Completed/Failed/Blocked
                    └──> Blocked
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | Planned | compensation planner | formal authority/action/receiver/key/input | save plan intent | `CompensationNotAuthorized` |
| Planned | InProgress | `CompensationRecord::start(...)` | authority and exact handoff/action present | save intent before effect | `PreconditionFailed` |
| InProgress | Completed/Failed/CommitUnknown/Blocked | compensation outcome mapper | typed receiver result | save record/report | `InvalidTransition` |
| CommitUnknown | Completed/Failed/Blocked/CommitUnknown | `probe_compensation` reconcile | typed probe result | preserve original handoff history | `ProbeUnavailable` |

`Completed` 不覆盖原 handoff 状态，也不改变 owner/project truth。

### 4.16 `ArchiveIdempotencyState`

**状态集合**：`Reserved`、`Completed`、`Conflict`。

```text
absent -> Reserved -> Completed
             └──────> Conflict

same key + different operation/digest -> return Conflict disposition; existing record unchanged
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| absent | Reserved | `reserve_operation(context, scope, digest)` | non-Query channel、key/context/digest exact | same UoW reservation | `DuplicateDigestConflict` |
| Reserved | Completed | `complete_operation(key, digest, result_ref, expected)` | complete typed result saved in same UoW | enables replay | `ResultMissing` / `VersionConflict` |
| Reserved | Conflict | `ArchiveIdempotencyRecord::mark_conflict(reason_ref, expected)` | 正式证明当前 reservation 本身非法，且不存在 committed result | 在 CAS 下保存受控处置依据；保留原 key/operation/digest | `VersionConflict` / `InvalidTransition` |
| Reserved/Completed | unchanged | `reserve_operation` / replay validation | 新到请求使用同 key 但 operation/digest 不同 | 只返回 `Conflict` disposition；不修改原 reservation、不抢走原 result、不重跑 | `DuplicateDigestConflict` |

`Completed/Conflict` 终态；Query 不进入该状态机。缺完整 stored result 不得把 Reserved 伪装 Completed。`mark_conflict` 不是处理新到异输入的捷径，只用于受控处置已被正式证明非法的原 reservation。

### 4.17 `WorkerEntryState`

**状态集合**：`Registered`、`Running`、`Delayed`、`Completed`、`Stopped`、`Failed`。

```text
Registered/Delayed -> Running -> Completed
                         └────> Failed
Registered/Running/Delayed -> Stopped
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| Registered/Delayed | Running | `ArchiveWorkerEntry::start(observed_at)` | claim active（如需要）、entry kind registered | 清除 delay issue；不写业务 truth | `StaleClaim` |
| Running | Completed | `ArchiveWorkerEntry::complete(result_ref)` | stored result operation matches | 仅更新进程内 entry；durable completion 由 result+checkpoint commit 证明 | `ResultMismatch` |
| Registered/Running/Delayed | Failed | `ArchiveWorkerEntry::fail(issue_ref)` | safe worker issue | 仅更新进程内 entry disposition；durable 恢复仍看业务 truth/result/checkpoint | `InvalidTransition` |
| Registered/Running/Delayed | Stopped | controlled shutdown/config validation | explicit stop reason | 仅停止当前 runner；不创建持久 entry marker | `InvalidTransition` |

Worker entry state 不等 job aggregate posture；`Completed` 仅表示该 bounded entry 有 stored result。

### 4.18 `WorkerClaimState`

**状态集合**：`Active`、`Released`、`Expired`、`Superseded`。

```text
acquire -> Active -> Released
            ├──> Expired
            └──> Superseded
```

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | Active | `WorkerLeasePort::acquire(request)` | exact entry/target/holder/lease | persist claim/fence | `ClaimUnavailable` |
| Active | Active | `renew(claim, fence, expected)` | same holder/fence not expired | update lease under CAS | `StaleClaim` |
| Active | Released | `release(claim, fence, expected)` | holder owns active fence | save release/checkpoint | `StaleClaim` |
| Active | Expired | time observation in claim control | current time beyond persisted expiry | block effect; no business transition | `StaleClaim` |
| Active | Superseded | `WorkerClaim::supersede(new_fence)` | same target has newer formal fence | old fence rejected | `StaleClaim` |

Claim state 是 application control，不是 Archive 业务成功；expired/superseded 不允许继续外部 dispatch。

## 5. 非法转换处理总表

| 类别 | 统一错误 | 处理规则 |
|---|---|---|
| 终态再次迁移 | `InvalidTransition` | 不改对象；保存安全 issue/result（如该 flow 有 result） |
| expected version/CAS 不符 | `VersionConflict` | 回滚本地 UoW；重新读取后由后续 job 决定，不覆盖他人提交 |
| fixed input / owner / revision 不符 | `InputMismatch` / `Conflicting` | 拒绝本次 transition；保留旧历史，禁止从 ref/string 猜测 |
| 前置 authority/hold/compatibility 缺失 | `ContractBlocked` / `PreconditionFailed` | 进入已有 `Blocked`/`Unknown`，不默认通过 |
| external effect 结果未知 | `CommitUnknown` / `ReconcileRequired` | 保存 effect correlation；只能 probe/reconcile，不盲重发 |
| worker claim 失效 | `StaleClaim` | 不提交业务变更、不发外部 effect；entry 可 Failed/Delayed |
| duplicate replay 结果缺失 | `ResultMissing` / `CorruptRecord` | 不重建当前结果、不重跑 mutation；阻塞并记录 blocker |

非法转换不得依赖错误字符串、HTTP status、stored report、cache 或 fake 私有 map 推断。

## 6. 跨状态机命名 / 触发 / 测试审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态名称 | pass | 全部使用 Step 06 enum 变体；未引入同义 `Done/Success/ReadyToRestore` |
| 业务状态与技术状态 | pass | Job/Bundle/restore truth 与 WorkerEntry/Claim 分离；不新增 GlobalState |
| ACK/commit/unknown | pass | action、lifecycle、handoff 各自保留 Acknowledged/Committed/CommitUnknown 语义 |
| flow 触发覆盖 | pass | Step 09 C01～C03、E01～E05、J01～J17 均可回指至少一个 transition helper 或 immutable state construction |
| Query 触发迁移 | pass | Q01～Q05 只读；不调用 transition、verify、probe、repair、cache write |
| owner 状态边界 | pass | 不在 Archive 定义 archived/restored/deleted/project lifecycle state |
| source-authority | pass_with_upstream_blockers | source fence/coverage 与 owner 合同仍由 AR-UP-001/006/008 决定 |
| outbound/handoff | blocked | `AR-HLD-Q-001` 未解锁；无 outbox/publisher state machine |
| retry/algorithm | deferred | 具体 backoff/attempt budget 留 Step 13；本 Step 只定义 CommitUnknown/ReconcileRequired 红线 |
| tests / acceptance naming | pass | Step 09 测试切口、未来 Step 16/06 必须复用本文件正式状态名；当前不执行测试 |

## 7. 前后对比、待确认与完成门禁

**前**：Step 09 已描述 flow 中的状态变化，但未按状态主语区分状态族、终态、非法转换和跨状态副作用。
**后**：筛选出 18 个真实状态主语，排除纯 ref/DTO/immutable classification/外部 truth/全局伪状态；逐个给出集合、ASCII 图、转换矩阵、非法错误和副作用，并完成跨状态命名与触发审计。

待确认仍为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`；这些 blocker 不改变本地矩阵，但阻止 provider/storage/crypto/receiver/outbound 被标 ready。未创建代码、未执行测试、未生成真实 artifact/report/evidence/verdict/readiness、未提交 commit。

| 门禁 | 结果 |
|---|---|
| 状态主语先筛选 | pass |
| 18 个状态主语逐一矩阵 | pass |
| 状态名回指 Step 06 | pass |
| 触发函数回指 Step 06/Step 09 | pass |
| 非法转换与副作用闭合 | pass |
| 跨状态机命名/触发/测试审计 | pass_with_upstream_blockers |
| formal 03 回填 | not allowed until Step 19 |
| 下一步 | `stop_review`，等待用户明确授权 Step 11 |
