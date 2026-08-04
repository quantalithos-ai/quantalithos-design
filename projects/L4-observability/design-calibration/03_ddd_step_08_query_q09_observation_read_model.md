# L4-observability 详细设计 Step 08

## S08-D Query Q09 `GetObservationReadModel`

> 本文件是 Q09 的独立讨论中间产物。它只覆盖 `GetObservationReadModel`，不关闭 Q10-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q09 |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q10` |
| 逻辑协议 | `Query / GetObservationReadModel / GetObservationReadModelRequest` |
| 后续处理流 | `GetObservationReadModelFlow`；这里只登记 handoff，不展开 Step 09 |
| 当前协议计数 | `25/60 defined_with_affected_open`；`0/60` 无条件完成 |
| Query 计数 | `9/14 defined_with_affected_open`；Q10-Q14 待逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 冻结，不回填 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q10 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

### 1.1 本批禁止事项

- 不读取或写入 Q10-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 临时声明新的 `ObservationReadModel`、`ObservationProjectionScope`、`ObservationReadModelRef` 或 `ProjectionFreshnessMarkerRef` owner。
- 不把 R06.8-A 的可选 `page` 字段悄然保留为 Q09 public selector；不把 `page_observation_read_models` 当作 point Query 的替代实现。
- 不创建 read model、freshness marker、maintenance target、rebuild progress、gap、degraded revision 或 read-audit record。
- 不从 scope 的序列化、hash、request digest、page cursor、row version、requested time 或 view 字段派生新的 view identity。
- 不把 projection 缺失默认映射为 `NotYetProjected`、`NotFound`、`Empty` 或 `ObservationReadModel::empty()`。
- 不等待、刷新、标 stale、启动、恢复或推进 rebuild；不调用 projection writer、source reader、membership planner、UoW 或完整 `ObservationProjectionStore`。
- 不读取 raw log、metric、trace、audit body、evidence body、source body、provider body、endpoint、credential、真实 run id、evidence alias 或业务 truth。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `详细设计讨论流程_SOP.md` Step 08 | Query 独立协议、view/page/marker、empty/not-visible/degraded/error/no-write 和停审要求 |
| `详细设计书写规范.md` 5.6/5.7 | public DTO、二级类型、字段来源、repository page 映射和协议粒度 |
| `设计真相源闭环与可落码性标准.md` | 唯一 lookup key、stable identity、composite read、P10/P11/P13、no-write 和 owner 闭环 |
| `03_ddd_step_06_application_input_assembly_r06_8a.md` | Q09 application input use-site、四个 Query control fields 和 `ObservationPublicPageRequest` 冲突 |
| `03_ddd_step_06_boundary_read_maintenance.md` | `ObservationReadModel`、`ObservationRebuildSurface`、`RebuildProgressView`、maintenance state 语义 |
| `03_ddd_step_06_domain_truth_signal_audit.md` | `ObservationProjectionFreshnessSurface` 的四个 public variant |
| `03_ddd_step_06_contracts_carriers.md` | `ObservationProjectionScope`、stable ref、consistency hint 和 canonical scope key |
| `03_ddd_step_06_policy_guard_records.md` | P10/P11/P13 的完整 one-shot input、decision provenance 和同步 Query zero-write 链 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | exact assembler、Read façade、least-authority query store、point/page callable 和 projection maintenance binding |
| current `02-概要设计.md` / HLD Step 07 | 只确认 Q09 的历史 capability skeleton 和 read-model boundary，不覆盖 current exact owner |
| Q08 current 独立产物 | 只消费单协议停审、surface precedence 和 affected register 的结构，不复用 retention schema |

### 2.2 权威顺序

```text
current Step 08 Q09 authority / affected register
  > Step 07 exact assembler, Read façade and least-authority query facet
  > Step 06 ObservationReadModel / scope / freshness / policy contracts
  > current formal 02 / HLD Query skeleton
  > frozen Step 09 and old formal 03
