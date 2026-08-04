# L4-observability 03-详细设计 Step 08 - S08-D Query Q13 `GetReferenceSnapshotView`

> 本文件是 Q13 的独立讨论中间产物。它只覆盖 `GetReferenceSnapshotView`，不关闭 Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q13 |
| 逻辑协议 | `Query / GetReferenceSnapshotView / GetReferenceSnapshotViewRequest` |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q14` |
| 协议计数 | `29/60 defined_with_affected_open`；`0/60` 无条件 complete |
| Query 计数 | `13/14 defined_with_affected_open`；Q14 尚未逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 继续冻结，只允许 Step 19 重装配 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q14 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

Q13 读取一个由 observability-owned reference snapshot 表示的 body-free、safe reference state。它只投影本地已提交的 snapshot state、关联 freshness marker、typed gap linkage、visibility 和 projection freshness；它不调用 resolver、不刷新 snapshot、不拥有 external reference truth，也不反写 source、business truth 或任何 external system。

### 1.1 本批禁止事项

- 不读取或写入 Q14、S08-E~G、Step 09~19 或正式 `03-详细设计.md`。
- 不把当前两个 `Option` 字段当作四种合法 request 形态；Q13 必须只有一个带 discriminator 的互斥 selector。
- 不为 Q13 创建第二个 `ReferenceSnapshotView`、`ReferenceSnapshotState`、`ReferenceSnapshotStateRef`、`ReferenceSubjectRef` 或 freshness marker owner。
- 不把历史 `ReferenceSnapshotRef` 恢复为兼容 alias；current canonical identity 只有 `ReferenceSnapshotStateRef`。
- 不用 `ReferenceMaintenanceRepository::find_current_snapshot_by_subject` 直接拼 Query。该方法返回 writer-oriented `Versioned<ReferenceSnapshotState>`，且 current usable 语义会隐藏 `Invalid`，不满足 Query 的完整 current-head 读取。
- 不通过 snapshot、subject、trace、request digest、requested time、cursor 或版本号伪造 `DiagnosticRequestContext`、view identity、marker identity 或 freshness。
- 不调用 `SubjectObservationResolver`、任何 resolver adapter、P15/P16/P17/P18 或 external adapter；不刷新、修复、替换、重建或推进 snapshot/projection。
- 不把 local reference state `Unavailable` 映射为 Query store unavailable，也不把 Query store failure 映射为 snapshot `Unavailable`。
- 不从 `Option<ReferenceSnapshotView>` 推导 `Missing`、`NotVisible`、`Unknown`、`NotYetProjected` 或 `Empty`；每种 surface 必须有 typed proof。
- 不把 `Resolved` 自动升级为 projection `Fresh`；reference state freshness 和 projection freshness 是两条独立轴。
- 不写 H10/H11、gap、degraded、marker、read audit、outbox、stored result、UoW、idempotency reservation 或任何业务 truth。
- 不伪造实现 commit、run_id、evidence alias、测试结果、验收签署或真实 evidence。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 08 | Query 独立协议、request/response、point surface、marker、visibility/freshness/degraded/error/no-write 与停审要求 |
| `standards/document/详细设计书写规范.md` 5.6/5.7 | public DTO、二级类型、字段来源、Query surface、协议到对象/flow 回指结构 |
| `standards/document/设计真相源闭环与可落码性标准.md` | stable identity、selector cardinality、same-committed-boundary read、P10/P11、Query zero-write 和 owner 闭环 |
| `03_ddd_step_06_application_input_assembly_r06_8a.md` | current Q13 input、assembler use-site、两个 `Option` 的旧形态和 exact method |
| `03_ddd_step_06_application_digest_canonicalizer.md` | Q13 current digest row、typed selector material 和 metadata exclusion |
| `03_ddd_step_06_application_operation_context_idempotency.md` | `GetReferenceSnapshotView` finite Query operation `0x020D` 和 zero-key Query context边界 |
| `03_ddd_step_06_boundary_read_maintenance.md` | `ReferenceSnapshotState`、`ReferenceSnapshotView`、state enum、marker、gap、projection freshness 和 no-truth boundary |
| `03_ddd_step_06_contracts_carriers.md` | `ReferenceSnapshotStateRef`、`ReferenceSubjectRef`、`ObservationObjectRef`、`ObservationProjectionScope`、public surface 与 `AdapterFamily` |
| `03_ddd_step_06_policy_guard_records.md` | P10 `NoWriteGuardPolicy`、P11 `ReadVisibilityPolicy`、read target vocabulary、one-shot context与zero-write规则 |
| `03_ddd_step_06_runtime_availability.md` | product-neutral availability scope/kind/state、adapter family 与 Query dependency availability boundary |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | exact assembler、Read façade、reference maintenance repository、projection Query facet、writer-only capability与resolver边界 |
| current S08-B/S08-D shared carrier in `03_ddd_step_08_protocol_contracts.md` | Query metadata、digest、`ObservationQueryResult<T>`、point presence/surface matrix、public response owner |
| Q09-Q12 current discussion records | same-boundary、typed absence、dual freshness、surface precedence、policy binding 和 zero-write 的粒度参考；不复制其 domain truth |

### 2.2 权威顺序

```text
current Q13 record / Q13 affected register
  > Step 07 exact assembler, Read facade and Query facet
  > Step 06 ReferenceSnapshotState/View/ref/policy/availability owners
  > S08-B shared Query request/result/surface carrier
  > current formal 02 and HLD query skeleton
  > frozen formal 03, old README and historical reference wording
