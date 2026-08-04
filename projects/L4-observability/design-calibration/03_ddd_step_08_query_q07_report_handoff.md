# L4-observability 详细设计 Step 08

## S08-D Query Q07 `GetReportHandoff`

> 本文件是 Q07 的独立讨论中间产物。它只覆盖 `GetReportHandoff`，不关闭 Q08-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q07 |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q08` |
| 逻辑协议 | `Query / GetReportHandoff / GetReportHandoffRequest` |
| 后续处理流 | `GetReportHandoffFlow`，这里只登记 handoff，不展开 Step 09 |
| 当前协议计数 | `23/60 defined_with_affected_open`；`0/60` 无条件完成 |
| Query 计数 | `7/14 defined_with_affected_open`；`7/14` 待逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 冻结，不回填 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q08 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

### 1.1 本批禁止事项

- 不读取或写入 Q08-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 临时声明 `ReportHandoffView`、`GetReportHandoffRequest` 或一组与 domain state 同名的 public alias 为 canonical owner。
- 不调用 `stage_handoff`、`stage_authenticity_hint`、`append_lifecycle_record`、`append_evidence_index_input`、任何 UoW、external adapter、prepare 或 deliver callable。
- 不重新执行 P6 authenticity 或 P7 readiness，不把 Query 变成 reevaluate、refresh、repair、rebuild 或 retry 入口。
- 不读取 report body、evidence body、source audit body、provider receipt、destination locator、credential、真实 run id、真实 evidence alias、最终 verdict 或 signoff。
- 不把 `Delivered` 解释为外部接受、报告正确或验收通过；不把 `RealEvidenceLinked` 解释为真实性 verdict。
- 不创建 read audit、H4 lifecycle record、stored result、reservation、history、outbox 或 retention mutation。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `详细设计讨论流程_SOP.md` Step 08 | Query 逐协议 request/view/source/presence/visibility/freshness/degraded/error/no-write/停审要求 |
| `详细设计书写规范.md` 5.6/5.7 | public DTO、secondary type、字段来源、错误和 API 协议粒度 |
| `设计文档讨论中间产物规范.md` | 独立 Step 产物、affected 登记、停审和恢复点规则 |
| `设计真相源闭环与可落码性标准.md` | public view owner、composite read、visibility/freshness、typed consistency 和 no-write 门禁 |
| Step 06 application input assembly | `GetReportHandoffInput`、request use-site shape 和 least-authority assembler |
| Step 06 boundary/read/maintenance 专项 | 完整 `ReportHandoffRecord`、`AuthenticityHint`、state、reason、delivery 和字段条件矩阵 |
| Step 06 policy/guard/record 专项 | P6/P7 结果边界、H4 schema 及 Query 不写 H4 的约束 |
| Step 07 trait/port/adapter 契约 | exact assembler、Read façade 和 `ReportHandoffRepository` callable |
| HLD、冻结 Step 09 与旧正式 `03` | 只确认 Q07 骨架和历史冲突，不作为 current exact owner |

### 2.2 权威顺序

```text
current Step 08 Q07 authority / affected register
  > Step 07 exact callable and read-only dependency boundary
  > Step 06 current complete handoff/input/hint object cards
  > current formal 02 / HLD Query skeleton
  > shorter Step 06 object card, frozen Step 09 table and old formal 03
