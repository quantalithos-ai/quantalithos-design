# Step 7. API / 接口骨架

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 6 的 29 个对象与反查已通过。
- `gate_status=pass_with_upstream_blockers`；CP1→CP5 接口、分类与跨接口审计已完成，`SYNC-UP-001~010` 保持开放。
- 本步名称均为概要层 planned contracts；不表示 HTTP/RPC/topic/CLI binary、DTO schema 或代码已存在。

### Step 内计划

1. 回读 Step 5 capability、Step 6 对象与正式 01 的 query/mutation/communication 边界。
2. 固定 Command/Query/Inbound Consumer/Outbound Event/Operations Job 分类和共享调用语境。
3. 逐五部分定义用例接口、输入/输出、读写结果及 ports，并各自停审。
4. 形成全局 CLI 映射、条件性 consumer、job 与 port/adapter 摘要。
5. 审计接口类别、对象承接、no-write、P0 流程覆盖和 blocker，形成正式 §7 回填草稿。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 6 §7~13 | 29 个对象、对象能力、状态与 Step 8/9 反查 |
| Step 5 §7~9 | 五部分 capability、接缝与 interface 后续位置 |
| Step 3 `HC-SYNC-01~22` | explicit context、query no-write、ports、unknown/provenance 等硬约束 |
| 正式 00 §12、正式 01 §8~10 | 能力级接口、SDK/Git/fs seams 和同步/条件事件判断 |
| 概要 SOP/规范 Step/§7 | 五类接口、typed context、逐部分停审与禁画流程图 |

## 3. SOP 问题回答

1. **Command 是哪些？** `clone`、`pull`、`push-review` 及显式 metadata migration/rebind、冲突决定、resume/probe/cancel、external handoff status refresh；它们写 local truth，handoff command 还可能触发正式外部副作用。
2. **Query 是哪些？** `status` 及 operation/binding/metadata/materialization/conflict/recovery/handoff/provenance/diagnostic reads；都只读既有 local truth、允许的即时 Git/fs observation 或已持久化 owner snapshot，不 refresh/repair/probe。
3. **Inbound Consumer？** 当前主线不直接依赖 bus；仅为正式 owner/SDK event 合同闭合后的 access/posture、source 和 review decision invalidation 定义条件性 consumer，全部保持 blocked/planned。
4. **Outbound Event？** 当前没有已授权的 outbound event family/outbox；CLI/local state 不需要借事件传播，不能为了对称虚构事件。
5. **Operations Job？** metadata integrity scan、pending handoff probe、stale snapshot scan，只基于已持久化事实并保持 no-repair/no-replay/no-owner-truth。
6. **Command 上下文？** 全部需要 `ActorContext`、`CommandMetadata`；幂等关联对所有 mutation 都需要，外部副作用尤其必须 durable-before-call。系统 job 使用 `SystemActorContext` 与 `JobMetadata`。
7. **Query 上下文？** 全部需要 `ActorContext` 用于本地访问/输出裁剪，但这不赋予 owner authorization，也不允许 refresh。
8. **Event 上下文？** 条件性 consumer 必须有 typed event、`EventEnvelope`、`EventId`、`IdempotencyKey` 和正式 source ref；精确 payload/topic pending。

## 4. 当前文档问题诊断

旧 02 的 RPC 与事件围绕任务派发/fanout/replay，且把 transport 成功混入同步成功。draft 只给 port 类别，没有正式用例输入/输出、Command/Query 区分或 event/job 适用性。若直接继承，会让 status 获得隐式写能力，并让 handoff/Git adapters 绕过 application/domain 门禁。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 旧 RPC/task/event 是跨端同步接口 | 四个 CLI 核心用例 + 显式本地维护接口 |
| query/refresh/repair 混杂 | Query 绝对 no-write；refresh/probe/migrate 都是独立 Command/Job |
| provider DTO/HTTP ACK 直接成为结果 | local typed result + external safe ref 分层 |
| 事件/worker 被默认存在 | inbound event 条件性 blocked；outbound event 当前不适用；jobs 有最小安全集合 |

