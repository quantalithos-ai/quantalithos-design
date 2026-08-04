# L4-observability 03-详细设计 Step 08 - S08-D Query Q11 `GetGapStatus`

> 本文件是 Q11 的独立讨论中间产物。它只覆盖 `GetGapStatus`，不关闭 Q12-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q11 |
| 逻辑协议 | `Query / GetGapStatus / GetGapStatusRequest` |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q12` |
| 协议计数 | `27/60 defined_with_affected_open`；`0/60` 无条件 complete |
| Query 计数 | `11/14 defined_with_affected_open`；Q12-Q14 尚未逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 继续冻结，只允许 Step 19 重装配 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q12 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

Q11 读取 observation-owned gap projection。它公开一个 gap 的 body-free 分类、生命周期、affected object、可选 degraded linkage、visibility 与 freshness，或按一个完整 `GapSourceRef` 分页读取该 source 的全部 gap lifecycle。它不拥有 source/business truth，不重跑 gap classification，不把 gap closure解释为source repair，也不执行任何 acknowledgement、mitigation、resolution、suppression、projection repair或retention动作。

### 1.1 本批禁止事项

- 不读取或写入 Q12-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 创建第十五个 Query、第二个 request owner、`GapViewScope`、`GapStatusViewRef` 或 `DegradedOutputStateRefSet`。
- 不允许同时提交 `gap_ref` 与 `source_ref`，也不允许两个 selector 都缺失。
- 不允许 point selector携带 page，也不允许 source selector省略 page。
- 不把 `GapSourceRef.gap_source_ref_id`、inner external ref、source kind或request digest单独当作 page selector。
- 不把 source page缩窄为current nonterminal gap；完整 lifecycle page必须保留`Resolved`，并保留可读的`Suppressed`历史状态。
- 不把 `Suppressed`映射为`Resolved`，不把`Acknowledged`映射为mitigated/closed，不把`Resolved`声明为source repaired。
- 不从 current source、resolver、provider、raw log/metric/trace/audit body、evidence body或业务查询补齐 gap。
- 不在 Query 中重跑 P12、创建/替换 gap、degraded revision、freshness marker、read-audit record、outbox或maintenance task。
- 不用 full `RetentionGuardRepository`、full `ObservationProjectionStore`、UoW、writer version或N+1 point lookup绕过least-authority read gap。
- 不把缺失、不可见、不可用、stale、corrupt或hidden page默认映射为成功、`NotFound`、`Empty`或synthetic view。
- 不伪造实现 commit、run_id、evidence alias、测试结果、验收签署或真实 evidence。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 08 | Query独立协议、request/response/page、marker、visibility/freshness/degraded/error/no-write和停审要求 |
| `standards/document/详细设计书写规范.md` 5.6/5.7 | public DTO、二级类型、字段来源、page/cursor和协议到对象/flow回指结构 |
| `standards/document/设计真相源闭环与可落码性标准.md` | stable identity、selector/cardinality、composite read、P10/P11/P13、Query zero-write和owner闭环 |
| `03_ddd_step_06_application_input_assembly_r06_8a.md` | `GetGapStatusInput`的三个operation字段、four Query control fields与exact assembler use-site |
| `03_ddd_step_06_boundary_read_maintenance.md` | `GapState`、`GapStatusView`、lifecycle、identity、field/factory、historical aggregate scope裁定 |
| `03_ddd_step_06_contracts_carriers.md` | `GapSourceRef`、`GapStateRef`、public surface与canonical ref owner |
| `03_ddd_step_06_policy_guard_records.md` | P10/P11/P12/P13 input、decision binding、source/affected relation、visibility ceiling与Query zero-write |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | exact assembler、Read façade、point query facet、full gap repository、page binding/cursor与projection replacement port |
| current Q10 中间产物 | 复用逐协议停审、least-authority、same-boundary、typed absence和surface precedence审查方法，不复用Q10 schema |
| current formal `02-概要设计.md` / frozen `03-详细设计.md` | 只识别旧聚合view/cardinality和排序冲突，不覆盖current Step06/07 owner |

### 2.2 权威顺序

```text
current Q11 authority / affected register
  > Step 07 exact assembler, Read facade, query facet and repository cursor contract
  > Step 06 GapState / GapStatusView / GapSourceRef / policy contracts
  > current formal 02 and HLD query skeleton
  > frozen formal 03, old README and historical aggregate wording
```

Step 08 不拥有 Step 06 的 view/domain/schema。Q11 只固定协议如何选择、读取并映射这些 owner；尚缺的 request owner、point/page result carrier、least-authority source page、policy target和surface mapper必须登记为 affected。

### 2.3 Historical material 裁定

| 旧材料 | current disposition | 裁定 |
|---|---|---|
| `GapStatusView`作为聚合view并使用`GapViewScope` | `historical_material_replaced` | current view是一项一个gap，identity复用`GapStateRef`；集合由generic public page承接，不生成scope wrapper |
| 聚合view携带`DegradedOutputStateRefSet` | `historical_material_replaced` | 每个item只携带该gap的`Option<DegradedOutputRef>`；page不能形成第二套aggregate truth |
| `gap_ref/source_ref/page`三个Options未固定分支 | `historical_use_site_with_current_normalization` | 保留一个逻辑协议，但目标request必须是有限tagged selector，point与source page互斥 |
| Read façade与query store都只返回单体 | `current conflict; affected` | 不能忽略source page，也不能把page降为第一次point hit；必须修复cardinality/result owner |
| full repository page按`(opened_at, gap_ref)`排序 | `current Step07 summary conflict` | exact cursor registry规定`gap_ref ASC`，该表优先；§7.19摘要必须同步修复，当前登记affected |
| `find_current_gap_by_source`可承接source query | `rejected_for_Q11_page` | 它只返回sole nonterminal current gap，不能表达完整lifecycle或`Resolved` history |
| `page_gaps_by_source -> Versioned<GapState>`足以直接输出public page | `rejected` | 缺view marker、visibility、degraded relation与same-boundary proof；row version和domain object不得泄漏public |
| Query读取gap时重跑P12检查kind | `historical_material_rejected` | rehydrate验证stored kind/source/affected relation；P12只控制新gap opening，Query不能重分类历史gap |

## 3. SOP 问题回答

| # | 问题 | Q11 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义`GetGapStatus` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> least-authority gap projection read |
| 3 | 调用方与处理方 | exact API handler调用`ObservationApiInputAssembler::get_gap_status`，再调用`ObservationReadService::get_gap_status` |
| 4 | 传输方式 | typed logical request/response；具体HTTP/RPC locator后置Step14/`04`，不进入DTO |
| 5 | public request schema | 一个有限tagged selector：`Point { gap_ref }`或`BySource { source_ref, page }` |
| 6 | application input | normalized selector + Query context、visibility scope、consistency、requested time；不保留非法Option组合 |
| 7 | response schema | point -> `ObservationQueryResponse<GapStatusView>`；source -> `ObservationPagedQueryResponse<GapStatusView>` |
| 8 | point lookup | exact `GapStateRef`；它同时是gap identity与public view identity |
| 9 | page lookup | complete canonical `GapSourceRef` + required page；不接受source id、inner ref、kind或global scan |
| 10 | page cardinality | 完整source lifecycle page，包含Open/Acknowledged/Resolved以及未来可rehydrate的Suppressed；不只返回current gap |
| 11 | public view owner | Step06唯一`contracts::views::GapStatusView`；Q11不创建第二owner |
| 12 | field source | committed gap revision + exact same-gap degraded relation + persisted projection marker + read policy result |
| 13 | identity | `gap_ref`稳定且同时是view identity；不创建`GapStatusViewRef`或由source/page/cursor派生identity |
| 14 | lifecycle | 精确保留`GapLifecycleState`；Resolved terminal for this gap但不证明source repair，Suppressed不等于Resolved |
| 15 | visibility | P10 same-target guard + P11 one-shot decision；page还需要selector-level ceiling，不从row count/state推导 |
| 16 | freshness | item marker与item freshness必须parity；page-level freshness需覆盖整页committed boundary，不能选最方便的一项 |
| 17 | degraded | `degraded_ref`只来自same-gap committed relation；public degraded surface只来自P13 complete input/decision |
| 18 | P12 | Query不重跑P12，不打开、重分类、覆盖或自动关闭gap |
| 19 | missing/empty | point可在typed proof下Missing；source page成功无item为Empty；hidden/unavailable/corrupt均不是Missing/Empty |
| 20 | cursor/order | source page使用`for_gaps_by_source`绑定，目标order revision 1为`gap_ref ASC`；排序摘要冲突保持affected |
| 21 | actor authority | actor来自`ObservationQueryMetadata`/trusted entry；body不提交actor、visibility或policy outcome |
| 22 | no-write | 不创建UoW/reservation/result/H7/outbox/gap/degraded revision/marker/repair/rebuild或source/business write |
| 23 | Step09回指 | 只登记一个`GetGapStatusFlow`，内部按normalized selector分point/page；本批不展开函数级flow |

## 4. Logical binding、request 与 normalized input

### 4.1 一个逻辑协议、两个互斥 selector

Q11 不新增`ListGapStatusBySource`等第十五个Query。目标public body为一个sealed tagged selector：

```rust
/// Selects one gap or one bounded lifecycle page for a complete gap source.
pub struct GetGapStatusRequest {
    pub selector: GapStatusSelector,
}

