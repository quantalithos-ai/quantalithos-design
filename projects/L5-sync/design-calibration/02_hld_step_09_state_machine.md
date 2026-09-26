# Step 9. 状态机与状态流转

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 6~8 的对象、接口和处理流已通过。
- `gate_status=pass_with_upstream_blockers`；17 个 lifecycle 对象、五部分迁移/传播与跨状态审计已完成，`SYNC-UP-001~010` 保持开放。
- 本步定义概要状态语义，不定义枚举代码、数据库列、UI 文案、完整错误码或迁移实现。

### Step 内计划

1. 回读 Step 6 全部状态集合、Step 7 mutation/consumer/job、Step 8 触发路径。
2. 先筛选真正有生命周期的状态主语，排除 policy/view/immutable value 的伪状态机。
3. 按五部分绘制必要状态流转图、列允许/禁止迁移和传播影响。
4. 每部分停审状态归属、触发覆盖、传播与越界；再审计跨部分近义状态。
5. 形成正式 §9 回填草稿并更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 6 §8~13 | 各对象状态、行为与所有权 |
| Step 7 §8~12 | 触发状态变化的 Command/Consumer/Job 与 query no-write |
| Step 8 §8~14 | 状态迁移所处处理阶段、local UoW 和传播接缝 |
| Step 3 `HC-SYNC-03~22` | fail-closed、多轴、local atomic、unknown/provenance 等状态红线 |
| 概要 SOP/规范 Step/§9 | 状态定义、流转图、允许/禁止迁移、传播和停审格式 |

## 3. SOP 问题回答

1. **有哪些正式状态？** 本仓存在多个 Sync-local 状态轴：operation/access/snapshot，binding/metadata/cursor/mapping/local observation，plan/path/run，conflict/checkpoint/manual/probe，candidate/attempt/provenance；没有单一 global sync status。
2. **状态含义/主线资格？** 每轴仅解释其对象；例如 `CursorState.Continuous` 不代表 working tree clean，`HandoffAttempt.TransportKnown` 不代表 Review accepted。
3. **触发动作？** 只由 Step 7 Command、条件 consumer、job 或 Step 8 application flow 的显式 domain method 触发；Query/view assembly 不触发迁移。
4. **允许/禁止迁移？** 允许迁移逐对象列出；禁止 unknown→success、stale→fresh without owner proof、partial→finalized、ACK→Decision、cancel→external rollback 等捷径。
5. **传播关系？** owner invalidation 使 evaluation/plan/candidate 更保守；local drift 使 plan/candidate invalidated；run partial/unknown 产生 checkpoint/conflict；handoff unknown 产生 probe-required；传播不修改外部 truth。
6. **状态归属？** 每个状态明确归 CP 和对象；views 只是汇总，policy 无状态，外部 Decision/archive posture 仅 snapshot fields。
7. **是否同名冲突？** `Blocked/Unknown/Invalidated/Completed` 必须带对象主语；跨对象不自动同步或相互替代。

## 4. 当前文档问题诊断

旧 02 的任务状态机把待执行、运行、完成、失败、冲突等压成单轴，并以 fanout/ACK 推进；draft 也给出 `unbound→selecting→applied→handoff` 的混轴候选。两者都会让本地 operation、working-copy safety、cursor、external transport 和 Governance decision 相互替代，必须重建为有归属的多轴状态模型。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 单一 SyncTask/global state | 16 个有生命周期/状态轴的对象，各自归 CP |
| ACK/任务完成容易作为全局成功 | local/transport/probe/decision/status completeness 分层 |
| conflict/unknown 只是失败分支 | Conflict/Checkpoint/Probe 为独立可恢复状态 |
| view 状态可能反写 truth | `SyncStatusView`/`LayeredHandoffStatus` 无状态机、无 mutation |

## 6. 设计取舍

- 不提供 `SyncStatus = Success/Failed` 总枚举；顶层结果必须点明是哪一个对象/层。
- Immutable values (`SyncSelection`,`SourceDelta`,`WorkingCopyObservation`) 有内部分类轴但无生命周期迁移；policies/views 完全无状态机。
- 外部 Project/Review/Archive 状态仅出现在 `ExternalOwnerSnapshot.safe_state_summary`，本地只能改变 snapshot freshness/visibility，不能迁移外部 lifecycle。
- 状态传播以“使下游更保守/失效”和“追加 local relation”为主，不以事件自动执行业务副作用。

## 7. 状态主语筛选与归属

