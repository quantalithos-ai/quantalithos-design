# L4-sandbox 详细设计 Step 7 回归中间产物：Resolver Ports

> 对应正式文档：`projects/L4-sandbox/03-详细设计.md`
>
> 当前任务：`S7-03A identity/reference/policy/capability resolver`
>
> 当前状态：`completed_wait_user_review`
>
> 本文件是 Step 7 中间产物，不是正式详细设计、实现代码、测试结果或验收事实。

## 1. Step 状态

| field | value |
|---|---|
| current document | `03-详细设计.md` |
| current Step | Step 7 regression / `7R-03A` |
| task | `S7-03A` |
| module | `application` resolver ports；`infra` adapter implementations later |
| classification | L1 主流程安全边界 |
| status | `completed_wait_user_review` |
| consumed gate | `S7-G02` user review confirmed |
| predecessor | `7R-02A~D completed` |
| next task | 用户确认后进入 `S7-03B`；本任务停审前禁止启动 |
| Step 8 | `blocked_by_step_7_regression` |
| formal `03~07` | `historical_reviewed_revalidation_pending` |
| implementation | `CB-SBX-01A blocked / wait_design` |

## 2. 本步输入与 source map

### 2.1 标准输入

| source | 本批消费内容 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | port capability、trait签名、调用方/实现方、读取面、错误和逐模块停审 |
| `standards/document/详细设计书写规范.md` | application/infra边界、Rust契约粒度、正式回填位置 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段来源、identity、freshness、错误和下游flow闭环 |
| `standards/document/设计文档讨论中间产物规范.md` | 问题回答、诊断、取舍、结构化产物、回填草稿和恢复点 |

### 2.2 项目 current source

| source | current authority | 本批用途 |
|---|---|---|
| Step 5 module contracts | `application`唯一拥有port trait；`infra`只实现 | 固定依赖方向 |
| Step 6 shared types | `ExternalSourceRef(Set)`、`SafeSummaryRef(Set)`、`SandboxTraceContext`、canonical status | 固定body-free carrier与禁止字符串解析 |
| Step 6 context/boundary | `ContextReferenceResolution`、`ExecutionContextResolution`、`ExecutionEnvironmentIdentity`、`BoundaryRequirementSet`、`BackendCapabilitySummary` | 固定resolver observation到domain factory的构造目标 |
| Step 6 policy/run/capture | `PolicyAuthorizationSummary`、`PolicyApplicabilitySnapshot`及其checked factory | 固定policy输入关系、freshness和fail-closed |
| Step 6 failure/cleanup/read | `ReferenceRefreshMarker`、`ReferenceResolutionObservation`、`ReferenceResolutionState` | 固定长期reference refresh与首次intake分离 |
| Step 6 handoff `S7H-11` | 四类source必须有exact typed input、finite outcome、body-free summary和显式unavailable/invalid/stale | 固定本任务完成门禁 |
| Step 7 `7R-01~02` | 42 callable、application-owned clock/id、committed read、repository/UoW/idempotency | 固定调用位置；resolver本身不持久化、不分配identity、不打开UoW |

### 2.3 上游项目参考及裁剪

| upstream | 可消费结论 | 不可消费内容 |
|---|---|---|
| `L1-identity` | actor/subject等只以稳定ref或safe summary进入Sandbox | identity正文、凭证、授权生命周期 |
| `L1-work` | project/work/implementation context只以稳定ref或safe summary进入Sandbox | work正文和业务状态推进 |
| `L2-tools` | tool scope是输入来源之一；Sandbox只验证边界引用 | tool semantic execution、tool body或调用编排 |
| `L2-runtime` | runtime/runner correlation是输入来源之一 | agent loop、runtime主状态和重试编排 |
| `L2-member-service` | member host/actor binding只作为外部稳定来源 | member lifecycle、host orchestration和业务ready truth |

当前未发现需要上游新增接口才能完成本批的L1/L2 blocker。旧L2文档中的裸字符串handle、bool ready或聚合
binding只能视为historical material，不能替代Step 6 current typed ref与checked relation。

## 3. SOP 问题回答

### Q1. 哪些模块需要定义 resolver trait？

只有 `application` 定义四个resolver port：execution identity context、tracked reference、policy applicability、backend
capability。`infra`在后续adapter批实现这些trait；`domain`只拥有checked truth factory；`api/worker/jobs`不得直接调用resolver。

### Q2. 谁调用、谁实现？

| resolver family | application caller | implementation owner | direct entry access |
|---|---|---|---|
| identity context | intake command/consumer facade内部 | `infra` context resolver adapter | forbidden |
| tracked reference | intake continuation、reference consumer、refresh Job facade内部 | `infra` source-specific resolver adapter | forbidden |
| policy applicability | policy evaluation command facade内部 | `infra` policy summary adapter | forbidden |
| backend capability | boundary command与capability refresh Job facade内部 | `infra` backend capability adapter | forbidden |

### Q3. 每个接缝承接什么对象能力？

resolver只提供外部观察，不直接返回Sandbox-owned truth。application收到finite outcome后，补入本地named ref、trusted
clock和已提交owner group，再调用Step 6 checked factory形成immutable snapshot或state transition。

### Q4. 输入字段从哪里来？

所有target identity来自entry已校验ref或committed Sandbox owner；required kind/role、requirement与marker集合来自domain
对象；trace来自application call context。resolver不能从route、topic、opaque ref字符串、provider response或current/latest
扫描反推这些字段。

### Q5. 函数签名需要达到什么粒度？

四个trait必须分别给出exact request、finite outcome和closed error。首次intake与tracked refresh不可合并；policy与capability
不可合并成generic summary resolver；每个method只能处理一个explicit request，不接受`HashMap<String, Value>`。

### Q6. 读取结果是否足够支撑下游？

结果必须覆盖Step 6 factory所需的body-free source、summary、conflict/gap、freshness与provider disposition；本地identity和
time不从resolver返回。Step 9可以机械执行 `port -> validate outcome -> domain factory -> repository/UoW`，无需猜字段。

### Q7. resolver是否有写入、version或UoW？

没有。四类resolver均为外部只读观察接缝，不接受 `SandboxUnitOfWork`、repository `Version`或id generator。持久化、CAS、
idempotency和commit-unknown仍由application facade与`7R-02` repository契约负责。

### Q8. 哪些依赖只能经port访问？

identity/work/tool/runtime/member/runner source、policy summary和backend capability provider只能经对应application port访问。
domain、entry和repository不能调用provider SDK；infra outcome不得携带SDK object、raw response、credential、path或正文。

### Q9. fail-closed如何机械判断？

只有各trait的positive variant可进入对应Step 6 positive factory。`Stale/Unavailable/Invalid/Conflict/Missing/Unsupported`
均为正常finite observation，不允许adapter抛字符串后由application猜测，也不允许映射为empty-success。

### Q10. 当前模块能否停审？

四组trait、request/outcome/error、构造映射、freshness、字段来源和跨resolver审计完成后，本任务可以停审；停审只表示
`S7-03A`设计包完成并等待用户复核，不表示`7R-03`整体完成，也不允许自动启动`S7-03B`。

### Q11. 当前是否存在跨模块重复或反向依赖？

旧 `ContextReferenceResolverPort`混合首次intake与长期refresh，旧`BackendCapabilityPort`把capability与后续backend lifecycle
放在同一章节，且全部返回`ApplicationResult<T>`。这些是historical冲突；本批将拆成exact resolver ports，后续`S7-03B`
单独定义lifecycle external ports。

## 4. 当前文档问题诊断

| ID | historical location / material | 问题 | 当前处置 |
|---|---|---|---|
| `RSL-D01` | 旧Step 7 §12.3 `ContextReferenceResolverPort` | `resolve_context_refs`与`refresh_tracked_refs`共享宽泛outcome，混淆首次intake和长期state | historical_material；拆为identity context与tracked reference两个port |
| `RSL-D02` | 旧`ContextReferenceResolutionOutcome` | public字段可任意组合，`Vec<SandboxReason>`无法证明kind/source关系 | historical_material；改为private checked request与finite typed variant |
| `RSL-D03` | 旧`ApplicationResult<T>` | provider observation和调用失败混在application通用错误中，易靠字符串分类 | historical_material；每个port使用closed error，业务状态进入outcome |
| `RSL-D04` | 旧`PolicySummaryPort` | 直接传完整context/requirement并直接返回domain snapshot，未分开provider observation与truth factory | historical_material；返回body-free observation，application调用factory |
| `RSL-D05` | 旧`BackendCapabilityPort` | `load`/`refresh`目标identity不一致，旧refresh只用opaque backend profile ref | historical_material；统一backend source + requirement ref exact target |
| `RSL-D06` | 旧backend章节 | capability resolver与establish/launch/inspect/release混组 | historical_material；本批只保留capability resolver，lifecycle归`S7-03B` |
| `RSL-D07` | 旧L2 member/tools/runtime文档 | bool ready、string handle或产品正文可能被误当Sandbox输入 | historical_material；只接收current typed ref/safe summary |
| `RSL-D08` | 正式`03-详细设计.md`现有Step 7内容 | 尚未按本轮current source重验，不是本批写入目标 | `historical_reviewed_revalidation_pending` |

## 5. 改动前后对比

| dimension | before | after | reason |
|---|---|---|---|
| trait ownership | 宽泛port名称，infra/application边界模糊 | application唯一拥有四个port trait，infra只实现 | 保持依赖方向 |
| resolution scope | intake与refresh混合 | 首次identity context和tracked reference分离 | 两类状态生命周期不同 |
| return type | 直接返回domain truth或public-field outcome | 返回typed provider observation，application调用checked factory | 防止adapter拥有Sandbox truth |
| error model | `ApplicationResult<T>` | finite outcome + family-specific closed port error | 禁止error string决定业务状态 |
| capability target | summary ref或opaque backend profile | backend source identity + immutable requirement ref | 与B5 current identity一致 |
| freshness | provider timestamp或模糊stale | provider只给typed current/stale observation与validated window输入；application clock计算checked age | 禁止信任provider wall clock |
| body boundary | 仅文字禁止body | request/result字段闭集无body slot，error禁止raw cause | 结构上不可泄漏 |
| side effect | 未明确 | resolver零repository/UoW/id allocation/write | 与`7R-02`一致 |

## 6. 设计取舍

1. 采用四个窄trait，而不是一个generic resolver。重复少量错误variant的成本低于string dispatch和错误source混绑风险。
2. request与outcome均由application-owned类型表达，但outcome不是domain truth；这样infra可实现port，domain factory仍是唯一状态解释者。
3. stale/unavailable/invalid等进入正常outcome，不作为transport error；port error只表达调用未形成可信observation或违反契约。
4. 本地named ref、`Timestamp`、checked age和UoW全部留在application，resolver不能成为identity/clock/transaction owner。
5. policy与capability按L1展开exact relation；普通resolver telemetry、审计字段和provider重试策略保持L2/L3，不进入本批主体。

## 7. Resolver 共同执行契约

四类resolver均位于 `application::ports`。trait由application声明，durable/fake adapter由infra实现；domain、repository、
`api`、`worker`和`jobs`均不得直接依赖concrete resolver。resolver调用发生在write UoW之外，也不持有committed read
snapshot；application必须在调用前冻结exact request，在调用后重新校验owner relation，再进入domain factory和UoW。

