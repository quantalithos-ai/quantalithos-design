# L4-observability 03-详细设计 Step 08 - S08-D Query Q10 `GetDiagnosticView`

> 本文件是 Q10 的独立讨论中间产物。它只覆盖 `GetDiagnosticView`，不关闭 Q11-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q10 |
| 逻辑协议 | `Query / GetDiagnosticView / GetDiagnosticViewRequest` |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q11` |
| 协议计数 | `26/60 defined_with_affected_open`；`0/60` 无条件 complete |
| Query 计数 | `10/14 defined_with_affected_open`；Q11-Q14 尚未逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 继续冻结，只允许 Step 19 重装配 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q11 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

Q10 的目标是读取一个已经提交的、observation-owned、explain-only diagnostic projection。它可以解释观测投影中已经保存的 safe signal、gap 和 no-write 关联，但不拥有业务 truth、source truth、raw log/metric/trace/audit body、evidence body、report verdict、验收签署或外部执行结果。

### 1.1 本批禁止事项

- 不读取或写入 Q11-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 临时声明第二个 `DiagnosticView`、`DiagnosticScope`、`DiagnosticSummary` 或任何同名 ref owner。
- 不把 `DiagnosticRequestContextRef` 当作 public selector、projection key、summary identity 或 view identity。
- 不把请求携带的 scope 序列化、hash、path、request digest 或 cursor 转成任何 projection ref。
- 不从当前 source truth、raw telemetry、provider body、evidence body 或业务查询补齐 diagnostic summary。
- 不在 Query 中创建或替换 `DiagnosticSummary`、`DiagnosticView`、freshness marker、gap、degraded revision、read-audit record 或 maintenance task。
- 不等待、启动、恢复、推进或修复 rebuild；只验证已经提交的 progress relation。
- 不把 `DiagnosticSummary::Partial`、projection `Rebuilding` 或 `Unknown` 改写为 `Fresh`。
- 不把缺失、不可见、不可用、stale、corrupt 或 rebuilding 任一状态默认映射为 `Empty`、`NotFound` 或成功。
- 不伪造实现 commit、run_id、evidence alias、测试结果、验收签署或真实 evidence。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 08 | Query 独立协议、response view、marker、missing/visibility/freshness/degraded/error/no-write 和停审要求 |
| `standards/document/详细设计书写规范.md` 5.6/5.7 | public DTO、二级类型、字段来源、协议到对象/flow 的回指结构 |
| `standards/document/设计真相源闭环与可落码性标准.md` | stable identity、唯一 lookup key、composite read、P10/P11/P13、Query zero-write 和 owner 闭环 |
| `03_ddd_step_06_application_input_assembly_r06_8a.md` | Q10 exact assembler use-site、Query control fields、`GetDiagnosticViewInput` 当前冲突字段 |
| `03_ddd_step_06_boundary_read_maintenance.md` | `DiagnosticScope`、`DiagnosticRequestContext`、`DiagnosticSummary`、`DiagnosticView`、replacement 与 maintenance relation |
| `03_ddd_step_06_contracts_carriers.md` | `DiagnosticViewRef`、`DiagnosticScopeRef`、`DiagnosticSummaryRef`、`DiagnosticRequestContextRef` 和 marker owner |
| `03_ddd_step_06_policy_guard_records.md` | P10/P11/P13 的 complete input、decision binding、visibility ceiling 与 Query zero-write |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | exact assembler、Read façade、least-authority query facet、diagnostic composite writer carrier 和 replacement port |
| current Q09 中间产物 | 复用逐协议停审结构、same-committed-boundary、typed absence 和 surface precedence 的审查方法，不复用 Q09 schema |
| current formal `03-详细设计.md` 与 `02-概要设计.md` | 仅识别旧 diagnostic chain 和历史冲突，不覆盖 current Step 06/07 owner |

### 2.2 权威顺序

```text
current Q10 authority / affected register
  > Step 07 exact assembler, Read façade and least-authority query facet
  > Step 06 DiagnosticView / DiagnosticScope / DiagnosticSummary / policy contracts
  > current formal 02 and HLD query skeleton
  > frozen formal 03 and old README wording
```

Step 08 不拥有 Step 06 的 object/view/schema。Q10 只能记录协议如何消费这些 owner，并将未传播的 exact carrier、mapper 或 request owner登记为 affected。

### 2.3 Historical material 裁定

| 旧材料 | current disposition | 裁定 |
|---|---|---|
| `request-context ref + canonical projection scope -> DiagnosticView -> diagnostic composite store` | `historical_material_with_current_split` | 保留 lookup 与 explain-only 方向；request context 只作一次请求关联，不能进入 projection lookup；composite read 必须有 Query-safe owner |
| 旧文档把 `request_context_ref` 写进 public request | `historical_material; upstream affected` | current public body 目标只含 canonical `scope`；one-shot ref 应来自可信 API/query entry carrier，R06.8-A 的字段位置冲突另行登记 |
| 旧文档把 `ReadVisibilityState` 作为同步 Query 输入 | `superseded` | current 同步 Query 只消费 P11 `ReadVisibilityDecision`，不创建/持久化 `ReadVisibilityState` 或 H7 |
| 旧文档把 corrupt bundle 简化成通用 typed failure | `retained_with_refinement` | 保留 fail-closed 原则；必须区分 protocol invalid、relation corruption、dependency availability 和不可见 ceiling，禁止返回 partial body |
| 旧文档声称 replacement 保持 view/scope/marker identity | `current Step 06/07 confirmed` | `DiagnosticSummaryRef` 每次 accepted replacement 更新，view/scope/marker 保持稳定，并在一个 committed boundary 原子替换 |
| 旧文档把 summary pointer 当独立可更新字段 | `historical_material` | pointer 只能随完整 diagnostic projection replacement 提交，Query 不可单独更新 |

## 3. SOP 问题回答

| # | 问题 | Q10 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetDiagnosticView` |
| 2 | 协议族与模块 | S08-D Query；API input assembler -> application Read façade -> projection query facet |
| 3 | 调用方与处理方 | exact API handler 调用 `ObservationApiInputAssembler::get_diagnostic_view`，再调用 `ObservationReadService::get_diagnostic_view` |
| 4 | 传输方式 | typed logical request/response；具体 HTTP/RPC locator 后置到 Step 14/`04`，不进入 DTO |
| 5 | public request schema | 目标为一个 `scope: ObservationProjectionScope`；不接受 body 中的 request context、actor、visibility、consistency、summary ref 或 rebuild intent |
| 6 | application input | scope + Query context/control fields；one-shot `DiagnosticRequestContextRef` 若作为 input field，只能是可信 entry carrier，不是 body field；当前传播存在 affected |
| 7 | response schema | non-paged `ObservationQueryResponse<DiagnosticView>`；Q10 禁止 `ObservationQueryPresence::Empty` |
| 8 | 读取目标 | 由 `(diagnostic projection kind, canonical ObservationProjectionScope)` 定位的 committed diagnostic bundle |
| 9 | diagnostic scope 来源 | 从 committed diagnostic bundle 读取；Query 不由请求重新定义 target set、time window 或 visibility scope |
| 10 | view identity | `DiagnosticViewRef` 首次 committed projection 创建时生成，replacement 保持稳定；不能由 scope/hash/digest 派生 |
| 11 | scope identity | `DiagnosticScopeRef` 首次 canonical scope 建立时生成，accepted target replacement 保持稳定；不能与 request context 或 summary 混用 |
| 12 | summary identity | `DiagnosticSummaryRef` 表示不可变 summary revision；首次建立和每次 accepted replacement 使用新 ref，当前 view pointer 原子切换 |
| 13 | request identity | `DiagnosticRequestContextRef` 是 API/query entry 为单次请求生成的 one-shot identity，只用于 correlation/audit；不持久化为 projection identity |
| 14 | member consistency | summary 的 signal/gap/no-write ref 集合、scope target set、view relation 和 as-of cursor 必须来自同一 committed diagnostic snapshot |
| 15 | visibility | P10 same-target decision + P11 one-shot decision；不能从 row existence、summary count、state、scope kind 或 HTTP status猜测 |
| 16 | freshness | 同时保留 summary freshness 与 projection freshness；两者不得合并为一个 stale 布尔值 |
| 17 | rebuilding | 只验证已持久化的 `progress_ref -> RebuildProgressView -> MaintenanceTargetRef -> immutable scope binding` relation；不生成或推进 progress |
| 18 | degraded | 只在完整 P13 input/decision存在时映射 limited/blocked surface；不创建 durable `DegradedOutputState` |
| 19 | missing/presence | visible definitive absence 才能返回 `Missing`；hidden、unknown、dependency unavailable、corrupt 和 not-yet-projected必须分别保留语义 |
| 20 | error precedence | protocol/input invalid、visibility ceiling、availability、relation corruption、definitive absence、freshness/degraded 和 Present 采用有限顺序；不能由首个异常决定 surface |
| 21 | actor authority | actor 来自 `ObservationQueryMetadata`/trusted entry；public body不得提交 actor 或 policy outcome |
| 22 | no-write | 不创建 UoW、reservation、stored result、H7、outbox、gap/degraded revision、refresh、rebuild 或 source/business write |
| 23 | Step 09 回指 | 只登记 `GetDiagnosticViewFlow` handoff；本批不展开函数级 flow |