## 6. 设计取舍

- CLI verbs 固定为用户要求的 `clone`、`pull`、`status`、`push-review` 语义；binary/prefix、flags、exit codes、serialization 留 03。
- `clone` 是复合 Command：CP1 eligibility、CP2 binding init、CP3 initial materialization 在单一 application use case 中串联，但不形成跨 owner 事务。
- `RecordConflictResolution` 只记录 intent；实际续行必须另调 `ResumeSyncOperation`，避免“决定即覆盖”。
- 外部 decision refresh 是显式 Command `RefreshReviewHandoffStatus`，因为它会写 owner snapshot；`GetReviewHandoffStatus` 与 `status` 只读已持久化结果。
- 当前不声明 outbound events，避免无实现需要的 outbox/truth；若后续需要，必须回退 01/02 重审通信与可靠性。

## 7. 接口分类与共享语境

### 7.1 分类说明

```text
Command API
  显式改写 L5-sync local truth；部分命令经正式 port 触发受控外部副作用。

Query API
  读取 local truth、只读 view 或即时无副作用 local observation；不得 refresh、repair、probe 或推进状态。

Inbound Event Consumer
  条件性消费正式 owner invalidation/decision 事实，只标记本地 snapshot/plan/candidate stale 或更新安全引用。

Outbound Event
  当前主线不适用；不为本地 CLI 状态虚构事件或 outbox。

Operations Job
  基于已持久化 local facts 做完整性扫描、正式 probe 或 freshness 失效扫描；不自动 materialize/handoff/replay。
```

### 7.2 共享输入语境

