# L4-observability 03-详细设计 Step 08 - S08-D Query Q12 `GetPeripheralExportView`

> 本文件是 Q12 的独立讨论中间产物。它只覆盖 `GetPeripheralExportView`，不关闭 Q13-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q12 |
| 逻辑协议 | `Query / GetPeripheralExportView / GetPeripheralExportViewRequest` |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q13` |
| 协议计数 | `28/60 defined_with_affected_open`；`0/60` 无条件 complete |
| Query 计数 | `12/14 defined_with_affected_open`；Q13-Q14 尚未逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 继续冻结，只允许 Step 19 重装配 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q13 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

Q12 读取一个已经提交的、observation-owned、product-neutral peripheral projection。它向 dashboard、alert、analysis 和外部审计准备链提供安全的 body-free view，但不拥有业务 truth、source truth、external audit truth、delivery truth 或 provider state。Q12 只返回本地 committed projection surface；它不创建 export preparation，不执行 delivery，不调用 external adapter，也不把读取结果写回任何业务或观测 truth。

### 1.1 本批禁止事项

- 不读取或写入 Q13-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 创建第二个 `DashboardAlertExportView`、`DashboardAlertExportViewRef`、consumer scope wrapper 或新的 peripheral truth owner。
- 不恢复历史 `PeripheralConsumerScopeRef`；当前 selector 必须保留完整 `PeripheralConsumerRef + ObservationProjectionScope`。
- 不把 request 中的 `export_allowed`、`consumer_state` 或 `consumer_scope` 当作授权事实；它们只能作为完整结构化 selector/digest material，并与 trusted current snapshot 和 committed view relation 校验。
- 不把 `PeripheralConsumerRefId`、consumer scope、projection scope 的序列化、request digest、route、endpoint 或产品名派生为 view identity。
- 不调用 `PeripheralExportPolicy::evaluate_preparation`、`evaluate_delivery`，不创建 `ExternalAuditExportPreparation`、`PeripheralDeliveryState` 或任何 P14 transition。
- 不调用 `PeripheralExportDelivery`、`ReportHandoffDelivery` 或任意 external adapter；`Disabled`、`Unavailable`、`Failed` 只作为安全 availability surface 或 typed error 映射。
- 不从 `Option<DashboardAlertExportView>` 推断 `NotFound`、`NotYetProjected`、`Empty`、`NotVisible` 或 `SourceReferenceUnavailable`；每种 absence 必须有 typed proof。
- 不从 view 的 `visibility`、state 名称、gap 数量、错误文本、HTTP status、row version 或 query time 推导 freshness、degraded、availability 或授权。
- 不在 Query 中创建/替换 `DegradedOutputState`、gap、freshness marker、rebuild progress、read-access record、outbox、stored result、UoW 或 idempotency reservation。
- 不等待、启动、恢复、推进、完成、取消或修复 rebuild；只验证已提交 marker 到 progress/maintenance target relation。
- 不伪造实现 commit、run_id、evidence alias、测试结果、验收签署或真实 evidence。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 08 | Query 独立协议、request/response、marker、visibility/freshness/degraded/error/no-write 和停审要求 |
| `standards/document/详细设计书写规范.md` 5.6/5.7 | public DTO、二级类型、字段来源、Query surface、协议到对象/flow 回指结构 |
| `standards/document/设计真相源闭环与可落码性标准.md` | stable identity、selector/cardinality、same-boundary read、P10/P11/P13、Query zero-write 和 owner 闭环 |
| `03_ddd_step_06_application_input_assembly_r06_8a.md` | Q12 concrete input、four Query control fields 和 exact assembler use-site |
| `03_ddd_step_06_application_digest_canonicalizer.md` | Q12 digest field order、structured consumer/scope pair 和 query metadata exclusion |
| `03_ddd_step_06_application_operation_context_idempotency.md` | `GetPeripheralExportView` finite Query operation、zero-key query context |
| `03_ddd_step_06_boundary_read_maintenance.md` | `DashboardAlertExportView`、freshness、visibility、peripheral delivery/preparation state 和 no-truth boundary |
| `03_ddd_step_06_contracts_carriers.md` | `PeripheralConsumerRef`、`ObservationProjectionScope`、typed refs、`ObservationObjectRef`、public surfaces 和 `AdapterFamily` |
| `03_ddd_step_06_policy_guard_records.md` | P10 `NoWriteGuardPolicy`、P11 `ReadVisibilityPolicy`、P13 `DegradedOutputPolicy`、P14 separation and exact target rules |
| `03_ddd_step_06_runtime_availability.md` | product-neutral availability snapshot、four classification kinds 和 Query cannot probe/write rule |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | exact assembler、Read façade、least-authority point facet、writer-only lookup/replace ports和Query capability boundary |
| current S08-B shared carrier in `03_ddd_step_08_protocol_contracts.md` | Query metadata、digest、`ObservationQueryResult<T>`、point response presence/surface matrix |
| current Q09-Q11 records | 逐协议 same-boundary、typed absence、surface precedence、policy binding、zero-write 和 stop-review 粒度参考；不复制其 domain truth |

### 2.2 权威顺序

```text
current Q12 record / affected register
  > Step 07 exact assembler, Read facade and query facet
  > Step 06 DashboardAlertExportView / consumer / scope / policy / availability owners
  > S08-B shared Query request/result/surface carrier
  > current formal 02 and HLD query skeleton
  > frozen formal 03, old README and historical export wording
