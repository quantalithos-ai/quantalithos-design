# 02 概要校准 Step 8：关键处理流 / 重要函数数据流

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 7 completed / pass
> 本步目的：按 CMP-MS-01~07 收稳关键 Command、状态写入 Consumer、影响一致性的 Job、必要 Query 与跨 owner handoff 流；只写概要处理顺序，不写完整调用链、协议、SQL 或实现

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP、书写规范、ASCII 图统一格式和通用中间产物纪律已复核 |
| 已读取项目输入 | yes；正式 00 / 01、Step 5~7、接口覆盖表、29 个对象和上游 pending 注册表已复核 |
| 当前 Step | Step 8：关键处理流 / 重要函数数据流 |
| 本 Step 输出 | `design-calibration/02_hld_step_08_processing_flows.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 9 |

- [x] 回答关键流选择、事务边界和未展开接口问题。
- [x] 建立接口 / flow 覆盖清单与通用读写 / Consumer / Job 骨架。
- [x] 逐项完成 CMP-MS-01~07 的关键处理流和停审。
- [x] 完成跨流对象、接口、事务、状态写入和 pending 审计。
- [x] 完成 Gate 自检并更新 flow / project ledger。

## 2. 关键流选择与通用骨架

### 2.1 处理流选择规则应用

| 选择类别 | 本仓处理流 |
|---|---|
| P0 Command 独立流 | `AcceptHostIntentCommand`、`DecideHostOrchestrationCommand`、`ResolveHostQualificationCommand`、`CoordinateHostAssemblyCommand`、`AcceptHostRegistrationCommandPlaceholder`、`MaintainHostSessionCommandPlaceholder`、`DecideHostRecoveryCommand`、`CloseHostCommand`；CMP-MS-03 两个 internal Command 作为 host-side progression 独立流。 |
| 状态写入 Consumer 独立流 | qualification source change、host action outcome、health signal、cleanup feedback、handoff feedback。 |
| 影响一致性的 Job 独立流 | host action dispatch、health evaluation、cleanup progression、residual reconciliation、outbox publication、projection rebuild、handoff gap reconciliation。 |
| 必须独立的 Query | `QueryHostAssemblyReadiness`、`QueryHostAccessSession`、`QueryHostHealthFailure`、`QuerySafeHostFacts` / `QueryHostHistory`；均包含 visibility / freshness / blocked 或 projection 边界。 |
| 只走通用读路径的 Query | `QueryCurrentHostDecision` 在已有 source / safe view 上只读组合，不另画第二条副作用流；其边界在 CMP-01 流清单中注明。 |
| 未展开的外围接口 | E01~E04 仍为 extension boundary；不进入当前核心 flow 分母，未来纳入须回开 Step 2 / 5 / 7 / 8。 |

### 2.2 通用本地写路径

#### 通用本地写路径

```text
Command / explicit local decision
  │
  ▼
Inbound Entry / Application Service
  - map actor, metadata, stable key, subject and correlation
  - load current owner facts and expected revision
  │
  ▼
Domain Object / Policy / Guard
  - validate scope, generation, idempotency and local invariant
  - form new truth, decision, attempt or closure fact
  │
  ▼
Local Persistence + History / Material Marker
  - commit owner truth and append-only history locally
  - enqueue outbox marker only for committed change
  │
  ▼
Local Result
  - return ref + local status + gap / conflict / waiting if any
  - external action, delivery and observation remain separate
```

关键说明：
- 图表达本仓内强一致写入和 history / material marker 的相对位置，不表达具体数据库或 UoW 实现。
- 任何跨 owner side effect 都在本地 attempt / outbox 提交之后，经 Port / Job / Consumer 延后处理。
- local committed、external completed、delivered、observed、accepted 不由一条写路径压平。

#### 通用只读路径

```text
Query + ActorContext + visibility / freshness request
  │
  ▼
Query Entry / Read Application Service
  - authorize at boundary and select source / projection
  - never create command, refresh or repair
  │
  ▼
Source Truth / Safe Projection / Append-only History
  - read owner facts and projection freshness
  - apply safe-field and visibility slicing
  │
  ▼
Safe View / History Result
  - include stale / degraded / unavailable / unknown markers
  - omit forbidden body and external raw state
```

关键说明：
- 图表达 Query 的 no-write 约束；projection stale 不自动回写核心 truth。
- 具体分页、排序、缓存和授权实现留给 03；当前只冻结读取层级。
- Query 不能因为缺少 source 而本地补默认值或触发 lifecycle action。

#### 通用外部事实消费路径

```text
Inbound Event / Feedback Envelope Placeholder
  │
  ▼
Consumer Entry
  - validate source category, event identity, idempotency and generation
  - classify duplicate / late / stale / conflict / unknown
  │
  ▼
Snapshot / Attempt / Association / Handoff Record
  - append safe summary or matching local outcome
  - preserve source ref and captured time
  │
  ▼
Local Fact / Gap / Re-evaluation Marker
  - update only the owning local record
  - do not implicitly create formal command or external action
```

关键说明：
- 外部 envelope 与 payload 仍是 placeholder；本地只承接 safe summary / ref。
- Consumer 可形成 re-evaluation marker，但不能把事件到达解释为 ready、healthy 或 external completion。
- generation / effect key / handoff key 是迟到和重放隔离的必要锚。

#### 通用运维任务路径

```text
Operations Job + persisted due-work selector
  │
  ▼
Job Runner / Application Service
  - select committed attempt, snapshot, gap, case, outbox or projection state
  - acquire local revision / stable key guard
  │
  ▼
Domain Record / Port / Projection Builder
  - advance existing work, form finding or rebuild safe projection
  - call external port only after local attempt exists
  │
  ▼
Local Updated State + Gap / Feedback Marker
  - retain unknown and residual conditions
  - never invent actor authorization or formal lifecycle decision
