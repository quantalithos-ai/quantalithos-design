# Step 8. 定义 API / Command / Query / Event / Job 协议契约

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节：未来正式 `03-详细设计.md` §7 协议契约与 §6 全局 API 索引
- 框架参考：`projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md`；采用 shared envelope→逐协议族→逐协议 schema→停审→public surface 审计粒度，不复制 Governance 协议或 outbound event 模型。
- 前序门禁：Step 7 已完成全部已识别 repository/port callable surface 及 adapter/entry 审计；精确接口数量不作为稳定合同，以 Step 7 当前命名清单为准。

### 1.1 分批写入状态

| 批次 | 协议族 | 内容 | 状态 |
|---|---|---|---|
| 8.0 | shared | inventory、envelope、secondary types、error/page/result | completed |
| 8.1 | Commands | 10 个 mutation/maintenance/recovery 协议 | completed |
| 8.2 | Queries | 13 个 no-write 协议与 view/page schema | completed |
| 8.3 | Inbound Consumers | 3 个 conditional/blocked envelope/payload/receipt | completed |
| 8.4 | Outbound Events | applicability decision | completed / not_applicable |
| 8.5 | Operations Jobs | 3 个 job input/output/report | completed |
| 8.6 | final audit | DTO→object/port/flow、public type、body/secret/provenance | completed |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| 正式 02 §7 | 10 Commands、13 Queries、3 Consumers、3 Jobs、Outbound not applicable 的稳定主语。 |
| `03_ddd_step_06_object_contracts.md` | DTO 必须能构造/读取的对象、state/ref/reason/view types。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | port、page、version、stored result、consumer/job seam。 |
| 正式 02 §8/§10 | 后续 flow 与异常姿态，确保结果能表达 blocked/conflict/unknown/partial。 |
| `L1-governance` Step 8 | field-level DTO、secondary public type、receipt/report、协议族停审框架。 |

## 3. SOP 问题回答

1. **有哪些协议？** 10 Commands、13 Queries、3 conditional Inbound Consumers、0 Outbound Events、3 Operations Jobs。
2. **传输方式？** 当前只锁 package/library operation name 与 CLI semantic route；HTTP/RPC/topic/cron 均未授权。四 P0 CLI verbs 为 `clone/pull/status/push-review`；binary/flags/exit code pending。
3. **actor/metadata 从哪里来？** entry 注入 envelope；body 不重复承载 actor/credential。Actor ref 只作 local correlation/redaction，不能替代 owner authorization。
4. **幂等适用性？** Commands/Consumers/Jobs 必需；Queries 不带 idempotency key。unknown external attempt 的 duplicate 返回 probe-required，不重放。
5. **query empty/degraded 如何表达？** `QueryReadDisposition` 区分 `complete/partial/missing/not_visible/blocked/unavailable`；view slice 还带 freshness/observedAt/reasons，missing 不等于 clean/empty。
6. **二级公开类型如何闭合？** §7 给出 envelope、selection/path scope、result layer、view slice、page、receipt/job report 的字段级 schema；不使用 `any`/opaque provider map。
7. **consumer 为什么仍定义？** 只定义 formal contract 成立后的 public shape与 blocked composition disposition，不声明 topic/subscription 已存在。
8. **Outbound Event？** `not_applicable`；本地 operation/metadata/conflict/handoff 不广播为平台事实，不创建 outbox/topic/delivery truth。
9. **错误如何映射？** Validation/NotFound/Conflict/Blocked/Unsupported/Unavailable/OutcomeUnknown/InternalSafe 七类；raw provider/tool error 永不公开。

## 4. 当前文档问题诊断

概要只给 typed input/output 名称。若不在本步闭合字段，实施者会猜 CLI flags、从目录/Git补 selection、用单一 success 压平 local/transport/Decision，或让 query 遇 missing 时返回 clean。本步用 transport-neutral DTO 固定语义，同时保留 parser、wire serialization、provider schema 和 exit code 的后续选择空间。

## 5. 改动前后对比

| 项 | 概要骨架 | Step 8 |
|---|---|---|
| CLI | verb→use case | parser-neutral DTO、显式选择、result/error/disposition；flags/exit code仍 pending。 |
| Commands | 名称与结果类型 | field-level body/result、idempotency/actor/meta、blocked/unknown。 |
| Queries | view 名称 | slice/page/freshness/visibility/degraded schema与 no-write boundary。 |
| Consumer/Job | typed 名称 | envelope/version/digest/dedup/receipt/report/duplicate surface。 |
| Review result | handoff result | local/transport/probe/external Decision 四层，绝不单一 accepted。 |

## 6. 协议 inventory

### 6.0 Exact protocol name and command-result unions

```ts
export type SyncCommandName =
  | "CloneWorkingCopy"
  | "MigrateSyncMetadata"
  | "RebindWorkingCopy"
  | "PullWorkingCopy"
  | "RecordConflictResolution"
  | "ResumeSyncOperation"
  | "ProbeUnknownOutcome"
  | "CancelSyncOperation"
  | "PushReviewCandidate"
  | "RefreshReviewHandoffStatus";

export type SyncQueryName =
  | "GetAccessEvaluation"
  | "GetSyncOperation"
  | "GetWorkingCopyBinding"
  | "GetMetadataHealth"
  | "InspectWorkingCopy"
  | "GetMaterializationStatus"
  | "GetConflict"
  | "ListConflicts"
  | "GetRecoveryStatus"
  | "GetSyncStatus"
  | "GetReviewHandoffStatus"
  | "GetProvenance"
  | "GetSyncDiagnosticSummary";

export type SyncInboundConsumerName =
  | "ConsumeAccessOrPostureInvalidated"
  | "ConsumeMaterialSourceInvalidated"
  | "ConsumeReviewDecisionChanged";

export type SyncInboundEventName =
  | "AccessOrPostureInvalidated"
  | "MaterialSourceInvalidated"
  | "ReviewDecisionChanged";

export type SyncJobName =
  | "ScanMetadataIntegrity"
  | "ProbePendingHandoffAttempts"
  | "MarkStaleOwnerSnapshots";

export type SyncCommandProtocolResult =
  | { readonly commandName: "CloneWorkingCopy"; readonly result: CloneWorkingCopyResult }
  | { readonly commandName: "MigrateSyncMetadata"; readonly result: MetadataMigrationResult }
  | { readonly commandName: "RebindWorkingCopy"; readonly result: WorkingCopyRebindResult }
  | { readonly commandName: "PullWorkingCopy"; readonly result: PullWorkingCopyResult }
  | { readonly commandName: "RecordConflictResolution"; readonly result: ConflictResolutionResult }
  | { readonly commandName: "ResumeSyncOperation"; readonly result: ResumeSyncOperationResult }
  | { readonly commandName: "ProbeUnknownOutcome"; readonly result: ProbeUnknownOutcomeResult }
  | { readonly commandName: "CancelSyncOperation"; readonly result: CancelSyncOperationResult }
  | { readonly commandName: "PushReviewCandidate"; readonly result: PushReviewCandidateResult }
  | { readonly commandName: "RefreshReviewHandoffStatus"; readonly result: ReviewHandoffRefreshResult };
```

这些 exact unions 是 handler routing、idempotency namespace、stored result kind validation 与全局协议索引的唯一名称集合。`SyncCommandProtocolResult` 用 `commandName` 判别具体 result，不得靠结构相似字段猜 variant。Event name 与 Consumer name 不得互换；Outbound Event 仍为 `not_applicable`。

