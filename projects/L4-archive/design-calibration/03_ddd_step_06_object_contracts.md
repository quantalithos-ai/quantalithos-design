# Step 6. 逐模块定义对象实现契约

## 1. Step 状态与写入批次

- 当前状态：`completed / pass_with_upstream_blockers / reviewed_by_step_7`；2026-09-11 按 Step07 授权做必要类型归属/构造/slot 反查修正，详见 §14.10；不修改正式 03。
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6。
- 未来回填：`03-详细设计.md` §5“模块实现契约”和 §6“全局对象 / Trait / API 索引”。
- 开工依据：[Step 5](03_ddd_step_05_module_contracts.md) 已停审通过，用户已明确授权完整执行 Step 06。
- 本步边界：闭合对象、字段、函数、状态与稳定 carrier；不定义 port trait 方法、完整协议 DTO、函数级流程、持久化 schema、配置值或 provider 选择，不修改 historical 正式 03。
- 语言口径：中文设计说明；Rust 契约中的标识符与 Rustdoc 使用英文，承接 Step 3 对 `standards/coding/rust.md` 的裁剪结论。

### 1.1 Step 6 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 内容完整性 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| 6.0 | 骨架、输入、问题回答、模块顺序、非 core 闭口决策 | completed | complete | internal_pass | 6.1 |
| 6.1 | contracts shared vocabulary、2 个正式对象、公共状态与 5 类 safe view | completed | complete | internal_pass | 6.2 |
| 6.2 | domain CP1～CP2：7 个对象 | completed | complete | internal_pass | 6.3 |
| 6.3 | domain CP3～CP4：8 个对象 | completed | complete | internal_pass | 6.4 |
| 6.4 | domain CP5～CP6：9 个对象 | completed | complete | internal_pass | 6.5 |
| 6.5 | application 八 service 与稳定 carrier | completed | complete | internal_pass | 6.6 |
| 6.6 | infra / api / worker 必需稳定 carrier 与 defer 决策 | completed | complete | internal_pass | 6.7 |
| 6.7 | 字段来源、状态、重复对象、依赖与 Step 7 承接总审计 | completed | complete | stop_review | wait_for_explicit_step_7_authorization |

### 1.2 模块执行顺序表

| 顺序 | 模块 / 对象组 | 模块职责 | 输入来源 | 完成后内部停审点 |
|---|---|---|---|---|
| 1 | `contracts` shared vocabulary | 提供 body-free typed id/ref、公共状态、来源分类与安全读取标记 | 正式 02 §5～§9、Core 已核验 symbol | public 类型不依赖 domain；source authority 不降格 |
| 2 | `contracts` 正式对象与 safe views | 闭合 `DeclaredArchiveScope`、`GovernanceDecisionRef` 和五类只读输出 | 正式 02 §6/§7/§8.7 | 2 个正式对象唯一归属；hidden/absent 不可区分 |
| 3 | `domain` CP1～CP2 | 请求/作业、source binding/capture/coverage/finding | 正式 02 §6.2～§6.9、§8.2～§8.3、§9.2～§9.3 | 7 个对象能力、字段、状态闭环 |
| 4 | `domain` CP3～CP4 | Bundle/manifest/closure、完整性与兼容评估 | 正式 02 §6.10～§6.17、§8.3、§9.4～§9.5 | 8 个对象 fixed-input 与非传播红线闭环 |
| 5 | `domain` CP5～CP6 | placement/lifecycle、restore plan/item/handoff/compensation | 正式 02 §6.18～§6.27、§8.4～§8.6、§9.6～§9.7 | 9 个对象 intent-before-effect、per-owner 闭环 |
| 6 | `application` | 编排八类 use case，承接 operation/idempotency/result/visibility/effect carrier | Step 5 service/port owner、前述对象 | service constructor 不获得 provider truth；稳定 carrier 不悬空 |
| 7 | `infra` / `api` / `worker` | fail-closed runtime、入口能力限制、worker claim/checkpoint/disposition | Step 5 文件/入口归属 | 不私造 provider/transport/schedule；入口不拥有 truth |
| 8 | 跨模块总审计 | 核对字段来源、状态语义、分母、依赖方向与后续接缝 | 全部前述批次 | 达成 Step 7 输入后完成并停审 |

## 2. 输入、参考粒度与裁剪

### 2.1 正式输入

| 输入 | 本步使用内容 | 不从中推导 |
|---|---|---|
| [正式 00](../00-需求文档.md) | A1～A9、source-authority matrix、BR-AR-001～012、上游 blocker | schema、provider、算法、key、成功结果 |
| [正式 01](../01-架构设计.md) | Archive ownership、port-adapter、运行角色、依赖分类、恢复 handoff 红线 | 共享数据库、跨域事务、owner 写权 |
| [正式 02](../02-概要设计.md) | 6 CP、26 对象、字段/函数骨架、30 入口、处理流、状态与异常 | 未列出的业务主语或乐观状态传播 |
| [Step 3](03_ddd_step_03_coding_runtime_constraints.md) | Rust 2024/MSRV 1.93 planned、英文源码/Rustdoc、domain 无 I/O | 已存在目标仓或已编译事实 |
| [Step 4](03_ddd_step_04_units_file_layout.md) | 六 crate planned 文件 owner | Cargo/source 已创建或 provider 文件 ready |
| [Step 5](03_ddd_step_05_module_contracts.md) | 精确依赖、2 contracts + 24 domain、8 service、7 port、30 handler owner | Step 7+ 的方法、schema、flow、transaction |

### 2.2 `L1-governance` 粒度参考裁剪

| 参考做法 | 本仓采用 | 本仓不继承 |
|---|---|---|
| 先收敛 shared type，再按模块和对象组展开 | 先定义 public typed vocabulary、状态与 marker，再写 26 个正式对象 | Governance Context/Gate/Policy/Control/Nonconformity 主语 |
| capability → object → field/function/state 三层反查 | 每个 CP 和非 core 模块均保留三层映射 | Governance 的对象数量、字段、state 或 reason 分类 |
| non-core stable carrier 必须当步闭口 | 闭合 idempotency、stored result、visibility、availability、entry/worker disposition | `jobs` crate、outbox/publisher、route/server、projection worker |
| 字段来源与状态族总审计 | 对 high-reuse ref、truth object、view、service、adapter/entry state 统一审计 | 其 repository、event、external GRC 或配置选择 |

采用的是可审查结构与落码深度，不复制治理领域架构结果。Archive 仍只有 `contracts/domain/application/infra/api/worker` 六模块；不存在 `jobs` crate、outbound publisher 或治理 truth。

### 2.3 Core 共享符号核验

2026-09-10 对 `/home/aris/Projects/quantalithos-core/crates/contracts` 只读复核后，本步只允许 `archive-contracts` 直接使用以下已存在符号：

| Core symbol | Archive 用途 | 使用限制 |
|---|---|---|
| `ActorRef`、`ActorContext` | 请求主体与可信入口主体上下文 | 不复制 identity truth；role hint 不是授权结论 |
| `CommandMetadata`、`QueryMetadata`、`RequestMetadata` | 同步入口 metadata | public DTO 精确组合由 Step 8 定义 |
| `IdempotencyKey` | Command 本地去重键 | 不能复用于 external receiver/storage key；scope/digest 仍由 Archive 明确 |
| `Timestamp` | 外层时间值载体 | Archive 以 `RecordedAt` 区分本地观察时间；不冒充外部发生时间 |
| `TraceId`、`RequestId`、`JobRunId`、`OperationName` | trace/request/run/operation 关联 | 只作关联，不证明 delivery、commit 或成功 |

Core 的 `ContractDomain` 当前只覆盖六个 L1 domain，不含 workspace/observability，故不得用它表示本仓八类 source-authority；Core 的 contract lifecycle、fingerprint、receipt、event、job 和 view 类型也不复用为 Archive 语义。所有本地 typed id/ref 由 `archive-contracts` 定义；是否使用统一生成 port 留 Step 7，编码格式不在本步私造。

Step07 direct dependency 反查：非 contracts 模块只从下列显式 re-export 路径引用同一 Core 类型，不直接依赖 core-contracts；这是 re-export，不是 shadow/newtype。

```rust
/// Re-exports only the verified shared Core vocabulary used by Archive members.
pub mod core_shared {
    pub mod actor {
        pub use core_contracts::actor::{ActorContext, ActorRef};
    }
    pub mod metadata {
        pub use core_contracts::metadata::{
            CommandMetadata, IdempotencyKey, JobRunId, OperationName,
            QueryMetadata, RequestId, RequestMetadata, Timestamp, TraceId,
        };
    }
}
```

planned owner 为 `crates/contracts/src/context.rs`；只有本模块和 contracts 本身使用 core_contracts 原路径。其余片段使用 `archive_contracts::context::core_shared`。实际 symbol export 仍需实施前核验 baseline，当前不创建源码或 dependency。

## 3. SOP 问题回答

1. **是否先有骨架、批次与模块顺序？** 已完成 §1。重对象按 6.1～6.7 写入；“分批”只控制审查面，不允许留下空心章节。
2. **是否需要 shared vocabulary / typed ref / public marker？** 需要。`contracts` 是唯一跨 crate/public 定义方；domain 可以依赖它，contracts 不得依赖 domain。来源类别、requiredness、material class、状态、版本/fence/ref、safe view metadata 均先在 6.1 收稳。
3. **模块 capability 怎样映射对象？** 6 CP 分别映射 26 个正式对象；application 的八 service 映射 30 入口用例；infra/api/worker 只定义跨函数稳定 runtime/entry carrier。逐模块表在各节先于对象卡。
4. **truth object、policy/guard、view/report、helper、adapter/entry object 如何区分？** 26 个分母只包含 2 个 contracts value/ref 与 24 个 domain truth/value/history 对象；safe view 不成为 truth；application/infra/api/worker 对象只承载编排或运行状态，不进入正式对象分母。
5. **字段来源如何闭合？** 本地 ID/version/time 由未来 application support port 或 store 提供；外部 ref/version/fence/coverage/decision/material/outcome 只能来自经 Step 7 adapter 认证的正式输入；domain factory 不生成 ID、时间、外部 ref、摘要或成功。
6. **非 core 模块哪些闭口、哪些 defer？** 见 §4.2。稳定 carrier 当步闭口；port 方法、wire DTO、provider/config/backend/transport/loop budget 分别留 Step 7/8/11/14。
7. **函数和状态怎样写？** 每个正式对象给出完整 Rust-facing 签名、字段表、成员/工厂表、不变量和本对象迁移摘要；所有有限 enum 均有英文 Rustdoc 与中文 variant 表。exact error variant 由 Step 12 承接，但函数明确返回 `DomainResult<T>` / `ApplicationResult<T>`。
8. **外部缺口是否阻塞本地对象设计？** 不阻塞 typed slot 与 fail-closed state；阻止 Available/Verified/Committed/Succeeded/Ready 的正向构造。持续保留 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`。
9. **哪些内容交给 Step 7+？** port/repository/adapter trait、协议体、调用顺序、状态总矩阵、事务、error/recovery、并发幂等、配置、观测、测试分别交 Step 7～16；逐项承接见末章。

## 4. 当前材料诊断与设计取舍

### 4.1 问题诊断

| 问题 / 风险 | 本步处置 |
|---|---|
| 正式 02 只有字段骨架，辅助 `*Ref/*Set/*Basis` 尚无 definition owner | public/cross-module 类型统一在 contracts；纯 domain comparison helper 留 domain 私有 |
| 公开 view 若直接引用 domain state，会形成 `contracts -> domain` 反向边 | 稳定 state/posture enum 与 typed ref 放 contracts；domain object 使用同一类型，不造 mirror enum |
| 将所有 external owner/version/ref 压成 `String` 会丢失 source authority | 定义 `SourceClass`、typed `SourceAuthorityRef` 与 material class；opaque value 不解析但不丢类别 |
| `GovernanceDecisionRef.applies_to` 若本地解释 scope，会夺取治理 authority | 本对象只绑定正式 identity/version/scope/validity ref；适用性须由 `GovernanceDecisionPort` 的正式证明输入，Archive 只比较绑定一致性 |
| mutable entity 若无 version，Step 11/13 无法闭合 optimistic concurrency | 为 mutable Archive truth 增加 `RecordVersion` 字段；初始值/持久化映射留 Step 11，factory 显式接收，不在 domain 生成 |
| safe view 若含“hidden/absent”原因，会形成枚举攻击 | `SafeNotAvailable` 不披露原因；可见结果才携带 freshness/redaction，多轴异常按授权后状态展示 |
| service 若持有万能 runtime 或 infra，会破坏依赖倒置 | 八 service 构造依赖按所需 port capability 分离；代码片段以泛型 handle 表示，exact trait bound 留 Step 7 |
| worker lease/checkpoint 若全推后，Step 9/13 会临时造载体 | 当步闭合 `WorkerClaim`、`WorkerCheckpoint`、`WorkerItemDisposition`；租期数值、调度和续租算法不闭合 |

### 4.1.1 本轮复审问题回答与取舍

本轮承接已读的详细设计 SOP Step 6、书写规范、真相源标准中的字段/guard/history/support-carrier 规则，以及正式 02 §6～§9 和 Step 5 §7.7。粒度参考 `L1-governance` Step 6 的对象独立卡片、typed factory、reason 字段和非 core carrier；不继承其治理对象或 outbox。

| 复审问题 | 回答与取舍 | 本步修订落点 |
|---|---|---|
| 原 completed 标记是否足够？ | 否；类型悬空、必填参数省略与依据丢失必须当步修正，再停审 | 本文件、flow、ledger |
| opaque ref 能否证明 owner/revision/结果？ | 不能；保存显式绑定字段，domain 做结构相等比较，application 经正式 port 读取证明后构造 | closure、restore eligibility、external observation |
| 失败依据放哪里？ | 固定在对应对象字段或本对象 append-only observation 集中；不以未定义的 audit/history 替代 | CP1～CP6 |
| 每次 mutation 是否更新 time？ | 带 latest recorded_at 的对象每次有效 mutation 显式接收时间；无时间字段对象不偷偷增加时钟读取 | mutation signatures 与时间审计 |
| placement commit 能否通用于 lifecycle/retrieval？ | 不能；effect family、intent 和 mapped result 分支必须匹配；ACK/commit/unknown 分离 | CP5 carriers/action |
| service I/O 是否现在写完整协议？ | 本步固定完整方法签名及 protocol family 唯一名称；wire DTO body 明确由 Step 8 闭合，当前不可据此实施 service | §10.9 |
| 非 core factory 是否仍可只写函数名？ | 不可；补齐 typed 参数、返回、状态和必填字段来源 | §10～§13 |
| 是否新增外部 owner blocker？ | 无；本轮缺口属于本地对象细化，既有外部 blocker 全部保留 | §14 |

### 4.2 非 `contracts` / `domain` 模块对象闭口决策表

| 模块 | 当前 Step 6 是否闭口 | 当步闭口对象组 | defer 内容与理由 | 后续承接 |
|---|---|---|---|---|
| `application` | 是 | 八 service、`ArchiveOperationContext`、`ArchiveIdempotencyRecord`、`StoredArchiveOperationResult`、`ArchiveReadVisibilityDecision`、`ExternalEffectCorrelation` | exact port methods/UoW/flow/error variants 不属于 object Step | Step 7/9/11/12/13 |
| `infra` | 是（最小） | `ArchiveRuntimeBindings`、`AdapterAvailabilityMarker`、`ArchiveRuntimeAssembly` | raw URL/secret/provider/backend row 与 config key 无 authority | Step 7/11/14 与正式 04 |
| `api` | 是（最小） | `ArchiveCommandEntry`、`ArchiveQueryEntry`、`ApiEntryDisposition` | Command/Query DTO 与 transport status 属于协议/error | Step 8/9/12/14 |
| `worker` | 是（最小） | `WorkerClaim`、`WorkerCheckpoint`、`ArchiveWorkerEntry`、`WorkerItemDisposition` | exact Consumer/Job DTO、lease duration、schedule/batch/retry 属于后续 | Step 8/9/12/13/14 |
| `jobs` | 不适用 | 无 | Step 4/5 已证明 17 Job 是 worker logical handlers，不存在该 crate | 不创建；Step 8/9 在 worker 闭合 |
| outbound/outbox/publisher | defer 且禁止预建 | 无 | 三个 event 仍为 candidate，受 `AR-HLD-Q-001` 阻断 | blocker 关闭后回退 02 Step 6～9 和 03 Step 4～6 |

### 4.3 关键设计取舍

| 取舍 | 结论 | 原因 / 安全上限 |
|---|---|---|
| public state 放 contracts 还是 domain | 放 contracts，domain 使用同一 enum | 防止反向依赖与 shadow DTO；Rust `pub` 不转移业务 truth |
| typed ref 内部格式 | opaque non-empty string/newtype，格式与生成器 pending | 可落码且不私造 UUID/URI/provider key 规范 |
| 时间字段 | 使用 `RecordedAt(Timestamp)`，全部由调用方传入 | 区分 Archive 观察时间与 owner event time；domain 不读时钟 |
| 外部 digest/signature/key/schema | 只定义 opaque ref 与 capability evidence slot | `AR-UP-004` 未关，不定义算法、key 或支持结论 |
| mutable truth version | 使用 Archive-local `RecordVersion` | 支撑 expected-version；数据库表示和初值由 Step 11 闭合 |
| list/set | contract 上定义 ordered-unique set；排序 key 点名 | 避免序列化/摘要不确定；具体 collection type 可由实现等价实现 |
| optional 字段 | Rust 用 `Option<T>`，禁止 magic empty/default | unknown/missing/not-yet 必须由状态或 Option 显式表达 |
| external feedback | Step 6 只定义本地 mapped evidence/result carrier | provider/owner raw body 留 adapter 内，exact port outcome 在 Step 7 |

## 5. `contracts` shared vocabulary 与公共状态契约

### 5.1 Contracts capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 / 类型组 | 后续承接 |
|---|---|---|---|---|---|
| 本地身份与引用 | application 提供的 ID、store 重建值、external adapter mapped ref | typed id/ref/version/set | 无副作用 | ID/ref 基础组 | Step 7 ID/store；Step 11 编码 |
| source-authority 分类 | 正式请求、owner 合同与 source-authority matrix | `SourceClass`、`SourceAuthorityRef`、`SourceRequiredness`、`ArchiveMaterialClass` | 不改变外部 truth | source vocabulary | Step 7 source port；Step 8 DTO |
| 多轴状态共享 | domain transition 与只读 view | state/posture enum | 只表达本仓状态 | state vocabulary | Step 10 矩阵 |
| 外部证明绑定 | owner/capability/storage/receiver 安全映射 | opaque version/fence/evidence/commit refs | 不制造证明 | evidence/ref vocabulary | Step 7 adapter outcome |
| public immutable scope | RequestArchive 输入 | `DeclaredArchiveScope` | 只校验形状 | 正式对象 1/2 | Step 8 Command |
| public governance binding | governance adapter / lifecycle command | `GovernanceDecisionRef` | 只比较绑定，不裁决 | 正式对象 2/2 | Step 7 decision port |
| 安全读取 | committed Archive truth + current access/redaction | 5 safe views 或 `SafeNotAvailable` | no-write | view/meta types | Step 8 Query；Step 9 flow |

### 5.2 功能到对象 / 类型组映射

| 对象 / 类型组 | 承接功能 | 类别 | 核心能力 | 不承接 / 禁止事项 |
|---|---|---|---|---|
| local ID/ref/version group | 对象跨模块定位、expected version 与 fixed-input 绑定 | typed vocabulary | typed equality、body-free relation | 不定义 UUID/URL/DB key 编码；不保存外部正文 |
| source-authority group | 八类来源与 material provenance | enum/ref/value | 保留 owner、class、requiredness、material class | workspace/Artifact/audit 不升格 canonical |
| public state group | 15 个主要状态族 | enum | 限定有限状态和语义 | 同名状态不跨对象推导 |
| `DeclaredArchiveScope` | 冻结声明范围 | formal immutable value object | shape validation、required slice query | 不证明 coverage/authority |
| `GovernanceDecisionRef` | 绑定 owner-issued 决定 | formal opaque reference object | identity/version/scope/validity binding | 不解释 policy/期限/hold/delete/risk |
| safe view group | 五 Query 输出 | read view | current visibility、freshness、redaction、多轴姿态 | 不反写真相、不触发外部 I/O、不区分 hidden/absent |

### 5.3 Shared type 写入纪律

函数表中的 Result alias 均为 planned 模块内错误返回面：`ContractResult<T> = Result<T, ContractError>`（contracts）、`DomainResult<T> = Result<T, DomainError>`（domain）、`ApplicationResult<T> = Result<T, ApplicationError>`（application）、`InfraResult<T> = Result<T, InfraError>`（infra）、`ApiResult<T> = Result<T, ApiError>`（api）、`WorkerResult<T> = Result<T, WorkerError>`（worker）。这里只固定 owner 和返回边界，exact error variant/映射由 Step 12 闭合，不能据占位别名声称已可编译或用 anyhow/String 私补。Step 7/8 若提前需要错误载荷，必须当步显式定义并反查本表。

下列契约片段是 planned Rust-facing schema。`opaque_string_types!` / `typed_ref_types!` 只是文档压缩记法，表示每个列出的类型都应生成独立 `pub struct`、英文 Rustdoc、非空校验的 `try_new`、`as_str` 和必要的 `into_inner`；它不是要求实现自定义宏，也不固定序列化或 ID 算法。

```rust
/// Declares independent non-empty opaque string value types.
opaque_string_types! {
    ArchiveRequestId, RestoreRequestId, ArchiveJobId, JobStageRecordId,
    SourceBindingId, CaptureAttemptId, SourceCaptureFindingId,
    ArchiveBundleId, BundleManifestId, ManifestRevisionId, ManifestEntryId,
    ClosureFindingId, VerificationAssessmentId, CompatibilityAssessmentId,
    VerificationFindingId, ArchivePlacementId, LifecycleExecutionId,
    ExternalActionId, RestorePlanId, RestoreItemId, RestoreHandoffId,
    HandoffOutcomeId, CompensationRecordId,
    ScopeDeclarationVersion, ExternalDecisionVersion, SourceVersionRef,
    SnapshotFenceRef, SourceContractRef, MaterialLocatorRef, DigestRef,
    SignatureRef, SchemaVersionRef, StorageLocationRef, StorageTierRef,
    ExternalCommitRef, ExternalFeedbackRef, ReceiverCommitRef,
    RestoreMaterialRef, RestoreReceiverRef, AuthorityRef, RestoreAuthorityRef,
    CompensationAuthorityRef, SafeInputDigest, ExternalIdempotencyKey,
    ReceiverIdempotencyKey, StageBasis, RequestBlockBasis, JobBlockBasis,
    CaptureBlockBasis, SourceBindingBlockBasis, ClosureFindingBasis,
    CommitUnknownBasis, SafeReasonRef, ExternalEvidenceRef,
    LifecycleCompensationEvidenceRef, ExternalEventRef,
    StoredResultSurfaceRef, SafeSourceSubjectRef,
    SafeVerificationSubjectRef
}

/// Declares independent body-free references to Archive-owned records.
typed_ref_types! {
    ArchiveRequestRef => ArchiveRequestId,
    RestoreRequestRef => RestoreRequestId,
    ArchiveJobRef => ArchiveJobId,
    SourceBindingRef => SourceBindingId,
    CaptureAttemptRef => CaptureAttemptId,
    ArchiveBundleRef => ArchiveBundleId,
    BundleManifestRef => BundleManifestId,
    ManifestEntryRef => ManifestEntryId,
    VerificationAssessmentRef => VerificationAssessmentId,
    CompatibilityAssessmentRef => CompatibilityAssessmentId,
    ArchivePlacementRef => ArchivePlacementId,
    LifecycleExecutionRef => LifecycleExecutionId,
    ExternalActionRecordRef => ExternalActionId,
    RestorePlanRef => RestorePlanId,
    RestoreItemRef => RestoreItemId,
    RestoreHandoffRef => RestoreHandoffId,
    HandoffOutcomeRef => HandoffOutcomeId,
    CompensationRecordRef => CompensationRecordId
}

/// Points to one of the five Archive-owned query subjects without carrying a body.
pub enum ArchiveReadSubjectRef {
    /// Selects an Archive job.
    Job(ArchiveJobRef),
    /// Selects a Bundle and immutable manifest revision.
    Bundle(BundleRevisionRef),
    /// Selects verification results for one immutable Bundle revision.
    Verification(BundleRevisionRef),
    /// Selects an immutable restore plan.
    RestorePlan(RestorePlanRef),
    /// Selects one owner-specific restore handoff.
    RestoreHandoff(RestoreHandoffRef),
}

/// Points to an Archive-owned record that supports a conservative component posture.
pub enum ArchiveRecordRef {
    /// Points to an archive or restore request.
    Request(OperationRequestRef),
    /// Points to a bounded Archive job.
    Job(ArchiveJobRef),
    /// Points to a source binding.
    SourceBinding(SourceBindingRef),
    /// Points to one fixed capture attempt.
    CaptureAttempt(CaptureAttemptRef),
    /// Points to one immutable Bundle revision.
    Bundle(BundleRevisionRef),
    /// Points to an integrity or compatibility assessment.
    Assessment(AssessmentRef),
    /// Points to a storage placement.
    Placement(ArchivePlacementRef),
    /// Points to a governance-bound lifecycle execution.
    Lifecycle(LifecycleExecutionRef),
    /// Points to one immutable restore plan.
    RestorePlan(RestorePlanRef),
    /// Points to one owner-specific restore item.
    RestoreItem(RestoreItemRef),
    /// Points to one owner-specific restore handoff.
    RestoreHandoff(RestoreHandoffRef),
    /// Points to one authorized restore compensation record.
    Compensation(CompensationRecordRef),
}
```

| 类型组 | 字段 / 形态 | 作用 | 约束 / 来源 |
|---|---|---|---|
| 24 个 `*Id` | opaque non-empty `String` newtype | Archive-owned 对象身份 | application 的未来 ID generator 或 store 重建；domain/adapter 不拼接；格式留 Step 7/11 |
| Archive-owned `*Ref` | 对应 typed ID | body-free 本地关系 | 仅从已构造/已读取对象生成；不得携带对象 body |
| `*Version/*Revision` | opaque newtype 或 `RecordVersion` | fixed input、owner version、scope/manifest revision | owner/store/application 显式提供；禁止跨 owner 排序 |
| external `*Ref` | opaque non-empty newtype | 定位正式 authority/material/evidence/commit | 仅 adapter 从正式合同映射；没有合同即不可正向构造 |
| `*Basis` | opaque non-empty safe reason ref/code | 记录已核对依据 | application/adapter 提供可披露 code/ref；不保存 raw body/secret |
| `*Set` | ordered unique collection of typed members | 稳定闭包、比较和 view 顺序 | 按成员 typed identity 去重；序列化前顺序稳定；是否允许空集逐对象定义 |

基础 wrapper 的共同契约：空字符串一律拒绝；`Display` 不得输出 secret/raw external payload；`SafeInputDigest` 只用于同操作输入等价性，绝不是 Bundle/material 完整性摘要；`RecordVersion` 与 owner version、manifest revision、worker fence 是不同语义，禁止互换。

```rust
/// Carries an Archive-owned optimistic record version.
pub struct RecordVersion(pub u64);

/// Carries an optimistic version for an Archive job.
pub struct ArchiveJobVersion(pub RecordVersion);

/// Carries an optimistic version for an Archive Bundle aggregate.
pub struct ArchiveBundleVersion(pub RecordVersion);

/// Identifies an immutable restore plan revision.
pub struct RestorePlanRevision(pub u64);

/// Identifies a positive attempt ordinal for one external effect intent.
pub struct ExternalAttemptNumber(pub u32);

/// Records the time at which Archive persisted an observation.
pub struct RecordedAt(pub core_contracts::metadata::Timestamp);

/// Points to either kind of locally admitted operation request.
pub enum OperationRequestRef {
    /// Points to an archive request.
    Archive(ArchiveRequestRef),
    /// Points to a restore request.
    Restore(RestoreRequestRef),
}

/// Classifies an admitted operation request without carrying its identity.
pub enum OperationRequestKind {
    /// Identifies an archive request.
    Archive,
    /// Identifies a restore request.
    Restore,
}

/// Pins a specific Bundle and immutable manifest revision.
pub struct BundleRevisionRef {
    /// Identifies the Bundle.
    pub bundle_ref: ArchiveBundleRef,
    /// Identifies the immutable manifest revision.
    pub manifest_revision: ManifestRevisionId,
}

/// Pins one immutable scope declaration owned by an archive request.
pub struct DeclaredScopeRef {
    /// Identifies the archive request.
    pub request_ref: ArchiveRequestRef,
    /// Identifies the immutable scope declaration revision.
    pub scope_version: ScopeDeclarationVersion,
}

/// Points to one immutable source-capture finding.
pub struct SourceCaptureFindingRef(pub SourceCaptureFindingId);

/// Points to one immutable manifest-closure finding.
pub struct ClosureFindingRef(pub ClosureFindingId);

/// Points to one immutable verification or compatibility finding.
pub struct VerificationFindingRef(pub VerificationFindingId);

/// Identifies one target owner together with its source-authority class.
pub struct RestoreOwnerRef {
    /// Identifies the formal target owner.
    pub owner_ref: OwnerRef,
    /// Identifies the owner's source-authority class.
    pub source_class: SourceClass,
}

/// Records the evidence shape used to create a final request admission outcome.
pub enum RequestAdmissionBasis {
    /// Carries the formal authority for an accepted request.
    Accepted(AuthorityRef),
    /// Carries a safe definite rejection basis.
    Rejected(SafeReasonRef),
    /// Carries a safe unavailable or conflicting prerequisite basis.
    Blocked(RequestBlockBasis),
}
```

| 类型 | 字段 | 来源与约束 | 公开函数 |
|---|---|---|---|
| `RecordVersion` | `0: u64` | store 读取/初建映射；不是 external version | `new(u64) -> Self`、`get() -> u64`；递增由 repository/UoW 闭口 |
| `ArchiveJobVersion` | `0: RecordVersion` | job store/factory | `new(RecordVersion) -> Self`、`record_version() -> RecordVersion`；不是 stage/fence |
| `ArchiveBundleVersion` | `0: RecordVersion` | Bundle store/factory | `new(RecordVersion) -> Self`、`record_version() -> RecordVersion` |
| `RestorePlanRevision` | `0: u64` | application revision allocator / store | `try_new(u64) -> ContractResult<Self>`；必须大于 0，immutability identity，不是 optimistic version |
| `ExternalAttemptNumber` | `0: u32` | application 从该 target/action 历史推导 | `try_new(u32) -> ContractResult<Self>`；必须大于 0，不能跨 action 比较 |
| `RecordedAt` | `0: Timestamp` | application clock/可信 envelope 到达时间；只表 Archive observation | `new(Timestamp) -> Self`、`as_timestamp() -> &Timestamp` |
| `OperationRequestRef` | enum payload | 从已持久 Archive/Restore request 得到 | `request_kind() -> OperationRequestKind` |
| `BundleRevisionRef` | `bundle_ref`, `manifest_revision` | 从已固定 manifest + owning Bundle 得到 | `pub fn new(bundle_ref: ArchiveBundleRef, manifest_revision: ManifestRevisionId) -> Self`、`pub fn matches(&self, other: &Self) -> bool` |
| `DeclaredScopeRef` | `request_ref`, `scope_version` | 从已持久 archive request/scope 得到 | `pub fn new(request_ref: ArchiveRequestRef, scope_version: ScopeDeclarationVersion) -> Self`、`pub fn matches(&self, scope: &DeclaredArchiveScope) -> bool` |
| `RequestAdmissionBasis` | 三个带载荷 variant | 与 final admission 一一绑定 | `admission() -> RequestAdmissionState`、`authority_ref() -> Option<&AuthorityRef>` |

`OperationRequestRef` 变体表：

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Archive(ArchiveRequestRef)` | `Points to an archive request.` | 关联 archive job | 已受理 `ArchiveRequest` | job/request view |
| `Restore(RestoreRequestRef)` | `Points to a restore request.` | 关联 restore job | 已受理 `RestoreRequest` | job/request view |

`RequestAdmissionBasis` 变体表：

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Accepted(AuthorityRef)` | `Carries the formal authority for an accepted request.` | 保存正式受理依据 | application 已核验 authority | immutable；不得换载荷 |
| `Rejected(SafeReasonRef)` | `Carries a safe definite rejection basis.` | 保存确定拒绝依据 | local validation/authorization mapping | immutable；改善需新请求 |
| `Blocked(RequestBlockBasis)` | `Carries a safe unavailable or conflicting prerequisite basis.` | 保存 fail-closed 阻塞依据 | 缺失/冲突的正式前提 | immutable；改善需新请求 |

### 5.4 Source-authority 与 material vocabulary

```rust
/// Classifies the formal authority or explicitly non-canonical material source.
pub enum SourceClass {
    /// Canonical identity truth owned by L1-identity.
    Identity,
    /// Canonical conversation truth owned by L1-conversation.
    Conversation,
    /// Canonical work and project truth owned by L1-work.
    Work,
    /// Canonical process truth owned by L1-process.
    Process,
    /// Formal governance truth owned by L1-governance or an explicit owner.
    Governance,
    /// Artifact body and lineage truth owned by L1-artifact.
    Artifact,
    /// Read-only projection owned by L1-workspace and never canonical.
    WorkspaceProjection,
    /// Redacted audit or evidence material owned by L4-observability.
    ObservabilityMaterial,
}

/// Declares whether a source is mandatory, conditional, or auxiliary.
pub enum SourceRequiredness {
    /// The request cannot close without owner-proven coverage for this source.
    Required,
    /// The source is required only when its declared condition is formally met.
    Conditional(AuthorityRef),
    /// The source can assist inspection but cannot satisfy a canonical gap.
    Auxiliary,
}

/// Classifies an approved manifest member without transferring source authority.
pub enum ArchiveMaterialClass {
    /// An owner-approved canonical snapshot or export.
    CanonicalSnapshot,
    /// An explicitly non-canonical workspace projection.
    WorkspaceProjection,
    /// An Artifact-owned body, version, lineage, or baseline reference.
    ArtifactMaterial,
    /// A redacted observability-owned audit or evidence material reference.
    ObservabilityMaterial,
    /// A body-free formal decision reference.
    DecisionReference,
}

/// Identifies a formal source authority without copying its truth body.
pub struct SourceAuthorityRef {
    /// Classifies the authority boundary.
    pub source_class: SourceClass,
    /// Carries the owner-issued opaque identity.
    pub owner_ref: OwnerRef,
}

/// Carries all fields mapped from one formal governance decision envelope.
pub struct MappedGovernanceDecisionBinding {
    /// Carries the owner-issued decision identity.
    pub decision_id: ExternalDecisionId,
    /// Identifies the formal decision owner.
    pub owner_ref: OwnerRef,
    /// Classifies the referenced formal decision.
    pub decision_kind: GovernanceDecisionKind,
    /// Carries the owner-specific decision version.
    pub decision_version: ExternalDecisionVersion,
    /// Points to the owner-issued applicability scope.
    pub scope_ref: GovernanceDecisionScopeRef,
    /// Points to the owner-issued validity observation.
    pub validity_ref: DecisionValidityRef,
    /// Points to the safe external envelope or evidence used for mapping.
    pub source_ref: ExternalEvidenceRef,
}
```

| 类型 | 变体 / 字段 | 作用 | 来源与约束 |
|---|---|---|---|
| `SourceClass` | 八个固定变体 | 完整表达正式 source-authority matrix | 来自正式 00/01/02；Workspace/Observability 变体名称刻意暴露其非 canonical/material 性质 |
| `SourceRequiredness` | `Required/Conditional(AuthorityRef)/Auxiliary` | 区分闭包要求 | request + owner contract；Conditional 载荷指向条件依据，不能由 Archive 猜测 |
| `ArchiveMaterialClass` | 五个固定变体 | 保留 manifest provenance | 从 source adapter 的 approved material mapping；不允许 generic `Other` 吞边界 |
| `SourceAuthorityRef` | `source_class`, `owner_ref` | 绑定类别与 authority | `OwnerRef` 为 body-free opaque owner identity；class/owner 必须一致，由 adapter 验证 |
| `MappedGovernanceDecisionBinding` | decision 六字段 + `source_ref` | 为 `GovernanceDecisionRef::bind` 提供完整、可追溯输入 | 只由 Step 7 governance adapter 从一个正式 envelope 原子映射；不保存 decision/policy body |

`SourceClass` 的每个 variant 均为分类值，不是状态机，允许来源/去向均“不适用”；禁止在绑定生命周期中从 `WorkspaceProjection`/`ObservabilityMaterial` 迁移成任一 canonical L1 class。`SourceRequiredness::Conditional(AuthorityRef)` 的载荷是“条件存在的正式依据”，不是规则正文。

```rust
/// Selects an owner-defined archive slice without embedding owner data.
pub struct OwnerSliceSelector {
    /// Identifies the source class.
    pub source_class: SourceClass,
    /// Carries an owner-understood opaque selector reference.
    pub selector_ref: SliceSelectorRef,
}

/// Declares one requested archive slice.
pub struct ArchiveSliceSelector {
    /// Selects the owner-defined slice.
    pub selector: OwnerSliceSelector,
    /// Declares whether the slice participates in closure.
    pub requiredness: SourceRequiredness,
}

/// Declares one explicit exclusion and its formal basis.
pub struct ArchiveSliceExclusion {
    /// Selects the excluded owner-defined slice.
    pub selector: OwnerSliceSelector,
    /// Points to the formal exclusion basis.
    pub basis_ref: AuthorityRef,
}
```

| 类型 | 集合约束 | 来源 | 禁止事项 |
|---|---|---|---|
| `ArchiveSliceSelectorSet` | 非空；按 `(source_class, selector_ref)` 唯一且稳定排序 | RequestArchive 经 Step 8 校验的声明 | 不隐式补齐八类 source |
| `ArchiveSliceExclusionSet` | 可空；不能与 requested selector 重复 | 请求显式排除 + authority ref | 不以自由文本替代依据 |
| `RestoreTargetOwnerSet` | 非空；owner typed identity 唯一 | RequestRestore 显式目标 | 不暗含“全部 owner” |
| `ArchivedMaterialRefSet` | 可空但空不等 Missing；按 material ref 唯一 | source adapter mapped result | 不由长度推导 coverage |
| `ManifestEntrySet` | 按 entry identity 唯一且稳定 | fixed inventory | declared/actual 分别保存，不合并去重掩盖差异 |

### 5.5 主要公共状态 enum

#### 5.5.1 admission、job 与 source

```rust
/// Records a final local admission outcome.
pub enum RequestAdmissionState {
    /// Archive accepted the request into its local workflow.
    Accepted,
    /// Archive rejected the request using a definite local rule.
    Rejected,
    /// Archive could not prove a required authority or contract prerequisite.
    Blocked,
}

/// Records the conservative aggregate posture of an Archive job.
pub enum JobAggregatePosture {
    /// The job is committed locally and waiting to start.
    Queued,
    /// At least one bounded stage is actively progressing.
    Running,
    /// Some local results exist but the declared workflow is incomplete.
    Partial,
    /// A formal prerequisite cannot currently be proven.
    Blocked,
    /// The current attempt has a definite failure.
    Failed,
    /// Every required Archive-owned endpoint has committed locally.
    Completed,
}

/// Records the lifecycle of one source binding.
pub enum SourceBindingState {
    /// The binding has been planned from the declared scope.
    Planned,
    /// The authority and contract context have been formally bound.
    Bound,
    /// A required authority or contract prerequisite is unavailable.
    Blocked,
    /// A newer request or revision replaced the binding.
    Retired,
}

/// Records the lifecycle of one fixed source capture attempt.
pub enum CaptureAttemptState {
    /// The capture intent has been persisted.
    Requested,
    /// The formal source interaction is in progress.
    InProgress,
    /// The mapped result has been persisted for this exact attempt.
    Settled,
    /// A formal prerequisite cannot currently be proven.
    Blocked,
    /// The source returned a definite failure for this attempt.
    Failed,
    /// A replacement attempt prevents further commits to this attempt.
    Superseded,
}
```

| enum | 初始 / 构造来源 | 允许去向摘要 | 终态 / 红线 |
|---|---|---|---|
| `RequestAdmissionState` | factory 直接确定三者之一 | 无原地迁移 | Rejected/Blocked 改善须新请求语境；Accepted 不等批准 |
| `JobAggregatePosture` | `Queued` | Queued→Running；Running↔Partial；Running/Partial→Blocked/Failed/Completed；Blocked→Running（同冻结输入正式解阻） | Completed 不回 Running；不传播项目状态 |
| `SourceBindingState` | `Planned` | Planned→Bound/Blocked/Retired；Blocked→Bound；Bound→Retired | Retired 不复活；Auxiliary 不变 canonical |
| `CaptureAttemptState` | `Requested` | Requested→InProgress；InProgress→Settled/Blocked/Failed/Superseded；Blocked→InProgress（同 fixed input） | Settled/Failed/Superseded 当前 attempt 终局；timeout 不等 Failed |

```rust
/// Records owner-proven capture coverage for one declared scope.
pub enum CaptureCoveragePosture {
    /// The owner formally proved coverage of the declared scope.
    Complete,
    /// The owner formally proved only a subset of the declared scope.
    Partial,
    /// The owner formally reported that required material is absent.
    Missing,
    /// The owner result does not satisfy the requested fence.
    Stale,
    /// Authority, version, or coverage evidence conflicts.
    Conflicting,
    /// Available evidence is insufficient to decide coverage.
    Unknown,
}
```

`CaptureCoveragePosture` 是 immutable assessment 分类；所有变体由 owner coverage evidence 映射，去向“不适用”，新证明产生新的 `CaptureCoverage`。只有 `Complete` 可满足该 binding 的 closure 前提，且不代表跨 owner 一致。

#### 5.5.2 Bundle、verification 与 compatibility

```rust
/// Records the Archive-owned lifecycle of a Bundle.
pub enum ArchiveBundleState {
    /// The Bundle identity exists without a fixed manifest revision.
    Draft,
    /// A new immutable manifest revision is being assembled.
    Assembling,
    /// The fixed manifest has complete closure.
    ClosureReady,
    /// All required fixed-input Archive seal guards passed.
    Sealed,
    /// A required formal prerequisite is unavailable.
    Blocked,
    /// The current assembly or seal attempt failed definitively.
    Failed,
}

/// Classifies closure of one immutable manifest revision.
pub enum ManifestClosurePosture {
    /// Declared and actual approved entry sets close exactly.
    Complete,
    /// One or more declared entries are missing.
    Incomplete,
    /// One or more undeclared or unapproved entries are present.
    Overfull,
    /// An entry violates identity, authority, or class invariants.
    Invalid,
    /// Available evidence cannot support a reliable comparison.
    Unknown,
}

/// Records integrity assessment for one fixed input binding.
pub enum VerificationPosture {
    /// The fixed input has been recorded and is waiting for assessment.
    Pending,
    /// A formal integrity capability is assessing the fixed input.
    InProgress,
    /// The capability formally verified the fixed input.
    Verified,
    /// The capability formally reported a digest or signature failure.
    IntegrityFailed,
    /// The capability result is insufficient or ambiguous.
    Unknown,
    /// A capability, key, input, or authority prerequisite is unavailable.
    Blocked,
}

/// Records target-specific schema and version compatibility.
pub enum CompatibilityPosture {
    /// A formal capability supports the exact target context.
    Supported,
    /// A formal capability does not support the exact target context.
    Unsupported,
    /// Available evidence is insufficient to decide support.
    Unknown,
    /// Version or capability declarations conflict.
    Conflicting,
}
```

| enum | 初始 / 来源 | 允许去向摘要 | 终态 / 红线 |
|---|---|---|---|
| `ArchiveBundleState` | Draft | Draft→Assembling；Assembling→ClosureReady/Blocked/Failed；ClosureReady→Sealed；Blocked→Assembling 仅新 manifest revision | Sealed 终局且不等 project archived；Failed retry 规则留 Step 10/12 |
| `ManifestClosurePosture` | pure evaluation | immutable，去向不适用 | Complete 不等 Verified/Placed/Sealed |
| `VerificationPosture` | Pending | Pending→InProgress；InProgress→Verified/IntegrityFailed/Unknown/Blocked | fixed input 不原地重验；fake/config 不升格 Verified |
| `CompatibilityPosture` | formal mapped assessment | immutable，去向不适用 | target-specific；Unsupported/Unknown/Conflicting 不进 restore |

#### 5.5.3 placement、lifecycle 与 restore

```rust
/// Records placement effect progress for one fixed Bundle revision.
pub enum PlacementState {
    /// A stable external placement intent has been persisted.
    IntentRecorded,
    /// The intent was dispatched without a definite commit result.
    Dispatched,
    /// A formal external commit was observed.
    Committed,
    /// The external effect may have committed and requires a probe.
    CommitUnknown,
    /// A required prerequisite is unavailable.
    Blocked,
    /// A definite external failure was observed.
    Failed,
}

/// Records retrievability independently from placement commit.
pub enum RetrievalState {
    /// Archive cannot currently establish whether retrieval was requested.
    Unknown,
    /// No retrieval intent has been recorded.
    NotRequested,
    /// A retrieval intent has been recorded or dispatched.
    Requested,
    /// A formal capability reported the fixed revision as retrievable.
    Retrievable,
    /// A formal capability reported the fixed revision as unavailable.
    Unavailable,
    /// A definite retrieval attempt failed.
    Failed,
}

/// Records execution of one formally authorized lifecycle action.
pub enum LifecycleExecutionState {
    /// The formal decision is applicable and no conflicting hold is known.
    Eligible,
    /// A stable external effect intent has been persisted.
    IntentRecorded,
    /// The intent was dispatched without a definite result.
    Dispatched,
    /// The external system acknowledged receipt without proving commit.
    Acknowledged,
    /// A formal external commit was observed.
    Committed,
    /// The external effect may have committed and requires a probe.
    CommitUnknown,
    /// A hold, conflict, expiry, or prerequisite blocks progress.
    Blocked,
    /// A definite failure was observed.
    Failed,
    /// A formally authorized compensation completed.
    Compensated,
}
```

| enum | 初始 / 来源 | 允许去向摘要 | 红线 |
|---|---|---|---|
| `PlacementState` | IntentRecorded | →Dispatched→Committed/CommitUnknown/Blocked/Failed；CommitUnknown→Committed/Failed/CommitUnknown via probe | ACK/timeout 不等 commit；未知不盲重发 |
| `RetrievalState` | Unknown 或 NotRequested（有明确本地历史时） | NotRequested→Requested→Retrievable/Unavailable/Failed | Committed 不推导 Retrievable |
| `LifecycleExecutionState` | Eligible | →IntentRecorded→Dispatched→Acknowledged/Committed/CommitUnknown/Blocked/Failed；unknown 经 probe；Failed/Blocked 仅正式补偿→Compensated | 无 decision 不 Eligible；ACK 不等 commit；本地 Blocked 不抹除效果 |

```rust
/// Records the aggregate progress of one immutable restore plan revision.
pub enum RestorePlanState {
    /// The plan is enumerating fixed per-owner items.
    Draft,
    /// Every required item has enough prerequisites to begin handoff.
    Ready,
    /// A required integrity, compatibility, retrieval, authority, or receiver prerequisite is unavailable.
    Blocked,
    /// At least one item handoff is in progress.
    InProgress,
    /// Item outcomes are mixed or incomplete.
    Partial,
    /// Every required item has a definite receiver outcome.
    HandoffComplete,
    /// A definite plan-level failure prevents completion.
    Failed,
    /// A newer immutable plan revision replaced this plan.
    Superseded,
}

/// Records progress for one owner-specific restore item.
pub enum RestoreItemState {
    /// The owner and source entries have been enumerated.
    Planned,
    /// A safety or authority prerequisite is unavailable.
    Blocked,
    /// The minimal owner-specific material has been fixed.
    MaterialReady,
    /// A stable handoff intent exists and is waiting for dispatch.
    HandoffPending,
    /// The receiver interaction is in progress.
    InProgress,
    /// The receiver formally reported success for this item.
    Succeeded,
    /// The receiver formally rejected this item.
    Rejected,
    /// The receiver reported a definite failure.
    Failed,
    /// The receiver may have committed and requires reconciliation.
    CommitUnknown,
    /// A formally authorized compensation is pending.
    CompensationPending,
    /// A formally authorized compensation completed.
    Compensated,
}

/// Records one owner-specific restore handoff effect.
pub enum RestoreHandoffState {
    /// A stable receiver handoff intent has been persisted.
    IntentRecorded,
    /// The handoff was dispatched without a definite result.
    Dispatched,
    /// The receiver acknowledged receipt without proving commit.
    Acknowledged,
    /// The receiver formally reported success for the handoff.
    Succeeded,
    /// The receiver formally rejected the handoff.
    Rejected,
    /// The receiver reported a definite failure.
    Failed,
    /// The receiver may have committed and requires reconciliation.
    CommitUnknown,
    /// The handoff must be probed or reviewed before retry or compensation.
    ReconcileRequired,
}

/// Records a formally authorized compensation effect.
pub enum CompensationState {
    /// A formal authority approved the compensation plan.
    Planned,
    /// The compensation interaction is in progress.
    InProgress,
    /// The compensation boundary reported definite completion.
    Completed,
    /// The compensation reported a definite failure.
    Failed,
    /// The compensation may have committed and requires reconciliation.
    CommitUnknown,
    /// A required authority, receiver, or safety prerequisite is unavailable.
    Blocked,
}
```

| enum | 初始 / 来源 | 允许去向摘要 | 红线 |
|---|---|---|---|
| `RestorePlanState` | Draft | Draft→Ready/Blocked；Ready→InProgress；InProgress→Partial/HandoffComplete/Failed；非终态→Superseded | HandoffComplete 不等 owner/project restored |
| `RestoreItemState` | Planned | Planned→MaterialReady/Blocked；MaterialReady→HandoffPending→InProgress→Succeeded/Rejected/Failed/CommitUnknown；unknown 经 reconcile；正式补偿路径 | owner 间不传播；unsafe 输入不 MaterialReady |
| `RestoreHandoffState` | IntentRecorded | →Dispatched→Acknowledged/Succeeded/Rejected/Failed/CommitUnknown；unknown→ReconcileRequired→确定结果/仍未知 | ACK/event delivery 不等 commit；不直写 owner DB |
| `CompensationState` | Planned | →InProgress→Completed/Failed/CommitUnknown/Blocked；unknown 仅经 probe | Completed 不抹除原 handoff |

### 5.6 分类、finding 与 fixed-input helper

```rust
/// Classifies a source capture finding without exposing raw source data.
pub enum SourceCaptureFindingKind {
    /// The owner proved only partial coverage.
    Partial,
    /// The owner formally reported required material as missing.
    Missing,
    /// The result did not satisfy the requested fence.
    Stale,
    /// Source authority, version, or coverage evidence conflicted.
    Conflicting,
    /// Material was intentionally removed or hidden under an approved rule.
    Redacted,
    /// Available evidence was insufficient to classify the result.
    Unknown,
}

/// Classifies a manifest closure difference.
pub enum ClosureFindingKind {
    /// A declared entry is absent from the actual approved set.
    Missing,
    /// An undeclared or unapproved entry appears in the actual set.
    Unexpected,
    /// An entry violates identity, authority, or class invariants.
    Invalid,
    /// Available evidence cannot support a reliable comparison.
    Unknown,
}

/// Classifies a safe integrity or compatibility finding.
pub enum VerificationFindingKind {
    /// A formal digest comparison did not match.
    Mismatch,
    /// A formal signature capability reported an invalid signature.
    SignatureInvalid,
    /// A required key capability was unavailable.
    KeyUnavailable,
    /// The exact target context does not support the version.
    UnsupportedVersion,
    /// Capability or version declarations conflicted.
    Conflicting,
    /// Available evidence was insufficient to classify the result.
    Unknown,
}

/// Selects the exact context for compatibility assessment.
pub enum CompatibilityTargetContext {
    /// Assesses support for Archive verification.
    Verification,
    /// Assesses support for an authorized read path.
    Read,
    /// Assesses support for one exact restore receiver.
    RestoreReceiver(RestoreReceiverRef),
}
```

这些分类 enum 均非可变状态机，允许来源为对应 pure/domain evaluation 或经 adapter 验证的 mapped feedback，允许去向“不适用”。`RestoreReceiver(RestoreReceiverRef)` 载荷固定唯一 receiver，禁止把 Read/Verification 结论复用于 restore。

```rust
/// Pins every input used by one integrity assessment.
pub struct VerificationInputBinding {
    /// Pins the Bundle and manifest revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Pins the ordered approved material references.
    pub material_refs: ArchivedMaterialRefSet,
}

/// Carries only safe references produced by a formal integrity capability.
pub struct IntegrityEvidence {
    /// Pins every immutable input covered by the evidence.
    pub input_binding: VerificationInputBinding,
    /// Points to the capability contract and version used.
    pub capability_ref: IntegrityCapabilityRef,
    /// Points to formal digest outputs, if any.
    pub digest_refs: DigestRefSet,
    /// Points to formal signature outputs, if any.
    pub signature_refs: SignatureRefSet,
}

/// Carries only safe owner coverage evidence for one fixed source binding.
pub struct OwnerCoverageEvidence {
    /// Identifies the source authority.
    pub authority_ref: SourceAuthorityRef,
    /// Pins the declared scope certified by the owner.
    pub declared_scope_ref: DeclaredScopeRef,
    /// Pins the requested slice within that scope.
    pub selector: OwnerSliceSelector,
    /// Carries the owner's explicit coverage classification.
    pub posture: CaptureCoveragePosture,
    /// Carries the owner-specific version without cross-owner ordering.
    pub source_version_ref: Option<SourceVersionRef>,
    /// Carries the owner-issued coverage proof.
    pub coverage_ref: OwnerCoverageRef,
    /// Carries the fence proven by the owner, if supported.
    pub fence_ref: Option<SnapshotFenceRef>,
}
```

| helper | 字段来源 | 不变量 |
|---|---|---|
| `VerificationInputBinding` | fixed manifest revision + CP2 approved material refs | equality 覆盖两个字段；任何输入变化都需新 assessment |
| `IntegrityEvidence` | `IntegrityCapabilityPort` mapped outcome | 不含 algorithm/key/secret/raw response；空 digest/signature set 不能支持 Verified |
| `OwnerCoverageEvidence` | `SourceExportPort` mapped owner proof | authority 必须与 binding 相同；无 coverage ref 不能构造；version/fence 不跨 owner 比较 |

`OwnerCoverageEvidence::bind(authority_ref: SourceAuthorityRef, declared_scope_ref: DeclaredScopeRef, selector: OwnerSliceSelector, posture: CaptureCoveragePosture, source_version_ref: Option<SourceVersionRef>, coverage_ref: OwnerCoverageRef, fence_ref: Option<SnapshotFenceRef>) -> ContractResult<Self>` 覆盖全部字段，要求 class/selector 一致；`matches_scope(&self, scope: &DeclaredScopeRef) -> bool` 纯比较，外部 proof 语义由 owner port 验证。`IntegrityEvidence::bind(input_binding: VerificationInputBinding, capability_ref: IntegrityCapabilityRef, digest_refs: DigestRefSet, signature_refs: SignatureRefSet) -> ContractResult<Self>` 要求至少一类 evidence 非空；`matches(&self, input: &VerificationInputBinding, capability: &IntegrityCapabilityRef) -> bool` 供 settle Verified 做 exact input/capability 校验。

补充的 opaque ref/value 与 ordered-unique set 定义如下；同样不固定内部编码：

```rust
/// Declares additional body-free external and Archive-local value types.
opaque_string_types! {
    ProjectRef, OwnerRef, SliceSelectorRef, ExternalDecisionId,
    GovernanceDecisionScopeRef, DecisionValidityRef, OwnerCoverageRef,
    ArchivedMaterialRef, IntegrityCapabilityRef, CompatibilityCapabilityRef,
    CapabilityEvidenceRef, StorageIntent
}

/// Declares ordered collections with type-specific uniqueness rules.
ordered_unique_set_types! {
    ArchiveSliceSelectorSet => ArchiveSliceSelector,
    ArchiveSliceExclusionSet => ArchiveSliceExclusion,
    ArchivedMaterialRefSet => ArchivedMaterialRef,
    ManifestEntryRefSet => ManifestEntryRef,
    DigestRefSet => DigestRef,
    SignatureRefSet => SignatureRef,
    SchemaVersionRefSet => SchemaVersionRef,
    CompatibilityAssessmentRefSet => CompatibilityAssessmentRef,
    SourceCaptureFindingRefSet => SourceCaptureFindingRef,
    ClosureFindingRefSet => ClosureFindingRef,
    VerificationFindingRefSet => VerificationFindingRef,
    ExternalActionRecordRefSet => ExternalActionRecordRef,
    RestoreTargetOwnerSet => RestoreOwnerRef,
    RestoreItemRefSet => RestoreItemRef,
    RestoreItemPostureSet => RestoreItemPosture,
    JobComponentPostureSet => JobComponentPosture
}
```

`SourceCaptureFindingRef`、`ClosureFindingRef`、`VerificationFindingRef` 按本节 typed-ref 规则定义，分别只含对应 finding ID；`RestoreOwnerRef` 是 `OwnerRef + SourceClass` 的不可变组合，不携带 owner body。`CapabilityEvidenceRef` 是已存在时才传入的 body-free ref，optional 由字段上的 `Option<CapabilityEvidenceRef>` 表达，不使用名称自带 Optional 的双重 optional 类型。`CompatibilityAssessmentRefSet` 只接受同一 Bundle revision 所需目标语境的 assessment ref。集合统一提供 `try_from_iter`、`iter`、`len`、`is_empty`；会参与 closure/fixed-input 的集合必须按 typed identity 稳定排序并拒绝重复，不能使用运行时 hash 顺序影响 digest 或 equality。

`ArchiveReadSubjectRef` 与 `ArchiveRecordRef` 的每个带载荷 variant 均只携带上文明确的 typed ref：前者只允许五类 Query selector 使用，后者只允许 job component safe summary 使用；二者均不得携带 domain body，也不得依据字符串猜测 variant。`ExternalEventRef` 只来源于可信 inbound envelope；`StoredResultSurfaceRef` 只来源于本地 result store save；`LifecycleCompensationEvidenceRef` 只指向针对 lifecycle execution 的正式 compensation completion 证明，不能与 restore-only `CompensationRecordRef` 互换。

#### source-authority matrix 的类型落点

| `SourceClass` | formal authority | 合法 `ArchiveMaterialClass` | 必需 provenance | restore handoff | 禁止解释 |
|---|---|---|---|---|---|
| `Identity` | `L1-identity` | `CanonicalSnapshot` | owner/version/fence/coverage | identity 正式 receiver | identity truth/body |
| `Conversation` | `L1-conversation` | `CanonicalSnapshot` | owner/version/coverage；fence 若合同支持 | conversation 正式 receiver | 未授权对话正文 |
| `Work` | `L1-work` | `CanonicalSnapshot`、获准 `DecisionReference` | project/work version/fence/coverage | work 正式 receiver/command seam | archived/dissolved/restored 状态写权 |
| `Process` | `L1-process` | `CanonicalSnapshot` | process/activity/checkpoint version/coverage | process 正式 receiver | replay/推进运行 truth |
| `Governance` | `L1-governance` / 明确 owner | `CanonicalSnapshot` 或 `DecisionReference` | decision/version/scope/validity 或 approved material coverage | governance 正式 receiver | policy、期限、hold/delete/risk 裁决 |
| `Artifact` | `L1-artifact` | `ArtifactMaterial` | artifact version/lineage/baseline/coverage ref | artifact 正式 receiver | ref 集合等于正文/血缘闭包 |
| `WorkspaceProjection` | `L1-workspace` projection owner | `WorkspaceProjection` | projection revision/generation/source coverage | 仅正式提供时的 workspace seam | 任一 L1 canonical truth |
| `ObservabilityMaterial` | `L4-observability` | `ObservabilityMaterial` | redaction/material boundary/coverage | observability 正式 handoff seam | 完整 audit chain/backend truth |

该矩阵是 `ArchiveSourceBinding`、`ManifestEntry`、`RestoreItem` 的共同校验输入。任何 adapter 若无法同时给出合法 class/authority/material/provenance，必须映射为 Blocked/Unknown，而不是构造弱类型 ref。

### 5.7 其余公共 enum 与 helper

```rust
/// Distinguishes archive and restore coordination jobs.
pub enum ArchiveJobKind {
    /// Coordinates creation and sealing of an Archive Bundle.
    Archive,
    /// Coordinates an owner-specific restore handoff workflow.
    Restore,
}

/// Identifies the bounded logical stage currently coordinated by a job.
pub enum ArchiveJobStage {
    /// The job is committed locally and awaiting bounded work.
    Queued,
    /// Source bindings are being derived from a frozen archive scope.
    SourcePlanning,
    /// Owner-approved source material is being captured or reconciled.
    SourceCapture,
    /// An immutable manifest revision and closure are being assembled.
    ManifestAssembly,
    /// Fixed-input integrity and compatibility are being assessed.
    Verification,
    /// The fixed Bundle revision is being placed or retrieved.
    Placement,
    /// Archive-owned seal guards are being evaluated.
    Sealing,
    /// Per-owner restore items are being built from a fixed Bundle revision.
    RestorePlanning,
    /// Minimal owner-specific restore material is being prepared.
    MaterialPreparation,
    /// Owner-specific receiver handoffs are being dispatched or observed.
    RestoreHandoff,
    /// An ambiguous external effect is being probed.
    Reconciliation,
    /// A formally authorized compensation is being executed.
    Compensation,
    /// Every required Archive-owned endpoint has committed locally.
    Completed,
}

/// Classifies the formal decision referenced by Archive.
pub enum GovernanceDecisionKind {
    /// Requires retention under an owner-defined policy and duration.
    Retain,
    /// Places an owner-defined legal or governance hold.
    Hold,
    /// Formally releases a previously identified hold.
    ReleaseHold,
    /// Authorizes a specific deletion action.
    DeleteAuthorize,
    /// Records an owner-approved risk acceptance reference.
    RiskAccept,
}

/// Classifies an Archive-executable lifecycle action.
pub enum LifecycleActionKind {
    /// Maintains the current retained placement under the formal decision.
    Retain,
    /// Requests a provider-neutral storage tier transition.
    TierTransition,
    /// Executes a specifically authorized deletion effect.
    Delete,
}

/// Identifies which Archive-owned object an external action targets.
pub enum ExternalActionTargetRef {
    /// Targets a storage placement.
    Placement(ArchivePlacementRef),
    /// Targets a governance-bound lifecycle execution.
    Lifecycle(LifecycleExecutionRef),
}

/// Records one mapped external action outcome without retaining raw payloads.
pub enum ExternalActionPosture {
    /// A stable effect intent exists locally.
    IntentRecorded,
    /// The effect was dispatched without a definite outcome.
    Dispatched,
    /// The external system acknowledged receipt without proving commit.
    Acknowledged,
    /// A formal external commit was observed.
    Committed,
    /// The effect may have committed and requires a probe.
    CommitUnknown,
    /// A definite external failure was observed.
    Failed,
}

/// Classifies one receiver feedback observation.
pub enum ReceiverOutcomePosture {
    /// The receiver acknowledged the handoff without proving commit.
    Acknowledged,
    /// The receiver formally reported success for this handoff.
    Succeeded,
    /// The receiver formally rejected the handoff.
    Rejected,
    /// The receiver reported a definite failure.
    Failed,
    /// Receiver feedback conflicts with a previously stored outcome.
    Conflicting,
    /// The receiver may have committed and requires reconciliation.
    CommitUnknown,
}

/// Classifies an owner-authorized response to an ambiguous or failed handoff.
pub enum CompensationAction {
    /// Retries only after a formal probe established that no commit occurred.
    RetryAfterProbe,
    /// Requests cancellation through the formal receiver boundary.
    Cancel,
    /// Requests a receiver-supported reverse action.
    Reverse,
    /// Routes the handoff to a formally authorized manual process.
    ManualHandoff,
}
```

| enum | 来源 | 允许去向 / 使用 | 禁止事项 |
|---|---|---|---|
| `ArchiveJobKind` | request kind | immutable 分类 | 同一 job 不混合 archive/restore |
| `ArchiveJobStage` | `ArchiveJob.advance` + kind-specific stage guard | Archive 只走 SourcePlanning→SourceCapture→ManifestAssembly→Verification→Placement→Sealing→Completed；Restore 只走 RestorePlanning→MaterialPreparation→RestoreHandoff，并按需进入 Reconciliation/Compensation→Completed | 不以 stage 单独推导 aggregate Completed；exact retry 留 Step 10 |
| `GovernanceDecisionKind` | owner-issued decision mapping | immutable 分类 | Archive 不生成、解释或扩展决定；无 generic `Other` |
| `LifecycleActionKind` | formal decision applicability result | Retain/TierTransition/Delete | 不含“release hold”执行；hold/release 是 owner decision，不是 Archive storage action |
| `ExternalActionTargetRef` | placement/lifecycle service | 路由已持久 effect owner | worker 不解析字符串猜 owner |
| `ExternalActionPosture` | mapped storage/lifecycle feedback | 单次 action history | ACK/timeout 不升格 Committed |
| `ReceiverOutcomePosture` | mapped receiver feedback | `HandoffOutcome` immutable observation | 不代表 owner 当前业务 truth |
| `CompensationAction` | formal `CompensationAuthorityRef` | 仅指定 handoff | Archive 不从错误类型自动选择动作 |

```rust
/// Identifies either integrity or compatibility assessment ownership.
pub enum AssessmentRef {
    /// Points to an integrity assessment.
    Integrity(VerificationAssessmentRef),
    /// Points to a target-specific compatibility assessment.
    Compatibility(CompatibilityAssessmentRef),
}

/// Identifies one of the six bounded Archive capability components.
pub enum JobComponentKind {
    /// Represents request admission and bounded job coordination.
    RequestAndJob,
    /// Represents source binding, capture, coverage, and findings.
    SourceCapture,
    /// Represents immutable manifest assembly and closure.
    BundleAssembly,
    /// Represents fixed-input integrity and compatibility assessment.
    Verification,
    /// Represents placement, retrieval, and governance-bound lifecycle effects.
    PlacementAndLifecycle,
    /// Represents per-owner restore planning and handoff effects.
    Restore,
}

/// Records one conservative component posture for job aggregation.
pub enum ComponentPosture {
    /// Required work has not begun or has no committed positive result.
    Pending,
    /// At least one bounded operation is progressing.
    Running,
    /// Some committed results exist but the component is incomplete.
    Partial,
    /// A required formal prerequisite is unavailable.
    Blocked,
    /// A definite current attempt failure was committed.
    Failed,
    /// Every required Archive-owned endpoint for the component committed.
    Completed,
}

/// Carries the persisted basis required to seal one fixed Bundle revision.
pub struct BundleSealBasis {
    /// Pins the Bundle revision being sealed.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Points to a verified integrity assessment for the same input.
    pub verification_ref: VerificationAssessmentRef,
    /// Points to required compatibility assessments for the intended Archive uses.
    pub compatibility_refs: CompatibilityAssessmentRefSet,
    /// Points to a committed placement for the same input.
    pub placement_ref: ArchivePlacementRef,
}

/// Carries the conservative posture of one job component.
pub struct JobComponentPosture {
    /// Identifies the bounded component using a stable Archive-defined code.
    pub component: JobComponentKind,
    /// Carries the committed local posture.
    pub posture: ComponentPosture,
    /// Points to the committed record that supports the posture.
    pub basis_ref: ArchiveRecordRef,
}
```

`AssessmentRef` 两个 variant 的 payload 均只指向本地 assessment；不携带 assessment body。`BundleSealBasis` 由 application 从已提交对象构造，四类引用必须匹配同一 `BundleRevisionRef`；缺任一 required basis 都不能调用 `seal`。`JobComponentKind` 是有限公共 enum，变体为 `RequestAndJob / SourceCapture / BundleAssembly / Verification / PlacementAndLifecycle / Restore`；`ComponentPosture` 变体为 `Pending / Running / Partial / Blocked / Failed / Completed`。每个 variant 的英文 Rustdoc 分别直接说明所代表 CP 能力或保守姿态，来源只允许对应已提交 Archive record，去向只允许 `JobComponentPosture`；不得用一个 CP 的 Completed 推导 job Completed。`ArchiveRecordRef` 必须与 component kind 匹配。

所有 domain transition return carrier 归各 owning domain 文件，供 application 使用，不进入 contracts/public protocol。共同 schema 如下，类型别名按表精确实例化，不再使用“至少包含”或实现侧补字段。

```rust
/// Returns a validated in-memory state change; persistence assigns the next version.
pub struct StateTransition<S, V> {
    /// Captures the state before validation and mutation.
    pub before: S,
    /// Captures the state after successful validation.
    pub after: S,
    /// Pins the loaded version required by the subsequent compare-and-swap.
    pub expected_version: V,
}

/// Preserves a safe basis within its owning object's append-only history.
pub struct BasisObservation<B> {
    /// Pins the object version at which the basis was observed.
    pub expected_version: RecordVersion,
    /// Carries a typed reason or formal reference without an external body.
    pub basis: B,
}

/// Returns a stage change together with the basis required by stage history.
pub struct StageTransition {
    /// Carries the exact before/after stage and expected job version.
    pub change: StateTransition<ArchiveJobStage, ArchiveJobVersion>,
    /// Carries the supplied stage basis without regenerating it.
    pub basis: StageBasis,
}
```

| alias | `StateTransition<S, V>` 精确参数 |
|---|---|
| `JobAggregateTransition` | `JobAggregatePosture, ArchiveJobVersion` |
| `BindingTransition` | `SourceBindingState, RecordVersion` |
| `AttemptTransition` | `CaptureAttemptState, RecordVersion` |
| `BundleTransition` | `ArchiveBundleState, ArchiveBundleVersion` |
| `AssessmentTransition` | `VerificationPosture, RecordVersion` |
| `PlacementTransition` / `RetrievalTransition` | `PlacementState, RecordVersion` / `RetrievalState, RecordVersion` |
| `LifecycleTransition` / `ActionTransition` | `LifecycleExecutionState, RecordVersion` / `ExternalActionPosture, RecordVersion` |
| `PlanTransition` / `ItemTransition` | `RestorePlanState, RecordVersion` / `RestoreItemState, RecordVersion` |
| `HandoffTransition` / `CompensationTransition` | `RestoreHandoffState, RecordVersion` / `CompensationState, RecordVersion` |

`StateTransition::new(before: S, after: S, expected_version: V) -> Self` 仅由已通过对象 guard 的 mutation 生成，允许同 state 但字段发生变更。`BasisObservation::record(expected_version: RecordVersion, basis: B) -> Self` 仅复制调用方已提供的安全依据；它无独立 ID，归 owning object 内嵌 append-only `Vec`，按提交顺序追加，保存/读取该对象时必须原样 round-trip。不得单独覆盖、清空、去重掉不同 observation，CAS 拒绝则整体不追加；不构成第 27 个正式对象或审计后端。只含 basis 的对象历史不声称有事件发生时间。

所有 mutable truth 的字段在代码块中展示逻辑 schema；实施时用 private fields + validated factory/transition + checked rehydrate 保护不变量，不允许 struct literal 绕过 guard。`RecordVersion` 仅由 store/UoW 在 CAS 成功后提供新值，内存 mutation 不自行递增。返回 error 时对象原状保留。公开协议不得暴露上述 generic/domain history body。

### 5.8 Shared helper 的完整构造与判定契约

以下补齐已有 schema 的函数，不新增正式对象。类型/字段以各对象代码块为准；成员 accessor 统一为 `pub fn <field>(&self) -> &<FieldType>`，仅借用字段，不解析 opaque ref。invariant-bearing helper 实施时字段私有，禁止 unchecked literal/deserialize 绕过 factory。

#### Opaque value、typed ref 与 collection

| 模板 | 完整函数签名 | 来源 / 限制 |
|---|---|---|
| 本模块 String newtype（含 ManifestMemberKeyRef） | `pub fn try_new(value: String) -> ContractResult<Self>`；`pub fn as_str(&self) -> &str`；`pub fn into_inner(self) -> String` | 拒绝空/纯空白，不自动 trim 合法 identity，不认证 ref 内容 |
| `Ref => Id`（含三个 finding ref） | `pub fn new(id: Id) -> Self`；`pub fn id(&self) -> &Id`；`pub fn into_inner(self) -> Id` | 只包装对应 ID，不允许不同 ref 互转 |
| `Set => Member` | `pub fn try_from_iter(values: impl IntoIterator<Item = Member>) -> ContractResult<Self>`；`pub fn iter(&self) -> std::slice::Iter<'_, Member>`；`pub fn len(&self) -> usize`；`pub fn is_empty(&self) -> bool` | 使用各 set 已声明的 identity/empty/order；重复拒绝，不丢项 |

数值/时间 wrapper 的 `new(value: 对应单字段类型) -> Self` 与 §5.3 getter 只包装显式输入；positive ordinal 的 try_new 拒绝 0，并提供 `pub fn get(&self) -> 对应整数类型`。不读取系统时钟或生成 ID。

#### `SourceAuthorityRef`

`pub fn bind(source_class: SourceClass, owner_ref: OwnerRef) -> ContractResult<Self>`；`pub fn matches(&self, class: SourceClass, owner: &OwnerRef) -> bool`。全字段来自 source adapter；只比 class/owner，不从字符串反推正式关系。其余仅同名只读字段 accessor。

#### `RestoreOwnerRef`

`pub fn bind(owner_ref: OwnerRef, source_class: SourceClass) -> ContractResult<Self>`；`pub fn matches_source(&self, source: &SourceAuthorityRef) -> bool`。比 owner/class，不证明 receiver 存在或授权。其余仅同名只读字段 accessor。

#### `OwnerSliceSelector`

`pub fn new(source_class: SourceClass, selector_ref: SliceSelectorRef) -> Self`；`pub fn matches(&self, other: &Self) -> bool`。两字段全等；selector 内容只由 owner 解释。其余仅同名只读字段 accessor。

#### `ArchiveSliceSelector`

`pub fn declare(selector: OwnerSliceSelector, requiredness: SourceRequiredness) -> ContractResult<Self>`。WorkspaceProjection 只能 Auxiliary；Conditional authority 适用性由 application 核验。其余仅同名只读字段 accessor。

#### `ArchiveSliceExclusion`

`pub fn declare(selector: OwnerSliceSelector, basis_ref: AuthorityRef) -> ContractResult<Self>`。显式请求及正式依据；与 requested set 的互斥由 DeclaredArchiveScope 校验。其余仅同名只读字段 accessor。

#### `MappedGovernanceDecisionBinding`

`pub fn from_envelope(decision_id: ExternalDecisionId, owner_ref: OwnerRef, decision_kind: GovernanceDecisionKind, decision_version: ExternalDecisionVersion, scope_ref: GovernanceDecisionScopeRef, validity_ref: DecisionValidityRef, source_ref: ExternalEvidenceRef) -> ContractResult<Self>`。单份正式 envelope 的原子映射；无 mutation，不混合决定版本。其余仅同名只读字段 accessor。

#### `VerificationInputBinding`

`pub fn pin(bundle_revision_ref: BundleRevisionRef, material_refs: ArchivedMaterialRefSet) -> ContractResult<Self>`；`pub fn matches(&self, other: &Self) -> bool`。比 revision 与完整 ordered set；空集不证明 Verified，application 核验 manifest/material 关联。其余仅同名只读字段 accessor。

#### `BundleSealBasis`

`pub fn bind(bundle_revision_ref: BundleRevisionRef, verification_ref: VerificationAssessmentRef, compatibility_refs: CompatibilityAssessmentRefSet, placement_ref: ArchivePlacementRef) -> ContractResult<Self>`；`pub fn matches_revision(&self, revision: &BundleRevisionRef) -> bool`。required compatibility 集合由正式用途要求确定，缺 authority 阻止 seal，不临时删项；factory 不把 ref 当成功证明。其余仅同名只读字段 accessor。

#### `JobComponentPosture`

`pub fn from_committed(component: JobComponentKind, posture: ComponentPosture, basis_ref: ArchiveRecordRef) -> ContractResult<Self>`；`pub fn belongs_to(&self, component: JobComponentKind) -> bool`。合法组合：CP1 Request/Job、CP2 SourceBinding/CaptureAttempt、CP3 Bundle、CP4 Assessment、CP5 Placement/Lifecycle、CP6 RestorePlan/RestoreItem/RestoreHandoff/Compensation；application 核验实际 job 归属。其余仅同名只读字段 accessor。

#### contracts shared 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `ArchiveReadSubjectRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Job(ArchiveJobRef)` | `Selects an Archive job.` | 五 Query 已校验 selector | visibility/read resolver；载荷只定位 Archive 自有读取主语 |
| `Bundle(BundleRevisionRef)` | `Selects a Bundle and immutable manifest revision.` | 五 Query 已校验 selector | visibility/read resolver；载荷只定位 Archive 自有读取主语 |
| `Verification(BundleRevisionRef)` | `Selects verification results for one immutable Bundle revision.` | 五 Query 已校验 selector | visibility/read resolver；载荷只定位 Archive 自有读取主语 |
| `RestorePlan(RestorePlanRef)` | `Selects an immutable restore plan.` | 五 Query 已校验 selector | visibility/read resolver；载荷只定位 Archive 自有读取主语 |
| `RestoreHandoff(RestoreHandoffRef)` | `Selects one owner-specific restore handoff.` | 五 Query 已校验 selector | visibility/read resolver；载荷只定位 Archive 自有读取主语 |

##### `ArchiveRecordRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Request(OperationRequestRef)` | `Points to an archive or restore request.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `Job(ArchiveJobRef)` | `Points to a bounded Archive job.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `SourceBinding(SourceBindingRef)` | `Points to a source binding.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `CaptureAttempt(CaptureAttemptRef)` | `Points to one fixed capture attempt.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `Bundle(BundleRevisionRef)` | `Points to one immutable Bundle revision.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `Assessment(AssessmentRef)` | `Points to an integrity or compatibility assessment.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `Placement(ArchivePlacementRef)` | `Points to a storage placement.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `Lifecycle(LifecycleExecutionRef)` | `Points to a governance-bound lifecycle execution.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `RestorePlan(RestorePlanRef)` | `Points to one immutable restore plan.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `RestoreItem(RestoreItemRef)` | `Points to one owner-specific restore item.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `RestoreHandoff(RestoreHandoffRef)` | `Points to one owner-specific restore handoff.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |
| `Compensation(CompensationRecordRef)` | `Points to one authorized restore compensation record.` | matching committed Archive record identity | JobComponentPosture；按 CP/ref 组合验证 |

##### `OperationRequestRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Archive(ArchiveRequestRef)` | `Points to an archive request.` | 已保存的 ArchiveRequest/RestoreRequest | job/reference/safe view |
| `Restore(RestoreRequestRef)` | `Points to a restore request.` | 已保存的 ArchiveRequest/RestoreRequest | job/reference/safe view |

##### `OperationRequestKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Archive` | `Identifies an archive request.` | OperationRequestRef 的 typed variant | request/job kind guard |
| `Restore` | `Identifies a restore request.` | OperationRequestRef 的 typed variant | request/job kind guard |

##### `RequestAdmissionBasis` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Accepted(AuthorityRef)` | `Carries the formal authority for an accepted request.` | application 已核验受理/拒绝/阻塞依据 | ArchiveRequest；immutable final admission |
| `Rejected(SafeReasonRef)` | `Carries a safe definite rejection basis.` | application 已核验受理/拒绝/阻塞依据 | ArchiveRequest；immutable final admission |
| `Blocked(RequestBlockBasis)` | `Carries a safe unavailable or conflicting prerequisite basis.` | application 已核验受理/拒绝/阻塞依据 | ArchiveRequest；immutable final admission；fail-closed |

##### `SourceClass` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Identity` | `Canonical identity truth owned by L1-identity.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |
| `Conversation` | `Canonical conversation truth owned by L1-conversation.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |
| `Work` | `Canonical work and project truth owned by L1-work.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |
| `Process` | `Canonical process truth owned by L1-process.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |
| `Governance` | `Formal governance truth owned by L1-governance or an explicit owner.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |
| `Artifact` | `Artifact body and lineage truth owned by L1-artifact.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |
| `WorkspaceProjection` | `Read-only projection owned by L1-workspace and never canonical.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换；始终 Auxiliary/noncanonical |
| `ObservabilityMaterial` | `Redacted audit or evidence material owned by L4-observability.` | 正式 source-authority matrix | binding/material/restore owner；分类不可升级或转换 |

##### `SourceRequiredness` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Required` | `The request cannot close without owner-proven coverage for this source.` | 请求声明及正式条件 authority | scope/binding/closure；Auxiliary 不补 canonical gap |
| `Conditional(AuthorityRef)` | `The source is required only when its declared condition is formally met.` | 请求声明及正式条件 authority | scope/binding/closure；Auxiliary 不补 canonical gap |
| `Auxiliary` | `The source can assist inspection but cannot satisfy a canonical gap.` | 请求声明及正式条件 authority | scope/binding/closure；Auxiliary 不补 canonical gap |

##### `ArchiveMaterialClass` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `CanonicalSnapshot` | `An owner-approved canonical snapshot or export.` | 正式 approved owner material mapping | manifest/provenance/restore；不转移 source truth |
| `WorkspaceProjection` | `An explicitly non-canonical workspace projection.` | 正式 approved owner material mapping | manifest/provenance/restore；不转移 source truth |
| `ArtifactMaterial` | `An Artifact-owned body, version, lineage, or baseline reference.` | 正式 approved owner material mapping | manifest/provenance/restore；不转移 source truth |
| `ObservabilityMaterial` | `A redacted observability-owned audit or evidence material reference.` | 正式 approved owner material mapping | manifest/provenance/restore；不转移 source truth |
| `DecisionReference` | `A body-free formal decision reference.` | 正式 approved owner material mapping | manifest/provenance/restore；不转移 source truth |

##### `RequestAdmissionState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Accepted` | `Archive accepted the request into its local workflow.` | request factory 的 final basis | request/result/view；本请求不可原地迁移 |
| `Rejected` | `Archive rejected the request using a definite local rule.` | request factory 的 final basis | request/result/view；本请求不可原地迁移 |
| `Blocked` | `Archive could not prove a required authority or contract prerequisite.` | request factory 的 final basis | request/result/view；本请求不可原地迁移；fail-closed |

##### `JobAggregatePosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Queued` | `The job is committed locally and waiting to start.` | queue | Running/Blocked/Failed；recompute 首次分量 |
| `Running` | `At least one bounded stage is actively progressing.` | Queued/Partial；Blocked 正式解阻 | Partial/Blocked/Failed/Completed |
| `Partial` | `Some local results exist but the declared workflow is incomplete.` | Running；recompute 有局部已提交结果 | Running/Blocked/Failed/Completed |
| `Blocked` | `A formal prerequisite cannot currently be proven.` | 非 Completed/Failed 的 block/recompute | 同固定输入正式解阻后 Running；否则保留 |
| `Failed` | `The current attempt has a definite failure.` | 非 Completed 的确定失败分量 | 保留；不在本步开放自动 retry |
| `Completed` | `Every required Archive-owned endpoint has committed locally.` | 所有 required component 本地终点已提交 | 终态；禁止回 Running |

##### `SourceBindingState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Planned` | `The binding has been planned from the declared scope.` | plan | Bound/Blocked/Retired |
| `Bound` | `The authority and contract context have been formally bound.` | Planned/Blocked + 正式 authority/contract | Blocked/Retired |
| `Blocked` | `A required authority or contract prerequisite is unavailable.` | Planned/Bound + typed basis | Bound（重新正式绑定）/Retired |
| `Retired` | `A newer request or revision replaced the binding.` | Planned/Bound/Blocked + retirement basis | 终态；不可复活 |

##### `CaptureAttemptState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Requested` | `The capture intent has been persisted.` | start | InProgress/Superseded |
| `InProgress` | `The formal source interaction is in progress.` | Requested/Blocked 同 fixed input | Settled/Blocked/Failed/Superseded |
| `Settled` | `The mapped result has been persisted for this exact attempt.` | InProgress + exact attempt mapped result | 当前 attempt 终态，coverage 可非 Complete |
| `Blocked` | `A formal prerequisite cannot currently be proven.` | InProgress + typed basis | InProgress（同输入解阻）/Superseded |
| `Failed` | `The source returned a definite failure for this attempt.` | InProgress + definite failure | 当前 attempt 终态 |
| `Superseded` | `A replacement attempt prevents further commits to this attempt.` | Requested/InProgress/Blocked + replacement | 终态，拒绝迟到提交 |

##### `CaptureCoveragePosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Complete` | `The owner formally proved coverage of the declared scope.` | exact owner proof；无 proof 仅 Unknown | immutable CaptureCoverage；不从数量推导 |
| `Partial` | `The owner formally proved only a subset of the declared scope.` | exact owner proof；无 proof 仅 Unknown | immutable CaptureCoverage；不从数量推导 |
| `Missing` | `The owner formally reported that required material is absent.` | exact owner proof；无 proof 仅 Unknown | immutable CaptureCoverage；不从数量推导 |
| `Stale` | `The owner result does not satisfy the requested fence.` | exact owner proof；无 proof 仅 Unknown | immutable CaptureCoverage；不从数量推导 |
| `Conflicting` | `Authority, version, or coverage evidence conflicts.` | exact owner proof；无 proof 仅 Unknown | immutable CaptureCoverage；不从数量推导 |
| `Unknown` | `Available evidence is insufficient to decide coverage.` | exact owner proof；无 proof 仅 Unknown | immutable CaptureCoverage；不从数量推导 |

##### `ArchiveBundleState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Draft` | `The Bundle identity exists without a fixed manifest revision.` | draft | Assembling |
| `Assembling` | `A new immutable manifest revision is being assembled.` | Draft/Blocked（新 revision 语境） | ClosureReady/Blocked/Failed |
| `ClosureReady` | `The fixed manifest has complete closure.` | Assembling + exact Complete closure | Sealed/Blocked/Failed |
| `Sealed` | `All required fixed-input Archive seal guards passed.` | ClosureReady + 实际对象与正式 fixed guards | 终态；不推导 archived |
| `Blocked` | `A required formal prerequisite is unavailable.` | Assembling/ClosureReady + reason | Assembling（显式新 revision） |
| `Failed` | `The current assembly or seal attempt failed definitively.` | Assembling/ClosureReady + definite failure | 本步不开放原地重试 |

##### `ManifestClosurePosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Complete` | `Declared and actual approved entry sets close exactly.` | exact-set pure ClosureEvaluation | immutable ManifestClosure；空 difference 才 Complete |
| `Incomplete` | `One or more declared entries are missing.` | exact-set pure ClosureEvaluation | immutable ManifestClosure；空 difference 才 Complete |
| `Overfull` | `One or more undeclared or unapproved entries are present.` | exact-set pure ClosureEvaluation | immutable ManifestClosure；空 difference 才 Complete |
| `Invalid` | `An entry violates identity, authority, or class invariants.` | exact-set pure ClosureEvaluation | immutable ManifestClosure；空 difference 才 Complete |
| `Unknown` | `Available evidence cannot support a reliable comparison.` | exact-set pure ClosureEvaluation | immutable ManifestClosure；空 difference 才 Complete |

##### `VerificationPosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Pending` | `The fixed input has been recorded and is waiting for assessment.` | begin + fixed input/capability | InProgress |
| `InProgress` | `A formal integrity capability is assessing the fixed input.` | Pending | Verified/IntegrityFailed/Unknown/Blocked |
| `Verified` | `The capability formally verified the fixed input.` | InProgress + exact evidence/capability | 本 assessment 终态 |
| `IntegrityFailed` | `The capability formally reported a digest or signature failure.` | InProgress + formal failure findings | 本 assessment 终态 |
| `Unknown` | `The capability result is insufficient or ambiguous.` | InProgress + ambiguous findings | 本 assessment 终态；重验新 ID |
| `Blocked` | `A capability, key, input, or authority prerequisite is unavailable.` | blocked factory 或 InProgress 缺正式前提 | 本 assessment 终态；重验新 ID |

##### `CompatibilityPosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Supported` | `A formal capability supports the exact target context.` | fixed revision/schema/target 的 formal mapping | immutable CompatibilityAssessment |
| `Unsupported` | `A formal capability does not support the exact target context.` | fixed revision/schema/target 的 formal mapping | immutable CompatibilityAssessment |
| `Unknown` | `Available evidence is insufficient to decide support.` | fixed revision/schema/target 的 formal mapping | immutable CompatibilityAssessment |
| `Conflicting` | `Version or capability declarations conflict.` | fixed revision/schema/target 的 formal mapping | immutable CompatibilityAssessment |

##### `PlacementState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `IntentRecorded` | `A stable external placement intent has been persisted.` | intend | Dispatched |
| `Dispatched` | `The intent was dispatched without a definite commit result.` | 已绑定 Place action 且实际 Dispatched | Committed/CommitUnknown/Blocked/Failed；ACK 保留 |
| `Committed` | `A formal external commit was observed.` | 正式 matching Place commit | 保留；矛盾反馈只转 CommitUnknown，旧证据保留 |
| `CommitUnknown` | `The external effect may have committed and requires a probe.` | 未知效果/矛盾反馈 | 经正式 probe 得 Committed/Failed，或仍未知 |
| `Blocked` | `A required prerequisite is unavailable.` | 无未知效果时 mapped Blocked | 保留；不在本步开放盲重发 |
| `Failed` | `A definite external failure was observed.` | 正式 definite Place failure | 保留；新动作须正式处置 |

##### `RetrievalState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Unknown` | `Archive cannot currently establish whether retrieval was requested.` | 真实重建缺记录或 mapped Unknown | Requested（正式新 intent）或保持 Unknown |
| `NotRequested` | `No retrieval intent has been recorded.` | intend，完整本地历史无 retrieval intent | Requested |
| `Requested` | `A retrieval intent has been recorded or dispatched.` | NotRequested/Unknown + Retrieve action | Retrievable/Unavailable/Failed/Unknown |
| `Retrievable` | `A formal capability reported the fixed revision as retrievable.` | Requested + 正式 availability proof | 保留；后续刷新须同输入正式观察 |
| `Unavailable` | `A formal capability reported the fixed revision as unavailable.` | Requested + 正式 unavailable proof | 保留；不改 placement commit |
| `Failed` | `A definite retrieval attempt failed.` | Requested + definite retrieval failure | 保留；不等 placement Failed |

##### `LifecycleExecutionState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Eligible` | `The formal decision is applicable and no conflicting hold is known.` | eligible + formal applicability proof | IntentRecorded/Blocked |
| `IntentRecorded` | `A stable external effect intent has been persisted.` | Eligible + exact action intent | Dispatched/Blocked |
| `Dispatched` | `The intent was dispatched without a definite result.` | IntentRecorded + 已派发 action | Acknowledged/Committed/CommitUnknown/Blocked/Failed |
| `Acknowledged` | `The external system acknowledged receipt without proving commit.` | 正式 ACK | Committed/CommitUnknown/Blocked/Failed；不盲重发 |
| `Committed` | `A formal external commit was observed.` | matching action formal commit | 保留；矛盾经 CommitUnknown 对账，原 action 不删 |
| `CommitUnknown` | `The external effect may have committed and requires a probe.` | 不确定/矛盾 action outcome | 正式 probe 得 Committed/Failed 或保持；新 hold 可 Blocked 但 action 仍未知 |
| `Blocked` | `A hold, conflict, expiry, or prerequisite blocks progress.` | precommit formal hold/conflict/expiry | 正式 compensation completion→Compensated；既有效果保持可查询 |
| `Failed` | `A definite failure was observed.` | formal definite effect failure | 正式 compensation completion→Compensated |
| `Compensated` | `A formally authorized compensation completed.` | Failed/Blocked + exact formal proof | 终态，不抹原 action |

##### `RestorePlanState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Draft` | `The plan is enumerating fixed per-owner items.` | draft；freeze_items 不直接 Ready | recompute→Ready/Blocked；显式 fail/supersede→Failed/Superseded |
| `Ready` | `Every required item has enough prerequisites to begin handoff.` | 完整 frozen items 均具备安全前提 | 首个派发→InProgress；前提失效→Blocked；显式 fail/supersede |
| `Blocked` | `A required integrity, compatibility, retrieval, authority, or receiver prerequisite is unavailable.` | recompute 前提不足 | 同输入正式解阻→Ready；显式 fail/supersede |
| `InProgress` | `At least one item handoff is in progress.` | recompute 有接收方交互在途 | Partial/Blocked/HandoffComplete/Failed/Superseded |
| `Partial` | `Item outcomes are mixed or incomplete.` | recompute mixed/unfinished | 后续同输入 recompute；可 Superseded |
| `HandoffComplete` | `Every required item has a definite receiver outcome.` | required item 全部有确定 outcome | 终态；不证明全部成功或业务 restored |
| `Failed` | `A definite plan-level failure prevents completion.` | 显式 fail + plan-level 确定失败依据 | 本步终态；不据局部失败擅判全局失败 |
| `Superseded` | `A newer immutable plan revision replaced this plan.` | 非终态 + replacement plan | 终态，不复活 |

##### `RestoreItemState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Planned` | `The owner and source entries have been enumerated.` | plan | Blocked/MaterialReady |
| `Blocked` | `A safety or authority prerequisite is unavailable.` | Planned/MaterialReady pre-dispatch block | MaterialReady（同固定输入正式解阻） |
| `MaterialReady` | `The minimal owner-specific material has been fixed.` | Planned/Blocked + exact eligibility basis | HandoffPending/Blocked |
| `HandoffPending` | `A stable handoff intent exists and is waiting for dispatch.` | MaterialReady + persisted handoff | InProgress |
| `InProgress` | `The receiver interaction is in progress.` | HandoffPending + dispatched handoff；ACK 保留 | Succeeded/Rejected/Failed/CommitUnknown |
| `Succeeded` | `The receiver formally reported success for this item.` | 正式 matching success outcome | 保留；矛盾 feedback→CommitUnknown |
| `Rejected` | `The receiver formally rejected this item.` | 正式 matching rejection | 保留；矛盾 feedback→CommitUnknown |
| `Failed` | `The receiver reported a definite failure.` | 正式 matching definite failure | CompensationPending；矛盾→CommitUnknown |
| `CommitUnknown` | `The receiver may have committed and requires reconciliation.` | 未知/Conflicting feedback | 正式 probe→Succeeded/Rejected/Failed 或仍未知；正式处置→CompensationPending |
| `CompensationPending` | `A formally authorized compensation is pending.` | CommitUnknown/Failed + planned authorized compensation | Compensated（exact Completed record） |
| `Compensated` | `A formally authorized compensation completed.` | CompensationPending + formal completion | 终态；不抹原 handoff |

##### `RestoreHandoffState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `IntentRecorded` | `A stable receiver handoff intent has been persisted.` | record_intent | Dispatched |
| `Dispatched` | `The handoff was dispatched without a definite result.` | IntentRecorded | Acknowledged/Succeeded/Rejected/Failed/CommitUnknown/ReconcileRequired |
| `Acknowledged` | `The receiver acknowledged receipt without proving commit.` | formal ACK | Succeeded/Rejected/Failed/CommitUnknown/ReconcileRequired |
| `Succeeded` | `The receiver formally reported success for the handoff.` | formal success with commit | 保留；矛盾→ReconcileRequired |
| `Rejected` | `The receiver formally rejected the handoff.` | formal definite rejection | 保留；矛盾→ReconcileRequired |
| `Failed` | `The receiver reported a definite failure.` | formal definite failure | 保留；矛盾→ReconcileRequired |
| `CommitUnknown` | `The receiver may have committed and requires reconciliation.` | 不确定接收方效果 | ReconcileRequired 或正式 probe 确定结果；不盲重放 |
| `ReconcileRequired` | `The handoff must be probed or reviewed before retry or compensation.` | Conflicting/需正式复核的 outcome | 正式 probe→Succeeded/Rejected/Failed/Acknowledged/CommitUnknown；未知保留 |

##### `CompensationState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Planned` | `A formal authority approved the compensation plan.` | plan + authority/action/receiver/key/input | InProgress |
| `InProgress` | `The compensation interaction is in progress.` | Planned | Completed/Failed/CommitUnknown/Blocked |
| `Completed` | `The compensation boundary reported definite completion.` | formal completion feedback | 保留；矛盾需 CommitUnknown probe，不删除原 outcome |
| `Failed` | `The compensation reported a definite failure.` | formal definite failure | 保留；若发现矛盾仅正式对账，不盲重发 |
| `CommitUnknown` | `The compensation may have committed and requires reconciliation.` | ambiguous feedback/require_reconcile | 经 probe→Completed/Failed/Blocked 或仍未知 |
| `Blocked` | `A required authority, receiver, or safety prerequisite is unavailable.` | 正式缺少 authority/receiver/prerequisite | 保留；无自动 start/retry |

##### `SourceCaptureFindingKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Partial` | `The owner proved only partial coverage.` | exact attempt 的 owner evidence；无证据仅 Unknown | immutable SourceCaptureFinding；不得替代 owner truth |
| `Missing` | `The owner formally reported required material as missing.` | exact attempt 的 owner evidence；无证据仅 Unknown | immutable SourceCaptureFinding；不得替代 owner truth |
| `Stale` | `The result did not satisfy the requested fence.` | exact attempt 的 owner evidence；无证据仅 Unknown | immutable SourceCaptureFinding；不得替代 owner truth |
| `Conflicting` | `Source authority, version, or coverage evidence conflicted.` | exact attempt 的 owner evidence；无证据仅 Unknown | immutable SourceCaptureFinding；不得替代 owner truth |
| `Redacted` | `Material was intentionally removed or hidden under an approved rule.` | exact attempt 的 owner evidence；无证据仅 Unknown | immutable SourceCaptureFinding；不得替代 owner truth |
| `Unknown` | `Available evidence was insufficient to classify the result.` | exact attempt 的 owner evidence；无证据仅 Unknown | immutable SourceCaptureFinding；不得替代 owner truth |

##### `ClosureFindingKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Missing` | `A declared entry is absent from the actual approved set.` | exact declared/actual set comparison | ClosureDifference/ClosureFinding；只说明本地集合差异 |
| `Unexpected` | `An undeclared or unapproved entry appears in the actual set.` | exact declared/actual set comparison | ClosureDifference/ClosureFinding；只说明本地集合差异 |
| `Invalid` | `An entry violates identity, authority, or class invariants.` | exact declared/actual set comparison | ClosureDifference/ClosureFinding；只说明本地集合差异 |
| `Unknown` | `Available evidence cannot support a reliable comparison.` | exact declared/actual set comparison | ClosureDifference/ClosureFinding；只说明本地集合差异 |

##### `VerificationFindingKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Mismatch` | `A formal digest comparison did not match.` | exact assessment formal capability evidence；不足映射 Unknown | immutable VerificationFinding；不保存 key/body |
| `SignatureInvalid` | `A formal signature capability reported an invalid signature.` | exact assessment formal capability evidence；不足映射 Unknown | immutable VerificationFinding；不保存 key/body |
| `KeyUnavailable` | `A required key capability was unavailable.` | exact assessment formal capability evidence；不足映射 Unknown | immutable VerificationFinding；不保存 key/body |
| `UnsupportedVersion` | `The exact target context does not support the version.` | exact assessment formal capability evidence；不足映射 Unknown | immutable VerificationFinding；不保存 key/body |
| `Conflicting` | `Capability or version declarations conflicted.` | exact assessment formal capability evidence；不足映射 Unknown | immutable VerificationFinding；不保存 key/body |
| `Unknown` | `Available evidence was insufficient to classify the result.` | exact assessment formal capability evidence；不足映射 Unknown | immutable VerificationFinding；不保存 key/body |

##### `CompatibilityTargetContext` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Verification` | `Assesses support for Archive verification.` | 显式 verifier/reader/receiver 用途 | CompatibilityAssessment；不同 target 不复用结论 |
| `Read` | `Assesses support for an authorized read path.` | 显式 verifier/reader/receiver 用途 | CompatibilityAssessment；不同 target 不复用结论 |
| `RestoreReceiver(RestoreReceiverRef)` | `Assesses support for one exact restore receiver.` | 显式 verifier/reader/receiver 用途 | CompatibilityAssessment；不同 target 不复用结论 |

##### `ArchiveJobKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Archive` | `Coordinates creation and sealing of an Archive Bundle.` | admitted request kind | job stage registry；immutable |
| `Restore` | `Coordinates an owner-specific restore handoff workflow.` | admitted request kind | job stage registry；immutable |

##### `ArchiveJobStage` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Queued` | `The job is committed locally and awaiting bounded work.` | queue | Archive→SourcePlanning；Restore→RestorePlanning |
| `SourcePlanning` | `Source bindings are being derived from a frozen archive scope.` | Archive Queued | SourceCapture |
| `SourceCapture` | `Owner-approved source material is being captured or reconciled.` | Archive SourcePlanning | ManifestAssembly |
| `ManifestAssembly` | `An immutable manifest revision and closure are being assembled.` | Archive SourceCapture | Verification |
| `Verification` | `Fixed-input integrity and compatibility are being assessed.` | Archive ManifestAssembly | Placement |
| `Placement` | `The fixed Bundle revision is being placed or retrieved.` | Archive Verification | Sealing |
| `Sealing` | `Archive-owned seal guards are being evaluated.` | Archive Placement | Completed（全部 required endpoints 已提交） |
| `RestorePlanning` | `Per-owner restore items are being built from a fixed Bundle revision.` | Restore Queued | MaterialPreparation |
| `MaterialPreparation` | `Minimal owner-specific restore material is being prepared.` | Restore RestorePlanning | RestoreHandoff |
| `RestoreHandoff` | `Owner-specific receiver handoffs are being dispatched or observed.` | Restore MaterialPreparation | Reconciliation/Compensation（正式依据）或 Completed |
| `Reconciliation` | `An ambiguous external effect is being probed.` | Restore workflow；当前 workflow 的未知效果待 probe | 同 fixed input 的正式恢复阶段/Compensation/Completed；不得盲重放 |
| `Compensation` | `A formally authorized compensation is being executed.` | Restore workflow；正式 authority 支持的待补偿效果 | Reconciliation（未知）/Completed；不抹原 effect |
| `Completed` | `Every required Archive-owned endpoint has committed locally.` | kind-specific required local endpoints 全已提交 | 终态，不推导 owning domain archived/restored |

##### `GovernanceDecisionKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Retain` | `Requires retention under an owner-defined policy and duration.` | owner-issued exact decision/version envelope | GovernanceDecisionRef；不由 Archive 生成决定 |
| `Hold` | `Places an owner-defined legal or governance hold.` | owner-issued exact decision/version envelope | GovernanceDecisionRef；不由 Archive 生成决定 |
| `ReleaseHold` | `Formally releases a previously identified hold.` | owner-issued exact decision/version envelope | GovernanceDecisionRef；不由 Archive 生成决定 |
| `DeleteAuthorize` | `Authorizes a specific deletion action.` | owner-issued exact decision/version envelope | GovernanceDecisionRef；不由 Archive 生成决定 |
| `RiskAccept` | `Records an owner-approved risk acceptance reference.` | owner-issued exact decision/version envelope | GovernanceDecisionRef；不由 Archive 生成决定 |

##### `LifecycleActionKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Retain` | `Maintains the current retained placement under the formal decision.` | formal GovernanceApplicabilityProof | LifecycleExecution；不能从 Hold/ReleaseHold 自造动作 |
| `TierTransition` | `Requests a provider-neutral storage tier transition.` | formal GovernanceApplicabilityProof | LifecycleExecution；不能从 Hold/ReleaseHold 自造动作 |
| `Delete` | `Executes a specifically authorized deletion effect.` | formal GovernanceApplicabilityProof | LifecycleExecution；不能从 Hold/ReleaseHold 自造动作 |

##### `ExternalActionTargetRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Placement(ArchivePlacementRef)` | `Targets a storage placement.` | persisted placement/lifecycle identity | ExternalActionRecord；不从字符串路由 |
| `Lifecycle(LifecycleExecutionRef)` | `Targets a governance-bound lifecycle execution.` | persisted placement/lifecycle identity | ExternalActionRecord；不从字符串路由 |

##### `ExternalActionPosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `IntentRecorded` | `A stable effect intent exists locally.` | record_intent | Dispatched |
| `Dispatched` | `The effect was dispatched without a definite outcome.` | IntentRecorded | Acknowledged/Committed/CommitUnknown/Failed；Blocked observation 保留姿态 |
| `Acknowledged` | `The external system acknowledged receipt without proving commit.` | 正式 ACK | Committed/CommitUnknown/Failed；不得视为 commit |
| `Committed` | `A formal external commit was observed.` | formal matching commit | 矛盾 observation→CommitUnknown，旧证据保留 |
| `CommitUnknown` | `The effect may have committed and requires a probe.` | unknown/矛盾/require_reconcile | 正式 probe 确定结果或仍未知 |
| `Failed` | `A definite external failure was observed.` | definite failure | 矛盾 observation→CommitUnknown；不盲重发 |

##### `ReceiverOutcomePosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Acknowledged` | `The receiver acknowledged the handoff without proving commit.` | formal receiver observation for exact handoff | immutable HandoffOutcome；ACK≠commit，Succeeded 必有 commit ref；ACK≠commit |
| `Succeeded` | `The receiver formally reported success for this handoff.` | formal receiver observation for exact handoff | immutable HandoffOutcome；ACK≠commit，Succeeded 必有 commit ref |
| `Rejected` | `The receiver formally rejected the handoff.` | formal receiver observation for exact handoff | immutable HandoffOutcome；ACK≠commit，Succeeded 必有 commit ref |
| `Failed` | `The receiver reported a definite failure.` | formal receiver observation for exact handoff | immutable HandoffOutcome；ACK≠commit，Succeeded 必有 commit ref |
| `Conflicting` | `Receiver feedback conflicts with a previously stored outcome.` | formal receiver observation for exact handoff | immutable HandoffOutcome；ACK≠commit，Succeeded 必有 commit ref |
| `CommitUnknown` | `The receiver may have committed and requires reconciliation.` | formal receiver observation for exact handoff | immutable HandoffOutcome；ACK≠commit，Succeeded 必有 commit ref；保留未知，仅 probe/review |

##### `CompensationAction` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `RetryAfterProbe` | `Retries only after a formal probe established that no commit occurred.` | formal CompensationAuthorityRef 的具体允许动作 | CompensationRecord；不能由错误码自动选择 |
| `Cancel` | `Requests cancellation through the formal receiver boundary.` | formal CompensationAuthorityRef 的具体允许动作 | CompensationRecord；不能由错误码自动选择 |
| `Reverse` | `Requests a receiver-supported reverse action.` | formal CompensationAuthorityRef 的具体允许动作 | CompensationRecord；不能由错误码自动选择 |
| `ManualHandoff` | `Routes the handoff to a formally authorized manual process.` | formal CompensationAuthorityRef 的具体允许动作 | CompensationRecord；不能由错误码自动选择 |

##### `AssessmentRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Integrity(VerificationAssessmentRef)` | `Points to an integrity assessment.` | 已持久对应 assessment identity | finding/view；禁止跨 assessment family |
| `Compatibility(CompatibilityAssessmentRef)` | `Points to a target-specific compatibility assessment.` | 已持久对应 assessment identity | finding/view；禁止跨 assessment family |

##### `JobComponentKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `RequestAndJob` | `Represents request admission and bounded job coordination.` | 正式 02 六 CP 功能边界 | JobComponentPosture；immutable finite classification |
| `SourceCapture` | `Represents source binding, capture, coverage, and findings.` | 正式 02 六 CP 功能边界 | JobComponentPosture；immutable finite classification |
| `BundleAssembly` | `Represents immutable manifest assembly and closure.` | 正式 02 六 CP 功能边界 | JobComponentPosture；immutable finite classification |
| `Verification` | `Represents fixed-input integrity and compatibility assessment.` | 正式 02 六 CP 功能边界 | JobComponentPosture；immutable finite classification |
| `PlacementAndLifecycle` | `Represents placement, retrieval, and governance-bound lifecycle effects.` | 正式 02 六 CP 功能边界 | JobComponentPosture；immutable finite classification |
| `Restore` | `Represents per-owner restore planning and handoff effects.` | 正式 02 六 CP 功能边界 | JobComponentPosture；immutable finite classification |

##### `ComponentPosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Pending` | `Required work has not begun or has no committed positive result.` | matching committed CP records，经 application 保守映射 | immutable JobComponentPosture；不单项推导 job Completed |
| `Running` | `At least one bounded operation is progressing.` | matching committed CP records，经 application 保守映射 | immutable JobComponentPosture；不单项推导 job Completed |
| `Partial` | `Some committed results exist but the component is incomplete.` | matching committed CP records，经 application 保守映射 | immutable JobComponentPosture；不单项推导 job Completed |
| `Blocked` | `A required formal prerequisite is unavailable.` | matching committed CP records，经 application 保守映射 | immutable JobComponentPosture；不单项推导 job Completed；fail-closed |
| `Failed` | `A definite current attempt failure was committed.` | matching committed CP records，经 application 保守映射 | immutable JobComponentPosture；不单项推导 job Completed |
| `Completed` | `Every required Archive-owned endpoint for the component committed.` | matching committed CP records，经 application 保守映射 | immutable JobComponentPosture；不单项推导 job Completed |


### 5.9 Contracts shared vocabulary 内部停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Core symbol | pass | 只复用真实存在且语义匹配的 actor/metadata/idempotency/time/trace 类型；`ContractDomain` 不适配八类 source |
| public → domain 依赖 | pass | 所有 public state/ref/helper 定义在 contracts；没有 contracts→domain 边 |
| source authority | pass_with_upstream_blockers | 八类逐项保留 owner/class/material/provenance；exact export schema 仍由 `AR-UP-001/006~008` 阻断 |
| digest/key/schema/provider | pass_with_upstream_blockers | 只有 opaque ref/evidence；未制造算法、key、provider、兼容成功 |
| ID/version/time | pass_at_step_6 | source/用途明确；生成、存储和 optimistic increment 交 Step 7/11 |
| 状态 | pass_at_step_6 | 稳定有限 variant 已定义；完整迁移矩阵交 Step 10，不允许跨轴传播 |

## 6. `contracts` 正式对象与 safe view 契约

### 6.1 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory | 成员函数 | 状态 | 字段来源 |
|---|---|---|---|---|---|---|
| `DeclaredArchiveScope` | 冻结项目/切片/排除声明并校验 shape | project、requested、exclusions、version | `declare` | `requires`、`validate_shape` | immutable | validated Command input；不读 owner truth |
| `GovernanceDecisionRef` | 绑定 owner decision identity/version/scope/validity | id、owner、kind、version、scope、validity | `bind` | `same_identity`、`same_version`、`targets` | immutable | GovernanceDecisionPort mapped envelope；不由 caller 自由构造 |
| 五类 safe view | 只读组合已提交状态 | identity + safe metadata + object summaries | application view assembler | accessor only | immutable read result | read-only store + current visibility/redaction |

### 6.2 `DeclaredArchiveScope`（正式对象 1/26）

#### 类型定义

```rust
/// Freezes the project, requested owner-defined slices, exclusions, and declaration revision.
pub struct DeclaredArchiveScope {
    /// Points to the project identity owned by the formal work domain.
    pub project_ref: ProjectRef,
    /// Contains the non-empty ordered set of requested slices.
    pub requested_slices: ArchiveSliceSelectorSet,
    /// Contains explicit exclusions backed by formal authority references.
    pub explicit_exclusions: ArchiveSliceExclusionSet,
    /// Identifies this immutable scope declaration revision.
    pub scope_version: ScopeDeclarationVersion,
}
```

#### 成员变量

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `project_ref` | `ProjectRef` | 标识 L1-work 拥有的项目 | RequestArchive 可信输入映射；非空 opaque ref；不保存 Project body/state |
| `requested_slices` | `ArchiveSliceSelectorSet` | 冻结所声明的 owner-defined slice | 非空、typed identity 唯一；不自动添加八类 source |
| `explicit_exclusions` | `ArchiveSliceExclusionSet` | 记录显式排除及正式依据 | 可空；不得与 requested selector 重叠；每项有 basis ref |
| `scope_version` | `ScopeDeclarationVersion` | 区分同项目不同声明修订 | caller/application 显式提供；不从时间或集合 hash 私造 |

#### 成员函数

| 函数签名 | 作用 | 参数 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires(&self, source_class: SourceClass) -> bool` | 判断是否存在该 class 的非 Auxiliary required/conditional slice | source class | bool | 纯函数；不判断 source 是否存在或有 coverage |
| `pub fn selector(&self, selector_ref: &SliceSelectorRef) -> Option<&ArchiveSliceSelector>` | 精确查找声明项 | selector ref | borrowed selector | 纯函数；不做 fallback |
| `pub fn validate_shape(&self) -> ContractResult<()>` | 校验非空、去重、class/selector 一致与排除不重叠 | 无 | success 或 typed validation error | 不执行业务授权、owner 查询或 coverage 检查 |

#### 工厂 / 静态函数

```rust
impl DeclaredArchiveScope {
    /// Creates an immutable declaration after validating only its local shape.
    pub fn declare(
        project_ref: ProjectRef,
        requested_slices: ArchiveSliceSelectorSet,
        explicit_exclusions: ArchiveSliceExclusionSet,
        scope_version: ScopeDeclarationVersion,
    ) -> ContractResult<Self>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `declare(ProjectRef, ArchiveSliceSelectorSet, ArchiveSliceExclusionSet, ScopeDeclarationVersion) -> ContractResult<Self>` | 构造并冻结范围 | 四个参数覆盖全部必填字段 | 合法 value object 或 shape error | Command 经可信 validation 后传给 application/domain |

#### 不变量与禁止事项

- `requested_slices` 必须非空、typed identity 唯一；同一 selector 不得同时 requested 与 excluded。
- `WorkspaceProjection` 必须为 `Auxiliary`；`ObservabilityMaterial` 的 requiredness 只能来自正式请求/authority，不可补 canonical 缺口。
- `validate_shape` 不读取 L1 owner、不判断权限、不推导实际 source coverage；此对象不能成为 source-authority matrix 或归档批准的替代品。
- scope immutable；任何修改创建新 `ScopeDeclarationVersion`，不得原地覆盖已经受理请求的 scope。

### 6.3 `GovernanceDecisionRef`（正式对象 2/26）

#### 类型定义

```rust
/// Binds an owner-issued governance decision without copying policy or decision content.
pub struct GovernanceDecisionRef {
    /// Carries the owner-issued decision identity.
    pub decision_id: ExternalDecisionId,
    /// Identifies the formal decision owner.
    pub owner_ref: OwnerRef,
    /// Classifies the referenced decision.
    pub decision_kind: GovernanceDecisionKind,
    /// Carries the owner-specific decision version.
    pub decision_version: ExternalDecisionVersion,
    /// Points to the owner-issued applicability scope.
    pub scope_ref: GovernanceDecisionScopeRef,
    /// Points to the owner-issued validity observation.
    pub validity_ref: DecisionValidityRef,
}
```

#### 成员变量

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `decision_id` | `ExternalDecisionId` | owner decision 身份 | 只从正式 governance/owner envelope 映射；非空，不可由 Archive 生成 |
| `owner_ref` | `OwnerRef` | 声明 authority | 必须是该 decision 的正式 owner；adapter 核验 |
| `decision_kind` | `GovernanceDecisionKind` | Retain/Hold/ReleaseHold/DeleteAuthorize/RiskAccept 分类 | 来自 owner 合同映射；不允许 string guessing |
| `decision_version` | `ExternalDecisionVersion` | owner-specific 版本 | 不与本地 `RecordVersion` 或其他 owner 版本比较大小 |
| `scope_ref` | `GovernanceDecisionScopeRef` | 指向 owner-defined 适用范围 | body-free；Archive 不解析 policy scope 规则 |
| `validity_ref` | `DecisionValidityRef` | 指向正式有效性证明 | 缺失则不能构造 eligible binding |

#### 成员函数

| 函数签名 | 作用 | 参数 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn same_identity(&self, other: &Self) -> bool` | 比较 owner + decision id | another ref | bool | 纯函数；不比较正文 |
| `pub fn same_version(&self, other: &Self) -> bool` | 防止不同版本误当同一依据 | another ref | bool | 先要求 same identity；只做 opaque equality |
| `pub fn targets(&self, scope_ref: &GovernanceDecisionScopeRef) -> bool` | 比较已由 owner 映射的 scope ref | scope ref | bool | 只做 typed equality，不执行 applicability policy |

#### 工厂 / 静态函数

```rust
impl GovernanceDecisionRef {
    /// Binds fields that were validated and mapped from one formal owner decision envelope.
    pub fn bind(binding: MappedGovernanceDecisionBinding) -> ContractResult<Self>;
}
```

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `bind(MappedGovernanceDecisionBinding) -> ContractResult<Self>` | 从 adapter 已验证的本地 carrier 构造完整 ref | binding 覆盖全部六字段并记录映射来源 | ref 或 validation error | Step 7 `GovernanceDecisionPort` / Step 8 consumer/command mapping |

`MappedGovernanceDecisionBinding` 是 Step 7 port outcome 的 stable input carrier，字段与本对象六字段一一对应，另含 safe `source_ref` 用于追溯；它不含 decision body。exact adapter trait 与 external envelope schema 不在本步定义。

#### 不变量与禁止事项

- 六字段均必填；缺 owner/version/scope/validity 的输入不能变成 `GovernanceDecisionRef`。
- 本对象不提供 `is_valid()`、`allows_delete()`、`retention_deadline()` 或 `hold_released()`；这些结论只能由正式 owner capability 按当前语境给出。
- 新 decision/version/hold 不原地覆盖历史引用；application 保存新的 ref 并按 Step 9/10 重新评估 affected execution。
- 不保存 policy、期限、法律文本、批准人列表、risk body 或 secret；`RiskAccept` 仅是外部决定分类，不能降低本仓 fail-closed 红线。

### 6.4 Safe read metadata

```rust
/// Records whether an authorized view is current relative to its committed Archive sources.
pub enum ViewFreshness {
    /// Every included Archive record matches the requested fixed input or current committed revision.
    Current,
    /// At least one included record is older than the requested or current Archive revision.
    Stale,
    /// Included records were produced from mixed immutable revisions.
    Mixed,
    /// Archive cannot prove freshness from available committed metadata.
    Unknown,
}

/// Summarizes redaction without revealing hidden field names or values.
pub enum RedactionPosture {
    /// No field visible under the current contract required redaction.
    None,
    /// One or more fields were removed under the current disclosure decision.
    Redacted,
}

/// Carries metadata shared by every visible Archive query result.
pub struct SafeViewMetadata {
    /// Identifies the query request for traceability.
    pub request_id: core_contracts::metadata::RequestId,
    /// Carries the distributed trace identity.
    pub trace_id: core_contracts::metadata::TraceId,
    /// Records Archive-relative freshness.
    pub freshness: ViewFreshness,
    /// Records whether the visible shape was redacted.
    pub redaction: RedactionPosture,
    /// Records when Archive assembled the response.
    pub assembled_at: RecordedAt,
}

/// Hides whether a requested resource is absent or not visible.
pub struct SafeNotAvailable;

/// Returns either an authorized view or a uniform non-disclosing absence marker.
pub enum SafeRead<T> {
    /// Returns an authorized and consistently redacted view.
    Visible(T),
    /// Hides whether the target is absent, hidden, or no longer visible.
    NotAvailable(SafeNotAvailable),
}
```

`contracts::views` 同时定义以下 immutable summary 与 ordered-unique set；它们是五类 safe view 的正式字段类型，不是待 Step 8 临时补出的别名：

| summary / set | 最小字段 | 唯一性 / 顺序 | 来源与禁止事项 |
|---|---|---|---|
| `SafeJobComponentView` / `SafeJobComponentViewSet` | `component: JobComponentKind`、`posture: ComponentPosture`、`basis_ref: ArchiveRecordRef`、`reason_ref: Option<SafeReasonRef>` | component 唯一，按 `JobComponentKind` 固定顺序 | matching committed Archive record；不含 owner truth/body |
| `SafeManifestEntryView` / `SafeManifestEntryViewSet` | `entry_ref`、`source_class`、`material_class`、`authority_ref`、`source_version_ref`、`fence_ref`、`coverage_posture`、可见时的 locator/digest ref | entry ref 唯一，按 manifest entry stable identity | 仅 same-revision manifest entry + current redaction；projection/material 不升格 canonical |
| `SafePlacementView` | `placement_ref`、`placement_state`、`retrieval_state`、可见时的 location/tier/commit ref | 单值 | matching fixed revision placement；Committed 不推导 Retrievable |
| `SafeLifecycleExecutionView` / `SafeLifecycleExecutionViewSet` | `execution_ref`、`decision_ref`、`action_kind`、`execution_state`、`reason_ref` | execution ref 唯一，按 ref 稳定顺序 | matching lifecycle records；不暴露 policy body，不推导项目状态 |
| `SafeVerificationAssessmentView` | `assessment_ref`、`input_binding`、`posture`、`capability_ref: Option<IntegrityCapabilityRef>` | 单值 | exact verification input；缺记录不能生成 Verified |
| `SafeCompatibilityAssessmentView` / `SafeCompatibilityAssessmentViewSet` | `assessment_ref`、`target_context`、`posture`、`schema_version_refs`、`capability_ref: Option<CompatibilityCapabilityRef>` | target context 唯一，按 target stable order | exact target assessment；Read/Verification 不复用 receiver |
| `SafeVerificationFindingView` / `SafeVerificationFindingViewSet` | `finding_ref`、`assessment_ref`、`kind`、`subject_ref`、`basis_ref` | finding ref 唯一，按 recorded order + ref | 已授权的 safe finding；不含 raw provider response/key |
| `SafeRestoreItemView` / `SafeRestoreItemViewSet` | `item_ref`、`target_owner_ref`、`item_state`、latest handoff/outcome/compensation ref、`reason_ref` | item ref/owner mapping 唯一，按 owner + item ref | same plan revision；一个 owner 状态不传播另一个 owner |
| `SafeHandoffOutcomeView` / `SafeHandoffOutcomeViewSet` | `outcome_ref`、`receiver_outcome`、可见时的 `receiver_commit_ref`、`observed_at` | outcome ref 唯一，append order | exact handoff outcome；ACK/Conflicting 不带 commit |
| `SafeCompensationView` / `SafeCompensationViewSet` | `compensation_ref`、`action`、`state`、`outcome_ref`、`recorded_at` | compensation ref 唯一，append order | exact handoff compensation；Completed 不抹除原 outcome |

上述表表达用途和关联；下列代码是唯一字段 schema。verification/compatibility summary 使用真实已保存的 capability_ref，不能把 capability ID 伪转 CapabilityEvidenceRef。所有 Option=None 均不推导 absent/success；裁剪后不可安全展示的 ref 要求整项/整 view 返回 SafeNotAvailable，不能合成 ref。assessment 未生成时 integrity=None，不能造有 ID 的 Unknown assessment。

#### `SafeJobComponentView`

```rust
/// Summarizes one committed job component.
pub struct SafeJobComponentView {
    /// Identifies the bounded capability component.
    pub component: JobComponentKind,
    /// Carries its conservative committed posture.
    pub posture: ComponentPosture,
    /// Points to the committed basis record.
    pub basis_ref: ArchiveRecordRef,
    /// Carries an authorized safe reason when disclosed.
    pub reason_ref: Option<SafeReasonRef>,
}
```

`pub fn assemble(component: JobComponentKind, posture: ComponentPosture, basis_ref: ArchiveRecordRef, reason_ref: Option<SafeReasonRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeManifestEntryView`

```rust
/// Summarizes one approved manifest member with explicit provenance.
pub struct SafeManifestEntryView {
    /// Identifies the manifest member.
    pub entry_ref: ManifestEntryRef,
    /// Preserves the source authority class.
    pub source_class: SourceClass,
    /// Preserves the material category.
    pub material_class: ArchiveMaterialClass,
    /// Identifies the formal source owner.
    pub authority_ref: SourceAuthorityRef,
    /// Carries a disclosed owner-specific version.
    pub source_version_ref: Option<SourceVersionRef>,
    /// Carries a disclosed owner-issued fence.
    pub fence_ref: Option<SnapshotFenceRef>,
    /// Preserves owner coverage independently from entry count.
    pub coverage_posture: CaptureCoveragePosture,
    /// Carries the approved locator only when disclosure permits.
    pub locator_ref: Option<MaterialLocatorRef>,
    /// Carries a formal digest only when disclosure permits.
    pub digest_ref: Option<DigestRef>,
}
```

`pub fn assemble(entry_ref: ManifestEntryRef, source_class: SourceClass, material_class: ArchiveMaterialClass, authority_ref: SourceAuthorityRef, source_version_ref: Option<SourceVersionRef>, fence_ref: Option<SnapshotFenceRef>, coverage_posture: CaptureCoveragePosture, locator_ref: Option<MaterialLocatorRef>, digest_ref: Option<DigestRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafePlacementView`

```rust
/// Summarizes independent placement and retrieval observations.
pub struct SafePlacementView {
    /// Identifies the matching placement.
    pub placement_ref: ArchivePlacementRef,
    /// Carries the placement effect posture.
    pub placement_state: PlacementState,
    /// Carries independent material availability.
    pub retrieval_state: RetrievalState,
    /// Discloses the formal storage location when permitted.
    pub location_ref: Option<StorageLocationRef>,
    /// Discloses the formal tier when permitted.
    pub tier_ref: Option<StorageTierRef>,
    /// Discloses the formal placement commit when permitted.
    pub commit_ref: Option<ExternalCommitRef>,
}
```

`pub fn assemble(placement_ref: ArchivePlacementRef, placement_state: PlacementState, retrieval_state: RetrievalState, location_ref: Option<StorageLocationRef>, tier_ref: Option<StorageTierRef>, commit_ref: Option<ExternalCommitRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeLifecycleExecutionView`

```rust
/// Summarizes one execution without disclosing governance policy bodies.
pub struct SafeLifecycleExecutionView {
    /// Identifies the execution.
    pub execution_ref: LifecycleExecutionRef,
    /// Pins its original formal decision.
    pub decision_ref: GovernanceDecisionRef,
    /// Identifies the authorized action.
    pub action_kind: LifecycleActionKind,
    /// Carries local execution progress.
    pub execution_state: LifecycleExecutionState,
    /// Discloses the current safe blocking or failure basis.
    pub reason_ref: Option<SafeReasonRef>,
}
```

`pub fn assemble(execution_ref: LifecycleExecutionRef, decision_ref: GovernanceDecisionRef, action_kind: LifecycleActionKind, execution_state: LifecycleExecutionState, reason_ref: Option<SafeReasonRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeVerificationAssessmentView`

```rust
/// Summarizes one fixed-input integrity assessment.
pub struct SafeVerificationAssessmentView {
    /// Identifies the persisted assessment.
    pub assessment_ref: VerificationAssessmentRef,
    /// Pins the exact assessed input.
    pub input_binding: VerificationInputBinding,
    /// Preserves the committed integrity posture.
    pub posture: VerificationPosture,
    /// Discloses the formal capability when permitted.
    pub capability_ref: Option<IntegrityCapabilityRef>,
}
```

`pub fn assemble(assessment_ref: VerificationAssessmentRef, input_binding: VerificationInputBinding, posture: VerificationPosture, capability_ref: Option<IntegrityCapabilityRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeCompatibilityAssessmentView`

```rust
/// Summarizes support for one exact version and target context.
pub struct SafeCompatibilityAssessmentView {
    /// Identifies the persisted assessment.
    pub assessment_ref: CompatibilityAssessmentRef,
    /// Pins the exact intended use or receiver.
    pub target_context: CompatibilityTargetContext,
    /// Carries the supported or conservative non-supported result.
    pub posture: CompatibilityPosture,
    /// Pins the disclosed schema version references.
    pub schema_version_refs: SchemaVersionRefSet,
    /// Discloses the formal capability when permitted.
    pub capability_ref: Option<CompatibilityCapabilityRef>,
}
```

`pub fn assemble(assessment_ref: CompatibilityAssessmentRef, target_context: CompatibilityTargetContext, posture: CompatibilityPosture, schema_version_refs: SchemaVersionRefSet, capability_ref: Option<CompatibilityCapabilityRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeVerificationFindingView`

```rust
/// Summarizes one authorized safe finding.
pub struct SafeVerificationFindingView {
    /// Identifies the finding.
    pub finding_ref: VerificationFindingRef,
    /// Identifies its assessment family and owner.
    pub assessment_ref: AssessmentRef,
    /// Preserves the finding classification.
    pub kind: VerificationFindingKind,
    /// Identifies the safe affected subject.
    pub subject_ref: SafeVerificationSubjectRef,
    /// Discloses the formal evidence when permitted.
    pub basis_ref: Option<CapabilityEvidenceRef>,
    /// Preserves the local observation time used for ordering.
    pub recorded_at: RecordedAt,
}
```

`pub fn assemble(finding_ref: VerificationFindingRef, assessment_ref: AssessmentRef, kind: VerificationFindingKind, subject_ref: SafeVerificationSubjectRef, basis_ref: Option<CapabilityEvidenceRef>, recorded_at: RecordedAt) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeRestoreItemView`

```rust
/// Summarizes progress for one explicit restore owner.
pub struct SafeRestoreItemView {
    /// Identifies the restore item.
    pub item_ref: RestoreItemRef,
    /// Preserves the single target owner.
    pub target_owner_ref: RestoreOwnerRef,
    /// Preserves the local item posture.
    pub item_state: RestoreItemState,
    /// Points to the disclosed latest handoff.
    pub latest_handoff_ref: Option<RestoreHandoffRef>,
    /// Points to the disclosed latest outcome.
    pub latest_outcome_ref: Option<HandoffOutcomeRef>,
    /// Points to the disclosed latest compensation.
    pub latest_compensation_ref: Option<CompensationRecordRef>,
    /// Discloses the safe current blocker when permitted.
    pub reason_ref: Option<SafeReasonRef>,
}
```

`pub fn assemble(item_ref: RestoreItemRef, target_owner_ref: RestoreOwnerRef, item_state: RestoreItemState, latest_handoff_ref: Option<RestoreHandoffRef>, latest_outcome_ref: Option<HandoffOutcomeRef>, latest_compensation_ref: Option<CompensationRecordRef>, reason_ref: Option<SafeReasonRef>) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeHandoffOutcomeView`

```rust
/// Summarizes one immutable receiver observation.
pub struct SafeHandoffOutcomeView {
    /// Identifies the observation.
    pub outcome_ref: HandoffOutcomeRef,
    /// Preserves the conservative receiver result.
    pub receiver_outcome: ReceiverOutcomePosture,
    /// Discloses proved receiver commit only when permitted.
    pub receiver_commit_ref: Option<ReceiverCommitRef>,
    /// Preserves the local observation time.
    pub observed_at: RecordedAt,
}
```

`pub fn assemble(outcome_ref: HandoffOutcomeRef, receiver_outcome: ReceiverOutcomePosture, receiver_commit_ref: Option<ReceiverCommitRef>, observed_at: RecordedAt) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

#### `SafeCompensationView`

```rust
/// Summarizes one formally authorized compensation.
pub struct SafeCompensationView {
    /// Identifies the compensation.
    pub compensation_ref: CompensationRecordRef,
    /// Identifies its authorized action.
    pub action: CompensationAction,
    /// Preserves the compensation progress.
    pub state: CompensationState,
    /// Discloses formal feedback when permitted.
    pub outcome_ref: Option<ExternalFeedbackRef>,
    /// Preserves the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

`pub fn assemble(compensation_ref: CompensationRecordRef, action: CompensationAction, state: CompensationState, outcome_ref: Option<ExternalFeedbackRef>, recorded_at: RecordedAt) -> ContractResult<Self>` 接收表内全部字段；唯一来源为 application 对同一 committed record 的授权裁剪。`pub fn validate_shape(&self) -> ContractResult<()>` 校验 enum/载荷一致性；其余只提供 `pub fn <field>(&self) -> &<FieldType>` 同名 accessor，不执行 I/O。

集合 schema 为各行 `<SummaryName>Set(pub Vec<SummaryName>)`（单值行不创建 set），均归 contracts::views。每个 set 提供 `pub fn try_from_iter(items: impl IntoIterator<Item = SummaryName>) -> ContractResult<Self>`、`pub fn iter(&self) -> std::slice::Iter<'_, SummaryName>`、`pub fn len(&self) -> usize`、`pub fn is_empty(&self) -> bool`，按上表 identity 拒绝重复；append-order 的集合保留 store 返回的顺序，不能按 ref 重新排序冒充历史顺序。无业务 mutation。

application 负责在同一 read snapshot 中读取并校验 job/component、manifest/entry、plan/item、handoff/outcome 的归属；contracts factory 只校验已有字段形状，不宣称从 opaque ref 反推 owner/revision。Step 8 仅决定外层 response/disclosure schema，不把 domain body 放进 public view。

| 类型 / 变体 | 来源 | 允许去向 | 禁止事项 |
|---|---|---|---|
| `ViewFreshness::*` | read store revision/input comparison | immutable response classification | 不读取 owner 当前 truth；Stale/Mixed/Unknown 不伪装 Current |
| `RedactionPosture::*` | current visibility/redaction decision | immutable response classification | 不列出隐藏字段/规则细节 |
| `SafeViewMetadata` | query metadata + read composition + clock | view only | 不含 raw role/secret/hidden target |
| `SafeRead::Visible(T)` | current access allowed且 shape 已统一裁剪 | response | 泛型 payload 必须为 safe view，不得直接返回 domain aggregate |
| `SafeRead::NotAvailable` | absent、hidden、revoked 或不可安全披露 | response | 不包含 reason、existence bit 或 timing hint |

### 6.5 五类 safe view

#### `SafeArchiveJobStatusView`

```rust
/// Presents one Archive job and its committed component postures without owner-state inference.
pub struct SafeArchiveJobStatusView {
    /// Carries uniform response metadata.
    pub metadata: SafeViewMetadata,
    /// Identifies the Archive job.
    pub job_ref: ArchiveJobRef,
    /// Identifies the admitted request without exposing its body.
    pub request_ref: OperationRequestRef,
    /// Classifies the workflow.
    pub job_kind: ArchiveJobKind,
    /// Identifies the current bounded stage.
    pub current_stage: ArchiveJobStage,
    /// Carries the conservative Archive-local aggregate posture.
    pub aggregate_posture: JobAggregatePosture,
    /// Lists authorized component summaries in stable order.
    pub components: SafeJobComponentViewSet,
}
```

字段来源：`ArchiveJob`、latest stage record、各 CP 已提交本地状态，经 `ArchiveQueryService` visibility/redaction 后组装。`SafeJobComponentView` 字段见 §6.4，不得包含 external body。对象只提供 accessor；factory=`assemble(metadata: SafeViewMetadata, job_ref: ArchiveJobRef, request_ref: OperationRequestRef, job_kind: ArchiveJobKind, current_stage: ArchiveJobStage, aggregate_posture: JobAggregatePosture, components: SafeJobComponentViewSet) -> ContractResult<Self>`，只验证字段 shape；组件与 job 的实际归属由 application 从同一已提交读取快照校验。禁止从 `Completed` 推导 project archived/restored。

#### `SafeArchiveBundleView`

```rust
/// Presents an authorized Bundle revision, provenance, closure, placement, and lifecycle posture.
pub struct SafeArchiveBundleView {
    /// Carries uniform response metadata.
    pub metadata: SafeViewMetadata,
    /// Pins the visible Bundle revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Carries the Archive-owned Bundle state.
    pub bundle_state: ArchiveBundleState,
    /// Carries closure for the exact visible manifest revision.
    pub closure_posture: ManifestClosurePosture,
    /// Lists consistently redacted source and material summaries.
    pub entries: SafeManifestEntryViewSet,
    /// Carries placement and retrieval as independent axes.
    pub placement: Option<SafePlacementView>,
    /// Lists decision-bound lifecycle execution summaries.
    pub lifecycle: SafeLifecycleExecutionViewSet,
}
```

字段来源：fixed `ArchiveBundle + BundleManifest + ManifestEntry + ManifestClosure`，以及 matching placement/lifecycle records。entry summary 必须保留 `SourceClass/ArchiveMaterialClass/coverage/version/fence` 的安全表示；locator/digest ref 仅在当前授权允许时出现。factory 只验证 summary shape；application 在裁剪前核验 exact manifest revision/placement/lifecycle 归属并拒绝 mixed revision。禁止自动 capture/repair/retrieve/verify，也不得把 Artifact/workspace/observability entry 冒充 canonical。

#### `SafeBundleVerificationView`

```rust
/// Presents fixed-input integrity and target-specific compatibility assessments.
pub struct SafeBundleVerificationView {
    /// Carries uniform response metadata.
    pub metadata: SafeViewMetadata,
    /// Pins the Bundle and manifest revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Carries the latest authorized matching integrity assessment summary.
    pub integrity: Option<SafeVerificationAssessmentView>,
    /// Lists target-specific compatibility summaries.
    pub compatibility: SafeCompatibilityAssessmentViewSet,
    /// Lists redacted finding summaries for the same fixed inputs.
    pub findings: SafeVerificationFindingViewSet,
}
```

字段来源：matching committed assessments/findings only；factory=`assemble(metadata: SafeViewMetadata, bundle_revision_ref: BundleRevisionRef, integrity: Option<SafeVerificationAssessmentView>, compatibility: SafeCompatibilityAssessmentViewSet, findings: SafeVerificationFindingViewSet) -> ContractResult<Self>` 仅校验已携带的 input/revision 和 summary shape；findings 关联由 application 在同一读取快照核验。Unknown/Blocked/Unsupported/IntegrityFailed 必须显式可见；缺记录不能构造 Verified/Supported。Query 名为 Verify 也不得调用 capability 或写新 assessment。

#### `SafeRestorePlanView`

```rust
/// Presents one immutable restore plan revision and independent per-owner item postures.
pub struct SafeRestorePlanView {
    /// Carries uniform response metadata.
    pub metadata: SafeViewMetadata,
    /// Identifies the plan.
    pub plan_ref: RestorePlanRef,
    /// Pins the input Bundle revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Identifies the immutable plan revision.
    pub plan_revision: RestorePlanRevision,
    /// Carries the conservative plan posture.
    pub plan_state: RestorePlanState,
    /// Lists authorized owner-specific item summaries.
    pub items: SafeRestoreItemViewSet,
}
```

字段来源：`RestorePlan`、matching `RestoreItem/Handoff/Outcome/Compensation` committed records。item summary 保留 owner、source class 和多轴 posture，但 material/receiver/commit refs 按 current visibility 裁剪。factory 只校验 summary shape；application 读取实际 item/plan，验证同一 plan revision 后才裁剪。禁止将 HandoffComplete/单项 Succeeded 转成 restored。

#### `SafeRestoreHandoffView`

```rust
/// Presents one owner-specific handoff and its append-only outcome and compensation summaries.
pub struct SafeRestoreHandoffView {
    /// Carries uniform response metadata.
    pub metadata: SafeViewMetadata,
    /// Identifies the handoff.
    pub handoff_ref: RestoreHandoffRef,
    /// Identifies the single owner-specific restore item.
    pub item_ref: RestoreItemRef,
    /// Identifies the target owner without exposing owner data.
    pub target_owner_ref: RestoreOwnerRef,
    /// Carries the current Archive-owned handoff posture.
    pub handoff_state: RestoreHandoffState,
    /// Lists authorized outcome observations in stable append order.
    pub outcomes: SafeHandoffOutcomeViewSet,
    /// Lists authorized compensation observations in stable append order.
    pub compensations: SafeCompensationViewSet,
}
```

字段来源：exact handoff/item + append-only outcome/compensation history。factory 只校验 summary shape；application 读取实际 owner/item/handoff/outcome/compensation 做 correlation；不调用 receiver probe/retry/compensation。CommitUnknown 与 conflicting feedback 必须保留，不暴露未授权 material/commit/provider raw ref。

五类 view 的辅助集合/summary 均按 §6.4 定义在 `contracts::views`；Step 8 只闭合 Query request/response 外层 schema、选择项和 disclosure mapping，不得临时引用 domain object、改写 summary owner 或引入 raw adapter DTO。

#### View / metadata 的无副作用函数补全

| owner | 完整签名 | 来源与约束 |
|---|---|---|
| `SafeViewMetadata` | `pub fn assemble(request_id: core_contracts::metadata::RequestId, trace_id: core_contracts::metadata::TraceId, freshness: ViewFreshness, redaction: RedactionPosture, assembled_at: RecordedAt) -> Self` | query context + application clock；freshness/redaction 来自已核验读取快照 |
| `SafeNotAvailable` | `pub fn new() -> Self` | 无字段，不接 hidden/not-found reason |
| `SafeRead<T>` | `pub fn visible(view: T) -> Self`; `pub fn not_available() -> Self`; `pub fn as_visible(&self) -> Option<&T>` | visibility 由 application 核验；public T 不能为 domain 类型 |
| `SafeArchiveBundleView` | `pub fn assemble(metadata: SafeViewMetadata, bundle_revision_ref: BundleRevisionRef, bundle_state: ArchiveBundleState, closure_posture: ManifestClosurePosture, entries: SafeManifestEntryViewSet, placement: Option<SafePlacementView>, lifecycle: SafeLifecycleExecutionViewSet) -> ContractResult<Self>` | application 验同 revision；shape 拒绝 Sealed/ClosureReady 配非 Complete closure |
| `SafeRestorePlanView` | `pub fn assemble(metadata: SafeViewMetadata, plan_ref: RestorePlanRef, bundle_revision_ref: BundleRevisionRef, plan_revision: RestorePlanRevision, plan_state: RestorePlanState, items: SafeRestoreItemViewSet) -> ContractResult<Self>` | 不从授权裁剪后的 item 子集重算 plan_state |
| `SafeRestoreHandoffView` | `pub fn assemble(metadata: SafeViewMetadata, handoff_ref: RestoreHandoffRef, item_ref: RestoreItemRef, target_owner_ref: RestoreOwnerRef, handoff_state: RestoreHandoffState, outcomes: SafeHandoffOutcomeViewSet, compensations: SafeCompensationViewSet) -> ContractResult<Self>` | 不凭裁剪后的 history 子集计算成功 |

五大 view 均提供 `pub fn validate_shape(&self) -> ContractResult<()>` 以及同名只读字段 accessor；其余两个 assemble 的完整签名在对应对象下。shape 不执行 authorization/resolve，也不解释不可见的 refs。`ViewFreshness::Mixed` 只说明 job 等跨记录读取不一致；fixed revision 的 Bundle/verification/restore view 不能用 Mixed 放行拼接，须仅取匹配记录或安全不可用。


#### contracts read 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `ViewFreshness` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Current` | `Every included Archive record matches the requested fixed input or current committed revision.` | 同一次已提交读取快照及请求 revision | SafeViewMetadata；不表示 owner 当前真相 |
| `Stale` | `At least one included record is older than the requested or current Archive revision.` | 同一次已提交读取快照及请求 revision | SafeViewMetadata；不表示 owner 当前真相 |
| `Mixed` | `Included records were produced from mixed immutable revisions.` | 同一次已提交读取快照及请求 revision | SafeViewMetadata；不表示 owner 当前真相 |
| `Unknown` | `Archive cannot prove freshness from available committed metadata.` | 同一次已提交读取快照及请求 revision | SafeViewMetadata；不表示 owner 当前真相 |

##### `RedactionPosture` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `None` | `No field visible under the current contract required redaction.` | current formal disclosure decision | SafeViewMetadata；不泄漏 hidden 字段名 |
| `Redacted` | `One or more fields were removed under the current disclosure decision.` | current formal disclosure decision | SafeViewMetadata；不泄漏 hidden 字段名 |

##### `SafeRead` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Visible(T)` | `Returns an authorized and consistently redacted view.` | Query current visibility + safe redaction mapping | public response；NotAvailable 不区分 hidden/absent |
| `NotAvailable(SafeNotAvailable)` | `Hides whether the target is absent, hidden, or no longer visible.` | Query current visibility + safe redaction mapping | public response；NotAvailable 不区分 hidden/absent |


### 6.6 Contracts 对象组内部停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 正式对象分母 | pass | `DeclaredArchiveScope`、`GovernanceDecisionRef` 恰为 2 个 contracts 正式对象；其余为 vocabulary/view，不计入 26 |
| 字段来源 | pass_at_step_6 | factory 必填字段均由 validated input 或 mapped formal decision 提供；无 domain 自生成 |
| source authority | pass | scope 不替代 coverage；decision ref 不解释 governance truth |
| safe read | pass | 五 Query 各有唯一 view；hidden/absent 统一，所有路径 no-write |
| 依赖方向 | pass | view/state/ref 不引用 domain 类型；未来 application 负责从 domain 组装 |
| 后续承接 | pass_with_blockers | exact protocol/disclosure/port outcome 由 Step 7/8；external contract blockers 不变 |

## 7. `domain` CP1～CP2 对象实现契约（7/24）

### 7.1 Domain CP1～CP2 capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| archive admission truth | frozen scope、actor、admission basis、key/digest | immutable request | local request record | `ArchiveRequest` | Step 9 admission flow；Step 11 UoW |
| bounded job coordination | admitted operation ref、component postures、expected version | job posture + transition record | mutable local truth | `ArchiveJob`、`ArchiveJobStageRecord` | Step 9/10/11/13 |
| source plan/bind | request scope + class/selector/requiredness + formal binding | source binding | mutable binding truth | `ArchiveSourceBinding` | Step 7 source port；Step 9 |
| fixed capture attempt | bound source + optional requested fence + mapped result | materials/version/coverage/findings | mutable attempt + immutable coverage/finding | `CaptureAttempt`、`CaptureCoverage`、`SourceCaptureFinding` | Step 7/9/10/11 |

### 7.2 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 不承接 / 禁止事项 |
|---|---|---|---|---|
| `ArchiveRequest` | archive request admission | aggregate / immutable admission | digest match、operation ref | 不决定项目状态/批准；不启动 capture |
| `ArchiveJob` | archive/restore job coordination | aggregate | legal stage advance、conservative recompute、block | 不执行外部 I/O；Completed 不传播 owner truth |
| `ArchiveJobStageRecord` | append-only stage history | immutable history | 记录 from/to/basis/time | 不更新 current job、不可删除 |
| `ArchiveSourceBinding` | per-source authority/contract binding | entity | plan、bind、block、retire | 不建立 sibling compile 依赖；Auxiliary 不转 canonical |
| `CaptureAttempt` | one fixed capture intent/result | history entity | start、mark in progress、settle、block、supersede | timeout 不等 empty/failed；不跨 attempt 合并 |
| `CaptureCoverage` | owner-proven coverage | immutable assessment | conservative assess | 不按 material count 或跨 owner version 推导 Complete |
| `SourceCaptureFinding` | safe source discrepancy evidence | immutable history | record | 不保存 secret/raw source body |

### 7.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 必需字段 | factory / 构造 | 成员函数 | state / posture | 字段来源 |
|---|---|---|---|---|---|
| `ArchiveRequest` | id/scope/actor/key/digest/admission basis/time | `admit/reject/block` | `matches/operation_ref/authority_ref` | `RequestAdmissionState` 派生 | application validated input + Core actor/key + clock |
| `ArchiveJob` | id/request/kind/stage/posture/version | `queue` | `advance/recompute/block` | job stage + aggregate | request service + store expected version |
| stage record | id/job/from/to/basis/time | `append` | accessors only | immutable | job transition + ID/clock |
| source binding | id/request/class/selector/requiredness/authority/contract/state/version | `plan` | `bind/block/retire` | binding state | scope + source port mapped refs |
| capture attempt | id/binding/fence/version/materials/coverage/state/version | `start` | `mark_in_progress/settle/block/supersede` | attempt state | worker intent + source outcome |
| coverage | posture/scope/evidence/findings | `assess` | `is_complete` | coverage posture | owner evidence + pure evaluation |
| source finding | id/attempt/kind/subject/evidence/time | `record` | accessors only | immutable kind | mapped evidence + ID/clock |

### 7.4 `ArchiveRequest`（domain 正式对象 1/24）

```rust
/// Stores one immutable archive admission result without granting project-state authority.
pub struct ArchiveRequest {
    /// Identifies the Archive-owned request.
    pub request_id: ArchiveRequestId,
    /// Freezes the declared project and slice scope.
    pub scope: DeclaredArchiveScope,
    /// Identifies the requesting principal without copying identity truth.
    pub requested_by: archive_contracts::context::core_shared::actor::ActorRef,
    /// Carries the outcome-specific authority or safe failure basis.
    pub admission_basis: RequestAdmissionBasis,
    /// Carries the caller-scoped idempotency key.
    pub idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
    /// Detects reuse of the key with different canonical input.
    pub input_digest: SafeInputDigest,
    /// Records when Archive committed the admission observation.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `request_id` | `ArchiveRequestId` | 本地身份 | application ID source 显式传入；非空；domain 不生成 |
| `scope` | `DeclaredArchiveScope` | 冻结 archive 声明 | contracts shape 已通过；immutable |
| `requested_by` | Core `ActorRef` | 可追溯请求主体 | `ActorContext.actor`；role/display 不作授权 truth |
| `admission_basis` | `RequestAdmissionBasis` | 同时表达 admission 与合法 basis | Accepted 必有 `AuthorityRef`；Rejected/Blocked 不伪造 authority |
| `idempotency_key` | Core `IdempotencyKey` | 受理去重 | Command metadata/validated input；scope 由 Step 13 定义 |
| `input_digest` | `SafeInputDigest` | 同 key 异输入检测 | application 对稳定 protocol input 计算；不是 Bundle digest |
| `recorded_at` | `RecordedAt` | Archive 本地记录时间 | application clock；非 owner event time |

| 成员函数签名 | 作用 | 参数 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn admission(&self) -> RequestAdmissionState` | 从 basis 派生最终 admission | 无 | state | 纯函数；不存第二份可能漂移的 state |
| `pub fn matches(&self, input_digest: &SafeInputDigest) -> bool` | 核对幂等输入 | digest | bool | constant semantic equality；不执行重放 |
| `pub fn operation_ref(&self) -> OperationRequestRef` | 生成 body-free request ref | 无 | Archive variant | 纯函数 |
| `pub fn authority_ref(&self) -> Option<&AuthorityRef>` | Accepted 时读取正式依据 | 无 | optional ref | Rejected/Blocked 必须 None |

```rust
impl ArchiveRequest {
    /// Creates an accepted request backed by a formal authority reference.
    pub fn admit(
        request_id: ArchiveRequestId,
        scope: DeclaredArchiveScope,
        requested_by: archive_contracts::context::core_shared::actor::ActorRef,
        authority_ref: AuthorityRef,
        idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
        input_digest: SafeInputDigest,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;

    /// Creates a final rejected request backed by a safe definite reason.
    pub fn reject(
        request_id: ArchiveRequestId,
        scope: DeclaredArchiveScope,
        requested_by: archive_contracts::context::core_shared::actor::ActorRef,
        reason_ref: SafeReasonRef,
        idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
        input_digest: SafeInputDigest,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;

    /// Creates a final blocked request without inventing a missing authority.
    pub fn block(
        request_id: ArchiveRequestId,
        scope: DeclaredArchiveScope,
        requested_by: archive_contracts::context::core_shared::actor::ActorRef,
        basis: RequestBlockBasis,
        idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
        input_digest: SafeInputDigest,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

三个 factory 覆盖所有必填字段并固定 admission；无成员迁移。相同 key/digest 由 application 返回 stored result，不重新构造。禁止从项目 lifecycle/event arrival 推导 authority，禁止把 Accepted/幂等命中当归档完成。

### 7.5 `ArchiveJob`（domain 正式对象 2/24）

```rust
/// Coordinates bounded Archive-owned stages without collapsing component or owner truth.
pub struct ArchiveJob {
    /// Identifies the job.
    pub job_id: ArchiveJobId,
    /// Points to the immutable admitted operation request.
    pub request_ref: OperationRequestRef,
    /// Distinguishes archive and restore workflows.
    pub job_kind: ArchiveJobKind,
    /// Identifies the current bounded stage.
    pub current_stage: ArchiveJobStage,
    /// Carries the conservative Archive-local aggregate posture.
    pub aggregate_posture: JobAggregatePosture,
    /// Carries the optimistic aggregate version.
    pub job_version: ArchiveJobVersion,
    /// Preserves every explicit job blocker at its loaded record version.
    pub block_history: Vec<BasisObservation<JobBlockBasis>>,
    /// Preserves the last complete component input used for conservative aggregation.
    pub component_postures: JobComponentPostureSet,
}
```

| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| `job_id` | `ArchiveJobId` | request service ID source；一个 admitted operation 由 idempotency/UoW 约束唯一 job |
| `request_ref` | `OperationRequestRef` | 仅 Accepted request；kind 必须与 job kind 一致 |
| `job_kind` | `ArchiveJobKind` | 从 request ref 派生，不可改变 |
| `current_stage` | `ArchiveJobStage` | 初始 Queued；kind-specific legal stage |
| `aggregate_posture` | `JobAggregatePosture` | 初始 Queued；只由已提交 component posture 保守聚合 |
| `job_version` | `ArchiveJobVersion` | store/factory；每次持久迁移 expected-version 校验，递增由 UoW/store |
| `block_history` / `component_postures` | typed Vec / `JobComponentPostureSet` | queue 初始空；block 追加 basis，recompute 保存完整输入；advance 不删除阻塞历史，未解阻不得推进 |

| 成员函数签名 | 作用 | 参数 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn advance(&mut self, next_stage: ArchiveJobStage, expected_version: ArchiveJobVersion, basis: &StageBasis) -> DomainResult<StageTransition>` | 验证 version/kind/stage edge 并改变 stage；posture 仅首次 Queued→Running | next/version/basis | from/to transition | 内存变化；history record ID/time 由 application 后续生成 |
| `pub fn recompute(&mut self, component_postures: &JobComponentPostureSet, expected_version: ArchiveJobVersion) -> DomainResult<JobAggregateTransition>` | 形成最保守聚合 | 全部分量 + expected version | old/new posture | 不吞 Partial/Blocked/Unknown；不改 current stage |
| `pub fn block(&mut self, basis: &JobBlockBasis, expected_version: ArchiveJobVersion) -> DomainResult<JobAggregateTransition>` | 显式进入 Blocked | basis/version | transition | 保留局部结果；不删除 component record |
| `pub fn is_terminal(&self) -> bool` | 判断 Completed | 无 | bool | 纯函数；Failed 不是业务成功，不自动重试，重试路径须 Step 10/12 明确 |

```rust
impl ArchiveJob {
    /// Queues a unique job for an accepted immutable request.
    pub fn queue(
        job_id: ArchiveJobId,
        request_ref: OperationRequestRef,
        job_kind: ArchiveJobKind,
        initial_version: ArchiveJobVersion,
    ) -> DomainResult<Self>;
}
```

transition schema 见 §5.7；block 将传入 basis 复制到 `block_history`，recompute 同时保存 component 输入，stage basis 由 `ArchiveJobStageRecord` 持久保存。job 没有 latest-time 字段，方法不读取或更新时间。禁止 Completed→Running、Query 触发迁移、单 CP success→Completed、job 状态反写 project/owner。

#### 聚合判定与集合前提

`JobComponentPostureSet` 按 component 唯一，不按整个 struct 去重。application 必须从 immutable request/kind 和已提交 workflow 读取 required component 集合，核验输入精确覆盖且 basis 实际属于本 job；未闭合/空集合不能调用正向 recompute。domain 在合法来源状态内按以下顺序计算：任一 Blocked→Blocked；否则任一 Failed→Failed；否则全部 Completed→Completed；否则含 Partial 或 Completed 与未完成混合→Partial；否则含 Running→Running；全部 Pending 保留 Queued（尚未推进时）或 Running。该计算不得越过上文迁移边界；Blocked 只有正式解阻后先回 Running，Failed/Completed 不被 recompute 复活。

advance 只变 current_stage；唯一 aggregate 联动为 Queued→Running。Completed stage 要求已保存完整 component_postures 且 aggregate=Completed；除最后 Completed edge 外，aggregate Completed/Failed/Blocked 禁止 advance。stage/recompute/history 的提交一致性由 application UoW 保证；既有 stage 不作为外部成功证明。

### 7.6 `ArchiveJobStageRecord`（domain 正式对象 3/24）

```rust
/// Preserves one append-only Archive job stage transition and its safe basis.
pub struct ArchiveJobStageRecord {
    /// Identifies the history record.
    pub record_id: JobStageRecordId,
    /// Identifies the owning Archive job.
    pub job_id: ArchiveJobId,
    /// Carries the previous stage, or None for the initial queue record.
    pub from_stage: Option<ArchiveJobStage>,
    /// Carries the committed new stage.
    pub to_stage: ArchiveJobStage,
    /// Points to the safe committed basis for the transition.
    pub basis: StageBasis,
    /// Records when Archive persisted the transition.
    pub recorded_at: RecordedAt,
}
```

所有字段均必填（`from_stage` 仅 initial record 为 None），来源为 `ArchiveJob.advance/queue` transition、application ID/clock。唯一 factory：

```rust
impl ArchiveJobStageRecord {
    /// Creates one immutable history record from a validated job transition.
    pub fn append(
        record_id: JobStageRecordId,
        job_id: ArchiveJobId,
        from_stage: Option<ArchiveJobStage>,
        to_stage: ArchiveJobStage,
        basis: StageBasis,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

无 mutating 成员函数，仅 `job_ref()`、字段 accessor。initial record 必须 `None→Queued`；其余必须有 from 且 from != to，并由 application 保证与 job transition 同一局部事务追加。记录不可更新/删除；basis 不得含 raw provider/owner body。

### 7.7 `ArchiveSourceBinding`（domain 正式对象 4/24）

```rust
/// Binds one declared slice to a formal source authority and contract context.
pub struct ArchiveSourceBinding {
    /// Identifies the source binding.
    pub binding_id: SourceBindingId,
    /// Points to the owning archive request.
    pub request_ref: ArchiveRequestRef,
    /// Selects the owner-defined slice.
    pub slice_selector: OwnerSliceSelector,
    /// Declares closure participation.
    pub requiredness: SourceRequiredness,
    /// Carries the formal authority after binding succeeds.
    pub authority_ref: Option<SourceAuthorityRef>,
    /// Carries the formal source contract after binding succeeds.
    pub contract_ref: Option<SourceContractRef>,
    /// Records the binding lifecycle.
    pub binding_state: SourceBindingState,
    /// Preserves every explicit binding blocker without clearing resolved history.
    pub block_history: Vec<BasisObservation<SourceBindingBlockBasis>>,
    /// Preserves the explicit retirement reason when retired.
    pub retirement_basis: Option<SafeReasonRef>,
    /// Points to the replacement binding when retirement names one.
    pub replacement_ref: Option<SourceBindingRef>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/request/selector/requiredness | `DeclaredArchiveScope` expansion + ID source；request/scope immutable；WorkspaceProjection 必须 Auxiliary |
| authority/contract option | Planned/Blocked 可 None；Bound 必须二者 Some 且 class 与 selector 相同；只来自 SourceExportPort mapping |
| state/version | factory 初始 Planned + store version；Retired 不复活 |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn bind(&mut self, authority_ref: SourceAuthorityRef, contract_ref: SourceContractRef, expected_version: RecordVersion) -> DomainResult<BindingTransition>` | Planned/Blocked→Bound；验证 source class 一致；不验证外部正文 |
| `pub fn block(&mut self, basis: SourceBindingBlockBasis, expected_version: RecordVersion) -> DomainResult<BindingTransition>` | Planned/Bound→Blocked；原子追加 block_history，不伪造 refs |
| `pub fn retire(&mut self, replacement_ref: Option<SourceBindingRef>, basis: SafeReasonRef, expected_version: RecordVersion) -> DomainResult<BindingTransition>` | Planned/Bound/Blocked→Retired；保存 replacement/basis；replacement 不得指 self |
| `pub fn is_canonical(&self) -> bool` | 仅 Identity/Conversation/Work/Process/Governance canonical snapshot branch；Artifact 有其专属 authority，Workspace/Observability false |

```rust
impl ArchiveSourceBinding {
    /// Plans one binding from an immutable declared archive slice.
    pub fn plan(
        binding_id: SourceBindingId,
        request_ref: ArchiveRequestRef,
        slice_selector: OwnerSliceSelector,
        requiredness: SourceRequiredness,
        initial_version: RecordVersion,
    ) -> DomainResult<Self>;
}
```

`plan` 覆盖所有字段（authority/contract/retirement_basis/replacement_ref=None，block_history 为空，state=Planned）。bind 只写 authority/contract/state，保留历史；retire 的依据和 replacement 来自显式处置。对象没有时间字段，方法不更新时间。禁止将 source 转为 sibling dependency、用 auxiliary 补 canonical、或在 binding 中保存 owner payload。Blocked→Bound 必须重新走正式 adapter mapping。

### 7.8 `CaptureAttempt`（domain 正式对象 5/24）

```rust
/// Records one fixed source capture intent and its conservatively mapped local result.
pub struct CaptureAttempt {
    /// Identifies the attempt.
    pub attempt_id: CaptureAttemptId,
    /// Identifies the bound source.
    pub binding_ref: SourceBindingRef,
    /// Pins the requested owner fence when the contract supports one.
    pub requested_fence: Option<SnapshotFenceRef>,
    /// Carries the owner-specific observed version after a result is mapped.
    pub observed_version: Option<SourceVersionRef>,
    /// Carries only approved material references.
    pub material_refs: ArchivedMaterialRefSet,
    /// Carries immutable owner-proven coverage after settlement.
    pub coverage: Option<CaptureCoverage>,
    /// Records the attempt lifecycle.
    pub attempt_state: CaptureAttemptState,
    /// Preserves blockers observed for this exact capture intent.
    pub block_history: Vec<BasisObservation<CaptureBlockBasis>>,
    /// Records a definite terminal source failure when present.
    pub failure_ref: Option<SafeReasonRef>,
    /// Pins the replacement attempt after supersession.
    pub replacement_attempt_ref: Option<CaptureAttemptRef>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/binding/fence | worker/application persists intent before I/O；binding 必须 Bound；fence 仅来自 owner contract/request |
| observed version/materials/coverage | start 时 None/empty；只由 exact attempt + binding matched mapped result 一次性 settle |
| state/version | Requested→InProgress→settled branch；store expected version；Superseded 拒绝提交 |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn mark_in_progress(&mut self, expected_version: RecordVersion) -> DomainResult<AttemptTransition>` | Requested/Blocked（同 fixed input 解阻）→InProgress |
| `pub fn settle(&mut self, binding: &ArchiveSourceBinding, declared_scope_ref: &DeclaredScopeRef, material_refs: ArchivedMaterialRefSet, observed_version: Option<SourceVersionRef>, coverage: CaptureCoverage, expected_version: RecordVersion) -> DomainResult<AttemptTransition>` | 原子填充 result→Settled；绑定和请求 correlation 必须匹配；version/fence 不足按 Stale/Conflicting/Unknown 留存（§14.9），不拒收真实非 Complete 观察 |
| `pub fn block(&mut self, basis: CaptureBlockBasis, expected_version: RecordVersion) -> DomainResult<AttemptTransition>` | InProgress→Blocked；timeout/合同缺口不能映射 Missing |
| `pub fn fail(&mut self, reason_ref: SafeReasonRef, expected_version: RecordVersion) -> DomainResult<AttemptTransition>` | InProgress→Failed，仅 definite source failure |
| `pub fn supersede(&mut self, replacement_attempt_ref: CaptureAttemptRef, expected_version: RecordVersion) -> DomainResult<AttemptTransition>` | Requested/InProgress/Blocked→Superseded；replacement 不能等于 self |

```rust
impl CaptureAttempt {
    /// Persists one capture intent before any source interaction occurs.
    pub fn start(
        attempt_id: CaptureAttemptId,
        binding_ref: SourceBindingRef,
        requested_fence: Option<SnapshotFenceRef>,
        initial_version: RecordVersion,
    ) -> DomainResult<Self>;
}
```

禁止跨 attempt 合并结果、把 event/cache 当 owner snapshot、空 material set 当 Missing、timeout 当 Failed 或 Superseded attempt 后提交。commit-unknown 本地写恢复由 Step 11/13 读回 exact attempt key，不在对象中私造状态。

`start` 初始化 block_history 为空、failure/replacement=None；block 追加 typed basis，fail 保存 reason，supersede 保存 replacement，后续合法解阻不删除 block_history。无时间字段，不隐式记时。factory 的 Bound/fixed-context 校验由 application 先读 binding 完成，`settle` 的 owner/scope/fence 校验需要 §14.9 指定的显式上下文，不能从 opaque binding ref 反推。

### 7.9 `CaptureCoverage`（domain 正式对象 6/24）

```rust
/// Assesses one owner's proof against one immutable declared scope reference.
pub struct CaptureCoverage {
    /// Carries the conservative coverage posture.
    pub posture: CaptureCoveragePosture,
    /// Pins the declared scope used for comparison.
    pub declared_scope_ref: DeclaredScopeRef,
    /// Carries the formal owner evidence when available.
    pub owner_coverage: Option<OwnerCoverageEvidence>,
    /// Lists findings that explain every non-complete result.
    pub finding_refs: SourceCaptureFindingRefSet,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| posture | pure conservative evaluator over scope + mapped evidence/findings |
| declared scope | owning archive request/scope revision；必填且 immutable |
| owner coverage | Complete/Partial/Missing/Stale/Conflicting 必须有正式 evidence；Unknown 可 None |
| findings | Complete 必须空；所有其他 posture 至少一项且与同 attempt/scope 关联 |

唯一 factory：`pub fn assess(declared_scope_ref: DeclaredScopeRef, owner_coverage: Option<OwnerCoverageEvidence>, finding_refs: SourceCaptureFindingRefSet) -> DomainResult<Self>`；owner_coverage=None 只能 Unknown 且至少一 finding；Some 要求 scope 相等，posture 来自显式 owner classification，Complete 必须无 finding，其余至少一 finding。application 校验 finding 同 attempt/owner，domain 不从 opaque ref 反推 kind。成员 `pub fn is_complete(&self) -> bool`、`pub fn authority_ref(&self) -> Option<&SourceAuthorityRef>`、`pub fn explains(&self, finding_ref: &SourceCaptureFindingRef) -> bool` 无副作用。对象 immutable；禁止由数量推导 Complete、跨 owner 比版本、以 projection/ref 补 canonical。

### 7.10 `SourceCaptureFinding`（domain 正式对象 7/24）

```rust
/// Preserves one safe append-only source capture discrepancy observation.
pub struct SourceCaptureFinding {
    /// Identifies the finding.
    pub finding_id: SourceCaptureFindingId,
    /// Identifies the exact capture attempt.
    pub attempt_ref: CaptureAttemptRef,
    /// Classifies the discrepancy.
    pub kind: SourceCaptureFindingKind,
    /// Points to the affected subject without copying source data.
    pub subject_ref: SafeSourceSubjectRef,
    /// Points to formal external evidence when one exists.
    pub basis_ref: Option<ExternalEvidenceRef>,
    /// Records when Archive persisted the observation.
    pub recorded_at: RecordedAt,
}
```

唯一 factory：`pub fn record(finding_id: SourceCaptureFindingId, attempt_ref: CaptureAttemptRef, kind: SourceCaptureFindingKind, subject_ref: SafeSourceSubjectRef, basis_ref: Option<ExternalEvidenceRef>, recorded_at: RecordedAt) -> DomainResult<Self>`。`Partial/Missing/Stale/Conflicting/Redacted` 必须有 external evidence ref；`Unknown` 可无，但仍须 safe subject。对象无 mutating 方法，只提供 accessor/ref。禁止保存 secret、raw response、未授权正文、自由文本 provider 错误，或把 finding 当 owner truth。

### 7.11 CP1～CP2 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 承接 | pass | admission/job/binding/capture/coverage/finding 全部有唯一对象 |
| 正式对象计数 | pass | 7/7：CP1 domain 3 + CP2 domain 4；contracts scope 另计，不重复 |
| 字段来源 | pass_at_step_6 | Blocked/Planned 不伪造 authority；ID/time/version 均由 application/store 输入 |
| 状态 | pass_at_step_6 | immutable admission/coverage/history 与 mutable job/binding/attempt 分离 |
| source authority | pass_with_blockers | owner proof slots 明确；exact snapshot/export 仍受 `AR-UP-001/006~008` 阻断 |
| 后续承接 | pass | Step 7 必须给 ID/clock/store/source outcome；Step 9/10/11/13 必须闭合原子记录、迁移和 fencing |

## 8. `domain` CP3～CP4 对象实现契约（8/24）

### 8.1 CP3～CP4 capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| Bundle revision coordination | Accepted archive request、fixed source inventory | current immutable manifest ref + Bundle state | mutable Bundle truth | `ArchiveBundle` | Step 9/10/11 |
| immutable inventory | declared slots、approved actual materials、previous revision | fixed manifest + entries | immutable revision/history | `BundleManifest`、`ManifestEntry` | Step 9/11 |
| closure evaluation | same-revision declared/actual entries | closure + difference findings | pure evaluation + immutable result | `ManifestClosure`、`ClosureFinding` | Step 9/10/16 |
| integrity assessment | fixed input + mapped formal capability result | assessment + findings | versioned assessment truth | `VerificationAssessment`、`VerificationFinding` | Step 7 integrity port；Step 9/10 |
| compatibility assessment | fixed manifest/schema refs + exact target + mapped result | immutable target-specific assessment + findings | immutable assessment | `CompatibilityAssessment`、`VerificationFinding` | Step 7 compatibility port |

### 8.2 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 不承接 / 禁止事项 |
|---|---|---|---|---|
| `ArchiveBundle` | Bundle identity/current revision/seal posture | aggregate | begin assembly、attach manifest、closure-ready、seal/block/fail | 不拥有 project lifecycle；storage object 不是 Bundle identity |
| `BundleManifest` | one immutable inventory revision | immutable entity/revision | freeze、lookup、fixed check | 不原地追加/修改；不定义 L1 schema |
| `ManifestEntry` | declared/actual member with provenance | value object | logical identity compare、binding membership | Artifact/ref/projection 不升格；declared 不伪造 locator |
| `ManifestClosure` | same-revision set closure | immutable assessment | record pure result、is complete | 不用 digest/signature/storage 代替 closure |
| `ClosureFinding` | one set difference | immutable history | record | 不自动回源 repair |
| `VerificationAssessment` | one integrity attempt on fixed input | entity | begin、start、settle conservatively | 不生成 digest/signature/key；不覆盖旧 revision |
| `CompatibilityAssessment` | target-specific support result | immutable assessment | assess、target match | 不自动 migrate；read 结果不复用 receiver |
| `VerificationFinding` | safe integrity/compatibility discrepancy | immutable history | record | 不保存 key/secret/raw capability response |

### 8.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 必需字段 | factory | 成员函数 | state / posture | 字段来源 |
|---|---|---|---|---|---|
| Bundle | id/request/current manifest/state/version | `draft` | `begin_assembly/attach_manifest/mark_closure_ready/seal/block/fail` | Bundle state | request + fixed manifest/guard refs + store version |
| Manifest | id/bundle/revision/declared/actual/closure/previous/time | `freeze` | `entry/is_fixed/bundle_revision_ref` | immutable | persisted CP2 inventory + pure closure |
| Entry | id/logical key/role/binding/class/locator/version/digest | `declare/from_material` | `same_identity/belongs_to` | immutable role | scope/owner inventory or approved material |
| Closure | posture/revision/findings | `from_evaluation` | `is_complete` | immutable posture | pure exact-set evaluation |
| Closure finding | id/revision/kind/key/entry/basis/time | `record` | accessors | immutable kind | pure difference + ID/clock |
| Verification | id/input/capability/evidence/posture/findings/version/time | `begin` | `mark_in_progress/settle/matches` | verification posture | fixed input + mapped capability result |
| Compatibility | id/revision/schema/target/capability/posture/findings/time | `assess` | `applies_to` | immutable posture | owner schema refs + mapped result |
| Verification finding | id/assessment/kind/subject/basis/time | `record` | accessors | immutable kind | mapped result + ID/clock |

### 8.4 CP3/CP4 supporting contract carriers

这些类型属于 `archive-contracts`，是 domain 与 application/port 之间的稳定 body-free carrier，不计入 26 个正式对象：

```rust
/// Distinguishes expected and observed manifest members.
pub enum ManifestEntryRole {
    /// Declares an expected member derived from the frozen scope and owner inventory.
    Declared,
    /// Records an approved material reference actually captured from an owner.
    Actual,
}

/// Carries the stable owner-defined identity used to compare manifest members.
pub struct ManifestMemberKeyRef(pub String);

/// Carries a mapped final integrity result without a provider payload.
pub enum MappedIntegrityResult {
    /// Carries formal evidence that verified the exact fixed input.
    Verified(IntegrityEvidence),
    /// Carries findings for a definite digest or signature failure.
    IntegrityFailed(VerificationFindingRefSet),
    /// Carries safe findings for an ambiguous capability outcome.
    Unknown(VerificationFindingRefSet),
    /// Carries a safe prerequisite blocker.
    Blocked(SafeReasonRef),
}

/// Carries a mapped target-specific compatibility result.
pub enum MappedCompatibilityResult {
    /// Carries the formal capability reference supporting the exact target.
    Supported(CompatibilityCapabilityRef),
    /// Carries findings proving lack of support.
    Unsupported(VerificationFindingRefSet),
    /// Carries findings for insufficient evidence.
    Unknown(VerificationFindingRefSet),
    /// Carries findings for conflicting declarations.
    Conflicting(VerificationFindingRefSet),
}
```

| carrier | 字段/载荷来源 | 约束 |
|---|---|---|
| `ManifestEntryRole` | scope/owner inventory vs approved captured material | immutable；Declared 不允许 material locator，Actual 必须有 locator |
| `ManifestMemberKeyRef` | owner-approved inventory identity 或 scope selector mapping | 非空 opaque；仅在同 binding/manifest 语境比较，不解析 owner schema |
| `MappedIntegrityResult` | Step 7 `IntegrityCapabilityPort` adapter mapping | Verified 必有 non-empty formal evidence；其他 branch 不得携带 synthetic success |
| `MappedCompatibilityResult` | Step 7 `CompatibilityCapabilityPort` mapping | target 已由 request 固定；非 Supported branch 至少一 finding |

所有带载荷 enum 的 Rustdoc 已说明载荷业务含义；它们的允许来源只包括正式 adapter mapping，允许去向是对应 assessment factory/transition，不直接进入 API。raw provider payload、algorithm、key、secret 和 external error detail 不进入这些 carrier。

### 8.5 `ArchiveBundle`（domain 正式对象 8/24）

```rust
/// Owns a stable Archive Bundle identity and the lifecycle of its current immutable manifest revision.
pub struct ArchiveBundle {
    /// Identifies the Bundle independently from any storage object.
    pub bundle_id: ArchiveBundleId,
    /// Points to the accepted archive request.
    pub archive_request_ref: ArchiveRequestRef,
    /// Points to the current immutable manifest revision when one is attached.
    pub current_manifest_ref: Option<BundleManifestRef>,
    /// Carries the Archive-owned Bundle state.
    pub bundle_state: ArchiveBundleState,
    /// Preserves safe assembly or seal blockers and definite failures.
    pub reason_history: Vec<BasisObservation<SafeReasonRef>>,
    /// Pins the current immutable revision for exact guard comparisons.
    pub current_revision: Option<ManifestRevisionId>,
    /// Pins the manifest present when the current assembly began.
    pub assembly_origin_ref: Option<BundleManifestRef>,
    /// Preserves the exact committed basis selected when sealing succeeded.
    pub seal_basis: Option<BundleSealBasis>,
    /// Carries the optimistic aggregate version.
    pub bundle_version: ArchiveBundleVersion,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| `bundle_id` | application ID source；一个 accepted archive request 的 current Bundle uniqueness 由 store/UoW 闭口 |
| `archive_request_ref` | 仅 Accepted `ArchiveRequest`；immutable |
| `current_manifest_ref` | Draft 可 None；attach 后 Some；只能指向本 Bundle 的 immutable manifest |
| `bundle_state` | Draft 初始；只按同 revision closure/seal guard 迁移 |
| `bundle_version` | factory/store；expected-version 由所有 mutation 检查 |
| `reason_history` | `Vec<BasisObservation<SafeReasonRef>>`；block/fail 追加，CAS 失败不得写入；无独立时间 |
| `current_revision` | `Option<ManifestRevisionId>`；draft None，attach 与 current_manifest_ref 同时更新 |
| `assembly_origin_ref` | `Option<BundleManifestRef>`；begin_assembly 复制当时 current ref，closure-ready 要求实际有新 manifest |
| `seal_basis` | `Option<BundleSealBasis>`；非 Sealed 为 None，seal 成功保存确切 basis；Sealed 必须 Some 且匹配 current revision |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn begin_assembly(&mut self, expected_version: ArchiveBundleVersion) -> DomainResult<BundleTransition>` | Draft/Blocked（新 revision 语境）→Assembling；Sealed 禁止 |
| `pub fn attach_manifest(&mut self, manifest: &BundleManifest, expected_version: ArchiveBundleVersion) -> DomainResult<BundleTransition>` | 绑定本 Bundle 的新 immutable revision；previous ref 必须与 current 对齐；保持 Assembling |
| `pub fn mark_closure_ready(&mut self, manifest: &BundleManifest, expected_version: ArchiveBundleVersion) -> DomainResult<BundleTransition>` | 仅 current manifest identity/revision + Complete closure，且 current 不等 assembly_origin →ClosureReady |
| `pub fn seal(&mut self, basis: &BundleSealBasis, manifest: &BundleManifest, verification: &VerificationAssessment, compatibility: &[CompatibilityAssessment], placement: &ArchivePlacement, expected_version: ArchiveBundleVersion) -> DomainResult<BundleTransition>` | 核对实际对象的 identity/revision、Complete closure、Verified、全部 required Supported 和 Committed placement →Sealed；提交及正式依据由 application 核验 |
| `pub fn block(&mut self, reason_ref: SafeReasonRef, expected_version: ArchiveBundleVersion) -> DomainResult<BundleTransition>` | Assembling/ClosureReady→Blocked；不删除 current revision |
| `pub fn fail(&mut self, reason_ref: SafeReasonRef, expected_version: ArchiveBundleVersion) -> DomainResult<BundleTransition>` | Assembling/ClosureReady + definite assembly/seal failure→Failed |

```rust
impl ArchiveBundle {
    /// Creates a draft Bundle for one accepted archive request.
    pub fn draft(
        bundle_id: ArchiveBundleId,
        archive_request_ref: ArchiveRequestRef,
        initial_version: ArchiveBundleVersion,
    ) -> DomainResult<Self>;
}
```

draft 初始化 reason_history 空、current_manifest_ref/current_revision/assembly_origin_ref/seal_basis=None。begin_assembly 保存当时 current_manifest_ref 到 assembly_origin_ref；attach_manifest 同时更新 current_manifest_ref/current_revision，校验 previous、manifest ID/revision 非当前值；mark_closure_ready 要求已实际 attach 新 manifest，不能用旧 closure 解阻。seal 成功必须保存传入 basis 到 seal_basis，后续不可覆盖；block/fail 追加 reason 与 expected version。closure/seal 以 current_revision 比较，不能从 opaque manifest ref 解析 revision。其他 mutation 保留原因历史；对象没有时间字段。`BundleTransition` 不生成时间/ID。Sealed 只表示 Archive 自有 fixed-input guard 通过，不表示项目 archived、治理批准、source truth 当前、未来可取回或恢复必成。storage location/object 不得替换 `bundle_id`。

### 8.6 `BundleManifest`（domain 正式对象 9/24）

```rust
/// Freezes one immutable manifest revision, its expected and observed entries, and its closure result.
pub struct BundleManifest {
    /// Identifies the manifest entity.
    pub manifest_id: BundleManifestId,
    /// Identifies the owning Bundle.
    pub bundle_id: ArchiveBundleId,
    /// Identifies this immutable revision.
    pub revision: ManifestRevisionId,
    /// Contains expected members derived from frozen scope and formal owner inventory.
    pub declared_entries: ManifestEntrySet,
    /// Contains approved material members actually captured.
    pub actual_entries: ManifestEntrySet,
    /// Carries closure for these exact entry sets.
    pub closure: ManifestClosure,
    /// Points to the previous immutable revision, if one exists.
    pub previous_revision_ref: Option<BundleManifestRef>,
    /// Records when Archive froze this revision.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| identity/bundle/revision | application ID/revision source + owning Bundle；revision 唯一且不等 optimistic version |
| declared entries | frozen scope expansion + owner inventory proof；全部 role=Declared；不可空仅当 scope itself would be invalid |
| actual entries | settled CP2 approved material refs；全部 role=Actual；空集合法但 closure 不得因此自动 Missing/Complete |
| closure | pure evaluator for same revision/exact sets；closure revision 必须一致 |
| previous ref | first revision None；后续必须指 current prior revision of same Bundle |
| recorded at | application clock；不代表 source capture time |

| 成员函数签名 | 作用 | 返回 / 不变量 |
|---|---|---|
| `pub fn entry(&self, entry_id: &ManifestEntryId) -> Option<&ManifestEntry>` | 在两集合按本地 ID 查找 | 同 ID 不得同时出现在两集合 |
| `pub fn member(&self, binding_ref: &SourceBindingRef, key: &ManifestMemberKeyRef, material_class: ArchiveMaterialClass, role: ManifestEntryRole) -> Option<&ManifestEntry>` | 按 binding/key/class/role 查找 | 完整命名空间相等；只在本 revision 比较 |
| `pub fn is_fixed(&self) -> bool` | 明确 immutable contract | 永远 true；无 append/update API |
| `pub fn bundle_revision_ref(&self) -> BundleRevisionRef` | 生成 fixed input ref | bundle id/ref 映射必须稳定 |

```rust
impl BundleManifest {
    /// Freezes an immutable revision after exact-set closure has been evaluated.
    pub fn freeze(
        manifest_id: BundleManifestId,
        bundle_id: ArchiveBundleId,
        revision: ManifestRevisionId,
        declared_entries: ManifestEntrySet,
        actual_entries: ManifestEntrySet,
        closure: ManifestClosure,
        closure_findings: &[ClosureFinding],
        previous_revision_ref: Option<BundleManifestRef>,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

factory 覆盖全部字段并校验 role、logical-key uniqueness 与 revision 一致性；以本次 exact sets 重新执行 evaluate，并以 closure_findings 重建 closure，要求姿态、revision、finding refs 全等。不能只凭相同 revision 接纳旧评价；closure_findings 只供校验，不重复持久化。binding/class 的 owner 语义由 application 读取 binding 按 §5.6 matrix 核验，不能从 opaque ref 推断。已固定 revision 没有 mutation；修正必须建立新 manifest/revision 并串联 previous ref。禁止定义或转换 L1 schema、隐式回源修复、或因 digest/storage success 改 closure。

### 8.7 `ManifestEntry`（domain 正式对象 10/24）

```rust
/// Represents one expected or observed manifest member while preserving source authority and material class.
pub struct ManifestEntry {
    /// Identifies the entry within Archive history.
    pub entry_id: ManifestEntryId,
    /// Carries the owner-defined stable comparison identity.
    pub member_key_ref: ManifestMemberKeyRef,
    /// Distinguishes expected and observed membership.
    pub role: ManifestEntryRole,
    /// Points to the exact source binding.
    pub source_binding_ref: SourceBindingRef,
    /// Preserves the approved material classification.
    pub material_class: ArchiveMaterialClass,
    /// Points to approved material only for an actual entry.
    pub locator_ref: Option<MaterialLocatorRef>,
    /// Carries the owner-specific source version when available.
    pub source_version_ref: Option<SourceVersionRef>,
    /// Points to a formal entry digest when supplied by an approved capability.
    pub entry_digest_ref: Option<DigestRef>,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| ID/key/role | application ID + frozen scope/owner inventory mapping；key 只在 binding/revision context 有意义 |
| source binding/class | CP2 Bound binding + source-authority matrix；class/material combination 必须合法 |
| locator | Declared 必须 None；Actual 必须 Some 且指 approved material，不是 storage commit proof |
| source version | owner result，可缺；不跨 owner 排序 |
| digest | owner/integrity capability 正式 ref，可缺；缺失不可私造；不含算法/key |

| 函数签名 | 作用 | 返回 / 不变量 |
|---|---|---|
| `pub fn same_identity(&self, other: &Self) -> bool` | 比较 binding + member key + material class | 不比较 entry ID/locator/digest；跨 binding false |
| `pub fn belongs_to(&self, binding_ref: &SourceBindingRef) -> bool` | 绑定检查 | typed equality |
| `pub fn is_actual(&self) -> bool` | role check | role=Actual iff locator Some |

```rust
impl ManifestEntry {
    /// Creates one expected member from a frozen declared scope or owner inventory.
    pub fn declare(
        entry_id: ManifestEntryId,
        member_key_ref: ManifestMemberKeyRef,
        source_binding_ref: SourceBindingRef,
        material_class: ArchiveMaterialClass,
        source_version_ref: Option<SourceVersionRef>,
    ) -> DomainResult<Self>;

    /// Creates one observed member from an approved captured material reference.
    pub fn from_material(
        entry_id: ManifestEntryId,
        member_key_ref: ManifestMemberKeyRef,
        source_binding_ref: SourceBindingRef,
        material_class: ArchiveMaterialClass,
        locator_ref: MaterialLocatorRef,
        source_version_ref: Option<SourceVersionRef>,
        entry_digest_ref: Option<DigestRef>,
    ) -> DomainResult<Self>;
}
```

两 factory 只校验 typed shape、role/locator 和必填性；application 必须先读取 Bound ArchiveSourceBinding，核对 approved owner inventory/material、source class、scope/version/fence，再传入 ref/class。factory 不从 binding_ref 推断 owner，Step 7/9 必须保留该 guard。两 factory 明确解决概要中“declared entry 尚无材料 locator”的槽位矛盾；这不改变对象语义。WorkspaceProjection 只能配 `WorkspaceProjection`，Artifact/Observability 同理；ref 不冒充正文、血缘或完整审计链。

### 8.8 `ManifestClosure`（domain 正式对象 11/24）

```rust
/// Records closure of expected and observed member sets for one immutable manifest revision.
pub struct ManifestClosure {
    /// Carries the conservative closure posture.
    pub posture: ManifestClosurePosture,
    /// Pins the immutable manifest revision.
    pub manifest_revision: ManifestRevisionId,
    /// Lists append-only findings explaining every non-complete result.
    pub finding_refs: ClosureFindingRefSet,
}
```

`ManifestClosure::evaluate(manifest_revision: ManifestRevisionId, declared_entries: &ManifestEntrySet, actual_entries: &ManifestEntrySet) -> DomainResult<ClosureEvaluation>` 是纯函数：按 `(source_binding_ref, member_key_ref, material_class)` 做稳定 exact-set comparison。下列三个 helper 归 `domain::closure`，`ManifestEntrySet` 归 `domain::manifest`；它们只供 domain/application 使用，contracts 不引用 ManifestEntry。

```rust
/// Contains immutable entries ordered by binding, member key, material class, and role.
pub struct ManifestEntrySet(pub Vec<ManifestEntry>);

/// Describes one deterministic set difference before a finding ID is assigned.
pub struct ClosureDifference {
    /// Classifies the difference without implying source-side data loss.
    pub kind: ClosureFindingKind,
    /// Pins the source binding namespace of the member key.
    pub source_binding_ref: SourceBindingRef,
    /// Pins the owner-defined member key within the binding.
    pub member_key_ref: ManifestMemberKeyRef,
    /// Preserves the material class used for exact comparison.
    pub material_class: ArchiveMaterialClass,
    /// Points to the actual entry when one exists.
    pub entry_ref: Option<ManifestEntryRef>,
    /// Carries a deterministic safe local comparison code.
    pub basis: ClosureFindingBasis,
}

/// Orders differences by binding, member, class, kind, and optional entry identity.
pub struct ClosureDifferenceSet(pub Vec<ClosureDifference>);

/// Holds the complete result of comparing one immutable manifest input.
pub struct ClosureEvaluation {
    /// Pins the evaluated revision.
    pub manifest_revision: ManifestRevisionId,
    /// Records the conservative aggregate classification.
    pub posture: ManifestClosurePosture,
    /// Preserves every difference even when one classification dominates.
    pub differences: ClosureDifferenceSet,
}
```

| helper | 工厂/成员完整签名 | 字段来源与不变量 |
|---|---|---|
| `ManifestEntrySet` | `pub fn try_from_iter(entries: impl IntoIterator<Item = ManifestEntry>) -> DomainResult<Self>`；`pub fn iter(&self) -> std::slice::Iter<'_, ManifestEntry>`；`pub fn len(&self) -> usize`；`pub fn is_empty(&self) -> bool` | exact role 集合；同 ID 或同 binding/key/class/role 重复拒绝；只存本仓 entry schema |
| `ClosureDifference` | `pub fn from_comparison(kind: ClosureFindingKind, source_binding_ref: SourceBindingRef, member_key_ref: ManifestMemberKeyRef, material_class: ArchiveMaterialClass, entry_ref: Option<ManifestEntryRef>, basis: ClosureFindingBasis) -> DomainResult<Self>` | pure comparison 提供全部字段；Missing 无 actual ref，Unexpected/Invalid 必有，Unknown 可无；无外部正文 |
| `ClosureDifferenceSet` | `pub fn try_from_iter(items: impl IntoIterator<Item = ClosureDifference>) -> DomainResult<Self>`；`pub fn iter(&self) -> std::slice::Iter<'_, ClosureDifference>`；`pub fn is_empty(&self) -> bool` | 上述五元 identity 唯一且稳定排序，保留所有差异 |
| `ClosureEvaluation` | 唯一生成入口为 `ManifestClosure::evaluate`；`pub fn differences(&self) -> &ClosureDifferenceSet`；`pub fn is_complete(&self) -> bool` | 空 difference 才 Complete；其余优先 Unknown→Invalid→Incomplete→Overfull，但不删除其他 finding |

application 为每个 difference 显式分配 finding ID/time，并以 `ClosureFinding::from_difference(finding_id: ClosureFindingId, manifest_revision: ManifestRevisionId, difference: &ClosureDifference, recorded_at: RecordedAt) -> DomainResult<Self>` 构造 finding。`ManifestClosure::from_evaluation(evaluation: &ClosureEvaluation, findings: &[ClosureFinding]) -> DomainResult<Self>` 验证 revision、所有 difference 字段及数量一一相等，随后派生 finding_refs；禁止由任意 posture + refs 伪构 Complete。comparison basis 使用本地固定非空 code `declared_member_absent / actual_member_undeclared / entry_shape_invalid / comparison_unproven`，只解释本地集合差异，不是 owner Missing 或完整性证据。

成员函数：`is_complete() -> bool`、`requires_blocking() -> bool`、`explains(&ClosureFindingRef) -> bool`。Complete 要求 finding set 为空；其他 posture 至少一 finding；revision 必须与 findings 一致。对象 immutable；禁止用 digest/signature/storage/verification 结果替代 exact-set closure，Unknown 不当 Complete。

### 8.9 `ClosureFinding`（domain 正式对象 12/24）

```rust
/// Preserves one append-only expected-versus-observed manifest difference.
pub struct ClosureFinding {
    /// Identifies the finding.
    pub finding_id: ClosureFindingId,
    /// Pins the immutable manifest revision.
    pub manifest_revision: ManifestRevisionId,
    /// Classifies the difference.
    pub kind: ClosureFindingKind,
    /// Carries the logical member identity involved in the difference.
    pub member_key_ref: ManifestMemberKeyRef,
    /// Pins the binding namespace of the compared member.
    pub source_binding_ref: SourceBindingRef,
    /// Preserves the compared material class.
    pub material_class: ArchiveMaterialClass,
    /// Points to a concrete entry when one exists.
    pub entry_ref: Option<ManifestEntryRef>,
    /// Carries a safe exact-set comparison basis.
    pub basis: ClosureFindingBasis,
    /// Records when Archive persisted the finding.
    pub recorded_at: RecordedAt,
}
```

唯一 factory 为上节 `from_difference`，复制 difference 全字段并接收 ID/revision/time；成员 `pub fn finding_ref(&self) -> ClosureFindingRef`、`pub fn matches(&self, revision: &ManifestRevisionId, difference: &ClosureDifference) -> bool`。Missing 可无 entry ref；Unexpected/Invalid 必须有；Unknown 依 comparison 输入决定 optional。无 mutation。禁止自行 capture 额外 source、修复 manifest 或保存材料正文；修正只能回到显式 capture/new revision。

### 8.10 `VerificationAssessment`（domain 正式对象 13/24）

```rust
/// Records one integrity assessment attempt bound to an exact immutable input.
pub struct VerificationAssessment {
    /// Identifies the assessment.
    pub assessment_id: VerificationAssessmentId,
    /// Pins every Bundle, manifest, and material input.
    pub input_binding: VerificationInputBinding,
    /// Points to the formal integrity capability when one was available.
    pub capability_ref: Option<IntegrityCapabilityRef>,
    /// Carries only safe formal evidence for a verified result.
    pub evidence: Option<IntegrityEvidence>,
    /// Carries the conservative assessment posture.
    pub posture: VerificationPosture,
    /// Lists findings for every non-verified terminal result.
    pub finding_refs: VerificationFindingRefSet,
    /// Carries a safe prerequisite or ambiguity basis when needed.
    pub basis_ref: Option<SafeReasonRef>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records when Archive last persisted this assessment observation.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| identity/input | application ID source + fixed `BundleRevisionRef/material refs`；input 永不改变 |
| capability | Step 7 integrity port binding；`begin` 必有，`blocked` 可 None |
| evidence | 仅 Verified 为 Some，且 capability/input 必须匹配；不含 algorithm/key/secret |
| posture/findings/basis | Pending/InProgress 无 terminal findings；Verified findings/basis 为空；IntegrityFailed/Unknown 至少一 finding；Blocked 至少 basis 或 finding |
| version/time | store expected version + application clock；不使用 provider time 代替 |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn mark_in_progress(&mut self, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<AssessmentTransition>` | Pending→InProgress；必须有 capability |
| `pub fn settle(&mut self, result: MappedIntegrityResult, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<AssessmentTransition>` | 仅 InProgress；按 mapped result 原子写 evidence/posture/findings/basis |
| `pub fn matches(&self, input_binding: &VerificationInputBinding) -> bool` | exact fixed-input equality；不只比较 Bundle ID |
| `pub fn is_verified(&self) -> bool` | posture check；不能由 evidence existence 单独推导 |

```rust
impl VerificationAssessment {
    /// Begins a pending assessment for one fixed input and formal capability.
    pub fn begin(
        assessment_id: VerificationAssessmentId,
        input_binding: VerificationInputBinding,
        capability_ref: IntegrityCapabilityRef,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;

    /// Records a fail-closed assessment when a required prerequisite is unavailable.
    pub fn blocked(
        assessment_id: VerificationAssessmentId,
        input_binding: VerificationInputBinding,
        capability_ref: Option<IntegrityCapabilityRef>,
        basis_ref: SafeReasonRef,
        finding_refs: VerificationFindingRefSet,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

终点绑定 exact input；重验、manifest/material 变化或新 capability 产生新 assessment ID，不从 terminal 状态原地回 Pending。`AR-UP-004` 未关闭时允许 Blocked/Unknown，禁止 fake/config 生成 Verified、digest、signature 或 key。

### 8.11 `CompatibilityAssessment`（domain 正式对象 14/24）

```rust
/// Records immutable target-specific compatibility for one manifest revision and schema set.
pub struct CompatibilityAssessment {
    /// Identifies the assessment.
    pub assessment_id: CompatibilityAssessmentId,
    /// Pins the immutable manifest revision.
    pub manifest_revision: ManifestRevisionId,
    /// Lists owner-issued schema and version references in stable order.
    pub schema_version_refs: SchemaVersionRefSet,
    /// Pins the exact reader, verifier, or restore receiver context.
    pub target_context: CompatibilityTargetContext,
    /// Points to the formal capability when one was available.
    pub capability_ref: Option<CompatibilityCapabilityRef>,
    /// Carries the conservative compatibility posture.
    pub posture: CompatibilityPosture,
    /// Lists findings for every non-supported result.
    pub finding_refs: VerificationFindingRefSet,
    /// Records when Archive persisted this observation.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/revision/schema refs | application ID + fixed manifest entries/owner schema refs；schema set 可空只会得到 Unknown，不得 Supported |
| target | caller use case；RestoreReceiver variant 固定 exact typed receiver |
| capability/result | Step 7 compatibility adapter mapped result；Supported 必有 capability、无 findings；其他 posture 至少 finding |
| time | application clock；不是 schema publication time |

唯一 factory：

```rust
impl CompatibilityAssessment {
    /// Creates an immutable assessment from one formally mapped target-specific result.
    pub fn assess(
        assessment_id: CompatibilityAssessmentId,
        manifest_revision: ManifestRevisionId,
        schema_version_refs: SchemaVersionRefSet,
        target_context: CompatibilityTargetContext,
        result: MappedCompatibilityResult,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

成员函数：`applies_to(&CompatibilityTargetContext) -> bool` 做 exact equality；`is_supported() -> bool`；`references_schema(&SchemaVersionRef) -> bool`。对象 immutable，无迁移。禁止自动 schema migration、猜 backward compatibility、把 Read/Verification 结果复用于 receiver，或让 Unsupported/Unknown/Conflicting 进入 restore material-ready。

### 8.12 `VerificationFinding`（domain 正式对象 15/24）

```rust
/// Preserves one safe append-only integrity or compatibility finding.
pub struct VerificationFinding {
    /// Identifies the finding.
    pub finding_id: VerificationFindingId,
    /// Identifies the exact owning assessment family and identity.
    pub assessment_ref: AssessmentRef,
    /// Classifies the finding.
    pub kind: VerificationFindingKind,
    /// Points to the affected input without exposing material or schema bodies.
    pub subject_ref: SafeVerificationSubjectRef,
    /// Points to formal capability evidence when available.
    pub basis_ref: Option<CapabilityEvidenceRef>,
    /// Records when Archive persisted the observation.
    pub recorded_at: RecordedAt,
}
```

唯一 factory：

```rust
impl VerificationFinding {
    /// Creates one immutable safe finding for an exact assessment.
    pub fn record(
        finding_id: VerificationFindingId,
        assessment_ref: AssessmentRef,
        kind: VerificationFindingKind,
        subject_ref: SafeVerificationSubjectRef,
        basis_ref: Option<CapabilityEvidenceRef>,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

`Mismatch/SignatureInvalid/KeyUnavailable/UnsupportedVersion/Conflicting` 必须有 capability evidence ref；`Unknown` 可无。成员只提供 `assessment_ref()`、`is_integrity_related()` 与 accessor，无 mutation。禁止保存 raw material、schema body、key、secret、algorithm parameters、provider response 或将 finding 当 source/business truth。

#### CP3/CP4 shared carrier 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `ManifestEntryRole` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Declared` | `Declares an expected member derived from the frozen scope and owner inventory.` | frozen scope/inventory 或 approved capture | immutable ManifestEntry；Declared 无 locator，Actual 有 locator |
| `Actual` | `Records an approved material reference actually captured from an owner.` | frozen scope/inventory 或 approved capture | immutable ManifestEntry；Declared 无 locator，Actual 有 locator |

##### `MappedIntegrityResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Verified(IntegrityEvidence)` | `Carries formal evidence that verified the exact fixed input.` | exact IntegrityCapabilityPort mapping | VerificationAssessment::settle；Verified 必有 exact input evidence |
| `IntegrityFailed(VerificationFindingRefSet)` | `Carries findings for a definite digest or signature failure.` | exact IntegrityCapabilityPort mapping | VerificationAssessment::settle；Verified 必有 exact input evidence |
| `Unknown(VerificationFindingRefSet)` | `Carries safe findings for an ambiguous capability outcome.` | exact IntegrityCapabilityPort mapping | VerificationAssessment::settle；Verified 必有 exact input evidence |
| `Blocked(SafeReasonRef)` | `Carries a safe prerequisite blocker.` | exact IntegrityCapabilityPort mapping | VerificationAssessment::settle；Verified 必有 exact input evidence；fail-closed |

##### `MappedCompatibilityResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Supported(CompatibilityCapabilityRef)` | `Carries the formal capability reference supporting the exact target.` | exact CompatibilityCapabilityPort mapping | CompatibilityAssessment::assess；非 Supported 保留 findings |
| `Unsupported(VerificationFindingRefSet)` | `Carries findings proving lack of support.` | exact CompatibilityCapabilityPort mapping | CompatibilityAssessment::assess；非 Supported 保留 findings |
| `Unknown(VerificationFindingRefSet)` | `Carries findings for insufficient evidence.` | exact CompatibilityCapabilityPort mapping | CompatibilityAssessment::assess；非 Supported 保留 findings |
| `Conflicting(VerificationFindingRefSet)` | `Carries findings for conflicting declarations.` | exact CompatibilityCapabilityPort mapping | CompatibilityAssessment::assess；非 Supported 保留 findings |


### 8.13 CP3～CP4 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 承接 | pass | Bundle/revision/inventory/closure/integrity/compatibility/findings 全有唯一对象 |
| 正式对象计数 | pass | 8/8：CP3 5 + CP4 3；累计 domain 15/24 |
| fixed input | pass | manifest、closure、verification、compatibility 均绑定 exact immutable revision/context |
| 字段来源 | pass_at_step_6 | ID/time/version 外置；Declared entry 不伪造 locator；Blocked assessment 不伪造 capability |
| 状态传播 | pass | Complete≠Verified，Verified≠Committed，Sealed≠project archived，Supported target 不跨用例复用 |
| external authority | pass_with_blockers | digest/signature/key/schema 只保存正式 ref/evidence；`AR-UP-004/006/009` 保持开放 |
| 后续承接 | pass | Step 7 capability outcomes；Step 9 factory/transition sequencing；Step 10/11 状态与 persistence；Step 16 pure-set tests |

## 9. `domain` CP5～CP6 对象实现契约（9/24）

### 9.1 CP5～CP6 capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| placement/retrieval | fixed Bundle revision + persisted intent + mapped storage feedback | placement/retrieval independent axes | external effect intent/result | `ArchivePlacement`、`ExternalActionRecord` | Step 7 storage port；Step 9/11/13 |
| decision-bound lifecycle | formal decision ref + applicability proof + action + feedback/probe | execution/action history | external effect, fail-closed | `LifecycleExecution`、`ExternalActionRecord` | Step 7 governance/storage ports |
| restore admission | fixed Bundle + explicit owner set + formal authority + key/digest | immutable restore request | local request truth | `RestoreRequest` | Step 9/11/13 |
| immutable per-owner plan | accepted request + fixed revision + eligible item set | plan/item posture | local plan/item truth | `RestorePlan`、`RestoreItem` | Step 7 receiver/source/capability ports |
| receiver handoff | fixed item/material/receiver + intent + mapped outcome | handoff/outcome | owner-specific external effect | `RestoreHandoff`、`HandoffOutcome` | Step 7 receiver port；Step 9/13 |
| authorized compensation | ambiguous/failed handoff + formal authority/action | compensation posture | external effect | `CompensationRecord` | Step 7 receiver port；Step 12/13 |

### 9.2 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 不承接 / 禁止事项 |
|---|---|---|---|---|
| `ArchivePlacement` | fixed revision placement/retrieval truth | entity | record action, apply commit/retrieval feedback, probe result | 不拥有 provider/location truth；commit 不推导 retrievable |
| `LifecycleExecution` | formal-decision-bound effect coordination | entity/execution record | eligible、record intent、apply/probe/block/compensate | 不决定期限、hold/delete/risk；ACK 不等 commit |
| `ExternalActionRecord` | one external effect intent/outcome | effect history entity | intent、dispatch、settle/reconcile | 不复用 key/input；不包含 retry config |
| `RestoreRequest` | restore admission truth | aggregate / immutable admission | digest match、target check、operation ref | 不是跨域写权 |
| `RestorePlan` | fixed revision + per-owner aggregate | aggregate / immutable input revision | freeze items、recompute、supersede | 不建立跨 owner transaction；complete 不等 restored |
| `RestoreItem` | one owner/slice material/handoff posture | entity | material/receiver binding、handoff/outcome/compensation | owner 间不传播；unsafe input 不 MaterialReady |
| `RestoreHandoff` | one receiver effect | external-effect entity | intent、dispatch、outcome、reconcile | 不直写 owner DB；timeout 不等 failure/success |
| `HandoffOutcome` | one receiver observation | immutable feedback record | observe | 不代表 owner current truth，不覆盖历史 |
| `CompensationRecord` | one authorized response effect | external-effect history entity | plan、start、settle/reconcile | 不自动决定反向写；不抹除原 handoff |

### 9.3 CP5/CP6 supporting contract carriers

```rust
/// Carries a formal owner capability proof for one lifecycle action and target.
pub struct GovernanceApplicabilityProof {
    /// Identifies the exact decision version used.
    pub decision_ref: GovernanceDecisionRef,
    /// Pins the Bundle revision being evaluated.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Pins the only action proven applicable.
    pub action_kind: LifecycleActionKind,
    /// Points to the formal applicability evidence.
    pub evidence_ref: ExternalEvidenceRef,
}

/// Preserves the formal decision observation that blocked a lifecycle execution.
pub struct LifecycleBlockBasis {
    /// Pins the current formal decision without replacing the execution's original basis.
    pub current_decision: GovernanceDecisionRef,
    /// Carries the safe applicability or hold-conflict reason.
    pub reason_ref: SafeReasonRef,
}

/// Carries a mapped placement commit outcome without a provider payload.
pub enum MappedStorageCommitResult {
    /// Records receipt acknowledgement without proving commit.
    Acknowledged(ExternalFeedbackRef),
    /// Carries formal location, tier, commit, and feedback references.
    Committed(StorageCommitEvidence),
    /// Records an ambiguous effect that requires a formal probe.
    CommitUnknown(CommitUnknownBasis),
    /// Records a definite provider failure.
    Failed(SafeReasonRef),
    /// Records a missing authority or capability prerequisite.
    Blocked(SafeReasonRef),
}

/// Carries the formal references needed to prove one storage commit.
pub struct StorageCommitEvidence {
    /// Points to the committed storage location.
    pub location_ref: StorageLocationRef,
    /// Points to the committed provider-neutral tier.
    pub tier_ref: StorageTierRef,
    /// Points to the formal external commit.
    pub commit_ref: ExternalCommitRef,
    /// Points to the mapped feedback observation.
    pub feedback_ref: ExternalFeedbackRef,
}

/// Carries a mapped retrievability result for one fixed Bundle revision.
pub enum MappedRetrievalResult {
    /// Carries formal evidence that the revision is retrievable.
    Retrievable(ExternalEvidenceRef),
    /// Carries formal evidence that the revision is currently unavailable.
    Unavailable(ExternalEvidenceRef),
    /// Carries a definite retrieval failure.
    Failed(SafeReasonRef),
    /// Preserves an ambiguous or unsupported retrieval result.
    Unknown(SafeReasonRef),
}

/// Carries a mapped receiver observation without a receiver payload.
pub struct MappedReceiverFeedback {
    /// Carries the conservative receiver outcome.
    pub posture: ReceiverOutcomePosture,
    /// Points to the formal receiver commit when one was proved.
    pub receiver_commit_ref: Option<ReceiverCommitRef>,
    /// Points to the mapped external feedback.
    pub feedback_ref: ExternalFeedbackRef,
}

/// Carries one conservatively mapped restore compensation result.
pub enum MappedCompensationResult {
    /// Carries formal feedback that the exact compensation completed.
    Completed(ExternalFeedbackRef),
    /// Carries a safe definite compensation failure basis.
    Failed(SafeReasonRef),
    /// Carries an ambiguous result that requires a formal probe.
    CommitUnknown(CommitUnknownBasis),
    /// Carries an unavailable authority, receiver, or safety prerequisite.
    Blocked(SafeReasonRef),
}
```

| carrier | 来源与约束 | 禁止事项 |
|---|---|---|
| `GovernanceApplicabilityProof` | `GovernanceDecisionPort` 针对 exact decision/version/target/action 的正式结果 | Archive 不自评 scope/hold/policy；任一字段变化 proof 失配 |
| `LifecycleBlockBasis` | `pub fn record(current_decision: GovernanceDecisionRef, reason_ref: SafeReasonRef) -> Self`；`pub fn decision(&self) -> &GovernanceDecisionRef` | 只保存正式 owner 观察，不能由 reason 生成 decision；内嵌 lifecycle block_history |
| `MappedStorageCommitResult` | storage adapter mapped response/probe | ACK 无 commit；Unknown 不携带 synthetic location；Failed 需 definite basis |
| `StorageCommitEvidence` | formal storage capability commit | 四 ref 均必填且 exact action/input 匹配；不含 provider body/secret |
| `MappedRetrievalResult` | storage retrieval/probe adapter | placement commit 不构造 Retrievable；Unknown 保守保留 |
| `MappedReceiverFeedback` | owner receiver adapter | Succeeded 必须有 commit ref；Acknowledged/Rejected/Failed/Conflicting/CommitUnknown 不得有伪 commit |
| `MappedCompensationResult` | exact owner receiver compensation adapter/probe | Completed 只带 formal feedback ref；Unknown/Blocked/Failed 不得携带 synthetic completion |

这些带载荷 enum 的允许来源均为 Step 7 adapter port，允许去向为对应 domain transition；不能由 API/worker/provider raw response直接构造。`StorageIntent` 是 non-empty opaque stable intent ref/value，由 application 在持久化前建立；provider 请求 schema 由 Step 7/14 闭口。

```rust
/// Records the final admission basis for a restore request.
pub enum RestoreAdmissionBasis {
    /// Carries the formal authority for an accepted restore request.
    Accepted(RestoreAuthorityRef),
    /// Carries a safe definite rejection basis.
    Rejected(SafeReasonRef),
    /// Carries a safe unavailable or conflicting prerequisite basis.
    Blocked(RequestBlockBasis),
}

/// Carries the fixed safety evidence used to prepare one owner-specific material reference.
pub struct RestoreEligibilityBasis {
    /// Pins the Bundle revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Pins the only owner allowed to receive this material.
    pub target_owner_ref: RestoreOwnerRef,
    /// Pins the formally bound receiver for the target owner.
    pub receiver_ref: RestoreReceiverRef,
    /// Pins the exact approved entries assigned to this item.
    pub source_entry_refs: ManifestEntryRefSet,
    /// Pins the owner-approved minimal material covered by the evidence.
    pub material_ref: RestoreMaterialRef,
    /// Points to verified integrity for the same input.
    pub verification_ref: VerificationAssessmentRef,
    /// Points to compatibility support for the exact receiver.
    pub compatibility_ref: CompatibilityAssessmentRef,
    /// Points to formal retrievability evidence.
    pub retrieval_evidence_ref: ExternalEvidenceRef,
    /// Points to the restore authority.
    pub authority_ref: RestoreAuthorityRef,
}

/// Carries one restore item's committed posture for exact plan aggregation.
pub struct RestoreItemPosture {
    /// Identifies the exact restore item.
    pub item_ref: RestoreItemRef,
    /// Identifies the single target owner.
    pub target_owner_ref: RestoreOwnerRef,
    /// Carries the current Archive-owned item state.
    pub item_state: RestoreItemState,
    /// Points to the latest handoff when one exists.
    pub latest_handoff_ref: Option<RestoreHandoffRef>,
    /// Points to the latest outcome observation when one exists.
    pub latest_outcome_ref: Option<HandoffOutcomeRef>,
    /// Points to the latest compensation when one exists.
    pub latest_compensation_ref: Option<CompensationRecordRef>,
}
```

`RestoreAdmissionBasis` 三个 variant 与 Request admission 同样 immutable，`admission() -> RequestAdmissionState` 派生状态；Accepted 载荷刻意为 `RestoreAuthorityRef`。`RestoreEligibilityBasis` 九字段来自已读 fixed manifest、same-input Verified assessment、exact receiver Supported assessment、正式 retrieval/source/receiver/authority mapping；任何 missing/stale/conflicting/unsupported/integrity-failed/unknown 都不能构造。

| helper | 完整 factory / 成员签名 | 校验责任 |
|---|---|---|
| `RestoreEligibilityBasis` | `pub fn bind(bundle_revision_ref: BundleRevisionRef, target_owner_ref: RestoreOwnerRef, receiver_ref: RestoreReceiverRef, source_entry_refs: ManifestEntryRefSet, material_ref: RestoreMaterialRef, verification_ref: VerificationAssessmentRef, compatibility_ref: CompatibilityAssessmentRef, retrieval_evidence_ref: ExternalEvidenceRef, authority_ref: RestoreAuthorityRef) -> ContractResult<Self>`；`pub fn matches(&self, revision: &BundleRevisionRef, owner: &RestoreOwnerRef, receiver: &RestoreReceiverRef, entries: &ManifestEntryRefSet, material: &RestoreMaterialRef) -> bool` | contracts 只做非空/结构一致性；application 从正式 port/store 校验 semantic basis，domain bind_material 比较所有固定输入，不从 opaque ref 推断成功 |
| `RestoreItemPosture` | `pub fn assemble(item_ref: RestoreItemRef, target_owner_ref: RestoreOwnerRef, item_state: RestoreItemState, latest_handoff_ref: Option<RestoreHandoffRef>, latest_outcome_ref: Option<HandoffOutcomeRef>, latest_compensation_ref: Option<CompensationRecordRef>) -> ContractResult<Self>`；`pub fn matches_item(&self, item_ref: &RestoreItemRef) -> bool` | application 从已提交 item/related records 构造并校验关联；contracts 不接收 domain Item，避免反向依赖；只供保守聚合 |

#### 外部动作种类、反馈与历史的精确载体

这些 contracts carriers 不计入 26 对象；其字段是 required port 的本地需求，外部合同仍由原 blocker 阻断。

```rust
/// Pins the effect kind independently from its aggregate target.
pub enum ExternalActionOperation {
    /// Places a fixed Bundle revision.
    Place,
    /// Requests retrieval of a fixed Bundle revision.
    Retrieve,
    /// Executes the exact formally authorized lifecycle action.
    Lifecycle(LifecycleActionKind),
}

/// Proves one exact lifecycle effect without inventing placement location evidence.
pub struct LifecycleCommitEvidence {
    /// Pins the affected execution.
    pub execution_ref: LifecycleExecutionRef,
    /// Pins the authorized action kind.
    pub action_kind: LifecycleActionKind,
    /// Points to formal effect commit evidence.
    pub commit_ref: ExternalCommitRef,
    /// Points to formal feedback for that effect.
    pub feedback_ref: ExternalFeedbackRef,
}

/// Carries one formally mapped lifecycle result.
pub enum MappedLifecycleResult {
    /// Carries receipt acknowledgement without commit proof.
    Acknowledged(ExternalFeedbackRef),
    /// Carries proof of the exact lifecycle effect.
    Committed(LifecycleCommitEvidence),
    /// Preserves an uncertain external commit.
    CommitUnknown(CommitUnknownBasis),
    /// Carries a definite effect failure.
    Failed(SafeReasonRef),
    /// Carries an unavailable safety prerequisite.
    Blocked(SafeReasonRef),
}

```

取回使用独立 effect carrier，避免 location、lifecycle execution 与 retrieval 三者互造证明：

```rust
/// Carries a retrieval-request effect outcome without lifecycle or placement evidence.
pub enum RetrievalEffectResult {
    /// Carries receipt acknowledgement without effect completion.
    Acknowledged(ExternalFeedbackRef),
    /// Carries a formal retrieval-request commit and its feedback.
    Committed { commit_ref: ExternalCommitRef, feedback_ref: ExternalFeedbackRef },
    /// Preserves an uncertain retrieval-request effect.
    CommitUnknown(CommitUnknownBasis),
    /// Carries a definite retrieval-request failure.
    Failed(SafeReasonRef),
    /// Carries an unavailable retrieval prerequisite.
    Blocked(SafeReasonRef),
}

/// Preserves the effect-family discriminator on every mapped observation.
pub enum MappedExternalActionResult {
    /// Carries a placement-specific outcome and optional location evidence.
    Placement(MappedStorageCommitResult),
    /// Carries independent retrieval effect and material availability outcomes.
    Retrieval { effect: RetrievalEffectResult, retrieval: Option<MappedRetrievalResult> },
    /// Carries a lifecycle-specific outcome and action commit proof.
    Lifecycle(MappedLifecycleResult),
}

/// Correlates a mapped observation to exactly one persisted external intent.
pub struct ExternalActionObservation {
    /// Pins the local effect record.
    pub action_ref: ExternalActionRecordRef,
    /// Pins the owning placement or lifecycle execution.
    pub target_ref: ExternalActionTargetRef,
    /// Pins the immutable Bundle revision observed by the external capability.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Pins the operation kind.
    pub operation: ExternalActionOperation,
    /// Pins the externally scoped key.
    pub idempotency_key: ExternalIdempotencyKey,
    /// Pins the immutable effect input.
    pub input_digest: SafeInputDigest,
    /// Preserves all safe mapped outcome fields.
    pub result: MappedExternalActionResult,
}
```

`ExternalActionOperation` 来源=持久 intent；Place/Retrieve 只配 Placement target，Lifecycle(kind) 只配 Lifecycle target。`MappedExternalActionResult` 三 variant 来源=对应正式 adapter/probe，去向=ExternalActionRecord::settle，分支与 operation 一一匹配。`MappedLifecycleResult` 和 `RetrievalEffectResult` 每个 variant 的 Rustdoc 见代码；Acknowledged→保留待决、Committed→只有正式 commit 才确认、CommitUnknown→probe、Failed→确定失败、Blocked→阻止新派发且保留已有 effect 姿态。删除/保留/迁层不得要求伪造 location/tier；retrieval commit 不推导 Retrievable，反之亦然。

`LifecycleCommitEvidence::bind(execution_ref: LifecycleExecutionRef, action_kind: LifecycleActionKind, commit_ref: ExternalCommitRef, feedback_ref: ExternalFeedbackRef) -> ContractResult<Self>` 覆盖全部字段，只从正式 action mapping 构造；`matches(&self, execution: &LifecycleExecutionRef, kind: LifecycleActionKind) -> bool` 纯比较。`ExternalActionObservation::bind(action_ref: ExternalActionRecordRef, target_ref: ExternalActionTargetRef, bundle_revision_ref: BundleRevisionRef, operation: ExternalActionOperation, idempotency_key: ExternalIdempotencyKey, input_digest: SafeInputDigest, result: MappedExternalActionResult) -> ContractResult<Self>` 校验 family；`matches(&self, action_ref: &ExternalActionRecordRef, target_ref: &ExternalActionTargetRef, revision: &BundleRevisionRef, operation: &ExternalActionOperation, key: &ExternalIdempotencyKey, digest: &SafeInputDigest) -> bool` 全字段比较。观察无独立 ID，不是新 truth；动作对象以内嵌历史保存，缺任一关联字段拒绝 settlement。

#### `GovernanceApplicabilityProof` 构造补全

`pub fn bind(decision_ref: GovernanceDecisionRef, bundle_revision_ref: BundleRevisionRef, action_kind: LifecycleActionKind, evidence_ref: ExternalEvidenceRef) -> ContractResult<Self>`；`pub fn matches(&self, decision: &GovernanceDecisionRef, revision: &BundleRevisionRef, action: LifecycleActionKind) -> bool`。四字段来自正式 governance capability；只做 identity/version/action equality，不自行解释 hold/期限/授权。其余只提供同名只读字段 accessor。

#### `StorageCommitEvidence` 构造补全

`pub fn bind(location_ref: StorageLocationRef, tier_ref: StorageTierRef, commit_ref: ExternalCommitRef, feedback_ref: ExternalFeedbackRef) -> ContractResult<Self>`。四 ref 来源为同次已认证 storage commit；exact action/revision/key/input 由 ExternalActionObservation 封装校验，不从 location 推断。其余只提供同名只读字段 accessor。

#### `MappedReceiverFeedback` 构造补全

`pub fn from_mapping(posture: ReceiverOutcomePosture, receiver_commit_ref: Option<ReceiverCommitRef>, feedback_ref: ExternalFeedbackRef) -> ContractResult<Self>`；`pub fn has_commit(&self) -> bool`。Succeeded 当且仅当 commit ref Some；其他 variant 为 None。对已有 commit 的矛盾通过新 Conflicting observation + 原 outcome 保存，不复制或删掉旧证据。其余只提供同名只读字段 accessor。

### 9.4 `ArchivePlacement`（domain 正式对象 16/24）

```rust
/// Records placement and retrieval as independent axes for one fixed Bundle revision.
pub struct ArchivePlacement {
    /// Identifies the Archive-owned placement.
    pub placement_id: ArchivePlacementId,
    /// Pins the Bundle revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Carries the stable provider-neutral placement intent.
    pub storage_intent: StorageIntent,
    /// Points to a committed external location when formally known.
    pub location_ref: Option<StorageLocationRef>,
    /// Points to a committed external tier when formally known.
    pub tier_ref: Option<StorageTierRef>,
    /// Records placement effect progress.
    pub placement_state: PlacementState,
    /// Records retrievability independently.
    pub retrieval_state: RetrievalState,
    /// Points to the latest correlated external action.
    pub latest_action_ref: Option<ExternalActionRecordRef>,
    /// Points to retrieval intent independently from placement intent.
    pub latest_retrieval_action_ref: Option<ExternalActionRecordRef>,
    /// Preserves mapped placement outcomes at their loaded version.
    pub placement_history: Vec<BasisObservation<MappedStorageCommitResult>>,
    /// Preserves retrieval evidence and failure bases independently.
    pub retrieval_history: Vec<BasisObservation<MappedRetrievalResult>>,
    /// Points to a formal storage commit only when committed.
    pub external_commit_ref: Option<ExternalCommitRef>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/revision/intent | placement service ID source + fixed Bundle revision + stable intent；immutable |
| location/tier/commit | initial None；仅 `StorageCommitEvidence` 可一起写入；后续矛盾保留旧值与全部 history，不用 None 覆盖已知证据 |
| state axes | placement initial IntentRecorded；retrieval initial NotRequested（若本地 intent history完整）或 Unknown（重建缺证据） |
| action/version/time | action must target this placement/input；store expected version + application clock |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn attach_action(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<PlacementTransition>` | 绑定 target=self、intent digest 匹配的 action；IntentRecorded→Dispatched 由 action dispatch 后触发 |
| `pub fn settle_placement(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<PlacementTransition>` | 保守映射 ack/commit/unknown/failure/block；仅 commit evidence 写 location/tier/commit |
| `pub fn request_retrieval(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<RetrievalTransition>` | NotRequested/Unknown→Requested；action target/input 匹配 |
| `pub fn settle_retrieval(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<RetrievalTransition>` | Requested→Retrievable/Unavailable/Failed/Unknown |
| `pub fn requires_probe(&self) -> bool` | placement=CommitUnknown；bool；不自动 probe/retry |

```rust
impl ArchivePlacement {
    /// Persists a provider-neutral placement intent before external dispatch.
    pub fn intend(
        placement_id: ArchivePlacementId,
        bundle_revision_ref: BundleRevisionRef,
        storage_intent: StorageIntent,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

intend 初始化两个 action ref 为 None、两个 history 为空，retrieval=NotRequested；rehydrate 仅复制真实持久状态，缺记录不私造重建成功。attach_action 只接受 Place，request_retrieval 只接受 Retrieve，分别保存引用。settle 两方法读取 action 最新已提交 observation，要求 target=self、固定 revision 相同、operation 与对应 action ref 匹配；把对应 mapped result 追加本对象 history。只有 placement Committed 同时写 location/tier/commit；ACK 保持 Dispatched，Blocked 保存依据，已存在不确定 effect 时仍保留 CommitUnknown。retrieval 只改 retrieval 轴，缺 availability observation 不猜 Retrievable。所有有效 mutation 更新显式 recorded_at。

禁止 timeout 后盲重试、伪造 location/tier/digest/commit、用 provider storage object 作为 Bundle identity、或从 Committed 推导 Retrievable。

### 9.5 `LifecycleExecution`（domain 正式对象 17/24）

```rust
/// Coordinates one formally authorized lifecycle effect without owning governance decisions.
pub struct LifecycleExecution {
    /// Identifies the execution.
    pub execution_id: LifecycleExecutionId,
    /// Pins the Bundle revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Binds the exact formal governance decision version.
    pub decision_ref: GovernanceDecisionRef,
    /// Identifies the only action proven applicable.
    pub action_kind: LifecycleActionKind,
    /// Points to formal applicability evidence.
    pub applicability_evidence_ref: ExternalEvidenceRef,
    /// Records execution progress.
    pub execution_state: LifecycleExecutionState,
    /// Lists all correlated external actions in stable order.
    pub external_action_refs: ExternalActionRecordRefSet,
    /// Preserves formal blocking decisions with safe reasons.
    pub block_history: Vec<BasisObservation<LifecycleBlockBasis>>,
    /// Pins formal lifecycle compensation completion when observed.
    pub compensation_evidence_ref: Option<LifecycleCompensationEvidenceRef>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/target | lifecycle service ID + fixed Bundle revision |
| decision/action/evidence | exact `GovernanceApplicabilityProof`；four-way match required；immutable for this execution |
| state/actions | Eligible initial + empty actions；intent append before dispatch；refs unique/stable |
| version/time | store expected version + application clock |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn record_intent(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<LifecycleTransition>` | Eligible→IntentRecorded；action target=self，首个/新 approved attempt append-only |
| `pub fn mark_dispatched(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<LifecycleTransition>` | IntentRecorded→Dispatched；必须已关联且 target/revision/action kind 一致、action.posture=Dispatched |
| `pub fn apply_feedback(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<LifecycleTransition>` | 从 exact action posture 映射 Acknowledged/Committed/CommitUnknown/Failed |
| `pub fn reconcile(&mut self, action: &ExternalActionRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<LifecycleTransition>` | 仅 CommitUnknown + probed action；结果仍可 Unknown |
| `pub fn block(&mut self, current_decision: &GovernanceDecisionRef, reason_ref: SafeReasonRef, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<LifecycleTransition>` | 新 hold/conflict/expiry 使未确定 commit 的状态→Blocked；不抹除已发生效果 |
| `pub fn mark_compensated(&mut self, evidence_ref: &LifecycleCompensationEvidenceRef, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<LifecycleTransition>` | Failed/Blocked 经针对本 execution 的正式 compensation completion proof→Compensated；原 actions 保留 |

```rust
impl LifecycleExecution {
    /// Creates an eligible execution only from an exact formal applicability proof.
    pub fn eligible(
        execution_id: LifecycleExecutionId,
        proof: GovernanceApplicabilityProof,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

eligible 初始化 block_history 为空、compensation_evidence_ref=None。block 将 current_decision + reason_ref 构成 LifecycleBlockBasis 后追加，原 decision_ref/action 保持不可变；mark_compensated 保存证据。apply/reconcile 要求 action.target=self、operation=Lifecycle(self.action_kind)、bundle revision 相同，保留全部 action refs；Blocked 不擦除 action 的 CommitUnknown/Committed。每次 mutation 显式更新时间。

`LifecycleCompensationEvidenceRef` 必须由 governance/storage 的正式补偿接缝证明 exact execution/action 已完成；它不是 CP6 `CompensationRecordRef`，也不创建新的 Restore compensation truth。Archive 不提供默认 retention、期限计算、hold release、删除批准或 risk acceptance；`RiskAccept` 不绕过 integrity/receiver/commit 红线。Acknowledged 不等 Committed；CommitUnknown 只能 probe/review，不回 Dispatched 盲重放。

### 9.6 `ExternalActionRecord`（domain 正式对象 18/24）

```rust
/// Records one stable external effect intent and its latest conservatively mapped posture.
pub struct ExternalActionRecord {
    /// Identifies the action.
    pub action_id: ExternalActionId,
    /// Identifies the exact placement or lifecycle target.
    pub target_ref: ExternalActionTargetRef,
    /// Pins the immutable Bundle revision affected by the action.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Pins the operation and stable provider-neutral request material.
    pub operation: ExternalActionOperation,
    /// Points to the persisted effect input without embedding provider schema.
    pub intent: StorageIntent,
    /// Carries the external capability idempotency key.
    pub idempotency_key: ExternalIdempotencyKey,
    /// Detects reuse of the key with different effect input.
    pub intent_digest: SafeInputDigest,
    /// Carries a positive attempt ordinal scoped to the target and intent.
    pub attempt_no: ExternalAttemptNumber,
    /// Records the conservative effect posture.
    pub posture: ExternalActionPosture,
    /// Points to the latest mapped feedback observation.
    pub feedback_ref: Option<ExternalFeedbackRef>,
    /// Preserves every mapped observation, including blockers and conflicts.
    pub observations: Vec<BasisObservation<ExternalActionObservation>>,
    /// Preserves locally observed ambiguity without inventing provider feedback.
    pub reconcile_history: Vec<BasisObservation<CommitUnknownBasis>>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn matches(&self, target_ref: &ExternalActionTargetRef, intent_digest: &SafeInputDigest) -> bool` | key replay exact input check；不只比较 key |
| `pub fn mark_dispatched(&mut self, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ActionTransition>` | IntentRecorded→Dispatched |
| `pub fn settle(&mut self, observation: ExternalActionObservation, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ActionTransition>` | Dispatched/CommitUnknown→Ack/Committed/Unknown/Failed；Blocked 由 owning aggregate 保存 |
| `pub fn require_reconcile(&mut self, basis: CommitUnknownBasis, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ActionTransition>` | ambiguous result→CommitUnknown；basis 追加 reconcile_history，不保存 raw timeout |

```rust
impl ExternalActionRecord {
    /// Persists one immutable effect identity and input before external dispatch.
    pub fn record_intent(
        action_id: ExternalActionId,
        target_ref: ExternalActionTargetRef,
        bundle_revision_ref: BundleRevisionRef,
        operation: ExternalActionOperation,
        intent: StorageIntent,
        idempotency_key: ExternalIdempotencyKey,
        intent_digest: SafeInputDigest,
        attempt_no: ExternalAttemptNumber,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

identity/target/revision/operation/intent/key/digest/attempt immutable；factory 初始化两历史为空、feedback=None、posture=IntentRecorded。settle 先检查 observation.matches 全部关联，再原子追加 observation、映射 posture/feedback；允许 Dispatched/Acknowledged/CommitUnknown 接收后续明确反馈。Blocked 仍存 observation，保持已有 effect posture 并由 aggregate 阻止派发；不增造 action Blocked 状态。terminal 冲突观察仍追加并进入 CommitUnknown，旧 commit evidence 不删除，必须 probe。require_reconcile 追加本地 basis。每次 mutation 更新 recorded_at；所有观察与 action 同对象 CAS 保存。

`pub fn latest_observation(&self) -> Option<&ExternalActionObservation>` 返回最后 observation，`pub fn has_unresolved_effect(&self) -> bool` 对 Dispatched/Acknowledged/CommitUnknown 为 true。不同 target/operation/input 不得复用 key；retry/batch/time 数值不进入对象；ACK/transport success 不升格 commit。

### 9.7 `RestoreRequest`（domain 正式对象 19/24）

```rust
/// Stores one immutable restore admission result without granting cross-domain write authority.
pub struct RestoreRequest {
    /// Identifies the restore request.
    pub request_id: RestoreRequestId,
    /// Points to the Bundle requested for restoration.
    pub bundle_ref: ArchiveBundleRef,
    /// Lists explicit target owners without an implicit all-owners value.
    pub target_owners: RestoreTargetOwnerSet,
    /// Identifies the requesting principal without copying identity truth.
    pub requested_by: archive_contracts::context::core_shared::actor::ActorRef,
    /// Carries outcome-specific authority or safe failure basis.
    pub admission_basis: RestoreAdmissionBasis,
    /// Carries the caller-scoped idempotency key.
    pub idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
    /// Detects reuse of the key with different canonical input.
    pub input_digest: SafeInputDigest,
    /// Records when Archive committed this admission observation.
    pub recorded_at: RecordedAt,
}
```

字段来源与 `ArchiveRequest` 同口径；`target_owners` 必须非空、typed unique，且每个 owner 都能映射 source-authority matrix；Accepted 必有 `RestoreAuthorityRef`，Rejected/Blocked 不伪造 authority。

| 成员函数签名 | 作用 | 不变量 |
|---|---|---|
| `pub fn admission(&self) -> RequestAdmissionState` | 从 basis 派生 final state | 无第二份漂移 state |
| `pub fn matches(&self, input_digest: &SafeInputDigest) -> bool` | 幂等输入核对 | 不执行 restore |
| `pub fn targets(&self, owner_ref: &RestoreOwnerRef) -> bool` | explicit owner membership | 无 all-owners fallback |
| `pub fn operation_ref(&self) -> OperationRequestRef` | body-free Restore request ref | 纯函数 |
| `pub fn authority_ref(&self) -> Option<&RestoreAuthorityRef>` | Accepted 才返回 authority | 其他 branch None |

```rust
impl RestoreRequest {
    /// Creates an accepted restore request backed by formal authority.
    pub fn admit(
        request_id: RestoreRequestId,
        bundle_ref: ArchiveBundleRef,
        target_owners: RestoreTargetOwnerSet,
        requested_by: archive_contracts::context::core_shared::actor::ActorRef,
        authority_ref: RestoreAuthorityRef,
        idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
        input_digest: SafeInputDigest,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;

    /// Creates a final rejected restore request.
    pub fn reject(
        request_id: RestoreRequestId,
        bundle_ref: ArchiveBundleRef,
        target_owners: RestoreTargetOwnerSet,
        requested_by: archive_contracts::context::core_shared::actor::ActorRef,
        reason_ref: SafeReasonRef,
        idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
        input_digest: SafeInputDigest,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;

    /// Creates a final blocked restore request without inventing authority.
    pub fn block(
        request_id: RestoreRequestId,
        bundle_ref: ArchiveBundleRef,
        target_owners: RestoreTargetOwnerSet,
        requested_by: archive_contracts::context::core_shared::actor::ActorRef,
        basis: RequestBlockBasis,
        idempotency_key: archive_contracts::context::core_shared::metadata::IdempotencyKey,
        input_digest: SafeInputDigest,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

对象 immutable；Accepted 只允许建立 RestorePlan，不授予 receiver/DB 写权，不证明 Bundle 可恢复，不设置 project/owner restored。

### 9.8 `RestorePlan`（domain 正式对象 20/24）

```rust
/// Coordinates one immutable restore plan revision and conservative per-owner aggregate posture.
pub struct RestorePlan {
    /// Identifies the plan entity.
    pub plan_id: RestorePlanId,
    /// Points to the accepted restore request.
    pub request_ref: RestoreRequestRef,
    /// Pins the Bundle and immutable manifest revision.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Identifies this immutable plan input revision.
    pub plan_revision: RestorePlanRevision,
    /// Lists fixed per-owner restore items.
    pub item_refs: RestoreItemRefSet,
    /// Preserves the most recent complete item input used for plan aggregation.
    pub item_postures: RestoreItemPostureSet,
    /// Carries the conservative plan state.
    pub plan_state: RestorePlanState,
    /// Points to a replacement plan after supersession.
    pub replacement_plan_ref: Option<RestorePlanRef>,
    /// Preserves an explicit plan-level failure without inferring it from one item.
    pub failure_basis_ref: Option<SafeReasonRef>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/request/bundle/revision | restore service ID/revision source + Accepted request + exact manifest; inputs immutable |
| items | Draft 可空；`freeze_items` 后非空、one or more per explicit target owner，不能原地增删 |
| state/replacement | Draft initial；Superseded 必有 replacement，其他 state 必 None |
| failure basis | `Option<SafeReasonRef>`；初始 None，显式 plan-level fail 写 Some；Failed 必须有值，不能用 item failure 代替 |
| version/time | store + application clock |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn freeze_items(&mut self, item_refs: RestoreItemRefSet, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<PlanTransition>` | Draft 中一次性固定非空 set；不直接 Ready，随后按 item posture recompute |
| `pub fn recompute(&mut self, item_postures: &RestoreItemPostureSet, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<PlanTransition>` | 所有 fixed item 精确覆盖后保守得 Ready/Blocked/InProgress/Partial/HandoffComplete；Failed 仅显式 fail |
| `pub fn fail(&mut self, basis_ref: SafeReasonRef, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<PlanTransition>` | 非终态 + 显式 plan-level 确定失败 →Failed；保存 failure_basis_ref，不从单 item Failed 推导 |
| `pub fn supersede(&mut self, replacement_plan_ref: RestorePlanRef, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<PlanTransition>` | Draft/Ready/Blocked/InProgress/Partial→Superseded；replacement != self |
| `pub fn contains(&self, item_ref: &RestoreItemRef) -> bool` | membership；纯函数 |

```rust
impl RestorePlan {
    /// Creates a draft plan for one accepted request and fixed Bundle revision.
    pub fn draft(
        plan_id: RestorePlanId,
        request_ref: RestoreRequestRef,
        bundle_revision_ref: BundleRevisionRef,
        plan_revision: RestorePlanRevision,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

draft 初始化 item_refs/item_postures 为空、failure_basis_ref=None；freeze_items 只允许 item_refs 尚空时调用一次，即使 state 仍 Draft 也不得再次更换集合。recompute 验证全部 fixed items 精确覆盖后保存 item_postures，保留每个 item 的依据引用；各 owner 的映射由 application 读取正式 request 和 items 检查。所有 mutation 显式更新 recorded_at。Plan 不建立跨 owner transaction；HandoffComplete 只表示必需 item outcome 已明确，不等于 business restored；输入变化建立新 plan revision。

#### Plan 聚合算法与显式失败

`RestoreItemPostureSet` 按 item_ref 唯一，owner 不是唯一键（一个 owner 可有多个 item）。recompute 必须精确覆盖 frozen item_refs；application 先核验实际 plan/owner/revision 和相关 handoff/outcome 引用。Draft 只在全部 MaterialReady 时→Ready，其余→Blocked；Blocked 正式解阻后同样先→Ready。Ready 发现首个 HandoffPending/InProgress/CommitUnknown 时→InProgress（Unknown 不等确定结果），前提失效→Blocked。InProgress/Partial 中，全部 Succeeded/Rejected/Failed/Compensated 且每项有正式 outcome 时→HandoffComplete；仍存在确定结果与未完成混合、CompensationPending 或其他混合则→Partial；全为在途则 InProgress；尚无结果且前提不足则 Blocked。不得跨过 Ready/InProgress 以 item 子集直接宣告终点。

`fail` 的 basis 只能来自明确 plan-level 构造/一致性失败；它原子保存 failure_basis_ref 和时间，其他 mutation 不清除。单 item Failed 是该 owner 的确定 outcome，可与其他 outcome 一起形成 HandoffComplete，但绝不是全局恢复成功。Failed/HandoffComplete/Superseded 禁止 recompute/freeze_items；新输入必须新 plan。

### 9.9 `RestoreItem`（domain 正式对象 21/24）

```rust
/// Tracks material and handoff progress for exactly one restore owner and slice set.
pub struct RestoreItem {
    /// Identifies the item.
    pub item_id: RestoreItemId,
    /// Identifies the owning restore plan.
    pub plan_id: RestorePlanId,
    /// Pins the plan's immutable Bundle input for exact material checks.
    pub bundle_revision_ref: BundleRevisionRef,
    /// Identifies the single target owner.
    pub target_owner_ref: RestoreOwnerRef,
    /// Lists approved source entries assigned to this owner.
    pub source_entry_refs: ManifestEntryRefSet,
    /// Points to fixed minimal restore material when ready.
    pub material_ref: Option<RestoreMaterialRef>,
    /// Points to the formal receiver binding when ready.
    pub receiver_ref: Option<RestoreReceiverRef>,
    /// Points to the safety basis used to bind material.
    pub eligibility_basis: Option<RestoreEligibilityBasis>,
    /// Points to the current handoff intent when one exists.
    pub current_handoff_ref: Option<RestoreHandoffRef>,
    /// Preserves all attached handoff intents in append order.
    pub handoff_refs: Vec<RestoreHandoffRef>,
    /// Preserves the latest applied outcome identity.
    pub latest_outcome_ref: Option<HandoffOutcomeRef>,
    /// Pins the formally authorized compensation currently being processed.
    pub current_compensation_ref: Option<CompensationRecordRef>,
    /// Preserves pre-dispatch blockers without discarding previous evidence.
    pub block_history: Vec<BasisObservation<SafeReasonRef>>,
    /// Records owner-specific progress.
    pub item_state: RestoreItemState,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| id/plan/owner/entries | plan builder + fixed manifest；entries 非空且都属于 same owner/source class allowed for target |
| material/receiver/basis | initial None；MaterialReady 要求三者 Some 且 exact owner/revision match；only formal ports supply refs |
| handoff/state | current handoff only after persisted intent；history remains in store；state follows exact outcome |
| version/time | store expected version + application clock |

| 成员函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn bind_material(&mut self, material_ref: RestoreMaterialRef, receiver_ref: RestoreReceiverRef, basis: RestoreEligibilityBasis, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | Planned/Blocked→MaterialReady；basis.matches 校验 revision/owner/receiver/entries/material；前提证明由 application 正式读取 |
| `pub fn block(&mut self, reason_ref: SafeReasonRef, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | Planned/MaterialReady pre-dispatch→Blocked；不清除 source entries |
| `pub fn attach_handoff(&mut self, handoff: &RestoreHandoff, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | MaterialReady→HandoffPending；handoff item/material/receiver exact match |
| `pub fn mark_in_progress(&mut self, handoff: &RestoreHandoff, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | HandoffPending→InProgress；exact current handoff，state=Dispatched/Acknowledged |
| `pub fn apply_outcome(&mut self, outcome: &HandoffOutcome, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | InProgress/CommitUnknown→Succeeded/Rejected/Failed/CommitUnknown；已确定结果遇 Conflicting 也须保存并转 CommitUnknown，不压平 |
| `pub fn mark_compensation_pending(&mut self, compensation: &CompensationRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | CommitUnknown/Failed + compensation.handoff_ref=current_handoff 且 state=Planned →CompensationPending；保存 current_compensation_ref |
| `pub fn mark_compensated(&mut self, compensation: &CompensationRecord, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<ItemTransition>` | CompensationPending + Completed→Compensated |

```rust
impl RestoreItem {
    /// Plans one owner-specific item from an immutable manifest revision.
    pub fn plan(
        item_id: RestoreItemId,
        plan_id: RestorePlanId,
        bundle_revision_ref: BundleRevisionRef,
        target_owner_ref: RestoreOwnerRef,
        source_entry_refs: ManifestEntryRefSet,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

missing/stale/conflicting/unsupported/integrity-failed/unknown 输入不可进入 MaterialReady。一个 owner 的结果绝不传播另一 owner；material/receiver/input 变化须新 handoff 或新 plan/item revision，不悄然替换。

plan 的所有 Option 初始 None、两个 Vec 初始空；revision 由 loaded RestorePlan 传入。block 追加 reason，bind_material 保留历史；若先前已绑定 material，必须完全相同否则新 item。attach_handoff 保存 current ref 并追加 handoff_refs；mark_in_progress 从显式 handoff 校验 ref 等于 current 且已派发；apply_outcome 要求 outcome.handoff_ref 等于 current 并保存 latest_outcome_ref，ACK 保持 InProgress，Conflicting→CommitUnknown；mark_compensated 必须匹配 current_compensation_ref 和原 handoff。每个 mutation 显式更新 recorded_at。旧 outcome 由独立 HandoffOutcome 保存，item 不能删除或覆盖它。

### 9.10 `RestoreHandoff`（domain 正式对象 22/24）

```rust
/// Records one owner-specific receiver handoff intent and conservative effect posture.
pub struct RestoreHandoff {
    /// Identifies the handoff.
    pub handoff_id: RestoreHandoffId,
    /// Identifies the exact restore item.
    pub item_ref: RestoreItemRef,
    /// Identifies the formal owner receiver.
    pub receiver_ref: RestoreReceiverRef,
    /// Pins the minimal owner-specific material.
    pub material_ref: RestoreMaterialRef,
    /// Carries the receiver-scoped idempotency key.
    pub idempotency_key: ReceiverIdempotencyKey,
    /// Detects reuse of the key with different material or receiver input.
    pub input_digest: SafeInputDigest,
    /// Records the conservative handoff effect posture.
    pub handoff_state: RestoreHandoffState,
    /// Points to the latest immutable outcome observation.
    pub latest_outcome_ref: Option<HandoffOutcomeRef>,
    /// Preserves every applied outcome reference in append order.
    pub outcome_refs: Vec<HandoffOutcomeRef>,
    /// Preserves local uncertainty observations without forging receiver feedback.
    pub reconcile_history: Vec<BasisObservation<CommitUnknownBasis>>,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn matches(&self, receiver_ref: &RestoreReceiverRef, input_digest: &SafeInputDigest) -> bool` | same key/input conflict check；material 已含入 stable digest input；不只比较 key |
| `pub fn mark_dispatched(&mut self, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<HandoffTransition>` | IntentRecorded→Dispatched |
| `pub fn apply(&mut self, outcome: &HandoffOutcome, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<HandoffTransition>` | exact handoff outcome→Ack/Success/Reject/Fail/Unknown；Conflicting→ReconcileRequired |
| `pub fn require_reconcile(&mut self, basis: CommitUnknownBasis, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<HandoffTransition>` | ambiguous/contradictory→CommitUnknown 或 ReconcileRequired；阻止重发 |

```rust
impl RestoreHandoff {
    /// Persists one stable receiver intent before any external handoff call.
    pub fn record_intent(
        handoff_id: RestoreHandoffId,
        item_ref: RestoreItemRef,
        receiver_ref: RestoreReceiverRef,
        material_ref: RestoreMaterialRef,
        idempotency_key: ReceiverIdempotencyKey,
        input_digest: SafeInputDigest,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

identity/item/receiver/material/key/digest immutable。禁止直写 owner DB/共享事务，把 ACK、timeout、event delivery 当 commit，或 CommitUnknown 盲重放；必须经 receiver probe/formal review。

record_intent 初始化 latest_outcome_ref=None、两个 Vec 为空。apply 保存 latest ref 并追加 outcome_refs；Acknowledged 后仍可接收明确结果，ReconcileRequired 可接受正式 probe；已有终态遇相冲突观察进入 ReconcileRequired 并保留两项 outcome，不能抹掉既有 commit。require_reconcile 将 basis 追加 reconcile_history，Dispatched/Acknowledged→CommitUnknown，存在矛盾或已知终态冲突→ReconcileRequired；其余非法状态拒绝。全部 mutation 显式更新时间。

### 9.11 `HandoffOutcome`（domain 正式对象 23/24）

```rust
/// Preserves one immutable mapped receiver feedback observation for an exact handoff.
pub struct HandoffOutcome {
    /// Identifies the outcome observation.
    pub outcome_id: HandoffOutcomeId,
    /// Identifies the exact handoff intent.
    pub handoff_ref: RestoreHandoffRef,
    /// Carries the conservative receiver posture.
    pub receiver_outcome: ReceiverOutcomePosture,
    /// Points to the formal receiver commit only for a proved success.
    pub receiver_commit_ref: Option<ReceiverCommitRef>,
    /// Points to the mapped formal receiver feedback.
    pub feedback_ref: ExternalFeedbackRef,
    /// Records when Archive observed the feedback.
    pub observed_at: RecordedAt,
}
```

唯一 factory：`pub fn observe(outcome_id: HandoffOutcomeId, handoff_ref: RestoreHandoffRef, feedback: MappedReceiverFeedback, observed_at: RecordedAt) -> DomainResult<Self>`。Succeeded 必须有 commit ref；其余 posture 不得有伪 commit。无 mutation，仅 accessor/ref。重复 identical feedback 由 application idempotency 复用 stored outcome；conflicting feedback 必须另存记录并使 handoff reconcile，不覆盖历史。本对象不代表 owner current business truth，也不代发 owner event。

### 9.12 `CompensationRecord`（domain 正式对象 24/24）

```rust
/// Records one formally authorized compensation or manual disposition for an exact handoff.
pub struct CompensationRecord {
    /// Identifies the compensation record.
    pub compensation_id: CompensationRecordId,
    /// Identifies the original handoff without erasing its history.
    pub handoff_ref: RestoreHandoffRef,
    /// Points to formal compensation authority.
    pub authority_ref: CompensationAuthorityRef,
    /// Identifies the only authorized compensation action.
    pub action: CompensationAction,
    /// Records compensation effect progress.
    pub state: CompensationState,
    /// Points to the latest mapped compensation feedback.
    pub outcome_ref: Option<ExternalFeedbackRef>,
    /// Preserves all mapped compensation results including safe failure bases.
    pub result_history: Vec<BasisObservation<MappedCompensationResult>>,
    /// Preserves local commit-unknown observations.
    pub reconcile_history: Vec<BasisObservation<CommitUnknownBasis>>,
    /// Pins the receiver and stable input before compensation dispatch.
    pub receiver_ref: RestoreReceiverRef,
    /// Carries the receiver-scoped compensation idempotency key.
    pub idempotency_key: ReceiverIdempotencyKey,
    /// Pins the exact authorized compensation input.
    pub input_digest: SafeInputDigest,
    /// Carries the optimistic entity version.
    pub record_version: RecordVersion,
    /// Records the latest local observation time.
    pub recorded_at: RecordedAt,
}
```

| 函数签名 | 作用 / 返回 / 不变量 |
|---|---|
| `pub fn start(&mut self, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<CompensationTransition>` | Planned→InProgress；仅已有 authority/action |
| `pub fn apply_feedback(&mut self, result: MappedCompensationResult, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<CompensationTransition>` | InProgress/CommitUnknown→Completed/Failed/CommitUnknown/Blocked；只保存 safe feedback ref |
| `pub fn require_reconcile(&mut self, basis: CommitUnknownBasis, expected_version: RecordVersion, recorded_at: RecordedAt) -> DomainResult<CompensationTransition>` | ambiguous→CommitUnknown；禁止盲重试 |

```rust
impl CompensationRecord {
    /// Plans one compensation only from a formal authority and explicit action.
    pub fn plan(
        compensation_id: CompensationRecordId,
        handoff_ref: RestoreHandoffRef,
        authority_ref: CompensationAuthorityRef,
        action: CompensationAction,
        receiver_ref: RestoreReceiverRef,
        idempotency_key: ReceiverIdempotencyKey,
        input_digest: SafeInputDigest,
        initial_version: RecordVersion,
        recorded_at: RecordedAt,
    ) -> DomainResult<Self>;
}
```

`MappedCompensationResult` 是 contracts carrier：`Completed(ExternalFeedbackRef) | Failed(SafeReasonRef) | CommitUnknown(CommitUnknownBasis) | Blocked(SafeReasonRef)`，每个 variant 有同名英文 Rustdoc；只由 Step 7 receiver adapter mapping 构造。补偿不自动反写 owner，Completed 不抹除原 handoff/effect，不等于 business restored。

plan 从原 handoff 与正式补偿决定获取 receiver/action/authority，application 在本地 intent 提交前提供独立 key/digest；outcome=None、两个 history 为空。apply_feedback 将完整 result 追加 result_history；Completed 才设置 outcome_ref；require_reconcile 追加本地 basis。所有 mutation 显式更新时间；同 receiver/key 但输入变化必须拒绝，不能用原 handoff key 当新的 compensation key。外部结果关联由 Step 7 receiver port 闭合，缺失则不得调用正向 transition。

#### CP5/CP6 shared carrier 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `MappedStorageCommitResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Acknowledged(ExternalFeedbackRef)` | `Records receipt acknowledgement without proving commit.` | exact storage adapter response/probe | ExternalActionObservation→placement；不伪造 commit/location；ACK≠commit |
| `Committed(StorageCommitEvidence)` | `Carries formal location, tier, commit, and feedback references.` | exact storage adapter response/probe | ExternalActionObservation→placement；不伪造 commit/location |
| `CommitUnknown(CommitUnknownBasis)` | `Records an ambiguous effect that requires a formal probe.` | exact storage adapter response/probe | ExternalActionObservation→placement；不伪造 commit/location；保留未知，仅 probe/review |
| `Failed(SafeReasonRef)` | `Records a definite provider failure.` | exact storage adapter response/probe | ExternalActionObservation→placement；不伪造 commit/location |
| `Blocked(SafeReasonRef)` | `Records a missing authority or capability prerequisite.` | exact storage adapter response/probe | ExternalActionObservation→placement；不伪造 commit/location；fail-closed |

##### `MappedRetrievalResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Retrievable(ExternalEvidenceRef)` | `Carries formal evidence that the revision is retrievable.` | exact retrieval capability/probe | placement retrieval axis；与 place commit 独立 |
| `Unavailable(ExternalEvidenceRef)` | `Carries formal evidence that the revision is currently unavailable.` | exact retrieval capability/probe | placement retrieval axis；与 place commit 独立 |
| `Failed(SafeReasonRef)` | `Carries a definite retrieval failure.` | exact retrieval capability/probe | placement retrieval axis；与 place commit 独立 |
| `Unknown(SafeReasonRef)` | `Preserves an ambiguous or unsupported retrieval result.` | exact retrieval capability/probe | placement retrieval axis；与 place commit 独立 |

##### `MappedCompensationResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Completed(ExternalFeedbackRef)` | `Carries formal feedback that the exact compensation completed.` | exact receiver compensation response/probe | CompensationRecord；保留失败/未知依据 |
| `Failed(SafeReasonRef)` | `Carries a safe definite compensation failure basis.` | exact receiver compensation response/probe | CompensationRecord；保留失败/未知依据 |
| `CommitUnknown(CommitUnknownBasis)` | `Carries an ambiguous result that requires a formal probe.` | exact receiver compensation response/probe | CompensationRecord；保留失败/未知依据；保留未知，仅 probe/review |
| `Blocked(SafeReasonRef)` | `Carries an unavailable authority, receiver, or safety prerequisite.` | exact receiver compensation response/probe | CompensationRecord；保留失败/未知依据；fail-closed |

##### `RestoreAdmissionBasis` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Accepted(RestoreAuthorityRef)` | `Carries the formal authority for an accepted restore request.` | application formal restore authority/拒绝/阻塞依据 | immutable RestoreRequest |
| `Rejected(SafeReasonRef)` | `Carries a safe definite rejection basis.` | application formal restore authority/拒绝/阻塞依据 | immutable RestoreRequest |
| `Blocked(RequestBlockBasis)` | `Carries a safe unavailable or conflicting prerequisite basis.` | application formal restore authority/拒绝/阻塞依据 | immutable RestoreRequest；fail-closed |

##### `ExternalActionOperation` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Place` | `Places a fixed Bundle revision.` | persisted effect intent | target/family guard；Place/Retrieve 只配 Placement |
| `Retrieve` | `Requests retrieval of a fixed Bundle revision.` | persisted effect intent | target/family guard；Place/Retrieve 只配 Placement |
| `Lifecycle(LifecycleActionKind)` | `Executes the exact formally authorized lifecycle action.` | persisted effect intent | target/family guard；Place/Retrieve 只配 Placement |

##### `MappedLifecycleResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Acknowledged(ExternalFeedbackRef)` | `Carries receipt acknowledgement without commit proof.` | exact lifecycle storage/governance seam response/probe | ExternalActionObservation→LifecycleExecution；ACK≠commit |
| `Committed(LifecycleCommitEvidence)` | `Carries proof of the exact lifecycle effect.` | exact lifecycle storage/governance seam response/probe | ExternalActionObservation→LifecycleExecution |
| `CommitUnknown(CommitUnknownBasis)` | `Preserves an uncertain external commit.` | exact lifecycle storage/governance seam response/probe | ExternalActionObservation→LifecycleExecution；保留未知，仅 probe/review |
| `Failed(SafeReasonRef)` | `Carries a definite effect failure.` | exact lifecycle storage/governance seam response/probe | ExternalActionObservation→LifecycleExecution |
| `Blocked(SafeReasonRef)` | `Carries an unavailable safety prerequisite.` | exact lifecycle storage/governance seam response/probe | ExternalActionObservation→LifecycleExecution；fail-closed |

##### `RetrievalEffectResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Acknowledged(ExternalFeedbackRef)` | `Carries receipt acknowledgement without effect completion.` | exact retrieval-request effect response/probe | ExternalActionObservation；请求 commit 不代表 Retrievable；ACK≠commit |
| `Committed { commit_ref: ExternalCommitRef, feedback_ref: ExternalFeedbackRef }` | `Carries a formal retrieval-request commit and its feedback.` | exact retrieval-request effect response/probe | ExternalActionObservation；请求 commit 不代表 Retrievable |
| `CommitUnknown(CommitUnknownBasis)` | `Preserves an uncertain retrieval-request effect.` | exact retrieval-request effect response/probe | ExternalActionObservation；请求 commit 不代表 Retrievable；保留未知，仅 probe/review |
| `Failed(SafeReasonRef)` | `Carries a definite retrieval-request failure.` | exact retrieval-request effect response/probe | ExternalActionObservation；请求 commit 不代表 Retrievable |
| `Blocked(SafeReasonRef)` | `Carries an unavailable retrieval prerequisite.` | exact retrieval-request effect response/probe | ExternalActionObservation；请求 commit 不代表 Retrievable；fail-closed |

##### `MappedExternalActionResult` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Placement(MappedStorageCommitResult)` | `Carries a placement-specific outcome and optional location evidence.` | 对应 effect family 的 formal mapping | ExternalActionRecord::settle；operation/result family 一致 |
| `Retrieval { effect: RetrievalEffectResult, retrieval: Option<MappedRetrievalResult> }` | `Carries independent retrieval effect and material availability outcomes.` | 对应 effect family 的 formal mapping | ExternalActionRecord::settle；operation/result family 一致 |
| `Lifecycle(MappedLifecycleResult)` | `Carries a lifecycle-specific outcome and action commit proof.` | 对应 effect family 的 formal mapping | ExternalActionRecord::settle；operation/result family 一致 |


### 9.13 CP5～CP6 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 承接 | pass | placement/retrieval/lifecycle、restore admission/plan/material/handoff/outcome/compensation 均有对象 |
| 正式对象计数 | pass | 9/9：CP5 domain 3 + CP6 domain 6；累计 domain 24/24；GovernanceDecisionRef 另属 contracts |
| intent-before-effect | pass | placement/lifecycle/receiver/compensation 均先有本地 stable intent/history object |
| 字段来源 | pass_at_step_6 | commit/location/receiver/material/authority 只从 formal port mapping；Blocked branch 不造正向 ref |
| state semantics | pass | ACK/commit/unknown 分离，retrieval 独立，per-owner outcome 独立，compensation 不抹除历史 |
| owner authority | pass_with_blockers | governance/storage/receiver exact contracts 仍受 `AR-UP-003/005/009`；对象保持 fail-closed |
| 禁止跨域写 | pass | Restore Bundle/request/plan/handoff 均不授予 owner DB 权限或 project restored 状态 |
| 后续承接 | pass | Step 7 formal outcomes/probes；Step 9 effect ordering；Step 10 state matrix；Step 11/13 UoW/idempotency/commit-unknown |

## 10. `application` service 与稳定 carrier 契约

### 10.1 Application capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| request/job admission | command/trigger/job carrier + operation context | stored request/job result | local atomic write | `ArchiveRequestService` | Step 7 store/UoW；Step 8/9 |
| source capture | binding/capture/job or feedback carrier | binding/attempt/coverage/finding result | local write + source I/O intent | `SourceCaptureService` | Step 7 source port；Step 9 |
| manifest/closure/seal | fixed inventory/job carrier | immutable manifest/closure/Bundle transition | local write only | `BundleAssemblyService` | Step 9/11 |
| assessment | fixed verification/compatibility input | assessment/finding result | capability I/O outside UoW | `BundleVerificationService` | Step 7/9/11 |
| placement/retrieval | fixed revision + intent/feedback/probe | placement/action result | storage effect | `PlacementService` | Step 7/9/13 |
| lifecycle execution | decision/action/feedback/probe | execution/action result | governance read + storage effect | `LifecycleExecutionService` | Step 7/9/13 |
| restore/handoff | accepted request + plan/item/material/feedback | per-owner plan/effect/result | source/capability/receiver I/O | `RestoreService` | Step 7/9/13 |
| safe no-write query | query context + selector | five safe view families | no write/no external I/O | `ArchiveQueryService` | Step 7 read ports；Step 8/9 |
| cross-entry execution metadata | handler/worker validated metadata | `ArchiveOperationContext` | none | context helper | Step 8/9/13 |
| duplicate replay | operation/key/digest/result surface | stable stored result | reservation state | idempotency/result helper | Step 7/11/13 |
| current read disclosure | actor + resolved subject + current decision | visible/not available + freshness/redaction | no write | visibility helper | Step 7/8/9 |
| external effect correlation | exact owner/target/key/digest/action | stable effect identity | intent-before-effect | correlation helper | Step 7/9/13 |

### 10.2 功能到对象映射与 service owner

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接 / 禁止事项 |
|---|---|---|---|---|
| 八个 service | 30 个入口 use case 编排 | application service | 校验 context、调用 domain、通过 ports 读写/I/O | 不成为 truth；不持有 infra concrete/provider body |
| `ArchiveApplicationFacade` | 为 API/worker 聚合 capability-limited service handles | facade | command/query/worker facade construction | 不直接执行业务、不隐藏万能 store/provider |
| `ArchiveOperationContext` | channel-specific actor/trace/request/run/key | value/helper | factory + invariant validation | Query 不得携带 write idempotency；event/job 不伪成 command |
| `ArchiveIdempotencyRecord` | reservation/match/complete/conflict | application state carrier | duplicate protection | 不用 digest 算法冒充完整性；不重跑 mutation |
| `StoredArchiveOperationResult` | stable result shell | application result carrier | stored surface reference | 不存 domain/external body；Query 不存 result |
| `ArchiveReadVisibilityDecision` | current visibility/freshness/redaction | read helper | safe response choice | 不授权、不修复、不写 cache |
| `ExternalEffectCorrelation` | target/owner/action/key/digest fixed mapping | effect helper | correlation match | 不代表 dispatch/commit；不生成 external key |

### 10.3 Application shared enum/value types

```rust
/// Classifies an application entry channel and its side-effect rules.
pub enum ArchiveOperationChannel {
    /// A synchronous write command.
    Command,
    /// A synchronous no-write query.
    Query,
    /// A validated inbound event consumer.
    InboundEvent,
    /// A bounded background operation job.
    OperationJob,
}

/// Names one of the stable Archive operations without carrying its input.
pub struct ArchiveOperationName(pub String);

/// Carries a normalized idempotency key for command, event, or job execution.
pub struct ArchiveOperationIdempotencyKey(pub String);

/// Carries the stable digest of canonical operation input.
pub struct ArchiveOperationInputDigest(pub SafeInputDigest);

/// Identifies one stored application result shell.
pub struct ArchiveApplicationResultId(pub String);

/// Points to a stored result for one exact operation.
pub struct ArchiveApplicationResultRef {
    /// Names the operation that produced the result.
    pub operation_name: ArchiveOperationName,
    /// Identifies the stored result.
    pub result_id: ArchiveApplicationResultId,
}

/// Records application idempotency reservation progress.
pub enum ArchiveIdempotencyState {
    /// The key and digest are reserved but no result has committed.
    Reserved,
    /// A stable stored result reference has committed.
    Completed,
    /// The same key was reused for a different operation or input.
    Conflict,
}

/// Classifies the stored public or worker result surface.
pub enum ArchiveStoredResultKind {
    /// Stores a command result or safe command rejection.
    CommandResult,
    /// Stores an inbound consumer disposition.
    ConsumerResult,
    /// Stores a bounded operation job report.
    OperationReport,
}
```

| 类型 / enum | 来源 | 约束 / 允许去向 |
|---|---|---|
| `ArchiveOperationChannel` | API/worker entry | Query 不进入 reservation/UoW write；其他三类按 Step 13 要求 key/digest |
| `ArchiveOperationName` | Step 8 的 3 Command/5 Consumer/17 Job 名称；Query 可用于 trace但不 reservation | 非空、有限 registry validation；不携带 payload |
| normalized key | Core command key、trusted event dedup key、job idempotency key | normalization 规则/namespace 在 Step 13；Query 禁止 |
| input digest | Step 13 canonical stable input calculator | 不含 request/trace/time/random ID；算法 pending，不是 integrity digest |
| result ID/ref | application ID source + operation | 不能拿 truth ID/TraceId/JobRunId 替代；result operation 必须匹配 reservation |
| `ArchiveIdempotencyState` | reserve 初始 | Reserved→Completed 或 Conflict；Completed/Conflict 终态 |
| stored result kind | producing entry | Query 不存；三类不相互转换 |

### 10.4 `ArchiveOperationContext`

```rust
/// Carries validated channel-specific metadata for one application operation.
pub struct ArchiveOperationContext {
    /// Identifies the entry channel.
    pub channel: ArchiveOperationChannel,
    /// Names the stable operation.
    pub operation_name: ArchiveOperationName,
    /// Carries the trusted principal and invocation context.
    pub actor: archive_contracts::context::core_shared::actor::ActorContext,
    /// Propagates the distributed trace identity.
    pub trace_id: archive_contracts::context::core_shared::metadata::TraceId,
    /// Carries command metadata only for a command.
    pub command_metadata: Option<archive_contracts::context::core_shared::metadata::CommandMetadata>,
    /// Carries query metadata only for a query.
    pub query_metadata: Option<archive_contracts::context::core_shared::metadata::QueryMetadata>,
    /// Carries the trusted inbound event identity only for a consumer.
    pub source_event_ref: Option<ExternalEventRef>,
    /// Carries the run identity only for an operation job.
    pub job_run_id: Option<archive_contracts::context::core_shared::metadata::JobRunId>,
    /// Carries a normalized key only for write/event/job channels.
    pub idempotency_key: Option<ArchiveOperationIdempotencyKey>,
    /// Pins the acquired local worker claim for a bounded operations job.
    pub worker_claim: Option<WorkerClaim>,
}
```

| 字段 | 来源 / 不变量 |
|---|---|
| channel/name | entry handler registry；name 必须属于相应 channel 的正式入口分母 |
| actor/trace | trusted outer boundary；command/query trace 与 metadata.request.trace_id 一致；worker system actor 不等授权 |
| metadata/event/run | 恰有与 channel 对应的一项：Command→command；Query→query；InboundEvent→event；OperationJob→run |
| idempotency | Command/Event/Job 必须 Some；Query 必须 None |
| worker_claim | OperationJob 必须 Some；Command/Query/InboundEvent 初始 None。claim 来 application control，不能从 job_run_id 或 input ref 派生；service 提交时仍需 store fence 验证 |

| 工厂签名 | 使用场景 / 约束 |
|---|---|
| `pub fn from_command(operation_name: ArchiveOperationName, actor: archive_contracts::context::core_shared::actor::ActorContext, metadata: archive_contracts::context::core_shared::metadata::CommandMetadata, idempotency_key: ArchiveOperationIdempotencyKey) -> ApplicationResult<Self>` | trace 从 metadata 取得；仅 3 Command |
| `pub fn from_query(operation_name: ArchiveOperationName, actor: archive_contracts::context::core_shared::actor::ActorContext, metadata: archive_contracts::context::core_shared::metadata::QueryMetadata) -> ApplicationResult<Self>` | idempotency/event/run 均 None；断言 no-write；仅 5 Query |
| `pub fn from_inbound_event(operation_name: ArchiveOperationName, actor: archive_contracts::context::core_shared::actor::ActorContext, source_event_ref: ExternalEventRef, trace_id: archive_contracts::context::core_shared::metadata::TraceId, idempotency_key: ArchiveOperationIdempotencyKey) -> ApplicationResult<Self>` | 可信 consumer adapter 完成 envelope validation 后；仅 5 Consumer |
| `pub fn from_job(operation_name: ArchiveOperationName, actor: archive_contracts::context::core_shared::actor::ActorContext, job_run_id: archive_contracts::context::core_shared::metadata::JobRunId, trace_id: archive_contracts::context::core_shared::metadata::TraceId, idempotency_key: ArchiveOperationIdempotencyKey, worker_claim: WorkerClaim) -> ApplicationResult<Self>` | 仅 17 logical Job；claim 来 control 且 target/holder/operation 匹配；run ID 不当 result ID |

公开成员函数：`requires_idempotency() -> bool`、`assert_query_no_write() -> ApplicationResult<()>`、`assert_write_metadata_complete() -> ApplicationResult<()>`、`request_id() -> Option<&RequestId>`。均只做 shape/invariant，不认证 actor、不读 repository、不产生 ID/time/digest。

### 10.5 `ArchiveIdempotencyRecord`

```rust
/// Stores a technical reservation for one exact non-query application operation.
pub struct ArchiveIdempotencyRecord {
    /// Carries the normalized key.
    pub idempotency_key: ArchiveOperationIdempotencyKey,
    /// Identifies the entry channel.
    pub channel: ArchiveOperationChannel,
    /// Names the protected operation.
    pub operation_name: ArchiveOperationName,
    /// Carries the canonical stable input digest.
    pub input_digest: ArchiveOperationInputDigest,
    /// Points to the committed stored result when complete.
    pub result_ref: Option<ArchiveApplicationResultRef>,
    /// Records reservation progress.
    pub state: ArchiveIdempotencyState,
    /// Carries a safe conflict basis only when conflicted.
    pub conflict_reason_ref: Option<SafeReasonRef>,
    /// Carries the optimistic record version.
    pub record_version: RecordVersion,
}
```

| 函数签名 | 作用 / 不变量 |
|---|---|
| `reserve(context: &ArchiveOperationContext, input_digest: ArchiveOperationInputDigest, initial_version: RecordVersion) -> ApplicationResult<Self>` | Query 拒绝；初始 Reserved/result=None/conflict=None |
| `matches(&self, channel: ArchiveOperationChannel, operation_name: &ArchiveOperationName, input_digest: &ArchiveOperationInputDigest) -> bool` | 三字段全相等才 duplicate |
| `complete(&mut self, result_ref: ArchiveApplicationResultRef, expected_version: RecordVersion) -> ApplicationResult<IdempotencyTransition>` | Reserved→Completed；operation 相同；result Some/conflict None |
| `mark_conflict(&mut self, reason_ref: SafeReasonRef, expected_version: RecordVersion) -> ApplicationResult<IdempotencyTransition>` | Reserved→Conflict；result None/reason Some |

不得用 conflict 自动覆盖原 reservation，不得让 duplicate 重跑 domain/external effect；Completed 命中必须经 Step 7/13 读取 exact stored result，missing surface 是 consistency error，不得重做。

```rust
/// Returns the validated technical reservation change without allocating a version.
pub struct IdempotencyTransition {
    /// Captures the reservation state before mutation.
    pub before: ArchiveIdempotencyState,
    /// Captures the reservation state after mutation.
    pub after: ArchiveIdempotencyState,
    /// Pins the loaded version required by the store.
    pub expected_version: RecordVersion,
}
```

该 carrier 归 `application::idempotency`，由 complete/mark_conflict 在 guard 通过后构造，无独立持久化。`mark_conflict` 只供确认原 reservation 本身非法的处置使用；新到的异输入请求必须返回 Conflict disposition，不能把已有合法 Reserved/Completed 改成 Conflict 或抢走原结果。键的 subject/tenant/channel namespace 由 Step 13 正式闭合前不得实施去重。

### 10.6 `StoredArchiveOperationResult`

```rust
/// Points to an immutable stored result surface without duplicating protocol or domain bodies.
pub struct StoredArchiveOperationResult {
    /// Identifies the result and producing operation.
    pub result_ref: ArchiveApplicationResultRef,
    /// Classifies the stored surface.
    pub result_kind: ArchiveStoredResultKind,
    /// Points to the immutable serialized result surface.
    pub surface_ref: StoredResultSurfaceRef,
    /// Carries the originating trace identity.
    pub trace_id: archive_contracts::context::core_shared::metadata::TraceId,
    /// Records when the result committed locally.
    pub recorded_at: RecordedAt,
}
```

factory `pub fn from_surface(result_ref: ArchiveApplicationResultRef, result_kind: ArchiveStoredResultKind, surface_ref: StoredResultSurfaceRef, trace_id: archive_contracts::context::core_shared::metadata::TraceId, recorded_at: RecordedAt) -> ApplicationResult<Self>` 覆盖全部字段；成员为 `pub fn matches_ref(&self, result_ref: &ArchiveApplicationResultRef) -> bool`、`pub fn is_command_result(&self) -> bool`、`pub fn is_consumer_result(&self) -> bool`、`pub fn is_operation_report(&self) -> bool`。`StoredResultSurfaceRef` 是 body-free non-empty ref，由 result store save 返回；完整 Step 8 DTO 不复制进 helper。对象 immutable；Query 不创建，duplicate replay 不现查 current truth 重新生成结果。

### 10.7 `ArchiveReadVisibilityDecision`

```rust
/// Records the current read visibility, freshness, and redaction decision for one Archive subject.
pub struct ArchiveReadVisibilityDecision {
    /// Identifies the requested Archive subject without carrying its body.
    pub subject_ref: ArchiveReadSubjectRef,
    /// Identifies the effective actor.
    pub actor_ref: archive_contracts::context::core_shared::actor::ActorRef,
    /// Records whether a body may be returned without revealing hidden existence.
    pub visible: bool,
    /// Carries freshness only when a visible view is assembled.
    pub freshness: Option<ViewFreshness>,
    /// Carries redaction posture only when visible.
    pub redaction: Option<RedactionPosture>,
    /// Points to the current formal disclosure decision or capability evidence.
    pub basis_ref: ExternalEvidenceRef,
}
```

factory `pub fn from_current_decision(subject_ref: ArchiveReadSubjectRef, actor_ref: archive_contracts::context::core_shared::actor::ActorRef, visible: bool, freshness: Option<ViewFreshness>, redaction: Option<RedactionPosture>, basis_ref: ExternalEvidenceRef) -> ApplicationResult<Self>`：visible=true 要求 freshness/redaction Some；false 要求二者 None，避免通过 metadata 泄漏 existence。成员 `is_visible()` 与 `to_not_available() -> SafeNotAvailable` 纯函数。subject ref 必须由 query selector或 Step 7 read resolver 提供，不从裸字符串/loaded hidden body 猜；此 helper 不授权、不写 cache/trace/projection、不触发 capture/verify/retrieve/repair。

### 10.8 `ExternalEffectCorrelation`

```rust
/// Pins the identity, owner, input, and idempotency context for one external effect.
pub struct ExternalEffectCorrelation {
    /// Identifies the Archive-owned effect target.
    pub target_ref: ExternalEffectTargetRef,
    /// Identifies the external authority or receiver boundary.
    pub external_owner_ref: OwnerRef,
    /// Identifies the persisted action or handoff record.
    pub effect_record_ref: ExternalEffectRecordRef,
    /// Carries the external idempotency key.
    pub idempotency_key: ExternalEffectIdempotencyKey,
    /// Carries the stable effect input digest.
    pub input_digest: SafeInputDigest,
}
```

```rust
/// Identifies the Archive-owned target of one external effect.
pub enum ExternalEffectTargetRef {
    /// Targets a storage placement.
    Placement(ArchivePlacementRef),
    /// Targets a governance-bound lifecycle execution.
    Lifecycle(LifecycleExecutionRef),
    /// Targets one owner-specific restore item.
    RestoreItem(RestoreItemRef),
    /// Targets one formally authorized restore compensation.
    Compensation(CompensationRecordRef),
}

/// Identifies the persisted Archive record for one external effect.
pub enum ExternalEffectRecordRef {
    /// Points to a storage or lifecycle action intent.
    Action(ExternalActionRecordRef),
    /// Points to an owner-specific receiver handoff intent.
    Handoff(RestoreHandoffRef),
    /// Points to a restore compensation effect record.
    Compensation(CompensationRecordRef),
}

/// Carries an external idempotency key without mixing capability namespaces.
pub enum ExternalEffectIdempotencyKey {
    /// Carries a storage-capability-scoped key.
    Storage(ExternalIdempotencyKey),
    /// Carries an owner-receiver-scoped key.
    Receiver(ReceiverIdempotencyKey),
}
```

variant 组合固定为：Placement/Lifecycle 只能对应 `Action + Storage`；RestoreItem 只能对应 `Handoff + Receiver`；Compensation 只能对应 `Compensation + Receiver`。每个载荷都是 body-free typed ref/key，来源为已持久 intent，不允许 API/worker 依据字符串或错误类别猜 variant。

factory `pub fn pin(target_ref: ExternalEffectTargetRef, external_owner_ref: OwnerRef, effect_record_ref: ExternalEffectRecordRef, idempotency_key: ExternalEffectIdempotencyKey, input_digest: SafeInputDigest) -> ApplicationResult<Self>` 校验组合；`pub fn matches_feedback(&self, owner: &OwnerRef, record: &ExternalEffectRecordRef, digest: &SafeInputDigest) -> bool` 必须三者全匹配。它不代表 dispatched/committed/succeeded，不生成 external key/digest，不保存 provider endpoint/body。

### 10.9 八个 application service 契约

以下 service 泛型代表 Step 7 将定义的 capability-limited port handle。constructor 只接收当前 service 实际需要的 handle；方法的 `*Input/*Result` 是 Step 8 协议 family 的命名占位，本 Step 只固定 capability owner 和参数/返回边界，不提前定义 wire 字段。

```rust
/// Coordinates archive and restore admission plus bounded Archive job state.
pub struct ArchiveRequestService<S, I, C> {
    /// Provides local unit-of-work and request/job storage capabilities.
    store: S,
    /// Provides idempotency and stored-result capabilities.
    idempotency: I,
    /// Provides Archive-controlled identifiers and observation time.
    context_source: C,
}

/// Coordinates source binding, fixed capture attempts, and conservative reconciliation.
pub struct SourceCaptureService<S, E, C> {
    /// Provides only the local storage, unit-of-work, and result capabilities required by this service.
    store: S,
    /// Provides owner-approved capture and material capabilities.
    source_export: E,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}

/// Coordinates immutable manifest revisions, closure, and Bundle seal guards.
pub struct BundleAssemblyService<S, C> {
    /// Provides only the local storage, unit-of-work, and result capabilities required by this service.
    store: S,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}

/// Coordinates fixed-input integrity and target-specific compatibility assessments.
pub struct BundleVerificationService<S, I, V, C> {
    /// Provides only the local storage, unit-of-work, and result capabilities required by this service.
    store: S,
    /// Provides formally bound fixed-input integrity assessment.
    integrity: I,
    /// Provides exact-target compatibility assessment.
    compatibility: V,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}

/// Coordinates provider-neutral placement, retrieval, and external action reconciliation.
pub struct PlacementService<S, A, C> {
    /// Provides only the local storage, unit-of-work, and result capabilities required by this service.
    store: S,
    /// Provides provider-neutral placement, retrieval, and effect probes.
    archive_storage: A,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}

/// Coordinates lifecycle effects only from formal decision applicability proofs.
pub struct LifecycleExecutionService<S, G, A, C> {
    /// Provides only the local storage, unit-of-work, and result capabilities required by this service.
    store: S,
    /// Provides formal decision applicability without transferring governance truth.
    governance: G,
    /// Provides provider-neutral placement, retrieval, and effect probes.
    archive_storage: A,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}

/// Coordinates immutable restore plans, material preparation, receiver effects, and compensation.
pub struct RestoreService<S, E, I, V, A, R, C> {
    /// Provides only the local storage, unit-of-work, and result capabilities required by this service.
    store: S,
    /// Provides owner-approved capture and material capabilities.
    source_export: E,
    /// Provides formally bound fixed-input integrity assessment.
    integrity: I,
    /// Provides exact-target compatibility assessment.
    compatibility: V,
    /// Provides provider-neutral placement, retrieval, and effect probes.
    archive_storage: A,
    /// Provides exact owner receiver dispatch, probe, and compensation boundaries.
    restore_receiver: R,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}

/// Composes the five authorized no-write Archive views from read-only capabilities.
pub struct ArchiveQueryService<R, V, C> {
    /// Provides committed read-only Archive records.
    read_store: R,
    /// Provides current safe disclosure and freshness decisions.
    visibility: V,
    /// Provides capability-limited Archive identifiers or observation time.
    context_source: C,
}
```

| Service | 完整 constructor 签名 | 字段来源 / 不变量 |
|---|---|---|
| `ArchiveRequestService<S,I,C>` | `pub fn new(store: S, idempotency: I, context_source: C) -> Self` | runtime builder 注入各字段；admission + job + history/result/reservation 同 local UoW |
| `SourceCaptureService<S,E,C>` | `pub fn new(store: S, source_export: E, context_source: C) -> Self` | runtime builder 注入各字段；固定 binding/attempt/fence；intent 先于 source I/O |
| `BundleAssemblyService<S,C>` | `pub fn new(store: S, context_source: C) -> Self` | runtime builder 注入各字段；只从 committed CP2 inventory 建 immutable revision |
| `BundleVerificationService<S,I,V,C>` | `pub fn new(store: S, integrity: I, compatibility: V, context_source: C) -> Self` | runtime builder 注入各字段；assessment intent 先于 I/O；fixed input |
| `PlacementService<S,A,C>` | `pub fn new(store: S, archive_storage: A, context_source: C) -> Self` | runtime builder 注入各字段；按 action kind 区分 placement/retrieval；probe-first |
| `LifecycleExecutionService<S,G,A,C>` | `pub fn new(store: S, governance: G, archive_storage: A, context_source: C) -> Self` | runtime builder 注入各字段；危险派发前重读正式 decision/hold；不解释 policy |
| `RestoreService<S,E,I,V,A,R,C>` | `pub fn new(store: S, source_export: E, integrity: I, compatibility: V, archive_storage: A, restore_receiver: R, context_source: C) -> Self` | runtime builder 注入各字段；per-owner；正式 receiver handoff；不写 owner DB |
| `ArchiveQueryService<R,V,C>` | `pub fn new(read_store: R, visibility: V, context_source: C) -> Self` | runtime builder 注入各字段；Query-only read capability，无写入/外部 effect |

所有 service 方法采用 `pub async fn`：application 只描述异步 port 编排，不因此依赖 Tokio；domain 仍同步纯函数。下表固定 30 个入口及两个按持久 owner 路由的分支（32 个 method surface）。每行入口/owner/方法名/I/O 名称唯一；Step 8 必须定义对应 protocol family 的全部字段和 error surface，当前不把命名登记当成可实施 DTO。

| ID / 入口 | 唯一 service owner | 完整方法签名 |
|---|---|---|
| C01 / `RequestArchive` | `ArchiveRequestService` | `pub async fn request_archive(&self, context: &ArchiveOperationContext, input: RequestArchiveInput) -> ApplicationResult<ArchiveRequestResult>` |
| C02 / `RequestRestore` | `ArchiveRequestService` | `pub async fn request_restore(&self, context: &ArchiveOperationContext, input: RequestRestoreInput) -> ApplicationResult<RestoreRequestResult>` |
| C03 / `RequestLifecycleExecution` | `LifecycleExecutionService` | `pub async fn request_execution(&self, context: &ArchiveOperationContext, input: RequestLifecycleExecutionInput) -> ApplicationResult<LifecycleRequestResult>` |
| Q01 / `GetArchiveJobStatus` | `ArchiveQueryService` | `pub async fn get_job_status(&self, context: &ArchiveOperationContext, input: GetArchiveJobStatusInput) -> ApplicationResult<SafeRead<SafeArchiveJobStatusView>>` |
| Q02 / `GetArchiveBundle` | `ArchiveQueryService` | `pub async fn get_bundle(&self, context: &ArchiveOperationContext, input: GetArchiveBundleInput) -> ApplicationResult<SafeRead<SafeArchiveBundleView>>` |
| Q03 / `VerifyArchiveBundle` | `ArchiveQueryService` | `pub async fn verify_bundle(&self, context: &ArchiveOperationContext, input: VerifyArchiveBundleInput) -> ApplicationResult<SafeRead<SafeBundleVerificationView>>` |
| Q04 / `GetRestorePlan` | `ArchiveQueryService` | `pub async fn get_restore_plan(&self, context: &ArchiveOperationContext, input: GetRestorePlanInput) -> ApplicationResult<SafeRead<SafeRestorePlanView>>` |
| Q05 / `GetRestoreHandoffStatus` | `ArchiveQueryService` | `pub async fn get_restore_handoff_status(&self, context: &ArchiveOperationContext, input: GetRestoreHandoffStatusInput) -> ApplicationResult<SafeRead<SafeRestoreHandoffView>>` |
| E01 / `ConsumeArchiveTrigger` | `ArchiveRequestService` | `pub async fn consume_archive_trigger(&self, context: &ArchiveOperationContext, input: ArchiveTriggerInput) -> ApplicationResult<ArchiveTriggerResult>` |
| E02 / `ConsumeSourceExportFeedback` | `SourceCaptureService` | `pub async fn consume_feedback(&self, context: &ArchiveOperationContext, input: SourceExportFeedbackInput) -> ApplicationResult<SourceExportFeedbackResult>` |
| E03 / `ConsumeGovernanceDecisionChange` | `LifecycleExecutionService` | `pub async fn consume_decision_change(&self, context: &ArchiveOperationContext, input: GovernanceDecisionChangeInput) -> ApplicationResult<GovernanceDecisionChangeResult>` |
| E04 / `ConsumeStorageActionFeedback` | `PlacementService` | `pub async fn consume_feedback(&self, context: &ArchiveOperationContext, input: StorageActionFeedbackInput) -> ApplicationResult<StorageActionFeedbackResult>` |
| E04-L / `ConsumeStorageActionFeedback（Lifecycle 分支）` | `LifecycleExecutionService` | `pub async fn consume_storage_feedback(&self, context: &ArchiveOperationContext, input: StorageActionFeedbackInput) -> ApplicationResult<StorageActionFeedbackResult>` |
| E05 / `ConsumeRestoreReceiverFeedback` | `RestoreService` | `pub async fn consume_receiver_feedback(&self, context: &ArchiveOperationContext, input: RestoreReceiverFeedbackInput) -> ApplicationResult<RestoreReceiverFeedbackResult>` |
| J01 / `AdvanceArchiveJob` | `ArchiveRequestService` | `pub async fn advance_job(&self, context: &ArchiveOperationContext, input: AdvanceArchiveJobInput) -> ApplicationResult<AdvanceArchiveJobReport>` |
| J02 / `PlanArchiveSources` | `SourceCaptureService` | `pub async fn plan_sources(&self, context: &ArchiveOperationContext, input: PlanArchiveSourcesInput) -> ApplicationResult<PlanArchiveSourcesReport>` |
| J03 / `CaptureArchiveSource` | `SourceCaptureService` | `pub async fn capture_source(&self, context: &ArchiveOperationContext, input: CaptureArchiveSourceInput) -> ApplicationResult<CaptureArchiveSourceReport>` |
| J04 / `ReconcileSourceCapture` | `SourceCaptureService` | `pub async fn reconcile_capture(&self, context: &ArchiveOperationContext, input: ReconcileSourceCaptureInput) -> ApplicationResult<ReconcileSourceCaptureReport>` |
| J05 / `AssembleBundleManifest` | `BundleAssemblyService` | `pub async fn assemble_manifest(&self, context: &ArchiveOperationContext, input: AssembleBundleManifestInput) -> ApplicationResult<AssembleBundleManifestReport>` |
| J06 / `SealArchiveBundle` | `BundleAssemblyService` | `pub async fn seal_bundle(&self, context: &ArchiveOperationContext, input: SealArchiveBundleInput) -> ApplicationResult<SealArchiveBundleReport>` |
| J07 / `AssessBundleIntegrity` | `BundleVerificationService` | `pub async fn assess_integrity(&self, context: &ArchiveOperationContext, input: AssessBundleIntegrityInput) -> ApplicationResult<AssessBundleIntegrityReport>` |
| J08 / `AssessBundleCompatibility` | `BundleVerificationService` | `pub async fn assess_compatibility(&self, context: &ArchiveOperationContext, input: AssessBundleCompatibilityInput) -> ApplicationResult<AssessBundleCompatibilityReport>` |
| J09 / `PlaceArchiveBundle` | `PlacementService` | `pub async fn place_bundle(&self, context: &ArchiveOperationContext, input: PlaceArchiveBundleInput) -> ApplicationResult<PlaceArchiveBundleReport>` |
| J10 / `RetrieveArchiveBundle` | `PlacementService` | `pub async fn retrieve_bundle(&self, context: &ArchiveOperationContext, input: RetrieveArchiveBundleInput) -> ApplicationResult<RetrieveArchiveBundleReport>` |
| J11 / `ExecuteArchiveLifecycle` | `LifecycleExecutionService` | `pub async fn execute(&self, context: &ArchiveOperationContext, input: ExecuteArchiveLifecycleInput) -> ApplicationResult<ExecuteArchiveLifecycleReport>` |
| J12 / `ReconcileExternalAction` | `PlacementService` | `pub async fn reconcile_action(&self, context: &ArchiveOperationContext, input: ReconcileExternalActionInput) -> ApplicationResult<ReconcileExternalActionReport>` |
| J12-L / `ReconcileExternalAction（Lifecycle 分支）` | `LifecycleExecutionService` | `pub async fn reconcile_action(&self, context: &ArchiveOperationContext, input: ReconcileExternalActionInput) -> ApplicationResult<ReconcileExternalActionReport>` |
| J13 / `BuildRestorePlan` | `RestoreService` | `pub async fn build_plan(&self, context: &ArchiveOperationContext, input: BuildRestorePlanInput) -> ApplicationResult<BuildRestorePlanReport>` |
| J14 / `PrepareRestoreMaterial` | `RestoreService` | `pub async fn prepare_material(&self, context: &ArchiveOperationContext, input: PrepareRestoreMaterialInput) -> ApplicationResult<PrepareRestoreMaterialReport>` |
| J15 / `DispatchRestoreHandoff` | `RestoreService` | `pub async fn dispatch_handoff(&self, context: &ArchiveOperationContext, input: DispatchRestoreHandoffInput) -> ApplicationResult<DispatchRestoreHandoffReport>` |
| J16 / `ReconcileRestoreHandoff` | `RestoreService` | `pub async fn reconcile_handoff(&self, context: &ArchiveOperationContext, input: ReconcileRestoreHandoffInput) -> ApplicationResult<ReconcileRestoreHandoffReport>` |
| J17 / `ExecuteRestoreCompensation` | `RestoreService` | `pub async fn execute_compensation(&self, context: &ArchiveOperationContext, input: ExecuteRestoreCompensationInput) -> ApplicationResult<ExecuteRestoreCompensationReport>` |

E04/E04-L 与 J12/J12-L 分别是同一正式入口的两个互斥分支，不能计成四个入口。路由只采用 application 读回的 persisted ExternalActionTargetRef，映射 Placement→PlacementService，Lifecycle→LifecycleExecutionService；target 缺失/冲突即安全拒绝，worker 不直读 repository、不广播两个服务、不从输入字符串猜 owner。其返回 family 相同，分支必须进入 Step 8 selector 和 Step 13 stable digest。

`store: S` 的非 Request 服务同样包含本用例需要的 local UoW、idempotency/result capability；不应因 RequestService 独立命名 I 就让其他写服务绕过去重。Query 的 R/V/C 只允许当前 read/disclosure/clock，禁止 id generation、write UoW 或外部 effect handle。service 不保存跨请求 actor/domain 状态；exact trait bounds、ID/clock/source availability 在 Step 7 闭合。Command result 命名沿用正式 02 的 ArchiveRequestResult/RestoreRequestResult/LifecycleRequestResult。

### 10.10 `ArchiveApplicationFacade`

```rust
/// Groups capability-limited Archive application services for entry-layer wiring.
pub struct ArchiveApplicationFacade<A, S, B, V, P, L, R, Q> {
    /// Provides request and job coordination operations.
    pub request_service: A,
    /// Provides source capture operations.
    pub source_capture_service: S,
    /// Provides manifest and Bundle assembly operations.
    pub bundle_assembly_service: B,
    /// Provides integrity and compatibility assessment operations.
    pub bundle_verification_service: V,
    /// Provides placement and retrieval operations.
    pub placement_service: P,
    /// Provides governance-bound lifecycle operations.
    pub lifecycle_service: L,
    /// Provides restore planning and handoff operations.
    pub restore_service: R,
    /// Provides no-write query composition.
    pub query_service: Q,
}
```

唯一 factory `pub fn new(request_service: A, source_capture_service: S, bundle_assembly_service: B, bundle_verification_service: V, placement_service: P, lifecycle_service: L, restore_service: R, query_service: Q) -> Self`。facade 只聚合服务，不直接执行逻辑、不开事务、不访问 port，不进入 contracts/public DTO；API/worker 应通过 capability-limited projection 或具体 service handle，不能因 facade 获得不相关写权限。

### 10.11 Application value / helper 共同函数

本模块 String newtype 提供 `pub fn try_new(value: String) -> ApplicationResult<Self>`、`pub fn as_str(&self) -> &str`、`pub fn into_inner(self) -> String`；name 校验 finite operation registry，key/result ID 拒绝空/纯空白。输入 digest wrapper 提供 `pub fn new(value: SafeInputDigest) -> Self`、`pub fn as_digest(&self) -> &SafeInputDigest`，不生成 digest。`ArchiveApplicationResultRef::new(result_id: ArchiveApplicationResultId, operation_name: ArchiveOperationName) -> Self` 覆盖全部字段。`IdempotencyTransition::new(before: ArchiveIdempotencyState, after: ArchiveIdempotencyState, expected_version: RecordVersion) -> Self` 仅由已通过 guard 的 mutation 产生。

`ArchiveOperationContext` 的完整只读成员为 `pub fn requires_idempotency(&self) -> bool`、`pub fn assert_query_no_write(&self) -> ApplicationResult<()>`、`pub fn assert_write_metadata_complete(&self) -> ApplicationResult<()>`、`pub fn request_id(&self) -> Option<&archive_contracts::context::core_shared::metadata::RequestId>`。`ArchiveReadVisibilityDecision` 提供 `pub fn is_visible(&self) -> bool`、`pub fn to_not_available(&self) -> SafeNotAvailable`；后者丢弃全部原因，不能用于泄漏存在性。其余只提供同名字段 accessor，不增加 I/O。

#### application 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `ArchiveOperationChannel` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Command` | `A synchronous write command.` | trusted API/worker context factory | application service；Query 无写 metadata/key |
| `Query` | `A synchronous no-write query.` | trusted API/worker context factory | application service；Query 无写 metadata/key |
| `InboundEvent` | `A validated inbound event consumer.` | trusted API/worker context factory | application service；Query 无写 metadata/key |
| `OperationJob` | `A bounded background operation job.` | trusted API/worker context factory | application service；Query 无写 metadata/key |

##### `ArchiveIdempotencyState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Reserved` | `The key and digest are reserved but no result has committed.` | reserve + non-Query context/key/digest | Completed；原 reservation 被正式判定非法才 Conflict |
| `Completed` | `A stable stored result reference has committed.` | 同 operation 的已提交 result | 终态；duplicate 读原 result |
| `Conflict` | `The same key was reused for a different operation or input.` | 仅原 reservation 自身非法的正式处置 | 终态；异输入新请求不得篡改合法 reservation |

##### `ArchiveStoredResultKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `CommandResult` | `Stores a command result or safe command rejection.` | committed producing Command/Consumer/Job | immutable stored result；Query 不写 result store |
| `ConsumerResult` | `Stores an inbound consumer disposition.` | committed producing Command/Consumer/Job | immutable stored result；Query 不写 result store |
| `OperationReport` | `Stores a bounded operation job report.` | committed producing Command/Consumer/Job | immutable stored result；Query 不写 result store |

##### `ExternalEffectTargetRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Placement(ArchivePlacementRef)` | `Targets a storage placement.` | persisted effect target | ExternalEffectCorrelation；与 record/key family 一致 |
| `Lifecycle(LifecycleExecutionRef)` | `Targets a governance-bound lifecycle execution.` | persisted effect target | ExternalEffectCorrelation；与 record/key family 一致 |
| `RestoreItem(RestoreItemRef)` | `Targets one owner-specific restore item.` | persisted effect target | ExternalEffectCorrelation；与 record/key family 一致 |
| `Compensation(CompensationRecordRef)` | `Targets one formally authorized restore compensation.` | persisted effect target | ExternalEffectCorrelation；与 record/key family 一致 |

##### `ExternalEffectRecordRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Action(ExternalActionRecordRef)` | `Points to a storage or lifecycle action intent.` | persisted action/handoff/compensation | ExternalEffectCorrelation；不是 delivery receipt |
| `Handoff(RestoreHandoffRef)` | `Points to an owner-specific receiver handoff intent.` | persisted action/handoff/compensation | ExternalEffectCorrelation；不是 delivery receipt |
| `Compensation(CompensationRecordRef)` | `Points to a restore compensation effect record.` | persisted action/handoff/compensation | ExternalEffectCorrelation；不是 delivery receipt |

##### `ExternalEffectIdempotencyKey` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Storage(ExternalIdempotencyKey)` | `Carries a storage-capability-scoped key.` | exact persisted effect key | 外部 call/probe/reconcile；与本地 admission key 分离 |
| `Receiver(ReceiverIdempotencyKey)` | `Carries an owner-receiver-scoped key.` | exact persisted effect key | 外部 call/probe/reconcile；与本地 admission key 分离 |


### 10.12 Application 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability/service | pass | 8/8 service 覆盖 3 Command、5 Query、5 Consumer、17 Job 的唯一 owner |
| stable carrier | pass | context/idempotency/stored result/visibility/effect correlation 当步闭口，未机械后推 |
| Query no-write | pass | Query context 无 key，Query service 只拿 read/visibility/context capability |
| dependency inversion | pass | service 只含 generic port handles；无 infra/provider concrete type |
| fields/functions | pass_at_step_6 | carrier 完整；service method 输入/结果命名固定，精确 DTO 字段留 Step 8，trait bounds留 Step 7 |
| idempotency | pass_at_step_6 | key+operation+digest+stored result 闭环；算法/UoW/replay 由 Step 11/13 |
| external effects | pass | correlation 不代表 commit；所有 service 遵守 intent-before-effect/probe-first |
| 后续承接 | pass_with_blockers | Step 7 exact capabilities、Step 8 DTO、Step 9 flow、Step 11 UoW、Step 13 concurrency；external blockers 不变 |

## 11. `infra` runtime binding、availability 与 assembly 契约

### 11.1 Infra capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| validated binding registry | 正式 04 未来提供的已校验 config refs + Step 7 port slots | provider-neutral binding refs | infra-local immutable assembly input | `ArchiveRuntimeBindings` | Step 7 adapter trait；Step 14/正式 04 config schema |
| adapter availability | slot + binding ref + validation/probe result | fail-closed availability marker | infra-local runtime state | `AdapterAvailabilityMarker` | Step 7 adapter outcome；Step 12 error |
| capability-limited assembly | bindings + complete marker set + constructed port handles | application service/facade handles | runtime assembly lifecycle | `ArchiveRuntimeAssembly` | Step 7 constructor graph；Step 14 startup |

### 11.2 功能到对象与对象能力映射

| 对象 | 承接功能 | 类别 | 对象能力 | 必需字段 / factory / state | 不承接 / 禁止事项 |
|---|---|---|---|---|---|
| `ArchiveRuntimeBindings` | 保存已验证的 local/external binding identities | infra immutable config carrier | slot 完整性、required binding lookup | profile/config/store/context refs + seven port slot bindings；`from_validated_refs`；immutable | 不保存 URL、credential、secret、provider body；不选供应商 |
| `AdapterAvailabilityMarker` | 保存一个 slot 的可用性判断 | infra adapter state | enabled/disabled/blocked/degraded 与 issue correlation | slot/binding/state/issue/observed_at；四 factory + `allows_positive_call` | 不改变 domain state；fake 不成为 production fallback |
| `ArchiveRuntimeAssembly` | 约束构建过程与暴露门禁 | infra runtime assembly state | validate、record marker、assemble、ready/fail | bindings/required slots/build state/marker set/issue；`begin` + transitions | 不保存 adapter instance/provider body；非 Ready 不暴露 facade |

### 11.3 Infra shared enum / value types

```rust
/// References a validated Archive runtime profile without embedding configuration.
pub struct ArchiveRuntimeProfileRef(pub String);

/// References one validated Archive infrastructure configuration document.
pub struct ArchiveInfraConfigRef(pub String);

/// References one validated local store binding.
pub struct ArchiveStoreBindingRef(pub String);

/// References one validated external or technical adapter binding.
pub struct ArchiveAdapterBindingRef(pub String);

/// References one redacted infrastructure validation or availability issue.
pub struct InfraIssueRef(pub String);

/// Identifies one required or optional Archive runtime capability slot.
pub enum ArchiveAdapterSlot {
    /// Provides the Archive local store and unit-of-work capabilities.
    Store,
    /// Provides Archive-controlled identifiers and observation time.
    ContextSource,
    /// Provides current formal admission and dispatch authority checks.
    Authority,
    /// Provides current formal read visibility and disclosure decisions.
    Visibility,
    /// Provides owner-specific snapshot or export capabilities.
    SourceExport(SourceClass),
    /// Provides formal integrity verification.
    Integrity,
    /// Provides target-specific compatibility assessment.
    Compatibility,
    /// Provides formal governance decision applicability.
    GovernanceDecision,
    /// Provides provider-neutral archive storage effects.
    ArchiveStorage,
    /// Provides one owner-specific restore receiver boundary.
    RestoreReceiver(RestoreOwnerRef),
    /// Maps one formally supported inbound source envelope family.
    InboundConsumer(ArchiveInboundFamily),
}

/// Identifies inbound mapping families independently from L1 source classifications.
pub enum ArchiveInboundFamily {
    /// Maps formally authorized archive trigger inputs.
    ArchiveTrigger,
    /// Maps owner export feedback for a fixed capture attempt.
    SourceExportFeedback,
    /// Maps formal governance decision change notifications.
    GovernanceDecisionChange,
    /// Maps infrastructure storage action feedback without pretending it is an L1 slice.
    StorageActionFeedback,
    /// Maps owner-specific restore receiver feedback.
    RestoreReceiverFeedback,
}

/// Preserves the distinction between store and adapter binding identities.
pub enum ArchiveRuntimeBindingRef {
    /// References the local store and unit-of-work binding.
    Store(ArchiveStoreBindingRef),
    /// References a context, external, or inbound adapter binding.
    Adapter(ArchiveAdapterBindingRef),
}

/// Binds one exact runtime capability slot to one validated adapter configuration.
pub struct ArchiveAdapterBinding {
    /// Identifies the exact capability slot.
    pub adapter_slot: ArchiveAdapterSlot,
    /// Identifies the validated adapter configuration.
    pub binding_ref: ArchiveAdapterBindingRef,
}

/// Stores validated adapter bindings with one binding per exact slot.
pub struct ArchiveAdapterBindingSet(pub Vec<ArchiveAdapterBinding>);

/// Stores exact runtime capability slots in stable unique order.
pub struct ArchiveAdapterSlotSet(pub Vec<ArchiveAdapterSlot>);

/// Records whether one runtime capability slot can be used safely.
pub enum AdapterAvailabilityState {
    /// The validated binding produced a usable port implementation.
    Enabled,
    /// An optional slot was explicitly disabled by validated configuration.
    DisabledByConfig,
    /// The adapter is usable only for operations that explicitly accept degradation.
    Degraded,
    /// A required contract, binding, capability, or validation prerequisite is unavailable.
    Blocked,
}

/// Records fail-closed runtime assembly progress.
pub enum ArchiveRuntimeBuildState {
    /// Assembly has not started.
    NotStarted,
    /// Binding and slot completeness are being validated.
    Validating,
    /// Capability-limited adapters and services are being assembled.
    Assembling,
    /// Every required safe capability is assembled for the exposed surface.
    Ready,
    /// Assembly failed and no usable facade may be exposed.
    Failed,
}

/// Stores one availability marker per exact runtime capability slot.
pub struct AdapterAvailabilityMarkerSet(pub Vec<AdapterAvailabilityMarker>);
```

| enum | variant 来源与允许去向 | 红线 |
|---|---|---|
| `ArchiveAdapterSlot` | 来自 Step 5 七 port family、local context source 和 inbound mapping；带载荷 variant 保存 exact source/owner | slot 不代表 adapter 已存在，不引入 sibling crate |
| `AdapterAvailabilityState` | factory 映射已校验 binding/probe；Enabled 可降为 Degraded/Blocked，恢复必须同 binding 重新验证 | missing/unknown 不能映射 Enabled；Disabled 只允许 optional slot |
| `ArchiveRuntimeBuildState` | NotStarted→Validating→Assembling→Ready；任一非终态→Failed | Failed/partial assembly 不 fallback Ready；Ready 不是产品 readiness |

所有 opaque infra ref 均为 non-empty、body-free 类型，提供 `try_new/as_str`；具体编码与 config key 留 Step 14。`ArchiveAdapterBinding::new(adapter_slot: ArchiveAdapterSlot, binding_ref: ArchiveAdapterBindingRef) -> InfraResult<Self>` 覆盖两个字段；三个 set 均提供 `try_from_iter/iter/len/is_empty`，按 exact slot identity 去重和稳定排序，其中 availability marker set 还拒绝同 slot 不同 binding 的并存项。SourceExport/RestoreReceiver 载荷为 exact source class/owner，InboundConsumer 载荷为五类 ArchiveInboundFamily；都不是动态 provider identity。

### 11.4 `ArchiveRuntimeBindings`

```rust
/// Holds only validated binding identities required to assemble Archive runtime capabilities.
pub struct ArchiveRuntimeBindings {
    /// Identifies the selected deployment profile.
    pub profile_ref: ArchiveRuntimeProfileRef,
    /// Identifies the validated infrastructure configuration.
    pub config_ref: ArchiveInfraConfigRef,
    /// Identifies the local Archive store binding.
    pub store_binding_ref: ArchiveStoreBindingRef,
    /// Identifies the ID and observation-time source binding.
    pub context_source_binding_ref: ArchiveAdapterBindingRef,
    /// Lists external and inbound capability bindings keyed by exact adapter slot.
    pub adapter_bindings: ArchiveAdapterBindingSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| profile/config | typed refs | 锁定一次 runtime assembly 的配置身份 | 正式 04 的 validated config loader；不含 config body |
| store | `ArchiveStoreBindingRef` | 唯一本地 store/UoW binding | 必填；backend/schema 未定时不能正向构造 production binding |
| context source | `ArchiveAdapterBindingRef` | ID/clock/result identity capability | 必填；不得用 random/time inline fallback |
| adapter bindings | ordered slot-binding set | 精确列出已配置 external/inbound slots | slot 唯一；requiredness 来 Step 7/14 registry；缺项保持 absent 而非 synthetic binding |

唯一 factory `pub fn from_validated_refs(profile_ref: ArchiveRuntimeProfileRef, config_ref: ArchiveInfraConfigRef, store_binding_ref: ArchiveStoreBindingRef, context_source_binding_ref: ArchiveAdapterBindingRef, adapter_bindings: ArchiveAdapterBindingSet) -> InfraResult<Self>` 覆盖全部字段，只验证形状、slot 唯一和同配置来源。成员 `pub fn binding_for(&self, slot: &ArchiveAdapterSlot) -> Option<ArchiveRuntimeBindingRef>` 返回精确类型：Store 来自 store_binding_ref，ContextSource 来自 context_source_binding_ref，其余从 adapter_bindings 查找；`pub fn has_binding(&self, slot: &ArchiveAdapterSlot) -> bool` 为纯函数。adapter_bindings 禁止 Store/ContextSource 重复项。是否 usable 只能看 availability marker。

### 11.5 `AdapterAvailabilityMarker`

```rust
/// Records a safe runtime availability decision for one exact adapter slot and binding.
pub struct AdapterAvailabilityMarker {
    /// Identifies the capability slot.
    pub adapter_slot: ArchiveAdapterSlot,
    /// Identifies the validated binding, when one exists.
    pub binding_ref: Option<ArchiveRuntimeBindingRef>,
    /// Records the conservative availability state.
    pub availability_state: AdapterAvailabilityState,
    /// Points to a redacted validation or availability issue when required.
    pub issue_ref: Option<InfraIssueRef>,
    /// Records when infra observed this state.
    pub observed_at: RecordedAt,
}
```

factory 与成员以以下完整签名为唯一契约；恢复必须重新核验同一 binding，不因 fake 响应而清除 blocker。

| 完整签名 | 初始化/副作用/约束 |
|---|---|
| `pub fn enabled(adapter_slot: ArchiveAdapterSlot, binding_ref: ArchiveRuntimeBindingRef, observed_at: RecordedAt) -> InfraResult<Self>` | Enabled、issue=None；validated binding 才可传入 |
| `pub fn disabled_by_config(adapter_slot: ArchiveAdapterSlot, binding_ref: Option<ArchiveRuntimeBindingRef>, optional_slots: &ArchiveAdapterSlotSet, issue_ref: InfraIssueRef, observed_at: RecordedAt) -> InfraResult<Self>` | 必须在正式 validated optional_slots 中；DisabledByConfig，issue Some |
| `pub fn degraded(adapter_slot: ArchiveAdapterSlot, binding_ref: ArchiveRuntimeBindingRef, issue_ref: InfraIssueRef, observed_at: RecordedAt) -> InfraResult<Self>` | Degraded，binding/issue Some；不允许任何正向 effect |
| `pub fn blocked(adapter_slot: ArchiveAdapterSlot, binding_ref: Option<ArchiveRuntimeBindingRef>, issue_ref: InfraIssueRef, observed_at: RecordedAt) -> InfraResult<Self>` | Blocked，issue Some；未知或缺失 binding 允许 None |
| `pub fn allows_positive_call(&self) -> bool` | 仅 Enabled 为 true；Degraded 只允许显式安全诊断/读面 |
| `pub fn matches(&self, slot: &ArchiveAdapterSlot, binding: &Option<ArchiveRuntimeBindingRef>) -> bool` | 比较 slot/binding；无 I/O |
| `pub fn mark_degraded(&mut self, issue_ref: InfraIssueRef, observed_at: RecordedAt) -> InfraResult<()>` | Enabled→Degraded；binding 必 Some，写 issue/time |
| `pub fn mark_blocked(&mut self, issue_ref: InfraIssueRef, observed_at: RecordedAt) -> InfraResult<()>` | Enabled/Degraded→Blocked；写 issue/time，不改绑定身份 |

Store slot 只接受 Store variant，其他 slot 只接受 Adapter variant；构造器拒绝不匹配。所有 marker mutation 接收新的本地观察时间；恢复不由 mark 方法清空 issue，而是正式重新验证后构造 replacement marker。optional_slots 来源为 validated config registry，不能在 caller 临时把 required slot 标 optional。

### 11.6 `ArchiveRuntimeAssembly`

```rust
/// Tracks fail-closed runtime assembly without retaining adapter instances or secrets.
pub struct ArchiveRuntimeAssembly {
    /// Freezes the exact validated profile, configuration, and binding identities.
    pub bindings: ArchiveRuntimeBindings,
    /// Freezes the non-empty required capability set for this exposed surface.
    pub required_slots: ArchiveAdapterSlotSet,
    /// Records assembly progress.
    pub build_state: ArchiveRuntimeBuildState,
    /// Lists one availability marker per declared slot.
    pub adapter_markers: AdapterAvailabilityMarkerSet,
    /// Points to a redacted terminal assembly issue when failed.
    pub failure_ref: Option<InfraIssueRef>,
}
```

完整函数表为唯一契约；required_slots 在 begin 时冻结，后续不得缩减或替换，缺任一 required Enabled marker 即阻断装配。

| 完整签名 | 约束 / 字段来源 |
|---|---|
| `pub fn begin(bindings: ArchiveRuntimeBindings, required_slots: ArchiveAdapterSlotSet) -> InfraResult<Self>` | 保存 bindings/required_slots；集合非空且含 Store/ContextSource；初始化 NotStarted、markers 空、failure None |
| `pub fn start_validation(&mut self) -> InfraResult<()>` | NotStarted→Validating |
| `pub fn record_adapter(&mut self, marker: AdapterAvailabilityMarker) -> InfraResult<()>` | Validating/Assembling；marker.binding_ref 须等于 bindings.binding_for(slot)，缺 binding 只能 Blocked/显式 optional Disabled；exact slot 唯一，拒绝覆盖 |
| `pub fn start_assembly(&mut self) -> InfraResult<()>` | Validating→Assembling；required slots 全部 Enabled，空集拒绝 |
| `pub fn mark_ready(&mut self) -> InfraResult<()>` | Assembling→Ready；同一 required set，所有 required Enabled；不允许 Degraded 满足正向能力 |
| `pub fn fail(&mut self, issue_ref: InfraIssueRef) -> InfraResult<()>` | 非 Ready/Failed→Failed；保存 failure_ref |
| `pub fn can_expose_facade(&self) -> bool` | 仅 Ready；pure |

required_slots 必须由 bindings 内同 profile/config 的正式 registry 提供；构建函数不能临时削减集合。runtime assembly 本身无 time 字段，其 methods 不偷偷记录时间；adapter markers 各自保存观察时间。实例构造/能力释放仍由 Step 7/14 承接，禁止 marker-only Ready 代替真实 handle construction。

Ready 只说明当前暴露 surface 的本地构造门禁通过，不证明 upstream contract、provider SLA、archive/restore 成功或系统 readiness。实例 ownership/lifetime、async construction、health probe trait、factory signatures 和 concrete application facade type由 Step 7/14 闭合。

#### infra 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `ArchiveAdapterSlot` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Store` | `Provides the Archive local store and unit-of-work capabilities.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `ContextSource` | `Provides Archive-controlled identifiers and observation time.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `Authority` | `Provides current formal admission and dispatch authority checks.` | validated runtime registry + formal owner authority | required slot；不解释决定 |
| `Visibility` | `Provides current formal read visibility and disclosure decisions.` | validated runtime registry + current disclosure contract | Query required slot；不缓存权限 |
| `SourceExport(SourceClass)` | `Provides owner-specific snapshot or export capabilities.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `Integrity` | `Provides formal integrity verification.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `Compatibility` | `Provides target-specific compatibility assessment.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `GovernanceDecision` | `Provides formal governance decision applicability.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `ArchiveStorage` | `Provides provider-neutral archive storage effects.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `RestoreReceiver(RestoreOwnerRef)` | `Provides one owner-specific restore receiver boundary.` | validated runtime registry + Step 5 capability owner | typed binding/marker/assembly；不等真实 adapter 已有 |
| `InboundConsumer(ArchiveInboundFamily)` | `Maps one formally supported inbound source envelope family.` | validated runtime registry + exact inbound contract | 不把 storage feedback producer 当 L1 SourceClass |

##### `ArchiveInboundFamily` variant 表

| 变体 | 来源 | 消费约束 |
|---|---|---|
| ArchiveTrigger | formal trigger family | only E01；不绕过 admission |
| SourceExportFeedback | owner export family | only E02；匹配 attempt/fence |
| GovernanceDecisionChange | governance family | only E03；current check，不解释政策 |
| StorageActionFeedback | storage capability family | only E04；不伪装 L1 source |
| RestoreReceiverFeedback | owner receiver family | only E05；per-owner commit correlation |

##### `ArchiveRuntimeBindingRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Store(ArchiveStoreBindingRef)` | `References the local store and unit-of-work binding.` | validated store 或 adapter binding identity | RuntimeBindings/AvailabilityMarker；Store 类型不强转 Adapter |
| `Adapter(ArchiveAdapterBindingRef)` | `References a context, external, or inbound adapter binding.` | validated store 或 adapter binding identity | RuntimeBindings/AvailabilityMarker；Store 类型不强转 Adapter |

##### `AdapterAvailabilityState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Enabled` | `The validated binding produced a usable port implementation.` | 同 binding 正式验证和 handle construction | Degraded/Blocked |
| `DisabledByConfig` | `An optional slot was explicitly disabled by validated configuration.` | validated optional slot 显式关闭 | immutable marker；重开需重新验证并新建 |
| `Degraded` | `The adapter is usable only for operations that explicitly accept degradation.` | degraded factory 或 Enabled 降级 | Blocked；不允许正向 effect |
| `Blocked` | `A required contract, binding, capability, or validation prerequisite is unavailable.` | 缺合同/binding/能力；Enabled/Degraded 降级 | 新验证后构造 replacement；不直接清除 issue |

##### `ArchiveRuntimeBuildState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `NotStarted` | `Assembly has not started.` | begin 冻结 bindings/required_slots | Validating/Failed |
| `Validating` | `Binding and slot completeness are being validated.` | NotStarted | Assembling/Failed |
| `Assembling` | `Capability-limited adapters and services are being assembled.` | required 全 Enabled | Ready/Failed |
| `Ready` | `Every required safe capability is assembled for the exposed surface.` | required exact coverage + 真实 handle 构造 | 当前 assembly 终态；不等产品 readiness |
| `Failed` | `Assembly failed and no usable facade may be exposed.` | 任一非 Ready/Failed 构建失败 | 当前 assembly 终态；新配置新构建 |


### 11.7 Infra 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability/object | pass | binding、availability、assembly 各有唯一稳定对象；不把 adapter 本身伪装 truth |
| field source | pass_with_blockers | 所有 positive binding/marker 必须来自 validated config/contract；unknown 保持 Blocked |
| provider/config | pass | 未写 URL、secret、backend、算法、tier、timeout 或产品名 |
| dependency direction | pass | infra 只实现 application port；不反向定义 domain state，不依赖 api/worker |
| readiness | pass | Ready 仅 runtime construction state，不声称业务/产品 readiness |
| 后续承接 | pass_with_blockers | Step 7 exact adapter/factory/port，Step 11 store/UoW，Step 14 config/required slot；`AR-UP-*` 不变 |

## 12. `api` Command / Query entry 与 disposition 契约

### 12.1 API capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| command entry validation | trusted actor/Command metadata + one of 3 typed command inputs | capability-limited command entry | 无业务副作用；仅 shape/channel validation | `ArchiveCommandEntry<C>` | Step 8 DTO；Step 9 handler flow |
| query entry validation | trusted actor/Query metadata + one of 5 selectors | capability-limited query entry | no-write | `ArchiveQueryEntry<Q>` | Step 8 DTO；Step 9 handler flow |
| safe handler classification | application result / safe visibility / redacted issue | transport-neutral disposition | 无 domain 状态 | `ApiEntryDisposition` | Step 8 response；Step 12 error mapping |

### 12.2 功能到对象与对象能力映射

| 对象 | 承接功能 | 类别 | 对象能力 | 必需字段 / factory / state | 禁止事项 |
|---|---|---|---|---|---|
| `ArchiveCommandEntry<C>` | 三个同步 write admission/intent 入口 | generic entry value | 固定 command kind、context 与 typed input | kind/context/input；`from_validated_request`；immutable | 不认证主体、不直接写 store/provider、不等待后台完成 |
| `ArchiveQueryEntry<Q>` | 五个同步 no-write 入口 | generic entry value | 固定 query kind、context 与 typed selector | kind/context/selector；`from_validated_request`；immutable | 不 capture/verify/retrieve/repair/handoff/cache write |
| `ApiEntryDisposition` | 统一 handler 结果分类 | technical result enum | 区分 accepted、visible、blocked、rejected、not-available、degraded | variant factory；immutable | 不当 domain state，不泄露 hidden/absent 区别，不固定 HTTP/RPC status |

### 12.3 API shared enum / value types

```rust
/// Names the three supported synchronous Archive commands.
pub enum ArchiveCommandKind {
    /// Requests local admission of one immutable archive scope.
    RequestArchive,
    /// Requests local admission of one explicit restore target set.
    RequestRestore,
    /// Requests one governance-bound lifecycle execution intent.
    RequestLifecycleExecution,
}

/// Names the five supported no-write Archive queries.
pub enum ArchiveQueryKind {
    /// Reads one Archive job and its conservative component postures.
    GetArchiveJobStatus,
    /// Reads one authorized Bundle revision view.
    GetArchiveBundle,
    /// Reads already committed verification results without starting verification.
    VerifyArchiveBundle,
    /// Reads one immutable restore plan revision.
    GetRestorePlan,
    /// Reads one owner-specific restore handoff history.
    GetRestoreHandoffStatus,
}

/// References a redacted API validation, authorization, or mapping issue.
pub struct ApiIssueRef(pub String);

/// Classifies a transport-neutral API handler result.
pub enum ApiEntryDisposition {
    /// A command returned a committed local application result surface.
    CommandAccepted(ArchiveApplicationResultRef),
    /// A query produced an authorized safe view surface.
    QueryVisible,
    /// A required authority or capability prerequisite could not be proved.
    Blocked(ApiIssueRef),
    /// The request failed a definite safe validation or authorization rule.
    Rejected(ApiIssueRef),
    /// The API hides whether the selected target is absent or not visible.
    NotAvailable(SafeNotAvailable),
    /// An authorized query surface is available with an explicit degraded marker.
    Degraded(ApiIssueRef),
}
```

| enum | variant 来源 / 允许去向 | 红线 |
|---|---|---|
| `ArchiveCommandKind` | Step 5 三 Command registry；只进 command entry/application operation name mapping | 不增加运维、purge、restore-direct-write command |
| `ArchiveQueryKind` | Step 5 五 Query registry；只进 query entry/read service | `VerifyArchiveBundle` 只读既有 assessment，不触发 capability |
| `ApiEntryDisposition` | pre-application validation 或 application safe result；随后由 Step 8/12 response mapper 使用 | Accepted 不等 archive/restore完成；NotAvailable 无 reason；不编码 transport status |

`ApiIssueRef` 是 non-empty、body-free、可披露引用，只能来自 safe validation/error mapper；不得包含 request body、actor secret、hidden target、provider response 或 stack trace。`CommandAccepted` 的 payload 必须来自 committed/stored application result；`QueryVisible` 的 safe payload 与 `Degraded` 的 safe view 由 Step 8 response DTO 组合，不塞进 disposition 形成第二份 view schema。

#### api 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `ArchiveCommandKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `RequestArchive` | `Requests local admission of one immutable archive scope.` | 静态三 Command registry | ArchiveCommandEntry/concrete application handler |
| `RequestRestore` | `Requests local admission of one explicit restore target set.` | 静态三 Command registry | ArchiveCommandEntry/concrete application handler |
| `RequestLifecycleExecution` | `Requests one governance-bound lifecycle execution intent.` | 静态三 Command registry | ArchiveCommandEntry/concrete application handler |

##### `ArchiveQueryKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `GetArchiveJobStatus` | `Reads one Archive job and its conservative component postures.` | 静态五 Query registry | ArchiveQueryEntry/ArchiveQueryService；无写副作用 |
| `GetArchiveBundle` | `Reads one authorized Bundle revision view.` | 静态五 Query registry | ArchiveQueryEntry/ArchiveQueryService；无写副作用 |
| `VerifyArchiveBundle` | `Reads already committed verification results without starting verification.` | 静态五 Query registry | ArchiveQueryEntry/ArchiveQueryService；无写副作用 |
| `GetRestorePlan` | `Reads one immutable restore plan revision.` | 静态五 Query registry | ArchiveQueryEntry/ArchiveQueryService；无写副作用 |
| `GetRestoreHandoffStatus` | `Reads one owner-specific restore handoff history.` | 静态五 Query registry | ArchiveQueryEntry/ArchiveQueryService；无写副作用 |

##### `ApiEntryDisposition` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `CommandAccepted(ArchiveApplicationResultRef)` | `A command returned a committed local application result surface.` | safe application result/visibility/error mapping | transport-neutral response；不提升业务状态 |
| `QueryVisible` | `A query produced an authorized safe view surface.` | safe application result/visibility/error mapping | transport-neutral response；不提升业务状态 |
| `Blocked(ApiIssueRef)` | `A required authority or capability prerequisite could not be proved.` | safe application result/visibility/error mapping | transport-neutral response；不提升业务状态；fail-closed |
| `Rejected(ApiIssueRef)` | `The request failed a definite safe validation or authorization rule.` | safe application result/visibility/error mapping | transport-neutral response；不提升业务状态 |
| `NotAvailable(SafeNotAvailable)` | `The API hides whether the selected target is absent or not visible.` | safe application result/visibility/error mapping | transport-neutral response；不提升业务状态 |
| `Degraded(ApiIssueRef)` | `An authorized query surface is available with an explicit degraded marker.` | safe application result/visibility/error mapping | transport-neutral response；不提升业务状态 |


### 12.4 `ArchiveCommandEntry<C>`

```rust
/// Carries one validated typed command into a capability-limited Archive application handler.
pub struct ArchiveCommandEntry<C> {
    /// Identifies the supported command.
    pub command_kind: ArchiveCommandKind,
    /// Carries command-channel operation metadata and actor context.
    pub operation_context: ArchiveOperationContext,
    /// Carries the Step 8 typed command input.
    pub input: C,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| kind | static 3-command handler registry；必须与 context operation name 一一对应 |
| context | `ArchiveOperationContext::from_command`；channel=Command、CommandMetadata/key 完整 |
| input | Step 8 `RequestArchiveInput` / `RequestRestoreInput` / `RequestLifecycleExecutionInput` 之一；generic type由 concrete handler 固定 |

唯一 factory `pub fn from_validated_request(command_kind: ArchiveCommandKind, operation_context: ArchiveOperationContext, input: C) -> ApiResult<Self>` 覆盖全部字段并执行 channel/name/type registry shape 检查。成员 `pub fn operation_name(&self) -> &ArchiveOperationName`、`pub fn context(&self) -> &ArchiveOperationContext`、`pub fn into_input(self) -> C` 不产生副作用。API 不自行计算 authority、ID、time、digest 或结果；这些分别由正式 input mapping/application capability 提供。

### 12.5 `ArchiveQueryEntry<Q>`

```rust
/// Carries one validated typed selector into the no-write Archive query service.
pub struct ArchiveQueryEntry<Q> {
    /// Identifies the supported no-write query.
    pub query_kind: ArchiveQueryKind,
    /// Carries query-channel operation metadata and actor context.
    pub operation_context: ArchiveOperationContext,
    /// Carries the Step 8 typed query selector.
    pub selector: Q,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| kind | static 5-query handler registry；必须与 context operation name 一一对应 |
| context | `ArchiveOperationContext::from_query`；channel=Query、QueryMetadata 完整、idempotency=None |
| selector | Step 8 对应 typed selector；只能定位 Archive-owned read subject，不承载外部 body |

唯一 factory `pub fn from_validated_request(query_kind: ArchiveQueryKind, operation_context: ArchiveOperationContext, selector: Q) -> ApiResult<Self>` 必须调用 `assert_query_no_write()`；成员 `pub fn subject_kind(&self) -> ArchiveQueryKind`、`pub fn context(&self) -> &ArchiveOperationContext`、`pub fn into_selector(self) -> Q` 为纯函数。该 generic entry 的 concrete `Q -> ArchiveReadSubjectRef` 映射在 Step 8 闭合；映射缺失时 handler 不允许实现。

### 12.6 `ApiEntryDisposition` factory 与模块停审

| 完整 factory / 成员签名 | 作用 / 来源 |
|---|---|
| `pub fn command_accepted(result_ref: ArchiveApplicationResultRef) -> Self` | CommandAccepted；application 已提交 stored result |
| `pub fn query_visible() -> Self` | QueryVisible；Query service 已校验 visibility 并提供 safe view |
| `pub fn blocked(issue_ref: ApiIssueRef) -> Self` | Blocked；safe mapper 映射的前提缺失 |
| `pub fn rejected(issue_ref: ApiIssueRef) -> Self` | Rejected；safe mapper 映射的确定拒绝 |
| `pub fn not_available() -> Self` | NotAvailable；hidden/absent 统一且无 payload |
| `pub fn degraded(issue_ref: ApiIssueRef) -> Self` | Degraded；只读降级，可披露 issue |
| `pub fn is_success_surface(&self) -> bool` | 仅 CommandAccepted/QueryVisible/Degraded 为 true；不证明业务成功 |
| `pub fn reveals_target_existence(&self) -> bool` | 仅 QueryVisible/Degraded 为 true；CommandAccepted 只确认本地请求，不确认任意外部 target |

每个 factory 只构造同名 variant。具体 response body、error code 和 transport status 留 Step 8/12/14。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| command/query denominator | pass | 3 Command + 5 Query 枚举完整且与 Step 5 唯一 handler owner 对齐 |
| capability isolation | pass | command/query generic entry 由 concrete handler 固定；Query context 无写 key/capability |
| safe disposition | pass | hidden/absent 统一 NotAvailable；blocked/rejected/degraded 只带 redacted ref |
| transport/auth | pass_at_step_6 | 不选择 route/framework/status；API 不成为 identity/authorization truth owner |
| 后续承接 | pass | Step 8 闭合 concrete C/Q、response；Step 9 flow；Step 12 mapping；Step 14 transport binding |

## 13. `worker` claim、checkpoint、entry 与 item disposition 契约

Step07 definition-owner 修正：本节为保留对象阅读链继续展示原 schema；WorkerEntryRef、WorkerClaimId、WorkerCheckpointId、WorkerLeaseRef、WorkerLeaseExpiresAt、WorkerFenceToken、WorkerCheckpointSequence、WorkerTargetRef、WorkerClaimState、WorkerClaim、WorkerCheckpoint 的唯一定义文件为 `crates/application/src/worker_control.rs`，不是 worker。它们的 factory/error 采用 application `ArchiveSupportError`；WorkerEntryKind/ArchiveConsumerKind/ArchiveOperationJobKind/WorkerEntryState/WorkerIssueRef/ArchiveWorkerEntry/WorkerItemDisposition 仍属于 worker。没有复制两份同名类型。

### 13.1 Worker capability / 功能清单

| capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| exclusive bounded claim | persisted candidate + lease/fence authority | exact target claim | worker-local technical state；不改业务 truth | `WorkerClaim` | Step 7 claim repository；Step 13 concurrency |
| durable checkpoint | active claim + completed bounded step + committed result ref | next resume position | local checkpoint write | `WorkerCheckpoint` | Step 7 repository；Step 9/11/13 |
| consumer/job entry | 5 consumer or 17 job registry + validated context/input + optional claim | capability-limited application dispatch shell | entry lifecycle only | `ArchiveWorkerEntry<I>` | Step 8 DTO；Step 9 runner flow |
| per-item disposition | stored application result / safe validation / lease or dependency issue | accepted/duplicate/delayed/rejected/unsupported/stale-claim result | no direct truth mutation | `WorkerItemDisposition` | Step 8 report/receipt；Step 12/13 |

### 13.2 功能到对象与对象能力映射

| 对象 | 承接功能 | 类别 | 对象能力 | 必需字段 / factory / state | 禁止事项 |
|---|---|---|---|---|---|
| `WorkerClaim` | 锁定一个 persisted bounded target | technical lease/fence value | exact target/fence/holder match、expiry observation | claim/entry/target/fence/lease ref/time/state；`acquired` | 不当 domain version，不从本地时钟猜远端 commit，不跨 target 复用 |
| `WorkerCheckpoint` | 保存已提交的有界恢复位置 | immutable checkpoint | claim/fence/result correlation、monotonic sequence | checkpoint/entry/target/fence/sequence/result/time；`from_staged_result` | 同 Tx staged；commit 前不对外作为成功 |
| `ArchiveWorkerEntry<I>` | 统一 5 Consumer 与 17 Job 调度壳 | generic entry value | registry match、context/claim guard、lifecycle | entry ref/kind/context/input/claim/state；consumer/job factory | 不直达 domain/store adapter；不将 22 logical entries变成 22 process |
| `WorkerItemDisposition` | 保存单 item 技术处置 | enum | exact safe result/issue classification | 7 variants + factories | 不代表 Bus ack/schedule commit/domain truth；duplicate 不重跑 |

### 13.3 Worker shared enum / value types

```rust
/// Identifies one configured worker entry within the Archive worker process.
pub struct WorkerEntryRef(pub String);

/// Identifies one persisted worker claim.
pub struct WorkerClaimId(pub String);

/// Identifies one persisted worker checkpoint.
pub struct WorkerCheckpointId(pub String);

/// Carries an opaque lease identity issued by the claim capability.
pub struct WorkerLeaseRef(pub String);

/// Carries the authoritative lease deadline in the claim repository's clock domain.
pub struct WorkerLeaseExpiresAt(pub archive_contracts::context::core_shared::metadata::Timestamp);

/// Carries a fencing token that is scoped to one claim target and repository.
pub struct WorkerFenceToken(pub String);

/// Carries a positive checkpoint ordinal scoped to one worker entry and target.
pub struct WorkerCheckpointSequence(pub u64);

/// References a redacted worker validation, dependency, lease, or mapping issue.
pub struct WorkerIssueRef(pub String);

/// Identifies the persisted Archive target selected for bounded work.
pub enum WorkerTargetRef {
    /// Selects an admitted Archive job for bounded coordination.
    Job(ArchiveJobRef),
    /// Selects one existing source binding before a capture attempt is created.
    SourceBinding(SourceBindingRef),
    /// Selects the exact persisted storage or lifecycle action to reconcile.
    ExternalAction(ExternalActionRecordRef),
    /// Selects one fixed source capture attempt.
    CaptureAttempt(CaptureAttemptRef),
    /// Selects one immutable Bundle revision.
    Bundle(BundleRevisionRef),
    /// Selects one integrity or compatibility assessment.
    Assessment(AssessmentRef),
    /// Selects one storage placement.
    Placement(ArchivePlacementRef),
    /// Selects one governance-bound lifecycle execution.
    Lifecycle(LifecycleExecutionRef),
    /// Selects one immutable restore plan.
    RestorePlan(RestorePlanRef),
    /// Selects one owner-specific restore item.
    RestoreItem(RestoreItemRef),
    /// Selects one receiver handoff.
    RestoreHandoff(RestoreHandoffRef),
    /// Selects one authorized restore compensation.
    Compensation(CompensationRecordRef),
    /// Selects one trusted inbound event for consumer dispatch.
    InboundEvent(ExternalEventRef),
}

/// Classifies one of the two worker entry families.
pub enum WorkerEntryKind {
    /// Dispatches one of five validated inbound consumer inputs.
    Consumer(ArchiveConsumerKind),
    /// Advances one of seventeen bounded Archive operations jobs.
    Operation(ArchiveOperationJobKind),
}

/// Names the five supported inbound consumer operations.
pub enum ArchiveConsumerKind {
    /// Consumes a formal archive trigger candidate.
    ConsumeArchiveTrigger,
    /// Consumes owner-mapped source export feedback.
    ConsumeSourceExportFeedback,
    /// Consumes a formal governance decision change.
    ConsumeGovernanceDecisionChange,
    /// Consumes storage action feedback for a persisted action owner.
    ConsumeStorageActionFeedback,
    /// Consumes one owner-specific restore receiver observation.
    ConsumeRestoreReceiverFeedback,
}

/// Names the seventeen bounded Archive operations jobs.
pub enum ArchiveOperationJobKind {
    /// Advances one Archive or restore coordination job.
    AdvanceArchiveJob,
    /// Expands a frozen archive scope into source bindings.
    PlanArchiveSources,
    /// Advances one fixed source capture attempt.
    CaptureArchiveSource,
    /// Reconciles one exact source capture attempt.
    ReconcileSourceCapture,
    /// Assembles one immutable Bundle manifest revision.
    AssembleBundleManifest,
    /// Applies fixed-input seal guards to one Bundle revision.
    SealArchiveBundle,
    /// Assesses integrity for one fixed Bundle input.
    AssessBundleIntegrity,
    /// Assesses compatibility for one exact target context.
    AssessBundleCompatibility,
    /// Places one fixed Bundle revision through a persisted intent.
    PlaceArchiveBundle,
    /// Retrieves one fixed Bundle revision through a persisted intent.
    RetrieveArchiveBundle,
    /// Executes one formally authorized lifecycle action.
    ExecuteArchiveLifecycle,
    /// Reconciles one ambiguous persisted external action.
    ReconcileExternalAction,
    /// Builds one immutable per-owner restore plan revision.
    BuildRestorePlan,
    /// Prepares minimal material for one owner-specific restore item.
    PrepareRestoreMaterial,
    /// Dispatches one persisted owner-specific restore handoff.
    DispatchRestoreHandoff,
    /// Reconciles one ambiguous owner-specific restore handoff.
    ReconcileRestoreHandoff,
    /// Executes one formally authorized restore compensation.
    ExecuteRestoreCompensation,
}

/// Records the runtime lifecycle of one worker entry shell.
pub enum WorkerEntryState {
    /// The entry is registered but has not begun one item.
    Registered,
    /// The entry is processing one bounded item.
    Running,
    /// The entry is waiting for an explicitly later retry or dependency recovery.
    Delayed,
    /// The current bounded item completed with a persisted result.
    Completed,
    /// The entry stopped due to shutdown or validated configuration.
    Stopped,
    /// The entry failed and cannot continue without a controlled recovery action.
    Failed,
}

/// Records the lifecycle of one persisted worker claim.
pub enum WorkerClaimState {
    /// A claim capability granted the exact target and fence.
    Active,
    /// The holder released the claim after checkpoint or safe abandonment.
    Released,
    /// The claim is no longer valid at the current observation time.
    Expired,
    /// A newer fence made this claim stale.
    Superseded,
}
```

| enum | variant 来源 / 允许去向 | 红线 |
|---|---|---|
| `WorkerTargetRef` | selector/repository 返回的 persisted typed ref；载荷只定位 exact bounded subject | 不携带 body，不把 Bundle ID 当 revision，不按字符串猜 owner |
| `WorkerEntryKind` | 5 Consumer + 17 Job static registry；载荷是 exact logical operation kind | 不创建 jobs crate/process；未知 kind 必须 Unsupported |
| `WorkerEntryState` | Registered→Running→Completed/Delayed/Failed；Registered/Delayed→Stopped，Delayed→Running | entry state 不改变 domain truth；shutdown 不等 rollback |
| `WorkerClaimState` | acquired=Active；Active→Released/Expired/Superseded | Expired/Superseded 不再允许 application call/checkpoint |

`ArchiveConsumerKind` 与 `ArchiveOperationJobKind` 的变体严格为 Step 5 §7.7 列表，后者按 `1+3+2+2+4+5` 六组定义；每个 variant 的英文 Rustdoc 直接说明唯一用例，不允许 generic `Other`。所有 worker opaque ref non-empty；checkpoint sequence 必须大于 0，具体 lease duration、fence encoding、schedule 和 backoff 不在本步定义。

### 13.4 `WorkerClaim`

```rust
/// Pins one worker holder and fencing token to one persisted bounded-work target.
pub struct WorkerClaim {
    /// Identifies the persisted claim.
    pub claim_id: WorkerClaimId,
    /// Identifies the configured worker entry.
    pub entry_ref: WorkerEntryRef,
    /// Identifies the exact bounded-work target.
    pub target_ref: WorkerTargetRef,
    /// Identifies the claim holder without granting business authority.
    pub holder_ref: archive_contracts::context::core_shared::actor::ActorRef,
    /// Carries the repository-scoped lease identity.
    pub lease_ref: WorkerLeaseRef,
    /// Carries the exact fencing token required for protected writes.
    pub fence_token: WorkerFenceToken,
    /// Records when the claim was observed as acquired.
    pub acquired_at: RecordedAt,
    /// Carries the formal deadline issued by the claim capability.
    pub expires_at: WorkerLeaseExpiresAt,
    /// Records the local claim lifecycle.
    pub claim_state: WorkerClaimState,
}
```

以下完整函数表为唯一构造和迁移契约；technical 状态不提供任何上游业务授权，entry 不持有 repository/adapter handle。

| 完整签名 | 约束 / 来源 |
|---|---|
| `pub fn acquired(claim_id: WorkerClaimId, entry_ref: WorkerEntryRef, target_ref: WorkerTargetRef, holder_ref: archive_contracts::context::core_shared::actor::ActorRef, lease_ref: WorkerLeaseRef, fence_token: WorkerFenceToken, acquired_at: RecordedAt, expires_at: WorkerLeaseExpiresAt) -> Result<Self, ArchiveSupportError>` | repository 成功 claim 返回所有字段；expiry 在同一 repository clock domain 晚于 acquired，初始 Active |
| `pub fn matches(&self, entry: &WorkerEntryRef, target: &WorkerTargetRef, fence: &WorkerFenceToken) -> bool` | 三项 exact match；不解析 fence 字符串比较大小 |
| `pub fn assert_active(&self, observed_at: RecordedAt) -> Result<(), ArchiveSupportError>` | state Active 且同 repository clock 的 observed_at < expiry；这只是本地 guard，不能替代服务提交时 CAS/fence |
| `pub fn release(&mut self) -> Result<(), ArchiveSupportError>` | Active→Released；只在 application claim seam 确认释放后映射 |
| `pub fn expire(&mut self, observed_at: RecordedAt) -> Result<(), ArchiveSupportError>` | Active 且 observed_at >= expiry→Expired |
| `pub fn supersede(&mut self, new_fence: WorkerFenceToken) -> Result<(), ArchiveSupportError>` | application claim seam 证明 same target 新 fence 后 Active→Superseded；旧 fence 不改为新 fence |

`WorkerLeaseExpiresAt::from_repository(value: archive_contracts::context::core_shared::metadata::Timestamp) -> Self` 与 `as_timestamp(&self) -> &archive_contracts::context::core_shared::metadata::Timestamp` 只包装正式 deadline。租约期限算法/时钟同步/renew 在 Step 7/13/14；本机 wall clock 不可自行构造延期或宣告远端效果失败。acquired_at 是获取观察，不随 release/expire/supersede 更新。

### 13.5 `WorkerCheckpoint`

```rust
/// Stages an immutable resume point whose visibility requires an atomic result commit.
pub struct WorkerCheckpoint {
    /// Identifies the checkpoint.
    pub checkpoint_id: WorkerCheckpointId,
    /// Identifies the worker entry.
    pub entry_ref: WorkerEntryRef,
    /// Identifies the exact processed target.
    pub target_ref: WorkerTargetRef,
    /// Pins the claim used for the protected write.
    pub claim_id: WorkerClaimId,
    /// Pins the fencing token accepted by the repository.
    pub fence_token: WorkerFenceToken,
    /// Carries a positive monotonic ordinal for this entry and target.
    pub sequence: WorkerCheckpointSequence,
    /// Points to the immutable stored application result.
    pub result_ref: ArchiveApplicationResultRef,
    /// Records when the local result and checkpoint were committed.
    pub committed_at: RecordedAt,
}
```

以下完整函数表为唯一构造和迁移契约；technical 状态不提供任何上游业务授权，entry 不持有 repository/adapter handle。

| 完整签名 | 约束 |
|---|---|
| `pub fn from_staged_result(checkpoint_id: WorkerCheckpointId, claim: &WorkerClaim, operation_name: &ArchiveOperationName, sequence: WorkerCheckpointSequence, result_ref: ArchiveApplicationResultRef, committed_at: RecordedAt) -> Result<Self, ArchiveSupportError>` | result_ref.operation_name 必须匹配 explicit operation_name，claim_state=Active；其余字段从 claim 拷贝；不将 application 时间当 lease clock，repository 在 commit 重验 lease/fence 并保证 result/checkpoint 原子可读 |
| `pub fn can_resume(&self, entry: &WorkerEntryRef, target: &WorkerTargetRef) -> bool` | exact equality；允许读恢复位置，不授权使用旧 claim |
| `pub fn matches_claim(&self, claim: &WorkerClaim) -> bool` | 比较 claim ID、entry、target、fence |

factory 只为同一 Tx 中已 staged 的完整 result 构造 checkpoint，不能证明底层提交；checkpoint/result 必须一起 commit 后才对外可见，commit-unknown 不得仅凭该值生成成功报告。committed_at 是提交观察输入而非数据库 commit LSN/时刻证明。新 worker 先取新 claim 再恢复，不复用 checkpoint 内的旧 lease/fence。

### 13.6 `ArchiveWorkerEntry<I>`

```rust
/// Carries one validated consumer or operations-job input through a bounded worker entry.
pub struct ArchiveWorkerEntry<I> {
    /// Identifies the configured entry.
    pub entry_ref: WorkerEntryRef,
    /// Identifies the exact logical consumer or job.
    pub entry_kind: WorkerEntryKind,
    /// Carries validated event or job operation context.
    pub operation_context: ArchiveOperationContext,
    /// Carries the Step 8 typed consumer or job input.
    pub input: I,
    /// Carries the exact active claim for jobs that mutate or dispatch effects.
    pub claim: Option<WorkerClaim>,
    /// Records the entry lifecycle.
    pub entry_state: WorkerEntryState,
    /// Carries a redacted issue only for delayed or failed state.
    pub issue_ref: Option<WorkerIssueRef>,
}
```

以下完整函数表为唯一构造和迁移契约；technical 状态不提供任何上游业务授权，entry 不持有 repository/adapter handle。

| 完整签名 | 约束 / 副作用 |
|---|---|
| `pub fn from_consumer(entry_ref: WorkerEntryRef, consumer_kind: ArchiveConsumerKind, context: ArchiveOperationContext, input: I) -> WorkerResult<Self>` | InboundEvent + corresponding operation name；claim=None、Registered、issue=None |
| `pub fn from_operation(entry_ref: WorkerEntryRef, job_kind: ArchiveOperationJobKind, context: ArchiveOperationContext, input: I, claim: WorkerClaim) -> WorkerResult<Self>` | OperationJob，name/kind/entry 匹配；claim 必须与 context.worker_claim 全等；target 与 I 的映射须 Step 8 typed registry |
| `pub fn start(&mut self, observed_at: RecordedAt) -> WorkerResult<()>` | Registered/Delayed→Running；带 claim 则 assert_active；清除本次 delay issue；无时间字段写入 |
| `pub fn complete(&mut self, result_ref: ArchiveApplicationResultRef) -> WorkerResult<()>` | Running→Completed；result operation 匹配；result 只校验引用，持久 owner=stored result + checkpoint，不在 entry 另存结果 |
| `pub fn delay(&mut self, issue_ref: WorkerIssueRef) -> WorkerResult<()>` | Registered/Running→Delayed，保存 issue |
| `pub fn fail(&mut self, issue_ref: WorkerIssueRef) -> WorkerResult<()>` | Registered/Running/Delayed→Failed，保存 issue |
| `pub fn stop(&mut self) -> WorkerResult<()>` | Registered/Running/Delayed→Stopped；不得改变 external effect 状态 |

delay 后旧 claim 已失效时禁止 start；必须先通过 application 获取新 claim 并构造新的 entry，旧 entry 保留技术处置。entry 对输入 I 的类型限定由 Step 8 闭合，未有正式映射前不能以泛型任意值运行。

### 13.7 `WorkerItemDisposition`

```rust
/// Classifies one bounded worker item result without claiming transport or schedule completion.
pub enum WorkerItemDisposition {
    /// Application committed a stable result for this exact entry and input.
    Accepted(ArchiveApplicationResultRef),
    /// Idempotency replay returned the exact previously stored result.
    Duplicate(ArchiveApplicationResultRef),
    /// A temporary dependency, lease, or backoff condition requires a later attempt.
    Delayed(WorkerIssueRef),
    /// Safe validation or authorization definitively rejected the item.
    Rejected(WorkerIssueRef),
    /// The input schema or logical operation kind is not formally supported.
    Unsupported(WorkerIssueRef),
    /// The claim fence is stale and this worker must not commit or dispatch.
    StaleClaim(WorkerIssueRef),
    /// Processing failed definitively after preserving any existing intent and evidence.
    Failed(WorkerIssueRef),
}
```

| 完整 factory / 成员签名 | 作用 / 来源 |
|---|---|
| `pub fn accepted(result_ref: ArchiveApplicationResultRef) -> Self` | Accepted；本地已提交 application result |
| `pub fn duplicate(result_ref: ArchiveApplicationResultRef) -> Self` | Duplicate；同 scope/key/input 的已存 result |
| `pub fn delayed(issue_ref: WorkerIssueRef) -> Self` | Delayed；安全临时前提缺失 |
| `pub fn rejected(issue_ref: WorkerIssueRef) -> Self` | Rejected；确定拒绝 |
| `pub fn unsupported(issue_ref: WorkerIssueRef) -> Self` | Unsupported；正式版本/入口映射缺失 |
| `pub fn stale_claim(issue_ref: WorkerIssueRef) -> Self` | StaleClaim；repository/fence 映射拒绝 |
| `pub fn failed(issue_ref: WorkerIssueRef) -> Self` | Failed；确定本次处理失败，不抹除 effect intent |
| `pub fn is_terminal_for_item(&self) -> bool` | 仅 Delayed 为 false；与 domain/job 终态独立 |

每个同名 factory 只构造同名 variant。Accepted/Duplicate 必须带 exact stored result ref；其他 variant 只带 redacted issue。`is_terminal_for_item()` 对 Accepted/Duplicate/Rejected/Unsupported/StaleClaim/Failed 为 true，对 Delayed 为 false；“terminal for item”不等 job/domain terminal。Consumer local result commit 不等 Bus ACK；job Accepted 不等 archive/restore success；StaleClaim/CommitUnknown 禁止 dispatch/retry；duplicate 禁止重新解析 payload、重跑 transition 或重新调用外部 effect。

### 13.8 技术 value / collection 的完整函数模板

infra/api/worker 的独立 String newtype 分别提供 `pub fn try_new(value: String) -> InfraResult<Self>` / `ApiResult<Self>` / `WorkerResult<Self>`，并提供 `pub fn as_str(&self) -> &str`、`pub fn into_inner(self) -> String`；拒绝空/纯空白，不 trim identity、不从 ref 推断 authorization。`WorkerCheckpointSequence::try_new(value: u64) -> Result<Self, ArchiveSupportError>` 拒绝 0，`pub fn get(&self) -> u64` 只读；递增与单调比较在 repository 同 entry/target namespace 内，不由 factory 分配。

infra 三类 `Set => Member` 的完整函数为 `pub fn try_from_iter(values: impl IntoIterator<Item = Member>) -> InfraResult<Self>`、`pub fn iter(&self) -> std::slice::Iter<'_, Member>`、`pub fn len(&self) -> usize`、`pub fn is_empty(&self) -> bool`；exact slot 唯一，按 enum 定义顺序及 payload typed identity 稳定排序。binding set 拒绝 Store/ContextSource；optional/required 集合由 validated config registry 提供。runtime、entry、claim、checkpoint 只提供同名字段 accessor，不允许 public field mutation 绕过表内函数。

#### worker 逐 variant 反查

以下逐项承接代码块的英文 Rustdoc；状态类列允许来源/去向，分类/ref/反馈类不可原地迁移，列构造来源和消费者。均须满足对象的版本、固定输入和正式依据 guard；同态观察仍需 CAS。完整非法迁移/error matrix 留 Step 10/12，不增加隐式 retry。

##### `WorkerTargetRef` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Job(ArchiveJobRef)` | `Selects an admitted Archive job for bounded coordination.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `SourceBinding(SourceBindingRef)` | `Selects one existing source binding before a capture attempt is created.` | J03 既有 binding | 不 mint 虚假 attempt 作为 claim target |
| `ExternalAction(ExternalActionRecordRef)` | `Selects the exact persisted storage or lifecycle action to reconcile.` | J12 既有 action | 不按最新时间或字符串挑 action |
| `CaptureAttempt(CaptureAttemptRef)` | `Selects one fixed source capture attempt.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `Bundle(BundleRevisionRef)` | `Selects one immutable Bundle revision.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `Assessment(AssessmentRef)` | `Selects one integrity or compatibility assessment.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `Placement(ArchivePlacementRef)` | `Selects one storage placement.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `Lifecycle(LifecycleExecutionRef)` | `Selects one governance-bound lifecycle execution.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `RestorePlan(RestorePlanRef)` | `Selects one immutable restore plan.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `RestoreItem(RestoreItemRef)` | `Selects one owner-specific restore item.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `RestoreHandoff(RestoreHandoffRef)` | `Selects one receiver handoff.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `Compensation(CompensationRecordRef)` | `Selects one authorized restore compensation.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |
| `InboundEvent(ExternalEventRef)` | `Selects one trusted inbound event for consumer dispatch.` | application 读取的 persisted bounded target | WorkerClaim/Checkpoint；不解析 ref 猜 target |

##### `WorkerEntryKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Consumer(ArchiveConsumerKind)` | `Dispatches one of five validated inbound consumer inputs.` | 静态 Consumer/Operation registry | ArchiveWorkerEntry；不混合两 channel |
| `Operation(ArchiveOperationJobKind)` | `Advances one of seventeen bounded Archive operations jobs.` | 静态 Consumer/Operation registry | ArchiveWorkerEntry；不混合两 channel |

##### `ArchiveConsumerKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `ConsumeArchiveTrigger` | `Consumes a formal archive trigger candidate.` | 正式 02/Step 5 五 Consumer registry | 对应 application use case；local commit≠Bus ACK |
| `ConsumeSourceExportFeedback` | `Consumes owner-mapped source export feedback.` | 正式 02/Step 5 五 Consumer registry | 对应 application use case；local commit≠Bus ACK |
| `ConsumeGovernanceDecisionChange` | `Consumes a formal governance decision change.` | 正式 02/Step 5 五 Consumer registry | 对应 application use case；local commit≠Bus ACK |
| `ConsumeStorageActionFeedback` | `Consumes storage action feedback for a persisted action owner.` | 正式 02/Step 5 五 Consumer registry | 对应 application use case；local commit≠Bus ACK |
| `ConsumeRestoreReceiverFeedback` | `Consumes one owner-specific restore receiver observation.` | 正式 02/Step 5 五 Consumer registry | 对应 application use case；local commit≠Bus ACK |

##### `ArchiveOperationJobKind` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `AdvanceArchiveJob` | `Advances one Archive or restore coordination job.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `PlanArchiveSources` | `Expands a frozen archive scope into source bindings.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `CaptureArchiveSource` | `Advances one fixed source capture attempt.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `ReconcileSourceCapture` | `Reconciles one exact source capture attempt.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `AssembleBundleManifest` | `Assembles one immutable Bundle manifest revision.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `SealArchiveBundle` | `Applies fixed-input seal guards to one Bundle revision.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `AssessBundleIntegrity` | `Assesses integrity for one fixed Bundle input.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `AssessBundleCompatibility` | `Assesses compatibility for one exact target context.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `PlaceArchiveBundle` | `Places one fixed Bundle revision through a persisted intent.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `RetrieveArchiveBundle` | `Retrieves one fixed Bundle revision through a persisted intent.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `ExecuteArchiveLifecycle` | `Executes one formally authorized lifecycle action.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `ReconcileExternalAction` | `Reconciles one ambiguous persisted external action.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `BuildRestorePlan` | `Builds one immutable per-owner restore plan revision.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `PrepareRestoreMaterial` | `Prepares minimal material for one owner-specific restore item.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `DispatchRestoreHandoff` | `Dispatches one persisted owner-specific restore handoff.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `ReconcileRestoreHandoff` | `Reconciles one ambiguous owner-specific restore handoff.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |
| `ExecuteRestoreCompensation` | `Executes one formally authorized restore compensation.` | 正式 02/Step 5 十七 Job registry | 对应 capability-limited application service；不得增设 generic worker |

##### `WorkerEntryState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Registered` | `The entry is registered but has not begun one item.` | from_consumer/from_operation | Running/Delayed/Stopped/Failed |
| `Running` | `The entry is processing one bounded item.` | Registered/Delayed + active claim（如需） | Completed/Delayed/Stopped/Failed |
| `Delayed` | `The entry is waiting for an explicitly later retry or dependency recovery.` | Registered/Running + safe issue | Running（claim 仍有效）/Stopped/Failed |
| `Completed` | `The current bounded item completed with a persisted result.` | Running + matching stored result | 当前 entry 终态，非业务成功 |
| `Stopped` | `The entry stopped due to shutdown or validated configuration.` | Registered/Running/Delayed 显式停止 | 当前 entry 终态，不回滚外部效果 |
| `Failed` | `The entry failed and cannot continue without a controlled recovery action.` | Registered/Running/Delayed 确定失败 | 当前 entry 终态，已有 intent 仍保留 |

##### `WorkerClaimState` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Active` | `A claim capability granted the exact target and fence.` | repository accepted claim | Released/Expired/Superseded |
| `Released` | `The holder released the claim after checkpoint or safe abandonment.` | 正式 claim seam 确认释放 | 终态；不可保护新提交 |
| `Expired` | `The claim is no longer valid at the current observation time.` | 同 repository clock observed_at>=expires_at | 终态；不可续用 |
| `Superseded` | `A newer fence made this claim stale.` | 正式 claim seam 证明同 target 新 fence | 终态；不把旧 fence 改成新 fence |

##### `WorkerItemDisposition` variant 表

| 变体 / 载荷类型 | Rustdoc 注释（业务语义） | 允许来源 | 允许去向 / 消费约束 |
|---|---|---|---|
| `Accepted(ArchiveApplicationResultRef)` | `Application committed a stable result for this exact entry and input.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |
| `Duplicate(ArchiveApplicationResultRef)` | `Idempotency replay returned the exact previously stored result.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |
| `Delayed(WorkerIssueRef)` | `A temporary dependency, lease, or backoff condition requires a later attempt.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |
| `Rejected(WorkerIssueRef)` | `Safe validation or authorization definitively rejected the item.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |
| `Unsupported(WorkerIssueRef)` | `The input schema or logical operation kind is not formally supported.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |
| `StaleClaim(WorkerIssueRef)` | `The claim fence is stale and this worker must not commit or dispatch.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |
| `Failed(WorkerIssueRef)` | `Processing failed definitively after preserving any existing intent and evidence.` | application result/replay 或 safe claim/error mapping | worker 技术处置；仅 Delayed 非 item terminal |


### 13.9 Worker 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| denominator/registry | pass | 5 Consumer + 17 Job = 22 logical worker entries，仍是一个 worker crate/binary |
| claim/fence/checkpoint | pass_at_step_6 | stable types/guards 已闭口；repository CAS、lease duration、renew/backoff留 Step 7/13/14 |
| application boundary | pass | entry 只调用 capability-limited application service，不依赖 domain/api，不直写 store adapter |
| commit unknown | pass | 无 checkpoint/重放推断；先依据 persisted intent/ref 与正式 probe/reconcile |
| transport/schedule | pass | 未声称 Bus ack、scheduler commit、topic、batch、timeout 或 deploy topology |
| 后续承接 | pass_with_blockers | Step 7 claim/checkpoint/consumer adapter ports；Step 8 typed I/report；Step 9 flow；Step 11/13/14 一致性和 runtime |

## 14. 跨模块字段、状态、依赖与后续承接总审计

### 14.1 高复用字段来源审计

| 字段 / 类型族 | 唯一来源 | 允许消费者 | 明确不得混同 | 缺失 / 冲突姿态 |
|---|---|---|---|---|
| Archive-owned `*Id/*Ref` | application context/ID capability 或 store 重建；ref 从对应对象 identity | contracts/domain/application/entry safe carrier | external owner ID、URL、DB key、TraceId/RequestId/JobRunId | 不构造对象；typed not-found/conflict |
| `RecordVersion` / job/bundle wrapper | local store + factory initial value | domain expected-version、repository CAS | owner version、manifest/plan revision、worker fence | stale/conflict；禁止 blind write |
| `SourceVersionRef` / `SnapshotFenceRef` / coverage | exact owner export capability mapped evidence | binding/capture/manifest/restore eligibility | 跨 owner ordering、workspace revision、local version | Partial/Stale/Conflicting/Unknown/Blocked |
| `AuthorityRef` / restore/governance/compensation authority | formal owner capability/envelope | admission/lifecycle/restore exact subject | ActorRef、role hint、event arrival、runtime config | Rejected 或 Blocked；不造 Accepted/Eligible |
| material/locator/digest/signature/schema refs | owner/integrity/compatibility capability mapped outcome | manifest/assessment/restore/view（按授权） | `SafeInputDigest`、Artifact body、provider object ID | Unknown/Blocked/finding；不造 Verified/Supported |
| storage location/tier/commit | `StorageCommitEvidence` from exact action/probe | placement/lifecycle safe state/view | request/dispatch/ACK/timeout | CommitUnknown/Blocked/Failed；字段保持 None |
| receiver/material/commit/outcome | exact owner receiver/source/integrity/compatibility mapping | one RestoreItem/Handoff/Outcome | Bundle 本身、跨 owner result、Bus ACK | per-owner Blocked/Failed/CommitUnknown/Conflicting |
| actor/command/query metadata | trusted outer boundary using verified Core types | API/application operation context | authority decision、worker holder、owner truth | entry reject；不补 default |
| `RecordedAt` | application/infra trusted observation clock or formal claim capability | domain history/view/entry state | owner occurred_at、retention deadline、lease algorithm | 不构造记录；不得 `now()` 隐式读取 |
| application idempotency key/input digest/result ref | normalized trusted entry + canonical stable input calculator + result store | non-Query application/worker/API replay | external effect key、integrity digest、truth ID | conflict or consistency error；duplicate 不重跑 |
| external effect key/digest/correlation | application persists exact intent before dispatch | storage/receiver adapter + reconciliation | application request key、different target/action | Conflict/CommitUnknown；probe before retry |
| worker claim/fence/checkpoint | claim/checkpoint repository accepted record | exact worker entry + target | domain version、JobRunId、scheduler token | StaleClaim/Delayed；不 dispatch/commit |

### 14.2 对象组字段来源审计

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| contracts shared vocabulary | source/ref/version/evidence/safe helpers | definition owner、typed shape、factory source、body-free invariant | Step 7 mapped outcomes；Step 8 public schema | 任一 public helper 只有名字无字段/variant owner |
| contracts formal objects | `DeclaredArchiveScope`、`GovernanceDecisionRef` | 全字段、factory、authority/redline | Step 7 decision capability；Step 8 Command mapping | scope/decision 必填字段来源不全 |
| safe views/reports | 五 safe view + summary sets | committed Archive records、visibility/freshness/redaction、set identity | Step 7 read/visibility port；Step 8 response DTO | view 引用 domain-only/raw adapter type或泄漏 existence |
| CP1～CP2 truth/history | request/job/binding/capture/coverage/finding | ID/scope/basis/version/fence/material/evidence/time | Step 7 store/source ports；Step 9/11/13 | Blocked path 要求 synthetic authority/material |
| CP3～CP4 truth/history | Bundle/manifest/closure/assessment/finding | fixed revision/inventory/capability evidence/target/time | Step 7 capability ports；Step 9/10/11 | mixed revision、缺 capability 却正向 settle |
| CP5 truth/effects | placement/lifecycle/action | formal decision proof + persisted intent + mapped ACK/commit/probe | Step 7 governance/storage ports；Step 9/11/13 | 无 intent 外调、ACK 当 commit、lifecycle 复用 restore compensation |
| CP6 truth/effects | request/plan/item/handoff/outcome/compensation | explicit owner、fixed Bundle/material/receiver、per-owner authority/outcome | Step 7 owner ports；Step 9/11/13 | 跨 owner传播、直接写 owner DB、success 推导 restored |
| application helpers/services | operation context/idempotency/stored result/visibility/correlation + 8 services | entry metadata、store/port capability、stable result/effect correlation | Step 7 exact traits/UoW；Step 8 I/O；Step 9 flows | service 要求 infra concrete type或 Query 获写能力 |
| infra state | bindings/availability/assembly | validated config refs、slot registry、probe/factory result | Step 7 factory/adapter；Step 11 store；Step 14 config | missing/unknown binding 映射 Enabled/Ready |
| API entry | command/query generic entry + disposition | trusted metadata、static registry、typed Step 8 input、safe result/issue | Step 8 concrete DTO；Step 9/12 mapping | transport/raw body进入对象或 Query带写 key |
| worker entry | claim/checkpoint/generic entry/disposition | repository claim/fence、typed target/input、stored result | Step 7 repositories；Step 8 report；Step 9/11/13/14 | stale/unknown claim仍 dispatch/checkpoint或 duplicate 重跑 |

### 14.3 状态闭环审计

| 状态族 | 状态主语 | 初始状态 | 关键迁移 | 终态 / 特殊状态 | 后续闭合 |
|---|---|---|---|---|---|
| admission | Archive/Restore request basis | factory-direct Accepted/Rejected/Blocked | immutable；改善建立新 request | 三者均 final for request | Step 8 result；Step 10 cross-check |
| job | `ArchiveJob` stage + aggregate | Queued/Queued | kind-specific advance + conservative recompute | Completed terminal；Blocked/Failed 不等 project state | Step 9/10/11/13 |
| source | binding/capture/coverage | Planned/Requested/immutable assessment | bind/block/retire；progress/settle/supersede | Retired、Settled/Failed/Superseded；Unknown explicit | Step 7/9/10 |
| Bundle/closure | `ArchiveBundle` + immutable closure | Draft / evaluation result | assembly→closure-ready→sealed；block/fail | Sealed terminal且不等 archived | Step 9/10/11 |
| verification/compatibility | assessment | Pending / immutable mapped result | InProgress→Verified/Failed/Unknown/Blocked | target/fixed-input terminal per assessment | Step 7/9/10 |
| placement/retrieval | `ArchivePlacement` two axes | IntentRecorded + NotRequested/Unknown | dispatch/commit/probe；request/retrieve result | commit 与 retrievability独立；CommitUnknown special | Step 7/9/10/13 |
| lifecycle | `LifecycleExecution` | Eligible | intent→dispatch→ACK/commit/unknown/block/fail；formal compensation | Committed/Compensated；ACK非终态证明 | Step 7/9/10 |
| restore plan/item | plan aggregate + per-owner item | Draft / Planned | freeze/recompute；material/handoff/outcome/compensation | HandoffComplete不等 restored；owner独立 | Step 7/9/10/11 |
| handoff/outcome/compensation | effect + immutable observation + effect | IntentRecorded / immutable / Planned | dispatch/outcome/reconcile；start/outcome/probe | CommitUnknown/ReconcileRequired explicit；history不覆盖 | Step 7/9/10/13 |
| application idempotency | reservation | Reserved | complete or conflict | Completed/Conflict | Step 7/11/13 |
| infra runtime | adapter marker + assembly | mapped / NotStarted | availability revalidation；validate→assemble→ready/fail | Failed fail-closed；Ready非产品 readiness | Step 7/12/14 |
| API entry | disposition only | direct factory | immutable result classification | per-request terminal；非 domain state | Step 8/12 |
| worker entry/claim | entry + claim | Registered / Active | run→complete/delay/fail/stop；release/expire/supersede | technical terminal/special；不传播业务状态 | Step 9/10/13/14 |

### 14.4 重复类型、依赖方向与 source-authority 审计

| 审查项 | 结论 | 证明 / 修正 |
|---|---|---|
| 正式对象分母 | pass | `2 contracts + (7 + 8 + 9) domain = 26`；application/infra/api/worker helper 不计入 |
| duplicate/shadow type | pass | public state/ref/view definition owner 仅 contracts；domain transition carrier private；移除 `RestoreEligibilityBasis`、`ExternalAttemptNumber` 的重复 opaque 声明 |
| optional/evidence naming | pass | optional 只在字段类型层表达；capability_ref 不冒充 capability evidence，缺记录用 None |
| compensation subject | pass | lifecycle 使用 `LifecycleCompensationEvidenceRef`；CP6 `CompensationRecord` 只绑定 restore handoff |
| dependencies | pass | contracts→Core-only；domain→contracts；application→contracts/domain；infra→application/domain/contracts；api→application/contracts；worker→application/infra/contracts |
| external relation classification | pass | L1 snapshot/export、workspace、artifact、observability、storage、signing/compatibility、governance、receiver 都是 runtime/event/ref/adapter，不是 Cargo sibling dependency |
| source-authority matrix | pass_with_blockers | 八类 source 均有 exact class/authority/material/provenance；workspace projection 明确 Auxiliary/non-canonical |
| truth ownership | pass | Archive 仅拥有 bundle/manifest、job、storage/integrity state、restore plan/handoff；无 owner truth/policy/audit backend反写 |
| fail-closed | pass_with_blockers | external contract/provider/schema/key/config 未闭合时只允许 Blocked/Unknown/disabled，不能正向构造成功 |
| enum/variant contract | pass_at_step_6 | 所有公开有限 enum 提供英文 Rustdoc与来源/去向；完整非法迁移/error variant交 Step 10/12 |

### 14.5 Step 7 承接清单

| Step 7 契约组 | 必须承接的 Step 6 内容 | Step 7 输出要求 | 若未承接的实现 blocker |
|---|---|---|---|
| local store / read / UoW | 26 对象、idempotency/result、safe views、expected version、history、claim/checkpoint | 按 capability拆 exact repository methods、CAS/UoW handle、not-found/conflict结果；Query read-only | 无法原子受理、重放、组 view 或防 stale write |
| context / identity source | Archive IDs、result IDs、revision/attempt ordinal、RecordedAt | typed ID/clock/revision allocator capability；不得 inline random/time | factory 必填字段无法合法提供 |
| SourceExportPort family | source binding/capture/coverage/material与 restore source material | per-source request/outcome/probe schema，保留 authority/version/fence/coverage/material class | `AR-UP-001/006~008` 路径保持 blocked |
| IntegrityCapabilityPort | fixed verification input、integrity evidence/finding | exact mapped outcomes，算法/key/raw body隔离 | 无法构造 Verified；保持 Blocked/Unknown |
| CompatibilityCapabilityPort | target-specific assessment/schema refs | exact target/version capability result | 无法构造 Supported；restore material blocked |
| GovernanceDecisionPort | mapped decision binding/applicability proof/lifecycle compensation evidence | decision lookup/current applicability/hold-conflict safe outcome | lifecycle 不能 Eligible/dispatch/compensate |
| ArchiveStoragePort | action correlation、placement/retrieval/lifecycle commit/probe | intent input、ACK/commit/unknown/failure/probe outcome；provider-neutral | placement/lifecycle正向路径 blocked |
| RestoreReceiverPort family | per-owner receiver/material/handoff/outcome/compensation | receiver lookup/dispatch/probe/compensation exact typed outcomes | owner path不得 Succeeded/Completed |
| visibility/read resolver | `ArchiveReadSubjectRef`、safe metadata/summary sets | current visibility/redaction/freshness capability与 uniform not-available | Query不得返回 body或区分 hidden/absent |
| infra adapter/factory | runtime bindings、slot、availability、assembly | 每 port impl/fake parity、validated binding constructor、safe error mapping | runtime不得标 Ready/暴露 facade |
| worker repository/consumer seam | claim/fence/checkpoint、ExternalEventRef、22 entry registry | acquire/renew/release/CAS/checkpoint、trusted envelope mapping；ACK边界分离 | worker不得安全 dispatch、resume或 dedupe |

Step 7 不得把上述承接清单解释成外部合同已经存在。受 `AR-UP-001~009` 阻断的 trait 可以定义本地 required capability 和 fail-closed outcome，但对应 production adapter 必须保持 blocked；`AR-HLD-Q-001` 未关前不得新增 outbox/publisher port。

### 14.6 回填草稿

正式 03 的 Step 19 装配阶段应将本 Step 的收稳结论回填至：

- §5 按 `contracts → domain CP1～CP6 → application → infra → api → worker` 展开 capability、对象、字段、factory、成员函数、状态和不变量；过程性的批次表/停审记录不进入正式正文。
- §5 收口摘要保留 shared vocabulary、`2+24=26` definition owner、非 core stable carrier/defer、字段来源、状态族和 Step 7 承接结论。
- §6 只建立对象/Trait/API 查找索引；不在索引中新增本 Step 未定义的对象或 port 方法。
- 正式 03 仍须等 Step 7～18 全部完成，并在 Step 19 整体重建；当前不得回填 historical 正式文件。

### 14.7 Pending、blocker 与待确认事项

| 项 | 当前结论 | owner / 后续动作 |
|---|---|---|
| `AR-UP-001~009` | 全部继续开放；未因本 Step 的 typed slot/helper 而关闭 | owning L1/L4 project 提供正式合同后，在 Step 7/8/14 绑定 |
| `AR-ARCH-001` | 继续开放；L0-sdk 不进入 Archive compile graph | 全局依赖标准 owner / L0-sdk 对齐 |
| `AR-HLD-Q-001` | 继续开放；无 outbox/outbound/publisher object | owning architecture/HLD 回审后才可增加 |
| `AR-HLD-Q-002` | 继续开放；无默认 batch/timeout/lease/RTO/容量值 | 正式 workload/config authority + 后续 04 |
| provider/config/algorithm/key/backend/transport/schedule | 均未选择，不是本步缺漏 | Step 7/11/14/正式 04；缺失保持 fail-closed |
| 新增 owning-project blocker | 无 | 本 Step 只细化既有 blocker 的落码姿态 |

### 14.8 Step 6 完成门禁

| 门禁 | 结果 |
|---|---|
| 骨架、批次与模块顺序 | pass；6.0～6.7 均已完成 |
| 每模块 capability → object → field/function/state | pass；六模块及 domain 三批均有映射和内部停审 |
| 正式对象完整性 | pass；2 contracts + 24 domain，字段/函数/factory/state/invariant 已闭合 |
| 非 core stable carrier | pass；application/infra/api/worker 的唯一稳定对象已闭合，DTO/port/config按职责 defer |
| 字段来源 / 状态 / dependency / authority | pass_with_upstream_blockers；本地契约闭合，外部正向路径 fail-closed |
| Step 7 输入 | pass；11 个契约组及 §14.9 guard/历史/时间来源有明确承接与未承接 blocker |
| 文档自检 | pass；26 正式对象、8 service、30 逻辑入口/32 方法面、73 enum/369 variant 对应；围栏、表格列数、空白和重复声明检查通过；不是编译/测试结果 |
| 正式文档写入 | blocked_by_process；必须等 Step 19，不修改 historical 正式 03 |

### 14.9 补完复审：guard 输入、依据保存与构造责任（2026-09-11）

本轮复审的问题回答已登记 §4.1.1；结论是补足本地对象契约，不扩大 Archive ownership、不通过 opaque ref 推断 truth、不借后续 Step 延后当前 stable carrier。下表是本 Step 的校验责任闭口；后续 Step 必须承接同一字段、方法和 guard，不得自行省略。

| 调用 / 构造点 | domain/contracts 可实际核对的输入 | application / 正式 adapter 必须先核对 | 缺失、冲突与持久归属 |
|---|---|---|---|
| request admission / queue / draft | typed scope、kind、basis、ID/version；queue kind 与 request variant 一致 | authority 当前适用、受理结果已提交；job/Bundle/plan 只能关联 Accepted request | 无 authority 不造 Accepted；本地 reservation/result 同一 UoW，不能用 event/role hint 授权 |
| source binding / ManifestEntry factories | selector class、requiredness、绑定 ref、material class、role/locator shape | loaded Bound binding 对应 request/scope；§5.6 source-authority matrix；approved inventory/material、owner version/fence 关系 | 无正式 source mapping 即 Blocked；不能把 workspace projection 当 canonical；entry 不保存 owner 正文 |
| CaptureAttempt::settle | 显式 binding、declared_scope_ref、coverage.owner_coverage 的 authority/selector/scope、observed_version 与 requested_fence | feedback 认证、exact attempt/contract/input correlation、finding 与该 attempt 的关联；不跨 owner 排序 | correlation 错误拒绝 settlement；真实 Stale/Partial/Missing/Conflicting/Unknown 结果允许 Settled，不假定 Settled=Complete |
| CaptureAttempt fence/version | owner proof 存在时 scope/selector 必匹配；Complete 必须满足请求 fence 且 observed_version 等于 proof.source_version_ref | opaque fence 是否满足只能由该 owner contract 判断；不把不等字符串解释为时间先后 | 请求 fence 有值而 proof 缺失，只能 Unknown；owner 证明不满足则 Stale；版本证据互相矛盾则 Conflicting。先构造对应 coverage/finding，再 settle；不能为了通过 guard 把证据改成 Complete |
| ManifestClosure / BundleManifest::freeze | exact declared/actual sets、binding/key/class/role、revision；freeze 重新 evaluate 并用显式 closure_findings 核对差异与 refs | owner inventory 是否足以构成声明集合、required/conditional source coverage 是否完整；不确定时不制造 inventory | 不完整 source 的局部 manifest 可保留，但不能据本地集合相等声称全域完整或 seal；finding 独立 append-only，manifest 固定后不可改 |
| ArchiveBundle::seal | 显式 manifest、VerificationAssessment、CompatibilityAssessment 列表、ArchivePlacement；与 basis 的所有 ref/同一 revision 对齐；closure Complete、integrity Verified 且 evidence/input/capability 一致、required compatibility 全 Supported、placement Committed 且 commit/location/tier 有值 | 同一已提交读取快照、manifest 实際 material refs 与 verification input 全等；正式所需用途/schema/compatibility 集合；required source coverage/fence 与跨域一致性声明；决定/authority 未过期且 applicable | 任何 required Unknown/Blocked/缺项/失配均拒绝 seal；不足的跨域 fence 合同保持 AR-UP-001，不能私造一致快照。refs 自身不是证明；seal 不产生项目状态 |
| ExternalActionRecord / placement / lifecycle | observation 的 action/target/revision/operation/key/digest；结果 family 匹配；aggregate 接显式 action 校验已关联且目标相同 | 原始 response/probe 的正式真实性和 effect correlation；intent 先提交；派发与写回均受 fence/CAS | Place/Retrieve/Lifecycle 分离；ACK/Blocked 不证明 commit；全部 observations/reconcile_history 随 action 原样保存；矛盾终态转 CommitUnknown，旧 commit 不删 |
| LifecycleExecution::eligible/block/mark_compensated | proof decision/version/Bundle/action 字段；block_history 保存 current decision+reason；compensation_evidence_ref 保存完成证明引用 | governance 正式 scope/validity/hold/delete/risk/applicability 与 exact lifecycle compensation completion；opaque evidence 不由 domain 认证 | current decision 不覆盖执行原 decision；Blocked 不抹除已有外部效果；无正式 proof 不可 Eligible/Compensated。lifecycle 不复用 restore-only compensation record |
| RestoreItem::bind_material / mark_in_progress | basis 的九字段与 item revision/owner/entries/material/receiver 全等；显式 handoff state/identity；不能只有 handoff ref 就认定 dispatched | 已提交 matching integrity、exact receiver compatibility、可取回材料证明、receiver/authority 当前适用、source entry 的 owner-approved 恢复映射 | missing/stale/conflicting/unsupported-version/integrity-failed/unknown 任一 required 前提未清则 Blocked；Bundle 不授跨域写权，只走各 owner receiver |
| outcome / compensation | exact handoff/item/compensation 关联、Succeeded 必有 commit ref、结果与当前记录 state guard；补偿 key/input 与原 handoff 分离 | receiver 认证、formal probe/retry-after-no-commit/compensation authority；结果 correlation 不从 ref 反推 | outcome_refs/handoff_refs/result_history/reconcile_history append-only；unknown 只 probe/review，补偿完成不抹原效果。local commit-unknown 先读回，不重发 |
| job / plan recompute | component/item typed identity 唯一、完整集合、已保存分量、状态前置；Plan Failed 有显式 failure_basis_ref | 所有 basis 与同 job/plan/revision/target 的实际关联；required component/owner 分母，不能裁掉失败项 | 保守聚合不造成功；plan-level fail 不由单 owner Failed 推导；history/time/version 均有明确输入 |
| safe view / summary | 已携带字段的 shape、variant 组合、set identity/order、fixed-input equality | 同一 read snapshot 上完成记录关联、current visibility/redaction/freshness；裁剪前验真 | 无 assessment 用 None；无 ref 不生成占位；safe view 不从裁剪子集重算 aggregate；hidden/absent 统一 NotAvailable |
| runtime / worker | Store 与 Adapter typed binding 区分；冻结 bindings/required_slots；claim entry/target/fence 和同 clock expiry；result operation 匹配 | 同 config required/optional registry、真实 handle 构造、repository 当前 claim/CAS、result/checkpoint 原子可读 | missing/Degraded 不满足正向 required slot；过期 claim 禁止 dispatch/commit；marker/本地 clock/checkpoint factory 均不是外部提交证据 |

#### 历史、时间与字段落点复核

| 新补/澄清字段组 | factory 初值 / 写入入口 | round-trip 与时间规则 |
|---|---|---|
| job/binding/capture 的 block_history；binding retirement_basis/replacement_ref；capture failure_ref/replacement_attempt_ref | queue/plan/start 初始空或 None；对应 block/retire/fail/supersede 写入 | 无本地时间字段，不隐式取 now；BasisObservation 只记录 loaded RecordVersion+typed basis；CAS 失败不得追加 |
| Bundle reason_history/current_revision/assembly_origin_ref/seal_basis；manifest closure_findings 输入 | draft 空/None；begin 固定 origin；attach 改 ref+revision；seal 保存确切 basis；block/fail 保留 reason；freeze 显式核对 finding | findings 独立保存，manifest 只保留 refs；previous revision 不覆盖；无伪 digest 或时间 |
| action observations/reconcile_history；placement 两 history/两个 action ref；lifecycle block_history/compensation evidence | intent/eligible 初始空/None；settle/apply/reconcile 原子追加；Place/Retrieve 分轴 | latest recorded_at 来自显式参数；历史没有单项时间不声称 provider event time；先保存 action，再由本地 UoW/重入协调 aggregate |
| plan item_postures/failure_basis_ref；item handoff/outcome/compensation refs；handoff outcome_refs；compensation key/input/result history | draft/plan/record_intent 初始空/None；freeze/recompute/fail/attach/apply 明确写入 | 独立 HandoffOutcome 有 observed_at；内嵌历史按提交顺序，不排序伪造发生顺序；原 receiver commit 不被 compensation 覆盖 |
| safe summary optional capability refs 与 finding recorded_at | 仅从真实已保存对象裁剪；不存在的 assessment 不构造 summary | capability identity 不强转 capability evidence；None 不推导成功/缺失；公开 view 不暴露 domain 历史本体 |
| runtime bindings/required_slots；WorkerLeaseExpiresAt | begin 冻结；expiry 来 claim repository | 不从 RecordedAt 造 deadline；runtime 无额外时钟字段；技术记录不是 observability audit chain |

所有 shared struct 的代码块给出逻辑 schema，构造/判定表给出字段输入与 shape 边界；字段未另列特有 accessor 时采用 §5.8 的同名只读模板。外部 evidence 型 factory 是本地 required shape，不是公开授权 mint API；正式 adapter 缺失时不得构造正向业务结果。fake 只验证同一类型与 guard 的测试语义，不能替代 owner evidence 或生产 readiness。

#### 本轮前后对比与后续承接

| 复审发现 | 当前修正 | 后续必须承接 |
|---|---|---|
| contracts set 引用 domain ManifestEntry；悬空来源分类和模糊 transition | ManifestEntrySet 归 domain；SourceClass 唯一；typed StateTransition/BasisObservation | Step 7 repository 不反向复制领域对象；history 原样持久读回 |
| 若干 guard 只有 ref 却声称核验 owner/commit；freeze 只比 revision | 明确 shape/semantic 分工，增加 seal/dispatch/settle 实际上下文、exact-set 重评 | Step 7 typed reads/proofs；Step 9 guard 来源逐项映射；不得从 opaque ref 推字段 |
| block/failure/unknown 依据缺存放点；Plan Failed 缺显式来源 | 增加相应内嵌历史及 plan-level fail/basis，不增正式对象分母 | Step 11 CAS/UoW/checked rehydrate；Step 13 duplicate/unknown/reconcile 规则 |
| 非 core 方法简写、Store 绑定类型混用、required set 可变 | 完整 typed 签名；Store/Adapter 区分；assembly 冻结输入；worker expiry 独立类型 | Step 7 handle/claim/checkpoint seam；Step 14 validated config/clock/registry |
| safe summary 模糊、缺记录虚构对象、enum 只有概述 | 10 类 summary + 五 view 完整 factory；无记录 None；73 enum / 369 variant 逐项表 | Step 8 DTO/disclosure；Step 10 exact matrix；Step 12 error mapping；Step 16 负向切口 |

文档分母保持 `2 contracts + (7 + 8 + 9) domain = 26`，八 service、30 逻辑入口（E04/J12 各有两条互斥 routed surface，方法面共 32）不变。本轮无新增 owning-project blocker；原 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 全部保留。未来优先核对 exact-set 混 revision、required source 不完整、假 ref 成功、矛盾 commit、历史丢失、同 key 异输入、stale claim、mixed receiver、unsafe visibility 等测试切口；本轮只做文档自检，未执行这些测试。

Step 6 原始停审状态：`completed / pass_with_upstream_blockers / stop_review`。这不是产品 signoff。用户随后明确授权 Step07，当前授权与恢复点以 flow/project ledger 为准，不再由本段历史门禁阻止 Step07。

### 14.10 Step07 必要反查修正（2026-09-11）

| 发现 | 修正 | 分母 / 边界 |
|---|---|---|
| application/infra 需要 claim/checkpoint，却只能从 worker 引用 | 11 个持久 control carrier 的 definition owner 下移 application::worker_control，worker 导入；错误改 ArchiveSupportError | 无第九业务 service、无新业务对象 |
| after_commit factory 与 checkpoint/result 原子提交时序矛盾 | 改 from_staged_result，commit 后才可见；保留原 identity/sequence/result 字段 | 不伪造 commit 时间或证据 |
| job service context 不含 worker claim，无法把 fence 带入 UoW | ArchiveOperationContext 增 worker_claim，仅 Job factory 必填；entry claim 与 context 必须相同 | 不添加外部授权，不将 run ID 当 fence |
| authority/visibility 无独立 slot，storage feedback 被 SourceClass 分类 | 新增 Authority/Visibility；InboundConsumer 改 ArchiveInboundFamily 五分支 | 业务 family 仍7；technical enum 增1、variant 净增7 |
| 非 contracts 片段直接写 core_contracts 路径，与 direct dependency 矩阵冲突 | contracts::context::core_shared 显式 re-export 已核验类型，domain/application 经该路径复用 | 无新增 direct dependency、无 shadow type |
| Step06 helper 只含 stored surface ref / opaque intent | 完整 payload 与 fixed input sidecar 的读写在 Step07 闭合，本步对象 schema 不复制 | 26 正式对象、8 service、30/32 分母不变 |

§14.8 的 73 enum/369 variant 是 Step06 原始自检快照；本次新增 ArchiveInboundFamily、两 slot 及 WorkerTargetRef 两个真实目标分支后为 74 enum/378 variant，原 enum 值未重命名为业务成功。对应文档静态检查由 Step07 收口记录统一报告，不是编译或运行证据。