```text
application committed read / checked caller input
  -> build exact resolver request
  -> call one application-owned resolver port outside UoW
  -> receive body-free finite observation
  -> validate source / owner / generation relation
  -> add application clock + generated local refs
  -> call Step 6 checked factory
  -> stage Sandbox truth through 7R-02 repository/UoW
```

| common dimension | exact rule |
|---|---|
| request identity | 只来自caller checked input、committed owner或bounded maintenance target；禁止latest/all/private map |
| local identity | resolver不生成context/resolution/identity/state/snapshot/capability ref |
| time | resolver不返回provider wall-clock作为Sandbox `Timestamp`；application clock提供accepted/evaluation time |
| persistence | resolver method不接受repository、`Version`、UoW、idempotency record或stored result |
| body boundary | request/outcome无body、path、URL、command、stdout/stderr、credential、SDK object或raw response字段 |
| finite outcome | stale/unavailable/invalid/conflict/missing/unsupported属于typed observation，不靠错误文本分类 |
| port error | 只表示未形成可信finite observation、binding错误或契约违反；错误只携带`SandboxReason` |
| retry | adapter内部不得改变target、source version或generation后重试；外层是否重新调用由Step 9/12 policy决定 |
| fake parity | fake使用同一request constructor、outcome constructor和error variant，不提供fake-only success/default |

普通latency metric、trace span和adapter内部attempt count属于L2 observability hook，只要求redaction和failure isolation；本批
不设计其schema、采样、存储或告警规则。

时间接缝的可落码规则固定为：resolver返回且application完成typed relation校验后，application调用一次
`SandboxClockPort::now()`取得本地可信的`accepted_at`，表示“本次外部观察被Sandbox接受的时刻”，而不是provider声称的
观察时刻。构造需要freshness判断的truth前，再且只再调用一次
`SandboxClockPort::checked_elapsed_since(&accepted_at)`；返回值必须回显同一baseline，
`SandboxCheckedElapsed.evaluated_at()`作为后续`assembled_at`或evaluation time，`elapsed_millis()`作为这一组freshness check
共享的checked age。不得在`checked_elapsed_since`之后另取`now()`并与该elapsed拼接。任何baseline回显不一致、时间逆序、
解析失败或溢出都转为typed clock error，resolver outcome不得被改写成`Unavailable`、`Unknown`或成功。多个policy binding在
同一次resolver调用中共享同一`accepted_at`及同一个checked-elapsed result；source-specific provider wall-clock不进入Sandbox
truth，也不得被命名为application `observed_at`。

### 7.1 Shared per-source observation carrier

Step 6已经禁止把 `ExternalSourceRefSet` 与 `SafeSummaryRefSet` 作为两个平行数组按索引拼接。为使首次intake和长期
reference refresh共享同一条可落码关系，本批新增application-owned逐source carrier；它复用Step 6 canonical
`ReferenceResolutionDisposition`，不新增第二套resolution status。

```rust
/// 一个declared external source的body-free resolver observation；不是Sandbox truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxBodyFreeSourceObservation {
    /// 与request target具有相同source identity的current observation。
    source: ExternalSourceRef,
    /// 当前source对应的optional safe summary；不得由source ref推导。
    safe_summary: Option<SafeSummaryRef>,
    /// 复用Step 6 canonical tracked-reference disposition。
    disposition: ReferenceResolutionDisposition,
    /// 非Resolved分支的caller-safe reason。
    reason: Option<SandboxReason>,
    /// 只允许Invalid分支非空的forbidden-body marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
}

impl SandboxBodyFreeSourceObservation {
    /// 校验summary source kind、disposition/reason/marker关系；不读取external body。
    pub fn try_new(
        source: ExternalSourceRef,
        safe_summary: Option<SafeSummaryRef>,
        disposition: ReferenceResolutionDisposition,
        reason: Option<SandboxReason>,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    ) -> Result<Self, SandboxBodyFreeSourceObservationError>;

    /// 返回本 observation 唯一对应的 external source。
    pub fn source(&self) -> &ExternalSourceRef;
    /// 返回 optional body-free safe summary；不得据此反推 source identity。
    pub fn safe_summary(&self) -> Option<&SafeSummaryRef>;
    /// 返回复用 Step 6 的 finite reference disposition。
    pub fn disposition(&self) -> ReferenceResolutionDisposition;
    /// 返回 non-resolved disposition 的 caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回本 source observation 检出的 forbidden-body markers。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
}

/// 与request declared-source顺序一一对应的完整observation set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxBodyFreeSourceObservationSet {
    items: Vec<SandboxBodyFreeSourceObservation>,
}

impl SandboxBodyFreeSourceObservationSet {
    /// 要求每个declared source恰有一个同identity item；不排序、不补项、不选择latest。
    pub fn try_complete(
        declared_sources: &ExternalSourceRefSet,
        items: Vec<SandboxBodyFreeSourceObservation>,
    ) -> Result<Self, SandboxBodyFreeSourceObservationError>;

    /// 按 declared-source 原顺序返回完整 observation 切片。
    pub fn as_slice(&self) -> &[SandboxBodyFreeSourceObservation];
    /// 从self-contained items构造domain reference snapshot所需source set。
    pub fn to_external_source_ref_set(
        &self,
    ) -> Result<ExternalSourceRefSet, SandboxBodyFreeSourceObservationError>;
    /// 从有summary的items构造domain reference snapshot所需summary set。
    pub fn to_safe_summary_ref_set(
        &self,
    ) -> Result<SafeSummaryRefSet, SandboxBodyFreeSourceObservationError>;
    /// 形成所有item marker的canonical union；不丢失任一marker kind。
    pub fn aggregate_forbidden_body_markers(
        &self,
    ) -> Result<ForbiddenExternalBodyMarkerSet, SandboxBodyFreeSourceObservationError>;
}

/// per-source observation或完整set违反application resolver contract。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxBodyFreeSourceObservationError {
    /// safe summary 的 source kind 与 exact external source kind 不一致。
    SummarySourceKindMismatch {
        /// external source 声明的 kind。
        expected: ExternalSourceKind,
        /// safe summary 实际携带的 kind。
        actual: ExternalSourceKind,
    },
    /// `Resolved` observation 缺少必需 safe summary。
    ResolvedSummaryMissing,
    /// `Resolved` observation 错误携带 failure reason。
    ResolvedHadReason,
    /// non-resolved observation 缺少 caller-safe reason。
    NonResolvedReasonMissing {
        /// 缺少 reason 的 finite disposition。
        disposition: ReferenceResolutionDisposition,
    },
    /// forbidden-body marker 与 finite disposition 的组合不合法。
    ForbiddenBodyDispositionMismatch,
    /// observation 数量与 declared source 数量不相等。
    DeclaredObservationCountMismatch,
    /// observation source identity 或顺序与 declared source 不一致。
    SourceIdentityOrOrderMismatch,
    /// 两个 observation 错误复用同一个 safe summary identity。
    DuplicateSummaryIdentity,
    /// 多个 source marker 无法形成 canonical marker union。
    AggregateMarkerInvalid,
}
```

| item disposition | summary | reason | marker |
|---|---|---|---|
| `Resolved` | `Some`且source kind相同 | `None` | empty |
| `Stale` | `Some`或`None`；存在时kind相同 | `Some` | empty |
| `Unresolved` | `Some`或`None`；存在时kind相同 | `Some` | empty |
| `Unavailable` | `Some`或`None`；存在时只能是last-known body-free summary | `Some` | empty |
| `Invalid` | `Some`或`None`；只保留通过carrier校验的summary | `Some` | empty或non-empty |

`try_complete`要求item数量与declared source数量相等，并逐位置调用`same_source()`；`Unavailable`或`Invalid`也必须为对应
declared source保留一个无summary或仅含已校验summary的item，禁止删项表达失败。item自包含source/summary关系，因此这不是
两个parallel array的zip。source version/digest可以更新，但source kind/resource ref不能变化。需要改变source identity时必须
由新的caller input或正式tracked-reference owner更新目标，resolver不得自行换target。

## 8. Identity context source resolver

### 8.1 Capability、调用方与非职责

本resolver解析首次intake形成execution identity所需的外部body-free context，但不创建
`ExecutionEnvironmentIdentity`。唯一调用方是 `open_controlled_execution_context` 的intake application flow；accepted
context、responsibility anchor和environment identity仍由Step 6 factory及同一UoW形成。

| capability | exact input | finite output | forbidden responsibility |
|---|---|---|---|
| resolve declared context sources | request声明的source refs、active intake guard给出的required kinds、trace | six-way body-free observation | 注入caller未声明source、读取外部正文、决定acceptance、绑定environment identity |

### 8.2 Request、disposition与observation

```rust
/// 首次intake解析execution identity前置source的exact application request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResolveSandboxIdentityContextRequest {
    /// caller显式声明的body-free external source refs。
    declared_sources: ExternalSourceRefSet,
    /// application从exact active intake guard取得的required source kinds。
    required_source_kinds: RequiredContextSourceKindSet,
    /// 当前application调用的typed trace context。
    trace_context: SandboxTraceContext,
}

impl ResolveSandboxIdentityContextRequest {
    /// 构造一次不可变resolver request；不补Identity source或optional summary。
    pub fn try_new(
        declared_sources: ExternalSourceRefSet,
        required_source_kinds: RequiredContextSourceKindSet,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, SandboxIdentityContextResolverError>;

    /// 返回 caller 显式声明且顺序冻结的 external sources。
    pub fn declared_sources(&self) -> &ExternalSourceRefSet;
    /// 返回 active intake guard 要求的 source kinds。
    pub fn required_source_kinds(&self) -> &RequiredContextSourceKindSet;
    /// 返回本次 resolver 调用的 typed trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}

/// identity context resolver能返回的六类有限观察。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxIdentityContextResolverDisposition {
    /// 所有required source均有current body-free summary，可进入resolved判断。
    Resolved,
    /// required source完整，但request声明的optional source仍待补齐。
    Partial,
    /// 一个或多个required source version或summary已过期。
    Stale,
    /// 一个或多个required source当前不可访问或不可解析。
    Unavailable,
    /// source格式、owner、scope或forbidden-body边界非法。
    Invalid,
    /// 两个已校验source或summary对同一context给出不可调和结论。
    Conflicted,
}

/// resolver对一次exact intake request返回的checked body-free observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxIdentityContextResolverObservation {
    /// 与request declared source一一对应的self-contained observations。
    source_observations: SandboxBodyFreeSourceObservationSet,
    /// `Stale | Unavailable | Invalid`影响的required kinds；其它分支为空。
    unresolved_required_items: UnresolvedContextItemSet,
    /// `Partial`仍待补齐的non-required kinds；其它分支为空。
    deferred_optional_items: DeferredContextItemSet,
    /// `Conflicted`分支的non-empty checked source-pair conflicts。
    conflicts: ContextResolutionConflictSet,
    /// 本次有限resolver disposition。
    disposition: SandboxIdentityContextResolverDisposition,
    /// 非`Resolved`分支的caller-safe reason。
    reason: Option<SandboxReason>,
}

impl SandboxIdentityContextResolverObservation {
    /// 以request为authority校验source identity、required/deferred/conflict/marker矩阵。
    pub fn try_new(
        request: &ResolveSandboxIdentityContextRequest,
        source_observations: SandboxBodyFreeSourceObservationSet,
        unresolved_required_items: UnresolvedContextItemSet,
        deferred_optional_items: DeferredContextItemSet,
        conflicts: ContextResolutionConflictSet,
        disposition: SandboxIdentityContextResolverDisposition,
        reason: Option<SandboxReason>,
    ) -> Result<Self, SandboxIdentityContextResolverError>;

    /// 返回与 declared sources 一一对应的完整 observation set。
    pub fn source_observations(&self) -> &SandboxBodyFreeSourceObservationSet;
    /// 返回 stale、unavailable 或 invalid 的 required context items。
    pub fn unresolved_required_items(&self) -> &UnresolvedContextItemSet;
    /// 返回 `Partial` 分支尚未形成 summary 的 optional context items。
    pub fn deferred_optional_items(&self) -> &DeferredContextItemSet;
    /// 返回 `Conflicted` 分支的 checked conflict pairs。
    pub fn conflicts(&self) -> &ContextResolutionConflictSet;
    /// 返回本次 intake source resolution 的 finite disposition。
    pub fn disposition(&self) -> SandboxIdentityContextResolverDisposition;
    /// 返回 non-resolved disposition 的 caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
}
```

