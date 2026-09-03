# L2-member-images 03 详细设计 Step 10：状态机与转换矩阵

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10  
> 对应书写规范：`standards/document/详细设计书写规范.md` §5.9  
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`；仅复用“逐状态机—矩阵—停审—跨审计”方法，不继承其治理、outbox、publisher、报告或签收语义。  
> 当前模式：`full-restart`；旧正式 `03-详细设计.md` 未读取且不可作为本 Step authority。  
> 当前状态：`completed_stop_review`；Step 10 的全部状态族、转换矩阵、跨状态机审计与回填草稿已完成；已停审，等待用户确认后方可进入 Step 11。

## 0. Step 开工确认与模块级台账

| 项目 | 记录 |
|---|---|
| Step | Step 10：定义状态机与转换矩阵。 |
| 输出文件 | `projects/L2-member-images/design-calibration/03_ddd_step_10_state_matrices.md`。 |
| 已读取通用规范 | 已读取 `设计文档讨论中间产物规范.md`、`设计文档编写通则.md`、`设计真相源闭环与可落码性标准.md`；本文件不替代其真相源、phase boundary 与证据规则。 |
| 已读取本 Step 规范 | 已读取详细设计 SOP Step 10 与书写规范 §5.9。 |
| 已读取前序输入 | 已读取项目/文档台账、`02_hld_step_09_state_machine.md`、Step 6~9；尤其读取 Step 9 的 `DDD-S9-B01/B02` stop rule。 |
| 当前模式与边界 | 单 agent、full-restart；只写本项目 calibration。不得实现、不得写正式 03、不得提交。 |
| 当前写入类型 | Step 10 全量状态主语筛选、逐状态机转换矩阵、跨状态审计与回填草稿；仍不写正式 03。 |
| 写入前检查 | 项目级与文档级均允许 Step 10；每个状态族已按“思考→写入→停审”分批完成；无正式正文污染；单次 patch 只是审查批次而非内容上限。 |

| 批次 / 状态族 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| 10.0 状态主语筛选与批次 | done | done | done | done | done | done | pass | 已由 Step 回填草稿承接。 |
| 10.1 DefinitionAssembly | done | done | done | done | done | done | pass | 已完成。 |
| 10.2 BuildCandidate | done | done | done | done | done | done | pass_with_blocker | 已完成；B01/B02/Q-MI-003 保留。 |
| 10.3 Qualification | done | done | done | done | done | done | pass_with_blocker | 已完成；Q-MI-004/MI-UP-007 保留。 |
| 10.4 SupplyEntry | done | done | done | done | done | done | pass_with_blocker | 已完成；MI-UP-001/B01/B02 保留。 |
| 10.5 ReferenceDerived | done | done | done | done | done | done | pass_with_blocker | 已完成；formal resolution/source/recovery 保留。 |
| 10.6 application / entry technical | done | done | done | done | done | done | pass_with_blocker | 已完成；B01/B02/MI-UP-005 保留。 |
| 10.7 cross-machine audit / 回填 / 停审 | done | done | done | done | done | done | pass | 仅允许完成 Step 10 停审，等待用户确认 Step 11。 |

## 1. 本步目标、输入与不可越界边界

### 1.1 本步目标

将 Step 6 的 lifecycle enum、对象函数，和 Step 8/9 的协议/flow 意图逐个对齐为可写校验代码的矩阵。每个矩阵必须同时说明：

1. 状态属于哪个本仓对象，而非哪个外部 owner、运行时 process 或产品。
2. 未来在已重开写路径后可以怎样调用已有函数。
3. 在 `DDD-S9-B01/B02`、`MI-UP-*`、`Q-MI-*` 尚未闭合的当前 boundary 中，哪些边绝对不可达。

本 Step 不新增 lifecycle enum、外部合同、真实 digest、artifact、evidence、readiness、运行结果、outbox/publisher 或 scheduler/job report。

### 1.2 输入承接表

| 输入 | 本 Step 承接内容 | 不继承 / 不推导 |
|---|---|---|
| `02_hld_step_09_state_machine.md` | 五条局部状态轴、禁止总生命周期、append/new-context 恢复方向。 | 不把概要层语义直接当作具体方法或当前可执行事实。 |
| Step 6 对象契约 | enum、factory、成员函数、字段前置、不变量与 `DomainError::InvalidTransition`。 | 不将 `SafeDisposition`、分类 enum 或 ref/value object伪装为独立状态机。 |
| Step 7 port 契约 | future loaded-local-truth / safe seam 的读写边界。 | 不把 port 名称当成现在已经可以调用的 adapter 或持久化事实。 |
| Step 8 协议契约 | logical command/query/inbound/job 名称与 `ImageProtocolErrorKind::InvalidTransition` 映射。 | 不新增 route、topic、envelope、receipt、outbound event。 |
| Step 9 函数流 | 当前读写上限、B01/B02、query no-write、conditional inbound marker-only、bounded job 限制。 | 不把“future mapping”写成当前 transaction、mutation 或副作用。 |

### 1.3 当前写路径的强制解释

`DDD-S9-B01`（缺 concrete `CanonicalImageOperationInput` / mapper）和 `DDD-S9-B02`（缺 `ImageOperationResultRef` 合法构造）使所有 10 条 Command 与 6 个 Job 当前只能停在 metadata/context 或 boundary marker。因而本文件内出现的 Command/Job 名称仅是**未来重开后的触发来源**；它们目前不产生 factory、状态迁移、UoW、repository save、trace、gap、projection、stored result、external adapter 或 outbound。

Query 可读取既有 local truth，但不改变 lifecycle。条件 inbound 只有 `InboundContractMarker` disposition，`accepted_input=false`。所有非法转换仍统一由 Step 6 `DomainError::InvalidTransition(SafeReason)` 承接，并在 Step 8 映射为 `ImageProtocolErrorKind::InvalidTransition`；本 Step 不补造错误 factory 或恢复实现。

## 2. SOP 问题回答、诊断与设计取舍

### 2.1 SOP 问题回答

| SOP 问题 | 回答 |
|---|---|
| 哪些对象进入状态矩阵？ | 只进入 Step 6 已定义 lifecycle enum 且 Step 9 flow 会读取、推进、暴露或重开映射的对象：DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived、idempotency 与 inbound marker。 |
| 哪些候选必须排除？ | 分类 enum、typed ref/ID、DTO/page/read content state、trace、纯 guard/value object、`ImageDerivedReadModel`、job action marker 均不具独立 lifecycle，不进入。 |
| 是否存在全局 image lifecycle？ | 不存在。definition、build、qualification、supply、consumer handoff、reference 与 projection 分属不同 subject；跨关系只通过 ref、guard、gap、history 或 read-only projection 表达。 |
| 触发函数怎样回指？ | 每行回指 Step 6 factory/member，且注明 Step 9 future flow、query 或 marker-only boundary。不能回指一个未定义的 generic state setter。 |
| 如何表达当前 blocker？ | `当前实际可达` 明确为零写入或 marker-only；`future/reopen` 只在 B01/B02 和相关上游合同关闭后才可实施。不得把 blocker 本身持久化成 `ContractGap`。 |
| 非法转换如何处理？ | 已有 domain function返回 `DomainError::InvalidTransition`，对象字段不变；Step 8 public mapping 为 `InvalidTransition`。是否记录 rejected trace/audit、事务恢复和重试归 Step 11~13/Step 12，不在此伪造。 |

### 2.2 当前材料诊断

| 诊断项 | 发现 | 本 Step 处置 |
|---|---|---|
| HLD 正向图过于连续 | 概要图展示 definition→build→qualification→supply 主线，但不能覆盖每个对象的 terminal/history/replacement 规则。 | 按对象拆矩阵，不画全局总状态机。 |
| Step 6 含多个“状态样”类型 | `SafeDisposition`、`BuildResultKind`、`AvailabilityTransitionKind`、`ImageJobActionKind` 是分类或 guard 输入。 | 筛除，不增加新全局 machine。 |
| Step 6/9 future mapping 与 current stop 并存 | future object方法已经命名，但 B01/B02 使当前写路径不可达。 | 每个 batch 以“future/reopen”与“当前实际可达”两栏区分。 |
| replacement 字段与 enum 不完全同构 | `GateEvaluation`、`EligibilityDecision`、`BuildAttempt` 等有 `superseded_by`，但 enum未必有 `Superseded` 变体。 | replacement 是跨对象历史关系，不擅自增加 enum variant；单独记录为状态机缺口/限制。 |
| 上游正向合同未闭合 | Builder/registry、gate/evidence、Artifact、Member Service、inbound event 仍 pending。 | 对应 `Succeeded/Passed/Eligible/Accepted/Resolved` 等只写为 future reserved 条件，绝不作为现况。 |

### 2.3 设计取舍

| 取舍 | 采用 | 未采用 | 原因 |
|---|---|---|---|
| 状态组织 | 每个 lifecycle owning object 一张矩阵。 | 一个 image “总状态机”。 | 后者会混淆 local truth、handoff、projection 与 consumer/runtime。 |
| 状态副作用 | domain object只改自身字段；未来 application flow协调 local save/history/trace；当前 B01/B02 为零写。 | 在每条状态边中默认写 outbox、publisher、report。 | 本仓无 outbound authority，且 Step 9 明确 inventory 为零。 |
| 失败/恢复 | 保持 terminal、replacement/new context、fail-closed。 | 原地回退、默认重试、tag/latest 回填。 | 保证 immutable input、unknown 和外部 owner 边界不被绕过。 |
| technical state | 只纳入已有 flow 推进的 idempotency/inbound marker；infra assembly/config 标为 deferred。 | 把所有 marker、slot、fake state都写成 Step 10 machine。 | 后者没有 Step 9 flow，且会伪造 runtime lifecycle。 |

## 3. 状态主语筛选与状态族分组

### 3.1 状态主语筛选表

| 候选主语 | 来源对象 / 字段 | 是否进入 Step 10 | 原因 | 状态族 |
|---|---|---:|---|---|
| `ImageFamilyDefinition` | `lifecycle: DefinitionLifecycle` | 是 | local family 有 factory/member 方法与 Definition flow。 | DefinitionAssembly |
| `ImageVariantDefinition` | `lifecycle: DefinitionLifecycle` | 是 | local variant 独立 identity、mapping binding、revision pointer。 | DefinitionAssembly |
| `AssemblyBaseline` | `completeness: BaselineCompleteness` | 是 | immutable baseline 有 capture/guard/supersede 语义。 | DefinitionAssembly |
| `VariantRevision` | `lifecycle: VariantRevisionLifecycle` | 是 | revision 有 propose/validate/supersede 与 build-intent 前置。 | DefinitionAssembly |
| `MappingSourceSnapshot` | `validity: ReferenceValidity` | 否（并入） | 它是同一 `ReferenceValidity` 状态轴的定义专用载体；避免复制一张同 enum矩阵。 | ReferenceDerived |
| `SeedPlacementBinding` | `validity: ReferenceValidity` | 否（并入） | embedded value binding，无独立 history/factory lifecycle；由 ReferenceValidity 统一解释。 | ReferenceDerived |
| `ComponentPinSet` | `disposition: SafeDisposition` | 否 | guard结论 value object，无独立 lifecycle；只作为 baseline前置。 | not_applicable |
| `BuildIntent` | `lifecycle: BuildIntentLifecycle` | 是 | local intent 有 request/accept/pending/block/cancel。 | BuildCandidate |
| `BuildInputSnapshot` | `lifecycle: BuildSnapshotLifecycle` | 是 | immutable snapshot 有 capture/validate，输入变更需要新 context。 | BuildCandidate |
| `BuildAttempt` | `lifecycle: BuildAttemptLifecycle` | 是 | 外部副作用本仓观察有 handoff/outcome/unknown/replacement 规则。 | BuildCandidate |
| `BuildOutcomeConclusion` | `result_kind: BuildResultKind` | 否 | 外部结论分类，不是可变 lifecycle；只驱动 attempt/candidate。 | not_applicable |
| `CandidateImage` | `lifecycle: CandidateLifecycle` | 是 | candidate stage local truth 具 form/reject/block/unknown。 | BuildCandidate |
| `ProvenanceBinding` | `lifecycle: ProvenanceLifecycle` | 是 | source-chain completeness 有 verify/conflict。 | Qualification |
| `GateEvaluation` | `lifecycle: GateEvaluationLifecycle` | 是 | local gate evaluation 有 open/conclusion/close。 | Qualification |
| `EligibilityDecision` | `lifecycle: EligibilityLifecycle` | 是 | image-domain eligibility 有 decide/evaluate。 | Qualification |
| `ArtifactHandoffRecord` | `lifecycle: ArtifactHandoffLifecycle` | 是 | local handoff observation有 pending/gap/conditional accepted。 | Qualification |
| `AvailabilityTransition` | `lifecycle: AvailabilityTransitionLifecycle` | 是 | append-only local supply history 有 propose/commit/reject/supersede。 | SupplyEntry |
| `InstantiableEntry` | `lifecycle: InstantiableEntryLifecycle` | 是 | local pinned entry 有 create/publish/supersede/retire。 | SupplyEntry |
| `ConsumerHandoffGap` | `lifecycle: ConsumerHandoffGapLifecycle` | 是 | consumer boundary gap 独立于 entry，可 stale/conditional resolve。 | SupplyEntry |
| `ExternalReferenceSnapshot` | `validity: ReferenceValidity` | 是 | body-free local snapshot有 capture/invalidate/supersede，恢复必须新 snapshot。 | ReferenceDerived |
| `ContractGap` | `lifecycle: ContractGapLifecycle` | 是 | lane-scoped gap有 open/block/resolve/expire。 | ReferenceDerived |
| `ProjectionFreshness` | `lifecycle: ProjectionFreshnessLifecycle` | 是 | read-only view 与 committed truth watermark关系有明确方法。 | ReferenceDerived |
| `ImageDerivedReadModel` | `freshness_ref` | 否 | view 本身不拥有 lifecycle，必须由 `ProjectionFreshness` 表达。 | not_applicable |
| `ImageTraceRecord` | append-only record | 否 | trace是解释性 history，不是状态主语。 | not_applicable |
| `ImageIdempotencyRecord` | `lifecycle: ImageIdempotencyLifecycle` | 是（technical） | reserve/complete/conflict 是独立 replay state；当前写路径仍不可达。 | idempotency / stored replay |
| `StoredImageOperationResult` | result metadata shell | 否 | 无 lifecycle，仅作为 idempotency completed 的被引用结果。 | not_applicable |
| `ImageRuntimeConfigRef` | `state: ImageRuntimeConfigState` | deferred | 没有 Step 9 flow 推进；Step 14 config binding 后重开。 | runtime / adapter technical |
| `ImageRuntimeAssemblyState` | `lifecycle: ImageRuntimeAssemblyLifecycle` | deferred | 没有 Step 9 runtime composition flow；不得把 composition validation写为 process state。 | runtime / adapter technical |
| `ImageAdapterSlot` / marker | `ImageAdapterAvailability` | 否 | slot availability是 composition input/分类，非独立 lifecycle。 | not_applicable |
| `InboundContractMarker` | `state: InboundContractState` | 是（entry boundary） | Step 9 有两条 marker-only inbound flow；无 accepted event path。 | runtime / entry technical |
| `ImageJobActionMarker` | `action_kind: ImageJobActionKind` | 否 | action identity，非 scheduler/run/execution lifecycle。 | not_applicable |
| DTO、query content state、typed ref、ID、page、reason | protocol/value carrier | 否 | 没有独立 lifecycle，不能为方便管理造状态机。 | not_applicable |

### 3.2 状态族分组表

| 状态族 | 状态机 | 所属模块 | 主要触发来源 | 停审顺序 |
|---|---|---|---|---|
| DefinitionAssembly | family definition、variant definition、baseline、revision | `domain::definition` | Define/Capture/Propose、reference refresh（future）；definition queries（read） | 10.1 |
| BuildCandidate | intent、snapshot、attempt、candidate | `domain::build` | Request/Record、nightly/reconcile job（future）；build trace query | 10.2 |
| Qualification | provenance、gate evaluation、eligibility、Artifact handoff | `domain::qualification` | Evaluate/RecordArtifact、reevaluate/reconcile job（future）；qualification query | 10.3 |
| SupplyEntry | availability transition、entry、consumer handoff gap | `domain::supply` | Publish/Transition/Rollback、handoff reconcile（future）；entry/history query | 10.4 |
| ReferenceDerived | external snapshot、contract gap、projection freshness | `domain::reference` | refresh/rebuild/reconcile job（future）；direct/projection query | 10.5 |
| idempotency / stored replay | idempotency record | `application` | command/job reservation after canonicalization (future) | 10.6 |
| runtime / entry technical | inbound contract marker | `worker` / entry boundary | two marker-only inbound flows | 10.6 |
| deferred runtime composition | config ref、assembly state | `infra` | Step 14 configuration/composition after an explicit future flow exists | deferred, not a current matrix |

### 3.3 状态矩阵批次表

| 状态机 | 所属模块 | 状态 enum | 触发 flow / 函数 | 当前停审状态 |
|---|---|---|---|---|
| Family / Variant Definition | `domain::definition` | `DefinitionLifecycle` | `create/define/mark_resolved/mark_blocked/supersede`; `DefineImageVariantFlow` | 10.1 pass |
| AssemblyBaseline | `domain::definition` | `BaselineCompleteness` | `capture/apply_completeness/supersede`; `CaptureAssemblyBaselineFlow` | 10.1 pass |
| VariantRevision | `domain::definition` | `VariantRevisionLifecycle` | `propose/validate/supersede`; `ProposeVariantRevisionFlow` | 10.1 pass |
| BuildIntent | `domain::build` | `BuildIntentLifecycle` | `request/accept/mark_pending/block/cancel`; Request/Nightly | pending |
| BuildInputSnapshot | `domain::build` | `BuildSnapshotLifecycle` | `capture/validate_against`; Request/Record | pending |
| BuildAttempt | `domain::build` | `BuildAttemptLifecycle` | `start/record_handoff/mark_outcome_pending/record_outcome/mark_unknown/supersede` | pending |
| CandidateImage | `domain::build` | `CandidateLifecycle` | `form/reject/block/mark_unknown`; Record outcome | pending |
| ProvenanceBinding | `domain::qualification` | `ProvenanceLifecycle` | `bind/verify/mark_conflict`; Evaluate | pending |
| GateEvaluation | `domain::qualification` | `GateEvaluationLifecycle` | `open/record_conclusion/close`; Evaluate/Reevaluate | pending |
| EligibilityDecision | `domain::qualification` | `EligibilityLifecycle` | `decide/evaluate`; Evaluate/Reevaluate | pending |
| ArtifactHandoffRecord | `domain::qualification` | `ArtifactHandoffLifecycle` | `open/record_gap/bind_artifact_ref`; Artifact/Reconcile | pending |
| AvailabilityTransition | `domain::supply` | `AvailabilityTransitionLifecycle` | `propose/commit/reject/supersede`; supply commands | pending |
| InstantiableEntry | `domain::supply` | `InstantiableEntryLifecycle` | `create/publish/supersede/retire`; supply commands | pending |
| ConsumerHandoffGap | `domain::supply` | `ConsumerHandoffGapLifecycle` | `open/resolve/mark_stale`; reconcile/query source | pending |
| ExternalReferenceSnapshot | `domain::reference` | `ReferenceValidity` | `capture/invalidate/supersede`; refresh | pending |
| ContractGap | `domain::reference` | `ContractGapLifecycle` | `open/block/resolve/expire`; future boundary flows | pending |
| ProjectionFreshness | `domain::reference` | `ProjectionFreshnessLifecycle` | `start/mark_stale/begin_rebuild/mark_fresh/mark_unavailable`; rebuild | pending |
| ImageIdempotencyRecord | `application` | `ImageIdempotencyLifecycle` | `reserve/complete/mark_conflict`; Command/Job future write path | pending |
| InboundContractMarker | `worker` | `InboundContractState` | `unavailable/rejected/reopen_required`; two inbound marker flows | pending |

### 3.4 全状态机通用规则

| 规则 | 正式口径 |
|---|---|
| 状态名 | 必须和 Step 6 enum variant一致；不得补 `Ready`、`Published`、`Delivered`、`Running` 等同义状态。 |
| factory | `factory -> initial state` 是对象产生规则，不是当前已发生的生产事实。 |
| future/reopen | 仅表示 B01/B02 与相应 owner contract 完成后可重新审阅的映射；不授予当前执行权。 |
| 当前可达 | Command/Job 当前为零 mutation；Query仅读；inbound为 marker-only。 |
| 副作用 | domain method仅更新所属 object；future application accepted path再协调 local history/trace/projection/result。无 outbox/publisher/delivery。 |
| 非法转换 | `DomainError::InvalidTransition(SafeReason)`，对象不变；Step 8映射 `ImageProtocolErrorKind::InvalidTransition`。 |
| replacement | 有 `superseded_by` 但无 `Superseded` enum时，只记录 replacement/history relation，不创造隐含 state。 |
| reserved positive | `Passed`、`Eligible`、Artifact `Accepted`、Consumer `Resolved` 等要求各自上游闭口；当前不得构造。 |

## 4. 状态族 10.1：DefinitionAssembly

### 4.1 模块思考与写入判断

该状态族只管理 local family/variant definition、immutable baseline及 revision buildability。它不管理 RoleDefinition truth、runtime/tools/member/supervisor正文、live memory/workspace、builder执行、candidate、资格、Artifact或下游实例。`MappingSourceSnapshot`/`SeedPlacementBinding` 的 `ReferenceValidity` 留给 10.5，避免同一 enum 被错误复制为多个“独立成功状态”。

当前的三个 definition Command 都会在 `ImageOperationContext::from_write` 后被 B01 截断，所以所有 factory/member transition 都是**future/reopen matrix**。Query 可以只读既有 lifecycle，却不得 `mark_resolved`、`apply_completeness` 或 `validate`。

### 4.2 `DefinitionLifecycle`：`ImageFamilyDefinition` 与 `ImageVariantDefinition`

#### 状态转换图: local definition lifecycle

```text
[factory]
  -> Draft
