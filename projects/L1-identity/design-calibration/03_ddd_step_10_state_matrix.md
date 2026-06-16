# Step 10. 状态机与转换矩阵

> 对应正式文档章节: `03-详细设计.md` 第 9 章 状态机与转换矩阵
> 当前状态: Step 10 state matrix 已完成;10.0~10.8 均已写入;等待用户审核后进入后续 DDD Step 11
> 本文件性质: 详细设计 Step 10 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只在当前批次写当前批次内容;不得提前生成后续 Step 文件;不得直接修改正式 `03-详细设计.md`

---

## 1. Step 状态 + Step 内计划

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 10 state matrix |
| 当前批次 | 10.8 cross-state audit |
| 当前结论 | 10.8 已完成跨状态命名、trigger、terminal、query no-write、job no-repair、Published/Delivered、stored replay、entry/runtime/fake parity 和后续 Step 11~16 承接审计 |
| 本批是否写完整状态转换矩阵 | 否。本批只做跨状态审计和后续承接;不新增状态 enum 或 transition helper |
| 下一批 | DDD Step 11 persistence / transaction consistency |
| 停审要求 | 用户审核通过 Step 10 后进入 Step 11;若审核发现跨状态冲突需要新增 enum/helper/port/schema,先回对应 Step 6/7/8/9/10 修正 |

### 1.2 Step 10 总体目标

Step 10 的目标是把 Step 6 的 state enum / state value、Step 8 的 protocol intent 和 Step 9 的 function flow 连接成可实现的状态集合与转换矩阵。实现侧只能按本 Step 写状态校验、transition helper 和非法转换处理;如果 Step 6/8/9 与本 Step 冲突,必须回设计修正,不得由实现侧选边。

本 Step 不定义 DDL、最终错误 enum 全集、HTTP status、retry/backoff 数字、topic 名称、transport route、adapter config 或实施 commit boundary。这些由 Step 11~17 承接。非法转换在本 Step 先统一标为 `IdentityDomainError::InvalidStateTransition` / `ApplicationError::InvalidStateTransition` 占位,精确错误 taxonomy 和 public mapping 由 Step 12 闭合。

### 1.3 Step 10 分批计划

| 批次 | 主题 | 输出 | 停审重点 | 状态 |
|---|---|---|---|---|
| 10.0 | state subject screening / batch plan / redlines | 状态主语筛选表、状态族分组表、状态机清单、分批表、模板、红线 | 是否先排除非状态机对象;是否承接 Step 6/8/9;是否禁止 global state table | 已完成 |
| 10.1 | member / lifecycle truth states | `IdentityAnchorStateKind`, `GlobalLifecycleStateKind`, high-risk precheck disposition | terminal anchor hold、Retired->Tombstoned、basis guard、availability event condition | 已完成;按新 10.0 复核后保留 |
| 10.2 | role / career / memory truth and source states | `RoleCapabilitySummaryStateKind`, `RoleCapabilitySourceStateKind`, `WorkParticipationSourceState`, `CareerRecordStateKind`, `MemoryReferenceSourceState`, `MemoryReferenceStateKind` | source pending/unavailable、append-only、pending verification、archive handoff marker | 已完成 |
| 10.3 | read / visibility / trace surface states | `IdentityReadDispositionKind`, member summary freshness/read surface, trace/audit read disposition | query no-write、not visible vs missing/empty、stale visible、redaction/degraded priority | 已完成 |
| 10.4 | projection / reference / reconciliation states | `ProjectionStateKind`, `ReferenceResolutionStateKind`, `ReconciliationReportStateKind`, maintenance issue/finding disposition | no truth repair、source cursor、same bundle reference version、report-only | 已完成 |
| 10.5 | outbox / handoff propagation states | `OutboxStateKind`, outbound visibility disposition, `HandoffStateKind`, handoff material disposition | Published != Delivered、retryable vs terminal、receipt/issue marker required | 已完成 |
| 10.6 | application support states | `IdentityIdempotencyStateKind`, `IdentityStoredResultKind`, `IdentityJobResultKind`, command effect / stored replay dispositions | completed requires stored result、duplicate replay no rerun、job report item refs | 已完成 |
| 10.7 | runtime / adapter / entry states | `IdentityConfigValidationStateKind`, `IdentityRuntimeAssemblyStateKind`, `IdentityAdapterAvailabilityKind`, API/worker/job entry validation and dispatch kinds | entry valid != application accepted、assembled != adapter success、dispatch target guard | 已完成 |
| 10.8 | cross-state audit | forbidden transition summary、Step 9 open item decisions、Step 11~16 handoff | naming/trigger/test consistency, reserved state not called | 已完成,待审核 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_09_state_machine.md` | 已完成 | 概要层状态主语、全局禁止迁移和状态传播口径 |
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | state enum、state value、domain method、policy、字段来源和状态闭环输入 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | versioned read/save、cursor、repository、resolver、idempotency、stored result 和 fake equivalence 来源 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | command/query/event/job DTO intent、target state kind、result/report/receipt surface |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 触发 flow、transaction order、state change owner、副作用和 Step 10 handoff |
| `standards/document/详细设计讨论流程_SOP.md` | 当前标准 | Step 10 必须先筛选状态主语,再按状态族 / 状态机写 ASCII 图、转换矩阵、单状态机停审和跨状态审计 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 当前标准 | 状态主语筛选、状态名一致、transition helper、precheck 不隐藏迁移、错误模型承接和可落码红线 |
| `L1-governance` Step 10 中间产物 | 参考 | 仅参考组织粒度和停审方式,不复制业务内容 |

---

## 3. SOP 问题回答

| SOP 问题 | 本轮回答 |
|---|---|
| Step 6 / Step 9 中哪些对象、marker、helper 或 entry result 是候选状态主语 | §7.1 逐项筛选;候选来自 Step 6 state enum / state value / disposition / availability / validation / dispatch / report result,并要求 Step 9 flow 会读取、推进、暴露或回放 |
| 哪些候选对象排除在 Step 10 状态矩阵外 | §7.1 标明纯 ref、value object、operation context、request digest、command effect summary、entry context、external truth、cache/lock/retry counter 不进入矩阵 |
| 当前仓有哪些正式状态机 | Domain truth、source/reference、read/visibility、projection/reference/report、outbox/handoff、idempotency/stored result/job report、runtime/adapter/entry 状态机 |
| 每个状态机属于哪一类状态族 | §7.2 按 business truth、source/reference、read/visibility、projection/report maintenance、outbox/handoff propagation、application replay/report、runtime/entry technical states 分组 |
| 每个状态机归属于哪个模块和哪个 Step 6 状态 enum | §7.3 逐项列出;后续 10.1~10.7 每个小节必须回指 Step 6 enum 或 state value |
| 每个状态机的状态集合是什么 | 10.1 已展开 anchor、lifecycle 和 high-risk precheck;10.2 已展开 role/career/memory truth and source states;10.3 已展开 read/visibility/trace surface states;其余状态集合在对应后续批次展开 |
| 哪些函数会触发状态转换 | 只能是 Step 6 factory/member method/policy、Step 7 repository marker update 或 Step 9 flow;不得写 repository 私有自动迁移 |
| 每个转换的前置条件、副作用和错误是什么 | 后续每个状态机矩阵逐行写入;前置条件必须回指 DTO、loaded truth、versioned read、resolver summary、policy decision 或 stored surface |
| 非法转换是否写审计 | domain object 不写审计;application accepted path 只有 transition 成功后才写 trace/audit/outbox/stale/result;非法转换是否保存 rejected surface 留 Step 12/13 |
| 每个状态机完成后如何停审 | 每个状态机小节必须包含 enum 存在、状态名一致、触发函数存在、前置条件闭合、非法错误占位、副作用闭合、测试切口表 |
| 全部状态机完成后如何审计 | 10.8 做跨状态命名、触发、错误、query no-write、job no-repair、published/delivered、stored replay、fake parity 和 Step 11~16 handoff 审计 |

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | Step 10 处理 |
|---|---|---|
| 概要 Step 9 已给状态主语和禁止方向 | 粒度不足以落码;缺 From/To、trigger、guard、side effect、非法错误 | Step 10 逐状态机展开 |
| Step 6 状态闭环表只审计状态族 | 未写完整 allowed transition 和 terminal reopen | Step 10 按 enum 写矩阵 |
| Step 9 flow 有若干待 Step 10 固化的状态分支 | 若实现时再选择分支会形成 1:1 blocker | 本 Step 必须逐项闭口或明确交给 Step 12/13/14 |
| Query 容易把 stale/missing 修复成状态写入 | 违反 query no-write | Step 10 明确 query helper/read disposition 只读,不得触发 transition |
| Job 容易把 projection/reference/report failure 反写 core truth | 违反 job no-truth-repair | Step 10 固定 maintenance 状态不修复 core identity truth |
| Published / Delivered / Accepted 容易混用 | 会让传播结果反向污染业务 truth | Step 10 固定 outbox/handoff 边界 |
| Entry valid / Dispatch success 容易被当成 application accepted | 会绕过 application/domain 结果 | Step 10 固定 entry/dispatch 技术状态与业务结果分离 |

---

## 5. 改动前后对比

| 维度 | Step 10.0 前 | Step 10.0 后 |
|---|---|---|
| Step 10 状态 | Step 9 完成,Step 10 pending | Step 10 框架、分批计划和红线已落盘 |
| 状态机清单 | 分散在 Step 6/8/9 | 汇总为 10.1~10.8 批次 |
| 粒度 | 仅有概要状态主语和 Step 6 状态闭环表 | 对齐 governance Step 10,但按 identity 状态族拆批 |
| 迁移规则 | 尚未逐状态机矩阵化 | 固定写法模板和单状态机停审要求 |
| 暂停规则 | 来自 Step 9 cross-flow audit | 固定为 Step 10 redlines:无 enum、无 trigger、无字段来源、无 helper 即暂停 |
| 正式 `03` | 不修改 | 仍不修改,留 Step 19 装配 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 一次性写完所有状态矩阵 | 不采用 | 状态族多且跨 command/query/consumer/job,容易复发粒度过粗和隐藏 blocker |
| 只写全局状态总表 | 不采用 | SOP 明确要求按状态机逐个写状态集合和转换矩阵 |
| 先写 10.0 框架,审核后逐批展开 | 采用 | 与 governance Step 10 粒度一致,能先固定状态清单、模板和红线 |
| 把 source summary / entry validation 排除在 Step 10 外 | 不采用 | Step 6/8/9 已把它们作为可落码 surface;若不矩阵化会在 Step 12/13/16 漂移 |
| 在 Step 10 新增状态 variant 弥补 flow 分支 | 不采用 | 状态名必须来自 Step 6;发现缺状态必须回 Step 6/8/9 |
| 在 Step 10 定义最终错误全集 | 不采用 | 本 Step 可用 invalid transition 占位;最终错误模型由 Step 12 闭合 |

---

## 7. 结构化中间产物

### 7.1 状态主语筛选表

本表先筛选 Step 10 是否应把对象写成状态机。进入矩阵的主语必须同时满足:Step 6 已定义正式 state enum / state value / disposition / availability / validation / dispatch / report result,且 Step 9 flow 会读取、推进、暴露或回放该状态。纯 ref、marker、operation metadata、digest、外部 truth、cache / lock / retry counter 不进入矩阵。

| 候选主语 | 来源对象 / 字段 | 是否进入 Step 10 | 原因 | 状态族 / 批次 |
|---|---|---|---|---|
| `IdentityAnchorState` | `GlobalMember.anchor_state: IdentityAnchorState`;`IdentityAnchorStateKind` | 是 | anchor hold 改变 `GlobalMemberRef` 复用规则;Step 9 lifecycle terminal flow 推进 | business truth / 10.1 |
| `GlobalLifecycleState` | `GlobalLifecycleState.state_kind: GlobalLifecycleStateKind` | 是 | lifecycle state 改变 member 可用性和 terminal 规则;command flow 推进 | business truth / 10.1 |
| high-risk lifecycle precheck disposition | `LifecycleRiskRef`, `GovernanceBasisSummary`, `GovernanceBasisState` | 是,但不作为持久化 state | Step 9 在 lifecycle transition 前分支;决定是否允许进入 lifecycle transition | business precheck / 10.1 |
| `RoleCapabilitySummary` | `RoleCapabilitySummaryStateKind` | 是 | role/capability summary 可 usable/stale/pending/unavailable;command/consumer/query 都读取或推进 | business truth + source state / 10.2 |
| `RoleCapabilitySourceSnapshot` | `RoleCapabilitySourceStateKind` | 是 | source snapshot state 决定 summary 是否可用和 refresh/rejected 分支 | source/reference / 10.2 |
| work source summary | `WorkParticipationSourceState` | 是 | append career 前必须区分 accepted/pending/unavailable/rejected source | source/reference / 10.2 |
| `CareerRecord` | `CareerRecordStateKind` | 是 | career append-only、correction/superseded/pending source 影响后续写读 | business truth / 10.2 |
| memory source summary | `MemoryReferenceSourceState` | 是 | memory source pending/unavailable/verified 决定 relation state 和 callback 分支 | source/reference / 10.2 |
| `MemoryReference` | `MemoryReferenceStateKind` | 是 | linked/pending/stale/unavailable/archive/handoff relation state 由 command/consumer/callback 推进 | business truth / 10.2 |
| `IdentityVisibilityDecision` | `IdentityReadDispositionKind`;visibility scope/read subject | 是 | query visible/redacted/not-visible/degraded/stale-visible surface 不写 truth 但必须矩阵化优先级 | read/visibility / 10.3 |
| `MemberSummaryView` read/freshness | `IdentityReadSurfaceKind`;projection freshness marker | 是 | query surface 暴露 freshness/read disposition;query 不得 rebuild | read/visibility / 10.3 |
| trace / audit read surface | `IdentityReadDispositionKind`;trace/audit page surface | 是 | trace/audit query 需要 not-visible/redacted/degraded/missing/empty 优先级 | read/visibility / 10.3 |
| `ProjectionState` | `ProjectionStateKind` | 是 | stale/rebuild/failure 由 accepted write/job 推进;query 只读 | projection maintenance / 10.4 |
| `ReferenceResolutionState` | `ReferenceResolutionStateKind` | 是 | reference refresh/consumer sidecar 需要 resolved/stale/unavailable/unrecognized 等状态 | reference maintenance / 10.4 |
| `ReconciliationReport` | `ReconciliationReportStateKind` | 是 | report generated/partial/failed/no findings 影响 query/replay,且不得 repair truth | report maintenance / 10.4 |
| maintenance issue/finding disposition | `MaintenanceIssueKind`, `ReconciliationFindingMaterialKind` | 是,作为 report helper disposition | job report/finding 需要区分 retryable/fatal/finding-only 等 safe issue | report maintenance / 10.4 |
| `IdentityOutboxRecord` | `OutboxStateKind` | 是 | publish/retry/failure 状态由 outbox job 推进;Published != Delivered | outbox propagation / 10.5 |
| outbound visibility/material disposition | outbound policy outcome + `IdentityReadDispositionKind` | 是,作为 outbox policy disposition | accepted material 可能 allowed/skipped/redacted/forbidden;不得回滚 truth | outbox propagation / 10.5 |
| `TraceHandoffIntent` | `HandoffStateKind` | 是 | handoff pending/delivered/retryable/failed/cancelled 需要 receipt/issue marker | handoff propagation / 10.5 |
| handoff material disposition | `HandoffPolicy` target/scope/material outcome | 是,作为 handoff policy disposition | safe/forbidden/target unavailable/scope denied 决定是否创建或推进 handoff | handoff propagation / 10.5 |
| `IdentityIdempotencyRecord` | `IdentityIdempotencyStateKind` | 是 | reserve/completed/rejected/conflict 控制 duplicate replay/no rerun | application replay / 10.6 |
| `StoredIdentityOperationResult` | `IdentityStoredResultKind` | 是 | accepted/rejected/receipt/report replay variant 必须和 save/get surface 对称 | application replay / 10.6 |
| `IdentityJobRunReport` | `IdentityJobResultKind` | 是 | job succeeded/partial/failed/retryable/no-op 进入 stored replay 和 query/report surface;public `DuplicateReplayed` / `Rejected` 是 protocol disposition | job report / 10.6 |
| config validation | `IdentityConfigValidationStateKind` | 是 | runtime build 前 validation result 影响 entry readiness,但不改变 domain invariant | runtime technical / 10.7 |
| runtime assembly | `IdentityRuntimeAssemblyStateKind` | 是 | assembled/degraded/failed 只表达 wiring lifecycle,不等于 adapter healthy | runtime technical / 10.7 |
| adapter availability | `IdentityAdapterAvailabilityKind` | 是 | available/degraded/unavailable/disabled 驱动 resolver/publisher/handoff degraded,不得伪业务成功 | adapter technical / 10.7 |
| API entry validation / dispatch | `IdentityEntryValidationKind`, `IdentityEntryDispatchKind`, `IdentityEntrySurfaceKind` | 是 | entry valid / dispatch success 必须和 application accepted 分离 | entry technical / 10.7 |
| worker entry validation / dispatch | `IdentityWorkerEntryValidationKind`, `IdentityEntryDispatchKind` | 是 | ack/retry/dead-letter 与 business accepted 分离 | entry technical / 10.7 |
| job entry validation / dispatch | `IdentityJobEntryValidationKind`, `IdentityEntryDispatchKind` | 是 | job entry valid / duplicate candidate / dispatch success 不等于 job succeeded | entry technical / 10.7 |
| typed refs / ids | `GlobalMemberRef`, `CareerRecordRef`, `MemoryReferenceRef`, etc. | 否 | opaque identity,不是生命周期;不得从 ref 字符串推断状态 | 排除 |
| reason / source / evidence / material marker | `LifecycleReasonRef`, source refs, safe summary refs, material marker refs | 否 | 只作为状态 guard / 字段来源,不独立迁移 | 排除 |
| `IdentityOperationContext` | operation metadata/channel/actor | 否 | 只描述入口上下文,不表达业务或技术 lifecycle | 排除 |
| `IdentityRequestDigest` | canonical digest value / algorithm marker | 否 | replay key material,不是状态;duplicate 状态归 `IdentityIdempotencyRecord` | 排除 |
| `IdentityCommandEffectSummary` | accepted refs/cursor/effect summary | 否 | accepted effect 汇总,不独立推进状态 | 排除 |
| API/worker/job entry context | entry marker / metadata / binding marker | 否 | context 只是 validation 输入,状态归 validation / dispatch result | 排除 |
| external truth states | ProjectMember, role definition, memory/archive package, runtime process, adapter HTTP status | 否 | 外部仓 truth 或 adapter detail 不属于 identity 状态机 | 排除 |
| cache / lock / retry counter | implementation detail | 否 | 不属于设计 truth surface;retry policy后移 Step 14/12 | 排除 |

### 7.2 状态族分组表

| 状态族 | 状态机 | 所属模块 | 主要触发来源 | 停审顺序 |
|---|---|---|---|---|
| business truth | `IdentityAnchorState`, `GlobalLifecycleState`, high-risk lifecycle precheck | member / lifecycle | establish / lifecycle command | 10.1 已写入并保留 |
| business truth + source state | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, work source summary, `CareerRecord`, memory source summary, `MemoryReference` | role / career / memory | maintain role, append career, maintain memory, source consumer/callback | 10.2 已写入 |
| read / visibility | `IdentityVisibilityDecision`, member summary read/freshness, trace/audit read surface | query support / read model | all query flows | 10.3 已写入 |
| projection / reference / report maintenance | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationReport`, maintenance issue/finding disposition | maintenance / report | rebuild, refresh, reconciliation jobs;accepted stale marker | 10.4 |
| outbox / handoff propagation | `IdentityOutboxRecord`, outbound visibility/material disposition, `TraceHandoffIntent`, handoff material disposition | outbox / handoff | accepted outbox factory, publish/deliver/retry jobs, callback | 10.5 |
| application replay / job report | `IdentityIdempotencyRecord`, `StoredIdentityOperationResult`, `IdentityJobRunReport` | application support | reserve/complete/conflict, stored result save/load, job assembly | 10.6 |
| runtime / adapter / entry technical | config validation, runtime assembly, adapter availability, API/worker/job validation and dispatch | infra / api / worker / jobs entry | runtime bootstrap, adapter catalog, entry guard | 10.7 |
| cross-state audit | all accepted states | cross-step | naming, owner, terminal, no-write/no-repair, fake parity | 10.8 |

### 7.3 状态机 inventory

| State machine | 所属模块 | Step 6 enum / state value | 主要触发 flow / 函数 | 10.x 批次 | 状态 |
|---|---|---|---|---|---|
| `IdentityAnchorState` | member truth | `IdentityAnchorStateKind` | `EstablishGlobalMemberFlow`, lifecycle terminal hold side effect, `GlobalMember.hold_anchor(...)` | 10.1 | 已写入 |
| `GlobalLifecycleState` | lifecycle truth | `GlobalLifecycleStateKind` | `EstablishGlobalMemberFlow`, `UpdateGlobalLifecycleStateFlow`, `GlobalLifecycleState.transition_to(...)` | 10.1 | 已写入 |
| high-risk lifecycle precheck | lifecycle policy | `GovernanceBasisState` / lifecycle risk disposition | `HighRiskLifecycleGuard`, `UpdateGlobalLifecycleStateFlow` | 10.1 | 已写入 |
| `RoleCapabilitySummary` | role capability truth | `RoleCapabilitySummaryStateKind` | `MaintainRoleCapabilitySummaryFlow`, `HandleRoleCapabilitySourceChangedFlow` | 10.2 | 已写入 |
| `RoleCapabilitySourceSnapshot` | role source snapshot | `RoleCapabilitySourceStateKind` | source resolver, `HandleRoleCapabilitySourceChangedFlow`, refresh job marker | 10.2 | 已写入 |
| work source summary | career source input | `WorkParticipationSourceState` | `AppendCareerRecordFlow`, `HandleWorkParticipationAcceptedFlow` | 10.2 | 已写入 |
| `CareerRecord` | career history | `CareerRecordStateKind` | `AppendCareerRecordFlow`, correction side effect, work event consumer | 10.2 | 已写入 |
| memory source summary | memory source input | `MemoryReferenceSourceState` | memory source resolver / callback mapper | 10.2 | 已写入 |
| `MemoryReference` | memory relation truth | `MemoryReferenceStateKind` | `MaintainMemoryReferenceFlow`, `HandleMemoryReferenceSourceStateChangedFlow`, `HandleArchiveHandoffResultFlow` | 10.2 | 已写入 |
| read visibility decision | query support | `IdentityReadDispositionKind` | all query flows, `IdentityVisibilityDecision` factories | 10.3 | 已写入 |
| member summary read/freshness | projection/read view | `IdentityReadSurfaceKind` + projection freshness markers | `ReadMemberSummaryFlow`, core query optional summary reads | 10.3 | 已写入 |
| trace/audit read surface | trace/audit query | `IdentityReadDispositionKind` | `ReadIdentityTraceFlow`, `ReadAuditTrailFlow` | 10.3 | 已写入 |
| `ProjectionState` | projection maintenance | `ProjectionStateKind` | accepted stale marker, `RebuildIdentityProjectionFlow` | 10.4 | 已写入 |
| `ReferenceResolutionState` | reference maintenance | `ReferenceResolutionStateKind` | consumer sidecar update, `RefreshExternalReferenceStateFlow` | 10.4 | 已写入 |
| `ReconciliationReport` | report-only maintenance | `ReconciliationReportStateKind` | `RunIdentityReconciliationFlow` | 10.4 | 已写入 |
| maintenance issue/finding disposition | maintenance report helper | `MaintenanceIssueKind`, `ReconciliationFindingMaterialKind` | maintenance issue mapper, reconciliation report builder | 10.4 | 已写入 |
| `IdentityOutboxRecord` | outbox propagation | `OutboxStateKind` | accepted outbox factory, `PublishIdentityOutboxFlow`, retry job | 10.5 | 已写入 |
| outbound visibility/material disposition | outbox policy | `IdentityReadDispositionKind` / outbound material guard | `OutboundEventPolicy`, 9.4 material audit | 10.5 | 已写入 |
| `TraceHandoffIntent` | handoff propagation | `HandoffStateKind` | `PrepareTraceHandoffFlow`, `HandleTraceHandoffResultFlow`, retry job | 10.5 | 已写入 |
| handoff material disposition | handoff policy | safe/forbidden/target unavailable/scope denied disposition | `HandoffPolicy`, target resolver, callback/job outcome | 10.5 | 已写入 |
| `IdentityIdempotencyRecord` | application support | `IdentityIdempotencyStateKind` | reserve, complete, complete rejected, conflict, expiry | 10.6 | 已写入 |
| `StoredIdentityOperationResult` | application stored replay | `IdentityStoredResultKind` | command/consumer/callback/job stored result factories | 10.6 | 已写入 |
| `IdentityJobRunReport` | application jobs | `IdentityJobResultKind` | all operations job flows and duplicate replay | 10.6 | 已写入 |
| config validation | runtime config | `IdentityConfigValidationStateKind` | config loader / runtime builder | 10.7 | 已写入 |
| runtime assembly | infra runtime | `IdentityRuntimeAssemblyStateKind` | runtime bootstrap and entry readiness | 10.7 | 已写入 |
| adapter availability | infra adapter | `IdentityAdapterAvailabilityKind` | adapter catalog/config/health summary | 10.7 | 已写入 |
| API entry validation / dispatch | API entry | `IdentityEntryValidationKind`, `IdentityEntryDispatchKind`, `IdentityEntrySurfaceKind` | API handler entry and dispatch guard | 10.7 | 已写入 |
| worker entry validation / dispatch | worker entry | `IdentityWorkerEntryValidationKind`, `IdentityEntryDispatchKind` | worker consumer/callback entry and dispatch guard | 10.7 | 已写入 |
| job entry validation / dispatch | jobs entry | `IdentityJobEntryValidationKind`, `IdentityEntryDispatchKind` | jobs runner entry and dispatch guard | 10.7 | 已写入 |

### 7.4 通用状态矩阵规则