```

Step 08 只定义协议如何选择、读取和映射 Step 06/07 的 canonical owners。它不重新声明 snapshot lifecycle、resolver result、marker、policy 或 availability type。current owner 无法证明的关系必须登记为 affected，不能用旧正式文档、writer port、兼容 alias 或默认值补齐。

### 2.3 Historical material 裁定

| 旧材料 | current disposition | 裁定 |
|---|---|---|
| `ReferenceSnapshotRef` | `historical_material_rejected` | current encoder、application input、repository 和 public view 只接受 `ReferenceSnapshotStateRef`；不生成 alias |
| `snapshot_ref: Option<_>` 与 `subject_ref: Option<_>` 两个独立字段 | `current shape insufficient; affected` | 四种组合不能由类型阻止；重建为一个互斥 tagged selector |
| 按 subject 调用 maintenance `find_current_snapshot_by_subject` 后再读 view | `historical_material_rejected` | writer-oriented `Versioned`、current usable 过滤和多次读取不能成为 Query contract |
| `ReferenceSnapshotState::Resolved` 等同 projection `Fresh` | `historical_material_rejected` | local reference state 与 derived projection freshness 分开读取、分开映射 |
| Query 调用 resolver 以补齐缺失 summary/version | `historical_material_rejected` | Q13 只读 committed local snapshot；resolver refresh 属于后置 command/job path |
| `None` 直接映射 `NotFound` 或 `Empty` | `current conflict; affected` | 需要 typed current-head/retention/reference absence proof；point Query 禁止 `Empty` |
| snapshot/subject/trace/digest 派生 request context 或 view identity | `historical_material_rejected` | identity 和 one-shot context 必须由各自 trusted owner 提供，不能在 Query 临时 mint |
| reference `Unavailable` 代表整个 Query store unavailable | `historical_material_rejected` | local state、projection read dependency、resolver availability 三者独立 |

## 3. SOP 问题回答

| # | 问题 | Q13 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetReferenceSnapshotView` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> Query-safe reference/projection read |
| 3 | 调用方与处理方 | exact API handler 调用 `ObservationApiInputAssembler::get_reference_snapshot_view`，再调用 `ObservationReadService::get_reference_snapshot_view` |
| 4 | 传输方式 | typed logical Query request/response；HTTP/RPC locator 后置 Step 14/`04` |
| 5 | public request schema | 一个 required `selector: ReferenceSnapshotViewSelector`；selector 只有 `BySnapshot` 或 `BySubject` |
| 6 | application input | selector + Query context、visibility scope、consistency、requested time；不把 writer version 或 resolver result带入 |
| 7 | response schema | non-paged `ObservationQueryResponse<ReferenceSnapshotView>`；`Empty` 非法 |
| 8 | lookup key | `BySnapshot(ReferenceSnapshotStateRef)` 或 `BySubject(ReferenceSubjectRef)`，由 discriminator 选择恰好一个分支 |
| 9 | view owner | Step 06 唯一 `contracts::views::ReferenceSnapshotView`；Q13 不创建第二 owner |
| 10 | view fields | `snapshot_ref`、`freshness_marker_ref`、`subject_ref`、`state`、`safe_summary_ref`、`source_version`、`gap_refs`、`visibility`、`freshness` |
| 11 | identity | `snapshot_ref` 同时是 canonical view identity；首次 committed snapshot-state 创建时生成，replacement保持稳定；marker identity独立且稳定 |
| 12 | field source | snapshot/view/marker/gap/visibility/projection freshness 必须来自同一 Query-safe committed boundary；resolver不在Q13内调用 |
| 13 | state policy | `Resolved` 必须 summary/version成对；`Stale` 可保留成对值或同时缺失；其他 state 不得携带 summary/version |
| 14 | presence | `Present` 或带 typed proof 的 `Missing`/`Unknown`/visibility surface；单体 Query 不使用 `Empty` |
| 15 | visibility | request `VisibilityScopeRef` 只是 P11 输入；不得由 selector、subject kind、state 或 caller body直接授予 `Visible` |
| 16 | freshness | local `ReferenceSnapshotStateKind` 与 projection `ObservationProjectionFreshnessSurface` 独立；`Fresh` 只能由 persisted marker parity证明 |
| 17 | degraded | P13 只做 response-only limited/blocked mapping；不创建 durable `DegradedOutputState` |
| 18 | rebuild | 只验证已提交 projection freshness 中的 `progress_ref` 关系；不启动、等待、推进或修复 rebuild |
| 19 | availability | local snapshot `Unavailable`、projection store availability、policy/marker dependency failure分开映射；不probe resolver |
| 20 | error | malformed selector/digest、typed absence、visibility ceiling、relation corruption、dependency failure和consistency error分层 |
| 21 | actor authority | actor 来自 trusted Query metadata；body 不提交 actor、policy decision、resolver result或authorization |
| 22 | no-write | 不创建 UoW/reservation/result/record/outbox/marker/gap/degraded/rebuild/refresh或external effect |
| 23 | Step09 回指 | 只登记一个 `GetReferenceSnapshotViewFlow`；本批不展开函数级 flow |

## 4. Logical binding、request 与 normalized input

### 4.1 一个逻辑 Query、一个 point cardinality

Q13 保留一个逻辑 Query，不新增 `GetReferenceSnapshotBySubject`、`RefreshReferenceSnapshot` 或 aggregate freshness Query。目标 public body 为：

```rust
/// Selects exactly one committed reference snapshot view.
pub enum ReferenceSnapshotViewSelector {
    /// Reads one retained snapshot identity, including a historical identity.
    BySnapshot(ReferenceSnapshotStateRef),

    /// Resolves the sole current snapshot head for one typed subject.
    BySubject(ReferenceSubjectRef),
}

pub struct GetReferenceSnapshotViewRequest {
    pub selector: ReferenceSnapshotViewSelector,
}
```

上述是目标协议形态，不在 Step 08 创建 canonical declaration owner。`selector` 必须存在且只能有一个 tagged variant；variant payload 不能为空、必须是 current typed ref，且必须通过 owner/kind validation。`BySnapshot` 允许读取仍被保留的旧 snapshot identity；`BySubject` 只解析该 subject 的 sole current head，不把 subject 转换成 snapshot identity。

当前 `snapshot_ref: Option<ReferenceSnapshotStateRef>` 与 `subject_ref: Option<ReferenceSubjectRef>` 产生 `(None,None)`、`(Some,None)`、`(None,Some)`、`(Some,Some)` 四种组合。它们只能在 assembler 先归一化时被拒绝/转换，不能继续作为 wire 或 canonical application selector。该冲突登记为 `S08-D-Q13-REQUEST-SCHEMA-01` 与 `S08-D-Q13-SELECTOR-CARDINALITY-01`，不由 Q13 创建第二套兼容 DTO。

### 4.2 Shared Query metadata 与 digest

Q13 复用既有 `ObservationQueryRequest<GetReferenceSnapshotViewRequest>` 和 Query control fields：

| 字段 | source / digest | Q13 规则 |
|---|---|---|
| `actor_ref` | trusted Query metadata；进入 query material | 只表达调用主体的 body-free identity，不从 selector/subject猜测 |
| `trace_ref` | trusted metadata；排除 digest | 只作相关性复制；不参与 lookup、授权、freshness或identity |
| `visibility_scope_ref` | trusted metadata；进入 digest | 是 P11 request scope input，不是 subject scope，也不授予 `Visible` |
| `consistency` | trusted metadata；显式编码 enum | 只选择已提交 surface；不等待、刷新或重建 |
| `requested_at` | trusted metadata；排除 digest | 不生成 snapshot/view/marker identity，不排序 source version |
| `selector` | typed request body；variant tag + complete typed payload进入 digest | discriminator 是 canonical material；不能把两分支拼成 nullable fields |

Q13 的目标 request material 为：

```text
{"operation":"get_reference_snapshot_view",
 "actor_ref":<typed-ref>,
 "visibility_scope_ref":<typed-ref>,
 "consistency":<option-enum>,
 "body":{"selector":
   {"kind":"by_snapshot","snapshot_ref":<typed-ref>}
   | {"kind":"by_subject","subject_ref":<typed-ref>}}
}
```