Draft
  -> Resolved
  -> Blocked
  -> Superseded
Resolved
  -> Blocked
  -> Superseded
Blocked / Superseded
  -> (no in-place recovery; create a new definition or revision context)
```

关键说明：

- family 和 variant 都使用同一 enum，但各自是不同 local subject；不得把 family `Resolved` 推导为 variant、baseline 或 revision success。
- `bind_mapping` / `attach_variant` / pointer linking 不是 lifecycle edge；其合法性受当前 state限制，但不能替代 `mark_resolved`。
- `Blocked` 的恢复是新 definition/revision context，而不是 `Blocked -> Resolved`。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Draft` | local identity存在，但 mapping/assembly relation尚未可用。 | 否 | attach/bind、`mark_resolved`、`mark_blocked`、`supersede`。 |
| `Resolved` | declared definition scope 的 local relation可供后续 baseline/revision判断。 | 否 | link revision/pointer、`mark_blocked`、`supersede`。 |
| `Blocked` | stale/conflict/missing/static-live violation冻结新的 positive definition lane。 | 是（本语境） | 只读、创建 replacement context；不得原地 resolved。 |
| `Superseded` | 新 family/variant context替代该历史语境。 | 是 | 只读 history；不得新建 build intent。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `ImageFamilyDefinition::create(...)` / `ImageVariantDefinition::define(...)` | `DefineImageVariantFlow` future/reopen；当前 B01 前禁止 factory。 | app-generated ID、safe local name/label、typed local relation shape通过；不读取 Role body。 | 写 local identity与空/initial relation；lifecycle=`Draft`。 | future: local save/result only after B01/B02 closure；当前零写。 | `DomainError::Validation` / protocol `ContractViolation`。 |
| `Draft` | `Resolved` | `mark_resolved()` | same flow future/reopen；当前不可达。 | loaded family/variant仍为 Draft；application 已验证 mapping snapshot及必要 definition relation可用。 | lifecycle=`Resolved`；不设置 baseline/candidate/entry。 | future: versioned local save；是否 trace由后续 consistency设计闭合；当前零写。 | `DomainError::InvalidTransition`。 |
| `Draft` / `Resolved` | `Blocked` | `mark_blocked(reason)` | Define/Capture/refresh mapping future path；当前不可达。 | non-empty `SafeReason`来自 loaded local guard / safe boundary；不得由 runtime/live state推断。 | lifecycle=`Blocked`、写 terminal reason。 | future: only affected definition lane可见；不得创建 external gap solely for B01/B02。 | `DomainError::InvalidTransition` / `Validation`。 |
| `Draft` / `Resolved` / `Blocked` | `Superseded` | `supersede(replacement_ref, reason)` | future revision/definition replacement path；当前不可达。 | replacement ref non-self，且新 context已存在或同一 future UoW创建；reason存在。 | lifecycle=`Superseded`、写 `superseded_by`/reason，保留历史。 | future: save existing local truth; no deletion/outbound. | `DomainError::InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Blocked -> Resolved` 或 `Superseded -> Resolved` | 返回 `InvalidTransition`；必须创建新 definition/revision context。 | 当前也不可借 context stop 构造 replacement。 |
| 在 `Blocked` / `Superseded` attach、link或设 active revision | 返回 `InvalidTransition`；不修改 pointer。 | Query只读；Command当前 B01 stop。 |
| 用外部 Role body、live memory/workspace、container/runtime状态解决 Draft | `Validation` / `Blocked`；这些输入越出本仓 static/ref boundary。 | 不调用 external adapter。 |

#### `DefinitionLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 与 Step 6 `Draft/Resolved/Blocked/Superseded` 一致。 |
| subject 边界 | pass | family/variant local truth分开；不拥有 Method Library Role truth。 |
| 触发函数 | pass_as_reopen_mapping | factory/member 均在 Step 6；Step 9 当前被 B01/B02 阻断。 |
| 前置条件 | pass_with_pending | mapping/source exact ref仍受 `MI-UP-003` 等约束；矩阵未假设其可用。 |
| 非法转换 / 副作用 | pass | 使用现有 `InvalidTransition`；无 outbox/publisher/consumer side effect。 |
| 测试切口 | pass | Draft→Resolved、Draft/Resolved→Blocked、supersede non-self；Blocked/Superseded不能原地复活；B01前无 mutation。 |

### 4.3 `BaselineCompleteness`：`AssemblyBaseline`

#### 状态转换图: immutable baseline completeness

```text
[capture]
  -> Incomplete
Incomplete
  -> Complete     (same captured baseline, guard conclusion)
  -> Conflict     (same captured baseline, conflicting static input)
  -> Superseded   (replacement baseline)
Complete
  -> Incomplete   (a required source becomes non-usable without an input conflict)
  -> Conflict     (newly discovered inconsistency)
  -> Superseded   (replacement baseline)
Conflict
  -> Superseded   (replacement baseline)
Superseded
  -> (no recovery in place)
```

关键说明：

- `Complete` 只表示 static immutable inputs可判断；不表示 build、candidate、digest、资格、Artifact或 consumer success。
- 输入改动永远产生新 baseline；`apply_completeness` 不得向既有 baseline追加 pin、seed、base 或 template body。
- 这里的 `Conflict` 不是 version-conflict/retry 策略；其细化留 Step 11~13。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Incomplete` | 必要 pin、placement、base 或 source validity缺失。 | 否（仅可判断 / 被替代） | `apply_completeness`、`supersede`；不得形成 buildable revision。 |
| `Complete` | 全部 required static immutable inputs存在且一致。 | 否 | supports revision、重新评估为 incomplete/conflict、`supersede`。 |
| `Conflict` | refs/pins/placement违反 immutable/static boundary或彼此不一致。 | 是（本 input context） | 只读、`supersede`。 |
| `Superseded` | 新 immutable baseline替代旧输入语境。 | 是 | 只读 history。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Incomplete` | `AssemblyBaseline::capture(...)` | `CaptureAssemblyBaselineFlow` future/reopen；当前 B01前不调用 resolver/factory。 | typed variant/mapping/base refs、component pins、static seed bindings 形状完整；初始不得默认 Complete。 | 固化 immutable input context，state=`Incomplete`或经 guard保守状态。 | future: new local baseline save；当前零写。 | `Validation` / wrong ref -> `ContractViolation`。 |
| `Incomplete` | `Complete` | `apply_completeness(VerifiedUsable, None)` | Capture/Propose future/reopen。 | loaded baseline immutable fields未改变；mapping snapshot Valid且 declared use一致；assembly/pin guard均 `VerifiedUsable`。 | lifecycle=`Complete`、reason清空。 | future: versioned save；不交接 builder。 | `InvalidTransition` / `Blocked`。 |
| `Incomplete` / `Complete` | `Incomplete` | `apply_completeness(Pending/Blocked/Unavailable, Some(reason))` | Capture/refresh/revalidation future/reopen。 | immutable fields未改变但 required source/pin/placement/base 当前不再可验证；reason存在，且未证明 identity conflict。 | lifecycle=`Incomplete`、写 reason。 | future: revision lane不可继续；不补写 input、不调用 builder。 | `InvalidTransition` / `Blocked` / `Unavailable`。 |
| `Incomplete` / `Complete` | `Conflict` | `apply_completeness(Rejected/Conflict, Some(reason))` | Capture/refresh/revalidation future/reopen。 | guard发现 owner/kind、pin、placement、base 或 static/live boundary冲突；reason存在。 | lifecycle=`Conflict`、写 reason。 | future: affected revision lane冻结；无 external mutation/outbound。 | `InvalidTransition` / `Validation`。 |
| `Incomplete` / `Complete` / `Conflict` | `Superseded` | `supersede(replacement_ref, reason)` | new baseline/revision context future/reopen。 | replacement non-self；新 baseline包含修改后的 immutable inputs；old inputs不被重写。 | lifecycle=`Superseded`、写 replacement/ref reason。 | future: preserve history，new baseline separately saved；当前零写。 | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Conflict -> Complete` 或 `Superseded -> Complete` | `InvalidTransition`；恢复必须新 baseline capture。 | 当前无 Capture write。 |
| 改写已 capture 的 pin/seed/base 后再 `Complete` | `Validation` / `Conflict`；不可变输入不得原地补写。 | B01/B02 之前也不得读取/保存 baseline。 |
| `Complete` 被当作 builder/candidate/readiness | `ContractViolation`；完整性不跨阶段传播。 | 不调用 builder、registry、consumer 或 runtime seam。 |

#### `BaselineCompleteness` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 与 Step 6一致。 |
| immutable input boundary | pass | component、seed、base只能 ref/template/static binding；live state被排除。 |
| trigger / guard | pass_as_reopen_mapping | `capture/apply_completeness/supersede` 已存在；resolver/flow当前不可达。 |
| positive overclaim | pass | `Complete` 不升级为 build/candidate/eligibility/entry。 |
| 测试切口 | pass | initial incomplete、complete需要 guards、conflict不可复活、输入改动产生新 baseline、当前 B01零 mutation。 |

### 4.4 `VariantRevisionLifecycle`：`VariantRevision`

#### 状态转换图: revision buildability

```text
[propose]
  -> Proposed
