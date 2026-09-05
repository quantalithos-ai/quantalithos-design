# Step 11. 持久化、事务与一致性契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填位置：未来 `projects/L2-member/03-详细设计.md` §10；本文件是校准中间产物，不是正式正文。
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`。
> 当前授权：用户已明确授权本 Step；本文件完成后立即停审，未经新的明确确认不得创建 Step 12。

## 1. Step 状态、输入与非目标

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 11：持久化、事务与一致性契约 |
| 当前状态 | `completed / pass_with_upstream_and_design_blockers / stop_review` |
| 本 Step 目标 | 将 Step 6 的对象与状态、Step 7 的 Store / read Port / UoW、Step 8 的 typed protocol、Step 9 的 flow 顺序和 Step 10 的 28 个状态主语收束为逻辑持久化、事务边界和一致性契约。 |
| 直接输入 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_10_state_matrix.md`、`02-概要设计.md`、项目级台账、详细设计 SOP / 书写规范、L1-governance 同步 Step。 |
| 本 Step 产出 | 数据所有权表、logical store / projection 表、全部现有 repository 函数的持久化语义、UoW / transaction boundary、一致性 / replay / projection / external-side-effect 规则、跨 Step 审计及 §10 回填草稿。 |
| 明确不做 | 不选择数据库、DDL、ORM、migration、隔离级别、行锁产品、缓存、队列、outbox、topic、route、retry 次数、scheduler、digest 算法、物理配置、实现仓、测试执行或 commit。 |
| 正式正文 | `formal_03_write_allowed = false`；不修改 `03-详细设计.md`。 |
| 实现状态 | `implementation_repo_write_allowed = false`；`L2M-DDD-001` 目标实现仓 / crate 仍不存在。 |
| 强制停点 | 仅允许更新台账后等待用户新的明确确认；不得进入 Step 12、不得装配正式 03。 |

### 1.1 Step 内分批计划

| 批次 | 内容 | 状态 |
|---:|---|---|
| 11.0 | 开工恢复、输入、SOP 问题与边界红线 | [x] |
| 11.1 | 数据所有权与 28 个状态主语的持久化归属 | [x] |
| 11.2 | logical store / collection / projection 契约 | [x] |
| 11.3 | 全部 Step 7 Store、read Port、UoW、idempotency / result 函数语义 | [x] |
| 11.4 | Command / Query / Consumer / Event candidate / Job 事务边界与一致性 | [x] |
| 11.5 | version、append-only、projection、replay、external side-effect、fake parity 与跨 Step 审计 | [x] |
| 11.6 | §10 回填草稿、完成门禁、停审记录 | [x] |

### 1.2 本 Step 的强制红线

- 只持久化 member 自己拥有的 CP01~CP07 local facts、local attempts / gaps、body-free snapshot / resolution、projection revision / state、trace / history、idempotency、typed stored result 与 UoW staging metadata。
- Runtime loop / context / plan / outcome、LLM 推理、memory、checkpoint、tool execution、capability registry、MCP/A2A/API adapter、container lifecycle、image build、sandbox isolation truth、Governance approval truth、Conversation truth 和 observability backend 永远不成为本仓持久化正文。
- `compile`、`runtime`、`event`、`ref`、`adapter`、`fake` 是依赖类别，不是可以互相伪装的 package dependency、table 或 transaction participant。
- `L2M-UP-005` 未闭合时，24 个 outbound semantic event candidate 不创建 envelope、payload、outbox、publisher、topic、route、ack、retry 或 DLQ store。
- 既有 mutable record 的 successor 必须遵守：**同一 repository 的 versioned read → 使用该 read 返回的精确 `MemberStoreVersion` → 同一 `MemberUnitOfWork` 保存 successor**。
- `MemberStoreVersion` 不得由 domain revision、source version、watermark、cursor、timestamp、trace ID、digest、result ID 或 idempotency key 替代。

## 2. SOP 问题回答

| # | SOP 问题 | 本 Step 收敛回答 |
|---:|---|---|
| 1 | 哪些数据对象由本仓拥有？ | CP01~CP07 的 member-local truth、material、attempt、gap、trace、snapshot、neutral resolution、projection state / revisions、idempotency record、typed stored result 与 UoW staging metadata。每个 owner 及写入方见 §5。 |
| 2 | 哪些只是引用、快照或投影？ | Work / Identity / credential / Governance / Runtime / Tools / Method / host / downstream 的正文、live state、授权、健康、delivery 和执行结果均只以 typed ref、safe summary、source version、digest、resolution / gap status 或 handoff marker 出现；CP07 views 是可重建投影，不是真相源。 |
| 3 | repository 函数如何命名、参数和返回是什么？ | 不新增 Step 7 未授权的 repository 方法。exact `get_*_with_version` / `find_*_with_version` / `list_*`、`append_*`、`save_*_successor`、projection affected lookup、`MemberIdempotencyStore` 和 typed result save/get 均在 §8~§10 写明 key、排序、version、UoW、返回和错误。 |
| 4 | 哪些处理流需要事务？ | 所有有本地写副作用的 non-query fresh Command / Consumer / Job path 使用一个逻辑 local UoW；typed result / receipt / report 与 reservation completion 在同一 UoW。Query 永不开始写 UoW。外部 handoff 不与本地提交组成二阶段事务，只在 local attempt / gap marker 上形成后续本地写。 |
| 5 | 是否需要乐观锁、行锁、版本号、outbox 或 projection？ | 需要每个 mutable local record 的 `MemberStoreVersion` 乐观版本；不选择具体行锁或隔离级别。需要 CP07 projection，但只表达 committed-source coverage / freshness。当前不定义 outbox / publisher；24 event candidate 全部受 `L2M-UP-005` 阻塞。 |
| 6 | 事件发布或 projection 更新失败如何恢复？ | 当前没有可实现的 event publish lane，故不定义 publish recovery。projection / mirror / handoff 失败只能保存已有 local failed / stale / unavailable / unknown / gap surface 或 typed report；不得回滚已提交 source truth，不得由 Query、fake 或 adapter 私自修复。具体错误枚举留 Step 12，重入 / 并发留 Step 13。 |

### 2.1 当前可调用性判定

```text
non-query fresh (future/reopen implementation contract only)
  validate typed input
  -> begin MemberUnitOfWork
  -> MemberIdempotencyStore::reserve
  -> local truth / continuation writes
  -> typed Command result / Consumer receipt / Job report
  -> MemberIdempotencyStore::complete
  -> commit

duplicate
  -> rollback current write boundary if one was opened
  -> read exact matching typed stored carrier
  -> return replay
  -> never rerun mutation, resolver, scan, handoff or rebuild

Query
  -> validate + assert query-no-write
  -> read exact truth / projection / resolution / visibility Port
  -> return explicit visible / restricted / stale / degraded / unavailable / empty
  -> no reserve, no append, no successor, no repair
```

上述是可落码约束而非当前运行证据。`L2M-DDD-001`、`L2M-DDD-003~007` 及上游 blocker 未关闭前，不得把这些步骤解释为已存在的实现或测试结果。

## 3. 当前材料诊断与设计取舍

### 3.1 诊断

| 来源 | 发现 | 本 Step 收束 |
|---|---|---|
| Step 6 对象 / 状态 | 既有对象同时包含 immutable fact、生命周期 successor、gap、projection 和技术结果 carrier。 | 以“immutable append-only / mutable optimistic successor / runtime-local carrier”三类拆开，不创建 `GlobalState` 或统一 member 状态表。 |
| Step 7 Store / Port | 已有 exact read、bounded list、append、versioned save、read-only Port、UoW、idempotency / result 签名，但尚未说明 key、排序和 staged visibility。 | §7 定义逻辑 store；§8~§10 为每个既有函数补 key、版本、同 UoW、missing / conflict 和 fake parity。 |
| Step 8 protocol | Command / Consumer / Job 具有 typed result / receipt / report；public cursor 与 internal version 都存在。 | result carrier 只能按 reservation + channel + operation + digest + result kind 精确 replay；public cursor 不能作为 version。 |
| Step 9 flow | local-first、external side-effect fence、Query no-write、Job no-source-repair 已有方向；部分 flow / helper 尚未闭合。 | 事务表保留 future 顺序，同时把 `L2M-DDD-003~007` 标为不可直接执行；不通过本 Step 静默修正前序 helper。 |
| Step 10 state matrix | 28 个主语已逐项收敛，包含 17 个业务 / support / projection、4 个 application / infra、7 个 entry / result / registration。 | 28 个主语全部进入状态-存储审计；技术和 entry 状态若无独立 owner，只作为 carrier / runtime marker，不新增表或状态机。 |
| 旧 README / 旧正式 03 | 旧材料中的 CloudEvents、AG-UI、UDS、launch token 等形态未与当前 authority 闭合。 | 仅作 historical pollution 输入；不写为本仓 table、event、transport 或 credential store。 |

### 3.2 设计取舍

| 议题 | 可选方案 | 结论 | 理由 |
|---|---|---|---|
| 物理存储 | 直接选择 DB / DDL；或先定义 logical store | 采用 logical store | 目标实现仓和物理产品均未锁定；先固定可被 durable adapter 与 fake 同时验证的语义。 |
| mutable record | last-write-wins / upsert；或同对象 versioned successor | 采用同对象 `MemberStoreVersion` optimistic update | 防止 lost update、跨对象误用 version 及静默覆盖。 |
| immutable fact / material / view | 原地更新；或追加新 revision | 采用 append-only | 保留证据来源、状态历史和可重建输入；修正通过新 ID / successor 链表达。 |
| projection | Query-time 创建 / 修复；或 committed source → projection job | 采用后者 | Query 永远 no-write，projection 不反向拥有 CP01~CP06 truth。 |
| duplicate | 重新执行服务；或 typed stored replay | 采用后者 | duplicate 不可重跑 resolver、handoff、scan、rebuild、mutation。 |
| external handoff | 外部调用和 local commit 组成分布式事务；或 local marker + side-effect fence | 采用后者 | 不伪造 2PC；外部结果只形成 member-local attempt / gap 事实。 |
| event / outbox | 机械引入 outbox；或保持零 inventory | 保持零 inventory | `L2M-UP-005` 尚未提供 member-specific event type / source / payload / route。 |

