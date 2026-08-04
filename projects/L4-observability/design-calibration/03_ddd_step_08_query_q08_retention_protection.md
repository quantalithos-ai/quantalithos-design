# L4-observability 详细设计 Step 08

## S08-D Query Q08 `GetRetentionProtection`

> 本文件是 Q08 的独立讨论中间产物。它只覆盖 `GetRetentionProtection`，不关闭 Q09-Q14，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. Step 状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | S08-D Query Q08 |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_Q09` |
| 逻辑协议 | `Query / GetRetentionProtection / GetRetentionProtectionRequest` |
| 后续处理流 | `GetRetentionProtectionFlow`，这里只登记 handoff，不展开 Step 09 |
| 当前协议计数 | `24/60 defined_with_affected_open`；`0/60` 无条件完成 |
| Query 计数 | `8/14 defined_with_affected_open`；`6/14` 待逐协议审查 |
| 正式文档 | 正式 `03-详细设计.md` 冻结，不回填 |
| 下一允许动作 | 停审并等待用户明确确认；确认后只读取 Q09 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

### 1.1 本批禁止事项

- 不读取或写入 Q09-Q14、S08-E~G、Step 09 及后续 Step。
- 不在 Step 08 临时声明 `RetentionProtectionView`、`GetRetentionProtectionRequest` 或 `GetRetentionProtectionInput` 为 canonical owner。
- 不调用 `stage_retention`、`stage_active_protection`、`append_retention_record`、任何 UoW、P8 evaluation、release、cleanup、archive adapter、refresh、repair或rebuild。
- 不把 request 中 `ProtectedObservationRef.state` 或 `retention_marker_ref` 当成 current repository truth。
- 不把 `ReleaseEligible`、`Expired` 或 relation `Released` 解释为 cleanup authorization、source deletion、archive package deletion或Archive接受。
- 不读取或暴露 source body、evidence body、report body、archive body、consumer内部配置、endpoint、credential、policy basis或repository version。
- 不创建 read audit、H5 record、stored result、reservation、outbox、marker、protection relation或cleanup task。

## 2. 实际读取、权威顺序与 historical material

### 2.1 本批实际读取

| 输入 | 用途 |
|---|---|
| `详细设计讨论流程_SOP.md` Step 08 | Query 逐协议 request/view/source/presence/visibility/freshness/degraded/error/no-write/停审要求 |
| `详细设计书写规范.md` 5.6/5.7 | public DTO、secondary type、字段来源、错误和 API 协议粒度 |
| `设计真相源闭环与可落码性标准.md` | selector authority、public view owner、composite read、typed relation和no-write门禁 |
| Step 06 contracts/input 专项 | `ProtectedObservationRef`、`GetRetentionProtectionInput` use-site、Query control fields |
| Step 06 boundary/read/maintenance 专项 | `RetentionMarker`、`ActiveReferenceProtection`、state/reason/set条件矩阵 |
| Step 06 policy/guard/record 专项 | P8 decision边界、H5 `RetentionChangeRecord` schema及append-only语义 |
| Step 07 trait/port/adapter 契约 | exact assembler、Read façade、retention repository point/page/write callable |
| current formal `02` 与冻结 Step 09 | 只确认 Q08 骨架和历史冲突，不作为 current exact owner |
| Q07 current产物 | 只消费单协议停审和current/historical推进方式，不复制handoff schema |

### 2.2 权威顺序

```text
current Step 08 Q08 authority / affected register
  > Step 07 exact callable and read-only repository boundary
  > Step 06 current retention/protection object and H5 record contracts
  > current formal 02 / HLD Query skeleton
  > frozen Step 09 table and old formal 03
