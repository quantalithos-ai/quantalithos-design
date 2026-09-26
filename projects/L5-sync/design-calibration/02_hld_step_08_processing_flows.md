# Step 8. 关键处理流 / 重要函数数据流

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 7 接口分类与覆盖决策已通过。
- `gate_status=pass_with_upstream_blockers`；18 个关键流、五部分停审与跨流审计已完成，`SYNC-UP-001~010` 保持开放。
- 每张图都是概要层 planned flow；不表示代码、事务实现、SDK 调用、Git 命令或测试已存在。

### Step 内计划

1. 回读 Step 7 接口覆盖决策、Step 6 对象和 Step 5 接缝。
2. 先定义通用 mutation/query/consumer/job 处理骨架和完整覆盖清单。
3. 按五部分绘制 P0 Command、高风险维护 Command、会写状态的 consumer、一致性 job 与复杂 Query。
4. 每条流标注 typed function call、关键对象、local transaction / external call 大体边界和 fail-closed 分支。
5. 逐部分停审并执行接口覆盖、对象引用、接缝、no-write、unknown 和未展开理由审计。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 7 §7~13 | 接口分类、CLI 映射、五部分 API/ports、consumer/job 与流程覆盖决策 |
| Step 6 §8~13 | 29 个对象的方法骨架、状态主语及 Step 8 反查 |
| Step 5 §8~9 | 五部分接缝、non-responsibility 和整体交互 |
| Step 3 `HC-SYNC-01~22` | no-write、plan-before-apply、local atomic、probe/finalize、provenance 等流程红线 |
| 概要 SOP/规范 Step/§8 | 独立流程选择、ASCII 图、typed parameters 与停审要求 |

## 3. SOP 问题回答

1. **Command 写路径？** Inbound 只解析显式 typed input/context；Application 先持久化 operation/attempt/checkpoint，再调 Domain policy 与 ports；local store transition 只在已知结果上提交，external call 位于 local prepare 与 probe/finalize 之间。
2. **Query 读路径？** 读取 persisted slices 与明确允许的 read-only local observation，组装 view/redact 后返回；任何缺失/stale 都形成 degraded/blocked surface，不触发 refresh/repair/probe。
3. **Consumer 路径？** 验证正式 envelope/source/schema/dedup，再将 owner change 转为 local snapshot invalidation/decision ref；不自动 materialize/handoff。
4. **Job 路径？** 从已持久化 target 选择工作，逐 target 申请本地幂等关联；metadata scan 只分类，handoff job 只 probe，snapshot job 只标 stale。
5. **typed function calls？** 所有图中函数调用参数均使用 `TypeName param_name`；不写返回类型/错误码/实现体。
6. **概要必须点名什么？** durable-before-effect、owner revalidation、generation/fingerprint preconditions、local UoW、unknown checkpoint/probe、cursor no-advance、candidate invalidation 和 query no-write。
7. **哪些独立作图？** 3 个 P0 mutation、6 个高风险维护/恢复 command、2 个复杂 query、3 个 consumer、3 个 job，共 17 条；共享 access gate 单独作为复用流。
8. **哪些不独立作图？** 简单 Get/List queries 用通用读路径；Cancel 用通用 local Command 路径并在 §14 说明，因为不调用外部 cancel。

## 4. 当前文档问题诊断

旧 02 处理流围绕跨端 dispatch/fanout/replay，既没有 durable local prepare，也没有 source/working-copy、cursor/apply、transport/decision 的边界。若延用，timeout 后重放、status 隐式刷新、cursor 超前和 ACK-as-success 都可能被实现成默认行为。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| dispatch→fanout→ACK 的单线成功流 | local prepare→guard→effect→probe/finalize 的分层流 |
| pull/冲突/恢复缺乏 durable 阶段 | plan/run/checkpoint/manual/probe 对象贯穿 |
| status 可混入 refresh/repair | query 只读 persisted slices 和明确 local observation |
| event/job 被当自动同步触发器 | consumer 仅失效/更新 refs；job 不自动 materialize/handoff |

## 6. 设计取舍

- 在图中标出 local transaction 与 external/local facility call 的大体边界，但不承诺跨 Git/fs/metadata 原子事务；partial/unknown 用 checkpoint 与状态表达。
- P0 commands 全部嵌入 CP1 revalidation；不提供可绕过的预授权流程。
- `CloneWorkingCopy` 先建立可恢复 initialization intent，再执行 initial materialization；如果 apply 失败，binding 不得被误报为完整 ready。
- `PullWorkingCopy` 只有 `AppliedPendingFinalize` 可进入 local cursor/mapping finalize；任何 unknown 保持旧 cursor。
- `PushReviewCandidate` 必须先 durable candidate/attempt，再 external call；timeout 进入 ProbeRequired 而不是 retry。

## 7. 通用处理流骨架与覆盖清单

### 7.1 通用 mutation 写路径

```text
Command
  │
  ▼
Inbound / Operations
  - 解析 typed command、ActorContext、CommandMetadata、IdempotencyKey
  - 拒绝缺失显式语境或重复键异输入
  │
  ▼
Application Service
  - 读取 local state，执行 CP1 owner revalidation
  - 在副作用前持久化 SyncOperation / checkpoint / attempt
  │
  ▼
Domain Objects / Policies + Ports
  - 校验 generation、fingerprint、conflict、provenance 等 hard gates
  - 调用有限 SDK / Git / filesystem capability
  │
  ▼
LocalStateUnitOfWork
  - 只提交已知 local transition；unknown 保留 checkpoint/probe-required
  │
  ▼
Typed Command Result
```