## 4. Logical binding 与 request/input 契约

### 4.1 Public request 目标形态

Q10 的目标 public body 为：

```rust
/// Selects one canonical committed diagnostic projection scope.
pub struct GetDiagnosticViewRequest {
    pub scope: ObservationProjectionScope,
}
```

`ObservationQueryRequest<GetDiagnosticViewRequest>` 仍承载 shared `ObservationQueryMetadata`：

```rust
ObservationQueryMetadata {
    actor_ref: ActorSafeRef,
    trace_ref: Option<TraceCorrelationRef>,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
}
```

Q10 body 不增加以下字段：

- `request_context_ref`、`actor_ref`、`read_purpose`、`visibility_scope_ref` 或 P10/P11/P13 decision；
- `DiagnosticScopeRef`、`DiagnosticSummaryRef`、`DiagnosticViewRef`、`ProjectionFreshnessMarkerRef` 或 `progress_ref`；
- target refs、time window、summary member refs、gap refs、cursor、freshness state 或 rebuild action；
- raw log/metric/trace/audit body、source locator、endpoint、credential、provider detail、report/evidence body 或真实 run identity。

`DiagnosticRequestContextRef` 由可信 API/query entry 为本次请求生成，并以 non-body metadata/application carrier 传递。当前 `ObservationQueryMetadata` 与 R06.8-A `GetDiagnosticViewInput` 尚未同时表达该 carrier，不能由 Q10 私自加 public field 或让 caller提交 ref，登记 `S08-D-Q10-REQUEST-CONTEXT-CARRIER-01`。

### 4.2 Exact assembler、application input 与 Read façade

当前 Step 06/07 观察到的 exact entry seam 为：

```rust
ObservationApiInputAssembler::get_diagnostic_view(
    ObservationQueryRequest<GetDiagnosticViewRequest>,
) -> Result<GetDiagnosticViewInput, ApplicationError>
```

```rust
ObservationReadService::get_diagnostic_view(
    GetDiagnosticViewInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<DiagnosticView>>
```

Q10 的目标 application input 逻辑字段为：

```rust
GetDiagnosticViewInput {
    scope: ObservationProjectionScope,
    context: ObservationOperationContext,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
    request_context_ref: DiagnosticRequestContextRef,
}
```

其中：

| field | source | Q10 rule |
|---|---|---|
| `scope` | validated request body | 唯一 projection lookup selector；canonical variant与nested ref必须通过 contracts factory校验 |
| `context` | R06.8-A private Query context factory | 无 idempotency key、event identity、writer capability；request digest仅作 input integrity |
| `visibility_scope_ref` | trusted Query metadata | 不从 scope、actor、cursor或route推导；不等于业务 authorization scope |
| `consistency` | trusted Query metadata | 只影响允许返回的已提交 surface；不能触发等待、刷新或重建 |
| `requested_at` | trusted boundary metadata | 不进入 lookup key、summary/view identity、freshness marker或source ordering |
| `request_context_ref` | trusted API/query entry carrier | one-shot correlation/audit only；不是 public body字段；当前 exact propagation受 affected约束 |

R06.8-A 当前表格把 `request_context_ref`列为 Q10 operation field，而 contracts ref card明确其由 entry生成且不得进入 projection lookup。两者不能同时作为 current truth；本批采用 entry-generated/non-body target口径，并保留上游 affected，不宣称 assembler propagation已关闭。

### 4.3 Assembly validation order

| stage | exact action | failure / side-effect rule |
|---:|---|---|
| 1 | finite entry slot绑定 `query_name == GetDiagnosticView` 和 expected schema version | mismatch -> `ApplicationError::InvalidRequest`；不解析另一个 Query variant |
| 2 | 校验 actor、visibility scope、consistency、requested time 和 one-shot context carrier | 缺失/owner mismatch -> typed invalid envelope；不生成 partial input |
| 3 | 校验 body 只有 canonical `scope`，拒绝 request context、page、target list、raw selector 和 unknown field | reject before digest；不把多余字段静默丢弃 |
| 4 | 按 R06.8-A exact Query material 生成 request digest | digest failure在repository/UoW前返回；不由entry自行hash |
| 5 | private context factory创建 Query `ObservationOperationContext` | 无 idempotency/event identity；不暴露 factory给entry |
| 6 | 原子构造字段私有的 `GetDiagnosticViewInput` | 不允许先构造再setter；不返回 partial context/input |

## 5. Exact query capability 与处理权限

### 5.1 Current observed query facet

Step 07 当前给出的 least-authority facet 为：

```rust
pub trait ObservationProjectionQueryStore: Send + Sync {
    fn get_diagnostic_view<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<DiagnosticView>>;
}
```

Query service 只能取得：

```rust
Arc<dyn ObservationProjectionQueryStore>
```

它不能取得 `ObservationProjectionStore`、`ObservationUnitOfWork`、source reader、membership planner、maintenance service、idempotency store、record store、outbox store、resolver writer 或 external adapter。

### 5.2 Current callable 的不足与 required repair

`get_diagnostic_view(scope) -> Option<DiagnosticView>` 可以表达当前 body use-site，但不能证明以下 Q10 必需事实来自同一个 committed boundary：

- `DiagnosticView`、`DiagnosticScope` 与 current `DiagnosticSummary` head 的 relation；
- summary member refs、gap revisions、no-write revisions 和 as-of cursor的完整集合；
- projection freshness marker、rebuild relation、visibility provenance 和 absence anchor；
- dependency unavailable、index corruption、hidden target 和 definitive local absence的区分。

因此 Q10 不得把该 `Option<DiagnosticView>` 当成完整实现证明。Step 07 必须选择一个 Query-safe composite carrier，目标逻辑形态至少为：

```rust
pub struct DiagnosticViewReadCarrier {
    pub bundle: Option<DiagnosticProjectionReadBundle>,
    pub absence: Option<DiagnosticAbsenceProof>,
    pub availability: DiagnosticReadAvailability,
    pub committed_boundary: DiagnosticCommittedReadBoundary,
}
```

上述名称是 Q10 的 required repair shape，不在 Step 08 创建 canonical type owner。canonical declaration、constructor、adapter mapping 和 exact method signature必须回到 Step 07/Step 06 affected repair中收敛。carrier必须是 read-only、bounded、typed、同一 committed boundary，并且不能暴露 repository version、SQL、provider detail或 writer capability。

