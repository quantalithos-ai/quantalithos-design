# Step 6. 逐模块定义对象实现契约

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节：未来正式 `03-详细设计.md` §5 对象实现契约与 §6 全局索引
- 框架参考：`projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md`；采用其“批次计划→shared vocabulary→逐模块 capability→对象卡→模块停审→跨模块审计”粒度，TypeScript 适配后不复制 Rust 对象或 Governance truth。
- 正式 03 写入：`false`

### 1.1 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| 6.1 | TypeScript 表达约定、shared refs/results/states、非 core carrier 决策 | completed | yes | pass_with_blockers | 6.2 |
| 6.2 | CP1 Selection & Access 五对象 | completed | yes | pass_with_blockers | 6.3 |
| 6.3 | CP2 Working Copy & Metadata 七对象 | completed | yes | pass_with_blockers | 6.4 |
| 6.4 | CP3 Source Materialization 五对象 | completed | yes | pass_with_blockers | 6.5 |
| 6.5 | CP4 Conflict & Recovery 五对象 | completed | yes | pass_with_blockers | 6.6 |
| 6.6 | CP5 Review Handoff & Provenance 七对象 | completed | yes | pass_with_blockers | 6.7 |
| 6.7 | 字段来源、状态、命名、跨模块依赖与 Step 7 承接审计 | completed | yes | pass_with_blockers | Step 7 |

### 1.2 模块执行顺序

| 顺序 | 模块 | 模块职责 | 输入来源 | 完成后停审点 |
|---|---|---|---|---|
| 1 | shared vocabulary / technical carriers | 类型安全、跨模块传递、错误与状态基础 | Step 3/5、正式 02 §6/§7 | 所有对象字段类型有合法归属 |
| 2 | `selection_access` | explicit selection 与 owner eligibility | CP1 五对象 | owner truth 未内化，fail-closed |
| 3 | `working_copy_metadata` | binding/metadata/cursor/mapping/observation | CP2 七对象 | query no-write、generation/provenance 闭合 |
| 4 | `source_materialization` | delta/plan/path/run/finalize | CP3 五对象 | 仅 AppliedPendingFinalize 可构造同 UoW 的 cursor/mapping/run revisions；commit 后三者与 Finalized 同时可见 |
| 5 | `conflict_recovery` | conflict/checkpoint/manual/probe | CP4 五对象 | intent≠effect、unknown≠retry |
| 6 | `review_handoff_provenance` | candidate/attempt/provenance/layered status | CP5 七对象 | ACK≠Decision、commit≠Artifact/Baseline |
| 7 | cross-module audit | 字段/状态/依赖/后续 seam | 全部对象 | 29 对象与 Step 7 ports 一一承接 |

## 2. 本步输入

| 输入 | 本步用途 |
|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 固定对象模块归属、依赖方向与 non-core 边界。 |
| 正式 02 §6 | 29 个对象 identity、字段语义、状态、函数与禁止事项的唯一概要基线。 |
| 正式 02 §7～§10 | 确认对象能力须支撑的协议、flow、状态与异常姿态。 |
| `03_ddd_step_03_coding_runtime_constraints.md` | TypeScript strict/ESM、JSDoc、readonly、unknown narrowing、typed async result。 |
| `L1-governance` Step 6 | 对象卡与逐模块停审粒度；不继承其 Rust 类型、对象数量或业务规则。 |

## 3. SOP 问题回答

1. **是否先建骨架与批次？** 是；§1 明确七批与串行停审点。
2. **是否需要 shared vocabulary？** 是；refs、time、digest、safe summary、result/error、state enum 和只读集合先收敛，禁止全局 `any/string/map`。
3. **对象如何从 capability 推导？** 每个 CP 先列 capability 与对象映射，再写对象字段、工厂/成员函数、状态和不变量。
4. **非 core 模块如何闭口？** 稳定的 application context、stored-result marker、adapter availability 和 entry disposition 在本步定义为 technical carriers；Command/Query DTO、port、adapter、flow 分别由 Step 7～9 闭口，不能伪装成第 30 个 domain truth。
5. **字段从哪里来？** command explicit input、local id/clock/digest、repository load、owner port safe result、Git/fs observation、domain derivation六类；每个字段表逐项写来源。
6. **外部合同未闭合怎么办？** 对应类型保留 `Blocked/Unknown/Unsupported` variant，positive variant 的构造仅允许正式 adapter；不发明 provider DTO/method/schema。
7. **对象能否直接做 I/O？** 不能。对象与 policy 均为同步、确定性 TypeScript 逻辑；I/O 只由 Step 7 ports 和 Step 9 application flows 承担。

## 4. 当前文档问题诊断

正式 02 已收稳对象轮廓，但仍使用语言中立的 `Optional<T>`、`Set` 和成员函数表达，无法直接决定 TypeScript 的 null/readonly/result/error 形态；同时大量二级 refs/reasons/rules 若不先给归属，Step 7/8 会以字符串或 provider DTO 临时补齐。本步将其转换为可声明的 TypeScript 契约，同时把物理 metadata、owner payload、CLI schema 等后续责任保持在正确 Step。

## 5. 改动前后对比

| 项 | 概要轮廓 | Step 6 实现契约 |
|---|---|---|
| optional/set | 语言中立 `Optional/Set` | `T | null` 与去重的 `ReadonlyArray<T>`；不使用隐含 `undefined`。 |
| 对象可变性 | 只说明 immutable/aggregate | 所有公开字段 readonly；transition 返回新对象或 typed error。 |
| 错误 | 尚未展开 | 先定义 domain error family 与具体对象操作的 error categories；Step 12 扩展完整 code/CLI mapping。 |
| 外部数据 | safe result 概念 | 所有 adapter 输入先为 `unknown`，只允许映射到 body-free local type；对象不感知 provider DTO。 |
| 状态 | 名称已收稳 | 17 个 lifecycle enum 形成唯一 state vocabulary；views/policies/immutable classifications 不伪造 lifecycle。 |

## 6. 设计取舍

| 决策 | 采用口径 | 理由 |
|---|---|---|
| domain shape | readonly `interface` + pure factory/transition functions | 符合 TS 规范，便于持久化重建、测试和无隐藏 I/O。 |
| state 表达 | string enum（设计契约） | 每个 member 可单独 JSDoc，协议映射稳定；物理 serialization 由 Step 8/11 复核。 |
| errors | discriminated `SyncResult<T, SyncDomainError>` | 禁止 throw/provider exception 穿透 core；完整 taxonomy 后置 Step 12。 |
| refs | `OpaqueRef<K>` aliases | 阻止 Project/Version/Candidate 等相近 string 混用，又不复制 owner entity。 |
| secondary types | 按语义 family 定 schema/ownership | 避免 100+ 空 type alias，也避免 `Record<string, unknown>` 进入 core。 |

## 7. Shared vocabulary 与 technical carrier 契约

### 7.1 TypeScript 公共表达约定

```ts
/** 语义化且不可与其他 kind 混用的标识或引用；value 不承载 owner 正文。 */
export interface OpaqueRef<K extends string> {
  readonly kind: K;
  readonly value: string;
}

/** 显式 optional；持久化/协议边界不得用 undefined 表达第三种状态。 */
export type Optional<T> = T | null;

/** 去重且顺序不携带业务优先级的不可变集合。 */
export type ReadonlyValueSet<T> = ReadonlyArray<T>;

/** 不泄漏正文的摘要；refs 必须为已验证的 typed ref。 */
export interface SafeSummary<C extends string> {
  readonly code: C;
  readonly refs: ReadonlyArray<OpaqueRef<string>>;
  readonly redacted: true;
}

/** Domain 函数的显式成功/失败；不得用 exception 表达预期业务分支。 */
export type SyncResult<T, E = SyncDomainError> =
  | { readonly kind: "ok"; readonly value: T }
  | { readonly kind: "error"; readonly error: E };

/** Step 6 需要的最小错误面；Step 12 扩展 code、recovery 与 CLI mapping。 */
export type SyncDomainError =
  | { readonly kind: "invalid_input"; readonly field: string; readonly reason: string }
  | { readonly kind: "invalid_transition"; readonly subjectRef: OpaqueRef<string>; readonly from: string; readonly to: string }
  | { readonly kind: "context_mismatch"; readonly expectedRef: OpaqueRef<string>; readonly actualRef: OpaqueRef<string> }
  | { readonly kind: "invariant_violation"; readonly rule: string; readonly safeSummary: string }
  | { readonly kind: "blocked"; readonly blocker: SyncBlockerKind }
  | { readonly kind: "unsupported"; readonly capability: string }
  | { readonly kind: "unknown"; readonly reason: UnknownOutcomeReason };
```

约束：`reason: string` 与 `safeSummary: string` 仅为本地、枚举 code 的安全文案位，不得承载 provider/raw body、路径内容、credential、evidence/report 正文；Step 12 必须将所有 public error code 收敛为枚举/union。

### 7.2 ref / value family 归属

| family | TypeScript schema | 代表类型 | 来源 / 约束 |
|---|---|---|---|
| local identity/ref | `OpaqueRef<literal>` | `SyncOperationId/Ref`、`WorkingCopyBindingId/Ref`、`HandoffAttemptId/Ref`、`RuntimeBindingSnapshotRef` | ID provider 生成；Id 与 Ref 可同 value，不可跨 kind。`RuntimeBindingSnapshotRef` 只解析 Step 14 的 body-free technical snapshot，不是业务 truth。 |
| external ref | `OpaqueRef<owner-literal>` | `PrincipalRef`、`ProjectRef`、`VersionRef`、`MaterialSourceRef`、`GovernanceHandoffTargetRef` | explicit input 或正式 owner result；不得从 Git/目录/cache 猜。 |
| instant | validated ISO-8601 UTC string alias | `ObservedAt` | `ClockPort`；不作为 source ordering/comparator。 |
| generation/version | non-negative integer/value object | `MetadataGeneration`、`MappingVersionRef` | local UoW/repository；generation 单调性由 Step 11。 |
| digest/fingerprint | `{ algorithmRef, value }` body-free value | `ContentFingerprintRef`、`CandidateDigestRef`、`ProvenanceDigestRef` | `DigestPort` 对 canonical bounded input 计算；算法配置后置 Step 14。 |
| reasons | discriminated union `{ kind, refs }` | `NeedsActionReason`、`BindingRestrictionReason`、`CandidateInvalidationReason` | owning domain function 构造；Step 12 完整列 variant。 |
| sets/scopes | `ReadonlyArray<T>` + no-duplicate invariant | `...RefSet`、`CandidatePathScope`、`ManualResolutionScope` | explicit input或 domain derivation；空集合是否允许按对象卡。 |
| rule contract | readonly interface with named rule fields | `SnapshotFreshnessRule`、`PathGuardRule`、`LocalReentryRule` | compiled/default domain contract；不得由 runtime config 关闭 hard gate。 |
| safe owner/tool summary | typed discriminated union without body | `SafeOwnerStateSummary`、`SafeFailureSummary`、`SafeProbeResultSummary` | adapter validation/mapping；raw payload 永不进入 core。 |

### 7.3 lifecycle state enums

```ts
/** 本地 operation 编排阶段；Completed 仅表示本地已知终局。 */
export enum SyncOperationState {
  /** 已记录显式意图，尚未校验。 */ Planned = "planned",
  /** 正在执行 owner/local 门禁。 */ Validating = "validating",
  /** 当前门禁通过，可开始明确 stage。 */ Ready = "ready",
  /** 明确 stage 正在执行。 */ Running = "running",
  /** 需要 revalidate/replan/probe/manual 等显式动作。 */ NeedsAction = "needs_action",
  /** 本地结果已知完成，不代表外部 accepted。 */ Completed = "completed",
  /** 本地继续已取消，不代表外部撤销。 */ Cancelled = "cancelled",
  /** 已知且安全分类的失败。 */ FailedKnown = "failed_known",
}

/** 针对当前 selection/action 的本地资格结论。 */
export enum EligibilityOutcome {
  /** 正式 checks fresh 且通过。 */ Eligible = "eligible",
  /** owner 明确拒绝。 */ Denied = "denied",
  /** 合同/姿态/能力阻塞。 */ Blocked = "blocked",
  /** 无法取得权威结论。 */ Unknown = "unknown",
  /** 曾有结论但已不可用于 mutation。 */ Stale = "stale",
}

/** owner snapshot 的本地可用性；不是 owner lifecycle。 */
export enum FreshnessState {
  /** 可在对应 rule/action 下作为门禁输入。 */ Fresh = "fresh",
  /** 超出正式 freshness 条件。 */ Stale = "stale",
  /** 当前无法判断。 */ Unknown = "unknown",
  /** 正式失效事实已到达。 */ Invalidated = "invalidated",
  /** owner/capability 当前不可用。 */ Unavailable = "unavailable",
}

/** working-copy 与显式 selection 的本地绑定状态。 */
export enum WorkingCopyBindingState {
  /** 正建立 generation/manifest/provenance。 */ Initializing = "initializing",
  /** 绑定关系完整；不等于 working tree 安全。 */ Bound = "bound",
  /** 关系可读但 mutation 受限。 */ Restricted = "restricted",
  /** 需要显式 metadata migration。 */ NeedsMigration = "needs_migration",
  /** 需要显式 rebind。 */ NeedsRebind = "needs_rebind",
  /** 关系已失效且不得原地复活。 */ Invalidated = "invalidated",
}

/** logical metadata 完整性/可写姿态。 */
export enum MetadataIntegrityState {
  /** 当前 generation 闭合且可按门禁写。 */ Valid = "valid",
  /** schema 需要显式迁移。 */ NeedsMigration = "needs_migration",
  /** 已知完整性失败。 */ Corrupt = "corrupt",
  /** 无法证明引用闭合。 */ Unknown = "unknown",
  /** 只允许保护性读取，不允许改写。 */ ReadOnlyProtected = "read_only_protected",
}

/** source observed 与 local applied cursor 的连续性。 */
export enum CursorContinuityState {
  /** 尚无 proven applied cursor。 */ Unset = "unset",
  /** comparator/continuity proof 表明可连续。 */ Continuous = "continuous",
  /** 存在不可跨越 gap。 */ Gap = "gap",
  /** 连续性未知。 */ Unknown = "unknown",
  /** owner 未提供所需能力。 */ Unsupported = "unsupported",
}

/** source-local mapping 的本地完整性。 */
export enum MappingIntegrityState {
  /** 当前 generation mappings 闭合。 */ Valid = "valid",
  /** mappings 之间或与 paths 冲突。 */ Conflict = "conflict",
  /** 无法证明完整性。 */ Unknown = "unknown",
  /** generation/source 变化使其失效。 */ Invalidated = "invalidated",
}

/** 一次 materialization 计划的生命周期。 */
export enum MaterializationPlanState {
  /** 已固定输入但尚未通过全部门禁。 */ Draft = "draft",
  /** 在指定 observation/generation 下门禁通过。 */ Validated = "validated",
  /** 输入/门禁漂移，不能执行。 */ Invalidated = "invalidated",
  /** 已关联唯一 run；不能再次直接消费。 */ Consumed = "consumed",
}

/** path change intent 的安全分类。 */
export enum PathChangeSafetyState {
  /** 尚未评价。 */ Draft = "draft",
  /** 当前 observation/mapping 下可 stage。 */ Safe = "safe",
  /** 需要显式冲突处理。 */ Conflict = "conflict",
  /** 已知 hard blocker。 */ Blocked = "blocked",
  /** 无法证明安全。 */ Unknown = "unknown",
}

/** local materialization attempt 的分阶段状态。 */
export enum MaterializationRunState {
  /** run/checkpoint 已持久化，尚未 apply。 */ Prepared = "prepared",
  /** local apply 正在进行。 */ Applying = "applying",
  /** files 已知完成但 cursor/mapping/provenance 尚未原子 finalize。 */ AppliedPendingFinalize = "applied_pending_finalize",
  /** local visibility 已完成；仅此状态可推进 applied cursor。 */ Finalized = "finalized",
  /** 已知仅部分完成。 */ Partial = "partial",
  /** local effect 无法确定。 */ OutcomeUnknown = "outcome_unknown",
  /** 未执行或被安全门禁阻止。 */ Blocked = "blocked",
  /** 已知失败且结果边界明确。 */ FailedKnown = "failed_known",
}
```