```

### 2.3 Historical material 裁定

| material | current disposition |
|---|---|
| `03_ddd_step_06_object_contracts.md` 中较短 `ReportHandoffRecord` 卡 | `historical_material_for_Q07`；缺少 current gap/visibility/retention/no-write/delivery/block/time 字段，不能与完整 boundary 专项静默合并 |
| 冻结 Step 09 中 `GetReportHandoffFlow ... pass` | `historical_checkpoint`；未闭合 immutable input、hint 双查、current visibility、freshness 和 relation consistency |
| HLD / old formal 对 `HandoffLifecycleRecord` 的读取要求 | 只证明需要审计语义；Step 07 没有 H4 read callable，不能假设 repository 自动提供 history |
| old formal `missing -> NotFound; blocked/degraded explicit` | 作为目标语义线索；presence precedence 和 mapper 仍须由 current Q07 闭合 |

## 3. SOP 问题回答

| # | 问题 | Q07 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetReportHandoff` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> handoff read repository |
| 3 | 调用方与处理方 | exact API handler 调用 `ObservationApiInputAssembler::get_report_handoff`，再调用 `ObservationReadService::get_report_handoff` |
| 4 | 传输方式 | 只固定 logical binding；endpoint、credential 和外部 locator 后置，不进入 DTO |
| 5 | request schema | body 仅有 `handoff_ref: ReportHandoffRecordRef`；独立 canonical public declaration仍是 affected |
| 6 | response schema | non-paged `ObservationQueryResponse<ReportHandoffView>`；`Empty` 不适用于单体 point-read |
| 7 | 读取目标 | Observability-owned handoff 当前 aggregate、其 immutable input relation 和可选 current authenticity hint |
| 8 | truth 边界 | 只返回本地 handoff/readiness/authenticity/delivery projection；不拥有 report、evidence、provider、acceptance 或 signoff truth |
| 9 | handoff identity | request ref 只选择一个 exact record；不按 consumer、scope、input、状态或 ref 文本 fallback |
| 10 | immutable input | 必须按 handoff 保存的 `evidence_index_input_ref` 读取并校验；缺失或冲突是 consistency failure，不重建 current input |
| 11 | hint relation | aggregate ref、direct lookup、current-by-handoff lookup 和 `hint.handoff_ref` 必须一致；缺失/重复/错绑 fail closed |
| 12 | lifecycle history | current repository 只有 append，没有 read；Q07 本批只读取 aggregate current fields，不伪造 timeline 或 latest H4 ref |
| 13 | visibility | request-scoped visibility 与 persisted readiness visibility 是两层不同语义；不能互相替代 |
| 14 | freshness | public response freshness必须覆盖 handoff/input/hint composite read；不能用 `updated_at`、row version 或 query time伪造 |
| 15 | gap | 返回 handoff 当前 `gap_refs` 和 hint 自身 gap refs；二者保持独立，不合并成一个集合或推导 source truth 已修复 |
| 16 | retention | 只可返回本地 `retention_marker_ref`；不得执行 hold/release/cleanup 或推导 archive eligibility |
| 17 | delivery | `HandoffDeliveryResult` 只表示本地 adapter-independent 结果；`Delivered` 不证明 consumer 接受 |
| 18 | authenticity | hint state/origin/reason只表示 non-fabricating hint；`RealEvidenceLinked` 不证明 evidence 或 report 真实 |
| 19 | actor authority | actor只来自 `ObservationQueryMetadata`；body不接受 actor、consumer、visibility、readiness 或 verdict |
| 20 | no-write | 不创建 UoW，不 stage/append，不重评 P6/P7，不触发 external adapter、refresh、repair或rebuild |
| 21 | error mapping | invalid、not-visible、missing、relation inconsistency、stale/degraded、availability 必须是 typed 且优先级有限 |
| 22 | Step 09 回指 | 只保留 `GetReportHandoffFlow` handoff；不在本批写函数级事务流 |
| 23 | 停审标准 | 独立记录 request、目标 view、read chain、relation、surface、no-write、affected 与恢复点后停审 |

## 4. Exact callable 与当前缺口

### 4.1 API assembler 与 Read façade

```rust
ObservationApiInputAssembler::get_report_handoff(
    ObservationQueryRequest<GetReportHandoffRequest>
) -> Result<GetReportHandoffInput, ApplicationError>
```

```rust
ObservationReadService::get_report_handoff(
    GetReportHandoffInput
) -> ApplicationServiceFuture<
    '_,
    ObservationQueryResult<ReportHandoffView>
>
```

这些签名固定了 operation、application input 和目标 response type 的 use-site，但不证明 `GetReportHandoffRequest`、`ReportHandoffView`、public state secondary type 或 Q07 exact response mapper 已有唯一 owner。

### 4.2 当前可用只读 repository callable

```rust
ReportHandoffRepository::get_handoff_with_version(
    &ReportHandoffRecordRef
) -> ApplicationPortFuture<Option<Versioned<ReportHandoffRecord>>>
```

```rust
ReportHandoffRepository::get_evidence_index_input(
    &EvidenceIndexInputViewRef
) -> ApplicationPortFuture<Option<EvidenceIndexInputView>>
```

```rust
ReportHandoffRepository::get_authenticity_hint_with_version(
    &AuthenticityHintRef
) -> ApplicationPortFuture<Option<Versioned<AuthenticityHint>>>
```

```rust
ReportHandoffRepository::find_authenticity_hint_by_handoff(
    &ReportHandoffRecordRef
) -> ApplicationPortFuture<Option<Versioned<AuthenticityHint>>>
```

`Versioned<T>` 只供 application 做一致性/CAS语义；row version不得进入 public view，也不能当 freshness marker。当前没有一个 exact callable 在同一 committed boundary 原子返回 handoff、input、hint、request visibility 和 freshness，因此登记 `S08-D-Q07-HANDOFF-READ-CARRIER-01`。