### 5.3 Writer-side carrier 不能直接授予 Query

Step 07 已有：

```rust
ObservationProjectionStore::get_diagnostic_projection_with_version(
    scope: &ObservationProjectionScope,
) -> ApplicationPortFuture<'_, Option<Versioned<DiagnosticProjectionSnapshot>>>
```

以及：

```rust
ObservationProjectionStore::replace_diagnostic_view(
    replacement: &DiagnosticProjectionReplacement,
    source_position: &ProjectionSourcePosition,
    expected_version: Option<ObservationRepositoryVersion>,
    uow: &dyn ObservationUnitOfWork,
) -> ApplicationPortFuture<'_, ()>
```

这两个 callable分别属于完整 persistence/replacement capability。Q10 只能消费由 least-authority Query facet暴露的 read carrier；不能把 `Versioned<DiagnosticProjectionSnapshot>`、CAS version、`ProjectionReadFence` 或 `ObservationUnitOfWork`传给 Query。writer carrier 的存在只证明 replacement boundary已有设计，不证明 Query read boundary已闭合。

## 6. Canonical object/view schema 与 identity 分层

### 6.1 `DiagnosticScope` canonical owner 回指

`DiagnosticScope` 由 Step 06 domain/contracts boundary唯一拥有。Q10 不重定义类型，只消费以下字段和 invariant：

```rust
pub struct DiagnosticScope {
    pub scope_ref: DiagnosticScopeRef,
    pub projection_scope: ObservationProjectionScope,
    pub target_refs: BodyFreeRefSet,
    pub time_window: DiagnosticTimeWindow,
    pub visibility_scope_ref: VisibilityScopeRef,
}
```

| field | committed source | Q10 required invariant | prohibited substitution |
|---|---|---|---|
| `scope_ref` | first canonical diagnostic scope creation | stable across accepted target replacements；same canonical scope不得并存两个identity | scope hash/path/JSON、request digest、view ref、request context ref |
| `projection_scope` | diagnostic lookup row | exactly equals requested canonical `scope` | route、free string、summary/view反推scope |
| `target_refs` | one bounded committed projection capture | non-empty、canonical、owner-compatible；每项属于projection scope | current source scan、request target list、first page、unbounded set |
| `time_window` | committed diagnostic selection | `starts_at <= ends_at`，upper bound required；只选择已保存observation material | request time default、UI filter、source scan permission |
| `visibility_scope_ref` | committed scope definition | 与 one-shot request visibility scope 的兼容关系由 P11 formal input证明 | actor、scope kind、constraint ref或business role |

Request 中的 `ObservationProjectionScope` 只选择已提交 bundle。Q10 不接受 caller重新提交 `target_refs`、`time_window` 或 committed `visibility_scope_ref`，也不调用 `DiagnosticScope::replace_targets`。

### 6.2 `DiagnosticSummary` canonical owner 回指

```rust
pub struct DiagnosticSummary {
    pub summary_ref: DiagnosticSummaryRef,
    pub scope_ref: DiagnosticScopeRef,
    pub freshness: DiagnosticFreshnessState,
    pub staleness_reason: Option<StalenessReason>,
    pub unavailable_reason: Option<DiagnosticUnavailableReason>,
    pub safe_signal_refs: SafeSignalRefSet,
    pub gap_refs: GapStateRefSet,
    pub no_write_violation_refs: NoWriteViolationRefSet,
    pub as_of_cursor: Option<ObservationCommittedCursor>,
    pub assembled_at: ObservedAt,
}
```

| field | authoritative source | invariant checked by Q10 bundle rehydrate | forbidden inference |
|---|---|---|---|
| `summary_ref` | first summary creation or each accepted immutable replacement | current head ref exactly equals view pointer；replacement ref differs from previous | scope/view/context/marker ref转换 |
| `scope_ref` | owning `DiagnosticScope` relation | exact equality with loaded scope identity | broad projection-scope equality alone |
| `freshness` | summary factory/replacement | finite `Fresh/Partial/Stale/Unavailable` matrix | projection freshness、row version、request time |
| `staleness_reason` | accepted `as_stale` replacement | required only for `Stale` | error text、gap kind、marker ref |
| `unavailable_reason` | accepted `as_unavailable` replacement | required only for `Unavailable` | adapter exception、HTTP status、missing row |
| `safe_signal_refs` | complete loaded safe-signal set selected by scope | canonical；every ref is an exact scope target；Candidate/raw signal forbidden | current telemetry、raw log/metric/span、first page |
| `gap_refs` | complete selected gap revisions | canonical；ref set and loaded revisions are one-to-one；lifecycle retained | open-only filter that drops resolved/suppressed audit context |
| `no_write_violation_refs` | selected observation-owned violation revisions | canonical；every ref is exact scope target；explanatory only | attempted target、P10 decision、source write result |
| `as_of_cursor` | same committed diagnostic capture | non-empty committed inputs require a cursor；variant/namespace retained | row version、assembled/requested time |
| `assembled_at` | owning replacement flow boundary clock | non-regressing across accepted replacements；not freshness proof | source occurred time、current clock read in Query |

Summary 是 immutable revision。Step 06 明确：每次 accepted replacement 使用新的 `DiagnosticSummaryRef`，保留 `scope_ref`，旧 revision不被 Query覆盖；current-head pointer只能与完整 diagnostic composite在同一 UoW/CAS boundary更新。

### 6.3 `DiagnosticView` canonical schema

`DiagnosticView` 由 Step 06 `contracts::views` 唯一拥有。Q10 只消费其 canonical schema：

```rust
pub struct DiagnosticView {
    pub view_ref: DiagnosticViewRef,
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,
    pub scope: ObservationProjectionScope,
    pub diagnostic_summary_ref: DiagnosticSummaryRef,
    pub diagnostic_scope_ref: DiagnosticScopeRef,
    pub diagnostic_freshness: DiagnosticFreshnessState,
    pub staleness_reason: Option<StalenessReason>,
    pub unavailable_reason: Option<DiagnosticUnavailableReason>,
    pub freshness: ObservationProjectionFreshnessSurface,
    pub visibility: VisibilitySurface,
    pub gap_refs: GapStateRefSet,
    pub no_write_violation_refs: NoWriteViolationRefSet,
}
```

| view field | exact source | required relation | prohibited substitution |
|---|---|---|---|
| `view_ref` | first explain-only projection creation | stable across replacement；lookup index points to same ref | scope hash、summary ref、request context ref |
| `freshness_marker_ref` | first projection marker creation | stable across replacement；stale payload marker must equal it | row version、summary ref、progress ref |
| `scope` | committed lookup/body | exact requested projection scope and `DiagnosticScope.projection_scope` | request string、view ref反推 |
| `diagnostic_summary_ref` | current committed summary-head pointer | equals loaded summary identity | latest timestamp、highest ref、first row |
| `diagnostic_scope_ref` | committed scope relation | equals loaded scope and summary scope identities | projection scope broad equality |
| `diagnostic_freshness` | loaded summary | exact copy of summary state | projection freshness、availability、gap count |
| `staleness_reason` | loaded summary | exact copy；only `Stale` has value | marker/error text |
| `unavailable_reason` | loaded summary | exact copy；only `Unavailable` has value | dependency error/public availability |
| `freshness` | persisted projection marker/maintenance relation | independent from summary freshness；no Query promotion | summary freshness、request time、row version |
| `visibility` | committed diagnostic baseline + formal current read mapping | current outer response不能比 P11 decision更宽；parity owner仍 affected | row existence、summary state、actor role |
| `gap_refs` | loaded summary relation | exact equality with summary set；loaded gap revisions complete | current open gaps from another read |
| `no_write_violation_refs` | loaded summary relation | exact equality with summary set | P10 Blocked、attempted target或history scan |

