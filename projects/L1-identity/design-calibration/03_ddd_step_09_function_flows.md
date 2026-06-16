# Step 9. 逐接口定义函数级处理流

> 对应正式文档章节: `03-详细设计.md` 第 8 章 逐接口函数级处理流
> 当前状态: Step 9 已完成并已审核通过;已进入 Step 10 state matrix
> 本文件性质: 详细设计 Step 9 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只在当前批次写当前批次内容;不得提前生成后续 Step 文件;不得直接修改正式 `03-详细设计.md`

---

## 1. Step 状态 + Step 内计划

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 9 function flows |
| 当前批次 | 9.6 cross-flow audit |
| 当前结论 | Step 9 已完成并已审核通过;command/query/consumer/callback/outbound/job 的事务、stored replay、visibility、projection/reference、outbox/handoff、body-free 和后续 Step handoff 均已收口 |
| 本批是否写逐接口详细调用图 | 否。本批只做跨 flow 审计;逐接口调用图已在 9.1~9.5 完成并回指 Step 6 object/state/policy、Step 7 port/helper 和 Step 8 DTO/report surface |
| 下一批 | Step 10 state matrix |
| 停审要求 | 已满足;若 Step 10 审核发现新 schema/port/state 缺口,先回 Step 6/7/8/9 闭口 |

### 1.2 Step 9 总体目标

Step 9 的目标是把 Step 8 已闭口的 public protocol surface 下沉为可实现的函数级处理流。每条 flow 必须从 Step 8 对应 DTO 出发,回指 Step 6 object / state / policy 和 Step 7 port / helper,并明确 transaction、idempotency、visibility、stored replay、trace/audit/outbox/projection/job report 等关键顺序。

本 Step 覆盖:

- 6 个 Command flow。
- 14 个 Query flow。
- 5 个 Inbound Event Consumer / Callback flow。
- 10 个 Outbound Event accepted material,统一承接到 `PublishIdentityOutboxFlow`,不拆成 10 条独立 publish flow。
- 6 个 Operations Job flow。

本 Step 不定义完整状态矩阵、DDL、错误全集、幂等矩阵、config binding、observability 指标或测试实现。这些分别由 Step 10~16 承接。

### 1.3 Step 9 分批计划

| 批次 | 主题 | 输出 | 停审重点 | 状态 |
|---|---|---|---|---|
| 9.0 | framework / batch plan / redlines | Step 9 框架、flow 总表、共享模板、红线 | 是否承接 Step 6/7/8,是否保持 governance 粒度 | 已审核通过 |
| 9.1-a | member / lifecycle commands | `EstablishGlobalMemberFlow`, `UpdateGlobalLifecycleStateFlow` | lifecycle terminal side effect、accepted cursor、trace/outbox/stale/result | 已审核通过 |
| 9.1-b | role / career / memory commands | `MaintainRoleCapabilitySummaryFlow`, `AppendCareerRecordFlow`, `MaintainMemoryReferenceFlow` | source/reference bundle、append-only、pending/rejected priority | 已审核通过 |
| 9.1-c | handoff command | `PrepareTraceHandoffFlow` | visibility/material guard、handoff intent state、no delivery | 已审核通过 |
| 9.2-a | core truth queries | anchor/lifecycle/role/career/memory query flows | visibility precheck、stable read、no write | 已审核通过 |
| 9.2-b | trace / audit / summary queries | member summary、trace、audit query flows | redaction、page priority、partial missing/degraded | 已审核通过 |
| 9.2-c | maintenance / outbox / handoff queries | projection/reference/report/outbox/handoff query flows | stable lookup、report-only、outbox/handoff no side effect | 已审核通过 |
| 9.3 | inbound consumer / callback flows | 5 条 consumer/callback flow | stored receipt replay、unsupported/quarantine/delay、marker trace | 已审核通过 |
| 9.4 | outbound accepted material audit | 10 个 outbound payload material 的 accepted 来源和 publish 输入闭环 | accepted-only、payload marker、topic binding、不读 current truth 重构 | 已审核通过 |
| 9.5 | operations job flows | 6 条 job flow | stored job report replay、item refs、no truth repair、runner only facade | 已审核通过 |
| 9.6 | cross-flow audit | 事务、状态、outbox、projection、reference、stored replay 和 phase boundary 审计 | 是否存在 unresolved schema/port/state/phase 缺口 | 已审核通过 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | object、state、policy、factory/member method、invariant 来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | repository、resolver、publisher、handoff、UoW、idempotency、stored result、entry facade 来源 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | command/query/event/job DTO、response/receipt/report surface 和 Step 9 flow name 来源 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 处理流所属业务组成部分、no-write/no-repair 边界和概要图输入 |
| `standards/document/详细设计讨论流程_SOP.md` | 当前标准 | Step 9 必须逐接口、按类别/模块分批、ASCII flow、每条停审 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 当前标准 | 复核字段来源、port/状态闭环、stored replay、fake parity 和可落码性红线 |
| `L1-governance` Step 9 中间产物 | 参考 | 仅参考组织粒度和停审方式,不复制业务内容 |

---

## 3. SOP 问题回答

| SOP 问题 | 本轮回答 |
|---|---|
| 哪些协议必须拥有函数级处理流 | Step 8 中 6 Command、14 Query、5 Consumer/Callback、6 Job 必须有独立 flow;10 Outbound Event 作为 accepted material 在 9.4 审计,由 `PublishIdentityOutboxFlow` 统一发布 |
| 处理流如何分批 | 先 9.0 框架,再 command、query、consumer/callback、outbound material、job、cross-flow audit |
| 每个处理流的入口函数是什么 | 统一从 `IdentityApplicationFacade::dispatch_command/query/inbound_event/callback/job` 进入 application service;entry route/binding 留 Step 14 |
| 每个 flow 如何回指 Step 6 | 每条 flow 必须列出目标 object/state/policy/factory/member method;状态变化必须回指 Step 6 state enum,并作为 Step 10 候选迁移 |
| 每个 flow 如何回指 Step 7 | 每条 flow 必须列出使用的 repository/resolver/publisher/handoff/UoW/idempotency/stored result port;缺函数或返回面不足时暂停 |
| 每个 flow 如何回指 Step 8 | 每条 flow 使用 Step 8 固定的 Request/Payload/Result/View/Receipt/Report DTO 名称,不得引入同义协议名 |
| 构造目标对象字段缺失时如何处理 | 不能在 flow 中私补字段;记录 blocker,回 Step 6/7/8 对应批次闭口 |
| 事务在哪里开始和提交 | Command accepted、Consumer/Callback accepted、Job mutation path 必须通过 `IdentityUnitOfWorkManagerPort.begin()` 开事务;Query 不开启写事务 |
| Duplicate replay 如何处理 | Command/Consumer/Callback/Job 先 reserve idempotency;duplicate 只能读取 stored result/receipt/job report replay,不得重跑 mutation 或重扫 repository 反推结果 |
| Query 如何处理 visibility 和 degraded | Query 先经 `IdentityReadVisibilityRepository` 取得 access summary/visibility input,再读 truth/view/report;not visible/degraded/stale/missing 走 `IdentityQuerySurface`,不得 query miss repair |
| Outbound publish 如何处理 | Publisher 只能使用 saved outbox record、payload marker 和 topic binding;不得读取 current truth 重构 payload |
| Job 如何处理 | Job runner 只能 dispatch application job service;job duplicate replay 使用 stored job report surface with item refs;job 不修复 truth |
| 每条 flow 至少需要哪些测试切口 | accepted、rejected/not visible/degraded、duplicate replay、version/conflict、forbidden body、stable lookup/no-write/no-repair 由各批次逐条列出 |

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | Step 9 处理 |
|---|---|---|
| 旧 `03-详细设计.md` 的处理流早于新版 Step 6/7/8 | 旧 flow 名、对象名和状态口径可能与新版协议不一致 | 不继承旧 flow;只作为历史问题输入 |
| 概要 Step 8 是高层处理骨架 | 不能直接落码,缺完整 port、DTO、stored replay 和 transaction order | Step 9 按 DDD Step 6/7/8 下沉 |
| Step 8 留有若干 Step 9/10/12 待闭口项 | 若直接在 flow 中发明优先级,后续实现会出现 blocker | 逐批处理;发现无法回指 Step 6/7/8 时暂停 |
| Query 容易为了方便触发 rebuild/refresh | 违反 query no-write 和 projection/reference job 边界 | 9.2 固定 no-write,缺失/陈旧只通过 surface 表达 |
| Outbound publish 容易回读 current truth | 会破坏 accepted snapshot 和 duplicate replay | 9.4/9.5 固定 saved outbox + payload marker |
| Job runner 容易绕过 application 直连 store | 会绕过 idempotency、stored report 和可观测边界 | 9.5 固定 runner only facade |

---

## 5. 改动前后对比

| 维度 | Step 9.0 前 | Step 9.0 后 |
|---|---|---|
| Step 9 状态 | Step 8 已完成,Step 9 pending | Step 9 框架、批次和红线已落盘 |
| Flow 清单 | 分散在 Step 8 inventory 和 HLD flows | 汇总为 6 Command、14 Query、5 Consumer/Callback、10 Outbound material、6 Job |
| 批次粒度 | 尚未确定 | 对齐 governance 粒度,但按 identity 协议族和业务组成部分拆分 |
| 共享纪律 | 由 Step 8 entry condition 描述 | 写入 command/query/consumer/outbound/job shared discipline |
| 暂停规则 | Step 8 入口门禁 | 固定为 Step 9 redlines 和每批 stop-review |
| 正式 `03` | 不修改 | 仍不修改,留 Step 19 装配 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 一次性写完所有 flow | 不采用 | 会重复之前粒度过粗的问题,也难以逐条验证 Step 6/7/8 回指 |
| 只写一个通用 command/query/job 模板 | 不采用 | SOP 要求每个需要实现的协议入口独立 flow;通用模板只能作为共享纪律 |
| 先写 9.0 框架,审核后逐批展开 | 采用 | 与 governance Step 9 粒度一致,能在进入具体 flow 前先固定规则 |
| 10 个 outbound event 各自写 publish flow | 暂不采用 | Step 8 已明确它们都由 accepted material 进入 `PublishIdentityOutboxFlow`;9.4 做 material 审计即可 |
| 在 Step 9 补 Step 6/7/8 缺口 | 不采用 | 发现 schema/port/state/stored result/phase 缺口时必须暂停回写真相源 |

---

## 7. 结构化中间产物

### 7.1 Flow inventory

#### 7.1.1 Command flow inventory

| Flow | 协议 DTO | 目标 object / policy | 主要 Step 7 port family | 9.x 批次 | 状态 |
|---|---|---|---|---|---|
| `EstablishGlobalMemberFlow` | `EstablishGlobalMemberRequest` | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `GlobalLifecycleState` | member/lifecycle repo, id/clock, UoW, idempotency, stored result, trace/audit/outbox/projection | 9.1-a | 已写入 |
| `UpdateGlobalLifecycleStateFlow` | `UpdateGlobalLifecycleStateRequest` | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, optional `IdentityAnchorState` | member/lifecycle repo, governance basis resolver, id/clock, UoW, stored result, trace/audit/outbox/projection | 9.1-a | 已写入 |
| `MaintainRoleCapabilitySummaryFlow` | `MaintainRoleCapabilitySummaryRequest` | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | role repo, source/evidence resolver, reference repo, stored result, trace/audit/outbox/projection | 9.1-b | 已写入 |
| `AppendCareerRecordFlow` | `AppendCareerRecordRequest` | `CareerRecord`, `CareerAppendPolicy` | member/career repo, work source resolver, stored result, trace/audit/outbox/projection | 9.1-b | 已写入 |
| `MaintainMemoryReferenceFlow` | `MaintainMemoryReferenceRequest` | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` | member/memory repo, memory/archive resolver, reference repo, stored result, trace/audit/outbox/projection | 9.1-b | 已写入 |
| `PrepareTraceHandoffFlow` | `PrepareTraceHandoffRequest` | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | trace/audit/handoff repo, handoff target port, visibility/read ports, stored result, trace/projection | 9.1-c | 已写入 |

#### 7.1.2 Query flow inventory

| Flow | 协议 DTO | 读取对象 / view | 主要 Step 7 port family | 9.x 批次 | 状态 |
|---|---|---|---|---|---|
| `GetGlobalMemberAnchorFlow` | `GetGlobalMemberAnchorRequest` | `GlobalMember`, `IdentityAnchorState`, optional `MemberSummaryView` | read visibility, member repo, projection repo | 9.2-a | 已写入 |
| `GetGlobalLifecycleSummaryFlow` | `GetGlobalLifecycleSummaryRequest` | `GlobalLifecycleState`, `MemberSummaryView` | read visibility, lifecycle repo, projection repo | 9.2-a | 已写入 |
| `GetRoleCapabilitySummaryFlow` | `GetRoleCapabilitySummaryRequest` | `RoleCapabilitySummary`, source snapshot | read visibility, role repo, projection repo | 9.2-a | 已写入 |
| `ListCareerRecordsFlow` | `ListCareerRecordsRequest` | `CareerRecordView` page | read visibility, career repo, page mapper | 9.2-a | 已写入 |
| `ListMemoryReferencesFlow` | `ListMemoryReferencesRequest` | `MemoryReferenceView` page | read visibility, memory repo, page mapper | 9.2-a | 已写入 |
| `ReadMemberSummaryFlow` | `ReadMemberSummaryRequest` | `MemberSummaryView`, `ProjectionState` | read visibility, projection repo | 9.2-b | 已写入 |
| `ReadIdentityTraceFlow` | `ReadIdentityTraceRequest` | `IdentityTraceRecordView` page | read visibility, trace repo/history facade | 9.2-b | 已写入 |
| `ReadAuditTrailFlow` | `ReadAuditTrailRequest` | `AuditTrailEntryView` page | read visibility, audit repo/history facade | 9.2-b | 已写入 |
| `GetProjectionStateFlow` | `GetProjectionStateRequest` | `ProjectionStateView` | read visibility, projection repo | 9.2-c | 已写入 |
| `GetReferenceResolutionStateFlow` | `GetReferenceResolutionStateRequest` | `ReferenceResolutionStateView` | read visibility, reference state repo | 9.2-c | 已写入 |
| `ReadReconciliationReportFlow` | `ReadReconciliationReportRequest` | `ReconciliationReportView` page | read visibility, reconciliation report repo | 9.2-c | 已写入 |
| `ListPendingIdentityOutboxFlow` | `ListPendingIdentityOutboxRequest` | `IdentityOutboxRecordView` page | read visibility, outbox repo | 9.2-c | 已写入 |
| `GetIdentityOutboxStateFlow` | `GetIdentityOutboxStateRequest` | `IdentityOutboxStateView` | read visibility, outbox repo | 9.2-c | 已写入 |
| `GetTraceHandoffStateFlow` | `GetTraceHandoffStateRequest` | `TraceHandoffStateView` | read visibility, handoff intent repo | 9.2-c | 已写入 |

#### 7.1.3 Inbound event / callback flow inventory

| Flow | 协议 DTO | 写入对象 / marker | 主要 Step 7 port family | 9.x 批次 | 状态 |
|---|---|---|---|---|---|
| `HandleRoleCapabilitySourceChangedFlow` | `RoleCapabilitySourceChangedPayload` | `RoleCapabilitySourceSnapshot`, `ReferenceResolutionState` sidecar | role repo, reference repo, idempotency, typed stored receipt, marker/accepted trace, projection | 9.3 | 已写入 |
| `HandleWorkParticipationAcceptedFlow` | `WorkParticipationAcceptedPayload` | `CareerRecord` append | member/career repo, idempotency, typed stored receipt, trace/outbox/projection | 9.3 | 已写入 |
| `HandleMemoryReferenceSourceStateChangedFlow` | `MemoryReferenceSourceStateChangedPayload` | `MemoryReference`, `MemoryReferenceState`, reference sidecar | memory repo, reference repo, idempotency, typed stored receipt, trace/outbox/projection | 9.3 | 已写入 |
| `HandleArchiveHandoffResultFlow` | `ArchiveHandoffResultPayload` | `MemoryReference`, `MemoryReferenceState` | memory callback lookup, typed stored handoff callback receipt, idempotency, trace/outbox/projection | 9.3 | 已写入 |
| `HandleTraceHandoffResultFlow` | `TraceHandoffResultPayload` | `TraceHandoffIntent`, `HandoffState` | handoff intent repo, typed stored handoff callback receipt, idempotency, trace/outbox/projection | 9.3 | 已写入 |

#### 7.1.4 Outbound event material inventory

| Outbound material | Payload DTO | Accepted source | Publish flow | 9.x 批次 | 状态 |
|---|---|---|---|---|---|
| `GlobalMemberEstablished` | `GlobalMemberEstablishedPayload` | `EstablishGlobalMember` accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `IdentityAnchorChanged` | `IdentityAnchorChangedPayload` | anchor accepted side effect | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `GlobalLifecycleChanged` | `GlobalLifecycleChangedPayload` | `UpdateGlobalLifecycleState` accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `GlobalMemberAvailabilityChanged` | `GlobalMemberAvailabilityChangedPayload` | lifecycle availability accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `RoleCapabilitySummaryChanged` | `RoleCapabilitySummaryChangedPayload` | role/capability summary accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `RoleCapabilitySourceStateChanged` | `RoleCapabilitySourceStateChangedPayload` | role source snapshot/state accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `CareerRecordAppended` | `CareerRecordAppendedPayload` | career record append accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `CareerCorrectionAppended` | `CareerCorrectionAppendedPayload` | career correction append accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `MemoryReferenceChanged` | `MemoryReferenceChangedPayload` | memory relation/state accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |
| `MemoryArchiveHandoffStateChanged` | `MemoryArchiveHandoffStateChangedPayload` | memory/archive handoff state accepted | `PublishIdentityOutboxFlow` | 9.4 | 已写入 |

#### 7.1.5 Operations job flow inventory

| Flow | 协议 DTO | 写入对象 / report | 主要 Step 7 port family | 9.x 批次 | 状态 |
|---|---|---|---|---|---|
| `RebuildIdentityProjectionFlow` | `RebuildIdentityProjectionJobInput` | `ProjectionState`, projection view, job report | projection repo, maintenance repo, stored job report, idempotency | 9.5 | 已写入 |
| `RefreshExternalReferenceStateFlow` | `RefreshExternalReferenceStateJobInput` | `ReferenceResolutionState`, typed sidecar, job report | reference repo, external reference resolver, projection repo, stored job report | 9.5 | 已写入 |
| `RunIdentityReconciliationFlow` | `RunIdentityReconciliationJobInput` | `ReconciliationReport`, findings, job report | reconciliation report repo, maintenance repo, stored job report | 9.5 | 已写入 |
| `PublishIdentityOutboxFlow` | `PublishIdentityOutboxJobInput` | `IdentityOutboxRecord`, publish state, job report | outbox repo, topic binding, publisher, stored job report | 9.5 | 已写入 |
| `DeliverTraceHandoffFlow` | `DeliverTraceHandoffJobInput` | `TraceHandoffIntent`, handoff attempt/receipt marker, job report | handoff intent repo, handoff target/delivery ports, stored job report | 9.5 | 已写入 |
| `RetryIdentityPropagationFailuresFlow` | `RetryIdentityPropagationFailuresJobInput` | outbox/handoff retry state, job report | outbox repo, handoff repo, publisher/handoff ports, stored job report | 9.5 | 已写入 |

### 7.2 Shared command transaction discipline

Command flow 只能在具体 9.1 批次写完整步骤。本批先固定所有 command 必须遵守的相对顺序:

```text
[API entry]
  | map IdentityCommandRequest<T> to IdentityOperationContext
  | dispatch_command(...)
  v
[Application command service]
  | begin IdentityUnitOfWork
  | reserve idempotency with operation context + request digest
  | duplicate -> load stored command result/rejection and replay
  | conflict -> complete/return protocol conflict surface as Step 12/13 defines
  v
[Load / guard / domain transition]
  | load required truth/reference/snapshot with version
  | call Step 6 policy guard and factory/member method
  | never mutate fields outside domain object methods
  v
[Accepted side effects]
  | save changed truth with expected_version
  | assign accepted truth cursor through UoW
  | map accepted subject through IdentityTruthChangeSubjectMapper
  | append trace
  | append accepted audit entry through IdentityAcceptedAuditTrailMarkerMapper + IdentityAuditTrailRepository
  | build accepted outbox record + payload marker only when this flow has a canonical outbound payload
  | mark affected projections stale
  | save command effect summary and stored result
  | complete idempotency
  | commit
```

| Discipline | 正式来源 | 禁止事项 |
|---|---|---|
| idempotency | Step 7 `IdentityIdempotencyRepository.reserve(context, digest, uow)` | duplicate 重跑 command |
| expected_version | versioned read / create result / formal request version | 用 cursor、timestamp、source version、digest 替代 |
| cursor | `IdentityUnitOfWork.assign_truth_change_cursor()` | service、fake、repository 拼 cursor |
| subject | `IdentityTruthChangeSubjectMapper` | trace/audit/outbox 使用不同 canonical key |
| audit scope / visibility marker | `IdentityAcceptedAuditTrailMarkerMapper.accepted_command_audit_markers(context, subjects, change_kind_ref, cursor)` | accepted write path 调 query visibility resolver、使用默认 scope / 默认 visible、从 operation name/audit subject/trace id/timestamp 拼 marker |
| outbox | accepted material + payload marker when Step 8/9 defines a canonical outbound payload;otherwise effect outbox refs must be explicit empty | rejected/pending/report-only 冒充 accepted event;service 私造 outbound payload |
| stored result | `IdentityStoredResultRepository` | accepted path 只返回内存 result |

#### 7.2.1 Shared accepted audit append subflow

所有 accepted command / handoff prepare 写路径追加 audit material 时,必须使用同一子流程。该流程只 materialize body-free accepted audit entry,不执行 public read authorization,也不替代 query 的 `VisibilityPolicy::for_audit(...)`。

```text
[Accepted audit append]
  | audit_markers = IdentityAcceptedAuditTrailMarkerMapper.accepted_command_audit_markers(
  |   context,
  |   subjects,
  |   change_kind_ref,
  |   cursor
  | )
  | audit_entry = AuditTrailEntry {
  |   trace_record_ref,
  |   change_kind_ref,
  |   visibility_result_ref: audit_markers.entry_visibility_result_ref,
  |   occurred_at: trace.occurred_at
  | }
  | trail_v = IdentityAuditTrailRepository.find_audit_trail_by_subject(subjects.audit_subject_ref)
  | if trail_v Some:
  |   IdentityAuditTrailRepository.append_audit_entry(trail_v.object.audit_trail_ref, audit_entry, trail_v.version, uow)
  | else:
  |   audit_trail_ref = IdentityIdGeneratorPort.new_audit_trail_id() -> AuditTrailRef::from_id(...)
  |   trail = AuditTrail::from_accepted_write(
  |     audit_trail_ref,
  |     subjects.audit_subject_ref,
  |     member_ref_or_none,
  |     audit_markers.audit_scope_ref,
  |     audit_entry,
  |     audit_markers.trail_visibility_result_ref,
  |     now
  |   )
  |   require audit_markers.read_surface_kind == IdentityReadSurfaceKind::Found
  |   IdentityAuditTrailRepository.save_audit_trail(trail, None, uow)
```

| 字段 / 分支 | 正式来源 | 禁止事项 |
|---|---|---|
| `audit_scope_ref` | `IdentityAcceptedAuditTrailMarkerMapper` | query request scope、route、operation name、hard-coded scope |
| trail / entry `visibility_result_ref` | `IdentityAcceptedAuditTrailMarkerMapper` | read visibility resolver、default visible、query visibility result |
| existing trail version | `find_audit_trail_by_subject(...)` loaded version | repository implicit create、append without expected_version |
| missing trail id | `IdentityIdGeneratorPort.new_audit_trail_id()` | derive from audit subject / trace id / timestamp |
| member scope | current accepted flow loaded/request member ref when the accepted subject is member-scoped;otherwise `None` until a later flow defines a formal owner | parse audit subject string |

### 7.3 Shared query no-write discipline

Query flow 必须保持 read-only:

```text
[API entry]
  | map IdentityQueryRequest<T> to IdentityOperationContext
  | dispatch_query(...)
  v
[Application query service]
  | resolve read visibility input
  | evaluate visibility / degraded marker
  | if not visible -> return body-free not visible surface
  v
[Read repository]
  | read truth/view/reference/report/outbox/handoff state
  | map to public view/page/surface
  | no write transaction
```

| Query path | 允许读取 | 禁止写入 |
|---|---|---|
| truth read | truth repository, optional projection/reference state | create/update truth, trace, audit, outbox |
| projection read | stable view lookup/state/read | rebuild, mark fresh, mark stale |
| reference read | reference state and typed sidecar refs | external resolver call, refresh sidecar |
| trace/audit read | trace/audit/history facade | append trace/audit, repair trail |
| report/outbox/handoff read | report/outbox/handoff repositories | publish, deliver, retry, create report |

### 7.4 Shared inbound consumer / callback discipline

Consumer and callback flow 必须 idempotent,并以 stored receipt 支撑 replay:

```text
[Worker entry]
  | validate IdentityInboundEventEnvelope<T>
  | unsupported schema -> receipt without parsing unsafe payload
  | dispatch_inbound_event(...) or dispatch_callback(...)
  v
[Application consumer/callback service]
  | begin IdentityUnitOfWork
  | build inbound/callback operation context
  | reserve idempotency
  | duplicate -> load typed stored consumer/callback receipt envelope and replay
  v
[Accepted local marker/state update]
  | update only identity-owned snapshot/state/append record/handoff marker
  | use reference bundle version when saving reference sidecar
  | use IdentityMarkerSubjectMapper for marker trace when required
  | save typed receipt envelope
  | complete idempotency
  | commit
```

| Discipline | 正式来源 | 禁止事项 |
|---|---|---|
| envelope | Step 8 `IdentityInboundEventEnvelope<T>` | payload 重复 envelope 字段或用 broker offset 当 key |
| stored receipt | Step 8 receipt surface + Step 7 typed receipt envelope repository | missing / wrong-kind envelope 时重放 mutation |
| external body | Step 8 body-free payload | 保存 role/work/memory/archive/raw receipt body |
| marker trace subject | Step 7 `IdentityMarkerSubjectMapper` | 从 topic/source ref 字符串拼 trace subject |
| callback receipt kind | Step 8/7 `HandoffCallbackReceipt` surface | callback kind mismatch 当普通 consumer replay |

### 7.5 Shared outbound publish discipline

Outbound event material 的生成在 accepted command/consumer/callback transaction 内完成,发布由 `PublishIdentityOutboxFlow` 处理。

```text
[Accepted truth / marker change]
  | build event-specific payload marker from committed material
  | append IdentityOutboxRecord with accepted subject/trace refs
  v
[PublishIdentityOutboxFlow]
  | load pending/retryable outbox record
  | load payload marker / topic binding
  | call IdentityOutboxPublisherPort.publish(...)
  | update outbox publication state
  | record job report item refs
```

| Discipline | 正式来源 | 禁止事项 |
|---|---|---|
| accepted source | Step 8 outbound payload accepted source table | publish pending/rejected/report-only material |
| payload source | saved payload marker/snapshot | 回读 current truth 重构 payload |
| topic | `IdentityTopicBindingPort` | handler hard-code broker topic string |
| publish outcome | `IdentityOutboxPublisherPort` | broker success 当 downstream consumed truth |

### 7.6 Shared operations job discipline

Operations job flow 必须经 application job service,并保存可 replay 的 job report:

```text
[Jobs entry]
  | map IdentityJobRequest<T> to IdentityOperationContext
  | dispatch_job(...)
  v
[Application job service]
  | begin IdentityUnitOfWork
  | reserve idempotency
  | duplicate -> load stored job report and replay
  v
[Job body]
  | process explicit refs/page from formal maintenance scope
  | mutate only projection/reference/report/outbox/handoff marker state
  | assemble IdentityJobReportSurface with item refs
  | save IdentityJobRunReport + StoredIdentityOperationResult(JobReport)
  | complete idempotency
  | commit
```

| Job family | 允许写入 | 禁止写入 |
|---|---|---|
| rebuild projection | projection view/state, job report | core truth, source snapshot truth |
| refresh reference | reference state/typed sidecar/stale marker, job report | external truth, command truth |
| reconciliation | report/finding/issue refs | automatic remediation/truth repair |
| publish outbox | outbox state, publish attempt/issue refs, job report | accepted truth, payload body |
| deliver handoff | handoff attempt/receipt/issue refs, job report | archive body, target private path, command truth |
| retry propagation failures | retryable outbox/handoff markers, job report | silent success, raw adapter body |

### 7.7 Step 9 redlines

| 编号 | 红线 | 处理 |
|---|---|---|
| DDD-S9-RULE-001 | 不得新增 Step 6 未定义对象、字段、状态或 domain method | 暂停并回 Step 6 |
| DDD-S9-RULE-002 | 不得新增 Step 7 未定义 port、lookup、save/read surface 或 fake 私有 map | 暂停并回 Step 7 |
| DDD-S9-RULE-003 | 不得新增 Step 8 未定义 DTO、result、receipt、report、payload、surface variant | 暂停并回 Step 8 |
| DDD-S9-RULE-004 | Command duplicate 不得重跑 mutation | 读取 stored command result/rejection replay |
| DDD-S9-RULE-005 | Query 不得写 truth、trace、audit、outbox、projection、reference 或 report | 返回 not visible/degraded/stale/missing surface |
| DDD-S9-RULE-006 | Consumer/callback 不得拥有外部 truth 或保存外部 body | 只保存 body-free summary/ref/marker/receipt |
| DDD-S9-RULE-007 | Outbound publisher 不得回读 current truth 重构 payload | 只用 saved outbox record + payload marker + topic binding |
| DDD-S9-RULE-008 | Job runner 不得直连 repository/publisher/handoff/projection store | 只能进入 application facade |
| DDD-S9-RULE-009 | expected_version、truth cursor、reference marker cursor、source version、page cursor、idempotency key 不得混用 | 使用各自正式来源 |
| DDD-S9-RULE-010 | 发现设计不闭环时不得写假实现式 flow | 输出 blocker、证据、影响范围和闭口建议 |

### 7.8 9.0 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 8 审核通过 | 通过 | 用户已同意进入 Step 9 |
| 是否参考 governance Step 9 粒度 | 通过 | 采用 9.0 框架、分批计划、shared discipline 和逐批停审方式 |
| 是否复制 governance 业务内容 | 未复制 | 业务清单来自 identity Step 8 |
| 是否写逐接口详细 flow | 未提前 | 本批只写框架和红线 |
| 是否覆盖所有协议入口 | 通过 | 6 Command、14 Query、5 Consumer/Callback、10 Outbound material、6 Job 均列入计划 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 装配 |
| 下一批 | 9.1-a | 审核通过后进入 member/lifecycle command flows |

### 7.9 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| command flow | `EstablishGlobalMemberFlow` 从 Step 8 request 出发,用 Step 7 repo/id/UoW/stored result,调用 Step 6 factory/policy | service 直接构造未定义字段或跳过 stored result |
| query flow | `ReadMemberSummaryFlow` 先 resolve visibility,再读 projection,stale 返回 query surface | query miss 时自动 rebuild projection |
| consumer flow | `HandleWorkParticipationAcceptedFlow` 用 envelope idempotency 和 stored receipt replay | worker ack 后直接写 career record 且不存 receipt |
| outbound publish | `PublishIdentityOutboxFlow` 使用 outbox record + payload marker + topic binding | publisher 查询 `GlobalMember` 当前状态重新拼 payload |
| job flow | `RefreshExternalReferenceStateFlow` 保存 job report item refs,duplicate replay stored report | duplicate 时重新 list stale references |

---

## 8. 复杂度判断

Step 9 复杂度高,必须拆分。本仓 Step 8 已定义 41 个协议面,其中 command、query、consumer/callback、outbound material 和 job 的副作用边界不同。若一次性写完所有 flow,最容易出现以下问题:

- Command transaction order、accepted cursor、trace/audit/outbox/stale/result 顺序漂移。
- Query 读路径偷偷写 projection/reference/report。
- Consumer/callback 的 stored receipt、reference bundle version 和 marker trace subject 缺口被 fake 私有规则掩盖。
- Outbound publisher 回读 current truth,破坏 accepted payload snapshot。
- Job duplicate replay 缺 item refs 后被迫重跑 job 或重扫 repository。

因此 Step 9 采用 `9.0~9.6` 批次。每批写入后停审,不得在未审核时继续扩到下一个协议族。

---

## 9. 回填草稿

正式 `03-详细设计.md` 第 8 章后续可按以下口径装配:

```md
## 8. 逐接口函数级处理流

本章逐接口定义 L1-identity 的 command、query、inbound consumer/callback、outbound publish material 和 operations job 的函数级处理流。所有 flow 均从第 7 章 protocol DTO 出发,回指第 5/6 章 object、state、policy、port、repository、resolver、publisher、handoff、stored result 和 application facade。

Command 写路径必须在同一 UnitOfWork 中完成 idempotency reserve、truth transition、accepted cursor、trace/audit/outbox/projection stale、stored result 和 idempotency complete。Query 必须保持 read-only,通过 visibility surface 表达 not visible、degraded、stale、missing 或 rebuilding。Consumer/callback 必须保存可 replay receipt,不得保存外部 body。Outbound publish 只能使用 saved outbox record、payload marker 和 topic binding。Operations job 必须保存含 item refs 的 stored job report,duplicate 不得重跑 job body。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

---

## 10. 待确认事项