| 规则 | 正式口径 |
|---|---|
| 状态名来源 | 必须使用 Step 6 已定义 enum / state value;不得新增同义状态 |
| trigger 来源 | 必须是 Step 6 object factory / member method / policy,Step 7 repository marker update,或 Step 9 flow |
| precheck 边界 | precheck 只能校验已有状态;若要推进状态,必须成为 flow 中正式 transition step |
| 前置条件来源 | 只能引用 DTO 字段、loaded truth、versioned repository read、resolver summary、policy decision、stored surface 或 job input |
| 副作用边界 | domain method 只改对象字段;trace/audit/outbox/projection/stored result 由 Step 9 application flow 编排 |
| 非法转换错误 | 本 Step 使用 invalid-transition 占位;具体 `IdentityDomainError` / `ApplicationError` variant 由 Step 12 闭合 |
| terminal 状态 | 标为终态的状态不得直接 reopen;需要后续处理时必须创建新 truth、new marker 或正式 replacement transition |
| query 状态 | query 只能读取并表达 surface;不得 refresh、rebuild、append、mark stale/fresh 或保存 result |
| job 状态 | job 只能维护 projection/reference/report/outbox/handoff/report helper;不得修复 core identity truth |
| version 来源 | update existing state 必须能回指 Step 7 / Step 11 versioned read/list 来源 |
| phase reserved | 当前 phase 不调用的状态或迁移必须标注 reserved,不得被 implementation boundary 使用 |

### 7.5 状态机写法模板

```text
[StateMachineName]
  StateA -> StateB -> StateC
  StateA -> TerminalX
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 |  |  |
| 状态名是否一致 |  |  |
| 触发函数是否存在 |  |  |
| 前置条件字段是否闭合 |  |  |
| 非法转换错误是否有 Step 12 承接 |  |  |
| 副作用是否闭合 |  |  |
| 测试切口是否可写 |  |  |

### 7.6 Step 10 redlines

| Redline | 违反例 | 正确处理 |
|---|---|---|
| 不跳过状态主语筛选 | 把所有对象都写入状态矩阵 | 先列候选主语,排除 ref/value object/DTO wrapper/external truth/cache |
| 不新增全局状态机 | 为统一管理新增 `IdentityGlobalState` | 跨对象规则写入 10.8 audit,不创建 global state table |
| 不新增 Step 6 之外的状态名 | 在矩阵里新增 `ArchivedDelivered` | 回 Step 6/8/9 闭口或复用正式 enum |
| 不让 precheck 隐式迁移 | query/load precheck 顺手把 stale 改 fresh | 把 transition 写入正式 flow 或只返回 surface |
| 不写无 trigger 的迁移 | `Failed -> Active` 但无 domain method/job flow | 暂停补 Step 6 method 或删掉迁移 |
| 不写无字段来源的 guard | `requires valid evidence` 但无 evidence summary ref/digest/port | 回 Step 6/7/8 |
| 不把 side effect failure 反写 truth | publish failed 后改 lifecycle | outbox/handoff 状态独立报告 |
| 不把 query state 当 mutation | query missing 时创建 projection/reference | query 返回 Missing/Degraded/StaleVisible |
| 不把 entry/result 状态混同业务状态 | API dispatch success 当 command accepted | entry dispatch 只说明 application boundary was called |
| 不让 fake 私有状态补缺口 | fake 用 map 自动推 delivered | fake 必须通过同一 formal state transition |

### 7.7 10.0 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.0 范围 | 通过 | 只写状态主语筛选、状态族分组、清单、模板、红线和 10.1 保留判断 |
| 是否完成状态主语筛选 | 通过 | §7.1 已区分进入矩阵和排除对象 |
| 是否禁止 global state table | 通过 | §7.1 / §7.6 明确不得新增 `IdentityGlobalState` / `SystemState` |
| 是否读取 governance Step 10 粒度 | 通过 | 采用每个状态机一组状态集合、ASCII 图、矩阵和停审记录的粒度 |
| 是否回指 Step 6/8/9 | 通过 | 状态主语和 inventory 均来自 Step 6 enum / Step 8 protocol / Step 9 flow |
| 是否新增状态 variant | 未新增 | 本批不新增任何状态名或迁移 |
| 现有 10.1 是否保留 | 通过 | 10.1 的 anchor/lifecycle/precheck 三个主语均通过 §7.1 筛选,矩阵可保留 |
| 是否越过 Step 11~16 | 未越过 | DDL、错误全集、idempotency 细节、config、observability、tests 均后移 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.8 10.1 member / lifecycle truth states

本批只写 member anchor、global lifecycle 和 high-risk lifecycle precheck。它闭合 Step 6/8/9 已明确交给 Step 10 的三个点:

- `Retired` 允许后续进入 `Tombstoned`,这是唯一允许的 terminal upgrade;同步把 anchor 从 `RetiredHeld` 更新为 `TombstoneHeld`。
- `RetiredHeld` / `TombstoneHeld` 的 `reason_ref` 必须非空;字段类型保留 `Option` 只用于承接 `Established` 的 `None`。
- `GlobalMemberAvailabilityChanged` 只由 lifecycle accepted transition 的 old/new `is_available()` 变化触发;initial establish 不额外发 availability material。

#### 7.8.1 `IdentityAnchorStateKind`

```text
[IdentityAnchorState]
  factory -> Established -> RetiredHeld -> TombstoneHeld
                         -> TombstoneHeld
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Established` | `GlobalMemberRef` 已被当前 member truth 占用,可被其它 identity truth 引用 | 否 | terminal lifecycle accepted 时进入 `RetiredHeld` 或 `TombstoneHeld`;不得释放 ref |
| `RetiredHeld` | member ref 因退役被永久持有,不得复用 | 准终态 | 只允许在 explicit tombstone lifecycle accepted 时升级到 `TombstoneHeld` |
| `TombstoneHeld` | member ref 因墓碑化被永久持有 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Established` | `IdentityAnchorState::established(changed_at)` / `GlobalMember::establish(...)` | `EstablishGlobalMemberFlow` | `IdentityAnchorPolicy::assert_can_establish()` 通过;existing anchor is `None`;clock 已取得 | `state_kind = Established`;`reason_ref = None`;`changed_at = now` | save member + initial lifecycle;append trace/audit/outbox/stale/effect/stored result | `ApplicationError::InvalidCommandInput` or `IdentityDomainError::InvalidStateTransition` |
| `Established` | `RetiredHeld` | `IdentityAnchorState::retired_held(reason_ref, changed_at)` + `GlobalMember.hold_anchor(...)` | `UpdateGlobalLifecycleStateFlow` target `Retired` | lifecycle transition to `Retired` 已通过;anchor reason = `IdentityAnchorReasonRef::new(Retired, request.reason_ref.source_ref)`;member loaded with version | `state_kind = RetiredHeld`;`reason_ref = Some(anchor_reason)`;`changed_at = now`;ref remains non-reusable | save lifecycle and member in same UoW;append lifecycle trace/audit/outbox, anchor outbox, stale/effect/stored result | `IdentityDomainError::InvalidStateTransition` |
| `Established` | `TombstoneHeld` | `IdentityAnchorState::tombstone_held(reason_ref, changed_at)` + `GlobalMember.hold_anchor(...)` | `UpdateGlobalLifecycleStateFlow` target `Tombstoned` | lifecycle transition to `Tombstoned` 已通过;anchor reason = `IdentityAnchorReasonRef::new(Tombstoned, request.reason_ref.source_ref)`;member loaded with version | `state_kind = TombstoneHeld`;`reason_ref = Some(anchor_reason)`;`changed_at = now`;ref remains non-reusable | save lifecycle and member in same UoW;append lifecycle trace/audit/outbox, anchor outbox, stale/effect/stored result | `IdentityDomainError::InvalidStateTransition` |
| `RetiredHeld` | `TombstoneHeld` | `IdentityAnchorState::tombstone_held(reason_ref, changed_at)` + `GlobalMember.hold_anchor(...)` | `UpdateGlobalLifecycleStateFlow` target `Tombstoned` from lifecycle `Retired` | lifecycle `Retired -> Tombstoned` terminal upgrade 已通过;anchor reason uses lifecycle reason source;member loaded with version | `state_kind = TombstoneHeld`;replace retired hold reason with tombstone reason;ref remains non-reusable | save lifecycle and member in same UoW;append lifecycle/anchor material;mark projections stale | `IdentityDomainError::InvalidStateTransition` |

Forbidden anchor transitions:

| From | Forbidden To / operation | Reason |
|---|---|---|
| `Established` | factory create same ref again | existing anchor blocks ref reuse |
| `RetiredHeld` | `Established` | retired ref is never reusable |
| `TombstoneHeld` | `Established` / `RetiredHeld` | tombstone hold is terminal |
| any | `Released` / `Reusable` | no such Step 6 state exists |
| query / job / projection | any anchor transition | only accepted command flow may update anchor truth |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityAnchorStateKind::{Established,RetiredHeld,TombstoneHeld}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 未新增 `Released` / `Reusable` |
| 触发函数是否存在 | 通过 | Step 6 factory 与 `GlobalMember.hold_anchor(...)`;Step 9 terminal lifecycle flow |
| 前置条件字段是否闭合 | 通过 | anchor reason 来源为 lifecycle reason `source_ref`;expected version 来自 loaded member |
| 非法转换错误是否有 Step 12 承接 | 通过 | 本 Step 使用 invalid-transition / conflict 占位;public mapping 留 Step 12 |
| 副作用是否闭合 | 通过 | accepted path 按 Step 9 写 trace/audit/outbox/stale/effect/stored result |
| 测试切口是否可写 | 通过 | establish reason none;retire hold reason some;tombstone upgrade;terminal no reopen;query no-create |

#### 7.8.2 `GlobalLifecycleStateKind`

```text
[GlobalLifecycleState]
  factory -> Available -> Paused -> Available
             Available -> Retired -> Tombstoned
             Available -> Tombstoned
             Paused -> Retired
             Paused -> Tombstoned
```

| 状态 | 作用 | 是否终态 | `is_available()` | 允许的关键操作 |
|---|---|---|---|---|
| `Available` | 成员在平台范围内可被选择、调用或展示 | 否 | `true` | pause、retire、tombstone |
| `Paused` | 成员被显式暂停,暂不可用 | 否 | `false` | resume、retire、tombstone |
| `Retired` | 成员已退役,不再回到普通可用主线 | 准终态 | `false` | 只允许 explicit tombstone terminal upgrade |
| `Tombstoned` | 成员墓碑化,ref 由 anchor 永久持有 | 是 | `false` | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Available` | `GlobalLifecycleState::initial_available(actor_ref, reason_ref, changed_at)` | `EstablishGlobalMemberFlow` | member establish accepted;`initial_lifecycle_reason_ref` exists;clock 已取得 | `state_kind = Available`;`basis_ref = None`;reason/actor/time from command | save initial lifecycle with member;`GlobalMemberEstablished` carries initial lifecycle;no `GlobalLifecycleChanged`;no initial availability event | `ApplicationError::InvalidCommandInput` |
| `Available` | `Paused` | `LifecycleTransitionPolicy::assert_allowed_transition()` + `GlobalLifecycleState::from_transition(...)` | `UpdateGlobalLifecycleStateFlow` | explicit command channel;actor/reason present;target `Paused`;high-risk precheck either not required or allowed | new lifecycle state `Paused`;reason/actor/time set;basis only if high-risk allowed | save lifecycle;append `GlobalLifecycleChanged`;append `GlobalMemberAvailabilityChanged` because `true -> false`;stale/effect/stored result | `IdentityDomainError::InvalidStateTransition` |
| `Paused` | `Available` | same as above | `UpdateGlobalLifecycleStateFlow` | explicit command;actor/reason present;target `Available`;basis must not be an unverified non-risk marker | new lifecycle state `Available`;reason/actor/time set;basis normally `None` | save lifecycle;append `GlobalLifecycleChanged`;append `GlobalMemberAvailabilityChanged` because `false -> true`;stale/effect/stored result | `IdentityDomainError::InvalidStateTransition` |
| `Available` / `Paused` | `Retired` | same as above | `UpdateGlobalLifecycleStateFlow` | explicit command;actor/reason present;target `Retired`;high-risk precheck disposition is allowed when required | new lifecycle state `Retired`;reason/actor/time set;optional verified basis saved | save lifecycle;update anchor to `RetiredHeld`;append lifecycle + anchor outbox;availability event only when old was `Available` | `IdentityDomainError::InvalidStateTransition` |
| `Available` / `Paused` | `Tombstoned` | same as above | `UpdateGlobalLifecycleStateFlow` | explicit command;actor/reason present;target `Tombstoned`;high-risk precheck disposition is allowed when required | new lifecycle state `Tombstoned`;reason/actor/time set;optional verified basis saved | save lifecycle;update anchor to `TombstoneHeld`;append lifecycle + anchor outbox;availability event only when old was `Available` | `IdentityDomainError::InvalidStateTransition` |
| `Retired` | `Tombstoned` | same as above | `UpdateGlobalLifecycleStateFlow` | explicit command;actor/reason present;target `Tombstoned`;high-risk precheck disposition is allowed when required;loaded retired lifecycle still belongs to same member | new lifecycle state `Tombstoned`;reason/actor/time set;optional verified basis saved | save lifecycle;update anchor to `TombstoneHeld`;append lifecycle + anchor outbox;no availability event because `false -> false` | `IdentityDomainError::InvalidStateTransition` |

Forbidden lifecycle transitions:

| From | Forbidden To / operation | Reason |
|---|---|---|
| `Available` | `Available` | self-target is not a state transition;public no-op/conflict mapping belongs to Step 12/13 if ever needed |
| `Paused` | `Paused` | self-target is not a state transition |
| `Retired` | `Available` / `Paused` / `Retired` | retired does not reopen into ordinary mainline |
| `Tombstoned` | any state | tombstoned is terminal |
| any | runtime / ProjectMember / worker state | wrong owner;not a `GlobalLifecycleStateKind` |
| query / job / projection | any lifecycle transition | lifecycle truth write is command-only in this phase |

Availability material rule:

| Transition | `GlobalMemberAvailabilityChanged` |
|---|---|
| factory -> `Available` | not emitted;initial availability is carried by `GlobalMemberEstablishedPayload.lifecycle_state_kind` |
| `Available -> Paused` | emitted with `is_available = false` |
| `Paused -> Available` | emitted with `is_available = true` |
| `Available -> Retired` | emitted with `is_available = false` |
| `Paused -> Retired` | not emitted |
| `Available -> Tombstoned` | emitted with `is_available = false` |
| `Paused -> Tombstoned` | not emitted |
| `Retired -> Tombstoned` | not emitted |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GlobalLifecycleStateKind::{Available,Paused,Retired,Tombstoned}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 未引入 runtime / ProjectMember / availability summary 状态 |
| 触发函数是否存在 | 通过 | Step 6 `initial_available/from_transition/transition_to` 与 `LifecycleTransitionPolicy` |
| 前置条件字段是否闭合 | 通过 | current lifecycle/version、member/version、target、reason、actor、clock、basis summary 均来自 Step 7~9 |
| 非法转换错误是否有 Step 12 承接 | 通过 | invalid-transition / rejected / dependency surface 细分留 Step 12 |
| 副作用是否闭合 | 通过 | Step 9 已固定 trace/audit/outbox/stale/effect/stored result 顺序 |
| 测试切口是否可写 | 通过 | pause/resume、retire/tombstone、retired tombstone upgrade、tombstone terminal、availability event condition |

#### 7.8.3 lifecycle high-risk precheck disposition

本小节不新增持久化 state enum。矩阵中的 disposition 是 `UpdateGlobalLifecycleStateFlow` 在进入 `GlobalLifecycleState::from_transition(...)` 前的 branch outcome,其输入只来自 `LifecycleRiskRef::requires_governance_basis()`、request `basis_ref` 和 resolver 返回的 `GovernanceBasisSummary` / `GovernanceBasisState`。

```text
[HighRiskLifecyclePrecheck]
  no risk marker -> NoBasisRequired -> TransitionPolicy
  Low/Medium risk -> NoBasisRequired -> TransitionPolicy
  High/Critical risk + missing basis -> NotAccepted
  High/Critical risk + basis -> ResolveBasis -> BasisAccepted -> TransitionPolicy
                                             -> NotAccepted
```

| Disposition | 输入条件 | 是否允许进入 lifecycle transition | basis 是否保存进 lifecycle | 后续 public surface |
|---|---|---|---|---|
| `NoBasisRequired` | `action_risk_ref` absent,或 `requires_governance_basis() == false`,且 request `basis_ref == None` | 是 | 否 | 普通 accepted / rejected 由 transition matrix 决定 |
| `UnexpectedBasisForNonRisk` | `requires_governance_basis() == false`,但 request `basis_ref == Some(_)` | 否 | 否 | invalid request / policy denied mapping 留 Step 12 |
| `MissingBasis` | `requires_governance_basis() == true`,但 request `basis_ref == None` | 否 | 否 | rejected / pending-basis mapping 留 Step 12 |
| `BasisAccepted` | resolver returns `GovernanceBasisState::Valid` 且 `summary.is_valid_for(action_risk_ref)` | 是 | 是,只保存 body-free `GovernanceBasisRef` | accepted path |
| `BasisStale` | resolver returns `GovernanceBasisState::Stale` | 否 | 否 | rejected / dependency / pending mapping 留 Step 12 |
| `BasisUnavailable` | resolver returns `GovernanceBasisState::Unavailable` 或 resolver dependency unavailable | 否 | 否 | dependency unavailable / retry surface 留 Step 12/14 |
| `BasisInvalidForAction` | resolver returns `GovernanceBasisState::InvalidForAction`,或 `Valid` 但 `is_valid_for(...) == false` | 否 | 否 | policy denied mapping 留 Step 12 |
| `BasisNotFound` | resolver returns `GovernanceBasisState::NotFound` | 否 | 否 | not found / policy denied mapping 留 Step 12 |

Risk interpretation for this Step:

| Risk marker | Basis rule |
|---|---|
| no `action_risk_ref` | no resolver call;request `basis_ref` must be absent |
| `LifecycleRiskKind::Low` | no resolver call;request `basis_ref` must be absent |
| `LifecycleRiskKind::Medium` | no resolver call in current matrix;if Step 14 config wants Medium to require basis,it must update the formal risk helper / matrix instead of service-side guessing |
| `LifecycleRiskKind::High` | basis required |
| `LifecycleRiskKind::Critical` | basis required;terminal lifecycle handling still uses the same anchor rules above |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| request | `NoBasisRequired` | `LifecycleRiskRef::requires_governance_basis()` | `UpdateGlobalLifecycleStateFlow` | no risk marker or non-risk marker;`basis_ref == None` | none | continue to lifecycle transition policy | none |
| request | `UnexpectedBasisForNonRisk` | precheck branch | `UpdateGlobalLifecycleStateFlow` | non-risk marker with `basis_ref == Some(_)` | none | rollback/no lifecycle save;stored rejected only if Step 12/13 classifies | `ApplicationError::InvalidStateTransition` placeholder |
| request | `MissingBasis` | `HighRiskLifecycleGuard::assert_basis_present()` | `UpdateGlobalLifecycleStateFlow` | `requires_governance_basis() == true`;`basis_ref == None` | none | rollback/no lifecycle save | `ApplicationError::InvalidStateTransition` placeholder |
| request | `BasisAccepted` | `resolve_governance_basis(...)` + `summary.is_valid_for(...)` | `UpdateGlobalLifecycleStateFlow` | basis resolver returns `Valid`;supports same risk | none in precheck;later lifecycle saves basis ref | continue to lifecycle transition;accepted side effects only after domain transition succeeds | none |
| request | not accepted basis outcome | resolver summary branch | `UpdateGlobalLifecycleStateFlow` | `Stale` / `Unavailable` / `InvalidForAction` / `NotFound` / resolver `ApplicationError` | none | rollback/no lifecycle save;public mapping Step 12 | `ApplicationError::InvalidStateTransition` or dependency placeholder |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | 使用 Step 6 `LifecycleRiskKind`、`LifecycleRiskRef`、`GovernanceBasisState`;未新增持久化 state |
| 状态名是否一致 | 通过 | disposition labels are matrix branch names only |
| 触发函数是否存在 | 通过 | Step 6 `HighRiskLifecycleGuard`;Step 7 `resolve_governance_basis`;Step 9 high-risk precheck |
| 前置条件字段是否闭合 | 通过 | risk marker、basis ref、basis summary 均已在 Step 6~9 定义 |
| 非法转换错误是否有 Step 12 承接 | 通过 | missing/invalid/stale/unavailable/not found 的 public priority 留 Step 12 |
| 副作用是否闭合 | 通过 | precheck failure never writes lifecycle/anchor/trace/outbox;accepted side effects only after transition succeeds |
| 测试切口是否可写 | 通过 | missing basis rejected;basis presence only rejected;valid basis accepted;stale/unavailable/invalid/not found not accepted;non-risk basis rejected |

#### 7.8.4 10.1 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.1 范围 | 通过 | 只覆盖 anchor、lifecycle 和 high-risk precheck |
| 是否回指 Step 6/8/9 | 通过 | 状态 enum、DTO 字段、policy/helper、resolver 和 flow 均有来源 |
| 是否闭合 `Retired -> Tombstoned` | 通过 | 允许 lifecycle terminal upgrade,同步 anchor `RetiredHeld -> TombstoneHeld` |
| terminal anchor reason 是否闭合 | 通过 | terminal hold 必须 `Some(IdentityAnchorReasonRef)`,来源为 lifecycle reason source |
| availability event condition 是否闭合 | 通过 | 只比较 old/new `GlobalLifecycleState::is_available()`;initial establish 不发 availability |
| 是否新增状态 variant | 未新增 | high-risk disposition 不是持久化 enum |
| 是否越过 Step 12/13/14 | 未越过 | public error priority、stored rejected replay、config risk binding 留后续 Step |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.9 10.2 role / career / memory truth and source states

本批只覆盖 `RoleCapabilitySummaryStateKind`, `RoleCapabilitySourceStateKind`, `WorkParticipationSourceState`, `CareerRecordStateKind`, `MemoryReferenceSourceState` 和 `MemoryReferenceStateKind`。本批不写 query read disposition、projection/reference refresh、outbox publish、handoff delivery、idempotency replay 或 runtime/entry state。

本批固定三条边界:

- Source summary state 是 command / consumer / callback 的 guard 输入或 branch outcome;除 `RoleCapabilitySourceSnapshot.source_state` 外,不得凭 summary state 私建第二个 source truth。
- Duplicate / rejected / no-op / quarantined 是 application surface 或 stored receipt/result surface,不是 `CareerRecordStateKind` / `MemoryReferenceStateKind`。
- Pending review / pending verification 只有显式 request intent 或正式 payload target 才能持久化;普通 append/link 遇到 pending/untrusted/unavailable source 不得 silent accepted。

#### 7.9.1 `RoleCapabilitySourceStateKind`

```text
[RoleCapabilitySourceSnapshot]
  factory -> SourceResolved -> SourceStale -> SourceResolved
                              -> SourceUnavailable -> SourceResolved
                              -> SourceSuperseded
             SourceResolved -> SourceUnavailable -> SourceResolved
             SourceResolved -> SourceUnrecognized -> SourceResolved
             SourceResolved -> SourceSuperseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `SourceResolved` | source 可解析,具备 source version、safe summary 和 evidence refs | 否 | 可用于 `RoleCapabilitySummary::Active`;可被 source event 标记 stale/unavailable/unrecognized/superseded |
| `SourceStale` | 已知 source version 变化或 snapshot 过期 | 否 | source resolver / source event 可重新 resolved;也可转 unavailable/superseded |
| `SourceUnavailable` | source 暂不可用或依赖不可用 | 否 | 后续 resolved 可恢复;也可被 replacement superseded |
| `SourceUnrecognized` | source marker 无法映射到正式 role/capability source | 否 | 只有新的正式 resolved source 可以恢复;也可被 superseded |
| `SourceSuperseded` | snapshot 已被新 snapshot / source version 替代 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory / missing snapshot | `SourceResolved` | `RoleCapabilitySourceSnapshot::from_resolved_source(...)` | `MaintainRoleCapabilitySummaryFlow`;`HandleRoleCapabilitySourceChangedFlow` | resolver/payload source state is `SourceResolved`;`source_version_ref` belongs to `source_ref`;`safe_summary_ref` exists and belongs to source;evidence refs are body-free | new snapshot with `source_state = SourceResolved` | save source snapshot;may save active summary;trace/audit/outbox/stale/result only after accepted save | `IdentityDomainError::InvalidStateTransition` / rejected surface Step 12 |
| factory / missing snapshot | `SourceUnavailable` | `RoleCapabilitySourceSnapshot::unavailable(...)` | `HandleRoleCapabilitySourceChangedFlow` | payload source state is `SourceUnavailable`;snapshot ref from id generator;source ref valid;`source_version_ref` belongs to `source_ref` | new unavailable snapshot with source version marker;no active summary create | save source snapshot;may mark current summary unavailable;source-state outbox only | rejected/quarantined Step 12 if marker invalid or source version absent |
| factory / missing snapshot | `SourceUnrecognized` | `RoleCapabilitySourceSnapshot::unrecognized(...)` | `HandleRoleCapabilitySourceChangedFlow` | payload source state is `SourceUnrecognized`;source marker body-free;`source_version_ref` belongs to `source_ref` | new unrecognized snapshot with source version marker;no active summary create | save source snapshot;source-state outbox only | rejected/quarantined Step 12 if marker invalid or source version absent |
| `SourceResolved` / `SourceStale` / `SourceUnavailable` / `SourceUnrecognized` | `SourceResolved` | `from_resolved_source(...)` replacement over existing snapshot ref | `MaintainRoleCapabilitySummaryFlow`;`HandleRoleCapabilitySourceChangedFlow` | loaded snapshot version;new version/safe summary/evidence from resolver or payload;material marker safe | snapshot fields replaced by resolved body-free refs | versioned save using loaded snapshot version;may activate summary | optimistic conflict / invalid transition |
| `SourceResolved` / `SourceStale` | `SourceStale` | `mark_stale(new_version_ref, changed_at)` | `HandleRoleCapabilitySourceChangedFlow`;reference refresh marker | loaded existing snapshot;new source version belongs to same source | source state stale;source version updated | may mark current summary stale;no active summary create | missing existing snapshot -> quarantined marker receipt |
| `SourceResolved` / `SourceStale` | `SourceUnavailable` | `mark_unavailable(checked_at)` | `HandleRoleCapabilitySourceChangedFlow`;resolver unavailable branch | loaded existing snapshot or explicit unavailable factory;source marker valid;existing/factory path has same-source version marker | source state unavailable;existing source version preserved or factory version recorded;safe summary may be absent | may mark current summary unavailable | invalid marker / partial bundle rejected |
| `SourceResolved` / `SourceStale` / `SourceUnavailable` / `SourceUnrecognized` | `SourceSuperseded` | `mark_superseded(new_version_ref, changed_at)` | source changed / accepted replacement | loaded existing snapshot;replacement version marker present | old snapshot terminal marker | no active summary from superseded snapshot | missing existing snapshot -> quarantined marker receipt |

