# Step 9. 状态定义与状态流转

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 9。

- [x] 读取项目 ledger、02 flow、Step 6~8、正式 01 §6/§9/§13。
- [x] 回答状态主语、触发、允许/禁止迁移与传播问题。
- [x] 按 CP1→CP6 区分状态轴并逐项停审。
- [x] 完成触发覆盖、同名语义、传播与历史污染审计。

## 2. 本步输入、问题回答与诊断

本仓存在多个正式状态机，但不存在“全局归档状态机”。状态只属于 Step 6 对象，迁移触发必须回指 Step 7/8 的 Command、Consumer 或 Job；Query 只派生响应。对象的 `Blocked`、`Failed`、`Completed` 只能在对象/状态轴语境中解释。

旧 02 把 snapshot/bundle/storage/restore 聚成线性 `Pending→Archived→Restored`，会让一个局部成功推导项目业务状态。当前按 request admission、job、binding/capture/coverage、bundle/closure、verification/compatibility、placement/retrieval/lifecycle、restore plan/item/handoff/compensation 分轴；不存在跨轴自动迁移。

## 3. 状态主语与归属总表

| CP | 对象 / 状态轴 | 正式触发 | 不代表什么 |
|---|---|---|---|
| CP1 | ArchiveRequest/RestoreRequest admission；ArchiveJob | RequestArchive/Restore、AdvanceArchiveJob | 业务批准、项目 archived/restored |
| CP2 | ArchiveSourceBinding；CaptureAttempt；CaptureCoverage | Plan/Capture/Reconcile、source feedback | source truth 生命周期或跨 owner 一致版本 |
| CP3 | ArchiveBundle；ManifestClosure；BundleManifest revision | AssembleBundleManifest、SealArchiveBundle | 项目状态、完整性、storage commit |
| CP4 | VerificationAssessment；CompatibilityAssessment | Assess integrity/compatibility | 业务真实性、schema authority 或 receiver 成功 |
| CP5 | ArchivePlacement placement/retrieval；LifecycleExecution；ExternalActionRecord | lifecycle command、storage/governance consumer、四 jobs | governance decision truth、provider truth |
| CP6 | RestorePlan；RestoreItem；RestoreHandoff；CompensationRecord | build/material/dispatch/reconcile/compensate、receiver feedback | owner business commit 或全域 restored |

## 4. CP1 请求受理与作业状态

### 请求 admission

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `Accepted` | Archive 本地受理并形成 job 语境 | 是 | 不表示业务批准。 |
| `Rejected` | 输入或明确规则不满足 | 否，终局 | 同 key 同输入读回。 |
| `Blocked` | authority/owner/合同前提不能证明 | 否，终局 | 条件改善需新请求或明确新语境。 |

请求 admission 在创建时确定，无原地 `Rejected/Blocked→Accepted`；幂等重放不迁移。

### ArchiveJob 状态流转图

```text
Queued
  │ AdvanceArchiveJob：合法阶段开始
  ▼
Running
  ├── partial component results ──> Partial ──┐
  ├── missing formal prerequisite ─> Blocked │
  ├── definite attempt failure ────> Failed  │
  └── all required local endpoints committed ─> Completed
                         ▲                    │
                         └── explicit advance ┘
```

关键说明：Partial/Blocked 可在同一 job 中由显式 `AdvanceArchiveJob` 在前提闭合后回到 Running；Failed 是否重试及是否新 job 留 03 依据正式规则，但不得隐式复活。Completed 是 Archive-owned 终点，不传播成 owner 业务状态。

允许：Queued→Running；Running↔Partial；Running/Partial→Blocked；Blocked→Running（同一冻结输入和明确解阻）；Running/Partial→Failed/Completed。禁止：Rejected 请求创建 job；任意状态因 Query 迁移；Completed→Running；单 CP success→Completed。

CP1 停审：admission、job aggregate 与业务状态明确分离，触发均存在，`pass`。

## 5. CP2 来源绑定、采集与覆盖状态

### ArchiveSourceBinding