| 编号 | 事项 | 归属批次 | 当前处理 |
|---|---|---|---|
| DDD-S9-OPEN-001 | terminal lifecycle 是否同步更新 anchor hold,以及 reason 映射规则 | 9.1-a / Step 10 | 已在 9.1-a 闭合:Retired/Tombstoned accepted flow 同步 hold anchor;reason source 取 `LifecycleReasonRef.source_ref`;Step 10 只固化状态矩阵 |
| DDD-S9-OPEN-002 | role/capability source unavailable、missing evidence、missing safe summary 的 accepted/rejected/pending priority | 9.1-b / Step 10 / Step 12 | 9.1-b 已闭合 accepted `Active` 主线:只允许 `SourceResolved` + source version + safe summary + validated evidence;其他分支不得 accepted active,public rejected/dependency/stored priority 留 Step 12/13 |
| DDD-S9-OPEN-003 | career pending review 与 duplicate source marker 的持久化/返回口径 | 9.1-b / Step 10 / Step 12 / Step 13 | 9.1-b 已闭合 duplicate source no-new-history;显式 `MarkSourcePendingReview` 可持久化 `SourcePendingReview`;public no-op/conflict/rejected replay priority 留 Step 12/13 |
| DDD-S9-OPEN-004 | memory relation pending verification、handoff result marker 和 callback target 冲突优先级 | 9.1-b / 9.3 / Step 10 / Step 12 | 9.1-b 已闭合 command 侧 trusted link/refresh/archive 与显式 `MarkPendingVerification`;9.3 已闭合 callback target 优先级:direct ref 与 handoff lookup 必须同一,冲突为 rejected/quarantined receipt,missing target 不创建 relation;完整 state transition matrix 留 Step 10 |
| DDD-S9-OPEN-004a | `PrepareTraceHandoff` accepted 是否必须创建 outbox | 9.1-c / 9.4 / Step 8 | 已闭合:pending handoff intent 不是当前十条 canonical outbound event;`effect.outbox_refs = []`;若未来需要 `TraceHandoffIntentPrepared` 必须回 Step 8 新增 payload/topic/schema |
| DDD-S9-OPEN-005 | query partial item not visible/degraded/missing 的 page-level priority | 9.2 / Step 10 / Step 12 | 9.2-a 已闭合 core list query;9.2-b 已闭合 trace/audit;9.2-c 已闭合 operations query:scope/list not visible 优先于 empty,exact ref missing 是 Missing,visible list empty 是 Empty,item missing/invalid/scope mismatch 是 Degraded partial,all loaded items denied 是 NotVisible,mixed visible/denied 是 Redacted partial;字段级 redaction matrix 留 Step 12/16 |
| DDD-S9-OPEN-006 | consumer rejected/quarantined/delayed/noop 的 exact outcome priority | 9.3 / Step 10 / Step 12 / Step 13 | 9.3 已闭合 flow-level priority:entry unsupported before payload parse,idempotency replay/conflict before business mutation,forbidden body rejected,transient dependency delayed,missing/untrusted/manual-review quarantined,source duplicate noop,accepted mutation last;HTTP/status/retry/dead-letter mapping 留 Step 12/13/14 |
| DDD-S9-OPEN-007 | lifecycle changed 与 availability changed 是否同一 accepted flow 同时发、合并发或条件发 | 9.4 / Step 10 | 9.4 已闭合:`GlobalLifecycleChanged` 每次 lifecycle accepted 都创建;`GlobalMemberAvailabilityChanged` 只在 old/new `GlobalLifecycleState::is_available()` 结果变化时同事务创建;establish 初始 available 只由 `GlobalMemberEstablished` 表达,不额外发 availability |
| DDD-S9-OPEN-008 | career correction accepted 时是否另发 original superseded event | 9.4 / Step 10 | 9.4 已闭合:不新增 original superseded event;correction accepted 只创建 `CareerCorrectionAppended`,payload 携带 original ref,旧记录 `SupersededByCorrection` 是同事务 truth side effect / trace,不是第 11 条 outbound event |
| DDD-S9-OPEN-009 | job retry/backoff、timeout、schedule config | Step 14 | 非 Step 9.0 blocker |

---

## 11. 进入下一批条件

进入 9.1-a 前条件已满足:

- 用户已审核通过本 9.0 框架和批次计划。
- Step 8 的 protocol name、DTO、handler target、Step 9 flow name 映射保持不变。
- 本批只写 `EstablishGlobalMemberFlow` 和 `UpdateGlobalLifecycleStateFlow`,不得提前写 role/career/memory/handoff command 详细 flow。
- 每条 command flow 已列出 DTO、entry/service、目标 object/policy、Step 7 port、transaction order、accepted/rejected/duplicate 分支、stored result、outbox/stale、测试切口和停审记录。
- terminal anchor hold、basis resolver、stored replay、trace/outbox subject、projection stale 和 expected_version 来源已在本批闭合;后续 Step 10/12/13 继续固化状态矩阵、错误映射和幂等矩阵。

---

## 12. Command flow batch 9.1-a: member / lifecycle

本批只覆盖两个 command:

- `EstablishGlobalMemberFlow`
- `UpdateGlobalLifecycleStateFlow`

本批承接 9.0 shared command transaction discipline,但将 member/lifecycle 的 domain method、port、branch、side effect 和测试切口展开到可落码粒度。本批不写 role/career/memory/handoff command,不写 query flow,不写 Step 10 完整状态矩阵,不写 Step 12 public error priority,不写 Step 13 幂等矩阵。

### 12.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `GlobalMember` / `IdentityAnchorState` / `IdentityAnchorPolicy` | 建档、ref reuse guard、anchor hold、query no-create 边界 |
| Step 6 `GlobalLifecycleState` / `LifecycleTransitionPolicy` / `HighRiskLifecycleGuard` | 初始 lifecycle、显式迁移、高风险 basis guard、lifecycle/anchor 分离 |
| Step 6 `IdentityAnchorReasonRef` / `LifecycleReasonRef` / `GovernanceBasisSummary` | terminal hold reason、lifecycle reason、basis valid/mismatch 输入 |
| Step 7 member/lifecycle repositories | member/lifecycle versioned read and save |
| Step 7 id/clock/UoW/idempotency/stored result/effect/trace/audit/outbox/projection ports | accepted transaction side effects and duplicate replay |
| Step 7 `IdentityExternalSourceResolverPort.resolve_governance_basis(...)` | high-risk lifecycle precheck |
| Step 8 `EstablishGlobalMemberRequest` / `GlobalMemberCommandResult` | establish command DTO/result |
| Step 8 `UpdateGlobalLifecycleStateRequest` / `GlobalLifecycleCommandResult` | lifecycle command DTO/result |

### 12.2 本批问题回答

| 问题 | 回答 |
|---|---|
| 建档是否同时创建 initial lifecycle | 是。Step 8 已固定 accepted result 返回 initial lifecycle state,Step 6 `GlobalLifecycleState::initial_available(...)` 有正式 factory,Step 7 lifecycle repo 支撑 create save |
| requested member ref 缺失如何处理 | 用 `IdentityIdGeneratorPort.new_global_member_id()` 生成 `GlobalMemberId`,再由 `GlobalMemberRef::from_id(...)` 构造;不得用 source/actor/timestamp 拼 id |
| existing anchor 如何判断 reuse | 先通过 `GlobalMemberRepository.get_anchor_state(member_ref)` 读取 optional state,再交给 `IdentityAnchorPolicy::for_create(...).assert_ref_not_reused()` |
| terminal lifecycle 是否同步 hold anchor | 是。本批固定 accepted `Retired` 同步 `IdentityAnchorState::retired_held(...)`,accepted `Tombstoned` 同步 `IdentityAnchorState::tombstone_held(...)` |
| terminal hold reason 从哪里来 | 从 `UpdateGlobalLifecycleStateRequest.reason_ref.source_ref` 构造 `IdentityAnchorReasonRef`;`Retired` 映射 `IdentityAnchorReasonKind::Retired`,`Tombstoned` 映射 `IdentityAnchorReasonKind::Tombstoned`;不得从字符串、basis body 或 target enum name 解析 |
| high-risk basis 如何校验 | 若 `action_risk_ref.requires_governance_basis()` 为 true,必须有 `basis_ref`,调用 resolver 得到 `GovernanceBasisSummary`,再用 `is_valid_for(action_risk_ref)` 判定;不以 basis ref presence accepted |
| accepted outbox 发几类 material | 建档产生 `GlobalMemberEstablished` 和 initial `IdentityAnchorChanged`;initial lifecycle 由 `GlobalMemberEstablishedPayload.lifecycle_state_kind` 承载,不另发 lifecycle/availability material。lifecycle update 至少产生 `GlobalLifecycleChanged`;availability 同发规则由 9.4 固定 |
| duplicate 如何 replay | idempotency reserve 返回 replay 时,必须先读取 generic shell,再读取 `get_command_accepted_result(...)` 或 `get_command_rejected_result(...)` 的 typed envelope;不得重跑 repository save 或重读 truth |
| rejected 是否全部持久化 | 本批只要求可 replay rejected 使用 `save_command_rejected_result(...)` + `save_command_rejected_envelope(...)`;普通 validation/internal error 的持久化优先级留 Step 12/13 |

### 12.3 当前材料诊断

| 事项 | 诊断 | 本批处理 |
|---|---|---|
| `EstablishGlobalMember` 字段来源 | Step 8 request 提供 source、optional member、initial lifecycle reason;actor/idempotency/digest 来自 envelope/context | 可直接展开 |
| initial lifecycle create | Step 6 有 `GlobalLifecycleState::initial_available(...)`,Step 7 有 `save_lifecycle(member_ref, ..., None, uow)` | lifecycle row key 来自 accepted `member_ref`;不得从 lifecycle state 推断 |
| terminal anchor hold | Step 8 明确留 Step 9/10 闭口;Step 6 有 anchor reason/lifecycle reason/source ref 和 terminal hold factory | 本批闭合 reason 映射和同步 hold 规则 |
| high-risk basis | Step 6/7/8 已有 `GovernanceBasisSummary` 和 resolver | 本批闭合 precheck 顺序;unavailable/invalid public mapping留 Step 12 |
| trace/audit/outbox/effect | Step 6/7 有正式对象和 repo;topic/payload 细节在 Step 8/9.4 | 本批写 side effect 顺序,不写 payload body |

### 12.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 建档只创建 member,不创建 lifecycle | 不采用 | Step 8 result 已固定 initial lifecycle state;Step 6/7 支撑 initial lifecycle create |
| terminal lifecycle 不同步 anchor hold | 不采用 | Step 6 明确 Retired/Tombstoned 不释放 member ref,anchor hold 由 terminal flow 承接 |
| terminal hold reason 使用 lifecycle reason source | 采用 | `LifecycleReasonRef` 已有 `reason_kind` 与 `source_ref`;`IdentityAnchorReasonRef` 需要 body-free source marker;无需新增字段 |
| high-risk 只检查 basis ref presence | 不采用 | Step 6/8 明确禁止;必须 resolver summary valid for action |
| command accepted 等 publish 成功后再返回 | 不采用 | outbox publish 是 job boundary;publish failure 不回滚 accepted truth |

### 12.5 `EstablishGlobalMemberFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityCommandRequest<EstablishGlobalMemberRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_command(...)` |
| application service | `IdentityCommandService.establish_global_member(request, context)` |
| 目标 object / policy | `IdentityAnchorPolicy`, `GlobalMember`, `GlobalLifecycleState` |
| 主要 port | `IdentityUnitOfWorkManagerPort`, `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityIdGeneratorPort`, `IdentityClockPort`, `GlobalMemberRepository`, `GlobalLifecycleRepository`, `IdentityTruthChangeSubjectMapper`, `IdentityAcceptedAuditTrailMarkerMapper`, `IdentityTraceRecordRepository`, `IdentityAuditTrailRepository`, `IdentityOutboxRepository`, `IdentityProjectionRepository`, `IdentityCommandEffectSummaryRepository` |
| accepted state | member anchor = `Established`;lifecycle = `Available` |
| rejected candidates | missing actor/key/source, forbidden source owner, requested ref reuse, same key/different digest |

```text
[API command entry]
  | validate IdentityCommandRequest<EstablishGlobalMemberRequest>
  | build IdentityOperationContext for command channel
  | dispatch_command(EstablishGlobalMember)
  v
[IdentityCommandService.establish_global_member]
  | uow = IdentityUnitOfWorkManagerPort.begin()
  | reserve idempotency(context, new_idempotency_record_ref, now, uow)
  | ReplayAvailable -> rollback uow, load stored result, return replay
  | Conflict / InFlight -> mark or return protocol surface per Step 12/13
  v
[Load and guard]
  | member_ref = request.requested_member_ref or new_global_member_id -> GlobalMemberRef::from_id(...)
  | existing_anchor = GlobalMemberRepository.get_anchor_state(member_ref)
  | policy = IdentityAnchorPolicy::for_create(member_ref, request.source_ref, context.actor_ref, existing_anchor, context.channel)
  | policy.assert_can_establish()
  | lifecycle_existing = GlobalLifecycleRepository.get_lifecycle_with_version(member_ref)
  | lifecycle_existing Some -> rejected conflict;do not overwrite lifecycle
  v
[Domain transition]
  | now = IdentityClockPort.now()
  | member = GlobalMember::establish(member_ref, request.source_ref, context.actor_ref, now)
  | lifecycle = GlobalLifecycleState::initial_available(context.actor_ref, request.initial_lifecycle_reason_ref, now)
  v
[Persist accepted truth]
  | GlobalMemberRepository.save_member(member, None, uow)
  | GlobalLifecycleRepository.save_lifecycle(member_ref, lifecycle, None, uow)
  | cursor = uow.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.member_subjects(member_ref)
  | append IdentityTraceRecord::from_accepted_change(...)
  | run Shared accepted audit append subflow with context, subjects, change_kind_ref, cursor, trace_record_ref, member_ref
  | create IdentityOutboxRecord::from_accepted_change(...) for GlobalMemberEstablished and initial IdentityAnchorChanged material
  | affected = IdentityProjectionRepository.expand_affected_projection_refs(subjects)
  | mark each affected projection stale with cursor-backed ProjectionState
  | save IdentityCommandEffectSummary::from_accepted_change(...)
  | save StoredIdentityOperationResult::command_accepted(...) generic shell
  | save IdentityCommandAcceptedResultEnvelope for GlobalMemberCommandResult + effect
  | complete idempotency with stored_result_ref
  | commit
```

#### 12.5.1 Accepted side effect order

| Step | Required source | Notes |
|---|---|---|
| save member | `GlobalMemberRepository.save_member(member, None, uow)` | create must use `expected_version = None` |
| save lifecycle | `GlobalLifecycleRepository.save_lifecycle(member_ref, lifecycle, None, uow)` | initial lifecycle create keyed by accepted member_ref;not derived at query time |
| assign cursor | `IdentityUnitOfWork.assign_truth_change_cursor()` | after accepted truth is prepared inside same UoW;not timestamp/version |
| map subject | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref)` | one canonical key for trace/audit/outbox |
| append trace | `IdentityTraceRecord::from_accepted_change(...)` + repo append | reason may include lifecycle/anchor reason marker;body-free only |
| audit | shared accepted audit append subflow;existing append or `AuditTrail::from_accepted_write(...)` create/save | scope / visibility markers come from `IdentityAcceptedAuditTrailMarkerMapper`;repository must not implicit-create audit trail |
| outbox | `IdentityOutboxRecord::from_accepted_change(...)` + save | payload marker/body details audited in 9.4 |
| projection stale | `expand_affected_projection_refs(subjects)` then `mark_projection_stale(...)` | no ad hoc view ref |
| effect/stored result | `IdentityCommandEffectSummary::from_accepted_change(...)`;`StoredIdentityOperationResult::command_accepted(...)` | stored result is duplicate replay source |

#### 12.5.2 Rejected / duplicate branches

| Branch | Handling |
|---|---|
| duplicate same key/digest completed | rollback current UoW;load stored accepted/rejected result by ref;return replay;do not load member/lifecycle to rebuild response |
| same key/different digest | mark idempotency conflict or return conflict surface per Step 13;do not save truth |
| requested member ref already has anchor | rejected conflict / policy denied;replayable rejected only if Step 12/13 classifies it as stored |
| lifecycle row already exists for new member ref | rejected conflict;do not overwrite lifecycle |
| source forbidden body / wrong owner | rejected invalid/forbidden body;do not save source body |
| repository / transaction failure | rollback;return `ApplicationError`;do not save rejected command result unless Step 12/13 says replayable |

#### 12.5.3 Test cuts

| Test cut | Expected |
|---|---|
| accepted generated member ref | missing `requested_member_ref` uses id generator,creates member + lifecycle,returns `Established` / `Available` |
| accepted requested member ref | uses supplied ref,checks anchor missing,does not generate member id |
| duplicate replay | same key/digest returns stored result without second save/outbox/trace |
| reused ref rejected | existing `Established` / `RetiredHeld` / `TombstoneHeld` rejects create |
| lifecycle conflict | existing lifecycle for member rejects,does not overwrite |
| source body forbidden | rejected before truth save |
| stale expansion | affected projections come only from repository expansion |

### 12.6 `UpdateGlobalLifecycleStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityCommandRequest<UpdateGlobalLifecycleStateRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_command(...)` |
| application service | `IdentityCommandService.update_global_lifecycle_state(request, context)` |
| 目标 object / policy | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, optional `IdentityAnchorState` |
| 主要 port | `IdentityUnitOfWorkManagerPort`, `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityClockPort`, `GlobalMemberRepository`, `GlobalLifecycleRepository`, `IdentityExternalSourceResolverPort`, `IdentityTruthChangeSubjectMapper`, `IdentityAcceptedAuditTrailMarkerMapper`, trace/audit/outbox/projection/effect repositories |
| accepted state | lifecycle target state;terminal target also updates member anchor hold |
| rejected candidates | member/lifecycle missing, illegal transition, high-risk missing/invalid/stale/unavailable basis, same key/different digest |

```text
[API command entry]
  | validate IdentityCommandRequest<UpdateGlobalLifecycleStateRequest>
  | build IdentityOperationContext for command channel
  | dispatch_command(UpdateGlobalLifecycleState)
  v
[IdentityCommandService.update_global_lifecycle_state]
  | uow = IdentityUnitOfWorkManagerPort.begin()
  | reserve idempotency(context, new_idempotency_record_ref, now, uow)
  | ReplayAvailable -> rollback uow, load stored result, return replay
  | Conflict / InFlight -> mark or return protocol surface per Step 12/13
  v
[Load and guard]
  | member_v = GlobalMemberRepository.get_member_with_version(request.member_ref)
  | missing member -> rejected not found;do not create member
  | lifecycle_v = GlobalLifecycleRepository.get_lifecycle_with_version(request.member_ref)
  | missing lifecycle -> rejected not found;do not synthesize lifecycle
  | transition = LifecycleTransitionPolicy::for_transition(lifecycle_v.object, request.target_state, request.reason_ref, context.actor_ref, context.channel)
  | transition.assert_explicit_command()
  | transition.assert_not_project_or_runtime_state()
  | transition.assert_allowed_transition()
  v
[High-risk basis precheck]
  | if request.action_risk_ref.requires_governance_basis()
  |   request.basis_ref must be Some
  |   summary = IdentityExternalSourceResolverPort.resolve_governance_basis(basis_ref, Some(action_risk_ref))
  |   guard = HighRiskLifecycleGuard::for_action(request.target_state, action_risk_ref, Some(basis_ref), context.actor_ref)
  |   guard.assert_basis_present()
  |   require summary.is_valid_for(action_risk_ref)
  | else
  |   basis_ref must be None or accepted as non-risk marker by Step 10/12 rules
  v
[Domain transition]
  | now = IdentityClockPort.now()
  | new_lifecycle = GlobalLifecycleState::from_transition(lifecycle_v.object, request.target_state, request.reason_ref, context.actor_ref, now, request.basis_ref)
  | if target Retired:
  |   anchor_reason = IdentityAnchorReasonRef::new(IdentityAnchorReasonKind::Retired, request.reason_ref.source_ref)
  |   anchor_state = IdentityAnchorState::retired_held(anchor_reason, now)
  |   member_v.object.hold_anchor(anchor_state, context.actor_ref)
  | if target Tombstoned:
  |   anchor_reason = IdentityAnchorReasonRef::new(IdentityAnchorReasonKind::Tombstoned, request.reason_ref.source_ref)
  |   anchor_state = IdentityAnchorState::tombstone_held(anchor_reason, now)
  |   member_v.object.hold_anchor(anchor_state, context.actor_ref)
  v
[Persist accepted truth]
  | GlobalLifecycleRepository.save_lifecycle(request.member_ref, new_lifecycle, Some(lifecycle_v.version), uow)
  | if anchor changed -> GlobalMemberRepository.save_member(member_v.object, Some(member_v.version), uow)
  | cursor = uow.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.member_subjects(request.member_ref)
  | append IdentityTraceRecord::from_accepted_change(...)
  | run Shared accepted audit append subflow with context, subjects, change_kind_ref, cursor, trace_record_ref, request.member_ref
  | create IdentityOutboxRecord::from_accepted_change(...) for lifecycle material and optional anchor material
  | affected = IdentityProjectionRepository.expand_affected_projection_refs(subjects)
  | mark each affected projection stale
  | save IdentityCommandEffectSummary::from_accepted_change(...)
  | save StoredIdentityOperationResult::command_accepted(...) generic shell
  | save IdentityCommandAcceptedResultEnvelope for GlobalLifecycleCommandResult + effect
  | complete idempotency with stored_result_ref
  | commit
```

#### 12.6.1 Terminal anchor hold rule

| Lifecycle target | Anchor side effect | Anchor reason source | Notes |
|---|---|---|---|
| `Available` | none | none | no anchor hold update |
| `Paused` | none | none | no anchor hold update |
| `Retired` | `IdentityAnchorState::retired_held(...)` + `GlobalMember.hold_anchor(...)` | `IdentityAnchorReasonRef::new(IdentityAnchorReasonKind::Retired, request.reason_ref.source_ref)` | member ref remains occupied |
| `Tombstoned` | `IdentityAnchorState::tombstone_held(...)` + `GlobalMember.hold_anchor(...)` | `IdentityAnchorReasonRef::new(IdentityAnchorReasonKind::Tombstoned, request.reason_ref.source_ref)` | strong terminal hold |

This rule uses only Step 6/8 fields. It does not parse `LifecycleReasonKind` strings,does not read governance body,and does not infer reason from target enum name at implementation time. Step 10 will still own the full lifecycle/anchor state matrix,including whether `Retired -> Tombstoned` is allowed.

#### 12.6.2 High-risk basis rule

| Case | Handling |
|---|---|
| no `action_risk_ref` | no high-risk guard;ordinary transition policy still applies |
| `action_risk_ref.requires_governance_basis() == false` | basis resolver not required;transition still needs actor/reason/matrix |
| high/critical risk and missing `basis_ref` | rejected/pending-basis surface per Step 12;not accepted |
| resolver returns `Valid` and `is_valid_for(action_risk_ref)` | high-risk guard passes;save only `GovernanceBasisRef` into lifecycle |
| resolver returns `Stale` / `Unavailable` / `InvalidForAction` / `NotFound` | not accepted;exact public rejection/dependency mapping belongs to Step 12 |
| resolver `ApplicationError` | rollback;do not turn into accepted lifecycle |

#### 12.6.3 Accepted side effect order

| Step | Required source | Notes |
|---|---|---|
| save lifecycle | `GlobalLifecycleRepository.save_lifecycle(request.member_ref, new_lifecycle, Some(lifecycle_v.version), uow)` | row key is request.member_ref;expected version from lifecycle loaded by the same member_ref |
| save member anchor hold | only terminal target;`GlobalMemberRepository.save_member(member, Some(member_v.version), uow)` | expected version from loaded member |
| assign cursor | UoW truth cursor | one accepted command cursor covers lifecycle and optional anchor side effect |
| map subject | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref)` | lifecycle/anchor accepted material share member canonical subject |
| append trace/audit | trace reason uses lifecycle reason marker;basis marker optional;audit scope/visibility markers come from `IdentityAcceptedAuditTrailMarkerMapper` | no governance body;no query visibility/default visible marker |
| outbox | `GlobalLifecycleChanged`;terminal anchor hold also creates `IdentityAnchorChanged`;availability changed creates `GlobalMemberAvailabilityChanged` only when old/new `is_available()` differs | follows 9.4 material rule |
| projection stale | repository expansion by accepted subject | no direct view ref construction |
| effect/stored result | command effect summary + generic stored accepted shell + typed accepted envelope | replay source |

#### 12.6.4 Rejected / duplicate branches

| Branch | Handling |
|---|---|
| duplicate same key/digest completed | rollback current UoW;load stored result;return replay |
| same key/different digest | conflict surface per Step 13;no lifecycle/member save |
| member missing | rejected not found;do not create member |
| lifecycle missing | rejected not found;do not create initial lifecycle outside establish flow |
| illegal transition | policy denied;not degraded |
| high-risk basis missing / invalid / stale / unavailable | not accepted;exact rejected/dependency surface Step 12 |
| terminal hold save conflict | rollback;return `ApplicationError` / optimistic conflict surface per Step 12;do not leave lifecycle-only terminal accepted |

#### 12.6.5 Test cuts

| Test cut | Expected |
|---|---|
| available to paused accepted | lifecycle saved,member anchor unchanged,trace/outbox/stale/result saved |
| paused to available accepted | lifecycle saved,anchor unchanged |
| retire accepted | lifecycle `Retired` saved and member anchor becomes `RetiredHeld` with reason source from lifecycle reason |
| tombstone accepted | lifecycle `Tombstoned` saved and member anchor becomes `TombstoneHeld` with reason source from lifecycle reason |
| high-risk valid basis | resolver summary valid for risk;accepted and stores only `GovernanceBasisRef` |
| high-risk basis presence only | basis ref without valid summary rejected;no save |
| member missing | rejected without creating member/lifecycle |
| illegal transition | rejected;no trace/outbox/effect |
| duplicate replay | no second resolver call or save;stored result replay only |
| terminal member save conflict | transaction rollback;no lifecycle-only terminal commit |

### 12.7 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.1-a 范围 | 通过 | 只展开 establish 和 lifecycle update |
| DTO 是否回指 Step 8 | 通过 | 使用 `EstablishGlobalMemberRequest` / `UpdateGlobalLifecycleStateRequest` 和既有 result DTO |
| Domain 是否回指 Step 6 | 通过 | 使用 member/anchor/lifecycle/policy/guard 已定义函数 |
| Port 是否回指 Step 7 | 通过 | member/lifecycle repo、basis resolver、UoW、idempotency、stored result、trace/audit/outbox/projection/effect 均已定义 |
| terminal anchor hold 是否闭合 | 通过 | 本批固定 target -> anchor state / reason 映射,不新增字段 |
| high-risk basis 是否闭合 | 通过 | resolver summary + `is_valid_for(...)`,不以 ref presence accepted |
| expected_version 来源是否闭合 | 通过 | create `None`;transition/anchor update 使用 loaded versions |
| duplicate replay 是否闭合 | 通过 | stored result only,不重跑 mutation/resolver |
| query/job 是否误写 truth | 未发生 | 本批只写 command |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 12.8 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Member / lifecycle command flows

`EstablishGlobalMemberFlow` 在 command UoW 内 reserve idempotency,确定 member ref,读取 existing anchor,通过 `IdentityAnchorPolicy` 拒绝 ref reuse,创建 `GlobalMember` 与初始 `GlobalLifecycleState::Available`,再按 accepted side-effect 顺序保存 trace、audit、outbox、projection stale、effect summary、stored result 并 complete idempotency。

`UpdateGlobalLifecycleStateFlow` 只对已存在 member/lifecycle 执行显式迁移。高风险动作必须通过 `IdentityExternalSourceResolverPort.resolve_governance_basis(...)` 获得 valid `GovernanceBasisSummary`,不得仅凭 `GovernanceBasisRef` 存在 accepted。目标为 `Retired` 或 `Tombstoned` 时,同一 transaction 内同步更新 member anchor hold,anchor reason 来源为 lifecycle reason 的 body-free source marker。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 12.9 进入下一批条件

进入 9.1-b 前必须满足:

- 用户审核通过 9.1-a。
- 9.1-b 只写 `MaintainRoleCapabilitySummaryFlow`, `AppendCareerRecordFlow`, `MaintainMemoryReferenceFlow`。
- role/career/memory command 不得复用 lifecycle terminal hold 规则或新增 member/lifecycle 状态。
- 若 source resolver、evidence、work participation、memory/archive source、pending review、reference bundle version 或 stored rejection surface 不闭合,必须暂停回 Step 6/7/8/12/13,不得在 flow 中私补。

---

## 13. Command flow batch 9.1-b: role / career / memory

本批只覆盖三个 command:

- `MaintainRoleCapabilitySummaryFlow`
- `AppendCareerRecordFlow`
- `MaintainMemoryReferenceFlow`

本批承接 9.0 shared command transaction discipline,但将 role/career/memory 三个 command 的 resolver、policy、duplicate/no-op、pending marker 和 accepted side effect 展开到可落码粒度。本批不写 `PrepareTraceHandoffFlow`,不写 query、consumer/callback、outbound publish、job flow,不写 Step 10 完整状态矩阵,不写 Step 12 public error priority,不写 Step 13 幂等矩阵。

### 13.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `RoleCapabilitySummary` / `RoleCapabilitySourceSnapshot` / `RoleCapabilitySourcePolicy` | role/capability active summary、source snapshot、source/evidence/body-free guard |
| Step 6 `CareerRecord` / `CareerAppendPolicy` | append-only career record、correction append、duplicate source guard、pending review marker |
| Step 6 `MemoryReference` / `MemoryReferenceState` / `MemoryReferencePolicy` | memory/archive relation、trusted link、refresh/archive/handoff marker、pending verification |
| Step 7 `RoleCapabilityRepository` | current summary/source snapshot versioned read and save |
| Step 7 `CareerRecordRepository` | duplicate source lookup、append-only create、correction original read/update |
| Step 7 `MemoryReferenceRepository` | relation lookup by member/memory/archive/handoff、versioned save |
| Step 7 `IdentityExternalSourceResolverPort` | role source/evidence、work participation、memory/archive source body-free resolver |
| Step 7 id/clock/UoW/idempotency/stored result/effect/trace/audit/outbox/projection ports | accepted transaction side effects and duplicate replay |
| Step 8 `MaintainRoleCapabilitySummaryRequest` / `RoleCapabilityCommandResult` | role/capability command DTO/result |
| Step 8 `AppendCareerRecordRequest` / `CareerRecordCommandResult` | career command DTO/result |
| Step 8 `MaintainMemoryReferenceRequest` / `MemoryReferenceCommandResult` | memory relation command DTO/result |

### 13.2 本批问题回答

| 问题 | 回答 |
|---|---|
| role/capability active accepted 的最小条件是什么 | `resolve_role_capability_source(...)` 返回 `SourceResolved`,带同源 `source_version_ref` 和 `safe_summary_ref`;最终 evidence set 非空且 request evidence 均通过 `resolve_capability_evidence(...)`;`RoleCapabilitySourcePolicy` 全部通过 |
| role safe summary / evidence 多来源如何合并 | accepted 保存的 `safe_summary_ref` 优先使用 resolver 返回值;若 request 提供 safe summary,必须 `belongs_to_source(source_ref)` 且与 resolver 返回值同一或由 Step 10/12 明确兼容。accepted 保存的 evidence set 以 source resolver authoritative evidence refs 为准;request evidence refs 只作为必须验证并被 authoritative set 覆盖的约束 |
| role source unavailable/unrecognized/missing safe summary/missing evidence 是否写 Active | 否。不得 accepted `RoleCapabilitySummaryStateKind::Active`;是否保存 unavailable snapshot、rejected command result 或 dependency surface 由 Step 10/12/13 固化 |
| career duplicate source marker 如何处理 | `find_duplicate_source_record(source_marker_ref)` 命中时不新增 `CareerRecord`;返回 duplicate/no-op/replay surface 的 public 优先级留 Step 12/13,但 flow 固定 no-new-history |
| career pending review 是否可持久化 | 只有请求 `change_intent == MarkSourcePendingReview` 且 `WorkParticipationSourceSummary.requires_review()`、member/source marker/body-free guard 通过时,才允许 `CareerRecord::pending_review(...)` 写入 `SourcePendingReview`;普通 `AppendNew` / `AppendCorrection` 遇到 pending/untrusted/unavailable 不得 silent accepted |
| career correction 是否覆盖旧记录 | 否。correction 必须 `CareerRecord::correction_for_record(...)` 追加新 record;旧 record 最多在同一 transaction 中 `mark_superseded_by_correction(...)` 并 `save_career_record_state(...)`,不得删除或改写正文 |
| memory linked accepted 的最小条件是什么 | `resolve_memory_reference_source(...)` 返回 trusted source summary,至少有 memory/archive/handoff marker 之一,policy body-free/member/reference/source guard 通过;`Linked` / `Archived` / `HandoffPending` 等具体 state 映射由 Step 10 固化,但不得伪造 delivered |
| memory pending verification 是否可持久化 | 只有请求 `change_intent == MarkPendingVerification` 且 resolver summary `requires_verification()` 并至少有 formal marker 时,才允许写 `MemoryReferenceState::pending_verification(...)`;普通 link/refresh/archive 遇到 pending/untrusted/unavailable 不得 silent accepted |
| command accepted 是否等待 outbox publish / archive handoff delivered | 否。publish 和 handoff delivery 都是后续 job/callback boundary;本批 command 只保存 accepted truth/outbox marker |
| duplicate 如何 replay | idempotency duplicate 只能读取 stored command result/rejection replay;source duplicate 是业务 no-new-history,不能当作 idempotency duplicate |

### 13.3 当前材料诊断

| 事项 | 诊断 | 本批处理 |
|---|---|---|
| role source/evidence resolver | Step 7 已有 `resolve_role_capability_source` 和 `resolve_capability_evidence`;Step 6 snapshot/policy 支撑 active guard | 可展开 active accepted 主线;异常 public surface 留 Step 12 |
| role source snapshot expected_version | `find_source_snapshot_by_source` / `get_source_snapshot_with_version` 提供 version;create 用 `None` | 可直接落码;source version 不得当 optimistic version |
| career duplicate source | Step 7 已有 `find_duplicate_source_record` 和 append-only repo | 可闭合 duplicate no-new-history |
| career pending review | Step 6 有 `CareerRecord::pending_review(...)` 和 `SourcePendingReview`;Step 8 open 要求 Step 9/10/12 明确 | 本批只允许显式 pending intent 写 pending truth;其他 pending 分支不 accepted mainline |
| memory source summary | Step 7 已有 `resolve_memory_reference_source` / `resolve_archive_handoff_source`;Step 6 有 trusted/pending states 和 policy | 可展开 trusted/pending accepted rules;callback 冲突留 9.3 |
| reference bundle sidecar | 本批 command 不保存 external reference bundle sidecar;只保存 core truth relation/summary | 不调用 `IdentityReferenceStateRepository` 来补 source state |
| trace/audit/outbox/effect | Step 7 subject mapper覆盖 role/career/memory truth refs | 可写同源 accepted subject side effect 顺序 |

### 13.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| role source resolver 失败时仍用 request safe summary 建 active | 不采用 | 会绕过 source usability/evidence guard,违反 Step 6/8 |
| role request evidence 与 resolver evidence 简单并集 | 不采用 | 会让 caller 私加未被 resolver 认可的 evidence marker |
| career duplicate source 写第二条 `CareerRecord` 并标 duplicate | 不采用 | Step 6 明确 duplicate 不是 record state |
| career pending review 一律 rejected | 不采用 | Step 6 已有 `SourcePendingReview` factory/state;但必须由显式 pending intent 触发 |
| memory pending/unavailable 直接写 `Linked` | 不采用 | Step 6 明确 pending/unavailable 不得伪成功 |
| memory command 记录 handoff delivered | 不采用 | delivered 必须来自 formal receipt/result marker,由 callback/job 承接 |
| accepted 后立即 publish outbox 或调用 handoff delivery | 不采用 | outbound publish / handoff delivery 是 job boundary |

### 13.5 `MaintainRoleCapabilitySummaryFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityCommandRequest<MaintainRoleCapabilitySummaryRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_command(...)` |
| application service | `IdentityCommandService.maintain_role_capability_summary(request, context)` |
| 目标 object / policy | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` |
| 主要 port | `IdentityUnitOfWorkManagerPort`, `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityIdGeneratorPort`, `IdentityClockPort`, `GlobalMemberRepository`, `RoleCapabilityRepository`, `IdentityExternalSourceResolverPort`, `IdentityTruthChangeSubjectMapper`, `IdentityAcceptedAuditTrailMarkerMapper`, trace/audit/outbox/projection/effect repositories |
| accepted state | source snapshot = `SourceResolved`;summary = `Active` |
| rejected / non-active candidates | member missing, source unavailable/unrecognized/stale, missing source version, missing safe summary, missing/invalid evidence, forbidden body, automatic scoring material, duplicate idempotency conflict |

```text
[API command entry]
  | validate IdentityCommandRequest<MaintainRoleCapabilitySummaryRequest>
  | build IdentityOperationContext for command channel
  | dispatch_command(MaintainRoleCapabilitySummary)
  v