```

### 2.3 Historical material 裁定

| material | current disposition |
|---|---|
| HLD `read scope + filters + page` | `historical_material`；current canonical selector只有 `ObservationProjectionScope`，没有独立 filter owner；page 不能改变唯一 scope lookup 语义 |
| R06.8-A `GetObservationReadModelInput { scope, page: Option<...> }` | current application use-site，但与 point Read façade 发生 cardinality 冲突；page 字段不能被 Q09 自行解释，登记 Q09 point/page affected |
| Step 07 `page_observation_read_models(scope, page)` | current read-facet callable，但不是 Q09 point contract 的证明；其用途、public operation 归属和 same-snapshot carrier 未闭合，登记 affected |
| `ObservationReadModel` canonical view | current Step 06 owner；不重复声明，不把它改成 page wrapper 或 domain object |
| `ObservationProjectionFreshnessSurface::Rebuilding` | current contracts surface；`progress_ref=None` 是合法的 queued/unknown-progress表达，不得由 Q09 生成 progress ref |
| 旧 Step 09 中的“missing -> rebuild / empty -> success”简化路径 | `historical_material`；current Query 只读并 fail closed，不自动修复或把 absence 当作业务结论 |

## 3. SOP 问题回答

| # | 问题 | Q09 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetObservationReadModel` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> projection query facet |
| 3 | 调用方与处理方 | exact API handler 调用 `ObservationApiInputAssembler::get_observation_read_model`，再调用 `ObservationReadService::get_observation_read_model` |
| 4 | 传输方式 | 固定 typed logical binding；endpoint、credential 和产品 locator 后置，不进入 DTO |
| 5 | request schema | Q09 public body 只接受一个 `scope: ObservationProjectionScope`；独立 request declaration 仍由 upstream owner 承接 |
| 6 | response schema | non-paged `ObservationQueryResponse<ObservationReadModel>`；point Query 禁止 `Empty` |
| 7 | 读取目标 | 由唯一 `(projection kind, ObservationProjectionScope)` 定位的已提交 observation-side read model |
| 8 | truth 边界 | 只表达 receipt/signal/audit projection 的本地观测投影；不拥有 source、业务、raw telemetry、audit source 或 evidence truth |
| 9 | page 语义 | Q09 不分页；R06.8-A page use-site 与 Step 07 page callable 必须由 upstream 重新分配给具名 list protocol，不能由 Q09 双承载 |
| 10 | view identity | `read_model_ref` 与 `freshness_marker_ref` 首次创建时生成，replacement 保持稳定；scope 不 mint identity |
| 11 | member consistency | 三个成员集合必须来自同一 committed projection snapshot，canonical、bounded、cross-scope 成员拒绝 |
| 12 | missing semantics | `None` 不能单独证明 `NotFound` 或 `NotYetProjected`；必须有 typed absence proof，隐藏或依赖不可用时不得披露存在性 |
| 13 | visibility | metadata scope + exact P10/P11 one-shot decision；不从 row existence、scope kind、member count 或 freshness 猜 visibility |
| 14 | freshness | 只复制 persisted `ObservationProjectionFreshnessSurface`；不从 row version、requested time、state 或 page cursor 伪造 Fresh |
| 15 | rebuilding | 只校验已有 `progress_ref -> RebuildProgressView -> MaintenanceTarget` 链；不启动、等待、恢复或推进 rebuild |
| 16 | degraded | P13 必须消费完整 P11 decision、explicit safety input 和 current gap revisions；不能从 public visibility 或 error 文本合成 degraded |
| 17 | availability | 所需 read owner 的 typed availability/失败分类必须明确；不得默认 `Available` 或以 fallback store 替代 |
| 18 | actor authority | actor 只来自 `ObservationQueryMetadata`；body 不接受 actor、policy outcome、cursor 或 rebuild intent |
| 19 | no-write | 不创建 UoW、reservation、stored result、outbox、H7/read audit、gap/degraded revision 或 maintenance task |
| 20 | Step 09 回指 | 只保留 `GetObservationReadModelFlow` handoff；本批不写函数级 flow |
| 21 | 停审标准 | 独立记录 request/view/field source/read facet/presence/visibility/freshness/rebuild/degraded/error/no-write/affected 和恢复点后停审 |

## 4. Exact callable 与入口契约

### 4.1 API assembler 与 Read façade

```rust
ObservationApiInputAssembler::get_observation_read_model(
    ObservationQueryRequest<GetObservationReadModelRequest>
) -> Result<GetObservationReadModelInput, ApplicationError>
```

```rust
ObservationReadService::get_observation_read_model(
    GetObservationReadModelInput
) -> ApplicationServiceFuture<
    '_,
    ObservationQueryResult<ObservationReadModel>
>
```

上面两个签名是 Step 06/07 已有的 exact use-site。`GetObservationReadModelInput` 的 application owner 和四个 Query control fields 复用 R06.8-A；Q09 不创建第二个 input carrier，也不把 public request 直接传给 repository。

### 4.2 Q09 public request target schema

Q09 的目标 request schema 为：

```rust
/// Selects one canonical observation projection scope.
pub struct GetObservationReadModelRequest {
    pub scope: ObservationProjectionScope,
}
```

这段代码是 Q09 目标契约，不宣称本文件成为 canonical Rust declaration owner。request 不增加：

- `page`、cursor、filter、member kind、receipt/signal/audit ref 集合或 arbitrary predicate；
- actor、visibility scope、consistency、requested time、trace 或 policy decision；这些来自 `ObservationQueryMetadata` 或 application input control fields；
- `read_model_ref`、`freshness_marker_ref`、`progress_ref`、maintenance state 或 rebuild intent；这些只能由 committed lookup 返回；
- raw log/metric/trace/audit body、source locator、endpoint、credential、provider result、report/evidence body 或真实 run id。

### 4.3 Input field boundary

Q09 application input 的逻辑字段为：

```rust
GetObservationReadModelInput {
    scope: ObservationProjectionScope,
    context: ObservationOperationContext,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
}
```

实际字段仍由 R06.8-A 的 private-field concrete input 承载。`context` 必须是 Query context：无 idempotency key、无 inbound event identity、无 writer capability。`requested_at` 只作 trusted metadata，不进入 lookup key、freshness marker 或 view identity。

### 4.4 Point/page cardinality ruling

Q09 的 response façade 是单体 `ObservationQueryResult<ObservationReadModel>`，且 `ObservationProjectionScope` 已定义为 unique lookup key。因此本批裁定：

1. Q09 public request 是 point request，body 只有 `scope`。
2. Q09 public response 映射为 `ObservationQueryResponse<ObservationReadModel>`；`ObservationQueryPresence::Empty` 对 Q09 非法。
3. `page_observation_read_models(scope, page)` 不能被 Q09 调用来“分页读取一个唯一 view”，也不能把第一项当作 point result。
4. R06.8-A 的 `page: Option<ObservationPublicPageRequest>` 不能被 assembler 静默丢弃或解释为可选 list mode；它与 current façade 的 cardinality 冲突必须由 Step 06/07 修订。
5. 如果未来需要 scope 下的多个 member view，必须先定义新的具名 Query、request、application page carrier、response view 和 lookup semantics；不得在 Q09 中添加 `scope + page` 双模式。

登记：`S08-D-Q09-REQUEST-SCHEMA-01`、`S08-D-Q09-POINT-PAGE-CONFLICT-01`，并复用 shared `S08-D-PAGE-REQUEST-TYPE-01` 与 `S08-D-PAGED-RESULT-CARRIER-01`。

## 5. Scope、identity 与 view schema

### 5.1 `ObservationProjectionScope` lookup authority

current canonical scope 为：

