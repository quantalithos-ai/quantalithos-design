# L4-observability 03-详细设计 Step 08 - S08-D Query Q14 `GetRebuildProgress`

> 本文件是 Q14 的独立讨论中间产物。它只覆盖 `GetRebuildProgress`，不关闭后续协议族，不进入 S08-E~G、Step 09 或正式 `03-详细设计.md`。

## 1. 当前状态与边界

| 项 | 当前结论 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08：API / Command / Query / Event / Job 协议契约 |
| 当前批次 | `S08-D Query Q14` |
| 逻辑协议 | `Query / GetRebuildProgress / GetRebuildProgressRequest` |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_S08-E` |
| 协议计数 | `30/60 defined_with_affected_open`；`0/60` 无条件 complete |
| Query 计数 | `14/14 defined_with_affected_open`；Q14 有 21 项 affected |
| Query affected 累计 | Q01-Q13 的 107 项 + Q14 的 21 项 = `128` |
| 正式文档 | 正式 `03-详细设计.md` 继续冻结，只允许 Step 19 重新装配 |
| 下一允许动作 | 停审并等待用户明确确认；确认后才可读取 S08-E 所需输入 |
| 当前提交 | 不需要；用户未要求提交 |

Q14 只读取 observability-owned、已提交的派生维护进度投影。它不拥有 source truth、业务 truth、raw log/metric/trace/audit body、external reference truth、evidence truth、report verdict、验收签署或外部执行 truth。`RebuildProgressView::Completed` 只表示捕获的 observation-side derived target 已完成，不表示 source repair、业务成功、外部执行成功、report handoff 完成或验收通过。

### 1.1 本批禁止事项

- 不读取或写入 S08-E~G、Step 09~19、正式 `03-详细设计.md`、任何 `04` 文件或实现代码。
- 不把 `MaintenanceTargetRef` 当作 maintenance lifecycle、job plan、progress identity、policy authorization 或 execution state。
- 不把 `RebuildProgressViewRef`、`ProjectionMaintenanceRef`、`ReplayCoordinationRef`、`RollupRebuildRef` 互相替代，也不把任何一个转换成 external run id。
- 不从 `None`、首条记录、最新时间、row version、错误文本、provider detail 或 cursor 猜测 progress surface。
- 不因为 target 已存在就合成 `Queued`，不因为 projection `Fresh` 就合成 `Completed`，不因为 `Completed` 就合成 source repaired。
- 不启动、等待、恢复、推进、取消、完成、重建、修复或重新排队 rebuild；Query 不能调用 writer store、UoW、job runner、resolver 或 external adapter。
- 不创建 read audit、idempotency reservation、stored result、gap transition、freshness marker、outbox、report handoff record 或任何其他 durable side effect。
- 不伪造实现 commit、run_id、evidence alias、测试结果、验收签署或真实 evidence。

## 2. 读取输入与权威顺序

### 2.1 本批实际消费的输入

| 输入 | 本批用途 | 当前限制 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 08 | Query 独立小节、request/response/view/marker、empty/visibility/freshness/degraded/failed/rebuilding/disabled/missing surface、错误、审计、Step 09 handoff 和停审 | 不把 shared carrier 当成 Q14 的字段来源闭合 |
| `详细设计书写规范.md` §5.6 / §5.7 | Rust DTO、response view 字段来源、repository key、稳定 identity、错误映射、Query no-write | 不在 Step 08 创建 Step 06/07 的第二 owner |
| `设计真相源闭环与可落码性标准.md` | same-committed-boundary、least-authority read、stable identity、P10/P11/P13、zero-write | 不用默认值或字符串解释补全缺口 |
| Step 06 `03_ddd_step_06_boundary_read_maintenance.md` | `MaintenanceProgressSummary`、`ObservationRebuildSurface`、`RebuildProgressView`、maintenance/replay/rollup state 和 identity relation | 当前字段与 factory 是上游 owner；Q14 只定义读取和映射 |
| Step 06 contracts / application input / operation context | `MaintenanceTargetRef`、`RebuildProgressViewRef`、`ProjectionMaintenanceRef`、`ReplayCoordinationRef`、`RollupRebuildRef`、`GetRebuildProgressInput` 和 operation `0x020E` | `GetRebuildProgressRequest` 当前只有 use-site，canonical public declaration 仍 affected |
| Step 07 `03_ddd_step_07_trait_port_adapter_contracts.md` | exact assembler、Read façade、`ObservationProjectionQueryStore` target/by-ref callable、writable version port 的排除 | Query 只能注入 read facet，不能消费 `Versioned` 或 full store |
| Step 08 shared carrier 与 Q13 current record | `ObservationQueryRequest<T>`、`ObservationQueryResult<T>`、`ObservationQueryResponse<T>`、public presence/availability/surface 和 no-write 规则 | 只复用公共载体，不复制 Q13 selector 或 reference state |
| L1-governance / L1-artifact Step 08 | 字段级协议粒度和逐协议停审格式 | 不复制相邻域的 target、state 或 truth 语义 |

### 2.2 权威顺序

```text
current Q14 record / Q14 affected register
  > Step 07 exact assembler, Read facade and Query facet
  > Step 06 RebuildProgressView / MaintenanceProgressSummary / state owners
  > S08-B shared Query request/result/surface carrier
  > current formal 02 and HLD query skeleton
  > frozen formal 03, old README and old Step 09 summary