关键设计点：

- 所有 mutation 都从显式 command 开始；Entry 不直接获得 adapter/store mutation capability。
- external/local effect 之前先有 durable local correlation；unknown 不伪造 rollback/success。
- 详细设计继续展开 unit-of-work、optimistic generation、error taxonomy 与 idempotency storage，不在此写实现。

### 7.2 通用 query 读路径

```text
Query
  │
  ▼
Query Inbound
  - 校验 ActorContext / QueryMetadata / visibility scope
  │
  ▼
SyncStatusQueryService or Part Query Service
  - 读取 persisted local truth / view
  - 仅在接口明示时调用 read-only Git / filesystem observation
  │
  ▼
View Objects
  - 保留 stale / unknown / unsupported / blocked
  - 执行 bounded redaction
  │
  ▼
Typed View Result
```

关键设计点：

- Query 不写 operation、snapshot、observation、checkpoint、cursor、probe 或 diagnostic emission。
- 缺失不等于 clean/empty/success；读取完整性与业务状态分离。
- 详细设计继续展开 query authorization、pagination、redaction 和 read consistency，不添加隐式 refresh。

### 7.3 通用 consumer 路径

```text
Owner Event
  │
  ▼
Inbound Consumer
  - 校验 EventEnvelope / EventId / source / schema / dedup
  │
  ▼
Invalidation Application Service
  - 解析 safe refs，不复制 payload body
  │
  ▼
Snapshot / Evaluation / Plan / Candidate
  - 标记 stale / invalidated 或关联 external decision snapshot
  │
  ▼
LocalStateUnitOfWork
  - 提交去重记录和 local invalidation
  │
  ▼
Consumer Result
```

关键设计点：

- 当前三个 consumer 均 `blocked/planned`，必须等正式 event contract；图不授权订阅私有 topic。
- consumer 只影响 local ref/snapshot/plan/candidate，不自动 apply、resolve、retry 或 handoff。
- 详细设计继续展开 envelope mapping、dedup retention 与 poison-event handling。

### 7.4 通用 operations job 路径

```text
Job Trigger
  │
  ▼
Operations Job
  - 读取 persisted target set / JobMetadata / idempotency context
  │
  ▼
Application Service
  - 逐 target 重新校验 job eligibility
  │
  ▼
Domain Policy + Limited Port
  - 执行 scan / probe / stale classification
  │
  ▼
LocalStateUnitOfWork
  - 保存 typed local result，不修 owner truth
  │
  ▼
Job Result
```

关键设计点：

- Job 不借系统身份获得用户 command 或 owner mutation 权限。
- Job 的 batch success 不掩盖 per-target unknown/blocked，且不产生 evidence/readiness。
- 详细设计继续展开租约、并发、批次、重启与进度 view。

### 7.5 处理流覆盖清单

| 归属 | 接口 / 路径 | 独立图 | 使用关键对象 |
|---|---|---|---|
| CP1 | shared mutation eligibility gate | 是 | SyncSelection、AccessEvaluation、ExternalOwnerSnapshot |
| CP1 | `ConsumeAccessOrPostureInvalidated` | 是 | snapshot/evaluation/plan/candidate |
| CP1 | `MarkStaleOwnerSnapshots` | 是 | ExternalOwnerSnapshot、AccessEvaluation |
| CP2 | `CloneWorkingCopy` | 是 | operation/binding/manifest/observation/plan/run/provenance |
| CP2 | `MigrateSyncMetadata` | 是 | binding/manifest/provenance |
| CP2 | `RebindWorkingCopy` | 是 | selection/binding/manifest/conflict/provenance |
| CP2 | `InspectWorkingCopy` | 是 | WorkingCopyObservation view |
| CP2 | `ScanMetadataIntegrity` | 是 | manifest/integrity state |
| CP3 | `PullWorkingCopy` | 是 | cursor/mapping/delta/plan/change-set/run/checkpoint |
| CP3 | `ConsumeMaterialSourceInvalidated` | 是 | snapshot/cursor/plan/candidate |
| CP4 | `RecordConflictResolution` | 是 | conflict/manual resolution |
| CP4 | `ResumeSyncOperation` | 是 | operation/checkpoint/policy/current context |
| CP4 | `ProbeUnknownOutcome` | 是 | checkpoint/attempt/probe |
| CP4 | `ProbePendingHandoffAttempts` | 是 | attempt/probe/checkpoint |
| CP5 | `PushReviewCandidate` | 是 | candidate/attempt/provenance/layered status |
| CP5 | `RefreshReviewHandoffStatus` | 是 | attempt/probe/decision snapshot/provenance |
| CP5 | `GetSyncStatus` | 是 | all read slices / SyncStatusView |
| CP5 | `ConsumeReviewDecisionChanged` | 是 | decision snapshot/attempt/layered status |

## 8. CP1 Selection & Access 处理流

#### SharedMutationEligibilityGate 处理流