`DiagnosticRequestContextRef` 故意不在 `DiagnosticView` 中。它不能持久化到 projection，不能由 response返回，也不能作为 bundle lookup identity。

### 6.4 Identity 分层与 replacement 矩阵

| identity | owner / mint | lifetime | replacement rule | Q10 use |
|---|---|---|---|---|
| `DiagnosticRequestContextRef` | trusted API/query entry | one request only | never reused as projection identity | P10/P11 correlation；not lookup/not response |
| `DiagnosticViewRef` | application id generator at first committed diagnostic projection | stable projection lifetime | preserve on every replacement | body identity and policy Object target after safe internal lookup |
| `DiagnosticScopeRef` | application id generator at first canonical diagnostic scope | stable scope lifetime | preserve across accepted target replacement | view/scope/summary relation proof |
| `DiagnosticSummaryRef` | application id generator per immutable summary revision | one revision | fresh ref for every accepted replacement | current head only；old revision not selected by Query |
| `ProjectionFreshnessMarkerRef` | application id generator at first projection marker | stable marker lifetime | preserve while marker payload/state changes | projection freshness parity |
| `RebuildProgressViewRef` | owning maintenance flow | one persisted progress projection | never generated by Query | optional Rebuilding relation only |

The sole public lookup is:

```text
(projection kind = DiagnosticView, canonical ObservationProjectionScope)
```

Neither `DiagnosticScopeRef` nor `DiagnosticSummaryRef` is a second public selector. Internal indexes may validate these refs, but Q10 cannot choose an old summary revision, a request context, or an arbitrary view ref from the request body.

## 7. Same-committed-boundary bundle 与 replacement 关系

### 7.1 Required diagnostic read bundle

Q10 的 normal/limited body必须由一个 committed boundary证明以下 relation同时成立：

```text
requested ObservationProjectionScope
  == DiagnosticView.scope
  == DiagnosticScope.projection_scope

DiagnosticView.diagnostic_scope_ref
  == DiagnosticScope.scope_ref
  == DiagnosticSummary.scope_ref

DiagnosticView.diagnostic_summary_ref
  == current DiagnosticSummary.summary_ref

DiagnosticView.{diagnostic_freshness, reasons, gap_refs, no_write_refs}
  == lossless fields from current DiagnosticSummary

DiagnosticView.freshness_marker_ref + freshness
  == persisted projection marker / existing rebuild relation
```

同一 bundle还必须包含或能在同一 read boundary验证：

- summary ref sets对应的完整 current object revisions，不能只验证 ref syntax；
- scope target set对每个 signal/gap/no-write ref的exact membership；
- summary `as_of_cursor` 与 committed projection/source position relation；
- current-head uniqueness，不能有两个同 scope current summary pointer；
- diagnostic lookup、view body、scope body、summary head和freshness row的原子可见性；
- existence-disclosure/absence proof和read-owner availability不能由另一次查询拼接。

跨 repository call、跨 transaction、跨 retry把 view、scope、summary、gap 或 marker拼在一起是 consistency defect。Query不得靠“最后读到的版本”、最大时间、最大 ref、第一条关系或最终覆盖值修复。

### 7.2 Atomic replacement contract

Step 07 writer boundary规定 diagnostic replacement在一个 composite version下：

1. 校验 source snapshot/fence、scope revision和namespace position。
2. 创建新的 immutable `DiagnosticSummaryRef` 与完整 summary revision。
3. 保持 `DiagnosticViewRef`、`DiagnosticScopeRef` 和 `ProjectionFreshnessMarkerRef` 不变。
4. 构造完整 `DiagnosticProjectionReplacement { view, scope, summary }`。
5. 在同一 UoW/CAS 中插入新 summary、切换 current-head pointer、替换 view/scope/dependency/lookup/freshness rows。
6. 任一关系、scope revision或expected version冲突时整批不提交，旧 bundle保持可读。

Q10 只读取 replacement提交后的一个完整版本。它不查看 staged replacement、不参与 CAS、不切换 summary pointer、不“帮助”补写缺失 relation。发现 view指向旧/不存在 summary、两个 current head、marker mismatch或partial replacement时，返回 typed consistency failure，不返回旧新混合 body。

### 7.3 Diagnostic state/reason matrix

| `DiagnosticFreshnessState` | required fields | body rule | invalid combinations |
|---|---|---|---|
| `Fresh` | stale/unavailable reason均None；无open blocking gap | projection freshness和P11/P13也允许时可normal Present | stale/unavailable reason、blocking gap、summary/view字段漂移 |
| `Partial` | reasons均None；必须有effective gap或formal limited degraded basis | 只能以explicit limited/degraded surface返回，不得标normal complete | 无gap/limited basis、normal body、被提升为Fresh |
| `Stale` | `staleness_reason=Some`；unavailable reason=None | AllowStale/BestEffort且P11/P13允许时可返回旧committed body | missing reason、同时unavailable reason、Query现场重算summary |
| `Unavailable` | `unavailable_reason=Some`；stale reason=None | 不得返回normal visible body；只有formal policy允许的limited diagnostic shell，或无body Unknown/error | missing reason、normal Present、从adapter异常临时改state |

Summary freshness 描述 diagnostic material本身；projection freshness描述这个 public projection相对 committed source position的状态。二者必须分别校验和返回，不能用一个状态覆盖另一个。

## 8. One-shot context、P10 与 P11 visibility

### 8.1 `DiagnosticRequestContext` assembly

对于 relation-valid committed bundle，application构造：

```rust
DiagnosticRequestContext::for_read(
    request_context_ref,
    input.context.actor_ref(),
    ReadPurpose::Diagnostic,
    input.scope,
    bundle.scope.scope_ref,
    input.visibility_scope_ref,
    input.requested_at,
) -> Result<DiagnosticRequestContext, DomainError>
```

实际函数名以 Step 06 canonical owner为准；本节固定字段映射，不创建第二 factory。必须满足：

- request projection scope、bundle view scope和diagnostic scope projection root完全相等；
- context diagnostic scope ref等于 bundle scope identity；
- actor来自 trusted Query metadata，不从 body、summary或scope加载；
- `ReadPurpose::Diagnostic`固定，不由caller free string提交；
- request context不保存、不序列化、不返回，Query结束后不作为 projection truth存活。

当 bundle不存在时，P11仍需在披露 existence前获得 formal target/visibility basis。Current point callable只返回 `None`，无法提供 hidden-safe scope anchor、diagnostic scope identity或definitive absence proof；Q10不能先返回NotFound再补visibility。这一缺口由 `S08-D-Q10-MISSING-PRESENCE-01` 和 `S08-D-Q10-VISIBILITY-SOURCE-01`共同承接。

### 8.2 P10 exact no-write target

对已安全内部定位的 view，P10 target必须保持完整 tagged identity：

```rust
NoWriteEvaluationTarget::Local {
    target_ref: NoWriteLocalTargetRef::Read {
        request_context_ref,
        target_ref: ReadEvaluationTargetRef::Object(
            ObservationObjectRef::DiagnosticView(view_ref),
        ),
    },
    local_effect: ObservationLocalEffect::ReadCommittedSurface,
}
```

P10 `AllowedObservationEffect(ReadCommittedSurface)`只证明该 exact operation没有越过 observation-side read boundary；它不授权 actor、不证明 target存在、不允许 source read、repair、rebuild或write。P10 `Blocked`是 expected result，Q10 fail closed且不创建 `NoWriteViolation`；local blocked没有合法 forbidden external target，不能伪造 violation ref。

对于 definitive absence/hidden-safe lookup，exact P10/P11 target如何在不暴露或伪造 `DiagnosticViewRef` 的情况下形成，current Step 06/07没有唯一 carrier。required repair必须提供 typed existence-disclosure target/anchor，或正式裁定该分支使用 canonical `ProjectionScope` target；不得由 Q10自行切换 target variant。这一问题登记在 Q10 visibility source affected中。