### 7.1 状态主语筛选

| 类别 | 对象 | 本步处理 |
|---|---|---|
| 有 local lifecycle | `SyncOperation`、`AccessEvaluation`、`ExternalOwnerSnapshot`、`WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet`、`MaterializationPlan`、`PathChangeSet`、`MaterializationRun`、`ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord`、`ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord` | 定义状态、触发、迁移和传播 |
| immutable classification | `SyncSelection`、`WorkingCopyObservation`、`SourceDelta` | 定义分类字段影响，不绘生命周期 |
| stateless policy | 七个 policy 对象 | 无状态；只产出 typed decision |
| derived view | `LayeredHandoffStatus`、`SyncStatusView` | 无 truth lifecycle；只保留来源状态轴和 read completeness |

### 7.2 按部分状态归属表

| 部分 | 状态对象 | 核心轴 | 主要触发接口/流 |
|---|---|---|---|
| CP1 | `SyncOperation` | Planned→Validating→Ready/NeedsAction→Running→terminal | all mutation Commands、shared gate、Cancel/Resume |
| CP1 | `AccessEvaluation` | Eligible/Denied/Blocked/Unknown/Stale | shared gate、invalidation consumer、stale job |
| CP1 | `ExternalOwnerSnapshot` | Fresh/Stale/Unknown/Invalidated/Unavailable | owner result、consumer、stale job/explicit refresh command |
| CP2 | `WorkingCopyBinding` | Initializing/Bound/Restricted/NeedsMigration/NeedsRebind/Invalidated | Clone/Migrate/Rebind/invalidation |
| CP2 | `MetadataManifest` | Valid/NeedsMigration/Corrupt/Unknown/ReadOnlyProtected | Clone/Migrate/IntegrityScan/Rebind |
| CP2 | `CursorState` | Unset/Continuous/Gap/Unknown/Unsupported | Clone/Pull/source invalidation |
| CP2 | `MappingSet` | Valid/Conflict/Unknown/Invalidated | Clone/Pull/Rebind/source/generation change |
| CP3 | `MaterializationPlan` | Draft/Validated/Invalidated/Consumed | Clone/Pull/Resume/invalidation |
| CP3 | `PathChangeSet` | Draft/Safe/Conflict/Blocked/Unknown | plan validation/local observation |
| CP3 | `MaterializationRun` | Prepared/Applying/AppliedPendingFinalize/Finalized/Partial/OutcomeUnknown/Blocked/FailedKnown | Clone/Pull/Resume |
| CP4 | `ConflictRecord` | Open/AwaitingDecision/ResolutionRecorded/Superseded/Closed | detection/RecordResolution/Resume |
| CP4 | `RecoveryCheckpoint` | Captured/Resumable/Invalidated/ProbeRequired/Completed | effect boundaries/Resume/Probe/Cancel |
| CP4 | `ManualResolution` | Recorded/Validated/Applied/Superseded/Rejected | RecordResolution/Resume |
| CP4 | `ProbeRecord` | Prepared/InFlight/ResolvedKnown/StillUnknown/Unsupported/FailedKnown | Probe command/job |
| CP5 | `ReviewCandidate` | Inspecting/Eligible/Frozen/Invalidated/HandedOff | PushReview/invalidation/drift |
| CP5 | `HandoffAttempt` | Prepared/Calling/TransportKnown/OutcomeUnknown/ProbeRequired/ExternalPending/TerminalKnown | PushReview/Probe/Refresh/decision consumer |
| CP5 | `ProvenanceRecord` | Active/Superseded/Protected/IntegrityUnknown | all local transitions/migration/rebind/scan |

## 8. CP1 Selection & Access 状态

### 8.1 状态定义与触发

| 对象 / 状态 | 含义 | 可进入主线 | 触发来源 |
|---|---|---|---|
| Operation `Planned` | explicit selection/intent 已建立 | 否 | mutation inbound / idempotent replay |
| Operation `Validating` | 正执行 owner/local gates | 否 | shared gate |
| Operation `Ready` | 当前 gate 通过 | 是，限明确下一 stage | eligible evaluation |
| Operation `Running` | 明确 local/external stage 正执行 | 已在主线 | `begin_stage` after durable checkpoint |
| Operation `NeedsAction` | conflict/unknown/unsupported/manual/probe | 否 | any part blocked/unknown |
| Operation `Completed` | local use case known terminal result | 终局 | local finalize / known no-op / known handoff result layer |
| Operation `Cancelled` / `FailedKnown` | local continuation 显式取消 / 已知安全失败 | 否 | Cancel / known failure |
| Evaluation `Eligible` | 当前 action 的 owner checks fresh/positive | 可作为 gate input | shared gate |
| Evaluation `Denied/Blocked/Unknown/Stale` | 明确拒绝、合同阻塞、未知或过期 | 否 | owner result / consumer / stale job |
| Snapshot `Fresh/Stale/Unknown/Invalidated/Unavailable` | owner ref 本地可用性与时效，不是 owner lifecycle | 仅 Fresh 可进入 policy input | capture/invalidation/scan |