/// Finite cardinality selector for GetGapStatus.
pub enum GapStatusSelector {
    /// Reads one gap-status view by its stable gap identity.
    Point {
        gap_ref: GapStateRef,
    },
    /// Reads one bounded page of the complete lifecycle for one source.
    BySource {
        source_ref: GapSourceRef,
        page: ObservationPageRequest,
    },
}
```

上述是Q11目标协议shape，不在Step08创建canonical owner。Current Step06/07只有`GetGapStatusRequest` use-site和三Option input，没有独立request declaration、tagged enum owner、wire discriminator、unknown-field规则或sealed operation binding，登记`S08-D-Q11-REQUEST-SCHEMA-01`。

目标wire必须是exactly one tagged variant，例如逻辑形态：

```json
{ "selector": { "kind": "point", "gap_ref": "<typed-body-free-ref>" } }
```

```json
{
  "selector": {
    "kind": "by_source",
    "source_ref": { "gap_source_ref_id": "<typed-ref>", "source_kind": "...", "source_ref": "<body-free-external-ref>", "visibility_constraint_ref": null, "state": "known" },
    "page": { "cursor": null, "limit": 100 }
  }
}
```

Wire decoder必须拒绝两个variant同时出现、unknown kind、point携带page、by-source缺page、`source_ref`残缺或额外raw selector。不得为了兼容旧Options接受`gap_ref=null, source_ref=null`、把page存在性当discriminator或把缺失page补默认limit。

### 4.2 Shared Query metadata

`ObservationQueryRequest<GetGapStatusRequest>`继续承载：

```rust
ObservationQueryMetadata {
    actor_ref: ActorSafeRef,
    trace_ref: Option<TraceCorrelationRef>,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
}
```

Q11 body不增加以下内容：

- actor、trace、visibility scope、consistency、requested time或P10/P11/P12/P13 decision；
- `GapKind`、`GapLifecycleState`、affected object、degraded ref、freshness marker、visibility或close reason；
- cursor method tag、selector fingerprint、order revision、repository position、row version或UoW token；
- raw log/metric/trace/audit/evidence/report body、source locator、endpoint、credential、provider detail或真实run identity。

### 4.3 Current application input 与目标normalization

R06.8-A当前use-site为：

```rust
GetGapStatusInput {
    context: ObservationOperationContext,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
    gap_ref: Option<GapStateRef>,
    source_ref: Option<GapSourceRef>,
    page: Option<ObservationPublicPageRequest>,
}
```

该shape允许八种presence组合，其中只有两种合法。目标application carrier必须在assembler边界归一化为有限variant，逻辑shape为：

```rust
GetGapStatusInput {
    context: ObservationOperationContext,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
    selector: GapStatusSelectorInput,
}

enum GapStatusSelectorInput {
    Point { gap_ref: GapStateRef },
    BySource {
        source_ref: GapSourceRef,
        page: ObservationRepositoryPage,
    },
}
```

`GapStatusSelectorInput`名称是required repair shape，不是本Step新增canonical type。它必须归`application::inputs`或相邻application owner，字段private、无serde、无Default、无cross-operation conversion。当前三Option input、single Read result和缺失normalized carrier登记`S08-D-Q11-SELECTOR-CARDINALITY-01`。

### 4.4 Cardinality truth table

| public selector state | target normalized branch | required response | result |
|---|---|---|---|
| `Point { gap_ref }`且无page | `Point` | `ObservationQueryResponse<GapStatusView>` | valid |
| `BySource { source_ref, page }` | `BySource` | `ObservationPagedQueryResponse<GapStatusView>` | valid |
| point + page | none | no response body | `InvalidRequest` before repository call |
| source without page | none | no response body | `InvalidRequest`; no default page |
| point + source | none | no response body | `InvalidRequest`; no precedence/first-wins |
| neither point nor source | none | no response body | `InvalidRequest`; no global scan |
| page without source | none | no response body | `InvalidRequest`; cursor cannot select target |
| source id/inner ref/kind without complete `GapSourceRef` | none | no response body | invalid typed selector; no resolver reconstruction |

### 4.5 Exact assembler 与 validation order

Current exact assembler seam为：

```rust
ObservationApiInputAssembler::get_gap_status(
    ObservationQueryRequest<GetGapStatusRequest>,
) -> Result<GetGapStatusInput, ApplicationError>
```

| stage | exact action | failure / side-effect rule |
|---:|---|---|
| 1 | static entry slot要求`query_name == GetGapStatus`和expected schema version | mismatch -> typed invalid request；不解析其他Query body |
| 2 | 校验trusted actor、trace、visibility scope、consistency与requested time | invalid metadata不产生context/input或repository call |
| 3 | sealed decoder校验exactly-one selector variant与nested typed ref | 不接受legacy Option组合、unknown field或raw source locator |
| 4 | point分支确认无page；source分支校验complete `GapSourceRef`和`ObservationPageRequest` limit/cursor syntax | invalid branch在digest与port call前失败 |
| 5 | 按exact Q11 material调用private canonicalizer的`digest_request`一次 | digest不含metadata requested time，也不把cursor解释成truth |
| 6 | private factory构造无idempotency/event identity的Query context | entry不得取得context factory或canonicalizer |
| 7 | source分支构造`for_gaps_by_source(source_ref)` binding，再将public page转为validated repository page | wrong method/selector/order cursor -> `InvalidPageCursor`；point分支不得构造page |
| 8 | 原子构造normalized `GetGapStatusInput` | 无setter、无partial input、无三Option非法state |

Current public page owner是`ObservationPageRequest`，而R06.8-A仍使用未独立声明的`ObservationPublicPageRequest`。Q11复用shared `S08-D-PAGE-REQUEST-TYPE-01`，不建立alias或双schema。

## 5. Exact Read façade、query capability 与处理权限

### 5.1 Current observed application callable

Step 07 当前的 Read façade 是单一非分页结果：

```rust
ObservationReadService::get_gap_status(
    GetGapStatusInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<GapStatusView>>
```

该签名只能表达一个统一的 `ObservationQueryResult<T>`。它不能在不引入额外 cardinality carrier 的情况下安全返回 `ObservationPagedQueryResponse<GapStatusView>`。Q11 不把 page 结果强行塞进单体 result，也不在 entry 层根据输入类型做未经 owner 约束的 cast。

目标 application result 逻辑形态为：

```rust
/// Operation-specific result that preserves the selector cardinality.
pub enum GetGapStatusResult {
    /// Result for one exact GapStateRef.
    Point(ObservationQueryResult<GapStatusView>),
    /// Result for one bounded complete lifecycle page.
    BySource(ObservationPagedQueryResult<GapStatusView>),
}
```

`GetGapStatusResult` 与 `ObservationPagedQueryResult<T>` 是 required repair shape，不是 Step 08 新增的 canonical owner。Step 06/07 必须在 application result owner、Read façade signature和response assembler之间选择唯一实现，并保证 selector branch与result branch静态一一对应。保留当前单体 façade 也只有在其已有 carrier能够无损承载上述两种分支时才成立；当前材料没有该证明，因此登记 `S08-D-Q11-RESULT-CARDINALITY-01`。

### 5.2 Current least-authority point facet

Step 07 当前给出的 Query facet 只有点查：

```rust
pub trait ObservationProjectionQueryStore: Send + Sync {
    fn get_gap_status<'a>(
        &'a self,
        gap_ref: &'a GapStateRef,
    ) -> ApplicationPortFuture<'a, Option<GapStatusView>>;
}
```

Query service只应注入 `Arc<dyn ObservationProjectionQueryStore>`。它不能取得以下能力：

- `ObservationProjectionStore`、`ObservationUnitOfWork`或任意 `Versioned<T>` writer carrier；
- `get_gap_with_version`、`find_current_gap_by_source`、`page_gaps_by_source`等完整持久化/UoW callable；
- `get_gap_status_with_version`、`replace_gap_status`或projection CAS version；
- source resolver、membership planner、retention guard repository、P12/P13 mutation service、record/outbox/idempotency store或external adapter。

### 5.3 Source page capability缺口与required repair

Step 07 的完整边界有以下非Query callable：

```rust
ObservationUnitOfWork::page_gaps_by_source(
    source_ref: &GapSourceRef,
    page: ObservationRepositoryPage,
) -> ApplicationPortFuture<
    '_,
    ObservationRepositoryPageResult<Versioned<GapState>>,