[IdentityCommandService.maintain_role_capability_summary]
  | uow = IdentityUnitOfWorkManagerPort.begin()
  | reserve idempotency(context, new_idempotency_record_ref, now, uow)
  | ReplayAvailable -> rollback uow, load stored result, return replay
  | Conflict / InFlight -> mark or return protocol surface per Step 12/13
  v
[Load member and current truth]
  | member_v = GlobalMemberRepository.get_member_with_version(request.member_ref)
  | missing member -> rejected not found;do not create member
  | requested_summary_v = if request.requested_summary_ref Some -> RoleCapabilityRepository.get_summary_with_version(ref) else None
  | current_by_member_v = RoleCapabilityRepository.find_current_summary_by_member(member_ref)
  | if requested_summary_v Some and current_by_member_v Some and refs differ -> rejected conflict;do not create second current summary
  | current_summary_v = requested_summary_v.or(current_by_member_v)
  | current_snapshot_v = RoleCapabilityRepository.find_source_snapshot_by_source(request.source_ref)
  v
[Resolve source and evidence]
  | source_resolution = IdentityExternalSourceResolverPort.resolve_role_capability_source(request.source_ref)
  | require source_resolution.source_ref.same_source(request.source_ref)
  | require source_resolution.source_state == SourceResolved
  | require source_resolution.source_version_ref Some and belongs_to(request.source_ref)
  | require source_resolution.material_marker.is_safe_marker_only()
  | effective_safe_summary_ref = source_resolution.safe_summary_ref
  |   require Some and belongs_to_source(request.source_ref)
  | if request.safe_summary_ref Some -> require same source and compatible with effective_safe_summary_ref
  | authoritative_evidence_refs = source_resolution.evidence_refs
  | require authoritative_evidence_refs not empty for active accepted
  | for each request.evidence_ref:
  |   evidence_resolution = resolve_capability_evidence(evidence_ref)
  |   require evidence_resolution.evidence_ref.same_evidence(evidence_ref)
  |   require evidence_ref is contained in authoritative_evidence_refs
  v
[Domain guard]
  | now = IdentityClockPort.now()
  | snapshot_ref = current_snapshot_v.object.snapshot_ref or new_role_capability_source_snapshot_id -> RoleCapabilitySourceSnapshotRef::from_id(...)
  | snapshot = RoleCapabilitySourceSnapshot::from_resolved_source(snapshot_ref, request.source_ref, source_version_ref, effective_safe_summary_ref, authoritative_evidence_refs, now)
  | policy = RoleCapabilitySourcePolicy::for_summary_update(member_ref, snapshot, authoritative_evidence_refs, request.change_reason_ref, context.actor_ref, context.channel, request.change_material_marker)
  | policy.assert_member_exists()
  | policy.assert_no_forbidden_body()
  | policy.assert_not_automatic_scoring()
  | policy.assert_source_or_evidence_present()
  | policy.assert_source_usable()
  | apply the same material guard to source_resolution.material_marker;resolver marker must not be forbidden or automatic scoring
  v
[Domain transition]
  | summary_ref =
  |   if current_summary_v Some -> current_summary_v.object.summary_ref
  |   else if request.requested_summary_ref Some -> requested ref
  |   else new_role_capability_summary_id -> RoleCapabilitySummaryRef::from_id(...)
  | if current_summary_v None:
  |   summary = RoleCapabilitySummary::create_for_member(summary_ref, member_ref, snapshot, effective_safe_summary_ref, authoritative_evidence_refs, context.actor_ref, now)
  |   if request.role_source_ref Some -> require canonical source same as request.source_ref, call attach_role_source(...)
  |   call update_capability_summary(request.capability_source_refs, authoritative_evidence_refs, effective_safe_summary_ref, context.actor_ref, now)
  | else:
  |   require current_summary.belongs_to(member_ref)
  |   if request.role_source_ref Some -> require canonical source same as request.source_ref, call attach_role_source(...)
  |   call update_capability_summary(request.capability_source_refs, authoritative_evidence_refs, effective_safe_summary_ref, context.actor_ref, now)
  v
[Persist accepted truth]
  | RoleCapabilityRepository.save_source_snapshot(snapshot, current_snapshot_v.version or None, uow)
  | RoleCapabilityRepository.save_summary(summary, current_summary_v.version or None, uow)
  | cursor = uow.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.role_capability_subjects(summary_ref)
  | append IdentityTraceRecord::from_accepted_change(...)
  | run Shared accepted audit append subflow with context, subjects, change_kind_ref, cursor, trace_record_ref, member_ref
  | create IdentityOutboxRecord::from_accepted_change(...) for role/capability material
  | affected = IdentityProjectionRepository.expand_affected_projection_refs(subjects)
  | mark each affected projection stale
  | save IdentityCommandEffectSummary::from_accepted_change(...)
  | save StoredIdentityOperationResult::command_accepted(...) generic shell
  | save IdentityCommandAcceptedResultEnvelope for RoleCapabilityCommandResult + effect
  | complete idempotency with stored_result_ref
  | commit
```

#### 13.5.1 Active accepted precheck

| Precheck | Required source | Failure handling |
|---|---|---|
| member exists | `GlobalMemberRepository.get_member_with_version` | rejected/not found;no summary create |
| source resolved | `resolve_role_capability_source` | non-`SourceResolved` cannot accepted `Active`;public mapping Step 12 |
| source version present | resolver `source_version_ref` | missing version cannot create any `RoleCapabilitySourceSnapshot`;resolved / unavailable / unrecognized snapshot factories all require source version |
| safe summary present | resolver `safe_summary_ref` | missing safe summary cannot accepted `Active` |
| request safe summary compatible | `RoleCapabilitySafeSummaryRef.belongs_to_source(...)` and same marker if supplied | mismatch rejected;no fallback to request body |
| evidence verified | `resolve_capability_evidence` for request refs + authoritative resolver evidence set | missing/invalid/uncovered evidence rejected/pending per Step 12;no active write |
| no forbidden body/scoring | `RoleCapabilitySourcePolicy` | rejected before truth save |

#### 13.5.2 Accepted side effect order

| Step | Required source | Notes |
|---|---|---|
| save source snapshot | `RoleCapabilityRepository.save_source_snapshot(snapshot, expected_version, uow)` | expected_version from loaded snapshot;create `None` |
| save summary | `RoleCapabilityRepository.save_summary(summary, expected_version, uow)` | expected_version from loaded summary;create `None` |
| assign cursor | UoW truth cursor | source version/time not cursor |
| map subject | `IdentityTruthChangeSubjectMapper.role_capability_subjects(summary_ref)` | one canonical key for trace/audit/outbox |
| trace/audit | accepted refs only;audit scope/visibility markers come from `IdentityAcceptedAuditTrailMarkerMapper` | no role/capability/evidence body;no query visibility/default visible marker |
| outbox | `RoleCapabilitySummaryChanged` accepted material;source state material audited in 9.4 | payload marker only |
| projection stale | repository expansion | no ad hoc member summary view ref |
| effect/stored result | accepted command effect + stored result | replay source |

#### 13.5.3 Rejected / duplicate branches

| Branch | Handling |
|---|---|
| duplicate same key/digest completed | rollback current UoW;load stored result;return replay |
| same key/different digest | conflict surface per Step 13;no resolver replay after conflict |
| member missing | rejected not found;do not create member |
| requested summary ref exists for another member | rejected conflict/policy denied |
| requested summary ref missing but current summary exists for member | update current summary;do not create second current summary |
| requested summary ref differs from current-by-member summary | rejected conflict;do not guess current uniqueness |
| source unavailable / unrecognized / stale | not accepted active;may save unavailable/unrecognized snapshot only when resolver provides same-source `source_version_ref` and Step 10/12/13 classifies a formal non-active command result |
| missing safe summary / source version / evidence | not accepted active;no summary save |
| forbidden body / automatic scoring material | rejected forbidden body;no trace/outbox/effect for accepted |
| repository/transaction failure | rollback;return `ApplicationError`;do not convert to protocol rejected |

#### 13.5.4 Test cuts

| Test cut | Expected |
|---|---|
| create active summary | resolved source + safe summary + evidence creates snapshot and summary active |
| update active summary | loaded summary version used;source snapshot version used;no source version as expected_version |
| request evidence not in authoritative set | rejected/non-active;no summary save |
| request safe summary wrong source | rejected;no snapshot/summary save |
| source unavailable | no active summary;public surface Step 12 |
| forbidden body marker | rejected before repository save |
| duplicate replay | no second resolver call;stored result replay only |

### 13.6 `AppendCareerRecordFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityCommandRequest<AppendCareerRecordRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_command(...)` |
| application service | `IdentityCommandService.append_career_record(request, context)` |
| 目标 object / policy | `CareerRecord`, `CareerAppendPolicy` |
| 主要 port | `IdentityUnitOfWorkManagerPort`, `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityIdGeneratorPort`, `IdentityClockPort`, `GlobalMemberRepository`, `CareerRecordRepository`, `IdentityExternalSourceResolverPort`, `IdentityTruthChangeSubjectMapper`, `IdentityAcceptedAuditTrailMarkerMapper`, trace/audit/outbox/projection/effect repositories |
| accepted state | `Appended`, `CorrectionAppended`,or explicit `SourcePendingReview` |
| rejected / no-op candidates | member missing, duplicate source marker, source unresolved/untrusted/unavailable for mainline append, correction original missing, forbidden in-place update/delete/reorder, forbidden work body |

```text
[API command entry]
  | validate IdentityCommandRequest<AppendCareerRecordRequest>
  | build IdentityOperationContext for command channel
  | dispatch_command(AppendCareerRecord)
  v
[IdentityCommandService.append_career_record]
  | uow = IdentityUnitOfWorkManagerPort.begin()
  | reserve idempotency(context, new_idempotency_record_ref, now, uow)
  | ReplayAvailable -> rollback uow, load stored result, return replay
  | Conflict / InFlight -> mark or return protocol surface per Step 12/13
  v
[Load and resolve]
  | member_v = GlobalMemberRepository.get_member_with_version(request.member_ref)
  | missing member -> rejected not found;do not create member
  | source_summary = IdentityExternalSourceResolverPort.resolve_work_participation(request.work_source_ref)
  | require source_summary.work_source_ref.same_source(request.work_source_ref)
  | require source_summary.source_marker_ref.same_marker(request.source_marker_ref)
  | duplicate_ref = CareerRecordRepository.find_duplicate_source_record(request.source_marker_ref)
  | if duplicate_ref Some -> no-new-history branch;do not append new record
  | if request.original_record_ref Some -> original_v = CareerRecordRepository.get_career_record(original_ref)
  v
[Policy branch]
  | if request.change_intent == AppendCorrection:
  |   require original_v Some and original.member_ref == request.member_ref
  |   policy = CareerAppendPolicy::for_correction(member_ref, true, source_summary, empty duplicate refs, reason, actor, channel, material)
  | else:
  |   policy = CareerAppendPolicy::for_append(member_ref, true, source_summary, duplicate refs, reason, actor, channel, request.change_intent, material)
  | policy.assert_member_exists()
  | policy.assert_not_work_truth_write()
  | policy.assert_allowed_write_channel()
  | policy.assert_append_only()
  | policy.assert_not_duplicate()
  v
[Domain transition]
  | now = IdentityClockPort.now()
  | record_ref = request.requested_career_record_ref or new_career_record_id -> CareerRecordRef::from_id(...)
  | if request.change_intent == AppendNew:
  |   policy.assert_source_trusted()
  |   record = CareerRecord::append_from_work_source(record_ref, member_ref, source_summary, reason, actor, now)
  | if request.change_intent == AppendCorrection:
  |   policy.assert_source_trusted()
  |   record = CareerRecord::correction_for_record(record_ref, original_ref, member_ref, source_summary, reason, actor, now)
  |   original.mark_superseded_by_correction(record_ref, actor, now)
  | if request.change_intent == MarkSourcePendingReview:
  |   require source_summary.requires_review()
  |   record = CareerRecord::pending_review(record_ref, member_ref, source_summary, reason, actor, now)
  v
[Persist accepted truth]
  | CareerRecordRepository.append_career_record(record, uow)
  | if correction -> CareerRecordRepository.save_career_record_state(original, original_v.version, uow)
  | cursor = uow.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.career_record_subjects(record_ref)
  | append IdentityTraceRecord::from_accepted_change(...)
  | run Shared accepted audit append subflow with context, subjects, change_kind_ref, cursor, trace_record_ref, member_ref
  | create IdentityOutboxRecord::from_accepted_change(...) for career material
  | affected = IdentityProjectionRepository.expand_affected_projection_refs(subjects)
  | mark each affected projection stale
  | save IdentityCommandEffectSummary::from_accepted_change(...)
  | save StoredIdentityOperationResult::command_accepted(...) generic shell
  | save IdentityCommandAcceptedResultEnvelope for CareerRecordCommandResult + effect
  | complete idempotency with stored_result_ref
  | commit
```

#### 13.6.1 Duplicate / pending rules

| Case | Rule |
|---|---|
| idempotency duplicate same key/digest | replay stored command result;do not call resolver/repository mutation |
| business duplicate same `CareerSourceMarkerRef` | no new `CareerRecord`;public no-op/conflict/replay priority Step 12/13 |
| `AppendNew` with `Trusted` source | append `CareerRecordStateKind::Appended` |
| `AppendCorrection` with trusted source and existing original | append `CorrectionAppended`;optionally mark original `SupersededByCorrection` |
| `MarkSourcePendingReview` with pending/unresolved/untrusted source | append `SourcePendingReview` only when marker/source/body-free guards pass |
| `AppendNew` / `AppendCorrection` with pending/untrusted/unavailable source | not accepted mainline;no appended/correction record |
| forbidden update/delete/reorder | rejected before append |

#### 13.6.2 Accepted side effect order

| Step | Required source | Notes |
|---|---|---|
| append career record | `CareerRecordRepository.append_career_record(record, uow)` | append-only;no expected_version |
| save original superseded state | correction only;`save_career_record_state(original, original_v.version, uow)` | expected_version from loaded original |
| assign cursor | UoW truth cursor | not source marker/idempotency key |
| map subject | `IdentityTruthChangeSubjectMapper.career_record_subjects(record_ref)` | accepted new record is canonical subject |
| trace/audit | accepted append/correction/pending marker;audit scope/visibility markers come from `IdentityAcceptedAuditTrailMarkerMapper` | no work body;no query visibility/default visible marker |
| outbox | `CareerRecordAppended` for normal append;`CareerCorrectionAppended` for correction append | no original superseded event unless Step 8 is extended |
| projection stale | repository expansion by subject | no direct member summary view ref |
| effect/stored result | accepted command effect + stored result | duplicate replay source |

#### 13.6.3 Rejected / duplicate branches

| Branch | Handling |
|---|---|
| duplicate same idempotency key/digest completed | rollback current UoW;load stored result;return replay |
| same idempotency key/different digest | conflict surface per Step 13 |
| source marker duplicate | no new record;Step 12/13 decides no-op vs conflict vs replayable rejected |
| member missing | rejected not found;do not create member |
| source marker mismatch resolver vs request | rejected invalid/policy denied;no append |
| source unavailable for mainline append | not accepted mainline;exact dependency surface Step 12 |
| correction original missing or belongs to other member | rejected not found/policy denied |
| original supersede save conflict | rollback;do not leave correction-only commit |
| forbidden work body / in-place mutation | rejected forbidden body/policy denied before truth save |

#### 13.6.4 Test cuts

| Test cut | Expected |
|---|---|
| append trusted source | creates one `Appended` record with safe marker and source marker |
| duplicate source marker | no second career record |
| correction append | creates new `CorrectionAppended` record and marks original superseded in same transaction |
| correction original missing | rejected;no new record |
| pending explicit intent | `MarkSourcePendingReview` creates `SourcePendingReview` only with pending source marker |
| pending source with append intent | not accepted mainline;no record |
| forbidden ProjectMember body | rejected before resolver-save side effects |
| duplicate replay | no resolver/repository mutation;stored result replay only |

### 13.7 `MaintainMemoryReferenceFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityCommandRequest<MaintainMemoryReferenceRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_command(...)` |
| application service | `IdentityCommandService.maintain_memory_reference(request, context)` |
| 目标 object / policy | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` |
| 主要 port | `IdentityUnitOfWorkManagerPort`, `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityIdGeneratorPort`, `IdentityClockPort`, `GlobalMemberRepository`, `MemoryReferenceRepository`, `IdentityExternalSourceResolverPort`, `IdentityTruthChangeSubjectMapper`, `IdentityAcceptedAuditTrailMarkerMapper`, trace/audit/outbox/projection/effect repositories |
| accepted state | `Linked`, `Stale`, `Unavailable`, `Archived`, `HandoffPending`, `HandoffFailed`,or explicit `PendingVerification` as allowed by Step 6/10 |
| rejected / non-success candidates | member missing, all refs missing, source untrusted/unavailable for link, handoff marker mismatch, external owner write/delete, forbidden memory/archive/receipt body |

```text
[API command entry]
  | validate IdentityCommandRequest<MaintainMemoryReferenceRequest>
  | build IdentityOperationContext for command channel
  | dispatch_command(MaintainMemoryReference)
  v
[IdentityCommandService.maintain_memory_reference]
  | uow = IdentityUnitOfWorkManagerPort.begin()
  | reserve idempotency(context, new_idempotency_record_ref, now, uow)
  | ReplayAvailable -> rollback uow, load stored result, return replay
  | Conflict / InFlight -> mark or return protocol surface per Step 12/13
  v
[Load and resolve]
  | member_v = GlobalMemberRepository.get_member_with_version(request.member_ref)
  | missing member -> rejected not found;do not create member
  | source_summary =
  |   if request.change_intent == RecordArchiveHandoffResult and archive_handoff_ref Some:
  |     resolve_archive_handoff_source(archive_handoff_ref)
  |   else:
  |     resolve_memory_reference_source(request.source_ref)
  | require source_summary.source_ref == request.source_ref or formal handoff summary source matches request marker
  | require source_summary.has_reference() or request has memory/archive/handoff marker
  | existing_relation_v =
  |   requested_memory_reference_ref -> get_memory_reference_with_version
  |   else memory_ref Some -> find_reference_by_memory(member_ref, memory_ref)
  |   else archive_ref Some -> find_reference_by_archive(member_ref, archive_ref)
  |   else archive_handoff_ref Some -> find_reference_by_handoff(handoff_ref)
  v
[Policy guard]
  | policy =
  |   LinkMemory -> MemoryReferencePolicy::for_link(...)
  |   RefreshState -> MemoryReferencePolicy::for_refresh(...)
  |   AttachArchive / RecordArchiveHandoffResult / MarkPendingVerification -> MemoryReferencePolicy::for_archive_handoff(...) or for_refresh(...) as Step 10 matrix fixes
  | policy.assert_member_exists()
  | policy.assert_reference_present()
  | policy.assert_body_free()
  | policy.assert_handoff_marker_body_free()
  | policy.assert_not_external_owner_write()
  | policy.assert_allowed_write_channel()
  v
[Domain transition]
  | now = IdentityClockPort.now()
  | reference_ref =
  |   existing_relation_v.object.memory_reference_ref
  |   else request.requested_memory_reference_ref
  |   else new_memory_reference_id -> MemoryReferenceRef::from_id(...)
  | if change_intent == LinkMemory:
  |   policy.assert_source_trusted()
  |   if existing none -> reference = MemoryReference::link_for_member(reference_ref, member_ref, source_summary, reason, actor, now)
  |   else -> existing.update_reference_state(MemoryReferenceState::linked(memory_ref, reason, now), reason, actor, now)
  | if change_intent == RefreshState:
  |   require existing_relation_v Some
  |   build state from source_summary.source_state per Step 10 matrix
  |   existing.update_reference_state(state, reason, actor, now)
  | if change_intent == AttachArchive:
  |   require archive_ref and archive_handoff_ref
  |   if existing none -> reference = MemoryReference::from_archive_handoff(...)
  |   else -> existing.attach_archive_ref(archive_ref, handoff_ref, reason, actor, now)
  | if change_intent == RecordArchiveHandoffResult:
  |   require handoff marker;do not mark delivered
  |   build archived/handoff_failed/handoff_pending relation state from body-free summary per Step 10
  |   create or update relation via from_archive_handoff/update_reference_state
  | if change_intent == MarkPendingVerification:
  |   require source_summary.requires_verification()
  |   state = MemoryReferenceState::pending_verification(memory_ref, archive_ref, handoff_ref, reason, now)
  |   create or update relation with pending state
  v
[Persist accepted truth]
  | MemoryReferenceRepository.save_memory_reference(reference, existing_relation_v.version or None, uow)
  | cursor = uow.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.memory_reference_subjects(reference_ref)
  | append IdentityTraceRecord::from_accepted_change(...)
  | run Shared accepted audit append subflow with context, subjects, change_kind_ref, cursor, trace_record_ref, member_ref
  | create IdentityOutboxRecord::from_accepted_change(...) for memory reference material
  | affected = IdentityProjectionRepository.expand_affected_projection_refs(subjects)
  | mark each affected projection stale
  | save IdentityCommandEffectSummary::from_accepted_change(...)
  | save StoredIdentityOperationResult::command_accepted(...) generic shell
  | save IdentityCommandAcceptedResultEnvelope for MemoryReferenceCommandResult + effect
  | complete idempotency with stored_result_ref
  | commit
```

#### 13.7.1 Relation state rules for this batch

| Case | Rule |
|---|---|
| `LinkMemory` + trusted source + memory ref | create/update `Linked`;no memory body |
| `RefreshState` + existing relation | update state from formal source summary;missing relation rejected/not found |
| `AttachArchive` | require archive ref + handoff marker;state mapping to `Archived` / `HandoffPending` belongs Step 10,but no package/receipt body |
| `RecordArchiveHandoffResult` | command may record body-free handoff marker state,but never `Delivered`;delivery belongs 6.5 callback/job |
| `MarkPendingVerification` | may write `PendingVerification` only when source summary requires verification and at least one formal marker exists |
| source unavailable/untrusted with ordinary link | not accepted `Linked`;public dependency/rejected surface Step 12 |
| all refs missing | rejected invalid;no relation create |

#### 13.7.2 Accepted side effect order

| Step | Required source | Notes |
|---|---|---|
| save memory relation | `MemoryReferenceRepository.save_memory_reference(reference, expected_version, uow)` | expected_version from loaded relation;create `None` |
| assign cursor | UoW truth cursor | source/handoff marker not cursor |
| map subject | `IdentityTruthChangeSubjectMapper.memory_reference_subjects(reference_ref)` | one canonical key for trace/audit/outbox |
| trace/audit | accepted relation refs/state only;audit scope/visibility markers come from `IdentityAcceptedAuditTrailMarkerMapper` | no memory/archive/receipt body;no query visibility/default visible marker |
| outbox | `MemoryReferenceChanged`;archive/handoff relation state may also create `MemoryArchiveHandoffStateChanged` per 9.4 rule | payload marker only |
| projection stale | repository expansion | no ad hoc member summary view ref |
| effect/stored result | accepted command effect + stored result | replay source |

#### 13.7.3 Rejected / duplicate branches

| Branch | Handling |
|---|---|
| duplicate same key/digest completed | rollback current UoW;load stored result;return replay |
| same key/different digest | conflict surface per Step 13 |
| member missing | rejected not found;do not create member |
| all memory/archive/handoff refs missing | rejected invalid request;no relation |
| requested relation belongs to another member | rejected policy denied/conflict |
| source untrusted/unavailable for `LinkMemory` | not accepted linked;exact public mapping Step 12 |
| refresh missing relation | rejected not found;query/job must not create relation |
| handoff marker mismatch | rejected invalid/policy denied;do not use raw receipt |
| forbidden memory/archive/package/receipt body | rejected forbidden body before truth save |
| repository/transaction failure | rollback;return `ApplicationError` |

#### 13.7.4 Test cuts

| Test cut | Expected |
|---|---|
| link trusted memory | creates `MemoryReference` with `Linked` state and body-free refs |
| refresh existing relation | uses loaded version;updates state only through domain method |
| attach archive | requires archive + handoff markers;does not save package body |
| pending verification explicit intent | writes `PendingVerification` only with formal marker and requires verification source |
| ordinary link pending source | not accepted linked;no relation create/update |
| all refs missing | rejected before save |
| forbidden receipt body | rejected;no trace/outbox/effect |
| duplicate replay | stored result replay only |

### 13.8 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.1-b 范围 | 通过 | 只展开 role/career/memory command |
| DTO 是否回指 Step 8 | 通过 | 使用三个 Step 8 command request/result |
| Domain 是否回指 Step 6 | 通过 | role summary/source policy、career append policy、memory reference policy 均已定义 |
| Port 是否回指 Step 7 | 通过 | member/role/career/memory repo、source resolver、UoW、idempotency、stored result、trace/audit/outbox/projection/effect 均已定义 |
| role active accepted 是否闭合 | 通过 | 固定 SourceResolved + source version + safe summary + authoritative evidence |
| career duplicate 是否闭合 | 通过 | source duplicate no-new-history;不写 duplicate record state |
| career pending review 是否越界 | 未越界 | 只允许显式 pending intent 写 Step 6 已有 state;public priority 留 Step 12/13 |
| memory pending verification 是否越界 | 未越界 | 只允许显式 pending intent 写 Step 6 已有 state;callback/result 冲突留 9.3 |
| expected_version 来源是否闭合 | 通过 | role snapshot/summary 与 memory relation 用 loaded version;career append-only create 无 expected_version;correction original 用 loaded version |
| duplicate replay 是否闭合 | 通过 | idempotency duplicate stored result only;business duplicate source 不重跑 mutation |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 13.9 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Role / career / memory command flows

`MaintainRoleCapabilitySummaryFlow` 只在 role/capability source resolver 返回 `SourceResolved`、source version、同源 safe summary 和 authoritative evidence refs 时 accepted `Active` summary。request evidence 只作为必须验证并被 authoritative set 覆盖的约束,不得让 caller 私加 evidence。source unavailable/unrecognized、missing safe summary、missing evidence 或 forbidden material 不得 accepted active。

`AppendCareerRecordFlow` 保持 append-only。idempotency duplicate 只能 replay stored result;business duplicate `CareerSourceMarkerRef` 不新增 `CareerRecord`。correction 通过追加 `CorrectionAppended` record 表达,旧 record 只可在同一 transaction 中标记 `SupersededByCorrection`。`SourcePendingReview` 只由显式 pending intent 与 formal pending source marker 写入。

`MaintainMemoryReferenceFlow` 只保存 body-free memory/archive/handoff relation refs 和 relation state,不得保存 memory body、embedding、archive package 或 receipt body。ordinary link 需要 trusted source;pending verification 只由显式 pending intent 与 formal marker 写入;handoff delivered 不在 command 中伪造,由 callback/job boundary 承接。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 13.10 进入下一批条件

进入 9.1-c 前必须满足:

- 用户审核通过 9.1-b。
- 9.1-c 只写 `PrepareTraceHandoffFlow`。
- handoff command 不得复用 memory relation state 伪造 delivery state。
- handoff command 只能创建 `TraceHandoffIntent` / `HandoffState` intent marker,不得调用 delivery port 或保存 external receipt/package body。
- 若 target visibility、safe material marker、handoff target resolver、stored result 或 projection stale subject 不闭合,必须暂停回 Step 6/7/8/12/13,不得在 flow 中私补。

---

## 14. Command flow batch 9.1-c: handoff command

本批只覆盖一个 command:

- `PrepareTraceHandoffFlow`

本批承接 9.0 shared command transaction discipline,但将 trace / audit / archive handoff prepare 的 target、scope、safe material、visibility、pending intent、accepted trace/audit/effect 和 duplicate replay 展开到可落码粒度。本批不写 `GetTraceHandoffStateFlow`,不写 `HandleTraceHandoffResultFlow`,不写 `DeliverTraceHandoffFlow`,不写 `RetryIdentityPropagationFailuresFlow`,不写 Step 10 完整状态矩阵,不写 Step 12 public error priority,不写 Step 13 幂等矩阵。

### 14.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `TraceHandoffIntent` / `HandoffState` / `HandoffPolicy` | pending handoff intent、target/scope/safe material guard、no fake delivered |
| Step 6 `IdentityTraceRecord` / `AuditTrail` | handoff trace selection、optional audit trail binding、body-free trace/audit refs |
| Step 6 `IdentityCommandEffectSummary` | accepted cursor、trace/audit/stale/stored refs;handoff intent ref 作为 primary typed ref;outbox refs 可为空 |
| Step 7 `TraceHandoffIntentRepository` | pending intent create、versioned future update、by trace/audit/target indexes |
| Step 7 `IdentityTraceRecordRepository` / `IdentityAuditTrailRepository` | trace refs existence/member guard、optional audit trail existence/body-free binding |
| Step 7 `IdentityHandoffTargetPort.resolve_handoff_target(...)` | target/scope/safe material validation;只返回 boundary marker,不执行 delivery |
| Step 7 id/clock/UoW/idempotency/stored result/effect/trace/audit/projection ports | accepted transaction side effects and duplicate replay |
| Step 8 `PrepareTraceHandoffRequest` / `TraceHandoffCommandResult` | handoff command DTO/result |
| Step 8 outbound event inventory | 当前无 `TraceHandoffIntentPrepared` payload;本 flow accepted 不创建 outbox |

### 14.2 本批问题回答

| 问题 | 回答 |
|---|---|
| prepare 是否是业务 truth accepted | 是,但它只 accepted 一个 identity-owned `TraceHandoffIntent` / `HandoffState::PendingHandoff` operations truth,不改变 `GlobalMember`、lifecycle、role、career 或 memory truth |
| prepare 是否执行 delivery | 否。不得调用 `IdentityHandoffDeliveryPort.deliver_handoff(...)`;delivery 只属于后续 job / callback flow |
| target resolver 返回成功是否等于 delivered | 否。`resolve_handoff_target(...)` 只证明 target/scope/safe material 可尝试,不产生 attempt / receipt,不得标记 `Delivered` |
| trace refs 如何校验 | request trace refs 必须非空;每个 ref 通过 `IdentityTraceRecordRepository.get_trace_record(...)` 读取,必须存在且 `trace.belongs_to(member_ref)` |
| audit trail 如何校验 | 若 request 带 `audit_trail_ref`,必须通过 `IdentityAuditTrailRepository.get_audit_trail_with_version(...)` 读取存在;若 trail 带 member scope,必须与 request member 一致;不得从 audit subject 字符串拼 trail ref |
| safe material 如何校验 | 先用 `HandoffPolicy.assert_safe_material_body_free(...)`,再用 `IdentityHandoffTargetPort.resolve_handoff_target(target, scope, safe_material)` 确认 target boundary;不得读取或保存 trace body、audit raw log、archive package、target secret 或 receipt body |
| visibility 如何处理 | `HandoffPolicy.assert_visible_for_handoff(...)` 使用 request `visibility_context_ref`;字段级 denied / redaction public surface 留 Step 12/16,但本 flow 不得 handoff invisible material |
| accepted 是否创建 outbox | 否。Step 8 当前十条 canonical outbound event 没有 `TraceHandoffIntentPrepared` payload;`IdentityCommandEffectPublicSummary.outbox_refs = []`。不得复用 `MemoryArchiveHandoffStateChangedPayload`,因为 prepare 没有 `ArchiveHandoffRef` / receipt / issue marker |
| accepted 是否 mark projection stale | 是,仅对正式 affected projection lookup 返回的 handoff/member read projections 标 stale;不得拼 projection ref。若 repository expansion 为空,stale refs 可为空 |
| duplicate 如何 replay | idempotency duplicate 只能读取 stored command result;不得重新读取 trace/audit、重新解析 target 或创建第二个 intent |

### 14.3 当前材料诊断

| 事项 | 诊断 | 本批处理 |
|---|---|---|
| handoff target/scope resolver | Step 7 已有 `IdentityHandoffTargetPort.resolve_handoff_target(...)`,且返回 body-free boundary marker | 可作为 accepted precheck;不等于 delivery |
| handoff delivery port | Step 7 已有 `IdentityHandoffDeliveryPort.deliver_handoff(...)`,但 Step 8 明确 prepare 不调用 | 本批禁止调用 |
| handoff intent repository | Step 7 `save_handoff_intent(intent, None, uow)` 支撑 create pending intent | 可直接展开 |
| trace member ownership | Step 6 `IdentityTraceRecord.belongs_to(member_ref)` 和 Step 7 `get_trace_record(...)` 支撑逐 ref 校验 | 可直接展开;不从 subject string 推断 |
| audit trail relation | Step 7 有 typed `get_audit_trail_with_version(...)`;Step 6 有 optional member scope | 可校验存在和 optional member一致;不拼 audit ref |
| accepted outbox | Step 8 outbound inventory 无 `TraceHandoffIntentPrepared` | 本批固定 no outbox,public effect outbox refs 为空 |
| effect primary ref | Step 6 已补 `IdentityTruthRef` 可承接 handoff intent typed ref | 可保存 effect summary |

### 14.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| prepare 内直接 deliver 并按 adapter success 标 delivered | 不采用 | Step 6/8 明确 Delivered 必须来自 formal receipt marker;target resolution / HTTP success 不等于 delivered |
| prepare accepted 后创建 `MemoryArchiveHandoffStateChanged` outbox | 不采用 | 该 payload 需要 archive handoff marker;pure trace handoff prepare 无法 1:1 填字段 |
| 为 prepare 私增 `TraceHandoffIntentPrepared` event | 不采用 | Step 8 outbound inventory 已固定十条;新增事件必须回 Step 8/9.4/14 |
| accepted effect summary 允许 outbox refs 为空 | 采用 | Step 6 effect field 是 Vec;本 flow 无 canonical outbound payload,但仍需要 cursor、trace、audit、stale、stored replay |
| target resolver unavailable 降级为 pending intent | 不采用 | pending intent 表示已通过 target/material/visibility guard;target unavailable/unsupported 不能 accepted pending |
| 允许 request supplied handoff intent ref 并覆盖 existing intent | 不采用 | supplied ref 只作为 create identity;若 repository 已存在同 ref,应 conflict / duplicate surface,不能覆盖 |

### 14.5 `PrepareTraceHandoffFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityCommandRequest<PrepareTraceHandoffRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_command(...)` |
| application service | `IdentityCommandService.prepare_trace_handoff(request, context)` |
| 目标 object / policy | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` |
| 主要 port | `IdentityUnitOfWorkManagerPort`, `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityIdGeneratorPort`, `IdentityClockPort`, `GlobalMemberRepository`, `IdentityTraceRecordRepository`, `IdentityAuditTrailRepository`, `TraceHandoffIntentRepository`, `IdentityHandoffTargetPort`, `IdentityTruthChangeSubjectMapper`, `IdentityAcceptedAuditTrailMarkerMapper`, trace/audit/projection/effect repositories |
| accepted state | `HandoffStateKind::PendingHandoff` |
| accepted outbox | none;`effect.outbox_refs = []` |
| rejected candidates | member missing, empty trace refs, trace missing/member mismatch, audit missing/member mismatch, target unsupported/unavailable/disabled, forbidden safe material, not visible for handoff, requested intent ref already exists, same key/different digest |

```text
[API command entry]
  | validate IdentityCommandRequest<PrepareTraceHandoffRequest>
  | build IdentityOperationContext for command channel
  | dispatch_command(PrepareTraceHandoff)
  v