#### CP1 状态流转图

```text
SyncOperation.Planned
        │ shared eligibility gate
        ▼
SyncOperation.Validating
   ┌────┼───────────────┐
   │    │               │
   ▼    ▼               ▼
 Ready  NeedsAction     FailedKnown
   │      │ resume / revalidate
   ▼      └──────────────► Validating
Running
   ├────────► NeedsAction
   ├────────► Completed
   ├────────► FailedKnown
   └────────► Cancelled

ExternalOwnerSnapshot.Fresh ──invalidation/expiry──► Stale or Invalidated
AccessEvaluation.Eligible   ──snapshot/action drift─► Stale
```

关键说明：

- Operation state 只表达本地编排；Completed 不传播为 Review accepted、Artifact/Baseline 或 archive success。
- NeedsAction 恢复必须重新进入 Validating，不直接跳 Running/Completed。
- Snapshot/Access 只能变得更保守；恢复 Fresh/Eligible 需要新的正式 owner result，而不是时间或 cache。

### 8.2 允许迁移

| 对象 | From → To | 触发 / 条件 |
|---|---|---|
| `SyncOperation` | Planned → Validating | shared gate 开始 |
| `SyncOperation` | Validating → Ready | fresh Eligible 且 local preconditions 可继续 |
| `SyncOperation` | Validating/Running → NeedsAction | blocker/conflict/unknown/probe/manual |
| `SyncOperation` | Ready → Running | durable stage/checkpoint 已准备 |
| `SyncOperation` | NeedsAction → Validating | explicit Resume + current context recheck |
| `SyncOperation` | Running → Completed/FailedKnown | 已知 local result |
| `SyncOperation` | non-terminal → Cancelled | explicit actor cancel；不冒充 external rollback |
| `AccessEvaluation` | Eligible → Stale | snapshot invalidation、action/context drift |
| `ExternalOwnerSnapshot` | Fresh → Stale/Invalidated/Unavailable | time/source contract、正式 invalidation 或 owner unavailable |
| snapshot/evaluation | non-fresh → Fresh/Eligible new record | 仅新正式 owner result；倾向新 snapshot/evaluation identity |

### 8.3 禁止迁移

- `NeedsAction → Running/Completed` 禁止绕过 revalidation。
- `Denied/Blocked/Unknown/Stale → Eligible` 禁止靠默认值、cache age、网络恢复或配置直接转换。
- `Cancelled → Completed` 禁止把本地取消当外部副作用撤销成功。
- Snapshot `Stale/Invalidated/Unavailable → Fresh` 禁止不经 owner proof 原地恢复。

### 8.4 状态传播

Snapshot invalidation/availability 只会把 AccessEvaluation 标 Stale，并使未执行 MaterializationPlan/ReviewCandidate invalidated 或使 operation NeedsAction；不会修改已 finalize local content、外部 Project/Review/Archive 状态或自动撤销 handoff。

### 8.5 CP1 状态停审

| 审查项 | 结论 |
|---|---|
| 状态归属 | operation/evaluation/snapshot 三轴分开 |
| 触发覆盖 | Commands、consumer、job 均可回指 Step 7/8 |
| 允许/禁止 | resume/revalidate 与 no-default-allow 清楚 |
| 传播 | 只收紧 local posture，不反写 owner |
| blocker | `SYNC-UP-001/003` 保持开放，Fresh/Eligible 判定合同不脑补 |

## 9. CP2 Working Copy & Metadata 状态

### 9.1 状态定义与关系

