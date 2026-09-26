# Step 9. 定义逐接口函数级处理流

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节：未来正式 `03-详细设计.md` §8 逐接口函数级处理流
- 框架参考：`projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md`；采用 shared template→每个接口独立 flow→单 flow 停审→跨 flow 审计粒度，不复制 Governance truth/outbox/projection 处理。
- 前序门禁：Step 8 的 10 Commands、13 Queries、3 Consumers、3 Jobs 协议均已闭合；Step 7 回补 selection/observation/delta/path/candidate-evaluation repositories 后重新通过接缝审计。

### 1.1 分批写入状态

| 批次 | Flow 族 | 数量 | 状态 |
|---|---|---:|---|
| 9.0 | shared mutation/query/consumer/job discipline | 4 templates | completed |
| 9.1 | Commands | 10 | completed |
| 9.2 | Queries | 13 | completed |
| 9.3 | conditional Consumers | 3 | completed |
| 9.4 | Operations Jobs | 3 | completed |
| 9.5 | final per-flow/cross-flow audit | all | completed |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `03_ddd_step_06_object_contracts.md` | factories、transition functions、state enums、policies。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 所有 repository/UoW/external/tool/diagnostics 函数；flow 不临时发明 port。 |
| `03_ddd_step_08_protocol_contracts.md` | request/result/view/receipt/report schema 与 inventory。 |
| 正式 02 §8 | 18 个关键处理流与 prepare→call→probe/finalize/no-write 轮廓。 |
| `L1-governance` Step 9 | per-flow DTO/domain/port/transaction/error/state/test 停审框架。 |

## 3. SOP 问题回答

1. **哪些协议独立 flow？** Step 8 全部 29 个存在协议：10 Command、13 Query、3 Consumer、3 Job；Outbound Event 不适用，无 flow。
2. **事务在哪里？** local truth prepare/finalize/transition 使用 bounded UoW；owner/source read通常在 local write UoW 外；Git/fs/SDK external effects 绝不声称与 local metadata 同一事务。
3. **幂等在哪里？** Command/Consumer/Job entry 校验后先计算 canonical request digest，local UoW 内 reserve；duplicate known回放，duplicate unknown返回 probe-required，不重跑 effect。
4. **外部 effect 如何处理？** prepare local attempt/checkpoint并 commit→call outside UoW→新 UoW finalize known result；ambiguous→persist OutcomeUnknown/ProbeRequired。
5. **Query？** 只用 read ports；不 begin UoW、不 reserve idempotency、不 refresh/repair/probe/persist observation/emit diagnostics。
6. **失败？** pre-effect known failure可 rollback/record FailedKnown；post-effect unknown不能简单 rollback成“未发生”，必须 checkpoint/attempt/probe。
7. **测试切口？** 每条 flow都列 validation、duplicate、guard、known failure、unknown/partial（如适用）、no forbidden side effect与 evidence ceiling。

## 4. 当前文档问题诊断

Step 8 已定义 DTO，但如果直接交实现，最危险的空白是 external read/call 与 local UoW 的相对顺序、durable prepare、cursor finalize、duplicate unknown 和 query no-write。本步用每条 flow 的精确调用序列消除这些猜测，同时把 Step 11～13 的物理 transaction/lock/retry机制留待后续。

## 5. Flow inventory

| Flow | Protocol | 目标对象/view | 主要 ports | 状态/副作用 | 停审 |
|---|---|---|---|---|---|
| CloneWorkingCopyFlow | Command | selection/operation/binding/manifest/plan/run/cursor/mapping/provenance | CP1/2/3/5 + UoW | local init/materialize | pass_with_blockers |
| MigrateSyncMetadataFlow | Command | binding/manifest/provenance | CP2 + UoW | new generation | pass_with_blockers |
| RebindWorkingCopyFlow | Command | prior/new binding/manifest/provenance | CP1/2/5 + UoW | new relation | pass_with_blockers |
| PullWorkingCopyFlow | Command | delta/plan/path/run/cursor/mapping/provenance | CP1/2/3/4/5 | local materialize | pass_with_blockers |
| RecordConflictResolutionFlow | Command | resolution/conflict | CP4 + UoW | intent only | pass_with_blockers |
| ResumeSyncOperationFlow | Command | checkpoint/operation/owning stage | CP1～5 | explicit branch | pass_with_blockers |
| ProbeUnknownOutcomeFlow | Command | probe/checkpoint/attempt | CP4/5 + probe | external read/probe | pass_with_blockers |
| CancelSyncOperationFlow | Command | operation/checkpoint | CP1/4 + UoW | local cancel only | pass |
| PushReviewCandidateFlow | Command | candidate/attempt/checkpoint/provenance | CP1/2/4/5 + handoff | external effect | pass_with_blockers |
| RefreshReviewHandoffStatusFlow | Command | probe/snapshot/attempt/provenance | CP4/5 + decision/probe | external read + local snapshot | pass_with_blockers |
| 13 Query flows | Query | views/pages | read ports only | none | pass |
| 3 Consumer flows | Consumer | local snapshots/invalidation | repositories/UoW/idempotency/receipt | conservative local write | pass_with_blockers |
| 3 Job flows | Job | integrity/probe/stale/report | list/probe/repos/UoW/job-result | bounded per item | pass_with_blockers |

## 6. Shared flow discipline

### 6.1 Shared local mutation template

```text
[Command entry]
  validate envelope/body/explicit selection
  calculate canonical request digest
        |
        v
[Prepare UoW]
  begin -> reserve idempotency
  duplicate known -> rollback/close read-only and replay stored result
  duplicate unknown -> rollback/close and return probe-required; NO replay
  first execution -> exact-ensure current composition's immutable runtime binding snapshot
  load Versioned<T> + guards
  create/update local intent/checkpoint/attempt with the same snapshot ref
  append required proof/transition/local-result/invocation records
  save with ExpectedLocalVersion + store prepared result marker
  commit
        |
        v
[Optional external/local facility phase]
  call only typed port outside committed local transaction
        |
        v
[Finalize UoW]
  reload Versioned<T> and current generation/fingerprint
  apply domain transition
  save local truth/provenance/stored result; complete idempotency
  commit
        |
        +-- known failure -> typed failed/blocked/conflict
        +-- ambiguous effect -> durable OutcomeUnknown + checkpoint + probe-required
```

不是所有 Command 都有 facility phase；纯 local command可在单一 UoW完成。`rollback` 只能回滚当前 local UoW中尚未 commit的写，不能回滚已发生 Git/fs/SDK effect，也不能删除先前 committed attempt/provenance。

### 6.2 Shared eligibility gate

