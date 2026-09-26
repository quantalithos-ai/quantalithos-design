# Step 7. 逐模块定义 Trait / Port / Adapter 契约

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节：未来正式 `03-详细设计.md` §5 Port / Adapter 契约与 §6 全局索引
- 框架参考：`projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`；采用逐模块 capability→port→adapter→停审与跨接缝审计粒度，TypeScript 化后不复制其 Rust repository/outbox/projection 业务。
- 前序门禁：Step 6 已覆盖正式 02 的 29 个对象并完成字段/状态/依赖审计。

### 1.1 分批写入状态

| 批次 | 范围 | 状态 | 停审 |
|---|---|---|---|
| 7.1 | shared application port helpers、Clock/ID/Digest/UoW/Idempotency | completed | pass_with_blockers |
| 7.2 | CP1 owner/access 与 local repositories | completed | pass_with_blockers |
| 7.3 | CP2 metadata/local observation repositories/ports | completed | pass_with_blockers |
| 7.4 | CP3 source/materialization/Git/fs apply ports | completed | pass_with_blockers |
| 7.5 | CP4 conflict/recovery/probe repositories/ports | completed | pass_with_blockers |
| 7.6 | CP5 candidate/handoff/provenance/status/diagnostics ports | completed | pass_with_blockers |
| 7.7 | adapter implementation matrix、entry restrictions、跨模块审计 | completed | pass_with_blockers |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | feature/technical module 归属与 allowed/forbidden dependency。 |
| `03_ddd_step_06_object_contracts.md` | 29 对象能力、字段来源、状态与 Step 7 承接清单。 |
| 正式 02 §7 | Command/Query/Consumer/Job 与 port skeleton 的稳定名称和边界。 |
| 正式 02 §8～§10 | 读取/写入/unknown/recovery/no-write 所需 capability。 |
| `L1-governance` Step 7 | versioned read、UoW、page helper、adapter matrix 与停审框架。 |

## 3. SOP 问题回答

1. **在哪里定义 port？** inward port 与 repository 定义在使用它的 feature `ports/`；跨 feature 基础设施 contract 定义在 `orchestration` 的 application-local contract 文件。`adapters` 只实现，不反向定义 core contract。
2. **谁实现？** SDK/Git/filesystem/metadata/diagnostics concrete adapters；composition root 注入。CLI/operations 不直接持有 repository 或 concrete adapter。
3. **哪些 capability 需要接缝？** local clock/id/digest/UoW/idempotency；29 对象的 load/versioned-save/list/read view；owner/source/handoff/decision/probe；Git/fs inspect/stage/apply；diagnostics；adapter availability。
4. **读取面是否够后续使用？** 本步为 Step 8 DTO、Step 9 flow、Step 10 state 和 Step 11 persistence 明确 `getVersioned`、`findCurrent`、`listByScope`、`listProbeRequired`、`loadStatusSlices`、graph/page 等读取面。
5. **写入如何防止猜 version/transaction？** mutable local entity 必须先 `Versioned<T>` load，再带 `expectedVersion` 和 `LocalStateUnitOfWork` save；append-only provenance 与 immutable observation使用 append receipt，不允许 update/delete。
6. **外部异常如何分类？** read/check port 返回 known/denied/unavailable/unsupported/invalid-response；可能产生外部副作用的 submit 返回 known transport、known rejection 或 outcome unknown，不能以 rejected promise/timeout 自动分类为未发生。
7. **blocked adapter 如何表达？** 接口可落码、concrete adapter composition capability 标 `blocked`；启动/命令返回 typed `Unsupported/Blocked`，不得注入 fake 或猜 method 名完成 positive flow。

## 4. 当前文档问题诊断

概要 port skeleton 只列核心操作，尚不足以构造所有 Query view、恢复 flow 和状态迁移。例如只有 `save_conflict_transition` 无法支持 Get/List/Resume；只有 `load_manifest` 无法读取 binding/cursor/mapping generation；只有 submit 无法区分 call known failure 与 outcome unknown。本步扩充最小但完整的读写面，并保留 Step 11 的物理 schema/事务实现空间。

## 5. 改动前后对比

| 项 | 概要 skeleton | Step 7 契约 |
|---|---|---|
| repository read | 单点 load 预告 | versioned get、current lookup、scope list/page、recovery/status reads。 |
| write | transition 名称 | UoW + expected version/append-only receipt + concurrency result。 |
| external call | capability 名 | typed request/result、known/unknown/unsupported、adapter decode boundary。 |
| Git/fs | observation/apply 名 | 读写 capability 分离、whitelist、stage receipt、no remote/no overwrite。 |
| query | no-write 原则 | `SyncReadPorts` 只包含读取能力，类型上不注入 UoW/write/probe。 |

## 6. 设计取舍

| 决策 | 结论 | 理由 |
|---|---|---|
| 一个全仓 `Repository` | 不采用 | 隐藏 ownership、读写面与 version 来源。 |
| feature-owned repository ports | 采用 | 与对象 ownership 对齐，方便 capability segregation。 |
| repository 抛 exception | 禁止 | expected missing/conflict/corrupt 必须 typed；unexpected error也需 adapter normalization。 |
| Git/fs 单一万能 command port | 禁止 | 无法证明没有 remote/merge/rebase/stash/overwrite。 |
| provider DTO 直接进入 domain | 禁止 | SDK 当前为 `unknown` surface，必须 runtime validate/map。 |

## 7. Shared application port helpers

### 7.1 Result、version、page 与 write context

