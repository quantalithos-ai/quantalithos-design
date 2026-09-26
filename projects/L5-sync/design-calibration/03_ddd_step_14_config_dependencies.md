# Step 14. 配置引用与外部依赖绑定

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14
>
> 本步采用 `projects/L1-governance` Step 14 的“配置引用→代码绑定→外部依赖→runtime builder→前序审计”框架，并按 L5-sync 的 TypeScript、local working copy、`.qs-sync`、SDK/Git/filesystem seam 重写。它只定义代码 binding point，不是完整配置手册，也不证明任何 adapter、仓库、命令或集成已经实现。

## 1. Step 状态与分批计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14：配置引用与外部依赖绑定 |
| 当前状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 回填位置 | 正式 `03-详细设计.md` §13；并回填 §5/§6/§10 的 runtime binding 接缝 |
| 本步禁止 | 不定义外部 key/env/profile precedence、数值默认、endpoint、secret、物理 `.qs-sync` schema、具体 parser/validator/Git library 或 package manifest |

### 1.1 分批计划

| 批次 | 内容 | 状态 | 停审结论 |
|---|---|---|---|
| 14.1 | 输入、SOP 回答、诊断与取舍 | completed | 配置只进入 `src/config` / `src/composition` / concrete adapter |
| 14.2 | TypeScript config carrier、limits/budgets、capability snapshot | completed | typed binding 已闭口；数值与物理来源留 04 |
| 14.3 | `.qs-sync`、SDK、Git、filesystem、diagnostics、local providers binding | completed | 每项均回指 Step 7 port；positive slots 保持 blocked |
| 14.4 | dependency 分类、capability validation、runtime builder 顺序 | completed | TypeScript package/runtime 分类成立；Cargo 不适用 |
| 14.5 | Step 6/7/11/13 回填与跨步审计 | completed | immutable runtime context ref 缺口已识别并回补 |

## 2. 本步输入

| 输入 | 本步采用内容 |
|---|---|
| Step 3 | TypeScript strict/ESM/Node-compatible；`SYNC-LOCAL-001~005`；SDK 已存在但 Sync-specific surface 未发布。 |
| Step 4 | `src/config/*`、`src/composition/*`、SDK/Git/filesystem/metadata/diagnostics adapter 计划文件和单 package 形态。 |
| Step 5～7 | 五 feature、正交技术层、repository/UoW/Clock/ID/Digest、owner/source/handoff/probe、Git/fs、diagnostics 与 availability ports。 |
| Step 8～10 | 10 Command、13 Query、3 conditional Consumer、3 Job，29 条 flow 和 17 个 lifecycle state machine 的 capability 需求。 |
| Step 11～13 | logical stores、事务/unknown、错误映射、namespaced idempotency、target lock 与 exact replay。 |
| 正式 02 §11 | 配置影响类别、15 项不可配置化边界、immutable config/capability context ref 与 03/04 分工。 |
| `L1-governance` Step 14 | 配置到代码/adapter/builder 的组织粒度；不继承其 Rust/Cargo、outbox、projection、fake-positive 业务结论。 |
| `L1-workspace` Step 14 | capability 隔离、driver 未确认时保守绑定、query no-write 与配置不生成 runtime observation 的约束。 |

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些模块读取配置？ | 只有 `src/config/*` 读取 raw source；`src/composition/*` 读取 validated config 并构造 adapter/service graph；concrete adapter constructor 只接收其局部 typed binding。CLI/operations entry 只接收已验证的 boundary/job 参数。Application/Domain 不读取 raw config、环境变量或 provider config。 |
| 类型、默认值与读取点是什么？ | §6～§8 给出稳定代码类型和读取点。所有数值/adapter refs 在 03 均无隐式默认；缺失、冲突或不安全值由 validator 拒绝或把受影响 capability 标为 blocked。外部 key、来源、precedence 和具体值由 04 定义。 |
| 哪些依赖通过 adapter 注入？ | `.qs-sync` logical store/UoW/lock、SDK owner/source/handoff/decision/probe、Git observation/worktree、filesystem inspection/apply、diagnostics、Clock/ID/Digest，均通过 Step 7 port 注入。 |
| timeout/retry/degrade 如何处理？ | 每次 port 调用有显式正时长 budget；当前不存在通用隐式 retry。read timeout→unavailable/unknown；Git/fs 或外部 effect timeout→partial/outcome_unknown，绝不推定未发生或自动重放；diagnostics failure 与业务结果隔离。 |
| 哪些细节留给 04？ | external keys、文件/环境/profile来源与优先级、secret/credential provider 配置、endpoint/TLS、数值、物理 metadata backend/schema/migration、具体 Git executable/library、schedule、输出样式和变更/restart 行为。 |
| Rust/Cargo 依赖问题如何适用？ | 本仓为 TypeScript，Cargo 问题 `N/A`。只有 `@quantalithos/sdk` 是已核验的 compile/runtime package candidate；具体 package manager、local reference syntax 和 version range受 `SYNC-LOCAL-002/005` 阻塞。其他 owner 仓不得成为 direct package/path dependency。 |
| 依赖未就绪时 fake、暂停还是等待？ | 正向 owner/source/handoff/probe/metadata/Git/fs integration 保持 blocked/unsupported/unknown；test double 仅可验证本地 fail-closed/negative mechanics，不能进入 runtime config、不能关闭 blocker或证明 integration。需要真实 schema/方法/语义的实施单元必须等待正式合同。 |

## 4. 当前闭环诊断