```

Step 08 只定义协议如何选择、读取和映射 Step 06/07 的 canonical owners；它不重新声明 view、consumer、policy、marker 或 availability type。任何无法由 current owner 证明的关系都登记为 affected，而不是用旧正式文档或兼容 alias 补齐。

### 2.3 Historical material 裁定

| 旧材料 | current disposition | 裁定 |
|---|---|---|
| `PeripheralConsumerRef` 被写成 transparent `BodyFreeRef` | `historical_material_replaced` | current 是包含 id/kind/scope/export flag/state 的 structured carrier；完整字段进入 wire/digest，但 caller state/flag 不成为授权来源 |
| `PeripheralConsumerScopeRef` 作为 Q12 单一 selector | `historical_material_replaced` | 无 current owner；用 `PeripheralConsumerRef + ObservationProjectionScope`，不建立 alias 或第二 wrapper |
| Q12 读取后直接进入 export preparation/delivery | `historical_material_rejected` | Query 只读 projection；P14 preparation/delivery 属于独立写侧/外部效果边界 |
| `Option<DashboardAlertExportView>` 直接映射 `NotFound` | `current conflict; affected` | `None` 缺少 typed absence/visibility/availability proof，不能默认分类 |
| current view 只有单对象返回 | `current capability insufficient; affected` | 需要一个 least-authority same-boundary point bundle；不得用多次 point lookup或writer version port拼装 |
| view identity 由 consumer/scope hash 或 request digest 派生 | `historical_material_rejected` | identity 由首次 projection 创建时的 application id authority生成，replacement 保持稳定 |
| external adapter `Disabled` 被映射为 local view missing | `historical_material_rejected` | external availability 与 local projection presence 独立；disabled 不阻断已提交 local view 的读取，也不制造 local missing |

## 3. SOP 问题回答

| # | 问题 | Q12 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetPeripheralExportView` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> least-authority peripheral projection read |
| 3 | 调用方与处理方 | exact API handler 调用 `ObservationApiInputAssembler::get_peripheral_export_view`，再调用 `ObservationReadService::get_peripheral_export_view` |
| 4 | 传输方式 | typed logical Query request/response；HTTP/RPC locator 后置 Step 14/`04`，不进入 DTO |
| 5 | public request schema | `consumer_ref: PeripheralConsumerRef` 与 `scope: ObservationProjectionScope` 两个 required fields；不接受 route/product/endpoint |
| 6 | application input | 上述 pair + Query context、visibility scope、consistency、requested time；不保留旧 wrapper |
| 7 | response schema | non-paged `ObservationQueryResponse<DashboardAlertExportView>`；`Empty` 非法 |
| 8 | lookup key | `(consumer_ref stable identity, canonical ObservationProjectionScope)`；不是 product route，也不是 scope alone |
| 9 | view owner | Step 06 唯一 `contracts::views::DashboardAlertExportView`；Q12 不创建第二 owner |
| 10 | view fields | `view_ref`、`freshness_marker_ref`、structured `consumer_ref`、`scope`、`read_model_ref`、optional diagnostic/gap refs、`visibility`、`freshness` |
| 11 | identity | `view_ref` 首次 committed projection 创建时生成，replacement 保持稳定；`freshness_marker_ref` 同样保持其 marker identity；二者不得由 pair/hash/digest 派生 |
| 12 | field source | view 与 read model、diagnostic/gap relation、visibility provenance、freshness marker、rebuild relation 和 availability 来自同一 Query-safe committed boundary |
| 13 | export policy | P11 可用于 read visibility；P13 只做 response-only degraded mapping；P14 preparation/delivery 不在 Q12 执行 |
| 14 | presence | point `Present` 或 typed `Missing`/`Unknown`；不使用 `Empty`，不将 hidden/unavailable/corrupt 压成 missing |
| 15 | visibility | request `VisibilityScopeRef` 是 metadata；P11 只能保持/收窄 committed visibility，不能由 caller 提交 `Visible` 授权 |
| 16 | freshness | 只复制 persisted `ObservationProjectionFreshnessSurface`；`Fresh` 必须有 marker parity，`Stale/Rebuilding/Unknown` 不升级 |
| 17 | degraded | P13 仅基于 exact target、P11 decision、explicit safety input 和 complete current gap revisions做 process-local mapping；不创建 durable degraded revision |
| 18 | rebuild | 只验证 persisted `progress_ref -> RebuildProgressView -> MaintenanceTargetScopeBinding` relation；不执行维护动作 |
| 19 | availability | local projection read availability 与 optional external export availability 分离；Q12 不 probe external delivery adapter |
| 20 | error | malformed selector/digest、typed relation mismatch、persistence failure、availability failure 和 invariant corruption 分层；normal Missing/NotVisible 不作为 generic error |
| 21 | actor authority | actor 来自 trusted Query metadata；body 不提交 actor、policy decision 或 delivery result |
| 22 | no-write | 不创建 UoW/reservation/result/record/outbox/degraded/gap/marker/rebuild/adapter side effect |
| 23 | Step09 回指 | 只登记一个 `GetPeripheralExportViewFlow`；本批不展开函数级 flow |

## 4. Logical binding、request 与 normalized input

### 4.1 一个逻辑 Query、一个 point cardinality

Q12 保留一个逻辑协议，不新增 `PreparePeripheralExportView` 或 `GetPeripheralExportViewByRoute`。目标 public body 为：

```rust
/// Selects one observation-owned peripheral projection.
pub struct GetPeripheralExportViewRequest {
    pub consumer_ref: PeripheralConsumerRef,
    pub scope: ObservationProjectionScope,
}
```

上述代码是 Q12 的目标协议形态，不在 Step 08 创建 canonical declaration owner。两个字段均 required；空、malformed、wrong-owner、cross-kind 或 scope payload absent 在 digest 和 repository 调用前拒绝。没有 page、cursor、filter、route、product name、destination、credential、external preparation ref 或 delivery result。

`PeripheralConsumerRef` 的完整 structured shape 必须参与 wire 与 digest：`peripheral_consumer_ref_id`、`consumer_kind`、`consumer_scope`、`export_allowed`、`consumer_state`。但是这五个字段在 request 中表示 caller 已验证的 selector snapshot，不表示 caller 可以改变 local catalog、visibility 或 export authorization。application 必须在 read boundary 中验证其与 committed view 的 stable identity/kind/scope 关系，并在需要 policy/visibility 时取得 trusted current consumer snapshot；不能仅信任 request 的 state/flag。

### 4.2 Shared Query metadata 与 digest

Q12 使用既有 `ObservationQueryRequest<GetPeripheralExportViewRequest>` 和四个 Query control fields：

| 字段 | source / digest | Q12 规则 |
|---|---|---|
| `actor_ref` | trusted Query metadata；进入 query material | 只表达调用主体的 body-free identity，不从 consumer body或route猜测 |
| `trace_ref` | trusted metadata；排除 digest | 只作相关性复制，可为 `None`，不参与授权、lookup或freshness |
| `visibility_scope_ref` | trusted metadata；进入 digest | 是 P11 request scope input，不是 consumer scope，也不授予 `Visible` |
| `consistency` | trusted metadata；显式编码 absent/present | 只选择已提交 surface，不等待、刷新或重建 |
| `requested_at` | trusted metadata；排除 digest | 不得生成 view identity、freshness 或 absence |
| `consumer_ref` | typed request body；按 structured field order进入 digest | caller selector snapshot；不能覆盖 committed consumer/current policy |
| `scope` | typed request body；按 canonical scope bytes进入 digest | 唯一 projection scope component；不生成 view ref |

Q12 使用 `get_peripheral_export_view` 的既有 Query canonical material：

```text
{"operation":"get_peripheral_export_view",
 "actor_ref":<typed-ref>,
 "visibility_scope_ref":<typed-ref>,
 "consistency":<option-enum>,
 "body":{
   "consumer_ref":<complete-structured-consumer-ref>,
   "scope":<canonical-observation-projection-scope>
 }}
```

