# L4-observability 详细设计 Step 08

## S08-D Query Q06 `GetEvidenceIndexInput`

> 本文件是 Q06 的独立讨论中间产物。它只覆盖 `GetEvidenceIndexInput`，不关闭 Q07-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q06 |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q07` |
| 逻辑协议 | `Query / GetEvidenceIndexInput / GetEvidenceIndexInputRequest` |
| 后续处理流 | `GetEvidenceIndexInputFlow`，这里只登记 handoff，不展开 Step 09 |
| 当前协议计数 | `22/60 defined_with_affected_open`；`0/60` 无条件完成 |
| 正式文档 | 正式 `03-详细设计.md` 冻结，不回填 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q07 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

### 1.1 本批禁止事项

- 不读取或写入 Q07-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 临时定义 `EvidenceIndexScopeRef` 的字段、factory、wire schema、scope membership 或 resolver。
- 不把 `EvidenceLinkage`、`AuditProjection`、`GapState`、evidence body、audit body、report body 或外部业务 truth 变成 Q06 的 truth owner。
- 不把 repository page 暴露为 public page，也不在没有 bounded contract 的情况下自动扫描未知数量的后续页面。
- 不把 `handoff_ref` 分支实现成 append、refresh、repair、rebuild、UoW 或任何其他 Query 写入。
- 不创建 reservation、stored result、read-access record、history、outbox 或 retention mutation；不调用 external adapter。
- 不伪造真实 evidence alias、provider locator、credential、verdict、signoff 或真实 run id。

## 2. 实际读取与权威顺序

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 08 | Query 逐协议问题、response/view/page/marker、字段来源、错误和停审要求 |
| `standards/document/详细设计书写规范.md` 5.6/5.7 | request、view、public secondary type、错误、幂等、审计和协议粒度 |
| `standards/document/设计文档讨论中间产物规范.md` | Query response/view 闭环表、source/empty/degraded 记录和 affected 规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` | public view、visibility、freshness、degraded、bounded read 和 no-write 门禁 |
| Step 06 `EvidenceIndexInputView` / `ReportHandoffRecord` / set carriers | Q06 response body、immutable snapshot、字段约束和 handoff relation 输入 |
| Step 06 `GetEvidenceIndexInputInput` registry | 当前 application input 名称、request body 形状和 preview no-write 约束 |
| Step 07 assembler / Read façade / evidence repository / handoff repository | exact callable、repository page 与 immutable snapshot read boundary |
| current Step 08 shared carrier、Q01-Q04 historical checkpoint、Q05 current artifact | public wrapper、page helper边界、Query no-write和逐协议停审粒度 |

### 2.2 权威顺序

```text
current Step 08 authority / affected register
  > Step 07 exact callable and read-only dependency boundary
  > Step 06 current object / view / policy owner
  > HLD Query skeleton and detailed-design handoff
  > 旧正式文档、旧 Step 08 总表和旧 flow 草稿
```

旧材料中把 evidence index 当成可保存正文、把 handoff 查询当成写入准备、或把 scope ref 当成可解析字符串的部分均属于 historical material；不能覆盖当前 Step 06/07 owner。

## 3. SOP 问题回答