```

旧正式 `03`、旧 Step 09 的 `no progress -> not found or fresh target surface` 摘要、README 中未闭合的 progress wording 均只作 historical material。它们不能覆盖 Step 06/07 当前 canonical owner；冲突处必须登记 affected 或 fail closed。

## 3. SOP 问题回答

| # | 问题 | Q14 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `GetRebuildProgress` |
| 2 | 协议族与模块 | S08-D Query；API assembler -> application Read façade -> projection Query facet |
| 3 | 调用方与处理方 | API exact handler 调用 `ObservationApiInputAssembler::get_rebuild_progress`，再调用 `ObservationReadService::get_rebuild_progress` |
| 4 | 传输方式 | typed logical Query request/response；HTTP/RPC locator 后置 Step 14 / `04` |
| 5 | request schema | 一个 required `target_ref: MaintenanceTargetRef`；不得增加 progress-ref、maintenance-ref、job-run 或 rollup-window 第二 selector |
| 6 | application input | target descriptor + shared trusted Query operation context；不带 writer version、policy authorization、job claim 或 resolver result |
| 7 | response schema | point `ObservationQueryResponse<RebuildProgressView>`；`ObservationQueryPresence::Empty` 非法 |
| 8 | repository key | `affected_projection.rebuild_progress.v1` + canonical `MaintenanceTargetRefId` lookup；加载后必须核对完整 target descriptor |
| 9 | view owner | Step 06 唯一 `contracts::views::RebuildProgressView`；Q14 不创建第二 view/ref/state owner |
| 10 | view fields | progress ref、freshness marker ref、target ref、恰一个 owner ref、rebuild surface、projection freshness、updated_at |
| 11 | progress body | `MaintenanceProgressSummary` 的 bounded count、failed refs 和 observation/reference dual watermark；不含百分比、run id、verdict 或 evidence alias |
| 12 | lifecycle | queued/running/completed/failed/blocked 由已加载 owner state 和 persisted progress projection losslessly映射；`Cancelled` 不能静默折叠 |
| 13 | missing | target 不存在、progress row 不存在、target 存在但尚未建立 progress、projection/read dependency 不可用必须保持不同语义；当前 shared missing surface 对 `NotStarted` 不完整，登记 affected |
| 14 | visibility | request metadata 只作为 P11 input；target 存在、state、progress ref 和 caller body 都不能直接授予 `Visible` |
| 15 | freshness | projection `Fresh/Stale/Rebuilding/Unknown` 由 persisted marker/provenance 提供；updated_at、row version、成功读取和 cursor 不能伪造 `Fresh` |
| 16 | degraded | P13 只做 response-only limited/blocked mapping；不创建 `DegradedOutputState` 或修改 progress |
| 17 | availability | local rebuild state、projection read dependency、marker/policy dependency、target index availability分别映射；不把 local `Failed` 映射成 store `Failed` |
| 18 | error precedence | malformed/target mismatch、visibility ceiling、typed absence、dependency unavailable、relation corruption 使用有限优先级；不以 first error 或 error text 选 surface |
| 19 | actor/metadata | actor、trace、visibility scope、consistency、requested_at 来自 trusted Query metadata；trace/requested_at不进入 target/progress identity |
| 20 | idempotency/audit | Query 无 reservation、stored result、Command replay outcome 或 durable read audit；如未来需要 read audit，必须是另行定义的 cross-cutting protocol |
| 21 | Step 09 handoff | 只保留一个 `GetRebuildProgressFlow`；本文件不展开函数级 flow |

## 4. Logical binding、request 与 normalized input

### 4.1 一个 point Query、一个 target selector

Q14 保留一个逻辑 Query，不新增 `GetRebuildProgressByRef`、`GetMaintenanceProgress`、`GetRollupRebuildProgress` 或 `WaitForRebuildProgress`。公共目标形态为：

```rust
/// Selects one immutable observation-side maintenance target.
pub struct GetRebuildProgressRequest {
    /// Complete validated target descriptor; lookup identity is its canonical local id.
    pub target_ref: MaintenanceTargetRef,
}
```

上面的 DTO 是 Q14 的目标协议形态，不在 Step 08 夺取 `contracts::queries` 的 canonical declaration owner。`target_ref` 必须存在、只能出现一次、必须是 current structured descriptor，并通过 `target_kind`、`target_object_ref`、`allowed_effect`、`no_write_guard_scope` 的上游兼容性校验。progress ref、maintenance ref、replay coordination ref、rollup rebuild ref、window ref、job run id 均不是 public selector。

Step 07 的 `get_rebuild_progress_by_ref(&RebuildProgressViewRef)` 只能作为 Query 内部 relation verification 或后续由其他 view 复用的 least-authority capability。把它提升为第二 public request variant 会产生两套 lookup authority、允许 progress identity 绕过 target/no-write binding，并破坏 Q14 的单一 cardinality；该风险登记为 `S08-D-Q14-OWNER-DISCRIMINATOR-01`。

### 4.2 Shared metadata、digest 与 operation

Q14 复用 `ObservationQueryRequest<GetRebuildProgressRequest>` 和 shared Query metadata：

| 字段 | source / digest | Q14 规则 |
|---|---|---|
| `query_name` | sealed body binding | 必须是 `GetRebuildProgress`；不能由 route、handler 名或字符串猜测 |
| `actor_ref` | trusted Query metadata，进入 Query material | 只表达调用主体；不从 target 或 progress ref 推导 |
| `visibility_scope_ref` | trusted metadata，进入 digest | P11 输入，不是 target scope，也不授予可见性 |
| `consistency` | trusted metadata，显式 enum | 只选择已提交 surface；不等待、刷新或重建 |
| `trace_ref` | trusted metadata，排除 target digest | 只作 correlation；不能进入 repository key、freshness 或 identity |
| `requested_at` | trusted metadata，排除 digest | 不能生成或排序 progress、marker、target 或 source revision |
| `target_ref` | typed body，完整 tagged payload进入 digest | lookup可使用 stable local id；digest不能只保留 id 而丢失descriptor校验材料 |

目标 operation code 已由 Step 06 固定为 `0x020E`。Q14 的 request digest 只用于 assembler/context integrity；它不进入 reservation、stored result、outbox、progress identity、freshness marker、job claim、cursor 或 history。目标 descriptor 的 digest material 不得包含 provider detail、raw body、external run id 或 evidence alias。

### 4.3 Normalized application input

当前 Step 06/07 use-site 只明确 `GetRebuildProgressInput` 的 `target_ref: MaintenanceTargetRef`，并由 shared Query input 承载 trusted operation context。目标 application-private 形态为：

```rust
pub(crate) struct GetRebuildProgressInput {
    /// Zero-key Query operation context created by the matching assembler.
    context: ObservationOperationContext,
    /// Complete caller target descriptor, retained for canonical equality checking.
    target_ref: MaintenanceTargetRef,
}
```

assembler 必须按以下顺序工作：

1. 校验 `query_name == GetRebuildProgress`、schema slot、metadata 必填项和 body cardinality。
2. 校验 `target_ref` 的 typed variant、完整字段、effect/guard compatibility 和 request digest。
3. 创建无 key、无 event identity、不可进入写 lane 的 Query context。
4. 将 target descriptor 传入 Read façade；不得在 entry 层查询 repository、补 progress ref 或构造 policy decision。

当前没有独立 canonical public declaration、sealed binding、unknown-field policy 和 decoder owner，故 request declaration 不能被视为无条件完成。

## 5. Exact call chain、port 与 repository key

### 5.1 Exact callable

| layer | exact contract |
|---|---|
| API assembler | `ObservationApiInputAssembler::get_rebuild_progress(ObservationQueryRequest<GetRebuildProgressRequest>) -> Result<GetRebuildProgressInput, ApplicationError>` |
| Read façade | `ObservationReadService::get_rebuild_progress(GetRebuildProgressInput) -> ApplicationServiceFuture<'_, ObservationQueryResult<RebuildProgressView>>` |
| Query facet, target path | `ObservationProjectionQueryStore::get_rebuild_progress(&MaintenanceTargetRef) -> ApplicationPortFuture<'_, Option<RebuildProgressView>>` |
| Query facet, relation path | `ObservationProjectionQueryStore::get_rebuild_progress_by_ref(&RebuildProgressViewRef) -> ApplicationPortFuture<'_, Option<RebuildProgressView>>` |
| writable version path | `ObservationProjectionStore::get_rebuild_progress_with_version(&MaintenanceTargetRef) -> ... Option<Versioned<RebuildProgressView>>`; Query must not receive or call it |
| later flow reservation | `GetRebuildProgressFlow` |

