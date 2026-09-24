# Step 6. 逐模块定义对象实现契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md`
> 回填位置：未来正式 `03-详细设计.md` §5 模块实现契约、§6 全局对象索引
> 文件性质：逻辑实现契约中间产物。由于 `RUN-DDD-001~003` 未关闭，本文不构成 package、crate、binary、源码路径或技术选型事实。

## 1. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| Step | 6 / 逐模块定义对象实现契约 |
| 输出文件 | `design-calibration/03_ddd_step_06_object_contracts.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取通用规范 | `设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`设计文档编写通则.md` |
| 已读取文档规范 | `详细设计讨论流程_SOP.md`、`详细设计书写规范.md` |
| 已读取前序输入 | L5 正式 `00/01/02`、Step 4、Step 5、02 对象/接口/流程/状态校准产物、L1-governance Step 6～10 结构参考 |
| 项目级门禁 | `blocked`：物理布局/技术 authority 仍未闭合；逻辑对象契约获用户授权继续 |
| 本 Step 逻辑门禁 | `completed_with_upstream_blockers`；对象组与闭环审计已完成，可进入 Step 7 逻辑契约 |
| 正式 03 写入 | `false`；Step 19 前不得修改正式旧 `03-详细设计.md` |
| 实现/测试/提交 | 不实现代码、不执行测试、不创建 implementation ledger/skeleton、不提交 commit |

本 Step 的“可落码”仅指对象责任、字段、状态、factory、成员函数和边界已经足够被后续技术绑定；不表示外部 owner 合同、SDK surface、真实存储或运行仓已存在。

## 2. 本步目标、输入与输出

### 2.1 目标

沿用 L1-governance 的递进链路：

```text
模块 capability
  → 功能输入/输出/副作用
  → 对象类别与唯一归属
  → 对象能力
  → 字段/来源/不变量
  → factory / 成员函数
  → 状态 enum 与允许迁移
```

本 Step 必须证明：

1. 六个业务组成部分在七个逻辑模块中有对象承接，不能把业务部分直接当物理包。
2. 17 个概要设计对象各有唯一主要 owner，projection/ref/body-free 边界不混淆。
3. 每个字段都有 request、metadata、system-generated、repository、formal port、snapshot 或明确派生来源；无法闭合的来源标为 `blocked/pending`，不由本地猜测。
4. 关键状态与 Step 9 的状态集合保持同名；每个状态有产生函数、合法去向和禁止迁移。
5. Step 7 port、Step 8 protocol、Step 9 flow、Step 10 state matrix 都能回指本 Step 对象能力。

### 2.2 输入

| 输入 | 使用方式 |
|---|---|
| Step 5 `03_ddd_step_05_module_contracts_axis.md` | 固定 `contracts/domain/application/infra/entry/worker/operations` 七轴、依赖方向和对象归属边界 |
| 正式 `02-概要设计.md` §4～§12 | 固定六部分、17 对象、11 Command、12 Query、4 planned Consumer、5 Job、14 required port 与状态轮廓 |
| 正式 `00/01` | 固定 ownership、fail-closed、SDK-first、多轴状态和 no-write 红线 |
| L5 `02_hld_step_06_key_objects.md`、`02_hld_step_07_api_interface_skeleton.md`、`02_hld_step_08_processing_flows.md`、`02_hld_step_09_state_machine.md` | 作为对象、接口、函数流和状态的直接真相源 |
| `RUN-UP-001~008`、`RUN-DDD-001~003` | 限定 exact owner DTO/算法/路径/技术选择只能保持 blocked 或 pending |

### 2.3 固定输出

- Step 6 写入批次状态表与模块执行顺序表。
- shared vocabulary、typed ref、public marker、基础 state carrier 的语义收敛表。
- 七个逻辑模块的 capability / 功能清单和功能到对象映射。
- 17 个对象的独立契约卡：类型、字段、来源、状态、factory、成员函数、不变量、禁止事项。
- application/infra/entry/worker/operations 非 core 对象的闭口/defer 决策。
- 字段来源闭环、状态闭环、Step 7 承接清单、Step 8/9/10 反查。
- 回填草稿、待确认事项、正反例和 Step 6 停审记录。

## 3. 批次计划与模块执行顺序

单次写入控制在可审查批次；批次大小不限制本文件最终长度，也不允许省略对象字段或状态。

### 3.1 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 内容完整性 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| 6.0 | 本文件骨架、输入、门禁、模块顺序 | completed | complete | skeleton reviewed | 6.1 |
| 6.1 | shared typed refs、marker、基础状态 carrier | completed | complete | module reviewed | 6.2 |
| 6.2 | `domain`：context/selection/material 对象 | completed | complete | module reviewed | 6.3 |
| 6.3 | `domain`：lifecycle/resource/recovery 对象 | completed | complete | module reviewed | 6.4 |
| 6.4 | `domain`：preview/diagnosis/handoff/read-model 对象 | completed | complete | module reviewed | 6.5 |
| 6.5 | `application` 对象与服务边界 | completed | complete | module reviewed | 6.6 |
| 6.6 | `infra` / `entry` / `worker` / `operations` 对象 | completed | complete | module reviewed | 6.7 |
| 6.7 | 字段/状态/跨模块闭环审计、回填、停审 | completed | complete | step reviewed with blockers retained | Step 7 |

### 3.2 模块执行顺序表

| 顺序 | 模块 | 本 Step 处理内容 | 输入来源 | 完成后停审点 |
|---:|---|---|---|---|
| 1 | `contracts` | 共享 id/ref、binding、reason、marker、public state carrier | 02 §6～§10、Step 5 | shared type 不引用 domain-only body |
| 2 | `domain` | 17 对象及其 local truth、projection、guard、transition | 02 §5～§9 | 每对象 capability→字段/函数/状态闭合 |
| 3 | `application` | service facade、operation context、idempotency、stored result 等稳定 carrier | 02 §7～§12、Step 5 | 稳定 carrier 必须本步闭口，具体 port 留 Step 7 |
| 4 | `infra` | runtime/config/adapter availability、repository/cache state holder | Step 4/5、14 required ports | 不写具体产品、方法、路径或版本 |
| 5 | `entry` | command/query entry、read-model composition、handler disposition | 11 Command/12 Query | 入口不直连 store/adapter |
| 6 | `worker` | planned consumer、dedup/gap disposition、loop state | 4 planned Consumers | 合同未闭合则 blocked，不解析 payload |
| 7 | `operations` | 五个 Job entry、claim/checkpoint/report state | 5 Jobs | job report 非 approval/running/evidence |

## 4. Shared vocabulary / typed ref / public marker 先行收敛

这些类型会跨 `contracts`、`domain`、`application`、entry、worker 和 operations 使用，先定义语义边界；具体序列化、协议 envelope、数据库 key 和 owner DTO 在 Step 7/8/11 继续闭合。

### 4.1 类型载体规则

| 类型族 | 语义形态 | 来源 | 约束 |
|---|---|---|---|
| local id | opaque newtype | application id generator / repository rehydrate | 非空、不可由外部正文或字符串拼接推导 |
| external ref | body-free typed ref | 正式 owner SDK/API/事件或 resolver | 只引用，不携带 Release、policy、runtime、log 或 evidence body |
| binding | immutable tuple/value object | explicit command + formal source/verification result | release/version/scope/generation/digest 不能静默缺失或替换 |
| reason | non-empty typed reason | command metadata、formal result、clock/connectivity 或 domain transition | 不用通用字符串猜测状态，不承载秘密/正文 |
| freshness/visibility | source posture | formal snapshot/port result + local observation | unknown/stale/restricted 必须可表达，不能默认 current/visible |
| receipt | body-free acknowledgement/result ref | formal owner port | receipt 只证明接收/交接，不证明 running、cleanup 或 evidence |

### 4.2 共享 ref / binding / marker 目录（逻辑归属）

```rust
/// Runner-owned opaque identifier; its internal representation is not a business key.
pub struct RunnerSelectionId(pub String);

/// Identifies one explicit local selection generation.
pub struct SelectionGenerationNumber(pub u64);

/// References a formally owned Release without copying its body.
pub struct ReleaseRef(pub String);

/// References an immutable Artifact version without accepting an implicit version.
pub struct ArtifactVersionRef(pub String);

/// References a formal authority/baseline result without owning approval truth.
pub struct AuthoritySnapshotRef(pub String);

/// Binds an exact release, version, scope and selection generation.
pub struct SelectionBinding {
    pub release_ref: ReleaseRef,
    pub version_ref: ArtifactVersionRef,
    pub scope_ref: RunnerScopeRef,
    pub generation: SelectionGeneration,
}

/// Binds a local material to the exact source and integrity basis used to qualify it.
pub struct MaterialSourceBinding {
    pub selection: SelectionBinding,
    pub digest_ref: Option<SourceDigestRef>,
}

/// Identifies a Runner local material cache entry without exposing a host path.
pub struct CacheEntryRef(pub String);

/// Identifies a Runner local run intent.
pub struct RunIntentId(pub String);

/// Identifies a Runner local recovery case.
pub struct RecoveryCaseId(pub String);

/// Identifies a redacted diagnostic handoff posture.
pub struct DiagnosticHandoffId(pub String);

/// Identifies one local material acquisition task.
pub struct AcquisitionTaskId(pub String);

/// Identifies one local cache entry.
pub struct CacheEntryId(pub String);

/// Identifies one local integrity posture.
pub struct IntegrityPostureId(pub String);

/// Identifies one local control intent.
pub struct ControlIntentId(pub String);

/// Identifies one bounded local resource observation.
pub struct ResourceObservationId(pub String);

/// Identifies one local protection guard.
pub struct ProtectionGuardId(pub String);

/// Identifies one local output preview.
pub struct OutputPreviewId(pub String);

/// Identifies one local failure diagnosis.
pub struct FailureDiagnosisId(pub String);

/// References a safe external locator resolution without carrying a secret URL.
pub struct ExternalLocatorRef(pub String);
```

`RunnerScopeRef`、`SourceDigestRef`、`Timestamp`、`SourceFreshness`、`VisibilityPosture` 等支撑 carrier 的 exact serialization 在当前上游未完全闭合；本 Step 只规定其语义来源和禁止替代，不伪造 owner schema。若这些 carrier 进入 public protocol，Step 8 必须补齐完整 schema。`ExternalLocatorRef` 只能来自 `MaterialSourcePort` 的 safe resolution；它不是 URL、path、credential 或下载成功证明。

#### 4.2.1 复合 carrier 与 semantic result 目录

以下名称会出现在对象字段或函数签名中，但不都是独立 domain entity。它们必须先有明确语义来源，Step 7/8 再把其中需要跨 port/protocol 的类型展开成完整契约；实现者不得以裸字符串、generic map 或 owner 私有 DTO 临时替代。

| carrier 族 | 最小语义 / 必含内容 | 唯一来源 | 后续闭合点 |
|---|---|---|---|
| `QualifiedMaterialBinding` | `CacheEntryRef`、`IntegrityPostureRef`、`MaterialSourceBinding`、current authority posture | `MaterialCacheEntry` + `IntegrityPosture` + formal authority read | Step 7 qualification/read ports；Step 8 DTO |
| `RunnerCommandMetadata` / `RunnerQueryMetadata` | operation identity、trace/correlation、issued-at；write 另含 idempotency/expected basis | trusted entry envelope | Step 8 protocol；不得从 UI label/route 生成 |
| `ActorContext` / `TraceRef` / `JobRunRef` | body-free actor scope、trace、local job-run identity | trusted boundary / application id generator | Step 7 base ports；Step 8 metadata |
| `OwnerStateBasis` / `OwnerCleanupBasis` / `RecoveryExpectedBasis` | request/run/lease/source/generation/digest 的 expected refs/version markers | formal owner safe read + persisted local expectation | Step 7 owner read ports；Step 8/9 flow |
| `OwnerRunSnapshot` / `OwnerRunReceipt` / `OwnerRecoverySnapshot` | owner-attributed refs、独立 posture 轴、source version、freshness、visibility | Sandbox/Runtime formal safe surface | Step 7 adapter result；Step 8 schema |
| `ProtectionInputs` / `ProtectionResolution` | lease/capture/handoff/retention/orphan 五轴及完整 freshness/basis | formal safe owner reads + local handoff posture | Step 7 protection reads；Step 9 cleanup/reconcile |
| `ResourceProbeResult` / `OwnerAllocationSnapshot` / `ConnectivityObservation` | bounded local observation与独立 owner allocation view | platform port / Sandbox owner read | Step 7 ports；Step 8 safe result |
| `SafeOutputMaterial` / `RedactionResult` / `FailureSignals` | bounded source refs、redaction marker、visibility/freshness、safe failure refs | diagnostic/read/redaction ports | Step 7/8；禁止 raw body fallback |
| `RunnerReadSources` / section types / `SourceAttributionSet` | 六个 section 的 safe snapshot、per-section source/freshness/visibility | query repositories/resolvers | Step 7 read ports；Step 8 query/view schema |
| `RunnerJobReport` / `JobReportDisposition` | local refs、bounded counters、partial/blocked/unknown posture | `RunnerJobReportAssembly` | Step 8 report DTO；Step 9 job flow |
| `CapabilityDisposition` / `AdapterCapabilityMarker` | supported/unsupported/unknown/blocked capability，不代表 owner success | validated config/provider capability negotiation | Step 7 availability port；Step 8 readiness surface |
| `LocalExpectedVersion` / `LocalCursorRef` / `RecoveryCursor` | Runner local optimistic/version/checkpoint marker | local repository | Step 7 store port；Step 11 persistence |

所有以 `*Reason`、`*IssueRef`、`*RefSet`、`*Posture`、`*Result`、`*Snapshot` 命名且尚未展开的 carrier，均受同一规则约束：typed、body-free、来源可追溯、unknown/blocked 可表达。它们是后续 Step 的显式待闭合输入，不是允许实现自由发明的空白。

### 4.3 共享状态与原因 carrier 的边界

| Carrier | 允许出现的位置 | 不允许做什么 | Step 10 反查 |
|---|---|---|---|
| `SelectionState` | `ReleaseSelection`、selection result/view | 不表达 material/run 状态 | selection matrix |
| `AcquisitionState` | `AcquisitionTask`、acquisition result | 不表达 integrity/qualification | acquisition matrix |
| `IntegrityState` | `IntegrityPosture` | 不表达 approval/running | integrity matrix |
| `MaterialCacheState` | `MaterialCacheEntry` | 不承载 protection guard 状态 | cache matrix |
| `RunIntentState` | `RunIntent` | 不迁移为 owner execution | intent matrix |
| `ControlIntentState` | `ControlIntent` | stop/cancel 不等 cleanup | control matrix |
| `ProtectionState` | `ProtectionGuard` | releasable 不等 released/evicted | protection matrix |
| `RecoveryState` | `RecoveryCase` | closed 不等 owner success | recovery matrix |
| `HandoffState` | `HandoffPosture` | delivered 不等 evidence/signoff | handoff matrix |
| `ConnectivityState` | `ConnectivityView` | online 不清除业务 stale/unknown | connectivity matrix |

## 5. 七模块 capability 与功能到对象映射

### 5.1 `contracts` capability

| 功能 / capability | 输入 | 输出 | 状态/副作用 | 对象承接 | 后续承接 |
|---|---|---|---|---|---|
| 传递 explicit selection 与 binding | command/query/job 输入 | typed refs、binding、source posture | 无 truth 写入 | `SelectionBinding`、`SelectionState` | Step 8 DTO |
| 表达跨边界失败与未知 | port/result/metadata | typed reason、unknown/stale/blocked marker | 禁止隐式成功 | `UnknownReason`、`VisibilityPosture` | Step 7 error/Step 8 error |
| 表达安全 view 身份 | projection/query | body-free view refs、source/freshness | no-write | view identity carrier | Step 8 query schema |

### 5.2 `domain` capability

| 功能 / capability | 输入 | 输出 | 状态/副作用 | 对象承接 | 后续承接 |
|---|---|---|---|---|---|
| context 与显式选择 | resolver safe result、user exact ref | current/stale/blocked selection | generation/invalidation | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection` | Step 7 resolver、Step 9 select |
| 取得、验证、资格 | task、material handle、manifest/result | quarantine/verified/qualified | local material state | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` | Step 7 verifier/cache、Step 9 acquire |
| 请求与控制 | qualified binding、owner basis | local intent、owner projection | accepted/unknown/conflict | `RunIntent`、`ControlIntent`、`OwnerRunProjection` | Step 7 Sandbox/Runtime、Step 9 run/control |
| 资源、保护、恢复 | local probe、lease/cleanup refs、recovery read | guard/reconcile posture | freeze/manual review | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | Step 7 platform/Sandbox、Step 9 cleanup/reconcile |
| 预览、诊断、交接 | safe output/failure/handoff result | bounded/redacted views | handoff intent/receipt | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | Step 7 redaction/handoff、Step 9 diagnosis |
| 多入口安全组合 | safe sections、connectivity observation | read model | pure derivation | `RunnerReadModel`、`ConnectivityView` | Step 8 Query、Step 9 read model |

### 5.3 非 core 模块 Step 6 闭口决策

| 模块 | 当前 Step 6 是否闭口 | 本步闭口对象组 | defer 理由 | 后续承接 |
|---|---|---|---|---|
| `application` | 部分闭口 | operation context、idempotency identity、stored-result identity、service facade responsibility | exact port signatures、UoW、error mapping 依赖 Step 7 | Step 7/8/9 |
| `infra` | 部分闭口 | adapter availability、runtime composition posture、repository/cache capability state | 语言、store、SDK client、transport 未定 | Step 7、Step 11、Step 14 |
| `entry` | 闭口稳定 carrier | command/query entry responsibility、read-model composer input、handler disposition boundary | exact DTO/transport/HTTP/GUI binding 未定 | Step 8/9 |
| `worker` | 闭口边界与 disposition | planned consumer entry、dedup/gap disposition、loop posture | owner event envelope/cursor 未闭合 | Step 7/8/9 |
| `operations` | 闭口稳定 carrier | job entry、claim/checkpoint/report posture | scheduler/process/store 技术未定 | Step 7/8/9/11/13 |

不能把所有非 core 对象机械 defer：visibility、idempotency、stored result、availability、entry disposition、job report 是后续协议和 flow 的唯一稳定 carrier，本 Step 必须先固定其语义边界。

## 6. 对象卡片统一约定

后续每个对象小节均包含：

1. capability 来源与对象责任；
2. `rust` 形态示意（只表达逻辑字段，不代表语言已选）；
3. 字段表（类型、作用、约束/来源）；
4. 状态集合及来源/去向；
5. 成员函数和 factory（完整参数/返回/副作用）；
6. 不变量、禁止事项与 typed-ref/body-free 边界；
7. Step 7/8/9/10 反查点。

函数中的 `Result<T, RunnerContractError>` 是语义占位，具体 error enum、序列化和 adapter mapping 留 Step 7/8/12；不得由实现者用错误字符串自行分支。

## 7. `contracts` 共享类型与 public marker 契约

本节先闭合所有会穿过 command、query、consumer、job、view 和 adapter 的 body-free 类型。它们是跨模块词汇，不是 Runner truth。任何类型若需要保存 Release、Governance、Sandbox、Runtime、Observability、Archive 或 Project 正文，必须被拒绝或改为 typed ref/summary。

### 7.1 基础 opaque id / ref

```rust
/// Identifies one local Runner context record.
pub struct RunnerContextId(pub String);

/// References an actor supplied by a formal context source.
pub struct ActorRef(pub String);

/// References a session supplied by a formal context source.
pub struct SessionRef(pub String);

/// References a project without copying project truth.
pub struct ProjectRef(pub String);

/// References the scope in which a Runner action is evaluated.
pub struct RunnerScopeRef(pub String);

/// References the platform context used for compatibility and presentation.
pub struct PlatformContextRef(pub String);

/// References a local material handle without exposing a host path.
pub struct LocalMaterialHandle(pub String);

/// References a manifest supplied by the Artifact authority.
pub struct ManifestRef(pub String);

/// References a content digest without selecting an algorithm locally.
pub struct SourceDigestRef(pub String);

/// References a formal Sandbox request.
pub struct SandboxRequestRef(pub String);

/// References a Sandbox boundary.
pub struct SandboxBoundaryRef(pub String);

/// References a Runtime-owned run.
pub struct RuntimeRunRef(pub String);

/// References an owner control result.
pub struct ControlResultRef(pub String);

/// References an owner lease or allocation posture.
pub struct OwnerLeaseRef(pub String);

/// References an owner cleanup request or result.
pub struct CleanupRef(pub String);

/// References a safe diagnostic source.
pub struct DiagnosticSourceRef(pub String);

/// References a formal handoff receipt.
pub struct HandoffReceiptRef(pub String);

/// References a recovery resolution snapshot.
pub struct OwnerResolutionRef(pub String);

/// Formal owner subject identity carried without an owner body.
pub struct OwnerSubjectRef(pub String);

/// Formal owner source-version identity; it is not a Runner repository version.
pub struct OwnerSourceVersionRef(pub String);

/// References a local output preview.
pub struct OutputPreviewRef(pub String);

/// References a local failure diagnosis.
pub struct FailureDiagnosisRef(pub String);

/// References a local protection guard.
pub struct ProtectionGuardRef(pub String);

/// References a local control intent.
pub struct ControlIntentRef(pub String);

/// References a local acquisition task.
pub struct AcquisitionTaskRef(pub String);

/// References a local integrity posture.
pub struct IntegrityPostureRef(pub String);
```

| 类型族 | 生成/重建来源 | 必须满足 | 禁止替代 |
|---|---|---|---|
| `*Id` | application id generator；repository load 可重建 | opaque、非空、稳定 | 不得由 title、path、digest、时间戳或外部正文拼接 |
| `*Ref` | formal port/adapter result 或本地已持久化对象 | body-free、带 owner/subject 语义 | 不得用裸 `String`、PID、端口、HTTP status 或 UI key 替代 |
| `LocalMaterialHandle` | cache provider / quarantine result | 只表示本地材料句柄 | 不得泄露绝对路径、secret URL 或 cache bytes |
| `SourceDigestRef` | Artifact manifest / verifier result | 只表示来源摘要 | 不得由本地文件名或大小代替 digest |

#### 7.1.1 Runner-local `Id` / public `Ref` canonical mapping

Step 9 反查发现，repository 以本地 `*Id` 定位，而 public protocol 对同一已持久化对象使用 body-free `*Ref`。两者必须由 contracts-owned nominal conversion 明确连接，不能在 handler、repository 或 presenter 中复制内部字符串：

```rust
impl AcquisitionTaskRef {
    pub fn from_persisted_id(id: &AcquisitionTaskId) -> Self;
    pub fn to_persisted_id(&self) -> Result<AcquisitionTaskId, RunnerContractError>;
}

impl CacheEntryRef {
    pub fn from_persisted_id(id: &CacheEntryId) -> Self;
    pub fn to_persisted_id(&self) -> Result<CacheEntryId, RunnerContractError>;
}

impl IntegrityPostureRef {
    pub fn from_persisted_id(id: &IntegrityPostureId) -> Self;
    pub fn to_persisted_id(&self) -> Result<IntegrityPostureId, RunnerContractError>;
}

impl ControlIntentRef {
    pub fn from_persisted_id(id: &ControlIntentId) -> Self;
    pub fn to_persisted_id(&self) -> Result<ControlIntentId, RunnerContractError>;
}

impl ProtectionGuardRef {
    pub fn from_persisted_id(id: &ProtectionGuardId) -> Self;
    pub fn to_persisted_id(&self) -> Result<ProtectionGuardId, RunnerContractError>;
}

impl OutputPreviewRef {
    pub fn from_persisted_id(id: &OutputPreviewId) -> Self;
    pub fn to_persisted_id(&self) -> Result<OutputPreviewId, RunnerContractError>;
}

impl FailureDiagnosisRef {
    pub fn from_persisted_id(id: &FailureDiagnosisId) -> Self;
    pub fn to_persisted_id(&self) -> Result<FailureDiagnosisId, RunnerContractError>;
}
```

这些转换只改变 nominal view，不生成新身份、不做字符串 prefix 解析、不查询 store，也不把外部 ref 转成本地 id。`to_persisted_id` 只接受已经由对应 public DTO decoder 验证为该 nominal ref 的值；visibility/scope 检查仍在 application flow 中先完成。`RunnerSelectionId`、`RunnerContextId`、`RunIntentId`、`RecoveryCaseId`、`DiagnosticHandoffId` 已直接作为 public local identity 使用，不再增加第二个别名。

#### 7.1.2 Owner basis 与 recovery secondary carrier

```rust
/// Exact formal owner basis used only for comparison and safe requests.
pub struct OwnerStateBasis {
    pub subject_ref: OwnerSubjectRef,
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    pub boundary_ref: Option<SandboxBoundaryRef>,
    pub runtime_run_ref: Option<RuntimeRunRef>,
    pub lease_ref: Option<OwnerLeaseRef>,
    pub source_version_ref: Option<OwnerSourceVersionRef>,
}

/// Cleanup comparison basis; it does not prove cleanup or local release.
pub struct OwnerCleanupBasis {
    pub owner_state_basis: OwnerStateBasis,
    pub cleanup_ref: Option<CleanupRef>,
    pub protection_guard_ref: ProtectionGuardRef,
}

/// Finite Runner-local subjects that may be frozen by one recovery case.
pub enum RecoverySubjectRef {
    Context(RunnerContextId),
    Selection(RunnerSelectionId),
    AcquisitionTask(AcquisitionTaskRef),
    CacheEntry(CacheEntryRef),
    IntegrityPosture(IntegrityPostureRef),
    RunIntent(RunIntentId),
    ControlIntent(ControlIntentRef),
    ProtectionGuard(ProtectionGuardRef),
    LocalMaterial(LocalMaterialHandle),
    OutputPreview(OutputPreviewRef),
    FailureDiagnosis(FailureDiagnosisRef),
    Handoff(DiagnosticHandoffId),
}

/// Ordered-unique, bounded set; it never carries raw owner or diagnostic bodies.
pub struct RecoverySubjectRefSet(pub Vec<RecoverySubjectRef>);

/// Immutable expected basis captured when dangerous effects are frozen.
pub struct RecoveryExpectedBasis {
    pub selection_generation: Option<SelectionGenerationNumber>,
    pub authority_ref: Option<AuthoritySnapshotRef>,
    pub owner_basis: Option<OwnerStateBasis>,
    pub source_digest_ref: Option<SourceDigestRef>,
}

/// Ordered-unique formal read-only resolution references.
pub struct OwnerResolutionRefSet(pub Vec<OwnerResolutionRef>);

/// Typed reason why a recovery case cannot prove convergence.
pub enum ReconcileFailure {
    ExpectedBasisIncomplete,
    OwnerBasisConflict,
    SourceGap,
    SourceStale,
    VisibilityRestricted,
    DependencyUnavailable,
    UnsupportedContract,
    LocalStateConflict,
    AmbiguousPriorEffect,
}
```

| carrier | 来源 | 不变量 / public映射 |
|---|---|---|
| `OwnerStateBasis` | formal Sandbox/Runtime safe read | optional ref表示owner轴正式未建立或未提供；不得用PID/端口/ACK补齐；所有存在字段逐字段比较 |
| `OwnerCleanupBasis` | current owner basis + exact persisted guard ref | 只授权cleanup尝试；不证明Confirmed/Released/Evicted |
| `RecoverySubjectRefSet` | 创建freeze的application flow | 至少一个、bounded、ordered unique；只允许上列local typed ref；不得含owner body、path、raw log或generic string |
| `RecoveryExpectedBasis` | effect前持久化的selection/authority/owner/digest basis | 声明为相关的轴必须Some；unknown不得用默认ref填充；public `RunnerExpectedBasisMarker`逐字段一一复制 |
| `OwnerResolutionRefSet` | formal read-only reconcile result | bounded、ordered unique；receipt不自动成为resolution/evidence；不携带snapshot body |
| `ReconcileFailure` | typed comparison/readiness/visibility结果 | 不保存raw exception；映射为redacted public issue ref，而非自由文本 |

### 7.2 时间、freshness、visibility 与 source marker