| 发现 | 风险 | 本步处置 |
|---|---|---|
| Step 4 有 config/composition 路径，但尚无稳定 typed binding surface | 实现者可能让每个 adapter自行读 env/任意 map | 定义 `ValidatedSyncRuntimeConfig`、局部 config families 与唯一 loader/validator/composition root。 |
| Step 7 引用 `SyncAdapterCapability` / `AdapterCapabilitySnapshot`，尚未给 exact union/schema | capability 可能退化成任意 string 或 bool ready | 本步定义 exact capability union、四态 binding disposition 与 body-free snapshot。 |
| 正式 02 要求 operation/plan/candidate/attempt 固定 immutable context ref，Step 6 未落字段 | 热更新或重建后无法证明 effect 使用何种 binding | 增加 `runtimeBindingSnapshotRef`，由 append-only `RuntimeBindingSnapshotRepository` 解析；四对象必须引用同一 operation context。 |
| `.qs-sync` 仍只有 logical store contract | config 可能私选历史 `metadata.json` 或把 metadata 放到 target 外 | 固定 `.qs-sync` 为受控 logical namespace；物理文件/schema/backend 仍 blocked，adapter capability 不满足即不可 mutation。 |
| timeout/retry 仍是模糊类别 | retry 参数可能绕过 unknown/no-resubmit | 当前 config surface不提供 generic retry；timeout 映射按 effect boundary 固定。 |
| Consumer/Job 有计划入口但无正式 transport/scheduler contract | enable flag 可能被误当合同 | consumer binding 必须保持 blocked；job runner只能接收显式 request，不由 config 创建业务 scope/key。 |
| LFS、shallow clone、GUI/Tauri 出现在历史材料 | 配置开关可能偷渡成当前支持 | 不进入 positive config family；请求只能得到 typed `unsupported/blocked`。 |

## 5. 设计取舍

| 议题 | 采用 | 不采用 |
|---|---|---|
| raw config ownership | `load_runtime_config.ts` 读 `unknown`，`validate_runtime_config.ts` 收窄为 immutable typed config | Domain/Application/adapter 在运行途中各自读取 env/file。 |
| config 对象传递 | composition 拆成局部 constructor inputs、ports、limits/budgets | 把完整 `ValidatedSyncRuntimeConfig` 注入所有 service。 |
| capability 表达 | exact capability + `bound/blocked/unsupported/unknown` + safe reason | boolean `enabled/ready`，或把配置存在解释为 owner permission。 |
| 在途语境 | body-free append-only runtime binding snapshot ref | 热更新原地改写 operation/plan/candidate/attempt 语境。 |
| timeout/retry | 有界单次调用；ambiguous effect→unknown；显式新入口才能继续 | adapter 隐式 retry、timeout→not happened、换 key 重放。 |
| metadata binding | 一个满足 logical store/UoW/version/append/lock contract 的 adapter family | 固定历史单文件、分步 best-effort save、provenance cleanup。 |
| fake | Step 16 test composition 明确注入 | runtime config 指向 fake 并把它声明为真实 capability。 |

## 6. Typed config 与 runtime binding carrier

### 6.1 Primitive value 与 ref family

以下类型位于 `src/config/runtime_config.ts`；它们是 validated in-memory code shape，不规定 raw JSON/YAML/env 表示。

```ts
export interface PositiveInteger {
  readonly value: number;
}

export interface PositiveByteSize {
  readonly bytes: number;
}

export interface PositiveDurationMs {
  readonly milliseconds: number;
}

export type SyncRuntimeConfigRef = OpaqueRef<"sync_runtime_config">;
export type SyncRuntimeProfileRef = OpaqueRef<"sync_runtime_profile">;
export type SyncAdapterBindingRef = OpaqueRef<"sync_adapter_binding">;
export type RuntimeBindingSnapshotRef = OpaqueRef<"runtime_binding_snapshot">;
export type CredentialProviderRef = OpaqueRef<"credential_provider">;
export type AllowedTargetRootPolicyRef = OpaqueRef<"allowed_target_root_policy">;
export type DigestAlgorithmRef = OpaqueRef<"digest_algorithm">;
```

构造/validator 规则：所有 number 必须 finite、安全整数且 `> 0`；解析失败不能 clamp、fallback 为无限或零。Ref 只保存 opaque identity，不保存 endpoint、token、credential、证书、路径正文或 provider payload。

### 6.2 Validated config families

```ts
export interface SyncBoundaryLimits {
  readonly maxRequestBytes: PositiveByteSize;
  readonly maxPageItems: PositiveInteger;
  readonly maxPathScopeItems: PositiveInteger;
  readonly maxTargetScopeItems: PositiveInteger;
  readonly maxDiagnosticItems: PositiveInteger;
}

export interface SyncExecutionBudgets {
  readonly localReadTimeout: PositiveDurationMs;
  readonly localCommitTimeout: PositiveDurationMs;
  readonly metadataLockAcquireTimeout: PositiveDurationMs;
  readonly sdkReadTimeout: PositiveDurationMs;
  readonly externalEffectTimeout: PositiveDurationMs;
  readonly localToolEffectTimeout: PositiveDurationMs;
  readonly shutdownTimeout: PositiveDurationMs;
  readonly maxConcurrentMutations: PositiveInteger;
}

export interface SyncJobBudgets {
  readonly maxBatchItems: PositiveInteger;
  readonly maxParallelItems: PositiveInteger;
}

export interface SyncMetadataBindings {
  readonly storeAdapterRef: SyncAdapterBindingRef;
  readonly unitOfWorkAdapterRef: SyncAdapterBindingRef;
  readonly lockAdapterRef: SyncAdapterBindingRef;
}

export interface SyncSdkBindings {
  readonly sdkProfileRef: SyncAdapterBindingRef;
  readonly credentialProviderRef: CredentialProviderRef;
  readonly ownerAccessAdapterRef: SyncAdapterBindingRef;
  readonly materialSourceAdapterRef: SyncAdapterBindingRef;
  readonly reviewHandoffAdapterRef: SyncAdapterBindingRef;
  readonly reviewDecisionReadAdapterRef: SyncAdapterBindingRef;
  readonly recoveryProbeAdapterRef: SyncAdapterBindingRef;
}

export interface SyncLocalToolBindings {
  readonly gitObservationAdapterRef: SyncAdapterBindingRef;
  readonly gitWorktreeAdapterRef: SyncAdapterBindingRef;
  readonly filesystemInspectionAdapterRef: SyncAdapterBindingRef;
  readonly filesystemApplyAdapterRef: SyncAdapterBindingRef;
  readonly allowedTargetRootPolicyRef: AllowedTargetRootPolicyRef;
}

export interface SyncSupportBindings {
  readonly diagnosticsAdapterRef: SyncAdapterBindingRef;
  readonly redactionPolicyRef: RedactionPolicyRef;
  readonly clockAdapterRef: SyncAdapterBindingRef;
  readonly idAdapterRef: SyncAdapterBindingRef;
  readonly digestAdapterRef: SyncAdapterBindingRef;
  readonly digestAlgorithmRef: DigestAlgorithmRef;
}

export interface SyncOperationsBindings {
  readonly accessOrPostureConsumerRef: Optional<SyncAdapterBindingRef>;
  readonly materialSourceConsumerRef: Optional<SyncAdapterBindingRef>;
  readonly reviewDecisionConsumerRef: Optional<SyncAdapterBindingRef>;
  readonly jobRunnerRef: Optional<SyncAdapterBindingRef>;
}

export interface ValidatedSyncRuntimeConfig {
  readonly configRef: SyncRuntimeConfigRef;
  readonly profileRef: SyncRuntimeProfileRef;
  readonly boundary: SyncBoundaryLimits;
  readonly execution: SyncExecutionBudgets;
  readonly jobs: SyncJobBudgets;
  readonly metadata: SyncMetadataBindings;
  readonly sdk: SyncSdkBindings;
  readonly localTools: SyncLocalToolBindings;
  readonly support: SyncSupportBindings;
  readonly operations: SyncOperationsBindings;
}
```