canonicalizer 只执行 typed validation、canonical encoding 和 digest；不读取 repository、policy、config、resolver 或 adapter。Query context 是 zero-key、无 event identity 的 process-local value；digest 不进入 reservation、stored result、outbox、cursor、freshness marker 或 history。

### 4.3 Normalized application input

当前 application input owner 是 `application::inputs::GetPeripheralExportViewInput`，目标字段为：

```rust
pub(crate) struct GetPeripheralExportViewInput {
    context: ObservationOperationContext,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
    consumer_ref: PeripheralConsumerRef,
    scope: ObservationProjectionScope,
}
```

该结构只是目标字段清单；constructor、private field visibility 和 exact revalidation 仍归 Step 06/07 owner。Q12 不需要 selector normalization，因为两个字段的 cardinality 是固定的 required pair。assembler 顺序固定为：

1. 校验 Query name 与 sealed body binding 为 `GetPeripheralExportView`。
2. 校验 actor、trace、visibility scope、consistency 和 requested time 的 metadata 形状。
3. 校验完整 `PeripheralConsumerRef`、canonical `ObservationProjectionScope` 及 consumer/scope compatibility。
4. 按 Q12 exact material 生成一次 digest；不由 entry 自行 hash。
5. 由 private operation-context factory 形成 zero-key Query context。
6. 原子构造 `GetPeripheralExportViewInput`；失败不得产生 partial input 或 repository call。

assembler 不调用 current consumer repository、projection store、P11/P13/P14 policy、resolver 或 external adapter。它只能拒绝 malformed/invalid input，不能在入口层把 caller state 改成 Active、把 export flag改成Allowed，或查询后补写字段。

## 5. Exact Read façade、query authority 与处理权限

### 5.1 Exact observed application callable

| item | current contract |
|---|---|
| exact assembler | `ObservationApiInputAssembler::get_peripheral_export_view(ObservationQueryRequest<GetPeripheralExportViewRequest>) -> Result<GetPeripheralExportViewInput, ApplicationError>` |
| exact Read façade | `ObservationReadService::get_peripheral_export_view(GetPeripheralExportViewInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<DashboardAlertExportView>>` |
| current query capability | `Arc<dyn ObservationProjectionQueryStore>` |
| current point callable | `get_peripheral_export_view(&PeripheralConsumerRef, &ObservationProjectionScope) -> ApplicationPortFuture<'_, Option<DashboardAlertExportView>>` |
| writer-only callable | `get_peripheral_export_view_by_ref` / `get_peripheral_export_view_with_version` / `replace_peripheral_export_view` on full `ObservationProjectionStore` |
| public response target | non-paged `ObservationQueryResponse<DashboardAlertExportView>` |
| required flow handoff | `GetPeripheralExportViewFlow` |

The Query service receives only the read facet. It cannot downcast to `ObservationProjectionStore`, obtain a `Versioned<DashboardAlertExportView>`, stage a replacement, or call a writer-side `by_ref` lookup. The writer-side methods are useful for command/job validation and atomic replacement, but their version and UoW capability are not Query authority.

### 5.2 Required least-authority point bundle

The current point callable returns only `Option<DashboardAlertExportView>`. That is insufficient evidence for a Q12 response because the view alone cannot prove that the following values were read from one committed boundary:

| required material | required relation |
|---|---|
| view identity and full view fields | `view.consumer_ref` and `view.scope` equal request selector; `view_ref` and marker ref are canonical |
| `ObservationReadModel` | `view.read_model_ref` identifies the exact committed read model used for this view |
| optional diagnostic/gap relation | optional refs are either absent by a typed relation or point to exact current revisions in the same boundary |
| consumer snapshot | stable id/kind/scope match; current state/export flag are loaded from trusted catalog/repository and are not caller-authorized |
| visibility provenance | persisted `VisibilitySurface`, constraint/block provenance and bound gap revisions are complete enough for P11 |
| freshness marker | `view.freshness_marker_ref` matches the persisted freshness surface; no time/row-version substitution |
| rebuild relation | `Rebuilding` progress ref, if present, resolves to exact progress/target/scope binding without starting work |
| degraded relation | persisted degraded relation, if any, matches exact affected object, gap revision, P11/P13 input and limited flag |
| availability snapshot | every required local read dependency is classified by a finite typed source; no default `Available` |
| typed absence | a missing view is distinguished from hidden, not-yet-projected, retention/reference absence, unavailable and corrupt material |

Required repair is a bounded, read-only `PeripheralExportViewPointBundle` or an equivalent uniquely owned carrier. Its fields must remain private, contain no repository version/writer handle/provider body, and be constructed only after one completed committed read boundary. It must not be implemented as N+1 calls that assume time-consistency, a full UoW, a writer-side versioned carrier, or a fallback current-source scan.

### 5.3 Consumer authority and selector semantics

The lookup key is exactly `(PeripheralConsumerRef stable identity, ObservationProjectionScope canonical identity)`. Consumer state and `export_allowed` are not part of the durable view identity, so a state/flag change does not select a second view row; it does, however, invalidate or narrow a current policy/visibility snapshot. The read path therefore needs two explicit comparisons:

1. request consumer identity/kind/scope versus view consumer identity/kind/scope;
2. trusted current consumer identity/kind/scope versus the committed view relation, with state/flag interpreted only by the owning policy/visibility mapper.

If the current consumer lookup is not completed, or returns an error, the path cannot silently use the request's `consumer_state`/`export_allowed` as authority. It returns a typed dependency/consistency error or a formally declared safe availability surface. `Ok(None)` from a completed, exact current-consumer lookup is distinct from lookup failure and must not be reclassified as `Active`, `Denied`, `MissingView` or `Disabled` without an owner-defined mapping.

This separation preserves the rule that a caller can identify a projection but cannot self-authorize export or mutate the consumer catalog through a Query.

## 6. Canonical view schema、identity 与 replacement

### 6.1 Unique `DashboardAlertExportView` owner

Q12 reuses the sole owner at `03_ddd_step_06_boundary_read_maintenance.md:3555`:

```rust
pub struct DashboardAlertExportView {
    pub view_ref: DashboardAlertExportViewRef,
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,
    pub consumer_ref: PeripheralConsumerRef,
    pub scope: ObservationProjectionScope,
    pub read_model_ref: ObservationReadModelRef,
    pub diagnostic_view_ref: Option<DiagnosticViewRef>,
    pub gap_ref: Option<GapStateRef>,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
}
```

The view is product-neutral and body-free. It contains no product label, endpoint, destination, credential, provider instance, raw log/metric/trace/audit/evidence body, external audit verdict, delivery receipt or signoff. `read_model_ref` identifies observation-owned derived material; it does not transfer source/business truth ownership.

### 6.2 Field source and invariants

