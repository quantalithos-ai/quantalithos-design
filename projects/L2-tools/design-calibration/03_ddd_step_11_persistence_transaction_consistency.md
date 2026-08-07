# L2-tools 03 详细设计 Step 11: 持久化、事务与一致性契约

> 创建日期: 2026-08-05
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 回填章节: 正式 03 §10 数据持久化、事务与一致性契约
> 对标粒度: `projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 10 `completed / pass`；六个状态族已闭合。 |
| 直接输入 | Step 7 foundation/store contracts、Step 8 public carriers、Step 9 五类 flow annexes、Step 10 六类 state annexes。 |
| 本步模块顺序 | foundation/UoW -> truth stores -> assessment/attempt stores -> ProjectionStore -> replay/sidecar -> cross-store audit。 |
| 物理后端 | 未选择；本步只定义 logical persistence contract，不写 SQL、DDL、migration 或具体产品。 |
| 外部 blocker | `L2T-UP-001~009` 继续开放；外部 positive provider/status/route 不进入本地 truth schema。 |
| 正式回填 | 本步只写中间产物；正式 §10 仅在 Step 19 整体装配。 |
| 提交 | 不需要，也未获授权。 |

## 1. 本步目标与边界

本步把 Step 6 的字段/状态、Step 7 的七个 logical Store 与 foundation port、Step 9 的 phase/UoW 顺序、Step 10 的状态矩阵收束为实现者可直接映射到 durable adapter 和 in-memory fake 的持久化契约。契约必须同时满足：

- L2 自有 truth、消费时点 assessment、attempt、gap、projection、stored replay 各有唯一 owner。
- 更新已有 subject 只接受同一 persistence authority 返回的 `Loaded<T>.expected_version`；不得从对象内部 `version`、cursor、时间戳或猜测值生成 compare token。
- append-only fact/ref 使用稳定语义唯一键；同键同内容返回 `ExistingEqual`，同键不同内容返回 typed conflict。
- accepted local truth、audit/history、outbox/material、stale marker、stored result/receipt/report 在同一 local UoW 内原子提交；外部 side effect 在提交确认后才发生。
- projection、reference、Bus/Observation status 和 job report 是派生/外围状态，不反写 Contract、Binding、Invocation、Outcome 或 Audit truth。

本步不决定数据库隔离级别、物理索引名、队列实现、事件路由、重试次数、保留时长或部署拓扑；这些由 Step 14、04 配置设计、05 测试方案和 07 实施计划在本契约边界内继续展开。

## 2. SOP 问题回答

### 2.1 哪些数据由 L2-tools 拥有

L2 拥有工具合同/定义/演进、Binding relation、canonical invocation/admission、执行前置与本地 handoff attempt、source assessment、唯一 outcome/audit pair、安全交接 eligibility/material/local submission attempt、consistency assessment/gap，以及这些对象的 body-free view/report/projection 和 replay/entry sidecar。L2 不拥有 authorization policy truth、Hub registry truth、Sandbox environment/run/receipt、Bus delivery truth、Observability material store、Runtime loop、SDK client 或 marketplace listing。

### 2.2 哪些是 ref/snapshot/projection

`HubControlledSnapshot`、`AuthorizationResultRef`、`SandboxReadinessSnapshot`、`SandboxExecutionSourceRef`、`BusDeliveryStatusRef`、`ObservationMaterialRef`、`DefinitionSourceRef`、`SharedContractAuthorityRef` 只保存 typed locator、authority、revision、safe summary 和消费时点状态。`ReferenceConsistencyReport`、search/diff/diagnostic/guidance view 只保存可重建派生材料。外部状态被读取后必须作为新 immutable ref/assessment append；不得覆盖历史 invocation anchor 或 local outcome。

### 2.3 repository 如何提供读写面

读面分为按 identity 的 `get_*`、按语义 scope 的 bounded `list_*`、组合读取 bundle 和 projection read surface。写面分为 mutable `create_*`/`save_*`、append-only `append_*`/`insert_*`、以及由 `ProjectionStore` 明确命名的 `write_*`/`mark_affected_stale`。每个写函数接收同一 `&dyn ToolsUnitOfWork`；更新函数必须同时接收 adapter-issued `ExpectedVersion`。查询函数不隐式开启写事务、刷新外部来源或启动 rebuild。

### 2.4 哪些 flow 需要事务

所有 accepted Command/Consumer/Job local mutation、outbound continuation phase 1/2、CF-10 handoff fence、CF-12 safe-material preparation、CF-13 gap resolution、JF-03 projection target 和 JF-04 status refresh 都需要 UoW。纯 Query 只有 read snapshot，不开启写 UoW。任何 external Port call 都在本地 phase commit 之后，并且不把 UoW 传给 adapter。

### 2.5 是否需要锁、版本、outbox、projection

本设计要求 optimistic version；不把具体 row lock 当作跨后端事实。每个 mutable subject 的 compare token 来自 `Loaded<T>`；append-only uniqueness 负责去重。accepted truth 的 outbox/material/stale/replay 写入同一 UoW；publisher、feedback refresh、projection rebuild 在后续 UoW 维护自己的状态。若 commit 结果未知，必须由同一 persistence authority `resolve_commit(transaction_ref)` 判定，不能盲目重跑。

### 2.6 失败如何恢复

已知 UoW 失败回滚所有 staged local writes；projection/outbox/reference/handoff/report 的后续失败不回滚已提交核心 truth，而是写其自身 `Failed`/`Unavailable`/`RouteBlocked`/gap marker。外部 side-effect 结果未知时保存 `CallOutcomeUnknown`/`SubmissionOutcomeUnknown` 和 open gap，保持 claim 未完成，交给明确 recovery owner；不能自动再调一次。duplicate 使用 stored typed value/receipt/report replay，不重建或重跑。

## 3. 当前材料问题诊断

| 材料 | 潜在冲突/缺口 | 当前收口 |
|---|---|---|
| 旧正式 03/README | PostgreSQL/Redis/NATS、RPC/HTTP、builtin registry、executor 等旧形态与当前行动契约边界冲突。 | `historical_material`，不进入本步存储契约。 |
| Step 7 Store trait | 已有完整方法，但缺少统一的 logical key/version/UoW 语义。 | 本步按七组 Store 逐项补齐。 |
| Step 9 flows | 各 flow 已写 phase，但跨 family 的 atomic set、commit unknown 和 stale continuation 需要统一表。 | §8~§11 固定统一顺序。 |
| Step 10 state matrix | `SubmittedLocally`、`Referenced`、`Fresh` 等容易被误读为外部成功或核心状态。 | 存储对象与一致性表明确 owner 和禁止反写。 |
| 外部 blocker | Authorization/Sandbox/Bus/Observation/Core/SDK positive schema 未闭口。 | 只保存 blocked-aware ref/assessment/gap；不创建 provider 表或 status truth。 |
| 当前目标实现仓 | `/home/aris/Projects/quantalithos-tools` 不存在。 | 只写计划可创建的 logical contract，不声称已实现或已 build。 |

## 4. 设计取舍

| 议题 | 方案 | 选择与理由 |
|---|---|---|
| 物理存储 | 直接锁定某数据库/DDL；或先锁 logical store | 选择 logical store；允许 durable adapter 与 fake 保持语义等价而不伪造后端。 |
| mutable 并发 | adapter 自行决定；或统一 expected-version | 统一 `Loaded<T>.expected_version`；避免 last-write-wins 和 guessed version。 |
| immutable fact | 可更新一行；或 append-only + semantic key | append-only；历史解释不被迟到材料覆盖。 |
| outcome/audit | 两个独立写函数；或一个不可分割 pair | 使用 `insert_outcome_audit_pair`；禁止半 pair 对外可见。 |
| outbox payload | publish 时重查 current truth；或 accepted 时保存快照 | accepted 时保存 body-free payload snapshot；publisher 不重查/重构历史事件。 |
| projection failure | 回滚核心 truth；或标 stale/failed 后异步恢复 | 标记自身状态，核心 truth 保持已提交。 |
| external status | 写入 local submitted 的状态列；或独立 ref store | 独立 `BusDeliveryStatusRef`/`ObservationMaterialRef` append；不把 delivered/observed 写入 local attempt。 |
| duplicate | 重跑 service；或 replay exact stored surface | exact replay；同 digest only，异 digest conflict。 |

## 5. 结构化中间产物: 数据所有权实现表

| 数据对象/对象组 | 拥有模块/Store | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `ToolContract`, `FormalToolDefinition` | `domain::contract` / `ToolContractStore` | CF-01~04 | invocation、queries、jobs、event mapper | contract pointer、definition revision、evolution fact 在相关 UoW 一致；definition immutable revision 不覆盖。 |
| `ToolCompatibilityImpact`, `ToolContractEvolutionFact` | `domain::contract` / `ToolContractStore` | CF-02/03/04 | adopt guard、diff、outbound material、report | semantic unique key；同 key equal replay，different content conflict。 |
| `CapabilityBinding`, `CapabilityBindingChangeFact` | `domain::binding` / `CapabilityBindingStore` | CF-05~07 | invocation、queries、Hub consumers、jobs | current relation 与 successor/invalidation fact 原子；旧 anchor 不回写。 |
| `HubControlledSnapshot`, `CapabilityBindingAssessment` | `domain::binding` / `CapabilityBindingStore` | CF-05~06、IF-01、JF-01 | admission、diagnostic、guidance、reports | immutable consumption frame；source state 只追加。 |
| `ToolInvocation`, `InvocationAdmission` | `domain::invocation` / `ToolInvocationStore` | CF-08/09/11、IF-03 | precondition、outcome、query、diagnostic | 一个 invocation 至多一个 canonical admission；admission/outcome links 不得半写。 |
| `ExecutionRequirement`, authorization assessment, readiness snapshot | `domain::precondition` / `ExecutionHandoffStore` | CF-09/10、IF-02 | handoff、query、diagnostic、jobs | requirement/assessment/ref 只保存 L2 consumption fact；不保存 owner policy。 |
| `ExecutionHandoff`, `ExecutionHandoffAttempt` | `domain::handoff` / `ExecutionHandoffStore` | CF-10 | outcome source mapping、query、diagnostic | handoff eligibility 与 local attempt 分离；attempt `Prepared` 先于 side effect commit。 |
| `ExecutionSourceAssessment`, `ToolInvocationOutcome`, `ToolAuditEntry` | `domain::outcome` / `OutcomeAuditStore` | CF-11、IF-03 | query、safe handoff、diagnostic、jobs | source assessment immutable；outcome/audit pair 同 UoW、invocation 唯一终态。 |
| `SafeHandoffEligibility`, `SafeHandoffMaterial` | `domain::safe_handoff` / `ExternalSubmissionStore` | CF-12 | OF-01~04 continuation、query | four-gate target-specific；material immutable、body-free、correlated。 |
| `ExternalSubmissionAttempt` | `domain::safe_handoff` / `ExternalSubmissionStore` | OF-01~04 | IF-04/05、JF-04、query | `(material,event,target)` 单一 current local attempt；外部 status 独立 append。 |
| `BusDeliveryStatusRef`, `ObservationMaterialRef` | `domain::safe_handoff` / `ExternalSubmissionStore` | IF-04/05、JF-04 | QF-06、diagnostic、report | external status ref 与 local attempt/outcome/audit eventual consistency；unknown 不推断。 |
| `ReferenceValidityAssessment`, `ConsistencyGap` | `domain::integrity` / `ProjectionStore` | CF-13、IF/JF negative paths、OF-04 | queries、jobs、formal re-entry | assessment immutable；gap state 用 versioned save；resolved 必须 evidence+decision+owner re-read。 |
| `ReferenceConsistencyReport` | `application::integrity` / `ProjectionStore` | JF-02 | CF-03/04 closure、QF-07、jobs | report watermark/scope explicit；partial/stale/failed 不冒充 current。 |
| search/diff/diagnostic/guidance projections | `application::projection` / `ProjectionStore` | JF-03、纯 mapper | QF-02/QF-08~11 | D1 可重建；stale/rebuilding/unavailable/failed 不反写 T1/T2。 |
| `StoredCommandResult`, `IdempotencyRecord` | `application::foundation` / `IdempotencyStore` | every write flow | duplicate/replay entry | key+scope+digest unique；stored typed surface 与 referenced local facts 同 UoW。 |
| `ConsumerReceipt`, `JobReport` | `contracts` public carrier + `IdempotencyStore` | IF-01~05、JF-01~04 | worker/job replay | receipt/report 不拥有 subject truth；commit unknown 不标 committed。 |
| `ToolContract` 的 `Bus/Observation` feedback | 不属于 local core truth | IF/JF only append refs | QF-06/diagnostic | 不得新增 local delivered/observed state。 |

## 6. Logical persistence surfaces

本表定义 logical contract，不要求一个表对应一个 Store。实现 adapter 可以合并物理表，但必须保持这些 semantic key、读写隔离、版本和事务语义。

| Logical store | 持久化内容 | 主键 | 语义唯一键 | 关键读取索引/范围 | version |
|---|---|---|---|---|---|
| `ToolContractStore` | contract、definition、impact、evolution fact | `tool_id`; typed fact IDs | `(tool_id, revision)`；impact `(tool,base,candidate,basis_digest)` | current tool、revision pair、evolution scope | contract/definition mutable rows use expected version；facts append-only |
| `CapabilityBindingStore` | relation、Hub snapshot、assessment、change fact | binding/snapshot/assessment/fact IDs | current relation by `tool_id`; assessment `(binding,basis,consumption_frame)` | current by tool、Hub capability reverse scope、assessment time | relation save expected version; snapshots/assessments/facts append-only |
| `ToolInvocationStore` | invocation、admission、local outcome ref index | invocation/admission IDs | invocation ID; one admission per invocation | invocation read bundle, tool scope | canonical invocation immutable; admission append-only |
| `ExecutionHandoffStore` | requirement、auth assessment、readiness、handoff、attempt | typed IDs | requirement per invocation/anchor; attempt per handoff generation | precondition bundle, latest handoff, attempt scope | handoff/attempt versioned; assessments append-only |
| `OutcomeAuditStore` | source assessments、outcome/audit pair | assessment/outcome/audit IDs | source basis; terminal pair by invocation ID | pair by invocation, source assessment scope | pair inserted atomically; no individual outcome/audit write |
| `ExternalSubmissionStore` | eligibility、material、local attempt、Bus/Obs refs | typed IDs | eligibility source+target+check digest; material eligibility+content; attempt `(material,event,target)` | attempts by event/target; latest status by attempt | attempt versioned; refs append-only |
| `ProjectionStore` | ref assessments、gaps、reports、search/diff/diagnostic/guidance | typed projection/gap IDs | open gap canonical key; projection `(subject,scope,schema,watermark selector)` | bounded page by scope/watermark; reverse dependency index | gap versioned; projections compare/write token |
| `IdempotencyStore` | claims, stored command/consumer/job surfaces | scoped key/result IDs | `(entry_kind, operation, actor/source scope, key)` | key/digest lookup, result ref | claim record versioned; result immutable |

### 6.1 物理实现约束

- 允许将 append-only facts 和 mutable aggregate 分开物理表，也允许 adapter 在同一 transaction 中写多个 logical surface。
- 不允许把外部 provider body、Sandbox capture、Bus broker receipt、Observation body、raw secret、prompt 或 SDK response 写入上述 logical surfaces。
- 不允许把 projection 作为 invocation/admission/outcome 的 fallback truth；projection 缺失必须返回结构化 `Unavailable/Failed` surface。
- 任何物理索引都必须实现 canonical semantic key 和稳定排序；不能依赖未声明的 arrival order。

## 7. Foundation / version / commit contract

### 7.1 `ToolsUnitOfWork`

| callable | 输入/返回 | 持久化语义 | 禁止事项 |
|---|---|---|---|
| `ToolsUnitOfWorkManager::begin() -> Result<Box<dyn ToolsUnitOfWork>, UnitOfWorkError>` | 无 | 从唯一 local persistence authority 创建 transaction ref 与 immutable `CommitCandidate`。 | adapter 不得在 begin 时写业务数据或自动重试。 |
| `ToolsUnitOfWork::transaction_ref() -> &TransactionRef` | 无 | 用于同一 authority 的 commit-resolution 和 trace correlation。 | 不作为业务 identity 或外部 run ID。 |
| `ToolsUnitOfWork::commit_candidate() -> &CommitCandidate` | 无 | 给 staged result/claim 绑定 authority-issued candidate stamp；未确认前不可对外称 committed。 | 不把 candidate 当真实 commit/evidence。 |
| `ToolsUnitOfWorkManager::commit(uow) -> Result<CommitReceipt, UnitOfWorkError>` | 一个 UoW | 原子提交所有已 enlist logical writes，返回与 candidate 对称的 receipt。 | 不在 repository 内自行 commit。 |
| `ToolsUnitOfWorkManager::rollback(uow) -> Result<(), UnitOfWorkError>` | 一个 UoW | 已知失败时让 staged rows 不可见。 | rollback 后不得继续使用其 compare token。 |
| `ToolsUnitOfWorkManager::resolve_commit(transaction_ref) -> Result<CommitResolution, UnitOfWorkError>` | 同一 transaction ref | 由同一 authority 判定 committed/rolled back/unknown。 | `Unknown` 不得盲目重新写或重调外部 Port。 |

### 7.2 Version 与 append 规则

| 数据形态 | version 来源 | 写入方式 | 冲突语义 |
|---|---|---|---|
| mutable truth (`ToolContract`, `CapabilityBinding`, `ExecutionHandoff`, `ConsistencyGap`) | `Loaded<T>.expected_version` | `save_* (value, expected_version, &uow)` | `VersionConflict`，回滚当前 UoW，不覆盖现值。 |
| created mutable row | adapter create response `Loaded<T>` | `create_* (value, &uow)` | duplicate semantic key -> `UniquenessConflict`。返回 token 只能在 confirmed commit 后继续使用。 |
| immutable fact/ref/assessment | no compare token | `append_*` / `insert_*` + semantic key | same canonical content -> `ExistingEqual`; different content -> typed conflict/integrity gap。 |
| projection/report | adapter-issued projection write token or compare selector | `write_*` / `mark_affected_stale` | stale older write -> `ProjectionWriteResult::Stale`; divergent same key -> conflict。 |
| idempotency claim/result | claim `Loaded` token | `reserve` / `save_record` / `store_*` | same key/digest replay; same key/different digest conflict; in-flight remains in-flight。 |

### 7.3 Page and watermark rules

Every `list_*`/search/rebuild method accepts a typed scope and `RepositoryPageRequest { cursor,
limit,
filter_digest }`. The adapter validates cursor schema, filter digest, source watermark and stable
sort position. A Command marks only its first configured-bounded reverse-dependency page; a further
page produces `ConsistencyGap(Scope::DerivedProjection, PropagationIncomplete)` and a continuation
ref. A Job may process later pages, but cannot enlarge the original Command UoW or claim that all
pages were atomically updated.

`LocalTruthWatermark` is read-snapshot metadata, not an optimistic compare token. A projection
write must compare both its subject/schema key and declared source watermark; a newer source may
make an older projection stale but never lets the older projection overwrite a newer one.

## 8. Repository function persistence semantics

The exact callable signatures remain canonical in
`03_ddd_step_07_module_application_stores_annex.md`; this table defines the implementation
obligations for each method family.

| Method family / canonical examples | Read/write | Key and input closure | Transaction/version rule | Return/error |
|---|---|---|---|---|
| `ToolContractStore::get_contract`, `get_definition`, `get_current_bundle`, `get_definition_comparison_bundle` | read | identity or exact `(tool,base,target)`; bundle must share one watermark | no UoW; reject pointer/revision mismatch instead of partial bundle | `Option<Loaded<T>>`/bundle; `NotFound`, `SerializationConflict`, `Unavailable` |
| `create_contract`, `insert_definition`, `append_compatibility_impact`, `append_evolution_fact` | write/append | contract `tool_id`; definition `(tool,revision)`; impact basis digest; fact identity/correlation | same caller UoW; all equal duplicates canonical-compare | `Loaded<T>`/`AppendResult`; uniqueness/version/serialization errors |
| `CapabilityBindingStore::find_current_by_tool`, `get_latest_assessment_for_binding`, `list_bindings_by_hub_capability` | read | explicit tool/authority/capability scope; assessment order `(consumed_at, assessment_id)` | no external lookup; ambiguous equal ordering is conflict | bounded page/optional loaded value; cursor/scope conflict |
| `create_binding`, `save_binding`, `append_snapshot`, `append_assessment`, `append_change_fact` | write/append | mode/ref symmetry; successor ID for replacement; assessment basis frame | relation save expected version; assessment/snapshot/fact append same UoW | loaded/ref/append result; duplicate/conflict/version errors |
| `ToolInvocationStore::get_invocation_read_bundle`, `list_by_tool` | read | invocation identity or typed tool scope | no write; bundle must contain matching admission | bundle/page; half-pair/serialization conflict |
| `insert_invocation`, `append_admission` | append | invocation ID; one admission key per invocation | same UoW as outcome/audit when no-execution branch | `AppendResult<Ref>`; duplicate/conflict |
| `ExecutionHandoffStore::get_precondition_read_bundle`, latest reads | read | invocation/handoff/attempt identity; latest ordering explicit | no external calls; loaded attempt token retained for phase 2 | bundle/loaded; not found/unavailable |
| `append_requirement`, `append_authorization_assessment`, `append_sandbox_readiness` | append | invocation/anchor/source basis and consumption frame | same local UoW as resulting handoff/outcome where flow requires | ref; duplicate/conflict |
| `create_handoff`, `save_handoff`, `create_handoff_attempt`, `save_handoff_attempt` | write | handoff/attempt generation key; state transition checked in domain | expected version from exact loaded row; phase 1/2 use separate confirmed UoWs | loaded; version/transition/uniqueness errors |
| `OutcomeAuditStore::get_outcome_audit_pair` | read | terminal key `invocation_id` | no half pair exposed; historical half pair is integrity error | pair/none; serialization conflict |
| `append_source_assessment`, `insert_outcome_audit_pair` | append/atomic pair | source basis key; terminal invocation key | pair must be inserted as one operation in same UoW as admission/outcome-related replay | pair result; `ExistingEqual`/`TerminalConflict` |
| `ExternalSubmissionStore::find_eligibility`, `find_material_for_eligibility`, `find_attempt_for_event` | read | closed source key + target; material/event/target | no Port call; prepared/terminal existing attempt is returned without second call | loaded/optional; conflict if duplicate divergent rows |
| `append_eligibility`, `append_material`, `create_attempt`, `save_attempt` | write/append | four-check digest, safe-content digest, event identity | material/eligibility commit before continuation; attempt phase-2 CAS uses loaded version | ref/loaded; uniqueness/version/unknown commit |
| `append_bus_status`, `append_observation_status` | append | attempt ID + authority/status/source revision | same local refresh UoW; never mutates attempt | status ref; duplicate/conflicting source error |
| `ProjectionStore::get_*`, `search_*`, `list_projection_targets` | read | typed key/scope/schema/watermark selector | no hidden rebuild/write; empty distinct from unavailable/failed | `ProjectionRead`/page; cursor/watermark errors |
| `append_reference_assessment`, `create_gap`, `save_gap` | append/write | typed subject/basis; canonical open-gap key | assessment append; gap updates expected version | refs/loaded; invalid transition/version/conflict |
| `write_*_report/projection/view`, `mark_affected_stale` | write/maintenance | subject/schema/watermark + explicit page | same maintenance UoW; compare source watermark; first bounded page for Commands | `ProjectionWriteResult`/page; stale/conflict/unavailable |
| `IdempotencyStore::get`, `reserve`, `save_record`, `store_*`, `get_*_result` | read/write/replay | operation/actor/source scope + key + canonical digest | reserve and result/receipt/report completion same UoW as referenced facts | replay surface; in-flight/conflict/commit unknown |

### 8.1 Canonical `AppendResult`

```text
AppendResult<T>
  Inserted(T)
  ExistingEqual(T)
  Conflict(ExistingRef)