```rust
/// An instant supplied by a trusted clock or formal source metadata.
pub struct Timestamp(pub String);

/// Describes whether a source observation is current enough for its declared use.
pub enum SourceFreshness {
    /// The source reports a current observation for the requested basis.
    Current,
    /// The source observation is older than the permitted freshness boundary.
    Stale,
    /// The source cannot establish freshness.
    Unknown,
    /// The source explicitly reports that no observation is available.
    Unavailable,
}

/// Describes whether a safe result may be shown to the requesting actor.
pub enum VisibilityPosture {
    /// The safe summary may be shown within the resolved scope.
    Visible,
    /// Some fields or sections were removed by the formal visibility rule.
    Restricted,
    /// The source is known but only a partial safe summary is allowed.
    Partial,
    /// Visibility could not be resolved; the body must not be shown.
    Unknown,
    /// The source is not available to this actor or context.
    Unavailable,
}

/// Identifies the owner/source family that produced a safe observation.
pub enum SourceOwner {
    /// Artifact or Release authority source.
    Artifact,
    /// Governance approval or baseline source.
    Governance,
    /// Work or project context source.
    Work,
    /// Workspace membership/context source.
    Workspace,
    /// Runtime execution source.
    Runtime,
    /// Sandbox boundary/lease/cleanup source.
    Sandbox,
    /// Observability diagnostic or handoff source.
    Observability,
    /// Archive reference source.
    Archive,
    /// Local platform observation source.
    Platform,
    /// Runner local source.
    Runner,
}

/// Carries source attribution without copying source payload.
pub struct SourceAttribution {
    /// Owner/source family.
    pub owner: SourceOwner,
    /// Opaque source reference or snapshot identity.
    pub source_ref: String,
    /// Source-side version marker when available.
    pub source_version: Option<String>,
    /// Freshness of the observation.
    pub freshness: SourceFreshness,
    /// Visibility posture applied to the observation.
    pub visibility: VisibilityPosture,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `Timestamp` | trusted clock port、owner metadata 或 persisted local timestamp | 不可由 query/render 临时伪造为 source time；local observed time 与 source captured time 分开 |
| `SourceFreshness` | formal source result、reference resolver、local observation | `Unknown/Stale/Unavailable` 冻结危险副作用；不能自动降级为 `Current` |
| `VisibilityPosture` | context/visibility resolver 或 redaction result | `Unknown/Unavailable` 不得返回 raw/body；不能由 actor role 字符串自行推导 |
| `SourceAttribution` | adapter safe result、projection assembler | `source_ref` 必须可回指正式来源；不保存 source payload |

### 7.3 Selection / binding 状态与原因

```rust
/// Describes why the explicit selection generation changed.
pub enum SelectionChangeCause {
    /// The first explicit selection in a local context.
    Initial,
    /// The user explicitly selected a different immutable Release/version.
    UserChange,
    /// The formal source was revoked, expired, or otherwise invalidated.
    SourceInvalidation,
    /// The trusted context or scope changed.
    ContextChange,
}

/// Selection lifecycle owned by Runner.
pub enum SelectionState {
    /// Exact immutable refs were accepted syntactically but authority is not checked.
    Selected,
    /// Formal authority is being resolved or compared.
    Checking,
    /// Authority is current and all selection bindings match.
    Current,
    /// A previously usable basis is no longer fresh.
    Stale,
    /// The generation or source was explicitly invalidated.
    Invalidated,
    /// The selection cannot be qualified under the available contract.
    Blocked,
}

/// Explains why an explicit selection cannot continue.
pub enum SelectionInvalidation {
    /// The formal authority was revoked or expired.
    AuthorityRevokedOrExpired,
    /// The selected scope no longer matches the formal source.
    ScopeMismatch,
    /// The local generation was superseded by a newer selection.
    SupersededGeneration,
    /// The trusted context changed or became unusable.
    ContextChanged,
    /// The source contract or visibility surface became unavailable.
    SourceUnavailable,
}

/// Explains a binding mismatch detected before a side effect.
pub enum BindingMismatch {
    /// Release or immutable version differs from the selected binding.
    ReleaseOrVersionMismatch,
    /// Scope differs from the selected binding.
    ScopeMismatch,
    /// Selection generation is no longer current.
    GenerationMismatch,
    /// Digest or integrity posture differs from the qualified material.
    DigestMismatch,
    /// Authority basis is no longer current.
    AuthorityBasisMismatch,
}
```

| 状态/原因 | 允许来源 | 允许去向/处理 | 禁止事项 |
|---|---|---|---|
| `SelectionState::Selected` | `ReleaseSelection::select` | `Checking` | 不直接进入 acquisition/run |
| `Checking` | authority read flow | `Current`、`Stale`、`Blocked` | 不把 cache hit 当 current |
| `Current` | formal authority + binding match | 新一轮 `Checking` 或 `Invalidated` | 不代表 material qualified |
| `Stale` | freshness/authority drift | 仅新 basis `Checking` | 不复用旧资格 |
| `Invalidated` | revoke/expire/context/generation change | terminal；创建新 selection | 不原地回 current |
| `Blocked` | missing/unknown/conflict contract | 新 basis 后 `Checking` | 不启动副作用 |

### 7.4 Material、qualification 与 protection carrier

```rust
/// Identifies the current local transfer attempt progress.
pub struct TransferProgress {
    /// Bounded completed amount when a source provides one.
    pub completed: Option<u64>,
    /// Bounded total amount when a source provides one.
    pub total: Option<u64>,
    /// Source or local unit label.
    pub unit: Option<String>,
    /// Timestamp of the observation.
    pub observed_at: Timestamp,
}

/// Local acquisition lifecycle; it never proves integrity or qualification.
pub enum AcquisitionState {
    /// No transfer attempt exists.
    Absent,
    /// A formal locator or transport constraint is being resolved.
    Resolving,
    /// Bytes are being transferred into quarantine.
    Transferring,
    /// Transfer is paused without claiming success.
    Paused,
    /// Transfer ended and a quarantine handle exists.
    Complete,
    /// Transfer failed with a redacted failure posture.
    Failed,
    /// The local transfer task was cancelled.
    Cancelled,
}

/// Integrity verification lifecycle for one immutable source binding.
pub enum IntegrityState {
    /// Verification has not started or required input is pending.
    Pending,
    /// Verification is in progress.
    Verifying,
    /// Required checks passed for the current basis.
    Verified,
    /// A required check failed or the source does not match.
    Invalid,
    /// A formerly verified basis is no longer current.
    Stale,
    /// The result cannot be proved under the available contract.
    Blocked,
}

/// Finite cause-to-state mapping used when an existing integrity posture is
/// invalidated without rewriting its recorded check results.
pub enum IntegrityInvalidation {
    /// The immutable source or authority basis is no longer current.
    SourceOrAuthorityStale,
    /// A formal check or immutable binding is known to mismatch.
    VerificationFailedOrMismatched,
    /// The required contract, policy, visibility, or verifier is unavailable.
    ContractUnavailableOrUnsupported,
}

/// Local material lifecycle after transfer and verification.
pub enum MaterialCacheState {
    /// Material is isolated and not qualified.
    Quarantined,
    /// Material is bound to a current verified basis and may enter the run gate.
    Qualified,
    /// Source/generation/authority drift invalidated reuse.
    Stale,
    /// Material failed an integrity or compatibility requirement.
    Invalid,
    /// Local material was safely released and is no longer available.
    Evicted,
}

/// Whether local material is merely an eviction candidate or actually protected.
pub enum EvictionCandidatePosture {
    /// Candidate observation; no deletion permission is implied.
    Candidate,
    /// Current observations exclude this material from candidate evaluation.
    NotCandidate,
    /// Candidate status cannot be safely determined.
    Unknown,
}

/// Conservative protection result for a material or run subject.
pub enum ProtectionState {
    /// At least one protection input is active.
    Protected,
    /// All required protection inputs are current and explicitly releasable.
    Releasable,
    /// A formal owner or policy explicitly blocks release.
    Blocked,
    /// A required protection input is missing, stale, or conflicting.
    Unknown,
}
```

| 分轴 | 正式主语 | 成功语义 | 禁止跨轴推导 |
|---|---|---|---|
| transfer | `AcquisitionTask` | `Complete` 仅表示传输结束 | 不推出 `Verified/Qualified` |
| integrity | `IntegrityPosture` | `Verified` 表示检查通过 | 不推出 approved/running |
| cache | `MaterialCacheEntry` | `Qualified` 可进入 run gate | 不承载 protection state |
| eviction | `EvictionCandidatePosture` | 只形成候选观察 | 不形成删除许可 |
| protection | `ProtectionGuard` | `Releasable` 允许尝试 safe release | 不推出 released/evicted |

### 7.5 Lifecycle、recovery、diagnosis 与 presentation carrier

```rust
/// Runner-owned run intent lifecycle.
pub enum RunIntentState {
    /// Local intent exists but has not been submitted.
    Draft,
    /// The owner request is being submitted under a fixed idempotency basis.
    Submitting,
    /// The owner explicitly accepted the request; execution is not implied.
    Accepted,
    /// The owner explicitly rejected the request.
    Rejected,
    /// The submission outcome is ambiguous and requires read-only reconciliation.
    Unknown,
    /// The selection or material binding invalidated the intent.
    Invalidated,
}

/// Runner-owned control intent lifecycle.
pub enum ControlIntentState {
    /// Control request is recorded locally and not yet accepted.
    Pending,
    /// Owner accepted the control request.
    Accepted,
    /// Formal owner status confirms the requested control effect.
    Confirmed,
    /// Owner explicitly rejected the control request.
    Rejected,
    /// Control outcome is ambiguous.
    Unknown,
    /// Expected owner basis conflicts with the current owner basis.
    Conflict,
}

/// Recovery case lifecycle used to freeze dangerous side effects.
pub enum RecoveryState {
    /// Side effects are frozen and no reconciliation read has completed.
    Frozen,
    /// Read-only reconciliation is in progress.
    Querying,
    /// The expected basis and owner read are consistent.
    Reconciled,
    /// The sources disagree or the basis changed.
    Conflict,
    /// The case cannot be resolved without an explicit human decision.
    ManualReview,
    /// Local recovery bookkeeping is closed; this is not owner success.
    Closed,
}

/// Diagnostic handoff lifecycle owned by Runner.
pub enum HandoffState {
    /// Redacted material is prepared but not submitted.
    Draft,
    /// Handoff was submitted and awaits an owner result.
    Pending,
    /// Owner accepted the handoff.
    Accepted,
    /// Handoff is explicitly blocked by contract, visibility, or policy.
    Blocked,
    /// Formal receipt confirms delivery.
    Delivered,
    /// Owner explicitly reported handoff failure.
    Failed,
    /// Delivery outcome is ambiguous and requires read-only reconciliation.
    Unknown,
}

/// Local connectivity and recovery presentation posture.
pub enum ConnectivityState {
    /// Transport and required visible sources are currently reachable.
    Online,
    /// Some sources are reachable while others are degraded.
    Degraded,
    /// Required transport is unavailable.
    Offline,
    /// Transport returned and source reads have not yet reconciled.
    Reconnecting,
    /// Explicit read-only reconciliation is underway.
    Reconciling,
    /// Connectivity or source conflict needs manual review.
    ManualReview,
}

/// Typed, redacted reason for a connectivity presentation posture.
pub enum ConnectivityReason {
    DependencyUnavailable,
    SourceStale,
    SourceGap,
    VisibilityRestricted,
    ReconcilePending,
    ReconcileConflict,
    ManualReviewRequired,
    UnsupportedContract,
}

/// Bounded and redacted content prepared for presentation.
pub struct RedactedBoundedContent {
    /// Safe clipped content or a safe empty marker.
    pub value: Option<String>,
    /// Whether redaction was applied.
    pub redacted: bool,
    /// Whether the source was clipped to the permitted bound.
    pub truncated: bool,
}