canonicalizer 只做 typed validation、tagged canonical encoding 和 digest；不读取 repository、snapshot index、policy、resolver、config或adapter。Query context 是 zero-key、无 event identity 的 process-local value。digest 不进入 reservation、stored result、outbox、cursor、freshness marker、snapshot identity或history。

### 4.3 Normalized application input

current application input use-site 为 `application::inputs::GetReferenceSnapshotViewInput`，目标逻辑字段为：

```rust
pub(crate) struct GetReferenceSnapshotViewInput {
    context: ObservationOperationContext,
    visibility_scope_ref: VisibilityScopeRef,
    consistency: ObservationConsistencyHint,
    requested_at: ObservedAt,
    selector: ReferenceSnapshotViewSelector,
}
```

其中：

| field | source | rule |
|---|---|---|
| `context` | private Query context factory | 无 idempotency key、event identity、writer capability；digest只作input integrity |
| `visibility_scope_ref` | trusted Query metadata | 不从 subject、snapshot ref、actor role或route推导 |
| `consistency` | trusted Query metadata | `AllowStale`、`RequireFresh`、`BestEffort`只约束已提交 projection surface |
| `requested_at` | trusted boundary metadata | 不参与 state transition、source ordering或freshness calculation |
| `selector` | assembler normalized tagged selector | 先验证 cardinality和typed owner，再构造 input；不保留两个独立 `Option` |

Q13 当前没有一个可证明的 trusted one-shot `DiagnosticRequestContext` carrier。现有 `DiagnosticRequestContext` 同时要求 projection/diagnostic scope，不能从 snapshot、subject、trace或digest填造；shared Query metadata和现有 Q13 input也没有合法 non-body carrier 位置。该问题登记为 `S08-D-Q13-REQUEST-CONTEXT-CARRIER-01`。在上游 owner修订前，Q13 必须 fail closed，不能把 `DiagnosticRequestContextRef` 暴露为 public body 或在 application 中临时 mint。

## 5. Exact Read façade、query authority 与处理权限

### 5.1 Exact observed application callable

当前 Step 06/07 已观察到的 entry seam：

```rust
ObservationApiInputAssembler::get_reference_snapshot_view(
    ObservationQueryRequest<GetReferenceSnapshotViewRequest>,
) -> Result<GetReferenceSnapshotViewInput, ApplicationError>
```

```rust
ObservationReadService::get_reference_snapshot_view(
    GetReferenceSnapshotViewInput,
) -> ApplicationServiceFuture<'_, ObservationQueryResult<ReferenceSnapshotView>>
```

API handler 只能调用 matching assembler，再调用 matching Read façade。它不能取得 canonicalizer、repository、resolver、P10/P11 policy object、UoW、stored-result repository或 external adapter。

### 5.2 Current facet 与 required Query-safe point bundle

当前可观察的 Query facet 只有：

```rust
ObservationProjectionQueryStore::get_reference_snapshot_view(
    &ReferenceSnapshotStateRef,
) -> ApplicationPortFuture<'_, Option<ReferenceSnapshotView>>
```

该 callable 只能覆盖 `BySnapshot` 的单一 identity，且 `Option` 无法证明 state、subject current-head、marker、gap、visibility、projection freshness、absence anchor 和 availability来自同一 boundary。它不能被扩展为 writer port，也不能被 `get_*_with_version`替代。

Q13 要求 Step 07 提供一个 least-authority、Query-safe 的 point bundle 或等价单一 carrier。目标逻辑材料如下：

| bundle material | 作用 | 必须证明 |
|---|---|---|
| selector echo | 保留 `BySnapshot`/`BySubject` 分支 | response 不可用另一分支重建；tag与payload exact match |
| snapshot view candidate | 提供唯一 public body | body与snapshot state、subject和marker同 boundary |
| current-head proof | 只对 `BySubject` 使用 | sole current head、包括 `Invalid`；0/1/duplicate的语义分离 |
| subject relation | 两分支都需要 | view.subject_ref 与 selector/current index exact relation |
| projection marker/freshness | public `freshness` | marker identity parity；不能从 state/version推导 |
| gap relation | `gap_refs` 和 visibility/degraded source | 每个 ref 是 committed current revision；不扫描 latest gap替代 |
| absence anchor | Missing/Unknown mapper | no head、retention、reference unavailable、hidden和corrupt不混淆 |
| dependency availability | public availability/error | projection store、policy/marker dependency与local snapshot state分离 |

这个 bundle 必须是一个 Query-safe committed boundary 的结果；禁止 N+1 point lookups、跨 transaction 拼装、current source scan、full UoW、writer `Versioned` carrier、resolver fallback或返回 repository version。上述能力缺口登记为 `S08-D-Q13-POINT-READ-BUNDLE-01` 与相关 source affected。

### 5.3 两个 selector 分支的读取语义

| selector | canonical read rule | absence / conflict rule |
|---|---|---|
| `BySnapshot(snapshot_ref)` | 按 stable snapshot identity读取仍保留的 committed snapshot view；允许 historical identity | identity不存在只有在 retention/reference boundary证明后才能 `Missing`；hidden、corrupt、store failure不得压为 Missing |
| `BySubject(subject_ref)` | 从 Query-safe current-head index解析该 subject 的 sole current head，再在同一 boundary读取对应 view；current `Invalid` 也必须可见 | 无 head需有 typed no-current-head proof；多 head、head/view mismatch或 index corruption是 consistency/reference error；不得调用 writer maintenance lookup |

`ReferenceMaintenanceRepository::find_current_snapshot_by_subject` 的 “current usable” 语义只适合维护路径，可能过滤 `Invalid`，并返回 writer-oriented `Versioned<ReferenceSnapshotState>`。Q13 不调用它。若未来 Step 07 保留同名方法用于写侧，必须另提供明确 Query-safe current-head carrier，不能让 Read façade共享 writer capability。

### 5.4 读取权限边界

Q13 可读取：已提交 `ReferenceSnapshotView`、必要的 snapshot state/head index、persisted freshness marker、associated gap current revisions、visibility provenance、bounded rebuild progress relation和 product-neutral local availability snapshot。Q13 不可读取：raw resolver response、source/business record、provider endpoint/credential、external reference body、writer row version作为 public field、current config fallback或 external delivery state。

## 6. Canonical view schema、identity 与字段不变量

### 6.1 唯一 `ReferenceSnapshotView` owner

Step 06 唯一 public view owner 为 `contracts::views::ReferenceSnapshotView`：

```rust
/// Public body-free view of one local reference snapshot state.
pub struct ReferenceSnapshotView {
    pub snapshot_ref: ReferenceSnapshotStateRef,
    pub freshness_marker_ref: ProjectionFreshnessMarkerRef,
    pub subject_ref: ReferenceSubjectRef,
    pub state: ReferenceSnapshotStateKind,
    pub safe_summary_ref: Option<SafeExternalSummaryRef>,
    pub source_version: Option<ObservationSourceVersionRef>,
    pub gap_refs: GapStateRefSet,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
}
```