```ts
/** repository 内部 opaque pagination cursor；不得当 entity version/source cursor。 */
export type RepositoryCursor = OpaqueRef<"repository_cursor">;

/** optimistic token；只能由 repository versioned read 返回。 */
export type LocalEntityVersion = OpaqueRef<"local_entity_version">;

/** 与下一次 optimistic save 配对的对象。 */
export interface Versioned<T> {
  readonly value: T;
  readonly version: LocalEntityVersion;
}

/** application-local 分页请求；public PageRequest 由 Step 8 显式映射。 */
export interface RepositoryPageRequest {
  readonly cursor: Optional<RepositoryCursor>;
  readonly limit: number;
}

/** repository 分页结果；缺失与空页语义分开。 */
export interface RepositoryPage<T> {
  readonly items: ReadonlyArray<T>;
  readonly nextCursor: Optional<RepositoryCursor>;
}

/** local UoW handle；具体 transaction/lock/store 类型不得上泄。 */
export interface LocalStateUnitOfWork {
  readonly unitOfWorkRef: LocalUnitOfWorkRef;
  readonly operationRef: Optional<SyncOperationRef>;
  readonly correlationRef: CorrelationRef;
}

/** optimistic write 参数；expectedVersion 不得由 caller 自造。 */
export interface VersionedWrite<T> {
  readonly value: T;
  readonly expectedVersion: ExpectedLocalVersion;
}

/** create 明确要求 key 不存在；update 必须携带 repository read 得到的 version。 */
export type ExpectedLocalVersion =
  | { readonly kind: "absent" }
  | { readonly kind: "version"; readonly value: LocalEntityVersion };

/** repository/adapter 的已规范化基础错误。 */
export type ApplicationPortError =
  | { readonly kind: "not_found"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "already_exists"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "concurrency_conflict"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "generation_mismatch"; readonly expected: MetadataGeneration; readonly actual: MetadataGeneration }
  | { readonly kind: "integrity_failure"; readonly safeSummary: SafeFailureSummary }
  | { readonly kind: "known_denied"; readonly safeSummary: SafeFailureSummary }
  | { readonly kind: "unavailable"; readonly capability: string; readonly retryability: "unknown" | "not_retryable" }
  | { readonly kind: "unsupported"; readonly capability: string }
  | { readonly kind: "invalid_external_response"; readonly capability: string; readonly safeSummary: SafeFailureSummary }
  | { readonly kind: "outcome_unknown"; readonly reason: UnknownOutcomeReason; readonly attemptRef: Optional<ExternalAttemptRef> }
  | { readonly kind: "local_io_failure"; readonly safeSummary: SafeFailureSummary };

export type PortResult<T> = SyncResult<T, ApplicationPortError>;
```

规则：`RepositoryCursor`、`LocalEntityVersion`、`SourceCursorRef`、`MetadataGeneration`、`IdempotencyKey` 语义互斥；任何 adapter 不得用时间戳、Git object、trace/correlation 或硬编码值互相替代。创建新 entity 使用 `{kind:"absent"}` 并由 repository 原子检查 identity/uniqueness key 不存在；更新必须使用 versioned read 返回的 `{kind:"version",value}`。`limit` 的上限与默认值由 Step 14/04 配置契约，输入仍须验证为正整数。

### 7.2 UnitOfWork、Clock、ID 与 Digest

```ts
/** 构造和收束 local-only transaction；绝不宣称跨 SDK/Git/filesystem 的分布式事务。 */
export interface LocalStateUnitOfWorkPort {
  begin(context: BeginLocalUnitOfWorkContext): Promise<PortResult<LocalStateUnitOfWork>>;
  commit(unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalCommitReceipt>>;
  rollback(unitOfWork: LocalStateUnitOfWork, cause: SafeFailureSummary): Promise<PortResult<LocalRollbackReceipt>>;
}

/** 唯一业务时间来源。 */
export interface ClockPort {
  now(): ObservedAt;
}

/** 按允许 kind 生成 local opaque ID；不得生成 owner refs。 */
export interface IdPort {
  next<K extends LocalIdentityKind>(kind: K): OpaqueRef<K>;
}

/** 对 canonical bounded input 计算不同语义的 digest/fingerprint。 */
export interface DigestPort {
  contentFingerprint(input: CanonicalContentFingerprintInput): Promise<PortResult<ContentFingerprintRef>>;
  candidateDigest(input: CanonicalCandidateDigestInput): Promise<PortResult<CandidateDigestRef>>;
  provenanceDigest(input: CanonicalProvenanceDigestInput): Promise<PortResult<ProvenanceDigestRef>>;
  requestDigest(input: CanonicalRequestDigestInput): Promise<PortResult<RequestDigestRef>>;
}
```

`Canonical*Input` 只能包含 sorted typed refs、canonical relative paths、safe sizes/modes 与 explicit version markers；不得含 credential、文件正文、provider response、raw stdout/stderr 或 evidence/report body。算法/version ref 必须随 digest 输出可验证，精确选择留 Step 14/04。

### 7.3 Idempotency / stored result port

```ts
/** local command/consumer/job 重放记录；不替代外部 owner idempotency contract。 */
export interface SyncIdempotencyRepository {
  get(identity: SyncIdempotencyIdentity): Promise<PortResult<Optional<Versioned<SyncIdempotencyRecord>>>>;
  reserve(record: SyncIdempotencyRecord, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<IdempotencyReservation>>;
  complete(write: VersionedWrite<SyncIdempotencyRecord>, result: StoredIdempotencyCompletion, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<void>>;
  markOutcomeUnknown(write: VersionedWrite<SyncIdempotencyRecord>, result: StoredSyncOperationResult, attemptRef: ExternalAttemptRef, checkpointRef: RecoveryCheckpointRef, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<void>>;
}
```

Command stored result 不能替代 Consumer receipt 或 Job result。`StoredSyncOperationResult.completion` 必须是 Step 8 的完整 `SyncCommandProtocolResult`，并用其 `commandName` 判别具体 variant；后两者使用独立、类型安全且可原样重放的 immutable carrier。这里引用的 command/result、`ConsumerReceipt`、`SyncJobName` 与三个 job result 是 Step 8 `contracts` 的唯一公共类型，不得另造同义 DTO。