### 8.3 Observation invariant matrix

| disposition | observed source relation | required/deferred/conflict | marker / reason | domain mapping |
|---|---|---|---|---|
| `Resolved` | 与declared set按`same_source`双向相等；version/digest可更新 | required逐kind有source+summary；其余set空 | marker空；reason `None` | reference `complete` + execution `resolved` |
| `Partial` | 与declared set双向相等；required item均`Resolved`，deferred optional item为`Unresolved`或`Unavailable` | required完整；deferred non-empty且均non-required；其它set空 | marker空；reason `Some` | reference `complete` + execution `partial` |
| `Stale` | 与declared set双向相等 | unresolved non-empty且仅含required；其它set空 | marker空；reason `Some` | reference `stale` + execution `unresolved` |
| `Unavailable` | 与declared set双向相等；不可访问项以`Unavailable` item原位保留 | unresolved non-empty且仅含required；其它set空 | marker空；reason `Some` | reference `unavailable` + execution `unresolved` |
| `Invalid` | 与declared set双向相等；非法项以`Invalid` item原位保留，不合法summary为`None` | unresolved non-empty或marker non-empty；其它set空 | reason `Some` | reference `invalid` + execution `unresolved`，guard决定reject |
| `Conflicted` | 与declared set双向相等；conflict两端必须存在于observed set | conflicts non-empty；unresolved/deferred空 | marker空；reason `Some` | reference `complete` + execution `conflicted` |

`try_new`按以下顺序校验：完整source identity/order -> required/deferred kind membership -> per-item disposition与summary coverage ->
conflict endpoint membership -> marker/disposition -> reason/disposition。任何失败均返回contract error，不允许adapter删项后改成
`Unavailable`。source version/digest可以随同一source identity更新，但resource ref变化是新source，只能由新的caller request引入。

### 8.4 Port error与trait

```rust
/// identity context resolver未形成可信finite observation时的closed error。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxIdentityContextResolverError {
    /// request的declared/required关系违反application contract。
    RequestRelationInvalid { reason: SandboxReason },
    /// adapter输出违反source、summary、set或marker矩阵。
    ObservationRelationInvalid { reason: SandboxReason },
    /// 当前调用在形成可安全分类的observation前中止；不得创建空resolution truth。
    CallAborted { reason: SandboxReason },
    /// runtime binding与本trait声明的source family不匹配。
    AdapterBindingInvalid { reason: SandboxReason },
}

/// 解析首次intake的identity context source；不创建Sandbox identity truth。
pub trait SandboxIdentityContextResolverPort: Send + Sync {
    /// 解析request声明的首次intake sources，并返回完整、body-free且可有限分类的observation。
    async fn resolve_identity_context_sources(
        &self,
        request: &ResolveSandboxIdentityContextRequest,
    ) -> Result<
        SandboxIdentityContextResolverObservation,
        SandboxIdentityContextResolverError,
    >;
}
```

`CallAborted`与finite `Unavailable`严格不同：前者表示adapter无法证明任何可信source-level observation，application必须保持
当前idempotency reservation并按application error收束，不创建空`ContextReferenceResolution`；后者已明确指出受影响的
required kinds，可由domain形成诚实的unavailable/unresolved snapshot。error不得保存raw provider cause、endpoint或credential。

### 8.5 Application construction order

```text
pre-generate context/reference-resolution/execution-resolution refs
  -> ControlledExecutionContext::open_pending(...)
  -> build ResolveSandboxIdentityContextRequest from caller sources + loaded guard
  -> resolve_identity_context_sources(request) outside UoW
  -> obtain trusted application Timestamp
  -> map observation to ContextReferenceResolution factory
  -> map same observation to ExecutionContextResolution factory
  -> evaluate intake/external-body guards
  -> accepted only: pre-generate identity ref + responsibility anchor + ExecutionEnvironmentIdentity::bind
  -> stage the complete branch in one write UoW
```

resolver method不接收或返回environment identity ref。若outcome为`Resolved`但guard、responsibility或factory relation失败，
application不得把resolver positive outcome当acceptance truth；整个branch按typed application/domain error收束。

## 9. Tracked reference refresh resolver

### 9.1 Capability、调用方与existing-only边界

该resolver只刷新已经由正式 intake 建立的一个 `ReferenceResolutionState`。它不负责首次 state 创建，也不决定首次
context acceptance。调用方是 reference refresh Job、caller-context reference consumer、policy-summary consumer 和
backend-capability consumer 的 application facade；这些入口必须先按 `7R-02` 的 exact repository 方法读取 existing state
和 core `Version`。

| boundary | exact rule |
|---|---|
| target | `ReferenceRefreshTarget { reference_state_ref, expected_source }`；source identity由selection直接携带 |
| pre-read | `get_reference_state_with_version` 后校验 state ref、context lineage和expected source 全字段相等 |
| resolver input | 只传 exact state ref、expected source和trace；不传repository row、Version或Sandbox state body |
| missing state | `NotFound` 是 selection/index integrity error；不得转initial create或从source补造state |
| write owner | application将finite observation转成Step 6 `ReferenceResolutionObservation`，调用state transition并以expected Version CAS保存 |
| query boundary | Query不调用该resolver，不生成marker、state ref或write UoW |

### 9.2 Request、observation与trait

```rust
/// 刷新一个已有reference state的exact body-free request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefreshSandboxTrackedReferenceRequest {
    /// existing Sandbox reference state的typed identity。
    reference_state_ref: ReferenceResolutionStateRef,
    /// selection snapshot直接携带的expected external source identity / version observation。
    expected_source: ExternalSourceRef,
    /// 当前application调用的typed trace context。
    trace_context: SandboxTraceContext,
}

impl RefreshSandboxTrackedReferenceRequest {
    /// 构造refresh request；不从state ref解析source，不接受summary或current status。
    pub fn try_new(
        reference_state_ref: ReferenceResolutionStateRef,
        expected_source: ExternalSourceRef,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, SandboxTrackedReferenceResolverError>;

    /// 返回必须已经存在的 exact reference state identity。
    pub fn reference_state_ref(&self) -> &ReferenceResolutionStateRef;
    /// 返回 selection 冻结的 expected external source identity / observation。
    pub fn expected_source(&self) -> &ExternalSourceRef;
    /// 返回本次 refresh 的 typed trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}

/// tracked reference resolver针对一个existing state返回的self-contained observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxTrackedReferenceResolverObservation {
    /// adapter实际响应的state target，必须与request相等。
    reference_state_ref: ReferenceResolutionStateRef,
    /// 逐source carrier；其source identity必须与request.expected_source相等。
    source_observation: SandboxBodyFreeSourceObservation,
}

impl SandboxTrackedReferenceResolverObservation {
    /// 校验state target、source identity和single-source disposition关系。
    pub fn try_new(
        request: &RefreshSandboxTrackedReferenceRequest,
        reference_state_ref: ReferenceResolutionStateRef,
        source_observation: SandboxBodyFreeSourceObservation,
    ) -> Result<Self, SandboxTrackedReferenceResolverError>;

    /// 返回 adapter 回显且已验证匹配 request 的 state ref。
    pub fn reference_state_ref(&self) -> &ReferenceResolutionStateRef;
    /// 返回同一 expected source 的 self-contained finite observation。
    pub fn source_observation(&self) -> &SandboxBodyFreeSourceObservation;
}

/// tracked reference resolver的closed technical / contract error。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxTrackedReferenceResolverError {
    /// request target、source或trace不符合selection/application关系。
    RequestRelationInvalid { reason: SandboxReason },
    /// adapter返回了错误state ref、source或carrier组合。
    ObservationRelationInvalid { reason: SandboxReason },
    /// 未形成可信source-level finite observation。
    CallAborted { reason: SandboxReason },
    /// adapter绑定到非selection声明的source family或runtime generation。
    AdapterBindingInvalid { reason: SandboxReason },
}

/// 刷新一个已有Sandbox reference state；不拥有state create或transition truth。
pub trait SandboxTrackedReferenceResolverPort: Send + Sync {
    /// 刷新一个已存在state的exact source observation；不创建state或写repository。
    async fn refresh_tracked_reference(
        &self,
        request: &RefreshSandboxTrackedReferenceRequest,
    ) -> Result<
        SandboxTrackedReferenceResolverObservation,
        SandboxTrackedReferenceResolverError,
    >;
}
```

### 9.3 Disposition与domain mapping

application在收到 `SandboxTrackedReferenceResolverObservation` 后，用同一 source 与 optional summary 构造
`TrackedExternalRefBinding`；观察时间来自 trusted `SandboxClockPort`，不来自adapter字符串或未校验provider clock。随后按
下表调用 Step 6 domain factory，不能由reason反解析status。

| source disposition | binding factory | observation factory | existing state transition | safe consequence |
|---|---|---|---|---|
| `Resolved` | `TrackedExternalRefBinding::resolved` | `ReferenceResolutionObservation::resolved` | `apply_resolution` -> `Resolved` | 允许后续read derivation；不重开intake |
| `Stale` | `resolved`或`without_summary`，按实际summary | `ReferenceResolutionObservation::stale` | `apply_resolution` -> `Stale` | 触发后续refresh；不得继续以旧summary放行高风险判断 |
| `Unresolved` | `without_summary`或已校验last-known binding | `ReferenceResolutionObservation::unresolved` | `apply_resolution` -> `Unresolved` | 相关read / re-evaluation显式blocked |
| `Unavailable` | `without_summary`或已校验last-known binding | `ReferenceResolutionObservation::unavailable` | `apply_resolution` -> `Unavailable` | 保守保持不可用；不得伪造Resolved |
| `Invalid` | 仅使用carrier已校验部分 | `ReferenceResolutionObservation::invalid` | `apply_resolution` -> `Invalid` | forbidden marker / owner conflict进入strict guard；不降级为warning |

`ReferenceResolutionObservation.reference_state_ref` 必须等于request target；`binding.external_source().same_source(expected_source)`
必须为true。source version或digest变化可以形成新 observation，但不能改变 `reference_state_ref` 或将一个 state 换绑到
另一个 resource ref。`apply_resolution` 成功后才允许在同一 write UoW 中 `save_reference_state(state, expected_version)`；
resolver调用本身没有写入成功语义。

### 9.4 Refresh flow与故障矩阵