Q13 只把 committed material losslessly 映射到这个 owner，不创建 `ReferenceSnapshotViewRef`、aggregate freshness summary或协议私有 wrapper。`snapshot_ref`同时是 snapshot-state identity 与 canonical view identity；view 没有另一个由 Query 生成的 identity。

### 6.2 字段来源与字段级约束

| field | canonical source | Q13 rule |
|---|---|---|
| `snapshot_ref` | Step 06 snapshot-state owner | 由首次 snapshot row mint；selector只能选择，不能 mint/改写 |
| `freshness_marker_ref` | persisted projection freshness marker | marker identity稳定；必须与 `freshness` variant parity |
| `subject_ref` | committed snapshot state | 必须与 `BySubject` selector或 current-head proof exact equal |
| `state` | committed `ReferenceSnapshotStateKind` | 逐 snapshot local state；不表达 resolver这次是否被调用 |
| `safe_summary_ref` | committed safe resolver summary ref | 只允许 state matrix允许的 pair；不携带 raw summary/body |
| `source_version` | committed accepted source-version ref | 只与 safe summary成对存在；不是 repository row version |
| `gap_refs` | committed snapshot-associated gap relation | typed set必须来自同一 boundary；不从 gap count或latest scan生成 |
| `visibility` | persisted source visibility + P11 narrowing | caller不能直接提交最终 surface；body presence必须匹配 |
| `freshness` | persisted projection marker/maintenance relation | 与 local `state`分开；不由 state、requested time或successful read推导 |

### 6.3 State / summary / version matrix

| `state` | `safe_summary_ref` | `source_version` | Q13 surface rule |
|---|---|---|---|
| `Resolved` | `Some` | `Some` | summary/version必须成对；这只证明 local reference resolution state，不自动证明 projection `Fresh` |
| `Stale` | `Some` | `Some` | 可保留最后完整 pair并显式保持 stale；不得只保留其中一项 |
| `Stale` | `None` | `None` | 允许表示 stale snapshot已无可安全暴露 pair；不能补空 summary或当前 resolver结果 |
| `Pending` | `None` | `None` | 不可暴露 normal summary/version body |
| `Unresolved` | `None` | `None` | reason留在 owning state/source，不在 view中伪造 summary |
| `Invalid` | `None` | `None` | current `Invalid` 必须可由 BySubject读取；不得被 current usable lookup过滤 |
| `Unavailable` | `None` | `None` | 表达 local resolver/reference availability，不等于 Query store unavailable |

任何其他组合（单独 summary、单独 version、`Resolved`缺任一项、`Pending`带 pair、`Invalid`带 pair）均为 persisted invariant/reference consistency error，不得返回 partial view。Q13 不修复该错误、不调用 resolver重建 pair。

### 6.4 Identity 与 replacement

| identity | owner / lifecycle | prohibited derivation |
|---|---|---|
| `snapshot_ref` | application id generator在新 snapshot-state row首次创建时生成；普通 state replacement保持稳定；Invalid recovery按Step06规则使用新 identity | selector bytes、subject bytes、digest、time、row version、cursor、state或hash |
| `freshness_marker_ref` | projection marker owner在projection surface首次创建时生成；replacement保持 marker contract | snapshot ref、state、query time、source version或digest |
| `subject_ref` | trusted subject/reference boundary提供 | 从 snapshot ref、summary、route或resolver response body反推 |

BySnapshot 的 selected identity与returned `snapshot_ref`必须相等。BySubject 的 selector不生成 identity；它只经过 current-head relation取得一个已有 `snapshot_ref`。同一 identity 的 replacement不得令 Query重新 mint view/marker ref。

## 7. Same-committed-boundary read contract

### 7.1 Boundary 与 atomicity

Q13 的 point read 必须满足：

1. selector decode、typed cardinality和digest validation在 repository call前完成。
2. 一个 Query-safe read boundary 同时取得 view/state relation、subject/current-head proof、marker/freshness、gap revisions、visibility provenance和必要 absence/availability material。
3. `BySnapshot` 不能先读 state再跨时间读 view；`BySubject`不能先读 current head再用另一个 transaction读 view。
4. `Ok(None)`、no-current-head、retention absence、visibility restriction、dependency failure、duplicate head和relation corruption必须由 typed carrier分别表达。
5. repository version只作为内部 consistency guard；不能穿透到 public response，也不能让 Query取得 writer CAS capability。
6. read boundary失败时不返回一个由已成功字段拼出的 partial `ReferenceSnapshotView`。

### 7.2 Required relation checks

| relation | required check | failure |
|---|---|---|
| selector -> selected identity | BySnapshot identity exact；BySubject current-head subject exact | `RelationMismatch` / typed invalid selector |
| snapshot -> subject | state.subject_ref与view.subject_ref exact | `ReferenceConflict` |
| current-head -> view | current head指向的 snapshot identity与view exact；包括 Invalid | `ReferenceConflict` / consistency error |
| view -> marker | marker ref与freshness payload exact | marker/reference consistency error |
| view -> gaps | `gap_refs`都是同一 snapshot current revisions，且visibility/degraded source只引用集合内 ref | gap invariant error |
| projection freshness -> progress | Rebuilding `progress_ref`（若有）指向同一 target/scope binding | rebuild relation error |
| surface -> body | visibility、presence、state pair和availability交叉合法 | response assembly error |

### 7.3 Current-head semantics

`BySubject` 的 “sole current head” 是 committed index/relation事实，不是 “最新时间的一行” 或 “第一个可用状态”。合法结果只有：

| index result | Q13 meaning |
|---|---|
| exactly one head, view relation valid | 继续组装 Present/visibility-limited result；head state可为任一 finite state，包括 Invalid |
| no head, committed absence anchor valid | 进入 typed Missing/NotYetProjected/SourceReferenceUnavailable分支，具体由 anchor owner决定 |
| duplicate heads | consistency/reference error；不取 max time、max ref或任意第一条 |
| head exists but view absent | typed not-yet-projected或relation error，取决于 committed anchor；不合成 view |
| index unavailable/incomplete | dependency availability/error；不视为 no head |

### 7.4 P10 no-write boundary

P10 必须绑定 Q13 的 exact attempted read target与 `ReadCommittedSurface`。现有 `ReadEvaluationTargetRef` 可以表达 snapshot object，但不能无损表达“按 subject 解析 current head且在无 head时安全披露 absence”的 target/absence anchor。Q13 因此登记 `S08-D-Q13-POLICY-TARGET-01`，要求 Step 06/07 增加有限 reference selector target或等价 target-bound carrier；不能把 `ReferenceSubjectRef` 强转成 `ObservationObjectRef`，也不能用 `ProjectionScope` 或 snapshot ref代替 subject absence target。

P10 `Blocked` 是正常 no-write outcome，不调用任何 mutation。Q13 不调用 `NoWriteGuardPolicy` 的 writer/effect path，不产生 `NoWriteViolation`；如果 policy material不完整，返回 typed policy/consistency error并保持 zero-write。