```text
Mutation Command
  │
  ▼
Inbound / Operations
  - 构造 SyncSelection.from_explicit_refs(PrincipalRef principal_ref, ProjectRef project_ref,
    VersionRef version_ref, MaterialSourceRef source_ref, LocalTargetRef target_ref,
    SyncOperationKind operation_kind)
  │
  ▼
SelectionAccessService
  - 调用 OwnerAccessPort.check_eligibility(OwnerAccessRequest request, CallContext context)
  - 捕获 ExternalOwnerSnapshot.capture(ExternalOwnerSnapshotId snapshot_id,
    ExternalOwnerKind owner_kind, ExternalSubjectRef subject_ref, OwnerVersionRef source_version_ref,
    SafeOwnerStateSummary safe_state_summary, ReferenceVisibilityState visibility_state, ObservedAt observed_at)
  │
  ▼
OperationEligibilityPolicy / AccessEvaluation
  - 调用 OperationEligibilityPolicy.evaluate(SyncSelection selection,
    OwnerEligibilityResultSet owner_results, ObservedAt evaluation_time)
  - Unknown / stale / denied / blocked 立即停止
  │
  ▼
LocalStateUnitOfWork
  - mutation 路径保存 evaluation / snapshot / operation relation
  │
  ▼
Eligible Context or Typed Blocker
```

关键设计点：

- 该共享流嵌入每个 mutation，不产生可离线复用的授权 token；目标阶段变化可再次 revalidate。
- snapshot 只作为依据引用，owner 结果未知、陈旧或合同缺失时 fail-closed。
- 03 继续展开每种 operation 的 check matrix、SDK error mapping 和 freshness contract；`SYNC-UP-001/003` 未闭合。

#### ConsumeAccessOrPostureInvalidated 处理流

```text
Event / AccessOrPostureInvalidatedEvent
  │
  ▼
ConsumeAccessOrPostureInvalidated
  - 校验 EventEnvelope envelope、EventId event_id、IdempotencyKey idempotency_key
  - 验证正式 source / schema / dedup
  │
  ▼
SelectionAccessService
  - 定位 ExternalOwnerSnapshot / AccessEvaluation 及受影响 local refs
  │
  ▼
ExternalOwnerSnapshot / AccessEvaluation / MaterializationPlan / ReviewCandidate
  - 调用 ExternalOwnerSnapshot.invalidate(SnapshotInvalidationReason reason)
  - 标记 evaluation stale，并使未执行 plan / frozen candidate invalidated
  │
  ▼
LocalStateUnitOfWork
  - 原子提交 event dedup + local invalidation relation
  │
  ▼
Consumer Result / No Automatic Side Effect
```

关键设计点：

- 事件只收紧 local posture；不自动撤销未知外部 handoff、删除 files 或改变 owner truth。
- 已完成历史保留，未执行 plan/candidate 失效；正在进行的 effect 转 CP4 checkpoint/needs-action。
- event contract、影响范围和顺序留 03，当前受 `SYNC-UP-001/003` 阻断。

#### MarkStaleOwnerSnapshots 处理流

```text
Job / MarkStaleOwnerSnapshots
  │
  ▼
SnapshotStalenessJob
  - 读取 SnapshotStalenessScanInput input、JobMetadata metadata
  │
  ▼
SelectionAccessService
  - 逐 snapshot 读取 persisted freshness/source version
  │
  ▼
ExternalOwnerSnapshot / AccessEvaluation
  - 依据 SnapshotFreshnessRule 标记 Stale / Unknown
  - 不调用 owner refresh，不产生 Eligible
  │
  ▼
LocalStateUnitOfWork
  - 保存 per-target typed transition / blocker
  │
  ▼
SnapshotStalenessScanResult
```

关键设计点：

- 时间/TTL 只能使 snapshot 更保守，不能证明其 fresh 或重新授权。
- Job 不调用 materialization/handoff，不让 batch result 覆盖 per-target unknown。
- 03 继续展开 scan selection、lease/idempotency 与 freshness source；不得配置关闭 fail-closed。

### CP1 处理流停审

| 审查项 | 结论 |
|---|---|
| 接口覆盖 | shared gate、access/posture consumer、stale scan job 全覆盖；简单 access queries 走通用读路径 |
| 对象引用 | 全部对象已在 Step 6 定义；plan/candidate invalidation 接缝来自 Step 5 |
| no-write / effect | query 未进入本节；consumer/job 只写 local invalidation，无外部 mutation |
| 越层 | 无 reusable authorization/local owner truth；SDK/event contracts 仍 blocked |

## 9. CP2 Working Copy & Metadata 处理流

#### CloneWorkingCopy 处理流

```text
Command / CloneWorkingCopy
  │
  ▼
CloneCommandEntry
  - 校验 CloneWorkingCopyCommand command、ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  │
  ▼
OperationCoordinator + SharedMutationEligibilityGate
  - 创建 SyncOperation.plan_mutation(...)
  - revalidate explicit selection；异输入复用同 key 返回 conflict
  │
  ▼
WorkingCopyService
  - 调用 FilesystemPort.inspect_target(FilesystemInspectionRequest request)
  - 捕获 WorkingCopyObservation.capture(...)
  - WorkingCopySafetyPolicy.evaluate_target(WorkingCopyObservation observation, SyncOperationKind operation_kind)
  │
  ▼
LocalStateUnitOfWork / prepare
  - 建立 initializing WorkingCopyBinding、MetadataManifest、CursorState、MappingSet、checkpoint/provenance root
  │
  ▼
MaterializationService
  - 解析 full source、构造/验证 MaterializationPlan，再受限 apply
  │
  ▼
LocalStateUnitOfWork / finalize or checkpoint
  - proven apply: finalize binding/cursor/mapping/run/provenance
  - conflict/unknown: 保留 initializing/restricted + checkpoint，绝不报 ready
  │
  ▼
CloneWorkingCopyResult
```