### 6.1 Commands

| Operation | Request body | Result | 主责 | CLI semantic route | Step 9 flow |
|---|---|---|---|---|---|
| `CloneWorkingCopy` | `CloneWorkingCopyRequest` | `CloneWorkingCopyResult` | CP2 | `clone` | independent |
| `MigrateSyncMetadata` | `MigrateSyncMetadataRequest` | `MetadataMigrationResult` | CP2 | maintenance/TBD | independent |
| `RebindWorkingCopy` | `RebindWorkingCopyRequest` | `WorkingCopyRebindResult` | CP2 | maintenance/TBD | independent |
| `PullWorkingCopy` | `PullWorkingCopyRequest` | `PullWorkingCopyResult` | CP3 | `pull` | independent |
| `RecordConflictResolution` | `RecordConflictResolutionRequest` | `ConflictResolutionResult` | CP4 | recovery/TBD | independent |
| `ResumeSyncOperation` | `ResumeSyncOperationRequest` | `ResumeSyncOperationResult` | CP4 | recovery/TBD | independent |
| `ProbeUnknownOutcome` | `ProbeUnknownOutcomeRequest` | `ProbeUnknownOutcomeResult` | CP4 | recovery/TBD | independent |
| `CancelSyncOperation` | `CancelSyncOperationRequest` | `CancelSyncOperationResult` | CP4 | recovery/TBD | independent/common local flow |
| `PushReviewCandidate` | `PushReviewCandidateRequest` | `PushReviewCandidateResult` | CP5 | `push-review` | independent |
| `RefreshReviewHandoffStatus` | `RefreshReviewHandoffStatusRequest` | `ReviewHandoffRefreshResult` | CP5 | recovery/TBD | independent |

### 6.2 Queries

| Operation | Request | Response view/page | 主责 |
|---|---|---|---|
| `GetAccessEvaluation` | `GetAccessEvaluationRequest` | `AccessEvaluationView` | CP1 |
| `GetSyncOperation` | `GetSyncOperationRequest` | `SyncOperationView` | CP1 |
| `GetWorkingCopyBinding` | `GetWorkingCopyBindingRequest` | `WorkingCopyBindingView` | CP2 |
| `GetMetadataHealth` | `GetMetadataHealthRequest` | `MetadataHealthView` | CP2 |
| `InspectWorkingCopy` | `InspectWorkingCopyRequest` | `WorkingCopyObservationView` | CP2 |
| `GetMaterializationStatus` | `GetMaterializationStatusRequest` | `MaterializationStatusView` | CP3 |
| `GetConflict` | `GetConflictRequest` | `ConflictView` | CP4 |
| `ListConflicts` | `ListConflictsRequest` | `SyncPageResponse<ConflictView>` | CP4 |
| `GetRecoveryStatus` | `GetRecoveryStatusRequest` | `RecoveryStatusView` | CP4 |
| `GetSyncStatus` | `GetSyncStatusRequest` | `SyncStatusView` | CP5 aggregate read |
| `GetReviewHandoffStatus` | `GetReviewHandoffStatusRequest` | `LayeredHandoffStatus` | CP5 |
| `GetProvenance` | `GetProvenanceRequest` | `SyncPageResponse<ProvenanceView>` | CP5 |
| `GetSyncDiagnosticSummary` | `GetSyncDiagnosticSummaryRequest` | `SyncDiagnosticSummaryView` | CP5 |

### 6.3 Consumers / events / jobs

| 类别 | 协议 | 当前状态 |
|---|---|---|
| Inbound Consumer | `ConsumeAccessOrPostureInvalidated`、`ConsumeMaterialSourceInvalidated`、`ConsumeReviewDecisionChanged` | `planned/blocked` pending formal source/schema/topic |
| Outbound Event | none | `not_applicable`; no outbox/topic/delivery state |
| Operations Job | `ScanMetadataIntegrity`、`ProbePendingHandoffAttempts`、`MarkStaleOwnerSnapshots` | planned protocol only; no scheduler/run |

## 7. Shared protocol helpers

### 7.1 Command / Query envelope

```ts
/** Trusted inbound boundary 注入的本地主体语境；credentialRef 不是 secret。 */
export interface ActorContext {
  readonly principalRef: PrincipalRef;
  readonly actorRef: ActorRef;
  readonly credentialRef: Optional<CredentialRef>;
}

export interface CommandMetadata {
  readonly correlationRef: CorrelationRef;
  readonly requestRef: ClientRequestRef;
  readonly requestedAt: ObservedAt;
}

export interface QueryMetadata {
  readonly correlationRef: CorrelationRef;
  readonly requestedAt: ObservedAt;
  readonly redactionPolicyRef: RedactionPolicyRef;
}

export interface SyncCommandRequest<T> {
  readonly operation: SyncCommandName;
  readonly actor: ActorContext;
  readonly metadata: CommandMetadata;
  readonly idempotencyKey: IdempotencyKey;
  readonly body: T;
}

export interface SyncQueryRequest<T> {
  readonly operation: SyncQueryName;
  readonly actor: ActorContext;
  readonly metadata: QueryMetadata;
  readonly body: T;
}
```

Credential secret/body 不得进入 DTO；`credentialRef` 仅供 SDK adapter 向正式 secret/credential facility 解引用。Command body 中若有 `principalRef`，必须等于 actor principal；Query 不携带 idempotency key。

### 7.2 Explicit selection、scope 与 page

```ts
/** mutation request 必须显式提供的 platform/source/local context。 */
export interface ExplicitSyncSelectionDto {
  readonly projectRef: ProjectRef;
  readonly versionRef: VersionRef;
  readonly sourceRef: MaterialSourceRef;
  readonly targetRef: LocalTargetRef;
}

/** 只能收窄 candidate/change scope 的 canonical relative path selector。 */
export interface PathScopeDto {
  readonly include: ReadonlyArray<CanonicalRelativePathRef>;
  readonly exclude: ReadonlyArray<CanonicalRelativePathRef>;
}

export interface SyncPageRequest {
  readonly cursor: Optional<PublicPageCursor>;
  readonly limit: number;
}

export interface SyncPageInfo {
  readonly nextCursor: Optional<PublicPageCursor>;
  readonly returnedCount: number;
}

export interface SyncPageResponse<T> {
  readonly disposition: QueryReadDisposition;
  readonly items: ReadonlyArray<T>;
  readonly page: SyncPageInfo;
  readonly degradedReasons: StatusDegradedReasonSet;
}
```

`PublicPageCursor` opaque且只映射 Step 7 repository cursor；不得当 entity/source cursor/version。空 `include` 的语义必须由各 command 指明，不得默认“全仓”；路径在 entry 只作语法校验，canonical root/symlink guard由 filesystem port。

### 7.3 Command result layers

```ts
export type CommandDisposition =
  | "completed_known" | "no_op_known" | "needs_action" | "conflict"
  | "blocked" | "cancelled" | "failed_known" | "outcome_unknown";

export interface SyncCommandResultBase {
  readonly operationRef: SyncOperationRef;
  readonly runtimeBindingSnapshotRef: RuntimeBindingSnapshotRef;
  readonly disposition: CommandDisposition;
  readonly blockerSet: SyncBlockerSet;
  readonly nextActionSet: SafeNextActionSet;
  readonly checkpointRef: Optional<RecoveryCheckpointRef>;
  readonly conflictRef: Optional<ConflictRecordRef>;
  readonly provenanceRefs: ProvenanceRecordRefSet;
}

export interface HandoffResultLayersDto {
  readonly runtimeBindingSnapshotRef: Optional<RuntimeBindingSnapshotRef>;
  readonly candidateState: Optional<ReviewCandidateStateView>;
  readonly localAttemptState: Optional<HandoffAttemptStateView>;
  readonly transportState: Optional<TransportOutcomeView>;
  readonly probeState: Optional<ProbeRecordStateView>;
  readonly externalDecisionState: Optional<ExternalDecisionStateView>;
}
```

