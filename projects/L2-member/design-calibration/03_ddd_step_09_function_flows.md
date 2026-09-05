# Step 9. 定义逐接口函数级处理流

> 对应 SOP：详细设计讨论流程_SOP.md Step 9
> 回填位置：03-详细设计.md §8「逐接口函数级处理流」
> 参考粒度：projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md
> 生成日期：2026-08-31
> 当前状态：completed / pass_with_upstream_blockers / stop_review；Step 10 已由本轮新的“继续”授权并在独立中间产物中执行；本文件不承载 Step 10 正文。
> 正式正文：本 Step 不修改 03-详细设计.md。

> **阅读口径（canonical order）**：本文件曾按 100~300 行批次补写，故物理章节顺序不是协议族的语义顺序。协议分母、入口、结果和处理流的权威索引以 §21「处理流总表」为准，跨 flow 结论以 §22~§23 为准，最终门禁以 §27 为准；§6~§20 的每条 flow 均独立有效，不因物理位置改变其依赖或停审结论。该排版事实不构成实现或测试证据；Step 10 只读取本文件已完成的状态触发输入。

## 1. 本步目标、输入与边界

本步把 Step 8 已冻结的有限协议逐接口下沉为可以 1:1 落码的函数级处理流。每条 flow 都必须说明：

- public DTO 如何进入 named application service；
- DTO 字段如何构造或装配 Step 6 domain object / read view；
- Step 7 Port / Store 的读取面、写入面和版本来源；
- MemberDigestPort、MemberUnitOfWorkManager、MemberIdempotencyStore 与 typed stored-result replay 的位置；
- accepted、rejected、blocked、waiting、unknown、duplicate、conflict 的错误与结果映射；
- local state / history / trace / gap / projection marker 的副作用；
- 外部 handoff 只表达“已调用或结果未知”，不表达 accepted / delivered / observed；
- 每条 flow 的最小测试切口与独立停审结论。

### 1.1 输入

| 输入 | 用途 | 状态 |
|---|---|---|
| 03_ddd_step_05_module_contracts.md | 七个 CP 的实现主轴、依赖方向和 owner | 已完成 |
| 03_ddd_step_06_object_contracts.md | 对象字段、factory、transition、状态 enum、不变量 | 已完成 |
| 03_ddd_step_07_trait_port_adapter_contracts.md | application Port、Store、resolver、handoff、UoW、idempotency、result | 已完成 |
| 03_ddd_step_08_protocol_contracts.md | 10 Command、16 Query、14 Consumer、24 semantic candidate、5 Job 的 DTO / result | 已完成 |
| 02_hld_step_08_processing_flows.md | CP01~CP07 概要处理流和 no-write / no-repair 边界 | 已完成 |
| standards/document/详细设计讨论流程_SOP.md §Step 9 | 本步问题、固定输出和门禁 | 已读取 |
| standards/document/详细设计书写规范.md §5.8 | 单 flow 结构与伪代码要求 | 已读取 |

### 1.2 本步不做的事

本文件不定义 SQL / DDL、物理数据库、HTTP/RPC/UDS/topic、具体 outbox schema、调度器、重试参数、配置 key、实现 commit、测试报告或运行证据。以下内容继续留在上游 blocker 或后续 Step：

- L2M-UP-001~008 未关闭的上游 owner / carrier / source seam；
- L2M-UP-005 未关闭前的 24 个 outbound event candidate；
- Runtime loop、context、plan、outcome、LLM、memory、checkpoint、tool execution、capability registry；
- container/image lifecycle、sandbox truth、governance approval truth、conversation truth、observability backend。

## 2. SOP 问题回答

| 问题 | 本步结论 |
|---|---|
| 哪些协议必须有独立 flow？ | 10 Command、16 Query、14 Consumer、5 Job 全部独立；24 event 仅做逐项 blocked candidate 记录。 |
| 如何分批？ | 9.0 shared discipline；9.1 Command；9.2 Query；9.3 Consumer；9.4 event candidates；9.5 Job；9.6 cross-flow audit。 |
| 入口函数是什么？ | 只使用 Step 8 的 exact named service method；entry 不重新解析 name，也不使用字符串路由。 |
| DTO 在哪里转对象？ | application service 先校验 trusted refs / source，再由 Step 6 factory 或 read-model builder 构造；缺字段立即返回 typed rejection / blocked。 |
| Port 是否足够？ | 逐 flow 只调用 Step 7 已定义的 Port；若 owner contract 未闭合，显式返回 BlockedDependency，不临时发明 Port。 |
| 事务在哪里？ | 所有 non-query fresh path 由一个 logical local UoW 包住 reservation、local facts、typed result / receipt / report；query 全程 no-write。跨 external side effect 使用 local attempt + side-effect fence。 |
| duplicate 如何处理？ | reserve 返回 matching duplicate 时，只调用对应 typed getter；不得重跑 domain、resolver、handoff 或 projection。 |
| 状态和事件如何表达？ | 只追加本仓拥有的 revision / attempt / gap / projection fact；24 semantic candidates 不能生成 envelope、payload、route、outbox 或 delivery claim。 |
| 每条 flow 何时停审？ | DTO 构造、对象方法、Port、version、UoW、错误、state/effect、测试七项齐全后，标记 pass_with_open_blockers 或 pass。 |

## 3. 分批计划与完成门禁

| 批次 | 覆盖 | 状态 | 停审要求 |
|---|---|---|---|
| 9.0 | shared templates、协议分母、全局红线 | completed | 模板不允许掩盖单 flow 细节 |
| 9.1 | 10 Command（CP01/02/03/06） | completed / pass_with_upstream_blockers | 每条 command 独立停审 |
| 9.2 | 16 Query（CP01~07） | completed / no-write | 每条 query 证明 no-write |
| 9.3 | 14 Consumer（10 external + 4 committed-fact） | completed / pass_with_upstream_blockers | 每条 receipt 可 typed replay |
| 9.4 | 24 semantic outbound candidates | completed / blocked by L2M-UP-005 | 全部 blocked by L2M-UP-005 |
| 9.5 | 5 Operations Job | completed / pass_with_upstream_blockers | report 可 typed replay、不得修复 source truth |
| 9.6 | 跨 flow audit、回填草稿、Step 10 handoff | completed / stop-review | 已完成并移交 Step 10 |

## 4. Flow inventory

### 4.1 Command inventory（10）

| # | Flow | 协议 DTO | 所属模块 | 目标对象 / 结果 | exact service method |
|---:|---|---|---|---|---|
| 1 | AdmitMemberStartupFlow | AdmitMemberStartupBody | CP01 Presence | StartupAdmission | admit_member_startup |
| 2 | EstablishMemberPresenceFlow | EstablishMemberPresenceBody | CP01 Presence | MemberPresence | establish_member_presence |
| 3 | TransitionMemberPresenceFlow | TransitionMemberPresenceBody | CP01 Presence | MemberPresence successor | transition_member_presence |
| 4 | PrepareHostCollaborationFlow | PrepareHostCollaborationBody | CP01 Host | material + attempt | prepare_host_collaboration |
| 5 | EstablishSubscriptionScopeFlow | EstablishSubscriptionScopeBody | CP02 Inbound | SubscriptionScopeDecision | establish_subscription_scope |
| 6 | ReplaceSubscriptionScopeFlow | ReplaceSubscriptionScopeBody | CP02 Inbound | scope successor | replace_subscription_scope |
| 7 | SubmitScreenedFactToRuntimeFlow | SubmitScreenedFactToRuntimeBody | CP03 Runtime | decision + attempt | submit_screened_fact_to_runtime |
| 8 | LinkRuntimeAdmissionResultFlow | LinkRuntimeAdmissionResultBody | CP03 Runtime | RuntimeResultLink | link_runtime_admission_result |
| 9 | ResolveExternalContextFlow | ResolveExternalContextBody | CP06 Mirror | snapshot + resolution | resolve_external_context |
| 10 | RequestExternalContextRefreshFlow | RequestExternalContextRefreshBody | CP06 Mirror | refresh relation / gap | request_external_context_refresh |

### 4.2 Query inventory（16）

GetMemberPresence、GetHostCollaborationPosture、GetCurrentSubscriptionScope、GetScreeningDisposition、GetRuntimeMediationPosture、GetRuntimeMaterialReception、GetOutboundDecision、GetPublicationPosture、GetInteractionTrace、ListInteractionGaps、GetObservationPosture、GetExternalContextResolution、ListExternalContextGaps、GetMemberSummary、GetCapabilityOutlet、GetMemberDiagnostics。

### 4.3 Consumer inventory（14）

HostFeedbackConsumer、InboundFactConsumer、RuntimeMaterialConsumer、DeliveryFeedbackConsumer、ObservationFeedbackConsumer、SubjectIdentityContextUpdateConsumer、PolicyContextUpdateConsumer、RuntimeBoundaryContextUpdateConsumer、CapabilityContextUpdateConsumer、HostRouteContextUpdateConsumer、RuntimeMaterialReceptionConsumer、MemberCommittedFactConsumer、MemberProjectionUpdateConsumer、CapabilityOutletSourceUpdateConsumer。

### 4.4 Job inventory（5）

PublicationRelay、ObservationRelay、ExternalContextRefresh、MemberProjectionRebuild、GapReconciliation。

## 5. Shared flow discipline

### 5.1 Non-query fresh path

~~~text
[typed entry DTO]
  | validate double anchor + metadata + schema
  v
[named application service]
  | MemberDigestPort::request_digest
  | MemberUnitOfWorkManager::begin
  | MemberIdempotencyStore::reserve
  v
[domain / local Store]
  | load Versioned<T>
  | call Step 6 factory or successor method
  | append local fact / attempt / gap
  v
[external seam when explicitly allowed]
  | local attempt first
  | call named Port
  | save submitted / unknown successor
  v
[typed result / receipt / report]
  | save typed carrier
  | complete idempotency
  | commit
~~~

关键说明：

- Reserved 不是 accepted；只有 typed local result commit 后才返回 Accepted。
- Duplicate 只回放同 kind、同 operation、同 digest 的完整 stored carrier。
- external Submitted 只表示 member 侧调用已记录；Accepted、Delivered、Observed 必须由正式 owner feedback 提供。
- local event candidates 只能从 committed fact 派生；L2M-UP-005 关闭前不写 outbox。

### 5.2 Query no-write path

~~~text
[typed query DTO]
  | validate actor / subject / selector
  v
[named query service]
  | context.assert_query_no_write()
  | read visibility basis
  | read Store / projection / trace
  v
[response assembler]
  | Visible / NotVisible / NotReady / Stale / Degraded / NotAvailable / Empty
~~~

Query 禁止 digest、idempotency reserve、stored-result write、refresh、rebuild、reconcile、handoff、append、successor save；读取失败只映射为安全的 NotAvailable 或 typed issue。

### 5.3 Consumer fresh / duplicate path

~~~text
[event envelope + typed input]
  | source/schema/body gate
  v
[owner-specific consumer service]
  | digest -> begin -> reserve
  | duplicate -> get_consumer_receipt only
  v
[local incorporation]
  | snapshot / feedback link / gap / projection marker
  | save typed receipt -> complete -> commit
~~~

external body 在 worker boundary 完成 inspection 后只传 TransientInspectionMarker 或 body-free refs；consumer 不保存 raw body、不修改其他 owner truth。

### 5.4 Job fresh / duplicate path

Job 先读取有限 input refs，再 reserve；fresh path 只形成本仓 continuation、attempt successor、snapshot/resolution、projection 或 reconciliation report。Duplicate 只读取 get_job_report，不能重新 handoff、resolver、扫描或 rebuild。

### 5.5 统一错误映射

| 底层情况 | application / public 映射 | 是否回滚 |
|---|---|---|
| entry DTO / anchor / schema 不合法 | Rejected(InvalidContext | ContractViolation) | 未开始 UoW |
| required owner contract 缺失 | Blocked(BlockedDependency) | fresh relation 需保存 rejection 时提交；否则回滚 |
| Store missing | NotAvailable（Query）或 Rejected/Blocked（write） | write 回滚 |
| expected version 冲突 | Conflict | 标记 conflict 后提交 reservation；不得覆盖 |
| duplicate carrier 命中 | DuplicateReplayed | 读回 carrier；不执行 mutation |
| external seam unknown | Unknown(UnknownSideEffect) | 保存 unknown successor + gap 后提交 |
| source feedback 尚未到 | Waiting(WaitingForSource) | 保存 waiting receipt / gap 后提交 |
| stored carrier 缺失 / kind 错配 | StoredResultUnavailable | fail closed；不重建 |

### 5.6 依赖分类

| 依赖类别 | 本步允许 | 典型例子 |
|---|---|---|
| compile-time | 仅已确认的 Core contract 类型 | core metadata / typed refs |
| runtime Port | application trait 的调用 | RuntimeEntryPort、PublicationHandoffPort |
| event collaboration | 已提交事实的逻辑 envelope | 14 Consumer；不伪装 package dependency |
| reference | owner-specific resolver / read Port | CP06 context resolution |
| adapter / fake | infra 实现 slot | durable / in-memory parity；不改变 flow 语义 |

### 5.7 伪代码中的 application-local orchestration helpers

为保持每条 flow 的调用顺序可读，伪代码使用少量不对外暴露的 application helper。它们不是新增 Port、不是 generic dispatcher，也不拥有 source truth；实现时必须展开为下表列出的已收稳 Port / object 方法。

| helper | 仅允许展开为 | 禁止含义 |
|---|---|---|
| replay_command / replay_consumer / replay_job_report | 对应 typed getter：get_command_result / get_command_rejection / get_consumer_receipt / get_job_report | 不从 current truth、shell、fake map 重建 carrier |
| save_command_result / reject_and_store / conflict_and_store | application-local 装配 `MemberStoredResultRelationExpectation`、`StoredMemberOperationResult` shell 与完整 typed carrier，再调用 `MemberStoredResultStore::save_command_result` / `save_command_rejection`；同一 UoW | 不把 result surface 当完整 carrier，不新增 Port |
| complete_reserved | application-local helper；接收 fresh `record_ref`，在同一 UoW 调用 `MemberIdempotencyStore::get_with_version(record_ref, uow)` 取得 `MemberStoreVersion`，再调用 exact `MemberIdempotencyStore::complete(record_ref, result_ref, expected_version, uow)` | 不使用 reservation 的旧/推导版本，不新增 completion Port |
| reserved_record_ref | application-local 校验 helper；仅从 `MemberIdempotencyReservation::Reserved { record_ref }` 提取 fresh record ref | 不从 `Duplicate`、`InFlight`、`Conflict` 或 result ref 推导 fresh record |
| save_consumer_receipt | application-local 装配 `MemberStoredResultRelationExpectation`、`StoredMemberOperationResult` shell 与完整 `MemberConsumerReceipt`，调用 `MemberStoredResultStore::save_consumer_receipt`；同一 UoW | 不保存 raw body、shell-only ref 或伪造 ack，不新增 Port |
| stored_results.save_job_report | application-local 装配 `MemberStoredResultRelationExpectation`、`StoredMemberOperationResult` shell 与完整 `MemberJobReport`，调用 `MemberStoredResultStore::save_job_report(relation, result_shell, report, uow)`；同一 UoW | 不把 report surface 当完整 carrier，不新增 Port |
| capture_or_gap / append_unavailable_resolution / append_blocked_resolution | ExternalContextSnapshot.capture、ExternalContextResolution.resolve、ExternalContextGap.open + MirrorStore append | 不创建默认 Resolved |
| persist_gap_successor_or_new | ExternalContextMirrorStore.append_gap 或 save_gap_successor(expected_version, uow) | 不 reload / merge / 删除旧 gap |
| list_prepared_* / load_states_for_rebuild | Step 7 已定义的 list_prepared_attempts(page)、list_prepared_observation_attempts(page)、find_projection_state_with_version（按固定 projection kind 枚举） | 不新增 Store 扫描面 |
| append_view / rebuild_view_for_kind | MemberSummaryView.rebuild、CapabilityOutletView.project、MemberDiagnosticView.rebuild + 对应 append_* view | 不修改 source truth |
| affected_* / load_committed_successors | `list_projection_states_affected_by_*`、`MemberFactReadPort::load_committed_fact` 及固定 typed successor read | 不以字符串或任意 ref 猜 affected state，不新增扫描面 |
| versions_match / next_*_revision | application 从 Versioned<T> 与明确 revision policy 派生 | 不以 timestamp、cursor、watermark 替代 Store version |

技术 Port 的完整参数（record_ref、expected_version、StoredMemberOperationResult shell 等）在实现中必须按 Step 7 签名补齐；本文件省略的只是局部装配噪声，不改变调用语义。

#### 5.7.1 stored-result helper 的最小展开

以下伪代码是本文件所有 `save_command_result`、`reject_and_store`、`conflict_and_store`、`blocked_and_store_command`、`save_consumer_receipt` 与 `save_job_report` 调用的唯一展开口径。`relation`、`result_shell` 和完整 typed carrier 必须在同一 logical UoW 中构造并保存；helper 只是 application-local orchestration，不是新增 Port。

```rust
// Command accepted / conservative value path.
let result_id = id_generator.new_stored_member_operation_result_id();
let result_ref = MemberOperationResultRef {
    operation_name: context.operation_name.clone(),
    result_id: result_id.clone(),
};
let relation = MemberStoredResultRelationExpectation {
    record_ref: record_ref.clone(),
    result_ref: result_ref.clone(),
    channel: context.channel.clone(),
    operation_name: context.operation_name.clone(),
    request_digest: digest.clone(),
    result_kind: MemberStoredResultKind::CommandResult,
};
let result_shell = StoredMemberOperationResult::from_surface(
    result_id,
    context.operation_name.clone(),
    MemberStoredResultKind::CommandResult,
    MemberStoredResultSurfaceRef(id_generator.new_member_stored_result_surface_id()),
    context.trace_id.clone(),
)?;
let saved_ref = stored_results
    .save_command_result(relation, result_shell, typed_command_value, &*uow)
    .await?;
assert_eq!(saved_ref, result_ref);
```

`reject_and_store`、`conflict_and_store` 与 `blocked_and_store_command` 使用同一组字段，但 `result_kind` 必须为 `CommandRejection`，carrier 必须是完整 `MemberCommandRejection`；它们随后调用 `complete_reserved(&idempotency, record_ref, saved_ref, &*uow)` 并由当前 flow commit。入口尚未形成合法 context 的拒绝不创建 reservation，也不调用这些 helper。

Consumer receipt 的展开只替换 `result_kind` 为 `ConsumerReceipt`，并传入该 Consumer 的完整 `MemberConsumerReceipt`（含 exact `MemberConsumerReceiptDetail`、source identity、disposition 与 issues）；不得传 `receipt_ref`、shell、局部 ID 或空 detail：

```rust
let saved_ref = save_consumer_receipt(
    &context,
    digest.clone(),
    &reservation,
    receipt, // complete typed MemberConsumerReceipt assembled from this flow's local outcome
    &*uow,
).await?;
complete_reserved(&idempotency, record_ref.clone(), saved_ref, &*uow).await?;
```

Job report 的展开必须保留 `JobReport` kind、完整 `MemberJobReport` 和 shell / relation 的一一对应关系；`MemberJobReport` 本身没有 `result_ref()`，result ref 由 application 生成并同时写入 relation 与 shell：