关键设计点：

- target inspect 在任何 metadata/file mutation 前；非空、dirty、ambiguous binding 或 unsafe path 不自动接管。
- 初始化 local intent 与 initial apply 可恢复，但只有 proven finalize 才返回完整本地 clone 结果；不宣称 Artifact/Baseline。
- 03 继续展开 staging/commit/UoW、crash windows、idempotency equivalence 与 schema；受 `SYNC-UP-002/006/008/010` 阻断。

#### MigrateSyncMetadata 处理流

```text
Command / MigrateSyncMetadata
  │
  ▼
MetadataMaintenanceEntry
  - 校验 typed command / actor / metadata / idempotency key
  │
  ▼
MetadataMaintenanceService + SharedMutationEligibilityGate
  - 只读加载 binding / prior manifest / protected provenance / active checkpoints
  │
  ▼
MetadataIntegrityPolicy
  - 调用 MetadataIntegrityPolicy.validate_migration(MetadataManifest prior_manifest,
    MetadataManifest candidate_manifest)
  - unknown/corrupt/unsupported contract => blocked，不自动“修好”
  │
  ▼
MetadataManifest / ProvenanceRecord
  - 构造新 generation manifest 和 Migration relation，保留 prior refs
  │
  ▼
LocalStateUnitOfWork
  - generation-checked commit；提交不明进入 recovery，旧安全 state 不伪造切换
  │
  ▼
MetadataMigrationResult
```

关键设计点：

- migration 是显式 Command；status/scan 不调用本流。
- active checkpoint/attempt/provenance closure 必须可迁移或明确阻断，不能删记录换取成功。
- 物理文件切换、backup/rollback/compatibility 留 03；`SYNC-UP-006` 未闭合时正向 migration 可 blocked。

#### RebindWorkingCopy 处理流

```text
Command / RebindWorkingCopy
  │
  ▼
MetadataMaintenanceEntry
  - 接收 explicit old binding / new selection / actor / reason / idempotency context
  │
  ▼
MetadataMaintenanceService + SharedMutationEligibilityGate
  - 校验 old binding、new owner eligibility、target observation、active conflict/recovery/handoff
  │
  ▼
WorkingCopySafetyPolicy + MetadataIntegrityPolicy
  - 调用 WorkingCopyBinding.assert_matches(SyncSelection selection,
    CanonicalLocalTargetRef target_ref) 校验旧关系
  - dirty/unknown/protected history => needs-action
  │
  ▼
WorkingCopyBinding / MetadataManifest / ProvenanceRecord
  - 调用 WorkingCopyBinding.rebind_explicitly(WorkingCopyBinding prior_binding,
    SyncSelectionRef new_selection_ref, MetadataGeneration new_generation,
    ProvenanceRecordRef transition_provenance_ref)
  │
  ▼
LocalStateUnitOfWork
  - 保存新 generation + transition provenance；旧 binding/history superseded/protected
  │
  ▼
WorkingCopyRebindResult
```

关键设计点：

- rebind 不是改写几个 refs；必须新 generation 并保存 old→new provenance relation。
- dirty/untracked、active handoff/unknown、source mismatch 或 metadata gap 不允许静默继续。
- 03 继续定义允许的 rebind cases、target identity 与 retention；`SYNC-UP-006/007/010` 持续阻断。

#### InspectWorkingCopy 处理流

```text
Query / InspectWorkingCopy
  │
  ▼
StatusQueryEntry
  - 校验 InspectWorkingCopyQuery query、ActorContext actor、QueryMetadata metadata
  │
  ▼
WorkingCopyService / read-only path
  - 调用 GitObservationPort.observe_worktree(GitObservationRequest request)
  - 调用 FilesystemPort.inspect_target(FilesystemInspectionRequest request)
  │
  ▼
WorkingCopyObservation
  - 构造 bounded immutable observation；不 attach/persist 到 binding
  │
  ▼
WorkingCopyObservationView
  - redacted output，保留 dirty/untracked/path/tool unknown
  │
  ▼
Query Result / No Write
```

关键设计点：

- 允许即时 read-only local observation，但不加写锁、不执行 Git fetch/status repair、不持久化 observation。
- adapter 只返回 typed bounded fields，不泄漏 raw stdout/stderr 或文件正文。
- 03 继续展开 tool invocation safety、timeouts 与 race semantics；query no-write 不可配置关闭。

#### ScanMetadataIntegrity 处理流