| 接口类 | 必需上下文 | 幂等 / metadata 判断 | 边界 |
|---|---|---|---|
| Command | `ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | 必需；key 只关联等价输入，不能自动证明外部等价 | actor 不替代 owner authorization |
| Query | `ActorContext actor`、typed query | 不写幂等 key；可带 `QueryMetadata metadata` 用于 correlation/redaction | 不能触发持久化或外部 refresh |
| Consumer | typed event、`EventEnvelope envelope`、`EventId event_id`、`IdempotencyKey idempotency_key` | 必需去重与 source attribution | 只有正式合同闭合后启用 |
| Job | typed input、`SystemActorContext actor`、`JobMetadata metadata`、`IdempotencyKey idempotency_key` | 必需；每个 target 单独关联 | 不替代用户 command，不绕原门禁 |

### 7.3 CLI 语义映射

| CLI verb | 用例接口 | 主责部分 | 写入/读取 | 成功上限 |
|---|---|---|---|---|
| `clone` | `CloneWorkingCopy` | CP2（协作 CP1/CP3/CP4/CP5 provenance） | local binding/metadata/materialization mutation | working copy local finalize；不是 Artifact/Baseline |
| `pull` | `PullWorkingCopy` | CP3（协作 CP1/CP2/CP4/CP5 provenance） | local materialization mutation | local cursor/mapping finalize；不自动 merge/rebase |
| `status` | `GetSyncStatus` | CP5 read surface（聚合 CP1~CP5） | no-write query | `SyncStatusView`；不 refresh/repair/probe |
| `push-review` | `PushReviewCandidate` | CP5（协作 CP1/CP2/CP4） | local candidate/attempt + formal external call | handoff attempt/transport/ref；不等于 accepted |

## 8. 按主要组成部分组织的接口骨架

### CP1. Selection & Access

#### CP1.1 用例 / Query 接口

CP1 没有独立“授权 Command”。所有 mutation Command 必须先调用本部分门禁；避免让调用方先取得一个可离线复用的“授权 token”。本部分仅提供已持久化评估的只读查询。

| 类别 | API | 输入骨架 | 输出骨架 | 主要处理 / 来源 | 写入结果 / 边界 |
|---|---|---|---|---|---|
| Query | `GetAccessEvaluation` | `GetAccessEvaluationQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `AccessEvaluationView view` | 读取 `AccessEvaluation`、相关 snapshot refs | no-write；不调用 owner、不 refresh |
| Query | `GetSyncOperation` | `GetSyncOperationQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `SyncOperationView view` | 读取 `SyncOperation`/checkpoint refs | no-write；Completed 只表示 local result |

#### CP1.2 Port 骨架

| Port | Operation | 输入骨架 | 输出骨架 | 边界 / blocker |
|---|---|---|---|---|
| `OwnerAccessPort` | `check_eligibility` | `OwnerAccessRequest request`、`CallContext context` | `OwnerEligibilityResultSet result_set` | 只通过正式 SDK；`SYNC-UP-001/003` |
| `OwnerAccessPort` | `read_posture` | `OwnerPostureRequest request`、`CallContext context` | `OwnerPostureResult result` | 不本地推导 archived/dissolved/retired |
| `OwnerReferenceStore` | `load_snapshot` | `ExternalOwnerSnapshotId snapshot_id` | `Optional<ExternalOwnerSnapshot> snapshot` | 本地 read，不授权 |
| `OwnerReferenceStore` | `save_snapshot` | `ExternalOwnerSnapshot snapshot`、`LocalWriteContext write_context` | `OwnerSnapshotWriteResult result` | 仅 mutation/consumer/job 路径；query 禁止 |

#### CP1.3 接口停审

| 审查项 | 结论 |
|---|---|
| 对象承接 | `AccessEvaluation`、`SyncOperation`、`ExternalOwnerSnapshot` 均有 read/port 落点 |
| 分类 | pass；owner access 是内部 outbound port，不伪装公开授权 API |
| no-write | pass；两个 Query 只读 persisted facts |
| 越界 | pass；无 auth/authorization implementation 或 reusable permission token |
| blocker | pass_with_upstream_blockers；SDK/action matrix 未锁方法/DTO |

### CP2. Working Copy & Metadata

#### CP2.1 Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `CloneWorkingCopy` | `CloneWorkingCopyCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `CloneWorkingCopyResult result` | CP1 revalidate；inspect target；初始化 binding/manifest；CP3 initial plan/apply；CP4 on conflict；CP5 provenance | `SyncOperation`、`WorkingCopyBinding`、`MetadataManifest`、cursor/mapping/run/provenance；受阻则 typed blocker |
| `MigrateSyncMetadata` | `MigrateSyncMetadataCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `MetadataMigrationResult result` | 校验旧 manifest/binding/provenance，显式建立新 generation | new manifest/generation/transition provenance；`SYNC-UP-006` 未闭合时 blocked |
| `RebindWorkingCopy` | `RebindWorkingCopyCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `WorkingCopyRebindResult result` | 对 old/new selection、target、dirty/path、provenance 做显式门禁 | 新 binding generation + transition provenance；不覆写旧来源链 |

#### CP2.2 Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetWorkingCopyBinding` | `GetWorkingCopyBindingQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `WorkingCopyBindingView view` | binding/manifest/provenance refs | no-write；不 rebind/migrate |
| `GetMetadataHealth` | `GetMetadataHealthQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `MetadataHealthView view` | manifest/integrity/cursor/mapping summaries | no-write；不 repair/scan beyond bounded read |
| `InspectWorkingCopy` | `InspectWorkingCopyQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `WorkingCopyObservationView view` | read-only Git/fs/path/tool ports | 不持久化 observation、不加写锁、不修改 tree |

#### CP2.3 Port / persistence 骨架

| Port | Operation | 输入骨架 | 输出骨架 | 边界 / blocker |
|---|---|---|---|---|
| `MetadataStore` | `load_manifest` | `CanonicalLocalTargetRef target_ref` | `MetadataLoadResult result` | 物理 schema/layout 受 `SYNC-UP-006` |
| `MetadataStore` | `write_transition` | `MetadataTransition transition`、`LocalWriteContext write_context` | `MetadataWriteResult result` | 保护 generation/provenance；非 query |
| `LocalStateUnitOfWork` | `commit_local_transition` | `LocalTransitionSet transition_set`、`ExpectedGeneration expected_generation` | `LocalCommitResult result` | local atomic visibility；不跨 owner transaction |
| `GitObservationPort` | `observe_worktree` | `GitObservationRequest request` | `GitObservationResult result` | no raw output；不 fetch/push/merge/rebase/stash |
| `FilesystemPort` | `inspect_target` | `FilesystemInspectionRequest request` | `FilesystemObservationResult result` | canonical path/symlink/permission/lock read |