```

### 2.3 Historical material 裁定

| material | current disposition |
|---|---|
| HLD `RetentionProtectionView` 名称 | 只证明需要一个只读 retention/protection surface；没有字段、factory或public type owner |
| HLD `RetentionChangeRecord` 读取来源 | 只证明需要审计语义；Step 07没有H5 read callable，Q08不能假装可读取timeline |
| 冻结 Step 09 `list_active_protections` | `historical_material`；current callable是分页 `page_active_protections_by_protected_ref`，没有该list方法 |
| 冻结 Step 09 `absent marker -> unmarked/missing per scope` | 未闭合二义性；Q08必须区分本地marker缺失、selector stale/mismatch和hidden，不得临时合成Unmarked aggregate |
| request完整 `ProtectedObservationRef` | current use-site，但它包含mutable-looking state/marker snapshot；不能作为current truth或无条件repository key |

## 3. SOP 问题回答

| # | 问题 | Q08 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetRetentionProtection` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> retention read repository |
| 3 | 调用方与处理方 | exact API handler调用 `ObservationApiInputAssembler::get_retention_protection`，再调用 `ObservationReadService::get_retention_protection` |
| 4 | 传输方式 | 只固定logical binding；endpoint、credential和产品locator后置，不进入DTO |
| 5 | request schema | body仅有 `protected_ref: ProtectedObservationRef`；独立canonical declaration仍affected |
| 6 | response schema | non-paged `ObservationQueryResponse<RetentionProtectionView>`；`Empty`不适用于point-read |
| 7 | 读取目标 | Observability-owned current retention marker、与其关系一致的current active protection surface |
| 8 | truth边界 | 只表达本地hold/release-candidate/conflict/protection事实；不拥有source cleanup、archive package或consumer业务truth |
| 9 | selector authority | request完整ref只提供已验证selector snapshot；identity/state/marker字段如何用于lookup和stale判定必须由formal resolver唯一绑定 |
| 10 | marker lookup | 只允许按formal protected identity查唯一current marker；不得从request marker ref直接跳过relation校验 |
| 11 | protection lookup | marker attached ref present时必须point-load并校验；同时必须证明protected-ref页面没有另一个current relation |
| 12 | H5 history | current repository只有writer；Q08当前只返回aggregate/entity current state，不返回timeline/latest record |
| 13 | visibility | current request visibility来自metadata + formal P10/P11 read mapper；marker/protection state不等于visibility |
| 14 | freshness | response freshness必须覆盖selector resolution、marker、protection、visibility和current-relation proof |
| 15 | consumer disclosure | active consumer set是本地保护依据；public view是否返回完整typed set或安全摘要必须有唯一visibility/redaction owner |
| 16 | marker absence | 不创建 `Unmarked` marker；可安全确认本地不存在时为Missing，hidden/selector不明时为Unknown/NotVisible |
| 17 | state semantics | `ReleaseEligible`、`Expired`、`Released`均不表示cleanup/archive完成；`Conflict/Conflicted`是Present本地状态 |
| 18 | archive hint | `archive_eligibility_ref`只表示本地hint，不表示Archive接受、package存在或cleanup许可 |
| 19 | actor authority | actor只来自 `ObservationQueryMetadata`；body不接受actor、consumer、visibility、policy outcome或cleanup intent |
| 20 | no-write | 不创建UoW，不stage/append，不重评P8，不调用release/cleanup/archive/maintenance callable |
| 21 | error mapping | invalid、not-visible、missing、selector stale、marker/protection relation、history unavailable、freshness和availability必须typed且优先级有限 |
| 22 | Step 09回指 | 只保留 `GetRetentionProtectionFlow` handoff；不在本批写函数级流 |
| 23 | 停审标准 | 独立记录request、target view、read chain、relation、surface、no-write、affected与恢复点后停审 |

## 4. Exact callable 与当前缺口

### 4.1 API assembler 与 Read façade

```rust
ObservationApiInputAssembler::get_retention_protection(
    ObservationQueryRequest<GetRetentionProtectionRequest>
) -> Result<GetRetentionProtectionInput, ApplicationError>
```

```rust
ObservationReadService::get_retention_protection(
    GetRetentionProtectionInput
) -> ApplicationServiceFuture<
    '_,
    ObservationQueryResult<RetentionProtectionView>
>
```

这些签名固定了operation、application input和目标response type的use-site。`GetRetentionProtectionInput`及其四个Query control fields已由R06.8-A在`application::inputs`唯一闭合，Q08只消费该owner和exact assembler，不重复登记input carrier；仍待闭合的是public request declaration、目标view及其exact mapper。

### 4.2 当前可用只读 repository callable

```rust
RetentionGuardRepository::find_retention_by_protected_ref(
    &ProtectedObservationRef
) -> ApplicationPortFuture<Option<Versioned<RetentionMarker>>>
```

```rust
RetentionGuardRepository::get_retention_with_version(
    &RetentionMarkerRef
) -> ApplicationPortFuture<Option<Versioned<RetentionMarker>>>
```

```rust
RetentionGuardRepository::get_active_protection_with_version(
    &ActiveReferenceProtectionRef
) -> ApplicationPortFuture<Option<Versioned<ActiveReferenceProtection>>>
```

```rust
RetentionGuardRepository::page_active_protections_by_protected_ref(
    &ProtectedObservationRef,
    ObservationRepositoryPage
) -> ApplicationPortFuture<
    ObservationRepositoryPageResult<Versioned<ActiveReferenceProtection>>
>
```