| # | 问题 | Q06 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetEvidenceIndexInput` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> evidence/handoff read repositories |
| 3 | 调用方与处理方 | exact API handler 调用 `ObservationApiInputAssembler::get_evidence_index_input`，再调用 `ObservationReadService::get_evidence_index_input` |
| 4 | 传输方式 | 只确定有限 logical binding；endpoint、broker、credential 和外部 locator 后置，不进入 DTO |
| 5 | request schema | `scope_ref` 加可选 `handoff_ref`；Step 06 只提供 use-site 形状，独立 public declaration 尚未唯一闭合 |
| 6 | response schema | public 协议使用非分页 `ObservationQueryResponse<EvidenceIndexInputView>`；repository 内部 page 只作 application carrier |
| 7 | 目标对象 | body-free、immutable、append-once candidate snapshot；不返回 evidence/audit/report body |
| 8 | 字段来源 | `input_ref`、consumer scope、linkage/projection/gap sets、visibility、freshness、cursor、assembled time 必须分别回指 typed source |
| 9 | scope 语义 | `EvidenceIndexScopeRef` 只表示正式 evidence-index selection scope；不能从 ref bytes、purpose、consumer、默认值或前缀解析成员 |
| 10 | 两个分支 | 无 `handoff_ref` 允许只读 preview；有 `handoff_ref` 只读取已提交 immutable snapshot，不能从 current material 重建历史 input |
| 11 | page helper | `page_linkages_by_evidence_scope` 的 repository page 不能直接成为 public page；Q06 public request 没有 page 字段 |
| 12 | empty / missing | empty material 不等于 missing；Visible empty 被 Step 06 factory 拒绝；NotVisible/Blocked/blocked Degraded 只能按既定 carrier matrix表达 |
| 13 | visibility | visibility 必须来自正式 read/evidence policy decision；不能由 linkage、handoff、actor、ref existence 或 error 文本推导 |
| 14 | freshness / cursor | freshness 与 `as_of_cursor` 必须来自同一 committed snapshot boundary；不能使用 query time、row version、page cursor 或最后更新时间 |
| 15 | gap | `gap_refs` 必须来自同一 scope / consumer / snapshot 的 typed relation；不能从空集合、漏行或异常文本推断 |
| 16 | handoff relation | handoff scope、consumer scope、input ref 和 requested scope 的关系必须有 exact relation owner；不匹配 fail closed |
| 17 | identity | `EvidenceIndexInputViewRef` 是 immutable snapshot identity；preview 也不得把 scope digest 当 input ref，committed ref 不能被重建或覆盖 |
| 18 | actor authority | actor 只来自 `ObservationQueryMetadata`；Q06 不接受 payload actor，不把 actor 当 evidence consumer scope 或 authorization truth |
| 19 | no-write | 两个分支均不创建 UoW，不 append input，不写 read audit/history/outbox，不 refresh/repair/rebuild |
| 20 | error mapping | invalid request、missing、visibility、bound overflow、relation mismatch、repository unavailable、stale/degraded 必须保持 typed surface，不互相压扁 |
| 21 | response field owner | `EvidenceIndexInputView` 只由 Step 06 `contracts::views` 持有；Step 08 不能创建同名 DTO 或临时 alias |
| 22 | Step 09 回指 | 只保留 `GetEvidenceIndexInputFlow` handoff；不在本批写函数级事务流 |
| 23 | 停审标准 | Q06 形成独立 request/view/source/branch/error/no-write/handoff 记录，所有未闭合关系登记 affected 后停审 |

## 4. 当前上游事实与不确定性

### 4.1 已确认的 exact callable

```rust
ObservationApiInputAssembler::get_evidence_index_input(
    ObservationQueryRequest<GetEvidenceIndexInputRequest>
) -> Result<GetEvidenceIndexInputInput, ApplicationError>
```

```rust
ObservationReadService::get_evidence_index_input(
    GetEvidenceIndexInputInput
) -> ApplicationServiceFuture<
    '_,
    ObservationQueryResult<EvidenceIndexInputView>
>
```

上面的 service return 是当前 Step 07 observed signature，不足以证明 public response carrier、presence mapper 或 Q06 的完整 source aggregation 已闭合；这些缺口必须保持 affected。

Step 07 已提供下列 application-private repository capability：

```rust
AuditEvidenceRepository::page_linkages_by_evidence_scope(
    &EvidenceIndexScopeRef,
    ObservationRepositoryPage
) -> ApplicationPortFuture<
    '_,
    ObservationRepositoryPageResult<Versioned<EvidenceLinkage>>
>
```

```rust
ObservationRepositoryCursorBinding::for_linkages_by_evidence_scope(
    &EvidenceIndexScopeRef
)
```

固定顺序是 `linkage_ref ASC`。这个 callable 只能证明 bounded linkage page 的读取能力，不能单独证明完整 `EvidenceIndexInputView` 所需的 projection、gap、visibility、freshness 和共同 cursor。

Step 07 还提供：

```rust
ReportHandoffRepository::get_evidence_index_input(
    &EvidenceIndexInputViewRef
) -> ApplicationPortFuture<Option<EvidenceIndexInputView>>
```

以及写入 callable：

```rust
ReportHandoffRepository::append_evidence_index_input(
    &EvidenceIndexInputView,
    &dyn ObservationUnitOfWork
)
```

`append_evidence_index_input` 只属于 accepted write UoW；Q06 两个分支都禁止调用它。

### 4.2 当前无法当作 authority 的内容