The target path is the only public Q14 lookup. The by-ref path may be called only after a persisted `progress_ref` has been loaded from a target-bound state/view and only to prove relation parity. A by-ref miss after a persisted reference is present is a consistency/reference failure, not a reason to return an empty or synthetic progress surface.

### 5.2 Repository key and stable identity

| item | canonical rule |
|---|---|
| projection family | `AffectedProjectionRef::RebuildProgress` / storage tag `affected_projection.rebuild_progress.v1` |
| logical lookup | `(rebuild-progress projection kind, MaintenanceTargetRefId)`; target kind/object/effect/guard are validated descriptor material, not a second selector |
| stable progress identity | `RebuildProgressViewRef`, generated when the target progress projection is first created and preserved across accepted replacement |
| stable marker identity | `ProjectionFreshnessMarkerRef`, generated by the projection owner and preserved across replacement |
| target identity | `MaintenanceTargetRefId` inside the canonical `MaintenanceTargetRef`; changes to kind/object/effect/guard require a new target identity |
| owner identity | exactly one of `maintenance_ref`, `replay_coordination_ref`, `rollup_rebuild_ref` is `Some`, selected by target/effect compatibility |
| forbidden lookup | progress ref alone as public selector, job run id, execution ref, window ref alone, target object ref alone, scope hash, latest timestamp, row version or request digest |

The repository must first resolve the canonical target binding, then compare the complete request descriptor with the committed target binding. Same local id with different descriptor is a typed target/consistency error, not a lookup miss. A repository adapter must return a complete committed view or a typed unavailable/consistency error; it must not return a partially populated `RebuildProgressView`.

## 6. Response view schema and field provenance

### 6.1 Public response

Q14 returns:

```rust
ObservationQueryResponse<RebuildProgressView>
```

The point response has exactly one of `Present`, typed `Missing`, `Unknown`/`NotVisible` surface, finite availability, or typed protocol/application error. `Empty` is invalid for this non-paged Query. The shared response wrapper owns outer presence, visibility, freshness, degraded, availability, missing, rebuild and error fields; `RebuildProgressView` owns the progress body. The application response assembler must copy or formally map fields from the one Read result and cannot query a second repository in the API handler.

### 6.2 `RebuildProgressView` field matrix

