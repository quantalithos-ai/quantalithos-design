# Step 8：API / Command / Query / Event / Job 协议契约

> 状态：completed / pass_with_upstream_blockers
> 目标文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md`

## 1. 本步目标、输入与输出

本步把 02 的接口骨架和 Step 7 的 Port 契约下沉为 transport-neutral public DTO、internal command、query、inbound consumer、outbound material event 和 operations job。每个协议都必须能回指：

```text
metadata -> handler -> operation context -> domain object / port
request  -> validation -> result / receipt -> stored replay
change   -> material snapshot -> outbox -> publication / feedback layers
```

本步不锁定 HTTP、RPC、IPC、topic、broker、serialization product、Core/Bus exact envelope 或 sibling payload。`MSVC-UP-001~008` 未闭合时，相关协议保持 `Placeholder`、`Blocked`、`UnsupportedVersion` 或 `Unknown` 上限。

### 1.1 输入

| 输入 | 作用 |
|---|---|
| `02_hld_step_07_interface_skeleton.md` | 协议类别、`IB-MS-001~017` 和流族分组 |
| `03_ddd_step_06_object_contracts.md` | DTO 必须承接的 object/ref/state/reason |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | handler 可调用的唯一 Port 与返回错误 |
| `02_hld_step_08_processing_flows.md` | accepted、query no-write、consumer marker、job boundary |
| `设计真相源闭环与可落码性标准.md` | metadata、idempotency、DTO 构造、view/page、outbox snapshot 闭环 |

### 1.2 SOP 问题回答

| 问题 | 结论 |
|---|---|
| 是否每个协议独立列出？ | 是；同构协议共享 envelope 规则，但每个 Command / Query / Consumer / Job 有独立名称、owner、结果和测试切口。 |
| DTO 是否能构造下游对象？ | 是；必填 subject、generation、stable key、source、correlation、reason、revision 和 safe ref 都有来源；上游 exact 字段未闭合处显式 placeholder。 |
| Query 是否可能隐式写入？ | 否；Query 只读 source/projection/history，返回 visible/not-visible/degraded/unavailable，不 refresh、repair 或创建 decision。 |
| Event receipt 是否表示完成？ | 否；receipt 只表示本地接收/拒绝/重复/延迟/不支持；`submitted/delivered/observed/accepted` 四层分离。 |
| Job 是否产生授权？ | 否；Job 只能推进已提交 attempt、outbox、projection、reconciliation 或 handoff marker。 |

## 2. 公共 metadata、envelope 与结果面

### 2.1 Command / Query metadata

```rust
/// Metadata validated at a synchronous command boundary.
pub struct HostCommandMetadata {
    pub actor: HostActorContext,
    pub command_id: CommandId,
    pub idempotency_key: IdempotencyKey,
    pub correlation_id: CorrelationId,
    pub captured_at: HostTimestamp,
}

/// Metadata validated at a read-only query boundary.
pub struct HostQueryMetadata {
    pub actor: HostActorContext,
    pub query_id: QueryId,
    pub correlation_id: CorrelationId,
    pub captured_at: HostTimestamp,
}
```

字段来源与红线：

| 字段 | 来源 | 可选性 | 禁止推导 |
|---|---|---|---|
| `actor` | Core actor context / formally validated internal context | required | route、payload title、scheduler identity |
| `command_id` / `query_id` | entry metadata | required | timestamp、request body hash |
| `idempotency_key` | command/consumer/job metadata | command required；query forbidden | random retry key、effect key |
| `correlation_id` | entry metadata 或继承的 local context | required | route、external body、new key per retry |
| `captured_at` | `HostClockPort` at acceptance | required | business transition time、source event time |

### 2.2 Inbound event / job envelope placeholders

```rust
/// Transport-neutral envelope; exact Core/Bus fields remain upstream-owned.
pub struct HostInboundEventEnvelope<T> {
    pub schema_version: SchemaVersion,
    pub message_id: ExternalMessageId,
    pub source_ref: HostExternalSourceRef,
    pub idempotency_key: IdempotencyKey,
    pub correlation_id: CorrelationId,
    pub produced_at: ExternalTimestamp,
    pub payload: T,
}