1. 从 request + actor 构造 `SyncSelection`；首次执行时读取当前composition固定的Step 14 body-free capability snapshot，在同一初始UoW exact `ensure`并让新 `SyncOperation`引用它；duplicate不得ensure或生成新snapshot；随后load/append selection、plan operation。
2. 调 `OwnerAccessPort.checkEligibility/readPosture` 获取 safe result；若 capability blocked/unsupported/unknown，构造保守 evaluation。
3. `captureExternalOwnerSnapshot(...)`、`evaluateAccess(...)`；`IdPort`生成proof/transition refs，构造`EligibilityProofRecord`与`LocalTransitionRecord`；UoW保存 snapshots/evaluation/proof/transition，`beginOperationValidation(...)`。
4. 仅 same selection/action + Fresh Eligible，使用已append/readable的proof ref调用 `markOperationReady(...)`；否则构造对应transition record并调用 `requireOperationAction(...)`/FailedKnown。
5. 危险 facility/external call 前再读取 current owner snapshots/evaluation与operation引用的runtime binding snapshot并调用 `requiresAccessRevalidation(...)` / per-route capability preflight；plan/candidate/attempt必须沿用该runtime snapshot ref，禁止离线 token或当前热更新配置替换历史语境。

### 6.3 Shared query template

```text
[Query entry] validate actor/meta/body
  -> visibility/redaction precheck
  -> read repository/status port (NO UoW, idempotency, write capability)
  -> map present/missing/not-visible/unavailable slices
  -> assemble/redact view/page
  -> return; NO refresh/repair/probe/persist/diagnostic emission
```

### 6.4 Shared consumer/job template

- Consumer：validate envelope before payload→schema/source/digest/idempotency→reserve UoW→duplicate replay→load affected local refs→apply only conservative snapshot/stale/invalidation transition→save receipt/result→commit。Invalid/unsupported/quarantine不持久化 payload body。
- Job：validate system actor/scope/page→reserve run→list bounded targets→每 target独立 reload/guard/UoW→保存 item result→final report/stored result。一个 target unknown不被 batch success隐藏；job不自动扩大 scope。

### 6.5 单 Flow 停审字段

每条 §7～§10 flow 除具体步骤外，统一受以下字段约束；本节只定义检查维度，不能替代各 flow 的差异表。

| 字段 | 必须回答 |
|---|---|
| 输入 | Step 8 的 exact request/envelope/job type、actor/meta/idempotency/scope。 |
| 前置读取 | 每个 repository/read port method、selector key以及 missing/visibility语义。 |
| validation / guard | Step 6 exact domain function/policy；每个参数来自 request、loaded truth、port output、context或ID/clock/digest。 |
| repository / UoW | create absent/update version token、prepare/finalize commit，以及 receipt/result replay。 |
| external/tool port | 调用时点、typed input/output、是否可能产生 effect；无则写 `none`。 |
| 状态变化 | exact subject From→To；无 lifecycle mutation则写 `none`。 |
| success result | 本地可宣称上限与 response字段来源。 |
| known failure | effect boundary可证明的 blocked/conflict/failed-known。 |
| unknown outcome | effect可能发生但不可证明时的 durable checkpoint/probe姿态；不适用须明确。 |
| recovery/manual action | explicit resume/replan/probe/manual或重发新 command；禁止 hidden retry。 |
| forbidden side effects | no auto Git/overwrite/owner truth mutation/ACK elevation/provenance fabrication。 |
| test cuts | validation、guard、duplicate、legal/illegal transition、known/unknown以及禁止调用 spy。 |

## 7. Command flows

### 7.1 `CloneWorkingCopyFlow`

#### 函数级调用图

```text
CloneEntry.handle(SyncCommandRequest<CloneWorkingCopyRequest>)
  -> OperationCoordinator.cloneWorkingCopy(...)
  -> SharedEligibilityGate.evaluate(Clone)
  -> FilesystemInspectionPort.canonicalizeTarget/inspectTarget
  -> MaterialSourcePort.resolveSource/readCapabilities/readDelta
  -> WorkingCopySafetyPolicy + MetadataIntegrityPolicy
  -> prepare UoW: selection + operation + binding.Initializing + manifest + cursor + mapping
       + plan.Validated + run.Prepared + checkpoint + root provenance
  -> GitWorktreePort.prepareLocalChange / FilesystemApplyPort.stageChanges
  -> re-observe + beginMaterializationApply + apply/commit staged changes
  -> finalize UoW: run/cursor/mapping/provenance/manifest/binding/operation/stored result
  -> CloneWorkingCopyResult
```

| 项 | 契约 |
|---|---|
| 输入/前置读 | validate all explicit selection refs and scope；target canonical/empty-or-compatible；no existing incompatible binding。 |
| Domain calls | `createExplicitSyncSelection`、`planSyncMutation`、eligibility functions、`initializeWorkingCopyBinding/MetadataManifest/CursorState/MappingSet`、delta/plan/path/run factories。 |
| prepare commit | 必须在任何 local apply 前 durable operation/binding/manifest/plan/run/checkpoint/root provenance；create writes用 expected absent。 |
| facility phase | bounded stage/apply only；无 remote Git；precondition drift→conflict/needs-action。 |
| finalize | only AppliedPendingFinalize + same generation；同 local UoW写 run Finalized、cursor/mapping、manifest/binding、provenance/stored result。 |
| failure/unknown | pre-apply known blocker不改 files；partial/unknown保存 run/checkpoint/conflict，binding不得 Bound，cursor不推进。 |
| 禁止 | overwrite dirty/untracked、auto merge/rebase/push/stash、Git commit→Artifact/Baseline、伪造 provenance。 |
| test cuts | explicit refs、existing target、owner blocked、gap、dirty/path/symlink、crash each phase、cursor no advance、duplicate known/unknown。 |

停审：DTO/object/ports/UoW/state/result齐全；positive source/metadata/Git/fs paths受 `SYNC-UP-001/002/003/006/007/008/010`。

### 7.2 `MigrateSyncMetadataFlow`

1. Validate target/binding/expected generation/target schema；reserve idempotency UoW。
2. `loadCurrent` manifest、binding、record summaries、provenance parents with versions；`evaluateMetadataIntegrity` and schema support。
3. Acquire metadata lock；`migrateMetadataGeneration(...)` creates new manifest/generation；`completeBindingMigration(...)` constructs the matching Bound binding revision；create transition provenance linking old→new；old records remain protected/readable per policy。
4. One local UoW saves new manifest/binding/current index, creates new-generation `CursorState.Unset`/`MappingSet.Valid` only when their init contracts close, marks prior generation cursor `Unknown` and mapping `Invalidated`, saves provenance/stored result and completes idempotency；release lock after commit/failure。
5. Known unsupported/schema gap→Blocked/NeedsMigration unchanged；integrity unknown/corrupt→no automatic repair；commit ambiguity→do not claim migration, reload/probe local generation in later recovery。

