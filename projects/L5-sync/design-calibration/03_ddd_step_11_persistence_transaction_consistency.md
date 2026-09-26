# Step 11. 持久化、事务与一致性契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
>
> 本步只定义 L5-sync 的 logical persistence contract。`.qs-sync` 的具体文件/表布局、迁移版本、驱动、保留期限和崩溃恢复实现仍受 `SYNC-UP-006` 阻塞；以下内容不是 DDL、实现或已运行证据。

## 1. Step 状态与 Step 内计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11：持久化、事务与一致性 |
| 当前状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 回填位置 | 正式 `03-详细设计.md` §10 数据持久化、事务与一致性；并回指 §5、§8、§9、§11～§15 |
| 写入范围 | 仅本 calibration 文件、flow、项目台账；正式 03 尚未写入 |
| 不得声称 | 物理 schema、migration、存储驱动、commit、run、测试、artifact、evidence、review 或 readiness |

### 1.1 分批计划

| 批次 | 内容 | 状态 | 停审证据 |
|---|---|---|---|
| 11.1 | 输入、问题回答、所有权与 logical store 总表 | completed | 17 lifecycle object + technical carrier closure |
| 11.2 | repository callable surface、version/index/append 规则 | completed | Step 7 surface 一一回指 |
| 11.3 | local UoW、external effect、command/query/consumer/job boundary | completed | 29 flow boundary matrix |
| 11.4 | 一致性、commit ambiguity、replay、provenance 与禁止项 | completed | no-write/unknown/retention audit |
| 11.5 | 前序回填、跨 Step 审计、Step 12 handoff | completed | gate pass with blockers |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `03_ddd_step_06_object_contracts.md` | 17 个 local lifecycle object、typed ref、state、transition/proof/result/invocation carrier。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、`LocalStateUnitOfWork`、versioned read/write、receipt/job result、diagnostic 与 external seam。 |
| `03_ddd_step_08_protocol_contracts.md` | 10 Command、13 Query、3 conditional Consumer、3 Job 的 result/receipt/report 类型与 no-write 边界。 |
| `03_ddd_step_09_function_flows.md` | prepare→external/local call→finalize 顺序、cursor/mapping/run 原子可见性和 29 条 flow。 |
| `03_ddd_step_10_state_matrix.md` | exact state transition、terminal/degraded state、22 条 forbidden transition 与跨状态传播。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | version、metadata、idempotency、query view、provenance 和 phase boundary 复核口径。 |
| `projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | 仅借用 logical store / repository / UoW / consistency 的讨论粒度，不复制 Governance truth、outbox 或 projection ownership。 |

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些数据由本仓拥有？ | 仅拥有本地 sync session、selection、working-copy binding、`.qs-sync` logical metadata、cursor、mapping、materialization plan/path/run、conflict、checkpoint、manual resolution、probe、candidate、handoff attempt、local provenance、proof/transition/result/invocation 与 replay carrier。 |
| 哪些只是 ref/snapshot/decision？ | Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote、owner/source truth、外部 handoff truth 均只能保存 typed ref、版本、digest、body-free snapshot、transport/decision layer 或受控 marker；不在 L5-sync store 中迁移其 lifecycle。 |
| 是否有 outbound event/outbox truth？ | 不适用。L5-sync 没有平台 outbound event truth；不得套用 Governance outbox。`StoredConsumerReceipt`、`StoredSyncJobResult` 是本地 replay carrier，不是平台事件事实。 |
| mutable record 如何更新？ | 先从 owning repository 读取 `Versioned<T>`，再用返回的 `LocalEntityVersion` 构造 `ExpectedLocalVersion.version` 保存；不得用 cursor、时间戳、page cursor、Git object 或 hard-coded `1` 代替。新 identity 只能使用 `ExpectedLocalVersion.absent`。 |
| 什么时候使用 local UoW？ | 所有 local accepted mutation、保守 consumer transition、job item marker、idempotency/result completion、proof/transition/provenance append、run/cursor/mapping finalize 都必须在 `LocalStateUnitOfWork` 内；Query 不开启写 UoW。 |
| 外部 SDK/Git/filesystem 是否在事务内？ | 不在。durable prepare 先提交，外部/工具调用在 UoW 外，随后以 known result 或 `OutcomeUnknown/ProbeRequired` 开启新的 finalize UoW；不能声称分布式事务或自动 rollback 外部 effect。 |
| commit 返回 unknown 怎么办？ | 不宣称成功或失败，不换新 idempotency key，不盲重放外部 effect；按原 operation/key/digest reload idempotency、stored result、subject version 和 checkpoint，缺 carrier 时转 `ConsistencyDefect`/人工处理。 |

## 4. 当前文档问题诊断

| 来源 | 问题 | 本步收口 |
|---|---|---|
| Step 7 | 已有 repository 名称，但尚未说明 17 个对象对应的 logical store、唯一键和 version 来源。 | §6、§7 给出 store/index/version contract。 |
| Step 8/9 | DTO 与 flow 已有 result/receipt，但 durable prepare、stored replay、consumer/job append 的原子关系仍需闭合。 | §8～§10 固定同一 local UoW 的写入集合。 |
| Step 10 | `AppliedPendingFinalize`、`ProbeRequired`、`IntegrityUnknown` 等状态需要明确持久化可见性和 retention。 | §7、§9、§11 固定 pending/unknown/terminal 的保存规则。 |
| 上游边界 | Artifact/Workspace/source authority、SDK exact surface、Git mapping、metadata physical schema 仍未确认。 | 全部继续登记为 `SYNC-UP-001~010`，只落 typed seam 和 fail-closed 语义。 |

## 5. 设计取舍

| 议题 | 采用 | 不采用及原因 |
|---|---|---|
| 物理存储 | logical store contract；允许后续 durable adapter 选择文件、嵌入式库或其他本地驱动 | 不在本步写 DDL/JSON 单文件，避免伪造 `SYNC-UP-006` 未确认的 schema。 |
| 版本控制 | `Versioned<T>` + `ExpectedLocalVersion` | 不由 adapter 自行猜 version；不以 cursor/时间戳替代 entity version。 |
| append carrier | proof、transition、result、invocation、provenance relation、observation、delta、receipt、job result 使用 append-only identity | 不 update/delete 历史，不用 mutable row 覆盖 provenance 或 effect boundary。 |
| 外部副作用 | durable prepare → call outside UoW → finalize/probe | 不把 SDK/Git/filesystem call 放进 local UoW 或声称可 rollback。 |
| replay | 同 key + 同 digest 读取原始 stored result/receipt/report | 不从 current truth、日志、cache、ACK 或重新扫描重建结果。 |
| projection/outbox | L5-sync 没有 outbound event/outbox truth；status/diagnostic 只读 local stores | 不复制 Governance outbox/projection truth，不把 derived view 当 owner truth。 |
| provenance | append、protect、supersede、`IntegrityUnknown`；旧 generation 和 parent 永久可追溯 | 不删除、伪造、从字符串或 Git commit 补 provenance。 |

## 6. 数据所有权实现表

| logical record | owner feature | 写入入口 | 读取入口 | 一致性与边界 |
|---|---|---|---|---|
| `SyncSelection` | `selection_access` | mutation entry factory；append once | mutation/query context | immutable local intent；Project/Version/Source 只保存 typed ref。 |
| `SyncOperation` | `selection_access/orchestration` | all 10 Commands；consumer/job conservative transition | operation query、resume/cancel、replay | mutable state + `OperationTransitionRef`；terminal history retained。 |
| `AccessEvaluation` | `selection_access` | shared eligibility gate、invalidation/stale job | access query、mutation guard | `outcome` 与 `freshnessState` 同步收紧；不拥有 owner permission。 |
| `ExternalOwnerSnapshot` | `selection_access` | owner read result、invalidation/stale job | access/status/handoff guard | body-free ref/version/digest；Fresh 不能由本地恢复。 |
| `WorkingCopyBinding` | `working_copy_metadata` | clone/migrate/rebind finalization | binding/status/mutation guard | generation + selection/target relation；旧 binding 不覆盖。 |
| `MetadataManifest` | `working_copy_metadata` | clone/migrate/integrity scan | health/status/mutation guard | schema/generation/ref closure；corrupt/unknown 只能更保守。 |
| `CursorState` | `working_copy_metadata` | clone/pull finalization、source invalidation | materialization/status/incremental guard | observed cursor 与 applied cursor 分开；gap/unknown 不前进。 |
| `MappingSet` | `working_copy_metadata` | clone/pull/resolution finalization | plan/status/path guard | generation-bound mapping；不可由路径字符串重建。 |
| `MaterializationPlan` | `source_materialization` | clone/pull/replan | run/resume/status | validated plan 只消费一次；invalidated/consumed 仍可读。 |
| `PathChangeSet` | `source_materialization` | source delta comparator / manual bounded input | pre-apply/conflict/status | canonical relative paths + safety state；不保存文件正文。 |
| `MaterializationRun` | `source_materialization` | clone/pull/resume | status/recovery | `Prepared/AppliedPendingFinalize` 是 crash boundary；只 Finalized 才能推进 cursor/mapping。 |
| `ConflictRecord` | `conflict_recovery` | detection、invalidation、path/manual guard | conflict list/get/resume | conflict fact 与 resolution intent 分离；不自动选边。 |
| `RecoveryCheckpoint` | `conflict_recovery` | every external/local effect prepare | resume/probe/cancel/status | fingerprint/generation/attempt relation；ProbeRequired 不能重放 submit。 |
| `ManualResolution` | `conflict_recovery` | explicit record-resolution command | resume/conflict query | actor intent only；Recorded/Validated 不等于 Applied。 |
| `ProbeRecord` | `conflict_recovery` | explicit probe command/job | probe/status/replay | 绑定 prior `ExternalAttemptRef`；append probe history。 |
| `ReviewCandidate` | `review_handoff_provenance` | push-review candidate evaluation/freeze | handoff/status/query | local candidate digest/scope；不是 Artifact/Baseline。 |
| `HandoffAttempt` | `review_handoff_provenance` | push-review prepare/call/finalize/probe | handoff status/resume/decision consumer | transport、external pending、owner decision 分层；ACK 不升格。 |
| `ProvenanceRecord` | cross-feature local provenance | every accepted local transition, protection, replacement, degradation | provenance query/audit/guards | append/protect/supersede/integrity-unknown；禁止 delete/fabrication。 |

### 6.1 Technical and replay carriers

| carrier | owner | logical purpose | persistence rule |
|---|---|---|---|
| `EligibilityProofRecord` | `orchestration` | proves Fresh+Eligible same selection/action before dangerous stage | immutable append；与 evaluation/operation transition/provenance 同 UoW。 |
| `LocalTransitionRecord` | `orchestration` | typed operation/metadata state transition history | discriminated union；subject/ref/state family 必须匹配；append-only。 |
| `LocalOperationResultRecord` | `orchestration` | known local result referenced by Completed/Cancelled/FailedKnown | immutable append；先保存 result，再保存引用它的 transition/result surface。 |
| `HandoffInvocationIdentity` / `ProbeInvocationIdentity` | `orchestration` | binds one external call to one attempt/probe | external call 前 durable append；不得复用或跨 variant 读取。 |
| `WorkingCopyObservation` / `SourceDelta` | respective feature | immutable local observation and source delta summary | append-only；body-free、可重放、不能被 Query 隐式保存。 |
| `SyncIdempotencyRecord` | `orchestration` | channel/operation/key/digest reservation and completion | `SyncIdempotencyIdentity(channel,operationName,key)` unique；completion 只指向 typed stored result。 |
| `StoredSyncOperationResult` | `orchestration` | exact duplicate replay of one of 10 Command results | immutable full typed carrier；`completion.commandName` 判别 exact result variant；不得由 current truth重建。 |
| `StoredConsumerReceipt` | `operations/consumers` | exact duplicate replay without inbound body | immutable append；event id 与 key 双唯一。 |
| `StoredSyncJobResult` | `operations/jobs` | exact job report replay | immutable append；(jobName, runRef) 与 (jobName, key) 双唯一。 |
| `SyncDiagnosticSummarySliceSet` | `orchestration` | persisted safe diagnostic read surface | read-only；不从日志/stdout/stderr拼装。 |
| `AdapterCapabilitySnapshot` | `composition/orchestration` | body-free immutable runtime binding context | 每个composition创建一个；mutation首次引用时exact ensure；operation/plan/candidate/attempt引用同一ref；不update/delete或由当前config重建。 |

## 7. Logical store、主键、索引与版本契约

以下是 logical store，不是物理表名要求。durable adapter 可以合并或拆分 store，但必须保持相同 identity、唯一性、typed lookup、版本与 append 语义；`SYNC-UP-006` 未闭合前不规定 `.qs-sync` 文件格式、迁移编号、加密或 retention 实现。

| store | primary / unique key | typed indexes / lookup | version / append |
|---|---|---|---|
| `sync_selections` | `selectionId` | `(projectRef,versionRef,sourceRef,targetRef)` exact context | immutable append；不覆盖 selection。 |
| `sync_operations` | `operationId` | `selectionRef,state`, `correlationRef`, active-by-selection | `LocalEntityVersion`；state update expected version。 |
| `access_evaluations` | `evaluationId` | `(selectionRef,requestedAction)`, freshness/outcome | versioned revision；basis refs immutable after persistence。 |
| `owner_snapshots` | `snapshotId` | `(subjectRef,sourceVersionRef)`, freshness/state | versioned conservative transition；body-free。 |
| `working_copy_bindings` | `bindingId` | selection, canonical target, generation, state | versioned; old binding retained. |
| `metadata_manifests` | `manifestId` | `(bindingRef,generation)`, integrity state | versioned; generation migration creates new identity. |
| `cursor_states` | `cursorStateId` | `(bindingRef,generation)`, continuity state | versioned; applied cursor update only finalize UoW. |
| `mapping_sets` | `mappingSetId` | `(bindingRef,generation)`, integrity state | versioned; mapping entries versioned with set. |
| `working_copy_observations` | `observationId` | binding/target + observedAt cursor | append-only; no overwrite of prior observation. |
| `source_deltas` | `sourceDeltaId` | `(bindingRef,sourceVersionRef,contentFingerprint)` | immutable append; source body excluded. |
| `materialization_plans` | `planId` | operation, binding, state, generation | versioned; active plan lookup typed. |
| `path_change_sets` | `pathChangeSetId` | plan/run, safety state, canonical path refs | versioned revisions; no arbitrary path text. |
| `materialization_runs` | `runId` | operation, plan, state, checkpoint | versioned; pending-finalize retained. |
| `conflict_records` | `conflictId` | operation, binding, state, affected typed refs | versioned; no delete. |
| `recovery_checkpoints` | `checkpointId` | operation active, state, attempt/probe required | versioned; checkpoint history retained. |
| `manual_resolutions` | `resolutionId` | conflict, actor, state | versioned intent record; no effect claim. |
| `probe_records` | `probeId` | prior attempt, state, invocation | versioned; each formal probe has new identity. |
| `review_candidates` | `candidateId` | operation active, binding, state/digest | versioned; candidate eligibility sidecar separately keyed by `evaluationRef`. |
| `candidate_eligibility_evaluations` | `evaluationRef` | candidate, decision kind, digest | immutable append; decision union not mutable state. |
| `handoff_attempts` | `attemptId` | candidate, external handoff ref, state | versioned; external-ref lookup only formal mapping. |
| `provenance_records` | `provenanceId` | subject, parent, state, digest | append/protected transition; no physical delete. |
| `eligibility_proofs` | `proofRef` | selection/action/evaluation and expiry basis | immutable append; missing proof is integrity failure. |
| `local_transition_records` | `transitionRef` | `(subjectKind,subjectRef,occurredAt)`, family | append-only; exact discriminated type. |
| `local_operation_results` | `resultRef` | operation, disposition | immutable append; no overwrite. |
| `external_invocations` | `invocationRef` | invocation kind, attempt/probe ref | append-only; one call identity. |
| `runtime_binding_snapshots` | `snapshotRef` | config/profile refs、exact capability + availability + adapter binding refs | immutable exact ensure；同ref不同内容冲突；无raw config/secret/body；referenced history不删除。 |
| `sync_idempotency_records` | `(channel,operationName,idempotencyKey)` | request digest, state, typed completion/carrier | versioned reservation/complete; command carrier可内联或物理sidecar但必须原子可见；裸 key不可跨入口回放。 |
| `consumer_receipts` | `(consumerName,eventId)`; `(consumerName,idempotencyKey)` | request digest, completedAt | immutable append; raw payload absent. |
| `sync_job_results` | `(jobName,jobRunRef)`; `(jobName,idempotencyKey)` | request digest, result disposition | immutable append; full typed result replay. |

### 7.1 Key and version rules

1. `LocalEntityVersion` is an opaque repository token. It is never generated by a domain object, never inferred from row count, timestamp, cursor, Git commit, request id or retry count.
2. Create paths pass `{ kind: "absent" }`; repository atomically rejects an existing primary/unique key. Update paths pass `{ kind: "version", value: versionFromGetVersioned }`.
3. A typed index returns existing refs only. A missing index row means `not_found`/degraded, not permission to concatenate a ref or create a replacement identity.
4. Append-only records use `IdPort.next(kind)` before the owning UoW; duplicate identity is a typed conflict. Repository never fabricates missing transition, proof, result or provenance records.
5. `SyncIdempotencyRepository`, `ConsumerReceiptRepository` and `SyncJobResultRepository` compare canonical request digest before returning duplicate. Same namespaced identity with different digest is `idempotency_conflict`；不同 channel/operation 的相同 raw key互不冲突。
6. Cursor continuity, source version and metadata generation are domain values, not optimistic entity versions; all three may be stored beside `LocalEntityVersion` but cannot substitute for it.

## 8. Repository callable surface 与函数语义

本节不新增 Step 7 未定义的 Port；它把当前 callable surface 映射到 persistence contract。所有返回均为 `Promise<PortResult<...>>`，除非标记为 pure/read-only。

### 8.1 Shared application stores

| 函数签名 | 语义 | 版本 / UoW | 失败 |
|---|---|---|---|
| `SyncSelectionRepository.get(ref: SyncSelectionRef)` | exact selection 读取 | read-only | `not_found`、repository failure |
| `SyncSelectionRepository.append(selection, uow)` | 写入 immutable selection | create key absent；同 operation UoW | duplicate / repository failure |
| `LocalStateUnitOfWorkPort.begin(context)` | 开启 local metadata UoW | Query 禁止调用；绑定 operation/correlation | begin failure |
| `LocalStateUnitOfWorkPort.commit(uow)` | 提交全部 staged local writes | commit 后不得继续写旧 handle | known failure 或 `outcome_unknown` |
| `LocalStateUnitOfWorkPort.rollback(uow,cause)` | 回滚未提交 local writes | 仅当前 UoW；不回滚外部 effect | rollback failure / commit ambiguity |
| `SyncIdempotencyRepository.get(identity)` | 按 channel+operationName+key读取 reservation/completion | read-only；digest 由 caller 比较 | store unavailable |
| `SyncIdempotencyRepository.reserve(record,uow)` | 原子建立 key+digest reservation | same UoW；existing same digest 返回 duplicate posture | already in progress / digest conflict |
| `SyncIdempotencyRepository.complete(write,result,uow)` | 将 reservation 指向完整 typed result | result 必须已 append/staged；同 UoW | version conflict / missing result |
| `SyncIdempotencyRepository.markOutcomeUnknown(write,result,attempt,checkpoint,uow)` | 保存 external unknown 的完整 command replay carrier与 posture | exact typed result + attempt/checkpoint 同 UoW durable | version conflict / consistency defect |
| `ConsumerReceiptRepository.getByEventId(consumerName,eventId)` / `getByIdempotencyKey(consumerName,key)` | namespaced duplicate read | no write | missing/duplicate store failure |
| `ConsumerReceiptRepository.append(record,uow)` | append body-free receipt | receipt + local transitions + idempotency complete same UoW | duplicate / repository failure |
| `SyncJobResultRepository.getByRun(jobName,runRef)` / `getByIdempotencyKey(jobName,key)` | duplicate job replay | no scan/probe | missing/wrong-kind consistency defect |
| `SyncJobResultRepository.append(record,uow)` | append complete typed report/result | item results complete before append | duplicate / serialization failure |
| `LocalExecutionRecordRepository.appendEligibilityProof/appendTransition/appendLocalResult/appendInvocation(record,uow)` | append technical evidence of local transition/call identity | same UoW as subject revision/provenance; invocation before external call | duplicate / ref mismatch |
| `LocalExecutionRecordRepository.getEligibilityProof/getOperationTransition/getMetadataTransition/getLocalResult/getHandoffInvocation/getProbeInvocation(ref)` | typed replay/guard read | read-only;family mismatch is integrity failure | not_found / cross-family mismatch |
| `RuntimeBindingSnapshotRepository.get/ensure` | exact historical capability/config binding context；不含secret/body/readiness | snapshot与首次引用它的operation revision同UoW ensure；全字段相同可复用，之后只读 | same-ref content conflict / missing / ref mismatch / repository failure |

### 8.2 CP1–CP2 repositories

| repository callable | persistence rule |
|---|---|
| `SyncOperationRepository.getVersioned/listActiveBySelection/save` | `getVersioned` supplies expected version; `save` appends matching `LocalTransitionRecord` and keeps terminal row readable. |
| `AccessEvaluationRepository.getVersioned/findCurrent/save` | current lookup exact `(selectionRef, action)`; save does not append owner body; stale/block transitions and basis refs same UoW. |
| `OwnerSnapshotRepository.getVersioned/listBySubject/listStaleOrInvalidated/save` | owner snapshot body-free; stale scan list is bounded index read; save only known conservative transition. |
| `WorkingCopyBindingRepository.getVersioned/findBySelection/findByTarget/save` | target/selection indexes return existing binding only; rebind creates new identity; versioned save preserves old relation. |
| `MetadataManifestRepository.loadCurrent/getVersioned/listRecordSummaries/saveTransition` | generation and schema refs keyed; summary page is read-only; migration never deletes old manifest. |
| `CursorStateRepository.getVersioned/findCurrent/save` | applied cursor save allowed only in finalization UoW with finalized run and same generation. |
| `MappingSetRepository.getVersioned/findCurrent/listEntries/save` | mapping change set and set version saved together; no path-string reconstruction. |
| `WorkingCopyObservationRepository.get/append/findLatestPersisted` | observation append-only; query `InspectWorkingCopy` must not call append/find as repair. |

### 8.3 CP3–CP5 repositories

| repository callable | persistence rule |
|---|---|
| `MaterializationPlanRepository.getVersioned/findActive/save` | active plan lookup exact operation; `Validated→Consumed` and invalidation versioned; no second apply. |
| `MaterializationRunRepository.getVersioned/listByOperation/findLatestForPlan/save` | `AppliedPendingFinalize` remains visible after crash; only finalize UoW writes `Finalized`. |
| `SourceDeltaRepository.get/append` | immutable body-free source delta; append before plan uses it. |
| `PathChangeSetRepository.getVersioned/save` | safety state and canonical path set versioned; no implicit merge/delete. |
| `ConflictRepository.getVersioned/listOpenByOperation/listByBinding/listAffectedBy/saveTransition` | binding index is typed; conflict remains readable after close/supersede. |
| `RecoveryCheckpointRepository.getVersioned/findActive/listProbeRequired/saveTransition` | checkpoint active index and probe-required index; invalidated checkpoint never resumes in place. |
| `ManualResolutionRepository.getVersioned/listByConflict/save` | actor intent versioned; `Applied` only after owning resume result. |
| `ProbeRecordRepository.getVersioned/findLatestForAttempt/listPending/save` | each probe identity append/revision tied to prior `ExternalAttemptRef`; no submit replay. |
| `ReviewCandidateRepository.getVersioned/findActiveByOperation/listFrozenByBinding/save/appendEligibilityEvaluation/getEligibilityEvaluation` | candidate and eligibility sidecar separate; frozen digest immutable for attempt. |
| `HandoffAttemptRepository.getVersioned/findByExternalHandoffRef/listByCandidate/listProbeRequired/save` | external ref lookup never creates missing attempt; attempt version gates layered update. |
| `ProvenanceRepository.getVersioned/listBySubject/listParents/append/saveProtectedTransition` | graph pages and protected transitions preserve all historical refs; missing parent is integrity error. |
| `SyncStatusReadPort.loadStatusSlices/loadHandoffSlices/loadProvenanceView` | read-only composite source; each slice carries present/missing/restricted/stale/unavailable marker; no repair. |
| `SyncDiagnosticReadPort.loadDiagnosticSummarySlices` | only persisted safe summaries/ref/status; no logs, reports, evidence or readiness. |

### 8.4 External ports are not stores

`OwnerAccessPort`、`MaterialSourcePort`、`WorkingCopyObservationPort`、`FilesystemInspectionPort`、`GitWorktreePort`、`FilesystemApplyPort`、`RecoveryProbePort`、`ReviewHandoffPort` 与 `ReviewDecisionReadPort` 不拥有 durable truth。其 request/result 在 call 前后只通过对应 attempt/checkpoint/snapshot/run/provenance record 保存安全 ref、digest、version、transport layer 或 unknown posture；raw response/body/credential 不可进入任一 store。

## 9. Local UoW 与事务边界矩阵

| flow 类别 | prepare 起点 | 外部/工具阶段 | finalize / commit 必须同 UoW 写入 | rollback / ambiguity |
|---|---|---|---|---|
| pure local command（metadata migration、rebind、record resolution、cancel 的无 effect 分支） | command validation → idempotency reserve → 首次执行exact-ensure current runtime binding snapshot → versioned loads | none；lock 仅 local adapter capability | state revisions、transition、provenance、stored command result、idempotency complete；新operation保留snapshot ref | domain/port error rollback；commit unknown 原 key reload |
| `CloneWorkingCopyFlow` | selection/operation/binding/manifest/cursor/mapping/plan/run/checkpoint/provenance durable prepare | bounded Git/fs stage/apply outside UoW | run `AppliedPendingFinalize→Finalized`、cursor、mapping、manifest/binding、operation result、provenance、stored result、idempotency complete | partial/unknown keeps checkpoint; cursor/mapping unchanged; no overwrite/rollback claim |
| `PullWorkingCopyFlow` | source delta/path/plan/run/checkpoint durable prepare | bounded local apply outside UoW | same-generation run/cursor/mapping/provenance + operation result; plan consumed | gap/dirty/conflict before call no apply; unknown no cursor advance |
| `PushReviewCandidateFlow` | candidate eligibility sidecar, Frozen candidate, Prepared HandoffAttempt/checkpoint/provenance and invocation identity | `ReviewHandoffPort.submitCandidate` outside UoW | attempt transport/unknown/final layer, checkpoint/provenance, stored result/idempotency; owner Decision never written | ACK is transport only; unknown→ProbeRequired; no resubmit |
| `ProbeUnknownOutcomeFlow` / `RefreshReviewHandoffStatusFlow` | probe record/invocation or read marker durable | probe/decision read outside UoW | probe result, attempt/checkpoint/snapshot/provenance, stored result/idempotency | still unknown remains probe-required; no original submit |
| conditional Consumer | validate envelope → receipt/idempotency reserve → resolve typed target | none; source event is input, not local effect | conservative local states, provenance, receipt, stored completion, idempotency complete | invalid/ambiguous quarantine; commit unknown replay same key |
| maintenance Job | job idempotency reserve → bounded target list | only `RecoveryProbePort` for probe job; no submit | per-item state/result, complete `StoredSyncJobResult`, idempotency complete | item conflict/unknown explicit; duplicate replays report; no auto repair |
| Query | validate visibility → read ports | optional read-only FS/Git observation for inspect query | none | missing/degraded returned; no rollback/write |

### 9.1 Atomic visibility rules

1. `MaterializationRun.Finalized`, applied `CursorState`, finalized `MappingSet`, changed `MetadataManifest`/`WorkingCopyBinding` and root `ProvenanceRecord` are visible as one local commit. Before commit, none may be presented as applied/complete by Query.
2. `HandoffAttempt`/`ProbeRecord` invocation identity and `RecoveryCheckpoint` prepare are visible before the possible external call; this is intentional durable prepare, not success.
3. `LocalOperationResultRecord` must be visible in the same commit as any `SyncOperation.Completed/Cancelled/FailedKnown` transition that references it.
4. `StoredSyncOperationResult`/`StoredConsumerReceipt`/`StoredSyncJobResult` and idempotency completed/outcome-unknown posture are visible together. A terminal replay posture without its exact typed carrier is a consistency defect, not a replayable result.
5. Provenance append/protect/supersede and its referencing local state revision are committed together; old generation/parent records remain readable.
6. Query/view mappers must distinguish staged-but-uncommitted from committed records; no cache may expose uncommitted state.
7. A newly created `SyncOperation` and the exact-ensured current `AdapterCapabilitySnapshot` are visible in the same initial commit. Multiple operations in one runtime composition may reference the same immutable snapshot. Any `MaterializationPlan`、`ReviewCandidate`、`HandoffAttempt` created for an operation carries that same snapshot ref; same-ref content mismatch or missing snapshot is a consistency defect.

### 9.2 Commit ambiguity reload protocol

```text
local commit returns known success
  -> return stored typed result