```

关键说明：
- Job 是推进器，不是新的业务入口；schedule / lease / batch / retry 参数留 03 / 04。
- 对不可逆 unknown effect，Job 只能 hold / reconcile / mark gap，不自动换 key 重放。
- projection job 只能从 committed source rebuild，不反写 source owner。

## 3. 接口 / 处理流覆盖清单

| 接口 / Job | 是否独立画流 | 归属 | 关键对象 | 选择理由 |
|---|---|---|---|---|
| `AcceptHostIntentCommand` | yes | CMP-MS-01 | `HostIntent`、`HostControlPolicy` | P0 Command，决定所有后续主线是否有正式主语。 |
| `DecideHostOrchestrationCommand` | yes | CMP-MS-01 | `HostOrchestrationDecision` | P0 Command，形成唯一控制决定。 |
| `QueryCurrentHostDecision` | common read path | CMP-MS-01 | source facts、`SafeHostView` | 只读组合，不含 refresh / fallback；避免重复绘制。 |
| `ResolveHostQualificationCommand` | yes | CMP-MS-02 | `HostQualificationContext` | P0 qualification 写路径，required source fail-closed。 |
| `CoordinateHostAssemblyCommand` | yes | CMP-MS-02 / CMP-MS-03 | `HostAssembly`、`HostReadinessDecision`、`HostActionAttempt` | P0 assembly facade 跨 CMP 接缝。 |
| `QualificationSourceChangedConsumerPlaceholder` | yes | CMP-MS-02 | qualification context / policy | 改写 freshness / gap，必须显式消费流。 |
| `QueryHostAssemblyReadiness` | yes | CMP-MS-02 | context / assembly / readiness | projection / freshness / blocked 边界。 |
| `EstablishHostGenerationCommand` | yes | CMP-MS-03 | host / generation fence | internal P0 host identity flow。 |
| `PrepareHostActionCommand` | yes | CMP-MS-03 | action attempt / fence | side effect 前 local-first。 |
| `DispatchPendingHostActionsJob` | yes | CMP-MS-03 | action attempt / external association | 影响副作用一致性。 |
| `HostActionOutcomeConsumerPlaceholder` | yes | CMP-MS-03 | attempt / association | 改写本地 outcome，必须防迟到 / unknown。 |
| `AcceptHostRegistrationCommandPlaceholder` | yes | CMP-MS-04 | registration / policy | P0 registration acceptance。 |
| `MaintainHostSessionCommandPlaceholder` | yes | CMP-MS-04 | endpoint / session | P0 active uniqueness / Runtime placeholder。 |
| `QueryHostAccessSession` | yes | CMP-MS-04 | registration / endpoint / session | stale / blocked / unknown 边界。 |
| `HostHealthSignalConsumerPlaceholder` | yes | CMP-MS-05 | signal snapshot | 状态写入 Consumer。 |
| `EvaluateDueHostHealthJob` | yes | CMP-MS-05 | assessment / failure | 影响健康判断一致性。 |
| `DecideHostRecoveryCommand` | yes | CMP-MS-05 | recovery decision | P0 explicit control。 |
| `QueryHostHealthFailure` | yes | CMP-MS-05 | assessment / failure / recovery | 四轴安全读取与 unknown。 |
| `CloseHostCommand` | yes | CMP-MS-06 | closure / cleanup attempt | P0 local closure。 |
| `ProgressPendingHostCleanupJob` | yes | CMP-MS-06 | cleanup attempt / closure | 影响 cleanup consistency。 |
| `HostCleanupFeedbackConsumerPlaceholder` | yes | CMP-MS-06 | cleanup attempt / residual | 外部反馈写本地状态。 |
| `ReconcileHostResidualsJob` | yes | CMP-MS-06 | finding / case | `IB-MS-014` 核心 job。 |
| `HostFactMaterialEventCandidate` + `PublishHostFactOutboxJob` | yes | CMP-MS-07 | material / outbox / handoff | 传播可靠性与 local-first。 |
| `HostHandoffFeedbackConsumerPlaceholder` | yes | CMP-MS-07 | handoff record | feedback layer 不反写 source。 |
| `RebuildSafeHostProjectionJob` | yes | CMP-MS-07 | projection state / view | 查询一致性与 rebuild。 |
| `ReconcileHostHandoffGapsJob` | yes | CMP-MS-07 | outbox / handoff | gap / unknown consistency。 |
| `QuerySafeHostFacts` / `QueryHostHistory` | yes | CMP-MS-07 | view / history / projection | visibility / freshness / forbidden body。 |
| E01~E04 | no | extension boundary | — | 不进入当前核心分母。 |

## 4. CMP-MS-01：Host intent and orchestration decision

#### `AcceptHostIntentCommand` 处理流

```text
AcceptHostIntentCommand
  │
  ▼
HostControlCommandEntry / HostIntentService
  - map ActorContext actor, CommandMetadata metadata, HostIntentKey intent_key
  - validate ProjectMemberRef subject and GlobalMemberRef identity anchor
  │
  ▼
HostControlPolicy + HostIntent
  - validate source, scope, action and replay
  - form accepted / rejected / waiting / conflict intent
  │
  ▼
IntentDecisionStorePort + HostHistoryEntry
  - commit HostIntent and append body-free history locally
  - create material marker only after local commit
  │
  ▼
HostIntentRef + acceptance result
  - no carrier call, no host creation, no external completion claim
```

关键设计点：
- 该流是所有宿主生命周期主线的正式主语入口；非项目型主语必须在入口 fail closed。
- 幂等重放返回稳定既有结论，冲突追加可追溯事实，不形成第二 intent truth。
- 详细设计继续展开 mapping、事务边界和错误码；不在此处定义协议字段或授权实现。

#### `DecideHostOrchestrationCommand` 处理流

```text
DecideHostOrchestrationCommand
  │
  ▼
HostControlCommandEntry / HostDecisionService
  - load committed HostIntentRef intent_ref and current facts
  - carry ActorContext actor, CommandMetadata metadata, decision key and CorrelationId correlation_id
  │
  ▼
HostControlPolicy + HostOrchestrationDecision
  - classify replay / conflict / no-action
  - bind expected HostGeneration when a current host exists
  │
  ▼
IntentDecisionStorePort + HostHistoryEntry + material marker
  - commit one decision locally with supersedes relation if applicable
  - do not call carrier, Member, Runtime or Sandbox in this transaction
  │
  ▼
HostOrchestrationDecisionRef + local decision status
  - next progression is an explicit downstream use case