Proposed
  -> Buildable
  -> Invalid
  -> Superseded
Buildable
  -> Superseded
Invalid
  -> Superseded
Superseded
  -> (no in-place recovery)
```

关键说明：

- `Buildable` 仅允许进入 `BuildIntent` guard；不是 external build、output、candidate、digest或发布结论。
- 对 incomplete baseline 的失败由 `validate` 进入 `Invalid`；不临时把 baseline 改成 Complete。
- change/retry 采用 new baseline + new revision + supersede，不能 Invalid→Buildable。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Proposed` | revision绑定 baseline但尚未通过完整性/pin校验。 | 否 | `validate`、`supersede`。 |
| `Buildable` | local assembly guard通过，可请求 build intent。 | 否 | `can_start_build`、`supersede`。 |
| `Invalid` | revision不能进入 build lane。 | 是（本 revision context） | 只读、`supersede`。 |
| `Superseded` | 新 revision替代历史 revision。 | 是 | 只读；不得 request intent。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Proposed` | `VariantRevision::propose(...)` | `ProposeVariantRevisionFlow` future/reopen；当前 B01 stop。 | typed variant/baseline refs一致，safe derivation reason，app ID/time。 | lifecycle=`Proposed`；terminal fields为空。 | future: new local revision save；当前零写。 | `Validation` / `Conflict`。 |
| `Proposed` | `Buildable` | `validate(baseline, completeness_guard, pin_guard)` returns `VerifiedUsable` | Propose future/reopen。 | loaded same-variant baseline is Complete；static mapping/pins/seed/base guards pass。 | lifecycle=`Buildable`。 | future: save revision；可成为 RequestBuildIntent precondition，仍不调 builder。 | `InvalidTransition` / `Blocked`。 |
| `Proposed` | `Invalid` | `validate(...)` returns non-usable / reject | Propose/revalidation future/reopen。 | baseline incomplete/conflict、pins不完整、source stale或 ref relation不一致；safe reason可回链。 | lifecycle=`Invalid`、写 terminal reason。 | future: no intent creation; history remains read-only. | `InvalidTransition` / `Blocked` / `Conflict`。 |
| `Proposed` / `Buildable` / `Invalid` | `Superseded` | `supersede(replacement_ref, reason)` | new revision future/reopen。 | replacement non-self；new revision context已建立或同一 future UoW建立。 | lifecycle=`Superseded`、写 replacement/reason。 | future: retain history; do not rewrite baseline/digest. | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Invalid -> Buildable` 或 `Superseded -> Buildable` | `InvalidTransition`；新 baseline/revision replacement required。 | 当前无 revision write。 |
| 从 `Proposed` / `Invalid` 直接 request build intent | application returns `InvalidTransition`/`Blocked`; `can_start_build=false`。 | RequestBuildIntent当前也在 B01 stop。 |
| 以 tag/latest、component body或 live memory补齐 revision | `Validation`/`Blocked`；只允许 immutable ref/static template inputs。 | 不调用 owner body/adapter。 |

#### `VariantRevisionLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | `Proposed/Buildable/Invalid/Superseded` 与 Step 6一致。 |
| 触发函数 / flow | pass_as_reopen_mapping | method与 future `ProposeVariantRevisionFlow` 可回指；当前被 B01/B02 停止。 |
| 前置条件 | pass_with_pending | static refs/pins仍需正规 owner safe inputs；不假定 Runtime/Tools/Member/role extra 已闭合。 |
| 跨阶段边界 | pass | Buildable 只作为 intent前置，未跨越 builder/candidate/qualification。 |
| 测试切口 | pass | Proposed→Buildable/Invalid、Invalid不可复活、Superseded不可 request、current stop不调用 repository/guard。 |

### 4.5 DefinitionAssembly 批次停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否按状态机逐个展开 | pass | family/variant、baseline、revision各自有图、表、非法边和停审。 |
| 是否混入 reference validity | pass | mapping/seed snapshot状态保留到 10.5，避免同 enum双重拥有。 |
| 状态名 / 方法 / flow回指 | pass_as_reopen_mapping | Step 6/9 可回指；当前 Command B01/B02 使全写路径不可达。 |
| current 与 future 是否区分 | pass | 每个矩阵已写“future/reopen；当前零写”。 |
| 测试与错误口径 | pass | 合法/非法边使用 `DomainError::InvalidTransition` 与 Step 8 mapping；实际测试留 Step 16。 |

## 5. 状态族 10.2：BuildCandidate

### 5.1 模块思考与写入判断

本状态族把“请求构建”“冻结输入”“记录一次外部副作用观察”“形成候选”拆为四个 local subject。`Accepted` 不是 builder 接受，`HandoffPending` 不是外部执行，`Succeeded` 不是 candidate，`Formed` 也不是资格、Artifact、entry 或 consumer 成功。`BuildOutcomeConclusion.result_kind` 是归纳外部 safe observation 的分类 enum，而不是另一个可迁移状态机；它只驱动 `BuildAttempt` 与 `CandidateImage` 的已有方法。

当前 `RequestBuildIntentFlow`、`RecordBuildOutcomeFlow`、nightly/reconcile Job 均在 `DDD-S9-B01/B02` 前停下。以下图和矩阵仅规定 B01/B02 及相关 Builder/Registry seam 在未来闭合后应如何实现；不得据此运行 handoff、查询 builder、创建 attempt、写 outcome/candidate、保存 trace/gap/replay 或生成 digest。

### 5.2 `BuildIntentLifecycle`：`BuildIntent`

#### 状态转换图: local build intent lifecycle

```text
[request]
  -> Accepted | Pending | Blocked
Accepted
  -> Pending
  -> Blocked
  -> Cancelled
Pending
  -> Accepted
  -> Blocked
  -> Cancelled
Blocked / Cancelled
  -> (no in-place recovery; new intent context)
```

关键说明：

- factory 的三个初始状态都来自已验证的 local revision/trigger guard；它不是外部 build 或 scheduler execution 事实。
- `Pending -> Accepted` 只可由新的 verified source/contract 触发；不能由时间、cache、ACK、tag 或空缺默认值触发。
- `Blocked`、`Cancelled` 没有原地复活边；新请求必须有新的 intent identity 和 metadata context。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Accepted` | local revision 与 trigger 已通过 intent guard，可进入后续 snapshot/attempt 判断。 | 否 | `mark_pending`、`block`、`cancel`、`can_start_attempt`。 |
| `Pending` | 等待一个可验证 source 或合同，不得启动外部工作。 | 否 | `accept`、`block`、`cancel`。 |
| `Blocked` | stale、conflict、missing 或 unavailable seam 冻结本 intent lane。 | 是（本语境） | 只读 history；创建新 intent context。 |
| `Cancelled` | 在记录外部 side effect 前结束。 | 是 | 只读 history；创建新 intent context。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Accepted` / `Pending` / `Blocked` | `BuildIntent::request(...)` | `RequestBuildIntentFlow` / `RunNightlyBuildSweepFlow` future/reopen；当前 B01 前不可 factory。 | loaded revision、trigger kind/ref、metadata 和 guard 结论可验证；`VerifiedInboundEvent` 须先关闭 `MI-UP-005`。 | 写 local refs/trigger/metadata/reason 与对应初始 lifecycle。 | future: local intent save only after canonical input/result identity、UoW 设计重开；当前零写。 | `Validation` / `Blocked` / `ContractViolation`。 |
| `Pending` | `Accepted` | `accept()` | Request/reconcile future/reopen；当前不可达。 | same intent 仍 Pending；所等 source/contract 已由正式 safe input 验证，revision 仍 Buildable。 | lifecycle=`Accepted`，清除 pending reason。 | future: versioned local save；尚不 capture snapshot、不 handoff builder。 | `InvalidTransition`。 |
| `Accepted` / `Pending` | `Pending` | `mark_pending(SafeReason)` | request/reconcile future/reopen；当前不可达。 | reason 可回链到 required verified source/contract；不得以 external raw body 推断。 | lifecycle=`Pending`，保留安全 reason。 | future: local save only；不启动/取消外部 build。 | `InvalidTransition` / `Validation`。 |
| `Accepted` / `Pending` | `Blocked` | `block(SafeReason)` | command/job future/reopen；当前不可达。 | missing/stale/conflict/unavailable seam 已被 local guard 或 safe boundary 判定。 | lifecycle=`Blocked`、写 reason。 | future: lane-visible negative local truth；无 outbox/publisher。 | `InvalidTransition` / `Validation`。 |
| `Accepted` / `Pending` | `Cancelled` | `cancel(SafeReason)` | command future/reopen；当前不可达。 | Step 9 future flow 已证明尚无 attempt handoff；reason 存在。 | lifecycle=`Cancelled`、写 reason。 | future: local save/history only；不得撤销未知 external side effect。 | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Blocked` / `Cancelled -> Accepted` | `DomainError::InvalidTransition`；必须 new intent context。 | B01/B02 前也不能保存 replacement。 |
| 非 Buildable revision 调用 `can_start_attempt` 后建 attempt | guard 返回 false / application maps `Blocked` or `InvalidTransition`；不得调用 builder。 | revision 目前不可 read，因而不能伪写 blocked intent。 |
| inbound event 直接产生 `Accepted` | `ContractViolation` / fail-closed inbound disposition。 | `MI-UP-005` 下没有 verified inbound input。 |

#### `BuildIntentLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 与 Step 6 `Accepted/Pending/Blocked/Cancelled` 一致。 |
| trigger / subject | pass_as_reopen_mapping | `request/accept/mark_pending/block/cancel` 均回指 Step 6；当前写流被 B01/B02 截断。 |
| positive 边界 | pass | `Accepted` 明确仅为 local intent，不是 builder acceptance。 |
| 非法转换 / 测试切口 | pass | Pending→Accepted需 safe input；terminal不可复活；B01 前不创建 intent。 |

### 5.3 `BuildSnapshotLifecycle`：`BuildInputSnapshot`

#### 状态转换图: immutable input snapshot lifecycle

```text
[capture]
  -> Incomplete
Incomplete
  -> Complete
  -> Invalid
Complete
  -> Incomplete   (a required source becomes non-usable without an identity conflict)
  -> Invalid       (newly discovered relation conflict)
Invalid
  -> (no in-place repair; capture a new snapshot)
```

关键说明：

- snapshot 的字段在 capture 后不可补写；`validate_against` 只归纳既有 immutable input，不修补 pin、seed、base 或 body。
- `Complete` 只允许 `BuildAttempt::start` 的 local precondition，不代表 handoff、builder 接受、output 或 digest。
- 输入变化和 `Invalid` 恢复均通过 new snapshot / new attempt context，不写 `Invalid -> Complete`。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Incomplete` | 尚缺一项 required static immutable input 或验证尚未完成。 | 否 | `validate_against`、`is_complete`。 |
| `Complete` | snapshot、revision 与 baseline 的静态 identity 完整且一致。 | 否（可失去 required input 或发现冲突） | `is_complete`、`matches_revision`、可作 attempt guard。 |
| `Invalid` | snapshot 与 revision、baseline 或 source identity 冲突。 | 是（本 input context） | 只读 history；capture replacement。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Incomplete` | `BuildInputSnapshot::capture(...)` | Request intent / record outcome future/reopen；当前 B01/B02 前不可达。 | exact local revision/baseline refs 与 canonical static `BuildInputIdentity` 已准备；禁止 live memory、secret、raw body、mutable selector。 | 固化 immutable input，lifecycle=`Incomplete`。 | future: new local snapshot save；不 handoff adapter。 | `Validation` / `ContractViolation`。 |
| `Incomplete` | `Complete` | `validate_against(&VariantRevision, &AssemblyBaseline)` returns `VerifiedUsable` | future/reopen；当前不可达。 | same revision/baseline loaded；revision Buildable、baseline Complete，所有 captured refs 与 static identity exact match。 | lifecycle=`Complete`，reason 清空。 | future: versioned local save；仅可进入 attempt precheck。 | `InvalidTransition` / `Conflict` / `Blocked`。 |
| `Incomplete` / `Complete` | `Incomplete` | `validate_against(...)` returns missing / stale / unavailable but non-conflicting disposition | future revalidation only；当前不可达。 | immutable snapshot contents未被改写，但 required static ref/source is not currently usable and no identity conflict is proven。 | lifecycle=`Incomplete`、写 safe reason。 | future: stop attempt lane；不得补写 snapshot input。 | `InvalidTransition` / `Blocked` / `Unavailable`。 |
| `Incomplete` / `Complete` | `Invalid` | `validate_against(...)` returns conflict / invalid relation | future/reopen；当前不可达。 | mismatch、wrong baseline/revision relation、immutable input conflict 或 invalid source identity 被 pure guard 发现。 | lifecycle=`Invalid`，写 safe reason。 | future: stop attempt lane；不得改写 snapshot contents。 | `InvalidTransition` / `Validation` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Invalid -> Complete` | `InvalidTransition`；必须 capture new snapshot。 | 当前无 snapshot capture/save。 |
| 给已 capture snapshot 追加 pin/seed/base 或 live state | `Validation` / `Conflict`；immutable input 不可补写。 | 不调用 resolver、repository 或 builder。 |
| 非 Complete snapshot 进入 attempt | `can_start_attempt` / flow guard 拒绝，不可 `BuildAttempt::start`。 | 当前所有 attempt path 已 B01/B02 stop。 |

#### `BuildSnapshotLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / initial state | pass | `Complete/Incomplete/Invalid` 与 Step 6 一致，factory 保守初始 `Incomplete`。 |
| immutable boundary | pass | no live state、secret、raw body、tag/latest 或 fabricated digest。 |
| method / future trigger | pass_as_reopen_mapping | `capture/validate_against` 已回指；当前不存在可执行 write path。 |
| 测试切口 | pass | capture initial incomplete、complete needs exact guards、invalid cannot repair、B01 前零 resolver/UoW/save。 |

### 5.4 `BuildAttemptLifecycle`：`BuildAttempt`

#### 状态转换图: external build attempt observation lifecycle

```text
[start]
  -> Created
Created
  -> HandoffPending
  -> Unknown
HandoffPending
  -> OutcomePending
  -> Succeeded | Failed | Unknown
OutcomePending
  -> Succeeded | Failed | Unknown
Failed / Unknown
  -> [replacement relation only; new attempt context]
Succeeded
  -> (candidate guard; no direct supply transition)
```