local commit returns known failure
  -> rollback/return known failure; no external claim
local commit status unknown
  -> do not retry effect or change key
  -> reload idempotency(key,digest), stored result, operation/attempt/checkpoint versions
  -> duplicate + complete carrier => replay exact carrier
  -> reservation in-flight/unknown => return OutcomeUnknown/NeedsAction
  -> carrier missing or mismatched => ConsistencyDefect/manual intervention
```

`LocalStateUnitOfWorkPort.commit` 的 unknown 不得用日志、文件时间、cache、Git status、HTTP ACK 或 retry count 解析为 success/failure；只允许正式 repository read/probe 关闭不确定性。

## 10. Flow consistency and failure matrix

| 场景 | 允许写入 | 不允许写入/解释 | 后续动作 |
|---|---|---|---|
| domain invalid transition | none in current UoW | 不写 accepted result、provenance 或 state | typed `invalid_transition` / rollback |
| version conflict | none from stale revision；可保存安全失败结果按 flow | 不覆盖新版本、不重算外部 effect | reload + Step 13 policy；否则 needs-action |
| duplicate known | replay carrier only | 不重跑 domain、source、Git/fs、handoff、probe 或 job scan | return exact stored result |
| duplicate unknown/in-flight | no new effect | 不盲重放 submit/apply | return probe-required/delayed |
| source comparator/cursor gap | checkpoint/conflict/operation needs-action | 不推进 cursor/mapping | explicit replan/rebind/manual |
| dirty/path conflict | conflict/checkpoint/provenance if contract allows | 不覆盖、stash、merge、rebase、删除用户修改 | manual resolution + new resume |
| local apply partial/unknown | run Partial/OutcomeUnknown + checkpoint | 不 Finalized，不 advance cursor/mapping | probe/recover/manual |
| handoff ACK/HTTP 2xx | transport layer/attempt result | 不写 Review accepted/Gate/Decision | owner read/probe later |
| missing provenance parent/digest | `IntegrityUnknown` marker if owning flow permits | 不补造 parent/digest、不删除记录 | block dependent mutation/manual repair |
| Query missing/stale | read disposition only | 不 save/refresh/probe/repair | caller re-query or explicit command |
| Consumer invalid/ambiguous | optional body-free receipt/quarantine marker only | 不保存 raw payload、不自动 pull/handoff | reject/quarantine/retry per later error contract |
| Job item failure | typed item failure + stored report | 不把 batch completed 当 all-resolved | rerun explicit scope/key after Step 13 |

### 10.1 Cross-record invariants

| invariant | required local commit |
|---|---|
| operation transition | operation revision + exact `LocalTransitionRecord` + provenance |
| binding/manifest generation change | new generation objects + old protected refs + metadata transition |
| materialization finalization | run + cursor + mapping + path/plan relation + provenance + local result |
| conflict resolution | validated resolution + conflict transition; effect only later owning resume |
| handoff external call | Prepared attempt + invocation identity + checkpoint before call; known/unknown finalize after call |
| probe | ProbeRecord + ProbeInvocationIdentity before probe; attempt/checkpoint/provenance update after result |
| consumer accepted | conservative target transitions + provenance + receipt + idempotency completion |
| job completed | complete typed per-item report + stored job result + idempotency completion |
| runtime binding capture | immutable capability snapshot + new operation revision/initial transition；later plan/candidate/attempt reuse exact ref |

## 11. No-write / retention / forbidden persistence rules

| 规则 | 约束 |
|---|---|
| Query no-write | 13 Query 不 begin UoW、不 reserve idempotency、不 append observation/diagnostic、不修复 metadata、不 probe、不 mark state。 |
| Consumer no escalation | Consumer 只能收紧本地 snapshot/evaluation/plan/candidate/cursor；不 pull/apply/push/merge/rebase/stash。 |
| Job no repair | 三个 Job 只做 integrity classification、formal probe、stale marking；不 migrate/rebind/auto pull/submit。 |
| no external truth ownership | 不创建 Project/Artifact/Baseline/Gate/Decision/Workspace/Archive/Git remote record。 |
| no raw body | 外部正文、credential、stdout/stderr、报告/evidence 内容不得进入 `.qs-sync` logical store。 |
| provenance retention | parent、superseded、protected、integrity-unknown 记录保留；删除/静默重写/伪造均非法。 |
| runtime binding retention | operation/plan/candidate/attempt所引用的snapshot保留；不得因config reload或cleanup删除/改写，也不得从当前binding重建。 |
| old generation retention | migration/rebind 建新 generation/identity；旧 manifest/binding/cursor/mapping/provenance 只可标记保守状态，不能覆写或物理删除。 |
| ACK boundary | transport ACK、HTTP 2xx、Git local commit、stored upload marker 均不是 review accepted 或 Artifact/Baseline。 |
| no outbound event truth | 不新增 outbox/event topic；若上游后来要求平台事件，必须回到架构/协议 Step 重新授权。 |

## 12. 回填草稿

> 校准来源：
> - `projects/L5-sync/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
>
> 延伸阅读：
> - 本文件 §6 “数据所有权实现表”、§7 “Logical store”、§8 “Repository callable surface”、§9 “Local UoW”、§10 “一致性矩阵”、§11 “禁止持久化规则”。