| view field | type / owner | source | required validation | forbidden substitution |
|---|---|---|---|---|
| `progress_ref` | `RebuildProgressViewRef`, `contracts::refs` | persisted progress projection identity | stable across replacement; relation key must resolve to same target | target id, job run id, row version, digest or timestamp |
| `freshness_marker_ref` | `ProjectionFreshnessMarkerRef`, `contracts::refs` | persisted projection marker | marker must belong to the same committed progress projection | new marker per read, cursor, updated_at or query time |
| `target_ref` | `MaintenanceTargetRef`, `contracts::refs` | canonical immutable target binding and view row | full descriptor equality, target kind/effect compatibility | caller body without canonical lookup, progress ref, scope hash |
| `maintenance_ref` | `Option<ProjectionMaintenanceRef>`, `contracts::refs` | loaded `ProjectionMaintenanceState` relation | Some only for projection-maintenance target; exact target relation | `MaintenanceTargetRef`, progress ref or job execution ref |
| `replay_coordination_ref` | `Option<ReplayCoordinationRef>`, `contracts::refs` | loaded `ReplayCoordinationState` relation | Some only for replay-driven target; approved scope relation checked elsewhere by owner | replay scope ref, maintenance ref or job run id |
| `rollup_rebuild_ref` | `Option<RollupRebuildRef>`, `contracts::refs` | loaded `RollupRebuildState` relation | Some only for signal-rollup rebuild target; window relation checked | signal rollup window ref, maintenance ref or progress ref |
| `rebuild` | `ObservationRebuildSurface`, `contracts::surfaces` | persisted owner state + stored `MaintenanceProgressSummary` | exhaustive state/optional-field matrix; no inferred variant | bool, percent, error text, current config, query-time observation |
| `freshness` | `ObservationProjectionFreshnessSurface`, `contracts::surfaces` | persisted marker/provenance for this projection | `Fresh` only with marker parity; `Unknown` retained | owner lifecycle, read success, updated_at, row version or cursor |
| `updated_at` | `ObservedAt`, core/contracts time | last local progress projection replacement | must be persisted and non-regressing within the owner | source event time, provider time, request time or cursor position |

### 6.3 `MaintenanceProgressSummary` field matrix

| summary field | source and semantics | rule |
|---|---|---|
| `total_items` | immutable target/plan capture | bounded count; not a source-record count unless the owner explicitly defines that target item set |
| `completed_items` | committed derived work inside the target boundary | `completed_items + failed_items <= total_items` |
| `failed_items` | committed failed/blocked target items | count must match `failed_refs` rules from Step 06; no free-text failure details |
| `observation_cursor` | observation namespace watermark reached by this progress | required only when target dependency declares observation namespace; never substituted for reference cursor |
| `reference_cursor` | reference namespace watermark reached by this progress | required only when target dependency declares reference namespace; never compared to observation cursor |
| `failed_refs` | bounded `BodyFreeRefSet` | explains failed/blocked target items without raw material, provider detail or evidence alias |

The summary has no percentage float, estimated duration, external run id, job claim, verdict, signoff, source-repair flag or raw error message. A cursor is a namespace watermark, not a start offset and not a generic `source_revision` identity. `updated_at` is local projection time and cannot replace either cursor.

### 6.4 Source revision and technical fence separation

Q14 distinguishes four different notions that must not be collapsed:

| notion | owner / use | public Q14 treatment |
|---|---|---|
| observation namespace watermark | `MaintenanceProgressSummary.observation_cursor` | expose only when declared and persisted by target owner |
| reference namespace watermark | `MaintenanceProgressSummary.reference_cursor` | expose only when declared and persisted by target owner |
| projection scope revision | `ProjectionScopeRevision` / repository fence | transaction-local replacement proof; not a public progress cursor |
| repository row version | `Versioned<T>` writer path | never exposed and never used as freshness/source revision |

There is no canonical single scalar source revision in `RebuildProgressView`. If a caller requires one, the protocol cannot synthesize it by taking the newest dual watermark, row version, timestamp or cursor encoding; the missing semantic is `S08-D-Q14-SOURCE-REVISION-01`.

## 7. Identity, owner and relation closure

### 7.1 Exactly-one owner relation

The view factory from Step 06 requires exactly one applicable owner identity. Q14 preserves that rule:

| target/effect family | expected owner ref | expected source state | invalid result |
|---|---|---|---|
| projection maintenance | `maintenance_ref: Some`, other two `None` | `ProjectionMaintenanceState` | typed relation/consistency error |
| replay-driven coordination | `replay_coordination_ref: Some`, other two `None` | `ReplayCoordinationState` | typed relation/consistency error |
| signal rollup rebuild | `rollup_rebuild_ref: Some`, other two `None` | `RollupRebuildState` | typed relation/consistency error |
| no applicable owner | all three `None` | no progress attempt or incomplete row | typed absence only when a complete absence proof exists; otherwise consistency error |
| multiple owner refs | two or three `Some` | contradictory truth sources | typed consistency error; no partial body |

The target descriptor is immutable and does not contain execution state. A progress row cannot change target kind/effect/guard in place. A changed binding requires a new target identity and a new progress identity; Q14 does not repair or migrate such a row.

### 7.2 Relation checks required before body mapping

The same committed read boundary must establish all of the following:

1. request target descriptor equals canonical target binding;
2. target kind/effect is compatible with the one owner state type;
3. persisted `progress_ref` equals the view identity and is stable;
4. owner state target equals view target exactly;
5. owner state progress ref, when present, equals view progress ref;
6. `MaintenanceProgressSummary` namespace fields match the target's immutable dependency namespace set;
7. freshness marker belongs to this projection row and has the persisted marker parity needed for its surface;
8. `updated_at` and state/surface conditional fields satisfy their owner matrix;
9. any `failed_refs` are bounded body-free references with no external/provider leakage;
10. no extra owner ref, run id, evidence alias or report signoff field is present.

Missing any one of these proofs is not permission to use a caller field, another repository row, a latest timestamp or a default state.

## 8. Lifecycle and public surface matrix

### 8.1 Owner lifecycle to `ObservationRebuildSurface`

The following is a response mapping target, not a new state machine. The owning state remains the sole transition authority.

| persisted owner state | public rebuild surface | required material | Q14 rule |
|---|---|---|---|
| `ProjectionMaintenanceState::Rebuilding` | `Running(summary)` | matching progress row, target binding, dual watermark compatibility | do not wait or advance; missing progress relation is consistency failure |
| `ProjectionMaintenanceState::Fresh` or `Stale` with no progress attempt | no synthetic surface; typed not-started/missing path | typed target existence plus authoritative absence proof | shared `ObservationMissingSurface` has no dedicated `NotStarted`; use `NotYetProjected` only with exact proof and keep affected open |
| `ProjectionMaintenanceState::Failed` | `Failed(summary)` when stored failed progress is complete | failure-compatible summary and owner relation | does not imply source failure or source repair; missing failed progress is consistency failure |
| `ReplayCoordinationState::Pending` | `Queued` | committed owner relation; no progress summary required by `Queued` | does not imply a job has been claimed or started |
| `ReplayCoordinationState::Coordinating` | `Running(summary)` | complete stored summary and target relation | no execution wait or retry decision |
| `ReplayCoordinationState::Blocked` | `Blocked { reason, progress }` | typed `MaintenanceBlockReason` and summary | reason is finite and body-free; no compensation action |
| `ReplayCoordinationState::Completed` | `Completed(summary)` | completed summary and cursor compatibility | derived coordination completion only |
| `ReplayCoordinationState::Failed` | `Failed(summary)` | failed summary and failed refs | no source/business failure claim |
| `RollupRebuildState::Pending` | `Queued` | committed rollup owner relation | does not mean a schedule or job claim exists |
| `RollupRebuildState::Running` | `Running(summary)` | summary mapped from the saved safe-signal cursor/count boundary | raw metric/trace input is forbidden |
| `RollupRebuildState::Completed` | `Completed(summary)` | committed count/cursor mapped to bounded summary | does not mean raw signal repair or business success |
| `RollupRebuildState::Failed` | `Failed(summary)` | failure-compatible summary and reason relation | no provider message or external run id |
| `RollupRebuildState::Cancelled` | no current Q14 surface | `ObservationRebuildSurface` has no `Cancelled` variant | fail closed with typed unsupported/consistency result; do not map to Failed, Queued or Completed |

The exact `ProjectionMaintenanceState::Fresh/Stale` to progress absence behavior, and the missing `NotStarted` public variant, remain affected rather than being silently normalized. A target being stale is not proof that a rebuild attempt exists; a fresh projection is not proof that a progress row exists.

### 8.2 Projection freshness is an independent axis

`RebuildProgressView.rebuild` and `RebuildProgressView.freshness` are independent. The following combinations remain valid and must be expressible:

| rebuild surface | projection freshness | meaning |
|---|---|---|
| `Running(summary)` | `Rebuilding` | an active derived replacement is visible and marker ceiling says rebuilding |
| `Running(summary)` | `Stale` | progress is persisted but projection marker remains behind |
| `Completed(summary)` | `Fresh` | derived target reached its captured boundary and marker parity proves current projection freshness |
| `Completed(summary)` | `Stale` | attempt completed for its captured boundary but newer source changes left projection stale |
| `Queued` | `Stale` | an owner execution is pending while projection is behind |
| `Failed(summary)` | `Stale` or `Unknown` | failed attempt does not upgrade freshness |
| `Blocked { .. }` | `Stale` or `Unknown` | policy/no-write boundary blocks derived work; no freshness upgrade |

`Fresh` requires persisted marker parity over the exact projection boundary. It cannot be derived from `Completed`, `updated_at`, a successful repository call, row version, owner state, or the presence of a cursor. `Unknown` is retained when the marker/provenance cannot establish a safe ceiling; it cannot be upgraded by Q14.

### 8.3 Required public cases

| case | public outcome |
|---|---|
| visible relation-valid progress row | `Present` + exactly one `RebuildProgressView` |
| target exists, no progress attempt, exact not-started/absence proof | `Missing` + `NotYetProjected` only if the proof matches shared missing semantics |
| target itself absent and existence may be disclosed | `Missing` + `NotFound` |
| existence or progress is hidden by P11 | `Unknown` / `NotVisible`, without progress or target body |
| projection read/index unavailable | finite `ObservationAvailabilitySurface` or typed dependency error; never `Missing` |
| persisted progress ref has no row | typed consistency/reference error, not `Queued` or `Empty` |
| target/view/owner/marker relation corrupt | typed consistency error; no partial body |
| local owner state is `Failed` | visible local `Failed(summary)` if the full row is valid; not Query dependency `Failed` |
| target kind is disabled by policy/config | disabled/blocked surface only when a trusted committed policy/provenance source exists; no current-config probe |
| point query returns zero rows without typed proof | typed missing/availability/consistency result according to source; never `Empty` |

## 9. Same-boundary read algorithm