[IdentityCommandService.prepare_trace_handoff]
  | uow = IdentityUnitOfWorkManagerPort.begin()
  | reserve idempotency(context, new_idempotency_record_ref, now, uow)
  | ReplayAvailable -> rollback uow, load stored result, return replay
  | Conflict / InFlight -> mark or return protocol surface per Step 12/13
  v
[Load member, traces and optional audit]
  | member_v = GlobalMemberRepository.get_member_with_version(request.member_ref)
  | missing member -> rejected not found;do not create member
  | require request.trace_record_refs not empty
  | for each trace_ref in request.trace_record_refs:
  |   trace_v = IdentityTraceRecordRepository.get_trace_record(trace_ref)
  |   missing -> rejected not found
  |   require trace_v.object.belongs_to(request.member_ref)
  | if request.audit_trail_ref Some:
  |   audit_v = IdentityAuditTrailRepository.get_audit_trail_with_version(audit_trail_ref)
  |   missing -> rejected not found
  |   if audit_v.object.member_ref Some -> require equals request.member_ref
  | if request.requested_handoff_intent_ref Some:
  |   existing_intent = TraceHandoffIntentRepository.get_handoff_intent_with_version(ref)
  |   existing Some -> rejected conflict or duplicate surface per Step 12/13;do not overwrite
  v
[Policy and target precheck]
  | policy = HandoffPolicy::for_handoff(target_ref, scope_ref, safe_material_ref, trace_record_refs, visibility_context_ref)
  | policy.assert_target_allowed()
  | policy.assert_trace_refs_present()
  | policy.assert_safe_material_body_free()
  | policy.assert_visible_for_handoff()
  | target_resolution = IdentityHandoffTargetPort.resolve_handoff_target(target_ref, scope_ref, safe_material_ref)
  | require target_resolution.target_ref == request.handoff_target_ref
  | require target_resolution.scope_ref == request.handoff_scope_ref
  | do not call IdentityHandoffDeliveryPort.deliver_handoff(...)
  v
[Domain transition]
  | now = IdentityClockPort.now()
  | handoff_intent_ref =
  |   request.requested_handoff_intent_ref
  |   else new_trace_handoff_intent_ref()
  | state = HandoffState::pending(now)
  | intent = TraceHandoffIntent::prepare(
  |   handoff_intent_ref,
  |   request.member_ref,
  |   request.trace_record_refs,
  |   request.audit_trail_ref,
  |   request.handoff_target_ref,
  |   request.handoff_scope_ref,
  |   request.safe_material_ref,
  |   state,
  |   now
  | )
  v
[Persist accepted intent and side effects]
  | TraceHandoffIntentRepository.save_handoff_intent(intent, None, uow)
  | cursor = uow.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.handoff_intent_subjects(handoff_intent_ref)
  | handoff_trace = IdentityTraceRecord::from_accepted_change(..., request.member_ref, subjects.trace_subject_ref, subjects.audit_subject_ref, HandoffPrepared change kind, cursor, handoff_reason_ref, actor, now)
  | IdentityTraceRecordRepository.append_trace_record(handoff_trace, uow)
  | run Shared accepted audit append subflow with context, subjects, HandoffPrepared change_kind_ref, cursor, handoff_trace.ref, request.member_ref
  | outbox_refs = []
  | affected = IdentityProjectionRepository.expand_affected_projection_refs(subjects)
  | mark each affected projection stale with cursor
  | save StoredIdentityOperationResult::command_accepted(...) generic shell for TraceHandoffCommandResult
  | effect = IdentityCommandEffectSummary::from_accepted_change(context_ref, IdentityTruthRef::TraceHandoffIntent(handoff_intent_ref), cursor, trace_refs=[handoff_trace.ref], audit_trail_ref, outbox_refs=[], stale_projection_refs, stored_result_ref)
  | save IdentityCommandEffectSummary
  | save IdentityCommandAcceptedResultEnvelope for TraceHandoffCommandResult + effect
  | complete idempotency with stored_result_ref
  | commit
```

#### 14.5.1 Accepted side effect order

| Step | Required source | Notes |
|---|---|---|
| save handoff intent | `TraceHandoffIntentRepository.save_handoff_intent(intent, None, uow)` | create only;existing supplied ref conflict is rejected before save |
| assign cursor | `IdentityUnitOfWork.assign_truth_change_cursor()` | pending intent accepted cursor;not target resolution time |
| map subject | `IdentityTruthChangeSubjectMapper.handoff_intent_subjects(handoff_intent_ref)` | canonical key `identity:trace-handoff-intent:<handoff_intent_id>` from Step 7 |
| append trace | `IdentityTraceRecord::from_accepted_change(...)` | records preparation trace only;not delivery receipt marker |
| audit | shared accepted audit append subflow by handoff intent audit subject | audit body remains refs/entries only;scope / visibility markers come from `IdentityAcceptedAuditTrailMarkerMapper` |
| outbox | none | no canonical `TraceHandoffIntentPrepared` outbound payload exists;`effect.outbox_refs = []` |
| projection stale | repository expansion by handoff intent subject | no ad hoc handoff state view ref |
| stored result | `StoredIdentityOperationResult::command_accepted(...)` | replay source for accepted command result |
| effect summary | primary ref is `TraceHandoffIntentRef`;outbox refs empty | effect records accepted intent and side effects |

#### 14.5.2 Target / material / visibility rules

| Case | Handling |
|---|---|
| target resolution succeeds | accepted precheck may continue;does not create attempt/receipt and does not imply delivery |
| target unsupported / disabled / unavailable | not accepted pending;exact rejected/dependency surface Step 12/14 |
| safe material forbidden | rejected before intent save;no trace/audit/effect |
| visibility denied | rejected/policy denied before intent save;no handoff leak |
| trace refs empty | rejected invalid request |
| trace missing or member mismatch | rejected not found / policy denied;do not use subject string to infer member |
| audit trail missing or member mismatch | rejected not found / policy denied;do not synthesize audit trail for requested ref |

#### 14.5.3 Rejected / duplicate branches

| Branch | Handling |
|---|---|
| duplicate same key/digest completed | rollback current UoW;load stored accepted/rejected result;return replay;do not resolve target or save intent |
| same key/different digest | conflict surface per Step 13 |
| requested handoff intent ref already exists | rejected conflict or replayable rejected if Step 12/13 classifies;do not overwrite existing intent |
| missing member | rejected not found;do not create member |
| trace/audit validation failure | rejected;do not save intent |
| target/material/visibility guard failure | rejected/dependency surface per Step 12;do not save intent |
| repository/transaction failure | rollback;return `ApplicationError`;do not turn adapter/storage error into pending intent |

#### 14.5.4 Test cuts

| Test cut | Expected |
|---|---|
| prepare accepted generated intent ref | creates pending `TraceHandoffIntent`,does not call delivery,returns `PendingHandoff` |
| prepare accepted requested intent ref | uses supplied ref after confirming missing;does not generate intent id |
| empty trace refs | rejected before target resolver and before save |
| trace belongs to another member | rejected;no intent save |
| audit trail belongs to another member | rejected;no intent save |
| target resolver success not delivered | state remains `PendingHandoff`,attempt/receipt absent |
| target unsupported/unavailable | no pending intent;no trace/outbox/effect |
| forbidden safe material | rejected before save |
| accepted outbox refs empty | no outbox record created;public effect `outbox_refs` is empty |
| duplicate replay | no second target resolver call and no second intent;stored result replay only |

### 14.6 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.1-c 范围 | 通过 | 只展开 `PrepareTraceHandoffFlow` |
| DTO 是否回指 Step 8 | 通过 | 使用 `PrepareTraceHandoffRequest` / `TraceHandoffCommandResult` |
| Domain 是否回指 Step 6 | 通过 | 使用 `TraceHandoffIntent`,`HandoffState`,`HandoffPolicy`,`IdentityTraceRecord`,`AuditTrail` |
| Port 是否回指 Step 7 | 通过 | member/trace/audit/handoff intent repo、handoff target port、UoW、idempotency、stored result、trace/audit/projection/effect 均已定义 |
| prepare 是否执行 delivery | 未发生 | 明确禁止调用 `IdentityHandoffDeliveryPort.deliver_handoff(...)` |
| delivered 是否防伪成功 | 通过 | target resolver success 不产生 attempt/receipt,accepted state 固定 `PendingHandoff` |
| accepted outbox 是否闭合 | 通过 | 当前无 canonical outbound payload,`outbox_refs = []`,不得私造 event |
| expected_version 来源是否闭合 | 通过 | intent create uses `None`;requested ref existing conflict before save |
| duplicate replay 是否闭合 | 通过 | stored result only,不重跑 target resolver / intent save |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 14.7 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Handoff command flow

`PrepareTraceHandoffFlow` 只创建 pending `TraceHandoffIntent`。它先校验 member、非空 trace refs、optional audit trail、handoff target/scope、safe material 和 visibility,再保存 `HandoffState::PendingHandoff`。target resolution 只证明 target boundary 可尝试,不执行 delivery,不产生 attempt/receipt,不标记 delivered。accepted path 追加 preparation trace / audit、mark affected projections stale、保存 stored result 和 effect summary;当前没有 `TraceHandoffIntentPrepared` canonical outbound payload,因此 `effect.outbox_refs = []`。handoff delivery、receipt、retryable failed、failed 和 outbound handoff state material 均由后续 callback/job flow 承接。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 14.8 进入下一批条件

进入 9.2-a 前必须满足:

- 用户审核通过 9.1-c。
- 9.2-a 只写 core truth query flows:`GetGlobalMemberAnchorFlow`,`GetGlobalLifecycleSummaryFlow`,`GetRoleCapabilitySummaryFlow`,`ListCareerRecordsFlow`,`ListMemoryReferencesFlow`。
- Query 必须 no-write,不得创建 member、summary、trace、audit、projection、reference、outbox、handoff intent、stored result 或 idempotency record。
- Query visibility precheck 必须使用 Step 7 read visibility resolver / repository,不得从 route/raw ref 字符串拼 read subject / scope。
- 若 core truth query 的 read subject、scope、projection/view lookup、page priority 或 degraded/not visible surface 不闭合,必须暂停回 Step 6/7/8/12/13,不得在 flow 中私补。

## 15. Query flow batch 9.2-a: core truth queries

本批覆盖五条 core truth query:

- `GetGlobalMemberAnchorFlow`
- `GetGlobalLifecycleSummaryFlow`
- `GetRoleCapabilitySummaryFlow`
- `ListCareerRecordsFlow`
- `ListMemoryReferencesFlow`

本批承接 9.0 shared query no-write discipline 和 Step 8 `8.3-a core truth query DTOs`。五条 flow 都是 member-scoped read-only query,均先通过 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)` 取得 `IdentityVisibilityAccessSummary`,再读取 truth repository 和 optional `MemberSummaryView` slice。它们不创建 truth、不保存 visibility decision、不 reserve idempotency、不保存 stored result、不 append trace/audit/outbox、不 rebuild projection、不 refresh external source。

本批不写 `ReadMemberSummaryFlow`,不写 trace/audit query,不写 projection/reference/report/outbox/handoff operations query,不写 HTTP status、redaction field matrix、query cache、Step 10 完整状态矩阵或 Step 12 public error priority。

### 15.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `GlobalMember` / `IdentityAnchorState` | anchor truth read、member missing no-create、anchor body-free reason/source marker |
| Step 6 `GlobalLifecycleState` | lifecycle truth read、lifecycle missing no-create、basis/reason marker redaction |
| Step 6 `RoleCapabilitySummary` / `RoleCapabilitySourceSnapshot` | role/capability summary read、source snapshot state surfaced as stale/degraded/unavailable marker |
| Step 6 `CareerRecord` | append-only career read page、correction fields read-only、missing item degraded partial |
| Step 6 `MemoryReference` / `MemoryReferenceState` | memory/archive relation read page、state kind read-only、external body excluded |
| Step 6 `MemberSummaryView` / `VisibilityPolicy` / `IdentityVisibilityDecision` | body-free optional projection slices、visible/redacted/not visible/degraded/stale surface |
| Step 7 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)` | `IdentityVisibilityAccessSummary.read_subject_ref`、visibility scope、access state 和 visibility result 的唯一来源 |
| Step 7 `IdentityProjectionRepository.find_member_summary_view_ref(...)` / `get_member_summary_view(...)` | stable summary view lookup/read;query 不拼 view ref,missing 不 rebuild |
| Step 7 core truth repositories | member/lifecycle/role/career/memory read surface |
| Step 8 query DTOs | `IdentityQueryRequest<T>`, `IdentityQueryResponse<T>`, `IdentityPageResponse<T>`, `IdentityQuerySurface`,五条 request/view DTO |

### 15.2 本批问题回答

| 问题 | 回答 |
|---|---|
| query 是否开启写事务 | 否。query path 只构造 query operation context 并调用 read repositories;不得 begin write UoW |
| query 是否使用 idempotency / stored result | 否。query 不 reserve idempotency、不保存 stored result、不做 duplicate replay |
| read subject / visibility scope 从哪里来 | 只能来自 `IdentityVisibilityAccessSummary.read_subject_ref` 和 `IdentityVisibilityAccessSummary.scope_ref`,该 summary 由 `resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)` 返回 |
| stable summary view ref 从哪里来 | 只能来自 `IdentityProjectionRepository.find_member_summary_view_ref(member_ref, access_summary.scope_ref)`;lookup missing 不拼 ref、不扫描 store、不 rebuild |
| 是否允许 view-specific visibility 复核 | 允许但必须通过 `resolve_member_summary_read(member_ref, Some(view_ref), consumer_ref, visibility_context_ref)`;loaded view 只能做归属/assembly,不能生成 scope |
| `None` visibility summary 怎么处理 | 返回 `IdentityQuerySurface.disposition = Degraded`,body/items empty,带 Step 8 degraded marker;不得默认 visible |
| not visible 怎么处理 | 返回 `NotVisible`;single query body `None`,list query items empty;不得用 `Missing` 或 `Empty` 掩盖权限结果 |
| member/truth missing 怎么处理 | 在 visibility 已可判定且不 denied 后返回 `Missing`;不创建 member/lifecycle/summary/relation |
| projection lookup/view missing 怎么处理 | single query 可继续返回 truth body但 projection slice refs 为 `None`/empty,并按 Step 8 surface 标记 missing/degraded/stale;不得 rebuild |
| list query page priority | 整体 not visible 优先;member missing 返回 `Missing`;valid visible list empty 返回 `Empty`;item ref missing 返回 `Degraded` partial surface;page cursor 只映射 repository page |
| field redaction 怎么处理 | 本批只固定 redacted surface 和 optional safe fields omitted;完整字段级 redaction matrix 留 Step 12/16 |

### 15.3 当前材料诊断

| 事项 | 诊断 | 本批处理 |
|---|---|---|
| read subject / scope 来源 | Step 7 `IdentityReadVisibilityRepository` 已闭合 member-scoped summary read seed,并在 `IdentityVisibilityAccessSummary` 中返回 `read_subject_ref` / `scope_ref` | 可直接使用;不新增 resolver |
| stable member summary lookup | Step 7 `find_member_summary_view_ref(member_ref, scope_ref)` 已闭合 | 可作为 optional projection slice 来源 |
| anchor/lifecycle truth read | Step 7 member/lifecycle repository 已有 versioned read | 可直接读取;query 不使用 version 写入 |
| role summary current lookup | Step 7 role repository 已有 explicit summary read 和 current-by-member lookup | 可处理 request optional summary ref |
| role source snapshot read | Step 7 role repository 已有 `get_source_snapshot_with_version(...)` | source snapshot missing/unavailable 只 degraded/stale surface |
| career/memory list | Step 7 career/memory repository 已有 member-scoped list + per-item get | 可处理 empty/page/missing item |
| filters / consistency hints | Step 8 明确 HLD optional filter/hint 未正式定义 | 本批不新增字段或 filter 规则 |

### 15.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| query miss 自动创建 member/lifecycle/summary | 不采用 | 违反 query no-write;missing 只能 public surface 表达 |
| query stale projection 时同步 rebuild | 不采用 | rebuild 属于 job flow;query 只返回 stale/degraded marker |
| 从 member id 拼 visibility scope 或 summary view ref | 不采用 | Step 6/7 已禁止 string/ref 派生 |
| role query 缺 `summary_ref` 时找 current summary | 采用 | Step 7 `find_current_summary_by_member(...)` 是正式读取面 |
| list query item missing 时静默跳过 | 不采用 | 会隐藏 store/index 不一致;本批固定为 degraded partial surface |
| list query not visible 返回 empty | 不采用 | `Empty` 只表达真实空集合;not visible 必须显式 |

### 15.5 Shared core truth query flow

五条 core truth query 共享以下前置顺序。各 flow 只在 truth repository 和 body assembler 上分化。

```text
[API query entry]
  | validate IdentityQueryRequest<T>
  | build IdentityOperationContext::from_query(...)
  | assert query channel and no-write
  | dispatch_query(query_name)
  v
[Visibility seed]
  | access = IdentityReadVisibilityRepository.resolve_member_summary_read(
  |   request.member_ref,
  |   None,
  |   request.consumer_ref,
  |   metadata.visibility_context_ref
  | )
  | access None -> return Degraded surface;body/items empty
  | policy = VisibilityPolicy::for_summary(access, safe read material marker)
  | if access.access_state == NotVisible -> return NotVisible surface;body/items empty
  | if access.access_state == Unavailable or Degraded -> return Degraded surface unless Step 12 later permits safe partial
  v
[Stable optional projection read]
  | view_ref = IdentityProjectionRepository.find_member_summary_view_ref(request.member_ref, access.scope_ref)
  | if view_ref Some:
  |   view_access = resolve_member_summary_read(member_ref, Some(view_ref), consumer_ref, visibility_context_ref) when view-specific check is needed
  |   view = IdentityProjectionRepository.get_member_summary_view(view_ref)
  |   if view Some -> require view.belongs_to(member_ref);else mark degraded/missing projection surface
  | if view_ref None -> do not create view ref;do not rebuild
  v
[Truth repository read]
  | load target truth by typed ref / member key / page
  | assemble public view fields from loaded truth + optional summary slices
  | apply surface disposition: Visible / Redacted / StaleVisible / Missing / Empty / Degraded
  | return IdentityQueryResponse<T> or IdentityPageResponse<T>
```

| Rule | Required source | Notes |
|---|---|---|
| query context | Step 7 operation context factory | channel fixed to `Query`;no idempotency key |
| visibility summary | `resolve_member_summary_read(...)` | only source for read subject/scope/access/result;`None` is degraded |
| projection lookup | `find_member_summary_view_ref(member_ref, scope_ref)` | optional;missing never rebuilds |
| loaded view guard | `MemberSummaryView.belongs_to(member_ref)` | mismatch is degraded invalid material,not hidden |
| material marker | Step 6 `IdentityReadMaterialMarker` | safe refs only;forbidden body maps to degraded/rejection surface per Step 12 |
| page mapping | Step 8 page mapping table | public cursor is never truth cursor |

### 15.6 `GetGlobalMemberAnchorFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetGlobalMemberAnchorRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_global_member_anchor(request, context)` |
| 读取对象 / policy | `GlobalMember`, `IdentityAnchorState`, optional `MemberSummaryView`, `VisibilityPolicy` |
| 主要 port | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository` |
| response | `IdentityQueryResponse<GlobalMemberAnchorView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no trace/audit/outbox/projection write |

```text
[GetGlobalMemberAnchorFlow]
  | run shared visibility seed for request.member_ref
  | if NotVisible/Degraded -> return surface with body None
  | view_ref = find_member_summary_view_ref(member_ref, access.scope_ref)
  | view = optional get_member_summary_view(view_ref)
  | member_v = GlobalMemberRepository.get_member_with_version(member_ref)
  | if member missing -> return Missing surface;body None;do not establish member
  | anchor_state = loaded member anchor state or GlobalMemberRepository.get_anchor_state(member_ref)
  | if view loaded and !view.belongs_to(member_ref) -> return Degraded invalid material
  | body = GlobalMemberAnchorView {
  |   member_ref,
  |   anchor_state_kind,
  |   anchor_reason_ref,
  |   anchor_changed_at,
  |   source_ref,
  |   member_summary_view_ref: view_ref,
  |   anchor_slice_ref: view.map(anchor_slice_ref)
  | }
  | surface = policy.classify_read_surface(found=true, stale=view.is_stale_or_degraded())
  | return IdentityQueryResponse
```

| Branch | Handling |
|---|---|
| visibility summary missing | `Degraded`,body `None` |
| not visible | `NotVisible`,body `None`;do not read/return found/missing diagnostic body |
| member missing | `Missing`,body `None`;do not create member |
| projection lookup missing | may return visible body with `member_summary_view_ref = None`,plus missing/degraded/stale marker per Step 8/12 |
| loaded view mismatch | `Degraded`;do not use slice refs |

| Test cut | Expected |
|---|---|
| visible anchor success | returns anchor state and optional anchor slice |
| not visible | body `None`,not `Missing` / `Empty` |
| member missing | `Missing`,no create |
| projection missing | no rebuild,body can still be assembled from truth with projection marker |
| view belongs to another member | degraded invalid material,body omitted or safe partial per Step 12 |

### 15.7 `GetGlobalLifecycleSummaryFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetGlobalLifecycleSummaryRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_global_lifecycle_summary(request, context)` |
| 读取对象 / policy | `GlobalMember`, `GlobalLifecycleState`, optional `MemberSummaryView`, `VisibilityPolicy` |
| 主要 port | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `GlobalLifecycleRepository` |
| response | `IdentityQueryResponse<GlobalLifecycleSummaryView>` |

```text
[GetGlobalLifecycleSummaryFlow]
  | run shared visibility seed for request.member_ref
  | if NotVisible/Degraded -> return surface with body None
  | member_v = GlobalMemberRepository.get_member_with_version(member_ref)
  | if member missing -> return Missing;do not create member or lifecycle
  | lifecycle_v = GlobalLifecycleRepository.get_lifecycle_with_version(member_ref)
  | if lifecycle missing -> return Missing or Degraded surface;do not derive initial lifecycle from member
  | view_ref = find_member_summary_view_ref(member_ref, access.scope_ref)
  | view = optional get_member_summary_view(view_ref)
  | if view Some and !view.belongs_to(member_ref) -> Degraded invalid material
  | body = GlobalLifecycleSummaryView {
  |   member_ref,
  |   lifecycle_state_kind,
  |   reason_ref,
  |   basis_ref,
  |   changed_by_ref,
  |   changed_at,
  |   member_summary_view_ref: view_ref,
  |   lifecycle_slice_ref: view.map(lifecycle_slice_ref)
  | }
  | return response with Visible/Redacted/StaleVisible surface
```

| Branch | Handling |
|---|---|
| lifecycle missing | `Missing` or degraded dependency surface;no initial lifecycle repair |
| basis marker redacted | body remains safe,`basis_ref = None`,surface `Redacted` |
| stale projection slice | `StaleVisible` if truth is readable;no rebuild |
| lifecycle terminal state | returned as state kind only;query does not update anchor hold |

| Test cut | Expected |
|---|---|
| visible lifecycle success | returns lifecycle kind and safe reason/basis markers |
| member missing | `Missing`,no create |
| lifecycle missing | `Missing`/degraded,not auto-initialized |
| not visible | body `None` |
| stale projection | stale marker,truth unchanged |

### 15.8 `GetRoleCapabilitySummaryFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetRoleCapabilitySummaryRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_role_capability_summary(request, context)` |
| 读取对象 / policy | `GlobalMember`, `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, optional `MemberSummaryView`, `VisibilityPolicy` |
| 主要 port | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `RoleCapabilityRepository` |
| response | `IdentityQueryResponse<RoleCapabilitySummaryView>` |

```text
[GetRoleCapabilitySummaryFlow]
  | run shared visibility seed for request.member_ref
  | if NotVisible/Degraded -> return surface with body None
  | member_v = GlobalMemberRepository.get_member_with_version(member_ref)
  | if member missing -> return Missing
  | if request.summary_ref Some:
  |   summary_v = RoleCapabilityRepository.get_summary_with_version(summary_ref)
  | else:
  |   summary_v = RoleCapabilityRepository.find_current_summary_by_member(member_ref)
  | if summary missing -> return Missing;do not create summary or refresh source
  | require summary_v.object.belongs_to(member_ref);mismatch -> Degraded invalid material
  | snapshot_v = RoleCapabilityRepository.get_source_snapshot_with_version(summary.source_snapshot_ref)
  | if snapshot missing -> assemble safe partial only if Step 12 allows,else Degraded with body None
  | view_ref = find_member_summary_view_ref(member_ref, access.scope_ref)
  | view = optional get_member_summary_view(view_ref)
  | body = RoleCapabilitySummaryView {
  |   member_ref,
  |   summary_ref,
  |   summary_state_kind,
  |   source_snapshot_ref,
  |   source_state_kind: snapshot_v.map(source_state),
  |   role_source_ref,
  |   capability_source_refs,
  |   evidence_refs,
  |   safe_summary_ref,
  |   member_summary_view_ref: view_ref,
  |   role_capability_slice_refs: view.map(role_capability_slice_refs).unwrap_or_empty()
  | }
  | surface reflects visible/redacted/stale/unavailable/degraded states
```

| Branch | Handling |
|---|---|
| explicit summary missing | `Missing`,do not fall back to current summary unless request omitted summary ref |
| current summary missing | `Missing`,do not create active summary |
| summary member mismatch | `Degraded` invalid material;do not leak another member summary |
| source snapshot missing/unavailable | `Degraded` or `StaleVisible` as Step 8/12 classifies;do not call resolver |
| summary state stale/unavailable/pending | return explicit state kind and surface;do not silently label active |

| Test cut | Expected |
|---|---|
| visible current summary | current-by-member read,body safe refs only |
| explicit summary success | reads requested summary,does not replace with current |
| explicit summary belongs to other member | degraded invalid material |
| source snapshot missing | degraded,no resolver call |
| projection missing | no rebuild,role slice refs empty |

### 15.9 `ListCareerRecordsFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ListCareerRecordsRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.list_career_records(request, context)` |
| 读取对象 / policy | `GlobalMember`, `CareerRecord`, optional `MemberSummaryView`, `VisibilityPolicy` |
| 主要 port | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `CareerRecordRepository` |
| response | `IdentityPageResponse<CareerRecordView>` |

```text
[ListCareerRecordsFlow]
  | require IdentityQueryRequest.page Some;map to IdentityRepositoryPage
  | run shared visibility seed for request.member_ref
  | if NotVisible -> return page response with items empty and NotVisible surface
  | if Degraded -> return page response with items empty and Degraded surface
  | member_v = GlobalMemberRepository.get_member_with_version(member_ref)
  | if member missing -> return Missing surface with empty items
  | page = CareerRecordRepository.list_records_by_member(member_ref, repo_page)
  | if page.items empty -> return Empty surface with public page_info
  | for each record_ref in page.items:
  |   record_v = CareerRecordRepository.get_career_record(record_ref)
  |   missing -> mark response Degraded partial;do not repair index;skip item or include safe missing marker per Step 12
  |   if !record_v.object.belongs_to(member_ref) -> mark Degraded invalid material
  |   assemble CareerRecordView from body-free refs/state
  | return IdentityPageResponse with page_info mapped from Step 7 Page
```

| Branch | Handling |
|---|---|
| request page missing | entry validation failure;do not invent default page |
| not visible | `NotVisible`,items empty;not `Empty` |
| member missing | `Missing`,items empty |
| repository page empty | `Empty`,items empty |
| item missing / member mismatch | `Degraded` partial surface;no repair or delete |

| Test cut | Expected |
|---|---|
| visible non-empty page | returns career record views and mapped page_info |
| visible empty page | `Empty`,not not visible |
| not visible | `NotVisible`,items empty |
| missing page envelope | entry validation failure |
| list index points to missing item | degraded partial,no mutation |

### 15.10 `ListMemoryReferencesFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ListMemoryReferencesRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.list_memory_references(request, context)` |
| 读取对象 / policy | `GlobalMember`, `MemoryReference`, `MemoryReferenceState`, optional `MemberSummaryView`, `VisibilityPolicy` |
| 主要 port | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `MemoryReferenceRepository` |
| response | `IdentityPageResponse<MemoryReferenceView>` |

```text
[ListMemoryReferencesFlow]
  | require IdentityQueryRequest.page Some;map to IdentityRepositoryPage
  | run shared visibility seed for request.member_ref
  | if NotVisible -> return page response with items empty and NotVisible surface
  | if Degraded -> return page response with items empty and Degraded surface
  | member_v = GlobalMemberRepository.get_member_with_version(member_ref)
  | if member missing -> return Missing surface with empty items
  | page = MemoryReferenceRepository.list_references_by_member(member_ref, repo_page)
  | if page.items empty -> return Empty surface with public page_info
  | for each reference_ref in page.items:
  |   reference_v = MemoryReferenceRepository.get_memory_reference_with_version(reference_ref)
  |   missing -> mark response Degraded partial;do not repair index
  |   if !reference_v.object.belongs_to(member_ref) -> mark Degraded invalid material
  |   assemble MemoryReferenceView from relation state and body-free refs
  | return IdentityPageResponse with page_info mapped from Step 7 Page
```

| Branch | Handling |
|---|---|
| request page missing | entry validation failure |
| not visible | `NotVisible`,items empty;not `Empty` |
| member missing | `Missing`,items empty |
| repository page empty | `Empty`,items empty |
| item missing / member mismatch | `Degraded` partial surface;no repair or delete |
| relation stale/unavailable/pending | explicit state kind and degraded/stale marker;do not call memory/archive resolver |

| Test cut | Expected |
|---|---|
| visible non-empty page | returns memory reference views and mapped page_info |
| visible empty page | `Empty` |
| not visible | `NotVisible`,items empty |
| missing relation item | degraded partial,no mutation |
| stale/unavailable relation | explicit state/surface,no refresh |

### 15.11 Core query page / surface priority

| Priority | Single-object query | List query |
|---|---|---|
| entry validation failure | `ApplicationError` / entry failure per Step 12 | same |
| visibility resolver `None` / unavailable | `Degraded`,body `None` | `Degraded`,items empty |
| `access_state = NotVisible` | `NotVisible`,body `None` | `NotVisible`,items empty |
| member missing | `Missing`,body `None` | `Missing`,items empty |
| target truth missing | `Missing`,body `None` | not applicable before page;item missing becomes degraded partial |
| visible repository page empty | not applicable | `Empty`,items empty |
| projection lookup/view missing | body may use truth only with missing/degraded marker | does not affect list body unless optional slice is used |
| projection stale / truth stale state | `StaleVisible` or `Degraded` with safe body | same |
| item missing / member mismatch | not applicable | `Degraded` partial surface;no repair |

This table only closes 9.2-a core truth queries. Trace/audit item-level redaction, operations query partial priority, and field-level redaction matrices remain in 9.2-b/9.2-c and Step 12/16.

### 15.12 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.2-a 范围 | 通过 | 只展开五条 core truth query |
| DTO 是否回指 Step 8 | 通过 | 使用 8.3-a request/view/page DTO |
| Domain 是否回指 Step 6 | 通过 | 使用 member/lifecycle/role/career/memory truth、MemberSummaryView、VisibilityPolicy |
| Port 是否回指 Step 7 | 通过 | read visibility、projection lookup/read、core truth repositories 均已定义 |
| read subject/scope 是否正式 | 通过 | 仅来自 `IdentityVisibilityAccessSummary` |
| stable view ref 是否正式 | 通过 | 仅来自 `find_member_summary_view_ref(...)` |
| query no-write 是否保持 | 通过 | 无 UoW、无 idempotency、无 stored result、无 trace/audit/outbox/projection write |
| not visible / empty / missing 是否区分 | 通过 | not visible 不伪装 empty/missing;visible empty 才用 Empty |
| partial item missing priority 是否闭合 | 通过 | core list query item missing/member mismatch 统一 degraded partial;trace/audit/operations 留后续 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 15.13 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Core truth query flows

`GetGlobalMemberAnchorFlow`,`GetGlobalLifecycleSummaryFlow`,`GetRoleCapabilitySummaryFlow`,`ListCareerRecordsFlow` 和 `ListMemoryReferencesFlow` 都是 member-scoped read-only query。service 先通过 `IdentityReadVisibilityRepository.resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)` 取得 `IdentityVisibilityAccessSummary`,并只从该 summary 复制 `read_subject_ref`、`scope_ref` 和 `visibility_result_ref` 构造 query surface / `IdentityVisibilityDecision`;not visible/degraded 直接返回 `IdentityQuerySurface` body-free surface。可见时才读取 core truth repository,并可通过 `IdentityProjectionRepository.find_member_summary_view_ref(member_ref, scope_ref)` 读取 optional `MemberSummaryView` slices。query miss/stale/missing projection 均不创建 truth、不刷新 source、不 rebuild projection、不 append trace/audit/outbox、不保存 stored result。list query 的真实空集合返回 `Empty`;not visible 返回 `NotVisible`;member/truth missing 返回 `Missing`;page item missing 或 member mismatch 返回 degraded partial surface。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 15.14 进入下一批条件

进入 9.2-b 前必须满足:

- 用户审核通过 9.2-a。
- 9.2-b 只写 `ReadMemberSummaryFlow`,`ReadIdentityTraceFlow`,`ReadAuditTrailFlow`。
- Trace/audit query 必须使用 Step 7 formal subject mapper/read ports,不得从 trace/audit subject 字符串互相推断。
- Summary query 必须通过 stable projection lookup/read,不得拼 `MemberSummaryViewRef` 或触发 rebuild。
- 若 trace/audit page-level redaction、partial missing/degraded priority、audit trail lookup 或 field redaction matrix 不闭合,必须暂停回 Step 6/7/8/12/13,不得在 flow 中私补。

## 16. Query flow batch 9.2-b: trace / audit / summary queries

本批覆盖三条 trace / audit / summary query:

- `ReadMemberSummaryFlow`
- `ReadIdentityTraceFlow`
- `ReadAuditTrailFlow`

本批承接 9.0 shared query no-write discipline 和 Step 8 `8.3-b trace / audit / summary query DTOs`。三条 flow 都是 read-only query,不得创建 summary view、trace record、audit trail、projection state、stored result 或 idempotency record。`ReadMemberSummaryFlow` 只使用 stable projection lookup/read 和 loaded `MemberSummaryView` 自身的 freshness marker;本批不从 `MemberSummaryViewRef` 反推出 `IdentityProjectionRef`,也不读取 projection state。projection state 专门读取留 `GetProjectionStateFlow` 和 9.2-c。

本批不写 core truth query,不写 projection/reference/report/outbox/handoff operations query,不写 HTTP status,不写完整字段级 redaction matrix,不写 query cache,不写 Step 10 完整状态矩阵或 Step 12 public error priority。

### 16.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `MemberSummaryView` | stable view identity、belongs_to guard、body-free guard、source cursor / stale / degraded marker |
| Step 6 `IdentityTraceRecord` | append-only trace record read、member/subject guard、safe trace record view assembly |
| Step 6 `AuditTrail` / `AuditTrailEntry` | canonical member audit trail lookup、scope/cursor page、body-free audit entry view |
| Step 6 `VisibilityPolicy` / `IdentityVisibilityAccessSummary` | summary/trace/audit visibility classification、redaction、forbidden material guard |
| Step 7 `IdentityProjectionRepository.find_member_summary_view_ref(...)` / `get_member_summary_view(...)` | `ReadMemberSummary` stable view lookup/read;missing 不 rebuild |
| Step 7 `IdentityTraceRecordRepository` | trace selector -> list refs -> get loaded trace record |
| Step 7 `IdentityAuditTrailRepository.find_audit_trail_by_subject(...)` / `list_audit_entries(...)` | audit canonical trail lookup and paged entry read |
| Step 7 `IdentityReadVisibilityRepository` | summary/trace/audit read visibility resolution |
| Step 7 `IdentityTruthChangeSubjectMapper.member_subjects(...)` | `ReadAuditTrail` member canonical audit subject 来源 |
| Step 8 query DTOs | `ReadMemberSummaryRequest`,`ReadIdentityTraceRequest`,`ReadAuditTrailRequest`,page/response/surface DTO |