```text
read selection target(state_ref, expected_source)
  -> get_reference_state_with_version(state_ref)
  -> verify context / owner / expected_source exact relation
  -> build RefreshSandboxTrackedReferenceRequest
  -> refresh_tracked_reference(request) outside UoW
  -> trusted clock: one accepted_at for observation / transition time
  -> build TrackedExternalRefBinding + ReferenceResolutionObservation
  -> state.apply_resolution(observation, audit_ref, changed_at)
  -> save_reference_state(state, expected_version) in one write UoW
  -> commit; assign reference cursor only after stage succeeds
```

| condition | required handling | forbidden handling |
|---|---|---|
| state missing | typed selection integrity failure; no state create | `track_non_resolved`、source-ref派生state ref、latest scan |
| expected source mismatch | stop before external call；记录selection integrity failure | 用当前state source替换expected source后继续 |
| finite `Unavailable` | apply `Unavailable`并CAS保存，除非application policy明确只读延迟 | 把port error或empty summary当Unavailable/Resolved混用 |
| adapter call aborted | 不改变state truth；按外层错误和idempotency收束 | 写空binding、写placeholder或清除旧summary |
| CAS conflict | 旧observation失效；重新读取完整state后由外层显式重试 | 只重试save、覆盖新Version、丢弃marker |
| commit unknown | inspect exact state/idempotency relation；unknown不等于未写 | 再次调用resolver并生成第二state/observation |
| forbidden body marker | `Invalid`/strict hold；保留marker relation | debug/fake/config profile忽略marker |

该refresh flow不调用backend lifecycle、policy decision、capture、handoff或member/runtime orchestration。它只更新长期
reference freshness state；由后续Step 9/10决定哪些主流程必须因该状态阻断。

## 10. Policy applicability resolver

### 10.1 Capability、target 与非职责

本resolver只观察一次exact owner group所需的policy / authorization body-free summaries。它不创建
`PolicyApplicabilitySnapshot`、`HighRiskActionDecision`或`PolicyExecutionDecision`，也不决定launch。application必须先加载并
校验accepted context、active identity、immutable requirement、established boundary、matching capability、handle与generation，
然后只把typed refs和strict source roles传入port。

```rust
/// policy resolver唯一允许评估的 committed Sandbox owner lineage。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPolicyApplicabilityResolverTarget {
    /// accepted controlled execution context identity。
    context_ref: ControlledExecutionContextRef,
    /// 与 context 同 lineage 的 active environment identity。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// immutable boundary requirement identity。
    requirement_ref: BoundaryRequirementSetRef,
    /// established coherent boundary identity。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 immutable capability snapshot identity。
    capability_ref: BackendCapabilitySummaryRef,
    /// established boundary 原子关联的 isolation handle identity。
    handle_ref: IsolationEnvironmentHandleRef,
    /// requirement、boundary、capability 与 handle 共用的 generation。
    generation_ref: ResourceRef,
}

impl SandboxPolicyApplicabilityResolverTarget {
    /// 从application已校验的committed owner group冻结一个body-free resolver target。
    pub fn try_from_committed_group(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        requirement_ref: BoundaryRequirementSetRef,
        boundary_ref: CoherentBoundaryRef,
        capability_ref: BackendCapabilitySummaryRef,
        handle_ref: IsolationEnvironmentHandleRef,
        generation_ref: ResourceRef,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 返回 owning accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 matching active environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回本次评估的 immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回本次评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 established boundary 使用的 capability ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回 established boundary 原子关联的 handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 owner group 共用的 generation ref。
    pub fn generation_ref(&self) -> &ResourceRef;
}

/// 一次policy applicability外部观察的exact application request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResolveSandboxPolicyApplicabilityRequest {
    /// application从committed owner group冻结的exact target。
    target: SandboxPolicyApplicabilityResolverTarget,
    /// 本次evaluation的strict policy source roles。
    required_sources: PolicySourceRequirementSet,
    /// 当前application调用的typed trace context。
    trace_context: SandboxTraceContext,
}

impl ResolveSandboxPolicyApplicabilityRequest {
    /// 构造policy request；required roles必须保留Step 6 strict baseline。
    pub fn try_new(
        target: SandboxPolicyApplicabilityResolverTarget,
        required_sources: PolicySourceRequirementSet,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 返回本次resolver调用的exact owner target。
    pub fn target(&self) -> &SandboxPolicyApplicabilityResolverTarget;
    /// 返回本次evaluation不可删除的required source roles。
    pub fn required_sources(&self) -> &PolicySourceRequirementSet;
    /// 返回本次resolver调用的typed trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}
```

request没有policy body、approval body、actor credential、tool schema/body、runtime loop、command、path、URL或secret字段。
role到provider的路由只能来自validated runtime assembly中的固定adapter binding；adapter不得按latest、环境扫描或raw route选择
policy owner。

### 10.2 逐 role source observation

每个required role必须由“一项或多项binding observation”或“恰好一个role-level gap”二选一覆盖。同一role可由多个
versioned source共同支撑，但不得同时出现binding与gap。`StaleBinding`仍必须保留同源summary与正freshness window，以满足
Step 6 stale snapshot的exact coverage；gap直接复用Step 6 `PolicySourceGapDisposition`，不要求伪造不可访问source ref。

```rust
/// 一个required policy role的body-free binding或role-level gap observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxPolicySourceResolverObservation {
    /// 一个current、versioned且具有正freshness window的policy source binding。
    ResolvedBinding {
        /// 本binding承接的exact required role。
        role: PolicySourceRole,
        /// disposition必须为`Resolved`且summary必有的body-free source observation。
        source_observation: SandboxBodyFreeSourceObservation,
        /// validated正freshness window。
        freshness_window_millis: NonZeroU64,
    },
    /// 一个versioned但provider已明确判为stale的policy source binding。
    StaleBinding {
        /// 本binding承接的exact required role。
        role: PolicySourceRole,
        /// disposition必须为`Stale`且summary必有的body-free source observation。
        source_observation: SandboxBodyFreeSourceObservation,
        /// 原binding的validated正freshness window。
        freshness_window_millis: NonZeroU64,
    },
    /// 一个required role整体无法形成可信binding的finite gap。
    Gap {
        /// 当前缺失binding的exact required role。
        role: PolicySourceRole,
        /// 可信等待或evaluation时不可用的Step 6 canonical gap disposition。
        disposition: PolicySourceGapDisposition,
        /// 不回显provider error/body的caller-safe reason。
        reason: SandboxReason,
    },
}

impl SandboxPolicySourceResolverObservation {
    /// 构造current policy binding；source必须versioned且disposition为`Resolved`。
    pub fn resolved_binding(
        role: PolicySourceRole,
        source_observation: SandboxBodyFreeSourceObservation,
        freshness_window_millis: NonZeroU64,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;
    /// 构造stale policy binding；source必须versioned、含summary且disposition为`Stale`。
    pub fn stale_binding(
        role: PolicySourceRole,
        source_observation: SandboxBodyFreeSourceObservation,
        freshness_window_millis: NonZeroU64,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;
    /// 构造role-level gap；不创建placeholder source或summary。
    pub fn gap(
        role: PolicySourceRole,
        disposition: PolicySourceGapDisposition,
        reason: SandboxReason,
    ) -> Self;

    /// 返回本item唯一承接的policy role。
    pub fn role(&self) -> PolicySourceRole;
    /// 返回binding的body-free source observation；gap返回`None`。
    pub fn source_observation(&self) -> Option<&SandboxBodyFreeSourceObservation>;
    /// 返回binding使用的validated freshness window；gap返回`None`。
    pub fn freshness_window_millis(&self) -> Option<NonZeroU64>;
    /// 返回gap disposition；binding返回`None`。
    pub fn gap_disposition(&self) -> Option<PolicySourceGapDisposition>;
    /// 返回gap的caller-safe reason；binding返回其source observation reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
}

/// 与strict requirement roles一一对应的policy source observation set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPolicySourceResolverObservationSet {
    /// 按`PolicySourceRequirementSet` canonical顺序保存的complete items。
    items: Vec<SandboxPolicySourceResolverObservation>,
}

impl SandboxPolicySourceResolverObservationSet {
    /// 要求每个required role均由one-or-more bindings或one gap完整覆盖。
    pub fn try_complete(
        requirements: &PolicySourceRequirementSet,
        items: Vec<SandboxPolicySourceResolverObservation>,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 按required role canonical顺序返回完整items。
    pub fn as_slice(&self) -> &[SandboxPolicySourceResolverObservation];
    /// 使用application clock time从全部binding variants构造Step 6已有的source binding set。
    pub fn to_policy_source_bindings(
        &self,
        accepted_at: Timestamp,
    ) -> Result<PolicySourceBindingSet, PolicySupportError>;
    /// 将role-level gap variants映射为Step 6已有的required-role gap set。
    pub fn to_policy_source_gaps(
        &self,
    ) -> Result<Option<PolicySourceGapSet>, PolicySupportError>;
    /// 为无gap且全部`ResolvedBinding`的set构造逐binding freshness checks。
    pub fn to_policy_freshness_checks(
        &self,
        checked_age_millis: u64,
    ) -> Result<PolicySourceFreshnessCheckSet, PolicySupportError>;
}
```

| resolver variant | summary/window | Step 6 mapping | safe consequence |
|---|---|---|---|
| `ResolvedBinding` | source disposition `Resolved`；summary必有；window正值 | `PolicySourceBinding` + freshness check | 可参与`applicable` factory |
| `StaleBinding` | source disposition `Stale`；summary必有；window正值 | `PolicySourceBinding`，不生成gap | 只能参与`stale` factory |
| `Gap(AwaitingTrustedSummary)` | 无source/summary/window | `PolicySourceGap` | 只有全部gap均可信等待时才可能形成Pending |
| `Gap(UnavailableAtEvaluation)` | 无source/summary/window | `PolicySourceGap` | fail closed；不得复用旧Accepted snapshot |

`try_complete`拒绝required role缺失、额外role、同一role的binding+gap混合、同一role多个gap及重复`(role, source identity)`。
每个role的item必须先按`PolicySourceRequirementSet::as_slice()`的canonical role顺序分区；同一role的多个 binding
再按`(source_ref.source_kind(), source_ref.resource_ref())`的typed `Ord`升序排列。该排序只使用typed fields，不解析
`ResourceRef`字符串；`source_version_ref`和digest不参与排序或identity。构造前还必须验证每个
`source_ref.source_kind() == Policy`、`source_ref.source_version_ref().is_some()`、summary kind为`Policy`，并以
`source_observation.source().same_source(...)`校验 source/summary pair。一个role可有多个binding，且全部进入canonical
`PolicySourceBindingSet`；`to_policy_source_bindings`不为gap创建placeholder。`to_policy_freshness_checks`要求无gap且全部为
`ResolvedBinding`，并逐个生成与`(role, source identity)`相同的check；resolver不返回provider wall-clock。application把
共同执行契约中的本地`accepted_at`写入Step 6 canonical `PolicySourceBinding.observed_at`字段，再以同一baseline的
checked-elapsed result形成`assembled_at`与checked age；字段名兼容不改变时间来源语义。

### 10.3 Authorization 与 high-risk marker observation