```

`ExistingEqual` is usable only after canonical field/digest equality and subject scope equality are
checked. It is not a signal to overwrite timestamps, versions, or status. `Conflict` rolls back
the current UoW when the append belongs to an atomic accepted path.

## 9. Transaction boundary and ordering contract

### 9.1 Boundary vocabulary

| Boundary | Opens | May write | Must not do | Commit meaning |
|---|---|---|---|---|
| `ReadSnapshot` | adapter read snapshot, implicit to a read call | nothing | begin a write UoW, call an external Port, repair a projection | no commit; watermark is descriptive only |
| `AcceptedCommandUow` | `ToolsUnitOfWorkManager::begin()` after deterministic pre-read | owned truth, append facts/assessments, bounded stale/gap rows, stored command result/error | external side effect, broker acknowledgement, hidden retry | one confirmed local decision |
| `ConsumerClaimUow` | worker phase 1 | idempotency claim and technical receipt marker only | source interpretation, domain mutation, external side effect | durable ownership of one source message |
| `ConsumerEffectUow` | worker phase 2 | consumption assessment/ref, owning command re-entry facts, receipt/result | acknowledge broker before commit, mutate external owner | local observation and receipt are durable |
| `PreparedSideEffectUow` | phase 1 of `CF-10`/`OF-01~04` | `ExecutionHandoffAttempt::Prepared` or `ExternalSubmissionAttempt::Prepared`, claim, immutable material ref | call Sandbox/collaboration Port | one local side-effect fence |
| `SideEffectDispositionUow` | phase 2 after Port return | local attempt disposition, status ref, gap, stored result | call Port again, rewrite source truth | local attribution of one call result |
| `MaintenanceUow` | Job after claim | projection/report/gap/status-ref maintenance | change T1 truth unless named owning Command | one bounded maintenance slice |

The adapter owns physical transaction mechanics, but the application owns boundary placement. A
repository method never commits, rolls back, nests a transaction, or invokes a Port. A
`CommitReceipt` is the only local confirmation that a staged `StoredCommandResult`, receipt, report,
or marker may be returned as committed. `CommitCandidate` is an internal correlation stamp and is
never evidence.

### 9.2 Boundary matrix by interface family

| Flow family | Pre-boundary reads | UoW sequence | Same-UoW write set | Post-commit effect |
|---|---|---|---|---|
| `CF-01~09`, `CF-11` | metadata, duplicate precheck, owned bundles, blocked-aware source reads | one `AcceptedCommandUow` | domain subject + fact/assessment/ref + bounded stale/gap + exact stored result/error | none |
| `CF-10 PrepareExecutionHandoff` | invocation/admission/precondition bundle; readiness result after named guard | `PreparedSideEffectUow` -> Port -> `SideEffectDispositionUow` | handoff + Prepared attempt + claim; then attempt disposition/outcome link + stored result | one `SandboxExecutionPort::submit_handoff` call |
| `CF-12 PrepareSafeExternalHandoff` | outcome/audit pair and four-gate inputs | one material-preparation `AcceptedCommandUow`; continuation has separate prepared/disposition UoWs | eligibility + immutable material + stored result; continuation attempt in OF flow | no collaboration call in material command; continuation later |
| `CF-13 RecordConsistencyGapResolution` | gap, assessment basis, owner re-read | pending-gap UoW -> decision UoW (or one UoW when no external re-read is needed) | assessment and versioned gap transition; stored result | none |
| `QF-01~11` | owner/visibility seed, exact Store/Projection read | none | none | none |
| `IF-01~05` | envelope/digest validation before claim | `ConsumerClaimUow` commit -> source Port/read -> `ConsumerEffectUow` | claim first; then assessment/ref, owner fact or gap, receipt/result | source acknowledgement only after effect commit |
| `OF-01~04` | material and pure event mapping | prepared UoW commit -> collaboration Port -> disposition UoW | Prepared attempt/claim; then local disposition/status/gap/result | one collaboration call |
| `JF-01~04` | job scope, claim digest, bounded target page | claim UoW -> bounded `MaintenanceUow` slices -> report UoW | target-specific assessment/projection/status/gap; final report | optional feedback Port only at named job boundary |

### 9.3 Command ordering

Every accepted Command follows this order. The exact domain method and Store methods are supplied by
the flow annex; no unnamed repository helper may be inserted between the listed stages.

```text
[entry carrier]
  -> validate metadata/request and forbidden-body rules
  -> derive canonical idempotency scope + request digest
  -> read existing idempotency record / exact subject bundle
  -> resolve required blocked-aware source refs (no local writes)
  -> begin AcceptedCommandUow
  -> reserve idempotency claim using the returned claim token
  -> construct or transition domain subject
  -> persist subject with adapter-issued expected_version
  -> append fact / assessment / outcome-audit / material as applicable
  -> mark only the first bounded derived page stale; append continuation gap if needed
  -> construct immutable typed result or typed rejection surface
  -> store result/error before completing idempotency record
  -> commit and resolve unknown with the same transaction_ref
  -> return only after candidate/receipt symmetry is confirmed