```ts
/** 已完成 consumer 的 body-free receipt；不保存 inbound payload。 */
export interface StoredConsumerReceipt {
  readonly consumerName: SyncInboundConsumerName;
  readonly eventId: EventId;
  readonly idempotencyKey: IdempotencyKey;
  readonly requestDigestRef: RequestDigestRef;
  readonly receipt: ConsumerReceipt;
  readonly completedAt: ObservedAt;
}

/** 三个 public job 的完整 typed result union；duplicate 必须回放同一 variant。 */
export type SyncJobProtocolResult =
  | MetadataIntegrityScanResult
  | PendingHandoffProbeJobResult
  | SnapshotStalenessScanResult;

/** 已完成 job 的 immutable replay record；report 不能退化成 counts-only marker。 */
export interface StoredSyncJobResult {
  readonly jobName: SyncJobName;
  readonly jobRunRef: JobRunRef;
  readonly idempotencyKey: IdempotencyKey;
  readonly requestDigestRef: RequestDigestRef;
  readonly result: SyncJobProtocolResult;
  readonly completedAt: ObservedAt;
}

/** Idempotency completion的唯一typed union；禁止把consumer/job伪装成command result。 */
export type StoredIdempotencyCompletion =
  | { readonly kind: "command"; readonly result: StoredSyncOperationResult }
  | { readonly kind: "consumer"; readonly result: StoredConsumerReceipt }
  | { readonly kind: "job"; readonly result: StoredSyncJobResult };

export interface ConsumerReceiptRepository {
  getByEventId(consumerName: SyncInboundConsumerName, eventId: EventId): Promise<PortResult<Optional<StoredConsumerReceipt>>>;
  getByIdempotencyKey(consumerName: SyncInboundConsumerName, key: IdempotencyKey): Promise<PortResult<Optional<StoredConsumerReceipt>>>;
  append(record: StoredConsumerReceipt, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
}

export interface SyncJobResultRepository {
  getByRun(jobName: SyncJobName, runRef: JobRunRef): Promise<PortResult<Optional<StoredSyncJobResult>>>;
  getByIdempotencyKey(jobName: SyncJobName, key: IdempotencyKey): Promise<PortResult<Optional<StoredSyncJobResult>>>;
  append(record: StoredSyncJobResult, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
}

/** Step 6 application-local proof/transition/result/invocation carriers的append-only store。 */
export interface LocalExecutionRecordRepository {
  getEligibilityProof(ref: EligibilityProofRef): Promise<PortResult<EligibilityProofRecord>>;
  appendEligibilityProof(record: EligibilityProofRecord, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
  getOperationTransition(ref: OperationTransitionRef): Promise<PortResult<Extract<LocalTransitionRecord, { readonly transitionFamily: "operation" }>>>;
  getMetadataTransition(ref: MetadataTransitionRef): Promise<PortResult<Extract<LocalTransitionRecord, { readonly transitionFamily: "metadata" }>>>;
  appendTransition(record: LocalTransitionRecord, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
  getLocalResult(ref: LocalOperationResultRef): Promise<PortResult<LocalOperationResultRecord>>;
  appendLocalResult(record: LocalOperationResultRecord, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
  getHandoffInvocation(ref: HandoffInvocationRef): Promise<PortResult<HandoffInvocationIdentity>>;
  getProbeInvocation(ref: ProbeInvocationRef): Promise<PortResult<ProbeInvocationIdentity>>;
  appendInvocation(record: ExternalInvocationIdentity, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
}

/** Step 14 runtime composition 的 body-free immutable binding snapshot store。 */
export interface RuntimeBindingSnapshotRepository {
  get(ref: RuntimeBindingSnapshotRef): Promise<PortResult<AdapterCapabilitySnapshot>>;
  ensure(snapshot: AdapterCapabilitySnapshot, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<RuntimeBindingSnapshotEnsureResult>>;
}
```

`ConsumerReceiptRepository` 以 `(consumerName,eventId)` 和 `(consumerName,idempotencyKey)` 双唯一，`SyncJobResultRepository` 以 `(jobName,jobRunRef)` 和 `(jobName,idempotencyKey)` 双唯一；相同 namespaced key 但 request digest 不同必须返回 typed conflict。两者只能与 owning local transitions、`SyncIdempotencyRepository.complete({kind:"consumer"|"job",...})` 在同一 local UoW append；duplicate read 返回完整 stored result，不能重新解析 payload、扫描 target 或调用 probe。物理 key、serialization 与 crash consistency 留 Step 11，`SYNC-UP-005/006` 未关闭。

`LocalExecutionRecordRepository` 的 append identity必须唯一且record内ref与判别项一致；typed get不得把 operation/metadata transition或handoff/probe invocation交叉返回。transition/result records必须与引用它们的subject revision/provenance同UoW，invocation必须在external call前与attempt/probe revision同UoW。Repository不生成ref、不推导state、不允许update/delete；missing record是integrity failure，不能用临时ref继续。

`RuntimeBindingSnapshotRepository` 只保存 Step 14 exact capability 的 body-free snapshot。每个runtime composition只创建一个immutable snapshot；mutation首次引用时必须在operation初始UoW exact `ensure`，后续operation可复用同ref，只有全字段相同时返回`existing_exact`。plan/candidate/attempt只可沿用owning operation的exact ref。Repository不允许update/delete，相同ref不同内容、missing或mismatched ref是consistency defect，不能从当前config或availability重建历史语境。

| 规则 | 契约 |
|---|---|
| identity | `SyncIdempotencyIdentity(channel, operationName, key)` 是唯一 namespace；裸 key 不得跨 Command/Consumer/Job 或 operation 比较。 |
| first use | request digest相同才允许 reserve；identity碰撞/digest不同返回 typed conflict。 |
| duplicate known | 返回 stored result，不重新执行 domain transition或external call。 |
| duplicate unknown | 返回 probe-required/needs-action；不得重新 submit。 |
| transaction | local result 与 local truth transition 尽量同 UoW；external call 前必须 durable prepare。 |
| blocker | external equivalence/key/probe 合同仍受 `SYNC-UP-005` 阻断。 |

### 7.4 Port capability 归属总览

| 模块 | 定义 port | 实现 port | 可直接调用 |
|---|---|---|---|
| feature `domain` | 否 | 否 | 否；pure functions only |
| feature `application` / `ports` | 是 | 否 | owning application service |
| `orchestration` | 只定义跨 feature UoW/ID/time/digest/idempotency contract | 否 | coordinator/application only |
| `adapters` | 否 | 是 | 否；由 composition 注入 |
| `cli` / `operations` | 否 | 否 | 只能调用 facade/service，不能直接访问 repo/adapter |
| `composition` | 否 | 组装 | 构造时可见 concrete types；运行期不承载业务规则 |

## 8. `selection_access` ports

### 8.1 capability / 接缝清单

| 对象能力 | Port | 调用方 | 实现方 | blocker |
|---|---|---|---|---|
| owner action/posture check | `OwnerAccessPort` | `SelectionAccessService`/coordinator | `adapters/sdk` | `SYNC-UP-001/003` |
| snapshot read/write | `OwnerSnapshotRepository` | CP1 service/query | `adapters/metadata` | `SYNC-UP-006` for physical store |
| operation/evaluation read/write | `SyncOperationRepository`、`AccessEvaluationRepository` | all mutation gate/query | `adapters/metadata` | local schema/UoW pending |

### 8.2 OwnerAccessPort

```ts
/** 将显式 selection/action 映射为 owner-provided safe eligibility/posture result。 */
export interface OwnerAccessPort {
  checkEligibility(request: OwnerAccessRequest, context: CallContext): Promise<PortResult<OwnerEligibilityResultSet>>;
  readPosture(request: OwnerPostureRequest, context: CallContext): Promise<PortResult<OwnerPostureResult>>;
}
```