不存在 top-level `success/accepted/approved`。`completed_known` 只在 owning local use case 已知终局；push-review 的 result 还必须看四层 handoff fields。

### 7.4 Query views 与 slice marker

```ts
export type QueryReadDisposition =
  | "complete" | "partial" | "missing" | "not_visible" | "blocked" | "unavailable";

export type ViewSlice<T> =
  | { readonly kind: "present"; readonly value: T; readonly freshness: FreshnessState; readonly observedAt: ObservedAt }
  | { readonly kind: "missing"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "not_visible"; readonly subjectRef: OpaqueRef<string>; readonly reason: VisibilityReason }
  | { readonly kind: "unavailable"; readonly subjectRef: OpaqueRef<string>; readonly safeSummary: SafeFailureSummary };

export interface SyncQueryResponse<T> {
  readonly disposition: QueryReadDisposition;
  readonly view: Optional<T>;
  readonly degradedReasons: StatusDegradedReasonSet;
  readonly correlationRef: CorrelationRef;
}
```

Query response 禁止借 `unavailable/missing` 返回 empty clean view；`not_visible` 不泄漏对象存在性之外的字段。即时 `InspectWorkingCopy` 可调用 read-only Git/fs observation ports，但不持久化、不加写锁。

### 7.5 Protocol error surface

| error kind | 必需字段 | 对 Command | 对 Query | 禁止泄漏 |
|---|---|---|---|---|
| `validation` | field path、stable reason code | reject before operation/UoW where possible | reject | raw input/credential |
| `not_found` | safe subject kind/ref | failed-known or response error | `missing`/not-visible according visibility | store key/schema |
| `conflict` | conflict/checkpoint refs、safe code | needs-action/conflict | view state only | file body/diff正文 |
| `blocked` | blocker set、next actions | blocked | blocked/partial | private owner reason/body |
| `unsupported` | capability | blocked | degraded | tool/provider internals |
| `unavailable` | capability、safe summary | failed-known or unknown depending effect boundary | unavailable/partial | raw exception/stdout/stderr |
| `outcome_unknown` | durable attempt/checkpoint refs | outcome-unknown/probe-required | not applicable to pure query | retry claim |
| `internal_safe` | correlation ref、stable code | failed-known only if effect known; otherwise unknown | unavailable | stack/path/secret |

精确 error code、CLI exit code、retry recommendation 由 Step 12/14；本步禁止实现者用 transport exception 猜 effect 未发生。

## 8. Command 协议

### 8.1 Command 定义批次表

| 协议 | 目标对象 | 核心 ports | blocker | 停审 |
|---|---|---|---|---|
| Clone/Pull | Operation/Binding/Manifest/Plan/Run/Cursor/Mapping/Provenance | owner/source/metadata/Git/fs/UoW | `001/002/003/006/007/008/010` | pass_with_blockers |
| Migrate/Rebind | Binding/Manifest/Provenance | metadata/fs/UoW | `006/010` | pass_with_blockers |
| Resolution/Resume/Probe/Cancel | Conflict/Resolution/Checkpoint/Probe/Operation | repositories/probe/UoW | `004/005/010` | pass_with_blockers |
| Push/Refresh | Candidate/Attempt/Probe/Snapshot/Provenance | handoff/decision/probe/UoW | `001/004/005/006` | pass_with_blockers |

以下每个 operation 的 library handler 签名统一为：

```ts
handle(request: SyncCommandRequest<SpecificRequest>): Promise<SyncProtocolResult<SpecificResult>>
```

`SyncProtocolResult<T>` 为 `{kind:"ok",response:T}` 或 `{kind:"error",error:SyncProtocolError}`；Command 的 expected business blockers/unknown 优先进入 typed result disposition，envelope/schema/authority/internal boundary 错误进入 protocol error。

### 8.2 `CloneWorkingCopy`

```ts
export interface CloneWorkingCopyRequest {
  readonly selection: ExplicitSyncSelectionDto;
  readonly initialPathScope: PathScopeDto;
  readonly expectedEmptyOrCompatibleTarget: true;
}
export interface CloneWorkingCopyResult extends SyncCommandResultBase {
  readonly bindingRef: Optional<WorkingCopyBindingRef>;
  readonly manifestRef: Optional<MetadataManifestRef>;
  readonly runRef: Optional<MaterializationRunRef>;
  readonly appliedCursorRef: Optional<SourceCursorRef>;
}
```

字段映射：actor principal + selection→`SyncSelection`; local ID/correlation→`SyncOperation`; target canonicalization→binding；source delta→plan/run；finalized path only→cursor/mapping/provenance。缺 project/version/source/target 或空 scope 未获“全量”明确语义时 validation reject。成功上限是 local Finalized working copy，不是 Artifact/Baseline。

### 8.3 `MigrateSyncMetadata`

```ts
export interface MigrateSyncMetadataRequest {
  readonly targetRef: LocalTargetRef;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly expectedGeneration: MetadataGeneration;
  readonly targetSchemaRef: MetadataSchemaRef;
}
export interface MetadataMigrationResult extends SyncCommandResultBase {
  readonly priorManifestRef: MetadataManifestRef;
  readonly newManifestRef: Optional<MetadataManifestRef>;
  readonly newGeneration: Optional<MetadataGeneration>;
}
```

只允许 explicit command；target schema 必须在正式 support/migration contract中。`SYNC-UP-006` 未闭合时返回 blocked/unsupported，不允许 query/scan 自动迁移或删除 provenance。

### 8.4 `RebindWorkingCopy`

```ts
export interface RebindWorkingCopyRequest {
  readonly priorBindingRef: WorkingCopyBindingRef;
  readonly newSelection: ExplicitSyncSelectionDto;
  readonly expectedPriorGeneration: MetadataGeneration;
  readonly rebindReason: BindingRebindReason;
}
export interface WorkingCopyRebindResult extends SyncCommandResultBase {
  readonly priorBindingRef: WorkingCopyBindingRef;
  readonly newBindingRef: Optional<WorkingCopyBindingRef>;
  readonly newGeneration: Optional<MetadataGeneration>;
  readonly transitionProvenanceRef: Optional<ProvenanceRecordRef>;
}
```

必须产生新 binding/generation/provenance relation；不得覆写 prior selection/history 或从目录/Git推断 new selection。

### 8.5 `PullWorkingCopy`

```ts
export interface PullWorkingCopyRequest {
  readonly selection: ExplicitSyncSelectionDto;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly expectedGeneration: MetadataGeneration;
  readonly pathScope: PathScopeDto;
}
export interface PullWorkingCopyResult extends SyncCommandResultBase {
  readonly sourceDeltaRef: Optional<SourceDeltaRef>;
  readonly planRef: Optional<MaterializationPlanRef>;
  readonly runRef: Optional<MaterializationRunRef>;
  readonly priorAppliedCursorRef: Optional<SourceCursorRef>;
  readonly finalizedAppliedCursorRef: Optional<SourceCursorRef>;
}
```