## 4. 统一持久化不变量

| 规则 | 正式口径 |
|---|---|
| local ownership | Store 只接受 Step 6 local object、typed local ref、body-free external ref、safe reason / resolution / digest / local metadata；raw body、secret、外部 SDK / HTTP / Bus object 和 owner live state 必须拒绝。 |
| identity provenance | 所有 local ID 由 `MemberIdGeneratorPort` 产生；repository、adapter、route、event name、digest、DB row id、fake map key 不得自行生成 domain identity。 |
| local time | 本地 captured / attempted / transitioned / rebuilt 时间由 `MemberClockPort::now()` 提供；不以 external completed time、DB default、event time 或 runtime health 替代。 |
| mutable version | existing record 只能以同一 Store 的 `Versioned<T>.version` 作为 `expected_version`；读取、domain successor 和 save 必须保持同一对象、同一 relation、同一 UoW。 |
| create | 新 record 传 `None` / `Absent` 语义；若 PK / business unique 已存在，返回 `DuplicateKey` / `ConsistencyViolation`，不得 upsert 或覆盖。 |
| staged visibility | 同一 UoW 后续读取可以 read-your-own-staged-write；commit 前 staged values 不得被其他 UoW、Query 或 duplicate replay 看到；rollback 必须让所有 staged truth、result、reservation 对外不可见。 |
| append-only | immutable decision / fact / material / snapshot / resolution / view revision / trace / history 只 append；无 update / delete API。需要修正时产生新 ID 并通过显式 supersede / relation 表达。 |
| lifecycle successor | presence、scope、attempt、gap、projection state、idempotency record 等 mutable lifecycle 通过 domain helper 生成 successor，再以精确 `MemberStoreVersion` 保存；不得由 repository 直接改 status。 |
| status fence | `Unknown`、`Blocked`、`Waiting`、`Stale`、`Failed` 不因时间、重试、Query、last-known、adapter 2xx 或 fake success 自动升级；必须有正式 local basis / new operation。 |
| projection direction | 只允许 committed CP01~CP06 fact / CP06 neutral resolution → CP07 state / view；projection、cache、stored result、diagnostic 不反写 source truth。 |
| external atomicity | resolver、handoff、feedback、Bus / Runtime seam 的调用不属于本地原子提交证据，不与本地 store 组成 2PC；调用结果只允许形成 typed local attempt / gap / resolution surface。 |
| query no-write | Query 不调用 `begin`、`reserve`、任何 `append_*`、`save_*`、`complete`、refresh、rebuild、reconcile、handoff 或 resolver side effect。 |
| result-before-complete | typed Command result / rejection、Consumer receipt 或 Job report 必须先在同一 UoW 保存，再完成 idempotency；不能出现 completed reservation 指向缺失 carrier。 |
| stable pagination | `MemberRepositoryCursor` 只表达某个 Store 的稳定排序位置；不替代 version、source version、projection watermark、truth cursor 或 idempotency key。 |
| fake parity | durable adapter 与 in-memory fake 必须实现相同 PK / unique、stable order、version conflict、UoW staging / rollback、append-only、read-your-own-write、query-no-write 和 replay 关系校验。 |

## 5. 28 个状态主语与数据所有权实现表

### 5.1 CP01~CP07 业务 / support / projection 主语

| 数据对象 / 状态主语 | 拥有模块 | 写入方 | 读取方 | 持久化语义与一致性要求 |
|---|---|---|---|---|
| `StartupAdmission` / `StartupAdmissionDisposition` | CP01 Presence | `admit_member_startup` | presence command、Query、trace、projection | immutable admission；`Accepted / Rejected / Blocked` 由新 ID 表达；不原地重开。 |
| `MemberPresence` / `MemberPresenceStatus` | CP01 Presence | establish / transition presence | admission guard、CP02、presence Query、projection | mutable lifecycle successor；same-store versioned read + exact version save；`Terminated` 不可重开。 |
| `HostCollaborationMaterial` | CP01 Host | prepare host collaboration | host relay、posture Query | immutable body-free material；只存 target / boundary / digest / correlation / refs。 |
| `HostCollaborationAttempt` / `HostCollaborationAttemptStatus` | CP01 Host | prepare、host feedback、future handoff continuation | host posture、trace、reconciliation | mutable attempt successor；`Submitted` 只表示本仓 seam invocation，非 host acceptance / health。 |
| `PresenceAdmissionPolicy` | CP01 Policy | domain evaluation | admission service | policy 是纯策略对象，不独立作为 mutable store；其输入由 typed refs / safe resolution 提供。 |
| `SubscriptionScopeDecision` / `SubscriptionScopeStatus` | CP02 Inbound | establish / replace scope | inbound guard、scope Query、projection | scope lifecycle 使用 versioned successor；supersede helper 缺口 `scope supersede helper gap` 保持开放，不由 Store 伪造。 |
| `InboundFactRecord` / `InboundIntakeDisposition` | CP02 Inbound | `InboundFactConsumer` | screening、trace、inbound Query、projection | body-free immutable fact；source identity / digest / inspection marker 必须可追溯；禁止 raw body。 |
| `ScreeningDecision` / `ScreeningDisposition` | CP02 Inbound | inbound screening application service | Runtime submission guard、screening Query、projection | immutable screening decision；新 rule evidence 新建 decision；不把 policy source 或 Runtime admission 写入。 |
| `SubscriptionScopePolicy`、`InboundScreeningPolicy` | CP02 Policy | domain evaluation | scope / screening services | 纯 policy / guard，不拥有 source rule truth；neutral rule resolution 来自 CP06 read Port。 |
| `RuntimeDeliveryDecision` / `RuntimeDeliveryDisposition` | CP03 Runtime | submit screened fact | Runtime posture、trace、projection | immutable local eligibility decision；不写 Runtime loop / admission / plan / outcome。 |
| `RuntimeSubmissionAttempt` / `RuntimeSubmissionAttemptStatus` | CP03 Runtime | submit / result-link continuation | Runtime posture、reconciliation | mutable local handoff attempt；versioned successor；`Submitted` 不等 Runtime accepted。 |
| `RuntimeResultLink` | CP03 Runtime | link Runtime result | Runtime posture、outbound eligibility | immutable typed external link；只保留 result ref / source / correlation / classification。 |
| `RuntimeMaterialReception` / `RuntimeMaterialReceptionDisposition` | CP03 Runtime | Runtime material Consumer | outbound preparation、trace、Query | immutable body-free reception fact；只证明 member boundary 已接收 safe material marker。 |
| `RuntimeMediationPolicy` | CP03 Policy | domain evaluation | Runtime mediation service | 纯 policy；不持有 Runtime context / plan / outcome。 |
| `OutboundDecision` / `OutboundDisposition` | CP04 Outbound | committed Runtime reception consumer | outbound material creation、Query、projection | immutable local eligibility decision；source proof 缺失时不得创建 positive material。 |
| `MemberOutboundMaterial` | CP04 Outbound | outbound boundary service | publication relay、outbound Query、trace | immutable material revision；仅 safe refs / digest / target / boundary / correlation。 |
| `PublicationAttempt` / `PublicationAttemptStatus` | CP04 Outbound | publication relay、delivery feedback | publication posture、reconciliation | mutable local attempt successor；只保存 local submission ref / feedback ref / unknown reason。 |
| `PublicationGap` / `PublicationGapStatus` | CP04 Outbound | unknown / blocked continuation | gap Query、projection、reconciliation | mutable gap successor；外部未确认不升级；`L2M-DDD-004` 的创建链保持开放。 |
| `OutboundMaterialPolicy` | CP04 Policy | domain evaluation | outbound service | 纯 body-free policy；不拥有 Bus / Conversation truth。 |
| `InteractionTraceEntry` | CP05 Trace | committed-fact Consumer | trace Query、observation relay、audit | immutable append-only trace；只关联已提交 CP01~CP04 refs。 |
| `InteractionGap` / `InteractionGapStatus` | CP05 Trace | trace / observation continuation | gap Query、projection、reconciliation | mutable gap successor；`L2M-DDD-005` 的 attempt-gap 创建 / helper 不闭合时不得伪造 gap。 |
| `ObservationMaterial` | CP05 Trace | trace service | observation relay、observation Query | immutable low-sensitive material；不存 observability backend body / evidence。 |
| `ObservationAttempt` / `ObservationAttemptStatus` | CP05 Trace | observation relay、feedback | observation posture、reconciliation | mutable local handoff attempt；Submitted 不等 observed；unknown 不能盲重放。 |
| `TraceMaterialPolicy` | CP05 Policy | domain evaluation | trace service | 纯 policy；不拥有 source fact 或 observation truth。 |
| `ExternalContextSnapshot` | CP06 Mirror | source Consumer / resolve flow / refresh | resolution、projection、Queries | immutable body-free snapshot；新 source version / digest 新建 snapshot。 |
| `ExternalContextResolution` / `ExternalContextResolutionStatus` | CP06 Mirror | source Consumer / resolve flow / refresh | screening、Runtime、outbound、projection、Query | purpose/scope-specific immutable neutral resolution；不等 authorization、health、registry 或 source current。 |
| `ExternalContextGap` / `ExternalContextGapStatus` | CP06 Mirror | unresolved / refresh flow | mirror Query、projection、reconciliation | mutable gap successor；`L2M-DDD-006` 的 `ResolutionPending` factory mismatch 保持开放。 |
| `MirrorResolutionPolicy` | CP06 Policy | domain evaluation | mirror service | 纯 policy；不得创建 default snapshot 或 generic resolver。 |
| `MemberSummaryView` | CP07 Read Model | projection rebuild | summary Query | immutable projection revision；由 committed facts / neutral resolutions 重建；旧 view 不覆盖。 |
| `CapabilityOutletView` | CP07 Read Model | projection rebuild | capability outlet Query | immutable ref-only view；`Available` 非 registry / authorization / invocation readiness。 |
| `MemberProjectionState` / `MemberProjectionStatus` | CP07 Read Model | projection Consumer / rebuild / reconciliation | Queries、jobs、diagnostics | mutable freshness / rebuild state；state version 与 `ProjectionWatermark` 分离。 |
| `MemberDiagnosticView` | CP07 Read Model | projection rebuild | diagnostics Query、operations | immutable low-sensitive diagnostic revision；不存 complete log / backend body。 |
| `ReadProjectionPolicy` | CP07 Policy | domain / application policy | projection / Query | 纯 visibility / source policy；Query 不以 policy 失败触发修复。 |