#### CP2.4 接口停审

| 审查项 | 结论 |
|---|---|
| 对象承接 | binding/manifest/cursor/mapping/observation 均由 commands/queries/ports 承接 |
| 分类 | pass；clone/migrate/rebind 是显式 Command，inspect/health 是 Query |
| no-write | pass；query 不 init/migrate/repair/persist observation |
| 越界 | pass；metadata store 不定义业务 transition，Git/fs 仅白名单 |
| blocker | pass_with_upstream_blockers；metadata/Git/path 受 `006/007/010` |

### CP3. Source Materialization

#### CP3.1 Command / Query API

| 类别 | API | 输入骨架 | 输出骨架 | 主要处理 / 来源 | 写入结果 / 边界 |
|---|---|---|---|---|---|
| Command | `PullWorkingCopy` | `PullWorkingCopyCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `PullWorkingCopyResult result` | CP1 revalidate；load CP2 state；resolve/compare source；plan/path validate/apply/finalize；CP4 on conflict；CP5 provenance | plan/run/cursor/mapping/checkpoint/provenance；gap/dirty/unknown 不继续 |
| Query | `GetMaterializationStatus` | `GetMaterializationStatusQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `MaterializationStatusView view` | plan/run/cursor/provenance summaries | no-write；不 resolve source、compare、resume 或 apply |

#### CP3.2 Port 骨架

| Port | Operation | 输入骨架 | 输出骨架 | 边界 / blocker |
|---|---|---|---|---|
| `MaterialSourcePort` | `resolve_source` | `MaterialSourceRequest request`、`CallContext context` | `MaterialSourceResolution result` | owner-neutral；authority 受 `SYNC-UP-001/002` |
| `MaterialSourcePort` | `read_delta` | `SourceDeltaRequest request`、`CallContext context` | `OwnerSourceDeltaResult result` | comparator/cursor/gap 受 `SYNC-UP-008`；不返回 raw owner body to domain |
| `GitWorktreePort` | `apply_git_local_change` | `GitLocalApplyRequest request`、`LocalWriteContext write_context` | `GitLocalApplyResult result` | 仅白名单 local operation；不 remote/push/merge/rebase/stash |
| `FilesystemApplyPort` | `stage_changes` | `FilesystemStageRequest request`、`LocalWriteContext write_context` | `FilesystemStageResult result` | path-root/symlink/non-overwrite guard |
| `FilesystemApplyPort` | `commit_staged_changes` | `FilesystemCommitRequest request`、`LocalWriteContext write_context` | `FilesystemCommitResult result` | 与 local checkpoint/finalize 协作，不宣称跨设施事务 |

#### CP3.3 接口停审

| 审查项 | 结论 |
|---|---|
| 对象承接 | SourceDelta/Plan/PathChangeSet/Run/Cursor/Mapping 均有 port/use-case 落点 |
| 分类 | pass；pull 是 Command，materialization status 是纯 Query |
| no-write | pass；status 不 resolve source 或 apply |
| 越界 | pass；source port 不定义 authority，Git/fs ports 无危险自动能力 |
| blocker | pass_with_upstream_blockers；source/comparator/Git mapping/path 受 `002/007/008/010` |

### CP4. Conflict & Recovery