禁止 query/scan触发、in-place overwrite old generation、delete provenance/body/secret。测试：expected-generation conflict、dangling ref、corrupt/unknown、duplicate、commit failure、old chain preserved。Blocker `SYNC-UP-006`。

### 7.3 `RebindWorkingCopyFlow`

1. Validate explicit new selection and actor principal；reserve；load prior binding/manifest/provenance/current local observation。
2. Run shared eligibility for new action/context；`protectAgainstImplicitRebind(...)` confirms explicit mismatch handling；dirty/path/provenance integrity guard。
3. Acquire metadata lock；create new binding identity/generation + new manifest/cursor/mapping as contract permits + transition provenance; invalidate/supersede affected old plans/candidates, never rewrite prior refs。
4. One local UoW saves new relation/old conservative state/provenance/invalidation/stored result。
5. Unknown owner/path/schema→Blocked/NeedsAction；no filesystem overwrite/materialization unless separate clone/pull/resume flow。

禁止 directory/Git-based inference、silent source replacement、old provenance deletion、auto pull。测试：same context no-op, mismatch explicit, dirty/unknown, generation conflict, invalidation propagation。Blockers `001/003/006/010`。

### 7.4 `PullWorkingCopyFlow`

```text
PullEntry -> validate/reserve + SharedEligibilityGate
  -> load binding/manifest/cursor/mapping and read-only observation
  -> MaterialSourcePort.resolveSource/readDelta
  -> SourceDelta/PathChangeSet/MaterializationPlan validate
  -> prepare run+checkpoint+plan consumed in local UoW
  -> stage/apply bounded Git/fs changes outside UoW
  -> recheck generation/fingerprint
  -> final UoW: from AppliedPendingFinalize construct run Finalized + cursor/mapping/provenance revisions + stored result; commit together
```

| 分支 | 行为 |
|---|---|
| NoOp formally proven | complete local operation/no file change；may record safe provenance；cursor only if owner contract proves same/advance semantics。 |
| Gap/Unsupported/Unknown | block before apply；cursor unchanged；typed next action/manual。 |
| Dirty/path/mapping conflict | create ConflictRecord/checkpoint；Operation NeedsAction；no overwrite。 |
| Partial/local outcome unknown | persist run Partial/OutcomeUnknown + checkpoint；no cursor/mapping finalize；no blind retry。 |
| Known complete | AppliedPendingFinalize then same-generation UoW finalizes all refs atomically at local metadata layer。 |

测试：incremental/full/no-op/gap/out-of-order/rename/delete/mapping collision/drift/partial/unknown/duplicate；禁止 remote Git/auto merge。Blockers `002/007/008/010`。

### 7.5 `RecordConflictResolutionFlow`

1. Validate actor/conflict/decision/scope/revalidation set；reserve UoW。
2. Load conflict/checkpoint/current context and `ManualResolutionRepository.listByConflict(...)` latest prior resolutions；ensure conflict active and decision kind allowed。
3. `recordManualResolution`→`validateManualResolution`; `recordConflictResolution` marks only ResolutionRecorded。
4. Same UoW saves resolution/conflict/provenance/stored result；commit。
5. Return explicit Resume required；no file/source/cursor/handoff mutation。

Known stale/invalid actor/scope→Rejected or conflict error；no unknown external effect。测试：system actor rejected、scope escape、stale conflict、duplicate、KeepLocal/ApplySource no write。Blocker `010`。

### 7.6 `ResumeSyncOperationFlow`

1. Validate refs/fingerprint/resolution；reserve；load versioned operation/checkpoint/binding/manifest/current evaluation/source/local/attempt context。
2. `classifyRecoveryNextAction` with fresh current fingerprint；then call exact `markCheckpointResumable` / `invalidateCheckpoint` / `requireCheckpointProbe` transition；mismatch→checkpoint Invalidated + Replan/Revalidate。
3. Branch: `ResumeLocal` invokes only owning proven-safe local stage; `Revalidate/Replan` first calls `beginOperationValidation` and returns owning feature/new plan path; `ProbeRequired` prepares ProbeRecord or returns next action; `Manual/Stop` retains NeedsAction。No branch moves NeedsAction directly to Running/Completed。
4. Each branch uses its owning repositories and a new checkpoint/run/plan identity where required; never patch old terminal/invalid object。
5. Persist new state/stored result in UoW; external/local facility phase follows same prepare/call/finalize template。

测试：each stage/fingerprint/generation drift/resolution state/external possible effect/duplicate unknown。禁止 “continue PC”、force retry、bypass CP1/2/3/5 gates。Blockers `004/005/010`。

### 7.7 `ProbeUnknownOutcomeFlow`

```text
validate prior operation/checkpoint/attempt -> reserve
  -> load attempt/checkpoint/latest probe; verify ProbeRequired/equivalence context
  -> prepare ProbeRecord + checkpoint relation; then append typed `ProbeInvocationIdentity` and persist ProbeRecord.InFlight in the begin-call UoW; commit
  -> RecoveryProbePort.probeExternalAttempt (outside UoW, same invocationRef)
  -> finalize UoW: ResolvedKnown/StillUnknown/Unsupported/FailedKnown
     + owning `markHandoffExternalPending` or `finalizeKnownExternalState` only when the formal result supplies the required ref
     + attempt/checkpoint/provenance/stored result
  -> layered result; NO submit replay
```

Known result is interpreted by owning handoff/recovery policy; it does not automatically close conflict/checkpoint or mark accepted. Probe call ambiguous remains StillUnknown/ProbeRequired. Test no prior attempt, unsupported, known pending/terminal, probe timeout, duplicate unknown, no submit invocation。Blockers `004/005`。

### 7.8 `CancelSyncOperationFlow`

1. Validate operation/reason；reserve；load operation/active checkpoint/related attempt/provenance。
2. `cancelSyncOperation(...)`; if no possible external effect, complete local checkpoint as cancelled result；if possible/unknown, preserve/require probe and keep external-effect state explicit。
3. UoW saves operation/checkpoint/provenance/stored result；does not call owner/Git/fs。
4. Return local Cancelled + externalEffectState。

测试：each active state、terminal duplicate、unknown handoff、history retained。禁止 remote cancel/rollback claim、file cleanup、attempt/provenance deletion。

### 7.9 `PushReviewCandidateFlow`