### 5.2 application / infra / entry 状态主语

| 状态主语 | 所属承载 | 是否独立 durable store | 保存方式 / 约束 |
|---|---|---:|---|
| `MemberIdempotencyState` | `MemberIdempotencyRecord` | 是 | `MemberIdempotencyStore` 唯一 reservation owner；`Reserved / Completed / Conflict / InFlight` 用自身 version。 |
| `MemberAdapterAvailabilityState` | `MemberAdapterAvailability` | 否（runtime-local） | 仅是 adapter slot / diagnostics marker；不得写成 external health、host readiness 或 member truth。若出现在 Job report，只能作为已定义 safe category。 |
| `MemberRuntimeBuildState` | `MemberRuntimeBuilderState` | 否（runtime-local） | composition / builder 生命周期；不创建 container、image、process、scheduler 或 runtime truth store。 |
| `BlockedSeamDisposition` | `BlockedSeamState` | 否（carrier / marker） | 由 typed blocked outcome、local result 或 diagnostic 承载；不独立创建 generic blocker table。 |
| `MemberApiHandlerDisposition` | `MemberApiHandlerResult` | 否（response carrier） | 由 API typed result 生成；不把 handler response 当 domain truth。需要 replay 时随 Command result carrier 保存。 |
| `MemberConsumerEntryState` | `MemberInboundConsumerEntry` | 否（entry carrier） | worker pre-dispatch posture；不由 Store 维护 listener / ack / DLQ 状态。 |
| `MemberWorkerRegistrationState` | `MemberWorkerRegistration` | 否（logical declaration） | 逻辑 Consumer 声明；不等 broker registration、delivery 或 health。 |
| `MemberConsumerItemDisposition` | `MemberConsumerItemResult` | 否（result carrier） | 随 typed Consumer receipt 保存 / replay；不得独立写 source body。 |
| `MemberJobEntryState` | `MemberOperationsJobEntry` | 否（entry carrier） | 逻辑 Job pre-dispatch posture；不等 scheduler / process / run。 |
| `MemberJobRunDisposition` | `MemberJobRunResult` | 否（result carrier） | 随完整 `MemberJobReport` 保存 / replay；不伪造 run_id、测试或调度证据。 |
| `MemberJobRegistrationState` | `MemberJobRunnerRegistration` | 否（logical declaration） | logical registration only；不持有 scheduler / cron / queue。 |

结论：Step 10 的 28 个状态主语全部保留，但只有本表明确的 local truth / lifecycle / projection / idempotency 对象拥有 durable persistence contract。技术 / entry carrier 不因“有状态名”而新增持久化表或第 29 个全局状态机。

## 6. 外部 owner 与本仓保存边界

| 外部 owner / 内容 | 本仓允许保存 | 本仓禁止保存 | 影响的 local consumer |
|---|---|---|---|
| `L2-runtime` loop / context / plan / outcome | Runtime boundary ref、entry contract ref、result link、safe material metadata、resolution / gap | loop state、context body、plan、outcome body、admission truth | CP03、CP04、CP05、CP06、CP07 |
| `L2-tools` action contract | Tool contract view ref、capability binding ref、safe categories、source version / digest | registry、provider、invocation args、tool execution result | CP06、CP07 capability outlet |
| Work / Identity / credential | `ProjectMemberRef` + `GlobalMemberRef`、source ref、safe anchor、credential relationship result | Work / identity正文、secret、token、credential issuance / revoke truth | CP01、CP06 |
| Governance / policy | purpose-specific neutral resolution、safe rule summary、source version / digest、gap | approval truth、governance decision、effective policy body、authorization | CP02、CP06 |
| host / member-service | host boundary ref、local material、attempt、feedback ref、gap | endpoint registry、host session、container lifecycle、health / restart verdict | CP01、CP04、CP05 |
| Bus / Conversation / downstream | target ref、publication / observation boundary ref、local attempt / gap | event body、conversation truth、delivery / accepted / observed truth | CP04、CP05 |
| observability / Artifact | trace ref、digest、summary ref、handoff marker | complete log、evidence package、artifact body / backend state | CP05、CP07 |

## 7. Logical store / collection / projection 契约

本节名称是逻辑存储对象，不是 DDL。durable adapter 可以把多个 logical store 合并为一个物理结构，也可以拆分；无论物理形态如何，都必须保持下列主键、唯一键、稳定排序、版本和同 UoW 关系。

| logical store / collection | 保存内容 | 主键 / 唯一键 | 关键索引与稳定排序 | version / append 规则 |
|---|---|---|---|---|
| `startup_admissions` | `StartupAdmission` | PK `StartupAdmissionId`；不允许按 subject 覆盖历史 | `subject_ref`,`admission_disposition`,`created_at`,`id` 升序 | immutable append-only |
| `member_presences` | `MemberPresence` | PK `MemberPresenceId`；当前 presence relation `(ProjectMemberRef)` 唯一 | `subject_ref`,`status`,`revision`,`id` | mutable successor；`MemberStoreVersion` |
| `host_collaboration_materials` | `HostCollaborationMaterial` | PK material ref；material digest + correlation 可作一致性检查，不替代 ID | `presence_ref`,`target_ref`,`created_at`,`id` | immutable append-only |
| `host_collaboration_attempts` | `HostCollaborationAttempt` | PK attempt ref；prepared relation不可重复占用同一 operation key | `presence_ref`,`status`,`created_at`,`id` | mutable successor；versioned |
| `subscription_scope_decisions` | `SubscriptionScopeDecision` | PK scope ref；current `(presence_ref, scope_kind)` 唯一 | `presence_ref`,`status`,`effective_scope`,`revision`,`id` | lifecycle successor；versioned；supersede helper 缺口开放 |
| `inbound_fact_records` | `InboundFactRecord` | PK fact ref；source identity + operation digest 按协议的去重关系 | `subject_ref`,`source_ref`,`intake_disposition`,`captured_at`,`id` | immutable append-only；raw body 禁止 |
| `screening_decisions` | `ScreeningDecision` | PK screening ref；`inbound_fact_ref` + decision revision 不得多义 | `inbound_fact_ref`,`disposition`,`created_at`,`id` | immutable append-only |
| `runtime_delivery_decisions` | `RuntimeDeliveryDecision` | PK decision ref；screening relation + decision revision | `subject_ref`,`screening_ref`,`disposition`,`created_at`,`id` | immutable append-only |
| `runtime_submission_attempts` | `RuntimeSubmissionAttempt` | PK attempt ref；decision ref + local attempt id | `decision_ref`,`status`,`created_at`,`id` | mutable successor；versioned |
| `runtime_result_links` | `RuntimeResultLink` | PK link ref；submission attempt + external result ref 组合必须一致 | `attempt_ref`,`result_ref`,`source_ref`,`created_at`,`id` | immutable append-only |
| `runtime_material_receptions` | `RuntimeMaterialReception` | PK reception ref；source / correlation relation检查 | `subject_ref`,`disposition`,`source_ref`,`captured_at`,`id` | immutable append-only |
| `outbound_decisions` | `OutboundDecision` | PK decision ref；reception / source relation | `subject_ref`,`reception_ref`,`disposition`,`created_at`,`id` | immutable append-only |
| `member_outbound_materials` | `MemberOutboundMaterial` | PK material ref；material digest + source relation consistency | `decision_ref`,`target_ref`,`created_at`,`id` | immutable append-only |
| `publication_attempts` | `PublicationAttempt` | PK attempt ref；material ref + local operation key关系 | `material_ref`,`status`,`created_at`,`id` | mutable successor；versioned |
| `publication_gaps` | `PublicationGap` | PK gap ref；attempt / material / reason relation | `subject_ref`,`status`,`attempt_ref`,`created_at`,`id` | mutable successor；versioned |
| `interaction_trace_entries` | `InteractionTraceEntry` | PK trace ref；trace identity唯一 | `subject_ref`,`correlation`,`captured_at`,`id` 升序 | immutable append-only |
| `interaction_gaps` | `InteractionGap` | PK gap ref；trace / attempt relation | `subject_ref`,`status`,`created_at`,`id` | mutable successor；versioned |
| `observation_materials` | `ObservationMaterial` | PK material ref；material digest + trace relation一致 | `subject_ref`,`created_at`,`id` | immutable append-only |
| `observation_attempts` | `ObservationAttempt` | PK attempt ref；material ref + operation relation | `material_ref`,`status`,`created_at`,`id` | mutable successor；versioned |
| `external_context_snapshots` | `ExternalContextSnapshot` | PK snapshot ref；`(source_ref, context_kind, scope, source_version, digest)` 可检重但不覆盖 | `source_ref`,`context_kind`,`scope`,`captured_at`,`id` 升序 | immutable append-only |
| `external_context_resolutions` | `ExternalContextResolution` | PK resolution ref；`(source_ref,purpose,scope,source_version,digest)` 一致性唯一 | `source_ref`,`purpose`,`scope`,`status`,`created_at`,`id` 升序 | immutable append-only |
| `external_context_gaps` | `ExternalContextGap` | PK gap ref；open relation `(subject_ref, source_ref, purpose, scope)` 不得多义 | `subject_ref`,`purpose`,`status`,`created_at`,`id` | mutable successor；versioned |
| `member_summary_views` | `MemberSummaryView` revisions | PK view revision ref；logical current key `(subject_ref, projection_kind, revision)` | `subject_ref`,`source_watermark`,`created_at`,`id` 升序 | immutable append-only |
| `capability_outlet_views` | `CapabilityOutletView` revisions | PK view revision ref；subject + projection revision | `subject_ref`,`outlet_status`,`source_watermark`,`created_at`,`id` | immutable append-only |
| `member_diagnostic_views` | `MemberDiagnosticView` revisions | PK view revision ref；subject + projection revision | `subject_ref`,`diagnostic_kind`,`source_watermark`,`created_at`,`id` | immutable append-only |
| `member_projection_states` | `MemberProjectionState` | PK state ref；unique `(subject_ref, projection_kind)` | `subject_ref`,`projection_kind`,`status`,`watermark` | mutable successor；`MemberStoreVersion`; watermark不作 CAS |
| `projection_dependency_index` | fact / resolution / gap → projection state relation | unique `(dependency_kind, dependency_ref, state_ref)` | `dependency_ref`,`state_ref` | same UoW as view / state relation；不独立修复 source |
| `member_trace_history` | CP01~CP07 trace / history append records | PK trace/history ref；identity unique | `subject_ref`,`source_ref`,`created_at`,`id` 升序 | append-only；无 expected version |
| `member_idempotency_records` | `MemberIdempotencyRecord` | PK record ref；unique `(channel, operation_name, idempotency_key)` | `request_digest`,`state`,`result_ref`,`created_at` | mutable successor；reserve 原子分类；versioned complete |
| `stored_member_results` | shell +完整 typed Command / Consumer / Job carrier | PK `MemberOperationResultRef`；shell / carrier relation唯一 | `channel`,`operation_name`,`result_kind`,`created_at`,`id` | immutable after save；先 result 后 complete |
| `member_uow_staging` | logical transaction / staging metadata（如 adapter 需要） | PK opaque `MemberTransactionRef`；同一 UoW 唯一 | `transaction_ref`,`mode`,`status`,`created_at` | 仅 UoW 生命周期；不向业务 Query 暴露 |

