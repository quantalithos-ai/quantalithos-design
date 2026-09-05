# Step 6. 逐模块定义对象实现契约

> 项目：`L2-member`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
> 对应书写规范：`standards/document/详细设计书写规范.md` §5.5、§5.6
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §5.5.1
> 参考粒度与格式：`projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md`
> 未来回填：`03-详细设计.md` §5“模块实现契约”中的对象实现契约、§6“全局对象 / Trait / API 索引”
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`

## 1. Step 状态

| 项 | 记录 |
|---|---|
| 当前 Step | Step 6：逐模块定义对象实现契约。 |
| 前序门禁 | Step 5 已完成并停审：七模块主轴、CP01~CP07 跨层映射、依赖方向和 owner 边界已收稳。 |
| 本步目标 | 把 02 中 34 个关键对象及 Step 5 已点名的非 core stable carrier 收敛到可逐项转写为 planned Rust type / `impl` 的粒度。 |
| 当前写入状态 | `completed / pass_with_upstream_blockers / stop_review`；已按 `contracts → domain → application → infra → api → worker → jobs → cross-module audit` 完成。 |
| 本步完成门禁 | 每个对象均有模块 capability 来源、字段来源、factory / member function、状态 / variant、禁止事项和 Step 7 接缝承接点；跨模块字段和状态闭环通过。 |
| 不得做的事 | 不写正式 `03-详细设计.md`；不创建实现仓或源码；不把 host / Runtime / Core / Bus / Tools / Method / Conversation / observability truth 变成本仓对象；不伪造外部 schema、route、IPC、结果或证据。 |

### 1.1 Step 内计划

| 顺序 | 批次 | 可审查产物 | 状态 | 完成门禁 |
|---:|---|---|---|---|
| 1 | 6.0 | Step 骨架、输入、批次计划、对象归属、写入门禁 | completed | 对象不是从旧 03 或对象名猜出。 |
| 2 | 6.1 | `contracts` shared IDs / refs / metadata / marker / state enum / public view helpers | completed | public carrier 不引用 domain-only 或外部正文；public job kind/report 的唯一 contracts 归属已补齐。 |
| 3 | 6.2-a | `domain` CP01 Presence and Host Collaboration | completed | admission、presence、host material、attempt、policy 分层。 |
| 4 | 6.2-b | `domain` CP02 Inbound Boundary | completed | scope、intake、screening 与 rule truth 分层。 |
| 5 | 6.2-c | `domain` CP03 Runtime Mediation | completed | local decision / attempt / link / reception 与 Runtime truth 分层。 |
| 6 | 6.2-d | `domain` CP04 Outbound Boundary | completed | decision / material / attempt / gap 与 delivery / acceptance 分层。 |
| 7 | 6.2-e | `domain` CP05 Interaction Trace | completed | trace / gap / observation material / attempt 与 observed / evidence 分层。 |
| 8 | 6.2-f | `domain` CP06 External Context Mirror | completed | snapshot / neutral resolution / gap 与外部 business truth 分层。 |
| 9 | 6.2-g | `contracts` views + `domain` CP07 Read Model | completed | projection no-write、outlet non-authorizing。 |
| 10 | 6.3 | `application` stable helper / facade carrier | completed | operation / idempotency / stored-result / read-decision / job-report carrier 有唯一归属。 |
| 11 | 6.4 | `infra`、`api`、`worker`、`jobs` stable state / entry carrier | completed | 四个 entry / availability carrier 均已闭口；worker 的 10 + 4 finite kind 与 jobs 的五 kind 已经穷尽审计。 |
| 12 | 6.5 | 字段来源、状态闭环、跨模块审计、回填与 Step 7 承接 | completed | 字段、集合、状态、依赖分类、blocker 与后续 Step 输入已逐项审计；不得停留为隐含实现假设。 |

### 1.2 本步范围与边界

- `contracts` 只承载 public 或跨层需要的 typed ID / ref / metadata / reason / marker / state / view / receipt helper；它不拥有业务 lifecycle、repository 或 adapter。
- `domain` 只承载 member-local interaction truth、support truth、derived-read state 及纯 policy / guard。domain 不读取 I/O、不生成 ID、不调用 Port、不保存 external body。
- `application` 本步只闭口唯一稳定 carrier；repository、resolver、publisher、handoff、UnitOfWork、idempotency 的 trait 函数由 Step 7 定义。
- `infra`、`api`、`worker`、`jobs` 本步只闭口 runtime availability / entry disposition 等无法由后续协议替代的 carrier；技术绑定、route、配置、store schema、scheduler 和真实运行均留后续 Step。
- 当前设计只支持 `ProjectMemberRef + GlobalMemberRef` 正向执行主语。第三主语不是 `Unknown` 的替代实现分支，而是 `L2M-UP-008` 的 fail-closed blocker。

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 七模块、CP 映射、对象 / Port / entry 归属和依赖方向。 | 不把 Step 5 的归属预告当作字段 / signature 成品。 |
| `02_hld_step_06_key_objects.md` 及 CP01~CP07 附录 | 34 个对象候选、HLD 字段轮廓、成员能力、禁止事项。 | HLD 只给骨架；本 Step 必须补 field source、Rustdoc、状态 variant 和 factory 入参。 |
| `02_hld_step_07_api_interface_skeleton.md` 及附录 | Command / Query / Consumer / Event / Job 的对象使用者和 metadata 分母。 | 不在本 Step 提前写完整 DTO / route / envelope。 |
| `02_hld_step_08_processing_flows.md` 及附录 | local-truth-first、append、Query no-write、unknown fence 的对象调用顺序输入。 | 不提前写 Step 9 函数图或事务实现。 |
| `02_hld_step_09_state_machine.md` 及附录 | state subject、初始 / 特殊状态、禁止迁移。 | Step 10 才写完整转换矩阵；本 Step 先让 enum / transition method 可落码。 |
| `03_ddd_step_03_constraints.md` | planned Rust 2024、source-English Rustdoc、Core-only compile、body-free 和 source-specific seam 约束。 | 不把目标仓 / Core member event schema 写成已存在。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 检查 field / helper 参数来源、status carrier、ID、view、receipt、sidecar 和 fake parity红线。 | 只补本 Step 应闭合的对象 carrier，不抢写 Step 7~16。 |
| `L1-governance` Step 6 | 批次、对象卡片、状态表、字段审计、非 core carrier 和 Step 7 承接的粒度 / 格式参考。 | 不继承 Governance object、truth、route、adapter、config 或 job 设计。 |

## 3. SOP 问题回答

1. **是否先建立骨架、批次和模块顺序？** 是。本文件 §1、§4、§6~§8 在写对象前固定了批次、归属、模板和门禁；不以一个无模块来源的全仓对象清单替代。
2. **哪些 shared vocabulary 必须先收敛？** member-local ID、body-free typed ref、相关性、外部来源 scope / freshness、safe reason、operation / result / entry marker、所有 public state enum、projection view helper。它们进入 `contracts`；具体 truth object 与 policy 不提前搬入全局章节。
3. **哪些对象由 HLD 固定？** CP01~CP07 的 `5 + 5 + 5 + 5 + 5 + 4 + 5 = 34` 个候选全部保留，且每个都有唯一 CP / module 归属。
4. **哪些对象只能在 Step 6 闭口为 stable carrier？** `MemberOperationContext`、idempotency / stored-result carrier、visibility decision、job report assembly、runtime config reference / builder availability、entry input/result / registry state。它们不形成新业务 truth，不能推给 Step 7 后被私有实现补造。
5. **哪些内容必须后移？** repository / source resolver / publisher / handoff trait 函数、DTO schema、event carrier / route、函数级事务、状态矩阵、物理持久化、错误恢复、并发、配置、观测和测试均按后续 Step 归属推进。
6. **如何处理未稳定上游？** `L2M-UP-001~008` 只可以出现在 typed ref、resolution、blocked / pending / gap / unknown 状态和 blocked-aware adapter slot 中；不得通过新 field、默认值、裸字符串、generic adapter 或 fake success 关闭。
7. **Rustdoc 口径？** 所有 Rust snippet 的 public type、field、variant 和 function 使用 source-English `///` 草案；中文只解释设计原因和来源，不混入未来源码注释。

## 4. 模块执行顺序表

| 顺序 | 模块 | 模块职责 | 输入来源 | 完成后停审点 |
|---:|---|---|---|---|
| 1 | `contracts` shared types | 跨 CP 的 identity、metadata、ref、reason、marker、state 和 public view helper。 | Step 5 §7.1；HLD 对象 / state 附录；Core verified primitives。 | 所有 shared carrier 有单一归属；外部 typed ref 不复制 owner body。 |
| 2 | `domain` CP01~CP06 | member local / support truth、immutable material、attempt、gap、policy。 | HLD CP01~CP06 对象 / flow / state 附录。 | capability → object → field / function / state 完整，且不越过 source owner。 |
| 3 | `contracts` view + `domain` CP07 | body-free public projection carrier 与 no-write read policy / projection state。 | HLD CP07；Query skeleton；projection state appendix。 | view identity、freshness、visibility、not-ready / gap surface 可由 Step 7/8 承接。 |
| 4 | `application` | application-local operation / idempotency / result / visibility / report helper。 | Step 5 application service 主轴；HLD command / query / consumer / job metadata。 | 不创建 second truth owner；每个 helper 有 port / protocol承接点。 |
| 5 | `infra` | validated config reference、builder state、adapter / store / blocked seam availability。 | Step 4 file layout；Step 5 infra boundary；upstream blockers。 | 不保存 config / secret / endpoint / provider body；不把 availability 当外部成功。 |
| 6 | `api` | command / query entry translation carrier。 | HLD command / query skeleton。 | route-neutral entry 只可调用 application。 |
| 7 | `worker` | consumer envelope gate、item disposition、continuation dispatch carrier。 | HLD consumer skeleton。 | worker 只有 boundary result，无 source truth write / raw body persistence。 |
| 8 | `jobs` | operations job entry、run disposition、runner registry carrier。 | HLD five job skeleton。 | 不声称真实 run；job 不修复 core / external truth。 |

## 5. 对象归属总览

| 模块 | 对象类别 | 本 Step 需要闭合的对象组 |
|---|---|---|
| `contracts` | shared ID / ref / metadata / reason / state | CP01~CP07 local IDs、external typed ref wrappers、correlation、safe marker、scope / freshness、operation / result / entry marker、所有 public state enum。 |
| `contracts` | public read carrier | `MemberSummaryView`、`CapabilityOutletView`、`MemberDiagnosticView` 及其 public summary / not-ready helper。 |
| `domain` | CP01 truth / policy | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt`、`PresenceAdmissionPolicy`。 |
| `domain` | CP02 truth / policy | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、`SubscriptionScopePolicy`、`InboundScreeningPolicy`。 |
| `domain` | CP03 truth / policy | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception`、`RuntimeMediationPolicy`。 |
| `domain` | CP04 truth / policy | `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、`OutboundMaterialPolicy`。 |
| `domain` | CP05 truth / policy | `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy`。 |
| `domain` | CP06 support truth / policy | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy`。 |
| `domain` | CP07 state / policy | `MemberProjectionState`、`ReadProjectionPolicy`。 |
| `application` | stable application helper | `MemberApplicationFacade`、`MemberOperationContext`、`MemberIdempotencyRecord`、`StoredMemberOperationResult`、`ReadVisibilityDecision`、`MemberJobReportAssembly`。 |
| `infra` | runtime / adapter state | `MemberRuntimeConfigRef`、`MemberRuntimeBuilderState`、`MemberAdapterAvailability`、`MemberInfraStoreState`、`BlockedSeamState`。 |
| `api` | logical entry | `MemberCommandEntry`、`MemberQueryEntry`、`MemberApiHandlerResult`、`MemberApiRegistryState`。 |
| `worker` | logical consumer / continuation entry | `MemberInboundConsumerEntry`、`MemberConsumerItemResult`、`MemberContinuationDispatchContext`、`MemberWorkerRegistryState`。 |
| `jobs` | operations entry | `MemberOperationsJobEntry`、`MemberJobRunResult`、`MemberJobRunnerRegistryState`。 |

## 6. 写入模板与审查门禁

### 6.1 对象卡片模板

每个对象必须按下面形态给出。下文的 Rust 是 **planned source contract**，不是已创建的 implementation source。

````md
##### `TypeName`

```rust
/// English type summary and invariant.
pub struct TypeName {
    /// English field boundary.
    pub field_name: FieldType,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|

| 不变量 / 禁止事项 | 说明 |
|---|---|
````

### 6.2 状态 enum 模板

```rust
/// English state boundary summary.
pub enum ExampleState {
    /// English variant meaning.
    Example,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|

### 6.3 本步门禁

| 门禁 | 必须满足的口径 |
|---|---|
| capability 来源 | 每一个对象回指一个本模块 capability；没有能力来源的对象必须删除、合并或明确 defer。 |
| field source | 每个字段必须来自 command / query metadata、application ID / clock、loaded local truth、formal source resolution、policy result 或 immutable material derivation；不得来自 raw body、adapter 私有状态或实施猜测。 |
| factory closure | 所有必填字段由 factory 参数、application generated ID、clock、loaded truth 或 policy result 覆盖；不可让 repository / API / fake 临时补字段。 |
| state closure | HLD 中的 state subject 都有 exact enum、factory initial state、transition member / immutable exception；unknown / gap / stale 不得通过裸 bool 表达。 |
| owner boundary | ref / snapshot / safe classification 不能升格为 Runtime、host、Governance、Conversation、Tools、Method、Bus、image 或 backend truth。 |
| non-core decision | application / infra / entry carrier 必须显式 closed 或 defer；本项目的 stable carrier 不允许机械后推。 |
| future-step discipline | port function 留 Step 7；DTO schema 留 Step 8；flow / UoW 顺序留 Step 9；任何未闭合输入必须标 blocker。 |

## 7. `contracts` shared vocabulary、typed ref 与 public marker

### 7.1 shared type 写入纪律

`contracts::refs`、`metadata.rs`、`views.rs` 只存可传播的 body-free carrier。它们可以包装已核验的 `core-contracts` primitive，例如 `ActorContext`、`IdempotencyKey`、`Timestamp`、`TraceId`、`ProjectionWatermark`、`ExternalReferenceRef`，但不为相邻项目复制 object / event payload / route schema。

| 判断 | 收敛口径 |
|---|---|
| 类型会进入 Command / Query / Consumer / Event / Job / View / Receipt | 放入 `contracts` 或直接引用已核验 `core-contracts` primitive。 |
| 类型只用于 domain 内部的 policy calculation | 留在对应 `domain` CP module，不进入 public DTO。 |
| 类型表示 foreign truth | 使用 member-side typed ref wrapper；wrapper 只标 owner kind + opaque Core ref，不保存 foreign body，不声称 upstream schema 已闭合。 |
| HLD 已给有限状态 | 在本 Step 写 public enum、Rustdoc 和 variant 表；Step 10 只补转换矩阵。 |
| taxonomy 未稳定 | 使用 non-empty opaque safe category / marker wrapper；不得自造 `allowlist`、风险等级、provider 或 route enum。 |
| ID / ref 来源 | 新 local ID 只能由 Step 7 的 `MemberIdGeneratorPort` 输入；load 只可重建既有 ID；不得从 subject、route、timestamp、digest、row id 或 fake counter 拼接。 |

### 7.2 shared type 分组计划

| 分组 | 代表类型 | 使用模块 | 正式归属 |
|---|---|---|---|
| local identity | `StartupAdmissionId`、`RuntimeSubmissionAttemptId`、`MemberProjectionStateId` 等 | domain / application / view / entry | `contracts/src/refs.rs` |
| external typed ref | `ProjectMemberRef`、`RuntimeBoundaryRef`、`HostFeedbackRef`、`ToolContractViewRef` 等 | domain / application / entry | `contracts/src/refs.rs` |
| operation metadata | `MemberCorrelation`、operation / digest / result / entry refs | contracts / application / entry | `contracts/src/metadata.rs` |
| source scope / freshness | `ExternalContextScope`、`ExternalConsumerPurpose`、`SourceFreshnessEvidence` | CP01~CP07 | `contracts/src/refs.rs` |
| safety marker | `SafeReasonCategory`、`ForbiddenBodyInspection`、`TransientInspectionMarker` | CP01~CP07 | `contracts/src/metadata.rs` |
| state / reason / kind | HLD 已稳定的 disposition、attempt、gap、projection state enum | domain / view / entry | `contracts/src/refs.rs` |
| public view / not-ready | summary / outlet / diagnostics helper、visibility / freshness surface | contracts / api / application | `contracts/src/views.rs` |

### 7.3 local ID 与 local reference 契约

下列 ID 均是 member-local object identity，不是 external owner identity，也不是数据库 row ID。实现时允许由一个 private macro 减少样板，但不得改变任何 public newtype 的名字、opaque 性和生成来源。

```rust
/// Identifies one local startup admission record.
pub struct StartupAdmissionId(pub String);
/// Identifies one local member presence record.
pub struct MemberPresenceId(pub String);
/// Identifies one immutable host collaboration material record.
pub struct HostCollaborationMaterialId(pub String);
/// Identifies one local host collaboration attempt.
pub struct HostCollaborationAttemptId(pub String);

/// Identifies one local subscription scope decision.
pub struct SubscriptionScopeDecisionId(pub String);
/// Identifies one body-free inbound fact record.
pub struct InboundFactRecordId(pub String);
/// Identifies one local screening decision.
pub struct ScreeningDecisionId(pub String);

/// Identifies one local Runtime delivery decision.
pub struct RuntimeDeliveryDecisionId(pub String);
/// Identifies one local Runtime submission attempt.
pub struct RuntimeSubmissionAttemptId(pub String);
/// Identifies one immutable Runtime result link.
pub struct RuntimeResultLinkId(pub String);
/// Identifies one local Runtime material reception.
pub struct RuntimeMaterialReceptionId(pub String);

/// Identifies one local outbound decision.
pub struct OutboundDecisionId(pub String);
/// Identifies one immutable member outbound material record.
pub struct MemberOutboundMaterialId(pub String);
/// Identifies one local publication attempt.
pub struct PublicationAttemptId(pub String);
/// Identifies one local publication gap.
pub struct PublicationGapId(pub String);

/// Identifies one immutable interaction trace entry.
pub struct InteractionTraceEntryId(pub String);
/// Identifies one local interaction gap.
pub struct InteractionGapId(pub String);
/// Identifies one immutable observation material record.
pub struct ObservationMaterialId(pub String);
/// Identifies one local observation attempt.
pub struct ObservationAttemptId(pub String);

/// Identifies one immutable external context snapshot.
pub struct ExternalContextSnapshotId(pub String);
/// Identifies one local external context resolution.
pub struct ExternalContextResolutionId(pub String);
/// Identifies one local external context gap.
pub struct ExternalContextGapId(pub String);

/// Identifies one member summary view revision.
pub struct MemberSummaryViewId(pub String);
/// Identifies one capability outlet view revision.
pub struct CapabilityOutletViewId(pub String);
/// Identifies one local projection state record.
pub struct MemberProjectionStateId(pub String);
/// Identifies one member diagnostic view revision.
pub struct MemberDiagnosticViewId(pub String);
/// Identifies one application-owned idempotency record.
pub struct MemberIdempotencyRecordId(pub String);
/// Identifies one stored, body-free member operation result.
pub struct StoredMemberOperationResultId(pub String);
/// Identifies one body-free local public surface stored beside an operation result record.
pub struct MemberStoredResultSurfaceId(pub String);
/// Identifies one application operation context assembled at an entry boundary.
pub struct MemberOperationContextId(pub String);
/// Identifies one logical job-report assembly record.
pub struct MemberJobReportAssemblyId(pub String);
/// Identifies one body-free public operations-job report surface.
pub struct MemberJobReportId(pub String);
```

| ID 组 | 生成来源 | load / 重建来源 | 禁止事项 |
|---|---|---|---|
| CP01~CP06 truth / support / attempt / gap IDs | application service 在写入前通过 Step 7 `MemberIdGeneratorPort` 获得。 | local Store 读取已保存 record 时原样重建。 | 不从 `ProjectMemberRef`、source event、Runtime ref、target、route、timestamp、digest 或 host feedback 拼接。 |
| CP07 view / projection IDs | projection service / rebuild flow 在准备新 revision 前通过 ID port 获得。 | projection Store 读取已保存 view / state 时原样重建。 | 不把 projection watermark、query cursor 或 external view ref 当 ID。 |
| application support IDs | application service 在写入 idempotency / stored-result / stored-surface / report carrier 前通过同一 ID port 获得。 | local result Store 读取已保存 record 时原样重建。 | 不从 HTTP request、logical job invocation、entry route、adapter receipt 或 test counter 拼接。 |
| immutable record IDs | 每次新 material、link、attempt、gap、snapshot、view revision 均生成新的 ID。 | 旧 record 只能被读取 / link，不能被新 revision 覆盖。 | 不复用已终止 / superseded record ID。 |

所有上述 newtype 必须非空、opaque、稳定。公开 API 只传这些 typed ID，不能用 `String`、database key、path、URL 或 Core `ExternalReferenceRef` 代替 local identity。

### 7.4 external typed ref 契约

外部 ref 的 exact producer schema、member-specific Core event carrier、route、IPC 和 subject encoding尚未由 owner 关闭。本仓因此定义 **member-side wrapper**，用于保存“已收到的 typed external identity”，而不是 shadow foreign object。

```rust
/// Identifies the formal owner namespace of an external reference.
pub enum ExternalOwnerKind {
    /// Project-scoped work and member-subject ownership.
    Work,
    /// Global identity ownership.
    Identity,
    /// Policy-effective and approval ownership.
    Governance,
    /// Runtime loop, context, plan, outcome, and handoff ownership.
    Runtime,
    /// Tool action contract ownership.
    Tools,
    /// Method definition ownership.
    Method,
    /// Host lifecycle, registry, session, and health ownership.
    MemberService,
    /// Event delivery and bus routing ownership.
    Bus,
    /// Conversation or downstream business-fact ownership.
    Conversation,
    /// Observation backend ownership.
    Observation,
    /// A formally named downstream owner.
    Downstream,
}

/// Carries an opaque Core reference together with its expected external owner.
pub struct ExternalTypedRef {
    /// Owner expected to interpret the opaque reference.
    pub owner_kind: ExternalOwnerKind,
    /// Opaque reference supplied by a formal owner boundary.
    pub external_ref: core_contracts::metadata::ExternalReferenceRef,
}

/// References the only supported forward execution subject.
pub struct ProjectMemberRef(pub ExternalTypedRef);
/// References the global identity anchor associated with a project member.
pub struct GlobalMemberRef(pub ExternalTypedRef);
/// References a formal startup context without copying its body.
pub struct StartupContextRef(pub ExternalTypedRef);
/// References a credential verification carrier without storing credential material.
pub struct CredentialRef(pub ExternalTypedRef);
/// References a formal host collaboration boundary.
pub struct HostBoundaryRef(pub ExternalTypedRef);
/// References a host submission carrier.
pub struct HostSubmissionRef(pub ExternalTypedRef);
/// References formal host feedback.
pub struct HostFeedbackRef(pub ExternalTypedRef);
/// References a source event without carrying its payload.
pub struct SourceEventRef(pub ExternalTypedRef);
/// References the formal authority of a source event.
pub struct SourceAuthorityRef(pub ExternalTypedRef);
/// References a Runtime entry boundary.
pub struct RuntimeBoundaryRef(pub ExternalTypedRef);
/// References a formal Runtime entry mapping.
pub struct RuntimeEntryContractRef(pub ExternalTypedRef);
/// References a member-to-Runtime submission carrier.
pub struct RuntimeSubmissionRef(pub ExternalTypedRef);
/// References a Runtime admission or result decision.
pub struct RuntimeAdmissionDecisionRef(pub ExternalTypedRef);
/// References Runtime-owned committed safe handoff material.
pub struct RuntimeSafeHandoffMaterialRef(pub ExternalTypedRef);
/// References a Runtime-owned outcome.
pub struct RuntimeOutcomeRef(pub ExternalTypedRef);
/// References an auditable Runtime source family.
pub struct RuntimeSourceRef(pub ExternalTypedRef);
/// References a formally resolved outbound target.
pub struct OutboundTargetRef(pub ExternalTypedRef);
/// References a publication boundary without selecting a transport.
pub struct PublicationBoundaryRef(pub ExternalTypedRef);
/// References a publication submission carrier.
pub struct PublicationSubmissionRef(pub ExternalTypedRef);
/// References formal downstream feedback.
pub struct DownstreamFeedbackRef(pub ExternalTypedRef);
/// References an observation handoff boundary.
pub struct ObservationBoundaryRef(pub ExternalTypedRef);
/// References an observation submission carrier.
pub struct ObservationSubmissionRef(pub ExternalTypedRef);
/// References formal observation feedback.
pub struct ObservationFeedbackRef(pub ExternalTypedRef);
/// References a safe redaction policy result.
pub struct RedactionProfileRef(pub ExternalTypedRef);
/// References a safe Tool contract view.
pub struct ToolContractViewRef(pub ExternalTypedRef);
/// References a safe capability binding view.
pub struct CapabilityBindingViewRef(pub ExternalTypedRef);
/// References a Method definition without copying definition content.
pub struct MethodDefinitionRef(pub ExternalTypedRef);
/// References a Runtime-owned safe read view.
pub struct RuntimeSafeViewRef(pub ExternalTypedRef);
/// References a body-free explanation owned by its source authority.
pub struct SafeExplanationRef(pub ExternalTypedRef);
/// References the formal, body-free basis used to evaluate projection visibility.
pub struct ProjectionVisibilityBasisRef(pub ExternalTypedRef);
/// References a formal resolution or reconciliation request.
pub struct ResolutionRequestRef(pub ExternalTypedRef);
/// References a formal gap-resolution basis.
pub struct GapResolutionRef(pub ExternalTypedRef);
/// References an external-context refresh request carrier.
pub struct ExternalRefreshRequestRef(pub ExternalTypedRef);
```

| 类型 / 类型组 | owner kind 约束 | 进入方式 | 禁止事项 |
|---|---|---|---|
| `ProjectMemberRef` / `GlobalMemberRef` | `Work` / `Identity`；两者组合是唯一正向执行锚。 | admission command 或 CP06 owner-specific source update 的 safe resolution。 | 不定义第三执行主语；不用 display name、workspace view、token 或 process ID 代替。 |
| startup / credential / host refs | `MemberService`、Identity 或 Work，具体 mapping 受 `L2M-UP-001/006` 阻塞。 | formal source result 或 feedback envelope 的 typed mapping。 | 不保存 credential、session、health、registry或 IPC body；不得选 UDS / RPC。 |
| Runtime refs | `Runtime`，具体 entry / handoff mapping 受 `L2M-UP-003/004` 阻塞。 | Runtime-safe source result或 logical consumer。 | 不创建 `RuntimeTriggerContext`、run、context、plan、outcome 或 tool receipt copy。 |
| event / downstream / observation refs | `Bus`、Conversation、Observation 或 Downstream。 | formal envelope / feedback ref 验证后。 | submission / feedback ref 不等于 delivery、accepted、observed 或 evidence。 |
| Tool / Method / policy / explanation / visibility-basis refs | `Tools`、Method、Governance 或 Identity；exact visibility owner仍由 source contract 闭合。 | CP06 的 owner-specific resolver / Consumer safe result。 | 不建立 capability registry、definition copy、approval truth或 provider adapter。 |

`ExternalTypedRef` 的 `owner_kind` 必须与 wrapper 类型匹配；不匹配、缺失、未知或无法验证的 source 不得构造正向 typed ref，而应通过 CP06 resolution / gap 进入 `blocked`、`unresolved`、`unknown` 等保守 surface。

### 7.5 local / external union reference 与 high-reuse metadata

```rust
/// Identifies a local committed fact that may be traced or projected.
pub enum MemberCommittedFactRef {
    /// A committed startup admission fact.
    StartupAdmission(StartupAdmissionId),
    /// A committed member presence revision.
    MemberPresence(MemberPresenceId),
    /// A committed immutable host collaboration material record.
    HostCollaborationMaterial(HostCollaborationMaterialId),
    /// A committed host collaboration attempt record.
    HostCollaborationAttempt(HostCollaborationAttemptId),
    /// A committed subscription scope decision.
    SubscriptionScope(SubscriptionScopeDecisionId),
    /// A committed inbound fact record.
    InboundFact(InboundFactRecordId),
    /// A committed screening decision.
    Screening(ScreeningDecisionId),
    /// A committed Runtime delivery decision.
    RuntimeDelivery(RuntimeDeliveryDecisionId),
    /// A committed Runtime submission attempt.
    RuntimeSubmission(RuntimeSubmissionAttemptId),
    /// A committed immutable Runtime result link.
    RuntimeResultLink(RuntimeResultLinkId),
    /// A committed Runtime material reception.
    RuntimeMaterialReception(RuntimeMaterialReceptionId),
    /// A committed outbound decision.
    OutboundDecision(OutboundDecisionId),
    /// A committed immutable outbound material record.
    OutboundMaterial(MemberOutboundMaterialId),
    /// A committed publication attempt.
    PublicationAttempt(PublicationAttemptId),
    /// A committed publication gap.
    PublicationGap(PublicationGapId),
    /// A committed immutable interaction trace entry.
    InteractionTrace(InteractionTraceEntryId),
    /// A committed interaction gap.
    InteractionGap(InteractionGapId),
    /// A committed immutable observation material record.
    ObservationMaterial(ObservationMaterialId),
    /// A committed observation attempt.
    ObservationAttempt(ObservationAttemptId),
    /// A committed immutable external context snapshot.
    ExternalContextSnapshot(ExternalContextSnapshotId),
    /// A committed external context resolution.
    ExternalContextResolution(ExternalContextResolutionId),
    /// A committed external context gap.
    ExternalContextGap(ExternalContextGapId),
}

/// Identifies the only two source shapes that may create an inbound consumer operation.
pub enum MemberConsumerSourceIdentity {
    /// An external envelope with an opaque source-event identity and reference.
    ExternalEvent {
        /// Opaque source-event identity copied from validated envelope metadata.
        source_event_id: SourceEventId,
        /// Body-free reference to that source event.
        source_event_ref: SourceEventRef,
    },
    /// A member fact that was already committed before local propagation.
    CommittedFact {
        /// Typed identity of the already committed local fact.
        fact_ref: MemberCommittedFactRef,
    },
}

/// Identifies a committed derived projection record without treating it as source truth.
pub enum MemberProjectionRecordRef {
    /// A committed member summary view revision.
    SummaryView(MemberSummaryViewId),
    /// A committed capability outlet view revision.
    CapabilityOutletView(CapabilityOutletViewId),
    /// A committed member projection-state successor.
    ProjectionState(MemberProjectionStateId),
    /// A committed member diagnostic view revision.
    DiagnosticView(MemberDiagnosticViewId),
}

/// Classifies one fixed member operations continuation without selecting a scheduler.
pub enum MemberOperationsJobKind {
    /// Continues a prepared publication attempt or publication gap.
    PublicationRelay,
    /// Continues a prepared observation handoff or observation gap.
    ObservationRelay,
    /// Refreshes an owner-specific external-context snapshot, resolution, or gap successor.
    ExternalContextRefresh,
    /// Rebuilds one member read-model revision from committed local sources.
    MemberProjectionRebuild,
    /// Reconciles projection posture from already committed gap and resolution successors.
    GapReconciliation,
}

/// Identifies a committed local record that may appear in a body-free operations-job report.
pub enum MemberJobReportFactRef {
    /// A CP01~CP06 committed local fact or support record.
    MemberFact(MemberCommittedFactRef),
    /// A CP07 derived projection record.
    Projection(MemberProjectionRecordRef),
}

/// References one logical operations-job invocation without claiming a scheduler run or evidence record.
pub struct MemberJobInvocationRef(pub core_contracts::metadata::ExternalReferenceRef);

/// References a local stored public result surface without copying its body or using a foreign owner ref.
pub struct MemberStoredResultSurfaceRef(pub MemberStoredResultSurfaceId);

/// Carries the body-free public outcome of one logical member operations-job invocation.
pub struct MemberJobReport {
    /// Local identity of this immutable report surface.
    pub report_id: MemberJobReportId,
    /// Logical job invocation represented by the report.
    pub job_invocation_ref: MemberJobInvocationRef,
    /// Fixed continuation kind represented by the report.
    pub job_kind: MemberOperationsJobKind,
    /// Ordered unique committed local candidates inspected by the continuation.
    pub scanned_fact_refs: Vec<MemberJobReportFactRef>,
    /// Ordered unique committed local successors produced or selected by the continuation.
    pub advanced_fact_refs: Vec<MemberJobReportFactRef>,
    /// Ordered unique local or foreign typed refs that remain blocked or unknown.
    pub unresolved_refs: Vec<TypedRef>,
    /// Number of committed candidate refs recorded in `scanned_fact_refs`.
    pub scanned_count: u64,
    /// Number of committed successor refs recorded in `advanced_fact_refs`.
    pub changed_count: u64,
    /// Number of unresolved typed refs recorded in `unresolved_refs`.
    pub unresolved_count: u64,
}

/// Carries either a member-local typed identity or a typed foreign identity.
pub enum TypedRef {
    /// A local member record identity.
    Local(MemberCommittedFactRef),
    /// An external identity with an explicit owner boundary.
    External(ExternalTypedRef),
}

/// Carries correlation propagated across member boundaries without a payload body.
pub struct MemberCorrelation {
    /// Core distributed trace identity.
    pub trace_id: core_contracts::metadata::TraceId,
    /// Opaque correlation identity from accepted metadata or an envelope.
    pub correlation_ref: core_contracts::metadata::ExternalReferenceRef,
}

/// Carries a safe low-sensitivity reason category rather than free-form diagnostic text.
pub struct SafeReasonCategory(pub String);

/// Carries a safe low-cardinality status category.
pub struct SafeStatusCategory(pub String);

/// Carries a source-supplied version without assigning local optimistic version semantics.
pub struct SourceVersion(pub String);

/// Carries an explicit local presence revision.
pub struct PresenceRevision(pub u64);

/// Carries an explicit subscription scope revision.
pub struct SubscriptionScopeRevision(pub u64);

/// Carries an explicit revision of one logical projection-state stream.
pub struct ProjectionStateRevision(pub u64);
```

| 类型 | 字段 / 形态 | 来源 | 约束 / 禁止事项 |
|---|---|---|---|
| `MemberCommittedFactRef` | finite enum，载荷为 local typed ID | application 在 local fact commit 后用 object `to_committed_ref()` 取得。 | 不可指向未保存的 object、external event、view、attempt-only memory 或 raw body；它是 CP05 / CP07 的 committed-only gate。 |
| `MemberConsumerSourceIdentity` | `ExternalEvent` 或 `CommittedFact` 的有限 union | worker 只能在已验证 envelope metadata 或已提交 local fact ref 后构造。 | 外部 variant 必须同时保留 `SourceEventId` 与 `SourceEventRef`；本地 variant 只允许 `MemberCommittedFactRef`。不得以 `String`、topic、route、payload、queue offset 或临时 memory object 代替，也不得把两种来源压为 generic listener input。 |
| `MemberProjectionRecordRef` | finite enum，载荷为 CP07 已提交的 view revision 或 projection-state ID | application 在 projection state / view successor 已提交后取得。 | 不代表 CP01~06 source truth；不得指向 in-memory candidate、external registry、query cursor 或未持久化 view。 |
| `MemberJobReportFactRef` | `MemberFact` 或 `Projection` 的有限 union | job application service 只从已提交 local result 收集。 | 不得用 `TypedRef::External`、raw job input 或 adapter receipt 冒充 local job result。 |
| `MemberOperationsJobKind` | five fixed logical continuation kinds | Step 8 Job contract / jobs entry mapping。 | 不等于 cron、binary、scheduler、worker process或真实 run；不得新增第六种 job 而不回开 HLD。 |
| `TypedRef` | `Local` 或 `External` | local committed fact 或已验证 external wrapper。 | 不能用 bare string、route path、URL、payload ref 或 config key 代替；`External` 不表示 local write authority。 |
| `MemberJobInvocationRef` | Core opaque reference 的 local logical wrapper | Step 8 Job metadata / trusted jobs entry 提供。 | 仅绑定一次逻辑 continuation invocation；不是 scheduler run ID、process ID、test run、artifact、evidence或signoff。 |
| `MemberStoredResultSurfaceRef` | member-local stored surface ID wrapper | result Store save / load contract。 | 不用 `ExternalTypedRef`、URL、route、file path、adapter receipt或response body替代；exact storage face留 Step 7 / 13。 |
| `MemberJobReport` | `contracts::jobs` public, body-free report carrier | `MemberJobReportAssembly::finish` with a generated report ID, or a typed stored-report read on duplicate replay。 | 不引用 application-local operation type；不含 run ID、artifact、evidence、test、verdict、signoff、readiness、source body或adapter body。 |
| `MemberCorrelation` | Core `TraceId` + opaque correlation ref | command metadata、validated event envelope或可信 source mapping。 | 两字段均非空；不能通过 body digest、timestamp、subject ID、job run 或 request ID 临时生成。 |
| `SafeReasonCategory` / `SafeStatusCategory` | non-empty opaque safe category | formal source classification、domain policy result、entry validation result。 | 不得携带 raw payload、credential、prompt、hidden reasoning、provider text、complete log或自由诊断文本。有限 taxonomy 未发布前不自行转为 enum。 |
| `SourceVersion` | non-empty opaque source token | formal owner safe response / validated envelope。 | 不等同 local optimistic version、projection watermark、page cursor或 timestamp。 |
| revision newtype | monotonic `u64` | factory initial revision或 domain transition。 | `0` 不可作为 persisted revision；不得用 Store version、external version或 query cursor代替。 |

#### `contracts::jobs` public operations-job values

`MemberOperationsJobKind` 与 `MemberJobReport` 的唯一正式归属是 planned `crates/contracts/src/jobs.rs`。前者是五类 HLD continuation 的有限公共分类；后者是可由 jobs entry、stored-result replay 和 Step 8 job protocol 共同引用的 body-free public carrier。`MemberJobReportAssembly` 仍是 `application` 私有组装 helper，不能反向成为 public report owner。

| `MemberOperationsJobKind` 变体 | Rustdoc 语义 | 唯一 HLD 对应 | 不得做的事 |
|---|---|---|---|
| `PublicationRelay` | prepared publication attempt / gap 的继续处理。 | `PublicationRelayJob`。 | 不重建 outbound decision / material，不声称 downstream delivered / accepted。 |
| `ObservationRelay` | prepared observation handoff / gap 的继续处理。 | `ObservationRelayJob`。 | 不形成 observed / evidence / verdict。 |
| `ExternalContextRefresh` | owner-specific snapshot / resolution / gap successor 的刷新。 | `ExternalContextRefreshJob`。 | 不自动 authorization，不修复 consumer truth。 |
| `MemberProjectionRebuild` | 从 committed local sources 派生新的 CP07 revision。 | `MemberProjectionRebuildJob`。 | 不写 CP01~06 或 external truth。 |
| `GapReconciliation` | 从既有 gap / resolution successor 更新 projection posture。 | `GapReconciliationJob`。 | 不创建、关闭、supersede source gap，也不触发业务 Command。 |

##### `MemberJobReport`

上方代码块是本对象的唯一 Rust-facing schema；本卡片补齐字段来源、factory 和 member capability。它只表达一次**逻辑** Operations Job invocation 的 member-side public outcome，不表达 scheduler、process、run record 或任何执行证据。

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `report_id` | `MemberJobReportId` | immutable report identity。 | application 在开始 assembly 前通过 Step 7 `MemberIdGeneratorPort` 获得；stored-report load 只重建既有 ID。 |
| `job_invocation_ref` / `job_kind` | typed logical invocation / finite kind | 绑定 one logical continuation 的范围。 | 由 validated jobs entry / `MemberOperationContext::from_job` 提供；kind 必须与 entry 的唯一 kind 一致。 |
| `scanned_fact_refs` | `Vec<MemberJobReportFactRef>` | 保存已提交且被 continuation 读取的候选。 | ordered-unique；只来自 application service 已返回的 committed local ref；不得从 repository scan、raw job input 或 adapter body补造。 |
| `advanced_fact_refs` | `Vec<MemberJobReportFactRef>` | 保存已提交的 local successor / derived revision。 | ordered-unique；只来自本次 application outcome；不得表示 external delivered、accepted、observed 或 repair。 |
| `unresolved_refs` | `Vec<TypedRef>` | 明确仍 blocked / pending / unknown 的 local 或 foreign relation。 | ordered-unique；foreign 项只可为 owner-bound `ExternalTypedRef`；不能用 error text、URL或 scheduler state 替代。 |
| `scanned_count` / `changed_count` / `unresolved_count` | `u64` | 公开与三类 ref collection 对称的计数。 | 必须分别等于相应 ordered-unique collection 的长度；不隐藏未列出的 item，不从 current Store 重新统计。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_empty_change(&self) -> bool` | 判断该 logical continuation 是否没有 member-local successor。 | 无。 | `bool`。 | 仅检查 `advanced_fact_refs`；不把 unresolved 解释为 successful no-op。 |
| `pub fn has_unresolved_work(&self) -> bool` | 判断 report 是否保留 blocked / unknown relation。 | 无。 | `bool`。 | 仅检查 report field；不发起 refresh、retry或dispatch。 |
| `pub fn assert_consistent(&self) -> Result<(), MemberContractError>` | 校验 kind、ordered-unique refs、计数和 body-free boundary。 | 无。 | success / validation error。 | 纯校验；不读取 Store、adapter或external source。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(report_id: MemberJobReportId, job_invocation_ref: MemberJobInvocationRef, job_kind: MemberOperationsJobKind, scanned_fact_refs: Vec<MemberJobReportFactRef>, advanced_fact_refs: Vec<MemberJobReportFactRef>, unresolved_refs: Vec<TypedRef>) -> Result<Self, MemberContractError>` | 将 application assembly 的已校验输出转成 immutable public report。 | report ID、logical invocation、fixed kind、三组 ordered-unique refs。 | report / validation error。 | fresh job result save path；factory derives the three counters exactly from collection lengths。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| public but not application-owned | report 位于 `contracts::jobs`，不得引用 `MemberOperationName`、application service、Store trait、entry error或 infra type。 |
| duplicate parity | duplicate replay 必须经 Step 7 typed stored-report read 返回相同 schema；不得重新扫描 current truth 临时拼一份 report。 |
| no run / artifact claim | `job_invocation_ref` 只是 logical protocol correlation；report 不保存 run ID、artifact、evidence、test、verdict、signoff、readiness、payload或adapter body。 |
| local-truth-first | report 可列 local ref / typed foreign unresolved ref，却不拥有、修改或证明 foreign truth。 |

### 7.6 scope、freshness 与 body-free inspection helper

```rust
/// Identifies the local consumer purpose for an external context resolution.
pub enum ExternalConsumerPurpose {
    /// Startup admission and presence establishment.
    Startup,
    /// Inbound scope and screening.
    Screening,
    /// Runtime entry mapping or material-source evaluation.
    RuntimeEntry,
    /// Outbound target or publication-boundary evaluation.
    Outbound,
    /// Observation handoff evaluation.
    Observation,
    /// Read-model projection or capability outlet evaluation.
    Projection,
}

/// Classifies which external context is being safely consumed.
pub enum ExternalContextKind {
    /// Project-member subject context.
    Subject,
    /// Global identity anchor context.
    Identity,
    /// Effective policy or screening-rule context.
    Policy,
    /// Host boundary or host-route context.
    Host,
    /// Runtime entry, source, or handoff context.
    Runtime,
    /// Tool contract context.
    Tool,
    /// Method definition context.
    Method,
    /// Event or publication route context.
    Route,
    /// Downstream target or feedback context.
    Downstream,
}

/// Declares the subject, purpose, and optional seam scope for an external lookup.
pub struct ExternalContextScope {
    /// Project-scoped subject to which the lookup applies.
    pub subject_ref: ProjectMemberRef,
    /// Consumer purpose that limits use of the result.
    pub purpose: ExternalConsumerPurpose,
    /// Optional boundary that must match the source resolution.
    pub boundary_ref: Option<ExternalTypedRef>,
}

/// Identifies the evidence used to judge source freshness.
pub enum FreshnessBasis {
    /// A formal source version supplied by the owner.
    SourceVersion(SourceVersion),
    /// A formal owner timestamp.
    OwnerTimestamp(core_contracts::metadata::Timestamp),
    /// A formal receipt or marker reference.
    ResolutionReceipt(ExternalTypedRef),
}

/// Carries freshness evidence without copying external content.
pub struct SourceFreshnessEvidence {
    /// Evidence form used for the judgement.
    pub basis: FreshnessBasis,
    /// Time at which the evidence was accepted by the member boundary.
    pub observed_at: core_contracts::metadata::Timestamp,
}

/// Records the result of a body-free boundary inspection.
pub enum ForbiddenBodyInspection {
    /// The inspected carrier contains only allowed refs, digests, and safe categories.
    Clean,
    /// A prohibited content category was detected and must not be persisted or forwarded.
    Rejected {
        /// Safe category explaining the rejected content class.
        reason_category: SafeReasonCategory,
    },
}

/// Records an authorized transient inspection without retaining inspected body content.
pub struct TransientInspectionMarker {
    /// Safe result of the transient inspection.
    pub inspection: ForbiddenBodyInspection,
    /// Safe classification of the inspected fact shape.
    pub fact_category: SafeStatusCategory,
}
```

| helper | 作用 | 约束 / 来源 |
|---|---|---|
| `ExternalContextScope` | 让 resolver / policy 明确使用哪个 subject、purpose、boundary，而非从 opaque ref 推 scope。 | `subject_ref` 来自 command / loaded truth；purpose 来自 named use case；boundary 只来自 typed ref / source resolution。不得由 route path或 config string推导。 |
| `FreshnessBasis` / `SourceFreshnessEvidence` | 让 CP06 区分 owner version、owner timestamp、receipt，而非把 local clock 伪装为 source current。 | only owner safe response / validated envelope can supply it；source proof缺失时形成 stale / unresolved / unavailable / unknown。 |
| `ForbiddenBodyInspection` | 为 inbound、Runtime material、outbound material、trace、view 建立明确 gate。 | `Rejected` 的载荷只含 safe reason；不保存被拒 body。`Clean` 不表示 source accepted、policy authorized或 downstream observed。 |
| `TransientInspectionMarker` | 让 `InboundFactRecord` 记录“已进行授权瞬时检查”的安全事实。 | adapter 可以瞬时使用 authorized body；进入 application / domain 后只允许 marker和后续 safe summary。 |

### 7.7 policy input / safe summary helper

以下是 HLD factory / policy method 已使用、但不能留给 implementation 自补的最小 typed carrier。它们均 body-free，不是 external truth object。

```rust
/// Associates one required source role with its neutral member-side resolution.
pub struct ResolvedSourceRole {
    /// Role required by the consuming domain policy.
    pub kind: SourceResolutionKind,
    /// Local neutral-resolution record selected for that role.
    pub resolution_ref: ExternalContextResolutionId,
    /// Status copied from the loaded local resolution at evaluation time.
    pub status: ExternalContextResolutionStatus,
}

/// Summarizes which source resolutions are available to a domain policy.
pub struct SourceResolutionSet {
    /// Ordered, unique source roles evaluated for this operation.
    pub roles: Vec<ResolvedSourceRole>,
}

/// Classifies a required source-resolution role.
pub enum SourceResolutionKind {
    /// Project subject and identity association.
    SubjectIdentity,
    /// Startup context or credential verification.
    StartupCredential,
    /// Effective screening policy source.
    ScreeningRule,
    /// Runtime entry mapping or material-source proof.
    RuntimeContract,
    /// Host boundary or host-route proof.
    HostBoundary,
    /// Publication or downstream-target proof.
    PublicationTarget,
    /// Observation handoff proof.
    ObservationBoundary,
    /// Tool, capability-binding, or Method safe-view proof.
    CapabilityContext,
}

/// Describes an inbound fact without carrying its source payload.
pub struct InboundFactDescriptor {
    /// Typed source event identity.
    pub source_event_ref: SourceEventRef,
    /// Declared source authority.
    pub source_authority_ref: SourceAuthorityRef,
    /// Safe fact-shape category.
    pub fact_category: SafeStatusCategory,
    /// Project-scoped subject inferred only by the trusted boundary.
    pub subject_ref: ProjectMemberRef,
}

/// Carries the body-free input used by inbound screening policy.
pub struct ScreeningInputSummary {
    /// Transient inspection result retained after payload disposal.
    pub inspection_marker: TransientInspectionMarker,
    /// Safe descriptor of the inbound fact.
    pub fact_descriptor: InboundFactDescriptor,
}

/// Carries body-free metadata accepted from a Runtime material boundary.
pub struct RuntimeMaterialMetadata {
    /// Digest of the allowed material surface.
    pub material_digest: core_contracts::metadata::ContractFingerprint,
    /// Safe material category.
    pub material_category: SafeStatusCategory,
    /// Correlation carried by the verified boundary.
    pub correlation: MemberCorrelation,
    /// Result of forbidden-body inspection.
    pub body_inspection: ForbiddenBodyInspection,
}

/// Declares the requested read consistency without becoming a write trigger.
pub enum ProjectionConsistencyHint {
    /// The caller requires a view known current at the requested watermark.
    CurrentRequired {
        /// The minimum committed source position required by the caller.
        required_watermark: core_contracts::metadata::ProjectionWatermark,
    },
    /// The caller permits an explicitly stale or degraded body-free view.
    StaleAllowed,
}
```

| helper | 来源 | 不变量 / 禁止事项 |
|---|---|---|
| `ResolvedSourceRole` / `SourceResolutionSet` | application 从 CP06 stored resolution 读取后，按 declared purpose / scope 构造 role → local resolution → copied status 的 ordered-unique 集合。 | 不含 policy / credential / Runtime / host body；同一 role 不可重复；empty、缺 required role，或非 `Resolved` 状态都必须让调用 policy fail-closed。它不能以 caller-provided `covered_kinds` 伪造 source 可用性。 |
| `InboundFactDescriptor` / `ScreeningInputSummary` | worker adapter 在有授权时瞬时检查 envelope / payload，再构造 body-free summary。 | 不得保留 event body、untrusted subject、free-form taxonomy或 adapter-private payload。 |
| `RuntimeMaterialMetadata` | Runtime-safe source port / consumer verified result。 | digest only binds allowed surface；不能作为 Runtime outcome、tool result或 provider response副本。 |
| `ProjectionConsistencyHint` | Query request explicit field，不能从 actor、page cursor、route或 timeout推断。 | Query 无论值为何都 no-write；`CurrentRequired` 不得触发 rebuild / refresh。 |

### 7.8 shared type 初步审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| local IDs 有唯一生成 owner | pass_for_step_06 | Step 7 必须定义 `MemberIdGeneratorPort`；目前没有 domain / entry 自造 ID。 |
| 外部 ref 不复制 owner body | pass_with_upstream_blockers | wrapper 只承载 Core opaque reference + expected owner；exact upstream schema继续由 `L2M-UP-001/003/004/005/006/008` 阻塞。 |
| public二级类型归属 | pass_for_current_scope | object / policy / view 将使用本节 contracts carrier；Port / DTO专属 carrier留 Step 7 / 8。 |
| safe category 没有伪造 taxonomy | pass | 规则 taxonomy 未稳定时使用 safe opaque wrapper；不建立本地 allowlist。 |
| Core compile 边界 | pass | snippet 只使用 `core-contracts` 已核验 primitive；L0-bus、Runtime、Tools、siblings均未被写成 Cargo dependency。 |

## 8. 非 `contracts` / `domain` 模块对象闭口决策

| 模块 | 当前 Step 6 是否闭口 | 必须闭口的对象组 | 明确 defer 的内容 | 后续承接 Step |
|---|---|---|---|---|
| `application` | 是，限 stable carrier | operation context、facade、idempotency record、stored result、read visibility decision、job report assembly、最小 body-free error carrier。 | Port traits / repository function、UoW implementation、完整错误恢复 / retry taxonomy。 | Step 7、9、11~13。 |
| `infra` | 是，限 availability / assembly state | config reference、builder state、adapter availability、Store state、blocked seam state。 | config keys、secret、endpoint、DB / queue、retry / scheduler、concrete adapter。 | Step 7、11、14。 |
| `api` | 是，限 logical entry | command / query entry、handler result、operation registry state。 | HTTP / RPC / UDS path、auth middleware、serialization product。 | Step 8、12、14。 |
| `worker` | 是，限 consumer entry | inbound entry、per-item result、continuation dispatch context、worker registry state。 | event route、broker loop、DLQ、ack protocol、raw envelope persistence。 | Step 7、8、9、12~14。 |
| `jobs` | 是，限 operations entry | job entry、run result surface、runner registry state。 | scheduler、cron、batch / retry、real run record、artifact / report production。 | Step 8、9、13~16。 |

这些闭口项是 unique stable carrier，不能机械延后；它们也不是已实现对象或可运行组件。

## 9. `contracts` 模块：公共 carrier、safe value 与 view 支撑

### 9.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 在跨层传递中保留 member-local 与 foreign identity 边界 | 已验证 local ID 或外部 owner ref | typed ID / `TypedRef` / owner-bound wrapper | 无业务状态、无 I/O | §7.3~§7.5 的 ID / ref；`MemberCommittedFactRef` | Step 7 的 Store / resolver 签名；Step 8 的 DTO 字段。 |
| 表达不携带正文的安全分类、用途、范围与瞬时检查结果 | formal source classification、domain policy result、authorized transient inspection | safe category、scope、purpose、body inspection marker | 不保存被检查正文 | `SafeReasonCategory`、`SafeStatusCategory`、`ExternalContextScope`、`TransientInspectionMarker` | Step 7 source result；Step 8 consumer payload / receipt。 |
| 为 immutable material / attempt / projection 提供稳定的辅助值 | committed record、formal resolution、source watermark | purpose、resolution evidence、dimension、visibility、projection selector | 仅作为 object field，不拥有 truth | 本节 §9.3~§9.5 helper | Step 7 page / read / handoff Port；Step 8 public secondary schema。 |
| 为 CP07 提供 body-free public read view | committed fact / resolution / projection state | summary、outlet、diagnostic 或 not-ready carrier | revision-only；Query 无写权 | §18 `MemberSummaryView` 等 | Step 7 read Port；Step 8 Query response；Step 9 Query flow。 |

### 9.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `InteractionPurpose` | 把 host、Runtime、outbound、trace / observation 用途显式限定在 carrier 内 | public value enum | 表达用途而不从 route 或 target 猜用途 | 不表达 authorization、delivery、provider 或 transport。 |
| `MemberSubscriptionScope` | 保存已由 CP02 policy 接受的最小订阅范围形状 | public body-free value | 持有 formal source 派生的 fact category / boundary refs | 不内置 Governance allowlist、Bus filter、topic 或 source body。 |
| `AttemptResolutionEvidence` | 在 unknown-side-effect 后提供可回链的 retry evaluation 输入 | public body-free value | 绑定 idempotency proof、resolution refs 和 safe posture | 不自行证明外部 accepted / delivered / observed。 |
| safe dimension / category values | 让 trace / observation / diagnostic 只保留低敏、低基数分类 | public opaque value | non-empty、source-controlled、body-free | 不承载 arbitrary label、complete log、prompt 或 credential。 |
| projection / visibility values | 把 freshness、activation、view selector、visibility disposition 显式暴露给 CP07 | public value enum / selector | 防止 Query 通过 bool 或缺字段隐藏 stale / gap | 不触发 refresh、rebuild、authorization 或 invocation。 |

### 9.3 shared value object 与基础 enum

以下类型在 `contracts/src/refs.rs` 或 `contracts/src/views.rs` 中为 **planned public contract**。代码片段的 Rustdoc 使用 source-English；正文的中文解释不是源码注释模板。

##### `InteractionPurpose`

```rust
/// Classifies the member-local purpose of an interaction without selecting a transport.
pub enum InteractionPurpose {
    /// Carries a host collaboration request, signal, or status posture.
    HostCollaboration,
    /// Carries a controlled submission toward a Runtime boundary.
    RuntimeMediation,
    /// Carries a body-free publication toward a resolved downstream boundary.
    OutboundPublication,
    /// Carries a committed-fact trace relationship.
    InteractionTrace,
    /// Carries a low-sensitive observation handoff.
    Observation,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `HostCollaboration` | `Carries a host collaboration request, signal, or status posture.` | 限定 CP01 material / attempt。 | CP01 command、loaded presence。 | CP01 handoff carrier。 |
| `RuntimeMediation` | `Carries a controlled submission toward a Runtime boundary.` | 限定 CP03 controlled submission。 | CP03 application use case。 | Runtime entry attempt。 |
| `OutboundPublication` | `Carries a body-free publication toward a resolved downstream boundary.` | 限定 CP04 material。 | CP04 decision。 | publication attempt。 |
| `InteractionTrace` | `Carries a committed-fact trace relationship.` | 限定 CP05 trace relation。 | committed local fact mapping。 | trace / diagnostic projection。 |
| `Observation` | `Carries a low-sensitive observation handoff.` | 限定 CP05 observation material。 | trace / gap policy result。 | observation attempt。 |

`InteractionPurpose` 必须由命名 use case / domain policy 写入，不能从 URL、topic、handler、target display name 或 payload body 推断。

##### `MemberSubscriptionScope`

```rust
/// Describes a body-free member subscription scope derived from formal sources.
pub struct MemberSubscriptionScope {
    /// Safe source-derived categories that may be considered by the local boundary.
    pub fact_categories: Vec<SafeStatusCategory>,
    /// Formal boundaries that constrain where the scope may be used.
    pub boundary_refs: Vec<ExternalTypedRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `fact_categories` | `Vec<SafeStatusCategory>` | 表达可由 member boundary 考虑的安全事实类别。 | 只能由 CP06 已提交的 identity / policy resolution 派生；非空；不是本地 allowlist。 |
| `boundary_refs` | `Vec<ExternalTypedRef>` | 限定 scope 可使用的 source / boundary。 | 每项 owner-kind 经 `SubscriptionScopePolicy` 校验；不得存 topic、filter expression、route 或 body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn covers(&self, fact: &InboundFactDescriptor) -> bool` | 仅以 body-free descriptor 判断类别 / boundary 是否受范围覆盖。 | `fact` 已由可信 worker boundary 构造。 | `bool`。 | 纯函数；`true` 不等于 screening passed。 |
| `pub fn is_body_free(&self) -> bool` | 审计 scope carrier。 | 无。 | `bool`。 | 必须恒为真，否则 CP02 policy 拒绝使用。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_formal_resolution(fact_categories: Vec<SafeStatusCategory>, boundary_refs: Vec<ExternalTypedRef>) -> Result<Self, MemberContractError>` | 建立受 formal source 约束的范围值。 | 两个集合均由 application 从 resolved source 取得。 | body-free scope 或 safe validation error。 | `EstablishSubscriptionScope` / `ReplaceSubscriptionScope`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| source-bound | 不允许 API、worker 或 fake 以 free-form filter、topic 或 route 构造 scope。 |
| no authorization truth | scope 只是 member intake boundary，不等于 Governance authorization 或 Bus subscription delivery。 |

##### `AttemptResolutionEvidence`

```rust
/// Carries formal evidence used to evaluate a successor after an unknown local attempt.
pub struct AttemptResolutionEvidence {
    /// Resolution records relevant to the attempted external side effect.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// Optional formal receipt or feedback reference that binds the attempt outcome.
    pub outcome_ref: Option<ExternalTypedRef>,
    /// Idempotency key associated with the original local attempt.
    pub idempotency_key: core_contracts::metadata::IdempotencyKey,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `resolution_refs` | `Vec<ExternalContextResolutionId>` | 回链 CP06 的 source / seam resolution。 | 由 application 按 subject、purpose 与 boundary load；空集合不能授权 unknown retry。 |
| `outcome_ref` | `Option<ExternalTypedRef>` | 关联正式 feedback / receipt。 | 只能来自 owner-specific feedback / resolver；不能由 local clock 或 fake success 填充。 |
| `idempotency_key` | `IdempotencyKey` | 绑定被评估的原 attempt。 | 必须等于 attempt persisted key；不能为新 attempt 临时替换。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn supports_successor_evaluation(&self) -> bool` | 判断是否至少有 formal evidence 可进入 domain retry guard。 | 无。 | `bool`。 | 不等价于 retry approved。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| unknown fence | 若没有 owner resolution / feedback，本值不得构造为 positive evidence。 |
| no result copy | `outcome_ref` 只连接 foreign truth，不复制 receipt、delivery 或 observed body。 |

##### safe category、dimension 与 context category value

```rust
/// Names a low-cardinality safe observation or diagnostic dimension.
pub struct SafeDimensionName(pub String);

/// Carries a low-cardinality safe observation or diagnostic dimension value.
pub struct SafeDimensionValue(pub String);

/// Classifies a low-sensitive observation category supplied by a formal policy result.
pub struct ObservationCategory(pub SafeStatusCategory);

/// Classifies a low-sensitive external context category without retaining source content.
pub struct ExternalContextCategory(pub SafeStatusCategory);

/// Identifies the concrete kind of a member read projection.
pub enum MemberProjectionKind {
    /// Identifies the required member summary projection.
    Summary,
    /// Identifies the optional capability outlet projection.
    CapabilityOutlet,
    /// Identifies the optional diagnostic projection.
    Diagnostic,
}
```

| 类型 | 字段 / 变体 | 来源 | 约束 / 禁止事项 |
|---|---|---|---|
| `SafeDimensionName` / `SafeDimensionValue` | non-empty `String` | formal source category / policy-result mapping。 | 只允许经 low-cardinality validator 进入；不得存 user input、token、payload fragment、path 或 complete log。 |
| `ObservationCategory` / `ExternalContextCategory` | `SafeStatusCategory` wrapper | CP05 / CP06 source resolution、policy result。 | wrapper 不获得 foreign body ownership；taxonomy pending 时不可自造 enum。 |
| `MemberProjectionKind::Summary` | required view kind | summary use case。 | 不可 disabled。 |
| `MemberProjectionKind::CapabilityOutlet` | optional safe-ref view kind | CP06 capability resolution。 | 不建 registry / invocation gateway。 |
| `MemberProjectionKind::Diagnostic` | optional diagnostic view kind | committed trace / resolution。 | 不输出 raw log / config secret。 |

##### projection and visibility public values

```rust
/// Declares whether a projection kind is required or explicitly optional.
pub enum ProjectionActivation {
    /// Requires the projection to be maintained for a supported subject.
    Required,
    /// Enables an optional projection when its sources are sufficient.
    OptionalEnabled,
    /// Explicitly disables an optional projection without changing source truth.
    OptionalDisabled,
}

/// Classifies the freshness of an immutable public projection revision.
pub enum ProjectionFreshness {
    /// The revision covers the requested source watermark.
    Current,
    /// The revision is known to lag an available source watermark.
    Stale,
    /// A rebuild is in progress and the old revision must not claim currentness.
    Rebuilding,
    /// Only a constrained body-free surface is currently available.
    Degraded,
    /// The projection source coverage cannot be proven.
    Unknown,
}

/// Classifies a capability outlet revision without granting invocation authority.
pub enum CapabilityOutletStatus {
    /// Safe display refs and resolutions are sufficient for the configured outlet.
    Available,
    /// The outlet is intentionally absent or inactive.
    NotAvailable,
    /// One or more safe source resolutions are stale.
    Stale,
    /// A required safe ref, resolution, or consumer contract is unresolved.
    Gap,
}

/// Classifies the body-free visibility result of a read policy.
pub enum ProjectionVisibility {
    /// The requested body-free view may be returned.
    Visible,
    /// Only a reduced body-free surface may be returned.
    Restricted,
    /// No view body may be returned for the request.
    Denied,
    /// Visibility cannot be proven and must be surfaced conservatively.
    Unknown,
}
```

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ProjectionActivation::*` | 见代码块。 | 声明 required / optional projection 的激活边界。 | formal product configuration / application request validated by policy。 | `MemberProjectionState::initialize`。 |
| `ProjectionFreshness::*` | 见代码块。 | 表达 public revision 的 freshness，不替代 state-machine。 | `MemberProjectionState` / read policy。 | Query response / not-ready surface。 |
| `CapabilityOutletStatus::*` | 见代码块。 | 表达 ref-derived outlet display posture。 | CP06 resolution / gap + read policy。 | `CapabilityOutletView` / Query response。 |
| `ProjectionVisibility::*` | 见代码块。 | 表达 Query visibility outcome。 | read policy + trusted actor context。 | `ReadVisibilityDecision` / response mapper。 |

### 9.4 cross-cutting public error carrier

`MemberContractError` 是本 Step 为 public value validation 预留的最小安全错误 carrier；完整 protocol / application / infra error mapping 仍分别留 Step 8、Step 12。它不得作为外部 owner failure 的 shadow body。

```rust
/// Represents a redacted contract-validation failure for a public member carrier.
pub enum MemberContractError {
    /// A required opaque value is empty or structurally absent.
    MissingRequiredValue(SafeReasonCategory),
    /// A carrier violates the body-free or low-cardinality boundary.
    UnsafeCarrier(SafeReasonCategory),
    /// An external wrapper does not match its expected owner kind.
    OwnerMismatch(SafeReasonCategory),
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `MissingRequiredValue` | `A required opaque value is empty or structurally absent.` | 拒绝缺失 required value。 | public factory validation。 | API / worker safe error mapping。 |
| `UnsafeCarrier` | `A carrier violates the body-free or low-cardinality boundary.` | 拒绝 body / high-cardinality 违例。 | boundary / policy validator。 | quarantine / safe rejection。 |
| `OwnerMismatch` | `An external wrapper does not match its expected owner kind.` | 拒绝 ref owner-kind mismatch。 | typed-ref constructor。 | blocked / rejected surface。 |

### 9.5 `contracts` 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| shared ID、ref、metadata 与 base safe values 有唯一归属 | pass_for_current_batch | 所有 cross-layer type 在 `contracts`；domain object / policy 没有被提升为 global `common`。 |
| `MemberSubscriptionScope` 不成为 local allowlist 或 Bus filter | pass | 范围只保存 formal-resolution-derived category / boundary ref；taxonomy / actual subscription carrier仍由 `L2M-UP-005/007` 限制。 |
| unknown-side-effect evidence 不伪造 external outcome | pass | `AttemptResolutionEvidence` 只承接 ref / resolution / original key，未知时不形成 positive result。 |
| projection values不掩盖 freshness / authorization | pass | `Current`、`Available`、`Visible` 三种语义独立，且都不等于 owner authorization / invocation。 |
| contracts 无反向依赖 | pass | 只引用 `core-contracts` primitive；无 domain / application / sibling type。 |

`contracts` 基础 carrier 批次 `6.1` 已完成，但 CP07 public views 依赖 CP07 object contract，将在 §18 完成后与 `domain::read_model` 一起复审。

### 9.6 domain / projection 所需的最小 local support value

这一组不是第八个业务组成部分，也不是把所有未定类型塞进 `common`。它们只承接已经在 CP01～CP07 的对象工厂或纯函数签名中出现、且不能留给实现者临时自造的 typed input / output。Port 返回值、DTO、envelope、错误协议和物理 revision carrier 仍分别留 Step 7、8、11、12。

```rust
/// Represents a redacted domain-invariant failure.
pub enum DomainError {
    /// A required local or owner-bound input is absent.
    MissingRequiredInput(SafeReasonCategory),
    /// A requested local state transition is not permitted.
    IllegalTransition(SafeReasonCategory),
    /// A body-free, owner, subject, or correlation invariant is violated.
    InvariantViolation(SafeReasonCategory),
}

/// Explains a requested local presence transition without carrying host state.
pub struct PresenceTransitionReason(pub SafeReasonCategory);

/// Carries the body-free inputs needed to start a local presence record.
pub struct PresenceStartContext {
    /// Project member that must equal the accepted admission subject.
    pub subject_ref: ProjectMemberRef,
    /// Global identity anchor that must equal the accepted admission anchor.
    pub identity_anchor_ref: GlobalMemberRef,
    /// Safe initial-start reason supplied by the admitted use case.
    pub reason_category: SafeReasonCategory,
}

/// Classifies a committed member fact for trace and projection selection.
pub enum MemberFactKind {
    /// A presence or host-collaboration local fact.
    PresenceHost,
    /// A subscription, intake, or screening local fact.
    Inbound,
    /// A Runtime mediation local fact.
    RuntimeMediation,
    /// An outbound decision, publication attempt, or publication gap.
    Outbound,
}

/// Carries one low-cardinality observation dimension as an ordered unique item.
pub struct SafeDimension {
    /// Low-cardinality dimension name.
    pub name: SafeDimensionName,
    /// Low-cardinality dimension value.
    pub value: SafeDimensionValue,
}

/// Describes the read scope used together with a Core actor context.
pub struct ProjectionVisibilityContext {
    /// Subject whose body-free view is requested.
    pub subject_ref: ProjectMemberRef,
    /// Requested projection kind.
    pub projection_kind: MemberProjectionKind,
    /// Formal body-free basis used to evaluate whether this view may be exposed.
    pub visibility_basis_ref: Option<ProjectionVisibilityBasisRef>,
}

/// Summarizes the local presence surface exposed by a summary view.
pub struct MemberPresenceSummary {
    /// Current member-local presence posture.
    pub status: MemberPresenceStatus,
    /// Safe explanation when the posture is not normal.
    pub reason_category: Option<SafeReasonCategory>,
    /// Revision of the presence fact from which this summary was derived.
    pub revision: PresenceRevision,
}

/// Summarizes interaction posture without copying interaction bodies.
pub struct MemberInteractionSummary {
    /// Low-cardinality status categories derived from committed facts.
    pub categories: Vec<SafeStatusCategory>,
    /// Gaps that prevent a stronger body-free statement.
    pub gap_refs: Vec<TypedRef>,
}

/// Describes the result of serving a projection without initiating work.
pub enum ProjectionServeDisposition {
    /// A current body-free revision is available.
    Current,
    /// A caller explicitly allowed the available stale revision.
    Stale,
    /// Only a constrained degraded body-free surface is available.
    Degraded,
    /// No revision can satisfy the requested consistency hint.
    NotReady,
    /// Visibility policy prevents exposing the requested body.
    NotVisible,
}

/// States the only answer that a capability outlet may give about invocation.
pub enum NonAuthorizingInvocationDisposition {
    /// Invocation authority is outside L2-member.
    NotAuthorizedHere,
}
```

| 类型 | 字段 / 变体来源 | 可用于 | 明确禁止 |
|---|---|---|---|
| `DomainError` | domain factory / guard 对 safe invariant 的最小判断。 | Step 6 object method result；Step 12 再细化错误树。 | 不携带 raw body、credential、adapter error、HTTP / Bus status。 |
| `PresenceTransitionReason` / `PresenceStartContext` | named command、accepted admission、application clock / ID 输入。 | `MemberPresence` factory / transition。 | 不以 heartbeat、host health、container state 或 Runtime state补造。 |
| `MemberFactKind` | object type 到固定 CP family 的映射。 | trace、projection selection、safe diagnostic。 | 不作为 event route、topic、Bus schema 或 foreign-owner type。 |
| `SafeDimension` / summary helper | committed fact、gap、read policy 的受控派生。 | CP05 material、CP07 view。 | 不用 `HashMap<String, String>`、自由 label、完整日志或正文替代。 |
| `ProjectionVisibilityContext` | Query request first provides subject/kind; application then supplies an owner-bound visibility basis when one is formally resolvable. | `ReadProjectionPolicy` / `ReadVisibilityDecision`。 | 无 basis 时不得推断 `Visible`；不从 actor display name、role text、route、query cursor或 loaded view反推。 |
| `ProjectionServeDisposition` / `NonAuthorizingInvocationDisposition` | read policy、projection state、outlet rule。 | Query response mapper。 | 不触发 refresh / rebuild；不表示 Tools invocation 可用。 |

## 10. `domain` CP01：Presence and Host Collaboration

### 10.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 受理项目型启动语境 | 双锚、startup / credential refs、source resolutions | local `StartupAdmission` | accepted / rejected / blocked；append-only | `StartupAdmission`、`PresenceAdmissionPolicy` | Step 7 source ports；Step 8 `AdmitMemberStartup`。 |
| 建立和迁移 member-local presence | accepted admission、start context、显式 target / reason | `MemberPresence` successor revision | starting / ready / degraded / draining / terminated / unknown | `MemberPresence` | Step 7 `PresenceStore`；Step 9 presence flows。 |
| 准备 host 协作材料和 local attempt | committed presence、purpose、safe status、host boundary ref | immutable material + prepared attempt | attempt 后续可 submitted / feedback-linked / blocked / unknown | `HostCollaborationMaterial`、`HostCollaborationAttempt` | Step 7 `HostCollaborationPort`；Step 8/9 continuation。 |

### 10.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `StartupAdmission` | 记录一次本地启动受理决定 | decision record | 双锚一致性、source anchoring、presence qualification | 不创建 host session / registry，不保存 credential body。 |
| `MemberPresence` | 维护 member-local 在场 revision | aggregate / state truth | 显式迁移、入站资格、terminal / unknown fence | 不表达 process liveness、host health、container lifecycle。 |
| `HostCollaborationMaterial` | 形成 registration / liveness / status 的最小材料 | immutable material | body-free、presence revision matching | 不声明 host accepted，不成为容器控制命令。 |
| `HostCollaborationAttempt` | 记录 host seam 调用及 feedback 关联 | append-only attempt | prepared / submitted / feedback link / unknown fence | 不把 submitted 转为 acceptance / health，不盲重试。 |
| `PresenceAdmissionPolicy` | 守护 subject / identity / source 前置 | policy / guard | project-only、required resolution、fail-closed | 不签发 credential、不读取 Runtime / host health。 |

### 10.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `StartupAdmission` | 形成并解释 admission | id、双锚、startup / credential refs、source refs、reason | `decide(...)` | `permits_presence`、`matches_subject`、`is_terminal` | `StartupAdmissionDisposition` | command metadata、source resolution、application ID。 |
| `MemberPresence` | 建立 / 迁移 / 判断入站资格 | id、admission ref、双锚、status、revision、reason | `start_from(...)` | `transition_to`、`can_accept_inbound`、`matches_subject`、`is_terminal` | `MemberPresenceStatus` | accepted admission、explicit transition command、local clock / revision。 |
| `HostCollaborationMaterial` | 生成安全材料 | id、presence ref、kind、subject、purpose、revision、safe status、correlation | `prepare(...)` | `is_body_free`、`matches_presence` | immutable | committed presence + named purpose + policy-derived safe status。 |
| `HostCollaborationAttempt` | 记录 seam invocation / feedback | id、material ref、boundary ref、status、key、refs、timestamps、reason | `prepare(...)` | `mark_submitted`、`link_feedback`、`mark_unknown`、`is_retry_safe` | `HostCollaborationAttemptStatus` | material、typed seam result、formal feedback / resolution。 |
| `PresenceAdmissionPolicy` | 评估 admission | supported subject、required sources、unknown handling、association rule | `project_scoped()` | `evaluate`、`rejects_non_project`、`requires_fail_closed` | 无独立状态 | architecture invariant + source resolution set。 |

### 10.4 `StartupAdmission`

```rust
/// Records a local admission decision for one project-scoped member startup.
pub struct StartupAdmission {
    /// Local identity of this admission decision.
    pub admission_id: StartupAdmissionId,
    /// The only supported forward execution subject.
    pub subject_ref: ProjectMemberRef,
    /// The global identity anchor associated with the subject.
    pub identity_anchor_ref: GlobalMemberRef,
    /// Opaque reference to the formal startup context.
    pub startup_context_ref: StartupContextRef,
    /// Optional opaque credential verification reference.
    pub credential_ref: Option<CredentialRef>,
    /// Local admission disposition.
    pub disposition: StartupAdmissionDisposition,
    /// Minimal source references used by the decision.
    pub source_refs: Vec<TypedRef>,
    /// Redacted reason for the disposition.
    pub reason_category: SafeReasonCategory,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `admission_id` | `StartupAdmissionId` | 该 local decision 的稳定 identity。 | 由 application `MemberIdGeneratorPort` 提供；不得从 subject / timestamp 拼接。 |
| `subject_ref` | `ProjectMemberRef` | 当前唯一正向 execution subject。 | 来自命令并经 owner-specific source 验证；不得替换为 GlobalMember。 |
| `identity_anchor_ref` | `GlobalMemberRef` | 关联身份锚。 | 来自 Identity source resolution；不复制身份 body。 |
| `startup_context_ref` | `StartupContextRef` | 回链启动语境。 | 只保存 opaque ref；不保存 startup payload / token。 |
| `credential_ref` | `Option<CredentialRef>` | 可验证凭据引用。 | 由 credential owner / verifier 提供；不能保存 secret；缺失处理由 policy 决定。 |
| `disposition` | `StartupAdmissionDisposition` | local admission 结果。 | 只能由 `PresenceAdmissionPolicy` 产生；blocked 不可被默认改成 accepted。 |
| `source_refs` | `Vec<TypedRef>` | 解释 subject / identity / startup / credential 来源。 | 最小、typed、owner-bound；不得包含正文。 |
| `reason_category` | `SafeReasonCategory` | 低敏原因。 | 非空、source / policy-derived；不能放自由诊断文本。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn permits_presence(&self) -> bool` | 判断是否可建立 starting presence。 | 无。 | `bool`。 | 仅 `Accepted` 为真。 |
| `pub fn matches_subject(&self, subject_ref: &ProjectMemberRef, identity_anchor_ref: &GlobalMemberRef) -> bool` | 验证双锚一致性。 | 调用方提供已验证 refs。 | `bool`。 | 纯函数；不改变 source truth。 |
| `pub fn is_terminal(&self) -> bool` | 判断本次决定是否已结束。 | 无。 | `bool`。 | `Accepted` / `Rejected` 为 terminal；`Blocked` 仍需新决定。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn decide(admission_id: StartupAdmissionId, subject_ref: ProjectMemberRef, identity_anchor_ref: GlobalMemberRef, startup_context_ref: StartupContextRef, credential_ref: Option<CredentialRef>, source_refs: Vec<TypedRef>, resolutions: SourceResolutionSet, policy: &PresenceAdmissionPolicy, reason_category: SafeReasonCategory) -> Result<Self, DomainError>` | 从 source-anchored 输入形成 admission。 | ID / refs 来自 application 与 source ports；`policy` 执行 fail-closed 判断。 | `StartupAdmission` 或 domain error。 | `AdmitMemberStartup`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| project-only subject | 非 `ProjectMemberRef + GlobalMemberRef` 的主语必须 rejected / blocked。 |
| append-only decision | 新 basis 产生新 admission ID；不得原地把 rejected / blocked 改成 accepted。 |
| external truth separation | 不声明 host accepted、credential valid beyond ref、container readiness 或 Runtime state。 |

### 10.5 `MemberPresence`

```rust
/// Maintains the explicit local presence posture of an admitted project member.
pub struct MemberPresence {
    /// Local identity of this presence record.
    pub presence_id: MemberPresenceId,
    /// Accepted startup admission that authorizes this local record.
    pub admission_ref: StartupAdmissionId,
    /// Project-scoped execution subject.
    pub subject_ref: ProjectMemberRef,
    /// Associated global identity anchor.
    pub identity_anchor_ref: GlobalMemberRef,
    /// Explicit local presence posture.
    pub status: MemberPresenceStatus,
    /// Monotonic local presence revision.
    pub revision: PresenceRevision,
    /// Optional safe reason for a non-normal posture.
    pub reason_category: Option<SafeReasonCategory>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `presence_id` | `MemberPresenceId` | local presence identity。 | application ID port；load 原样重建。 |
| `admission_ref` | `StartupAdmissionId` | 回链 accepted admission。 | 只能引用 `permits_presence()` 为真的决定。 |
| `subject_ref` / `identity_anchor_ref` | typed refs | 固定双锚。 | 必须与 admission 一致；不复制 owner body。 |
| `status` | `MemberPresenceStatus` | local lifecycle posture。 | 只能经 transition guard 改变；不由 heartbeat 隐式写入。 |
| `revision` | `PresenceRevision` | 本地乐观顺序。 | 由 successor factory / UoW 分配；不得当外部 version。 |
| `reason_category` | `Option<SafeReasonCategory>` | degraded / unknown 等安全理由。 | 正常 `Ready` 可为空；非正常状态必须有可解释 safe category。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn transition_to(&self, target_status: MemberPresenceStatus, reason: PresenceTransitionReason, next_revision: PresenceRevision) -> Result<Self, DomainError>` | 产生 successor presence revision。 | target、typed reason、已分配 next revision。 | 新 `MemberPresence` 或非法迁移 error。 | 不原地修改；禁止隐式 heartbeat transition。 |
| `pub fn can_accept_inbound(&self) -> bool` | 判断是否允许 CP02 intake。 | 无。 | `bool`。 | 只在 `Ready` 或 policy 明确允许的 `Degraded` 为真；draining / terminated / unknown 为假。 |
| `pub fn matches_subject(&self, subject_ref: &ProjectMemberRef, identity_anchor_ref: &GlobalMemberRef) -> bool` | 检查双锚一致。 | typed refs。 | `bool`。 | 纯函数。 |
| `pub fn is_terminal(&self) -> bool` | 判断 explicit terminal。 | 无。 | `bool`。 | 只对 `Terminated` 为真。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start_from(admission: StartupAdmission, start_context: PresenceStartContext, presence_id: MemberPresenceId, initial_revision: PresenceRevision) -> Result<Self, DomainError>` | 从 accepted admission 建立 starting presence。 | admission 必须 `permits_presence()`；start context 只含 local safe inputs。 | starting presence 或 error。 | `EstablishMemberPresence`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| admission gate | 非 accepted admission 不得创建 presence。 |
| local-only readiness | `Ready` 只表示 member-local prerequisites；不表示 host / Runtime ready。 |
| terminal history | `Terminated` 记录保留；重新在场须走新 admission / presence 链。 |

## 11. `contracts` 模块：CP01~CP07 public state / disposition 契约

本节先定义 public 或跨层必需的状态值；完整转换矩阵留 Step 10。任何 `accepted`、`submitted`、`resolved`、`available`、`current` 等名称都必须连同所属 object type 使用，不能被通用成功枚举代替。

### 11.1 CP01 Presence and Host Collaboration state values

```rust
/// Classifies one local startup admission decision.
pub enum StartupAdmissionDisposition {
    /// All required project-subject, identity, startup, and credential resolutions are usable.
    Accepted,
    /// A verified local invariant rejects this admission.
    Rejected,
    /// A required owner contract or source cannot be proven.
    Blocked,
}

/// Classifies the local presence posture of an admitted project member.
pub enum MemberPresenceStatus {
    /// The local presence has been created but is not yet ready to accept inbound work.
    Starting,
    /// Member-local prerequisites are satisfied.
    Ready,
    /// A local dependency issue is explicitly represented without claiming host health.
    Degraded,
    /// The local presence stops accepting new work while preserving its history.
    Draining,
    /// The local presence was explicitly terminated.
    Terminated,
    /// The local presence cannot be proven and must not be auto-promoted.
    Unknown,
}

/// Identifies the semantic kind of body-free host collaboration material.
pub enum HostCollaborationKind {
    /// Requests host-side registration handling without asserting acceptance.
    RegistrationRequest,
    /// Reports a member-local liveness signal without asserting host health.
    LivenessSignal,
    /// Reports a member-local status posture without copying host state.
    StatusReport,
}

/// Classifies one local host-boundary attempt.
pub enum HostCollaborationAttemptStatus {
    /// A material-backed attempt exists but no seam invocation was made.
    Prepared,
    /// The member invoked the formal host seam.
    Submitted,
    /// A formal host feedback reference was linked to the attempt.
    FeedbackLinked,
    /// A required seam or prerequisite prevents a positive invocation.
    Blocked,
    /// The external side effect cannot be proven and is fenced.
    Unknown,
}
```

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `StartupAdmissionDisposition::{Accepted,Rejected,Blocked}` | 见代码块。 | 表示一次 local admission 的终结决定。 | `PresenceAdmissionPolicy` 的 evaluation。 | `MemberPresence::start_from` 仅可消费 `Accepted`；其余只读 / trace / view。 |
| `MemberPresenceStatus::{Starting,Ready,Degraded,Draining,Terminated,Unknown}` | 见代码块。 | 表示 member-local presence，不表达 process / host lifecycle。 | explicit command、owner-specific feedback ref 的 local basis、formal resolution。 | CP02 admission gate、host material、read view。 |
| `HostCollaborationKind::*` | 见代码块。 | 选择 material 的语义目的。 | named CP01 use case。 | `HostCollaborationMaterial`。 |
| `HostCollaborationAttemptStatus::*` | 见代码块。 | 表示 local seam posture。 | attempt factory、host handoff result / feedback link。 | trace、gap、read posture；不得成为 host health。 |

### 11.2 CP02 Inbound Boundary state values

```rust
/// Classifies the lifecycle of a local subscription-scope decision.
pub enum SubscriptionScopeStatus {
    /// The decision is the current local intake scope for its subject.
    Active,
    /// A successor scope decision replaced this record.
    Superseded,
    /// The proposed scope violates a verified local boundary.
    Rejected,
    /// Required source resolution is unavailable, stale, conflicting, or unknown.
    Blocked,
}

/// Classifies the local intake result for one source fact.
pub enum InboundIntakeDisposition {
    /// The body-free source descriptor is eligible for local screening.
    Accepted,
    /// A semantically identical source fact was already recorded.
    Duplicate,
    /// The source kind, version, or fact shape is outside the supported boundary.
    Unsupported,
    /// Source, scope, or inspection preconditions cannot be proven.
    Blocked,
}

/// Classifies the member-local pre-screening result for an accepted inbound fact.
pub enum ScreeningDisposition {
    /// The fact may enter controlled Runtime delivery evaluation.
    Passed,
    /// Only an explicitly narrowed local continuation may be evaluated.
    Degraded,
    /// A verified boundary violation prevents Runtime delivery.
    Blocked,
    /// Required rule source or evaluation input is not yet sufficient.
    Pending,
}
```

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `SubscriptionScopeStatus::*` | 见代码块。 | 将 current scope 与历史 / failure 分开。 | `SubscriptionScopePolicy`。 | `Active` 才能进入 `InboundFactRecord` scope match。 |
| `InboundIntakeDisposition::*` | 见代码块。 | 描述 member local intake，不是 Bus delivery receipt。 | trusted consumer envelope gate + scope。 | `Accepted` 才可作 screening input。 |
| `ScreeningDisposition::*` | 见代码块。 | 描述 member pre-screen，不是 Governance policy或 Runtime admission。 | `InboundScreeningPolicy`。 | `Passed` / formal narrowed `Degraded` 可评估 CP03；其余 fail-closed。 |

### 11.3 CP03 Runtime Mediation state values

```rust
/// Classifies a member-local decision to prepare a Runtime submission.
pub enum RuntimeDeliveryDisposition {
    /// Local prerequisites and a formal entry mapping permit a submission attempt.
    Eligible,
    /// A verified local prerequisite rejects delivery.
    Rejected,
    /// The Runtime boundary or entry contract cannot be proven.
    Blocked,
    /// A required source resolution is still pending.
    Pending,
}

/// Classifies one local Runtime submission attempt.
pub enum RuntimeSubmissionAttemptStatus {
    /// An eligible delivery decision created the attempt.
    Prepared,
    /// The formal Runtime entry seam was invoked.
    Submitted,
    /// A formal Runtime result link was recorded.
    ResultLinked,
    /// A required boundary or precondition prevents submission.
    Blocked,
    /// The submit side effect cannot be proven and is fenced.
    Unknown,
}

/// Safely classifies a referenced Runtime-owned admission or result without copying it.
pub enum RuntimeResultClassification {
    /// The referenced Runtime decision reports acceptance at its own boundary.
    Accepted,
    /// The referenced Runtime decision reports rejection at its own boundary.
    Rejected,
    /// The referenced Runtime decision is waiting for a later owner action.
    Waiting,
    /// The referenced Runtime boundary reports a blocked posture.
    Blocked,
    /// The member cannot prove the referenced result classification.
    Unknown,
}

/// Classifies local reception of Runtime-owned safe handoff material.
pub enum RuntimeMaterialReceptionDisposition {
    /// The material source, correlation, and body gate are sufficient for outbound evaluation.
    Accepted,
    /// The material or source violates a known boundary.
    Rejected,
    /// The same committed material was already received for this local purpose.
    Duplicate,
    /// The material belongs to an earlier local correlation and cannot replace current state.
    Late,
    /// Source-family or contract proof is absent.
    Blocked,
    /// Material integrity or commitment cannot be proven.
    Unknown,
}
```

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `RuntimeDeliveryDisposition::*` | 见代码块。 | member 是否允许准备 submission。 | `RuntimeMediationPolicy::evaluate_delivery`。 | 仅 `Eligible` 可建立 `RuntimeSubmissionAttempt`。 |
| `RuntimeSubmissionAttemptStatus::*` | 见代码块。 | member local Runtime seam posture。 | attempt factory、entry port safe result、result link。 | trace / read / future resolution；不能升级 run state。 |
| `RuntimeResultClassification::*` | 见代码块。 | 对 Runtime ref 的安全分类。 | formally verified Runtime result mapping。 | `RuntimeResultLink` / Query view；不改变 `RuntimeDeliveryDecision`。 |
| `RuntimeMaterialReceptionDisposition::*` | 见代码块。 | local safe material reception 分类。 | Runtime material consumer / source port + policy。 | 仅 `Accepted` 可进入 CP04 decision。 |

### 11.4 CP04 and CP05 state values

```rust
/// Classifies a member-local outbound decision.
pub enum OutboundDisposition {
    /// The accepted source, target, purpose, and body-free gates permit material creation.
    Eligible,
    /// A verified source, target, purpose, or material rule rejects outbound handling.
    Rejected,
    /// A formal publication seam or source family cannot be proven.
    Blocked,
    /// A target or publication resolution is still pending.
    Pending,
}

/// Classifies one local publication attempt.
pub enum PublicationAttemptStatus {
    /// A material-backed attempt is ready but has not invoked its seam.
    Prepared,
    /// The publication seam was invoked locally.
    Submitted,
    /// A formal downstream feedback reference was linked.
    FeedbackLinked,
    /// A prerequisite prevents positive invocation.
    Blocked,
    /// The publication side effect cannot be proven and is fenced.
    Unknown,
}

/// Classifies the missing relation represented by a publication gap.
pub enum PublicationGapCategory {
    /// The required route or boundary resolution is absent.
    RouteUnresolved,
    /// A submitted invocation has an unknown local side-effect result.
    SubmissionUnknown,
    /// A formal delivery signal reports failure without changing local source truth.
    DeliveryFailed,
    /// Feedback needed to classify the handoff is unresolved.
    FeedbackUnresolved,
    /// An upstream contract prevents a safe positive path.
    ContractBlocked,
}

/// Classifies the local lifecycle of a publication gap.
pub enum PublicationGapStatus {
    /// The gap has no active resolution request.
    Open,
    /// A formal resolution request is outstanding.
    ResolutionPending,
    /// A formal reference explains the local gap.
    Resolved,
    /// A successor gap now carries the latest local handling.
    Superseded,
}

/// Classifies the missing relation represented by an interaction trace gap.
pub enum InteractionGapCategory {
    /// A required committed or external reference is missing.
    MissingRef,
    /// Correlation values conflict across otherwise valid refs.
    CorrelationConflict,
    /// A local trace append could not be completed after source commit.
    TraceAppendFailed,
    /// A required formal source cannot be resolved.
    SourceUnresolved,
    /// Ordering cannot be proven safely.
    OrderingUnknown,
}

/// Classifies the lifecycle of a local interaction gap.
pub enum InteractionGapStatus {
    /// The gap is open without a current resolution request.
    Open,
    /// A required owner seam is unavailable or not closed.
    Blocked,
    /// A formal resolution request is outstanding.
    ResolutionPending,
    /// A formal reference explains the local gap.
    Resolved,
    /// The gap impact cannot be proven.
    Unknown,
    /// A successor gap supersedes this local record.
    Superseded,
}

/// Classifies one local observation handoff attempt.
pub enum ObservationAttemptStatus {
    /// A body-free observation material record is ready for handoff.
    Prepared,
    /// The observation seam was invoked locally.
    Submitted,
    /// A formal observation feedback reference was linked.
    FeedbackLinked,
    /// A contract or safety prerequisite prevents positive invocation.
    Blocked,
    /// The observation side effect cannot be proven and is fenced.
    Unknown,
}
```

| enum / 变体组 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `OutboundDisposition::*` | 见代码块。 | CP04 local decision posture。 | `OutboundMaterialPolicy`。 | `Eligible` 仅允许 material factory。 |
| `PublicationAttemptStatus::*` | 见代码块。 | local invocation / feedback posture。 | publication port / feedback consumer。 | gap、trace、posture read；不能代答 delivery。 |
| `PublicationGapCategory` / `PublicationGapStatus` | 见代码块。 | 明确 publication 未闭合原因与生命周期。 | local decision / attempt / formal feedback resolution。 | reconciliation / diagnostic projection。 |
| `InteractionGapCategory` / `InteractionGapStatus` | 见代码块。 | 明确 trace relation 的缺失与安全退化。 | committed fact tracing / formal resolution。 | trace query / diagnostics / observation input。 |
| `ObservationAttemptStatus::*` | 见代码块。 | observation seam local posture。 | observation port / feedback consumer。 | gap / trace / read posture；不能升级 observed。 |

### 11.5 Step 6 support vocabulary closure

本节把对象卡片中反复出现、但不属于任何一个业务 truth owner 的最小类型补齐。它们是 **planned contract vocabulary**，不是已实现的 Rust source。所有集合均采用明确的 Rust 形态；`List`、`Set`、`Map`、`Boolean` 等 HLD 概念名不进入本 Step 的成品签名。

```rust
/// Re-exports the verified Core request timestamp type for planned member contracts.
pub type Timestamp = core_contracts::metadata::Timestamp;
/// Re-exports the verified Core idempotency key type for planned member contracts.
pub type IdempotencyKey = core_contracts::metadata::IdempotencyKey;
/// Re-exports the verified Core trace identifier type for planned member contracts.
pub type TraceId = core_contracts::metadata::TraceId;
/// Re-exports the verified Core actor context type for planned member contracts.
pub type ActorContext = core_contracts::actor::ActorContext;
/// Re-exports the verified Core actor reference type for planned member contracts.
pub type ActorRef = core_contracts::actor::ActorRef;
/// Re-exports the verified Core command metadata type for planned member contracts.
pub type CommandMetadata = core_contracts::metadata::CommandMetadata;
/// Re-exports the verified Core query metadata type for planned member contracts.
pub type QueryMetadata = core_contracts::metadata::QueryMetadata;
/// Re-exports the verified Core projection watermark type for planned member contracts.
pub type ProjectionWatermark = core_contracts::metadata::ProjectionWatermark;

/// Carries a digest of an explicitly allowed, body-free surface.
pub struct Digest(pub core_contracts::metadata::ContractFingerprint);

/// Carries an opaque schema version supplied by a formal source boundary.
pub struct SchemaVersion(pub String);
/// Carries an opaque source-event identity supplied by a formal source boundary.
pub struct SourceEventId(pub String);
/// Carries an opaque deduplication key supplied by a formal source boundary.
pub struct DeduplicationKey(pub String);
/// Carries an expected local revision supplied by a write command.
pub struct ExpectedRevision(pub u64);
/// Carries a redacted reason for an unknown side effect.
pub struct UnknownReason(pub SafeReasonCategory);

/// Identifies the owner that is allowed to interpret an external reference.
pub struct ExternalOwnerRef {
    /// Owner namespace of the external reference.
    pub owner_kind: ExternalOwnerKind,
    /// Opaque owner reference supplied by that namespace.
    pub owner_ref: ExternalTypedRef,
}

/// Classifies the execution-subject shapes known to this design.
pub enum ExecutionSubjectKind {
    /// The only forward execution subject currently supported.
    ProjectMember,
    /// A subject shape that has no accepted contract in this design.
    Unknown,
}

/// Carries a subject candidate while preserving the third-subject blocker.
pub enum ExecutionSubjectRef {
    /// A project-scoped member subject.
    Project(ProjectMemberRef),
    /// A global identity reference that is not itself an execution subject.
    Global(GlobalMemberRef),
    /// An unresolved or unsupported subject shape.
    Unknown(ExternalTypedRef),
}

/// Declares how unresolved source conditions are handled by a domain policy.
pub enum UnknownHandlingMode {
    /// Do not authorize a positive path when proof is missing.
    FailClosed,
    /// Permit only a separately named degraded path with explicit source proof.
    ExplicitDegradedOnly,
}

/// Declares the required project-to-global subject association rule.
pub enum SubjectAnchorAssociationRule {
    /// A ProjectMemberRef must be paired with its matching GlobalMemberRef.
    ProjectRequiresGlobalAnchor,
}

/// Declares the scope boundary for a project member.
pub enum ProjectSubjectScopeRule {
    /// Only a project-scoped subject may become active.
    ProjectOnly,
}

/// Declares how subscription scope changes are versioned.
pub enum ScopeChangeMode {
    /// Every accepted change creates a new explicit revision.
    ExplicitRevision,
}

/// Records the evidence used to evaluate an unknown host side effect.
pub struct HostResolutionEvidence {
    /// Neutral resolution references relevant to the host attempt.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// Optional formal host feedback reference.
    pub feedback_ref: Option<HostFeedbackRef>,
    /// Idempotency key of the original attempt.
    pub idempotency_key: IdempotencyKey,
}

/// Records the evidence used to evaluate an unknown Runtime side effect.
pub struct RuntimeResolutionEvidence {
    /// Neutral resolution references relevant to the Runtime attempt.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// Optional formal Runtime result reference.
    pub result_ref: Option<RuntimeAdmissionDecisionRef>,
    /// Idempotency key of the original attempt.
    pub idempotency_key: IdempotencyKey,
}

/// Records the evidence used to evaluate an unknown publication side effect.
pub struct PublicationResolutionEvidence {
    /// Neutral resolution references relevant to the publication attempt.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// Optional formal downstream feedback reference.
    pub feedback_ref: Option<DownstreamFeedbackRef>,
    /// Idempotency key of the original attempt.
    pub idempotency_key: IdempotencyKey,
}

/// Records the evidence used to evaluate an unknown observation side effect.
pub struct ObservationResolutionEvidence {
    /// Neutral resolution references relevant to the observation attempt.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// Optional formal observation feedback reference.
    pub feedback_ref: Option<ObservationFeedbackRef>,
    /// Idempotency key of the original attempt.
    pub idempotency_key: IdempotencyKey,
}

/// Records a source change that may require a new immutable snapshot.
pub struct SourceChangeEvidence {
    /// Owner-supplied source version when one exists.
    pub source_version: Option<SourceVersion>,
    /// Safe reason for treating the source as changed.
    pub reason_category: SafeReasonCategory,
}

/// Classifies the local projection-state subject.
pub enum MemberProjectionStatus {
    /// The projection covers its declared source watermark.
    Current,
    /// The projection is behind a known source watermark.
    Stale,
    /// A replacement revision is being built from committed sources.
    Rebuilding,
    /// Only a constrained body-free surface can be served.
    Degraded,
    /// The latest rebuild attempt failed.
    Failed,
    /// The optional projection is explicitly disabled.
    Disabled,
    /// Coverage or integrity cannot be proven.
    Unknown,
}

/// Classifies a neutral external-context resolution.
pub enum ExternalContextResolutionStatus {
    /// The source is sufficient for the declared consumer purpose and scope.
    Resolved,
    /// The available snapshot is known to lag the source.
    Stale,
    /// Source owner, version, scope, or evidence conflicts.
    Conflict,
    /// No sufficient formal mapping or source is known.
    Unresolved,
    /// The formal owner seam is temporarily unavailable.
    Unavailable,
    /// Freshness or integrity cannot be proven.
    Unknown,
}

/// Classifies why an external-context resolution gap exists.
pub enum ExternalContextGapCategory {
    /// No source reference was supplied.
    SourceMissing,
    /// The exact owner contract is not closed.
    ContractPending,
    /// The last known source is stale.
    Stale,
    /// Competing source evidence conflicts.
    Conflict,
    /// The formal owner cannot currently be reached.
    OwnerUnavailable,
    /// The member cannot map the source to a supported consumer purpose.
    MappingUnknown,
}

/// Classifies the lifecycle of an external-context gap.
pub enum ExternalContextGapStatus {
    /// No refresh or resolution request is active.
    Open,
    /// The owner contract prevents a safe positive resolution.
    Blocked,
    /// A refresh or resolution request is outstanding.
    ResolutionPending,
    /// A new neutral resolution is linked to the gap.
    Resolved,
    /// The resolution side effect or impact is unknown.
    Unknown,
    /// A successor gap carries the current handling.
    Superseded,
}

/// Declares whether an optional capability outlet is enabled.
pub enum CapabilityOutletActivation {
    /// The outlet may be projected when source proof is sufficient.
    Enabled,
    /// The outlet is intentionally disabled without changing source truth.
    Disabled,
}

/// Names a low-cardinality diagnostic category.
pub struct MemberDiagnosticCategory(pub SafeStatusCategory);

/// Body-free inspection alias used by projection policies.
pub type ProjectionBodyInspection = ForbiddenBodyInspection;

// Domain-only policy configuration values. They carry no source truth and are
// intentionally opaque until the owning policy is evaluated.
pub struct InspectionMaterialDescriptor;
pub struct CorrelationState;
pub struct RuntimeEntryMappingRequirement;
pub struct RuntimeMaterialSourceRequirement;
pub struct RuntimeMediationOrderingRule;
pub struct CommittedSourceRequirement;
pub struct FormalTargetRequirement;
pub struct InteractionPurposeRequirement;
pub struct ReferenceMinimizationRule;
pub struct CommittedMemberFactRequirement;
pub struct ObservationCardinalityRule;
pub struct TraceCorrelationRule;
pub struct FormalOwnerRequirement;
pub struct ExternalScopeRule;
pub struct ExternalFreshnessRule;
pub struct SourceConflictRule;
pub struct ConsumerPurposeIsolationRule;
pub struct CommittedProjectionSourceRequirement;
pub struct ProjectionVisibilityRule;
pub struct ProjectionFreshnessRule;
pub struct ProjectionRebuildRule;
pub struct ProjectionNoWriteRule;
pub struct CapabilityOutletRule;
pub struct ScreeningSourceRequirement;
pub struct ForbiddenBodyBoundary;

## 12. `domain` CP01：Host Collaboration material、attempt 与 admission policy

### 12.1 `HostCollaborationMaterial`

##### `HostCollaborationMaterial`

```rust
/// Stores an immutable, body-free material revision prepared from one local presence.
pub struct HostCollaborationMaterial {
    /// Local identity of this immutable material record.
    pub material_id: HostCollaborationMaterialId,
    /// Presence revision from which the material was prepared.
    pub presence_ref: MemberPresenceId,
    /// Semantic host-collaboration material kind.
    pub kind: HostCollaborationKind,
    /// Project-scoped subject bound to the source presence.
    pub subject_ref: ProjectMemberRef,
    /// Fixed interaction purpose for this material.
    pub purpose: InteractionPurpose,
    /// Source local presence revision.
    pub presence_revision: PresenceRevision,
    /// Body-free local presence posture summary.
    pub safe_status_category: SafeStatusCategory,
    /// Correlation carried into the later host attempt.
    pub correlation: MemberCorrelation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `material_id` | `HostCollaborationMaterialId` | immutable material identity。 | application 在提交前经 ID Port 生成；不得从 presence、host route 或 timestamp 拼接。 |
| `presence_ref` / `subject_ref` / `presence_revision` | typed local ID / external ref / local revision | 锁定该材料的本地来源。 | 只可从已加载且与当前 subject 匹配的 `MemberPresence` 复制；不得由 host session 或 process signal 推导。 |
| `kind` | `HostCollaborationKind` | 区分 registration、liveness 与 status material。 | named CP01 use case 显式给出；不是 IPC method、route 或 command name。 |
| `purpose` | `InteractionPurpose` | 将材料限定为 host cooperation。 | 必须是 `HostCollaboration`；其他 purpose 的材料由 CP03～05 owner 建立。 |
| `safe_status_category` | `SafeStatusCategory` | 表达可交接的低敏状态。 | 从 presence 状态和 policy-derived category 派生；不含 credential、session、正文或 host health。 |
| `correlation` | `MemberCorrelation` | 使 material 与 later attempt / trace 可回链。 | 来自已验证 command metadata 或 presence use-case context；不得由 material digest 临时生成。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_body_free(&self) -> bool` | 校验 material 的稳定安全边界。 | 无。 | `bool`。 | 纯函数；任何 false 都禁止写出或 handoff。 |
| `pub fn matches_presence(&self, presence: &MemberPresence) -> bool` | 检查 source presence、subject 与 revision 一致。 | `presence` 是 loaded local truth。 | `bool`。 | 纯函数；不读取 host state。 |
| `pub fn supports_kind(&self, kind: &HostCollaborationKind) -> bool` | 判断 material 是否为请求的 local purpose 准备。 | 命名 kind。 | `bool`。 | 不把 kind 转换为 external transport selection。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepare(material_id: HostCollaborationMaterialId, presence: &MemberPresence, kind: HostCollaborationKind, purpose: InteractionPurpose, safe_status_category: SafeStatusCategory, correlation: MemberCorrelation) -> Result<Self, DomainError>` | 从 committed local presence 构造 immutable host material。 | ID 来自 application；presence 已由 Store 加载；category / correlation 来自 named use case。 | `HostCollaborationMaterial` 或 domain error。 | `PrepareHostCollaboration` 在建立 attempt 前。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| immutable source snapshot | material 建成后不得改写；presence 后续迁移需生成新的 material。 |
| no host result | material 不是 host registration、session、health 或 lifecycle 的事实，也不能声明 host 已受理。 |
| no credential or body | credential、launch token、IPC payload、raw status text、secret 与 host session body 不进入字段。 |

### 12.2 `HostCollaborationAttempt`

##### `HostCollaborationAttempt`

```rust
/// Records the local posture of one append-only host collaboration seam attempt.
pub struct HostCollaborationAttempt {
    /// Local identity of this attempt record.
    pub attempt_id: HostCollaborationAttemptId,
    /// Immutable material selected for the attempt.
    pub material_ref: HostCollaborationMaterialId,
    /// Formal host boundary selected by a neutral resolution.
    pub host_boundary_ref: HostBoundaryRef,
    /// Local seam invocation posture.
    pub status: HostCollaborationAttemptStatus,
    /// Idempotency key bound to this specific side-effect candidate.
    pub idempotency_key: IdempotencyKey,
    /// Formal or local reference created by a successful seam invocation.
    pub submission_ref: Option<HostSubmissionRef>,
    /// Formal host feedback reference linked after source validation.
    pub feedback_ref: Option<HostFeedbackRef>,
    /// Local invocation time when a seam call was made.
    pub attempted_at: Option<Timestamp>,
    /// Redacted reason for blocked or unknown posture.
    pub reason_category: Option<SafeReasonCategory>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `attempt_id` | `HostCollaborationAttemptId` | local attempt identity。 | application ID Port；每个新 attempt 生成新 ID。 |
| `material_ref` | `HostCollaborationMaterialId` | 回链 immutable material。 | 仅指向已 committed、body-free CP01 material；不能改指另一 presence。 |
| `host_boundary_ref` | `HostBoundaryRef` | 标识 formal seam。 | 仅由 CP06 host-route resolution / explicit command 输入提供；`L2M-UP-001` 未闭口时不能伪造。 |
| `status` | `HostCollaborationAttemptStatus` | 表示 local attempt posture。 | factory 为 `Prepared`；transition 产生 successor，不改变 host truth。 |
| `idempotency_key` | `IdempotencyKey` | unknown-side-effect 与 duplicate 分类锚。 | 来自 command / continuation metadata；不得由 `attempt_id`、trace ID 或 timestamp 替代。 |
| `submission_ref` / `feedback_ref` | `Option<...>` | 记录已调用 seam / 已关联 owner feedback。 | `Submitted` 必有 `submission_ref`；`FeedbackLinked` 必有两者中需要的 submission history与 `feedback_ref`；均不复制 body。 |
| `attempted_at` | `Option<Timestamp>` | 记录本地调用时点。 | 只由 Clock Port 在实际 invocation result 后提供；`Prepared` / `Blocked` 可为 `None`。 |
| `reason_category` | `Option<SafeReasonCategory>` | 解释保守状态。 | `Blocked` / `Unknown` 必为 `Some`；不得存 adapter exception 或 host response body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_submitted(&self, submission_ref: HostSubmissionRef, attempted_at: Timestamp) -> Result<Self, DomainError>` | 形成已调用 host seam 的 successor。 | typed submission ref、application Clock 值。 | successor attempt。 | 只允许 `Prepared -> Submitted`；不表示 host accepted。 |
| `pub fn link_feedback(&self, feedback_ref: HostFeedbackRef) -> Result<Self, DomainError>` | 追加 formal feedback link。 | 经 owner-specific Consumer 校验的 ref。 | successor attempt。 | 只允许 `Submitted -> FeedbackLinked`；不迁移 presence。 |
| `pub fn mark_blocked(&self, reason: SafeReasonCategory) -> Result<Self, DomainError>` | 记录调用前预置或 seam 缺口。 | safe reason。 | successor attempt。 | 只允许 `Prepared -> Blocked`；不得调用 host seam。 |
| `pub fn mark_unknown(&self, reason: UnknownReason) -> Result<Self, DomainError>` | 建立 side-effect fence。 | redacted unknown reason。 | successor attempt。 | 只允许 `Prepared / Submitted -> Unknown`；禁止自动 retry。 |
| `pub fn is_retry_safe(&self, evidence: &HostResolutionEvidence) -> bool` | 判断是否可由 application 评估新 attempt。 | formal evidence for this exact key。 | `bool`。 | 纯判断；`true` 不是 retry authorization。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepare(attempt_id: HostCollaborationAttemptId, material: &HostCollaborationMaterial, host_boundary_ref: HostBoundaryRef, idempotency_key: IdempotencyKey) -> Result<Self, DomainError>` | 建立 prepared local attempt。 | all fields from application / committed material / formal boundary resolution。 | prepared attempt or domain error。 | `PrepareHostCollaboration` local-first write phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| local attempt only | `Submitted` 仅证明 member 调用了 formal seam；不等于 host accepted、registered、session established 或 healthy。 |
| append / successor only | 新 attempt 绝不覆盖旧 attempt；status 变化是 successor record，physical durable revision 由 Step 11 闭合。 |
| unknown fence | `Unknown` 必须先由同 key 的 formal resolution / feedback 参与评估；时间流逝、scheduler 或 fake success 不得解封。 |

### 12.3 `PresenceAdmissionPolicy`

##### `PresenceAdmissionPolicy`

```rust
/// Guards project-scoped startup admission without owning credential or host truth.
pub struct PresenceAdmissionPolicy {
    /// Only supported forward execution subject kind.
    pub supported_subject_kind: ExecutionSubjectKind,
    /// Source roles required before an admission may be accepted.
    pub required_resolution_kinds: Vec<SourceResolutionKind>,
    /// Required conservative handling for missing or unverifiable sources.
    pub unknown_handling: UnknownHandlingMode,
    /// Required project-to-global identity association rule.
    pub association_rule: SubjectAnchorAssociationRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `supported_subject_kind` | `ExecutionSubjectKind` | 固定唯一正向 subject shape。 | factory 固定 `ProjectMember`；`Unknown` 只用于 reject / blocked path，绝非第三执行主语。 |
| `required_resolution_kinds` | `Vec<SourceResolutionKind>` | 声明 admission 必要 source roles。 | factory 固定至少 `SubjectIdentity`、`StartupCredential`；ordered unique，不接受 caller override。 |
| `unknown_handling` | `UnknownHandlingMode` | 处理 missing、stale、conflict 或 unknown source。 | factory 固定 `FailClosed`；未证明 credential / source 不得 accepted。 |
| `association_rule` | `SubjectAnchorAssociationRule` | 固定双锚匹配。 | architecture invariant；不得由 host / Runtime status 绕过。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate(&self, subject_ref: &ProjectMemberRef, identity_anchor_ref: &GlobalMemberRef, startup_context_ref: &StartupContextRef, credential_ref: Option<&CredentialRef>, resolutions: &SourceResolutionSet) -> StartupAdmissionDisposition` | 得出 local admission disposition。 | typed refs and body-free resolution set。 | `StartupAdmissionDisposition`。 | 纯函数；不验证 credential body，不调用 host。 |
| `pub fn rejects_non_project(&self, subject_ref: &ExecutionSubjectRef) -> bool` | 拒绝不支持的 subject。 | candidate subject。 | `bool`。 | `Global` / `Unknown` 必须返回 true。 |
| `pub fn requires_fail_closed(&self, resolutions: &SourceResolutionSet) -> bool` | 检查必要 source role 覆盖。 | resolved IDs / kinds。 | `bool`。 | missing、stale/conflict/unverified 在 application 建 resolution set 时不得被隐藏。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn project_scoped() -> Self` | 建立当前不可配置化的 admission guard。 | 无。 | fixed policy。 | runtime assembly / application service construction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no credential owner transfer | policy 只消费 credential verification ref / resolution，不签发、撤销、缓存或读取 credential material。 |
| no lifecycle transfer | policy 不读取 host health、host session、container lifecycle 或 Runtime state。 |
| fail closed | `L2M-UP-006` 与 `L2M-UP-008` 未闭合时只能输出 `Blocked` / `Rejected`，不得配置化放开。 |

### 12.4 CP01 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| CP01 五对象均有 capability、字段、factory 和成员函数 | pass_for_current_step | `StartupAdmission`、`MemberPresence` 位于 §10；material、attempt、policy 位于本节。 |
| local presence / host seam / host truth 已分层 | pass | material / attempt 只承载 body-free local record和refs；host acceptance、registry、session、health仍外置。 |
| unknown-side-effect fence 可由 Step 7 承接 | pass_with_upstream_blocker | `HostResolutionEvidence`、original idempotency key与typed feedback ref已固定；exact host carrier仍受 `L2M-UP-001` 限制。 |
| 工厂输入可闭合 | pass | generated ID、loaded presence、safe category、typed resolution / metadata均有来源；Port读取面留Step 7。 |
| 下一步承接 | ready_for_CP02 | Step 7须定义 presence / host stores、host collaboration / source ports；Step 8须定义 Command / Consumer DTO。 |

## 13. `domain` CP02：Inbound Boundary

### 13.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立或替换项目型 member 的入站范围 | accepted `MemberPresence`、formal source resolution、body-free proposed scope | `SubscriptionScopeDecision` successor | active / rejected / blocked / superseded；append-only | `SubscriptionScopeDecision`、`SubscriptionScopePolicy` | Step 7 scope Store / source resolver；Step 8 scope Commands |
| 接收入站事实语境并丢弃正文 | trusted envelope、active scope、瞬时检查 marker | `InboundFactRecord` | accepted / duplicate / unsupported / blocked | `InboundFactRecord` | Step 7 intake / dedup Port；Step 8 Consumer |
| 形成 member-side 预筛结论 | accepted intake、scope、formal rule resolution、inspection summary | `ScreeningDecision` | passed / degraded / blocked / pending | `ScreeningDecision`、`InboundScreeningPolicy` | Step 7 rule-resolution Port；Step 8 Consumer / Query |

### 13.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `SubscriptionScopeDecision` | 记录某个 presence revision 的当前入站范围 | decision record | subject / presence / source revision 一致性；显式 scope successor | 不建立 Bus subscription、Governance authorization 或 source allowlist |
| `InboundFactRecord` | 保存一条 body-free 入站承接事实 | immutable intake record | source / scope / dedup / inspection marker 关联 | 不保存 raw event、prompt、secret 或 source business body |
| `ScreeningDecision` | 对 accepted intake 作 member 预筛 | decision record | 规则 resolution、scope、correlation 一致性；四态 fail-closed | 不执行 LLM 推理、Governance approval 或 Runtime admission |
| `SubscriptionScopePolicy` | 守护范围提议与 project subject | policy / guard | required role、revision、unknown fence | 不读取私有 allowlist 或修改既有 decision |
| `InboundScreeningPolicy` | 守护正文、规则来源和降级路径 | policy / guard | accepted-only、formal rule、显式 degraded | 不以 unknown 默认 passed，不持有 rule body |

### 13.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `SubscriptionScopeDecision` | 建立、匹配、替换范围 | id、presence、subject、scope、source refs、status、reason、revision | `decide(...)` | `covers`、`can_screen`、`is_current` | `SubscriptionScopeStatus` | loaded presence、formal resolution、application ID / revision |
| `InboundFactRecord` | 记录承接、判断可筛选 | id、source refs、scope ref、disposition、inspection marker、correlation、received_at | `record(...)` | `can_screen`、`matches_scope`、`is_body_free` | `InboundIntakeDisposition` | trusted consumer envelope、active scope、authorized inspection、clock / ID |
| `ScreeningDecision` | 形成和解释预筛 | id、inbound ref、scope ref、rule resolution、disposition、reason、source refs、correlation | `decide(...)` | `permits_runtime_delivery`、`is_fail_closed`、`matches_fact` | `ScreeningDisposition` | accepted fact、formal rule resolution、inspection summary、policy |
| `SubscriptionScopePolicy` | 评估范围与扩权 | subject rule、required source roles、change mode、unknown mode | `project_scoped()` | `evaluate`、`prevents_scope_expansion` | 无独立状态 | architecture invariant / source-role contract |
| `InboundScreeningPolicy` | 评估四态及 body gate | allowed states、source requirement、body boundary、unknown mode | `fail_closed()` | `evaluate`、`rejects_persistence`、`permits_degraded` | 无独立状态 | architecture invariant / formal rule source |

### 13.4 `SubscriptionScopeDecision`

##### `SubscriptionScopeDecision`

```rust
/// Records one append-only intake-scope decision for an admitted project member.
pub struct SubscriptionScopeDecision {
    /// Local identity of this scope decision.
    pub scope_decision_id: SubscriptionScopeDecisionId,
    /// Presence revision to which this decision is bound.
    pub presence_ref: MemberPresenceId,
    /// Project-scoped subject allowed to use the scope.
    pub subject_ref: ProjectMemberRef,
    /// Body-free scope accepted or rejected by the policy.
    pub scope: MemberSubscriptionScope,
    /// Minimal formal source references used for the decision.
    pub source_refs: Vec<TypedRef>,
    /// Local lifecycle of this scope decision.
    pub status: SubscriptionScopeStatus,
    /// Redacted explanation of the decision.
    pub reason_category: SafeReasonCategory,
    /// Explicit local scope revision.
    pub revision: SubscriptionScopeRevision,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope_decision_id` | `SubscriptionScopeDecisionId` | 唯一 local decision identity。 | application ID Port 生成；load 原样重建，不由 subject / route 拼接。 |
| `presence_ref` | `MemberPresenceId` | 将范围绑定到一个在场链。 | 只能引用已加载的 non-terminal presence；不表示 host session。 |
| `subject_ref` | `ProjectMemberRef` | 固定范围使用主语。 | 必须与 presence 双锚一致；不得用 GlobalMember 或 display name。 |
| `scope` | `MemberSubscriptionScope` | body-free 的范围形状。 | 仅由 formal source resolution 派生；不得含 topic、filter expression 或正文。 |
| `source_refs` | `Vec<TypedRef>` | 回链 identity / policy / role 来源。 | ordered-unique、owner-bound、最小集合；不得复制来源 body。 |
| `status` | `SubscriptionScopeStatus` | active / superseded / rejected / blocked。 | 只能由 `SubscriptionScopePolicy` 和 successor flow 形成。 |
| `reason_category` | `SafeReasonCategory` | 低敏解释。 | 非空；不得写自由文本、规则正文或凭据错误。 |
| `revision` | `SubscriptionScopeRevision` | 显式范围版本。 | 新 active 必须高于当前 revision；不是 source version 或 DB row version。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn covers(&self, fact_descriptor: &InboundFactDescriptor) -> bool` | 以 body-free descriptor 判断范围覆盖。 | descriptor 必须来自可信 boundary；不接 raw body。 | `bool`。 | 纯函数；`true` 仅表示可进入 screening，不表示 passed。 |
| `pub fn can_screen(&self) -> bool` | 判断该 scope 是否可作为当前筛选依据。 | 无。 | `bool`。 | 仅 `Active` 且 source basis 未失效时为真。 |
| `pub fn is_current(&self, current_revision: SubscriptionScopeRevision) -> bool` | 判断 revision 是否为调用方声明的 current。 | application 读取的 current revision。 | `bool`。 | 不写入、不自动 supersede。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn decide(scope_decision_id: SubscriptionScopeDecisionId, presence: &MemberPresence, proposed_scope: MemberSubscriptionScope, source_resolution: &ExternalContextResolution, revision: SubscriptionScopeRevision, policy: &SubscriptionScopePolicy, reason_category: SafeReasonCategory) -> Result<Self, DomainError>` | 从 presence 与 formal resolution 形成新 scope decision。 | ID / revision 由 application 提供；resolution 必须声明 `Screening` purpose。 | `SubscriptionScopeDecision` 或 `DomainError`。 | `EstablishSubscriptionScope` / `ReplaceSubscriptionScope`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| presence-bound | decision 的 subject、presence 与 scope boundary 必须一致；不能跨 presence 复用。 |
| append-only | 范围变化产生新 decision；旧 active 只能由 successor flow 标记 `Superseded`。 |
| no external authorization | active 只表示 member intake boundary，不表示 Bus subscription 或 Governance authorization。 |

### 13.5 `InboundFactRecord`

##### `InboundFactRecord`

```rust
/// Stores one immutable, body-free inbound fact context accepted by the member boundary.
pub struct InboundFactRecord {
    /// Local identity of this inbound record.
    pub inbound_fact_id: InboundFactRecordId,
    /// Opaque source-event identity supplied by the trusted boundary.
    pub source_event_ref: SourceEventRef,
    /// Formal authority expected to interpret the source reference.
    pub source_authority_ref: SourceAuthorityRef,
    /// Scope decision used for the local intake match.
    pub scope_decision_ref: SubscriptionScopeDecisionId,
    /// Local intake classification.
    pub intake_disposition: InboundIntakeDisposition,
    /// Redacted marker left after the authorized transient inspection.
    pub inspection_marker: TransientInspectionMarker,
    /// Correlation propagated from the validated envelope.
    pub correlation: MemberCorrelation,
    /// Member-local receipt time.
    pub received_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `inbound_fact_id` | `InboundFactRecordId` | local intake identity。 | application ID Port 生成；duplicate 不复用为新主线。 |
| `source_event_ref` | `SourceEventRef` | 指向 source / Bus fact 的 opaque ref。 | 由可信 envelope 映射；不保存 payload 或 route。 |
| `source_authority_ref` | `SourceAuthorityRef` | 标识解释 source 的 owner。 | owner-kind 必须可验证；不能由 sender string 猜出。 |
| `scope_decision_ref` | `SubscriptionScopeDecisionId` | 回链匹配依据。 | 只能引用 active 或当时有效的 decision；不携带 scope body。 |
| `intake_disposition` | `InboundIntakeDisposition` | 本地 intake 分类。 | trusted consumer gate 产生；不等于 Bus delivery receipt。 |
| `inspection_marker` | `TransientInspectionMarker` | 记录已进行安全瞬时检查。 | 只含 safe result / category；不得含正文、secret 或 hidden material。 |
| `correlation` | `MemberCorrelation` | 关联 source、screening 与后续 Runtime。 | 来自 validated metadata；不能由 digest / timestamp 临时生成。 |
| `received_at` | `Timestamp` | 本地承接时点。 | 由 Clock Port 提供；不表示 source event time 或 delivery time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_screen(&self) -> bool` | 判断是否可创建 screening decision。 | 无。 | `bool`。 | 仅 `Accepted` 为真。 |
| `pub fn matches_scope(&self, scope_decision: &SubscriptionScopeDecision) -> bool` | 检查 scope ref、subject 与 source 语境一致。 | 已加载 local scope。 | `bool`。 | 纯函数；不重新评估规则。 |
| `pub fn is_body_free(&self) -> bool` | 验证本记录只含允许 carrier。 | 无。 | `bool`。 | 必须恒为真；否则拒绝持久化并进入安全错误 surface。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn record(inbound_fact_id: InboundFactRecordId, source_event_ref: SourceEventRef, source_authority_ref: SourceAuthorityRef, scope_decision: &SubscriptionScopeDecision, intake_disposition: InboundIntakeDisposition, inspection_marker: TransientInspectionMarker, correlation: MemberCorrelation, received_at: Timestamp) -> Result<Self, DomainError>` | 将 trusted envelope 的安全摘要记录为 local fact。 | scope 必须匹配 subject；inspection marker 不携带正文。 | `InboundFactRecord` 或 `DomainError`。 | `InboundFactConsumer` local-first intake phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no-body persistence | raw event body 只在授权 inspection window 存在，离开 boundary 后必须丢弃。 |
| accepted-only screening | duplicate / unsupported / blocked 不得创建新的 screening 主线。 |
| local intake semantics | accepted 仅表示 member 已承接可识别语境，不表示 source business fact valid 或 Runtime accepted。 |

### 13.6 `ScreeningDecision`

##### `ScreeningDecision`

```rust
/// Records a source-anchored member pre-screening decision for one accepted inbound fact.
pub struct ScreeningDecision {
    /// Local identity of this screening decision.
    pub screening_decision_id: ScreeningDecisionId,
    /// Accepted inbound fact evaluated by this decision.
    pub inbound_fact_ref: InboundFactRecordId,
    /// Scope revision used as the intake basis.
    pub scope_decision_ref: SubscriptionScopeDecisionId,
    /// Neutral rule-source resolution used by the policy.
    pub rule_resolution_ref: ExternalContextResolutionId,
    /// Local pre-screening disposition.
    pub disposition: ScreeningDisposition,
    /// Redacted explanation of the disposition.
    pub reason_category: SafeReasonCategory,
    /// Minimal formal and local evidence references.
    pub source_refs: Vec<TypedRef>,
    /// Correlation propagated to Runtime mediation.
    pub correlation: MemberCorrelation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `screening_decision_id` | `ScreeningDecisionId` | local pre-screen identity。 | application ID Port；每次新 basis 生成新 ID。 |
| `inbound_fact_ref` | `InboundFactRecordId` | 被评估的 accepted intake。 | 必须引用 `can_screen()` 为真的 record；不引用 raw event。 |
| `scope_decision_ref` | `SubscriptionScopeDecisionId` | 记录当前范围依据。 | 必须与 inbound record 一致；superseded scope 不得作为新 basis。 |
| `rule_resolution_ref` | `ExternalContextResolutionId` | 关联 CP06 neutral rule resolution。 | resolution purpose 必须为 `Screening`；不复制规则 body。 |
| `disposition` | `ScreeningDisposition` | passed / degraded / blocked / pending。 | 只能由 `InboundScreeningPolicy` 产生；不得由 Runtime result 回写。 |
| `reason_category` | `SafeReasonCategory` | 低敏结论解释。 | 非空；不得携带规则文本、prompt 或 provider response。 |
| `source_refs` | `Vec<TypedRef>` | 支持审计回链的最小 refs。 | ordered-unique、owner-bound；不能把 resolution status 当 approval。 |
| `correlation` | `MemberCorrelation` | 连接 intake 与 Runtime delivery。 | 必须与 inbound correlation 一致；不可新造。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn permits_runtime_delivery(&self) -> bool` | 判断是否可进入 CP03 delivery evaluation。 | 无。 | `bool`。 | `Passed` 为真；`Degraded` 只有 policy 明确收窄时才由 application 另行确认。 |
| `pub fn is_fail_closed(&self) -> bool` | 判断是否必须停止正向路径。 | 无。 | `bool`。 | `Blocked` / `Pending` 为真；不把等待当成功。 |
| `pub fn matches_fact(&self, inbound_fact: &InboundFactRecord) -> bool` | 检查 fact、scope 与 correlation 一致。 | loaded local intake。 | `bool`。 | 纯函数；不重放 inspection。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn decide(screening_decision_id: ScreeningDecisionId, inbound_fact: &InboundFactRecord, scope_decision: &SubscriptionScopeDecision, rule_resolution: &ExternalContextResolution, inspection_summary: ScreeningInputSummary, source_refs: Vec<TypedRef>, policy: &InboundScreeningPolicy, reason_category: SafeReasonCategory) -> Result<Self, DomainError>` | 从 accepted intake、scope、formal rule 与 body-free summary 形成预筛决定。 | 所有 source 必须由 application 已加载并校验；policy 不读取 I/O。 | `ScreeningDecision` 或 `DomainError`。 | `InboundFactConsumer` screening phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| member-side only | 该决定只是 member 预筛，不是 Governance policy / approval 或 Runtime admission。 |
| degraded explicitness | `Degraded` 必须有正式收窄依据和 safe reason；Query / projection 不得把它升级为 `Passed`。 |
| no-body / no-inference | 不保存规则正文、事件正文、LLM 推理、tool result 或 provider text。 |

### 13.7 `SubscriptionScopePolicy`

##### `SubscriptionScopePolicy`

```rust
/// Guards project-scoped subscription decisions and explicit revision changes.
pub struct SubscriptionScopePolicy {
    /// Project-only subject boundary.
    pub subject_scope_rule: ProjectSubjectScopeRule,
    /// Ordered unique source roles required for a positive scope decision.
    pub required_source_kinds: Vec<SourceResolutionKind>,
    /// Explicit revision mode for scope changes.
    pub scope_change_mode: ScopeChangeMode,
    /// Conservative handling for missing or unverifiable source evidence.
    pub unknown_handling: UnknownHandlingMode,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `subject_scope_rule` | `ProjectSubjectScopeRule` | 固定 project-only 边界。 | factory 固定；不得由 command 配置改写。 |
| `required_source_kinds` | `Vec<SourceResolutionKind>` | 声明 scope 所需 source roles。 | ordered-unique；至少覆盖 subject / identity 与 screening rule 语境。 |
| `scope_change_mode` | `ScopeChangeMode` | 强制新 revision。 | factory 固定 `ExplicitRevision`；无原地修改。 |
| `unknown_handling` | `UnknownHandlingMode` | 缺 source 时 fail closed。 | factory 固定 `FailClosed`；不能配置为默认 active。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate(&self, presence: &MemberPresence, proposed_scope: &MemberSubscriptionScope, source_resolution: &ExternalContextResolution) -> SubscriptionScopeStatus` | 判断新 scope 的 local disposition。 | source resolution 必须匹配 subject / purpose。 | `SubscriptionScopeStatus`。 | 纯函数；不写 Store。 |
| `pub fn prevents_scope_expansion(&self, current_scope: &SubscriptionScopeDecision, proposed_scope: &MemberSubscriptionScope) -> bool` | 检查无新正式 basis 的扩权。 | current / proposed 均为 body-free。 | `bool`。 | `true` 时只能 rejected / blocked；不得静默继承。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn project_scoped() -> Self` | 创建不可绕过的 project-only / fail-closed guard。 | 无。 | 固定 policy。 | application service / runtime assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no private allowlist | policy 不保存、读取或拼接本地 allowlist；范围必须由 formal source 派生。 |
| no stale promotion | stale / conflict / unknown resolution 不能直接形成 active。 |
| no external owner transfer | scope 不拥有 Bus、Governance、Identity 或 source truth。 |

### 13.8 `InboundScreeningPolicy`

##### `InboundScreeningPolicy`

```rust
/// Guards body-free member screening and its explicitly narrowed degraded path.
pub struct InboundScreeningPolicy {
    /// Ordered unique dispositions this policy may produce.
    pub allowed_dispositions: Vec<ScreeningDisposition>,
    /// Formal rule-source and freshness requirement.
    pub source_requirement: ScreeningSourceRequirement,
    /// Boundary that rejects persisted or forwarded forbidden material.
    pub body_boundary: ForbiddenBodyBoundary,
    /// Conservative handling for unknown, stale, or conflicting evidence.
    pub unknown_handling: UnknownHandlingMode,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `allowed_dispositions` | `Vec<ScreeningDisposition>` | 固定四态输出集合。 | factory 固定 `Passed / Degraded / Blocked / Pending`，ordered-unique。 |
| `source_requirement` | `ScreeningSourceRequirement` | 约束 rule resolution 的 purpose / freshness。 | domain-local marker；不携带 rule body。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 保护 transient inspection 结束后的数据边界。 | factory 固定拒绝 raw / secret / hidden material。 |
| `unknown_handling` | `UnknownHandlingMode` | unknown / conflict 的 fail-closed 规则。 | factory 固定 `FailClosed` 或明确收窄 degraded。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate(&self, inbound_fact: &InboundFactRecord, scope_decision: &SubscriptionScopeDecision, rule_resolution: &ExternalContextResolution, inspection_summary: &ScreeningInputSummary) -> ScreeningDisposition` | 形成四态筛选结果。 | 所有输入必须 body-free；rule resolution 为 neutral。 | `ScreeningDisposition`。 | 纯函数；不执行 LLM / I/O。 |
| `pub fn rejects_persistence(&self, material_descriptor: &InspectionMaterialDescriptor) -> bool` | 判断 inspection material 是否不能离开 boundary。 | descriptor 只描述安全类别。 | `bool`。 | `true` 时不得写入 record、event 或 trace。 |
| `pub fn permits_degraded(&self, inspection_summary: &ScreeningInputSummary, rule_resolution: &ExternalContextResolution) -> bool` | 判断是否存在正式收窄 degraded 依据。 | 不接受 caller 自造 allowlist。 | `bool`。 | `true` 不等于 passed 或 Runtime authorization。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn fail_closed() -> Self` | 创建不含本地 allowlist 的安全 policy。 | 无。 | 固定 policy。 | application service 构造。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no default pass | source resolution 缺失、stale、conflict 或 unknown 时只能 pending / blocked，除非正式规则明确 degraded。 |
| no rule-body ownership | policy 只消费 resolution / summary，不保存规则正文或解释文本。 |
| no Runtime / Governance decision | screening 不创建 Runtime run、Governance approval 或 external acceptance。 |

### 13.9 CP02 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP02 五对象均有 capability、字段、factory 和成员函数 | pass_for_current_step | scope、intake、screening 与两类 policy 均独立成卡。 |
| subject / scope / rule source 边界 | pass_with_upstream_blockers | project subject 与 neutral resolution 已固定；rule taxonomy / event route 继续受 `L2M-UP-005/007` 阻塞。 |
| body 生命周期 | pass | raw body 仅 transient；持久对象只含 marker、refs、safe categories。 |
| status 分离 | pass | active / accepted / passed / degraded 各自绑定对象，不表示 Bus / Governance / Runtime 成功。 |
| Step 7 / 8 承接 | ready_for_CP03 | Step 7 定义 scope / intake / rule ports；Step 8 定义 scope Commands、inbound Consumer 与 Query。 |

## 14. `domain` CP03：Runtime Mediation

### 14.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 将 member screening 映射为 Runtime 提交资格 | accepted screening、inbound ref、Runtime boundary resolution | `RuntimeDeliveryDecision` | eligible / rejected / blocked / pending | `RuntimeDeliveryDecision`、`RuntimeMediationPolicy` | Step 7 Runtime entry Port；Step 8 delivery Command |
| 记录对 Runtime entry 的本地调用尝试 | eligible decision、idempotency key、formal boundary ref | `RuntimeSubmissionAttempt` successor | prepared / submitted / result-linked / blocked / unknown | `RuntimeSubmissionAttempt` | Step 7 handoff / result Port；Step 8 result Command / Consumer |
| 关联 Runtime owner 的结果与安全材料 | formal result / safe handoff ref、source proof、correlation | `RuntimeResultLink`、`RuntimeMaterialReception` | result classification / reception disposition | 四个 local / support object | Step 7 source Consumer；Step 8 material Consumer / Query |

### 14.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `RuntimeDeliveryDecision` | screening → Runtime entry 的 member-side 判断 | decision record | mapping / subject / source gate | 不创建 Runtime trigger、run、context、plan 或 outcome |
| `RuntimeSubmissionAttempt` | 记录本地 seam invocation | append-only attempt | idempotency、unknown fence、结果 link | 不把 submitted 当 accepted 或 run created |
| `RuntimeResultLink` | 连接 Runtime formal result | immutable external link | safe classification、late / duplicate link | 不复制 Runtime result body 或改变 member decision |
| `RuntimeMaterialReception` | 承接 Runtime committed safe material | reception record | committed / source / body gate | 不拥有 Runtime outcome、handoff material 或 tool result |
| `RuntimeMediationPolicy` | 保护两条 Runtime seam | policy / guard | mapping、source family、body、ordering、unknown | 不定义上游 exact schema 或 route |

### 14.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `RuntimeDeliveryDecision` | 评估是否可提交 | id、screening / intake refs、subject、boundary、optional contract、disposition、correlation | `decide(...)` | `permits_submission`、`matches_screening`、`is_fail_closed` | `RuntimeDeliveryDisposition` | CP02 committed refs、CP06 resolution、ID |
| `RuntimeSubmissionAttempt` | prepared / submitted / linked / fenced | id、decision ref、boundary、status、key、submission / result refs、time | `prepare(...)` | `mark_submitted`、`link_result`、`mark_unknown`、`is_retry_safe` | `RuntimeSubmissionAttemptStatus` | local decision、handoff result、clock / idempotency |
| `RuntimeResultLink` | 关联 owner result | id、attempt、result ref、classification、source、correlation、linked_at | `link(...)` | `matches_attempt`、`runtime_accepted`、`is_late` | immutable | formal Runtime result / source resolution |
| `RuntimeMaterialReception` | 承接 safe handoff | id、material / outcome / source refs、disposition、digest、correlation、time | `receive(...)` | `permits_outbound_evaluation`、`matches_outcome`、`is_body_free` | `RuntimeMaterialReceptionDisposition` | Runtime committed ref、safe metadata、clock |
| `RuntimeMediationPolicy` | 评估 delivery / reception | mapping、source、body、unknown、ordering markers | `formal_seam_only()` | `evaluate_delivery`、`evaluate_reception`、`requires_fence` | 无独立状态 | Runtime boundary invariants / pending seams |

### 14.4 `RuntimeDeliveryDecision`

##### `RuntimeDeliveryDecision`

```rust
/// Records a member-local decision about whether an accepted screening result may prepare Runtime submission.
pub struct RuntimeDeliveryDecision {
    /// Local identity of this delivery decision.
    pub delivery_decision_id: RuntimeDeliveryDecisionId,
    /// Screening decision that supplied the local precondition.
    pub screening_decision_ref: ScreeningDecisionId,
    /// Body-free inbound fact linked by the screening decision.
    pub inbound_fact_ref: InboundFactRecordId,
    /// Project-scoped subject of the requested Runtime mediation.
    pub subject_ref: ProjectMemberRef,
    /// Formal Runtime boundary selected for this decision.
    pub runtime_boundary_ref: RuntimeBoundaryRef,
    /// Exact Runtime entry mapping when formally available.
    pub entry_contract_ref: Option<RuntimeEntryContractRef>,
    /// Local delivery disposition.
    pub disposition: RuntimeDeliveryDisposition,
    /// Correlation preserved from inbound screening.
    pub correlation: MemberCorrelation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `delivery_decision_id` | `RuntimeDeliveryDecisionId` | local decision identity。 | application ID Port 生成；不得由 Runtime run ID、route 或 timestamp 拼接。 |
| `screening_decision_ref` / `inbound_fact_ref` | local typed IDs | 回链 CP02 local basis。 | screening 必须允许下一评估；inbound ref 必须与 screening 一致。 |
| `subject_ref` | `ProjectMemberRef` | 固定 Runtime mediation 主语。 | 从 screening / inbound trusted subject 复制；不支持第三执行主语。 |
| `runtime_boundary_ref` | `RuntimeBoundaryRef` | 指向 formal Runtime entry seam。 | 只能由 CP06 Runtime purpose resolution 或 explicit command typed input 提供；`L2M-UP-003` 未闭合不得伪造。 |
| `entry_contract_ref` | `Option<RuntimeEntryContractRef>` | 在 mapping 已闭口时绑定 exact contract。 | `Eligible` 必为 `Some`；`Blocked` / `Pending` 可为 `None`；不是 trigger schema copy。 |
| `disposition` | `RuntimeDeliveryDisposition` | member-side submission eligibility。 | 由 policy 形成；不等于 Runtime admission / run creation。 |
| `correlation` | `MemberCorrelation` | 连接 inbound、submission 与 result link。 | 必须等于 screening correlation；不从 payload digest 推导。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn permits_submission(&self) -> bool` | 判断可否建立 local Runtime attempt。 | 无。 | `bool`。 | 仅 `Eligible` 且 `entry_contract_ref.is_some()` 为真；不调用 Runtime。 |
| `pub fn matches_screening(&self, screening_decision: &ScreeningDecision) -> bool` | 检查 CP02 basis 与 correlation。 | loaded screening decision。 | `bool`。 | 纯函数；不将 degraded 视作 passed。 |
| `pub fn is_fail_closed(&self) -> bool` | 判断是否禁止正向 invocation。 | 无。 | `bool`。 | `Rejected` / `Blocked` / `Pending` 为真。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn decide(delivery_decision_id: RuntimeDeliveryDecisionId, screening_decision: &ScreeningDecision, inbound_fact: &InboundFactRecord, runtime_boundary_ref: RuntimeBoundaryRef, contract_resolution: &ExternalContextResolution, policy: &RuntimeMediationPolicy) -> Result<Self, DomainError>` | 从 CP02 basis 与 Runtime mapping resolution 形成 delivery decision。 | application 提供已加载 records / typed ref；policy 执行 exact mapping gate。 | `RuntimeDeliveryDecision` 或 `DomainError`。 | `SubmitScreenedFactToRuntime` local decision phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| mapping fail closed | `L2M-UP-003` 未由正式 Runtime contract 解除时，不能形成 `Eligible`。 |
| screening separation | `Passed` / constrained `Degraded` 只是输入资格；Runtime acceptance 只能由 `RuntimeResultLink` 外部 ref 表示。 |
| no trigger ownership | 本对象不创建 Runtime loop、context、plan、outcome、tool action 或 entry payload body。 |

### 14.5 `RuntimeSubmissionAttempt`

##### `RuntimeSubmissionAttempt`

```rust
/// Records one append-only local attempt to invoke a formally mapped Runtime entry boundary.
pub struct RuntimeSubmissionAttempt {
    /// Local identity of this submission attempt.
    pub attempt_id: RuntimeSubmissionAttemptId,
    /// Local delivery decision executed by the attempt.
    pub delivery_decision_ref: RuntimeDeliveryDecisionId,
    /// Runtime boundary selected by that decision.
    pub runtime_boundary_ref: RuntimeBoundaryRef,
    /// Local invocation posture.
    pub status: RuntimeSubmissionAttemptStatus,
    /// Idempotency key for this side-effect candidate.
    pub idempotency_key: IdempotencyKey,
    /// Formal or local submission carrier after an invocation.
    pub submission_ref: Option<RuntimeSubmissionRef>,
    /// Immutable result link recorded after Runtime feedback.
    pub result_link_ref: Option<RuntimeResultLinkId>,
    /// Local time at which the seam invocation was made.
    pub attempted_at: Option<Timestamp>,
    /// Redacted reason for blocked or unknown posture.
    pub reason_category: Option<SafeReasonCategory>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `attempt_id` | `RuntimeSubmissionAttemptId` | local attempt identity。 | application ID Port；每个 successor / new attempt 使用新 ID。 |
| `delivery_decision_ref` / `runtime_boundary_ref` | local ID / typed ref | 绑定 eligible decision 与 seam。 | 必须与 decision 一致；不得改向其他 Runtime boundary。 |
| `status` | `RuntimeSubmissionAttemptStatus` | prepared / submitted / result-linked / blocked / unknown。 | factory 为 `Prepared`；transition 返回 successor。 |
| `idempotency_key` | `IdempotencyKey` | duplicate / unknown-side-effect 锚点。 | 来自 Command / continuation metadata；不得由 attempt ID 或 trace ID 替代。 |
| `submission_ref` | `Option<RuntimeSubmissionRef>` | 连接实际 seam invocation。 | `Submitted` / `ResultLinked` 必有；仅证明本地调用。 |
| `result_link_ref` | `Option<RuntimeResultLinkId>` | 连接独立 Runtime result link。 | 只有 `ResultLinked` 可为 `Some`；不复制 Runtime decision。 |
| `attempted_at` | `Option<Timestamp>` | 本地调用时间。 | 仅由 Clock Port 的 invocation result 提供；不是 Runtime accepted time。 |
| `reason_category` | `Option<SafeReasonCategory>` | blocked / unknown 原因。 | 该两状态必须为 `Some`；不得存 adapter exception / Runtime body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_submitted(&self, submission_ref: RuntimeSubmissionRef, attempted_at: Timestamp) -> Result<Self, DomainError>` | 形成已调用 seam 的 successor。 | typed submission ref、Clock 值。 | successor attempt。 | 仅 `Prepared -> Submitted`；不表示 Runtime accepted。 |
| `pub fn link_result(&self, result_link: &RuntimeResultLink) -> Result<Self, DomainError>` | 关联正式 Runtime result。 | result link 必须匹配本 attempt。 | successor attempt。 | `Submitted -> ResultLinked`；不改变 delivery decision。 |
| `pub fn mark_blocked(&self, reason: SafeReasonCategory) -> Result<Self, DomainError>` | 记录调用前阻断。 | safe reason。 | successor attempt。 | 仅 `Prepared -> Blocked`；不得调用 Runtime。 |
| `pub fn mark_unknown(&self, reason: UnknownReason) -> Result<Self, DomainError>` | 建立 unknown side-effect fence。 | redacted reason。 | successor attempt。 | `Prepared / Submitted -> Unknown`；不自动重放。 |
| `pub fn is_retry_safe(&self, evidence: &RuntimeResolutionEvidence) -> bool` | 判断能否由 application 评估 successor。 | original-key formal evidence。 | `bool`。 | 纯判断；真值不是 retry authorization。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepare(attempt_id: RuntimeSubmissionAttemptId, delivery_decision: &RuntimeDeliveryDecision, idempotency_key: IdempotencyKey) -> Result<Self, DomainError>` | 从 eligible decision 建立 prepared attempt。 | decision 必须 `permits_submission()`。 | prepared attempt 或 error。 | `SubmitScreenedFactToRuntime` local-first write phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| submitted distinction | `Submitted` 仅代表 member 调用 Runtime seam，不是 Runtime accepted、run created 或 outcome completed。 |
| append-only / fence | 未知副作用必须保留 original key 和 evidence 评估；新 attempt 不覆盖旧记录。 |
| no runtime payload | attempt 不保存 trigger body、context、plan、checkpoint、tool receipt 或 LLM reasoning。 |

### 14.6 `RuntimeResultLink`

##### `RuntimeResultLink`

```rust
/// Links one member submission attempt to an owner-validated Runtime result reference.
pub struct RuntimeResultLink {
    /// Local identity of this immutable result link.
    pub result_link_id: RuntimeResultLinkId,
    /// Submission attempt being linked.
    pub attempt_ref: RuntimeSubmissionAttemptId,
    /// Formal Runtime-owned admission or result reference.
    pub runtime_result_ref: RuntimeAdmissionDecisionRef,
    /// Safe classification of the referenced owner result.
    pub classification: RuntimeResultClassification,
    /// Formal source family used to validate the result reference.
    pub source_ref: RuntimeSourceRef,
    /// Correlation shared with the linked attempt.
    pub correlation: MemberCorrelation,
    /// Member-local link time.
    pub linked_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `result_link_id` | `RuntimeResultLinkId` | local immutable link identity。 | application ID Port；late / duplicate result 使用新 link。 |
| `attempt_ref` | `RuntimeSubmissionAttemptId` | 回链 local attempt。 | application 已加载的 attempt；不得绕过 unknown fence。 |
| `runtime_result_ref` / `source_ref` | typed Runtime refs | 连接 foreign result 与 source family。 | 仅经 owner-specific Consumer / resolver 形成；`L2M-UP-004` 未闭口时不得伪造。 |
| `classification` | `RuntimeResultClassification` | external result 的安全分类。 | 不复制 Runtime outcome；`Accepted` 不表示完成。 |
| `correlation` | `MemberCorrelation` | 连接 inbound 与 attempt。 | 必须等于 linked attempt correlation；不能临时生成。 |
| `linked_at` | `Timestamp` | 本地 link 时间。 | Clock Port 提供；不是 Runtime result timestamp。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_attempt(&self, attempt: &RuntimeSubmissionAttempt) -> bool` | 验证 attempt / correlation。 | loaded attempt。 | `bool`。 | 纯函数；不修改 Runtime truth。 |
| `pub fn runtime_accepted(&self) -> bool` | 检查引用的安全分类。 | 无。 | `bool`。 | 真值不表示 run / outcome / downstream success。 |
| `pub fn is_late(&self, attempt: &RuntimeSubmissionAttempt) -> bool` | 判断是否属于旧 correlation / attempt 语境。 | loaded attempt。 | `bool`。 | late result 只能追加 link / trace。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn link(result_link_id: RuntimeResultLinkId, attempt: &RuntimeSubmissionAttempt, runtime_result_ref: RuntimeAdmissionDecisionRef, classification: RuntimeResultClassification, source_ref: RuntimeSourceRef, linked_at: Timestamp) -> Result<Self, DomainError>` | 从 formal Runtime result mapping 建立 immutable link。 | all foreign values already owner-validated by application boundary。 | `RuntimeResultLink` 或 error。 | `LinkRuntimeAdmissionResult` / Runtime feedback continuation。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| external-result only | 本对象只保存 typed ref / safe classification，不拥有或修改 Runtime admission、run 或 outcome。 |
| immutable late handling | late / duplicate result 形成新 link 或 trace marker，不能逆写旧 attempt。 |
| classification boundary | `Accepted`、`Rejected`、`Waiting` 等仅归 Runtime referenced result，不是 member general success enum。 |

### 14.7 `RuntimeMaterialReception`

##### `RuntimeMaterialReception`

```rust
/// Records body-free local reception of one Runtime-owned committed safe handoff material reference.
pub struct RuntimeMaterialReception {
    /// Local identity of this reception record.
    pub reception_id: RuntimeMaterialReceptionId,
    /// Runtime-owned committed safe material reference.
    pub runtime_material_ref: RuntimeSafeHandoffMaterialRef,
    /// Runtime-owned outcome reference to which the material is anchored.
    pub runtime_outcome_ref: RuntimeOutcomeRef,
    /// Formal Runtime source family reference.
    pub source_ref: RuntimeSourceRef,
    /// Local reception disposition.
    pub disposition: RuntimeMaterialReceptionDisposition,
    /// Digest of the allowed material surface.
    pub material_digest: Digest,
    /// Correlation carried by the verified source boundary.
    pub correlation: MemberCorrelation,
    /// Member-local reception time.
    pub received_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reception_id` | `RuntimeMaterialReceptionId` | local reception identity。 | application ID Port；same material duplicate 不建第二 outbound 主线。 |
| `runtime_material_ref` / `runtime_outcome_ref` / `source_ref` | typed Runtime refs | 锚定 Runtime committed material 与其 owner context。 | 仅来自 formal Runtime source; no body copy。 |
| `disposition` | `RuntimeMaterialReceptionDisposition` | accepted / rejected / duplicate / late / blocked / unknown。 | `RuntimeMediationPolicy` 依据 source / body / correlation 决定。 |
| `material_digest` | `Digest` | 绑定 allowed material surface。 | 从 `RuntimeMaterialMetadata` 复制；不能替代 committed proof。 |
| `correlation` | `MemberCorrelation` | 串联 Runtime → outbound。 | 由 verified source metadata 提供。 |
| `received_at` | `Timestamp` | local receipt time。 | Clock Port；不是 Runtime outcome time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn permits_outbound_evaluation(&self) -> bool` | 判断可否进入 CP04 decision。 | 无。 | `bool`。 | 仅 `Accepted` 为真。 |
| `pub fn matches_outcome(&self, runtime_outcome_ref: &RuntimeOutcomeRef) -> bool` | 验证 owner outcome anchor。 | typed ref。 | `bool`。 | 纯函数；不读取 Runtime outcome。 |
| `pub fn is_body_free(&self) -> bool` | 验证只保留允许的 refs / digest / metadata。 | 无。 | `bool`。 | 任何 false 阻止持久化 / outbound。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn receive(reception_id: RuntimeMaterialReceptionId, runtime_material_ref: RuntimeSafeHandoffMaterialRef, runtime_outcome_ref: RuntimeOutcomeRef, source_ref: RuntimeSourceRef, material_metadata: RuntimeMaterialMetadata, received_at: Timestamp, policy: &RuntimeMediationPolicy) -> Result<Self, DomainError>` | 从 Runtime-safe boundary 的 metadata 建立本地 reception。 | application 确保 owner / source resolution；factory 不解析 body。 | `RuntimeMaterialReception` 或 error。 | `RuntimeMaterialConsumer` / `RuntimeMaterialReceptionConsumer`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| source / body gate | material 未被证明 committed、body-free、source-bound 时必须 `Rejected` / `Blocked` / `Unknown`，不得继续 CP04。 |
| no Runtime truth copy | 不保存 outcome、safe material、tool execution 或 model response正文。 |
| local reception only | accepted 是 member local reception，不表示 outbound decision、publication、downstream accepted 或 observed。 |

### 14.8 `RuntimeMediationPolicy`

##### `RuntimeMediationPolicy`

```rust
/// Guards the member-to-Runtime entry and Runtime-safe-material boundaries without owning Runtime truth.
pub struct RuntimeMediationPolicy {
    /// Requirement for a formally mapped Runtime entry.
    pub entry_mapping_requirement: RuntimeEntryMappingRequirement,
    /// Requirement for a formally proven Runtime material source family.
    pub material_source_requirement: RuntimeMaterialSourceRequirement,
    /// Boundary rejecting raw or hidden material.
    pub body_boundary: ForbiddenBodyBoundary,
    /// Conservative handling for unknown side effects or source proof.
    pub unknown_handling: UnknownHandlingMode,
    /// Ordering and duplicate rule for result and material links.
    pub ordering_rule: RuntimeMediationOrderingRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_mapping_requirement` | `RuntimeEntryMappingRequirement` | 要求 exact entry mapping 可回链。 | domain-local marker；`L2M-UP-003` 未闭合时不允许 positive mapping。 |
| `material_source_requirement` | `RuntimeMaterialSourceRequirement` | 要求 source family / committed proof。 | domain-local marker；`L2M-UP-004` 未闭合时 fail closed。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 拒绝 raw / hidden / secret material。 | 固定 architecture invariant。 |
| `unknown_handling` | `UnknownHandlingMode` | unknown submission / reception fence。 | factory 固定 `FailClosed`。 |
| `ordering_rule` | `RuntimeMediationOrderingRule` | late / duplicate append semantics。 | 不用覆盖替代 history。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate_delivery(&self, screening_decision: &ScreeningDecision, contract_resolution: &ExternalContextResolution) -> RuntimeDeliveryDisposition` | 评估 member-side Runtime delivery。 | resolution 必须为 RuntimeEntry purpose。 | `RuntimeDeliveryDisposition`。 | 纯函数；不创建 Runtime trigger。 |
| `pub fn evaluate_reception(&self, material_metadata: &RuntimeMaterialMetadata, source_ref: &RuntimeSourceRef, correlation_state: &CorrelationState) -> RuntimeMaterialReceptionDisposition` | 评估 safe material reception。 | metadata 已不含 body。 | `RuntimeMaterialReceptionDisposition`。 | 纯函数；不读取 Runtime outcome。 |
| `pub fn requires_fence(&self, attempt: &RuntimeSubmissionAttempt) -> bool` | 判断 attempt 是否阻止新提交。 | loaded local attempt。 | `bool`。 | unknown 必为真；不由 timer 解除。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn formal_seam_only() -> Self` | 创建 exact mapping / source required 的 fail-closed policy。 | 无。 | 固定 policy。 | application service construction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no upstream schema invention | policy 不定义 `RuntimeTriggerContext`、entry payload、run、plan、outcome 或 source route。 |
| no default mapping | configuration、fake 或 local adapter 不得在 `L2M-UP-003/004` 未关闭时模拟可用 mapping。 |
| no success inflation | Runtime ref / submission result 不得被升级为 Runtime lifecycle 或 tool execution truth。 |

### 14.9 CP03 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP03 五对象均有 capability、字段、factory 和成员函数 | pass_for_current_step | decision、attempt、result link、reception、policy 均已独立闭合。 |
| Runtime truth 与 member local truth 分层 | pass | trigger / context / plan / outcome / tool execution 均只以 owner ref / safe metadata 进入。 |
| exact mapping / source family | pass_with_upstream_blockers | `L2M-UP-003/004` 未解除时只能 `Blocked` / `Pending` / `Unknown`。 |
| attempt / result / material 语义未压平 | pass | submitted、classification、accepted reception 均不等于 Runtime success或 downstream output。 |
| Step 7 / 8 承接 | ready_for_CP04 | Step 7 需定义 Runtime entry / result / material source ports；Step 8 需定义 Commands、material Consumer 与 Query。 |

## 15. `domain` CP04：Outbound Boundary

### 15.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 对 accepted Runtime material 决定是否可安全出站 | CP03 reception、purpose、target resolution | `OutboundDecision` | eligible / rejected / blocked / pending | `OutboundDecision`、`OutboundMaterialPolicy` | Step 7 target / publication resolver；Step 8 Consumer / Query |
| 固化最小 body-free 出站材料 | eligible decision、Runtime reception、allowed refs、redaction ref | `MemberOutboundMaterial` | immutable、无 delivery 状态 | `MemberOutboundMaterial` | Step 7 publisher handoff Port；Step 8 event / job schema |
| 记录 publication invocation 与反馈 | material、seam boundary、idempotency、formal feedback | `PublicationAttempt` successor | prepared / submitted / feedback-linked / blocked / unknown | `PublicationAttempt` | Step 7 publication Port；Step 8 Job / Consumer |
| 显式表达未闭合 publication 关系 | decision / attempt、formal feedback / resolution | `PublicationGap` successor | open / resolution-pending / resolved / superseded | `PublicationGap` | Step 7 gap Store / resolution Port；Step 8 Query / Job |

### 15.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `OutboundDecision` | 判定 Runtime-safe material 的 member 出站资格 | decision record | reception / target / purpose / resolution 一致性 | 不改变 Runtime material 或选择 Bus route |
| `MemberOutboundMaterial` | 固化最小可交接 refs | immutable material | body-free、redaction、reference minimization | 不成为 Conversation fact、Artifact、report 或 Runtime output copy |
| `PublicationAttempt` | 记录本地 publication side effect 候选 | append-only attempt | prepared / submitted / feedback / unknown fence | 不把 submitted 升格为 delivered / accepted / observed |
| `PublicationGap` | 表达 route / feedback / side-effect 缺口 | gap record | request / resolve / supersede / retry fence | 不删除 history 或声称 publication success |
| `OutboundMaterialPolicy` | 保护 source、target、purpose和安全边界 | policy / guard | formal seam、body-free、unknown handling | 不定义 Bus route、DLQ、Conversation truth或 downstream acceptance |

### 15.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `OutboundDecision` | 决定 material creation | id、reception、Runtime material、subject、optional target、purpose、resolution、disposition、correlation | `decide(...)` | `permits_material_creation`、`matches_reception`、`is_fail_closed` | `OutboundDisposition` | CP03 accepted reception、CP06 target resolution、ID |
| `MemberOutboundMaterial` | 固化 safe material | id、decision、Runtime refs、target、purpose、allowed refs、redaction、digest、correlation | `create(...)` | `is_body_free`、`matches_decision`、`supports_replay_context` | immutable | eligible decision、reception、policy-derived refs / digest |
| `PublicationAttempt` | record seam invocation | id、material、target、boundary、status、key、submission / feedback / gap refs、time、reason | `prepare(...)` | `mark_submitted`、`link_feedback`、`open_gap`、`mark_unknown`、`is_retry_safe` | `PublicationAttemptStatus` | material、formal seam result、Clock / idempotency |
| `PublicationGap` | explicit unresolved relation | id、decision、optional attempt、category、status、external ref、reason、time | `open(...)` | `request_resolution`、`resolve`、`supersede`、`blocks_new_attempt` | category + `PublicationGapStatus` | decision / attempt / formal feedback / resolution |
| `OutboundMaterialPolicy` | evaluate decision/material/attempt | source / target / purpose / body / minimization / unknown markers | `formal_body_free_only()` | `evaluate_decision`、`validate_material`、`evaluate_attempt`、`requires_fence` | 无独立状态 | architecture invariant / CP06 resolution |

### 15.4 `OutboundDecision`

##### `OutboundDecision`

```rust
/// Records a member-local decision about a body-free outbound handoff from accepted Runtime material.
pub struct OutboundDecision {
    /// Local identity of this outbound decision.
    pub outbound_decision_id: OutboundDecisionId,
    /// Accepted Runtime material reception evaluated by this decision.
    pub reception_ref: RuntimeMaterialReceptionId,
    /// Runtime-owned committed material reference copied from the reception.
    pub runtime_material_ref: RuntimeSafeHandoffMaterialRef,
    /// Project-scoped subject of the outbound action.
    pub subject_ref: ProjectMemberRef,
    /// Resolved formal target when available.
    pub target_ref: Option<OutboundTargetRef>,
    /// Explicit semantic purpose of the handoff.
    pub purpose: InteractionPurpose,
    /// Neutral target or publication-seam resolution used by the decision.
    pub target_resolution_ref: ExternalContextResolutionId,
    /// Local outbound disposition.
    pub disposition: OutboundDisposition,
    /// Correlation shared with the accepted Runtime reception.
    pub correlation: MemberCorrelation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `outbound_decision_id` | `OutboundDecisionId` | local decision identity。 | application ID Port 生成；不从 target、route 或 Runtime outcome 拼接。 |
| `reception_ref` / `runtime_material_ref` | local ID / typed Runtime ref | 固定 CP03 accepted source。 | reception 必须 `permits_outbound_evaluation()`；两者必须匹配。 |
| `subject_ref` | `ProjectMemberRef` | 固定出站主语。 | application 由 source / scoped context 复制；非项目型主语 fail closed。 |
| `target_ref` | `Option<OutboundTargetRef>` | 指向 resolved foreign target。 | `Eligible` 必为 `Some`；blocked / pending 不用默认 target 填充。 |
| `purpose` | `InteractionPurpose` | 固定出站用途。 | 必须为 `OutboundPublication`；不能从 route、topic 或 target name 推断。 |
| `target_resolution_ref` | `ExternalContextResolutionId` | 连接 CP06 neutral resolution。 | purpose / scope 必须匹配 outbound；`Resolved` 不等于 downstream authorization。 |
| `disposition` | `OutboundDisposition` | local eligibility。 | policy 产生；`Eligible` 不等于 material / publication 或 delivery。 |
| `correlation` | `MemberCorrelation` | 关联 reception / material / attempt / trace。 | 必须与 CP03 reception 一致。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn permits_material_creation(&self) -> bool` | 判断可否创建 member material。 | 无。 | `bool`。 | 仅 `Eligible` 且 target ref 存在时为真。 |
| `pub fn matches_reception(&self, reception: &RuntimeMaterialReception) -> bool` | 校验 Runtime source / correlation / subject 关系。 | loaded reception。 | `bool`。 | 纯函数；不读取 Runtime body。 |
| `pub fn is_fail_closed(&self) -> bool` | 判断是否停止正向出站。 | 无。 | `bool`。 | `Rejected` / `Blocked` / `Pending` 为真。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn decide(outbound_decision_id: OutboundDecisionId, reception: &RuntimeMaterialReception, subject_ref: ProjectMemberRef, purpose: InteractionPurpose, target_resolution: &ExternalContextResolution, policy: &OutboundMaterialPolicy) -> Result<Self, DomainError>` | 从 accepted reception 和 formal target resolution 建立 local decision。 | application 加载 reception / resolution；policy 选择 disposition。 | `OutboundDecision` 或 error。 | Runtime material continuation / outbound evaluation。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| source-first | 只有 accepted CP03 reception 可形成 positive decision；不能绕过 Runtime committed-material boundary。 |
| no default route | seam / route / target 未证明时是 `Blocked` / `Pending`，不猜默认下游。 |
| no external success | `Eligible` 只授权下一步 material factory，不等于 delivery、Conversation fact、downstream accepted 或 observed。 |

### 15.5 `MemberOutboundMaterial`

##### `MemberOutboundMaterial`

```rust
/// Stores immutable, minimized, body-free material prepared for one formal outbound boundary.
pub struct MemberOutboundMaterial {
    /// Local identity of this immutable material record.
    pub material_id: MemberOutboundMaterialId,
    /// Eligible outbound decision that authorized material creation.
    pub decision_ref: OutboundDecisionId,
    /// Runtime-owned committed safe material reference.
    pub runtime_material_ref: RuntimeSafeHandoffMaterialRef,
    /// Runtime-owned outcome reference associated with the source material.
    pub runtime_outcome_ref: RuntimeOutcomeRef,
    /// Resolved formal outbound target.
    pub target_ref: OutboundTargetRef,
    /// Fixed outbound purpose.
    pub purpose: InteractionPurpose,
    /// Ordered unique body-free references allowed by the policy.
    pub allowed_refs: Vec<TypedRef>,
    /// Formal redaction profile reference used for the allowed surface.
    pub redaction_profile_ref: RedactionProfileRef,
    /// Digest of the explicitly allowed material surface.
    pub material_digest: Digest,
    /// Correlation carried into publication attempts.
    pub correlation: MemberCorrelation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `material_id` | `MemberOutboundMaterialId` | immutable material identity。 | application ID Port；每次新 material 创建新 ID。 |
| `decision_ref` | `OutboundDecisionId` | 回链唯一授权 decision。 | decision 必须 `permits_material_creation()`。 |
| `runtime_material_ref` / `runtime_outcome_ref` | typed Runtime refs | 锚定允许的来源。 | 从 matched reception 复制；不得复制 Runtime body。 |
| `target_ref` | `OutboundTargetRef` | 固定 target identity。 | 从 eligible decision 复制；不能替换为 route / URL / consumer name。 |
| `purpose` | `InteractionPurpose` | 固定出站语义。 | 必须 `OutboundPublication`。 |
| `allowed_refs` | `Vec<TypedRef>` | 最小交接引用集合。 | ordered-unique、非空、policy 允许；不得含 body、credential、definition、raw event 或 provider response。 |
| `redaction_profile_ref` | `RedactionProfileRef` | 可回链裁剪依据。 | formal policy safe ref；不是 redaction policy body。 |
| `material_digest` | `Digest` | 绑定 allowed surface。 | application Digest Port 对 allowed refs / safe metadata 计算；不是 payload hash 的替代隐含 body。 |
| `correlation` | `MemberCorrelation` | 回链 source / publication。 | 与 decision / reception 一致。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_body_free(&self) -> bool` | 校验 material 安全边界。 | 无。 | `bool`。 | false 禁止 handoff / persistence。 |
| `pub fn matches_decision(&self, decision: &OutboundDecision) -> bool` | 校验 source、target、purpose、correlation。 | loaded decision。 | `bool`。 | 纯函数。 |
| `pub fn supports_replay_context(&self) -> bool` | 判断是否有稳定 digest / correlation 语境。 | 无。 | `bool`。 | 不直接授权 replay 或 retry。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(material_id: MemberOutboundMaterialId, decision: &OutboundDecision, reception: &RuntimeMaterialReception, allowed_refs: Vec<TypedRef>, redaction_profile_ref: RedactionProfileRef, material_digest: Digest, policy: &OutboundMaterialPolicy) -> Result<Self, DomainError>` | 从 eligible decision 构造 immutable material。 | refs / profile / digest 均由 application 已验证 / 生成。 | `MemberOutboundMaterial` 或 error。 | Publication relay 前 local-first material phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| immutable minimal surface | material 创建后不修改；source 变化需要新 decision / material。 |
| no foreign-body copy | Runtime material、Conversation fact、Artifact、event、tool / model body均不进入字段。 |
| no publication result | material 无 submitted / delivered / accepted / observed 状态。 |

### 15.6 `PublicationAttempt`

##### `PublicationAttempt`

```rust
/// Records one append-only local attempt to invoke a formal publication boundary.
pub struct PublicationAttempt {
    /// Local identity of this publication attempt.
    pub attempt_id: PublicationAttemptId,
    /// Immutable member material selected for the attempt.
    pub material_ref: MemberOutboundMaterialId,
    /// Resolved target copied from the material.
    pub target_ref: OutboundTargetRef,
    /// Formal publication seam selected by a neutral resolution.
    pub publication_boundary_ref: PublicationBoundaryRef,
    /// Local publication invocation posture.
    pub status: PublicationAttemptStatus,
    /// Idempotency key for this external side-effect candidate.
    pub idempotency_key: IdempotencyKey,
    /// Formal or local carrier returned after invocation.
    pub submission_ref: Option<PublicationSubmissionRef>,
    /// Formal downstream feedback reference when linked.
    pub feedback_ref: Option<DownstreamFeedbackRef>,
    /// Explicit local gap related to this attempt.
    pub gap_ref: Option<PublicationGapId>,
    /// Member-local invocation time.
    pub attempted_at: Option<Timestamp>,
    /// Redacted reason for blocked or unknown posture.
    pub reason_category: Option<SafeReasonCategory>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `attempt_id` | `PublicationAttemptId` | local attempt identity。 | application ID Port；new attempt 永不覆盖旧 attempt。 |
| `material_ref` / `target_ref` | local material ID / target ref | 固定 prepared material 与目标。 | 必须从 same material 复制；不得由 worker / route 重写。 |
| `publication_boundary_ref` | `PublicationBoundaryRef` | formal transport-neutral seam。 | 仅来自 CP06 publication resolution；exact route pending 时不能伪造。 |
| `status` | `PublicationAttemptStatus` | local invocation state。 | factory `Prepared`；transition 返回 successor。 |
| `idempotency_key` | `IdempotencyKey` | duplicate / unknown fence key。 | Command / Job metadata 提供；不得从 material / trace 推导。 |
| `submission_ref` / `feedback_ref` | `Option<...>` | 关联 local invocation / formal feedback。 | Submitted needs submission; feedback-linked needs feedback; neither copies delivery body. |
| `gap_ref` | `Option<PublicationGapId>` | 连接未闭合语义。 | `Unknown` 必须关联 gap；route-level block 可先无 attempt gap。 |
| `attempted_at` | `Option<Timestamp>` | local invocation time。 | Clock Port；不表示 Bus delivery or downstream time。 |
| `reason_category` | `Option<SafeReasonCategory>` | blocked / unknown explanation。 | 两状态必须 `Some`；不存 adapter response text。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_submitted(&self, submission_ref: PublicationSubmissionRef, attempted_at: Timestamp) -> Result<Self, DomainError>` | 记录 seam invocation successor。 | typed ref、Clock 值。 | successor attempt。 | `Prepared -> Submitted`;不表示 delivered。 |
| `pub fn link_feedback(&self, feedback_ref: DownstreamFeedbackRef) -> Result<Self, DomainError>` | 关联 formal downstream feedback。 | owner-validated ref。 | successor attempt。 | `Submitted -> FeedbackLinked`;不改 decision / material。 |
| `pub fn open_gap(&self, gap: &PublicationGap) -> Result<Self, DomainError>` | 关联独立 gap。 | gap 必须匹配 decision / attempt。 | successor attempt。 | 不将 gap resolution 当 publication success。 |
| `pub fn mark_blocked(&self, reason: SafeReasonCategory) -> Result<Self, DomainError>` | 记录调用前阻断。 | safe reason。 | successor attempt。 | `Prepared -> Blocked`;不得调用 seam。 |
| `pub fn mark_unknown(&self, reason: UnknownReason, gap_ref: PublicationGapId) -> Result<Self, DomainError>` | 建立 unknown side-effect fence。 | safe reason、已创建 gap ref。 | successor attempt。 | `Prepared / Submitted -> Unknown`;禁止 blind retry。 |
| `pub fn is_retry_safe(&self, evidence: &PublicationResolutionEvidence) -> bool` | 判断能否评估后继 attempt。 | exact original-key evidence。 | `bool`。 | 真值不是 retry authorization。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepare(attempt_id: PublicationAttemptId, material: &MemberOutboundMaterial, publication_boundary_ref: PublicationBoundaryRef, idempotency_key: IdempotencyKey) -> Result<Self, DomainError>` | 从 safe material 创建 prepared attempt。 | formal seam ref 由 application resolution 提供。 | prepared attempt 或 error。 | `PublicationRelayJob` local prepare phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| local invocation only | `Submitted` 仅代表 member 调用了 seam；不等于 Bus delivered、downstream accepted、Conversation fact 或 observed。 |
| feedback is reference | feedback-linked 只表示 formal ref 已关联；不能把 source owner outcome反写为 member decision。 |
| unknown fence | unknown 后需要 original key 的 formal resolution / feedback；不得依据 timeout、scheduler 或 fake success重发。 |

### 15.7 `PublicationGap`

##### `PublicationGap`

```rust
/// Records an append-only unresolved publication relation without claiming downstream outcome.
pub struct PublicationGap {
    /// Local identity of this gap record.
    pub gap_id: PublicationGapId,
    /// Outbound decision affected by the gap.
    pub decision_ref: OutboundDecisionId,
    /// Related publication attempt when invocation was prepared or made.
    pub attempt_ref: Option<PublicationAttemptId>,
    /// Specific missing or uncertain publication relation.
    pub category: PublicationGapCategory,
    /// Local gap lifecycle.
    pub status: PublicationGapStatus,
    /// Formal external reference that explains a resolution when present.
    pub external_ref: Option<DownstreamFeedbackRef>,
    /// Redacted explanation of the gap.
    pub safe_reason: SafeReasonCategory,
    /// Local time the gap was opened.
    pub opened_at: Timestamp,
    /// Local time a formal resolution was linked.
    pub resolved_at: Option<Timestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gap_id` | `PublicationGapId` | local gap identity。 | application ID Port；后继 gap 使用新 ID。 |
| `decision_ref` | `OutboundDecisionId` | 回链 source decision。 | application 已加载 decision；不对 decision 作回写。 |
| `attempt_ref` | `Option<PublicationAttemptId>` | 连接 attempt。 | route / contract precondition 缺口可为 None；unknown invocation 必须 Some。 |
| `category` | `PublicationGapCategory` | 表达确切缺口。 | 仅 HLD fixed variants；不能用 free-form string。 |
| `status` | `PublicationGapStatus` | open / resolution-pending / resolved / superseded。 | factory `Open`；transition 返回 successor。 |
| `external_ref` | `Option<DownstreamFeedbackRef>` | 回链 formal resolution feedback。 | `Resolved` 必须 Some；不等于 delivery success。 |
| `safe_reason` | `SafeReasonCategory` | 低敏原因。 | 非空；不得带 route / payload / downstream body。 |
| `opened_at` / `resolved_at` | `Timestamp` / `Option<Timestamp>` | 本地 history time。 | Clock Port；resolved only after formal ref link。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn request_resolution(&self, resolution_request_ref: ResolutionRequestRef) -> Result<Self, DomainError>` | 标记显式对账请求。 | typed request ref。 | successor gap。 | `Open -> ResolutionPending`;不得猜结果。 |
| `pub fn resolve(&self, feedback_ref: DownstreamFeedbackRef, resolved_at: Timestamp) -> Result<Self, DomainError>` | 关联 formal feedback。 | owner-validated feedback、Clock。 | successor gap。 | `ResolutionPending / Open -> Resolved`;只关闭 local gap。 |
| `pub fn supersede(&self, successor_gap: &PublicationGap) -> Result<Self, DomainError>` | 连接新 gap。 | successor must be same decision. | successor record。 | `Open / ResolutionPending / Unknown -> Superseded`;保留历史。 |
| `pub fn blocks_new_attempt(&self, evidence: &PublicationResolutionEvidence) -> bool` | 判断是否阻断新 attempt。 | original key evidence。 | `bool`。 | unresolved unknown must block; false is not positive delivery proof. |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(gap_id: PublicationGapId, outbound_decision: &OutboundDecision, attempt: Option<&PublicationAttempt>, category: PublicationGapCategory, safe_reason: SafeReasonCategory, opened_at: Timestamp) -> Result<Self, DomainError>` | 为 route、submission 或 feedback 未闭合建立 gap。 | loaded local decision / optional attempt；Clock。 | open gap 或 error。 | publication preparation、unknown invocation、feedback reconciliation。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| local gap only | `Resolved` 仅表示 local gap 得到 formal explanation，不等于 publication success / acceptance。 |
| append history | gap 不删除、不覆盖；correction / later feedback产生 successor record。 |
| no source rollback | delivery failure 或 gap 不得回滚 decision / material / Runtime reception。 |

### 15.8 `OutboundMaterialPolicy`

##### `OutboundMaterialPolicy`

```rust
/// Guards committed Runtime material, formal targets, minimized refs, and publication unknown-side-effect fences.
pub struct OutboundMaterialPolicy {
    /// Requirement for a committed local Runtime-material reception.
    pub source_requirement: CommittedSourceRequirement,
    /// Requirement for a formally resolved target and boundary.
    pub target_requirement: FormalTargetRequirement,
    /// Requirement that the named interaction purpose is supported.
    pub purpose_requirement: InteractionPurposeRequirement,
    /// Boundary rejecting forbidden body material.
    pub body_boundary: ForbiddenBodyBoundary,
    /// Rule minimizing typed references in outbound material.
    pub reference_minimization_rule: ReferenceMinimizationRule,
    /// Conservative handling for unknown publication effects.
    pub unknown_handling: UnknownHandlingMode,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_requirement` | `CommittedSourceRequirement` | 要求 CP03 accepted source。 | domain-local invariant；不把 reception ref 当 Runtime truth copy。 |
| `target_requirement` | `FormalTargetRequirement` | 要求 formal target / seam resolution。 | `L2M-UP-004/005` 未闭合时 fail closed。 |
| `purpose_requirement` | `InteractionPurposeRequirement` | 约束 target / purpose matching。 | purpose 只能来自 named use case。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 拒绝正文、secret、hidden reasoning。 | 固定架构边界。 |
| `reference_minimization_rule` | `ReferenceMinimizationRule` | 强制最小 refs。 | 不保存 downstream body / generic payload。 |
| `unknown_handling` | `UnknownHandlingMode` | publication unknown fence。 | factory 固定 `FailClosed`。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate_decision(&self, reception: &RuntimeMaterialReception, purpose: InteractionPurpose, target_resolution: &ExternalContextResolution) -> OutboundDisposition` | 形成 local decision posture。 | only body-free local/support inputs。 | `OutboundDisposition`。 | 纯函数；不发表 / 不创建 target。 |
| `pub fn validate_material(&self, allowed_refs: &[TypedRef], redaction_profile_ref: &RedactionProfileRef, inspection: &ForbiddenBodyInspection) -> Result<(), DomainError>` | 验证最小 refs 与 body gate。 | typed refs / safe profile / inspection。 | success or domain error。 | 不解析 foreign body。 |
| `pub fn evaluate_attempt(&self, material: &MemberOutboundMaterial, publication_resolution: &ExternalContextResolution) -> bool` | 判断 seam 是否可调用。 | immutable material / neutral resolution。 | `bool`。 | true only grants application to prepare attempt; not external success. |
| `pub fn requires_fence(&self, attempt: &PublicationAttempt, gap: Option<&PublicationGap>) -> bool` | 判断 unknown 是否阻断新 attempt。 | local attempt / optional gap。 | `bool`。 | unknown / unresolved gap 必须 true。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn formal_body_free_only() -> Self` | 创建 committed-source、formal-target、body-free、fail-closed policy。 | 无。 | fixed policy。 | outbound application service construction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no Bus implementation | policy 不定义 topic、route、retry、DLQ、broker receipt或 delivery state。 |
| no downstream truth | policy 不解释 Conversation / downstream accepted / observed / artifact truth。 |
| no config bypass | config、fake 或 adapter 不得放宽 source / body / target / purpose / unknown fence。 |

### 15.9 CP04 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP04 五对象均有 capability、字段、factory 和成员函数 | pass_for_current_step | decision、material、attempt、gap、policy 独立闭合。 |
| decision / material / attempt / gap 分层 | pass | eligible、prepared、submitted、feedback-linked、resolved 各不等于 delivery / acceptance / observation。 |
| foreign truth / body boundary | pass | Runtime、Bus、Conversation、downstream truth 都只保留 typed ref / safe category。 |
| route / unknown fence | pass_with_upstream_blockers | exact route / event carrier 继续受 `L2M-UP-004/005` 限制；没有默认 target或 blind retry。 |
| Step 7 / 8 承接 | ready_for_CP05 | Step 7 需 publication / feedback / gap ports；Step 8 需 Consumer、relay Job、Query / event schema。 |

## 16. `domain` CP05：Interaction Trace

### 16.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 追加 committed-fact 的 body-free 交互关联 | committed local fact、source refs、predecessors、purpose、correlation | `InteractionTraceEntry` | immutable append；失败形成 gap | `InteractionTraceEntry`、`TraceMaterialPolicy` | Step 7 trace Store / committed-fact Port；Step 8 Consumer / Query |
| 显式记录关联缺口与其 resolution | expected fact kind、available refs、gap reason、formal resolution | `InteractionGap` successor | open / blocked / resolution-pending / resolved / unknown / superseded | `InteractionGap` | Step 7 gap Store / resolution Port；Step 8 Query / Job |
| 制备并尝试观测交接 | committed trace/gap、safe categories/dimensions、redaction、observation seam | `ObservationMaterial`、`ObservationAttempt` | immutable material + attempt posture | `ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy` | Step 7 observation Port；Step 8 relay Job / feedback Consumer |

### 16.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `InteractionTraceEntry` | 连接 committed local facts 的关联链 | immutable trace link | committed-only、correlation、predecessor consistency | 不成为 central event truth、complete log 或 evidence |
| `InteractionGap` | 显式表达可证明关联缺口 | gap record | open / resolve / supersede / degradation | 不猜测补 correlation 或修复来源事实 |
| `ObservationMaterial` | 提供低敏低基数观测材料 | immutable material | body-free、cardinality、redaction、trace match | 不保存完整日志、metric backend body、evidence / verdict |
| `ObservationAttempt` | 记录 local observation seam invocation | append-only attempt | prepared / submitted / feedback / unknown fence | 不代表 backend ingested / observed |
| `TraceMaterialPolicy` | 守护 trace、material 与 observation boundary | policy / guard | committed refs、minimization、body、cardinality、correlation、unknown | 不定义 observability backend、retention、query 或 external adapter |

### 16.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `InteractionTraceEntry` | append committed relation | id、subject、fact ref/kind、source/predecessor refs、purpose、correlation、time | `append(...)` | `matches_fact`、`belongs_to`、`is_body_free` | immutable | committed local fact、source refs、Clock / ID |
| `InteractionGap` | represent / resolve trace gap | id、subject、expected kind、actual refs、category/status/reason、correlation,resolution/time | `open(...)` | `request_resolution`、`resolve`、`supersede`、`degrades_trace_read` | category + `InteractionGapStatus` | committed tracing failure / formal resolution |
| `ObservationMaterial` | create low-sensitive material | id、subject、trace/gap refs、categories、dimensions、redaction,digest,correlation | `create(...)` | `is_body_free`、`is_low_cardinality`、`matches_trace` | immutable | committed trace/gap、policy-derived category/dimension, digest |
| `ObservationAttempt` | local observation invocation | id、material,boundary,status,key,submission/feedback,reason,time | `prepare(...)` | `mark_submitted`、`link_feedback`、`mark_blocked`、`mark_unknown`、`is_retry_safe` | `ObservationAttemptStatus` | material、seam result、Clock / idempotency |
| `TraceMaterialPolicy` | validate trace/material/handoff | source/minimization/body/cardinality/correlation/unknown markers | `minimal_low_sensitive_only()` | `validate_trace_source`、`validate_correlation`、`validate_observation`、`evaluate_handoff` | 无独立状态 | architecture invariant / observation resolution |

### 16.4 `InteractionTraceEntry`

##### `InteractionTraceEntry`

```rust
/// Stores an immutable, body-free relationship between one committed member fact and its interaction context.
pub struct InteractionTraceEntry {
    /// Local identity of this trace entry.
    pub trace_entry_id: InteractionTraceEntryId,
    /// Project-scoped subject to which the interaction belongs.
    pub subject_ref: ProjectMemberRef,
    /// Already committed local fact being traced.
    pub fact_ref: MemberCommittedFactRef,
    /// Fixed member fact family of the traced fact.
    pub fact_kind: MemberFactKind,
    /// Ordered unique minimal source references.
    pub source_refs: Vec<TypedRef>,
    /// Ordered unique predecessor trace entries in the same correlation chain.
    pub predecessor_refs: Vec<InteractionTraceEntryId>,
    /// Semantic interaction purpose.
    pub purpose: InteractionPurpose,
    /// Correlation shared across the interaction chain.
    pub correlation: MemberCorrelation,
    /// Member-local append time.
    pub recorded_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `trace_entry_id` | `InteractionTraceEntryId` | immutable trace identity。 | application ID Port；每次 append 新 ID。 |
| `subject_ref` | `ProjectMemberRef` | 固定 trace 主语。 | 从 committed source fact application load / source context 得到；不可改成 global identity。 |
| `fact_ref` / `fact_kind` | committed ref / closed enum | 指向与分类 source fact。 | `fact_ref` 必须已提交且 kind 一致；不能指外部 event、view 或内存对象。 |
| `source_refs` | `Vec<TypedRef>` | 解释最小 source chain。 | ordered-unique、body-free；不得保存 raw body / log。 |
| `predecessor_refs` | `Vec<InteractionTraceEntryId>` | 保留关联顺序。 | ordered-unique、无 self-reference；不能从 timestamp 猜 predecessor。 |
| `purpose` | `InteractionPurpose` | 固定 trace 语义。 | 必须是 `InteractionTrace`；不从 event topic / target 推断。 |
| `correlation` | `MemberCorrelation` | 连接跨 CP 的 member interaction。 | 来自 committed source metadata；不新造。 |
| `recorded_at` | `Timestamp` | local append time。 | Clock Port；不代表 source event / delivery time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_fact(&self, fact_ref: &MemberCommittedFactRef) -> bool` | 判断是否回链指定 committed fact。 | typed committed ref。 | `bool`。 | 纯函数。 |
| `pub fn belongs_to(&self, subject_ref: &ProjectMemberRef, correlation: &MemberCorrelation) -> bool` | 检查 subject / correlation 语境。 | typed subject / correlation。 | `bool`。 | 纯函数；不读取 source truth。 |
| `pub fn is_body_free(&self) -> bool` | 审计 trace safety boundary。 | 无。 | `bool`。 | false 禁止持久化 / projection / observation material。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn append(trace_entry_id: InteractionTraceEntryId, fact_ref: MemberCommittedFactRef, subject_ref: ProjectMemberRef, fact_kind: MemberFactKind, source_refs: Vec<TypedRef>, predecessor_refs: Vec<InteractionTraceEntryId>, purpose: InteractionPurpose, correlation: MemberCorrelation, recorded_at: Timestamp, policy: &TraceMaterialPolicy) -> Result<Self, DomainError>` | 从已提交 source fact 创建 immutable trace link。 | application 已验证 fact commit / source refs；policy 校验 correlation。 | trace entry 或 error。 | `MemberCommittedFactConsumer` trace phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| committed-only | 未提交 object、external payload、view / report、attempt-only memory 不能进入 `fact_ref`。 |
| append failure isolation | trace append 失败不能回滚 source fact；必须记录 `InteractionGap`。 |
| no evidence / log | trace 只记录 refs / safe categories，不是 observability backend、complete log 或 evidence verdict。 |

### 16.5 `InteractionGap`

##### `InteractionGap`

```rust
/// Records one append-only gap in a member interaction correlation chain.
pub struct InteractionGap {
    /// Local identity of this interaction gap.
    pub gap_id: InteractionGapId,
    /// Project-scoped subject affected by the gap.
    pub subject_ref: ProjectMemberRef,
    /// Expected family of the missing or conflicting committed fact.
    pub expected_ref_kind: MemberFactKind,
    /// Ordered unique references currently provable at the boundary.
    pub actual_refs: Vec<TypedRef>,
    /// Specific missing or conflicting relation category.
    pub category: InteractionGapCategory,
    /// Local gap lifecycle.
    pub status: InteractionGapStatus,
    /// Redacted explanation of the gap.
    pub safe_reason: SafeReasonCategory,
    /// Correlation of the affected interaction chain.
    pub correlation: MemberCorrelation,
    /// Formal resolution reference when a gap is explained.
    pub resolution_ref: Option<GapResolutionRef>,
    /// Member-local gap opening time.
    pub opened_at: Timestamp,
    /// Member-local resolution-link time.
    pub resolved_at: Option<Timestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gap_id` | `InteractionGapId` | local gap identity。 | application ID Port；successor 使用新 ID。 |
| `subject_ref` / `expected_ref_kind` | subject / closed kind | 固定受影响 chain 与 expected relation。 | expected kind 只用 `MemberFactKind`;不伪造 foreign owner type。 |
| `actual_refs` | `Vec<TypedRef>` | 保存当前可证明最小 refs。 | ordered-unique；可以为空只在 `MissingRef`；不保存推测 ref 或 body。 |
| `category` | `InteractionGapCategory` | 精确缺口分类。 | fixed enum；不能改为 string。 |
| `status` | `InteractionGapStatus` | local lifecycle。 | factory `Open` / `Blocked` / `Unknown` 由 source state确定；后续返回 successor。 |
| `safe_reason` | `SafeReasonCategory` | 低敏原因。 | 非空；不含 raw error / log。 |
| `correlation` | `MemberCorrelation` | 固定 affected chain。 | 来自 committed source / validated consumer metadata。 |
| `resolution_ref` / `resolved_at` | optional typed ref / time | 关联 formal gap explanation。 | `Resolved` 必填；不等于 source repaired。 |
| `opened_at` | `Timestamp` | local history time。 | Clock Port。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn request_resolution(&self, resolution_request_ref: ResolutionRequestRef) -> Result<Self, DomainError>` | 标记已发起对账。 | typed request ref。 | successor gap。 | `Open -> ResolutionPending`;不调用 resolver。 |
| `pub fn resolve(&self, resolution_ref: GapResolutionRef, resolved_at: Timestamp) -> Result<Self, DomainError>` | 链接 formal resolution。 | owner-validated ref、Clock。 | successor gap。 | transition to `Resolved`;不补造 source fact。 |
| `pub fn supersede(&self, successor_gap: &InteractionGap) -> Result<Self, DomainError>` | 连接后继缺口。 | same subject / correlation successor。 | successor record。 | preserves current history。 |
| `pub fn degrades_trace_read(&self) -> bool` | 判断 query / projection 是否应保守退化。 | 无。 | `bool`。 | non-resolved / unknown states return true;不写 projection。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(gap_id: InteractionGapId, subject_ref: ProjectMemberRef, expected_ref_kind: MemberFactKind, actual_refs: Vec<TypedRef>, category: InteractionGapCategory, status: InteractionGapStatus, safe_reason: SafeReasonCategory, correlation: MemberCorrelation, opened_at: Timestamp) -> Result<Self, DomainError>` | 从可证明现状建立 interaction gap。 | application 选择 non-positive initial status；Clock / ID from ports。 | gap 或 error。 | trace append failure / missing relation / ordering conflict。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no guessed correlation | 缺 ref 保持 `Open` / `Unknown`；不得用 body、time 或 route 反推。 |
| resolved is explanation | resolved 仅表示 formal ref 已说明 local gap，不代表 source fact 修复或 downstream success。 |
| immutable history | 不删除旧 gap；late / correction 以新 trace entry或 successor gap 表达。 |

### 16.6 `ObservationMaterial`

##### `ObservationMaterial`

```rust
/// Stores immutable low-sensitive, low-cardinality, body-free material for an observation handoff.
pub struct ObservationMaterial {
    /// Local identity of this observation material.
    pub observation_material_id: ObservationMaterialId,
    /// Project-scoped subject summarized by the material.
    pub subject_ref: ProjectMemberRef,
    /// Ordered unique trace links included in the material.
    pub trace_refs: Vec<InteractionTraceEntryId>,
    /// Ordered unique interaction gaps exposed by the material.
    pub gap_refs: Vec<InteractionGapId>,
    /// Ordered unique low-sensitive observation categories.
    pub categories: Vec<ObservationCategory>,
    /// Ordered unique low-cardinality dimensions.
    pub safe_dimensions: Vec<SafeDimension>,
    /// Formal redaction-profile reference.
    pub redaction_profile_ref: RedactionProfileRef,
    /// Digest of the allowed observation surface.
    pub material_digest: Digest,
    /// Correlation carried into the observation attempt.
    pub correlation: MemberCorrelation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `observation_material_id` | `ObservationMaterialId` | immutable material identity。 | application ID Port；不以 backend key / run ID 命名。 |
| `subject_ref` | `ProjectMemberRef` | 固定成员主语。 | 所有 trace/gap 必须匹配该 subject。 |
| `trace_refs` / `gap_refs` | `Vec<...Id>` | 最小 committed trace / gap links。 | ordered-unique；至少一个 trace 或 gap；不得复制 trace body。 |
| `categories` | `Vec<ObservationCategory>` | 低敏类别。 | ordered-unique、非空；formal policy / local committed state 派生。 |
| `safe_dimensions` | `Vec<SafeDimension>` | 低基数维度。 | ordered by name, unique name；不用 `Map<String,String>`；不含 arbitrary labels。 |
| `redaction_profile_ref` | `RedactionProfileRef` | 连接裁剪依据。 | formal safe ref；不持有 profile body。 |
| `material_digest` | `Digest` | 绑定 allowed surface。 | application Digest Port 仅对允许 surface 计算。 |
| `correlation` | `MemberCorrelation` | 连接 trace / handoff。 | 由 trace/gap一致性校验得到；不得新建。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_body_free(&self) -> bool` | 验证无正文、secret、hidden reasoning 或 complete log。 | 无。 | `bool`。 | false 禁止 handoff / persistence。 |
| `pub fn is_low_cardinality(&self) -> bool` | 验证 category / dimensions 受控。 | 无。 | `bool`。 | 不依赖 backend taxonomy。 |
| `pub fn matches_trace(&self, trace_entries: &[InteractionTraceEntry], gaps: &[InteractionGap]) -> bool` | 校验 subject、refs、correlation。 | loaded local support facts。 | `bool`。 | 纯函数；不读取 full log。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(observation_material_id: ObservationMaterialId, subject_ref: ProjectMemberRef, trace_entries: &[InteractionTraceEntry], gaps: &[InteractionGap], categories: Vec<ObservationCategory>, safe_dimensions: Vec<SafeDimension>, redaction_profile_ref: RedactionProfileRef, material_digest: Digest, correlation: MemberCorrelation, policy: &TraceMaterialPolicy) -> Result<Self, DomainError>` | 从 committed trace / gap 建立安全 material。 | all inputs loaded/derived by application; policy validates body/cardinality. | material or error。 | `ObservationRelayJob` preparation phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no observability ownership | material 不包含 backend schema、retention、metric log、evidence、verdict 或 report。 |
| no full body | raw event、model/tool response、secret、complete log 均禁止。 |
| no observed status | material prepared 不代表 backend ingest、stored、observed或 queryable。 |

### 16.7 `ObservationAttempt`

##### `ObservationAttempt`

```rust
/// Records one append-only local attempt to invoke a formal observation boundary.
pub struct ObservationAttempt {
    /// Local identity of this observation attempt.
    pub attempt_id: ObservationAttemptId,
    /// Immutable observation material selected for the attempt.
    pub material_ref: ObservationMaterialId,
    /// Formal observation boundary selected by neutral resolution.
    pub observation_boundary_ref: ObservationBoundaryRef,
    /// Local observation invocation posture.
    pub status: ObservationAttemptStatus,
    /// Idempotency key for this side-effect candidate.
    pub idempotency_key: IdempotencyKey,
    /// Formal or local submission carrier after invocation.
    pub submission_ref: Option<ObservationSubmissionRef>,
    /// Formal observation feedback reference when linked.
    pub feedback_ref: Option<ObservationFeedbackRef>,
    /// Redacted reason for blocked or unknown posture.
    pub safe_reason: Option<SafeReasonCategory>,
    /// Member-local invocation time.
    pub attempted_at: Option<Timestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `attempt_id` | `ObservationAttemptId` | local attempt identity。 | application ID Port；new attempt never overwrites old one. |
| `material_ref` | `ObservationMaterialId` | 回链 safe material。 | 必须已 committed 且 body-free。 |
| `observation_boundary_ref` | `ObservationBoundaryRef` | formal seam identity。 | CP06 observation resolution 供给；backend / route未闭口则不可 positive invoke。 |
| `status` | `ObservationAttemptStatus` | local invocation status。 | factory `Prepared`; successor on transition。 |
| `idempotency_key` | `IdempotencyKey` | duplicate / unknown fence。 | Job / continuation metadata；不从 material digest / time推导。 |
| `submission_ref` / `feedback_ref` | `Option<...>` | 连接 invocation / feedback。 | submitted requires submission; feedback-linked requires feedback; no body copy. |
| `safe_reason` | `Option<SafeReasonCategory>` | blocked / unknown reason。 | required for those states; not adapter exception text. |
| `attempted_at` | `Option<Timestamp>` | local seam call time。 | Clock Port；not backend observed time. |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_submitted(&self, submission_ref: ObservationSubmissionRef, attempted_at: Timestamp) -> Result<Self, DomainError>` | 记录 seam invocation。 | typed ref、Clock。 | successor attempt。 | `Prepared -> Submitted`;not observed. |
| `pub fn link_feedback(&self, feedback_ref: ObservationFeedbackRef) -> Result<Self, DomainError>` | 追加 formal feedback ref。 | owner-validated ref。 | successor attempt。 | `Submitted -> FeedbackLinked`;不改 trace。 |
| `pub fn mark_blocked(&self, safe_reason: SafeReasonCategory) -> Result<Self, DomainError>` | 记录调用前阻断。 | safe reason。 | successor attempt。 | `Prepared -> Blocked`;no seam call. |
| `pub fn mark_unknown(&self, safe_reason: SafeReasonCategory) -> Result<Self, DomainError>` | 建立 unknown fence。 | safe reason。 | successor attempt。 | `Prepared / Submitted -> Unknown`;no blind replay. |
| `pub fn is_retry_safe(&self, evidence: &ObservationResolutionEvidence) -> bool` | 判断能否评估 new attempt。 | original-key formal evidence。 | `bool`。 | true not retry authorization. |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn prepare(attempt_id: ObservationAttemptId, material: &ObservationMaterial, observation_boundary_ref: ObservationBoundaryRef, idempotency_key: IdempotencyKey) -> Result<Self, DomainError>` | 从 safe material 创建 prepared attempt。 | formal boundary ref由 application resolution提供。 | prepared attempt or error。 | `ObservationRelayJob` local-first phase。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no observed truth | submitted / feedback-linked 都不代表 backend delivered、ingested、stored、observed 或 queryable。 |
| append-only | later attempt / feedback creates successor, never mutates trace / material. |
| fence | unknown waits for exact evidence; timer/fake/scheduler cannot silently retry. |

### 16.8 `TraceMaterialPolicy`

##### `TraceMaterialPolicy`

```rust
/// Guards committed-only tracing and low-sensitive observation handoff material.
pub struct TraceMaterialPolicy {
    /// Requirement that a traced fact is locally committed.
    pub source_requirement: CommittedMemberFactRequirement,
    /// Rule minimizing trace and material references.
    pub reference_minimization_rule: ReferenceMinimizationRule,
    /// Boundary rejecting forbidden body content.
    pub body_boundary: ForbiddenBodyBoundary,
    /// Rule enforcing low-cardinality observation categories and dimensions.
    pub cardinality_rule: ObservationCardinalityRule,
    /// Rule validating subject, purpose, and correlation continuity.
    pub correlation_rule: TraceCorrelationRule,
    /// Conservative handling of unresolved observation boundaries.
    pub unknown_handling: UnknownHandlingMode,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_requirement` | `CommittedMemberFactRequirement` | 强制 committed-only source。 | local invariant；不允许 external event / view作为 trace fact。 |
| `reference_minimization_rule` | `ReferenceMinimizationRule` | 约束最小 refs。 | 不将 log、body、untyped label加入 trace。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 防止正文进入 trace / material。 | fixed architecture invariant。 |
| `cardinality_rule` | `ObservationCardinalityRule` | 防止高基数 tags。 | no arbitrary Map / labels。 |
| `correlation_rule` | `TraceCorrelationRule` | 校验 chain consistency。 | 不通过时间 / route猜关联。 |
| `unknown_handling` | `UnknownHandlingMode` | observation seam unknown fence。 | factory fixed `FailClosed`。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_trace_source(&self, fact_ref: &MemberCommittedFactRef, source_refs: &[TypedRef]) -> Result<(), DomainError>` | 验证 committed source 与最小 refs。 | typed local fact / refs。 | success or error。 | 不读取 source body。 |
| `pub fn validate_correlation(&self, subject_ref: &ProjectMemberRef, purpose: InteractionPurpose, correlation: &MemberCorrelation, predecessors: &[InteractionTraceEntry]) -> Result<(), DomainError>` | 验证 chain continuity。 | typed subject/purpose/correlation/predecessors。 | success or error。 | 不创建 trace。 |
| `pub fn validate_observation(&self, categories: &[ObservationCategory], safe_dimensions: &[SafeDimension], inspection: &ForbiddenBodyInspection) -> Result<(), DomainError>` | 执行 low-sensitive / cardinality / body gate。 | safe inputs only。 | success or error。 | no backend query. |
| `pub fn evaluate_handoff(&self, material: &ObservationMaterial, observation_resolution: &ExternalContextResolution) -> bool` | 判断 observation seam 可否由 application 准备。 | immutable material / neutral resolution。 | `bool`。 | true is not observed success. |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn minimal_low_sensitive_only() -> Self` | 创建 committed-only、body-free、low-cardinality、fail-closed policy。 | 无。 | fixed policy。 | interaction trace service construction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no backend schema | policy 不定义 observability backend、retention、metric name、query、archive或 adapter。 |
| no evidence generation | trace / material / attempt 不能生成 evidence、verdict、report或 readiness。 |
| no source mutation | observation outcome 不能重裁或回写 CP01~04 source facts。 |

### 16.9 CP05 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP05 五对象均有 capability、字段、factory 和成员函数 | pass_for_current_step | trace、gap、material、attempt、policy均独立闭合。 |
| committed-only / append isolation | pass | trace failure只形成 gap，不回滚 CP01~04 committed fact。 |
| observation truth separation | pass | material / attempt只记录 local posture和refs，不声明 backend observed。 |
| body / low-cardinality boundary | pass | raw body、complete log、secret、provider text、evidence均排除。 |
| Step 7 / 8 承接 | ready_for_CP06 | Step 7需 trace / observation / resolution ports；Step 8需 committed-fact / feedback Consumer、Query和relay Job。 |

## 17. `domain` CP06：External Context Mirror

### 17.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 固定某一 owner-safe 输入的 member-side 时点依据 | owner-bound external ref、scope、version / digest、safe category、freshness evidence | immutable body-free snapshot | 每次 refresh 建立新 snapshot；不覆盖旧 snapshot | `ExternalContextSnapshot`、`MirrorResolutionPolicy` | Step 7 owner-specific source Port / mirror Store；Step 8 source-update Consumer。 |
| 针对一个 consumer purpose 判断来源是否足以进入本地 policy | snapshot、required scope、freshness evidence、purpose | neutral resolution | resolved / stale / conflict / unresolved / unavailable / unknown；不写 foreign truth | `ExternalContextResolution`、`MirrorResolutionPolicy` | Step 7 resolver / Store；Step 8 resolve Command、Query。 |
| 显式保留缺 source、合同未闭合、过期、冲突或 owner 不可用 | typed source ref（若已知）、purpose、scope、已有 resolution、safe reason | append-only gap / successor | open / blocked / pending / resolved / unknown / superseded | `ExternalContextGap` | Step 7 refresh / continuation Port；Step 8 refresh Command、Consumer、Job。 |
| 保护 owner、scope、freshness、冲突、body-free 与 purpose isolation | body-free object candidates / loaded local support facts | policy result或 domain rejection | 无 I/O、无 owner truth 写入 | `MirrorResolutionPolicy` | Step 7 source Port result contract；Step 9 resolve / refresh flow。 |

### 17.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ExternalContextSnapshot` | 保存某个 external source 的最小、immutable 时点依据 | support fact | owner/ref/scope/freshness/body gate | 不保存 policy、credential、definition、Runtime、host、Tool / Method、route 或外部正文。 |
| `ExternalContextResolution` | 给一个 declared purpose / scope 形成中性消费结论 | support truth | scope matching、freshness classification、fail-closed gate | 不产生 authorization、health、availability、acceptance 或 invocation truth。 |
| `ExternalContextGap` | 记录 source / mapping / seam 不充分及其 local continuation | append-only support truth | request / resolution / successor relation | 不默认补 source、不删除旧 snapshot、不把 local gap 关闭解释为外部修复。 |
| `MirrorResolutionPolicy` | 保护 Mirror anti-corruption boundary | policy / guard | owner-specific、body-free、purpose-isolated、conflict-aware | 不成为 generic resolver hub、capability registry 或 provider adapter。 |

### 17.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `ExternalContextSnapshot` | 固定 safe point-in-time support fact | ID、external ref / owner、kind、version / digest、scope、categories、freshness、inspection、captured time | `capture(...)` | `matches_scope`、`matches_source`、`is_body_free` | immutable | owner-specific safe result、Clock、application ID。 |
| `ExternalContextResolution` | 对 purpose / scope 给出 neutral sufficiency | ID、source / snapshot ref、purpose、required scope、status、reason、source version、resolved time | `resolve(...)` | `usable_for`、`requires_fail_closed`、`is_authorization_result` | `ExternalContextResolutionStatus` | snapshot、freshness evidence、policy evaluation、Clock、ID。 |
| `ExternalContextGap` | 显式保存 unresolved / pending / successor relation | ID、optional source、kind、purpose、scope、resolution / refresh / successor refs、category、status、reason、times | `open(...)` | `request_refresh`、`resolve`、`supersede`、`blocks_consumer` | `ExternalContextGapStatus` | failed / missing source facts、application ID、Clock、formal resolution / refresh ref。 |
| `MirrorResolutionPolicy` | 评估 capture / freshness / resolution / refresh boundary | owner、scope、freshness、conflict、body、purpose rules | `owner_specific_fail_closed()` | `validate_snapshot`、`evaluate_freshness`、`evaluate_resolution`、`requires_new_snapshot` | 无独立 state | architecture invariant；不可由 config 放宽。 |

### 17.4 CP06 state / evaluation support values

下面的 value 只承接 Mirror policy 的确定输入 / 输出；它们不是 foreign owner schema，也不让 application 用错误字符串决定 resolution 状态。

```rust
/// Carries the body-free outcome of a Mirror resolution evaluation.
pub struct MirrorResolutionEvaluation {
    /// Neutral source sufficiency classification selected by the policy.
    pub status: ExternalContextResolutionStatus,
    /// Redacted explanation when the classification is not resolved.
    pub safe_reason: Option<SafeReasonCategory>,
}
```

| 类型 / 变体组 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ExternalContextResolutionStatus::{Resolved,Stale,Conflict,Unresolved,Unavailable,Unknown}` | 见 §11.5 的 enum 定义。 | 描述 source 对单一 purpose / scope 的中性充分性。 | `MirrorResolutionPolicy` 的 `evaluate_resolution`；owner-safe source result 只能作为输入而不是直接状态。 | consumer domain policy、gap、read projection；不得变成 authorization / health / availability。 |
| `ExternalContextGapCategory::{SourceMissing,ContractPending,Stale,Conflict,OwnerUnavailable,MappingUnknown}` | 见 §11.5 的 enum 定义。 | 描述 gap 的明确类别。 | failed source validation、owner contract blocker、freshness / conflict evaluation。 | `ExternalContextGap`、diagnostic / projection surface。 |
| `ExternalContextGapStatus::{Open,Blocked,ResolutionPending,Resolved,Unknown,Superseded}` | 见 §11.5 的 enum 定义。 | 描述 local gap lifecycle。 | `ExternalContextGap` factory / successor method。 | refresh job、consumer fail-closed surface、projection；不是 external source lifecycle。 |
| `MirrorResolutionEvaluation` | `Carries the body-free outcome of a Mirror resolution evaluation.` | 将 policy 输出绑定为 status + safe reason。 | pure `MirrorResolutionPolicy` evaluation。 | `ExternalContextResolution::resolve`；不得由 Port / adapter 异常文本直接构造。 |

`Resolved` 必须伴随 `safe_reason = None`；所有非 `Resolved` status 必须带非空 `safe_reason`。该值只证明 **本仓可把来源交给指定 consumer policy 继续判断**，不代表该 consumer 已获授权或将采取正向动作。

### 17.5 `ExternalContextSnapshot`

##### `ExternalContextSnapshot`

```rust
/// Stores one immutable, body-free point-in-time input from a formal external owner.
pub struct ExternalContextSnapshot {
    /// Local identity of this immutable snapshot.
    pub snapshot_id: ExternalContextSnapshotId,
    /// External identity whose owner-safe surface was captured.
    pub source_ref: ExternalTypedRef,
    /// Formal owner expected to interpret the external reference.
    pub source_owner: ExternalOwnerRef,
    /// Safe category of external context being consumed.
    pub context_kind: ExternalContextKind,
    /// Optional owner-supplied version anchor.
    pub source_version: Option<SourceVersion>,
    /// Optional digest of an explicitly allowed safe surface.
    pub source_digest: Option<Digest>,
    /// Exact subject, purpose, and optional boundary scope for this capture.
    pub scope: ExternalContextScope,
    /// Ordered unique, non-empty safe categories retained from the source.
    pub safe_categories: Vec<ExternalContextCategory>,
    /// Owner-supplied freshness evidence accepted at capture time.
    pub freshness_evidence: SourceFreshnessEvidence,
    /// Result of the transient body-boundary inspection.
    pub body_inspection: ForbiddenBodyInspection,
    /// Member-local time at which the safe surface was captured.
    pub captured_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `snapshot_id` | `ExternalContextSnapshotId` | snapshot local identity。 | application 经 `MemberIdGeneratorPort` 生成；refresh / duplicate capture 都不得覆用已有 ID。 |
| `source_ref` / `source_owner` | `ExternalTypedRef` / `ExternalOwnerRef` | 固定 foreign identity 与其解释 owner。 | 只由 owner-specific source Port 或 validated Consumer 提供；owner kind 必须匹配，不能以 URL、route、token 或 display name 替代。 |
| `context_kind` | `ExternalContextKind` | 限定 snapshot 的安全用途类别。 | named source update / resolve use case 提供；不成为 generic provider tag。 |
| `source_version` / `source_digest` | `Option<SourceVersion>` / `Option<Digest>` | 保存 owner supplied version / allowed-surface integrity anchor。 | 只能来自 formal safe result；均不能替代 local Store version、projection watermark 或 freshness proof。 |
| `scope` | `ExternalContextScope` | 固定 snapshot 可被使用的 subject / purpose / boundary。 | application 从 Command / Consumer 与 source resolution 明确构造；不可由 opaque ref、route 或 config 推断。 |
| `safe_categories` | `Vec<ExternalContextCategory>` | 保存最小、安全的 source classification。 | ordered-unique、non-empty；仅 policy / owner safe mapping 供给，不复制 body / definition / policy text。 |
| `freshness_evidence` | `SourceFreshnessEvidence` | 保留 source currentness 的依据。 | only owner version、owner timestamp或 formal receipt；local capture time 不可冒充 owner currentness。 |
| `body_inspection` | `ForbiddenBodyInspection` | 固定持久化前 body-free gate。 | must be `Clean`；`Rejected` 只能形成 gap / rejection，不得保存 snapshot。 |
| `captured_at` | `Timestamp` | local capture history time。 | Clock Port 提供；不是 source update time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_scope(&self, required_scope: &ExternalContextScope) -> bool` | 验证该 immutable snapshot 是否覆盖 requested scope。 | named required scope。 | `bool`。 | 纯函数；purpose、subject 与 present boundary 必须匹配，不能用 broader local guess 放宽。 |
| `pub fn matches_source(&self, source_ref: &ExternalTypedRef, source_owner: &ExternalOwnerRef) -> bool` | 验证 source identity / owner pairing。 | owner-bound typed inputs。 | `bool`。 | 纯函数；不读取 foreign object。 |
| `pub fn is_body_free(&self) -> bool` | 检查 snapshot 只含允许的 refs / metadata。 | 无。 | `bool`。 | `body_inspection == Clean` 且没有外部正文才为真；真不表示 source accepted / authorized。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(snapshot_id: ExternalContextSnapshotId, source_ref: ExternalTypedRef, source_owner: ExternalOwnerRef, context_kind: ExternalContextKind, source_version: Option<SourceVersion>, source_digest: Option<Digest>, scope: ExternalContextScope, safe_categories: Vec<ExternalContextCategory>, freshness_evidence: SourceFreshnessEvidence, body_inspection: ForbiddenBodyInspection, captured_at: Timestamp, policy: &MirrorResolutionPolicy) -> Result<Self, DomainError>` | 将 owner-safe response 固化为一个 immutable support fact。 | all external inputs already translated by an owner-specific application boundary；ID / Clock 来自 ports。 | snapshot or invariant error。 | `ResolveExternalContext`、owner-specific source-update Consumer、refresh Job。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| immutable refresh | source change / refresh 必须新建 snapshot；不得以同一 `snapshot_id` 覆盖 version、digest、scope 或 category。 |
| foreign truth separation | snapshot 不是 external object copy；不得保存 credential、policy / approval、Runtime run / plan / outcome、host session、Tool / Method definition、route、payload、secret、log 或 provider body。 |
| source current separation | `captured_at` 与 `source_version` 语义不同；没有 freshness evidence 时只能形成 unresolved / unknown resolution。 |

### 17.6 `ExternalContextResolution`

##### `ExternalContextResolution`

```rust
/// Records an immutable neutral conclusion about source sufficiency for one consumer purpose and scope.
pub struct ExternalContextResolution {
    /// Local identity of this neutral resolution record.
    pub resolution_id: ExternalContextResolutionId,
    /// External source evaluated by the resolution.
    pub source_ref: ExternalTypedRef,
    /// Immutable snapshot used as the local point-in-time basis when one was available.
    pub snapshot_ref: Option<ExternalContextSnapshotId>,
    /// Consumer purpose for which the source was evaluated.
    pub consumer_purpose: ExternalConsumerPurpose,
    /// Scope the consuming policy requires.
    pub required_scope: ExternalContextScope,
    /// Neutral source-sufficiency status.
    pub status: ExternalContextResolutionStatus,
    /// Redacted reason when a positive neutral resolution cannot be proven.
    pub safe_reason: Option<SafeReasonCategory>,
    /// Source version copied from the selected snapshot when present.
    pub source_version: Option<SourceVersion>,
    /// Member-local time at which this conclusion was formed.
    pub resolved_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `resolution_id` | `ExternalContextResolutionId` | local resolution identity。 | application ID Port；new evaluation produces new ID，不覆盖旧结论。 |
| `source_ref` / `snapshot_ref` | `ExternalTypedRef` / `Option<ExternalContextSnapshotId>` | 连接 external source 与 local capture basis。 | `Resolved` 必须有 matching committed snapshot；other status may have none，但不得伪造 snapshot ref。 |
| `consumer_purpose` / `required_scope` | `ExternalConsumerPurpose` / `ExternalContextScope` | 固定本次中性判断的用途与范围。 | factory input；不得跨 purpose reuse，也不得将 broad scope 转为 narrow proof。 |
| `status` / `safe_reason` | status enum / optional safe category | 显式判断 source sufficiency。 | 只能来自 `MirrorResolutionPolicy` evaluation；`Resolved` reason must be `None`，其他状态 reason must be `Some`。 |
| `source_version` | `Option<SourceVersion>` | 回链 resolution 的 source version anchor。 | only matching snapshot / owner safe result；不是 local optimistic version。 |
| `resolved_at` | `Timestamp` | local conclusion time。 | Clock Port；不是 owner acceptance / health time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn usable_for(&self, consumer_purpose: ExternalConsumerPurpose, required_scope: &ExternalContextScope) -> bool` | 判断 resolution 是否可作为一个 local policy 的中性输入。 | requested purpose / scope。 | `bool`。 | 仅 `Resolved` 且 purpose / scope exact match；真不授权下游 action。 |
| `pub fn requires_fail_closed(&self) -> bool` | 判断是否禁止 positive local path。 | 无。 | `bool`。 | `Stale`、`Conflict`、`Unresolved`、`Unavailable`、`Unknown` 为真。 |
| `pub fn is_authorization_result(&self) -> bool` | 防止 caller 将 neutral resolution 升格。 | 无。 | `bool`。 | 永远为 false。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn resolve(resolution_id: ExternalContextResolutionId, source_ref: ExternalTypedRef, snapshot: Option<&ExternalContextSnapshot>, consumer_purpose: ExternalConsumerPurpose, required_scope: ExternalContextScope, freshness_evidence: SourceFreshnessEvidence, resolved_at: Timestamp, policy: &MirrorResolutionPolicy) -> Result<Self, DomainError>` | 基于 owner-safe snapshot 与 declared scope 形成 purpose-specific neutral resolution。 | snapshot may be absent only for fail-closed evaluation；policy creates exact status / safe reason。 | resolution or invariant error。 | resolve Command、source-update Consumer、refresh Job。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no cross-purpose reuse | `Startup`、`Screening`、`RuntimeEntry`、`Outbound`、`Observation`、`Projection` 必须逐 purpose / scope 再评价；不能把一个 `Resolved` 复制为另一用途。 |
| resolved is neutral | `Resolved` 不是 Governance approval、host health、Runtime entry acceptance、Tool availability、provider reachable、downstream delivery / observed。 |
| immutable conclusion | new source version、new evidence 或 conflict 必须产生新 resolution / gap；不得原地把 stale / unknown 改成 resolved。 |

### 17.7 `ExternalContextGap`

##### `ExternalContextGap`

```rust
/// Records one append-only local gap between a member consumer requirement and available external context.
pub struct ExternalContextGap {
    /// Local identity of this gap record.
    pub gap_id: ExternalContextGapId,
    /// Known external source when the missing source can be named safely.
    pub source_ref: Option<ExternalTypedRef>,
    /// Safe family of context affected by the gap.
    pub context_kind: ExternalContextKind,
    /// Member consumer purpose blocked or degraded by the gap.
    pub consumer_purpose: ExternalConsumerPurpose,
    /// Scope required by the affected consumer.
    pub required_scope: ExternalContextScope,
    /// Neutral resolution that exposed or later explained the gap.
    pub resolution_ref: Option<ExternalContextResolutionId>,
    /// Formal refresh request linked while resolution is pending.
    pub refresh_request_ref: Option<ExternalRefreshRequestRef>,
    /// Successor local gap when this record was superseded.
    pub successor_gap_ref: Option<ExternalContextGapId>,
    /// Precise source-insufficiency category.
    pub category: ExternalContextGapCategory,
    /// Local gap lifecycle.
    pub status: ExternalContextGapStatus,
    /// Redacted reason for the local gap posture.
    pub safe_reason: SafeReasonCategory,
    /// Member-local time at which the gap was opened.
    pub opened_at: Timestamp,
    /// Member-local time at which a neutral resolution was linked.
    pub resolved_at: Option<Timestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gap_id` | `ExternalContextGapId` | local gap identity。 | application ID Port；successor has a new ID。 |
| `source_ref` | `Option<ExternalTypedRef>` | 记录已知 external target。 | `SourceMissing` may be `None`;其他 category 若 known 必须保留 typed ref，不能以 string 猜测。 |
| `context_kind` / `consumer_purpose` / `required_scope` | context / purpose / scope values | 固定受影响 consumer contract。 | source evaluation / explicit Command input；不得从 gap title、queue、route 或 config 推断。 |
| `resolution_ref` | `Option<ExternalContextResolutionId>` | 连接暴露或解释缺口的 local resolution。 | `Resolved` 必须 `Some`；不表示 external repair。 |
| `refresh_request_ref` | `Option<ExternalRefreshRequestRef>` | 连接受控 refresh request。 | `ResolutionPending` 必须 `Some`；不存在即不得假称已开始 refresh。 |
| `successor_gap_ref` | `Option<ExternalContextGapId>` | 保留 supersession history。 | `Superseded` 必须 `Some` 且 successor scope / purpose match。 |
| `category` / `status` / `safe_reason` | finite enums / safe category | 表达具体缺口及 local lifecycle。 | factory / successor policy;safe reason non-empty and body-free。 |
| `opened_at` / `resolved_at` | `Timestamp` / optional time | local history time。 | Clock Port；`Resolved` requires `resolved_at`，其他状态 must not synthesize closure time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn request_refresh(&self, refresh_request_ref: ExternalRefreshRequestRef) -> Result<Self, DomainError>` | 建立一个 pending successor after a formal refresh request was accepted locally。 | typed request ref。 | successor gap。 | only `Open / Blocked -> ResolutionPending`;does not call a resolver or declare a refresh result。 |
| `pub fn resolve(&self, resolution_ref: ExternalContextResolutionId, resolved_at: Timestamp) -> Result<Self, DomainError>` | 链接一个 new neutral resolution。 | committed local resolution ID、Clock。 | successor gap。 | only when application verified same purpose / scope;`Resolved` only closes the local gap relation。 |
| `pub fn supersede(&self, successor_gap_ref: ExternalContextGapId) -> Result<Self, DomainError>` | 将当前 gap 的处理责任交给一个 successor gap。 | typed successor ID。 | successor gap。 | preserves history;does not delete old snapshot or gap。 |
| `pub fn blocks_consumer(&self, consumer_purpose: ExternalConsumerPurpose) -> bool` | 判断受影响 purpose 是否必须 fail closed / stay pending。 | purpose。 | `bool`。 | only matching non-resolved gap can block;does not make an authorization decision。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(gap_id: ExternalContextGapId, source_ref: Option<ExternalTypedRef>, context_kind: ExternalContextKind, consumer_purpose: ExternalConsumerPurpose, required_scope: ExternalContextScope, resolution_ref: Option<ExternalContextResolutionId>, category: ExternalContextGapCategory, initial_status: ExternalContextGapStatus, safe_reason: SafeReasonCategory, opened_at: Timestamp) -> Result<Self, DomainError>` | 从可证明缺失、冲突、过期或未闭口 contract 建立 gap。 | application passes only `Open` / `Blocked` / `Unknown` as initial status;ID / Clock are port supplied。 | gap or invariant error。 | resolve Command、source-update Consumer、refresh Job、blocked seam result。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| explicit lifecycle | `ResolutionPending` 必须有 refresh request；`Resolved` 必须有 local resolution + time；`Superseded` 必须有 successor；不得以 bool / null 伪装这些状态。 |
| no default source truth | `source_ref = None` 必须保持 source-missing / blocked / unknown 语义；不从 subject、route、last snapshot、timestamp 或 fake map 补 source。 |
| no foreign repair claim | gap resolved 仅表明新的 neutral resolution 被关联；外部 owner truth、contract、health、authorization、delivery仍由其 owner 持有。 |

### 17.8 `MirrorResolutionPolicy`

##### `MirrorResolutionPolicy`

```rust
/// Guards owner-specific, body-free, purpose-isolated external-context consumption.
pub struct MirrorResolutionPolicy {
    /// Requires every external reference to be interpreted by its formal owner.
    pub owner_requirement: FormalOwnerRequirement,
    /// Requires snapshot and resolution scope to match the consumer request.
    pub scope_rule: ExternalScopeRule,
    /// Requires owner-supplied freshness evidence.
    pub freshness_rule: ExternalFreshnessRule,
    /// Rejects silent selection among conflicting source facts.
    pub conflict_rule: SourceConflictRule,
    /// Rejects forbidden external body categories before persistence.
    pub body_boundary: ForbiddenBodyBoundary,
    /// Prevents one consumer purpose from reusing another purpose's resolution.
    pub purpose_isolation_rule: ConsumerPurposeIsolationRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `owner_requirement` | `FormalOwnerRequirement` | 限制 ref 的解释 owner。 | fixed domain invariant;owner kind mismatch is rejected / blocked。 |
| `scope_rule` | `ExternalScopeRule` | 禁止 scope widening / cross-subject reuse。 | fixed invariant;boundary absent 与 boundary mismatch 必须区分。 |
| `freshness_rule` | `ExternalFreshnessRule` | 要求 owner evidence 而非 local time。 | fixed invariant;missing proof becomes non-positive status。 |
| `conflict_rule` | `SourceConflictRule` | 禁止静默选择多个冲突来源之一。 | fixed invariant;conflict remains explicit。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 将 foreign body 排除在 Mirror 之外。 | fixed invariant;config cannot disable it。 |
| `purpose_isolation_rule` | `ConsumerPurposeIsolationRule` | 禁止 cross-purpose resolution reuse。 | fixed invariant;consumer must request its own purpose / scope evaluation。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_snapshot(&self, source_ref: &ExternalTypedRef, source_owner: &ExternalOwnerRef, scope: &ExternalContextScope, safe_categories: &[ExternalContextCategory], inspection: &ForbiddenBodyInspection) -> Result<(), DomainError>` | 验证 capture input 的 owner、scope、category 和 body boundary。 | only body-free carrier values。 | success or domain error。 | pure;empty / duplicate category、owner mismatch 或 non-clean inspection are rejected。 |
| `pub fn evaluate_freshness(&self, snapshot: &ExternalContextSnapshot, evidence: &SourceFreshnessEvidence) -> MirrorResolutionEvaluation` | 比较 snapshot 与 owner-supplied freshness evidence。 | immutable snapshot、new evidence。 | evaluation。 | pure;never reads owner body or local adapter state。 |
| `pub fn evaluate_resolution(&self, snapshot: Option<&ExternalContextSnapshot>, consumer_purpose: ExternalConsumerPurpose, required_scope: &ExternalContextScope, freshness_evidence: &SourceFreshnessEvidence) -> MirrorResolutionEvaluation` | 形成 purpose-specific neutral result。 | optional local snapshot、declared purpose / scope、freshness evidence。 | evaluation。 | missing snapshot / mismatch / conflict remain fail-closed；does not authorize an action。 |
| `pub fn requires_new_snapshot(&self, existing_snapshot: &ExternalContextSnapshot, source_change: &SourceChangeEvidence) -> bool` | 判断 refresh 是否必须追加 snapshot。 | current immutable snapshot、owner change evidence。 | `bool`。 | pure;true creates no snapshot by itself。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn owner_specific_fail_closed() -> Self` | 创建不允许 generic fallback 的 fixed Mirror guard。 | 无。 | fixed policy。 | `ExternalContextMirrorService` construction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| owner-specific only | Step 7 必须为 Work / Identity、Governance、Runtime、Tools / Method、host / route 等 named source family 定义独立 Port；本 policy 绝不接受 arbitrary provider / registry input。 |
| no business truth | policy 不产生 authorization、approval、health、acceptance、availability、delivery、invocation或execution truth。 |
| blocker preservation | `L2M-UP-001/003/004/006/007/008` 未闭合时，policy 只能得到 `Blocked` / `Unresolved` / `Unknown` related gap；不得以 default ref / fake success 形成 `Resolved`。 |

### 17.9 CP06 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP06 四对象均有 capability、字段、factory 与成员函数 | pass_for_current_step | snapshot、resolution、gap、policy 已独立成卡；`MirrorResolutionEvaluation` 关闭 policy output 形态。 |
| snapshot / resolution / gap 分层 | pass | refresh creates new immutable snapshot / resolution / gap successor；无 in-place foreign-state overwrite。 |
| owner / scope / freshness / body gate | pass_with_upstream_blockers | exact owner schema仍受 `L2M-UP-001/003/004/006/007` 限制，但 local carrier和fail-closed path已闭合。 |
| neutral semantics | pass | `Resolved` 不等于 authorized / healthy / accepted / available / invocable。 |
| Step 7 / 8 承接 | ready_for_CP07 | Step 7须定义 owner-specific source、mirror Store、refresh request Port；Step 8须定义 resolve / refresh DTO、five source Consumer、Query和Job schema。 |

## 18. `contracts` / `domain` CP07：Member Read Model

### 18.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 从 CP01~06 committed refs 派生 member 可见摘要 | committed fact refs、neutral resolutions、双锚、watermark | immutable `MemberSummaryView` | revision-only；Query 无写 | `MemberSummaryView` | Step 7 read ports；Step 8 `GetMemberSummary`；Step 9 projection flow。 |
| 派生成员能力出口的安全引用面 | capability safe refs、activation、resolution / gap、watermark | immutable `CapabilityOutletView` | available / not-available / stale / gap；不授权调用 | `CapabilityOutletView` | Step 7 source read / projection Store；Step 8 outlet Query / event。 |
| 记录每种 projection 的 freshness、watermark、rebuild 与 gap | subject、projection kind、activation、committed source position | `MemberProjectionState` | current / stale / rebuilding / degraded / failed / disabled / unknown | `MemberProjectionState` | Step 7 projection Store；Step 8 update Consumer / rebuild Job；Step 9 state flow。 |
| 为维护 / operator 提供低敏诊断面 | committed trace / gaps、resolutions、safe explanations | optional `MemberDiagnosticView` | immutable revision；缺失不阻塞核心摘要 | `MemberDiagnosticView` | Step 7 diagnostic read；Step 8 diagnostics Query；Step 9 rebuild flow。 |
| 保护 projection source、visibility、freshness、body-free、no-write 与 outlet non-authorizing | actor、visibility basis、source refs、view candidates | policy result / serve disposition | 无业务生命周期、无 I/O | `ReadProjectionPolicy` | Step 7 visibility / read / projection ports；Step 8 Query response；Step 9 no-write flow。 |

### 18.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `MemberSummaryView` | member 在场、交互与安全 Runtime posture 的可见摘要 | immutable rebuildable view | body-free summary、freshness、visibility | 不拥有 CP01~06 truth、Runtime outcome、host state 或 external body。 |
| `CapabilityOutletView` | 可裁剪的 capability safe-ref 出口 | immutable optional view | activation / source sufficiency / non-authorizing disposition | 不建 capability registry、authorization、provider route 或 invocation gateway。 |
| `MemberProjectionState` | 各 kind projection 的唯一可变支持状态 | projection support truth | watermark、stale/rebuild/failure/unknown successor | 不修复 core / external truth，不由 Query 推进。 |
| `MemberDiagnosticView` | 低敏 gap / trace / resolution 解释面 | optional immutable view | safe explanation、gap linkage、freshness | 不输出 raw log、正文、secret、evidence / verdict。 |
| `ReadProjectionPolicy` | committed-only、visibility、freshness、body-free、no-write guard | domain policy | source / view / outlet validation | 不授权 Tools，不触发 refresh / rebuild，不写 source truth。 |

### 18.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `MemberSummaryView` | 形成不可变 body-free summary revision | id、双锚、presence / interaction summary、optional Runtime safe view、watermark、freshness、projection state ref、time | `rebuild(...)` | `is_current_at`、`is_safe_to_expose`、`degradation_surface` | immutable + `ProjectionFreshness` | CP01~06 committed refs / resolutions、projection state、ID、Clock。 |
| `CapabilityOutletView` | 形成 optional safe-ref outlet revision | id、subject、activation status、Tool / binding / Method refs、resolution / gap refs、watermark、time | `project(...)` | `is_available`、`contains_definition_body`、`can_invoke`、`matches_resolution` | immutable + `CapabilityOutletStatus` | CP06 committed resolution / gap、safe refs、activation basis、ID、Clock。 |
| `MemberProjectionState` | 标记 stale / rebuild / completion / failure | id、subject、kind、status、source / target watermark、gap refs、rebuildability、reason、time | `initialize(...)` | `mark_stale`、`start_rebuild`、`complete_rebuild`、`mark_failed`、`can_serve` | `MemberProjectionStatus` | committed source cursor / resolution、projection job result、ID、Clock。 |
| `MemberDiagnosticView` | 构造 optional body-free diagnostics | id、subject、categories、trace / gap / resolution / explanation refs、state ref、time | `rebuild(...)` | `is_safe_to_expose`、`explains_gap`、`is_current_at` | immutable | committed trace/gap/resolution、safe explanation refs、projection state、ID、Clock。 |
| `ReadProjectionPolicy` | 验证 source、visibility、view 与 outlet | source / visibility / body / freshness / rebuild / no-write / outlet rules | `read_only_rebuildable()` | `validate_sources`、`evaluate_visibility`、`validate_view`、`evaluate_outlet`、`allows_core_write` | 无独立 state | fixed architecture invariant + formal visibility basis。 |

### 18.4 CP07 public view support values

```rust
/// Carries a body-free explanation of why a projection is stale, degraded, or not ready.
pub struct ProjectionDegradationSurface {
    /// Safe reason category for the constrained projection surface.
    pub reason_category: SafeReasonCategory,
    /// Typed gaps limiting the surface.
    pub gap_refs: Vec<TypedRef>,
}
```

| 类型 | 作用 | 来源 / 约束 |
|---|---|---|
| `ProjectionVisibilityBasisRef` | 连接可见性判断所需的 formal owner / policy basis，而非从 actor 文本或 query ref 反推。 | application visibility resolver 或 trusted query contract；body-free、owner-bound；exact owner 仍受 upstream contract 约束。 |
| `ProjectionDegradationSurface` | 让 stale / degraded / not-ready 响应携带安全 reason 与 gap refs。 | projection state / read policy；gap refs ordered-unique；不得包含正文、权限细节或修复动作。 |

### 18.5 `MemberSummaryView`

##### `MemberSummaryView`

```rust
/// Provides an immutable body-free summary derived from committed member facts and neutral resolutions.
pub struct MemberSummaryView {
    /// Local identity of this summary revision.
    pub summary_view_id: MemberSummaryViewId,
    /// Project-scoped member subject represented by the view.
    pub subject_ref: ProjectMemberRef,
    /// Global identity anchor associated with the subject.
    pub identity_anchor_ref: GlobalMemberRef,
    /// Safe presence posture derived from CP01 committed facts.
    pub presence_summary: MemberPresenceSummary,
    /// Low-cardinality interaction posture derived from CP02~05 facts.
    pub interaction_summary: MemberInteractionSummary,
    /// Optional Runtime-owned safe view reference.
    pub runtime_safe_view_ref: Option<RuntimeSafeViewRef>,
    /// Source watermark applied to this revision.
    pub source_watermark: ProjectionWatermark,
    /// Freshness posture of this immutable revision.
    pub freshness: ProjectionFreshness,
    /// Projection state supporting this revision.
    pub projection_state_ref: MemberProjectionStateId,
    /// Member-local generation time.
    pub generated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `summary_view_id` | `MemberSummaryViewId` | immutable revision identity。 | ID Port 生成；new rebuild revision 使用新 ID。 |
| `subject_ref` / `identity_anchor_ref` | typed双锚 | 固定 view 主语。 | 来自 committed presence / trusted request；必须匹配，不复制 identity body。 |
| `presence_summary` | `MemberPresenceSummary` | CP01 安全在场摘要。 | 只从 committed presence 派生；不代答 host / process health。 |
| `interaction_summary` | `MemberInteractionSummary` | CP02~05 低基数交互摘要。 | categories / gap refs body-free、ordered-unique；不复制 event / model / tool body。 |
| `runtime_safe_view_ref` | `Option<RuntimeSafeViewRef>` | Runtime safe read reference。 | 仅 owner-provided safe ref；None 不等于 Runtime failure。 |
| `source_watermark` / `freshness` | Core watermark + `ProjectionFreshness` | 暴露 source coverage 与 stale / degraded。 | watermark 不能冒充 optimistic version；freshness 不隐式触发 rebuild。 |
| `projection_state_ref` | `MemberProjectionStateId` | 回链 projection support state。 | 必须指向同一 subject/kind 的 committed state。 |
| `generated_at` | `Timestamp` | local view creation time。 | Clock Port；不代表 source current time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_current_at(&self, required_watermark: ProjectionWatermark) -> bool` | 判断本 view 是否覆盖请求 watermark。 | explicit required watermark。 | `bool`。 | 只以 source watermark + freshness 判断；不读 source、不写 state。 |
| `pub fn is_safe_to_expose(&self, visibility_context: &ProjectionVisibilityContext) -> bool` | 检查 subject/kind/basis 与 body-free surface。 | application-resolved visibility context。 | `bool`。 | 无 visibility basis 时不得推断 visible；不进行 authorization。 |
| `pub fn degradation_surface(&self) -> Option<ProjectionDegradationSurface>` | 暴露 stale / degraded / unknown 的安全说明。 | 无。 | optional surface。 | 纯函数；不触发 refresh / rebuild。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn rebuild(summary_view_id: MemberSummaryViewId, subject_ref: ProjectMemberRef, identity_anchor_ref: GlobalMemberRef, presence_summary: MemberPresenceSummary, interaction_summary: MemberInteractionSummary, runtime_safe_view_ref: Option<RuntimeSafeViewRef>, source_watermark: ProjectionWatermark, freshness: ProjectionFreshness, projection_state_ref: MemberProjectionStateId, generated_at: Timestamp, policy: &ReadProjectionPolicy) -> Result<Self, DomainError>` | 从已提交 refs / safe summaries 形成 immutable summary revision。 | all sources loaded by application;policy validates body / scope / freshness。 | view or error。 | `MemberProjectionRebuildJob` / read-model service。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| immutable revision | source change 必须新建 view revision；Query、Consumer、Job 不得原地改写。 |
| no truth ownership | summary 不拥有 presence、Runtime、host、Conversation、Tools 或 external truth。 |
| freshness honesty | `Current` 只在 source coverage 可证明时使用；stale / degraded / unknown 必须显式返回。 |

### 18.6 `CapabilityOutletView`

##### `CapabilityOutletView`

```rust
/// Exposes an optional body-free capability outlet without granting invocation authority.
pub struct CapabilityOutletView {
    /// Local identity of this outlet revision.
    pub outlet_view_id: CapabilityOutletViewId,
    /// Project-scoped member subject represented by the outlet.
    pub subject_ref: ProjectMemberRef,
    /// Ref-derived activation / source sufficiency status.
    pub activation_status: CapabilityOutletStatus,
    /// Safe Tool contract view refs supplied by the Tools owner.
    pub tool_contract_refs: Vec<ToolContractViewRef>,
    /// Safe capability binding view refs supplied by the owning source.
    pub capability_binding_refs: Vec<CapabilityBindingViewRef>,
    /// Safe Method definition refs without definition bodies.
    pub method_definition_refs: Vec<MethodDefinitionRef>,
    /// Neutral resolutions supporting displayed refs.
    pub resolution_refs: Vec<ExternalContextResolutionId>,
    /// Projection watermark for this revision.
    pub source_watermark: ProjectionWatermark,
    /// External / projection gaps limiting the outlet.
    pub gap_refs: Vec<ExternalContextGapId>,
    /// Member-local generation time.
    pub generated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `outlet_view_id` | `CapabilityOutletViewId` | immutable outlet revision identity。 | ID Port；new status creates successor ID。 |
| `subject_ref` | `ProjectMemberRef` | 固定 outlet 主语。 | request / committed projection state；不得使用 GlobalMember 作为 execution subject。 |
| `activation_status` | `CapabilityOutletStatus` | available / not-available / stale / gap 分类。 | `ReadProjectionPolicy.evaluate_outlet`；不代答 Tools authorization / invocation。 |
| `tool_contract_refs` / `capability_binding_refs` / `method_definition_refs` | ordered `Vec` typed refs | 显示 safe capability references。 | owner-specific source / CP06 resolution；unique、body-free；不复制 registry / definition。 |
| `resolution_refs` | `Vec<ExternalContextResolutionId>` | 连接每组 display ref 的 neutral basis。 | ordered-unique；每项 purpose / scope / freshness must match。 |
| `source_watermark` | `ProjectionWatermark` | outlet source coverage。 | projection watermark only；不表示 Tools source current / reachable。 |
| `gap_refs` | `Vec<ExternalContextGapId>` | 显式限制 outlet 的 source gap。 | ordered-unique；gap 不被此 view 关闭。 |
| `generated_at` | `Timestamp` | local revision time。 | Clock Port。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_available(&self) -> bool` | 判断该 revision 是否可提供 body-free outlet。 | 无。 | `bool`。 | 仅 `Available`；不表示 authorization / invocation / execution readiness。 |
| `pub fn contains_definition_body(&self) -> bool` | 守护 outlet body boundary。 | 无。 | `bool`。 | 必须恒为 false；refs 不可展开为 definition body。 |
| `pub fn can_invoke(&self, tool_contract_ref: &ToolContractViewRef) -> NonAuthorizingInvocationDisposition` | 明确 member 不持有 invocation authority。 | tool safe ref。 | `NonAuthorizingInvocationDisposition`。 | 始终返回 `NotAuthorizedHere`；不调用 Tools。 |
| `pub fn matches_resolution(&self, resolutions: &[ExternalContextResolution]) -> bool` | 验证 display refs 与 neutral resolutions 一致。 | loaded resolution records。 | `bool`。 | 纯函数；不把 `Resolved` 升级为 available，除非 activation / gap / watermark 同时满足。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn project(outlet_view_id: CapabilityOutletViewId, subject_ref: ProjectMemberRef, activation: CapabilityOutletActivation, tool_contract_refs: Vec<ToolContractViewRef>, capability_binding_refs: Vec<CapabilityBindingViewRef>, method_definition_refs: Vec<MethodDefinitionRef>, resolutions: Vec<ExternalContextResolution>, gaps: Vec<ExternalContextGap>, source_watermark: ProjectionWatermark, generated_at: Timestamp, policy: &ReadProjectionPolicy) -> Result<Self, DomainError>` | 从 safe refs / neutral resolutions 形成 outlet revision。 | activation and all refs supplied by application;policy validates ordering / source sufficiency。 | view or error。 | projection rebuild / capability outlet Query assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| non-authorizing | `Available` 只表示 safe display refs / resolutions 足够；不授予 invocation、provider route、execution 或 Governance approval。 |
| optional isolation | `NotAvailable`、`Stale`、`Gap` 不阻塞 summary / CP01~06；不解释为 Tools registry deletion。 |
| no definition body | 任何 definition / provider / registry body 只能留在其 owner；本 view 永远 ref-only。 |

### 18.7 `MemberProjectionState`

##### `MemberProjectionState`

```rust
/// Tracks freshness and rebuild posture for one member projection kind.
pub struct MemberProjectionState {
    /// Local identity of this projection state record.
    pub projection_state_id: MemberProjectionStateId,
    /// Project-scoped member subject represented by the state.
    pub subject_ref: ProjectMemberRef,
    /// Projection kind with an independent watermark and lifecycle.
    pub projection_kind: MemberProjectionKind,
    /// Current projection lifecycle posture.
    pub status: MemberProjectionStatus,
    /// Last committed source watermark applied.
    pub source_watermark: ProjectionWatermark,
    /// Known target source watermark to catch up to.
    pub target_watermark: Option<ProjectionWatermark>,
    /// Ordered unique gaps limiting the projection.
    pub gap_refs: Vec<TypedRef>,
    /// Whether the projection can be rebuilt from committed sources alone.
    pub rebuildable: bool,
    /// Safe reason for a non-current posture.
    pub safe_reason: Option<SafeReasonCategory>,
    /// Local state update time.
    pub updated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `projection_state_id` | `MemberProjectionStateId` | local state identity。 | ID Port；每个 subject + kind 有独立 state identity。 |
| `subject_ref` / `projection_kind` | subject / kind | 固定 state scope。 | initialization / loaded projection key；kind 不共享 current 证明。 |
| `status` | `MemberProjectionStatus` | current / stale / rebuilding / degraded / failed / disabled / unknown。 | state transition methods；不由 Query、time 或 default 推进。 |
| `source_watermark` / `target_watermark` | watermark / optional watermark | applied 与 known target source position。 | committed facts / resolutions / Job input；不可当 optimistic version、timestamp 或 source version。 |
| `gap_refs` | `Vec<TypedRef>` | 影响当前 projection 的 gaps。 | ordered-unique；来源为 committed gap / resolution refs；不保存 gap body。 |
| `rebuildable` | `bool` | 是否可从 committed sources 重建。 | policy / source coverage result；false 必须保持 degraded / failed / unknown 语义。 |
| `safe_reason` | `Option<SafeReasonCategory>` | 非 current 的安全说明。 | required for stale / rebuilding / degraded / failed / disabled / unknown unless policy documents a source-specific absence marker。 |
| `updated_at` | `Timestamp` | local state update time。 | Clock Port；不代表 source update。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_stale(&self, target_watermark: ProjectionWatermark, safe_reason: SafeReasonCategory) -> Result<Self, DomainError>` | 形成 stale successor。 | known target watermark、safe reason。 | successor state。 | current / degraded / failed / unknown -> stale 仅在 source advancement 可证明时；不重建 view。 |
| `pub fn start_rebuild(&self, target_watermark: ProjectionWatermark, safe_reason: SafeReasonCategory) -> Result<Self, DomainError>` | 进入 rebuilding posture。 | target watermark、safe reason。 | successor state。 | 允许 active non-disabled states；旧 view 不得声称 current。 |
| `pub fn complete_rebuild(&self, applied_watermark: ProjectionWatermark, updated_at: Timestamp) -> Result<Self, DomainError>` | 在完整覆盖成立时形成 current successor。 | applied watermark、Clock。 | successor state。 | 仅 rebuilding 且 applied >= target、rebuildable 且无 blocking gap；不得从 failed / unknown 直接 current。 |
| `pub fn mark_failed(&self, safe_reason: SafeReasonCategory, updated_at: Timestamp) -> Result<Self, DomainError>` | 记录 rebuild / store failure。 | safe reason、Clock。 | successor state。 | 不修改 source truth、不自动重试。 |
| `pub fn can_serve(&self, consistency_hint: &ProjectionConsistencyHint) -> ProjectionServeDisposition` | 映射 Query 可服务面。 | explicit consistency hint。 | serve disposition。 | no write / no rebuild；CurrentRequired 不满足时返回 NotReady / Degraded，不隐藏 stale。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn initialize(projection_state_id: MemberProjectionStateId, subject_ref: ProjectMemberRef, projection_kind: MemberProjectionKind, activation: ProjectionActivation, initial_watermark: ProjectionWatermark, created_at: Timestamp) -> Result<Self, DomainError>` | 建立 required current 或 optional disabled 初始状态。 | explicit activation、initial watermark、ID / Clock。 | state or error。 | runtime assembly / projection bootstrap。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| independent kind | summary、capability outlet、diagnostic 各自维护 watermark / status；一个 kind current 不证明另一个。 |
| no source repair | rebuild / reconcile 只能消费 committed refs / resolutions；不得关闭 CP04 / CP05 / CP06 gap。 |
| explicit disabled | optional disabled 是受控 activation 结果，不等于 source missing、authorization denied 或 registry absent。 |

### 18.8 `MemberDiagnosticView`

##### `MemberDiagnosticView`

```rust
/// Provides an optional immutable low-sensitive diagnostic projection for a member subject.
pub struct MemberDiagnosticView {
    /// Local identity of this diagnostic revision.
    pub diagnostic_view_id: MemberDiagnosticViewId,
    /// Project-scoped member subject represented by the view.
    pub subject_ref: ProjectMemberRef,
    /// Ordered unique diagnostic categories.
    pub diagnostic_categories: Vec<MemberDiagnosticCategory>,
    /// Body-free trace references included in the explanation surface.
    pub trace_refs: Vec<InteractionTraceEntryId>,
    /// Interaction, publication, external, or projection gap refs.
    pub gap_refs: Vec<TypedRef>,
    /// Neutral source-resolution refs explaining freshness or conflict.
    pub source_resolution_refs: Vec<ExternalContextResolutionId>,
    /// Safe explanation refs from formal owners.
    pub explanation_refs: Vec<SafeExplanationRef>,
    /// Projection state supporting this revision.
    pub projection_state_ref: MemberProjectionStateId,
    /// Member-local generation time.
    pub generated_at: Timestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `diagnostic_view_id` | `MemberDiagnosticViewId` | immutable diagnostic revision identity。 | ID Port；new rebuild creates successor。 |
| `subject_ref` | `ProjectMemberRef` | 固定诊断主语。 | trace / projection state；不扩大到 global / external subject。 |
| `diagnostic_categories` | `Vec<MemberDiagnosticCategory>` | 低基数状态 / gap categories。 | ordered-unique、safe wrapper；不得含自由文本、raw log或高基数标签。 |
| `trace_refs` / `gap_refs` / `source_resolution_refs` | typed refs | 最小解释链。 | committed trace / gap / resolution only；不复制 source body。 |
| `explanation_refs` | `Vec<SafeExplanationRef>` | owner-provided safe explanation pointer。 | body-free、ordered-unique；不保存 policy / config / method正文。 |
| `projection_state_ref` | `MemberProjectionStateId` | 回链 diagnostic state。 | same subject + Diagnostic kind。 |
| `generated_at` | `Timestamp` | local view time。 | Clock Port。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_safe_to_expose(&self, visibility_context: &ProjectionVisibilityContext) -> bool` | 检查 diagnostic visibility / body boundary。 | resolved visibility context。 | `bool`。 | 无 basis 不得推断 visible；不调用 config / source。 |
| `pub fn explains_gap(&self, gap_ref: &TypedRef) -> bool` | 判断视图是否包含该 gap 的安全解释链。 | typed gap ref。 | `bool`。 | 纯函数；不把 explanation 当 gap resolution。 |
| `pub fn is_current_at(&self, required_watermark: ProjectionWatermark) -> bool` | 检查 diagnostic source coverage。 | explicit watermark。 | `bool`。 | no write / no rebuild。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn rebuild(diagnostic_view_id: MemberDiagnosticViewId, subject_ref: ProjectMemberRef, trace_entries: Vec<InteractionTraceEntry>, gap_refs: Vec<TypedRef>, resolutions: Vec<ExternalContextResolution>, explanation_refs: Vec<SafeExplanationRef>, projection_state: &MemberProjectionState, generated_at: Timestamp, policy: &ReadProjectionPolicy) -> Result<Self, DomainError>` | 从 committed trace / gap / resolution 重建 optional diagnostic revision。 | application loaded body-free objects；policy validates subject / scope / body。 | view or error。 | `MemberProjectionRebuildJob` / diagnostics Query assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| optional | diagnostic missing / disabled / degraded 不阻塞 MemberSummary 或 CP01~06。 |
| low-sensitive only | 不输出 raw logs、prompt、model/tool response、secret、evidence、verdict或完整 config。 |
| no control write | diagnostic 不触发 screening、publication、refresh、configuration 或 source repair。 |

### 18.9 `ReadProjectionPolicy`

##### `ReadProjectionPolicy`

```rust
/// Guards committed-source-only, body-free, visible, no-write member projections.
pub struct ReadProjectionPolicy {
    /// Requires CP01~06 committed refs and neutral resolutions as projection sources.
    pub source_requirement: CommittedProjectionSourceRequirement,
    /// Requires a formal basis for visibility decisions.
    pub visibility_rule: ProjectionVisibilityRule,
    /// Rejects forbidden body categories from every view.
    pub body_boundary: ForbiddenBodyBoundary,
    /// Exposes stale, degraded, rebuilding, failed, and unknown freshness honestly.
    pub freshness_rule: ProjectionFreshnessRule,
    /// Restricts rebuilds to committed local sources.
    pub rebuild_rule: ProjectionRebuildRule,
    /// Prohibits Query / projection / Job from writing core truth.
    pub no_write_rule: ProjectionNoWriteRule,
    /// Keeps capability outlet non-authorizing and optional.
    pub outlet_rule: CapabilityOutletRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `source_requirement` | `CommittedProjectionSourceRequirement` | 限定 projection source。 | CP01~06 committed refs / neutral resolutions；不接 external body。 |
| `visibility_rule` | `ProjectionVisibilityRule` | 要求 actor + scope + formal basis。 | resolved `ProjectionVisibilityContext`；缺 basis 必须 conservative。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 阻断正文 / secret / definition body / complete log。 | fixed invariant；不可由 config 放宽。 |
| `freshness_rule` | `ProjectionFreshnessRule` | 让 watermark / stale / degraded / unknown 显式。 | state + source coverage；不触发 rebuild。 |
| `rebuild_rule` | `ProjectionRebuildRule` | 约束 rebuild source 与 successor。 | committed-only；不得修复 source truth。 |
| `no_write_rule` | `ProjectionNoWriteRule` | 保持 Query / projection / Job 无 core write。 | architecture invariant；无例外。 |
| `outlet_rule` | `CapabilityOutletRule` | 约束 activation / status / non-authorizing。 | CP06 safe refs / gaps；不建立 registry。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_sources(&self, committed_facts: &[MemberCommittedFactRef], resolutions: &[ExternalContextResolution], source_watermark: ProjectionWatermark) -> Result<(), DomainError>` | 检查 source completeness / watermark / body-free。 | committed refs、neutral resolutions、watermark。 | success / error。 | pure；不读取或修复 source body。 |
| `pub fn evaluate_visibility(&self, actor: &ActorContext, visibility_context: &ProjectionVisibilityContext) -> ProjectionVisibility` | 返回 visible / restricted / denied / unknown。 | trusted Core actor + application-resolved context。 | `ProjectionVisibility`。 | 缺 visibility basis、subject mismatch或 scope未知不得返回 Visible；不执行 authorization。 |
| `pub fn validate_view(&self, body_inspection: &ProjectionBodyInspection, freshness: &ProjectionFreshness) -> Result<(), DomainError>` | 校验 body-free 与 freshness surface。 | safe inspection、freshness。 | success / error。 | `Clean` required；不得把 stale / unknown 当 current。 |
| `pub fn evaluate_outlet(&self, activation: CapabilityOutletActivation, resolutions: &[ExternalContextResolution], gaps: &[ExternalContextGap]) -> CapabilityOutletStatus` | 形成 outlet display posture。 | activation、neutral resolutions、gaps。 | `CapabilityOutletStatus`。 | 不授权 invocation；resolution status / gap 必须逐项匹配。 |
| `pub fn allows_core_write(&self) -> bool` | 明确 projection policy 没有 core write authority。 | 无。 | `bool`。 | 永远为 false。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn read_only_rebuildable() -> Self` | 建立 committed-only、body-free、no-write、non-authorizing policy。 | 无。 | fixed policy。 | `MemberReadModelService` / projection job construction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| Query no-write | Query 不创建 state、刷新 external context、关闭 source gap、安排 job 或改变 activation。 |
| projection isolation | rebuild / reconcile 只能产生 state / view successor；不得修改 CP01~06 truth 或 external owner truth。 |
| visibility honesty | denied / restricted / unknown 必须通过 explicit disposition / marker 暴露；不得泄露正文，也不得从 actor label、route、cursor或空页拼出 basis。 |
| outlet non-authorizing | available 只表达 display refs / resolution 充足；Runtime → Tools 的 action chain 与 registry 仍由外部 owner。 |

### 18.10 CP07 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP07 五对象均有 capability、字段、factory 与成员函数 | pass_for_current_step | summary、outlet、projection state、diagnostic、read policy 已独立成卡。 |
| view / state / policy 分层 | pass | immutable view、唯一可变 projection state 与 no-write policy 未混写。 |
| projection no-write / rebuildable | pass | Query / Job 只产生 projection successor；不写 CP01~06 或 external truth。 |
| outlet optional / non-authorizing | pass | available / not_available / stale / gap 只表达 safe display posture。 |
| visibility / freshness / body gate | pass_with_upstream_blockers | formal visibility basis / exact event mapping 仍受 `L2M-UP-005` 等 blocker 限制；local conservative carrier已闭合。 |
| Step 7 / 8 承接 | ready_for_application_carriers | Step 7 需定义 projection / read / visibility source ports；Step 8 需定义三 Query、两 Consumer、两 Job 与四 semantic events。 |

## 19. `application`：stable facade、operation、idempotency、read 与 job carrier

### 19.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 以九个 named service 组织入口调用 | constructed service instances | thin application facade | 无 domain truth、无 Port hiding | `MemberApplicationFacade` | Step 7 Port injection；Step 9 named use-case flow。 |
| 将 Command / Query / Consumer / Job metadata 归一为 application context | trusted actor、metadata / event / job marker、operation name、trace、idempotency | `MemberOperationContext` | query no-write；write channel idempotency required | `MemberOperationContext` | Step 7 context construction / Port contracts；Step 8 entry DTO。 |
| 支持 write/event/job duplicate 与 conflict 防护 | operation context、canonical request digest、stored result ref | reservation record | reserved / completed / conflict；Query does not reserve | `MemberIdempotencyRecord` | Step 7 idempotency Store；Step 13 duplicate / replay rules。 |
| 保存可 replay 的 body-free operation result shell | application result identity、kind、surface ref、trace | stored-result shell | no result body copy | `StoredMemberOperationResult` | Step 7 result Store；Step 8 public response / receipt / report schema。 |
| 在 Query assembly 前生成可见性 / degrade decision | actor、formal visibility basis、projection state / freshness | `ReadVisibilityDecision` | no write，not-visible is explicit surface | `ReadVisibilityDecision` | Step 7 visibility resolver / read Port；Step 8 Query response mapper。 |
| 聚合五类 Operations Job 的 body-free result refs | job operation context、application returned refs / safe issues | `MemberJobReportAssembly` → report | report assembly only；not a real run or evidence | `MemberJobReportAssembly` | Step 7 report result Store；Step 8 job DTO；Step 13 replay。 |

### 19.2 application-local shared values

```rust
/// Classifies the application entry channel for one member operation.
pub enum MemberOperationChannel {
    /// A synchronous command that may change member-local or support truth.
    Command,
    /// A synchronous read that must not reserve idempotency or write state.
    Query,
    /// An inbound source or committed-fact consumer operation.
    InboundConsumer,
    /// A logical operations-job continuation.
    OperationsJob,
}

/// Names a stable member application operation without carrying request body.
pub struct MemberOperationName(pub String);

/// Holds a normalized idempotency key for a write, consumer, or job operation.
pub struct MemberOperationIdempotencyKey(pub String);

/// Holds a canonical digest of only stable, body-free operation input.
pub struct MemberRequestDigest(pub String);

/// Selects the one named application service that owns a canonical operation.
pub enum MemberServiceRoute {
    /// Routes CP01 admission and presence operations.
    Presence,
    /// Routes CP01 host-material and feedback operations.
    HostCollaboration,
    /// Routes CP02 subscription-scope operations.
    SubscriptionScope,
    /// Routes CP02 inbound intake and screening operations.
    InboundBoundary,
    /// Routes CP03 Runtime mediation operations.
    RuntimeMediation,
    /// Routes CP04 outbound-boundary operations.
    OutboundBoundary,
    /// Routes CP05 interaction-trace and observation operations.
    InteractionTrace,
    /// Routes CP06 external-context mirror operations.
    ExternalContextMirror,
    /// Routes CP07 read-model and projection operations.
    MemberReadModel,
}

/// References one stored member operation result surface.
pub struct MemberOperationResultRef {
    /// Operation that produced the stored result.
    pub operation_name: MemberOperationName,
    /// Local result record identity.
    pub result_id: StoredMemberOperationResultId,
}

/// Classifies the reservation state of one member idempotency record.
pub enum MemberIdempotencyState {
    /// The key and digest are reserved and no result surface is stored yet.
    Reserved,
    /// A result surface was stored for the matching operation and digest.
    Completed,
    /// The key was reused with a different channel, operation, or digest.
    Conflict,
}

/// Classifies a stored public member result surface.
pub enum MemberStoredResultKind {
    /// Stored command response surface.
    CommandResult,
    /// Stored command rejection surface.
    CommandRejection,
    /// Stored inbound consumer receipt surface.
    ConsumerReceipt,
    /// Stored operations-job report surface.
    JobReport,
}

/// Represents a body-free application-boundary failure.
pub enum ApplicationError {
    /// Entry metadata cannot form a valid member operation context.
    InvalidContext {
        /// Redacted category describing the failed context invariant.
        reason_category: SafeReasonCategory,
    },
    /// A local carrier, duplicate, result, or read-decision invariant is violated.
    ContractViolation {
        /// Redacted category describing the violated invariant.
        reason_category: SafeReasonCategory,
    },
    /// A required local port or validated dependency cannot provide a safe result.
    DependencyUnavailable {
        /// Redacted category describing the unavailable dependency boundary.
        reason_category: SafeReasonCategory,
    },
}

```

| 类型 | 作用 | 约束 / 来源 |
|---|---|---|
| `MemberOperationChannel` | 区分 idempotency / no-write / report rules。 | Query 必为 no-write，不能 reserve；Command / Consumer / Job require idempotency。 |
| `MemberOperationName` | 固定 application service operation identity。 | 必须与 Step 8 protocol、Step 9 flow 使用同一 canonical name；不得用 route、topic、cron或 binary name 替代。 |
| `MemberOperationIdempotencyKey` | normalized write key。 | command从 Core `IdempotencyKey` 归一；consumer从 `DeduplicationKey` 归一；job从 explicit logical job metadata归一；不得从 trace / time / ID 生成。 |
| `MemberRequestDigest` | stable input comparison。 | canonicalization / algorithm 留 Step 13；不得包含 request ID、trace、timestamp、random ID、raw body或 adapter state。 |
| `MemberOperationResultRef` / `MemberStoredResultKind` | duplicate replay 指向与结果种类。 | shell 不等于 result body read closure；Step 7/13 必须提供 typed save / get / missing behavior。 |
| `MemberServiceRoute` | 将 canonical operation 收敛到九个 named service 之一。 | 由 `MemberApplicationFacade::service_for` 纯映射；不是 route、topic、worker、job、crate或外部 owner。 |
| `MemberOperationsJobKind` | 固定 five logical job identities。 | 不等于 scheduler、cron、binary或真实 run；只对应 HLD 已列五类 continuation。 |
| `MemberJobReport` | 从 application assembly 得到的 body-free job output surface；正式 schema 位于 `contracts::jobs`。 | application 只组装并调用 `MemberJobReport::new`，不拥有 report 字段；不含 run ID、artifact、evidence、test、verdict、signoff、readiness、source body或adapter body。 |
| `ApplicationError` | `crates/application/src/errors.rs` 中唯一的最小 application error carrier。 | 只含 `SafeReasonCategory`；不携带 `DomainError`、Port / adapter error、payload、metadata body、stack trace、secret或 retry decision。Step 12 才定义完整映射、恢复和可观测性。 |

### 19.3 `MemberApplicationFacade`

##### `MemberApplicationFacade`

```rust
/// Groups the nine named member application services for entry-layer assembly.
pub struct MemberApplicationFacade<P, H, S, I, R, O, T, M, Q> {
    /// Presence admission and transition service.
    pub presence_service: P,
    /// Host collaboration material and feedback service.
    pub host_collaboration_service: H,
    /// Subscription-scope service.
    pub subscription_scope_service: S,
    /// Inbound fact and screening service.
    pub inbound_boundary_service: I,
    /// Runtime mediation service.
    pub runtime_mediation_service: R,
    /// Outbound boundary service.
    pub outbound_boundary_service: O,
    /// Interaction trace and observation service.
    pub interaction_trace_service: T,
    /// External context mirror service.
    pub external_context_mirror_service: M,
    /// Member read-model service.
    pub member_read_model_service: Q,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| nine named service fields | generic concrete service types | 组装 Step 5 已命名的九个 service。 | infra runtime builder 注入；facade 不保存 Store / adapter / config / foreign truth。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn service_for(&self, operation_name: &MemberOperationName) -> MemberServiceRoute` | 将 canonical operation 映射到唯一 named service。 | operation name。 | `MemberServiceRoute`。 | pure routing decision；未知 name must be rejected by entry/application error mapping。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(presence_service: P, host_collaboration_service: H, subscription_scope_service: S, inbound_boundary_service: I, runtime_mediation_service: R, outbound_boundary_service: O, interaction_trace_service: T, external_context_mirror_service: M, member_read_model_service: Q) -> Self` | 聚合已构造 service。 | nine concrete application service instances。 | facade。 | infra composition root、api / worker / jobs wiring。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| thin facade | facade 只路由，不能形成 tenth mega-service、偷偷实现 policy、Store access或外部 adapter call。 |
| named-service preservation | 每个 CP service 的 owner 边界保持 Step 5 定义；facade 不把 CP01~07 truth 合并。 |
| no public DTO | facade 位于 application，绝不进入 contracts Query / Command / Consumer / Job schema。 |

### 19.4 `MemberOperationContext`

##### `MemberOperationContext`

```rust
/// Carries validated entry metadata for one member application operation.
pub struct MemberOperationContext {
    /// Local identity of this assembled operation context.
    pub context_id: MemberOperationContextId,
    /// Entry channel that determines no-write and idempotency rules.
    pub channel: MemberOperationChannel,
    /// Canonical operation identity.
    pub operation_name: MemberOperationName,
    /// Trusted actor context from the entry boundary.
    pub actor: ActorContext,
    /// Core distributed trace identity propagated through local records and results.
    pub trace_id: TraceId,
    /// Command metadata for command operations only.
    pub command_metadata: Option<CommandMetadata>,
    /// Query metadata for query operations only.
    pub query_metadata: Option<QueryMetadata>,
    /// Explicit external-event or committed-fact identity for inbound consumer operations only.
    pub consumer_source: Option<MemberConsumerSourceIdentity>,
    /// Logical job invocation reference for operations-job operations only.
    pub job_invocation_ref: Option<MemberJobInvocationRef>,
    /// Normalized idempotency key for write, consumer, or job channels.
    pub idempotency_key: Option<MemberOperationIdempotencyKey>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_id` | `MemberOperationContextId` | application context identity。 | ID Port；not a request / logical job invocation / result ID。 |
| `channel` / `operation_name` | enum / name | 固定入口类别和用例 identity。 | entry mapping / canonical protocol name；不得从 route或 handler class推断。 |
| `actor` / `trace_id` | Core types | 传递 trusted actor与 distributed trace。 | trusted entry;trace must equal metadata/envelope/job trace when such carrier exists。 |
| `command_metadata` / `query_metadata` | Core metadata options | 保持 command/query metadata boundary。 | Command exactly `Some` command + no query; Query exactly `Some` query + no command; Consumer / Job both None。 |
| `consumer_source` | `Option<MemberConsumerSourceIdentity>` | 精确连接外部 envelope 或 committed-fact Consumer source。 | Consumer must be `Some`;other channels `None`；external variant必须保留 source event ID + ref，committed variant只接受已提交 local fact ref；不保存 event payload。 |
| `job_invocation_ref` | `Option<MemberJobInvocationRef>` | 连接 Step 8 Job metadata 的逻辑 invocation。 | OperationsJob must be `Some`;不是 scheduler run、process、artifact或evidence record；其他 channel 必须 `None`。 |
| `idempotency_key` | optional normalized key | write / consumer / job duplicate guard。 | Command / Consumer / Job must be Some;Query must be None。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断 operation 是否必须 reserve。 | 无。 | `bool`。 | Command / InboundConsumer / OperationsJob true；Query false。 |
| `pub fn assert_query_no_write(&self) -> Result<(), ApplicationError>` | 校验 Query carrier 未混入 write metadata。 | 无。 | success / error。 | query 有 idempotency、consumer source、job invocation或 command metadata时失败；不写 state。 |
| `pub fn assert_write_metadata_complete(&self) -> Result<(), ApplicationError>` | 校验 write / consumer / job context。 | 无。 | success / error。 | missing actor / trace / key / channel-specific marker fails closed。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_command(context_id: MemberOperationContextId, operation_name: MemberOperationName, actor: ActorContext, metadata: CommandMetadata, idempotency_key: MemberOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 建立 command context。 | ID、canonical name、trusted actor、Core metadata、normalized key。 | context / error。 | API command entry；trace copied from `metadata.request.trace_id`。 |
| `pub fn from_query(context_id: MemberOperationContextId, operation_name: MemberOperationName, actor: ActorContext, metadata: QueryMetadata) -> Result<Self, ApplicationError>` | 建立 no-write query context。 | ID、name、actor、query metadata。 | context / error。 | API query entry；trace copied from `metadata.request.trace_id`。 |
| `pub fn from_consumer(context_id: MemberOperationContextId, operation_name: MemberOperationName, actor: ActorContext, consumer_source: MemberConsumerSourceIdentity, deduplication_key: DeduplicationKey, trace_id: TraceId) -> Result<Self, ApplicationError>` | 建立 inbound Consumer context。 | ID、name、system/integration actor、external-event或committed-fact identity、dedup key、trace。 | context / error。 | worker consumer entry；dedup key is normalized into idempotency key；不得将 committed fact伪装成 external event。 |
| `pub fn from_job(context_id: MemberOperationContextId, operation_name: MemberOperationName, actor: ActorContext, job_invocation_ref: MemberJobInvocationRef, trace_id: TraceId, idempotency_key: MemberOperationIdempotencyKey) -> Result<Self, ApplicationError>` | 建立 logical operations-job context。 | ID、name、actor、logical invocation、trace、key。 | context / error。 | jobs entry；invocation remains logical, not evidence of real execution。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| channel exclusivity | channel-specific option fields必须精确匹配，不允许 command兼带query、Query带write key、Consumer / Job带Core command/query metadata。Consumer的 `consumer_source` 必须 `Some`，其余 channel 必须 `None`。 |
| no invented metadata | actor、trace、key、consumer source、job invocation都来自入口协议 / trusted runner，不得由 application、fake或 adapter 临时拼造。 |
| no truth | context 是短生命周期 application helper；不拥有 / 不重建 domain或external truth。 |

### 19.5 `MemberIdempotencyRecord`

##### `MemberIdempotencyRecord`

```rust
/// Stores technical idempotency reservation state for one non-query member operation.
pub struct MemberIdempotencyRecord {
    /// Local identity of this reservation record.
    pub record_id: MemberIdempotencyRecordId,
    /// Reserved normalized operation key.
    pub idempotency_key: MemberOperationIdempotencyKey,
    /// Entry channel protected by this record.
    pub channel: MemberOperationChannel,
    /// Canonical operation protected by this record.
    pub operation_name: MemberOperationName,
    /// Stable digest of the relevant body-free operation input.
    pub request_digest: MemberRequestDigest,
    /// Stored result ref after completion.
    pub result_ref: Option<MemberOperationResultRef>,
    /// Current reservation state.
    pub state: MemberIdempotencyState,
    /// Redacted explanation for conflicting key reuse.
    pub conflict_reason: Option<SafeReasonCategory>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `MemberIdempotencyRecordId` | reservation identity。 | ID Port；not derived from key or request. |
| `idempotency_key` / `channel` / `operation_name` | operation metadata | 绑定 duplicate domain。 | copied from validated non-query context；Query cannot create record。 |
| `request_digest` | `MemberRequestDigest` | 比较同 key 的 stable input。 | application canonical digest calculator；algorithm deferred to Step 13。 |
| `result_ref` | `Option<MemberOperationResultRef>` | 指向 replay result。 | Completed must be Some；Reserved / Conflict must be None。 |
| `state` / `conflict_reason` | enum / safe reason | reservation lifecycle。 | `Reserved -> Completed` or `Conflict` only；Conflict needs reason。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches(&self, channel: &MemberOperationChannel, operation_name: &MemberOperationName, request_digest: &MemberRequestDigest) -> bool` | 判断 duplicate 是否匹配同一 input。 | channel/name/digest。 | `bool`。 | pure;does not load result。 |
| `pub fn complete(&self, result_ref: MemberOperationResultRef) -> Result<Self, ApplicationError>` | 形成 completed successor。 | stored result ref。 | successor record。 | only Reserved;result operation must match。 |
| `pub fn mark_conflict(&self, reason: SafeReasonCategory) -> Result<Self, ApplicationError>` | 形成 conflict successor。 | safe reason。 | successor record。 | only Reserved;does not reveal input body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(record_id: MemberIdempotencyRecordId, context: &MemberOperationContext, request_digest: MemberRequestDigest) -> Result<Self, ApplicationError>` | 从 validated context 建立 reservation。 | ID、non-query context、stable digest。 | record / error。 | idempotency Store reserve-new-key path。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| Query excluded | Query 永远不创建、更新或读取为 replay 而设的 reservation。 |
| no replay by rerun | completed duplicate 必须通过 stored result surface replay，不能再跑 domain transition、Consumer处理或Job scan。 |
| state is technical | reservation 不表达 CP domain state、external accepted或job真实完成。 |

### 19.6 `StoredMemberOperationResult`

##### `StoredMemberOperationResult`

```rust
/// Stores body-free metadata for one replayable member operation result surface.
pub struct StoredMemberOperationResult {
    /// Local identity of the stored result record.
    pub result_id: StoredMemberOperationResultId,
    /// Stable operation-result pointer used by the idempotency record.
    pub result_ref: MemberOperationResultRef,
    /// Kind of public surface reachable from this stored result.
    pub result_kind: MemberStoredResultKind,
    /// Local reference to the body-free public surface persisted with this result.
    pub surface_ref: MemberStoredResultSurfaceRef,
    /// Core trace propagated when the surface was produced.
    pub trace_id: TraceId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `result_id` / `result_ref` | local ID / result pointer | 稳定 stored result identity与operation linkage。 | ID Port；`result_ref.result_id` must equal `result_id`。 |
| `result_kind` | `MemberStoredResultKind` | 区分 command result/rejection、consumer receipt、job report。 | application branch；Query never stored。 |
| `surface_ref` | `MemberStoredResultSurfaceRef` | 指向可读的 member-local public result surface。 | result Store save path；body不重复；不得改用 foreign ref；exact persistent carrier Step 7/8/13。 |
| `trace_id` | Core trace | result correlation。 | copied from operation context；not regenerated。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_ref(&self, result_ref: &MemberOperationResultRef) -> bool` | 判断是否为指定 result。 | typed result ref。 | `bool`。 | pure;does not load surface body。 |
| `pub fn is_job_report(&self) -> bool` | 判断是否为 stored job report。 | 无。 | `bool`。 | true only for `JobReport`。 |
| `pub fn is_command_rejection(&self) -> bool` | 判断是否为 stored rejection。 | 无。 | `bool`。 | true only for `CommandRejection`。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_surface(result_id: StoredMemberOperationResultId, operation_name: MemberOperationName, result_kind: MemberStoredResultKind, surface_ref: MemberStoredResultSurfaceRef, trace_id: TraceId) -> Result<Self, ApplicationError>` | 建立 result shell。 | ID、canonical name、local surface category / ref、trace。 | stored result / error。 | command / consumer receipt / job report save path。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| shell not body | object 只连接 public result surface，不能复制 Command、Consumer、Job response body、payload、adapter result或external truth。 |
| typed replay required | Step 7 / 13 must provide typed save/get/missing result face；有 ref 不等于可以由 fake / implementation猜出结果。 |
| no query result | Query 正常 response不进入 stored-result/idempotency route。 |

### 19.7 `ReadVisibilityDecision`

##### `ReadVisibilityDecision`

```rust
/// Carries the application-local visibility and degradation decision for one body-free read surface.
pub struct ReadVisibilityDecision {
    /// Subject whose projection visibility was evaluated.
    pub subject_ref: ProjectMemberRef,
    /// Projection kind requested by the reader.
    pub projection_kind: MemberProjectionKind,
    /// Effective actor reference from trusted actor context.
    pub actor_ref: ActorRef,
    /// Formal body-free basis used for the evaluation when available.
    pub visibility_basis_ref: Option<ProjectionVisibilityBasisRef>,
    /// Visibility result returned by the domain read policy.
    pub visibility: ProjectionVisibility,
    /// Optional serve posture when the projection is stale or constrained.
    pub serve_disposition: Option<ProjectionServeDisposition>,
    /// Optional degradation surface for public response assembly.
    pub degradation: Option<ProjectionDegradationSurface>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `subject_ref` / `projection_kind` | read target | 固定 policy evaluation scope。 | request + resolver output；must match loaded view/state before assembly。 |
| `actor_ref` | Core actor ref | 记录 effective reader。 | derived from trusted `ActorContext`;does not include actor profile。 |
| `visibility_basis_ref` | optional typed ref | 可见性正式依据。 | source resolver / trusted query contract；missing basis forces restricted / denied / unknown，not Visible。 |
| `visibility` | `ProjectionVisibility` | public visibility surface。 | `ReadProjectionPolicy.evaluate_visibility` only；not a generic authorization result。 |
| `serve_disposition` / `degradation` | optional serve / safe surface | 表达 stale/degraded/not-ready。 | projection state + policy；does not trigger repair。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_visible(&self) -> bool` | 判断是否可返回 full body-free view。 | 无。 | `bool`。 | only `Visible`;not authorization execution。 |
| `pub fn response_disposition(&self) -> ProjectionServeDisposition` | 得到 Query mapper 的 no-write result。 | 无。 | serve disposition。 | Denied / Unknown maps conservatively;does not inspect hidden body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_policy(actor: &ActorContext, visibility_context: ProjectionVisibilityContext, visibility: ProjectionVisibility, serve_disposition: Option<ProjectionServeDisposition>, degradation: Option<ProjectionDegradationSurface>) -> Result<Self, ApplicationError>` | 从 application-resolved context与domain policy结果建立 read decision。 | actor、context、policy outcome、optional state surface。 | decision / error。 | Query service response assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| resolver-first | application必须先获得 `ProjectionVisibilityBasisRef` 或明确missing原因；不得从 loaded view、ID、cursor、actor display name或route推断 visibility。 |
| not-visible surface | Denied / Restricted / Unknown 必须经 explicit response disposition / marker表达；不能只抛 generic error或泄露view body。 |
| no write | decision construction不 reserve idempotency、不 mark stale、不 rebuild、不 refresh。 |

### 19.8 `MemberJobReportAssembly`

##### `MemberJobReportAssembly`

```rust
/// Collects body-free results for one logical member operations job before producing a report surface.
pub struct MemberJobReportAssembly {
    /// Local identity of this in-memory or persisted assembly carrier.
    pub assembly_id: MemberJobReportAssemblyId,
    /// Logical job kind being assembled.
    pub job_kind: MemberOperationsJobKind,
    /// Canonical job operation name.
    pub operation_name: MemberOperationName,
    /// Logical job invocation reference from the operation context.
    pub job_invocation_ref: MemberJobInvocationRef,
    /// Idempotency key for duplicate replay.
    pub idempotency_key: MemberOperationIdempotencyKey,
    /// Ordered unique committed local candidates inspected by the continuation.
    pub scanned_fact_refs: Vec<MemberJobReportFactRef>,
    /// Ordered unique committed local successors produced or selected by the continuation.
    pub advanced_fact_refs: Vec<MemberJobReportFactRef>,
    /// Ordered unique local or foreign typed refs that remain blocked or unknown.
    pub unresolved_refs: Vec<TypedRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `assembly_id` | `MemberJobReportAssemblyId` | assembly identity。 | ID Port；not job invocation / result ID。 |
| `job_kind` / `operation_name` | job kind/name | 固定 report scope。 | jobs entry context；must map 1:1 to one HLD job。 |
| `job_invocation_ref` / `idempotency_key` | logical invocation/key | duplicate relation。 | `MemberOperationContext::from_job`;不声明实际 run / artifact / evidence。 |
| `scanned_fact_refs` / `advanced_fact_refs` | `Vec<MemberJobReportFactRef>` | 保存已提交候选与本次 local successor / derived revision。 | ordered-unique；from named application service outcomes，not worker/job repository scans；`MemberFact` 与 `Projection` 不用并行 collection 再由 runner拼接。 |
| `unresolved_refs` | `Vec<TypedRef>` | 保存 blocked / pending / unknown local或foreign relation。 | ordered-unique；only typed local ref or owner-bound external ref；不能保存 error body、scheduler state或raw job input。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record_scanned_fact(&mut self, fact_ref: MemberJobReportFactRef) -> Result<(), ApplicationError>` | 记录一个已提交候选。 | finite local report ref union。 | success / error。 | adds unique ref only；不调用 adapter，不自行读取 Store 计数。 |
| `pub fn record_advanced_fact(&mut self, fact_ref: MemberJobReportFactRef) -> Result<(), ApplicationError>` | 记录一个已提交 local successor / derived revision。 | finite local report ref union。 | success / error。 | adds unique ref only；不声称 delivery、acceptance、observed或truth repair。 |
| `pub fn record_unresolved(&mut self, ref_: TypedRef) -> Result<(), ApplicationError>` | 记录 blocked / failed / unknown item。 | typed ref。 | success / error。 | adds unique ref only;`MemberJobReport::new` derives `unresolved_count`;does not store adapter error body。 |
| `pub fn finish(self, report_id: MemberJobReportId) -> Result<MemberJobReport, ApplicationError>` | 生成 `contracts::jobs` body-free logical job report。 | ID Port generated report ID + self。 | report / error。 | delegates schema validation to `MemberJobReport::new`;does not persist,run job,write truth或generate evidence。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(assembly_id: MemberJobReportAssemblyId, job_kind: MemberOperationsJobKind, context: &MemberOperationContext) -> Result<Self, ApplicationError>` | 由 jobs operation context与entry fixed kind建立report accumulator。 | ID、kind、validated OperationsJob context。 | assembly / error。 | `job_kind` must match Step 8 entry mapping;five logical job application services。 |
| `pub fn replayed(stored_result: &StoredMemberOperationResult) -> Result<MemberOperationResultRef, ApplicationError>` | 验证 duplicate job 对应 stored report surface。 | stored result shell。 | result ref / error。 | duplicate Job path；requires `JobReport` kind。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| report not run | assembly / `MemberJobReport`只是逻辑 output carrier，不代表实际 job run、artifact、test、evidence、verdict、signoff或readiness。 |
| result detail parity | Step 8 Job response、Step 7 stored result、Step 13 duplicate replay必须保留 `MemberJobReport` 的三组 ref collections / counters或明确同义映射；runner不得自行反查 Store补明细。 |
| no truth repair | job report只报告 local continuation / projection result；不得通过 report 关闭 source gap、修复 Runtime / host / downstream truth。 |

### 19.9 application 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| facade / context / idempotency / stored-result / visibility / report均有独立 carrier | pass_for_current_step | 不通过 mega facade 或 generic map 吞并差异。 |
| Query no-write / idempotency separation | pass | Query context不能 reserve，read decision不写。 |
| duplicate / result shell | pass_with_future_port_work | result ref / shell已闭合；Step 7/13仍须给 typed save/get/missing和canonical digest。 |
| job report non-claim | pass | 没有写 real run、artifact、evidence、test、verdict或readiness。 |
| Step 7 / 8 承接 | ready_for_infra_entry_carriers | Step 7 ports必须为context、idempotency、result、visibility、report字段提供读取 / 写入面。 |

## 20. `infra`：runtime assembly、availability、Store 与 blocked seam carrier

### 20.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 引用经过校验的 member runtime configuration | config loader / validator output | body-free config ref | 无 config body / secret | `MemberRuntimeConfigRef` | Step 14 config binding；Step 7 builder / validation port。 |
| 记录 runtime composition 的本地状态 | config ref、slot availability、safe issues | builder state | not-started / validating / assembling / ready / failed | `MemberRuntimeBuilderState` | Step 7 composition ports；Step 14 config / deployment binding。 |
| 表达 adapter / Store 可用性 | logical slot、config ref、redacted issue | availability marker | enabled / disabled / degraded / unavailable | `MemberAdapterAvailability` | Step 7 adapter result；Step 12 error mapping；Step 14 binding。 |
| 记录 logical Store assembly 状态 | logical Store kind、config ref、availability、safe cursor / issue ref | Store state | no truth body / no product semantics | `MemberInfraStoreState` | Step 7 Store traits；Step 11 persistence。 |
| 保留 upstream 未闭合 seam 的 fail-closed 状态 | blocker ID、seam family、scope、source / reason refs | blocked seam state | pending / blocked / waiting / unknown only | `BlockedSeamState` | Step 7 source / handoff adapters；Step 14 external binding。 |

### 20.2 infra-local values and state enums

```rust
/// References one validated logical Store configuration.
pub struct MemberStoreConfigRef(pub String);

/// References one validated logical adapter configuration.
pub struct MemberAdapterConfigRef(pub String);

/// References a redacted infra validation or availability issue.
pub struct MemberInfraIssueRef(pub String);

/// Identifies one named project-level blocker recorded in the member execution ledger.
pub enum MemberProjectBlockerId {
    /// Host, IPC, credential, or lifecycle contract is not closed.
    Upstream001MemberService,
    /// Image release, manifest, or pinned-entry contract is not closed.
    Upstream002MemberImages,
    /// Runtime entry mapping is not closed.
    Upstream003RuntimeEntry,
    /// Runtime handoff or source-family contract is not closed.
    Upstream004RuntimeMaterial,
    /// Member-specific Core carrier or route is not closed.
    Upstream005CoreMemberCarrier,
    /// Startup credential owner contract is not closed.
    Upstream006Credential,
    /// Screening rule source or taxonomy is not closed.
    Upstream007ScreeningSource,
    /// A third execution subject has no approved contract.
    Upstream008ExecutionSubject,
    /// The target implementation repository does not yet exist.
    DetailedDesign001TargetRepository,
    /// Physical durability, persistence, or unit-of-work contract is not yet decided.
    DetailedDesign002Persistence,
}

/// Classifies one logical member infra assembly slot.
pub enum MemberInfraAdapterSlot {
    /// Local member truth Store implementation.
    LocalTruthStore,
    /// External context mirror support Store implementation.
    MirrorStore,
    /// Read-model projection Store implementation.
    ProjectionStore,
    /// Continuation / attempt / gap support Store implementation.
    ContinuationStore,
    /// Idempotency and stored-result Store implementation.
    IdempotencyResultStore,
    /// Owner-specific safe source resolver implementation.
    SourceResolver,
    /// Host, Runtime, publication, or observation handoff implementation.
    HandoffAdapter,
    /// Clock implementation.
    Clock,
    /// ID generator implementation.
    IdGenerator,
}

/// Classifies runtime availability for one member infra slot.
pub enum MemberAdapterAvailabilityState {
    /// The configured adapter may be injected into the runtime.
    Enabled,
    /// The adapter is intentionally absent under validated configuration.
    DisabledByConfig,
    /// The adapter is usable only with an explicit degraded surface.
    Degraded,
    /// The adapter cannot currently be used.
    Unavailable,
}

/// Classifies local member runtime builder progress.
pub enum MemberRuntimeBuildState {
    /// Validation has not started.
    NotStarted,
    /// Config references and mandatory slots are being validated.
    ValidatingConfig,
    /// Services, Stores, and adapters are being assembled.
    Assembling,
    /// A usable application facade was assembled.
    Ready,
    /// Assembly failed before a usable facade could be exposed.
    Failed,
}

/// Classifies a logical member Store family without naming a product.
pub enum MemberInfraStoreKind {
    /// CP01~05 local interaction truth Store.
    LocalTruth,
    /// CP06 snapshot, resolution, and gap Store.
    MirrorSupport,
    /// CP07 view and projection-state Store.
    Projection,
    /// Attempt / gap continuation Store.
    Continuation,
    /// Idempotency and stored public result Store.
    IdempotencyResult,
}

/// Names an upstream or local seam family that is not positively bound yet.
pub enum BlockedSeamFamily {
    /// Member-service host, IPC, credential, or lifecycle seam.
    MemberService,
    /// Member-images release or pinned-entry seam.
    MemberImages,
    /// Runtime entry mapping seam.
    RuntimeEntry,
    /// Runtime result or safe-material source seam.
    RuntimeMaterial,
    /// Core member event or IPC carrier seam.
    CoreMemberCarrier,
    /// Identity / credential verification seam.
    Credential,
    /// Governance screening-source taxonomy seam.
    ScreeningSource,
    /// Unsupported third execution-subject seam.
    ExecutionSubject,
}

/// Classifies a fail-closed blocked seam posture.
pub enum BlockedSeamDisposition {
    /// A contract is expected but not yet available for positive binding.
    Pending,
    /// A required contract is absent or inconsistent, preventing positive execution.
    Blocked,
    /// A formally requested external resolution is outstanding.
    Waiting,
    /// A side effect or source condition cannot be proven safely.
    Unknown,
}

/// Represents a body-free infra assembly or availability failure.
pub enum InfraError {
    /// A validated configuration or assembly input is absent or inconsistent.
    InvalidConfiguration {
        /// Redacted category describing the invalid configuration boundary.
        reason_category: SafeReasonCategory,
    },
    /// A builder, Store, availability, or blocked-seam carrier violates its contract.
    ContractViolation {
        /// Redacted category describing the violated infra invariant.
        reason_category: SafeReasonCategory,
    },
    /// A mandatory local adapter slot cannot be safely exposed.
    MandatorySlotUnavailable {
        /// Redacted category describing the unavailable slot boundary.
        reason_category: SafeReasonCategory,
    },
}
```

| enum / type | 作用 | 允许来源 | 禁止事项 |
|---|---|---|---|
| config / issue refs | 只标识 validated config / redacted issue。 | infra loader / validator。 | 不保存 raw config、secret、URL、topic、cron、retry、DB或queue产品参数。 |
| `MemberInfraAdapterSlot` | 识别 runtime assembly slot。 | builder assembly plan。 | 不作为业务 route、capability registry 或 source-owner taxonomy。 |
| availability / builder state | 表达技术装配姿态。 | validated config、adapter factory / safe probe result。 | 不改变 domain invariant、CP truth或外部业务状态。 |
| `BlockedSeamFamily` / disposition | 将 `L2M-UP-001~008` 转成明确 fail-closed carrier。 | project ledger / validated blocked adapter outcome。 | 不用 generic success、default adapter或fake integration关闭 blocker。 |
| `MemberProjectBlockerId` | 把 ledger 中的 named blocker 保留为有限、可审计的 typed identity。 | only project execution ledger; implementation / adapter may carry the matching ID forward. | 不以 free-form ticket、error text、URL、commit、run、evidence或readiness替代；`L2M-DDD-001/002`不成为外部成功路径。 |
| `InfraError` | `crates/infra/src/errors.rs` 中唯一的最小 infra error carrier。 | 只含 `SafeReasonCategory`；不含 config / secret / endpoint body、adapter response、stack trace、domain state或 retry / recovery policy。Step 12 才展开错误映射。 |

### 20.3 `MemberRuntimeConfigRef`

##### `MemberRuntimeConfigRef`

```rust
/// References a validated member runtime configuration without exposing config body.
pub struct MemberRuntimeConfigRef(pub String);
```

| 成员函数 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_present(&self) -> bool` | 判断 config reference 是否非空。 | 无。 | `bool`。 | pure;does not load config。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_validated_ref(value: String) -> Result<Self, InfraError>` | 建立 validated config ref。 | loader / validator supplied reference only。 | ref / error。 | runtime builder bootstrap。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ref-only | 本类型不携带 YAML / TOML / env、secret、endpoint、path、image digest、container / sandbox policy或 deployment topology。 |
| no semantic override | config ref不改变 CP01~07 的 owner、state machine、body boundary、visibility或unknown fence。 |

### 20.4 `MemberAdapterAvailability`

##### `MemberAdapterAvailability`

```rust
/// Records the redacted runtime availability of one member infra slot.
pub struct MemberAdapterAvailability {
    /// Logical slot described by the marker.
    pub slot: MemberInfraAdapterSlot,
    /// Validated configuration ref for the selected adapter.
    pub adapter_config_ref: MemberAdapterConfigRef,
    /// Current availability posture.
    pub state: MemberAdapterAvailabilityState,
    /// Redacted issue when the slot is degraded or unavailable.
    pub issue_ref: Option<MemberInfraIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `slot` / `adapter_config_ref` | slot / validated config ref | 定位一个technical adapter。 | builder assembly plan；不含 instance、URL、credential或 provider body。 |
| `state` | availability enum | 表达技术可注入性。 | validator / factory safe result；not business health / authorization。 |
| `issue_ref` | optional safe issue ref | 说明非正常姿态。 | Degraded / Unavailable must be Some；issue redacted。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_usable(&self) -> bool` | 判断能否被 builder 注入。 | 无。 | `bool`。 | Enabled / Degraded true；does not invoke adapter。 |
| `pub fn requires_degraded_surface(&self) -> bool` | 判断调用方是否必须暴露 degraded / unavailable。 | 无。 | `bool`。 | Degraded / Unavailable true；does not mutate domain。 |
| `pub fn mark_degraded(&self, issue_ref: MemberInfraIssueRef) -> Result<Self, InfraError>` | 建立 degraded successor marker。 | redacted issue。 | successor marker。 | no application / domain truth write。 |
| `pub fn mark_unavailable(&self, issue_ref: MemberInfraIssueRef) -> Result<Self, InfraError>` | 建立 unavailable successor marker。 | redacted issue。 | successor marker。 | no fallback positive path。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn enabled(slot: MemberInfraAdapterSlot, adapter_config_ref: MemberAdapterConfigRef) -> Result<Self, InfraError>` | 创建 enabled marker。 | slot/config ref。 | marker / error。 | adapter factory success。 |
| `pub fn disabled_by_config(slot: MemberInfraAdapterSlot, adapter_config_ref: MemberAdapterConfigRef, issue_ref: Option<MemberInfraIssueRef>) -> Result<Self, InfraError>` | 创建 deliberate disabled marker。 | slot/config / optional issue。 | marker / error。 | optional adapter not configured。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| technical only | Enabled不等于 host / Runtime / Bus / Tools / downstream external success；Unavailable不改写 local truth。 |
| safe issue only | issue不得包含 secret、payload、SQL、HTTP body、stack trace或 provider error body。 |

### 20.5 `MemberRuntimeBuilderState`

##### `MemberRuntimeBuilderState`

```rust
/// Tracks member runtime assembly before exposing the application facade.
pub struct MemberRuntimeBuilderState {
    /// Validated runtime configuration selected for this build.
    pub config_ref: MemberRuntimeConfigRef,
    /// Current builder lifecycle.
    pub build_state: MemberRuntimeBuildState,
    /// Ordered unique adapter availability markers observed during assembly.
    pub adapter_availability: Vec<MemberAdapterAvailability>,
    /// Ordered unique redacted build issues.
    pub issue_refs: Vec<MemberInfraIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `config_ref` | config ref | 固定本次assembly配置。 | validated loader output。 |
| `build_state` | builder enum | assembly lifecycle。 | transition methods；Ready前不得expose facade。 |
| `adapter_availability` | `Vec<MemberAdapterAvailability>` | slots availability。 | ordered-unique by slot；no adapter instance。 |
| `issue_refs` | `Vec<MemberInfraIssueRef>` | build safe issue list。 | ordered-unique/redacted；no config body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn start_validation(&self) -> Result<Self, InfraError>` | 进入 configuration validation。 | 无。 | successor state。 | NotStarted -> ValidatingConfig only。 |
| `pub fn start_assembly(&self) -> Result<Self, InfraError>` | 进入 composition assembly。 | 无。 | successor state。 | ValidatingConfig -> Assembling；blocking slots may not be unavailable。 |
| `pub fn record_adapter(&self, availability: MemberAdapterAvailability) -> Result<Self, InfraError>` | 追加 / replace one slot marker。 | availability marker。 | successor state。 | slot unique；does not build adapter instance。 |
| `pub fn mark_ready(&self) -> Result<Self, InfraError>` | 标记可暴露 facade。 | 无。 | successor state。 | Assembling -> Ready only；mandatory blocked seam cannot be presented as enabled。 |
| `pub fn mark_failed(&self, issue_ref: MemberInfraIssueRef) -> Result<Self, InfraError>` | 标记assembly失败。 | safe issue。 | successor state。 | any non-ready -> Failed；no half runtime exposed。 |
| `pub fn can_expose_facade(&self) -> bool` | 判断 facade exposure。 | 无。 | `bool`。 | Ready only。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_config(config_ref: MemberRuntimeConfigRef) -> Self` | 建立未开始builder state。 | validated config ref。 | state。 | infra runtime builder start。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no half runtime | Failed / validating / assembling状态不得让 api / worker / jobs 接收正向请求。 |
| no lifecycle ownership | builder state不拥有 container、image、sandbox、host lifecycle或 physical process truth。 |

### 20.6 `MemberInfraStoreState`

##### `MemberInfraStoreState`

```rust
/// Tracks logical Store assembly state without exposing persistence product details.
pub struct MemberInfraStoreState {
    /// Logical Store family.
    pub store_kind: MemberInfraStoreKind,
    /// Validated Store configuration reference.
    pub store_config_ref: MemberStoreConfigRef,
    /// Availability of the Store adapter slot.
    pub availability: MemberAdapterAvailability,
    /// Last body-free projection / local fact watermark observed by this Store.
    pub last_observed_watermark: Option<ProjectionWatermark>,
    /// Ordered unique redacted failure refs.
    pub issue_refs: Vec<MemberInfraIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `store_kind` / `store_config_ref` | logical kind / config ref | 识别 Store assembly。 | runtime config / builder;does not bind DB product。 |
| `availability` | availability marker | Store technical posture。 | slot must match Store kind。 |
| `last_observed_watermark` | optional Core watermark | 提供 last safe observed position。 | Store operation result；not optimistic version / source version / page cursor。 |
| `issue_refs` | safe issue refs | Store failures。 | ordered-unique、redacted；does not store query / record body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_watermark(&self, watermark: ProjectionWatermark) -> Result<Self, InfraError>` | 更新 observed watermark marker。 | Core watermark。 | successor state。 | does not save / mutate truth。 |
| `pub fn record_issue(&self, issue_ref: MemberInfraIssueRef) -> Result<Self, InfraError>` | 追加 Store issue。 | safe issue ref。 | successor state。 | no persistence / external body write。 |
| `pub fn is_usable(&self) -> bool` | 判断 Store是否可注入。 | 无。 | `bool`。 | delegates availability；does not probe product。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_config(store_kind: MemberInfraStoreKind, store_config_ref: MemberStoreConfigRef, availability: MemberAdapterAvailability) -> Result<Self, InfraError>` | 由validated Store config创建 state。 | kind/config/availability。 | state / error。 | builder Store assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no persistence schema | state不定义 table、collection、SQL、ORM、cache、queue、durability或transaction。 |
| no owner shift | Store state不持有 foreign truth；availability不改变 Domain policy。 |

### 20.7 `BlockedSeamState`

##### `BlockedSeamState`

```rust
/// Records a fail-closed member seam that lacks a positive formally bound adapter contract.
pub struct BlockedSeamState {
    /// Project ledger blocker that requires this fail-closed state.
    pub blocker_id: MemberProjectBlockerId,
    /// Named seam family constrained by the project blocker ledger.
    pub seam_family: BlockedSeamFamily,
    /// Current fail-closed disposition.
    pub disposition: BlockedSeamDisposition,
    /// Optional external reference involved in the blocked operation.
    pub seam_ref: Option<ExternalTypedRef>,
    /// Optional local neutral resolution explaining the posture.
    pub resolution_ref: Option<ExternalContextResolutionId>,
    /// Optional local gap explaining the posture.
    pub gap_ref: Option<ExternalContextGapId>,
    /// Redacted blocker / unknown reason.
    pub safe_reason: SafeReasonCategory,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `blocker_id` / `seam_family` | finite enum | 对应 project ledger 与 upstream / local unbound seam。 | named ledger ID + matching adapter slot；not a generic external provider。 |
| `disposition` | blocked enum | 明确 pending / blocked / waiting / unknown。 | validated blocked adapter result / gap status；never positive success。 |
| `seam_ref` / `resolution_ref` / `gap_ref` | optional typed refs | 回链已知 source evidence。 | absence remains explicit；not synthesized from config or strings。 |
| `safe_reason` | safe category | 可审查但无正文的原因。 | ledger / policy / adapter safe output；non-empty。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn blocks_positive_path(&self) -> bool` | 判断是否阻断正向调用。 | 无。 | `bool`。 | always true for all four dispositions。 |
| `pub fn is_waiting_for_resolution(&self) -> bool` | 判断是否有 formal resolution pending。 | 无。 | `bool`。 | true only Waiting；does not start a refresh。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_blocker(blocker_id: MemberProjectBlockerId, seam_family: BlockedSeamFamily, disposition: BlockedSeamDisposition, seam_ref: Option<ExternalTypedRef>, resolution_ref: Option<ExternalContextResolutionId>, gap_ref: Option<ExternalContextGapId>, safe_reason: SafeReasonCategory) -> Result<Self, InfraError>` | 建立明确的 fail-closed seam state。 | matching named blocker / safe refs only。 | state / error。 | `infra::blocked_seams` adapter slot、builder validation。 |

| 不变量 / 禁止事�� | 说明 |
|---|---|
| no fake success | `L2M-UP-001~008`尚未关闭时，blocked seam不得返回 submission、receipt、acceptance、delivery、observed或ready成功对象；`L2M-DDD-001/002`同样不得被 adapter / Store 默认值掩盖。 |
| no scope expansion | state只描述本仓 adapter slot，不替代 sibling owner contract，不创建 IPC / route / image / sandbox / lifecycle schema。 |

### 20.8 infra 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| config / builder / availability / Store / blocked seam carrier均已闭合 | pass_for_current_step | 都只保存 ref、state、safe issue，不绑定产品实现。 |
| upstream blockers未伪造关闭 | pass | `BlockedSeamState`只表达 pending / blocked / waiting / unknown。 |
| config / lifecycle外置 | pass | 无 raw config、image、container、sandbox、process / deployment detail。 |
| Step 7 / 14 承接 | ready_for_entry_carriers | Step 7定义Port / blocked adapter；Step 14定义config key、validation与external binding。 |

## 21. `api`：Command / Query logical entry carrier

### 21.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 将一个已解析的 Command 边界转换为 application context | logical entry identity、canonical operation、trusted actor、Core command metadata、normalized key / trace | validated command entry / `MemberOperationContext` | 只做 pre-application validation；可形成 rejected shell | `MemberCommandEntry` | Step 7 context / result Port；Step 8 ten Command DTO；Step 9 command flow。 |
| 将一个已解析的 Query 边界转换为 no-write application context | logical entry identity、canonical operation、trusted actor、Core query metadata / trace | validated query entry / `MemberOperationContext` | no-write；可形成 rejected shell | `MemberQueryEntry` | Step 7 read / visibility Port；Step 8 sixteen Query DTO；Step 9 query flow。 |
| 用 transport-neutral result shell 表达 command / duplicate / query surface / rejection | entry、application result ref或read disposition、safe issues | handler result shell | 不序列化 protocol body、不访问 Store | `MemberApiHandlerResult` | Step 8 response schema；Step 12 protocol error mapping。 |
| 记录 logical Command / Query entry 已装配状态 | entry refs、safe registration issue | registry state | register / lookup only；无 server / route / middleware | `MemberApiRegistryState` | Step 7 runtime builder Port；Step 14 configuration binding。 |

### 21.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `MemberCommandEntry` | Command metadata validation 与 application context translation | entry object | actor / metadata / key / trace一致性、rejected shell | 不解析 HTTP / RPC / UDS，不直接写 domain / Store，不调用 adapter。 |
| `MemberQueryEntry` | Query metadata validation 与 no-write context translation | entry object | actor / metadata / trace一致性、Query no-write guard | 不 reserve 幂等、不刷新 / rebuild / resolve，不使用 Command metadata。 |
| `MemberApiHandlerResult` | API boundary 的最小成功 / duplicate / read / rejection 分类 | result shell | result / read disposition / redacted issue分层 | 不携带 request / response body、transport status、auth profile、route path 或 external truth。 |
| `MemberApiRegistryState` | Command / Query logical entry registration | runtime assembly state | ordered-unique register / lookup | 不绑定 listener、endpoint、server lifecycle、middleware、schema或route。 |

### 21.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `MemberCommandEntry` | 验证 Command boundary并构造 write context | logical entry ref、operation、actor、CommandMetadata、normalized key、trace、safe issues | `from_inbound(...)` | `to_operation_context`、`assert_metadata_complete`、`reject` | `MemberApiEntryKind::Command` | Step 8 parsed command + trusted boundary metadata；trace从 metadata复制。 |
| `MemberQueryEntry` | 验证 Query boundary并构造 no-write context | logical entry ref、operation、actor、QueryMetadata、trace、safe issues | `from_inbound(...)` | `to_operation_context`、`assert_query_metadata_complete`、`reject` | `MemberApiEntryKind::Query` | Step 8 parsed query + trusted boundary metadata；trace从 metadata复制。 |
| `MemberApiHandlerResult` | 表达 entry result而不携带协议正文 | entry kind / ref、operation、disposition、optional stored result、optional read surface、safe issues | named result factories | `is_rejected`、`is_query_surface`、`assert_body_free` | `MemberApiHandlerDisposition` | entry + application return / `ReadVisibilityDecision` copied safe values。 |
| `MemberApiRegistryState` | 注册 logical entry | command / query ref collections、safe issues | `empty()` | `register_command`、`register_query`、`has_entry`、`record_issue` | 无 domain state | API runtime builder / validated assembly plan；不从 path / port / handler class推导。 |

### 21.4 api-local values and state enums

```rust
/// Identifies one logical API entry without naming a transport route.
pub struct MemberApiEntryRef(pub String);

/// References a redacted API validation or registration issue.
pub struct MemberApiValidationIssueRef(pub String);

/// Classifies whether a logical API entry accepts a command or a query.
pub enum MemberApiEntryKind {
    /// The entry accepts a write-capable command.
    Command,
    /// The entry accepts a read-only query.
    Query,
}

/// Classifies a transport-neutral API handler outcome.
pub enum MemberApiHandlerDisposition {
    /// A command completed with a locally stored result surface.
    CommandAccepted,
    /// A duplicate command was replayed from an existing stored result surface.
    DuplicateReplayed,
    /// A query returned a body-free current or explicitly stale-allowed surface.
    QueryServed,
    /// A query returned an explicitly degraded body-free surface.
    QueryDegraded,
    /// A query could not satisfy its explicit consistency requirement.
    QueryNotReady,
    /// A query could not expose its body-free view under the visibility policy.
    QueryNotVisible,
    /// The entry was rejected before application execution.
    Rejected,
}

/// Represents a redacted API entry or result-contract failure.
pub enum ApiError {
    /// Entry metadata, trace correlation, or no-write boundary is invalid.
    InvalidEntry {
        /// Redacted issue identifying the failed boundary check.
        issue_ref: MemberApiValidationIssueRef,
    },
    /// A requested entry or result combination violates this Step 6 carrier contract.
    ContractViolation {
        /// Redacted issue identifying the violated carrier rule.
        issue_ref: MemberApiValidationIssueRef,
    },
    /// Application-context construction failed after a validated API boundary mapping.
    ApplicationContext {
        /// Redacted issue identifying the application boundary failure.
        issue_ref: MemberApiValidationIssueRef,
    },
}
```

| enum / type | 作用 | 允许来源 | 禁止事项 |
|---|---|---|---|
| `MemberApiEntryRef` | 标识一个 logical API assembly entry。 | API registry builder通过 ID Port / validated assembly plan创建。 | 不使用 HTTP path、RPC method、UDS path、host、port、process ID或SDK route替代。 |
| `MemberApiValidationIssueRef` | 指向安全的边界校验问题。 | API validation / registry assembly。 | 不保存 request body、metadata body、secret、actor profile、stack trace或transport response。 |
| `MemberApiEntryKind::{Command,Query}` | 固定 write / no-write boundary。 | `MemberCommandEntry` / `MemberQueryEntry` factory。 | 不允许一个 entry 同时属于二者，或用 runtime flag 将 Query升级为写入口。 |
| `MemberApiHandlerDisposition::*` | 将 handler outcome 与 domain / external truth分离。 | result factory + validated application / read result。 | `CommandAccepted`不等于 host / Runtime / downstream acceptance；`QueryServed`不等于 source current、authorization或invocation。 |
| `ApiError` | API crate 的最小 body-free entry / result carrier error。 | only local validation、contract guard，或 redacted application-context mapping。 | 不携带 Command / Query body、metadata body、actor profile、HTTP / RPC status、route、stack trace、secret、application error internals 或 adapter response。 |

| `ApiError` variant | 触发条件 | 当前处理边界 |
|---|---|---|
| `InvalidEntry` | required actor / metadata / normalized key / trace / no-write marker 缺失或不一致。 | API 形成 `Rejected` shell；不进入 application。 |
| `ContractViolation` | entry-kind、disposition、optional result / read posture 或 issue collection 组合不相容。 | 拒绝构造不一致 carrier；不得把 Query 改写为 Command 或掩盖 read posture。 |
| `ApplicationContext` | `MemberOperationContext` factory 返回 application-side validation failure。 | 只接收 Step 12 将提供的 redacted mapping；不得暴露 `ApplicationError` 内部结构。 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Command` | `The entry accepts a write-capable command.` | 标识 Command entry。 | command factory。 | command context / command handler result。 |
| `Query` | `The entry accepts a read-only query.` | 标识 Query entry。 | query factory。 | query context / query handler result。 |
| `CommandAccepted` | `A command completed with a locally stored result surface.` | 本地 command 结果可被引用。 | application saved local result。 | Step 8 response mapper。 |
| `DuplicateReplayed` | `A duplicate command was replayed from an existing stored result surface.` | 同 key / digest 的已存结果回放。 | idempotency Store result。 | Step 8 response mapper；Step 13 duplicate audit。 |
| `QueryServed` | `A query returned a body-free current or explicitly stale-allowed surface.` | 返回 allowed read surface。 | read policy + query service。 | Step 8 response mapper。 |
| `QueryDegraded` | `A query returned an explicitly degraded body-free surface.` | 返回受限 safe surface。 | projection state + read policy。 | Step 8 response mapper。 |
| `QueryNotReady` | `A query could not satisfy its explicit consistency requirement.` | 不能满足 explicit watermark。 | projection state + read policy。 | Step 8 not-ready response。 |
| `QueryNotVisible` | `A query could not expose its body-free view under the visibility policy.` | visibility policy禁止 view body。 | `ReadVisibilityDecision`。 | Step 8 not-visible response。 |
| `Rejected` | `The entry was rejected before application execution.` | metadata / mapping validation failure。 | API safe rejection surface。 | Step 12 API error mapping。 |

`ApiError` 在 planned `crates/api/src/errors.rs` 有且仅有这一名称；它不替代 `MemberContractError`、`DomainError`、future `ApplicationError`、`InfraError`、`WorkerError`、`JobError` 或 Step 8 protocol rejection。具体 error tree、retry / recovery 和 transport mapping仍留 Step 12。所有当前 `ApiError` 返回都必须先把失败转换为已有或由 Step 8 / 12 定义的 `MemberApiValidationIssueRef`，不得泄露跨层错误正文。

### 21.5 `MemberCommandEntry`

##### `MemberCommandEntry`

```rust
/// Represents one validated logical command entry before application execution.
pub struct MemberCommandEntry {
    /// Logical API entry handling the command.
    pub entry_ref: MemberApiEntryRef,
    /// Canonical member application operation selected by the entry mapping.
    pub operation_name: MemberOperationName,
    /// Trusted actor context supplied by the inbound boundary.
    pub actor: ActorContext,
    /// Core command metadata preserved without copying the command body.
    pub metadata: CommandMetadata,
    /// Normalized write idempotency key derived from command metadata.
    pub idempotency_key: MemberOperationIdempotencyKey,
    /// Core trace identity copied from command metadata.
    pub trace_id: TraceId,
    /// Ordered unique redacted issues discovered before application execution.
    pub validation_issue_refs: Vec<MemberApiValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `operation_name` | logical entry / canonical operation | 固定 API 到 application 的非 transport 映射。 | registry mapping；operation 必须映射 `MemberServiceRoute`；不从 route / class name推断。 |
| `actor` / `metadata` / `trace_id` | Core carrier / trace | 传递可信 actor与 Command metadata。 | trusted boundary；`trace_id` 必须等于 `metadata.request.trace_id`；api不做认证。 |
| `idempotency_key` | normalized key | 防止 command duplicate。 | only Core command metadata 的 accepted idempotency value；缺失即 rejected；不从 trace / subject / clock派生。 |
| `validation_issue_refs` | `Vec<MemberApiValidationIssueRef>` | 保存 entry safe failures。 | ordered-unique；accepted path为空；不保存 command body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self, context_id: MemberOperationContextId) -> Result<MemberOperationContext, ApiError>` | 构造 application command context。 | ID Port 已生成的 context ID。 | context / error。 | 调用 `MemberOperationContext::from_command`;不调用 service或Store。 |
| `pub fn assert_metadata_complete(&self) -> Result<(), ApiError>` | 验证 actor / metadata / key / trace匹配。 | 无。 | success / error。 | 缺失或trace不匹配时fail closed；不检查 request body。 |
| `pub fn reject(&mut self, issue_ref: MemberApiValidationIssueRef) -> Result<MemberApiHandlerResult, ApiError>` | 建立 pre-application rejection shell。 | redacted issue。 | result / error。 | 追加 unique issue；不调用 application。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_inbound(entry_ref: MemberApiEntryRef, operation_name: MemberOperationName, actor: ActorContext, metadata: CommandMetadata, idempotency_key: MemberOperationIdempotencyKey, trace_id: TraceId) -> Result<Self, ApiError>` | 从已解析 Command boundary建立 entry。 | logical entry、canonical operation、trusted actor、Core metadata、normalized key、copied trace。 | entry / error。 | Step 8 Command handler mapping；factory检查 trace equality。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| command-only | entry 必须只生成 `MemberOperationChannel::Command` context；不得携带 Query metadata、source event或job invocation。 |
| no direct mutation | API 不能直接调用 domain transition、repository、UoW、resolver、publisher或host / Runtime adapter。 |
| no protocol assumption | entry 不冻结 HTTP / RPC / UDS、path、status code、serialization、middleware或session lifecycle。 |

### 21.6 `MemberQueryEntry`

##### `MemberQueryEntry`

```rust
/// Represents one validated no-write logical query entry before application execution.
pub struct MemberQueryEntry {
    /// Logical API entry handling the query.
    pub entry_ref: MemberApiEntryRef,
    /// Canonical member application operation selected by the entry mapping.
    pub operation_name: MemberOperationName,
    /// Trusted actor context supplied by the inbound boundary.
    pub actor: ActorContext,
    /// Core query metadata preserved without copying query transport body.
    pub metadata: QueryMetadata,
    /// Core trace identity copied from query metadata.
    pub trace_id: TraceId,
    /// Ordered unique redacted issues discovered before application execution.
    pub validation_issue_refs: Vec<MemberApiValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `operation_name` | logical entry / canonical operation | 固定 Query 到 application read service的映射。 | registry mapping；不得由 endpoint / cursor / view kind猜 operation。 |
| `actor` / `metadata` / `trace_id` | Core carrier / trace | 保留可信读者和 Query metadata。 | trusted boundary；`trace_id == metadata.request.trace_id`；不保存 actor profile。 |
| `validation_issue_refs` | `Vec<MemberApiValidationIssueRef>` | 记录安全 validation issue。 | ordered-unique；served path为空；不保存 query body、visibility basis body或view正文。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self, context_id: MemberOperationContextId) -> Result<MemberOperationContext, ApiError>` | 构造 no-write application query context。 | ID Port 已生成 context ID。 | context / error。 | 调用 `MemberOperationContext::from_query`;不触发 refresh / rebuild / reserve。 |
| `pub fn assert_query_metadata_complete(&self) -> Result<(), ApiError>` | 验证 actor / metadata / trace。 | 无。 | success / error。 | 缺失或trace不匹配则 rejected。 |
| `pub fn assert_no_write_markers(&self) -> Result<(), ApiError>` | 守护 Query 不持 write marker。 | 无。 | success / error。 | Query不得传 idempotency、source event、job invocation或command metadata。 |
| `pub fn reject(&mut self, issue_ref: MemberApiValidationIssueRef) -> Result<MemberApiHandlerResult, ApiError>` | 建立 pre-application rejection shell。 | redacted issue。 | result / error。 | 追加 unique issue；不读 / 写 projection。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_inbound(entry_ref: MemberApiEntryRef, operation_name: MemberOperationName, actor: ActorContext, metadata: QueryMetadata, trace_id: TraceId) -> Result<Self, ApiError>` | 从已解析 Query boundary建立 entry。 | logical entry、canonical operation、trusted actor、Core metadata、copied trace。 | entry / error。 | Step 8 Query handler mapping；factory检查 trace equality。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| query-no-write | entry 只能生成 `MemberOperationChannel::Query`；不得 reserve idempotency、创建 local fact、mark stale、refresh、rebuild或dispatch job。 |
| visibility unresolved | visibility basis不存在时，entry仍可交 application 形成 conservative decision；不得在 API 层以 actor label、route、cursor或空结果推断可见性。 |
| no transport truth | Query served / rejected不代答 cache、Bus、Runtime、host或external source state。 |

### 21.7 `MemberApiHandlerResult`

##### `MemberApiHandlerResult`

```rust
/// Carries a body-free transport-neutral result of one logical API handler.
pub struct MemberApiHandlerResult {
    /// Kind of entry that produced this result.
    pub entry_kind: MemberApiEntryKind,
    /// Logical entry that produced this result.
    pub entry_ref: MemberApiEntryRef,
    /// Canonical application operation handled by the entry.
    pub operation_name: MemberOperationName,
    /// Transport-neutral handler outcome.
    pub disposition: MemberApiHandlerDisposition,
    /// Stored application result for accepted or duplicate command paths.
    pub application_result_ref: Option<MemberOperationResultRef>,
    /// Query visibility result when the entry handled a query.
    pub visibility: Option<ProjectionVisibility>,
    /// Query serving posture when the entry handled a query.
    pub serve_disposition: Option<ProjectionServeDisposition>,
    /// Ordered unique redacted validation issues for rejected paths.
    pub validation_issue_refs: Vec<MemberApiValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_kind` / `entry_ref` / `operation_name` | entry identity | 回链入口和用例。 | copied from entry；不得从 result ref / response body反推。 |
| `disposition` | `MemberApiHandlerDisposition` | 公开 handler-level outcome。 | named factory根据 application result / read decision建立；不是 domain state。 |
| `application_result_ref` | `Option<MemberOperationResultRef>` | command fresh / duplicate stored result指针。 | `CommandAccepted` / `DuplicateReplayed`必须Some；所有Query和Rejected必须None。 |
| `visibility` / `serve_disposition` | optional public read values | 表达 Query visibility和serving posture。 | Query必须由 `ReadVisibilityDecision`安全复制；Command必须None；不得含view body。 |
| `validation_issue_refs` | `Vec<MemberApiValidationIssueRef>` | pre-application rejection说明。 | `Rejected`必须non-empty；其他disposition必须empty。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_rejected(&self) -> bool` | 判断是否 pre-application rejected。 | 无。 | `bool`。 | 纯函数。 |
| `pub fn is_query_surface(&self) -> bool` | 判断是否为 Query result shell。 | 无。 | `bool`。 | 只在 `entry_kind == Query`时为真；不读取结果 body。 |
| `pub fn assert_body_free(&self) -> Result<(), ApiError>` | 审计 handler result 无正文。 | 无。 | success / error。 | 只允许 refs、enum和safe issue；不访问 protocol response。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn command_accepted(entry: &MemberCommandEntry, result_ref: MemberOperationResultRef) -> Result<Self, ApiError>` | 建立 fresh command result shell。 | validated entry、stored result ref。 | result / error。 | application command completion。 |
| `pub fn duplicate_replayed(entry: &MemberCommandEntry, result_ref: MemberOperationResultRef) -> Result<Self, ApiError>` | 建立 duplicate replay shell。 | validated entry、stored matching result ref。 | result / error。 | idempotency duplicate path。 |
| `pub fn query_surface(entry: &MemberQueryEntry, decision: &ReadVisibilityDecision) -> Result<Self, ApiError>` | 建立 Query surface shell。 | validated entry、application read decision。 | result / error。 | Query response mapping；disposition由 visible / serve posture确定。 |
| `pub fn rejected(entry_kind: MemberApiEntryKind, entry_ref: MemberApiEntryRef, operation_name: MemberOperationName, issue_refs: Vec<MemberApiValidationIssueRef>) -> Result<Self, ApiError>` | 建立 pre-application rejection shell。 | entry identity、non-empty ordered-unique safe issues。 | result / error。 | metadata / mapping validation failure。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| result ownership | result shell不替代 Step 8 response DTO，不保存 command / query / transport body，也不成为 stored result body。 |
| explicit read posture | `QueryServed` 必须 `visibility == Some(Visible)` 且 `serve_disposition == Some(Current or Stale)`；`QueryDegraded` 必须 `visibility == Some(Visible or Restricted)` 且 `serve_disposition == Some(Degraded)`；`QueryNotReady` 必须 `serve_disposition == Some(NotReady)`；`QueryNotVisible` 必须 `visibility == Some(Denied or Unknown)` 且 `serve_disposition == Some(NotVisible)`。每一种 Query disposition 的 `application_result_ref` 均为 None、issues均为空，不能压平为 generic success / error。 |
| entry/result compatibility | `CommandAccepted` / `DuplicateReplayed` 只能由 Command entry形成，且必须有 `application_result_ref`、没有 visibility / serve disposition；`Rejected` 可来自 Command或Query、必须 non-empty issues、没有 application result / read posture。违反组合由 `ApiError::ContractViolation` 返回。 |
| no false success | command result只代表可证明的 member-local result；绝不等于 host、Runtime、Bus、Conversation、Tools、Method或downstream accepted / delivered / observed。 |

### 21.8 `MemberApiRegistryState`

##### `MemberApiRegistryState`

```rust
/// Records logical API entries assembled for the member runtime without binding a transport.
pub struct MemberApiRegistryState {
    /// Ordered unique command entry identities.
    pub command_entry_refs: Vec<MemberApiEntryRef>,
    /// Ordered unique query entry identities.
    pub query_entry_refs: Vec<MemberApiEntryRef>,
    /// Ordered unique redacted assembly issues.
    pub validation_issue_refs: Vec<MemberApiValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `command_entry_refs` / `query_entry_refs` | `Vec<MemberApiEntryRef>` | 保存已装配 logical entry identities。 | each collection ordered-unique；两组不得交集；不保存 route / endpoint / handler instance。 |
| `validation_issue_refs` | `Vec<MemberApiValidationIssueRef>` | 保存 assembly safe issues。 | ordered-unique、redacted；不含 config或transport body。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn register_command(&mut self, entry_ref: MemberApiEntryRef) -> Result<(), ApiError>` | 注册一个 Command entry。 | logical entry ref。 | success / error。 | 只改变 registry carrier；拒绝重复或query交集。 |
| `pub fn register_query(&mut self, entry_ref: MemberApiEntryRef) -> Result<(), ApiError>` | 注册一个 Query entry。 | logical entry ref。 | success / error。 | 只改变 registry carrier；拒绝重复或command交集。 |
| `pub fn has_entry(&self, entry_ref: &MemberApiEntryRef) -> bool` | 检查 entry是否已经注册。 | logical entry ref。 | `bool`。 | 纯函数；不启动listener。 |
| `pub fn record_issue(&mut self, issue_ref: MemberApiValidationIssueRef) -> Result<(), ApiError>` | 记录 assembly safe issue。 | redacted issue。 | success / error。 | 不保存 config / request / route body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn empty() -> Self` | 建立空 API registry。 | 无。 | registry。 | infra runtime assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| logical-only | registry不定义 HTTP / RPC / UDS、path、method、port、listener、auth middleware或server lifecycle。 |
| application-only | registered handler只能构造 `MemberOperationContext`并调用 application facade / named service；不得直接访问 domain / Store / adapter。 |
| no activation claim | registry存在或entry注册不表示 runtime builder ready、host accepted、endpoint exposed或API可达。 |

### 21.9 api 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command / Query entry都有唯一稳定 carrier | pass_for_current_step | entry、result和registry均已闭口，DTO body / route留后续Step。 |
| Query no-write与command idempotency分离 | pass | Query entry没有key / write marker；Command entry必须有metadata / key / trace。 |
| transport / external owner未越界 | pass_with_upstream_blockers | 不设 HTTP / RPC / UDS、member event route或host API；`L2M-UP-001/005`仍不关闭。 |
| result / read surface未伪造外部成功 | pass | command stored result与read posture均是member-side boundary，body / external truth不进入。 |
| Step 7 / 8 承接 | ready_for_worker_entry_carriers | Step 7定义context / result / visibility / registry builder Ports；Step 8定义10 Command、16 Query DTO与response mapping。 |

## 22. `worker`：owner-specific Consumer、committed-fact re-entry 与安全 dispatch carrier

### 22.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 将一个外部或已提交本地事实输入固定为可验证的 Consumer entry | logical entry、有限 consumer kind、source identity、schema、dedup、trace、body gate | `MemberInboundConsumerEntry` | 只形成 boundary carrier；不保存 payload、不确认 broker delivery | `MemberInboundConsumerEntry` | Step 7 context / receipt / source Port；Step 8 14 Consumer DTO；Step 9 consumer flow。 |
| 用 body-free item disposition 表达 consumer 的本地处理边界 | entry、local stored result ref 或 safe issue / unresolved refs | `MemberConsumerItemResult` | accepted / duplicate / late / blocked / refused 分类；不是 ack、DLQ 或 external acceptance | `MemberConsumerItemResult` | Step 8 consumer receipt；Step 12 error mapping；Step 13 duplicate rule。 |
| 从已提交 member fact 构造严格受限的本地重入上下文 | committed fact、target Consumer、schema / dedup / trace | `MemberContinuationDispatchContext` | 无 event publish、queue、polling 或 scheduler state | `MemberContinuationDispatchContext` | Step 7 continuation / result Port；Step 8 internal Consumer DTO；Step 9 local re-entry flow。 |
| 装配并审计 logical Consumer declaration | entry ref、consumer kind、safe assembly issue | worker registry carrier | register / lookup only；不启动 listener 或 worker process | `MemberWorkerRegistryState` | Step 7 composition Port；Step 14 binding。 |

### 22.2 14 个 Consumer 的唯一 kind / source 覆盖

`worker` 可以复用 **boundary skeleton**，不能复用为 generic external consumer。每一项都先由自身 owner-specific validation / source mapping 形成安全 entry，再调用 application；exact envelope、source schema、route、broker、ack、ordering implementation 与 adapter activation 均仍留 Step 7~14，且受 `L2M-UP-001/003/004/005/006/007` 约束。

| HLD Consumer | finite worker kind | source shape | 唯一允许的 member-side结果上限 | 不得形成 |
|---|---|---|---|---|
| `HostFeedbackConsumer` | `External::HostFeedback` | external event + `HostFeedbackRef` in Step 8 DTO | CP01 feedback link / gap classification / safe receipt | host accepted、session、health或lifecycle truth。 |
| `InboundFactConsumer` | `External::InboundFact` | external event + authorized transient inspection summary | CP02 fact / screening / safe receipt | raw body persistence、Bus delivery proof或Governance rule truth。 |
| `RuntimeMaterialConsumer` | `External::RuntimeMaterial` | Runtime safe-material event + typed refs | CP03 reception / safe receipt | Runtime run、context、plan、outcome或tool body。 |
| `DeliveryFeedbackConsumer` | `External::DeliveryFeedback` | downstream feedback event + typed ref | CP04 feedback link / gap / safe receipt | downstream delivered / accepted / observed truth。 |
| `ObservationFeedbackConsumer` | `External::ObservationFeedback` | observation feedback event + typed ref | CP05 feedback link / gap / safe receipt | observed、evidence或verdict truth。 |
| `SubjectIdentityContextUpdateConsumer` | `External::SubjectIdentityContextUpdate` | Work / Identity formal source update | CP06 snapshot / resolution / gap successor | third execution subject、member / identity body。 |
| `PolicyContextUpdateConsumer` | `External::PolicyContextUpdate` | Governance formal source update | CP06 policy source snapshot / resolution / gap successor | approval / authorization / rule body。 |
| `RuntimeBoundaryContextUpdateConsumer` | `External::RuntimeBoundaryContextUpdate` | Runtime boundary / contract source update | CP06 mapping snapshot / resolution / gap successor | Runtime schema、loop、plan或outcome copy。 |
| `CapabilityContextUpdateConsumer` | `External::CapabilityContextUpdate` | Tools / Method formal source update | CP06 capability resolution / gap successor | capability registry、definition body或invocation authority。 |
| `HostRouteContextUpdateConsumer` | `External::HostRouteContextUpdate` | host / route-owner formal source update | CP06 boundary resolution / gap successor | host health、Bus delivery或route truth。 |
| `RuntimeMaterialReceptionConsumer` | `CommittedFact::RuntimeMaterialReception` | committed CP03 `RuntimeMaterialReception` fact | CP04 decision / material / prepared attempt or gap | Runtime material owner truth。 |
| `MemberCommittedFactConsumer` | `CommittedFact::MemberCommittedFact` | committed CP01~CP04 facts only | CP05 trace entry / gap / safe receipt | source fact body、source rollback或new source truth。 |
| `MemberProjectionUpdateConsumer` | `CommittedFact::MemberProjectionUpdate` | committed CP01~CP06 fact / resolution | CP07 stale / target-watermark posture | projection rebuild, current claim or source truth mutation。 |
| `CapabilityOutletSourceUpdateConsumer` | `CommittedFact::CapabilityOutletSourceUpdate` | committed CP06 capability resolution / gap only | CP07 outlet stale / gap / not-available posture | Tools / Method direct event consumption、registry or invocation authority。 |

### 22.3 worker-local entry helpers、finite kind 与最小错误 carrier

```rust
/// References one logical worker consumer entry without naming a transport or process.
pub struct MemberWorkerEntryRef(pub String);

/// References a redacted worker validation or boundary issue.
pub struct MemberWorkerValidationIssueRef(pub String);

/// Classifies the pre-dispatch state of one logical Consumer item.
pub enum MemberConsumerEntryState {
    /// All boundary metadata and body-gate checks permit application dispatch.
    ReadyForDispatch,
    /// A required owner, source, or local precondition cannot form a positive path.
    Blocked,
    /// The input was rejected before application dispatch.
    Rejected,
    /// The declared Consumer cannot handle the supplied schema version.
    UnsupportedSchema,
    /// A forbidden body posture was isolated before application dispatch.
    Quarantined,
}

/// Classifies the logical assembly posture of one registered Consumer declaration.
pub enum MemberWorkerRegistrationState {
    /// The declaration is available for a separately validated logical dispatch.
    Registered,
    /// A required source-specific binding remains fail-closed.
    Blocked,
    /// Validated runtime configuration deliberately omits this declaration.
    DisabledByConfig,
}

/// Associates one logical Consumer identity with its finite kind and assembly posture.
pub struct MemberWorkerRegistration {
    /// Logical Consumer declaration identity.
    pub entry_ref: MemberWorkerEntryRef,
    /// Exact owner-specific or committed-fact Consumer kind.
    pub consumer_kind: MemberInboundConsumerKind,
    /// Logical assembly posture without a listener or process claim.
    pub state: MemberWorkerRegistrationState,
}

/// Classifies the ten external owner-specific member Consumers.
pub enum MemberExternalConsumerKind {
    /// Consumes a formal host-collaboration feedback input.
    HostFeedback,
    /// Consumes an authorized inbound fact input.
    InboundFact,
    /// Consumes Runtime-owned committed safe material.
    RuntimeMaterial,
    /// Consumes formal downstream delivery feedback.
    DeliveryFeedback,
    /// Consumes formal observation feedback.
    ObservationFeedback,
    /// Consumes a Work or Identity subject-context update.
    SubjectIdentityContextUpdate,
    /// Consumes a Governance policy-context update.
    PolicyContextUpdate,
    /// Consumes a Runtime boundary-context update.
    RuntimeBoundaryContextUpdate,
    /// Consumes a Tools or Method capability-context update.
    CapabilityContextUpdate,
    /// Consumes a host or route-boundary context update.
    HostRouteContextUpdate,
}

/// Classifies the four re-entry Consumers that only accept committed member facts.
pub enum MemberCommittedFactConsumerKind {
    /// Turns one committed Runtime material reception into the CP04 evaluation path.
    RuntimeMaterialReception,
    /// Turns committed CP01 through CP04 facts into the CP05 trace path.
    MemberCommittedFact,
    /// Turns committed CP01 through CP06 facts into a CP07 projection update.
    MemberProjectionUpdate,
    /// Turns a CP06 capability resolution or gap into CP07 outlet posture.
    CapabilityOutletSourceUpdate,
}

impl MemberCommittedFactConsumerKind {
    /// Returns whether this committed-fact Consumer owns the supplied fact family.
    pub fn accepts(&self, fact_ref: &MemberCommittedFactRef) -> bool {
        match (self, fact_ref) {
            (
                Self::RuntimeMaterialReception,
                MemberCommittedFactRef::RuntimeMaterialReception(_),
            ) => true,
            (
                Self::MemberCommittedFact,
                MemberCommittedFactRef::StartupAdmission(_)
                    | MemberCommittedFactRef::MemberPresence(_)
                    | MemberCommittedFactRef::HostCollaborationMaterial(_)
                    | MemberCommittedFactRef::HostCollaborationAttempt(_)
                    | MemberCommittedFactRef::SubscriptionScope(_)
                    | MemberCommittedFactRef::InboundFact(_)
                    | MemberCommittedFactRef::Screening(_)
                    | MemberCommittedFactRef::RuntimeDelivery(_)
                    | MemberCommittedFactRef::RuntimeSubmission(_)
                    | MemberCommittedFactRef::RuntimeResultLink(_)
                    | MemberCommittedFactRef::RuntimeMaterialReception(_)
                    | MemberCommittedFactRef::OutboundDecision(_)
                    | MemberCommittedFactRef::OutboundMaterial(_)
                    | MemberCommittedFactRef::PublicationAttempt(_)
                    | MemberCommittedFactRef::PublicationGap(_),
            ) => true,
            (
                Self::MemberProjectionUpdate,
                MemberCommittedFactRef::StartupAdmission(_)
                    | MemberCommittedFactRef::MemberPresence(_)
                    | MemberCommittedFactRef::HostCollaborationMaterial(_)
                    | MemberCommittedFactRef::HostCollaborationAttempt(_)
                    | MemberCommittedFactRef::SubscriptionScope(_)
                    | MemberCommittedFactRef::InboundFact(_)
                    | MemberCommittedFactRef::Screening(_)
                    | MemberCommittedFactRef::RuntimeDelivery(_)
                    | MemberCommittedFactRef::RuntimeSubmission(_)
                    | MemberCommittedFactRef::RuntimeResultLink(_)
                    | MemberCommittedFactRef::RuntimeMaterialReception(_)
                    | MemberCommittedFactRef::OutboundDecision(_)
                    | MemberCommittedFactRef::OutboundMaterial(_)
                    | MemberCommittedFactRef::PublicationAttempt(_)
                    | MemberCommittedFactRef::PublicationGap(_)
                    | MemberCommittedFactRef::InteractionTrace(_)
                    | MemberCommittedFactRef::InteractionGap(_)
                    | MemberCommittedFactRef::ObservationMaterial(_)
                    | MemberCommittedFactRef::ObservationAttempt(_)
                    | MemberCommittedFactRef::ExternalContextSnapshot(_)
                    | MemberCommittedFactRef::ExternalContextResolution(_)
                    | MemberCommittedFactRef::ExternalContextGap(_),
            ) => true,
            (
                Self::CapabilityOutletSourceUpdate,
                MemberCommittedFactRef::ExternalContextResolution(_)
                    | MemberCommittedFactRef::ExternalContextGap(_),
            ) => true,
            _ => false,
        }
    }
}

/// Classifies every and only every HLD member Consumer without choosing a listener.
pub enum MemberInboundConsumerKind {
    /// One of the ten external owner-specific Consumers.
    External(MemberExternalConsumerKind),
    /// One of the four committed-member-fact re-entry Consumers.
    CommittedFact(MemberCommittedFactConsumerKind),
}

/// States whether a consumer entry retained only refs or a safe transient-inspection marker.
pub enum MemberConsumerPayloadPosture {
    /// The boundary admitted no payload body into the entry carrier.
    ReferenceOnly,
    /// An authorized transient inspection occurred and only its safe marker remains.
    TransientInspection(TransientInspectionMarker),
}

/// Classifies the body-free result of one logical Consumer item.
pub enum MemberConsumerItemDisposition {
    /// Application committed a member-local result surface for the item.
    Accepted,
    /// The item matched prior deduplication and replayed its stored local result.
    DuplicateReplayed,
    /// Application classified a late but attributable item without overwriting prior truth.
    LateClassified,
    /// A required owner, source, body, or local precondition could not prove a positive path.
    Blocked,
    /// The item was rejected before application execution.
    Rejected,
    /// The item schema cannot be handled by this declared Consumer.
    UnsupportedSchema,
    /// A forbidden body or unsafe carrier was isolated before application execution.
    Quarantined,
}

/// Represents a body-free worker entry, registry, or consumer-result failure.
pub enum WorkerError {
    /// Required Consumer metadata or source identity is absent or inconsistent.
    InvalidEntry {
        /// Redacted issue identifying the failed entry validation.
        issue_ref: MemberWorkerValidationIssueRef,
    },
    /// A kind, source, result, or collection combination violates this worker contract.
    ContractViolation {
        /// Redacted issue identifying the violated worker invariant.
        issue_ref: MemberWorkerValidationIssueRef,
    },
    /// A duplicate requires its stored consumer receipt but that result is unavailable or wrong-kind.
    StoredReceiptUnavailable {
        /// Logical consumer entry for which replay could not be resolved.
        entry_ref: MemberWorkerEntryRef,
        /// Redacted issue identifying the stored-result boundary failure.
        issue_ref: MemberWorkerValidationIssueRef,
    },
    /// Application returned a failure that has been redacted at the worker boundary.
    Application {
        /// Redacted issue identifying the mapped application failure.
        issue_ref: MemberWorkerValidationIssueRef,
    },
}
```

| Consumer kind | Accepted `MemberCommittedFactRef` variants | Explicitly rejected variants |
|---|---|---|
| `RuntimeMaterialReception` | `RuntimeMaterialReception` only | Every CP01, CP02, CP03 non-reception, CP04, CP05 and CP06 variant |
| `MemberCommittedFact` | CP01 `StartupAdmission`, `MemberPresence`, `HostCollaborationMaterial`, `HostCollaborationAttempt`; CP02 `SubscriptionScope`, `InboundFact`, `Screening`; CP03 `RuntimeDelivery`, `RuntimeSubmission`, `RuntimeResultLink`, `RuntimeMaterialReception`; CP04 `OutboundDecision`, `OutboundMaterial`, `PublicationAttempt`, `PublicationGap` | CP05 trace / observation variants and CP06 snapshot / resolution / gap variants |
| `MemberProjectionUpdate` | Every explicitly listed CP01~CP06 local/support variant in the finite enum | No variant is accepted through an untyped fallback; a future variant requires an HLD reopening |
| `CapabilityOutletSourceUpdate` | CP06 `ExternalContextResolution`, `ExternalContextGap` only | CP06 snapshot and every CP01~CP05 variant |

The table is the normative mapping for `accepts`; `from_committed_fact` and `MemberContinuationDispatchContext` must call this method before constructing a `ReferenceOnly` entry. `MemberProjectionUpdate` is exhaustive over the current finite enum; it is not a `GenericMemberFact` escape hatch.

| type / enum | 作用 | 允许来源 | 禁止事项 |
|---|---|---|---|
| `MemberWorkerEntryRef` | logical Consumer declaration identity。 | composition assembly经未来 `MemberIdGeneratorPort` 或已验证 assembly plan生成。 | 不使用 topic、route、URL、queue name、process / thread ID或container ID。 |
| `MemberWorkerValidationIssueRef` | worker boundary的安全问题定位。 | validation / blocked-seam / redacted application mapping。 | 不保存 raw envelope、payload、adapter response、stack trace、secret或broker diagnostics。 |
| `MemberConsumerEntryState` | 表达单个 logical Consumer item 是否可进入 application。 | owner-specific envelope / committed-fact boundary validation。 | 不表示 listener running、broker ack、retry、DLQ、delivery或 external acceptance；`ReadyForDispatch` 不等于 source current。 |
| `MemberWorkerRegistrationState` / `MemberWorkerRegistration` | 保留 logical consumer declaration、kind和fail-closed装配姿态。 | validated runtime assembly / Step 14 configuration binding。 | 不保存 route、queue、listener instance、process、container、source body或adapter instance；`Registered` 不表示已监听或可达。 |
| external / committed-fact kind | 锁住 HLD 的 `10 + 4` 个入口与来源类别。 | Step 8 per-Consumer schema / Step 14 validated binding。 | 不加 `GenericExternal`、`AnyMemberFact` 或 provider / topic variant；新 Consumer 必须回开 HLD。 |
| `MemberConsumerPayloadPosture` | 将 body gate 结果留为 safe carrier。 | reference-only boundary或authorized transient inspection。 | 不保留 body、payload digest以外的内容、prompt、log或adapter-private object；`ReferenceOnly`不等于 source accepted。 |
| `MemberConsumerItemDisposition` | 表达 local worker item handling posture。 | result factory / local validation。 | 不等于 broker ack、retry、DLQ、delivery、external acceptance、observed或evidence。 |
| `WorkerError` | planned `crates/worker/src/errors.rs` 中唯一 worker crate error。 | worker local validation / contract guard / redacted application mapping。 | 不能替代 `MemberContractError`、`DomainError`、`ApplicationError`、`InfraError`、`JobError`或 Step 8 protocol rejection；完整 retry/recovery留 Step 12。 |

### 22.4 `MemberInboundConsumerEntry`

##### `MemberInboundConsumerEntry`

```rust
/// Represents one validated logical member Consumer input without retaining an envelope body.
pub struct MemberInboundConsumerEntry {
    /// Logical worker entry selected by runtime assembly.
    pub entry_ref: MemberWorkerEntryRef,
    /// Exact owner-specific or committed-fact Consumer identity.
    pub consumer_kind: MemberInboundConsumerKind,
    /// External-event or committed-fact source identity.
    pub source: MemberConsumerSourceIdentity,
    /// Formal schema version observed at the boundary.
    pub schema_version: SchemaVersion,
    /// Deduplication key copied from the validated input metadata.
    pub deduplication_key: DeduplicationKey,
    /// Distributed trace identity copied from the validated input metadata.
    pub trace_id: TraceId,
    /// Body-free posture after the boundary body gate.
    pub payload_posture: MemberConsumerPayloadPosture,
    /// Pre-dispatch state assigned by owner-specific boundary validation.
    pub entry_state: MemberConsumerEntryState,
    /// Ordered unique redacted validation issues known before application dispatch.
    pub validation_issue_refs: Vec<MemberWorkerValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `consumer_kind` | worker ref / finite kind | 确定逻辑 entry和唯一 Consumer语义。 | registry的已注册映射；不得从 topic、handler class或payload推断。 |
| `source` | `MemberConsumerSourceIdentity` | 保留 external event或committed local fact的精确差异。 | external factory只构造 `ExternalEvent`；local dispatch factory只构造 `CommittedFact`；二者不得互转。 |
| `schema_version` / `deduplication_key` / `trace_id` | shared metadata | 承接输入兼容性、duplicate与trace。 | validated envelope或local dispatch context复制；缺失、空或不一致时不能 dispatch。 |
| `payload_posture` | body gate enum | 证明 entry内没有payload body。 | `InboundFactConsumer`必须是 `TransientInspection`；committed-fact Consumer必须是 `ReferenceOnly`；其余 exact mapping留 Step 8但不得引入 body field。 |
| `entry_state` | `MemberConsumerEntryState` | 区分可 dispatch、blocked、rejected、unsupported或quarantined item。 | owner-specific boundary validation唯一赋值；`ReadyForDispatch`必须无 issue，其他状态必须有 issue；不等于 Consumer process lifecycle。 |
| `validation_issue_refs` | `Vec<MemberWorkerValidationIssueRef>` | 记录 safe pre-dispatch issues。 | ordered-unique；`ReadyForDispatch`为空，其余 entry state非空；不保存 body、route、broker offset或adapter error正文。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self, context_id: MemberOperationContextId, operation_name: MemberOperationName, actor: ActorContext) -> Result<MemberOperationContext, WorkerError>` | 形成 inbound Consumer application context。 | application ID、Step 8 canonical operation mapping、trusted system / integration actor。 | context / error。 | 仅 `ReadyForDispatch` 可调用；调用 `MemberOperationContext::from_consumer(context_id, operation_name, actor, self.source.clone(), self.deduplication_key.clone(), self.trace_id)`；不调用 service、Store或adapter，不自拼 key。 |
| `pub fn assert_entry_complete(&self) -> Result<(), WorkerError>` | 校验 kind / source、schema、dedup、trace、state与body gate的一致性。 | 无。 | success / error。 | 纯校验；external kind必须对应 external source，committed kind必须对应 committed source；不读取payload。 |
| `pub fn assert_payload_gate(&self) -> Result<(), WorkerError>` | 校验 entry中只存在允许的safe body posture。 | 无。 | success / error。 | pure；`ReferenceOnly`不执行inspection，`TransientInspection(Rejected)`必须为 `Quarantined`且不能进入 application。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_external_envelope(entry_ref: MemberWorkerEntryRef, consumer_kind: MemberExternalConsumerKind, source_event_id: SourceEventId, source_event_ref: SourceEventRef, schema_version: SchemaVersion, deduplication_key: DeduplicationKey, trace_id: TraceId, payload_posture: MemberConsumerPayloadPosture, entry_state: MemberConsumerEntryState, validation_issue_refs: Vec<MemberWorkerValidationIssueRef>) -> Result<Self, WorkerError>` | 从已解析但未持久化的外部 envelope metadata建立 entry。 | entry、external kind、event ID/ref、schema、dedup、trace、safe body posture、validated pre-dispatch state和safe issues。 | entry / error。 | 10 external Consumer boundary；factory校验 state / issue / posture组合；exact envelope / owner-specific extra refs留 Step 8。 |
| `pub fn from_committed_fact(entry_ref: MemberWorkerEntryRef, consumer_kind: MemberCommittedFactConsumerKind, fact_ref: MemberCommittedFactRef, schema_version: SchemaVersion, deduplication_key: DeduplicationKey, trace_id: TraceId, entry_state: MemberConsumerEntryState, validation_issue_refs: Vec<MemberWorkerValidationIssueRef>) -> Result<Self, WorkerError>` | 从已提交 local fact dispatch建立 entry。 | entry、internal kind、committed fact、schema、dedup、trace、validated pre-dispatch state和safe issues。 | entry / error。 | 4 internal Consumer boundary；factory强制 `ReferenceOnly`、调用 `consumer_kind.accepts(&fact_ref)`，并拒绝 unsafe state / issue组合。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| owner-specific entry | entry可共享 metadata 骨架，但不能通过 `MemberInboundConsumerKind` 抹掉 per-kind owner、scope、forbidden-output和blocked seam；这些逐项 DTO在 Step 8 收口。 |
| no delivery claim | entry创建不等于 message received / acked、route subscribed、broker committed、listener running或owner source current。 |
| no source truth write | worker只调用 application；不得直接写 domain、Store、CP06 source owner或CP07 view。 |
| state / source / result fence | entry state只决定是否可进入 application；它不能把 `ExternalEvent`改为`CommittedFact`，也不能将 blocked / rejected / unsupported / quarantined item伪装成 accepted application operation。 |
| duplicate no rerun | duplicate path必须读取 typed stored receipt/result；stored receipt缺失时返回 `WorkerError::StoredReceiptUnavailable`，不得再次执行 consumer transition。 |

### 22.5 `MemberConsumerItemResult`

##### `MemberConsumerItemResult`

```rust
/// Carries the body-free local handling result for one logical Consumer item.
pub struct MemberConsumerItemResult {
    /// Logical Consumer entry that handled or rejected the item.
    pub entry_ref: MemberWorkerEntryRef,
    /// Exact Consumer kind used for source and disposition validation.
    pub consumer_kind: MemberInboundConsumerKind,
    /// Source identity retained from the corresponding entry.
    pub source: MemberConsumerSourceIdentity,
    /// Local worker disposition without broker acknowledgement semantics.
    pub disposition: MemberConsumerItemDisposition,
    /// Stored member-local result for accepted or duplicate-replayed handling.
    pub application_result_ref: Option<MemberOperationResultRef>,
    /// Ordered unique typed relations that remain blocked, late, or otherwise unresolved.
    pub unresolved_refs: Vec<TypedRef>,
    /// Ordered unique redacted boundary issues for a non-positive disposition.
    pub validation_issue_refs: Vec<MemberWorkerValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `consumer_kind` | logical ref / finite kind | 将 receipt shell 回链到唯一 Consumer declaration。 | 从 `MemberInboundConsumerEntry` 复制；不得从 topic、route、payload、receipt body或handler class反推。 |
| `source` | `MemberConsumerSourceIdentity` | 保留 external event 与 committed fact 的不可互换来源。 | 从 validated entry原样复制；result不能重写、压平或替换 source variant。 |
| `disposition` | `MemberConsumerItemDisposition` | 表达本地 item 处理边界。 | named factory唯一赋值；不是 broker ack、DLQ、retry、delivery、host/Runtime/downstream acceptance或observation truth。 |
| `application_result_ref` | `Option<MemberOperationResultRef>` | 指向 fresh accepted或duplicate replay的 typed local result。 | `Accepted` / `DuplicateReplayed` 必为 `Some`，其余必须 `None`；由 application stored-result save/get返回，不可从 current facts拼造。 |
| `unresolved_refs` | `Vec<TypedRef>` | 保留 blocked、late或未知关系的最小可审计 ref。 | ordered-unique；`Blocked` / `LateClassified`可非空，`Accepted` / `DuplicateReplayed` / `Rejected` / `UnsupportedSchema` / `Quarantined`必须为空；不可放 error text、offset、route、payload或adapter body。 |
| `validation_issue_refs` | `Vec<MemberWorkerValidationIssueRef>` | 解释未进入或未完成positive local path的安全原因。 | ordered-unique；`Accepted` / `DuplicateReplayed`为空；其余 disposition 必为 non-empty，且只来自 entry validation或redacted application mapping。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_terminal_for_item(&self) -> bool` | 判断当前 logical item 是否无需由 worker 继续尝试。 | 无。 | `bool`。 | `Accepted`、`DuplicateReplayed`、`LateClassified`、`Rejected`、`UnsupportedSchema`、`Quarantined` 为 true；`Blocked` 为 false；不选择 retry、DLQ或scheduler。 |
| `pub fn is_duplicate_replay(&self) -> bool` | 判断是否读取了既有 stored result。 | 无。 | `bool`。 | 纯函数；不重新访问 idempotency Store。 |
| `pub fn assert_consistent(&self) -> Result<(), WorkerError>` | 校验 source、disposition、optional result、refs和issues组合。 | 无。 | success / error。 | 纯校验；不读取 Store、application、broker或source owner。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn accepted(entry: &MemberInboundConsumerEntry, result_ref: MemberOperationResultRef) -> Result<Self, WorkerError>` | 构造 fresh application accepted shell。 | validated ready entry、已保存 local result ref。 | result / error。 | application完成且结果已被typed stored-result face保存后；不表示 source-owner / external success。 |
| `pub fn duplicate_replayed(entry: &MemberInboundConsumerEntry, result_ref: MemberOperationResultRef) -> Result<Self, WorkerError>` | 构造 duplicate stored-result replay shell。 | validated ready entry、匹配的stored result ref。 | result / error。 | duplicate path；不得调用 transition、scan、job或adapter。 |
| `pub fn late_classified(entry: &MemberInboundConsumerEntry, unresolved_refs: Vec<TypedRef>, issue_refs: Vec<MemberWorkerValidationIssueRef>) -> Result<Self, WorkerError>` | 构造不覆盖既有 truth的 late item shell。 | entry、non-empty ordered-unique refs / issues。 | result / error。 | feedback或committed fact的attributable-late path；不回滚、重裁或写source truth。 |
| `pub fn blocked(entry: &MemberInboundConsumerEntry, unresolved_refs: Vec<TypedRef>, issue_refs: Vec<MemberWorkerValidationIssueRef>) -> Result<Self, WorkerError>` | 构造 fail-closed blocked shell。 | entry、non-empty ordered-unique refs / issues。 | result / error。 | missing owner/source/body/local prerequisite；不假设later retry一定可行。 |
| `pub fn refused(entry: &MemberInboundConsumerEntry, disposition: MemberConsumerItemDisposition, issue_refs: Vec<MemberWorkerValidationIssueRef>) -> Result<Self, WorkerError>` | 构造 rejected、unsupported或quarantined shell。 | entry、三种拒绝类 disposition、non-empty issues。 | result / error。 | pre-application validation、unsupported schema或forbidden body gate。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| receipt is local | 本对象是 planned `worker` receipt shell；Step 8 才定义 public Consumer receipt schema。它不声称 envelope已 ack、event已消费、Bus已投递或外部 owner已接受。 |
| duplicate is stored-result only | `DuplicateReplayed` 必须指向与 entry channel / operation / key / digest匹配的 `StoredMemberOperationResult`；查无结果或种类不匹配即 `WorkerError::StoredReceiptUnavailable`，不得转为 `Accepted` 或重新处理。 |
| blocked is not a retry policy | `Blocked` 只保留当前保守结果；retry、DLQ、backoff、scheduler和listener recovery由 Step 12~14 定义，不能由本对象隐式启动。 |
| no raw result body | 结果只含 typed ref、finite disposition和safe issue；不含 envelope body、source/adapter body、offset、receipt payload、trace log、secret或evidence。 |

### 22.6 `MemberContinuationDispatchContext`

##### `MemberContinuationDispatchContext`

```rust
/// Carries one committed-member-fact re-entry request without publishing an event or scheduling work.
pub struct MemberContinuationDispatchContext {
    /// Logical worker declaration selected for the local re-entry.
    pub entry_ref: MemberWorkerEntryRef,
    /// One of the four committed-fact Consumer kinds.
    pub consumer_kind: MemberCommittedFactConsumerKind,
    /// Already committed local fact that is the only re-entry source.
    pub fact_ref: MemberCommittedFactRef,
    /// Formal schema version selected for this internal carrier.
    pub schema_version: SchemaVersion,
    /// Deduplication key supplied by the committed-fact continuation boundary.
    pub deduplication_key: DeduplicationKey,
    /// Distributed trace identity propagated from the committed fact path.
    pub trace_id: TraceId,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `consumer_kind` | worker declaration ref / four-kind enum | 锁定 local re-entry目标与用途。 | from validated worker registry / application continuation selection；不得从 event route、topic、job kind或source body推断。 |
| `fact_ref` | `MemberCommittedFactRef` | 明确只从已提交 member fact重新进入。 | application在local commit成功后提供；必须被 `consumer_kind.accepts` 接受；不得指向 view、external ref、in-memory candidate或未提交 object。 |
| `schema_version` / `deduplication_key` / `trace_id` | shared metadata | 形成与 Consumer entry 相同的兼容性、duplicate和trace输入。 | committed-fact continuation mapper / formal local carrier；不得从 clock、store version、row ID、cursor或random值生成。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_inbound_entry(&self) -> Result<MemberInboundConsumerEntry, WorkerError>` | 转换为 committed-fact Consumer entry。 | 无。 | entry / error。 | 只调用 `MemberInboundConsumerEntry::from_committed_fact` with `ReadyForDispatch` and empty issues；不发布事件、不写Store、不调用 application。 |
| `pub fn assert_committed_only(&self) -> Result<(), WorkerError>` | 校验 target kind和fact family的一致性。 | 无。 | success / error。 | pure；不通过 event envelope、payload或router证明事实已提交。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_committed_fact(entry_ref: MemberWorkerEntryRef, consumer_kind: MemberCommittedFactConsumerKind, fact_ref: MemberCommittedFactRef, schema_version: SchemaVersion, deduplication_key: DeduplicationKey, trace_id: TraceId) -> Result<Self, WorkerError>` | 从已提交事实构造唯一允许的local re-entry context。 | entry、kind、committed ref、schema、dedup、trace。 | context / error。 | CP04 / CP05 / CP07 continuation dispatch；Step 7须定义committed proof / continuation mapping读取面。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| committed-only | 这个对象不接受 `ExternalEvent`，也不能为 external event补造local fact；external input必须先通过其 owner-specific Consumer / application commit路径。 |
| no transport / scheduler | context不代表 `MemberFactEnvelope` 已发布、Bus route存在、queue入队、listener启动、polling、cron、real job run或持久化 outbox。exact carrier继续受 `L2M-UP-005` 阻塞。 |
| no source rewrite | dispatch只是重新进入 application；它不得回滚source fact、重建Runtime material、改变CP06 source owner或直接写CP07 view。 |

### 22.7 `MemberWorkerRegistryState`

##### `MemberWorkerRegistryState`

```rust
/// Tracks logical member Consumer declarations without binding a broker, listener, or process.
pub struct MemberWorkerRegistryState {
    /// Ordered unique registrations for all declared member Consumers.
    pub registrations: Vec<MemberWorkerRegistration>,
    /// Ordered unique redacted worker assembly issues.
    pub validation_issue_refs: Vec<MemberWorkerValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `registrations` | `Vec<MemberWorkerRegistration>` | 保存每一 logical Consumer declaration的ref、kind与装配姿态。 | ordered-unique by both `entry_ref` and `consumer_kind`；all 14 HLD kinds至多各注册一次；来自runtime builder的validated assembly plan，不含listener / source body。 |
| `validation_issue_refs` | `Vec<MemberWorkerValidationIssueRef>` | 记录 registry-level safe assembly issue。 | ordered-unique、redacted；不保存 config body、route、broker state、host health或adapter instance。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn register(&mut self, registration: MemberWorkerRegistration) -> Result<(), WorkerError>` | 注册一个 finite Consumer declaration。 | entry ref、kind、assembly state。 | success / error。 | only registry mutation；拒绝重复 ref或kind；不启动 listener。 |
| `pub fn registration_for(&self, consumer_kind: &MemberInboundConsumerKind) -> Option<&MemberWorkerRegistration>` | 查找唯一 logical declaration。 | finite Consumer kind。 | optional registration。 | pure；不得按 topic、payload或source event猜测。 |
| `pub fn allows_dispatch(&self, consumer_kind: &MemberInboundConsumerKind) -> bool` | 判断该 kind是否已注册且可形成logical dispatch。 | finite kind。 | `bool`。 | `Registered` only；does not prove external binding / listener availability。 |
| `pub fn record_issue(&mut self, issue_ref: MemberWorkerValidationIssueRef) -> Result<(), WorkerError>` | 记录一个安全assembly问题。 | redacted issue。 | success / error。 | only registry mutation；不改变已注册kind为positive state。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn empty() -> Self` | 建立空 logical Consumer registry。 | 无。 | registry。 | infra runtime builder assembly；Step 14再决定config / binding。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| registry is not activation | `Registered` 只表示逻辑声明完整，不能声称 Event source 已订阅、route有效、worker正在运行、host接受或member runtime ready。 |
| no generic fallback | registry不允许 `GenericExternal` / `AnyMemberFact` fallback；missing、blocked或disabled declaration必须由owner-specific seam返回fail-closed结果。 |
| no entry cross-call | registry不能直接调用 api、jobs、domain、Store、adapter或application service；只供 worker boundary assembly / lookup使用。 |

### 22.8 worker 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 14 个 Consumer 的 kind、source与唯一用途完整 | pass_for_current_step | 10 external owner-specific与4 committed-fact re-entry均有finite kind；未新增generic listener。 |
| source identity与item result不被压平 | pass | external event保留event ID/ref；committed fact保留local ref；result不得转换两者。 |
| body / delivery / lifecycle边界守住 | pass_with_upstream_blockers | 仅有safe posture、ref、issue与logical registration；exact envelope / event route / worker activation继续受`L2M-UP-001/003/004/005/006/007`限制。 |
| duplicate不重跑 | pass_with_future_port_work | `DuplicateReplayed`要求typed stored result；Step 7 / 13仍须闭合get/missing/digest和并发规则。 |
| Step 7 / 8承接 | ready_for_jobs_entry_carriers | Step 7需定义worker registry、committed proof、stored receipt和context Ports；Step 8逐个定义14 Consumer DTO / receipt；Step 9定义分流、commit、re-entry顺序。 |

## 23. `jobs`：五类 Operations Job 逻辑入口、结果与 runner registry

### 23.1 capability / 功能清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 将五类固定 continuation metadata固定为逻辑 jobs entry | entry、finite kind、operation、logical invocation、actor、trace、idempotency、safe issues | `MemberOperationsJobEntry` | only pre-application validation；不选择scheduler / process / real run | `MemberOperationsJobEntry` | Step 7 context / result Ports；Step 8 five Job DTO；Step 9 job flows。 |
| 用body-free shell表达job boundary的local result | entry、stored result ref、report或safe issues | `MemberJobRunResult` | completed / partial / waiting / blocked / unknown / duplicate / rejected boundary posture；不等于external success | `MemberJobRunResult` | Step 8 job response；Step 12 error mapping；Step 13 duplicate rules。 |
| 记录五类logical runner declaration的装配姿态 | entry ref、kind、registration state、safe issue | `MemberJobRunnerRegistryState` | register / lookup only；无schedule / cron / batch / retry | `MemberJobRunnerRegistryState` | Step 7 runtime composition;Step 14 binding。 |

### 23.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `MemberOperationsJobEntry` | Job metadata validation与application context translation | logical entry object | five-kind mapping、channel exclusivity、logical invocation / idempotency / trace validation、report assembly handoff | 不选scheduler、不生成run ID、不读取Store、不直接调用domain / adapter。 |
| `MemberJobRunResult` | 表达一次logical job boundary的local outcome | result shell | report / stored-result / disposition / safe issue consistency | 不成为真实run record，不证明publication / observation / source refresh / projection完整或external success。 |
| `MemberJobRunnerRegistryState` | register / lookup five logical runners | runtime assembly state | finite kind unique、registered / blocked / disabled posture | 不启动runner、schedule、cron、queue、batch、retry或container process。 |

### 23.3 对象能力到字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `MemberOperationsJobEntry` | 验证并转换五类 job metadata | entry ref、kind、canonical operation、logical invocation、actor、trace、key、entry state、issues | `from_metadata(...)` | `to_operation_context`、`start_report_assembly`、`assert_entry_complete` | `MemberJobEntryState` | Step 8 trusted Job metadata / runner input；不使用actual scheduler run。 |
| `MemberJobRunResult` | 表达 fresh / duplicate / conservative job outcome | entry ref、kind、logical invocation、disposition、optional stored ref/report、issues | named factories | `is_duplicate_replay`、`requires_stored_report`、`assert_consistent` | `MemberJobRunDisposition` | entry + application returned stored result / report / redacted issue。 |
| `MemberJobRunnerRegistryState` | 管理 runner declaration | registrations、safe issues | `empty()` | `register`、`registration_for`、`is_enabled`、`record_issue` | `MemberJobRegistrationState` | runtime assembly plan / validated config posture；不从scheduler/cron推导。 |

### 23.4 jobs-local helpers、状态与最小错误 carrier

```rust
/// References one logical member operations-job entry without naming a scheduler or process.
pub struct MemberJobEntryRef(pub String);

/// References a redacted jobs-boundary validation or assembly issue.
pub struct MemberJobValidationIssueRef(pub String);

/// Classifies the logical entry posture before a job reaches application services.
pub enum MemberJobEntryState {
    /// All required metadata and registration checks permit application dispatch.
    ReadyForDispatch,
    /// A required source, local precondition, or seam prevents a positive continuation.
    Blocked,
    /// The requested kind is deliberately disabled by validated runtime configuration.
    DisabledByConfig,
    /// Metadata or job-kind mapping was rejected before application dispatch.
    Rejected,
}

/// Classifies the body-free result of one logical member operations-job invocation.
pub enum MemberJobRunDisposition {
    /// Application completed a local continuation and produced a stored member job report.
    Completed,
    /// Application advanced some local records while retaining explicit unresolved refs.
    PartiallyCompleted,
    /// A formal resolution, feedback, or source update is required before further work.
    Waiting,
    /// A required precondition or seam prevents a positive continuation.
    Blocked,
    /// The local effect or source condition cannot be proven safely.
    Unknown,
    /// The matching stored member job report was replayed without re-running work.
    DuplicateReplayed,
    /// The jobs boundary rejected metadata or an unavailable logical runner.
    Rejected,
}

/// Classifies the assembly state of one fixed logical member job runner.
pub enum MemberJobRegistrationState {
    /// The logical job declaration is available for a separately validated invocation.
    Registered,
    /// A required binding remains fail-closed.
    Blocked,
    /// Validated runtime configuration deliberately omits this job kind.
    DisabledByConfig,
}

/// Associates one logical jobs entry declaration with a fixed job kind and assembly posture.
pub struct MemberJobRunnerRegistration {
    /// Logical jobs entry identity.
    pub entry_ref: MemberJobEntryRef,
    /// Fixed operations-job continuation kind.
    pub job_kind: MemberOperationsJobKind,
    /// Logical assembly posture without a scheduler or process claim.
    pub state: MemberJobRegistrationState,
}

/// Represents a body-free jobs-boundary failure.
pub enum JobError {
    /// Required job metadata, kind mapping, or entry-state combination is invalid.
    InvalidEntry {
        /// Redacted issue identifying the invalid jobs entry.
        issue_ref: MemberJobValidationIssueRef,
    },
    /// A job registry, entry, result, or collection combination violates this contract.
    ContractViolation {
        /// Redacted issue identifying the violated jobs invariant.
        issue_ref: MemberJobValidationIssueRef,
    },
    /// A duplicate requires a stored member job report but no matching report is available.
    StoredReportUnavailable {
        /// Logical jobs entry for which the stored report could not be resolved.
        entry_ref: MemberJobEntryRef,
        /// Redacted issue identifying the stored-result boundary failure.
        issue_ref: MemberJobValidationIssueRef,
    },
    /// Application returned a failure that has been redacted at the jobs boundary.
    Application {
        /// Redacted issue identifying the mapped application failure.
        issue_ref: MemberJobValidationIssueRef,
    },
}
```

| type / enum | 作用 | 允许来源 | 禁止事项 |
|---|---|---|---|
| `MemberJobEntryRef` | logical Operations Job declaration identity。 | composition assembly经future `MemberIdGeneratorPort`或validated assembly plan生成。 | 不使用 scheduler run ID、cron、binary、process/container ID、route、file path或artifact ID。 |
| `MemberJobValidationIssueRef` | jobs boundary安全问题定位。 | validation / blocked seam / redacted application mapping。 | 不保存 job input、config / secret、adapter response、stack trace、run log、artifact、report、evidence或signoff。 |
| `MemberJobEntryState` | job是否可调用application的有限pre-dispatch posture。 | jobs metadata / registry / source validation。 | 不等于 job runner running、scheduler accepted、real execution或external work completion。 |
| `MemberJobRunDisposition` | 一次logical continuation的boundary结果分类。 | named result factory + application returned report / safe outcome。 | 不等于 external delivery / observed / authorization / source current；不是durable domain state。 |
| `MemberJobRegistrationState` / `MemberJobRunnerRegistration` | 固定kind与logical runner declaration的装配姿态。 | validated runtime assembly / Step 14 config binding。 | 不保存 cron、batch、retry、lease、queue、process、container或adapter instance；`Registered`不表示scheduled。 |
| `JobError` | planned `crates/jobs/src/errors.rs` 中唯一jobs crate error。 | jobs entry / registry / result / redacted application mapping。 | 不能替代 `MemberContractError`、`DomainError`、`ApplicationError`、`InfraError`、`ApiError`、`WorkerError`或Step 8 protocol rejection；retry / recovery留Step 12~14。 |

| `MemberJobRunDisposition` 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Completed` | `Application completed a local continuation and produced a stored member job report.` | 表示local continuation有stored report。 | application完成并保存typed result / report后。 | Step 8 Job result mapper；不表示external success。 |
| `PartiallyCompleted` | `Application advanced some local records while retaining explicit unresolved refs.` | 明确部分local successor与unresolved并存。 | report包含advanced和unresolved refs。 | public report / safe job response。 |
| `Waiting` | `A formal resolution, feedback, or source update is required before further work.` | 表示等待formal future basis。 | gap / resolution-pending application outcome。 | safe job response；不启动scheduler。 |
| `Blocked` | `A required precondition or seam prevents a positive continuation.` | 表示当前fail-closed。 | blocked application / seam outcome。 | safe job response / diagnostics。 |
| `Unknown` | `The local effect or source condition cannot be proven safely.` | 保留unknown fence。 | unknown attempt / source result。 | report unresolved refs；不得自动retry。 |
| `DuplicateReplayed` | `The matching stored member job report was replayed without re-running work.` | 表示typed stored report replay。 | completed idempotency + matching stored report。 | Step 8 response / Step 13 audit。 |
| `Rejected` | `The jobs boundary rejected metadata or an unavailable logical runner.` | 表示pre-application refusal。 | entry / registry validation。 | Step 8 rejection response；不进入application。 |

### 23.5 `MemberOperationsJobEntry`

##### `MemberOperationsJobEntry`

```rust
/// Represents one validated logical member operations-job input before application execution.
pub struct MemberOperationsJobEntry {
    /// Logical jobs entry selected by runtime assembly.
    pub entry_ref: MemberJobEntryRef,
    /// Fixed continuation kind selected by the jobs entry mapping.
    pub job_kind: MemberOperationsJobKind,
    /// Canonical application operation selected for the fixed job kind.
    pub operation_name: MemberOperationName,
    /// Logical invocation reference supplied by trusted job metadata.
    pub job_invocation_ref: MemberJobInvocationRef,
    /// System or operator actor supplied by the trusted job boundary.
    pub actor: ActorContext,
    /// Distributed trace identity copied from trusted job metadata.
    pub trace_id: TraceId,
    /// Normalized idempotency key for duplicate protection.
    pub idempotency_key: MemberOperationIdempotencyKey,
    /// Pre-dispatch job entry posture.
    pub entry_state: MemberJobEntryState,
    /// Ordered unique redacted issues known before application dispatch.
    pub validation_issue_refs: Vec<MemberJobValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `job_kind` / `operation_name` | job declaration ref / finite kind / canonical name | 将jobs entry固定到唯一 logical continuation / application service。 | registry mapping；五种kind恰各映射一个HLD Job / named service；不得由scheduler name、cron、binary或route推断。 |
| `job_invocation_ref` | `MemberJobInvocationRef` | 保留可信job metadata的logical correlation。 | trusted Step 8 Job protocol boundary；只可识别logical invocation，绝不是real run ID、process ID、test ID、artifact/evidence/report ID或signoff。 |
| `actor` / `trace_id` | Core actor / trace | 将system或operator identity与trace传入application。 | trusted jobs boundary；不承担login / authorization；trace不得由entry生成。 |
| `idempotency_key` | `MemberOperationIdempotencyKey` | 让重复logical invocation走stored report replay。 | validated Job metadata中的Core key归一；不得从run、time、trace、kind或cursor生成。 |
| `entry_state` | `MemberJobEntryState` | 明确ready、blocked、disabled或rejected入口。 | entry / registry validation唯一赋值；`ReadyForDispatch`无issues，其余state必有issues；不表示scheduler / process状态。 |
| `validation_issue_refs` | `Vec<MemberJobValidationIssueRef>` | 保存pre-application safe issues。 | ordered-unique；no input / config / adapter body；`ReadyForDispatch`为空，其余entry state非空。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_operation_context(&self, context_id: MemberOperationContextId) -> Result<MemberOperationContext, JobError>` | 建立application OperationsJob context。 | ID Port已生成context ID。 | context / error。 | only `ReadyForDispatch`;调用 `MemberOperationContext::from_job(context_id, self.operation_name.clone(), self.actor.clone(), self.job_invocation_ref.clone(), self.trace_id, self.idempotency_key.clone())`；不执行job、Store、adapter或scheduler调用。 |
| `pub fn start_report_assembly(&self, context_id: MemberOperationContextId, assembly_id: MemberJobReportAssemblyId) -> Result<MemberJobReportAssembly, JobError>` | 建立application job report accumulator。 | ID Port已生成的 operation context ID 与 assembly ID。 | assembly / error。 | only `ReadyForDispatch`;先以 `context_id` 构造 `MemberOperationContext`，再调用 `MemberJobReportAssembly::start`；不保存report、不扫描facts。 |
| `pub fn assert_entry_complete(&self) -> Result<(), JobError>` | 校验kind / operation / invocation / actor / trace / key / state一致性。 | 无。 | success / error。 | pure；不读取registry、application、Store、adapter或scheduler。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_metadata(entry_ref: MemberJobEntryRef, job_kind: MemberOperationsJobKind, operation_name: MemberOperationName, job_invocation_ref: MemberJobInvocationRef, actor: ActorContext, trace_id: TraceId, idempotency_key: MemberOperationIdempotencyKey, entry_state: MemberJobEntryState, validation_issue_refs: Vec<MemberJobValidationIssueRef>) -> Result<Self, JobError>` | 从trusted logical Job metadata建立entry。 | entry、kind、canonical operation、logical invocation、actor、trace、key、state、issues。 | entry / error。 | five jobs entry boundary；factory验证kind / operation mapping和state / issue pairing；exact DTO留Step 8。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| logical invocation only | `job_invocation_ref`只承接HLD `JobRunRef`的logical type slot；本设计不创建、保存或声称真实run ID / execution record。 |
| no direct continuation | entry只构造context / report assembly并调用application facade；不得直接scan Store、transition domain、publish / handoff、refresh source或rebuild projection。 |
| no disabled bypass | `Blocked`、`DisabledByConfig`、`Rejected`不得形成context、assembly或fresh result；仅可形成`MemberJobRunResult::rejected`或safe blocked surface。 |

### 23.6 `MemberJobRunResult`

##### `MemberJobRunResult`

```rust
/// Carries a body-free local result of one logical member operations-job boundary.
pub struct MemberJobRunResult {
    /// Logical jobs entry that produced this result.
    pub entry_ref: MemberJobEntryRef,
    /// Fixed job kind represented by this result.
    pub job_kind: MemberOperationsJobKind,
    /// Logical invocation correlation copied from the entry.
    pub job_invocation_ref: MemberJobInvocationRef,
    /// Final jobs-boundary disposition.
    pub disposition: MemberJobRunDisposition,
    /// Stored local result pointer for fresh completion or duplicate report replay.
    pub application_result_ref: Option<MemberOperationResultRef>,
    /// Body-free public member report for a fresh application outcome.
    pub report: Option<MemberJobReport>,
    /// Ordered unique redacted validation or application-mapping issues.
    pub validation_issue_refs: Vec<MemberJobValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_ref` / `job_kind` / `job_invocation_ref` | entry / finite kind / logical invocation | 回链唯一jobs entry和logical invocation。 | 从entry原样复制；不得以report ID、scheduler run、artifact或process ID替代。 |
| `disposition` | `MemberJobRunDisposition` | 暴露job boundary的local outcome。 | named factory唯一赋值；不等于 domain truth或foreign effect证明。 |
| `application_result_ref` | `Option<MemberOperationResultRef>` | 连接fresh存储结果或duplicate replay。 | `Completed` / `PartiallyCompleted` / `Waiting` / `Blocked` / `Unknown` / `DuplicateReplayed`均须Some，因为每个application-handled logical job必须有typed stored job report；`Rejected`必须None。 |
| `report` | `Option<MemberJobReport>` | fresh application outcome的body-free public report。 | fresh dispositions必须Some，`DuplicateReplayed`允许None且必须以stored report read在Step 8 response层返回same schema，`Rejected`必须None；report kind/invocation/kind必须匹配entry。 |
| `validation_issue_refs` | `Vec<MemberJobValidationIssueRef>` | 记录拒绝、blocked/unknown/partial等安全解释。 | ordered-unique；`Completed` / `DuplicateReplayed`为空；`PartiallyCompleted` / `Waiting` / `Blocked` / `Unknown` / `Rejected`必须non-empty；不得含job input、adapter body或run evidence。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_duplicate_replay(&self) -> bool` | 判断是否需要读取stored report。 | 无。 | `bool`。 | pure；`DuplicateReplayed` only；不重跑scan / transition / job。 |
| `pub fn requires_stored_report(&self) -> bool` | 判断entry结果是否必须能读取typed stored report。 | 无。 | `bool`。 | true for every non-rejected disposition；不代表report已materialize为transport body。 |
| `pub fn assert_consistent(&self) -> Result<(), JobError>` | 校验entry / kind / invocation / disposition / stored ref / report / issue组合。 | 无。 | success / error。 | pure；不读取Store或external seam。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn completed(entry: &MemberOperationsJobEntry, result_ref: MemberOperationResultRef, report: MemberJobReport) -> Result<Self, JobError>` | 构造无unresolved的fresh completed shell。 | ready entry、stored result ref、matching report。 | result / error。 | application job outcome；`report.has_unresolved_work()`必须false。 |
| `pub fn partial(entry: &MemberOperationsJobEntry, result_ref: MemberOperationResultRef, report: MemberJobReport, issue_refs: Vec<MemberJobValidationIssueRef>) -> Result<Self, JobError>` | 构造有local advancement及unresolved关系的partial shell。 | ready entry、stored result、matching report、non-empty issues。 | result / error。 | report同时有advanced和unresolved refs；不表示failed external effect。 |
| `pub fn waiting_or_conservative(entry: &MemberOperationsJobEntry, disposition: MemberJobRunDisposition, result_ref: MemberOperationResultRef, report: MemberJobReport, issue_refs: Vec<MemberJobValidationIssueRef>) -> Result<Self, JobError>` | 构造waiting、blocked或unknown的fresh stored-report shell。 | ready entry、三种conservative disposition、stored result、matching report、non-empty issues。 | result / error。 | local job application已安全完成其当前append / report路径，但外部或source正向结论仍不可得。 |
| `pub fn duplicate_replayed(entry: &MemberOperationsJobEntry, result_ref: MemberOperationResultRef) -> Result<Self, JobError>` | 构造duplicate report replay shell。 | ready entry、typed matching stored result。 | result / error。 | idempotency duplicate path；不得重新扫描facts、调用adapter或生成new report。 |
| `pub fn rejected(entry: &MemberOperationsJobEntry, issue_refs: Vec<MemberJobValidationIssueRef>) -> Result<Self, JobError>` | 构造pre-application refusal shell。 | non-ready entry、non-empty ordered-unique issues。 | result / error。 | invalid metadata、blocked runner或disabled job；不进入application。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no real run | 尽管名称沿用HLD `JobRunRef`输入语义，本对象只表达logical jobs boundary结果；不持有或声称scheduler/run/process execution、artifact、test、evidence、verdict、signoff或readiness。 |
| report is report, not truth | `MemberJobReport`只列committed local refs / unresolved typed refs；`Completed`不等于publication delivered、observation ingested、source current、projection current或gap resolved。 |
| duplicate parity | duplicate必须通过typed stored result / report读面获得与首次同构的public report；不得从current Store重新scan或由runner临时重建report。 |
| rejected does not mutate | rejected entry没有application result / report，且不得reserve/complete idempotency、写attempt/gap/projection或调用external seam。 |

### 23.7 `MemberJobRunnerRegistryState`

##### `MemberJobRunnerRegistryState`

```rust
/// Tracks fixed logical member operations-job declarations without scheduling or running them.
pub struct MemberJobRunnerRegistryState {
    /// Ordered unique job runner registrations.
    pub registrations: Vec<MemberJobRunnerRegistration>,
    /// Ordered unique redacted jobs assembly issues.
    pub validation_issue_refs: Vec<MemberJobValidationIssueRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `registrations` | `Vec<MemberJobRunnerRegistration>` | 记录五个fixed job kind的logical entry与装配姿态。 | ordered-unique by `entry_ref` and `job_kind`；每一kind至多一次；来自runtime builder / validated config plan；不保存cron、batch、retry或runner instance。 |
| `validation_issue_refs` | `Vec<MemberJobValidationIssueRef>` | 保存registry-level safe issue。 | ordered-unique、redacted；不保存config body、schedule、adapter / host / Runtime state或artifact。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn register(&mut self, registration: MemberJobRunnerRegistration) -> Result<(), JobError>` | 注册一个fixed logical job runner declaration。 | entry ref、kind、registration state。 | success / error。 | only registry mutation；拒绝duplicate ref/kind；不创建schedule。 |
| `pub fn registration_for(&self, job_kind: &MemberOperationsJobKind) -> Option<&MemberJobRunnerRegistration>` | 查找唯一job kind declaration。 | fixed job kind。 | optional registration。 | pure；不从cron、binary、invocation或report猜测。 |
| `pub fn is_enabled(&self, job_kind: &MemberOperationsJobKind) -> bool` | 判断该logical job是否已注册可进入entry validation。 | fixed job kind。 | `bool`。 | `Registered` only；does not prove scheduler / external seam readiness。 |
| `pub fn record_issue(&mut self, issue_ref: MemberJobValidationIssueRef) -> Result<(), JobError>` | 记录safe registry assembly issue。 | redacted issue。 | success / error。 | only registry mutation；不改变domain / application / adapter状态。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn empty() -> Self` | 建立空logical job registry。 | 无。 | registry。 | infra runtime builder assembly；Step 14定义binding，不等于job activation。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| five-kind completeness before positive assembly | 若runtime配置要暴露jobs entry，五个kind都必须显式registered / blocked / disabled；missing kind不可用generic fallback补齐。 |
| registry is not scheduler | registry不定义cron、trigger、queue、lease、parallelism、retry、backoff、process、container或real run；这些留Step 12~14。 |
| jobs call application only | registered runner只能构造`MemberOperationsJobEntry`并调用application facade；不得直接访问domain、Store、Port implementation或worker/api entry。 |

### 23.8 jobs 模块内停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 五个 HLD Operations Job 都有唯一finite kind / entry / registry承接 | pass_for_current_step | `PublicationRelay`、`ObservationRelay`、`ExternalContextRefresh`、`MemberProjectionRebuild`、`GapReconciliation`均无隐含第六job。 |
| logical invocation与真实run / evidence分离 | pass | 只使用`MemberJobInvocationRef`；没有scheduler/run/process、artifact、test、evidence、verdict、signoff或readiness carrier。 |
| partial / waiting / blocked / unknown不伪装positive external outcome | pass | report只列local committed / unresolved refs；attempt / gap / projection对象继续维护各自truth。 |
| duplicate不重跑 | pass_with_future_port_work | `DuplicateReplayed`必须读取typed stored report；Step 7 / 13仍须闭合Store、digest、并发与missing behavior。 |
| Step 7 / 8承接 | ready_for_cross_module_audit | Step 7定义job registry / context / report / stored-result Ports；Step 8定义五Job DTO、result / report mapping；Step 9定义五条flow和local / external side-effect分界。 |

## 24. 字段、集合与对象覆盖闭环审计

本节不是重新定义 schema、repository 或持久化列，而是确认本 Step 中每个 planned object 的字段能追溯到一个允许的输入、factory、已有 local record 或显式后续 Port。若 Step 7~14 没有给出本节标注的读取面、写入面、DTO、事务、版本或绑定来源，实现侧必须暂停并回报缺口；不得在 handler、adapter、fake 或数据库模型中补造字段。

### 24.1 HLD 34 个关键对象覆盖

| HLD 组成部分 | HLD 对象数 | 本 Step 已闭合对象 | Step 6 对应章节 | 覆盖结论 |
|---|---:|---|---|---|
| CP01 Presence / Host | 5 | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt`、`PresenceAdmissionPolicy` | §10、§12 | 5/5；admission、presence、material、attempt、policy 未被压成 host lifecycle。 |
| CP02 Inbound | 5 | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、`SubscriptionScopePolicy`、`InboundScreeningPolicy` | §13 | 5/5；scope、intake、screening 与 policy source 未混同。 |
| CP03 Runtime Mediation | 5 | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception`、`RuntimeMediationPolicy` | §14 | 5/5；member local decision / attempt / link / reception 与 Runtime truth 分离。 |
| CP04 Outbound | 5 | `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、`OutboundMaterialPolicy` | §15 | 5/5；material、local seam attempt 与 downstream effect 未压平。 |
| CP05 Interaction Trace | 5 | `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy` | §16 | 5/5；trace、gap、material、attempt 与 observed / evidence 分离。 |
| CP06 External Mirror | 4 | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy` | §17 | 4/4；snapshot / neutral resolution / gap 未变成 external owner truth。 |
| CP07 Read Model | 5 | `MemberSummaryView`、`CapabilityOutletView`、`MemberProjectionState`、`MemberDiagnosticView`、`ReadProjectionPolicy` | §18 | 5/5；view / projection / read policy 不反写 source。 |
| **合计** | **34** | **34** | §10~§18 | **34/34**；没有隐藏第八 CP、mega-object 或 HLD 对象遗漏。 |

`MemberApplicationFacade`、operation / idempotency / stored-result / report assembly、infra / api / worker / jobs carrier 是 Step 5 已确认必须在对象层闭口的 supporting objects，不计入 HLD 的 34 个 domain / projection 对象分母；它们也不改变任何 CP 的 truth owner。

审计说明：`StartupAdmission` 与 `MemberPresence` 的完整 object card 在 §10.4 / §10.5；`§10` 的 capability / mapping 表已先行收口这两个 CP01 object。因此用 `#####` 搜索 object-card 标题时只会直接命中其余 32 张 card，不能作为 34/34 覆盖分母；本表按 HLD 正式对象清单逐项核验。

### 24.2 高复用字段来源、factory 输入与后续闭合点

| 字段 / 字段族 | 出现对象组 | Step 6 允许来源 / factory 输入 | 初始或派生规则 | 后续必须闭合 | 禁止推导 |
|---|---|---|---|---|---|
| member-local `*_id` | CP01~07 object、operation / result、config / entry / registry carrier | `MemberIdGeneratorPort` 的显式输入，或 Store load 的原值 | factory 只接收已生成 ID；successor / immutable revision 使用新 ID | Step 7 ID Port；Step 11 persistence | subject、route、timestamp、digest、row ID、run ID、fake counter。 |
| local / external `*_ref` | object relation、view、entry、result、report | 已提交 local object 的 typed ref，或 owner-bound `ExternalTypedRef` / wrapper | ref 只连接 identity；不得携带 owner body | Step 7 read / resolver Port；Step 8 DTO | bare string、URL、topic、path、display name、payload 或 adapter private object。 |
| `ProjectMemberRef + GlobalMemberRef` | CP01 admission / presence、CP02 scope、CP03 / CP04 / CP05 subjects、CP07 view | trusted command / formal source resolution / loaded local fact | 仅 project member 是 forward execution subject；anchor 必须匹配 | Step 7 subject / identity resolver；Step 8 metadata | Global member 单独充当执行主语，或第三种 personal / unknown subject。 |
| correlation / trace | `MemberCorrelation`、CP02~05 object、entry / context / result | trusted command/event/job metadata，或已匹配 source chain | `TraceId` 原样传播；correlation 由 boundary / committed fact mapper 提供 | Step 8 protocol mapping；Step 9 flow | payload digest、clock、request ID、job name、attempt ID 临时生成。 |
| timestamp / local revision / watermark | attempts、snapshot、view、projection、result | Clock Port、successor factory、committed source position | local time 不等于 owner time；watermark 不等于 storage version | Step 7 Clock / projection read Port；Step 10/11 | source version、page cursor、trace、idempotency key 或 timer 当 optimistic version。 |
| source resolution / freshness | CP01 policy、CP02 / CP03 / CP04 / CP05 boundary、CP06 / CP07 | loaded `ExternalContextResolution` / gap / owner-safe summary | positive path 只能消费 required purpose / scope / freshness 的 neutral resolution | Step 7 source resolver / mirror Store；Step 9 flow | adapter body、local default、stale snapshot、fake positive mapping。 |
| safe category / reason / inspection marker | domain policy、attempt / gap、view、entry / error carrier | formal safe classification、pure policy result、authorized transient inspection | non-empty opaque category；body 被销毁后只留下 marker / safe summary | Step 8 protocol mapping；Step 12 error mapping | raw body、secret、prompt、hidden reasoning、stack trace、free-form diagnostic text。 |
| operation / channel / idempotency / result | application、api、worker、jobs | validated entry metadata + canonical mapping + stored result save / get outcome | Query 没有 key / reservation；Command、Consumer、Job 必须带 key；result ref 必须匹配 operation / kind | Step 7 idempotency / result Port；Step 13 replay / conflict | trace、time、run、cursor 或 response body重建 key / result。 |
| config / availability / validation issue | infra、registry、api / worker / jobs entry | validated config plan、adapter slot result、redacted validation mapping | 只保留 ref / finite availability / issue ref；不能证明 activation / reachability | Step 7 composition Port；Step 12 / 14 | raw config、secret、URL、topic、cron、retry、adapter instance 或 host health。 |

### 24.3 对象组字段与 factory 闭环

| 对象组 | 已闭合的创建输入 | 允许的初始 / successor 方式 | 不能由实现侧补齐的字段或行为 | 后续 Step 承接 |
|---|---|---|---|---|
| CP01 | admitted project / identity anchors、startup / credential refs、resolution set、local IDs / revisions、safe purpose / correlation | admission 为 append-only decision；presence 从 accepted admission 开始；material immutable；attempt以 successor 记录 posture | host registration acceptance、host session / health、credential body、container lifecycle | Step 7 source / host seam / Store；Step 8 command / feedback DTO；Step 9 CP01 flow。 |
| CP02 | loaded presence / scope、trusted body-free descriptor / inspection marker、rule resolution、ID / revision / correlation | scope creates new revision；intake / screening each create a typed local record | Bus acknowledgement、raw event、Governance approval / rule body、implicit allowlist | Step 7 scope / mirror / receipt Store；Step 8 consumer DTO；Step 9 intake / screening flow。 |
| CP03 | accepted screening / intake, Runtime boundary ref and formal resolution, safe Runtime metadata, ID / clock / key | delivery decision immutable; submission attempt successor; result link / reception immutable | Runtime trigger payload、loop、context、plan、outcome、tool execution or runtime run | Step 7 Runtime entry / source Ports；Step 8 DTO；Step 9 local-first handoff flow。 |
| CP04 | accepted reception、target resolution、safe allowed refs / redaction profile / digest、ID / clock / key | decision / material immutable；attempt / gap successor or append-only | downstream payload / acceptance / delivery / observation truth | Step 7 publication / feedback Ports；Step 8 event / job DTO；Step 9 publication flow。 |
| CP05 | committed CP01~04 refs、typed source / predecessor refs、formal observation boundary / feedback、ID / clock / key | trace immutable; gap / attempt successor; observation material immutable | full log、observation backend event、evidence / verdict body | Step 7 trace / observation Ports；Step 8 Consumer / Job DTO；Step 9 trace / relay flow。 |
| CP06 | owner-bound source ref, declared purpose / scope, owner-safe version / digest / category / body gate, ID / clock | snapshot / resolution immutable; gap append / successor; policy pure | identity / policy / Runtime / Tools / Method / host body, authorization or health truth | Step 7 owner-specific resolver / mirror Store；Step 8 source-update DTO；Step 9 refresh flow。 |
| CP07 | committed local refs / safe summaries / neutral resolutions, projection state, watermark, formal visibility basis, ID / clock | views are immutable revisions; only projection state has guarded successors; Query only reads | source repair、authorization execution、Tool invocation、external definition / registry body | Step 7 read / visibility / projection Ports；Step 8 Query DTO；Step 9 rebuild / query flow。 |
| application | validated entry metadata, generated context / result / record / assembly IDs, stored-result pointer, policy decision | context short-lived; idempotency record successor; report assembly local-only before save | repository I/O hidden in facade, Query reservation, response body copy, real job run | Step 7 facade dependencies / result Store；Step 13 idempotency rules。 |
| infra / api / worker / jobs | validated config / registry plan and trusted boundary metadata | availability / registry carriers use explicit finite state; entries only translate to application context | concrete transport, broker, scheduler, process, storage engine, route, raw config or payload | Step 7 Ports；Step 8 protocol; Step 12~14 runtime binding / recovery。 |

### 24.4 所有 `Vec` 字段的 ordered-unique、non-empty 与空集语义

所有本 Step 的 `Vec` 都是 **stable ordered-unique collection**：保持 application / caller 已验证的顺序；重复 item 必须由 factory、record / register method 或 policy guard 拒绝，而非静默去重后改变语义。`Vec` 不能被替换为 `HashSet`、`HashMap`、自由标签 map 或未声明排序的 list。除下表明确的条件外，空集只表达“当前没有已知、已提交且允许展示的项”，绝不表达 external success、current、delivery、authorization 或没有风险。

| 对象与字段 | ordered-unique key / 顺序 | non-empty 条件 | 允许空集的精确语义 |
|---|---|---|---|
| `MemberJobReport.{scanned_fact_refs,advanced_fact_refs,unresolved_refs}`；`MemberJobReportAssembly` 同名三字段 | typed `MemberJobReportFactRef` / `TypedRef`；记录顺序是 application returned order | `PartiallyCompleted` 必须同时有 advanced 与 unresolved；`Completed` 不能有 unresolved | no candidate scanned、no local successor，或无 unresolved；不是 scheduler / external effect 结论。 |
| `SourceResolutionSet.roles` | `SourceResolutionKind` | positive policy evaluation 必须覆盖该 policy的 required roles | missing / stale / conflict role 只能进入 fail-closed evaluation，不能伪造 covered role。 |
| `MemberSubscriptionScope.{fact_categories,boundary_refs}` | category value / owner-bound external ref | two collections均非空，才能形成可用 positive scope | 无 scope 只能由 decision 被 blocked / rejected 表达；不能当 unrestricted subscription。 |
| `AttemptResolutionEvidence.resolution_refs`；`HostResolutionEvidence`、`RuntimeResolutionEvidence`、`PublicationResolutionEvidence`、`ObservationResolutionEvidence` 的 `resolution_refs` | `ExternalContextResolutionId` | 要解开 unknown fence 时至少一条匹配 original key / purpose 的 formal resolution required | empty 表示尚无正式依据；不得进行 retry / positive successor。 |
| `MemberInteractionSummary.{categories,gap_refs}` | safe category / typed ref | materialized non-normal interaction summary 至少有 category 或 gap；若同时为空应为显式正常摘要且由 policy 允许 | 无已知低敏 category / gap，不等于 source log 完整。 |
| `StartupAdmission.source_refs` | `TypedRef` | `Accepted` 必须保留最小 subject / identity / startup / credential basis；`Blocked` / `Rejected` 至少有可用 ref 或 safe missing reason | empty 仅表示 required source identity本身缺失；不允许被用于 accepted admission。 |
| `PresenceAdmissionPolicy.required_resolution_kinds` | `SourceResolutionKind` | fixed factory至少含 `SubjectIdentity`、`StartupCredential` | 不允许 caller 清空或覆写 requirement。 |
| `SubscriptionScopeDecision.source_refs`；`ScreeningDecision.source_refs` | `TypedRef` | positive `Active` scope / `Passed` 或 narrowed `Degraded` screening必须留其最小 basis | blocked / rejected / pending可仅留可证明的现有 refs，但不能以空集升级。 |
| `SubscriptionScopePolicy.required_source_kinds` | `SourceResolutionKind` | fixed project policy至少覆盖 subject / identity 与 screening-rule context | 不允许配置将其清空。 |
| `InboundScreeningPolicy.allowed_dispositions` | `ScreeningDisposition` | fixed factory恰含 `Passed`、`Degraded`、`Blocked`、`Pending` | 不允许 caller删除 fail-closed variants 或添加 general success。 |
| `MemberOutboundMaterial.allowed_refs` | `TypedRef` | immutable material必须 non-empty | empty 不可构造 material；不以 digest 代替 allowed ref。 |
| `InteractionTraceEntry.{source_refs,predecessor_refs}` | typed source ref / trace entry ID | `source_refs` 至少保留 trace basis；predecessor若存在必须 same correlation | empty predecessor表示本 chain 的第一条 local trace，不代表没有 source relation。 |
| `InteractionGap.actual_refs` | `TypedRef` | 非 `MissingRef` gap应至少有一个当前可证明 ref | only `MissingRef` may be empty，且只是“未找到 required ref”。 |
| `ObservationMaterial.{trace_refs,gap_refs,categories,safe_dimensions}` | trace / gap IDs, category, dimension name | trace 和 gap 合计至少一个；categories non-empty；dimension name unique | empty trace 或 gap单侧仅表示 material由另一侧支撑；empty dimensions表示无允许低基数维度。 |
| `ExternalContextSnapshot.safe_categories` | `ExternalContextCategory` | snapshot capture必须 non-empty | empty 不可伪装为 owner-safe classification。 |
| `ProjectionDegradationSurface.gap_refs` | `TypedRef` | degraded surface若 reason涉及 gap必须 non-empty | empty 可表示仅有 safe degraded reason、尚无可引用 gap；不是 current。 |
| `CapabilityOutletView.{tool_contract_refs,capability_binding_refs,method_definition_refs,resolution_refs,gap_refs}` | typed ref / resolution / gap ID | `Available` requires at least one display ref plus matching resolution(s); refs that are present must be unique | individual display collections may be empty；`NotAvailable` / `Stale` / `Gap` may have no display refs；empty never grants invocation. |
| `MemberProjectionState.gap_refs` | `TypedRef` | constrained state with a known gap must include it | empty is valid for current / disabled or a non-gap reason; it never proves all foreign sources current. |
| `MemberDiagnosticView.{diagnostic_categories,trace_refs,gap_refs,source_resolution_refs,explanation_refs}` | category / typed ref / resolution ID | each present explanation chain must have a category or typed basis; no body-free diagnostic can contain arbitrary free text | empty optional lists express no safe item is exposed; diagnostics remain optional and must not fabricate an explanation. |
| `MemberRuntimeBuilderState.{adapter_availability,issue_refs}`；`MemberInfraStoreState.issue_refs` | adapter slot / issue ref | required adapter slots need an explicit availability record before positive builder assembly; error state needs issue(s) | empty issues mean no local assembly issue known; empty availability only means unassembled, not runnable. |
| `MemberCommandEntry.validation_issue_refs`；`MemberQueryEntry.validation_issue_refs`；`MemberApiHandlerResult.validation_issue_refs` | API issue ref | rejected entry / handler must be non-empty; accepted / served paths must be empty | empty entry issues permit later validation only; it is not command execution / query visibility proof. |
| `MemberApiRegistryState.{command_entry_refs,query_entry_refs,validation_issue_refs}` | API entry ref / issue ref | a positive registered API surface needs the explicitly selected entry refs; cross-collection intersection forbidden | empty registry is pre-assembly; empty issue list is not endpoint exposure. |
| `MemberInboundConsumerEntry.validation_issue_refs`；`MemberConsumerItemResult.{unresolved_refs,validation_issue_refs}` | worker issue / typed ref | non-ready entry and non-positive non-duplicate result need issue(s); `LateClassified` / `Blocked` require unresolved ref(s) | ready / accepted / duplicate paths have empty issues; empty unresolved on accepted is not broker acknowledgement. |
| `MemberWorkerRegistryState.{registrations,validation_issue_refs}` | consumer kind and entry ref / issue ref | positive assembly must explicitly account for all 14 finite kinds as registered / blocked / disabled | empty registry is an unassembled carrier; no generic missing-kind fallback. |
| `MemberOperationsJobEntry.validation_issue_refs`；`MemberJobRunResult.validation_issue_refs` | jobs issue ref | non-ready entry and partial / waiting / blocked / unknown / rejected result need issue(s); completed / duplicate have none | empty entry issues do not create a real scheduler invocation. |
| `MemberJobRunnerRegistryState.{registrations,validation_issue_refs}` | job kind and entry ref / issue ref | positive jobs assembly must account for all five kinds as registered / blocked / disabled | empty registry means no declared job boundary, not a disabled scheduler claim. |

### 24.5 collection audit conclusion

| 审查项 | 结论 | 约束 |
|---|---|---|
| ordered-unique 规则可落码 | pass_for_design | 每个 `Vec` 的 uniqueness key、稳定顺序和拒绝重复 owner 已在对象卡片或 §24.4 给出；具体 helper trait / storage ordering留 Step 7 / 11。 |
| non-empty 与空集未被混淆 | pass_for_design | positive material、scope、snapshot、policy requirement和明确失败 surface均有 non-empty gate；空集没有被解释为 success。 |
| collection 未暗藏外部 body | pass_for_design | collection元素全部为 typed ref、finite category、safe dimension、slot或redacted issue；没有 payload、definition、log、credential或 provider response。 |
| map / generic collection pollution | pass_for_design | 未使用 free-form map、generic `Any*` collection或动态 provider / topic list代替有限对象边界。 |

## 25. 状态、初始工厂与转换闭环审计

Step 6 固定有限 variant、factory initial posture和 transition owner；它不替代 Step 10 的全量转换矩阵。任何 Step 10 未明确允许的迁移均为 forbidden。immutable decision / material / link / view 的“状态”只来自其创建时的 factory 输入，后续变化必须以新 object、successor record、gap 或 projection revision 表示。

| 状态族 | 初始 / 来源 | 可变或 successor owner | 终态 / 保守状态 | Step 10 必须补齐 |
|---|---|---|---|---|
| `StartupAdmissionDisposition` | `PresenceAdmissionPolicy::evaluate` 通过 `StartupAdmission::decide` | 无原地迁移；新 basis生成新 admission | `Accepted` / `Rejected` terminal；`Blocked` 不可自动提升 | admission basis变化、accepted-to-presence gate及 forbidden rewrite。 |
| `MemberPresenceStatus` | `start_from` creates `Starting` | `MemberPresence::transition_to` only, with next revision and typed reason | `Terminated` terminal；`Unknown` / `Degraded`不可由 heartbeat解封 | Starting / Ready / Degraded / Draining / Unknown / Terminated全矩阵。 |
| `HostCollaborationAttemptStatus` | `prepare` creates `Prepared` | attempt successor methods | `FeedbackLinked` is local link posture; `Blocked` / `Unknown` preserve fence | prepared / submitted / feedback / blocked / unknown legal edges and retry-evidence gate。 |
| `SubscriptionScopeStatus` / `InboundIntakeDisposition` / `ScreeningDisposition` | scope policy; trusted intake gate; screening policy | scope only via successor / revision; intake and screening are immutable records | blocked / unsupported / pending are fail-closed; `Passed` is not Runtime acceptance | scope replacement / supersede; screening degraded constraint; no implicit re-screen. |
| `RuntimeDeliveryDisposition` / `RuntimeSubmissionAttemptStatus` / `RuntimeMaterialReceptionDisposition` | pure mediation policy; attempt `Prepared`; safe reception factory | only attempt uses successor methods; decision / reception are immutable | `Blocked` / `Pending` / `Unknown` fence positive path; `ResultLinked` is only local link | eligible mapping gate; submission unknown recovery; duplicate / late reception behavior. |
| `RuntimeResultClassification` | owner-validated Runtime ref mapped at immutable link factory | none | classification remains foreign-result reference classification | mapping failure and late result handling; never turn into member general success. |
| `OutboundDisposition` / `PublicationAttemptStatus` / `PublicationGapStatus` | outbound policy; attempt `Prepared`; gap `Open` / conservative factory input | attempt and gap use successor records | `FeedbackLinked` only links feedback; blocked / unknown / unresolved stay explicit | material gate; attempt / gap ordering; resolved-gap effect limits. |
| `InteractionGapStatus` / `ObservationAttemptStatus` | gap factory selects only allowed non-positive initial status; attempt `Prepared` | gap / attempt successors only | `Resolved` explains gap only; `Unknown` and `Blocked` do not invoke seam | missing / conflict / ordering branches; observation feedback / unknown transitions. |
| `ExternalContextResolutionStatus` / `ExternalContextGapStatus` | mirror evaluation / immutable resolution factory; gap factory | new snapshot / resolution / gap successor, not mutable owner truth | stale / conflict / unresolved / unavailable / unknown all fail closed | source change, stale, conflicting source, blocked seam and resolution linkage rules. |
| `MemberProjectionStatus` / `ProjectionFreshness` / `CapabilityOutletStatus` / `ProjectionVisibility` / `ProjectionServeDisposition` | projection initialize; read policy / committed state calculation | only `MemberProjectionState` has guarded successors; other values are immutable view / decision output | disabled / unknown / not-ready / not-visible must remain visible in response posture | stale / rebuilding / failed / current sequence; Query no-write behavior; outlet non-authorizing matrix. |
| `MemberIdempotencyState` | `reserve` creates `Reserved` | `complete` or `mark_conflict` emits successor | `Completed` / `Conflict`; Query excluded | reserve race, key/digest mismatch and stored-result-missing behavior. |
| infra `MemberAdapterAvailabilityState` / builder / store / blocked-seam state | validated config / adapter slot outcome | infra successor methods only | unavailable / blocked stay fail closed; `Ready` does not claim external availability | assembly, degraded, failed, binding validation and no-positive-fallback rules. |
| API entry / handler disposition | entry factory / read decision / stored result mapping | entry rejection only; handler result immutable | `Rejected`, `QueryNotReady`, `QueryNotVisible` are explicit surfaces | command / query result mapping, response serialization and protocol errors. |
| worker entry / registration / item disposition | owner-specific boundary validation / runtime assembly plan | registry mutations; item result immutable | blocked / rejected / unsupported / quarantined do not dispatch; duplicate must read stored result | schema rejection, continuation mapping, duplicate receipt missing and recovery semantics. |
| jobs entry / registration / run disposition | trusted logical job metadata / assembly plan | registry mutations; run result immutable | `Rejected` no mutation; `Waiting` / `Blocked` / `Unknown` not schedule directives | five job input mapping, stored-report replay, missing report, no real-run semantics. |

| 状态闭环结论 | 说明 |
|---|---|
| finite enum only | HLD state subjects和 supporting entry / availability state均有 named finite enum；没有 `bool`、stringly status 或 generic success 逃逸口。 |
| factory / transition separation | immutable facts由 factory完成；仅 presence、attempt、gap、projection、idempotency和infra state可产生明确 successor。 |
| owner boundary retained | host / Runtime / downstream / observation / external source state不被 member state enum替代。 |
| Step 10 is mandatory | Step 10 必须回收本表每个可变状态的 allowed / forbidden transition、terminal、reopen、late / duplicate处理；实现不得从方法名自行推导。 |

## 26. Query、重复回放与 entry / job 处置审计

| 审查项 | Step 6 已收口的规则 | 后续闭合位置 | 当前禁止事项 |
|---|---|---|---|
| Query no-write | `MemberQueryEntry` 只能构造 `MemberOperationChannel::Query`；`MemberOperationContext::assert_query_no_write` 拒绝 key、consumer source、job invocation和command metadata；`ReadVisibilityDecision` / `MemberProjectionState::can_serve` 均为 no-write carrier | Step 8 Query DTO；Step 9 query flow；Step 10 / 13 | query reserve idempotency、mark stale、refresh、rebuild、dispatch job或修复 gap。 |
| Command duplicate | Command context 必须有 normalized key + stable digest；`Completed` idempotency record只回放 typed stored result | Step 7 result / idempotency Port；Step 13 | 重跑 domain transition、用 current Store拼 response、从 trace / time重新生成 key。 |
| Consumer duplicate | `DuplicateReplayed` 指向 typed stored consumer result；缺失或 kind不匹配必须 `WorkerError::StoredReceiptUnavailable` | Step 7 receipt / result Port；Step 8 Consumer receipt；Step 13 | 再次 inspection、transition、publish、source scan或 adapter call。 |
| Job duplicate | `DuplicateReplayed` 只回放 matching stored `MemberJobReport`；缺失或 wrong-kind必须 `JobError::StoredReportUnavailable` | Step 7 stored report Port；Step 8 Job result；Step 13 | 重新 scan facts、发起 relay、refresh source、rebuild projection或构造新 report。 |
| non-positive worker / job result | blocked、late、unsupported、quarantined、waiting、unknown、rejected以 finite disposition + safe issue / unresolved typed ref表达 | Step 8 schema；Step 12 recovery；Step 13 retry policy | 将其当 broker ack、DLQ、delivery、observation、external acceptance、scheduler instruction或 evidence。 |
| entry-layer dependency direction | api / worker / jobs 只构造 entry / context并调用 application facade或 named service | Step 7 trait injection；Step 9 flow | entry直接访问 domain transition、Store、UnitOfWork、resolver、publisher或 concrete adapter。 |

## 27. 跨模块依赖分类审计

下表只做 dependency category 校准；它不把 runtime / event collaboration伪装成 package dependency，也不把 typed ref误写成 adapter implementation。

| 分类 | Step 6 中的允许形态 | 当前 owner / 状态 | 不允许的误分类 |
|---|---|---|---|
| compile dependency | planned Core shared primitive / trait candidate，例如 `core-contracts` actor、metadata、trace、watermark、opaque external reference | Core 是唯一 compile candidate；member-specific Core carrier受 `L2M-UP-005` pending | 将 `L2-runtime`、`L2-tools`、member-service、member-images、Conversation、Governance或Bus event协作写成 crate dependency。 |
| runtime dependency | host collaboration seam、Runtime entry / handoff、owner-specific resolver、publication / observation seam、runtime builder slot | Step 7 Port / Step 14 binding；`L2M-UP-001~004/006~008`分别限制正向路径 | 把 availability marker当 host / Runtime / downstream readiness，或以 local default补齐。 |
| event dependency | external Consumer envelope和committed-fact continuation的 logical source shape | Bus / Core formal route / schema仍受 `L2M-UP-005` 限制；worker只保留 entry carrier | 将 source event ref等同 broker ACK、route存在、listener运行、delivery或event package dependency。 |
| ref dependency | `ExternalTypedRef`及 Work / Identity / Governance / Runtime / Tools / Method / Conversation / downstream wrapper | external owner保有 truth；member只读取 ref / safe category / neutral resolution | 用 ref复制 policy、approval、conversation、capability registry、Runtime outcome或 provider body。 |
| adapter dependency | owner-specific future Port / adapter slot；blocked seam state可表达不可用 | Step 7 trait；Step 14 config / composition；无 concrete adapter选择 | generic external adapter、MCP / A2A / API owner adapter、route / UDS / HTTP / RPC私设。 |
| persistence dependency | member-local Store、result / idempotency / projection / mirror / trace relation的 planned Port | `L2M-DDD-002`：Store / UoW / version / transaction尚未裁决 | 声称数据库、schema、transaction、row version、outbox、durable replay已经实现或已选型。 |
| fake dependency | Step 16 以后可为正式 Port提供明确 fake，且必须标为 fake | 当前没有 fake / test implementation | fake source / fake success用来关闭 Runtime、host、policy、credential、event或 source blocker。 |

### 27.1 上游 blocker 未被对象层伪关闭

| blocker | Step 6 仍受影响的对象 / carrier | 当前保守口径 |
|---|---|---|
| `L2M-UP-001` member-service lifecycle / IPC / credential boundary | CP01 material / attempt、infra blocked seam、api / worker entry | 只保留 host typed ref、registration / liveness / status material与 blocked state；不选择 IPC / UDS / RPC。 |
| `L2M-UP-002` member-images release / manifest boundary | infra config / builder only | image / manifest / compatibility不成为 member domain object或 compile dependency。 |
| `L2M-UP-003` Runtime entry mapping | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、Runtime boundary context update | exact mapping不可证明时只允许 `Blocked` / `Pending`，不得生成 Runtime trigger。 |
| `L2M-UP-004` Runtime handoff / material source | `RuntimeResultLink`、`RuntimeMaterialReception`、outbound / observation boundary | only typed ref / safe metadata；无法证明时保持 gap / blocked / unknown。 |
| `L2M-UP-005` Core member event carrier / route | worker external / continuation carrier、event / trace metadata | no member-local CloudEvents / route / envelope shadow schema。 |
| `L2M-UP-006` credential / identity anchor | `StartupAdmission`、presence policy / CP06 resolution | absent or unverifiable credential / anchor remains fail closed. |
| `L2M-UP-007` screening taxonomy / policy source | subscription / screening object and policy | no local allowlist; unknown / stale / conflict cannot become `Passed`. |
| `L2M-UP-008` third execution subject | every subject-bearing CP01~05 object and CP07 view | only `ProjectMemberRef + GlobalMemberRef`; no third subject fallback. |
| `L2M-DDD-001` target implementation repository absent | every planned Rust type / file mapping | all snippets remain planned source contracts; no source repository or build claim. |
| `L2M-DDD-002` persistence / UoW undecided | ID / revision / Store / result / idempotency / projection objects | type contracts are closed, but save / load / version / atomicity are blocked for Step 7 / 11. |

## 28. 历史污染、重复类型与非伪造审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| historical README CloudEvents / W3C wording | retained_as_history_only | shared envelope / trace authority只能由 current Core承接；本 Step没有 member-specific event source、subject、payload或 route shadow type。 |
| AG-UI、UDS、launch token、supervisord、固定 SLA / P95 | not_inherited | 未变成 object field、adapter、config、route、process或 acceptance claim；若未来正式 authority出现，必须回开相应 Step。 |
| Runtime / Tools boundary | pass_for_design | no Runtime loop / context / plan / outcome, tool execution, capability registry, external MCP / A2A / API adapter owner is modeled as member truth. |
| host / image / sandbox / governance / conversation / observability boundary | pass_for_design | no container lifecycle, image build, sandbox truth, governance approval truth, conversation truth or observability backend carrier was added. |
| duplicate / ambiguous type | pass_for_design | 34 HLD objects each have one CP / module owner; report uses `contracts::jobs`, assembly stays application; no parallel generic listener or generic job type. |
| generic listener / job escape hatch | pass_for_design | worker has exactly 10 external + 4 committed-fact kinds; jobs has exactly five logical kinds; future kind requires HLD reopening. |
| implementation-fact fabrication | pass_for_design | 文中 Rust 仅为 planned contract；未声明 source file已存在、编译、运行、测试、artifact、real run、evidence、verdict、signoff或 readiness。 |

## 29. 正式装配索引与 Step 7 承接清单

### 29.1 未来正式 `03-详细设计.md` 的回填边界

| 正式章节 | Step 6 回填来源 | 需保留的内容 | 不得提前写入 |
|---|---|---|---|
| §5 模块实现契约 / `contracts` | §7、§9、§11、§18、§24 | typed ID / ref / metadata / state / public view / report carrier | Core未定 member event schema、public DTO body。 |
| §5 模块实现契约 / `domain` | §10~§18、§24~§25 | 34 object cards、factory、pure policy、state / body / owner boundary | Port、repository、transaction、external payload / route。 |
| §5 模块实现契约 / `application` | §19、§24、§26 | facade、context、idempotency、stored result、visibility、report assembly | concrete service implementation / hidden Store access。 |
| §5 模块实现契约 / entry modules | §20~§23、§26~§27 | infra availability、API / worker / jobs entries and finite dispositions | transport / scheduler / broker / process / raw config。 |
| §6 / §7 object and closure index | §5、§24~§28 | 34/34 inventory、field sources、collection and state closure、blocker classifications | test results、implementation / repository claims。 |

正式 `03` 仍受 Step 19 与新的用户授权门禁约束；本 Step 没有写入正式正文。

### 29.2 Step 7 Trait / Port / Adapter 必须承接的输入

| Step 7 契约组 | 必须读取的 Step 6 输入 | Step 7 必须回答 |
|---|---|---|
| ID / Clock / digest Port | §7 shared values、§24.2 IDs / time / digest | 每一个 factory所需 ID、Clock、digest的生成 / failure / redaction边界。 |
| CP01~CP06 local Store / repository Port | §10~§17 object fields、factory、successor rules | get / list / save / append的 typed read / write face；不得返回 foreign body。 |
| source resolver / mirror Port | CP06 snapshot / resolution / gap、§24.2 resolution fields | owner-specific safe summary / source version / digest / resolution outcome；不得返回 owner body。 |
| Runtime / host / publication / observation seam Port | CP01 / CP03 / CP04 / CP05 attempts and gaps | source-specific input / output refs、unknown fence、availability；不得私设 protocol / adapter owner。 |
| projection / visibility / read Port | CP07 state / views / policy | affected projection lookup、read / replace / mark stale、visibility basis and no-write read face。 |
| idempotency / stored-result Port | §19 and §26 | reserve / complete / conflict、typed command / consumer / job result save / get / missing behavior。 |
| API / worker / jobs composition Port | §20~§23 registry and entry carrier | finite registration / lookup、application-only dispatch、blocked / disabled binding。 |
| config / availability Port | infra carrier and `L2M-UP-*` table | validated config ref、slot availability、redacted issue；不暴露 secret / URL / topic / cron。 |

### 29.3 Step 7 启动红线

| 红线 | 说明 |
|---|---|
| 不在 Port 中隐式增加对象字段 | 若 Port需要的 identity、version、source / result ref或 state在 Step 6 未闭合，必须回开 Step 6，不得在 trait关联类型或 adapter private state补造。 |
| 不让 Port 返回 external body | member Port只可返回 local object、typed ref、safe category / summary、source version、digest、watermark、availability或 redacted issue。 |
| 不让 entry modules直接拿 Port | api / worker / jobs继续只依赖 application facade / named service；Port注入和调用顺序属于 application / infra composition。 |
| 不用 stored-result 缺失重跑 | missing / kind mismatch必须显式失败 surface；不得用当前 Store / adapter重新构造 command receipt或 job report。 |
| 不关闭 blocker | `L2M-UP-001~008`、`L2M-DDD-001~002`只能在对应上游正式契约或后续本仓步骤中被证据化关闭，不能通过 trait名称关闭。 |

## 30. Step 6 完成门禁与停审结论

| 检查项 | 结论 | 依据 |
|---|---|---|
| 七模块对象归属已覆盖 | pass_for_design | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 均在 §7~§23 展开。 |
| HLD 34 对象无遗漏 | pass_for_design | §24.1 的 5 + 5 + 5 + 5 + 5 + 4 + 5 = 34。 |
| supporting carrier 未被机械后移 | pass_for_design | operation / result / visibility / availability / entry / registry / job report carrier均已有唯一 owner。 |
| 字段与 factory 输入可追溯 | pass_for_design | §24.2~§24.3 定义允许来源、初始 / successor方式和后续 Port闭合点。 |
| 所有 `Vec` 语义被审计 | pass_for_design | §24.4覆盖 ordered-unique、non-empty和empty semantics；没有 free-form collection。 |
| 状态闭环可移交 | pass_for_design | §11、§17、§18、§20~§23及§25固定 variant、factory和owner；完整矩阵留 Step 10。 |
| Query / duplicate / job disposition 受限 | pass_for_design | §19~§23与§26明确 Query no-write、stored replay和missing behavior。 |
| dependency category 无伪装 | pass_for_design | §27区分 compile、runtime、event、ref、adapter、persistence和fake。 |
| 上游与实现 blocker 未被伪关闭 | pass_with_upstream_blockers | §27.1保留 `L2M-UP-001~008`、`L2M-DDD-001~002`。 |
| 正式文档与实现仓未提前改写 | pass_for_design | 仅维护 calibration；`formal_03_write_allowed = false`，没有 implementation / commit。 |

```text
current_document = 03-详细设计.md
current_step = Step_06_object_contracts_completed_stop_review
step_06_status = completed / pass_with_upstream_blockers / stop_review
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
next_step_candidate = Step_07_trait_port_adapter_contracts
next_step_precondition = explicit_user_confirmation_then_read_Step_07_SOP_and_writing_standard
```

Step 6 至此停审。它只证明对象契约已到可由 Step 7 承接的粒度；没有 Port、protocol、function flow、state matrix、persistence、recovery、concurrency、configuration binding、observability或测试切口时，仍不得实现或声称可运行。