Explicit selection 必须与 binding 匹配；Gap/Unsupported/dirty/path unknown 返回 blocked/conflict/needs-action。NoOp 必须来自 owner/comparator proof，不得由空 array推断。禁止自动 merge/rebase/stash。

### 8.6 `RecordConflictResolution`

```ts
export interface RecordConflictResolutionRequest {
  readonly conflictRef: ConflictRecordRef;
  readonly decisionKind: ManualResolutionKind;
  readonly scope: ManualResolutionScope;
  readonly requiredRevalidationSet: RevalidationRequirementSet;
}
export interface ConflictResolutionResult extends SyncCommandResultBase {
  readonly conflictRef: ConflictRecordRef;
  readonly resolutionRef: Optional<ManualResolutionRef>;
  readonly resolutionState: Optional<ManualResolutionState>;
}
```

只记录 actor 的 bounded intent；不修改 files/cursor/source，不把 KeepLocal/ApplySource 解释为 force overwrite，也不等于 owner/Review Decision。

### 8.7 `ResumeSyncOperation`

```ts
export interface ResumeSyncOperationRequest {
  readonly operationRef: SyncOperationRef;
  readonly checkpointRef: RecoveryCheckpointRef;
  readonly resolutionRef: Optional<ManualResolutionRef>;
  readonly expectedInputFingerprintRef: RecoveryInputFingerprintRef;
}
export interface ResumeSyncOperationResult extends SyncCommandResultBase {
  readonly recoveryDecision: RecoveryNextAction;
  readonly resumedRunRef: Optional<MaterializationRunRef>;
  readonly probeRef: Optional<ProbeRecordRef>;
}
```

Fingerprint mismatch必须 invalidate/replan；possible external effect必须 ProbeRequired。Request 不含 `force/retryAnyway`。

### 8.8 `ProbeUnknownOutcome`

```ts
export interface ProbeUnknownOutcomeRequest {
  readonly operationRef: SyncOperationRef;
  readonly checkpointRef: RecoveryCheckpointRef;
  readonly attemptRef: ExternalAttemptRef;
  readonly probeKind: RecoveryProbeKind;
}
export interface ProbeUnknownOutcomeResult extends SyncCommandResultBase {
  readonly probeRef: Optional<ProbeRecordRef>;
  readonly probeState: Optional<ProbeRecordState>;
  readonly externalResultRef: Optional<ExternalResultRef>;
  readonly handoffLayers: Optional<HandoffResultLayersDto>;
}
```

必须有 durable prior attempt/context；结果仍 unknown/unsupported 显式返回，绝不自动 resubmit。ResolvedKnown 不自动等于 Review accepted。

### 8.9 `CancelSyncOperation`

```ts
export interface CancelSyncOperationRequest {
  readonly operationRef: SyncOperationRef;
  readonly cancellationReason: CancellationReason;
}
export interface CancelSyncOperationResult extends SyncCommandResultBase {
  readonly operationState: SyncOperationState;
  readonly externalEffectState: "none_known" | "possible_or_unknown" | "known_ref_preserved";
}
```

只取消 local continuation；如果已有/可能 external effect，必须保留 attempt/checkpoint/probe-required，不宣称远端撤销。

### 8.10 `PushReviewCandidate`

```ts
export interface PushReviewCandidateRequest {
  readonly selection: ExplicitSyncSelectionDto;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly expectedGeneration: MetadataGeneration;
  readonly includedPathScope: PathScopeDto;
  readonly governanceTargetRef: GovernanceHandoffTargetRef;
}
export interface PushReviewCandidateResult extends SyncCommandResultBase {
  readonly candidateRef: Optional<ReviewCandidateRef>;
  readonly attemptRef: Optional<HandoffAttemptRef>;
  readonly handoffLayers: HandoffResultLayersDto;
}
```

freeze 前/正式 call 前都 revalidate access/posture/source/binding/local/conflict；durable attempt before call。Request 不接受 Git commit 作为 Artifact/Baseline，不含 auto-push/merge/rebase。Transport ACK 只能进入 transport layer。

### 8.11 `RefreshReviewHandoffStatus`

```ts
export interface RefreshReviewHandoffStatusRequest {
  readonly operationRef: SyncOperationRef;
  readonly attemptRef: HandoffAttemptRef;
  readonly externalHandoffRef: Optional<ExternalHandoffRef>;
}
export interface ReviewHandoffRefreshResult extends SyncCommandResultBase {
  readonly attemptRef: HandoffAttemptRef;
  readonly probeRef: Optional<ProbeRecordRef>;
  readonly decisionSnapshotRef: Optional<ExternalOwnerSnapshotRef>;
  readonly handoffLayers: HandoffResultLayersDto;
}
```

这是显式写命令，因为会保存 probe/owner snapshot/attempt relation；只读 GetReviewHandoffStatus 不得调用此协议。只能读取/关联 owner state，不创建或改变 Decision。

### 8.12 Command 协议停审

| 审查项 | 结论 |
|---|---|
| 10 个 Command 独立 schema/flow | pass |
| explicit project/version/source/target | pass；Clone/Pull/Push/Rebind 均显式，禁止 latest/Git推断。 |
| DTO→29 对象 | pass；每个 mutation 目标对象的必填来源明确。 |
| idempotency/unknown | pass_with_blocker；`SYNC-UP-005`，duplicate unknown no replay。 |
| hard prohibitions | pass；no auto Git/overwrite/review bypass/provenance delete。 |

## 9. Query 协议

### 9.1 共享 request 与 view schema

```ts
export interface SubjectQueryRequest<R> { readonly subjectRef: R; }
export interface BindingScopedQueryRequest {
  readonly bindingRef: WorkingCopyBindingRef;
  readonly targetRef: LocalTargetRef;
}
```

| View | 必需字段 |
|---|---|
| `SyncOperationView` | operationRef/kind/state/selectionRef/runtimeBindingSnapshotRef/checkpointRef/local result posture/last transition ref |
| `AccessEvaluationView` | evaluationRef/selectionRef/action/outcome/freshness/snapshot refs/safe reasons/evaluatedAt |
| `WorkingCopyBindingView` | bindingRef/selectionRef/canonical target/generation/state/manifest/provenance/last observation refs |
| `MetadataHealthView` | manifestRef/schemaRef/generation/integrityState/missing-or-dangling summary/protected provenance refs |
| `WorkingCopyObservationView` | target/gitHead optional/workingTree/path/lock/tool axes/fingerprint optional/observedAt |
| `MaterializationStatusView` | operation/plan/run/runtimeBindingSnapshot refs + plan/run states + source delta kind + cursor before/target/finalized + failure/checkpoint |
| `ConflictView` | conflictRef/kind/state/affected refs/basis summary/checkpoint/resolution/detectedAt |
| `RecoveryStatusView` | operation/checkpoint/stage/state/next action/input fingerprint/probe/attempt refs |
| `ProvenanceView` | recordRef/relation/subject/source/parent refs/digest/state/recordedAt/redaction marker |
| `SyncDiagnosticSummaryView` | correlation refs/safe failure codes/adapter availability/degraded reasons/provenance refs；no body/report/readiness |

每个 view 是 readonly、body-free。外部 owner fields 只用 refs/safe summary/freshness/visibility；不嵌入 Project/Artifact/Workspace/Review/Archive entity。

### 9.2 CP1/CP2 Queries