Q14 requires a bounded, read-only `RebuildProgressPointBundle` or equivalent carrier. The carrier is a design requirement for Step 06/07 repair, not a new Step 08 owner. It must expose only the material needed to build the public view:

```rust
struct RebuildProgressPointBundle {
    target: MaintenanceTargetRef,
    progress: Option<RebuildProgressView>,
    owner_relation: RebuildProgressOwnerRelation,
    freshness: ObservationProjectionFreshnessSurface,
    visibility_source: ReadVisibilitySourceSnapshot,
    absence: Option<RebuildProgressAbsenceProof>,
    availability: ObservationAvailabilitySurface,
}
```

The exact Rust owner and fields remain affected. The required read sequence is:

1. Rehydrate and validate the request target descriptor without treating it as authorization.
2. Resolve the canonical immutable target binding by its stable target identity.
3. Read the committed progress projection by target key through `ObservationProjectionQueryStore`.
4. If a persisted owner state supplies a `progress_ref`, verify that ref through the by-ref capability and compare the complete target/owner relation.
5. Load only the committed marker/provenance and visibility inputs needed by the view mapper; do not call source readers, resolver, full store or writer version port.
6. Validate owner-ref cardinality, state/surface matrix, summary counts, namespace cursors, marker parity and `updated_at` before mapping the response.
7. Apply P10/P11/P13 response-only mapping and the finite presence/availability precedence.
8. Return one complete result or one typed surface/error. Never return a partial view or silently retry/repair.

N+1 lookup, cross-transaction stitching, current source scan, full UoW, writer `Versioned<T>`, `get_*_with_version`, current-config read, resolver fallback and `first row wins` are prohibited. The Query service receives `Arc<dyn ObservationProjectionQueryStore>` only and cannot downcast it to `ObservationProjectionStore`.

## 10. P10 / P11 / P13 boundary

### 10.1 P10 no-write target

P10 must bind the exact read target to the operation `GetRebuildProgress`, effect `ReadCommittedSurface`, target descriptor and the trusted request context. The current `ReadEvaluationTargetRef` vocabulary does not yet prove a target-bound progress lookup plus not-started/absence anchor without either an overly broad `Maintenance` target or a new finite target variant. This is `S08-D-Q14-POLICY-TARGET-01`; Q14 must not cast `MaintenanceTargetRef` into an unrelated `ObservationObjectRef`, skip P10, or let target descriptor fields act as authorization.

P10 success means only that the Query is limited to a committed observation-side read. It does not authorize rebuild start, resume, progress, repair, source access, external access or report publication.

### 10.2 P11 visibility

P11 consumes a trusted one-shot context, request `VisibilityScopeRef`, exact target, persisted source visibility provenance, projection freshness and current gap revisions. It may preserve or narrow the committed surface; it cannot widen `NotVisible`, `Restricted` or `Blocked` to `Visible`.

The following are not visibility authority:

- caller-supplied target fields or progress ref;
- target existence, owner state, progress counts or `failed_refs`;
- `Fresh`, `Completed`, `Running` or `Queued` state names;
- actor kind guessed from the request body;
- row version, cursor, updated_at, route, HTTP status or repository exception.

If the trusted context or exact target-bound provenance is missing, Q14 fails closed. It must not derive context from target, progress, trace, digest or requested time.

### 10.3 P13 degraded mapping

P13 is response-only. It may map a complete target-bound P11 decision, explicit safety input, current gap revisions and persisted progress/freshness material to a limited or blocked public response. It must not:

- create or replace `DegradedOutputState`;
- append or close a `GapState`;
- clear failed refs or change progress counts;
- turn a missing progress row into a degraded successful view;
- use `MaintenanceBlockReason` as a source-repair verdict;
- convert `Completed` into report readiness, evidence authenticity or acceptance.

If the P13 input is incomplete, Q14 returns a finite restricted/unknown/error result according to the shared mapper; it does not guess a degraded reason from state, count, error text or availability.

## 11. Error, absence and availability precedence

Q14 uses the following precedence after transport decoding. This is a mapping order, not an invitation to probe each layer after a failure:

| order | condition | public mapping |
|---:|---|---|
| 1 | malformed schema, unknown operation/body variant, missing target, invalid digest or invalid typed descriptor | `InvalidRequest` / typed protocol error; no repository read |
| 2 | trusted context or P10/P11 target/provenance cannot be established | fail closed as `Unknown`/`NotVisible` or typed policy error; do not disclose target existence |
| 3 | policy explicitly hides existence | `Unknown`/`NotVisible`; no target, owner ref, count, cursor or marker body |
| 4 | exact target absence with safe disclosure proof | `Missing(NotFound)` |
| 5 | target exists but a typed not-started/not-yet-projected proof exists | `Missing(NotYetProjected)`; no synthetic `Queued` |
| 6 | projection/index/marker dependency unavailable or disabled | finite availability surface with exact `AdapterFamily`, or typed dependency error; not Missing |
| 7 | progress ref, owner ref, marker, target, summary or cursor relation is contradictory | `ConsistencyFailure` / typed reference error; no partial body |
| 8 | complete visible material passes all checks | `Present` with one view and exact independent freshness/rebuild surfaces |

When multiple dependencies fail, the exact Q14 mapper must use a finite fixed precedence or a typed composite dependency source supplied upstream. It may not return the first error, parse exception text, use a timeout as `NotFound`, or map local `RebuildProgressSurface::Failed` to `ObservationAvailabilitySurface::Failed`.