>
```

它只返回 domain gap及repository version，且位于可stage/append的UoW边界；不能授予Query。当前 `ObservationProjectionQueryStore` 没有 source page method，也没有返回 view/marker/degraded/visibility/freshness共同边界的 read carrier。

Step 07 必须增加一个 least-authority、read-only、bounded 的 source page facet，目标逻辑能力至少等价于：

```rust
fn page_gap_status_by_source<'a>(
    &'a self,
    source_ref: &'a GapSourceRef,
    page: ObservationRepositoryPage,
) -> ApplicationPortFuture<'a, GapStatusPageReadResult>;
```

`GapStatusPageReadResult` 是 required repair shape。它不能包含 `Versioned<GapState>`、CAS version、UoW、repository position、provider row、writer method或raw source material；必须一次性返回同一 bounded committed boundary内的 page items、continuation、source relation、per-item view material、freshness marker、visibility provenance、degraded relation和availability classification。是否以一个 composite method或多个内部 adapter read实现，由 Step 07 收敛，但对 application 必须是一个不可跨调用拼装的 read contract。

### 5.4 Point/page read chain

```text
GetGapStatusRequest
  -> exact tagged selector / metadata / page validation
  -> private Query digest and operation context
  -> normalized Point or BySource application input
  -> Q11 read-safe point/page carrier
  -> validate source/gap/affected/degraded/marker relations
  -> P10 same-target no-write decision
  -> P11 visibility decision and response-level narrowing
  -> P13 degraded decision when complete target input exists
  -> map point or page presence/freshness/availability/error surface
  -> GetGapStatusResult
  -> ObservationQueryResponse or ObservationPagedQueryResponse