| field | source | Q12 invariant |
|---|---|---|
| `view_ref` | application identity authority at first committed view creation | stable across replacement; never pair hash/digest/row version/cursor derived |
| `freshness_marker_ref` | projection marker owner at first committed view creation | stable marker identity; surface must refer to the same marker relation |
| `consumer_ref` | committed view row plus trusted current consumer relation | request/view stable identity, kind and scope exact; request state/flag cannot overwrite committed state |
| `scope` | committed projection lookup row | exact canonical equality with request scope; no route/string reconstruction |
| `read_model_ref` | same committed peripheral projection capture | points to the exact read model used; no current source rescan |
| `diagnostic_view_ref` | same capture optional relation | absent is explicit typed absence; Some must resolve to same scope/object relation if required by owner |
| `gap_ref` | same capture optional gap relation | Some must be exact current/retained gap relation; no synthetic gap from error or degraded reason |
| `visibility` | persisted source visibility + P11 process-local decision | caller metadata can cap scope, never assert `Visible`; body follows surface ceiling |
| `freshness` | persisted projection marker/surface | `Fresh` only with marker parity; `Stale`, `Rebuilding`, `Unknown` preserved |

`DashboardAlertExportView` is a read projection, not `ExternalAuditExportPreparation` and not `PeripheralDeliveryState`. Delivery or preparation results cannot mutate the view or its `read_model_ref`; a new projection replacement must be performed by the dedicated maintenance/rebuild writer under its own boundary.

### 6.3 Identity and replacement matrix

| operation | view identity | marker identity | permitted effect |
|---|---|---|---|
| first committed projection creation | mint one `DashboardAlertExportViewRef` and marker ref through owning application ports | mint once | create derived local view only |
| accepted replacement of same consumer/scope | preserve existing `view_ref`; preserve marker identity according to Step06 replacement contract | exact replacement marker relation is atomically captured | replace complete derived snapshot, never partial member update |
| duplicate read | no identity mint | no identity mint | return same committed surface or typed absence |
| missing/hidden read | no identity mint | no identity mint | return typed `Missing`/`Unknown`/visibility surface only when proof exists |
| export preparation/delivery result | no view mutation | no marker mutation | remain separate P14/local external-effect state |

## 7. Same-committed-boundary read contract

### 7.1 Required bundle and atomicity

Q12 normal or limited output requires one Query-safe committed bundle containing:

```text
request consumer/scope relation
  + committed DashboardAlertExportView
  + read-model identity relation
  + optional diagnostic/gap relation
  + persisted visibility provenance and bound gap revisions
  + projection freshness marker/surface
  + persisted rebuild relation, when freshness is Rebuilding
  + persisted degraded relation, when surface is Degraded
  + trusted current consumer catalog snapshot
  + typed local read dependency availability
```

The bundle may be represented by a single least-authority port return value or by an application-owned adapter over one transactionally consistent read snapshot. It may not be produced by independently reading a view, consumer, marker, gap, diagnostic and availability source at different times and assuming equality. A repository `Versioned<T>` is not by itself the public freshness marker and a writer-capable carrier cannot be passed to Query.

The bundle must preserve absence proofs as typed values. `Ok(None)` from the exact view lookup is only a low-level absence result; the application must combine it with a completed projection-index/anchor/retention/disclosure lookup before choosing `Missing`, `Unknown`, `NotVisible` or a typed application error. An error, timeout, partial lookup or unclassified provider failure is never converted to `None`.

### 7.2 Lookup and relation sequence

The Q12 service sequence is:

```text
GetPeripheralExportViewRequest
  -> exact Query name/body/metadata validation
  -> one canonical query digest and zero-key context
  -> load one peripheral point bundle by consumer + projection scope
  -> verify consumer/view/scope/read-model/diagnostic/gap identity relations
  -> verify marker/freshness/rebuild/degraded/availability provenance
  -> build exact P10 ReadCommittedSurface target and decision
  -> build exact P11 one-shot visibility input and decision
  -> optionally map P13 response-only degraded surface
  -> map typed presence/freshness/rebuild/availability/error
  -> ObservationQueryResult<DashboardAlertExportView>
  -> ObservationQueryResponse<DashboardAlertExportView>
```

P10/P11/P13 are process-local policy evaluations. The service does not call P14. It does not create or apply any domain decision, transition, revision or record. If a required input for policy evaluation is missing or inconsistent, the service fails closed with the appropriate typed error/surface instead of supplying a caller field or default.

### 7.3 P10 exact no-write boundary

Q12 uses the shared P10 family `ReadOrDiagnostic` with local effect `ReadCommittedSurface`. The target must identify the exact peripheral projection selection, including the consumer/scope pair. The current `ReadEvaluationTargetRef` vocabulary has `Object`, `ProjectionScope`, `AuditTimeline`, `EvidenceIndexInput` and `RetentionProtection`, but no canonical consumer-plus-projection selector. Therefore one of the following must be closed by Step06/07 before implementation:

- add a finite, canonical peripheral projection target/anchor to the existing target vocabulary; or
- provide an equivalent typed target-bound carrier that preserves both consumer identity and projection scope and can be consumed by P10/P11 without creating a second owner.

Q12 cannot use `ProjectionScope` alone, `DashboardAlertExportViewRef` in an absence branch, a first-loaded view, a hash, or a `PeripheralConsumerScopeRef` alias to weaken this relation. P10 `Blocked` is an expected process-local outcome and does not create a `NoWriteViolation` record for a synchronous Query. P10 `Allowed` only proves the read path does not cross the declared write boundary; it does not grant export permission or authorize an adapter.

### 7.4 P11 read visibility boundary

P11 consumes a complete `ReadVisibilityInputSnapshot` containing the one-shot request context, exact target, projection scope, persisted freshness, source visibility provenance, complete bound gap revisions and the same-target P10 decision. Its purpose/scope pair must be `ReadPurpose::ExportPreparation` / `VisibilityScopeKind::Export` when Q12 is used as a read before a potential export preparation. This purpose does not invoke or create preparation; it only selects the read visibility rule set. If the canonical Q12 consumer use is classified as ordinary observation consumption instead, that mapping must be fixed once by the owner and propagated to digest/policy/mapper; Q12 cannot vary it by route or caller.

P11 may preserve `Visible`/`Restricted` material or narrow it to `NotVisible`/`Blocked`/safe restricted output. It cannot upgrade a persisted `NotVisible`, `Blocked`, `Degraded`, `Stale`, `Rebuilding` or `Unknown` source to `Visible`. Caller-provided `visibility_scope_ref` is a bounded input, not an assertion of visibility. A view's `visibility` field is source material, not a caller-controlled authorization token.

### 7.5 P13 response-only degraded mapping

P13 is optional only after Q12 has a complete exact affected-object target, P11 decision, explicit safety input and complete current gap revisions. It may map a limited or blocked public `DegradedSurface` for this response. It must not call `DegradedOutputState::create_from_decision`, `replace_from_decision`, mint a `DegradedOutputRef`, write a new gap, or alter the view.

