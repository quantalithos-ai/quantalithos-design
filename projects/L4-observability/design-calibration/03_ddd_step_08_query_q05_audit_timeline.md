# L4-observability 详细设计 Step 08

## S08-D Query Q05 `GetAuditTimeline`

> 本文件是 Q05 的独立讨论中间产物。它只覆盖 `GetAuditTimeline`，不关闭 Q06-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q05 |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q06` |
| 逻辑协议 | `Query / GetAuditTimeline / GetAuditTimelineRequest` |
| 后续处理流 | `GetAuditTimelineFlow`，仅登记 handoff，不在本文件展开 Step 09 flow |
| 当前协议计数 | `21/60 defined_with_affected_open`；`0/60` 无条件完成 |
| 正式文档 | 正式 `03-详细设计.md` 冻结，不回填 |
| 允许的下一动作 | 用户确认后只读取 Q06 所需输入 |

### 1.1 本批禁止事项

- 不读取或写入 Q06-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 临时创建 `ObservationReceiptView`、分页 carrier、visibility mapper 或新的 audit truth。
- 不把 source audit record、source audit body、业务审计结论、evidence body、验收签署或 report body 作为 Q05 返回内容。
- 不开始 UoW，不创建 idempotency reservation、stored result、read-access record、history、outbox 或 retention mutation。
- 不触发 projection repair、freshness refresh、timeline rebuild、source resolver 外部调用或业务 truth 写入。

## 2. 输入与权威顺序

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 08 | Query 逐协议问题、response/page/marker、字段来源、错误和停审要求 |
| `standards/document/详细设计书写规范.md` 5.6/5.7 | 正式协议契约应具备的 request、view、page、marker 和 owner 粒度 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、Query response/view 闭环表和受控 affected 规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` | view/page、visibility、degraded、empty-page seed、projection identity 和 no-write 门禁 |
| Step 06 `AuditTimelineView` / `AuditTimelineEntryView` / `AuditTimelineWindow` | Q05 response body、entry 字段与时间窗口的 current domain/contracts 来源 |
| Step 06 `GetAuditTimelineInput` | 当前 request/application input 形状及其命名冲突 |
| Step 07 `ObservationReadService`、`AuditEvidenceRepository::page_audit_timeline`、cursor binding | exact assembler/service/repository callable、排序和 cursor 边界 |
| 当前 Step 08 shared carrier 与 Q01-Q04 checkpoint | public query wrapper、page DTO、shared surface 和当前恢复点 |

### 2.2 权威顺序

```text
当前 Step 08 authority / affected register
  > Step 07 exact callable and read-only dependency boundary
  > Step 06 current object / view / policy owner
  > HLD query skeleton
  > 旧正式文档、旧 Step 08 总表和旧 flow 草稿
```

旧 `GetAuditTimelineFlow` 只作为名称和历史 handoff 线索；其中把 `AuditTimelineQuery` 当作 repository 参数、把 `pass` 当作闭合证明的部分不属于 current truth。

## 3. SOP 问题回答