```rust
/// `Pending` observation唯一允许引用的non-empty required-role集合；只用于resolver relation校验。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPendingPolicySourceRoleSet {
    /// 按request requirement canonical顺序保存的pending required roles。
    items: Vec<PolicySourceRole>,
}

impl SandboxPendingPolicySourceRoleSet {
    /// 构造non-empty、无重复且全部属于本次strict requirement的pending role set。
    pub fn try_non_empty(
        requirements: &PolicySourceRequirementSet,
        roles: Vec<PolicySourceRole>,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 按request requirement canonical顺序返回pending required roles。
    pub fn as_slice(&self) -> &[PolicySourceRole];
}

/// policy adapter对exact target给出的body-free authorization observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPolicyAuthorizationResolverObservation {
    /// 支撑finite authorization disposition的policy safe summaries。
    summary_refs: SafeSummaryRefSet,
    /// adapter显式给出的Step 6 canonical authorization disposition。
    disposition: PolicyAuthorizationDisposition,
    /// non-Allowed disposition必有的caller-safe reason。
    reason: Option<SandboxReason>,
    /// 仅`Pending`分支存在，且每项必须命中本次source partition中的exact required-role gap。
    pending_source_roles: Option<SandboxPendingPolicySourceRoleSet>,
}

impl SandboxPolicyAuthorizationResolverObservation {
    /// 校验summary source、disposition与reason关系；不接收authorization body。
    pub fn try_new(
        summary_refs: SafeSummaryRefSet,
        disposition: PolicyAuthorizationDisposition,
        reason: Option<SandboxReason>,
        pending_source_roles: Option<SandboxPendingPolicySourceRoleSet>,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 返回支撑authorization observation的safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;
    /// 返回canonical authorization disposition。
    pub fn disposition(&self) -> PolicyAuthorizationDisposition;
    /// 返回non-Allowed disposition的caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回`Pending` authorization等待的exact required roles；其它分支返回`None`。
    pub fn pending_source_roles(&self) -> Option<&SandboxPendingPolicySourceRoleSet>;
}

/// policy resolver检出的一个body-free requested high-risk marker observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPolicyHighRiskMarkerResolverObservation {
    /// provider给出的稳定marker identity。
    marker_key: HighRiskActionMarkerKey,
    /// Sandbox canonical high-risk action category。
    action_kind: HighRiskActionKind,
    /// 该动作影响的non-empty canonical boundary kinds。
    affected_boundary_kinds: HighRiskBoundaryKindSet,
    /// 动作与当前established boundary的finite关系。
    boundary_relation: HighRiskBoundaryRelation,
    /// 产生marker的exact policy source ref。
    source_ref: ExternalSourceRef,
    /// 与source同源的body-free safe summary ref。
    summary_ref: SafeSummaryRef,
    /// provider对该marker给出的authorization disposition。
    authorization_disposition: PolicyAuthorizationDisposition,
    /// non-Allowed disposition必有的caller-safe reason。
    reason: Option<SandboxReason>,
    /// 仅`Pending`分支存在，且每项必须命中本次source partition中的exact required-role gap。
    pending_source_roles: Option<SandboxPendingPolicySourceRoleSet>,
}

impl SandboxPolicyHighRiskMarkerResolverObservation {
    /// 校验source/summary、marker、boundary relation与authorization关系。
    pub fn try_new(
        marker_key: HighRiskActionMarkerKey,
        action_kind: HighRiskActionKind,
        affected_boundary_kinds: HighRiskBoundaryKindSet,
        boundary_relation: HighRiskBoundaryRelation,
        source_ref: ExternalSourceRef,
        summary_ref: SafeSummaryRef,
        authorization_disposition: PolicyAuthorizationDisposition,
        reason: Option<SandboxReason>,
        pending_source_roles: Option<SandboxPendingPolicySourceRoleSet>,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 返回provider稳定marker identity。
    pub fn marker_key(&self) -> &HighRiskActionMarkerKey;
    /// 返回canonical high-risk action kind。
    pub fn action_kind(&self) -> HighRiskActionKind;
    /// 返回受影响boundary kind set。
    pub fn affected_boundary_kinds(&self) -> &HighRiskBoundaryKindSet;
    /// 返回动作与established boundary的finite关系。
    pub fn boundary_relation(&self) -> HighRiskBoundaryRelation;
    /// 返回产生marker的policy source ref。
    pub fn source_ref(&self) -> &ExternalSourceRef;
    /// 返回marker body-free summary ref。
    pub fn summary_ref(&self) -> &SafeSummaryRef;
    /// 返回marker的authorization disposition。
    pub fn authorization_disposition(&self) -> PolicyAuthorizationDisposition;
    /// 返回non-Allowed marker reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回`Pending` marker等待的exact required roles；其它分支返回`None`。
    pub fn pending_source_roles(&self) -> Option<&SandboxPendingPolicySourceRoleSet>;
}

/// marker key唯一且source binding可证明的requested marker observation set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPolicyHighRiskMarkerResolverObservationSet {
    /// 按marker key canonical排序的observations。
    items: Vec<SandboxPolicyHighRiskMarkerResolverObservation>,
}

impl SandboxPolicyHighRiskMarkerResolverObservationSet {
    /// 校验marker唯一性及每个source/summary pair均存在于policy source observations。
    pub fn try_new(
        source_observations: &SandboxPolicySourceResolverObservationSet,
        items: Vec<SandboxPolicyHighRiskMarkerResolverObservation>,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 返回canonical marker observation切片。
    pub fn as_slice(&self) -> &[SandboxPolicyHighRiskMarkerResolverObservation];
}
```

本port只承接launch前 `Requested` marker；`ObservedAttempt`必须由后续lifecycle/control observation接缝携带exact run ref后再
进入独立policy reevaluation，不得用optional run ref混入本request。application使用request target和上述observation调用
`PolicyAuthorizationSummary::try_new`及`HighRiskActionMarker::try_from_policy_summary`；marker factory固定传
`HighRiskActionObservationKind::Requested`与`observed_run_ref = None`。

### 10.4 Aggregate observation、error 与 port

```rust
/// policy resolver observation能证明的六类finite disposition；不是domain snapshot status。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxPolicyApplicabilityResolverDisposition {
    /// source完整且current，authorization与marker信息足以进入正式guard裁定。
    Decidable,
    /// 至少一个required role只有typed gap，且没有更高优先级冲突。
    Missing,
    /// authorization或marker summaries存在不可调和冲突。
    Conflicted,
    /// authorization或marker明确表示当前判断不受支持。
    Unsupported,
    /// required roles完整，但至少一个versioned binding已明确stale。
    Stale,
    /// external-body redline被触发；不得创建policy snapshot。
    Invalid,
}

/// policy resolver对一次exact owner target返回的self-contained body-free observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxPolicyApplicabilityResolverObservation {
    /// adapter回显且必须与request完全相等的owner target。
    target: SandboxPolicyApplicabilityResolverTarget,
    /// required roles的binding/gap完整分区。
    source_observations: SandboxPolicySourceResolverObservationSet,
    /// exact target的finite authorization observation。
    authorization: SandboxPolicyAuthorizationResolverObservation,
    /// launch前requested high-risk marker observations。
    high_risk_markers: SandboxPolicyHighRiskMarkerResolverObservationSet,
    /// 本次resolver observation的finite disposition。
    disposition: SandboxPolicyApplicabilityResolverDisposition,
    /// non-Decidable disposition必有的caller-safe reason。
    reason: Option<SandboxReason>,
    /// 只允许`Invalid`分支非空的external-body redline markers。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
}

impl SandboxPolicyApplicabilityResolverObservation {
    /// 以request为authority校验target、source partition、authorization、marker与disposition矩阵。
    pub fn try_new(
        request: &ResolveSandboxPolicyApplicabilityRequest,
        target: SandboxPolicyApplicabilityResolverTarget,
        source_observations: SandboxPolicySourceResolverObservationSet,
        authorization: SandboxPolicyAuthorizationResolverObservation,
        high_risk_markers: SandboxPolicyHighRiskMarkerResolverObservationSet,
        disposition: SandboxPolicyApplicabilityResolverDisposition,
        reason: Option<SandboxReason>,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    ) -> Result<Self, SandboxPolicyApplicabilityResolverError>;

    /// 返回与request完全相等的owner target。
    pub fn target(&self) -> &SandboxPolicyApplicabilityResolverTarget;
    /// 返回required policy roles的完整source observation partition。
    pub fn source_observations(&self) -> &SandboxPolicySourceResolverObservationSet;
    /// 返回finite authorization observation。
    pub fn authorization(&self) -> &SandboxPolicyAuthorizationResolverObservation;
    /// 返回launch前requested high-risk marker observations。
    pub fn high_risk_markers(&self) -> &SandboxPolicyHighRiskMarkerResolverObservationSet;
    /// 返回finite resolver disposition。
    pub fn disposition(&self) -> SandboxPolicyApplicabilityResolverDisposition;
    /// 返回non-Decidable disposition的caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回必须进入strict safety route的forbidden-body markers。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
}

/// policy resolver未形成可信observation或违反application contract的closed error。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxPolicyApplicabilityResolverError {
    /// request target、strict roles或trace关系不合法。
    RequestRelationInvalid {
        /// 不含provider body或credential的caller-safe原因。
        reason: SandboxReason,
    },
    /// adapter回显的owner target与request不相等。
    TargetRelationMismatch,
    /// source role coverage、binding/gap partition或freshness relation不合法。
    SourceObservationRelationInvalid {
        /// 不含raw policy response的安全原因。
        reason: SandboxReason,
    },
    /// authorization summaries、disposition或reason关系不合法。
    AuthorizationObservationRelationInvalid {
        /// 不含authorization body的安全原因。
        reason: SandboxReason,
    },
    /// marker identity、source、boundary coverage或authorization关系不合法。
    HighRiskMarkerObservationRelationInvalid {
        /// 不含tool、runtime或command body的安全原因。
        reason: SandboxReason,
    },
    /// aggregate disposition、reason、gap、stale或redline组合不合法。
    AggregateObservationRelationInvalid {
        /// 无法由typed fields证明的resolver disposition。
        disposition: SandboxPolicyApplicabilityResolverDisposition,
    },
    /// provider调用在形成任何可信finite observation前中止。
    CallAborted {
        /// 仅含caller-safe unavailable/transport类别，不含raw cause。
        reason: SandboxReason,
    },
    /// runtime assembly把本trait绑定到错误provider family或generation。
    AdapterBindingInvalid {
        /// 不暴露endpoint、credential或SDK object的安全原因。
        reason: SandboxReason,
    },
}

/// 解析exact Sandbox owner group所需的policy/authorization body-free observations。
pub trait SandboxPolicyApplicabilityResolverPort: Send + Sync {
    /// 返回finite observation；不创建policy snapshot、decision、audit或stored result。
    async fn resolve_policy_applicability(
        &self,
        request: &ResolveSandboxPolicyApplicabilityRequest,
    ) -> Result<
        SandboxPolicyApplicabilityResolverObservation,
        SandboxPolicyApplicabilityResolverError,
    >;
}
```

`SandboxPolicyAuthorizationResolverObservation::try_new`必须执行以下闭集校验：`Allowed`要求`summary_refs`非空、
`reason=None`且`pending_source_roles=None`；`Denied | Unsupported | Conflicted`要求`summary_refs`非空、
`reason=Some`且`pending_source_roles=None`；`Pending`允许summary set为空或部分存在，但必须有`reason=Some`和
`pending_source_roles=Some(non-empty)`。所有summary ref的source kind必须为`Policy`。这些检查只验证body-free ref关系，
不得从summary ref或reason推导disposition。

`SandboxPolicyHighRiskMarkerResolverObservation::try_new`使用相同的authorization/reason规则；marker若为`Pending`必须有
`pending_source_roles=Some(non-empty)`，其它disposition必须为`None`。marker的`source_ref`必须是带version的`Policy`
source，`summary_ref`必须是`Policy` summary，并且二者必须由source observation中的同一binding证明；constructor不得接受
无法回指binding的独立source/summary pair。