### 7.5 P11 visibility boundary

P11 输入必须来自：trusted actor、trusted `VisibilityScopeRef`、exact Q13 target、committed snapshot/view visibility provenance、current gap revisions、projection freshness和同一 one-shot read context。request selector只能选择目标，不能提交 `Visible`、`Restricted`、`NotVisible` 或 block reason。

P11 只能保持或收窄 committed visibility：

| committed source | legal Q13 outcome |
|---|---|
| `Visible` + complete target/policy | 可在 body/state matrix合法时返回 Present |
| `Restricted` | 只能保持 Restricted 或进一步收窄；不得升级 Visible |
| `NotVisible` / `Blocked` | body必须为 None；不得通过 snapshot ref证明存在后返回 body |
| missing visibility provenance | `RelationMismatch` / `Unknown`，不得默认 Visible |
| request scope过窄或 freshness policy要求限制 | response-only 收窄；不修改 persisted view |

Q13 当前不能构造 required `DiagnosticRequestContext`：该类型强制 projection/diagnostic scope，而 Q13 selector不是其合法 scope source。`S08-D-Q13-REQUEST-CONTEXT-CARRIER-01` 必须由上游提供 trusted non-body carrier后才能进入 P10/P11；本批不私造替代类型。

## 8. Freshness、rebuild、gap 与 availability

### 8.1 双 freshness 轴

Q13 同时暴露两种不同语义：

| 轴 | owner | 表达 | 不表达 |
|---|---|---|---|
| local reference state | `ReferenceSnapshotStateKind` | Pending/Resolved/Stale/Unresolved/Invalid/Unavailable | projection是否覆盖当前 committed read boundary |
| derived projection freshness | `ObservationProjectionFreshnessSurface` + marker | Fresh/Stale/Rebuilding/Unknown | resolver是否被调用、source reference是否有效 |

因此：

- `Resolved + Fresh` 是合法组合，但 `Resolved` 不自动产生 `Fresh`。
- `Resolved + Stale/Rebuilding/Unknown` 也是可能的，必须按 consistency/visibility policy映射。
- `Unavailable + projection Available` 表示 local snapshot已提交但当前 resolver reference不可用；不能把 projection store标为 unavailable。
- `Resolved + projection Unavailable` 表示 local state存在但本次 Query无法安全读取 projection；不能返回可伪造的 view。

### 8.2 Consistency hint matrix

Q13 复用 `ObservationConsistencyHint`：

| hint | Fresh | Stale | Rebuilding | Unknown |
|---|---|---|---|---|
| `AllowStale` | 可返回 body | 可按 visibility返回 body并保留 stale | 可返回旧 committed body，必须携带 rebuild relation | 不返回 body |
| `RequireFresh` | 可返回 body | view=None并保留 exact freshness | view=None，不能等待 | view=None |
| `BestEffort` | 可返回 body | 可返回最安全 committed body并保留 stale/degraded | 可按 policy返回旧 body；不能升级 Fresh | 不返回 body |

hint 不是 freshness authority，不持久化、不触发 refresh/rebuild、不改变 snapshot state。marker parity缺失时不能为了满足 `RequireFresh` 读取 source或调用 resolver。

### 8.3 Marker 与 rebuild relation

`Fresh` 只能由 persisted marker证明；marker必须与 selected view、subject relation、projection scope/target和同一 committed boundary匹配。`Stale` 必须携带 stable marker；`Rebuilding` 可携带 `progress_ref=None`，但若为 `Some` 必须解析到同一 immutable maintenance target/scope binding。`Unknown` 不能从 row version、state、query clock或成功读取推断。

Q13 只读取已有 `RebuildProgressView` relation（如 shared carrier提供），不 mint progress ref、不按 target寻找“最新” progress、不等待或推进 Job、不把 `Completed` 映射为 resolver/source success。缺 progress、progress target mismatch或 marker mismatch是 typed relation/availability error，不是自动修复机会。该边界登记为 `S08-D-Q13-REBUILD-RELATION-01`。

### 8.4 Gap source

`gap_refs` 必须来自 snapshot/view committed relation或同 boundary 的 typed gap set。Q13 不扫描 gap store、取 latest gap、按 state/count构造 gap、不打开/关闭/抑制/解决 gap。P11/P13只能消费这些已加载 current revisions；gap ref缺失、重复、跨 subject或跨 boundary时返回 consistency error。

### 8.5 Availability source 与分离

Q13 只允许读取 local product-neutral availability snapshot；不 probe `SubjectObservationResolver`。至少区分：

| source | public meaning |
|---|---|
| projection/read boundary available | 可继续验证 committed material；不是 reference resolver success |
| projection/read boundary unavailable | `ObservationAvailabilitySurface::Unavailable/Failed { adapter_family: ProjectionStore }` 或 typed application error；不返回 Missing |
| local snapshot state `Unavailable` | view state为 `Unavailable`，若其他 material可安全返回；不改变 Query store availability |
| marker/gap/policy dependency unavailable | finite dependency availability/consistency mapping；不选择第一错误并覆盖其他 source |
| resolver adapter unavailable | Q13 不调用 resolver；只能作为已提交 local snapshot state 的历史语义读取，不能在 Query 中现场探测 |

`AdapterFamily`、provider/endpoint/credential、SQL、timeout和raw error detail不进入 public view。多依赖同时异常时必须由 Q13-specific mapper给出固定 precedence；不能 `first error wins`、fallback source scan或 timeout-as-Missing。该缺口登记为 `S08-D-Q13-AVAILABILITY-SOURCE-01`。

## 9. Presence、degraded、error 与 response invariants

### 9.1 Point presence matrix

| condition | presence | view | missing / error | rule |
|---|---|---|---|---|
| complete visible committed view | `Present` | `Some` | `None` | body字段和 state pair合法；freshness/availability显式 |
| definitive no snapshot/head with typed anchor | `Missing` | `None` | typed `ObservationMissingSurface` | 仅在 absence proof成立时使用 |
| subject/view not yet projected with committed source anchor | `Missing` | `None` | `NotYetProjected` | 不合成 snapshot/view identity |
| retained identity outside local retained window | `Missing` | `None` | `OutsideRetainedObservationWindow` | 需要 retention marker/anchor；不能由 None猜 |
| reference relation explicitly unavailable | `Missing` 或 owning typed surface | `None` | `SourceReferenceUnavailable` | 只在 committed reference-state proof存在时使用 |
| hidden or existence cannot safely be disclosed | `Unknown` / `NotVisible` | `None` | no fake missing | visibility ceiling优先于 existence |
| duplicate head, marker mismatch, corrupt relation | no normal presence | `None` | typed consistency/reference error | 不返回 partial body |
| read dependency unavailable | no normal presence | `None` | availability/error | 不映射为 Missing |
| successful bounded read with no collection items | 非法 `Empty` | N/A | protocol invariant error | Q13 是 point Query，不是 collection/page |