```

Point branch必须以 `GapStateRef` 做唯一 lookup；不能由 source scan、gap kind、affected object或view fields反推另一个 gap。BySource branch必须以完整 `GapSourceRef` 做 selector binding；不能先查 current gap再用其source替代请求，也不能对每个 page item重新发 point query拼装public page。

### 5.5 Same-committed-boundary minimum

Point branch的read carrier至少必须能同时证明：

| material | required proof |
|---|---|
| `GapStatusView` / projection row | `gap_ref`、source、kind、affected、degraded、marker、freshness和last-updated字段属于同一 committed projection row |
| `GapState` relation | view的gap identity、source、kind、lifecycle、affected object与stored domain revision exact parity |
| degraded relation | `degraded_ref=None`或loaded immutable revision exact指向同一gap和affected object；不得按latest/first选择 |
| marker/freshness | `freshness_marker_ref`与persisted `ObservationProjectionFreshnessSurface`一对一，不能由row version/time/request time生成 |
| absence | `None`必须伴随typed local absence/anchor/visibility/availability classification；不能由Option单独解释 |
| policy input | P10/P11/P13所需target、scope、gap snapshot、constraint/block provenance来自同一 boundary |

BySource branch除以上每项外，还必须证明：

- source selector与每个 returned `GapStatusView.source_ref` exact相等；
- page是完整 lifecycle的有界连续片段，`Resolved`和可rehydrate的`Suppressed`不能被current-gap filter删除；
- items、page continuation、page-level freshness/visibility/availability和source existence/completeness proof来自同一 committed boundary；
- page item之间不存在跨版本混合，不能把某一item的marker或policy surface复制到整页；
- empty page只有在source存在、可披露且bounded read完成时才表示 `Empty`。

当前点查 `Option<GapStatusView>`和UoW domain page均不满足上述证明。必须拆为 `S08-D-Q11-POINT-READ-BUNDLE-01` 与 `S08-D-Q11-SOURCE-PAGE-READ-BUNDLE-01` 两项 affected；不能用一个“repository available”结论覆盖两种 cardinality。

## 6. Canonical `GapStatusView` 回指、字段来源与identity

### 6.1 唯一view owner与目标字段

Q11复用 Step 06 `contracts::views::GapStatusView`，不创建第二个view或ref：

```rust
pub struct GapStatusView {
    pub gap_ref: GapStateRef,
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,
    pub source_ref: GapSourceRef,
    pub gap_kind: GapKind,
    pub state: GapLifecycleState,
    pub affected_object_ref: AffectedObservationObjectRef,
    pub degraded_ref: Option<DegradedOutputRef>,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
    pub last_updated_at: ObservedAt,
}
```

| field | authoritative source | Q11 validation | forbidden substitution |
|---|---|---|---|
| `gap_ref` | persisted gap/projection identity | point selector exact match；page item identity unique and cursor-compatible | source ref、row key string、request digest、new view ref |
| `freshness_marker_ref` | one-to-one persisted projection marker | marker must belong to this gap view and match freshness sidecar | gap ref、row version、cursor、`last_updated_at` |
| `source_ref` | stored `GapState.source_ref` / projection relation | exact typed source/kind relation；page must equal requested source | caller source body、inner source id、resolver current result |
| `gap_kind` | historical P12 classification persisted with gap | rehydrate exact stored variant; no current P12 rerun | current policy, error text、state、degraded reason |
| `state` | persisted `GapLifecycleState` | preserve Open/Acknowledged/Resolved/Suppressed exactly | `Suppressed -> Resolved`、Acknowledged -> Mitigated、Resolved -> repaired |
| `affected_object_ref` | accepted P12 source/affected binding and persisted gap revision | exact typed observation object; source/kind compatibility checked | source ref、projection scope、business object ref、page selector |
| `degraded_ref` | same-gap immutable degraded revision relation | None or exact gap/affected/scope relation; no synthetic normal revision | gap kind/count、P13 result ref mint、latest unrelated degraded row |
| `visibility` | persisted view surface plus P11 response ceiling | outer surface may only preserve or narrow; body rules remain lossless | row existence、actor role、HTTP status、state |
| `freshness` | persisted projection freshness surface | marker parity and consistency hint matrix; no promotion | request time、opened/closed time、row version、cursor |
| `last_updated_at` | committed gap projection replacement time | local observation metadata only; must not order source page unless owner says so | `opened_at` as universal order、query time、source event time |

The view is body-free. It does not contain raw telemetry, gap reason body, provider locator, policy basis, actor, repository version, cursor, retention proof, report/evidence body or business truth. `gap_ref` is both the gap identity and public view identity; no `GapStatusViewRef` is generated.

### 6.2 Lifecycle and degraded relation matrix

| stored lifecycle | public Q11 rule | degraded relation rule | source-truth statement |
|---|---|---|---|
| `Open` | return exact state when visible and policy permits | optional active/blocked same-gap revision | gap remains unresolved; no source conclusion |
| `Acknowledged` | preserve exact state; acknowledgement is not resolution | optional same-gap degraded revision | acknowledgement is an observation-side action only |
| `Resolved` | point and source history may expose it when retained/visible | retained relation must satisfy stored historical parity | resolved means local typed close basis, not source repair |
| `Suppressed` | preserve as historical state when rehydrated and visible | no implicit conversion to resolved or deletion | suppression is not resolution; current suppress/unsuppress callable is reserved |

Step 06 says current `Suppressed` transitions are reserved, but persisted historical rehydration may retain the state. Q11 therefore treats it as a value to preserve, not a transition to create. If a current adapter cannot safely rehydrate a stored Suppressed row, it returns typed consistency failure; it does not silently omit the item.

### 6.3 Identity and relation boundaries

| identity | owner | Q11 use | prohibited reuse |
|---|---|---|---|
| `GapStateRef` | `contracts::refs` / gap state owner | point selector and view identity | `GapSourceRef`, `AffectedObservationObjectRef`, projection ref |
| `GapSourceRef` | `contracts::refs` | by-source selector and page binding | current gap identity、authorization scope、projection scope |
| `AffectedObservationObjectRef` | `contracts::refs` | loaded relation and P13 target material | business/source truth ref、gap source ref |
| `DegradedOutputRef` | `contracts::refs` / immutable revision owner | optional same-gap relation only | durable state created by Query、gap identity |
| `ProjectionFreshnessMarkerRef` | `contracts::refs` / projection owner | marker parity and freshness source | page cursor、gap lifecycle version、request identity |
| `ObservationRequestDigest` / trace | application entry | input integrity/correlation only | projection or gap identity |

## 7. Page cursor、ordering与lifecycle completeness

### 7.1 Exact cursor binding

Q11 source page must call the existing exact binding factory:

```rust
ObservationRepositoryCursorBinding::for_gaps_by_source(
    source_ref: &GapSourceRef,
) -> Result<ObservationRepositoryCursorBinding, ApplicationError>
```

The current binding registry states:

```text
method tag: gaps_by_source
selector: complete GapSourceRef
order revision: 1
order: gap_ref ASC
position: P(K_REF("gap_state_ref", gap_ref))
```

The cursor includes the complete selector fingerprint and cannot be reused across source, method or order revision. `ObservationPageCursor` remains opaque; application rehydrates it against this exact binding before opening the read operation. Point requests have no page field and must not construct or validate a cursor.

### 7.2 Open order conflict

Step 07 §7.19 summary text separately describes gap paging as `(opened_at, gap_ref)`, while the exact cursor binding table defines `gap_ref ASC`. These are different ordering contracts and cannot both be current. Q11 adopts the exact binding table provisionally because it is the executable cursor registry, but records `S08-D-Q11-PAGE-ORDER-01`:

| item | current ruling |
|---|---|
| public Q11 order | `gap_ref ASC` under `gaps_by_source`, revision 1 |
| allowed fallback | none; do not infer timestamp order from `opened_at` or `last_updated_at` |
| required upstream repair | Step 07 synchronize §7.19 prose, adapter query ordering, fake/durable implementation and planned tests with one canonical order |
| current status | affected; Q11 cannot claim order closure until the duplicate Step 07 statements are reconciled |

The page is keyset-based. It must not use offset, insertion order, provider-native cursor, row version, current-state filtering or an adapter-selected default. A returned continuation must be the last returned complete `gap_ref` key and must strictly advance under the same binding.

### 7.3 Page item and lifecycle rules

| condition | required behavior |
|---|---|
| source selector valid and visible, lifecycle rows exist | return bounded items in canonical order; preserve each stored lifecycle state |
| source has more rows | `next_cursor` binds exactly to same source/order; `has_more=true` |
| source has no lifecycle rows and source existence is proven/disclosable | empty page: `items=[]`, `next_cursor=None`, `has_more=false`, `presence=Empty` |
| page returns zero items with a continuation | adapter/application invariant failure; never public success |
| row is `Resolved` | retain in page; no current-gap filter |
| row is historical `Suppressed` | retain if rehydratable/visible; do not rename or drop |
| duplicate `gap_ref` or source mismatch | typed relation/consistency failure; no partial page |
| caller cursor belongs to another source/order | `InvalidPageCursor` before repository/UoW |

The source page is not a “current gap list”. It is a bounded history projection for one complete typed source. If product consumers later need only current nonterminal gaps, that is a separate logical protocol and cannot be smuggled into Q11 through a hidden filter.

## 8. P10 / P11 / P13 policy boundary

### 8.1 P10 exact no-write target

For the point branch, Q11 can use the existing exact target vocabulary:

```rust
ReadEvaluationTargetRef::Object(
    ObservationObjectRef::GapState(gap_ref.clone()),
)
```

The enclosing P10 material must be:

```rust
NoWriteLocalTargetRef::Read {
    request_context_ref: same_query_context,
    target_ref: ReadEvaluationTargetRef::Object(
        ObservationObjectRef::GapState(gap_ref),
    ),
}
```

The target is a read selection, not permission to mutate the gap. A successful P10 decision proves only that this Query is allowed to attempt an observation-side read under the current no-write rule. It does not prove visibility, lifecycle transition authority, source correctness or repair permission.

The current `ReadEvaluationTargetRef` has no exact `GapSourceRef` lifecycle-page variant. Q11 must not encode a source page as `ProjectionScope`, because `GapSourceRef` is not an `ObservationProjectionScope` and page membership is not a projection-scope fact. Step 06/07 must add or select one finite source-lifecycle target owner and bind it to the page carrier; until then Q11 records `S08-D-Q11-POLICY-TARGET-01`.

The point and page target must satisfy these P10 rules:

| branch | target identity | allowed effect | forbidden interpretation |
|---|---|---|---|
| point | exact `GapStateRef` object | read committed gap projection | acknowledge, mitigate, close, suppress, unsuppress or repair |
| by-source page | exact `GapSourceRef` lifecycle selector after upstream target repair | bounded read of committed lifecycle projection | current-gap mutation, source scan, P12 evaluation or source truth ownership |

P10 construction is process-local and zero-write. Q11 never creates a `NoWriteViolation`, `ForbiddenWriteTargetRef`, H6 record or guard history merely because a selector is invalid or a read is blocked.

### 8.2 P11 visibility and disclosure ceiling

P11 consumes a complete `ReadVisibilityInputSnapshot` assembled from the exact Q11 target, the query metadata visibility scope, the committed projection freshness, the complete loaded gap policy snapshots and the P10 decision. Q11 does not construct or persist `ReadVisibilityState` or H7 `ReadAccessRecord`.

For a point item, the P11 target is exact and the source visibility provenance must come from the loaded `GapStatusView`/gap projection relation. For a page, P11 needs both a source-lifecycle target decision and per-item gap provenance. A page-level surface cannot be derived from the number of returned rows or from the most restrictive item unless the canonical mapper explicitly defines that lossless rule.

| material condition | point surface | source page surface |
|---|---|---|
| target and all required provenance are visible | `Visible` or committed `Restricted` according to P11 | page may be `Visible`/`Restricted`; each item keeps its own safe surface |
| target exists but body must be narrowed | response-level `Restricted`/limited surface with no widening | page-level narrowing must be explicit; do not silently remove hidden items and change pagination semantics |
| target is `NotVisible` or `Blocked` | no gap body; preserve only permitted outer surface | no item body/count/identity disclosure unless the page mapper has an explicit safe redacted-page contract |
| visibility provenance is unavailable or inconsistent | `Unknown`/typed visibility consistency result; no missing claim | no partial page; return `Unknown`/typed error according to the finite mapper |

The outer response visibility is never wider than P11. A `VisibilitySurface::Blocked(Some(gap_ref))` gap reference must be the exact current open/acknowledged visibility gap from the P11 provenance set; a guard-only block may carry `None`. Q11 cannot borrow an unrelated gap from the source page to explain a visibility block.

For a source page, hidden rows cannot simply be filtered out: doing so would leak or alter page cardinality and cursor progression. If the chosen public page contract cannot represent a hidden member without disclosure, the whole page must fail closed or return the explicitly defined limited/unknown surface; it must not return a partial list.

### 8.3 P13 degraded mapping

P13 is optional response mapping, not a durable side effect. It may run only after Q11 has assembled:

1. an exact observation-side target binding;
2. a complete P11 `ReadVisibilityDecision`;
3. an explicit `DegradedSafetyInputSnapshot`, including `NotApplicable` only where the target matrix permits it; and
4. a `GapPolicySnapshotSet` containing every referenced current gap revision and its exact relation.

For the point branch, the P13 target can be formed from the loaded `AffectedObservationObjectRef` when it maps exactly to one `ObservationObjectRef` and the visibility scope matches. For a source page, P13 must either have a canonical per-item target mapper or a page-level target rule that preserves every item relation. Q11 cannot construct `DegradedOutputRef` or call `DegradedOutputState::create_from_decision`/`replace_from_decision`.

| persisted / evaluated condition | Q11 rule |
|---|---|
| `degraded_ref=None` and complete P13 outcome is `Normal` | normal response candidate; no durable revision is minted |
| `degraded_ref` points to same-gap immutable revision | preserve the ref only after exact gap/affected/scope parity check |
| P13 outcome is `Limited` | map to a finite `DegradedSurface` with its typed reason and optional exact gap; body only if P11 permits |
| P13 outcome is `Blocked` | body absent; preserve P11/P13 block ceiling and exact optional gap |
| persisted degraded ref points to another gap/object or has invalid lifecycle | consistency error; do not detach, replace or downgrade it |
| gap is `Resolved` or historical `Suppressed` | retain historical relation if valid; do not treat it as a current effective gap or reopen it |

An `Unknown`, stale or unavailable dependency is not a P13 outcome. It must first be classified by the Q11 availability/freshness mapper; P13 cannot be synthesized from an exception string, gap count or lifecycle state.

### 8.4 Policy source closure matrix

| policy | point source | page source | current status |
|---|---|---|---|
| P10 | `GapStateRef` -> `ReadEvaluationTargetRef::Object` | no exact source-lifecycle variant | point target closed at design level; page target affected |
| P11 | point gap view/source provenance + complete gap snapshots | source-lifecycle target + per-item provenance + page disclosure rule | exact carrier/mapper affected |
| P12 | not called by Query | not called by Query | no new affected; historical classification is read-only |
| P13 | affected object + P11 decision + explicit safety + gap snapshots | per-item or canonical page target mapper required | exact source/mapper affected |

## 9. Freshness、rebuild、presence与surface

### 9.1 Freshness marker parity

`GapStatusView.freshness` is the persisted `ObservationProjectionFreshnessSurface`; `freshness_marker_ref` is its stable marker identity. Q11 may copy or safely narrow the committed surface, but it cannot promote it.

| freshness / hint | `AllowStale` | `RequireFresh` | `BestEffort` |
|---|---|---|---|
| `Fresh` | return candidate if other ceilings pass | return candidate if other ceilings pass | return candidate |
| `Stale` | return committed stale body only when policy permits | no normal body; typed stale/limited/unknown mapping | safest committed surface, never fabricated Fresh |
| `Rebuilding` | return only explicitly allowed committed limited body and rebuild surface | no normal Fresh claim; preserve rebuilding | limited/unknown according to policy; do not wait |
| `Unknown` | no inferred body or Fresh claim | no normal body | unknown/availability surface; no fallback read |

For a page, the outer `freshness` field must be sourced from one committed page boundary. It cannot be selected as the minimum, maximum, first item's marker, last item's marker, `last_updated_at`, `opened_at`, repository version or cursor. Each item still carries its own `freshness` and marker; the page carrier must prove that those item markers belong to the same page snapshot. If no common page freshness source exists, Q11 must not return a normal paged response and keeps `S08-D-Q11-SOURCE-PAGE-READ-BUNDLE-01` open.

### 9.2 Rebuild relation

Q11 only observes an already persisted rebuilding relation:

```text
GapStatusView.freshness == Rebuilding
  -> persisted freshness marker / progress reference
  -> RebuildProgressView
  -> MaintenanceTargetRef
  -> immutable MaintenanceTargetScopeBinding
  -> exact gap/source or member-scope relation