```rust
pub enum ObservationProjectionScope {
    ByObservation(ObservationReceiptRef),
    ByCorrelation(CorrelationContextRef),
    ByAuditSubject(AuditSubjectRef),
    ByReportHandoff(ReportHandoffRecordRef),
    ByMaintenanceTarget(MaintenanceTargetRef),
}
```

`(projection kind, scope)` 是唯一 lookup key。Q09 必须使用 Step 06 已闭合的 explicit variant 和 `canonical_lookup_bytes()` 语义：

- 不能把 scope 序列化后 hash 成 `read_model_ref`；
- 不能把 scope 的完整 request digest 当作 repository key；
- `ByMaintenanceTarget` 的 lookup identity 使用 typed target identity，不能随 maintenance state、progress、job run 或 current config 改变；
- scope 不能直接转换成 `ObservationReadModelRef` 或 `ProjectionFreshnessMarkerRef`；两者由首次 committed projection 创建生成；
- foreign typed payload、缺失 nested ref、跨 scope member 或不兼容 target binding 必须 fail closed。

### 5.2 `ObservationReadModel` canonical view

`ObservationReadModel` 已由 Step 06 `contracts::views` 唯一持有；Q09 只消费其 schema：

```rust
pub struct ObservationReadModel {
    pub read_model_ref: ObservationReadModelRef,
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,
    pub scope: ObservationProjectionScope,
    pub receipt_refs: ObservationReceiptRefSet,
    pub signal_refs: SafeSignalRefSet,
    pub audit_projection_refs: AuditProjectionRefSet,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
    pub as_of_cursor: Option<ObservationCommittedCursor>,
}
```

Q09 不扩展该 view，也不把它包装为 `ObservationReadModelPage`。字段闭环如下：

| view field | authoritative source | required invariant | forbidden substitution |
|---|---|---|---|
| `read_model_ref` | application id generator at first committed projection creation | replacement preserves identity；stable identity不随 scope serialization、digest或row version变化 | scope hash、request digest、page cursor、maintenance ref |
| `freshness_marker_ref` | application id generator at first committed projection creation | replacement preserves marker identity；stale/rebuilding payload marker relation必须相等 | row version、updated time、progress ref或new marker on read |
| `scope` | projection index / committed row | exactly equals requested canonical scope；scope kind and nested identity remain lossless | request string、route、view ref反推 scope |
| `receipt_refs` | one committed projection snapshot | canonical bounded set；每个 member belongs to the same scope and saved receipt owner | raw receipt body、source event、first page or unbounded scan |
| `signal_refs` | same committed projection snapshot | canonical bounded safe-signal set；raw telemetry never enters | log/metric/span body、correlation text或current source lookup |
| `audit_projection_refs` | same committed projection snapshot | canonical bounded audit projection set；source audit truth remains external | audit body、latest record猜测、report/evidence body |
| `visibility` | loaded source visibility provenance + P11 decision | body presence follows finite `VisibilitySurface` matrix | row existence、member count、scope kind、HTTP status |
| `freshness` | persisted projection marker / committed surface | `Fresh/Stale/Rebuilding/Unknown` copied losslessly；Q09 cannot promote | requested time、row version、domain state、page cursor |
| `as_of_cursor` | same committed snapshot as all three member sets | non-empty member set requires committed cursor; empty local view may have `None` only under owner factory rule | latest member time、request time、rebuild progress |

The view factory's existing invariants remain binding: cross-scope members reject; stale marker payload must equal `freshness_marker_ref`; visible empty body means only “known local scope has no members in this committed projection,” never “source truth has no facts.”

### 5.3 Identity and replacement matrix

| operation | `read_model_ref` | `freshness_marker_ref` | member sets | Q09 behavior |
|---|---|---|---|---|
| first committed projection | mint once | mint once | complete canonical sets | may return `Present` if visibility allows |
| derived replacement | unchanged | unchanged | replace as one snapshot | return current committed view only |
| stale marker update | unchanged | unchanged | no body repair by Query | return persisted stale/rebuilding surface or policy-limited old body |
| missing row | no ref may be generated | no marker may be generated | no synthetic empty sets | classify only with typed absence proof |
| relation/row corruption | existing refs may be loaded but cannot be trusted as valid body | existing marker cannot be guessed | no partial response | typed consistency failure / safe surface |

## 6. Read facet and same-snapshot contract

### 6.1 Least-authority query facet

Query service receives only:

```rust
Arc<dyn ObservationProjectionQueryStore>
```

The relevant callables are:

```rust
fn get_observation_read_model<'a>(
    &'a self,
    scope: &'a ObservationProjectionScope,
) -> ApplicationPortFuture<'a, Option<ObservationReadModel>>;
```

```rust
fn page_observation_read_models<'a>(
    &'a self,
    scope: &'a ObservationProjectionScope,
    page: ObservationRepositoryPage,
) -> ApplicationPortFuture<
    'a,
    ObservationRepositoryPageResult<ObservationReadModel>
>;
```

Q09 调用第一项 point callable。第二项只登记为 shared/read-facet affected：它不能证明 Q09 point contract，也不能向 API 暴露 `ObservationRepositoryPage`、continuation token、row version 或 adapter page object。

Query service 不得取得：

- `ObservationProjectionStore`、`ObservationProjectionSourceReader` 或 `ObservationProjectionMembershipPlanner`；
- `get_observation_read_model_with_version`、`replace_observation_read_model`、`mark_views_stale` 或任何 UoW callable；
- source reader、raw telemetry reader、membership planner、current truth repair port、maintenance writer 或 external adapter。

### 6.2 Required composite read proof

`Option<ObservationReadModel>` 只提供 public body carrier，不能独立证明 P11/P13 所需的完整 provenance。Q09 的 implementation handoff 必须由 Step 07/11 选定以下一种 exact contract：