| 内容 | 当前结论 |
|---|---|
| `EvidenceIndexScopeRef` 字段 / factory / wire / membership | 只有 use-site，没有唯一 canonical declaration；登记 `S08-D-Q06-SCOPE-OWNER-01` |
| public `GetEvidenceIndexInputRequest` declaration | Step 06 registry给出字段形状，但没有独立 public schema 章节；登记 `S08-D-Q06-REQUEST-SCHEMA-01` |
| scope -> `EvidenceConsumerScope` resolver | 未发现唯一 catalog / relation callable；登记 `S08-D-Q06-CONSUMER-SCOPE-SOURCE-01` |
| scope 下完整 linkage/projection/gap 聚合 | 只有 linkage page callable；无可证明的 bounded composite carrier；登记 `S08-D-Q06-SCOPE-READ-CARRIER-01` |
| Q06 visibility decision / page-level mapping | 通用 policy 不能自动成为 Q06 专属 source；登记 `S08-D-Q06-VISIBILITY-SOURCE-01` |
| freshness 与共同 `ObservationCursor` | linkage page 不返回共同 committed marker；登记 `S08-D-Q06-FRESHNESS-CURSOR-SOURCE-01` |
| scope-to-gap relation | 现有 gap port 以 `GapSourceRef` 为主要 selector，没有 Q06 exact relation；登记 `S08-D-Q06-GAP-SOURCE-01` |
| handoff scope/consumer/input binding | handoff 与 input callable 存在，但跨 scope/consumer 的 exact relation mapping 未闭合；登记 `S08-D-Q06-HANDOFF-BINDING-01` |

## 5. Request contract

### 5.1 Logical binding

| 项 | current contract |
|---|---|
| logical binding | `Query / GetEvidenceIndexInput / GetEvidenceIndexInputRequest` |
| public entry | exact `GetEvidenceIndexInput` Query handler |
| metadata | `ObservationQueryMetadata` 提供 actor、trace、consistency、visibility context 和 request metadata；不重复放入 body |
| application input | 已有 canonical 名称 `GetEvidenceIndexInputInput`；不能重命名为 `GetEvidenceIndexInput` 或 `EvidenceIndexQueryInput` |
| write lane | none |
| public page | none；Q06 不是 caller-paginated query |

### 5.2 Current request shape

Step 06 application input registry 当前给出的 request body 形状是：

```rust
pub struct GetEvidenceIndexInputRequest {
    pub scope_ref: EvidenceIndexScopeRef,
    pub handoff_ref: Option<ReportHandoffRecordRef>,
}
```

这段代码只记录当前上游已使用的字段形状，不在 Q06 产物中宣称该 struct 已有唯一 canonical declaration。`scope_ref` 和 `handoff_ref` 是 body 的全部字段：

- 不增加 `page`、`consumer_scope`、`visibility`、`freshness`、`cursor`、`input_ref`、`actor_ref`、`purpose` 或任何 body locator。
- `handoff_ref = None` 表示请求 preview material；它不表示“自动创建 handoff”。
- `handoff_ref = Some(_)` 表示请求读取一个既有 handoff 绑定的 immutable input；它不表示“准备 handoff”或“append snapshot”。
- scope membership、consumer scope、policy outcome 和 snapshot cursor 都不能由 body 缺省值补齐。

### 5.3 Request validation matrix

| 条件 | 处理 | 禁止 fallback |
|---|---|---|
| query name / schema slot 与 Q06 body 不匹配 | `InvalidRequest`，在 repository 前拒绝 | 从 JSON 字段猜协议或接受同名 Command body |
| `scope_ref` malformed / unknown kind | typed request error | 用 opaque string、前缀或 display value 继续查询 |
| `handoff_ref` malformed | typed request error | 当成 absent 或转为 scope preview |
| `scope_ref` 合法但没有 canonical membership | `Affected` 对应的 fail-closed application error | 全局扫描、默认 consumer、默认 purpose |
| `handoff_ref` absent | 进入只读 preview 分支 | 调用 append / create / reserve |
| `handoff_ref` present | 进入 committed snapshot lookup 分支 | 从 current linkage 重建历史 input |
| metadata actor / visibility context 缺失 | 按 shared query wrapper 的 invalid/unknown surface 处理 | 从 scope/ref 推导 actor 或授权 |

## 6. Response view contract

### 6.1 Canonical view owner