The shared `ObservationMissingSurface` currently has `NotFound`, `NotYetProjected`, `OutsideRetainedObservationWindow` and `SourceReferenceUnavailable`, but no explicit `NotStarted` variant. Q14 therefore cannot claim a complete missing/not-started contract until the upstream carrier or a precise existing proof is selected.

## 12. Redaction, audit, idempotency and no-write

### 12.1 Body-free output and redaction

Q14 may expose only typed refs, finite enum values, bounded counts, dual watermarks, local observed time, marker identity and typed gap/failure refs permitted by the public view. It must redact:

- raw log, metric, trace, audit and evidence content;
- provider response, endpoint, credential, adapter detail and network message;
- external job/run identifiers or scheduler claims;
- evidence aliases, report verdicts, signoff or acceptance identities;
- arbitrary failure strings and SQL/repository keys outside the typed public key contract.

`failed_refs` and `gap_refs` remain body-free references. A ref is not evidence that the referenced object is visible; P11 still controls disclosure.

### 12.2 Query idempotency and audit

Repeated Q14 calls are ordinary reads. They do not create Command-style replay outcomes, idempotency reservations, stored results, outbox entries, read-access records or audit events. `trace_ref` is copied only as correlation metadata where the outer transport requires it; it is not a durable audit fact and does not alter the response.

If a future cross-cutting read-audit requirement is introduced, it must define its own event schema, actor authority, retention and no-business-truth boundary. Q14 must not silently add that side effect.

### 12.3 Explicit zero-write matrix

| capability | Q14 access |
|---|---|
| `ObservationUnitOfWorkManager` | unavailable |
| `ObservationProjectionStore` writer methods | unavailable |
| `get_rebuild_progress_with_version` | unavailable to Query service |
| start/resume/wait/advance/cancel/complete/fail/rebuild methods | unavailable |
| source/business truth repositories | unavailable |
| resolver and external adapters | unavailable |
| gap/marker/degraded/report/outbox writers | unavailable |
| current-config or scheduler/job-claim reader | unavailable |

## 13. Step 09 handoff reservation

Q14 reserves exactly one later flow label:

```text
GetRebuildProgressFlow
```

The later flow must be able to reference the following exact chain without inventing a second Query:

```text
API exact handler
  -> ObservationApiInputAssembler::get_rebuild_progress
  -> ObservationReadService::get_rebuild_progress
  -> ObservationProjectionQueryStore::get_rebuild_progress(target_ref)
  -> optional get_rebuild_progress_by_ref(progress_ref) for persisted relation proof
  -> finite target/owner/state/summary/marker mapper
  -> P10 -> P11 -> response-only P13
  -> ObservationQueryResult<RebuildProgressView>
  -> ObservationQueryResponse<RebuildProgressView>
```

The flow must explicitly show no UoW, no writer version, no rebuild command, no wait loop and no source/business truth write. It must not use the historical Step 09 `ReferenceMaintenanceRepository.list_maintenance_by_scope` as a substitute for the exact target-bound progress lookup; that old summary is historical and the current Query facet is authoritative for Q14.

## 14. Affected register

All entries below remain open. Their presence means Q14 is `defined_with_affected_open`, not unconditionally complete.