```

关键设计点：
- `HostOrchestrationDecision` 是 formal intent/control truth，不与 `HostRecoveryDecision` 合并。
- local committed decision 只授权后续流程，不表示 assembly、registration、health 或 external action 完成。
- Query、signal、projection 和 job 不能绕过该流隐式创建 lifecycle decision。

### CMP-MS-01 Query 处理口径与停审

`QueryCurrentHostDecision` 走通用只读路径：按 `ActorContext actor`、subject selector 和 visibility / freshness request 读取 source facts 与 `SafeHostView`，返回 safe slice、history anchor 和 gap。它不触发任何写操作，因此不另画副作用图。

| 审查项 | 结论 | 说明 |
|---|---|---|
| P0 Command 覆盖 | pass | intent acceptance 与 orchestration decision 均有独立流。 |
| Query 边界 | pass | current query 明确 no-write、no-refresh、no-fallback。 |
| 对象 / 接口承接 | pass | `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` 与 history 均可反查。 |
| 跨部分接缝 | pass | 下游 qualification / generation 只消费 committed decision ref。 |

停审结论：`CMP-MS-01` processing flows completed / pass；允许进入 CMP-MS-02。

## 5. CMP-MS-02：Host qualification and assembly

#### `ResolveHostQualificationCommand` 处理流

```text
ResolveHostQualificationCommand
  │
  ▼
HostQualificationCommandEntry / HostQualificationService
  - load committed HostOrchestrationDecisionRef decision_ref
  - resolve ProjectMemberRef, GlobalMemberRef and target HostGeneration
  │
  ▼
RequiredQualificationPolicy + resolver ports
  - request typed refs / safe summaries from Identity, Work, Images, credential, Sandbox and carrier seams
  - classify missing / stale / conflict / unknown without fallback
  │
  ▼
HostQualificationContext + QualificationAssemblyStorePort
  - record source entries, captured time, freshness and explicit gaps
  - commit context / history locally; no external side effect in this flow
  │
  ▼
HostQualificationContextRef + resolution result
  - resolved context can proceed; blocked / waiting context cannot be treated as ready
```

关键设计点：
- resolver 只返回 typed ref / safe summary；不把 L1、Images、credential、Sandbox 或 backend 正文搬入本仓。
- required source 缺失、合同 pending、stale、冲突和 unknown 均保留显式结果，不能用旧缓存或 host fallback 放行。
- 详细设计继续展开 resolver call contract、freshness evaluation 和本地事务，不在此处造外部 schema。

#### `CoordinateHostAssemblyCommand` 处理流

```text
CoordinateHostAssemblyCommand
  │
  ▼
HostAssemblyCommandEntry / HostAssemblyService
  - load HostQualificationContextRef context_ref and target HostGeneration generation
  - freeze required HostAssemblyItemSet required_items
  │
  ▼
HostAssembly + RequiredQualificationPolicy
  - record matching item outcomes and local blocked / unknown markers
  - if a host action is needed, hand off a typed progression request to CMP-MS-03
  │
  ▼
QualificationAssemblyStorePort + HostReadinessDecision
  - commit assembly revision and independently decide ready / blocked / waiting / failed / unknown
  - append history / material marker after local commit
  │
  ▼
HostAssemblyRef + OptionalHostReadinessDecisionRef
  - registration remains downstream and cannot prove readiness
```

关键设计点：
- `HostAssembly.complete` 与 `HostReadinessDecision.ready` 分开；local item partial / unknown 不得整体 ready。
- CMP-MS-03 只推进 host-side action；CMP-MS-02 仍拥有 readiness meaning，不能由 carrier result直接替代。
- `MSVC-UP-003/004/006` 未闭口时相应 required item 只能 blocked / waiting。

#### `QualificationSourceChangedConsumerPlaceholder` 处理流

```text
QualificationSourceChangedConsumerPlaceholder
  │
  ▼
HostQualificationEventConsumer
  - validate ExternalMessageId message_id, ExternalIdempotencyKey event_key, source ref and generation
  - classify duplicate / late / stale / conflict before any local update
  │
  ▼
HostQualificationContext + RequiredQualificationPolicy
  - append safe source change / freshness result
  - mark matching context stale / conflict or create re-evaluation marker
  │
  ▼
QualificationAssemblyStorePort + HostHistoryEntry
  - commit only local context / gap / marker
  - do not create launch, assembly action or readiness success implicitly
  │
  ▼
Local qualification change ref + re-evaluation marker
```

关键设计点：
- Consumer 的来源事件不直接修改 Identity / Work / Images / credential / Sandbox truth。
- 事件被接受只证明本地已记录来源变化，不证明 qualification resolved 或 host ready。
- 具体 event family、envelope、route 和 ordering contract 留给 03 / upstream owner。

#### `QueryHostAssemblyReadiness` 处理流

```text
QueryHostAssemblyReadiness
  │
  ▼
HostQueryEntry / HostReadService
  - apply ActorContext actor, HostRef host_ref, HostGeneration generation and freshness request
  - select matching context / assembly / readiness revisions
  │
  ▼
Safe slice builder
  - apply visibility and forbidden-body filter
  - retain missing / stale / blocked / unknown gaps
  │
  ▼
SafeHostView or direct readiness safe result
  - return source statuses, item outcomes and readiness decision
  - no resolver refresh, no assembly command, no write
```

关键设计点：
- 查询只读 matching generation 的本地事实；旧世代或 stale projection 不能冒充 current ready。
- source / credential / image / binding 正文不出现在结果；具体 view schema 留 03。

### CMP-MS-02 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| P0 Command / Consumer / Query 覆盖 | pass | qualification、assembly、source change 和 readiness query 均有独立流。 |
| 对象 / 接口承接 | pass | `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision`、policy 和 ports 均被使用。 |
| readiness 边界 | pass | assembly、readiness、registration 不互相代替；required source 缺口 fail closed。 |
| 跨部分接缝 | pass_with_blockers | CMP-03 progression 仅为 typed handoff；Images / Sandbox / credential positive contract 仍 pending。 |

停审结论：`CMP-MS-02` processing flows completed / pass；允许进入 CMP-MS-03。

## 6. CMP-MS-03：Host instance and carrier progression

#### `EstablishHostGenerationCommand` 处理流

```text
EstablishHostGenerationCommand
  │
  ▼
HostLifecycleProgressionService
  - inherit ActorContext actor, CommandMetadata metadata and committed decision ref
  - load current host pointer, expected generation and unknown effect refs
  │
  ▼
HostGenerationFence + MemberExecutionHost
  - classify replay / conflict / hold
  - allocate immutable next generation and predecessor relation
  │
  ▼