| Query | Request body | Response | 读取 / no-write 边界 |
|---|---|---|---|
| `GetAccessEvaluation` | `{ evaluationRef }` 或 `{ selectionRef, operationKind }` 的判别联合，二者不可同时 | `SyncQueryResponse<AccessEvaluationView>` | persisted evaluation/snapshots only；不 owner refresh。 |
| `GetSyncOperation` | `{ operationRef }` | `SyncQueryResponse<SyncOperationView>` | no transition。 |
| `GetWorkingCopyBinding` | `{ bindingRef }` 或 `{ targetRef }` union | `SyncQueryResponse<WorkingCopyBindingView>` | no rebind/migrate。 |
| `GetMetadataHealth` | `{ bindingRef, manifestRef? }` | `SyncQueryResponse<MetadataHealthView>` | load summaries only；no scan/repair。 |
| `InspectWorkingCopy` | `{ targetRef, expectedBindingRef? }` | `SyncQueryResponse<WorkingCopyObservationView>` | optional即时 read-only Git/fs；no persist/write lock/fix。 |

### 9.3 CP3/CP4 Queries

| Query | Request body | Response | 读取 / no-write 边界 |
|---|---|---|---|
| `GetMaterializationStatus` | `{ operationRef, runRef? }` | `SyncQueryResponse<MaterializationStatusView>` | no source resolve/compare/apply/resume。 |
| `GetConflict` | `{ conflictRef }` | `SyncQueryResponse<ConflictView>` | no resolution。 |
| `ListConflicts` | `{ operationRef?, bindingRef?, stateFilter?, page }`，至少一个 scope | `SyncPageResponse<ConflictView>` | open/unknown不隐藏；cursor opaque。 |
| `GetRecoveryStatus` | `{ operationRef, checkpointRef? }` | `SyncQueryResponse<RecoveryStatusView>` | no probe/resume。 |

### 9.4 CP5 Queries

```ts
export interface GetSyncStatusRequest {
  readonly bindingRef: Optional<WorkingCopyBindingRef>;
  readonly targetRef: LocalTargetRef;
  readonly includeReadOnlyObservation: boolean;
}
export interface GetReviewHandoffStatusRequest {
  readonly candidateRef: Optional<ReviewCandidateRef>;
  readonly attemptRef: Optional<HandoffAttemptRef>;
}
export interface GetProvenanceRequest {
  readonly subjectRef: LocalProvenanceSubjectRef;
  readonly traversal: "direct" | "parents";
  readonly page: SyncPageRequest;
}
export interface GetSyncDiagnosticSummaryRequest {
  readonly operationRef: Optional<SyncOperationRef>;
  readonly correlationRef: Optional<CorrelationRef>;
}
```

| Query | Response | 特别规则 |
|---|---|---|
| `GetSyncStatus` | `SyncQueryResponse<SyncStatusView>` | CP1～CP5 slices；即时 observation 不持久化；CompleteRead≠sync success。 |
| `GetReviewHandoffStatus` | `SyncQueryResponse<LayeredHandoffStatus>` | candidate/attempt 至少一个；no probe/Decision refresh；ACK与Decision分层。 |
| `GetProvenance` | `SyncPageResponse<ProvenanceView>` | graph body-free；不得隐藏 IntegrityUnknown 或删除链。 |
| `GetSyncDiagnosticSummary` | `SyncQueryResponse<SyncDiagnosticSummaryView>` | 至少 operation/correlation一个；不是 artifact/report/evidence/readiness。 |

### 9.5 逐 Query 协议卡

下表中的 handler 均使用共享签名 `handle(request: SyncQueryRequest<SpecificRequest>): Promise<SyncProtocolResult<SpecificResponse>>`；transport route/RPC 名称均为 `not_selected`。`visibility/redaction` 由 trusted read facade 提供，任何 query 都不获得 UoW、write repository、owner refresh、probe 或 diagnostics emission capability。

| Query | Specific request / response schema | owning use case | Read boundary / Port mapping | missing / not-visible / degraded | error / blocker | Step 9 flow |
|---|---|---|---|---|---|---|
| `GetAccessEvaluation` | `GetAccessEvaluationRequest = {kind:"by_ref",evaluationRef} | {kind:"by_context",selectionRef,operationKind}` → `SyncQueryResponse<AccessEvaluationView>` | CP1 persisted eligibility read | `AccessEvaluationRepository.getVersioned/findCurrent` + `OwnerSnapshotRepository.getVersioned`; zero owner calls/writes | absent→`missing`; visibility denial→`not_visible`; missing/stale snapshot→`partial` with typed degraded reason | normalized repository/visibility error；`SYNC-UP-001/003` 只阻断 positive freshness semantics，不授权 refresh | `GetAccessEvaluationFlow` |
| `GetSyncOperation` | `{operationRef}` → `SyncQueryResponse<SyncOperationView>` | CP1 local operation read | `SyncOperationRepository.getVersioned`; no transition | absent/not-visible explicit；referenced checkpoint unavailable→partial | repository/visibility mapping；无新增上游调用 | `GetSyncOperationFlow` |
| `GetWorkingCopyBinding` | `{kind:"by_ref",bindingRef} | {kind:"by_target",targetRef}` → `SyncQueryResponse<WorkingCopyBindingView>` | CP2 binding read | `getVersioned/findByTarget`，可只读加载 manifest/persisted observation summary；no canonical repair | absent/not-visible explicit；manifest summary unavailable→partial | target syntax/visibility/repository error；`SYNC-UP-006/010` | `GetWorkingCopyBindingFlow` |
| `GetMetadataHealth` | `{bindingRef,manifestRef:null|MetadataManifestRef,page}` → `SyncQueryResponse<MetadataHealthView>` | CP2 logical metadata health read | binding/manifest repos + `listRecordSummaries`; pure `evaluateMetadataIntegrity` only | dangling/missing/unknown均显式 degraded；不得返回 empty-valid | repository/integrity mapping；`SYNC-UP-006` | `GetMetadataHealthFlow` |
| `InspectWorkingCopy` | `{targetRef,expectedBindingRef:null|WorkingCopyBindingRef}` → `SyncQueryResponse<WorkingCopyObservationView>` | CP2 ephemeral inspection | `FilesystemInspectionPort.canonicalizeTarget/inspectTarget` + `WorkingCopyObservationPort.inspect`; no repository append/lock | target invisible→not-visible；tool/path unreadable→blocked/unavailable，不能伪 clean | adapter safe error；`SYNC-UP-007/009/010` | `InspectWorkingCopyFlow` |
| `GetMaterializationStatus` | `{operationRef,runRef:null|MaterializationRunRef}` → `SyncQueryResponse<MaterializationStatusView>` | CP3 persisted plan/run status | operation/plan/run/cursor/checkpoint repositories；zero source/Git/fs calls | missing requested run→missing；partial slice→partial，不折叠 OutcomeUnknown | repository mapping；`SYNC-UP-006/008` only for unavailable semantics | `GetMaterializationStatusFlow` |
| `GetConflict` | `{conflictRef}` → `SyncQueryResponse<ConflictView>` | CP4 single conflict read | `ConflictRepository.getVersioned` + optional checkpoint/resolution reads | conflict absent/not-visible explicit；related record missing→partial | repository/visibility mapping；`SYNC-UP-010` 不改变 persisted state | `GetConflictFlow` |
| `ListConflicts` | `{operationRef:null|...,bindingRef:null|...,stateFilter:ReadonlyArray<ConflictState>,page}` with at least one scope → `SyncPageResponse<ConflictView>` | CP4 scoped conflict listing | `ConflictRepository.listOpenByOperation/listByBinding`; repository cursor→public cursor mapper | zero visible items ≠ scope missing；hidden items按 visibility policy 标记/计数 | invalid scope/page；binding index physical form待 Step 11，不能全库猜扫 | `ListConflictsFlow` |
| `GetRecoveryStatus` | `{operationRef,checkpointRef:null|RecoveryCheckpointRef}` → `SyncQueryResponse<RecoveryStatusView>` | CP4 persisted recovery read | operation/checkpoint/probe/attempt/run repositories；pure `classifyRecoveryNextAction` on loaded facts | absent/invalidated/stale slice explicit；不 re-observe | repository mapping；`SYNC-UP-004/005/010` | `GetRecoveryStatusFlow` |
| `GetSyncStatus` | `GetSyncStatusRequest` → `SyncQueryResponse<SyncStatusView>` | cross-feature no-write status composition | `SyncStatusReadPort.loadStatusSlices`; optional read-only fs/Git observation only | each slice uses present/missing/not-visible/unavailable；`CompleteRead` 仅为读取完整 | read-port/adapter mapping；`SYNC-UP-001~010` relevant degraded markers | `GetSyncStatusFlow` |
| `GetReviewHandoffStatus` | `GetReviewHandoffStatusRequest`，candidate/attempt 至少一个 → `SyncQueryResponse<LayeredHandoffStatus>` | CP5 layered handoff read | `loadHandoffSlices` + candidate/attempt/probe/snapshot repos；no Decision read/probe | absent owner snapshot stays missing/unknown；ACK-only remains transport layer | repository/visibility mapping；`SYNC-UP-004/005` | `GetReviewHandoffStatusFlow` |
| `GetProvenance` | `GetProvenanceRequest` → `SyncPageResponse<ProvenanceView>` | CP5 body-free provenance traversal | `ProvenanceRepository.listBySubject/listParents` + public cursor mapper | missing parent / IntegrityUnknown显式 degraded，不补造/隐藏 | invalid traversal/page/integrity safe mapping；`SYNC-UP-006` | `GetProvenanceFlow` |
| `GetSyncDiagnosticSummary` | `GetSyncDiagnosticSummaryRequest`，operation/correlation 至少一个 → `SyncQueryResponse<SyncDiagnosticSummaryView>` | diagnostics-safe persisted summary | `SyncDiagnosticReadPort.loadDiagnosticSummarySlices` + `AdapterAvailabilityPort.getCapabilitySnapshot`; no emit | no records→explicit empty-present only if scope exists；source unavailable→partial/unavailable | safe error/redaction mapping；不是 artifact/report/evidence/readiness | `GetSyncDiagnosticSummaryFlow` |