### 7.1 projection contract

| projection | source | identity / lookup | 更新规则 | 失败规则 |
|---|---|---|---|---|
| `MemberSummaryView` | committed CP01~CP06 facts + neutral resolutions / gaps | 只能通过 `MemberProjectionStore` 的 exact latest lookup 或已有 view ref | 新 revision append；`MemberProjectionState` 用自身 version 标记 stale / rebuilding / current | 保留旧 view，写既有 state 的 `Failed / Stale / Unknown` successor；不改 source truth |
| `CapabilityOutletView` | CP06 Tool / Method safe refs + local proof | subject + outlet view ref；不从 registry / display name 拼 ref | 新 revision append；`Available` 只代表展示来源充分 | missing basis → restricted / unavailable surface；不触发 resolver / authorization |
| `MemberDiagnosticView` | committed local trace / gap / freshness markers | exact view ref 或 subject latest lookup | 新 revision append | 不写 complete log / observability backend；failure 为 stale / unavailable |
| `MemberProjectionState` | source coverage / projection status | unique `(subject, kind)`；state version独立于 watermark | same-store versioned successor；affected lookup 必须由正式函数提供 | Query 不修复；Job report 记录 partial / failed |

### 7.2 logical store 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| CP01~CP07 local owner 是否列全 | pass | 七个 CP 的 truth、material、attempt、gap、trace、mirror、view / state 均有 logical store。 |
| 28 个状态主语是否被误压平 | pass | 业务状态各自归属；技术 / entry 状态明确为 carrier / runtime-local，不新增 GlobalState。 |
| external body / truth 是否泄漏 | pass | 只保存 typed ref、safe summary、source version / digest、resolution / gap / marker。 |
| outbox / event store 是否被机械引入 | pass_with_upstream_blocker | `L2M-UP-005` 开放；24 candidate 无 event persistence。 |
| projection identity / affected lookup 是否闭合 | pass_with_design_blocker | `projection_dependency_index` 只作为逻辑关系；具体 Step 9 / Step 10 affected helper 仍受 `L2M-DDD-007` 约束。 |

## 8. Repository 函数持久化语义（Step 7 全覆盖）

以下表只承接 Step 7 已存在的函数名；本 Step 不以表格偷偷新增 Port。除非另注明，`get_*_with_version` / `find_*_with_version` 只读，`append_*` / `save_*` 必须携带同一 `&dyn MemberUnitOfWork`。

### 8.1 `PresenceStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_admission_with_version(admission_ref)` | exact admission ref 读取；immutable admission 的 version 仅供审计，不用于 successor。 | `Option<Versioned<StartupAdmission>>`；missing=`None`。 |
| `find_current_presence_with_version(subject_ref)` | 只按 `ProjectMemberRef` 和 current relation 读取；不得由 admission / identity / host ref 拼 ID。 | `Option<Versioned<MemberPresence>>`；多 current=`ConsistencyViolation`。 |
| `get_presence_with_version(presence_ref)` | exact presence ref 读取当前 committed / 同 UoW staged value。 | `Option<Versioned<MemberPresence>>`；repository failure。 |
| `append_admission(admission,uow)` | 新 admission immutable append；subject / dual-anchor / disposition relation 必须已由 application 校验。 | `StartupAdmissionId`；PK / relation 冲突=`DuplicateKey`。 |
| `append_presence(presence,uow)` | 只用于新 `Starting` presence；同一 subject 的 current unique relation 原子检查。 | `MemberPresenceId`；duplicate current / invalid basis=`DuplicateKey` / `ConsistencyViolation`。 |
| `save_presence_successor(presence,expected_version,uow)` | 只保存 domain `transition_to` 返回的 successor；expected version 必须来自同一次 `get_presence_with_version` / `find_current_presence_with_version`。 | `MemberPresenceId`；stale=`VersionConflict`，非法 successor=`ConsistencyViolation`。 |

### 8.2 `HostCollaborationStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_material(material_ref)` | exact immutable body-free material read；不加载 host body / endpoint。 | `Option<HostCollaborationMaterial>`。 |
| `get_attempt_with_version(attempt_ref)` | exact attempt + `MemberStoreVersion` read；feedback / unknown / submitted successor 必须使用该版本。 | `Option<Versioned<HostCollaborationAttempt>>`。 |
| `list_attempts_by_presence(presence_ref,page)` | presence 限域、`created_at + attempt_id` 稳定升序；只读。 | `Page<HostCollaborationAttempt>`；不触发 handoff。 |
| `append_material(material,uow)` | immutable local material append；material digest / boundary / correlation 必须匹配。 | material ID；body / route leakage=`ConsistencyViolation`。 |
| `append_attempt(attempt,uow)` | 新 `Prepared / Blocked` attempt append；不得 append 已伪造 Submitted。 | attempt ID；PK / relation conflict=`DuplicateKey`。 |
| `save_attempt_successor(attempt,expected_version,uow)` | exact loaded attempt successor；不得把 host feedback / health 直接写成 presence。 | attempt ID；version conflict / illegal status=`VersionConflict` / `ConsistencyViolation`。 |

### 8.3 `SubscriptionScopeStore` 与 `InboundStore`

| Store / 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `SubscriptionScopeStore::get_scope_with_version(scope_ref)` | exact scope record + version；不从历史猜 current。 | `Option<Versioned<SubscriptionScopeDecision>>`。 |
| `SubscriptionScopeStore::find_current_scope_with_version(presence_ref)` | current relation 唯一读取；stable current pointer 必须显式存在。 | `Option<Versioned<SubscriptionScopeDecision>>`；多 current=`ConsistencyViolation`。 |
| `SubscriptionScopeStore::append_scope(scope,uow)` | 新 scope decision append；source / effective scope / status relation一致。 | scope ID；unique / relation conflict。 |
| `SubscriptionScopeStore::save_scope_successor(scope,expected_version,uow)` | 仅保存 domain successor；不得把 supersede helper 缺口伪装为 repository upsert。 | scope ID；version conflict / unsupported transition。 |
| `InboundStore::get_inbound_with_version(inbound_ref)` | exact body-free fact read；version 不作为 event/source version。 | `Option<Versioned<InboundFactRecord>>`。 |
| `InboundStore::get_screening_with_version(screening_ref)` | exact screening read；用于审计 / relation check，不重算 disposition。 | `Option<Versioned<ScreeningDecision>>`。 |
| `InboundStore::list_screenings_by_inbound(inbound_ref,page)` | inbound 限域、`created_at + screening_id` 稳定分页；只读。 | `Page<ScreeningDecision>`。 |
| `InboundStore::append_inbound(inbound,uow)` | 在 body inspection 完成后 append body-free fact；source identity / digest / inspection marker 需完整。 | inbound ID；raw body / duplicate relation=`ConsistencyViolation` / `DuplicateKey`。 |
| `InboundStore::append_screening(screening,uow)` | 将 policy resolution 与 intake fact 形成 immutable screening decision；不写 Runtime acceptance。 | screening ID；relation conflict。 |