```

The current `GapStatusView` does not expose a progress reference. Therefore the Query-safe carrier must supply the relation as a bounded internal read fact and map it to the shared `ObservationRebuildSurface`; Q11 does not add a public field to the view. Missing, duplicate, latest-by-time or target-mismatched progress is a consistency/availability condition, not permission to query another target or repair the relation.

For a page, every item marked `Rebuilding` must have a valid relation, or the page mapper must explicitly classify the whole page as limited/unknown. It must not return a mixture that labels the page Fresh or silently omit rebuilding items.

Q11 never starts, resumes, waits for, advances, cancels, replaces or completes a rebuild. `Completed` progress does not prove source truth repair, gap resolution or Fresh projection.

### 9.3 Presence and absence matrix

#### Point selector

| read classification | response presence | body / missing / error rule |
|---|---|---|
| relation-valid visible committed gap | `Present` | `view=Some`; `missing=None`; no normal error |
| exact local absence with typed proof and existence disclosable | `Missing` | `view=None`; one exact `ObservationMissingSurface`; no synthetic gap/view |
| source anchor exists but point projection has not formed | `Missing(NotYetProjected)` only with formal anchor/reservation proof | `None` alone is insufficient |
| retention marker proves the point is outside retained observation window | `Missing(OutsideRetainedObservationWindow)` | requires typed retention relation; not inferred from time |
| source reference is formally unavailable | `Missing(SourceReferenceUnavailable)` | requires typed reference state; resolver timeout is not enough |
| hidden or existence not safely disclosable | `Unknown`/`NotVisible` surface | no view, missing or identity disclosure |
| dependency unavailable/disabled/failed | availability surface or typed error | never `Missing`/`NotFound` fallback |
| corrupt relation or marker mismatch | typed consistency error | no old/new mix and no partial body |

Point `ObservationQueryPresence::Empty` is invalid for Q11. An empty set inside another object is not a point gap result and cannot be used to manufacture one.

#### By-source page selector

| read classification | response presence | page rule |
|---|---|---|
| visible bounded page with items | `Present` | non-empty items, same-binding continuation, per-item lifecycle preserved |
| visible source exists and bounded page has no items | `Empty` | empty items, no cursor, `has_more=false`; does not mean source/business truth has no gaps outside this retained view |
| source existence cannot be disclosed | `Unknown`/visibility-limited | no item identity/count leakage; no `Missing` |
| source/page dependency unavailable | availability surface or typed error | no partial page and no `Empty` fallback |
| page relation/cursor/order corrupt | typed consistency/invalid cursor error | no partial page, no continuation |
| page contains stale/rebuilding/degraded items | `Present` only with complete outer mapper | preserve item surfaces and page-level freshness/degraded/rebuild; never promote |

Generic paged response does not carry `ObservationMissingSurface`; a source page cannot use `Missing` to represent an absent lifecycle item. If a future protocol needs source-target missing semantics, it must define a separate non-paged or operation-specific surface.

### 9.4 Availability source and adapter-family mapping

Q11 availability must be produced from a finite read-dependency snapshot, not from the first thrown exception. Required dependency classes are:

| dependency | required role | public family candidate |
|---|---|---|
| gap projection/read carrier | point view or source page material | `ProjectionStore` or `ObservationStore`, selected by the canonical port owner |
| marker/freshness relation | marker parity and freshness surface | same named projection read family; no second fallback store |
| source/page index | exact source binding, ordering and continuation | canonical projection/read family |
| policy material/decision source | P10/P11/P13 typed evaluation | application/domain policy source; exact mapping remains owner work |
| rebuild relation | only for persisted `Rebuilding` surface | projection/maintenance read family; no maintenance writer |

The exact mapping from these multi-dependency failures to `AdapterFamily::{Available, Degraded, Unavailable, Disabled, Failed}` is not uniquely defined by Step 07. Q11 requires a finite composite mapper with these rules:

- `Available` only when every required dependency for the selected branch is available and all loaded material passes relation validation;
- `Degraded` only when a typed policy explicitly permits a bounded committed limited surface;
- `Unavailable` when a required read owner cannot serve the selected branch;
- `Disabled` when the required capability is intentionally inactive or not activated;
- `Failed` for unclassified consistency/invariant failure after the owner has returned a result;
- no fallback store, current-source scan, timeout-to-missing conversion or provider detail leakage.

The exact family and multi-dependency precedence remain `S08-D-Q11-AVAILABILITY-SOURCE-01` affected. Q11 does not invent a new adapter family or expose endpoint, credential, SQL, provider code/message or stack.

### 9.5 Finite error and surface precedence

The Q11 response mapper must evaluate material classification before choosing the public surface. The following order is a target precedence, not an instruction to use the first repository call's error:

| priority | condition | required mapping | body / side effect |
|---:|---|---|---|
| 1 | query name/schema, unknown selector, malformed typed ref or forbidden field | `InvalidRequest` / protocol error | no repository/policy call; no body |
| 2 | invalid page syntax, foreign cursor, wrong method/selector/order binding | `InvalidPageCursor` | no UoW; no partial page |
| 3 | selector-to-target, source-to-gap, gap-to-affected or metadata relation cannot be established | typed relation/input error | no synthesized target or view |
| 4 | visibility basis cannot be safely established or existence must be hidden | `Unknown`/`NotVisible` finite surface | no existence/count/identity disclosure |
| 5 | required read/policy/progress dependency unavailable, disabled or failed | finite availability surface or typed application error | no fallback and no `Missing`/`Empty` |
| 6 | loaded rows disagree on identity, lifecycle, marker, degraded relation, source or cursor | typed consistency error | no old/new mix and no partial page |
| 7 | definitive point absence, or completed visible source page with no items | point `Missing`, page `Empty` | no synthetic identity; page gets no continuation |
| 8 | stale/rebuilding/unknown freshness or P13 limited/blocked outcome | preserve exact freshness/degraded/rebuild ceiling | no promotion, wait, repair or durable revision |
| 9 | all relation, policy and visibility gates pass | `Present` | read-only response only |

If a hidden target and an unavailable dependency coexist, the mapper must use its declared disclosure-safe rule and cannot expose the more specific condition. If any page item fails a relation gate, the page is not partially returned. Exact typed error variant and response summary ownership remain affected by `S08-D-QUERY-SURFACE-MAPPER-01` and Q11's own `S08-D-Q11-SURFACE-MAPPER-01`.

## 10. Response invariants and zero-write boundary

### 10.1 Point response invariants

`ObservationQueryResponse<GapStatusView>` for Q11 must verify:

- `query_name` is statically `GetGapStatus` and the response branch is `Point`;
- `presence=Empty` is rejected;
- `Present` has one view whose `gap_ref` equals the requested ref, with `missing=None` and no unauthorized body;
- `Missing` has no view, exactly one typed missing surface and no hidden/error masking;
- `Unknown` does not disclose gap/source/affected identity unless a formal limited surface explicitly permits it;
- view source/kind/affected/degraded/lifecycle/marker/freshness fields pass the same-boundary relation checks;
- `degraded` and `rebuild` are derived only from typed P13/material relations, never from state names or exception text;
- `error` never coexists with a normal successful body;
- no public field contains raw telemetry/audit/evidence/report body, policy basis, repository version, cursor internals, provider detail or business truth.

### 10.2 Paged response invariants

`ObservationPagedQueryResponse<GapStatusView>` must verify:

- `query_name` is `GetGapStatus` and the normalized branch is `BySource`;
- `Missing` is rejected for a generic page; `Present` has non-empty items and `Empty` has no items;
- every item has a unique `gap_ref`, exact requested `source_ref`, valid lifecycle and same-boundary marker/degraded relation;
- item order and continuation match the one exact binding; `next_cursor` is absent on an empty page;
- outer visibility/freshness/degraded/availability/rebuild surfaces are produced by the page composite mapper, not copied from the first item;
- a page with hidden, corrupt or unavailable members is not silently filtered or downgraded to an ordinary empty page;
- no repository row version, application cursor object, source body or provider detail leaks through the public page.

### 10.3 Zero-write matrix

| candidate side effect | Q11 ruling |
|---|---|
| create/begin UoW or reserve idempotency | forbidden |
| call full `ObservationUnitOfWork`, `ObservationProjectionStore` or writer version port | forbidden |
| open, acknowledge, mitigate, close, suppress or unsuppress `GapState` | forbidden |
| rerun P12 or create `GapOpened` / `GapTransitionRecord` | forbidden |
| create/replace `DegradedOutputState` or consume a replacement identity | forbidden |
| create/replace projection marker, `GapStatusView`, freshness sidecar or rebuild progress | forbidden |
| append H6/H8/H12/H7, outbox, stored result or read-access audit | forbidden |
| call source resolver/membership planner to fill missing material | forbidden |
| start, wait for, resume, advance, cancel or repair rebuild | forbidden |
| retry another store or scan current source truth after a read miss | forbidden |
| write source/business truth, evidence body, report verdict, acceptance or signoff | forbidden |
| repeat an identical Query | ordinary read repeat; no Command idempotency/replay surface |

Every invalid, unavailable, inconsistent, stale, hidden and successful branch leaves committed gap state, lifecycle records, degraded revisions, projection markers, source truth, external systems and durable audit/outbox state unchanged.

## 11. Field / owner / affected closure table

| closure item | current owner / callable | Q11 conclusion |
|---|---|---|
| logical operation | `ObservationQueryName::GetGapStatus` / S08-B finite Query registry | one operation retained; no fifteenth Query |
| public request | Step06/07 `GetGapStatusRequest` use-site only | target tagged selector fixed; declaration/wire/decoder owner affected |
| application input | `application::inputs::GetGapStatusInput` | Query control fields known; three Options must become one normalized selector |
| API assembly | `ObservationApiInputAssembler::get_gap_status` | exact callable recorded; branch validation and page binding required |
| Read façade | `ObservationReadService::get_gap_status` | exact current single-result signature recorded; point/page result cardinality affected |
| public point response | `ObservationQueryResponse<GapStatusView>` | target shape and presence rules fixed |
| public page response | `ObservationPagedQueryResponse<GapStatusView>` | target shape, page rules and lifecycle completeness fixed; application carrier affected |
| page request | S08-B `ObservationPageRequest` | canonical target name reused; R06.8-A legacy name conflict remains shared affected |
| point query capability | `ObservationProjectionQueryStore::get_gap_status` | least-authority callable exists but lacks typed absence/same-gap bundle proof |
| source page capability | full UoW `page_gaps_by_source` only | unsuitable for Query; least-authority composite page callable missing |
| gap domain object | Step06 `domain::gap::GapState` | exact lifecycle/source/kind/affected/degraded relation consumed read-only; P12 not rerun |
| public view | Step06 `contracts::views::GapStatusView` | unique schema/factory owner reused; identity is `GapStateRef` |
| source selector | Step06 `contracts::refs::GapSourceRef` | complete structured selector required; no source-id or inner-ref fallback |
| page cursor | `for_gaps_by_source` / repository page codec | exact binding known; duplicate Step07 order wording affected |
| P10 target | `ReadEvaluationTargetRef` / P10 | point target exact; source lifecycle target absent |
| P11 decision | `ReadVisibilityPolicy` / `ReadVisibilityDecision` | canonical owner exists; Q11 point/page provenance and disclosure mapper affected |
| P12 classification | `GapClassificationPolicy` / persisted gap | no Q11 call; historical classification preserved |
| P13 decision | `DegradedOutputPolicy` / `DegradedOutputDecision` | canonical owner exists; Q11 per-item/page target mapper affected |
| marker/freshness | `ProjectionFreshnessMarkerRef` + `ObservationProjectionFreshnessSurface` | unique types closed; same-boundary point/page source affected |
| rebuild | `RebuildProgressView` + `get_rebuild_progress_by_ref` relation vocabulary | view has no progress field; Query-safe gap relation carrier affected |
| presence | shared point/page response carriers | target matrices fixed; point typed absence source affected |
| availability | `ObservationAvailabilitySurface` | finite public variants exist; Q11 multi-dependency source/precedence affected |
| response mapper | application result -> contracts response | target invariants fixed; exact branch-specific mapper affected |
| Step09 handoff | `GetGapStatusFlow` | reserved only; no function-level flow body in this batch |

## 12. Q11 affected register

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q11-REQUEST-SCHEMA-01` | `open_upstream_internal` | `GetGapStatusRequest`只有use-site；缺一个canonical tagged selector declaration、wire discriminator、sealed Query binding、unknown-field和decoder owner | Step06/07在`contracts::queries`或既定owner声明唯一`Point { gap_ref } / BySource { source_ref, page }` schema并传播exact binding | Step08创建第二owner/alias、保留三Options wire、以page存在性猜variant或新增第十五Query |
| `S08-D-Q11-SELECTOR-CARDINALITY-01` | `open_internal_affected` | `GetGapStatusInput`以三个Options表达八种组合，只有point/no-page和source/required-page两种合法，无法由type阻止非法state | 在application input owner增加private normalized selector carrier，assembler原子构造且service穷尽match两branch | service内first-wins、default page、global scan、point忽略page、source只取current gap |
| `S08-D-Q11-RESULT-CARDINALITY-01` | `open_internal_affected` | Read façade只返回`ObservationQueryResult<GapStatusView>`，不能无损表达point与paged response两种cardinality | 唯一化operation-specific result或等价sealed carrier，修订Read façade和exact response assembler，使input/result branch静态对应 | 把page塞进single view、entry cast、只返回第一页/第一项、创建并行unregistered façade |
| `S08-D-Q11-POINT-READ-BUNDLE-01` | `open_internal_affected` | point facet只返回`Option<GapStatusView>`，不能证明view、GapState revision、same-gap degraded relation、marker、visibility、absence和availability来自同一committed boundary | 提供least-authority point composite carrier和total adapter rehydrate，且不暴露version/writer | N+1 gap/degraded/marker lookup、`None -> NotFound`、调用full store/UoW或默认多次read一致 |
| `S08-D-Q11-SOURCE-PAGE-READ-BUNDLE-01` | `open_internal_affected` | Query facet没有source page；full UoW page只返回`Versioned<GapState>`，缺public view、marker、degraded、visibility、freshness、source existence和page-level same-boundary proof | 增加bounded least-authority source lifecycle page carrier/callable，返回完整view material与same-binding continuation且保留Resolved/Suppressed | 授予full retention/UoW capability、逐项point lookup、domain/version leakage、hidden filtering、只查current nonterminal gap |
| `S08-D-Q11-PAGE-ORDER-01` | `open_internal_affected` | Step07 exact cursor table规定`gap_ref ASC`，§7.19摘要规定`(opened_at, gap_ref)`，cursor/order revision truth冲突 | 在Step07统一binding table、repository trait prose、durable/fake adapter和planned tests；若改变order则显式提升revision | adapter自选顺序、timestamp默认、offset、保留同revision却改变keyshape、把冲突标pass |
| `S08-D-Q11-POLICY-TARGET-01` | `open_upstream_internal` | point可映射`ReadEvaluationTargetRef::Object(GapState)`，但by-source lifecycle selector无法精确映射现有五类read target且不是ProjectionScope | 在Step06 policy vocabulary增加/选择一个有限source-lifecycle target并传播P10/P11 exact relation，或提供等价target-bound composite owner | 将`GapSourceRef`伪装成ProjectionScope/Object、用first item target代表page、page selector跳过P10/P11 |
| `S08-D-Q11-VISIBILITY-SOURCE-01` | `open_internal_affected` | point/page缺P11所需complete source provenance、constraint/block reason、gap revisions和page disclosure规则；过滤hidden items会改变count/cursor语义 | 提供Q11专属point/page visibility source与outer ceiling mapper，明确whole-page fail-closed/limited语义和per-item relation | 从row existence/state/count/actor/HTTP status推导、drop hidden rows、借unrelated gap解释block、扩大persisted surface |
| `S08-D-Q11-FRESHNESS-SOURCE-01` | `open_internal_affected` | item marker/freshness owner存在，但缺point bundle parity及覆盖整页items/continuation/visibility的共同committed page freshness source | 定义Q11 branch-specific freshness source、marker parity和consistency-hint mapper；page carrier保存共同boundary | 用row version/time/cursor/first-last item/min-max freshness伪造outer surface或把Stale升级Fresh |
| `S08-D-Q11-REBUILD-RELATION-01` | `open_internal_affected` | `GapStatusView`无progress ref，Rebuilding时缺marker到progress、maintenance target、immutable binding和gap/source membership的Query-safe证明 | 在read carrier中提供persisted progress-by-ref relation与target/scope membership proof并定义page mixed-state mapping | mint/latest-select progress、按target二次猜查、等待/推进/修复rebuild、Completed当source repair或gap resolved |
| `S08-D-Q11-DEGRADED-SOURCE-01` | `open_internal_affected` | persisted degraded ref parity与P13 response decision需要exact affected object、P11 decision、explicit safety和complete gap revisions；page per-item/outer mapping未唯一化 | 提供same-gap revision relation和Q11 per-item/page P13 input mapper；Query只映射surface，不创建revision | 从gap kind/state/count/error推导degraded、用latest revision、创建`DegradedOutputState`或以Resolved触发Normal |
| `S08-D-Q11-MISSING-PRESENCE-01` | `open_internal_affected` | point `Option<GapStatusView>`不能区分visible local absence、not-yet-projected、retention/reference absence、hidden、corrupt和unavailable；page empty还需source existence proof | 提供typed point absence/anchor/retention/reference proofs和page source-existence/completed-read proof，固定visibility-before-existence | `None -> NotFound/Empty`、resolver timeout当missing、空page证明source无gap、合成view/gap identity |
| `S08-D-Q11-AVAILABILITY-SOURCE-01` | `open_internal_affected` | point/page projection、source index、marker、policy和rebuild依赖到public availability/AdapterFamily/error的multi-dependency mapping未闭合 | 定义branch-specific dependency snapshot、canonical family与disclosure-safe precedence | default Available、first error wins、fallback store/source scan、timeout当Missing/Empty或泄露provider detail |
| `S08-D-Q11-SURFACE-MAPPER-01` | `open_internal_affected` | invalid selector/cursor、hidden、point missing、page empty、relation corruption、stale/rebuilding、degraded、availability和error最终precedence/body matrix无唯一application owner | 提供finite Q11 result summary/response assembler，分别验证point/page invariants并只做lossless mapping | entry补查字段、partial page、首个exception、state字符串、item count或HTTP status决定surface |