关键说明：

- `BuildHandoffRef`、ACK、HTTP result 或 adapter return 仅能说明 controlled observation；都不能直接使 attempt `Succeeded`。
- `superseded_by` 没有同名 enum variant，因此它只是一条 replacement/history relation，不是一条 `Failed/Unknown -> Superseded` 状态边。
- `Unknown` 是 fail-closed 状态；新 attempt 不能被写成“普通 retry”，而必须有新 context 和明确 reason。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Created` | local attempt 已建立，尚未记录 controlled handoff。 | 否 | `record_handoff`、`mark_unknown`。 |
| `HandoffPending` | 已记录 handoff，外部接受与结果均未知。 | 否 | `mark_outcome_pending`、`record_outcome`、`mark_unknown`。 |
| `OutcomePending` | 外部副作用可能发生，但尚无安全结果结论。 | 否 | `record_outcome`、`mark_unknown`。 |
| `Succeeded` | safe external outcome 已验证，仍须 candidate guard。 | 是（attempt outcome） | 只读；作为 candidate guard 输入。 |
| `Failed` | safe failure conclusion 已记录。 | 是（可 replacement） | 只读；可记录 replacement relation。 |
| `Unknown` | external effect/commit/outcome 无法安全确定。 | 是（可 replacement） | 只读；可记录 replacement relation。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Created` | `BuildAttempt::start(...)` | separately reopened build-handoff path / current不可达。 | loaded intent=`Accepted`、snapshot=`Complete`，safe handoff ref 已由正规 boundary 产生；不能用 ACK 代替 handoff identity。 | lifecycle=`Created`；outcome/reason/replacement为空。 | future: local attempt save after approved boundary/UoW design；当前绝不 submit builder。 | `Validation` / `Blocked` / `ContractViolation`。 |
| `Created` | `HandoffPending` | `record_handoff(Option<SafeReason>)` | Record outcome / reconcile future/reopen。 | same attempt；controlled handoff observation exists，未声称 external accept。 | lifecycle=`HandoffPending`。 | future: versioned save; no candidate/result claim. | `InvalidTransition`。 |
| `HandoffPending` | `OutcomePending` | `mark_outcome_pending(SafeReason)` | reconcile future/reopen。 | reason 表明 side effect may have occurred but safe outcome absent。 | lifecycle=`OutcomePending`、写 reason。 | future: local save only；不得重新提交。 | `InvalidTransition` / `Validation`。 |
| `HandoffPending` / `OutcomePending` | `Succeeded` / `Failed` / `Unknown` | `record_outcome(BuildOutcomeConclusionRef, &BuildOutcomeConclusion)` | Record outcome / reconcile future/reopen。 | outcome belongs to same attempt；safe result is normalized; `Succeeded` still needs verified output identity; `Unavailable` maps conservatively to `Unknown` with reason，而不新增 enum。 | bind `outcome_ref`，更新 lifecycle/reason。 | future: save local outcome + attempt; candidate creation requires separate guard; no outbound. | `InvalidTransition` / `Conflict` / `Validation`。 |
| `Created` / `HandoffPending` / `OutcomePending` | `Unknown` | `mark_unknown(SafeReason)` | reconcile/timeout future/reopen。 | safe reason indicates inability to determine external effect/outcome。 | lifecycle=`Unknown`、写 reason。 | future: preserve observation; no automatic retry. | `InvalidTransition`。 |
| `Failed` / `Unknown` | replacement relation (no enum transition) | `supersede(BuildAttemptRef, SafeReason)` | future recovery/reconcile path。 | non-self replacement attempt exists or is staged in same future UoW；reason present。 | write `superseded_by` / reason；lifecycle remains Failed or Unknown。 | future: preserve old history; new attempt is separate local truth. | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Unknown -> Succeeded`、`Failed -> Succeeded` | `InvalidTransition`；safe resolution needs new context, not in-place success。 | current builder/reconcile path is unavailable. |
| `Created -> Succeeded` or use ACK as outcome | `InvalidTransition` / `ContractViolation`；must pass `record_handoff` and safe outcome correlation。 | no adapter call is currently legal. |
| retry or overwrite old attempt after Unknown | reject; use new attempt + replacement relation only。 | Job cannot select or mutate attempts before B01/B02. |

#### `BuildAttemptLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / graph | pass | 六个 Step 6 variants 均被覆盖；replacement 未伪造为 enum state。 |
| external-side-effect boundary | pass_with_pending | Q-MI-003 controls future builder/registry safe conclusion; current no adapter call. |
| candidate separation | pass | attempt `Succeeded` only feeds candidate guard。 |
| 测试切口 | pass | handoff≠success、unknown不可复活、outcome correlation、replacement non-self、B01前零 submit/read/save。 |

### 5.5 `CandidateLifecycle`：`CandidateImage`

#### 状态转换图: candidate formation lifecycle

```text
[form]
  -> Formed
Formed
  -> Rejected
  -> Blocked
  -> Unknown
Rejected / Blocked / Unknown
  -> (no in-place recovery; new attempt/candidate/qualification context)
```

关键说明：

- `Formed` 必须同时满足 matching attempt、Complete snapshot、Succeeded safe outcome 和 verified immutable output identity；不能由 tag、latest、registry presence 或 handwritten digest 形成。
- negative edges 仅适用于尚未进入 qualification 的 formation context；一旦有后续 history，必须新增 context 而不能覆盖已持久化事实。
- 本机不拥有 eligibility、Artifact、entry、consumer 或 container 状态。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Formed` | formation guard 通过的 local candidate。 | 否（进入 qualification 前可否定） | `is_formed`、pre-qualification `reject/block/mark_unknown`。 |
| `Rejected` | output/outcome 未满足 formation guard。 | 是 | 只读；new context。 |
| `Blocked` | contract/source gap 使 formation 不能判定。 | 是 | 只读；等待新 context。 |
| `Unknown` | identity 或 external outcome 无法安全确定。 | 是 | 只读；等待 safe resolution/new context。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Formed` | `CandidateImage::form(...)` | `RecordBuildOutcomeFlow` future/reopen；当前 B01/B02 前不可达。 | `CandidateFormationGuard::check` returns usable; loaded attempt/snapshot/outcome refs correlate; image ref immutable and basis verified。 | lifecycle=`Formed`，reason=None。 | future: new candidate save; only then may open qualification context; no Artifact/supply. | `Validation` / `Conflict` / `Blocked`。 |
| `Formed` | `Rejected` | `reject(SafeReason)` | future pre-qualification correction path。 | no qualification context has begun; guard conclusion is conclusively non-usable; reason present。 | lifecycle=`Rejected`、写 reason。 | future: local history only；不得 erase attempt/outcome。 | `InvalidTransition`。 |
| `Formed` | `Blocked` | `block(SafeReason)` | future source/contract gap path。 | no qualification context has begun; required boundary/source is not safely usable。 | lifecycle=`Blocked`、写 reason。 | future: local negative truth/gap coordination belongs application; no owner call. | `InvalidTransition` / `Blocked`。 |
| `Formed` | `Unknown` | `mark_unknown(SafeReason)` | future reconciliation path。 | identity/outcome cannot safely be determined before qualification begins。 | lifecycle=`Unknown`、写 reason。 | future: no eligibility decision or supply effect。 | `InvalidTransition`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Rejected` / `Blocked` / `Unknown -> Formed` | `InvalidTransition`；new candidate context required。 | RecordBuildOutcome 当前在 B01/B02 stop。 |
| candidate without Complete snapshot / immutable identity | `Validation` / `ContractViolation`；factory/guard拒绝。 | no digest calculation or registry query is allowed. |
| `Formed -> Eligible/Available/Accepted` shortcut | no transition exists; caller must use qualification then supply state machines。 | current no downstream write path. |

#### `CandidateLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / status scope | pass | `Formed/Rejected/Blocked/Unknown` 与 Step 6 一致。 |
| trigger / guard | pass_as_reopen_mapping | `form/reject/block/mark_unknown` 与 Step 6/9 可回指；builder seam remains pending. |
| phase boundary | pass | Formed 不跨越 qualification、Artifact、supply 或 consumer。 |
| 测试切口 | pass | immutable output/correlation required；negative terminal；no tag/ACK shortcut；current B01 zero mutation。 |

### 5.6 BuildCandidate 批次停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 四个 state subject 是否分开 | pass | intent、snapshot、attempt、candidate 各有独立图、矩阵、非法边和停审。 |
| `BuildResultKind` 是否被误当 machine | pass | 仅作为 `record_outcome` 的分类输入；未新增状态机。 |
| 当前与 future 是否隔离 | pass_with_blocker | 所有 mutation/handoff/resolver 都受 B01/B02，Builder/Registry 仍受 Q-MI-003。 |
| unknown / replacement 是否安全 | pass | unknown 不重试；`superseded_by` 不新增 `Superseded` enum。 |
| 测试与错误口径 | pass | 所有非法边为 `DomainError::InvalidTransition`，Step 8 public mapping remains `ImageProtocolErrorKind::InvalidTransition`。 |

## 6. 状态族 10.3：Qualification

### 6.1 模块思考与写入判断

Qualification 只收敛本仓对 candidate 的来源链、适用 gate 安全结论、image-domain eligibility 与 Artifact boundary observation。它不拥有 governance gate inventory/evidence body、Artifact truth、Artifact lineage/storage、consumer/container/runtime truth。四个机器互相引用，但不合并为一个“qualified/ready”总状态：`Complete`、`Passed`、`Eligible` 与 Artifact `Accepted` 的语义严格不同。

`EvaluateCandidateEligibilityFlow` 和 `RecordArtifactHandoffFlow` 当前在 B01/B02 前停止；且 `Q-MI-004` 使 gate 正向 inputs 不可假定，`MI-UP-007` 使 Artifact `Accepted` 不可构造。故下列任何正向边均是 future/reopen mapping，当前不会 bind provenance、open/close gate、evaluate eligibility、open gap 或写 handoff record。

### 6.2 `ProvenanceLifecycle`：`ProvenanceBinding`

#### 状态转换图: local provenance completeness lifecycle

```text
[bind]
  -> Incomplete
Incomplete
  -> Complete
  -> Conflict
Complete
  -> Conflict
Conflict
  -> (no in-place recovery; bind a new provenance context)
```

关键说明：

- 必要结构为同一 candidate 链上的 complete snapshot、external execution 与 verified immutable output identity；可选 mapping/assembly source 只能解释，不能替代必要角色。
- `Complete` 仅可作为 gate/eligibility input，绝不表示 gate pass、Artifact handoff、entry 或 consumer success。
- `Conflict` 及 source replacement 的恢复走 new provenance context；本对象没有 `superseded_by` 字段，不能擅造 replacement edge。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Incomplete` | provenance 必要 link 尚缺或未完成严格验证。 | 否 | `verify`、`mark_conflict`、`supports_eligibility=false`。 |
| `Complete` | input/execution/output 及 required source links 可回链验证。 | 否（可发现冲突） | `supports_eligibility`、`mark_conflict`。 |
| `Conflict` | required refs、roles 或 identity 相互冲突。 | 是（本 binding context） | 只读；new provenance context。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Incomplete` | `ProvenanceBinding::bind(...)` | `EvaluateCandidateEligibilityFlow` future/reopen；当前 B01/B02 前不可达。 | loaded candidate=`Formed`、snapshot=`Complete`，safe execution/output refs 与 canonical source-binding set有合法形状。 | 固化 ref-only chain，lifecycle=`Incomplete`。 | future: new local provenance save；不读 evidence/artifact body。 | `Validation` / `ContractViolation` / `Blocked`。 |
| `Incomplete` | `Complete` | `verify(&ProvenanceCompletenessGuard)` returns `VerifiedUsable` | qualification future/reopen。 | all required role bindings present/dedup；same candidate/attempt chain；verified output identity形状通过。 | lifecycle=`Complete`，reason=None。 | future: versioned local save；可被 gate/eligibility读取。 | `InvalidTransition` / `Conflict`。 |
| `Incomplete` / `Complete` | `Conflict` | `verify(...)` non-usable conflict conclusion or `mark_conflict(SafeReason)` | qualification/reconciliation future/reopen。 | required role重复、wrong identity、cross-candidate relation或 safe conflict conclusion；reason 可回链。 | lifecycle=`Conflict`、写 reason。 | future: local negative context only；不改 candidate/snapshot。 | `InvalidTransition` / `Validation` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Conflict -> Complete` | `InvalidTransition`；new binding context required。 | current qualification flow performs no mutation. |
| 用 adapter availability、log、tag 或 guessed digest 标记 `Complete` | `Validation` / `ContractViolation`；guard only accepts refs/safe conclusion structure。 | Q-MI-003/B01/B02 prevent adapter inference. |
| 把 `Complete` 直接当作 entry/artifact handoff | no state edge; must separately evaluate gate/eligibility and handoff。 | no downstream write is available. |

#### `ProvenanceLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / subject | pass | `Complete/Incomplete/Conflict` 和 `ProvenanceBinding` 字段/函数一致。 |
| trigger / guards | pass_as_reopen_mapping | `bind/verify/mark_conflict` 可回指 Step 6 和 Step 9；B01/B02 currently stop all writes. |
| source boundary | pass_with_pending | verified output ref is future safe owner input; no digest/body is created. |
| 测试切口 | pass | missing role -> incomplete、mismatch -> conflict、conflict cannot revive、no tag/log shortcut。 |

### 6.3 `GateEvaluationLifecycle`：`GateEvaluation`

#### 状态转换图: authority-driven local gate evaluation lifecycle

```text
[open]
  -> Pending
Pending
  -> Passed | Failed | Blocked | Unknown
Passed / Failed / Blocked / Unknown
  -> [replacement relation only; new evaluation context]
```

关键说明：