Forbidden source snapshot transitions:

| From | Forbidden To / operation | Reason |
|---|---|---|
| missing snapshot | `SourceStale` / `SourceSuperseded` | Step 9 requires existing snapshot;missing is marker-only / quarantined,not derived snapshot id |
| `SourceSuperseded` | any non-terminal state | superseded snapshot is old history;new resolution must use current snapshot / replacement path |
| any non-resolved state | active summary write | `RoleCapabilitySourcePolicy.assert_source_usable()` requires `SourceResolved` |
| query / projection / report | any source snapshot transition | source snapshot writes are command or consumer only in this batch |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `RoleCapabilitySourceStateKind::{SourceResolved,SourceStale,SourceUnavailable,SourceUnrecognized,SourceSuperseded}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 未新增 `ResolvedWithWarning` / `MissingEvidence` 等同义 state |
| 触发函数是否存在 | 通过 | Step 6 factories / marker methods 与 Step 9 command/source consumer flow |
| 前置条件字段是否闭合 | 通过 | source ref/version/safe summary/evidence/material marker 均来自 Step 7 resolver 或 Step 8 payload |
| 非法转换错误是否有 Step 12 承接 | 通过 | public rejected/quarantined/dependency priority 留 Step 12 |
| 副作用是否闭合 | 通过 | accepted source snapshot save 后才写 trace/audit/outbox/stale/stored receipt |
| 测试切口是否可写 | 通过 | resolved create/update;stale requires existing;unavailable marks summary;superseded terminal;missing snapshot stale quarantined |

#### 7.9.2 `RoleCapabilitySummaryStateKind`

```text
[RoleCapabilitySummary]
  factory -> Active -> Stale -> Active
                    -> Unavailable -> Active
                    -> PendingReconciliation -> Active
                    -> Superseded
           Active -> PendingReconciliation -> Unavailable
           Stale / Unavailable / PendingReconciliation -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 当前摘要可用于受控读取和筛选 | 否 | update summary;source changed 可降为 stale/unavailable/pending;replacement 可 supersede |
| `Stale` | source 变化后摘要过期,不得静默当最新 | 否 | resolved source + policy pass 后回到 active;也可 unavailable/pending/superseded |
| `Unavailable` | source 不可用导致摘要不能作为当前可用事实 | 否 | resolved source 后回 active;也可 pending/superseded |
| `PendingReconciliation` | 摘要与 source 有待对账差异 | 否 | formal maintain/reconciliation follow-up 回 active/unavailable/superseded |
| `Superseded` | 摘要被更新版本替代,不得作为 current summary | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Active` | `RoleCapabilitySummary::create_for_member(...)` | `MaintainRoleCapabilitySummaryFlow` | member exists;source snapshot is `SourceResolved`;source version/safe summary/evidence present;policy body-free/scoring guard passed | new summary with `summary_state = Active`;snapshot ref/evidence/safe marker set | save snapshot + summary;trace/audit/outbox/stale/effect/stored result | invalid command / invalid transition |
| `Active` / `Stale` / `Unavailable` / `PendingReconciliation` | `Active` | `attach_role_source(...)`;`update_capability_summary(...)` | `MaintainRoleCapabilitySummaryFlow` | loaded current summary belongs to member;resolved source usable;request summary ref not conflicting with current-by-member;versioned save source | summary refs/evidence/safe marker refreshed;state active | save summary using loaded version;source snapshot save with loaded version | conflict / invalid transition |
| `Active` | `Stale` | `mark_stale(source_snapshot, changed_at)` | `HandleRoleCapabilitySourceChangedFlow` | current summary loaded;source event snapshot is stale or newer version;summary linked to affected source | summary state stale;source snapshot ref updated if supplied | save summary;create summary changed outbox only if current summary changed | invalid transition / optimistic conflict |
| `Active` / `Stale` / `PendingReconciliation` | `Unavailable` | `mark_unavailable(source_ref, changed_at)` | `HandleRoleCapabilitySourceChangedFlow` | source event / resolver marks source unavailable;current summary loaded for same source/member | summary state unavailable | save summary;source-state and optional summary material | invalid transition |
| `Active` / `Stale` / `Unavailable` | `PendingReconciliation` | reconciliation/source drift marker | source changed / maintenance finding handoff | formal drift source;no direct source repair | summary state pending reconciliation | save summary only through formal flow;report details stay report-only | reserved if no current Step 9 flow calls it |
| non-terminal | `Superseded` | accepted replacement marker | maintain summary replacement / migration | replacement summary ref exists;old summary loaded with version | old summary no longer current | save old summary state if replacement path exists;outbox only for accepted replacement material | invalid transition |

Forbidden summary transitions:

| From | Forbidden To / operation | Reason |
|---|---|---|
| factory | `Stale` / `PendingReconciliation` / `Superseded` | initial summary without active source is not accepted summary;non-active source snapshot may be saved separately only by formal source flow |
| any | `Active` with non-`SourceResolved` snapshot | stale/unavailable/unrecognized source cannot produce active summary |
| `Superseded` | any current state | replacement creates or updates current summary;old summary does not reopen |
| duplicate command / source duplicate | any summary transition | duplicate replays stored result or returns conflict/no-op surface;no mutation |
| query / projection / report | any summary transition | read and maintenance report do not repair role summary truth in 10.2 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `RoleCapabilitySummaryStateKind::{Active,Stale,Unavailable,PendingReconciliation,Superseded}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `MissingEvidence` / `Rejected` 不写入 summary state |
| 触发函数是否存在 | 通过 | create/update/mark stale/mark unavailable/requires reconciliation 均有 Step 6 surface;replacement path reserved |
| 前置条件字段是否闭合 | 通过 | member/current summary/source snapshot/evidence/material/id/version 均来自 Step 7~9 |
| 非法转换错误是否有 Step 12 承接 | 通过 | rejected/conflict/degraded public mapping 后移 |
| 副作用是否闭合 | 通过 | accepted summary save 后写 trace/audit/outbox/stale/effect/stored result;source-only change可不创建 summary |
| 测试切口是否可写 | 通过 | active create;non-resolved source not active;source stale marks summary;source unavailable marks unavailable;superseded no reopen |

#### 7.9.3 `WorkParticipationSourceState`

本小节是 source summary branch matrix,不是持久化 `CareerRecord` 状态。`WorkParticipationSourceState` 只来自 `IdentityExternalSourceResolverPort.resolve_work_participation(...)` 或 `WorkParticipationAcceptedPayload` safe mapper,用于决定是否允许创建 `CareerRecord`。

```text
[WorkParticipationSourceSummary]
  Trusted -> Appended / CorrectionAppended
  PendingReview -> SourcePendingReview only with explicit MarkSourcePendingReview
  Unresolved / Untrusted / Unavailable -> no mainline append
```

| Source state | 作用 | 可否普通 append/correction | 可否 pending record | 后续 surface |
|---|---|---|---|---|
| `Trusted` | work source 可用于 accepted career mainline | 是,且 safe summary must exist | 否 | `Appended` / `CorrectionAppended` |
| `PendingReview` | source 存在但需要正式复核 | 否 | 是,仅 `MarkSourcePendingReview` | `SourcePendingReview` 或 rejected surface |
| `Unresolved` | source 无法映射 member/source marker | 否 | 是,仅显式 pending 且 formal source marker 存在 | pending/rejected priority Step 12 |
| `Untrusted` | source 已知但不可信 | 否 | 是,仅显式 pending | pending/rejected priority Step 12 |
| `Unavailable` | work dependency unavailable | 否 | 否,除非 Step 12 定义 replayable rejected/pending surface | dependency/rejected surface |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `Trusted` | `CareerRecordStateKind::Appended` | `CareerAppendPolicy.assert_source_trusted()` + `CareerRecord::append_from_work_source(...)` | `AppendCareerRecordFlow`;`HandleWorkParticipationAcceptedFlow` | member exists;source marker matches request/payload;safe summary present;duplicate source absent;body-free material | creates new career record | accepted trace/audit/outbox/stale/result/receipt | invalid transition / rejected |
| `Trusted` | `CareerRecordStateKind::CorrectionAppended` | `CareerRecord::correction_for_record(...)` | `AppendCareerRecordFlow` | original record exists and belongs to member;source trusted;duplicate guard passed | creates correction record;old record may be marked superseded | save correction and original state in one UoW | invalid transition / conflict |
| `PendingReview` / `Unresolved` / `Untrusted` | `CareerRecordStateKind::SourcePendingReview` | `CareerRecord::pending_review(...)` | `AppendCareerRecordFlow` | request `change_intent == MarkSourcePendingReview`;formal source marker exists;member exists;body-free material | creates pending review record | accepted trace/audit/stale/effect;no career appended outbox material | invalid transition / rejected |
| `PendingReview` / `Unresolved` / `Untrusted` / `Unavailable` | no career truth | precheck branch | `AppendCareerRecordFlow` | request is `AppendNew` or `AppendCorrection` | none | rejected/no-op/dependency surface;stored rejected rules Step 12/13 | `ApplicationError::InvalidStateTransition` placeholder |

Forbidden work source branches:

| Source state | Forbidden operation | Reason |
|---|---|---|
| `Trusted` | `SourcePendingReview` | trusted source should append/correct or reject duplicate,not create pending review |
| `PendingReview` / `Unresolved` / `Untrusted` | `Appended` / `CorrectionAppended` | Step 9 forbids silent accepted mainline |
| `Unavailable` | any career truth write | dependency unavailable is not a formal pending review marker in current Step 9 |
| any | duplicate source creates second record | duplicate is no-new-history surface |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `WorkParticipationSourceState::{Trusted,PendingReview,Unresolved,Untrusted,Unavailable}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | Source summary branch 不新增 persistent source truth |
| 触发函数是否存在 | 通过 | source resolver/event mapper + `CareerAppendPolicy` + `CareerRecord` factories |
| 前置条件字段是否闭合 | 通过 | source marker/safe summary/member/duplicate/material 均来自 Step 7~9 |
| 非法转换错误是否有 Step 12 承接 | 通过 | pending/rejected/dependency/no-op priority 后移 |
| 副作用是否闭合 | 通过 | only accepted career record write produces accepted side effects |
| 测试切口是否可写 | 通过 | trusted append;pending explicit record;pending append rejected;unavailable no write;duplicate no second record |

#### 7.9.4 `CareerRecordStateKind`

```text
[CareerRecord]
  factory -> Appended -> SupersededByCorrection
  factory -> CorrectionAppended
  factory -> SourcePendingReview
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Appended` | 正常 career append history | 否 | 只允许 accepted correction 将其解释性标记为 superseded |
| `CorrectionAppended` | 新增 correction record | 是 | 无;不得覆盖 original |
| `SupersededByCorrection` | 旧 record 被 correction 解释性替代 | 是 | 无;记录仍保留 |
| `SourcePendingReview` | source 需复核的 pending record | 准终态 | 不自动转 mainline;后续正式 append/correction 必须新建或走正式 replacement flow |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Appended` | `CareerRecord::append_from_work_source(...)` | `AppendCareerRecordFlow`;`HandleWorkParticipationAcceptedFlow` | member exists;source summary `Trusted`;safe summary present;duplicate source absent;change intent append/consumer accepted | new append-only record | append record;trace/audit;`CareerRecordAppended` outbox;stale/effect/stored result or receipt | invalid transition / rejected |
| factory | `CorrectionAppended` | `CareerRecord::correction_for_record(...)` | `AppendCareerRecordFlow` | original exists and belongs to member;source trusted;correction intent;body-free material | new correction record with `correction_of_ref` | append correction;mark original superseded in same UoW;`CareerCorrectionAppended` outbox | invalid transition / conflict |
| `Appended` | `SupersededByCorrection` | `mark_superseded_by_correction(...)` | `AppendCareerRecordFlow` correction branch | correction record accepted in same transaction;original loaded with version | original record `superseded_by_ref = correction_ref` | save original state with loaded version;rollback if conflict | optimistic conflict / invalid transition |
| factory | `SourcePendingReview` | `CareerRecord::pending_review(...)` | `AppendCareerRecordFlow` | request intent `MarkSourcePendingReview`;source summary requires review;formal source marker present;member exists | new pending review record | accepted trace/audit/stale/effect;no `CareerRecordAppended` / `CareerCorrectionAppended` outbox | invalid transition / rejected |

Forbidden career transitions:

| From | Forbidden To / operation | Reason |
|---|---|---|
| any existing record | in-place update/delete/reorder | `CareerRecord` is append-only;forbidden intents rejected by policy |
| `CorrectionAppended` | `SupersededByCorrection` in current batch | correction-of-correction is not a Step 9 accepted path;must be explicit future flow |
| `SourcePendingReview` | `Appended` / `CorrectionAppended` | pending record does not silently become accepted mainline;new formal append/correction required |
| duplicate source | any new career state | source duplicate returns no-new-history surface |
| query / projection / report | any career state transition | read/report paths do not write career truth |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `CareerRecordStateKind::{Appended,CorrectionAppended,SupersededByCorrection,SourcePendingReview}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | Duplicate / rejected / no-op 不写入 record state |
| 触发函数是否存在 | 通过 | append/correction/pending/supersede domain functions 已定义 |
| 前置条件字段是否闭合 | 通过 | member/source/duplicate/original/material/id/clock/version 均来自 Step 7~9 |
| 非法转换错误是否有 Step 12 承接 | 通过 | no-op vs conflict vs rejected priority 留 Step 12/13 |
| 副作用是否闭合 | 通过 | append/correction accepted side effects 已在 Step 9;pending 不创建 career appended outbound material |
| 测试切口是否可写 | 通过 | normal append;consumer append;duplicate no append;correction supersedes original;pending explicit;pending mainline rejected |

#### 7.9.5 `MemoryReferenceSourceState`

本小节是 memory/archive resolver、event mapper 和 handoff callback 的 source branch matrix,不是外部 carrier truth。它决定是否能构造 `MemoryReferenceState`,但不保存 memory body、archive package、receipt body 或 external carrier state。

```text
[MemoryReferenceSourceSummary]
  Trusted -> Linked
  Stale -> Stale
  Unavailable -> Unavailable
  PendingVerification / Untrusted -> PendingVerification only with explicit intent or target marker
  HandoffResultAccepted -> Archived / Migrated / HandoffPending
  HandoffResultFailed -> HandoffFailed
```

| Source state | 作用 | 允许 relation state | 必须具备 marker |
|---|---|---|---|
| `Trusted` | memory source 可用于 link | `Linked` | `memory_ref`;safe summary when exposed |
| `Stale` | source stale,需刷新/对账 | `Stale` | existing relation;source marker |
| `Unavailable` | carrier unavailable / unresolved | `Unavailable` | existing relation;reason/source marker |
| `PendingVerification` | 需要正式确认 | `PendingVerification` | at least one memory/archive/handoff marker |
| `HandoffResultAccepted` | archive/migration handoff result accepted as marker | `Archived` / `Migrated` / `HandoffPending` | archive/handoff marker;memory ref when migrated to memory |
| `HandoffResultFailed` | archive/migration handoff failed | `HandoffFailed` | handoff marker and reason/issue marker |
| `Untrusted` | source 不可信或不被允许 | `PendingVerification` only with explicit intent;otherwise none | formal marker required |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `Trusted` | `MemoryReferenceStateKind::Linked` | `MemoryReferenceState::linked(...)` | `MaintainMemoryReferenceFlow` | `LinkMemory`;member exists;memory ref present;source trusted;body-free material | relation linked to memory ref | save relation;trace/audit;`MemoryReferenceChanged` outbox;stale/effect/stored result | invalid transition / rejected |
| `Stale` | `MemoryReferenceStateKind::Stale` | `mark_stale(...)` or state builder | `MaintainMemoryReferenceFlow`;`HandleMemoryReferenceSourceStateChangedFlow` | existing relation loaded;source marker same formal family | relation state stale | versioned save;trace/outbox/stale/receipt | invalid transition |
| `Unavailable` | `MemoryReferenceStateKind::Unavailable` | `mark_unavailable(...)` or state builder | `MaintainMemoryReferenceFlow`;`HandleMemoryReferenceSourceStateChangedFlow` | existing relation loaded;reason marker present | relation state unavailable | versioned save;degraded read handled later | invalid transition |
| `PendingVerification` / `Untrusted` | `MemoryReferenceStateKind::PendingVerification` | `MemoryReferenceState::pending_verification(...)` | `MaintainMemoryReferenceFlow`;source event only with formal target | explicit `MarkPendingVerification` or payload target `PendingVerification`;at least one formal marker | relation pending verification | save relation;no fake linked success | invalid transition / rejected |
| `HandoffResultAccepted` | `Archived` / `Migrated` / `HandoffPending` | `archived(...)`;`mark_migrated(...)`;archive handoff state builder | `MaintainMemoryReferenceFlow`;`HandleArchiveHandoffResultFlow`;`HandleMemoryReferenceSourceStateChangedFlow` | archive/handoff marker present;target state kind matches refs;no receipt/package body | relation points to archive/migration/pending marker | `MemoryArchiveHandoffStateChanged` may be emitted | invalid transition / quarantined |
| `HandoffResultFailed` | `HandoffFailed` | `handoff_failed(...)` | `HandleArchiveHandoffResultFlow`;source changed callback | handoff marker present;reason/issue marker body-free | relation records failed handoff | archive handoff state outbox;no deletion | invalid transition / quarantined |

Forbidden memory source branches:

| Source state | Forbidden operation | Reason |
|---|---|---|
| `PendingVerification` / `Untrusted` / `Unavailable` | `Linked` | ordinary link requires trusted source |
| `Stale` / `Unavailable` | create missing relation from consumer event | Step 9 says missing relation is quarantined;no auto-create |
| `HandoffResultAccepted` | mark delivery `Delivered` | delivery belongs handoff state in later batch;memory relation only stores body-free relation state |
| `HandoffResultFailed` | delete relation | failed handoff does not remove identity relation |
| any | save external body/package/receipt | forbidden by Step 6/8 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `MemoryReferenceSourceState::{Trusted,Stale,Unavailable,PendingVerification,HandoffResultAccepted,HandoffResultFailed,Untrusted}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | source branch 不新增 external carrier state |
| 触发函数是否存在 | 通过 | memory resolver/callback mapper + `MemoryReferencePolicy` + state builders |
| 前置条件字段是否闭合 | 通过 | memory/archive/handoff refs、safe summary、reason/material/member/version 均来自 Step 7~9 |
| 非法转换错误是否有 Step 12 承接 | 通过 | rejected/quarantined/degraded priority 后移 |
| 副作用是否闭合 | 通过 | accepted relation state update 后写 trace/audit/outbox/stale/result/receipt |
| 测试切口是否可写 | 通过 | trusted link;stale existing relation;unavailable existing relation;pending explicit;handoff accepted archived;handoff failed |

#### 7.9.6 `MemoryReferenceStateKind`

```text
[MemoryReference]
  factory -> Linked -> Stale -> Linked
                    -> Unavailable -> Linked
                    -> PendingVerification
                    -> Migrated
                    -> Archived
                    -> HandoffPending -> Archived
                                      -> Migrated
                                      -> HandoffFailed
           PendingVerification -> Linked
                               -> Archived
                               -> HandoffFailed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Linked` | relation 指向可用 memory ref | 否 | refresh stale/unavailable;attach archive;handoff pending/archived/migrated |
| `PendingVerification` | relation 有 formal marker 但需确认 | 否 | later trusted source or handoff result may move to linked/archived/failed |
| `Stale` | external reference may be stale | 否 | refresh to linked/unavailable/pending/archive states |
| `Unavailable` | carrier unavailable/unresolved | 否 | refresh to linked/pending/archive states |
| `Migrated` | relation migrated to new memory/archive marker | 准终态 | later formal refresh may mark stale/unavailable;no body copy |
| `Archived` | relation points to archive/cold-storage marker | 准终态 | later formal refresh may mark stale/unavailable or migrated |
| `HandoffPending` | archive/migration handoff marker is pending | 否 | callback/result may archive/migrate/fail |
| `HandoffFailed` | archive/migration handoff failed | 准终态 | explicit retry/new handoff must use formal future flow;current batch does not auto-retry |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory / existing | `Linked` | `MemoryReference::link_for_member(...)`;`update_reference_state(MemoryReferenceState::linked(...))` | `MaintainMemoryReferenceFlow` | `LinkMemory`;trusted source;memory ref present;member exists;relation belongs to member if existing | relation state linked;memory ref set | save relation;`MemoryReferenceChanged`;stale/effect/stored result | invalid transition / rejected |
| existing | `Stale` | `MemoryReferenceState::mark_stale(...)` or state update | `RefreshState`;`HandleMemoryReferenceSourceStateChangedFlow` | existing relation loaded;source summary stale;reason marker present | state stale;refs preserved | versioned save;trace/outbox/receipt | invalid transition |
| existing | `Unavailable` | `MemoryReferenceState::mark_unavailable(...)` or state update | `RefreshState`;`HandleMemoryReferenceSourceStateChangedFlow` | existing relation loaded;source unavailable;reason marker present | state unavailable;refs preserved | versioned save;query degraded handled later | invalid transition |
| factory / existing | `PendingVerification` | `MemoryReferenceState::pending_verification(...)` | `MaintainMemoryReferenceFlow`;formal source event target | explicit `MarkPendingVerification` or payload target;at least one memory/archive/handoff marker;source requires verification | pending state with formal marker | save relation;`MemoryReferenceChanged`;no fake linked success | invalid transition / rejected |
| factory / existing | `Archived` | `MemoryReference::from_archive_handoff(...)`;`attach_archive_ref(...)`;`MemoryReferenceState::archived(...)` | `AttachArchive`;`RecordArchiveHandoffResult`;`HandleArchiveHandoffResultFlow` | archive ref and handoff ref present;material body-free;target state archived | archive/handoff refs set;state archived | memory changed + archive handoff state material | invalid transition / quarantined |
| existing | `HandoffPending` | state update from handoff marker | `MaintainMemoryReferenceFlow` attach/archive branch | handoff marker present;target state pending;no receipt/body | handoff marker set;pending state | may emit archive handoff state material | invalid transition |
| existing | `Migrated` | `MemoryReferenceState::mark_migrated(...)` | `HandleArchiveHandoffResultFlow`;source state changed target | handoff marker present;memory or archive target marker present;body-free result | migrated refs set | memory changed + archive handoff state material | invalid transition / quarantined |
| existing | `HandoffFailed` | `MemoryReferenceState::handoff_failed(...)` | `HandleArchiveHandoffResultFlow`;source state changed target | handoff marker present;reason or issue marker present;relation target found | state failed;relation retained | archive handoff state material;no deletion | invalid transition / quarantined |

Forbidden memory relation transitions:

| From | Forbidden To / operation | Reason |
|---|---|---|
| missing relation in source event/callback | any state create except command explicit create paths | Step 9 says consumer missing relation is quarantined;callback target missing is quarantined |
| `PendingVerification` | `Linked` without trusted source | pending does not auto-resolve |
| `HandoffPending` | `Archived` / `Migrated` without callback/result marker | request sent or job log success is not formal result |
| `HandoffFailed` | `HandoffPending` retry in current batch | retry policy/handoff lifecycle belongs 10.5/Step 14 |
| any | external owner write/delete | identity relation never writes memory/archive owner truth |
| query / projection / report | any relation transition | read/report no-write |

Required marker table:

| Target state | Required markers |
|---|---|
| `Linked` | `memory_ref`;trusted source;safe summary when later exposed |
| `PendingVerification` | at least one of `memory_ref`, `archive_ref`, `archive_handoff_ref`;reason marker |
| `Stale` | existing relation;reason/source marker |
| `Unavailable` | existing relation;reason/source marker |
| `Migrated` | `archive_handoff_ref` and at least one new `memory_ref` or `archive_ref` |
| `Archived` | `archive_ref` and `archive_handoff_ref` |
| `HandoffPending` | `archive_handoff_ref`;optional archive marker if known |
| `HandoffFailed` | `archive_handoff_ref` and reason/issue marker |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `MemoryReferenceStateKind::{Linked,PendingVerification,Stale,Unavailable,Migrated,Archived,HandoffPending,HandoffFailed}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不混用 `HandoffState::Delivered`;不新增 external carrier state |
| 触发函数是否存在 | 通过 | link/archive/update/state marker methods 和 Step 9 memory/callback flows |
| 前置条件字段是否闭合 | 通过 | required marker table 均来自 Step 8 DTO/payload 或 Step 7 resolver/repository lookup |
| 非法转换错误是否有 Step 12 承接 | 通过 | rejected/quarantined/degraded/retry priority 后移 |
| 副作用是否闭合 | 通过 | accepted relation state save 后写 trace/audit/outbox/stale/effect/stored result or callback receipt |
| 测试切口是否可写 | 通过 | trusted link;pending verification explicit;source event missing relation quarantined;archive callback target lookup;handoff failed keeps relation |

#### 7.9.7 10.2 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.2 范围 | 通过 | 只覆盖 role/career/memory truth and source states |
| 是否回指 Step 6/8/9 | 通过 | 六个状态主语均来自 Step 6 enum/source summary,触发 flow 来自 Step 9 command/consumer/callback |
| role active accepted 是否闭合 | 通过 | 只有 `SourceResolved` + source version + safe summary + evidence 才能写 `Active` |
| role source stale/unavailable 是否闭合 | 通过 | source snapshot 可保存 stale/unavailable;current summary 只能显式 stale/unavailable,不得保持 active |
| career duplicate/no-op 是否闭合 | 通过 | duplicate source 不新增 `CareerRecord`;duplicate/no-op 不进入 record state |
| career pending review 是否闭合 | 通过 | 仅显式 `MarkSourcePendingReview` + formal pending/unresolved/untrusted marker 可写 `SourcePendingReview` |
| memory pending verification 是否闭合 | 通过 | 仅显式 pending intent或 formal payload target + required marker 可写 `PendingVerification` |
| archive handoff marker 是否闭合 | 通过 | memory relation state 只接收 body-free archive/handoff marker;不写 delivery state或 receipt body |
| query/job 是否越界 | 未越界 | 本批没有让 query/projection/report/job 推进 core truth |
| public error / stored replay 是否越过 | 未越过 | rejected/quarantined/no-op/dependency priority 和 duplicate replay 细节留 Step 12/13 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.10 10.3 read / visibility / trace surface states

本批只覆盖 query read surface、visibility decision、member summary view freshness/read state、trace/audit read priority。它承接 Step 9 `9.2-a` core truth queries 和 `9.2-b` summary / trace / audit queries。本批不写 projection/reference/report operations query、outbox/handoff query、idempotency、runtime/entry 或 HTTP status mapping。

本批固定四条边界:

- Query path no-write:不得 begin write UoW,不得 reserve idempotency,不得保存 stored result,不得 append trace/audit/outbox,不得 rebuild projection 或 refresh source。
- `NotVisible` 不得伪装成 `Missing` 或 `Empty`;visible empty 才能用 `Empty`。
- `StaleVisible` 只表达 stale safe material 可见;`ReadMemberSummaryFlow` 只能复制 loaded `MemberSummaryView.projection_freshness_ref`;query 不 mark fresh、不 rebuild、不刷新 source、不读取 projection state 补 marker。
- `IdentityReadDispositionKind` 是 visibility decision 五态;`IdentityReadSurfaceKind` / `IdentityQueryDisposition` 是 read/public surface,不得混为同一个持久状态机。

#### 7.10.1 `IdentityReadDispositionKind`

`IdentityReadDispositionKind` 是 `IdentityVisibilityDecision` 的 application helper decision,不是业务 truth。它由 Step 7 `IdentityReadVisibilityRepository` 返回的 `IdentityVisibilityAccessSummary` 和 Step 6 `VisibilityPolicy` 分类得到。

```text
[IdentityVisibilityDecision]
  access Visible -> Visible
  access Redacted -> Redacted
  access NotVisible -> NotVisible
  access Degraded / Unavailable -> Degraded
  access Visible/Redacted + stale safe material -> StaleVisible
```

| Disposition | 输入 access / material | body/items 是否允许 | 必须 marker | 后续 surface |
|---|---|---|---|---|
| `Visible` | `IdentityVisibilityAccessState::Visible`;material safe;not stale | 允许 body-free body/items | `visibility_result_ref` | `IdentityQueryDisposition::Visible` / `IdentityReadSurfaceKind::Found` |
| `Redacted` | `IdentityVisibilityAccessState::Redacted`;redaction marker present | 允许裁剪后的 body/items | redaction marker + `visibility_result_ref` | `Redacted` |
| `NotVisible` | `IdentityVisibilityAccessState::NotVisible` | 不允许 body/items | `visibility_result_ref`;可有 safe denial marker | `NotVisible` |
| `Degraded` | access summary missing,`Degraded` or `Unavailable`;material unsafe / dependency partial | 可空或 safe partial,由 Step 12 细化 | resolver degraded marker or `IdentityQueryMaterialDegradationSummary.degraded_marker_ref` | `Degraded` |
| `StaleVisible` | visible/redacted access + loaded view/truth stale marker | 允许 stale body-free body/items | freshness/degraded marker;summary query uses loaded `MemberSummaryView.projection_freshness_ref`;if absent use `member_summary_view_missing_freshness(...)` and return `Degraded` | `StaleVisible` |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| visibility access | `Visible` | `IdentityVisibilityDecision::visible(...)` / `VisibilityPolicy::classify_read_surface(found=true, stale=false)` | all query flows | access summary exists;access state visible;material marker safe | decision value only | query response surface;no save unless later diagnostics path authorizes | none |
| visibility access | `Redacted` | `redacted(...)`;`VisibilityPolicy::requires_redaction()` | all query flows | access state redacted;redaction marker present;material body-free after redaction | decision value only | response omits redacted fields;no truth mutation | missing marker -> degraded/rejected surface Step 12 |
| visibility access | `NotVisible` | `not_visible(...)` | all query flows | access state not visible | decision value only | single body `None`;list items empty;does not reveal found/missing | none |
| missing/degraded access or material | `Degraded` | `degraded(...)` | all query flows | access summary missing or access state degraded/unavailable;or material guard fails with `IdentityQueryMaterialDegradationSummary` | decision value only | response degraded with safe marker;no fallback to visible;no service-side marker synthesis | none |
| visible access + stale with freshness marker | `StaleVisible` | `stale_visible(...)`;`classify_read_surface(found=true, stale=true)` | `ReadMemberSummaryFlow`;core truth queries with stale projection/source state | loaded view/truth stale marker;summary uses loaded `MemberSummaryView.projection_freshness_ref`;material safe | decision value only | return stale safe material;no rebuild/refresh | none |
| visible access + stale without freshness marker | `Degraded` | `degraded(...)` with `IdentityQueryMaterialDegradationSummary` | `ReadMemberSummaryFlow` | loaded member summary view is stale/degraded but `projection_freshness_ref` absent | decision value only | return degraded surface from `member_summary_view_missing_freshness(...)`;no projection state read | none |

Forbidden visibility decision transitions:

| Input | Forbidden output | Reason |
|---|---|---|
| access `NotVisible` | `Missing` / `Empty` public surface | would hide permission semantics and leak through count/existence |
| access missing / unavailable | `Visible` | Step 9 requires degraded,not default visible |
| material marker forbidden body | `Visible` / `Redacted` | forbidden body must be degraded/rejected;never returned |
| stale loaded view | `Visible` without stale/degraded marker | stale must be explicit |
| query | save visibility decision by default | Step 9 says query does not save decision unless later Step 12/13 defines diagnostics path |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityReadDispositionKind::{Visible,Redacted,NotVisible,Degraded,StaleVisible}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Empty` / `Missing` 不写入 visibility decision enum |
| 触发函数是否存在 | 通过 | `IdentityVisibilityDecision` factories 与 `VisibilityPolicy` classifier 已定义 |
| 前置条件字段是否闭合 | 通过 | access summary、scope、subject、visibility result、redaction marker 来自 Step 7/9;query-internal material degraded marker 来自 Step 7 `IdentityQueryMaterialDegradationMapper` |
| 非法转换错误是否有 Step 12 承接 | 通过 | marker missing / forbidden material 的 public mapping 留 Step 12 |
| 副作用是否闭合 | 通过 | 本批 decision 是 response assembly helper;query 默认 no-write |
| 测试切口是否可写 | 通过 | visible/redacted/not visible/degraded/stale visible;not visible 不读 count;degraded not default visible |

#### 7.10.2 read surface / query disposition priority

`IdentityReadSurfaceKind` 是 Step 6 read model surface;`IdentityQueryDisposition` 是 Step 8 public query envelope surface。本节固定两者在 Step 10 中的优先级,但不定义 HTTP status。

```text
[QuerySurfacePriority]
  entry validation failure -> ApplicationError / entry failure
  visibility missing/unavailable -> Degraded
  visibility NotVisible -> NotVisible
  exact requested object missing -> Missing
  visible list empty -> Empty
  loaded item missing/mismatch -> Degraded partial
  visible stale material -> StaleVisible
  visible material -> Visible / Redacted
```

| Priority | Single-object query | List/page query | 说明 |
|---|---|---|---|
| entry validation failure | entry/application error | same | missing required request/page fields are not query surface states |
| visibility resolver `None` / unavailable | `Degraded`,body `None` | `Degraded`,items empty | no default visible |
| access `NotVisible` | `NotVisible`,body `None` | `NotVisible`,items empty | not `Missing`,not `Empty` |
| exact member/truth/view missing | `Missing`,body `None` | exact branch `Missing`;pre-page member missing `Missing` | no create/rebuild |
| visible repository page empty | not applicable | `Empty`,items empty | real empty only |
| loaded item missing / member/subject mismatch | `Degraded` invalid material | `Degraded` partial | no index repair/delete |
| stale/degraded loaded material | `StaleVisible` or `Degraded` | `StaleVisible` or `Degraded` partial | no refresh/rebuild |
| visible material with redaction | `Redacted` | `Redacted` / redacted partial | field matrix Step 12/16 |
| visible safe material | `Visible` | `Visible` | body-free only |

Forbidden public surface mappings:

| Situation | Forbidden surface | Correct surface |
|---|---|---|
| not visible member / summary / trace / audit | `Missing` / `Empty` | `NotVisible` |
| access summary missing | `Visible` | `Degraded` |
| exact summary view lookup missing | ad hoc view ref + rebuild | `Missing` |
| visible career/memory list has no rows | `NotVisible` | `Empty` |
| trace page loaded items all denied | `Empty` | `NotVisible` |
| item ref from list missing | skip silently | `Degraded` partial |
| forbidden raw log / external body | `Visible` / raw diagnostic | `Degraded` or Step 12 rejected surface |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityReadSurfaceKind` 和 `IdentityQueryDisposition` 均已在 Step 6/8 定义 |
| 状态名是否一致 | 通过 | `NotFound` 在 read model 对应 public `Missing`;不新增同义 public state |
| 触发函数是否存在 | 通过 | query assembler / `VisibilityPolicy::classify_read_surface(...)` |
| 前置条件字段是否闭合 | 通过 | found/empty/stale/degraded inputs 来自 loaded repository result,not service guess |
| 非法转换错误是否有 Step 12 承接 | 通过 | public error/status mapping 后移 |
| 副作用是否闭合 | 通过 | all outcomes are response surfaces only;query no-write |
| 测试切口是否可写 | 通过 | not visible vs empty/missing;all denied trace;item missing degraded;stale visible no rebuild |

#### 7.10.3 `MemberSummaryView` read/freshness surface

`MemberSummaryView` 是 projection/read model,不是 source of truth。其 `read_surface_kind`、`source_cursor_ref` 和 `projection_freshness_ref` 只表达本次可返回的 safe material 与 public freshness marker,不得触发 query-side rebuild 或 projection state read。

```text
[MemberSummaryViewRead]
  lookup missing -> Missing
  loaded view visible + fresh -> Found / Visible
  loaded view visible + stale -> Stale / StaleVisible
  loaded view redacted -> Redacted
  loaded view not visible -> NotVisible
  loaded view invalid/degraded -> Degraded
  visible no optional slices -> Found with empty slice vectors
```

| Surface | 输入条件 | body 是否返回 | 必须 marker | 禁止事项 |
|---|---|---|---|---|
| `Found` / public `Visible` | stable view lookup succeeds;loaded view belongs to member;material safe;not stale | 是 | visibility result | 不读取 source/rebuild |
| `Redacted` | access redacted or field redaction required | 是,但 fields/slices are safe subset | redaction marker | 不保存 redacted copy |
| `NotVisible` | initial or view-specific access not visible | 否 | visibility result | 不泄露 view existence |
| `Stale` / public `StaleVisible` | loaded view `is_stale_or_degraded()` due stale marker but safe to show | 是,带 stale marker | loaded `projection_freshness_ref`;if missing return `Degraded` through mapper | 不 mark fresh;不读取 projection state 补 marker |
| `Degraded` | visibility access missing/degraded;view mismatch;forbidden material;loaded view inconsistent | 可空或 safe partial | resolver degraded marker or `IdentityQueryMaterialDegradationSummary.degraded_marker_ref` | 不修复 projection;不在 query service 合成 marker |
| `NotFound` / public `Missing` | stable lookup missing or loaded view missing as exact summary read | 否 | visibility if available | 不拼 view ref |
| `Empty` | no relevant optional slices after visible read | 是,with empty vectors or public empty for list query only | visibility result | 不用于 hiding not visible |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| projection lookup | `Missing` / `NotFound` | `find_member_summary_view_ref(member_ref, scope_ref)` returns `None` | `ReadMemberSummaryFlow`;core truth optional slice reads | access visible/degraded decided;scope from access summary | none | response `Missing`;no rebuild | none |
| loaded view | `Found` / `Visible` | `MemberSummaryView::from_projection(...)`;`VisibilityPolicy::classify_read_surface(true,false)` | `ReadMemberSummaryFlow`;core truth query assemblers | view belongs to member;body-free marker safe;access visible | none | response body with safe slices | none |
| loaded view | `Redacted` | `VisibilityPolicy::requires_redaction()` | all member summary reads | access redacted;redaction marker present | none | response safe subset | none |
| loaded view | `StaleVisible` | `view.is_stale_or_degraded()` + policy visible | `ReadMemberSummaryFlow`;core truth optional projection reads | loaded `projection_freshness_ref` present | none | response stale safe material;query does not read projection state | none |
| loaded view stale marker missing | `Degraded` | `view.is_stale_or_degraded()` + missing `projection_freshness_ref` | `ReadMemberSummaryFlow` | valid access summary exists;loaded view belongs to member and scope but cannot provide public freshness marker | none | response degraded through `member_summary_view_missing_freshness(...)`;query does not read projection state | none |
| access / loaded view | `NotVisible` | `resolve_member_summary_read(...)` access not visible | all member summary reads | initial or view-specific access not visible | none | response body None | none |
| loaded view invalid | `Degraded` | `belongs_to(...)` false,`assert_body_free()` fail,view missing after lookup,or access degraded | all member summary reads | invalid material or partial dependency;material branch has `IdentityQueryMaterialDegradationSummary` | none | degraded response;no repair;no marker synthesis | none |

Forbidden member summary read transitions:

| Situation | Forbidden operation | Reason |
|---|---|---|
| lookup missing | construct `MemberSummaryViewRef` from member/scope | Step 6/7 forbids ad hoc view ref |
| stale view | mark projection fresh / rebuild | query no-write |
| forbidden read material | return raw body/log/debug | body-free invariant |
| not visible | read truth to decide found/missing diagnostic body | not visible must not leak existence/count |
| optional slice empty | mark member summary missing | empty optional slice vectors are valid visible body |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityReadSurfaceKind` covers Found/NotFound/NotVisible/Redacted/Stale/Degraded/Empty |
| 状态名是否一致 | 通过 | member summary freshness does not add `Fresh` enum;fresh is Found/Visible with non-stale marker |
| 触发函数是否存在 | 通过 | `MemberSummaryView` factories/helpers and Step 7 projection lookup/read |
| 前置条件字段是否闭合 | 通过 | view ref from lookup;scope from access summary;freshness from loaded view marker |
| 非法转换错误是否有 Step 12 承接 | 通过 | forbidden material / redaction marker missing mapping 后移 |
| 副作用是否闭合 | 通过 | query response only;no projection write |
| 测试切口是否可写 | 通过 | lookup missing;view missing;view mismatch;stale visible;not visible before lookup;optional slices empty |

#### 7.10.4 core truth query surface matrix

本节把 9.2-a 五条 core truth query 的 shared priority 固化为 Step 10 state matrix。它不重复 10.1/10.2 truth state transitions,只定义 read surface。

| Query family | Visible success | Missing | Empty | StaleVisible | Degraded | NotVisible |
|---|---|---|---|---|---|---|
| `GetGlobalMemberAnchor` | loaded member/anchor safe refs | member missing | not applicable | optional view stale | view mismatch/material invalid/access degraded | access not visible |
| `GetGlobalLifecycleSummary` | loaded lifecycle safe refs | member or lifecycle missing | not applicable | optional view stale | lifecycle dependency/view mismatch/access degraded | access not visible |
| `GetRoleCapabilitySummary` | loaded summary + optional snapshot safe refs | explicit/current summary missing;member missing | not applicable | summary/source stale if safe | snapshot missing/unavailable/member mismatch/access degraded | access not visible |
| `ListCareerRecords` | non-empty page of safe record views | member missing | visible repository page empty | stale state displayed as explicit state if safe | listed item missing/member mismatch | access not visible |
| `ListMemoryReferences` | non-empty page of safe relation views | member missing | visible repository page empty | stale relation displayed as explicit state if safe | listed item missing/member mismatch | access not visible |

| Priority | Core truth single query | Core truth list query |
|---|---|---|
| visibility missing/unavailable | `Degraded`,body `None` | `Degraded`,items empty |
| visibility `NotVisible` | `NotVisible`,body `None` | `NotVisible`,items empty |
| member missing | `Missing`,body `None` | `Missing`,items empty |
| target truth missing | `Missing`,body `None` | item missing -> `Degraded` partial |
| visible page empty | n/a | `Empty`,items empty |
| optional projection lookup/view missing | visible body may omit slice refs and carry missing/degraded marker | optional only |
| item mismatch / invalid material | `Degraded` | `Degraded` partial |

Forbidden core query behavior:

| Situation | Forbidden behavior | Correct behavior |
|---|---|---|
| role summary missing | create summary / call resolver | `Missing` |
| lifecycle missing | derive initial lifecycle from member | `Missing` / degraded |
| career/memory list empty | return `NotVisible` | `Empty` |
| list item missing | delete index / skip silently | `Degraded` partial |
| stale role/memory state | refresh source | explicit stale/unavailable state + surface |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否只读 | 通过 | no UoW/idempotency/stored result/trace/outbox/projection write |
| read subject/scope 是否正式 | 通过 | member-scoped query uses `resolve_member_summary_read(...)` |
| view lookup 是否正式 | 通过 | optional view ref only from `find_member_summary_view_ref(...)` |
| missing/empty/not visible 是否区分 | 通过 | not visible never masked as missing/empty |
| partial item missing priority 是否闭合 | 通过 | core list item missing/mismatch is degraded partial |
| 测试切口是否可写 | 通过 | five query families share deterministic priority table |

#### 7.10.5 trace read surface matrix

`ReadIdentityTraceFlow` 是 append-only trace read,不是 trace repair flow。Trace read may filter by member,by subject after cursor,or by member and change kind. Per-item visibility applies after repository selection.

```text
[ReadIdentityTrace]
  selector seed not visible -> NotVisible
  repository page empty -> Empty
  loaded item visible -> Visible / Redacted
  loaded item denied -> withhold
  all loaded items denied -> NotVisible
  loaded item missing/mismatch/unsafe -> Degraded partial
```

| Selector | Repository read | Seed visibility | Per-item guard | Empty source |
|---|---|---|---|---|
| `ByMember` | `list_trace_records_by_member(member_ref,page)` | per item only | loaded record belongs to member | repository page empty |
| `BySubject` | `list_trace_records_after_cursor(subject_ref,after_cursor,page)` | request subject first | belongs to member and matches subject | repository page empty after visible seed |
| `ByMemberAndChangeKind` | `list_trace_records_by_change_kind(member_ref,change_kind,page)` | per item only | belongs to member;change kind from repo filter | repository page empty |

| Branch | Surface | Rule |
|---|---|---|
| page missing | entry validation failure | no default page |
| seed visibility missing/unavailable | `Degraded` | no list when seed cannot be evaluated |
| seed not visible | `NotVisible` | no list/count leak |
| repository page empty | `Empty` | only after visible/allowed seed |
| trace ref missing after list | `Degraded` partial | do not append/repair/delete |
| loaded member/subject mismatch | `Degraded` invalid material | no raw diagnostic |
| per-item visibility missing/degraded | `Degraded` partial | item skipped or safe marker per Step 12 |
| per-item not visible | withhold item | count denied not leaked |
| all loaded items denied | `NotVisible` | not `Empty` |
| mixed visible/redacted/denied | `Redacted` partial | field detail Step 12 |
| forbidden raw log/debug body | `Degraded` / forbidden material | no raw output |

Forbidden trace read behavior:

| Situation | Forbidden operation | Reason |
|---|---|---|
| missing trace item | append replacement trace | trace read is read-only |
| by subject selector | use audit subject or string split | subject must be typed trace subject |
| after cursor | use page cursor / timestamp | after cursor is `IdentityTruthCursor` only |
| all items denied | return `Empty` | would hide not visible as no data |
| raw log material present | return visible raw log | trace DTO is body-free |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| selector 是否映射 port | 通过 | 三个 selector 对应 Step 7 trace repository reads |
| read subject 是否正式 | 通过 | request typed subject or loaded trace subject |
| page/cursor 是否区分 | 通过 | public page cursor / truth after cursor 不互换 |
| all denied vs empty 是否闭合 | 通过 | all denied = NotVisible;repo page empty = Empty |
| partial degraded 是否闭合 | 通过 | missing/mismatch/visibility degraded -> degraded partial |
| 测试切口是否可写 | 通过 | by member/by subject/by change kind;all denied;missing item;raw log forbidden |

#### 7.10.6 audit read surface matrix

`ReadAuditTrailFlow` 当前只读取 member canonical audit subject。它不聚合 role/career/memory child truth audit trails,不创建 missing audit trail,不修复 missing trace。

```text
[ReadAuditTrail]
  mapper/access degraded -> Degraded
  access not visible -> NotVisible
  canonical trail missing -> Empty
  entry page empty -> Empty
  trail mismatch / entry invalid -> Degraded partial
  visible entries -> Visible / Redacted
```

| Branch | Surface | Rule |
|---|---|---|
| page missing | entry validation failure | no default page |
| subject mapper unavailable | `Degraded` | do not synthesize audit subject |
| audit visibility missing/unavailable | `Degraded` | no default visible |
| audit not visible | `NotVisible` | do not reveal trail existence |
| canonical audit trail missing | `Empty` | do not create audit trail |
| entry page empty | `Empty` | visible trail but no entries in scope/page |
| trail subject/member mismatch | `Degraded` invalid material | no raw diagnostic |
| entry material invalid / raw log | `Degraded` partial | no repair |
| policy redacts entries | `Redacted` | body-free redacted entry views only |

Forbidden audit read behavior:

| Situation | Forbidden operation | Reason |
|---|---|---|
| missing audit trail | create trail in query | audit create belongs accepted flow service,not query |
| member canonical audit only | scan child truth audit trails | no formal aggregation rule in current Step 8/9 |
| audit cursor present | treat as truth cursor/page cursor | audit cursor is separate read cursor |
| not visible audit | return empty | would hide permission as no data |
| entry invalid | repair trace/audit | query no-write |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| audit subject 是否正式 | 通过 | from `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` |
| missing trail priority 是否闭合 | 通过 | visible missing canonical trail = `Empty`,not create |
| visibility priority 是否闭合 | 通过 | not visible before trail lookup/count leak |
| cursor 是否区分 | 通过 | `AuditCursorRef` only for `list_audit_entries`;public page cursor separate |
| child truth audit 聚合是否越界 | 未越界 | current flow intentionally does not aggregate child trails |
| 测试切口是否可写 | 通过 | missing trail empty;not visible no leak;mismatch degraded;cursor separation |

#### 7.10.7 10.3 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.3 范围 | 通过 | 只覆盖 read/visibility/trace/audit surface states |
| 是否回指 Step 6/7/8/9 | 通过 | disposition/surface/view/policy 来自 Step 6;repository/visibility 来自 Step 7;DTO/flow 来自 Step 8/9 |
| visibility decision 与 public surface 是否分层 | 通过 | `IdentityReadDispositionKind` 不包含 Empty/Missing;public query surface 单独列优先级 |
| query no-write 是否保持 | 通过 | no UoW、no idempotency、no stored result、no trace/audit/outbox/projection/reference write |
| read subject/scope 是否正式 | 通过 | member summary uses access summary scope;trace/audit use typed subject/mapper |
| stable view ref 是否正式 | 通过 | only from `find_member_summary_view_ref(...)` |
| not visible / empty / missing 是否区分 | 通过 | not visible never masked;empty only valid visible empty |
| stale visible 是否闭合 | 通过 | stale loaded safe material returns `StaleVisible`;no rebuild/mark fresh |
| trace/audit partial priority 是否闭合 | 通过 | trace all-denied vs empty;audit missing trail empty;invalid material degraded partial |
| 是否越过 Step 12/16 | 未越过 | HTTP/status,field-level redaction and exact public error envelope 留后续 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.11 10.4 projection / reference / reconciliation states

本批只覆盖 projection freshness / rebuild、external reference resolution、reconciliation report-only state 和 maintenance issue/finding helper disposition。它承接 Step 9 `9.2-c` operations query flow 和 `9.5` operations job flow。本批不写 outbox/handoff propagation、idempotency/stored replay/job report、runtime/entry 状态。

本批固定五条边界:

- Query path no-write:`GetProjectionState`,`GetReferenceResolutionState`,`ReadReconciliationReport` 只读状态和 report,不得 rebuild、refresh、generate report、repair index 或保存 stored result。
- Maintenance job no-truth-repair:`RebuildIdentityProjection`,`RefreshExternalReferenceState`,`RunIdentityReconciliation` 只能更新 projection/reference/report marker 或 body-free view/report,不得更新 core identity truth 或 external truth。
- Projection source cursor 必须来自 Step 7 `get_projection_source_cursor(...)` 或正式 stale marker input;不得用 timestamp、page cursor、truth cursor、job id、version 或 idempotency key 代替。
- Reference state 和 typed sidecar 必须使用同一 `ExternalReferenceRef` bundle 的 loaded `IdentityVersion`;不得把 `ExternalSourceVersionRef`、business source ref 或 safe summary ref 当 expected_version。
- Reconciliation report 是 report-only material;finding / issue 只保存 refs,不保存 external body、raw diagnostic、secret 或 remediation plan。

#### 7.11.1 `ProjectionStateKind`

`ProjectionStateKind` 是 identity-owned projection / derived view 的 freshness and rebuild state。它不是 core truth lifecycle,也不是 public query surface;public `Rebuilding`/`StaleVisible` 等 surface 由 query assembler 从 state + visibility 派生。