| request/result 最小字段 | 约束 |
|---|---|
| `OwnerAccessRequest` | `principalRef`、`projectRef`、`versionRef`、`sourceRef`、`requestedAction`、`actorContextRef`；不接受目录/Git branch/default latest。 |
| `OwnerEligibilityResultSet` | 每个 required check 有明确 `known_allowed/known_denied/blocked/unknown/stale/unsupported`；带 snapshot refs/versions，不带 body。 |
| `OwnerPostureRequest/Result` | owner kind/subject/action context；archive/dissolved/retired 等由 owner 返回，Sync 不重解释。 |

禁止：local allow cache、private endpoint、credential/body 穿透、把 transport success 当 allowed。positive adapter remains blocked until formal SDK surface。

### 8.3 CP1 local repositories

```ts
export interface SyncSelectionRepository {
  get(ref: SyncSelectionRef): Promise<PortResult<SyncSelection>>;
  append(selection: SyncSelection, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
}

export interface SyncOperationRepository {
  getVersioned(ref: SyncOperationRef): Promise<PortResult<Versioned<SyncOperation>>>;
  listActiveBySelection(selectionRef: SyncSelectionRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<SyncOperation>>>>;
  save(write: VersionedWrite<SyncOperation>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface AccessEvaluationRepository {
  getVersioned(ref: AccessEvaluationRef): Promise<PortResult<Versioned<AccessEvaluation>>>;
  findCurrent(selectionRef: SyncSelectionRef, action: SyncOperationKind): Promise<PortResult<Optional<Versioned<AccessEvaluation>>>>;
  save(write: VersionedWrite<AccessEvaluation>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface OwnerSnapshotRepository {
  getVersioned(ref: ExternalOwnerSnapshotRef): Promise<PortResult<Versioned<ExternalOwnerSnapshot>>>;
  listBySubject(subjectRef: ExternalSubjectRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ExternalOwnerSnapshot>>>>;
  save(write: VersionedWrite<ExternalOwnerSnapshot>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
  listStaleOrInvalidated(scope: SnapshotStalenessScope, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ExternalOwnerSnapshot>>>>;
}
```

`findCurrent` 只能返回相同 selection/action 的评价；`listStaleOrInvalidated` 为 `MarkStaleOwnerSnapshots` job 服务，但 job 不调用 owner refresh。所有 save 必须带 expected version；不存在的 ref 显式 `not_found`，不当 empty。

### 8.4 CP1 停审

| 审查项 | 结论 | 缺口 |
|---|---|---|
| object→port | pass | 5 个 CP1 对象均有读/写或 policy 输入面。 |
| owner boundary | pass_with_blocker | `SYNC-UP-001/003` 阻断 positive adapter。 |
| version/UoW | pass | mutable local writes 全带 Versioned + UoW。 |
| stale/job read | pass | listStaleOrInvalidated 覆盖 job，不触发 refresh。 |

## 9. `working_copy_metadata` ports

### 9.1 capability / 接缝清单

| 能力 | Port | 主要读取面 | 主要写入面 |
|---|---|---|---|
| binding/manifest | `WorkingCopyBindingRepository`、`MetadataManifestRepository` | versioned get、findBySelection/target、health slices | generation-checked save/transition |
| cursor/mapping | `CursorStateRepository`、`MappingSetRepository` | current by binding/generation、read for plan/status | expected-version finalize only |
| local observations | `WorkingCopyObservationPort` | inspect target (no-write) | mutation flow may append protected observation; query never persists |
| UoW/metadata lock | `LocalStateUnitOfWorkPort`、`MetadataLockPort` | current generation/lock capability | acquire/release local lock within command boundary |

### 9.2 repositories

```ts
export interface WorkingCopyBindingRepository {
  getVersioned(ref: WorkingCopyBindingRef): Promise<PortResult<Versioned<WorkingCopyBinding>>>;
  findBySelection(selectionRef: SyncSelectionRef): Promise<PortResult<Optional<Versioned<WorkingCopyBinding>>>>;
  findByTarget(targetRef: CanonicalLocalTargetRef): Promise<PortResult<Optional<Versioned<WorkingCopyBinding>>>>;
  save(write: VersionedWrite<WorkingCopyBinding>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface MetadataManifestRepository {
  loadCurrent(targetRef: CanonicalLocalTargetRef): Promise<PortResult<Optional<Versioned<MetadataManifest>>>>;
  getVersioned(ref: MetadataManifestRef): Promise<PortResult<Versioned<MetadataManifest>>>;
  listRecordSummaries(manifestRef: MetadataManifestRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<MetadataRecordSummary>>>;
  saveTransition(write: VersionedWrite<MetadataManifest>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface CursorStateRepository {
  getVersioned(ref: CursorStateRef): Promise<PortResult<Versioned<CursorState>>>;
  findCurrent(bindingRef: WorkingCopyBindingRef, generation: MetadataGeneration): Promise<PortResult<Optional<Versioned<CursorState>>>>;
  save(write: VersionedWrite<CursorState>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface MappingSetRepository {
  getVersioned(ref: MappingSetRef): Promise<PortResult<Versioned<MappingSet>>>;
  findCurrent(bindingRef: WorkingCopyBindingRef, generation: MetadataGeneration): Promise<PortResult<Optional<Versioned<MappingSet>>>>;
  listEntries(ref: MappingSetRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<SourceLocalMappingEntry>>>;
  save(write: VersionedWrite<MappingSet>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface WorkingCopyObservationRepository {
  get(ref: WorkingCopyObservationRef): Promise<PortResult<WorkingCopyObservation>>;
  append(observation: WorkingCopyObservation, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
  findLatestPersisted(bindingRef: WorkingCopyBindingRef): Promise<PortResult<Optional<WorkingCopyObservation>>>;
}
```

### 9.3 observation/lock ports

```ts
/** read-only Git/fs/tool observation；不得执行 fetch/push/merge/rebase/stash。 */
export interface WorkingCopyObservationPort {
  inspect(request: WorkingCopyObservationRequest): Promise<PortResult<WorkingCopyObservationInput>>;
}

/** canonical target/path and protected local changes检查。 */
export interface FilesystemInspectionPort {
  canonicalizeTarget(request: CanonicalizeTargetRequest): Promise<PortResult<CanonicalLocalTargetRef>>;
  inspectTarget(request: FilesystemInspectionRequest): Promise<PortResult<FilesystemObservationResult>>;
}

/** metadata command 的 local lock；query 不得注入此 port。 */
export interface MetadataLockPort {
  acquire(request: MetadataLockRequest): Promise<PortResult<LocalLockLease>>;
  release(lease: LocalLockLease): Promise<PortResult<void>>;
}
```