独立 schema aliases 必须在 `contracts/queries` 中按上表落位；表中 `{...}` 是字段级 schema，不授权使用 anonymous `Record<string, unknown>`。`listByBinding` 与 `SyncDiagnosticReadPort` 的物理 index/schema由 Step 11闭合，但 callable surface 已在 Step 7 固定；不得由 service扫描 opaque refs、全库猜扫或解析 error text。

### 9.6 Query 协议停审

| 审查项 | 结论 |
|---|---|
| 13 个 Query field-level request/response | pass |
| view/page secondary types | pass；公共 cursor/disposition/slices 明确。 |
| empty/missing/not-visible/degraded | pass；无默认 clean/success。 |
| no-write | pass；无 UoW/write/probe/refresh/migrate capability。 |

## 10. Inbound Consumer 协议（conditional/blocked）

### 10.1 Envelope / receipt

```ts
export interface InboundSyncEventEnvelope<T> {
  readonly eventId: EventId;
  readonly eventName: SyncInboundEventName;
  readonly schemaVersion: EventSchemaVersion;
  readonly sourceOwner: ExternalOwnerKind;
  readonly sourceRef: ExternalSubjectRef;
  readonly sourceVersionRef: OwnerVersionRef;
  readonly occurredAt: ObservedAt;
  readonly payloadDigestRef: PayloadDigestRef;
  readonly idempotencyKey: IdempotencyKey;
  readonly payload: T;
}

export type ConsumerDisposition =
  | "processed" | "duplicate" | "no_op" | "blocked"
  | "unsupported_version" | "invalid_source" | "quarantined" | "failed_known";

export interface ConsumerReceipt {
  readonly eventId: EventId;
  readonly disposition: ConsumerDisposition;
  readonly affectedLocalRefs: ReadonlyArray<OpaqueRef<string>>;
  readonly degradedReasons: StatusDegradedReasonSet;
  readonly correlationRef: CorrelationRef;
}
```

缺 event id/source attribution/schema version/digest/idempotency 即 reject/quarantine，不解析/持久化正文。`quarantined` 仅是安全 disposition，当前不声明 quarantine store 已实现。

### 10.2 Consumer payloads

```ts
export interface AccessOrPostureInvalidatedPayload {
  readonly subjectRef: ExternalSubjectRef;
  readonly invalidationKind: AccessOrPostureInvalidationKind;
  readonly affectedActionSet: ReadonlyArray<SyncOperationKind>;
  readonly ownerVersionRef: OwnerVersionRef;
}
export interface MaterialSourceInvalidatedPayload {
  readonly sourceRef: MaterialSourceRef;
  readonly invalidationKind: MaterialSourceInvalidationKind;
  readonly ownerCursorRef: Optional<SourceCursorRef>;
  readonly ownerVersionRef: OwnerVersionRef;
}
export interface ReviewDecisionChangedPayload {
  readonly externalHandoffRef: ExternalHandoffRef;
  readonly decisionRef: ExternalDecisionRef;
  readonly decisionState: ExternalDecisionStateView;
  readonly ownerVersionRef: OwnerVersionRef;
}
```

以下三个 envelope alias 是 Step 7 consumer port 使用的唯一正式类型名：

```ts
export type AccessOrPostureInvalidatedEnvelope =
  InboundSyncEventEnvelope<AccessOrPostureInvalidatedPayload>;
export type MaterialSourceInvalidatedEnvelope =
  InboundSyncEventEnvelope<MaterialSourceInvalidatedPayload>;
export type ReviewDecisionChangedEnvelope =
  InboundSyncEventEnvelope<ReviewDecisionChangedPayload>;
```

| Consumer | Local output | 禁止 | Blocker |
|---|---|---|---|
| `ConsumeAccessOrPostureInvalidated` | snapshots/evaluation stale；plan/candidate invalidation | auto cancel、owner write | `001/003` |
| `ConsumeMaterialSourceInvalidated` | cursor continuity unknown；plan/candidate invalidation | auto pull/apply | `001/002/008` |
| `ConsumeReviewDecisionChanged` | safe decision snapshot/ref update | create/reinterpret Decision、retry handoff | `001/004` |

### 10.3 逐 Consumer 协议卡

精确 topic/subscription/transport route 均为 `not_selected`；在 owner event schema、source attribution、ordering 与 compatibility 未闭合前，composition 必须保持 `blocked`，不能订阅 private topic或用 polling/cache伪装 consumer。