### 8.4 `RuntimeMediationStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_delivery_decision_with_version(decision_ref)` | exact local decision read；不读取 Runtime loop。 | `Option<Versioned<RuntimeDeliveryDecision>>`。 |
| `get_submission_attempt_with_version(attempt_ref)` | exact attempt + version；successor 使用同一 version。 | `Option<Versioned<RuntimeSubmissionAttempt>>`。 |
| `get_result_link(link_ref)` | exact immutable external result link；不把 link 变成 Runtime outcome。 | `Option<RuntimeResultLink>`。 |
| `get_reception_with_version(reception_ref)` | exact reception read；reception 本身只按 immutable relation 使用。 | `Option<Versioned<RuntimeMaterialReception>>`。 |
| `list_attempts_by_decision(decision_ref,page)` | decision 限域、created time + local id 稳定分页；无 Runtime resubmit。 | `Page<RuntimeSubmissionAttempt>`。 |
| `append_delivery_decision(decision,uow)` | immutable member-side eligibility decision append。 | decision ID；relation / duplicate error。 |
| `append_submission_attempt(attempt,uow)` | 新 Prepared / Blocked attempt append；必须有 material / boundary / idempotency relation。 | attempt ID；invalid positive attempt=`ConsistencyViolation`。 |
| `append_result_link(link,uow)` | immutable result link append；source / correlation / result ref 必须由 owner-safe input 提供。 | link ID；relation conflict。 |
| `append_reception(reception,uow)` | immutable safe-material reception append；禁止保存 body。 | reception ID；body inspection violation。 |
| `save_attempt_successor(attempt,expected_version,uow)` | exact loaded `RuntimeSubmissionAttempt` successor；`MemberStoreVersion` 不得来自 Runtime result / source version。 | attempt ID；`VersionConflict` / illegal transition。 |

### 8.5 `OutboundStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_decision_with_version(decision_ref)` | exact immutable decision read；版本只用于 relation/audit。 | `Option<Versioned<OutboundDecision>>`。 |
| `get_material(material_ref)` | exact immutable safe material read；不得由 current Runtime outcome重建。 | `Option<MemberOutboundMaterial>`。 |
| `get_attempt_with_version(attempt_ref)` | exact publication attempt + version read。 | `Option<Versioned<PublicationAttempt>>`。 |
| `get_gap_with_version(gap_ref)` | exact publication gap + version read；gap successor使用返回版本。 | `Option<Versioned<PublicationGap>>`。 |
| `list_attempts_by_decision(decision_ref,page)` | decision 限域 stable order；不主动 handoff。 | `Page<PublicationAttempt>`。 |
| `list_prepared_attempts(page)` | 仅列已提交 `Prepared` attempts，stable order；selector 不创造新 ref。 | `Page<Versioned<PublicationAttempt>>`。 |
| `list_open_gaps(page)` | 仅列既有 open / blocked / unknown gap；不把 page scan 当修复。 | `Page<Versioned<PublicationGap>>`。 |
| `append_decision(decision,uow)` | immutable local outbound eligibility decision append。 | decision ID；duplicate / relation error。 |
| `append_material(material,uow)` | immutable material append；material body posture / digest 必须已完成。 | material ID；body / target mismatch=`ConsistencyViolation`。 |
| `append_attempt(attempt,uow)` | 新 local Prepared / Blocked attempt append；不得声称 Delivered。 | attempt ID。 |
| `append_gap(gap,uow)` | 新 local gap append；必须有现有 attempt / source relation，unknown 不等 retry authorization。 | gap ID；relation / unique conflict。 |
| `save_attempt_successor(attempt,expected_version,uow)` | exact same-store version successor。 | attempt ID；`VersionConflict` / illegal transition。 |
| `save_gap_successor(gap,expected_version,uow)` | exact same-store gap successor；不得由 save 代替缺失 domain helper。 | gap ID；`VersionConflict` / `ConsistencyViolation`。 |

### 8.6 `InteractionTraceStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_trace_entry(trace_ref)` | exact immutable body-free trace read；只关联 committed local refs。 | `Option<InteractionTraceEntry>`。 |
| `get_gap_with_version(gap_ref)` | exact interaction gap + version read。 | `Option<Versioned<InteractionGap>>`。 |
| `get_observation_material(material_ref)` | exact immutable observation material read；不读取 backend body。 | `Option<ObservationMaterial>`。 |
| `get_observation_attempt_with_version(attempt_ref)` | exact observation attempt + version read。 | `Option<Versioned<ObservationAttempt>>`。 |
| `list_trace_by_subject(subject_ref,correlation,page)` | 只按 ProjectMemberRef / optional correlation 限域；`captured_at + trace_id` 稳定分页。 | `Page<InteractionTraceEntry>`；不扫 event body。 |
| `list_gaps_by_subject(subject_ref,page)` | subject 限域、stable order；不关闭 gap。 | `Page<InteractionGap>`。 |
| `list_prepared_observation_attempts(page)` | 仅列既有 Prepared attempt；不推导新 attempt / material。 | `Page<Versioned<ObservationAttempt>>`。 |
| `append_trace_entry(entry,uow)` | immutable append-only trace；source refs / correlation 必须来自 committed fact read。 | trace ID；duplicate trace identity。 |
| `append_gap(gap,uow)` | 新 interaction gap append；gap relation 必须显式。 | gap ID；`L2M-DDD-005` 未闭合时拒绝猜造。 |
| `append_observation_material(material,uow)` | immutable low-sensitive material append；不保存 observability body。 | material ID。 |
| `append_observation_attempt(attempt,uow)` | 新 local Prepared / Blocked attempt append。 | attempt ID；relation conflict。 |
| `save_gap_successor(gap,expected_version,uow)` | exact versioned gap successor。 | gap ID；version conflict。 |
| `save_observation_attempt_successor(attempt,expected_version,uow)` | exact versioned attempt successor；Submitted 只记录 local invocation。 | attempt ID；version conflict / illegal transition。 |

### 8.7 `ExternalContextMirrorStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_snapshot_with_version(snapshot_ref)` | exact immutable snapshot read；version 不用于覆盖 snapshot。 | `Option<Versioned<ExternalContextSnapshot>>`。 |
| `list_snapshots_by_source(source_ref,scope,page)` | source + purpose/scope 限域，按 source version / captured_at / snapshot id 稳定升序；不返回外部正文。 | `Page<Versioned<ExternalContextSnapshot>>`。 |
| `get_resolution_with_version(resolution_ref)` | exact purpose/scope resolution read；neutral result 不是 authorization。 | `Option<Versioned<ExternalContextResolution>>`。 |
| `list_resolutions_for_purpose(source_ref,purpose,scope,page)` | source/purpose/scope 精确过滤；不得跨用途复用 resolution。 | `Page<Versioned<ExternalContextResolution>>`。 |
| `get_gap_with_version(gap_ref)` | exact mirror gap + version read。 | `Option<Versioned<ExternalContextGap>>`。 |
| `list_open_gaps(subject_ref,purpose,page)` | subject / purpose 限域 stable list；不因读取而 refresh / close。 | `Page<Versioned<ExternalContextGap>>`。 |
| `append_snapshot(snapshot,uow)` | immutable body-free snapshot append；body inspection / source owner / scope 必须通过。 | snapshot ID；body / owner mismatch。 |
| `append_resolution(resolution,uow)` | immutable neutral resolution append；新 source evidence 不更新旧 resolution。 | resolution ID；purpose relation conflict。 |
| `append_gap(gap,uow)` | 新 gap append；`ResolutionPending` 必须有合法 factory / helper，当前 `L2M-DDD-006` 开放。 | gap ID；illegal initial status。 |
| `save_gap_successor(gap,expected_version,uow)` | exact same-store gap successor；不由 repository 改 resolution / snapshot。 | gap ID；version conflict。 |

### 8.8 `MemberProjectionStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `get_summary_view(view_ref)` / `find_latest_summary_view(subject_ref)` | exact existing immutable view read；latest 必须来自 view metadata，不能拼 ref。 | `Option<MemberSummaryView>`；missing 不创建。 |
| `get_capability_outlet_view(view_ref)` / `find_latest_capability_outlet_view(subject_ref)` | exact/ref-based safe outlet read；不调用 Tool registry。 | `Option<CapabilityOutletView>`。 |
| `get_diagnostic_view(view_ref)` / `find_latest_diagnostic_view(subject_ref)` | exact existing diagnostic revision read；不加载 complete log。 | `Option<MemberDiagnosticView>`。 |
| `get_projection_state_with_version(state_ref)` | exact state + `MemberStoreVersion` read；state successor使用同版本。 | `Option<Versioned<MemberProjectionState>>`。 |
| `find_projection_state_with_version(subject_ref,projection_kind)` | unique subject/kind state read；不得由 view watermark 猜 state。 | `Option<Versioned<MemberProjectionState>>`。 |
| `list_projection_states_affected_by_fact(fact_ref,page)` | 只使用正式 dependency relation；stable state order；不扫所有 views 猜影响。 | `Page<Versioned<MemberProjectionState>>`。 |
| `list_projection_states_affected_by_resolution(resolution_ref,page)` | resolution relation 精确 affected lookup；不触发 refresh。 | `Page<Versioned<MemberProjectionState>>`。 |
| `list_projection_states_affected_by_gap(gap_ref,page)` | 仅接受有限 `MemberProjectionGapRef`；不能由字符串 / gap kind 拼 state。 | `Page<Versioned<MemberProjectionState>>`。 |
| `append_summary_view(view,uow)` | immutable new summary revision；必须来源于 committed source page。 | view ID；source relation conflict。 |
| `append_capability_outlet_view(view,uow)` | immutable outlet revision；safe refs / visibility basis relation需一致。 | view ID；authorization/body violation。 |
| `append_diagnostic_view(view,uow)` | immutable diagnostic revision；不写 observability body。 | view ID。 |
| `save_projection_state_successor(state,expected_version,uow)` | 同一次 state read 的 exact version；`ProjectionWatermark`、source cursor、page cursor 均不可替代。 | state ID；version conflict / illegal state。 |