aggregate `try_new`先按typed fields计算唯一expected disposition，再与adapter提供的`disposition`比较。优先级固定为
`Invalid > Conflicted > Unsupported > Stale > Missing > Decidable`：forbidden marker非空即`Invalid`；authorization或任一marker
为`Conflicted`即`Conflicted`；任一为`Unsupported`即`Unsupported`；无gap且任一binding为`StaleBinding`即`Stale`；剩余有gap即
`Missing`；否则只能是`Decidable`。`SandboxReason`不参与优先级计算。

机械聚合算法固定如下：

1. 按 required role canonical 顺序读取 observation set，并验证每个 role 恰有一个 partition：一项或多项 binding，或一个
   gap；binding 与 gap 不得并存。
2. 对所有 binding 逐项验证 `Resolved | Stale` disposition、policy source kind、version presence、summary same-source
   关系和正 freshness window；对每个 gap验证 canonical gap disposition与reason。
3. 验证 authorization summary与每个 marker的summary lineage；`SafeSummaryRefSet`只能引用当前source binding set已证明的
   summary identity。若authorization或marker为`Pending`，其`pending_source_roles`必须是当前role-level gap集合的非空子集；
   source完整时不得出现任何`Pending`或pending role set。该规则把`Pending`与required-role gap机械绑定，不能只靠reason解释。
4. 验证 marker key唯一、source/summary pair来自binding set、requested scope全部为`Requested + None`；marker action kind、
   affected boundary set与boundary relation交由Step 6 checked factory再次穷尽校验。
5. 按固定优先级计算 aggregate disposition，并要求 `reason` 与 disposition 一一对应：`Decidable => None`，其余五类
   `Some`；`Invalid`还必须有非空 forbidden marker set，其余类必须为空。

`Denied`属于`Decidable`，因为信息完整且可以正式裁定；它不等于allow。`Unresolved` source disposition在policy resolver中
只能映射为role binding的`Gap(UnavailableAtEvaluation)`，不能伪造`StaleBinding`或`ResolvedBinding`。`CallAborted`不参与上述
聚合，必须沿port error退出。

| disposition | exact source/auth/marker relation | reason / marker relation | Step 6 route |
|---|---|---|---|
| `Decidable` | 无gap、全部binding current；authorization与marker disposition仅`Allowed`或`Denied` | reason `None`；forbidden empty | `PolicyApplicabilitySnapshot::applicable` |
| `Missing` | 至少一个gap；无conflict/unsupported/stale；present summaries均合法 | reason `Some`；forbidden empty | `PolicyApplicabilitySnapshot::missing` |
| `Conflicted` | authorization或至少一个marker为`Conflicted`；bindings可partial | reason `Some`；forbidden empty | `PolicyApplicabilitySnapshot::conflicted` |
| `Unsupported` | authorization或至少一个marker为`Unsupported`；bindings可partial | reason `Some`；forbidden empty | `PolicyApplicabilitySnapshot::unsupported` |
| `Stale` | 无gap、exact required coverage；至少一个`StaleBinding` | reason `Some`；forbidden empty | `PolicyApplicabilitySnapshot::stale` |
| `Invalid` | external-body scanner给出non-empty marker set | reason `Some`；forbidden non-empty | 不创建snapshot；进入external-body failure/redline route |

`Denied`属于`Decidable`，因为信息完整且可以正式裁定；它不等于allow。后续Step 6 high-risk与fail-closed guard会机械形成
`Rejected | Blocked`。`Pending` authorization/marker必须有matching required-role gap，不能在source完整时凭reason制造
`Missing`。`RequiresBoundaryExpansion`由high-risk decision处理，不得被resolver直接改为`Unsupported`，除非provider同时给出
canonical `Unsupported` authorization disposition。

### 10.5 Application factory mapping 与 failure matrix

application收到observation后，先取得本地`accepted_at`，并把该值写入Step 6 canonical binding字段`observed_at`；再用
`checked_elapsed_since(&accepted_at)`同一次结果提供snapshot的`assembled_at`和全部binding的checked age。freshness checks逐
`(role, source)`生成，不能只按role生成一个共享check。随后从target refs与loaded owner objects构造
`PolicyAuthorizationSummary`和`HighRiskActionMarkerSet`，再调用上表唯一的Step 6 factory。

```text
load exact context/identity/requirement/boundary/capability/handle group
  -> freeze ResolveSandboxPolicyApplicabilityRequest
  -> resolve_policy_applicability(request) outside UoW
  -> validate echoed target and aggregate observation
  -> trusted clock: accepted_at, then one assembled_at / checked-age result
  -> build PolicySourceBindingSet / GapSet / FreshnessCheckSet
  -> build PolicyAuthorizationSummary + requested HighRiskActionMarkerSet
  -> pre-generate snapshot/action/aggregate/audit/relay refs
  -> call exactly one status-specific PolicyApplicabilitySnapshot factory
  -> evaluate existing guards and action decisions
  -> stage immutable snapshot + decisions + audit/relay/stored result in one UoW
```

| condition | required handling | forbidden handling |
|---|---|---|
| `CallAborted` | no snapshot；close application/idempotency failure without policy truth | invent`Missing` gap、reuse latest Accepted decision |
| finite `Missing` | preserve binding/gap partition；guard decidesPending vs FailClosed | treat all missing as trusted waiting |
| finite `Conflicted/Unsupported/Stale` | create honest immutable snapshot then fail closed through guards | downgrade to warning or select another provider silently |
| finite `Invalid` | preserve forbidden markers in strict failure/redline source relation；no snapshot factory | store body、erase marker、map toordinary unavailable |
| owner changed after external call | discard observation and return conflict/retry route | apply observation tonew generation or requirement |
| commit unknown | inspect pre-generated refs + idempotency relation；do not callresolver again | create second snapshot/decision attempt |

fake与durable adapter必须支持相同六类finite disposition、相同constructor和相同closed error。fake不得提供
`allow_on_missing`、empty-summary success或忽略forbidden marker；这是`S7-05`待执行parity义务，不是已运行测试结果。

## 11. Backend capability resolver

### 11.1 Capability、复合 target 与非职责

backend capability resolver只回答“指定 `IsolationBackend` source 能否逐项落实指定 immutable requirement set”。它不建立
boundary、创建handle、启动run、读取backend lifecycle或修改current summary。`BackendCapabilityRefreshTarget` 的复合身份固定为
`(backend_ref, requirement_ref)`；其中 `current_summary_ref` 仅是首次materialization / replacement的CAS expectation，不参与
target equality、provider选择或报告identity。

```rust
/// capability resolver唯一消费的backend source + immutable requirement复合target。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxBackendCapabilityResolverTarget {
    /// exact versioned isolation-backend source。
    backend_ref: ExternalSourceRef,
    /// 本次probe唯一评估的immutable boundary requirement identity。
    requirement_ref: BoundaryRequirementSetRef,
}

impl SandboxBackendCapabilityResolverTarget {
    /// 从maintenance selection与loaded requirement构造target；不复制current-summary expectation。
    pub fn try_from_selection(
        selection_target: &BackendCapabilityRefreshTarget,
        requirements: &BoundaryRequirementSet,
    ) -> Result<Self, SandboxBackendCapabilityResolverError>;

    /// 返回exact versioned isolation-backend source。
    pub fn backend_ref(&self) -> &ExternalSourceRef;
    /// 返回本次probe唯一评估的immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
}

/// application为一次capability probe冻结的exact body-free request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResolveSandboxBackendCapabilityRequest {
    /// backend source + immutable requirement复合target；不含current summary expectation。
    target: SandboxBackendCapabilityResolverTarget,
    /// 与target.requirement_ref相等的已校验十维requirement输入；不是第二份持久truth。
    requirements: BoundaryRequirementSet,
    /// validated profile window与application hard budget取更严格值后的正freshness窗口。
    effective_freshness_window_millis: NonZeroU64,
    /// 当前application调用的typed trace context。
    trace_context: SandboxTraceContext,
}

impl ResolveSandboxBackendCapabilityRequest {
    /// 构造capability probe request；校验target关系，并把两个正window收敛为更严格值。
    pub fn try_new(
        target: SandboxBackendCapabilityResolverTarget,
        requirements: BoundaryRequirementSet,
        profile_freshness_window_millis: NonZeroU64,
        application_hard_budget_millis: NonZeroU64,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, SandboxBackendCapabilityResolverError>;

    /// 返回backend source + requirement复合target。
    pub fn target(&self) -> &SandboxBackendCapabilityResolverTarget;
    /// 返回不可变、已校验的十维requirement probe输入。
    pub fn requirements(&self) -> &BoundaryRequirementSet;
    /// 返回两个validated输入取最小值后的正freshness窗口。
    pub fn effective_freshness_window_millis(&self) -> NonZeroU64;
    /// 返回本次resolver调用的typed trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}
```

request的`requirements`只供adapter逐项probe，不允许adapter修改、重排、补默认或持久化。constructor必须按以下顺序机械
校验：`requirements.requirement_ref() == target.requirement_ref()`；`target.backend_ref().source_kind() ==
ExternalSourceKind::IsolationBackend`；`target.backend_ref().source_version_ref()`必须为`Some(backend_generation_ref)`；最后
`requirements.generation_ref() == backend_generation_ref`。`None`不得与generation比较、不得回退resource ref或current summary；
应返回`RequestRelationInvalid`。constructor再把validated profile window与application hard budget取`min`保存为
`effective_freshness_window_millis`；adapter不得从response、backend default或另一次配置读取覆盖该值。resolver不接受
`Version`、UoW、repository、lease、handle、policy decision、tool command、runtime loop、path、URL、SDK object或正文。

### 11.2 Complete verdict observation

```rust
/// capability provider对本次source observation是否已过期的typed判断；不携带provider时间或freshness window。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxBackendCapabilityFreshnessObservation {
    /// provider没有声明source observation已过期；不等于Sandbox最终Fresh。
    Current,
    /// provider明确声明source observation已过期；application不得沿用旧Fresh语义。
    Stale,
}

/// capability resolver能形成的finite provider observation disposition。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxBackendCapabilityResolverDisposition {
    /// 十项verdict全部Supported；可映射Step 6 Fresh factory。
    Fresh,
    /// provider明确声明当前source observation已过期；不建立新的可用window。
    Stale,
    /// 至少一项Unknown且没有Unsupported；信息不足，必须保守处理。
    Unknown,
    /// 至少一项Unsupported；明确不能满足exact requirement。
    Unsupported,
    /// 检测到forbidden body或不可继续信任的安全边界；不创建capability summary。
    Invalid,
}

/// 一个exact backend/requirement target的body-free capability observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxBackendCapabilityResolverObservation {
    /// adapter回显且必须与request.target完全相等的复合target。
    target: SandboxBackendCapabilityResolverTarget,
    /// 十个BoundaryLimitKind逐项完整的verdict set。
    verdicts: BoundaryCapabilityVerdictSet,
    /// provider对本次source observation是否过期的typed判断；不代替application freshness计算。
    freshness: SandboxBackendCapabilityFreshnessObservation,
    /// provider映射出的finite disposition；不是持久化summary status。
    disposition: SandboxBackendCapabilityResolverDisposition,
    /// non-Fresh/Invalid disposition的caller-safe reason。
    reason: Option<SandboxReason>,
    /// 只允许Invalid分支非空的forbidden-body marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
}

impl SandboxBackendCapabilityResolverObservation {
    /// 以request为authority校验target、10/10 verdict、generation、disposition和body boundary。
    pub fn try_new(
        request: &ResolveSandboxBackendCapabilityRequest,
        target: SandboxBackendCapabilityResolverTarget,
        verdicts: BoundaryCapabilityVerdictSet,
        freshness: SandboxBackendCapabilityFreshnessObservation,
        disposition: SandboxBackendCapabilityResolverDisposition,
        reason: Option<SandboxReason>,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    ) -> Result<Self, SandboxBackendCapabilityResolverError>;

    /// 返回backend/requirement复合target。
    pub fn target(&self) -> &SandboxBackendCapabilityResolverTarget;
    /// 返回完整十维body-free verdict set。
    pub fn verdicts(&self) -> &BoundaryCapabilityVerdictSet;
    /// 返回provider的typed freshness判断；不返回provider timestamp或window。
    pub fn freshness(&self) -> SandboxBackendCapabilityFreshnessObservation;
    /// 返回finite resolver disposition。
    pub fn disposition(&self) -> SandboxBackendCapabilityResolverDisposition;
    /// 返回non-Fresh/Invalid disposition的caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回必须进入strict safety route的forbidden-body markers。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
}
```