| ID | status | affected point | required upstream repair / later closure |
|---|---|---|---|
| `S08-D-Q14-REQUEST-SCHEMA-01` | `open_upstream_internal` | request only has Step06/07 use-site; canonical public declaration, wire schema, sealed binding, unknown-field rule and decoder owner are not closed | Step06/07 choose one `GetRebuildProgressRequest` owner and propagate exact binding |
| `S08-D-Q14-SELECTOR-CARDINALITY-01` | `open_internal_affected` | target requiredness and rejection of progress/owner/window secondary selectors lack one normalized carrier | assembler/application implement exhaustive one-target normalization |
| `S08-D-Q14-TARGET-LOOKUP-KEY-01` | `open_internal_affected` | target callable is observed, but stable-id lookup plus full descriptor equality and same-id/different-shape error contract are not one bounded source | Step07/infra define target-bound lookup carrier and mismatch mapping |
| `S08-D-Q14-POINT-READ-BUNDLE-01` | `open_internal_affected` | `Option<RebuildProgressView>` cannot prove target, owner, summary, marker, freshness, visibility, absence and availability share a committed boundary | provide least-authority `RebuildProgressPointBundle` or equivalent |
| `S08-D-Q14-IDENTITY-RELATION-01` | `open_internal_affected` | progress/marker/target/owner identity parity and replacement stability lack Query-safe proof | repository relation carrier and rehydration checks |
| `S08-D-Q14-OWNER-DISCRIMINATOR-01` | `open_internal_affected` | target lookup and progress-by-ref capability could be misread as two public selectors; exactly-one owner relation is not encoded in the current Query input | keep one target Query and bind by-ref to internal verification only |
| `S08-D-Q14-SUMMARY-SOURCE-01` | `open_internal_affected` | stored `MaintenanceProgressSummary` source, count/ref parity and state-specific optionality are not exposed by current Query facet | Step07 selects a lossless persisted summary carrier |
| `S08-D-Q14-DUAL-WATERMARK-01` | `open_internal_affected` | observation/reference namespace requirements and cursor non-substitution are not proven by `Option<RebuildProgressView>` | bind target dependency namespace set to persisted summary validation |
| `S08-D-Q14-SOURCE-REVISION-01` | `open_internal_affected` | no canonical single source revision exists; technical scope revision, row version and dual namespace cursors have different owners | retain dual watermarks or define an upstream typed source-revision contract; never derive one |
| `S08-D-Q14-LIFECYCLE-MAPPER-01` | `open_internal_affected` | projection/replay/rollup owner state to queued/running/completed/failed/blocked mapping is not a unique lossless mapper | Step07/application define exhaustive state mapper and conditional fields |
| `S08-D-Q14-CANCELLED-SURFACE-01` | `open_internal_affected` | `RollupRebuildKind::Cancelled` has no `ObservationRebuildSurface` variant | reserve typed unsupported/consistency mapping or upstream public surface extension |
| `S08-D-Q14-MISSING-PRESENCE-01` | `open_internal_affected` | target absent, progress absent, not-started and not-yet-projected cannot all be represented by current shared missing variants | define typed absence proof and preserve no-synthetic-Queued rule |
| `S08-D-Q14-FRESHNESS-SOURCE-01` | `open_internal_affected` | marker parity and progress freshness are not supplied by the target Query callable as a same-boundary proof | provide persisted marker/provenance source; no time/row-version fallback |
| `S08-D-Q14-POLICY-TARGET-01` | `open_upstream_internal` | current P10 target vocabulary does not precisely express target-bound progress read plus safe absence anchor | add finite target/absence carrier or explicitly bind a reviewed maintenance read target |
| `S08-D-Q14-REQUEST-CONTEXT-CARRIER-01` | `open_upstream_internal` | shared Query input has no Q14-specific trusted non-body context/provenance location beyond generic metadata | Step06/07 close context lifetime, scope, digest and P11 source binding |
| `S08-D-Q14-VISIBILITY-SOURCE-01` | `open_internal_affected` | target existence, owner state, marker and gap provenance are not yet connected to one-shot P11 input | define visibility source and fail-closed disclosure matrix |
| `S08-D-Q14-DEGRADED-SOURCE-01` | `open_internal_affected` | exact P13 target, complete P11 decision, explicit safety and current gap revisions lack a Q14 mapper | define response-only limited/blocked mapping; no durable degraded write |
| `S08-D-Q14-AVAILABILITY-SOURCE-01` | `open_internal_affected` | projection index, marker, policy and target lookup availability lack a finite source-to-surface mapping | bind exact `AdapterFamily`/typed dependency source |
| `S08-D-Q14-ERROR-PRECEDENCE-01` | `open_internal_affected` | multiple failure precedence is not encoded in shared `ObservationQueryResult<T>` | provide finite Q14 mapper; never first-error or error-text selection |
| `S08-D-Q14-STEP09-FLOW-CARRIER-01` | `open_internal_affected` | current Step09 summary names an outdated maintenance-scope read and lacks the Q14 point-bundle handoff | Step09 must consume exact target Query facet and preserve no-write chain |
| `S08-D-Q14-REHYDRATION-PARITY-01` | `open_internal_affected` | persisted view/marker/summary/owner rows lack one explicitly observed Query-safe rehydration parity contract | Step07/infra add checked rehydration and whole-row failure semantics |

### 14.1 Affected count check

| category | count |
|---|---:|
| `open_upstream_internal` | 3 |
| `open_internal_affected` | 18 |
| total Q14 affected | 21 |

No new external upstream blocker was found in this Q14 read. Known `R06.6-F2-H13-UPSTREAM=open_controlled` remains open but is unrelated to this Query; Q14 does not reinterpret or close it.

## 15. Q14 stop review

| stop item | conclusion |
|---|---|
| independent request/input/response/view/field-source/read-chain record | `pass_with_affected_open` |
| one logical point Query and one target selector | target shape defined; request/cardinality owner affected |
| exact assembler and Read façade | observed exact callables recorded; normalized input and response carrier affected |
| target lookup key and stable identity | target rule defined; complete target binding/relation proof affected |
| unique `RebuildProgressView` owner | pass by reuse of Step06 owner; Q14 creates no second view/ref/state owner |
| exactly-one maintenance/replay/rollup owner relation | target behavior defined; current carrier and rehydration proof affected |
| progress summary counts, failed refs and dual watermarks | invariants recorded; persisted source and mapper affected |
| source revision semantics | dual namespace watermarks separated from fence/row version; no scalar fabricated; affected remains open |
| queued/running/completed/failed/blocked/cancelled surface | target matrix defined; cancelled and not-started gaps affected |
| independent projection freshness | pass_design_record; marker/provenance source affected |
| P10/P11/P13 separation | target behavior defined; exact target/context/provenance and response mapper affected |
| missing/unknown/not-visible/availability/error precedence | finite target matrix recorded; exact carrier/mapper affected |
| redaction, actor, idempotency, audit and zero-write | boundary fixed; no durable side effect introduced |
| one Step09 handoff | `GetRebuildProgressFlow` only; downstream carrier remains affected |
| all 21 Q14 affected registered | pass |
| new external upstream blocker | none; known H13 blocker remains unrelated |
| current protocol count | `30/60 defined_with_affected_open`; Query `14/14`; `0/60` unconditional complete |
| next action | stop and wait for explicit user confirmation before S08-E |

Q14 is design-only discussion material. It does not modify formal `03`, does not claim implementation/test/acceptance evidence, and does not create a commit.

## 16. Current recovery and formal-document boundary

当前恢复点为：

```text
Step08_S08-D_Q14_defined_with_affected_open_waiting_user_before_S08-E
```

未经用户再次确认，不得读取或写入 S08-E~G、Step 09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。