Q11 additionally reuses but does not close these shared affected items:

- `S08-D-PAGE-REQUEST-TYPE-01`: R06.8-A `ObservationPublicPageRequest` and S08-B `ObservationPageRequest` still conflict.
- `S08-D-PAGED-RESULT-CARRIER-01`: the generic application paged-result owner remains unresolved; Q11 adds its own operation-cardinality seam.
- `S08-D-QUERY-SURFACE-MAPPER-01`: the cross-Query result-to-response mapper still requires a final totality audit.
- `R06.6-F2-H13-UPSTREAM`: unrelated to Q11, remains `open_controlled` and is not closed here.

This batch adds 14 Q11 affected items. They are internal or upstream-internal design closure gaps, not a new external upstream blocker. Their target behavior is defined here, but they must not be reported as implemented or unconditionally complete.

## 13. Step 09 handoff（仅登记）

`GetGapStatusFlow` is the sole Q11 flow name. Step 09 must consume the tagged selector and preserve both branches under one operation:

```text
GetGapStatusRequest(selector)
  -> exact Query name / schema / metadata validation
  -> decode exactly one Point or BySource selector
  -> build Query digest, context and normalized input
  -> branch Point(gap_ref)
       -> one least-authority committed point bundle
       -> validate gap/view/degraded/marker/absence relations
  -> branch BySource(source_ref, page)
       -> exact gaps_by_source cursor binding
       -> one least-authority complete-lifecycle page bundle
       -> validate every source/item/order/continuation relation
  -> P10 exact branch target
  -> P11 visibility and disclosure-safe outer ceiling
  -> optional P13 response-only degraded decision
  -> classify freshness/rebuild/presence/availability/error
  -> GetGapStatusResult::Point or ::BySource
  -> matching ObservationQueryResponse or ObservationPagedQueryResponse
```