/// A scheduler-neutral operations input.
pub struct HostJobEnvelope<T> {
    pub schema_version: SchemaVersion,
    pub run_id: JobRunId,
    pub idempotency_key: IdempotencyKey,
    pub correlation_id: CorrelationId,
    pub requested_at: HostTimestamp,
    pub payload: T,
}
```

未闭合的 schema version、source、route、signature、delivery receipt 不可由本仓补齐。Unsupported version 必须在 payload 解析前返回 body-free receipt。

### 2.3 Result、receipt 与 redaction

所有 Command 返回 `HostCommandOutcome<T>`，Query 返回 `HostQueryOutcome<T>`，Consumer 返回 `HostConsumerReceipt`，Job 返回 `HostJobDisposition`。结果只携带 public safe DTO、typed ref、reason、gap、freshness、visibility 和 stored result ref。

```rust
pub enum HostCommandOutcome<T> {
    Accepted(T),
    Rejected(HostRejection),
    Duplicate(StoredResultRef),
    Conflict(HostConflict),
    Blocked(HostBlockedReason),
}

pub enum HostQueryOutcome<T> {
    Visible(T),
    NotVisible(VisibilityMarker),
    Degraded(T, FreshnessMarker),
    Unavailable(AvailabilityMarker),
}

pub enum HostConsumerReceipt {
    Accepted(LocalReceiptRef),
    Duplicate(LocalReceiptRef),
    Delayed(LocalReceiptRef),
    Rejected(HostRejection),
    UnsupportedVersion(UnsupportedVersionMarker),
}
```

`Rejected`、`Blocked`、`Unavailable` 不写 accepted trace/outbox；`Duplicate` 必须回放 stored result/receipt；`Degraded` 不是 ready/healthy；`Unavailable` 不暴露 raw adapter error。

## 3. Command 协议清单

### 3.1 CMP-MS-01：intent / decision

| Command | IB | 输入必填 | 输出 | domain / port 构造链 |
|---|---|---|---|---|
| `AcceptHostIntentCommand` | `IB-MS-001` | `HostCommandMetadata`、`ProjectMemberRef`、`GlobalMemberRef`、`HostIntentSourceRef`、`HostIntentKey`、requested action、scope | `HostIntentRef` + acceptance/reason | `HostIntent::accept` -> `HostControlRepository.save_intent` |
| `DecideHostOrchestrationCommand` | `IB-MS-002` | metadata、accepted `HostIntentRef`、decision key、current host selector、control scope | `HostOrchestrationDecisionRef` + action/status | load intent/current -> `HostOrchestrationDecision::propose/commit` -> save |

规则：双锚、scope、source、actor 或 stable key 缺失时 `Rejected/Blocked`；decision commit 不表示 host established、container running 或 Runtime accepted。

### 3.2 CMP-MS-02：qualification / assembly

| Command | IB | 输入必填 | 输出 | positive ceiling |
|---|---|---|---|---|
| `ResolveHostQualificationCommand` | `IB-MS-004` | metadata、decision ref、host/generation target、双锚、environment requirement ref | `HostQualificationContextRef` + per-source status/gaps | `Resolved` 仅表示 source evaluation complete；exact Images/Sandbox/credential positive 仍 blocked |
| `CoordinateHostAssemblyCommand` | `IB-MS-005` | metadata、qualification ref、host/generation、required item set、environment ref | `HostAssemblyRef` + optional `HostReadinessDecisionRef` | `Complete` 不等于 `Ready`；缺 required item 不得 fallback |

### 3.3 CMP-MS-03：generation / action

| Command | 类型 | 输入必填 | 输出 | 写入边界 |
|---|---|---|---|---|
| `EstablishHostGenerationCommand` | internal | inherited actor/metadata、committed orchestration/recovery decision、current generation selector、双锚 | `HostRef` + `HostGeneration` | 只写 local Host/generation/current pointer；不创建 backend resource |
| `PrepareHostActionCommand` | internal | inherited actor/metadata、`HostActionDecisionRef`、host/generation、target refs、`ExternalEffectKey` | `HostActionAttemptRef` + `Prepared` | external call 前必须提交 attempt；不宣称 dispatch/success |

internal 只表示不可直接 transport 暴露，不弱化 actor、幂等、审计、generation 和 UoW。

### 3.4 CMP-MS-04：registration / session

| Command | IB | 输入必填 | 输出 | positive ceiling |
|---|---|---|---|---|
| `AcceptHostRegistrationCommandPlaceholder` | `IB-MS-007` | metadata、host/generation、双锚、registration fingerprint、Member registration safe ref、credential safe ref | registration ref + accepted/rejected/blocked | `MSVC-UP-002/006` 未闭合时只可 blocked/waiting |
| `MaintainHostSessionCommandPlaceholder` | `IB-MS-008` | metadata、accepted registration、safe endpoint ref、generation、optional Runtime association placeholder | endpoint/session refs + local status | 不创建 Runtime run；association 未闭合即 blocked/unknown |

### 3.5 CMP-MS-05/06：recovery / closure

| Command | IB | 输入必填 | 输出 | 写入边界 |
|---|---|---|---|---|
| `DecideHostRecoveryCommand` | `IB-MS-012` | metadata、host/generation、health assessment、failure ref、formal control context、recovery action | recovery decision ref + action/status | 只写 recovery decision；不执行 Runtime recovery |
| `CloseHostCommand` | `IB-MS-013` | metadata、host/generation、closure decision ref、current registration/session/association refs、closure scope | closure ref + invalidation/cleanup refs | local invalidation 与 cleanup attempt；不声明 external cleanup |

## 4. Query 协议清单

| Query | IB | 读取面 | 返回 | 禁止副作用 |
|---|---|---|---|---|
| `QueryCurrentHostDecision` | `IB-MS-003` | control repo、current host pointer、safe projection | decision safe slice + freshness/gap | 不创建/修改 decision |
| `QueryHostAssemblyReadiness` | `IB-MS-006` | qualification/assembly/readiness repo | per-axis safe slice | 不调用 resolver、不把 stale 修成 ready |
| `QueryHostAccessSession` | `IB-MS-009` | registration/endpoint/session repo | redacted session slice | 不接受注册、不刷新 endpoint |
| `QueryHostHealthFailure` | `IB-MS-011` | signal/assessment/failure/recovery repo | four-axis health + safe failure/recovery | 不重评估、不创建 recovery |
| `QuerySafeHostFacts` | `IB-MS-015` | projection/material/read repository | `SafeHostView` | 不 rebuild、repair 或 publish |
| `QueryHostHistory` | `IB-MS-015` | append-only history repository | history page + opaque public cursor | 不追加 history 或推断 current |

Query DTO 的 visibility、freshness、page cursor 只能由 authorized read assembly 产生；not-visible 不返回 domain object 或 external body。

## 5. Inbound Event Consumer 协议清单

| Consumer | 来源 | 本仓允许写入 | 不允许写入 |
|---|---|---|---|
| `QualificationSourceChangedConsumerPlaceholder` | Identity/Work/Images/credential/Sandbox/carrier | source safe snapshot、qualification stale marker、consumer receipt | core Host decision、ready、external body |
| `HostActionOutcomeConsumerPlaceholder` | carrier/registry/Sandbox feedback | matching action attempt、association、safe outcome | new attempt、current host replacement、external completion |
| `HostHealthSignalConsumerPlaceholder` | Member/Runtime/Sandbox/carrier signal | `HealthSignalSnapshot`、assessment-due marker | healthy/recovery/lifecycle decision |
| `HostCleanupFeedbackConsumerPlaceholder` | Sandbox/carrier/registry cleanup | matching cleanup attempt、residual/gap | cleanup complete、deletion truth、new action |
| `HostHandoffFeedbackConsumerPlaceholder` | Bus/Observability/authorized consumer | handoff feedback layer、gap/receipt | delivered/observed/accepted inference |

每个 consumer envelope 必须先验证 schema version、message identity、source、correlation、generation 和 body-free boundary；unsupported version 不解析 payload。

## 6. Outbound material event 协议

### 6.1 统一 material event carrier

```rust
/// Candidate event built only from a committed local material snapshot.
pub struct HostFactMaterialEventCandidate {
    pub material_ref: HostFactMaterialRef,
    pub change_ref: HostChangeRef,
    pub publication_key: PublicationKey,
    pub source_cursor: HostChangeCursor,
    pub safe_payload: HostSafeSlice,
    pub correlation_id: CorrelationId,
}
```

语义事件族按 material kind 区分：`intent/decision`、`qualification/assembly`、`host/progression`、`registration/session`、`health/recovery`、`closure/reconciliation`、`safe-fact/projection`。它们不是 Core event family 的 ready 宣告；`MSVC-UP-007` 未闭合前只保留候选名和 safe payload。

### 6.2 publication 状态层

| 层 | 本地记录 | 可推导 | 不可推导 |
|---|---|---|---|
| submitted | outbox/publisher submission attempt | local submit was recorded | delivered/observed/accepted |
| delivered | formal target feedback (pending) | target delivery claim if owner confirms | observed/accepted |
| observed | formal observation feedback (pending) | target observed claim | accepted |
| accepted | formal target acceptance feedback (pending) | target accepted claim | source truth mutation |

## 7. Operations Job 协议清单

| Job | 输入 | 允许写入 | 禁止事项 |
|---|---|---|---|
| `DispatchPendingHostActionsJob` | prepared attempt selector + job envelope | attempt dispatch/unknown marker | 创建 decision/generation、换 key 盲重放 |
| `EvaluateDueHostHealthJob` | accepted signal/current facts selector | assessment/failure record | 隐式 recovery decision |
| `ProgressPendingHostCleanupJob` | closure + cleanup selector | cleanup attempt marker | external cleanup complete |
| `ReconcileHostResidualsJob` | local facts + safe external summaries | finding/case/disposition | 修改 sibling/backend truth |
| `PublishHostFactOutboxJob` | outbox record + stored payload | submission marker/handoff record | 回查 current truth 组包 |
| `RebuildSafeHostProjectionJob` | committed source cursor + projection selector | projection state/view material | 反写 source truth |
| `ReconcileHostHandoffGapsJob` | handoff gap/unknown selector | stable-key retry marker/feedback link | 盲重放不可逆 action、声明 accepted |

Job input 的 scheduler/run id 只用于 job identity，不成为 Host lifecycle、formal intent 或 authorization。

## 8. DTO 构造闭环审计

| 协议族 | 必须存在的构造链 | 当前结论 |
|---|---|---|
| command | metadata + typed refs -> domain factory -> repository save -> public result | pass_with_upstream_blockers；exact upstream refs pending |
| query | metadata + visibility input -> read repository -> safe mapper -> view/page | pass；Query no-write |
| consumer | envelope -> identity/version validation -> safe mapper -> local snapshot/attempt -> receipt | pass_with_upstream_blockers |
| outbound | committed change -> material snapshot -> outbox record -> publisher input | pass_with_upstream_blockers |
| job | job envelope -> selector -> application job service -> stored report/disposition | pass_with_upstream_blockers |

必填字段缺失、generation 不匹配、subject 跨越、raw body/secret 出现、source cursor 不可确认时，构造失败并返回 body-free error；不得用默认值、缓存或 route 补齐。

## 9. 错误、幂等与 metadata 审计

- command/consumer/job 先 reserve idempotency，再执行 mutation；duplicate 必须回放 stored surface。
- query 不带 idempotency key；若 transport 强制提供，entry 必须忽略并记录结构性拒绝。
- error 只暴露 stable category、safe reason ref、correlation、retryability；raw adapter body、secret、endpoint、image manifest、signal body 禁止进入 DTO。
- `HostChangeCursor` 与 `CommittedChangeCursor` 的 exact type 继续 pending；协议不定义 alias 或隐式 conversion。
- event receipt、job report、command outcome 是本地 disposition，不代表 sibling 或 backend 完成。

## 10. 回填草稿

正式 03 §6~§7 只装配本文件的协议 inventory、公共 envelope、Command/Query/Consumer/Event/Job 约束、DTO 构造闭环和四层 publication 语义。完整字段表留在本校准文件，正式正文回指本文件，不复制未闭合 sibling schema。

## 11. Gate 与下一步

| 检查项 | 结果 |
|---|---|
| protocol inventory 覆盖 02 skeleton | pass |
| DTO 字段来源与构造闭环 | pass_with_upstream_blockers |
| metadata / idempotency / result replay | pass_with_upstream_blockers |
| query no-write / consumer write ceiling / job no-authorization | pass |
| outbound payload snapshot 与四层反馈 | pass_with_upstream_blockers |
| `MSVC-UP-001~008` | pending / blocked / fail-closed |
| 正式 03 写入 | forbidden until Step 19 |

```text
step_08_status = completed
step_08_gate = pass_with_upstream_blockers
next_allowed_step = Step 9 function_flows
formal_03_write_allowed = false_until_step_19
```