```text
PushReviewEntry -> validate explicit selection/scope/target + reserve
  -> SharedEligibilityGate + load binding/generation/cursor/observation/open conflicts/checkpoint
  -> evaluate/record candidate eligibility -> freeze digest/scope
  -> prepare UoW: candidate Frozen + HandoffAttempt.Prepared + checkpoint + provenance; append invocation identity only immediately before begin-call commit
  -> immediately before call re-observe/revalidate candidate/access/generation
     drift -> invalidate candidate; NO CALL
  -> begin-call UoW: append typed HandoffInvocationIdentity + attempt Calling; commit
  -> ReviewHandoffPort.submitCandidate outside UoW using the same invocationRef
  -> finalize UoW:
       known transport/ref -> TransportKnown/ExternalPending
       known reject -> failed-known layer
       timeout/lost -> OutcomeUnknown -> ProbeRequired checkpoint
     + provenance/stored result
```

ACK/HTTP/remote ref only transport layer；Decision remains absent/pending/unknown until owner read/probe。Candidate never constructed from Git commit as Artifact/Baseline; no Git push. Test dirty/conflict/archive/access drift, pre/post-prepare drift, known reject, ACK, timeout, duplicate known/unknown, provenance failure. Blockers `001/004/005/006`。

### 7.10 `RefreshReviewHandoffStatusFlow`

1. Validate exact attempt/external ref；reserve；load versioned attempt/latest probe/persisted decision snapshot/checkpoint。
2. If OutcomeUnknown/ProbeRequired, use same durable ProbeUnknownOutcome subflow; if known external ref, prepare read marker then call `ReviewDecisionReadPort.readHandoffState` outside UoW。
3. Validate safe owner result; capture ExternalOwnerSnapshot；`attachHandoffDecisionSnapshot` preserves current attempt layer；call `markHandoffExternalPending` for a formal nonterminal ref or `finalizeKnownExternalState` only for a formal terminal state ref。
4. UoW saves snapshot/attempt/probe/checkpoint/provenance/stored result；assemble layers。
5. Missing/restricted/stale/unmatched→explicit layer, not Pending/Accepted default；read ambiguity remains unknown。

测试：probe-vs-read routing, invisible/missing/stale/known pending/known terminal, duplicate, no Gate/Decision write. Blockers `001/004/005`。

### 7.11 Command batch stop-review

#### 逐 Command 统一停审记录

| Flow | 输入 / 前置读取 | Guard / Domain function | Repository / UoW | External/tool + prepare/finalize | Success / known failure / unknown | Recovery / forbidden / test focus |
|---|---|---|---|---|---|---|
| `CloneWorkingCopyFlow` | `SyncCommandRequest<CloneWorkingCopyRequest>`；selection/target existing binding、owner eligibility、source、fs/Git observation | selection/access；binding/manifest/cursor/mapping init；plan/path/run safety；`markInitialCursorContinuous` + `prepareFinalizedMappingChanges` + `finalizeMaterializationRun` | absent-create selection/operation/binding/manifest/cursor/mapping/plan/run/checkpoint/provenance；versioned final save | source read before prepare；durable run/checkpoint then bounded Git/fs stage/apply；same UoW finalize run/cursor/mapping/provenance/binding | success上限=local Finalized/Bound；dirty/gap/path known→blocked/conflict；partial/ambiguous apply→Partial/OutcomeUnknown | explicit Resume/Replan/manual；no remote Git/overwrite；crash-window/cursor-no-advance/duplicate spies |
| `MigrateSyncMetadataFlow` | `...<MigrateSyncMetadataRequest>`；binding/current manifest/record summaries/provenance | integrity/migration policy；`migrateMetadataGeneration` + `completeBindingMigration` | lock + new manifest generation, prior protected refs, binding revision, provenance, stored result in UoW | no external owner/tool effect；prepare=lock+versioned reads，commit=new generation visibility | success=new generation Bound/Valid；unsupported/corrupt→blocked；local commit ambiguity→result unknown until reload | explicit rerun only after generation probe；no in-place rewrite/delete；generation conflict/preservation tests |
| `RebindWorkingCopyFlow` | `...<RebindWorkingCopyRequest>`；prior relation/current observation/new owner evaluation | explicit selection + `protectAgainstImplicitRebind` + dirty/provenance guard + `explicitlyRebindWorkingCopy` | new absent identities/generation plus prior conservative transition/provenance/result | owner reads before local UoW；no materialization/tool mutation | success=new relation only；owner/path/schema known blocker；commit ambiguous remains unclaimed | separate clone/pull after rebind；no inference/overwrite/delete；mismatch/dirty/concurrency tests |
| `PullWorkingCopyFlow` | `...<PullWorkingCopyRequest>`；binding/manifest/cursor/mapping/observation/access/source delta | source continuity、path/mapping/materialization policies；plan/run functions；`finalizeAppliedCursor` + `prepareFinalizedMappingChanges` + `finalizeMaterializationRun` | append immutable delta；create/update versioned path set/plan/run/checkpoint；final UoW prepares mapping/cursor/run/provenance revisions | source read；durable run before bounded Git/fs apply；external/local effect outside UoW；atomic local finalize | Finalized/NoOp proof；gap/dirty/conflict known；partial/ambiguous→checkpoint, cursor unchanged | explicit Resume/Replan/manual；no merge/rebase/stash；delta/drift/partial/duplicate tests |
| `RecordConflictResolutionFlow` | `...<RecordConflictResolutionRequest>`；conflict/checkpoint/prior resolutions/current persisted context | `recordManualResolution`、`validateManualResolution`、`recordConflictResolution` | one versioned local UoW writes resolution/conflict/provenance/result | none | success=validated intent/ResolutionRecorded；invalid scope/state→Rejected/error；unknown external=`not_applicable` | explicit Resume required；no file/cursor/handoff effect；actor/scope/duplicate/no-write spies |
| `ResumeSyncOperationFlow` | `...<ResumeSyncOperationRequest>`；operation/checkpoint/binding/manifest/evaluation/source/local/attempt/resolution | `classifyRecoveryNextAction`、checkpoint/fingerprint/generation guards；owning feature functions | first UoW persists classification/new identity/checkpoint；effect branches reuse shared prepare/finalize | only `ResumeLocal` may invoke proven bounded local facility；Probe branch invokes no submit | success按 owning stage；drift→Invalidated/Replan；possible external effect→ProbeRequired/unknown | explicit Revalidate/Replan/Probe/Manual/Stop；no force retry；branch/state/duplicate tests |
| `ProbeUnknownOutcomeFlow` | `...<ProbeUnknownOutcomeRequest>`；prior attempt/checkpoint/latest probe/idempotency | `prepareProbeRecord`、`beginProbe`、resolve/unknown/unsupported functions | durable probe/invocation first commit；versioned finalize + attempt/checkpoint/provenance/result | `RecoveryProbePort` only outside UoW；never submit | known probe layer only；known call failure explicit；ambiguous→StillUnknown | later new explicit probe；no original replay/accepted elevation；prior-ref/timeout/duplicate tests |
| `CancelSyncOperationFlow` | `...<CancelSyncOperationRequest>`；operation/checkpoint/attempt/provenance | `cancelSyncOperation` + possible-effect guard | one versioned local UoW saves Cancelled/checkpoint posture/provenance/result | none | local Cancelled；terminal conflict known；external unknown preserved, not converted | probe may remain next action；no remote cancel/file cleanup/delete；all active/terminal tests |
| `PushReviewCandidateFlow` | `...<PushReviewCandidateRequest>`；access/binding/generation/cursor/observation/open conflicts/checkpoint | candidate evaluate/freeze/unchanged；handoff prepare/begin；`recordHandoffTransport` then only with formal ref `markHandoffExternalPending` | candidate evaluation sidecar + Frozen candidate + Prepared attempt/checkpoint/provenance commit；final versioned UoW | re-observe/revalidate after prepare；`ReviewHandoffPort.submitCandidate` outside UoW | success最多 transport/external-pending layer；known reject explicit；timeout/lost→OutcomeUnknown/ProbeRequired | formal probe/status refresh；no Git push/Artifact/Baseline/ACK elevation；drift/ACK/timeout/duplicate tests |
| `RefreshReviewHandoffStatusFlow` | `...<RefreshReviewHandoffStatusRequest>`；attempt/probe/snapshot/checkpoint/external ref | route by attempt state；probe functions或 owner snapshot/attempt attach/finalize guards | durable read/probe marker before call；final UoW saves snapshot/attempt/provenance/result | `RecoveryProbePort` or `ReviewDecisionReadPort`, never both blindly；outside UoW | known external layer only；missing/restricted known；ambiguous read/probe stays unknown | later explicit refresh/probe；no Gate/Decision write；routing/visibility/terminal tests |