### 正式 §10 摘录草稿

L5-sync 的持久化边界仅覆盖 local sync truth 与受控 replay/provenance metadata。17 个 lifecycle object 各有 feature-owned logical store；Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote 和 owner/source truth 只以 ref、version、digest、body-free snapshot 或 layered result 参与。所有 mutable record 先 `getVersioned` 再以 repository version 保存；创建使用 `ExpectedLocalVersion.absent`，append-only carrier 使用 `IdPort` 生成 identity。

所有 accepted local mutation、consumer conservative transition、job item marker、proof/transition/result/invocation/provenance append 与 idempotency/result completion均在 `LocalStateUnitOfWork` 内。SDK/Git/filesystem effect 位于 UoW 外，严格执行 durable prepare→external call→known finalize 或 `OutcomeUnknown/ProbeRequired`。Clone/Pull 最终只有 run、cursor、mapping、manifest/binding、provenance 和 local result 在同一提交中共同可见；Query 永不写入或修复。

L5-sync 没有 outbound event/outbox truth。`StoredConsumerReceipt` 和 `StoredSyncJobResult` 只用于同 key 同 digest 的 exact replay；ACK/HTTP 2xx/Git commit 不代表 Artifact/Baseline/Review accepted。commit status unknown 只能通过原 key/digest reload idempotency、stored result、attempt/checkpoint 和 version 来收束；不得换 key 盲重放或从日志/cache/当前 truth重建结果。旧 generation、parent、superseded/protected/integrity-unknown provenance 全部保留。