```text
[ProjectionState]
  factory -> Fresh
  factory -> Stale
  factory -> RebuildFailed
  Fresh / Rebuilt -> Stale
  Fresh / Stale / Rebuilt -> Degraded
  Fresh / Stale / Degraded / RebuildFailed -> RebuildPending
  RebuildPending -> Rebuilt
  RebuildPending -> Degraded
  RebuildPending -> RebuildFailed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | projection 与已知 source cursor 对齐 | 否 | accepted stale marker;explicit rebuild job;degraded marker |
| `Stale` | projection 已落后或被 scan 判定需要 rebuild | 否 | rebuild pending;degraded/failed marker |
| `RebuildPending` | rebuild job 已正式接管该 projection | 否 | mark rebuilt / degraded / failed |
| `Rebuilt` | 最近一次 rebuild 成功并写入 source cursor | 否 | serve as fresh-equivalent;accepted stale marker;degraded marker |
| `Degraded` | projection 可降级读取或部分材料不可用 | 否 | rebuild pending;explicit failed marker only after pending branch |
| `RebuildFailed` | rebuild attempt 失败且有 safe issue marker | 否 | retry through rebuild pending;or degrade failure visibility |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Fresh` | `ProjectionState::fresh(...)` | initial projection build / formal projection catalog bootstrap | projection state id from generator;projection ref from lookup/catalog;source cursor formal;time from clock | state fresh;source cursor required;issue empty | save projection state with create version;no truth write | `IdentityDomainError::InvalidStateTransition` |
| factory | `Stale` | `ProjectionState::stale(...)` | accepted truth side effect / committed scan stale marker | projection ref formal;source cursor formal;maintenance scope formal | state stale;copy cursor/scope;issue empty | save/mark stale with expected version;no rebuild inline | `IdentityDomainError::InvalidStateTransition` |
| factory | `RebuildFailed` | `ProjectionState::failed(...)` | failed maintenance bootstrap / missing required support | safe issue ref present;maintenance scope formal | state failed;issue present | save failed state/report issue;no raw diagnostic | `IdentityDomainError::InvalidStateTransition` |
| `Fresh` / `Rebuilt` | `Stale` | `mark_stale(source_cursor_ref, maintenance_scope_ref, checked_at)` | accepted truth side effect / committed scan | loaded projection state with version;new stale cursor from formal source;query path false | state stale;replace stale cursor/scope;clear rebuild success meaning | save stale marker;append accepted side effects already owned by command flow | `IdentityDomainError::InvalidStateTransition` |
| `Fresh` / `Stale` / `Rebuilt` | `Degraded` | `mark_degraded(issue_ref, checked_at)` | committed scan / maintenance degraded marker | safe issue ref present;material may be served partially;query path false | state degraded;issue present | save degraded marker;no truth repair | `IdentityDomainError::InvalidStateTransition` |
| `Fresh` / `Stale` / `Degraded` / `RebuildFailed` | `RebuildPending` | `mark_rebuild_pending(maintenance_scope_ref, checked_at)` | `RebuildIdentityProjectionFlow` | job channel;target selected by explicit refs or maintenance expansion;policy report-only guard passed;state is eligible for rebuild | state pending;scope/time updated | save state before writer call;job report scans item | `IdentityDomainError::InvalidStateTransition` |
| `RebuildPending` | `Rebuilt` | `mark_rebuilt(source_cursor_ref, checked_at)` | `RebuildIdentityProjectionFlow` | formal writer succeeded;`get_projection_source_cursor(projection_ref)` returned cursor | state rebuilt;source cursor updated;issue cleared | save view/state;record rebuilt_projection_ref;stored job report | `IdentityDomainError::InvalidStateTransition` |
| `RebuildPending` | `Degraded` | `mark_degraded(issue_ref, checked_at)` | `RebuildIdentityProjectionFlow` partial/dependency degraded branch | safe issue ref present;material remains safe to serve partially | state degraded;issue present | save state;record failed/issue or partial result;no truth repair | `IdentityDomainError::InvalidStateTransition` |
| `RebuildPending` | `RebuildFailed` | `mark_rebuild_failed(issue_ref, checked_at)` | unsupported writer / missing source cursor / writer failure | safe issue ref from maintenance issue mapper;raw failure redacted | state failed;issue present | save state;record failed_projection_ref and issue_ref | `IdentityDomainError::InvalidStateTransition` |

`Rebuilt` does not automatically fold into `Fresh` in this baseline. `Rebuilt` is the formal success state of `RebuildIdentityProjectionFlow`;it is fresh-equivalent for reads only when visibility and material guards allow it. A future `Rebuilt -> Fresh` normalization needs a formal trigger/helper and is not used by current Step 9 flow.

Step 6 lists `Stale -> Rebuilt`, `Degraded -> Rebuilt`, and `Rebuilt -> Fresh` as possible future directions, but current Step 9 exposes only `RebuildPending -> Rebuilt` as the executable rebuild completion path. Implementation must not use these reserved direct transitions until a function flow explicitly authorizes a collapsed pending/rebuilt transaction or a normalize-to-fresh helper.

Forbidden projection transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| query sees missing state | create `ProjectionState` or schedule rebuild | return `Missing`;no write |
| query sees stale/degraded/failed state | call `mark_rebuild_pending`,writer,or `mark_rebuilt` | return stale/degraded/rebuilding surface |
| rebuild lacks formal writer | mark `Rebuilt` anyway | `RebuildPending -> RebuildFailed` with unsupported-writer issue |
| rebuild lacks source cursor | use timestamp/page cursor/version | `RebuildPending -> RebuildFailed` with missing-cursor issue |
| explicit rebuild target is current `Rebuilt` with no stale/degraded marker | force `RebuildPending` | treat as no-op/skipped item per Step 12/13 job disposition;do not invent transition |
| accepted truth changed while projection is pending | overwrite pending as stale | leave pending and record explicit failed/partial/conflict issue per Step 11 conflict policy |
| failed/degraded issue has raw body | save raw diagnostic | save only `MaintenanceIssueRef` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ProjectionStateKind::{Fresh,Stale,RebuildPending,Rebuilt,Degraded,RebuildFailed}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | public `Rebuilding` 是 query surface,不新增 state variant |
| 触发函数是否存在 | 通过 | `fresh/stale/failed/mark_stale/mark_rebuild_pending/mark_rebuilt/mark_degraded/mark_rebuild_failed` |
| 前置条件字段是否闭合 | 通过 | projection ref、state version、source cursor、maintenance scope、issue ref 均有 Step 7/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | 当前使用 invalid-transition 占位;public failure priority 后移 |
| 副作用是否闭合 | 通过 | projection state/view save and job report only;no core truth repair |
| 测试切口是否可写 | 通过 | query no rebuild;fresh->stale;stale->pending->rebuilt;unsupported writer failed;missing cursor failed;Rebuilt not auto folded |

#### 7.11.2 `ReferenceResolutionStateKind`

`ReferenceResolutionStateKind` 描述 identity 对一个 `ExternalReferenceRef` bundle 的解析状态。它不表示 external truth lifecycle,也不允许通过默认值把 unavailable/unrecognized source 伪装成 usable source。

```text
[ReferenceResolutionState]
  factory -> Resolved
  factory -> Unavailable
  factory -> Unrecognized
  Resolved -> Stale
  Stale / Unavailable / Unrecognized / PendingReconciliation / RefreshFailed -> Resolved
  Resolved / Stale / PendingReconciliation -> Unavailable
  Resolved / Stale / Unavailable / Unrecognized / RefreshFailed -> PendingReconciliation
  Stale / Unavailable / PendingReconciliation -> RefreshFailed
  RefreshFailed -> Stale
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Resolved` | resolver / event mapper 给出可保存 body-free safe summary | 否 | mark stale;refresh again;consumer uses as source only after policy guard |
| `Stale` | 外部 source version 变化或已知过期 | 否 | refresh to resolved/unavailable/failed;pending reconciliation |
| `Unavailable` | 外部 dependency / owner 暂不可用 | 否 | refresh again;pending reconciliation;classified failed item |
| `Unrecognized` | formal resolver 当前不能识别该 external ref | 否 | later formal resolver may recover same bundle to resolved;pending reconciliation |
| `PendingReconciliation` | 需要 report-only 对账解释 | 否 | refresh again;report finding;resolved/unavailable/failed |
| `RefreshFailed` | refresh attempt failed and safe issue marker exists | 否 | retry refresh;pending reconciliation;resolved |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Resolved` | `ReferenceResolutionState::resolved(...)` | consumer sidecar accepted path / refresh resolved branch | state id from generator/lookup;external ref and owner formal;source version and safe summary present | state resolved;source version + safe summary present;issue empty | save reference state;optional save typed sidecar with same bundle version | `IdentityDomainError::InvalidStateTransition` |
| factory | `Unavailable` | `ReferenceResolutionState::unavailable(...)` | consumer/refresh dependency unavailable branch | issue ref present;no default summary | state unavailable;issue present | save failed/unavailable state;record failed reference and issue | `IdentityDomainError::InvalidStateTransition` |
| factory | `Unrecognized` | `ReferenceResolutionState::unrecognized(...)` | resolver unsupported/unrecognized branch | issue ref present;external ref typed;owner formal | state unrecognized;issue present | save state;record failed reference and issue;no accepted truth | `IdentityDomainError::InvalidStateTransition` |
| `Resolved` | `Stale` | `mark_stale(source_version_ref, checked_at)` | source changed event / refresh detects version drift | new external source version marker present | state stale;source version updated;safe summary may be retained as marker only | save state with loaded bundle version;mark affected projections stale if flow requires | `IdentityDomainError::InvalidStateTransition` |
| `Stale` / `Unavailable` / `Unrecognized` / `PendingReconciliation` / `RefreshFailed` | `Resolved` | resolver returned resolved state / replacement using same state ref | `RefreshExternalReferenceStateFlow` | loaded bundle version;resolver called with loaded owner;safe summary and source version present;external ref same | state resolved;issue cleared;safe summary current | save reference state and typed sidecar with loaded bundle version;record refreshed ref | `IdentityDomainError::InvalidStateTransition` |
| `Resolved` / `Stale` / `PendingReconciliation` | `Unavailable` | `mark_unavailable(issue_ref, checked_at)` or resolver returned unavailable state | `RefreshExternalReferenceStateFlow` | classified safe issue;no external body;current state permits unavailable transition | state unavailable;issue present;safe summary not treated usable | save state;record failed ref and issue | `IdentityDomainError::InvalidStateTransition` |
| `Resolved` / `Stale` / `Unavailable` / `Unrecognized` / `RefreshFailed` | `PendingReconciliation` | `mark_pending_reconciliation(issue_ref, checked_at)` | reconciliation drift / mismatch marker | report-only issue present;repair intent absent | state pending reconciliation;issue present | save state;report/finding may reference issue;no repair | `IdentityDomainError::InvalidStateTransition` |
| `Stale` / `Unavailable` / `PendingReconciliation` | `RefreshFailed` | `mark_refresh_failed(issue_ref, checked_at)` | resolver `ApplicationError` or classified refresh failure | safe issue marker from mapper;raw error not stored;current state permits failed refresh | state refresh failed;issue present | save state;record failed ref and issue | `IdentityDomainError::InvalidStateTransition` |
| `RefreshFailed` | `Stale` | `mark_stale(source_version_ref, checked_at)` | retry detects still-stale source marker | new source version marker present;no safe summary yet | state stale;source version updated | save state;retry may continue in later job run | `IdentityDomainError::InvalidStateTransition` |

`Unrecognized -> Resolved` is allowed only for the same `ExternalReferenceRef` bundle after a later formal resolver can recognize that typed reference and returns source version + safe summary. It must preserve the loaded owner, use the loaded bundle `IdentityVersion`, and must not create a second resolution bundle or accepted truth by itself.

`Unrecognized -> Unavailable` and `RefreshFailed -> Unavailable` are not executable in the current matrix even if a broad Step 9 pseudo-code branch says "resolver returns unavailable state". In those cases the application service must choose an allowed failure path, usually `RefreshFailed` or `PendingReconciliation` with a safe issue marker, until Step 9/Step 6 are explicitly revised.

Required marker table:

| Target state | Required marker / field |
|---|---|
| `Resolved` | `source_version_ref`, `safe_summary_ref`, `external_reference_ref`, `reference_owner_ref` |
| `Stale` | `source_version_ref` and checked time |
| `Unavailable` | `issue_ref` with `MaintenanceIssueKind::Unavailable` or equivalent safe issue |
| `Unrecognized` | `issue_ref` with `MaintenanceIssueKind::Unrecognized` or equivalent safe issue |
| `PendingReconciliation` | report-only `issue_ref` / finding marker |
| `RefreshFailed` | safe failure `issue_ref`;raw resolver error excluded |

Forbidden reference transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| query sees stale/unavailable/missing state | call resolver or save sidecar | return stored state surface;no refresh |
| resolver unavailable | keep previous `Resolved` as silently usable | mark `Unavailable` or `RefreshFailed` with issue |
| unrecognized external ref | create default safe summary | `Unrecognized` + issue;no accepted truth |
| refresh save | use `ExternalSourceVersionRef` as expected_version | use loaded bundle `IdentityVersion` |
| typed sidecar save | save under safe summary ref or business source ref | save under same `ExternalReferenceRef` bundle |
| owner mismatch | infer owner from external ref string | degraded/rejected per Step 12;do not save |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ReferenceResolutionStateKind::{Resolved,Stale,Unavailable,Unrecognized,PendingReconciliation,RefreshFailed}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不新增 `Disabled` / `Missing`;missing 是 query surface |
| 触发函数是否存在 | 通过 | factories,mark methods,Step 9 resolver returned-state save branch |
| 前置条件字段是否闭合 | 通过 | external ref、owner、source version、safe summary、issue、same-bundle version 均有 Step 6/7/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | owner mismatch、unsafe material、resolver error public mapping 后移 |
| 副作用是否闭合 | 通过 | reference state/typed sidecar save only;no external truth repair |
| 测试切口是否可写 | 通过 | resolved usable;stale refresh;unavailable no default;unrecognized recovery same bundle;sidecar same version;query no resolver |

#### 7.11.3 `ReconciliationReportStateKind`

`ReconciliationReportStateKind` 是 per-report state。报告一旦保存就是 report-only observation;后续 reconciliation 必须创建新 report,不得把旧 report 当 repair plan 或 mutable workflow ticket。

```text
[ReconciliationReport]
  factory/assembly -> Generated
  factory/assembly -> NoFinding
  factory/assembly -> FindingDetected
  factory/assembly -> Partial
  factory/assembly -> Failed
  Generated / NoFinding / FindingDetected -> FindingDetected
  Generated / NoFinding / FindingDetected -> Partial
  Generated / NoFinding / FindingDetected / Partial -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Generated` | 报告成功生成,尚未被细分为 finding/no-finding/partial | 保存后对该 report 终态 | assembly 内 append finding / mark partial / mark failed |
| `NoFinding` | 当前范围未发现 finding | 保存后对该 report 终态 | assembly 内若后续发现 finding 可转 finding |
| `FindingDetected` | 有 body-free finding refs 或 drift/issue finding | 保存后对该 report 终态 | assembly 内追加 finding / mark partial / failed |
| `Partial` | 部分 target 扩展/读取/检查失败或不可用 | 保存后对该 report 终态 | assembly 内 mark failed |
| `Failed` | report generation failed but safe failure report can be saved | 是 | 无;后续 run 创建新 report |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory/assembly | `Generated` | `ReconciliationReport::generated(...)` | `RunIdentityReconciliationFlow` | scope/targets/finding/issue refs body-free;policy report-only passed | state generated;copy targets/findings/issues | save report;record report_ref;stored job report | `IdentityDomainError::InvalidStateTransition` |
| factory/assembly | `NoFinding` | `ReconciliationReport::no_finding(...)` | no target or checked targets with no finding | target refs body-free;finding/issue empty or no-op policy chosen | state no finding | save report;output/report refs;no repair | `IdentityDomainError::InvalidStateTransition` |
| factory/assembly | `FindingDetected` | `generated(...)` with finding refs or `append_finding(...)` | drift/finding branch | finding refs body-free;issue refs safe | state finding detected;finding refs non-empty | save report;record inspected targets/issues | `IdentityDomainError::InvalidStateTransition` |
| factory/assembly | `Partial` | `mark_partial(issue_ref, generated_at)` / generated partial branch | partial target expansion / unavailable item | at least one safe issue ref;partial not hidden | state partial;issue refs present | save report;job disposition partial;no truth repair | `IdentityDomainError::InvalidStateTransition` |
| factory/assembly | `Failed` | `ReconciliationReport::failed(...)` / `mark_failed(...)` | forbidden material mapped to failed,or report generation failure | safe issue ref present;raw material excluded | state failed;issue refs present | save failed report if allowed;job failed/partial surface | `IdentityDomainError::InvalidStateTransition` |
| `Generated` / `NoFinding` / `FindingDetected` | `FindingDetected` | `append_finding(finding_ref, issue_ref)` | report assembly before save | finding ref body-free;optional issue safe | append finding;state finding detected | report still not a repair action | `IdentityDomainError::InvalidStateTransition` |
| `Generated` / `NoFinding` / `FindingDetected` | `Partial` | `mark_partial(issue_ref, generated_at)` | report assembly before save | safe partial issue present | state partial;issue appended | report partial;no hidden success | `IdentityDomainError::InvalidStateTransition` |
| `Generated` / `NoFinding` / `FindingDetected` / `Partial` | `Failed` | `mark_failed(issue_ref, generated_at)` | report assembly failure before save | safe failure issue present | state failed;issue appended | failed report/job surface;no raw diagnostic | `IdentityDomainError::InvalidStateTransition` |

Post-save rule:the saved report instance is immutable report-only material for Step 10 purposes. Later reconciliation for the same scope creates a new `ReconciliationReportRef`;it does not mutate old report state to superseded because identity Step 6 has no `Superseded` report state.

Forbidden report transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| finding detected | emit repair command or update truth | save finding refs only;repair through formal owner command later |
| partial scope | save `NoFinding` / full `Generated` | save `Partial` with issue refs |
| failed report | save raw error/log/secret | save safe `MaintenanceIssueRef` only |
| later reconciliation exists | mutate old report to `Superseded` | create new report;latest-pointer/list policy belongs Step 11 if needed |
| query reads report | regenerate or repair report | read stored report;missing/list priority from 10.3/9.2-c |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ReconciliationReportStateKind::{Generated,NoFinding,FindingDetected,Partial,Failed}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不引入 governance 的 `Superseded` |
| 触发函数是否存在 | 通过 | `generated/no_finding/failed/append_finding/mark_partial/mark_failed` and `RunIdentityReconciliationFlow` |
| 前置条件字段是否闭合 | 通过 | report id、scope、targets、finding refs、issue refs、actor/time 均有 Step 6/7/8/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | forbidden material / failed job public mapping 后移 |
| 副作用是否闭合 | 通过 | save report/job report/stored result only;no truth/projection/outbox mutation |
| 测试切口是否可写 | 通过 | no finding report;finding detected;partial expansion;failed report;post-save no mutation |

#### 7.11.4 maintenance issue / finding disposition

`MaintenanceIssueKind` and `ReconciliationFindingMaterialKind` are helper dispositions,not independent durable workflows. They decide whether projection/reference/reconciliation job output is retryable/partial/failed/finding-only and whether report material is allowed to be persisted.

| `MaintenanceIssueKind` | Meaning | Allowed writer | State/report effect | Forbidden use |
|---|---|---|---|---|
| `Stale` | projection/reference behind source | stale marker / maintenance scan | projection `Stale`,reference `Stale`,or finding issue | Treat as fatal failure |
| `Unavailable` | dependency unavailable | resolver/job/adapter-safe mapper | projection `Degraded`/`RebuildFailed`,reference `Unavailable`/`RefreshFailed`,report `Partial` | Use default success material |
| `Unrecognized` | unsupported ref/kind/writer | maintenance issue mapper / resolver | failed item,reference `Unrecognized`,report `Partial`/`Failed` | Parse string and continue as supported |
| `Partial` | only part of scope succeeded | job/report assembly | report `Partial`,job partial surface | Hide as `Generated`/`NoFinding` |
| `DriftDetected` | report-only mismatch/finding | reconciliation builder | report `FindingDetected` | Execute repair |
| `Failed` | execution failed with safe issue | job/report mapper | projection/reference failed state or failed report | Store raw error body |
| `ForbiddenBody` | forbidden external/raw/secret material attempted | reconciliation policy / material guard | rejected/failed report surface;material not saved | Persist forbidden material |

| `ReconciliationFindingMaterialKind` | Allowed to persist finding? | Required handling |
|---|---|---|
| `SafeRefsOnly` | 是 | may create `ReconciliationFindingRef`;no body |
| `IssueRefsOnly` | 是 | may create finding linked to safe issue refs |
| `ForbiddenExternalBody` | 否 | reject/failed report surface;do not save body |
| `ForbiddenDiagnosticBody` | 否 | reject/failed report surface;do not save raw diagnostic |
| `ForbiddenSecret` | 否 | reject/failed report surface;do not save secret |

| Flow | Issue/finding disposition source | Required result |
|---|---|---|
| `RebuildIdentityProjectionFlow` | missing state/cursor,unsupported writer,writer failure | failed projection refs + issue refs;projection state `RebuildFailed` or `Degraded` |
| `RefreshExternalReferenceStateFlow` | missing state,resolver unavailable/unrecognized/error | refreshed or failed reference refs;reference state explicit;typed sidecar only on same bundle |
| `RunIdentityReconciliationFlow` | target expansion,policy guard,finding material | report `NoFinding` / `FindingDetected` / `Partial` / `Failed`;no repair |
| operations query flows | loaded state/report issue refs | response safe marker only;no mutation |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `MaintenanceIssueKind` and `ReconciliationFindingMaterialKind` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | helper disposition 不新增 `Retryable` state;retry policy 后移 Step 12/14 |
| 触发函数是否存在 | 通过 | maintenance issue mapper,ReconciliationPolicy material guard,report builder |
| 前置条件字段是否闭合 | 通过 | issue/finding refs are body-free markers from Step 6/7/9 |
| 非法转换错误是否有 Step 12 承接 | 通过 | retryable/fatal public error and job disposition priority 后移 |
| 副作用是否闭合 | 通过 | issue/finding only drives state/report markers;does not repair |
| 测试切口是否可写 | 通过 | stale issue;unavailable issue;unrecognized writer/ref;partial report;forbidden body rejected |

#### 7.11.5 10.4 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.4 范围 | 通过 | 只覆盖 projection/reference/reconciliation maintenance states and helper dispositions |
| 是否回指 Step 6/7/8/9 | 通过 | state enum/helpers 来自 Step 6;repository/resolver/report ports 来自 Step 7;DTO/flow 来自 Step 8/9 |
| projection source cursor 是否闭合 | 通过 | stale marker and rebuild success require formal source cursor;missing cursor -> failed item |
| `Rebuilt` 是否自动折叠为 `Fresh` | 已闭合 | 不自动折叠;`Rebuilt` 是 rebuild success state,fresh-equivalent read 由 assembler 判断 |
| reference same-bundle version 是否闭合 | 通过 | state and sidecar save use loaded `ExternalReferenceRef` bundle version |
| `Unrecognized` 是否可恢复 | 已闭合 | 可恢复到 `Resolved`,但只能同 bundle、同 owner、formal resolver 返回 safe summary |
| report-only 是否保持 | 通过 | report/finding/issue 不执行 repair;post-save report instance 不再 mutate |
| maintenance issue/finding 是否 body-free | 通过 | raw diagnostic、external body、secret 都 forbidden |
| query/job 边界是否保持 | 通过 | query no-write;maintenance job no core/external truth repair |
| 是否越过 Step 12/14/16 | 未越过 | retryable/fatal priority、retry schedule、public error/status and tests 后移 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.12 10.5 outbox / handoff propagation states

本批只覆盖 accepted outbox propagation、trace/audit/archive handoff propagation 和对应 policy/material disposition。它承接 Step 8 `8.2-c` handoff command DTO、`8.3-c` outbox/handoff query DTO、`8.6` operations job DTO,以及 Step 9 `PublishIdentityOutboxFlow`,`DeliverTraceHandoffFlow`,`RetryIdentityPropagationFailuresFlow`。本批不写 idempotency/stored replay/job report、runtime/adapter/entry 状态。

本批固定五条边界:

- `OutboxState::Published` 只表示 outbound publisher boundary 成功,不代表 downstream consumed、consumer accepted 或 adjacent truth updated。
- `HandoffState::Delivered` 必须同时有 `HandoffAttemptRef` 和 `HandoffReceiptRef`;request sent、HTTP 2xx、adapter ok、job log success 都不能标 delivered。
- Propagation failure 不回滚 accepted identity truth;它只更新 outbox/handoff state、safe issue marker 和 job report item refs。
- Retry job 只处理 `RetryableFailed`;不得 retry `Failed`,`SkippedByPolicy`,`Published`,`Delivered`,`Cancelled` 或 query not-visible item。
- Outbox payload、handoff safe material、publisher issue、handoff receipt/issue 都只能是 body-free marker;不得保存 event body、broker response、target path、archive package、receipt body、raw diagnostic 或 secret。

#### 7.12.1 `OutboxStateKind`

`OutboxStateKind` 是 `IdentityOutboxRecord` 的 publish lifecycle。它不表达 command accepted/rejected,也不表达 downstream business result。

```text
[OutboxState]
  factory -> PendingPublish
  PendingPublish -> Published
  PendingPublish -> RetryableFailed
  PendingPublish -> Failed
  PendingPublish -> SkippedByPolicy
  RetryableFailed -> Published
  RetryableFailed -> RetryableFailed
  RetryableFailed -> Failed
  RetryableFailed -> SkippedByPolicy
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingPublish` | accepted outbox record 等待 publish | 否 | publish attempt |
| `Published` | publisher boundary 成功接收 / 发布 | 是 | no retry;query/report only |
| `RetryableFailed` | publish attempt 失败但正式 outcome 允许重试 | 否 | retry publish |
| `Failed` | publish permanent/unsupported failure,需报告或人工处理 | 是 | no retry in current Step 9 |
| `SkippedByPolicy` | policy 判定不应传播 | 是 | no retry;query/report only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingPublish` | `OutboxState::pending(changed_at)` / `IdentityOutboxRecord::from_accepted_change(...)` | accepted command / consumer / callback outbox side effect | accepted truth and accepted trace saved in same transaction;subject from mapper;payload marker body-free;topic key formal | state pending;attempt/issue empty | save pending outbox;command effect records outbox ref;accepted truth already committed in same UoW | `IdentityDomainError::InvalidStateTransition` |
| `PendingPublish` / `RetryableFailed` | `Published` | `OutboxState::published(attempt_ref, changed_at)` + `record.mark_published(...)` | `PublishIdentityOutboxFlow` / retry outbox branch | loaded outbox version;topic binding resolved;publisher returned `Published { attempt_ref }`;attempt marker present | state published;attempt present;issue cleared | update outbox state;record published_outbox_ref;stored job report | `IdentityDomainError::InvalidStateTransition` |
| `PendingPublish` / `RetryableFailed` | `RetryableFailed` | `OutboxState::retryable_failed(issue_ref, changed_at)` + `record.mark_retryable_failed(...)` | publish/retry retryable failure branch | publisher returned `RetryableFailed`;safe issue marker present;raw adapter body excluded | state retryable failed;issue present | update state;record failed_outbox_ref;job issue via maintenance issue mapper | `IdentityDomainError::InvalidStateTransition` |
| `PendingPublish` / `RetryableFailed` | `Failed` | `OutboxState::failed(issue_ref, changed_at)` + `record.mark_failed(...)` | permanent / unsupported topic branch | publisher returned `PermanentlyFailed` or `UnsupportedTopic`;safe issue marker present | state failed;issue present | update state;record failed_outbox_ref;job issue via mapper;no truth rollback | `IdentityDomainError::InvalidStateTransition` |
| `PendingPublish` / `RetryableFailed` | `SkippedByPolicy` | `OutboxState::skipped_by_policy(issue_ref, changed_at)` + `record.mark_skipped_by_policy(...)` | `SkippedByPolicy` outcome or outbound policy skip | policy issue marker present;payload not published | state skipped;issue present | update state;record failed/skipped item;accepted truth unchanged | `IdentityDomainError::InvalidStateTransition` |