- `record_conclusion` 在 `Pending` 内累积 body-free binding，不等于完成评价；只有 `close` 才由 `ApplicableGateGuard` 归纳结果。
- `superseded_by` 是 history relation，enum 没有 `Superseded`；不得增加新状态或把旧结果原地改成新结果。
- `Passed` 依赖正式 applicable gate authority 和所有适用 safe positive conclusion。`Q-MI-004` 未闭口时，当前不能创建或推导 Passed。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Pending` | gate conclusion collection 尚未完成。 | 否 | `record_conclusion`、`close`、`supersede`。 |
| `Passed` | 当前正式 applicable set 的 safe positive conclusion 齐备。 | 是（evaluation outcome） | `passed`、history/replacement。 |
| `Failed` | 至少一项适用 gate 安全否定。 | 是 | history/replacement。 |
| `Blocked` | authority/evidence/contract 不能安全确定。 | 是 | history/replacement。 |
| `Unknown` | external gate conclusion 无法安全确定。 | 是 | history/replacement。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `GateEvaluation::open(...)` | `EvaluateCandidateEligibilityFlow` future/reopen；当前不可达。 | formed candidate、typed `ApplicableGateSetRef`、app ID/time；authority ref不可由 config/fake 代替。 | lifecycle=`Pending`，empty conclusion set。 | future: new local evaluation save；不创建 governance truth。 | `Validation` / `Blocked` / `ContractViolation`。 |
| `Pending` | `Pending` | `record_conclusion(GateConclusionBinding)` | future conclusion collection path。 | binding is body-free, deduplicated, within already verified applicable set; no evidence body。 | append/dedup conclusion binding，state remains Pending。 | future: versioned local save only；不产生 eligibility。 | `InvalidTransition` / `Validation` / `Conflict`。 |
| `Pending` | `Passed` / `Failed` / `Blocked` / `Unknown` | `close(&ApplicableGateGuard)` | evaluate / reevaluate future/reopen。 | authority and applicable set resolve through permitted safe boundary；guard's disposition maps exactly: all verified -> Passed, negative -> Failed, missing -> Blocked, uncertain -> Unknown。 | lifecycle/reason由 guard conclusion 写入。 | future: local evaluation save；may feed a separate EligibilityDecision evaluation; no Artifact/supply. | `InvalidTransition` / `Blocked` / `Unknown`。 |
| any existing outcome | replacement relation (no enum transition) | `supersede(GateEvaluationRef, SafeReason)` | reevaluate future/reopen。 | non-self replacement evaluation exists/staged; reason exists。 | retain lifecycle/conclusions; write `superseded_by` / reason。 | future: preserve history; new evaluation saved separately。 | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Passed/Failed/Blocked/Unknown -> Pending/Passed` by overwriting | `InvalidTransition`; create a replacement evaluation。 | no qualification persistence now. |
| empty/missing authority or conclusion collection -> `Passed` | `Blocked` / `Unknown` only; never default-pass。 | Q-MI-004 keeps positive gate input pending. |
| gate body/policy/priority stored in evaluation | `ContractViolation`; only typed set/conclusion refs allowed。 | no evidence/governance adapter is callable. |

#### `GateEvaluationLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / state mapping | pass | five Step 6 variants and `open/record_conclusion/close` are all covered. |
| replacement semantics | pass | `superseded_by` retained as relation, not invented enum value. |
| authority boundary | pass_with_pending | Q-MI-004 blocks any current `Passed` fact. |
| 测试切口 | pass | Pending accumulation、empty not pass、negative/unknown mapping、outcome immutable、current no write。 |

### 6.4 `EligibilityLifecycle`：`EligibilityDecision`

#### 状态转换图: image-domain eligibility lifecycle

```text
[decide]
  -> Pending
Pending
  -> Eligible | Ineligible | Blocked
Eligible / Ineligible / Blocked
  -> [replacement relation only; new decision context]
```

关键说明：

- `Eligible` requires the same formed candidate, Complete provenance and Passed gate evaluation. It only permits entry-guard evaluation; it does not publish an entry or create Artifact/consumer acceptance.
- `Pending` is retained for incomplete inputs; missing authority or unknown conclusions yield `Blocked` or remain `Pending` according to the existing `evaluate` contract, never implicit Eligible.
- `superseded_by` is history only; there is no `Superseded` enum variant.

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Pending` | provenance 或 gate input 还未收齐。 | 否 | `evaluate`、`supersede`。 |
| `Eligible` | image-domain prerequisites permit supply evaluation. | 是（decision outcome） | `permits_supply`、history/replacement。 |
| `Ineligible` | prerequisites conclusively did not pass. | 是 | history/replacement。 |
| `Blocked` | required authority/contract/safe conclusion absent. | 是 | history/replacement。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `EligibilityDecision::decide(...)` | `EvaluateCandidateEligibilityFlow` future/reopen；当前不可达。 | typed local candidate/provenance/gate refs supplied; later exact reads verify same candidate。 | lifecycle=`Pending`、reason=None。 | future: new local decision save；does not supply entry。 | `Validation` / `Conflict`。 |
| `Pending` | `Eligible` | `evaluate(candidate, provenance, gates)` returns `Eligible` | future/reopen。 | same candidate refs; candidate=Formed, provenance=Complete, gates=Passed。 | lifecycle=`Eligible`、reason=None。 | future: versioned decision save；may be EntryPinGuard input only。 | `InvalidTransition` / `Blocked` / `Conflict`。 |
| `Pending` | `Ineligible` | `evaluate(...)` returns `Ineligible` | future/reopen。 | same candidate but local prerequisite was conclusively negative (for example gate Failed). | lifecycle=`Ineligible`、write reason。 | future: history/local negative result only；no supply. | `InvalidTransition` / `Validation`。 |
| `Pending` | `Blocked` or remains `Pending` | `evaluate(...)` with missing/unknown safe input | future/reopen。 | authority/contract/ref missing, stale, unknown or cross-candidate relation invalid; function follows existing safe disposition mapping。 | write `Blocked` reason or retain Pending as prescribed; no positive fields. | future: local save only; no config override/Artifact/consumer side effect. | `InvalidTransition` / `Blocked` / `Unknown`。 |
| any existing outcome | replacement relation (no enum transition) | `supersede(EligibilityDecisionRef, SafeReason)` | reevaluate future/reopen。 | non-self replacement context exists/staged; reason present。 | preserve lifecycle; write `superseded_by` / reason。 | future: history retained; new decision separately evaluated. | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| overwrite Eligible/Ineligible/Blocked or revive terminal context | `InvalidTransition`; new decision context only。 | current B01/B02 blocks factory/evaluate/save. |
| candidate/provenance/gate from different candidate chains -> Eligible | `Conflict` / `Blocked`; `evaluate` must reject cross-candidate mismatch。 | no repository reads currently occur. |
| `Eligible -> Available/Accepted/Resolved` shortcut | no edge exists; SupplyEntry and Artifact/consumer machines own those meanings。 | MI-UP-001/007 and B01/B02 prevent all downstream writes. |

#### `EligibilityLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / trigger | pass | `Pending/Eligible/Ineligible/Blocked` and `decide/evaluate` match Step 6. |
| same-candidate invariant | pass | matrix requires exact local-ref relation before any outcome. |
| positive scope | pass | Eligible is limited to EntryPinGuard precondition. |
| 测试切口 | pass | three positive inputs required; failed -> ineligible; missing/unknown never eligible; outcome replacement is new context。 |

### 6.5 `ArtifactHandoffLifecycle`：`ArtifactHandoffRecord`

#### 状态转换图: conditional Artifact handoff observation lifecycle

```text
[open]
  -> Pending
Pending
  -> Gap
  -> Accepted  (reserved: formal Artifact contract + owner resolution)
Gap
  -> Gap
  -> Accepted  (reserved: formal Artifact contract + owner resolution)
Accepted
  -> (history only; no local rollback of Artifact truth)
```

关键说明：

- `Pending`/`Gap` only describe local observation. Neither creates an Artifact version, lineage, storage locator, receipt or delivery.
- `Accepted` is a conditional local observation that needs both `ArtifactConsumableRef` and `ContractResolutionRef`; it is reserved while `MI-UP-007` remains open.
- A new Artifact problem is expressed by a new handoff/gap context; this machine deliberately has no `Accepted -> Gap` rollback edge because it must not overwrite past owner-side observation.

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Pending` | handoff context exists but no safe owner conclusion is recorded. | 否 | `record_gap`、reserved `bind_artifact_ref`。 |
| `Gap` | exact schema/ref/owner conclusion unavailable. | 否（can be formally resolved) | `record_gap`、reserved `bind_artifact_ref`。 |
| `Accepted` | formal owner-side accepted handoff was verified. | 是（local observation) | read/history only。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `ArtifactHandoffRecord::open(...)` | `RecordArtifactHandoffFlow` future/reopen；current B01/B02 prevents it。 | same candidate chain has local eligibility=`Eligible`; app ID/time; no implied Artifact ref。 | lifecycle=`Pending`; artifact/resolution/gap fields empty。 | future: new local handoff context save; no owner call/mint. | `Validation` / `Conflict`。 |
| `Pending` / `Gap` | `Gap` | `record_gap(ContractGapRef, SafeReason)` | Record/reconcile future/reopen；current不可达。 | a separate local `ContractGap` exists and refers to Artifact seam/lane; reason present; no safe owner acceptance。 | lifecycle=`Gap`; clear artifact/resolution fields; bind gap ref/reason。 | future: local gap+handoff save only; no Artifact mutation/outbound. | `InvalidTransition` / `Validation`。 |
| `Pending` / `Gap` | `Accepted` | `bind_artifact_ref(ArtifactConsumableRef, ContractResolutionRef)` | **reserved/reopen only** after MI-UP-007 formal closure and Step 7/8/9 review。 | formal Artifact schema/ref condition and owner resolution verified; `artifact_ref=Some`, `resolution_ref=Some`, `gap_ref=None`; same eligible candidate relation。 | lifecycle=`Accepted`; bind both external refs; clear gap。 | future: local handoff observation save; never creates/mutates Artifact truth or sends delivery。 | `InvalidTransition` / `ContractViolation` / `Blocked`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Accepted -> Gap/Pending` by overwriting record | `InvalidTransition`; preserve history and open a new gap/handoff context。 | no Artifact handoff write currently allowed. |
| no formal `ArtifactConsumableRef + ContractResolutionRef` -> `Accepted` | `ContractViolation` / `Blocked`; no config/ACK/image ref substitute。 | MI-UP-007 keeps Accepted strictly unreachable. |
| artifact ref/version/lineage minted by this repository | `ContractViolation`; Artifact truth remains L1-artifact owned。 | no Artifact adapter or outbound flow exists. |

#### `ArtifactHandoffLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / states | pass | `Pending/Gap/Accepted` match Step 6 and preserve local-observation scope. |
| pending contract | pass_with_blocker | MI-UP-007 keeps Accepted reserved; B01/B02 keep even Pending/Gap mutation unreachable. |
| owner boundary | pass | no Artifact version/lineage/storage/receipt/outbound semantics added. |
| 测试切口 | pass | open pending、gap clears positive refs、Accepted requires both formal refs, accepted cannot be overwritten。 |

### 6.6 Qualification 批次停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 四个 state subject 是否独立 | pass | provenance、gate、eligibility、Artifact handoff 各自有图、矩阵、非法边和停审。 |
| 正向状态是否被偷换 | pass | Complete≠Passed≠Eligible≠Accepted；没有 `ready` 汇总状态。 |
| governance / Artifact owner 边界 | pass_with_pending | Q-MI-004 和 MI-UP-007 保留为 blocker，未私造 inventory、evidence、artifact truth 或 acceptance。 |
| replacement / recovery | pass | Gate/Decision replacement 为历史 relation；provenance/artifact问题开新 context。 |
| 当前写路径 | pass_with_blocker | B01/B02 前所有 qualification/handoff mutation为零。 |

## 7. 状态族 10.4：SupplyEntry

### 7.1 模块思考与写入判断

SupplyEntry 只表达镜像侧的供给历史、可实例化 pinned entry，以及向 Member Service 交接时的局部缺口。三个主语不能合并：`AvailabilityTransition::Committed` 是 append-only local history，`InstantiableEntry::Available` 是本仓可查询的 immutable entry，`ConsumerHandoffGap::Resolved` 是未来合同约束下的 handoff observation；它们都不等于 registry publish、Artifact 接收、container launch、session、health 或 runtime readiness。

`PublishInstantiableEntryFlow`、`TransitionAvailabilityFlow`、`RollbackOrRetireEntryFlow` 以及 consumer handoff reconcile 当前均在 `DDD-S9-B01/B02` 前停止。`MI-UP-001` 未闭口时，consumer gap 只允许保持 `Open`/`Stale` 的 fail-closed 语义；不得生成 `Resolved`、confirmation 或 Member Service manifest。

### 7.2 `AvailabilityTransitionLifecycle`：`AvailabilityTransition`

#### 状态转换图: append-only local availability history

```text
[propose]
  -> Proposed
Proposed
  -> Committed
  -> Rejected
  -> Superseded
Committed / Rejected
  -> Superseded
Superseded
  -> (history terminal; new transition context only)
```

关键说明：

- `Committed` 只说明一条 local transition 通过本仓 guard 并被提交；它不调用 registry、Artifact 或 consumer，也不表示 entry 已可实例化。
- `Superseded` 是 Step 6 已存在的 transition state，可用于替代旧 history；rollback/replace 仍必须追加新 transition，不能改写旧记录。
- transition 的 `transition_kind` 是 action 分类，不是另一套状态机；它不能从 adapter callback、latest tag 或 consumer 状态推导。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Proposed` | local availability 变化已提出，尚未通过 current-facts guard。 | 否 | `commit`、`reject`、`supersede`。 |
| `Committed` | local availability history 已提交。 | 否（可被新 history 替代） | `supersede`、只读 history。 |
| `Rejected` | transition guard 否定该 proposed 变化。 | 否（仅可被历史替代） | `supersede`、只读 history。 |
| `Superseded` | 新 transition context 替代该历史语境。 | 是 | 只读 history。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Proposed` | `AvailabilityTransition::propose(...)` | Publish/Transition/Rollback/Retire future/reopen；当前 B01/B02 前不可达。 | variant ref、明确 `AvailabilityTransitionKind`、可选 candidate/prior entry refs、application time；不接 consumer/container 状态。 | 固化 local action context，lifecycle=`Proposed`，resulting/committed fields为空。 | future: append new local history candidate；当前零写。 | `Validation` / `ContractViolation`。 |
| `Proposed` | `Committed` | `commit(resulting_entry_ref, &CurrentAvailabilityFacts, &AvailabilityTransitionGuard, committed_at)` | supply command future/reopen。 | strict guard通过；current facts来自 exact local reads；resulting ref与 action/entry relation匹配；committed time存在。 | lifecycle=`Committed`、写 resulting ref/committed_at、reason=None。 | future: versioned append/save local history and any local entry update in same UoW；不外发。 | `InvalidTransition` / `Conflict` / `Blocked`。 |
| `Proposed` | `Rejected` | `reject(SafeReason)` | supply command/reconcile future/reopen。 | guard 已给出明确 negative disposition；reason 非空。 | lifecycle=`Rejected`、写 reason、committed_at保持空。 | future: append negative history；不得改 prior entry 或删历史。 | `InvalidTransition` / `Validation`。 |
| `Proposed` / `Committed` / `Rejected` | `Superseded` | `supersede(AvailabilityTransitionRef, SafeReason)` | replacement/rollback future/reopen。 | replacement ref non-self，且新 transition context 已存在或在同一 future UoW staged；reason 非空。 | lifecycle=`Superseded`、写 replacement/reason；不改既有 committed_at。 | future: retain old history and save new transition；不回滚 external truth。 | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Committed -> Proposed/Rejected` 或 `Rejected -> Committed` | `DomainError::InvalidTransition`；必须提出新 transition。 | 当前无 history read/write。 |
| 用 registry presence、ACK、container/consumer state 提交 `Committed` | `ContractViolation` / `Blocked`；只接受 local current facts 与 strict guard。 | B01/B02、MI-UP-001/007 阻断相关 flow。 |
| rollback 原地复活旧 transition/entry | `InvalidTransition`；rollback 只能是新 transition context。 | 当前不得创建 replacement。 |

#### `AvailabilityTransitionLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / state graph | pass | `Proposed/Committed/Rejected/Superseded` 与 Step 6 一致。 |
| append-only boundary | pass | replacement/rollback/retire 通过新 history，不覆盖旧记录。 |
| trigger / current path | pass_as_reopen_mapping | `propose/commit/reject/supersede` 回指 Step 6；B01/B02 前无 mutation。 |
| 测试切口 | pass | guard failure→Rejected、commit requires exact facts、terminal replacement non-self、ACK不能提交。 |