### 4.3 Q07 明确禁止调用的 callable

| callable / family | Q07 rule |
|---|---|
| `append_evidence_index_input` | 禁止；Q07不创建或修复 immutable input |
| `stage_handoff` | 禁止；Query不更新 aggregate 或 CAS |
| `stage_authenticity_hint` | 禁止；Query不创建、attach或重评 hint |
| `append_lifecycle_record` | 禁止；普通 Query 不生成 H4 |
| `register_handoff_read_guard` / `register_delivered_handoff_read_guard` | 禁止；它们属于 claimed external phase UoW，不是 public Query read audit |
| P6 / P7 policy evaluate | 禁止；Q07返回 persisted current decision fields，不重新解释状态 |
| delivery / report / provider adapter | 禁止；Q07没有 external phase |

## 5. Request contract

### 5.1 Logical binding

| 项 | current contract |
|---|---|
| logical binding | `Query / GetReportHandoff / GetReportHandoffRequest` |
| metadata | `ObservationQueryMetadata` 提供 actor、trace、visibility scope、consistency 和 trusted requested time |
| application input | `GetReportHandoffInput` |
| public response | non-paged `ObservationQueryResponse<ReportHandoffView>` |
| page / cursor | none |
| write lane | none |

### 5.2 Current request shape

Step 06 registry 当前给出的唯一 body use-site shape 是：

```rust
pub struct GetReportHandoffRequest {
    pub handoff_ref: ReportHandoffRecordRef,
}
```

这段代码只记录目标 schema，不宣称本文件成为 canonical declaration owner。request 不增加：

- `consumer_ref`、`handoff_scope_ref`、`evidence_index_input_ref` 或 `authenticity_hint_ref`；
- `readiness`、`state`、`visibility`、`freshness`、`delivery_result` 或 `actor_ref`；
- `page`、`cursor`、report body、evidence body、provider locator 或 retry flag。

### 5.3 Request validation matrix

| condition | mapping | prohibited fallback |
|---|---|---|
| query name / body type 与 Q07 不匹配 | `InvalidRequest`，repository 前拒绝 | 从 JSON 字段或 route 文字猜 operation |
| malformed / foreign `handoff_ref` | typed invalid reference/request | 当作 missing、consumer ref、input ref或 opaque string查询 |
| metadata actor缺失/非法 | shared typed request failure | 从 handoff consumer或ref推导 actor |
| visibility scope缺失/非法 | typed request/visibility failure | 使用 handoff persisted visibility替代 current read scope |
| consistency hint不受支持 | typed request/consistency surface | 自动 refresh/rebuild或忽略 hint |
| request合法 | 进入 point-read chain | 全局扫描、按consumer/scope查首条或创建 draft |

`S08-D-Q07-REQUEST-SCHEMA-01` 保留独立 public declaration、decoder 和 sealed body binding的上游修订；Q07 不创建 compatibility alias。

## 6. `ReportHandoffView` 目标语义契约

### 6.1 Owner 与 schema 状态

Step 07 Read façade要求 `ReportHandoffView`，但 current Step 06 没有该 view 的唯一 declaration、module path、factory、rehydrate 或 domain-to-public mapper。Q07 因此登记 `S08-D-Q07-VIEW-OWNER-01`，并只固定实现必须满足的最小语义 schema。

下列结构是 owner 修订必须承接的目标字段槽位，不是 Step 08 新建 canonical Rust owner：

```rust
pub struct ReportHandoffView {
    pub handoff_ref: ReportHandoffRecordRef,
    pub handoff_scope_ref: ReportHandoffScopeRef,
    pub consumer_ref: ReportConsumerRef,
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,
    pub state: ReportHandoffStateSurface,
    pub readiness: HandoffReadinessSurface,
    pub authenticity_hint: Option<ReportHandoffAuthenticityView>,
    pub gap_refs: GapStateRefSet,
    pub readiness_visibility: Option<VisibilitySurface>,
    pub retention_marker_ref: Option<RetentionMarkerRef>,
    pub delivery_result: Option<HandoffDeliverySurface>,
    pub block_reason: Option<HandoffBlockSurface>,
    pub updated_at: ObservedAt,
}
```

`ReportHandoffStateSurface`、`HandoffReadinessSurface`、`HandoffDeliverySurface`、`HandoffBlockSurface` 和 nested authenticity view 是目标 public secondary slots。其 exact owner/name/variant/wire/factory尚未闭合，受 `S08-D-Q07-PUBLIC-TYPE-MAPPING-01` 约束；实现不得让 contracts 直接依赖 domain-only enum，也不得用字符串 mapper代替有限类型。