For Q12, `Normal` is allowed only when the exact view relation is valid, P11 permits the committed visibility, freshness is not falsely promoted, safety is explicitly compatible, and no effective gap/policy condition requires a limited or blocked surface. `Limited` must carry the exact persisted gap when the reason requires one. `Blocked` must preserve the P11/source block provenance and never fabricate a gap for a guard-only block. `MissingMaterial`, `NotVisible`, `UnresolvedReference`, `Stale`, `VisibilityLimited`, `SafetyLimited` and `GuardBlocked` remain distinct public reasons.

P13 must not be used to infer export policy. A limited view is not an export preparation, a blocked view is not a delivery rejection, and a normal read is not external audit acceptance.

## 8. Presence、visibility、freshness、rebuild 与 availability

### 8.1 Point presence and typed absence

Q12 is point-only. `ObservationQueryPresence::Empty` is invalid. The following matrix is normative:

| condition | presence | view | missing | visibility / availability | rule |
|---|---|---|---|---|---|
| complete visible relation-valid bundle | `Present` | `Some(DashboardAlertExportView)` | `None` | `Visible`/`Restricted`; `Available` or policy-approved `Degraded` | body contains only canonical view fields |
| complete bundle with permitted limited material | `Present` or `Unknown` per shared mapper | `Some` only if limited body is explicitly allowed | `None` | `Degraded` surface and exact reason/gap | no success promotion |
| completed lookup proves no local view and no source anchor/reservation | `Missing` | `None` | `NotFound` or an owner-selected typed missing variant | not a NotVisible disguise | only after existence disclosure is safe |
| source/projection anchor proves view not formed yet | `Missing` | `None` | `NotYetProjected` | explicit freshness/availability relation | does not trigger rebuild |
| retention boundary proves target is outside retained local window | `Missing` | `None` | `OutsideRetainedObservationWindow` | safe retention/visibility surface | does not assert source deletion |
| typed reference relation proves required dependency unavailable | `Missing` or `Unknown` per disclosure mapper | `None` | `SourceReferenceUnavailable` only with formal proof | availability remains explicit | resolver/adapter timeout alone is not proof |
| target exists but disclosure is forbidden | `Unknown` or no body with `NotVisible`/`Blocked` | `None` | `None` | visibility is authoritative | existence must not leak as Missing |
| malformed/corrupt relation or incomplete same-boundary bundle | no normal response | `None` | `None` | typed consistency/invariant error | no partial body or default surface |
| read dependency unavailable/disabled/failed | no normal body unless a formal limited surface permits it | usually `None` | not `NotFound`/`Empty` | `Unavailable`/`Disabled`/`Failed` with exact family or typed error | no fallback store or external probe |

`Present` never proves source/business truth completeness. `Missing` never means hidden. `Unknown` is not a convenience alias for empty or failed. A point response cannot carry `Empty`, and it cannot carry a view together with `missing` or a normal protocol error.

### 8.2 Visibility/body matrix

`VisibilitySurface` is copied or narrowed through the formal P11/P13 mapper:

| surface | body rule | Q12 rule |
|---|---|---|
| `Visible` | full body allowed | only from valid committed source and P11 allowed result |
| `Restricted` | body may exist with field-level redaction owned by view assembler | no caller widening; no product/provider details added |
| `NotVisible` | body absent; real gap required | not mapped to Missing; no synthetic view |
| `Blocked` | body absent; gap optional only for guard-only block | does not create `NoWriteViolation` in Query |
| `Degraded` | body only when `limited_consumption_allowed` is true | exact reason/gap retained; never default success |

The response assembler cannot reconstruct a more detailed view after P11 narrows visibility. It cannot copy raw read-model members, diagnostic body, gap reason text, consumer credentials or external preparation fields into a restricted/degraded response.

### 8.3 Freshness and consistency hint

`ObservationProjectionFreshnessSurface` has the canonical variants `Fresh`, `Stale { marker_ref }`, `Rebuilding { progress_ref }` and `Unknown`. Q12 applies `AllowStale`, `RequireFresh` and `BestEffort` only to already committed material:

| consistency | Fresh | Stale | Rebuilding | Unknown |
|---|---|---|---|---|
| `AllowStale` | return if visible | may return old body with exact marker | may return only after relation proof; preserve rebuilding surface | no Fresh; explicit unknown/limited/error |
| `RequireFresh` | return if visible | no wait/refresh; safe no-body/limited/error surface | no wait/start/resume; safe no-body/limited/error surface | no body unless explicit safe policy permits it |
| `BestEffort` | prefer Fresh | return safest committed body allowed by policy | preserve rebuilding relation; no progress mutation | preserve Unknown; no time/default upgrade |

`Fresh` requires `freshness_marker_ref` parity with the persisted marker and the same committed view boundary. `Stale` cannot become `Fresh` through query time, row version, current consumer state, cursor or a successful read. `Rebuilding` requires a persisted `progress_ref` relation, when present, to a `RebuildProgressView` whose target and immutable scope binding explain the requested consumer/scope projection. `Completed` remains derived-target completion, not source repair or external acceptance.

### 8.4 Rebuild relation

When the view reports `Rebuilding { progress_ref: Some(P) }`, Q12 may only perform a read-only relation lookup equivalent to:

```rust
ObservationProjectionQueryStore::get_rebuild_progress_by_ref(
    &RebuildProgressViewRef
) -> ApplicationPortFuture<'_, Option<RebuildProgressView>>
```

It must verify the exact progress ref, target kind, optional maintenance/replay identity compatibility, progress surface/state compatibility, and immutable target-to-scope binding for the requested peripheral projection. `None` cannot be turned into a newly minted progress view; lookup error cannot become `Queued`. Q12 never advances or repairs progress.

### 8.5 Availability source and precedence

Q12 distinguishes local projection-read availability from external delivery availability:

| dependency | canonical family | allowed use in Q12 | forbidden use |
|---|---|---|---|
| local peripheral projection store | `AdapterFamily::ProjectionStore` | classify local read availability / consistency | exposing store/provider detail or selecting fallback store |
| local observation/read-model store, if separately required by owner | `AdapterFamily::ObservationStore` | classify a declared read dependency | rescanning source truth or choosing first failure arbitrarily |
| local runtime/catalog availability snapshot | typed runtime availability state | classify whether a declared local read dependency can be used | Query-triggered probe/config reload or adapter activation |
| external export delivery | `AdapterFamily::PeripheralExportDelivery` | not called; any pre-existing external state is not Q12 input | map disabled delivery to local view missing; invoke endpoint/credential |
| policy/material dependency | finite typed policy/application error mapping | explain `Degraded`/`Failed` safely | expose policy body, provider error or raw exception |