### 16.2 本批问题回答

| 问题 | 回答 |
|---|---|
| query 是否开启写事务 | 否。三条 flow 均不 begin write UoW,不 reserve idempotency,不保存 stored result |
| summary read subject / view ref 从哪里来 | 先 `resolve_member_summary_read(member_ref, None, ...)` 取得 `read_subject_ref` 和 `scope_ref`,再 `find_member_summary_view_ref(member_ref, scope_ref)`;不得拼 `IdentityReadSubjectRef` 或 `MemberSummaryViewRef` |
| summary 是否读取 projection state | 否。本批没有正式 `MemberSummaryViewRef -> IdentityProjectionRef` 反向映射;只使用 loaded `MemberSummaryView.source_cursor_ref/read_surface_kind/read_material_marker` 判断 stale/degraded |
| trace selector 如何映射 repository | `ByMember` -> `list_trace_records_by_member`;`BySubject` -> `list_trace_records_after_cursor`;`ByMemberAndChangeKind` -> `list_trace_records_by_change_kind` |
| trace visibility subject 从哪里来 | `BySubject` 可先用 request typed `subject_ref`;最终每个 loaded record 以自身 `subject_ref` 再做 per-item `resolve_trace_read(...)` |
| trace item not visible 怎么处理 | single loaded item denied 时从 items 中移除或 redacted 到 body-free view;全部 loaded item denied 时 page surface = `NotVisible`,不得伪装 `Empty` |
| audit subject 从哪里来 | 只能来自 `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref`;不得从 audit/trace/member 字符串拼接 |
| audit trail missing 怎么处理 | 在 visibility 已通过且 canonical audit subject 确定后,missing canonical trail 表达为 `Empty`,不创建 audit trail |
| audit 是否聚合 role/career/memory 子 truth | 否。本批只读 member canonical audit subject;子 truth 聚合需要后续正式聚合规则或读取面 |
| field redaction 怎么处理 | 本批只固定 page/item-level priority 和 redacted body-free fields;完整字段级 redaction matrix 留 Step 12/16 |

### 16.3 当前材料诊断

| 事项 | 诊断 | 本批处理 |
|---|---|---|
| summary stable lookup | Step 7 已有 `find_member_summary_view_ref(member_ref, visibility_scope_ref)` 和 `get_member_summary_view(view_ref)` | 可直接展开;lookup missing 返回 `Missing` |
| summary projection state | Step 7 有 `get_projection_state_with_version(projection_ref)`,但本 query request / view ref 没有正式 projection ref 来源 | 不读取 projection state;只传播 view 自带 freshness marker |
| trace selector | Step 8 selector 与 Step 7 trace repository read surface 一一对应 | 可直接展开 |
| trace per-item visibility | Step 7 `resolve_trace_read(subject_ref, ...)` 已闭合 | 可按 loaded record subject 做 per-item visibility |
| audit canonical subject | Step 7 `member_subjects(member_ref).audit_subject_ref` 已闭合 | 可直接展开;不聚合子 truth |
| audit trail lookup | Step 7 `find_audit_trail_by_subject(...)` 和 `list_audit_entries(...)` 已闭合 | missing trail -> visible empty;不创建 trail |
| page priority | Step 8 留 trace/audit partial priority 给 Step 9/10/12 | 本批闭合函数级优先级,Step 10/12 固化状态/错误枚举 |

### 16.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| summary query miss 时创建 view 或触发 rebuild | 不采用 | query no-write;rebuild 是 operations job boundary |
| summary query 从 view ref 反推 projection ref 读 state | 不采用 | 当前无正式反向映射;避免私拼 projection ref |
| trace `ByMember` 先用 member subject 统一授权一次 | 不采用 | trace visibility port 输入是 `IdentityTraceSubjectRef`;member ref 不是 trace subject,必须按 loaded trace subject 或 typed selector subject 检查 |
| trace item not visible 静默跳过后返回 `Empty` | 不采用 | 会掩盖权限;全部 denied 返回 `NotVisible`,mixed denied 返回 `Redacted` partial |
| audit trail missing 返回 `Missing` | 不采用 | canonical trail 本身是 audit materialization;visible read 下无 trail 表达“暂无条目”,不由 query 创建 |
| audit 聚合 role/career/memory 子 truth | 不采用 | Step 8 明确本批限定 member canonical audit subject;缺聚合规则时不能扩展 |

### 16.5 Shared trace / audit / summary query discipline

```text
[API query entry]
  | validate IdentityQueryRequest<T>
  | build IdentityOperationContext::from_query(...)
  | assert query channel and no-write
  | dispatch_query(query_name)
  v
[Visibility / subject seed]
  | summary: resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)
  | trace: selector maps to typed subject or loaded trace subject then resolve_trace_read(...)
  | audit: member_subjects(member_ref).audit_subject_ref then resolve_audit_read(...)
  | access None -> Degraded;not visible -> NotVisible
  v
[Repository read]
  | summary: projection stable lookup + get_member_summary_view
  | trace: selector list refs + get_trace_record per ref
  | audit: find canonical audit trail + list_audit_entries
  v
[Assembler]
  | apply belongs_to / subject / body-free guards
  | apply VisibilityPolicy for summary / trace / audit
  | map missing / empty / redacted / degraded / stale surface
  | return IdentityQueryResponse<T> or IdentityPageResponse<T>
```

| Rule | Required source | Notes |
|---|---|---|
| query context | Step 7 operation context factory | channel fixed to `Query`;no idempotency key |
| summary read subject / scope | `IdentityVisibilityAccessSummary.read_subject_ref`;`IdentityVisibilityAccessSummary.scope_ref` | only source for query decision subject and projection lookup scope |
| trace subject | request typed subject or loaded `IdentityTraceRecord.subject_ref` | no trace/audit subject string conversion |
| audit subject | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` | canonical member audit subject only |
| page mapping | Step 8 public page -> Step 7 repository page | page cursor is not truth cursor or audit cursor |
| redaction | `VisibilityPolicy::for_summary/for_trace/for_audit(...)` | field-level matrix later;body-free guard now |
| no-write | query reads only | no visibility decision save unless Step 12/13 later authorizes a separate diagnostics path |

### 16.6 `ReadMemberSummaryFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ReadMemberSummaryRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.read_member_summary(request, context)` |
| 读取对象 / policy | `MemberSummaryView`, `VisibilityPolicy` |
| 主要 port | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository` |
| response | `IdentityQueryResponse<MemberSummaryView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no trace/audit/outbox/projection write |

```text
[ReadMemberSummaryFlow]
  | access = resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)
  | access None -> return Degraded surface;body None
  | policy_seed = VisibilityPolicy::for_summary(access, SafeSummaryRefs marker)
  | if access.access_state == NotVisible -> return NotVisible;body None
  | if access.access_state == Unavailable or Degraded -> return Degraded unless Step 12 permits safe partial
  v
[Stable view lookup]
  | view_ref = IdentityProjectionRepository.find_member_summary_view_ref(member_ref, access.scope_ref)
  | view_ref None -> return Missing;body None;do not construct view ref
  | optional view_access = resolve_member_summary_read(member_ref, Some(view_ref), consumer_ref, visibility_context_ref)
  | view_access None -> return Degraded;body None
  | if view_access.access_state == NotVisible -> return NotVisible;body None
  v
[Load view and assemble]
  | view = IdentityProjectionRepository.get_member_summary_view(view_ref)
  | view None -> return Missing or Degraded projection material;do not rebuild
  | require view.belongs_to(member_ref);else Degraded invalid material
  | require view.matches_visibility_scope(access.scope_ref);else Degraded projection integrity surface
  | require view.assert_body_free();else Degraded / forbidden material surface per Step 12
  | policy = VisibilityPolicy::for_summary(view_access or access, view.read_material_marker)
  | surface = policy.classify_read_surface(found=true, stale=view.is_stale_or_degraded())
  | return IdentityQueryResponse<MemberSummaryView> with visible/redacted/stale/degraded surface
```

| Branch | Handling |
|---|---|
| visibility summary missing | `Degraded`,body `None` |
| initial not visible | `NotVisible`,body `None`;do not reveal lookup found/missing |
| stable lookup missing | `Missing`,body `None`;no view ref construction,no rebuild |
| loaded view missing | `Missing` or `Degraded` projection inconsistency;no rebuild |
| view belongs to another member | `Degraded` invalid material;do not return another member slices |
| view scope mismatch | `Degraded` projection integrity surface;do not infer scope from `visibility_result_ref` |
| forbidden read material | `Degraded` / rejected read surface per Step 12;no body |
| view stale/degraded | `StaleVisible` / `Degraded` using loaded view marker;no projection state write |

| Test cut | Expected |
|---|---|
| visible summary success | lookup stable view ref,load view,return safe summary slices |
| not visible before lookup | body `None`;does not reveal view existence |
| lookup missing | `Missing`;no constructed `MemberSummaryViewRef`,no rebuild |
| loaded view missing after lookup | degraded/missing projection material,no repair |
| view member mismatch | degraded invalid material |
| view scope mismatch | degraded projection integrity surface;no scope inference from visibility result |
| stale view | stale/degraded surface,projection unchanged |

### 16.7 `ReadIdentityTraceFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ReadIdentityTraceRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.read_identity_trace(request, context)` |
| 读取对象 / policy | `IdentityTraceRecord`, `IdentityTraceRecordView`, `VisibilityPolicy` |
| 主要 port | `IdentityTraceRecordRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityPageResponse<IdentityTraceRecordView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no trace append, no audit repair |

```text
[ReadIdentityTraceFlow]
  | require IdentityQueryRequest.page Some;map to IdentityRepositoryPage
  | selector = request.selector
  | if selector.BySubject:
  |   seed_access = resolve_trace_read(selector.subject_ref, consumer_ref, visibility_context_ref)
  |   seed_access None -> Degraded;items empty
  |   seed_access NotVisible -> NotVisible;items empty
  v
[Selector repository read]
  | ByMember:
  |   page_refs = IdentityTraceRecordRepository.list_trace_records_by_member(member_ref, repo_page)
  | BySubject:
  |   page_refs = IdentityTraceRecordRepository.list_trace_records_after_cursor(subject_ref, after_cursor_ref, repo_page)
  | ByMemberAndChangeKind:
  |   page_refs = IdentityTraceRecordRepository.list_trace_records_by_change_kind(member_ref, change_kind_ref, repo_page)
  | page_refs empty -> Empty;items empty
  v
[Per-item load / visibility]
  | for each trace_ref in page_refs.items:
  |   trace_v = IdentityTraceRecordRepository.get_trace_record(trace_ref)
  |   missing -> response Degraded partial;do not repair index
  |   require trace_v.object.belongs_to(selector.member_ref);else Degraded invalid material
  |   if selector.BySubject -> require trace_v.object.matches_subject(subject_ref);else Degraded invalid material
  |   access = resolve_trace_read(trace_v.object.subject_ref, consumer_ref, visibility_context_ref)
  |   access None -> response Degraded partial
  |   access NotVisible -> withhold item and count denied
  |   policy = VisibilityPolicy::for_trace(access, trace_v.object.subject_ref, trace_v.object.read_material_marker)
  |   require trace_v.object.assert_body_free()
  |   assemble IdentityTraceRecordView with allowed refs/markers only
  v
[Page surface]
  | no loaded item refs missing and assembled_items empty because repository page empty -> Empty
  | loaded items exist but all denied -> NotVisible,items empty,no internal count leak
  | some visible/redacted and some denied -> Redacted partial surface
  | any missing/invalid material -> Degraded partial surface
  | otherwise -> Visible / Redacted according to per-item policy
```

| Selector | Repository read | Visibility source | Guard |
|---|---|---|---|
| `ByMember { member_ref }` | `list_trace_records_by_member(member_ref, page)` | each loaded record `subject_ref` | loaded `belongs_to(member_ref)` |
| `BySubject { member_ref, subject_ref, after_cursor_ref }` | `list_trace_records_after_cursor(subject_ref, after_cursor_ref, page)` | request `subject_ref` seed and each loaded record subject | loaded `belongs_to(member_ref)` and `matches_subject(subject_ref)` |
| `ByMemberAndChangeKind { member_ref, change_kind_ref }` | `list_trace_records_by_change_kind(member_ref, change_kind_ref, page)` | each loaded record `subject_ref` | loaded `belongs_to(member_ref)`;change kind comes from repository filter |

| Branch | Handling |
|---|---|
| request page missing | entry validation failure;do not invent default page |
| `BySubject` seed not visible | `NotVisible`,items empty;do not list records |
| repository page empty after visible seed | `Empty`,items empty |
| trace ref missing after list | `Degraded` partial;no append/repair/delete |
| loaded member mismatch | `Degraded` invalid material |
| loaded subject mismatch for `BySubject` | `Degraded` invalid material |
| item visibility missing/unavailable | `Degraded` partial |
| all loaded items denied | `NotVisible`,items empty;not `Empty` |
| mixed visible/redacted/denied | `Redacted` partial;denied items omitted or field-redacted per Step 12 |

| Test cut | Expected |
|---|---|
| by member visible page | maps to `list_trace_records_by_member`,loads each record,per-item visibility applied |
| by subject after cursor | maps to `list_trace_records_after_cursor`;truth cursor not page cursor |
| by change kind | maps to `list_trace_records_by_change_kind`;no string filter |
| all items denied | `NotVisible`,not `Empty` |
| visible empty page | `Empty` |
| missing trace item | degraded partial,no repair |
| member or subject mismatch | degraded invalid material |
| forbidden raw log marker | degraded/forbidden surface,no body |

### 16.8 `ReadAuditTrailFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ReadAuditTrailRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.read_audit_trail(request, context)` |
| 读取对象 / policy | `AuditTrail`, `AuditTrailEntry`, `AuditTrailEntryView`, `VisibilityPolicy` |
| 主要 port | `IdentityTruthChangeSubjectMapper`, `IdentityAuditTrailRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityPageResponse<AuditTrailEntryView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no audit trail create, no trace repair |

```text
[ReadAuditTrailFlow]
  | require IdentityQueryRequest.page Some;map to IdentityRepositoryPage
  | subjects = IdentityTruthChangeSubjectMapper.member_subjects(request.member_ref)
  | audit_subject_ref = subjects.audit_subject_ref
  | access = resolve_audit_read(audit_subject_ref, audit_scope_ref, consumer_ref, visibility_context_ref)
  | access None -> Degraded;items empty
  | access NotVisible -> NotVisible;items empty
  v
[Canonical audit trail read]
  | trail_v = IdentityAuditTrailRepository.find_audit_trail_by_subject(audit_subject_ref)
  | trail_v None -> Empty;items empty;do not create audit trail
  | require trail_v.object.audit_subject_ref == audit_subject_ref;else Degraded invalid material
  | if trail_v.object.member_ref Some and != request.member_ref -> Degraded invalid material
  | policy = VisibilityPolicy::for_audit(access, audit_subject_ref, AuditRefsOnly marker)
  v
[Paged entry read]
  | page = IdentityAuditTrailRepository.list_audit_entries(
  |   trail_v.object.audit_trail_ref,
  |   request.audit_scope_ref,
  |   request.audit_cursor_ref,
  |   repo_page
  | )
  | page.items empty -> Empty;items empty
  | for each AuditTrailEntry:
  |   require body-free entry material
  |   assemble AuditTrailEntryView {
  |     audit_trail_ref,
  |     audit_subject_ref,
  |     audit_scope_ref,
  |     member_ref: Some(request.member_ref),
  |     trace_record_ref,
  |     change_kind_ref,
  |     visibility_result_ref,
  |     occurred_at
  |   }
  | return IdentityPageResponse with Visible/Redacted/Degraded/Empty surface
```

| Branch | Handling |
|---|---|
| request page missing | entry validation failure |
| mapper unavailable | `Degraded`;do not synthesize audit subject |
| visibility summary missing/unavailable | `Degraded`,items empty |
| not visible | `NotVisible`,items empty;do not reveal trail existence |
| canonical audit trail missing | `Empty`,items empty;do not create audit trail |
| trail subject/member mismatch | `Degraded` invalid material |
| entry page empty | `Empty`,items empty |
| entry material invalid | `Degraded` partial;do not repair trace/audit |
| audit cursor supplied | passed only to `list_audit_entries`;never treated as truth cursor or page cursor |

| Test cut | Expected |
|---|---|
| visible audit page | mapper -> visibility -> trail lookup -> entry page,returns body-free entries |
| not visible | items empty with `NotVisible`,does not reveal trail existence |
| missing canonical trail | `Empty`,not create trail |
| empty entries | `Empty` with page_info |
| trail subject/member mismatch | degraded invalid material |
| audit cursor separation | audit cursor only passed as audit cursor;page cursor remains repository page cursor |
| child truth audit not aggregated | role/career/memory child trails are not read without formal aggregation rule |

### 16.9 Trace / audit / summary page and surface priority

| Priority | `ReadMemberSummary` | `ReadIdentityTrace` | `ReadAuditTrail` |
|---|---|---|---|
| entry validation failure | `ApplicationError` / entry failure per Step 12 | same;page required | same;page required |
| visibility resolver `None` / unavailable | `Degraded`,body `None` | `Degraded`,items empty | `Degraded`,items empty |
| `access_state = NotVisible` | `NotVisible`,body `None` | `NotVisible`,items empty | `NotVisible`,items empty |
| stable lookup / canonical material missing | summary view lookup missing -> `Missing` | repository page empty -> `Empty` | canonical trail missing -> `Empty` |
| loaded material missing after index | loaded view missing -> `Missing` / `Degraded` | missing trace item -> `Degraded` partial | entry material invalid -> `Degraded` partial |
| loaded material member/subject mismatch | `Degraded` invalid material | `Degraded` invalid material | `Degraded` invalid material |
| visible page empty | not applicable | `Empty` | `Empty` |
| all loaded items denied | not applicable | `NotVisible`,items empty | not applicable because trail-level visibility checked first |
| mixed visible/redacted/denied | not applicable | `Redacted` partial;denied items omitted/redacted | `Redacted` if policy requires redaction |
| stale/degraded freshness marker | `StaleVisible` / `Degraded` from loaded view | trace item marker -> `Degraded` partial if unsafe | audit trail/entry marker -> `Degraded` partial if unsafe |

This table closes trace/audit item-level priority for 9.2-b. Operations query partial priority remains in 9.2-c. Field-level redaction matrices remain in Step 12/16.

### 16.10 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.2-b 范围 | 通过 | 只展开 summary、trace、audit 三条 query |
| DTO 是否回指 Step 8 | 通过 | 使用 8.3-b request/selector/view/page DTO |
| Domain 是否回指 Step 6 | 通过 | 使用 `MemberSummaryView`,`IdentityTraceRecord`,`AuditTrail`,`VisibilityPolicy` |
| Port 是否回指 Step 7 | 通过 | projection lookup/read、trace repo、audit repo、read visibility、truth subject mapper 均已定义 |
| summary stable view ref 是否正式 | 通过 | 仅来自 `find_member_summary_view_ref(...)` |
| summary projection state 是否越界 | 未越界 | 本批不读取未闭合的 projection-state 反向映射,只用 loaded view freshness marker |
| trace selector 是否一一映射 port | 通过 | 三个 selector 分别映射 Step 7 三类 trace list |
| audit subject 是否正式 | 通过 | 仅来自 `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` |
| not visible / empty / missing 是否区分 | 通过 | not visible 不伪装 empty;summary lookup missing 是 Missing;trace/audit visible empty 是 Empty |
| partial item missing priority 是否闭合 | 通过 | trace/audit invalid material 和 missing item 统一 degraded partial |
| query no-write 是否保持 | 通过 | 无 UoW、无 idempotency、无 stored result、无 trace/audit/projection write |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 16.11 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Trace / audit / summary query flows

`ReadMemberSummaryFlow` 先通过 `IdentityReadVisibilityRepository.resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)` 取得 `IdentityVisibilityAccessSummary`,并只从该 summary 复制 `read_subject_ref`、`scope_ref` 和 `visibility_result_ref`;再通过 `IdentityProjectionRepository.find_member_summary_view_ref(member_ref, scope_ref)` 查找 stable `MemberSummaryViewRef`,随后 `get_member_summary_view(view_ref)` 读取 view 并执行 `belongs_to`、`matches_visibility_scope(access.scope_ref)` 与 body-free guard。lookup/view missing 只返回 `Missing` / degraded surface,scope mismatch 返回 degraded projection integrity surface,stale 只通过 loaded view freshness marker 表达;query 不拼 view ref、不读取未闭合 projection-state 反向映射、不从 `visibility_result_ref` 反推 scope、不触发 rebuild。

`ReadIdentityTraceFlow` 使用 `IdentityTraceReadSelector` 精确映射 Step 7 trace repository:by member、by subject after cursor、by member and change kind。每个 loaded trace record 必须通过 member/subject guard 和 `resolve_trace_read(record.subject_ref, consumer_ref, visibility_context_ref)` per-item visibility。visible empty page 返回 `Empty`;全部 loaded items denied 返回 `NotVisible`;mixed denied/redacted 返回 redacted partial;missing item 或 invalid material 返回 degraded partial。query 不 append trace、不修复 index。

`ReadAuditTrailFlow` 只读取 member canonical audit subject。service 通过 `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` 得到 audit subject,调用 `resolve_audit_read(...)`,再通过 `find_audit_trail_by_subject(...)` 和 `list_audit_entries(...)` 读取 body-free entries。canonical trail missing 在 visible read 下返回 `Empty`,不创建 audit trail;本 flow 不聚合 role/career/memory 子 truth audit trail。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 16.12 进入下一批条件

进入 9.2-c 前必须满足:

- 用户审核通过 9.2-b。
- 9.2-c 只写 `GetProjectionStateFlow`,`GetReferenceResolutionStateFlow`,`ReadReconciliationReportFlow`,`ListPendingIdentityOutboxFlow`,`GetIdentityOutboxStateFlow`,`GetTraceHandoffStateFlow`。
- Operations query visibility 必须使用 Step 7 matching resolver,不得从 projection/ref/report/outbox/handoff id 字符串推断 read subject / scope。
- Projection/reference/report/outbox/handoff query 必须通过正式 lookup/read port,不得触发 rebuild、refresh、publish、deliver、retry 或 report repair。
- 若 operations query 的 stable lookup、reference owner、outbox selector、handoff visibility 或 report list priority 不闭合,必须暂停回 Step 6/7/8/12/13,不得在 flow 中私补。

## 17. Query flow batch 9.2-c: maintenance / outbox / handoff queries

本批覆盖六条 operations / maintenance / propagation query:

- `GetProjectionStateFlow`
- `GetReferenceResolutionStateFlow`
- `ReadReconciliationReportFlow`
- `ListPendingIdentityOutboxFlow`
- `GetIdentityOutboxStateFlow`
- `GetTraceHandoffStateFlow`

本批承接 9.0 shared query no-write discipline 和 Step 8 `8.3-c maintenance / outbox / handoff query DTOs`。六条 flow 都只读取 identity-owned operations material,不得触发 projection rebuild、reference refresh、reconciliation report generation、outbox publish/retry、handoff delivery/retry、trace/audit append、stored result save 或 idempotency reserve。

本批不写 inbound event/callback flow,不写 outbound event material audit,不写 operations job flow,不写 HTTP status,不写完整 retry/backoff policy,不写 Step 10 完整状态矩阵或 Step 12 public error priority。

### 17.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `ProjectionState` | projection freshness/state read、stale/rebuilding/degraded/failed surface、query no rebuild |
| Step 6 `ReferenceResolutionState` | stored external reference resolution read、owner consistency、typed sidecar body-free refs、query no refresh |
| Step 6 `ReconciliationReport` | report-only read/list、scope/target/finding/issue refs、no repair |
| Step 6 `IdentityOutboxRecord` / `OutboxState` | pending/retryable/list/single state read、payload marker、publish state view、query no publish/retry |
| Step 6 `TraceHandoffIntent` / `HandoffState` | handoff intent state read、receipt marker guard、query no delivery/retry/fake delivered |
| Step 6 `VisibilityPolicy` | operations read visibility classification and forbidden body guard |
| Step 7 projection/reference/report/outbox/handoff repositories | formal lookup/read/list surfaces |
| Step 7 `IdentityReadVisibilityRepository` | matching operations visibility resolver for each query family |
| Step 7 `IdentityTruthChangeSubjectMapper` | `ListPendingIdentityOutbox(ByMember)` formal outbox subject source |
| Step 8 8.3-c query DTOs | six request/view/selector/page response surfaces |

### 17.2 本批问题回答

| 问题 | 回答 |
|---|---|
| operations query 是否开启写事务 | 否。六条 flow 都不 begin write UoW、不 reserve idempotency、不保存 stored result |
| projection state missing 是否触发 rebuild | 否。返回 `Missing` / `Rebuilding` / `Degraded` surface,不得触发 rebuild job |
| reference missing/stale 是否调用 external resolver | 否。query 只读 stored reference state and sidecar refs,不得 refresh |
| report scope list 是否先扫 report 再判可见 | 否。先 `resolve_reconciliation_scope_read(...)`,再 list reports |
| exact report 是否只用 report ref 可见性 | 否。先 scope visibility,再 loaded report item visibility;scope mismatch 是 degraded invalid material |
| outbox list optional 组合如何处理 | 只通过 `IdentityOutboxListSelector` 分支映射 Step 7 outbox read surface,不解释多 optional 字段组合 |
| outbox/handoff state query 是否触发 publish/delivery/retry | 否。只返回 state/attempt/receipt/issue marker |
| item not visible / missing priority 如何处理 | scope/list not visible 优先;visible empty 是 `Empty`;exact ref missing 是 `Missing`;item missing/invalid 是 `Degraded` partial;all loaded items denied 是 `NotVisible` |
| raw diagnostics / payload / receipt body 是否可返回 | 否。只返回 safe issue/ref/marker/time;raw body、secret、adapter response 均禁止 |

### 17.3 当前材料诊断

| 事项 | 诊断 | 本批处理 |
|---|---|---|
| projection state read | Step 7 有 `resolve_projection_state_read(...)`,`find_projection_state_ref(...)`,`get_projection_state_with_version(...)` | 可直接展开;state ref 不拼接 |
| reference state read | Step 7 有 `resolve_reference_state_read(...)`,`get_reference_state_with_version(...)`,`find_reference_state_ref(...)`,`get_typed_sidecar_refs(...)` | 可直接展开;不调用 resolver |
| reconciliation report list | Step 7 有 scope visibility 和 report visibility,report repo 有 by scope / get | 可展开 exact and scope list |
| outbox selector | Step 8 selector 与 Step 7 outbox repo read surfaces 一一对应 | 可直接展开;ByMember 用 subject mapper |
| outbox visibility | Step 7 `resolve_outbox_record_read(...)` 支撑 topic/subject/outbox ref visibility | 可 list precheck + per-item visibility |
| handoff state | Step 7 `resolve_handoff_intent_read(...)` 和 handoff intent repo 已闭合 | 可直接展开;no delivery |

### 17.4 本批设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| projection query 缺 state 时同步 rebuild | 不采用 | rebuild 属于 operations job,query no-write |
| reference query stale 时调用 external resolver | 不采用 | refresh 属于 consumer/job boundary,query 只读 stored state |
| report list 先 list 再用 item visibility | 不采用 | scope-level not visible 必须先于 empty/count,避免泄露 report existence |
| exact report 不校验 request scope | 不采用 | report DTO 包含 `maintenance_scope_ref`;loaded report scope mismatch 必须 degraded |
| outbox list 用多个 optional filter | 不采用 | Step 8 已收敛为 selector,避免实现猜优先级 |
| ByTrace outbox list 强行提前 visibility | 不采用 | Step 7 visibility port 没有 trace-ref 输入;正式口径是 load linked records 后按 loaded outbox ref/subject/topic per-item 检查 |
| handoff state query 看到 retryable 就执行 retry | 不采用 | retry 属于 job boundary;query 只显示 state |

### 17.5 Shared operations query flow

```text
[API query entry]
  | validate IdentityQueryRequest<T>
  | build IdentityOperationContext::from_query(...)
  | assert query channel and no-write
  | dispatch_query(query_name)
  v
[Typed visibility seed]
  | projection -> resolve_projection_state_read(...)
  | reference -> resolve_reference_state_read(...)
  | report scope -> resolve_reconciliation_scope_read(...)
  | report item -> resolve_report_read(...)
  | outbox -> resolve_outbox_record_read(...)
  | handoff -> resolve_handoff_intent_read(...)
  | access None -> Degraded;not visible -> NotVisible
  v
[Repository read]
  | load exact state/report/outbox/handoff or list refs by formal selector/scope
  | for list pages,load each item by typed ref
  | never call rebuild/refresh/report-generate/publish/deliver/retry
  v
[Assembler]
  | apply typed ref consistency guard
  | assert forbidden body excluded
  | map visible/redacted/not visible/missing/empty/degraded/stale/rebuilding/disabled
  | return IdentityQueryResponse<T> or IdentityPageResponse<T>
```

| Rule | Required source | Notes |
|---|---|---|
| operation context | Step 7 operation context factory | query channel only |
| visibility | matching Step 7 resolver | `None` is never visible by default |
| exact ref read | request typed ref | missing exact object -> `Missing`,not `Empty` |
| list read | Step 7 repository list by scope/selector | visible no rows -> `Empty` |
| per-item check | loaded typed object | missing item or mismatch -> `Degraded` partial |
| no side effect | query service only reads | no UoW,stored result,trace/audit,outbox update,job trigger |

### 17.6 `GetProjectionStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetProjectionStateRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_projection_state(request, context)` |
| 读取对象 / policy | `ProjectionState`, `ProjectionStateView`, `VisibilityPolicy` |
| 主要 port | `IdentityProjectionRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityQueryResponse<ProjectionStateView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no projection save/rebuild/mark stale |

```text
[GetProjectionStateFlow]
  | state_ref_hint = request.projection_state_ref
  | access = resolve_projection_state_read(projection_ref, state_ref_hint, consumer_ref, visibility_context_ref)
  | access None -> Degraded;body None
  | access NotVisible -> NotVisible;body None
  v
[Lookup and load]
  | loaded_state = get_projection_state_with_version(projection_ref)
  | loaded_state None:
  |   optional state_ref = find_projection_state_ref(projection_ref)
  |   return Missing;body None;do not create state
  | if request.projection_state_ref Some and != loaded_state.object.projection_state_ref -> Degraded invalid material
  | optional final_access = resolve_projection_state_read(projection_ref, Some(loaded_state.object.projection_state_ref), ...)
  | final_access NotVisible -> NotVisible;body None
  v
[Assemble]
  | body = ProjectionStateView from loaded ProjectionState fields
  | surface = Visible / StaleVisible / Rebuilding / Degraded / Disabled according to state_kind and access
  | return IdentityQueryResponse
```

| Branch | Handling |
|---|---|
| visibility summary missing/unavailable | `Degraded`,body `None` |
| not visible | `NotVisible`,body `None`;do not reveal state existence |
| state missing | `Missing`,body `None`;no create/rebuild |
| request state ref mismatch | `Degraded` invalid material |
| `Stale` / `RebuildPending` / `Rebuilding` | surface explicit;no rebuild |
| `Failed` / `Degraded` / `Disabled` | safe issue marker only;no raw diagnostic |

| Test cut | Expected |
|---|---|
| visible fresh state | returns state view and visibility marker |
| not visible | body `None`,does not reveal missing/found |
| missing state | `Missing`,no save |
| state ref mismatch | degraded invalid material |
| stale/rebuilding state | surface reflects state,no job trigger |

### 17.7 `GetReferenceResolutionStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetReferenceResolutionStateRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_reference_resolution_state(request, context)` |
| 读取对象 / policy | `ReferenceResolutionState`, `ReferenceResolutionStateView`, typed sidecar refs, `VisibilityPolicy` |
| 主要 port | `IdentityReferenceStateRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityQueryResponse<ReferenceResolutionStateView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no external resolver call, no reference refresh/save |

```text
[GetReferenceResolutionStateFlow]
  | access = resolve_reference_state_read(external_reference_ref, owner_ref, consumer_ref, visibility_context_ref)
  | access None -> Degraded;body None
  | access NotVisible -> NotVisible;body None
  v
[Load stored reference bundle]
  | state_v = get_reference_state_with_version(external_reference_ref)
  | state_v None -> Missing;body None;do not call external resolver
  | require state_v.object.external_reference_ref == request.external_reference_ref
  | if request.owner_ref Some and != state_v.object.reference_owner_ref -> Degraded invalid material
  | state_ref = find_reference_state_ref(external_reference_ref) optional consistency marker
  | sidecar_refs = get_typed_sidecar_refs(external_reference_ref)
  | sidecar read unavailable -> Degraded partial;do not repair
  v
[Assemble]
  | body = ReferenceResolutionStateView from stored state + same-bundle sidecar refs
  | surface = Visible / StaleVisible / Degraded / Missing according to state_kind/access
  | return IdentityQueryResponse
```

| Branch | Handling |
|---|---|
| visibility summary missing/unavailable | `Degraded`,body `None` |
| not visible | `NotVisible`,body `None` |
| stored state missing | `Missing`,body `None`;no resolver call |
| owner mismatch | `Degraded` invalid material |
| state stale/unavailable/unrecognized/refresh failed | explicit state + safe issue marker;no refresh |
| sidecar read degraded | safe partial or body `None` with degraded marker per Step 12 |

| Test cut | Expected |
|---|---|
| visible resolved state | returns stored state and same-bundle sidecar refs |
| missing state | `Missing`,no resolver call |
| owner mismatch | degraded invalid material |
| unavailable reference | returns state/issue marker only |
| sidecar missing/degraded | no sidecar save or repair |

### 17.8 `ReadReconciliationReportFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ReadReconciliationReportRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.read_reconciliation_report(request, context)` |
| 读取对象 / policy | `ReconciliationReport`, `ReconciliationReportView`, `VisibilityPolicy` |
| 主要 port | `IdentityReconciliationReportRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityPageResponse<ReconciliationReportView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no report generation, no truth repair |

```text
[ReadReconciliationReportFlow]
  | scope_access = resolve_reconciliation_scope_read(maintenance_scope_ref, consumer_ref, visibility_context_ref)
  | scope_access None -> Degraded;items empty
  | scope_access NotVisible -> NotVisible;items empty;do not list reports
  v
[Exact report branch]
  | if request.report_ref Some:
  |   report_v = get_report_with_version(report_ref)
  |   report_v None -> Missing;items empty
  |   require report_v.object.maintenance_scope_ref == request.maintenance_scope_ref;else Degraded invalid material
  |   item_access = resolve_report_read(report_ref, consumer_ref, visibility_context_ref)
  |   item_access None -> Degraded;items empty
  |   item_access NotVisible -> NotVisible;items empty
  |   assemble one ReconciliationReportView
  |   return one-item page
  v
[Scope list branch]
  | require IdentityQueryRequest.page Some;map to IdentityRepositoryPage
  | page_refs = list_reports_by_scope(maintenance_scope_ref, repo_page)
  | page_refs empty -> Empty;items empty
  | for each report_ref:
  |   report_v = get_report_with_version(report_ref)
  |   missing -> Degraded partial;do not repair index
  |   require report_v.object.maintenance_scope_ref == request.maintenance_scope_ref
  |   item_access = resolve_report_read(report_ref, consumer_ref, visibility_context_ref)
  |   NotVisible -> withhold item and count denied
  |   assemble ReconciliationReportView from body-free refs
  | page surface by visible/redacted/denied/degraded priority
```