### 6.2 Nested authenticity 目标语义

当且仅当 relation matrix证明存在唯一 current hint时，`authenticity_hint` 才可为 `Some`。目标最小字段为：

| field | intended source | rule |
|---|---|---|
| `hint_ref` | loaded `AuthenticityHint.hint_ref` | 必须等于 handoff attached ref 和 current-by-handoff lookup ref |
| `state` | loaded hint current state，经 public finite mapper | `RealEvidenceLinked` 不是 verdict |
| `evidence_origin` | loaded typed origin，经 public finite mapper | 不包含 provider、URI、credential、body或 run id |
| `placeholder_reason` | loaded typed reason，经 public finite mapper | 只在 Placeholder 状态允许 |
| `gap_refs` | loaded hint gap set | 与 handoff aggregate gap set分开，不自动 union |
| `insufficient_reason` | loaded typed reason，经 public finite mapper | 只在 Insufficient 状态允许 |
| `evaluated_at` | loaded hint local time | 不是 evidence occurred-at 或 report time |

若 owner 修订选择不同的具名 nested type，字段语义和条件矩阵仍必须 lossless；不能只返回一个 boolean `authentic=true/false`。

### 6.3 Field source closure table

| view field | authoritative source | Q07 closure / rule |
|---|---|---|
| `handoff_ref` | loaded `ReportHandoffRecord.handoff_ref` | 必须等于 request；row key equality不能替代对象字段校验 |
| `handoff_scope_ref` | loaded aggregate immutable relation | body-free；不能从 consumer/input/ref bytes推导 |
| `consumer_ref` | loaded aggregate immutable relation | 不代表 actor、authorization或consumer接受 |
| `evidence_index_input_ref` | loaded aggregate immutable relation | 必须成功加载同 ref immutable input并通过 relation matrix |
| `state` | loaded aggregate current lifecycle | public finite type mapping仍 affected；`Failed/Cancelled`仍是 Present body |
| `readiness` | loaded aggregate persisted P7 outcome | Query不重评 P7；Blocked/Degraded是可见本地状态，不自动成为 protocol error |
| `authenticity_hint` | aggregate ref + direct hint + current-by-handoff lookup | 三方关系必须一致；public nested owner仍 affected |
| `gap_refs` | loaded aggregate current effective set | 不从 input/hint/error补造；empty不证明外部证据完整 |
| `readiness_visibility` | aggregate persisted readiness visibility | 与 request-scoped response visibility分离；None只按 aggregate state matrix解释 |
| `retention_marker_ref` | aggregate persisted P7 relation | 只返回 ref，不读 marker body、不执行 hold/release |
| `delivery_result` | aggregate persisted local result | conditional matrix必须通过；不证明外部接受 |
| `block_reason` | aggregate persisted typed reason | 只按 state/readiness matrix暴露；不得从异常文本合成 |
| `updated_at` | aggregate local lifecycle time | 可显示本地更新时间，但不是 public freshness source |

`no_write_guard_scope`、repository version、P6/P7 `PolicyEvaluationBasis`、H4 record payload、external intent/token/receipt 和 delivery locator不属于 Q07 public view。

## 7. Composite read chain 与关系一致性

### 7.1 目标只读链

```text
GetReportHandoffRequest(handoff_ref)
  -> validate exact query binding, metadata and typed ref
  -> resolve current request-scoped visibility without leaking existence
  -> get_handoff_with_version(handoff_ref)
  -> if present, get_evidence_index_input(handoff.evidence_index_input_ref)
  -> get_authenticity_hint_with_version(handoff.authenticity_hint_ref), when Some
  -> find_authenticity_hint_by_handoff(handoff_ref)
  -> validate handoff/input/hint relation and object condition matrices
  -> obtain one composite freshness/availability summary
  -> map domain state/reason/result to contracts public secondary types
  -> ReportHandoffView factory
  -> ObservationQueryResponse<ReportHandoffView>
```

读取实现可以在 handoff 加载后并行读取 input/direct hint/current hint，但调用完成顺序不得决定错误优先级。若 repository不能提供一致的 snapshot/read transaction或具名 composite carrier，Q07必须保持 affected，不得把多个时间点的行静默拼成一个正常 view。

### 7.2 Handoff 与 immutable input relation matrix

| check | valid condition | failure mapping |
|---|---|---|
| request identity | loaded handoff ref == requested ref | persistence consistency failure |
| input presence | exact `get_evidence_index_input` returns Some | dangling immutable relation；不是 handoff Missing |
| input identity | loaded input `input_ref` == aggregate input ref | consistency failure |
| consumer relation | handoff consumer与input `consumer_scope`按 formal mapping兼容 | typed relation failure；mapping owner仍 affected |
| scope relation | handoff scope与input snapshot scope/binding按 formal mapping一致 | typed relation failure；不能从 ref bytes推导 |
| immutable semantics | input按 committed snapshot原样读取 | 不从 current linkages/projections/gaps重建或覆盖 |