| allowed design | minimum returned proof | current status |
|---|---|---|
| composite query facet | view、persisted freshness marker、source visibility provenance、complete current gap revisions、rebuild linkage、availability classification来自同一 committed read boundary | 未提供 exact callable，affected |
| query-side read transaction | 一个 application-owned read transaction 将上述字段绑定到同一 head/fence，且不暴露 writer | 当前 Query facet 没有 transaction parameter，affected |
| view-only narrowing | 将 Q09 response 收窄到不需要缺失 provenance 的有限 surface，并同步修改 façade/schema | 尚未裁定，不能由 Q09 自行选择 |

无论采用哪一种，以下规则固定：

1. 三个 member set、scope、visibility source、freshness marker 和 as-of cursor 不能跨 committed snapshot 拼接。
2. query repository `None` 是 lookup outcome，不是 `Missing` decision；application 必须先判断 visibility、availability 和 absence proof。
3. repository error、partial row、duplicate scope row、marker mismatch、member cross-scope 或 incomplete relation 都不能返回 partial `ObservationReadModel`。
4. Query 不得把 `get_observation_read_model_with_version` 的 technical version 当 public freshness；row version只能留在 writer validation。

登记：`S08-D-Q09-READ-CARRIER-01`。

### 6.3 Point read sequence

目标只读顺序如下，Step 09 只可把它展开为函数级 flow：

```text
GetObservationReadModelRequest(scope)
  -> validate exact query binding, metadata, scope variant and input cardinality
  -> create one-shot DiagnosticRequestContext(read_purpose=Query)
  -> resolve read target = ReadEvaluationTargetRef::ProjectionScope(scope)
  -> load committed ObservationReadModel and all required provenance in one bounded read boundary
  -> validate view scope, stable refs, member sets, cursor and freshness-marker relations
  -> resolve existing rebuild linkage when freshness is Rebuilding
  -> construct P10 read target and evaluate NoWriteGuardPolicy
  -> construct P11 ReadVisibilityInputSnapshot and evaluate ReadVisibilityPolicy
  -> when P11/Persisted material requires degraded mapping, construct complete P13 input and evaluate it
  -> map availability, presence, freshness, degraded and rebuild surfaces without guessing
  -> return ObservationQueryResult<ObservationReadModel>
  -> response assembler maps to ObservationQueryResponse<ObservationReadModel>
```

P10 target必须绑定 `ReadOrDiagnostic`、同一 request context、同一 `ReadEvaluationTargetRef::ProjectionScope(scope)`、`ReadCommittedSurface` 和 `ObservationMaintenance` guard scope。P11/P13 decision只在本次调用内存在，不写 `ReadVisibilityState` 或 `DegradedOutputState`。

## 7. Presence、missing 与 empty 语义

### 7.1 Point presence matrix

Q09 是 point Query，因此 `ObservationQueryPresence::Empty` 在 response factory 中必须拒绝。空集合只作为已存在 view 的 body 内部状态：`view.is_empty() == true`，presence仍为 `Present`。

| committed/read condition | presence | view | missing | visibility / availability | rule |
|---|---|---|---|---|---|
| view exists、scope/relation valid、body可见 | `Present` | `Some(view)` | `None` | Visible/Restricted；availability explicit | normal point result |
| view exists且三个集合为空、scope已知且body可见 | `Present` | `Some(empty view)` | `None` | Visible/Restricted | local empty projection，不是 `Empty`，不证明 source 无事实 |
| view exists、旧 freshness、policy允许旧 body | `Present` | `Some(view)` | `None` | policy允许的 stale/degraded availability | freshness必须保留 stale marker |
| view exists、Rebuilding、policy允许旧 body | `Present` | `Some(view)` | `None` | rebuild surface与同一 target/progress relation | 不等待或推进 rebuild |
| exact local view不存在，且 scope existence可安全披露，且有 definitive absence proof | `Missing` | `None` | 仅允许 `NotFound` 或有正式依据的其他 variant | 不得伪装 NotVisible；availability不能是 generic failure fallback | 需要 bounded absence contract |
| source anchor/reservation明确存在，view尚未形成 | `Missing` | `None` | `NotYetProjected` | freshness/availability必须说明 projection 尚未形成 | 当前 query facet没有 source-anchor/reservation read，不能默认使用 |
| scope不可见或 existence disclosure不安全 | `Unknown` 或 policy-defined NotVisible surface | `None` | `None` | visibility明确；不得泄露 scope/member/ref | 不得返回 `NotFound` |
| read dependency unavailable/disabled/failed | `Unknown` 或 typed application/protocol error | `None` | `None` | exact availability surface | 不得把 dependency failure当 missing |
| view/ref/marker/member relation损坏 | typed consistency/application error | `None` | `None` | 不返回 partial body | 不得用 `None` 重分类为 missing |

### 7.2 `ObservationMissingSurface` 使用限制

Q09 只允许在下列证明成立时使用 missing surface：

- `NotFound`：canonical scope 是当前可披露的本地 owned target，bounded lookup 明确证明没有该 view，且没有 source anchor/reservation 或其他 reason；
- `NotYetProjected`：由唯一 source anchor 或 projection reservation owner 明确证明 projection 应存在但尚未形成；当前没有该 exact query callable，因此暂不允许合成；
- `OutsideRetainedObservationWindow`：只有 retention owner 明确绑定该 scope/position 并提供该语义时才可用，Q09 不从空 row 推导；
- `SourceReferenceUnavailable`：Q09 本身不读取外部 source reference，不能用该 variant替代 projection store unavailable。

禁止以下映射：