| Branch | Handling |
|---|---|
| scope visibility missing/unavailable | `Degraded`,items empty |
| scope not visible | `NotVisible`,items empty;no report list |
| exact report missing | `Missing`,items empty |
| exact report scope mismatch | `Degraded` invalid material |
| list page missing | entry validation failure when `report_ref` absent |
| scope list empty | `Empty`,items empty |
| listed report missing/scope mismatch | `Degraded` partial |
| all loaded list items denied | `NotVisible`,items empty |
| mixed visible/denied | `Redacted` partial |

| Test cut | Expected |
|---|---|
| exact report visible | scope precheck + report load + item visibility,one item page |
| exact report missing | `Missing`,no report generation |
| scope not visible | no repository list,count not leaked |
| scope list empty | `Empty` |
| listed report missing | degraded partial,no repair |
| report contains raw diagnostic | degraded/forbidden material surface |

### 17.9 `ListPendingIdentityOutboxFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<ListPendingIdentityOutboxRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.list_pending_identity_outbox(request, context)` |
| 读取对象 / policy | `IdentityOutboxRecord`, `OutboxState`, `IdentityOutboxRecordView`, `VisibilityPolicy` |
| 主要 port | `IdentityOutboxRepository`, `IdentityReadVisibilityRepository`, `IdentityTruthChangeSubjectMapper` |
| response | `IdentityPageResponse<IdentityOutboxRecordView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no publish/retry/state update |

```text
[ListPendingIdentityOutboxFlow]
  | require IdentityQueryRequest.page Some;map to IdentityRepositoryPage
  | selector = request.selector
  | derive formal list seed:
  |   Pending(topic) -> topic_key_ref
  |   Retryable(topic) -> topic_key_ref
  |   BySubject(subject) -> subject_ref
  |   ByMember(member) -> IdentityTruthChangeSubjectMapper.member_subjects(member).outbox_subject_ref
  |   ByTrace(trace) -> no pre-list visibility seed;per-item only
  | run available list precheck through resolve_outbox_record_read(None, subject, topic, ...)
  | precheck None -> Degraded;items empty
  | precheck NotVisible -> NotVisible;items empty
  v
[Selector repository read]
  | Pending -> list_pending_outbox_records(topic_key_ref, page)
  | Retryable -> list_retryable_outbox_records(topic_key_ref, page)
  | BySubject / ByMember -> list_outbox_records_by_subject(subject_ref, page)
  | ByTrace -> find_outbox_records_by_trace(trace_record_ref, page)
  | page_refs empty -> Empty;items empty
  v
[Per-item load / visibility]
  | for each outbox_ref:
  |   record_v = get_outbox_record_with_version(outbox_ref)
  |   missing -> Degraded partial;do not repair index
  |   selector consistency guard:
  |     topic filters must match loaded topic when present
  |     subject filters must match loaded subject
  |     trace filter must match loaded trace ref
  |   item_access = resolve_outbox_record_read(Some(outbox_ref), Some(record.subject_ref), Some(record.topic_key_ref), ...)
  |   item_access NotVisible -> withhold item and count denied
  |   assemble IdentityOutboxRecordView from body-free marker/state refs
  | return page response by priority
```

| Selector | Repository read | Visibility source | Guard |
|---|---|---|---|
| `Pending { topic_key_ref }` | `list_pending_outbox_records(topic_key_ref, page)` | list topic precheck + per-item loaded record | loaded state must be pending;topic matches when provided |
| `Retryable { topic_key_ref }` | `list_retryable_outbox_records(topic_key_ref, page)` | list topic precheck + per-item loaded record | loaded state must be retryable;topic matches when provided |
| `BySubject { subject_ref }` | `list_outbox_records_by_subject(subject_ref, page)` | request subject precheck + per-item loaded record | loaded subject matches |
| `ByMember { member_ref }` | mapper output subject then by subject | formal outbox subject from mapper | no string subject construction |
| `ByTrace { trace_record_ref }` | `find_outbox_records_by_trace(trace_record_ref, page)` | per-item loaded record | loaded trace ref matches |

| Branch | Handling |
|---|---|
| request page missing | entry validation failure |
| list precheck not visible | `NotVisible`,items empty;no list |
| repository page empty | `Empty`,items empty |
| outbox item missing | `Degraded` partial |
| item selector mismatch | `Degraded` invalid material |
| all loaded items denied | `NotVisible`,items empty;not `Empty` |
| mixed visible/denied | `Redacted` partial |
| payload marker forbidden body | `Degraded` / forbidden material surface;do not return payload body |

| Test cut | Expected |
|---|---|
| pending by topic | list pending by `TopicKeyRef`,no broker string |
| retryable by topic | returns retryable state only,no retry |
| by member | subject from mapper,not string construction |
| by trace | loads linked records and per-item visibility |
| all denied | `NotVisible`,not `Empty` |
| item missing | degraded partial,no outbox repair |

### 17.10 `GetIdentityOutboxStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetIdentityOutboxStateRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_identity_outbox_state(request, context)` |
| 读取对象 / policy | `IdentityOutboxRecord`, `OutboxState`, `IdentityOutboxStateView`, `VisibilityPolicy` |
| 主要 port | `IdentityOutboxRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityQueryResponse<IdentityOutboxStateView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no publish/retry/state update |

```text
[GetIdentityOutboxStateFlow]
  | access = resolve_outbox_record_read(Some(outbox_record_ref), None, None, consumer_ref, visibility_context_ref)
  | access None -> Degraded;body None
  | access NotVisible -> NotVisible;body None
  v
[Load outbox record]
  | record_v = get_outbox_record_with_version(outbox_record_ref)
  | record_v None -> Missing;body None;do not create outbox
  | final_access = resolve_outbox_record_read(Some(outbox_record_ref), Some(record.subject_ref), Some(record.topic_key_ref), ...)
  | final_access None -> Degraded;body None
  | final_access NotVisible -> NotVisible;body None
  v
[Assemble]
  | require record.payload_marker_ref is body-free
  | body = IdentityOutboxStateView from record/state refs
  | surface = Visible / Redacted / Degraded according to final access and state marker
  | return IdentityQueryResponse
```

| Branch | Handling |
|---|---|
| initial visibility missing/unavailable | `Degraded`,body `None` |
| initial or final not visible | `NotVisible`,body `None` |
| outbox missing | `Missing`,body `None`;no create |
| payload/topic/attempt/issue marker unsafe | `Degraded`;no raw body |
| `Published` state | returns outbound-boundary state only;does not imply downstream consumed |
| `RetryableFailed` state | returns issue/attempt marker;does not retry |

| Test cut | Expected |
|---|---|
| visible pending state | returns body-free outbox state |
| missing outbox | `Missing`,no create |
| not visible | body `None`,does not reveal state |
| published state | no downstream consumed claim |
| retryable failed | no retry call |

### 17.11 `GetTraceHandoffStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityQueryRequest<GetTraceHandoffStateRequest>` |
| 入口 | `IdentityApplicationFacade::dispatch_query(...)` |
| application service | `IdentityQueryService.get_trace_handoff_state(request, context)` |
| 读取对象 / policy | `TraceHandoffIntent`, `HandoffState`, `TraceHandoffStateView`, `VisibilityPolicy` |
| 主要 port | `TraceHandoffIntentRepository`, `IdentityReadVisibilityRepository` |
| response | `IdentityQueryResponse<TraceHandoffStateView>` |
| no-write guard | no UoW begin, no idempotency, no stored result, no delivery/retry/state update |

```text
[GetTraceHandoffStateFlow]
  | access = resolve_handoff_intent_read(handoff_intent_ref, consumer_ref, visibility_context_ref)
  | access None -> Degraded;body None
  | access NotVisible -> NotVisible;body None
  v
[Load handoff intent]
  | intent_v = TraceHandoffIntentRepository.get_handoff_intent_with_version(handoff_intent_ref)
  | intent_v None -> Missing;body None;do not create intent
  | require intent_v.object.handoff_intent_ref == request.handoff_intent_ref
  | require intent_v.object.trace_record_refs not empty;else Degraded invalid material
  | require intent_v.object.safe_material_ref is body-free
  | if intent_v.object.handoff_state_kind == Delivered:
  |   require receipt_ref Some;else Degraded fake delivered material
  v
[Assemble]
  | body = TraceHandoffStateView from loaded intent/state refs
  | surface = Visible / Redacted / Degraded according to access and handoff state
  | return IdentityQueryResponse
```

| Branch | Handling |
|---|---|
| visibility missing/unavailable | `Degraded`,body `None` |
| not visible | `NotVisible`,body `None` |
| handoff intent missing | `Missing`,body `None`;no create |
| trace refs empty | `Degraded` invalid material |
| delivered without receipt marker | `Degraded` fake delivered material |
| retryable failed / failed / cancelled | return state + safe issue/attempt/receipt markers;no retry/delivery |
| target/scope/private path unsafe | forbidden material surface;do not return target path/secret |

| Test cut | Expected |
|---|---|
| visible pending handoff | returns pending state and safe refs |
| missing intent | `Missing`,no create |
| delivered with receipt marker | returns delivered marker without receipt body |
| delivered without receipt marker | degraded fake delivered guard |
| retryable failed | no retry call |
| target private path attempted | degraded/forbidden material surface |

### 17.12 Operations query page / surface priority

| Priority | Single-object operations query | List operations query |
|---|---|---|
| entry validation failure | `ApplicationError` / entry failure per Step 12 | same;page required for list branch |
| visibility resolver `None` / unavailable | `Degraded`,body `None` | `Degraded`,items empty |
| `access_state = NotVisible` | `NotVisible`,body `None` | `NotVisible`,items empty;do not list when scope/subject/topic precheck exists |
| exact requested object missing | `Missing`,body `None` | exact report branch: `Missing` |
| scope/list repository page empty | not applicable | `Empty`,items empty |
| loaded item missing after list | not applicable | `Degraded` partial |
| loaded item scope/selector mismatch | `Degraded` invalid material | `Degraded` partial |
| all loaded items denied | not applicable | `NotVisible`,items empty |
| mixed visible/redacted/denied | not applicable | `Redacted` partial |
| stale/rebuilding/retryable/failed state | explicit state/surface | explicit item state/surface |
| forbidden body/raw diagnostic | `Degraded` / forbidden material surface | `Degraded` partial |

This table closes operations query item-level priority for 9.2-c. Field-level redaction matrix, HTTP status mapping, and exact public error taxonomy remain in Step 10/12/16.

### 17.13 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.2-c 范围 | 通过 | 只展开 six operations query |
| DTO 是否回指 Step 8 | 通过 | 使用 8.3-c request/view/selector/page DTO |
| Domain 是否回指 Step 6 | 通过 | 使用 projection/reference/report/outbox/handoff state objects and policies |
| Port 是否回指 Step 7 | 通过 | projection/reference/report/outbox/handoff repositories and read visibility resolvers 均已定义 |
| operations visibility 是否正式 | 通过 | 使用 matching resolver;不从字符串推 subject/scope |
| stable ref / lookup 是否正式 | 通过 | state/report/outbox/handoff refs 来自 request、repo lookup 或 loaded object |
| selector mapping 是否闭合 | 通过 | outbox selector 分支一一映射 Step 7 read surface |
| query no-write 是否保持 | 通过 | 不 rebuild、refresh、generate report、publish、deliver、retry、save result |
| not visible / empty / missing 是否区分 | 通过 | not visible 不伪装 empty/missing;exact missing 是 Missing;visible empty list 是 Empty |
| partial item missing priority 是否闭合 | 通过 | operations list item missing/mismatch 统一 degraded partial |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 17.14 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Maintenance / outbox / handoff query flows

`GetProjectionStateFlow` 和 `GetReferenceResolutionStateFlow` 只读取 stored operations state。projection query 通过 `resolve_projection_state_read(...)` 和 projection repository 读取 state,missing/stale/rebuilding/degraded 只返回 query surface,不触发 rebuild。reference query 通过 `resolve_reference_state_read(...)` 和 reference repository 读取 stored state 与同 bundle typed sidecar refs,missing/stale/unavailable 不调用 external resolver、不刷新 sidecar。

`ReadReconciliationReportFlow` 先对 `maintenance_scope_ref` 调 `resolve_reconciliation_scope_read(...)`;scope not visible 时不 list reports。exact report 分支还必须 load report 并对 loaded `report_ref` 调 `resolve_report_read(...)`;scope mismatch 是 degraded invalid material。scope list visible empty 返回 `Empty`;listed report missing 或 invalid material 返回 degraded partial。report query 不生成 report、不修复 truth。

`ListPendingIdentityOutboxFlow` 使用 `IdentityOutboxListSelector` 精确映射 Step 7 outbox repository:pending, retryable, by subject, by member through `IdentityTruthChangeSubjectMapper`, or by trace.每个 loaded record 还要按 outbox ref / subject / topic 做 per-item visibility。query 只返回 body-free outbox state,不 publish、不 retry、不展开 payload/topic secret。

`GetIdentityOutboxStateFlow` 和 `GetTraceHandoffStateFlow` 只读单个 outbox record / handoff intent state。outbox `Published` 只代表 outbound boundary accepted,不代表 downstream consumed。handoff `Delivered` 必须带 `HandoffReceiptRef` marker,receipt body 不进入 DTO;query 不调用 delivery adapter、不重试、不伪造 delivered。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 17.15 进入下一批条件

进入 9.3 前必须满足:

- 用户审核通过 9.2-c。
- 9.3 只写 `HandleRoleCapabilitySourceChangedFlow`,`HandleWorkParticipationAcceptedFlow`,`HandleMemoryReferenceSourceStateChangedFlow`,`HandleArchiveHandoffResultFlow`,`HandleTraceHandoffResultFlow`。
- Consumer/callback flow 必须使用 stored receipt replay,不得 duplicate 重跑 mutation。
- Reference sidecar save 必须使用同一 `ExternalReferenceRef` bundle 的 versioned read;business source ref、source version、event id 不得当 expected_version。
- Marker trace subject 必须来自 `IdentityMarkerSubjectMapper`,不得从 topic/source/ref 字符串拼接。
- Callback delivered / receipt state 必须来自 formal receipt marker,不得用 adapter ok、HTTP 2xx、job log success 伪造 delivered。
- 若 consumer/callback 的 reference bundle、stored receipt、marker trace subject、callback target lookup 或 accepted/outbox side effect 不闭合,必须暂停回 Step 6/7/8/12/13,不得在 flow 中私补。

## 18. Consumer / callback flow batch 9.3: inbound event and handoff result

本批覆盖五条 inbound consumer / callback flow:

- `HandleRoleCapabilitySourceChangedFlow`
- `HandleWorkParticipationAcceptedFlow`
- `HandleMemoryReferenceSourceStateChangedFlow`
- `HandleArchiveHandoffResultFlow`
- `HandleTraceHandoffResultFlow`

本批承接 9.0 shared inbound consumer / callback discipline 和 Step 8 `8.4 inbound event / callback protocols`。五条 flow 都必须使用 `IdentityInboundEventEnvelope<T>` 的 `source_event_ref`、`idempotency_key` 和 canonical digest 进入 idempotency reserve;duplicate 只能读取 typed `IdentityConsumerReceiptEnvelope` 并返回 stored `receipt`,不得重跑 mutation、重新解析 payload、重写 snapshot/relation/handoff state、重建 trace/outbox 或重算 projection stale。

本批不写 outbound accepted material audit 的完整 payload/topic 选择,只在 accepted flow 中允许创建 Step 8 已存在的 canonical outbox material marker;十条 outbound material 的字段逐项审计留 9.4。本批不写 worker ack/retry/dead-letter、HTTP status、完整 retry/backoff、完整状态矩阵、错误 taxonomy、Step 13 duplicate replay table 或 Step 14 binding。

### 18.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `RoleCapabilitySourceSnapshot` / `RoleCapabilitySummary` | source snapshot resolved/stale/unavailable/unrecognized,summary stale/unavailable marker |
| Step 6 `CareerRecord` / `CareerAppendPolicy` | append-only career event ingestion,source duplicate no-op,forbidden work body rejection |
| Step 6 `MemoryReference` / `MemoryReferenceState` / `MemoryReferencePolicy` | memory source refresh、archive callback result、pending verification、handoff failed/archived markers |
| Step 6 `TraceHandoffIntent` / `HandoffState` / `HandoffPolicy` | callback delivered/retryable failed/failed/cancelled state update;delivered requires formal receipt |
| Step 7 id generator / clock / UoW / idempotency | receipt refs、stored result refs、trace/outbox refs、cursor、reserve/complete |
| Step 7 role/career/memory/handoff repositories | versioned load/save,source duplicate lookup,callback target lookup |
| Step 7 reference repository | `ExternalReferenceRef` bundle versioned read and typed sidecar same-bundle save |
| Step 7 trace/audit/outbox/projection repositories | accepted trace/audit/outbox/stale;marker trace for reference-only branch |
| Step 7 subject mappers | accepted truth subject mapper and marker subject mapper;no subject string construction |
| Step 8 inbound payload / receipt DTOs | five payloads,`IdentityConsumerReceipt`,typed receipt envelope replay |

### 18.2 本批问题回答

| 问题 | 回答 |
|---|---|
| consumer/callback 是否保存完整 replay receipt | 是。`IdentityConsumerReceiptEnvelope` 是 replay source;`StoredIdentityOperationResult` 只作为 shell/索引,不能单独回放 public receipt |
| idempotency duplicate 与业务 source duplicate 如何区分 | idempotency replay 优先,返回 stored `DuplicateReplayed`/stored receipt;source duplicate 是 fresh business branch,返回 `Noop` receipt 并保存 envelope |
| consumer accepted 用 truth cursor 还是 reference marker cursor | 写 identity-owned truth/relation/intent 时用 truth cursor;只写 reference sidecar/source marker 且无 accepted truth 时用 reference marker cursor |
| source snapshot update 是否一定有 accepted truth subject | 有。`RoleCapabilitySourceSnapshotRef` 已进入 `IdentityTruthChangeSubjectMapper.role_capability_source_snapshot_subjects(...)`,用于 source-state outbox/trace/audit |
| reference sidecar expected_version 从哪里来 | 只来自同一个 `ExternalReferenceRef` 的 `get_reference_state_with_version(...)` 返回 version;missing create 可用 `None` 保存 state,但 typed sidecar save 必须在 state version 存在后使用同 bundle version |
| memory source missing relation 是否自动 create | 不自动。payload 缺 local relation时,只允许通过 memory/archive typed lookup 找到 existing relation;仍 missing 则 `Quarantined`/`Rejected` receipt,不创建新 relation |
| archive callback direct ref 与 handoff lookup 冲突怎么办 | direct ref 与 `find_callback_target_by_handoff(...)` 同时存在且不一致时 rejected/quarantined receipt;不得任选其一 |
| trace handoff delivered 可否由 attempt 成功/HTTP 2xx 推进 | 否。`Delivered` 必须有 `HandoffReceiptRef`;失败/取消必须有 `HandoffIssueRef` |
| callback accepted 是否能创建 outbox | 可以,但只能创建 Step 8 已有 `MemoryArchiveHandoffStateChanged` material marker;payload/topic 字段逐项审计留 9.4 |

### 18.3 Shared consumer/callback transaction flow

```text
[Worker entry / callback entry]
  | validate envelope shell,consumer_name,binding,source_event_ref,idempotency_key,schema_version
  | unsupported schema before unsafe payload parse -> UnsupportedVersion receipt envelope
  | build IdentityOperationContext::from_inbound_event(...) or from_handoff_callback(...)
  | dispatch_inbound_event(...) or dispatch_callback(...)
  v
[Application consumer/callback service]
  | begin IdentityUnitOfWork
  | reserve idempotency(context, record_ref, now, uow)
  | ReplayAvailable:
  |   if consumer family -> get_consumer_receipt(stored_result_ref)
  |   if callback family -> get_handoff_callback_receipt(stored_result_ref)
  |   missing/wrong-kind -> rollback and return replay degraded/error per Step 12/13
  |   rollback and return stored envelope.receipt
  | Conflict/InFlight -> safe issue receipt or entry error per Step 12/13;no mutation
  v
[Payload validation and domain/repository writes]
  | assert body-free material marker
  | load required member/truth/reference with version
  | run Step 6 policy/factory/member method
  | save changed truth/reference/sidecar in same UoW
  | assign truth cursor or reference marker cursor after writes are staged
  | append accepted trace/audit/outbox/stale or marker trace/stale according to branch
  | assemble IdentityConsumerReceipt + IdentityConsumerReceiptEnvelope
  | save typed envelope,complete idempotency with stored_result_ref,commit
```

| Branch priority | Handling |
|---|---|
| unsupported schema | `UnsupportedVersion` receipt if envelope can be trusted;do not parse unsafe payload |
| idempotency replay | load typed receipt envelope;return stored `receipt`;no mutation |
| idempotency conflict / in-flight | conflict / delayed surface per Step 12/13;no mutation |
| forbidden body marker | `Rejected` receipt;save envelope only when Step 12/13 says replayable |
| transient dependency unavailable | `DelayedRetry` receipt with safe issue;no truth mutation unless explicitly staged as reference marker branch |
| missing/untrusted/manual review | `Quarantined` receipt;optional report/marker only when formally defined |
| source duplicate already reflected | `Noop` receipt;save envelope;no new truth/history |
| accepted mutation | save changed truth/state/reference,trace/outbox/stale,receipt envelope |

### 18.4 `HandleRoleCapabilitySourceChangedFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityInboundEventEnvelope<RoleCapabilitySourceChangedPayload>` |
| 入口 | `IdentityApplicationFacade::dispatch_inbound_event(...)` |
| application service | `IdentityConsumerService.handle_role_capability_source_changed(envelope, context)` |
| 写入对象 / policy | `RoleCapabilitySourceSnapshot`, optional `RoleCapabilitySummary`, optional `ReferenceResolutionState` sidecar |
| 主要 port | UoW/idempotency/stored receipt/id/clock,`RoleCapabilityRepository`,`IdentityReferenceStateRepository`,trace/audit/outbox/projection repositories,truth/marker subject mapper |
| receipt kind | `ConsumerReceipt` |

```text
[HandleRoleCapabilitySourceChangedFlow]
  | reserve idempotency;duplicate -> get_consumer_receipt(...)
  | validate member_ref,source_ref,source_version_ref,source_state_kind,material_marker
  | if source_version_ref !belongs_to source_ref -> Rejected receipt
  | if safe_summary/evidence refs present,assert each belongs_to source_ref where type supports it
  | load existing snapshot = find_source_snapshot_by_source(source_ref)
  | load optional current summary = find_current_summary_by_member(member_ref)
  v
[Snapshot branch]
  | if source_state_kind == SourceResolved:
  |   require safe_summary_ref Some
  |   snapshot = from_resolved_source(existing_or_new_snapshot_ref,source_ref,source_version_ref,safe_summary,evidence_refs,now)
  | else if SourceUnavailable -> snapshot = unavailable(existing_or_new_snapshot_ref,source_ref,source_version_ref,now)
  | else if SourceUnrecognized -> snapshot = unrecognized(existing_or_new_snapshot_ref,source_ref,source_version_ref,now)
  | else if SourceStale/Superseded -> update existing snapshot state only when existing snapshot found;missing -> marker-only / quarantined per Step 12
  | save_source_snapshot(snapshot, existing_version_or_None, uow)
  v
[Optional summary effect]
  | if current summary exists and snapshot state not usable:
  |   summary.mark_stale(...) or mark_unavailable(...)
  |   save_summary(summary, summary_version, uow)
  | else no summary create in source consumer
  v
[Optional external reference sidecar]
  | if external_reference_ref and reference_owner_ref both present:
  |   state_v = get_reference_state_with_version(external_reference_ref)
  |   save_reference_state(updated state, state_v.version_or_None, uow)
  |   refreshed_v = get_reference_state_with_version(external_reference_ref)
  |   save_typed_sidecar_refs(external_reference_ref, role safe/source version sidecar refs, refreshed_v.version, uow)
  | if only one of external_reference_ref/reference_owner_ref present -> Rejected/Quarantined receipt
  v
[Accepted side effects]
  | cursor = assign_truth_change_cursor()
  | subjects = role_capability_source_snapshot_subjects(snapshot_ref)
  | append accepted trace/audit for source snapshot change
  | if current summary changed,also use role_capability_subjects(summary_ref) for summary trace/outbox/stale
  | create outbox record for RoleCapabilitySourceStateChanged material only;summary changed also creates RoleCapabilitySummaryChanged per 9.4 rule
  | expand affected projections from subjects
  | save typed ConsumerReceipt envelope;complete idempotency;commit
```

| Branch | Handling |
|---|---|
| duplicate idempotency key same digest | replay `get_consumer_receipt(stored_result_ref).receipt` |
| source version does not belong to source | `Rejected`;no snapshot save |
| resolved without safe summary | `Rejected` or `Quarantined`;no active snapshot |
| unsupported source state | `Rejected` receipt;no state invention |
| existing snapshot missing for stale/superseded update | `Quarantined` marker receipt;no source snapshot id derived from source |
| partial external reference bundle fields | `Rejected` / `Quarantined`;no sidecar write |
| reference bundle missing on sidecar update | create reference state first,then sidecar uses refreshed same-bundle version;no source version as expected_version |

| Test cut | Expected |
|---|---|
| resolved source accepted | snapshot saved,trace/outbox/stale,stored typed receipt |
| source duplicate idempotency replay | returns stored receipt;no snapshot save |
| source stale marks summary stale | summary versioned save,source outbox material present |
| external reference sidecar | same `ExternalReferenceRef` version used for state/sidecar |
| partial external reference marker | rejected/quarantined receipt,no sidecar |
| forbidden source body marker | rejected receipt,no source body saved |

### 18.5 `HandleWorkParticipationAcceptedFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityInboundEventEnvelope<WorkParticipationAcceptedPayload>` |
| 入口 | `IdentityApplicationFacade::dispatch_inbound_event(...)` |
| application service | `IdentityConsumerService.handle_work_participation_accepted(envelope, context)` |
| 写入对象 / policy | `CareerRecord`, `CareerAppendPolicy` |
| 主要 port | UoW/idempotency/stored receipt/id/clock,`GlobalMemberRepository`,`CareerRecordRepository`,trace/audit/outbox/projection repositories,truth subject mapper |
| receipt kind | `ConsumerReceipt` |

```text
[HandleWorkParticipationAcceptedFlow]
  | reserve idempotency;duplicate -> get_consumer_receipt(...)
  | validate member_ref,project_participation_ref,work_source_ref,career_source_marker_ref,safe_summary_ref,material_marker
  | load member = get_member_with_version(member_ref)
  | if member missing -> Quarantined/Rejected receipt;no career append
  | duplicate_source = find_duplicate_source_record(career_source_marker_ref)
  | if duplicate_source Some -> Noop receipt;save typed envelope;complete idempotency;commit
  v
[Append]
  | source_summary = WorkParticipationSourceSummary from payload body-free markers with Trusted state
  | policy = CareerAppendPolicy::for_append(member_ref,member_exists=true,source_summary,existing=[],reason,actor,Consumer,Append,material_marker)
  | policy.assert_member_exists();assert_source_trusted();assert_not_duplicate();assert_append_only();assert_not_work_truth_write();assert_allowed_write_channel()
  | record_ref = new_career_record_id -> CareerRecordRef
  | record = CareerRecord::append_from_work_source(record_ref,member_ref,source_summary,reason,actor,now)
  | append_career_record(record,uow)
  | cursor = assign_truth_change_cursor()
  | subjects = career_record_subjects(record_ref)
  | append trace/audit;create CareerRecordAppended outbox material marker;mark affected projections stale
  | save typed ConsumerReceipt envelope;complete idempotency;commit
```

| Branch | Handling |
|---|---|
| idempotency replay | stored envelope receipt |
| member missing | `Quarantined` or replayable `Rejected` receipt;no pending career record invented |
| source duplicate found | fresh `Noop` receipt,not `DuplicateReplayed`;no new history |
| safe summary missing | entry validation / rejected;work body is not resolver fallback |
| forbidden work body marker | rejected receipt,no work body saved |

| Test cut | Expected |
|---|---|
| work accepted append | one career record appended,trace/outbox/stale,typed receipt |
| same idempotency replay | stored receipt,no append |
| same source different event key | `Noop` receipt,no append |
| member missing | no career record |
| forbidden Project/Work/ProjectMember body | rejected,no forbidden body persisted |

### 18.6 `HandleMemoryReferenceSourceStateChangedFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityInboundEventEnvelope<MemoryReferenceSourceStateChangedPayload>` |
| 入口 | `IdentityApplicationFacade::dispatch_inbound_event(...)` |
| application service | `IdentityConsumerService.handle_memory_reference_source_state_changed(envelope, context)` |
| 写入对象 / policy | `MemoryReference`, `MemoryReferenceState`, optional `ReferenceResolutionState` sidecar |
| 主要 port | UoW/idempotency/stored receipt/id/clock,`GlobalMemberRepository`,`MemoryReferenceRepository`,`IdentityReferenceStateRepository`,trace/audit/outbox/projection repositories,truth/marker subject mapper |
| receipt kind | `ConsumerReceipt` |

```text
[HandleMemoryReferenceSourceStateChangedFlow]
  | reserve idempotency;duplicate -> get_consumer_receipt(...)
  | validate member_ref,source_ref,target_state_kind,material_marker
  | require at least one of memory_reference_ref,memory_ref,archive_ref or external_reference_ref marker family
  | load member;missing -> Quarantined/Rejected receipt
  | resolve existing relation:
  |   if memory_reference_ref Some -> get_memory_reference_with_version(ref)
  |   else if memory_ref Some -> find_reference_by_memory(member_ref,memory_ref)
  |   else if archive_ref Some -> find_reference_by_archive(member_ref,archive_ref)
  |   else -> no relation
  | if no relation -> Quarantined receipt;do not create relation from event
  | require loaded relation belongs_to(member_ref);else Rejected/Quarantined
  v
[State update]
  | source_summary = MemoryReferenceSourceSummary from payload markers and target/source state
  | policy = MemoryReferencePolicy::for_refresh(member_ref,true,source_summary,reason,actor,Consumer,material_marker)
  | assert_member_exists();assert_reference_present();assert_body_free();assert_allowed_write_channel()
  | state = MemoryReferenceState from target_state_kind and formal refs:
  |   Linked requires memory_ref and safe_summary when Step 10 says required
  |   Archived/Migrated requires archive_ref or archive_handoff_ref
  |   HandoffFailed requires archive_handoff_ref and issue/reason marker where applicable
  | update_reference_state(state,reason,actor,now)
  | save_memory_reference(reference, Some(loaded_version), uow)
  v
[Optional external reference sidecar]
  | if external_reference_ref and reference_owner_ref both present:
  |   read same bundle version;save reference state;save memory safe sidecar with same bundle version
  | if partial -> Rejected/Quarantined receipt
  v
[Accepted side effects]
  | cursor = assign_truth_change_cursor()
  | subjects = memory_reference_subjects(reference_ref)
  | append trace/audit;create MemoryReferenceChanged outbox material marker
  | if archive_handoff_ref present and target state is archive/handoff material,also create MemoryArchiveHandoffStateChanged marker per 9.4 rule
  | mark affected projections stale
  | save typed ConsumerReceipt envelope;complete idempotency;commit
```

| Branch | Handling |
|---|---|
| relation not found | `Quarantined`;no auto-create relation |
| direct relation member mismatch | `Rejected` / `Quarantined`;no state update |
| all carrier refs missing | `Rejected`;no relation update |
| target state lacks required formal marker | `Rejected` / `Quarantined`;Step 10 fixes exact matrix |
| partial external reference marker | no sidecar write |
| reference-only sidecar update without relation | allowed only as reference marker branch if Step 12/13 marks it replayable;no memory truth/outbox |

| Test cut | Expected |
|---|---|
| existing relation refresh accepted | relation versioned save,trace/outbox/stale,typed receipt |
| missing relation | quarantined receipt,no relation create |
| memory lookup by memory ref | uses formal repo lookup,not id parsing |
| external reference sidecar | same bundle version |
| forbidden memory/archive body | rejected,no body saved |

### 18.7 `HandleArchiveHandoffResultFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityInboundEventEnvelope<ArchiveHandoffResultPayload>` |
| 入口 | `IdentityApplicationFacade::dispatch_callback(...)` |
| application service | `IdentityCallbackService.handle_archive_handoff_result(envelope, context)` |
| 写入对象 / policy | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` |
| 主要 port | UoW/idempotency/stored callback receipt/id/clock,`GlobalMemberRepository`,`MemoryReferenceRepository`,trace/audit/outbox/projection repositories,truth subject mapper |
| receipt kind | `HandoffCallbackReceipt` |

```text
[HandleArchiveHandoffResultFlow]
  | reserve idempotency;duplicate -> get_handoff_callback_receipt(...)
  | validate member_ref,archive_ref,archive_handoff_ref,target_state_kind,material_marker
  | load direct relation if memory_reference_ref Some
  | lookup_target = find_callback_target_by_handoff(archive_handoff_ref)
  | if both direct and lookup exist and differ -> Rejected/Quarantined callback receipt
  | target_ref = direct or lookup
  | if target_ref missing -> Quarantined callback receipt;no relation create
  | load relation with version;require belongs_to(member_ref)
  v
[Apply handoff result]
  | source_summary = MemoryReferenceSourceSummary with archive_ref,archive_handoff_ref,HandoffResultAccepted/Failed from target_state_kind
  | policy = MemoryReferencePolicy::for_archive_handoff(member_ref,true,source_summary,reason,actor,HandoffCallback,material_marker)
  | assert_handoff_marker_body_free();assert_reference_present();assert_allowed_write_channel()
  | state = MemoryReferenceState from target_state_kind:
  |   Archived/Migrated requires archive_ref and archive_handoff_ref
  |   HandoffFailed requires archive_handoff_ref and issue_ref or reason marker per Step 10
  |   Linked from archive callback requires explicit safe relation marker;otherwise rejected/quarantined
  | update relation state and optional archive refs
  | save_memory_reference(relation, Some(version), uow)
  | cursor = assign_truth_change_cursor()
  | subjects = memory_reference_subjects(reference_ref)
  | append trace/audit;create MemoryArchiveHandoffStateChanged and,when relation state changed,MemoryReferenceChanged material marker per 9.4 rule
  | mark affected projections stale
  | save typed HandoffCallbackReceipt envelope;complete idempotency;commit