HostProgressionStorePort + HostHistoryEntry
  - atomically commit new logical host and current pointer
  - never create carrier / container / Sandbox resource in this transaction
  │
  ▼
HostRef + HostGeneration or stable replay / conflict / hold
```

关键设计点：
- generation 是本地 Host Truth，不使用 backend resource version 代替；restart / replace 创建新 host，不原地改旧实例。
- unknown external effect 或 concurrent current pointer 使建立进入 hold / conflict，不能竞争创建。
- 具体 ID 分配、revision compare 和 UoW 实现留 03。

#### `PrepareHostActionCommand` 处理流

```text
PrepareHostActionCommand
  │
  ▼
HostLifecycleProgressionService
  - load HostActionDecisionRef decision_ref, HostRef host_ref and HostGeneration generation
  - carry ActorContext actor, CommandMetadata metadata, IdempotencyKey action_key
  │
  ▼
HostGenerationFence + HostActionAttempt
  - verify decision permits action and generation is current
  - form stable ExternalEffectKey effect_key and prepared local attempt
  │
  ▼
HostProgressionStorePort + HostHistoryEntry
  - commit attempt before any external port call
  - retain replay / conflict / unknown guard
  │
  ▼
HostActionAttemptRef + prepared / replay / hold result
```

关键设计点：
- 本流只建立 local attempt，不在同步事务里调用 carrier / registry / Sandbox。
- 相同 effect key 的重复输入返回既有 attempt；unknown effect 不换 key 盲重放。
- orchestration、recovery 与 closure decision 都可作为 typed decision ref，但各自 owner truth 不合并。

#### `DispatchPendingHostActionsJob` 处理流

```text
DispatchPendingHostActionsJob
  │
  ▼
HostOperationsJobs / HostLifecycleProgressionService
  - select committed prepared HostActionAttemptRef attempt_ref
  - recheck generation, decision and ExternalEffectKey effect_key
  │
  ▼
HostCarrierLifecyclePort / PinnedAssetAcquisitionPort / SandboxHostBindingLifecyclePort
  - dispatch only the action kind owned by the selected port
  - receive local dispatch acknowledgement, safe outcome or unknown
  │
  ▼
HostActionAttempt + HostProgressionStorePort
  - record dispatched / failed / unknown locally
  - defer asynchronous outcome to matching Consumer
  │
  ▼
Updated attempt ref + local dispatch result / gap
```

关键设计点：
- Job 只推进已有 prepared attempt，不能新建 decision、host generation 或 action intent。
- 外部调用位于本地 attempt 提交之后；调用结果 unknown 时保持 fence / reconciliation。
- port 选择、dispatch transaction split、lease 与 timeout / backoff 留 03 / 04。

#### `HostActionOutcomeConsumerPlaceholder` 处理流

```text
HostActionOutcomeConsumerPlaceholder
  │
  ▼
HostExternalFeedbackConsumer
  - validate outcome identity, ExternalEffectKey effect_key, source ref and correlation
  - classify matching / duplicate / late / conflict / unknown generation
  │
  ▼
HostActionAttempt + HostExternalAssociation
  - record safe outcome on matching attempt
  - establish / update typed association without owning external lifecycle
  │
  ▼
HostProgressionStorePort + optional QualificationAssemblyStorePort update
  - commit attempt / association and matching assembly item outcome locally
  - form new readiness decision only through CMP-MS-02 policy and current revision
  │
  ▼
Committed local outcome ref + readiness / health / closure re-evaluation marker
```

关键设计点：
- late / duplicate / old-generation feedback is preserved but cannot overwrite current attempt / association / assembly state。
- association active、attempt succeeded 与 Host Readiness / health 含义分开；CMP-MS-02 才能形成 readiness decision。
- exact callback / receipt schema 受 `MSVC-UP-003/004/007` 限制，当前只定义 host-side matching flow。

### CMP-MS-03 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| internal Command / Job / Consumer 覆盖 | pass | generation、attempt prepare、dispatch 和 outcome correlation 均有独立流。 |
| local-first / generation | pass | current pointer 与 attempt 均先本地提交，external call 在后，迟到 outcome 受 fence。 |
| 对象 / 接口承接 | pass | host、attempt、association、fence 及所有 lifecycle ports 可反查。 |
| 跨部分接缝 | pass_with_blockers | outcome 可触发 CMP-02/05/06 re-evaluation marker，但不能写其 owner truth；exact ports pending。 |

停审结论：`CMP-MS-03` processing flows completed / pass；允许进入 CMP-MS-04。

## 7. CMP-MS-04：Registration and Host Session

#### `AcceptHostRegistrationCommandPlaceholder` 处理流

```text
AcceptHostRegistrationCommandPlaceholder
  │
  ▼
HostRegistrationEntry / HostRegistrationService
  - map ActorContext actor, CommandMetadata metadata and RegistrationInputFingerprint fingerprint
  - load host / generation, readiness, subject anchors and current registration
  │
  ▼
RegistrationSessionPolicy + credential qualification port
  - validate source, ProjectMemberRef, GlobalMemberRef, generation and instance-bound credential context
  - classify replay / rejected / blocked / replacement
  │
  ▼
HostRegistration + RegistrationSessionStorePort + HostHistoryEntry
  - commit accepted / rejected / replaced truth and current pointer locally
  - preserve prior registration history
  │
  ▼
HostRegistrationRef + local acceptance result
  - no implicit endpoint, Host Session, readiness or Runtime run success
```

关键设计点：
- registration source truth remains in L2-member；本仓只拥有 acceptance / rejection / replacement。
- required readiness、generation 和 credential qualification 缺一即 rejected / blocked；旧实例不能覆盖 current。
- `MSVC-UP-002/006` 未闭口时 positive input remains waiting / blocked，不伪造 request / secret schema。

#### `MaintainHostSessionCommandPlaceholder` 处理流

```text
MaintainHostSessionCommandPlaceholder
  │
  ▼
HostRegistrationEntry / HostSessionService
  - load accepted HostRegistrationRef registration_ref and current generation
  - map safe endpoint ref and optional RuntimeAssociationRefPlaceholder runtime_ref
  │
  ▼
RegistrationSessionPolicy + HostEndpoint + HostSession
  - guard one active registration / endpoint / Host Session per current host generation
  - form candidate / pending / blocked / replacement / invalidation state
  │
  ▼