#### CP4.1 Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `RecordConflictResolution` | `RecordConflictResolutionCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `ConflictResolutionResult result` | 校验 open conflict、actor、scope 和允许意图；只记录 manual resolution | `ManualResolution` + conflict state；不修改 working tree/source |
| `ResumeSyncOperation` | `ResumeSyncOperationCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `ResumeSyncOperationResult result` | 重新加载 checkpoint/current context，CP1 revalidate，决定 resume/replan/probe/manual | new operation stage/checkpoint/result；不 blind replay |
| `ProbeUnknownOutcome` | `ProbeUnknownOutcomeCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `ProbeUnknownOutcomeResult result` | 对明确 prior attempt 持久化 probe，再调用正式 port 并记录 known/unknown | `ProbeRecord`、attempt/checkpoint relation；不自动 retry |
| `CancelSyncOperation` | `CancelSyncOperationCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `CancelSyncOperationResult result` | 显式终止 local continuation，保护 history/provenance | operation Cancelled/checkpoint completed；不撤销未知外部副作用 |

#### CP4.2 Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetConflict` | `GetConflictQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `ConflictView view` | conflict/manual/checkpoint refs | no-write；不决定/resolve |
| `ListConflicts` | `ListConflictsQuery query`、`ActorContext actor`、`PageRequest page`、`QueryMetadata metadata` | `ConflictPage page` | local conflict repository/view | 分页只读；不隐藏 open/unknown |
| `GetRecoveryStatus` | `GetRecoveryStatusQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `RecoveryStatusView view` | checkpoint/probe/operation/materialization/handoff refs | no-write；不 resume/probe |

#### CP4.3 Port / persistence 骨架

| Port | Operation | 输入骨架 | 输出骨架 | 边界 / blocker |
|---|---|---|---|---|
| `RecoveryProbePort` | `probe_external_attempt` | `RecoveryProbeRequest request`、`CallContext context` | `RecoveryProbeResult result` | 仅正式 capability；`SYNC-UP-004/005` |
| `ConflictRepository` | `save_conflict_transition` | `ConflictTransition transition`、`LocalWriteContext write_context` | `ConflictWriteResult result` | protected history，不物理删除 |
| `RecoveryRepository` | `save_checkpoint_transition` | `RecoveryCheckpointTransition transition`、`LocalWriteContext write_context` | `RecoveryWriteResult result` | 与 operation/attempt refs 闭合 |

#### CP4.4 接口停审

| 审查项 | 结论 |
|---|---|
| 对象承接 | Conflict/Checkpoint/ManualResolution/Probe 全有 Command/Query/port 落点 |
| 分类 | pass；resolution 是 intent Command，resume/probe 分开；queries 纯读 |
| no-write | pass；Get/List/RecoveryStatus 不创建 probe 或推进 state |
| 越界 | pass；cancel 不伪造外部撤销，probe 不自动 retry |
| blocker | pass_with_upstream_blockers；`SYNC-UP-004/005/010` 未关闭 |

### CP5. Review Handoff & Provenance

#### CP5.1 Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `PushReviewCandidate` | `PushReviewCandidateCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `PushReviewCandidateResult result` | CP1 revalidate；读取 CP2/CP4；inspect/freeze candidate；prepare durable attempt；call formal handoff；分层 finalize | candidate/attempt/transport/provenance；可能 external handoff side effect；不产生 accepted |
| `RefreshReviewHandoffStatus` | `RefreshReviewHandoffStatusCommand command`、`ActorContext actor`、`CommandMetadata metadata`、`IdempotencyKey idempotency_key` | `ReviewHandoffRefreshResult result` | 对明确 attempt/ref 调用正式 probe/decision read 并保存 safe snapshot | probe/attempt/decision snapshot/provenance；不改变 Governance decision |

#### CP5.2 Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetSyncStatus` | `GetSyncStatusQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `SyncStatusView view` | CP1~CP5 persisted slices + optional no-write local observation | 不 refresh owner、不 repair/probe/advance cursor |
| `GetReviewHandoffStatus` | `GetReviewHandoffStatusQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `LayeredHandoffStatus view` | candidate/attempt/probe/persisted decision snapshot | no-write；ACK/decision 分层 |
| `GetProvenance` | `GetProvenanceQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `ProvenanceView view` | protected provenance relation graph | body-free；不是 formal evidence |
| `GetSyncDiagnosticSummary` | `GetSyncDiagnosticSummaryQuery query`、`ActorContext actor`、`QueryMetadata metadata` | `SyncDiagnosticSummaryView view` | persisted safe failure/correlation/provenance refs | no-write、redacted/bounded；不生成 report/readiness |