| observed condition | prohibited mapping |
|---|---|
| repository returns `None` | automatic `NotYetProjected`、`NotFound` 或 `Unmarked` |
| empty member sets in an existing view | `Missing` 或 `Empty` presence |
| `ObservationProjectionFreshnessSurface::Unknown` | `NotFound`、`NotYetProjected` 或 `Fresh` |
| hidden scope / P11 NotVisible | `NotFound` 或返回 scope/ref/member count |
| rebuild progress missing | `NotYetProjected` 或启动 rebuild |
| repository timeout / `RepositoryUnavailable` | `SourceReferenceUnavailable` 或 missing |

登记：`S08-D-Q09-MISSING-PRESENCE-01`。

## 8. Visibility、freshness、rebuild 与 degraded

### 8.1 P11 visibility input

Q09 的 P11 target 固定为 `ReadEvaluationTargetRef::ProjectionScope(scope)`，`ReadPurpose` 固定为 `Query`。完整 `ReadVisibilityInputSnapshot` 必须包含：

- exact one-shot `DiagnosticRequestContext`，actor 只来自 query metadata；
- exact projection scope and read target；
- persisted `ObservationProjectionFreshnessSurface`；
- complete `GapPolicySnapshotSet` 及 current revisions；
- `ReadVisibilitySourceSnapshot`，包括 persisted `VisibilitySurface`、optional constraint 和 typed block reason；
- same-request P10 `NoWriteGuardDecision`。

`ObservationReadModel.visibility` 只有 public surface，不能单独提供 constraint、block reason 或 gap provenance。若 source row 丢失这些字段，必须返回 relation/consistency failure或由 finite mapper给出安全 blocked surface；不得从 `Visible/Restricted/NotVisible/Blocked` 名称猜内部原因。

P11 的固定链为：

```text
load committed view/marker/source visibility/gap revisions
  -> build ReadVisibilityTargetSnapshot
  -> build ReadVisibilityInputSnapshot
  -> P10 NoWriteGuardPolicy::evaluate
  -> P11 ReadVisibilityPolicy::evaluate
  -> response assembler borrows the decision
```

P11 不能把 stale、rebuilding、unknown 升级为 Visible；NotVisible 不等于 Missing；Restricted 需要正式 constraint；Blocked 的 reason/gap provenance 必须来自 loaded source 或 P10 decision。

登记：`S08-D-Q09-VISIBILITY-SOURCE-01`。

### 8.2 Freshness and consistency hint matrix

`ObservationProjectionFreshnessSurface` 的四个 canonical variant 为 `Fresh`、`Stale { marker_ref }`、`Rebuilding { progress_ref }`、`Unknown`。Q09 按 request metadata 的 `ObservationConsistencyHint` 只选择已 committed body，不执行任何 freshness mutation：

| consistency hint | Fresh | Stale | Rebuilding | Unknown |
|---|---|---|---|---|
| `AllowStale` | return body if visible | old committed body may return with exact marker | old committed body may return only after rebuild relation is proven; otherwise safe surface | no Fresh; limited/unknown/error according to mapper |
| `RequireFresh` | return body | do not return stale body; no wait/refresh; safe unknown/degraded/error surface | do not wait/start; safe unknown/degraded/error surface | no body unless an explicit policy permits limited material |
| `BestEffort` | return Fresh body | return the safest committed body allowed by P11/P13 | prefer a valid committed body with explicit rebuilding surface; otherwise no body | do not invent freshness; return explicit unknown/availability surface |

`Fresh` 只能由 persisted marker/committed projection contract证明。`Stale` 的 marker ref必须等于 view 的 `freshness_marker_ref`。`Rebuilding` 的 progress ref若为 Some必须完成 §8.3 链；None不能通过 ref lookup 补造 progress。`Unknown`不能被 request time、row version、state、page cursor或“当前没有 error”降级为 Fresh。

登记：`S08-D-Q09-FRESHNESS-SOURCE-01`。

### 8.3 Rebuild progress relation

当 view freshness 为 `Rebuilding { progress_ref: Some(P) }` 时，Q09 只允许调用：

```rust
ObservationProjectionQueryStore::get_rebuild_progress_by_ref(
    &RebuildProgressViewRef
) -> ApplicationPortFuture<Option<RebuildProgressView>>
```

必须验证：

1. loaded `RebuildProgressView.progress_ref == P`；
2. `RebuildProgressView.target_ref` 是 observation-side derived maintenance target，且与 requested scope 的 target binding 相容；
3. `maintenance_ref`、`replay_coordination_ref`、`rollup_rebuild_ref` 的 optionality符合 target kind；不允许多个不相容 identity 同时 Some；
4. `rebuild` surface 与 loaded `ProjectionMaintenanceState`/coordination/rollup lifecycle 的 public mapping一致；`Completed`只表示 derived target完成，不是 source repair或验收；
5. `RebuildProgressView.freshness` 与 read model 的 persisted marker 关系成立；更新时点不替代 committed marker；
6. 若 target 是 `ByMaintenanceTarget`，`MaintenanceTargetScopeBinding` 的 immutable member scopes 必须包含/解释 requested scope，且 binding、target kind/effect/no-write scope 无漂移；
7. 任一 missing/mismatch/error 都不能触发 repair、重新查询下一页或合成 `Queued`/`Running`。

`Rebuilding { progress_ref: None }` 是合法 public surface，但只能表达 queued/scheduled 或 progress 尚未形成；不能由 Q09 mint `RebuildProgressViewRef`，也不能从 `MaintenanceTargetRef` 直接生成 progress view。

当前 Step 07 query facet 没有一个 composite callable同时返回 view、marker、progress、target binding 和 complete gap/visibility provenance；因此本节是 design contract，不是已闭合 owner。登记：`S08-D-Q09-REBUILD-RELATION-01`。

### 8.4 P13 degraded mapping

如果 Q09 需要返回 limited body 或 blocked degraded surface，application 必须先构造完整 `DegradedOutputInputSnapshot`：