`ObservationQueryResponse<ReferenceSnapshotView>` 的 `Empty` 对 Q13 永远非法。`Missing` 需要 typed anchor，`Unknown` 不等于 NotFound；`NotVisible` 不泄露目标是否存在。response assembler只能从 complete `ObservationQueryResult<ReferenceSnapshotView>` losslessly构造 response，不得再次读取 repository补字段。

### 9.2 Degraded mapping

P13 只允许在 exact Q13 target、complete P11 decision、explicit safety input、current gap revisions和persisted freshness material齐备时做 response-only mapping。可将 stale/rebuilding/limited visibility映射为有限 `DegradedSurface`，但：

- 不创建或替换 `DegradedOutputState`；
- 不从 state name、gap count、error text、availability default或missing enum猜 degraded reason；
- 不把 local `Unavailable`、`Invalid`或hidden自动变成同一种 degraded；
- 不用 degraded surface补齐 summary/version、marker或absence proof；
- P13 decision/basis不进入 durable Query result、audit或outbox。

### 9.3 Finite precedence

Q13 response mapper采用以下优先级，具体 enum/code owner仍由 Step 12/Step 07 affected修订承接：

1. malformed request、unknown selector token、digest mismatch：protocol/application invalid，早于任何 read。
2. trusted context、P10 target或P11 source缺失/不匹配：policy/context/consistency error，禁止 fallback。
3. persisted relation corruption、duplicate current head、marker/gap mismatch：typed reference/persistence invariant error。
4. visibility ceiling：NotVisible/Blocked/Unknown优先于存在性披露；不把 hidden 映射 Missing。
5. read dependency availability：Unavailable/Failed/Disabled保持 availability/error；不把失败映射 Missing。
6. definitive typed absence：只有 anchor 完整时返回 Missing。
7. freshness/rebuild/degraded policy：保留 persisted surface，按 hint和P11允许返回 body或限制。
8. Present：仅在所有 relation、state pair、visibility和surface invariant通过后返回。

### 9.4 Response invariants

`ObservationQueryResponse::try_new(...)` 至少验证：

| invariant | required rule |
|---|---|
| query binding | `query_name`必须是 `GetReferenceSnapshotView`，view type必须唯一匹配 |
| selector relation | returned `snapshot_ref`与 BySnapshot exact equal，或与 BySubject current-head proof exact equal |
| body/presence | `Present`恰有一个 body；Missing/Unknown/NotVisible不得带 unproven body |
| state pair | `Resolved`/`Stale`与summary/version matrix一致；其余 state无pair |
| visibility | body不能超出 persisted surface或P11 narrowing result |
| freshness | marker ref、freshness variant、rebuild relation三者一致；不能以 state升级 |
| gap/degraded | gap refs属于 current set；degraded reason/gap若有必须可回指；不创建 durable state |
| availability | availability不与 local state或error混为一类；provider detail不泄漏 |
| missing | Missing必须有 typed missing surface；Empty禁止；error与normal Missing不可共存 |

## 10. Error mapping 与 zero-write

### 10.1 Error mapping

| condition | Q13 mapping | prohibited mapping |
|---|---|---|
| malformed/tagged selector or unknown field | protocol `InvalidRequest` before port call | fallback to either Option branch |
| digest profile/value mismatch | existing digest-specific `ApplicationError` | continue with recomputed/current digest |
| missing trusted request-context carrier | declared dependency/context error, fail closed | mint from selector/trace/time |
| BySnapshot identity absent without anchor | `Unknown` or typed reference/availability outcome | default `NotFound` |
| BySubject no head with valid absence proof | typed `Missing` | treat lookup error as no head |
| duplicate subject heads | `ReferenceConflict` / consistency error | choose newest/first |
| head/view/subject mismatch | typed `RelationMismatch` / `ReferenceConflict` | return view with selector rewritten |
| current state invariant invalid | persistence/reference invariant error | clear fields or call resolver |
| marker/progress/gap mismatch | consistency/rebuild/gap error | drop relation or return partial body |
| projection store unavailable | availability/error with local family | `Missing`, `Empty` or local snapshot `Unavailable` |
| local snapshot state `Unavailable` | view state/owning surface if safely committed | Query dependency unavailable |
| visibility blocked/hidden | NotVisible/Unknown surface | disclose existence via Missing |
| P10/P11/P13 stale/mismatched decision | policy binding error | reevaluate using caller substitutions |

Q13 不创建新的 parallel error enum。具体 `ApplicationError`/protocol code、recovery class和transport mapping由 current owner与 Step 12 total mapping承接；本文件只固定语义分层和禁止压缩。

### 10.2 Zero-write matrix

| candidate effect | Q13 ruling |
|---|---|
| create UoW, idempotency reservation or stored result | forbidden |
| call writer repository, `get_*_with_version`, CAS or replacement port | forbidden |
| call `find_current_snapshot_by_subject` writer lookup as Query source | forbidden |
| call resolver / P15 / P16 / P17 / P18 / external adapter | forbidden |
| create/replace snapshot state/view/marker/gap/degraded/progress | forbidden |
| start/wait/resume/advance/complete/cancel/repair rebuild | forbidden |
| append H10/H11/read audit/outbox/history | forbidden |
| read raw source/business/resolver/provider body to fill a field | forbidden |
| turn repeated Query into Command replay/idempotency outcome | forbidden; repeat is ordinary read |

All normal, missing, hidden, stale, rebuilding, unavailable, invalid and error branches leave snapshot state, projection view, markers, gaps, maintenance state, source/business truth, external systems and durable audit/outbox state unchanged.

## 11. Field / owner / affected closure table