`Available` is valid only after every required local read dependency returns a complete relation-valid bundle. `Degraded` requires an explicit policy-approved limited committed surface. `Unavailable`, `Disabled` and `Failed` retain the finite `AdapterFamily` but never contain adapter instance, endpoint, credential, provider code or message. Multiple dependency failures require a Q12-specific finite precedence/summary mapper; Q12 cannot use first-error-wins, timeout-as-missing or default `Available`.

## 9. Error、surface precedence 与 response invariants

### 9.1 Finite precedence

The application result/response assembler must apply a fixed, disclosure-safe order:

1. malformed Query name/body, wrong typed ref, invalid digest or invalid metadata -> protocol/application invalid-request error;
2. repository/persistence invariant failure, cross-relation mismatch or incomplete committed bundle -> typed consistency/invariant error, with no partial body;
3. unavailable/disabled/failed declared read dependency -> finite availability surface or typed dependency error, never Missing/Empty;
4. definitive visibility block from source/P11 -> `NotVisible`/`Blocked` surface, no body, no existence leak;
5. typed local absence proof -> `Missing` with exactly one allowed missing classification;
6. persisted `Rebuilding`, `Stale`, `Unknown` or policy-limited material -> preserve exact freshness/degraded ceiling and return body only when the mapper permits it;
7. relation-valid visible committed material -> `Present` with the exact view.

The exact owner may refine this order for a collision between disclosure and availability, but it must be finite, written into the Q12 result assembler and consistent across fake/durable adapters. It cannot be selected by exception order, row existence, HTTP status, error string or the first dependency to fail. A normal surface never coexists with `error`; an error never receives a fabricated view or missing classification.

### 9.2 Response invariants

`ObservationQueryResponse<DashboardAlertExportView>` must validate:

- `query_name` is statically `GetPeripheralExportView` and body/view binding is exact;
- Q12 is point-only, so `presence=Empty` is rejected;
- `Present` has exactly one view whose `consumer_ref` and `scope` equal the request selector and whose `view_ref`/marker/read-model relations pass the same-boundary checks;
- `Missing` has no view and exactly one typed missing surface; it is never a disguised not-visible or dependency failure;
- `Unknown` has no unproven identity/body and includes explicit freshness/availability/degraded context when allowed;
- `visibility`, `freshness`, `degraded`, `availability`, `missing` and `rebuild` satisfy their cross-field matrix;
- `Fresh` is never produced without marker parity; `Rebuilding` never advances progress; `Degraded` never means P14 allowed export;
- no public field contains consumer credentials, endpoint/destination, provider state, policy basis, repository version, raw observation body, evidence body, external verdict or signoff;
- Query result contains no stored-result access, idempotency outcome, changed refs, outbox refs or durable read receipt.

### 9.3 Error mapping

| failure | current mapping |
|---|---|
| malformed/wrong-owner selector, unknown field, invalid scope | protocol `InvalidRequest` / `InvalidScope` before port call |
| digest profile/value mismatch | `ApplicationError::InvalidRequest` or existing digest-specific application error; no context/lookup |
| consumer/view/scope/read-model relation mismatch | typed `RelationMismatch` / `ReferenceConflict`; no fallback to request state |
| missing required current consumer or policy provenance | `MissingRequiredReference` or declared dependency surface; not caller-authorized fallback |
| `Ok(None)` with no typed absence proof | `Unknown` or typed presence/consistency failure according to canonical mapper; never `NotFound` by default |
| repository lookup error/partial bundle | repository/dependency error; never `None`, `Missing` or `Empty` |
| malformed persisted view/marker/rebuild/degraded relation | persistence invariant / `GapInvariantViolation` / `ReferenceConflict` mapping owned by Step 12; no partial body |
| P10/P11/P13 cross-target or stale decision | `RelationMismatch(DecisionBinding/Target/StateSnapshot)`; no re-evaluation with caller substitutions |
| external delivery adapter disabled/unavailable | not called by Q12; if a separate declared surface is exposed, map only to `ObservationAvailabilitySurface` with `PeripheralExportDelivery`; never local missing |

Exact enum/code names remain subject to the current `ApplicationError` owner and Step 12 total mapping; Q12 does not create a parallel error enum or convert every normal surface to error.

## 10. Zero-write and truth-boundary matrix

| candidate effect | Q12 ruling |
|---|---|
| create UoW, reserve idempotency, create stored result | forbidden |
| call full `ObservationUnitOfWork`, projection writer/version port or replace method | forbidden |
| create/replace `DashboardAlertExportView`, read model, diagnostic view, gap, degraded revision or freshness marker | forbidden |
| open/close/acknowledge/mitigate/suppress a gap | forbidden |
| start/wait/resume/advance/complete/cancel/repair rebuild | forbidden |
| call P14 preparation/delivery transition or `PeripheralExportPolicy` writer path | forbidden |
| call external export adapter, endpoint, credential or provider | forbidden |
| append read-access/history/no-write/audit record, outbox or event | forbidden |
| fetch raw log/metric/trace/audit/evidence/report body or source/business truth | forbidden |
| mutate consumer catalog, export flag, consumer state or policy basis | forbidden |
| map repeated identical Query to Command replay/idempotency outcome | forbidden; repeat is ordinary read |

All normal, missing, hidden, stale, rebuilding, degraded, unavailable and error branches leave the committed view/read model/consumer catalog/gap/marker/rebuild state, source/business truth, external systems and durable audit/outbox state unchanged.

## 11. Field / owner / affected closure table