```

For `CF-03`, the old definition, candidate definition, contract pointer, adoption fact, stale page,
continuation gap and stored result are one atomic switch. For `CF-06`, the old binding, successor
binding and replacement fact are one atomic relation change. For `CF-11`,
`insert_outcome_audit_pair` is the only legal terminal write. An equal append may be reused; it never
updates timestamps, version, or state.

### 9.4 Rejected-command ordering

| Rejection class | Examples | Local write | Replay behavior |
|---|---|---|---|
| deterministic pre-write rejection | malformed request, forbidden body, missing subject, invalid state found in a read | none | no idempotency record required; response derives from current request |
| attributable terminal rejection | valid request that establishes no-execution admission, blocked source assessment, route-blocked material or integrity gap | named subject/admission/assessment/gap + stored typed error in one UoW | same key/digest replays stored error; different digest conflicts |

The application must not turn a repository failure into an attributable business rejection. Adapter,
serialization and commit failures roll back and map to an infrastructure/application error. A
`CommitOutcomeUnknown` never returns a rejected surface until `resolve_commit` proves rollback; if the
authority remains unknown, the operation stays unresolved and is not rerun.

### 9.5 Consumer ordering

Consumer phase 1 is deliberately small:

```text
validate envelope/version/source identity
  -> derive (consumer_kind, source_event_id, source_revision) digest
  -> begin ConsumerClaimUow
  -> IdempotencyStore::reserve
  -> store claim with no business interpretation
  -> commit/resolve