| 对象 | 状态轴 | 主线含义 |
|---|---|---|
| `WorkingCopyBinding` | Initializing/Bound/Restricted/NeedsMigration/NeedsRebind/Invalidated | 只有 Bound 且其他 gates 成立可计划 apply/handoff |
| `MetadataManifest` | Valid/NeedsMigration/Corrupt/Unknown/ReadOnlyProtected | 只有 Valid 可写当前 generation；其余可有限只读 |
| `CursorState` | Unset/Continuous/Gap/Unknown/Unsupported | initial full 可从 Unset；incremental 仅 Continuous |
| `MappingSet` | Valid/Conflict/Unknown/Invalidated | plan 需 Valid 或符合 initial-create contract |
| `WorkingCopyObservation` | Clean/Dirty/Untracked/Conflicted/Unknown × path/lock/tool axes | immutable snapshot；只有 policy 综合判断，不存在单一 Ready |

#### CP2 状态流转图

```text
WorkingCopyBinding.Initializing
        │ manifest + initial local result proven
        ▼
WorkingCopyBinding.Bound
   ├─ integrity/schema drift ─► NeedsMigration
   ├─ source/target mismatch ─► NeedsRebind
   ├─ posture/safety issue ───► Restricted
   └─ relation invalidated ───► Invalidated

MetadataManifest.Valid
   ├─ unsupported older schema ─► NeedsMigration
   ├─ failed integrity ─────────► Corrupt
   ├─ unverifiable closure ─────► Unknown
   └─ protected legacy state ───► ReadOnlyProtected

CursorState.Unset ──proven initial finalize──► Continuous
CursorState.Continuous ──detected gap/invalidation──► Gap or Unknown
```

关键说明：

- Binding、manifest、cursor、mapping、working-tree 是不同轴；Bound 不等于 clean、cursor continuous 或 metadata writable。
- Migration/Rebind 创建新 generation/relation；不得通过原地修改把旧 history 伪装为新状态。
- Cursor 只由 materialization finalize 推进；status/source observation 不触发迁移。

### 9.2 允许迁移

| 对象 | From → To | 触发 / 条件 |
|---|---|---|
| Binding | Initializing → Bound | manifest/binding/provenance 与 initial local result 已知闭合 |
| Binding | Bound → Restricted | posture/access/local safety 使 mutation 受限 |
| Binding | Bound/Restricted → NeedsMigration/NeedsRebind | schema/generation/source/target mismatch |
| Binding | any non-terminal → Invalidated | explicit invalidation；历史保留 |
| Manifest | Valid → NeedsMigration/Corrupt/Unknown/ReadOnlyProtected | scan/load/invalidation typed result |
| Manifest | NeedsMigration → Valid new generation | explicit `MigrateSyncMetadata` committed；不是原 record 静默变更 |
| Cursor | Unset → Continuous | initial materialization Finalized |
| Cursor | Continuous → Continuous | proven incremental finalize to newer owner cursor |
| Cursor | Continuous → Gap/Unknown/Unsupported | comparator/source invalidation/contract loss |
| Mapping | Valid → Conflict/Unknown/Invalidated | path/source/generation change |
| Mapping | Conflict → Valid new version | explicit resolution + new plan + proven finalize |

### 9.3 禁止迁移

- Binding `Initializing → Bound` 禁止在 apply partial/unknown 或 provenance/schema 不明时发生。
- Manifest `Corrupt/Unknown → Valid` 禁止由 query/scan 自动修复或删除记录实现。
- Cursor `Gap/Unknown/Unsupported → Continuous` 禁止靠时间戳、Git commit、收到顺序或强制 full 假设；需正式 continuity/full contract 与 finalize。
- Observation Dirty/Untracked/Conflicted/Unknown 禁止由 Sync 自动 stash/merge/rebase/overwrite 变 Clean。
- Mapping Invalidated 禁止跨 generation 原地复活。

### 9.4 状态传播

- Manifest 非 Valid → Binding Restricted/NeedsMigration，阻断新 plan/candidate；不删除历史。
- WorkingCopyObservation dirty/path/tool unknown → plan/candidate invalidated 或 conflict；不直接改变 cursor。
- Cursor gap/unknown → Pull blocked、candidate eligibility 受影响；不把 local files 自动回滚。
- Rebind/Migrate new generation → 旧 plan/candidate/checkpoint 失效或需显式迁移，provenance 保留 old→new relation。

### 9.5 CP2 状态停审

| 审查项 | 结论 |
|---|---|
| 状态归属 | binding/manifest/cursor/mapping/observation 五轴独立 |
| 触发覆盖 | Clone/Migrate/Rebind/Pull/Scan/consumer 均有触发 |
| 允许/禁止 | no silent repair/rebind/cursor advance 清楚 |
| 传播 | generation 与 local safety 只使下游失效/阻断，不反写 source |
| blocker | `SYNC-UP-006/007/008/010` 保持开放 |