`ValidatedSyncRuntimeConfig` 只在 `src/config` 与 `src/composition` 可见。Application constructor 接收 Step 7 ports、`SyncBoundaryLimits` / `SyncJobBudgets` 的最小必要子集和当前 immutable runtime binding snapshot；Domain 只接收显式 policy/function 参数，不依赖上述 config interfaces。

### 6.3 Exact capability 与 immutable snapshot

```ts
export type SyncAdapterCapability =
  | "metadata_read"
  | "metadata_atomic_write"
  | "metadata_target_lock"
  | "owner_access_read"
  | "material_source_read"
  | "git_observation"
  | "git_local_apply"
  | "filesystem_inspection"
  | "filesystem_stage_commit"
  | "review_handoff_submit"
  | "review_decision_read"
  | "recovery_probe"
  | "diagnostics_emit"
  | "clock"
  | "id_generation"
  | "digest"
  | "consume_access_or_posture_invalidated"
  | "consume_material_source_invalidated"
  | "consume_review_decision_changed"
  | "run_metadata_integrity_scan"
  | "run_pending_handoff_probe"
  | "run_snapshot_staleness_scan";

export type AdapterAvailability =
  | "bound"
  | "blocked"
  | "unsupported"
  | "unknown";

export type AdapterBindingReason =
  | { readonly kind: "bound_validated" }
  | { readonly kind: "missing_binding"; readonly blockerRef: OpaqueRef<"sync_blocker"> }
  | { readonly kind: "contract_blocked"; readonly blockerRef: OpaqueRef<"sync_blocker"> }
  | { readonly kind: "capability_unsupported"; readonly capability: SyncAdapterCapability }
  | { readonly kind: "capability_unknown"; readonly capability: SyncAdapterCapability }
  | { readonly kind: "invalid_binding"; readonly issueRef: OpaqueRef<"config_validation_issue"> };

export interface AdapterCapabilityBinding {
  readonly capability: SyncAdapterCapability;
  readonly availability: AdapterAvailability;
  readonly adapterBindingRef: Optional<SyncAdapterBindingRef>;
  readonly safeReasonSet: ReadonlyArray<AdapterBindingReason>;
}

export type AdapterCapabilitySet = ReadonlyArray<AdapterCapabilityBinding>;

export type AdapterCallDisposition =
  | "known_result"
  | "known_denied"
  | "unavailable"
  | "unsupported"
  | "invalid_response"
  | "outcome_unknown";

/** Body-free、append-only 的本次 runtime composition 绑定事实；不是 readiness 或授权。 */
export interface AdapterCapabilitySnapshot {
  readonly snapshotRef: RuntimeBindingSnapshotRef;
  readonly configRef: SyncRuntimeConfigRef;
  readonly profileRef: SyncRuntimeProfileRef;
  readonly bindings: AdapterCapabilitySet;
  readonly capturedAt: ObservedAt;
}
```

不变量：

1. exact union 中每个 capability 必须恰有一个 binding；重复、遗漏或 unknown string 使 validation 失败。`AdapterBindingReason` 与 availability 必须相容：`bound` 仅可含 `bound_validated`，其他姿态不得含它。
2. `bound` 只证明 typed constructor/static capability validation 成功，不证明依赖此刻健康、owner 允许、source 最新、Git clean、integration ready 或命令必然成功。
3. `blocked` 表示已知合同/配置前置缺失；`unsupported` 表示正式能力不支持；`unknown` 表示无法安全判断。三者均不得被映射成 `bound` fallback。
4. snapshot 不含 raw config、endpoint、credential、文件正文、Git stdout/stderr、owner payload、测试结果、evidence、report、verdict、signoff 或 readiness。
5. 每个 runtime composition 完成 capability 分类后创建一个 immutable snapshot；mutation首次引用它前通过 repository `ensure` 持久化，operation/plan/candidate/attempt使用同一 `snapshotRef`。runtime 重建或配置变化产生新 snapshot，不改旧对象。
6. `AdapterCallDisposition` 是单次 port call 的技术结果，不得由 snapshot availability直接生成；`bound` 后调用仍可能 unavailable/denied/invalid/unknown。

### 6.4 Runtime binding repository

本接缝属于 `src/orchestration` application-local contract，由 `src/adapters/metadata` 实现：

```ts
export interface RuntimeBindingSnapshotRepository {
  get(ref: RuntimeBindingSnapshotRef): Promise<PortResult<AdapterCapabilitySnapshot>>;
  ensure(snapshot: AdapterCapabilitySnapshot, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<RuntimeBindingSnapshotEnsureResult>>;
}

export type RuntimeBindingSnapshotEnsureResult =
  | { readonly kind: "inserted"; readonly receipt: AppendReceipt }
  | { readonly kind: "existing_exact"; readonly snapshotRef: RuntimeBindingSnapshotRef };
```

Snapshot identity/time由composition在完成全部binding分类后通过 `IdPort`/`ClockPort`生成，并在该composition生命周期内固定。首次mutation随`SyncOperation`初始transition在同一UoW `ensure`；后续operation可得到`existing_exact`并引用相同ref。相同ref但config/profile/binding/capturedAt任一不同是typed consistency conflict；repository不update/delete。Query可读取当前in-memory snapshot但不能调用`ensure`。缺失或对象引用不同snapshot是consistency defect，不允许从当前config重建旧语境。

## 7. 配置引用表