```text
Job / ScanMetadataIntegrity
  │
  ▼
MetadataIntegrityJob
  - 读取明确 target set、SystemActorContext、JobMetadata、IdempotencyKey
  │
  ▼
MetadataMaintenanceService / read-only scan phase
  - 加载 manifest / binding / record summaries / provenance closure
  │
  ▼
MetadataIntegrityPolicy
  - 调用 MetadataIntegrityPolicy.evaluate(MetadataManifest manifest,
    WorkingCopyBinding binding, MetadataRecordSummarySet record_summaries)
  │
  ▼
LocalStateUnitOfWork
  - 仅保存 integrity classification / safe diagnostic relation（若状态改变）
  - 不 repair/migrate/delete/rebind
  │
  ▼
MetadataIntegrityScanResult
```

关键设计点：

- scan 可以把状态收紧为 Corrupt/Unknown/NeedsMigration，不能自动恢复为 Valid 除非正式完整性证明成立。
- 每个 target 结果独立，单个损坏不被 batch success 隐藏。
- 03 继续展开 scan lease、bounded record summaries 与 safe state transition；正向 physical verification 受 `SYNC-UP-006`。

### CP2 处理流停审

| 审查项 | 结论 |
|---|---|
| 接口覆盖 | clone/migrate/rebind/inspect/scan 全有独立流；简单 binding/health queries 走通用读路径 |
| 对象引用 | CP2 对象与 CP1/CP3/CP4/CP5 接缝均来自 Step 5/6 |
| local consistency | prepare/finalize/generation/provenance 大体边界明确，不宣称跨 facility 事务 |
| no-write | Inspect/简单 Queries 不持久化；scan 仅显式 job 写分类 |
| blocker | metadata/Git/path/source contracts 继续 `SYNC-UP-002/006/007/008/010` |

## 10. CP3 Source Materialization 处理流

#### PullWorkingCopy 处理流

```text
Command / PullWorkingCopy
  │
  ▼
PullCommandEntry
  - 校验 PullWorkingCopyCommand command、ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  │
  ▼
OperationCoordinator + SharedMutationEligibilityGate
  - 加载 binding/manifest/cursor/mapping；建立 operation/checkpoint
  │
  ▼
MaterializationService / source read outside local write transaction
  - 调用 MaterialSourcePort.resolve_source(MaterialSourceRequest request, CallContext context)
  - 调用 MaterialSourcePort.read_delta(SourceDeltaRequest request, CallContext context)
  - SourceDelta.is_continuous_from(CursorState cursor_state)；gap/unsupported/unknown 停止
  │
  ▼
MaterializationPlan / PathChangeSet
  - 构造 plan，读取 current WorkingCopyObservation
  - MaterializationSafetyPolicy.validate_plan(MaterializationPlan plan,
    AccessEvaluation access_evaluation, CursorState cursor_state,
    WorkingCopyObservation observation, MappingSet mapping_set)
  │
  ▼
MaterializationRun / GitWorktreePort / FilesystemApplyPort
  - durable Prepared checkpoint 后执行白名单 local apply
  - dirty/drift/conflict => CP4；partial/unknown => checkpoint，旧 cursor 保持
  │
  ▼
LocalStateUnitOfWork / finalize
  - 仅 AppliedPendingFinalize + same generation 提交 mapping/cursor/provenance/run Finalized
  │
  ▼
PullWorkingCopyResult
```

关键设计点：

- source read/comparison、local plan、facility apply 和 metadata finalize 是不同阶段；不能以 Git/process success 跳过验证。
- cursor 只在 proven apply + same generation 的 local commit 中推进；gap/partial/unknown 保持旧水位。
- comparator/delta/mapping、Git/fs atomic staging 与 crash recovery 留 03；`SYNC-UP-002/007/008/010` 未闭合即 blocked。

#### ConsumeMaterialSourceInvalidated 处理流

```text
Event / MaterialSourceInvalidatedEvent
  │
  ▼
ConsumeMaterialSourceInvalidated
  - 校验 EventEnvelope envelope、EventId event_id、IdempotencyKey idempotency_key
  │
  ▼
MaterializationService
  - 定位 source snapshot、CursorState、未执行 MaterializationPlan、ReviewCandidate
  │
  ▼
ExternalOwnerSnapshot / CursorState / MaterializationPlan / ReviewCandidate
  - snapshot invalidated；continuity 设 Unknown
  - plan/candidate 标记 Invalidated；不改 local files/cursor
  │
  ▼
LocalStateUnitOfWork
  - 提交 dedup + invalidation/provenance relation
  │
  ▼
Consumer Result / Explicit Pull Required
```

关键设计点：

- source invalidation 不自动 pull、rollback、delete 或 overwrite；只迫使下一 mutation 重新 resolve/compare。
- 已 finalize local content/cursor 仍是历史 local truth，但不能被宣传为 owner current。
- event identity/order/payload 留 03，受 `SYNC-UP-001/002/008` 阻断。

### CP3 处理流停审

| 审查项 | 结论 |
|---|---|
| 接口覆盖 | Pull 独立流；GetMaterializationStatus 走通用 query；source consumer 独立流 |
| 对象引用 | cursor/mapping/delta/plan/change-set/run/checkpoint/provenance 均已定义 |
| 接缝 | CP1 revalidate、CP2 UoW、CP4 conflict、CP5 provenance 清晰 |
| consistency | source/local/Git/cursor 分层；unknown 不 finalize |
| blocker | `SYNC-UP-002/007/008/010` 保持并直接阻断不安全路径 |

## 11. CP4 Conflict & Recovery 处理流

#### RecordConflictResolution 处理流