`Versioned<T>`、repository page/cursor都属于application-private technical carrier。Q08是non-paged public Query，不能直接暴露page，也不能只读第一页后声称complete relation proof。当前没有一个composite callable在同一committed boundary返回selector resolution、sole marker、attached protection、complete current-relation proof、visibility和freshness，登记 `S08-D-Q08-RETENTION-READ-CARRIER-01`。

### 4.3 Q08 明确禁止调用的 callable

| callable / family | Q08 rule |
|---|---|
| `stage_retention` | 禁止；Query不创建、CAS或更新marker |
| `stage_active_protection` | 禁止；Query不attach consumer、reconcile或release protection |
| `append_retention_record` | 禁止；普通Query不生成H5 |
| P8 `RetentionProtectionPolicy` | 禁止重评；只返回persisted current state |
| `RetentionMarker::apply_decision` / `mark_archive_eligible` / `release` | 禁止；release本身仍是reserved且不执行cleanup |
| `ActiveReferenceProtection` mutation members | 禁止attach、mark conflict、apply release decision |
| archive/cleanup/source adapter | 禁止；Q08没有external phase或source write lane |
| projection refresh/rebuild/gap mutation | 禁止；stale/degraded只作为surface返回 |

## 5. Request 与 selector contract

### 5.1 Logical binding

| 项 | current contract |
|---|---|
| logical binding | `Query / GetRetentionProtection / GetRetentionProtectionRequest` |
| metadata | `ObservationQueryMetadata`提供actor、trace、visibility scope、consistency和trusted requested time |
| application input | `GetRetentionProtectionInput` |
| public response | non-paged `ObservationQueryResponse<RetentionProtectionView>` |
| page / cursor | public request none；internal protection lifecycle page仅用于bounded relation proof |
| write lane | none |

### 5.2 Current request shape

Step 06 registry给出的唯一body use-site shape是：

```rust
pub struct GetRetentionProtectionRequest {
    pub protected_ref: ProtectedObservationRef,
}
```

这段代码只记录目标schema，不宣称本文件成为canonical declaration owner。request不增加：

- `marker_ref`、`active_protection_ref`、consumer set、marker/protection state或reason selector；
- hold/release/cleanup intent、archive eligibility verdict、retention duration、storage tier或policy key；
- page、cursor、actor、visibility、freshness、consistency或requested time body字段；
- source body、archive package、report/evidence body、endpoint或credential。

### 5.3 Selector authority 问题

`ProtectedObservationRef`不是纯ID。它包含：

```rust
pub struct ProtectedObservationRef {
    pub protected_observation_ref_id: ProtectedObservationRefId,
    pub observation_object_ref: ObservationObjectRef,
    pub protection_scope: ProtectionScope,
    pub retention_marker_ref: Option<RetentionMarkerRef>,
    pub state: ProtectedObservationState,
}
```

Q08不得把request中的`state`或`retention_marker_ref`当作current truth。当前 repository却使用完整ref作为`find_retention_by_protected_ref`和protection page selector，尚未唯一说明：

1. canonical repository key是stable ID、完整 immutable tuple，还是完整 snapshot equality；
2. request snapshot stale但stable ID/target/scope一致时返回invalid、conflict、missing还是typed stale selector；
3. request marker ref与loaded sole marker不一致时的优先级；
4. `Released/Invalid` selector是否允许查询historical current surface，还是必须使用另一个identity-only selector。

登记 `S08-D-Q08-SELECTOR-AUTHORITY-01`。在关闭前，assembler必须fail closed，不能剥掉state/marker字段后悄然查询，也不能把request snapshot覆盖repository truth。

### 5.4 Request validation matrix

| condition | mapping | prohibited fallback |
|---|---|---|
| query name / body type与Q08不匹配 | `InvalidRequest`，repository前拒绝 | 从JSON字段或route文字猜operation |
| malformed/foreign protected object family | typed invalid reference/request | 当作Missing、source ref或opaque string查询 |
| selector stable identity/target/scope非法 | typed invalid relation | 只取inner object ref或ID继续查询 |
| request snapshot与formal selector authority不一致 | typed stale/conflict/invalid selector | 忽略state/marker字段或用request覆盖loaded marker |
| metadata actor/visibility缺失或非法 | shared typed request failure | 从consumer、marker/protection或object owner推导actor |
| consistency hint不受支持 | typed consistency surface | 自动重评P8、refresh或忽略hint |
| request合法 | 进入bounded point/composite read chain | 全局扫描、任取第一marker/protection或创建Unmarked |

`S08-D-Q08-REQUEST-SCHEMA-01`保留public request declaration、sealed binding和decoder owner缺口。Application carrier、四个Query control fields和lossless assembly复用R06.8-A的既有owner，不在Q08重复登记affected。