#### CP5.3 Port / persistence 骨架

| Port | Operation | 输入骨架 | 输出骨架 | 边界 / blocker |
|---|---|---|---|---|
| `ReviewHandoffPort` | `submit_candidate` | `ReviewHandoffRequest request`、`CallContext context` | `ReviewHandoffTransportResult result` | durable attempt first；`SYNC-UP-001/004/005` |
| `ReviewDecisionReadPort` | `read_handoff_state` | `ReviewHandoffStateRequest request`、`CallContext context` | `ReviewHandoffStateResult result` | only owner state/ref；不推断 decision |
| `ProvenanceRepository` | `append_relation` | `ProvenanceRecord record`、`LocalWriteContext write_context` | `ProvenanceWriteResult result` | append/protect/supersede；不 silent delete |
| `DiagnosticsPort` | `emit_safe_diagnostic` | `SafeDiagnosticRecord record`、`CorrelationContext context` | `DiagnosticEmissionResult result` | body-free；emission 不影响 operation success |

#### CP5.4 接口停审

| 审查项 | 结论 |
|---|---|
| 对象承接 | Candidate/Attempt/Provenance/LayeredStatus/SyncStatus 全有 API/port 落点 |
| 分类 | pass；push/refresh 是 Command，status/handoff/provenance/diagnostic 是 Query |
| no-write | pass；query 只读 persisted snapshot/ref，不调用 probe/decision refresh |
| 越界 | pass；无 Gate create/approve、Git push、ACK elevation 或 evidence generation |
| blocker | pass_with_upstream_blockers；Governance surface/idempotency 受 `SYNC-UP-001/004/005` |

## 9. 条件性 Inbound Event Consumer

当前正式 01 裁剪掉直接 `L0-bus` 主链。下表只定义当 owner 经正式 SDK/event contract 发布可消费事件后，本地应如何保守失效/更新引用；在合同闭合前全部 `blocked/planned`，不能据此订阅私有 topic。

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 / 状态 |
|---|---|---|---|---|
| `ConsumeAccessOrPostureInvalidated` | Identity/Work/Archive 正式事件面 | `AccessOrPostureInvalidatedEvent event`、`EventEnvelope envelope`、`EventId event_id`、`IdempotencyKey idempotency_key` | snapshot/evaluation stale；相关 plan/candidate invalidation intent | 不自动取消/写 owner；`SYNC-UP-001/003`, blocked/planned |
| `ConsumeMaterialSourceInvalidated` | Artifact/Workspace 正式事件面 | `MaterialSourceInvalidatedEvent event`、`EventEnvelope envelope`、`EventId event_id`、`IdempotencyKey idempotency_key` | source snapshot/cursor continuity unknown；plan/candidate stale | 不自动 pull/apply；`SYNC-UP-001/002/008`, blocked/planned |
| `ConsumeReviewDecisionChanged` | Governance 正式事件面 | `ReviewDecisionChangedEvent event`、`EventEnvelope envelope`、`EventId event_id`、`IdempotencyKey idempotency_key` | safe decision snapshot/ref update | 不产生/重解释 Decision；`SYNC-UP-001/004`, blocked/planned |

### Consumer 写入纪律

- consumer 只在 source attribution、event identity、schema compatibility 与 dedup contract 都成立时写 local snapshot/invalidation。
- event payload 不进入 metadata 正文；只保留 safe refs/summaries。
- consumer 不能触发 materialization、Git/fs mutation、handoff retry 或 automatic conflict resolution。
- 未闭合 event contract 时由显式 mutation revalidation/query freshness 显示替代，不能用 polling cache 假装事件已消费。

## 10. Outbound Event 适用性