| # | 问题 | Q05 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetAuditTimeline` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> audit/evidence read repository |
| 3 | 调用方与处理方 | API exact handler 调用 `ObservationApiInputAssembler::get_audit_timeline`，再调用 `ObservationReadService::get_audit_timeline` |
| 4 | 传输方式 | 传输 locator 不在本批决定；logical binding 必须是有限 `Query / GetAuditTimeline`，不能使用 route-neutral 字符串 |
| 5 | request/response schema | request 是 typed `AuditSubjectRef + page`；response 是 `AuditTimelineView` 经过 public paged query wrapper 的 mapping，完整 carrier 仍受 affected 约束 |
| 6 | 目标对象 | 只读取 observability-owned `AuditProjection` 的 append projection，以及已验证的 local linkage/gap relation；不构造或修改 domain truth |
| 7 | 必填字段来源 | `subject_ref` 来自 request；window、entries、gaps、visibility、freshness、as_of cursor 必须分别有 typed 来源，不能由 ref/string/time fallback |
| 8 | 不得混同字段 | `AuditAppendRecordRef` != source audit ref；`appended_at` != source occurred-at；`AuditTimelineView` != source audit truth；public page cursor != `ObservationCursor`；visibility != actor authorization；freshness != query time |
| 9 | 缺失处理 | malformed request/cursor 在 repository 前 reject；精确 scope 无条目返回 Empty；NotVisible/Blocked 不改写为 Missing；relation/schema mismatch fail closed；read dependency unavailable 返回 typed availability/error surface |
| 10 | Step 06/07/09 回指 | Step 06 view/entry/window owner；Step 07 assembler/read/repository/cursor owner；Step 09 只保留 `GetAuditTimelineFlow` handoff |
| 11 | response/page/marker | `AuditTimelineView` 字段级 schema已有 Step 06；public page wrapper已有 S08-B；Q05 的 application page result 与 exact assembler owner尚未唯一闭合 |
| 12 | empty/not-visible/stale/failed/rebuilding/disabled/missing | 分别保留 Empty、visibility surface、persisted freshness/degraded、availability/error；Q05 不把空页或失败转成 NotFound |
| 13 | public identity/repository key | timeline 不生成独立 view identity；selector key 是 typed `AuditSubjectRef`；page binding 是 `for_audit_timeline(subject_ref)`；entry ref 是 `AuditAppendRecordRef` |
| 14 | view 字段类型归属 | entry、window、gap、visibility、freshness、cursor 均必须使用 current contracts/shared 或明确的 application mapping；不得把 domain-only enum直接暴露给 contracts view |
| 15 | page helper | public `ObservationPageRequest/PageInfo/PublicPage/PagedQueryResponse` 归 contracts；repository `ObservationRepositoryPage/PageResult` 归 application；二者不可直接互换 |
| 16 | naming convergence | HLD `GetAuditTimeline`、DDD `GetAuditTimelineRequest`、assembler/service method同名；`ObservationPublicPageRequest` 与 `ObservationPageRequest` 冲突继续 affected，不创建 alias |
| 17 | secondary public types | `AuditTimelineEntryView/List`、`AuditAppendKind`、`VisibilitySurface`、`ObservationProjectionFreshnessSurface`、`ObservationPageCursor`均需按 owner使用；Q05不新增同名 wrapper |
| 18 | actor/visibility | actor来自 `ObservationQueryMetadata.actor_ref`；timeline visibility来自正式 read visibility decision；entry不披露 actor profile、source body或业务授权判断 |
| 19 | actor authority | query actor只作为已认证 read context输入；Q05不接受 payload actor，也不从 subject/ref推导 actor权限 |
| 20 | trusted source exception | Q05没有 trusted source actor 例外；source audit只作为 body-free relation，不赋予 Q05 source actor authority |
| 21 | failure mapping | invalid request/cursor、not visible、missing/empty、availability、stale/degraded、consistency failure分别保持 typed surface；不得把 exception 文本映射为 marker |
| 22 | idempotency/audit | Q05 不需要幂等键、stored result 或同步 read-access audit；query digest仅作输入完整性，不进入写 lane |
| 23 | cross-protocol closure | Q05与共享 page/result carrier、Step 06 window/visibility、Step 07 mapper和Step 09 flow仍有 affected；本批登记后停审 |

## 4. 当前文档问题诊断

| 位置 | 旧/当前问题 | Q05 处理 |
|---|---|---|
| HLD Query skeleton | 只有“subject + page -> AuditTimelineView”，未说明 window、gap、freshness、cursor来源 | 补充字段级协议映射；未闭合处登记 affected |
| Step 06 input registry | `GetAuditTimelineInput` 是 `subject_ref + ObservationPublicPageRequest`，没有显式 `AuditTimelineWindow` | 不在 Step 08 偷加字段；登记 `S08-D-Q05-WINDOW-SOURCE-01` |
| Step 06 view contract | `AuditTimelineView` 字段和 `build(...)` 已定义，entries非空/cursor、visibility组合有约束 | 作为 current view owner承接，不复制或改名 |
| Step 07 repository | `page_audit_timeline(subject_ref, page)`、固定排序和 binding已定义 | 只返回已验证 entry page；不能独立证明 outer view marker |
| Step 07 Read façade | 当前签名仍为 `ObservationQueryResult<AuditTimelineView>`，没有 page-specific carrier或Q05 mapper | 登记 `S08-D-Q05-QUERY-CARRIER-01`、`S08-D-Q05-SURFACE-MAPPER-01` |
| Step 07 visibility/freshness | 有通用 read-only边界，但没有Q05专属 page-level visibility seed、gap/freshness composite source | 登记 `S08-D-Q05-PAGE-VISIBILITY-01`、`S08-D-Q05-FRESHNESS-SOURCE-01` |
| 历史 Step 09 flow | 使用未定义的 `AuditTimelineQuery` repository参数并写成 pass | 标为 historical；只保留 flow 名称，不授权实现 |

