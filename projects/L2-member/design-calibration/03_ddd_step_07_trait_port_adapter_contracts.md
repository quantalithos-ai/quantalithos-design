# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 对应书写规范: `standards/document/详细设计书写规范.md` §5.5、§5.6
> 粒度 / 格式参考: `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`；不继承其 Governance truth、event、outbox、adapter 或物理实现。
> 回填目标: 将来正式 `03-详细设计.md` 的 §5「模块实现契约 / Trait / Port / Adapter」与 §6「全局对象 / Trait / API 索引」。
> 状态: `completed / pass_with_upstream_blockers / stop_review`。本文所有 Rust 片段均为 **planned source contract**；目标实现仓尚不存在，未创建源文件、未实现、未运行、未测试、未形成 artifact、report、evidence、verdict、signoff 或 readiness。

## 1. Step 状态

| 项 | 记录 |
|---|---|
| 当前 Step | Step 7：逐模块定义 Trait / Port / Adapter 契约。 |
| 前序门禁 | Step 5 的七模块主轴与 Step 6 的 34 个 HLD 对象、supporting carrier、字段 / 状态 / replay 约束均已停审。 |
| 本步目标 | 固定 application-owned repository、source resolver、handoff、projection、idempotency、stored-result、technical Port 及 `infra` 实现边界；为 Step 8 协议、Step 9 flow、Step 10 状态矩阵和 Step 11 persistence 提供可回指的读取 / 写入面。Step 8 已补齐 Command / Consumer typed carrier 的对称读写面，本文件相应回填。 |
| 本步不做 | 不定义 Command / Query / Consumer / Event / Job DTO；不选 HTTP、RPC、UDS、Bus topic、CloudEvents、AG-UI、MCP/A2A/API adapter、DB、queue、schema、retry、scheduler、physical transaction 或 canonical outbox payload。 |
| 固定归属 | 仅 `application` 定义 infrastructure-facing trait / Port；`infra` 实现；`contracts` / `domain` 不定义基础设施 Port。`api` / `worker` / `jobs` 只构造、校验 entry / context carrier，并通过 Step 8 已闭合的 typed facade surface 进入 application。 |
| 当前结果 | CP01~CP07、application support、infra / entry boundary 和全局审计均已写入并完成静态复核。`L2M-UP-001~008`、`L2M-DDD-001~002` 未关闭；Command / Consumer / Job 的 typed result / receipt 对称读写均已在 Step 8 约束，本文件不再保留 callable-surface 空洞。 |
| 下一步许可 | 本 Step 已停审；不得在本文件扩展协议或实现。后续协议流只能引用 Step 8 的 typed carrier；进入 Step 9 仍需新的用户明确确认。 |

### 1.1 Step 内分批计划

| 批次 | 写入内容 | 状态 | 停审结论 |
|---:|---|---|---|
| 7.0 | 本步框架、输入、SOP 问题、模块归属、术语与红线 | completed | 不把 HLD logical seam 误写为 package dependency 或已可用 integration。 |
| 7.1 | `application` shared helper：logical UoW、versioned page、Clock、ID、digest、idempotency / replay helper | completed | 版本、cursor、watermark、source version、domain revision 各自语义不混用。 |
| 7.2 | CP01～CP03 local repository 与 host / inbound / Runtime seam | completed | presence / intake / mediation 读取与写入面完整，Runtime / host positive path 仍受 blocker 限制。 |
| 7.3 | CP04～CP05 repository 与 publication / observation seam | completed | local-first attempt / gap / trace 可承接；未创造 outbox payload 或 delivery truth。 |
| 7.4 | CP06 owner-specific resolver、mirror Store、refresh-request seam | completed | 不形成 generic external hub；safe source material 不复制 foreign body。 |
| 7.5 | CP07 rebuild-source、projection、visibility、capability-safe-view Port | completed | Query no-write、watermark / store-version 分离、outlet non-authorizing 保持成立。 |
| 7.6 | idempotency / stored-result、`infra` adapter matrix、entry 限制、fake parity | completed | duplicate 不重跑；blocked fake 不伪造 external success。 |
| 7.7 | Step 6 open-item 承接、跨模块审计、污染 / blocker 审计、回填草稿 | completed | `pass_with_upstream_blockers / stop_review`；typed Job report save/get 已闭合，Command / Consumer exact callable surface 已显式后移至 Step 8。 |

### 1.2 本步范围与强制红线

- 唯一可正向执行的成员主语仍是 `ProjectMemberRef + GlobalMemberRef`。Port 不得把 `GlobalMemberRef`、`ExternalTypedRef` 或 `Unknown` 变成第三种执行主语；`L2M-UP-008` 仍 fail-closed。
- `domain` 只接收已经加载的 local / support truth 与 body-free值；它不持有 repository、resolver、publisher、Clock、ID generator、config、SDK 或 transport。
- 写路径的 `MemberStoreVersion` **只能**来自同一 repository 的 `get_*_with_version` / `list_*_with_version` 返回值。`SourceVersion`、`ProjectionWatermark`、`MemberRepositoryCursor`、`TraceId`、`IdempotencyKey`、`PresenceRevision`、`SubscriptionScopeRevision`、`ProjectionStateRevision` 都不是 persistence optimistic version。
- Query 永远无写入：不 reserve idempotency、不 mark stale、不 refresh、不 rebuild、不 reconcile、不调用 handoff、不创建 gap。它只使用明示的 read Port。
- 任一将来可调用的 Command、Consumer、Job duplicate 都必须读取 matching typed stored result / receipt / report；缺失、kind 不匹配或 digest 不匹配必须返回 conservative error / rejection，不得重跑 domain transition、source resolution、scan、publish、handoff 或 Job。当前仅 Job 的完整 report carrier与 typed save/get 已闭合；Command / Consumer 必须待 Step 8 补齐其 carrier后才可调用。
- `L2M-UP-005` 尚未提供 canonical member event carrier、payload、source、subject、route 或 delivery contract。因此本 Step **不定义** outbox record、outbox repository、event publisher、payload snapshot、CloudEvents envelope 或内部/外部 Bus route；semantic event candidate 继续只在 HLD 语义层存在。
- host、Runtime、publication、observation、credential、source-owner、visibility 的 Port 只能输入 / 输出 typed ref、safe category、safe metadata、safe snapshot 或 blocked-aware outcome；不得返回 secret、raw body、Runtime context / plan / outcome body、tool body、policy / definition body、conversation truth、complete log、evidence 或 backend response body。
- logical `MemberUnitOfWork` 只规定 application 的本地写入协调接口。其物理事务、durability、locking、isolation、storage engine、schema 与 recovery 不在本 Step 裁决，仍受 `L2M-DDD-002` 约束并留 Step 11。

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| `project_execution_ledger.md`、`03_ddd_calibration_flow.md` | 恢复当前文档 / Step / 用户授权 / blocker / 写入门禁。 | 不把台账中的 blocked 项写成已解决契约。 |
| `03_ddd_step_05_module_contracts.md` | 七模块、依赖方向、Port 唯一归属、CP01～CP07 与实现层映射。 | 不重划业务组成部分或新增第八模块。 |
| `03_ddd_step_06_object_contracts.md` | 34 对象、supporting carrier、factory / transition、Query no-write、duplicate replay、typed ref 与状态。 | 不在 trait 关联类型或 adapter private state 中补造 Step 6 缺失字段。 |
| `02_hld_step_07_*` | 10 Command、16 Query、14 Consumer、24 semantic Event、5 Job 与 logical inward seam 分母。 | 不将 skeleton 当 exact envelope / route / payload。 |
| `02_hld_step_08_*`、`02_hld_step_09_*` | local-truth-first、append / successor、unknown fence、projection source与状态读取需求。 | 不提前写 Step 9 flow 或 Step 10 完整转换矩阵。 |
| `02_hld_step_12_detailed_design_handoff.md` | 详细设计的 Port / adapter / transaction 承接责任与回退规则。 | 不关闭其显式排除的上游 pending。 |
| 详细设计 SOP / 书写规范、真相源闭环标准、全局依赖裁剪规则 | trait 位置、函数签名、读取 / 写入面、version / UoW、page helper、cross-module audit 口径。 | 不以格式完整掩盖物理 persistence 或上游 seam 未定。 |
| `L1-governance` Step 7 | 分批、小节、停审和审计表的表达粒度。 | 不继承 Governance 的 outbox、truth snapshot、subject mapper、source family、GRC handoff 或物理实现。 |

## 3. SOP 问题回答

1. **哪些模块需要定义 trait / Port？** 只有 `application`。它是调用方，也因此拥有 repository、resolver、handoff、projection、technical、idempotency / result 的抽象。
2. **哪些模块实现这些 trait / Port？** 只有 `infra` 的 durable、in-memory fake 或 blocked-seam adapter slot。实现选择、配置和 assembly 留 `infra`；没有已经绑定的 DB、Bus、IPC、SDK 或 external provider。
3. **哪些 capability 需要接缝？** CP01～CP06 的 local / support truth 读写、CP04 / CP05 external handoff、CP06 owner-specific safe resolution、CP07 rebuild source / projection / visibility、所有 write-channel duplicate replay、Clock、ID、digest 与 logical UoW 都需要明确接缝。
4. **每个 trait 承接什么对象能力？** 下文每个 CP 的 capability 表把 `StartupAdmission` 至 `ReadProjectionPolicy`、attempt / gap、view / state、application carrier逐项映射到 Port；没有对象来源的 Port 不予创建。
5. **repository、projection、external client 的函数签名是什么？** 所有 trait 片段给出参数、返回 `Result<_, MemberPortError>`、`MemberStoreVersion` 与 `&dyn MemberUnitOfWork`；immutable append 只接受 UoW，mutable current / marker save 必须配对 expected version。application service 在其边界将 Port error 保守映射为既有 `ApplicationError`，完整协议 / 恢复映射留 Step 8 / 12。
6. **读取面是否覆盖后续步骤？** 覆盖 Command load、Query no-write read、Consumer source / duplicate、Job page / prepared attempt / open gap、projection affected-state、visibility basis 和 rebuild-source。Step 8 仍负责 DTO schema，Step 9 仍负责调用顺序。
7. **写入面的 version / UoW / append-only 是否闭合？** 已闭合为 logical contract：versioned read → matching expected version save；immutable fact append → same UoW；attempt / gap / projection / idempotency successor → versioned read + same UoW。物理实现仍 pending。
8. **哪些依赖只能经 trait？** host、credential、Runtime、publication、observation、foreign owner context、visibility basis、safe capability view 和 local persistence 都只能经 application Port；不得由 domain、entry 或 sibling crate 直连。
9. **为什么没有 outbox / event publisher trait？** `L2M-UP-005` 未给出 canonical member carrier / payload / route。编造 outbox 会把未收稳 event truth伪装成内部 persistence。只有 upstream 关闭该输入后，才能回开 Step 7 / 8。
10. **当前模块完成后如何停审？** `contracts` / `domain` 明确无 infrastructure Port；application 的 trait 归属、infra 的实现矩阵和三个 entry 模块的禁令均单列审核；CP01～CP07 逐组检查读取面、写入面和 blocker。
11. **跨模块是否有重复 Port、反向依赖或缺失 version？** 已在 §18 审计。没有 generic source hub、entry direct-store、outbox shadow、page-as-version 或 source-version-as-version 的逃逸口。

## 4. 当前材料诊断与设计取舍

| 材料 / 倾向 | 不采用的做法 | 本步取舍 |
|---|---|---|
| 旧 README 的 CloudEvents、AG-UI、UDS、launch token、supervisord、固定 port | 从历史文字推导 event envelope、IPC client、token verifier 或 host process adapter。 | 全部保留为 historical material；只定义 transport-neutral、blocked-aware host / event / Runtime seam。 |
| HLD 的 `Port / Store` skeleton | 将逻辑名称直接写成已存在的 Rust package、SDK、queue 或 DB implementation。 | 以 application trait + infra implementation slot 表达；依赖分类单列。 |
| `L2M-UP-005` 的 event缺口 | 为让 continuation "看起来可用"而自造 outbox record、payload、topic 或 `MemberFactEnvelope` wire schema。 | 不定义 publisher / outbox；只保留 committed-fact proof 和 blocked logical re-entry边界。 |
| CP06 多来源读取 | 用一个 `GenericExternalResolver` 接收任意 URL / provider / body。 | 每个 owner family 有独立 Port；只共享 body-free outcome helper，不共享 owner解释权。 |
| Step 6 的 domain revision 与 source watermark | 将任一数值当作 store compare-and-swap token。 | 新建 application-local `MemberStoreVersion`，只由 versioned repository read产生。 |
| duplicate replay | duplicate 时重新查询当前 truth、重新交给 adapter 或由 fake 成功返回。 | 已闭口的 Job 持久化 / fake必须通过 typed full report读取面回放；Command / Consumer 在 Step 8 闭口 typed carrier前不可调用。任何 future typed replay缺失即失败，不重跑。 |

## 5. 模块级 Port 归属总览

| 模块 | 定义 Port | 实现 Port | 直接调用 Port | 结论 |
|---|---:|---:|---:|---|
| `contracts` | 否 | 否 | 否 | 只定义 cross-layer typed ref、metadata、state、view、receipt / report carrier；Step 8 才定义 public protocol body。 |
| `domain` | 否 | 否 | 否 | 只定义 object / policy / invariant；所有 I/O input 在 application load / resolve 后作为 typed argument传入。 |
| `application` | 是 | 否 | 是 | 唯一 trait owner；负责 Port orchestration、logical UoW、idempotency和 no-write enforcement。 |
| `infra` | 否 | 是 | 否 | 实现 application trait；durable、fake、blocked adapter都不得改变 domain policy或 external owner。 |
| `api` | 否 | 否 | 否 | 本 Step仅构造 / 校验 entry carrier；Step 8 才将 Command / Query DTO映射到已闭口的 application facade。它不直接读 Store、resolver、handoff或 UoW。 |
| `worker` | 否 | 否 | 否 | 本 Step仅构造 / 校验已做边界解析的 entry carrier；Step 8 才定义 application re-entry。它不直连 Bus / Store / Port implementation。 |
| `jobs` | 否 | 否 | 否 | 本 Step仅构造 / 校验 logical Job entry与 report assembly；Step 8 才定义 application invocation。它不直连 scan、publisher、resolver、Store或 scheduler。 |

`infra` 可以在 composition root 中构造 Port implementation 并注入 application；该 assembly 不是 `api` / `worker` / `jobs` 对 repository 的权限。`core-contracts` 是唯一 planned compile dependency；其他关系始终保留为 runtime、event、ref、adapter 或 fake 分类。

## 6. `application` shared Port helper 与写入门禁

### 6.1 application-local helper

以下类型属于 planned `crates/application/src/unit_of_work.rs`、`ports/technical.rs` 或 `ports/stores.rs`。它们不是 Step 8 public DTO；若协议需暴露分页、watermark 或 result surface，必须由 `contracts` 在 Step 8 明确映射，不能泄漏 repository helper。