```

Only a confirmed claim allows the consumer to call `HubControlledSourcePort`,
`AuthorizationConsumptionPort`, `ExecutionSourceIntakePort`, `BusStatusFeedbackPort` or
`ObservationStatusFeedbackPort`. Phase 2 appends the consumption assessment/ref, re-enters the
owning local Command when the source denotes a formal change, writes a typed gap on blocked or
unverifiable input, stores `ConsumerReceipt`, and completes the claim in the same UoW. The consumer
does not acknowledge the source before phase 2 commit. If phase 2 commit is unknown, the receipt is
not marked committed and the message remains recoverable by the consumer owner.

### 9.6 Side-effect ordering

`CF-10` and `OF-01~04` use a strict two-phase fence. A prepared local marker is committed before the
Port call; a returned response is persisted in a new UoW. The Port receives a typed request and no
UoW or mutable local object.

| Local marker | Allowed next action | Forbidden inference |
|---|---|---|
| `Prepared` | owner-controlled resolution of whether the call may be resumed | call did not happen; safe automatic retry |
| `SubmittedLocally` | append independent status refs when available | delivered, accepted, executed, observed |
| `LocallyFailed` / `RouteBlocked` | report local disposition and gap | provider did not receive request unless source says so |
| `SubmissionOutcomeUnknown` / `CallOutcomeUnknown` | manual/recovery owner reads same marker and authority | second Port call, successful/failed claim |

### 9.7 Job ordering

Every Job claims its exact `JobMetadata` key before target enumeration. It processes one bounded page
in deterministic order, commits that page's local effects, and records a page cursor or gap. A Job
may open another UoW for the next page, but cannot enlarge the original Command UoW or report global
completion from a partial page. `JF-04` status refresh appends a new external status ref and never
mutates `ExternalSubmissionAttempt` state.

## 10. Consistency strategy

| Consistency domain | Strategy | Local guarantee | Eventual/blocked surface |
|---|---|---|---|
| Contract and definition pair | optimistic version + exact revision key | pointer and current definition switch atomically | stale projections/gaps only |
| Binding relation | expected-version save + append change fact | current relation and change fact atomic | Hub snapshot may be stale/blocked |
| Invocation admission | immutable invocation + one canonical admission key | no second admission for same invocation | late source assessment is a new fact |
| Outcome and audit | indivisible pair insert | no externally visible half terminal result | source mapping/status may remain unknown |
| Handoff attempt | prepared/disposition phase fence | at most one local attempt per generation | Sandbox execution/receipt owned elsewhere |
| Safe material | immutable four-gate snapshot | material cannot widen source visibility after commit | collaboration route/status may be blocked/unknown |
| Projection/report | source watermark + dependency index + compare token | older build cannot overwrite newer source | stale/rebuilding/unavailable/failed are readable surfaces |
| Reference assessment | append-only consumption assessment | history preserves owner/source/time | next refresh creates another assessment |
| Consistency gap | canonical open-gap key + expected-version transition | one active resolution lifecycle per defect | unresolved gap blocks only its declared closure |
| Stored replay | result immutable, saved before claim completion | exact duplicate replay remains stable after subject mutation | missing result is an integrity error, never a rerun |

### 10.1 Projection and reference isolation

`ProjectionStore::mark_affected_stale` receives a typed `LocalTruthRef`, source watermark and one
`RepositoryPageRequest`. It uses a reverse dependency index owned by the projection adapter. It does
not scan contracts, bindings, invocations, external owners or arbitrary strings. If a next cursor is
returned, the current UoW appends `ConsistencyGap(Scope::DerivedProjection,
PropagationIncomplete)` with the continuation ref. A Job later processes the cursor and closes the
gap only after the source watermark and affected-page evidence are re-read.

`ReferenceValidityAssessment` stores `owner_ref`, `authority_ref`, `source_revision`, consumed-at
time, resolution state and safe reason refs. It is never a writable field on the referenced owner or
on a prior invocation. `BusDeliveryStatusRef` and `ObservationMaterialRef` have semantic keys
`(attempt_id, authority, source_revision)` and append-only status history. A missing or stale status
ref maps to `Unknown`/`Unavailable`; it cannot turn `SubmittedLocally` into a delivered or observed
state.

### 10.2 Atomicity and isolation requirements

- All logical stores participating in one UoW must be served by the same local persistence authority;
  cross-database best-effort writes are not an implementation of this contract.
- A fake adapter must expose the same compare-token, uniqueness, rollback and commit-unknown
  behavior as a durable adapter; an in-memory map with unconditional overwrite is insufficient.
- Read bundles must come from one declared watermark. If an adapter cannot provide a symmetric bundle,
  it returns `SerializationConflict`/`Unavailable`, not a partial object set.
- A projection write compares subject identity, projection schema and source watermark. A newer
  source wins; an older write returns `ProjectionWriteResult::Stale` without changing the stored row.
- No query, diagnostic mapper or report reader repairs state, refreshes external refs or starts a
  hidden transaction.

## 11. Failure and recovery matrix

| Failure point | Local state after failure | Required disposition | Recovery owner | Automatic retry |
|---|---|---|---|---|
| pre-UoW validation/read error | no staged write | typed error; no replay unless flow requires a terminal no-execution fact | entry/application caller | only deterministic re-entry with same request |
| reserve conflict, same digest | existing claim/result | replay exact stored surface or report in-flight | operation owner | no second mutation |
| reserve conflict, different digest | existing claim unchanged | `IdempotencyConflict` | caller correction | no |
| domain transition error | UoW rolled back | `InvalidStateTransition`/`AdmissionRejected` as applicable | owning Command | no blind retry |
| expected-version conflict | UoW rolled back | `VersionConflict` with current ref omitted from public body | owning Command/reconciliation | reload and explicit new command only |
| semantic-key conflict, equal | UoW may reuse existing immutable ref | `ExistingEqual` and exact replay if all bases match | owning flow | no duplicate write |
| semantic-key conflict, divergent | UoW rolled back; gap only if flow can record it atomically | `IntegrityConflict` | integrity owner | no |
| one Store write fails before commit | all staged writes invisible | infrastructure error; no partial result | adapter/operator | bounded retry may occur below authority, not in repository |
| commit returns rolled back | all staged writes invisible | re-enter reserve only when safe and explicitly allowed | application owner | same-key re-entry, not automatic Port call |
| commit returns unknown | visibility unknown | `CommitOutcomeUnknown`; call `resolve_commit` only | persistence/operator owner | no blind rerun |
| projection stale mark fails after core mutation staged | UoW rolls back core mutation | command fails closed; no partial switch | owning Command | explicit retry after diagnosis |
| projection maintenance fails after core commit | core truth remains committed | projection row `Failed` or gap in maintenance UoW | projection Job | bounded job retry under Step 13 rules |
| external Port blocked/unavailable | prepared marker already committed for side-effect flows | local `RouteBlocked`/`Unavailable` disposition and gap | external seam owner + L2 handoff owner | no hidden retry |
| external Port call outcome unknown | Prepared marker or unknown attempt persists | `CallOutcomeUnknown`/`SubmissionOutcomeUnknown`; manual resolution | named recovery owner | no |
| stored result missing for completed claim | truth may be committed but replay surface incomplete | integrity gap; do not reconstruct from current truth | persistence/integrity owner | repair-only job, no business rerun |
| status feedback conflict | attempt unchanged; conflicting ref rejected | append integrity gap; preserve attributable refs if safe | feedback owner | no inference |
| bounded page has next cursor | first page committed; continuation incomplete | append `PropagationIncomplete` gap and cursor | maintenance Job | yes, page-scoped only |

## 12. Cross-store invariants

These are implementation predicates, not runtime repairs:

| ID | Invariant |
|---|---|
| `L2T-PERSIST-001` | A `ToolContract` current revision points to exactly one `FormalToolDefinition` with the same tool identity and a compatible source watermark. |
| `L2T-PERSIST-002` | A definition revision is immutable after insertion except for the declared revision-state transition guarded by its loaded expected version. |
| `L2T-PERSIST-003` | A current `CapabilityBinding` has mode/ref symmetry; replacement has one successor relation and one change fact. |
| `L2T-PERSIST-004` | An invocation has at most one canonical admission; a terminal invocation has exactly one indivisible outcome/audit pair. |
| `L2T-PERSIST-005` | A handoff attempt belongs to exactly one handoff generation and cannot move from a terminal local state back to `Prepared`. |
| `L2T-PERSIST-006` | Safe material source refs, target class and sensitivity class are symmetric and immutable. |
| `L2T-PERSIST-007` | An external submission attempt has one semantic key `(material,event,target)`; status refs never mutate the attempt row. |
| `L2T-PERSIST-008` | Every open `ConsistencyGap` has a canonical key and bounded owner/scope; a resolved gap cites assessment evidence and owner re-read. |
| `L2T-PERSIST-009` | Every projection row declares source watermark and schema; an older watermark cannot overwrite a newer row. |
| `L2T-PERSIST-010` | Every completed idempotency record points to an immutable stored result whose operation, scope and digest match exactly. |
| `L2T-PERSIST-011` | No logical L2 store contains raw provider body, prompt, secret, Sandbox capture, broker receipt body, Observation body or SDK response. |
| `L2T-PERSIST-012` | A confirmed local commit is the only basis for a public committed/accepted result; candidate or unknown stamps are never evidence. |

## 13. Persistence anti-patterns

| Anti-pattern | Why invalid | Required implementation |
|---|---|---|
| hard-code `expected_version = 1` | loses concurrency semantics | use `Loaded<T>.expected_version` from the same authority |
| use domain `version` or timestamp as CAS token | serialized business field is not adapter compare state | retain adapter token separately |
| save outcome and audit independently | exposes half terminal truth | call `insert_outcome_audit_pair` |
| publish by reloading current contract | late revision changes historical payload | persist body-free payload/material snapshot before publish |
| query stale projection and rebuild inline | hidden mutation and coupling | return stale/rebuilding surface; Job rebuilds |
| infer delivery from local submitted state | crosses owner boundary | append independent status ref only |
| treat `Prepared` as failed | call may already have happened | manual owner resolves ambiguity |
| scan all rows for affected targets | unbounded transaction and unstable identity | reverse dependency index plus bounded page |
| complete idempotency before storing result | duplicate points at missing surface | store immutable result first, then complete claim |
| use external body as dedup key | leaks/owns foreign data | canonical body-free digest from protocol mapper |

## 14. Historical material and blocker audit

| Finding | Classification | Current handling |
|---|---|---|
| old README/03 mentions PostgreSQL, Redis, NATS, RPC/HTTP and builtin executor tables | `historical_material` | no product, table, transport or executor selected here |
| old documents imply local MCP/provider inventory | `historical_material` | no inventory/provider/client store; only typed source/material refs |
| `L2T-UP-001~002` authorization owner/source/taxonomy unresolved | `blocker` | invocation-bound assessment/ref and fail-closed gap; no policy truth table |
| `L2T-UP-003~004` Sandbox mapping/receipt unresolved | `blocker` | local handoff/attempt and blocked/unknown disposition; no run/receipt/cleanup table |
| `L2T-UP-005~006` Bus/Observation producer/status unresolved | `blocker` | independent status refs only; no delivery/observation truth |
| `L2T-UP-007` workspace baseline unfrozen | `blocker` | local watermark/candidate is not a claimed repository baseline |
| `L2T-UP-008` Core tools-specific schema unresolved | `blocker` | authority ref and conflict error; no invented shared schema |
| `L2T-UP-009` SDK tools client seam unresolved | `blocker` | server/protocol contract remains canonical; no SDK persistence/client state |

These blockers do not prevent local negative, blocked, stale, replay or assessment design. They do
prevent a positive provider, route, receipt, observation, SDK or readiness claim.

## 15. 前序契约回填与 cross-step closure

### 15.1 Required formal-document backfill

Step 19 must place these conclusions in formal `03-详细设计.md`:

| Formal section | Required conclusion | Source |
|---|---|---|
| §5 module implementation contracts | each module names its Store owner and writes only through shared UoW | §§5, 9 |
| §6 global index | seven Stores plus `IdempotencyStore`, UoW manager, projection/ref status types | §§5~7 |
| §8 flow contracts | exact Command/Consumer/Event/Job phase ordering and no-write Query boundary | §§9.3~9.7 |
| §9 state/error seam | Prepared/unknown/blocked states and no external-success inference | §§9.6, 11 |
| §10 persistence/transaction | logical surfaces, semantic keys, versions, consistency matrix, invariants | §§5~13 |
| §12 concurrency/idempotency | claim/result ordering and commit-unknown handling | §§7, 9, 11 |
| §14 observability/audit | body-free commit/rollback/status refs and source attribution | §§10, 12 |
| §15 test cuts | adapter parity, rollback, stale watermark, pair atomicity, replay and phase-fence predicates | §§11~13 |

### 15.2 Closure audit

| Audit item | Result | Evidence |
|---|---|---|
| Step 6 owned fields have one Store owner | pass | §5 ownership table |
| Step 7 every method has key/version/UoW semantics | pass | §§6~8 and repository table |
| Step 8 public result/receipt/report has replay surface | pass | `IdempotencyStore`, §§9.3~9.7 |
| Step 9 all 37 flows have transaction order | pass | §9 boundary matrix and flow annexes |
| Step 10 persistent states have append/version/transition rule | pass | §§7, 9.6, 12 |
| external owner truth is excluded | pass | §§10.1, 14 |
| projection/reference cannot rewrite core truth | pass | §10.1 and `L2T-PERSIST-009` |
| unknown commit/call has no fabricated result | pass | §§7.1, 11, `L2T-PERSIST-012` |

## 16. 回填草稿

> 正式 `03` §10 仅吸收收口结论；问题回答、取舍和过程记录留在本中间产物。

```text
持久化实现由七个 logical Store 和一个 IdempotencyStore 组成，所有参与同一 accepted
flow 的 Store 共享 ToolsUnitOfWorkManager。mutable truth 的 expected_version 只能来自
adapter 返回的 Loaded<T>；append-only facts/ref 使用 semantic unique key，并区分
ExistingEqual 与 Conflict。OutcomeAuditStore 以单一 insert_outcome_audit_pair 保证 outcome
和 audit 不可拆写。