```text
Command / RecordConflictResolution
  │
  ▼
RecoveryOperationsEntry
  - 校验 typed command、ActorContext、CommandMetadata、IdempotencyKey
  │
  ▼
ConflictRecoveryService
  - 读取 open ConflictRecord / current checkpoint / allowed decisions
  │
  ▼
ManualResolution / RecoverySafetyPolicy
  - 创建 ManualResolution.record(...)
  - 调用 ManualResolution.validate(ConflictRecord conflict_record,
    RecoveryCurrentContext current_context, RecoverySafetyPolicy safety_policy)
  │
  ▼
LocalStateUnitOfWork
  - 保存 resolution intent + ConflictRecord.ResolutionRecorded + provenance relation
  - 不执行 files/source/handoff mutation
  │
  ▼
ConflictResolutionResult / Explicit Resume Required
```

关键设计点：

- 记录决定与执行决定严格分离；用户意图仍需 `ResumeSyncOperation` 重新验证并产生新 plan/stage。
- 自动工具/job 不得冒充 Actor 选择 KeepLocal/ApplySource，也不能用一个 flag 强制覆盖。
- 03 继续展开 decision kinds、scope identity、concurrency 与 stale-resolution errors；`SYNC-UP-010` 未闭合时高风险决定可 unsupported。

#### ResumeSyncOperation 处理流

```text
Command / ResumeSyncOperation
  │
  ▼
RecoveryOperationsEntry
  - 校验 operation/checkpoint/resolution refs 与 explicit actor intent
  │
  ▼
ConflictRecoveryService + SharedMutationEligibilityGate
  - 加载 RecoveryCheckpoint、current binding/source/local/attempt context
  │
  ▼
RecoverySafetyPolicy
  - 调用 RecoverySafetyPolicy.classify_next_action(RecoveryCheckpoint checkpoint,
    RecoveryCurrentContext current_context)
  ├─ ResumeLocal: 只续行已证明 local-safe stage
  ├─ Revalidate/Replan: 返回原 CP 创建新 plan/operation stage
  ├─ ProbeRequired: 进入 ProbeUnknownOutcome
  └─ Manual/Stop: 保持 NeedsAction
  │
  ▼
Owning Part + LocalStateUnitOfWork
  - 执行明确分支并提交新 checkpoint/result；不绕过原 policy
  │
  ▼
ResumeSyncOperationResult
```

关键设计点：

- resume 是重新判定，不是从程序计数器继续；任何 generation/fingerprint/access drift 都可迫使 replan/stop。
- external effect unknown 只能 ProbeRequired，不允许用户“确认重试”替代等价合同。
- 03 继续展开各 stage reentry matrix、locks 和 crash points；受 `SYNC-UP-005/010`。

#### ProbeUnknownOutcome 处理流

```text
Command / ProbeUnknownOutcome
  │
  ▼
RecoveryOperationsEntry
  - 校验 prior attempt / checkpoint / actor / idempotency context
  │
  ▼
RecoveryProbeService
  - 创建并持久化 ProbeRecord.prepare(ProbeRecordId probe_id,
    ExternalAttemptRef attempt_ref, RecoveryProbeKind probe_kind,
    IdempotencyContextRef idempotency_context_ref)
  │
  ▼
RecoveryProbePort / external call outside local transaction
  - 调用 RecoveryProbePort.probe_external_attempt(RecoveryProbeRequest request,
    CallContext context)
  │
  ▼
ProbeRecord + HandoffResultPolicy
  - known: safe result/ref；unknown/unsupported/failed probe 分别保留
  - 不把 transport/probe known 自动解释为 Review Decision
  │
  ▼
LocalStateUnitOfWork
  - 保存 probe/attempt/checkpoint/provenance relation
  │
  ▼
ProbeUnknownOutcomeResult / No Automatic Replay
```

关键设计点：

- durable probe intent precedes external probe；probe 本身也可能 unknown，仍不重放 submit。
- 只能探测明确 prior attempt，不能遍历/猜测 remote objects 或使用 telemetry 推断。
- 03 继续展开 owner-specific probe mapping、equivalence/terminal rules；受 `SYNC-UP-004/005` 完全阻断时返回 unsupported/manual。

#### ProbePendingHandoffAttempts 处理流

```text
Job / ProbePendingHandoffAttempts
  │
  ▼
PendingHandoffProbeJob
  - 读取 persisted ProbeRequired attempts、JobMetadata、per-attempt idempotency context
  │
  ▼
RecoveryProbeService
  - 逐 attempt 获取 lease / current checkpoint
  - 仅调用与 ProbeUnknownOutcome 相同正式 probe path
  │
  ▼
ProbeRecord / HandoffAttempt / HandoffResultPolicy
  - 保存 known/unknown/unsupported；不 submit/retry，不生成 decision
  │
  ▼
LocalStateUnitOfWork
  - per-attempt commit；保留 partial job results
  │
  ▼
PendingHandoffProbeJobResult
```

关键设计点：

- Job 是显式 probe 调度，不是 handoff retry worker；只处理 durable ProbeRequired attempts。
- batch finished 不等于所有 attempts resolved；每个结果独立保留 unknown/manual。
- 03 继续展开 lease/concurrency/backoff budget 和 job progress；不在此定义 retry 参数。

### CP4 处理流停审