## 6. `RetentionProtectionView` 目标语义契约

### 6.1 Owner 与 schema 状态

Step 07 Read façade要求 `RetentionProtectionView`，但 current Step 06 `contracts::views`只闭合六个其他view，没有该类型的唯一declaration、module path、factory、rehydrate或domain-to-public mapper。Q08登记 `S08-D-Q08-VIEW-OWNER-01`，并只固定实现必须满足的最小语义schema。

下列结构是owner修订必须承接的目标字段槽位，不是Step 08新建canonical Rust owner：

```rust
pub struct RetentionProtectionView {
    pub protected_ref: ProtectedObservationRef,
    pub marker: RetentionMarkerView,
    pub active_protection: Option<ActiveReferenceProtectionView>,
}
```

`RetentionMarkerView`目标最小字段：

```rust
pub struct RetentionMarkerView {
    pub marker_ref: RetentionMarkerRef,
    pub state: RetentionMarkerState,
    pub purpose: RetentionPurpose,
    pub active_protection_ref: Option<ActiveReferenceProtectionRef>,
    pub archive_eligibility_ref: Option<ArchiveEligibilityRef>,
    pub release_reason: Option<RetentionReleaseReason>,
    pub conflict_reason: Option<RetentionConflictReason>,
}
```

`ActiveReferenceProtectionView`目标最小字段：

```rust
pub struct ActiveReferenceProtectionView {
    pub protection_ref: ActiveReferenceProtectionRef,
    pub reason: ActiveProtectionReason,
    pub state: ActiveReferenceProtectionState,
    pub consumer_refs: ObservationConsumerRefSet,
    pub release_reason: Option<RetentionReleaseReason>,
    pub conflict_reason: Option<ProtectionConflictReason>,
}
```

这些secondary view type的exact name、owner、wire、factory和domain-to-public mapper统一由 `S08-D-Q08-VIEW-OWNER-01` 承接；consumer disclosure规则单独受 `S08-D-Q08-CONSUMER-DISCLOSURE-01` 约束。若owner选择flattened schema，也必须lossless保留marker/protection两层状态和条件字段，不能压成`protected: bool`或`cleanup_allowed: bool`。

### 6.2 Field source closure table

| view field | authoritative source | Q08 closure / rule |
|---|---|---|
| `protected_ref` | loaded marker/protection exact target relation | 不直接回显request stale snapshot；必须使用formal canonical resolved value |
| marker identity | loaded sole `RetentionMarker.marker_ref` | request nested marker ref只能校验，不能成为truth |
| marker state | loaded aggregate current state | `Conflict`仍是Present；`ReleaseEligible`不等于cleanup许可 |
| marker purpose | loaded aggregate immutable purpose | 不返回duration、tier、config key或policy body |
| marker protection ref | loaded aggregate current relation | Some必须point-load同ref protection并通过relation matrix |
| archive eligibility ref | loaded aggregate local hint | 不表示Archive接受、package存在、移交完成或可删除 |
| marker release/conflict reasons | loaded aggregate conditional fields | 只按state matrix出现；不从protection/error推导 |
| protection identity | loaded exact relation | 必须等于marker attached ref；不能任取page第一条 |
| protection reason/state | loaded entity current fields | `Expired/Released`不表示marker release或cleanup完成 |
| consumer refs | loaded entity canonical current set | 仅本地active-consumer snapshot；visibility/redaction规则affected |
| protection release/conflict reasons | loaded entity conditional fields | 只按state matrix出现；不从empty set自动推导 |

不进入public view：repository version、P8 basis/snapshot/decision、H5 before/change/after、historical consumers、retention duration、cleanup/archive operation、source locator/body、consumer endpoint/config和external result。

### 6.3 State condition matrix

| state | required fields | prohibited interpretation |
|---|---|---|
| marker `Unmarked` | purpose + target；release/conflict absent | 不表示marker row可以由Query合成；只有persisted object present时可返回该state |
| marker `ActiveHold` | compatible active protection relation；release/conflict absent | 不表示永久保留或source truth状态 |
| marker `ReleaseEligible` | release reason Some；conflict absent | 不表示cleanup authorized、scheduled或executed |
| marker `Conflict` | conflict reason Some；release absent | 不把conflict转成Missing或repository error |
| marker `Released` | current phase不能由现有callable产生；若历史数据可读必须按terminal local state处理 | 不表示source material、archive package或external copy已删除 |
| protection `Unprotected` | consumer set empty；reasons absent | relation存在，不等于marker absent |
| protection `Protected` | consumer set non-empty；reasons absent | 不暴露consumer业务truth或授权 |
| protection `Expired` | consumer set empty + release reason | 仍需fresh P8 re-evaluation，不等于released |
| protection `Released` | consumer set empty + release reason；terminal | 不等于marker released或cleanup完成 |
| protection `Conflicted` | conflict reason；consumer set按last accepted snapshot保留 | empty/non-empty都不能被Query重评 |