所有表中“final UoW”都要求重新 load `Versioned<T>` 与 generation/fingerprint，create 使用 expected absent；commit failure在 effect 后不得回滚成“未发生”。每条 external/tool request的字段均来自 Step 8 request、前置 repository truth、runtime-validated port output、operation context或 `IdPort/ClockPort/DigestPort`，禁止从 opaque ref反推。

| 审查项 | 结论 |
|---|---|
| 10 commands individually covered | pass |
| DTO/domain/port names exist | pass after Step 7 repository closure backfill |
| local UoW vs facility/external effect | pass；prepare/call/finalize分离。 |
| stored result/idempotency | pass_with_blocker `005`；unknown no replay。 |
| cursor/provenance/Review/Git redlines | pass。 |

## 8. Query flows

所有 Query handler 签名为 `handle(SyncQueryRequest<T>): Promise<SyncProtocolResult<SyncQueryResponse<V> | SyncPageResponse<V>>>`，先做 visibility/redaction，再走 read ports；以下每条 flow 的共同禁止项是 begin UoW、idempotency reserve、write/refresh/repair/probe/persist observation/diagnostic emission。

### 8.1 `GetAccessEvaluationFlow`

1. Validate exactly one lookup form；visibility precheck。
2. `AccessEvaluationRepository.getVersioned` 或 `findCurrent`；load referenced snapshots with `OwnerSnapshotRepository.getVersioned`。
3. Map outcome/freshness/safe reasons/snapshot refs to `AccessEvaluationView`; missing/unavailable explicit。
4. Redact and return；不调用 `OwnerAccessPort`，不 mark stale。

Test: by ref/by context、missing、not visible、snapshot unavailable/stale、assert zero writes/external calls。

### 8.2 `GetSyncOperationFlow`

Validate/visibility→`SyncOperationRepository.getVersioned`→map local kind/state/selection/checkpoint/last transition/result posture→redact/return。Completed label stays local-only. Test terminal/NeedsAction/missing/no write。

### 8.3 `GetWorkingCopyBindingFlow`

Validate exactly bindingRef/targetRef→repo `getVersioned` or `findByTarget`→optional manifest/last persisted observation refs read only for visible summary→build `WorkingCopyBindingView`。No canonicalize target side-effect beyond syntax; no migrate/rebind. Test missing/NeedsMigration/Restricted/Invalidated/no write。

### 8.4 `GetMetadataHealthFlow`

Validate binding/manifest scope→load binding, manifest, bounded `listRecordSummaries` pages already available under requested page/budget→`evaluateMetadataIntegrity` as a pure read classification only→return health view. It must not save a newly computed classification; persistent rescan belongs to job. Test corrupt/unknown/dangling/page unavailable/no repair。

### 8.5 `InspectWorkingCopyFlow`

```text
validate target/binding scope -> visibility
  -> FilesystemInspectionPort.canonicalizeTarget/inspectTarget (read-only)
  -> WorkingCopyObservationPort.inspect (read-only Git/fs/tool)
  -> captureWorkingCopyObservation in memory
  -> map/redact view -> return
  -> NO repository append, lock, repair, fetch, diagnostic emit
```

Test dirty/untracked/conflicted/path unsafe/symlink/tool unsupported/raw output redaction and spy-zero-writes。

### 8.6 `GetMaterializationStatusFlow`

Validate operation/run scope→load operation, active plan or requested run, latest run, cursor and checkpoint via repositories→map delta kind/plan/run/cursor/provenance safe refs→partial/unavailable slices explicit。No source resolve/delta read/apply/resume. Test AppliedPendingFinalize vs Finalized, Partial/OutcomeUnknown, missing run, no write。

### 8.7 `GetConflictFlow`

Validate/visibility→`ConflictRepository.getVersioned`→optional checkpoint/resolution reads→map kind/state/affected refs/body-free basis→return. No allowed-decision computation that changes state; next actions are pure policy output only. Test Open/ResolutionRecorded/Closed/missing/redaction。

### 8.8 `ListConflictsFlow`

Validate at least operation or binding scope/page/filter→`ConflictRepository.listOpenByOperation` or `listByBinding`→visibility per item→map `ConflictView` page preserving Unknown/Open→public cursor map→return。No hidden omission except explicit not-visible marker/count policy. Test pagination/filter/not-visible/open unknown/no write。

### 8.9 `GetRecoveryStatusFlow`

Validate operation/checkpoint→load operation + requested/active checkpoint + related probe/attempt/latest run→pure `classifyRecoveryNextAction` may compute current persisted-only suggestion, but does not re-observe/owner-read→map view。No resume/probe. Test ProbeRequired/Invalidated/Resumable suggestion, stale slices, no ports with effects。

### 8.10 `GetSyncStatusFlow`

```text
StatusEntry -> validate target/binding/options + visibility
  -> SyncStatusReadPort.loadStatusSlices
  -> if includeReadOnlyObservation:
       FilesystemInspectionPort + WorkingCopyObservationPort (read-only only)
       ephemeral WorkingCopyObservationView; DO NOT append/attach
  -> HandoffResultPolicy.assemble + assembleSyncStatusView
  -> explicit missing/stale/unknown/unsupported/blocked + redaction
  -> return; CompleteRead != synchronized/accepted/ready
```