Lock unavailable/unknown 必须 typed 返回，不得当 clean/safe。Observation input 只含已规范化 axes/fingerprints/tool capability；raw stdout/stderr/file body 禁止。

### 9.4 CP2 停审

| 审查项 | 结论 | 缺口 |
|---|---|---|
| object→read/write | pass | 7 objects 的 current/versioned/summaries 面齐全。 |
| query no-write | pass | Query composition 不持有 UoW/lock/write ports。 |
| generation/provenance | pass_with_blocker | physical `.qs-sync` schema `SYNC-UP-006`。 |
| Git/fs safety | pass_with_blocker | exact mapping/path/dirty contract `007/010`。 |

## 10. `source_materialization` ports

### 10.1 capability / 接缝清单

| 能力 | Port | 调用方 | 禁止 |
|---|---|---|---|
| source locator/delta | `MaterialSourcePort` | source service | owner body、guessed comparator/latest |
| plan/run persistence | `MaterializationPlanRepository`、`MaterializationRunRepository` | source service/recovery | plan/run 作为 source truth |
| local Git apply | `GitWorktreePort` | materialization flow | remote/push/merge/rebase/stash |
| path stage/commit | `FilesystemApplyPort` | materialization flow | path escape/dirty overwrite/implicit delete |

### 10.2 MaterialSourcePort

```ts
export interface MaterialSourcePort {
  resolveSource(request: MaterialSourceRequest, context: CallContext): Promise<PortResult<MaterialSourceResolution>>;
  readDelta(request: SourceDeltaRequest, context: CallContext): Promise<PortResult<OwnerSourceDeltaResult>>;
  readCapabilities(request: MaterialSourceCapabilityRequest, context: CallContext): Promise<PortResult<SourceCapabilitySet>>;
}
```

`SourceDeltaRequest` 必须明确 sourceRef/fromCursorRef/local generation/comparator contract ref/selection context；不能传 implicit latest。`OwnerSourceDeltaResult` 只能包含 source item/version/path-safe locator/digest/ref/continuity proof 等 safe fields。`readCapabilities` 返回 `supported/unsupported/unknown`，不能以 SDK call 成功代替 capability contract。

### 10.3 Plan/run repositories

```ts
export interface MaterializationPlanRepository {
  getVersioned(ref: MaterializationPlanRef): Promise<PortResult<Versioned<MaterializationPlan>>>;
  findActive(operationRef: SyncOperationRef): Promise<PortResult<Optional<Versioned<MaterializationPlan>>>>;
  save(write: VersionedWrite<MaterializationPlan>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface MaterializationRunRepository {
  getVersioned(ref: MaterializationRunRef): Promise<PortResult<Versioned<MaterializationRun>>>;
  listByOperation(operationRef: SyncOperationRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<MaterializationRun>>>>;
  findLatestForPlan(planRef: MaterializationPlanRef): Promise<PortResult<Optional<Versioned<MaterializationRun>>>>;
  save(write: VersionedWrite<MaterializationRun>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface SourceDeltaRepository {
  get(ref: SourceDeltaRef): Promise<PortResult<SourceDelta>>;
  append(delta: SourceDelta, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
}

export interface PathChangeSetRepository {
  getVersioned(ref: PathChangeSetRef): Promise<PortResult<Versioned<PathChangeSet>>>;
  save(write: VersionedWrite<PathChangeSet>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}
```

### 10.4 Git/filesystem apply ports

```ts
/** 明确白名单的 local worktree change；不接收 arbitrary command/string。 */
export interface GitWorktreePort {
  prepareLocalChange(request: GitLocalPrepareRequest): Promise<PortResult<GitLocalPrepareReceipt>>;
  applyPreparedChange(request: GitLocalApplyRequest, lease: LocalLockLease): Promise<PortResult<GitLocalApplyResult>>;
  inspectCapability(request: GitCapabilityRequest): Promise<PortResult<LocalToolCapabilitySet>>;
}

/** root-bound、non-overwrite 的 filesystem stage/commit seam。 */
export interface FilesystemApplyPort {
  stageChanges(request: FilesystemStageRequest, lease: LocalLockLease): Promise<PortResult<FilesystemStageReceipt>>;
  commitStagedChanges(request: FilesystemCommitRequest, lease: LocalLockLease): Promise<PortResult<FilesystemCommitResult>>;
  abortPreparedLocalChange(request: LocalAbortRequest, lease: LocalLockLease): Promise<PortResult<LocalAbortResult>>;
}
```

每个 request 必须含 canonical target/root、bounded path change set、precondition fingerprints、non-overwrite mode 与 operation/checkpoint refs；不得含 remote URL、push refspec、merge strategy、stash instruction 或 arbitrary shell argv。`abortPreparedLocalChange` 只允许撤销尚未发生的 local prepared stage；不承诺 rollback 已知用户修改。

### 10.5 CP3 停审

| 审查项 | 结论 | 缺口 |
|---|---|---|
| source read面 | pass_with_blocker | source authority/comparator `002/008`。 |
| plan/run read/write | pass | active/latest/by operation 查询齐全。 |
| local safety | pass | Git/fs request 是 bounded typed request。 |
| forbidden actions | pass | no remote/push/merge/rebase/stash/overwrite。 |

## 11. `conflict_recovery` ports

### 11.1 repositories

```ts
export interface ConflictRepository {
  getVersioned(ref: ConflictRecordRef): Promise<PortResult<Versioned<ConflictRecord>>>;
  listOpenByOperation(operationRef: SyncOperationRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ConflictRecord>>>>;
  listByBinding(bindingRef: WorkingCopyBindingRef, states: ReadonlyArray<ConflictState>, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ConflictRecord>>>>;
  listAffectedBy(ref: AffectedSyncRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ConflictRecord>>>>;
  saveTransition(write: VersionedWrite<ConflictRecord>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface RecoveryCheckpointRepository {
  getVersioned(ref: RecoveryCheckpointRef): Promise<PortResult<Versioned<RecoveryCheckpoint>>>;
  findActive(operationRef: SyncOperationRef): Promise<PortResult<Optional<Versioned<RecoveryCheckpoint>>>>;
  listProbeRequired(page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<RecoveryCheckpoint>>>>;
  saveTransition(write: VersionedWrite<RecoveryCheckpoint>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface ManualResolutionRepository {
  getVersioned(ref: ManualResolutionRef): Promise<PortResult<Versioned<ManualResolution>>>;
  listByConflict(conflictRef: ConflictRecordRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ManualResolution>>>>;
  save(write: VersionedWrite<ManualResolution>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface ProbeRecordRepository {
  getVersioned(ref: ProbeRecordRef): Promise<PortResult<Versioned<ProbeRecord>>>;
  findLatestForAttempt(attemptRef: ExternalAttemptRef): Promise<PortResult<Optional<Versioned<ProbeRecord>>>>;
  listPending(page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ProbeRecord>>>>;
  save(write: VersionedWrite<ProbeRecord>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}
```