其余 CP4/CP5 lifecycle enum 在对应对象组就近定义，避免在未解释语义前形成全局状态桶。

### 7.4 非 core 模块对象闭口决策

| 模块 | 本 Step 是否闭口 | 对象/载体 | 结论与后续承接 |
|---|---|---|---|
| application/orchestration | 部分闭口 | `SyncOperationContext`、`StoredSyncOperationResult`、`SyncReadContext` | 本步定义稳定字段；Step 7 repository/UoW、Step 8 DTO、Step 9 flow 补行为。 |
| adapters | 部分闭口 | `AdapterAvailability`、`AdapterCapabilitySet`、`AdapterCallDisposition`、`AdapterCapabilitySnapshot` | 技术状态载体，不是 domain truth；Step 14 闭合 exact capability、四态 availability、immutable snapshot 与 concrete binding。 |
| cli | defer protocol shape | `CliEntryDisposition` 仅定义分类 | flags/exit code/parser 仍 `SYNC-LOCAL-003/004`；Step 8 定 parser-neutral DTO/result。 |
| operations | 部分闭口 | `ConsumerDisposition`、`JobDisposition` | blocked/duplicate/no-op/processed/failed-known；envelope/job schema Step 8。 |
| composition/config | defer exact shape | capability registry 与 config carrier | Step 7/14/04；本步只要求 read/write graph 分离。 |

```ts
/** 单次 command/job 的本地执行语境；actor 不替代 owner authorization。 */
export interface SyncOperationContext {
  readonly actorRef: ActorRef;
  readonly correlationRef: CorrelationRef;
  readonly idempotencyIdentity: SyncIdempotencyIdentity;
  readonly requestedAt: ObservedAt;
}

/** 幂等 replay 所需的本地载体；精确 equivalence/probe 合同受 SYNC-UP-005 阻塞。 */
export interface StoredSyncOperationResult {
  readonly idempotencyKey: IdempotencyKey;
  readonly requestDigestRef: RequestDigestRef;
  readonly completion: SyncCommandProtocolResult;
  readonly completedAt: ObservedAt;
}

/** Query 的只读语境；不得携带 repository/UoW mutation capability。 */
export interface SyncReadContext {
  readonly actorRef: ActorRef;
  readonly correlationRef: CorrelationRef;
  readonly redactionPolicyRef: RedactionPolicyRef;
  readonly requestedAt: ObservedAt;
}
```

`SyncIdempotencyIdentity` 及 `SyncCommandProtocolResult` 分别由 Step 13 与 Step 8 收口；前者必须是 command channel + exact command name + raw key，后者以 `commandName` 判别 10 个 public Command result。Stored carrier 保存完整 typed completion，而不是只保存 `LocalOperationResultRef` 后从 current truth 重建。`LocalOperationResultRecord` 仍是状态迁移引用的 body-free local known-result record，两者职责不同。

下列四类 application-local carrier 闭合状态 helper 的 ref 来源；它们是 append-only、body-free 的 transition/proof/result/invocation records，不是第 30 个 domain object，也没有独立 lifecycle state：

```ts
/** Fresh+Eligible evaluation与same selection/action的可追溯门禁依据。 */
export interface EligibilityProofRecord {
  readonly proofRef: EligibilityProofRef;
  readonly evaluationRef: AccessEvaluationRef;
  readonly selectionRef: SyncSelectionRef;
  readonly operationKind: SyncOperationKind;
  readonly ownerSnapshotRefs: ExternalOwnerSnapshotRefSet;
  readonly provenAt: ObservedAt;
}

/** 全部可持久化 lifecycle subject 的显式 ref union；禁止用任意 opaque ref 冒充。 */
export type LocalLifecycleSubjectRef =
  | SyncOperationRef
  | AccessEvaluationRef
  | ExternalOwnerSnapshotRef
  | WorkingCopyBindingRef
  | MetadataManifestRef
  | CursorStateRef
  | MappingSetRef
  | MaterializationPlanRef
  | PathChangeSetRef
  | MaterializationRunRef
  | ConflictRecordRef
  | RecoveryCheckpointRef
  | ManualResolutionRef
  | ProbeRecordRef
  | ReviewCandidateRef
  | HandoffAttemptRef
  | ProvenanceRecordRef;

/** transition 的允许原因引用；只能引用已验证的 local/owner basis，不接收任意字符串 ref。 */
export type LocalTransitionCauseRef =
  | LocalLifecycleSubjectRef
  | SyncSelectionRef
  | EligibilityProofRef
  | LocalOperationResultRef
  | ActorRef
  | SourceDeltaRef;

/** Operation/metadata 状态迁移的 body-free append-only 记录；判别项锁定 ref/state 配对。 */
export type LocalTransitionRecord =
  | {
      readonly transitionRef: OperationTransitionRef;
      readonly transitionFamily: "operation";
      readonly subjectKind: "sync_operation";
      readonly subjectRef: SyncOperationRef;
      readonly fromState: Optional<SyncOperationState>;
      readonly toState: SyncOperationState;
      readonly causeRefSet: ReadonlyArray<LocalTransitionCauseRef>;
      readonly actorRef: ActorRef;
      readonly occurredAt: ObservedAt;
      readonly provenanceRef: ProvenanceRecordRef;
    }
  | {
      readonly transitionRef: MetadataTransitionRef;
      readonly transitionFamily: "metadata";
      readonly subjectKind: "working_copy_binding";
      readonly subjectRef: WorkingCopyBindingRef;
      readonly fromState: Optional<WorkingCopyBindingState>;
      readonly toState: WorkingCopyBindingState;
      readonly causeRefSet: ReadonlyArray<LocalTransitionCauseRef>;
      readonly actorRef: ActorRef;
      readonly occurredAt: ObservedAt;
      readonly provenanceRef: ProvenanceRecordRef;
    }
  | {
      readonly transitionRef: MetadataTransitionRef;
      readonly transitionFamily: "metadata";
      readonly subjectKind: "metadata_manifest";
      readonly subjectRef: MetadataManifestRef;
      readonly fromState: Optional<MetadataIntegrityState>;
      readonly toState: MetadataIntegrityState;
      readonly causeRefSet: ReadonlyArray<LocalTransitionCauseRef>;
      readonly actorRef: ActorRef;
      readonly occurredAt: ObservedAt;
      readonly provenanceRef: ProvenanceRecordRef;
    };

/** 多对象完成/关闭时共同引用的known local result；不是外部outcome。 */
export interface LocalOperationResultRecord {
  readonly resultRef: LocalOperationResultRef;
  readonly operationRef: SyncOperationRef;
  readonly disposition: "completed_known" | "no_op_known" | "cancelled" | "failed_known";
  readonly subjectRefSet: ReadonlyArray<LocalLifecycleSubjectRef>;
  readonly provenanceRefs: ProvenanceRecordRefSet;
  readonly completedAt: ObservedAt;
}

/** handoff call 开始前生成，且只能绑定一个 HandoffAttempt。 */
export interface HandoffInvocationIdentity {
  readonly invocationKind: "handoff";
  readonly invocationRef: HandoffInvocationRef;
  readonly handoffAttemptRef: HandoffAttemptRef;
  readonly correlationRef: CorrelationRef;
  readonly idempotencyContextRef: IdempotencyContextRef;
  readonly preparedAt: ObservedAt;
}

/** probe call 开始前生成，同时锁定 ProbeRecord 与被探测的 prior attempt。 */
export interface ProbeInvocationIdentity {
  readonly invocationKind: "probe";
  readonly invocationRef: ProbeInvocationRef;
  readonly probeRef: ProbeRecordRef;
  readonly probedAttemptRef: ExternalAttemptRef;
  readonly correlationRef: CorrelationRef;
  readonly idempotencyContextRef: IdempotencyContextRef;
  readonly preparedAt: ObservedAt;
}

/** 外部调用身份的判别联合；禁止 handoff/probe ref 与 subject 任意混配。 */
export type ExternalInvocationIdentity =
  | HandoffInvocationIdentity
  | ProbeInvocationIdentity;
```

来源规则：四类 ref 均由 `IdPort.next(...)` 生成，不得由时间戳、request ref、Git object或owner ref替代。`EligibilityProofRecord` 只由 shared eligibility gate在已加载 Fresh+Eligible evaluation/snapshots 后创建；`LocalTransitionRecord` 的判别项、subject ref 与 exact state 必须同族，并与对应subject revision、provenance在同一local UoW append；`LocalOperationResultRecord` 与所有引用它的close/complete transition在同一local UoW append；`ExternalInvocationIdentity` 在external call前生成，handoff variant与`HandoffAttempt`、probe variant与`ProbeRecord`及被探测prior attempt必须逐 ref 匹配，adapter request复制同一 invocation ref。精确物理存储由Step 11，但Step 7必须先提供typed append/read surface。

## 8. `selection_access` 对象契约

### 8.1 capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| 建立显式 operation intent | explicit refs/kind/correlation | operation + selection | local Planned；无 I/O | `SyncOperation`、`SyncSelection` | Step 8 Command，Step 9 gate |
| 组合 owner safe results | selection/action/results/time | evaluation | Eligible/Denied/Blocked/Unknown | `AccessEvaluation`、policy | Step 7 `OwnerAccessPort` |
| 保存最小 owner snapshot | validated safe owner result | snapshot | Fresh 或保守状态 | `ExternalOwnerSnapshot` | Step 7 store/adapter |
| revalidate/失效传播 | current evaluation/snapshot/fact | new immutable revision | 只收紧 local posture | operation/evaluation/snapshot | Step 9 consumer/job |

### 8.2 功能到对象映射

| 对象 | 类别 | 承接功能 | 核心能力 | 明确不承接 |
|---|---|---|---|---|
| `SyncOperation` | local aggregate | mutation/maintenance correlation 与阶段 | 显式 transition、needs-action、local terminal | 平台 job、外部 outcome truth |
| `SyncSelection` | immutable value | 固定六个显式维度 | completeness/context/binding comparison | 默认选择与授权 |
| `AccessEvaluation` | local entity | 当前 action 资格结论 | freshness、snapshot basis、stale/block | owner permission truth |
| `OperationEligibilityPolicy` | stateless policy | 组合 checks/hard blockers | fail-closed decision | I/O、本地授权算法复制 |
| `ExternalOwnerSnapshot` | reference snapshot | 最小 external ref/version/freshness | usable/invalidate/redact | owner entity、正文、credential |

### 8.3 `SyncOperation`

```ts
/** 一次显式本地同步 mutation/maintenance 的 correlation anchor。 */
export interface SyncOperation {
  readonly operationId: SyncOperationId;
  readonly operationKind: SyncOperationKind;
  readonly selectionRef: SyncSelectionRef;
  readonly state: SyncOperationState;
  readonly correlationRef: CorrelationRef;
  readonly runtimeBindingSnapshotRef: RuntimeBindingSnapshotRef;
  readonly activeCheckpointRef: Optional<RecoveryCheckpointRef>;
  readonly lastTransitionRef: OperationTransitionRef;
}
```