当前无正式 Outbound Event：L5-sync 的 local CLI operation、metadata transition、conflict、candidate/handoff attempt 不自动广播成平台事实。正式 00/01 未授权事件族，且没有下游需要以事件可靠消费这些 local facts；因此不创建 outbox、topic 或 delivery state。将来若正式需求引入本地状态通知，必须先回退 00/01/02 定义消费者、body-free payload、可靠性与 owner 边界。

## 11. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ScanMetadataIntegrity` | `MetadataIntegrityScanInput input`、`SystemActorContext actor`、`JobMetadata metadata`、`IdempotencyKey idempotency_key` | `MetadataIntegrityScanResult result` | 只读取/分类 manifest records；不得自动 repair/migrate/delete provenance |
| `ProbePendingHandoffAttempts` | `PendingHandoffProbeInput input`、`SystemActorContext actor`、`JobMetadata metadata`、`IdempotencyKey idempotency_key` | `PendingHandoffProbeJobResult result` | 只处理已有 ProbeRequired attempt，经正式 port probe；不重放 submit，不生成 verdict |
| `MarkStaleOwnerSnapshots` | `SnapshotStalenessScanInput input`、`SystemActorContext actor`、`JobMetadata metadata`、`IdempotencyKey idempotency_key` | `SnapshotStalenessScanResult result` | 可标记 stale/invalidated；不调用 owner refresh、不把 TTL 当授权规则 |

Jobs 不包括自动 pull、auto-merge、auto-push-review、自动 conflict resolution、provenance cleanup 或 Git remote sync。

## 12. 全局 Port / Adapter 边界摘要

| Port / boundary | Adapter family | 最小能力 | 明确禁止 | 精确合同状态 |
|---|---|---|---|---|
| `OwnerAccessPort` | L0-sdk identity/work/archive adapter | principal/project/member/posture/allowed-action safe result | 本地授权、private endpoint/cache allow | `SYNC-UP-001/003` blocked |
| `MaterialSourcePort` | L0-sdk artifact/workspace adapter | source locator/version/cursor/delta/comparator safe result | source priority invention、body copy | `SYNC-UP-001/002/008` blocked |
| `ReviewHandoffPort` / `ReviewDecisionReadPort` | L0-sdk governance adapter | submit/probe/read safe ref/result | ACK-as-Decision、Gate mutation beyond contract | `SYNC-UP-001/004/005` blocked |
| `MetadataStore` / `LocalStateUnitOfWork` | `.qs-sync` local persistence adapter | generation-checked load/transition/commit | secret/body、silent rebind/delete | `SYNC-UP-006` blocked at physical schema |
| `GitObservationPort` / `GitWorktreePort` | Git tool adapter | local HEAD/index/tree/dirty/capability + whitelisted apply seam | remote truth、push/merge/rebase/stash/arbitrary shell | `SYNC-UP-007/009/010` pending/blocked |
| `FilesystemPort` / `FilesystemApplyPort` | OS/filesystem adapter | canonical path, symlink/permission/lock, stage/commit | path escape、dirty overwrite、provenance deletion | `SYNC-UP-010` blocked at exact contract |
| `RecoveryProbePort` | owner-specific formal probe adapters | probe known/unknown outcome for prior attempt | blind replay、telemetry inference | `SYNC-UP-004/005` blocked |
| `DiagnosticsPort` | L4-observability/product-neutral adapter | body-free correlation and safe failure summary | formal evidence/report/verdict/readiness | stable boundary; exact surface `SYNC-UP-001` |
| clock/ID/digest providers | local infrastructure adapters | deterministic typed time/IDs/bounded digests | business truth or security decision | detailed design |