### 8.3 P11 complete input 与 visibility ceiling

P11 必须消费一个完整、one-shot、same-boundary `ReadVisibilityInputSnapshot`，至少绑定：

- exact `DiagnosticRequestContext`；
- exact P10 decision及其 trigger/target/effect/basis；
- current diagnostic view identity/head、projection freshness kind和source visibility baseline；
- complete gap revisions，包括 source visibility所引用的 constraint/gap/block provenance；
- request metadata中的 visibility scope，不得由 committed diagnostic scope的scope值替代；
- persisted baseline body visibility与当前 request visibility之间的 ceiling。

P11 只能保持或收窄 visibility：

| P11 result | Q10 response rule |
|---|---|
| `Visible` | 只有 bundle relation、freshness和P13均允许时返回 body |
| `Restricted` | 仅在 formal constraint和response-specific narrowing mapper证明字段安全时返回limited body；否则无body fail closed |
| `NotVisible` | `view=None`，不得披露 view/scope/summary refs、member count、gap set或existence |
| `Blocked` | `view=None`，保留typed block/gap provenance到允许的outer surface；不写read state/record |

`DiagnosticView.visibility` 是 committed view字段，而 shared `ObservationQueryResponse.visibility` 是本次 request的outer surface。Current Step 07没有明确二者在P11收窄时的唯一 mapper。Q10要求：outer response不得比P11更宽；若 inner view仍比outer更宽，不得原样返回 body，也不得用同一 `DiagnosticViewRef` 临时构造未经owner批准的另一持久化语义。exact response-only narrowing/parity方案由 `S08-D-Q10-VISIBILITY-SOURCE-01`承接。

## 9. 双 freshness、consistency hint 与 rebuild relation

### 9.1 两个 freshness owner 不得合并

Q10 同时返回/消费两种独立状态：

| axis | canonical owner | variants | exact meaning |
|---|---|---|---|
| diagnostic summary freshness | `DiagnosticSummary` / `DiagnosticFreshnessState` | `Fresh`、`Partial`、`Stale`、`Unavailable` | immutable diagnostic summary material本身的完整性/可用性 |
| projection freshness | `DiagnosticView.freshness` / `ObservationProjectionFreshnessSurface` | `Fresh`、`Stale { marker_ref }`、`Rebuilding { progress_ref }`、`Unknown` | public projection相对 committed source position的覆盖状态 |

组合裁定：

| summary state | projection state | maximum allowed interpretation before P11/P13 | forbidden upgrade |
|---|---|---|---|
| `Fresh` | `Fresh` | normal candidate；仍须 visibility、gap和availability通过 | 不能把candidate当业务/source truth完整 |
| `Partial` | any | limited/degraded或blocked；never normal | projection Fresh不能把summary Partial提升为Fresh |
| `Stale` | `Fresh` | diagnostic-stale committed body only when consistency/P11/P13允许 | projection Fresh不能清除summary stale reason |
| `Unavailable` | any | no normal body；policy允许时仅limited shell，否则Unknown/error | projection Fresh不能清除summary unavailable reason |
| any | `Stale` | projection-stale；marker parity必校验 | summary Fresh不能清除projection stale |
| any | `Rebuilding` | explicit rebuilding；existing progress relation必校验 | summary Fresh不能改写为normal Fresh或等待完成 |
| any | `Unknown` | explicit unknown/limited/blocked | “无错误”或request time不能证明Fresh |

若 summary 与 view的 state/reason字段不一致，或 stale marker payload与 `freshness_marker_ref`不一致，属于 committed relation corruption，不是可返回的“双状态差异”。

### 9.2 `ObservationConsistencyHint` matrix

Q10 只在已经提交的 bundle之间做安全 surface选择，不执行 freshness mutation：

| consistency hint | projection `Fresh` | projection `Stale` | projection `Rebuilding` | projection `Unknown` |
|---|---|---|---|---|
| `AllowStale` | summary state和P11/P13允许时返回 | 可返回旧committed body并保留exact marker；summary仍按自身state限制 | 仅在progress relation完整且policy允许时返回旧limited body；否则无body | 不伪造Fresh；返回explicit unknown/limited/error |
| `RequireFresh` | 仍要求summary `Fresh`且P11/P13 normal；`Partial/Stale/Unavailable`不满足fresh | 不返回stale normal body；不wait/refresh/rebuild | 不返回normal body；不wait/start/resume | 不返回normal body；不得用fallback store |
| `BestEffort` | 返回最安全的committed body | P11/P13允许时返回stale/limited并保留marker | relation完整时可返回明确rebuilding的limited body，否则无body | 返回explicit unknown/availability；不重读source补齐 |

`RequireFresh` 是 response选择约束，不是 control command。任何 hint 都不能调用 writer、current source reader、membership planner、maintenance job或external adapter。

### 9.3 Marker parity

Q10 必须逐项验证：

1. `DiagnosticView.freshness_marker_ref` 是 bundle的stable marker identity。
2. `Stale { marker_ref }` 的 payload必须等于该 identity。
3. `Fresh` 不携带 stale marker payload或progress ref。
4. `Rebuilding` 只携带 optional progress ref，不从它推导 marker identity。
5. `Unknown` 不携带 marker/progress payload，也不表示 marker row可随手创建。
6. marker、view、scope、summary head和source position必须在同一 committed boundary可见。

Current Query callable只返回 view，无法证明 marker row、summary head、gap revisions和as-of cursor属于同一 committed source；登记 `S08-D-Q10-DUAL-FRESHNESS-SOURCE-01`。

### 9.4 Rebuild progress relation

当 projection freshness 为 `Rebuilding { progress_ref: Some(P) }` 时，Q10 只能通过 least-authority read facet验证已有 relation：

```rust
ObservationProjectionQueryStore::get_rebuild_progress_by_ref(&P)
    -> Option<RebuildProgressView>
```

允许返回 rebuilding body前必须证明：

- returned progress identity exact equals `P`；
- progress target是一个 existing `MaintenanceTargetRef`，target kind/effect与 diagnostic view derived-projection rebuild兼容；
- target immutable `MaintenanceTargetScopeBinding`包含或解释 requested `ObservationProjectionScope`；
- progress/maintenance owner只绑定一个合法 current lifecycle，不存在multiple owner refs或cross-target mismatch；
- progress projection freshness与 diagnostic view marker relation不冲突；
- `Completed`只表示 captured derived target完成，不是 source repair、业务成功、验收或当前 diagnostic summary Fresh证明。

`Rebuilding { progress_ref: None }` 是合法 explicit surface，只表达 scheduled/queued或progress尚未形成。Q10不能从 maintenance target、scope、summary ref或job run mint `RebuildProgressViewRef`，也不能查询“最新 progress”替代缺失 ref。

Current query facet没有把 diagnostic bundle、progress、target binding和marker放入一个 committed read carrier；missing/mismatch不能触发 repair或第二次选择。登记 `S08-D-Q10-REBUILD-RELATION-01`。

## 10. P13 degraded mapping

### 10.1 Exact target/input

当 Q10 需要 limited或blocked degraded surface时，application必须构造完整 `DegradedOutputInputSnapshot`：

- affected object是 exact `ObservationObjectRef::DiagnosticView(view_ref)`；
- target visibility scope与 P11 complete decision逐字段一致；
- safety input必须是 compile-time target/dependency matrix允许的 explicit `DegradedSafetyInputSnapshot::NotApplicable`；不能用 `None`、默认Safe或“diagnostic不需要”字符串跳过验证；
- complete gap revisions必须与 summary `gap_refs`一一相等，保留 `Open/Acknowledged/Resolved/Suppressed`用于snapshot一致性；
- effective gap只从 current `Open/Acknowledged` revisions按P13固定安全优先级选择；
- P11 `Blocked`时 `visibility_block_reason`逐字段相等，非Blocked时必须None；
- decision target、P11 input/basis、gap revisions和summary head均来自本次 same-boundary bundle。