| Consumer | Handler signature / schema | owning use case | Read / write / Port mapping | Receipt / duplicate disposition | Error / blocker | Step 9 flow |
|---|---|---|---|---|---|---|
| `ConsumeAccessOrPostureInvalidated` | `consumeAccessOrPostureInvalidated(envelope: AccessOrPostureInvalidatedEnvelope): Promise<PortResult<ConsumerReceipt>>`；payload含 subject/invalidation/actions/ownerVersion | CP1 conservative owner invalidation，协作 CP3/CP5 | read `ConsumerReceiptRepository` + `InboundInvalidationTargetReadPort.resolveAccessOrPostureTargets` + returned versioned refs；write stale/invalidation + provenance + stored receipt in one UoW | same event/key/digest→`duplicate`并原样回放；invalid source/version→`invalid_source/unsupported_version/quarantined`且不存 payload | source/order/schema mapping；`SYNC-UP-001/003/005/006` | `ConsumeAccessOrPostureInvalidatedFlow` |
| `ConsumeMaterialSourceInvalidated` | `consumeMaterialSourceInvalidated(envelope: MaterialSourceInvalidatedEnvelope): Promise<PortResult<ConsumerReceipt>>`；payload含 source/invalidation/cursor?/ownerVersion | CP3 source/cursor conservatism，协作 CP2/CP5 | read receipt + `resolveMaterialSourceTargets` + returned cursor/plan/candidate refs；write continuity Unknown/invalidation + provenance + receipt; finalized history unchanged | exact duplicate replay；unmatched/ambiguous source→`no_op` or `quarantined` by typed mapping，不猜关联 | ordering/comparator/source authority；`SYNC-UP-001/002/005/006/008` | `ConsumeMaterialSourceInvalidatedFlow` |
| `ConsumeReviewDecisionChanged` | `consumeReviewDecisionChanged(envelope: ReviewDecisionChangedEnvelope): Promise<PortResult<ConsumerReceipt>>`；payload含 exact external handoff/Decision ref/state/version | CP5 owner Decision snapshot attachment | read receipt + `HandoffAttemptRepository.findByExternalHandoffRef`；write body-free snapshot/attempt/provenance/receipt in UoW；never create Gate/Decision | exact duplicate replay；unmatched/ambiguous external ref→quarantined/blocked，绝不创建 attempt | Governance event/ref mapping；`SYNC-UP-001/004/005/006` | `ConsumeReviewDecisionChangedFlow` |

Consumer entry先验证 envelope 再解析 payload；`ConsumerReceipt` 是完整 public disposition，Step 7 `StoredConsumerReceipt` 只包裹它用于 durable replay。任何 rejected/quarantined branch不得持久化 raw payload/body；是否持久化 body-free rejection receipt由 Step 11 的 local transaction设计闭合。

### 10.4 Consumer 停审

DTO 能构造 Step 6 snapshot/invalidation intent，并由 Step 7 repository/UoW/idempotency承接；但 source/topic/schema/compatibility/dedup authority 未闭合，所以三个 consumer 均只能 composition=`blocked/planned`，不得订阅 private topic或以 polling cache替代。

## 11. Outbound Event 适用性

`not_applicable`。L5-sync local operation、metadata transition、conflict、candidate、handoff attempt 或 provenance relation 都不是自动发布的平台 fact。当前不定义 outbound envelope/payload/topic/outbox/publisher/delivery state。未来若需要通知，必须回退 00/01/02 明确消费者、ownership、body-free payload、delivery/idempotency，再重做 Step 6～13；不能在 adapter 中私发事件。

## 12. Operations Job 协议

### 12.1 Shared metadata/report

```ts
export interface SystemActorContext {
  readonly systemActorRef: SystemActorRef;
  readonly authorityScopeRef: SystemAuthorityScopeRef;
}
export interface JobMetadata {
  readonly jobRunRef: JobRunRef;
  readonly correlationRef: CorrelationRef;
  readonly requestedAt: ObservedAt;
  readonly batchLimit: number;
}
export type JobDisposition =
  | "completed" | "completed_with_blockers" | "partial"
  | "duplicate" | "blocked" | "failed_known";
export interface SyncJobReport {
  readonly jobName: SyncJobName;
  readonly jobRunRef: JobRunRef;
  readonly disposition: JobDisposition;
  readonly scannedCount: number;
  readonly changedCount: number;
  readonly blockedCount: number;
  readonly failedCount: number;
  readonly affectedLocalRefs: ReadonlyArray<OpaqueRef<string>>;
  readonly nextCursor: Optional<PublicPageCursor>;
  readonly degradedReasons: StatusDegradedReasonSet;
}
export interface SyncJobRequest<T> {
  readonly jobName: SyncJobName;
  readonly actor: SystemActorContext;
  readonly metadata: JobMetadata;
  readonly idempotencyKey: IdempotencyKey;
  readonly body: T;
}
```

Report 是本地 operations result，不是 artifact/evidence/report verdict/readiness。duplicate 必须由 `SyncJobResultRepository` 回放完整 `StoredSyncJobResult.result`（含 report 与 item results），不允许只给 result ref 后丢失公开响应，也不重新扫描/probe/change。

### 12.2 `ScanMetadataIntegrity`

Handler：`scanMetadataIntegrity(request: SyncJobRequest<MetadataIntegrityScanInput>): Promise<PortResult<MetadataIntegrityScanResult>>`；owning use case=`working_copy_metadata` integrity scan。读取 binding/manifest/record summaries/provenance，只有更保守的 typed classification 可经 per-item UoW 写入；`SyncJobResultRepository` 保存完整 result并处理 duplicate replay。missing target、unavailable page和 concurrency conflict进入 item/result degraded/failed counts，不得自动 repair/migrate。Blocker=`SYNC-UP-005/006`；Step 9=`ScanMetadataIntegrityFlow`；scheduler/transport route=`not_selected`。

```ts
export interface MetadataIntegrityScanInput {
  readonly bindingRef: Optional<WorkingCopyBindingRef>;
  readonly targetScope: ReadonlyArray<LocalTargetRef>;
  readonly page: SyncPageRequest;
}
export interface MetadataIntegrityScanResult {
  readonly report: SyncJobReport;
  readonly manifestResults: ReadonlyArray<MetadataIntegrityScanItemResult>;
}
export interface MetadataIntegrityScanItemResult {
  readonly manifestRef: Optional<MetadataManifestRef>;
  readonly targetRef: LocalTargetRef;
  readonly integrityState: MetadataIntegrityState;
  readonly safeFailure: Optional<SafeFailureSummary>;
}
```

至少 binding 或 non-empty target scope；只读/分类 logical records，可显式保存 degraded integrity transition only under owning service/UoW；不 repair/migrate/rebind/delete provenance。

### 12.3 `ProbePendingHandoffAttempts`

Handler：`probePendingHandoffAttempts(request: SyncJobRequest<PendingHandoffProbeInput>): Promise<PortResult<PendingHandoffProbeJobResult>>`；owning use case=`conflict_recovery` + `review_handoff_provenance` formal probe。读取 persisted ProbeRequired attempts/checkpoints/latest probes，逐 item复用正式 `RecoveryProbePort` prepare→call→finalize流程；完整 result写 `SyncJobResultRepository`。duplicate不重新 probe，missing/drift item=`skipped_not_probe_required`，unknown/unsupported保持显式且 batch不得称 resolved。Blocker=`SYNC-UP-004/005/006`；Step 9=`ProbePendingHandoffAttemptsFlow`；scheduler/transport route=`not_selected`。

```ts
export interface PendingHandoffProbeInput {
  readonly attemptScope: ReadonlyArray<HandoffAttemptRef>;
  readonly includeAllPersistedProbeRequired: boolean;
  readonly page: SyncPageRequest;
}
export interface PendingHandoffProbeJobResult {
  readonly report: SyncJobReport;
  readonly attemptResults: ReadonlyArray<PendingHandoffProbeItemResult>;
}
export interface PendingHandoffProbeItemResult {
  readonly attemptRef: HandoffAttemptRef;
  readonly probeRef: Optional<ProbeRecordRef>;
  readonly probeState: Optional<ProbeRecordState>;
  readonly disposition: "resolved_known" | "still_unknown" | "unsupported" | "failed_known" | "skipped_not_probe_required";
}
```