```rust
let result_id = id_generator.new_stored_member_operation_result_id();
let result_ref = MemberOperationResultRef {
    operation_name: context.operation_name.clone(),
    result_id: result_id.clone(),
};
let relation = MemberStoredResultRelationExpectation {
    record_ref: record_ref.clone(),
    result_ref: result_ref.clone(),
    channel: context.channel.clone(),
    operation_name: context.operation_name.clone(),
    request_digest: digest.clone(),
    result_kind: MemberStoredResultKind::JobReport,
};
let result_shell = StoredMemberOperationResult::from_surface(
    result_id,
    context.operation_name.clone(),
    MemberStoredResultKind::JobReport,
    MemberStoredResultSurfaceRef(id_generator.new_member_stored_result_surface_id()),
    context.trace_id.clone(),
)?;
let saved_ref = stored_results
    .save_job_report(relation, result_shell, report, &*uow)
    .await?;
assert_eq!(saved_ref, result_ref);
complete_reserved(&idempotency, record_ref, saved_ref, &*uow).await?;
```

这里的 `typed_command_value`、`receipt` 和 `report` 都是当前 flow 已按 Step 8 枚举构造的完整 carrier；它们不是开放泛型 payload。`assert_eq!` 表达的是 Store 返回的 exact relation pointer 校验，实际错误映射仍留 Step 12。

### 5.8 technical Port 展开规则

伪代码中的简写必须按以下固定展开，不得由实现者自由选择另一种顺序：

~~~rust
let digest = MemberDigestPort::request_digest(&context, &canonical_input)?;
let uow = MemberUnitOfWorkManager::begin().await?;
let reservation = MemberIdempotencyStore::reserve(&context, digest, &*uow).await?;
// Duplicate: MemberStoredResultStore::get_<matching_kind>(relation)
// Fresh: save_<matching_kind>(relation, result_shell, typed_carrier, &*uow)
let record_ref = reserved_record_ref(&reservation)?;
let result_ref = saved_result_ref;
complete_reserved(&idempotency, record_ref, result_ref, &*uow).await?;
MemberUnitOfWorkManager::commit(uow).await?;
~~~

```rust
/// Extracts the record reference of a fresh reservation; all other classifications are terminal for this path.
fn reserved_record_ref(
    reservation: &MemberIdempotencyReservation,
) -> Result<MemberIdempotencyRecordId, ApplicationError> {
    match reservation {
        MemberIdempotencyReservation::Reserved { record_ref } => Ok(record_ref.clone()),
        MemberIdempotencyReservation::Duplicate { .. }
        | MemberIdempotencyReservation::InFlight { .. }
        | MemberIdempotencyReservation::Conflict { .. } => Err(ApplicationError::ContractViolation {
            reason_category: SafeReasonCategory::reservation_classification_mismatch(),
        }),
    }
}

/// Completes only a fresh reservation after reading its staged store version in the same UoW.
async fn complete_reserved(
    idempotency: &dyn MemberIdempotencyStore,
    record_ref: MemberIdempotencyRecordId,
    result_ref: MemberOperationResultRef,
    uow: &dyn MemberUnitOfWork,
) -> Result<MemberIdempotencyRecordId, ApplicationError> {
    let staged = idempotency
        .get_with_version(record_ref.clone(), uow)
        .await
        .map_err(map_port)?
        .ok_or(ApplicationError::ContractViolation {
            reason_category: SafeReasonCategory::reservation_missing(),
        })?;
    let expected_version: MemberStoreVersion = staged.version;
    idempotency
        .complete(record_ref, result_ref, expected_version, uow)
        .await
        .map_err(map_port)
}
```

`complete_reserved`、`reserved_record_ref`、`save_command_result`、`reject_and_store`、`conflict_and_store`、`blocked_and_store_command`、`save_consumer_receipt`、`capture_or_gap`、`load_projection_states_by_fixed_kind`、`affected_*`、`load_committed_successors` 与 `stored_results.save_job_report` 均为 application-local orchestration helper，不是新增 Port。前者必须接收 fresh `record_ref` 并严格执行 `get_with_version` → exact `complete`；后者必须展开到 Step 7 已定义的 typed Store / read Port 和 Step 6 object method。`replay_command`、`replay_consumer`、`replay_job_report` 只能调用对应 get 方法并返回完整 carrier；若 reservation 为 Conflict / InFlight，不得调用 domain 或 external Port。save_* 的 relation 必须包含 operation name、channel、digest、source identity、result kind 和 shell ref；Query 不得构造这些 relation。

## 6. Command flows（9.1-a，CP01）

下列 command 均由 MemberApplicationFacade 的静态 selector 进入对应 named service。伪代码中的泛型 result 仅表示 Step 8 已穷举的 typed carrier，不允许开放 payload。

### 6.1 AdmitMemberStartupFlow

#### 6.1.1 入口与目标

- 协议 / DTO：AdmitMemberStartup / AdmitMemberStartupBody { subject, startup_context_ref, credential_ref }。
- 模块 / 对象：CP01 Presence；StartupAdmission、PresenceAdmissionPolicy。
- 入口：PresenceApplicationService::admit_member_startup(MemberOperationContext context, AdmitMemberStartupBody body)。
- Port：ProjectMemberSourcePort::resolve_project_member、IdentityAnchorSourcePort::resolve_global_member、StartupCredentialVerifierPort::verify_startup_credential、PresenceStore::append_admission；技术 Port 为 digest、UoW、idempotency、result、clock、id generator。
- DTO 映射：双锚和三个 ref 直接映射；source resolution set 由三个 named Port 汇总，admission_id / reason 由 application 派生。

#### 6.1.2 函数级调用图

~~~text
[AdmitMemberStartupBody]
  | call validate + request_digest
  v
[PresenceApplicationService.admit_member_startup]
  | call resolve_project_member / resolve_global_member / verify_startup_credential
  | tx begin + reserve
  v
[PresenceAdmissionPolicy + StartupAdmission.decide]
  | append admission + save typed result
  v
[MemberStoredResultStore + complete_reserved (exact idempotency.complete)]
  | commit
~~~

关键说明：

- credential verifier 只验证 ref，不返回或保存 credential material。
- source resolution 不等价于 authorization；policy 只产出 local admission disposition。
- append 的记录是本仓 startup fact；不创建 container / image / runtime。

#### 6.1.3 关键伪代码

~~~rust
async fn admit_member_startup(MemberOperationContext context, AdmitMemberStartupBody body) -> Result<MemberCommandApplicationResult<StartupAdmission>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::AdmitMemberStartup(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let project = project_source.resolve_project_member(body.subject.project_member_ref.clone(), context.external_scope()).await?;
    let identity = identity_source.resolve_global_member(body.subject.global_member_ref.clone(), context.external_scope()).await?;
    let credential = verify_optional_credential(body.credential_ref.clone(), body.startup_context_ref.clone(), body.subject.project_member_ref.clone()).await?;
    let resolutions = SourceResolutionSet::from(project, identity, credential)?;
    let disposition = admission_policy.evaluate(&body.subject.project_member_ref, &body.subject.global_member_ref, &body.startup_context_ref, body.credential_ref.as_ref(), &resolutions);
    let admission = StartupAdmission::decide(id_generator.new_startup_admission_id(), body.subject.project_member_ref, body.subject.global_member_ref, body.startup_context_ref, body.credential_ref, resolutions.refs(), resolutions, &admission_policy, safe_reason(disposition))?;
    presence_store.append_admission(admission.clone(), &*uow).await?;
    let result_ref = save_command_result(&context, digest, &reservation, admission.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(admission))
}
~~~

#### 6.1.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | begin 在 source gate 后、reserve 前；accepted / rejected admission、stored carrier、complete 同一 UoW；commit 失败返回 Unknown。 |
| 错误 | 双锚或 ref 不合法 -> Rejected/InvalidContext；任一 required resolution 缺失 -> Blocked/BlockedDependency；domain invariant -> Rejected/ContractViolation。 |
| 状态 | StartupAdmissionDisposition 为 Accepted / Rejected / Blocked；仅 Accepted 可被后续 EstablishMemberPresence 使用。 |
| local effect | append admission、typed trace candidate、projection stale marker（若本地 projection 已初始化）；不写 event envelope / outbox。 |

#### 6.1.5 测试切口

双锚不匹配、credential optional / invalid、missing source fail-closed、policy 三态、duplicate typed replay、version / commit failure、无 image/runtime side effect。

#### 6.1.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | SourceResolutionSet 为 named source 汇总；无 raw body |
| object method | pass | StartupAdmission.decide、PresenceAdmissionPolicy.evaluate |
| Port / version | pass | 仅 Step 7 CP01 与 technical Port |
| transaction / replay | pass | reserve → append/result → complete → commit |
| state / effect / tests | pass_with_open_blockers | L2M-UP-006/007/008 仍影响 resolution 具体性 |

### 6.2 EstablishMemberPresenceFlow

#### 6.2.1 入口与目标

- 协议 / DTO：EstablishMemberPresence / EstablishMemberPresenceBody { subject, startup_admission_id, start_context }。
- 模块 / 对象：CP01 Presence；StartupAdmission、MemberPresence。
- 入口：PresenceApplicationService::establish_member_presence(MemberOperationContext context, EstablishMemberPresenceBody body)。
- Port：PresenceStore::get_admission_with_version、append_presence；technical digest/UoW/idempotency/result/clock/id generator。
- DTO 映射：admission_id 读取已提交 admission；start_context 直接进入 MemberPresence::start_from；presence_id、initial_revision 由 application 分配。

#### 6.2.2 函数级调用图

~~~text
[EstablishMemberPresenceBody]
  | call request_digest + begin + reserve
  v
[PresenceStore.get_admission_with_version]
  | guard admission.permits_presence + subject match
  v
[MemberPresence.start_from]
  | append presence + stored result
  v
[complete_reserved (exact idempotency.complete) + commit]
~~~

关键说明：

- 不从 startup_context_ref 直接假设 admission accepted。
- presence 的 Ready 只表示 member-local prerequisites，不表示 host / Runtime ready。

#### 6.2.3 关键伪代码

~~~rust
async fn establish_member_presence(MemberOperationContext context, EstablishMemberPresenceBody body) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::EstablishMemberPresence(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let admission = presence_store.get_admission_with_version(body.startup_admission_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    if !admission.value.matches_subject(&body.subject.project_member_ref, &body.subject.global_member_ref) || !admission.value.permits_presence() {
        return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::ContractViolation, &*uow).await;
    }
    let presence = MemberPresence::start_from(admission.value, body.start_context, id_generator.new_member_presence_id(), next_presence_revision()).map_err(map_domain)?;
    presence_store.append_presence(presence.clone(), &*uow).await?;
    let result_ref = save_command_result(&context, digest, &reservation, presence.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(presence))
}
~~~

#### 6.2.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | admission read 可在 begin 前做 preliminary check；reservation、append、result、complete 必须同一 UoW。 |
| 错误 | admission missing -> NotAvailable/Blocked；非 Accepted -> Rejected；subject mismatch -> ContractViolation；append/version/commit failure -> rollback/Unknown。 |
| 状态 | MemberPresence 初始 Starting；后续 Ready/Degraded 只能由显式 transition flow。 |
| local effect | presence fact、trace candidate、CP07 stale marker；不得触发 host lifecycle 或 Runtime loop。 |

#### 6.2.5 测试切口

missing/rejected admission、双锚 mismatch、starting revision 来源、duplicate replay、append failure rollback、presence 不会自动 Ready。

#### 6.2.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | start_context 与 admission 完整构造 |
| object method | pass | MemberPresence.start_from |
| Port / version | pass | get_admission_with_version / append_presence |
| transaction / replay | pass | typed result 同 UoW |
| state / effect / tests | pass_with_open_blockers | L2M-UP-002 使宿主装配保持 pending |

### 6.3 TransitionMemberPresenceFlow

#### 6.3.1 入口与目标

- 协议 / DTO：TransitionMemberPresence / TransitionMemberPresenceBody { subject, presence_id, target_status, reason, expected_revision }。
- 模块 / 对象：CP01 Presence；MemberPresence。
- 入口：PresenceApplicationService::transition_member_presence(MemberOperationContext context, TransitionMemberPresenceBody body)。
- Port：PresenceStore::get_presence_with_version、save_presence_successor；technical digest/UoW/idempotency/result/clock。
- DTO 映射：target_status/reason 进入 transition_to；expected_revision 与 Store version 双重校验，不能互换；next_revision 由 application 递增。

#### 6.3.2 函数级调用图

~~~text
[TransitionMemberPresenceBody]
  | digest + begin + reserve
  v
[PresenceStore.get_presence_with_version]
  | compare expected_revision and MemberStoreVersion
  v
[MemberPresence.transition_to]
  | save_presence_successor(expected_version)
  v
[stored result + complete + commit]
~~~

关键说明：

- status 只能由显式 command 改变；heartbeat、host feedback、query 不得隐式迁移。
- Terminated 为终态；重新在场必须新 admission 链。

#### 6.3.3 关键伪代码

~~~rust
async fn transition_member_presence(MemberOperationContext context, TransitionMemberPresenceBody body) -> Result<MemberCommandApplicationResult<MemberPresence>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::TransitionMemberPresence(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let current = presence_store.get_presence_with_version(body.presence_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    if !current.value.matches_subject(&body.subject.project_member_ref, &body.subject.global_member_ref) { return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::ContractViolation, &*uow).await; }
    if !versions_match(body.expected_revision, current.version) { return conflict_and_store(&context, digest, &reservation, &*uow).await; }
    let successor = current.value.transition_to(body.target_status, PresenceTransitionReason(body.reason), next_presence_revision()).map_err(map_domain)?;
    presence_store.save_presence_successor(successor.clone(), current.version, &*uow).await?;
    let result_ref = save_command_result(&context, digest, &reservation, successor.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(successor))
}
~~~

#### 6.3.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | version conflict 不覆盖旧 revision；conflict relation 若已 reserve 则保存 typed rejection 后 commit。 |
| 错误 | missing -> NotAvailable；subject / target invalid -> ContractViolation；illegal transition -> Rejected；store conflict -> Conflict。 |
| 状态 | Starting/Ready/Degraded/Draining/Terminated/Unknown 只按 Step 6 transition 规则；Unknown 不自动晋升。 |
| local effect | immutable successor、trace candidate、affected projection stale marker；不改 host/process truth。 |

#### 6.3.5 测试切口

每个合法 transition、非法 transition、expected revision conflict、Terminated fence、duplicate replay、save rollback、reason body-free。

#### 6.3.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | expected_revision 与 Store version 显式分离 |
| object method | pass | MemberPresence.transition_to |
| Port / version | pass | get/save successor |
| transaction / replay | pass | conflict 不重跑 |
| state / effect / tests | pass | 上游只保留 source blocker |

### 6.4 PrepareHostCollaborationFlow

#### 6.4.1 入口与目标

- 协议 / DTO：PrepareHostCollaboration / PrepareHostCollaborationBody { subject, presence_id, kind, purpose, safe_status_category }。
- 模块 / 对象：CP01 Host；HostCollaborationMaterial、HostCollaborationAttempt。
- 入口：HostCollaborationService::prepare_host_collaboration(MemberOperationContext context, PrepareHostCollaborationBody body)。
- Port：PresenceStore::get_presence_with_version、HostCollaborationStore::append_material、append_attempt；HostCollaborationPort 不在此准备命令调用，真正 handoff 留 relay / continuation。
- DTO 映射：kind/purpose/category 进入 Material::prepare；host boundary ref 仅在正式 source resolution 可用时才能构造 attempt。

#### 6.4.2 函数级调用图

~~~text
[PrepareHostCollaborationBody]
  | digest + begin + reserve
  v
[PresenceStore.get_presence_with_version]
  | HostCollaborationMaterial.prepare
  v
[HostCollaborationAttempt.prepare]
  | append material + append attempt
  v
[stored result + complete + commit]
~~~

关键说明：

- local-first 只制备 body-free material / attempt；不声称宿主已接受。
- L2M-UP-001/002 未闭合时 attempt 可以是 Blocked，不能伪造 HostBoundaryRef。

#### 6.4.3 关键伪代码

~~~rust
async fn prepare_host_collaboration(MemberOperationContext context, PrepareHostCollaborationBody body) -> Result<MemberCommandApplicationResult<HostCollaborationCommandValue>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::PrepareHostCollaboration(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let presence = presence_store.get_presence_with_version(body.presence_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    if !presence.value.matches_subject(&body.subject.project_member_ref, &body.subject.global_member_ref) || !presence.value.can_accept_inbound() { return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::ContractViolation, &*uow).await; }
    let material = HostCollaborationMaterial::prepare(id_generator.new_host_collaboration_material_id(), &presence.value, body.kind, body.purpose, body.safe_status_category, context.correlation()).map_err(map_domain)?;
    host_store.append_material(material.clone(), &*uow).await?;
    let boundary = resolve_host_boundary_ref_if_formally_resolved(&context, &presence.value).await?;
    let attempt = match boundary {
        Some(boundary_ref) => HostCollaborationAttempt::prepare(id_generator.new_host_collaboration_attempt_id(), &material, boundary_ref, context.idempotency_key()).map_err(map_domain)?,
        None => return blocked_and_store_command(&context, digest, &reservation, MemberProtocolErrorCode::BlockedDependency, &*uow).await,
    };
    host_store.append_attempt(attempt.clone(), &*uow).await?;
    let value = HostCollaborationCommandValue::from(material, attempt);
    let result_ref = save_command_result(&context, digest, &reservation, value.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(value))
}
~~~

#### 6.4.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | material、attempt、typed result、reservation completion 同一 UoW；没有 boundary 时保存 Blocked attempt。 |
| 错误 | non-accepting presence -> Rejected；host contract missing -> Blocked；material body gate failure -> ContractViolation；store conflict -> Conflict。 |
| 状态 | attempt Prepared 或 Blocked；Submitted 只由后续 handoff flow 产生，FeedbackLinked 只由 HostFeedbackConsumer 产生。 |
| local effect | append material / attempt、trace candidate、projection stale marker；不写 host health、session、lifecycle。 |

#### 6.4.5 测试切口

presence gate、kind/purpose mapping、body-free material、boundary missing blocked、duplicate replay、attempt status fence、host store rollback。

#### 6.4.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | material 与 attempt 字段均有来源 |
| object method | pass_with_open_blockers | Blocked 构造沿用 Step 6 attempt policy，待上游 boundary |
| Port / version | pass | PresenceStore / HostCollaborationStore |
| transaction / replay | pass | local-first |
| state / effect / tests | pass_with_open_blockers | L2M-UP-001/002 阻塞正向 host seam |

## 7. Command flows（9.1-b，CP02）

### 7.1 EstablishSubscriptionScopeFlow

#### 7.1.1 入口与目标

- 协议 / DTO：EstablishSubscriptionScope / EstablishSubscriptionScopeBody { subject, presence_id, scope, resolution_id }。
- 模块 / 对象：CP02 Inbound；MemberSubscriptionScope、SubscriptionScopeDecision、SubscriptionScopePolicy。
- 入口：SubscriptionScopeService::establish_subscription_scope(MemberOperationContext context, EstablishSubscriptionScopeBody body)。
- Port：PresenceStore::get_presence_with_version、SubscriptionScopeStore::get_scope_with_version / find_current_scope_with_version / append_scope、ExternalResolutionReadPort::get_resolution；technical digest/UoW/idempotency/result/clock/id generator。
- DTO 映射：scope 必须是 body-free MemberSubscriptionScope；resolution_id 读取 CP06 purpose=Screening 的 neutral resolution；revision 由 application 从 scope Store 的 current revision 分配。