## 13. 待确认事项

| ID | 待确认事项 | 当前影响 | 未确认前口径 |
|---|---|---|---|
| `SYNC-UP-001` | L0-sdk precise surface、error/version contract | owner/source/handoff positive adapter 不锁 | 仅 typed capability，unknown/blocked fail-closed。 |
| `SYNC-UP-002` | Artifact/Workspace materialization source authority | source delta/cursor comparator 不锁 | 不承诺 pull/clone positive path。 |
| `SYNC-UP-003` | permission/archive posture | Eligible/archived actions 不锁 | denied/blocked/unknown，不本地授权。 |
| `SYNC-UP-004` | Review handoff/Decision contract | ACK→Decision 不可闭合 | 仅 layered attempt/probe/ref。 |
| `SYNC-UP-005` | unknown/idempotency/probe equivalence | 不盲 replay | durable prepare + probe-required。 |
| `SYNC-UP-006` | `.qs-sync` physical schema/migration/retention | store shape/DDL 不锁 | logical contract only。 |
| `SYNC-UP-007` | Git/platform mapping | remote truth/tool mapping 不锁 | local observation/apply bounded only。 |
| `SYNC-UP-008` | cursor/comparator/gap | incremental finalize 不锁 | gap/unknown/unsupported fail-closed。 |
| `SYNC-UP-009` | LFS/shallow/GUI support | historical choices 不承诺 | pending/historical，不写实现选型。 |
| `SYNC-UP-010` | dirty/path/manual resolution contract | exact apply semantics 不锁 | no overwrite；manual/needs-action。 |
| `SYNC-LOCAL-001~005` | Node/package/parser/validator/test/Git tool/SDK dependency choices | runtime/physical adapter 不锁 | implementation remains planned/not_created。 |