当前没有一个 exact owner闭合 `ReportHandoffScopeRef + ReportConsumerRef + EvidenceConsumerScope + EvidenceIndexInputViewRef` 的 relation mapping，因此登记 `S08-D-Q07-INPUT-RELATION-01`。Q07复用 `S08-C07-IMMUTABLE-INPUT-REF-01`，但不重复关闭其 mint/rehydrate 冲突规则。

### 7.3 Authenticity hint relation matrix

| aggregate ref | direct lookup | current-by-handoff | result |
|---|---|---|---|
| `None` | not called | `None` | valid no-hint surface |
| `None` | not called | `Some(_)` | attachment/current relation inconsistency |
| `Some(A)` | `Some(A)` with same handoff | `Some(A)` | valid current hint |
| `Some(A)` | `None` | any | dangling attached ref consistency failure |
| `Some(A)` | `Some(A)` for another handoff | any | cross-handoff consistency failure |
| `Some(A)` | `Some(A)` | `None` | current index inconsistency |
| `Some(A)` | `Some(A)` | `Some(B)` where B != A | duplicate/conflicting current hint |

Repository文字说明声称 current-by-handoff 至多一条，但返回类型 `Option` 本身不能证明 durable uniqueness、direct/index parity和同一 snapshot。exact relation carrier与错误 mapping未唯一闭合，登记 `S08-D-Q07-HINT-RELATION-01`。

### 7.4 Lifecycle record boundary

H4 `HandoffLifecycleRecord` 是 append-only audit truth，包含 before/change/after、typed reason和policy basis，但 Step 07 当前只提供 `append_lifecycle_record`，没有按 handoff 读取 H4 的 callable、order、bound、cursor或public projection。

因此 Q07 当前规则是：

1. `ReportHandoffView` 读取 aggregate current fields和current hint，不拼接 timeline。
2. 不把 `updated_at`、row version或最后一条猜测记录当 `latest_lifecycle_record_ref`。
3. 不为满足 HLD 骨架而调用 writer、扫描内部表或返回 unbounded history。
4. Step 06/07 必须明确最终 Q07 是 current-state-only，还是增加 bounded H4 read projection；登记 `S08-D-Q07-LIFECYCLE-SOURCE-01`。

## 8. Presence、visibility、freshness 与 degraded surface

### 8.1 Point-read presence matrix

| condition | public presence | body / disclosure rule |
|---|---|---|
| visible、relation-valid handoff exists | `Present` | `Some(ReportHandoffView)` |
| exact handoff conclusively absent且visibility允许分类存在性 | `Missing` + `NotFound` | body None；Q07不创建 Draft |
| target hidden / existence不可安全披露 | policy-defined `Unknown` / NotVisible surface | body None；不得返回 `Missing` |
| handoff exists but input/hint relation broken | typed consistency error | body None；不得返回 partial view或Missing |
| dependencies unavailable | availability/unknown surface | body按policy决定；不得把异常压成Missing |
| aggregate state `Draft/Prepared/Delivered/Failed/Cancelled` | `Present` | state是body内容，不改变 presence |
| readiness `PendingEvidence/Ready/Blocked/Degraded` | `Present` | readiness是body内容；Blocked/Degraded不自动成为error |

Q07 是单体 point-read，`ObservationQueryPresence::Empty` 永远非法。`Missing` 只用于 exact target本地不存在，不用于 hidden、dangling relation、hint absent、input absent或 repository failure。

### 8.2 Two visibility layers

| layer | source | meaning |
|---|---|---|
| public response `visibility` | current request metadata + formal read visibility decision/mapper | 当前调用者能否看到 Q07 body；不得由 aggregate persisted state代替 |
| view `readiness_visibility` | persisted `ReportHandoffRecord.visibility` | 最近 accepted readiness snapshot使用的 observation-side visibility；不是当前授权 truth |

规则：

- current read visibility为NotVisible/Blocked时，整个 view absent，不能通过 `readiness_visibility` 泄露 handoff/input/hint existence。
- persisted `readiness_visibility=None` 只可按 current aggregate条件矩阵出现；不能由 Query填充 current visibility。
- current visibility允许 body时，persisted NotVisible/Blocked仍可作为 handoff状态被安全映射，但不得被升级为当前 actor授权判断。
- exact resolver/source仍未由 Step 07 为 Q07唯一绑定，登记 `S08-D-Q07-VISIBILITY-SOURCE-01`。