RegistrationSessionStorePort
  - commit local endpoint / pending session shell and prior-link history
  - if formal Runtime port exists, call it outside the local transaction and correlate safe result
  │
  ▼
HostEndpointRef + HostSessionRef + active / blocked / stale / unknown
```

关键设计点：
- exact Runtime association surface 未闭口时，流程止于 pending / blocked Host Session shell；不得描绘虚构正向 run。
- endpoint 只保存 safe ref，不输出 raw transport / secret；endpoint reachable 不等于 session healthy。
- replacement / closure 通过显式 invalidation 终结旧关联，不删历史。

#### `QueryHostAccessSession` 处理流

```text
QueryHostAccessSession
  │
  ▼
HostQueryEntry / HostReadService
  - apply ActorContext actor, host / generation selector and visibility request
  - load current registration / endpoint / Host Session refs and projection freshness
  │
  ▼
Safe access slice builder
  - verify all three refs belong to the same current generation
  - redact endpoint / credential / Runtime association details
  │
  ▼
SafeHostView access slice
  - return active / stale / blocked / closed / unknown plus history anchor
  - no registration acceptance, session creation or Runtime call
```

关键设计点：
- 查询必须暴露 generation mismatch、stale、blocked 和 unknown，不能只给“可用 / 不可用”单值。
- projection stale 时可以返回显式 stale 或从 source facts 构造最小安全只读结果，但不得写回 projection。

### CMP-MS-04 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| P0 Command / Query 覆盖 | pass | registration、endpoint / Host Session 维护与安全查询均有独立流。 |
| single-active / history | pass | 同世代活动唯一、replacement / invalidation 追加历史。 |
| 对象 / 接口承接 | pass | registration、endpoint、session、policy 与三类 external ports 均可反查。 |
| 跨部分接缝 | pass_with_blockers | readiness 是前置而非反推；Runtime positive branch 显式 blocked，Member / credential exact contract waiting。 |

停审结论：`CMP-MS-04` processing flows completed / pass；允许进入 CMP-MS-05。

## 8. CMP-MS-05：Host health and recovery

#### `HostHealthSignalConsumerPlaceholder` 处理流

```text
HostHealthSignalConsumerPlaceholder
  │
  ▼
HostSignalConsumer
  - validate ExternalMessageId message_id, ExternalIdempotencyKey event_key and SignalSourceRefPlaceholder source_ref
  - match HostRef host_ref, HostGeneration generation and OptionalHostSessionRef session_ref
  │
  ▼
HealthSignalSnapshot
  - classify accepted / duplicate / late / stale / conflict / rejected
  - retain observed / captured time and body-free safe summary
  │
  ▼
HostHealthFactStorePort + HostHistoryEntry
  - commit snapshot / freshness fact and assessment-due marker
  - do not write health conclusion or recovery decision directly
  │
  ▼
HealthSignalSnapshotRef + intake result
```

关键设计点：
- 原始 heartbeat / report / logs / checkpoint 不进入本仓；只保留 safe summary、source、sequence / time 和 correlation。
- duplicate / late / stale / old-generation 信号可保留历史，但不能逆写 current assessment。
- signal accepted 只证明快照被本地承接，不等于 host healthy、Runtime progress 或业务成功。

#### `EvaluateDueHostHealthJob` 处理流

```text
EvaluateDueHostHealthJob
  │
  ▼
HostOperationsJobs / HostHealthService
  - select current host / session facts, accepted snapshots and local action / association basis refs
  - apply evaluation window selector without hard-coded numeric policy
  │
  ▼
HostHealthAssessment + HostFailureClassification
  - assess host / session / backend / uncertainty axes independently
  - classify confirmed / suspected / unknown host-side failure when applicable
  │
  ▼
HostHealthFactStorePort + HostHistoryEntry + material marker
  - commit new assessment revision and optional failure classification
  - supersede prior assessment by reference, never overwrite history
  │
  ▼
Assessment / classification refs + recovery-decision-needed marker
```

关键设计点：
- Job 可形成健康 assessment / failure classification，但不能隐式创建 `HostRecoveryDecision`。
- carrier / binding 结果只能通过 CMP-MS-03 committed local refs 进入 basis，不从 backend 直接重建 Host Truth。
- freshness window、threshold、schedule 和 workload 数值留 04 / 05，不在概要设计锁定。

#### `DecideHostRecoveryCommand` 处理流

```text
DecideHostRecoveryCommand
  │
  ▼
HostControlCommandEntry / HostRecoveryService
  - load current HostHealthAssessmentRef assessment_ref, optional failure ref and formal control source
  - validate ActorContext actor, CommandMetadata metadata, IdempotencyKey decision_key and generation
  │
  ▼
HostRecoveryDecision
  - choose recover / restart / stop / terminate / hold from current facts and prerequisites
  - keep decision status separate from external action result
  │
  ▼
HostHealthFactStorePort + HostHistoryEntry + material marker
  - commit decision locally with supersedes relation
  - emit typed progression / closure marker after commit
  │
  ▼
HostRecoveryDecisionRef + local action / hold result
  - CMP-MS-03 or CMP-MS-06 must explicitly prepare downstream work
```

关键设计点：
- raw signal、assessment job 或 backend alert 不能直接 restart / terminate；必须经本 Command 的正式 control context。
- restart 只能授权 CMP-MS-03 建新 generation，不承诺 Runtime checkpoint / run 已恢复。
- unknown prerequisite / side effect 必须产生 hold / blocked，不自动选择 destructive action。

#### `QueryHostHealthFailure` 处理流

```text
QueryHostHealthFailure
  │
  ▼
HostQueryEntry / HostReadService
  - apply ActorContext actor, host / generation selector and freshness request
  - load current assessment revision, failure and recovery decision refs
  │
  ▼
Safe health slice builder
  - preserve four health axes and uncertainty markers
  - redact raw signal / backend / Runtime details
  │
  ▼
Safe health / failure / recovery result
  - return stale / degraded / unknown explicitly
  - no re-assessment, recovery decision or external call