- exact affected object / target 与 `ReadEvaluationTargetRef::ProjectionScope(scope)` 的无损 relation；
- P11 完整 `ReadVisibilityDecision`，包括 input、constraint/gap/block provenance；
- explicit safety input。若 read-model target 不需要 safety disposition，必须传入经过 typed compatibility matrix 验证的 `NotApplicable`，不能用 `None` 默认；
- complete current gap revisions，且 effective gap 只能来自 loaded `Open/Acknowledged` gap；
- `visibility_block_reason` 必须与 P11 Blocked payload 逐字段相等。

P13 的 outcome 只影响 response surface：同步 Q09 不调用 `DegradedOutputState::create_from_decision` 或 `replace_from_decision`，不 mint degraded ref，不保存 revision。`Normal/Limited/Blocked` 不能从 `ObservationReadModel.visibility`、`ObservationMissingSurface`、`ApplicationError` 文本或 adapter diagnostic 直接映射。

登记：`S08-D-Q09-DEGRADED-SOURCE-01`。

### 8.5 Availability

Q09 的 `ObservationAvailabilitySurface` 必须由有限 typed source 形成：

| source condition | allowed surface | forbidden fallback |
|---|---|---|
| required projection read owner available，material通过一致性校验 | `Available` | 不代表 source truth完整或业务成功 |
| read owner明确 degraded，且 policy允许返回旧/有限 committed body | `Degraded { adapter_family }` | 不默认把任何 stale 当 degraded success |
| read owner unavailable | `Unavailable { adapter_family }` 或 typed application error | 不切换 in-memory/fallback store，不把 failure当 missing |
| read owner disabled/misconfigured | `Disabled { adapter_family }` 或 startup/runtime typed error | 不在 Query 激活 adapter、读取 config secret或猜 family |
| read owner 返回未分类的 consistency failure | `Failed { adapter_family }` 或 typed consistency error | 不用首个 exception、HTTP status或字符串生成 surface |

具体 `AdapterFamily`、availability probe 与 repository failure 的映射必须由 Step 07/12 的唯一 owner提供。Q09 只要求 response assembler 保持 lossless，不暴露 endpoint、credential、provider code、message 或 adapter instance。登记：`S08-D-Q09-AVAILABILITY-SOURCE-01`。

## 9. Error、surface precedence 与 no-write

### 9.1 Error matrix

repository 调用顺序不能决定 public surface。Q09 使用有限 precedence；若 exact mapper 尚未提供，必须 fail closed，不以第一个失败覆盖后续来源。

| priority | condition | required mapping | body / side effect |
|---:|---|---|---|
| 1 | query binding、body type、scope variant、metadata非法 | `InvalidRequest` 或 typed protocol/reference error | no repository write；no partial view |
| 2 | unsupported or contradictory page field仍进入 application input | typed input/schema conflict | 不把 page 当 list mode；不调用 point/page repository |
| 3 | visibility scope/context无法建立 | NotVisible/Unknown或typed visibility error，按 policy owner | 不披露 scope、ref、member count |
| 4 | P10/P11 input relation不一致 | typed relation/consistency error | 不返回 view；不写 read state |
| 5 | canonical point lookup unavailable/disabled/failed | availability surface或 typed application error | 不fallback、不合成 missing |
| 6 | row存在但 scope/ref/member/marker/cursor不一致 | typed projection consistency error | 不返回 partial body、不修复 |
| 7 | row absent且没有 definitive absence proof | Unknown/availability surface | 不使用 `NotFound`、`NotYetProjected` 或 empty placeholder |
| 8 | definitive local absence且可披露 | `Missing(NotFound)` | no body；不 mint refs、不启动 rebuild |
| 9 | freshness stale/rebuilding/unknown | persisted freshness + policy-limited degraded/unknown/error | 不标 Fresh、不等待、不 rebuild |
| 10 | P13 gap/safety/degraded input incomplete | typed degraded/consistency error | 不创建 durable degraded revision |
| 11 | valid visible view | `Present` with `Some(view)` | no UoW/no audit/no outbox |

### 9.2 Surface invariants

`ObservationQueryResponse::try_new` 的 Q09-specific checks必须至少包括：

- `query_name` 等于 `GetObservationReadModel`，view type 与 operation 一一绑定；
- point Query 不得使用 `presence=Empty`；
- `Present` 必须有 `Some(view)`、`missing=None`，且 body 被 visibility 允许；
- `Missing` 必须有 typed missing surface、`view=None`，且不能同时伪装 NotVisible；
- `Unknown` 不得携带未经 policy 允许的 body；
- stale/rebuilding surface 中 marker/progress relation必须与 view/target一致；
- `availability=Available` 不能与未分类 dependency failure、consistency error 或缺失 provenance 共存；
- `error` 只承载真正 protocol/application failure，不把 expected stale/missing/rebuilding 重新变成 generic error；
- `degraded` 只能来自完整 P13 decision，不能由 response assembler 直接构造；
- no public field包含 raw body、repository version、cursor internals、policy basis、constraint body、provider detail 或 external run identity。

### 9.3 Zero-write matrix

Q09 每次调用都必须满足：

| candidate side effect | ruling |
|---|---|
| create UoW / allocate commit cursor | forbidden |
| `stage_*` / `replace_*` / `mark_views_stale` | forbidden |
| mint `ObservationReadModelRef` / freshness marker / rebuild progress / gap / degraded ref | forbidden |
| call source reader / membership planner / external resolver / cleanup / archive | forbidden |
| run P17 maintenance authorization as an execution step | forbidden；只验证已 persisted rebuild relation |
| call `ReadVisibilityState::from_decision/apply_decision` | phase-reserved；current synchronous Query forbidden |
| call `DegradedOutputState::create_from_decision/replace_from_decision` | mutating flow only；Q09 forbidden |
| reserve idempotency / stored result / duplicate replay | forbidden；Query digest仅作 input integrity |
| append H7 read audit / H-series record / outbox / report handoff | forbidden |
| close/open/acknowledge gap or trigger rebuild | forbidden |