下表中的字段名是 code-level property，不是对 raw 配置 key 的承诺；“无”表示 03 不定义隐式默认，04 必须给来源和值或声明该 capability 不装配。

| 配置项 | 类型 | 读取模块 / 注入点 | 03 默认口径 | 04 承接 |
|---|---|---|---|---|
| `configRef` / `profileRef` | typed refs | config loader、runtime composition、snapshot factory | 无；必须可追溯 | source、precedence、identity |
| `boundary.maxRequestBytes` | `PositiveByteSize` | CLI decode 前、consumer/job envelope boundary | 无；超限 reject | 数值与来源 |
| `boundary.maxPageItems` | `PositiveInteger` | query mapper、repository page wrapper | 无；不 silent clamp | 数值与 public page rule |
| `boundary.maxPathScopeItems` | `PositiveInteger` | Clone/Pull/Push/Resolution entry | 无；不截断 scope 后宣称成功 | 数值 |
| `boundary.maxTargetScopeItems` | `PositiveInteger` | job input validator | 无；job 不扩大 scope | 数值 |
| `boundary.maxDiagnosticItems` | `PositiveInteger` | diagnostic read/presenter | 无；超限返回 bounded/degraded，不伪 complete | 数值 |
| `execution.localReadTimeout` | `PositiveDurationMs` | metadata read wrapper | 无 | 数值 |
| `execution.localCommitTimeout` | `PositiveDurationMs` | `LocalStateUnitOfWorkPort` adapter | 无；timeout=`commit_status_unknown` | 数值 |
| `execution.metadataLockAcquireTimeout` | `PositiveDurationMs` | `MetadataLockPort` adapter | 无；timeout不视为已持锁 | 数值 |
| `execution.sdkReadTimeout` | `PositiveDurationMs` | owner/source/decision read adapter wrapper | 无；timeout unavailable/unknown | 数值 |
| `execution.externalEffectTimeout` | `PositiveDurationMs` | handoff/probe effect wrapper | 无；ambiguous→outcome_unknown | 数值 |
| `execution.localToolEffectTimeout` | `PositiveDurationMs` | Git/fs apply wrapper | 无；partial/unknown，不自动重放 | 数值 |
| `execution.shutdownTimeout` | `PositiveDurationMs` | CLI/job entry shutdown coordinator | 无；停止接收并保留在途 unknown | 数值 |
| `execution.maxConcurrentMutations` | `PositiveInteger` | composition scheduler/semaphore | 无；不替代 target lock/version | 数值 |
| `jobs.maxBatchItems` | `PositiveInteger` | three job runners | 无；必须 `<= boundary.maxTargetScopeItems` | 数值 |
| `jobs.maxParallelItems` | `PositiveInteger` | per-item runner | 无；每 item 独立 UoW | 数值 |
| `metadata.*AdapterRef` | typed adapter refs | metadata adapter factory/UoW/lock | 无；缺一则 mutation capability blocked | backend/constructor binding |
| `sdk.*AdapterRef` / `credentialProviderRef` | typed refs | SDK adapter factories | positive path blocked by upstream | endpoint/TLS/credential source |
| `localTools.*AdapterRef` / root policy | typed refs | Git/fs adapter factories | no arbitrary shell; support pending | tool/library/root policy |
| `support.diagnosticsAdapterRef` / redaction | typed refs | diagnostics adapter/presenter | sink failure isolated；redaction mandatory | sink/profile/source |
| `support.clock/id/digest*` | typed refs | provider factories | deterministic test providers only in test composition | provider/algorithm selection |
| `operations.*ConsumerRef` | optional typed refs | conditional consumer composition | `null/blocked` until formal event contract | transport/schema/binding |
| `operations.jobRunnerRef` | optional typed ref | explicit job entry composition | no scheduler assumption | runner/schedule source |

## 8. Config section 到代码绑定

| Config family | 读取位置 | 构造 / 注入对象 | 不变量 |
|---|---|---|---|
| loader/identity | `src/config/load_runtime_config.ts` | raw `unknown` source + safe source ref | 不读取业务 truth；不把 source path/secret写 snapshot。 |
| validation | `src/config/validate_runtime_config.ts` | `ValidatedSyncRuntimeConfig` 或 typed issue set | unknown field/invalid type/conflict/hard-boundary override fail closed。 |
| boundary limits | CLI/consumer/job entry wrappers | parser-neutral request/page/scope guards | 不补 selection、key、actor或 scope；不 silent truncate success。 |
| execution budgets | composition wrappers | metadata/SDK/Git/fs call guards、bounded concurrency | timeout不改变 known/unknown语义；semaphore不替代 version/lock。 |
| metadata | `src/composition/runtime_composition.ts` + metadata adapter constructors | repositories、UoW、target lock、runtime snapshot repo | 必须满足 §9 capability；不能 best-effort 降级。 |
| SDK | SDK adapter constructors | Step 7 owner/source/handoff/decision/probe ports | 只能用正式 SDK public surface；no private endpoint/schema。 |
| local tools | Git/fs adapter constructors | observation、inspection、worktree/apply、root policy | command/operation whitelist 固定在代码；config不提供 argv。 |
| diagnostics | diagnostics adapter + output presenter | `DiagnosticsPort`、redaction policy | 失败不改业务状态；禁止生成 evidence/report/verdict/readiness。 |
| providers | composition | `ClockPort`、`IdPort`、`DigestPort` | refs/algorithm固定到 snapshot；不得用时间/Git commit替代 version/digest。 |
| operations | consumer/job entry composition | blocked consumer slots、three bounded job runners | config不生成 topic/schema/scope/key，不启动 auto repair/pull/push。 |

## 9. `.qs-sync` metadata binding contract

`.qs-sync` 是 L5-sync 受控 local metadata 的 logical reserved namespace；本步不锁定其内部是文件、多个文件、嵌入式数据库或其他 durable representation，也不锁定 schema version、migration path、encryption 或 retention 数值。配置不得重命名该 namespace、把它指向 working-copy target 之外，或把历史 `.qs-sync/metadata.json` 当成当前事实。

Metadata adapter 被标记 `metadata_atomic_write=bound` 前必须静态证明其 constructor capability 覆盖：