Q06 response body 唯一回指 Step 06 §16.6 的 `EvidenceIndexInputView`。Step 08 不复制其 struct，不创建 `EvidenceIndexInputPreviewView`，也不把 `EvidenceLinkage` 或 `ReportHandoffRecord` 直接暴露给 public。

```rust
pub struct EvidenceIndexInputView {
    pub input_ref: EvidenceIndexInputViewRef,
    pub consumer_scope: EvidenceConsumerScope,
    pub linkage_refs: EvidenceLinkageRefSet,
    pub audit_projection_refs: AuditProjectionRefSet,
    pub gap_refs: GapStateRefSet,
    pub visibility: VisibilitySurface,
    pub freshness: ObservationProjectionFreshnessSurface,
    pub as_of_cursor: Option<ObservationCursor>,
    pub assembled_at: ObservedAt,
}
```

`EvidenceIndexInputView::from_snapshot(...)` 是唯一的 shape validation factory。它已经规定：

- `EvidenceLinkageRefSet` 最多 1024 个成员；`AuditProjectionRefSet` 最多 256 个成员；`GapStateRefSet` 使用其 canonical bounded set 约束。
- linkage、projection、gap 至少有一个非空时，必须有符合 policy 的 body/snapshot 组合；Visible empty input 不允许。
- `NotVisible`、`Blocked` 或 blocked `Degraded` 不得携带超出 visibility 允许的 linkage/projection refs。
- `as_of_cursor` 只能表示同一 committed observation snapshot；它不是 public continuation cursor。
- `assembled_at` 是本地 assembly boundary time，不是 evidence occurred-at、source audit time 或 report delivery time。

### 6.2 Field source closure table

| field | type | intended source | current closure | empty / not-visible / degraded rule |
|---|---|---|---|---|
| `input_ref` | `EvidenceIndexInputViewRef` | preview mint authority，或 committed handoff snapshot identity | mint/rehydrate authority与冲突规则仍受 `S08-C07-IMMUTABLE-INPUT-REF-01` 影响 | 不从 scope digest、row id 或 current material生成替代 identity |
| `consumer_scope` | `EvidenceConsumerScope` | scope catalog / validated relation，与 purpose 一致 | Q06 scope -> consumer resolver 未唯一闭合；见 `S08-D-Q06-CONSUMER-SCOPE-SOURCE-01` | 缺失或冲突时 fail closed，不返回默认 consumer |
| `linkage_refs` | `EvidenceLinkageRefSet` | committed linkage rows in exact evidence scope | linkage page callable已知；完整 bounded aggregation 与共同 snapshot未闭合 | empty 不能隐藏 known gap 或伪造 Visible ready input |
| `audit_projection_refs` | `AuditProjectionRefSet` | validated linkage -> projection relation / committed projection lookup | exact Q06 relation source未传播；不能从 linkage ref bytes猜 | relation缺失/冲突是 consistency failure |
| `gap_refs` | `GapStateRefSet` | same scope/consumer/snapshot gap relation | Q06 exact scope-to-gap source未闭合；见 `S08-D-Q06-GAP-SOURCE-01` | empty 只能在正式 source证明无 known gap时使用 |
| `visibility` | `VisibilitySurface` | formal read/evidence visibility decision | Q06专属 decision/source未唯一绑定；见 `S08-D-Q06-VISIBILITY-SOURCE-01` | 不从 row existence、handoff presence、actor/ref或异常文本推导 |
| `freshness` | `ObservationProjectionFreshnessSurface` | persisted marker at same committed read boundary | common source未闭合；见 `S08-D-Q06-FRESHNESS-CURSOR-SOURCE-01` | 不把 query time、last row time或rebuild state当 Fresh |
| `as_of_cursor` | `Option<ObservationCursor>` | same snapshot boundary as all collected sets | current linkage callable不返回共同 cursor | 不用 repository page cursor、row version或最后更新时间补齐 |
| `assembled_at` | `ObservedAt` | local ClockPort at assembly boundary | Step 06 object owner已给出 ClockPort 方向；不代表 committed freshness | 不表示 source/evidence/report time |

### 6.3 Public response shape

Q06 是非分页 public Query。协议层目标形状为：

```rust
ObservationQueryResponse<EvidenceIndexInputView>
```