```

| Branch | Handling |
|---|---|
| duplicate callback | replay typed callback envelope;wrong-kind not accepted |
| direct ref and handoff lookup mismatch | rejected/quarantined receipt;no update |
| handoff target missing | quarantined receipt;no auto-create |
| relation member mismatch | rejected/quarantined receipt |
| failed/cancelled without issue marker when required | rejected/quarantined;Step 10/12 define exact public priority |
| archive package / receipt body present | rejected;only refs/issue markers saved |

| Test cut | Expected |
|---|---|
| callback direct target accepted | relation updated,callback envelope stored |
| callback lookup accepted | uses `find_callback_target_by_handoff`,not raw body |
| target mismatch | rejected/quarantined,no update |
| missing target | quarantined,no create |
| callback replay | stored callback receipt,no relation update |

### 18.8 `HandleTraceHandoffResultFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityInboundEventEnvelope<TraceHandoffResultPayload>` |
| 入口 | `IdentityApplicationFacade::dispatch_callback(...)` |
| application service | `IdentityCallbackService.handle_trace_handoff_result(envelope, context)` |
| 写入对象 / policy | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` |
| 主要 port | UoW/idempotency/stored callback receipt/id/clock,`TraceHandoffIntentRepository`,trace/audit/outbox/projection repositories,truth/marker subject mapper |
| receipt kind | `HandoffCallbackReceipt` |

```text
[HandleTraceHandoffResultFlow]
  | reserve idempotency;duplicate -> get_handoff_callback_receipt(...)
  | validate handoff_intent_ref,handoff_target_ref,attempt_ref,result_kind
  | load intent_v = get_handoff_intent_with_version(handoff_intent_ref)
  | if missing -> Quarantined/Rejected callback receipt;no intent create
  | require intent target == payload.handoff_target_ref
  | if payload.handoff_scope_ref Some,require matches intent scope
  | require intent.trace_record_refs non-empty and safe_material marker body-free
  v
[State update]
  | if result_kind == Delivered:
  |   require receipt_ref Some
  |   HandoffPolicy.assert_receipt_is_marker(receipt_ref)
  |   state = HandoffState::delivered(attempt_ref,receipt_ref,now)
  |   intent.mark_delivered(state)
  | else if RetryableFailed:
  |   require issue_ref Some
  |   state = HandoffState::retryable_failed(attempt_ref,issue_ref,now)
  |   intent.mark_retryable_failed(state)
  | else if Failed:
  |   require issue_ref Some
  |   state = HandoffState::failed(attempt_ref,issue_ref,now)
  |   intent.mark_failed(state)
  | else if Cancelled:
  |   require issue_ref Some
  |   state = HandoffState::cancelled(issue_ref,now)
  |   intent.mark_cancelled(state)
  | save_handoff_intent(intent, Some(intent_version), uow)
  v
[Accepted side effects]
  | cursor = assign_truth_change_cursor()
  | subjects = handoff_intent_subjects(handoff_intent_ref)
  | append accepted trace/audit for handoff state change
  | if Delivered and receipt_ref Some:
  |   marker_subject = handoff_receipt_marker_subject(receipt_ref)
  |   append marker trace with same cursor only as receipt marker trace;do not replace accepted subject
  | create MemoryArchiveHandoffStateChanged outbox material marker with handoff_intent_ref,handoff_state_kind,receipt/issue marker per 9.4 rule
  | mark affected projections stale
  | save typed HandoffCallbackReceipt envelope;complete idempotency;commit
```

| Branch | Handling |
|---|---|
| duplicate callback | replay typed callback envelope |
| missing intent | quarantined/rejected receipt;no intent create |
| target mismatch | rejected/quarantined;no state update |
| scope mismatch | rejected/quarantined;no state update |
| delivered without receipt | rejected/quarantined fake-delivered guard |
| failed/retryable/cancelled without issue | rejected/quarantined;no raw adapter error body |
| adapter raw response present | rejected/forbidden material surface |

| Test cut | Expected |
|---|---|
| delivered callback accepted | intent Delivered with receipt marker,trace/outbox/stale,typed callback receipt |
| delivered without receipt | rejected/quarantined,no delivered state |
| retryable failed | state has issue marker,no retry in callback flow |
| target mismatch | no state update |
| duplicate callback | stored envelope replay,no update |

### 18.9 Consumer / callback receipt envelope priority

| Priority | Consumer path | Callback path |
|---|---|---|
| envelope unsupported schema | `UnsupportedVersion` receipt envelope if safe envelope fields parse | same |
| idempotency same key/same digest completed | `get_consumer_receipt(stored_result_ref)`;return stored receipt | `get_handoff_callback_receipt(stored_result_ref)`;return stored receipt |
| stored envelope missing / wrong kind | no mutation;Step 12/13 replay degraded/error | no mutation;wrong kind not treated as consumer receipt |
| same key/different digest | conflict / rejected surface per Step 12/13 | same |
| source/truth duplicate | fresh `Noop` receipt stored as new envelope | usually not applicable except repeated non-idempotent callback target marker detected |
| accepted mutation | `Accepted` receipt with trace/outbox refs | `Accepted` receipt with trace/outbox refs |
| quarantined/delayed/rejected | stored envelope when replayable per Step 12/13 | stored callback envelope when replayable |

### 18.10 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.3 范围 | 通过 | 只展开五条 consumer/callback flow |
| DTO 是否回指 Step 8 | 通过 | 使用 8.4 inbound/callback payload 和 `IdentityConsumerReceipt` |
| Domain 是否回指 Step 6 | 通过 | 使用 source snapshot、career、memory relation、handoff intent/state/policy |
| Port 是否回指 Step 7 | 通过 | repository、idempotency、typed receipt envelope、subject mapper、reference bundle port 均已定义 |
| receipt ref 来源是否闭合 | 通过 | `IdentityIdGeneratorPort.new_identity_consumer_receipt_ref()` |
| duplicate replay 是否闭合 | 通过 | typed consumer/callback receipt envelope save/get,不靠 generic shell |
| source snapshot outbox subject 是否正式 | 通过 | `role_capability_source_snapshot_subjects(...)` |
| reference expected_version 是否闭合 | 通过 | 同一 `ExternalReferenceRef` bundle 的 versioned read |
| callback target priority 是否闭合 | 通过 | direct ref 与 handoff lookup 冲突不任选;missing target 不创建 relation |
| delivered fake guard 是否保持 | 通过 | delivered 必须有 formal receipt marker |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 18.11 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Inbound consumer / callback flows

五条 consumer/callback flow 均先使用 envelope 的 `source_event_ref`、`idempotency_key` 和 canonical digest reserve idempotency。Duplicate replay 必须读取 typed `IdentityConsumerReceiptEnvelope` 并返回 stored `receipt`;consumer 使用 `get_consumer_receipt(...)`,callback 使用 `get_handoff_callback_receipt(...)`。`StoredIdentityOperationResult` 只是 stored shell,不能单独重建 public receipt。

`HandleRoleCapabilitySourceChangedFlow` 保存 body-free `RoleCapabilitySourceSnapshot`,必要时标记 current summary stale/unavailable,并可在同一 `ExternalReferenceRef` bundle 上保存 reference state 与 typed sidecar。`HandleWorkParticipationAcceptedFlow` 只从 work accepted body-free marker 追加 `CareerRecord`;idempotency duplicate 是 replay,source duplicate 是 fresh `Noop` receipt。`HandleMemoryReferenceSourceStateChangedFlow` 只更新已存在 relation 或 same-bundle reference sidecar;missing relation 不自动 create。

`HandleArchiveHandoffResultFlow` 通过 direct `MemoryReferenceRef` 或 `find_callback_target_by_handoff(...)` 找到 relation;两者冲突时拒绝/隔离,missing target 不创建 relation。`HandleTraceHandoffResultFlow` 更新 `TraceHandoffIntent` 的 `HandoffState`;`Delivered` 必须带 formal `HandoffReceiptRef`,失败/取消必须带 safe issue marker。Callback accepted 可创建 `MemoryArchiveHandoffStateChanged` material marker,但 payload/topic 逐项审计留 outbound accepted material audit。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 18.12 进入下一批条件

进入 9.4 前必须满足:

- 用户审核通过 9.3。
- 9.4 只审计十条 outbound accepted material 的字段来源、payload marker、topic key、accepted-only 来源和 publish 输入闭环。
- Outbound material 不得从 current truth 重构,必须来自 accepted transaction 内保存的 payload marker/snapshot。
- `RoleCapabilitySourceStateChanged`,`MemoryArchiveHandoffStateChanged` 等 consumer/callback accepted material 必须逐字段回指 9.3 saved object/state/trace/cursor。
- 若 payload marker -> durable payload snapshot、topic binding、outbox subject 或 publish replay surface 不闭合,必须暂停回 Step 7/8/11/13/14,不得在 publish flow 中私补。

## 19. Outbound material batch 9.4: accepted event material audit

本批覆盖十条 outbound accepted material:

- `GlobalMemberEstablished`
- `IdentityAnchorChanged`
- `GlobalLifecycleChanged`
- `GlobalMemberAvailabilityChanged`
- `RoleCapabilitySummaryChanged`
- `RoleCapabilitySourceStateChanged`
- `CareerRecordAppended`
- `CareerCorrectionAppended`
- `MemoryReferenceChanged`
- `MemoryArchiveHandoffStateChanged`

本批承接 Step 8 `8.5 outbound event protocols`。十条 outbound event 不各自拥有独立 publish flow;它们只在 command / consumer / callback accepted transaction 内创建 `IdentityOutboxRecord` material,发布统一由 9.5 `PublishIdentityOutboxFlow` 读取 saved outbox record、topic binding 和 payload marker 后处理。本批不定义 broker topic 字符串、不定义 serialized payload snapshot persistence、不定义 publish retry/backoff、不定义 durable adapter binding、不定义 stored job report replay。

### 19.1 本批输入与承接

| 输入 | 承接内容 |
|---|---|
| Step 6 `IdentityOutboxRecord` / `OutboundEventPolicy` | accepted-only outbox material、body-free payload marker、topic boundary、publish not acceptance gate |
| Step 6 `IdentityChangeKindRef` | outbox change kind 与 accepted trace change kind 一致;不新增 event-only change kind |
| Step 7 `IdentityTruthChangeSubjectMapper` | outbox subject 来自 accepted truth typed ref;不得强转 trace subject 或拼字符串 |
| Step 7 `IdentityIdGeneratorPort` | `new_identity_outbox_record_ref()` 与 `new_identity_outbox_payload_marker_ref()` |
| Step 7 `IdentityOutboxRepository.save_outbox_record(...)` | accepted transaction 内保存 pending outbox;不保存 event body |
| Step 7 `IdentityTopicBindingPort` / `IdentityOutboxPublisherPort` | 只作为 9.5 publish 输入边界;本批只固定 topic key / payload marker |
| Step 8 outbound payload DTO | 十条 payload 的字段 schema、topic key、schema version、body-free 边界 |
| Step 9.1 command flows | member/lifecycle/role/career/memory accepted truth、trace、cursor、outbox candidate |
| Step 9.3 consumer/callback flows | role source、work participation、memory source、archive/trace handoff callback accepted material |

### 19.2 本批问题回答

| 问题 | 回答 |
|---|---|
| outbound event 是否单独进入 idempotency | 否。material 是 accepted side effect;duplicate replay 来自 command / consumer / callback stored result or receipt,不得重建 outbox |
| payload marker 从哪里来 | `IdentityIdGeneratorPort.new_identity_outbox_payload_marker_ref()` 或等价 payload material builder;marker 绑定 event name、schema version、payload字段、trace、subject 和 cursor |
| outbox subject 从哪里来 | `IdentityTruthChangeSubjectMapper` 对 accepted truth ref 的输出 `outbox_subject_ref`;不得从 payload member/source/topic 字符串生成 |
| topic key 从哪里来 | Step 8 §16.4 canonical topic key map;Step 14 才绑定 broker topic / route / secret |
| accepted cursor 从哪里来 | command / consumer / callback accepted transaction 内 `IdentityUnitOfWork.assign_truth_change_cursor()`;不得用 timestamp、version、event id、payload marker 或 idempotency key |
| publisher 能否读取 current truth 重构 event | 否。9.5 publisher 只能消费 saved `IdentityOutboxRecordRef`、`TopicBindingResolution` 和 `IdentityOutboxPayloadMarkerRef` |
| durable payload body 是否已闭合 | 未在本批定义。Step 8 已说明若 durable publisher 需要 marker -> serialized envelope snapshot,必须在 Step 11/13/14 正式补 storage/read/replay surface |
| skipped / forbidden material 如何处理 | forbidden body / not visible topic material 不创建正常 pending outbox;exact public skipped/rejected surface 留 Step 10/12,不得静默发布 |

### 19.3 Shared accepted material creation flow

```text
[Accepted command / consumer / callback transaction]
  | save accepted truth/state with expected_version
  | cursor = IdentityUnitOfWork.assign_truth_change_cursor()
  | subjects = IdentityTruthChangeSubjectMapper.<truth-family>_subjects(accepted_truth_ref)
  | append IdentityTraceRecord::from_accepted_change(...)
  | run Shared accepted audit append subflow
  v
[Outbound material audit]
  | for each allowed event material:
  |   payload = typed Step 8 outbound payload from saved truth/state + cursor
  |   payload_marker_ref = new_identity_outbox_payload_marker_ref()
  |   policy = OutboundEventPolicy::for_outbox(subjects.outbox_subject_ref,change_kind,payload_marker_ref,topic_key,visibility_context)
  |   assert_from_accepted_change(trace_record_ref)
  |   assert_payload_body_free()
  |   assert_visible_for_topic()
  |   assert_publish_not_acceptance_gate()
  |   outbox_ref = new_identity_outbox_record_ref()
  |   record = IdentityOutboxRecord::from_accepted_change(...)
  |   IdentityOutboxRepository.save_outbox_record(record, None, uow)
  v
[Accepted result / receipt]
  | include saved outbox_record_refs in command effect or consumer receipt
  | save stored result/receipt;complete idempotency;commit
```

| Shared invariant | Rule |
|---|---|
| accepted-only | normal outbound material only after accepted truth/state save is staged |
| trace required | every outbox record uses same accepted `trace_record_ref` that explains the truth/state change |
| body-free | payload fields are refs, state kinds, safe summary refs, issue/receipt markers and cursor only |
| topic marker | `topic_key_ref` must equal Step 8 event map;no broker string |
| duplicate replay | duplicate returns stored command result / typed receipt containing original outbox refs;no second outbox record |
| publish failure | later publish failure updates `OutboxState` only;never rolls back accepted truth |

### 19.4 Material inventory and source closure

| Material | Accepted source | Subject mapper input | Change kind | Topic key | Required payload source |
|---|---|---|---|---|---|
| `GlobalMemberEstablished` | `EstablishGlobalMemberFlow` accepted create | `member_subjects(member_ref)` | `MemberAnchorChanged` | `identity.global-member.established.v1` | saved `GlobalMember`, initial `IdentityAnchorState`, initial `GlobalLifecycleState`, actor/time, cursor |
| `IdentityAnchorChanged` | establish anchor create or terminal lifecycle anchor hold | `member_subjects(member_ref)` | `MemberAnchorChanged` | `identity.anchor.changed.v1` | saved `IdentityAnchorState`, optional `IdentityAnchorReasonRef`, changed time, cursor |
| `GlobalLifecycleChanged` | `UpdateGlobalLifecycleStateFlow` accepted lifecycle transition | `member_subjects(member_ref)` | `LifecycleChanged` | `identity.lifecycle.changed.v1` | saved new `GlobalLifecycleState`, request reason/basis/actor/time, optional terminal anchor state, cursor |
| `GlobalMemberAvailabilityChanged` | lifecycle accepted transition whose old/new `is_available()` differs | `member_subjects(member_ref)` | `LifecycleChanged` | `identity.global-member.availability.changed.v1` | saved new `GlobalLifecycleState`, `new_lifecycle.is_available()`, reason/time, cursor |
| `RoleCapabilitySummaryChanged` | `MaintainRoleCapabilitySummaryFlow` accepted summary save or source consumer summary state effect | `role_capability_subjects(summary_ref)` | `RoleCapabilitySummaryChanged` | `identity.role-capability.summary.changed.v1` | saved `RoleCapabilitySummary`, linked snapshot, source/evidence/safe summary refs, cursor |
| `RoleCapabilitySourceStateChanged` | command saved source snapshot or `HandleRoleCapabilitySourceChangedFlow` accepted source snapshot | `role_capability_source_snapshot_subjects(snapshot_ref)` | `RoleCapabilitySummaryChanged` | `identity.role-capability.source-state.changed.v1` | saved `RoleCapabilitySourceSnapshot`, optional linked summary, source/version/state/safe refs, cursor |
| `CareerRecordAppended` | normal career append accepted | `career_record_subjects(record_ref)` | `CareerRecordChanged` | `identity.career.record.appended.v1` | saved new `CareerRecord` with `Appended`, source marker, safe summary, reason/time, cursor |
| `CareerCorrectionAppended` | correction append accepted | `career_record_subjects(correction_record_ref)` | `CareerRecordChanged` | `identity.career.correction.appended.v1` | saved correction `CareerRecord`, loaded original ref, source marker, safe summary, reason/time, cursor |
| `MemoryReferenceChanged` | memory relation accepted create/update/source refresh | `memory_reference_subjects(memory_reference_ref)` | `MemoryReferenceChanged` | `identity.memory.reference.changed.v1` | saved `MemoryReference`, `MemoryReferenceState`, memory/archive/handoff/source/safe refs, reason/time, cursor |
| `MemoryArchiveHandoffStateChanged` | archive callback accepted relation state or trace handoff callback accepted intent state | memory relation branch uses `memory_reference_subjects(memory_reference_ref)`;trace-only branch uses `handoff_intent_subjects(handoff_intent_ref)` | `MemoryReferenceChanged` or `DerivedMarkerChanged` | `identity.memory.archive-handoff-state.changed.v1` | saved relation and/or `TraceHandoffIntent`, handoff state kind, receipt/issue marker, cursor |

`RoleCapabilitySourceStateChanged` intentionally reuses `IdentityChangeKind::RoleCapabilitySummaryChanged`,because Step 6 does not define a separate `RoleCapabilitySourceStateChanged` change kind. The outbox event name/topic distinguish source-state material;trace/audit change kind remains within role/capability accepted truth family.

`MemoryArchiveHandoffStateChanged` uses `MemoryReferenceChanged` when a memory relation state changed. For trace-only handoff intent callback where no memory relation is updated, it uses `DerivedMarkerChanged` with `handoff_intent_subjects(handoff_intent_ref)` and the payload fields that Step 8 marks optional. It must not invent a memory relation ref or archive package body.

### 19.5 Member / lifecycle material rules

| Accepted flow | Material rule |
|---|---|
| `EstablishGlobalMemberFlow` | Creates `GlobalMemberEstablished` and `IdentityAnchorChanged` for the initial established anchor. It does not create `GlobalLifecycleChanged` or `GlobalMemberAvailabilityChanged`;initial lifecycle is already carried by `GlobalMemberEstablishedPayload.lifecycle_state_kind`. |
| `UpdateGlobalLifecycleStateFlow` non-terminal accepted | Always creates `GlobalLifecycleChanged`;creates `GlobalMemberAvailabilityChanged` only when `old_lifecycle.is_available() != new_lifecycle.is_available()`. |
| `UpdateGlobalLifecycleStateFlow` terminal accepted | Creates `GlobalLifecycleChanged`;creates `IdentityAnchorChanged` for terminal anchor hold;creates `GlobalMemberAvailabilityChanged` only if availability changed. |

`GlobalMemberAvailabilityChanged` is therefore a conditionally co-emitted consumer-friendly material,not a replacement for lifecycle truth. It is never emitted by query,job,publish retry,or initial establish. Implementation can decide it with loaded old lifecycle and newly constructed lifecycle;no additional resolver or `AvailabilitySummaryRef` is needed.

### 19.6 Role / capability material rules

| Accepted flow | Material rule |
|---|---|
| `MaintainRoleCapabilitySummaryFlow` | Creates `RoleCapabilitySummaryChanged`;may also create `RoleCapabilitySourceStateChanged` for the saved source snapshot from the same accepted transaction. |
| `HandleRoleCapabilitySourceChangedFlow` source snapshot only | Creates `RoleCapabilitySourceStateChanged` using `role_capability_source_snapshot_subjects(snapshot_ref)`. |
| `HandleRoleCapabilitySourceChangedFlow` also changes current summary | Creates both `RoleCapabilitySourceStateChanged` and `RoleCapabilitySummaryChanged`;both carry the same accepted cursor but distinct payload marker/outbox refs. |

`RoleCapabilitySummaryChangedPayload.summary_state` comes from saved `RoleCapabilitySummary.summary_state`. `RoleCapabilitySourceStateChangedPayload.source_state` comes from saved `RoleCapabilitySourceSnapshot.source_state`. Neither payload may include role definition,capability definition,evidence body,scoring body or resolver raw response.

### 19.7 Career material rules

| Accepted flow | Material rule |
|---|---|
| `AppendCareerRecordFlow` with `AppendNew` | Creates `CareerRecordAppended` only when the saved record state is `CareerRecordStateKind::Appended`. |
| `AppendCareerRecordFlow` with `AppendCorrection` | Creates `CareerCorrectionAppended` for the new correction record. The original record may be marked `SupersededByCorrection` in the same transaction,but no separate original superseded event is created. |
| `HandleWorkParticipationAcceptedFlow` accepted append | Creates `CareerRecordAppended` using the new consumer-created career record. |
| source duplicate / no-op | Creates no career outbox material;returns stored/noop receipt or command surface as defined by the owning flow. |
| `MarkSourcePendingReview` | Does not create `CareerRecordAppended` or `CareerCorrectionAppended`;pending-review outbound material is not in Step 8 inventory. |

`CareerCorrectionAppendedPayload.original_record_ref` is the only outbound representation of the superseded original. If downstream needs a standalone `CareerRecordSuperseded` event,Step 8 must add an eleventh canonical event before Step 9 can reference it.

### 19.8 Memory / handoff material rules

| Accepted flow | Material rule |
|---|---|
| `MaintainMemoryReferenceFlow` link/refresh/archive accepted | Creates `MemoryReferenceChanged` for the saved relation. If the accepted relation state is `Archived`, `Migrated`, `HandoffPending` or `HandoffFailed`,it may also create `MemoryArchiveHandoffStateChanged`. |
| `HandleMemoryReferenceSourceStateChangedFlow` relation accepted | Creates `MemoryReferenceChanged`;if archive/handoff refs and archive/handoff state are present,may also create `MemoryArchiveHandoffStateChanged`. |
| `HandleMemoryReferenceSourceStateChangedFlow` reference-only sidecar | Creates no normal memory outbox material;reference marker trace/stale is not a canonical outbound event. |
| `HandleArchiveHandoffResultFlow` accepted relation update | Creates `MemoryArchiveHandoffStateChanged` and,when relation state changed,also `MemoryReferenceChanged`. |
| `HandleTraceHandoffResultFlow` accepted intent update | Creates `MemoryArchiveHandoffStateChanged` using `handoff_intent_subjects(handoff_intent_ref)`;memory relation fields remain optional unless a formal relation was updated. |

`MemoryArchiveHandoffStateChangedPayload.receipt_ref` is required only when the accepted state source is a delivered handoff state. Failed/retryable/cancelled branches require a safe `issue_ref` where Step 10/12 says the state requires one. No branch may use HTTP 2xx、request sent、job log success、archive package metadata or raw adapter response as a receipt.

### 19.9 Payload marker and outbox record closure

| Field / ref | Required source |
|---|---|
| `IdentityOutboxRecordRef` | `IdentityIdGeneratorPort.new_identity_outbox_record_ref()` |
| `IdentityOutboxPayloadMarkerRef` | `IdentityIdGeneratorPort.new_identity_outbox_payload_marker_ref()` / payload material builder |
| `IdentityOutboundEventRef` | payload/event material builder id source;must not equal outbox ref |
| `IdentityProtocolSchemaVersionRef` | Step 8 §16.4 event schema map |
| `TopicKeyRef` | Step 8 §16.4 topic key map |
| `IdentityOutboxSubjectRef` | `IdentityAcceptedSubjectRefs.outbox_subject_ref` from mapper |
| `IdentityTraceRecordRef` | accepted trace append result in the same transaction |
| `IdentityTruthCursor` | same accepted transaction cursor |
| `OutboxState` | `OutboxState::PendingPublish(created_at)` at creation |

Outbox material builder must store enough marker metadata for later audit to verify event name、schema version、payload marker、outbox ref、subject、trace、topic and cursor consistency. This does not authorize storing the full serialized event body in Step 9. If the implementation later needs durable marker-to-envelope reconstruction,Step 11/13 must define a formal payload snapshot store and duplicate replay/read semantics before implementation.

### 19.10 Publish input handoff to 9.5

`PublishIdentityOutboxFlow` receives only already saved pending/retryable outbox records. For each loaded record it must:

```text
load IdentityOutboxRecord with version
resolve topic binding by record.topic_key_ref + record.payload_marker_ref
call IdentityOutboxPublisherPort.publish_outbox_record(record_ref,topic_binding,payload_marker_ref)
update OutboxState based on OutboxPublishOutcome
```

It must not:

- query `GlobalMember`,`GlobalLifecycleState`,`RoleCapabilitySummary`,`CareerRecord`,`MemoryReference` or `TraceHandoffIntent` to rebuild payload;
- generate a new payload marker for an already saved outbox;
- change accepted truth,trace,audit,command effect summary or consumer receipt;
- infer downstream consumption success from `OutboxState::Published`.

### 19.11 本批 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 9.4 范围 | 通过 | 只审计 outbound accepted material,未写 publish job body |
| DTO 是否回指 Step 8 | 通过 | 十条 payload、topic key、schema version 均来自 8.5 |
| Domain 是否回指 Step 6 | 通过 | 使用 outbox record、policy、change kind、truth state和 handoff state |
| Port 是否回指 Step 7 | 通过 | id generator、subject mapper、outbox repository、topic/publisher handoff 均已定义 |
| lifecycle / availability co-emission 是否闭合 | 通过 | lifecycle 每次 accepted 发 `GlobalLifecycleChanged`;availability 只在 old/new `is_available()` 变化时同发 |
| correction event count 是否闭合 | 通过 | correction 只发 `CareerCorrectionAppended`;不新增 original superseded event |
| source snapshot outbox 是否闭合 | 通过 | `role_capability_source_snapshot_subjects(...)` 提供正式 subject |
| trace-only handoff outbox 是否闭合 | 通过 | 使用 `handoff_intent_subjects(...)` 和 optional memory fields,不伪造 relation |
| durable payload body 是否越界 | 未越界 | 本批只定义 marker;serialized snapshot store 留 Step 11/13/14 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 19.12 本批回填草稿

正式 `03-详细设计.md` 第 8 章后续可追加:

```md
### 8.x Outbound accepted material

十条 outbound event 只作为 accepted transaction 的 outbox material 生成,不各自拥有独立 publish flow。Accepted command / consumer / callback 保存 truth/state 后分配 truth cursor,通过 `IdentityTruthChangeSubjectMapper` 得到 outbox subject,构造 body-free payload marker,再保存初始 `PendingPublish` 的 `IdentityOutboxRecord`。Payload marker 必须绑定 event name、schema version、topic key、subject、trace 和 cursor;publisher 后续只能使用 saved outbox record、topic binding 和 payload marker,不得回读 current truth 重构 event。

`EstablishGlobalMemberFlow` 创建 `GlobalMemberEstablished` 和 initial `IdentityAnchorChanged`,不额外创建 initial lifecycle / availability event。`UpdateGlobalLifecycleStateFlow` 每次 accepted 创建 `GlobalLifecycleChanged`;只有 old/new `GlobalLifecycleState::is_available()` 变化时同事务创建 `GlobalMemberAvailabilityChanged`;terminal anchor hold 另创建 `IdentityAnchorChanged`。Role/career/memory/handoff material 均从各自 accepted truth/state 构造。Career correction 只创建 `CareerCorrectionAppended`,original superseded 是同事务 truth/trace side effect,不是第十一条 outbound event。
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

### 19.13 进入下一批条件

进入 9.5 前必须满足:

- 用户审核通过 9.4。
- 9.5 只写六条 operations job flow:`RebuildIdentityProjectionFlow`,`RefreshExternalReferenceStateFlow`,`RunIdentityReconciliationFlow`,`PublishIdentityOutboxFlow`,`DeliverTraceHandoffFlow`,`RetryIdentityPropagationFailuresFlow`。
- Job duplicate replay 必须使用 stored job report surface,不得重跑 job body。
- `PublishIdentityOutboxFlow` 必须只使用 saved outbox record、payload marker 和 topic binding,不得读取 current truth。
- `DeliverTraceHandoffFlow` 必须只通过 formal handoff target/delivery port 推进 handoff state,delivered 必须有 `HandoffReceiptRef`。
- 若 job item refs、stored report save/get、retry outcome classification、payload snapshot durable store 或 adapter binding 不闭合,必须暂停回 Step 7/8/11/12/13/14,不得在 job flow 中私补。

## 20. Operations job batch 9.5: operations job flows

本批覆盖六条 operations job flow:

- `RebuildIdentityProjectionFlow`
- `RefreshExternalReferenceStateFlow`
- `RunIdentityReconciliationFlow`
- `PublishIdentityOutboxFlow`
- `DeliverTraceHandoffFlow`
- `RetryIdentityPropagationFailuresFlow`

本批承接 Step 8 `8.6 operations job protocols`,并使用 Step 6 `IdentityJobRunReport`、`ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport`、`OutboxState`、`HandoffState` 与 Step 7 repository / resolver / publisher / handoff / idempotency / stored result / issue mapper surface。本批只写 application job service 的函数级处理流;jobs entry / scheduler / retry schedule / adapter config / timeout / durable DDL / exact error priority 留 Step 10~16。

### 20.1 9.5 batch input / closure

| 输入 | 本批用法 | 禁止事项 |
|---|---|---|
| `IdentityJobRequest<T>` | job name、run ref、scope marker、cursor、metadata、system actor、idempotency key、typed input | job runner 直连 repository 或 adapter |
| `IdentityJobReportSurface` / `IdentityJobRunReport` | first run 保存 item refs、counts、issue refs;duplicate replay 只读 stored report | duplicate 时重扫 pending/stale/retryable store |
| `IdentityStoredResultRepository.save_job_report_result(...)` | 保存 `StoredIdentityOperationResult(JobReport)` shell | 只保存 report 不保存 stored result |
| `IdentityJobReportRepository.save_job_report(...)` | 保存完整 replayable report item refs | report 保存 raw job log、adapter response 或 body |
| `IdentityMaintenanceIssueMapper` | projection/reference marker 或 publish/handoff native issue marker -> job report `MaintenanceIssueRef` | service 从 raw adapter error、projection/ref string、topic/target string 推 issue kind |
| `IdentityProjectionRepository.get_projection_source_cursor(...)` | rebuild 成功前取得正式 `IdentityProjectionCursorRef` | 用 page cursor、timestamp、version、truth cursor 或 job cursor 代替 |

Handoff delivery 的 retryable/permanent failure outcome 必须带 `HandoffAttemptRef`,因为 `HandoffState::retryable_failed(...)` 和 `HandoffState::failed(...)` 均要求 attempt marker。没有发起 attempt 的 adapter/policy outcome 只能进入 `CancelledByPolicy` / `UnsupportedTarget`,并映射为 `HandoffState::cancelled(...)` + report issue,不得写 `Failed` 状态。

### 20.2 Shared operations job flow skeleton

所有 job flow 共享以下 application service 骨架:

```text
[jobs entry / scheduler]
  | parse IdentityJobRequest<T>
  | dispatch_job(...)
  v
[Application job service]
  | create IdentityOperationContext::from_job(...)
  | build IdentityRequestDigest from canonical job request marker
  | begin IdentityUnitOfWork
  | reserve idempotency with operation context + request digest
  | if ReplayAvailable:
  |   load StoredIdentityOperationResult(JobReport)
  |   load IdentityJobRunReport by stored report/run ref
  |   return IdentityJobResponse<T> from stored report;do not run body
  | if Conflict/InFlight:
  |   return Step 12/13 conflict or in-flight surface;do not run body
  v
[Job body]
  | start IdentityJobRunReport with job_run_ref/job_name/scope/cursor/started_at
  | expand input scope through formal repository/list port
  | process item page in deterministic repository order
  | collect output refs, failed refs, issue_refs, counts
  | choose IdentityJobResultKind: Succeeded / Partial / Failed / Noop / RetryableFailed
  v
[Report + stored replay]
  | save IdentityJobRunReport with all replayable item refs
  | save StoredIdentityOperationResult(JobReport)
  | update report.stored_result_ref with saved stored_result_ref if report assembly requires it
  | complete idempotency with stored_result_ref
  | commit UoW
  | return IdentityJobResponse<T> using saved report surface + typed output
```

| Shared rule | 正式口径 |
|---|---|
| transaction boundary | first-run mutation path opens one UoW;query-like list expansion without mutation still participates in stored report transaction |
| duplicate replay | same key / same digest only replays stored `IdentityJobRunReport`;stored result/report missing is a degraded/replay error per Step 12/13,never rerun |
| report issue invariant | `Partial` / `Failed` / `RetryableFailed` must carry non-empty `MaintenanceIssueRef` |
| no truth repair | jobs may write projection/reference/report/outbox/handoff state and job report;must not mutate `GlobalMember`, lifecycle, role, career or memory truth |
| item refs | output refs must come from request explicit refs, repository list/load/update result, resolver/publisher/handoff outcome or report writer |
| body boundary | report/output stores refs, counts and safe issue markers only;no external body, payload body, receipt body, raw log or adapter response |

### 20.3 `RebuildIdentityProjectionFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityJobRequest<RebuildIdentityProjectionJobInput>` |
| 输出 | `IdentityJobResponse<RebuildIdentityProjectionJobOutput>` |
| object/state | `ProjectionState`, optional `MemberSummaryView`, `ReconciliationPolicy`, `IdentityJobRunReport` |
| ports | `IdentityProjectionRepository`, `IdentityMaintenanceRepository`, id/clock/UoW/idempotency/stored result/job report |

```text
[RebuildIdentityProjectionFlow]
  | validate job envelope, page, maintenance_scope_ref, rebuild_scope
  | shared job reserve / duplicate replay
  | start report
  | resolve projection targets:
  |   ExplicitProjectionRefs -> exact refs from input
  |   StaleInMaintenanceScope -> list_stale_projection_states(...) or list_projection_targets_for_rebuild(...)
  | for each projection_ref in page order:
  |   load ProjectionState with version
  |   if state missing:
  |      issue_ref = maintenance_issue_mapper.projection_missing_state_issue(projection_ref)
  |      failed_projection_refs += projection_ref
  |      issue_refs += issue_ref
  |      continue
  |   build ReconciliationPolicy::for_projection_rebuild(maintenance_scope_ref, projection_ref, actor_ref)
  |   assert_not_truth_write(...)
  |   assert_not_cross_repo_repair(...)
  |   mark_rebuild_pending(...)
  |   save_projection_state(... expected_version)
  |   if projection kind has a formal writer:
  |      rebuild body-free projection material
  |      for each formal member summary visibility scope selected by the projection target:
  |         build MemberSummaryView { member_ref, visibility_scope_ref, ... }
  |         save_member_summary_view(...) for MemberSummaryView only
  |   else:
  |      issue_ref = maintenance_issue_mapper.projection_unsupported_writer_issue(projection_ref)
  |      mark_rebuild_failed(issue_ref,...)
  |      save_projection_state(... loaded/reloaded version)
  |      failed_projection_refs += projection_ref
  |      issue_refs += issue_ref
  |      continue
  |   source_cursor_ref = get_projection_source_cursor(projection_ref)
  |   if source cursor missing:
  |      issue_ref = maintenance_issue_mapper.projection_missing_cursor_issue(projection_ref)
  |      mark_rebuild_failed(issue_ref,...)
  |      save_projection_state(...)
  |      failed_projection_refs += projection_ref
  |      issue_refs += issue_ref
  |      continue
  |   mark_rebuilt(source_cursor_ref, now)
  |   save_projection_state(... expected_version)
  |   rebuilt_projection_refs += projection_ref
  | finish report/output/stored result/idempotency/commit