| Capability | 必须满足 | 不满足时 |
|---|---|---|
| typed logical stores/indexes | Step 11 全部 store、typed lookup、unique identity | `blocked/unsupported`；不可只实现常用表面。 |
| optimistic version | `Versioned<T>` + exact expected version | mutation blocked；不得 last-write-wins。 |
| local UoW | Step 11 atomic visibility sets与 known/unknown commit result | mutation blocked；不得分步写后补偿称原子。 |
| append/protection | proof/transition/result/invocation/provenance/snapshot append-only；old generation可读 | mutation blocked；不得 cleanup/overwrite。 |
| idempotency/replay | namespaced key/digest + complete typed carrier原子可见 | mutation/consumer/job blocked。 |
| target lock | canonical target lease + release；未知/过期不当已获取 | affected local effect blocked；version/fingerprint仍必需。 |
| crash/read isolation | committed state与 staged state可区分；commit ambiguity可 reload | 无证明则 `unknown/blocked`。 |
| forbidden content | 无 credential/raw owner body/file body/stdout/stderr/evidence/report body | validation reject；不得持久化。 |

`storeAdapterRef`、`unitOfWorkAdapterRef`、`lockAdapterRef` 可以由同一 concrete family 实现，但必须分别验证 capability，不能因为使用同一 ref 就自动推定全满足。`RuntimeBindingSnapshotRepository` 是 logical metadata contract 的一部分；snapshot 不替代 metadata manifest、provenance 或 owner truth。

## 10. 外部依赖绑定表

| 依赖 / facility | 绑定位置 | 使用接口 | timeout / retry | unavailable / degraded posture |
|---|---|---|---|---|
| local metadata store | `src/adapters/metadata/*` | feature repositories、snapshot repo | local read/commit timeout；无 blind commit retry | read unavailable；mutation blocked；commit unknown按原 key reload。 |
| local UoW / target lock | metadata adapters | `LocalStateUnitOfWorkPort`、`MetadataLockPort` | explicit timeout；无 stale write retry | lock unknown→blocked；UoW unknown→needs-action。 |
| L0 SDK client | `src/adapters/sdk/*` | formal public `SdkClient` seam | bounded single call；方法级 retry待正式合同 | exact method/schema缺失→blocked；malformed→invalid external response。 |
| Identity / Work / Archive posture | owner access SDK adapter | `OwnerAccessPort` | read timeout；无 local allow fallback | denied/blocked/unknown fail closed。 |
| Artifact / Workspace source | material source SDK adapter | `MaterialSourcePort` | read timeout；no guessed fallback/full replay | ambiguous authority/comparator→blocked；no pull/cursor advance。 |
| Governance handoff | review handoff SDK adapter | `ReviewHandoffPort` | one effect call；timeout/lost response→unknown | preserve attempt/checkpoint；no resubmit；ACK≠accepted。 |
| Governance Decision read | decision SDK adapter | `ReviewDecisionReadPort` | bounded read；no hidden refresh from Query | unavailable→layer unknown/partial；不创建 Decision。 |
| formal recovery probe | recovery probe SDK adapter | `RecoveryProbePort` | one explicit probe；ambiguous仍 unknown | unsupported→manual/needs-action；不重放 submit。 |
| Git observation | `src/adapters/git/git_observation_adapter.ts` | `WorkingCopyObservationPort` | bounded read；无 mutation retry | unsupported/unknown→not clean；LFS/shallow不猜支持。 |
| Git local worktree | `src/adapters/git/git_worktree_adapter.ts` | `GitWorktreePort` | one bounded typed apply；ambiguous→unknown | no fetch/push/merge/rebase/stash/remote mutation/arbitrary shell。 |
| filesystem inspection | `src/adapters/filesystem/filesystem_adapter.ts` | `FilesystemInspectionPort` | bounded read | path/symlink/permission/root unknown→blocked。 |
| filesystem stage/commit | `src/adapters/filesystem/filesystem_apply_adapter.ts` | `FilesystemApplyPort` | one bounded stage/commit；partial/unknown explicit | no dirty overwrite、implicit delete或 unsafe rollback claim。 |
| diagnostics sink | `src/adapters/diagnostics/diagnostics_adapter.ts` | `DiagnosticsPort` | bounded best-effort emit；不在 command内重试 | 业务结果不变；safe unavailable marker only。 |
| clock / ID / digest | composition-selected local adapters | `ClockPort`、`IdPort`、`DigestPort` | no retry | 缺失时在 mutation前 blocked；不得随机 fallback。 |
| inbound event transport | conditional consumer binding | `InboundSyncEventConsumerPort` | redelivery/retry contract未闭合 | 三 consumer保持 blocked；不订阅 private topic。 |
| operations runner | entry-local composition | `SyncMaintenanceJobPort` | explicit request/run；旧 key不接管 | runner缺失→unsupported；不产生 daemon truth。 |

## 11. SDK / Git / filesystem adapter binding rules

### 11.1 SDK family

- `SdkClient.call/read` 的当前 `unknown -> Promise<unknown>` 只证明 transport seam存在；每个 positive adapter必须等 `SYNC-UP-001~005/008` 提供正式 operation、request/result schema、error、version与unknown/probe语义，再由 runtime validator映射成本地类型。
- `CredentialProviderRef` 只能在 SDK adapter call context 中解引用；secret不得进入 `ValidatedSyncRuntimeConfig` snapshot、`.qs-sync`、status、diagnostics或 error。
- 一个 SDK profile可以支撑多个 adapter ref，但每个 capability单独验证；owner access成功不证明 source/handoff/probe可用。
- Adapter不得调用 sibling private API/DB、不得将 provider body穿过 port、不得用 cache/fake补 positive allow/source/Decision。

### 11.2 Git family

- Config只能选择已实现并经能力探测的 observation/worktree adapter binding，不能提供任意 executable argv、shell fragment、remote/refspec或 merge strategy。
- Git adapter只读 local HEAD/index/tree/dirty/capability和执行 Step 7 typed local apply；Git remote不是 truth，Git commit不是 Artifact/Baseline，且没有 push capability。
- LFS、shallow clone、GUI/Tauri 当前没有 positive capability member或 config开关；发现相关工作区姿态时只能 `unsupported/blocked/unknown`。

### 11.3 Filesystem family