### 10.2 Q10 result mapping

| P13 outcome | Q10 behavior | durable side effect |
|---|---|---|
| `Normal` | 仍需 summary/projection Fresh、P11 Visible和availability允许，才可normal Present | none |
| `Limited` | outer response带exact `DegradedSurface`；body只按formal diagnostic narrowing规则返回 | none；不mint/replace `DegradedOutputRef` |
| `Blocked` | no normal body；返回typed blocked/degraded surface | none；不创建gap、violation、H8或outbox |
| evaluation error | typed relation/policy/consistency error；no partial body | none |

同步 Q10 禁止调用 `DegradedOutputState::create_from_decision` 或 `replace_from_decision`。它不能从 `DiagnosticFreshnessState`、gap count、visibility enum、`ApplicationError`文本或adapter diagnostic直接合成 degraded。Current Step 07没有 Q10 专属 P13 input mapper和response-only narrowing owner，登记 `S08-D-Q10-DEGRADED-SOURCE-01`。

## 11. Availability、presence 与 public body matrix

### 11.1 Availability source

`ObservationAvailabilitySurface` 必须来自有限 typed source；对Q10至少需要区分 local projection read owner、policy registry/material和已有 progress relation read。Current material没有规定这些内部read dependency如何无损映射到 public `AdapterFamily`，不能任取第一个失败依赖。

| source condition | allowed public result | forbidden fallback |
|---|---|---|
| 所有required read owner可用，bundle及policy input通过一致性校验 | `Available` | 不代表source truth完整、业务成功或summary Fresh |
| read owner formal degraded且policy允许旧/limited committed body | `Degraded { adapter_family }` | 不把任意stale/Partial默认当degraded success |
| required read owner unavailable | `Unavailable { adapter_family }` 或 typed application error | 不切换in-memory/fallback store，不映射Missing |
| required capability disabled/misconfigured | `Disabled { adapter_family }` 或 typed startup/runtime error | 不在Query激活adapter、重载config或读取credential |
| repository/bundle返回未分类consistency failure | `Failed { adapter_family }` 或 typed consistency error | 不从exception/SQL/provider code猜family或reason |

Public surface不得包含 adapter instance、endpoint、credential、provider code/message、SQL、repository version或runtime issue body。Exact multi-dependency precedence和local-store family mapping登记 `S08-D-Q10-AVAILABILITY-SOURCE-01`。

### 11.2 Presence and absence

Q10 是 point Query；`ObservationQueryPresence::Empty` 永远非法。

| condition | required presence | view/missing rule |
|---|---|---|
| relation-valid、可见且policy允许的 committed diagnostic bundle | `Present` | `view=Some`、`missing=None`；不证明source truth完整 |
| bundle存在但 summary集合没有可公开 explanation member | `Present` | 仍是已存在point view；不能改成Empty或Missing |
| committed canonical lookup明确不存在，且existence可披露 | `Missing` | `view=None`；只使用有typed proof的missing variant |
| source/projection anchor明确存在但view尚未形成 | `Missing(NotYetProjected)` | 必须有same-boundary anchor/reservation proof；不能由`None`猜测 |
| current retention marker明确证明scope已超出可读窗口 | `Missing(OutsideRetainedObservationWindow)` | 必须有typed retention relation；不能从DiagnosticTimeWindow推导 |
| reference state明确不可解析且是该scope的formal basis | `Missing(SourceReferenceUnavailable)` | 必须有typed reference relation；repository timeout不适用 |
| hidden、无法安全披露existence | `Unknown`或NotVisible surface | `view=None`、`missing=None`；不泄露view/scope/summary/member refs |
| dependency unavailable、bundle corrupt、absence不能证明 | `Unknown`或typed error | `view=None`、`missing=None`；不fallback NotFound |

Current `Option<DiagnosticView>`没有 anchor、absence、visibility provenance或availability distinction。因此 `None` 不能单独形成 `NotFound/NotYetProjected/OutsideRetainedObservationWindow/SourceReferenceUnavailable`；登记 `S08-D-Q10-MISSING-PRESENCE-01`。

### 11.3 Body presence ceiling

| diagnostic/projection condition | body ceiling |
|---|---|
| summary Fresh + projection Fresh + P11 Visible + P13 Normal + Available | normal `Present(Some(view))` candidate |
| summary Partial | only formal limited body；otherwise no body |
| summary Stale or projection Stale | only consistency hint + P11/P13允许的old committed body |
| summary Unavailable | no normal body；only formal limited shell or no body |
| projection Rebuilding | only relation-valid explicit rebuilding limited body；otherwise no body |
| projection Unknown | no normal Fresh body |
| P11 Restricted | only response-specific safe narrowing；exact mapper未闭合时 no body |
| P11 NotVisible/Blocked | no body |
| availability Unavailable/Disabled/Failed | no body unless a formally classified Degraded path explicitly allows committed limited material；never default |
| relation corruption | no body；typed consistency failure |

## 12. Error precedence、response invariant 与 zero-write

### 12.1 Finite error/surface precedence

Repository call order不得决定 public result。Q10 的 exact mapper必须先建立material classification，再按以下有限优先级组装：

| priority | condition | required mapping | body / side effect |
|---:|---|---|---|
| 1 | query name/schema/body type、scope variant、metadata或one-shot context carrier非法 | `InvalidRequest`、invalid reference或typed protocol error | no repository write；no partial view |
| 2 | public body携带 request-context、summary/view ref、target set、page或control intent | typed invalid request | reject before lookup/digest side effect；no compatibility mode |
| 3 | request context、projection scope、diagnostic scope或visibility scope关系无法建立 | typed relation/input error | 不查source补值；不保存context |
| 4 | existence disclosure所需 visibility basis不可建立 | NotVisible/Unknown或typed visibility error | 不披露scope/view/summary/member existence |
| 5 | P10/P11 target、basis、constraint/gap provenance不一致 | typed policy/relation/consistency error | no body；no read state/H7/violation |
| 6 | required projection/policy/progress read owner unavailable/disabled/failed | finite availability surface或typed application error | no fallback store；not Missing |
| 7 | bundle存在但 view/scope/current summary head/marker/member/cursor不一致 | typed projection consistency error | no old/new mix、no partial body、no repair |
| 8 | point lookup absent且没有 definitive typed absence proof | `Unknown`/availability surface | no `NotFound`、`NotYetProjected`、synthetic view/ref |
| 9 | definitive local absence且存在性可披露 | `Missing` + exact `ObservationMissingSurface` | no body、no new identity、no rebuild |
| 10 | summary/projection stale、partial、unavailable、rebuilding或unknown | exact dual freshness + consistency/P11/P13-limited surface | no promotion、wait、refresh或rebuild |
| 11 | progress/target/scope binding不一致 | typed consistency error | no second progress lookup by target/latest |
| 12 | P13 target/safety/gap/decision input不完整 | typed degraded/policy/consistency error | no durable degraded revision |
| 13 | relation-valid visible bundle且所有ceiling通过 | `Present` with `Some(DiagnosticView)` | no UoW、audit、outbox或control action |

Expected `NotVisible`、`Restricted`、`Stale`、`Partial`、`Rebuilding`、`Missing` 和 P13 `Limited/Blocked`不应全部被提升为generic error。真正的 protocol/application/relation failure才进入 `ObservationProtocolErrorSurface`，且不得泄露 `Debug/Display` 文本。

### 12.2 `ObservationQueryResponse<DiagnosticView>` invariants