```rust
/// Opaque logical transaction reference used only inside member application coordination.
pub struct MemberTransactionRef(pub String);

/// Optimistic persistence token paired with a member-local stored object.
pub struct MemberStoreVersion(pub u64);

/// Opaque cursor used only for application repository pagination.
pub struct MemberRepositoryCursor(pub String);

/// Requests one bounded repository page.
pub struct MemberRepositoryPage {
    /// Cursor returned by a preceding repository page.
    pub cursor: Option<MemberRepositoryCursor>,
    /// Maximum number of records requested by the caller.
    pub limit: u32,
}

/// Couples one persisted value with the version required for a later mutable save.
pub struct Versioned<T> {
    /// Persisted member-local value.
    pub value: T,
    /// Version returned by the same repository read.
    pub version: MemberStoreVersion,
}

/// Returns an ordered repository page without exposing storage layout.
pub struct Page<T> {
    /// Ordered items returned by the repository.
    pub items: Vec<T>,
    /// Cursor to continue the same stable ordering when another page exists.
    pub next_cursor: Option<MemberRepositoryCursor>,
}

/// Identifies the typed member-local record family for generic technical helpers only.
pub enum MemberRecordKind {
    /// CP01 presence and host-collaboration records.
    PresenceHost,
    /// CP02 scope, inbound-fact, and screening records.
    Inbound,
    /// CP03 Runtime-mediation records.
    RuntimeMediation,
    /// CP04 outbound decision, material, attempt, and gap records.
    Outbound,
    /// CP05 trace, observation, and interaction-gap records.
    InteractionTrace,
    /// CP06 external-context snapshot, resolution, and gap records.
    ExternalContextMirror,
    /// CP07 view and projection-state records.
    ReadModel,
    /// Application technical reservation and stored-result records.
    IdempotencyResult,
}

/// Selects the finite local gap families that may affect a member projection.
/// This is application-local Port vocabulary, not a public protocol carrier.
pub enum MemberProjectionGapRef {
    /// A committed CP04 publication gap.
    Publication(PublicationGapId),
    /// A committed CP05 interaction / observation gap.
    Interaction(InteractionGapId),
    /// A committed CP06 external-context gap.
    ExternalContext(ExternalContextGapId),
}

/// Classifies the result of reserving a non-query idempotency key.
pub enum MemberIdempotencyReservation {
    /// A new operation may continue and must eventually save a matching result or conflict.
    Reserved {
        /// Local idempotency record that owns the reservation.
        record_ref: MemberIdempotencyRecordId,
    },
    /// A completed operation with the same channel, name, key, and digest must be replayed.
    Duplicate {
        /// Completed reservation whose exact channel/name/key/digest relation was matched.
        record_ref: MemberIdempotencyRecordId,
        /// Exact stored result family selected by the completed relation.
        result_kind: MemberStoredResultKind,
        /// Typed stored result pointer returned only with the matching family.
        result_ref: MemberOperationResultRef,
    },
    /// An equivalent key is currently reserved but has no completed result yet.
    InFlight {
        /// Existing reservation that must not be executed a second time.
        record_ref: MemberIdempotencyRecordId,
    },
    /// The same key was used with a distinct channel, operation, or digest.
    Conflict {
        /// Existing local reservation record.
        record_ref: MemberIdempotencyRecordId,
        /// Redacted reason for the non-replayable key reuse.
        reason_category: SafeReasonCategory,
    },
}

/// Specifies the exact local relation that a typed result save or duplicate lookup must verify.
/// It is an application-private assertion, not a Step 8 response/receipt DTO.
pub struct MemberStoredResultRelationExpectation {
    /// Reservation record that owns the fresh write or completed duplicate relation.
    pub record_ref: MemberIdempotencyRecordId,
    /// Exact result pointer selected before fresh save or returned by duplicate classification.
    pub result_ref: MemberOperationResultRef,
    /// Non-query channel whose stored result relation is being saved or replayed.
    pub channel: MemberOperationChannel,
    /// Canonical operation that must equal both the reservation and result pointer.
    pub operation_name: MemberOperationName,
    /// Original stable input digest retained by the reservation.
    pub request_digest: MemberRequestDigest,
    /// Exact stored-surface family permitted for the caller.
    pub result_kind: MemberStoredResultKind,
}

/// Classifies one body-free external or handoff seam result.
pub enum MemberExternalSeamOutcome<T> {
    /// The named owner seam returned a safe typed result.
    Completed {
        /// Body-free typed result accepted at the member boundary.
        value: T,
    },
    /// The seam cannot be positively invoked because a required contract or binding is absent.
    Blocked {
        /// Typed blocker retained from the project execution ledger.
        blocker_id: MemberProjectBlockerId,
        /// Redacted current explanation.
        reason_category: SafeReasonCategory,
    },
    /// A formal owner resolution or feedback is required before a positive result can be used.
    Waiting {
        /// Body-free relation that identifies the outstanding resolution when available.
        resolution_ref: Option<TypedRef>,
        /// Redacted current explanation.
        reason_category: SafeReasonCategory,
    },
    /// The source or side effect cannot be proven safely.
    Unknown {
        /// Redacted current explanation.
        reason_category: SafeReasonCategory,
    },
}

/// Describes a safe infrastructure-facing failure without leaking store, SDK,
/// transport, configuration, or source-body details.
pub enum MemberPortError {
    /// The requested member-local record or explicitly indexed relation is absent.
    Missing {
        /// Logical record family expected by the caller.
        record_kind: MemberRecordKind,
        /// Redacted reason that distinguishes absent from hidden or malformed input.
        reason_category: SafeReasonCategory,
    },
    /// A mutable member-local record changed after the matching versioned read.
    VersionConflict {
        /// Logical record family whose optimistic save failed.
        record_kind: MemberRecordKind,
        /// Redacted reason; adapters must not expose row, SQL, or lock details.
        reason_category: SafeReasonCategory,
    },
    /// A unique local key or append-only identity is already occupied inconsistently.
    DuplicateKey {
        /// Logical record family whose uniqueness rule was violated.
        record_kind: MemberRecordKind,
        /// Redacted reason; this is not a duplicate-operation replay result.
        reason_category: SafeReasonCategory,
    },
    /// A typed input, stored relation, or same-UoW staging rule is inconsistent.
    ConsistencyViolation {
        /// Redacted category of the violated Port contract.
        reason_category: SafeReasonCategory,
    },
    /// A local adapter cannot safely provide a required technical capability.
    DependencyUnavailable {
        /// Named blocker when the absence is already recorded in the execution ledger.
        blocker_id: Option<MemberProjectBlockerId>,
        /// Redacted availability or binding category.
        reason_category: SafeReasonCategory,
    },
}

/// Carries one owner-safe, body-free source surface before application creates
/// an immutable CP06 snapshot and purpose-specific local resolution.
pub struct ExternalContextSafeSnapshotInput {
    /// Owner-bound external identity whose safe surface was resolved.
    pub source_ref: ExternalTypedRef,
    /// Formal owner expected to interpret `source_ref`.
    pub source_owner: ExternalOwnerRef,
    /// Narrow external context family accepted by the consumer.
    pub context_kind: ExternalContextKind,
    /// Exact subject, purpose, and optional boundary scope requested.
    pub scope: ExternalContextScope,
    /// Optional owner-supplied version anchor.
    pub source_version: Option<SourceVersion>,
    /// Optional digest of the explicitly permitted safe surface.
    pub source_digest: Option<Digest>,
    /// Ordered, non-empty safe categories; no owner body is present.
    pub safe_categories: Vec<ExternalContextCategory>,
    /// Owner-supplied freshness proof used by the CP06 policy.
    pub freshness_evidence: SourceFreshnessEvidence,
    /// Boundary result proving that no forbidden body may cross into member storage.
    pub body_inspection: ForbiddenBodyInspection,
}

/// Body-free application input for one formally mapped Runtime entry invocation.
pub struct RuntimeEntrySubmission {
    /// Member-side screening decision authorizing only delivery evaluation.
    pub screening_decision_ref: ScreeningDecisionId,
    /// Body-free inbound fact context associated with the screening decision.
    pub inbound_fact_ref: InboundFactRecordId,
    /// The only forward execution subject.
    pub subject_ref: ProjectMemberRef,
    /// Formal Runtime boundary selected by a neutral local resolution.
    pub runtime_boundary_ref: RuntimeBoundaryRef,
    /// Exact entry contract reference, required for a positive submission.
    pub entry_contract_ref: RuntimeEntryContractRef,
    /// Correlation copied from the matched local screening / inbound chain.
    pub correlation: MemberCorrelation,
}

/// Body-free application input for one publication seam invocation.
pub struct MemberPublicationSubmission {
    /// Immutable local material selected for the handoff.
    pub material_ref: MemberOutboundMaterialId,
    /// Resolved target preserved by that material.
    pub target_ref: OutboundTargetRef,
    /// Formal publication boundary selected by a neutral resolution.
    pub boundary_ref: PublicationBoundaryRef,
    /// Digest of the allowed material surface; it is not a payload body.
    pub material_digest: Digest,
    /// Correlation copied from the immutable material.
    pub correlation: MemberCorrelation,
}

/// Body-free application input for one observation seam invocation.
pub struct MemberObservationSubmission {
    /// Immutable local observation material selected for the handoff.
    pub material_ref: ObservationMaterialId,
    /// Formal observation boundary selected by a neutral resolution.
    pub boundary_ref: ObservationBoundaryRef,
    /// Digest of the allowed observation surface; it is not a backend payload.
    pub material_digest: Digest,
    /// Correlation copied from the immutable material.
    pub correlation: MemberCorrelation,
}

/// Provides local time to application factories and successor creation.
pub trait MemberClockPort {
    /// Returns the current member-local application time.
    fn now(&self) -> Timestamp;
}

/// Generates opaque member-local identities; no domain object or adapter may compose these values.
pub trait MemberIdGeneratorPort {
    /// Generates a local identity for one startup admission decision.
    fn new_startup_admission_id(&self) -> StartupAdmissionId;
    /// Generates a local identity for one presence record.
    fn new_member_presence_id(&self) -> MemberPresenceId;
    /// Generates a local identity for host material or an attempt.
    fn new_host_collaboration_material_id(&self) -> HostCollaborationMaterialId;
    /// Generates a local identity for one host-collaboration attempt.
    fn new_host_collaboration_attempt_id(&self) -> HostCollaborationAttemptId;
    /// Generates a local identity for scope, inbound fact, or screening decision.
    fn new_subscription_scope_decision_id(&self) -> SubscriptionScopeDecisionId;
    /// Generates a local identity for a body-free inbound fact record.
    fn new_inbound_fact_record_id(&self) -> InboundFactRecordId;
    /// Generates a local identity for one screening decision.
    fn new_screening_decision_id(&self) -> ScreeningDecisionId;
    /// Generates a local identity for a Runtime decision, attempt, result link, or reception.
    fn new_runtime_delivery_decision_id(&self) -> RuntimeDeliveryDecisionId;
    /// Generates a local identity for one Runtime submission attempt.
    fn new_runtime_submission_attempt_id(&self) -> RuntimeSubmissionAttemptId;
    /// Generates a local identity for one Runtime result link.
    fn new_runtime_result_link_id(&self) -> RuntimeResultLinkId;
    /// Generates a local identity for one Runtime material reception.
    fn new_runtime_material_reception_id(&self) -> RuntimeMaterialReceptionId;
    /// Generates a local identity for outbound decision, material, attempt, or gap.
    fn new_outbound_decision_id(&self) -> OutboundDecisionId;
    /// Generates a local identity for immutable outbound material.
    fn new_member_outbound_material_id(&self) -> MemberOutboundMaterialId;
    /// Generates a local identity for one publication attempt.
    fn new_publication_attempt_id(&self) -> PublicationAttemptId;
    /// Generates a local identity for one publication gap.
    fn new_publication_gap_id(&self) -> PublicationGapId;
    /// Generates local identities for trace and observation records.
    fn new_interaction_trace_entry_id(&self) -> InteractionTraceEntryId;
    /// Generates a local identity for one interaction gap.
    fn new_interaction_gap_id(&self) -> InteractionGapId;
    /// Generates a local identity for immutable observation material.
    fn new_observation_material_id(&self) -> ObservationMaterialId;
    /// Generates a local identity for one observation attempt.
    fn new_observation_attempt_id(&self) -> ObservationAttemptId;
    /// Generates local identities for external-context facts.
    fn new_external_context_snapshot_id(&self) -> ExternalContextSnapshotId;
    /// Generates a local identity for a neutral external-context resolution.
    fn new_external_context_resolution_id(&self) -> ExternalContextResolutionId;
    /// Generates a local identity for an external-context gap.
    fn new_external_context_gap_id(&self) -> ExternalContextGapId;
    /// Generates local identities for immutable projection views and projection state.
    fn new_member_summary_view_id(&self) -> MemberSummaryViewId;
    /// Generates a local identity for a capability-outlet view revision.
    fn new_capability_outlet_view_id(&self) -> CapabilityOutletViewId;
    /// Generates a local identity for member projection state.
    fn new_member_projection_state_id(&self) -> MemberProjectionStateId;
    /// Generates a local identity for a diagnostic view revision.
    fn new_member_diagnostic_view_id(&self) -> MemberDiagnosticViewId;
    /// Generates application-local idempotency, stored-result, and result-surface identities.
    fn new_member_idempotency_record_id(&self) -> MemberIdempotencyRecordId;
    /// Generates a local identity for a stored operation result shell.
    fn new_stored_member_operation_result_id(&self) -> StoredMemberOperationResultId;
    /// Generates a local identity for a persisted body-free public result surface.
    fn new_member_stored_result_surface_id(&self) -> MemberStoredResultSurfaceId;
    /// Generates operation, report-assembly, report, and entry identities.
    fn new_member_operation_context_id(&self) -> MemberOperationContextId;
    /// Generates a local identity for one logical job report assembly.
    fn new_member_job_report_assembly_id(&self) -> MemberJobReportAssemblyId;
    /// Generates a local identity for one body-free member job report.
    fn new_member_job_report_id(&self) -> MemberJobReportId;
    /// Generates a logical API entry identity without naming a route or server.
    fn new_member_api_entry_ref(&self) -> MemberApiEntryRef;
    /// Generates a logical worker entry identity without naming a listener or broker.
    fn new_member_worker_entry_ref(&self) -> MemberWorkerEntryRef;
    /// Generates a logical jobs entry identity without naming a scheduler or process.
    fn new_member_job_entry_ref(&self) -> MemberJobEntryRef;
}

/// Calculates only explicitly permitted body-free digests.
pub trait MemberDigestPort {
    /// Produces a stable digest for one finite, typed, non-query canonical carrier.
    ///
    /// `MemberCanonicalDigestInput` is defined by Step 8 in `contracts`; it is
    /// deliberately not a body, generic payload, or `Vec<TypedRef>`. Query
    /// operations and any carrier containing raw body, secret, timestamp,
    /// request/trace identity, random identity, or adapter-private state are
    /// rejected before this call.
    fn request_digest(
        &self,
        context: &MemberOperationContext,
        input: &MemberCanonicalDigestInput,
    ) -> Result<MemberRequestDigest, MemberPortError>;

    /// Produces a digest for a minimized, body-free outbound material surface.
    fn material_digest(
        &self,
        allowed_refs: &[TypedRef],
        correlation: &MemberCorrelation,
    ) -> Result<Digest, MemberPortError>;
}

/// Coordinates one local member write boundary without choosing a physical transaction product.
pub trait MemberUnitOfWork {
    /// Returns an opaque transaction reference for correlation and fake assertions only.
    fn transaction_ref(&self) -> MemberTransactionRef;
}

/// Creates, commits, and rolls back member-local logical write boundaries.
pub trait MemberUnitOfWorkManager {
    /// Begins a logical local write boundary.
    async fn begin(&self) -> Result<Box<dyn MemberUnitOfWork>, MemberPortError>;

    /// Commits all staged local writes in the supplied boundary.
    async fn commit(&self, uow: Box<dyn MemberUnitOfWork>) -> Result<(), MemberPortError>;

    /// Rolls a boundary back after an application error before commit.
    async fn rollback(&self, uow: Box<dyn MemberUnitOfWork>) -> Result<(), MemberPortError>;
}
```

### 6.2 helper 口径与版本纪律