## 7. Composite read chain 与关系一致性

### 7.1 目标只读链

```text
GetRetentionProtectionRequest(protected_ref)
  -> validate exact query binding, metadata and selector snapshot
  -> resolve current request-scoped visibility without leaking existence
  -> resolve canonical protected-object selector authority
  -> find sole current retention marker by canonical protected identity
  -> validate request nested marker relation against loaded marker
  -> when marker.active_protection_ref is Some, point-load exact protection
  -> boundedly prove no conflicting current protection relation for the same target
  -> validate marker/protection target, identity, state, reasons and consumer-set matrix
  -> obtain one composite freshness/availability summary
  -> apply finite public type and consumer-disclosure mapping
  -> RetentionProtectionView factory
  -> ObservationQueryResponse<RetentionProtectionView>
```

### 7.2 Marker selector and identity relation

| check | valid condition | failure mapping |
|---|---|---|
| canonical selector | formal resolver accepts request stable identity/target/scope snapshot | typed invalid/stale selector |
| marker presence | `find_retention_by_protected_ref` returns at most one sole current marker | absent surface or consistency failure, not synthesizedUnmarked |
| target relation | loaded marker `protected_ref` equals canonical resolved protected relation | consistency failure |
| nested marker ref | request ref None/Some must satisfy formal stale/current rule | typed stale/conflict；never overwrite loaded truth |
| direct marker parity | optional `get_retention_with_version(loaded.marker_ref)` if used must return same object undersame snapshot | parity failure, notfallback |

`find_retention_by_protected_ref`文字要求“complete protected-object identity”，但request携带的是stateful snapshot；exact key/equality/stale规则未唯一闭合，因此selector authority保持affected。

### 7.3 Marker and active-protection relation matrix

| marker attached ref | direct protection | complete protected-ref relation proof | Q08 result |
|---|---|---|---|
| `None` | not called | no current attached/conflicting relation | valid marker-only view |
| `None` | not called | current nonterminal protection exists | relation inconsistency |
| `Some(P)` | `Some(P)` same target | P is sole compatible current relation | valid marker + protection view |
| `Some(P)` | `None` | any | dangling relation consistency failure |
| `Some(P)` | `Some(P)` other target | any | cross-target consistency failure |
| `Some(P)` | `Some(P)` same target | another current conflicting relation exists | duplicate/current relation failure |
| `Some(P)` | `Some(Q)` where Q != P | any | identity/parity failure |

Current repository只有按protected ref的完整lifecycle page，没有“sole current protection”point index。Q08不能只读第一页或按`protection_ref`排序取第一条。必须有bounded exhaustive relation carrier、current-state filter/uniqueness proof或专用current index，登记 `S08-D-Q08-PROTECTION-RELATION-01`。

### 7.4 H5 history boundary

`RetentionChangeRecord`是append-only H5 audit truth，能够表达marker/protection before/change/after、consumer set、archive hint、reason和P8 basis。但Step 07当前只有 `append_retention_record`，没有按protected target/marker/protection读取H5的callable、order、bound、cursor或public projection。

因此Q08当前规则是：

1. 返回marker/protection current state，不返回timeline、latest change record或历史consumer association。
2. 不把row version、当前state、consumer set、archive hint或repository顺序反推为latest H5。
3. 不调用writer、不扫描内部表、不返回unbounded history。
4. Step 06/07必须明确最终Q08为current-state-only，或新增bounded H5 read projection；登记 `S08-D-Q08-HISTORY-SOURCE-01`。

## 8. Presence、visibility、freshness 与 degraded surface

### 8.1 Point-read presence matrix

| condition | public presence | body / disclosure rule |
|---|---|---|
| visible、selector/relation-valid marker exists | `Present` | `Some(RetentionProtectionView)`；protection可按valid relation为None |
| exact canonical target可见且conclusively无marker | `Missing(NotFound)` | body None；不创建Unmarked marker |
| target hidden / existence不可安全披露 | policy-defined `Unknown` / NotVisible | body None；不得返回Missing或state |
| selector stale/mismatch | typed selector conflict/error | 不把旧snapshot解释成Missing |
| marker/protection relation broken | typed consistency error | 不返回partial marker-only body |
| dependency unavailable | availability/Unknown surface | 不fallback到request snapshot |
| marker/protection Conflict/Conflicted/ReleaseEligible/Expired/Released | `Present` local state | state是body内容，不改变presence |