| closure item | current owner / callable | Q12 conclusion |
|---|---|---|
| logical operation | `ObservationQueryOperation::GetPeripheralExportView` / S08-B finite Query registry | one operation retained; no preparation/delivery alias |
| public request | `GetPeripheralExportViewRequest` use-site; target owner still affected | exact two required fields fixed; no route/product field |
| request consumer carrier | Step06 `PeripheralConsumerRef` | structured five-field carrier reused; caller state/flag not authorization |
| projection selector | Step06 `ObservationProjectionScope` | canonical five-variant scope reused; no `PeripheralConsumerScopeRef` |
| application input | `application::inputs::GetPeripheralExportViewInput` | exact pair + Query control fields; constructor remains Step06/07 owner |
| digest | Step06 canonicalizer Q12 row | structured consumer and scope included; trace/request time excluded |
| API assembler | `ObservationApiInputAssembler::get_peripheral_export_view` | exact signature recorded; no I/O/policy call |
| Read façade | `ObservationReadService::get_peripheral_export_view` | exact observed return recorded; same-boundary result carrier affected |
| Query facet | `ObservationProjectionQueryStore` | current point callable is least-authority shape but returns insufficient `Option` bundle |
| writer facet | `ObservationProjectionStore` | version/by-ref/replace methods remain writer-only and cannot be granted to Query |
| public view | Step06 `contracts::views::DashboardAlertExportView` | unique owner reused; no Step08 duplicate |
| view identity | `DashboardAlertExportViewRef` | generated on first create, stable on replacement; no pair hash |
| freshness identity | `ProjectionFreshnessMarkerRef` | persisted marker owner; no query-time mint |
| consumer authority | Step06 structured consumer + trusted current catalog relation | current lookup/provenance carrier not uniquely closed |
| point read bundle | Step06/07 least-authority projection query boundary | required same-committed-boundary composite carrier missing |
| P10 target | `NoWriteGuardPolicy` / `ReadEvaluationTargetRef` | exact consumer+scope target absent from current vocabulary; target/anchor affected |
| P11 visibility | `ReadVisibilityPolicy` / `ReadVisibilityDecision` | Export purpose/scope and current-consumer provenance mapping affected |
| P13 degraded | `DegradedOutputPolicy` / `DegradedOutputDecision` | response-only mapping target/input/source affected; no durable write |
| P14 export policy | `PeripheralExportPolicy` | preparation/delivery only; Q12 must not call it |
| presence | shared `ObservationQueryPresence` / missing surface | point-only; typed absence source and disclosure precedence affected |
| freshness | `ObservationProjectionFreshnessSurface` + persisted marker | marker parity and rebuild relation must be proven; query cannot upgrade |
| rebuild | `RebuildProgressView` + `get_rebuild_progress_by_ref` relation vocabulary | read-only relation check only; composite source affected |
| availability | `ObservationAvailabilitySurface` + runtime `AdapterFamily` | local projection availability only; external delivery not called; multi-dependency mapper affected |
| response mapper | application `ObservationQueryResult` -> contracts response | Q12-specific finite mapper and cross-field validation affected |
| Step09 handoff | `GetPeripheralExportViewFlow` | reserved only; no flow body in this batch |

## 12. Q12 affected register

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q12-REQUEST-SCHEMA-01` | `open_upstream_internal` | `GetPeripheralExportViewRequest` 只有 use-site，缺 canonical public declaration、wire schema、sealed Query binding、unknown-field与decoder owner | Step06/07 在唯一 contracts owner 声明两个 required fields并传播 exact binding/digest order | Step08 创建第二 DTO/alias、恢复 `PeripheralConsumerScopeRef`、从 route 猜字段 |
| `S08-D-Q12-CONSUMER-AUTHORITY-01` | `open_internal_affected` | request 携带的 structured consumer 含 state/export flag，但 current Query read path 没有唯一 trusted current consumer snapshot/lookup；caller值不能成为授权来源 | 提供 bounded current-consumer snapshot/typed provenance，并明确 `Ok(None)`、error、state/flag drift 与 view relation 的 total mapping | 直接信任 request `export_allowed`/`consumer_state`、只按 id 读取并默认 Active、以 view 的旧 state 代替 current authority |
| `S08-D-Q12-POINT-READ-BUNDLE-01` | `open_internal_affected` | current point callable 只返回 `Option<DashboardAlertExportView>`，缺 view/read-model/optional relations/marker/visibility/gap/freshness/rebuild/availability/typed absence same-boundary proof | 增加 least-authority `PeripheralExportViewPointBundle` 或等价唯一 carrier，一次返回完整 read-safe material | N+1 lookup、full UoW/writer version port、默认多次 read 一致、source scan fallback |
| `S08-D-Q12-IDENTITY-RELATION-01` | `open_internal_affected` | consumer+scope 是 lookup key，但 view_ref/marker_ref stable identity 与 view/read-model/consumer relation 的 replacement/re-hydration proof 未由 Query callable提供 | carrier逐字段证明 key、view identity、marker identity、read-model ref和replacement relation；identity只由owner生成 | pair hash/digest/row version/cursor派生 view ref，或按每次 read mint identity |
| `S08-D-Q12-POLICY-TARGET-01` | `open_upstream_internal` | P10/P11 `ReadEvaluationTargetRef` 没有精确表达 consumer+projection scope；scope-only 或 view-ref-only 会丢 selector/absence relation | 在现有 target owner增加有限 peripheral target/anchor，或提供等价 target-bound carrier并传播 P10/P11 exact relation | `ProjectionScope` alone、first view、`DashboardAlertExportViewRef` absence target、`PeripheralConsumerScopeRef` alias |
| `S08-D-Q12-VISIBILITY-SOURCE-01` | `open_internal_affected` | P11 需要 request visibility scope、source visibility provenance、current consumer relation、bound gap revisions和P10 decision；当前 view field不足以证明完整 one-shot input | 提供 Q12 专属 visibility source/mapper，区分 caller scope、consumer boundary、persisted surface 和 disclosure ceiling | caller直接提交 Visible、从 export flag/state/HTTP/row existence推导 visibility、借 unrelated gap |
| `S08-D-Q12-PRESENCE-01` | `open_internal_affected` | `Option<DashboardAlertExportView>` 无法区分 NotFound、NotYetProjected、retention boundary、reference unavailable、hidden、unavailable和corrupt | 提供 typed point absence/anchor/retention/reference proof与固定 Missing/Unknown/visibility precedence | `None -> NotFound`、timeout/error -> missing、external Disabled -> local missing、synthetic view |
| `S08-D-Q12-FRESHNESS-SOURCE-01` | `open_internal_affected` | marker ref与freshness field存在，但缺同一 boundary 的 marker parity、consistency hint和view/consumer/read-model coverage proof | 提供 Q12 freshness source、marker parity和hint mapper；Fresh仅由 persisted marker证明 | query time、row version、consumer state、cursor或successful read伪造 Fresh |
| `S08-D-Q12-REBUILD-RELATION-01` | `open_internal_affected` | Rebuilding surface 到 progress view、maintenance target、immutable scope binding和consumer/scope membership的 Query-safe relation未闭合 | bounded progress-by-ref relation carrier与target membership proof，明确 None/error/Completed mapping | mint/latest progress、等待/推进/修复、Completed 升级 source/export success |
| `S08-D-Q12-DEGRADED-SOURCE-01` | `open_internal_affected` | P13 需要 exact affected object、P11 decision、explicit safety和complete gap revisions；Q12 没有 source mapper | 提供 response-only P13 input/decision mapper与reason/gap parity；不创建 durable degraded revision | 从 visibility/state/gap count/error推导、latest gap、创建/替换 `DegradedOutputState` |
| `S08-D-Q12-AVAILABILITY-SOURCE-01` | `open_internal_affected` | projection/read-model/current-consumer/policy依赖到 public availability/AdapterFamily/error 的 finite precedence 未闭合 | 定义 Q12 dependency snapshot、local family mapping和 disclosure-safe precedence；external delivery保持不调用 | default Available、first error wins、fallback store、timeout当Missing、泄露provider detail |
| `S08-D-Q12-SURFACE-MAPPER-01` | `open_internal_affected` | point Present/Missing/Unknown、visibility、freshness、rebuild、degraded、availability、error 的交叉矩阵与唯一 response assembler 未闭合 | 提供 finite Q12 result summary/response mapper和`try_new` cross-field validation | entry补查字段、state/HTTP/error字符串决定surface、body与missing/error同时返回 |
| `S08-D-Q12-P14-BOUNDARY-01` | `open_internal_affected` | 旧 Q12 描述把 read view、export preparation、delivery混在同一路径；P14 exact preparation/delivery input不应由Query拥有 | 明确 Q12 -> P10/P11/P13 response-only；P14仅由准备/交付写侧调用，外部 adapter在独立phase | Query创建 preparation/delivery、调用 P14、把 local `Prepared/Delivered` 映射为 export acceptance |

Q12 also reuses these shared affected items without closing them:

- `S08-D-QUERY-SURFACE-MAPPER-01`: cross-Query result-to-response source/precedence remains open; Q12 adds its own finite mapper.
- `S08-D-Q12-REQUEST-SCHEMA-01` is Q12-specific and does not authorize creation of a Step08-only DTO; its canonical owner remains Step06/07 repair.
- `R06.6-F2-H13-UPSTREAM`: known controlled upstream item, unrelated to Q12 read semantics and not closed here.
- `R06-F-AFFECT-UOW-01`: downstream persistence/flow propagation remains open; Q12 does not consume writer/UoW capability.

The register contains one upstream-internal request owner gap, one upstream-internal policy target gap and eleven internal affected items, thirteen Q12 items in total. These are design closure gaps, not a new external upstream blocker. They must not be reported as implemented or unconditionally complete.

## 13. Step 09 handoff（仅登记）

`GetPeripheralExportViewFlow` is the sole Q12 flow name. Step 09 must preserve the point-only and no-write boundary:

```text
GetPeripheralExportViewRequest(consumer_ref, scope)
  -> exact Query name/schema/metadata validation
  -> structured consumer + canonical projection scope validation
  -> one query digest and zero-key context
  -> one least-authority peripheral point bundle
       -> consumer/view/scope/read-model relation
       -> optional diagnostic/gap relation
       -> marker/freshness/rebuild/degraded/availability provenance
       -> typed absence/disclosure proof
  -> P10 ReadCommittedSurface exact consumer+scope target
  -> P11 Export-purpose visibility ceiling and one-shot provenance
  -> optional response-only P13 degraded mapping
  -> finite presence/freshness/rebuild/availability/error mapper
  -> ObservationQueryResult<DashboardAlertExportView>
  -> ObservationQueryResponse<DashboardAlertExportView>