| closure item | current owner / callable | Q13 conclusion |
|---|---|---|
| logical operation | `ObservationQueryOperation::GetReferenceSnapshotView` / S08-B registry | one point Query retained; no refresh/aggregate alias |
| public request | `GetReferenceSnapshotViewRequest` use-site | target tagged selector fixed; canonical declaration/wire owner affected |
| selector | target `ReferenceSnapshotViewSelector` | exactly one BySnapshot/BySubject branch; current two Option shape rejected |
| application input | `application::inputs::GetReferenceSnapshotViewInput` | selector + shared Query fields; current owner must propagate normalized selector |
| digest | Step 06 canonicalizer Q13 row | discriminator and complete typed payload included; trace/requested_at excluded |
| API assembler | `ObservationApiInputAssembler::get_reference_snapshot_view` | exact callable recorded; no I/O/policy/resolver |
| Read façade | `ObservationReadService::get_reference_snapshot_view` | exact return recorded; composite point carrier affected |
| Query facet | `ObservationProjectionQueryStore::get_reference_snapshot_view` | BySnapshot Option callable insufficient; BySubject Query-safe current-head callable absent |
| writer maintenance lookup | `ReferenceMaintenanceRepository::find_current_snapshot_by_subject` | writer-oriented and “current usable”; prohibited as Query source |
| state owner | Step 06 `ReferenceSnapshotState` | unique local reference observation truth; Query only reads |
| view owner | Step 06 `ReferenceSnapshotView` | unique public body; no Q13 duplicate |
| snapshot identity | `ReferenceSnapshotStateRef` | stable canonical view identity; no selector/hash mint |
| subject identity | `ReferenceSubjectRef` | selector/current-head relation only; no snapshot identity derivation |
| marker/freshness | `ProjectionFreshnessMarkerRef` + `ObservationProjectionFreshnessSurface` | persisted marker parity; independent from local state |
| gaps | committed `GapStateRefSet` relation | same-boundary current revisions only; no lookup fallback |
| P10 target | `NoWriteGuardPolicy` / `ReadEvaluationTargetRef` | exact subject/current-head absence anchor missing; affected |
| P11 visibility | `ReadVisibilityPolicy` / one-shot input | trusted context carrier and source mapper missing; affected |
| P13 degraded | `DegradedOutputPolicy` | response-only mapping; no durable write |
| availability | `ObservationAvailabilitySurface` / `AdapterFamily` | local snapshot and Query dependency axes must remain separate; mapper affected |
| response mapper | `ObservationQueryResult<ReferenceSnapshotView>` -> public response | finite Q13 mapper and cross-field validation affected |
| Step09 handoff | `GetReferenceSnapshotViewFlow` | reserved only; no function flow in this batch |

## 12. Q13 affected register

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q13-REQUEST-SCHEMA-01` | `open_upstream_internal` | current request只有两个 Option use-site，缺canonical tagged public declaration、wire schema、sealed Query binding、unknown-field和decoder owner | Step06/07在唯一 contracts owner声明 `ReferenceSnapshotViewSelector` + request，并传播exact binding/digest order | Step08创建第二 DTO/alias、保留双Option wire、从route猜分支 |
| `S08-D-Q13-SELECTOR-CARDINALITY-01` | `open_internal_affected` | 两个 Option允许四种组合，type层不能阻止none/both；BySubject与BySnapshot的absence语义也未静态分开 | assembler/application增加private normalized tagged selector；service按两分支穷举 | first-wins、both优先snapshot、none当global/current scan、隐式默认subject |
| `S08-D-Q13-SUBJECT-CURRENT-HEAD-01` | `open_internal_affected` | current subject lookup只给writer-oriented Versioned且“usable”会隐藏 Invalid；缺Query-safe sole-head including Invalid carrier与0/1/duplicate totality | 提供bounded current-head index/read carrier，明确 no-head、Invalid、duplicate、index error和head/view parity | 调用maintenance lookup、过滤Invalid、取最新时间/第一行、把error当no-head |
| `S08-D-Q13-POINT-READ-BUNDLE-01` | `open_internal_affected` | BySnapshot Option view与BySubject head/view/marker/gap/visibility/freshness/absence/availability没有共同 committed boundary | 提供least-authority `ReferenceSnapshotViewPointBundle`或等价唯一carrier，一次返回完整 read-safe material | N+1 lookup、跨transaction拼装、full UoW、writer Versioned、source scan |
| `S08-D-Q13-IDENTITY-RELATION-01` | `open_internal_affected` | snapshot_ref同时是state/view identity，但selector/head/view/marker replacement与rehydration parity没有由Query carrier证明 | carrier逐字段证明stable identity、subject relation、marker relation和replacement semantics | selector/digest/time/version/cursor派生ref、每次read mint view/marker |
| `S08-D-Q13-POLICY-TARGET-01` | `open_upstream_internal` | P10/P11现有target能表达snapshot object，不能表达BySubject no-head disclosure anchor与current-head selection | 增加有限 reference selector target/absence anchor或等价 target-bound carrier | 将subject强转ObservationObjectRef、scope-only、snapshot-ref代替subject absence、跳过P10 |
| `S08-D-Q13-REQUEST-CONTEXT-CARRIER-01` | `open_upstream_internal` | `DiagnosticRequestContext`要求projection/diagnostic scope；shared Query metadata/input没有trusted non-body carrier，不能合法构造Q13 one-shot context | Step06/07定义trusted entry carrier位置、scope binding、digest和lifetime；保持public body无context ref | 从snapshot/subject/trace/digest/requested_at派生、application临时mint、caller提交context |
| `S08-D-Q13-VISIBILITY-SOURCE-01` | `open_internal_affected` | P11需要actor、visibility scope、exact target、persisted visibility、gap provenance、freshness与one-shot context；current view不足 | 提供Q13 visibility source/mapper，固定visibility-before-existence和只收窄规则 | caller提交Visible、从state/subject kind/row existence/HTTP推导、借unrelated gap |
| `S08-D-Q13-PRESENCE-01` | `open_internal_affected` | Option view/current head无法区分no-head、not-yet-projected、retention absence、reference unavailable、hidden、corrupt和store failure | 提供typed current-head/absence anchor/retention/reference proof与finite precedence | None->NotFound/Empty、timeout->Missing、hidden->Missing、synthetic view |
| `S08-D-Q13-STATE-SURFACE-01` | `open_internal_affected` | state与summary/version conditional matrix虽有Step06规则，Query response assembler缺逐variant lossless验证 | 提供state-to-view field mapper和`try_new` cross-field validation；Resolved/Stale/other矩阵固定 | 只复制state、单项summary/version、Invalid过滤、错误清空字段后继续 |
| `S08-D-Q13-DUAL-FRESHNESS-SOURCE-01` | `open_internal_affected` | local reference state与projection freshness是独立轴，但缺共同 committed source、marker parity和hint mapper | 提供双轴 point source与3x4 consistency mapping；Fresh仅marker证明 | Resolved->Fresh、state->projection freshness、row version/time/successful read伪造 |
| `S08-D-Q13-GAP-SOURCE-01` | `open_internal_affected` | gap_refs、visibility/degraded source与snapshot relation缺same-boundary current revision proof | 提供typed gap relation set、revision parity和absence/degraded source mapping | latest gap、gap count、跨subject gap、missing gap当no-gap |
| `S08-D-Q13-REBUILD-RELATION-01` | `open_internal_affected` | projection Rebuilding progress ref、maintenance target、scope binding与reference view coverage缺Query-safe relation | 提供bounded progress-by-ref carrier及None/error/Completed mapping | mint/latest progress、wait/start/advance/repair、Completed升级resolver/source success |
| `S08-D-Q13-DEGRADED-SOURCE-01` | `open_internal_affected` | P13 exact target、P11 decision、explicit safety和complete gap revisions缺Q13 mapper | 提供response-only P13 input/decision mapper，保留state/freshness/visibility来源分离 | 从state/visibility/gap count/error合成、创建durable degraded revision |
| `S08-D-Q13-AVAILABILITY-SOURCE-01` | `open_internal_affected` | local snapshot Unavailable、projection store failure、marker/gap/policy dependency failure的finite public precedence未闭合 | 定义Q13 dependency snapshot、local AdapterFamily mapping和disclosure-safe precedence | default Available、first error、resolver probe、timeout当Missing、provider detail泄露 |
| `S08-D-Q13-AVAILABILITY-STATE-SEPARATION-01` | `open_internal_affected` | local `ReferenceSnapshotStateKind::Unavailable` 与 projection/read/policy dependency availability 尚无唯一 cross-axis mapper；同名 `Unavailable` 可能被错误合并 | 定义 local-state surface、Query dependency surface、typed error 的独立字段来源与组合矩阵 | 把任一 `Unavailable` 直接覆盖另一轴、把 local state 当 store failure或把 store failure当 snapshot state |
| `S08-D-Q13-SURFACE-MAPPER-01` | `open_internal_affected` | Present/Missing/Unknown/NotVisible、state pair、dual freshness、rebuild、degraded、availability、error矩阵与唯一response assembler未闭合 | 提供finite Q13 result summary/assembler与cross-field validation | entry补查、state/HTTP/error text决定surface、body与missing/error共存 |
| `S08-D-Q13-REFRESH-BOUNDARY-01` | `open_internal_affected` | 当前read owner、resolver refresh、P15/P16/P17/P18和reference write path的phase边界需在Q13 use-site显式传播 | 将Q13限制为committed read，明确refresh只由后置Command/Job owner调用，并在Step09/13回指 | Query调用resolver、刷新/替换snapshot、把本次read视为refresh result或写H10 |

这些 affected 是设计闭环缺口，不是实现失败，也不声称已经运行测试。`R06.6-F2-H13-UPSTREAM=open_controlled` 仍存在，但与 Q13 的读取语义没有直接关系；本批没有发现新的外部上游 blocker。

## 13. Step 09 handoff（仅登记）

Q13 唯一 flow 名为 `GetReferenceSnapshotViewFlow`。Step 09 必须保留一个 point-only、selector-exclusive、zero-write flow：

```text
GetReferenceSnapshotViewRequest(selector)
  -> exact Query name/schema/metadata validation
  -> tagged selector cardinality and typed-owner validation
  -> canonical digest and zero-key Query context
  -> trusted one-shot context carrier validation (fail closed if absent)
  -> one Query-safe reference snapshot point bundle
       -> BySnapshot identity OR BySubject sole current head
       -> subject/head/view relation, including current Invalid
       -> state summary/version matrix
       -> marker/projection freshness and gap provenance
       -> typed absence / visibility / availability proof
  -> P10 exact reference read target
  -> P11 visibility ceiling and one-shot provenance
  -> optional response-only P13 degraded mapping
  -> finite state/presence/freshness/rebuild/availability/error mapper
  -> ObservationQueryResult<ReferenceSnapshotView>
  -> ObservationQueryResponse<ReferenceSnapshotView>