Step 09 must not add:

- another public Query name, untagged selector, global scan or implicit default page;
- `find_current_gap_by_source` as a substitute for complete lifecycle page;
- N+1 point calls, full UoW/repository access or page item filtering that changes cursor semantics;
- P12 replay, gap/degraded mutation, H7/H8/H12, outbox, stored result or durable read receipt;
- source resolver fallback, projection repair, synchronous rebuild, wait-for-fresh or business/source truth write;
- a claim that Resolved means source repaired or Suppressed means Resolved.

### 13.1 Planned implementation cuts

| cut | planned assertion | status |
|---|---|---|
| selector totality | exactly two variants; all legacy invalid combinations rejected before port calls | `planned/not_run` |
| result cardinality | Point input cannot produce page result and BySource cannot produce point result | `planned/not_run` |
| point bundle | identity/source/kind/affected/degraded/marker/freshness/absence parity under one read boundary | `planned/not_run` |
| source page | complete lifecycle retains Resolved/Suppressed, exact source relation, no hidden filtering or N+1 | `planned/not_run` |
| cursor | cross-source/method/order replay rejected; exact canonical order and empty continuation rules | `planned/not_run` |
| policy | point/page P10/P11 target binding, P13 response-only mapping and zero durable side effects | `planned/not_run` |
| surfaces | point Missing vs page Empty vs Unknown/Unavailable/Corrupt precedence | `planned/not_run` |
| no-write | all spies for UoW/writer/P12/H7/H8/H12/outbox/rebuild/source adapter remain zero | `planned/not_run` |