### 8.3 Freshness rules

`ObservationQueryResponse` 要求 `ObservationProjectionFreshnessSurface`，但 Q07 当前 read chain没有覆盖 handoff、input、hint和visibility的共同 committed marker。

| candidate source | Q07 ruling |
|---|---|
| handoff `updated_at` | 禁止；只是本地 lifecycle time |
| hint `evaluated_at` | 禁止；只是本地 assessment time |
| repository row version | 禁止；是 application consistency/CAS carrier |
| input `freshness` | 只能描述 immutable input snapshot，不能单独证明 handoff/hint current |
| query `requested_at` | 禁止；请求时间不创建 Fresh |
| current rebuild state | 禁止；Query不得以 rebuild状态替代 committed marker |
| formal composite read marker | 允许；必须覆盖本次全部 required owners并有一致性证明 |

正式 composite marker/source未闭合，登记 `S08-D-Q07-FRESHNESS-SOURCE-01`。在该缺口关闭前，Q07不能默认返回 `Fresh`。

### 8.4 Degraded 与 availability

- `HandoffReadinessState::Degraded` 是 aggregate persisted业务内观测状态，不等于 public dependency degraded；两者可同时存在但不能互相推导。
- stale input、current visibility限制、repository unavailable、hint relation failure和aggregate readiness degraded必须保留各自 typed source。
- limited body只在正式 policy允许且所有 relation仍完整时返回；relation损坏不能以 degraded partial body掩盖。
- 多依赖失败的有限优先级和 mapper尚未唯一绑定，登记 `S08-D-Q07-SURFACE-MAPPER-01`；共享 `S08-D-QUERY-SURFACE-MAPPER-01` 继续复用但不在 Q07关闭。

## 9. State、reason 与 body 条件矩阵

### 9.1 Handoff aggregate conditions

| condition | required public semantics | invalid combination |
|---|---|---|
| `Draft + PendingEvidence` | present draft；hint/marker/gap可按 persisted facts出现 | 伪造Ready、Prepared或delivery success |
| `Prepared` | local body-free handoff已准备；仍不表示已交付 | delivery result提前存在 |
| `Delivered` | local state和delivery surface均明确 local-delivered | `delivery_result != Delivered` 或缺失 |
| delivery-originated `Failed` | finite local failure result可见 | 同时伪造policy block reason |
| preparation/policy `Failed + Blocked` | typed block reason可见，delivery result absent | 把blocked当provider failure或外部拒绝 |
| `Cancelled` | local terminal cancellation | 暗示报告撤回、source truth删除或consumer回滚 |
| readiness `Ready` | persisted P7 outcome；gap set按owner matrix empty | 暗示consumer接受或report正确 |
| readiness `Degraded` | explicit local degraded readiness | 自动转成 protocol error或normal Ready |
| readiness `Blocked` | typed public block surface | 从error text构造reason或隐藏为Missing |

### 9.2 Authenticity hint conditions

| hint state | allowed fields | prohibited interpretation |
|---|---|---|
| `Unassessed` | no origin/reason，gap按owner matrix | 当作 false verdict |
| `RealEvidenceLinked` | trusted body-free origin classification | 真实性证明、evidence body校验或signoff |
| `PlaceholderDetected` | placeholder origin + exact placeholder reason | 推断source环境、provider或fixture正文 |
| `Insufficient` | exact insufficient reason + required gap relation | 当作false verdict或自动placeholder |

Domain state、reason、delivery和origin如何映射到 contracts public secondary type仍由 `S08-D-Q07-PUBLIC-TYPE-MAPPING-01` 约束。Mapper必须 total、finite、lossless；不能 serde-cast、debug-string或同名 alias。

## 10. Error 与 no-write matrix

| condition | public/application mapping | side effect rule |
|---|---|---|
| malformed binding/body/metadata | `InvalidRequest` / typed reference error | repository write 0；UoW 0 |
| current visibility hidden | NotVisible/Unknown surface | 不披露 existence、scope、consumer、input、hint或state |
| handoff repository unavailable | typed availability/error | 不调用 external/source fallback |
| handoff absent | `Missing(NotFound)`，前提是 visibility允许分类 | 不创建 draft，不按consumer/scope fallback |
| loaded ref与request不一致 | consistency failure | 不返回body |
| immutable input missing/mismatch | consistency failure | 不重建、不append、不返回partial view |
| consumer/scope/input relation不明 | typed relation/affected fail-closed | 不从ref/string/default推导 |
| hint dangling/duplicate/mismatch | consistency failure | 不忽略hint、不任取第一条、不重评P6 |
| lifecycle history不可读 | current-state-only surface或 affected fail-closed | 不调用append、不扫描内部表 |
| public type mapping不完整 | response assembly failure | 不把domain enum直接泄漏到contracts |
| freshness source缺失 | Unknown/stale/affected surface | 不用time/version伪造Fresh |
| aggregate `Failed/Blocked/Degraded/Cancelled` | normal Present view state | 不因状态名触发write/retry/deliver |
| repeated identical Query | ordinary repeatable read | 不 reserve、不存result、不写read audit/history/outbox |