### 7.3 `InstantiableEntryLifecycle`：`InstantiableEntry`

#### 状态转换图: local pinned entry supply lifecycle

```text
[create]
  -> Unavailable
Unavailable
  -> Available
  -> Retired
Available
  -> Superseded
  -> Retired
Superseded / Retired
  -> (no in-place recovery; new entry context)
```

关键说明：

- `create` 只建立 entry candidate，初始必须为 `Unavailable`；只有 same-candidate `Eligible`、`Complete` provenance、immutable image ref、committed transition 和 `EntryPinGuard` 全部通过，才可 future `publish` 为 `Available`。
- `Available` 只表示本仓 pinned entry 可被下游查询；不会启动或确认实例。`Superseded`、`Retired` 不能原地回到 `Available`。
- `retire` 可作用于 `Unavailable` 或 `Available`，但仍只写 local history；不得删除 entry 或修改 Artifact/consumer truth。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Unavailable` | entry identity 已存在，但尚未证明 local supply 可用。 | 否 | `publish`、`retire`、`is_immutable_pinned`。 |
| `Available` | immutable pinned entry 已通过本仓 supply guard。 | 否（可替代或退役） | `supersede`、`retire`、`is_immutable_pinned`、查询。 |
| `Superseded` | 新 entry 替代该历史 entry。 | 是 | 只读 history。 |
| `Retired` | entry 已显式停供但保留历史。 | 是 | 只读 history。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unavailable` | `InstantiableEntry::create(...)` | `PublishInstantiableEntryFlow` future/reopen；当前 B01/B02 前不可达。 | same variant/candidate/eligibility/provenance refs、immutable image ref、created time；ref kind/owner 通过 shape guard。 | 固化 entry chain，lifecycle=`Unavailable`，published_at为空。 | future: save new local entry candidate；不调用 consumer/container。 | `Validation` / `ContractViolation`。 |
| `Unavailable` | `Available` | `publish(transition_ref, &EligibilityDecision, &ProvenanceBinding, &EntryPinGuard, published_at)` | Publish flow future/reopen；当前不可达。 | transition 为已提交 local history；eligibility=`Eligible`、provenance=`Complete`、same candidate/variant；immutable pin guard通过；published_at存在。 | lifecycle=`Available`、写 transition ref/published_at、reason=None。 | future: versioned entry save and local trace/history; no registry publish/Artifact/consumer call. | `InvalidTransition` / `Conflict` / `Blocked`。 |
| `Unavailable` / `Available` | `Retired` | `retire(transition_ref, SafeReason)` | RollbackOrRetireEntryFlow future/reopen；当前不可达。 | committed retire transition ref 与 entry relation匹配；reason 非空；不再需要 in-place supply。 | lifecycle=`Retired`、写 transition/reason、保留 image chain。 | future: local entry/history save；不删除或调用下游。 | `InvalidTransition` / `Conflict`。 |
| `Available` | `Superseded` | `supersede(replacement_ref, transition_ref, SafeReason)` | Publish/Transition replacement future/reopen。 | replacement entry non-self，且新 entry context 与 committed transition 已存在/staged；reason 非空。 | lifecycle=`Superseded`、写 replacement/transition/reason；不清空 provenance/image refs。 | future: save old/new local entries and history atomically；无 external delivery。 | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Superseded` / `Retired -> Available` | `InvalidTransition`；创建并验证新 entry。 | 当前 supply command 在 B01/B02 stop。 |
| `Unavailable -> Available` without committed transition or Eligible/Complete chain | `Blocked` / `ContractViolation`；不得只凭 image ref 或 registry presence。 | MI-UP-001/007 不影响 local guard定义，但当前写路径不可达。 |
| `Available -> Unavailable` by deleting/clearing ref | no transition exists; use `Retired` or new replacement history。 | 不允许删除 local truth。 |

#### `InstantiableEntryLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / state scope | pass | `Unavailable/Available/Superseded/Retired` 与 Step 6 一致。 |
| pinned preconditions | pass | Available 需要 immutable ref、Eligible、Complete provenance 与 committed transition。 |
| downstream boundary | pass | Available 不等 consumer resolved、container launch 或 health。 |
| 测试切口 | pass | create unavailable、publish guard、retire/supersede terminal、mutable selector拒绝。 |

### 7.4 `ConsumerHandoffGapLifecycle`：`ConsumerHandoffGap`

#### 状态转换图: Member Service consumer handoff gap lifecycle

```text
[open]
  -> Open
Open
  -> Resolved  (reserved: formal consumer contract + confirmation)
  -> Stale
Stale
  -> (new gap context only)
Resolved
  -> (history terminal; runtime state not implied)
```

关键说明：

- `Open` 是当前唯一可构造的正向安全结果：它明确 exact consumer schema/ref/confirmation 尚未可验证，并只冻结 consumer handoff lane。
- `Resolved` 是 conditional reserved 状态，只有 `MI-UP-001` 关闭、正式 consumer contract/ref 与 `ConsumerConfirmationRef` 均由 owner-side safe seam 提供后才能重开；它不等 container launch、session、health 或 readiness。
- `Stale` 表示原 gap 语境不再适用于新的判断；恢复必须新建 gap context，不能 `Stale -> Resolved`。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Open` | consumer exact contract/ref/confirmation 缺失或不可验证。 | 否 | `resolve`（reserved）、`mark_stale`、`blocks_consumer_handoff`。 |
| `Resolved` | formal contract 和 safe confirmation 已闭合该 gap。 | 是（local handoff observation） | 只读 history；不推断运行时状态。 |
| `Stale` | 旧 gap 不再支撑新的 consumer 判断。 | 是 | 只读 history；new gap context。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `ConsumerHandoffGap::open(...)` | `ResolveInstantiableEntryFlow` / handoff reconcile future/reopen；当前 B01/B02 前不可达。 | optional local entry ref、optional consumer contract ref、明确 `ConsumerHandoffGapKind`、safe reason/time；MI-UP-001 下不猜 contract。 | lifecycle=`Open`，resolution/confirmation为空。 | future: local gap save and trace only；不修改 entry availability。 | `Validation` / `ContractViolation`。 |
| `Open` | `Resolved` | `resolve(ConsumerContractRef, ContractResolutionRef, ConsumerConfirmationRef)` | **reserved/reopen only** after MI-UP-001 formal closure。 | all three typed refs non-self/owner-valid；formal contract and confirmation relation verified；no stale marker。 | lifecycle=`Resolved`，写 refs，清理 open reason as defined。 | future: local gap update/history; no container/runtime call or outbound. | `InvalidTransition` / `ContractViolation` / `Blocked`。 |
| `Open` | `Stale` | `mark_stale(SafeReason)` | handoff reconcile future/reopen；current不可达。 | prior gap no longer applies or source changed; reason non-empty。 | lifecycle=`Stale`、写 reason。 | future: local history only; new gap required for next judgment。 | `InvalidTransition` / `Validation`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Stale -> Resolved` 或 `Resolved -> Open` | `InvalidTransition`；new gap context required。 | MI-UP-001/B01/B02 prohibit current resolve path。 |
| image entry `Available` alone -> `Resolved` | `Blocked` / `ContractViolation`；必须有 formal consumer refs/confirmation。 | 不调用 Member Service adapter。 |
| container/session/health observation作为confirmation | `ContractViolation`；这些属于 runtime/member owner，不是本仓 handoff truth。 | 当前无 consumer read。 |

#### `ConsumerHandoffGapLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / state scope | pass | `Open/Resolved/Stale` 与 Step 6 一致，未引入 Delivered/Ready。 |
| pending consumer contract | pass_with_pending | MI-UP-001 keeps Resolved reserved; current path only marker/gap semantics. |
| local supply separation | pass | gap 不改变 `InstantiableEntry` lifecycle 或其 history。 |
| 测试切口 | pass | open requires reason、resolved requires three refs、stale cannot revive、entry availability cannot close gap。 |

### 7.5 SupplyEntry 批次停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| availability / entry / consumer gap 是否独立 | pass | 三个 local subject 各自有状态图、转换矩阵、非法边和停审。 |
| positive 状态边界 | pass | Committed 仅 local history，Available 仅 pinned supply，Resolved 仅 future handoff observation。 |
| rollback / replacement | pass | 通过新 transition/entry/gap context，不原地复活或删除历史。 |
| 外部 owner / runtime 边界 | pass_with_pending | MI-UP-001/007、Builder/Registry refs 与 container/runtime truth 均未被本仓拥有。 |
| 当前写路径 | pass_with_blocker | B01/B02 前所有 supply mutation、consumer assessment 和 trace/replay 均不可达。 |

## 8. 状态族 10.5：ReferenceDerived

### 8.1 模块思考与写入判断

ReferenceDerived 承担三种彼此正交的 local maintenance truth：`ExternalReferenceSnapshot` 对某一声明用途的 body-free source observation、`ContractGap` 对特定 owner seam/lane 的 fail-closed 缺口，以及 `ProjectionFreshness` 对派生读模型与 committed image truth watermark 的关系。`ImageDerivedReadModel` 本身不拥有 lifecycle；`ImageTraceRecord` 是 append-only 解释记录；两者不另造状态机。

本族的 refresh、rebuild、reconcile Job 在 B01/B02 前均不可读写。`ReferenceValidity::Valid` 只对 exact `use_kind` 有效；`ContractGap::Resolved` 必须有 formal resolution ref；`ProjectionFreshness::Fresh` 只表示 watermark 对齐。任何 cache、fake、projection、ACK、tag、owner body 或猜测都不能成为正向 source。

### 8.2 `ReferenceValidity`：`ExternalReferenceSnapshot`

#### 状态转换图: declared-use external reference validity

```text
[capture]
  -> Valid | Stale | Conflict | Unavailable
Valid
  -> Stale | Conflict | Unavailable
Stale / Conflict / Unavailable
  -> (new capture context only)
```

关键说明：

- capture 的初始 validity 由 approved safe conclusion 映射，不得默认 `Valid`；同一 snapshot 只服务一个声明用途。
- invalidate 只允许从 Valid 进入非 Valid；恢复必须新 capture，并可通过 `superseded_by` 建立 replacement relation，不覆盖旧 observation。
- 该状态轴也被 `MappingSourceSnapshot`、`SeedPlacementBinding` 复用；它们不在此重复拥有独立 lifecycle。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Valid` | source snapshot 对声明的 local use 可安全使用。 | 否（可失效） | `is_usable_for`、`invalidate`、`supersede`。 |
| `Stale` | 仅解释历史，不能支持新 positive decision。 | 是（本 snapshot context） | 只读；new capture。 |
| `Conflict` | owner、identity、revision 或结论冲突。 | 是 | 只读；new capture。 |
| `Unavailable` | source 当前无法读取或验证。 | 是 | 只读；new capture。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Valid` / `Stale` / `Conflict` / `Unavailable` | `ExternalReferenceSnapshot::capture(...)` | `RefreshExternalReferenceSnapshotsFlow` future/reopen；当前 B01/B02 前不可达。 | body-free source ref、single `ReferenceUseKind`、approved `SafeReferenceConclusion`、capture time；结论与 validity/reason 配对。 | 固化 source/use/conclusion，写对应 validity；不存 source body。 | future: new snapshot save；非 Valid 可关联 lane gap；当前零写。 | `Validation` / `ContractViolation` / `Blocked`。 |
| `Valid` | `Stale` / `Conflict` / `Unavailable` | `invalidate(ReferenceValidity, SafeReason)` | refresh/reconcile future/reopen。 | target 非 Valid；reason 非空；失效理由来自 safe source/guard，不能由 cache guess。 | validity/reason 更新；不改 source ref/conclusion。 | future: versioned snapshot save; affected positive lane remains blocked; no core truth writeback. | `InvalidTransition` / `Validation`。 |
| any existing state | replacement relation (no new enum state) | `supersede(ExternalReferenceSnapshotRef, SafeReason)` | refresh future/reopen。 | replacement non-self and separately captured; reason present。 | preserve old snapshot; write replacement ref/reason。 | future: save new snapshot separately; no in-place validity restoration。 | `InvalidTransition` / `Conflict`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Stale/Conflict/Unavailable -> Valid` | `InvalidTransition`；new capture required。 | source resolver/repository unavailable before B01/B02。 |
| `ReadOnlyExplanation` snapshot used for build/qualification/supply positive guard | `ContractViolation` / `Blocked`；exact use mismatch cannot pass。 | no cross-use adapter call. |
| cache/fake/projection body used as `SafeReferenceConclusion::VerifiedUsable` | `ContractViolation`；only approved owner safe seam can provide conclusion。 | Q-MI-003 and pending owner contracts remain open. |

#### `ReferenceValidity` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / subject | pass | `Valid/Stale/Conflict/Unavailable` 与 Step 6 一致；mapping/seed binding 作为同一状态轴载体。 |
| use isolation | pass | valid 只对 exact declared use 有效，不跨 lane。 |
| recovery / source boundary | pass | non-valid 不原地复活；owner body、cache、fake 未被纳入。 |
| 测试切口 | pass | conclusion→initial state mapping、invalidate、new capture recovery、cross-use rejection、B01 no resolver/write。 |

### 8.3 `ContractGapLifecycle`：`ContractGap`

#### 状态转换图: lane-scoped cross-owner contract gap

```text
[open]
  -> Open
Open
  -> Blocked
  -> Resolved  (reserved: formal resolution ref)
  -> Expired
Blocked
  -> Resolved  (reserved: formal resolution ref)
  -> Expired
Resolved / Expired
  -> (new gap context only)