complete verdict不是“至少探测到一个维度”：`BoundaryCapabilityVerdictSet::try_complete`必须覆盖
`Cpu, Memory, WallClock, Io, Filesystem, Network, Process, Workspace, Mount, Lifecycle`各一次。每个
`Supported`或`Unsupported` verdict必须有`IsolationBackend` proof summary；`Unknown`不得携带proof summary。
provider不能用缺项、旧candidate或“backend默认支持”补齐十维。

| disposition | verdict relation | reason | freshness / Step 6 mapping |
|---|---|---|---|
| `Fresh` | `freshness=Current`且10/10 `Supported` | `None` | application使用request effective window调用`BackendCapabilitySummary::fresh` |
| `Stale` | `freshness=Stale`且verdict set完整，可含任意有限verdict | `Some` | `BackendCapabilitySummary::stale`，window `None` |
| `Unknown` | `freshness=Current`、至少一个`Unknown`且不得有`Unsupported` | `Some` | `BackendCapabilitySummary::unknown`，window `None` |
| `Unsupported` | `freshness=Current`且至少一个`Unsupported` | `Some` | `BackendCapabilitySummary::unsupported`，window `None` |
| `Invalid` | forbidden marker非空或安全边界不可相信 | `Some` | 不创建summary；进入strict failure/redline source relation |

`Fresh`、`Stale`、`Unknown`和`Unsupported`必须分别与typed freshness observation及verdict集合机械一致；固定优先级为
`Invalid > Stale > Unsupported > Unknown > Fresh`。因此`freshness=Stale`即使同时出现`Unsupported`或`Unknown`，也只能形成
`Stale`；`freshness=Current`时才允许按verdict区分`Unsupported`、`Unknown`和`Fresh`。`reason`不参与分类。`Invalid`是安全观察
分支，不是`BackendCapabilitySummaryStatus`的新variant，不能写入current capability summary。

### 11.3 Port error 与 trait

```rust
/// backend capability resolver未形成可信十维observation或违反application contract的closed error。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxBackendCapabilityResolverError {
    /// request target、requirement body、generation或freshness budget关系不合法。
    RequestRelationInvalid {
        /// 不暴露backend body或SDK response的caller-safe reason。
        reason: SandboxReason,
    },
    /// adapter回显的backend/requirement target与request不相等。
    TargetRelationMismatch,
    /// verdict set缺项、重复、proof kind或reason关系不合法。
    VerdictObservationRelationInvalid {
        /// 定位关系失败的canonical boundary kind或safe category。
        reason: SandboxReason,
    },
    /// generation、backend source kind或requirement identity不一致。
    GenerationOrSourceRelationInvalid {
        /// 不携带raw backend identity/path的安全原因。
        reason: SandboxReason,
    },
    /// disposition、typed freshness、verdict set、reason或forbidden marker组合不合法。
    AggregateObservationRelationInvalid {
        /// 无法由typed verdict证明的finite disposition。
        disposition: SandboxBackendCapabilityResolverDisposition,
    },
    /// provider在形成可信十维observation前中止；不得伪造Unknown summary。
    CallAborted {
        /// 仅含caller-safe unavailable/transport类别。
        reason: SandboxReason,
    },
    /// runtime assembly把trait绑定到错误backend capability provider或generation。
    AdapterBindingInvalid {
        /// 不暴露endpoint、credential或SDK object的安全原因。
        reason: SandboxReason,
    },
}

/// 读取一个backend source对一个immutable requirement set的body-free十维capability observation。
pub trait SandboxBackendCapabilityResolverPort: Send + Sync {
    /// 返回finite capability observation；不创建summary、boundary、handle或run truth。
    async fn resolve_backend_capability(
        &self,
        request: &ResolveSandboxBackendCapabilityRequest,
    ) -> Result<
        SandboxBackendCapabilityResolverObservation,
        SandboxBackendCapabilityResolverError,
    >;
}
```

`CallAborted`与finite `Unknown`严格不同：只有adapter确实形成了10/10 verdict、且至少一个kind为`Unknown`时才能返回
`Unknown` observation；timeout、连接失败或无法确认任何维度必须返回`CallAborted`，由外层application error收束，不生成
placeholder summary，也不沿用旧current summary报告成功。

### 11.4 Application materialization、refresh 与故障矩阵

application负责在resolver调用前读取exact owner row、`BoundaryRequirementSet`和optional current summary binding及其
`Version`。resolver只在UoW外调用；candidate materialization与current binding替换在短write UoW内完成。

```text
selection target(backend_ref, requirement_ref, optional current_summary_ref)
  -> load exact backend binding + immutable requirement + current summary/version
  -> verify backend source kind/version, requirement ref/generation and current-summary relation
  -> derive SandboxBackendCapabilityResolverTarget(backend_ref, requirement_ref)
  -> build ResolveSandboxBackendCapabilityRequest without current_summary_ref
  -> resolve_backend_capability(request) outside UoW
  -> validate echoed composite target, typed freshness and 10/10 verdict relation
  -> trusted clock obtains local accepted_at for canonical observed_at field
  -> pre-generate candidate capability ref when finite summary is materializable
  -> call BackendCapabilitySummary::{fresh, stale, unknown, unsupported}
  -> begin write UoW; re-read exact current binding/version
  -> append candidate and CAS replace logical current binding
  -> stage audit / required relay / projection marker as same-UoW obligations
  -> commit; only then map result to Truth(new summary)
```

| scenario | exact owner action | result / safe default | forbidden handling |
|---|---|---|---|
| first + `Fresh` | absent current expectation；append new candidate并CAS current binding | `Succeeded(Truth(new summary))` | treat first as replacement of unknown row |
| replacement + `Fresh` | current summary ref + loaded Version exact CAS | `Succeeded(Truth(new summary))` | update old summary in place / last-write-wins |
| `Stale` | create immutable stale candidate and replace current binding atomically | `Degraded(Truth(stale summary), reason)`；new establishment fail-closed | preserve old fresh status or extend window |
| `Unknown` | create immutable unknown candidate and replace current binding atomically | `Degraded(Truth(unknown summary), reason)`；boundary guard blocks | fill missing verdict as Supported |
| `Unsupported` | create immutable unsupported candidate and replace current binding atomically | `Degraded(Truth(unsupported summary), reason)`；boundary guard blocks | switch backend, relax requirement or start run |
| `Invalid` | no candidate；retain marker in strict failure/redline source relation | application error / safety hold | write invalid as Unknown or erase marker |
| `CallAborted` | no candidate and no current binding mutation | application error / retry policy outside port | manufacture Unknown or replay old summary as Fresh |
| target/current CAS conflict | discard candidate visibility; inspect exact conflict and reselect operation scope | typed conflict; caller may start a new idempotent invocation | retry only save, overwrite new current, reuse old candidate ref |
| commit unknown | inspect idempotency + candidate/current identity relation | status unknown until inspection; no second probe automatically | invoke resolver again and create second candidate |

`current_summary_ref`只参与owner reload与CAS expectation，不参与resolver target identity；同一backend对两个不同
`BoundaryRequirementSetRef`必须形成两个独立candidate lineage。`BackendCapabilitySummary::fresh`的
`freshness_window_millis`只能取request constructor已保存的`effective_freshness_window_millis`；该值已经是validated
config/profile window与application hard budget中的更严格者。resolver不得延长、缩短或从provider response推导window。
Step 6 `BackendCapabilitySummary.observed_at`字段接收本地trusted clock的`accepted_at`；它表示Sandbox接受该observation的
时刻，不是backend wall-clock string，也不是provider response timestamp。

该resolver不调用`establish_environment`、`launch_run`、`inspect_lifecycle`、`release_environment`、policy decision、capture、
handoff或member/runtime orchestration；这些接缝分别由`S7-03B`及后续模块承接。fake/durable parity要求与policy resolver相同：
同一request constructor、同一10/10 verdict validator、同一finite disposition/error集合，不得有fake-only supported默认。

## 12. S7-03A Closure Audit

本节是本任务的 current closure evidence。它只证明设计契约的结构闭合，不代表编译、测试、adapter运行、evidence、验收或
implementation 已发生。

### 12.1 Trait ownership、caller、implementer 与 effect

| resolver | trait owner | application caller | durable/fake implementer | async | read/write | exact input | exact output | exact error |
|---|---|---|---|---|---|---|---|---|
| identity context | `application::ports` | intake command/consumer facade内部 | `infra` context adapter | `async fn` | external read only；无Sandbox write | `ResolveSandboxIdentityContextRequest` | `SandboxIdentityContextResolverObservation` | `SandboxIdentityContextResolverError` |
| tracked reference | `application::ports` | refresh Job、reference consumer、policy/capability consumer facade | `infra` source adapter | `async fn` | external read only；state write由caller负责 | `RefreshSandboxTrackedReferenceRequest` | `SandboxTrackedReferenceResolverObservation` | `SandboxTrackedReferenceResolverError` |
| policy applicability | `application::ports` | policy evaluation command facade | `infra` policy adapter | `async fn` | external read only；snapshot/UoW由caller负责 | `ResolveSandboxPolicyApplicabilityRequest` | `SandboxPolicyApplicabilityResolverObservation` | `SandboxPolicyApplicabilityResolverError` |
| backend capability | `application::ports` | boundary command、capability refresh Job facade | `infra` backend capability adapter | `async fn` | external read only；candidate/CAS由caller负责 | `ResolveSandboxBackendCapabilityRequest` | `SandboxBackendCapabilityResolverObservation` | `SandboxBackendCapabilityResolverError` |

共同约束：四个trait均为`Send + Sync`，不接受repository、`Version`、UoW、idempotency record、stored result或allocator，
也不返回Sandbox truth。capability request可携带application从committed read取得并已校验的immutable
`BoundaryRequirementSet`副本作为十维probe输入；adapter不得修改、持久化或据此创建第二份truth。entry、domain、repository和
concrete provider不得直接调用trait。adapter可在自身边界读取provider，但只能把body-free typed observation或closed port
error交回application。

### 12.2 字段来源与 generation / freshness 关系