其 public wrapper 负责 `query_name`、`presence`、visibility、freshness、degraded、availability、missing/error 等 shared surface；`EvidenceIndexInputView` 负责 body-free snapshot fields。application-private `ObservationQueryResult<EvidenceIndexInputView>` 不能在 API handler 中直接 cast 为 public response，最终 mapper 仍属于 Q06 affected closure。

`ObservationRepositoryPageResult<Versioned<EvidenceLinkage>>` 不是 Q06 response 的 `page`，也不能通过把 `items` 放进 `EvidenceLinkageRefSet` 来绕过 projection/gap/cursor/visibility source。

## 7. Read branches and source boundaries

### 7.1 Branch A: preview (`handoff_ref = None`)

目标是从同一 bounded committed observation material 组装一个 body-free `EvidenceIndexInputView` preview，且不写入 immutable snapshot store。

```text
GetEvidenceIndexInputRequest(scope_ref, None)
  -> validate exact request and metadata
  -> resolve formal scope membership and consumer scope
  -> read bounded linkage material under one committed boundary
  -> read/validate projection relations and same-scope gap material
  -> obtain visibility + freshness + as_of_cursor from formal sources
  -> EvidenceIndexInputView::from_snapshot(...)
  -> ObservationQueryResponse<EvidenceIndexInputView>
```

上述流程中的 scope owner、composite bounded carrier、projection relation、gap source、visibility source 和 common cursor 仍有 affected；流程图是目标闭环，不是对不存在 callable 的实现承诺。

Preview 分支的硬规则：

1. 可以产生 transient candidate view，但不得调用 `append_evidence_index_input`。
2. 不创建 `ObservationUnitOfWork`，不生成 durable record/outbox，不写 read history。
3. 所有 set 必须来自同一可证明的 bounded snapshot；不能逐页读取到未知数量后静默拼接。
4. 若任一 canonical set超过上限，返回 typed bound/consistency failure；不得截断、只取第一页或降级为“部分成功”而不带正式 gap。
5. 若无法证明 scope、consumer、visibility、freshness、gap 或 cursor 的来源，fail closed；不得用空集合隐藏缺口。

### 7.2 Branch B: committed handoff snapshot (`handoff_ref = Some(_)`)

目标是读取 handoff 已绑定的 immutable input snapshot。该分支的历史稳定性优先于 current material：

```text
GetEvidenceIndexInputRequest(scope_ref, Some(handoff_ref))
  -> validate exact request and metadata
  -> get_handoff_with_version(handoff_ref)
  -> validate formal handoff-scope / consumer / input relation
  -> get_evidence_index_input(handoff.evidence_index_input_ref)
  -> validate returned snapshot identity and immutable carrier matrix
  -> ObservationQueryResponse<EvidenceIndexInputView>
```

分支规则：

- handoff 不存在时返回 typed missing/availability surface；不能退回 preview 分支。
- handoff scope 与 requested `EvidenceIndexScopeRef` 不匹配时 fail closed；不能根据当前 linkage 重新计算 scope。
- handoff consumer 与 snapshot `consumer_scope` 不匹配时 fail closed；不能由 purpose 或产品名推导 consumer。
- handoff 的 input ref lookup 返回空时不得生成替代 preview，不得从 current linkage/projection/gap 重建 input。
- 返回的 snapshot 必须保持 `input_ref`、set membership、visibility、freshness、cursor 和 assembled time；Q06 不刷新、不替换、不 append。

跨 scope / consumer / input 的 exact relation source 尚未由 Step 06/07 唯一指定，登记 `S08-D-Q06-HANDOFF-BINDING-01`。

### 7.3 Internal paging is not public paging

Q06 request 没有 `ObservationPageRequest`。repository 的 `page_linkages_by_evidence_scope` 是 application-private bounded read helper，因而必须满足以下之一：

| 可接受闭合方向 | Q06 约束 |
|---|---|
| 上游定义一个能在同一 committed boundary 返回 bounded complete set 的 composite carrier | application exact signature、max bound、continuation rejection和source mapping必须回灌 Step 06/07 |
| 上游明确一个有限、可证明终止的内部 page aggregation contract | page count、same-boundary cursor、overflow和一致性失败必须是 typed，不得暴露给 public |
| 以上均未定义 | Q06 保持 affected/open；实现前不得自动扫描未知页 |

不能把 `ObservationRepositoryCursorBinding::for_linkages_by_evidence_scope` 当成 scope membership owner，也不能把 repository continuation当成 `EvidenceIndexInputView.as_of_cursor`。