## 10. CP3 Source Materialization 状态

### 10.1 状态定义与关系

| 对象 | 状态轴 | 主线含义 |
|---|---|---|
| `MaterializationPlan` | Draft/Validated/Invalidated/Consumed | 只有 Validated 且执行前仍匹配可创建 run |
| `PathChangeSet` | Draft/Safe/Conflict/Blocked/Unknown | 只有 Safe 可进入 local apply |
| `MaterializationRun` | Prepared/Applying/AppliedPendingFinalize/Finalized/Partial/OutcomeUnknown/Blocked/FailedKnown | 只有 Finalized 表示 local cursor/mapping/provenance 已关联可见 |
| `SourceDelta` | Full/Incremental/NoOp/Gap/Unsupported | immutable input 分类；Gap/Unsupported 不进入 apply |

#### CP3 状态流转图

```text
MaterializationPlan.Draft
     ├─ all gates pass ─────────► Validated
     ├─ conflict / unsupported ─► Invalidated
     └─ generation / drift ─────► Invalidated

MaterializationPlan.Validated ──prepare run──► Consumed

MaterializationRun.Prepared
        │ preconditions still match
        ▼
MaterializationRun.Applying
   ├─ known complete ─► AppliedPendingFinalize ──local UoW──► Finalized
   ├─ partial ────────► Partial
   ├─ outcome unknown ► OutcomeUnknown
   ├─ blocked ────────► Blocked
   └─ known failure ──► FailedKnown
```

关键说明：

- Plan 的 Validated 是一次性 precondition 结论；执行前 drift 可使其 Invalidated，不能把旧计划当授权。
- AppliedPendingFinalize 与 Finalized 分开，防止文件已变化但 cursor/mapping/provenance 尚未提交时误报成功。
- Partial/OutcomeUnknown 传播到 CP4 checkpoint，绝不推进 cursor 或自动重试。

### 10.2 允许迁移

| 对象 | From → To | 触发 / 条件 |
|---|---|---|
| Plan | Draft → Validated | access/source continuity/binding generation/local observation/path safety 全通过 |
| Plan | Draft/Validated → Invalidated | any drift/invalidation/conflict/blocker |
| Plan | Validated → Consumed | durable `MaterializationRun.Prepared` 已建立 |
| PathChangeSet | Draft → Safe/Conflict/Blocked/Unknown | WorkingCopySafetyPolicy evaluation |
| Run | Prepared → Applying | plan/current context still match |
| Run | Applying → AppliedPendingFinalize | all local apply steps known complete |
| Run | AppliedPendingFinalize → Finalized | same generation local UoW commits cursor/mapping/provenance |
| Run | Applying → Partial/OutcomeUnknown/Blocked/FailedKnown | typed facility/application result |
| Run | Partial/OutcomeUnknown → new run Prepared | only explicit Resume/Replan after CP4 policy; old run remains terminal/non-finalized |

### 10.3 禁止迁移

- Plan Draft/Invalidated/Consumed → applying 禁止跳过新 validate/plan。
- PathChangeSet Conflict/Blocked/Unknown → Safe 禁止无新 observation/mapping/decision。
- Run Partial/OutcomeUnknown/Blocked/FailedKnown → Finalized 禁止直接“补状态”；需新 recovery flow 和可证明 result。
- Run Applying → Finalized 禁止跳过 AppliedPendingFinalize/local UoW。
- SourceDelta Gap/Unsupported 禁止当 NoOp/Full/Incremental 继续。

### 10.4 状态传播

- Plan invalidated 不修改 files/cursor，只迫使 replan。
- Run Partial/OutcomeUnknown 创建/更新 RecoveryCheckpoint，Operation → NeedsAction；可能形成 ConflictRecord。
- Run Finalized 才允许 CursorState/MappingSet/ProvenanceRecord 新版本，并可使 Operation Completed。
- Source invalidation 使未执行 plan/candidate invalidated，Cursor continuity → Unknown；不回滚已知 local history。

### 10.5 CP3 状态停审

| 审查项 | 结论 |
|---|---|
| 状态归属 | delta classification、plan、path safety、run 四轴分开 |
| 触发覆盖 | Clone/Pull/Resume/source consumer 均可回指 |
| 允许/禁止 | prepare/apply/pending-finalize/finalize 顺序闭合 |
| 传播 | only Finalized advances cursor/mapping；unknown→CP4 |
| blocker | `SYNC-UP-002/007/008/010` 保持开放 |