#### 7.1.2 函数级调用图

~~~text
[EstablishSubscriptionScopeBody]
  | digest + begin + reserve
  v
[PresenceStore + ExternalResolutionReadPort]
  | SubscriptionScopePolicy.evaluate
  v
[SubscriptionScopeDecision.decide]
  | append_scope + stored result
  v
[complete + commit]
~~~

关键说明：

- 首个 scope 必须绑定当前 presence；没有合法 presence 或 resolution 时 fail closed。
- policy 只判断本仓 intake scope，不拥有 Governance policy truth。

#### 7.1.3 关键伪代码

~~~rust
async fn establish_subscription_scope(MemberOperationContext context, EstablishSubscriptionScopeBody body) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::EstablishSubscriptionScope(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let presence = presence_store.get_presence_with_version(body.presence_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let resolution = resolution_read.get_resolution(body.resolution_id.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    if !presence.value.matches_subject(&body.subject.project_member_ref, &body.subject.global_member_ref) || !resolution_supports_scope(&resolution.value, &body.scope, ExternalConsumerPurpose::Screening) {
        return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::BlockedDependency, &*uow).await;
    }
    let status = scope_policy.evaluate(&presence.value, &body.scope, &resolution.value);
    let decision = SubscriptionScopeDecision::decide(id_generator.new_subscription_scope_decision_id(), &presence.value, body.scope, &resolution.value, next_scope_revision(), &scope_policy, safe_reason(status)).map_err(map_domain)?;
    scope_store.append_scope(decision.clone(), &*uow).await?;
    let result_ref = save_command_result(&context, digest, &reservation, decision.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(decision))
}
~~~

#### 7.1.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | resolution / presence reads may be preflight; decision, stored result and completion share one UoW. |
| 错误 | no presence -> NotAvailable；resolution stale/conflict/unresolved -> Blocked；scope expansion / invalid body -> Rejected。 |
| 状态 | SubscriptionScopeStatus Active / Superseded / Rejected / Blocked；只有 Active 且 current 才能筛选。 |
| local effect | append decision、trace candidate、CP07 stale marker；不改变 external rule source。 |

#### 7.1.5 测试切口

首次 scope、resolution purpose mismatch、presence mismatch、scope expansion fail-closed、duplicate replay、revision allocation、store rollback。

#### 7.1.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | body-free scope + resolution 完整 |
| object method | pass | SubscriptionScopePolicy.evaluate / Decision.decide |
| Port / version | pass_with_open_blockers | CP06 resolution owner contract 仍 open |
| transaction / replay | pass | typed command carrier 同 UoW |
| state / effect / tests | pass_with_open_blockers | L2M-UP-006/007 |

### 7.2 ReplaceSubscriptionScopeFlow

#### 7.2.1 入口与目标

- 协议 / DTO：ReplaceSubscriptionScope / ReplaceSubscriptionScopeBody { subject, decision_id, expected_revision, scope, resolution_id }。
- 模块 / 对象：CP02 Inbound；SubscriptionScopeDecision、SubscriptionScopePolicy。
- 入口：SubscriptionScopeService::replace_subscription_scope(MemberOperationContext context, ReplaceSubscriptionScopeBody body)。
- Port：SubscriptionScopeStore::get_scope_with_version、find_current_scope_with_version、save_scope_successor；ExternalResolutionReadPort::get_resolution；technical Port。
- DTO 映射：expected_revision 只用于 application expected-version guard；new scope 与 resolution 进入 Decision.decide，旧 decision 只读并保留历史。

#### 7.2.2 函数级调用图

~~~text
[ReplaceSubscriptionScopeBody]
  | digest + begin + reserve
  v
[SubscriptionScopeStore.get_scope_with_version]
  | compare expected revision + read resolution
  v
[SubscriptionScopePolicy.prevents_scope_expansion + Decision.decide]
  | save_scope_successor(expected_version)
  v
[stored result + complete + commit]
~~~

关键说明：

- 不把 query cursor、source version 或 resolution id 当作 Store version。
- old decision 只能被 superseded，不能被原地改写或删除。

#### 7.2.3 关键伪代码

~~~rust
async fn replace_subscription_scope(MemberOperationContext context, ReplaceSubscriptionScopeBody body) -> Result<MemberCommandApplicationResult<SubscriptionScopeDecision>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::ReplaceSubscriptionScope(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let current = scope_store.get_scope_with_version(body.decision_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    if !versions_match(body.expected_revision, current.version) { return conflict_and_store(&context, digest, &reservation, &*uow).await; }
    let resolution = resolution_read.get_resolution(body.resolution_id.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    if scope_policy.prevents_scope_expansion(&current.value, &body.scope) { return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::ContractViolation, &*uow).await; }
    let presence = load_presence_for_scope(&current.value).await?;
    let successor = SubscriptionScopeDecision::decide(id_generator.new_subscription_scope_decision_id(), &presence, body.scope, &resolution.value, next_scope_revision(), &scope_policy, safe_reason(scope_policy.evaluate(&presence, &body.scope, &resolution.value))).map_err(map_domain)?;
    scope_store.save_scope_successor(successor.clone(), current.version, &*uow).await?;
    let result_ref = save_command_result(&context, digest, &reservation, successor.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(successor))
}
~~~

#### 7.2.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | current read + expected version guard + successor save + result completion in one logical write boundary. |
| 错误 | missing decision/resolution -> NotAvailable/Blocked；version mismatch -> Conflict；policy expansion -> Rejected。 |
| 状态 | old Active -> Superseded；new status may be Active / Rejected / Blocked；never silently preserve old scope. |
| local effect | successor, trace candidate, projection stale marker；不重写 inbound facts。 |

#### 7.2.5 测试切口

version conflict、scope narrowing、unauthorized expansion、resolution stale、duplicate replay、supersession chain、atomic rollback。

#### 7.2.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | expected revision / domain revision 分离 |
| object method | pass | prevents_scope_expansion / decide |
| Port / version | pass | get + save successor |
| transaction / replay | pass | conflict 不重跑 |
| state / effect / tests | pass_with_open_blockers | L2M-UP-006/007 |

## 8. Command flows（9.1-c，CP03）

### 8.1 SubmitScreenedFactToRuntimeFlow

#### 8.1.1 入口与目标

- 协议 / DTO：SubmitScreenedFactToRuntime / SubmitScreenedFactToRuntimeBody { subject, screening_id, inbound_fact_id, runtime_boundary_ref, resolution_id }。
- 模块 / 对象：CP03 Runtime；RuntimeDeliveryDecision、RuntimeSubmissionAttempt、RuntimeMediationPolicy。
- 入口：RuntimeMediationService::submit_screened_fact_to_runtime(MemberOperationContext context, SubmitScreenedFactToRuntimeBody body)。
- Port：InboundStore::get_inbound_with_version、get_screening_with_version；RuntimeMediationStore::append_delivery_decision / append_submission_attempt / save_attempt_successor；ExternalResolutionReadPort::get_resolution；RuntimeContractResolverPort::resolve_runtime_entry；RuntimeEntryPort::submit。
- DTO 映射：screening + inbound 读取为 domain inputs；runtime_boundary_ref 与 resolution_id 必须 exact match；attempt id / digest / correlation 由 application 生成。

#### 8.1.2 函数级调用图

~~~text
[SubmitScreenedFactToRuntimeBody]
  | digest + begin + reserve
  v
[InboundStore + ResolutionRead + Runtime policy]
  | RuntimeDeliveryDecision.decide
  | RuntimeSubmissionAttempt.prepare
  v
[RuntimeMediationStore append]
  | RuntimeEntryPort.submit (external seam)
  v
[save attempt successor Submitted/Unknown + result + commit]
~~~

关键说明：

- local decision 与 prepared attempt 必须先提交 / stage，再调用 Runtime seam。
- Runtime port 的 returned ref 只可形成 Submitted；异常或不可证明结果形成 Unknown + fence，不能自动重试。

#### 8.1.3 关键伪代码

~~~rust
async fn submit_screened_fact_to_runtime(MemberOperationContext context, SubmitScreenedFactToRuntimeBody body) -> Result<MemberCommandApplicationResult<RuntimeDeliveryCommandValue>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::SubmitScreenedFactToRuntime(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let screening = inbound_store.get_screening_with_version(body.screening_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let inbound = inbound_store.get_inbound_with_version(body.inbound_fact_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    if !screening.value.matches_fact(&inbound.value) || !screening.value.permits_runtime_delivery() { return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::ContractViolation, &*uow).await; }
    let resolution = resolution_read.get_resolution(body.resolution_id.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    let decision = RuntimeDeliveryDecision::decide(id_generator.new_runtime_delivery_decision_id(), &screening.value, &inbound.value, body.runtime_boundary_ref.clone(), &resolution.value, &runtime_policy).map_err(map_domain)?;
    runtime_store.append_delivery_decision(decision.clone(), &*uow).await?;
    let attempt = RuntimeSubmissionAttempt::prepare(id_generator.new_runtime_submission_attempt_id(), &decision, context.idempotency_key()).map_err(map_domain)?;
    runtime_store.append_submission_attempt(attempt.clone(), &*uow).await?;
    let seam = runtime_entry.submit(MemberRuntimeSubmission::from_attempt(&attempt), context.idempotency_key(), context.trace_id()).await;
    let final_attempt = match seam {
        Ok(MemberExternalSeamOutcome::Submitted(submission_ref)) => attempt.mark_submitted(submission_ref, clock.now()).map_err(map_domain)?,
        Ok(MemberExternalSeamOutcome::Unknown(reason)) | Err(_) => attempt.mark_unknown(UnknownReason(reason_category(reason))).map_err(map_domain)?,
    };
    runtime_store.save_attempt_successor(final_attempt.clone(), attempt.store_version(), &*uow).await?;
    let value = RuntimeDeliveryCommandValue::from(decision, final_attempt);
    let result_ref = save_command_result(&context, digest, &reservation, value.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(value))
}
~~~

#### 8.1.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | decision / prepared attempt stage before seam; seam result successor, typed result and completion share local boundary. If commit after seam fails, return Unknown and retain fence via durable adapter contract. |
| 错误 | screening not passed -> Rejected；mapping absent/stale -> Blocked/Pending；Runtime submit unknown -> Unknown；Store version conflict -> Conflict。 |
| 状态 | RuntimeDeliveryDisposition Eligible/Rejected/Blocked/Pending；attempt Prepared -> Submitted or Unknown/Blocked；never Runtime run state. |
| local effect | decision + attempt successor + trace candidate / gap candidate；不创建 Runtime loop、plan、outcome。 |

#### 8.1.5 测试切口

screening mismatch、resolution purpose mismatch、prepared-before-submit ordering、port submitted/unknown、commit failure fence、duplicate no re-submit、attempt unknown blocks retry。

#### 8.1.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | inbound/screening/runtime mapping 完整 |
| object method | pass | RuntimeDeliveryDecision.decide / Attempt.prepare + successor |
| Port / version | pass_with_open_blockers | L2M-UP-003/004 |
| transaction / replay | pass_with_open_blockers | external seam 后 commit failure 必须由 infra 保证 fence |
| state / effect / tests | pass | 不越界 Runtime truth |

### 8.2 LinkRuntimeAdmissionResultFlow

#### 8.2.1 入口与目标

- 协议 / DTO：LinkRuntimeAdmissionResult / LinkRuntimeAdmissionResultBody { subject, attempt_id, admission_ref, classification, source_ref }。
- 模块 / 对象：CP03 Runtime；RuntimeSubmissionAttempt、RuntimeResultLink。
- 入口：RuntimeMediationService::link_runtime_admission_result(MemberOperationContext context, LinkRuntimeAdmissionResultBody body)。
- Port：RuntimeMediationStore::get_submission_attempt_with_version、append_result_link、save_attempt_successor；RuntimeAdmissionResultSourcePort::resolve_admission_result；technical Port。
- DTO 映射：admission_ref/source_ref 先由 owner source Port 验证；classification 仅接受 formal result classification；late 结果只追加 link。

#### 8.2.2 函数级调用图

~~~text
[LinkRuntimeAdmissionResultBody]
  | digest + begin + reserve
  v
[RuntimeMediationStore.get_submission_attempt_with_version]
  | RuntimeAdmissionResultSourcePort.resolve_admission_result
  v
[RuntimeResultLink.link]
  | append link + Attempt.link_result
  v
[stored result + complete + commit]
~~~

关键说明：

- Port ack、时间或 result id 单独不能推导 Accepted。
- 已存在 ResultLinked / late link 不重跑 Runtime。

#### 8.2.3 关键伪代码

~~~rust
async fn link_runtime_admission_result(MemberOperationContext context, LinkRuntimeAdmissionResultBody body) -> Result<MemberCommandApplicationResult<RuntimeResultLink>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::LinkRuntimeAdmissionResult(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let attempt = runtime_store.get_submission_attempt_with_version(body.attempt_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let verified = result_source.resolve_admission_result(body.admission_ref.clone(), body.source_ref.clone()).await?;
    if !verified.matches_subject(&body.subject.project_member_ref, &body.subject.global_member_ref) { return reject_and_store(&context, digest, &reservation, MemberProtocolErrorCode::ContractViolation, &*uow).await; }
    let link = RuntimeResultLink::link(id_generator.new_runtime_result_link_id(), &attempt.value, body.admission_ref, body.classification, body.source_ref, clock.now()).map_err(map_domain)?;
    runtime_store.append_result_link(link.clone(), &*uow).await?;
    let successor = attempt.value.link_result(&link).map_err(map_domain)?;
    runtime_store.save_attempt_successor(successor, attempt.version, &*uow).await?;
    let result_ref = save_command_result(&context, digest, &reservation, link.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(link))
}
~~~

#### 8.2.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | source verification may be preflight; link, attempt successor, result and completion are atomic locally. |
| 错误 | attempt missing -> NotAvailable；source not formally verified -> Blocked/Waiting；mismatch -> ContractViolation；version conflict -> Conflict。 |
| 状态 | ResultClassification Accepted/Rejected/Waiting/Blocked/Unknown；attempt Submitted -> ResultLinked，late remains append-only link。 |
| local effect | result link、attempt successor、trace candidate；不改 Runtime admission / outcome。 |

#### 8.2.5 测试切口

formal source verification、late result、classification Unknown、attempt mismatch、duplicate replay、result link atomicity、version conflict。

#### 8.2.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | source/classification 映射闭合 |
| object method | pass | RuntimeResultLink.link / Attempt.link_result |
| Port / version | pass_with_open_blockers | L2M-UP-003/004 result source |
| transaction / replay | pass | link 不重跑 submit |
| state / effect / tests | pass | late 只追加 local link |

## 9. Command flows（9.1-d，CP06）

### 9.1 ResolveExternalContextFlow

#### 9.1.1 入口与目标

- 协议 / DTO：ResolveExternalContext / ResolveExternalContextBody { subject, source_ref, source_owner, context_kind, purpose, scope, freshness }。
- 模块 / 对象：CP06 ExternalContextMirror；ExternalContextSnapshot、ExternalContextResolution、MirrorResolutionPolicy。
- 入口：ExternalContextMirrorService::resolve_external_context(MemberOperationContext context, ResolveExternalContextBody body)。
- Port：owner-specific resolver（resolve_project_member_context、resolve_identity_anchor_context、resolve_credential_context、resolve_policy_context、resolve_runtime_context、resolve_tool_contract_context、resolve_method_definition_context、resolve_host_route_context）、ExternalContextMirrorStore::append_snapshot / append_resolution / append_gap；technical Port。
- DTO 映射：source_owner + context_kind + purpose 选择静态 resolver；owner safe output 转 safe_categories / freshness evidence；snapshot_id、resolution_id、captured_at 由 application 生成。

#### 9.1.2 函数级调用图

~~~text
[ResolveExternalContextBody]
  | validate owner/context/purpose/scope
  | digest + begin + reserve
  v
[owner-specific resolver]
  | ExternalContextSnapshot.capture
  | ExternalContextResolution.resolve
  v
[MirrorStore append snapshot + resolution or gap]
  | stored result + complete + commit
~~~

关键说明：

- resolver 只能返回 body-free safe surface；generic resolver、provider registry、raw policy/credential/runtime body 均禁止。
- resolver unavailable / stale / conflict 形成 resolution + gap，不伪造 Resolved。

#### 9.1.3 关键伪代码

~~~rust
async fn resolve_external_context(MemberOperationContext context, ResolveExternalContextBody body) -> Result<MemberCommandApplicationResult<ExternalContextCommandValue>, ApplicationError> {
    context.assert_command_scope()?;
    validate_owner_purpose(&body)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::ResolveExternalContext(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let safe = resolve_by_owner_specific_port(body.source_owner.clone(), body.source_ref.clone(), body.context_kind, body.scope.clone()).await;
    let now = clock.now();
    let value = match safe {
        Ok(output) if output.body_inspection().is_clean() => {
            let snapshot = ExternalContextSnapshot::capture(id_generator.new_external_context_snapshot_id(), body.source_ref.clone(), body.source_owner.clone(), body.context_kind, output.source_version(), output.source_digest(), body.scope.clone(), output.safe_categories(), output.freshness(), output.inspection(), now, &mirror_policy).map_err(map_domain)?;
            mirror_store.append_snapshot(snapshot.clone(), &*uow).await?;
            let resolution = ExternalContextResolution::resolve(id_generator.new_external_context_resolution_id(), body.source_ref, Some(&snapshot), body.purpose, body.scope, output.freshness(), now, &mirror_policy).map_err(map_domain)?;
            mirror_store.append_resolution(resolution.clone(), &*uow).await?;
            ExternalContextCommandValue::resolved(snapshot, resolution)
        }
        Ok(output) => append_blocked_resolution(body, output.reason(), &*uow).await?,
        Err(error) => append_unavailable_resolution(body, classify(error), &*uow).await?,
    };
    let result_ref = save_command_result(&context, digest, &reservation, value.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(value))
}
~~~

#### 9.1.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | resolver result is inspected before append; snapshot/resolution/gap, stored result and completion are one local boundary. |
| 错误 | owner mismatch / unsupported kind -> Rejected/ContractViolation；owner unavailable -> Unavailable + gap；stale/conflict -> corresponding resolution status；body not clean -> Blocked。 |
| 状态 | Resolution Resolved/Stale/Conflict/Unresolved/Unavailable/Unknown；gap Open/Blocked/Unknown。 |
| local effect | immutable snapshot + resolution or gap、trace candidate、projection stale marker；不写 owner truth或授权结果。 |

#### 9.1.5 测试切口

每个 owner-specific selector、body gate、purpose isolation、stale/conflict mapping、immutable IDs、duplicate replay、resolver unavailable、no raw body persistence。

#### 9.1.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass | safe output → snapshot/resolution |
| object method | pass | Snapshot.capture / Resolution.resolve |
| Port / version | pass_with_open_blockers | L2M-UP-001/003/004/006/007 |
| transaction / replay | pass | append + typed result atomic |
| state / effect / tests | pass | neutral resolution 不升格 |

### 9.2 RequestExternalContextRefreshFlow

#### 9.2.1 入口与目标

- 协议 / DTO：RequestExternalContextRefresh / RequestExternalContextRefreshBody { subject, source_ref, context_kind, purpose, scope, reason }。
- 模块 / 对象：CP06 ExternalContextMirror；ExternalContextGap、ExternalContextResolution。
- 入口：ExternalContextMirrorService::request_external_context_refresh(MemberOperationContext context, RequestExternalContextRefreshBody body)。
- Port：ExternalContextMirrorStore::get_resolution_with_version / list_open_gaps / append_gap / save_gap_successor；ExternalContextRefreshRequestPort::request_refresh；ExternalContextRefreshDispatchPort 不在同步 command 中执行长时 refresh；technical Port。
- DTO 映射：source/purpose/scope 显式形成 refresh relation；既有 gap 必须同 purpose/scope，缺 gap 时只能先记录 blocked/open relation，不从 Query stale 自行推断。

#### 9.2.2 函数级调用图

~~~text
[RequestExternalContextRefreshBody]
  | digest + begin + reserve
  v
[MirrorStore.get_resolution/list_open_gaps]
  | ExternalContextRefreshRequestPort.request_refresh
  v
[ExternalContextGap.request_refresh or Gap.open]
  | append/save successor + typed result
  v
[complete + commit]
~~~

关键说明：

- Command 只登记受控 refresh request；resolver / dispatch 在 ExternalContextRefresh Job。
- refresh request 不代表 source 已刷新、已授权或可用。

#### 9.2.3 关键伪代码

~~~rust
async fn request_external_context_refresh(MemberOperationContext context, RequestExternalContextRefreshBody body) -> Result<MemberCommandApplicationResult<ExternalRefreshCommandValue>, ApplicationError> {
    context.assert_command_scope()?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::RequestExternalContextRefresh(body.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_command(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let open_gaps = mirror_store.list_open_gaps(body.subject.project_member_ref.clone(), Some(body.purpose), page_for_relation()).await?;
    let gap = select_matching_gap(open_gaps, body.source_ref.clone(), body.context_kind, body.purpose, body.scope.clone());
    let request_ref = refresh_request_port.request_refresh(ExternalContextRefreshRequestInput::from_body(body.clone()), context.idempotency_key(), context.trace_id()).await?;
    let successor_or_new = match gap {
        Some(current) => current.value.request_refresh(request_ref.clone()).map_err(map_domain)?,
        None => ExternalContextGap::open(id_generator.new_external_context_gap_id(), Some(body.source_ref), body.context_kind, body.purpose, body.scope, None, ExternalContextGapCategory::Stale, ExternalContextGapStatus::ResolutionPending, body.reason, clock.now()).map_err(map_domain)?,
    };
    persist_gap_successor_or_new(successor_or_new.clone(), gap, &*uow).await?;
    let value = ExternalRefreshCommandValue::from(successor_or_new, request_ref);
    let result_ref = save_command_result(&context, digest, &reservation, value.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(accepted(value))
}
~~~

#### 9.2.4 事务、错误、状态与副作用

| 面 | 规则 |
|---|---|
| UoW | refresh relation, gap successor/new gap, typed result and reservation completion are atomic. |
| 错误 | purpose/scope mismatch -> ContractViolation；no formal request seam -> BlockedDependency；gap version conflict -> Conflict；dispatch failure not observed in this command。 |
| 状态 | gap Open/Blocked -> ResolutionPending；old gap remains immutable and points to successor。 |
| local effect | refresh request ref、gap successor、trace/projection candidate；不触发 resolver、不关闭 gap。 |

#### 9.2.5 测试切口

matching gap selection、no-gap blocked behavior、request-port unavailable、duplicate replay、successor version conflict、purpose isolation、no synchronous resolver。

#### 9.2.6 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO → object | pass_with_open_blockers | refresh request carrier depends on upstream seam |
| object method | pass | Gap.open / request_refresh |
| Port / version | pass | MirrorStore + refresh request Port |
| transaction / replay | pass | no long-running external call |
| state / effect / tests | pass_with_open_blockers | L2M-UP-001/005/006 |

## 10. Command batch 9.1 stop review

| Command | DTO/object/Port | UoW + replay | state/effect | tests | gate |
|---|---|---|---|---|---|
| AdmitMemberStartup | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| EstablishMemberPresence | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| TransitionMemberPresence | pass | pass | pass | pass | pass |
| PrepareHostCollaboration | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| EstablishSubscriptionScope | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| ReplaceSubscriptionScope | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| SubmitScreenedFactToRuntime | pass | pass_with_open_blockers | pass | pass | pass_with_open_blockers |
| LinkRuntimeAdmissionResult | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| ResolveExternalContext | pass | pass | pass_with_open_blockers | pass | pass_with_open_blockers |
| RequestExternalContextRefresh | pass_with_open_blockers | pass | pass_with_open_blockers | pass | pass_with_open_blockers |

批次结论：10 个 Command 均有独立入口、调用图、Rust 风格伪代码、对象构造、Port、事务、错误、状态 / effect、测试切口和停审记录；正向结论仍受 L2M-UP-001~008 限制。下一批进入 Query，Query 必须保持 no-write。

## 11. Query flows（9.2-a，CP01~CP03）

所有 Query 都在入口完成 visibility / selector 校验，然后调用 context.assert_query_no_write()。下列 flow 不调用 digest、reserve、任何 append / save、resolver、handoff、refresh、rebuild 或 reconcile。

### 11.1 GetMemberPresenceFlow

#### 11.1.1 入口与目标

- DTO：GetMemberPresenceBody { subject, consistency }；response：MemberQueryResponse<MemberPresenceReadSurface>。
- 模块 / 对象：CP01 Presence；MemberPresence、MemberProjectionState。
- 入口：MemberQueryService::get_member_presence(MemberOperationContext context, GetMemberPresenceBody body)。
- Port：PresenceStore::find_current_presence_with_version；ProjectionVisibilityBasisReadPort::read_visibility_basis；MemberProjectionStore::find_projection_state_with_version。

#### 11.1.2 调用图与伪代码

~~~text
[GetMemberPresenceBody] -> [get_member_presence]
  | query no-write + read visibility basis
  v
[PresenceStore.find_current_presence_with_version]
  | read projection state / assemble safe surface
  v
[Visible / NotVisible / NotReady / Stale / NotAvailable]
~~~

~~~rust
async fn get_member_presence(MemberOperationContext context, GetMemberPresenceBody body) -> Result<MemberQueryResponse<MemberPresenceReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Presence).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let presence = presence_store.find_current_presence_with_version(body.subject.project_member_ref.clone()).await?;
    let state = projection_store.find_projection_state_with_version(body.subject.project_member_ref, MemberProjectionKind::Summary).await?;
    Ok(assemble_presence_surface(presence, state, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写事务；Store unavailable -> NotAvailable；无 presence -> NotReady/NotAvailable；stale 只作为 marker 返回；不改变 presence。
测试切口：visibility denied、missing presence、stale marker、CurrentRequired not-ready、Store unavailable、query 无 reserve / write。
停审：DTO/Port/no-write = pass；presence state source = pass_with_open_blockers（L2M-UP-008）。

### 11.2 GetHostCollaborationPostureFlow

#### 11.2.1 入口与目标

- DTO：GetHostCollaborationPostureBody { subject, presence_id, page }；response：MemberPagedQueryResponse<HostCollaborationPostureView>。
- 模块 / 对象：CP01 Host；HostCollaborationAttempt、HostCollaborationMaterial。
- 入口：HostCollaborationService::get_host_collaboration_posture(MemberOperationContext context, GetHostCollaborationPostureBody body)。
- Port：PresenceStore::get_presence_with_version、HostCollaborationStore::list_attempts_by_presence；visibility basis read。

#### 11.2.2 调用图与伪代码

~~~text
[GetHostCollaborationPostureBody] -> [get_host_collaboration_posture]
  | no-write + host visibility
  v
[PresenceStore.get_presence_with_version]
  | HostCollaborationStore.list_attempts_by_presence
  v
[paged safe posture / empty / not-visible]
~~~

~~~rust
async fn get_host_collaboration_posture(MemberOperationContext context, GetHostCollaborationPostureBody body) -> Result<MemberPagedQueryResponse<HostCollaborationPostureView>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Host).await?;
    if !visibility.is_visible() { return Ok(not_visible_page()); }
    let presence = presence_store.get_presence_with_version(body.presence_id).await?.ok_or(ApplicationError::NotAvailable)?;
    let page = host_store.list_attempts_by_presence(presence.value.id(), body.page.to_repository_page()).await?;
    Ok(assemble_host_posture_page(presence.value, page))
}
~~~

事务 / 错误 / 状态 / effect：无写入；missing store -> NotAvailable；no attempts -> Empty；Prepared/Submitted/FeedbackLinked/Blocked/Unknown 原样映射，不推断 host health。
测试切口：visibility、page mapping、empty page、unknown attempt、body-free view、no-write assertion。
停审：pass_with_open_blockers（L2M-UP-001）。

### 11.3 GetCurrentSubscriptionScopeFlow

#### 11.3.1 入口与目标

- DTO：GetCurrentSubscriptionScopeBody { subject, consistency }；response：MemberQueryResponse<SubscriptionScopeReadSurface>。
- 模块 / 对象：CP02 Inbound；SubscriptionScopeDecision。
- 入口：SubscriptionScopeService::get_current_subscription_scope(MemberOperationContext context, GetCurrentSubscriptionScopeBody body)。
- Port：SubscriptionScopeStore::find_current_scope_with_version；ExternalResolutionReadPort::find_resolution；visibility basis read。

#### 11.3.2 调用图与伪代码

~~~text
[GetCurrentSubscriptionScopeBody] -> [get_current_subscription_scope]
  | no-write + scope visibility
  v
[SubscriptionScopeStore.find_current_scope_with_version]
  | ExternalResolutionReadPort.find_resolution
  v
[Active / Blocked / NotAvailable / NotReady]
~~~

~~~rust
async fn get_current_subscription_scope(MemberOperationContext context, GetCurrentSubscriptionScopeBody body) -> Result<MemberQueryResponse<SubscriptionScopeReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Inbound).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let scope = scope_store.find_current_scope_with_version(body.subject.project_member_ref.clone()).await?;
    let resolution = load_scope_resolution_if_present(&resolution_read, &scope).await?;
    Ok(assemble_scope_surface(scope, resolution, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写；没有合法 scope -> NotAvailable（不是 Empty）；stale resolution -> Stale marker；不创建 refresh。
测试切口：no scope、resolution mismatch、visibility、stale, Store unavailable、query no-write。
停审：pass_with_open_blockers（L2M-UP-006/007）。

### 11.4 GetScreeningDispositionFlow

#### 11.4.1 入口与目标

- DTO：GetScreeningDispositionBody { subject, screening_id }；response：MemberQueryResponse<ScreeningDecisionReadSurface>。
- 模块 / 对象：CP02 Inbound；ScreeningDecision、InboundFactRecord。
- 入口：InboundBoundaryService::get_screening_disposition(MemberOperationContext context, GetScreeningDispositionBody body)。
- Port：InboundStore::get_screening_with_version、get_inbound_with_version；ExternalResolutionReadPort::find_resolution；visibility basis read。

#### 11.4.2 调用图与伪代码

~~~text
[GetScreeningDispositionBody] -> [get_screening_disposition]
  | no-write + screening visibility
  v
[InboundStore.get_screening_with_version + get_inbound_with_version]
  | read neutral rule resolution
  v
[Passed / Degraded / Blocked / Pending surface]
~~~

~~~rust
async fn get_screening_disposition(MemberOperationContext context, GetScreeningDispositionBody body) -> Result<MemberQueryResponse<ScreeningDecisionReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Inbound).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let screening = inbound_store.get_screening_with_version(body.screening_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let inbound = inbound_store.get_inbound_with_version(screening.value.inbound_fact_id()).await?.ok_or(ApplicationError::NotAvailable)?;
    Ok(assemble_screening_surface(screening.value, inbound.value))
}
~~~

事务 / 错误 / 状态 / effect：无写；missing -> NotAvailable；Pending/Blocked 显式返回；不重新检查 raw body、不执行 Runtime。
测试切口：visibility、missing fact、each disposition、body-free surface、no write.
停审：pass_with_open_blockers（L2M-UP-005/006）。

### 11.5 GetRuntimeMediationPostureFlow

#### 11.5.1 入口与目标

- DTO：GetRuntimeMediationPostureBody { subject, decision_id, consistency }；response：MemberQueryResponse<RuntimeMediationReadSurface>。
- 模块 / 对象：CP03 Runtime；RuntimeDeliveryDecision、RuntimeSubmissionAttempt、RuntimeResultLink。
- 入口：RuntimeMediationService::get_runtime_mediation_posture(MemberOperationContext context, GetRuntimeMediationPostureBody body)。
- Port：RuntimeMediationStore::get_delivery_decision_with_version、list_attempts_by_decision、get_result_link；visibility basis read。

#### 11.5.2 调用图与伪代码

~~~text
[GetRuntimeMediationPostureBody] -> [get_runtime_mediation_posture]
  | no-write + runtime visibility
  v
[RuntimeMediationStore.get_delivery_decision_with_version]
  | list_attempts_by_decision + get_result_link
  v
[Eligible/Rejected/Blocked/Pending + attempt posture]
~~~

~~~rust
async fn get_runtime_mediation_posture(MemberOperationContext context, GetRuntimeMediationPostureBody body) -> Result<MemberQueryResponse<RuntimeMediationReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Runtime).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let decision = runtime_store.get_delivery_decision_with_version(body.decision_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let attempts = runtime_store.list_attempts_by_decision(body.decision_id).await?;
    Ok(assemble_runtime_mediation_surface(decision.value, attempts, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写；decision missing -> NotAvailable；attempt pending/unknown 原样暴露；不读 Runtime loop/context/plan/outcome。
测试切口：visibility、attempt ordering、unknown fence、result link absent、no-write.
停审：pass_with_open_blockers（L2M-UP-003/004）。

### 11.6 GetRuntimeMaterialReceptionFlow

#### 11.6.1 入口与目标

- DTO：GetRuntimeMaterialReceptionBody { subject, reception_id }；response：MemberQueryResponse<RuntimeMaterialReceptionReadSurface>。
- 模块 / 对象：CP03 Runtime；RuntimeMaterialReception。
- 入口：RuntimeMediationService::get_runtime_material_reception(MemberOperationContext context, GetRuntimeMaterialReceptionBody body)。
- Port：RuntimeMediationStore::get_reception_with_version；visibility basis read。

#### 11.6.2 调用图与伪代码

~~~text
[GetRuntimeMaterialReceptionBody] -> [get_runtime_material_reception]
  | no-write + reception visibility
  v
[RuntimeMediationStore.get_reception_with_version]
  v
[Accepted/Rejected/Duplicate/Late/Blocked/Unknown surface]
~~~

~~~rust
async fn get_runtime_material_reception(MemberOperationContext context, GetRuntimeMaterialReceptionBody body) -> Result<MemberQueryResponse<RuntimeMaterialReceptionReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Runtime).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let reception = runtime_store.get_reception_with_version(body.reception_id).await?.ok_or(ApplicationError::NotAvailable)?;
    Ok(assemble_reception_surface(reception.value))
}
~~~

事务 / 错误 / 状态 / effect：无写；missing -> NotAvailable；Late 不替代 current；body-free metadata only。
测试切口：all reception dispositions、visibility、missing、no Runtime body、no-write。
停审：pass_with_open_blockers（L2M-UP-004）。

## 12. Query flows（9.2-b，CP04~CP07）

### 12.1 GetOutboundDecisionFlow

#### 12.1.1 入口与目标

- DTO：GetOutboundDecisionBody { subject, decision_id, consistency }；response：MemberQueryResponse<OutboundDecisionReadSurface>。
- 模块 / 对象：CP04 Outbound；OutboundDecision、MemberOutboundMaterial。
- 入口：OutboundBoundaryService::get_outbound_decision(MemberOperationContext context, GetOutboundDecisionBody body)。
- Port：OutboundStore::get_decision_with_version、get_material、get_gap_with_version；ExternalResolutionReadPort::find_resolution；visibility basis read。

#### 12.1.2 调用图与伪代码

~~~text
[GetOutboundDecisionBody] -> [get_outbound_decision]
  | no-write + target visibility
  v
[OutboundStore.get_decision_with_version + get_material]
  | read target resolution / gap refs
  v
[Eligible/Rejected/Blocked/Pending surface]
~~~

~~~rust
async fn get_outbound_decision(MemberOperationContext context, GetOutboundDecisionBody body) -> Result<MemberQueryResponse<OutboundDecisionReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Outbound).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let decision = outbound_store.get_decision_with_version(body.decision_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let material = outbound_store.get_material(decision.value.material_id()).await?;
    Ok(assemble_outbound_surface(decision.value, material, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写；target resolution stale / gap 显式 marker；不调用 publication handoff。
测试切口：visibility、decision without material、gap marker、no-write、body-free material view。
停审：pass_with_open_blockers（L2M-UP-001/004）。

### 12.2 GetPublicationPostureFlow

#### 12.2.1 入口与目标

- DTO：GetPublicationPostureBody { subject, decision_id, page }；response：MemberPagedQueryResponse<PublicationPostureView>。
- 模块 / 对象：CP04 Outbound；PublicationAttempt、PublicationGap。
- 入口：OutboundBoundaryService::get_publication_posture(MemberOperationContext context, GetPublicationPostureBody body)。
- Port：OutboundStore::list_attempts_by_decision、list_open_gaps；visibility basis read。

#### 12.2.2 调用图与伪代码

~~~text
[GetPublicationPostureBody] -> [get_publication_posture]
  | no-write + publication visibility
  v
[OutboundStore.list_attempts_by_decision + list_open_gaps]
  v
[paged Prepared/Submitted/FeedbackLinked/Blocked/Unknown + gaps]
~~~

~~~rust
async fn get_publication_posture(MemberOperationContext context, GetPublicationPostureBody body) -> Result<MemberPagedQueryResponse<PublicationPostureView>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Outbound).await?;
    if !visibility.is_visible() { return Ok(not_visible_page()); }
    let attempts = outbound_store.list_attempts_by_decision(body.decision_id.clone(), body.page.to_repository_page()).await?;
    let gaps = filter_gaps_for_decision(outbound_store.list_open_gaps(body.page.to_repository_page()).await?, body.decision_id);
    Ok(assemble_publication_page(attempts, gaps))
}
~~~

事务 / 错误 / 状态 / effect：无写；empty page 是合法结果；gap Open/ResolutionPending/Resolved/Superseded 原样显示；不等价 delivered。
测试切口：pagination mapping、empty、unknown fence、visibility、no-write。
停审：pass_with_open_blockers（L2M-UP-001/005）。

### 12.3 GetInteractionTraceFlow

#### 12.3.1 入口与目标

- DTO：GetInteractionTraceBody { subject, purpose, page }；response：MemberPagedQueryResponse<InteractionTraceEntry>。
- 模块 / 对象：CP05 InteractionTrace；InteractionTraceEntry。
- 入口：InteractionTraceService::get_interaction_trace(MemberOperationContext context, GetInteractionTraceBody body)。
- Port：InteractionTraceStore::list_trace_by_subject；visibility basis read。

#### 12.3.2 调用图与伪代码

~~~text
[GetInteractionTraceBody] -> [get_interaction_trace]
  | no-write + trace visibility
  v
[InteractionTraceStore.list_trace_by_subject]
  v
[ordered body-free trace page / empty / not-visible]
~~~

~~~rust
async fn get_interaction_trace(MemberOperationContext context, GetInteractionTraceBody body) -> Result<MemberPagedQueryResponse<InteractionTraceEntry>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Trace).await?;
    if !visibility.is_visible() { return Ok(not_visible_page()); }
    let page = trace_store.list_trace_by_subject(body.subject.project_member_ref, correlation_for_purpose(body.purpose), body.page.to_repository_page()).await?;
    Ok(assemble_trace_page(page))
}
~~~

事务 / 错误 / 状态 / effect：无写；只返回 committed local refs / safe categories；不回查 event body、prompt、tool output。
测试切口：subject isolation、purpose filter、stable order、empty、visibility、no-write。
停审：pass_with_open_blockers（L2M-UP-005）。

> 分批写入顺序说明：本文件按单次 100~300 行写入，部分章节在物理文件中按补写顺序出现（当前物理顺序为 §6~§12.3、§21~§26、§15~§20、§12.4~§14、§27）；以 §21 canonical index、§22~§23 cross-flow audit 和 §27 final gate 为准。后续正式装配应按协议族语义顺序重排，不得把本物理顺序当作运行时调用顺序。

## 21. 处理流总表（canonical index）

| 处理流 | 协议 | 入口函数 | 主要事务 | 状态 / local effect | 测试切口 |
|---|---|---|---|---|---|
| AdmitMemberStartupFlow | AdmitMemberStartup | PresenceApplicationService::admit_member_startup | admission UoW | StartupAdmission disposition、trace/projection candidate | source/credential gate、replay |
| EstablishMemberPresenceFlow | EstablishMemberPresence | PresenceApplicationService::establish_member_presence | presence UoW | MemberPresence Starting | admission gate、revision |
| TransitionMemberPresenceFlow | TransitionMemberPresence | PresenceApplicationService::transition_member_presence | successor UoW | presence successor | illegal transition、version |
| PrepareHostCollaborationFlow | PrepareHostCollaboration | HostCollaborationService::prepare_host_collaboration | material/attempt UoW | Prepared/Blocked attempt | boundary gate、body-free |
| EstablishSubscriptionScopeFlow | EstablishSubscriptionScope | SubscriptionScopeService::establish_subscription_scope | scope UoW | Active/Rejected/Blocked scope | expansion, resolution |
| ReplaceSubscriptionScopeFlow | ReplaceSubscriptionScope | SubscriptionScopeService::replace_subscription_scope | successor UoW | old Superseded + new decision | version, narrowing |
| SubmitScreenedFactToRuntimeFlow | SubmitScreenedFactToRuntime | RuntimeMediationService::submit_screened_fact_to_runtime | attempt + seam fence UoW | Eligible + Submitted/Unknown | no resubmit |
| LinkRuntimeAdmissionResultFlow | LinkRuntimeAdmissionResult | RuntimeMediationService::link_runtime_admission_result | result-link UoW | ResultLinked / late link | formal result, late |
| ResolveExternalContextFlow | ResolveExternalContext | ExternalContextMirrorService::resolve_external_context | mirror UoW | snapshot + resolution/gap | owner selector |
| RequestExternalContextRefreshFlow | RequestExternalContextRefresh | ExternalContextMirrorService::request_external_context_refresh | gap UoW | ResolutionPending gap | request-only |
| GetMemberPresenceFlow | GetMemberPresence | PresenceApplicationService::get_member_presence | none | read surface | no-write |
| GetHostCollaborationPostureFlow | GetHostCollaborationPosture | HostCollaborationService::get_host_collaboration_posture | none | paged attempt posture | no-write |
| GetCurrentSubscriptionScopeFlow | GetCurrentSubscriptionScope | SubscriptionScopeService::get_current_subscription_scope | none | scope surface | no-write |
| GetScreeningDispositionFlow | GetScreeningDisposition | InboundBoundaryService::get_screening_disposition | none | screening surface | no-write |
| GetRuntimeMediationPostureFlow | GetRuntimeMediationPosture | RuntimeMediationService::get_runtime_mediation_posture | none | decision/attempt surface | no-write |
| GetRuntimeMaterialReceptionFlow | GetRuntimeMaterialReception | RuntimeMediationService::get_runtime_material_reception | none | reception surface | no-write |
| GetOutboundDecisionFlow | GetOutboundDecision | OutboundBoundaryService::get_outbound_decision | none | outbound surface | no-write |
| GetPublicationPostureFlow | GetPublicationPosture | OutboundBoundaryService::get_publication_posture | none | attempts/gaps page | no-write |
| GetInteractionTraceFlow | GetInteractionTrace | InteractionTraceService::get_interaction_trace | none | trace page | no-write |
| ListInteractionGapsFlow | ListInteractionGaps | InteractionTraceService::list_interaction_gaps | none | gap page | no-write |
| GetObservationPostureFlow | GetObservationPosture | InteractionTraceService::get_observation_posture | none | observation page | no-write |
| GetExternalContextResolutionFlow | GetExternalContextResolution | ExternalContextMirrorService::get_external_context_resolution | none | neutral resolution | no-write |
| ListExternalContextGapsFlow | ListExternalContextGaps | ExternalContextMirrorService::list_external_context_gaps | none | gap page | no-write |
| GetMemberSummaryFlow | GetMemberSummary | MemberReadModelService::get_member_summary | none | summary projection | no-write |
| GetCapabilityOutletFlow | GetCapabilityOutlet | MemberReadModelService::get_capability_outlet | none | non-authorizing outlet | no-write |
| GetMemberDiagnosticsFlow | GetMemberDiagnostics | MemberReadModelService::get_member_diagnostics | none | low-sensitive diagnostic | no-write |
| HostFeedbackConsumerFlow | HostFeedbackConsumer | HostCollaborationService::consume_host_feedback | receipt UoW | attempt feedback link | duplicate/late |
| InboundFactConsumerFlow | InboundFactConsumer | InboundBoundaryService::consume_inbound_fact | fact + screening UoW | intake/screening | body gate |
| RuntimeMaterialConsumerFlow | RuntimeMaterialConsumer | RuntimeMediationService::consume_runtime_material | reception UoW | reception disposition | source proof |
| DeliveryFeedbackConsumerFlow | DeliveryFeedbackConsumer | OutboundBoundaryService::consume_delivery_feedback | attempt/gap UoW | feedback/gap | no delivered claim |
| ObservationFeedbackConsumerFlow | ObservationFeedbackConsumer | InteractionTraceService::consume_observation_feedback | attempt/gap UoW | feedback/gap | no observed claim |
| SubjectIdentityContextUpdateConsumerFlow | SubjectIdentityContextUpdateConsumer | ExternalContextMirrorService::consume_subject_identity_context_update | mirror receipt UoW | neutral identity resolution | owner gate |
| PolicyContextUpdateConsumerFlow | PolicyContextUpdateConsumer | ExternalContextMirrorService::consume_policy_context_update | mirror receipt UoW | neutral policy resolution | no governance truth |
| RuntimeBoundaryContextUpdateConsumerFlow | RuntimeBoundaryContextUpdateConsumer | ExternalContextMirrorService::consume_runtime_boundary_context_update | mirror receipt UoW | runtime mapping resolution | no runtime truth |
| CapabilityContextUpdateConsumerFlow | CapabilityContextUpdateConsumer | ExternalContextMirrorService::consume_capability_context_update | mirror receipt UoW | capability refs/resolution | non-authorizing |
| HostRouteContextUpdateConsumerFlow | HostRouteContextUpdateConsumer | ExternalContextMirrorService::consume_host_route_context_update | mirror receipt UoW | route resolution | no bus truth |
| RuntimeMaterialReceptionConsumerFlow | RuntimeMaterialReceptionConsumer | OutboundBoundaryService::consume_runtime_material_reception | outbound preparation UoW | decision/material/attempt | committed reception |
| MemberCommittedFactConsumerFlow | MemberCommittedFactConsumer | InteractionTraceService::consume_member_committed_fact | trace UoW | trace/gap | committed proof |
| MemberProjectionUpdateConsumerFlow | MemberProjectionUpdateConsumer | MemberReadModelService::consume_member_projection_update | projection-state UoW | state Stale | watermark |
| CapabilityOutletSourceUpdateConsumerFlow | CapabilityOutletSourceUpdateConsumer | MemberReadModelService::consume_capability_outlet_source_update | projection-state UoW | outlet state stale | source/gap branch |
| PublicationRelayFlow | PublicationRelay | OutboundBoundaryService::run_publication_relay | per-item relay UoW | attempt Submitted/Unknown | no delivered |
| ObservationRelayFlow | ObservationRelay | InteractionTraceService::run_observation_relay | per-item relay UoW | attempt Submitted/Unknown | no observed |
| ExternalContextRefreshFlow | ExternalContextRefresh | ExternalContextMirrorService::run_external_context_refresh | refresh UoW | new snapshot/resolution/gap | no authorization |
| MemberProjectionRebuildFlow | MemberProjectionRebuild | MemberReadModelService::run_member_projection_rebuild | rebuild UoW | state Rebuilding/Current/Failed | committed-only |
| GapReconciliationFlow | GapReconciliation | MemberReadModelService::run_gap_reconciliation | reconciliation UoW | read-side stale/degraded | no source repair |

## 22. 跨 flow 事务、状态、outbox、trace、audit 与幂等审计

| 审计项 | 结论 | 证据 / 约束 |
|---|---|---|
| DTO 构造闭环 | pass_with_open_blockers | 10 command、16 query、14 consumer、5 job 均逐条列出字段与目标；上游缺口不被补造 |
| Step 6 object 回指 | pass | factory / transition 仅使用 StartupAdmission、MemberPresence、ScopeDecision、InboundFact、Screening、Runtime、Outbound、Trace、Mirror、Projection 对象 |
| Step 7 Port 回指 | pass_with_open_blockers | flow 只调用已列 Port；owner contract 未闭合处返回 blocked |
| UoW 边界 | pass | non-query fresh local writes 与 typed result/receipt/report 同一 logical UoW；query 无 UoW |
| expected version | pass_with_open_blockers | Store version 仅来自 Versioned<T>；部分跨-store successor 需在 Step 11 再锁定物理原子性 |
| duplicate replay | pass | matching kind/digest 仅 typed getter；missing/wrong-kind fail closed |
| external side effect fence | pass_with_open_blockers | local attempt first；Submitted / Unknown 不升级为 accepted/delivered/observed |
| trace / audit | pass_with_open_blockers | 只允许从 committed local fact 派生 marker；正式 subject / source cursor 仍待 Core seam |
| outbox | blocked | 24 candidates 全部不写 outbox，L2M-UP-005 关闭后重做 Step 8/9 |
| projection stale | pass_with_open_blockers | affected state 由 list_projection_states_affected_by_* 提供，不拼 ad hoc ref |
| state trigger | pass | 每个触发函数回指 Step 6 enum；完整矩阵留 Step 10 |
| query visibility | pass | 无 basis 返回 NotVisible；NotAvailable、NotReady、Stale、Degraded、Empty 分离 |
| job report | pass | MemberJobReport 只含 committed refs / projection refs / unresolved refs；无 scheduler/run evidence |
| phase boundary | pass_with_open_blockers | 未纳入 Runtime internals、LLM、memory、checkpoint、tool execution、container/image、governance/conversation/observability truth |

### 22.1 跨 flow 状态触发矩阵（Step 10 候选，不提前冻结）

| 状态族 | 触发 flow | 可写 successor | 禁止触发 |
|---|---|---|---|
| MemberPresenceStatus | EstablishMemberPresence、TransitionMemberPresence | presence revision | heartbeat、Query、host feedback |
| SubscriptionScopeStatus | Establish/ReplaceSubscriptionScope | scope decision revision | inbound body、Query |
| ScreeningDisposition | InboundFactConsumer | screening decision | Runtime admission result |
| RuntimeSubmissionAttemptStatus | SubmitScreenedFactToRuntime、LinkRuntimeAdmissionResult、RuntimeMaterialConsumer | attempt / result link | Runtime loop state |
| PublicationAttemptStatus / GapStatus | RuntimeMaterialReceptionConsumer、PublicationRelay、DeliveryFeedbackConsumer | attempt/gap successor | delivered claim |
| ObservationAttemptStatus / InteractionGapStatus | MemberCommittedFactConsumer、ObservationRelay、ObservationFeedbackConsumer | trace/attempt/gap successor | observed/evidence claim |
| ExternalContextResolutionStatus / GapStatus | Resolve、source Consumers、Refresh Job | snapshot/resolution/gap successor | authorization/health |
| MemberProjectionStatus | Projection Consumer、Rebuild、Reconcile | projection state successor | source truth repair |

### 22.2 outbox / semantic candidate audit

当前不存在可实现的 publisher / outbox / event route。任何 accepted local fact 只能形成 candidate marker，并在本地诊断或校准材料中保留 blocker。不能通过 fake、adapter、job report 或 event name 伪造 event delivery。

## 23. Blocker 与 non-fabrication audit

| blocker | 受影响 flow | 本步处理 |
|---|---|---|
| L2M-UP-001 | host route、host feedback、publication feedback | 使用 typed ref / Port 槽位；不写 wire carrier |
| L2M-UP-002 | host admission / lifecycle | 不创建 container、image 或 process flow |
| L2M-UP-003 | Runtime entry / admission result | 只使用 boundary / result ref；不创建 run |
| L2M-UP-004 | Runtime material、outbound、observation | committed body-free gate；不复制 Runtime body |
| L2M-UP-005 | 24 semantic event candidates | 全部 blocked；无 envelope/payload/outbox/publisher |
| L2M-UP-006 | identity/policy/screening resolution | fail closed；不把 stale 当 resolved |
| L2M-UP-007 | source freshness/conflict | 显式 status/gap；不猜 current |
| L2M-UP-008 | subject-bearing flows | 只接受 ProjectMemberRef + GlobalMemberRef 双锚 |
| L2M-DDD-001 | physical target crate / package | 继续 planned；不声称编译 |
| L2M-DDD-002 | external adapter/fake assembly | 只保留 infra slot；不声称可运行 |

禁止内容复核：无 LLM 推理、计划、记忆、checkpoint、tool execution、capability registry、MCP/A2A/API adapter、容器生命周期、镜像构建、sandbox isolation truth、governance approval truth、conversation truth、observability backend 或实现证据。

## 24. 回填草稿（只供正式 03 §8 未来装配）

正式文档未来只应回填以下收口结论，并引用本文件相应小节：

1. 七类协议的入口均通过 typed facade 进入 named application service。
2. Command / Consumer / Job fresh path 统一执行 digest → local UoW → idempotency reserve → domain method → typed result/receipt/report → complete → commit；duplicate 只回放 stored carrier。
3. Query 统一 no-write，并显式区分 visibility、freshness、not-ready、degraded、not-available 和 empty。
4. 外部 handoff 采用 local attempt + side-effect fence；Submitted、Unknown、FeedbackLinked 不代表外部接受、交付或观察。
5. Projection、trace、mirror 只消费 committed local fact / neutral resolution；不回写 source truth。
6. 24 semantic outbound event candidates 继续 blocked by L2M-UP-005，不进入正式可发布协议。
7. 五个 Job 只形成 member-local continuation / report，不生成 scheduler、run、evidence、readiness 或 external success。

正式回填前置条件：Step 9 gate 通过、项目级与文档级台账允许装配、用户另行授权 Step 19；当前条件未满足，故不写 03-详细设计.md。

## 25. Step 10 handoff 与本步完成清单

### 25.1 交给 Step 10 的输入

- 处理流触发的状态族：Presence、SubscriptionScope、Screening、RuntimeAttempt、PublicationAttempt/Gap、ObservationAttempt/Gap、ExternalResolution/Gap、ProjectionState。
- 每个状态族的候选触发函数见 §22.1；Step 10 已获当前用户授权，状态主语筛选与矩阵将在独立 Step 10 文件完成。
- 不能把 disposition、visibility marker、job report 或 event candidate 自动提升为新状态机。

### 25.2 本步完成清单

| 检查项 | 结果 |
|---|---|
| 10 Command 独立 flow | completed |
| 16 Query 独立 flow | completed |
| 14 Consumer 独立 flow | completed |
| 24 event candidate 逐项 blocked 记录 | completed / blocked by L2M-UP-005 |
| 5 Job 独立 flow | completed |
| DTO → Step 6 object | completed with upstream blockers |
| Step 7 Port / Store 回指 | completed with upstream blockers |
| UoW / idempotency / typed replay | completed |
| Query no-write | completed |
| external side-effect fence | completed with upstream blockers |
| cross-flow transaction/state/outbox audit | completed with upstream blockers |
| 正式 03 写入 | not allowed |
| Step 10 创建 | authorized in current continuation; pending separate file creation |

## 26. Step 9 gate / stop-review

本文件的 Step 9 逻辑工作已完成。状态应在项目级台账同步为：

~~~text
step_09 = completed / pass_with_upstream_blockers / stop_review
next_step = Step_10 (authorized, pending separate file creation)
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
~~~

仍开放的 blocker：L2M-UP-001~008、L2M-DDD-001~002；其中 L2M-UP-005 继续阻塞全部 24 个 outbound semantic event candidates。完成本 Step 后立即停审；Step 10 的读取与写入仅发生在独立的 `03_ddd_step_10_state_matrix.md` 中。

## 15. Consumer flows（9.3-b，CP06 source updates）

CP06 的五条 flow 使用相同的 envelope / idempotency 骨架，但每条都固定 owner-specific resolver 和 context kind，不能合并为 generic consumer。

### 15.1 SubjectIdentityContextUpdateConsumerFlow

#### 15.1.1 入口与目标

- 输入：SubjectIdentityContextUpdateInput { subject, source_ref, source_owner, freshness }。
- 模块 / 对象：CP06；ExternalContextSnapshot、ExternalContextResolution、ExternalContextGap。
- 入口：ExternalContextMirrorService::consume_subject_identity_context_update(MemberOperationContext context, SubjectIdentityContextUpdateInput input)。
- Port：IdentityContextResolverPort::resolve_identity_anchor_context；ExternalContextMirrorStore::append_snapshot / append_resolution / append_gap；technical Port。

#### 15.1.2 调用图与伪代码

~~~text
[Identity update envelope]
  | owner/schema/body gate + digest + reserve
  v
[IdentityContextResolverPort.resolve_identity_anchor_context]
  | Snapshot.capture + Resolution.resolve
  v
[MirrorStore append snapshot/resolution or gap + receipt]
~~~

~~~rust
async fn consume_subject_identity_context_update(MemberOperationContext context, SubjectIdentityContextUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_owner_input(&input, ExternalContextKind::Identity)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::SubjectIdentityUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let safe = identity_context.resolve_identity_anchor_context(input.source_ref.clone(), input.subject.clone(), input.freshness.clone()).await?;
    let local = capture_or_gap(safe, ExternalConsumerPurpose::Identity, input, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：source owner mismatch -> Rejected；stale/conflict/unavailable -> resolution/gap；只保存 safe refs；不创建第二执行主语。
测试切口：owner selector、duplicate replay、stale mapping、body gate、gap append、no identity body copy。
停审：pass_with_open_blockers（L2M-UP-001/006/007/008）。

### 15.2 PolicyContextUpdateConsumerFlow

#### 15.2.1 入口与目标

- 输入：PolicyContextUpdateInput { subject, source_ref, source_owner, freshness }。
- 模块 / 对象：CP06；ExternalContextResolution（purpose=Screening）。
- 入口：ExternalContextMirrorService::consume_policy_context_update(MemberOperationContext context, PolicyContextUpdateInput input)。
- Port：GovernancePolicyContextResolverPort::resolve_policy_context；MirrorStore append snapshot/resolution/gap；technical Port。

#### 15.2.2 调用图与伪代码

~~~text
[Policy update envelope] -> [consume_policy_context_update]
  | digest + reserve + owner gate
  v
[resolve_policy_context]
  | capture neutral snapshot/resolution
  v
[append mirror fact + receipt + commit]
~~~

~~~rust
async fn consume_policy_context_update(MemberOperationContext context, PolicyContextUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_owner_input(&input, ExternalContextKind::Policy)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::PolicyContextUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let safe = policy_context.resolve_policy_context(input.source_ref.clone(), input.subject.clone(), input.freshness.clone()).await?;
    capture_or_gap(safe, ExternalConsumerPurpose::Screening, input, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：只产生 neutral resolution/gap；CP02 通过 ScreeningRuleSourcePort 读取，不写 Governance policy / approval truth。
测试切口：purpose isolation、stale/conflict、duplicate、receipt replay、no rule body persistence。
停审：pass_with_open_blockers（L2M-UP-006/007）。

### 15.3 RuntimeBoundaryContextUpdateConsumerFlow

#### 15.3.1 入口与目标

- 输入：RuntimeBoundaryContextUpdateInput { subject, boundary_ref, entry_contract_ref, freshness }。
- 模块 / 对象：CP06；ExternalContextSnapshot、ExternalContextResolution（purpose=RuntimeEntry）。
- 入口：ExternalContextMirrorService::consume_runtime_boundary_context_update(MemberOperationContext context, RuntimeBoundaryContextUpdateInput input)。
- Port：RuntimeContextResolverPort::resolve_runtime_context；MirrorStore append snapshot/resolution/gap；technical Port。

#### 15.3.2 调用图与伪代码

~~~text
[Runtime boundary update] -> [consume_runtime_boundary_context_update]
  | validate mapping + digest + reserve
  v
[resolve_runtime_context]
  | capture/resolve neutral mapping
  v
[append mirror fact + receipt]
~~~

~~~rust
async fn consume_runtime_boundary_context_update(MemberOperationContext context, RuntimeBoundaryContextUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_runtime_mapping(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::RuntimeBoundaryUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let safe = runtime_context.resolve_runtime_context(input.boundary_ref.clone(), input.entry_contract_ref.clone(), input.freshness.clone()).await?;
    capture_or_gap(safe, ExternalConsumerPurpose::RuntimeEntry, input, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：mapping unknown -> Blocked/Unresolved；不复制 Runtime schema、loop、plan、outcome、run。
测试切口：boundary/contract mismatch、stale, duplicate, no run creation, body-free snapshot。
停审：pass_with_open_blockers（L2M-UP-003/004）。

### 15.4 CapabilityContextUpdateConsumerFlow

#### 15.4.1 入口与目标

- 输入：CapabilityContextUpdateInput { subject, tool_ref, binding_ref, method_ref, freshness }。
- 模块 / 对象：CP06；ExternalContextResolution（purpose=CapabilityOutlet）。
- 入口：ExternalContextMirrorService::consume_capability_context_update(MemberOperationContext context, CapabilityContextUpdateInput input)。
- Port：ToolContractContextResolverPort::resolve_tool_contract_context、MethodDefinitionContextResolverPort::resolve_method_definition_context；MirrorStore append snapshot/resolution/gap；technical Port。

#### 15.4.2 调用图与伪代码

~~~text
[Capability update envelope] -> [consume_capability_context_update]
  | validate typed refs + digest + reserve
  v
[resolve_tool_contract_context / resolve_method_definition_context]
  | capture neutral refs
  v
[append mirror facts + receipt]
~~~

~~~rust
async fn consume_capability_context_update(MemberOperationContext context, CapabilityContextUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_capability_refs(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::CapabilityContextUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let safe = resolve_capability_owner_refs(input.clone()).await?;
    capture_or_gap(safe, ExternalConsumerPurpose::CapabilityOutlet, input, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：safe refs only；不建立 capability registry、不调用 tool、不可推导 authorization / invocation。
测试切口：optional refs、owner resolver selection、duplicate、definition body rejection、resolution gap。
停审：pass_with_open_blockers（L2M-UP-004/006）。

### 15.5 HostRouteContextUpdateConsumerFlow

#### 15.5.1 入口与目标

- 输入：HostRouteContextUpdateInput { subject, host_boundary_ref, route_ref, freshness }。
- 模块 / 对象：CP06；ExternalContextResolution（purpose=HostRoute）。
- 入口：ExternalContextMirrorService::consume_host_route_context_update(MemberOperationContext context, HostRouteContextUpdateInput input)。
- Port：HostRouteContextResolverPort::resolve_host_route_context；MirrorStore append snapshot/resolution/gap；technical Port。

#### 15.5.2 调用图与伪代码

~~~text
[Host route update] -> [consume_host_route_context_update]
  | owner/schema/body gate + digest + reserve
  v
[resolve_host_route_context]
  | capture/resolve neutral route basis
  v
[append mirror fact/gap + receipt + commit]
~~~

~~~rust
async fn consume_host_route_context_update(MemberOperationContext context, HostRouteContextUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_host_route_refs(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::HostRouteContextUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let safe = host_route.resolve_host_route_context(input.host_boundary_ref.clone(), input.route_ref.clone(), input.freshness.clone()).await?;
    capture_or_gap(safe, ExternalConsumerPurpose::HostRoute, input, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：route resolution 只支持 handoff selector；不声明 Bus delivery、host health 或 route availability。
测试切口：route owner mismatch、stale/unavailable、duplicate、no route string inference、receipt replay。
停审：pass_with_open_blockers（L2M-UP-001/005）。

## 16. Consumer flows（9.3-c，committed-fact propagation）

### 16.1 RuntimeMaterialReceptionConsumerFlow

#### 16.1.1 入口与目标

- 输入：RuntimeMaterialReceptionInput { subject, reception_id, target_resolution_id, purpose }。
- 模块 / 对象：CP04 Outbound；OutboundDecision、MemberOutboundMaterial、PublicationAttempt、PublicationGap。
- 入口：OutboundBoundaryService::consume_runtime_material_reception(MemberOperationContext context, RuntimeMaterialReceptionInput input)。
- Port：RuntimeMediationStore::get_reception_with_version；ExternalResolutionReadPort::get_resolution；OutboundStore::append_decision / append_material / append_attempt / append_gap；technical Port。

#### 16.1.2 调用图与伪代码

~~~text
[committed reception envelope]
  | fact proof + digest + reserve
  v
[RuntimeMediationStore.get_reception_with_version]
  | OutboundDecision.decide
  | MemberOutboundMaterial.create
  v
[OutboundStore append decision/material/attempt or gap + receipt]
~~~

~~~rust
async fn consume_runtime_material_reception(MemberOperationContext context, RuntimeMaterialReceptionInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_committed_fact(input.reception_id)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::RuntimeMaterialReception(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let reception = runtime_store.get_reception_with_version(input.reception_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let resolution = resolution_read.get_resolution(input.target_resolution_id.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    let decision = OutboundDecision::decide(new_outbound_decision_id(), &reception.value, input.subject.project_member_ref, input.purpose, &resolution.value, &outbound_policy).map_err(map_domain)?;
    outbound_store.append_decision(decision.clone(), &*uow).await?;
    if decision.permits_material_creation() {
        let material = MemberOutboundMaterial::create(new_material_id(), &decision, &reception.value, safe_refs(), redaction_profile(), digest_port.material_digest(&safe_refs(), &context.correlation())?, &outbound_policy).map_err(map_domain)?;
        outbound_store.append_material(material, &*uow).await?;
    }
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：仅接受 committed reception；decision 非 Eligible -> local gap / blocked；不扫描 Runtime source、不复制 body、不调用 publication seam。
测试切口：fact proof、resolution mismatch、eligible/rejected/blocked、duplicate、material body-free、no source rewrite。
停审：pass_with_open_blockers（L2M-UP-003/004/005）。

### 16.2 MemberCommittedFactConsumerFlow

#### 16.2.1 入口与目标

- 输入：MemberCommittedFactInput { subject, fact_ref, purpose, predecessor_refs }。
- 模块 / 对象：CP05 InteractionTrace；InteractionTraceEntry、InteractionGap。
- 入口：InteractionTraceService::consume_member_committed_fact(MemberOperationContext context, MemberCommittedFactInput input)。
- Port：MemberFactReadPort::load_committed_fact；InteractionTraceStore::append_trace_entry / append_gap；technical Port。

#### 16.2.2 调用图与伪代码

~~~text
[committed fact envelope]
  | source proof + digest + reserve
  v
[MemberFactReadPort.load_committed_fact]
  | InteractionTraceEntry.record or InteractionGap.open
  v
[TraceStore append + receipt + commit]
~~~

~~~rust
async fn consume_member_committed_fact(MemberOperationContext context, MemberCommittedFactInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_fact_envelope(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::MemberCommittedFact(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let fact = fact_read.load_committed_fact(input.fact_ref.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    let trace = InteractionTraceEntry::record(new_trace_id(), input.subject.project_member_ref, input.purpose, fact.safe_refs(), input.predecessor_refs, clock.now()).map_err(map_domain)?;
    trace_store.append_trace_entry(trace, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：fact missing / ordering unknown -> InteractionGap Open/Unknown；只追加 trace，不回写 source fact、不复制 source body。
测试切口：committed proof、predecessor ordering、duplicate、missing fact gap、trace correlation、no source mutation。
停审：pass_with_open_blockers（L2M-UP-005）。

### 16.3 MemberProjectionUpdateConsumerFlow

#### 16.3.1 入口与目标

- 输入：MemberProjectionUpdateInput { subject, fact_ref, target_watermark }。
- 模块 / 对象：CP07；MemberProjectionState。
- 入口：MemberReadModelService::consume_member_projection_update(MemberOperationContext context, MemberProjectionUpdateInput input)。
- Port：MemberFactReadPort::load_committed_fact；MemberProjectionStore::list_projection_states_affected_by_fact、save_projection_state_successor；technical Port。

#### 16.3.2 调用图与伪代码

~~~text
[committed fact envelope]
  | proof + digest + reserve
  v
[MemberFactReadPort.load_committed_fact]
  | ProjectionStore.list affected states
  v
[MemberProjectionState.mark_stale + save successors + receipt]
~~~

~~~rust
async fn consume_member_projection_update(MemberOperationContext context, MemberProjectionUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_fact_envelope(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::MemberProjectionUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let fact = fact_read.load_committed_fact(input.fact_ref.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    let states = projection_store.list_projection_states_affected_by_fact(input.fact_ref, page_for_update()).await?;
    for state in states.items { let successor = state.value.mark_stale(input.target_watermark, SafeReasonCategory::source_advanced()).map_err(map_domain)?; projection_store.save_projection_state_successor(successor, state.version, &*uow).await?; }
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：state Current/Degraded/Failed -> Stale（按 domain guard）；不生成 view、不修 source truth；version conflict -> Conflict receipt。
测试切口：affected-state selection、watermark source、multi-state atomicity、duplicate、version conflict、no source write。
停审：pass_with_open_blockers（L2M-UP-005）。

### 16.4 CapabilityOutletSourceUpdateConsumerFlow

#### 16.4.1 入口与目标

- 输入：CapabilityOutletSourceUpdateInput { subject, resolution_id, gap_id, safe_refs }。
- 模块 / 对象：CP07；CapabilityOutletView、MemberProjectionState。
- 入口：MemberReadModelService::consume_capability_outlet_source_update(MemberOperationContext context, CapabilityOutletSourceUpdateInput input)。
- Port：ExternalResolutionReadPort::get_resolution / get_gap；MemberProjectionStore::list_projection_states_affected_by_resolution / list_projection_states_affected_by_gap / save_projection_state_successor；technical Port。

#### 16.4.2 调用图与伪代码

~~~text
[committed CP06 resolution/gap envelope]
  | proof + digest + reserve
  v
[ExternalResolutionReadPort.get_resolution/get_gap]
  | ProjectionStore.list affected states
  v
[MemberProjectionState.mark_stale + save successor + receipt]
~~~

~~~rust
async fn consume_capability_outlet_source_update(MemberOperationContext context, CapabilityOutletSourceUpdateInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_capability_fact(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::CapabilityOutletSourceUpdate(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let source = load_resolution_or_gap(input.resolution_id, input.gap_id).await?;
    let states = affected_capability_states(source).await?;
    for state in states { let successor = state.value.mark_stale(source.watermark(), SafeReasonCategory::source_advanced()).map_err(map_domain)?; projection_store.save_projection_state_successor(successor, state.version, &*uow).await?; }
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：resolution/gap 只作为 projection source；safe_refs 不授予 invocation；不消费 Tools / Method raw event，不关闭 CP06 gap。
测试切口：resolution vs gap branch、safe refs validation、affected state, duplicate, version conflict, non-authorizing outlet。
停审：pass_with_open_blockers（L2M-UP-004/005/006）。

## 17. Consumer batch 9.3 stop review

| Consumer family | 数量 | receipt replay | source / body boundary | gate |
|---|---:|---|---|---|
| external feedback / inbound | 5 | pass | pass_with_open_blockers | pass_with_open_blockers |
| CP06 owner updates | 5 | pass | pass_with_open_blockers | pass_with_open_blockers |
| committed-fact propagation | 4 | pass | pass_with_open_blockers | pass_with_open_blockers |

批次结论：14 条 Consumer 均有独立入口、图、伪代码、typed receipt、duplicate / unsupported / late / blocked 口径；没有 consumer 修改其他 owner truth。上游 L2M-UP-005 继续阻塞正式 event carrier。

## 18. Outbound semantic event candidates（9.4，24 项全部 blocked）

L2M-UP-005 尚未关闭。本节只保留“哪个已提交 local fact 可能需要通知协作方”的 semantic name 和 source fact，不定义 envelope、payload、source、subject、schema、route、topic、publisher、outbox、delivery、retry 或 consumer binding。候选项不是可发布协议，也不能被 Consumer 当作事实来源。

### 18.1 统一 blocked 处理流

#### 函数级调用图: BlockedSemanticEventCandidateFlow

~~~text
[committed local fact]
  | derive semantic name only
  v
[MemberEventCandidateGate]
  | L2M-UP-005 check
  v
[Blocked marker in calibration / local diagnostic only]
  | no envelope / no outbox / no publish
~~~

~~~rust
fn derive_blocked_event_candidate(MemberCommittedFactRef fact_ref, MemberEventCandidateName name) -> Result<BlockedEventCandidate, MemberProtocolIssue> {
    ensure_fact_is_committed(fact_ref)?;
    if !upstream_gate.is_closed(MemberProjectBlockerId::L2M_UP_005) {
        return Err(MemberProtocolIssue::blocked(MemberProjectBlockerId::L2M_UP_005));
    }
    Ok(BlockedEventCandidate { name, fact_ref })
}
~~~

该伪代码只用于校准记录，不属于可调用 publisher。任何实现阶段若发现 candidate 需要发布，必须先回到上游 Core/Bus 正式 carrier 并重新执行 Step 8。

### 18.2 24 项逐项清单与独立停审

| # | CP | semantic candidate | 仅允许记录的 committed fact 语义 | 当前处理 | 独立停审 |
|---:|---|---|---|---|---|
| 1 | CP01 | MemberStartupAdmissionRecorded | startup admission local record 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 2 | CP01 | MemberPresenceChanged | presence 新 local revision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 3 | CP01 | HostCollaborationAttemptRecorded | host attempt local record 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 4 | CP02 | MemberSubscriptionScopeChanged | scope decision 新 revision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 5 | CP02 | MemberInboundFactRecorded | body-free inbound fact 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 6 | CP02 | MemberScreeningDecided | screening decision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 7 | CP03 | MemberRuntimeDeliveryDecided | Runtime delivery local decision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 8 | CP03 | MemberRuntimeSubmissionAttemptRecorded | Runtime attempt local record 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 9 | CP03 | MemberRuntimeResultLinked | Runtime result ref local link 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 10 | CP03 | MemberRuntimeMaterialReceived | safe Runtime material reception 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 11 | CP04 | MemberOutboundDecided | outbound decision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 12 | CP04 | MemberOutboundMaterialPrepared | body-free outbound material 已制备 | blocked by L2M-UP-005 | pass_with_blocker |
| 13 | CP04 | MemberPublicationAttemptRecorded | publication attempt local record 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 14 | CP04 | MemberPublicationGapChanged | publication gap local successor 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 15 | CP05 | MemberInteractionTraceRecorded | interaction trace entry 已追加 | blocked by L2M-UP-005 | pass_with_blocker |
| 16 | CP05 | MemberInteractionGapChanged | interaction gap local successor 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 17 | CP05 | MemberObservationMaterialPrepared | observation material 已制备 | blocked by L2M-UP-005 | pass_with_blocker |
| 18 | CP05 | MemberObservationAttemptRecorded | observation attempt local record 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 19 | CP06 | MemberExternalContextResolutionChanged | neutral resolution 新 local revision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 20 | CP06 | MemberExternalContextGapChanged | external context gap local successor 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 21 | CP07 | MemberSummaryProjectionChanged | summary projection 新 revision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 22 | CP07 | MemberCapabilityOutletChanged | capability outlet 新 revision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 23 | CP07 | MemberDiagnosticViewChanged | diagnostic view 新 revision 已提交 | blocked by L2M-UP-005 | pass_with_blocker |
| 24 | CP07 | MemberProjectionStateChanged | projection state 新 successor 已提交 | blocked by L2M-UP-005 | pass_with_blocker |

### 18.3 事件候选的 DTO / 对象 / Port / 副作用审计

| 审查项 | 结论 |
|---|---|
| source | 每项只能回指对应 committed local fact；不能从 Query、adapter ack、日志或 current snapshot 猜测 |
| DTO | 无 member-specific public event DTO；待 L2M-UP-005 关闭后由 Step 8 重新定义 |
| object | 事件名只对应 Step 6 对象已提交 revision，不增加新状态 |
| Port | 不调用 publisher、outbox、route、topic 或 external adapter |
| transaction | candidate 不开启新 UoW、不改变既有 commit |
| duplicate | candidate 不建立第二 reservation；下游未来 Consumer 必须另行 typed replay |
| boundary | 不声称 delivery / acceptance / observation / evidence |

### 18.4 批次停审记录

24 项均已逐项列名、绑定唯一 source fact 语义并记录相同 blocker。结论为 completed / blocked_by_L2M-UP-005；不得把本节回填为可发布事件章节。

## 19. Operations Job flows（9.5）

所有 Job 使用 Step 8 的 MemberJobRequest<T> 和 MemberJobReport。JobRunRef / scheduler / process 不是本仓 truth；report 仅说明 member-local continuation。

### 19.1 PublicationRelayFlow

#### 19.1.1 入口与目标

- 输入：PublicationRelayJobInput { attempt_refs, gap_refs, continuation_cursor }。
- 模块 / 对象：CP04 Outbound；PublicationAttempt、PublicationGap、MemberOutboundMaterial。
- 入口：OutboundBoundaryService::run_publication_relay(MemberOperationContext context, PublicationRelayJobInput input)。
- Port：OutboundStore::get_material、get_attempt_with_version、get_gap_with_version、list_prepared_attempts、save_attempt_successor、save_gap_successor；PublicationRouteResolverPort::resolve_publication_route；PublicationHandoffPort::submit；MemberStoredResultStore::save_job_report/get_job_report。

#### 19.1.2 函数级调用图

~~~text
[PublicationRelayJobInput]
  | validate finite refs + digest + begin + reserve
  v
[OutboundStore prepared attempt/material]
  | resolve_publication_route
  | PublicationHandoffPort.submit
  v
[PublicationAttempt.mark_submitted or mark_unknown]
  | save successor + MemberJobReport + commit
~~~

~~~rust
async fn run_publication_relay(MemberOperationContext context, PublicationRelayJobInput input) -> Result<MemberJobApplicationResult, ApplicationError> {
    validate_job_input(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::PublicationRelay(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_job_report(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let prepared_page = outbound_store.list_prepared_attempts(page_from_cursor(input.continuation_cursor)).await?;
    let attempts = select_attempt_refs(prepared_page, input.attempt_refs);
    let mut advanced = Vec::new();
    let mut unresolved = Vec::new();
    for item in attempts {
        let material = outbound_store.get_material(item.value.material_id()).await?.ok_or(ApplicationError::NotAvailable)?;
        let route = route_resolver.resolve_publication_route(item.value.boundary_ref(), material.correlation()).await?;
        let next = match handoff.submit(MemberPublicationSubmission::from_material(material), context.idempotency_key(), context.trace_id(), route.value).await {
            Ok(outcome) => item.value.mark_submitted(outcome.submission_ref(), clock.now()).map_err(map_domain)?,
            Err(_) => { unresolved.push(item.value.id().into()); item.value.mark_unknown(UnknownReason::handoff_unknown(), new_gap_ref()).map_err(map_domain)? },
        };
        outbound_store.save_attempt_successor(next.clone(), item.version, &*uow).await?;
        advanced.push(next.id().into());
    }
    let report = MemberJobReportAssembly::finish(context.job_kind(), input.attempt_refs, advanced, unresolved).map_err(map_domain)?;
    let result_ref = save_job_report(&stored_results, &context, digest.clone(), record_ref.clone(), report.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(job_completed(report))
}
~~~

事务 / 错误 / 状态 / effect：每个 attempt 先读取 prepared material，再调用 handoff；submitted 不等于 delivered；unknown 必须创建 / 关联 gap 并阻止 blind retry；report duplicate 只 get_job_report。
测试切口：finite selector、prepared gate、route unresolved、handoff submitted/unknown、per-item partial report、duplicate no handoff、version conflict。
停审：pass_with_open_blockers（L2M-UP-001/005）。

### 19.2 ObservationRelayFlow

#### 19.2.1 入口与目标

- 输入：ObservationRelayJobInput { attempt_refs, gap_refs, continuation_cursor }。
- 模块 / 对象：CP05 InteractionTrace；ObservationMaterial、ObservationAttempt、InteractionGap。
- 入口：InteractionTraceService::run_observation_relay(MemberOperationContext context, ObservationRelayJobInput input)。
- Port：InteractionTraceStore::get_observation_material、get_observation_attempt_with_version、list_prepared_observation_attempts、save_observation_attempt_successor；ObservationRouteResolverPort::resolve_observation_boundary；ObservationHandoffPort::submit；stored result / technical Port。

#### 19.2.2 函数级调用图

~~~text
[ObservationRelayJobInput]
  | digest + reserve
  v
[TraceStore prepared attempt/material]
  | resolve_observation_boundary
  | ObservationHandoffPort.submit
  v
[ObservationAttempt.mark_submitted/mark_unknown]
  | save successor + report + commit
~~~

~~~rust
async fn run_observation_relay(MemberOperationContext context, ObservationRelayJobInput input) -> Result<MemberJobApplicationResult, ApplicationError> {
    validate_job_input(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::ObservationRelay(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_job_report(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let prepared_page = trace_store.list_prepared_observation_attempts(page_from_cursor(input.continuation_cursor)).await?;
    let attempts = select_observation_attempt_refs(prepared_page, input.attempt_refs);
    let mut advanced = Vec::new();
    let mut unresolved = Vec::new();
    for item in attempts {
        let material = trace_store.get_observation_material(item.value.material_id()).await?.ok_or(ApplicationError::NotAvailable)?;
        let boundary = observation_route.resolve_observation_boundary(item.value.boundary_ref(), material.correlation()).await?;
        let next = match observation_handoff.submit(MemberObservationSubmission::from_material(material), context.idempotency_key(), context.trace_id(), boundary.value).await {
            Ok(outcome) => item.value.mark_submitted(outcome.submission_ref(), clock.now()).map_err(map_domain)?,
            Err(_) => { unresolved.push(item.value.id().into()); item.value.mark_unknown(UnknownReason::handoff_unknown(), new_gap_ref()).map_err(map_domain)? },
        };
        trace_store.save_observation_attempt_successor(next.clone(), item.version, &*uow).await?;
        advanced.push(next.id().into());
    }
    let report = MemberJobReportAssembly::finish(context.job_kind(), input.attempt_refs, advanced, unresolved).map_err(map_domain)?;
    let result_ref = save_job_report(&stored_results, &context, digest.clone(), record_ref.clone(), report.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(job_completed(report))
}
~~~

事务 / 错误 / 状态 / effect：Submitted 只表示 observation seam invoked；不声称 observed/evidence；unknown / gap 保留；Job 不写 observability backend。
测试切口：prepared selector、boundary unresolved、submitted/unknown、partial report、duplicate no handoff、no evidence claim。
停审：pass_with_open_blockers（L2M-UP-005）。

### 19.3 ExternalContextRefreshFlow

#### 19.3.1 入口与目标

- 输入：ExternalContextRefreshJobInput { source_ref, context_kind, purpose, scope, resolution_ref, refresh_request_ref, gap_ref }。
- 模块 / 对象：CP06；ExternalContextSnapshot、ExternalContextResolution、ExternalContextGap。
- 入口：ExternalContextMirrorService::run_external_context_refresh(MemberOperationContext context, ExternalContextRefreshJobInput input)。
- Port：ExternalContextMirrorStore::get_resolution_with_version、get_gap_with_version、append_snapshot / append_resolution / append_gap、save_gap_successor；owner-specific resolver；ExternalContextRefreshDispatchPort::dispatch；stored result / technical Port。

#### 19.3.2 函数级调用图

~~~text
[ExternalContextRefreshJobInput]
  | finite relation + digest + reserve
  v
[MirrorStore existing resolution/gap]
  | owner-specific resolver -> safe snapshot
  | ExternalContextRefreshDispatchPort.dispatch (if contract allows)
  v
[append new snapshot/resolution or gap successor + report]
~~~

~~~rust
async fn run_external_context_refresh(MemberOperationContext context, ExternalContextRefreshJobInput input) -> Result<MemberJobApplicationResult, ApplicationError> {
    validate_refresh_relation(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::ExternalContextRefresh(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_job_report(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let current = load_existing_resolution_or_gap(&input, &*uow).await?;
    let dispatch = refresh_dispatch.dispatch(input.source_ref.clone(), input.purpose, input.scope.clone()).await?;
    let local = match dispatch {
        Ok(_) => resolve_owner_specific_safe_snapshot(input.clone()).await?,
        Err(_) => append_refresh_gap_successor(current, ExternalContextGapCategory::OwnerUnavailable, &*uow).await?,
    };
    persist_refresh_local_fact(local, &*uow).await?;
    let report = MemberJobReportAssembly::finish(context.job_kind(), scanned_refs(&input), advanced_refs(local), unresolved_refs(local)).map_err(map_domain)?;
    let result_ref = save_job_report(&stored_results, &context, digest.clone(), record_ref.clone(), report.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(job_completed(report))
}
~~~

事务 / 错误 / 状态 / effect：只消费已登记 refresh relation；新 snapshot immutable；owner unavailable -> gap successor / Waiting；不把 dispatch result当 Resolved，不做 authorization / health 判断。
测试切口：relation selector、duplicate、dispatch unavailable、stale/conflict snapshot、immutable IDs、report replay、no generic resolver。
停审：pass_with_open_blockers（L2M-UP-001/006/007）。

### 19.4 MemberProjectionRebuildFlow

#### 19.4.1 入口与目标

- 输入：MemberProjectionRebuildJobInput { committed_fact_refs, resolution_refs, target_watermark, continuation_cursor }。
- 模块 / 对象：CP07；MemberSummaryView、CapabilityOutletView、MemberDiagnosticView、MemberProjectionState。
- 入口：MemberReadModelService::run_member_projection_rebuild(MemberOperationContext context, MemberProjectionRebuildJobInput input)。
- Port：MemberFactReadPort::list_committed_projection_sources / load_committed_fact；ExternalResolutionReadPort::list_resolutions_for_projection、get_resolution；ToolSafeViewReadPort::read_safe_views；MemberProjectionStore::find_projection_state_with_version、append_summary_view / append_capability_outlet_view / append_diagnostic_view / save_projection_state_successor；stored result / technical Port。

#### 19.4.2 函数级调用图

~~~text
[ProjectionRebuildJobInput]
  | digest + reserve
  v
[committed facts + CP06 resolutions]
  | MemberProjectionState.start_rebuild
  | View.rebuild / View.project
  v
[append immutable views + complete_rebuild state + report]
~~~

~~~rust
async fn run_member_projection_rebuild(MemberOperationContext context, MemberProjectionRebuildJobInput input) -> Result<MemberJobApplicationResult, ApplicationError> {
    validate_rebuild_sources(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::MemberProjectionRebuild(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_job_report(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let facts = fact_read.list_committed_projection_sources(context.subject(), input.target_watermark, input.continuation_cursor).await?;
    let resolutions = resolution_read.list_resolutions_for_projection(context.subject(), input.resolution_refs).await?;
    let states = load_projection_states_by_fixed_kind(&projection_store, context.subject()).await?;
    for state in states {
        let rebuilding = state.value.start_rebuild(input.target_watermark, SafeReasonCategory::rebuild_requested()).map_err(map_domain)?;
        projection_store.save_projection_state_successor(rebuilding.clone(), state.version, &*uow).await?;
        let rebuilt = rebuild_view_for_kind(state.value.projection_kind(), facts.clone(), resolutions.clone(), &read_policy).await?;
        append_view(rebuilt, &*uow).await?;
        let current = rebuilding.complete_rebuild(input.target_watermark, clock.now()).map_err(map_domain)?;
        projection_store.save_projection_state_successor(current, rebuilding.store_version(), &*uow).await?;
    }
    let report = MemberJobReportAssembly::finish(context.job_kind(), input.committed_fact_refs, projection_refs(), unresolved_refs()).map_err(map_domain)?;
    let result_ref = save_job_report(&stored_results, &context, digest.clone(), record_ref.clone(), report.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(job_completed(report))
}
~~~

事务 / 错误 / 状态 / effect：只从 committed facts/resolutions rebuild；state Rebuilding -> Current 需 coverage/no blocking gap；失败 -> Failed；不改 CP01~06 truth、不关闭 source gaps。
测试切口：source watermark、state version、view immutability、missing source, partial rebuild, duplicate no rebuild, no core truth writes。
停审：pass_with_open_blockers（L2M-UP-004/005）。

### 19.5 GapReconciliationFlow

#### 19.5.1 入口与目标

- 输入：GapReconciliationJobInput { gap_refs, successor_refs, target_watermark }。
- 模块 / 对象：CP07；MemberProjectionState、MemberDiagnosticView。
- 入口：MemberReadModelService::run_gap_reconciliation(MemberOperationContext context, GapReconciliationJobInput input)。
- Port：ExternalResolutionReadPort::get_gap / list_gaps_for_projection；MemberFactReadPort::load_committed_fact；MemberProjectionStore::list_projection_states_affected_by_gap、save_projection_state_successor；stored result / technical Port。

#### 19.5.2 函数级调用图

~~~text
[GapReconciliationJobInput]
  | finite gap/successor proof + digest + reserve
  v
[read committed successors and affected projection states]
  | mark stale / degraded or advance read-side watermark
  v
[save projection state successors + report + commit]
~~~

~~~rust
async fn run_gap_reconciliation(MemberOperationContext context, GapReconciliationJobInput input) -> Result<MemberJobApplicationResult, ApplicationError> {
    validate_gap_input(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::GapReconciliation(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_job_report(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let successors = load_committed_successors(input.successor_refs.clone()).await?;
    let mut advanced = Vec::new();
    for gap_ref in input.gap_refs {
        let states = projection_store.list_projection_states_affected_by_gap(gap_ref.clone(), page_for_update()).await?;
        for state in states.items {
            let successor = state.value.mark_stale(input.target_watermark, SafeReasonCategory::gap_reconciled()).map_err(map_domain)?;
            projection_store.save_projection_state_successor(successor.clone(), state.version, &*uow).await?;
            advanced.push(successor.projection_state_id().into());
        }
    }
    let report = MemberJobReportAssembly::finish(context.job_kind(), input.gap_refs.into_iter().map(MemberJobReportFactRef::Gap).collect(), advanced, unresolved_refs_from(successors)).map_err(map_domain)?;
    let result_ref = save_job_report(&stored_results, &context, digest.clone(), record_ref.clone(), report.clone(), &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(job_completed(report))
}
~~~

事务 / 错误 / 状态 / effect：只能更新 read-side state / diagnostic refs；不创建、关闭或修改 CP04/CP05/CP06 source gap；unknown successor 保持 degraded/unknown；duplicate 只回放 report。
测试切口：finite refs、affected-state lookup、stale/degraded mapping、version conflict、duplicate no repair、source gap immutability。
停审：pass_with_open_blockers（L2M-UP-005/006）。

## 20. Job batch 9.5 stop review

| Job | input/output/report | UoW + duplicate | external / source boundary | gate |
|---|---|---|---|---|
| PublicationRelay | pass_with_open_blockers | pass | pass_with_open_blockers | pass_with_open_blockers |
| ObservationRelay | pass_with_open_blockers | pass | pass_with_open_blockers | pass_with_open_blockers |
| ExternalContextRefresh | pass_with_open_blockers | pass | pass_with_open_blockers | pass_with_open_blockers |
| MemberProjectionRebuild | pass_with_open_blockers | pass | pass | pass_with_open_blockers |
| GapReconciliation | pass_with_open_blockers | pass | pass | pass_with_open_blockers |

批次结论：5 个 Job 均有独立 flow、typed input、report、duplicate replay、状态 / side-effect fence 和测试切口；Job 不创建 scheduler truth、不修复外部/core truth。

### 12.4 ListInteractionGapsFlow

#### 12.4.1 入口与目标

- DTO：ListInteractionGapsBody { subject, filter, page }；response：MemberPagedQueryResponse<InteractionGap>。
- 模块 / 对象：CP05 InteractionTrace；InteractionGap。
- 入口：InteractionTraceService::list_interaction_gaps(MemberOperationContext context, ListInteractionGapsBody body)。
- Port：InteractionTraceStore::list_gaps_by_subject；visibility basis read。

#### 12.4.2 调用图与伪代码

~~~text
[ListInteractionGapsBody] -> [list_interaction_gaps]
  | no-write + gap visibility
  v
[InteractionTraceStore.list_gaps_by_subject]
  v
[Open/Blocked/ResolutionPending/Resolved/Unknown/Superseded page]
~~~

~~~rust
async fn list_interaction_gaps(MemberOperationContext context, ListInteractionGapsBody body) -> Result<MemberPagedQueryResponse<InteractionGap>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Trace).await?;
    if !visibility.is_visible() { return Ok(not_visible_page()); }
    let page = apply_interaction_gap_filter(trace_store.list_gaps_by_subject(body.subject.project_member_ref, body.page.to_repository_page()).await?, body.filter);
    Ok(assemble_gap_page(page))
}
~~~

事务 / 错误 / 状态 / effect：无写；gap 只说明 local missing relation，不自动请求 refresh / repair。
测试切口：filter isolation、status mapping、empty、visibility、no-write。
停审：pass_with_open_blockers（L2M-UP-005）。

### 12.5 GetObservationPostureFlow

#### 12.5.1 入口与目标

- DTO：GetObservationPostureBody { subject, attempt_id, page }；response：MemberPagedQueryResponse<ObservationPostureView>。
- 模块 / 对象：CP05 InteractionTrace；ObservationMaterial、ObservationAttempt。
- 入口：InteractionTraceService::get_observation_posture(MemberOperationContext context, GetObservationPostureBody body)。
- Port：InteractionTraceStore::list_prepared_observation_attempts、get_observation_attempt_with_version、get_observation_material；visibility basis read。

#### 12.5.2 调用图与伪代码

~~~text
[GetObservationPostureBody] -> [get_observation_posture]
  | no-write + observation visibility
  v
[InteractionTraceStore attempt/material reads]
  v
[Prepared/Submitted/FeedbackLinked/Blocked/Unknown page]
~~~

~~~rust
async fn get_observation_posture(MemberOperationContext context, GetObservationPostureBody body) -> Result<MemberPagedQueryResponse<ObservationPostureView>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Observation).await?;
    if !visibility.is_visible() { return Ok(not_visible_page()); }
    let page = match body.attempt_id {
        Some(id) => one_attempt_page(trace_store.get_observation_attempt_with_version(id).await?),
        None => trace_store.list_prepared_observation_attempts(body.page.to_repository_page()).await?,
    };
    Ok(assemble_observation_page(page))
}
~~~

事务 / 错误 / 状态 / effect：无写；Submitted 不表示 observed；backend response 不进入 view。
测试切口：single/list selector、empty、unknown、visibility、no-write。
停审：pass_with_open_blockers（L2M-UP-004/005）。

### 12.6 GetExternalContextResolutionFlow

#### 12.6.1 入口与目标

- DTO：GetExternalContextResolutionBody { subject, source_ref, purpose, scope, consistency }；response：MemberQueryResponse<ExternalContextResolutionReadSurface>。
- 模块 / 对象：CP06 ExternalContextMirror；ExternalContextResolution、ExternalContextSnapshot、ExternalContextGap。
- 入口：ExternalContextMirrorService::get_external_context_resolution(MemberOperationContext context, GetExternalContextResolutionBody body)。
- Port：ExternalResolutionReadPort::find_resolution、get_gap；ExternalContextMirrorStore::get_snapshot_with_version；visibility basis read。

#### 12.6.2 调用图与伪代码

~~~text
[GetExternalContextResolutionBody] -> [get_external_context_resolution]
  | no-write + owner/purpose visibility
  v
[ExternalResolutionReadPort.find_resolution + get_gap]
  | optional snapshot read
  v
[Resolved/Stale/Conflict/Unresolved/Unavailable/Unknown surface]
~~~

~~~rust
async fn get_external_context_resolution(MemberOperationContext context, GetExternalContextResolutionBody body) -> Result<MemberQueryResponse<ExternalContextResolutionReadSurface>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::ExternalContext).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let resolution = resolution_read.find_resolution(body.source_ref, body.purpose, body.scope).await?;
    Ok(assemble_external_resolution_surface(resolution))
}
~~~

事务 / 错误 / 状态 / effect：无写；missing -> NotAvailable；stale/conflict/unresolved 显式返回；不触发 refresh。
测试切口：purpose/scope exact match、missing、stale、visibility、no-write。
停审：pass_with_open_blockers（L2M-UP-006/007）。

### 12.7 ListExternalContextGapsFlow

#### 12.7.1 入口与目标

- DTO：ListExternalContextGapsBody { subject, filter, page }；response：MemberPagedQueryResponse<ExternalContextGap>。
- 模块 / 对象：CP06 ExternalContextMirror；ExternalContextGap。
- 入口：ExternalContextMirrorService::list_external_context_gaps(MemberOperationContext context, ListExternalContextGapsBody body)。
- Port：ExternalResolutionReadPort::list_gaps_for_projection；visibility basis read。

#### 12.7.2 调用图与伪代码

~~~text
[ListExternalContextGapsBody] -> [list_external_context_gaps]
  | no-write + source/purpose visibility
  v
[ExternalResolutionReadPort.list_gaps_for_projection]
  v
[gap page / empty / not-visible]
~~~

~~~rust
async fn list_external_context_gaps(MemberOperationContext context, ListExternalContextGapsBody body) -> Result<MemberPagedQueryResponse<ExternalContextGap>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::ExternalContext).await?;
    if !visibility.is_visible() { return Ok(not_visible_page()); }
    let page = resolution_read.list_gaps_for_projection(body.subject.project_member_ref, body.page.to_repository_page()).await?;
    Ok(assemble_external_gap_page(apply_gap_filter(page, body.filter)))
}
~~~

事务 / 错误 / 状态 / effect：无写；gap status 原样显示；不调用 ExternalContextRefresh 或 save successor。
测试切口：filter/page、empty、status mapping、visibility、no-write。
停审：pass_with_open_blockers（L2M-UP-005/006）。

### 12.8 GetMemberSummaryFlow

#### 12.8.1 入口与目标

- DTO：GetMemberSummaryBody { subject, consistency }；response：MemberQueryResponse<MemberSummaryView>。
- 模块 / 对象：CP07 MemberReadModel；MemberSummaryView、MemberProjectionState、ReadProjectionPolicy。
- 入口：MemberReadModelService::get_member_summary(MemberOperationContext context, GetMemberSummaryBody body)。
- Port：MemberProjectionStore::find_latest_summary_view、find_projection_state_with_version；ProjectionVisibilityBasisReadPort::read_visibility_basis。

#### 12.8.2 调用图与伪代码

~~~text
[GetMemberSummaryBody] -> [get_member_summary]
  | no-write + projection visibility
  v
[MemberProjectionStore.find_latest_summary_view + state]
  | MemberProjectionState.can_serve
  v
[Current/Degraded/Stale/NotReady/NotAvailable surface]
~~~

~~~rust
async fn get_member_summary(MemberOperationContext context, GetMemberSummaryBody body) -> Result<MemberQueryResponse<MemberSummaryView>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Summary).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let view = projection_store.find_latest_summary_view(body.subject.project_member_ref.clone()).await?;
    let state = projection_store.find_projection_state_with_version(body.subject.project_member_ref, MemberProjectionKind::Summary).await?;
    Ok(assemble_summary_surface(view, state, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写；state NotReady/Rebuilding -> NotReady；Stale/Degraded/Failed/Unknown 显式 marker；不 rebuild。
测试切口：state matrix, stale, disabled, visibility, missing view, no-write。
停审：pass_with_open_blockers（L2M-UP-004/005）。

### 12.9 GetCapabilityOutletFlow

#### 12.9.1 入口与目标

- DTO：GetCapabilityOutletBody { subject, filter, consistency }；response：MemberQueryResponse<CapabilityOutletView>。
- 模块 / 对象：CP07 MemberReadModel；CapabilityOutletView、ReadProjectionPolicy。
- 入口：MemberReadModelService::get_capability_outlet(MemberOperationContext context, GetCapabilityOutletBody body)。
- Port：MemberProjectionStore::find_latest_capability_outlet_view、ExternalResolutionReadPort::list_resolutions_for_projection、ToolSafeViewReadPort::read_safe_views、ProjectionVisibilityBasisReadPort::read_visibility_basis。

#### 12.9.2 调用图与伪代码

~~~text
[GetCapabilityOutletBody] -> [get_capability_outlet]
  | no-write + outlet visibility
  v
[ProjectionStore.find_latest_capability_outlet_view]
  | read committed CP06 resolutions + safe refs
  v
[Available/NotAvailable/Stale/Gap/NotVisible]
~~~

~~~rust
async fn get_capability_outlet(MemberOperationContext context, GetCapabilityOutletBody body) -> Result<MemberQueryResponse<CapabilityOutletView>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::CapabilityOutlet).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let view = projection_store.find_latest_capability_outlet_view(body.subject.project_member_ref.clone()).await?;
    let resolutions = resolution_read.list_resolutions_for_projection(body.subject.project_member_ref.clone(), body.filter.to_repository_page()).await?;
    let safe = tool_safe_views.read_safe_views(body.subject.project_member_ref, body.filter.scope(), resolution_ids(resolutions)).await?;
    Ok(assemble_outlet_surface(view, safe, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写；Available 只显示 safe refs；ToolSafeView 不代表 invocation / authorization；source unavailable -> NotAvailable / gap。
测试切口：body-free refs、resolution mismatch、filter、not-authorizing can_invoke、no-write。
停审：pass_with_open_blockers（L2M-UP-004/006）。

### 12.10 GetMemberDiagnosticsFlow

#### 12.10.1 入口与目标

- DTO：GetMemberDiagnosticsBody { subject, filter, consistency }；response：MemberQueryResponse<MemberDiagnosticView>。
- 模块 / 对象：CP07 MemberReadModel；MemberDiagnosticView、MemberProjectionState。
- 入口：MemberReadModelService::get_member_diagnostics(MemberOperationContext context, GetMemberDiagnosticsBody body)。
- Port：MemberProjectionStore::find_latest_diagnostic_view、find_projection_state_with_version；InteractionTraceStore::list_gaps_by_subject；ExternalResolutionReadPort::list_gaps_for_projection；visibility basis read。

#### 12.10.2 调用图与伪代码

~~~text
[GetMemberDiagnosticsBody] -> [get_member_diagnostics]
  | no-write + diagnostic visibility
  v
[ProjectionStore.find_latest_diagnostic_view + state]
  | optional trace/mirror gap reads
  v
[safe low-cardinality diagnostics / empty / not-ready]
~~~

~~~rust
async fn get_member_diagnostics(MemberOperationContext context, GetMemberDiagnosticsBody body) -> Result<MemberQueryResponse<MemberDiagnosticView>, ApplicationError> {
    context.assert_query_no_write()?;
    let visibility = visibility_basis.read_visibility_basis(context.actor(), body.subject.project_member_ref.clone(), MemberProjectionKind::Diagnostic).await?;
    if !visibility.is_visible() { return Ok(not_visible()); }
    let view = projection_store.find_latest_diagnostic_view(body.subject.project_member_ref.clone()).await?;
    let state = projection_store.find_projection_state_with_version(body.subject.project_member_ref, MemberProjectionKind::Diagnostic).await?;
    Ok(assemble_diagnostic_surface(view, state, body.filter, body.consistency))
}
~~~

事务 / 错误 / 状态 / effect：无写；只输出低敏 categories/refs；不输出 logs、prompt、model/tool response、secret、evidence、verdict。
测试切口：optional disabled、not-ready、stale/degraded、visibility、low-sensitive filter、no-write。
停审：pass_with_open_blockers（L2M-UP-005/006）。

## 13. Query batch 9.2 stop review

| Query | no-write | selector / visibility | surface / freshness | gate |
|---|---|---|---|---|
| GetMemberPresence | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetHostCollaborationPosture | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetCurrentSubscriptionScope | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetScreeningDisposition | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetRuntimeMediationPosture | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetRuntimeMaterialReception | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetOutboundDecision | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetPublicationPosture | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetInteractionTrace | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| ListInteractionGaps | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetObservationPosture | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetExternalContextResolution | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| ListExternalContextGaps | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetMemberSummary | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetCapabilityOutlet | pass | pass | pass_with_open_blockers | pass_with_open_blockers |
| GetMemberDiagnostics | pass | pass | pass_with_open_blockers | pass_with_open_blockers |

批次结论：16 个 Query 均有独立 flow、ASCII 图、Rust 风格伪代码、read Port、visibility、freshness / empty / not-ready surface；全部保持 no-write。

## 14. Consumer flows（9.3-a，external CP01~CP05）

### 14.1 HostFeedbackConsumerFlow

#### 14.1.1 入口与目标

- 输入：MemberConsumerEventEnvelope<HostFeedbackConsumerInput> { subject, feedback_ref, attempt_id }；raw host body 必须已在 worker boundary 丢弃。
- 模块 / 对象：CP01 Host；HostCollaborationAttempt。
- 入口：HostCollaborationService::consume_host_feedback(MemberOperationContext context, HostFeedbackConsumerInput input)。
- Port：HostCollaborationStore::get_attempt_with_version、save_attempt_successor；Host feedback source validation；technical digest/UoW/idempotency/result/clock。

#### 14.1.2 调用图与伪代码

~~~text
[Host feedback envelope]
  | source/schema/body gate + digest + reserve
  v
[HostCollaborationStore.get_attempt_with_version]
  | HostCollaborationAttempt.link_feedback or mark late
  v
[save successor + consumer receipt + commit]
~~~

~~~rust
async fn consume_host_feedback(MemberOperationContext context, HostFeedbackConsumerInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_consumer_envelope(&context, &input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::HostFeedback(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let attempt = host_store.get_attempt_with_version(input.attempt_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let successor = if attempt.value.status_is_submitted() { attempt.value.link_feedback(input.feedback_ref).map_err(map_domain)? } else { classify_late_feedback(attempt.value, input.feedback_ref)? };
    host_store.save_attempt_successor(successor, attempt.version, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：反馈 link / late classification 与 receipt 同一 UoW；missing attempt -> Blocked；duplicate 只回放 receipt；状态 Submitted -> FeedbackLinked 或保留 local late gap；不改 presence、host health、session。
测试切口：unsupported schema、body gate、duplicate、late feedback、version conflict、feedback ref mismatch、no host truth mutation。
停审：pass_with_open_blockers（L2M-UP-001/005）。

### 14.2 InboundFactConsumerFlow

#### 14.2.1 入口与目标

- 输入：InboundFactConsumerInput { subject, authority_ref, descriptor, screening_input, inspection_marker }；raw body 不得进入 application。
- 模块 / 对象：CP02 Inbound；InboundFactRecord、ScreeningDecision。
- 入口：InboundBoundaryService::consume_inbound_fact(MemberOperationContext context, InboundFactConsumerInput input)。
- Port：SubscriptionScopeStore::find_current_scope_with_version、InboundStore::append_inbound / append_screening；InboundEventPort::validate_and_inspect；ScreeningRuleSourcePort::resolve_screening_rule；ExternalResolutionReadPort::find_resolution；technical Port。

#### 14.2.2 调用图与伪代码

~~~text
[Inbound envelope + inspection marker]
  | source/schema/body gate + digest + reserve
  v
[scope + rule resolution]
  | InboundFactRecord.record
  | ScreeningDecision.decide
  v
[append fact + screening + receipt + commit]
~~~

~~~rust
async fn consume_inbound_fact(MemberOperationContext context, InboundFactConsumerInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_inspection_marker(input.inspection_marker)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::InboundFact(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let scope = scope_store.find_current_scope_with_version(input.subject.project_member_ref.clone()).await?.ok_or(ApplicationError::BlockedDependency)?;
    let rule = rule_source.resolve_screening_rule(input.subject.project_member_ref.clone()).await?;
    let fact = InboundFactRecord::record(id_generator.new_inbound_fact_record_id(), input.source_event_ref(), input.authority_ref, &scope.value, InboundIntakeDisposition::Accepted, input.inspection_marker, context.correlation(), clock.now()).map_err(map_domain)?;
    let screening = ScreeningDecision::decide(id_generator.new_screening_decision_id(), &fact, &scope.value, &rule.value, input.screening_input, input.source_refs(), &screening_policy, safe_reason_from_rule(&rule.value)).map_err(map_domain)?;
    inbound_store.append_inbound(fact.clone(), &*uow).await?;
    inbound_store.append_screening(screening.clone(), &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：scope / rule 缺失 -> Blocked；inspection 非 Clean -> Rejected；duplicate source event -> Duplicate receipt；InboundIntakeDisposition 与 ScreeningDisposition 分开保存；不保存 raw body。
测试切口：body gate、unsupported source、duplicate, scope mismatch, rule stale, screening dispositions, atomic fact/screening write。
停审：pass_with_open_blockers（L2M-UP-005/006/007）。

### 14.3 RuntimeMaterialConsumerFlow

#### 14.3.1 入口与目标

- 输入：RuntimeMaterialConsumerInput { subject, material_ref, outcome_ref, source_ref, metadata }，metadata 必须 body-free。
- 模块 / 对象：CP03 Runtime；RuntimeMaterialReception。
- 入口：RuntimeMediationService::consume_runtime_material(MemberOperationContext context, RuntimeMaterialConsumerInput input)。
- Port：RuntimeMaterialSourcePort::validate_material、RuntimeMediationStore::append_reception；technical Port。

#### 14.3.2 调用图与伪代码

~~~text
[Runtime committed material envelope]
  | validate source/schema/body + digest + reserve
  v
[RuntimeMaterialSourcePort.validate_material]
  | RuntimeMaterialReception.receive
  v
[append reception + receipt + commit]
~~~

~~~rust
async fn consume_runtime_material(MemberOperationContext context, RuntimeMaterialConsumerInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_runtime_material_envelope(&input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::RuntimeMaterial(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let verified = material_source.validate_material(input.material_ref.clone(), input.outcome_ref.clone(), input.source_ref.clone(), input.metadata.clone()).await?;
    let reception = RuntimeMaterialReception::receive(id_generator.new_runtime_material_reception_id(), input.material_ref, input.outcome_ref, input.source_ref, input.metadata, clock.now(), &runtime_policy).map_err(map_domain)?;
    runtime_store.append_reception(reception.clone(), &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：source validation failure -> Blocked/Unknown；Accepted reception 才能进入 CP04；Late/Duplicate 不覆盖 current；不复制 Runtime context/plan/outcome/tool body。
测试切口：body-free validation、duplicate/late、source mismatch、metadata integrity、receipt replay、no Runtime truth write。
停审：pass_with_open_blockers（L2M-UP-003/004/005）。

### 14.4 DeliveryFeedbackConsumerFlow

#### 14.4.1 入口与目标

- 输入：DeliveryFeedbackConsumerInput { subject, feedback_ref, attempt_id }。
- 模块 / 对象：CP04 Outbound；PublicationAttempt、PublicationGap。
- 入口：OutboundBoundaryService::consume_delivery_feedback(MemberOperationContext context, DeliveryFeedbackConsumerInput input)。
- Port：OutboundStore::get_attempt_with_version、get_gap_with_version、save_attempt_successor、save_gap_successor；DeliveryFeedbackSourcePort::validate_feedback；technical Port。

#### 14.4.2 调用图与伪代码

~~~text
[Delivery feedback envelope]
  | validate + digest + reserve
  v
[DeliveryFeedbackSourcePort.validate_feedback]
  | PublicationAttempt.link_feedback / PublicationGap.resolve
  v
[save successors + receipt + commit]
~~~

~~~rust
async fn consume_delivery_feedback(MemberOperationContext context, DeliveryFeedbackConsumerInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_consumer_envelope(&context, &input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::DeliveryFeedback(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let attempt = outbound_store.get_attempt_with_version(input.attempt_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let feedback = feedback_source.validate_feedback(input.feedback_ref.clone()).await?;
    let successor = attempt.value.link_feedback(feedback.value).map_err(map_domain)?;
    outbound_store.save_attempt_successor(successor, attempt.version, &*uow).await?;
    save_matching_gap_successor_if_present(input.attempt_id, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：feedback failure only changes local gap; it never means delivered; unknown feedback -> Unknown / gap; duplicate receipt replay; no outbound decision rewrite.
测试切口：feedback validation, late feedback, attempt mismatch, gap successor, duplicate, version conflict, no delivery claim.
停审：pass_with_open_blockers（L2M-UP-001/005）。

### 14.5 ObservationFeedbackConsumerFlow

#### 14.5.1 入口与目标

- 输入：ObservationFeedbackConsumerInput { subject, feedback_ref, attempt_id }。
- 模块 / 对象：CP05 InteractionTrace；ObservationAttempt、InteractionGap。
- 入口：InteractionTraceService::consume_observation_feedback(MemberOperationContext context, ObservationFeedbackConsumerInput input)。
- Port：InteractionTraceStore::get_observation_attempt_with_version、get_gap_with_version、save_observation_attempt_successor、save_gap_successor；ObservationFeedbackSourcePort::validate_feedback；technical Port。

#### 14.5.2 调用图与伪代码

~~~text
[Observation feedback envelope]
  | validate + digest + reserve
  v
[ObservationFeedbackSourcePort.validate_feedback]
  | ObservationAttempt.link_feedback / gap successor
  v
[save successors + receipt + commit]
~~~

~~~rust
async fn consume_observation_feedback(MemberOperationContext context, ObservationFeedbackConsumerInput input) -> Result<MemberConsumerApplicationResult, ApplicationError> {
    validate_consumer_envelope(&context, &input)?;
    let digest = digest_port.request_digest(&context, &MemberCanonicalDigestInput::ObservationFeedback(input.clone()))?;
    let uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(&context, digest, &*uow).await?;
    if let MemberIdempotencyReservation::Duplicate { result_ref, .. } = &reservation { return replay_consumer(result_ref.clone(), &*uow).await; }
    let record_ref = reserved_record_ref(&reservation)?;
    let attempt = trace_store.get_observation_attempt_with_version(input.attempt_id.clone()).await?.ok_or(ApplicationError::NotAvailable)?;
    let feedback = observation_feedback.validate_feedback(input.feedback_ref.clone()).await?;
    let successor = attempt.value.link_feedback(feedback.value).map_err(map_domain)?;
    trace_store.save_observation_attempt_successor(successor, attempt.version, &*uow).await?;
    let result_ref = save_consumer_receipt(&context, digest, &reservation, receipt, &*uow).await?;
    complete_reserved(&idempotency, record_ref.clone(), result_ref, &*uow).await?;
    uow_manager.commit(uow).await?;
    Ok(consumer_accepted())
}
~~~

事务 / 错误 / 状态 / effect：Submitted -> FeedbackLinked 只表示 feedback ref 已链接；不表示 observed / evidence；unknown 形成 local gap。
测试切口：feedback source gate、duplicate、late, version conflict, gap linkage, no observability backend access。
停审：pass_with_open_blockers（L2M-UP-005）。

## 27. Final authoritative Step 9 gate

本节位于所有补写 flow 之后，是本文件唯一的最终状态声明。10 Command、16 Query、14 Consumer、24 blocked semantic candidate、5 Job 均已逐项覆盖；跨 flow 审计已记录，正式正文仍禁止写入。

| 项目 | 最终状态 |
|---|---|
| Step 9 function flows | completed / pass_with_upstream_blockers |
| 10 Command | 10/10 completed |
| 16 Query | 16/16 completed；全部 no-write |
| 14 Consumer | 14/14 completed；typed receipt replay |
| 24 semantic event candidates | 24/24 blocked by L2M-UP-005 |
| 5 Operations Job | 5/5 completed；typed report replay |
| cross-flow transaction/state/outbox audit | completed with upstream blockers |
| next allowed step | Step 10 current authorized continuation |
| Step 10 file | authorized; pending separate calibration file creation |
| formal 03 write | not allowed |
| implementation / commit | not allowed / none |

最终停审项：DTO 构造、Step 6 object、Step 7 Port、UoW、错误映射、state/effect、测试切口均已逐 flow 记录；L2M-UP-001~008 与 L2M-DDD-001~002 继续开放。Step 10 已获当前“继续”授权，后续状态矩阵在独立中间产物中执行；本文件不再扩写。