Q08是单体point-read，`ObservationQueryPresence::Empty`永远非法。Marker absent不自动等于persisted `RetentionMarkerState::Unmarked`；只有真实marker object存在时才能返回Unmarked state。

### 8.2 Visibility and consumer disclosure

Current response visibility来自`ObservationQueryMetadata.visibility_scope_ref`和formal P10/P11 decision。Marker/protection没有persisted read visibility字段，不能从state、purpose、scope、consumer set或object family推导当前actor可见性。

Active consumer refs可能披露report/peripheral/read-model/diagnostic/archive handoff关系。Q08必须有operation-specific disclosure规则：

- body不可见时，marker/protection identity、state、consumer count和存在性全部隐藏；
- body可见不自动允许完整consumer set；可能需要完整typed set、受限typed set或body-free summary，但必须由唯一contracts/view policy定义；
- 不得返回consumer endpoint、product、credential、display name、business status或current external truth；
- 不得用consumer set为空推导无历史引用、可cleanup或Archive已接收。

Exact visibility source和consumer disclosure mapper尚未唯一绑定，分别登记 `S08-D-Q08-VISIBILITY-SOURCE-01` 与 `S08-D-Q08-CONSUMER-DISCLOSURE-01`。

### 8.3 Freshness rules

Q08目标是current aggregate/entity point surface，不是projection page，但shared `ObservationQueryResult<T>`仍要求 `ObservationProjectionFreshnessSurface`。Current read chain没有覆盖selector resolution、marker、protection、complete current-relation proof和visibility的共同committed marker。

| candidate source | Q08 ruling |
|---|---|
| marker/protection row version | 禁止；application CAS carrier，不是public freshness |
| request `requested_at` | 禁止；query time不创建Fresh |
| request `ProtectedObservationRef.state` | 禁止；caller snapshot不是committed freshness |
| marker/protection state | 禁止；lifecycle state不是freshness |
| H5 latest record | 当前不可读，且不能由time/PK猜测 |
| repository page cursor | 禁止；内部continuation不证明point composite freshness |
| formal composite read marker | 允许；必须覆盖全部required owners及relation proof |

登记 `S08-D-Q08-FRESHNESS-SOURCE-01`。缺口关闭前不能默认返回Fresh。

### 8.4 Degraded、availability and precedence

- marker `Conflict` / protection `Conflicted` 是本地domain state，不等于dependency degraded。
- stale selector、repository unavailable、incomplete protection lifecycle page、relation mismatch、consumer disclosure限制和history不可读必须保留各自typed source。
- relation损坏不能以degraded partial marker body掩盖；H5不可读在current-state-only裁定下不使current body自动degraded。
- 多依赖失败的有限优先级和material source map尚未由Q08 exact mapper唯一绑定，登记 `S08-D-Q08-SURFACE-MAPPER-01`。

建议precedence：protocol validation -> request visibility/existence disclosure -> selector authority -> marker availability/presence -> marker identity relation -> protection bounded relation -> object condition/public mapping -> consumer disclosure -> composite freshness/degraded。Repository调用完成顺序不能决定surface。

## 9. Error 与 no-write matrix

| condition | public/application mapping | side effect rule |
|---|---|---|
| malformed binding/body/metadata | `InvalidRequest` / typed reference error | repository write 0；UoW 0 |
| hidden current visibility | NotVisible/Unknown surface | 不披露target、marker、protection、consumer或state |
| selector stale/mismatch | typed conflict/invalid selector | 不strip字段重试，不fallback inner ID |
| retention repository unavailable | typed availability/error | 不调用source/archive/config fallback |
| canonical target无marker | `Missing(NotFound)`，前提是visibility允许分类 | 不创建Unmarked marker |
| loaded marker target/ref mismatch | consistency failure | 不返回body |
| marker attached protection missing/mismatch | consistency failure | 不返回partial marker-only body |
| protection lifecycle无法boundedly证明current uniqueness | affected fail-closed / typed availability-consistency | 不读第一页后猜current |
| H5不可读 | current-state-only surface或affected fail-closed | 不调用append、不扫描内部表 |
| public type/consumer disclosure mapping不完整 | response assembly failure | 不泄漏domain/internal consumer types |
| freshness source缺失 | Unknown/stale/affected surface | 不用version/state/time伪造Fresh |
| marker/protection conflict/release states | normalPresent local state | 不触发P8、release、cleanup、archive或job |
| repeated identicalQuery | ordinary repeatable read | 不reserve、不存result、不写H5/outbox/read audit |