Identity Step 6 does not define `DeadLettered`. Permanent outbox failure is represented by `Failed`;policy non-publication is represented by `SkippedByPolicy`. Implementation must not add a dead-letter state or map terminal failure back to `PendingPublish` without a future formal operation.

Forbidden outbox transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| accepted command wants synchronous publish before accepted | `PendingPublish` only after publisher success | accepted path saves pending outbox;publish job runs later |
| query sees pending/retryable | call publisher or retry | return stored outbox state surface only |
| publisher success | mark downstream consumed | `Published` only means outbound boundary success |
| publisher retryable failure | rollback accepted truth | update state to `RetryableFailed` and report issue |
| terminal `Failed` / `SkippedByPolicy` | retry in `RetryIdentityPropagationFailuresFlow` | not selected by `list_retryable_outbox_records(...)` |
| fake publisher default success | `PendingPublish -> Published` without configured outcome/attempt | fake must return formal configured outcome marker |
| raw adapter error | derive issue kind from string/body | use formal publisher outcome and issue mapper |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `OutboxStateKind::{PendingPublish,Published,RetryableFailed,Failed,SkippedByPolicy}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不引入 `DeadLettered`;不把 `Failed` 写成 retryable |
| 触发函数是否存在 | 通过 | `pending/published/retryable_failed/failed/skipped_by_policy` and record `mark_*` helpers |
| 前置条件字段是否闭合 | 通过 | attempt/issue marker、topic binding、publisher outcome、loaded version 均有 Step 6/7/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | retryable/permanent public priority and retry policy 后移 Step 12/14 |
| 副作用是否闭合 | 通过 | outbox state update and job report only;accepted truth not rolled back |
| 测试切口是否可写 | 通过 | pending create;publish success;retryable failure retry;permanent failure terminal;skipped by policy terminal;query no publish |

#### 7.12.2 outbound material / policy disposition

Outbound material disposition is a policy decision,not a persisted state machine. It determines whether an accepted fact may create/publish an outbox record and how publish jobs should map policy outcomes.

| Disposition | Required inputs | Result | Forbidden handling |
|---|---|---|---|
| `Publishable` | accepted trace,formal outbox subject,body-free payload marker,topic key,visible/safe material | create `PendingPublish` or publish existing record | publish before accepted truth is saved |
| `RedactedPublishable` | accepted trace,redaction-safe payload marker,topic key,visibility allows reduced material | create/publish body-free redacted payload marker | save redacted body copy or leak original body |
| `SkippedByPolicy` | policy issue marker,topic/material not allowed for propagation | `OutboxState::SkippedByPolicy` when record exists,or no outbox creation when creation policy rejects before record | silently delete pending outbox |
| `ForbiddenBody` | payload/material marker indicates external body/raw/secret | rejected/skipped surface per Step 12;no payload body saved | persist event body or broker payload |
| `UnsupportedTopic` | formal topic binding says unsupported | `OutboxState::Failed` with unsupported issue if record exists | invent fallback topic |
| `PublisherUnavailable` | publisher outcome retryable unavailable | `OutboxState::RetryableFailed` | mark `Published` or permanent without issue |

| Flow | Disposition owner | Required behavior |
|---|---|---|
| accepted outbox creation | `OutboundEventPolicy::for_outbox(...)` + accepted side-effect assembler | only accepted trace may create pending outbox |
| publish job | topic binding + publisher outcome | update `OutboxState`;do not rebuild payload from current truth |
| retry job | `list_retryable_outbox_records(...)` + same publish mapping | retry only retryable records |
| outbox query | repository + visibility resolver | read stored state only;no publish/retry |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | disposition is policy helper,not new enum;state effects use `OutboxStateKind` |
| 状态名是否一致 | 通过 | skipped/unsupported/unavailable map to formal states/issues |
| 触发函数是否存在 | 通过 | `OutboundEventPolicy` guards,topic binding,publisher outcome |
| 前置条件字段是否闭合 | 通过 | accepted trace,subject,payload marker,topic key,visibility context,issue marker all formal |
| 非法转换错误是否有 Step 12 承接 | 通过 | forbidden body / unsupported topic public mapping 后移 |
| 副作用是否闭合 | 通过 | policy can skip/fail outbox,never rollback truth |
| 测试切口是否可写 | 通过 | accepted-only;forbidden body;redacted payload marker;unsupported topic;publisher unavailable |

#### 7.12.3 `HandoffStateKind`

`HandoffStateKind` is the delivery lifecycle of a `TraceHandoffIntent`. It is separate from `MemoryReferenceState::HandoffPending/HandoffFailed`;memory relation callback updates belong to memory flows,not to this propagation state.

```text
[HandoffState]
  factory -> PendingHandoff
  PendingHandoff -> Delivered
  PendingHandoff -> RetryableFailed
  PendingHandoff -> Failed
  PendingHandoff -> Cancelled
  RetryableFailed -> Delivered
  RetryableFailed -> RetryableFailed
  RetryableFailed -> Failed
  RetryableFailed -> Cancelled
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingHandoff` | handoff intent 已创建,等待交接 | 否 | delivery attempt |
| `Delivered` | formal attempt + receipt marker 已保存 | 是 | no retry;query/report only |
| `RetryableFailed` | delivery attempt 失败但可重试 | 否 | retry delivery |
| `Failed` | delivery permanent failure,需报告或人工处理 | 是 | no retry in current Step 9 |
| `Cancelled` | target/policy/config 不允许交接或未发起 attempt | 是 | no retry;new command/intent required |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingHandoff` | `HandoffState::pending(changed_at)` / `TraceHandoffIntent::prepare(...)` | `PrepareTraceHandoffFlow` | trace refs non-empty;target/scope/safe material formal;target resolution allowed;no delivery call | state pending;attempt/receipt/issue empty | save handoff intent;accepted command effect;no receipt marker | `IdentityDomainError::InvalidStateTransition` |
| `PendingHandoff` / `RetryableFailed` | `Delivered` | `HandoffState::delivered(attempt_ref, receipt_ref, changed_at)` + `intent.mark_delivered(...)` | `DeliverTraceHandoffFlow` / retry handoff branch / formal callback result | loaded intent version;delivery outcome has attempt and receipt;receipt is marker only | state delivered;attempt and receipt present;issue cleared | save intent;record delivered_handoff_ref and receipt_ref;stored job/callback receipt | `IdentityDomainError::InvalidStateTransition` |
| `PendingHandoff` / `RetryableFailed` | `RetryableFailed` | `HandoffState::retryable_failed(attempt_ref, issue_ref, changed_at)` + `intent.mark_retryable_failed(...)` | delivery retryable failure branch | delivery attempt started;attempt marker and safe issue marker present | state retryable failed;attempt+issue present | save intent;record failed_handoff_ref;job issue via mapper | `IdentityDomainError::InvalidStateTransition` |
| `PendingHandoff` / `RetryableFailed` | `Failed` | `HandoffState::failed(attempt_ref, issue_ref, changed_at)` + `intent.mark_failed(...)` | permanent delivery failure branch | delivery attempt started;attempt marker and safe issue marker present | state failed;attempt+issue present | save intent;record failed_handoff_ref;job issue via mapper;no truth repair | `IdentityDomainError::InvalidStateTransition` |
| `PendingHandoff` / `RetryableFailed` | `Cancelled` | `HandoffState::cancelled(issue_ref, changed_at)` + `intent.mark_cancelled(...)` | cancelled by policy / unsupported target branch | no delivery attempt required;safe issue marker present | state cancelled;issue present;attempt/receipt empty unless previous retryable attempt retained by object policy | save intent;record failed_handoff_ref;job issue via mapper | `IdentityDomainError::InvalidStateTransition` |

Retryable/permanent delivery failures require `HandoffAttemptRef`. If a target resolver or policy rejects before any delivery attempt starts, the only allowed terminal update is `Cancelled`,not `Failed`.

Forbidden handoff transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| prepare command | call delivery adapter or mark delivered | create `PendingHandoff` only |
| delivery adapter returns success without receipt | `PendingHandoff -> Delivered` | reject/degrade/fail per Step 12;Delivered requires receipt marker |
| HTTP 2xx / request sent / job success log | mark delivered | require formal `HandoffReceiptRef` |
| retryable failure without attempt | `RetryableFailed` | use `Cancelled` if no attempt was started |
| terminal `Failed` / `Cancelled` / `Delivered` | retry in retry job | not selected by `list_retryable_handoff_intents(...)` |
| callback handler | direct repository update outside application facade | worker callback must dispatch application callback service |
| fake handoff default success | mark delivered without configured receipt | fake must return configured formal receipt outcome |
| receipt body | save into state/report | save only `HandoffReceiptRef` marker |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `HandoffStateKind::{PendingHandoff,Delivered,RetryableFailed,Failed,Cancelled}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不混用 `MemoryReferenceState` handoff states;不新增 `Prepared` |
| 触发函数是否存在 | 通过 | `pending/delivered/retryable_failed/failed/cancelled` and intent `mark_*` helpers |
| 前置条件字段是否闭合 | 通过 | attempt/receipt/issue marker,target/scope/safe material,delivery outcome,loaded version 均有 Step 6/7/8/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | fake delivered、receipt missing、target disabled public mapping 后移 |
| 副作用是否闭合 | 通过 | handoff intent state update and job/callback receipt only;no memory/core truth repair |
| 测试切口是否可写 | 通过 | prepare pending;delivered requires receipt;retryable failure retry;permanent failed terminal;cancel before attempt;query no delivery |

#### 7.12.4 handoff material / target disposition

Handoff material disposition is a policy/adapter outcome helper,not a separate durable state. It governs whether a pending intent may be created or delivered, and how delivery outcomes map to `HandoffState`.

| Disposition | Required inputs | Result | Forbidden handling |
|---|---|---|---|
| `PendingAllowed` | trace refs non-empty,target/scope formal,safe material marker,visibility allowed | create `PendingHandoff` | create intent with empty trace refs |
| `DeliveredWithReceipt` | attempt marker + receipt marker | `HandoffState::Delivered` | treat adapter success without receipt as delivered |
| `RetryableDeliveryFailure` | attempt marker + issue marker | `HandoffState::RetryableFailed` | retryable failure without attempt |
| `PermanentDeliveryFailure` | attempt marker + issue marker | `HandoffState::Failed` | rollback truth or clear material |
| `CancelledByPolicy` | issue marker;attempt not required | `HandoffState::Cancelled` | mark `Failed` when no attempt happened |
| `UnsupportedTarget` | issue marker from target resolver/binding | `HandoffState::Cancelled` | invent fallback target |
| `ForbiddenMaterial` | forbidden body/raw/secret/package marker | rejected/cancelled surface per Step 12;material not saved | persist archive package/receipt body/raw log |

| Flow | Disposition owner | Required behavior |
|---|---|---|
| `PrepareTraceHandoffFlow` | `HandoffPolicy` + target resolver | create pending intent only;no delivery |
| `DeliverTraceHandoffFlow` | handoff target/delivery ports | update handoff state by formal delivery outcome |
| `RetryIdentityPropagationFailuresFlow` | `list_retryable_handoff_intents(...)` + same delivery mapping | retry only retryable handoff intents |
| `GetTraceHandoffStateFlow` | repository + visibility resolver | read stored state only;no delivery/retry |
| `HandleTraceHandoffResultFlow` | callback application service | may update delivered/failed only with formal marker/outcome and stored callback receipt |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | disposition is helper;durable effects use `HandoffStateKind` |
| 状态名是否一致 | 通过 | unsupported/cancelled/forbidden map to formal cancelled/rejected surfaces |
| 触发函数是否存在 | 通过 | `HandoffPolicy`,target resolver,delivery outcome,callback service |
| 前置条件字段是否闭合 | 通过 | trace refs,target/scope,safe material,attempt,receipt,issue markers all formal |
| 非法转换错误是否有 Step 12 承接 | 通过 | target disabled/material forbidden/fake delivered public mapping 后移 |
| 副作用是否闭合 | 通过 | intent state and receipt/report markers only;no external truth repair |
| 测试切口是否可写 | 通过 | empty trace rejected;target unsupported cancelled;receipt required;forbidden material;retryable only |

#### 7.12.5 10.5 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.5 范围 | 通过 | 只覆盖 outbox/handoff propagation states and material disposition |
| 是否回指 Step 6/7/8/9 | 通过 | state enum/helpers 来自 Step 6;repository/publisher/handoff ports 来自 Step 7;DTO/flow 来自 Step 8/9 |
| outbox `Published` 是否与 consumed 分离 | 通过 | `Published` 只表示 outbound boundary success |
| identity 是否引入 dead-letter state | 未引入 | permanent outbox failure 使用 `Failed`;policy skip 使用 `SkippedByPolicy` |
| retryable vs terminal 是否闭合 | 通过 | retry job 只处理 `RetryableFailed`;terminal states 不 retry |
| handoff delivered guard 是否闭合 | 通过 | `Delivered` requires attempt + receipt marker |
| handoff failed/cancelled boundary 是否闭合 | 通过 | failed requires attempt;pre-attempt policy/unsupported target maps to cancelled |
| receipt/issue 是否 body-free | 通过 | state stores native marker;job report uses maintenance issue mapper |
| query/job/callback 边界是否保持 | 通过 | query no publish/delivery/retry;job via application service;callback no direct repository |
| 是否越过 Step 12/14/16 | 未越过 | retry schedule,public error/status,config binding and tests 后移 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.13 10.6 application support states

本批覆盖 application replay / job report support states。它不新增业务 truth,不改变 member/lifecycle/role/career/memory 状态,也不让 query 进入 idempotency / stored result。`IdentityCommandEffectSummary` 和 `StoredIdentityOperationResult` 是 effect / replay surface,不是为了统一所有对象而新增的全局状态机。

本批固定四条边界:

- idempotency record 是 reserve / complete / conflict 的 durable state owner。
- stored result kind 是 replay surface discriminator;保存后 immutable,不得当 lifecycle 反复迁移。
- job result kind 是 job report outcome;duplicate replay 只回放已保存 report,不重跑 job body。
- command effect summary 是 accepted path 的 refs 汇总;不生成 cursor、不决定 tx order、不触发副作用。

#### 7.13.1 `IdentityIdempotencyStateKind`

`IdentityIdempotencyStateKind` 描述同一个 operation name + channel + idempotency key 下的 replay/control 状态。它不表示 command accepted truth,也不表示 job succeeded。

```text
[IdentityIdempotencyRecord]
  reserve(context,digest) -> Reserved
  Reserved -> Completed
  Reserved -> RejectedStored
  Reserved -> Conflict
  Reserved -> Expired [reserved until formal expiry flow]
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Reserved` | first-run mutation / consumer / callback / job 已占用 key,尚未完成 replay surface | 否 | complete accepted/receipt/job;complete replayable rejected;mark conflict;formal expiry |
| `Completed` | first-run accepted / receipt / job report 已有 stored result | 是 | same key same digest duplicate replay |
| `RejectedStored` | replayable rejected surface 已有 stored result | 是 | same key same digest duplicate replay rejected result |
| `Conflict` | same key different digest,不能 replay 原结果 | 是 | return conflict surface;no mutation |
| `Expired` | formal expiry / retention policy 已使 record 不可 replay | 是 | Step 13/14 后续定义是否允许 new reserve |

| From | To | 触发函数 / port | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| none | `Reserved` | `IdentityIdempotencyRecord::reserve(context, now)` / `IdentityIdempotencyRepository.reserve(...)` | command / consumer / callback / job first run | context has operation name,channel,idempotency key,request digest;record_ref allocated | state reserved;stored_result_ref empty;reserved_at set | begin UoW;continue mutation body only after reserve outcome `Reserved` | `ApplicationError::InvalidStateTransition` |
| `Reserved` | `Completed` | `complete(result_ref, now)` / `complete_with_stored_result(...)` | command accepted,consumer receipt,callback receipt,job report first run | stored result saved in same UoW;stored_result_ref present;expected_version from reserved record | state completed;stored_result_ref set;completed_at set | complete idempotency after stored result/report/effect save,then commit | `ApplicationError::InvalidStateTransition` |
| `Reserved` | `RejectedStored` | `complete_rejected(result_ref, now)` / `complete_rejected_with_stored_result(...)` | replayable rejected branch per Step 12/13 | rejected stored result saved;result kind `CommandRejected` or formally allowed rejected surface | state rejected stored;stored_result_ref set;completed_at set | return stored rejected surface;ordinary validation/internal errors not automatically persisted | `ApplicationError::InvalidStateTransition` |
| `Reserved` | `Conflict` | `mark_conflict(now)` / `mark_conflict(...)` | same key different digest while current reserve path is still controlled by repository | original digest retained;incoming raw body not stored | state conflict;stored_result_ref may remain empty | rollback/stop mutation;return conflict surface per Step 12/13 | `ApplicationError::InvalidStateTransition` |
| `Reserved` | `Expired` | formal expiry transition | retention/cleanup flow,not current Step 9 command/job body | expiry policy and ownership defined by Step 13/14 | state expired;no new stored result | no mutation replay;public behavior deferred | `ApplicationError::InvalidStateTransition` |

Duplicate reserve outcome matrix:

| Reserve outcome | Required application behavior | Forbidden behavior |
|---|---|---|
| `Reserved` | run first-run flow and save stored surface before complete | return success before stored result exists |
| `ReplayAvailable` | rollback current UoW,load stored result / typed receipt / job report,return replay | rerun command,consumer,callback or job body |
| `Conflict` | return conflict/rejected surface per Step 12/13 | overwrite original digest or reuse previous result |
| `InFlight` | return in-flight/degraded/retry surface per Step 12/13 | wait by hidden loop or start second mutation |

Invariant table:

| Invariant | Formal rule |
|---|---|
| completed requires stored result | `Completed` and `RejectedStored` are invalid without `IdentityStoredResultRef` |
| namespace | key namespace includes operation name + channel + idempotency key |
| digest | same key replay requires same digest;different digest never reuses stored result |
| channel source | channel must copy `IdentityOperationContext.channel`;repository must not hard-code command/event/job |
| query | query does not reserve idempotency and does not save stored result |
| missing stored result | missing/wrong-kind stored result is Step 12/13 replay error;never rerun mutation |
| conflict durability | Step 10 does not authorize overwriting a completed/rejected replayable record just to persist a later conflict marker |
| expiry | `Expired` exists as formal state but current Step 9 has no executable expiry flow;implementation must not invent TTL behavior |

Forbidden idempotency transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| same key same digest completed | `Completed -> Reserved` and rerun | replay stored result |
| same key different digest completed/rejected | overwrite stored result or mutate original digest | return conflict surface;Step 13 owns exact priority |
| accepted path missing stored result | complete idempotency anyway | fail/degrade per Step 12/13;do not commit replayless completed state |
| query duplicate | create idempotency record | query is no-write |
| consumer/callback replay | reconstruct receipt from shell marker only | load typed `IdentityConsumerReceiptEnvelope` |
| job replay | relist pending/stale/retryable items | load stored job report |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityIdempotencyStateKind::{Reserved,Completed,RejectedStored,Conflict,Expired}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不新增 `Replayable` / `InProgress`;`ReplayAvailable` 是 reserve outcome |
| 触发函数是否存在 | 通过 | `reserve/complete/complete_rejected/mark_conflict` and Step 7 repository methods |
| 前置条件字段是否闭合 | 通过 | context、channel、digest、stored_result_ref、expected_version 均有 Step 6/7/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | missing stored result、in-flight、conflict public priority 后移 Step 12/13 |
| 副作用是否闭合 | 通过 | idempotency 只控制 replay;truth/trace/audit/outbox/report 由 flow 写 |
| 测试切口是否可写 | 通过 | first reserve;completed replay;rejected replay;digest conflict;in-flight;missing stored result no rerun |

#### 7.13.2 `StoredIdentityOperationResult` / `IdentityStoredResultKind`

`StoredIdentityOperationResult` 是 replay snapshot shell。`IdentityStoredResultKind` 只区分 replay surface family,保存后不得发生 kind 迁移。

```text
[StoredIdentityOperationResult]
  factory -> CommandAccepted
  factory -> CommandRejected
  factory -> ConsumerReceipt
  factory -> JobReport
  factory -> HandoffCallbackReceipt
  saved result is immutable