```

| Branch | Required behavior |
|---|---|
| no target | `Noop` report;no projection write;stored report still saved for replay |
| unsupported projection writer | failed item + `MaintenanceIssueRef`;do not invent `save_*_view` port |
| source cursor missing | failed item;do not substitute page cursor/job cursor/timestamp/version |
| partial rebuild | `Partial` with rebuilt + failed refs and non-empty issue refs |
| all failed retryable dependency | `RetryableFailed` only when issue kind indicates unavailable/retryable per Step 12;otherwise `Failed` / `Partial` |

当前 Step 7 only exposes `save_member_summary_view(...)` as projection body writer. Therefore this flow may rebuild `MemberSummaryView` only through that writer. Other projection kinds require a formal writer/catalog closure before implementation may persist their view body;until then they can be reported as failed/unsupported maintenance items,not silently marked rebuilt.

### 20.4 `RefreshExternalReferenceStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityJobRequest<RefreshExternalReferenceStateJobInput>` |
| 输出 | `IdentityJobResponse<RefreshExternalReferenceStateJobOutput>` |
| object/state | `ReferenceResolutionState`, `ExternalReferenceTypedSidecarRefs`, `ReconciliationPolicy`, `IdentityJobRunReport` |
| ports | `IdentityReferenceStateRepository`, `IdentityMaintenanceRepository`, `IdentityExternalReferenceResolverPort`, id/clock/UoW/idempotency/stored result/job report |

```text
[RefreshExternalReferenceStateFlow]
  | validate job envelope, page, maintenance_scope_ref, refresh_scope
  | shared job reserve / duplicate replay
  | start report
  | resolve reference targets:
  |   ExplicitReferenceRefs -> exact input refs
  |   StaleInMaintenanceScope -> list_stale_reference_states(...) or list_reference_targets_for_refresh(...)
  |   ByOwner -> list_reference_states_by_owner(...)
  |   ByKind -> list_reference_states_by_kind(...)
  | for each external_reference_ref in page order:
  |   load ReferenceResolutionState with version
  |   if missing:
  |      issue_ref = maintenance_issue_mapper.reference_missing_state_issue(external_reference_ref)
  |      failed_reference_refs += external_reference_ref
  |      issue_refs += issue_ref
  |      continue
  |   build ReconciliationPolicy::for_reference_refresh(maintenance_scope_ref, external_reference_ref, actor_ref)
  |   assert_body_free(...)
  |   assert_not_cross_repo_repair(...)
  |   call resolve_external_reference(external_reference_ref, loaded.reference_owner_ref)
  |   if resolver returns resolved/stale/unavailable/unrecognized state:
  |      save_reference_state(returned_state, loaded.version, uow)
  |      if returned state has typed sidecar refs:
  |         save_typed_sidecar_refs(external_reference_ref, sidecar_refs, loaded.version, uow)
  |      if state is usable/resolved:
  |         refreshed_reference_refs += external_reference_ref
  |      else:
  |         failed_reference_refs += external_reference_ref
  |         issue_refs += returned_state.issue_ref
  |   if resolver returns ApplicationError without safe issue marker:
  |      issue_ref = maintenance_issue_mapper.reference_refresh_failed_issue(external_reference_ref)
  |      mark_refresh_failed(issue_ref, now)
  |      save_reference_state(... loaded.version)
  |      failed_reference_refs += external_reference_ref
  |      issue_refs += issue_ref
  |   if resolver returns classified failure with safe issue marker:
  |      mark_refresh_failed(issue_ref, now)
  |      save_reference_state(... loaded.version)
  |      failed_reference_refs += external_reference_ref
  |      issue_refs += issue_ref
  | finish report/output/stored result/idempotency/commit
```

| Rule | Required behavior |
|---|---|
| version source | `save_reference_state` and `save_typed_sidecar_refs` use the loaded bundle `IdentityVersion`;never use source version |
| owner source | resolver owner is `loaded.reference_owner_ref`;do not infer owner from external ref string |
| sidecar scope | sidecar refs attach to the same `ExternalReferenceRef` bundle;no cross-bundle version reuse |
| unavailable/unrecognized | visible failed item with issue ref;do not create default safe summary |
| resolver ApplicationError | mapped through `reference_refresh_failed_issue(...)`;raw error body is not stored or parsed |
| external body | resolver may return safe refs/state only;external truth body never enters report or state |

### 20.5 `RunIdentityReconciliationFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityJobRequest<RunIdentityReconciliationJobInput>` |
| 输出 | `IdentityJobResponse<RunIdentityReconciliationJobOutput>` |
| object/state | `ReconciliationPolicy`, `ReconciliationReport`, `ReconciliationFindingMaterial`, `IdentityJobRunReport` |
| ports | `IdentityMaintenanceRepository`, `IdentityReconciliationReportRepository`, id/clock/UoW/idempotency/stored result/job report |

```text
[RunIdentityReconciliationFlow]
  | validate job envelope, page, maintenance_scope_ref, target_scope, finding intent/material
  | shared job reserve / duplicate replay
  | start report
  | resolve targets:
  |   ExplicitTargets -> exact input target refs
  |   ByMaintenanceScope -> expand_maintenance_targets(...) or list_report_targets(...)
  | build ReconciliationPolicy::for_reconciliation(maintenance_scope_ref, finding_intent_ref, actor_ref)
  | assert_body_free(finding_material)
  | for each target_ref in page order:
  |   assert_report_only(maintenance_scope_ref, target_ref)
  |   assert_not_truth_write(...)
  |   assert_not_cross_repo_repair(...)
  |   collect inspected_target_refs
  |   derive finding refs / issue refs only from formal body-free material and loaded maintenance state
  | if no targets:
  |   create no-op/no_finding report with empty target refs
  | else if findings/issues present:
  |   ReconciliationReport::generated(... target_refs,finding_refs,issue_refs,...)
  | else:
  |   ReconciliationReport::no_finding(...)
  | save_report(report, None, uow)
  | report_refs += saved report_ref
  | finish job report/output/stored result/idempotency/commit
```

| Branch | Required behavior |
|---|---|
| forbidden finding material | rejected/failed job surface per Step 12;do not save raw material |
| partial expansion | `Partial` report with issue refs;do not hide missing targets |
| finding detected | save report-only finding refs;do not emit repair command |
| no finding | `Noop` or `Succeeded` with no-finding report per Step 10 result matrix |

Reconciliation output never writes core truth,external truth,projection body,outbox,handoff state or remediation command. Any future auto-repair capability must be a separate formal command/flow owned by the truth owner.

### 20.6 `PublishIdentityOutboxFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityJobRequest<PublishIdentityOutboxJobInput>` |
| 输出 | `IdentityJobResponse<PublishIdentityOutboxJobOutput>` |
| object/state | `IdentityOutboxRecord`, `OutboxState`, `OutboundEventPolicy`, `IdentityJobRunReport` |
| ports | `IdentityOutboxRepository`, `IdentityTopicBindingPort`, `IdentityOutboxPublisherPort`, `IdentityMaintenanceIssueMapper`, id/clock/UoW/idempotency/stored result/job report |

```text
[PublishIdentityOutboxFlow]
  | validate job envelope, optional topic_key_ref, page
  | shared job reserve / duplicate replay
  | start report
  | list pending records through list_pending_outbox_records(topic_key_ref,page)
  | for each outbox_ref in page order:
  |   load IdentityOutboxRecord with version
  |   scanned_outbox_refs += outbox_ref
  |   build OutboundEventPolicy::for_outbox(...)
  |   assert_from_accepted_change(...)
  |   assert_payload_body_free(...)
  |   assert_visible_for_topic(...)
  |   resolve_topic_binding(record.topic_key_ref, record.payload_marker_ref)
  |   publish_outbox_record(record_ref,binding,record.payload_marker_ref)
  |   match outcome:
  |     Published { attempt_ref }:
  |       state = OutboxState::published(attempt_ref, now)
  |       record.mark_published(state)
  |       update_outbox_state(record_ref,state,loaded.version,uow)
  |       published_outbox_refs += outbox_ref
  |     RetryableFailed { issue_ref, .. }:
  |       state = OutboxState::retryable_failed(issue_ref, now)
  |       record.mark_retryable_failed(state)
  |       update_outbox_state(...)
  |       failed_outbox_refs += outbox_ref
  |       issue_refs += maintenance_issue_mapper.outbox_retryable_issue(issue_ref)
  |     PermanentlyFailed { issue_ref, .. }:
  |       state = OutboxState::failed(issue_ref, now)
  |       record.mark_failed(state)
  |       update_outbox_state(...)
  |       failed_outbox_refs += outbox_ref
  |       issue_refs += maintenance_issue_mapper.outbox_permanent_issue(issue_ref)
  |     SkippedByPolicy { issue_ref }:
  |       state = OutboxState::skipped_by_policy(issue_ref, now)
  |       record.mark_skipped_by_policy(state)
  |       update_outbox_state(...)
  |       failed_outbox_refs += outbox_ref
  |       issue_refs += maintenance_issue_mapper.outbox_skipped_issue(issue_ref)
  |     UnsupportedTopic { issue_ref }:
  |       state = OutboxState::failed(issue_ref, now)
  |       record.mark_failed(state)
  |       update_outbox_state(...)
  |       failed_outbox_refs += outbox_ref
  |       issue_refs += maintenance_issue_mapper.outbox_unsupported_topic_issue(issue_ref)
  | finish report/output/stored result/idempotency/commit
```

| Rule | Required behavior |
|---|---|
| source material | publisher uses saved outbox record + payload marker + topic binding only |
| accepted truth | publish success/failure never rolls back accepted command/consumer/callback truth |
| downstream semantics | `Published` means outbound boundary accepted/published;not downstream business consumed |
| failure issue | state stores `OutboxDeliveryIssueRef`;job report stores mapper-produced `MaintenanceIssueRef` |
| raw adapter error | not stored,not parsed by service for issue kind |

### 20.7 `DeliverTraceHandoffFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityJobRequest<DeliverTraceHandoffJobInput>` |
| 输出 | `IdentityJobResponse<DeliverTraceHandoffJobOutput>` |
| object/state | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy`, `IdentityJobRunReport` |
| ports | `TraceHandoffIntentRepository`, `IdentityHandoffTargetPort`, `IdentityHandoffDeliveryPort`, `IdentityMaintenanceIssueMapper`, id/clock/UoW/idempotency/stored result/job report |

```text
[DeliverTraceHandoffFlow]
  | validate job envelope, delivery_scope, page
  | shared job reserve / duplicate replay
  | start report
  | resolve intent targets:
  |   ExplicitIntentRefs -> exact refs from input
  |   ByTarget(target_ref) -> list_handoff_intents_by_target(target_ref,page)
  | for each intent_ref in page order:
  |   load TraceHandoffIntent with version
  |   scanned_handoff_intent_refs += intent_ref
  |   build HandoffPolicy::for_handoff(...)
  |   assert_target_allowed(...)
  |   assert_trace_refs_present(...)
  |   assert_safe_material_body_free(...)
  |   resolve_handoff_target(intent.target_ref,intent.scope_ref,intent.safe_material_ref)
  |   deliver_handoff(intent_ref,target_resolution,intent.safe_material_ref)
  |   match outcome:
  |     Delivered { attempt_ref, receipt_ref }:
  |       state = HandoffState::delivered(attempt_ref, receipt_ref, now)
  |       intent.mark_delivered(state)
  |       save_handoff_intent(intent, loaded.version, uow)
  |       delivered_handoff_intent_refs += intent_ref
  |       receipt_refs += receipt_ref
  |     RetryableFailed { attempt_ref, issue_ref }:
  |       state = HandoffState::retryable_failed(attempt_ref, issue_ref, now)
  |       intent.mark_retryable_failed(state)
  |       save_handoff_intent(...)
  |       failed_handoff_intent_refs += intent_ref
  |       issue_refs += maintenance_issue_mapper.handoff_retryable_issue(issue_ref)
  |     PermanentlyFailed { attempt_ref, issue_ref }:
  |       state = HandoffState::failed(attempt_ref, issue_ref, now)
  |       intent.mark_failed(state)
  |       save_handoff_intent(...)
  |       failed_handoff_intent_refs += intent_ref
  |       issue_refs += maintenance_issue_mapper.handoff_permanent_issue(issue_ref)
  |     CancelledByPolicy { issue_ref }:
  |       state = HandoffState::cancelled(issue_ref, now)
  |       intent.mark_cancelled(state)
  |       save_handoff_intent(...)
  |       failed_handoff_intent_refs += intent_ref
  |       issue_refs += maintenance_issue_mapper.handoff_cancelled_issue(issue_ref)
  |     UnsupportedTarget { issue_ref }:
  |       state = HandoffState::cancelled(issue_ref, now)
  |       intent.mark_cancelled(state)
  |       save_handoff_intent(...)
  |       failed_handoff_intent_refs += intent_ref
  |       issue_refs += maintenance_issue_mapper.handoff_unsupported_target_issue(issue_ref)
  | finish report/output/stored result/idempotency/commit
```

| Rule | Required behavior |
|---|---|
| delivered guard | delivered requires both `HandoffAttemptRef` and `HandoffReceiptRef`;HTTP 2xx/request sent/job success log is insufficient |
| failure attempt | retryable/permanent failed outcomes carry attempt ref;without attempt the outcome must be cancel/unsupported |
| no body | intent/report store safe material,attempt,receipt,issue refs only;no archive package,receipt body,target path or adapter response |
| failure issue | state stores `HandoffIssueRef`;job report stores mapper-produced `MaintenanceIssueRef` |
| no truth repair | handoff success/failure does not mutate member/memory truth;callbacks own memory relation updates |

### 20.8 `RetryIdentityPropagationFailuresFlow`

| 项 | 内容 |
|---|---|
| 协议 | `IdentityJobRequest<RetryIdentityPropagationFailuresJobInput>` |
| 输出 | `IdentityJobResponse<RetryIdentityPropagationFailuresJobOutput>` |
| object/state | `IdentityOutboxRecord` / `OutboxState` or `TraceHandoffIntent` / `HandoffState`, `IdentityJobRunReport` |
| ports | outbox repo, handoff intent repo, topic binding/publisher, handoff target/delivery, maintenance issue mapper, stored result/job report |

```text
[RetryIdentityPropagationFailuresFlow]
  | validate job envelope, retry_scope, page
  | shared job reserve / duplicate replay
  | start report
  | if retry_scope is OutboxRetryable:
  |   list_retryable_outbox_records(topic_key_ref,page)
  |   for each loaded retryable outbox record:
  |     retried_outbox_refs += record_ref
  |     run the same per-item guard/outcome mapping as PublishIdentityOutboxFlow
  |     record published_outbox_refs / failed_outbox_refs / issue_refs
  | if retry_scope is HandoffRetryable:
  |   list_retryable_handoff_intents(target_ref,page)
  |   for each loaded retryable handoff intent:
  |     retried_handoff_intent_refs += intent_ref
  |     run the same per-item guard/outcome mapping as DeliverTraceHandoffFlow
  |     record delivered_handoff_intent_refs / failed_handoff_intent_refs / receipt_refs / issue_refs
  | finish report/output/stored result/idempotency/commit
```

| Rule | Required behavior |
|---|---|
| single family | one job run processes only `OutboxRetryable` or `HandoffRetryable`;combined scheduling留 Step 14 |
| retryable only | do not retry `Failed`, `SkippedByPolicy`, `Cancelled`, `Delivered`, `Published` or not-visible items |
| no backoff in DTO | retry schedule/max attempts/timeouts are config/ops concerns for Step 14 |
| same mapping | retry uses identical outcome/state/issue mapper rules as fresh publish/deliver |
| duplicate replay | retry duplicate replays stored report;does not re-list retryable records |

### 20.9 Job report / output mapping

| Job | Output item refs | Report fields |
|---|---|---|
| `RebuildIdentityProjection` | `rebuilt_projection_refs`, `failed_projection_refs`, `report_refs`, `issue_refs` | `affected_projection_refs`, `rebuilt_projection_refs`, `failed_projection_refs`, `report_refs`, `issue_refs`, counts |
| `RefreshExternalReferenceState` | `refreshed_reference_refs`, `failed_reference_refs`, `issue_refs` | `refreshed_reference_refs`, `failed_reference_refs`, `issue_refs`, counts |
| `RunIdentityReconciliation` | `report_refs`, `inspected_target_refs`, `issue_refs` | `inspected_target_refs`, `report_refs`, `issue_refs`, counts |
| `PublishIdentityOutbox` | `scanned_outbox_refs`, `published_outbox_refs`, `failed_outbox_refs`, `issue_refs` | `outbox_record_refs`, `published_outbox_refs`, `failed_outbox_refs`, `issue_refs`, counts |
| `DeliverTraceHandoff` | `scanned_handoff_intent_refs`, `delivered_handoff_intent_refs`, `failed_handoff_intent_refs`, `receipt_refs`, `issue_refs` | `handoff_intent_refs`, `delivered_handoff_refs`, `failed_handoff_refs`, `handoff_receipt_refs`, `issue_refs`, counts |
| `RetryIdentityPropagationFailures` | retried/published/failed outbox refs;retried/delivered/failed handoff refs;receipt refs;issue refs | outbox + handoff report fields;same issue refs;counts |

Result kind is derived from processed item outcomes:

| Condition | `IdentityJobResultKind` |
|---|---|
| no eligible items, no failure | `Noop` |
| all processed eligible items succeeded | `Succeeded` |
| some succeeded and some failed/skipped/unrecognized | `Partial` |
| no item succeeded and failure is retryable/unavailable by formal issue kind | `RetryableFailed` |
| no item succeeded and failure is permanent/forbidden/unrecognized | `Failed` |

Step 10/12 may refine public disposition priority, but it must preserve the invariant that partial/failed/retryable reports include safe `MaintenanceIssueRef` and replay item refs.

### 20.10 Stop review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 6 个 operations job | 通过 | 未新增 command/query/consumer/event |
| shared job replay 是否闭合 | 通过 | reserve -> stored result/report replay -> no rerun |
| job report item refs 是否闭合 | 通过 | Step 6/8 report surface 已覆盖 projection/reference/report/outbox/handoff/receipt refs |
| projection cursor 是否闭合 | 通过 | `get_projection_source_cursor(...)`;不得混用 page/job/time/version |
| maintenance issue 是否闭合 | 通过 | `IdentityMaintenanceIssueMapper` 负责 projection/reference marker and native propagation issue -> `MaintenanceIssueRef` |
| handoff attempt 是否闭合 | 通过 | retryable/permanent failed delivery outcome 必带 `HandoffAttemptRef`;cancel/unsupported 不写 failed state |
| no truth repair 是否保持 | 通过 | jobs 只写 projection/reference/report/outbox/handoff/report surface |
| raw body 边界是否保持 | 通过 | report/output/state 只保存 refs/counts/issues |
| runner only facade 是否保持 | 通过 | entry/scheduler 只 dispatch application job service |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | `9.6` | 用户审核通过后进入 cross-flow audit |

### 20.11 回填草稿

正式 `03-详细设计.md` 第 8 章后续可从本批回填为:

```text
Operations job 统一从 `IdentityJobRequest<T>` 进入 application facade,由 application job service 创建 operation context、计算 request digest、开启 UoW、reserve idempotency。same key / same digest duplicate 必须读取 `StoredIdentityOperationResult(JobReport)` 和 `IdentityJobRunReport` replay,不得重跑 rebuild、refresh、reconciliation、publish、handoff 或 retry body。first run 完成后必须保存 replayable job report item refs、保存 stored job result、complete idempotency 并提交事务。

`RebuildIdentityProjectionFlow` 通过 explicit projection refs 或 maintenance scope expansion 选择 projection target,加载 `ProjectionState` 与 version,经 `ReconciliationPolicy::for_projection_rebuild(...)` 断言 no truth repair 后标记 rebuild pending,使用正式 projection writer 更新已有 body-free projection material,再通过 `get_projection_source_cursor(...)` 取得 projection source cursor 并 `mark_rebuilt(...)`。缺 writer、缺 source cursor 或 rebuild failure 只能进入 failed item/report issue,不得私造 view writer、用 timestamp/page cursor/version 代替 cursor,也不得修改 core truth。

`RefreshExternalReferenceStateFlow` 通过 explicit refs、stale-in-scope、owner 或 kind 选择 `ExternalReferenceRef` bundle,先加载 `ReferenceResolutionState` 与 version,再调用 `IdentityExternalReferenceResolverPort.resolve_external_reference(reference_ref, owner_ref)`。保存 returned state 和 typed sidecar refs 时必须使用同一 bundle 的 loaded version,不得把 source version 或 business source ref 当 expected_version / bundle key。Unavailable、unrecognized、refresh failed 必须显式进入 failed refs 与 safe issue marker。

`RunIdentityReconciliationFlow` 只生成 report-only material。flow 通过 explicit target 或 maintenance expansion 获取 target refs,使用 `ReconciliationPolicy::for_reconciliation(...)`、`assert_report_only(...)`、`assert_not_truth_write(...)` 和 `assert_not_cross_repo_repair(...)` 保证 finding 不变成 repair action,最后保存 `ReconciliationReport::generated(...)` 或 `no_finding(...)` / `failed(...)`。

`PublishIdentityOutboxFlow` 只读取 saved pending outbox record、topic binding 和 payload marker,不得读取 current truth 重构 event。Publisher outcome 更新 `OutboxState`:Published 带 attempt marker;retryable/permanent/skipped/unsupported failure 保存 `OutboxDeliveryIssueRef`,并通过 `IdentityMaintenanceIssueMapper` 写入 job report `MaintenanceIssueRef`。Publish success/failure 均不回滚 accepted truth;Published 不等于 downstream consumed。

`DeliverTraceHandoffFlow` 读取 pending/target-scoped handoff intent,通过 handoff target resolver 和 delivery port 交付 safe material marker。Delivered 必须带 `HandoffAttemptRef` 和 `HandoffReceiptRef`;retryable/permanent failed 必须带 `HandoffAttemptRef` 和 `HandoffIssueRef`;cancelled/unsupported target 使用 `HandoffState::cancelled(...)`。Handoff state 保存 native issue/receipt marker,job report 使用 mapper-produced `MaintenanceIssueRef`,不保存 receipt body、target path、archive package 或 adapter response。

`RetryIdentityPropagationFailuresFlow` 单次只处理 outbox retryable 或 handoff retryable 一种 family,并复用 publish/deliver 的 guard、state transition 和 issue mapper。Retry 不定义 schedule/backoff/max-attempts,不重试 terminal failed/skipped/cancelled/published/delivered item,duplicate replay 不重新 list retryable store。
```

### 20.12 进入 9.6 条件

进入 9.6 前必须满足:

- 用户审核通过 9.5 六条 operations job flow。
- Step 6/7/8 中已闭合的 issue mapper、projection source cursor、handoff attempt outcome 口径保持一致。
- 不存在本批新增的 unresolved schema / port / state blocker。
- 9.6 只做 cross-flow audit,不提前写 Step 10 状态矩阵。

## 21. Cross-flow audit batch 9.6

本批对 Step 9 已写入的 command、query、consumer/callback、outbound material 和 operations job flow 做跨流审计。审计目标不是新增业务 flow,而是确认每条 flow 的 transaction、idempotency、stored replay、visibility、projection/reference、outbox/handoff、body-free boundary 和 phase handoff 都能回指 Step 6/7/8,并把仍应由 Step 10~16 承接的内容列明。

本批不写 Step 10 状态矩阵,不定义 DDL,不新增 public DTO,不新增 repository/adapter port,不定义 HTTP status 或 retry schedule。若审计发现无法回指 Step 6/7/8 的 schema/port/state 缺口,应暂停并回写真相源。本轮审计未发现新的 blocking 缺口。

### 21.1 Audit input / scope

| 范围 | 已审计批次 | 审计焦点 | 结论 |
|---|---|---|---|
| Command write path | 9.1-a,9.1-b,9.1-c | accepted transaction、expected_version、accepted cursor、trace/audit/outbox/stale、stored result | 通过 |
| Query read path | 9.2-a,9.2-b,9.2-c | visibility precheck、stable lookup、not visible / missing / empty / degraded priority、no-write | 通过 |
| Consumer/callback write path | 9.3 | envelope validation、typed receipt replay、reference bundle version、marker trace、callback delivered guard | 通过 |
| Outbound material | 9.4 | accepted-only material、payload marker、topic boundary、publisher input | 通过 |
| Operations job | 9.5 | stored job report replay、item refs、projection/reference maintenance、publish/deliver/retry boundaries | 通过 |
| Later-step boundary | 9.1~9.5 | Step 10~16 ownership of state matrix、persistence、error、idempotency、config、observability、tests | 通过,有明确 handoff |

### 21.2 Transaction / write-path audit

| Write path | Required order | Audit result |
|---|---|---|
| command accepted | `begin UoW -> reserve idempotency -> load versioned truth/reference -> domain policy/factory/member method -> save truth -> assign truth cursor -> trace/audit/outbox/projection stale -> effect/stored result -> complete idempotency -> commit` | 9.1-a~9.1-c 均按此顺序写入;no accepted side effect may happen outside UoW |
| consumer accepted | `begin UoW -> reserve idempotency -> validate envelope/payload marker -> load versioned target/reference -> save truth/reference/sidecar -> assign truth or reference marker cursor -> trace/outbox/stale -> receipt envelope -> complete -> commit` | 9.3 已区分 accepted mutation、marker-only branch、source duplicate `Noop` 和 delayed/quarantined receipt |
| callback accepted | `begin UoW -> reserve callback idempotency -> load handoff/memory target -> formal receipt/issue marker guard -> update state -> trace/outbox/stale -> callback receipt envelope -> complete -> commit` | `Delivered` 必须有 formal receipt marker;failure/cancel branches must carry safe issue marker where required |
| job mutation path | `begin UoW -> reserve job idempotency -> load selected items -> execute maintenance/publish/deliver action -> save state/report item refs -> stored job report -> complete -> commit` | 9.5 六条 job flow 均要求 stored `IdentityJobRunReport` with item refs before duplicate replay |
| query path | no write UoW, no idempotency, no stored result, no trace/audit/outbox/projection/reference mutation | 9.2-a~9.2-c 均保持 read-only;missing/stale only maps to query surface |

### 21.3 Idempotency / stored replay audit

| Family | Replay source | Forbidden replay behavior | Audit result |
|---|---|---|---|
| command | `StoredIdentityOperationResult` command accepted/rejected surface + command effect refs | reload truth,rerun resolver,append second trace/outbox,mark stale again | 通过 |
| consumer | typed `IdentityConsumerReceiptEnvelope` plus stored result shell | parse payload again,reapply mutation,recreate reference sidecar or outbox | 通过 |
| callback | typed handoff callback receipt envelope plus stored result shell | redeliver handoff,re-mark delivered,create second callback effect | 通过 |
| outbound material | owning command/consumer/callback stored surface contains original outbox refs | rebuild payload marker or create new outbox record on duplicate | 通过 |
| operations job | stored `IdentityJobRunReport` with item refs and stored job result shell | rerun job body,relist pending/stale/retryable items,recompute report refs | 通过 |

Step 13 still owns durable idempotency locking, digest conflict status, stored serialization format and missing/wrong-kind replay error mapping. Step 9 only fixes the function-level rule that duplicate replay never re-executes mutation or repository scans.

### 21.4 Visibility / query audit

| Query group | Formal visibility seed | Stable read source | No-write guard |
|---|---|---|---|
| core truth | `IdentityReadVisibilityRepository` member / role / career / memory read resolvers | member/lifecycle/role/career/memory repository plus member summary lookup where defined | no projection rebuild, no reference refresh |
| summary / trace / audit | summary/trace/audit visibility resolver and canonical audit subject mapper | projection repo stable `MemberSummaryViewRef`,trace/audit repositories | no trace/audit repair |
| operations queries | projection/reference/report/outbox/handoff matching visibility resolver | request ref,repository lookup,loaded object,formal selector | no rebuild,refresh,report generation,publish,deliver,retry |

Cross-flow priority is stable:visibility unavailable -> `Degraded`;not visible -> `NotVisible` without leaking existence;exact requested object missing -> `Missing`;visible list empty -> `Empty`;loaded item missing/mismatch -> degraded partial;all loaded list items denied -> `NotVisible`;mixed visible/denied -> redacted partial. Field-level redaction and HTTP mapping remain Step 12/16.

### 21.5 Trace / audit / outbox / projection audit

| Side effect | Formal source | Audit result |
|---|---|---|
| accepted trace | accepted truth or formal marker subject mapper | command/consumer/callback accepted branches use mapper output;no subject string construction |
| audit trail | accepted subject audit ref from mapper | audit update is tied to accepted truth/marker,not query/job report generation |
| outbox material | accepted command/consumer/callback transaction and payload marker | 9.4 confirms ten canonical outbound materials are accepted-only;no material from query/job retry alone |
| projection stale | `IdentityProjectionRepository.expand_affected_projection_refs(subjects)` or formal maintenance selection | command/consumer/callback accepted paths mark stale through repository;query does not mark stale |
| projection rebuild | job-selected projection refs + projection repository writer + `get_projection_source_cursor(...)` | rebuild never repairs core truth and never uses timestamp/page/version as cursor |
| reference refresh | explicit/stale/owner/kind selected `ExternalReferenceRef` bundle | save state/sidecar with same bundle version;business source ref is not expected_version |

Step 11 still owns durable atomicity、cursor persistence、indexes and version columns. Step 16 must add targeted fake parity tests for no ad hoc subject/view/ref construction.

### 21.6 Outbox / handoff propagation audit

| Boundary | Step 9 invariant | Audit result |
|---|---|---|
| accepted fact -> outbox | accepted transaction creates `IdentityOutboxRecord` with body-free payload marker | 9.4 closed;publisher does not read current truth |
| outbox publish | `Published` means outbound boundary accepted/published only | 9.5 closed;does not mean downstream consumed |
| handoff prepare | command creates pending intent only | 9.1-c closed;target resolution does not deliver |
| handoff callback/job | `Delivered` requires formal `HandoffReceiptRef` and `HandoffAttemptRef` | 9.3/9.5 closed;HTTP 2xx/job log success cannot mark delivered |
| retry | retryable outbox/handoff only;terminal states are not retried | 9.5 closed;schedule/backoff/max attempts remain Step 14/12 |
| failure reporting | native issue refs are mapped to `MaintenanceIssueRef` for reports | 9.5 closed through `IdentityMaintenanceIssueMapper` |

### 21.7 Body-free / external truth boundary audit

| Surface | Allowed material | Forbidden material | Audit result |
|---|---|---|---|
| command request/result | refs,markers,state kinds,reasons,effect refs | governance/work/memory/archive/raw external body | 通过 |
| query view/page | body-free projections,refs,state markers,safe issue refs | raw diagnostics,secrets,target paths,payload bodies,receipt bodies | 通过 |
| inbound payload/receipt | envelope metadata,safe source/version/receipt/issue markers | external truth body,raw adapter response,archive package | 通过 |
| outbox payload marker | event name,schema version,topic key,subject,trace,cursor,safe refs | full serialized event body unless Step 11/13 defines store | 通过 |
| job report | item refs,counts,issue refs,result kind | raw resolver/publisher/handoff error body | 通过 |

The audit keeps the same rule across all families:Step 9 may mention marker and ref structure, but any durable body snapshot, serialization envelope or digest object must be defined in Step 11/13 before implementation.

### 21.8 Step 10~16 handoff register

| Next step | Handoff item |
|---|---|
| Step 10 state matrix | lifecycle/anchor terminal transitions, role/source non-active priority, memory relation states, projection/reference/report/outbox/handoff state transitions, job result kind matrix |
| Step 11 persistence | UoW atomic save order, truth cursor/reference marker cursor persistence, expected_version columns, stored result/report/receipt tables, projection/reference/outbox/handoff indexes |
| Step 12 error recovery | public rejection/degraded/delayed/quarantined/noop/conflict priority, HTTP/status mapping, replay missing/wrong-kind handling, dependency unavailable classification |
| Step 13 concurrency/idempotency | digest conflict/in-flight policy, lock scope, duplicate replay matrix, stored command/receipt/callback/job serialization and replay guards |
| Step 14 config/external binding | topic binding, handoff target registry, resolver availability, job entry config, retry/backoff schedule, worker ack/dead-letter binding |
| Step 15 observability/audit | runtime log/metric names, business audit vs technical logs, trace/handoff/job observability without raw bodies |
| Step 16 tests | command/query/consumer/job targeted cuts, fake parity, no-write/no-repair, body-free, duplicate replay and boundary tests |

### 21.9 Step 9 completion checklist

| Checklist | 状态 |
|---|---|
| All 6 command flows have DTO, entry/service, domain call, port call, transaction, side effect and duplicate branch | [x] |
| All 14 query flows are read-only,visibility-first and stable-lookup based | [x] |
| All 5 consumer/callback flows have envelope validation,receipt replay,versioned save and callback guard | [x] |
| All 10 outbound materials are accepted-only and publish through saved outbox material | [x] |
| All 6 operations job flows have stored job report replay,item refs,no core truth repair and runner-only facade | [x] |
| Cross-flow transaction/idempotency/projection/reference/outbox/handoff/body-free audit has no unresolved blocking schema/port/state gap | [x] |
| Remaining decisions are explicitly assigned to Step 10~16 rather than hidden in implementation | [x] |

### 21.10 回填草稿

正式 `03-详细设计.md` 第 8 章末尾后续可追加:

```md
### 8.x Cross-flow processing rules

All command、consumer/callback and operations job write paths enter through application facade,open a UnitOfWork,reserve idempotency before mutation,save replayable stored surfaces before idempotency completion,and commit only after trace/audit/outbox/projection/reference/job report side effects are staged. Duplicate replay never reruns mutation,resolver calls,publisher delivery or repository scans.

All query flows are read-only and visibility-first. Query missing/stale/degraded material is surfaced through `IdentityQueryResponse` / `IdentityPageResponse`;queries never trigger projection rebuild,reference refresh,reconciliation generation,outbox publish,handoff delivery,retry,trace append,audit repair or stored result save.

Accepted outbox material is created only from accepted command/consumer/callback facts. `OutboxState::Published` represents outbound publish boundary only and does not prove downstream consumption. `HandoffState::Delivered` requires formal attempt and receipt markers;request sent,HTTP 2xx,adapter success or job log success cannot create delivered state.

All public,stored,trace,audit,outbox,view,receipt and report surfaces remain body-free unless a later persistence/idempotency step defines a formal body snapshot store. External truth body,adapter raw response,secret,target path,archive package and receipt body are outside Step 9 surfaces.
```

### 21.11 进入 Step 10 条件

进入 Step 10 前必须满足:

- 用户审核通过 9.6 cross-flow audit。
- Step 9 的所有 flow inventory 均已写入并回指 Step 6/7/8。
- Step 10 只收口状态集合、迁移矩阵、禁止方向、guard 和状态相关错误映射,不得在状态矩阵中新增未回指 Step 6/7/8 的 DTO、repository port 或 persistence schema。
- 若 Step 10 发现状态初始来源、terminal reopen、duplicate replay、projection/reference/outbox/handoff transition 或 fake parity 缺口,必须回对应 Step 6/7/8/9/13/14 闭口。