## 10. Field / owner / affected closure table

| closure item | current owner / callable | Q08 conclusion |
|---|---|---|
| request body use-site | Step 06 input registry | shape固定为一个complete protected ref；standalone declaration affected |
| application input | `GetRetentionProtectionInput` registry/use-site | exact name/field known；完整carrier owner/control assembly affected |
| application entry | assembler + Read façade exact callable | observed and retained |
| response view | Step 07 use-site `RetentionProtectionView` | canonical owner/schema/factory missing |
| protected selector | `ProtectedObservationRef` + `find_retention_by_protected_ref` | stateful selector authority/stale rule affected |
| marker point read | `get_retention_with_version` | exact ref lookup known；optional parity only,version private |
| sole marker lookup | `find_retention_by_protected_ref` | intended unique current marker；key/equality semantics affected |
| protection point read | `get_active_protection_with_version` | exact attached ref lookup known |
| protection lifecycle read | `page_active_protections_by_protected_ref` | internal page only；current uniqueness/bounded aggregation affected |
| H5 history read | none | current-state-only；final bounded history decision affected |
| current visibility | formal read policy/mapper | Q08-specific source affected |
| freshness | formal composite committed marker | source affected；time/version/state禁止替代 |
| public state/reason/view mapping | contracts view/secondary owner | exact mapping affected |
| consumer disclosure | Q08 exact view mapper/policy | full set vs safe summary boundary affected |
| public response mapper | `ObservationQueryResponse<T>` + Q08 exact assembler | precedence/source mapping affected |
| Step 09 handoff | `GetRetentionProtectionFlow` | reserved only；不展开flow |

## 11. Affected register for Q08

| ID | status | affected definition | required repair | prohibited shortcut |
|---|---|---|---|---|
| `S08-D-Q08-VIEW-OWNER-01` | `open_upstream_internal` | `RetentionProtectionView`只有Step07 return use-site，Step06六个current public view中没有其declaration、fields、factory或mapper | Step06/07在contracts选定唯一view owner，承接本文件marker/protection最小语义和条件矩阵 | Step08创建canonical DTO、复制domain对象或只返回boolean |
| `S08-D-Q08-REQUEST-SCHEMA-01` | `open_upstream_internal` | request只有`protected_ref` registry shape，没有独立public declaration、sealed binding和decoder contract | 补唯一request schema、wire、typed nested validation和operation binding | compatibility alias、隐藏selector或从route/body猜operation |
| `S08-D-Q08-SELECTOR-AUTHORITY-01` | `open_internal_affected` | `ProtectedObservationRef`包含state和optional marker ref，repository又要求complete ref；canonical key、stale snapshot和nested marker mismatch规则未唯一绑定 | 定义identity/equality/resolver authority、stale/conflict matrix和request-to-repository key mapping | 只取ID/object ref、忽略state/marker、用request覆盖current truth或把mismatch当Missing |
| `S08-D-Q08-RETENTION-READ-CARRIER-01` | `open_internal_affected` | marker/protection/page/visibility/freshness没有同一committed composite carrier或read transaction证明 | 定义bounded composite read carrier、same-snapshot marker和failure totality | 跨时间拼行、row version当cursor、partial body或多次read默认一致 |
| `S08-D-Q08-PROTECTION-RELATION-01` | `open_internal_affected` | marker attached ref与按protected ref完整protection lifecycle之间缺sole-current selection、uniqueness和parity owner | 增加current index或bounded exhaustive relation carrier，闭合七分支matrix | 取第一页/第一条、按state/time/ref猜current、忽略dangling/duplicate relation |
| `S08-D-Q08-HISTORY-SOURCE-01` | `open_internal_affected` | HLD列出H5 record读取，但Step07只有append，没有bounded read port/order/cursor/public projection | 明确Q08 current-state-only并同步上游，或新增bounded H5 read projection | 调用writer、内部扫描、用row version/state/PK猜latest record |
| `S08-D-Q08-VISIBILITY-SOURCE-01` | `open_internal_affected` | marker/protection没有read visibility字段，Q08专属P10/P11 input/source和existence disclosure未唯一绑定 | 绑定metadata scope、formal read target/snapshot和finite visibility mapper | 从state、purpose、consumer、row existence或HTTP status推导visibility |
| `S08-D-Q08-CONSUMER-DISCLOSURE-01` | `open_internal_affected` | `ObservationConsumerRefSet`是current protection依据，但Q08 public full-set/limited-set/summary和redaction规则未唯一闭合 | 定义contracts-owned safe disclosure type或明确允许的typed set及visibility matrix | 泄露consumer配置/endpoint/business state，返回count猜truth或静默丢失consumer依据 |
| `S08-D-Q08-FRESHNESS-SOURCE-01` | `open_internal_affected` | response freshness缺覆盖selector、marker、protection、relation proof和visibility的共同committed marker | 定义composite marker/source、consistency hint mapping和stale/unknown规则 | 使用row version、request time、request state、domain state或page cursor |
| `S08-D-Q08-SURFACE-MAPPER-01` | `open_internal_affected` | Q08 invalid/hidden/missing/stale-selector/relation/history/consumer-disclosure/degraded/availability precedence和source map未唯一绑定 | Step07提供finite typed Q08 mapper/summary，response assembler只做lossless转换 | 首个失败调用、exception文本、state名称、empty option或request snapshot决定surface |