Q10 exact response assembler和 `ObservationQueryResponse::try_new` 必须至少验证：

- `query_name == ObservationQueryName::GetDiagnosticView`，view type与operation静态绑定；
- point Q10禁止 `presence=Empty`；
- `Present` 必须 `view=Some`、`missing=None`，body被outer visibility允许，availability为Available或formal Degraded；
- `Missing` 必须 `view=None`、`missing=Some`、error=None，不能掩盖NotVisible/Failed；
- `Unknown` 通常 `view=None`；只有formal P11/P13与response narrowing owner允许时才可limited `Some`；
- view `scope`、scope ref、summary ref、summary fields、marker、gap/no-write sets在bundle内exact一致；
- summary `Unavailable`不得配normal visible body；`Partial`必须有limited degraded basis；
- projection `Stale` marker与view marker一致；`Rebuilding` progress relation通过且 `rebuild` surface一致；
- outer visibility不得比P11 decision宽；inner persisted visibility不能被entry临时改写；
- `degraded`只来自完整P13 decision；availability只来自typed mapper；
- error不能与“看起来成功”的normal body组合，也不能把corrupt bundle降级成partial body；
- no public field包含 raw telemetry/audit/evidence/report body、constraint body、policy basis、repository version、SQL、provider detail、credential、endpoint、real run id或signoff。

Current `ObservationQueryResult<T> -> ObservationQueryResponse<T>` shared mapper没有Q10的双freshness、inner/outer visibility、summary-unavailable和multi-dependency precedence。登记 `S08-D-Q10-SURFACE-MAPPER-01`，并复用 shared `S08-D-QUERY-SURFACE-MAPPER-01`。

### 12.3 Zero-write matrix

Q10 每次调用都必须满足：

| candidate side effect | ruling |
|---|---|
| begin/create UoW、assign committed cursor | forbidden |
| load `Versioned<DiagnosticProjectionSnapshot>` through full store | forbidden；Query只取得least-authority read carrier |
| call `replace_diagnostic_view`、replace summary pointer/scope/marker | forbidden |
| mint view/scope/summary/marker/progress/gap/degraded/history/outbox identity | forbidden |
| call `DiagnosticScope::replace_targets` or any summary replacement factory | forbidden |
| call source reader、membership planner、resolver writer、external adapter | forbidden |
| call P17/P18、schedule/start/resume/complete rebuild | forbidden |
| wait for fresh、refresh、repair index、retry another store | forbidden |
| call `ReadVisibilityState::from_decision/apply_decision` | phase-reserved；current synchronous Query forbidden |
| persist `DiagnosticRequestContext` or append H7 `ReadAccessRecord` | forbidden |
| call `DegradedOutputState::create_from_decision/replace_from_decision` | mutating flow only；Q10 forbidden |
| open/acknowledge/resolve/suppress gap or create no-write violation | forbidden |
| reserve idempotency、stored result、duplicate replay | forbidden；Query digest only protects input integrity |
| write source/business truth or claim external/report/acceptance truth | forbidden |

Repeated identical Q10 requests是普通read repeat，不是Command idempotency replay。任何错误都保持所有 loaded object、projection、summary head、marker、gap、maintenance和external system逐字段不变。

## 13. Field / owner / affected closure table

| closure item | current owner / callable | Q10 conclusion |
|---|---|---|
| public request | R06.8-A use-site + S08-B shared Query wrapper | target body=`scope` only；standalone declaration与non-body request-context carrier仍affected |
| application input | `application::inputs::GetDiagnosticViewInput` | shared Query fields已知；request-context source/position冲突affected |
| exact API assembly | `ObservationApiInputAssembler::get_diagnostic_view` | callable recorded；one-shot carrier propagation affected |
| Read façade | `ObservationReadService::get_diagnostic_view` | exact point return recorded |
| projection scope | `contracts::scopes::ObservationProjectionScope` | unique public lookup selector；no second selector |
| diagnostic scope | Step 06 `DiagnosticScope` | fields/factory/stable identity consumed；Query cannot replace |
| diagnostic summary | Step 06 `DiagnosticSummary` | immutable current revision consumed；new ref per replacement |
| diagnostic view | Step 06 `contracts::views::DiagnosticView` | canonical fields/factory consumed；no second owner |
| identity refs | Step 06 `contracts::refs` | request/view/scope/summary/marker/progress layers separated |
| current Query repository | `ObservationProjectionQueryStore::get_diagnostic_view` | least-authority but only returns `Option<DiagnosticView>`；insufficient composite proof |
| writer composite | `DiagnosticProjectionSnapshot` + full `ObservationProjectionStore` | proves atomic replacement design only；not Query capability |
| replacement | `replace_diagnostic_view` | view/scope/marker stable，summary new ref，same-UoW/CAS atomic；Query no-call |
| P10 | `NoWriteGuardPolicy` / `NoWriteGuardDecision` | exact read target known for existing view；absence target mapping affected |
| P11 | `ReadVisibilityPolicy` / `ReadVisibilityDecision` | complete one-shot owner exists；Q10 provenance/narrowing source affected |
| P13 | `DegradedOutputPolicy` / `DegradedOutputDecision` | target/input rules known；Q10 mapper affected |
| dual freshness | `DiagnosticFreshnessState` + `ObservationProjectionFreshnessSurface` | owner/variants closed；same-boundary source and consistency mapping affected |
| presence | shared Query carrier + operation-specific absence proof | point rules fixed；typed absence source affected |
| availability | `ObservationAvailabilitySurface` + application runtime classifications | finite surface exists；Q10 dependency mapping affected |
| public response | `ObservationQueryResult<DiagnosticView>` -> `ObservationQueryResponse<DiagnosticView>` | target shape fixed；exact Q10 mapper affected |
| Step 09 handoff | `GetDiagnosticViewFlow` | reserved only；no function flow body in this batch |