Test every missing slice, partial adapter outage, dirty instantaneous observation, ACK/Decision distinction, archived posture, no writes/probe/diagnostics。

### 8.11 `GetReviewHandoffStatusFlow`

Validate candidate/attempt at least one→`SyncStatusReadPort.loadHandoffSlices` / candidate/attempt/probe/snapshot repos→`assembleHandoffStatus`→return four layers。No `ReviewDecisionReadPort`/probe call; missing snapshot remains missing/unknown. Test ACK only, ProbeRequired, restricted Decision, TerminalKnown owner ref, no write。

### 8.12 `GetProvenanceFlow`

Validate subject/traversal/page→repo `listBySubject` or `listParents`→verify/display integrity state without repair→map body-free records/page→redact/return。Never suppress IntegrityUnknown, synthesize missing parent, delete/supersede. Test graph pagination/self-cycle-corrupt/missing parent/no write。

### 8.13 `GetSyncDiagnosticSummaryFlow`

Validate exactly/at least operation or correlation scope→`SyncDiagnosticReadPort.loadDiagnosticSummarySlices` + `AdapterAvailabilityPort.getCapabilitySnapshot`→assemble persisted safe failures/provenance refs/degraded reasons into bounded summary. No diagnostics emission, report/artifact/evidence generation, owner refresh or readiness claim. Test raw error absent, outage represented, empty/missing explicit。

### 8.14 Query batch stop-review

#### 逐 Query 统一停审记录

| Flow | 输入 / 前置读取 / guard | Domain/view function + port | State / UoW / external effect | Success / failure / recovery | Forbidden side effects / test focus |
|---|---|---|---|---|---|
| `GetAccessEvaluationFlow` | exact by-ref xor by-context；visibility；evaluation + referenced snapshots | `accessIsEligibleFor`/view mapper；evaluation/snapshot repositories | lifecycle mutation=`none`；no UoW/owner call | present/missing/not-visible/partial；retry is caller re-query only | no refresh/stale-write；selector/snapshot outage/zero-write tests |
| `GetSyncOperationFlow` | operation ref + visibility；versioned operation | local-only state/result mapper；operation repo | none | Completed remains local-only；missing/not-visible explicit | no transition/checkpoint creation；terminal/NeedsAction tests |
| `GetWorkingCopyBindingFlow` | by-ref xor by-target；binding + optional manifest/persisted observation | binding view mapper；binding/manifest/observation repos | none | missing/NeedsMigration/Restricted/partial explicit | no canonical repair/migrate/rebind；selector/zero-write tests |
| `GetMetadataHealthFlow` | binding/manifest/page；record summaries/provenance refs | pure `evaluateMetadataIntegrity`；metadata repos | none | computed classification returned only；unavailable/dangling degraded | no save/repair/delete；corrupt/unknown/page tests |
| `InspectWorkingCopyFlow` | target/expected binding；visibility/path syntax | in-memory `captureWorkingCopyObservation`；read-only fs/Git ports | no persist/UoW/lock; read-only tool calls | safe observation or blocked/unavailable；caller may re-query | no fetch/repair/emit；dirty/path/tool/raw-redaction spies |
| `GetMaterializationStatusFlow` | operation/run scope；operation/plan/run/cursor/checkpoint | materialization status mapper；repos only | none | missing/partial/OutcomeUnknown explicit | no source/apply/resume；pending-finalize vs finalized tests |
| `GetConflictFlow` | conflict ref；conflict + optional checkpoint/resolution | conflict view + pure next-action policy；CP4 repos | none | missing/not-visible/partial | no decision/state write；all conflict states tests |
| `ListConflictsFlow` | operation/binding scope + filter/page；visibility per item | conflict page mapper；`listOpenByOperation/listByBinding` | none | empty visible page not scope missing；degraded/hidden explicit | no full scan/ref parsing；pagination/filter/zero-write tests |
| `GetRecoveryStatusFlow` | operation/checkpoint；checkpoint/probe/attempt/run | pure `classifyRecoveryNextAction` on persisted-only context；repos | none | suggestion only；missing/stale degraded | no re-observe/resume/probe；each decision state tests |
| `GetSyncStatusFlow` | binding/target/options；status slices and optional ephemeral observation | `assembleHandoffStatus/assembleSyncStatusView`；status + read-only fs/Git | none；read-only tool only | read completeness, not global success；partial/unavailable explicit | no append/refresh/probe/emit；all slices/ACK distinction tests |
| `GetReviewHandoffStatusFlow` | candidate/attempt at least one；persisted slices | `assembleHandoffStatus`；status/candidate/attempt/probe/snapshot reads | none | four layers；missing owner snapshot remains unknown | no Decision read/probe/write；ACK/probe/terminal tests |
| `GetProvenanceFlow` | subject/traversal/page；provenance graph pages | integrity display mapper；provenance repo | none | IntegrityUnknown/missing parent degraded | no synthesize/repair/delete/supersede；cycle/pagination tests |
| `GetSyncDiagnosticSummaryFlow` | operation/correlation at least one；safe diagnostic slices/capability | bounded summary mapper；`SyncDiagnosticReadPort` + availability read | none | empty only for existing scope；unavailable partial | no log read/emit/report/evidence/readiness；raw absence/outage tests |

Query 的 unknown仅表示读取 slice的 unknown/unavailable，不是 external-effect `outcome_unknown`；因此 recovery只允许调用者稍后重查或执行独立显式 Command，query handler本身绝不 repair/probe。

| 审查项 | 结论 |
|---|---|
| 13 query flows individually covered | pass |
| view/page fields constructible | pass from Step 7 read surfaces + Step 8 schema |
| no-write capability | pass；no UoW/idempotency/write/probe/refresh。 |
| missing/not-visible/degraded | pass；not empty/clean default。 |

## 9. Conditional inbound consumer flows

### 9.1 `ConsumeAccessOrPostureInvalidatedFlow`

1. If composition capability blocked, reject before subscription/processing with `blocked` receipt；no fake fallback。
2. Validate envelope source owner/event/schema/version/digest/idempotency before trusting payload；reserve UoW。
3. Duplicate→replay stored receipt；invalid/unsupported→no payload persistence/state write。
4. `InboundInvalidationTargetReadPort.resolveAccessOrPostureTargets(payload)` returns ordering disposition and typed refs；ambiguous→quarantine，stale event→no-op；load returned versioned snapshots/evaluations/plans/candidates and apply `invalidateOwnerSnapshot`/`markAccessEvaluationStale`/plan/candidate invalidation only when authorized。
5. Save versioned transitions + provenance relation + `StoredConsumerReceipt`; complete idempotency and append receipt in the same UoW；commit。
6. Do not cancel running external effect, pull/apply, write owner or delete local history。