```

关键设计点：
- 四轴 health 不压成单一 boolean；uncertainty 必须保留。
- source snapshot 和 current assessment 的时点差异需在结果中可见，具体 response schema 留 03。

### CMP-MS-05 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Consumer / Job / Command / Query 覆盖 | pass | signal、assessment / failure、explicit recovery 与 safe query 均有独立流。 |
| 控制权 | pass | Consumer / Job 不取得 restart / terminate 权限；只有 formal Command 写 recovery decision。 |
| 对象 / 接口承接 | pass | snapshot、assessment、classification、decision 与 ports 全部可反查。 |
| 跨部分接缝 | pass_with_blockers | CMP-03 action facts只读输入，CMP-03/06 承接 committed decision；external signal contracts pending。 |

停审结论：`CMP-MS-05` processing flows completed / pass；允许进入 CMP-MS-06。

## 9. CMP-MS-06：Host closure and reconciliation

#### `CloseHostCommand` 处理流

```text
CloseHostCommand
  │
  ▼
HostControlCommandEntry / HostClosureService
  - load committed termination / replacement / release decision and current generation
  - load registration, endpoint, Host Session and external association refs
  │
  ▼
HostClosure + RegistrationSessionPolicy + HostGenerationFence
  - freeze closure scope and validate ActorContext actor, metadata and stable closure key
  - form local invalidations and prepared CleanupAttempt records
  │
  ▼
ClosureReconciliationStorePort + RegistrationSessionStorePort + HostHistoryEntry
  - locally commit closure, association invalidations and cleanup attempts
  - mark host quiescing / terminated only according to owner lifecycle rule
  │
  ▼
HostClosureRef + local invalidation / cleanup-pending result
  - external cleanup / release is deferred to Job / Port
```

关键设计点：
- registration / endpoint / Host Session 失效、local closure 和 external cleanup completion 是三层不同事实。
- cleanup attempt 必须在 external call 前提交；closure may be locally closed with external gap still present only under explicit local rule。
- 本流不能删除历史或依据 resource absence 直接宣称清理完成。

#### `ProgressPendingHostCleanupJob` 处理流

```text
ProgressPendingHostCleanupJob
  │
  ▼
HostOperationsJobs / HostClosureService
  - select committed HostClosureRef closure_ref and prepared CleanupAttemptRef attempt_ref
  - recheck generation, target association and ExternalEffectKey effect_key
  │
  ▼
HostCleanupReleasePortPlaceholder
  - dispatch carrier / registry cleanup or Sandbox host-level release by target kind
  - receive local dispatch acknowledgement, safe outcome or unknown
  │
  ▼
CleanupAttempt + HostClosure + ClosureReconciliationStorePort
  - record dispatched / failed / unknown / gap
  - advance local closure only from matching local facts
  │
  ▼
Updated cleanup / closure refs + residual-check marker
```

关键设计点：
- Job 只推进已有 closure / attempt；不创建 lifecycle decision，也不换 effect key 重放 unknown action。
- request accepted / timeout / local association invalidated 都不等于 external cleanup completed。
- exact Sandbox / carrier receipt 受 `MSVC-UP-004/007` 限制；schedule / retry policy 留 04。

#### `HostCleanupFeedbackConsumerPlaceholder` 处理流

```text
HostCleanupFeedbackConsumerPlaceholder
  │
  ▼
HostExternalFeedbackConsumer
  - validate feedback identity, cleanup effect key, target ref, host / generation and source owner
  - classify matching / duplicate / late / conflict / unknown
  │
  ▼
CleanupAttempt + HostClosure
  - attach safe external cleanup / release summary to matching attempt
  - retain external owner and captured time without claiming source truth
  │
  ▼
ClosureReconciliationStorePort + OptionalResidualFinding
  - commit local outcome / gap and closure re-evaluation
  - create finding when local facts and safe summary disagree
  │
  ▼
Committed cleanup feedback ref + closure / reconciliation marker
```

关键设计点：
- late feedback may close a prior gap by new fact, but cannot rewrite original attempt or termination history。
- `succeeded` in local attempt means matching safe summary is recorded, not that this repository owns external completion。
- unknown / conflict feeds reconciliation rather than blind retry or silent success。

#### `ReconcileHostResidualsJob` 处理流

```text
ReconcileHostResidualsJob
  │
  ▼
HostOperationsJobs / HostReconciliationService
  - select host / generation / closure facts and existing findings / cases
  - request allowed safe summaries through ResidualObservationPortPlaceholder
  │
  ▼
ResidualFinding
  - compare committed Host Truth with source-attributed captured summaries
  - classify residual / orphan / drift / disputed / unknown
  │
  ▼
ReconciliationCase + ClosureReconciliationStorePort
  - form hold / repair-request / escalate / resolve / no-action disposition
  - append history; prepare subsequent action only under explicit disposition
  │
  ▼
Finding / case refs + disposition result
  - no hidden restart, deletion or sibling truth repair
```

关键设计点：
- observation port runs outside local transaction; only safe summaries and source time enter comparison。
- Job may form a reconciliation disposition but cannot invent formal lifecycle control or delete facts to make drift disappear。
- resolution is local case closure with explicit basis; it does not generalize to external cleanup completion。

### CMP-MS-06 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command / Job / Consumer 覆盖 | pass | closure、cleanup dispatch、feedback、residual / case 均有独立流。 |
| local / external result layering | pass | local invalidation / attempt / gap / finding / case 与 external completion 分开。 |
| 对象 / 接口承接 | pass | closure、cleanup attempt、finding、case 与 cleanup / observation ports 可反查。 |
| 跨部分接缝 | pass_with_blockers | CMP-04 invalidation与CMP-03 release按 typed refs 协作；Sandbox / carrier receipts pending。 |

停审结论：`CMP-MS-06` processing flows completed / pass；允许进入 CMP-MS-07。

## 10. CMP-MS-07：Host fact handoff and safe consumption

#### `HostFactMaterialEventCandidate` / material formation 处理流

```text
Committed local change
  │
  ▼
HostMaterialService
  - receive CommittedHostChangeRef change_ref and source fact refs
  - apply body-free / redaction profile and target-independent material rules
  │
  ▼
HostFactMaterial + HostHistoryEntry + HostOutboxRecord
  - form immutable material from committed CMP-MS-01~06 truth
  - bind stable PublicationKey and target class in local outbox
  │
  ▼
HostMaterialHistoryStorePort
  - commit material, history and pending outbox locally
  - do not wait for Bus / Observability / consumer completion
  │
  ▼