```

关键说明：

- `ContractGap` 只冻结 `affected_lane`，不是全局 ready flag；它不能删除或降级相邻对象的 local truth。
- `Resolved` 需要 owner-controlled formal `ContractResolutionRef`，不能由本仓配置、fake、cache、ACK、projection 或兄弟项目未停审草稿关闭。
- `Expired` 是旧判断失效，不是隐式 reopen；新的判断必须创建新 gap。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Open` | gap 已记录，等待 owner-controlled resolution。 | 否 | `block`、`resolve`（reserved）、`expire`、`affects`。 |
| `Blocked` | 受影响 positive lane 被明确冻结。 | 否（可 formal resolve/expire） | `resolve`（reserved）、`expire`、`affects`。 |
| `Resolved` | formal resolution ref 已验证 gap closure。 | 是（本 gap context） | 只读；new decision context。 |
| `Expired` | 旧 gap context 过期，不能继续支撑判断。 | 是 | 只读；new gap context。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `ContractGap::open(...)` | any future source/Artifact/consumer/event/adapter boundary flow；当前 B01/B02 前不可达。 | explicit seam kind/owner/affected lane/reason/time；lane 非 global；不把 B01 自身伪存为 gap。 | lifecycle=`Open`，resolution/expiry fields为空。 | future: local gap save/trace; only affected lane blocked; no external mutation. | `Validation` / `ContractViolation`。 |
| `Open` | `Blocked` | `block(SafeReason)` | future flow after a gap is observed。 | reason identifies missing/stale/conflicting/unavailable condition; same gap still Open。 | lifecycle=`Blocked`、更新 reason。 | future: local gap save; no unrelated lane changes。 | `InvalidTransition` / `Validation`。 |
| `Open` / `Blocked` | `Resolved` | `resolve(ContractResolutionRef)` | **reserved/reopen only** after formal owner contract closure。 | non-empty formal resolution ref; owner/seam/lane relation matches; no expired context。 | lifecycle=`Resolved`、写 resolution_ref、清除 expiry。 | future: local gap save; caller must create new decision context; no owner mutation. | `InvalidTransition` / `ContractViolation` / `Blocked`。 |
| `Open` / `Blocked` | `Expired` | `expire(SafeReason)` | maintenance/reconcile future/reopen。 | reason explains why old gap no longer applies; no formal resolution attached。 | lifecycle=`Expired`、写 expiry_reason。 | future: local history only; next judgment uses new gap. | `InvalidTransition` / `Validation`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Resolved/Expired -> Open/Blocked` | `InvalidTransition`；new gap context required。 | no gap mutation currently reachable. |
| `ContractGap` resolve by configuration, sibling draft, fake or ACK | `ContractViolation` / `Blocked`；formal resolution ref required。 | MI-UP-001/007/005 and Q-MI-* remain pending. |
| one gap used to set global system readiness | `ContractViolation`；only its exact `affected_lane` may be frozen。 | no `GlobalState` exists or is introduced. |

#### `ContractGapLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / state scope | pass | `Open/Blocked/Resolved/Expired` 与 Step 6 一致。 |
| lane / owner boundary | pass | seam、owner、lane 显式；不引入全局 ready。 |
| resolution pending | pass_with_pending | `Resolved` reserved for formal owner ref; current gap writes blocked by B01/B02。 |
| 测试切口 | pass | open lane、block、formal resolve only、expire terminal、no global readiness/no fake closure。 |

### 8.4 `ProjectionFreshnessLifecycle`：`ProjectionFreshness`

#### 状态转换图: read-only projection freshness lifecycle

```text
[start]
  -> Stale
Stale
  -> Rebuilding
  -> Unavailable
Rebuilding
  -> Fresh
  -> Stale
  -> Unavailable
Fresh
  -> Stale
Unavailable
  -> (new rebuild context or explicit future recovery; no current path)
```

关键说明：

- `Fresh` 只表示 read model 已追上 declared committed-truth watermark，不表示业务 ready、entry available、Artifact accepted 或 consumer/runtime health。
- `begin_rebuild` 必须从 `Stale` 开始并读取 committed truth；`mark_fresh` 只能在重建结果与 source watermark 对齐时发生。
- Step 6 尚未提供从 `Unavailable` 的正式恢复函数；本矩阵不虚构恢复边。当前 `ProjectionFreshness::Unavailable` 只能作为显式读侧结果，后续需在 Step 11~14 或重开时定义 recovery。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Fresh` | view 与 committed truth watermark 对齐。 | 否（truth 变化可 stale） | query read、`mark_stale`。 |
| `Stale` | view 可读但落后 watermark。 | 否 | query read、`begin_rebuild`、`mark_unavailable`。 |
| `Rebuilding` | 正在从 committed truth 重建 view。 | 否 | `mark_fresh`、`mark_stale`、`mark_unavailable`。 |
| `Unavailable` | view 当前不可服务。 | 是（当前契约无恢复边） | 只读；等待后续正式 recovery 设计。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Stale` | `ProjectionFreshness::start(...)` | `RebuildImageDerivedViewsFlow` future/reopen；当前 B01/B02 前不可达。 | projection kind 在允许集合；committed source watermark 已提供；不默认 Fresh。 | lifecycle=`Stale`，reason/gap按初始语境保守设置。 | future: local marker save; no view truth mutation. | `Validation` / `ContractViolation`。 |
| `Fresh` / `Rebuilding` | `Stale` | `mark_stale(TruthWatermark, SafeReason)` | local truth commit / rebuild future/reopen。 | newer committed watermark或重建失败 reason；watermark不能倒退。 | lifecycle=`Stale`、更新 watermark/reason、清除不适用 rebuild time。 | future: versioned freshness save; no core truth writeback. | `InvalidTransition` / `Conflict`。 |
| `Stale` | `Rebuilding` | `begin_rebuild(TruthWatermark)` | `RebuildImageDerivedViewsFlow` future/reopen。 | source watermark 来自 committed local truth；现有 marker 确认 stale；不从 view/cache 读取 source。 | lifecycle=`Rebuilding`、更新 source watermark。 | future: load truth snapshot, rebuild view, then mark fresh/unavailable; current no calls. | `InvalidTransition` / `ContractViolation`。 |
| `Rebuilding` | `Fresh` | `mark_fresh(TruthWatermark, UtcTimestamp)` | rebuild future/reopen。 | rebuilt view与committed truth watermark exact match；rebuild time由app clock提供。 | lifecycle=`Fresh`、清除 gap/reason、写 last_rebuilt_at。 | future: save view+marker; projection remains read-only; no readiness claim. | `InvalidTransition` / `Conflict`。 |
| `Stale` / `Rebuilding` | `Unavailable` | `mark_unavailable(ContractGapRef, SafeReason)` | rebuild/read maintenance future/reopen。 | local gap ref与projection lane匹配；reason存在；source/view不可安全服务。 | lifecycle=`Unavailable`、写 gap/reason。 | future: expose unavailable query surface; no truth mutation. | `InvalidTransition` / `Validation`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Unavailable -> Fresh/Rebuilding` | 当前无正式 recovery method；返回 `InvalidTransition`/`Unavailable`，等待后续 Step 重开。 | 不虚构恢复路径。 |
| `Fresh -> Rebuilding` without first `mark_stale` | `InvalidTransition`；先由 committed watermark 变化标 stale。 | current rebuild flow unreachable. |
| mark_fresh with projection/cache/fake watermark | `ContractViolation`；必须 committed truth watermark exact match。 | B01/B02 prevent truth snapshot read. |

#### `ProjectionFreshnessLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / methods | pass_with_pending | four variants and Step 6 methods covered; `Unavailable` recovery intentionally not invented. |
| truth direction | pass | committed truth → projection only; no writeback. |
| Fresh semantics | pass | watermark consistency only, never readiness. |
| 测试切口 | pass | start stale、stale→rebuilding→fresh、failure→unavailable、watermark mismatch、query no-write、unavailable no fabricated recovery。 |

### 8.5 ReferenceDerived 批次停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 三个 lifecycle subject 是否独立 | pass | external snapshot、contract gap、projection freshness 各自独立；trace/read model 不重复造 machine。 |
| source / lane / projection boundary | pass | exact use、affected lane、committed watermark 明确；无 global state 或 writeback。 |
| pending recovery | pass_with_pending | formal resolution、source adapter、projection unavailable recovery 仍需后续 Step/owner contract；当前不伪造。 |
| 当前写路径 | pass_with_blocker | B01/B02 前 refresh/rebuild/gap/trace/replay 均不可达。 |

## 9. 状态族 10.6：application 幂等与 entry boundary technical state

### 9.1 模块思考与写入判断

这一批只纳入 Step 6 已定义、且 Step 9 flow 会推进或暴露的两种 technical state：`ImageIdempotencyRecord` 的 replay reservation lifecycle，以及 `InboundContractMarker` 的当前 fail-closed inbound boundary disposition。`StoredImageOperationResult` 只是 metadata shell，`ImageOperationChannel`、`ImageUnitOfWorkMode`、`ImageJobActionKind`、adapter slot/config/composition state 都是分类/后续 composition subject，不被伪装为本 Step 的 execution state machine。

由于 `CanonicalImageOperationInput`/mapper 和合法 `ImageOperationResultRef` 构造均未闭合，B01/B02 使 command/job reservation、complete、conflict persistence 完全不可达。条件 inbound 目前无 request DTO、envelope、receipt、dedup 或 accepted path，仅能读取/映射 marker 且 `accepted_input=false`。

### 9.2 `ImageIdempotencyLifecycle`：`ImageIdempotencyRecord`

#### 状态转换图: technical local replay reservation lifecycle

```text
[reserve]
  -> Reserved
Reserved
  -> Completed
  -> Conflict
Completed / Conflict
  -> (terminal; new key/record context only)
```

关键说明：

- record 不保存 request/event/job body，也不代表 domain truth、image digest、consumer receipt、job run/report 或 external execution。
- `Completed` 仅连接一个 local stored result ref；duplicate 必须读取 replay result，不得重跑 domain transition、page scan、resolver 或 adapter。
- B01/B02 前 `reserve/complete/mark_conflict` 都是 future/reopen mapping。Query 永不 reserve。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Reserved` | stable key 已为一个 write operation 保留，尚无 replayable stored result。 | 否 | `matches`、`complete`、`mark_conflict`。 |
| `Completed` | operation 已连接同 operation name 的 local stored result。 | 是 | `matches`、replay lookup only。 |
| `Conflict` | 同一 key 对应不同 operation 或 stable input context。 | 是 | safe conflict surface only。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Reserved` | `ImageIdempotencyRecord::reserve(...)` | command/job future accepted path；当前 B01/B02 前不可达。 | validated non-query `ImageOperationContext` with complete metadata; future canonicalizer supplied body-free `StableOperationInputRef`; app ID/time。 | write key/channel/name/stable input; lifecycle=`Reserved`; result/conflict empty。 | future: local reservation in UoW; no domain mutation merely by reserve。 | `Validation` / `ContractViolation` / `Conflict`。 |
| `Reserved` | `Completed` | `complete(ImageOperationResultRef)` | future successful/local-disposition result persistence。 | matching stored local result shell exists and operation name matches; result ref is legally constructed only after B02 closure。 | lifecycle=`Completed`、bind result_ref、clear conflict reason。 | future: atomically store/refer replay result per later persistence design; no external receipt/report. | `InvalidTransition` / `Conflict` / `Validation`。 |
| `Reserved` | `Conflict` | `mark_conflict(ImageIdempotencyConflictReason)` | future duplicate/key-reuse path。 | same key is observed with mismatching channel/name/stable input; safe reason excludes raw body。 | lifecycle=`Conflict`、write conflict_reason、clear result_ref。 | future: local conflict surface only; no domain work retry。 | `InvalidTransition` / `Validation`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| `Completed` / `Conflict -> Reserved` | `InvalidTransition`；new key/record required。 | B01/B02 preclude any record mutation. |
| Query creates or reads reservation as side effect | `assert_query_no_write` / `ContractViolation`；query has no idempotency reservation。 | Query flow is read-only. |
| Duplicate re-executes operation after Completed | `Conflict` / protocol replay handling; must lookup stored result。 | no current replay path exists until B02 closes. |
| stable input treated as image digest/signature | `ContractViolation`; it is a body-free matching ref only。 | no digest is fabricated. |

#### `ImageIdempotencyLifecycle` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / subject | pass | `Reserved/Completed/Conflict` and factory/member methods align with Step 6. |
| B01/B02 boundary | pass_with_blocker | no canonical input/result ref means no reservation/store mutation is currently legal. |
| domain separation | pass | state is technical replay only; no domain/Artifact/consumer/external success meaning. |
| 测试切口 | pass | reserve requires write metadata、complete match、conflict clears result、terminal no reuse、query no reservation、duplicate no rerun。 |

### 9.3 `InboundContractState`：`InboundContractMarker`

#### 状态转换图: conditional inbound boundary disposition

```text
[unavailable]
  -> Unavailable
[rejected]
  -> Rejected
[reopen_required]
  -> ReopenRequired
all states
  -> (no accepted transition in current contract)
```

关键说明：

- 三种 marker 都是 boundary disposition，不是 broker/message/process lifecycle；它们不表示 event arrival、receipt、dedup、topic、worker started 或 source refresh outcome。
- Step 9 两条 conditional inbound flow 只 inspect marker，固定 `accepted_input=false`；它们不能改变 marker，也不创建 BuildIntent、snapshot、candidate、gap、trace、UoW 或 replay record。
- `ReopenRequired` 是设计重开提示，不是 `Accepted`、`Ready` 或等待可自动变正向的状态。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---:|---|
| `Unavailable` | formal inbound authority/schema 当前不可用。 | 是（当前 entry contract） | inspect/mapping to safe rejection only。 |
| `Rejected` | future input 不能通过 owner/identity/version/schema 验证。 | 是 | inspect/mapping to safe rejection only。 |
| `ReopenRequired` | 需要 formal contract 关闭后重新审查 worker entry。 | 是（当前 contract） | inspect/mapping to reopen disposition only。 |