## 13. 跨接口一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Command/Query 分类 | pass | 所有写/refresh/probe/repair intent 为 Command/Job；所有 Get/List/Status 纯读 |
| P0 CLI 覆盖 | pass | clone/pull/status/push-review 各映射唯一正式用例 |
| 对象承接 | pass | 29 对象能力都有 API、内部 port、job 或对象内部使用落点；policy 由 application use case 调用 |
| 接口无人承接 | pass | 每个 public use case 有唯一主责 CP，跨部分协作显式 |
| helper 冒充 API | pass | services/domain methods 未列公开 API；ports 单独标明内部 outbound boundary |
| Actor/metadata/idempotency | pass | Command/Consumer/Job 显式；Query 显式 Actor/QueryMetadata |
| no-write | pass | status/get/list/inspect 不 refresh/repair/probe/persist observation |
| event applicability | pass_with_blocker | inbound only conditional; outbound explicitly not applicable |
| external truth | pass | ports 输出 safe result/ref，不把 provider DTO/body 变成本地 truth |
| forbidden actions | pass | API/ports/jobs 无 merge/rebase/push/stash/auto overwrite/auto approval |
| Step 8 独立流范围 | pass | Clone、Pull、PushReview、metadata migrate/rebind、resolution/resume/probe/refresh 及三个 consumers/jobs 已标识 |
| blocker | pass_with_upstream_blockers | `SYNC-UP-001~010` 均有接口层落点且未关闭 |

### 13.1 Step 8 处理流覆盖决策

| 接口 | Step 8 处理方式 | 理由 |
|---|---|---|
| `CloneWorkingCopy`、`PullWorkingCopy`、`PushReviewCandidate` | 独立流程图 | P0 mutation，跨多个部分且影响 local/external state |
| `MigrateSyncMetadata`、`RebindWorkingCopy` | 各自独立流程图 | provenance/generation/binding 风险高 |
| `RecordConflictResolution`、`ResumeSyncOperation`、`ProbeUnknownOutcome`、`RefreshReviewHandoffStatus` | 各自独立流程图 | 改写 local state/处理 unknown/external read-write association |
| `CancelSyncOperation` | 通用 local command flow +关键说明 | 不触发 external cancel；结构简单 |
| `GetSyncStatus`、`InspectWorkingCopy` | 独立流程图 | no-write 与 optional local observation/redaction 容易被破坏 |
| 其他 Get/List Query | 通用 query flow | 单纯读取 projection/repository，无额外 fallback/refresh |
| 三个 conditional consumers | 各自独立流程图 | 会写 local snapshot/invalidation，并影响一致性 |
| 三个 jobs | 各自独立流程图 | 会改 local state或对外 probe，需证明不 repair/replay |

## 14. 回填草稿

正式 §7 摘录 §7 分类/CLI 映射、§8 五部分接口与停审结论、§9~12 consumer/event/job/ports，以及 §13 跨接口审计。正式正文不画流程图；所有处理顺序留给 §8。

延伸阅读入口指向本文件的“CLI 语义映射”“按主要组成部分组织的接口骨架”“条件性 Inbound Event Consumer”“全局 Port / Adapter 边界摘要”和“Step 8 处理流覆盖决策”。

## 15. 待确认事项

- `SYNC-UP-001~010` 保持开放，阻断真实 SDK methods、event payload/topic、metadata physical schema、Git/fs exact operations、CLI flags/exit codes。
- Inbound consumers 在正式 event contract 前是 `blocked/planned`；Outbound Event 当前为 `not_applicable`，不是漏项。
- 所有结果/view 的二级类型与 error taxonomy 留 03；不得用 `Map<String, Any>` 或 provider raw DTO 隐蔽补缺口。

## 16. 进入下一步条件

- [x] 五类接口均已判断适用性；存在的 Command/Query/Consumer/Job 均有表，Outbound Event 明确不适用原因。
- [x] 五个组成部分逐一完成接口停审，无分类混淆、对象孤儿或 helper 冒充 API。
- [x] 所有输入参数采用 `TypeName param_name`，Command/Query/Consumer/Job 上下文完整。
- [x] P0 CLI、维护接口、ports/adapters、条件 consumers/jobs 和 Step 8 覆盖范围明确。
- [x] 无 HTTP/RPC/topic/schema/error code/实现细节或伪造外部合同。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 8。此结论仅为文档静态自检。