HostFactMaterialRef + pending outbox / handoff seed
```

关键设计点：
- material 只能从已提交本地 change 形成，不能从 backend observed state、projection 或 external body反推 source truth。
- body-free / redaction 是形成门槛；secret、raw endpoint、Runtime / Sandbox / Images / report 正文禁止进入。
- outbox pending 是本地传播事实，不表示 submitted、delivered、observed 或 accepted。

#### `PublishHostFactOutboxJob` 处理流

```text
PublishHostFactOutboxJob
  │
  ▼
HostOperationsJobs / HostMaterialService
  - select pending / unknown-fenced HostOutboxRecord outbox_ref
  - verify source change, material ref, PublicationKey and target class
  │
  ▼
HostFactPublicationPortPlaceholder
  - submit body-free material ref / safe envelope to target seam
  - receive local submission summary, unavailable or unknown
  │
  ▼
HostOutboxRecord + HostHandoffRecord + HostMaterialHistoryStorePort
  - record publisher attempt / submitted / gap / unknown locally
  - create or update per-target handoff record with stable HandoffKey
  │
  ▼
Outbox / handoff refs + local publication result
  - external delivery / observation / acceptance remains pending or feedback-linked
```

关键设计点：
- Job 只发布已提交 material，不创建 source truth，也不把 publisher acknowledgement 当 external delivery。
- unknown submission 保持同一 PublicationKey / HandoffKey，禁止以新 key 盲重放不可判定效果。
- route、envelope、receipt、DLQ 和 retry policy 留 03 / 04，当前只冻结 local attempt / gap。

#### `HostHandoffFeedbackConsumerPlaceholder` 处理流

```text
HostHandoffFeedbackConsumerPlaceholder
  │
  ▼
HostExternalFeedbackConsumer
  - validate ExternalMessageId message_id, ExternalIdempotencyKey feedback_key, HandoffKey handoff_key and target ref
  - classify delivery / observation / acceptance summary as matching / duplicate / late / conflict / unknown
  │
  ▼
HostHandoffRecord
  - update only the corresponding delivery, observation or acceptance layer
  - retain owner, captured time and safe summary
  │
  ▼
HostMaterialHistoryStorePort + HostHistoryEntry
  - append local feedback link / gap / history entry
  - never roll back source material, outbox or CMP-MS-01~06 truth
  │
  ▼
Handoff feedback ref + current layered status
```

关键设计点：
- delivered、observed、accepted 是三个独立 outcome layer；任何一个都不能由 local submit、timeout 或其他 layer 推导。
- late / duplicate feedback 追加关联历史，不覆盖 source fact 或旧 attempt。
- exact Bus / Observability / consumer feedback contract 受 `MSVC-UP-007` 限制，未闭口时保持 gap / unknown。

#### `RebuildSafeHostProjectionJob` 处理流

```text
RebuildSafeHostProjectionJob
  │
  ▼
HostOperationsJobs / HostReadService
  - load HostProjectionState projection_state and committed change cursor
  - acquire projection revision guard and select source revisions
  │
  ▼
SafeProjectionStorePort + SafeHostView
  - apply committed facts to read-only safe slices
  - mark fresh / stale / rebuilding / degraded / unavailable and retain gaps
  │
  ▼
HostProjectionState + derived SafeHostView
  - commit projection cursor / freshness only in projection store
  - never update CMP-MS-01~06 owner truth
  │
  ▼
Projection state / safe view result
  - query may expose stale / unavailable; core writes remain independent
```

关键设计点：
- projection rebuild is repeatable from committed source facts and may be stale or degraded。
- projection state is not a command source and cannot repair readiness, health, closure or handoff truth。
- cursor is a domain-level committed-change reference, not an invented broker offset schema。

#### `ReconcileHostHandoffGapsJob` 处理流

```text
ReconcileHostHandoffGapsJob
  │
  ▼
HostOperationsJobs / HostMaterialService
  - select handoff gaps / unknowns by stable HandoffKey and feedback cursor
  - classify whether a new attempt is allowed without violating unknown fence
  │
  ▼
HostHandoffRecord + HostOutboxRecord
  - retain gap, create a local retry decision marker or await owner feedback
  - do not generate a new source event or change delivery layers locally
  │
  ▼
HandoffFeedbackIntakePortPlaceholder (optional)
  - accept matching safe feedback when route / owner contract exists
  - otherwise preserve blocked / waiting / unknown
  │
  ▼
Updated handoff / gap refs
```

关键设计点：
- job 只能处理已存在的 handoff gap；是否可重试由 stable key、effect status 和后续详细策略决定。
- 没有正式 route / receipt 时，结果保持 waiting / blocked，不能以“重发成功”清除 gap。

#### `QuerySafeHostFacts` / `QueryHostHistory` 处理流

```text
QuerySafeHostFacts / QueryHostHistory
  │
  ▼
HostQueryEntry / HostReadService
  - apply ActorContext actor, subject / host selector, visibility and freshness request
  - select SafeHostView, HostProjectionState and append-only HostHistoryEntry
  │
  ▼
Safe slice / history builder
  - enforce body-free fields, visibility scope and source revision anchors
  - retain stale / degraded / unavailable / unknown markers
  │
  ▼
SafeHostView / HostHistoryEntry page
  - return current / historical material only
  - no refresh, publish, reconcile, restart, cleanup or source write