- `AllowedTargetRootPolicyRef` 指向经过 04/安全审查的 root policy，不等于 Project/Workspace/source选择；explicit target仍必须在 command中给出并 canonicalize。
- Inspection与apply adapter分离；Query只能获得 inspection面。Apply request必须带 lease、canonical bounded path set、precondition fingerprints与non-overwrite mode。
- Config不得关闭 symlink/root escape/permission/dirty/untracked guard，不得允许删除 `.qs-sync`、protected provenance或用户未提交修改。

## 12. Timeout、retry 与 failure mapping

当前详细设计不定义 `RetryPolicyConfig`。所有 wrappers一次调用一个 typed port；未来若上游合同允许特定 read retry，必须回流 Step 12～14，并证明 request equivalence、deadline、cancellation和observable result不变。

| Call category | timeout 后分类 | 自动 retry | 后续安全动作 |
|---|---|---|---|
| local read / inspection | `dependency_unavailable` 或 `unknown` | 否 | 返回 degraded/blocked；新的显式入口可重读。 |
| local UoW commit | `commit_status_unknown` | 否 | 原 identity/digest reload repository；不得重写。 |
| metadata lock acquire | `blocked/unavailable`，不持有 lease | 否 | release已知 lease或停下；重新显式执行。 |
| owner/source/Decision read | unavailable/unknown | 否 | fail-closed；不从 cache/Git推断。 |
| handoff submit | `outcome_unknown` | 严禁 | 原 attempt正式 probe/read或人工处理。 |
| recovery probe | `outcome_unknown` / `unsupported` | 严禁 | 保持 ProbeRequired/manual；不重放 submit。 |
| Git/fs apply | Partial/OutcomeUnknown按 adapter proof | 严禁 | checkpoint + re-observe/recovery；cursor不前进。 |
| diagnostics emit | safe unavailable | 否 | 不改变业务 result/state；不得伪造 emission。 |

## 13. TypeScript package 与跨仓依赖绑定

| 依赖仓 / facility | 类型 | 已核验路径 / 事实 | package / 协作方式 | 使用位置 | 不可用时 |
|---|---|---|---|---|---|
| `L0-sdk` | compile candidate + runtime seam | `/home/aris/Projects/quantalithos-sdk/packages/typescript`；package skeleton存在 | planned `@quantalithos/sdk`；local/version syntax受 `SYNC-LOCAL-002/005` 阻塞 | `src/adapters/sdk/*` | 需要真实类型/方法的实现等待；不复制SDK源码/私造DTO。 |
| `L0-core` | potential shared compile dependency | repo存在；未核验可消费TS package | none | none in current design | 不添加Rust/Cargo或猜npm package。 |
| `L1-identity` | runtime owner via SDK | 正式设计 owner | `OwnerAccessPort` adapter；no direct package/path | permission/principal | unknown/blocked fail closed。 |
| `L1-work` | runtime owner via SDK | Project/ProjectMember/posture owner | `OwnerAccessPort` adapter | project action/posture | `SYNC-UP-003` 阻断positive allow。 |
| `L1-artifact` | runtime source owner candidate | source authority未统一 | `MaterialSourcePort` adapter | clone/pull source | `SYNC-UP-002/008`；no source guess。 |
| `L1-workspace` | runtime source/projection owner candidate | source authority未统一 | `MaterialSourcePort` adapter | clone/pull source | 同上；不复制projection truth。 |
| `L1-governance` | runtime handoff/Decision owner | handoff/probe contract未闭合 | handoff/decision/probe SDK adapters | push-review/recovery/status refresh | `SYNC-UP-004/005`；ACK不升格。 |
| `L4-archive` | runtime posture/source ref owner | archived action matrix待核验 | owner access/source safe ref via SDK | archived project posture | mutation blocked on unknown。 |
| `L4-observability` | diagnostics collaboration | formal sink surface待核验 | `DiagnosticsPort` adapter | safe diagnostic emission | failure isolated；no evidence/report. |
| Git | local runtime facility | host/local tool；exact library/version pending | typed adapters only | observation/local apply | no arbitrary shell/remote ops；unsupported explicit。 |
| filesystem | local runtime facility | Node-compatible host API；exact implementation pending | typed inspection/apply adapters | target/path/stage/commit | unsafe/unknown blocked。 |

本仓是 TypeScript 单 package；Rust workspace、crate、Cargo path/private git dependency问题均 `N/A`。本表不创建 `package.json`、lockfile、install command或依赖版本事实。

## 14. Capability validation 与入口隔离

### 14.1 Validation 级别

| 级别 | 检查 | 失败结果 |
|---|---|---|
| raw config validation | 类型、required family、unknown field、正数/单位、ref shape、互斥关系 | 不构造 runtime；返回 redacted typed config issue。 |
| hard-boundary validation | 是否尝试允许 auto Git/overwrite/default selection/ACK elevation/provenance deletion/fake positive | reject whole config；不可降为 warning。 |
| static adapter binding | ref能否解析到允许 constructor；port surface与declared capability是否一致 | capability=`blocked/unsupported`；基础 metadata安全能力缺失则mutation graph不构造。 |
| runtime capability observation | tool/SDK/schema capability能否正式证明 | `bound/blocked/unsupported/unknown`；不是health/readiness。 |
| per-entry preflight | 当前 route所需capability是否均bound，并重验actor/selection/local state | effect前返回blocked/unsupported/unknown；不能默认allow。 |

### 14.2 Route capability matrix

| 入口族 | 必需 capability | 可选/degraded capability | 缺失姿态 |
|---|---|---|---|
| 10 Command共同local mutation | metadata read/atomic write、clock、ID、digest；涉及target时target lock | diagnostics | 基础缺失→blocked before UoW/effect。 |
| `clone` / `pull` | owner access、material source、Git observation、filesystem inspection、Git/fs local apply | diagnostics | 任一不安全/unknown→blocked/needs-action；no apply。 |
| metadata migrate/rebind | metadata safe schema/UoW/lock、filesystem inspection | Git observation按flow | `SYNC-UP-006/010` 未闭合→blocked。 |
| conflict resolution/cancel | metadata local capabilities | none | local-only分支可按合同执行；不触发effect。 |
| resume | checkpoint要求的exact local/probe/tool capabilities | diagnostics | 不按当前可用性换另一恢复路径。 |
| probe/refresh | recovery probe或Decision read + metadata atomic write | diagnostics | unsupported/unknown保留原 attempt。 |
| push-review | owner access、Git/fs read、metadata/UoW、handoff submit | Decision read/probe后续 | 缺一→no submit；ACK仅transport。 |
| 13 Query | metadata read；Inspect/Status可选Git/fs inspection | availability/diagnostics reads | 返回typed partial/unavailable；zero write。 |
| 3 Consumer | exact formal consumer capability + metadata/UoW/idempotency | diagnostics | 当前全部 blocked；不订阅private topic。 |
| 3 Job | matching job capability + metadata/UoW/idempotency；probe job另需probe | diagnostics | blocked/partial；不扩 scope/auto repair。 |