### 8.9 `MemberIdempotencyStore` 与 `MemberStoredResultStore`

| 函数 | 持久化语义 | 返回 / 错误 |
|---|---|---|
| `MemberIdempotencyStore::reserve(context,request_digest,uow)` | 原子按 `(channel,operation_name,idempotency_key,digest)` 分类；唯一 reservation owner。Reserved 必须能在同 UoW read-your-own-write；Duplicate 返回 exact `result_kind + result_ref`；InFlight / Conflict 不执行 domain。 | `MemberIdempotencyReservation`；唯一冲突 / staging failure。 |
| `MemberIdempotencyStore::complete(record_ref,result_ref,expected_version,uow)` | 只允许自身 `Reserved` record；expected version 来自同 UoW 的 `get_with_version(record_ref,uow)`；result 已 staged 才能 complete。 | record ref；missing / wrong state / version conflict。 |
| `MemberIdempotencyStore::mark_conflict(record_ref,reason,expected_version,uow)` | 只处理本 invocation 自己持有的 `Reserved` record 的本地一致性失败；不能覆盖已 Completed / InFlight / Conflict。 | record ref；wrong owner / state=`ConsistencyViolation`。 |
| `MemberIdempotencyStore::get_with_version(record_ref,uow)` | 读取 committed 或同 UoW staged idempotency record；不是第二个 reservation owner。 | `Option<Versioned<MemberIdempotencyRecord>>`。 |
| `MemberStoredResultStore::save_command_result(relation,result,value,uow)` | 保存完整 Command value + shell；relation 的 record/result/channel/operation/digest/kind 必须全匹配。 | exact result ref；wrong relation=`ConsistencyViolation`。 |
| `MemberStoredResultStore::get_command_result(relation)` | 仅从 completed reservation 读取 matching `CommandResult` carrier；不重建 current truth。 | `Option<MemberStoredCommandValue>`。 |
| `MemberStoredResultStore::save_command_rejection(relation,result,rejection,uow)` | 保存完整 typed rejection + shell；rejection 不是隐式 domain mutation。 | exact result ref；relation / duplicate error。 |
| `MemberStoredResultStore::get_command_rejection(relation)` | 只 replay matching `CommandRejection`。 | `Option<MemberCommandRejection>`。 |
| `MemberStoredResultStore::save_consumer_receipt(relation,result,receipt,uow)` | 保存完整 public Consumer receipt；source identity / authority / schema / operation relation必须闭合。 | exact result ref；`L2M-DDD-003` 未闭合时不得默认补字段。 |
| `MemberStoredResultStore::get_consumer_receipt(relation)` | 只 replay matching `ConsumerReceipt`；不重新 inspect body / rescan / call service。 | `Option<MemberConsumerReceipt>`。 |
| `MemberStoredResultStore::save_job_report(relation,result,report,uow)` | 保存完整 body-free `MemberJobReport` + shell；report item refs 必须来自本次已提交 / staged local facts。 | exact result ref；不能伪造 run evidence。 |
| `MemberStoredResultStore::get_job_report(relation)` | 只 replay matching `JobReport`；不重做 scan、handoff、refresh、rebuild 或 reconciliation。 | `Option<MemberJobReport>`。 |

### 8.10 只读 Port 与外部 seam 的持久化边界

以下 Port **不是 repository**，不拥有本地写事务；resolver / handoff 的 `Completed` 也不等于外部 truth 已提交。

| Port | 既有函数 | 持久化语义 |
|---|---|---|
| `MemberFactReadPort` | `load_committed_fact`、`list_committed_projection_sources` | 只读 committed CP01~CP06 fact；不得扫描 event body / outbox / cache；返回 `CommittedMemberFactRead` 与 source watermark。 |
| `ExternalResolutionReadPort` | `get_resolution`、`find_resolution`、`list_resolutions_for_projection`、`get_gap`、`list_gaps_for_projection` | 只读 CP06 neutral resolution / gap；不 refresh、不 append、不修复 gap。 |
| `ToolSafeViewReadPort` | `read_safe_views` | 只读已接受的 Tool / Method safe refs；不读 registry、provider、definition、invocation。 |
| `ProjectionVisibilityBasisReadPort` | `read_visibility_basis` | 只读 formal visibility basis；non-positive outcome 映射为 restricted / denied / unknown，不创建 view。 |
| CP01 source ports | `resolve_project_member`、`resolve_global_member`、`verify_startup_credential` | 外部 owner-specific resolver；不保存 Work / Identity / credential body。 |
| CP01 handoff | `HostCollaborationPort::submit` | 仅形成 local `HostCollaborationAttempt` successor 的输入；不证明 host acceptance/session/health。 |
| CP02 event / rule | `InboundEventPort::validate_and_inspect`、`ScreeningRuleSourcePort::resolve_screening_rule` | inspection 完成后只传 body-free summary；rule resolution 只用于 screening purpose。 |
| CP03 Runtime | `RuntimeContractResolverPort::resolve_runtime_entry`、`RuntimeEntryPort::submit`、`RuntimeAdmissionResultSourcePort::resolve_admission_result`、`RuntimeMaterialSourcePort::validate_material` | 不保存 Runtime loop/context/plan/outcome；submission / result link / reception 是 member-local refs。 |
| CP04 publication | `PublicationRouteResolverPort::resolve_publication_route`、`PublicationHandoffPort::submit`、`DeliveryFeedbackSourcePort::validate_feedback` | route / handoff / feedback 只形成 local attempt / gap / feedback link；不定义 publisher/outbox/delivery。 |
| CP05 observation | `ObservationRouteResolverPort::resolve_observation_boundary`、`ObservationHandoffPort::submit`、`ObservationFeedbackSourcePort::validate_feedback` | 不写 observability backend；observed / evidence 不由 local attempt 推断。 |
| CP06 resolvers | `resolve_project_member_context`、`resolve_identity_anchor_context`、`resolve_credential_context`、`resolve_policy_context`、`resolve_runtime_context`、`resolve_tool_contract_context`、`resolve_method_definition_context`、`resolve_host_route_context` | owner-specific、purpose-specific、body-free；`Blocked / Waiting / Unknown` 不可默认转 `Completed`。 |
| CP06 refresh | `ExternalContextRefreshRequestPort::request_refresh`、`ExternalContextRefreshDispatchPort::dispatch` | logical request / dispatch only；不写 scheduler、queue、topic、ack、source current。 |

## 9. Shared technical helper 与版本来源

### 9.1 UoW / clock / ID / digest

| 函数 / helper | 持久化语义 | 禁止事项 |
|---|---|---|
| `MemberClockPort::now` | 只产生 member-local timestamp；同一 flow 的记录时间应由 application 统一取得。 | 不用 DB default、external event time、Runtime time。 |
| `MemberDigestPort::request_digest` | 只对 Step 8 已闭合的 body-free canonical input 计算 request digest；Query 不调用。 | 不把 digest 当 version、ID、source cursor 或 payload。 |
| `MemberDigestPort::material_digest` | 只对允许的 outbound / observation safe surface 计算 digest。 | 不接收 raw body / secret / adapter-private state。 |
| `MemberIdGeneratorPort` 的全部 `new_*` 方法 | 生成各 CP01~CP07 object、idempotency/result、operation/report、entry 的 opaque local identity；ID 只在对应 domain factory 使用。 | repository / adapter / route / fake 不自行拼 ID。 |
| `MemberUnitOfWork::transaction_ref` | 仅用于同 UoW staging / fake assertions / trace correlation；不是数据库事务 ID 的外部证据。 | 不作为 idempotency key、store version 或 result ref。 |
| `MemberUnitOfWorkManager::begin` | 开启 logical local write boundary；Query 不调用；必须声明合法 local mutable scope。 | 不在 begin 前 staged write。 |
| `MemberUnitOfWorkManager::commit` | 原子发布该 UoW 已 staged 的 local truth、append、projection state、stored result 与 idempotency completion。 | 不包含 external ACK / 2PC；commit 后不得继续写。 |
| `MemberUnitOfWorkManager::rollback` | 丢弃该 UoW 全部 staged values；其他 UoW / Query 不得看见。 | 不保留“半成功” local row 或 ghost result。 |

### 9.2 `MemberStoreVersion`、revision、cursor、watermark 分离

| token | 唯一含义 | 合法来源 | 绝对不能替代 |
|---|---|---|---|
| `MemberStoreVersion` | 一个 member-local mutable record 的乐观写版本 | 同一 Store 的 `Versioned<T>` read（含 list 返回的 version） | domain revision、source version、watermark、cursor、timestamp、trace / result / idempotency token |
| domain revision | 对象 successor 的业务顺序 / revision | domain factory / transition | Store CAS version |
| `SourceVersion` | 外部 owner-safe snapshot 的来源版本 | owner resolver / consumer envelope | local optimistic version |
| `ProjectionWatermark` | projection 已覆盖的 committed-source 范围 | `MemberFactReadPort` / rebuild input | state version、page cursor、timestamp |
| `MemberRepositoryCursor` | 某个 list 的稳定分页位置 | `Page<T>.next_cursor` | CAS、source cursor、idempotency |
| `MemberRequestDigest` | canonical request identity / duplicate comparison | `MemberDigestPort` | object ID、version、result ref |
| `MemberTransactionRef` | 一个 logical UoW 的 opaque handle | UoW manager | commit evidence、trace ID、store version |
| `MemberOperationResultRef` | 完整 typed stored result 的 identity | result generator / result Store | idempotency key、trace ID、current truth |

### 9.3 mutable successor 的强制四步