## 11. CP4 Conflict & Recovery 状态

### 11.1 状态定义与关系

| 对象 | 状态轴 | 主线含义 |
|---|---|---|
| `ConflictRecord` | Open/AwaitingDecision/ResolutionRecorded/Superseded/Closed | Open/Awaiting/ResolutionRecorded 均阻断受影响路径，直到新执行结果安全收束 |
| `RecoveryCheckpoint` | Captured/Resumable/Invalidated/ProbeRequired/Completed | 决定可 local resume、需 replan/probe/manual 或已收束 |
| `ManualResolution` | Recorded/Validated/Applied/Superseded/Rejected | 意图与执行结果分离 |
| `ProbeRecord` | Prepared/InFlight/ResolvedKnown/StillUnknown/Unsupported/FailedKnown | probe known 也仅说明正式探测结果层 |

#### CP4 状态流转图

```text
ConflictRecord.Open ──needs actor──► AwaitingDecision
       │                                  │
       │ new detection                    │ RecordConflictResolution
       ▼                                  ▼
   Superseded ◄──────────────── ResolutionRecorded
                                          │ new plan / known result
                                          ▼
                                        Closed

RecoveryCheckpoint.Captured
   ├─ local-safe proof ─► Resumable ──resume result──► Completed
   ├─ input drift ──────► Invalidated
   └─ possible external effect ─► ProbeRequired

ProbeRecord.Prepared ─► InFlight
   ├─ formal known result ─► ResolvedKnown
   ├─ still unknown ───────► StillUnknown
   ├─ no contract ─────────► Unsupported
   └─ probe failed known ───► FailedKnown
```

关键说明：

- ResolutionRecorded 不等于 conflict resolved；只有新 plan/action 的已知结果才能 Closed。
- Checkpoint Resumable 只针对 local-safe step，external possible effect 必须 ProbeRequired。
- Probe ResolvedKnown 不自动关闭 conflict或标 accepted；HandoffResultPolicy/owning part 解读正式 result。

### 11.2 允许迁移

| 对象 | From → To | 触发 / 条件 |
|---|---|---|
| Conflict | Open → AwaitingDecision | policy 判断需要 explicit actor/owner input |
| Conflict | Open/AwaitingDecision → ResolutionRecorded | valid `RecordConflictResolution` |
| Conflict | any non-closed → Superseded | 新检测事实替代旧 basis |
| Conflict | ResolutionRecorded → Closed | explicit Resume/Replan 产生 known safe result |
| Checkpoint | Captured → Resumable/Invalidated/ProbeRequired | `RecoverySafetyPolicy.classify_next_action` |
| Checkpoint | Resumable/ProbeRequired → Completed | resumed local result / formal probe + owning flow known result |
| Resolution | Recorded → Validated/Rejected/Superseded | current context/scope/actor validation |
| Resolution | Validated → Applied | 对应新 local action known result |
| Probe | Prepared → InFlight → ResolvedKnown/StillUnknown/Unsupported/FailedKnown | formal probe invocation/result |
| Probe | StillUnknown → new Probe Prepared | only explicit later command/job under contract; old record preserved |

### 11.3 禁止迁移

- Conflict AwaitingDecision/ResolutionRecorded → Closed 禁止只凭用户点击、无冲突推断或日志。
- Checkpoint Invalidated → Resumable 禁止原地恢复；需新 checkpoint/current context。
- Resolution Recorded → Applied 禁止跳过 validation/actual action。
- Probe StillUnknown/Unsupported/FailedKnown → ResolvedKnown 禁止靠 retry count/telemetry/cache 补状态。
- Cancelled operation 禁止使外部 attempt 自动 “rolled back”。

### 11.4 状态传播

- Conflict Open/Awaiting/ResolutionRecorded → owning plan/candidate invalidated、Operation NeedsAction。
- Resolution Validated 只允许创建新 stage/plan；不直接改 path/cursor/handoff。
- Checkpoint ProbeRequired → HandoffAttempt ProbeRequired（若相关）与 Operation NeedsAction。
- Probe ResolvedKnown/StillUnknown 等传播到 HandoffAttempt/LayeredHandoffStatus，但不修改 Governance Decision。

### 11.5 CP4 状态停审