Capability snapshot与per-entry result必须区分：runtime可组装并不表示所有route可用；某route `bound`也不表示当前 actor、owner posture、source、working tree或state guard通过。

## 15. Runtime composition 顺序

```text
loadRuntimeConfig(sourceRef) -> unknown
  -> validateRuntimeConfig(unknown)
       -> ValidatedSyncRuntimeConfig | typed redacted issues
  -> reject every hard-boundary override
  -> resolve ClockPort / IdPort / DigestPort bindings
  -> resolve metadata read/store/UoW/lock/snapshot repositories
  -> validate atomic/version/append/replay/crash capability set
  -> resolve filesystem inspection/apply and allowed-root policy
  -> resolve Git observation/worktree adapters and static whitelist
  -> resolve SDK owner/source/handoff/decision/probe adapters
  -> resolve diagnostics adapter/redaction policy
  -> classify all exact SyncAdapterCapability bindings
  -> allocate one immutable AdapterCapabilitySnapshot for this composition
  -> build read-only query graph (no UoW/write/lock/probe/emit)
  -> build mutation facade with per-route capability preflight
  -> conditionally register blocked consumers / explicit job runners
  -> expose runtime facade plus body-free capability snapshot
```

Composition rules：

1. `src/config/load_runtime_config.ts` 只load；`validate_runtime_config.ts` 只decode/validate；`src/composition/capability_validation.ts` 解析binding并分类；`runtime_composition.ts` 构造dependency graph。四者不得执行业务command。
2. Query graph在TypeScript constructor层不持有UoW、write repository、metadata lock、handoff/probe或diagnostic emit capability；即时Inspect只持read-only Git/fs ports。
3. Mutation facade收到当前composition固定的in-memory `AdapterCapabilitySnapshot`；首次引用时与`SyncOperation`初始revision同UoW `ensure`，后续operation复用exact ref/content。它不能在每次调用时从raw config重建或为同一composition改写snapshot。
4. Adapter constructor只获得局部 config family，不能读取整个 config或从别的adapter ref推断fallback。
5. Consumer只有 formal schema/source/order/dedup capability为`bound`时才注册；当前三个均保持blocked。Job runner不生成request、actor、scope、jobRunRef或idempotency key。
6. 不提供production fake registry。Step 16 test composition可直接构造typed fakes，但snapshot必须明确test-double ceiling，不能输出integration evidence/readiness。
7. config reload/hot swap未在本步承诺。若04未来允许，必须构造新composition/snapshot，旧在途对象继续引用旧snapshot；不得原地改写。

## 16. 不可配置化边界

以下任一字段/开关即使出现在raw config也必须reject，而不是忽略或warning：

1. implicit principal/project/version/source/target/latest/default selection。
2. local allow、owner truth override、archive posture override或cache-as-authority。
3. status/query refresh、repair、probe或任何hidden write。
4. dirty/untracked/path/symlink/lock unknown时继续，或允许覆盖用户未提交修改。
5. auto merge/rebase/push/stash/fetch-as-truth、force apply、arbitrary shell。
6. 由config定义source authority、priority、cursor comparator、gap/full fallback或Git remote mapping。
7. partial/unknown时推进cursor/mapping，或以Git commit当Artifact/Baseline。
8. silent metadata rebind/migrate/repair、old generation/provenance delete/fabrication。
9. handoff/probe blind retry、timeout-as-not-happened、换key重放。
10. ACK/upload receipt/HTTP success/local result当Review accepted、Decision或readiness。
11. 将Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote纳入local ownership。
12. 允许credential/raw body/raw stdout/stderr/evidence/report content进入metadata/status/diagnostics。
13. 用feature flag、历史README、fake或cache把blocker变成supported/bound。
14. 启用LFS、shallow、GUI/Tauri作为当前positive capability。
15. 让retention/cleanup删除protected provenance、attempt/checkpoint、unknown或exact replay carrier。

## 17. 前序契约回填与审计

| 前序 Step | 发现 | 回填动作 / 结论 |
|---|---|---|
| Step 3 | package/runtime/tool exact choice仍pending | 保持 `SYNC-LOCAL-001~005`；未写manifest/version/command。 |
| Step 4 | config/composition/adapters路径足够 | 不新增实现路径；snapshot repository由metadata adapter family承接。 |
| Step 6 | operation/plan/candidate/attempt缺immutable runtime context ref | 回补 `runtimeBindingSnapshotRef` 字段与same-operation invariant；technical carrier不增加第30个domain object。 |
| Step 7 | capability/snapshot名称未闭口；无snapshot repository | 本步给exact schema并回补idempotent-exact `ensure` repository；`AdapterAvailabilityPort`返回当前composition snapshot。 |
| Step 8 | boundary/page/job limit来源后置 | 本步绑定typed limits；没有改变public DTO或偷偷clamp。 |
| Step 9 | prepare/call/finalize未记录runtime context | operation初始UoW exact-ensure snapshot；plan/candidate/attempt沿用其ref；其余调用顺序不变。 |
| Step 10 | lifecycle state无需新增 | config/capability是technical disposition，不建第18个状态机。 |
| Step 11 | logical store缺runtime snapshot记录 | 增加immutable exact-ensure logical store/repository，和首次引用它的operation初始transition同UoW；无物理schema承诺。 |
| Step 12 | unavailable/unsupported/unknown可承接 | config invalid在入口前；route缺capability沿既有typed errors，不新增global success。 |
| Step 13 | config不能改变lock/idempotency/reentry | snapshot ref不进入canonical request digest；它记录执行语境，不改变caller request equivalence。 |

Runtime snapshot ref不进入canonical request digest，因为相同caller request在runtime重建后仍是同一idempotency identity；duplicate必须回放首次stored result及其原snapshot语境，而不是与当前snapshot冲突或重执行。首次reservation/operation/snapshot必须原子关联。