```

关键设计点：
- Query 不把 projection unavailable 变成 source failure；也不通过回放 history 触发 command。
- 外部 outcome 只以 handoff safe summary 读取，不能返回 raw receipt / report / evidence。
- 具体 visibility、分页和排序协议留 03，freshness / projection cadence 留 04。

### CMP-MS-07 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Event / Job / Consumer / Query 覆盖 | pass | material、publish、feedback、projection、gap 和 safe query 均有独立流。 |
| local-first / no-write projection | pass | material / outbox / handoff 本地事实先提交，projection 只读重建。 |
| 对象 / 接口承接 | pass | material、handoff、view、projection、outbox、history 与对应 ports 全部可反查。 |
| 跨部分接缝 | pass_with_blockers | CMP-01~06 committed facts 是唯一 source；Bus / Observability / consumer routes pending。 |

停审结论：`CMP-MS-07` processing flows completed / pass；允许执行 Step 8 跨处理流终审。

## 11. 未独立展开接口与处理流取舍

| 接口 / 主体 | 处理方式 | 原因 |
|---|---|---|
| `QueryCurrentHostDecision` | 通用只读路径 | 只读 source / safe view 组合，不含独立 projection / fallback 复杂度；其边界在 CMP-01 记录。 |
| `IntentDecisionStorePort` 等 local store ports | 随 owner Command / Query flow 点名 | 它们是持久化 seam，不是独立业务处理流；完整 UoW / transaction 留 03。 |
| `ClockPort`、`IdGenerationPort`、`OperationsContextPort` | 不独立画图 | 支持每条流的 typed context，不拥有业务 truth。 |
| E01~E04 | 不展开 | 当前是 optional extension，不进入核心分母。 |
| 具体 transport callback / route / event family | 不展开 | `MSVC-UP-001~008` 未闭口；写细会伪造双侧合同。 |

## 12. Step 8 / 9 反查清单

| 后续位置 | 已定义处理流 | 反查对象 | 反查接口 / 写入者 |
|---|---|---|---|
| intent / decision states | acceptance、orchestration flows | `HostIntent`、`HostOrchestrationDecision`、history | `IB-MS-001/002` Commands |
| qualification / assembly / readiness states | qualification、assembly、source-change、readiness query flows | context、assembly、readiness、policy | `IB-MS-004/005/006` + source Consumer |
| host / attempt / association states | generation、attempt prepare / dispatch / outcome flows | host、attempt、association、fence | internal Commands、dispatch Job、outcome Consumer |
| registration / endpoint / session states | registration、session、access query flows | registration、endpoint、session、policy | `IB-MS-007/008/009` |
| signal / assessment / failure / recovery states | signal, health job, recovery, health query flows | snapshot、assessment、classification、decision | `IB-MS-010/011/012` |
| closure / cleanup / residual / case states | close、cleanup job、feedback、reconcile flows | closure、cleanup attempt、finding、case | `IB-MS-013/014/017` cleanup branch |
| material / outbox / handoff / projection states | material、publish、feedback、projection、gap、safe query flows | material、outbox、handoff、view、projection、history | `IB-MS-015/016/017` handoff branch + jobs |

## 13. 跨处理流一致性审计

| 审计项 | 结论 | 处理 / 证据 |
|---|---|---|
| P0 Command 覆盖 | pass | 所有 P0 Command 和 CMP-03 internal generation / attempt flows 均独立展开。 |
| 状态写入 Consumer 覆盖 | pass | qualification source、action outcome、health signal、cleanup feedback、handoff feedback 均有独立流。 |
| 一致性关键 Job 覆盖 | pass | dispatch、health evaluation、cleanup、residual、publication、projection、handoff gap jobs 均有独立流。 |
| Query 边界 | pass | 复杂 freshness / visibility / projection queries 独立展开；简单 current decision query 走通用读路径并说明原因。 |
| 对象反查 | pass | 所有图中 domain object、projection、outbox、history 和 port 均在 Step 6 / 7 定义。 |
| 接口反查 | pass | `IB-MS-001~017` 均有处理流或有明确未独立展开理由。 |
| local transaction 粒度 | pass | 本地 truth / history / marker / attempt 先提交；external call / event / feedback / projection eventual。 |
| 状态 writer 唯一性 | pass | Command / Consumer / Job 的状态写入职责不重叠；Query 永不写。 |
| 跨部分接缝 | pass | CMP-01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 的 typed refs / markers 明确；回边不绕过正式 owner。 |
| unknown / late / duplicate | pass | 各流均保留 stable key / generation / gap / hold，不盲重放或逆写 current。 |
| 外部合同保真 | pass_with_blockers | Runtime / Member / Images / Sandbox / credential / Bus / schema exact contract 继续 pending；正向图只写 blocked / placeholder。 |
| 实现泄漏 | pass | 未写完整调用链、SQL、协议字段、错误码、retry 参数或产品实现。 |

## 14. 正式第 8 章回填草稿

正式 §8 应先放通用本地写路径、只读路径、外部事实消费路径和运维任务路径，再按 CMP-MS-01~07 选择 P0 Command、状态写入 Consumer、关键 Job 与复杂 Query 的处理流图。正文可压缩图后说明，但必须保留：

1. local decision / attempt / history / outbox 先于 external side effect、delivery、observation 和 accepted。
2. Query no-write；projection 可 stale / degraded / unavailable 且不能反写 source truth。
3. signal / feedback / job 不能隐式创建 formal lifecycle decision；unknown / late / duplicate 必须显式。
4. `MSVC-UP-001~008` 未闭口时，正向 runtime / Member / Images / Sandbox / Bus 分支只能 blocked / waiting / unknown。

## 15. 待确认事项与后续上限

| 事项 | 当前结论 | 对后续影响 |
|---|---|---|
| P0 流的协议 / UoW / transaction 细节 | 未展开 | 03 继续定义 exact function / repository / transaction boundary；不改变本步主语。 |
| 事件 envelope / route / receipt | placeholder | 03 只能在上游合同闭口后补双侧字段；否则保持 blocked。 |
| freshness / threshold / timeout / retry 数值 | 未定义 | 04 / 05 讨论配置与测量，不在本步预支。 |
| Runtime entry / session、Member IPC、Images manifest、Sandbox binding | pending | 受影响流继续 fail-closed；不伪造 positive integration。 |
| E01~E04 | extension boundary | 若纳入必须回开范围与接口 / flow，不得在后续隐式加入。 |

## 16. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 七部分逐项处理流停审 | pass | CMP-MS-01~07 均完成独立流、关键设计点和停审记录。 |
| 通用路径 | pass | write / read / consumer / job 四类骨架已给出，未绑定产品实现。 |
| P0 / Consumer / Job 覆盖 | pass | 所有必须独立展开类别均有流程图。 |
| 对象 / 接口反查 | pass | Step 6 的 29 对象和 Step 7 的 IB-MS-001~017 均可反查。 |
| ASCII 图格式 | pass | 每图有接口标题、`text` 代码块和 2~5 条关键设计点。 |
| local / external layering | pass | local commit、attempt、gap、external outcome、delivery、observed、accepted 分开。 |
| 外部 blocker | pass_with_blockers | `MSVC-UP-001~008` 继续 pending / blocked / waiting。 |
| 正式文档写入 | pass | 未修改旧正式 02；Step 9 尚未创建。 |

```text
step_08_status = completed
step_08_gate = pass
component_stop_reviews = 7_of_7
flow_cross_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 9 state_transitions
```