| helper | 调用方 / 实现方 | 读取 / 写入语义 | 禁止事项 |
|---|---|---|---|
| `MemberTransactionRef` / `MemberUnitOfWork` | application / infra | 关联一个 logical local write boundary；所有同一 use-case 的 local writes使用同一 `uow`。同一 Store 对带 `uow` 的 read 必须看见该 UoW 已 stage 的写入，且 commit 前不得向其它 UoW 可见。 | 不是 public transaction ID、event ID、run ID、DB transaction claim 或 evidence。 |
| `MemberStoreVersion` / `Versioned<T>` | application / repository adapter | 仅 `get_*_with_version` 或 versioned list 返回；随后 mutable save必须传回同值。 | 不以 `ExpectedRevision`、domain revision、source version、watermark、cursor 或 timestamp替代。 |
| `MemberRepositoryPage` / `Page<T>` | Query / Job application service / repository adapter | page只表达 stable ordered read continuation；public page DTO留 Step 8。 | page cursor不决定 visibility、freshness、optimistic version 或 source currentness。 |
| `MemberProjectionGapRef` | projection application service / projection adapter | 只将三类已提交 local gap 传给 affected-state lookup；application 由相应 `MemberCommittedFactRef` 分支构造。 | 不是 `TypedRef`、外部 ref、gap 文本、source event、route或未提交 gap；不创建新的 public/shared ref。 |
| `MemberClockPort` | application / infra technical adapter | factory / successor / local capture / attempt time从此获得 `Timestamp`。 | 不用 DB default、adapter response time、source time、wall-clock in domain 或 fake counter冒充 source truth。 |
| `MemberIdGeneratorPort` | application / infra technical adapter | 仅 application在 factory 前请求 local ID；load 原样重建。 | domain、entry、adapter、fake不得从 ref、route、time、digest、row、run、cursor拼接 ID。 |
| `MemberDigestPort` | application / infra technical adapter | 对 Step 8 已冻结的有限 `MemberCanonicalDigestInput` 计算稳定、body-free digest。 | 不纳入 raw body、secret、hidden reasoning、request ID、trace、timestamp、random ID、adapter private state；缺少 typed canonical projection 时必须 fail closed。 |
| `MemberIdempotencyReservation` | application / idempotency adapter | `Duplicate`必须携带 `result_kind` 与 stored result pointer；由 Step 8 对应的 typed Store getter 回放完整 carrier。`Conflict`不允许继续 mutation。 | 不能把 `Reserved` 当成功，也不能用 `ApplicationError` 文本区分 duplicate / conflict。 |
| `MemberStoredResultRelationExpectation` | application / idempotency + typed result adapter | 将 reservation、exact result pointer、channel、operation、digest和结果种类作为 fresh typed save 或 duplicate typed read 的联合断言。 | 不是结果 body、event receipt、Job report DTO或独立持久化 record；不得由 route、trace、time、cursor或 fake map构造。 |
| `MemberExternalSeamOutcome<T>` | application / owner-specific adapter or blocked seam | 表达 business-safe completed / blocked / waiting / unknown。 | 不把 transport success、SDK response、queue ack、HTTP status或 fake map转为 positive domain outcome。 |
| `MemberPortError` | application Port trait / infra implementation | 表达 local missing、version conflict、unique-key、consistency或 technical availability失败。 | 不含 SQL / DB / SDK / HTTP / IPC / config / payload / panic文本；也不替代 `Blocked` / `Waiting` / `Unknown` 业务结果。 |
| `ExternalContextSafeSnapshotInput` | owner-specific source Port / application | 将 owner-safe source input交给 CP06 snapshot / resolution factory。 | 不是 external body、credential、policy / definition、Runtime state或 generic provider result；每个 owner family仍有独立 Port。 |
| `RuntimeEntrySubmission` / `MemberPublicationSubmission` / `MemberObservationSubmission` | application handoff Port | 将已提交 local truth转成 minimal body-free seam input。 | 不是 Step 8 public DTO、event envelope、payload、route或 SDK request；adapter不得向其中补 body。 |

`MemberStoredResultRelationExpectation` 的每个字段都只能由一条既有闭口路径产生：`record_ref` 与 duplicate `result_ref` 来自 `MemberIdempotencyStore::reserve`；fresh `result_ref` 来自 application 选定的 `StoredMemberOperationResultId` 和同名 `MemberOperationResultRef`；`channel`、`operation_name` 来自已校验的 `MemberOperationContext`；`request_digest` 是同一 context 的唯一 `MemberDigestPort::request_digest` 结果；`result_kind` 是当前路径明确选择的 `JobReport`。relation 不从 Job kind、entry ref、report ID、trace、route、cursor、Store version、source ref 或 fake map反推。fresh save 只能把 relation 与同一 UoW 内的 `Reserved` record作一致性校验；duplicate read 只能把 relation 与同一已 `Completed` record作一致性校验。

| 写入类别 | 读取前提 | 写入函数要求 | UoW / 重放口径 |
|---|---|---|---|
| immutable local / support fact | 若需要关联已有 mutable subject，先读取其 versioned record；新 fact本身不需要 prior version。 | `append_*` 或 `save_new_*` 只接收 value + `uow`。 | 与同一 accepted application operation的 idempotency / stored result / local successors在同一 logical UoW 提交。 |
| mutable current / successor record | `get_*_with_version` 或 versioned lookup。 | `save_*(_, expected_version, uow)`；expected version正是该 read返回的 `MemberStoreVersion`。 | conflict / missing时不重试或私自 reload；Step 12 / 13定义错误和并发策略。 |
| projection state / availability marker | versioned state read或当前 marker lookup。 | 同样使用 matching store version；watermark只是数据字段。 | Query不能写 marker；Consumer / Job只能按照后续明确 flow写 member-local projection / marker。 |
| idempotency / stored result | `reserve` 原子地决定 `Reserved` / `Duplicate` / `InFlight` / `Conflict`；fresh `Reserved` 后必须以同一 UoW 的 `get_with_version` 取得该 staged record 的 version。当前只有 Job duplicate可调用 typed `get_job_report`; Command / Consumer typed getter留 Step 8。 | fresh Job result先以完整 report + shell调用 `save_job_report`，再以同一 version和 UoW `complete` reservation；仅 fresh、仍 `Reserved` 的 record 可在任何 local truth / result surface stage 前 `mark_conflict`。 | missing / wrong-kind stored result必须 fail closed；既有 `Conflict` 不得改写；绝不重跑。 |
| external handoff | local material / prepared attempt先已提交或在 local-first阶段写入。 | external call不与未知 physical transport成功合并为 truth write。 | `Completed`只允许产生 submission ref或 local successor；unknown只形成 explicit attempt / gap fence。 |

### 6.3 Port error 的使用边界

| 返回面 | 何时使用 | application 允许动作 | 禁止事项 |
|---|---|---|---|
| `MemberPortError::Missing` | 应已存在的 local object、索引或 stored result 缺失。 | 终止当前 fresh flow或返回 conservative result；Step 12 定义最终错误映射。 | 不隐式 create、不扫描其它 Store、不得将 missing 当 duplicate replay。 |
| `MemberPortError::VersionConflict` | 同一 repository 的 versioned read 后发生并发写冲突。 | 终止该 invocation；后续 Step 13 才定义是否由新 operation 重试。 | 不在 adapter / service 中静默 reread、merge 或用 domain revision替代。 |
| `MemberPortError::DuplicateKey` | append identity、unique index 或 staging rule冲突。 | 仅在明确 idempotency Store 返回 `Duplicate` 时进入 replay；其它 duplicate key 是一致性失败。 | 不把所有 unique conflict 都升级为业务 duplicate。 |
| `MemberPortError::ConsistencyViolation` | typed ref、subject / purpose / scope、stored-result kind、same-UoW 或 dispatch target 不一致。 | fail closed，并保持已经提交的 history不被重写。 | 不解析字符串、使用 fake private map或补默认 ref。 |
| `MemberPortError::DependencyUnavailable` | local Store / technical adapter不可用或 named blocker 无正向 binding。 | 仅映射到 local degraded / blocked / unknown surface；可保存已允许的 local gap。 | 不用默认 adapter、配置、fake success或 retry 猜测关闭上游 blocker。 |

`MemberPortError` 是 application-to-infra 的内部 typed error。它不能跨越 `contracts` 成为公开 protocol body，不能替代 Step 6 的 `ApplicationError`，也不能被 worker / jobs / api 解析来选择 service 分支。Step 8 闭口的 facade才负责将其保守映射为 `ApplicationError::{ContractViolation,DependencyUnavailable}` 或明确的 body-free receipt / response；本 Step 的 entry没有 facade调用面。所有涉及 host、Runtime、source owner、publication、observation、credential或 visibility的**业务**非正向结果必须由对应 Port 的 `MemberExternalSeamOutcome<T>` 返回，而不是由 `MemberPortError` 文本推导。

### 6.4 `contracts` 与 `domain` 模块停审

| 模块 | 审查项 | 结论 | 说明 |
|---|---|---|---|
| `contracts` | 是否定义 Store、resolver、publisher、UoW、Clock或 adapter trait | pass | 它只声明 Port 参数 / 返回会用到的 typed carrier；不反向依赖 application。 |
| `domain` | 是否调用 repository、external client或 technical generator | pass | CP01～CP07 factory / transition只接收 application已经加载或生成的 typed input；所有方法保持 pure。 |
| `domain` | 是否把 foreign result / Runtime / host / Tools / Governance / Conversation truth带入 Port | pass | 只允许 local object、typed external ref、safe classification、safe snapshot / resolution或 gap。 |

## 7. CP01 Presence / Host Collaboration：Port 与 Store 契约

### 7.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 以双锚确认 startup admission | `ProjectMemberSourcePort`、`IdentityAnchorSourcePort`、`StartupCredentialVerifierPort` | `PresenceApplicationService` | `infra::source_adapters`（当前为 blocked-aware slot） | Step 8 `AdmitMemberStartup`；Step 9 admission flow |
| 保存 admission / presence 及显式 successor | `PresenceStore` 的 exact read / append / versioned save | `PresenceApplicationService` | `infra::presence_store` | Step 9 flow；Step 11 schema / durability |
| 由已提交 presence 制备 host material / attempt | `HostCollaborationStore`、`HostCollaborationPort` | `HostCollaborationService` | `infra::host_adapter` / blocked seam | Step 8 material Command；Step 9 local-first handoff |
| 接收 host feedback ref | `HostCollaborationStore` 的 attempt / feedback read + successor append | `HostFeedbackConsumer` application service | `infra::host_feedback_adapter` | Step 8 Consumer；Step 12 late / duplicate 映射 |

### 7.2 Port / Store 表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `ProjectMemberSourcePort` | owner-specific source Port | `application::ports::cp01` | 读取 Work / project-member 的 body-free subject proof | `resolve_project_member` |
| `IdentityAnchorSourcePort` | owner-specific source Port | `application::ports::cp01` | 读取 Identity 的双锚匹配 proof | `resolve_global_member` |
| `StartupCredentialVerifierPort` | credential verification Port | `application::ports::cp01` | 验证 credential / startup 关系，仅返回 ref / safe outcome | `verify_startup_credential` |
| `HostCollaborationPort` | host handoff Port | `application::ports::cp01` | 将已制备 material 交给正式 host seam；不报告 host truth | `submit` |
| `PresenceStore` | local truth repository | `application::ports::cp01` | admission / presence 的读取、append 和 successor 保存 | `get_admission_with_version`, `find_current_presence_with_version`, `get_presence_with_version`, `append_admission`, `append_presence`, `save_presence_successor` |
| `HostCollaborationStore` | local continuation repository | `application::ports::cp01` | material / attempt / feedback link 的读取与 append | `get_material`, `get_attempt_with_version`, `list_attempts_by_presence`, `append_material`, `append_attempt`, `save_attempt_successor` |

### 7.3 exact Rust-facing 契约

```rust
/// Resolves a project member subject without returning Work or project body.
pub trait ProjectMemberSourcePort {
    async fn resolve_project_member(
        &self,
        subject_ref: ProjectMemberRef,
        scope: ExternalContextScope,
    ) -> Result<MemberExternalSeamOutcome<SourceResolutionSet>, MemberPortError>;
}

/// Resolves the global identity anchor associated with a project subject.
pub trait IdentityAnchorSourcePort {
    async fn resolve_global_member(
        &self,
        identity_anchor_ref: GlobalMemberRef,
        scope: ExternalContextScope,
    ) -> Result<MemberExternalSeamOutcome<SourceResolutionSet>, MemberPortError>;
}

/// Verifies a startup credential reference without issuing or storing credentials.
pub trait StartupCredentialVerifierPort {
    async fn verify_startup_credential(
        &self,
        credential_ref: CredentialRef,
        startup_context_ref: StartupContextRef,
        subject_ref: ProjectMemberRef,
        scope: ExternalContextScope,
    ) -> Result<MemberExternalSeamOutcome<CredentialRef>, MemberPortError>;
}

/// Hands off body-free host material; a completed result means only local seam invocation.
pub trait HostCollaborationPort {
    async fn submit(
        &self,
        material: HostCollaborationMaterial,
        idempotency_key: IdempotencyKey,
        trace_id: TraceId,
        boundary_ref: HostBoundaryRef,
    ) -> Result<MemberExternalSeamOutcome<HostSubmissionRef>, MemberPortError>;
}

/// Persists CP01 admission and presence records.
pub trait PresenceStore {
    async fn get_admission_with_version(
        &self,
        admission_ref: StartupAdmissionId,
    ) -> Result<Option<Versioned<StartupAdmission>>, MemberPortError>;
    async fn find_current_presence_with_version(
        &self,
        subject_ref: ProjectMemberRef,
    ) -> Result<Option<Versioned<MemberPresence>>, MemberPortError>;
    async fn get_presence_with_version(
        &self,
        presence_ref: MemberPresenceId,
    ) -> Result<Option<Versioned<MemberPresence>>, MemberPortError>;
    async fn append_admission(
        &self,
        admission: StartupAdmission,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<StartupAdmissionId, MemberPortError>;
    async fn append_presence(
        &self,
        presence: MemberPresence,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberPresenceId, MemberPortError>;
    async fn save_presence_successor(
        &self,
        presence: MemberPresence,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberPresenceId, MemberPortError>;
}

/// Persists CP01 host material, attempt, and feedback-link records.
pub trait HostCollaborationStore {
    async fn get_material(
        &self,
        material_ref: HostCollaborationMaterialId,
    ) -> Result<Option<HostCollaborationMaterial>, MemberPortError>;
    async fn get_attempt_with_version(
        &self,
        attempt_ref: HostCollaborationAttemptId,
    ) -> Result<Option<Versioned<HostCollaborationAttempt>>, MemberPortError>;
    async fn list_attempts_by_presence(
        &self,
        presence_ref: MemberPresenceId,
        page: MemberRepositoryPage,
    ) -> Result<Page<HostCollaborationAttempt>, MemberPortError>;
    async fn append_material(
        &self,
        material: HostCollaborationMaterial,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<HostCollaborationMaterialId, MemberPortError>;
    async fn append_attempt(
        &self,
        attempt: HostCollaborationAttempt,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<HostCollaborationAttemptId, MemberPortError>;
    async fn save_attempt_successor(
        &self,
        attempt: HostCollaborationAttempt,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<HostCollaborationAttemptId, MemberPortError>;
}
```

### 7.4 读取 / 写入与 blocker 口径

| surface | 正式语义 |
|---|---|
| `resolve_*` source Port | 只返回 `SourceResolutionSet` 或 `MemberExternalSeamOutcome`；source body、credential material、host session / health不进入 application。`Blocked` / `Waiting` / `Unknown` 由 owner contract / ledger 显式给出。 |
| `find_current_presence_with_version` | 仅按 `ProjectMemberRef` 读取当前 local presence；不得由 admission、identity 或 host ref 拼 presence ID。缺失是 `None`，不是 implicit create。 |
| `get_attempt_with_version` + `save_attempt_successor` | feedback / unknown / submitted transition 的 expected version 必须来自同一读取结果；冲突返回 `MemberPortError::VersionConflict`。 |
| host `submit` | `Completed(HostSubmissionRef)` 只允许 application 建立 `Submitted` successor；`Blocked` / `Unknown` 只能形成相应 attempt / gap surface，不得写 host accepted。 |

### 7.5 CP01 trait / port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 双锚、credential、host boundary 均有 owner-specific source seam | pass_with_upstream_blockers | `L2M-UP-001`、`L2M-UP-006` 未闭合；positive adapter 只能是 blocked slot。 |
| admission / presence / attempt 读取面具备 version 来源 | pass | `Versioned<T>` 与 explicit current lookup 已闭合；物理 durability 留 Step 11。 |
| host feedback 不改写外部 truth | pass | 只追加 feedback ref / attempt successor；不复制 payload / session / health。 |
| Step 8 / 9 可反查 | pass | 4 Commands、2 Queries、feedback Consumer 的 application 入口均有对应 Port。 |

## 8. CP02 Inbound Boundary：Port 与 Store 契约

### 8.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 建立 / 替换 subscription scope | `SubscriptionScopeStore`、`ScreeningRuleSourcePort`、presence read | `SubscriptionScopeService` | `infra::inbound_store` / `infra::source_adapters` | Step 8 两个 scope Command |
| 接收可信 inbound envelope 并丢弃 body | `InboundEventPort`、`MemberIdempotencyStore::reserve` | `InboundBoundaryService` / worker adapter | `infra::inbound_event_adapter`、`infra::idempotency_store` | Step 8 `InboundFactConsumer` |
| 形成 member-side screening | `InboundStore`、`ScreeningRuleSourcePort` | `InboundBoundaryService` | `infra::inbound_store` / blocked rule adapter | Step 8 Consumer / Query |