## 5. 设计取舍

| 方案 | 取舍 | 结论 |
|---|---|---|
| 把 Q05 当 source audit 查询 | 会让 Observability拥有外部 audit truth和body | 禁止 |
| 直接返回 `AuditAppendRecord` | 泄露内部 history schema，并绕过 visibility/redaction | 禁止 |
| 只返回 `AuditTimelineEntryList` | 丢失 outer subject/window/gap/freshness/visibility语义 | 禁止 |
| 让 repository 返回完整 `AuditTimelineView` | repository反向依赖 public/application response，并可能绕过 read policy | 禁止 |
| 从 `subject_ref` 或 query time 推导 window | window identity和时间边界不稳定，无法复现/分页 | 禁止；必须补 typed window source |
| 空 page 直接返回 NotVisible/Missing | 混淆空集合、隐藏和不存在 | 禁止；保留 Empty/visibility/missing边界 |
| Query 发现 stale 后 inline rebuild | 破坏 zero-write与“观测不拥有truth修复”边界 | 禁止 |
| 用 `ObservationCursor` 充当 public page cursor | 混淆 commit position 与 caller continuation | 禁止 |

## 6. Current Q05 protocol contract

### 6.1 Logical binding and callable chain

| 项 | current contract |
|---|---|
| logical binding | `Query / GetAuditTimeline / GetAuditTimelineRequest` |
| caller | API exact `GetAuditTimeline` handler |
| request assembler | `ObservationApiInputAssembler::get_audit_timeline(request: ObservationQueryRequest<GetAuditTimelineRequest>) -> Result<GetAuditTimelineInput, ApplicationError>` |
| read façade | `ObservationReadService::get_audit_timeline(input: GetAuditTimelineInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<AuditTimelineView>>`（当前上游签名；page carrier affected） |
| repository | `AuditEvidenceRepository::page_audit_timeline(subject_ref: &AuditSubjectRef, page: ObservationRepositoryPage) -> ApplicationPortFuture<'_, ObservationRepositoryPageResult<AuditTimelineEntryView>>` |
| cursor binding | `ObservationRepositoryCursorBinding::for_audit_timeline(subject_ref)` |
| order | `(appended_at ASC, append_record_ref canonical bytes ASC)`，revision 1 |
| Step 09 handoff | `GetAuditTimelineFlow` |
| write lane | none |

### 6.2 Request schema

```rust
/// Selects one body-free local audit subject and a bounded continuation page.
pub struct GetAuditTimelineRequest {
    /// Stable observability-owned audit subject; never source audit body.
    pub subject_ref: AuditSubjectRef,
    /// Public opaque continuation and bounded item limit.
    pub page: ObservationPageRequest,
}
```

Current Step 06 input registry still spells the page field as `ObservationPublicPageRequest`. The protocol uses the S08-B canonical name `ObservationPageRequest` for the current public contract, but this naming conflict remains `S08-D-PAGE-REQUEST-TYPE-01`; Q05 does not introduce a compatibility alias or dual field.

The request has no caller-supplied `AuditTimelineWindow`, visibility decision, freshness marker, gap set, `AuditAppendRecordRef`, source audit body, actor field or external locator. The absence of the window field is a real upstream closure gap, not permission for the service to use an unbounded window or current time.

### 6.3 Response view schema

The canonical body is the Step 06 `AuditTimelineView`:

| field | type | source | Q05 rule |
|---|---|---|---|
| `subject_ref` | `AuditSubjectRef` | exact request selector | must equal request; never parsed from strings |
| `time_window` | `AuditTimelineWindow` | typed query input or formal window resolver | current input has no unique source; see affected |
| `entries` | `AuditTimelineEntryList` | `page_audit_timeline` result mapped through `try_from_entries` | only body-free, relation-validated entries; preserve full local append history |
| `gap_refs` | `GapStateRefSet` | formal gap/read projection relation for same subject/window | empty is allowed but cannot hide a known gap |
| `visibility` | `VisibilitySurface` | `ReadVisibilityDecision` / exact application read surface | never row existence, HTTP status or cursor |
| `freshness` | `ObservationProjectionFreshnessSurface` | persisted local projection/read marker | query time cannot create Fresh; stale/rebuilding remains explicit |
| `as_of_cursor` | `Option<ObservationCursor>` | consistent committed observation read boundary, if established | this is local snapshot position, never public continuation cursor |