No implementation test, run id, evidence alias, acceptance result or signoff is claimed.

## 14. Q11 stop review

| check | conclusion |
|---|---|
| independent request/input/result/view/read-chain/page/policy/presence/error/no-write/handoff record | `pass_with_affected_open` |
| one logical Query with exact point/page selector | target contract pass; request/input owner repairs remain affected |
| exact assembler and current Read façade recorded | pass at observed owner level; result cardinality repair remains affected |
| `GapStatusView` / `GapStateRef` owner duplicated | no; Step06 unique view/ref owner reused |
| `GapViewScope`, `GapStatusViewRef` or degraded ref set introduced | no |
| point and source page read capabilities distinguished | pass; point/page bundle gaps registered separately |
| source page preserves complete lifecycle including Resolved/Suppressed | pass at target-contract level; least-authority carrier remains affected |
| cursor/order is unambiguous in current material | no; exact table vs summary conflict registered, target provisionally uses `gap_ref ASC` revision 1 |
| P12 rerun or gap lifecycle mutation allowed | no |
| P10/P11 target exact for both branches | point yes; source lifecycle target affected |
| visibility can filter hidden items and still claim complete page | no; fail-closed/limited mapper required |
| freshness/rebuild/degraded/availability sources closed | target behavior defined; exact carriers/mappers remain affected |
| point `None` defaulted to Missing or page zero rows defaulted to Empty | no; typed absence/source-existence proofs required |
| Query remains zero-write and does not own source/business truth | pass_design_only |
| all 14 Q11 affected registered | pass |
| new external upstream blocker | none; known `R06.6-F2-H13-UPSTREAM=open_controlled` is unrelated |
| current protocol count | `27/60 defined_with_affected_open`; Query `11/14`; `0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q12 |
| current commit | not needed; user did not request one |

Q11 is design-only discussion material. It does not modify formal `03`, implementation code, test evidence, acceptance state or any downstream formal document.

## 15. Recovery point

```text
Step08_S08-D_Q11_defined_with_affected_open_waiting_user_before_Q12
```

Before explicit user confirmation, do not read or write Q12-Q14, S08-E~G, Step 09-19, formal `03`, any `04` file or implementation code. The next permitted reading after confirmation is only the Step 06/07 owner and callable material required by Q12 `GetPeripheralExportView`.