| 审查项 | 结论 |
|---|---|
| 接口覆盖 | resolution/resume/probe/job 独立；Cancel 走通用 local command；Conflict/Recovery queries 走通用读路径 |
| 对象引用 | Conflict/Checkpoint/ManualResolution/Probe/Attempt/Policies 全已定义 |
| 接缝 | resume 返回原 owning CP，probe 经正式 port；无 recovery 上帝服务 |
| unknown discipline | durable intent、probe、still-unknown/manual 明确；无 blind replay |
| blocker | `SYNC-UP-004/005/010` 保持开放 |

## 12. CP5 Review Handoff & Provenance 处理流

#### PushReviewCandidate 处理流

```text
Command / PushReviewCandidate
  │
  ▼
PushReviewCommandEntry
  - 校验 PushReviewCandidateCommand command、ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  │
  ▼
ReviewHandoffService + SharedMutationEligibilityGate
  - 读取 binding/generation/cursor/current WorkingCopyObservation/open conflict/recovery
  │
  ▼
CandidateEligibilityPolicy / ReviewCandidate
  - 调用 CandidateEligibilityPolicy.evaluate(CandidateEligibilityContext eligibility_context)
  - eligible 后 ReviewCandidate.freeze(CandidateDigestRef candidate_digest_ref,
    CandidatePathScope included_path_scope, WorkingCopyObservationRef local_observation_ref)
  │
  ▼
LocalStateUnitOfWork / durable prepare
  - 保存 frozen candidate、HandoffAttempt.Prepared、checkpoint、provenance
  │
  ▼
ReviewHandoffPort / external call outside local transaction
  - 调用 ReviewHandoffPort.submit_candidate(ReviewHandoffRequest request, CallContext context)
  │
  ▼
HandoffAttempt / HandoffResultPolicy
  - known transport/ref: 分层保存；Decision 仍 external pending
  - timeout/lost response: OutcomeUnknown → ProbeRequired，禁止重放
  │
  ▼
LocalStateUnitOfWork + PushReviewCandidateResult
```

关键设计点：

- candidate freeze/attempt/checkpoint/provenance 必须在 call 前 durable；任一 drift 使旧 candidate 失效。
- 输出最多证明 local candidate/attempt/transport/external ref，绝不把 ACK/HTTP/remote object 显示 accepted/approved。
- Governance request/ACK/probe/idempotency mapping 留 03；`SYNC-UP-001/004/005` 未闭合时只能 prepare/blocked，不声称提交完成。

#### RefreshReviewHandoffStatus 处理流

```text
Command / RefreshReviewHandoffStatus
  │
  ▼
PushReviewCommandEntry
  - 校验明确 attempt/ref、ActorContext、CommandMetadata、IdempotencyKey
  │
  ▼
ReviewHandoffService
  - 读取 HandoffAttempt / existing ProbeRecord / persisted decision snapshot
  │
  ▼
ReviewDecisionReadPort or RecoveryProbePort
  - unknown attempt 先正式 probe；known external ref 才 read owner handoff/decision state
  │
  ▼
ExternalOwnerSnapshot / HandoffResultPolicy
  - 捕获 safe Governance snapshot；组装 layered local/transport/probe/decision semantics
  │
  ▼
LocalStateUnitOfWork
  - 保存 snapshot/attempt/provenance relation；不修改 Governance state
  │
  ▼
ReviewHandoffRefreshResult
```

关键设计点：

- refresh 是显式写 local snapshot 的 Command；`GetReviewHandoffStatus` 不走本流。
- Decision state 只转述正式 owner ref/result，missing/stale/unknown 不按 pending/accepted 补缺省。
- 03 继续展开 probe-vs-read selection、visibility/redaction 和 terminal mapping；受 `SYNC-UP-004/005`。

#### GetSyncStatus 处理流

```text
Query / GetSyncStatus
  │
  ▼
StatusQueryEntry
  - 校验 GetSyncStatusQuery query、ActorContext actor、QueryMetadata metadata
  │
  ▼
SyncStatusQueryService
  - 读取 CP1~CP5 persisted slices
  - 若 query 明示且安全，仅调用 read-only Git/filesystem observation；不持久化
  │
  ▼
LayeredHandoffStatus / SyncStatusView
  - 调用 LayeredHandoffStatus.assemble(...)
  - 调用 SyncStatusView.assemble_from_persisted_slices(...)
  - 保留 missing/stale/unknown/unsupported/blocked，执行 redaction
  │
  ▼
GetSyncStatusResult
  - local/source/cursor/Git/conflict/recovery/transport/decision/archive posture 分层
  │
  ▼
No Write / No Refresh / No Probe
```

关键设计点：

- 即时 local observation 是 read-only ephemeral slice；不得 attach 到 binding、改变 cursor 或 emit diagnostic。
- view completeness 不等于 sync success；ACK、Decision、archive posture 与 Git 状态保持独立。
- 03 继续展开 query option、read consistency、redaction/visibility 与 output DTO；no-write 是硬门禁。

#### ConsumeReviewDecisionChanged 处理流