```text
Planned
  ├── formal authority/contract bound ──> Bound
  ├── prerequisite absent/conflicting ──> Blocked
  └── explicit new request/revision ─────> Retired
Bound ── explicit replacement ───────────> Retired
Blocked ── formal resolution ────────────> Bound
```

禁止 Retired 原地复活；workspace/observability auxiliary 不可迁移为 canonical owner。

### CaptureAttempt

```text
Requested ── CaptureArchiveSource ──> InProgress
InProgress ├─ formal result ────────> Settled
           ├─ missing prerequisite ─> Blocked
           ├─ definite failure ─────> Failed
           └─ explicit replacement ─> Superseded
```

Settled/Failed/Superseded 为当前 attempt 终点；Blocked 解阻可在同一固定 attempt/fence 上回 InProgress，否则建立新 attempt。timeout 或本地 commit unknown 不直接写 Failed。

### CaptureCoverage

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `Complete` | owner 证明覆盖声明范围 | 是，仍需其他轴 | 不表示所有 owner 同时一致。 |
| `Partial` | 只有可证明子集 | 受限 | 缺口可见。 |
| `Missing` | owner 明确证明所需材料缺失 | 否或受限 | 不是 timeout/空响应。 |
| `Stale` | 版本不满足该 owner fence | 否或受限 | 不跨 owner 比较。 |
| `Conflicting` | authority/version/coverage 证明冲突 | 否 | 必须人工/owner 解决。 |
| `Unknown` | 无足够证明 | 否或受限 | 不得乐观推进 closure。 |

新 CaptureAttempt 的正式结果可形成新的 coverage 值；旧值作为历史不原地“修复”。任何非 Complete 不得由材料数量或更大 opaque version 强制变 Complete。

CP2 停审：binding/attempt/coverage 分层，source authority 与本地采集状态未混同，`pass_with AR-UP-001/006~008`。

## 6. CP3 Bundle、manifest revision 与 closure

### ArchiveBundle 状态流转图

```text
Draft ── AssembleBundleManifest ──> Assembling
  ▲                                  │
  │ new immutable manifest revision  ├─ Complete closure ─> ClosureReady
  └──────────────────────────────────┤
                                     ├─ missing proof ────> Blocked
                                     └─ definite failure ─> Failed
ClosureReady ── SealArchiveBundle / all fixed preconditions ─> Sealed
```

关键说明：Blocked 在同一请求下可由新 manifest revision 重新进入 Assembling；Failed 的显式 retry/revision 规则留 03；Sealed 终局且不等于项目 archived。已固定 BundleManifest 不迁移，修正创建新 revision 并通过 `previous_revision_ref` 串联。

### ManifestClosure

| 状态 | 含义 | 是否可进入正常主线 | 禁止推导 |
|---|---|---|---|
| `Complete` | 确定 revision 的声明集与实际集闭合 | 可进入 ClosureReady | 不等于 verified/placed/sealed。 |
| `Incomplete` | 声明项缺失 | 否 | storage success 不能修复。 |
| `Overfull` | 有未声明/未获准项 | 否 | 多余材料不可被忽略。 |
| `Invalid` | 条目身份/来源/类别违例 | 否 | digest 通过不能修复。 |
| `Unknown` | 无法可靠比较 | 否 | 不得当 Complete。 |

CP3 停审：revision 不可变，Bundle 与 closure 两层状态清楚，无外部成功反推，`pass`。

## 7. CP4 完整性与兼容性状态

### VerificationAssessment 状态流转图

```text
Pending ── AssessBundleIntegrity ──> InProgress
InProgress ├─ formal valid feedback ─────> Verified
           ├─ mismatch/invalid signature ─> IntegrityFailed
           ├─ insufficient feedback ──────> Unknown
           └─ capability/key/input absent ─> Blocked
```

终点绑定确定 `VerificationInputBinding`；重验或新 revision 建立新 assessment。禁止 `Unknown/Blocked→Verified` 通过配置默认或 fake；Verified 不等于业务真实或可恢复。