| 审查项 | 结论 |
|---|---|
| 状态归属 | conflict/checkpoint/resolution/probe 四轴独立 |
| 触发覆盖 | Record/Resume/Probe/Job/Cancel 均有处理流 |
| 允许/禁止 | intent≠execution、checkpoint≠proof、probe≠decision 明确 |
| 传播 | 只阻断/恢复 owning local flow，不自动裁决或反写 owner |
| blocker | `SYNC-UP-004/005/010` 保持开放 |

## 12. CP5 Review Handoff & Provenance 状态

### 12.1 状态定义与关系

| 对象 | 状态轴 | 主线含义 |
|---|---|---|
| `ReviewCandidate` | Inspecting/Eligible/Frozen/Invalidated/HandedOff | Frozen 只表示 local immutable candidate；HandedOff 只关联 attempt |
| `HandoffAttempt` | Prepared/Calling/TransportKnown/OutcomeUnknown/ProbeRequired/ExternalPending/TerminalKnown | 每个状态都不本地产生 Review accepted |
| `ProvenanceRecord` | Active/Superseded/Protected/IntegrityUnknown | 来源链完整性/保留状态；不是 evidence verdict |
| `LayeredHandoffStatus` | derived fields only | 无状态机；聚合 candidate/attempt/transport/probe/external decision snapshot |
| `SyncStatusView` | read completeness only | 无业务状态机；CompleteRead 不等于 sync success |

#### CP5 状态流转图

```text
ReviewCandidate.Inspecting
   ├─ gates pass ─► Eligible ──freeze──► Frozen ──prepare attempt──► HandedOff
   └─ blocker/drift ───────────────────► Invalidated
                         Frozen ──later drift/invalidation────────► Invalidated

HandoffAttempt.Prepared ─► Calling
   ├─ known transport + external ref ─► TransportKnown ─► ExternalPending
   ├─ lost/timeout response ──────────► OutcomeUnknown ─► ProbeRequired
   └─ known owner terminal ref ─────────────────────────► TerminalKnown

ProbeRequired ──formal probe──► ExternalPending / TerminalKnown / ProbeRequired

ProvenanceRecord.Active ──replacement relation──► Superseded
             ├─ active reference ────────────────► Protected
             └─ verification gap ────────────────► IntegrityUnknown
```

关键说明：

- Candidate Frozen/HandedOff、Attempt TransportKnown/ExternalPending/TerminalKnown 都不是 Governance Decision；external decision 只以 owner snapshot 字段展示。
- OutcomeUnknown 必须进入 ProbeRequired；probe 后仍 unknown 可保持 ProbeRequired/manual，不自动重放 submit。
- Provenance 状态不受用户取消/cleanup 随意删除；IntegrityUnknown 必须显式可见。

### 12.2 允许迁移

| 对象 | From → To | 触发 / 条件 |
|---|---|---|
| Candidate | Inspecting → Eligible | CandidateEligibilityPolicy 全部 gates pass |
| Candidate | Eligible → Frozen | digest/scope/generation/observation 固定并 committed |
| Candidate | Frozen → HandedOff | durable HandoffAttempt.Prepared 关联 |
| Candidate | Inspecting/Eligible/Frozen/HandedOff → Invalidated | local/source/access/posture/generation/conflict drift；history保留 |
| Attempt | Prepared → Calling | durable prepare 后正式 call 开始 |
| Attempt | Calling → TransportKnown | owner transport outcome known |
| Attempt | Calling → OutcomeUnknown → ProbeRequired | response lost/timeout / checkpoint classification |
| Attempt | TransportKnown → ExternalPending | 有正式 external handoff/Gate ref 且 Decision pending/unknown |
| Attempt | TransportKnown/ExternalPending/ProbeRequired → TerminalKnown | formal owner read/probe returns terminal external state ref |
| Provenance | Active → Protected/Superseded/IntegrityUnknown | active refs/new relation/integrity gap |

### 12.3 禁止迁移

- Candidate Inspecting/Eligible → HandedOff 禁止跳过 Frozen + durable attempt。
- Candidate Invalidated → Frozen/HandedOff 禁止原地复活；需新 candidate identity。
- Attempt Prepared → TransportKnown/ExternalPending 禁止未发生正式 call/owner result。
- Attempt OutcomeUnknown/ProbeRequired → Calling 禁止 blind replay；只能 formal probe/manual/new proven-equivalent attempt。
- ACK/HTTP 200/remote object/Git commit 禁止推进任何 external Decision state。
- Provenance IntegrityUnknown → Active 禁止补造/删除 refs；需正式可审计 repair/new relation。