Q08复用但不关闭：

- `S08-D-QUERY-SURFACE-MAPPER-01`：shared Query mapper总缺口继续存在。
- `R06.6-F2-H13-UPSTREAM`：与Q08 retention read语义无直接关系，继续 `open_controlled`。

本批新增10项Q08 affected，其中2项要求Step06/07补唯一public owner，8项为selector/read/relation/history/visibility/disclosure/freshness/surface内部闭环缺口。它们都是current design internal affected，不是新的外部上游blocker。

## 12. Step 09 handoff（仅登记）

`GetRetentionProtectionFlow`是Q08唯一后续flow名称。Step 09必须消费本文件的read chain，不得恢复冻结表中的`find + list + absent->Unmarked`简化逻辑：

```text
GetRetentionProtectionRequest
  -> exact request / metadata / selector validation
  -> current visibility and existence-disclosure decision
  -> canonical protected selector resolution
  -> load sole current marker
  -> validate request/marker target and nested marker relation
  -> load exact attached protection when present
  -> boundedly prove current protection uniqueness/parity
  -> validate marker/protection condition matrices
  -> obtain composite freshness/availability summary
  -> apply safe consumer disclosure and finite public mapping
  -> RetentionProtectionView
  -> ObservationQueryResponse<RetentionProtectionView>
```

Step 09不得在该flow中添加UoW、stage、append H5、P8 reevaluation、release、cleanup、archive adapter、refresh、repair、rebuild、gap mutation或source/business truth write。

## 13. Q08 stop review

| 检查项 | 结论 |
|---|---|
| 是否形成独立request、target view、field source、read chain、relation、surface、error/no-write和Step09 handoff记录 | `pass_with_affected_open` |
| request是否保持单一complete `protected_ref`且未偷加state/marker/page selector | pass；standalone declaration受 `S08-D-Q08-REQUEST-SCHEMA-01` 约束 |
| stateful selector authority是否被当作已闭合 | no；key/equality/stale规则受 `S08-D-Q08-SELECTOR-AUTHORITY-01` 约束 |
| exact assembler、Read façade和四个repository read callable是否记录 | pass；composite snapshot受 `S08-D-Q08-RETENTION-READ-CARRIER-01` 约束 |
| `RetentionProtectionView`是否被Step08伪造为canonical owner | no；只记录目标最小语义schema，owner受 `S08-D-Q08-VIEW-OWNER-01` 约束 |
| marker/protection relation是否允许任取第一条 | no；要求bounded current uniqueness，exact owner仍affected |
| H5 history是否在没有read port时被假装可读 | no；当前固定current-state-only，最终裁定仍affected |
| visibility与consumer disclosure是否分层 | target规则已形成；两个exact owner仍affected |
| freshness是否由time/version/state/page cursor伪造 | no；正式composite source仍affected |
| release/expired/released是否升级为cleanup/archive truth | no |
| Query是否保持zero-write | pass；不创建UoW、不stage/append、不重评P8、不调用release/cleanup/archive adapter |
| Q08十项affected是否全部登记 | pass |
| 是否发现新的外部upstream blocker | no；已知 `R06.6-F2-H13-UPSTREAM=open_controlled` 与Q08无直接关系 |
| 当前协议计数 | `24/60 defined_with_affected_open`；`0/60` 无条件 complete |
| 下一动作 | 停审并等待用户明确确认；确认后只读取Q09所需输入 |

## 14. Recovery and formal-document boundary

当前恢复点为：

```text
Step08_S08-D_Q08_defined_with_affected_open_waiting_user_before_Q09
```

本文件是design-only discussion material。未经用户再次确认，不得读取或写入Q09-Q14、S08-E~G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交commit。