### CompatibilityAssessment

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `Supported` | 指定 target context 有正式支持证明 | 是，限定 target | 不跨 receiver 复用。 |
| `Unsupported` | 明确不支持 | 否 | 不自动转换。 |
| `Unknown` | schema/reader/receiver 合同不足 | 否 | fail-closed。 |
| `Conflicting` | 版本/能力声明冲突 | 否 | 保留 finding。 |

CompatibilityAssessment 是确定输入上的不可变结论；新 capability/schema context 产生新 assessment，不原地覆盖历史。

CP4 停审：integrity 与 compatibility 轴、输入 revision 与 target context 均独立，`pass_with AR-UP-004/009`。

## 8. CP5 placement、retrieval 与 lifecycle execution

### ArchivePlacement 状态流转图

```text
IntentRecorded ── PlaceArchiveBundle ──> Dispatched
Dispatched ├─ formal commit ────────> Committed
           ├─ uncertain outcome ────> CommitUnknown
           ├─ missing prerequisite ─> Blocked
           └─ definite failure ─────> Failed
CommitUnknown ── ReconcileExternalAction ─> Committed / Failed / CommitUnknown
```

retrieval 为独立轴：`NotRequested→Requested→Retrievable|Unavailable|Failed`，初始也可为 Unknown。placement Committed 不推导 Retrievable；retrieval Requested 不改变 placement commit。

### LifecycleExecution 状态流转图

```text
Eligible ── RequestLifecycleExecution ──> IntentRecorded
IntentRecorded ── ExecuteArchiveLifecycle ──> Dispatched
Dispatched ├─ receiver ack ─────> Acknowledged
           ├─ formal commit ────> Committed
           ├─ uncertain result ─> CommitUnknown
           ├─ new hold/conflict ─> Blocked
           └─ definite failure ─> Failed
CommitUnknown ── ReconcileExternalAction ─> Committed / Failed / CommitUnknown
Failed/Blocked ── authorized compensation ─> Compensated
```

关键说明：新的 governance decision/hold 可使 Eligible/IntentRecorded/Dispatched/Acknowledged 进入 Blocked；已存在外部副作用不能靠本地 Blocked 抹除，需 reconcile/compensation。Acknowledged 不等于 Committed。

允许：intent-before-dispatch；formal feedback→对应状态；CommitUnknown→probe 结果；正式 authority 下的 compensation。禁止：无 GovernanceDecisionRef→Eligible；hold/invalid decision→dangerous dispatch；CommitUnknown→盲 Dispatched；配置直接写 Committed；delete committed 推导 policy satisfied。

ExternalActionRecord 复用 intent/dispatch/ack/commit/unknown/failed 标签，但它是单次动作历史，不与 LifecycleExecution 自动同值；映射由 Step 8 的反馈流明确提交。

CP5 停审：placement/retrieval/decision/execution/action 分轴，`commit-unknown` 和 hold 优先边界成立，`pass_with AR-UP-003/005`。

## 9. CP6 restore plan、item、handoff 与 compensation

### RestorePlan 状态流转图

```text
Draft ── BuildRestorePlan / freeze items ──> Ready
  ├─ prerequisite missing ─────────────────> Blocked
Ready ── first item dispatch ──────────────> InProgress
InProgress ├─ mixed/unfinished outcomes ───> Partial
           ├─ all required outcomes known ─> HandoffComplete
           └─ plan-level definite failure ─> Failed
Draft/Ready/Blocked/InProgress/Partial ── new plan revision ─> Superseded
```

Blocked 可在同一固定 plan revision 上解阻到 Ready，仅当材料、assessment、retrieval 与 receiver binding 未变化；否则新 revision。HandoffComplete 只说明交接结果齐备，不代表 owner 业务 Restored。

### RestoreItem 状态流转图