建议的有限 surface precedence 是：protocol validation -> request-scoped visibility/existence disclosure -> handoff availability/presence -> handoff/input relation -> hint relation -> object condition/public mapping -> composite freshness/degraded。该顺序是 mapper目标，不允许由 repository调用完成顺序或首个异常决定；exact owner仍由 `S08-D-Q07-SURFACE-MAPPER-01` 关闭。

## 11. Field / owner / affected closure table

| closure item | current owner / callable | Q07 conclusion |
|---|---|---|
| request body use-site | Step 06 input registry | shape固定为一个 handoff ref；standalone declaration affected |
| application input | `GetReportHandoffInput` | exact name retained |
| application entry | assembler + Read façade exact callable | observed and retained |
| response view | Step 07 use-site `ReportHandoffView` | canonical owner/schema/factory missing |
| handoff read | `get_handoff_with_version` | exact point lookup known；row version private |
| immutable input read | `get_evidence_index_input` | exact lookup known；cross-relation affected |
| hint direct read | `get_authenticity_hint_with_version` | exact lookup known；must match aggregate/current index |
| hint current index | `find_authenticity_hint_by_handoff` | exact lookup known；uniqueness/parity carrier affected |
| lifecycle history read | none | Q07不读取；final current-state-only vs bounded history affected |
| current visibility | formal read policy / mapper | Q07-specific source affected |
| freshness | formal composite committed marker | source affected；time/version禁止替代 |
| public state/reason/result types | contracts secondary type owner | exact type mapping affected |
| public response mapper | `ObservationQueryResponse<T>` + Q07 exact assembler | precedence/source mapping affected |
| Step 09 handoff | `GetReportHandoffFlow` | reserved only；不展开 flow |