```text
Event / ReviewDecisionChangedEvent
  │
  ▼
ConsumeReviewDecisionChanged
  - 校验 EventEnvelope envelope、EventId event_id、IdempotencyKey idempotency_key
  - 验证 Governance source/ref/schema/dedup
  │
  ▼
ReviewHandoffService
  - 按 official external handoff/Gate ref 关联 HandoffAttempt
  │
  ▼
ExternalOwnerSnapshot / HandoffResultPolicy
  - 捕获 safe decision snapshot，不重解释 accepted/rejected 语义
  - unknown mapping 或不可见 => restricted/unknown，不猜测
  │
  ▼
LocalStateUnitOfWork
  - 保存 dedup + snapshot + provenance relation
  │
  ▼
Consumer Result / No Local File Mutation
```

关键设计点：

- event 只更新 safe owner snapshot，不修改 candidate/files/Gate/Decision，也不触发新 handoff。
- unmatched/ambiguous ref 不新建伪造 attempt；记录 blocked diagnostic relation 或拒绝消费。
- event schema/order/visibility 留 03，当前受 `SYNC-UP-001/004` 阻断。

### CP5 处理流停审

| 审查项 | 结论 |
|---|---|
| 接口覆盖 | Push/Refresh/Status/Decision consumer 独立；其他 CP5 queries 走通用读路径 |
| 对象引用 | Candidate/Attempt/Probe/Snapshot/Provenance/Views/Policies 全部已定义 |
| effect boundary | local durable prepare → external call → local probe/finalize 清楚 |
| result semantics | local/transport/probe/decision 分层；status no-write |
| blocker | `SYNC-UP-001/004/005` 保持开放 |

## 13. 跨处理流一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口覆盖 | pass | 全部接口有独立图或通用流/未展开理由；17 独立路径 + shared gate 均覆盖 |
| 对象定义 | pass | 所有图中 domain/view 对象已在 Step 6；无流程临时发明主语 |
| 五部分接缝 | pass | CP1 gate、CP2 state/UoW、CP3 apply、CP4 recovery、CP5 handoff/provenance 方向一致 |
| typed call parameters | pass | 图中点名调用均使用 `TypeName param_name` 或 `...` 指代已列 typed factory，未用裸参数 |
| local transaction 粒度 | pass | 只声明 prepare/finalize/UoW 边界，不声称 Git/fs/SDK 跨设施事务 |
| query no-write | pass | Status/Inspect/通用 Queries 不 persist/refresh/repair/probe/emit |
| cursor safety | pass | only proven apply + same generation finalize；partial/unknown 无推进 |
| unknown outcome | pass | checkpoint + probe-required/manual；无 blind replay |
| consumer safety | pass_with_blocker | 只 local invalidation/ref update；正式 event contract 前 blocked/planned |
| job safety | pass | scan/probe/stale only；无 auto pull/merge/push-review/cleanup |
| provenance | pass | init/migrate/rebind/materialize/recovery/handoff 均有 relation；不生成 evidence |
| blocker | pass_with_upstream_blockers | `SYNC-UP-001~010` 均影响对应 flow，不被历史/fake 补齐 |

## 14. 未独立展开处理流的取舍

| 接口 | 处理口径 | 不独立画图原因 |
|---|---|---|
| `GetAccessEvaluation`、`GetSyncOperation`、`GetWorkingCopyBinding`、`GetMetadataHealth`、`GetMaterializationStatus`、`GetConflict`、`ListConflicts`、`GetRecoveryStatus`、`GetReviewHandoffStatus`、`GetProvenance`、`GetSyncDiagnosticSummary` | 通用 query 读路径 | 都只读取明确 repository/view 并 redaction，无 fallback/refresh/repair；具体 view mapping 留 03 |
| `CancelSyncOperation` | 通用 mutation 写路径；读取 operation/checkpoint，验证 actor，标 Cancelled/Completed checkpoint，append provenance | 不调用 external cancel，不删除 history，不改变 files/source/handoff；结构简单 |
| port operations | 嵌入所属 use case 图 | Port 是内部接缝，不是独立用户用例；避免把 adapter 调用误写成业务 API |

## 15. 回填草稿

正式 §8 保留通用四类流、覆盖清单、18 个关键图（含 shared gate）及每部分停审/跨流审计摘要。为可读性按 CP1~CP5 编排；每个图明确边界、禁止事项与 03 承接，不写异常全集或协议时序。

延伸阅读入口指向本文件的“通用处理流骨架与覆盖清单”、各 CP“处理流停审”“跨处理流一致性审计”和“未独立展开处理流的取舍”。

## 16. 待确认事项

- SDK/source/Governance/event/metadata/Git/fs 精确 flow 仍受 `SYNC-UP-001~010`；无法核验的正向步骤返回 blocked/unsupported/manual。
- Local UoW 与 filesystem/Git apply 的 crash consistency、locks、staging、compensation 只能在 03 基于实际 adapter 能力定义；02 不声称已有原子实现。

## 17. 进入下一步条件

- [x] P0 Commands、会写 local state 的 consumers、影响一致性的 jobs 全部有独立处理流。
- [x] 复杂 no-write Queries 有独立流；其余接口有通用路径与不展开理由。
- [x] 五部分逐一停审，跨流审计无 unresolved interface/object/seam/transaction 冲突。
- [x] 所有图遵守从接口到入口/service/object/result 的主方向，函数参数 typed，未写完整实现。
- [x] query no-write、cursor no-advance on unknown、durable-before-external-effect、ACK/Decision 与 provenance/evidence 边界闭合。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 9。此结论仅为文档静态自检。