Test blocked/no subscription, duplicate, unsupported version, unmatched/ambiguous ref, stale ordering, affected propagation, zero Git/fs/handoff calls。Blockers `001/003`。

### 9.2 `ConsumeMaterialSourceInvalidatedFlow`

Validate/receipt lookup/reserve as above→`InboundInvalidationTargetReadPort.resolveMaterialSourceTargets(payload)`→ambiguous quarantine/stale-event no-op→load returned cursor states/unconsumed plans/frozen candidates→call `markCursorUnknown`、`invalidateMaterializationPlan`、`invalidateReviewCandidate`→UoW save provenance + `StoredConsumerReceipt` + idempotency result。Already Finalized local content/history remains; applied cursor not rewritten or advanced. No auto pull/rollback/delete/overwrite。Tests source mismatch/order/gap/duplicate/unknown and zero apply calls。Blockers `001/002/005/006/008`。

### 9.3 `ConsumeReviewDecisionChangedFlow`

Validate official Governance source/schema/digest→read stored receipt/reserve→`HandoffAttemptRepository.findByExternalHandoffRef` maps exact ref；missing/ambiguous quarantined or blocked, never create attempt→capture body-free Decision snapshot→attach to attempt only per formal owner mapping→save snapshot/attempt/provenance + `StoredConsumerReceipt` + idempotency result in one UoW。No local file/candidate content/Gate/Decision mutation, no new handoff. Tests accepted/rejected/pending owner states only as owner-provided, restricted/unmatched/duplicate, no elevation。Blockers `001/004/005/006`。

### 9.4 Consumer batch stop-review

Consumers remain `planned/blocked`; flows define fail-closed behavior, not existing integration. All three have envelope/dedup/source/version checks, local-only conservative writes and explicit no automatic action.

| Flow | 输入 / 前置读取 / guard | Domain + repository/UoW | External effect / state changes | Receipt / failure / recovery | Forbidden / test focus |
|---|---|---|---|---|---|
| `ConsumeAccessOrPostureInvalidatedFlow` | typed envelope；receipt lookup；source/schema/digest/order；resolver target set | invalidate snapshot/evaluation/plan/candidate；versioned saves + provenance + stored receipt + idempotency complete | no external/tool call；状态只收紧 | processed/no-op/duplicate/quarantined/blocked/failed-known；无 unknown effect，之后只能重投同 event获得 replay | no cancel/pull/handoff；blocked/no subscription/order/duplicate/zero-effect spies |
| `ConsumeMaterialSourceInvalidatedFlow` | typed envelope；receipt lookup；source/schema/digest/order；material target set | cursor→Unknown、plan/candidate→Invalidated；UoW append receipt/provenance/result | no source/Git/fs call；Finalized history/cursor value不重写 | exact receipt replay；ambiguous quarantine；known local concurrency failure | no auto pull/rollback/delete/overwrite；gap/stale-event/duplicate tests |
| `ConsumeReviewDecisionChangedFlow` | typed envelope；receipt lookup；official source/schema；exact external-ref lookup | snapshot capture + attempt attach + provenance + stored receipt in UoW | no Governance write/probe/submit；attempt only follows owner-provided layer | unmatched quarantine；duplicate replay；owner state不本地重解释 | no Gate/Decision create/elevation/new handoff；visibility/unmatched tests |

Consumer 的 invalid envelope branch在 payload trust之前结束；是否保存 body-free rejection receipt由 Step 11闭合，但任何 branch都不保存 raw payload。由于所有允许写入都为 local UoW，commit ambiguity只能返回 failed-safe/unknown-local-commit marker并在同 key重入时先读 receipt/idempotency；绝不重放外部 effect（本组本来也没有 external effect）。

## 10. Operations job flows

### 10.1 `ScanMetadataIntegrityFlow`

1. Validate system actor/scope/page/run metadata；reserve job idempotency。
2. Read `SyncJobResultRepository` first；exact duplicate replays stored result；otherwise reserve idempotency and resolve bounded targets；for each, load binding/manifest/record summaries/provenance graph in read phase。
3. `evaluateMetadataIntegrity`；if result is strictly more conservative and persistent classification needs update, begin per-item UoW, reload version/current generation, apply `markManifestIntegrity`; when manifest becomes NeedsMigration/Corrupt/Unknown/ReadOnlyProtected also call `requireBindingMigration` or `restrictBinding` according typed decision, then save provenance/item result; otherwise no-op。
4. Never auto recover Corrupt/Unknown→Valid without formal full proof; never repair/migrate/rebind/delete。
5. Append complete `StoredSyncJobResult` with per-item results/final report and complete idempotency；partial/unavailable counts explicit；duplicate replays stored result。

Test corrupt/dangling/unknown/read-only/adapter outage/concurrency conflict/page/duplicate/no repair。Blocker `006`。

### 10.2 `ProbePendingHandoffAttemptsFlow`

1. Validate explicit scope xor persisted-all flag/page；read `SyncJobResultRepository` first，duplicate replays；otherwise reserve job。
2. List bounded `HandoffAttemptRepository.listProbeRequired`; each item reloads attempt/checkpoint/latest probe and verifies still ProbeRequired。
3. Invoke the same prepare→external probe→finalize logic as `ProbeUnknownOutcomeFlow` with per-attempt idempotency; never call submit。
4. Persist each known/unknown/unsupported/failed result independently; job report partial/blocked counts; batch completed does not mean resolved。
5. Append complete `StoredSyncJobResult` and complete idempotency; duplicate reads `SyncJobResultRepository` and replays the same typed report/item list without scanning or probing。

Test scope validation, state drift skip, probe still unknown, adapter unsupported, partial batch, zero submit calls。Blockers `004/005`。

### 10.3 `MarkStaleOwnerSnapshotsFlow`

1. Validate system actor/filter/scope/evaluatedAt/page；read `SyncJobResultRepository` first，duplicate replays；otherwise reserve job。
2. List candidate snapshots; evaluate formal freshness rule using persisted observedAt/version only。
3. Per target UoW reloads version, calls `invalidateOwnerSnapshot` only for authorized Fresh→Stale/Invalidated/Unavailable and calls `markAccessEvaluationStale` / `invalidateMaterializationPlan` / `invalidateReviewCandidate` for resolver-returned affected refs；never non-fresh→Fresh。
4. Does not call OwnerAccessPort/read posture/refresh; appends complete `StoredSyncJobResult` with item results/report and completes idempotency。