### 8.2 Port / Store 表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `SubscriptionScopeStore` | local truth repository | `application::ports::cp02` | scope decision versioned read / current lookup / append | `get_scope_with_version`, `find_current_scope_with_version`, `append_scope`, `save_scope_successor` |
| `InboundStore` | local intake repository | `application::ports::cp02` | inbound fact / screening read and append | `get_inbound_with_version`, `get_screening_with_version`, `append_inbound`, `append_screening` |
| `MemberIdempotencyStore` | shared technical reservation Port | `application::ports::idempotency` | consumer source identity、normalized deduplication key与body-free digest的唯一 reservation / duplicate / conflict classification | `reserve` |
| `InboundEventPort` | event boundary Port | `application::ports::cp02` | 验证 envelope、schema、source authority、body posture | `validate_and_inspect` |
| `ScreeningRuleSourcePort` | read-only CP06 consumer Port | `application::ports::cp02` | 读取 purpose-specific neutral rule resolution | `resolve_screening_rule` |

### 8.3 exact Rust-facing 契约

```rust
/// Reads and persists append-only subscription-scope decisions.
pub trait SubscriptionScopeStore {
    async fn get_scope_with_version(
        &self,
        scope_ref: SubscriptionScopeDecisionId,
    ) -> Result<Option<Versioned<SubscriptionScopeDecision>>, MemberPortError>;
    async fn find_current_scope_with_version(
        &self,
        presence_ref: MemberPresenceId,
    ) -> Result<Option<Versioned<SubscriptionScopeDecision>>, MemberPortError>;
    async fn append_scope(
        &self,
        scope: SubscriptionScopeDecision,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<SubscriptionScopeDecisionId, MemberPortError>;
    async fn save_scope_successor(
        &self,
        scope: SubscriptionScopeDecision,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<SubscriptionScopeDecisionId, MemberPortError>;
}

/// Reads and persists body-free inbound facts and screening decisions.
pub trait InboundStore {
    async fn get_inbound_with_version(
        &self,
        inbound_ref: InboundFactRecordId,
    ) -> Result<Option<Versioned<InboundFactRecord>>, MemberPortError>;
    async fn get_screening_with_version(
        &self,
        screening_ref: ScreeningDecisionId,
    ) -> Result<Option<Versioned<ScreeningDecision>>, MemberPortError>;
    async fn list_screenings_by_inbound(
        &self,
        inbound_ref: InboundFactRecordId,
        page: MemberRepositoryPage,
    ) -> Result<Page<ScreeningDecision>, MemberPortError>;
    async fn append_inbound(
        &self,
        inbound: InboundFactRecord,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<InboundFactRecordId, MemberPortError>;
    async fn append_screening(
        &self,
        screening: ScreeningDecision,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ScreeningDecisionId, MemberPortError>;
}

/// Validates a formal event boundary and performs only authorized transient inspection.
pub trait InboundEventPort {
    async fn validate_and_inspect(
        &self,
        context: &MemberOperationContext,
        source_authority_ref: SourceAuthorityRef,
        schema_version: SchemaVersion,
        scope: ExternalContextScope,
    ) -> Result<MemberExternalSeamOutcome<ScreeningInputSummary>, MemberPortError>;
}

/// Reads the CP06-neutral resolution for screening only.
pub trait ScreeningRuleSourcePort {
    async fn resolve_screening_rule(
        &self,
        policy_ref: ExternalTypedRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextResolution>, MemberPortError>;
}
```

HLD 中的 inbound deduplication 责任在本 Step 收敛为**同一个** `MemberIdempotencyStore::reserve`，不保留第二个 reservation trait、source-index Store 或 completion path。worker entry / `MemberOperationContext::from_consumer` 已固定 external `SourceEventId`、`SourceEventRef`、normalized `DeduplicationKey` 与 trace；`InboundEventPort` 必须核对其为 external Consumer source，并将 `SourceAuthorityRef`、schema 与 scope 作为未来 body-free digest / boundary validation 的正式输入。future application Consumer service对已验证 inbound context只调用一次 `reserve`：`InFlight` / `Conflict` 不得进入 inspection，`Reserved` 才可调用 `validate_and_inspect`；`Duplicate` 的 matching typed Consumer receipt read只能在 Step 8 定义 carrier/save/get与service call后发生。因此 source identity 不是“已写入 inbound fact”的证明，`InboundStore` 也不得再次 reserve、另存 result 或 complete reservation。`InboundEventPort` 返回 `ScreeningInputSummary` 前必须完成 body disposal；`ForbiddenBodyInspection::Rejected` 不能继续进入 `InboundStore`。

### 8.4 CP02 trait / port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| scope / intake / screening 三层读取写入面 | pass | current scope、inbound / screening exact reads与append均有定义。 |
| dedup 与 Consumer receipt 区分 | pass | `MemberIdempotencyStore` 是唯一 reservation owner；receipt replay 由 application result Port 承接，无第二个 inbound reservation Store。 |
| raw body / rule owner 边界 | pass_with_upstream_blockers | `L2M-UP-005`、`L2M-UP-007` 未闭合；不以 unsupported 代替 source taxonomy。 |
| Query no-write | pass | Query 只读 Store / resolution，不调用 reserve / inspect。 |

## 9. CP03 Runtime Mediation：Port 与 Store 契约

### 9.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 将 screening 转成 member-side Runtime decision | `RuntimeContractResolverPort`、`RuntimeMediationStore` | `RuntimeMediationService` | `infra::runtime_adapters` / blocked slot | Step 8 delivery Command |
| 记录 prepared / submitted / result-link successor | `RuntimeMediationStore`、`RuntimeEntryPort` | `RuntimeMediationService` | `infra::runtime_mediation_store`、`infra::runtime_entry_adapter` | Step 9 submission / late-result flow |
| 接收 Runtime committed safe material | `RuntimeMaterialSourcePort`、`RuntimeMediationStore` | Runtime material Consumer service | `infra::runtime_material_adapter` | Step 8 material Consumer |

### 9.2 Port / Store 表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `RuntimeMediationStore` | local truth repository | `application::ports::cp03` | decision / attempt / result link / reception read and append | `get_delivery_decision_with_version`, `get_submission_attempt_with_version`, `get_result_link`, `get_reception_with_version`, `append_*`, `save_attempt_successor` |
| `RuntimeContractResolverPort` | owner-specific resolver | `application::ports::cp03` | 读取 Runtime entry mapping 的 neutral resolution | `resolve_runtime_entry` |
| `RuntimeEntryPort` | Runtime handoff Port | `application::ports::cp03` | 调用 formal entry seam，仅返回 submission / optional admission ref | `submit` |
| `RuntimeAdmissionResultSourcePort` | result resolver Port | `application::ports::cp03` | 读取 owner-validated admission/result ref | `resolve_admission_result` |
| `RuntimeMaterialSourcePort` | committed-material validation Port | `application::ports::cp03` | 验证 material ref、outcome anchor、digest、body posture | `validate_material` |

### 9.3 exact Rust-facing 契约

```rust
/// Reads and persists the four CP03 local record families.
pub trait RuntimeMediationStore {
    async fn get_delivery_decision_with_version(
        &self,
        decision_ref: RuntimeDeliveryDecisionId,
    ) -> Result<Option<Versioned<RuntimeDeliveryDecision>>, MemberPortError>;
    async fn get_submission_attempt_with_version(
        &self,
        attempt_ref: RuntimeSubmissionAttemptId,
    ) -> Result<Option<Versioned<RuntimeSubmissionAttempt>>, MemberPortError>;
    async fn get_result_link(
        &self,
        link_ref: RuntimeResultLinkId,
    ) -> Result<Option<RuntimeResultLink>, MemberPortError>;
    async fn get_reception_with_version(
        &self,
        reception_ref: RuntimeMaterialReceptionId,
    ) -> Result<Option<Versioned<RuntimeMaterialReception>>, MemberPortError>;
    async fn list_attempts_by_decision(
        &self,
        decision_ref: RuntimeDeliveryDecisionId,
        page: MemberRepositoryPage,
    ) -> Result<Page<RuntimeSubmissionAttempt>, MemberPortError>;
    async fn append_delivery_decision(
        &self,
        decision: RuntimeDeliveryDecision,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<RuntimeDeliveryDecisionId, MemberPortError>;
    async fn append_submission_attempt(
        &self,
        attempt: RuntimeSubmissionAttempt,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<RuntimeSubmissionAttemptId, MemberPortError>;
    async fn append_result_link(
        &self,
        link: RuntimeResultLink,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<RuntimeResultLinkId, MemberPortError>;
    async fn append_reception(
        &self,
        reception: RuntimeMaterialReception,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<RuntimeMaterialReceptionId, MemberPortError>;
    async fn save_attempt_successor(
        &self,
        attempt: RuntimeSubmissionAttempt,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<RuntimeSubmissionAttemptId, MemberPortError>;
}

/// Resolves the exact Runtime entry mapping for one member purpose.
pub trait RuntimeContractResolverPort {
    async fn resolve_runtime_entry(
        &self,
        boundary_ref: RuntimeBoundaryRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextResolution>, MemberPortError>;
}

/// Invokes a formally mapped Runtime entry without owning Runtime loop state.
pub trait RuntimeEntryPort {
    async fn submit(
        &self,
        submission: RuntimeEntrySubmission,
        idempotency_key: IdempotencyKey,
        trace_id: TraceId,
        boundary_ref: RuntimeBoundaryRef,
    ) -> Result<MemberExternalSeamOutcome<RuntimeSubmissionRef>, MemberPortError>;
}

/// Obtains an owner-validated Runtime admission/result reference.
pub trait RuntimeAdmissionResultSourcePort {
    async fn resolve_admission_result(
        &self,
        submission_ref: RuntimeSubmissionRef,
        boundary_ref: RuntimeBoundaryRef,
    ) -> Result<MemberExternalSeamOutcome<RuntimeAdmissionDecisionRef>, MemberPortError>;
}

/// Validates a safe Runtime material handoff without returning its body.
pub trait RuntimeMaterialSourcePort {
    async fn validate_material(
        &self,
        material_ref: RuntimeSafeHandoffMaterialRef,
        outcome_ref: RuntimeOutcomeRef,
        source_ref: RuntimeSourceRef,
        metadata: RuntimeMaterialMetadata,
    ) -> Result<MemberExternalSeamOutcome<RuntimeMaterialMetadata>, MemberPortError>;
}
```

`RuntimeEntrySubmission` 已在本 Step §6.1 定义为 application-private body-free carrier；它不是 Step 8 public DTO，且不能被 adapter 扩写。public DTO 映射仍留 Step 8。`L2M-UP-003~005` 未闭合时，任何实现都只能绑定 blocked adapter slot，不能借由这个 carrier 激活正向 Runtime integration。

### 9.4 CP03 trait / port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| decision / attempt / link / reception 读取面 | pass | 每个可查询对象均有 typed read；attempt 有按 decision 分页。 |
| Runtime entry / result / material 语义分离 | pass | submitted 仅 seam invocation；result / material 只接受 owner refs。 |
| exact Runtime mapping / material carrier | pass_with_upstream_blockers | `L2M-UP-003`、`L2M-UP-004`、`L2M-UP-005` 未闭合；`RuntimeEntrySubmission` 在 Step 8 定义前不可正向绑定。 |
| unknown fence | pass | attempt successor 与 gap / evidence 由 domain + later flow 维护；Port 不自动 retry。 |

## 10. CP04 Outbound Boundary：Port 与 Store 契约

### 10.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 从 accepted Runtime reception 形成出站 decision / material | `OutboundStore`、`PublicationRouteResolverPort`、`MemberDigestPort` | `OutboundBoundaryService` | `infra::outbound_store` / owner-specific route resolver | Step 8 CP04 Consumer |
| 提交已制备 material | `PublicationHandoffPort`、attempt / gap Store surface | `PublicationRelayJob` application service | `infra::publication_adapter`（blocked until carrier / route contract exists） | Step 8 Job；Step 9 side-effect fence |
| 接收 downstream feedback | `DeliveryFeedbackSourcePort`、`OutboundStore` | delivery feedback Consumer service | `infra::downstream_feedback_adapter` | Step 8 Consumer |
| 读取 decision / publication posture | `OutboundStore` | Query service | `infra::outbound_store` | Step 8 Query mapping |

### 10.2 Port / Store 表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `OutboundStore` | local truth / continuation repository | `application::ports::cp04` | decision、material、attempt、gap 和 feedback-link 的 exact read / append / successor保存 | `get_decision_with_version`, `get_material`, `get_attempt_with_version`, `get_gap_with_version`, `list_prepared_attempts`, `append_*`, `save_*_successor` |
| `PublicationRouteResolverPort` | owner-specific route resolver | `application::ports::cp04` | 读取 outbound target / boundary 的 neutral resolution | `resolve_publication_route` |
| `PublicationHandoffPort` | publication handoff Port | `application::ports::cp04` | 向正式 publication seam 交接 minimal material | `submit` |
| `DeliveryFeedbackSourcePort` | feedback validation Port | `application::ports::cp04` | 验证 feedback 与 attempt / correlation 关系 | `validate_feedback` |

### 10.3 exact Rust-facing 契约

```rust
/// Reads and persists CP04 decision, material, attempt, and gap records.
pub trait OutboundStore {
    async fn get_decision_with_version(
        &self,
        decision_ref: OutboundDecisionId,
    ) -> Result<Option<Versioned<OutboundDecision>>, MemberPortError>;
    async fn get_material(
        &self,
        material_ref: MemberOutboundMaterialId,
    ) -> Result<Option<MemberOutboundMaterial>, MemberPortError>;
    async fn get_attempt_with_version(
        &self,
        attempt_ref: PublicationAttemptId,
    ) -> Result<Option<Versioned<PublicationAttempt>>, MemberPortError>;
    async fn get_gap_with_version(
        &self,
        gap_ref: PublicationGapId,
    ) -> Result<Option<Versioned<PublicationGap>>, MemberPortError>;
    async fn list_attempts_by_decision(
        &self,
        decision_ref: OutboundDecisionId,
        page: MemberRepositoryPage,
    ) -> Result<Page<PublicationAttempt>, MemberPortError>;
    async fn list_prepared_attempts(
        &self,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<PublicationAttempt>>, MemberPortError>;
    async fn list_open_gaps(
        &self,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<PublicationGap>>, MemberPortError>;
    async fn append_decision(
        &self,
        decision: OutboundDecision,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<OutboundDecisionId, MemberPortError>;
    async fn append_material(
        &self,
        material: MemberOutboundMaterial,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberOutboundMaterialId, MemberPortError>;
    async fn append_attempt(
        &self,
        attempt: PublicationAttempt,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<PublicationAttemptId, MemberPortError>;
    async fn append_gap(
        &self,
        gap: PublicationGap,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<PublicationGapId, MemberPortError>;
    async fn save_attempt_successor(
        &self,
        attempt: PublicationAttempt,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<PublicationAttemptId, MemberPortError>;
    async fn save_gap_successor(
        &self,
        gap: PublicationGap,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<PublicationGapId, MemberPortError>;
}

/// Resolves a target/boundary pair for one outbound purpose without selecting a route.
pub trait PublicationRouteResolverPort {
    async fn resolve_publication_route(
        &self,
        target_ref: OutboundTargetRef,
        boundary_ref: PublicationBoundaryRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextResolution>, MemberPortError>;
}

/// Sends only a material-backed body-free publication submission.
pub trait PublicationHandoffPort {
    async fn submit(
        &self,
        submission: MemberPublicationSubmission,
        idempotency_key: IdempotencyKey,
        trace_id: TraceId,
    ) -> Result<MemberExternalSeamOutcome<PublicationSubmissionRef>, MemberPortError>;
}

/// Checks that a downstream feedback ref belongs to the specified local attempt.
pub trait DeliveryFeedbackSourcePort {
    async fn validate_feedback(
        &self,
        feedback_ref: DownstreamFeedbackRef,
        attempt_ref: PublicationAttemptId,
        correlation: MemberCorrelation,
    ) -> Result<MemberExternalSeamOutcome<DownstreamFeedbackRef>, MemberPortError>;
}
```

`PublicationHandoffPort` deliberately replaces the HLD name `EventPublicationPort`: the latter implies an event carrier / Bus publication that `L2M-UP-005` has not supplied. The Port only names a body-free handoff intent; no publisher, outbox, topic, route, delivery acknowledgement, retry policy or payload snapshot is defined here.

### 10.4 CP04 trait / port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| local-first decision / material / attempt / gap read-write面 | pass | prepared attempt 和 open gap 均有 Job page read；mutable successor均有 matching version。 |
| handoff 与 event delivery 分层 | pass_with_upstream_blockers | `L2M-UP-005` 保持开放；没有 publisher / outbox / route truth。 |
| feedback 只验证 / 链接 | pass | 不能反写 decision或把 feedback-linked 当 delivery / accepted。 |
| query / Job 不越界 | pass | Query只 read；Job只读 prepared / open local candidate且通过 application调用 seam。 |