```

Step 09 不得增加：

- 第二个 Query、page/aggregate branch、双Option兼容分支、route/product selector或refresh command；
- maintenance writer lookup、N+1 read、full UoW、resolver调用、source/business truth scan或current-config fallback；
- P15/P16/P17/P18 decision、snapshot refresh、Invalid recovery、gap/degraded/marker/progress mutation；
- `None` 到 `NotFound`/`Empty` 的默认映射、Invalid过滤、Resolved到Fresh升级或Unavailable轴合并；
- read audit、H10/H11、outbox、stored result、idempotency replay或external adapter side effect；
- 任何 external reference body、provider response、verdict、signoff、acceptance或真实 evidence alias的声明。

### 13.1 Planned implementation cuts

| cut | planned assertion | status |
|---|---|---|
| selector schema/digest | one tagged selector；full typed payload and discriminator fixed order；old alias rejected | `planned/not_run` |
| cardinality | none/both/unknown variant rejected before port call；BySnapshot/BySubject branch total | `planned/not_run` |
| current-head | sole head includes Invalid；no-head/duplicate/index-error are distinct | `planned/not_run` |
| point bundle | state/view/subject/head/marker/gap/visibility/freshness/absence/availability share one boundary | `planned/not_run` |
| identity | snapshot and marker refs stable; Query never hash-mints or replaces identity | `planned/not_run` |
| state matrix | Resolved/Stale/other summary-version combinations are lossless and fail closed | `planned/not_run` |
| policy/context | exact P10/P11 target and trusted non-body context; no caller policy outcome | `planned/not_run` |
| dual freshness | local state and projection freshness remain independent; hint cannot upgrade either | `planned/not_run` |
| presence/surface | Missing requires anchor; hidden/unknown/unavailable/corrupt remain distinct; Empty rejected | `planned/not_run` |
| refresh boundary | resolver/P15-P18/writer/rebuild spies remain zero | `planned/not_run` |
| no-write/redaction | UoW/writer/record/outbox/adapter/source-body/provider scans remain zero | `planned/not_run` |

No implementation test, run id, evidence alias, acceptance result or signoff is claimed.

## 14. Q13 stop review

| check | conclusion |
|---|---|
| independent request/input/view/read-chain/identity/state/policy/presence/freshness/error/no-write/handoff record | `pass_with_affected_open` |
| one logical Query and one mutually exclusive selector | target contract pass；canonical request owner/cardinality仍affected |
| BySnapshot historical identity read and BySubject sole current head | target behavior defined；Query-safe carrier、Invalid inclusion和absence proof affected |
| writer maintenance lookup kept out of Query | pass；`find_current_snapshot_by_subject`不作为Q13 source |
| exact assembler and Read façade recorded | pass at observed owner level；normalized input/context carrier仍affected |
| unique `ReferenceSnapshotView`/state/ref/subject owner | pass；Q13未创建第二owner |
| state summary/version matrix | target invariant defined；Step07 lossless mapper/validation affected |
| stable snapshot/marker identity | target contract pass；rehydration/replacement proof affected |
| P10/P11 target and trusted context | target behavior defined；subject absence target和one-shot carrier affected |
| local reference state vs projection freshness | pass_design_record；common source/hint mapper affected |
| presence/visibility/availability/degraded/rebuild surface | target behavior defined；typed carriers/mappers affected |
| resolver/refresh/P15-P18/external boundary | pass；Q13 zero-call/zero-write boundary fixed |
| Query zero-write and no source/business truth upgrade | pass |
| all eighteen Q13 affected registered | pass |
| new external upstream blocker | none；known `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated |
| current protocol count | `29/60 defined_with_affected_open`；Query `13/14`；`0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q14 |
| current commit | not needed; user did not request one |

Q13 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 15. Recovery point

```text
Step08_S08-D_Q13_defined_with_affected_open_waiting_user_before_Q14
```

Before explicit user confirmation, do not read or write Q14, S08-E~G, Step 09~19, formal `03`, any `04` file or implementation code. The next permitted reading after confirmation is only the Step 06/07 and current Step 08 input required by Q14 `GetRebuildProgress`. Current commit remains unnecessary.