/// Body-free visibility input for pure read-model redaction.
pub struct VisibilityContext {
    pub read_subject_ref: RunnerReadSubjectRef,
    pub scope_ref: RunnerScopeRef,
    pub visibility: VisibilityPosture,
    pub freshness: SourceFreshness,
}
```

这些 carrier 的 enum variant 是 Step 10 的唯一候选状态名。`OwnerRequestPosture`、`OwnerExecutionPosture`、`OwnerControlPosture` 仍表示外部投影轴，必须在 Step 7/8 由正式 owner safe surface 闭合；不能借用 `RunIntentState` 或 `ControlIntentState`。

## 8. `domain` 对象契约：Context and explicit selection

本模块拥有 Runner 的本地语境、显式选择和 generation boundary。它只保存 safe ref、binding、source posture 和本地状态；不复制 actor、Project、Release、baseline、approval 或 policy 正文。

### 8.1 capability / 功能到对象映射

| capability | 输入 | 输出 | 状态/副作用 | 对象 |
|---|---|---|---|---|
| 解析端侧语境 | formal context resolver safe result | immutable context ref | restricted/stale 时冻结 | `RunnerContextRef` |
| 建立显式选择世代 | exact release/version + scope | successor generation | 不原地修改旧世代 | `SelectionGeneration` |
| 绑定 authority 并失效旧链 | authority snapshot/freshness | selection posture | stale/invalidated 传播至材料和意图 | `ReleaseSelection` |

### 8.2 `RunnerContextRef`

```rust
/// Binds safe actor, session, scope, and platform references for one Runner context.
pub struct RunnerContextRef {
    /// Local context identity generated by the application layer.
    pub context_id: RunnerContextId,
    /// Actor reference resolved from a formal context source.
    pub actor_ref: ActorRef,
    /// Session reference resolved from a formal context source.
    pub session_ref: SessionRef,
    /// Optional project reference; no project body is copied.
    pub project_ref: Option<ProjectRef>,
    /// Scope in which selection and commands are evaluated.
    pub scope_ref: RunnerScopeRef,
    /// Platform context used for capability and presentation decisions.
    pub platform_ref: PlatformContextRef,
    /// Freshness of the source resolution.
    pub source_freshness: SourceFreshness,
    /// Visibility posture applied to this context.
    pub visibility: VisibilityPosture,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_id` | `RunnerContextId` | 本地 context 记录身份 | application id generator；不得由 actor/session 字符串拼接 |
| `actor_ref` | `ActorRef` | 当前 actor 的安全引用 | formal context resolver；不保存身份正文/token |
| `session_ref` | `SessionRef` | 当前 session 引用 | formal context resolver；过期由 resolver/freshness 表达 |
| `project_ref` | `Option<ProjectRef>` | 可选项目语境 | Work/Workspace safe result；缺失不得从 URL/history 推断 |
| `scope_ref` | `RunnerScopeRef` | 选择和副作用的 scope binding | request/context resolver；不得用 project ref 代替 |
| `platform_ref` | `PlatformContextRef` | 平台能力/展示语境 | platform adapter；不表达资源 allocation |
| `source_freshness` | `SourceFreshness` | context 当前性 | resolver result；非 `Current` 不允许危险副作用 |
| `visibility` | `VisibilityPosture` | 当前 actor 可见范围 | formal visibility/redaction result；`Unknown` 不返回敏感 view |

| 函数签名 | 作用 | 参数 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn assert_usable(&self, expected_scope: &RunnerScopeRef) -> Result<(), RunnerContractError>` | 检查 context 是否可作为 command basis | expected scope | `Result<(), RunnerContractError>` | 只读；要求 scope 相等、freshness current、visibility visible/partial-safe |
| `pub fn mark_stale(&mut self, reason: SelectionInvalidation) -> Result<(), RunnerContractError>` | 标记 context 不再可靠 | invalidation reason | `Result<(), RunnerContractError>` | 只改变 local posture；不修改 actor/session/project truth |
| `pub fn is_safe_for_side_effect(&self) -> bool` | 判断是否允许进入 application gate | 无 | `bool` | 仅基于已保存 posture；不得调用 resolver |

| 工厂函数签名 | 作用 | 返回 | 使用场景 |
|---|---|---|---|
| `pub fn from_resolution(context_id: RunnerContextId, actor_ref: ActorRef, session_ref: SessionRef, project_ref: Option<ProjectRef>, scope_ref: RunnerScopeRef, platform_ref: PlatformContextRef, source_freshness: SourceFreshness, visibility: VisibilityPosture) -> Result<Self, RunnerContractError>` | 从 formal safe resolver 结果构造 context | `Result<RunnerContextRef, RunnerContractError>` | `ResolveRunnerContext` / command preflight |

不变量与禁止事项：context 是安全引用集合而非身份授权；不保存 token、secret、Project/Workspace body；`is_safe_for_side_effect=false` 时不得创建 selection 后续副作用；query 不得为补齐 context 写入或刷新。

### 8.3 `SelectionGeneration`

```rust
/// Immutable local boundary separating one explicit selection from its successors.
pub struct SelectionGeneration {
    /// Monotonic local generation number.
    pub value: SelectionGenerationNumber,
    /// Cause that created this generation.
    pub cause: SelectionChangeCause,
    /// Previous generation when this is a successor.
    pub predecessor: Option<SelectionGenerationNumber>,
    /// Local creation time, not an owner version time.
    pub created_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `value` | `SelectionGenerationNumber` | 本地单调 boundary | application generation allocator / local store expected version；不可倒退 |
| `cause` | `SelectionChangeCause` | 解释 generation 创建 | explicit command、authority invalidation 或 context change |
| `predecessor` | `Option<SelectionGenerationNumber>` | 关联前一代 | `None` 只允许 initial；successor 必须回指当前 predecessor |
| `created_at` | `Timestamp` | 本地创建时刻 | ClockPort；不替代 source version/cursor |

| 函数签名 | 作用 | 返回 / 副作用 |
|---|---|---|
| `pub fn is_successor_of(&self, previous: &SelectionGeneration) -> bool` | 验证连续性 | 纯判断；比较 predecessor/value，不读取 store |
| `pub fn is_newer_than(&self, previous: &SelectionGeneration) -> bool` | 判断 generation 是否更高 | 纯判断；不等于 owner event ordering |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn initial(value: SelectionGenerationNumber, cause: SelectionChangeCause, created_at: Timestamp) -> Result<Self, RunnerContractError>` | 建立第一个 explicit generation | `predecessor=None`；value 必须为合法初值 |
| `pub fn next(previous: &SelectionGeneration, value: SelectionGenerationNumber, cause: SelectionChangeCause, created_at: Timestamp) -> Result<Self, RunnerContractError>` | 建立 successor | 要求 value 严格高于 previous.value；旧对象不可变 |

不变量与禁止事项：generation 不是 Release version、digest、event cursor 或 run id；不能由 query/render 递增；旧 generation 的 material/intent 不得静默迁移到新 generation。

### 8.4 `ReleaseSelection`

```rust
/// Owns one explicit immutable Release/version selection and its local qualification posture.
pub struct ReleaseSelection {
    /// Local selection identity.
    pub selection_id: RunnerSelectionId,
    /// Trusted context at selection time.
    pub context_ref: RunnerContextRef,
    /// Exact immutable Release reference.
    pub release_ref: ReleaseRef,
    /// Exact immutable Artifact version reference.
    pub version_ref: ArtifactVersionRef,
    /// Scope bound to the selection.
    pub scope_ref: RunnerScopeRef,
    /// Local generation separating this selection from predecessors.
    pub generation: SelectionGeneration,
    /// Formal authority snapshot reference when one has been resolved.
    pub authority_ref: Option<AuthoritySnapshotRef>,
    /// Current Runner-owned selection state.
    pub state: SelectionState,
    /// Reason for a terminal or blocked posture, when present.
    pub invalidation_reason: Option<SelectionInvalidation>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `selection_id` | `RunnerSelectionId` | 本地聚合身份 | application id generator；不代表 Release id |
| `context_ref` | `RunnerContextRef` | 选择时可信语境 | `SelectRelease` context resolution；必须与 scope 一致 |
| `release_ref` | `ReleaseRef` | exact Release 来源 | explicit user input / formal selectable-release query；禁止 latest/default/newest |
| `version_ref` | `ArtifactVersionRef` | immutable version | explicit input；不得用 mutable tag、branch 或目录排序替代 |
| `scope_ref` | `RunnerScopeRef` | 作用范围 | context/command scope；不得由 local role 推导 |
| `generation` | `SelectionGeneration` | 失效/并发边界 | generation factory；换选必须创建 successor |
| `authority_ref` | `Option<AuthoritySnapshotRef>` | 最近正式 authority basis | Release/Governance adapter safe result；不等本地 approval |
| `state` | `SelectionState` | selection 生命周期 | domain transition 只能按状态矩阵推进 |
| `invalidation_reason` | `Option<SelectionInvalidation>` | stale/invalidated/blocked 原因 | transition reason；active `Current` 时必须为空 |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn begin_authority_check(&mut self) -> Result<(), RunnerContractError>` | 在提交正式 authority read 前进入检查姿态 | `Selected/Current/Stale/Blocked -> Checking`；不调用 port、不生成 approval；`Invalidated` 拒绝 |
| `pub fn bind_authority(&mut self, authority_ref: AuthoritySnapshotRef, freshness: SourceFreshness) -> Result<(), RunnerContractError>` | 应用正式 authority posture | authority ref、freshness；`Result<(), ...>`；仅 `Checking -> Current`（或 stale/blocked），不创建 approval |
| `pub fn mark_authority_blocked(&mut self, reason: SelectionInvalidation) -> Result<(), RunnerContractError>` | 记录 authority contract / visibility / availability 无法证明 | 仅 `Checking -> Blocked`；保存 typed reason；不保留伪造 authority ref |
| `pub fn mark_authority_stale(&mut self, reason: SelectionInvalidation) -> Result<(), RunnerContractError>` | 记录 formal source freshness/basis 漂移 | `Checking/Current -> Stale`；不复用旧 authority 许可副作用 |
| `pub fn invalidate(&mut self, reason: SelectionInvalidation, next_generation: SelectionGeneration) -> Result<(), RunnerContractError>` | 失效当前 selection 并开启下游冻结边界 | reason、successor generation；更新 state/reason；不得改写 owner truth |
| `pub fn assert_binding(&self, release_ref: &ReleaseRef, version_ref: &ArtifactVersionRef, scope_ref: &RunnerScopeRef, generation: &SelectionGeneration) -> Result<(), BindingMismatch>` | 检查副作用 binding | 四个 exact binding；纯校验；不读取外部 source |
| `pub fn can_prepare_material(&self) -> bool` | 判断是否仅允许开始 material preparation | 无；只有 `Current` 且 context safe 时 true；不证明 qualified |

| 工厂函数签名 | 作用 |
|---|---|---|
| `pub fn select(selection_id: RunnerSelectionId, context_ref: RunnerContextRef, release_ref: ReleaseRef, version_ref: ArtifactVersionRef, scope_ref: RunnerScopeRef, generation: SelectionGeneration) -> Result<Self, RunnerContractError>` | 从用户显式 exact input 建立 selection | 初态必须 `Selected`；拒绝空 ref、latest/default/mutable selector；不调用 authority |

状态闭环：`select -> Selected`；authority read 触发 `Checking`；formal current + binding match 触发 `Current`；freshness drift 触发 `Stale`；revoke/expire/context/generation drift 触发 `Invalidated`；contract/visibility/conflict 不可证明触发 `Blocked`。`Invalidated` 不回 `Current`，必须创建新 selection。

模块停审记录：三个对象分别承接 context、generation、selection capability；所有字段均来自 explicit request、formal resolver、application id/clock 或 local successor；未把 role/cache/history/ACK 当 authority；Step 7 只需承接 resolver/authority read port，不得新增 selection truth 字段。

## 9. `domain` 对象契约：Material acquisition and qualification

该模块把 transfer、quarantine、integrity、qualification 和 protection 分轴。`MaterialCacheEntry` 不拥有 protection truth；保护由后续 `ProtectionGuard` 独立裁决。任何 owner locator、manifest、签名 policy 和算法在 exact 合同未闭合前都只能作为 typed ref/result 输入。

### 9.1 capability / 功能到对象映射

| capability | 输入 | 输出 | 状态/副作用 | 对象 |
|---|---|---|---|---|
| 建立并控制取得任务 | current selection binding、acquisition command | task/progress/failure | transfer local state | `AcquisitionTask` |
| 隔离和晋级本地材料 | transfer-complete handle、verification result | cache posture | quarantine→qualified/stale/invalid/evicted | `MaterialCacheEntry` |
| 完整性和平台资格 | manifest ref、digest/signature/platform checks | integrity posture | pending→verified/invalid/stale/blocked | `IntegrityPosture` |

### 9.2 `AcquisitionTask`

```rust
/// Owns one local material acquisition attempt without claiming integrity or approval.
pub struct AcquisitionTask {
    /// Local acquisition task identity.
    pub task_id: AcquisitionTaskId,
    /// Exact persisted selection that authorized this task.
    pub selection_id: RunnerSelectionId,
    /// Immutable selection binding used by this attempt.
    pub selection_binding: SelectionBinding,
    /// Safe locator reference when the formal source resolved one.
    pub locator_ref: Option<ExternalLocatorRef>,
    /// Transfer lifecycle state.
    pub state: AcquisitionState,
    /// Bounded transfer progress observation.
    pub progress: Option<TransferProgress>,
    /// Quarantine handle once bytes are materialized locally.
    pub material_handle: Option<LocalMaterialHandle>,
    /// Redacted failure posture when the task fails.
    pub failure: Option<AcquisitionFailure>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `task_id` | `AcquisitionTaskId` | 本地任务身份 | application id generator；不得用 request id 代替 |
| `selection_id` | `RunnerSelectionId` | 回指授权本 task 的 exact persisted selection | `RequestMaterialAcquisition.selection_id`；必须与 `selection_binding` 的 release/version/scope/generation 同时校验，不得按 binding 字符串反查或猜 current selection |
| `selection_binding` | `SelectionBinding` | release/version/scope/generation immutable binding | `RequestMaterialAcquisition`；binding 改变必须新建 task |
| `locator_ref` | `Option<ExternalLocatorRef>` | safe locator identity/transport hint | Artifact source port；不保存 secret URL/raw response |
| `state` | `AcquisitionState` | transfer 生命周期 | task transition function；complete 不等 verified |
| `progress` | `Option<TransferProgress>` | 有界进度 | transfer adapter/job observation；异常进度拒绝，不影响 integrity |
| `material_handle` | `Option<LocalMaterialHandle>` | quarantine material handle | cache provider；只在 complete 后出现，不能直接成为 qualified |
| `failure` | `Option<AcquisitionFailure>` | redacted failure | port/job result；失败时非空，不能保存 raw body |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn begin_resolution(&mut self) -> Result<(), RunnerContractError>` | 在正式 source resolution 前标记本地取得阶段 | 仅 `Absent -> Resolving`；不生成 locator、不调用 port |
| `pub fn bind_source(&mut self, locator_ref: ExternalLocatorRef) -> Result<(), RunnerContractError>` | 记录 matching formal safe locator ref 并允许 transfer 开始 | 仅 `Resolving -> Transferring`；不保存 URL/credential，不证明 bytes complete |
| `pub fn record_progress(&mut self, progress: TransferProgress) -> Result<(), RunnerContractError>` | 记录同一 binding 的有界进度 | progress；要求 state=Resolving/Transferring/Paused；不改变 qualification |
| `pub fn pause(&mut self, reason: AcquisitionPauseReason) -> Result<(), RunnerContractError>` | 暂停传输 | reason；仅 `Resolving/Transferring -> Paused`；不标 complete |
| `pub fn resume(&mut self, binding: &SelectionBinding) -> Result<(), RunnerContractError>` | 在重验 binding 后恢复 | binding；仅 Paused；不跳过 authority/integrity |
| `pub fn complete(&mut self, material_handle: LocalMaterialHandle) -> Result<(), RunnerContractError>` | 确认 transfer 结束并进入 quarantine handoff | handle；仅 Transferring/Paused；state=Complete；不写 verified/qualified |
| `pub fn fail(&mut self, failure: AcquisitionFailure) -> Result<(), RunnerContractError>` | 保存安全失败姿态 | failure；进入 Failed；raw transport 不保存 |
| `pub fn cancel(&mut self, reason: AcquisitionCancelReason) -> Result<(), RunnerContractError>` | 取消本地取得 | reason；进入 Cancelled；不表示材料已释放 |

| 工厂函数签名 | 作用 |
|---|---|---|
| `pub fn start(task_id: AcquisitionTaskId, selection_id: RunnerSelectionId, selection_binding: SelectionBinding) -> Result<Self, RunnerContractError>` | 建立尚未解析 locator 的任务 | selection id 与已加载 selection/binding必须一致；初态 `Absent`；不生成 locator/verified |

不变量与禁止事项：`Complete != Verified != Qualified`；resume 前必须重新检查 generation/source/authority；task 不拥有 Release bytes、manifest body、secret locator 或 Sandbox policy；cancel 不调用 cleanup，cleanup 由 guard/owner contract 另行处理。

### 9.3 `MaterialCacheEntry`

```rust
/// Owns the local material lifecycle and immutable source binding, not protection truth.
pub struct MaterialCacheEntry {
    /// Local cache entry identity.
    pub cache_entry_id: CacheEntryId,
    /// Immutable source/version/generation and digest binding.
    pub source_binding: MaterialSourceBinding,
    /// Opaque local storage handle.
    pub storage_handle: LocalMaterialHandle,
    /// Latest integrity posture reference.
    pub integrity_posture_ref: IntegrityPostureRef,
    /// Local material lifecycle state.
    pub state: MaterialCacheState,
    /// Body-free protection references used as guard inputs.
    pub protection_refs: ProtectionRefSet,
    /// Eviction candidate observation, not deletion permission.
    pub eviction_candidate: EvictionCandidatePosture,
    /// Last local use observation for candidate ordering.
    pub last_used_at: Option<Timestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `cache_entry_id` | `CacheEntryId` | 本地 cache 身份 | application id generator；不等 source/version |
| `source_binding` | `MaterialSourceBinding` | exact source + selection + digest binding | quarantine/final qualification；任一漂移使 entry stale |
| `storage_handle` | `LocalMaterialHandle` | 本地 bytes 句柄 | cache provider；不暴露绝对路径/bytes |
| `integrity_posture_ref` | `IntegrityPostureRef` | 最近验证记录 | verifier/application result；不能从 state 反推详情 |
| `state` | `MaterialCacheState` | quarantine/qualification/lifecycle | `quarantine` 初态；只有 matching verified + authority current 可 Qualified |
| `protection_refs` | `ProtectionRefSet` | guard 输入 refs | owner lease/capture/handoff/retention/orphan safe refs；不等 guard result |
| `eviction_candidate` | `EvictionCandidatePosture` | 淘汰候选观察 | eviction job 计算；candidate 不得触发删除 |
| `last_used_at` | `Option<Timestamp>` | 候选排序线索 | local observation；不得覆盖 protection/retention |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn promote(&mut self, posture: &IntegrityPosture, authority_ref: AuthoritySnapshotRef) -> Result<(), RunnerContractError>` | 同 binding/current authority 后晋级 | posture、authority ref；仅 Quarantined + verified；state=Qualified |
| `pub fn mark_stale(&mut self, reason: MaterialInvalidationReason) -> Result<(), RunnerContractError>` | 使旧材料不可复用 | reason；Qualified/Quarantined -> Stale；不删除 bytes |
| `pub fn mark_invalid(&mut self, reason: MaterialInvalidationReason) -> Result<(), RunnerContractError>` | 标记内容或兼容性失败 | reason；进入 Invalid；不重打包/改名 |
| `pub fn record_eviction_candidate(&mut self, posture: EvictionCandidatePosture, observed_at: Option<Timestamp>) -> Result<(), RunnerContractError>` | 保存有界候选评估，不执行释放 | 只更新 candidate / last-used observation；`Candidate` 不改变 material state，不调用 cleanup/release/delete |
| `pub fn protect(&mut self, protection_ref: ProtectionRef) -> Result<(), RunnerContractError>` | 添加 guard 输入 | ref；有序去重；不直接改变 `ProtectionState` |
| `pub fn release_protection(&mut self, protection_ref: ProtectionRef, confirmation_ref: OwnerResolutionRef) -> Result<(), RunnerContractError>` | 依据正式解除结果移除输入 | 两 refs；必须由 application/port 提供；不得凭本地点击移除 |
| `pub fn mark_evicted(&mut self) -> Result<(), RunnerContractError>` | 在 safe release 已完成后记录本地释放 | 无；仅 guard=Releasable 且 owner/local release receipt 已确认时允许 |

| 工厂函数签名 | 作用 |
|---|---|---|
| `pub fn quarantine(cache_entry_id: CacheEntryId, source_binding: MaterialSourceBinding, storage_handle: LocalMaterialHandle, integrity_posture_ref: IntegrityPostureRef) -> Result<Self, RunnerContractError>` | transfer complete 后隔离材料 | 初态 `Quarantined`；protection refs 默认 empty/unknown 由 guard 初始化；不得 qualified |

关键不变量：cache entry 不承载 `ProtectionState`；eviction candidate 不是删除许可；`mark_evicted` 不能由磁盘压力、stop ACK、文件存在性或 UI 确认单独触发；任何 unknown protection 都保持不可释放。

### 9.4 `IntegrityPosture`

```rust
/// Records integrity and platform qualification results for one immutable material binding.
pub struct IntegrityPosture {
    /// Local verification posture identity.
    pub posture_id: IntegrityPostureId,
    /// Exact source binding under verification.
    pub source_binding: MaterialSourceBinding,
    /// Formal manifest reference.
    pub manifest_ref: ManifestRef,
    /// Digest verification result.
    pub digest_result: DigestCheckResult,
    /// Signature verification result under owner policy.
    pub signature_result: SignatureCheckResult,
    /// Platform compatibility result.
    pub platform_result: PlatformCompatibilityResult,
    /// Freshness of authority used for the check.
    pub authority_freshness: SourceFreshness,
    /// Integrity lifecycle state.
    pub state: IntegrityState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `posture_id` | `IntegrityPostureId` | 本地验证记录身份 | application id generator；不等 digest |
| `source_binding` | `MaterialSourceBinding` | 被验证 bytes 的 immutable basis | task/cache + formal source；不允许隐式改绑 |
| `manifest_ref` | `ManifestRef` | 正式 manifest 引用 | Artifact source port；不保存 manifest body |
| `digest_result` | `DigestCheckResult` | 内容摘要比对 | owner manifest + verifier；算法/规范未闭合时只保存 semantic result |
| `signature_result` | `SignatureCheckResult` | 签名检查 | owner policy/verifier；Runner 不选择宽松 policy |
| `platform_result` | `PlatformCompatibilityResult` | 端侧兼容观察 | platform adapter + formal compatibility rule；不授予 Sandbox policy |
| `authority_freshness` | `SourceFreshness` | 验证时 authority 当前性 | formal authority read；非 Current 不可 Qualified |
| `state` | `IntegrityState` | 验证 lifecycle | verifier/domain transition；缺失输入为 Pending/Blocked |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn record_results(&mut self, digest: DigestCheckResult, signature: SignatureCheckResult, platform: PlatformCompatibilityResult) -> Result<(), RunnerContractError>` | 记录三类检查结果并按 finite result 收敛状态 | 仅 `Pending/Verifying`；digest=Passed、signature=Passed/NotRequiredByOwnerPolicy、platform=Compatible 且既有 authority_freshness=Current 时进入 `Verified`；任一 Failed/Incompatible 进入 `Invalid`；任一 Unknown/Unsupported 或 authority 非 Current 进入 `Blocked`；不生成 approval |
| `pub fn begin_verification(&mut self) -> Result<(), RunnerContractError>` | 进入验证中 | 无；Pending -> Verifying；缺 manifest/authority 不得绕过 |
| `pub fn assert_qualified(&self, binding: &MaterialSourceBinding, freshness: &SourceFreshness) -> Result<(), RunnerContractError>` | 为 cache promotion 提供证明 | binding/freshness；只在 Verified + same binding + Current 时成功 |
| `pub fn invalidate(&mut self, reason: IntegrityInvalidation) -> Result<(), RunnerContractError>` | source/authority drift 后冻结复用 | `SourceOrAuthorityStale -> Stale`、`VerificationFailedOrMismatched -> Invalid`、`ContractUnavailableOrUnsupported -> Blocked`；只允许从 `Pending/Verifying/Verified` 进入更保守状态，不重写结果；`Stale/Invalid/Blocked` 不原地恢复 |

| 工厂函数签名 | 作用 |
|---|---|---|
| `pub fn begin(posture_id: IntegrityPostureId, source_binding: MaterialSourceBinding, manifest_ref: ManifestRef, authority_freshness: SourceFreshness) -> Result<Self, RunnerContractError>` | 从正式 manifest ref 建立待验证姿态 | 初态 `Pending`；digest/signature/platform 必须由 verifier 提供，不能本地默认通过 |

不变量：Verified 只证明当前 material basis 的检查结果；不等 approved、baselined、Sandbox accepted、running 或 terminal success；manifest 缺失、source drift、signature policy unknown 或平台能力 unknown 时 fail-closed。

## 10. `domain` 对象契约：Run intent and lifecycle

本对象组把“用户请求了运行”与“Sandbox/Runtime 正在运行”严格拆开。`RunIntent`、`ControlIntent` 只拥有 Runner 本地意图和提交姿态；`OwnerRunProjection` 只保存经正式 read surface 得到的 owner 引用和多轴投影。任何对象都不得通过 PID、端口、ACK、HTTP 200、toast 或本地日志自行升级 owner execution 状态。

### 10.1 capability / 功能到对象映射

| capability | 输入 | 输出 | 本地副作用 | 对象承接 | 不能承接 |
|---|---|---|---|---|---|
| 建立一次运行请求 | current selection binding、qualified material、context、command metadata | local run intent | 保存 Runner-owned intent | `RunIntent` | Sandbox boundary、Runtime process、terminal result |
| 提交或控制 owner run | run intent、expected owner basis、control metadata | request/control receipt 或 unknown | 保存 control intent / recovery link | `ControlIntent` | 直接执行 sandbox 私有 API |
| 展示 owner 生命周期 | formal safe snapshot/ref、freshness、visibility | request/execution/control/result sections | 更新 local projection | `OwnerRunProjection` | 从本地观察推导 owner truth |

### 10.2 `RunIntent`

```rust
/// Owns one explicit Runner request to start an approved material.
/// Acceptance of the request never proves owner execution.
pub struct RunIntent {
    /// Runner-local identity for this request.
    pub run_intent_id: RunIntentId,
    /// Trusted context captured when the intent was created.
    pub context_ref: RunnerContextRef,
    /// Immutable release/version/scope/generation binding.
    pub selection_binding: SelectionBinding,
    /// Qualified local material and integrity binding.
    pub material_binding: QualifiedMaterialBinding,
    /// Correlation, idempotency and issued-at metadata.
    pub request_metadata: RunnerCommandMetadata,
    /// Formal owner request reference, if a submission produced one.
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    /// Current Runner-owned request posture.
    pub state: RunIntentState,
    /// Redacted reason for rejected, unknown or invalidated posture.
    pub disposition_reason: Option<RunIntentDispositionReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `run_intent_id` | `RunIntentId` | 本地意图身份 | application id generator；不得用 owner request id、PID 或 digest 代替 |
| `context_ref` | `RunnerContextRef` | actor/session/scope 语境 | `RequestRun` 的已解析 safe context；context stale 时不得提交 |
| `selection_binding` | `SelectionBinding` | exact Release/version/scope/generation | `ReleaseSelection` 当前 binding；不得接受隐式版本 |
| `material_binding` | `QualifiedMaterialBinding` | cache、digest、integrity posture 的资格证明 | `MaterialCacheEntry` + `IntegrityPosture`；必须同 selection binding |
| `request_metadata` | `RunnerCommandMetadata` | correlation、idempotency、issued-at、expected version | entry/application 规范化；不得由 worker 重写 |
| `sandbox_request_ref` | `Option<SandboxRequestRef>` | owner 接收后的 body-free 引用 | 仅来自 `SandboxRunPort` safe receipt；不存在时不能显示 accepted |
| `state` | `RunIntentState` | local request 生命周期 | 只能按 Step 10 迁移；不承载 execution state |
| `disposition_reason` | `Option<RunIntentDispositionReason>` | rejected/unknown/invalidated 的安全解释 | typed reason；不得保存 owner raw response 或 secret |

`QualifiedMaterialBinding` 的完整字段由 Step 7/8 以 public contract 闭合；至少必须能回指 `CacheEntryRef`、`IntegrityPostureRef`、`MaterialSourceBinding` 和 authority freshness。缺任一证明时 factory 返回 blocked，而不是构造“待运行”对象。

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn mark_submitting(&mut self, metadata: RunnerCommandMetadata) -> Result<(), RunnerContractError>` | 固定提交身份并进入提交中 | 仅 `Draft -> Submitting`；metadata 不可与原 idempotency identity 冲突；不调用 owner |
| `pub fn record_receipt(&mut self, request_ref: SandboxRequestRef, receipt: OwnerRequestReceipt) -> Result<(), RunnerContractError>` | 记录正式 owner receipt | 仅 `Submitting -> Accepted`；只更新 request 轴，不更新 execution 轴 |
| `pub fn reject(&mut self, reason: RunIntentDispositionReason) -> Result<(), RunnerContractError>` | 记录明确拒绝 | `Draft/Submitting -> Rejected`；不创建 cleanup 成功结论 |
| `pub fn mark_unknown(&mut self, reason: UnknownReason) -> Result<(), RunnerContractError>` | 冻结不可确认提交 | `Submitting -> Unknown`；必须关联或创建 `RecoveryCase`；禁止自动 replay |
| `pub fn record_reconciled_receipt(&mut self, request_ref: SandboxRequestRef, receipt: OwnerRequestReceipt) -> Result<(), RunnerContractError>` | 应用 J03 formal read-only reconcile 的明确 owner acceptance | 仅 `Unknown -> Accepted`；必须带同一 expected basis 的正式 safe read；不重发 request、不更新 execution 轴 |
| `pub fn reject_after_reconcile(&mut self, reason: RunIntentDispositionReason) -> Result<(), RunnerContractError>` | 应用 J03 formal read-only reconcile 的明确 owner rejection | 仅 `Unknown -> Rejected`；reason 必须来自 formal safe read；不把 read failure当 rejection |
| `pub fn invalidate(&mut self, mismatch: BindingMismatch) -> Result<(), RunnerContractError>` | 失效未完成的本地意图 | `Draft/Submitting/Accepted/Unknown -> Invalidated`；Unknown 只能由 formal basis/generation drift 收敛；不撤销 owner truth |
| `pub fn assert_submit_basis(&self, current: &SelectionBinding, material: &QualifiedMaterialBinding) -> Result<(), BindingMismatch>` | 提交前重验绑定 | 纯校验；任何漂移都阻止 port call |

| 工厂函数签名 | 作用 | 前置条件 / 结果 |
|---|---|---|
| `pub fn create(run_intent_id: RunIntentId, context_ref: RunnerContextRef, selection_binding: SelectionBinding, material_binding: QualifiedMaterialBinding, metadata: RunnerCommandMetadata) -> Result<Self, RunnerContractError>` | 建立本地 run intent | context usable、selection current、material qualified 且 binding 相同；初态 `Draft` |
| `pub fn rehydrate(snapshot: RunIntentSnapshot) -> Result<Self, RunnerContractError>` | 从本地 expected-version snapshot 重建 | snapshot 必须保留原 idempotency/binding；不把 owner projection 当 truth |

#### `RunIntent` 状态闭环

| 状态 | 合法来源 | 合法去向 | 禁止迁移 |
|---|---|---|---|
| `Draft` | `create` | `Submitting`、`Invalidated` | 不能直接 `Accepted` 或 `Running` |
| `Submitting` | `mark_submitting` | `Accepted`、`Rejected`、`Unknown`、`Invalidated` | 不能重复提交同一 intent |
| `Accepted` | 正式 owner receipt | `Invalidated`（binding drift）或保持等待 projection | 不迁移为 running/terminal |
| `Rejected` | 明确 owner rejection | terminal；新请求须新 intent | 不自动 retry 原 intent |
| `Unknown` | timeout、断线、版本不明 | 只经 read-only reconcile 得到 `Accepted/Rejected/Invalidated` | 不回 `Submitting`，不自动 replay |
| `Invalidated` | selection/context/material 失效 | terminal；新 binding 新建 intent | 不原地回 `Draft/Accepted` |

不变量与禁止事项：

- `Accepted` 只证明正式 owner 接收请求；不得显示为 `running`。
- `RunIntent` 不拥有 boundary、lease、runtime process、stdout/stderr、exit code 或 terminal verdict。
- 任何 `Unknown` 都必须保留 expected basis 和 recovery reference；不能由 reconnect、用户刷新或页面重新打开清除。
- `RequestRun` 的成功结果最多返回 local intent + owner request ref；不能返回“运行成功”。

### 10.3 `ControlIntent`

```rust
/// Owns one explicit start, stop, cancel, or cleanup control request.
/// A confirmed control effect is scoped to that effect only.
pub struct ControlIntent {
    /// Runner-local control identity.
    pub control_intent_id: ControlIntentId,
    /// Run intent to which this control belongs.
    pub run_intent_id: RunIntentId,
    /// Requested control operation.
    pub kind: ControlIntentKind,
    /// Owner request/run/lease basis expected by this operation.
    pub expected_owner_basis: OwnerStateBasis,
    /// Correlation and idempotency metadata.
    pub metadata: RunnerCommandMetadata,
    /// Local control lifecycle.
    pub state: ControlIntentState,
    /// Formal owner control result reference, when available.
    pub owner_result_ref: Option<ControlResultRef>,
    /// Redacted reason for rejection, conflict, or unknown outcome.
    pub disposition_reason: Option<ControlDispositionReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `control_intent_id` | `ControlIntentId` | 控制意图身份 | application id generator；不等 owner command id |
| `run_intent_id` | `RunIntentId` | 绑定所属 run intent | `RequestRunControl`；不得脱离 run intent 单独创建 |
| `kind` | `ControlIntentKind` | `Start/Stop/Cancel/CleanupRequest` | command input；cleanup 仍须过 `ProtectionGuard` |
| `expected_owner_basis` | `OwnerStateBasis` | expected request/run/lease epoch | owner-safe read + command input；缺失即 blocked |
| `metadata` | `RunnerCommandMetadata` | idempotency/correlation/issued-at | entry/application；同一 intent 不改写 |
| `state` | `ControlIntentState` | local control posture | domain transition；不代表 resource cleanup |
| `owner_result_ref` | `Option<ControlResultRef>` | 正式 control result 引用 | Sandbox/Runtime safe result；不保存 result body |
| `disposition_reason` | `Option<ControlDispositionReason>` | typed rejection/conflict/unknown | formal result 或 local basis comparison；不使用 generic string |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn request(kind: ControlIntentKind, control_intent_id: ControlIntentId, run_intent_id: RunIntentId, expected_owner_basis: OwnerStateBasis, metadata: RunnerCommandMetadata) -> Result<Self, RunnerContractError>` | 创建控制 intent | kind 与 run 状态、basis、metadata 完整；初态 `Pending`；不调用 owner |
| `pub fn record_accepted(&mut self, result_ref: ControlResultRef) -> Result<(), RunnerContractError>` | 记录 owner 受理 | `Pending -> Accepted`；不宣称 effect complete |
| `pub fn record_confirmed(&mut self, result_ref: ControlResultRef, posture: OwnerControlPosture) -> Result<(), RunnerContractError>` | 记录正式控制效果 | `Accepted -> Confirmed`；仅影响本 control kind |
| `pub fn reject(&mut self, reason: ControlDispositionReason) -> Result<(), RunnerContractError>` | 记录 owner 拒绝 | `Pending/Accepted -> Rejected`；不创建新 intent |
| `pub fn mark_conflict(&mut self, actual_basis: OwnerStateBasis) -> Result<(), RunnerContractError>` | 记录 expected/actual 冲突 | `Pending/Accepted -> Conflict`；冻结进一步控制 |
| `pub fn mark_unknown(&mut self, reason: UnknownReason) -> Result<(), RunnerContractError>` | 记录歧义结果 | `Pending/Accepted -> Unknown`；必须进入 reconcile |
| `pub fn reconcile_accepted(&mut self, result_ref: ControlResultRef, posture: OwnerControlPosture) -> Result<(), RunnerContractError>` | 应用 J03 formal read-only reconcile 的 owner acceptance/effect posture | `Unknown/Conflict -> Accepted`；只有 posture 明确确认 effect 时再进入 `Confirmed`；不重发 control |
| `pub fn reconcile_rejected(&mut self, reason: ControlDispositionReason) -> Result<(), RunnerContractError>` | 应用 J03 formal read-only reconcile 的明确 rejection | `Unknown/Conflict -> Rejected`；read unavailable/conflict不能调用此方法 |
| `pub fn requires_reconcile(&self) -> bool` | 判断是否需 read-only reconcile | `Unknown/Conflict` 为 true；纯函数 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn start(control_intent_id: ControlIntentId, run_intent_id: RunIntentId, kind: ControlIntentKind, expected_owner_basis: OwnerStateBasis, metadata: RunnerCommandMetadata) -> Result<Self, RunnerContractError>` | 建立控制 intent | `kind` 必须来自显式 command；不能由 UI button label 推导 |

控制不变量：`Confirmed(Stop) != Cleaned != Released`；`Confirmed(Cancel) != TerminalSuccess`；`Conflict/Unknown` 不能以重试次数、连接恢复或本地进程状态自动转为 `Accepted/Confirmed`；新控制必须使用新的 idempotency identity 和重新读取的 owner basis。

### 10.4 `OwnerRunProjection`

```rust
/// Projects owner-safe run references and independent lifecycle axes.
/// It is never a local substitute for Sandbox or Runtime truth.
pub struct OwnerRunProjection {
    /// Local run intent to which this projection belongs.
    pub run_intent_id: RunIntentId,
    /// Formal Sandbox request reference.
    pub sandbox_request_ref: Option<SandboxRequestRef>,
    /// Formal Sandbox boundary reference.
    pub boundary_ref: Option<SandboxBoundaryRef>,
    /// Formal Runtime run reference.
    pub runtime_run_ref: Option<RuntimeRunRef>,
    /// Owner request posture.
    pub request_posture: OwnerRequestPosture,
    /// Owner execution posture.
    pub execution_posture: OwnerExecutionPosture,
    /// Owner control posture.
    pub control_posture: OwnerControlPosture,
    /// Safe result references, never result bodies.
    pub result_refs: OwnerResultRefSet,
    /// Exact formal owner basis captured with the projected axes.
    pub owner_basis: Option<OwnerStateBasis>,
    /// Source freshness and visibility for all projected axes.
    pub freshness: SourceFreshness,
    pub visibility: VisibilityPosture,
    /// Source attribution used to build this projection.
    pub source_attribution: SourceAttribution,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `run_intent_id` | `RunIntentId` | 回指本地 intent | local repository；projection 不能脱离 intent 生成 |
| `sandbox_request_ref` | `Option<SandboxRequestRef>` | owner request ref | Sandbox safe receipt/snapshot；没有 ref 不显示 request accepted |
| `boundary_ref` | `Option<SandboxBoundaryRef>` | boundary safe ref | Sandbox owner；不得从 local process/path 拼接 |
| `runtime_run_ref` | `Option<RuntimeRunRef>` | runtime safe ref | Runtime status/result surface；不等 process id |
| `request_posture` | `OwnerRequestPosture` | request axis | owner snapshot/event；Runner 不自行迁移 |
| `execution_posture` | `OwnerExecutionPosture` | execution axis | Runtime/Sandbox formal status；PID/port 只能成为观察输入 |
| `control_posture` | `OwnerControlPosture` | control axis | formal control result；不推 cleanup |
| `result_refs` | `OwnerResultRefSet` | safe result references | owner result/read port；不保存 raw output/evidence |
| `owner_basis` | `Option<OwnerStateBasis>` | control/readback comparison basis | formal safe snapshot；缺失不得由refs或local intent拼装，且不能授权control |
| `freshness` | `SourceFreshness` | projection 当前性 | source snapshot/event + resolver；非 Current 不可授权危险副作用 |
| `visibility` | `VisibilityPosture` | actor 可见边界 | formal visibility/redaction；Unknown 不得返回正文 |
| `source_attribution` | `SourceAttribution` | owner/source/version 追踪 | adapter safe result；必须可回指来源 |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn empty(run_intent_id: RunIntentId) -> Self` | 建立无 owner ref 的初始 projection | request/execution/control 均为 unknown/not_started 的保守姿态；不默认 pending/running |
| `pub fn apply_owner_snapshot(&mut self, snapshot: OwnerRunSnapshot) -> Result<(), RunnerContractError>` | 应用正式 safe snapshot | 校验 run ref、source version、visibility；只更新 owner axes，不改 local intent |
| `pub fn apply_owner_receipt(&mut self, receipt: OwnerRunReceipt) -> Result<(), RunnerContractError>` | 应用 request/control receipt | 只更新对应 axis；receipt 不创建 execution state |
| `pub fn mark_stale(&mut self, reason: StaleReason) -> Result<(), RunnerContractError>` | 标记投影过时 | freshness -> Stale；不清除旧 ref、不改 owner |
| `pub fn can_display_running(&self) -> bool` | 判断是否可在安全 view 显示 running | 仅 current + visible + formal execution running；纯判断 |
| `pub fn can_authorize_control(&self, basis: &OwnerStateBasis) -> bool` | 提供控制前只读门禁线索 | 不替代 application 最终重读；basis mismatch 返回 false |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_snapshot(snapshot: OwnerRunSnapshot) -> Result<Self, RunnerContractError>` | 从 owner-safe snapshot 构造投影 | snapshot 必须带 run ref、source attribution、freshness、visibility；不接受 raw response |

投影不变量：

- `request_posture=Accepted` 不足以让 `execution_posture=Running`。
- `execution_posture=Running` 必须来自 formal current owner source；本地 PID、端口、socket、HTTP 200、toast 和日志只能作为 `ResourceObservation`/诊断输入。
- Query 读取 projection 不触发 refresh、repair、control 或 cleanup。
- source gap、unknown version、visibility restriction 会使 projection stale/unknown；不使用“最新收到的消息”覆盖可验证顺序。

### 10.5 lifecycle 模块停审

| 审计项 | 结论 |
|---|---|
| 对象覆盖 | `RunIntent`、`ControlIntent`、`OwnerRunProjection` 三个概要对象均有独立契约。 |
| ownership | 本地 intent、owner projection、execution truth、result/evidence 明确分离。 |
| 状态闭环 | 与概要 Step 9 的 draft/submitting/accepted/rejected/unknown/invalidated、pending/confirmed/conflict、owner 多轴状态同名。 |
| 副作用边界 | 只有 application 经 formal Sandbox/Runtime port 提交；对象方法不直连外部系统。 |
| 失败闭环 | timeout/ambiguous -> unknown + RecoveryCase；无自动 replay。 |
| 后续承接 | Step 7 需要 exact Sandbox/Runtime port seam；Step 8 需要 request/control/result envelope；Step 9 需要 RequestRun/RequestRunControl 流；Step 10 需要各轴转换矩阵。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-003/004/007/008`。 |

## 11. `domain` 对象契约：Resource, cleanup and recovery protection

此对象组负责“本地观察、正式保护输入、恢复冻结”三件不同的事。`ResourceObservation` 不拥有 allocation；`ProtectionGuard` 不拥有 cache bytes；`RecoveryCase` 不拥有 owner cursor 或修复权。缺失、过期、受限或冲突的输入一律 fail-closed。

### 11.1 capability / 功能到对象映射

| capability | 输入 | 输出 | 状态/副作用 | 对象承接 |
|---|---|---|---|---|
| 观察端侧资源与冲突 | platform probe、clock、owner allocation read | local resource posture | 替换观察，不迁移 owner 状态 | `ResourceObservation` |
| 评估释放保护 | lease/capture/handoff/retention/orphan safe refs | protected/releasable/blocked/unknown | 仅提供 release gate | `ProtectionGuard` |
| 处理断线、挂起、重启、gap、basis drift | local expected basis、owner safe read | frozen/reconciled/conflict/manual_review | 冻结危险副作用，记录 resolution refs | `RecoveryCase` |

### 11.2 `ResourceObservation`

```rust
/// Captures one bounded local resource observation with freshness.
/// Availability is never an owner allocation or lease claim.
pub struct ResourceObservation {
    /// Local observation identity.
    pub observation_id: ResourceObservationId,
    /// Redacted resource identity and category.
    pub resource_key: ResourceKey,
    pub kind: ResourceKind,
    /// Local observed posture.
    pub posture: LocalResourcePosture,
    /// Observation timestamp and local freshness.
    pub observed_at: Timestamp,
    pub freshness: LocalFreshness,
    /// Declared impact on preflight, run, or cleanup.
    pub impact: ResourceImpact,
    /// Platform source attribution without raw process/path detail.
    pub source_attribution: SourceAttribution,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `observation_id` | `ResourceObservationId` | 一次观察身份 | application id generator；新 probe 新 identity，不原地覆盖历史语义 |
| `resource_key` | `ResourceKey` | 脱敏端口/path/disk/process/resource key | PlatformResourcePort safe result；不得存绝对路径、命令行或 secret |
| `kind` | `ResourceKind` | port/storage/process/capability 等类别 | platform semantic result；不由 UI 字符串自由扩展 |
| `posture` | `LocalResourcePosture` | available/conflict/unknown/unavailable | local observation；不表示 owner allocation |
| `observed_at` | `Timestamp` | 观察时间 | trusted local clock；与 owner source time 分开 |
| `freshness` | `LocalFreshness` | 本地观察可用期限 | ClockConnectivityPort + probe policy；过期不参与危险副作用 |
| `impact` | `ResourceImpact` | 对 preflight/run/cleanup 的影响 | application/domain derivation；不把影响当 owner verdict |
| `source_attribution` | `SourceAttribution` | platform/probe 来源 | adapter safe result；不泄漏底层实现 |

#### `LocalResourcePosture` 与观察状态

```rust
/// Local observation only; it cannot become an owner allocation state.
pub enum LocalResourcePosture {
    /// The local probe found no known conflict at observation time.
    Available,
    /// The local probe found a conflict relevant to the declared resource key.
    Conflict,
    /// The probe could not prove either availability or conflict.
    Unknown,
    /// The resource or capability is locally unavailable.
    Unavailable,
}
```

| 状态 | 合法来源 | 合法处理 | 禁止事项 |
|---|---|---|---|
| `Available` | bounded platform probe | 可作为提示或 preflight 输入，提交前必须重读 | 不等 reserved/leased |
| `Conflict` | probe 明确冲突 | 阻止或提示 run/cleanup，保留来源 | 不由用户确认清除 |
| `Unknown` | probe error、permission、suspend、stale | fail-closed；建立 diagnosis/recovery | 不当作 available |
| `Unavailable` | capability missing/offline | 降级展示或阻止相关动作 | 不推 owner failure |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn from_probe(result: ResourceProbeResult) -> Result<Self, RunnerContractError>` | 从安全 probe 结果构造观察 | result 必须脱敏且带 freshness；不保存 raw probe |
| `pub fn is_current(&self, clock: &ClockSnapshot) -> bool` | 判断观察是否仍在允许窗口 | 纯判断；过期返回 false |
| `pub fn conflicts_with(&self, allocation: &OwnerAllocationSnapshot) -> ResourceConflictDisposition` | 比较 local observation 与 owner allocation | 只产生双视图 conflict；不覆盖 owner snapshot |
| `pub fn affects_run(&self) -> bool` | 判断是否会阻止 run preflight | 只依据 declared impact/posture/freshness；不授予执行权 |

禁止事项：不得读取或暴露任意进程完整详情、环境变量、命令行、原始路径、secret、socket payload；不得把 available 写入 `OwnerRunProjection.execution_posture`；不得以本地端口探测代替 Sandbox boundary。

### 11.3 `ProtectionGuard`

```rust
/// Conservatively evaluates whether a protected subject may be released.
/// Missing or stale protection input is never treated as safe.
pub struct ProtectionGuard {
    /// Guard identity.
    pub guard_id: ProtectionGuardId,
    /// Cache, run, or local material subject under protection.
    pub subject: ProtectedSubjectRef,
    /// Formal lease/allocation posture.
    pub lease_posture: OwnerLeasePosture,
    /// Capture or in-use posture.
    pub capture_posture: CaptureProtectionPosture,
    /// Diagnostic/handoff retention posture.
    pub handoff_posture: HandoffProtectionPosture,
    /// Retention policy posture.
    pub retention_posture: RetentionProtectionPosture,
    /// Orphan investigation or takeover posture.
    pub orphan_posture: OrphanProtectionPosture,
    /// Conservative aggregate decision.
    pub state: ProtectionState,
    /// Source freshness for the complete input set.
    pub freshness: SourceFreshness,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `guard_id` | `ProtectionGuardId` | guard 身份 | application id generator；不等 cache entry 或 lease id |
| `subject` | `ProtectedSubjectRef` | 被保护的 material/run/cache subject | local typed ref；不得携带 bytes/path |
| `lease_posture` | `OwnerLeasePosture` | Sandbox owner lease/allocation | formal Sandbox read；缺失为 unknown |
| `capture_posture` | `CaptureProtectionPosture` | output capture/in-use 保护 | formal runtime/observability safe ref；不由 preview 存在性推导 |
| `handoff_posture` | `HandoffProtectionPosture` | diagnostic handoff 未收束保护 | `HandoffPosture` + owner receipt；receipt 非 evidence |
| `retention_posture` | `RetentionProtectionPosture` | formal retention/expiry 限制 | owner policy/read surface；Runner 不选择 policy |
| `orphan_posture` | `OrphanProtectionPosture` | orphan 调查/接管保护 | Sandbox/reconcile safe result；unknown 时保持保护 |
| `state` | `ProtectionState` | protected/releasable/blocked/unknown | guard 纯派生；不写入 MaterialCacheEntry 的 state |
| `freshness` | `SourceFreshness` | 全输入集当前性 | formal read + local observation；非 Current 不得 Releasable |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn protect(guard_id: ProtectionGuardId, subject: ProtectedSubjectRef, inputs: ProtectionInputs) -> Result<Self, RunnerContractError>` | 初建 guard | 缺输入默认 `Unknown`；不允许默认 releasable |
| `pub fn evaluate(&mut self, inputs: ProtectionInputs) -> Result<ProtectionState, RunnerContractError>` | 全量重新评估 | 所有必需输入 current 且明确可释放才 `Releasable`；只更新 guard |
| `pub fn assert_releasable(&self, cleanup_basis: &OwnerCleanupBasis) -> Result<(), RunnerContractError>` | 为 cleanup 操作提供 gate | 必须 state=Releasable、freshness=Current、basis 一致；不调用 cleanup |
| `pub fn record_resolution(&mut self, resolution: ProtectionResolution) -> Result<(), RunnerContractError>` | 应用正式解除/冲突读取 | 只能更新对应输入轴；不得把 receipt 当 released |
| `pub fn is_conservatively_protected(&self) -> bool` | 提供删除/释放保护判断 | `Protected/Blocked/Unknown` 均 true；纯判断 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_inputs(guard_id: ProtectionGuardId, subject: ProtectedSubjectRef, inputs: ProtectionInputs) -> Result<Self, RunnerContractError>` | 从所有可用 safe refs 构造 guard | 输入缺失、stale、restricted 或冲突时 state=Unknown；不读取外部系统 |

保护不变量：磁盘压力、用户点击、文件存在性、stop ACK、PID、HTTP 200 或 UI “清理完成”均不能绕过 guard；`Releasable` 只是允许尝试 safe release，不是 `Released`、`Cleaned` 或 `Evicted`；`MaterialCacheEntry` 只能保存 protection refs，不能复制 `ProtectionState`。

### 11.4 `RecoveryCase`

```rust
/// Freezes dangerous side effects until a read-only reconciliation proves a basis.
pub struct RecoveryCase {
    /// Local recovery case identity.
    pub recovery_case_id: RecoveryCaseId,
    /// Selection, run, control, cache, or handoff subjects affected.
    pub subject_refs: RecoverySubjectRefSet,
    /// Trigger that caused the freeze.
    pub trigger: RecoveryTrigger,
    /// Local read cursor; never an owner cursor.
    pub local_cursor: RecoveryCursor,
    /// Expected generation/source/digest/lease basis.
    pub expected_basis: RecoveryExpectedBasis,
    /// Current recovery posture.
    pub state: RecoveryState,
    /// Formal read-only resolution references.
    pub resolution_refs: OwnerResolutionRefSet,
    /// Redacted reason when reconciliation cannot prove convergence.
    pub unresolved_reason: Option<ReconcileFailure>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `recovery_case_id` | `RecoveryCaseId` | 本地案例身份 | application id generator；不等 owner incident/cursor |
| `subject_refs` | `RecoverySubjectRefSet` | 受影响 local intent/projection/cache refs | application 根据 ambiguous/basis drift 建立；不得包含 raw body |
| `trigger` | `RecoveryTrigger` | disconnect/suspend/restart/session/source/lease/gap 等原因 | typed trigger；不把 generic exception 当 owner result |
| `local_cursor` | `RecoveryCursor` | 本地对账进度 | local store/job checkpoint；不得推进 owner cursor |
| `expected_basis` | `RecoveryExpectedBasis` | generation/source/digest/owner lease expected basis | 创建 freeze 时快照；不得静默更新为 actual |
| `state` | `RecoveryState` | frozen/querying/reconciled/conflict/manual_review/closed | 按 Step 10 迁移；closed 非 owner success |
| `resolution_refs` | `OwnerResolutionRefSet` | 正式只读对账依据 | read port snapshot/ref；不保存 owner response body |
| `unresolved_reason` | `Option<ReconcileFailure>` | 无法证明的安全原因 | redacted typed reason；manual review 时通常非空 |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn begin_query(&mut self, cursor: RecoveryCursor) -> Result<(), RunnerContractError>` | 开始只读对账 | `Frozen/Conflict -> Querying`；不 replay |
| `pub fn record_snapshot(&mut self, snapshot: OwnerRecoverySnapshot) -> Result<(), RunnerContractError>` | 记录正式 resolution ref/来源 | 仅添加 safe refs；不直接关闭 case |
| `pub fn reconcile(&mut self, actual: OwnerRecoverySnapshot) -> Result<RecoveryState, RunnerContractError>` | 比较 expected/actual basis | 一致 -> `Reconciled`；冲突 -> `Conflict`；不可证明 -> `ManualReview` |
| `pub fn require_manual_review(&mut self, failure: ReconcileFailure) -> Result<(), RunnerContractError>` | 显式冻结并等待人工处理 | 只能进入 `ManualReview`；不提供 override |
| `pub fn close(&mut self, resolution: OwnerResolutionRef) -> Result<(), RunnerContractError>` | 收束本地 bookkeeping | 仅有明确 resolution 且状态允许；close 不重发旧副作用 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn freeze(recovery_case_id: RecoveryCaseId, trigger: RecoveryTrigger, subject_refs: RecoverySubjectRefSet, expected_basis: RecoveryExpectedBasis) -> Result<Self, RunnerContractError>` | 建立 recovery case 并立即冻结 | 初态 `Frozen`；expected basis 必须完整到声明的 subject 轴；未知字段不得填默认值；不发 owner command |

恢复不变量：`Frozen/Querying/Conflict/ManualReview` 期间冻结危险副作用；`Reconciled` 也只允许重新执行当前 command gate，不能继续旧 request；`Closed` 仅表示本地案例已安全收束，不表示 run success、cleanup success、evidence 或 verdict。不得以 reconnect、旧 cache、local cursor 或用户刷新直接关闭。

### 11.5 resource/recovery 模块停审

| 审计项 | 结论 |
|---|---|
| 对象覆盖 | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` 均有字段、状态、factory、转换和禁止事项。 |
| ownership | local probe、owner allocation、protection decision、cleanup effect、recovery resolution 分离。 |
| fail-closed | missing/stale/restricted/conflict protection 均不可释放；unknown 不自动 replay。 |
| 状态闭环 | 与概要 Step 9 的 resource/protection/recovery 集合同名；观察状态不混入迁移型成功状态。 |
| 后续承接 | Step 7 需 Platform/Sandbox lease/cleanup/read ports；Step 8 需 safe snapshot/ref 与错误 surface；Step 9 需 cleanup/reconcile flows；Step 10 需 guard/recovery transition matrix。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-003/005/006/007/008`。 |

## 12. `domain` 对象契约：Preview, diagnosis and handoff

本对象组把“可展示的安全片段”“对失败的本地分类”和“向正式 owner 的安全交接”分开。任何对象都只能接收已通过来源、visibility、freshness 和 redaction 门禁的输入；不能把本地日志、HTTP 状态、handoff receipt 或诊断分类提升为正式 evidence、report、verdict、signoff 或审计事实。

### 12.1 capability / 功能到对象映射

| capability | 输入 | 输出 | 状态/副作用 | 对象承接 |
|---|---|---|---|---|
| 安全输出预览 | owner-safe output refs、redaction result、bound/truncation policy | bounded/redacted preview | 只读投影、可 stale/restricted | `OutputPreview` |
| 失败解释 | safe failure signals、subject refs、source attribution | classification、impact、next step | local diagnostic record | `FailureDiagnosis` |
| 安全交接 | diagnosis ref、allowed material refs、target ref、command metadata | handoff posture、owner receipt | draft/pending/accepted/delivered/unknown | `HandoffPosture` |

### 12.2 `OutputPreview`

```rust
/// Presents bounded and redacted output without owning the source body.
pub struct OutputPreview {
    /// Local preview identity.
    pub preview_id: OutputPreviewId,
    /// Exact bounded subject set under which this preview was composed.
    pub subject_refs: DiagnosticSubjectRefSet,
    /// Safe source references used to assemble the preview.
    pub source_refs: OutputSourceRefSet,
    /// Redacted and bounded content, never raw output.
    pub content: RedactedBoundedContent,
    /// Persisted display-safety posture derived at mandatory-redaction time.
    pub safety: PreviewSafetyPosture,
    /// Visibility posture applied to the content.
    pub visibility: VisibilityPosture,
    /// Freshness of the source material.
    pub freshness: SourceFreshness,
    /// Explicit truncation posture and reason.
    pub truncation: TruncationPosture,
    /// Attribution for the source and transformation.
    pub source_attribution: SourceAttribution,
    /// Local creation/refresh observation time.
    pub generated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `preview_id` | `OutputPreviewId` | 本地 preview 身份 | application id generator；不等 owner result/evidence id |
| `subject_refs` | `DiagnosticSubjectRefSet` | preview所属的exact diagnostic subjects | RefreshSafeDiagnosisJob input；non-empty、bounded、ordered unique；repository subject index不得按mtime猜latest |
| `source_refs` | `OutputSourceRefSet` | Sandbox/Runtime/Artifact/Observability safe refs | DiagnosticReadPort/RuntimeStatusReadPort safe result；不得存 raw body |
| `content` | `RedactedBoundedContent` | 已裁剪、脱敏内容 | RedactionPort + bounded policy；redaction 失败不得产生可见 value |
| `safety` | `PreviewSafetyPosture` | 展示安全姿态 | RedactionOutcome + visibility/freshness；Blocked/Unavailable时content.value=None |
| `visibility` | `VisibilityPosture` | actor/context 可见范围 | formal visibility resolver；Unknown/Unavailable 不返回正文 |
| `freshness` | `SourceFreshness` | source 当前性 | owner safe read / local refresh；非 Current 只能降级展示 |
| `truncation` | `TruncationPosture` | 是否因安全/大小边界裁剪 | builder 结果；不能用空字符串掩盖裁剪 |
| `source_attribution` | `SourceAttribution` | owner/source/version 追踪 | adapter safe result；不保存 source payload |
| `generated_at` | `Timestamp` | 本地组合时间 | trusted local clock；不伪造 owner capture time |

```rust
/// Describes whether a preview can be shown without weakening safety.
pub enum PreviewSafetyPosture {
    /// The bounded content passed the required redaction and visibility checks.
    Safe,
    /// A safe partial view is available but one or more source limits apply.
    Restricted,
    /// The source is known but no content may be returned to this actor.
    Unavailable,
    /// Required redaction or source contract could not be established.
    Blocked,
}
```

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn compose(preview_id: OutputPreviewId, subject_refs: DiagnosticSubjectRefSet, material: SafeOutputMaterial, redaction: RedactionResult, visibility: VisibilityPosture, freshness: SourceFreshness, generated_at: Timestamp) -> Result<Self, RunnerContractError>` | 从 safe material 构造 preview | 持久化exact subject index与derived safety；redaction未通过或visibility unknown时 restricted/blocked；不保存原文 |
| `pub fn assert_safe(&self, policy_ref: RedactionPolicyRef) -> Result<(), RunnerContractError>` | 校验当前 preview 仍满足 mandatory redaction | policy ref、content marker；失败只产生错误，不解锁 raw body |
| `pub fn mark_stale(&mut self, reason: StaleReason) -> Result<(), RunnerContractError>` | 标记来源过期 | freshness -> Stale；不主动刷新或修改 owner |
| `pub fn restrict(&mut self, reason: VisibilityRestrictionReason) -> Result<(), RunnerContractError>` | 降低可见范围 | visibility -> Restricted/Unavailable；不得保留不可见正文 |
| `pub fn is_displayable(&self) -> bool` | 提供展示层安全判断 | 仅 Safe/允许的 Restricted 且 content.redacted=true 时为 true；纯函数 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn unavailable(preview_id: OutputPreviewId, subject_refs: DiagnosticSubjectRefSet, source_refs: OutputSourceRefSet, visibility: VisibilityPosture, freshness: SourceFreshness, reason: PreviewUnavailableReason, generated_at: Timestamp) -> Result<Self, RunnerContractError>` | 构造无内容的显式 unavailable view | safety=Unavailable/Blocked、`content.value=None`；仍保留exact subject index；不得以空正文表示成功 |

预览不变量：

- 不保存 raw stdout/stderr、secret、完整 Artifact body、环境变量、命令行、原始路径或 owner response。
- `PreviewSafetyPosture::Safe` 只表示本地展示安全，不表示 run success、terminal result、evidence 或 report。
- stale、restricted、partial、unavailable 必须通过字段和 source attribution 显式可见；不能 fallback 到旧正文或本地日志。
- Query/render 读取 preview 不触发下载、刷新、reconcile、handoff 或 cleanup。

### 12.3 `FailureDiagnosis`

```rust
/// Classifies safe failure signals without issuing an owner verdict.
pub struct FailureDiagnosis {
    /// Local diagnosis identity.
    pub diagnosis_id: FailureDiagnosisId,
    /// Subjects affected by the diagnosed condition.
    pub subject_refs: DiagnosticSubjectRefSet,
    /// Safe, redacted source failure references.
    pub source_failures: SourceFailureRefSet,
    /// Dominant failure classification.
    pub classification: FailureClass,
    /// Declared impact on the Runner capability loop.
    pub impact: FailureImpact,
    /// Safe next step exposed to the caller.
    pub next_step: SafeNextStep,
    /// Certainty of the local diagnosis.
    pub certainty: DiagnosisCertainty,
    /// Freshness of the signals used.
    pub freshness: SourceFreshness,
    /// Source attribution for the diagnosis.
    pub source_attribution: SourceAttribution,
    /// Local creation/refresh time.
    pub diagnosed_at: Timestamp,
}
```

```rust
/// Identifies the semantic source family of a safe failure signal.
pub enum FailureClass {
    /// Release, baseline, authority, revoke, or expiry prevented progress.
    Authority,
    /// Locator, transfer, manifest, digest, signature, or compatibility failure.
    Material,
    /// Local port, disk, process, platform capability, or owner allocation conflict.
    Resource,
    /// Request validation, binding, idempotency, or owner request rejection.
    Request,
    /// Formal Sandbox or Runtime execution signal.
    Execution,
    /// Start/stop/cancel/control result signal.
    Control,
    /// Owner or local cleanup/lease/protection signal.
    Cleanup,
    /// Connectivity, suspend/resume, stale, or reconciliation signal.
    Connectivity,
    /// Redaction, visibility, diagnostic-read, or handoff signal.
    Handoff,
    /// Multiple sources conflict or the source cannot be safely classified.
    Uncertain,
}

/// Describes how a diagnosed failure affects the local capability loop.
pub enum FailureImpact {
    /// The requested operation was not submitted and can be reconsidered.
    BlockedBeforeSideEffect,
    /// A local intent or projection is frozen pending a read-only reconcile.
    FrozenPendingReconcile,
    /// The operation reached an explicit owner rejection or failure.
    ExplicitOwnerFailure,
    /// Only a presentation or diagnostic section is degraded.
    PresentationDegraded,
    /// Impact cannot be proved from available safe signals.
    UnknownImpact,
}

/// Safe, non-authoritative next-step guidance.
pub enum SafeNextStep {
    /// Read the formal source again without replaying a side effect.
    RetryRead,
    /// Ask the user to select an exact immutable source again.
    Reselect,
    /// Acquire or verify the exact material again under a new basis.
    Reverify,
    /// Run a read-only reconciliation job.
    Reconcile,
    /// Require an explicit human review before dangerous action.
    ManualReview,
    /// Direct the actor to the formal owner or support boundary.
    ContactOwner,
    /// No safe next step is available under the current contract.
    None,
}

/// Indicates whether a local diagnosis is sufficiently supported for display.
pub enum DiagnosisCertainty {
    /// All required safe signals agree for the stated classification.
    Supported,
    /// A bounded partial explanation is available.
    Partial,
    /// Sources conflict or are too old to support a classification.
    Uncertain,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `diagnosis_id` | `FailureDiagnosisId` | 本地诊断身份 | application id generator；不等 formal incident/evidence id |
| `subject_refs` | `DiagnosticSubjectRefSet` | selection/run/task/cache/handoff 等安全 subject refs | application flow；不携带正文 |
| `source_failures` | `SourceFailureRefSet` | owner/local failure references | adapter/redaction result；不得保存 raw error body |
| `classification` | `FailureClass` | 主失败来源 | `classify` 依据 safe signals；冲突时 `Uncertain` |
| `impact` | `FailureImpact` | 对主线的影响范围 | domain derivation；不能伪造成 owner verdict |
| `next_step` | `SafeNextStep` | 用户可执行的保守下一步 | 不能包含自动 replay 指令 |
| `certainty` | `DiagnosisCertainty` | 解释可信度 | source freshness/visibility/conflict 共同决定 |
| `freshness` | `SourceFreshness` | 诊断依据当前性 | formal safe read + local observation |
| `source_attribution` | `SourceAttribution` | 依据来源与版本 | body-free source marker |
| `diagnosed_at` | `Timestamp` | 本地记录时间 | trusted local clock |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn classify(signals: FailureSignals) -> Result<FailureClass, RunnerContractError>` | 依据 safe signals 选择分类 | source precedence/冲突由后续 Step 8 闭合；无依据返回 `Uncertain` |
| `pub fn diagnose(diagnosis_id: FailureDiagnosisId, subjects: DiagnosticSubjectRefSet, signals: FailureSignals, redaction: RedactionResult, timestamp: Timestamp) -> Result<Self, RunnerContractError>` | 构造本地诊断 | redaction/visibility 不通过时不返回 raw 内容；必要字段缺失则 certainty=Uncertain |
| `pub fn mark_uncertain(&mut self, reason: UncertaintyReason) -> Result<(), RunnerContractError>` | 降级诊断可信度 | certainty -> Uncertain、next_step -> Reconcile/ManualReview；不生成 verdict |
| `pub fn refresh_basis(&mut self, signals: FailureSignals, freshness: SourceFreshness, attribution: SourceAttribution) -> Result<(), RunnerContractError>` | 应用新的安全来源 | source version 变化时替换本地诊断姿态；不修改 owner failure |
| `pub fn is_actionable(&self) -> bool` | 判断是否可以展示保守 next step | 只有 freshness 非 Unavailable 且 next_step 非 None；纯函数 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn unavailable(diagnosis_id: FailureDiagnosisId, subjects: DiagnosticSubjectRefSet, reason: DiagnosticUnavailableReason, timestamp: Timestamp) -> Result<Self, RunnerContractError>` | 构造诊断不可用姿态 | classification=Uncertain、impact=UnknownImpact、next_step=RetryRead/ManualReview；不填造失败来源 |

诊断不变量：

- 不修改 Sandbox/Runtime/Artifact/Governance/Observability 的 failure truth。
- `FailureDiagnosis` 不是 evidence、report、verdict、signoff 或 audit record；本地日志只能作为经过 redaction 的非权威 hint。
- 多来源冲突、source gap、stale 或 visibility restriction 时必须保留 `Uncertain/Partial`，不得以“最后到达”来源覆盖。
- `next_step=Reconcile` 或 `ManualReview` 不能被入口解释成自动重试或 override。

### 12.4 `HandoffPosture`

```rust
/// Tracks a safe diagnostic handoff intent and owner receipt.
/// Handoff delivery never transfers evidence ownership to Runner.
pub struct HandoffPosture {
    /// Local handoff identity.
    pub handoff_id: DiagnosticHandoffId,
    /// Diagnosis being handed off.
    pub diagnosis_ref: FailureDiagnosisRef,
    /// Redacted and allowed material references.
    pub material_refs: SafeHandoffMaterialRefSet,
    /// Formal handoff target reference.
    pub target_ref: HandoffTargetRef,
    /// Correlation/idempotency metadata for the handoff intent.
    pub metadata: HandoffCommandMetadata,
    /// Local handoff lifecycle.
    pub state: HandoffState,
    /// Formal owner receipt, when available.
    pub receipt_ref: Option<HandoffReceiptRef>,
    /// Visibility of the handoff result to the actor.
    pub visibility: VisibilityPosture,
    /// Freshness of diagnosis/material basis.
    pub freshness: SourceFreshness,
    /// Redacted reason for blocked, failed, or unknown posture.
    pub disposition_reason: Option<HandoffDispositionReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `handoff_id` | `DiagnosticHandoffId` | 本地交接身份 | application id generator；不等 Observability evidence id |
| `diagnosis_ref` | `FailureDiagnosisRef` | 交接的安全诊断引用 | local diagnosis store；不得嵌入诊断正文 |
| `material_refs` | `SafeHandoffMaterialRefSet` | 允许交接的 bounded/redacted refs | RedactionPort + policy；raw body、secret、未验证 ref 禁止进入 |
| `target_ref` | `HandoffTargetRef` | 正式 owner 目标 | Observability/Archive safe target resolver；不保存 endpoint/credential |
| `metadata` | `HandoffCommandMetadata` | correlation/idempotency/expected basis | `RequestDiagnosticHandoff`；同一 intent 不静默改变 |
| `state` | `HandoffState` | draft/pending/accepted/blocked/delivered/failed/unknown | domain transition；不表达 evidence status |
| `receipt_ref` | `Option<HandoffReceiptRef>` | owner receipt 引用 | formal handoff port；receipt 不等 evidence |
| `visibility` | `VisibilityPosture` | actor 可见边界 | formal visibility/redaction result |
| `freshness` | `SourceFreshness` | diagnosis/material 当前性 | local source + owner read；非 Current 不能直接提交 |
| `disposition_reason` | `Option<HandoffDispositionReason>` | 安全失败/unknown 说明 | typed reason；不得保存 raw response |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn prepare(handoff_id: DiagnosticHandoffId, diagnosis_ref: FailureDiagnosisRef, material_refs: SafeHandoffMaterialRefSet, target_ref: HandoffTargetRef, metadata: HandoffCommandMetadata, visibility: VisibilityPosture, freshness: SourceFreshness) -> Result<Self, RunnerContractError>` | 建立待提交 handoff | 只接受 allowed/redacted refs；初态 `Draft`；freshness/visibility 不足则 `Blocked` |
| `pub fn submit(&mut self) -> Result<(), RunnerContractError>` | 固定 intent 后进入提交 | `Draft -> Pending`；不得在方法内自动重发或读取 raw body |
| `pub fn record_receipt(&mut self, receipt_ref: HandoffReceiptRef, posture: OwnerHandoffPosture) -> Result<(), RunnerContractError>` | 应用正式 owner receipt或只读回查结果 | 当前提交路径允许 `Pending -> Accepted/Delivered/Failed/Blocked`；只有显式 reconcile flow 的 formal read 可使 `Accepted/Unknown -> Delivered/Failed/Blocked`；不得由本地 ACK、重连或旧 receipt 推进，不创建 evidence |
| `pub fn mark_unknown(&mut self, reason: UnknownReason) -> Result<(), RunnerContractError>` | 处理提交结果不明 | `Pending/Accepted -> Unknown`；关联 RecoveryCase；禁止自动 resend |
| `pub fn block(&mut self, reason: HandoffDispositionReason) -> Result<(), RunnerContractError>` | 明确禁止交接 | `Draft/Pending -> Blocked`；不放宽 visibility/redaction |
| `pub fn requires_reconcile(&self) -> bool` | 判断是否需只读对账 | `Unknown` 返回 true；纯函数 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_diagnosis(diagnosis: &FailureDiagnosis, material_refs: SafeHandoffMaterialRefSet, target_ref: HandoffTargetRef, metadata: HandoffCommandMetadata) -> Result<Self, RunnerContractError>` | 从当前安全诊断建立交接草稿 | diagnosis freshness/visibility 必须满足 policy；不得复制 source body |

交接不变量：

- `Accepted`/`Delivered` 只表示 owner 接收或 receipt 送达，不表示 evidence/report/verdict/signoff。
- `Unknown`、目标不可用、redaction 失败或 visibility 变化时冻结并进入 reconcile；不自动重发原 intent。
- handoff 仍受 lease/capture/retention/orphan `ProtectionGuard` 影响；receipt 不能单独允许材料释放。
- HandoffPosture 不拥有 Observability/Archive truth，不保存原始日志、artifact、report 或凭证。

### 12.5 preview/diagnosis/handoff 模块停审

| 审计项 | 结论 |
|---|---|
| 对象覆盖 | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` 均有字段、来源、工厂、函数和不变量。 |
| 安全边界 | bounded、redacted、visibility、freshness 均为显式字段；redaction 失败 fail-closed。 |
| ownership | Runner 只拥有本地 preview/diagnosis/handoff 姿态；Observability/Archive 仍拥有正式证据、报告与交接事实。 |
| 状态闭环 | Handoff 使用 Step 9 的 draft/pending/accepted/blocked/delivered/failed/unknown；preview/diagnosis 派生姿态不冒充成功状态。 |
| 后续承接 | Step 7 需 DiagnosticRead/Redaction/ObservabilityHandoff/Archive ports；Step 8 需 safe material/result schema；Step 9 需 preview/diagnosis/handoff flow；Step 10 需 handoff matrix。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-005/006/008`。 |

## 13. `domain` / `entry` 对象契约：Entry and presentation composition

`RunnerReadModel` 与 `ConnectivityView` 是只读组合对象，不是新的 truth owner。它们可以汇总 selection、material、owner run、resource、preview、diagnosis 和 handoff 的安全 section，但不得把多轴状态压成一个 `success`、`healthy` 或 `running` 字段，也不得在 query/render 时刷新、修复或提交副作用。

### 13.1 capability / 功能到对象映射

| capability | 输入 | 输出 | 读写边界 | 对象承接 |
|---|---|---|---|---|
| 多入口共享安全展示 | 各 domain safe section、source/freshness/visibility | composite read model | pure read/derive；不持久化第二 truth | `RunnerReadModel` |
| 连接与恢复展示 | platform/connectivity observation、RecoveryCase refs | online/degraded/offline/reconciling/manual_review projection | 替换 view；不迁移业务状态 | `ConnectivityView` |

### 13.2 `RunnerReadModel`

```rust
/// One safe section in the pure domain composition result.
/// Missing or restricted bodies remain explicit and are never replaced by defaults.
pub struct RunnerComposedSection<T> {
    pub surface: RunnerViewSurface,
    pub body: Option<T>,
}

/// Typed reason used when a composed section or the whole model has no safe body.
pub enum ReadModelUnavailableReason {
    Missing,
    Rebuilding,
    Disabled,
    SourceUnavailable,
    VisibilityRestricted,
    GenerationConflict,
    UnsupportedContract,
}
```

```rust
/// Composes source-attributed Runner sections for GUI, CLI, and product callers.
/// The read model is not a second truth store and has no side effects.
pub struct RunnerReadModel {
    /// Safe context and selection section.
    pub context: RunnerContextView,
    pub selection: RunnerComposedSection<SelectionPostureSection>,
    /// Material preparation and qualification section.
    pub material: RunnerComposedSection<MaterialPostureSection>,
    /// Local intent and owner lifecycle section.
    pub run: RunnerComposedSection<RunPostureSection>,
    /// Resource, protection, and cleanup section.
    pub resource_cleanup: RunnerComposedSection<ResourceCleanupSection>,
    /// Preview, diagnosis, and handoff section.
    pub preview_diagnosis: RunnerComposedSection<PreviewDiagnosisSection>,
    /// Connectivity/recovery presentation section.
    pub connectivity: RunnerComposedSection<ConnectivityView>,
    /// Per-section owner/source/freshness/visibility attribution.
    pub source_attribution: SourceAttributionSet,
    /// Composition generation used to reject stale refresh results.
    pub composition_generation: ReadModelGeneration,
    /// Overall availability marker; never a business success marker.
    pub availability: ReadModelAvailability,
}
```

```rust
/// Availability of a composed read model without collapsing section states.
pub enum ReadModelAvailability {
    /// Every required section has a safe visible surface.
    Complete,
    /// One or more sections are partial, stale, or restricted.
    Partial,
    /// Required context or visibility cannot be established.
    Unavailable,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context` | `RunnerContextView` | actor/session/scope safe view | ContextReadPort + local ref；不含身份正文 |
| `selection` | `RunnerComposedSection<SelectionPostureSection>` | explicit release/version/authority posture或显式缺口 | local selection + formal authority projection；不得补latest/default body |
| `material` | `RunnerComposedSection<MaterialPostureSection>` | task/cache/integrity/qualification posture或显式缺口 | local repositories + safe source refs；不触发acquisition |
| `run` | `RunnerComposedSection<RunPostureSection>` | local intent + owner多轴或显式缺口 | intent store + owner projection；不由PID/ACK组装running |
| `resource_cleanup` | `RunnerComposedSection<ResourceCleanupSection>` | local observation + guard/cleanup/recovery或显式缺口 | observation/guard/read refs；冲突必须显式 |
| `preview_diagnosis` | `RunnerComposedSection<PreviewDiagnosisSection>` | bounded preview/diagnosis/handoff或显式缺口 | safe/redacted refs；不含raw body/evidence |
| `connectivity` | `RunnerComposedSection<ConnectivityView>` | transport/source recovery posture或显式缺口 | local connectivity/recovery projection；不清除各section stale |
| `source_attribution` | `SourceAttributionSet` | section-level owner/version/freshness/visibility | composer from safe source metadata；不保存正文 |
| `composition_generation` | `ReadModelGeneration` | 防止旧 refresh 覆盖新 selection/context | application refresh generation；不等 selection generation |
| `availability` | `ReadModelAvailability` | 组合可见性 | composer derivation；不等 run/material success |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn compose(sources: RunnerReadSources, generation: ReadModelGeneration) -> Result<Self, RunnerContractError>` | 从安全 section 组合 read model | 纯组合；保留每个 section 的状态、来源和缺口；不 refresh/repair/write |
| `pub fn redact_for(&self, actor: ActorContext, visibility: VisibilityContext) -> Result<Self, RunnerContractError>` | 按正式 visibility 裁剪 | 只减少可见内容；不从不可见来源补默认值；不改 domain truth |
| `pub fn is_stale_against(&self, generation: &ReadModelGeneration) -> bool` | 判断是否会被新 refresh 淘汰 | generation mismatch 或 section stale；纯判断 |
| `pub fn section_available(&self, section: ReadModelSection) -> bool` | 查询单 section 是否具备安全 surface | 不把其他 section 状态推导为当前；纯判断 |
| `pub fn unavailable(context: RunnerContextView, generation: ReadModelGeneration, reason: ReadModelUnavailableReason) -> Result<Self, RunnerContractError>` | 构造整体 unavailable view | 每个受影响 section 显式 unavailable；不返回误导性空成功 |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_sources(sources: RunnerReadSources, generation: ReadModelGeneration) -> Result<Self, RunnerContractError>` | 组合一次稳定读取快照 | sources 必须标明 owner/source/freshness/visibility；不接受未标记的 generic map |

### 13.3 `ConnectivityView`

```rust
/// Projects connectivity and recovery posture for presentation only.
/// Connectivity does not mutate selection, run, cleanup, or handoff truth.
pub struct ConnectivityView {
    /// Current connectivity/recovery presentation state.
    pub state: ConnectivityState,
    /// Local observation time and freshness.
    pub observed_at: Timestamp,
    pub freshness: LocalFreshness,
    /// Owner/source families affected by the connectivity posture.
    pub affected_sources: SourceOwnerSet,
    /// Recovery case associated with the degraded state, when any.
    pub recovery_case_ref: Option<RecoveryCaseId>,
    /// Safe reason for degraded/offline/manual-review state.
    pub reason: Option<ConnectivityReason>,
    /// Attribution for the connectivity observation.
    pub source_attribution: SourceAttribution,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state` | `ConnectivityState` | online/degraded/offline/reconnecting/reconciling/manual_review | ClockConnectivityPort + RecoveryCase projection；不改变业务轴 |
| `observed_at` | `Timestamp` | 本地观察时间 | trusted local clock；不伪造 owner event time |
| `freshness` | `LocalFreshness` | 观察有效性 | connectivity adapter；过期不能清除 stale/unknown |
| `affected_sources` | `SourceOwnerSet` | 受影响 Artifact/Governance/Sandbox/Runtime/Obs 等 owner 集合 | safe observation；不得假定所有 source 同步 |
| `recovery_case_ref` | `Option<RecoveryCaseId>` | 关联本地 recovery case | local ref；不等 owner incident id |
| `reason` | `Option<ConnectivityReason>` | redacted 连接/恢复原因 | typed reason；不保存 network body/credential |
| `source_attribution` | `SourceAttribution` | connectivity provider attribution | adapter safe result；不暴露 provider internals |

| 函数签名 | 作用 | 参数 / 返回 / 副作用 |
|---|---|---|
| `pub fn from_observation(observation: ConnectivityObservation) -> Result<Self, RunnerContractError>` | 从 safe connectivity observation 构造 view | 只读构造；unknown/unavailable 保留，不默认 online |
| `pub fn with_recovery(&mut self, recovery_case_ref: RecoveryCaseId, state: ConnectivityState) -> Result<(), RunnerContractError>` | 关联恢复案例 | 仅更新 presentation projection；不关闭或修改 recovery case |
| `pub fn affects(&self, owner: SourceOwner) -> bool` | 判断某 owner 是否受影响 | 纯判断；不代表该 owner 的业务状态 |
| `pub fn is_online_for_read(&self) -> bool` | 判断是否可以尝试安全读取 | 只作为提示；application 仍需每个 port 自己返回 freshness/readiness |
| `pub fn mark_manual_review(&mut self, reason: ConnectivityReason) -> Result<(), RunnerContractError>` | 暴露无法证明的恢复 | state -> ManualReview；不提供 override |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn unavailable(observed_at: Timestamp, reason: ConnectivityReason) -> Result<Self, RunnerContractError>` | 构造无连接安全视图 | state=Offline/ManualReview，affected sources 显式；不标任何 source current |

Connectivity 不变量：

- `Online` 不等 selection current、material qualified、owner running、cleanup confirmed 或 handoff delivered。
- `Offline/Reconnecting/Reconciling/ManualReview` 期间不自动 replay command、consumer 或 handoff；只允许显式 read/reconcile。
- `RunnerReadModel` 不持久化为第二 truth；render/query 不触发 connectivity refresh。
- `reconciling -> online/degraded` 只能在所有受影响 `RecoveryCase` 有明确 resolution basis 后；网络恢复本身不足以关闭案例。

### 13.4 presentation 模块停审

| 审计项 | 结论 |
|---|---|
| 对象覆盖 | `RunnerReadModel`、`ConnectivityView` 均完成；secondary sections 作为 typed section，不伪装为独立 truth。 |
| 读写边界 | compose/redact/query/render 全部 no-write；refresh 由显式 Job/operation 承担。 |
| 状态边界 | connectivity 是 projection；read model availability 不等业务成功；各 section 保持多轴状态。 |
| 入口一致性 | GUI/CLI/product 均消费同一安全 read model 和 Command/Query facade；平台差异只影响展示能力。 |
| 后续承接 | Step 7 需 read source/resolver/redaction port；Step 8 需 view surface/visibility schema；Step 9 需 `GetRunnerReadModel`/refresh flow；Step 10 需 presentation projection matrix。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-004/005/007/008`。 |

## 14. `application` 对象契约：operation orchestration and stable carriers

本节只定义应用层需要跨 Command、Query、planned Consumer 和 Operations Job 复用的稳定 carrier。它们负责把入口元数据、幂等身份、stored-result 引用和可见性决策传给 use-case service；不拥有 domain truth、不实现 repository/adapter、不把 result ref 当成 result body。

### 14.1 application capability / 对象映射

| capability | 对象 | 责任 | 不承担 |
|---|---|---|---|
| 统一编排入口 | `RunnerApplicationFacade` | 聚合各业务 service，供 entry/worker/operations 注入 | 不隐藏 port、repository 或 owner client |
| 固定 operation metadata | `RunnerOperationContext` | 校验 channel、actor、trace、command/query/job metadata | 不做认证，不生成业务 truth |
| command/consumer/job 幂等 | `RunnerIdempotencyRecord` | reservation、digest comparison、stored result ref | Query 不创建；不自动 replay unknown |
| duplicate result surface | `StoredRunnerOperationResult` | body-free result kind/ref/trace shell | 不替代结果读取 API |
| read visibility | `RunnerReadVisibilityDecision` | 将 resolver/visibility marker 交给 query assembly | 不从裸 id 推导 scope，不修改 projection |
| job report assembly | `RunnerJobReportAssembly` | 聚合 refs/counters，生成本地 job report surface | 不运行 job、不保存 truth、不伪造 evidence |

### 14.2 shared application carriers

```rust
/// Identifies the application channel protected by orchestration rules.
pub enum RunnerOperationChannel {
    /// A command that may write Runner-owned state or submit one side effect.
    Command,
    /// A read-only query that must not reserve idempotency or refresh sources.
    Query,
    /// A planned inbound owner-fact consumer.
    InboundEvent,
    /// An explicit long-running or maintenance operation.
    OperationsJob,
}

/// Names one application operation without carrying its request body.
pub struct RunnerOperationName(pub String);

/// Normalized idempotency identity for command, consumer, or job operations.
pub struct RunnerOperationIdempotencyKey(pub String);

/// Canonical digest of stable operation input, excluding volatile metadata.
pub struct RunnerRequestDigest(pub String);

/// Stable local identity for one stored application result surface.
pub struct RunnerApplicationResultId(pub String);

/// Body-free pointer used for duplicate replay.
pub struct RunnerApplicationResultRef {
    /// Operation that produced the stored result.
    pub operation_name: RunnerOperationName,
    /// Stable stored result identity.
    pub result_id: RunnerApplicationResultId,
}

/// Redacted explanation for an idempotency conflict.
pub struct RunnerIdempotencyConflictReason(pub String);

/// Technical reservation state; it is not a domain lifecycle.
pub enum RunnerIdempotencyState {
    /// Key and request digest were reserved without a result yet.
    Reserved,
    /// A result surface was stored and can be replayed by reference.
    Completed,
    /// The key was reused for a different operation or stable digest.
    Conflict,
}

/// Stored result surface category.
pub enum RunnerStoredResultKind {
    /// Accepted or rejected command result surface.
    CommandResult,
    /// Planned consumer receipt or disposition surface.
    ConsumerReceipt,
    /// Operations job report surface.
    JobReport,
}

/// Body-free reference to a serialized result surface.
pub struct RunnerStoredResultSurfaceRef(pub String);
```

| 类型 | 来源 | 约束 |
|---|---|---|
| `RunnerOperationChannel` | entry/worker/job classification | `Query` 永不进入 idempotency reservation；`InboundEvent` 只在 owner event contract ready 时执行 |
| `RunnerOperationName` | 02 的 Command/Query/Consumer/Job 名称 | 非空；必须与 Step 8/9 名称一致；不得由 route/path 临时拼接 |
| `RunnerOperationIdempotencyKey` | command metadata、event dedup key、job metadata | body-free、稳定、同一 intent 不改写；不得用 run id/PID 替代 |
| `RunnerRequestDigest` | application canonicalizer | 仅含稳定业务输入；排除 request id、时间、trace、随机值和 raw body |
| `RunnerApplicationResultRef` | application id generator + result store | duplicate replay 指针；不携带 result body、verdict 或 owner truth |
| `RunnerStoredResultKind` | application result classification | Query 不存 result；kind 与 surface schema 必须匹配 |
| `RunnerStoredResultSurfaceRef` | result store safe response | 不暴露存储产品、绝对路径或 secret |

### 14.3 `RunnerApplicationFacade`

```rust
/// Aggregates Runner application services for controlled runtime injection.
pub struct RunnerApplicationFacade<S, A, L, R, P, Q, C, J> {
    /// Context and explicit-selection service.
    pub selection_service: S,
    /// Material acquisition and qualification service.
    pub material_service: A,
    /// Run and control lifecycle service.
    pub lifecycle_service: L,
    /// Resource, protection, and recovery service.
    pub recovery_service: R,
    /// Preview, diagnosis, and handoff service.
    pub presentation_service: P,
    /// Read-model/query composition service.
    pub query_service: Q,
    /// Planned consumer orchestration service.
    pub consumer_service: C,
    /// Operations job orchestration service.
    pub job_service: J,
}
```

| 字段 | 来源/注入 | 约束 |
|---|---|---|
| `selection_service` | runtime builder | 只能经 context/authority ports；不保存 Release/Governance body |
| `material_service` | runtime builder | 只能经 source/verifier/cache ports；transfer 不直接升级 qualification |
| `lifecycle_service` | runtime builder | 只能经 Sandbox/Runtime ports；不实现私有 owner backend |
| `recovery_service` | runtime builder | 只能经 platform/lease/cleanup/read ports；unknown 不 replay |
| `presentation_service` | runtime builder | 只接收 safe/redacted sources；不抓 raw log |
| `query_service` | runtime builder | Query no-write；不隐式 refresh/repair |
| `consumer_service` | runtime builder | planned/blocked 时只能返回 readiness disposition；不解析未知 payload |
| `job_service` | runtime builder | job report 非 owner success/evidence；不隐藏副作用在 query |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn new(selection_service: S, material_service: A, lifecycle_service: L, recovery_service: R, presentation_service: P, query_service: Q, consumer_service: C, job_service: J) -> Self` | 组合应用 facade | 仅组合已装配 service；不执行业务操作、不访问 store |

不变量：facade 不是 public DTO；entry/worker/operations 只能通过 facade 或明确 application service 使用；facade 不允许把 concrete infra 类型倒灌到 domain；所有 owner call 仍需经过 semantic port。

### 14.4 `RunnerOperationContext`

```rust
/// Carries validated metadata for exactly one application operation.
pub struct RunnerOperationContext {
    /// Application channel.
    pub channel: RunnerOperationChannel,
    /// Stable operation identity.
    pub operation_name: RunnerOperationName,
    /// Trusted actor/context supplied by the entry boundary.
    pub actor_context: ActorContext,
    /// Core trace/correlation reference.
    pub trace_ref: TraceRef,
    /// Command metadata for command channel only.
    pub command_metadata: Option<RunnerCommandMetadata>,
    /// Query metadata for query channel only.
    pub query_metadata: Option<RunnerQueryMetadata>,
    /// Job run identity for operations job channel only.
    pub job_run_ref: Option<JobRunRef>,
    /// Normalized idempotency key for command/event/job channels.
    pub idempotency_key: Option<RunnerOperationIdempotencyKey>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `channel` | entry/worker/job classifier | channel 与 metadata 组合必须匹配；不接受隐式 channel |
| `operation_name` | formal command/query/job name | 不得由 UI label 或 transport path 推导 |
| `actor_context` | trusted inbound boundary | application 不做登录认证；仅校验存在和 scope marker |
| `trace_ref` | command/query metadata、event envelope、job metadata | body-free；不得被 result id 替代 |
| `command_metadata` | command entry | `Command` 必须 Some，其余 channel 必须 None |
| `query_metadata` | query entry | `Query` 必须 Some；不得携带 write idempotency |
| `job_run_ref` | operations entry | `OperationsJob` 必须 Some；不得替代 result identity |
| `idempotency_key` | command/event/job metadata | Query 必须 None；unknown 不触发自动 replay |

| 函数签名 | 作用 | 约束/副作用 |
|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断是否需要 reservation | Command/InboundEvent/OperationsJob=true；Query=false；纯函数 |
| `pub fn assert_query_no_write(&self) -> Result<(), ApplicationError>` | 验证 query context | query 有 idempotency/job/command metadata 即 error；不写状态 |
| `pub fn assert_write_metadata_complete(&self) -> Result<(), ApplicationError>` | 验证写入口闭合 | 缺 actor/trace/idempotency 或不匹配 channel 即 error |
| `pub fn from_command(operation_name: RunnerOperationName, actor_context: ActorContext, metadata: RunnerCommandMetadata, trace_ref: TraceRef, key: RunnerOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 command context | key 必须与 metadata identity 一致；不调用 service |
| `pub fn from_query(operation_name: RunnerOperationName, actor_context: ActorContext, metadata: RunnerQueryMetadata, trace_ref: TraceRef) -> Result<Self, ApplicationError>` | 构造 query context | idempotency 必须 None；no-write |
| `pub fn from_inbound_event(operation_name: RunnerOperationName, actor_context: ActorContext, event_ref: OwnerEventRef, dedup_key: RunnerOperationIdempotencyKey, trace_ref: TraceRef) -> Result<Self, ApplicationError>` | 构造 planned consumer context | contract readiness 未通过时只返回 blocked/disposition；不解析 body |
| `pub fn from_job(operation_name: RunnerOperationName, actor_context: ActorContext, job_run_ref: JobRunRef, trace_ref: TraceRef, key: RunnerOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 构造 job context | job key/run ref 完整；不把 job report 当 truth |

### 14.5 `RunnerIdempotencyRecord`

```rust
/// Stores technical reservation state for one write/event/job operation.
pub struct RunnerIdempotencyRecord {
    /// Normalized idempotency key.
    pub idempotency_key: RunnerOperationIdempotencyKey,
    /// Protected application channel.
    pub channel: RunnerOperationChannel,
    /// Protected operation identity.
    pub operation_name: RunnerOperationName,
    /// Canonical stable input digest.
    pub request_digest: RunnerRequestDigest,
    /// Stored result reference after completion.
    pub result_ref: Option<RunnerApplicationResultRef>,
    /// Reservation state.
    pub state: RunnerIdempotencyState,
    /// Redacted conflict explanation.
    pub conflict_reason: Option<RunnerIdempotencyConflictReason>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `idempotency_key` | `RunnerOperationContext` | 非空；同一 intent 不改写 |
| `channel` | operation context | Query 不得建立 record |
| `operation_name` | operation context | 与 result ref operation 一致 |
| `request_digest` | canonical digest calculator | 不含 volatile metadata/body |
| `result_ref` | stored-result writer | Completed 必须 Some；Reserved/Conflict 必须 None |
| `state` | application transition | 只允许 Reserved→Completed 或 Reserved→Conflict |
| `conflict_reason` | typed local comparison | Conflict 必须 Some；不保存请求正文 |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn reserve(context: &RunnerOperationContext, request_digest: RunnerRequestDigest) -> Result<Self, ApplicationError>` | 建立 reservation | Query/context 不可 reserve；必须有 key |
| `pub fn matches(&self, channel: &RunnerOperationChannel, name: &RunnerOperationName, digest: &RunnerRequestDigest) -> bool` | 判断 duplicate 是否同一请求 | 纯判断；不读取 result body |
| `pub fn complete(&mut self, result_ref: RunnerApplicationResultRef) -> Result<(), ApplicationError>` | 记录完成结果 | Reserved→Completed；operation 必须匹配 |
| `pub fn mark_conflict(&mut self, reason: RunnerIdempotencyConflictReason) -> Result<(), ApplicationError>` | 标记 key/digest 冲突 | Reserved→Conflict；清空 result ref |

### 14.6 `StoredRunnerOperationResult`

```rust
/// Metadata shell for a stored result reachable by a result reference.
pub struct StoredRunnerOperationResult {
    /// Stable result identity.
    pub result_ref: RunnerApplicationResultRef,
    /// Stored result category.
    pub result_kind: RunnerStoredResultKind,
    /// Body-free serialized surface reference.
    pub surface_ref: RunnerStoredResultSurfaceRef,
    /// Trace associated with the original operation.
    pub trace_ref: TraceRef,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `result_ref` | application result id generator | duplicate replay 复用；不等 domain truth id |
| `result_kind` | application result classifier | CommandResult/ConsumerReceipt/JobReport；Query 不存 |
| `surface_ref` | result store | 只指向安全 result surface；不保存 DTO body |
| `trace_ref` | operation context | 只做关联；不重写原 trace |

| 函数签名 | 作用 |
|---|---|
| `pub fn from_surface(result_ref: RunnerApplicationResultRef, result_kind: RunnerStoredResultKind, surface_ref: RunnerStoredResultSurfaceRef, trace_ref: TraceRef) -> Result<Self, ApplicationError>` | 构造 result shell；不保存 body |
| `pub fn matches_ref(&self, result_ref: &RunnerApplicationResultRef) -> bool` | 纯 identity 判断 |
| `pub fn is_job_report(&self) -> bool` | 判断 kind 是否 JobReport |
| `pub fn is_consumer_receipt(&self) -> bool` | 判断 kind 是否 ConsumerReceipt |

### 14.7 `RunnerReadVisibilityDecision`

```rust
/// Application-local visibility result used by query assembly.
pub struct RunnerReadVisibilityDecision {
    /// Canonical read subject.
    pub read_subject_ref: RunnerReadSubjectRef,
    /// Actor reference used for evaluation.
    pub actor_ref: ActorRef,
    /// Scope resolution source.
    pub scope_ref: RunnerScopeRef,
    /// Visibility marker exposed to the query surface.
    pub visibility: VisibilityPosture,
    /// Freshness of the formal visibility resolution.
    pub freshness: SourceFreshness,
    /// Optional degraded marker for stale/partial sources.
    pub degraded: Option<RunnerDegradedMarker>,
    /// Body-free source marker for the resolution.
    pub resolution_source_ref: VisibilityResolutionSourceRef,
    /// Body-free source attribution copied from the formal resolution.
    pub source_attribution: Vec<SourceAttribution>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `read_subject_ref` | explicit query input or formal resolver | 不从裸 id、page cursor、timestamp、UI key 拼接 |
| `actor_ref` | ActorContext | 不保存 actor profile/credential |
| `scope_ref` | context/visibility resolver | 不从 loaded truth 或 local role 推导 |
| `visibility` | formal visibility/redaction result | Unknown/Unavailable 不返回正文 |
| `freshness` | formal visibility resolver | response surface 必须保留；非Current不得由mapper升级 |
| `degraded` | source freshness/readiness assembly | 只降级 view，不触发 refresh |
| `resolution_source_ref` | resolver summary | body-free；便于审计解析路径 |
| `source_attribution` | resolver safe result | body-free且可多来源；不得由loaded body或local role伪造 |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_resolver(read_subject_ref: RunnerReadSubjectRef, actor_ref: ActorRef, scope_ref: RunnerScopeRef, visibility: VisibilityPosture, freshness: SourceFreshness, degraded: Option<RunnerDegradedMarker>, source_ref: VisibilityResolutionSourceRef, source_attribution: Vec<SourceAttribution>) -> Result<Self, ApplicationError>` | 从 resolver summary 构造 | 只结构校验，不访问 repository；attribution必须bounded且与resolver source一致 |
| `pub fn is_visible(&self) -> bool` | 判断是否返回可见 body | Visible/允许的 Partial 才 true；纯函数 |
| `pub fn response_surface(&self) -> RunnerViewSurface` | 组装 public view marker | 纯组装；不写 projection |

不变量：visibility denied 是安全 surface，不是 generic transport error；query 仍必须 no-write；visibility decision 不创建 selection、intent、diagnosis 或 evidence；fake/runtime 需遵循同一 resolver-first 规则。

### 14.8 `RunnerJobReportAssembly`

```rust
/// Accumulates body-free references and counters for one Runner operations job.
pub struct RunnerJobReportAssembly {
    /// Job run identity.
    pub job_run_ref: JobRunRef,
    /// Job idempotency identity.
    pub idempotency_key: RunnerOperationIdempotencyKey,
    /// Operation name.
    pub operation_name: RunnerOperationName,
    /// Acquisition tasks inspected or changed.
    pub acquisition_task_refs: Vec<AcquisitionTaskRef>,
    /// Cache entries inspected or changed.
    pub cache_entry_refs: Vec<CacheEntryRef>,
    /// Recovery cases inspected or changed.
    pub recovery_case_refs: Vec<RecoveryCaseId>,
    /// Diagnosis/handoff refs produced by the job.
    pub diagnosis_refs: Vec<FailureDiagnosisRef>,
    pub handoff_refs: Vec<DiagnosticHandoffId>,
    /// Safe projection refs refreshed by the job.
    pub projection_refs: Vec<RunnerProjectionRef>,
    /// Number of items scanned, changed, and failed.
    pub scanned_count: u64,
    pub changed_count: u64,
    pub failed_count: u64,
    /// Redacted local job issues; never raw adapter/error body.
    pub issue_refs: RunnerJobIssueRefSet,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn start(context: &RunnerOperationContext, key: RunnerOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 建立 job report accumulator | 仅 OperationsJob；不保存 raw result |
| `pub fn record_acquisition(&mut self, refs: Vec<AcquisitionTaskRef>, changed_count: u64) -> Result<(), ApplicationError>` | 记录取得/验证 job refs | 不把 job success 映射为 qualified/approved |
| `pub fn record_cache(&mut self, refs: Vec<CacheEntryRef>, changed_count: u64) -> Result<(), ApplicationError>` | 记录 cache/eviction evaluation refs | candidate 不等 evicted |
| `pub fn record_recovery(&mut self, refs: Vec<RecoveryCaseId>, changed_count: u64) -> Result<(), ApplicationError>` | 记录 reconcile refs | 不表示 owner state 已修复 |
| `pub fn record_diagnosis(&mut self, refs: Vec<FailureDiagnosisRef>, handoffs: Vec<DiagnosticHandoffId>) -> Result<(), ApplicationError>` | 记录诊断/交接 refs | 不生成 evidence/report/verdict |
| `pub fn record_projection(&mut self, refs: Vec<RunnerProjectionRef>, changed_count: u64) -> Result<(), ApplicationError>` | 记录显式 Refresh Job 已替换的 safe projection refs | refs 必须来自正式 section/repository carrier；不从 section kind、subject 或字符串拼接 projection identity |
| `pub fn record_issue(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), ApplicationError>` | 记录有界、脱敏的本地 job issue | 只追加 typed issue ref；不保存 raw exception/body，不改变 owner truth |
| `pub fn finish(self, disposition: JobReportDisposition) -> Result<RunnerJobReport, ApplicationError>` | 生成 public job report | body-free；不保存 result surface、不调用 adapter |

Job report 不变量：report 只反映本地 job work、refs、counters 和 blocked/partial/unknown posture；不得包含 Release/Artifact/Governance/Sandbox/Runtime/Observability 正文、测试结果、evidence、verdict 或 signoff。

### 14.9 application 模块停审

| 审计项 | 结论 |
|---|---|
| carrier 覆盖 | operation context、idempotency、stored result、visibility、facade、job report assembly 已闭口。 |
| 读写分类 | Query 无 reservation/trace/write/refresh；Command/Consumer/Job 显式带 operation identity。 |
| duplicate 边界 | duplicate 只读取 stored result surface；不重跑 domain transition、owner call 或 job scan。 |
| ownership | application 只编排；不拥有 Release/approval/Sandbox/Runtime/Observability truth。 |
| 后续承接 | Step 7 展开 service/port trait；Step 8 定义 command/query/result/envelope；Step 9 定义 orchestration flow；Step 10 定义 application disposition 与 state matrix。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-001~008`。 |

## 15. `infra` 对象契约：runtime configuration, adapter availability and local capability

`infra` 只承接 validated configuration、runtime composition、local store/cache capability 与 adapter availability。它不把配置值变成 domain policy，不保存 secret/body，不把“已装配”写成“owner contract ready”。具体语言、provider、transport、路径、数据库、缓存和进程模型均留待 `RUN-DDD-001~003` 与后续技术 authority 关闭后重开。

### 15.1 capability / 对象映射

| capability | 对象 | 主要责任 | 当前边界 |
|---|---|---|---|
| 配置身份与 profile 选择 | `RunnerRuntimeConfig` | 保存已校验 config/profile/store/adapter refs | 不保存 raw config、secret、URL、topic、路径或数值默认值 |
| runtime 装配 | `RunnerRuntimeBuilderState` | 记录 config validation、adapter slots、store/cache capabilities 和 build state | Ready 前不得暴露 facade；不创建实现事实 |
| 外部/平台 adapter 可用性 | `RunnerAdapterAvailabilityMarker` | 表达 enabled/disabled/degraded/unavailable/blocked | availability 不等 owner readiness 或 success |
| local repository/cache 能力 | `RunnerStoreCapabilityState`、`RunnerMaterialCacheCapabilityState` | 表达 transaction/expected-version/quarantine/promotion/protection 能力是否可用 | 不锁定 backend、schema、路径或 atomic primitive |

### 15.2 infra-local refs and state carriers

```rust
/// References one validated Runner runtime configuration.
pub struct RunnerInfraConfigRef(pub String);

/// References a selected runtime profile without carrying profile contents.
pub struct RunnerRuntimeProfileRef(pub String);

/// References one logical local store or cache configuration.
pub struct RunnerStoreConfigRef(pub String);

/// References one validated adapter configuration.
pub struct RunnerAdapterConfigRef(pub String);

/// Ordered unique adapter configuration references.
pub struct RunnerAdapterConfigRefSet(pub Vec<RunnerAdapterConfigRef>);

/// Redacted configuration or capability issue reference.
pub struct RunnerConfigIssueRef(pub String);

/// Ordered unique configuration issue references.
pub struct RunnerConfigIssueRefSet(pub Vec<RunnerConfigIssueRef>);

/// Logical infra adapter slots; no product or transport is implied.
pub enum RunnerInfraAdapterSlot {
    /// Local Runner truth and intent store.
    StateStore,
    /// Local projection/read-model store.
    ProjectionStore,
    /// Local idempotency and stored-result store.
    ResultStore,
    /// Material cache/quarantine provider.
    MaterialCache,
    /// Context resolution adapter.
    ContextRead,
    /// Release and authority read adapter.
    ReleaseAuthorityRead,
    /// Material locator/manifest/transfer adapter.
    MaterialSource,
    /// Integrity and platform qualification adapter.
    IntegrityVerifier,
    /// Sandbox request/control/lease/cleanup adapter.
    SandboxRun,
    /// Runtime safe status/result adapter.
    RuntimeStatus,
    /// Platform resource and connectivity observation adapter.
    PlatformResource,
    /// Bounded diagnostic read adapter.
    DiagnosticRead,
    /// Observability handoff adapter.
    ObservabilityHandoff,
    /// Conditional archive reference adapter.
    ArchiveReference,
    /// Mandatory redaction adapter.
    Redaction,
    /// Clock/connectivity observation adapter.
    ClockConnectivity,
    /// Local opaque id generator.
    IdGenerator,
}

/// Availability of one logical adapter or store slot.
pub enum RunnerAdapterAvailabilityState {
    /// Configured and locally callable under its declared semantic contract.
    Enabled,
    /// Intentionally disabled by validated configuration.
    DisabledByConfig,
    /// Callable but results must be surfaced as degraded or partial.
    Degraded,
    /// Configured but currently unavailable.
    Unavailable,
    /// Contract/readiness is not established; no positive call is allowed.
    Blocked,
}

/// Runtime composition lifecycle.
pub enum RunnerRuntimeBuildState {
    /// Builder has not started.
    NotStarted,
    /// Configuration and capability references are being validated.
    ValidatingConfig,
    /// Stores, adapters, and services are being assembled.
    Assembling,
    /// Runtime may expose the application facade subject to per-port readiness.
    Ready,
    /// Runtime failed before a usable facade was produced.
    Failed,
}

/// Logical local store categories.
pub enum RunnerStoreKind {
    /// Runner-owned local truth, intent, guard, and recovery store.
    LocalTruth,
    /// Read projection and composed-section store.
    Projection,
    /// Idempotency and stored-result store.
    Result,
    /// Recovery/checkpoint/operation journal store.
    Operation,
}
```

| carrier | 来源 | 约束 |
|---|---|---|
| `RunnerInfraConfigRef` / `RunnerRuntimeProfileRef` | validated config loader / runtime selection | body-free；不携带 raw map、secret 或环境变量 |
| `RunnerStoreConfigRef` | composition boundary | 只表示逻辑 store 选择；不代表 backend 已可用 |
| `RunnerAdapterConfigRef` | validated adapter config | 不保存 endpoint、credential、topic、path 或 retry/timeout 数值 |
| `RunnerInfraAdapterSlot` | Step 5/02 required ports | slot 名不等 exact SDK client；不得新增 owner truth |
| `RunnerAdapterAvailabilityState` | config validation、factory、readiness probe | `Blocked/Unavailable/Degraded` 不得降级为 Enabled；不改变 domain state |
| `RunnerRuntimeBuildState` | runtime builder | `Ready` 仅表示 composition 完成；每个 port 仍须报告 readiness |
| `RunnerStoreKind` | local ownership design | logical separation only；不选择数据库/文件/缓存产品 |

### 15.3 `RunnerRuntimeConfig`

```rust
/// Body-free validated configuration references used for runtime assembly.
pub struct RunnerRuntimeConfig {
    /// Selected runtime profile.
    pub profile_ref: RunnerRuntimeProfileRef,
    /// Validated configuration identity.
    pub config_ref: RunnerInfraConfigRef,
    /// Local store configuration references.
    pub state_store_ref: RunnerStoreConfigRef,
    pub projection_store_ref: RunnerStoreConfigRef,
    pub result_store_ref: RunnerStoreConfigRef,
    pub operation_store_ref: RunnerStoreConfigRef,
    /// External/platform adapter configuration references.
    pub adapter_refs: RunnerAdapterConfigRefSet,
    /// Optional conditional archive adapter reference.
    pub archive_adapter_ref: Option<RunnerAdapterConfigRef>,
    /// Validated presentation capability reference.
    pub presentation_capability_ref: Option<RunnerAdapterConfigRef>,
    /// Redacted issues found during validation.
    pub issue_refs: RunnerConfigIssueRefSet,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `profile_ref` | deployment/runtime selection | 只影响 adapter/store/job/presentation assembly；不得改变 ownership/invariants |
| `config_ref` | config loader/validator | 必须回指已校验来源；不得持有 config body |
| `state_store_ref` | validated local store group | 必须支持声明的 local truth/expected-version guarantees，能力不足则 blocked |
| `projection_store_ref` | validated local store group | 只保存 safe projection/read sections；不成为 truth owner |
| `result_store_ref` | validated local store group | 必须支持 idempotency/stored result lookup；缺失时 duplicate path blocked |
| `operation_store_ref` | validated local store group | claim/checkpoint/recovery state；不推进 owner cursor |
| `adapter_refs` | validated port-specific configuration | 每个 ref 只用于 composition；exact public SDK binding 留 Step 7/authority |
| `archive_adapter_ref` | optional validated config | 外围能力；不可进入 approved/qualified/running/cleanup success gate |
| `presentation_capability_ref` | platform/product capability resolver | 只影响 display/degradation；不改变 command semantics |
| `issue_refs` | config validator | redacted typed issues；不保存 secret/raw error |

| 函数签名 | 作用 | 约束 / 副作用 |
|---|---|---|
| `pub fn assert_invariant_safe(&self) -> Result<(), InfraError>` | 校验 config 不改变 domain invariant | 只检查 refs、禁用组合和 capability requirements；不访问 owner |
| `pub fn adapter_is_configured(&self, slot: RunnerInfraAdapterSlot) -> bool` | 判断是否有对应 adapter ref | 只表达配置存在，不宣称 readiness |
| `pub fn archive_enabled(&self) -> bool` | 判断 archive adapter 是否被配置 | `Some` 不等 available、safe restore 或 core-path participation |
| `pub fn all_store_refs(&self) -> Vec<RunnerStoreConfigRef>` | 返回逻辑 store refs | 纯组装；不泄露 backend/path |

| 工厂函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_validated_refs(profile_ref: RunnerRuntimeProfileRef, config_ref: RunnerInfraConfigRef, state_store_ref: RunnerStoreConfigRef, projection_store_ref: RunnerStoreConfigRef, result_store_ref: RunnerStoreConfigRef, operation_store_ref: RunnerStoreConfigRef, adapter_refs: RunnerAdapterConfigRefSet, archive_adapter_ref: Option<RunnerAdapterConfigRef>, presentation_capability_ref: Option<RunnerAdapterConfigRef>, issue_refs: RunnerConfigIssueRefSet) -> Result<Self, InfraError>` | 构造 body-free runtime config | refs 必须非空且去重；不接收 raw config map/secret |

### 15.4 `RunnerAdapterAvailabilityMarker`

```rust
/// Records availability and readiness of one logical adapter slot.
pub struct RunnerAdapterAvailabilityMarker {
    /// Adapter slot being described.
    pub slot: RunnerInfraAdapterSlot,
    /// Validated adapter config reference.
    pub config_ref: RunnerAdapterConfigRef,
    /// Current availability state.
    pub state: RunnerAdapterAvailabilityState,
    /// Redacted issue when degraded, unavailable, or blocked.
    pub issue_ref: Option<RunnerConfigIssueRef>,
    /// Semantic capability marker, if formally known.
    pub capability: AdapterCapabilityMarker,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `slot` | runtime assembly plan | 只能使用已定义 logical slot；不作为 routing key |
| `config_ref` | `RunnerRuntimeConfig` | 不保存 adapter instance/config body |
| `state` | validator/factory/readiness | `Blocked/Unavailable/Degraded` 必须显式传播到 read/job result |
| `issue_ref` | redacted validation/availability result | 不保存 raw SDK/HTTP/OS error |
| `capability` | formal adapter capability negotiation | unknown capability 不得默认支持；不等 owner approval |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn is_usable(&self) -> bool` | 判断是否可被 application 调用 | 只有 Enabled 或明确允许的 Degraded 返回 true；Blocked/Unavailable=false |
| `pub fn requires_degraded_surface(&self) -> bool` | 判断结果是否需标 degraded | Degraded/Unavailable/部分 capability=true；纯函数 |
| `pub fn mark_degraded(&mut self, issue_ref: RunnerConfigIssueRef) -> Result<(), InfraError>` | 标记可调用但降级 | 不改变 domain truth/owner state |
| `pub fn mark_unavailable(&mut self, issue_ref: RunnerConfigIssueRef) -> Result<(), InfraError>` | 标记暂不可用 | 后续调用返回 unavailable/unknown；不伪造成功 |
| `pub fn mark_blocked(&mut self, issue_ref: RunnerConfigIssueRef) -> Result<(), InfraError>` | 标记合同或技术 authority 未闭合 | 禁止正向 adapter call；保留 planned seam |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn enabled(slot: RunnerInfraAdapterSlot, config_ref: RunnerAdapterConfigRef, capability: AdapterCapabilityMarker) -> Result<Self, InfraError>` | 建立 enabled marker；不证明 owner contract readiness |
| `pub fn blocked(slot: RunnerInfraAdapterSlot, config_ref: RunnerAdapterConfigRef, issue_ref: RunnerConfigIssueRef) -> Result<Self, InfraError>` | 建立 blocked marker；用于 `RUN-UP-*` / `RUN-DDD-*` |

### 15.5 `RunnerRuntimeBuilderState`

```rust
/// Tracks runtime assembly before exposing a usable application facade.
pub struct RunnerRuntimeBuilderState {
    /// Runtime profile and config identity.
    pub profile_ref: RunnerRuntimeProfileRef,
    pub config_ref: RunnerInfraConfigRef,
    /// Current assembly state.
    pub state: RunnerRuntimeBuildState,
    /// Adapter availability markers.
    pub adapter_markers: Vec<RunnerAdapterAvailabilityMarker>,
    /// Local store capability markers.
    pub store_capabilities: Vec<RunnerStoreCapabilityState>,
    /// Redacted assembly issues.
    pub issue_refs: RunnerConfigIssueRefSet,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `profile_ref` / `config_ref` | `RunnerRuntimeConfig` | 只做 identity/trace；不复制 config body |
| `state` | builder transition | `NotStarted -> ValidatingConfig -> Assembling -> Ready` 或 `Failed`；Ready 后不回 Assembling |
| `adapter_markers` | slot validation/factory | slot+config ref 唯一；不保存 concrete client |
| `store_capabilities` | local provider capability probe | capability unknown -> blocked；不以 fake success 代替 |
| `issue_refs` | validator/builder | redacted；不得包含 secret/path/raw response |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn start_validation(&mut self) -> Result<(), InfraError>` | 开始配置校验 | 只允许 `NotStarted -> ValidatingConfig` |
| `pub fn start_assembly(&mut self) -> Result<(), InfraError>` | 开始组装 | 只允许无 blocking config/capability issue 时 `ValidatingConfig -> Assembling` |
| `pub fn record_adapter(&mut self, marker: RunnerAdapterAvailabilityMarker) -> Result<(), InfraError>` | 记录 adapter marker | 不保存 instance；重复 slot/config 显式冲突 |
| `pub fn record_store_capability(&mut self, capability: RunnerStoreCapabilityState) -> Result<(), InfraError>` | 记录 local store/cache capability | capability 不足时不得 mark ready |
| `pub fn mark_ready(&mut self) -> Result<(), InfraError>` | 对外暴露 facade 前完成 builder | 所需 slot/capability 未闭合时返回 error |
| `pub fn mark_failed(&mut self, issue_ref: RunnerConfigIssueRef) -> Result<(), InfraError>` | 记录装配失败 | 非 Ready 状态可进入 Failed；不 fallback 半装配 runtime |
| `pub fn can_expose_facade(&self) -> bool` | 判断能否给 entry/worker/operations 注入 facade | 只有 Ready 且无 blocking issue 为 true |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn for_config(config: &RunnerRuntimeConfig) -> Result<Self, InfraError>` | 从 validated config 建立 builder state；不创建 concrete adapter |

### 15.6 `RunnerStoreCapabilityState`

```rust
/// Describes logical local store capabilities without naming a backend.
pub struct RunnerStoreCapabilityState {
    /// Store capability identity.
    pub state_ref: InfraCapabilityStateRef,
    /// Logical store kind.
    pub kind: RunnerStoreKind,
    /// Selected store config reference.
    pub config_ref: RunnerStoreConfigRef,
    /// Availability marker.
    pub availability: RunnerAdapterAvailabilityMarker,
    /// Required semantic capabilities.
    pub transaction: CapabilityDisposition,
    pub expected_version: CapabilityDisposition,
    pub durable_reference: CapabilityDisposition,
    pub corruption_detection: CapabilityDisposition,
    /// Last local cursor marker, never an owner cursor.
    pub last_cursor: Option<LocalCursorRef>,
    /// Redacted failures.
    pub failure_refs: Vec<InfraFailureRef>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `state_ref` | infra capability factory | 不进入 public protocol |
| `kind` | runtime registry | logical kind 与 slot 必须匹配 |
| `config_ref` | runtime config | 不保存 backend/path/connection |
| `availability` | provider readiness | unavailable/blocked 不能伪装成 usable |
| `transaction` | provider capability result | 至少满足声明的 local transaction boundary，否则相关 command blocked |
| `expected_version` | store capability result | 缺失时禁止 stale worker 覆盖新 generation |
| `durable_reference` | store capability result | stored result/ref 闭环缺失时 duplicate path blocked |
| `corruption_detection` | provider capability result | unknown/corrupt 必须 fail-closed，不自动重建 truth |
| `last_cursor` | local store/job observation | 不等 owner event cursor/authority version |
| `failure_refs` | redacted infra mapping | 不保存 raw error/body |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn supports_required_boundary(&self) -> bool` | 判断是否满足本对象声明的最小能力 | 所有必需 capability=Supported 且 availability usable 才 true |
| `pub fn mark_unknown(&mut self, failure_ref: InfraFailureRef) -> Result<(), InfraError>` | 标 capability 不明 | 后续使用返回 blocked/unknown；不降级为 supported |
| `pub fn mark_corrupt(&mut self, failure_ref: InfraFailureRef) -> Result<(), InfraError>` | 标本地 store/cache 不可信 | 冻结相关 reads/writes；不自动删除/重建 truth |

### 15.7 `RunnerMaterialCacheCapabilityState`

```rust
/// Describes cache guarantees needed by acquisition and protection flows.
pub struct RunnerMaterialCacheCapabilityState {
    /// Cache capability identity.
    pub state_ref: InfraCapabilityStateRef,
    /// Cache config reference.
    pub config_ref: RunnerStoreConfigRef,
    /// Availability marker.
    pub availability: RunnerAdapterAvailabilityMarker,
    /// Quarantine/staging guarantee.
    pub quarantine: CapabilityDisposition,
    /// Atomic promotion from verified basis.
    pub promotion: CapabilityDisposition,
    /// Binding metadata persistence.
    pub binding_metadata: CapabilityDisposition,
    /// Protection reference persistence.
    pub protection_metadata: CapabilityDisposition,
    /// Safe release/eviction marker capability.
    pub safe_release_marker: CapabilityDisposition,
    /// Redacted cache/provider failures.
    pub failure_refs: Vec<InfraFailureRef>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `quarantine` | cache provider capability | transfer complete 必须先隔离；不以 file existence 代替 |
| `promotion` | cache provider + store transaction capability | promotion 只在 same binding/current verification 下允许 |
| `binding_metadata` | cache metadata capability | 缺 selection/source/digest/generation 不能 Qualified |
| `protection_metadata` | guard input store | 只存 refs；不复制 ProtectionState |
| `safe_release_marker` | local release capability | 只有 guard + owner/local receipt 才能 mark evicted |
| `availability` / `failure_refs` | provider readiness/error mapper | blocked/unknown 保持 fail-closed |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn can_quarantine(&self) -> bool` | 判断能否接受 transfer complete | quarantine + binding metadata + availability usable 才 true |
| `pub fn can_promote(&self) -> bool` | 判断能否执行 qualified promotion | promotion + transaction + protection boundary 可用才 true；不执行 promotion |
| `pub fn can_mark_evicted(&self) -> bool` | 判断能否记录 safe release | safe_release_marker 可用；仍需 domain guard/release basis |

### 15.8 infra 模块停审

| 审计项 | 结论 |
|---|---|
| 配置边界 | 只保存 validated refs、capability 和 issue refs；没有产品、路径、secret、URL、topic 或数值默认值。 |
| runtime 边界 | builder Ready 前不暴露 facade；Ready 不等 owner adapter ready，per-slot marker 仍需检查。 |
| local store/cache | transaction、expected-version、quarantine、promotion、protection、corruption guarantees 均有能力 carrier；backend 未选。 |
| ownership | infra state 不拥有 domain truth、owner body 或 evidence；adapter failure 仅转为 blocked/degraded/unknown。 |
| 后续承接 | Step 7 定义 14 个 semantic ports/adapter interface；Step 8 定义 readiness/error/capability envelope；Step 9 定义 composition、store、cache 和 adapter 处理流；Step 10 定义 build/availability/claim disposition。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-001~008` 与 `RUN-DDD-001~003`。 |

## 16. `entry` 对象契约：command/query intake and presentation boundary

`entry` 是所有 GUI、CLI、产品调用方和未来其他 inbound shell 的共同边界。入口对象只做 transport-neutral 解析、metadata/actor 校验、application context 构造和安全结果映射；不得直连 store、domain transition、SDK、OS API、Sandbox backend 或私有 owner 实现。具体 HTTP/RPC/desktop/CLI transport 在技术 authority 关闭后再绑定。

### 16.1 capability / 对象映射

| capability | 对象 | 责任 | 禁止事项 |
|---|---|---|---|
| Command intake | `RunnerCommandEntry` | 解析 command name、actor、metadata、idempotency 和 trace | 不保存 request body；不直接调用 adapter |
| Query intake | `RunnerQueryEntry` | 解析 query name、actor、visibility/page metadata 和 trace | 不携带 write idempotency；不触发 refresh |
| handler result mapping | `RunnerHandlerResult` | 映射 accepted/rejected/not-visible/degraded/unknown surface | 不把 accepted request 映射成 running/success |
| 入口注册 | `RunnerEntryRegistryState` | 记录 logical command/query entry refs | 不固化 path、method、host、auth 或 shell 技术 |

### 16.2 entry-local carrier 与状态

```rust
/// References one transport-neutral Runner entry.
pub struct RunnerEntryRef(pub String);

/// Redacted validation issue at the entry boundary.
pub struct RunnerEntryIssueRef(pub String);

/// Ordered unique entry issue references.
pub struct RunnerEntryIssueRefSet(pub Vec<RunnerEntryIssueRef>);

/// Classifies the two synchronous entry families.
pub enum RunnerEntryKind {
    /// A command that may write local state or submit one owner request.
    Command,
    /// A read-only query or read-model request.
    Query,
}

/// Names a command without carrying its body or transport route.
pub struct RunnerCommandName(pub String);

/// Names a query without carrying its body or transport route.
pub struct RunnerQueryName(pub String);

/// Handler disposition before a transport-specific response is built.
pub enum RunnerHandlerDisposition {
    /// Application returned an explicit command result or visible query surface.
    Accepted,
    /// Entry validation or application contract rejected the request.
    Rejected,
    /// Query was denied or unavailable under formal visibility rules.
    NotVisible,
    /// Query returned a safe but partial/degraded surface.
    Degraded,
    /// A write/owner result is ambiguous and requires reconciliation.
    Unknown,
}

/// Lifecycle of one entry invocation.
pub enum RunnerEntryState {
    /// Input has not passed boundary validation.
    Received,
    /// Metadata and actor/context checks are in progress.
    Validating,
    /// Application service invocation is permitted.
    Dispatching,
    /// A safe result surface was produced.
    Completed,
    /// The entry was rejected before or during dispatch.
    Rejected,
}
```

| 类型 | 来源 | 约束 |
|---|---|---|
| `RunnerEntryRef` | entry/runtime assembly | 不进入 domain truth 或 owner protocol |
| `RunnerEntryIssueRef` | schema/actor/metadata validator | body-free；不保存 request、credential 或 transport body |
| `RunnerCommandName` / `RunnerQueryName` | 02 固定 API 名称 | 必须与 Step 8/9 对齐；不得用自由 route label 替代 |
| `RunnerHandlerDisposition` | application result mapping | Accepted 不等 owner success/running；Unknown 不能自动 replay |
| `RunnerEntryState` | entry transition | 只表示本次 intake 生命周期，不覆盖 domain 状态 |

### 16.3 `RunnerCommandEntry`

```rust
/// Validated command intake before application dispatch.
pub struct RunnerCommandEntry {
    /// Entry identity.
    pub entry_ref: RunnerEntryRef,
    /// Logical command name.
    pub command_name: RunnerCommandName,
    /// Application operation identity.
    pub operation_name: RunnerOperationName,
    /// Trusted actor/context injected by the inbound boundary.
    pub actor_context: ActorContext,
    /// Command metadata carrying correlation/idempotency/expected basis.
    pub metadata: RunnerCommandMetadata,
    /// Normalized idempotency key.
    pub idempotency_key: RunnerOperationIdempotencyKey,
    /// Core trace reference.
    pub trace_ref: TraceRef,
    /// Current intake state.
    pub state: RunnerEntryState,
    /// Redacted validation issues.
    pub issue_refs: RunnerEntryIssueRefSet,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `entry_ref` | entry assembly | 不等 operation/result id |
| `command_name` | 02 Command catalog | 不携带 input body；名称必须稳定 |
| `operation_name` | application mapping | 与 command flow/idempotency identity 一致 |
| `actor_context` | trusted product/CLI/API boundary | entry 不做登录认证，不从本地角色补齐 |
| `metadata` | command envelope | 必须含 correlation、idempotency、issued-at 和 expected binding 所需字段；具体 schema 留 Step 8 |
| `idempotency_key` | metadata normalization | 缺失或冲突则 rejected；不得用 run/PID/route 代替 |
| `trace_ref` | metadata | body-free；不等 result ref |
| `state` | entry transition | `Received -> Validating -> Dispatching -> Completed/Rejected` |
| `issue_refs` | validator | accepted/dispatching 必须为空或仅非阻塞 marker；不保存 body |

| 函数签名 | 作用 | 约束 / 副作用 |
|---|---|---|
| `pub fn from_inbound(entry_ref: RunnerEntryRef, command_name: RunnerCommandName, operation_name: RunnerOperationName, actor_context: ActorContext, metadata: RunnerCommandMetadata, key: RunnerOperationIdempotencyKey, trace_ref: TraceRef) -> Result<Self, EntryError>` | 构造 command entry | 只做结构校验；不调用 application/adapter |
| `pub fn begin_validation(&mut self) -> Result<(), EntryError>` | 开始 command boundary 校验 | 仅 `Received -> Validating`；不 reserve idempotency、不调用 application/adapter |
| `pub fn assert_metadata_complete(&self) -> Result<(), EntryError>` | 校验 actor/trace/idempotency/expected basis | 缺失则 rejected；不猜默认值 |
| `pub fn to_operation_context(&self) -> Result<RunnerOperationContext, EntryError>` | 构造 application command context | 必须 channel=Command；不执行 service |
| `pub fn begin_dispatch(&mut self) -> Result<(), EntryError>` | 进入 application dispatch | 仅 `Validating -> Dispatching`；issue 未闭合则拒绝 |
| `pub fn complete(&mut self, result: &RunnerHandlerResult) -> Result<(), EntryError>` | 在安全 handler surface 已构造后结束 invocation | 仅 `Dispatching -> Completed`；entry_ref 必须一致；只更新 entry state，不解释 application/domain/owner 成功 |
| `pub fn reject(&mut self, issue_ref: RunnerEntryIssueRef) -> Result<RunnerHandlerResult, EntryError>` | 构造边界拒绝结果 | `Received/Validating -> Rejected`；不 reserve idempotency、不调用 owner |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn receive(entry_ref: RunnerEntryRef, command_name: RunnerCommandName, operation_name: RunnerOperationName, actor_context: ActorContext, metadata: RunnerCommandMetadata, key: RunnerOperationIdempotencyKey, trace_ref: TraceRef) -> Result<Self, EntryError>` | 建立 `Received` command entry；禁止携带 raw request body |

### 16.4 `RunnerQueryEntry`

```rust
/// Validated read-only query intake before application query dispatch.
pub struct RunnerQueryEntry {
    /// Entry identity.
    pub entry_ref: RunnerEntryRef,
    /// Logical query name.
    pub query_name: RunnerQueryName,
    /// Application operation identity.
    pub operation_name: RunnerOperationName,
    /// Trusted actor/context.
    pub actor_context: ActorContext,
    /// Query metadata for visibility, page, and trace.
    pub metadata: RunnerQueryMetadata,
    /// Core trace reference.
    pub trace_ref: TraceRef,
    /// Optional bounded page request.
    pub page_request: Option<RunnerPageRequest>,
    /// Current intake state.
    pub state: RunnerEntryState,
    /// Redacted validation issues.
    pub issue_refs: RunnerEntryIssueRefSet,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `query_name` | 02 Query catalog | 不携带 query body；名称必须稳定 |
| `operation_name` | application query mapping | 与 Query flow 一致；不参与 idempotency |
| `actor_context` | trusted boundary | visibility 解析失败不得补默认 actor/scope |
| `metadata` | query envelope | 只含 query/trace/page/visibility 输入；不得携带 write key |
| `trace_ref` | metadata | 只用于关联；query 不追加业务 audit/outbox |
| `page_request` | query input/validated page marker | bounded；不得由 transport 参数直接绕过上限 |
| `state` | entry transition | query 入口也不能在 render 时隐式 refresh |
| `issue_refs` | validator | denied/degraded 以 marker 表达，不保存 body |

| 函数签名 | 作用 | 约束 / 副作用 |
|---|---|---|
| `pub fn from_inbound(entry_ref: RunnerEntryRef, query_name: RunnerQueryName, operation_name: RunnerOperationName, actor_context: ActorContext, metadata: RunnerQueryMetadata, trace_ref: TraceRef, page_request: Option<RunnerPageRequest>) -> Result<Self, EntryError>` | 构造 query entry | 只做结构校验；不读外部系统 |
| `pub fn begin_validation(&mut self) -> Result<(), EntryError>` | 开始 query boundary 校验 | 仅 `Received -> Validating`；不创建 idempotency、不读 repository/owner |
| `pub fn assert_query_metadata_complete(&self) -> Result<(), EntryError>` | 校验 actor/metadata/trace/page | 缺失则 rejected；不创建 selection/refresh |
| `pub fn assert_no_idempotency(&self) -> Result<(), EntryError>` | 防止 query 携带写 key | 发现 command key/operation identity 即 rejected |
| `pub fn to_operation_context(&self) -> Result<RunnerOperationContext, EntryError>` | 构造 query context | channel=Query；idempotency=None；no-write |
| `pub fn begin_dispatch(&mut self) -> Result<(), EntryError>` | 进入 query service | 仅 `Validating -> Dispatching`；不触发 refresh |
| `pub fn complete(&mut self, result: &RunnerHandlerResult) -> Result<(), EntryError>` | 在安全 query surface 已构造后结束 invocation | 仅 `Dispatching -> Completed`；entry_ref 必须一致；不把 Degraded/NotVisible 改写成业务失败或成功 |
| `pub fn reject(&mut self, issue_ref: RunnerEntryIssueRef) -> Result<RunnerHandlerResult, EntryError>` | 构造 query boundary rejection | `Received/Validating -> Rejected`；不探测隐藏对象、不调用 application/owner、不写任何 repository |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn receive(entry_ref: RunnerEntryRef, query_name: RunnerQueryName, operation_name: RunnerOperationName, actor_context: ActorContext, metadata: RunnerQueryMetadata, trace_ref: TraceRef, page_request: Option<RunnerPageRequest>) -> Result<Self, EntryError>` | 建立 `Received` query entry |

### 16.5 `RunnerHandlerResult`

```rust
/// Transport-neutral result shell before a product-specific response is built.
pub struct RunnerHandlerResult {
    /// Entry family that produced the result.
    pub entry_kind: RunnerEntryKind,
    /// Entry identity.
    pub entry_ref: RunnerEntryRef,
    /// Handler disposition.
    pub disposition: RunnerHandlerDisposition,
    /// Stored result ref for accepted command/consumer/job surface, if any.
    pub result_ref: Option<RunnerApplicationResultRef>,
    /// Visibility marker for query surface.
    pub visibility: Option<VisibilityPosture>,
    /// Optional degraded/unknown marker.
    pub degraded: Option<RunnerDegradedMarker>,
    /// Redacted issue refs.
    pub issue_refs: RunnerEntryIssueRefSet,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `entry_kind` / `entry_ref` | entry object | 与实际 handler 一致；不保存 route/path |
| `disposition` | application result mapper | `Unknown` 不等 failed/success；query `Degraded` 不等 command accepted |
| `result_ref` | stored result writer | Command/Job/Consumer duplicate path可有；Query 必须 None |
| `visibility` | formal visibility/redaction | Unknown/Unavailable 不返回 raw body |
| `degraded` | freshness/readiness/source composition | 只表达 surface 降级，不改 domain truth |
| `issue_refs` | redacted mapper | 不保存 request/owner response body |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn accepted_command(entry_ref: RunnerEntryRef, result_ref: RunnerApplicationResultRef) -> Result<Self, EntryError>` | 构造 command accepted shell | accepted 只表示 application result surface，不表示 running |
| `pub fn query_surface(entry_ref: RunnerEntryRef, visibility: VisibilityPosture, degraded: Option<RunnerDegradedMarker>) -> Result<Self, EntryError>` | 构造 query surface | result_ref=None；visibility marker 必须保留 |
| `pub fn rejected(entry_kind: RunnerEntryKind, entry_ref: RunnerEntryRef, issue_refs: RunnerEntryIssueRefSet) -> Result<Self, EntryError>` | 构造 rejected shell | 不调用 owner、不创建成功 result |
| `pub fn unknown(entry_ref: RunnerEntryRef, issue_ref: RunnerEntryIssueRef) -> Result<Self, EntryError>` | 构造 ambiguous write surface | disposition=Unknown；必须由 application 关联 RecoveryCase |
| `pub fn assert_no_body_leak(&self) -> Result<(), EntryError>` | 验证 result 仅有 refs/markers | 不访问 transport response |

### 16.6 `RunnerEntryRegistryState`

```rust
/// Records logical command/query entries without binding a transport technology.
pub struct RunnerEntryRegistryState {
    /// Registered command entry refs.
    pub command_entries: Vec<RunnerEntryRef>,
    /// Registered query entry refs.
    pub query_entries: Vec<RunnerEntryRef>,
    /// Redacted registry issues.
    pub issue_refs: RunnerEntryIssueRefSet,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn empty() -> Self` | 建立空 registry | 不创建 transport route |
| `pub fn register_command(&mut self, entry_ref: RunnerEntryRef) -> Result<(), EntryError>` | 注册 command entry | ordered unique；不绑定 path/method |
| `pub fn register_query(&mut self, entry_ref: RunnerEntryRef) -> Result<(), EntryError>` | 注册 query entry | ordered unique；不绑定 shell |
| `pub fn contains(&self, entry_ref: &RunnerEntryRef) -> bool` | 纯查找 | 不调用 handler |

### 16.7 entry 模块停审

| 审计项 | 结论 |
|---|---|
| 入口覆盖 | Command、Query、handler result、registry 四类稳定 carrier 已闭口。 |
| no-write | Query 不 reserve idempotency、不写 truth/projection、不 refresh/reconcile；render 继续 no-write。 |
| 多入口一致性 | GUI/CLI/product 仅是 transport/presentation mapping，均使用同一 operation context 和 application facade。 |
| 安全结果 | visibility/degraded/unknown marker 保留；不以 generic success/HTTP 200 替代语义。 |
| 技术中立 | 未写 HTTP path、RPC method、CLI flag、desktop framework、process/binary 或文件路径。 |
| 后续承接 | Step 7 定义 entry-to-application ports；Step 8 定义 DTO/error/result surface；Step 9 定义 handler validation/dispatch flow；Step 10 定义 entry disposition matrix。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-004/007/008` 与 `RUN-DDD-002`。 |

## 17. `worker` 对象契约：planned consumer, dedup and gap disposition

`worker` 只承接未来能够证明来源、schema、event id、dedup、ordering 和 visibility 的 owner 事实。当前 Artifact/Governance、Sandbox、Runtime、Observability 的 Runner-facing event seam 尚未闭合，因此对象必须支持 `Blocked/UnsupportedVersion/Gap/Unknown`，不得把消息到达、ACK 或 cursor 推成业务成功，也不得直接写 repository/domain truth。

### 17.1 capability / 对象映射

| capability | 对象 | 责任 | 当前状态 |
|---|---|---|---|
| consumer entry | `RunnerInboundConsumerEntry` | 保存 source family/event ref/schema/dedup/trace 和 readiness | planned/blocked |
| dedup/gap disposition | `RunnerConsumerItemDisposition` | accepted/duplicate/delayed/rejected/unsupported/gap/blocked | body-free result |
| controlled loop | `RunnerConsumerLoopState` | registered/running/delayed/stopped/failed | 不拥有业务 truth |
| projection handoff | application context/result refs | 将正式 owner fact交给 application | 不解析未知 payload、不直写 store |

### 17.2 worker-local carrier 与状态

```rust
/// References one planned worker entry.
pub struct RunnerWorkerEntryRef(pub String);

/// References an upstream event without embedding its payload.
pub struct OwnerEventRef(pub String);

/// Source event schema version.
pub struct OwnerEventSchemaVersion(pub String);

/// Redacted worker validation issue.
pub struct RunnerWorkerIssueRef(pub String);
pub struct RunnerWorkerIssueRefSet(pub Vec<RunnerWorkerIssueRef>);

/// Finite owner source families currently planned for Runner consumers.
pub enum RunnerConsumerSourceFamily {
    /// Release/version/authority change seam.
    ReleaseAuthority,
    /// Sandbox request/boundary/lease/cleanup lifecycle seam.
    SandboxLifecycle,
    /// Runtime execution/status/result seam.
    RuntimeStatus,
    /// Observability diagnostic/handoff seam.
    Handoff,
}

/// Consumer loop lifecycle.
pub enum RunnerConsumerLoopState {
    /// Entry registered but not consuming.
    Registered,
    /// Contract-ready consumer is processing items.
    Running,
    /// Delayed because source/readiness/backoff is unavailable.
    Delayed,
    /// Explicitly stopped by validated runtime composition.
    Stopped,
    /// Loop failed and requires operator/rebuild action.
    Failed,
}

/// Disposition for one candidate event item.
pub enum RunnerConsumerItemDisposition {
    /// Application accepted an owner fact and stored a safe projection/receipt.
    Accepted,
    /// Dedup found the same source event already handled.
    Duplicate,
    /// Item is delayed because the source or application seam is unavailable.
    Delayed,
    /// Item was rejected before application dispatch.
    Rejected,
    /// Event schema is not supported by the current contract.
    UnsupportedVersion,
    /// Ordering/cursor gap prevents safe application.
    GapDetected,
    /// Upstream contract is not ready; item was not parsed or applied.
    Blocked,
    /// Framing policy isolated an opaque transport item without storing payload in Runner state.
    Quarantined,
}
```

| 类型 | 来源 | 约束 |
|---|---|---|
| `RunnerWorkerEntryRef` | worker runtime assembly | 不进入 public protocol/domain truth |
| `OwnerEventRef` | formal event envelope metadata | body-free；不保存 event payload |
| `OwnerEventSchemaVersion` | formal envelope | unknown/unsupported 必须 blocked/unsupported，不猜 schema |
| `RunnerConsumerSourceFamily` | 02 planned consumer catalog | 不新增 outbound family；新增来源需回退 02 |
| `RunnerConsumerLoopState` | worker lifecycle | 不改变 selection/run/material truth |
| `RunnerConsumerItemDisposition` | application/worker mapper | Accepted 只表示 safe projection/receipt accepted，不等 owner execution success |

### 17.3 `RunnerInboundConsumerEntry`

```rust
/// Worker entry for one planned owner-fact consumer.
pub struct RunnerInboundConsumerEntry {
    /// Worker entry identity.
    pub entry_ref: RunnerWorkerEntryRef,
    /// Planned owner source family.
    pub source_family: RunnerConsumerSourceFamily,
    /// Source event identity.
    pub event_ref: OwnerEventRef,
    /// Subject reference represented by the event.
    pub subject_ref: OwnerSubjectRef,
    /// Event schema version.
    pub schema_version: OwnerEventSchemaVersion,
    /// Dedup identity derived from formal envelope metadata.
    pub dedup_key: RunnerOperationIdempotencyKey,
    /// Event source attribution/version marker.
    pub source_attribution: SourceAttribution,
    /// Core trace reference.
    pub trace_ref: TraceRef,
    /// Current loop state.
    pub loop_state: RunnerConsumerLoopState,
    /// Readiness/validation issues.
    pub issue_refs: RunnerWorkerIssueRefSet,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `entry_ref` | worker assembly | 不等 event id/cursor |
| `source_family` | planned consumer mapping | 仅四类；不把 generic bus topic 当 family |
| `event_ref` | formal event envelope | 缺失即 rejected/blocked；不保存 body |
| `subject_ref` | envelope safe subject | 只能是 typed owner/local ref；不复制 owner body |
| `schema_version` | formal envelope | unsupported 不解析 payload |
| `dedup_key` | formal event id/source version/owner key | 由 application normalizer 生成；不能由 payload hash 随意替代 |
| `source_attribution` | formal owner event | 必须含 owner/source/version/freshness/visibility |
| `trace_ref` | envelope metadata | 只关联；不作为 stored result id |
| `loop_state` | worker transition | stopped/failed/delayed 不消费 |
| `issue_refs` | readiness/validation | redacted；不保存 envelope body |

| 函数签名 | 作用 | 约束 / 副作用 |
|---|---|---|
| `pub fn from_envelope(entry_ref: RunnerWorkerEntryRef, source_family: RunnerConsumerSourceFamily, event_ref: OwnerEventRef, subject_ref: OwnerSubjectRef, schema_version: OwnerEventSchemaVersion, dedup_key: RunnerOperationIdempotencyKey, source_attribution: SourceAttribution, trace_ref: TraceRef) -> Result<Self, WorkerError>` | 从已校验 envelope 建立 entry | 只做 envelope structure check；不解析 event body |
| `pub fn assert_envelope_complete(&self) -> Result<(), WorkerError>` | 校验 event/ref/schema/dedup/source/trace | 缺失即 rejected；不猜默认 source/version |
| `pub fn to_operation_context(&self, operation_name: RunnerOperationName, actor: ActorContext) -> Result<RunnerOperationContext, WorkerError>` | 构造 inbound event context | readiness 不通过时只返回 blocked；不调用 application transition |
| `pub fn mark_delayed(&mut self, issue_ref: RunnerWorkerIssueRef) -> Result<(), WorkerError>` | 标记 source/application delayed | 不丢 event identity，不重放 |
| `pub fn block_unsupported(&mut self, issue_ref: RunnerWorkerIssueRef) -> Result<RunnerConsumerItemDisposition, WorkerError>` | 处理未闭合/未知合同 | 不解析 body、不写 projection |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn planned(entry_ref: RunnerWorkerEntryRef, source_family: RunnerConsumerSourceFamily, event_ref: OwnerEventRef, subject_ref: OwnerSubjectRef, schema_version: OwnerEventSchemaVersion, dedup_key: RunnerOperationIdempotencyKey, source_attribution: SourceAttribution, trace_ref: TraceRef) -> Result<Self, WorkerError>` | 建立 planned consumer entry；当前 readiness 默认由 marker 表达，不能宣称 ready |

### 17.4 `RunnerConsumerItemResult`

```rust
/// Body-free result for one planned consumer item.
pub struct RunnerConsumerItemResult {
    /// Worker entry that produced the result.
    pub entry_ref: RunnerWorkerEntryRef,
    /// Final item disposition.
    pub disposition: RunnerConsumerItemDisposition,
    /// Event identity when applicable.
    pub event_ref: Option<OwnerEventRef>,
    /// Application stored result/receipt reference.
    pub result_ref: Option<RunnerApplicationResultRef>,
    /// Recovery case when a gap or ambiguous outcome freezes state.
    pub recovery_case_ref: Option<RecoveryCaseId>,
    /// Redacted issue refs.
    pub issue_refs: RunnerWorkerIssueRefSet,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn accepted(entry_ref: RunnerWorkerEntryRef, event_ref: OwnerEventRef, result_ref: RunnerApplicationResultRef) -> Result<Self, WorkerError>` | 构造 accepted consumer result | 只表示 application safe projection/receipt accepted |
| `pub fn duplicate(entry_ref: RunnerWorkerEntryRef, event_ref: OwnerEventRef, result_ref: Option<RunnerApplicationResultRef>) -> Result<Self, WorkerError>` | 构造 dedup result | 不重跑 domain transition；stored result 缺失时报告 consistency issue |
| `pub fn delayed(entry_ref: RunnerWorkerEntryRef, event_ref: Option<OwnerEventRef>, issue_ref: RunnerWorkerIssueRef) -> Result<Self, WorkerError>` | 构造 future delayed result | 只表示 source/application seam 暂不可用；当前 positive consumer boundary 不调用，不解析或保存 payload |
| `pub fn rejected(entry_ref: RunnerWorkerEntryRef, event_ref: Option<OwnerEventRef>, issue_ref: RunnerWorkerIssueRef) -> Result<Self, WorkerError>` | 构造 header rejection | 不猜缺失identity、不解析payload |
| `pub fn unsupported(entry_ref: RunnerWorkerEntryRef, event_ref: Option<OwnerEventRef>, issue_ref: RunnerWorkerIssueRef) -> Result<Self, WorkerError>` | 构造 unsupported-version result | 不调用consumer facade、不保存applied marker |
| `pub fn gap(entry_ref: RunnerWorkerEntryRef, event_ref: OwnerEventRef, recovery_case_ref: RecoveryCaseId, issue_ref: RunnerWorkerIssueRef) -> Result<Self, WorkerError>` | 构造 gap disposition | local projection freeze；不推进 owner cursor |
| `pub fn blocked(entry_ref: RunnerWorkerEntryRef, event_ref: Option<OwnerEventRef>, issue_ref: RunnerWorkerIssueRef) -> Result<Self, WorkerError>` | 构造 readiness blocked | 不解析/保存 payload |
| `pub fn quarantined(entry_ref: RunnerWorkerEntryRef, event_ref: Option<OwnerEventRef>, issue_ref: RunnerWorkerIssueRef) -> Result<Self, WorkerError>` | 构造 opaque isolation result | 仅在transport boundary已完成正式isolation且Runner不保存payload时可用；当前无isolation port故不可达 |
| `pub fn assert_no_payload_body(&self) -> Result<(), WorkerError>` | 验证 result 只有 refs/markers/issues | 纯检查 |

### 17.5 `RunnerConsumerLoop`

```rust
/// Tracks one consumer loop independently from owner business state.
pub struct RunnerConsumerLoop {
    /// Loop identity.
    pub entry_ref: RunnerWorkerEntryRef,
    /// Source family consumed by this loop.
    pub source_family: RunnerConsumerSourceFamily,
    /// Current loop state.
    pub state: RunnerConsumerLoopState,
    /// Last safely handled event reference.
    pub last_event_ref: Option<OwnerEventRef>,
    /// Last local dedup marker.
    pub last_dedup_key: Option<RunnerOperationIdempotencyKey>,
    /// Recovery case for gap/unknown loop state.
    pub recovery_case_ref: Option<RecoveryCaseId>,
    /// Redacted loop issues.
    pub issue_refs: RunnerWorkerIssueRefSet,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn start(&mut self) -> Result<(), WorkerError>` | Registered/Delayed→Running | 必须重新通过 contract/readiness gate；不代表 owner event stream ready；当前 positive consumer contract 未授权，因此该迁移 reserved/unreachable |
| `pub fn delay(&mut self, issue_ref: RunnerWorkerIssueRef) -> Result<(), WorkerError>` | 标记 delayed | `Registered/Running -> Delayed`；不丢未确认 event；不自动 replay side effect |
| `pub fn stop(&mut self) -> Result<(), WorkerError>` | 停止消费 | `Registered/Running/Delayed -> Stopped`；不修改 projections/truth |
| `pub fn fail(&mut self, issue_ref: RunnerWorkerIssueRef) -> Result<(), WorkerError>` | 记录 loop 级不可继续故障 | `Registered/Running/Delayed -> Failed`；保留 redacted issue；不得把 item rejection 或 owner failure擅自升级为 loop failure |
| `pub fn record_item(&mut self, result: &RunnerConsumerItemResult) -> Result<(), WorkerError>` | 记录 safe item marker | 只记录 refs/disposition；gap/unknown 关联 recovery |

| 工厂函数签名 | 作用 |
|---|---|
| `pub fn registered(entry_ref: RunnerWorkerEntryRef, source_family: RunnerConsumerSourceFamily) -> Self` | 建立 registered loop；不创建 subscription/transport |

worker 不变量：

- 当前四类 consumer 必须保持 `planned/blocked`，未闭合 envelope、client、source version、dedup/order/gap 合同时不解析 payload。
- Consumer 只能把 owner 已提交事实交给 application 更新 safe projection/ref/receipt/stale marker；不得创建 Release、approval、execution、boundary、lease、cleanup 或 evidence truth。
- duplicate 只读取 stored result/receipt surface；gap/乱序进入 RecoveryCase，不以“最后到达”覆盖当前 projection。

### 17.6 worker 模块停审

| 审计项 | 结论 |
|---|---|
| 对象覆盖 | planned consumer entry、item disposition/result、loop state 已闭合。 |
| readiness | `RUN-UP-001/002/003/004/005/008` 仍使正向 consumer blocked；没有伪造 event schema、topic、cursor 或 client。 |
| ownership | worker 不拥有 truth、不直写 store、不把 ACK/消息到达当成功。 |
| 后续承接 | Step 7 定义 consumer port/readiness；Step 8 定义 envelope/schema/error；Step 9 定义 dedup/gap/reconcile flow；Step 10 定义 loop/item disposition matrix。 |
| 模块状态 | `completed_with_upstream_blockers`。 |

## 18. `operations` 对象契约：job entry, claim, checkpoint and report posture

Operations jobs 是显式的长时、刷新、淘汰评估、恢复和诊断入口，不是隐含在 Query/render/reconnect 中的副作用。Job 只负责本地工作、checkpoint、report 和 blocked/partial/unknown posture；不修复 owner truth，不把 job success 映射为 approved/qualified/running/cleaned/evidence。

### 18.1 capability / 对象映射

| capability | 对象 | 责任 |
|---|---|---|
| job entry/registration | `RunnerOperationsJobEntry` | 记录 job kind、operation identity、run/claim/trace metadata |
| claim/checkpoint | `RunnerJobClaim`、`RunnerJobCheckpoint` | 防止重复 worker、支持安全恢复；不推进 owner cursor |
| result/report | `RunnerOperationsJobResult`、`RunnerJobReportAssembly` | body-free refs/counters/disposition；duplicate 读 stored report |
| registry | `RunnerJobRegistryState` | 记录启用/禁用 job kind；不创建 schedule/product事实 |

### 18.2 job-local carrier 与状态

```rust
/// References one operations job entry.
pub struct RunnerJobEntryRef(pub String);

/// Finite operations jobs fixed by the HLD.
pub enum RunnerOperationsJobKind {
    /// Acquire, quarantine, verify, and qualify one material task.
    AcquireAndVerifyMaterial,
    /// Evaluate eviction candidates without deleting material.
    EvaluateCacheEviction,
    /// Reconcile frozen local state against formal owner reads.
    ReconcileRunnerState,
    /// Refresh safe output and failure diagnosis.
    RefreshSafeDiagnosis,
    /// Refresh explicitly visible source projections.
    RefreshVisibleSources,
}

/// Job entry lifecycle.
pub enum RunnerJobEntryState {
    /// Job metadata is registered but not claimed.
    Registered,
    /// A worker owns the local claim and is executing bounded work.
    Running,
    /// Job is delayed by unavailable capability, cancellation, or backoff policy.
    Delayed,
    /// Job reached a local terminal report posture.
    Completed,
    /// Job failed before a trustworthy report could be produced.
    Failed,
    /// Job was rejected before execution due to invalid input or disabled kind.
    Rejected,
}

/// Public local job disposition; not an owner result.
pub enum RunnerJobDisposition {
    /// All declared local items completed without a blocking failure.
    Completed,
    /// Some local items changed while others were blocked/failed.
    Partial,
    /// The job produced a trustworthy local report but a required contract,
    /// capability, or source prevented the declared work from proceeding.
    Blocked,
    /// No trustworthy completion posture was produced.
    Failed,
    /// Same idempotency/digest returned a stored report.
    DuplicateReplayed,
    /// Job did not enter application execution.
    Rejected,
    /// Job could not determine a safe local outcome and opened recovery.
    Unknown,
}

/// Local claim state, separate from owner leases.
pub enum RunnerJobClaimState {
    /// No local worker claim exists.
    Unclaimed,
    /// A local worker claim is active.
    Claimed,
    /// Claim was released after a safe local stop/checkpoint.
    Released,
    /// Claim expired or became uncertain; recovery is required.
    Unknown,
}
```

| 类型 | 来源 | 约束 |
|---|---|---|
| `RunnerOperationsJobKind` | 02 固定 5 Jobs | 不新增隐藏 job；job kind 不等 command |
| `RunnerJobEntryState` | operations runner | 只描述本地 job；不等 owner lifecycle |
| `RunnerJobDisposition` | application report/result | Completed/Partial/Failed 不表示 approved/running/evidence |
| `RunnerJobClaimState` | local operation store | 不等 Sandbox lease、owner allocation 或 process lock |

### 18.3 `RunnerOperationsJobEntry`

```rust
/// Operations job entry before application dispatch.
pub struct RunnerOperationsJobEntry {
    /// Job entry identity.
    pub entry_ref: RunnerJobEntryRef,
    /// Fixed job kind.
    pub job_kind: RunnerOperationsJobKind,
    /// Application operation identity.
    pub operation_name: RunnerOperationName,
    /// Local job run reference.
    pub job_run_ref: JobRunRef,
    /// Job idempotency identity.
    pub idempotency_key: RunnerOperationIdempotencyKey,
    /// Operator/system actor context.
    pub actor_context: ActorContext,
    /// Trace reference.
    pub trace_ref: TraceRef,
    /// Optional exact scope/page input marker.
    pub scope_ref: Option<RunnerScopeRef>,
    pub page_request: Option<RunnerPageRequest>,
    /// Entry state and validation issues.
    pub state: RunnerJobEntryState,
    pub issue_refs: RunnerJobIssueRefSet,
    /// Recovery case when entry completion or terminal persistence is ambiguous.
    pub recovery_case_ref: Option<RecoveryCaseId>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `entry_ref` | operations assembly | 不等 job run/result id |
| `job_kind` | explicit trigger/registry | 只能是 5 个正式 job；不由 query name 推导 |
| `operation_name` | application mapping | 与 Step 8/9 job flow 一致 |
| `job_run_ref` | job metadata/id generator | 不替代 idempotency/result ref |
| `idempotency_key` | job metadata | 缺失/冲突则 rejected；duplicate 必须读 stored report |
| `actor_context` | system/operator boundary | 不做登录认证；scope 由 formal input/resolver 提供 |
| `trace_ref` | job metadata | report/handoff correlation；不等 evidence |
| `scope_ref` / `page_request` | explicit job input | bounded；不从 config/path/default branch 推导 |
| `state` / `issue_refs` / `recovery_case_ref` | job transition/validator | body-free；Unknown result必须关联 recovery；不保存 request/artifact/report body |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn from_metadata(entry_ref: RunnerJobEntryRef, job_kind: RunnerOperationsJobKind, operation_name: RunnerOperationName, job_run_ref: JobRunRef, idempotency_key: RunnerOperationIdempotencyKey, actor_context: ActorContext, trace_ref: TraceRef, scope_ref: Option<RunnerScopeRef>, page_request: Option<RunnerPageRequest>) -> Result<Self, JobError>` | 构造 job entry | 只结构校验；不运行 job |
| `pub fn to_operation_context(&self) -> Result<RunnerOperationContext, JobError>` | 构造 OperationsJob context | channel=OperationsJob；key/run 必须 Some |
| `pub fn start_report(&self) -> Result<RunnerJobReportAssembly, JobError>` | 建立 report accumulator | 不保存 report、不访问 adapter |
| `pub fn mark_running(&mut self) -> Result<(), JobError>` | Registered/Delayed→Running | claim/readiness 通过后才允许 |
| `pub fn mark_delayed(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | 标记 delayed | `Registered/Running -> Delayed`；不执行危险副作用、不丢 checkpoint |
| `pub fn mark_completed(&mut self, report: &RunnerJobReport) -> Result<(), JobError>` | 在可信 terminal report 已组装后结束 entry | 仅 `Running/Delayed -> Completed`；report 的 job kind/run ref必须匹配；允许 report disposition为 Completed/Partial/Blocked，均不表示 owner 成功 |
| `pub fn mark_failed(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | 标记 failed | `Registered/Running/Delayed -> Failed`；不补造 report/owner success |
| `pub fn reject(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | pre-execution rejection | 仅 `Registered -> Rejected`；不创建 claim/checkpoint、不调用 application/adapter |
| `pub fn mark_unknown(&mut self, recovery_case_ref: RecoveryCaseId, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | 记录 terminal persistence/claim outcome歧义 | `Running/Delayed -> Failed`并保存 recovery ref与 issue；public result使用 `RunnerJobDisposition::Unknown`；禁止自动重跑 |

### 18.4 `RunnerJobClaim`

```rust
/// Local exclusive claim for one job run; never an owner lease.
pub struct RunnerJobClaim {
    /// Job run being claimed.
    pub job_run_ref: JobRunRef,
    /// Local claim identity.
    pub claim_ref: JobClaimRef,
    /// Claim state.
    pub state: RunnerJobClaimState,
    /// Expected operation generation/version.
    pub expected_version: LocalExpectedVersion,
    /// Claim observation time.
    pub claimed_at: Timestamp,
    /// Local expiry/cancellation posture.
    pub expiry: ClaimExpiryPosture,
    /// Recovery case if claim outcome is uncertain.
    pub recovery_case_ref: Option<RecoveryCaseId>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `job_run_ref` | job entry | 只绑定本地 job |
| `claim_ref` | operation store/id generator | 不等 owner lease/process lock |
| `state` | local claim transition | Unknown 不自动重新 claim |
| `expected_version` | local store | 防止旧 worker 覆盖新 job state |
| `claimed_at` / `expiry` | trusted local clock + cancellation policy | 不代表 owner time/lease |
| `recovery_case_ref` | claim ambiguity/crash | claim unknown 进入 recovery；不直接重跑副作用 |

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn claim(job_run_ref: JobRunRef, claim_ref: JobClaimRef, expected_version: LocalExpectedVersion, claimed_at: Timestamp, expiry: ClaimExpiryPosture) -> Result<Self, JobError>` | 建立 local claim | 初态 Claimed；不调用 owner |
| `pub fn release(&mut self) -> Result<(), JobError>` | 安全释放 local claim | Claimed→Released；需 checkpoint/stop boundary |
| `pub fn mark_unknown(&mut self, recovery_case_ref: RecoveryCaseId) -> Result<(), JobError>` | claim/lease 结果不明 | Claimed→Unknown；禁止自动重跑原 operation |
| `pub fn is_current(&self, now: &Timestamp) -> bool` | 判断 local claim freshness | 纯判断；不等 owner lease |

### 18.5 `RunnerJobCheckpoint`

```rust
/// Body-free checkpoint for bounded operations work.
pub struct RunnerJobCheckpoint {
    /// Job run identity.
    pub job_run_ref: JobRunRef,
    /// Local checkpoint sequence.
    pub sequence: u64,
    /// Last processed local item refs.
    pub processed_refs: Vec<RunnerCheckpointItemRef>,
    /// Basis/generation used for this checkpoint.
    pub basis_ref: RunnerJobBasisRef,
    /// Whether the checkpoint can safely resume local work.
    pub state: RunnerCheckpointState,
    /// Redacted checkpoint issues.
    pub issue_refs: RunnerJobIssueRefSet,
}
```

```rust
/// Local checkpoint state.
pub enum RunnerCheckpointState {
    /// Checkpoint is valid for a future bounded read/work step.
    Usable,
    /// Basis changed; old checkpoint must not be resumed blindly.
    Stale,
    /// Checkpoint was written but its durability/readback is unknown.
    Unknown,
    /// Checkpoint is terminally closed for this job run.
    Closed,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn create(job_run_ref: JobRunRef, sequence: u64, processed_refs: Vec<RunnerCheckpointItemRef>, basis_ref: RunnerJobBasisRef) -> Result<Self, JobError>` | 建立 checkpoint | body-free；basis 必须显式 |
| `pub fn assert_resumable(&self, current_basis: &RunnerJobBasisRef) -> Result<(), JobError>` | 判断是否可安全继续 | 只有 Usable + same basis；不自动调用 adapter |
| `pub fn mark_stale(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | basis drift 后冻结 | Usable→Stale；旧结果不得覆盖新 generation |
| `pub fn mark_unknown(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | checkpoint durability 不明 | ->Unknown；需 recovery/readback，不盲重跑 |
| `pub fn close(&mut self) -> Result<(), JobError>` | 收束 checkpoint | 仅安全 stop/terminal report 后；不表示 owner success |

### 18.6 `RunnerOperationsJobResult`

```rust
/// Result shell for one operations job run.
pub struct RunnerOperationsJobResult {
    /// Job entry identity.
    pub entry_ref: RunnerJobEntryRef,
    /// Job kind and run identity.
    pub job_kind: RunnerOperationsJobKind,
    pub job_run_ref: JobRunRef,
    /// Local disposition.
    pub disposition: RunnerJobDisposition,
    /// Stored report reference when a result was saved.
    pub result_ref: Option<RunnerApplicationResultRef>,
    /// Fresh report surface, when produced by this run.
    pub report: Option<RunnerJobReport>,
    /// Redacted issue refs.
    pub issue_refs: RunnerJobIssueRefSet,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn completed(entry: &RunnerOperationsJobEntry, result_ref: RunnerApplicationResultRef, report: RunnerJobReport) -> Result<Self, JobError>` | 构造 fresh completed/partial result | report 只含 local refs/counters；不映射 owner success |
| `pub fn blocked(entry: &RunnerOperationsJobEntry, result_ref: RunnerApplicationResultRef, report: RunnerJobReport) -> Result<Self, JobError>` | 构造已安全收束但未执行正向工作的 blocked result | report 必须同 job kind/run ref且 disposition=Blocked；不改写为 Partial/Failed，不暗示 owner failure |
| `pub fn failed(entry: &RunnerOperationsJobEntry, result_ref: Option<RunnerApplicationResultRef>, report: Option<RunnerJobReport>, issue_refs: RunnerJobIssueRefSet) -> Result<Self, JobError>` | 构造可信 local failure result | disposition=Failed；report若存在必须同 job kind/run ref且 disposition=Failed；不补造owner failure/success |
| `pub fn duplicate_replayed(entry: &RunnerOperationsJobEntry, result_ref: RunnerApplicationResultRef) -> Result<Self, JobError>` | 构造 duplicate result | 必须由 stored report lookup 提供；不重跑 job |
| `pub fn rejected(entry: &RunnerOperationsJobEntry, issue_refs: RunnerJobIssueRefSet) -> Result<Self, JobError>` | 构造 pre-execution rejection | 不创建 claim、不调用 application |
| `pub fn unknown(entry: &RunnerOperationsJobEntry, recovery_case_ref: RecoveryCaseId, issue_ref: RunnerJobIssueRef) -> Result<Self, JobError>` | 构造 ambiguous result | 关联 recovery；不自动 replay |
| `pub fn assert_no_truth_repair(&self) -> Result<(), JobError>` | 校验 report/result 不表达 owner repair | 只检查 refs/markers/issues |

### 18.7 `RunnerJobRegistryState`

```rust
/// Registry of explicitly enabled operations job kinds.
pub struct RunnerJobRegistryState {
    /// Registered job entry refs.
    pub entries: Vec<RunnerJobEntryRef>,
    /// Enabled job kinds from validated runtime config.
    pub enabled_kinds: Vec<RunnerOperationsJobKind>,
    /// Redacted registration issues.
    pub issue_refs: RunnerJobIssueRefSet,
}
```

| 函数签名 | 作用 | 约束 |
|---|---|---|
| `pub fn empty() -> Self` | 建立空 registry | 不创建 scheduler/process |
| `pub fn register(&mut self, entry_ref: RunnerJobEntryRef, kind: RunnerOperationsJobKind) -> Result<(), JobError>` | 注册 job kind | ordered unique；不创建实际 schedule |
| `pub fn is_enabled(&self, kind: &RunnerOperationsJobKind) -> bool` | 判断是否启用 | disabled -> rejected；不改变 domain invariant |
| `pub fn record_issue(&mut self, issue_ref: RunnerJobIssueRef) -> Result<(), JobError>` | 记录 registry issue | redacted；不保存 config body |

### 18.8 operations 模块停审

| 审计项 | 结论 |
|---|---|
| Job 覆盖 | 5 个概要 Job 均有 finite kind、entry、claim、checkpoint、result/report 和 registry 承接。 |
| claim/lease 边界 | local job claim/checkpoint 与 Sandbox owner lease、resource allocation、process lock 完全分离。 |
| crash/unknown | claim/checkpoint/result 不明时进入 Unknown/RecoveryCase；不自动重跑副作用。 |
| report 边界 | job report 只含 local refs/counters/partial/blocked posture；不是 approval、running、cleanup、evidence 或 verdict。 |
| 配置边界 | enabled/schedule/budget 只能由 validated runtime config 控制；不能启用未闭合 consumer 或新增 outbound event。 |
| 后续承接 | Step 7 定义 job/claim/store ports；Step 8 定义 job request/result/report envelope；Step 9 定义每个 job 的 processing flow；Step 10 定义 job/claim/checkpoint/result matrix。 |
| 模块状态 | `completed_with_upstream_blockers`；不解除 `RUN-UP-001~008` 与 `RUN-DDD-001~003`。 |

## 19. 字段来源闭环审计

### 19.1 高复用字段来源闭环

| 字段族 | 生成 / 读取来源 | 写入对象 | 不得使用的替代来源 | 结论 |
|---|---|---|---|---|
| local `*_id` / `*_ref` | application `IdGeneratorPort` 或 repository rehydrate | selection、task、cache、intent、guard、recovery、preview、diagnosis、handoff、entry/job result | title、path、digest、timestamp、PID、owner id 拼接 | closed for semantics；Step 7 列全 generator methods |
| actor/session/project/scope | `ContextReadPort` safe resolution + trusted entry | `RunnerContextRef`、operation context、visibility decision | local role、cached profile、UI selection | closed with `RUN-UP-008` |
| Release/version/authority | explicit immutable input + `ReleaseAuthorityReadPort` | selection/material/run bindings | `latest`、default branch、newest directory、mutable tag、history/cache guess | closed with `RUN-UP-001/002/008` |
| locator/manifest/digest/signature/platform | `MaterialSourcePort` + `IntegrityVerifierPort` | acquisition/cache/integrity | filename、size、HTTP 200、locally chosen algorithm/policy | closed with `RUN-UP-001/002/007/008` |
| owner request/run/control/result refs | `SandboxRunPort` / `RuntimeStatusReadPort` formal receipt or safe read | intent/control/owner projection/recovery | ACK alone、PID、port、socket、toast、local log | closed with `RUN-UP-003/004/008` |
| lease/cleanup/protection refs | formal owner safe reads + persisted local expectation | guard/cache/recovery/resource section | stop confirmed、file absence、user click、disk pressure | closed with `RUN-UP-003/005/006/007/008` |
| preview/diagnosis/handoff material | `DiagnosticReadPort` + `RedactionPort` + formal handoff/archive ports | preview/diagnosis/handoff/read model | raw stdout/stderr、raw log、secret URL、owner body | closed with `RUN-UP-005/006/008` |
| freshness/visibility/source attribution | formal source metadata/resolver + trusted local clock observation | every projection/view/snapshot carrier | current-by-default、last arrival wins、empty success | closed for semantics；exact source version留 Step 7/8 |
| idempotency/digest/stored result | trusted write/event/job metadata + canonicalizer + result store | application/entry/worker/job carriers | run id、PID、trace、timestamp、raw body | closed；Step 7 repository，Step 8 schema |
| expected version/cursor/checkpoint | local repository version/readback | truth update、claim、checkpoint、recovery | owner cursor、page cursor、arrival order | closed；Step 7/11 |
| issue/reason refs | validator、domain transition、adapter error mapper，先 redaction | blocked/rejected/unknown/degraded surfaces | raw exception、HTTP body、stack trace、secret | closed for semantic boundary；Step 8/12 |

结论：所有高复用字段族均有可追溯来源和禁止替代项。当前没有通过本地推断补造 owner truth 的字段；exact SDK/schema 缺口继续由上游 blocker 和 Step 7/8 承接。

### 19.2 对象组字段来源闭环

| 对象组 | 必填来源已闭合的字段 | formal port / repository 承接 | 当前 blocker | 审计结论 |
|---|---|---|---|---|
| context / selection | context refs、explicit release/version/scope、generation、authority ref/freshness | context/authority read + selection repository | `RUN-UP-001/002/008` | pass with blockers；无隐式版本 |
| acquisition / qualification | task/cache/posture id、binding、locator、manifest、checks、handle | material source/verifier/cache repositories | `RUN-UP-001/002/007/008` | pass with blockers；complete/verified/qualified 分轴 |
| run / control / owner projection | local intent ids、metadata、expected basis、receipts、owner refs/axes | state store + Sandbox/Runtime ports | `RUN-UP-003/004/007/008` | pass with blockers；accepted 非 running |
| resource / protection / recovery | probe key/freshness、五类 protection posture、expected/actual basis、resolution refs | platform/Sandbox/diagnostic/archive reads + recovery store | `RUN-UP-003/005/006/007/008` | pass with blockers；unknown fail-closed |
| preview / diagnosis / handoff | source/subject refs、bounded content、redaction、visibility、target/receipt | diagnostic/redaction/handoff/archive ports | `RUN-UP-005/006/008` | pass with blockers；非 evidence |
| read model / connectivity | six safe sections、attribution、composition generation、connectivity observation | query repositories/resolvers/clock | `RUN-UP-001~008` | pass with blockers；pure no-write |
| application | operation metadata、idempotency digest/state、stored result ref、visibility decision、job refs/counters | UoW/id/result/read ports | `RUN-DDD-003` + owner blockers | pass；具体 trait 留 Step 7 |
| infra | validated config refs、slot availability、capability markers、store/cache posture | config/capability providers | `RUN-DDD-001~003`、`RUN-UP-008` | logical pass；无产品/路径事实 |
| entry / worker / operations | envelope metadata、typed names/refs、disposition、claim/checkpoint/report refs | application facade + entry/consumer/job stores | owner envelope/技术选择未闭合 | pass with positive paths blocked |

## 20. 状态闭环审计

### 20.1 Runner-owned 与派生状态族

| 状态族 | 初始来源 | 合法收敛 / 终态 | unknown/stale 出口 | Step 10 必须覆盖 |
|---|---|---|---|---|
| `SelectionState` | `select -> Selected` | Current、Invalidated；Blocked 可新 basis recheck | Stale/Blocked -> explicit Checking；Invalidated terminal | 跳过 authority、旧 generation reuse 禁止 |
| `AcquisitionState` | `start -> Absent` | Complete/Failed/Cancelled | Paused 仅重验 binding 后 resume | Complete 非 Verified |
| `IntegrityState` | `begin -> Pending` | Verified/Invalid；Stale/Blocked 需新验证轮次 | 不原地把旧结果改 Verified | Verified 非 approval |
| `MaterialCacheState` | `quarantine -> Quarantined` | Qualified/Stale/Invalid/Evicted | stale/invalid 不原地 qualified | Evicted 需 guard + safe release receipt |
| `RunIntentState` | `create -> Draft` | Accepted/Rejected/Invalidated；Unknown 经只读 reconcile | Unknown 禁止 replay | Accepted 非 running |
| `ControlIntentState` | `request -> Pending` | Confirmed/Rejected；Conflict/Unknown 经 reconcile | 新控制需新 basis/key | Stop confirmed 非 cleaned |
| `ProtectionState` | missing input -> Unknown | Protected/Blocked/Releasable（全量重算） | 任一 stale/missing/conflict -> Unknown | Releasable 非 released |
| `RecoveryState` | `freeze -> Frozen` | Reconciled/Conflict/ManualReview/Closed | 只读 Querying；不重放旧请求 | Closed 非 owner success |
| `HandoffState` | `prepare -> Draft/Blocked` | Delivered/Failed/Blocked；Unknown 经 reconcile | 禁止 auto resend | Delivered 非 evidence |
| derived read axes | safe source composition | replace newer projection；无业务终态 | stale/restricted/partial/unknown 显式保留 | no-write/no aggregate success |

### 20.2 entry / worker / operations / infra 技术状态族

| 状态族 | 所属边界 | 允许作用 | 禁止跨轴推导 |
|---|---|---|---|
| `RunnerIdempotencyState` | application | Reserved→Completed/Conflict；duplicate 读 stored result | Completed 不等 owner/domain success |
| `RunnerEntryState` / `RunnerHandlerDisposition` | entry | inbound validation/dispatch/result surface | accepted shell 不等 running |
| `RunnerConsumerLoopState` / item disposition | worker | planned loop、dedup、gap、blocked/unsupported | message ACK/arrival 不等 truth current |
| `RunnerJobEntryState` / claim/checkpoint/disposition | operations | local job/claim/checkpoint/report | job complete 不等 approved/cleaned/evidence |
| `RunnerRuntimeBuildState` / adapter availability | infra | composition/readiness/degraded surface | Ready/Enabled 不等 owner contract ready/success |
| `ConnectivityState` / read availability | presentation | local connection and section availability | Online/Complete 不等 any business axis current |

状态命名已与概要 Step 9 对齐；owner request/execution/control posture 仍是外部投影轴，不由 Runner 定义 owner transition。Step 10 只能为本地轴补完整转换矩阵，并对 owner 轴定义“接受/拒绝投影输入”的门禁。

## 21. 正式 17 对象覆盖审计

| # | 正式对象 | 主 owner / 类别 | 本 Step 契约位置 | 关键边界 | 结果 |
|---:|---|---|---|---|---|
| 1 | `RunnerContextRef` | domain local context ref | §8.2 | 不复制 actor/project truth | covered |
| 2 | `SelectionGeneration` | domain immutable value | §8.3 | successor，不原地改旧世代 | covered |
| 3 | `ReleaseSelection` | domain aggregate | §8.4 | exact refs；无 latest | covered |
| 4 | `AcquisitionTask` | domain entity | §9.2 | transfer 非 integrity | covered |
| 5 | `MaterialCacheEntry` | domain entity | §9.3 | cache 非 protection truth | covered |
| 6 | `IntegrityPosture` | domain verification record | §9.4 | verified 非 approved | covered |
| 7 | `RunIntent` | domain local aggregate | §10.2 | accepted 非 running | covered |
| 8 | `ControlIntent` | domain local entity | §10.3 | confirmed effect scoped only | covered |
| 9 | `OwnerRunProjection` | owner-attributed projection | §10.4 | formal safe source only | covered |
| 10 | `ResourceObservation` | local observation | §11.2 | available 非 allocation | covered |
| 11 | `ProtectionGuard` | domain guard | §11.3 | releasable 非 release | covered |
| 12 | `RecoveryCase` | domain recovery aggregate | §11.4 | query-only；no replay | covered |
| 13 | `OutputPreview` | safe read projection | §12.2 | bounded/redacted；非 evidence | covered |
| 14 | `FailureDiagnosis` | local diagnostic record | §12.3 | 非 verdict/audit | covered |
| 15 | `HandoffPosture` | local handoff intent | §12.4 | receipt 非 evidence | covered |
| 16 | `RunnerReadModel` | composite read model | §13.2 | no-write；无总 success | covered |
| 17 | `ConnectivityView` | presentation projection | §13.3 | online 不清 stale | covered |

17/17 正式概要对象均有唯一主要归属、字段来源、成员函数/factory、状态或派生姿态及禁止事项。application/infra/entry/worker/operations 的支撑对象不计入 17 个正式 domain/projection 对象，但已在 §14～§18 闭合其稳定 carrier。

## 22. Step 7～10 承接与反查

### 22.1 Step 7 Trait / Port / Adapter 承接清单

| 接缝组 | Step 7 必须定义的 capability | 消费对象 / 字段 | 安全失败 / blocker |
|---|---|---|---|
| base application | Clock、IdGenerator、UoW、expected-version、idempotency、stored-result | 所有 local id/time/version/result ref | store/技术未定：`RUN-DDD-001~003` |
| context / authority | `ContextReadPort`、`ReleaseAuthorityReadPort` | context/selection/bindings/visibility | `RUN-UP-001/002/008`；blocked/stale/invalidated |
| material | `MaterialSourcePort`、`IntegrityVerifierPort`、`MaterialCachePort` | acquisition/cache/integrity/qualification | `RUN-UP-001/002/007/008`；no-locator/invalid/blocked |
| lifecycle | `SandboxRunPort`、`RuntimeStatusReadPort` | intent/control/projection/request/run/result refs | `RUN-UP-003/004/007/008`；rejected/unknown/conflict |
| resource / recovery | `PlatformResourcePort`、owner lease/cleanup/reconcile reads | observation/guard/recovery | `RUN-UP-003/005/006/007/008`；unknown fail-closed |
| diagnosis / handoff | `DiagnosticReadPort`、`RedactionPort`、`ObservabilityHandoffPort`、`ArchiveReferencePort` | preview/diagnosis/handoff/protection | `RUN-UP-005/006/008`；restricted/blocked/unknown |
| local repositories | state/projection/recovery/cache/operation/result read-save-list ports | all Runner-owned state/projections | expected version、stored result、safe release ordering |
| entry / consumer / job facade | command/query/consumer/job application service traits + readiness | entry/worker/operations objects | consumer remains planned/blocked until formal contract |

Step 7 不得把 required port 名称误写成 owner 已存在 client，也不得让 adapter 返回 sibling body。每个 port 必须列 caller、semantic request/result/error/readiness、实现候选、test-double parity 与 blocker；exact SDK mapping 保持 pending。

### 22.2 Step 8 protocol 反查

| protocol surface | 必须引用的 Step 6 carrier | 必须显式表达 | 禁止 |
|---|---|---|---|
| 11 Commands | exact refs/bindings、actor/metadata/idempotency/expected basis | accepted/rejected/unknown/conflict + result ref | implicit selector、generic success、raw owner response |
| 12 Queries | read subject、visibility/freshness/source/degraded/page | section unavailable/partial/stale；no-write | query refresh/repair/reserve idempotency |
| 4 planned Consumers | event/source/schema/dedup/order/gap/trace/readiness | unsupported/blocked/delayed/gap + receipt ref | 未闭合时解析 payload或声称 ready |
| 5 Operations Jobs | job kind/run/key/scope/page/checkpoint/report refs | completed/partial/failed/rejected/unknown/duplicate | report 冒充 owner success/evidence |
| owner adapter results | typed safe receipt/snapshot/result/ref + source attribution | ambiguous/unavailable/restricted/unsupported | HTTP 200/ACK/PID 映射成功 |

### 22.3 Step 9 function flow 反查

| flow group | 必须保持的调用顺序 | unknown / failure 出口 |
|---|---|---|
| select / invalidate | validate explicit input → resolve context/authority → create generation/selection → commit | source不足→blocked/stale；不得 fallback cache |
| acquire / verify / qualify | recheck binding → resolve locator → quarantine transfer → verify → authority recheck → promote | each side effect分事务；ambiguous→freeze/readback |
| run / control | local reservation/intent commit → owner call → explicit result commit | ambiguous→Unknown + RecoveryCase；不得 replay |
| cleanup / eviction | load current protection inputs → evaluate guard → owner/local release call → receipt/readback → mark evicted | missing/stale/conflict→protected/unknown；stop ACK 不足 |
| preview / diagnosis / handoff | safe read → redaction/visibility → local projection → explicit handoff intent/call/result | raw body unavailable；ambiguous→Unknown + RecoveryCase |
| query / refresh / reconcile | Query only reads committed safe state；refresh/job显式触发；reconcile only owner reads | partial/degraded 显式；不隐藏写入 |
| consumer / job | validate envelope/input → readiness/idempotency/claim → application facade → stored receipt/report | duplicate replay stored surface；gap/unknown freeze |

### 22.4 Step 10 state matrix 反查

Step 10 必须逐一覆盖 §20 的所有 Runner-owned、application、entry、worker、operations 与 infra 状态族，并至少列出：from、trigger、guard、to、side effect、persisted object、failure/unknown、forbidden transition。特别必须反查：

- selection invalidation 向 material/run/recovery 的传播；
- acquisition complete、integrity verified、cache qualified 的分轴转换；
- local intent 与 owner request/execution/control 三轴；
- stop/cancel、cleanup、release、evicted 的独立转换；
- unknown/stale/conflict 的 freeze/reconcile/manual-review 出口；
- handoff accepted/delivered 与 evidence/report/verdict 的永久隔离；
- connectivity/read-model 状态只替换 projection，不迁移业务 truth；
- consumer/job/runtime technical state 不跨轴升级业务成功。

## 23. 正反例审计

| 场景 | 正例 | 反例（禁止） |
|---|---|---|
| 版本选择 | 用户提交 exact immutable `ReleaseRef + ArtifactVersionRef`，authority current 后进入 selection current | 接受 `latest`、默认分支、mutable tag 或目录最新项 |
| cache 命中 | 重新校验 selection/source/digest/authority，且 integrity current 后复用 qualified entry | 文件存在或曾运行成功即跳过验证 |
| run 接收 | receipt 只令 `RunIntent=Accepted`，随后等待正式 owner execution projection | ACK/HTTP 200/toast/PID/端口直接显示 running |
| stop / cleanup | stop result只确认 stop；另读 lease/cleanup/protection并确认 release | stop confirmed 直接写 cleaned/evicted |
| ambiguous call | 事务记录 Unknown，创建 RecoveryCase，只读查询 owner basis | reconnect 后自动重发原 command |
| preview | 使用 bounded safe source并强制 redaction，stale/restricted 显式展示 | raw local log 作为 fallback 或审计证据 |
| handoff | receipt 仅更新 handoff posture，并继续 retention/protection评估 | receipt 生成 evidence/report/verdict/signoff |
| query | 只组合 committed local/safe projections | 页面打开时隐式下载、刷新、repair、cleanup |
| consumer | schema/client/order/dedup 未闭合时返回 blocked/unsupported且不解析 payload | 猜测 event body、以最后到达覆盖 projection |
| job | duplicate读取 stored report；partial/blocked逐项保留 | duplicate重跑 scan/side effect，或 job success反写 owner truth |

## 24. 正式 `03` 回填草稿

### 24.1 建议章节映射

| 正式 `03` 章节 | 本 Step 回填来源 | 应装配内容 | 装配红线 |
|---|---|---|---|
| §5 模块实现契约 | §4～§18 | 七模块 capability、对象卡、application/infra/entry/worker/operations carrier | 不写真实 package/path/技术产品 |
| §6 全局对象索引 | §21 + §14～§18 支撑对象 | 17 正式对象与支撑对象的 owner、职责、依赖 | 不把 view/ref/receipt 当 truth |
| §7 字段与状态闭环 | §19～§20 | 高复用字段来源、对象组来源、状态族与 owner projection 边界 | blocker 必须保留 |
| §8 后续实现接缝索引 | §22 | port/protocol/flow/state 的承接映射 | 由 Step 7～10 最终覆盖，不抢写 exact contract |

### 24.2 装配规则

- Step 19 前不修改正式 `03-详细设计.md`；届时从中间产物重建，不沿用旧正文事实。
- 字段表的类型、来源、约束和关键 factory/transition 签名不可因篇幅删除。
- 所有示意代码保持语言中立解释；`rust` fence 不构成 Rust/Tauri/GUI/runtime 技术决策。
- 后续 Step 若发现字段不可从 port/protocol/flow 取得，必须回写本 Step 或登记显式替代，不能在实现侧暗增字段。
- `RUN-UP-001~008`、`RUN-DDD-001~003` 必须随相关对象和接缝进入正式文档，不能在装配时隐去。

## 25. 待确认事项与后续闭合编号

| 编号 | 待闭合事项 | 责任 Step / authority | Step 6 已提供的输入 | 未闭合时状态 |
|---|---|---|---|---|
| `RUN-S6-OPEN-001` | application id generator 覆盖所有 local object/result/entry/job ids | Step 7 | §4.2、§19 | local factory blocked |
| `RUN-S6-OPEN-002` | exact Release locator/manifest/digest/signature/revoke/expire/baseline surface | Step 7/8 + `RUN-UP-001/002/008` | selection/material carriers | positive acquire/qualify blocked |
| `RUN-S6-OPEN-003` | Sandbox request/control/lease/cleanup/reconcile 与 Runtime status/result safe DTO | Step 7/8 + `RUN-UP-003/004/007/008` | intent/projection/guard/recovery carriers | positive lifecycle blocked |
| `RUN-S6-OPEN-004` | diagnostic read/redaction/handoff/archive safe contract | Step 7/8 + `RUN-UP-005/006/008` | preview/diagnosis/handoff carriers | positive handoff blocked |
| `RUN-S6-OPEN-005` | repository get/list/save/expected-version/UoW、idempotency和stored result | Step 7/11/13 + `RUN-DDD-003` | object identities and operation carriers | durable path blocked |
| `RUN-S6-OPEN-006` | command/query/consumer/job DTO 和 public error/readiness surface | Step 8 | shared carriers、entry objects | public protocol blocked |
| `RUN-S6-OPEN-007` | factory/transition/owner-call/transaction ordering | Step 9/11 | functions and state axes | exact orchestration blocked |
| `RUN-S6-OPEN-008` | exhaustive transition/forbidden matrix | Step 10 | §20 | implementation transition tests blocked |
| `RUN-S6-OPEN-009` | physical modules/files/language/runtime/GUI/process/store/cache binding | authority + Step 4/14 | logical seven-module design | `RUN-DDD-001~003` remains blocked |
| `RUN-S6-OPEN-010` | Consumer envelope/schema/client/order/dedup/gap contract | upstream + Step 7/8/9 | worker planned carriers | all four consumers planned/blocked |

Step 9 开工反查修正记录（2026-09-20）：已补 `RUN-S6-FIX-001` local Id/public Ref nominal conversion、`RUN-S6-FIX-002` selection authority-check/blocked/stale transition、`RUN-S6-FIX-003` acquisition resolution/source-binding transition、`RUN-S6-FIX-004` cache eviction-candidate observation method、`RUN-S6-FIX-005` `AcquisitionTask.selection_id` 与对应 `start(...)` 参数、`RUN-S6-FIX-006` `RunnerReadVisibilityDecision.freshness/source_attribution`、`RUN-S6-FIX-007` owner/recovery secondary carrier与 `OwnerRunProjection.owner_basis`、`RUN-S6-FIX-008` `OutputPreview.subject_refs/safety` 与纯裁剪 `VisibilityContext`、`RUN-S6-FIX-009` `RunnerComposedSection<T>` / `ReadModelUnavailableReason`、`RUN-S6-FIX-010` finite `ConnectivityReason`，以及 `RUN-S6-FIX-011` worker item 的 `Quarantined` variant与negative result factories。第九项使read-model partial/unavailable无需伪造默认body；第十项为既有connectivity `reason`字段提供typed、redacted、可逐variant映射的来源；第十一项使Step 8已定义的四类安全负向receipt可由worker result逐variant承接，同时明确当前无isolation port时Quarantined不可达。新增 `record_projection(...)` 作为 report assembly 对既有正式 projection carrier 的显式收口；该方法只接受已由 section/repository 提供的 `RunnerProjectionRef`，不生成 identity。十二项均是既有对象状态与协议字段之间缺失的纯逻辑连接，不新增对象、port、协议、truth owner或技术选择；后续Step 9必须只调用这些已记录函数。

这些事项是后续 Step 的正式职责，不要求在 Step 6 伪造 schema 或技术事实。它们不阻止进入 Step 7 的逻辑契约讨论，但阻止 exact adapter、physical layout、positive readiness 与实现开始。

## 26. Step 6 停审与进入 Step 7 条件

### 26.1 完成检查

| 门禁 | 结果 | 依据 |
|---|---|---|
| 七逻辑模块 capability 与对象归属齐全 | pass | §5、§8～§18 |
| 17 个正式对象逐一覆盖 | pass | §21，17/17 |
| shared carrier 有语义来源 | pass with upstream blockers | §4、§19；exact owner schema未伪造 |
| 每个正式对象有字段、来源、函数/factory、不变量 | pass | §8～§13 |
| application/infra/entry/worker/operations 稳定 carrier 可被后续承接 | pass | §14～§18 |
| Runner-owned 状态与 owner/derived 轴分离 | pass | §20 |
| Step 7/8/9/10 反查完整 | pass | §22 |
| 正反例和正式回填草稿完整 | pass | §23～§24 |
| 物理路径、技术选型、owner exact contract 未伪造 | pass with blockers | `RUN-UP-001~008`、`RUN-DDD-001~003` 保留 |
| 正式 `03`、实现、测试、commit 未提前执行 | pass | 本文件仅 calibration 中间产物 |

### 26.2 Step 7 启动红线

- Step 7 只能定义 application-owned semantic ports、repository/resolver/adapter 契约和 blocked readiness；不能声称同名 owner client/DTO 已存在。
- 若 port 需要 Step 6 不存在的字段，先回写本 Step 并说明来源，不能让 adapter 私下补字段。
- repository 不返回 sibling truth body；owner adapter 不暴露私有实现；entry/worker/operations 不直连 store 或 adapter。
- unknown/stale/conflict 只允许 read-only reconcile，不能因 port retry policy 自动 replay。
- planned Consumers 继续 blocked，直至 envelope/schema/client/order/dedup 合同由正式 authority 闭合。

### 26.3 停审结论

| 项 | 结论 |
|---|---|
| Step 6 逻辑契约 | `completed_with_upstream_blockers` |
| Step 6 gate | `pass_for_step_07_logic` |
| physical / exact adapter gate | `blocked` |
| 下一允许动作 | 创建并串行完成 `03_ddd_step_07_trait_port_adapter_contracts.md` |
| 不允许动作 | Step 8 提前开工、修改正式 `03`、创建 implementation ledger/skeleton、代码/测试/commit |

Step 6 到此停审。持续 blocker 不解除，也不被解释为 readiness；它们将在 Step 7 的每个相关 port/adapter 卡片中逐项带入。