`AuditTimelineEntryView` remains body-free and field-constrained:

| entry field | source/constraint |
|---|---|
| `append_record_ref` | local H3 append record identity; stable page key |
| `projection_ref` | local audit projection identity |
| `append_kind` | finite `AuditAppendKind`; no free-text event/action |
| `source_audit_ref` | body-free upstream identity only |
| `source_audit_summary_ref` | safe external summary ref; no summary body |
| `linkage_ref` / `gap_ref` | kind-specific optional relation; mismatch is consistency failure |
| `projection_state` | local post-append projection state |
| `visibility` | item-level safe visibility, never wider than outer visibility |
| `appended_at` | local committed append time; not source event occurred-at |

No field may contain raw log/metric/trace/audit/evidence body, locator, credential, provider response, actor profile, final verdict, signoff or real run identity.

### 6.4 Public page mapping

At protocol level Q05 maps to:

```rust
ObservationPagedQueryResponse<AuditTimelineView>
```

The page wrapper carries `query_name`, `presence`, `ObservationPublicPage<AuditTimelineView>`, outer visibility, freshness, degraded, availability, rebuild and error surfaces. The application repository result remains private:

```text
ObservationPageRequest
  -> exact for_audit_timeline(subject_ref) binding
  -> ObservationRepositoryPage
  -> ObservationRepositoryPageResult<AuditTimelineEntryView>
  -> AuditTimelineEntryList
  -> AuditTimelineView
  -> ObservationPublicPage<AuditTimelineView>
  -> ObservationPagedQueryResponse<AuditTimelineView>
```

The final two mappings are not currently owned by a unique Step 07 application carrier/assembler. Q05 therefore remains affected and must not expose `ObservationRepositoryPageResult` or cast `ObservationQueryResult<AuditTimelineView>` into a page at the API boundary.

### 6.5 Selector, window and repository rules

1. The selector is exactly one `AuditSubjectRef`; no global timeline, source-ref prefix scan, display-name lookup or default subject exists.
2. The repository call is exactly `page_audit_timeline(subject_ref, repository_page)`.
3. The cursor binding is exactly `for_audit_timeline(subject_ref)`; a token from another method, subject or order revision is `InvalidPageCursor`.
4. Repository order is keyset order `(appended_at ASC, append_record_ref canonical bytes ASC)`; offset, provider cursor, row version and adapter-selected order are forbidden.
5. Repository page results must reject over-limit rows, non-advancing or malformed continuation, duplicate append refs with conflicting fields, dangling linkage/gap relation and noncanonical entry order. Such defects are consistency/invariant errors, not Empty.
6. `AuditTimelineWindow` is closed-open `[start_at, end_at)` and must be applied by a formal input/resolver before or together with page selection. Q05 cannot silently widen the page to all history.
7. Every returned entry must match the subject and selected window. An entry outside the window is a relation/consistency defect, not an item to drop silently.
8. `as_of_cursor`, when present, is the same committed observation snapshot marker used to build the view; it is not the page continuation.

### 6.6 Visibility, freshness and degraded surface

| condition | public Q05 surface | rule |
|---|---|---|
| visible non-empty page | `Present` + non-empty page + `Visible`/allowed `Restricted` | all entries are within outer visibility |
| visible empty page | `Empty` + empty items + no continuation | empty local projection does not prove source audit absence |
| hidden subject/page | body absent or policy-defined redacted page; `NotVisible`/`Unknown` as supplied by decision | do not disclose existence, count or source identity |
| restricted/limited degraded | body only when decision explicitly permits; preserve gaps/reason | do not widen entry visibility or synthesize normal success |
| stale projection | preserve persisted stale marker and old values only if read policy permits | no refresh/rebuild/repair |
| rebuilding | preserve matching persisted rebuilding/progress surface | Q05 cannot start or advance maintenance |
| disabled/unavailable | typed availability surface or typed error | no adapter activation/fallback scan |
| relation/shape corruption | consistency/invariant error | no partial page, omitted item or fabricated gap |