## 14. Q10 affected register

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q10-REQUEST-SCHEMA-01` | `open_upstream_internal` | `GetDiagnosticViewRequest`只有R06.8-A/Step07 use-site，缺独立public declaration、wire schema、sealed query binding和decoder owner | Step06/07选定唯一contracts request owner，body只含canonical `scope`，传播exact logical binding | Step08创建canonical DTO/alias、从route猜operation、加入summary/view/request-context selector |
| `S08-D-Q10-REQUEST-CONTEXT-CARRIER-01` | `open_upstream_internal` | ref card规定`DiagnosticRequestContextRef`由API/query entry为单次请求生成，R06.8-A却把它列为operation body field；shared metadata和assembler signature没有non-body carrier位置 | 明确可信entry生成接口、carrier位置、digest排除/包含规则、assembler source和input field；caller不能提交identity | body field、用query digest/trace/request time转ref、application id generator临时mint、复用scope/view/summary ref |
| `S08-D-Q10-DIAGNOSTIC-READ-CARRIER-01` | `open_internal_affected` | Query facet只返回`Option<DiagnosticView>`，无法证明view/scope/current summary head/member revisions/marker/cursor/visibility/absence来自同一committed boundary | Step07增加least-authority Query-safe composite carrier/callable，保留bounded typed relation、atomic visibility和failure totality，不暴露version/writer | 调用full store、跨调用拼装、使用writer `Versioned` carrier、默认多次read一致、partial body |
| `S08-D-Q10-SUMMARY-HEAD-RELATION-01` | `open_internal_affected` | writer replacement有atomic composite contract，但Query read面没有current-head uniqueness、view pointer与immutable summary revision parity proof | 在read carrier/adapter rehydrate中闭合single current head、summary ref/scope/set/reason/cursor parity和partial replacement detection | 按latest time/max ref/first row选summary、旧新字段混合、dangling pointer fallback旧summary |
| `S08-D-Q10-MISSING-PRESENCE-01` | `open_internal_affected` | `Option<DiagnosticView>`不能区分visible local absence、hidden、not-yet-projected、retained-window exclusion、reference unavailable、corrupt和dependency unavailable | 提供typed committed absence/anchor/retention/reference proof，并固定visibility-before-existence precedence | `None -> NotFound/NotYetProjected/Empty`、合成view/scope/summary ref、触发rebuild |
| `S08-D-Q10-VISIBILITY-SOURCE-01` | `open_internal_affected` | Q10缺P10/P11 exact absence/existing target mapper、one-shot complete provenance和inner persisted visibility到outer request visibility的safe narrowing owner | 提供Q10专属visibility input/source与response-only narrowing/parity规则，绑定request context、metadata scope、P10、bundle head、constraint/gap/block provenance | 从row existence、summary state/count、scope kind、actor role、HTTP status猜visibility；entry改写persisted view |
| `S08-D-Q10-DUAL-FRESHNESS-SOURCE-01` | `open_internal_affected` | summary freshness与projection freshness owner存在，但缺覆盖view/scope/current summary/marker/gaps/as-of cursor的共同committed source和hint mapping | 定义Q10 dual-freshness composite source、marker parity及3x4 consistency matrix，保证两轴不互相升级 | row version/requested_at/assembled_at当Fresh、summary Fresh覆盖projection stale、projection Fresh覆盖Partial/Unavailable |
| `S08-D-Q10-REBUILD-RELATION-01` | `open_internal_affected` | Rebuilding progress ref到progress view、maintenance target、immutable scope binding、lifecycle和diagnostic marker缺一个Query-safe relation proof | 在least-authority read carrier中闭合progress-by-ref、target/effect/scope-member、None语义与mismatch precedence | mint progress ref、按target/latest选择progress、等待/启动/推进rebuild、Completed当source repair/summary Fresh |
| `S08-D-Q10-DEGRADED-SOURCE-01` | `open_internal_affected` | P13需要exact DiagnosticView target、P11 decision、explicit NotApplicable safety和complete current gap revisions；Q10无唯一input/narrowing mapper | 提供Q10 P13 input mapper与response-only limited/blocked projection，保留target/basis/gap parity | 从freshness/state/gap count/visibility enum/error文本合成degraded，创建durable sidecar |
| `S08-D-Q10-AVAILABILITY-SOURCE-01` | `open_internal_affected` | local projection、policy material和progress relation failure到public availability/AdapterFamily/error的有限multi-dependency mapping未唯一绑定 | 定义Q10 read dependency snapshot、local adapter-family mapping和precedence；保持provider/credential/SQL redaction | 默认Available、first failure wins、fallback store、timeout当Missing、泄露provider detail |
| `S08-D-Q10-SURFACE-MAPPER-01` | `open_internal_affected` | invalid/hidden/missing/corrupt/summary Partial-Stale-Unavailable/projection Stale-Rebuilding-Unknown/degraded/availability/error的最终precedence和body matrix未由Step07唯一绑定 | 提供finite Q10 result summary/response assembler；只lossless复制complete material和P10/P11/P13 decisions | first exception、`None`、state名称、empty set、HTTP status决定surface；返回partial/corrupt body |

Q10 复用但不关闭：

- `S08-D-QUERY-SURFACE-MAPPER-01`：shared Query result-to-response mapping仍需跨Query总审计。
- `R06.6-F2-H13-UPSTREAM`：与Q10读取语义无直接关系，继续 `open_controlled`。

本批新增 11 项 Q10 affected。它们均为 L4-observability current design的upstream-internal/internal closure gap，不是新的外部上游 blocker。

## 15. Step 09 handoff（仅登记）

`GetDiagnosticViewFlow` 是 Q10 唯一后续 flow 名称。Step 09 必须消费本文件的 scope-only point request、one-shot context、same-boundary bundle、dual freshness、visibility/degraded和zero-write裁定：

```text
GetDiagnosticViewRequest(scope)
  -> exact query/body/metadata/non-body request-context validation
  -> GetDiagnosticViewInput assembly
  -> load one Query-safe committed diagnostic bundle by (DiagnosticView, scope)
  -> validate view/scope/current-summary-head/member/marker/cursor relations
  -> build one-shot DiagnosticRequestContext(ReadPurpose::Diagnostic)
  -> P10 exact ReadCommittedSurface decision
  -> P11 complete visibility decision and body ceiling
  -> validate summary freshness + projection freshness independently
  -> resolve existing progress/target/scope-binding only for persisted Rebuilding ref
  -> optional P13 decision from exact target + explicit safety + complete gaps
  -> map Present/Missing/Unknown, dual freshness, rebuild, availability and error
  -> ObservationQueryResult<DiagnosticView>
  -> ObservationQueryResponse<DiagnosticView>
```

Step 09 不得添加：

- public request中的 request-context、summary/view ref、target list、page、cursor或control action；
- full projection store、UoW、version/CAS、source capture、membership planner或replacement writer；
- current source/raw telemetry/evidence/report lookup来补summary；
- summary/view/scope/marker replacement、gap/degraded/read-audit/outbox写入；
- synchronous refresh/rebuild/replay/repair、wait-for-fresh、fallback store或external adapter；
- 从`None`、empty member set、summary state、progress Completed或availability推导业务/source/验收 truth。

## 16. Q10 stop review

| 检查项 | 结论 |
|---|---|
| 是否形成独立 request/input/view/source/read-chain/identity/replacement/presence/freshness/error/no-write/handoff记录 | `pass_with_affected_open` |
| request是否固定为一个canonical `scope`且不接受request context/view/summary selector | target contract是；public owner和one-shot carrier受两项upstream affected约束 |
| exact assembler、Read façade和least-authority query facet是否记录 | pass；current callable不足已登记，不调用full store |
| `DiagnosticView`、scope、summary/ref owner是否被Step08重复声明 | no；全部回指Step06唯一owner |
| request/view/scope/summary/marker/progress identity是否分层 | pass_design_record；生成与replacement规则逐项记录 |
| current summary head、member revision、marker和cursor是否已有same-boundary Query proof | no；read-carrier和summary-head affected开放 |
| `None`是否被默认映射为Missing/NotYetProjected/Empty | no；typed absence proof affected开放 |
| committed inner visibility与request outer visibility是否混同 | no；ceiling/narrowing规则已定义，exact owner仍affected |
| summary freshness与projection freshness是否合并或互相升级 | no；双轴矩阵已定义，common source仍affected |
| Rebuilding是否会生成/选择/推进progress | no；只验证persisted ref relation，exact carrier仍affected |
| P13是否从state/error/gap count合成，或创建durable revision | no；exact mapper affected，Query zero-write |
| availability是否默认Available、first-error-wins或fallback | no；finite target rule已定义，exact mapper affected |
| Query是否拥有source/business/evidence/report/acceptance truth | no；只读observation-owned explain projection，不反写任何业务truth |
| Q10十一项affected是否全部登记 | pass |
| 是否发现新的外部上游 blocker | no；已知`R06.6-F2-H13-UPSTREAM=open_controlled`与Q10无直接关系 |
| 当前协议计数 | `26/60 defined_with_affected_open`；Query `10/14`；`0/60`无条件 complete |
| 下一动作 | 停审并等待用户明确确认；确认后只读取Q11所需Step06/07 owner，不读取Q12-Q14或其他协议族 |
| 当前提交 | 不需要；用户未要求提交 |

## 17. 恢复点

```text
Step08_S08-D_Q10_defined_with_affected_open_waiting_user_before_Q11
```

本文件是 design-only 中间产物。正式 `03-详细设计.md` 继续冻结，Q11-Q14、S08-E~G、Step 09~19、`04`及实现代码继续禁止读取或写入，直到用户明确确认。所有实现验证仍为 `planned/not_run`；本批没有真实 commit、run_id、evidence alias、验收签署或测试结果。