### 11.2 RecoveryProbePort

```ts
/** 对已经持久化的 external attempt 做正式只读 probe；不重放 submit。 */
export interface RecoveryProbePort {
  probeExternalAttempt(request: RecoveryProbeRequest, context: CallContext): Promise<PortResult<RecoveryProbeResult>>;
  probeCapability(request: RecoveryProbeCapabilityRequest, context: CallContext): Promise<PortResult<ProbeCapabilityResult>>;
}
```

Request 必须带 prior `attemptRef`、idempotency context、governance target、probe kind 与 correlation；没有 prior attempt、没有正式 capability、返回仍 unknown 时分别为 typed invalid/unsupported/outcome_unknown。telemetry/log/timeout 不得实现 probe result。

### 11.3 CP4 停审

| 审查项 | 结论 | 缺口 |
|---|---|---|
| repository read面 | pass | open/active/probe-pending/latest 查询齐全。 |
| intent/effect | pass | ManualResolution/Checkpoint/Probe 独立。 |
| unknown | pass_with_blocker | formal probe/idempotency `004/005`。 |
| history | pass | save transition/append semantics；无 delete。 |

## 12. `review_handoff_provenance` ports

### 12.1 repositories/read surfaces

```ts
export interface ReviewCandidateRepository {
  getVersioned(ref: ReviewCandidateRef): Promise<PortResult<Versioned<ReviewCandidate>>>;
  findActiveByOperation(operationRef: SyncOperationRef): Promise<PortResult<Optional<Versioned<ReviewCandidate>>>>;
  listFrozenByBinding(bindingRef: WorkingCopyBindingRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ReviewCandidate>>>>;
  save(write: VersionedWrite<ReviewCandidate>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
  appendEligibilityEvaluation(evaluation: CandidateEligibilityEvaluation, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
  getEligibilityEvaluation(ref: CandidateEligibilityEvaluationRef): Promise<PortResult<CandidateEligibilityEvaluation>>;
}

export interface HandoffAttemptRepository {
  getVersioned(ref: HandoffAttemptRef): Promise<PortResult<Versioned<HandoffAttempt>>>;
  findByExternalHandoffRef(ref: ExternalHandoffRef): Promise<PortResult<Optional<Versioned<HandoffAttempt>>>>;
  listByCandidate(candidateRef: ReviewCandidateRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<HandoffAttempt>>>>;
  listProbeRequired(page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<HandoffAttempt>>>>;
  save(write: VersionedWrite<HandoffAttempt>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface ProvenanceRepository {
  getVersioned(ref: ProvenanceRecordRef): Promise<PortResult<Versioned<ProvenanceRecord>>>;
  listBySubject(subjectRef: LocalProvenanceSubjectRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ProvenanceRecord>>>>;
  listParents(ref: ProvenanceRecordRef, page: RepositoryPageRequest): Promise<PortResult<RepositoryPage<Versioned<ProvenanceRecord>>>>;
  append(record: ProvenanceRecord, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<AppendReceipt>>;
  saveProtectedTransition(write: VersionedWrite<ProvenanceRecord>, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<LocalWriteReceipt>>;
}

export interface SyncStatusReadPort {
  loadStatusSlices(query: SyncStatusReadQuery): Promise<PortResult<SyncStatusSliceSet>>;
  loadHandoffSlices(query: HandoffStatusReadQuery): Promise<PortResult<HandoffStatusSliceSet>>;
  loadProvenanceView(query: ProvenanceReadQuery): Promise<PortResult<ProvenanceViewSlice>>;
}

/** Conditional consumers 专用的 source-attributed target resolution；只返回 typed local refs。 */
export interface InboundInvalidationTargetReadPort {
  resolveAccessOrPostureTargets(payload: AccessOrPostureInvalidatedPayload): Promise<PortResult<AccessInvalidationTargetSet>>;
  resolveMaterialSourceTargets(payload: MaterialSourceInvalidatedPayload): Promise<PortResult<MaterialSourceInvalidationTargetSet>>;
}

export interface AccessInvalidationTargetSet {
  readonly orderingDisposition: "applicable" | "stale_event" | "ambiguous";
  readonly snapshotRefs: ReadonlyArray<ExternalOwnerSnapshotRef>;
  readonly evaluationRefs: ReadonlyArray<AccessEvaluationRef>;
  readonly planRefs: ReadonlyArray<MaterializationPlanRef>;
  readonly candidateRefs: ReadonlyArray<ReviewCandidateRef>;
}

export interface MaterialSourceInvalidationTargetSet {
  readonly orderingDisposition: "applicable" | "stale_event" | "ambiguous";
  readonly cursorStateRefs: ReadonlyArray<CursorStateRef>;
  readonly planRefs: ReadonlyArray<MaterializationPlanRef>;
  readonly candidateRefs: ReadonlyArray<ReviewCandidateRef>;
}

/** Persisted diagnostic query 的 body-free source；不读取日志、stdout/stderr 或生成 report。 */
export interface SyncDiagnosticReadPort {
  loadDiagnosticSummarySlices(query: SyncDiagnosticReadQuery): Promise<PortResult<SyncDiagnosticSummarySliceSet>>;
}
```

`SyncStatusReadPort` 只能由 read-only composition 构造；其返回中每个 slice 明确 `present/missing/restricted/unavailable/stale`，不得把 missing 变成空集合。分页 helper 与 public page DTO 的映射由 Step 8 明确，port 不泄露 store cursor semantics。

`listByBinding` 必须由 typed affected-ref index实现，不允许 service 全库扫描或解析 ref 字符串。`InboundInvalidationTargetReadPort` 只接受已通过 envelope/source/schema runtime validation 的 Step 8 payload；`orderingDisposition=ambiguous` 时 consumer 必须 quarantine/block，不能推进状态。`findByExternalHandoffRef` 只接受正式 owner ref mapping；missing/ambiguous 不创建 attempt。`SyncDiagnosticSummarySliceSet` 每个 slice必须携带 present/missing/restricted/unavailable marker与 safe failure code/ref，禁止从 exception text或日志拼装。