For an empty page, a formal page/list visibility resolver is required because there is no item from which to derive a visibility decision. The current Step 06/07 material does not identify a Q05-specific page-level seed or dedicated resolver; this is `S08-D-Q05-PAGE-VISIBILITY-01`.

Degraded precedence must be finite and source-based. The current generic `ObservationQueryResult<T>` does not state whether a missing entry relation, known gap, stale marker, projection mismatch or availability failure wins for Q05, nor which typed mapper creates the `DegradedSurface`; this is `S08-D-Q05-SURFACE-MAPPER-01`. Q05 must not choose the first dependency failure or parse an error string.

### 6.7 Error and no-write matrix

| condition | mapping | write/side effect |
|---|---|---|
| malformed query name, subject or page | `InvalidRequest` | no repository call |
| foreign/malformed cursor | `InvalidPageCursor` | no UoW; no fallback to first page |
| no visible local entries in valid scope | `Empty` | none |
| exact subject/window not found where a formal lookup proves absence | typed missing/availability surface only if the Q05 mapper defines it | none; do not use empty as missing |
| hidden/not-visible | visibility surface with body/count/identity redaction | none |
| stale/rebuilding/disabled | persisted freshness/rebuild/availability surface | no refresh, repair or rebuild |
| dangling relation, conflicting duplicate, invalid entry combination | persistence invariant/consistency failure | no partial response |
| repository unavailable | `RepositoryUnavailable` / typed availability surface | no adapter activation or source fallback |
| repeated identical query | ordinary read repeat | no reservation, stored result, read-access audit or outbox |

### 6.8 Step 09 handoff contract

`GetAuditTimelineFlow` is reserved as the next flow name. The later flow must consume, without redefining:

```text
GetAuditTimelineInput
  -> exact read visibility resolution for AuditTimeline(subject, window)
  -> for_audit_timeline(subject) + page_audit_timeline(subject, page)
  -> relation/window/order validation
  -> gap/freshness/degraded source mapper
  -> AuditTimelineEntryList + AuditTimelineView
  -> application paged carrier
  -> public response assembler
```

Step 09 must not add UoW or mutation to this chain, and must not use the historical `AuditTimelineQuery` placeholder as a new public or repository type.

## 7. Truth-source and closure tables

### 7.1 Query response / view closure

| Query | Response | field | type | source | empty/not-visible/degraded | public identity/key |
|---|---|---|---|---|---|---|
| `GetAuditTimeline` | `AuditTimelineView` | `subject_ref` | `AuditSubjectRef` | request | hidden branch does not disclose | selector key |
| `GetAuditTimeline` | `AuditTimelineView` | `time_window` | `AuditTimelineWindow` | missing formal input/resolver | invalid window rejects | transient query scope |
| `GetAuditTimeline` | `AuditTimelineView` | `entries` | `AuditTimelineEntryList` | `page_audit_timeline` | empty list is valid only with explicit page visibility/freshness | entry key `(appended_at, append_record_ref)` |
| `GetAuditTimeline` | `AuditTimelineView` | `gap_refs` | `GapStateRefSet` | formal same-scope gap source | empty cannot hide known gap | typed gap refs |
| `GetAuditTimeline` | `AuditTimelineView` | `visibility` | `VisibilitySurface` | `ReadVisibilityDecision` / mapper | hidden body absent | no independent identity |
| `GetAuditTimeline` | `AuditTimelineView` | `freshness` | `ObservationProjectionFreshnessSurface` | persisted marker | stale/rebuilding retained | marker is not cursor |
| `GetAuditTimeline` | `AuditTimelineView` | `as_of_cursor` | `Option<ObservationCursor>` | committed read boundary | None only when allowed by view matrix | local snapshot marker |
| `GetAuditTimeline` | public page | `next_cursor` | `ObservationPageCursor` | same-binding repository continuation | empty page has no next cursor | opaque public token |

### 7.2 DTO / object / port closure