### 12.4 状态传播关系图

```text
Owner access/posture/source invalidated
        │
        ├─► AccessEvaluation.Stale
        ├─► MaterializationPlan.Invalidated
        └─► ReviewCandidate.Invalidated

Working-copy / generation drift
        ├─► PathChangeSet.Conflict or Unknown
        ├─► MaterializationRun blocked / checkpoint
        └─► ReviewCandidate.Invalidated

MaterializationRun.Partial / OutcomeUnknown
        └─► RecoveryCheckpoint + SyncOperation.NeedsAction

HandoffAttempt.OutcomeUnknown
        └─► RecoveryCheckpoint.ProbeRequired + ProbeRecord

Formal owner Decision snapshot
        └─► LayeredHandoffStatus external layer only
             └─X local files / Artifact / Baseline / Project / Archive mutation
```

关键说明：

- 传播使本地对象更保守或更新只读外部层，不执行自动 filesystem/Git/owner mutation。
- 每条传播均由 Step 7/8 的 Command/Consumer/Job 或 owning service 显式提交，不是隐藏 observer side effect。
- 外部 decision snapshot 只影响 view/reference，不反向改变 candidate content、Artifact/Baseline 或 archive posture。

### 12.5 CP5 状态停审

| 审查项 | 结论 |
|---|---|
| 状态归属 | candidate/attempt/provenance 与 derived views 分开 |
| 触发覆盖 | Push/Refresh/Probe/decision consumer/invalidation 均有 flow |
| 允许/禁止 | durable prepare、no blind replay、no ACK elevation 闭合 |
| 传播 | external decision 只进入 view layer，不反写其他 truth |
| blocker | `SYNC-UP-001/004/005` 保持开放 |

## 13. 跨状态一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 同名/近义状态 | pass | `Completed/Valid/Eligible/Fresh/Finalized/TerminalKnown` 均带对象主语，无 global success |
| 状态触发覆盖 | pass | 所有迁移可回指 Step 7 interface / Step 8 flow / Step 6 method |
| query no-write | pass | views 无 mutation；Get/List/Status 不触发 state transition |
| owner lifecycle | pass | Project/Artifact/Workspace/Decision/Archive 状态仅 snapshot，不由 Sync 迁移 |
| cursor/finalize | pass | only run Finalized advances local cursor/mapping |
| conflict/resolution | pass | resolution intent 不等于 conflict closed或 action applied |
| unknown/probe | pass | unknown 保持显式，probe known 不自动升格 decision |
| cancellation | pass | local Cancelled 不传播为 external rollback/cancel |
| invalidation | pass | plan/candidate/snapshot/evaluation 可变保守；已知历史不被删除 |
| provenance | pass | supersede/protect/integrity unknown 保留链，不伪造/静默清理 |
| detailed-design handoff | pass | enums、guards、persistence mapping、concurrency/optimistic lock 留 03 |
| blocker | pass_with_upstream_blockers | `SYNC-UP-001~010` 未被状态名伪装为已闭合正向合同 |

## 14. 回填草稿

正式 §9 摘录 §7 状态主语/归属、CP1~CP5 的状态定义/图/允许禁止迁移与传播，以及 §13 审计摘要。正文明确多轴模型和“无 global sync success”，避免将所有表压成单一状态机。

延伸阅读入口指向本文件的“状态主语筛选与归属”、各 CP“状态停审”“状态传播关系图”和“跨状态一致性审计”。

## 15. 待确认事项

- 精确 enum 二级类型、transition guards、并发控制、persistence mapping 与 adapter outcome mapping 留 03；受 `SYNC-UP-001~010` 限制的正向迁移保持 blocked/unsupported。
- Governance Decision/Project posture/source cursor 的外部状态集合以 owner 合同为准；02 不复制或重命名为本地 lifecycle。

## 16. 进入下一步条件

- [x] 有 lifecycle 的 17 个 local 对象状态已归属；immutable/policy/view 无伪状态机。
- [x] 五部分逐一完成状态定义、图、允许/禁止迁移、传播与停审。
- [x] 所有触发可回指 Step 7/8；Query 不触发迁移。
- [x] 多轴、cursor finalize、unknown/probe、resolution intent、ACK/Decision 与 provenance 边界闭合。
- [x] 跨状态审计无 unresolved 同名冲突或外部 truth 状态迁移。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 10。此结论仅为文档静态自检。