Test boundary time/formal rule, stale version conflict, already stale no-op, propagation, zero owner calls, duplicate。Blockers `001/003` for exact freshness contract。

### 10.4 Job batch stop-review

| Flow | 输入 / 前置读取 / guard | Domain + per-item UoW | External effect / states | Report / failure / recovery | Forbidden / test focus |
|---|---|---|---|---|---|
| `ScanMetadataIntegrityFlow` | typed job/system authority/scope/page；stored job lookup；binding/manifest/summaries/provenance | pure integrity decision；only conservative manifest transition + provenance per item | no external/tool call；Valid不得凭局部信息恢复 | complete typed report stored/replayed；partial/unavailable/concurrency item显式；rerun须新 authorized run/key | no repair/migrate/rebind/delete；corrupt/page/duplicate/zero-repair tests |
| `ProbePendingHandoffAttemptsFlow` | typed scope xor persisted-all；stored job lookup；list/reload attempt/checkpoint/probe | per item exact `ProbeUnknownOutcomeFlow` prepare/finalize + item result | `RecoveryProbePort` only；probe/attempt/checkpoint states | stored report preserves known/unknown/unsupported/failed；duplicate no probe；later explicit run may probe still-unknown with new record | no submit/global resolution claim；drift/partial/zero-submit tests |
| `MarkStaleOwnerSnapshotsFlow` | typed filters/scope/evaluatedAt/page；stored job lookup；stale candidate list/reload | formal freshness rule；snapshot/evaluation/plan/candidate only more conservative | no owner/tool call；Fresh→non-fresh only | stored report/item list replay；concurrency/unavailable partial；new run may re-evaluate later | no refresh/non-fresh→Fresh；time-boundary/propagation/zero-owner tests |

| 审查项 | 结论 |
|---|---|
| three jobs independent | pass |
| per-item state/result visible | pass；partial not hidden。 |
| duplicate replay | pass；no rerun。 |
| prohibited automation | pass；no repair/migrate/pull/merge/push/submit/cleanup。 |

## 11. Per-flow stop-review matrix

| Flow group | DTO | Objects/functions | Ports | UoW/effect boundary | known/unknown | Tests | Result |
|---|---|---|---|---|---|---|---|
| Clone/Pull | pass | pass | pass_with upstream blockers | prepare/facility/finalize | partial/unknown explicit | listed | pass_with_blockers |
| Migrate/Rebind | pass | pass | pass | local UoW/lock only | commit ambiguity explicit | listed | pass_with_blockers |
| Resolve/Resume/Cancel | pass | pass | pass | local or owning phase | external unknown preserved | listed | pass_with_blockers |
| Probe/Push/Refresh | pass | pass | pass_with `004/005` | durable prepare/external/finalize | no blind replay | listed | pass_with_blockers |
| 13 Queries | pass | view builders/policies | read-only only | no UoW/effect | degraded explicit | listed | pass |
| 3 Consumers | pass | conservative transitions | event contracts blocked | local UoW only | invalid/unmatched explicit | listed | pass_with_blockers |
| 3 Jobs | pass | bounded transitions | read/probe ports | per item UoW | partial explicit | listed | pass_with_blockers |

## 12. Cross-flow audit

| 审计项 | 结论 | 说明 |
|---|---|---|
| Protocol coverage | pass | 10+13+3+3=29 flows；Outbound not applicable。 |
| Object/port invention | pass | Step 7 已先回补 receipt/job replay、binding conflict index、invalidation target resolver、external handoff lookup与diagnostic read；flow未私造 truth/port method。 |
| UoW boundary | pass | local metadata only；无 SDK/Git/fs distributed transaction claim。 |
| create/update version | pass | create expected absent；update versioned read token。 |
| idempotency | pass_with `005` | known replay；unknown probe-required/no replay。 |
| cursor/mapping | pass | AppliedPendingFinalize run 构造 same-generation run/cursor/mapping/provenance revisions；同一 UoW commit 后才以 Finalized/advanced 共同可见。 |
| query | pass | zero write/refresh/repair/probe/diagnostic。 |
| consumers/jobs | pass | local conservative/bounded；no automation escalation。 |
| handoff | pass | prepare before call；ACK/Decision layers；no Review Gate bypass。 |
| Git/local safety | pass | no remote/push/merge/rebase/stash/dirty overwrite。 |
| provenance/body/evidence | pass | append/protect; no raw body/secret; no fake evidence/readiness。 |
| phase boundary | pass | error/state/transaction physical detail继续 Step 10～13/11，未提前声称实现。 |

## 13. Step 10 handoff

Step 10 必须为 17 个 lifecycle objects 逐一核对本文件触发函数/flow：Operation、AccessEvaluation、ExternalOwnerSnapshot、Binding、Manifest、Cursor、Mapping、Plan、PathChangeSet、Run、Conflict、Checkpoint、ManualResolution、Probe、Candidate、Attempt、Provenance。Immutable `SyncSelection/WorkingCopyObservation/SourceDelta`、七 policies与derived views不伪造 lifecycle；read/consumer/job dispositions仅在有独立推进语义时作为 technical state audit，不创建 GlobalSyncState。

## 14. 回填草稿

未来正式 §8 按 shared templates、10 Commands、13 Queries、3 Consumers、3 Jobs 摘录入口/关键调用/UoW/effect/unknown/recovery/禁止事项，并引用本文件的 per-flow matrix/cross-flow audit。完整测试 case、retry/lock/physical transaction 不在本 Step。

## 15. 待确认事项

- `SYNC-UP-001~010` 继续决定 positive owner/source/handoff/probe/metadata/Git/fs paths；blocker 下只实现 fail-closed/negative seam。
- Step 11～13 必须精化 local metadata/filesystem crash windows、lock ordering、idempotency equivalence、unknown probe/retry eligibility；本步没有声称这些已实现。
- Consumer source/topic/schema 未闭合，flows仍 planned/blocked；jobs无 scheduler/run事实。

## 16. 进入下一步条件

- [x] 每个存在协议有独立函数级 flow与测试切口；未用通用模板替代具体差异。
- [x] 每条 flow回指 Step 8 DTO、Step 6对象函数、Step 7 ports；发现的接缝缺口已先回补前序。
- [x] UoW、external/local facility effect、known/unknown、stored result与recovery boundary明确。
- [x] query no-write、cursor safety、dirty/path保护、no auto Git、ACK≠Decision、provenance/evidence边界闭合。
- [x] cross-flow audit无 unresolved命名/接缝/phase conflict；upstream blocker仍显式。
- [x] 未修改正式03、未创建实现/测试/evidence/implementation ledger/commit。

结论：Step 9 通过 `pass_with_upstream_blockers`；允许按用户授权进入 Step 10。此结论是静态设计闭环，不是运行/测试/readiness 证据。