| 字段 | 类型 | 来源 / 不变量 |
|---|---|---|
| `operationId` | `SyncOperationId` | `IdPort`；全局仅在本地 metadata scope 唯一。 |
| `operationKind` | `SyncOperationKind` | explicit command；status query 不创建 operation。 |
| `selectionRef` | `SyncSelectionRef` | 同一 transaction 已持久化/可读取的 selection。 |
| `state` | `SyncOperationState` | factory=`Planned`；仅下表 transition 修改。 |
| `correlationRef` | `CorrelationRef` | entry metadata；body-free。 |
| `runtimeBindingSnapshotRef` | `RuntimeBindingSnapshotRef` | Step 14 composition 为本 operation append 的 immutable body-free binding snapshot；不得由当前配置重建或热更新改写。 |
| `activeCheckpointRef` | `RecoveryCheckpointRef | null` | prepare/effect boundary 后才关联；terminal 可保留。 |
| `lastTransitionRef` | `OperationTransitionRef` | 每次 durable transition 的 provenance/history ref。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `planSyncMutation(input: PlanSyncMutationInput): SyncResult<SyncOperation>` | factory；校验 kind/selection/correlation，建立 Planned | 返回新对象；无 I/O。 |
| `beginOperationValidation(operation: SyncOperation, evaluationRef: AccessEvaluationRef, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Planned/NeedsAction→Validating | 新 revision；不调用 owner。 |
| `markOperationReady(operation: SyncOperation, proofRef: EligibilityProofRef, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Validating→Ready | proof 必须属于相同 selection/action。 |
| `beginOperationStage(operation: SyncOperation, stage: OperationStage, checkpointRef: RecoveryCheckpointRef, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Ready→Running | durable checkpoint 必须已准备。 |
| `requireOperationAction(operation: SyncOperation, reason: NeedsActionReason, conflictRef: Optional<ConflictRecordRef>, checkpointRef: Optional<RecoveryCheckpointRef>, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Validating/Running→NeedsAction | 保留 known history。 |
| `completeLocalOperation(operation: SyncOperation, resultRef: LocalOperationResultRef, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Running/Ready→Completed | 不表示 Artifact/Baseline/Review accepted。 |
| `cancelSyncOperation(operation: SyncOperation, actorRef: ActorRef, reason: CancellationReason, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Planned/Validating/Ready/Running/NeedsAction→Cancelled | 不产生 external cancel。 |
| `failOperationKnown(operation: SyncOperation, failure: SafeFailureSummary, transitionRef: OperationTransitionRef): SyncResult<SyncOperation>` | Planned/Validating/Ready/Running/NeedsAction→FailedKnown | raw error 禁入。 |

禁止：跨 selection 重用、terminal 原地复活、`Completed` 升格外部完成、status query 写入。

### 8.4 `SyncSelection`

```ts
/** 一次 operation 的不可变显式 principal/project/version/source/target 选择。 */
export interface SyncSelection {
  readonly principalRef: PrincipalRef;
  readonly projectRef: ProjectRef;
  readonly versionRef: VersionRef;
  readonly sourceRef: MaterialSourceRef;
  readonly targetRef: LocalTargetRef;
  readonly operationKind: SyncOperationKind;
}
```

| 字段组 | 来源 / 不变量 |
|---|---|
| 六个字段 | 全部来自 explicit command；非空、typed、同一 request，禁止从 Git remote/branch、目录、cache/profile 或 `latest` 派生。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `createExplicitSyncSelection(input: ExplicitSyncSelectionInput): SyncResult<SyncSelection>` | factory；验证所有 required refs | immutable value；无 I/O。 |
| `assertSelectionExplicit(selection: SyncSelection, requirements: SelectionRequirementSet): SyncResult<SyncSelection>` | 检查 action 所需维度 | 不补默认值。 |
| `selectionMatchesBinding(selection: SyncSelection, binding: WorkingCopyBinding): boolean` | 比较 selection/binding context | 只比较 typed refs。 |
| `selectionHasSameContext(left: SyncSelection, right: SyncSelection): boolean` | 判定等价 context | operation kind 也参与，不能跨 action。 |

状态：无 lifecycle；不完整即不创建。禁止把 source ref 当 access proof。

### 8.5 `AccessEvaluation`

```ts
/** 针对固定 selection/action 的本地 owner eligibility 评价。 */
export interface AccessEvaluation {
  readonly evaluationId: AccessEvaluationId;
  readonly selectionRef: SyncSelectionRef;
  readonly requestedAction: SyncOperationKind;
  readonly outcome: EligibilityOutcome;
  readonly ownerSnapshotRefs: ExternalOwnerSnapshotRefSet;
  readonly reasonSet: EligibilityReasonSet;
  readonly freshnessState: FreshnessState;
  readonly evaluatedAt: ObservedAt;
}
```

| 字段 | 来源 / 不变量 |
|---|---|
| identity/context/action | ID provider + current explicit selection/action；不得跨 action 重用。 |
| `outcome/reasonSet` | `OperationEligibilityPolicy` 对 `OwnerEligibilityResultSet` 的确定性结果。 |
| `ownerSnapshotRefs` | 仅引用同一 evaluation 使用的已验证 safe snapshots；不得嵌入 owner body。 |
| `freshnessState/evaluatedAt` | policy + clock；clock 不能代替 owner freshness contract。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `evaluateAccess(input: EvaluateAccessInput, policy: OperationEligibilityPolicy): SyncResult<AccessEvaluation>` | factory；组合 owner results 并保存 basis refs | Eligible 构造受 `SYNC-UP-001/003` 阻塞，negative/unknown 可落码。 |
| `accessIsEligibleFor(evaluation: AccessEvaluation, selectionRef: SyncSelectionRef, operationKind: SyncOperationKind): boolean` | 防跨 context/action 使用 | 仅 Fresh+Eligible 返回 true。 |
| `markAccessEvaluationStale(evaluation: AccessEvaluation, reason: SnapshotInvalidationReason): SyncResult<AccessEvaluation>` | Eligible/Denied/Blocked/Unknown→Stale | 返回新 revision；不刷新 owner。 |
| `blockAccessEvaluation(evaluation: AccessEvaluation, reason: EligibilityBlockReason): SyncResult<AccessEvaluation>` | Eligible/Denied/Unknown→Blocked | fail-closed；Stale不原地改写。 |
| `attachOwnerSnapshot(evaluation: AccessEvaluation, snapshotRef: ExternalOwnerSnapshotRef): SyncResult<AccessEvaluation>` | 首次持久化前的构造阶段、outcome-preserving追加依据 | 去重且subject/context必须匹配；persisted evaluation不得追加basis。 |

### 8.6 `OperationEligibilityPolicy`

```ts
/** 组合正式 owner checks、freshness 与 hard blockers 的纯领域策略。 */
export interface OperationEligibilityPolicy {
  readonly requiredCheckSet: OwnerCheckRequirementSet;
  readonly stalenessRule: SnapshotFreshnessRule;
  readonly hardBlockerSet: EligibilityHardBlockerSet;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `createOperationEligibilityPolicy(input: OperationEligibilityPolicyInput): SyncResult<OperationEligibilityPolicy>` | factory；required checks 不可为空，hard gates 不可配置关闭 | 无 I/O。 |
| `evaluateOperationEligibility(policy: OperationEligibilityPolicy, selection: SyncSelection, ownerResults: OwnerEligibilityResultSet, evaluationTime: ObservedAt): EligibilityDecision` | 产生 Eligible/Denied/Blocked/Unknown | 缺结果/不支持/过期均非 Eligible。 |
| `requiresAccessRevalidation(policy: OperationEligibilityPolicy, evaluation: AccessEvaluation, targetStage: SyncOperationStage): boolean` | 危险 stage 前判断重验 | 不主动读取 owner。 |
| `rejectBlockedEligibility(policy: OperationEligibilityPolicy, outcome: EligibilityOutcome): SyncResult<void>` | hard gate guard | blocked/unknown/stale 返回 typed error。 |

状态：stateless。禁止 default allow、local permission algorithm、network/cache recovery→eligible。

### 8.7 `ExternalOwnerSnapshot`

```ts
/** 外部 owner truth 的最小 body-free 本地引用快照；snapshot 本身不授权。 */
export interface ExternalOwnerSnapshot {
  readonly snapshotId: ExternalOwnerSnapshotId;
  readonly ownerKind: ExternalOwnerKind;
  readonly subjectRef: ExternalSubjectRef;
  readonly sourceVersionRef: OwnerVersionRef;
  readonly freshnessState: FreshnessState;
  readonly visibilityState: ReferenceVisibilityState;
  readonly safeStateSummary: SafeOwnerStateSummary;
  readonly observedAt: ObservedAt;
}
```

| 字段组 | 来源 / 不变量 |
|---|---|
| id/time | local ID/clock。 |
| owner/subject/version/visibility/summary | runtime-validated formal owner result；不得由 local Git/cache 推导。 |
| freshness | capture 默认为 adapter/policy 可证明姿态；无法证明为 Unknown/Unavailable，不得默认 Fresh。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `captureExternalOwnerSnapshot(input: CaptureOwnerSnapshotInput): SyncResult<ExternalOwnerSnapshot>` | factory；拒绝 raw body/credential/unknown fields 穿透 | positive mapping 受 owner contract blocker。 |
| `ownerSnapshotUsableForMutation(snapshot: ExternalOwnerSnapshot, operationKind: SyncOperationKind, rule: SnapshotFreshnessRule): boolean` | 仅判断 mutation 输入资格 | 不代表 authorization。 |
| `invalidateOwnerSnapshot(snapshot: ExternalOwnerSnapshot, reason: SnapshotInvalidationReason): SyncResult<ExternalOwnerSnapshot>` | Fresh→Stale/Invalidated/Unavailable | 只收紧姿态；既有非Fresh record保持历史，新owner read建立新snapshot。 |
| `ownerSnapshotMatchesSubject(snapshot: ExternalOwnerSnapshot, subjectRef: ExternalSubjectRef): boolean` | typed subject compare | 无 I/O。 |
| `redactOwnerSnapshot(snapshot: ExternalOwnerSnapshot, policyRef: RedactionPolicyRef): ExternalOwnerSnapshotView` | 构建安全 view | 不改变 snapshot。 |

### 8.8 CP1 模块停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 承接 | pass | intent、selection、evaluation、snapshot、policy 全有对象。 |
| 字段来源 | pass_with_blockers | positive owner results 仅能经 `OwnerAccessPort`；`SYNC-UP-001/003` 未关闭。 |
| 状态 | pass | operation/evaluation/snapshot 三轴分开。 |
| ownership | pass | Project/permission/posture 未内化。 |
| 禁止边界 | pass | no default selection/allow、no raw body、Completed 不升格。 |

## 9. `working_copy_metadata` 对象契约

### 9.1 capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| 建立/重绑 working copy | selection/target/generation/provenance | binding | Initializing→Bound or blocked | binding | metadata/UoW ports |
| 管理 logical metadata | manifest + record summaries | integrity decision/transition | generation/protected refs | manifest/policy | Step 11 physical schema |
| 分离 observed/applied cursor | owner cursor + finalized run | cursor revision | continuity changes | cursor | source port/UoW |
| 维护 source-local mapping | delta/path/run | mapping revision | valid/conflict/invalidated | mapping | repository/UoW |
| 捕获本地只读状态 | Git/fs/tool safe result | observation | immutable/no-write query | observation/policy | Git/fs ports |

### 9.2 功能到对象映射

| 对象 | 类别 | 承接功能 | 不承接 |
|---|---|---|---|
| `WorkingCopyBinding` | local aggregate | selection-target-generation relation | Workspace projection/Git remote truth |
| `MetadataManifest` | logical aggregate | schema/generation/ref closure/protection | 物理 JSON/file/table layout |
| `CursorState` | local entity | source observed vs local applied | global latest/version truth |
| `MappingSet` | local entity | source item↔local path mapping | Artifact lineage/remote mapping |
| `WorkingCopyObservation` | immutable observation | Git/fs/path/lock/tool axes | 自动修复/clean/readiness |
| `WorkingCopySafetyPolicy` | stateless policy | dirty/path/symlink/tool guard | Git remote/user policy |
| `MetadataIntegrityPolicy` | stateless policy | schema/generation/ref/provenance guard | repair/delete/backend logic |

### 9.3 `WorkingCopyBinding`

```ts
/** 显式 selection 与唯一 canonical local target 的本地绑定。 */
export interface WorkingCopyBinding {
  readonly bindingId: WorkingCopyBindingId;
  readonly selectionRef: SyncSelectionRef;
  readonly targetRef: CanonicalLocalTargetRef;
  readonly generation: MetadataGeneration;
  readonly state: WorkingCopyBindingState;
  readonly metadataManifestRef: MetadataManifestRef;
  readonly provenanceRootRef: ProvenanceRecordRef;
  readonly lastObservationRef: Optional<WorkingCopyObservationRef>;
}
```

| 字段 | 来源 / 不变量 |
|---|---|
| identity/selection/target | ID provider + explicit selection + `FilesystemPort` canonicalization；target 必须在允许 root。 |
| generation/manifest/provenance | local metadata/UoW create；三者同一 logical transition。 |
| state | factory=`Initializing`；只有 proven manifest/provenance/initial result 后 Bound。 |
| observation | 仅显式 mutation flow 可 attach；status 的即时 observation 不持久化。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `initializeWorkingCopyBinding(input: InitializeBindingInput): SyncResult<WorkingCopyBinding>` | factory，建立 Initializing relation | 不创建物理文件；由 flow/UoW 持久化。 |
| `assertBindingMatches(binding: WorkingCopyBinding, selection: SyncSelection, targetRef: CanonicalLocalTargetRef): SyncResult<void>` | context/generation guard | mismatch typed error。 |
| `markBindingBound(binding: WorkingCopyBinding, transitionRef: MetadataTransitionRef): SyncResult<WorkingCopyBinding>` | Initializing→Bound | 需 manifest/provenance/finalize proof。 |
| `attachBindingObservation(binding: WorkingCopyBinding, observationRef: WorkingCopyObservationRef): SyncResult<WorkingCopyBinding>` | Initializing/Bound/Restricted/NeedsMigration/NeedsRebind 的 state-preserving revision | mutation flow记录observation ref；不适用于query或Invalidated。 |
| `restrictBinding(binding: WorkingCopyBinding, reason: BindingRestrictionReason): SyncResult<WorkingCopyBinding>` | Bound→Restricted | 只收紧；Restricted relation需显式rebind或新owner proof对应的新flow处理，不在本helper恢复。 |
| `requireBindingMigration(binding: WorkingCopyBinding, targetSchemaRef: MetadataSchemaRef): SyncResult<WorkingCopyBinding>` | Bound/Restricted→NeedsMigration | 不执行 migration。 |
| `completeBindingMigration(binding: WorkingCopyBinding, newManifest: MetadataManifest, transitionRef: MetadataTransitionRef): SyncResult<WorkingCopyBinding>` | NeedsMigration→Bound，并切换到严格递增的新 generation/manifest ref | 只构造同一 UoW 待提交 revision；old manifest/provenance 必须保留。 |
| `requireBindingRebind(binding: WorkingCopyBinding, reason: BindingRebindReason): SyncResult<WorkingCopyBinding>` | Initializing/Bound/Restricted/NeedsMigration→NeedsRebind | 不静默替换 selection。 |
| `invalidateBinding(binding: WorkingCopyBinding, reason: BindingInvalidationReason): SyncResult<WorkingCopyBinding>` | Initializing/Bound/Restricted/NeedsMigration/NeedsRebind→Invalidated | history/provenance 保留。 |
| `explicitlyRebindWorkingCopy(input: RebindWorkingCopyInput): SyncResult<WorkingCopyBinding>` | 由 prior binding 建 new identity/generation/relation | prior binding 不改写为新 truth。 |

### 9.4 `MetadataManifest`

```ts
/** `.qs-sync` 的 logical root；不锁定物理文件、JSON 或数据库布局。 */
export interface MetadataManifest {
  readonly manifestId: MetadataManifestId;
  readonly schemaRef: MetadataSchemaRef;
  readonly generation: MetadataGeneration;
  readonly integrityState: MetadataIntegrityState;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly cursorStateRef: Optional<CursorStateRef>;
  readonly mappingSetRef: Optional<MappingSetRef>;
  readonly activeOperationRefs: SyncOperationRefSet;
  readonly protectedProvenanceRefs: ProvenanceRecordRefSet;
  readonly lastTransitionRef: MetadataTransitionRef;
}
```

| 字段组 | 来源 / 不变量 |
|---|---|
| identity/schema/generation/binding | init/migrate/rebind command + local ID/UoW；generation 必须匹配 binding。 |
| topic refs | same-generation repositories；不得 dangling/cross-binding。 |
| active operations | durable operations 可恢复索引；terminal 保留策略由 Step 11，不物理删除 provenance。 |
| protected provenance | init 起至少含 root；只增/显式 supersede，不 silent remove。 |
| integrity/transition | policy decision + durable transition ref。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `initializeMetadataManifest(input: InitializeManifestInput): SyncResult<MetadataManifest>` | factory；Valid 仅在 required logical refs 可成立时；否则 factory 返回 error而非创建其他状态 | physical write 由 store/UoW。 |
| `validateManifestForBinding(manifest: MetadataManifest, binding: WorkingCopyBinding, policy: MetadataIntegrityPolicy): MetadataIntegrityDecision` | 完整性判断 | 无 repair/I/O。 |
| `attachManifestCursor(manifest: MetadataManifest, cursorStateRef: CursorStateRef): SyncResult<MetadataManifest>` | Valid→Valid；same binding/generation ref | 返回新 revision。 |
| `attachManifestMapping(manifest: MetadataManifest, mappingSetRef: MappingSetRef): SyncResult<MetadataManifest>` | Valid→Valid；same binding/generation ref | 返回新 revision。 |
| `protectManifestProvenance(manifest: MetadataManifest, provenanceRef: ProvenanceRecordRef): SyncResult<MetadataManifest>` | Valid/NeedsMigration/Corrupt/Unknown/ReadOnlyProtected state-preserving增加 protected root/ref | 任何姿态均可加强保护；不支持remove或借此恢复Valid。 |
| `markManifestIntegrity(manifest: MetadataManifest, state: Exclude<MetadataIntegrityState, MetadataIntegrityState.Valid>, failure: MetadataIntegrityFailure, transitionRef: MetadataTransitionRef): SyncResult<MetadataManifest>` | Valid→NeedsMigration/Corrupt/Unknown/ReadOnlyProtected | query 不可调用；degraded manifest不原地再次分类。 |
| `migrateMetadataGeneration(input: MigrateMetadataGenerationInput, policy: MetadataIntegrityPolicy): SyncResult<MetadataManifest>` | 产生 new generation manifest | `SYNC-UP-006` 未闭合时 positive path blocked。 |

### 9.5 `CursorState`

```ts
/** 分离 owner observed waterline 与已证明 local applied waterline。 */
export interface CursorState {
  readonly cursorStateId: CursorStateId;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly generation: MetadataGeneration;
  readonly sourceObservedCursorRef: Optional<SourceCursorRef>;
  readonly localAppliedCursorRef: Optional<SourceCursorRef>;
  readonly continuityState: CursorContinuityState;
  readonly comparatorRef: Optional<ComparatorContractRef>;
  readonly lastRunRef: Optional<MaterializationRunRef>;
}
```

| 函数签名 | 前置/字段来源 | 返回/副作用 |
|---|---|---|
| `initializeCursorState(id: CursorStateId, bindingRef: WorkingCopyBindingRef, generation: MetadataGeneration): CursorState` | local init | Unset，所有 cursor/ref null。 |
| `observeSourceCursor(cursor: CursorState, sourceCursorRef: SourceCursorRef, comparatorRef: ComparatorContractRef): SyncResult<CursorState>` | Unset/Continuous state-preserving revision；正式 source result；不改变 applied cursor | 更新 observed/comparator。 |
| `markInitialCursorContinuous(cursor: CursorState, appliedCursorRef: SourceCursorRef, run: MaterializationRun, generation: MetadataGeneration): SyncResult<CursorState>` | Unset + AppliedPendingFinalize run + same generation | 与 run/mapping/provenance 同一 UoW构造首个 applied cursor；commit 前不可见。 |
| `markCursorGap(cursor: CursorState, reason: CursorGapReason): SyncResult<CursorState>` | Unset/Continuous→Gap；comparator/proof detects gap | applied cursor不伪改。 |
| `markCursorUnknown(cursor: CursorState, reason: CursorUnknownReason): SyncResult<CursorState>` | Unset/Continuous→Unknown；authority/comparator unavailable | applied history保留。 |
| `markCursorUnsupported(cursor: CursorState, capability: string): SyncResult<CursorState>` | Unset/Continuous→Unsupported；owner capability absent | applied history保留。 |
| `finalizeAppliedCursor(cursor: CursorState, appliedCursorRef: SourceCursorRef, run: MaterializationRun, generation: MetadataGeneration): SyncResult<CursorState>` | cursor=Continuous、run=AppliedPendingFinalize、same generation、target cursor matches；与 run/mapping/provenance 同一 UoW 准备 | 唯一构造incremental applied cursor advance 的函数；commit 前不可对外可见。 |
| `invalidateCursorForGeneration(cursor: CursorState, newGeneration: MetadataGeneration): SyncResult<CursorState>` | migrate/rebind；new generation 必须严格不同 | 旧对象明确转 `Unknown` 并保留；新 generation 另建 `Unset` cursor，不引入不存在的 Invalid 状态。 |

禁止：用时间、Git commit、arrival order 推断 comparator；partial/unknown/AppliedPendingFinalize 推进 cursor。

### 9.6 `MappingSet`

```ts
/** 当前 binding/generation 的 source item 到 local path/object 映射集合。 */
export interface MappingSet {
  readonly mappingSetId: MappingSetId;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly generation: MetadataGeneration;
  readonly entrySet: SourceLocalMappingEntrySet;
  readonly mappingVersionRef: MappingVersionRef;
  readonly integrityState: MappingIntegrityState;
  readonly lastRunRef: Optional<MaterializationRunRef>;
}
```

`SourceLocalMappingEntry` 必须至少包含 `sourceItemRef`、`sourceVersionRef`、`canonicalLocalPathRef`、`localObjectRef | null`、`entryDigestRef`，且 tuple 在集合内唯一；它不是 Artifact lineage 或 Git remote mapping。

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `initializeMappingSet(input: InitializeMappingSetInput): SyncResult<MappingSet>` | factory empty Valid set | initial create contract不成立则返回typed error/blocked，不创建Unknown对象。 |
| `resolveMappedLocalTarget(mappingSet: MappingSet, sourceItemRef: SourceItemRef): MappingLookupResult` | exact lookup | Missing 明确，不用 empty/success 替代。 |
| `validateMappingChangeSet(mappingSet: MappingSet, pathChangeSet: PathChangeSet, policy: WorkingCopySafetyPolicy): MappingValidationDecision` | 检查 collision/generation/path | 无写入。 |
| `prepareFinalizedMappingChanges(mappingSet: MappingSet, changes: MappingChangeSet, run: MaterializationRun, nextVersionRef: MappingVersionRef): SyncResult<MappingSet>` | mapping=Valid、run=AppliedPendingFinalize + same generation；构造与 run/cursor 一起提交的 revision | 成功 UoW 后才成为 visible mapping；不得提前称 committed。 |
| `prepareResolvedMappingChanges(mappingSet: MappingSet, changes: MappingChangeSet, resolution: ManualResolution, run: MaterializationRun, nextVersionRef: MappingVersionRef): SyncResult<MappingSet>` | Conflict→Valid；resolution=Validated且scope覆盖changes，run=AppliedPendingFinalize且same generation | 与run/cursor/provenance同UoW提交；不从resolution ref内容反推proof。 |
| `markMappingConflict(mappingSet: MappingSet, reason: MappingConflictReason): SyncResult<MappingSet>` | Valid→Conflict | 不自动选择 mapping 或修改 paths。 |
| `markMappingUnknown(mappingSet: MappingSet, reason: MappingUnknownReason): SyncResult<MappingSet>` | Valid/Conflict→Unknown | 缺失 closure/comparator 时 fail-closed。 |
| `invalidateMappingSet(mappingSet: MappingSet, reason: MappingInvalidationReason): SyncResult<MappingSet>` | Valid/Conflict/Unknown→Invalidated | 不跨 generation 复活。 |

### 9.7 `WorkingCopyObservation`

```ts
/** 某一时点对 canonical local target 的不可变 body-free Git/fs/tool 观察。 */
export interface WorkingCopyObservation {
  readonly observationId: WorkingCopyObservationId;
  readonly targetRef: CanonicalLocalTargetRef;
  readonly gitHeadRef: Optional<GitObjectRef>;
  readonly workingTreeState: WorkingTreeState;
  readonly pathSafetyState: PathSafetyState;
  readonly lockState: LocalLockState;
  readonly toolCapabilitySet: LocalToolCapabilitySet;
  readonly contentFingerprintRef: Optional<ContentFingerprintRef>;
  readonly observedAt: ObservedAt;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `captureWorkingCopyObservation(input: CaptureWorkingCopyObservationInput): SyncResult<WorkingCopyObservation>` | factory；组合 runtime-validated Git/fs results | status path 可调用但不得 persist/acquire write lock。 |
| `observationSafeForPlan(observation: WorkingCopyObservation, operationKind: SyncOperationKind, policy: WorkingCopySafetyPolicy): WorkingCopySafetyDecision` | 多轴 safety decision | Clean 单轴不够。 |
| `observationMatchesFingerprint(observation: WorkingCopyObservation, fingerprintRef: ContentFingerprintRef): boolean` | drift check | null/unknown=false。 |
| `observationSupportsCapability(observation: WorkingCopyObservation, capability: LocalToolCapability): boolean` | capability membership | unsupported/unknown=false。 |

`WorkingTreeState` 至少为 Clean/Dirty/Untracked/Conflicted/Unknown；`PathSafetyState` 为 Safe/Unsafe/Unknown；`LocalLockState` 为 Acquired/Unavailable/NotRequested/Unknown。这三轴不得压成 `ready`。

### 9.8 `WorkingCopySafetyPolicy`

```ts
/** 保护 dirty/untracked/path/symlink/lock/tool capability 的纯策略。 */
export interface WorkingCopySafetyPolicy {
  readonly protectedChangeSet: ProtectedLocalChangeKindSet;
  readonly pathGuardRule: PathGuardRule;
  readonly requiredCapabilitySet: LocalToolCapabilitySet;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `createWorkingCopySafetyPolicy(input: WorkingCopySafetyPolicyInput): SyncResult<WorkingCopySafetyPolicy>` | factory；non-overwrite/path guard 必须存在 | hard gate 不可配置关闭。 |
| `evaluateWorkingCopyTarget(policy: WorkingCopySafetyPolicy, observation: WorkingCopyObservation, operationKind: SyncOperationKind): WorkingCopySafetyDecision` | Safe/Conflict/Blocked/Unknown | no I/O。 |
| `validatePathChanges(policy: WorkingCopySafetyPolicy, pathChangeSet: PathChangeSet, mappingSet: MappingSet): PathSafetyDecision` | root/symlink/collision/protected change guard | 不自动 resolve。 |
| `workingCopyRequiresManualResolution(policy: WorkingCopySafetyPolicy, observation: WorkingCopyObservation): boolean` | dirty/conflict/unknown 判定 | 不 stash/merge/rebase。 |

### 9.9 `MetadataIntegrityPolicy`

```ts
/** 校验 logical metadata schema/generation/ref closure/provenance protection 的纯策略。 */
export interface MetadataIntegrityPolicy {
  readonly supportedSchemaRule: MetadataSchemaSupportRule;
  readonly referenceClosureRule: MetadataReferenceClosureRule;
  readonly provenanceProtectionRule: ProvenanceProtectionRule;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `createMetadataIntegrityPolicy(input: MetadataIntegrityPolicyInput): SyncResult<MetadataIntegrityPolicy>` | factory；所有 rule 必需 | schema version set受 `SYNC-UP-006`。 |
| `evaluateMetadataIntegrity(policy: MetadataIntegrityPolicy, manifest: MetadataManifest, binding: WorkingCopyBinding, summaries: MetadataRecordSummarySet): MetadataIntegrityDecision` | Valid/NeedsMigration/Corrupt/Unknown/ReadOnlyProtected | no repair/write。 |
| `validateMetadataMigration(policy: MetadataIntegrityPolicy, prior: MetadataManifest, candidate: MetadataManifest): SyncResult<void>` | old→new generation/ref/provenance closure | 不能删除 protected refs。 |
| `protectAgainstImplicitRebind(policy: MetadataIntegrityPolicy, binding: WorkingCopyBinding, newSelection: SyncSelection): SyncResult<void>` | mismatch 必须显式 command | no I/O。 |

### 9.10 CP2 模块停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 承接 | pass | binding/manifest/cursor/mapping/observation 与两 policy 完整。 |
| 字段来源 | pass_with_blockers | physical storage/schema `SYNC-UP-006`；Git/path exact mapping `007/010`。 |
| 状态 | pass | binding/manifest/cursor/mapping 与 observation 三轴独立。 |
| query no-write | pass | observation 可即时构造但 query 不 persist/lock/repair。 |
| provenance/cursor | pass | no delete；只有 AppliedPendingFinalize run 可在同一 UoW构造 cursor/mapping/final run revisions，commit 后才共同可见。 |

## 10. `source_materialization` 对象契约

### 10.1 capability 与对象映射

| capability | 输入→输出 | 状态/副作用 | 对象 | 后续 seam |
|---|---|---|---|---|
| 接收正式 source delta | owner safe delta + comparator → immutable input | 不写 local files | `SourceDelta` | `MaterialSourcePort` |
| 生成可验证 plan | selection/access/binding/cursor/mapping/observation → plan | Draft→Validated/Invalidated | `MaterializationPlan`、policy | repositories + policies |
| 派生 path intent | delta+mapping+root → path changes | Draft→Safe/Conflict/Blocked/Unknown | `PathChangeSet` | fs/Git apply ports |
| 执行并收束 local apply | prepared plan/checkpoint → run revisions | Applying→pending finalize→Finalized/other | `MaterializationRun` | UoW + CP4 checkpoint |
| 联合安全判断 | all preconditions → typed decision | 无 I/O | `MaterializationSafetyPolicy` | Step 9 flow |

| 对象 | 类别 | 明确不承接 |
|---|---|---|
| `MaterializationPlan` | local aggregate/immutable plan | source truth、自动执行、metadata write |
| `SourceDelta` | immutable owner-input mapping | owner body、guessed ordering、local result |
| `PathChangeSet` | immutable local intent | 实际 filesystem outcome、自动冲突决定 |
| `MaterializationRun` | local execution history | source/Artifact/Review success |
| `MaterializationSafetyPolicy` | stateless policy | I/O、comparator、owner permission、manual decision |

### 10.2 `MaterializationPlan`

```ts
/** 固定一次 materialization 的 source/local preconditions 与执行意图。 */
export interface MaterializationPlan {
  readonly planId: MaterializationPlanId;
  readonly operationRef: SyncOperationRef;
  readonly runtimeBindingSnapshotRef: RuntimeBindingSnapshotRef;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly bindingGeneration: MetadataGeneration;
  readonly accessEvaluationRef: AccessEvaluationRef;
  readonly sourceDeltaRef: SourceDeltaRef;
  readonly pathChangeSetRef: PathChangeSetRef;
  readonly preconditionFingerprintRef: ContentFingerprintRef;
  readonly targetCursorRef: Optional<SourceCursorRef>;
  readonly state: MaterializationPlanState;
  readonly consumedByRunRef: Optional<MaterializationRunRef>;
}
```

| 字段组 | 来源 / 不变量 |
|---|---|
| id/operation/runtime binding/binding/generation | ID + repositories；全部属于同一 selection/generation；`runtimeBindingSnapshotRef` 必须等于 owning operation 的 immutable ref。 |
| evaluation/delta/path refs | 已持久化或同一 UoW 准备的对应对象；不得 dangling。 |
| fingerprint | bounded canonical observation/path inputs 经 DigestPort；不得含 file body。 |
| target cursor | owner delta；Gap/Unsupported 时必须 null 且 plan 不得 Validated。 |
| state/run | Draft factory；Consumed 必须带唯一 run ref。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `draftMaterializationPlan(input: DraftMaterializationPlanInput): SyncResult<MaterializationPlan>` | factory，固定 refs/preconditions | 无 I/O；state=Draft。 |
| `validateMaterializationPlan(plan: MaterializationPlan, evaluation: AccessEvaluation, cursor: CursorState, observation: WorkingCopyObservation, mapping: MappingSet, policy: MaterializationSafetyPolicy): SyncResult<MaterializationPlan>` | Draft→Validated | 全部 refs/context/fingerprint 匹配。 |
| `materializationPlanMatchesGeneration(plan: MaterializationPlan, generation: MetadataGeneration): boolean` | generation guard | 无副作用。 |
| `materializationPlanMatchesObservation(plan: MaterializationPlan, observation: WorkingCopyObservation): boolean` | fingerprint guard | unknown/null=false。 |
| `invalidateMaterializationPlan(plan: MaterializationPlan, reason: MaterializationInvalidationReason): SyncResult<MaterializationPlan>` | Draft/Validated→Invalidated | 不自动 replan。 |
| `consumeMaterializationPlan(plan: MaterializationPlan, runRef: MaterializationRunRef): SyncResult<MaterializationPlan>` | Validated→Consumed | 唯一 run；old plan 不重用。 |

### 10.3 `SourceDelta`

```ts
/** 正式 source port 输出的 body-free 全量/增量/空/gap/unsupported 分类。 */
export interface SourceDelta {
  readonly sourceDeltaId: SourceDeltaId;
  readonly sourceRef: MaterialSourceRef;
  readonly fromCursorRef: Optional<SourceCursorRef>;
  readonly toCursorRef: SourceCursorRef;
  readonly deltaKind: SourceDeltaKind;
  readonly sourceItemChangeSet: SourceItemChangeSet;
  readonly comparatorRef: ComparatorContractRef;
  readonly continuityProofRef: Optional<ContinuityProofRef>;
  readonly sourceDigestRef: SourceDigestRef;
}
```

`SourceDeltaKind` 的每个 member 语义为：`Full`=owner 明确声明的完整 materialization 输入；`Incremental`=有正式 from/to/comparator/proof；`NoOp`=owner 证明无变化；`Gap`=连续性不成立；`Unsupported`=能力合同不存在。Gap/Unsupported 不是空 change set。

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `sourceDeltaFromOwnerResult(id: SourceDeltaId, sourceRef: MaterialSourceRef, ownerResult: OwnerSourceDeltaResult, comparatorRef: ComparatorContractRef): SyncResult<SourceDelta>` | runtime-validated safe result→local value | `SYNC-UP-002/008` 未闭合时 positive path blocked。 |
| `sourceDeltaContinuousFrom(delta: SourceDelta, cursor: CursorState): boolean` | 正式 comparator/proof 一致性 | 不本地比较 opaque cursor string。 |
| `sourceDeltaRequiresFull(delta: SourceDelta, cursor: CursorState): boolean` | 仅 owner contract 明确时判断 | gap 不能自动转 full。 |
| `assertSourceDeltaSupported(delta: SourceDelta, capabilities: SourceCapabilitySet): SyncResult<void>` | unsupported/gap guard | 无 I/O。 |

### 10.4 `PathChangeSet`

```ts
/** local create/update/delete/rename 与 mapping intent；不是实际写入结果。 */
export interface PathChangeSet {
  readonly pathChangeSetId: PathChangeSetId;
  readonly rootTargetRef: CanonicalLocalTargetRef;
  readonly changeEntries: PathChangeEntrySet;
  readonly mappingChangeSet: MappingChangeSet;
  readonly affectedPathFingerprintSet: PathFingerprintSet;
  readonly safetyState: PathChangeSafetyState;
  readonly conflictHintSet: ConflictHintSet;
}
```

`PathChangeEntry` 是判别联合：Create/Update/Delete/Rename，每项必须包含 canonical relative path、source item/version ref、precondition fingerprint 与 non-overwrite requirement；Rename 额外包含 source/target path。禁止 absolute/path escape/symlink target body。

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `derivePathChangeSet(input: DerivePathChangeSetInput, mappingRule: PathMappingRule): SyncResult<PathChangeSet>` | delta+mapping→Draft intent | mapping rule authority受 `SYNC-UP-007/008`。 |
| `evaluatePathChangeSafety(pathChanges: PathChangeSet, observation: WorkingCopyObservation, mapping: MappingSet, policy: WorkingCopySafetyPolicy): PathChangeSet` | Draft→Safe/Conflict/Blocked/Unknown | 无 I/O/自动决定。 |
| `selectAffectedPaths(pathChanges: PathChangeSet, scope: PathSelectionScope): ReadonlyArray<CanonicalRelativePathRef>` | bounded selection | scope 不能扩大计划。 |
| `pathChangesMatchFingerprints(pathChanges: PathChangeSet, observation: WorkingCopyObservation): boolean` | drift/non-overwrite guard | unknown=false。 |
| `markPathChangeConflict(pathChanges: PathChangeSet, hints: ConflictHintSet): SyncResult<PathChangeSet>` | Draft/Safe→Conflict | typed hints 非自由文本。 |

### 10.5 `MaterializationRun`

```ts
/** 一次 prepared plan 的 local apply history 与 finalize 资格。 */
export interface MaterializationRun {
  readonly runId: MaterializationRunId;
  readonly planRef: MaterializationPlanRef;
  readonly state: MaterializationRunState;
  readonly appliedSegmentRefs: AppliedSegmentRefSet;
  readonly checkpointRef: Optional<RecoveryCheckpointRef>;
  readonly resultFingerprintRef: Optional<ContentFingerprintRef>;
  readonly failureSummary: Optional<SafeFailureSummary>;
  readonly finalizedCursorRef: Optional<SourceCursorRef>;
  readonly finalizedMappingVersionRef: Optional<MappingVersionRef>;
  readonly provenanceRef: Optional<ProvenanceRecordRef>;
}
```

| 函数签名 | 前置/作用 | 返回/副作用 |
|---|---|---|
| `prepareMaterializationRun(id: MaterializationRunId, plan: MaterializationPlan, checkpointRef: RecoveryCheckpointRef): SyncResult<MaterializationRun>` | plan=Validated；factory Prepared | durable persistence 由 flow before apply。 |
| `beginMaterializationApply(run: MaterializationRun, plan: MaterializationPlan, observation: WorkingCopyObservation): SyncResult<MaterializationRun>` | fingerprint/context still match；Prepared→Applying | 不执行 I/O。 |
| `recordAppliedSegment(run: MaterializationRun, segmentRef: AppliedSegmentRef, fingerprintRef: ContentFingerprintRef): SyncResult<MaterializationRun>` | Applying，去重追加 known progress | 未知进度不得伪造。 |
| `markApplyPendingFinalize(run: MaterializationRun, resultFingerprintRef: ContentFingerprintRef): SyncResult<MaterializationRun>` | all planned segments known complete | Applying→AppliedPendingFinalize。 |
| `finalizeMaterializationRun(run: MaterializationRun, cursorRef: SourceCursorRef, mappingVersionRef: MappingVersionRef, provenanceRef: ProvenanceRecordRef): SyncResult<MaterializationRun>` | AppliedPendingFinalize；same-generation cursor/mapping/provenance candidate revisions 已构造并将进入同一 UoW | →Finalized；三个 refs 必须同时存在；只有 UoW commit 后该 revision 与 cursor/mapping 才同时可见。 |
| `checkpointPartialRun(run: MaterializationRun, checkpointRef: RecoveryCheckpointRef, failure: SafeFailureSummary): SyncResult<MaterializationRun>` | Applying→Partial；known partial | cursor unchanged。 |
| `markRunOutcomeUnknown(run: MaterializationRun, checkpointRef: RecoveryCheckpointRef, reason: UnknownOutcomeReason): SyncResult<MaterializationRun>` | Applying→OutcomeUnknown；effect ambiguous | no retry/finalize。 |
| `blockMaterializationRun(run: MaterializationRun, blocker: SyncBlockerKind): SyncResult<MaterializationRun>` | Prepared/Applying→Blocked at known safe boundary | cursor unchanged；Applying时仅可用于已证明zero-effect branch，否则Partial/OutcomeUnknown。 |
| `failMaterializationRunKnown(run: MaterializationRun, failure: SafeFailureSummary): SyncResult<MaterializationRun>` | Prepared/Applying→FailedKnown when effect boundary known | raw failure禁入；若可能有partial effect不得用此状态。 |

### 10.6 `MaterializationSafetyPolicy`

```ts
/** 联合 access/source continuity/binding/local/path/finalization 的纯安全策略。 */
export interface MaterializationSafetyPolicy {
  readonly requiredPreconditionSet: MaterializationPreconditionSet;
  readonly continuityRequirement: CursorContinuityRequirement;
  readonly driftRule: LocalDriftRule;
  readonly finalizationRule: LocalFinalizationRule;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `createMaterializationSafetyPolicy(input: MaterializationSafetyPolicyInput): SyncResult<MaterializationSafetyPolicy>` | hard requirements 全量建立 | 不能配置放宽。 |
| `validateMaterializationInputs(policy: MaterializationSafetyPolicy, plan: MaterializationPlan, evaluation: AccessEvaluation, cursor: CursorState, observation: WorkingCopyObservation, mapping: MappingSet): MaterializationSafetyDecision` | Safe/Conflict/Blocked/Unknown/Invalidated | 任一 required unknown 不得 Safe。 |
| `validateBeforeLocalApply(policy: MaterializationSafetyPolicy, plan: MaterializationPlan, currentObservation: WorkingCopyObservation): SyncResult<void>` | drift/generation/fingerprint guard | 无 I/O。 |
| `materializationCanFinalize(policy: MaterializationSafetyPolicy, run: MaterializationRun, currentGeneration: MetadataGeneration): boolean` | only AppliedPendingFinalize + same generation + complete refs | final commit仍由 UoW。 |

### 10.7 CP3 模块停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability/对象 | pass | source input、plan、path intent、run、policy 均有唯一主语。 |
| 字段来源 | pass_with_blockers | owner delta/comparator/mapping/path contract受 `002/007/008/010`。 |
| 状态 | pass | delta classification、plan、path、run 四轴分离。 |
| finalize | pass | only pending-finalize + UoW success→Finalized→cursor/mapping。 |
| Git/fs | pass | object不执行 merge/rebase/push/stash/overwrite。 |

## 11. `conflict_recovery` 对象契约

### 11.1 capability 与对象映射

| capability | 对象 | 核心输出 | 不承接 |
|---|---|---|---|
| 记录 typed conflict 与受影响 refs | `ConflictRecord` | protected conflict history | Git merge/owner dispute truth |
| 固定安全恢复边界 | `RecoveryCheckpoint` | next action/fingerprint/completed local steps | remote transaction proof |
| 记录显式用户意图 | `ManualResolution` | validated intent/history | 直接执行/Review Decision |
| 正式探测 prior external attempt | `ProbeRecord` | known/unknown/unsupported result layer | retry/telemetry inference |
| 决定 resume/replan/probe/manual/stop | `RecoverySafetyPolicy` | typed recovery decision | 外部幂等保证/I/O |

### 11.2 CP4 state enums

```ts
/** 本地 conflict 的保护性生命周期。 */
export enum ConflictState {
  /** 冲突已记录，尚未要求或取得显式处理意图。 */
  Open = "open",
  /** 当前只能等待有权 actor 的显式决定；不会自动选边。 */
  AwaitingDecision = "awaiting_decision",
  /** 已持久化并验证 resolution intent，但实际恢复动作尚未证明完成。 */
  ResolutionRecorded = "resolution_recorded",
  /** 新冲突事实已替代本记录；本记录仍保留为历史。 */
  Superseded = "superseded",
  /** 新动作已产生 known-safe local result，冲突生命周期已收束。 */
  Closed = "closed",
}
/** checkpoint 是否能安全续行、需 probe 或已收束。 */
export enum RecoveryCheckpointState {
  /** 已固定阶段、输入指纹和已知 local progress，尚未分类下一动作。 */
  Captured = "captured",
  /** 当前指纹与 policy 证明只可重入 bounded local step。 */
  Resumable = "resumable",
  /** 输入、generation 或恢复依据已漂移，不得原地续行。 */
  Invalidated = "invalidated",
  /** 可能已有 external effect，必须正式 probe 后再决定。 */
  ProbeRequired = "probe_required",
  /** owning flow 已取得 known result 并收束此 checkpoint。 */
  Completed = "completed",
}
/** 用户 resolution intent 的验证/应用历史。 */
export enum ManualResolutionState {
  /** 已记录 actor、decision 与 bounded scope，尚未重验当前上下文。 */
  Recorded = "recorded",
  /** 当前 conflict/context/policy 允许后续显式恢复动作。 */
  Validated = "validated",
  /** 对应 local action 已有 known result；不是 owner/Review Decision。 */
  Applied = "applied",
  /** 后续 resolution 已替代本 intent；历史必须保留。 */
  Superseded = "superseded",
  /** scope、actor、状态或 policy 检查已知不通过。 */
  Rejected = "rejected",
}
/** 针对 prior attempt 的正式 probe lifecycle。 */
export enum ProbeRecordState {
  /** prior attempt 与 idempotency context 已 durable 绑定，尚未调用 probe。 */
  Prepared = "prepared",
  /** 正式 probe 调用已开始，结果尚未归一化。 */
  InFlight = "in_flight",
  /** 正式 probe 返回可归属的 known external result；不等于 accepted。 */
  ResolvedKnown = "resolved_known",
  /** probe 后 effect 仍无法判断；不得重放原 submit。 */
  StillUnknown = "still_unknown",
  /** owner/adapter 没有正式 probe capability。 */
  Unsupported = "unsupported",
  /** probe 调用已知失败；原 attempt outcome 仍按原状态保留。 */
  FailedKnown = "failed_known",
}
```

### 11.3 `ConflictRecord`

```ts
/** access/source/cursor/mapping/path/metadata/apply/handoff 的本地可解释冲突。 */
export interface ConflictRecord {
  readonly conflictId: ConflictRecordId;
  readonly operationRef: SyncOperationRef;
  readonly conflictKind: SyncConflictKind;
  readonly state: ConflictState;
  readonly affectedRefSet: AffectedSyncRefSet;
  readonly basisSummary: ConflictBasisSummary;
  readonly checkpointRef: Optional<RecoveryCheckpointRef>;
  readonly manualResolutionRef: Optional<ManualResolutionRef>;
  readonly detectedAt: ObservedAt;
  readonly closeResultRef: Optional<LocalOperationResultRef>;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `detectSyncConflict(input: DetectConflictInput): SyncResult<ConflictRecord>` | factory Open；kind/affected/basis 必须 typed/body-free | repository append in flow。 |
| `awaitConflictDecision(conflict: ConflictRecord, allowed: ManualDecisionKindSet): SyncResult<ConflictRecord>` | Open→AwaitingDecision | 不选择决定。 |
| `recordConflictResolution(conflict: ConflictRecord, resolution: ManualResolution): SyncResult<ConflictRecord>` | Open/Awaiting→ResolutionRecorded | intent 不等于 resolved。 |
| `supersedeConflict(conflict: ConflictRecord, replacementRef: ConflictRecordRef): SyncResult<ConflictRecord>` | Open/AwaitingDecision/ResolutionRecorded→Superseded | old history保留。 |
| `closeConflict(conflict: ConflictRecord, reason: ConflictCloseReason, resultRef: LocalOperationResultRef): SyncResult<ConflictRecord>` | ResolutionRecorded→Closed | 必须有新 action known-safe result。 |

### 11.4 `RecoveryCheckpoint`

```ts
/** 可恢复阶段、输入指纹、已知 local progress 与下一安全动作的 durable anchor。 */
export interface RecoveryCheckpoint {
  readonly checkpointId: RecoveryCheckpointId;
  readonly operationRef: SyncOperationRef;
  readonly stage: RecoveryStage;
  readonly state: RecoveryCheckpointState;
  readonly inputFingerprintRef: RecoveryInputFingerprintRef;
  readonly completedStepSet: CompletedLocalStepSet;
  readonly nextAction: RecoveryNextAction;
  readonly relatedAttemptRef: Optional<ExternalAttemptRef>;
  readonly capturedAt: ObservedAt;
  readonly completionResultRef: Optional<LocalOperationResultRef>;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `captureRecoveryCheckpoint(input: CaptureCheckpointInput): SyncResult<RecoveryCheckpoint>` | factory Captured；prepare/effect 前持久化载体 | 不自证 effect。 |
| `evaluateCheckpointResume(checkpoint: RecoveryCheckpoint, current: RecoveryCurrentContext, policy: RecoverySafetyPolicy): RecoveryCheckpointDecision` | 纯分类，返回 Resumable/Invalidated/ProbeRequired decision | 不修改 checkpoint；flow 必须调用下列 exact transition。 |
| `markCheckpointResumable(checkpoint: RecoveryCheckpoint, nextAction: RecoveryNextAction): SyncResult<RecoveryCheckpoint>` | Captured→Resumable；仅 bounded local-safe action | 不执行 resume。 |
| `requireCheckpointProbe(checkpoint: RecoveryCheckpoint, attemptRef: ExternalAttemptRef): SyncResult<RecoveryCheckpoint>` | →ProbeRequired | prior attempt 必须匹配。 |
| `invalidateCheckpoint(checkpoint: RecoveryCheckpoint, reason: RecoveryInvalidationReason): SyncResult<RecoveryCheckpoint>` | Captured/Resumable/ProbeRequired→Invalidated | 不原地恢复。 |
| `completeCheckpoint(checkpoint: RecoveryCheckpoint, resultRef: LocalOperationResultRef): SyncResult<RecoveryCheckpoint>` | Resumable→Completed only with owning known local result；ProbeRequired仅在formal probe后owning flow另已形成known terminal result时可完成 | probe known本身未必足够；external pending不完成checkpoint。 |

### 11.5 `ManualResolution`

```ts
/** 用户对特定 conflict 的 bounded intent/history；不直接执行 local change。 */
export interface ManualResolution {
  readonly resolutionId: ManualResolutionId;
  readonly conflictRef: ConflictRecordRef;
  readonly actorRef: ActorRef;
  readonly decisionKind: ManualResolutionKind;
  readonly scope: ManualResolutionScope;
  readonly state: ManualResolutionState;
  readonly requiredRevalidationSet: RevalidationRequirementSet;
  readonly recordedAt: ObservedAt;
  readonly appliedResultRef: Optional<LocalOperationResultRef>;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `recordManualResolution(input: RecordManualResolutionInput): SyncResult<ManualResolution>` | factory Recorded；explicit actor/conflict/scope | system job不能冒充 actor。 |
| `validateManualResolution(resolution: ManualResolution, conflict: ConflictRecord, current: RecoveryCurrentContext, policy: RecoverySafetyPolicy): SyncResult<ManualResolution>` | Recorded→Validated/Rejected | KeepLocal/ApplySource 仍需 safety gates。 |
| `markManualResolutionApplied(resolution: ManualResolution, resultRef: LocalOperationResultRef): SyncResult<ManualResolution>` | Validated→Applied | actual action known result required。 |
| `supersedeManualResolution(resolution: ManualResolution, replacementRef: ManualResolutionRef): SyncResult<ManualResolution>` | Recorded/Validated→Superseded | history保留。 |
| `rejectManualResolution(resolution: ManualResolution, reason: ManualResolutionRejectReason): SyncResult<ManualResolution>` | Recorded→Rejected | no action。 |

### 11.6 `ProbeRecord`

```ts
/** 针对已持久化 external attempt 的正式只读 probe history。 */
export interface ProbeRecord {
  readonly probeId: ProbeRecordId;
  readonly attemptRef: ExternalAttemptRef;
  readonly probeKind: RecoveryProbeKind;
  readonly state: ProbeRecordState;
  readonly idempotencyContextRef: IdempotencyContextRef;
  readonly invocationRef: Optional<ProbeInvocationRef>;
  readonly safeResultSummary: Optional<SafeProbeResultSummary>;
  readonly externalResultRef: Optional<ExternalResultRef>;
  readonly observedAt: Optional<ObservedAt>;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `prepareProbeRecord(input: PrepareProbeInput): SyncResult<ProbeRecord>` | factory Prepared；prior attempt/idempotency context required | no guessed probe。 |
| `beginProbe(record: ProbeRecord, invocationRef: ProbeInvocationRef): SyncResult<ProbeRecord>` | Prepared→InFlight | formal call starts after durable prepare。 |
| `resolveProbeKnown(record: ProbeRecord, summary: SafeProbeResultSummary, resultRef: ExternalResultRef, observedAt: ObservedAt): SyncResult<ProbeRecord>` | InFlight→ResolvedKnown | known不等于 accepted。 |
| `keepProbeUnknown(record: ProbeRecord, reason: UnknownOutcomeReason, observedAt: ObservedAt): SyncResult<ProbeRecord>` | InFlight→StillUnknown | no replay。 |
| `markProbeUnsupported(record: ProbeRecord, reason: UnsupportedCapabilityReason): SyncResult<ProbeRecord>` | Prepared/InFlight→Unsupported | capability absence explicit。 |
| `failProbeKnown(record: ProbeRecord, failure: SafeFailureSummary): SyncResult<ProbeRecord>` | InFlight→FailedKnown | original attempt仍按原 outcome。 |

### 11.7 `RecoverySafetyPolicy`

```ts
/** 区分 local reentry、revalidate/replan、formal probe、manual 与 stop 的纯策略。 */
export interface RecoverySafetyPolicy {
  readonly localReentryRule: LocalReentryRule;
  readonly externalSideEffectRule: ExternalSideEffectRecoveryRule;
  readonly fingerprintMatchRule: RecoveryFingerprintMatchRule;
  readonly protectedHistoryRule: ProtectedRecoveryHistoryRule;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `classifyRecoveryNextAction(policy: RecoverySafetyPolicy, checkpoint: RecoveryCheckpoint, current: RecoveryCurrentContext): RecoveryDecision` | ResumeLocal/Revalidate/Replan/ProbeRequired/Manual/Stop | unknown external effect永不 ResumeLocal。 |
| `allowsLocalReentry(policy: RecoverySafetyPolicy, stage: RecoveryStage, completed: CompletedLocalStepSet): boolean` | 检查 bounded local step | no I/O。 |
| `recoveryRequiresProbe(policy: RecoverySafetyPolicy, attemptRef: Optional<ExternalAttemptRef>, outcome: ExternalOutcomeState): boolean` | formal probe guard | timeout/restart/count不构成等价。 |
| `validateResolutionForRecovery(policy: RecoverySafetyPolicy, resolution: ManualResolution, conflict: ConflictRecord): SyncResult<void>` | scope/allowed kind/history guard | 不执行 resolution。 |

### 11.8 CP4 模块停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| intent/effect | pass | resolution Recorded/Validated/Applied 分离。 |
| known/unknown | pass | checkpoint/probe/attempt 均保留 unknown，不 blind retry。 |
| field sources | pass_with_blockers | formal probe/idempotency/manual exact contract受 `004/005/010`。 |
| history | pass | conflict/checkpoint/resolution/probe 不物理删除或伪造。 |

## 12. `review_handoff_provenance` 对象契约

### 12.1 capability 与对象映射

| capability | 对象 | 核心输出 | 明确不承接 |
|---|---|---|---|
| inspect/freeze candidate | `ReviewCandidate` + eligibility policy | immutable candidate digest/scope | Artifact/Baseline、Gate、Git push |
| durable external attempt | `HandoffAttempt` | local attempt/transport/probe/external refs | Governance Decision truth |
| append protected provenance | `ProvenanceRecord` | body-free relation chain | formal evidence/audit/report |
| assemble layered semantics | `HandoffResultPolicy`、`LayeredHandoffStatus` | local/transport/probe/Decision layers | global success/verdict |
| aggregate no-write status | `SyncStatusView` | CP1～CP5 read slices/degradation | refresh/repair/probe/write |

### 12.2 CP5 state enums

```ts
/** frozen review candidate 的本地生命周期。 */
export enum ReviewCandidateState {
  /** 已固定 operation/binding/source，正在形成 eligibility basis。 */
  Inspecting = "inspecting",
  /** 当前 hard gates 通过，但 digest/scope 尚未冻结。 */
  Eligible = "eligible",
  /** digest、scope、generation 与 observation 已固定，可准备 handoff。 */
  Frozen = "frozen",
  /** 任一来源、权限、generation、working-copy 或 conflict basis 已漂移。 */
  Invalidated = "invalidated",
  /** 已关联 durable HandoffAttempt.Prepared；不表示 transport 或 Decision 成功。 */
  HandedOff = "handed_off",
}
/** external-effect attempt 的本地分层状态；任何 member 都不等于 Review accepted。 */
export enum HandoffAttemptState {
  /** candidate/target/idempotency context 已 durable，尚未调用外部 handoff。 */
  Prepared = "prepared",
  /** 正式 handoff 调用已开始。 */
  Calling = "calling",
  /** transport outcome 已知；ACK/HTTP success 仍不是 Review accepted。 */
  TransportKnown = "transport_known",
  /** 调用可能产生 effect，但 response 无法归属。 */
  OutcomeUnknown = "outcome_unknown",
  /** 已绑定正式 probe 记录；原 submit 不得重放。 */
  ProbeRequired = "probe_required",
  /** 已知 external handoff ref，owner Decision 仍 pending/unknown。 */
  ExternalPending = "external_pending",
  /** 正式 owner read/probe 返回 terminal external state ref；本地不重解释 verdict。 */
  TerminalKnown = "terminal_known",
}
/** append-only provenance relation 的保护/完整性状态。 */
export enum ProvenanceRecordState {
  /** 当前 relation 可读且 digest/ref closure 已知。 */
  Active = "active",
  /** replacement relation 已显式回链；旧记录仍不可删除。 */
  Superseded = "superseded",
  /** 被 active truth/history 引用，必须受保护保留。 */
  Protected = "protected",
  /** digest、parent 或 referenced truth closure 无法证明；不得补造。 */
  IntegrityUnknown = "integrity_unknown",
}
/** status query 的读取完整性，而非同步成功状态。 */
export enum SyncReadCompleteness {
  /** 请求的全部可见 slice 已读取；不表示 synchronized/accepted/ready。 */
  CompleteRead = "complete_read",
  /** 至少一个 slice 明确 missing/stale/restricted，但其余结果可返回。 */
  PartialRead = "partial_read",
  /** hard visibility/integrity gate 阻止形成可信 composite view。 */
  BlockedRead = "blocked_read",
  /** 所需 read capability 当前不可用，无法形成请求的 view。 */
  UnavailableRead = "unavailable_read",
}
```

`CandidateEligibilityDecision` 的 `kind` 是 policy 的无 lifecycle 判定轴，不复用 `EligibilityOutcome`：后者只表达 CP1 access 结论，不能承载 local drift 或 replacement requirement。Sidecar 必须复用该正式 decision 类型，不另造同义 enum。

### 12.3 `ReviewCandidate`

```ts
/** Candidate hard-gate 的判别结果；每个非 eligible variant 强制携带对应 typed basis。 */
export type CandidateEligibilityDecision =
  | { readonly kind: "eligible"; readonly blockerSet: readonly [] }
  | { readonly kind: "blocked"; readonly blockerSet: HandoffBlockerSet }
  | { readonly kind: "needs_action"; readonly blockerSet: HandoffBlockerSet }
  | { readonly kind: "unknown"; readonly blockerSet: HandoffBlockerSet }
  | { readonly kind: "invalidated"; readonly blockerSet: HandoffBlockerSet };

/** Candidate policy evaluation 的 body-free sidecar；不增加 lifecycle 主语。 */
export interface CandidateEligibilityEvaluation {
  readonly evaluationRef: CandidateEligibilityEvaluationRef;
  readonly candidateRef: ReviewCandidateRef;
  readonly decision: CandidateEligibilityDecision;
  readonly checkedSnapshotRefs: ExternalOwnerSnapshotRefSet;
  readonly evaluatedAt: ObservedAt;
}

/** source/binding/local observation/path scope 的本地 frozen review candidate。 */
export interface ReviewCandidate {
  readonly candidateId: ReviewCandidateId;
  readonly operationRef: SyncOperationRef;
  readonly runtimeBindingSnapshotRef: RuntimeBindingSnapshotRef;
  readonly bindingRef: WorkingCopyBindingRef;
  readonly bindingGeneration: MetadataGeneration;
  readonly sourceRef: MaterialSourceRef;
  readonly localObservationRef: WorkingCopyObservationRef;
  readonly candidateDigestRef: Optional<CandidateDigestRef>;
  readonly includedPathScope: Optional<CandidatePathScope>;
  readonly state: ReviewCandidateState;
  readonly eligibilityEvaluationRef: CandidateEligibilityEvaluationRef;
  readonly handoffAttemptRef: Optional<HandoffAttemptRef>;
}
```

`CandidateEligibilityEvaluation` 是 application-local、body-free 的评价记录。`decision` 必须是同一次 `evaluateCandidateEligibility(...)` 的正式返回；`eligible` 时 `decision.blockerSet` 为空，其他 variant 不得被 adapter 或 repository 改写成 `eligible`。它不是第 30 个 domain truth；由 candidate repository sidecar/read model 保存，状态主语仍是 `ReviewCandidate`。

| 字段组 | 来源 / 不变量 |
|---|---|
| operation/runtime binding/binding/generation/source | repositories/current explicit selection；同 context；runtime binding ref 必须等于 owning operation，不能换用当前 composition snapshot。 |
| observation/eligibility | current body-free observation + policy evaluation。 |
| digest/scope | freeze 时由 bounded canonical inputs + explicit scope 产生；Inspecting/Eligible 可 null。 |
| handoff ref | only durable `HandoffAttempt.Prepared` after freeze。 |

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `inspectReviewCandidate(input: InspectReviewCandidateInput): SyncResult<ReviewCandidate>` | factory Inspecting | no Artifact/Baseline/Git commit creation。 |
| `evaluateCandidate(candidate: ReviewCandidate, context: CandidateEligibilityContext, policy: CandidateEligibilityPolicy): SyncResult<ReviewCandidate>` | Inspecting→Eligible when all gates pass；blocked/unknown返回 typed error，状态不暗改 | invalidation 必须另调 `invalidateReviewCandidate`。 |
| `freezeReviewCandidate(candidate: ReviewCandidate, digestRef: CandidateDigestRef, scope: CandidatePathScope, observationRef: WorkingCopyObservationRef): SyncResult<ReviewCandidate>` | Eligible→Frozen | digest/scope/generation fixed。 |
| `validateCandidateUnchanged(candidate: ReviewCandidate, observation: WorkingCopyObservation, generation: MetadataGeneration): SyncResult<void>` | pre-call drift guard | mismatch invalidates via explicit transition。 |
| `invalidateReviewCandidate(candidate: ReviewCandidate, reason: CandidateInvalidationReason): SyncResult<ReviewCandidate>` | Inspecting/Eligible/Frozen/HandedOff→Invalidated history | existing attempt remains；不得改写attempt outcome。 |
| `attachCandidateHandoff(candidate: ReviewCandidate, attempt: HandoffAttempt): SyncResult<ReviewCandidate>` | Frozen→HandedOff | attempt must reference candidate and be Prepared。 |

### 12.4 `HandoffAttempt`

```ts
/** call 前持久化并分层记录 transport/probe/external owner state 的 local attempt。 */
export interface HandoffAttempt {
  readonly attemptId: HandoffAttemptId;
  readonly candidateRef: ReviewCandidateRef;
  readonly runtimeBindingSnapshotRef: RuntimeBindingSnapshotRef;
  readonly governanceTargetRef: GovernanceHandoffTargetRef;
  readonly idempotencyContextRef: IdempotencyContextRef;
  readonly state: HandoffAttemptState;
  readonly invocationRef: Optional<HandoffInvocationRef>;
  readonly transportOutcome: Optional<TransportOutcome>;
  readonly externalHandoffRef: Optional<ExternalHandoffRef>;
  readonly probeRecordRef: Optional<ProbeRecordRef>;
  readonly decisionSnapshotRef: Optional<ExternalOwnerSnapshotRef>;
  readonly preparedAt: ObservedAt;
  readonly unknownCheckpointRef: Optional<RecoveryCheckpointRef>;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `prepareHandoffAttempt(input: PrepareHandoffAttemptInput): SyncResult<HandoffAttempt>` | factory Prepared；candidate必须 Frozen；runtime binding ref 必须与 candidate/operation一致；idempotency/correlation before call | durable save由 flow。 |
| `beginHandoffCall(attempt: HandoffAttempt, invocationRef: HandoffInvocationRef): SyncResult<HandoffAttempt>` | Prepared→Calling | 不执行 SDK call。 |
| `recordHandoffTransport(attempt: HandoffAttempt, outcome: TransportOutcome, externalRef: Optional<ExternalHandoffRef>): SyncResult<HandoffAttempt>` | Calling→TransportKnown；保存已知 transport layer与可选正式 external ref | ACK不升格；不在同一 helper暗跳 ExternalPending。 |
| `markHandoffOutcomeUnknown(attempt: HandoffAttempt, reason: UnknownOutcomeReason, checkpointRef: RecoveryCheckpointRef): SyncResult<HandoffAttempt>` | Calling→OutcomeUnknown | no blind resubmit。 |
| `requireHandoffProbe(attempt: HandoffAttempt, probeRef: ProbeRecordRef): SyncResult<HandoffAttempt>` | OutcomeUnknown→ProbeRequired | formal probe only。 |
| `markHandoffExternalPending(attempt: HandoffAttempt, externalRef: ExternalHandoffRef): SyncResult<HandoffAttempt>` | TransportKnown/ProbeRequired→ExternalPending | ref 必须来自正式 call/read/probe；不表示 Decision accepted。 |
| `attachHandoffDecisionSnapshot(attempt: HandoffAttempt, snapshot: ExternalOwnerSnapshot): SyncResult<HandoffAttempt>` | TransportKnown/ExternalPending/ProbeRequired 的 state-preserving revision | snapshot owner/context match；只关联 body-free owner truth，不创建 Decision。 |
| `finalizeKnownExternalState(attempt: HandoffAttempt, stateRef: ExternalHandoffStateRef): SyncResult<HandoffAttempt>` | TransportKnown/ExternalPending/ProbeRequired→TerminalKnown，且仅 formal owner read/probe result | state ref 不转成 local verdict。 |

### 12.5 `ProvenanceRecord`

```ts
/** body-free local relation history；只能 append/protect/supersede/标未知，不得删除或伪造。 */
export interface ProvenanceRecord {
  readonly provenanceId: ProvenanceRecordId;
  readonly relationKind: ProvenanceRelationKind;
  readonly subjectRef: LocalProvenanceSubjectRef;
  readonly sourceRefSet: ProvenanceSourceRefSet;
  readonly parentProvenanceRefs: ProvenanceRecordRefSet;
  readonly integrityDigestRef: ProvenanceDigestRef;
  readonly state: ProvenanceRecordState;
  readonly recordedAt: ObservedAt;
  readonly redactionMarker: RedactionMarker;
  readonly supersededByRef: Optional<ProvenanceRecordRef>;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `recordProvenanceRelation(input: RecordProvenanceInput): SyncResult<ProvenanceRecord>` | factory Active；refs 必须真实存在/同 context | append via repository。 |
| `linkProvenanceParent(record: ProvenanceRecord, parentRef: ProvenanceRecordRef): SyncResult<ProvenanceRecord>` | creation/transition phase only；防自环/重复 | 不补造 parent。 |
| `protectProvenance(record: ProvenanceRecord, reason: ProvenanceProtectionReason): SyncResult<ProvenanceRecord>` | Active→Protected | no delete。 |
| `supersedeProvenance(record: ProvenanceRecord, replacementRef: ProvenanceRecordRef): SyncResult<ProvenanceRecord>` | Active/Protected→Superseded | replacement真实存在且回链。 |
| `verifyProvenanceIntegrity(record: ProvenanceRecord, rule: ProvenanceProtectionRule): ProvenanceIntegrityDecision` | digest/ref closure verification | no repair。 |
| `markProvenanceIntegrityUnknown(record: ProvenanceRecord, reason: ProvenanceIntegrityGapReason): SyncResult<ProvenanceRecord>` | Active/Protected→IntegrityUnknown | explicit degraded visibility。 |

### 12.6 `CandidateEligibilityPolicy`

```ts
/** 联合 access/source/cursor/binding/local/conflict/recovery 的 candidate hard-gate policy。 */
export interface CandidateEligibilityPolicy {
  readonly requiredCandidateCheckSet: CandidateCheckRequirementSet;
  readonly driftRule: CandidateDriftRule;
  readonly conflictClearanceRule: ConflictClearanceRule;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `evaluateCandidateEligibility(policy: CandidateEligibilityPolicy, context: CandidateEligibilityContext): CandidateEligibilityDecision` | Eligible/Blocked/NeedsAction/Unknown/Invalidated | any archived/revoked/dirty/drift/unknown非 Eligible。 |
| `validateFrozenCandidate(policy: CandidateEligibilityPolicy, candidate: ReviewCandidate, current: CandidateEligibilityContext): SyncResult<void>` | call 前 recheck | no I/O。 |
| `candidateRequiresReplacement(policy: CandidateEligibilityPolicy, candidate: ReviewCandidate, facts: CandidateInvalidationFactSet): boolean` | input changed→new identity | invalidated不原地复活。 |

### 12.7 `HandoffResultPolicy`

```ts
/** 在不升格语义的前提下组装 local/transport/probe/external-decision layers。 */
export interface HandoffResultPolicy {
  readonly resultLayerRule: HandoffResultLayerRule;
  readonly elevationProhibitionRule: ResultElevationProhibitionRule;
  readonly unknownHandlingRule: UnknownOutcomeHandlingRule;
}
```

| 函数签名 | 作用 | 返回/副作用 |
|---|---|---|
| `assembleHandoffStatus(policy: HandoffResultPolicy, candidate: ReviewCandidate, attempt: Optional<HandoffAttempt>, probe: Optional<ProbeRecord>, decision: Optional<ExternalOwnerSnapshot>): LayeredHandoffStatus` | 组装四层 | no write/refresh。 |
| `classifyTransportOutcome(policy: HandoffResultPolicy, outcome: TransportOutcome): TransportOutcomeView` | ACK/failure/unknown 分类 | 不输出 accepted。 |
| `classifyExternalDecisionSnapshot(policy: HandoffResultPolicy, snapshot: ExternalOwnerSnapshot): ExternalDecisionStateView` | 仅映射 owner safe summary/ref | unknown/restricted显式。 |
| `handoffRequiresProbe(policy: HandoffResultPolicy, attempt: HandoffAttempt): boolean` | OutcomeUnknown/ProbeRequired 判断 | 不调用 port。 |

### 12.8 `LayeredHandoffStatus`

```ts
/** candidate/attempt/transport/probe/Governance snapshot 的不可变分层 read view。 */
export interface LayeredHandoffStatus {
  readonly runtimeBindingSnapshotRef: Optional<RuntimeBindingSnapshotRef>;
  readonly candidateState: ReviewCandidateStateView;
  readonly attemptState: Optional<HandoffAttemptStateView>;
  readonly transportState: Optional<TransportOutcomeView>;
  readonly probeState: Optional<ProbeRecordStateView>;
  readonly externalDecisionState: Optional<ExternalDecisionStateView>;
  readonly blockerSet: HandoffBlockerSet;
  readonly nextActionSet: SafeNextActionSet;
  readonly freshnessSummary: FreshnessSummary;
}
```

| 函数签名 | 作用 | 副作用 |
|---|---|---|
| `buildLayeredHandoffStatus(input: LayeredHandoffStatusInput, policy: HandoffResultPolicy): LayeredHandoffStatus` | factory from persisted slices；有candidate/attempt时两者runtime binding ref必须一致，否则degraded consistency defect | none；不 probe/read owner。 |
| `handoffCandidateIsFrozen(view: LayeredHandoffStatus): boolean` | local layer helper | none。 |
| `layeredStatusRequiresProbe(view: LayeredHandoffStatus): boolean` | safe action helper | none。 |
| `externalDecisionIsKnown(view: LayeredHandoffStatus): boolean` | owner layer visibility helper | known不代表 approved unless owner says so。 |
| `redactLayeredHandoffStatus(view: LayeredHandoffStatus, policyRef: RedactionPolicyRef): LayeredHandoffStatus` | safe output | none。 |

### 12.9 `SyncStatusView`

```ts
/** CP1～CP5 persisted/read-only slices 的 composite view；不是第六个 truth aggregate。 */
export interface SyncStatusView {
  readonly selectionSummary: SelectionSummaryView;
  readonly accessSummary: AccessEvaluationView;
  readonly bindingSummary: WorkingCopyBindingView;
  readonly cursorSummary: CursorStateView;
  readonly workingCopySummary: WorkingCopyObservationView;
  readonly materializationSummary: MaterializationStatusView;
  readonly conflictRecoverySummary: ConflictRecoveryStatusView;
  readonly handoffSummary: LayeredHandoffStatus;
  readonly provenanceSummary: ProvenanceSummaryView;
  readonly degradedReasonSet: StatusDegradedReasonSet;
  readonly readCompleteness: SyncReadCompleteness;
}
```

每个 secondary view 必须包含自己的 `subjectRef`、state/classification、freshness/observedAt、safe reasons 与 visibility；缺失 slice 使用 explicit Missing/Unavailable/Restricted variant，不得构造空/clean/success placeholder。

| 函数签名 | 作用 | 副作用 |
|---|---|---|
| `assembleSyncStatusView(input: SyncStatusSliceSet): SyncStatusView` | factory；计算 read completeness/degraded reasons | none；输入只允许 read capabilities。 |
| `syncStatusSafeNextActions(view: SyncStatusView): SafeNextActionSet` | 基于显式状态生成建议 | 不执行 action。 |
| `redactSyncStatusView(view: SyncStatusView, policyRef: RedactionPolicyRef): SyncStatusView` | body-free public view | none。 |
| `syncStatusContainsBlocker(view: SyncStatusView, kind: SyncBlockerKind): boolean` | typed blocker lookup | none。 |

### 12.10 CP5 模块停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| candidate/attempt | pass | freeze→durable prepare→call；drift/unknown 分开。 |
| result layers | pass | local/transport/probe/external Decision 无 global success。 |
| provenance | pass | append/protect/supersede/integrity unknown；无 delete/fabricate。 |
| status no-write | pass | view factories不持有 refresh/repair/probe/write capability。 |
| blockers | pass_with_blockers | Governance/SDK/idempotency/schema受 `001/004/005/006`。 |

## 13. 跨模块闭环审计

### 13.1 对象数量与归属

| feature | 正式对象 | 数量 | 结论 |
|---|---|---:|---|
| CP1 | SyncOperation、SyncSelection、AccessEvaluation、OperationEligibilityPolicy、ExternalOwnerSnapshot | 5 | complete |
| CP2 | WorkingCopyBinding、MetadataManifest、CursorState、MappingSet、WorkingCopyObservation、WorkingCopySafetyPolicy、MetadataIntegrityPolicy | 7 | complete |
| CP3 | MaterializationPlan、SourceDelta、PathChangeSet、MaterializationRun、MaterializationSafetyPolicy | 5 | complete |
| CP4 | ConflictRecord、RecoveryCheckpoint、ManualResolution、ProbeRecord、RecoverySafetyPolicy | 5 | complete |
| CP5 | ReviewCandidate、HandoffAttempt、ProvenanceRecord、CandidateEligibilityPolicy、HandoffResultPolicy、LayeredHandoffStatus、SyncStatusView | 7 | complete |
| 合计 | 正式 02 的 29 个 identity 主语 | 29 | no add/remove/merge |

### 13.2 对象组字段来源审计

| 对象组 | 已闭合字段来源 | Step 7 必须闭合 | 实现暂停条件 |
|---|---|---|---|
| IDs/time/digest | ID/Clock/Digest ports | exact async signatures/algorithm ref | provider unavailable或digest canonical input不明 |
| explicit selection | Command input + runtime validation | protocol DTO/entry validation | 任一 ref implicit/missing |
| owner snapshot/evaluation | owner safe result + policy | OwnerAccess/Reference ports | `SYNC-UP-001/003` positive surface未闭合 |
| metadata/binding/cursor/mapping | local repositories/UoW + finalized run | read/write/expected generation/transaction handle | `SYNC-UP-006/008` physical/comparator未闭合 |
| observation/path/apply | Git/fs safe adapters | read-only vs mutation ports | dirty/path/tool unknown |
| conflict/recovery/probe | local stores + prior attempt + formal probe | repositories/RecoveryProbePort | no prior attempt/formal probe contract |
| candidate/handoff/decision | current slices + handoff/decision ports | durable prepare/call/probe/read seams | candidate drift或 `SYNC-UP-004/005` |
| provenance/views | append-only repo + persisted slices | graph reads/page helpers/redaction | missing ref/integrity unknown不得伪补 |

### 13.3 状态闭环审计

| 状态族 | 主语 | 初始 | 关键迁移 | 终态/特殊 | Step 10 承接 |
|---|---|---|---|---|---|
| operation/access/reference | Operation/Evaluation/Snapshot | Planned / evaluation result / captured posture | validate→ready→run→needs action/known terminal；fresh→conservative | Completed/Cancelled/FailedKnown；non-fresh | all transitions |
| metadata/local | Binding/Manifest/Cursor/Mapping | Initializing/Valid or pending/Unset/Valid | bound/restrict/migrate/rebind；only finalize advances | Invalidated/Corrupt/Gap/Unknown | separate axes |
| materialization | Plan/Path/Run | Draft/Draft/Prepared | validate/consume；evaluate；apply→pending→finalize | Invalidated/Partial/OutcomeUnknown/etc. | exact guards |
| recovery | Conflict/Checkpoint/Resolution/Probe | Open/Captured/Recorded/Prepared | decision/resume/probe | Closed/Superseded/etc. | intent/effect rules |
| handoff/provenance/read | Candidate/Attempt/Provenance/View | Inspecting/Prepared/Active/derived | freeze/call/probe/snapshot；protect/supersede | Invalidated/TerminalKnown/IntegrityUnknown；views no lifecycle | layered states |

### 13.4 命名与依赖审计

| 审计项 | 结论 |
|---|---|
| snake_case files / UpperCamelCase types / lowerCamelCase functions | pass；设计函数名统一为 lowerCamelCase。 |
| `Optional<T>`/readonly/no `any` | pass；协议/physical serialization待 Step 8/11。 |
| 同名状态 | pass；所有状态均带主语，无 GlobalSyncState。 |
| cross-feature deps | pass；只传 typed refs/snapshots/decisions；I/O 经 ports。 |
| owner truth | pass；Project/Artifact/Baseline/Review/Workspace/Archive/Git remote 未成为本地对象。 |
| forbidden actions | pass；无自动 merge/rebase/push/stash/overwrite/review acceptance/provenance delete。 |

### 13.5 Step 7 承接清单

| 契约组 | 必须承接对象能力 | Step 7 输出 | 未承接 blocker |
|---|---|---|---|
| base infrastructure | ids/time/digests/context/results | `ClockPort`、`IdPort`、`DigestPort`、local UoW/idempotency repository | factories/time/fingerprint/replay不可实现 |
| CP1 | snapshots/evaluations/operation reads/writes | owner ports + operation/evaluation/snapshot repositories | eligibility flow不可编码 |
| CP2 | manifest/binding/cursor/mapping/observation | metadata repositories/UoW + Git/fs read ports | clone/status/migration不可编码 |
| CP3 | source delta + stage/apply/finalize | source/Git/fs apply ports + plan/run repositories | pull/clone materialization不可编码 |
| CP4 | conflict/checkpoint/resolution/probe | three repositories + formal probe port | resume/unknown recovery不可编码 |
| CP5 | candidate/attempt/provenance/views | repositories + handoff/decision/diagnostics ports | push-review/status不可编码 |
| read surface | all secondary views/pages | read repositories/page helper schema | Step 8 query DTO不可构造 |

## 14. 回填草稿

未来正式 §5 按 feature 摘录 capability→对象映射、29 个对象的 interface/字段/函数/状态/禁止事项；§6 形成对象/state/technical carrier 索引。完整逐对象依据保留在本文件，不在正式正文压成一张无法落码的总表。

## 15. 待确认事项

- `SYNC-UP-001~010` 全部保持 `pending/blocked`；positive owner/source/handoff、physical schema、Git mapping、comparator、tool/path 合同没有被对象类型关闭。
- `SYNC-LOCAL-001~005` 未改变；对象契约不依赖具体 parser/schema library/test runner/Git library。
- `SyncDomainError` 当前是 Step 6 最小 domain surface；Step 12 必须完成稳定 error code、cause/redaction/recovery/CLI mapping，不能把本文件的 safe string 直接公开。
- 物理 persistence/serialization/expected-version/transaction 由 Step 11；本步只固定逻辑字段与函数。

## 16. 进入下一步条件

- [x] 先完成 shared vocabulary/technical carrier 决策，再按 CP1→CP5 串行展开。
- [x] 29 个正式对象全部有独立契约、readonly 字段、来源、不变量、factory/transition 函数、状态与禁止事项。
- [x] 每个模块 capability 有对象承接，每个对象能回指 capability。
- [x] 字段来源、状态、命名、跨模块依赖与 Step 7 seam 已完成闭环审计。
- [x] 外部 truth、unknown outcome、no-write、dirty protection、ACK/Decision、provenance 边界无漂移。
- [x] 未修改正式 03、未创建实现/测试/evidence/implementation ledger/commit。

结论：Step 6 通过 `pass_with_upstream_blockers`；允许按用户授权进入 Step 7。此处“可落码”指本地类型与负向/blocked seam 可直接实现，不表示被上游 blocker 阻断的正向 integration 已 ready。