Repeated identical Q09 requests are ordinary read repeats, not idempotent command replays. A read failure leaves all loaded objects and stores unchanged.

## 10. Field / owner / affected closure table

| closure item | current owner / callable | Q09 conclusion |
|---|---|---|
| request body | R06.8-A use-site | target shape is one `scope`; standalone public declaration/sealed decoder仍 affected |
| application input | `GetObservationReadModelInput` in `application::inputs` | exact operation/control fields known；page conflict must be repaired upstream |
| API assembly | `ObservationApiInputAssembler::get_observation_read_model` | exact callable recorded |
| Read façade | `ObservationReadService::get_observation_read_model` | exact point return recorded |
| projection scope | `contracts::scopes::ObservationProjectionScope` | unique lookup key closed；no duplicate owner |
| read model view | `contracts::views::ObservationReadModel` | unique fields/factory/stable refs closed；Q09 consumes only |
| point repository read | `ObservationProjectionQueryStore::get_observation_read_model` | current least-authority callable |
| page repository read | `page_observation_read_models` | cannot serve Q09 point; operation/carrier disposition affected |
| freshness surface | `contracts::surfaces::ObservationProjectionFreshnessSurface` | four variants closed；composite source for Q09 response affected |
| rebuild progress | `get_rebuild_progress_by_ref` + `RebuildProgressView` | callable and schema known；scope/target/binding proof affected |
| P10 | `NoWriteGuardPolicy` / `NoWriteGuardDecision` | target shape known；same request/scope binding must be propagated |
| P11 | `ReadVisibilityPolicy` / `ReadVisibilityDecision` | canonical input/decision owner exists；Q09 source provenance carrier affected |
| P13 | `DegradedOutputPolicy` / `DegradedOutputDecision` | canonical policy exists；Q09 safety/gap input source affected |
| missing | `ObservationMissingSurface` | shared variants exist；Q09 definitive absence proof unavailable |
| availability | `ObservationAvailabilitySurface` + typed probe/error mapping | finite surface exists；Q09 exact source/precedence affected |
| public response | `ObservationQueryResult<T>` -> `ObservationQueryResponse<T>` | point mapping is fixed in this protocol；shared mapper still affected |
| Step 09 handoff | `GetObservationReadModelFlow` | reserved only；no flow body in this batch |

## 11. Q09 affected register

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q09-REQUEST-SCHEMA-01` | `open_upstream_internal` | `GetObservationReadModelRequest` 只有 R06.8-A use-site，缺独立 public declaration、wire、sealed query binding 和 decoder owner；同时 page field disposition未反映在 request owner | Step 06/07 选定唯一 request owner，明确只含 `scope`，并同步 application input assembly | Step 08 临时创建 canonical DTO、alias、隐藏 page 或从 route/body 猜 operation |
| `S08-D-Q09-POINT-PAGE-CONFLICT-01` | `open_internal_affected` | `ObservationProjectionScope`是 unique lookup key，Read façade是单体结果，但 R06.8-A 有 optional page、Step 07 有 page callable；两种 cardinality未闭合 | 选择 point-only Q09并将 list/page拆为具名协议，或同步修改 façade、input、response和repository owner；不能双模式 | 丢弃 page、取第一页、用 page 存在性切换模式、把单体 result cast 成 page |
| `S08-D-Q09-READ-CARRIER-01` | `open_internal_affected` | point callable只返回 view，未证明 view、marker、visibility provenance、gap revisions、as-of cursor和rebuild relation来自同一 committed boundary | 提供 composite query carrier 或 transaction-local read fence，并闭合 failure totality | 跨调用/跨时间拼接、row version当freshness、partial view、默认多次read一致 |
| `S08-D-Q09-MISSING-PRESENCE-01` | `open_internal_affected` | `Option<ObservationReadModel>`不能区分从未投影、visible local absence、hidden、stale/rebuilding、index corruption和dependency unavailable | 提供 typed absence/anchor/reservation source与visibility-before-existence precedence | `None -> NotFound/NotYetProjected/Empty` 默认映射、合成空 view/ref或触发 rebuild |
| `S08-D-Q09-VISIBILITY-SOURCE-01` | `open_internal_affected` | view的 public visibility缺 P11 所需 constraint、block reason、source gap provenance和same-snapshot input | Step 07 提供 Q09 专属 source mapper/carrier，完整绑定 metadata scope、P10、P11 和 gap revisions | 从 row existence、member count、scope kind、state、HTTP status或error text推导 visibility |
| `S08-D-Q09-FRESHNESS-SOURCE-01` | `open_internal_affected` | freshness surface有 owner，但 Q09缺覆盖 view、scope、visibility、gap和as-of cursor的共同 persisted/committed source及hint mapping | 定义 Q09 composite freshness source、marker parity和 AllowStale/RequireFresh/BestEffort matrix | 用 row version、requested_at、last member time、domain state或page cursor伪造 Fresh |
| `S08-D-Q09-REBUILD-RELATION-01` | `open_internal_affected` | `Rebuilding` progress ref到progress view、maintenance target、immutable scope binding和lifecycle state没有Q09完整 read proof | 定义 progress-by-ref relation carrier、target/member binding、None progress语义和mismatch precedence | mint progress ref、按target重建progress、等待/启动rebuild、把Completed当source repair |
| `S08-D-Q09-DEGRADED-SOURCE-01` | `open_internal_affected` | P13要求 exact target、P11 decision、explicit safety input和complete current gaps，Q09当前没有唯一组装来源 | 提供 Q09 P13 input mapper；明确 `NotApplicable` safety 是否由 typed matrix允许 | 从 visibility kind、missing enum、ApplicationError文本、gap count或adapter diagnostic合成 degraded |
| `S08-D-Q09-AVAILABILITY-SOURCE-01` | `open_internal_affected` | projection read failure、availability probe、consistency failure与public availability/error surface没有Q09专属有限映射 | 定义 read-owner availability snapshot、adapter family和多依赖 precedence；保持无敏感信息 | 默认 `Available`、fallback store、把 timeout当missing或泄露provider detail |
| `S08-D-Q09-SURFACE-MAPPER-01` | `open_internal_affected` | Q09 invalid/hidden/missing/empty-in-body/stale/rebuilding/unknown/degraded/availability/error precedence和material source map未唯一绑定 | Step 07 提供 finite Q09 mapper/summary；response assembler只做 lossless copy | 首个失败调用、`None`、空集合、state名称、异常文本或HTTP status决定最终 surface |

Q09 复用但不关闭以下 shared affected：

- `S08-D-QUERY-SURFACE-MAPPER-01`：所有 Query 的通用 result-to-response mapping 仍需总审计。
- `S08-D-PAGE-REQUEST-TYPE-01`：`ObservationPublicPageRequest` 与 S08-B `ObservationPageRequest` 的 canonical owner 冲突继续存在。
- `S08-D-PAGED-RESULT-CARRIER-01`：Q09 不使用 page，但其存在暴露了 shared application paged carrier 缺口。
- `R06.6-F2-H13-UPSTREAM`：与 Q09 read model point contract 无直接关系，继续 `open_controlled`。

本批新增 10 项 Q09 affected，均为 current design internal/upstream-internal closure gap，不是新的外部上游 blocker。

## 12. Step 09 handoff（仅登记）

`GetObservationReadModelFlow` 是 Q09 唯一后续 flow 名称。Step 09 必须消费本文件的 point-only ruling 和 same-snapshot contract：

```text
GetObservationReadModelRequest(scope)
  -> exact request / metadata / scope validation
  -> one-shot DiagnosticRequestContext(Query)
  -> load one committed ObservationReadModel composite by (kind, scope)
  -> validate stable identity, member sets, marker, cursor and scope relation
  -> resolve existing Rebuilding progress/maintenance relation only when persisted ref is present
  -> P10 same-target no-write decision
  -> P11 visibility decision with source provenance
  -> optional P13 degraded decision with explicit safety/gap inputs
  -> map Present/Missing/Unknown, freshness, availability and rebuild surface
  -> ObservationQueryResult<ObservationReadModel>
  -> ObservationQueryResponse<ObservationReadModel>