| contract field | 唯一来源 | resolver是否拥有 | downstream consumer | 禁止替代来源 |
|---|---|---|---|---|
| declared/existing source identity | caller checked input或committed selection | 否，只回显并校验 | source carrier、domain reference factory | route、topic、opaque text、latest scan |
| required context kinds | active intake guard | 否 | identity context factory | provider返回的source列表 |
| reference state ref | committed existing state selection | 否 | `apply_resolution` + CAS | source ref派生新state identity |
| policy owner group refs | committed context/identity/requirement/boundary/capability/handle group | 否，只回显 | policy snapshot / guard | provider body或current/latest扫描 |
| required policy roles | `PolicySourceRequirementSet` | 否 | binding/gap partition | response中临时role字符串 |
| policy source version | typed `ExternalSourceRef.source_version_ref()` | 否，只验证必须存在 | binding identity/freshness | digest、summary ref或wall clock |
| capability target | `(backend_ref, requirement_ref)` | 否 | capability summary candidate | `current_summary_ref`、profile name或opaque backend ref |
| capability verdict coverage | `BoundaryLimitKind` canonical ten-set | 否 | `BackendCapabilitySummary` factory | missing item、default support、old candidate |
| capability freshness disposition | provider typed `Current/Stale` observation | 否，只回显并参与分类 | capability aggregate classifier | provider timestamp、response window、reason text |
| local accepted time | application `SandboxClockPort` | 否 | canonical `observed_at` / `assembled_at` mapping | provider wall-clock |
| checked age | one `checked_elapsed_since(&accepted_at)` result | 否 | policy/capability freshness guard | second `now()`、saturating/absolute subtraction |
| local truth identity | `SandboxIdentityAllocator` in application | 否 | domain factory / UoW | resolver-generated ID |

### 12.3 Relation and partition closure

| audit relation | mechanical rule | result |
|---|---|---:|
| source carrier | each declared source has exactly one self-contained item in declared order | `closed` |
| source/summary pair | summary kind matches source kind; no parallel-array zip or source-to-summary inference | `closed` |
| identity required/deferred | required kinds are covered; optional deferred items are non-required and explicitly retained | `closed` |
| tracked refresh | request state/source identity equals observation echo; missing state never creates initial state | `closed` |
| policy role partition | each required role has one-or-more bindings or exactly one gap; binding+gap and multiple gaps forbidden | `closed` |
| policy source identity | source kind `Policy`, version present, typed `(role, source identity)` order; digest/version not role identity | `closed` |
| policy marker lineage | every `(source_ref, summary_ref)` is proven by the current binding set; marker key unique | `closed` |
| pending relation | every `Pending` authorization/marker carries non-empty pending roles, each a member of current gap set; complete source forbids Pending | `closed` |
| capability target | exact `(backend_ref, requirement_ref)`; current summary only CAS expectation | `closed` |
| capability verdict | exactly 10/10 canonical boundary kinds; no omission, duplicate or default fill | `closed` |
| capability status | fixed `Invalid > Stale > Unsupported > Unknown > Fresh` from typed freshness, verdicts and markers | `closed` |

### 12.4 Disposition difference and domain factory route

| resolver family | positive finite route | non-positive finite route | call-aborted route | direct domain-truth return |
|---|---|---|---|---:|
| identity context | `Resolved` observation -> Step 6 context/reference factories | `Partial/Stale/Unavailable/Invalid/Conflicted` -> corresponding checked factory/guard | application error; no empty truth | `0` |
| tracked reference | `Resolved` source observation -> binding/observation factory + state CAS | `Stale/Unresolved/Unavailable/Invalid` -> typed state observation + CAS | state unchanged | `0` |
| policy | `Decidable` -> status-specific snapshot factory (authorization `Denied` remains decidable) | `Missing/Conflicted/Unsupported/Stale` -> matching snapshot factory; `Invalid` redline no snapshot | no snapshot/no replay | `0` |
| capability | `Fresh` -> fresh summary factory | `Stale/Unknown/Unsupported` -> matching summary factory; `Invalid` no summary | no candidate/no replay | `0` |

No resolver returns `ExecutionEnvironmentIdentity`, `ReferenceResolutionState`, `PolicyApplicabilitySnapshot` or
`BackendCapabilitySummary`; the only domain truth construction route is application validation followed by the named Step 6 checked
factory. `CallAborted` is not an alias for `Unavailable` or finite `Unknown`.

### 12.5 Cross-resolver negative boundary audit

| forbidden crossing | audit result |
|---|---|
| identity resolver creates environment identity or responsibility anchor | `0` positive callers |
| identity resolver refreshes tracked state | `0` positive callers |
| tracked resolver creates first reference state | `0` positive callers |
| policy resolver calls launch/establish or decides allow | `0` positive callers |
| capability resolver establishes boundary, creates handle or starts run | `0` positive callers |
| resolver invokes tools semantic execution | `0` |
| resolver runs runtime agent loop | `0` |
| resolver orchestrates member lifecycle | `0` |
| resolver carries external body, path, URL, credential, SDK object or raw response | `0` positive contract fields |
| resolver owns UoW, repository, idempotency or local identity | `0` |

### 12.6 Handoff matrix

| downstream | handoff from this task | owner after handoff | current state |
|---|---|---|---|
| Step 8 protocol | request/output/error names and body-free field categories | Step 8 protocol contract task | blocked until Step 7 overall gate |
| Step 9 flow | call outside UoW, post-call relation validation, factory/CAS sequence and no-rerun branches | Step 9 flow task | blocked |
| Step 10 state | identity/reference/policy/capability finite status mapping only | Step 10 state task | blocked |
| Step 11 persistence | state/candidate save and CAS owner remains application/repository task | Step 11 revalidation | blocked |
| Step 16 tests | L1 positive, finite negative, relation, redline and fake/durable parity cuts | Step 16 test revalidation | not designed here |
| Step 17 implementation handoff | named traits, source map, no-code scope and open blockers | Step 17 handoff | blocked |
| formal `05` | coverage categories only; no test results | formal test document revalidation | pending |
| formal `06` | safety acceptance categories only; no evidence aliases/signoff | formal acceptance revalidation | pending |
| formal `07` | callable/port source references and design freeze prerequisite | formal implementation-plan revalidation | pending |

## 13. 正式 `03` 回填草稿

> 校准来源：
> - `design-calibration/03_ddd_step_07_resolver_ports.md`
>
> 延伸阅读：
> - 请继续阅读本中间产物的“Resolver 共同执行契约”“四类 resolver 契约”和“Step 7 Closure Audit”。

正式 `03` 的 Step 7 resolver 章节只保留以下收口结论：

1. `application::ports` 拥有四个窄 resolver trait，`infra` 提供 durable/fake adapter；domain 只负责 checked truth factory。
2. identity context intake 与 tracked reference refresh 是两个独立接缝；前者可形成首次 context/reference resolution observation，
   后者只能刷新已有 `ReferenceResolutionState`，不得创建初始 state。
3. policy resolver 接收已提交 owner group 和 strict required roles，逐 role 保持 binding/gap 二选一分区；
   `Invalid > Conflicted > Unsupported > Stale > Missing > Decidable` 的优先级固定，`Denied` 属于完整可裁定结果但不等于允许执行。
4. capability resolver 的 target 固定为 `(backend_ref, requirement_ref)`，必须产生十个 canonical boundary kind 的完整 verdict；
   `CallAborted` 不得伪装为 `Unknown`，也不得用旧 summary 伪造成功。
5. resolver 只返回 body-free finite observation；application 在外部调用后校验 relation，使用 trusted clock 和 generated local refs
   调用 Step 6 checked factory，再通过 repository/UoW 保存 Sandbox truth。
6. resolver 不执行 tools semantic execution、runtime agent loop、member lifecycle orchestration，也不调用 establish/launch/capture/
   handoff/release lifecycle ports；这些能力由后续 Step 7 resolver/external port 批次拥有。

正式正文不搬入本文件的问题诊断、历史差异、逐项 closure 表和用户停审记录；正文只引用本文件作为校准来源。

## 14. 待确认事项

| item | 当前处理 | owner / timing | 是否阻塞本任务 |
|---|---|---|---|
| public protocol DTO 字段、route/topic、schema version | 后续 Step 8 定义 | Step 8 protocol owner | 否 |
| exact per-command flow、retry policy、state transition matrix | 后续 Step 9/10 定义 | Step 9/10 owner | 否 |
| concrete provider SDK binding、config key、secret/profile | 后续 Step 5/14/`04` 定义 | infra/config owner | 否 |
| durable adapter schema、migration、index physical layout | Step 11/`04` 定向回查 | persistence owner | 否 |
| fake/durable contract tests and test execution | Step 16/正式`05` | test owner | 否；本批只定义切口 |
| real baseline、run_id、evidence、acceptance signoff、commit | implementation/acceptance gates | corresponding owner | 否；不得预填 |

本批没有新增上游 blocker。若后续 owner 无法提供 canonical `PolicySourceRequirementSet`、`BoundaryLimitKind` 十维集合或
Step 6 checked factory，则应回开相应上游 Step，而不是在 resolver adapter 内部补造第二套类型。

## 15. 进入下一步条件

`S7-03A` 内容设计已完成，当前停在 `completed_wait_user_review`。本任务完成定义为：

- 四个 trait 的 owner/caller/implementer、exact request/output/error、async/read-write/no-write 已闭合；
- identity/reference/policy/capability 的字段来源、source partition、marker lineage、freshness 和 generation relation 无悬空；
- policy `Pending` 与 required-role gap 可机械校验，capability verdict 为 10/10，`CallAborted` 与 finite degraded outcome 不混淆；
- direct domain-truth return、body/SDK/raw response 泄漏和跨 resolver positive dependency 差集为 `0`；
- 正式 `03` 回填草稿、下游 handoff、待确认事项和恢复源同步已完成。

用户确认后才可读取 `S7-03B` 输入并开始下一项；本轮不得自动进入 `S7-03B`、Step 8、正式 `03~07` 或 implementation。

## 16. 自检与真实性声明

| check | result |
|---|---|
| Markdown fence parity | `32` fence markers，parity `0` |
| Markdown table columns | mismatch `0` |
| public Rustdoc presence | 四个trait method、public type/variant/accessor均有Rustdoc；attribute-aware static gap `0`（私有`items`字段不计入） |
| source/generation/target relation | `closed` |
| policy role binding/gap partition | `closed` |
| policy marker `(source_ref, summary_ref)` lineage | `closed` |
| capability 10/10 verdict/disposition difference | `closed` |
| direct domain truth return | `0` |
| body/path/URL/SDK/raw response positive fields | `0` |
| formal `03` modified | `no` |
| implementation repository/code modified | `no` |
| tests/evidence/run_id/commit/acceptance facts | `not_created` |

`S7-03A` 设计包完成但尚未获得用户 review；`S7-03B` 不得启动。

---

## EOF Review-Consumed Overlay: `S7-03A` confirmed

本节只更新本中间产物的审查状态，不改变前述已确认 resolver 契约。用户已确认 `S7-03A`，其内容已被
`S7-03B` 作为上游输入消费；当前恢复点由 Step 7 control、`03_ddd_calibration_flow.md`、项目台账和
`03_ddd_step_07_lifecycle_ports.md` 共同记录。

```text
artifact = 03_ddd_step_07_resolver_ports.md
artifact_content_status = completed
artifact_review_status = confirmed
review_consumed_by = S7-03B establish/launch/inspect/release ports
current_task = S7-03B
next_allowed_action = write_s7_03b_lifecycle_ports_only
formal_03_modified = no
implementation_started = no
commit_required = no
```