Command、Consumer、Job 的本地写入在确认 commit 前不得对外宣称 committed；外部 side effect
只在 Prepared marker 与 claim 已确认提交后发生。Prepared、CallOutcomeUnknown、
SubmissionOutcomeUnknown 不自动重试。Query 零 UoW、零写入、零外部调用。Projection、reference
assessment、Bus/Observation status 和 job report 只能维护自身状态，不能反写 Contract、
Binding、Invocation、Outcome 或 Audit truth。派生传播按反向依赖索引处理一个有界页面，后续以
PropagationIncomplete gap 继续。
```

## 17. 待确认事项与进入下一步条件

| Item | Owner | Impact | Before implementation |
|---|---|---|---|
| physical durable backend and isolation level | implementation/infrastructure owner | adapter implementation only | choose backend without weakening logical contract |
| authorization/sandbox/bus/observation schemas | upstream owners (`L2T-UP-001~006`) | positive branches/readiness | keep blocked-aware refs until formal authority closes |
| Core shared tools schema and SDK seam | `L2T-UP-008~009` | cross-repo compile/client | no local duplicate type authority |
| configured bounded page limit | 04 configuration design | propagation throughput | bind typed limit; cannot remove gap behavior |

Entry condition for Step 12 is satisfied: all local writes have an owner, semantic key, version
source, UoW boundary, failure disposition and recovery owner; all external positive gaps remain
explicit blockers. No new blocker was found.

## 18. Stop review and completion record

| Check | Result |
|---|---|
| data ownership and seven logical surfaces | pass |
| repository read/write and version semantics | pass |
| transaction ordering for Command/Query/Consumer/Event/Job | pass |
| projection/reference/external-status isolation | pass |
| failure/recovery and commit-unknown rules | pass |
| cross-store invariants and anti-patterns | pass |
| historical material and blocker audit | pass; `L2T-UP-001~009` remain open |
| formal document write | closed until Step 19 |

```text
step_status = completed / pass
current_module = persistence_transaction_consistency:seven_stores_and_uow
next_allowed_action = create 03_ddd_step_12_error_recovery.md
formal_document_write_allowed = false
commit_required = false
```