## 8. Visibility, freshness, gap and presence matrix

### 8.1 Presence and body matrix

| condition | public surface | body rule |
|---|---|---|
| valid visible candidate with at least one allowed set member | `Present` + `Some(EvidenceIndexInputView)` | body fields必须通过 Step 06 factory和visibility matrix |
| valid material read proves no usable visible candidate | typed `Empty`/blocked/degraded surface only if shared policy允许 | 不把 Visible empty input强行构造为 view |
| target hidden or policy-restricted | `NotVisible`/`Unknown`/policy-defined restricted surface | 不披露 set count、scope membership、handoff existence或input identity |
| limited degraded and policy permits body | `Degraded` with explicit limited allowance | 只能返回 policy允许的 body-free refs和gap；不能冒充 normal success |
| blocked degraded | blocked body surface | linkage/projection refs必须为空或符合 Step 06 blocked matrix |
| committed handoff snapshot missing | typed missing/availability | 不返回 current preview |
| relation or carrier inconsistency | typed consistency/invariant error | 不返回 partial body |

`EvidenceIndexInputView` 自身禁止 Visible empty input，但 public wrapper 的 exact `presence` / missing / degraded mapping仍必须由正式 application mapper给出；Q06 不从 empty set 反推出 visibility 或 missing。

### 8.2 Source precedence

Q06 不自行定义“首个失败依赖优先”。最终 mapper必须接收 typed source summary，并至少区分：

1. malformed request / foreign selector；
2. formal scope or handoff relation mismatch；
3. visibility decision；
4. missing committed snapshot；
5. bounded carrier overflow / consistency defect；
6. persisted freshness / rebuilding / unavailable surface；
7. limited degraded material with explicit policy permission。

在该 mapper 尚未由 Step 07 唯一提供前，任何分支只能 fail closed，不能由 `ApplicationError` 文本、ref 文本、空列表或 dependency call 顺序合成 `DegradedKind`。

### 8.3 Freshness and cursor rules

| field / surface | allowed source | prohibited source |
|---|---|---|
| `freshness` | persisted projection/read marker attached to the same committed material boundary | query time、last updated time、last linkage time、current rebuild state |
| `as_of_cursor` | one committed observation cursor covering all included sets | repository page cursor、row version、input ref bytes |
| `assembled_at` | local assembly ClockPort | evidence occurred-at、report handoff time、provider response time |
| stale / rebuilding | persisted state copied into surface | inline refresh、repair、rebuild或Fresh fallback |

### 8.4 Gap rules

- `gap_refs` 是 typed gap identities，不是 error strings、missing rows 或 free-text diagnostic。
- gap relation必须绑定正式 scope、consumer/purpose（如该 policy要求）和同一 committed boundary。
- empty linkage/projection set不能自动生成 gap，也不能自动证明没有 gap。
- 已知 gap 不能被当前 linkage page 截断、分页遗漏或 handoff snapshot重算掩盖。
- 若 gap source 不可查询或 relation 不可证明，返回 typed unavailable/consistency/degraded surface；不返回无 gap 的正常 Visible input。

## 9. Error and no-write matrix

| condition | mapping | side effect |
|---|---|---|
| malformed query/body/metadata | `InvalidRequest` | no repository write; no UoW |
| unknown/unbound `EvidenceIndexScopeRef` | typed scope/application error | no scope scan or default scope |
| invalid `handoff_ref` | `InvalidRequest` | no fallback to preview |
| formal scope membership unavailable | typed unavailable/affected fail-closed surface | no adapter activation |
| linkage/projection/gap carrier exceeds bound | typed bound/consistency failure | no truncation, no retry scan, no partial body |
| linkage/projection relation mismatch | persistence invariant/consistency failure | no partial view |
| gap source unavailable | typed degraded/unavailable surface | no inferred empty gap set |
| visibility decision hidden | `NotVisible`/policy surface | no body, count, identity or existence leak |
| freshness unknown/rebuilding/stale | persisted freshness/degraded surface | no refresh, repair or rebuild |
| handoff missing | typed missing/availability surface | no preview reconstruction |
| handoff scope/consumer/input mismatch | consistency error | no current-material rebuild |
| immutable input ref lookup missing/conflicting | typed missing/consistency failure | no append, overwrite or replacement ref |
| repository unavailable | typed availability/error surface | no external fallback or source read |
| repeated identical Query | ordinary read repeat | no reservation, stored result, read audit, history or outbox |