```text
versioned = same_store.get_*_with_version(...) or same_store.find_*_with_version(...)
successor = domain_object.transition / mark_* / request_refresh(...)
same_store.save_*_successor(successor, versioned.version, same_uow)
commit(same_uow)
```

若第一次 read 返回 `None`，只有创建语义允许 `expected_version = None`；不得把缺失当作隐式 update、默认 version `1` 或自动新建 current relation。`MemberStoreVersion` 不能跨 store 迁移，即使两个对象共享 subject、trace、source 或 correlation 也不例外。

## 10. 事务边界与处理顺序

### 10.1 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同一 UoW 必须完成 |
|---|---|---|---|---|
| Command accepted（future/reopen） | named Command service 在 DTO / metadata 校验后 | typed Command result 保存、idempotency complete 后 | reserve conflict、missing truth、非法 transition、Port / Store failure、payload / carrier mismatch、version conflict | reserve；读取 matching version；保存 local truth / successor；追加适用 trace / history；标记 projection affected state；保存完整 Command result；complete。当前不写 event/outbox。 |
| Command rejected / blocked（若协议要求保存 rejection） | application 已完成输入校验并决定保存 typed rejection 后 | rejection 保存 + idempotency complete | relation mismatch、result Store failure、UoW failure | reserve；保存完整 `CommandRejection`；complete；不得写 accepted truth / positive attempt。 |
| Command duplicate | reserve 返回 matching `Duplicate` 后 | 不产生业务 commit；先 rollback 当前 UoW 再 read replay | stored carrier missing / wrong kind / wrong relation | 只读取 exact typed Command result / rejection；不执行 domain、resolver、handoff 或 projection。 |
| InFlight / Conflict | reserve 返回 `InFlight` / `Conflict` | 不执行 mutation；是否持久化 conflict 只按 Step 13 | key / channel / operation / digest 不一致或已有未完成 reservation | 不调用 local domain write，不制造结果；Conflict 不覆盖既有 record。 |
| Query | named Query service 校验后 | 无写 commit | visibility denied、missing、repository failure | 只读 truth / projection / resolution / trace / report；严格 no-write。 |
| external Consumer accepted | worker 已完成 source / schema / body gate，named Consumer service 开始 | typed Consumer receipt 保存、complete、commit 后返回 | duplicate、body violation、resolver failure、relation / version conflict | reserve；append fact / snapshot / resolution / feedback link / gap successor；affected projection stale marker（若该 flow正式要求）；save receipt；complete。 |
| committed-fact Consumer | 已确认 `MemberFactReadPort` 返回 committed fact 后 | trace / projection local facts 与 receipt 同 UoW 提交 | fact missing / family mismatch / version conflict | 只能消费 finite `MemberCommittedFactRef`；append trace / local gap 或 stale state；不得从 event body 猜事实。 |
| external handoff relay | 读取 Prepared attempt / material 后调用 named handoff；外部调用不纳入本地原子写集 | 取得 seam outcome 后，以短 local UoW 保存 attempt / gap successor、report、complete | route / handoff unknown、missing material、version conflict；external call 已发生时不得回滚为“未调用” | local attempt / gap 只记录 member-side事实；`Submitted` / `Unknown` 不代表 external accepted / delivered / observed。若实现持有旧 UoW，不得宣称 2PC；写入仍需同一 logical transaction relation。 |
| external feedback Consumer | source feedback 已经通过 owner-specific validation 后 | attempt / gap successor + typed receipt 同 UoW | feedback relation mismatch、version conflict、late terminal state | 只链接 feedback ref；不重写 decision、不升级 delivery / observed truth。 |
| ExternalContext resolve / refresh | source / purpose / scope 校验后 | snapshot / resolution append 或 gap successor、typed result / report、complete 后 | owner blocked / waiting / unknown、body violation、version conflict | immutable snapshot / resolution append；gap successor versioned；不保存外部 body，不把 dispatch 当 source current。 |
| MemberProjectionUpdate Consumer | committed fact / resolution / gap relation 已验证后 | affected projection state successor + receipt 同 UoW | affected lookup missing、version conflict、source mismatch | 只 mark stale / degraded / unknown；不创建新 source truth。 |
| MemberProjectionRebuild Job | finite source refs / target watermark 校验后 | view revision、projection state successor、Job report、complete 同 UoW | source missing、view assembly failure、version conflict | read committed facts / resolutions；按 kind rebuild；append view；用 state read 的 exact version保存 current / failed；不修复 source。 |
| GapReconciliation Job | finite gap / successor refs 校验后 | read-side state successor、Job report、complete 同 UoW | gap relation missing、version conflict、report failure | 只定位 affected projection state 并 mark stale / degraded；不得创建、关闭或修改 CP04/CP05/CP06 source gap。 |
| unsupported Consumer schema | worker version gate 处 | 无本地业务写；若未来协议要求 receipt，必须另有明确 rejection contract | unsupported schema / missing authority | 不 parse raw body、不 reserve、不保存 snapshot、不 mark stale。 |
| runtime builder / entry registration | composition root | 无 member truth transaction；runtime-local marker 生命周期结束时丢弃 | config / adapter init / composition failure | 只构造 declared typed Port / facade；不写 container/image/host/session/scheduler truth。 |

### 10.2 accepted non-query 的 canonical ordering

```text
validate typed request / source / metadata
begin logical MemberUnitOfWork
request_digest (Command / Consumer / Job only)
reserve(context, digest, uow)
  Duplicate -> rollback -> get exact typed stored carrier -> return replay
  InFlight / Conflict -> no mutation; map by later error contract
  Reserved -> continue
read required local object(s) with same-store Versioned<T>
read body-free resolution / source proof / visibility prerequisites
call domain factory or successor helper
append or save local truth with None / exact MemberStoreVersion
append trace/history where the flow owns that fact
mark affected projection states only through formal affected lookup
build complete typed result / receipt / report
save stored carrier in same UoW
read idempotency reservation with same-UoW get_with_version when successor version is required
complete reservation
commit
```

外部 handoff 的调用不能被描述成与 local commit 原子；其 local-first 规则是“先有已提交 Prepared material / attempt，再调用 seam，再写 Submitted 或 Unknown successor”。如果实现为保持 Step 9 的 orchestration handle 在调用期间持有 UoW，也必须保证 adapter outcome 不是 commit proof，不得向外暴露分布式事务或 external acceptance。

## 11. 一致性、失败恢复与 replay 口径

### 11.1 规则表

| 场景 | 一致性规则 | 失败 / 恢复口径 |
|---|---|---|
| version conflict | 同一 object、同一 versioned read、同一 UoW；冲突拒绝 successor。 | 返回 `MemberPortError::VersionConflict`，交由 Step 12 / 13 定义安全映射；不得 reload + merge + retry。 |
| duplicate same digest | `reserve` 返回 exact result kind / result ref；读取完整 carrier。 | missing / wrong kind / wrong relation 是 consistency defect，fail closed；不 fallback current truth。 |
| duplicate different digest / channel / operation | 不重分类为 duplicate，不覆盖既有 record。 | `Conflict`；不得执行 domain mutation。 |
| immutable record | old fact / material / snapshot / resolution / view / trace 不更新或删除。 | 新依据新 ID；旧版本保留用于审计与 projection rebuild。 |
| projection update failure | source truth 已提交，不回滚。 | state successor 为 stale / failed / unavailable（仅使用 Step 6~10 已有合法 helper）；Job report 记录 unresolved；Query 返回保守 surface。 |
| mirror resolver failure | 不将 last-known body-free snapshot冒充 current。 | 新 gap / existing gap successor 为 Blocked / Waiting / Unknown / Stale；具体 transition 受 `L2M-DDD-006` 限制。 |
| handoff failure / unknown | 不删除 Prepared material，不写 delivered / observed。 | Publication / Observation / Host attempt 标记 Unknown 或 gap（仅在已有合法 helper 时）；后续重试必须是新的受控 continuation，不能 blind retry。 |
| feedback late / mismatch | feedback 只按 attempt / correlation / boundary relation 验证。 | mismatch 不改 source truth；late terminal transition 按 domain illegal transition 处理。 |
| partial Job | source truth 不被 Job “修复”；每个 item 的 local outcome 进入 report。 | report 可 `Completed / Partial / Failed`（仅使用 Step 8 typed report 允许的值）；duplicate 只 replay report。 |
| query on stale / missing projection | read path 不创建 view / state，不刷新 reference。 | 返回 `Stale / Degraded / NotAvailable / Empty` 等明确 read surface；不得把 no-write 变成 lazy repair。 |
| UoW rollback | 全部 staged local writes、result、reservation changes 一起不可见。 | rollback failure 记录为技术错误交由 Step 12；不返回 accepted result。 |
| event candidate | event family / route / payload 尚未闭合。 | 保持 `L2M-UP-005` blocker；不写 candidate outbox，不用 trace / report / fake 代替 event。 |

### 11.2 append-only、projection 与 replay 的细则

1. `StartupAdmission`、`InboundFactRecord`、`ScreeningDecision`、`RuntimeDeliveryDecision`、`RuntimeResultLink`、`RuntimeMaterialReception`、`OutboundDecision`、`MemberOutboundMaterial`、`InteractionTraceEntry`、`ObservationMaterial`、`ExternalContextSnapshot`、`ExternalContextResolution`、三个 CP07 view revision 和 history / trace 都是 append-only。
2. `MemberPresence`、`SubscriptionScopeDecision`、Host / Runtime / Publication / Observation attempt、Publication / Interaction / ExternalContext gap、`MemberProjectionState`、`MemberIdempotencyRecord` 使用 versioned successor；old revision 不得被静默覆盖。
3. `MemberFactReadPort` 只读取已提交 local fact；`ExternalResolutionReadPort` 只读取已提交 neutral resolution / gap；`ToolSafeViewReadPort` 与 `ProjectionVisibilityBasisReadPort` 只读，不是 write-through cache。
4. stored result 必须包含完整 contracts-owned carrier，而不是 shell、surface ref、current truth 快照或 fake map；每个 getter 验证 record ref、result ref、channel、operation、digest、result kind 和 carrier-specific relation。
5. Query、duplicate replay、reconciliation read 都不补写缺失 history、projection、gap、snapshot 或 result。