| input/output | target | exact source/owner | missing behavior | current status |
|---|---|---|---|---|
| `GetAuditTimelineRequest.subject_ref` | `AuditTimelineView.subject_ref` | contracts `AuditSubjectRef` + assembler | invalid ref reject | defined |
| `GetAuditTimelineRequest.page` | repository page | contracts page -> application page helper | foreign cursor reject | defined with page-name affected |
| repository entry page | `AuditTimelineEntryList` | `AuditEvidenceRepository.page_audit_timeline` + Step 06 list factory | conflict/dangling relation error | defined |
| entry page + window + markers | `AuditTimelineView` | Step 06 `AuditTimelineView::build` | missing source/marker fail closed | window/marker owner affected |
| application result | public paged response | Step 07 `ObservationQueryResult` plus required page carrier/assembler | no API-side cast | affected |

## 8. Affected register for Q05

| ID | status | affected | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q05-WINDOW-SOURCE-01` | `open_upstream_internal` | `AuditTimelineView` requires `AuditTimelineWindow`, but `GetAuditTimelineInput` currently carries only subject + page and no unique window source/resolver is named | Step 06/07 select a canonical window input/source and propagate exact field, digest, repository filtering and empty/mismatch rules | use query time, source event time, full-history default, ref parsing or hidden API field |
| `S08-D-Q05-QUERY-CARRIER-01` | `open_internal_affected` | Step 07 Read façade returns `ObservationQueryResult<AuditTimelineView>` although Q05 is a page query; no unique application paged result carrier/signature mapping | select canonical application carrier and exact Q05 return/assembler mapping; preserve repository page private | cast single result, expose repository page result, assemble page in API handler |
| `S08-D-Q05-SURFACE-MAPPER-01` | `open_internal_affected` | generic Query result has no Q05-specific degraded/error precedence or material source map for gaps, partial entries, marker mismatch and availability | define finite typed Q05 mapper/summary and Step 07 source; service only copies it | derive kind from exception/ref text/first failed dependency |
| `S08-D-Q05-PAGE-VISIBILITY-01` | `open_internal_affected` | an empty page has no item for per-item visibility; no dedicated page/list visibility seed and mapping is named | define page-level visibility resolution with subject/window/scope source and empty-page semantics | derive visibility from empty result, cursor, first item fallback or route |
| `S08-D-Q05-FRESHNESS-SOURCE-01` | `open_internal_affected` | `AuditTimelineView.freshness` and `as_of_cursor` need one formal committed source; `page_audit_timeline` signature does not return either | define Q05 snapshot/freshness source and consistency relation, or explicitly narrow the view contract | use query time, last entry time, row version, page cursor or current rebuild state |
| `S08-D-Q05-GAP-SOURCE-01` | `open_internal_affected` | `gap_refs` must cover same subject/window without hiding known gaps, but no Q05-specific gap lookup/page callable is propagated | define typed gap source, order/bound/empty and relation mapping | infer gaps from empty entries, error text or entry omission |

No new external upstream blocker was found. These six items are controlled Step 06/07 internal affected records; the known unrelated `R06.6-F2-H13-UPSTREAM=open_controlled` remains open.

## 9. Stop review

| check | conclusion |
|---|---|
| Q05 has independent request, response, source, page, error, no-write and Step 09 handoff record | pass with affected open |
| Q05 truth boundary is observation projection only | pass |
| source audit/business truth/body/evidence/signoff ownership remains external | pass |
| exact repository method and order | pass: `page_audit_timeline(subject_ref, page)`; `(appended_at, append_record_ref)` |
| exact cursor binding | pass: `for_audit_timeline(subject_ref)` |
| view field schema | pass at Step 06 object level; window/marker source propagation affected |
| empty / hidden / stale / rebuilding / disabled / failed distinction | defined with affected open |
| public/application page mapping | protocol shape defined; canonical application carrier remains open |
| query zero-write | pass by dependency boundary; no UoW/reservation/stored result/audit/outbox/repair/rebuild/external call |
| all six Q05 affected IDs registered | pass |
| new external blocker | none |
| current protocol count | `21/60 defined_with_affected_open`; `0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before reading Q06 |

## 10. Recovery and formal-document boundary

当前恢复点为：

```text
Step08_S08-D_Q05_defined_with_affected_open_waiting_user_before_Q06
```

本文件是 design-only discussion material。未经用户再次确认，不得读取 Q06，也不得修改正式 `03-详细设计.md`、任何 `04` 文件或实现代码。当前不需要提交 commit。