Q06 has no idempotency key and no duplicate-result protocol. Query digest, if present in shared metadata, is input integrity only. Neither branch begins a write UoW, calls `append_evidence_index_input`, stages a record, mutates retention, or changes source/business truth.

## 10. Field / owner / affected closure table

| closure item | current owner / callable | Q06 conclusion |
|---|---|---|
| request body name and fields | Step 06 input registry use-site | shape retained; standalone public schema affected |
| application input name | Step 06/07 `GetEvidenceIndexInputInput` | exact name retained |
| response view | Step 06 §16.6 `EvidenceIndexInputView` | canonical; no Step 08 duplicate |
| set bound and carrier validation | Step 06 contracts carriers + view factory | reused; Q06 cannot relax bounds |
| linkage read | `AuditEvidenceRepository::page_linkages_by_evidence_scope` | exact internal page known; composite aggregation open |
| linkage cursor binding | `for_linkages_by_evidence_scope` | exact method binding known; not public cursor |
| projection relation read | Step 06/07 typed relation owner | no Q06 exact callable/source found; affected |
| gap relation read | Step 06/07 typed scope relation owner | no Q06 exact callable/source found; affected |
| visibility decision | formal read/evidence policy | Q06-specific source/mapping open |
| freshness + as-of cursor | committed composite boundary | common source open |
| committed snapshot read | `ReportHandoffRepository::get_evidence_index_input` | exact read known; handoff relation validation open |
| snapshot write | `append_evidence_index_input` | explicitly prohibited for Q06 |
| public response mapper | shared `ObservationQueryResponse<T>` + exact application mapper | Q06-specific mapping open; no API-side cast |
| Step 09 handoff | `GetEvidenceIndexInputFlow` | reserved only; no flow expansion in Q06 |

## 11. Affected register for Q06

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q06-SCOPE-OWNER-01` | `open_upstream_internal` | `EvidenceIndexScopeRef` 目前只有 Step 06/07 use-site，没有 canonical struct、字段、factory、wire schema或 scope-membership owner | Step 06/07 选择唯一 scope owner并传播 selector、digest、membership、rehydration和invalid/unknown规则 | 从 ref 字符串、前缀、consumer、purpose、产品名或默认值推导 scope |
| `S08-D-Q06-REQUEST-SCHEMA-01` | `open_upstream_internal` | Step 06 registry给出 `scope_ref + optional handoff_ref` 形状，但没有独立 public request declaration/decoder binding章节 | 补唯一 public request schema、sealed query binding、wire/decoder和字段来源；保持当前两字段，不偷加 page等字段 | 在 Step 08 重命名、创建 alias、双承载或添加隐藏字段 |
| `S08-D-Q06-CONSUMER-SCOPE-SOURCE-01` | `open_internal_affected` | response 必需的 `EvidenceConsumerScope` 与 request `scope_ref` 不是同一语义，当前没有唯一 scope -> consumer-scope resolver/catalog | 提供 typed resolver/relation source、purpose compatibility和missing/ambiguity mapping | 从 purpose、boundary ref、handoff presence、actor或默认 consumer构造 scope |
| `S08-D-Q06-SCOPE-READ-CARRIER-01` | `open_internal_affected` | 唯一 linkage repository 是分页 callable，而 public request 无 page；当前没有 exact application callable证明如何在 bounded、同一 committed snapshot中聚合完整 linkage/projection/gap sets | 选择 bounded composite carrier或有限内部 aggregation contract，闭合 max、overflow、termination、same-cursor和atomicity | 暴露 repository page、静默扫描未知页、只取第一页、截断或跨 snapshot 拼接 |
| `S08-D-Q06-VISIBILITY-SOURCE-01` | `open_internal_affected` | Q06 没有专属 visibility decision / page-or-scope mapping；linkage、handoff、actor/ref existence都不是 visibility authority | 绑定 formal read/evidence visibility resolver、scope source、body redaction和empty/hidden映射 | 由 row existence、handoff presence、actor/ref、HTTP status或error text推导 visibility |
| `S08-D-Q06-FRESHNESS-CURSOR-SOURCE-01` | `open_internal_affected` | `freshness` 与 `as_of_cursor` 需要共同 committed source，但当前 linkage page不提供该复合 marker | 定义 composite snapshot/freshness/cursor source及各 set的一致性证明 | 使用 query time、最后更新时间、row version、page cursor或current rebuild state |
| `S08-D-Q06-GAP-SOURCE-01` | `open_internal_affected` | 当前 gap port主要按 `GapSourceRef` 查询，没有 scope-to-gap exact relation callable，无法证明同 scope gap completeness | 定义 typed gap relation/page source、排序、bound、empty和同 snapshot mapping | 从 empty linkage、缺失项、分页遗漏或 error text推断 gap/no-gap |
| `S08-D-Q06-HANDOFF-BINDING-01` | `open_internal_affected` | `handoff_ref` present 分支需要 handoff scope、requested scope、consumer scope和 immutable input ref 的 exact relation；现有 input lookup不能单独证明关系 | 定义 handoff relation resolver/lookup、mismatch precedence和历史 snapshot返回规则 | 从 current material 重建 input、scope不匹配时忽略 handoff、error-as-absence或回退 preview |

Q06 复用但不关闭 `S08-C07-IMMUTABLE-INPUT-REF-01`：`EvidenceIndexInputViewRef` 的唯一 mint/rehydrate authority与同 ref 冲突规则仍由上游 affected 管理。Q06 不创建第二个 ref owner。

## 12. Step 09 handoff（仅登记）

`GetEvidenceIndexInputFlow` 是 Q06 的唯一后续 flow 名称。Step 09 只能消费本协议，不得改变 request shape、把 preview 变成 write、或把 handoff snapshot 重建成 current projection：

```text
GetEvidenceIndexInputRequest
  -> exact request / metadata validation
  -> branch on handoff_ref presence
  -> formal scope + consumer-scope relation resolution
  -> bounded committed linkage/projection/gap material read (preview branch)
  -> handoff record + immutable input lookup (handoff branch)
  -> visibility / freshness / as_of_cursor / bound / relation validation
  -> EvidenceIndexInputView::from_snapshot or exact committed snapshot return
  -> ObservationQueryResponse<EvidenceIndexInputView>