## 11. CP05 Interaction Trace：Port 与 Store 契约

### 11.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 从 committed CP01~04 fact 追加 trace / gap | `MemberFactReadPort`、`InteractionTraceStore` | `InteractionTraceService` | `infra::committed_fact_read` / `infra::trace_store` | Step 8 committed-fact Consumer |
| 生成低敏 observation material / attempt | `InteractionTraceStore`、`ObservationRouteResolverPort`、`MemberDigestPort` | observation relay application service | `infra::trace_store` / blocked handoff adapter | Step 8 Job |
| observation feedback link | `ObservationFeedbackSourcePort`、`InteractionTraceStore` | feedback Consumer service | `infra::observation_feedback_adapter` | Step 8 Consumer |
| trace / gap / posture query | `InteractionTraceStore` | Query service | `infra::trace_store` | Step 8 Query |

### 11.2 Port / Store 表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `InteractionTraceStore` | append-only local repository | `application::ports::cp05` | trace entry、interaction gap、observation material / attempt 的读取与 append / successor保存 | `get_trace_entry`, `get_gap_with_version`, `get_observation_attempt_with_version`, `list_trace_by_subject`, `list_prepared_observation_attempts`, `append_*`, `save_*_successor` |
| `MemberFactReadPort` | committed-fact validation read Port | `application::ports::read_model` | 从有限 `MemberCommittedFactRef` 读取最小 committed / correlation / subject proof | `load_committed_fact` |
| `ObservationRouteResolverPort` | owner-specific resolver | `application::ports::cp05` | 读取 observation boundary 的 neutral resolution | `resolve_observation_boundary` |
| `ObservationHandoffPort` | observation handoff Port | `application::ports::cp05` | 提交 minimal observation material | `submit` |
| `ObservationFeedbackSourcePort` | feedback validation Port | `application::ports::cp05` | 验证 observation feedback 与 local attempt | `validate_feedback` |

### 11.3 exact Rust-facing 契约

```rust
/// Reads and persists CP05 trace, gap, and observation continuation records.
pub trait InteractionTraceStore {
    async fn get_trace_entry(
        &self,
        trace_ref: InteractionTraceEntryId,
    ) -> Result<Option<InteractionTraceEntry>, MemberPortError>;
    async fn get_gap_with_version(
        &self,
        gap_ref: InteractionGapId,
    ) -> Result<Option<Versioned<InteractionGap>>, MemberPortError>;
    async fn get_observation_material(
        &self,
        material_ref: ObservationMaterialId,
    ) -> Result<Option<ObservationMaterial>, MemberPortError>;
    async fn get_observation_attempt_with_version(
        &self,
        attempt_ref: ObservationAttemptId,
    ) -> Result<Option<Versioned<ObservationAttempt>>, MemberPortError>;
    async fn list_trace_by_subject(
        &self,
        subject_ref: ProjectMemberRef,
        correlation: Option<MemberCorrelation>,
        page: MemberRepositoryPage,
    ) -> Result<Page<InteractionTraceEntry>, MemberPortError>;
    async fn list_gaps_by_subject(
        &self,
        subject_ref: ProjectMemberRef,
        page: MemberRepositoryPage,
    ) -> Result<Page<InteractionGap>, MemberPortError>;
    async fn list_prepared_observation_attempts(
        &self,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<ObservationAttempt>>, MemberPortError>;
    async fn append_trace_entry(
        &self,
        entry: InteractionTraceEntry,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<InteractionTraceEntryId, MemberPortError>;
    async fn append_gap(
        &self,
        gap: InteractionGap,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<InteractionGapId, MemberPortError>;
    async fn append_observation_material(
        &self,
        material: ObservationMaterial,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ObservationMaterialId, MemberPortError>;
    async fn append_observation_attempt(
        &self,
        attempt: ObservationAttempt,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ObservationAttemptId, MemberPortError>;
    async fn save_gap_successor(
        &self,
        gap: InteractionGap,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<InteractionGapId, MemberPortError>;
    async fn save_observation_attempt_successor(
        &self,
        attempt: ObservationAttempt,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ObservationAttemptId, MemberPortError>;
}

/// Resolves an observation boundary without exposing an observation backend.
pub trait ObservationRouteResolverPort {
    async fn resolve_observation_boundary(
        &self,
        boundary_ref: ObservationBoundaryRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextResolution>, MemberPortError>;
}

/// Hands off one already prepared low-sensitive observation submission.
pub trait ObservationHandoffPort {
    async fn submit(
        &self,
        submission: MemberObservationSubmission,
        idempotency_key: IdempotencyKey,
        trace_id: TraceId,
    ) -> Result<MemberExternalSeamOutcome<ObservationSubmissionRef>, MemberPortError>;
}

/// Checks an observation feedback reference without reading backend body/evidence.
pub trait ObservationFeedbackSourcePort {
    async fn validate_feedback(
        &self,
        feedback_ref: ObservationFeedbackRef,
        attempt_ref: ObservationAttemptId,
        correlation: MemberCorrelation,
    ) -> Result<MemberExternalSeamOutcome<ObservationFeedbackRef>, MemberPortError>;
}
```

`MemberFactReadPort` and its application-private `CommittedMemberFactRead` return only loaded typed fact family, subject, correlation and safe source refs. Their full finite shape is fixed in §13.2~§13.3. A trace Consumer may not reconstruct an object from its ID, scan a Store, or consume a semantic event body.

### 11.4 CP05 trait / port 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| committed-only trace source有正式 read surface | pass | limited union and exact read Port are reserved; body-free content remains mandatory. |
| append isolation | pass | trace append failure may create gap but cannot roll back source fact; physical ordering stays Step 9 / 11. |
| observation handoff / observed truth分离 | pass_with_upstream_blockers | route / backend / carrier未定；Port only returns local submission ref or conservative outcome. |
| query read面 | pass | trace、gap、observation material / attempt每类都有 exact lookup or bounded list。 |

## 12. CP06 External Context Mirror：owner-specific resolver 与 mirror Store

### 12.1 capability / 接缝清单

CP06 只把外部 owner 的 **安全、定用途、定范围** 结果转换为 member-local snapshot、neutral resolution 或 gap。每个 owner family 保有独立的 application Port；共享的只是 `ExternalContextSafeSnapshotInput` 与 `MemberExternalSeamOutcome<T>` 这两个 body-free carrier。

| capability | application 接缝 | 调用方 | infra 实现槽位 | 当前限制 |
|---|---|---|---|---|
| Work / project-member subject context | `WorkContextResolverPort` | `ExternalContextMirrorService`、CP01 admission 协作者 | `source_resolver(work)` | `L2M-UP-001/008` 未闭合；不返回 Work body。 |
| Identity anchor context | `IdentityContextResolverPort` | `ExternalContextMirrorService`、CP01 admission 协作者 | `source_resolver(identity)` | 只返回双锚与安全分类；不复制 Identity truth。 |
| startup credential context | `CredentialContextResolverPort` | `ExternalContextMirrorService`、CP01 credential 协作者 | `source_resolver(credential)` | `L2M-UP-006` 未闭合；不得返回 secret 或 token。 |
| Governance / screening policy context | `GovernancePolicyContextResolverPort` | `ExternalContextMirrorService`、CP02 screening | `source_resolver(governance)` | `L2M-UP-007` 未闭合；不形成 approval / authorization。 |
| Runtime entry / material context | `RuntimeContextResolverPort` | `ExternalContextMirrorService`、CP03 | `source_resolver(runtime)` | `L2M-UP-003/004` 未闭合；不返回 loop/context/plan/outcome body。 |
| Tools contract context | `ToolContractContextResolverPort` | `ExternalContextMirrorService`、CP07 outlet | `source_resolver(tools)` | 只接受 safe contract ref；不建立 registry。 |
| Method definition context | `MethodDefinitionContextResolverPort` | `ExternalContextMirrorService`、CP07 outlet | `source_resolver(method)` | 不复制 definition、provider 或 invocation 参数。 |
| host / publication / observation route context | `HostRouteContextResolverPort` | CP01/CP04/CP05、refresh service | `source_resolver(route)` | `L2M-UP-001/004/005` 未闭合；不返回 endpoint、Bus route 或 health。 |
| snapshot / resolution / gap local truth | `ExternalContextMirrorStore` | mirror service、CP06 Query、projection rebuild | `mirror_store` | immutable facts append；gap successor 要 expected version。 |
| refresh request logical dispatch | `ExternalContextRefreshDispatchPort` | `ExternalContextMirrorService`、`ExternalContextRefreshJob` | `blocked_or_job_dispatch` | 不等于 scheduler enqueue、listener ack 或 source refresh 已完成。 |

### 12.2 application-local refresh carriers

refresh carrier 只保存“要为哪个 source、purpose、scope 请求新的 owner-safe resolution”。它不能保存 refresh body、凭据、URL、队列、cron、retry 或 owner response。

```rust
/// Selects the minimum body-free input for an externally owned refresh-request carrier.
pub struct ExternalContextRefreshRequestInput {
    /// Known source identity, if it can be named without guessing.
    pub source_ref: Option<ExternalTypedRef>,
    /// Safe context family requested from the owner.
    pub context_kind: ExternalContextKind,
    /// Consumer purpose that owns the request.
    pub consumer_purpose: ExternalConsumerPurpose,
    /// Exact subject / purpose / boundary scope.
    pub required_scope: ExternalContextScope,
    /// Redacted reason selected by the application policy.
    pub reason_category: SafeReasonCategory,
}

/// Selects one owner-specific refresh target without selecting a transport route.
pub struct ExternalContextRefreshTarget {
    /// Request being continued.
    pub refresh_request_ref: ExternalRefreshRequestRef,
    /// Owner-bound source identity to resolve.
    pub source_ref: ExternalTypedRef,
    /// Owner expected to interpret the source identity.
    pub source_owner: ExternalOwnerRef,
    /// Exact context family and consumer scope.
    pub context_kind: ExternalContextKind,
    pub required_scope: ExternalContextScope,
}

/// Carries a logical refresh dispatch to a later job or owner-specific adapter.
pub struct ExternalContextRefreshDispatch {
    /// External request carrier returned by the formal owner seam.
    pub refresh_request_ref: ExternalRefreshRequestRef,
    /// Input retained by the member-local gap / job policy.
    pub request_input: ExternalContextRefreshRequestInput,
    pub target: ExternalContextRefreshTarget,
    /// Trace and duplicate metadata copied from the invoking operation.
    pub trace_id: TraceId,
    pub idempotency_key: IdempotencyKey,
}
```

| carrier | 创建条件 | 允许去向 | 禁止解释 |
|---|---|---|---|
| `ExternalContextRefreshRequestInput` | `RequestExternalContextRefresh` 已通过 context、purpose、scope 校验。 | refresh-request seam、gap 的 `request_refresh` successor、refresh job input。 | 不表示 owner 已收到或已刷新。 |
| `ExternalContextRefreshTarget` | owner kind、source ref、scope 能够被显式配对。 | 对应 owner-specific resolver。 | 不从 route、display name、last snapshot 或 config 推断 target。 |
| `ExternalContextRefreshDispatch` | owner request ref 已返回，且 target 已由 application 显式配对。 | `ExternalContextRefreshDispatchPort`。 | 不表示队列入队、调度成功、source current 或 positive resolution。 |

### 12.3 owner-specific resolver trait

所有 resolver 都返回同一 body-free `ExternalContextSafeSnapshotInput`，但 trait、输入 owner 和调用方不可合并。adapter 必须在边界完成 owner-kind、scope、freshness 和 forbidden-body 检查；`Completed` 只表示安全输入已经交给 member application，不表示 owner 的业务结论。

```rust
/// Resolves Work-owned project-member context without returning Work body.
pub trait WorkContextResolverPort {
    async fn resolve_project_member_context(
        &self,
        source_ref: ProjectMemberRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves Identity-owned global anchor context without returning identity body.
pub trait IdentityContextResolverPort {
    async fn resolve_identity_anchor_context(
        &self,
        source_ref: GlobalMemberRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves a credential relationship without issuing, reading, or storing secret material.
pub trait CredentialContextResolverPort {
    async fn resolve_credential_context(
        &self,
        source_ref: CredentialRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves Governance-owned effective policy context for one declared purpose.
pub trait GovernancePolicyContextResolverPort {
    async fn resolve_policy_context(
        &self,
        source_ref: ExternalTypedRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves Runtime entry / handoff context without importing Runtime state.
pub trait RuntimeContextResolverPort {
    async fn resolve_runtime_context(
        &self,
        source_ref: RuntimeBoundaryRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves a Tools-owned contract view without importing a registry or provider body.
pub trait ToolContractContextResolverPort {
    async fn resolve_tool_contract_context(
        &self,
        source_ref: ToolContractViewRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves a Method-owned definition reference without importing definition content.
pub trait MethodDefinitionContextResolverPort {
    async fn resolve_method_definition_context(
        &self,
        source_ref: MethodDefinitionRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}

/// Resolves host / publication / observation route context without selecting a transport.
pub trait HostRouteContextResolverPort {
    async fn resolve_host_route_context(
        &self,
        source_ref: ExternalTypedRef,
        scope: ExternalContextScope,
        freshness: SourceFreshnessEvidence,
    ) -> Result<MemberExternalSeamOutcome<ExternalContextSafeSnapshotInput>, MemberPortError>;
}
```

`GovernancePolicyContextResolverPort` 和 `HostRouteContextResolverPort` 的 `ExternalTypedRef` 参数必须在 application 入口先校验 expected owner kind；不得由 adapter 接收任意 URL / provider key 后自行选择 owner。若 owner contract 未闭合，adapter 只能返回 `Blocked { blocker_id, .. }`、`Waiting` 或 `Unknown`；不得返回带默认分类的 `Completed`。

### 12.4 mirror Store exact read / write surface

```rust
/// Persists immutable CP06 snapshots/resolutions and versioned gap successors.
pub trait ExternalContextMirrorStore {
    async fn get_snapshot_with_version(
        &self,
        snapshot_ref: ExternalContextSnapshotId,
    ) -> Result<Option<Versioned<ExternalContextSnapshot>>, MemberPortError>;
    async fn list_snapshots_by_source(
        &self,
        source_ref: ExternalTypedRef,
        scope: ExternalContextScope,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<ExternalContextSnapshot>>, MemberPortError>;
    async fn get_resolution_with_version(
        &self,
        resolution_ref: ExternalContextResolutionId,
    ) -> Result<Option<Versioned<ExternalContextResolution>>, MemberPortError>;
    async fn list_resolutions_for_purpose(
        &self,
        source_ref: ExternalTypedRef,
        purpose: ExternalConsumerPurpose,
        scope: ExternalContextScope,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<ExternalContextResolution>>, MemberPortError>;
    async fn get_gap_with_version(
        &self,
        gap_ref: ExternalContextGapId,
    ) -> Result<Option<Versioned<ExternalContextGap>>, MemberPortError>;
    async fn list_open_gaps(
        &self,
        subject_ref: ProjectMemberRef,
        purpose: Option<ExternalConsumerPurpose>,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<ExternalContextGap>>, MemberPortError>;
    async fn append_snapshot(
        &self,
        snapshot: ExternalContextSnapshot,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ExternalContextSnapshotId, MemberPortError>;
    async fn append_resolution(
        &self,
        resolution: ExternalContextResolution,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ExternalContextResolutionId, MemberPortError>;
    async fn append_gap(
        &self,
        gap: ExternalContextGap,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ExternalContextGapId, MemberPortError>;
    async fn save_gap_successor(
        &self,
        gap: ExternalContextGap,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<ExternalContextGapId, MemberPortError>;
}

/// Requests an owner-owned refresh carrier without choosing a scheduler or broker.
pub trait ExternalContextRefreshRequestPort {
    async fn request_refresh(
        &self,
        input: ExternalContextRefreshRequestInput,
        idempotency_key: IdempotencyKey,
        trace_id: TraceId,
    ) -> Result<MemberExternalSeamOutcome<ExternalRefreshRequestRef>, MemberPortError>;
}

/// Records only a logical refresh handoff after an owner request carrier exists.
pub trait ExternalContextRefreshDispatchPort {
    async fn dispatch(
        &self,
        dispatch: ExternalContextRefreshDispatch,
    ) -> Result<MemberExternalSeamOutcome<ExternalRefreshRequestRef>, MemberPortError>;
}
```