```

| Kind | Required factory / repository save | Required typed replay source | Replay target | Forbidden handling |
|---|---|---|---|---|
| `CommandAccepted` | `StoredIdentityOperationResult::command_accepted(...)`;`save_command_accepted_result(...)` | command accepted surface marker + effect/result refs | `IdentityCommandResponse<T>` accepted replay | reload truth and rebuild accepted response |
| `CommandRejected` | `command_rejected(...)`;`save_command_rejected_result(...)` | formally replayable rejection marker | `IdentityProtocolRejection` replay | persist arbitrary validation/internal error without Step 12/13 rule |
| `ConsumerReceipt` | `consumer_receipt(...)`;`save_consumer_receipt_result(...)` plus `save_consumer_receipt(...)` | `IdentityConsumerReceiptEnvelope` with result_kind `ConsumerReceipt` | stored `IdentityConsumerReceipt` | replay from generic shell only |
| `JobReport` | `job_report(...)`;`save_job_report_result(...)` plus `IdentityJobReportRepository.save_job_report(...)` | stored `IdentityJobRunReport` / report surface | `IdentityJobResponse<T>` report replay | rerun job body or rescan repository |
| `HandoffCallbackReceipt` | `handoff_callback_receipt(...)`;`save_handoff_callback_receipt_result(...)` plus `save_handoff_callback_receipt(...)` | `IdentityConsumerReceiptEnvelope` with result_kind `HandoffCallbackReceipt` | stored callback receipt | treat callback envelope as normal consumer receipt |

| Field / marker | Required source | Constraint |
|---|---|---|
| `stored_result_ref` | id generator / stored result repository | identity of replay shell;not idempotency record ref |
| `operation_context_ref` | `IdentityOperationContext.context_ref` | context ref only;no raw request/event/job body |
| `result_kind` | accepted/rejected/receipt/report assembler | must match save method and typed replay source |
| `surface_marker_ref` | result/receipt/report surface assembler | body-free marker;not a serialized public body |
| `recorded_at` | clock | not truth cursor,not source cursor |

Kind mismatch and missing source matrix:

| Situation | Required behavior | Forbidden behavior |
|---|---|---|
| stored result missing by ref | Step 12/13 replay error/degraded surface | rerun mutation to recreate result |
| stored kind mismatch | wrong-kind replay error | coerce `ConsumerReceipt` to callback receipt or command result |
| consumer/callback envelope missing | Step 12/13 replay error | rebuild receipt from shell marker |
| job report missing | Step 12/13 replay error | rescan projection/reference/outbox/handoff |
| command accepted marker missing | Step 12/13 replay error | reload current truth and synthesize accepted response |

Stored result is not a cache. It is the official duplicate replay source for mutation families. Query success remains outside this object unless a later Step 13 design explicitly adds query result replay.

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityStoredResultKind::{CommandAccepted,CommandRejected,ConsumerReceipt,JobReport,HandoffCallbackReceipt}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | kind 不新增 `QueryResult` / `OutboxPayload` |
| 触发函数是否存在 | 通过 | Step 6 factories and Step 7 save/get repository surface 已定义 |
| 前置条件字段是否闭合 | 通过 | context ref、surface marker、typed envelope/report 均有 Step 6/7/8/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | missing/wrong-kind public replay error 后移 Step 12/13 |
| 副作用是否闭合 | 通过 | stored result shell + typed surface;no body persistence |
| 测试切口是否可写 | 通过 | save/load each kind;wrong-kind rejected;missing no rerun;consumer/callback typed envelope required |

#### 7.13.3 `IdentityJobResultKind`

`IdentityJobResultKind` 是 `IdentityJobRunReport` 的 outcome。它不表示 scheduler state,不表示 entry dispatch success,也不表示 command accepted truth。

```text
[IdentityJobRunReport]
  start(report) -> Succeeded
  start(report) -> Partial
  start(report) -> Failed
  start(report) -> Noop
  start(report) -> RetryableFailed
  saved report is replay material
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Succeeded` | job body 完成且本次范围无 failed item | 保存后终态 | duplicate replay report |
| `Partial` | 至少部分 item 成功,但存在 failed/skipped/degraded item | 保存后终态 | duplicate replay report;operations query |
| `Failed` | 无成功 item或不可恢复 boundary failure | 保存后终态 | duplicate replay failed report;operations query |
| `Noop` | 本次 scope 无可处理 item | 保存后终态 | duplicate replay no-op report |
| `RetryableFailed` | failure 属于 retryable dependency / publisher / handoff / resolver 类 | 保存后终态 | duplicate replay retryable failed report;retry policy later reads issue |

| Assembly state | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| started report | `Succeeded` | `succeed(...)` | all operations job flows | selected scope processed;failed refs empty;issue refs empty;output refs from formal sources | result kind succeeded;output cursor/item refs copied | save job report;save `StoredIdentityOperationResult(JobReport)`;complete idempotency | `ApplicationError::InvalidStateTransition` |
| started report | `Partial` | `partial(...)` | projection/reference/reconciliation/publish/handoff/retry partial item branch | at least one safe issue ref;partial item refs preserved | result kind partial;issue refs non-empty | save report with success + failed refs;stored result;complete idempotency | `ApplicationError::InvalidStateTransition` |
| started report | `Failed` | `fail(...)` | unrecoverable boundary failure or no successful item with permanent issue | safe issue refs non-empty;raw log/body excluded | result kind failed;issue refs non-empty | save failed report when allowed;stored result;complete idempotency if replayable per Step 13 | `ApplicationError::InvalidStateTransition` |
| started report | `Noop` | `noop(...)` | no pending/stale/target/retryable item | deterministic empty selection from formal repository/list port | result kind noop;item refs empty;issue refs empty | save replayable no-op report;stored result;complete idempotency | `ApplicationError::InvalidStateTransition` |
| started report | `RetryableFailed` | `retryable_fail(...)` | retryable resolver/publisher/handoff/store dependency failure | safe issue refs non-empty;retryable classified by formal outcome/mapper | result kind retryable failed;issue refs non-empty | save replayable retryable failed report;retry schedule remains Step 14 | `ApplicationError::InvalidStateTransition` |

Protocol disposition mapping:

| Public `IdentityJobRunDisposition` | Job report state relation | Required behavior |
|---|---|---|
| `Completed` | maps to `IdentityJobResultKind::Succeeded` | return saved report/output refs |
| `Partial` | maps to `Partial` | keep issue refs and failed item refs |
| `Failed` | maps to `Failed` | keep safe issue refs |
| `RetryableFailed` | maps to `RetryableFailed` | keep safe retryable issue refs;retry schedule later |
| `Noop` | maps to `Noop` | do not fabricate changed item refs |
| `DuplicateReplayed` | wrapper disposition over any stored report state | load stored report;do not create new report |
| `Rejected` | request/entry/application rejection surface | does not create `IdentityJobResultKind` unless Step 12/13 defines replayable rejected job report |

Report item refs invariant:

| Ref family | Required source | Duplicate replay rule |
|---|---|---|
| projection refs | projection repository list/load/update or projection writer result | replay saved refs,do not re-list stale projections |
| reference refs | reference repository list/load/resolver result | replay saved refs,do not rerun resolver |
| reconciliation report refs | report writer repository result | replay saved refs,do not regenerate report |
| outbox refs | outbox repository list/load/update result | replay saved refs,do not re-list pending/retryable outbox |
| handoff refs / receipt refs | handoff intent repository and delivery outcome | replay saved refs,do not redeliver |
| issue refs | `IdentityMaintenanceIssueMapper` or safe report issue marker | replay saved issue refs,do not inspect raw errors |

Forbidden job report transitions:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| saved report exists | mutate result kind to reflect later retry | create later job run/report |
| duplicate same key/digest | rerun body and overwrite report | replay stored report |
| partial run | mark `Succeeded` and drop issue refs | save `Partial` with issue refs |
| no items | mark fake success with changed refs | save `Noop` |
| retryable failure | store raw adapter/resolver body | store safe issue refs only |
| job reports failed item | repair core truth | report only;repair requires formal command owner |
| entry dispatch succeeds | treat as job succeeded | job body/report decides result kind |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityJobResultKind::{Succeeded,Partial,Failed,Noop,RetryableFailed}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `DuplicateReplayed` / `Rejected` are protocol dispositions,not report states |
| 触发函数是否存在 | 通过 | `start/succeed/partial/fail/retryable_fail/noop` and Step 9 shared job skeleton |
| 前置条件字段是否闭合 | 通过 | job_run_ref、job_name、scope、cursor、item refs、issue refs、stored result refs 均有 Step 6/7/8/9 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | rejected job request、stored report missing、retry policy priority 后移 |
| 副作用是否闭合 | 通过 | job report + stored result + idempotency complete;no core truth repair |
| 测试切口是否可写 | 通过 | succeeded;partial;failed;noop;retryable failed;duplicate replay item refs;missing report no rerun |

#### 7.13.4 command effect / stored replay dispositions

`IdentityCommandEffectSummary` was excluded from the state machine inventory as an independent state subject. It is still part of 10.6 because stored replay must know which effect/result surface is valid. The summary is created only after an accepted mutation and only records refs.

| Disposition / surface | Owner | Required refs | Required behavior | Forbidden behavior |
|---|---|---|---|---|
| command accepted effect | `IdentityCommandEffectSummary::from_accepted_change(...)` | operation context,primary truth ref,truth cursor,trace/audit/outbox/stale refs,stored result ref | save after accepted truth/side effects are available in same UoW | generate cursor or create side effects from effect summary |
| command accepted replay | `StoredIdentityOperationResult(CommandAccepted)` | accepted surface marker and effect/result refs | duplicate returns stored accepted response | reload current truth or append second trace/outbox |
| command rejected replay | `StoredIdentityOperationResult(CommandRejected)` | rejected surface marker | only for Step 12/13 replayable rejection | persist every validation/internal error by default |
| consumer/callback receipt replay | typed `IdentityConsumerReceiptEnvelope` plus stored shell | receipt,trace/outbox/issue refs,stored result ref | duplicate returns stored receipt | rebuild receipt from event/callback body |
| operations job replay | `IdentityJobRunReport` plus stored shell | report item refs,counts,issue refs,stored result ref | duplicate returns stored job report/output | rerun job or rescan repository |
| outbound material replay | owning command/consumer/callback stored surface | original outbox refs and payload marker refs | duplicate exposes original refs through stored owner result | create a second outbox record or rebuild payload marker |

Accepted command effect invariants:

| Invariant | Formal rule |
|---|---|
| primary truth ref | must be typed identity-owned ref;not `ExternalSourceRef` string |
| cursor | `accepted_cursor_ref` comes from formal truth cursor assignment;not timestamp/version/idempotency key |
| trace | accepted mutation must have formal trace unless Step 9 explicitly lists exception |
| outbox refs | can be empty only when Step 8/9 lacks canonical outbound payload and explicitly says empty |
| stale projection refs | refs only;no rebuild body;query never uses effect summary to create view refs |
| stored result | effect summary must point to stored result used by duplicate replay |
| transaction order | Step 9/11 own ordering;effect summary does not decide commit order |

Replay family audit:

| Family | Replay source | No-rerun rule |
|---|---|---|
| command | stored command result + effect refs | no second domain transition/resolver/trace/outbox/stale marker |
| consumer | typed receipt envelope + stored shell | no second event parse/mutation/reference sidecar/outbox creation |
| callback | typed callback envelope + stored shell | no second delivery/callback mutation |
| operations job | stored report + stored shell | no second repository scan/job body |
| query | none in current design | no stored result save |

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否把 effect summary 写成状态机 | 未写成 | 它是 accepted refs summary,not lifecycle |
| 是否回指 Step 6/7/8/9 | 通过 | Step 6 object,Step 7 repository,Step 8 surface,Step 9 transaction discipline 均已闭合 |
| replay source 是否按 family 区分 | 通过 | command shell、consumer/callback typed envelope、job report 分开 |
| duplicate no-rerun 是否闭合 | 通过 | 每个 family 都禁止重跑 mutation/job/scan |
| missing stored surface 是否越界补救 | 未越界 | missing/wrong-kind 交 Step 12/13;不私下重建 |
| body-free 是否保持 | 通过 | 不保存 raw request/event/job body、external body、payload body、receipt body、raw log 或 secret |
| 测试切口是否可写 | 通过 | accepted effect refs;stored command replay;typed receipt replay;job report replay;wrong-kind/missing no rerun |

#### 7.13.5 10.6 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.6 范围 | 通过 | 只覆盖 application replay / stored result / job report / effect disposition |
| 是否回指 Step 6/7/8/9 | 通过 | enum/object 来自 Step 6;repository surface 来自 Step 7;protocol replay surface 来自 Step 8;flow discipline 来自 Step 9 |
| idempotency completed/rejected stored result invariant 是否闭合 | 已闭合 | `Completed` / `RejectedStored` 必须有 `IdentityStoredResultRef` |
| duplicate replay 是否 no-rerun | 已闭合 | command/consumer/callback/job 均只能读取 stored surface |
| stored result kind 是否保存后 immutable | 已闭合 | kind 是 replay discriminator,not lifecycle transition |
| typed receipt envelope 是否必要 | 已闭合 | consumer/callback replay 不能只靠 generic stored shell |
| job report item refs 是否闭合 | 已闭合 | stored report 保存 replayable item refs;duplicate 不重扫 repository |
| `IdentityJobResultKind` 是否与 protocol disposition 分离 | 已闭合 | `DuplicateReplayed` / `Rejected` 不写成 job report state |
| command effect summary 是否被错误升级为状态机 | 未升级 | 只作为 accepted effect / replay disposition |
| 是否越过 Step 12/13/14/16 | 未越过 | missing/wrong-kind replay error、conflict/in-flight priority、expiry/retry policy、tests 后移 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.14 10.7 runtime / adapter / entry states

本批覆盖 runtime / adapter / entry technical states。它们只表达配置、runtime wiring、adapter readiness、entry validation 和 entry dispatch attempt,不表达 application accepted、query visible、consumer receipt、job report 或 outbound delivered。所有入口必须经 `IdentityApplicationFacade`,不得直接访问 repository、UnitOfWork、resolver、publisher、handoff adapter、projection store、idempotency 或 stored result port。

本批固定五条边界:

- config valid 只说明配置外壳可用于 assembly,不能改变 domain invariant。
- runtime assembled 只说明 wiring 完成,不能代表 adapter healthy 或 downstream success。
- adapter availability 是 readiness marker,不能反写 identity truth,也不能伪造 publish/deliver/accepted。
- entry validation 只在 pre-dispatch 层生效,不是 application rejection。
- dispatch success 只说明已调用 application boundary,不是 command accepted、query visible、consumer receipt 或 job succeeded。

#### 7.14.1 `IdentityConfigValidationStateKind`

`IdentityConfigValidationStateKind` 是 `IdentityRuntimeConfigShell` 的 validation result。它不保存 raw config,不实例化 adapter,也不授权 entry 绕过 application。

```text
[IdentityRuntimeConfigShell]
  validator -> Validated
  validator -> Degraded
  validator -> Invalid
  no runtime mutation transitions inside shell
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Validated` | config profile、safe evidence、binding、adapter mode 均通过 validation | 对该 shell 终态 | proceed to runtime `ConfigValidated` / `Assembled` |
| `Degraded` | config 可见缺口存在,但可启动性由 Step 14 决定 | 对该 shell 终态 | proceed to degraded runtime if Step 14 allows |
| `Invalid` | config 不可用于 runtime assembly | 对该 shell 终态 | return entry/runtime failure surface;no dispatch |

| From | To | 触发函数 | Step 7/9/14 boundary | 前置条件 | 状态副作用 | Flow / entry 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| validator | `Validated` | `IdentityRuntimeConfigShell::validated(...)` | config loader / runtime bootstrap | profile,evidence,binding refs,adapter mode refs present;issue refs empty | validation_state validated;issue empty | runtime builder may create `ConfigValidated` / `Assembled`;no adapter instantiation in shell | `ApplicationError::InvalidStateTransition` |
| validator | `Degraded` | `degraded(...)` | config loader / runtime bootstrap | safe config issue refs non-empty;no secret/raw config body | validation_state degraded;issue refs present | runtime builder may create `Degraded` if Step 14 allows;entry sees degraded runtime | `ApplicationError::InvalidStateTransition` |
| validator | `Invalid` | `invalid(...)` | config loader / runtime bootstrap | issue refs non-empty;missing/unsafe config evidence classified | validation_state invalid;issue refs present | runtime assembly must not become `Assembled`;entry pre-dispatch fails | `ApplicationError::InvalidStateTransition` |

Forbidden config handling:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| invalid config | create `Assembled` runtime | create `Failed` runtime or entry failure surface |
| degraded config | hide issues as `Validated` | preserve issue refs and expose degraded runtime if boot proceeds |
| config secret present | persist raw env/token/full config | persist body-free evidence/issue refs only |
| disabled adapter mode | treat as available success | map through adapter availability `Disabled` |
| route/binding missing | infer from URL/topic/job name string | return entry validation/runtime issue |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityConfigValidationStateKind::{Validated,Degraded,Invalid}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不新增 `Warning` / `Ready` |
| 触发函数是否存在 | 通过 | `validated/degraded/invalid/allows_entry/adapter_modes` |
| 前置条件字段是否闭合 | 通过 | profile、config evidence、binding refs、adapter mode refs、issue refs 均有 Step 6/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | config public error / entry mapping 后移 Step 12/14 |
| 副作用是否闭合 | 通过 | shell 不实例化 adapter、不写业务状态 |
| 测试切口是否可写 | 通过 | valid config;degraded visible;invalid no assembly;secret excluded;disabled adapter mode visible |

#### 7.14.2 `IdentityRuntimeAssemblyStateKind`

`IdentityRuntimeAssemblyStateKind` 是 runtime wiring lifecycle。它只表达 application facade / port graph / adapter availability refs 是否装配,不表达 adapter operation outcome。

```text
[IdentityRuntimeAssemblyState]
  factory -> NotStarted
  NotStarted -> ConfigValidated
  ConfigValidated -> Assembled
  ConfigValidated -> Degraded
  ConfigValidated -> Failed
  Degraded -> Assembled [only if later bootstrap resolves issues before entry use]
  Assembled -> Degraded
  Assembled / Degraded -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `NotStarted` | runtime bootstrap 尚未校验配置 | 否 | validate config |
| `ConfigValidated` | config shell 已通过或可用于下一步 assembly | 否 | assemble/degrade/fail |
| `Assembled` | facade/port graph 已装配,required adapter availability 已校验 | 否 | dispatch entry;later mark degraded/failed by runtime lifecycle |
| `Degraded` | runtime 可见降级,是否可 dispatch 按 Step 14 / `can_dispatch` | 否 | limited dispatch if allowed;recover to assembled;fail |
| `Failed` | runtime 不可 dispatch | 是 for this assembly | no entry dispatch |

| From | To | 触发函数 | Step 7/9/14 boundary | 前置条件 | 状态副作用 | Flow / entry 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `NotStarted` | `not_started(assembly_ref, profile_ref)` | runtime bootstrap start | assembly ref allocated;profile known | state not started;adapter refs empty | no entry dispatch yet | `ApplicationError::InvalidStateTransition` |
| `NotStarted` | `ConfigValidated` | `config_validated(config_shell)` | runtime builder after config validation | config shell `Validated` or Step 14 allowed degraded shell;invalid config excluded | state config validated;profile copied | continue adapter availability / port graph assembly | `ApplicationError::InvalidStateTransition` |
| `ConfigValidated` | `Assembled` | `assembled(config_shell, adapter_refs, assembled_at)` | runtime builder success | required adapter availability refs checked;application facade graph complete;issue refs empty or non-blocking per Step 14 | state assembled;assembled_at set;adapter refs copied | entry may attempt dispatch through guard | `ApplicationError::InvalidStateTransition` |
| `ConfigValidated` / `Assembled` | `Degraded` | `degraded(config_shell, adapter_refs, issue_refs, assembled_at)` | runtime builder partial / runtime issue | issue refs non-empty;degraded visible | state degraded;issue refs present | entry may dispatch only if guard/runtime policy permits;business still application-owned | `ApplicationError::InvalidStateTransition` |
| `ConfigValidated` / `Assembled` / `Degraded` | `Failed` | `failed(config_shell, issue_refs)` | runtime builder / runtime fatal issue | issue refs non-empty;no raw config/health body | state failed;dispatch disabled | entry returns pre-dispatch failure surface;no business result saved | `ApplicationError::InvalidStateTransition` |
| `Degraded` | `Assembled` | `assembled(...)` after recovery | runtime lifecycle recovery | issues resolved through formal runtime lifecycle;adapter refs checked | state assembled;issue cleared or superseded by safe marker | entry may attempt normal dispatch | `ApplicationError::InvalidStateTransition` |

Forbidden runtime handling:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| invalid config | `NotStarted -> Assembled` | fail before assembly |
| missing required adapter availability | mark `Assembled` | mark `Degraded` or `Failed` with issue refs |
| `Assembled` runtime | assume publisher/handoff delivered | application job/adapters still decide operation outcomes |
| `Failed` runtime | dispatch API/worker/job | return entry pre-dispatch failure |
| runtime issue body | store raw health check/stack trace | safe issue refs only |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityRuntimeAssemblyStateKind::{NotStarted,ConfigValidated,Assembled,Degraded,Failed}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不新增 `Ready` / `Healthy`;health belongs adapter availability/observability |
| 触发函数是否存在 | 通过 | `not_started/config_validated/assembled/degraded/failed/can_dispatch` |
| 前置条件字段是否闭合 | 通过 | config shell、adapter refs、issue refs、assembled_at、profile 均有 Step 6/7/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | public runtime unavailable mapping 后移 |
| 副作用是否闭合 | 通过 | runtime state only;entry guard reads it;no business mutation |
| 测试切口是否可写 | 通过 | not started;validated;assembled dispatch guard;degraded visible;failed no dispatch |

#### 7.14.3 `IdentityAdapterAvailabilityKind`

`IdentityAdapterAvailabilityKind` is a readiness marker for configured adapters. It is not external truth state and cannot be used to claim accepted, published, delivered, refreshed, or reconciled success.

```text
[IdentityAdapterAvailability]
  checker -> Available
  checker -> Degraded
  checker -> Unavailable
  checker -> Disabled
  Available -> Degraded / Unavailable / Disabled
  Degraded -> Available / Unavailable / Disabled
  Unavailable -> Available / Degraded / Disabled
  Disabled -> Available / Degraded / Unavailable only through formal config change
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Available` | adapter may be attempted by application-owned flow | 否 | operation attempt through formal port |
| `Degraded` | adapter available with visible issue/limitation | 否 | attempt if Step 14/flow allows;surface degraded issue |
| `Unavailable` | adapter dependency currently unavailable | 否 | no success fabrication;retry/recheck later |
| `Disabled` | adapter disabled by config/mode | stable until config change | no operation attempt;entry/application receives issue |

| From | To | 触发函数 | Step 7/14 boundary | 前置条件 | 状态副作用 | Flow / entry 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| checker | `Available` | `available(adapter_ref, mode, checked_at)` | adapter registry / availability resolver | mode not disabled;safe check passed | availability available;issue empty | application flow may attempt adapter via formal port | `ApplicationError::InvalidStateTransition` |
| checker / `Available` / `Unavailable` | `Degraded` | `degraded(adapter_ref, mode, issue_ref, checked_at)` | adapter registry / health summary | issue ref present;body-free | availability degraded;issue present | entry/application may surface degraded or limited attempt per Step 14 | `ApplicationError::InvalidStateTransition` |
| checker / `Available` / `Degraded` | `Unavailable` | `unavailable(adapter_ref, mode, issue_ref, checked_at)` | adapter registry / health summary | issue ref present;dependency unavailable classified | availability unavailable;issue present | operation cannot be treated as success;flow maps to degraded/rejected/issue state | `ApplicationError::InvalidStateTransition` |
| checker / any | `Disabled` | `disabled(adapter_ref, mode, issue_ref, checked_at)` | config mode disabled | mode expresses disabled;issue ref present | availability disabled;issue present | no adapter attempt;pre-dispatch or application issue surface | `ApplicationError::InvalidStateTransition` |
| `Disabled` | `Available` / `Degraded` / `Unavailable` | formal config reload + availability check | Step 14 config change | new mode no longer disabled;new evidence/issue refs | new availability record/state | future entry may use new runtime assembly | `ApplicationError::InvalidStateTransition` |

Forbidden adapter handling:

| Situation | Forbidden transition / operation | Correct handling |
|---|---|---|
| disabled adapter | return fake published/delivered/resolved | return disabled/unavailable issue surface |
| fake/controlled mode | infer external success from mode | return configured formal outcome only |
| availability available | skip application policy/state transition | application flow still owns business result |
| raw adapter failure | decide state by string/body | map to safe issue marker/formal outcome |
| endpoint URL | use as adapter identity | use `IdentityAdapterRef` |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityAdapterAvailabilityKind::{Available,Degraded,Unavailable,Disabled}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | 不新增 `Healthy` / `Down` / `Mocked` |
| 触发函数是否存在 | 通过 | `available/degraded/unavailable/disabled/allows_attempt/must_not_fake_success` |
| 前置条件字段是否闭合 | 通过 | adapter ref、mode ref、issue ref、checked_at 均有 Step 6/7/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | public degraded/unavailable mapping 后移 |
| 副作用是否闭合 | 通过 | availability marker only;no domain truth mutation |
| 测试切口是否可写 | 通过 | available attempt;degraded visible;unavailable no success;disabled no fake;config change re-enables |

#### 7.14.4 API entry validation and dispatch

API entry validation uses `IdentityEntryValidationKind`; dispatch uses shared `IdentityEntryDispatchKind`. Validation and dispatch are API boundary states only.

```text
[IdentityApiEntryValidation]
  validator -> Dispatchable
  validator -> RejectedAtEntry
  validator -> NotRoutable
  validator -> RuntimeUnavailable

[IdentityApiDispatchResult]
  Dispatchable + guard ok -> Dispatched
  RejectedAtEntry -> SkippedRejectedAtEntry
  RuntimeUnavailable -> SkippedRuntimeUnavailable
  guard/application boundary precheck failure -> FailedBeforeApplication
```

| Validation kind | Required source | Result | Forbidden handling |
|---|---|---|---|
| `Dispatchable` | route catalog matched;runtime dispatchable;surface kind valid;required markers present | may run dispatch guard and call facade | treat as command accepted/query visible |
| `RejectedAtEntry` | request marker/actor/metadata/idempotency/page validation issue | entry failure surface | save stored rejected command result unless Step 12/13 says application reached |
| `NotRoutable` | route catalog missing/disabled or surface mismatch | entry failure surface | infer operation from URL/method |
| `RuntimeUnavailable` | runtime `Failed` / not dispatchable / required adapter disabled before dispatch | entry runtime failure surface | write job report/consumer receipt/command result |

| Dispatch kind | Trigger | Required behavior | Forbidden handling |
|---|---|---|---|
| `Dispatched` | dispatch guard accepted application target and facade call was attempted | return application response/rejection/query surface as post-dispatch result | rewrite as accepted/visible by entry |
| `SkippedRejectedAtEntry` | validation `RejectedAtEntry` / `NotRoutable` | no facade call;no UoW;no stored result | application rejection/stored result |
| `SkippedRuntimeUnavailable` | validation `RuntimeUnavailable` | no facade call;entry runtime surface only | job failed report or consumer receipt |
| `FailedBeforeApplication` | dispatch target catalog/guard failed before facade call | safe issue refs;no business side effect | direct repository/adapter fallback |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityEntryValidationKind` and `IdentityEntryDispatchKind` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | API 不新增 `Unauthorized` state;public mapping Step 12 |
| 触发函数是否存在 | 通过 | `dispatchable/rejected_at_entry/runtime_unavailable/dispatched/failed_before_application` |
| 前置条件字段是否闭合 | 通过 | route ref、request marker、actor、metadata、runtime state、dispatch target 均有 Step 6/7/8/9/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | HTTP/status/public envelope 后移 |
| 副作用是否闭合 | 通过 | pre-dispatch no UoW/no stored result;post-dispatch application owns result |
| 测试切口是否可写 | 通过 | command route dispatchable;query route no mutation target;not routable;runtime unavailable;dispatch success != accepted |

#### 7.14.5 worker entry validation and dispatch

Worker entry validation uses `IdentityWorkerEntryValidationKind`; dispatch uses shared `IdentityEntryDispatchKind`. Ack/retry/dead-letter are transport decisions after Step 12 mapping,not identity business states.

```text
[IdentityWorkerEntryValidation]
  validator -> Dispatchable
  validator -> UnrecognizedBinding
  validator -> MissingDedupeKey
  validator -> InvalidEnvelopeMarker
  validator -> RuntimeUnavailable

[IdentityWorkerDispatchResult]
  Dispatchable + guard ok -> Dispatched
  invalid validation -> SkippedRejectedAtEntry
  RuntimeUnavailable -> SkippedRuntimeUnavailable
  guard failure -> FailedBeforeApplication