```

Step 09 must not add:

- a second Query, page branch, route selector, product field, `PeripheralConsumerScopeRef` alias or external preparation selector;
- trust in caller-supplied state/export flag, a current-source scan, N+1 reads or writer/full-UoW access;
- P14 preparation/delivery decision, external adapter call, endpoint/credential lookup or external acceptance claim;
- view/read-model/consumer/gap/degraded/marker mutation, read audit, outbox, stored result or idempotency replay;
- `None` to `NotFound`/`Empty`, `Disabled` to local missing, `Stale` to `Fresh` or `Completed` to source/export success;
- a claim that a returned view proves business truth, external audit correctness, delivery success, verdict, signoff or acceptance.

### 13.1 Planned implementation cuts

| cut | planned assertion | status |
|---|---|---|
| request schema/digest | full structured consumer and canonical scope are encoded in fixed order; route/product/credential absent | `planned/not_run` |
| consumer authority | request state/flag cannot authorize; current snapshot/view relation and `Ok(None)`/error are distinct | `planned/not_run` |
| point bundle | all view/read-model/optional relation/marker/visibility/gap/freshness/rebuild/availability fields share one boundary | `planned/not_run` |
| identity | view/marker refs stable across replacement and never hash-derived or minted by Query | `planned/not_run` |
| policy | exact P10 target, P11 scope/provenance and response-only P13 mapping; P14 and adapters remain zero | `planned/not_run` |
| presence/surface | Missing vs Unknown vs NotVisible vs Unavailable/Failed remain distinct; point Empty rejected | `planned/not_run` |
| freshness/rebuild | marker parity and persisted progress relation required; no wait/start/advance/repair | `planned/not_run` |
| no-write | UoW/writer/record/outbox/degraded/gap/marker/rebuild/adapter spies remain zero | `planned/not_run` |
| redaction | no product/route/endpoint/destination/credential/provider/raw body/verdict/signoff in public view | `planned/not_run` |

No implementation test, run id, evidence alias, acceptance result or signoff is claimed.

## 14. Q12 stop review

| check | conclusion |
|---|---|
| independent request/input/view/read-chain/policy/presence/freshness/rebuild/degraded/availability/error/no-write/handoff record | `pass_with_affected_open` |
| one logical Query and exact required consumer+scope point selector | target contract pass；request owner remains affected |
| structured `PeripheralConsumerRef` owner and no legacy wrapper | pass；Step06 owner reused, `PeripheralConsumerScopeRef` rejected |
| exact assembler and Read façade recorded | pass at observed owner level；same-boundary result carrier remains affected |
| least-authority query capability | current point callable identified；insufficient composite material registered, writer capability not granted |
| `DashboardAlertExportView` unique owner and field schema | pass；Step06 view owner reused, no second view/ref owner |
| view identity stable and not derived from pair/hash/digest | target contract pass；rehydration/replacement proof remains affected |
| caller consumer state/export flag treated as authorization | no；trusted current relation required and affected |
| P10/P11 target and visibility provenance | target behavior defined；exact consumer+scope target and current provenance affected |
| P13 vs P14 boundary | pass_design_record；P13 response-only, P14 preparation/delivery excluded |
| presence/missing/unknown/visibility matrix | target behavior defined；typed absence and disclosure mapper affected |
| freshness/rebuild/degraded/availability sources | target behavior defined；exact carriers/mappers affected |
| Query zero-write and no source/business truth upgrade | pass |
| all thirteen Q12 affected registered | pass |
| new external upstream blocker | none；known `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `28/60 defined_with_affected_open`；Query `12/14`；`0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q13 |
| current commit | not needed; user did not request one |

Q12 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 15. Recovery point

```text
Step08_S08-D_Q12_defined_with_affected_open_waiting_user_before_Q13
```

Before explicit user confirmation, do not read or write Q13-Q14, S08-E~G, Step 09-19, formal `03`, any `04` file or implementation code. The next permitted reading after confirmation is only the Step 06/07 owner and callable material required by Q13 `GetReferenceSnapshotView`.