```

Step 09 不得在该 flow 中添加：

- page/list fallback、global scan、第一项选择或 hidden filter；
- UoW、projection replacement、stale marking、gap mutation、degraded revision、read audit、outbox 或 stored result；
- synchronous rebuild、wait-for-fresh、refresh、repair、source/business truth write、external adapter call；
- 从 `None`、`Unknown`、`Rebuilding` 或 `ObservationReadModel::is_empty()` 推导业务不存在、source truth不存在或验收结论。

## 13. Q09 stop review

| 检查项 | 结论 |
|---|---|
| 是否形成独立 request、input、view、field source、read facet、presence、visibility、freshness、rebuild、degraded、error、no-write 和 Step 09 handoff 记录 | `pass_with_affected_open` |
| request 是否收敛为一个 canonical `scope` | target contract 是；public owner与R06.8-A page冲突登记 `S08-D-Q09-REQUEST-SCHEMA-01` / `S08-D-Q09-POINT-PAGE-CONFLICT-01` |
| `ObservationReadModel` 是否重复声明 owner | no；复用 Step 06 唯一 contracts view owner |
| scope 是否作为唯一 lookup key，且不派生 view identity | pass；五个 canonical variants和stable ref规则被保留 |
| point façade 与 page callable 冲突是否被掩盖 | no；Q09固定point-only，page disposition保持affected |
| exact assembler、Read façade、point/page query facet 是否记录 | pass；Q09只调用point callable，page列为affected |
| 三个成员集合、marker、visibility、gap、cursor 是否已有同一 committed carrier证明 | no；`S08-D-Q09-READ-CARRIER-01`开放 |
| `None` 是否被错误映射为 missing/empty/not-yet-projected | no；absence proof受 `S08-D-Q09-MISSING-PRESENCE-01`约束 |
| empty visible local view 是否与 point `Empty` 区分 | pass；body内部empty仍为 `Present` |
| P11/P13 所需 provenance、safety、gap revisions 是否完整 | no；分别受 visibility/degraded affected约束 |
| rebuilding progress 是否可由 Q09 生成或推进 | no；只校验 persisted relation，`S08-D-Q09-REBUILD-RELATION-01`开放 |
| availability 是否默认 Available 或泄露 provider detail | no；source mapping仍affected |
| Query 是否 zero-write | pass_design_only；无UoW、writer、refresh、rebuild、audit、outbox、stored result |
| 是否发现新的外部上游 blocker | no；已知 `R06.6-F2-H13-UPSTREAM=open_controlled` 与 Q09 无直接关系 |
| 当前协议计数 | `25/60 defined_with_affected_open`；`0/60`无条件 complete |
| 下一动作 | 停审并等待用户明确确认；确认后只读取 Q10 所需的 Step 06/07 owner，不读取 Q11-Q14或其他协议族 |
| 当前提交 | 不需要；用户未要求提交 |

## 14. 恢复点

```text
Step08_S08-D_Q09_defined_with_affected_open_waiting_user_before_Q10
```

本文件是 design-only 中间产物。正式 `03-详细设计.md` 继续冻结，Q10-Q14、S08-E~G、Step 09~19、`04` 及实现代码继续禁止读取或写入，直到用户明确确认。所有实现验证仍为 `planned/not_run`；本批没有真实 commit、run_id、evidence alias、验收签署或测试结果。