### 12.2 ReviewHandoff/Decision/Diagnostics

```ts
/** 受控 review handoff call；call 前必须有 durable HandoffAttempt.Prepared。 */
export interface ReviewHandoffPort {
  submitCandidate(request: ReviewHandoffRequest, context: CallContext): Promise<PortResult<ReviewHandoffTransportResult>>;
}

/** 只读读取 owner handoff/Decision safe state；不创建/修改 Gate 或 Decision。 */
export interface ReviewDecisionReadPort {
  readHandoffState(request: ReviewHandoffStateRequest, context: CallContext): Promise<PortResult<ReviewHandoffStateResult>>;
}

/** body-free diagnostics sink；sink failure 不改变业务结果。 */
export interface DiagnosticsPort {
  emitSafeDiagnostic(record: SafeDiagnosticRecord, context: CorrelationContext): Promise<PortResult<DiagnosticEmissionResult>>;
}

/** cross-cutting、non-throwing技术信号；exact closed records由Step 15定义。 */
export interface SyncTelemetryPort {
  tryEmitLog(record: SyncStructuredLogRecord): TelemetryEmissionDisposition;
  tryRecordMetric(record: SyncMetricRecord): TelemetryEmissionDisposition;
  tryStartSpan(input: SyncSpanStart): SyncResult<SyncSpanHandle, TelemetryStartError>;
}
```

`ReviewHandoffTransportResult` 必须区分 `knownAcceptedByTransport`、`knownRejected`、`transportUnavailable`、`outcomeUnknown`，并只带 safe refs/summaries；不存在 `accepted=true` 单字段。`ReviewDecisionReadPort` 返回 owner decision ref/state/visibility/freshness，不能由 Sync 创建本地 Decision。

`DiagnosticsPort`仍只承接body-free support diagnostic，`SyncTelemetryPort`只承接runtime log/metric/span；两者不是同一业务语义，虽由同一diagnostics adapter family实现也不得互相回填。`DiagnosticsPort`的`Promise<PortResult<...>>`外层若reject或返回任一port error，application wrapper必须归一为isolated diagnostic failure并保留原业务结果；不得抛回业务flow、rollback、retry effect、创建checkpoint或关闭unknown。`SyncTelemetryPort`本身不得抛出，sink异常只返回`dropped/unavailable`或typed start error。

### 12.3 CP5 停审

| 审查项 | 结论 | 缺口 |
|---|---|---|
| candidate/attempt/provenance read/write | pass | freeze、probe、graph、status slices 均有接口。 |
| ACK/Decision | pass_with_blocker | `SYNC-UP-004/005`。 |
| provenance | pass | append/protected transition，无 delete。 |
| diagnostics | pass | failure isolated，raw body rejected。 |

## 13. 条件性 consumers、jobs 与 adapter availability

### 13.1 Inbound consumer port

```ts
/** 只有正式 owner event contract 闭合后才启用的 source-attributed envelope。 */
export interface InboundSyncEventConsumerPort {
  consumeAccessOrPostureInvalidated(envelope: AccessOrPostureInvalidatedEnvelope): Promise<PortResult<ConsumerReceipt>>;
  consumeMaterialSourceInvalidated(envelope: MaterialSourceInvalidatedEnvelope): Promise<PortResult<ConsumerReceipt>>;
  consumeReviewDecisionChanged(envelope: ReviewDecisionChangedEnvelope): Promise<PortResult<ConsumerReceipt>>;
}
```

Consumer adapter/handler 只能写 local stale/snapshot/invalidation records，经 owning service + UoW；handler 的 duplicate branch 必须先读 `ConsumerReceiptRepository` 并原样回放 `ConsumerReceipt`，accepted branch 与 local transitions 同 UoW append receipt；不能直接访问 repository implementation，不能触发 pull/apply/push/probe/retry。未闭合 envelope/schema/dedup/source attribution 时 composition capability=`blocked`。

### 13.2 Operations job ports

```ts
export interface SyncMaintenanceJobPort {
  scanMetadataIntegrity(input: MetadataIntegrityScanInput): Promise<PortResult<MetadataIntegrityScanResult>>;
  probePendingHandoffAttempts(input: PendingHandoffProbeInput): Promise<PortResult<PendingHandoffProbeJobResult>>;
  markStaleOwnerSnapshots(input: SnapshotStalenessScanInput): Promise<PortResult<SnapshotStalenessScanResult>>;
}
```

Job port 只允许 scan/probe/stale；entry duplicate 先通过 `SyncJobResultRepository` 返回完整 typed result，每个 target 的 duplicate/no-op/result再由 idempotency repository支撑。完成 branch 必须 append `StoredSyncJobResult`，不存在 auto-repair/migrate/pull/merge/push/replay job。

### 13.3 AdapterAvailabilityPort

```ts
export interface AdapterAvailabilityPort {
  getCapabilitySnapshot(): Promise<PortResult<AdapterCapabilitySnapshot>>;
  assertCapability(capability: SyncAdapterCapability): Promise<PortResult<void>>;
}
```

Capability snapshot 是 composition/runtime disposition，不是 owner authorization 或 readiness；`unsupported/blocked/unknown` 必须显式返回。

## 14. Adapter 实现矩阵与入口限制

| Adapter family | 实现位置 | 输入解码 | 可实现 port | 明确禁止 | 状态 |
|---|---|---|---|---|---|
| SDK owner/source/handoff/probe | `src/adapters/sdk/*` | `unknown`→runtime validator→safe local result | OwnerAccess/MaterialSource/ReviewHandoff/DecisionRead/RecoveryProbe | private endpoint、provider body、ACK elevation、本地授权 | positive blocked by `001/002/003/004/005` |
| metadata/local repositories | `src/adapters/metadata/*` | logical record validator、generation check | all local repositories/UoW/idempotency/execution records/runtime binding snapshots/receipt/job results | 未批准 physical schema、silent delete/rebind/provenance loss | schema blocked `006` |
| Git observation/worktree | `src/adapters/git/*` | bounded process/tool result normalizer | WorkingCopyObservation/GitWorktree | remote fetch/push/merge/rebase/stash/arbitrary shell | matrix pending `007/009/010` |
| filesystem inspect/apply | `src/adapters/filesystem/*` | canonical path/permission/symlink validator | FilesystemInspection/Apply/lock | root escape、dirty overwrite、implicit delete | exact contract blocked `010` |
| diagnostics / telemetry | `src/adapters/diagnostics/*` | redact/size/type validator + closed record constructor | DiagnosticsPort + SyncTelemetryPort | evidence/report/verdict/readiness、raw output、任意attributes map、sink结果驱动业务 | external surface pending `001`; local no-op/drop-capable seam planned |
| in-memory test doubles | `tests` only, planned | same typed result/negative behavior | contract seams | fake closes upstream blocker or proves integration | planned/not_created |