```text
Planned ├─ safe prerequisites ───────> MaterialReady
        └─ missing/stale/conflicting/
           unsupported/integrity-failed ─> Blocked
MaterialReady ── persist handoff intent ─> HandoffPending
HandoffPending ── dispatch ─────────────> InProgress
InProgress ├─ formal success ───────────> Succeeded
           ├─ receiver rejection ───────> Rejected
           ├─ definite failure ─────────> Failed
           └─ uncertain outcome ────────> CommitUnknown
CommitUnknown ── reconcile ─────────────> Succeeded / Rejected / Failed /
                                         CommitUnknown / CompensationPending
CompensationPending ── authorized action ─> Compensated
```

关键说明：Succeeded 是 receiver 对 handoff 的正式结果，不是 owner 当前业务状态；per-owner item 独立。Blocked 若固定输入仍适用且正式前置补足可回 Planned/MaterialReady，否则新 plan/item。

### RestoreHandoff 状态流转图

```text
IntentRecorded ── DispatchRestoreHandoff ──> Dispatched
Dispatched ├─ ack ──────────────> Acknowledged
           ├─ success ──────────> Succeeded
           ├─ rejection ────────> Rejected
           ├─ definite failure ─> Failed
           └─ uncertain result ─> CommitUnknown
CommitUnknown ── ReconcileRestoreHandoff ─> ReconcileRequired ─> terminal/unknown
```

同一 handoff 不能改变 receiver/material/input digest；需要改变时创建新 handoff 且由正式计划/补偿关系连接。禁止 ACK/timeout→Succeeded、一个 owner Succeeded→其他 item/plan 业务成功、直接 owner DB 写入。

### CompensationRecord

```text
Planned ── ExecuteRestoreCompensation ──> InProgress
InProgress ├─ formal completion ─> Completed
           ├─ definite failure ──> Failed
           ├─ uncertain result ──> CommitUnknown
           └─ prerequisite absent > Blocked
```

CommitUnknown 只能经 probe 保持或进入明确终点；Completed 不抹除原 handoff/outcome。无 `CompensationAuthorityRef` 不得 Planned。

CP6 停审：plan/item/handoff/compensation 均有触发和禁止迁移，per-owner 与业务状态边界明确，`pass_with AR-UP-002/009`。

## 10. 跨轴传播关系

```text
Archive-owned committed states
  ├─ job / capture / closure / assessment
  ├─ placement / lifecycle action
  └─ restore item / handoff / compensation
                    │
                    ▼
safe read composition
  partial / stale / missing / conflicting /
  unsupported / integrity-failed / commit-unknown remain visible
                    │
                    ├─ optional outbound committed-fact seam (contract pending)
                    ▼
authorized consumers
  no owner truth mutation; no archived/restored projection
```

关键说明：传播仅来自已提交本地事实；当前 outbound event family 未核验。Query 不触发状态迁移；外部 feedback 也须经 Consumer/Job 绑定既有 intent 后才改变本地状态。

## 11. 跨状态一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | 所有状态均回指 Step 6 对象和 CP。 |
| 触发覆盖 | pass | 持久迁移均来自 Step 7/8 Command、Consumer 或 Job；Query no-write。 |
| 同名语义 | pass | Blocked/Failed/Completed 均限定对象，不设全局 enum。 |
| 多轴隔离 | pass | sealed/verified/committed/retrievable/handoff-success 不互相推导。 |
| 外部 truth | pass_with_blockers | owner/project/governance/provider/receiver 状态均不由本仓迁移。 |
| unknown 姿态 | pass | Unknown/CommitUnknown 不可配置放行或盲重试。 |
| 历史污染 | pass | 无 Pending→Archived→Restored 单线状态机；无 RetentionClass/LegalHold 本地状态。 |

## 12. 回填草稿、待确认与进入下一步条件

正式 §9 摘录归属总表、各主要状态轴、核心迁移和传播图；完整迁移穷举、guard、并发检查及错误映射留 03。

各 owner 的状态触发/版本/receiver commit 仍由 `AR-UP-001~009` 阻塞；本步仅锁定本地保守迁移和 forbidden transition。

六 CP 状态均已停审，触发、允许/禁止迁移、传播与多轴隔离完整。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 10。