## 18. Step 16 测试切口预告

| Test cut | 验证内容 | 当前状态 |
|---|---|---|
| `TC-SYNC-CONFIG-001` | raw unknown→typed config；invalid/unknown/conflicting field fail closed | 仅设计，未运行 |
| `TC-SYNC-CONFIG-002` | zero/negative/non-integer budget拒绝；无clamp/default infinity | 仅设计，未运行 |
| `TC-SYNC-CONFIG-003` | hard-boundary override逐项reject | 仅设计，未运行 |
| `TC-SYNC-CONFIG-004` | capability exact total mapping；missing/duplicate/unknown capability拒绝 | 仅设计，未运行 |
| `TC-SYNC-CONFIG-005` | bound≠authorized/healthy/ready；per-entry仍执行全部guards | 仅设计，未运行 |
| `TC-SYNC-CONFIG-006` | composition snapshot exact ensure；operation/plan/candidate/attempt引用同一snapshot；reload不改旧语境 | 仅设计，未运行 |
| `TC-SYNC-CONFIG-007` | metadata adapter缺atomic/version/append/replay任一能力时mutation graph不构造 | 仅设计，未运行 |
| `TC-SYNC-CONFIG-008` | Query graph拿不到write/UoW/lock/probe/emit ports | 仅设计，未运行 |
| `TC-SYNC-CONFIG-009` | effect timeout→unknown且zero implicit retry | 仅设计，未运行 |
| `TC-SYNC-CONFIG-010` | credential/raw body/output不进入snapshot/metadata/status/error | 仅设计，未运行 |
| `TC-SYNC-CONFIG-011` | consumer refs存在但formal schema capability缺失时仍blocked | 仅设计，未运行 |
| `TC-SYNC-CONFIG-012` | LFS/shallow/GUI/Tauri配置不能产生positive capability | 仅设计，未运行 |

## 19. 回填草稿

> 校准来源：
> - `projects/L5-sync/design-calibration/03_ddd_step_14_config_dependencies.md`
>
> 延伸阅读：本文件 §6 typed config/snapshot、§7～§10 binding tables、§14 capability isolation、§15 builder顺序、§16 hard boundaries。

### 正式 §13 摘录草稿

L5-sync 只有 `src/config/*` 读取raw config，只有 `src/composition/*` 将其收窄并绑定为metadata、SDK、Git、filesystem、diagnostics、Clock/ID/Digest adapters。Application只接收Step 7 ports与最小typed limits/budgets；Domain不读取环境或完整runtime config。所有数值无03隐式默认，raw key/source/precedence、物理backend/endpoint/secret/tool与数值由正式04承接。

`SyncAdapterCapability` 使用exact union，availability只允许`bound/blocked/unsupported/unknown`。`bound`仅表示静态接线满足，不表示健康、权限、source freshness或readiness。每个runtime composition创建一个body-free、immutable `AdapterCapabilitySnapshot`；mutation首次引用时exact ensure，`SyncOperation`、`MaterializationPlan`、`ReviewCandidate`、`HandoffAttempt`引用同一snapshot，配置变化不得改写历史语境。

`.qs-sync` 保持受控logical namespace。metadata adapter只有在typed stores、optimistic version、atomic UoW、append/protection、exact replay、target lock与commit ambiguity reload能力全部满足时才可标记write-bound。SDK正向surface、source authority、handoff/probe、物理metadata、Git/source mapping、cursor comparator、LFS/shallow/GUI和dirty/path exact semantics仍受`SYNC-UP-001~010`阻塞。

当前不提供generic retry config。local/external/tool effect timeout均不能证明未发生；commit reload、checkpoint/probe/manual继续沿Step 11～13语义。配置永远不能开启auto merge/rebase/push/stash、dirty overwrite、Review Gate绕过、ACK升格、provenance删除/伪造、owner truth本地化或fake-positive。

## 20. 待确认事项

| blocker | 影响本 Step 的 binding | 未确认前姿态 |
|---|---|---|
| `SYNC-UP-001` | SDK exact operation/schema/error/version | SDK positive adapters blocked；只保留typed ports/validator slots。 |
| `SYNC-UP-002/008` | Artifact/Workspace source authority、cursor/comparator/gap | material source positive binding blocked；no pull/cursor advance。 |
| `SYNC-UP-003` | permission/archive posture action matrix | owner access unknown/denied fail closed。 |
| `SYNC-UP-004/005` | handoff/Decision/probe/idempotency equivalence | submit/probe positive binding blocked；no retry/ACK elevation。 |
| `SYNC-UP-006` | `.qs-sync` physical schema/migration/retention/crash implementation | logical binding only；metadata adapter未证明则mutation blocked。 |
| `SYNC-UP-007/010` | Git/source mapping、dirty/path/non-overwrite/manual semantics | local observation/apply only；uncertainty blocks。 |
| `SYNC-UP-009` | LFS/shallow/GUI/Tauri support matrix | no positive config/capability；unsupported/blocked。 |
| `SYNC-LOCAL-001~005` | Node/package manager/name/parser/validator/test/Git library/SDK syntax | package/runtime/tool implementation remains planned/not_created。 |

## 21. 进入 Step 15 条件与停审记录

- [x] typed config family、读取位置、无隐式默认与04承接边界明确。
- [x] `.qs-sync`、SDK、Git、filesystem、diagnostics、UoW/repository/clock/ID/digest均回指Step 7 port与planned adapter文件。
- [x] `SyncAdapterCapability`、四态availability、immutable snapshot与repository可直接转成TypeScript contract。
- [x] runtime builder顺序、read/write graph隔离与per-entry capability matrix明确。
- [x] timeout/unknown/no-retry、hard boundary和historical LFS/shallow/GUI/Tauri姿态明确。
- [x] TypeScript package/runtime dependency与Rust/Cargo N/A已诚实区分。
- [x] 未锁定endpoint、产品、数值、raw格式、metadata physical schema、tool/library或package syntax。
- [x] 未实现代码、未运行测试、未生成artifact/report/evidence/verdict/signoff/readiness、未创建implementation ledger/skeleton、未提交commit。

结论：Step 14 `gate_status=pass_with_upstream_blockers`。允许按用户“完成全部03”的授权进入Step 15；所有positive integration与physical adapter仍受`SYNC-UP-001~010`、`SYNC-LOCAL-001~005`约束。