### 14.1 Async/error boundary

- 所有外部/存储/工具 port 为 `Promise<PortResult<T>>`；纯 Clock/ID 可同步。
- adapter 必须把 rejected promise、exit code、malformed payload、timeout、credential error 映射到 typed `ApplicationPortError`；若副作用是否发生无法证明，必须 `outcome_unknown` 并带 attempt/checkpoint ref。
- provider raw error/body 不得写 domain、metadata、status、log；safe summary 只保留 code、typed refs、redaction marker。
- adapter 不得在 error mapping 中创建/推进 domain state；状态变化由 Step 9 application flow 调对象函数并写 UoW。

### 14.2 Entry restrictions

| 入口 | 可调用 | 禁止 |
|---|---|---|
| `cli/*_entry.ts` | public facade、safe presenter、explicit parser result | direct port/adapter、默认 selection、raw output、domain transition |
| `operations/consumers/*` | owning consumer service + idempotency/UoW via facade | direct repository、auto pull/apply/retry、private topic |
| `operations/jobs/*` | bounded job service | auto repair/migrate/push/merge/rebase、global daemon truth |
| `composition/*` | construct/inject all capabilities; read/write graph split | fake in production、default allow、hard-gate override |

## 15. 模块内停审记录

| 模块 | object capability | read/write closure | dependency boundary | 结论 |
|---|---|---|---|---|
| CP1 | operation/evaluation/snapshot/owner check | versioned + stale scan | owner truth external | pass_with_blocker |
| CP2 | binding/manifest/cursor/mapping/observation | current/versioned/summary + UoW/lock | query read-only | pass_with_blocker |
| CP3 | delta/plan/path/run/apply | source/capability + plan/run + bounded apply | no remote Git | pass_with_blocker |
| CP4 | conflict/checkpoint/resolution/probe | active/open/pending lists + protected history | no blind retry | pass_with_blocker |
| CP5 | candidate/attempt/provenance/views | freeze/probe/graph/slices + append | ACK≠Decision | pass_with_blocker |
| operations | consumers/jobs | envelope/job input/result/idempotency + durable receipt/report replay | blocked until formal event | pass_with_blocker |

## 16. 跨模块接缝闭环审计

| 审计项 | 结论 | 修正/限制 |
|---|---|---|
| Step 6 每个对象是否有 port 或纯 policy closure | pass | 29 对象均有 repository/port/read view 或纯 domain policy。 |
| repository read面是否覆盖 Step 8 DTO、Step 9 flow、Step 10 state | pass | getVersioned/current/list/open/probe/status/graph、execution proof/transition/result/invocation与 consumer receipt/job result replay 面均列出。 |
| write version/UoW 来源 | pass | Mutable operation/binding/manifest/cursor/mapping/plan/path/run/conflict/checkpoint/resolution/probe/candidate/attempt/provenance先Versioned read→expectedVersion→UoW；真正immutable selection/observation/delta与receipt/result使用append。 |
| query 是否得到 mutation capability | pass | SyncStatusReadPort/Query composition 类型分离。 |
| owner/source/handoff/probe surface | pass_with_blockers | `SYNC-UP-001~005` 未闭合，positive adapter 不 ready。 |
| metadata/Git/fs physical/command contract | pass_with_blockers | `SYNC-UP-006~010` 未闭合。 |
| adapter raw body/credential/provenance | pass | decode/redact/reject boundary 明确。 |
| consumer/outbound event | pass | inbound conditional；outbound not applicable，不虚构 outbox。 |
| cross-feature cycle | pass | 只经 typed refs/application contracts/coordinator。 |

## 17. Step 8 承接清单

| 协议族 | Step 7 已提供 | Step 8 必须补齐 |
|---|---|---|
| Commands | application service 的 typed input/result、owning ports与`LocalExecutionRecordRepository` | public request/result schema、actor/meta/idempotency、error mapping |
| Queries | read repositories/page/status slice、no-write composition | response view/page/marker schema、missing/degraded semantics |
| Consumers | envelope consumer port、dedup/UoW、`ConsumerReceiptRepository` | event envelope/payload/version/disposition/quarantine schema；仍 blocked |
| Jobs | maintenance job port、target/result/idempotency、`SyncJobResultRepository` | job input/output/report schema、batch/duplicate behavior |
| Outbound events | 明确 `not_applicable` | 不得新造 topic/outbox；若变更须回退 02 |

## 18. 回填草稿

未来正式 §5/§6 摘录 shared helpers、按 CP1～CP5 的 port capability/函数签名、adapter matrix、entry restrictions 与跨接缝审计；不写具体数据库表、SDK endpoint、Git command 或实现事实。

## 19. 待确认事项

- `SYNC-UP-001~010` 全部保持 `pending/blocked`；本步只定义 typed seam 与负向边界。
- 精确 `.qs-sync` physical schema/migration、Node/package/tool choices、SDK method/error mapping、Git LFS/shallow/GUI matrix 仍未闭合。
- Step 8 必须为每个 public DTO 二级类型、page/receipt/report/consumer disposition 写 schema，不得以 `unknown`/`Record<string, unknown>` 代替。

## 20. 进入下一步条件

- [x] shared application ports、UoW/version/id/time/digest/idempotency、execution record 与 consumer receipt/job result replay repositories 已定义。
- [x] CP1～CP5 的 repository/read/write/probe/handoff/diagnostics 接缝均有 typed capability 与 adapter 位置。
- [x] 每个写入函数的 expected version/UoW/append-only 语义明确；读取面覆盖后续 DTO/flow/state。
- [x] query no-write、unknown outcome、Git/fs safety、provenance non-delete、ACK≠Decision 边界通过。
- [x] consumer/job/outbound event 适用性明确，未虚构 event/outbox。
- [x] 未修改正式 03、未创建实现/测试/evidence/implementation ledger/commit。

结论：Step 7 通过 `pass_with_upstream_blockers`；允许按用户授权进入 Step 8。正向 integration 仍需上游合同闭合，不能把 port skeleton 当作已运行实现。