### 11.3 durable adapter / in-memory fake parity

| 能力 | durable adapter 与 fake 必须共同保证 | 禁止的 fake shortcut |
|---|---|---|
| identity / unique | 同样 PK、business unique、relation mismatch 检查 | 用 `HashMap` key 覆盖旧对象或以测试顺序判定 current |
| stable page | 相同 scope filter 与 stable `(captured_at / created_at, local_id)` order | 全量 map iteration、随机顺序、cursor 只在 fake 有效 |
| version | 同对象 `MemberStoreVersion`、stale write 返回 VersionConflict | 固定 version=1、用 domain revision / fake counter冒充 store version |
| UoW staging | staged values 只对同 UoW可读；commit原子、rollback全丢弃 | mutation 先写全局 map，rollback 再删除；向其他 fake reader 泄漏 |
| append-only | immutable object / view / trace / resolution不能 update/delete | 测试 helper 直接改字段、按 ID 替换历史 |
| replay | exact typed result relation；duplicate no rerun | 从 shell、current truth、report assembly 或 adapter response 重建 carrier |
| query no-write | read-only path 对两类 adapter 都无写计数变化 | Query 自动创建 projection、refresh gap、缓存写入 truth store |
| external seam | fake 返回 Blocked / Waiting / Unknown 时与 durable adapter 同样保守 | fake 默认 Completed、伪造 host / Runtime / delivery acceptance |

## 12. Step 6~10 跨文档审计与 blocker 保留

### 12.1 前序闭环审计

| 审计项 | 结论 | 证据 / 未决项 |
|---|---|---|
| object → store | pass | 34 个 CP01~CP07 对象均在 §5 / §7 具备 owner 与存储语义；纯 policy 未被误建表。 |
| state → persistence | pass_with_design_blockers | 28 个状态主语全部保留；技术 / entry state 明确为 carrier / runtime-local；`L2M-DDD-004~007` 仍阻塞部分 successor creation。 |
| Step 7 repository coverage | pass | `PresenceStore`、`HostCollaborationStore`、`SubscriptionScopeStore`、`InboundStore`、`RuntimeMediationStore`、`OutboundStore`、`InteractionTraceStore`、`ExternalContextMirrorStore`、`MemberProjectionStore`、`MemberIdempotencyStore`、`MemberStoredResultStore` 的现有函数已逐项列出。 |
| read Port ≠ repository | pass | `MemberFactReadPort`、`ExternalResolutionReadPort`、`ToolSafeViewReadPort`、`ProjectionVisibilityBasisReadPort` 单列；resolver / handoff 不进入 local repository。 |
| version provenance | pass | 所有 mutable successor 使用同一 Store 的 `Versioned<T>`；revision / source version / watermark / cursor 各自分离。 |
| transaction ordering | pass_with_design_blockers | reserve → local writes → typed result → complete → commit 已统一；`L2M-DDD-003~007` 使若干 source / helper / report path 仍不可执行。 |
| Query no-write | pass | 16 Query 均只读，不 reserve / append / refresh / rebuild / repair。 |
| event / outbox | blocked | 24 semantic candidates 全受 `L2M-UP-005` 阻塞；本 Step 不创建 event logical store。 |
| external boundary | pass_with_upstream_blockers | Runtime / host / policy / credential / route / tools / method 只保存 typed ref / safe resolution / gap；`L2M-UP-001~008` 保持开放。 |
| fake parity | pass_planned | parity contract 已写清；目标实现仓缺失，尚无实现 / test evidence。 |

### 12.2 blocker ledger（不在本 Step 关闭）

| blocker | 受影响持久化 / 事务面 | 本 Step 处置 |
|---|---|---|
| `L2M-UP-001` | Host / member-service registration、feedback、route | 只保存 local material / attempt / feedback ref / gap；不保存 host registry、session、health。 |
| `L2M-UP-002` | image pinned entry / host assembly | 不创建 image / container store；只接受 typed release / entry ref。 |
| `L2M-UP-003` | Runtime trigger / entry mapping | 不持久化 Runtime loop / context / plan / admission；保留 boundary / result link seam。 |
| `L2M-UP-004` | Runtime material、outbound、observation | 只 append committed safe material / local attempt / gap；不复制 Runtime outcome body。 |
| `L2M-UP-005` | 24 outbound event candidates | 无 envelope、payload、outbox、publisher、topic、route、ack、retry、DLQ。 |
| `L2M-UP-006` | startup credential / identity anchor | fail closed；不保存 secret / token，不把 resolver Completed 当 credential truth。 |
| `L2M-UP-007` | screening rule / source freshness | 只消费 neutral resolution / safe snapshot；不建本地 allowlist 或 default policy。 |
| `L2M-UP-008` | execution subject | 只接受 `ProjectMemberRef` + `GlobalMemberRef` 双锚；非项目型 / personal subject 不脑补。 |
| `L2M-DDD-001` | target implementation repository / crate | 只写 planned logical contract；不声称编译 / 运行。 |
| `L2M-DDD-002` | physical persistence / UoW / transaction product | 不选 DB、DDL、ORM、lock、isolation；由后续实现计划另行决策。 |
| `L2M-DDD-003` | complete Consumer receipt source / context | 禁止默认 authority / schema / detail；保存 / replay contract 保持 blocked。 |
| `L2M-DDD-004` | CP04 Prepared attempt / PublicationGap creation chain | 不把 `list_prepared_attempts` 或 `new_gap_ref()` 当现成 creation proof；需回开前序 flow / helper。 |
| `L2M-DDD-005` | CP05 attempt–gap relation / `mark_unknown` | unknown 只保留合法 attempt fence；不得伪造 InteractionGap 或 observed。 |
| `L2M-DDD-006` | CP06 `ResolutionPending` factory / transition | 不绕过 factory；gap initial state / successor 保持 blocked。 |
| `L2M-DDD-007` | CP07 state helpers / `store_version()` | version 只取 `Versioned<MemberProjectionState>`；缺失 helper 不由 Store / watermark 补造。 |
| `scope supersede helper gap` | CP02 `Active → Superseded` | `save_scope_successor` 不冒充 domain transition；前序 helper 需 targeted repair。 |

## 13. 正式 §10 回填草稿（仅供未来装配）

未来正式 `03-详细设计.md` §10 只能从本节引用以下收口内容；本次不写正式正文：

1. 本仓按 CP01~CP07 拥有 local truth、attempt / gap、body-free snapshot / resolution、projection、trace / history、idempotency 与 typed stored result；外部 owner 正文、live state、授权、delivery、observability backend 不入库。
2. 逻辑 store 必须保持 typed PK / unique、稳定分页、`MemberStoreVersion`、append-only、同一 UoW staging / rollback 和 durable/fake parity；不提前选择物理数据库或 DDL。
3. mutable record 统一执行“同 Store versioned read → domain successor → 同一 `MemberStoreVersion` 的 save → 同一 UoW commit”；revision、source version、watermark、cursor、digest、timestamp 不能替代 store version。
4. non-query fresh path 统一执行 digest → begin → reserve → local writes → typed result / receipt / report → complete → commit；duplicate 只读取精确匹配 carrier；Query 永远 no-write。
5. projection 只从 committed facts / neutral resolutions 重建；view revision append-only，projection state versioned；projection / mirror / handoff failure 不回滚 source truth、不由 Query 修复。
6. 外部 handoff 只形成 member-local attempt / gap；`Submitted`、`FeedbackLinked`、`Unknown` 不代表 host / Runtime / downstream accepted、delivered、observed、healthy、authorized 或 ready。
7. `L2M-UP-005` 关闭前不存在 member outbound event / outbox / publisher persistence；24 个 semantic event candidate 保持 blocked。
8. `L2M-DDD-001~007`、`L2M-UP-001~008` 与 scope supersede helper gap 必须在后续 Step / targeted repair 中保持显式，不得通过物理实现或 fake 默认值伪关闭。

## 14. Step 11 完成门禁与停审

| 门禁 | 结论 | 说明 |
|---|---|---|
| 数据所有权实现表 | pass | CP01~CP07 truth / support / projection 及 28 状态主语归属已写明。 |
| logical store / projection 表 | pass_with_upstream_blockers | local store、key、索引、version / append 规则已闭合；event/outbox 受 `L2M-UP-005` 阻塞。 |
| repository 函数覆盖 | pass | Step 7 全部 local Store 函数、idempotency/result 函数、read-only Port 与 external seam 均有持久化边界。 |
| transaction boundary | pass_with_design_blockers | fresh / duplicate / Query / Consumer / handoff / refresh / projection / reconciliation 场景均有顺序；`L2M-DDD-003~007` 保持开放。 |
| version / append-only / replay | pass | version provenance、immutable append、typed replay、no-write query、fake parity 已明确。 |
| 可落码性 | pass_with_blockers | logical contract 可供未来实现承接；目标 repo、physical store、receipt / helper 缺口和上游 seam 尚未闭合。 |
| 正式正文写入 | prohibited | 不修改 `03-详细设计.md`。 |
| 下一步 | stopped | 等待新的明确用户确认后才可创建 Step 12。 |

```text
current_step = Step_11_persistence_transaction_consistency_completed_stop_review
gate_status = completed_pass_with_upstream_and_design_blockers_stop_review
next_allowed_action = wait_for_new_explicit_user_confirmation_before_step_12
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```