### 12.5 CP06 read / write / version discipline

| surface | exact rule |
|---|---|
| snapshot | immutable `append_snapshot` only；同一 source change 必须新 ID。`get_snapshot_with_version` 的 version 只用于读取审计，不能拿来修改 snapshot。 |
| resolution | purpose / scope 独立 immutable record；`Resolved` 必须回链 committed snapshot。新 evidence / source version 追加新 resolution，不原地升级旧 status。 |
| gap | `get_gap_with_version` → domain successor (`request_refresh` / `resolve` / `supersede`) → `save_gap_successor(expected_version,uow)`；不 reload、merge 或静默重试。 |
| refresh request | application sends `ExternalContextRefreshRequestInput` through the owner-specific request Port; only `Completed(ExternalRefreshRequestRef)` may be linked by gap `request_refresh` in a local same-UoW successor. Member does not persist or version the foreign request. |
| refresh dispatch | dispatch 只在 request / target 已明确时调用；`Completed` 仅表示逻辑 dispatch surface 可接受，不能写 `Resolved` 或 source current。 |
| page | page cursor 只延续稳定排序；不能代替 `MemberStoreVersion`、source version、freshness 或 `ProjectionWatermark`。 |
| failure | owner unavailable / contract pending / unknown 形成 explicit resolution / gap；不创建默认 snapshot、不复制 last-known body-free categories 作为 current。 |

### 12.6 CP06 trait / port 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 八个 owner family 是否各有独立 resolver | pass_with_upstream_blockers | Work、Identity、Credential、Governance、Runtime、Tools、Method、Host/Route 均独立；未引入 generic resolver。 |
| snapshot / resolution / gap / refresh 读写面 | pass | exact lookup、bounded list、append 与 versioned successor 均有签名。 |
| body-free / neutral / purpose isolation | pass | resolver 只返回安全 carrier；resolution 永不成为 authorization、health、acceptance 或 invocation。 |
| refresh dispatch 是否伪装 scheduler / event | pass | 仅 logical dispatch；没有 queue、topic、CloudEvents、ack、cron 或 route。 |
| blocker 是否被关闭 | pass_with_upstream_blockers | `L2M-UP-001/003/004/005/006/007/008` 仍开放；无默认 adapter / fake success。 |

## 13. CP07 Member Read Model：rebuild source、projection 与 visibility Port

### 13.1 capability / 接缝清单

CP07 的所有 read 与 rebuild source 都来自已提交的 member-local fact、已提交的 neutral resolution / gap 或已验证的 body-free visibility basis。它不读取 event body，不访问 capability registry，也不把 query 变成 refresh / rebuild 触发器。

| capability | application 接缝 | 调用方 | infra 实现槽位 | 关键红线 |
|---|---|---|---|---|
| CP01~06 committed-fact proof / rebuild input | `MemberFactReadPort` | trace service、read-model service、projection job | `committed_fact_read` | 只读取已提交 local fact；不从 event / outbox / cache candidate 重建。 |
| CP06 neutral resolution / gap source | `ExternalResolutionReadPort` | read-model service、projection job、query assembler | `mirror_read` | resolution 不是 authorization；gap 不能被读操作关闭。 |
| optional Tools / Method safe outlet refs | `ToolSafeViewReadPort` | capability-outlet projection | `safe_view_read` | ref-only；不读 registry / definition / provider body，也不授权 invocation。 |
| formal visibility basis | `ProjectionVisibilityBasisReadPort` | three Query application services | `visibility_basis_read` | query 只读 local safe basis；缺失时以 restricted / denied / unknown 响应。 |
| view / state / affected-state read-write | `MemberProjectionStore` | read-model service、projection consumers、jobs、Query service | `projection_store` | view append-only；state successor versioned；`ProjectionWatermark` 绝非 CAS token。 |

### 13.2 application-private read carrier

`CommittedMemberFactRead` 是 CP05 已引用、在此正式闭合的 application-private body-free carrier。它让调用方得到已加载事实的最小证明，而非用 `MemberCommittedFactRef` 在 entry、fake 或 projection service 中猜测应该读哪个 Store。

```rust
/// Classifies the finite member-local source family of a committed fact read.
pub enum MemberCommittedFactFamily {
    /// CP01 presence or host-collaboration fact.
    PresenceHost,
    /// CP02 subscription, inbound, or screening fact.
    Inbound,
    /// CP03 Runtime-mediation fact.
    RuntimeMediation,
    /// CP04 outbound decision, material, attempt, or gap fact.
    Outbound,
    /// CP05 interaction trace, observation material, attempt, or gap fact.
    InteractionTrace,
    /// CP06 snapshot, neutral resolution, or external-context gap fact.
    ExternalContextMirror,
}

/// Provides the minimal body-free proof for an already committed member fact.
pub struct CommittedMemberFactRead {
    /// Exact local fact selected by a finite typed reference.
    pub fact_ref: MemberCommittedFactRef,
    /// Source family required by the consuming policy.
    pub family: MemberCommittedFactFamily,
    /// The only project-scoped member subject represented by the fact.
    pub subject_ref: ProjectMemberRef,
    /// Correlation retained when the source fact family has one.
    pub correlation: Option<MemberCorrelation>,
    /// Ordered unique body-free local or owner-bound references required for policy checks.
    pub safe_source_refs: Vec<TypedRef>,
}

/// Carries one bounded, committed-only projection-source page.
pub struct MemberProjectionSourcePage {
    /// Committed fact reads in the repository's stable ordering.
    pub facts: Vec<CommittedMemberFactRead>,
    /// Highest committed source position covered by this page snapshot.
    pub covered_watermark: ProjectionWatermark,
    /// Opaque continuation for the same stable source ordering.
    pub next_cursor: Option<MemberRepositoryCursor>,
}

/// Holds only externally owned safe references usable by the optional capability outlet.
pub struct ToolSafeViewSet {
    /// Tools-owned safe contract view references.
    pub tool_contract_refs: Vec<ToolContractViewRef>,
    /// Safe capability-binding references associated with the contract views.
    pub capability_binding_refs: Vec<CapabilityBindingViewRef>,
    /// Method-owned definition references without definition contents.
    pub method_definition_refs: Vec<MethodDefinitionRef>,
    /// Neutral local resolutions proving the declared source scope.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
}

/// Represents a formal body-free basis for one projection visibility evaluation.
pub struct ProjectionVisibilityBasisRead {
    /// Subject for which the basis was resolved.
    pub subject_ref: ProjectMemberRef,
    /// Projection kind constrained by the basis.
    pub projection_kind: MemberProjectionKind,
    /// Formal owner-provided basis; it does not carry authorization body.
    pub basis_ref: ProjectionVisibilityBasisRef,
}
```

| carrier | required invariant | forbidden use |
|---|---|---|
| `CommittedMemberFactRead` | `fact_ref` must be committed, `family` must match the fact variant, and all refs must be body-free. A trace path requiring correlation rejects `None`; it does not invent a correlation. | It is not an event payload, general repository row, source-body cache or authorization decision. |
| `MemberProjectionSourcePage` | `covered_watermark` describes only committed-source coverage of this read. | It cannot be passed as `MemberStoreVersion`, source version, time, result key or view ID. |
| `ToolSafeViewSet` | all vectors are ordered-unique; every listed resolution must be purpose/scope compatible with the outlet request. | It cannot contain a Tool/Method definition, registry entry, provider route, execution request or approval. |
| `ProjectionVisibilityBasisRead` | the basis must match both requested subject and projection kind. | It does not authorize Runtime/Tools action and cannot be inferred from actor display data, route, cursor or loaded view. |

### 13.3 committed source / resolution / safe-view read Port

```rust
/// Reads already committed member facts without exposing repository topology.
pub trait MemberFactReadPort {
    async fn load_committed_fact(
        &self,
        fact_ref: MemberCommittedFactRef,
    ) -> Result<Option<CommittedMemberFactRead>, MemberPortError>;
    async fn list_committed_projection_sources(
        &self,
        subject_ref: ProjectMemberRef,
        up_to_watermark: ProjectionWatermark,
        page: MemberRepositoryPage,
    ) -> Result<MemberProjectionSourcePage, MemberPortError>;
}

/// Reads committed CP06 neutral resolutions and gaps for declared member consumption.
pub trait ExternalResolutionReadPort {
    async fn get_resolution(
        &self,
        resolution_ref: ExternalContextResolutionId,
    ) -> Result<Option<ExternalContextResolution>, MemberPortError>;
    async fn find_resolution(
        &self,
        source_ref: ExternalTypedRef,
        purpose: ExternalConsumerPurpose,
        scope: ExternalContextScope,
    ) -> Result<Option<ExternalContextResolution>, MemberPortError>;
    async fn list_resolutions_for_projection(
        &self,
        subject_ref: ProjectMemberRef,
        page: MemberRepositoryPage,
    ) -> Result<Page<ExternalContextResolution>, MemberPortError>;
    async fn get_gap(
        &self,
        gap_ref: ExternalContextGapId,
    ) -> Result<Option<ExternalContextGap>, MemberPortError>;
    async fn list_gaps_for_projection(
        &self,
        subject_ref: ProjectMemberRef,
        page: MemberRepositoryPage,
    ) -> Result<Page<ExternalContextGap>, MemberPortError>;
}

/// Reads only owner-safe capability references already accepted through CP06.
pub trait ToolSafeViewReadPort {
    async fn read_safe_views(
        &self,
        subject_ref: ProjectMemberRef,
        scope: ExternalContextScope,
        resolution_refs: Vec<ExternalContextResolutionId>,
    ) -> Result<MemberExternalSeamOutcome<ToolSafeViewSet>, MemberPortError>;
}

/// Reads an already formalized visibility basis without invoking an authorization engine.
pub trait ProjectionVisibilityBasisReadPort {
    async fn read_visibility_basis(
        &self,
        actor: ActorContext,
        subject_ref: ProjectMemberRef,
        projection_kind: MemberProjectionKind,
    ) -> Result<MemberExternalSeamOutcome<ProjectionVisibilityBasisRead>, MemberPortError>;
}
```

`MemberFactReadPort` is the only planned source trait for committed member proof. This avoids two adapters that could disagree over committed proof. `ExternalResolutionReadPort` is read-only even when its implementation delegates to CP06 storage; it cannot refresh, append a snapshot or save a gap successor.

### 13.4 projection Store exact read / write surface

```rust
/// Persists immutable projection revisions and versioned projection-state successors.
pub trait MemberProjectionStore {
    async fn get_summary_view(
        &self,
        view_ref: MemberSummaryViewId,
    ) -> Result<Option<MemberSummaryView>, MemberPortError>;
    async fn find_latest_summary_view(
        &self,
        subject_ref: ProjectMemberRef,
    ) -> Result<Option<MemberSummaryView>, MemberPortError>;
    async fn get_capability_outlet_view(
        &self,
        view_ref: CapabilityOutletViewId,
    ) -> Result<Option<CapabilityOutletView>, MemberPortError>;
    async fn find_latest_capability_outlet_view(
        &self,
        subject_ref: ProjectMemberRef,
    ) -> Result<Option<CapabilityOutletView>, MemberPortError>;
    async fn get_diagnostic_view(
        &self,
        view_ref: MemberDiagnosticViewId,
    ) -> Result<Option<MemberDiagnosticView>, MemberPortError>;
    async fn find_latest_diagnostic_view(
        &self,
        subject_ref: ProjectMemberRef,
    ) -> Result<Option<MemberDiagnosticView>, MemberPortError>;
    async fn get_projection_state_with_version(
        &self,
        state_ref: MemberProjectionStateId,
    ) -> Result<Option<Versioned<MemberProjectionState>>, MemberPortError>;
    async fn find_projection_state_with_version(
        &self,
        subject_ref: ProjectMemberRef,
        projection_kind: MemberProjectionKind,
    ) -> Result<Option<Versioned<MemberProjectionState>>, MemberPortError>;
    async fn list_projection_states_affected_by_fact(
        &self,
        fact_ref: MemberCommittedFactRef,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<MemberProjectionState>>, MemberPortError>;
    async fn list_projection_states_affected_by_resolution(
        &self,
        resolution_ref: ExternalContextResolutionId,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<MemberProjectionState>>, MemberPortError>;
    async fn list_projection_states_affected_by_gap(
        &self,
        gap_ref: MemberProjectionGapRef,
        page: MemberRepositoryPage,
    ) -> Result<Page<Versioned<MemberProjectionState>>, MemberPortError>;
    async fn append_summary_view(
        &self,
        view: MemberSummaryView,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberSummaryViewId, MemberPortError>;
    async fn append_capability_outlet_view(
        &self,
        view: CapabilityOutletView,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<CapabilityOutletViewId, MemberPortError>;
    async fn append_diagnostic_view(
        &self,
        view: MemberDiagnosticView,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberDiagnosticViewId, MemberPortError>;
    async fn save_projection_state_successor(
        &self,
        state: MemberProjectionState,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberProjectionStateId, MemberPortError>;
}
```

### 13.5 CP07 read / rebuild / watermark discipline

| concern | exact contract |
|---|---|
| Query read | Query uses only `find_latest_*_view` / projection-state reads / `ExternalResolutionReadPort` / `ProjectionVisibilityBasisReadPort`. It must never call `append_*`, `save_projection_state_successor`, source resolver, refresh dispatcher, handoff, idempotency reservation or job service. |
| state mutation | projection Consumer or Job first obtains `Versioned<MemberProjectionState>` from the **same** `MemberProjectionStore`, then saves a domain-produced successor with that exact `MemberStoreVersion` and same UoW. |
| immutable view | summary/outlet/diagnostic revisions are append-only. An affected-state marker may make an old view stale but never overwrites it. |
| affected lookup | only `list_projection_states_affected_by_*` selects states to mark stale/rebuild. Gap lookup accepts the finite local `MemberProjectionGapRef` only; entry modules, adapter private maps and source/event names must not infer affected state. |
| rebuild input | `MemberFactReadPort` returns committed proof and covered watermark; `ExternalResolutionReadPort` adds body-free resolution/gap evidence; `ToolSafeViewReadPort` is optional and source-safe. No rebuild reads raw owner state. |
| watermark separation | `ProjectionWatermark` describes source coverage. It is not a repository version, record revision, timestamp, source version, cursor or compare-and-swap token. |
| outlet boundary | `ToolSafeViewReadPort::Completed` supplies safe display refs only. `CapabilityOutletStatus::Available` neither grants invocation authority nor signals Tools/Method provider availability. |
| missing/unknown visibility | a non-positive basis outcome produces conservative `ReadVisibilityDecision`; the Query returns its explicit not-visible/restricted/no-ready surface and does no repair. |

### 13.6 CP07 trait / port 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP05/CP07 committed proof是否只有一个 trait | pass | 只有 `MemberFactReadPort`；无平行 Store scan。 |
| Query no-write | pass | 三个 Query 的读取面和禁止调用面已明确。 |
| projection state version / watermark 分离 | pass | version 仅来自 `find/get_projection_state_with_version`；watermark 仅表达 source coverage。 |
| affected-state lookup / rebuild input | pass | fact、resolution、gap各有 typed affected lookup；rebuild只有 committed / safe source page。 |
| outlet是否变成 registry或执行入口 | pass | ref-only、optional、non-authorizing；无 Tools package、provider、execution adapter。 |
| visibility owner / event carrier blocker | pass_with_upstream_blockers | visibility basis和 member event carrier仍受 `L2M-UP-005` 等限制；nonpositive结果保持显式。 |

## 14. `application`：idempotency、stored-result 与 callable-surface boundary

### 14.1 capability / 接缝清单

`MemberIdempotencyRecord`、`StoredMemberOperationResult`、`MemberOperationContext`、`MemberJobReportAssembly` 与九个 named service 已由 Step 6 取得唯一对象归属。本节固定 application-owned technical read / write Port，并回指 Step 8 已闭合的 typed protocol / service surface；不把协议 transport、物理存储或外部 owner truth引入 application。