Scope 与 `includeAll...` 必须恰一生效；只处理已持久化 ProbeRequired attempts，经正式 probe port；不 submit/replay、不生成 Decision/verdict。

### 12.4 `MarkStaleOwnerSnapshots`

Handler：`markStaleOwnerSnapshots(request: SyncJobRequest<SnapshotStalenessScanInput>): Promise<PortResult<SnapshotStalenessScanResult>>`；owning use case=`selection_access` conservative freshness maintenance。读取 `OwnerSnapshotRepository.listStaleOrInvalidated` 候选及关联 evaluation/plan/candidate targets，仅按正式 persisted freshness rule经 per-item UoW收紧状态；不调用 owner refresh。完整 result写 `SyncJobResultRepository`，duplicate原样回放；missing/concurrency/unavailable按 item/report计数。Blocker=`SYNC-UP-001/003/005/006`；Step 9=`MarkStaleOwnerSnapshotsFlow`；scheduler/transport route=`not_selected`。

```ts
export interface SnapshotStalenessScanInput {
  readonly ownerKindFilter: ReadonlyArray<ExternalOwnerKind>;
  readonly subjectScope: ReadonlyArray<ExternalSubjectRef>;
  readonly evaluatedAt: ObservedAt;
  readonly page: SyncPageRequest;
}
export interface SnapshotStalenessScanResult {
  readonly report: SyncJobReport;
  readonly snapshotResults: ReadonlyArray<SnapshotStalenessItemResult>;
}
export interface SnapshotStalenessItemResult {
  readonly snapshotRef: ExternalOwnerSnapshotRef;
  readonly priorFreshness: FreshnessState;
  readonly resultingFreshness: FreshnessState;
  readonly affectedEvaluationRefs: ReadonlyArray<AccessEvaluationRef>;
}
```

只根据正式 freshness rule 与 persisted timestamps/versions把姿态收紧为 Stale/Invalidated/Unavailable；不 owner refresh，不把本地 TTL自行定义为 authorization rule，不恢复 Fresh。

### 12.5 Job 协议停审

| 审查项 | 结论 |
|---|---|
| input/output/report secondary types | pass |
| idempotency/duplicate | pass；`SyncJobResultRepository` stored typed result/no rerun。 |
| scan/probe/stale scope | pass；无 auto repair/pull/push/replay。 |
| evidence boundary | pass；report是 local ops result，不是 formal evidence/readiness。 |

## 13. 跨协议闭环审计

### 13.1 Public secondary types

| Type family | 定义位置 / schema | 使用者 | 闭环结论 |
|---|---|---|---|
| envelopes/metadata/actor | §7.1、§10.1、§12.1 | all protocols | actor/idempotency/correlation单一载体；credential only ref。 |
| explicit selection/path scope | §7.2 | Clone/Pull/Rebind/Push | project/version/source/target explicit；path只收窄。 |
| result/error layers | §7.3/§7.5 | Commands/entry | no global success；unknown durable refs。 |
| query slices/pages | §7.2/§7.4/§9.1 | Queries | missing/visibility/freshness/degraded完整。 |
| consumer receipt/payload | §10 | conditional consumers | schema/source/dedup/quarantine surface；仍 blocked。 |
| job report/item result | §12 | jobs | duplicate/batch/partial/blocked surface。 |

### 13.2 DTO → Object / Port / Flow closure

| Protocol group | 构造/读取对象 | Step 7 ports | Step 9 flow |
|---|---|---|---|
| Clone/Pull | selection/operation/binding/manifest/delta/plan/path/run/cursor/mapping/provenance | CP1/2/3/5 + UoW/idempotency | Clone/Pull independent |
| Migrate/Rebind | binding/manifest/provenance | CP2 repositories/fs/UoW | independent |
| Resolve/Resume/Probe/Cancel | conflict/resolution/checkpoint/probe/operation | CP1/4 + probe/UoW | independent/common cancel |
| Push/Refresh | candidate/attempt/probe/snapshot/provenance | CP1/2/4/5 + handoff/decision | independent |
| Queries | all views/read completeness | read repositories/SyncStatusReadPort/read-only observation | shared query + status/inspect independent |
| Consumers | snapshots/evaluation/cursor/plan/candidate/attempt | repos/UoW/idempotency | one per consumer |
| Jobs | integrity/snapshot/probe/attempt/report | list/scan/probe repos/ports | one per job |

### 13.3 Public body / secret / provenance boundary

| 检查 | 结论 |
|---|---|
| request 是否含 credential secret | no；仅 credential ref。 |
| result/view 是否含 file/source/provider/raw tool body | no；只有 typed refs/safe summaries/redaction。 |
| Git commit 是否成为 Artifact/Baseline | no；仅 optional local observation ref，且不进入 external truth。 |
| ACK 是否成为 accepted | no；transport layer 与 external Decision layer分离。 |
| provenance 是否可删/补造 | no；Query保留 IntegrityUnknown，Commands/Jobs无 cleanup。 |
| diagnostics/job report 是否冒充 evidence/readiness | no。 |

### 13.4 Protocol naming / applicability

| 检查 | 结论 |
|---|---|
| HLD API name→DDD operation | 1:1；Command/Query/Consumer/Job 名称一致。 |
| CLI route | four P0 semantic verbs locked；binary/flags/exit code pending。 |
| HTTP/RPC/topic/cron | not selected；不造 route/topic。 |
| outbound event | explicit not_applicable。 |
| consumer | planned/blocked until formal event contracts。 |

## 14. 回填草稿

未来正式 §7 应摘录 inventory、shared envelope/result/error、10 Commands、13 Queries、3 conditional Consumers、Outbound not applicable、3 Jobs 及跨协议审计。协议字段完整定义以本文件为校准来源；正式正文不得把 blocked integration 写成 available route/topic。

## 15. 待确认事项

- `SYNC-UP-001~010` 全部开放；真实 SDK methods/provider DTO/event topic/metadata schema/Git/fs mapping均未由协议 DTO关闭。
- `SYNC-LOCAL-001~005` 不变；CLI binary/flags/parser/exit code、schema validator/tool/test runner 未选定。
- `CredentialRef` 的正式 SDK传递语义、public ref serialization、schema version strategy、page limit与error code由 Step 12/14及上游合同继续收口。

## 16. 进入下一步条件

- [x] 10 Commands、13 Queries、3 conditional Consumers、3 Jobs 均有独立 schema与 protocol-to-flow 映射。
- [x] Outbound Event 明确 not applicable，未虚构 outbox/topic。
- [x] public envelope/result/view/page/receipt/report/error 二级类型有字段级 schema与归属。
- [x] DTO可构造/读取 Step 6对象并由 Step 7 port承接；无 provider DTO/unknown map穿透。
- [x] explicit selection、query no-write、unknown/no replay、ACK/Decision、provenance/body边界通过。
- [x] 未修改正式03、未创建实现/测试/evidence/implementation ledger/commit。

结论：Step 8 通过 `pass_with_upstream_blockers`；允许按用户授权进入 Step 9。协议可作为实现 contract，但不表示 CLI/runtime/integration 已存在或可运行。