## 14. 跨 Step 6～10 闭环审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 17 lifecycle object 是否各有 logical store/version/index | pass_with_blockers | 所有 17 object 已列；physical metadata 受 `SYNC-UP-006` 阻塞。 |
| Step 7 repository callable surface 是否一一承接 | pass | 未新增未授权 repository；typed get/list/save/append 语义补齐。 |
| LocalTransitionRecord 是否覆盖当前已有 transition | pass_with_blockers | operation 与 metadata manifest/binding 已有 union；cursor/mapping/plan/run 等对象的最终状态与 subject revision通过 owner store + provenance/result atomic set保存；若需独立 transition history，必须先回 Step 6/7 扩充 union，不能由实现者隐式新增。 |
| version 来源是否闭合 | pass | `Versioned<T>`/`ExpectedLocalVersion` 唯一来源；cursor/generation/source version 不替代。 |
| proof/result/invocation append 是否闭合 | pass | 与 subject/provenance 同 UoW；external call 前 invocation durable。 |
| Query no-write | pass | read ports 不含 UoW/write/probe。 |
| Consumer/job replay | pass | receipt/job result 与 idempotency completion 同 UoW，raw payload 不保存。 |
| run/cursor/mapping/provenance atomic visibility | pass | only finalization commit exposes applied state。 |
| commit ambiguity | pass | original key/digest reload；missing carrier=consistency defect；no blind replay。 |
| provenance/old generation retention | pass | append/protect/supersede/integrity-unknown；无 delete/fabrication。 |
| no outbound event truth | pass | 未引入 Governance outbox/topic；本地 receipt/job result 不外溢。 |

## 15. 进入 Step 12 条件与停审记录

- [x] 数据所有权、logical store、primary/unique/index、version 来源均已明确。
- [x] 17 个 lifecycle object 与 technical replay carrier 的存储边界已闭合。
- [x] Repository callable surface、expected version、append-only 与 typed index 语义已回指 Step 7。
- [x] 29 条 flow 的 local UoW、external effect、prepare/finalize、commit ambiguity 已有矩阵。
- [x] Query no-write、consumer/job no escalation、ACK≠Decision、provenance retention 与旧 generation 保留已明确。
- [x] 未写物理 DDL、实现代码、测试结果、artifact/report/evidence/review/signoff/readiness。
- [x] `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 仍为 pending/blocked。

结论：Step 11 `completed / stop_review`，`gate_status=pass_with_upstream_blockers`。允许进入 Step 12；正式 03 仍不可写。