## 12. Affected register for Q07

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q07-VIEW-OWNER-01` | `open_upstream_internal` | `ReportHandoffView`只有Step07 return use-site，没有唯一 declaration、module、fields、factory或mapper | Step06/07在contracts选定唯一view owner，承接本文件最小语义字段和条件矩阵 | Step08创建canonical DTO、复制domain aggregate或使用同名alias |
| `S08-D-Q07-REQUEST-SCHEMA-01` | `open_upstream_internal` | request只有registry中的`handoff_ref` use-site shape，没有独立public declaration/decoder binding | 补唯一public request schema、sealed query binding、wire/decoder和typed ref validation | 增加隐藏selector、alias、双schema或从route/body猜operation |
| `S08-D-Q07-HANDOFF-READ-CARRIER-01` | `open_internal_affected` | 四个point callable没有一个共同 committed snapshot carrier覆盖handoff/input/hint/visibility/freshness | 定义bounded composite read carrier或证明同一read transaction、版本/marker一致性和failure totality | 跨时间静默拼行、把row version当共同cursor或返回partial body |
| `S08-D-Q07-INPUT-RELATION-01` | `open_internal_affected` | handoff scope/consumer/input ref与immutable input consumer/snapshot relation没有唯一typed mapper | 定义 exact relation owner、scope/consumer compatibility、missing/mismatch precedence | 从ref bytes、consumer名称、purpose或current material推导/重建 |
| `S08-D-Q07-HINT-RELATION-01` | `open_internal_affected` | aggregate attached ref、direct hint和current-by-handoff index的same-snapshot uniqueness/parity未闭合 | 定义 relation carrier、durable uniqueness proof和七分支matrix的typed error | 忽略dangling hint、任取第一条、error-as-none或重评P6 |
| `S08-D-Q07-LIFECYCLE-SOURCE-01` | `open_internal_affected` | HLD列出H4读取，但Step07只有append callable，没有bounded read port/order/cursor/public projection | 明确Q07为current-state-only并同步上游，或新增只读bounded H4 projection contract | 调用writer、扫描内部表、用updated_at/version伪造latest record |
| `S08-D-Q07-VISIBILITY-SOURCE-01` | `open_internal_affected` | current request-scoped visibility与persisted readiness visibility缺少Q07专属resolver/mapper分层 | 绑定metadata visibility scope、formal P11/read source和existence-disclosure规则 | 用aggregate visibility、row existence、actor/ref或HTTP status推导current visibility |
| `S08-D-Q07-FRESHNESS-SOURCE-01` | `open_internal_affected` | response freshness缺少覆盖handoff/input/hint的共同committed marker | 定义composite marker/source、consistency hint mapping和stale/rebuild/unknown规则 | 使用updated_at、evaluated_at、row version、input-only freshness或query time |
| `S08-D-Q07-SURFACE-MAPPER-01` | `open_internal_affected` | Q07 missing/not-visible/relation/error/degraded/availability precedence和material source map未唯一绑定 | Step07提供finite typed Q07 mapper/summary，response assembler只做lossless转换 | 由首个失败调用、exception/error text、state名称或empty option决定surface |
| `S08-D-Q07-PUBLIC-TYPE-MAPPING-01` | `open_upstream_internal` | domain handoff/readiness/hint/delivery/reason/origin不能直接成为contracts public字段，当前无唯一secondary type mapping | 在contracts定义有限public types/factory和domain-to-public total mapping，保持body-free且lossless | serde/debug字符串cast、domain依赖泄漏、boolean authenticity/verdict或同名compat alias |

Q07复用但不关闭：

- `S08-D-QUERY-SURFACE-MAPPER-01`：shared Query mapper总缺口继续存在。
- `S08-C07-IMMUTABLE-INPUT-REF-01`：immutable input ref的mint/rehydrate和same-ref conflict仍由上游修订。
- `R06.6-F2-H13-UPSTREAM`：与 Q07 handoff read语义无直接关系，继续 `open_controlled`。

## 13. Step 09 handoff（仅登记）

`GetReportHandoffFlow` 是 Q07 唯一后续 flow 名称。Step 09 必须消费本文件的 read chain，不得恢复冻结表中的简化两读版本：

```text
GetReportHandoffRequest
  -> exact request / metadata validation
  -> current visibility and existence-disclosure decision
  -> load exact handoff
  -> load and validate immutable input relation
  -> load and validate optional hint through direct + current lookup
  -> validate aggregate/hint conditional fields
  -> obtain composite freshness/availability summary
  -> map finite public secondary types
  -> ReportHandoffView
  -> ObservationQueryResponse<ReportHandoffView>
```

Step 09 不得在该 flow 中添加 UoW、read guard、stage、append H4、P6/P7 reevaluation、prepare/deliver、external adapter、refresh、repair、rebuild、retention mutation或 source/business truth write。

## 14. Q07 stop review

| 检查项 | 结论 |
|---|---|
| 是否形成独立 request、target view、field source、read chain、relation、surface、error/no-write和Step09 handoff记录 | `pass_with_affected_open` |
| request是否保持单一`handoff_ref`且未偷加状态/consumer/page | pass；standalone declaration受 `S08-D-Q07-REQUEST-SCHEMA-01` 约束 |
| exact assembler、Read façade和四个repository read callable是否记录 | pass；composite snapshot受 `S08-D-Q07-HANDOFF-READ-CARRIER-01` 约束 |
| `ReportHandoffView`是否被Step08伪造为canonical owner | no；只记录最小语义schema，owner受 `S08-D-Q07-VIEW-OWNER-01` 约束 |
| immutable input与hint relation是否完整定义 | target matrix已定义；exact owner/carrier仍有2项affected |
| lifecycle history是否被无read-port情况下假装可读 | no；current-state-only边界已记录，最终裁定仍affected |
| visibility两层是否区分 | pass；current response visibility不由persisted readiness visibility替代 |
| freshness是否由time/version伪造 | no；正式composite source仍affected |
| `Delivered`/`RealEvidenceLinked`是否升级为外部truth | no |
| Query是否保持zero-write | pass；不创建UoW、不stage/append、不重评P6/P7、不调用external adapter |
| Q07十项affected是否全部登记 | pass |
| 是否发现新的外部 upstream blocker | no；已知 `R06.6-F2-H13-UPSTREAM=open_controlled` 与Q07无直接关系 |
| 当前协议计数 | `23/60 defined_with_affected_open`；`0/60` 无条件 complete |
| 下一动作 | 停审并等待用户明确确认；确认后只读取 Q08 所需输入 |

## 15. Recovery and formal-document boundary

当前恢复点为：

```text
Step08_S08-D_Q07_defined_with_affected_open_waiting_user_before_Q08
```

本文件是 design-only discussion material。未经用户再次确认，不得读取或写入 Q08-Q14、S08-E~G、Step 09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交 commit。