```

Step 09 不得在该链路中新增 UoW、append、outbox、read history、refresh、repair、rebuild、external adapter 或 source/business truth write。历史 `EvidenceIndexQuery` / `EvidenceIndexBuilder` 等未被 Step 06/07 唯一声明的名称不属于当前 callable。

## 13. Q06 stop review

| 检查项 | 结论 |
|---|---|
| 是否形成独立 request、view、field source、branch、error、no-write和Step 09 handoff记录 | `pass_with_affected_open` |
| request 是否保持 Step 06 两字段形状且未偷加 page / consumer / cursor | pass；public declaration仍登记 `S08-D-Q06-REQUEST-SCHEMA-01` |
| application callable 名称是否保持 `GetEvidenceIndexInputInput` | pass |
| canonical view 是否回指 Step 06 §16.6 | pass；不创建 Step 08 view owner |
| linkage repository method / cursor binding是否精确记录 | pass；`page_linkages_by_evidence_scope`、`for_linkages_by_evidence_scope`、`linkage_ref ASC` |
| public response 是否错误暴露 repository page | pass；目标为 non-paged `ObservationQueryResponse<EvidenceIndexInputView>` |
| preview 是否保持 zero-write | pass；不创建 UoW、不 append snapshot、不写 stored result/outbox/history |
| handoff present 是否返回 committed immutable snapshot而非重建 | rule defined；exact cross-relation仍受 `S08-D-Q06-HANDOFF-BINDING-01` 约束 |
| scope、consumer scope、visibility、freshness/cursor、gap source是否完全闭合 | no；8项 Q06 affected 已登记 |
| 是否发现新的外部 upstream blocker | no；已知 `R06.6-F2-H13-UPSTREAM=open_controlled` 与 Q06 语义无直接关系 |
| 当前协议计数 | `22/60 defined_with_affected_open`；`0/60` 无条件完成 |
| 下一动作 | 停审并等待用户明确确认；确认后只读取 Q07 所需输入 |

## 14. Recovery and formal-document boundary

当前恢复点为：

```text
Step08_S08-D_Q06_defined_with_affected_open_waiting_user_before_Q07
```

本文件是 design-only discussion material。未经用户再次确认，不得读取或写入 Q07-Q14、S08-E~G、Step 09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交 commit。