```

| Validation kind | Required source | Result | Forbidden handling |
|---|---|---|---|
| `Dispatchable` | binding catalog matched;envelope marker valid;source event/dedupe key present;runtime dispatchable | may call facade consumer/callback target | ack as accepted before receipt |
| `UnrecognizedBinding` | binding catalog cannot map envelope to known consumer/callback | entry failure / Step 12 ack policy | parse payload to guess flow |
| `MissingDedupeKey` | dedupe material absent | entry failure / retry/dead-letter policy | hash payload body to invent key |
| `InvalidEnvelopeMarker` | envelope marker invalid/unsafe | entry failure;body not persisted | store invalid payload for business replay |
| `RuntimeUnavailable` | runtime not dispatchable | pre-dispatch runtime failure | create consumer receipt/job report |

| Dispatch kind | Trigger | Required behavior | Forbidden handling |
|---|---|---|---|
| `Dispatched` | guard accepted application consumer/callback target and facade call was attempted | application returns receipt/replay/rejection surface | dispatch result treated as consumer receipt |
| `SkippedRejectedAtEntry` | unrecognized/missing/invalid validation | no facade call;safe issue refs only | direct reference/handoff repo update |
| `SkippedRuntimeUnavailable` | runtime unavailable | no facade call;worker delivery mapping later | business accepted/noop receipt |
| `FailedBeforeApplication` | target catalog/guard failure | no facade call;safe issue refs | route to resolver/adapter directly |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityWorkerEntryValidationKind::{Dispatchable,UnrecognizedBinding,MissingDedupeKey,InvalidEnvelopeMarker,RuntimeUnavailable}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | ack/retry/dead-letter 不写成 identity validation state |
| 触发函数是否存在 | 通过 | `dispatchable/unrecognized_binding/missing_dedupe_key/invalid_envelope_marker/dispatched` |
| 前置条件字段是否闭合 | 通过 | binding、envelope marker、source event ref、dedupe key、runtime state、dispatch target 均有 Step 6/7/8/9/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | ack/retry/dead-letter and public worker surface 后移 |
| 副作用是否闭合 | 通过 | pre-dispatch no repository write;post-dispatch application owns receipt |
| 测试切口是否可写 | 通过 | recognized dispatch;unrecognized binding;missing dedupe no payload hash;invalid envelope body-free;runtime unavailable |

#### 7.14.6 job entry validation and dispatch

Job entry validation uses `IdentityJobEntryValidationKind`; dispatch uses shared `IdentityEntryDispatchKind`. Job dispatch result is not `IdentityJobRunReport`.

```text
[IdentityJobEntryValidation]
  validator -> Dispatchable
  validator -> UnknownJob
  validator -> InvalidScope
  validator -> InvalidCursor
  validator -> MissingIdempotencyKey
  validator -> RuntimeUnavailable

[IdentityJobDispatchResult]
  Dispatchable + guard ok -> Dispatched
  invalid validation -> SkippedRejectedAtEntry
  RuntimeUnavailable -> SkippedRuntimeUnavailable
  guard failure -> FailedBeforeApplication
```

| Validation kind | Required source | Result | Forbidden handling |
|---|---|---|---|
| `Dispatchable` | job catalog known;scope marker valid;cursor valid if present;key present;runtime dispatchable | may call facade job target | mark job succeeded before report |
| `UnknownJob` | job name absent from formal catalog | entry failure | run fallback script or infer from binary name |
| `InvalidScope` | scope marker invalid/unsafe | entry failure | scan all store as fallback |
| `InvalidCursor` | cursor marker invalid/incompatible | entry failure | full scan fallback unless Step 9/14 explicitly permits |
| `MissingIdempotencyKey` | job idempotency key absent | entry failure | use job_run_ref/timestamp/cursor as key |
| `RuntimeUnavailable` | runtime not dispatchable | pre-dispatch runtime failure | save failed job report |

| Dispatch kind | Trigger | Required behavior | Forbidden handling |
|---|---|---|---|
| `Dispatched` | guard accepted application job target and facade call was attempted | application job service returns report/replay surface | dispatch success -> `Succeeded` report |
| `SkippedRejectedAtEntry` | unknown/invalid/missing validation | no facade call;safe issue refs only | save stored job report |
| `SkippedRuntimeUnavailable` | runtime unavailable | no facade call;entry runtime issue only | create failed report |
| `FailedBeforeApplication` | target catalog/guard failure | no facade call;safe issue refs | job runner direct repo scan |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityJobEntryValidationKind::{Dispatchable,UnknownJob,InvalidScope,InvalidCursor,MissingIdempotencyKey,RuntimeUnavailable}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | job report `Succeeded/Failed/...` 不混入 entry validation |
| 触发函数是否存在 | 通过 | `dispatchable/unknown_job/invalid_scope/invalid_cursor/missing_idempotency_key/dispatched` |
| 前置条件字段是否闭合 | 通过 | job name、run ref、metadata、scope marker、cursor、idempotency key、target catalog 均有 Step 6/7/8/9/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | public job entry error / process exit mapping 后移 |
| 副作用是否闭合 | 通过 | entry no job report write;application job service owns report |
| 测试切口是否可写 | 通过 | dispatchable job;unknown job;invalid scope no scan;invalid cursor no fallback;missing key;dispatch success != job succeeded |

#### 7.14.7 `IdentityEntryDispatchGuard` / surface target matrix

`IdentityEntryDispatchGuard` prevents entry modules from targeting repositories/adapters/stores. It validates surface kind, runtime state and target compatibility;it does not run domain policy or visibility policy.

| Surface kind | Allowed target | Forbidden target | Required result when invalid |
|---|---|---|---|
| `ApiCommand` | application command service target | query service,repository,UoW,publisher,handoff adapter | `FailedBeforeApplication` or validation failure |
| `ApiQuery` | application query service target | command mutation target,projection repo direct target | `FailedBeforeApplication`;query no-write preserved |
| `WorkerConsumer` | application inbound consumer service target | resolver/reference repo direct target | `FailedBeforeApplication`;no receipt |
| `WorkerCallback` | application callback service target | handoff repo/delivery adapter direct target | `FailedBeforeApplication`;no callback receipt |
| `OperationsJob` | application job service target | projection/outbox/handoff/report repository direct target | `FailedBeforeApplication`;no job report |

Runtime dispatchability matrix:

| Runtime state | Dispatch guard result |
|---|---|
| `NotStarted` | not dispatchable;entry failure |
| `ConfigValidated` | not dispatchable until assembled/degraded policy allows |
| `Assembled` | dispatchable if target and surface match |
| `Degraded` | dispatchable only when `can_dispatch(surface_kind)` / Step 14 permits;must expose issue |
| `Failed` | not dispatchable |

Forbidden cross-boundary behavior:

| Situation | Forbidden operation | Correct handling |
|---|---|---|
| route target points repository | call repository directly | guard failure before application |
| worker binding points resolver | call resolver directly | guard failure before application |
| job target points publisher/outbox repo | publish/retry in runner | guard failure;application job service only |
| dispatch succeeds | mark business accepted/succeeded | wait for application result |
| pre-dispatch failure | save stored result/report/receipt | entry surface only;no business side effect |

| 停审项 | 结论 | 说明 |
|---|---|---|
| enum 是否存在 | 通过 | `IdentityEntrySurfaceKind::{ApiCommand,ApiQuery,WorkerConsumer,WorkerCallback,OperationsJob}` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | dispatch guard 不新增业务 state |
| 触发函数是否存在 | 通过 | `for_api/for_worker/for_job/assert_application_dispatch_only/assert_runtime_dispatchable/assert_surface_target_matches` |
| 前置条件字段是否闭合 | 通过 | surface kind、target ref、runtime state、adapter refs 均有 Step 6/7/9/14 来源 |
| 非法转换错误是否有 Step 12 承接 | 通过 | public handler/worker/job mapping 后移 |
| 副作用是否闭合 | 通过 | guard only;no repository/adapter/UoW |
| 测试切口是否可写 | 通过 | application target allowed;repo target rejected;query target mismatch;runtime failed;degraded issue visible |

#### 7.14.8 10.7 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 10.7 范围 | 通过 | 只覆盖 runtime/config/adapter/API/worker/job entry technical states |
| 是否回指 Step 6/7/8/9 | 通过 | enum/object 来自 Step 6;facade/catalog/adapter ports 来自 Step 7;protocol shell 来自 Step 8;dispatch discipline 来自 Step 9 |
| config valid 是否与业务 invariant 分离 | 已闭合 | config 不放宽 domain/application 红线 |
| runtime assembled 是否与 adapter healthy 分离 | 已闭合 | `Assembled` 只表示 wiring ready |
| adapter availability 是否不伪造业务成功 | 已闭合 | disabled/fake/controlled 不得伪造 accepted/published/delivered |
| entry validation 是否不等于 application rejection | 已闭合 | pre-dispatch failure 不保存 stored result/report/receipt |
| dispatch success 是否不等于 business success | 已闭合 | `Dispatched` 只说明 facade call attempted |
| worker ack/retry/dead-letter 是否保持后移 | 已闭合 | Step 12/14/16 承接 transport mapping |
| job dispatch 是否不写 job report | 已闭合 | application job service owns `IdentityJobRunReport` |
| 是否越过 Step 12/14/16 | 未越过 | public status、ack/retry/dead-letter、config schema、tests 后移 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.15 10.8 cross-state audit and downstream handoff

本批不新增状态机、不新增状态名、不新增 transition helper。它只审计 10.1~10.7 已写入状态矩阵之间是否存在跨对象语义冲突,并把 Step 11~16 必须继续闭合的 persistence、error、idempotency、config、observability、test cut 要求列为承接清单。

当前 `projects/L1-identity/design-calibration/` 尚未生成 Step 11~16 DDD calibration 文件。因此本节只从 Step 6/7/8/9/10 已闭口材料给出后续承接要求,不声称 Step 11~16 已完成。

#### 7.15.1 cross-state naming audit

| 同名 / 近似状态 | 出现位置 | 审计结论 | 禁止混用 |
|---|---|---|---|
| `Stale` | role summary、memory reference、projection、reference、read surface | 都表示已知过期或需刷新,但 owner 不同 | 不得用 role/source stale helper 更新 projection/reference state |
| `Unavailable` | source snapshot、reference、adapter availability、read degraded surface | 都表示依赖不可用或材料不可用,但持久对象不同 | adapter unavailable 不得直接改 business truth |
| `Failed` | projection rebuild、reference refresh、reconciliation report、outbox、handoff、job report、runtime assembly | failure 必须由对应 owner 写入 safe issue marker | job failed 不得回写 lifecycle/role/career/memory truth |
| `RetryableFailed` | outbox、handoff、job report | 只适用于 propagation / job report outcome | 不得用于 core identity truth 或 source truth |
| `Pending*` | pending review、pending verification、rebuild pending、pending reconciliation、pending publish、pending handoff | pending 含义由状态主语限定 | query pending/degraded surface 不得变成 accepted truth |
| `Published` | outbox | 只表示 outbound boundary success | 不代表 downstream consumer accepted |
| `Delivered` | handoff | 必须有 attempt + receipt marker | 不代表 memory/archive truth 自动更新 |
| `Completed` | idempotency | 只表示 replay surface 已保存 | 不代表 command/job business success without stored kind/report |
| `Dispatched` | API/worker/job entry dispatch | 只表示 facade call attempted | 不代表 accepted、visible、receipt 或 job succeeded |
| `Assembled` | runtime assembly | 只表示 wiring ready | 不代表 adapter healthy or published/delivered success |

审计结论:同名/近似状态均已绑定到具体 owner。Step 10 不需要 `IdentityGlobalState` 或统一 global lifecycle table。

#### 7.15.2 trigger owner audit

| Trigger owner | 可推进的状态 | 不得推进的状态 |
|---|---|---|
| domain factory / member method / policy | member anchor、lifecycle、role summary、career record、memory reference、handoff/outbox state value construction | trace/audit/outbox persistence、stored result、job report、runtime state |
| application command service | accepted truth transition orchestration、trace/audit/outbox/stale/effect/stored result/idempotency complete | query state mutation、runtime assembly、adapter availability |
| application query service | read / visibility / degraded / missing / empty / stale-visible surface | any truth/projection/reference/outbox/handoff/stored result mutation |
| consumer / callback service | identity-owned snapshot/state/append/handoff marker update and typed receipt replay | external truth ownership、raw payload persistence |
| operations job service | projection/reference/report/outbox/handoff/job report state | core identity truth repair |
| API / worker / job entry | entry context、validation、dispatch result | repository/UoW/stored result/job report/business truth |
| runtime builder / adapter registry | config validation、runtime assembly、adapter availability | application accepted/rejected, published, delivered |
| fake / durable adapter | implement formal port state outcomes | private state map, default success, ref string inference |

审计结论:每个状态迁移都有唯一 owner;跨 owner 的副作用必须通过 Step 9 flow 和 Step 7 port surface,不能由 repository 或 entry 层自动迁移。

#### 7.15.3 terminal / reopen audit

| State family | Terminal / quasi-terminal rule | Reopen rule |
|---|---|---|
| anchor/lifecycle | `TombstoneHeld` terminal;`Retired -> Tombstoned` 是唯一 terminal upgrade | no reuse of member ref;new member requires new ref |
| role/career/memory truth | superseded/correction/archive/handoff relation states are owner-specific | reopening requires formal command/event flow,not query/job |
| source/reference | unavailable/unrecognized/failed may recover only through formal resolver/refresh and same bundle/version rules | no default safe summary |
| reconciliation report | saved report is report-only observation | later run creates new report,does not mutate old report to repair |
| outbox | `Published`,`Failed`,`SkippedByPolicy` terminal for current record | retry only `RetryableFailed`;new publication requires formal new record or future operation |
| handoff | `Delivered`,`Failed`,`Cancelled` terminal for current intent | retry only `RetryableFailed`;new attempt after terminal requires formal new intent/operation |
| idempotency | `Completed`,`RejectedStored`,`Conflict`,`Expired` terminal for current key record | same key/digest replays;different digest conflicts;expiry behavior Step 13/14 |
| job report | saved report outcome is replay material | later job run creates new report |
| runtime assembly | `Failed` not dispatchable for current assembly | recovery requires formal runtime rebuild/new assembly state |
| entry dispatch | dispatch result is per entry attempt | later request/event/job creates new entry/dispatch ref |

审计结论:除 10.1 明确的 `Retired -> Tombstoned` 和 10.4/10.7 明确的 recovery paths 外,terminal state 不直接 reopen。

#### 7.15.4 forbidden transition summary

| Forbidden category | Forbidden operation | Correct handling |
|---|---|---|
| query write | query creates/updates truth,projection,reference,report,outbox,handoff,idempotency,stored result | query returns read surface only |
| job truth repair | maintenance job updates member/lifecycle/role/career/memory truth | job writes projection/reference/report/outbox/handoff/job report only |
| side effect failure rollback | publish/handoff/adapter failure rolls back accepted truth | record propagation/handoff/job issue;accepted truth remains |
| Published overreach | `Published` treated as downstream consumed | `Published` means outbound boundary success only |
| Delivered fake success | request sent / HTTP 2xx / adapter ok marks delivered without receipt | require formal attempt + receipt marker |
| duplicate rerun | duplicate command/consumer/callback/job reruns mutation/job body | load stored result/typed receipt/job report |
| stored result missing recovery | replay path rebuilds response from current truth/store scan | return Step 12/13 replay error;no rerun |
| entry pre-dispatch business result | route/runtime/target failure saves rejected command result/receipt/job report | entry failure surface only |
| dispatch success as business success | `Dispatched` mapped to accepted/visible/receipt/succeeded | application result decides |
| adapter fake success | disabled/fake/controlled adapter returns accepted/published/delivered by default | return configured formal outcome or issue |
| ref/string inference | derive state/scope/subject/view/adapter identity from opaque string | use formal mapper/lookup/catalog |
| body persistence | store raw request/event/job/config/external/receipt/log/secret body in state/report | store body-free marker/issue refs only |

#### 7.15.5 version / cursor / key separation audit

| Concept | Formal source | Must not substitute |
|---|---|---|
| truth cursor | accepted truth cursor assigner / UoW | timestamp,version,idempotency key,job cursor |
| projection cursor | projection source cursor / stale marker | truth cursor,page cursor,timestamp |
| reference expected version | loaded `ExternalReferenceRef` bundle `IdentityVersion` | source version,business source ref,safe summary ref |
| source version | external resolver/source marker | optimistic version or truth cursor |
| job cursor | job request/report cursor | page cursor,timestamp,idempotency key |
| idempotency key | operation metadata / event/job dedupe material | source event ref,job_run_ref,cursor,timestamp |
| request digest | canonical request/event/job marker digest | raw body hash unless Step 13 defines canonicalization |
| dispatch target | dispatch target catalog | route string,topic string,job binary name |

审计结论:10.1~10.7 均未授权 cross-substitution。Step 11/13/14 必须继续保持这些字段的 durable schema 和 conflict semantics 分离。

#### 7.15.6 query / job / entry no-side-effect audit

| Surface | Allowed output | Forbidden side effect |
|---|---|---|
| query | visible/redacted/not-visible/degraded/stale-visible/missing/empty/page surface | UoW,idempotency,stored result,trace/audit append,projection rebuild,reference refresh,outbox publish,handoff deliver |
| maintenance job | projection/reference/report/outbox/handoff state and job report | core truth repair,external truth repair,current truth payload rebuild |
| publish job | outbox state + job report | accepted truth rollback,downstream consumed truth |
| handoff job/callback | handoff state + receipt/issue marker + receipt replay | receipt body persistence,delivered without receipt |
| API entry | entry validation/dispatch surface and application response mapping | repository/UoW/stored result direct call |
| worker entry | entry validation/dispatch surface and application receipt mapping | ack as business accepted,dead-letter as consumer receipt |
| job entry | entry validation/dispatch surface and application job report mapping | runner scans store or writes job report directly |

审计结论:all no-write/no-repair/no-direct-dispatch boundaries remain consistent with Step 9.

#### 7.15.7 downstream handoff to Step 11~16

| Downstream Step | Must carry from Step 10 | Must not introduce |
|---|---|---|
| Step 11 persistence / transaction consistency | versioned read/save for every mutable state;atomic order for accepted truth + trace/audit/outbox/stale/effect/stored result/idempotency;stored report/receipt persistence;terminal state indexes;query read-only persistence paths | hidden read-on-save,query-side rebuild,source version as optimistic version,private fake maps |
| Step 12 error / recovery | invalid transition public mapping;not visible vs missing/empty/degraded priority;entry pre-dispatch failure mapping;adapter unavailable/degraded mapping;stored replay missing/wrong-kind error;forbidden body issue mapping | mapping entry failure as application accepted/rejected without application boundary;raw diagnostic/body in errors |
| Step 13 concurrency / idempotency | same key/same digest replay;different digest conflict;in-flight policy;stored result/typed receipt/job report replay;no rerun;expiry semantics | duplicate mutation rerun,receipt/report reconstruction from current store,idempotency key substituted by cursor/ref |
| Step 14 configuration / deployment | runtime config schema;adapter mode/availability binding;route/binding/job target catalog;retry/backoff;worker ack/retry/dead-letter binding;disabled adapter behavior | config that changes domain invariant,disabled/fake success,route/target direct repository binding |
| Step 15 observability / audit | safe issue markers,trace/audit/entry/runtime/job metrics;body-free diagnostics;state transition observability | raw request/event/config/adapter/receipt/log body persistence |
| Step 16 tests | targeted tests for every state transition,forbidden transition,fake/durable parity,query no-write,job no-repair,duplicate replay,no fake delivered/published,entry dispatch boundaries | tests that use private fake store paths or bypass facade/dispatch catalog |

Note:because Step 11~16 identity DDD calibration files do not yet exist, this table is a required handoff list,not a completed downstream verification result.

#### 7.15.8 remaining open item decisions

| Open item family | Step 10 decision | Downstream owner |
|---|---|---|
| all DDD-S10-OPEN-001~012 | closed at state-matrix level | Step 12/13/14/16 still own public mapping,concurrency,config,test detail |
| invalid transition error enum | placeholder only | Step 12 |
| durable version/index/schema | not defined here | Step 11 |
| duplicate conflict/in-flight/expiry priority | state invariant fixed,no public priority | Step 13 |
| retry/backoff schedule | retryable states identified,no schedule | Step 14 |
| handler/worker/job public status | entry/result boundary fixed,no status | Step 12/16 |
| formal document assembly | not done here | Step 19 / formal `03` assembly |

#### 7.15.9 10.8 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否新增状态 enum | 未新增 | 只做 cross-state audit |
| 是否新增 transition helper | 未新增 | trigger/helper 缺口仍需回 Step 6/7/9 |
| 是否完成 naming audit | 通过 | 同名/近似状态均绑定 owner |
| 是否完成 trigger owner audit | 通过 | domain/application/query/job/entry/runtime/fake owner 分离 |
| 是否完成 terminal/reopen audit | 通过 | terminal reopen 只允许已明示 recovery path |
| 是否完成 forbidden transition summary | 通过 | query write、job repair、fake success、duplicate rerun、body persistence 等均列明 |
| 是否完成 Step 11~16 handoff | 通过 | 以 required handoff 形式列出;未伪造后续 Step 已完成 |
| 是否保留正式 `03` 回填边界 | 通过 | 正式文档仍留 Step 19 |

---

## 8. 复杂度判断

Step 10 不能一次性写完。identity 的状态主语虽然少于 governance,但跨越 truth、source summary、query/read surface、projection/reference/report、outbox/handoff、stored replay、runtime/adapter/entry 七类状态边界。如果一次性写全,容易在 terminal reopen、source pending、query degraded、job no-repair、Published vs Delivered、entry valid vs accepted 等地方掺入未闭合口径。

因此 Step 10 采用 `10.0~10.8` 批次。每批写完后停审,不得在未审核时继续扩到下一个状态族。

---

## 9. 回填草稿

正式 `03-详细设计.md` 第 9 章后续可按下列结构装配:

```md
## 9. 状态机与转换矩阵

本章定义 L1-identity 的正式状态集合、转换矩阵、非法转换占位错误和跨状态副作用边界。状态名必须来自第 5/6 章对象契约中的 enum / state value;状态迁移必须回指第 8 章 function flow 和第 6/7 章对象函数或 repository marker update。

### 9.1 Member / lifecycle truth states
### 9.2 Role / career / memory truth and source states
### 9.3 Read / visibility / trace surface states
### 9.4 Projection / reference / reconciliation states
### 9.5 Outbox / handoff propagation states
### 9.6 Application support states
### 9.7 Runtime / adapter / entry states
### 9.8 Cross-state forbidden transition and handoff audit
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

---

## 10. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S10-OPEN-001 | `Retired` 是否允许后续进入 `Tombstoned`,以及 anchor 是否从 `RetiredHeld` 进入 `TombstoneHeld` | 10.1 | 已闭合:`Retired -> Tombstoned` 是唯一 terminal upgrade;anchor 同步 `RetiredHeld -> TombstoneHeld` |
| DDD-S10-OPEN-002 | high-risk lifecycle action 的正式集合和 missing/invalid/unavailable basis disposition | 10.1 / Step 12 / Step 14 | 10.1 已闭合 state precheck:High/Critical require valid basis,Low/Medium no basis;public mapping 留 Step 12,config binding 留 Step 14 |
| DDD-S10-OPEN-003 | source unavailable / missing evidence / missing safe summary 是 rejected、pending source 还是 degraded read | 10.2 / Step 12 | 10.2 已闭合 state 去向:role active 只接受 resolved+version+safe summary+evidence;non-active 不写 active summary;Step 12 固化 public mapping |
| DDD-S10-OPEN-004 | `CareerRecord::SourcePendingReview` 和 source duplicate 的状态 / no-op 边界 | 10.2 / Step 13 | 10.2 已闭合:只有显式 pending intent 可持久化 `SourcePendingReview`;source duplicate 不新增 record,public no-op/conflict/replay priority 后移 Step 13 |
| DDD-S10-OPEN-005 | `MemoryReferenceState::PendingVerification` 与 archive handoff marker 的 precise transition | 10.2 / Step 12 / Step 14 | 10.2 已闭合:pending verification 需要显式 intent/target 和 formal marker;archive/handoff relation state 只保存 marker,receipt/config 细节后移 |
| DDD-S10-OPEN-006 | query `NotVisible` / `Missing` / `Empty` / `Degraded` / `StaleVisible` 的跨 query 优先级 | 10.3 / Step 12 / Step 16 | 10.3 已闭合 read/public surface priority;字段级 redaction、HTTP/status 和 public envelope 细节后移 Step 12/16 |
| DDD-S10-OPEN-007 | `ProjectionStateKind::Rebuilt` 是否自动折叠为 `Fresh` | 10.4 | 已闭合:`Rebuilt` 不自动折叠为 `Fresh`;它是 rebuild success state,read fresh-equivalent 由 assembler 判断 |
| DDD-S10-OPEN-008 | `ReferenceResolutionStateKind::Unrecognized` 是否允许同一 bundle 后续恢复为 `Resolved` | 10.4 / Step 11 | 已闭合:允许同一 bundle / 同 owner 在 formal resolver 后续识别成功后恢复为 `Resolved`;Step 11 固化 durable version/index semantics |
| DDD-S10-OPEN-009 | outbox retryable vs terminal failed,以及 failed 是否可由 retry job 改回 pending | 10.5 / Step 12 / Step 14 | 已闭合:only `RetryableFailed` 可由 retry job 重试;`Failed` 和 `SkippedByPolicy` 终态,不会改回 pending;retry schedule 留 Step 14 |
| DDD-S10-OPEN-010 | handoff failed/cancelled/retryable 的 terminal/retry boundary | 10.5 / Step 14 | 已闭合:only `RetryableFailed` 可 retry;`Failed`/`Cancelled`/`Delivered` 终态;failed requires attempt,cancelled covers pre-attempt policy/unsupported target |
| DDD-S10-OPEN-011 | completed/rejected stored idempotency 缺 stored result 时的状态和错误 | 10.6 / Step 13 | 已闭合:`Completed` / `RejectedStored` 必须有 `IdentityStoredResultRef`;stored result missing/wrong-kind 的 public replay behavior 留 Step 13 |
| DDD-S10-OPEN-012 | entry validation/dispatch state 到 API/worker/job public surface 的映射 | 10.7 / Step 12 / Step 16 | 已闭合 technical boundary:entry validation/dispatch 不等于 application result;Step 12/16 固化 public handler/test mapping |

---

## 11. 进入下一批条件

进入 DDD Step 11 前必须满足:

- 用户审核通过 Step 10 state matrix。
- Step 11 只写 persistence / transaction consistency,不得新增 Step 6 之外的状态名或 Step 10 未允许的 transition。
- Step 11 必须承接 10.8 的 version/cursor/key separation、query no-write、job no-repair、stored replay persistence、terminal state indexes、fake/durable parity。
- Step 11 不定义最终 public error/status、retry/backoff、config schema、handler test matrix;这些继续由 Step 12/14/16 承接。
- 若 Step 11 发现需要新的 versioned read/save/index/stored payload/receipt/report surface,必须回 Step 6/7/8/9/10 修正文档,不得由 persistence 私补 schema。