| capability / 对象能力 | 需要的接缝 | 调用方 | infra 实现槽位 | 后续承接 |
|---|---|---|---|---|
| 对非 Query operation 原子保留或分类同一 key / channel / operation / digest | `MemberIdempotencyStore::reserve` | nine named application services | `idempotency_store` | Step 8 metadata / result schema；Step 9 use-case flow；Step 13 concurrency |
| 保存 / 重放已闭口的 Job public report | `MemberStoredResultStore::save_job_report` / `get_job_report` | Job application service，随后 jobs mapper | `stored_result_store` | Step 8 Job protocol mapping；Step 13 replay fence |
| 保存 / 重放 Command result、Command rejection 或 Consumer receipt | `MemberStoredResultStore::save_command_result` / `get_command_result`、`save_command_rejection` / `get_command_rejection`、`save_consumer_receipt` / `get_consumer_receipt` | named Command / Consumer application service | `stored_result_store` | Step 8 protocol contract；Step 13 replay fence |
| 完成 reservation 或记录同 key 不匹配冲突 | `MemberIdempotencyStore::complete` / `mark_conflict` | fresh non-query application service | `idempotency_store` | Step 9 same-UoW ordering |
| 将 Step 5 的 nine service ownership 保留为 composition shape | `MemberApplicationFacade` / `MemberServiceRoute` | future Step 8 entry-to-service mapper | future composition root | Step 8 exact DTO→service method / selector / source map；Step 9 function flow |

### 14.2 idempotency / stored-result exact Port

`MemberIdempotencyStore` 是所有 Command、Consumer、Job 的**唯一** reservation owner。Inbound Consumer 以 `MemberOperationContext::from_consumer` 固定的 source identity 与由 `DeduplicationKey` 归一出的 key 进入同一 `reserve`；不存在第二个 inbound reservation trait、source-index Store、result Store、completion path 或 parallel replay。Query 不持有 key、digest、reservation 或 stored result。

```rust
/// Reserves and completes the one technical replay record for every non-query member operation.
pub trait MemberIdempotencyStore {
    /// Atomically reserves or classifies the context's key/channel/operation/digest tuple.
    async fn reserve(
        &self,
        context: &MemberOperationContext,
        request_digest: MemberRequestDigest,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberIdempotencyReservation, MemberPortError>;

    /// Completes a reserved record only after a matching stored result is staged in the same UoW.
    async fn complete(
        &self,
        record_ref: MemberIdempotencyRecordId,
        result_ref: MemberOperationResultRef,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberIdempotencyRecordId, MemberPortError>;

    /// Records a key-reuse conflict without creating a replayable result.
    async fn mark_conflict(
        &self,
        record_ref: MemberIdempotencyRecordId,
        reason_category: SafeReasonCategory,
        expected_version: MemberStoreVersion,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberIdempotencyRecordId, MemberPortError>;

    /// Returns a completed record only when later flow needs to prove its exact local relation.
    async fn get_with_version(
        &self,
        record_ref: MemberIdempotencyRecordId,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<Option<Versioned<MemberIdempotencyRecord>>, MemberPortError>;
}

/// Stores and reads the finite typed public result carriers closed by Step 8.
///
/// Every write channel has a symmetric save/get pair. The methods accept only
/// the named contracts-owned carriers; a generic payload, shell-only surface
/// reference, or current-truth reconstruction is not a valid implementation.
pub trait MemberStoredResultStore {
    /// Stages one fresh accepted / conservative Command result value and its shell in one UoW.
    async fn save_command_result(
        &self,
        relation: MemberStoredResultRelationExpectation,
        result: StoredMemberOperationResult,
        value: MemberStoredCommandValue,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberOperationResultRef, MemberPortError>;

    /// Reads the complete stored Command value selected by a matching duplicate relation.
    async fn get_command_result(
        &self,
        relation: MemberStoredResultRelationExpectation,
    ) -> Result<Option<MemberStoredCommandValue>, MemberPortError>;

    /// Stages one fresh Command rejection and its shell in one UoW.
    async fn save_command_rejection(
        &self,
        relation: MemberStoredResultRelationExpectation,
        result: StoredMemberOperationResult,
        rejection: MemberCommandRejection,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberOperationResultRef, MemberPortError>;

    /// Reads the complete stored Command rejection selected by a matching duplicate relation.
    async fn get_command_rejection(
        &self,
        relation: MemberStoredResultRelationExpectation,
    ) -> Result<Option<MemberCommandRejection>, MemberPortError>;

    /// Stages one fresh Consumer receipt and its shell in one UoW.
    async fn save_consumer_receipt(
        &self,
        relation: MemberStoredResultRelationExpectation,
        result: StoredMemberOperationResult,
        receipt: MemberConsumerReceipt,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberOperationResultRef, MemberPortError>;

    /// Reads the complete stored Consumer receipt selected by a matching duplicate relation.
    async fn get_consumer_receipt(
        &self,
        relation: MemberStoredResultRelationExpectation,
    ) -> Result<Option<MemberConsumerReceipt>, MemberPortError>;

    /// Stages one fresh `JobReport` shell and the complete body-free public report in one UoW.
    async fn save_job_report(
        &self,
        relation: MemberStoredResultRelationExpectation,
        result: StoredMemberOperationResult,
        report: MemberJobReport,
        uow: &dyn MemberUnitOfWork,
    ) -> Result<MemberOperationResultRef, MemberPortError>;

    /// Reads the complete stored Job report selected by a matching duplicate relation.
    async fn get_job_report(
        &self,
        relation: MemberStoredResultRelationExpectation,
    ) -> Result<Option<MemberJobReport>, MemberPortError>;
}
```

`MemberStoredResultSurfaceRef` remains only a local stored-surface identity. It is **not** a substitute for a complete replay carrier and is not returned by the callable Store trait. Each `save_*` method accepts the complete contracts-owned carrier and its matching shell, saves both in the caller's UoW, and returns only the exact `relation.result_ref`; each `get_*` method verifies the completed reservation and every relation field before returning the complete carrier. The adapter must enforce these result-kind/channel pairs: `CommandResult` + `Command`, `CommandRejection` + `Command`, `ConsumerReceipt` + `InboundConsumer`, and `JobReport` + `OperationsJob`. The shell kind, shell/result pointer, operation name, reservation record, request digest, and carrier-specific operation / source identity must all agree. `None` means no matching complete carrier exists; a wrong kind, result pointer, channel, operation, digest, source identity, or body shape is `ConsistencyViolation` / `Missing`, never a replay. No fake may rebuild a carrier from a shell, current Store state, report assembly, source scan or private map.

`StoredMemberOperationResult::from_surface(...)` remains the Step 6 factory for forming a shell after application selected a generated `result_id`, the exact `MemberOperationResultRef`, `context.operation_name`, legal result kind, local surface ref and `context.trace_id`; it rejects Query and cannot derive name, kind, result ref, channel or digest from a surface ref. Step 8 now closes the Command value / rejection and Consumer receipt carriers and their symmetric Store methods; application services may call only the method matching their fixed operation and result kind. The complete canonical input and replay relation are described in Step 8 §§11–12; algorithm and physical durability remain later-step concerns.

### 14.3 exact reservation and replay discipline

| situation | required application + Port behavior | forbidden behavior |
|---|---|---|
| Query | Call `context.assert_query_no_write()` and read only the declared view / visibility Ports. | Calling `MemberDigestPort::request_digest` for replay, `reserve`, any stored-result getter, `complete`, or `mark_conflict`. |
| fresh Job | Obtain one canonical body-free digest; call `reserve` in the logical UoW. On `Reserved`, read that same staged record with `get_with_version(record_ref, uow)`; only if it is still `Reserved` may application stage local truth, the complete `MemberJobReport` and matching JobReport shell by `save_job_report`, then `complete` with that returned version in the same UoW. | Treating reservation as a result, completing before typed report save, carrying an unresolved external effect as positive completion, reading another UoW's record, or leaving a fresh report outside the reservation UoW. |
| exact duplicate Job | `Duplicate { record_ref, result_kind: JobReport, result_ref }` must be paired with a relation copied from the completed record's channel, operation name and digest, **and the same `result_ref` returned by reserve**, plus `JobReport`; call `get_job_report`. | Re-running domain transition, source resolver, scan, handoff, publication, observation, refresh, projection rebuild, or creating a new report. |
| fresh / duplicate Command | `Reserved` uses `save_command_result` or `save_command_rejection` in the same UoW; `Duplicate { result_kind: CommandResult | CommandRejection, result_ref }` uses the matching typed getter and returns the complete carrier. | Using `MemberStoredResultSurfaceRef`, a generic `save`, current truth, shell-only `get`, adapter response, fake map or a newly invented DTO as a Command result/rejection. |
| fresh / duplicate Consumer | `Reserved` uses `save_consumer_receipt` in the same UoW; `Duplicate { result_kind: ConsumerReceipt, result_ref }` uses `get_consumer_receipt` and returns the complete receipt. | Re-inspecting source body, rescanning, rerunning service, using a shell/ref as a receipt, or fabricating an acknowledgement. |
| same key, distinct channel / operation / digest | Receive `Conflict`; this invocation does not call `mark_conflict`, because the existing record may be completed, in-flight or already conflict. `mark_conflict` is reserved for the fresh caller's own versioned `Reserved` record when that caller detects a local pre-result consistency failure and the same-UoW flow permits a terminal conflict successor. | Reclassifying as duplicate, overwriting a completed/in-flight/conflict record, returning a current Store read as a replay, or silently choosing a new key. |
| equal key/digest but unfinished reservation | Receive `InFlight`; return the typed in-flight surface defined by Step 8 / later error mapping. | Waiting by busy loop, retrying internally, executing a second copy, or manufacturing a stored result. |
| missing stored carrier | The matching typed getter returns `None`; application maps it to the appropriate stored-result-unavailable error and fails closed for Command, Consumer, or Job. | Falling back to a shell-only read, current truth, adapter response, fake map, report assembly, source scan or a second execution. |
| wrong Job kind | `save_job_report` / `get_job_report` detect any non-`JobReport` shell or relation and return `ConsistencyViolation`. | Coercing CommandResult, CommandRejection or ConsumerReceipt into a Job report, or selecting by result ID alone. |
| wrong Job operation/channel/digest/result pointer | `save_job_report` / `get_job_report` verify every relation field — record ref, result ref, channel, operation, digest and kind — against reservation, shell and report before saving or returning. | Treating a matching key, trace, job invocation, route or time as sufficient replay proof. |

`MemberStoreVersion` used by `complete` / `mark_conflict` comes only from the same `MemberIdempotencyStore::get_with_version(record_ref, uow)` read when a successor write is needed. The `uow` argument is mandatory so a fresh reservation staged by `reserve` is visible to the subsequent versioned read without exposing it to another UoW. `complete` and `mark_conflict` must reject a missing record, a record from another UoW, or a record whose state is not exactly `Reserved`; a `Conflict` returned by `reserve` is terminal for this invocation and cannot be rewritten. The atomic `reserve` classification owns its initial creation race and therefore takes no caller-provided version. No domain revision, request digest, idempotency key, source event, watermark, cursor, timestamp, result ID, trace ID or fake sequence may substitute for this version.

### 14.4 application callable-surface closure

Step 6's `MemberApplicationFacade` and `MemberServiceRoute` remain the **composition and ownership shape**: they preserve the nine named CP services and prohibit a tenth mega-service. Step 8 adds exact typed callable traits and the facade surface; no marker-only trait, service locator, or generic dispatch is permitted.

| current boundary | permitted now | explicitly not authorized | closure / later concern |
|---|---|---|---|
| `MemberApplicationFacade` / `MemberServiceRoute` | Preserve the nine service names and use the Step-8-closed explicit method list and pure operation-to-service mapping. | Trait-object facade, empty marker service trait, service locator, generic `execute(operation, payload)`, route inference, or downcast to Store / resolver / UoW / adapter. | Step 9 defines call ordering and error/state flow; physical binding remains later. |
| `api` | Validate a parsed boundary, construct `MemberOperationContext`, and call exactly the matching typed facade Command / Query method. | Direct Store / UoW / resolver / handoff access, route-based service selection, or mapping a stored surface ref into a response. | Step 9 defines handler sequencing and boundary error mapping. |
| `worker` | Validate one of the fixed 10 external + 4 committed-fact entries, construct context, and call its named typed Consumer method; duplicate uses the typed receipt getter through application. | Bus client, direct Store access, raw-body persistence, generic handler, or inferred target service. | Step 9 defines consumer flow sequencing; external wire contract remains blocked by `L2M-UP-005`. |
| `jobs` | Validate one of the five logical entries, construct context, and call its named typed Job method; report save/get remains application-owned. | Direct Store scan, scheduler claim, generic job dispatch, or service inference. | Step 9 defines continuation ordering; Job remains logical, not execution evidence. |

Step 8's closure is a typed contract, not an implementation claim. No generic payload, `TypedRef` ordering, route, event kind, job kind string, configuration, adapter-private map or fake-only selector may replace the explicit methods. `api`, `worker`, and `jobs` retain their direct-I/O prohibitions.

### 14.5 application trait / port 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| one reservation owner | pass | `MemberIdempotencyStore` is the only Command / Consumer / Job reservation and completion surface; inbound dedup is a context + `reserve` rule, not a second Port. |
| typed stored Job replay | pass | `save_job_report` / `get_job_report` store and return the full contracts-owned `MemberJobReport` under one exact relation; no shell-only report replay remains. Its use is owned by the named Job service, never by the jobs entry. |
| Command / Consumer typed replay | pass_with_upstream_blockers | Step 8 closes complete public Command result/rejection and Consumer receipt carriers plus symmetric Store save/get; physical durability and external carrier activation remain blocked. |
| missing / wrong relation fail-closed | pass | missing, wrong kind, wrong operation, wrong channel, wrong digest or wrong pointer never causes a rerun. |
| result construction consistency | pass | `from_surface` inputs, result ID/ref equality, relation-field provenance, Job report / job-context consistency, kind, channel and digest verification are explicitly constrained. |
| nine-service ownership / entry direction | pass | `MemberApplicationFacade` / `MemberServiceRoute` preserve composition ownership; Step 8 supplies exact typed methods while entries still cannot access Store / adapters directly. |
| public protocol / error body boundary | pass | DTO/body/mapping are closed in Step 8; retry/concurrency / recovery remain Step 12 / 13. |

## 15. `infra`：adapter implementation matrix、composition 与 durable / fake parity

### 15.1 implementation matrix

All rows below are planned `infra` implementation slots, not existing files, implementations, bindings, products or integration evidence. An adapter may implement more than one **compatible application trait** behind composition, but it may not fuse domain policy, external owner truth, entry parsing, or an unbounded generic provider.

| application Port family | planned infra slot | required implementation behavior | never selects / claims |
|---|---|---|---|
| CP01~CP05 local truth and continuation Stores | `local_truth_store` / `continuation_store` | exact typed read, stable page, append, same-UoW staged write, matching-version successor save | DB / ORM / table, host lifecycle, Runtime or downstream truth |
| CP06 mirror Store + CP07 resolution read | `mirror_store` / `mirror_read` | immutable snapshot/resolution append; versioned gap successor; read-only resolution facade | external body cache, owner policy/approval truth, generic source hub |
| CP07 projection + committed-fact read | `projection_store` / `committed_fact_read` | finite committed-fact dispatch, affected-state lookup, append-only views, versioned state successor | event carrier, cache-as-truth, registry, authorization engine |
| idempotency, inbound source-key classification, stored result | `idempotency_store` / `stored_result_store` | atomic reservation classification for all non-query channels (including inbound source key); same-UoW typed Command value/rejection, Consumer receipt, and `MemberJobReport` save/get with relation checks | duplicate rerun, second inbound reservation owner, shell-only reconstruction, key/digest invention, generic result surface |
| Clock, ID generator, digest | `technical_primitives` | opaque ID generation, declared local time, body-free canonical digest | domain-generated ID, DB default time, source-body hash, fake-only semantics |
| Work / Identity / Credential / Governance / Runtime / Tools / Method / Host-route resolver | eight named `source_resolver(<owner>)` slots | validate owner kind / scope / freshness / forbidden-body boundary; return only safe outcome | URL/provider auto-selection, foreign body, third subject, default `Completed` |
| host / Runtime / publication / observation handoff and feedback | named `handoff_adapter(<seam>)` slots | accept only body-free submission/ref and return typed blocked-aware outcome | IPC/UDS/HTTP/RPC/Bus route, external accepted/delivered/observed truth |
| visibility safe basis / Tool safe view | `visibility_basis_read` / `safe_view_read` slots | return body-free basis / safe refs or conservative outcome | authorization decision engine, capability registry, provider availability |
| refresh request / logical dispatch | `refresh_request_adapter` / `blocked_or_job_dispatch` | preserve request/target relation and conservative outcomes | scheduler, queue, ack, cron, delivery evidence |

### 15.2 composition-root constraints