| From | To | 触发函数 | Step 9 flow / 当前可达 | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unavailable` | `InboundContractMarker::unavailable(SafeReason, UtcTimestamp)` | worker composition / both marker-only inbound flows。 | MI-UP-005 absent authority/schema diagnosed with safe reason。 | construct in-memory/local marker disposition；no inbound body。 | current flow only calls `inspect_inbound_boundary`; returns `accepted_input=false`; no write。 | `Validation` / `Unavailable`。 |
| factory | `Rejected` | `InboundContractMarker::rejected(SafeReason, UtcTimestamp)` | future prevalidation failed marker path；currently no inbound payload surface。 | a future input failed owner/identity/version/schema validation; reason safe。 | construct marker disposition; no envelope/receipt/dedup. | marker inspection maps rejected result; no domain mutation。 | `Validation` / `ContractViolation`。 |
| factory | `ReopenRequired` | `InboundContractMarker::reopen_required(Option<SafeReason>, UtcTimestamp)` | current marker-only flows。 | formal contract is not yet usable but future review point is explicit。 | construct marker disposition; no accepted capability。 | returns `accepted_input=false`; requests later Step 7~9 reopen。 | no transition error; any attempt to accept is `ContractViolation`。 |

| 非法转换 / 请求 | 处理 | 当前 boundary |
|---|---|---|
| any marker state -> accepted inbound write | `ContractViolation` / safe boundary result; no `Accepted` enum exists。 | MI-UP-005 blocks positive input. |
| marker creates envelope/receipt/dedup/intent/snapshot/candidate | prohibited by worker boundary; return no-write disposition。 | current two flows have no input payload. |
| one inbound family reuses another's marker or default marker | `ContractViolation` / `Unavailable`; explicit named boundary required。 | no broker fallback or marker mint on query. |

#### `InboundContractState` 单状态机停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / subject | pass | `Unavailable/Rejected/ReopenRequired` match Step 6 and are dispositions, not event truth. |
| current flow alignment | pass | both Step 9 flows are marker-only and `accepted_input=false`. |
| inbound blocker | pass_with_reopen_only | MI-UP-005 must close before a new accepted state/schema/dedup contract can be designed. |
| 测试切口 | pass | all marker variants reject writes、no payload parameter、no UoW/repository/idempotency call、no receipt/event truth。 |

### 9.4 Technical state 批次停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| state-subject selection | pass | idempotency record and inbound marker have Step 6 enum + Step 9 flow; result shell/action marker/config/assembly excluded/deferred. |
| current write capability | pass_with_blocker | B01/B02 block idempotency writes; inbound remains no-write by MI-UP-005. |
| no fabricated technical truth | pass | no scheduler/run/receipt/result body/digest/report/evidence/readiness added. |
| test / error mapping | pass | `InvalidTransition` maps through existing protocol mapping; entry invalid input stays `ContractViolation`/`Unavailable`. |

## 10. 状态机跨审计、回填草稿与 Step 10 停审

### 10.1 跨状态机命名、触发、错误与测试审计

| 审计项 | 结论 | 证据 / 缺口与处置 |
|---|---|---|
| 状态主语完整性 | pass | 20 个 Step 6 lifecycle subject 已逐机展开：3 DefinitionAssembly、4 BuildCandidate、4 Qualification、3 SupplyEntry、3 ReferenceDerived、1 idempotency、1 inbound marker、family/variant共用 DefinitionLifecycle但仍保持独立 local subject。分类 enum、ref/DTO/trace/read model/job marker/infra composition均已排除或 deferred。 |
| 无全局状态机 | pass | 未新增 `GlobalState`、`SystemState`、`Ready` 或 image总生命周期；跨对象关系仅通过 typed ref、guard、gap、history、watermark 或 read-only projection表达。 |
| 同名/近义状态 | pass | `Complete`只用于 baseline/snapshot/provenance的各自 local axis；`Accepted`分属 intent/Artifact且均已限定；`Available`只属于 local entry；`Resolved`只属于 definition或 future consumer/gap owner semantics，未被合并成 readiness。 |
| 正向状态边界 | pass_with_pending | `Buildable`≠intent Accepted≠attempt Succeeded≠candidate Formed≠provenance Complete≠gate Passed≠Eligible≠Artifact Accepted≠entry Available≠consumer Resolved≠projection Fresh。每个正向值均有 local subject、guard和外部 blocker说明。 |
| trigger 覆盖 | pass_as_reopen_mapping | 每条边均回指 Step 6 factory/member 与 Step 9 command/job/reconcile/rebuild/query/marker flow；无 generic setter。B01/B02 前仅 query或 marker inspection 可实际运行。 |
| 非法转换错误 | pass | lifecycle非法边统一 `DomainError::InvalidTransition(SafeReason)`，Step 8 映射 `ImageProtocolErrorKind::InvalidTransition`；输入/owner/ref问题保留 `Validation`、`WrongReferenceKind`、`Blocked`、`Conflict`或 protocol `ContractViolation`，不把所有失败误写为 state transition。 |
| domain 与 application 副作用分离 | pass_with_pending | domain method只改自身字段。future application accepted path才可按后续 Step 11~13收敛 save/version/trace/replay/projection；本仓无 outbox/publisher/delivery。当前 B01/B02 使全部 write side effect为零。 |
| query / projection 纪律 | pass | ten Query flows只读；query不得改变 lifecycle、reserve、refresh/rebuild或开 gap。`ProjectionFreshness::Fresh` 仅 watermark 对齐，projection不得反写 truth。 |
| inbound / job discipline | pass_with_blocker | inbound固定 marker-only且 `accepted_input=false`；job仅 bounded action marker/boundary→B01。无 scheduler/run/cursor/lease/report/evidence/digest/receipt state。 |
| replacement 与 terminal | pass | enum有 `Superseded`者按正式 transition；只有 `superseded_by` 而无 enum variant者按 history relation，不伪造状态。`Unknown`、`Invalid`、`Conflict`、`Stale`等恢复均按 new context 或明确 future formal resolution。 |
| phase reserved 调用 | pass_with_pending | Artifact `Accepted`、consumer `Resolved`、gate `Passed`、entry `Available`等正向边均写明 future/reopen或 reserved 条件；当前没有调用。`ProjectionFreshness::Unavailable` 无 recovery function，明确留待后续设计。 |
| 测试 / 验收名称一致性 | pass | 测试切口使用 Step 6 enum正式名称；不使用“镜像就绪”“发布完成”“运行中”等口语同义状态。具体测试设计留 Step 16，实施/验收不得将 future positive state写成当前事实。 |

### 10.2 跨状态机不变量与 future 触发链

```text
DefinitionLifecycle::Resolved
  + BaselineCompleteness::Complete
  + VariantRevisionLifecycle::Buildable
    -> BuildIntentLifecycle::Accepted (future only)
    -> BuildSnapshotLifecycle::Complete (future only)
    -> BuildAttemptLifecycle::Succeeded (safe observation only)
    -> CandidateLifecycle::Formed
    -> ProvenanceLifecycle::Complete
  + GateEvaluationLifecycle::Passed
    -> EligibilityLifecycle::Eligible
    -> InstantiableEntryLifecycle::Available (local supply only)
    -> ConsumerHandoffGapLifecycle::Resolved (separate reserved contract only)
```

关键说明：

- 此图是跨 machine **guard dependency**，不是全局状态机、自动执行链或 current fact；每条箭头仍要求独立 factory/method、exact local reads、future persistence design和对应 blocker解除。
- Artifact handoff 与 consumer handoff从 `Eligible`/`Available` 后各自独立：Artifact `Accepted`要求 `MI-UP-007` formal resolution；consumer `Resolved`要求 `MI-UP-001` formal contract/confirmation。二者不互相推导。
- `ReferenceValidity`、`ContractGap`、`ProjectionFreshness`是横切 local guard/visibility axes，不能被读成上述链中的“统一失败/成功”状态。
- B01/B02 当前在 write chain 入口前切断所有 command/job transition；上图不能被视为已有 build、digest、Artifact、consumer或运行时结果。

| 跨对象规则 | 当前正式口径 | 当前可执行性 |
|---|---|---|
| definition 到 revision | `Resolved` definition 与 `Complete` baseline才可 future validate revision；definition resolved不自动使 revision buildable。 | B01/B02 前零写。 |
| revision 到 build | only `Buildable` revision can future request intent；intent accepted不表示 handoff/attempt。 | B01/B02 前零写。 |
| build 到 candidate | safe outcome `Succeeded`仍需 complete snapshot、correlation和 immutable identity guard；Unknown/Unavailable无 candidate。 | Q-MI-003 + B01/B02 阻断。 |
| candidate 到 qualification | Formed candidate只打开 qualification context；provenance、gate、eligibility逐机独立。 | Q-MI-004 + B01/B02 阻断。 |
| qualification 到 supply | only same-candidate `Eligible` + `Complete` provenance may enter EntryPinGuard；不自动 publish entry。 | B01/B02 阻断。 |
| supply 到 consumer | Available entry不等 consumer handoff；consumer gap是独立 lane。 | MI-UP-001 + B01/B02 阻断。 |
| qualification 到 Artifact | Eligible不等 Artifact acceptance；handoff record和 ContractGap独立。 | MI-UP-007 + B01/B02 阻断。 |
| reference / gap effects | invalid snapshot或open/blocked gap只冻结 exact lane；不改写 existing truth或设 global ready。 | current read-only/marker only。 |
| projection effects | committed truth changed/rebuild failure影响 freshness，不反向改变 domain state。 | query可读既有 marker；job write被 B01/B02 阻断。 |

### 10.3 Step 10 回填草稿（禁止当前装配正式 03）

以下草稿仅摘录已收稳的状态机结论，目标位置为正式 `03-详细设计.md` 第 9 章“状态机与转换矩阵”。正式正文装配仍受 Step 19 与项目级文档门禁阻断，本 Step 不写入正式文件。

#### 9. 状态机与转换矩阵

> 校准来源：
> - `design-calibration/03_ddd_step_10_state_matrices.md`
>
> 延伸阅读：
> - 建议阅读上述中间产物的“状态主语筛选与状态族分组”“逐状态机停审记录”“跨状态机命名、触发、错误与测试审计”和“待确认事项”，了解状态契约、phase boundary 与未闭合依赖的来源。

本仓没有全局镜像生命周期。状态按 local owning object 分为 DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived、application replay 与 conditional inbound boundary。所有状态名必须与模块 enum 一致，非法 lifecycle transition 返回 `DomainError::InvalidTransition(SafeReason)` 并映射为 `ImageProtocolErrorKind::InvalidTransition`；domain method 只修改自身对象。除 read-only Query 和 marker-only inbound inspection 外，当前 Command/Job 在 `DDD-S9-B01/B02` 前不产生状态迁移、UoW、持久化、trace、gap、projection、stored result、external adapter 或 outbound effect。

| 状态族 | local state machines | 核心状态边界 |
|---|---|---|
| DefinitionAssembly | `DefinitionLifecycle`（family / variant）、`BaselineCompleteness`、`VariantRevisionLifecycle` | Resolved/Complete/Buildable 分别只表示定义、静态输入、revision buildability；不表示 build 或 supply。 |
| BuildCandidate | `BuildIntentLifecycle`、`BuildSnapshotLifecycle`、`BuildAttemptLifecycle`、`CandidateLifecycle` | Accepted≠handoff；Succeeded≠candidate；Formed≠eligibility。Unknown 不能普通 retry。 |
| Qualification | `ProvenanceLifecycle`、`GateEvaluationLifecycle`、`EligibilityLifecycle`、`ArtifactHandoffLifecycle` | Complete≠Passed≠Eligible≠Artifact Accepted；gate/Artifact owner truth外置。 |
| SupplyEntry | `AvailabilityTransitionLifecycle`、`InstantiableEntryLifecycle`、`ConsumerHandoffGapLifecycle` | Committed仅 local history，Available仅 immutable pinned supply，Resolved仅 future consumer handoff observation。 |
| ReferenceDerived | `ReferenceValidity`、`ContractGapLifecycle`、`ProjectionFreshnessLifecycle` | Valid仅限 declared use；gap仅冻结 affected lane；Fresh仅表示 committed-truth watermark 对齐。 |
| Technical | `ImageIdempotencyLifecycle`、`InboundContractState` | replay record不代表 domain success；inbound marker固定 `accepted_input=false`，无 accepted event state。 |

关键转换规则：

- terminal/negative context 不原地复活。`Blocked`、`Invalid`、`Conflict`、`Unknown`、`Stale`、`Retired`、`Superseded` 等恢复使用新 local context、replacement relation或正式 owner resolution；不得覆盖历史。
- 有 `superseded_by` 但没有 `Superseded` enum 的 `BuildAttempt`、`GateEvaluation`、`EligibilityDecision` 仅记录 replacement/history relation，不能新增隐含状态。
- `ArtifactHandoffLifecycle::Accepted` 与 `ConsumerHandoffGapLifecycle::Resolved` 是保留的 future 状态，分别需要 `MI-UP-007`、`MI-UP-001` 的正式合同闭口；当前不可构造。
- `ProjectionFreshnessLifecycle::Unavailable` 当前没有正式恢复函数；不得私自写出恢复 transition。
- 任何 `latest`、mutable tag、raw body、cache/fake、adapter ACK、registry presence、container/runtime state都不能替代 immutable ref、safe conclusion、formal resolution 或 committed truth watermark。

### 10.4 待确认事项

| ID | 待确认 / blocker | 受影响状态机 | 当前处置 | 重开条件 |
|---|---|---|---|---|
| `DDD-S9-B01` | 缺 concrete `CanonicalImageOperationInput` 与 protocol mapper。 | 全部 command/job write machines、idempotency。 | 当前只 metadata/context/marker，零 mutation。 | canonical carrier、field mapping与 Step 7~9 write sequence完成后重审。 |
| `DDD-S9-B02` | 缺合法 `ImageOperationResultRef` factory/mapper。 | command/job result、idempotency Completed、future replay。 | 不 reserve/complete/store result。 | result identity construction、stored-result mapping与 persistence boundary重审。 |
| `Q-MI-003` | Builder/Registry safe adapter/boundary未闭合。 | attempt、candidate、provenance、reference snapshot。 | Succeeded/Formed/Complete只作 future guard条件。 | owner safe conclusion/ref contract明确后重审相关 Step 7~10。 |
| `Q-MI-004` | applicable gate/evidence policy、authority与结论合同未闭合。 | gate evaluation、eligibility。 | Passed/Eligible不作为当前事实。 | owner formal authority/applicable set/safe conclusion合同闭合后重审。 |
| `MI-UP-001` | Member Service consumer contract/ref/confirmation未闭合。 | consumer handoff gap。 | 仅 Open/Stale fail-closed语义；Resolved保留。 | consumer contract、ref validation、confirmation语义和 seam classification正式闭合。 |
| `MI-UP-005` | inbound event authority/schema未闭合。 | inbound marker。 | `Unavailable/Rejected/ReopenRequired`、`accepted_input=false`。 | envelope/schema/dedup/receipt/authority全部闭合后重开 Step 7~9 与本 machine。 |
| `MI-UP-007` | Artifact handoff schema/ref/owner resolution未闭合。 | Artifact handoff。 | Pending/Gap only; Accepted保留。 | ArtifactConsumableRef + ContractResolutionRef的正式合同闭合后重审。 |
| `MI-UP-002/003/006/008` | components、Role mapping、seed/base 等 external safe inputs未闭合。 | definition/baseline/revision/snapshot/reference。 | 只用 typed ref/safe gap；不造 body/digest/pin readiness。 | owner字段/合法 ref/safe conclusion合同收稳后重审。 |
| `MI-UP-009` | outbound authority未闭合。 | 所有状态副作用。 | outbound inventory保持零。 | owner、schema/version、delivery/failed semantics与 dependency kind明确后重开 Step 5/7/8/9/10。 |
| `PF-UNAVAILABLE-RECOVERY` | projection `Unavailable` 无正式恢复函数。 | `ProjectionFreshnessLifecycle`。 | 明确无恢复边，不造 API/job。 | 后续 persistence/error/config/recovery design明确函数、truth source与 transaction语义后重审。 |

### 10.5 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| Step 10 输出齐全 | pass | 已有状态主语筛选表、状态族表、批次表、逐机状态集合/ASCII图/转换矩阵/非法处理/停审、跨审计、回填草稿、待确认与门禁。 |
| 每个状态机可回指 | pass_with_pending | 各 machine 回指 Step 6 enum/factory/member与 Step 9 flow；future write path均显式被 B01/B02或 owner blocker阻断。 |
| 未引入未定义状态 | pass | 未新增 Ready/Published/Delivered/Running/GlobalState；replacement relation未冒充 enum。 |
| 无越权副作用 | pass | 无 outbox/publisher/delivery、Artifact/member/runtime/governance truth、scheduler/report/receipt/evidence/digest或实现代码。 |
| 正式正文写入 | blocked_by_phase | 正式 `03-详细设计.md` 仅可在 Step 19 assembly 写入；本 Step 仅完成回填草稿。 |
| 下一 Step 门禁 | user_confirmation_required | Step 10 已完成并停审；只有用户明确确认后才可创建/执行 Step 11 持久化、一致性契约。 |

```text
Step 10 status = completed_stop_review
gate_status = pass
gate_reason = all selected state machines have per-machine matrices and cross-machine audit; unresolved external/write conditions remain explicit pending blockers, not state-machine defects
next_allowed_action = wait_for_explicit_user_confirmation_for_step_11
formal_03_write_allowed = false_until_step_19
implementation_allowed = false
commit_required = false
```