| composition concern | required constraint |
|---|---|
| builder input | `MemberRuntimeBuilderState` may consume only validated config refs, declared availability markers, blocker IDs and typed Port implementations; it does not parse config body, image manifest, credential, endpoint, route, queue or scheduler. |
| facade construction | `infra` may construct the nine concrete service instances and Step-6 `MemberApplicationFacade` composition shape only after mandatory local Store / technical slots are safe to inject. Step 8's typed facade methods are the only dispatch surface; `Ready` means a composition shape can be assembled, not that any external seam is live or successful. |
| blocked seam injection | A pending owner contract is represented by a typed blocked adapter that returns its matching `MemberExternalSeamOutcome::{Blocked,Waiting,Unknown}`. It must not be omitted in a way that makes a caller substitute a default positive implementation. |
| entry wiring | `api`, `worker`, and `jobs` receive only the Step-8-closed typed facade interface and still may not expose Store, UoW, resolver, handoff, concrete adapter or domain transition handles through an entry registry. |
| dependency category | The planned compile graph remains Core-only. Host/Runtime/Tools/Method/Governance/Identity/Conversation/Bus/member-service/member-images relationships remain runtime, event, ref or adapter relations; a fake is test-only and not a Cargo dependency. |
| physical choices | DB, SDK, transport, IPC, Bus, queue, scheduler, provider, process, image, sandbox and persistence product selection remain unbound. `L2M-DDD-001/002` remain open. |

### 15.3 durable / fake parity constraints

| concern | durable and in-memory fake must both preserve | prohibited fake shortcut |
|---|---|---|
| staged local write | writes are invisible outside the supplied UoW until commit; rollback makes them unavailable | mutating a global map eagerly or leaking a ref / version during rollback |
| append / successor | append-only facts retain their identity; mutable successor requires the matching read version | overwriting immutable fact, accepting a random version, or deriving version from domain revision / watermark |
| atomic idempotency | only one same key/channel/operation/digest reservation wins; matching completed duplicate returns its typed `result_kind` and stored result pointer; each channel's getter validates that pointer; distinct relation conflicts | returning `Duplicate` without a typed result pointer, marking any map hit as duplicate, or rerunning a handler |
| typed replay | reservation relation, result shell and complete Command value/rejection, Consumer receipt, or `MemberJobReport` must agree before return | creating a carrier from current records, error text, shell-only data or fake private state |
| page / ordering | page ordering and cursor continuation are stable and do not depend on insertion timing | letting hash-map / test insertion order become public ordering |
| owner seam outcome | `Completed` requires the same declared safe typed input/output condition; blocked/waiting/unknown remain explicit | fake external success, fabricated ref, default source classification or hidden raw body |
| blocked adapter | blocker ID, safe reason and nonpositive disposition propagate without side effect | silently replacing a blocked adapter with a no-op success |

### 15.4 infra module停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Port implementation ownership | pass | `infra` implements application traits only; it does not define a competing abstraction. |
| local / mirror / projection / result Store coverage | pass | all Store families, committed-read facade and continuation support have a slot and behavior constraints. |
| owner-specific resolver / handoff mapping | pass_with_upstream_blockers | eight resolvers and named handoff slots retain `L2M-UP-001/003/004/005/006/007/008`; no generic provider. |
| composition does not leak infrastructure into entries | pass | no entry receives Store / UoW / resolver / adapter; entries receive only the explicit typed facade surface. |
| durable / fake parity | pass | transaction visibility, version, replay, ordering and nonpositive external seam behavior are all constrained. |

## 16. `api`、`worker`、`jobs`：entry dispatch constraints

### 16.1 entry-module capability / boundary table

| module | accepts | may call | must return / retain | never directly calls |
|---|---|---|---|---|
| `api` | Step 8 parsed Command / Query boundary plus trusted metadata | Step 6 entry/context factories, then the exact typed facade Command / Query method | existing `MemberApiHandlerResult` mapped from the typed protocol result | Store, UoW, resolver, handoff, domain transition, concrete adapter, route-owned server, generic dispatch |
| `worker` | exactly ten external owner-specific Consumer kinds and four committed-fact kinds from Step 6 | Step 6 entry/context factories, then the named typed Consumer method; application owns receipt replay | existing `MemberConsumerItemResult` mapped from the typed receipt | Bus client, direct Store/UoW, resolver, handoff, domain transition, ack / DLQ decision, generic handler |
| `jobs` | exactly five `MemberOperationsJobKind` logical continuations | Step 6 entry/context / report-assembly factories, then the named typed Job method; application owns report save/get | existing `MemberJobRunResult` / `MemberJobReport` mapped from typed Job result | Store scan, direct stored-result Store, UoW, resolver, handoff, projection builder, scheduler / cron / process, service inference |

### 16.2 finite worker mapping and conservative dispositions

The worker's fixed 14 kinds are defined in Step 6 and cannot be extended here. Its entry mapping is constrained as follows; it names no envelope, event wire schema, source route, broker, acknowledgement or handler payload.

| mapping group | fixed kinds | application owner | disabled / blocked / rejected / duplicate behavior |
|---|---|---|---|
| external feedback / input | `HostFeedback`; `InboundFact`; `RuntimeMaterial`; `DeliveryFeedback`; `ObservationFeedback` | Each calls its named typed CP service method | non-ready entry returns refused / blocked typed receipt; no source body persistence or external ack claim. |
| external owner-context update | `SubjectIdentityContextUpdate`; `PolicyContextUpdate`; `RuntimeBoundaryContextUpdate`; `CapabilityContextUpdate`; `HostRouteContextUpdate` | Each calls the fixed CP06 mirror method | owner mismatch, missing binding or blocker remains refused / blocked / quarantined; no generic resolver, default snapshot or generic Consumer dispatch. |
| committed-fact re-entry | `RuntimeMaterialReception`; `MemberCommittedFact`; `MemberProjectionUpdate`; `CapabilityOutletSourceUpdate` | fixed CP04 / CP05 / CP07 named typed service methods | must accept only the finite `MemberCommittedFactRef` variants specified in Step 6; missing proof / wrong kind does not scan a Store or create an event. |

### 16.3 five logical job mappings

| job kind | named application owner | input / result boundary | blocked / duplicate behavior |
|---|---|---|---|
| `PublicationRelay` | CP04 outbound-boundary service | prepared local attempt / gap continuation only | blocked result retains local unresolved refs; duplicate replays matching typed stored Job report; no publish retry is invented. |
| `ObservationRelay` | CP05 interaction-trace service | prepared observation attempt / gap continuation only | no observed/evidence conclusion; duplicate does not call observation seam. |
| `ExternalContextRefresh` | CP06 external-context mirror service | existing refresh-request / target / gap relation only | no source scan or resolver selection from strings; blocked/waiting/unknown stay conservative. |
| `MemberProjectionRebuild` | CP07 read-model service | committed local sources and declared watermark only | no core/source truth repair; duplicate does not rescan or rebuild. |
| `GapReconciliation` | CP07 read-model service | existing local gap / resolution successor and affected state only | does not close a source gap or trigger a Command; duplicate returns stored report only. |

### 16.4 entry restrictions and module停审记录

| audit item | conclusion | explanation |
|---|---|---|
| API Command dispatch | pass_with_upstream_blockers | `api` validates, constructs context, selects the fixed facade method and maps the typed Command result; no direct I/O. |
| API Query no-write | pass | `api` constructs context and calls the fixed typed Query method; it cannot reserve, refresh, rebuild or dispatch Job. |
| worker finite coverage | pass | ten external + four committed-fact mappings are all named; no generic listener or source-type fallback is introduced. |
| worker nonpositive / duplicate | pass_with_upstream_blockers | typed receipt is saved/read through the matching Store pair; nonpositive and duplicate branches remain conservative and body-free. |
| jobs finite coverage | pass | exactly five logical kinds retain their Step 5 owner mapping and each has an explicit typed service method; no scheduler or sixth kind is introduced. |
| jobs nonpositive / duplicate | pass_with_upstream_blockers | disabled / blocked / rejected Jobs do not reserve or mutate; the future typed Job service replays a matching stored report without scan or external Port call. |
| Step 8 boundary | pass_with_upstream_blockers | protocol DTOs, envelopes, service-call signatures and typed replay surfaces are explicit; transport, event route and physical persistence remain unbound. |

## 17. Step 6 open-item closure and cross-module seam audit

### 17.1 Step 6承接闭合表

| Step 6 open item | Step 7 closure | later Step responsibility |
|---|---|---|
| generated local IDs / local time / digest | `MemberIdGeneratorPort` / `MemberClockPort` / `MemberDigestPort` cover every listed factory boundary; no domain or entry generation | Step 11 physical generation; Step 13 canonicalization / concurrency |
| local Store read / version / append surface | CP01~CP07 Stores expose exact reads, bounded pages, append and matching-version successor saves | Step 9 order; Step 11 persistence / UoW durability |
| owner-safe source and handoff boundary | CP01~CP06 owner-specific resolver / handoff Ports and CP07 safe read Ports return typed body-free conservative outcomes | Step 14 binding after upstream contracts close |
| committed fact / projection source | one `MemberFactReadPort`, finite projection gap ref, resolution read and affected-state lookup close CP05 / CP07 source paths | Step 9 invocation order |
| idempotency / stored result / replay | single reservation owner plus typed Command value/rejection, Consumer receipt, and full `MemberJobReport` save/get closes save/get/missing/wrong-relation boundaries | Step 12 error mapping; Step 13 replay / concurrency and canonical algorithm |
| API / worker / jobs stable entry carrier | finite 10+4+5 mappings, typed protocol DTOs, and entry/context construction prohibit entry direct I/O; facade/service calls are explicit | Step 9 flow |
| infra availability / blocked seam carrier | implementation matrix and blocked adapter constraints preserve `MemberRuntimeBuilderState` / `BlockedSeamState` semantics | Step 14 config binding; no external readiness claim |

### 17.2 cross-module seam audit

| audit item | conclusion | evidence / correction |
|---|---|---|
| Port ownership / reverse dependency | pass | only `application` defines Port traits; `infra` implements; `contracts` / `domain` define none; entry modules construct/validate carriers and call only the typed facade surface. |
| duplicate Port / source hub | pass | `MemberFactReadPort` is the sole committed proof Port; eight CP06 resolver traits remain owner-specific; inbound dedup is folded into the shared idempotency reserve and no parallel source hub exists. |
| read coverage | pass | exact object reads, versioned current reads, bounded Job pages, source proof, resolution/gap, visibility and affected-state surfaces are all named. |
| version / UoW provenance | pass | each mutable Store save pairs with same-store `Versioned<T>` read; idempotency initial reserve is atomic and later successors use its own versioned read; immutable facts append in same logical UoW. |
| append / source boundary | pass | immutable fact / view / material records append; successor state uses expected version; foreign requests, side effects and source truth are never locally versioned as member truth. |
| result replay exactness | pass_with_upstream_blockers | Job, Command, and Consumer replay validate reservation, typed result kind, result pointer, channel, operation, digest and carrier identity; missing or mismatched carriers fail closed. |
| projection source / page helper | pass | `MemberRepositoryPage` / `Page<T>` are application-local; source watermark, cursor and store version are kept separate; gap lookup is finite local ref only. |
| downstream Step 8 / 9 / 10 / 11 handoff | pass_with_upstream_blockers | Store, resolver, UoW, typed result/replay and facade/service signatures are sufficient for the next flow work. Exact external carrier / physical choices remain blocked. |

### 17.3 dependency-category, historical-pollution and blocker audit

| audit surface | conclusion | current treatment |
|---|---|---|
| compile dependency | pass | only `core-contracts` is a planned compile dependency; no sibling business crate, Bus, SDK, Runtime, Tools or adapter is written as a package dependency. |
| runtime / event / ref / adapter / fake | pass | host/Runtime/source/handoff are Ports; semantic event remains blocked; foreign identities are typed refs; fake is parity-bound test-only adapter. |
| old README: CloudEvents / W3C | historical-only | no CloudEvents envelope, member event source/subject, publisher, outbox, payload or Bus route is introduced; Core authority remains prerequisite. |
| old README: AG-UI / UDS / launch token / fixed port / supervisord | historical-only | no UI, IPC, token, process, configuration or transport binding is inherited. |
| prohibited truth ownership | pass | no LLM reasoning, plan, memory, checkpoint, tool execution/registry, external MCP/A2A/API adapter, lifecycle/image/sandbox, governance approval, conversation, artifact or observability backend truth is modeled. |
| `L2M-UP-001` / `006` | open | host lifecycle / IPC / credential / identity-anchor positive contract remains blocked-aware only. |
| `L2M-UP-002` | open | image release / manifest / pinned entry is not consumed as an implementation binding or dependency. |
| `L2M-UP-003` / `004` | open | Runtime entry / material mapping and source family remain blocked-aware only. |
| `L2M-UP-005` | open | no canonical member event carrier, payload, source, subject or route is created. |
| `L2M-UP-007` | open | screening taxonomy / policy source is only a safe resolution input. |
| `L2M-UP-008` | open | no third execution subject; all positive paths retain `ProjectMemberRef + GlobalMemberRef`. |
| `L2M-DDD-001` / `002` | open | target repository and physical persistence/UoW choices are absent; planned contract is not implementation evidence. |

## 18. 回填草稿、进入下一步条件与停审

### 18.1 future formal `03-详细设计.md` refill draft

> 校准来源: `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> 正式回填仍须等待 Step 19 完成和用户另行授权；本节不修改正式 `03-详细设计.md`。

Future §5 / §6 should retain only these settled conclusions:

- `application` is the exclusive owner of all repository, resolver, handoff, projection, idempotency/result, UoW, Clock, ID and digest Port abstractions; `infra` implements them.
- CP01~CP07 local Stores have exact typed read, bounded list, append and versioned successor surfaces. `MemberStoreVersion`, `ProjectionWatermark`, source version and page cursor have non-overlapping meanings.
- CP06 uses eight owner-specific safe resolvers; CP07 reads committed local proof through one `MemberFactReadPort`, uses a finite local projection-gap reference, and keeps Query no-write / outlet non-authorizing.
- Job duplicates only replay a complete stored matching `MemberJobReport`; no missing or mismatch case can rerun local mutation, source resolution, handoff, scan or Job. Command / Consumer duplicates likewise replay only their complete typed carrier through the matching getter.
- `MemberApplicationFacade` / `MemberServiceRoute` retain the nine-service composition ownership. `api`, `worker`, and `jobs` retain finite entry construction boundaries (10 external + 4 committed-fact worker kinds and five job kinds), and invoke only the explicit typed methods closed in Step 8.
- No event publisher/outbox/carrier, transport, IPC, scheduler, physical persistence or external positive binding is implied by this contract.

### 18.2 Step 7 final gate

| gate | conclusion | basis |
|---|---|---|
| each module / CP Port group stopped | pass | `contracts` / `domain`, CP01~CP07, application, infra, api, worker and jobs each have an explicit stop-review record; callable surfaces are typed and named rather than generic. |
| all currently authorized Port functions have parameter / return / error boundary | pass | Rust-facing Store / resolver / handoff traits use typed inputs, `MemberPortError`, typed seam outcome, `MemberStoreVersion` and UoW where applicable. Unclosed facade/service methods are expressly not authorized in this Step. |
| reads support later protocol / flow / state / persistence work | pass | object, page, typed replay, projection, visibility, committed-proof and affected-state reads are explicit; Step 9 owns only invocation order and flow semantics. |
| writes have version / UoW / append boundary | pass | immutable append, versioned successor, atomic reservation and same-UoW stored-result completion are separated. |
| cross-module conflict remains | none internal | no duplicate source hub, reverse dependency, generic listener, generic provider, result fallback, empty callable service marker or version substitution remains. |
| upstream blockers | open but bounded | `L2M-UP-001~008` and `L2M-DDD-001~002` block only exact external / physical activation, not this internal contract calibration. |
| non-fabrication | pass | no implementation, build, test, run, artifact, report, evidence, verdict, signoff, readiness or commit is claimed. |

```text
current_document = 03-详细设计.md
current_step = Step_07_trait_port_adapter_contracts_completed
step_07_status = completed / pass_with_upstream_blockers / stop_review
formal_03_write_allowed = false
step_08_file_allowed = false_until_explicit_user_confirmation
implementation_repo_write_allowed = false
commit_required = false
```

Step 7 stops here. The only next action is to wait for the user's explicit confirmation before reading Step 8 inputs or creating `03_ddd_step_08_protocol_contracts.md`.
