# L4-observability 03-详细设计 Step 09 · 逐接口函数级处理流

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 09
> 回填章节: `03-详细设计.md` §8 逐接口函数级处理流
> 当前模式: full-restart
> 当前门禁: Step 09 完成后停审,等待用户确认后才进入 Step 10

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 09 `定义逐接口函数级处理流` |
| 输出文件 | `design-calibration/03_ddd_step_09_function_flows.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | `completed_design_record_with_affected_open`;逐协议权威卡见 `03_ddd_step_09_exact_flow_cards.md` |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | wait_user_confirmation_before_step_10 |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 09 | 已读取 | 约束每个 Command / Query / Event / Job 独立处理流、调用图、伪代码、事务、错误、状态 / 事件副作用和测试切口 |
| `standards/document/详细设计书写规范.md` 5.8 | 已读取 | 约束处理流总表、单 flow 固定结构、ASCII 调用图、Rust 风格伪代码和回填章节 |
| `design-calibration/03_ddd_step_05_module_contracts.md` | 已完成 | 提供 10 个业务组成部分和 `api` / `worker` / `jobs` entry 到 application service 的边界 |
| `design-calibration/03_ddd_step_06_object_contracts.md` | 已完成 | 提供对象 factory、transition method、policy guard、state enum、history / record object |
| `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 application service façade、repository、projection store、idempotency、stored result、outbox、resolver、publisher、handoff/export delivery port |
| `design-calibration/03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event、9 Operations Job 的 request / response / payload / report schema |
| `design-calibration/03_ddd_step_09_exact_flow_cards.md` | current authoritative supplement | 为 C01-C16、Q01-Q14、I01-I09、E01-E12、J01-J09 提供 60 张独立 exact-flow card；本文件的共享模板与汇总表不得替代这些卡片 |
| `design-calibration/02_hld_step_08_processing_flows.md` | 已完成 | 提供通用 Command / Query / Consumer / Job 路径、10 个关键处理流族和 no-write / body-free 边界 |
| `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md` | 已读取 | 作为 2826 行逐 flow、共享模板、停审和跨 flow audit 粒度参考,不复制 Governance truth |
| `projects/L1-artifact/design-calibration/03_ddd_step_09_function_flows.md` | 已读取 | 作为 1897 行 flow inventory、Command / Query / Consumer / Job 批次和 final audit 粒度参考,不复制 Artifact truth |
| 旧 `03_ddd_step_09_function_flows.md` | historical material | 旧文件仅 72 行,使用 `IngestObservationMaterialCommand`、`ObservationEnvelope`、hash / metric / trace schema 心智;本步全量替换 |

## 3. 本步目标

把 Step 08 已定义的 16 个 Command、14 个 Query、9 个 Inbound Event Consumer、12 个 Outbound Event 和 9 个 Operations Job 全部收口成可落码的函数级处理流。

本步必须为每条 flow 明确:

- public DTO 如何进入 handler / worker / job entry 和 application service。
- idempotency / duplicate replay 在哪里 reserve、读取和完成。
- DTO 在哪一步被校验、派生、转换或用于构造 Step 06 Domain 对象。
- 哪些 Step 07 repository / projection / resolver / publisher / delivery / outbox port 被调用。
- 哪些 Step 06 domain factory、member method 和 policy guard 被调用。
- UnitOfWork 在哪里 begin / commit / rollback。
- accepted path 保存 truth、marker、history、outbox payload snapshot、projection stale marker、stored result 的顺序。
- rejected / duplicate / delayed / unsupported / partial failure / no-op 分支的返回 surface。
- 每条 flow 的状态与事件副作用和测试切口。

本步不定义:

- 完整状态转换矩阵和非法转换处理,留给 Step 10。
- persistence table、index、isolation、DDL 和 durable transaction 细节,留给 Step 11。
- 错误码全集、HTTP / RPC / worker exit 映射,留给 Step 12。
- retry interval、dead-letter policy、幂等窗口和并发锁细节,留给 Step 13。
- transport route、topic、cron、config key 和产品绑定,留给 Step 14 / `04`。
- 正式 `03-详细设计.md` 装配,留给 Step 19。

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些协议必须拥有函数级处理流? | Step 08 中所有 16 Command、14 Query、9 Inbound Event Consumer、12 Outbound Event payload append / publish 规则、9 Operations Job 均必须覆盖。 |
| 处理流如何分批? | 按 shared templates、Command flow、Query flow、Inbound Consumer flow、Outbound append / publish flow、Operations Job flow、final audit 七批。Command / Query 内按业务组成部分拆组。 |
| 每个处理流入口函数是什么? | `api` command / query handler -> Step 07 application service façade;`worker` consumer / publication loop -> inbound / publication service;`jobs` runner -> maintenance service。 |
| 入口 DTO 如何进入对象构造? | Step 08 request / envelope / job input 先转 application input,再通过 repository lookup、resolver snapshot、id generator、clock 和 domain policy 构造 Step 06 object。 |
| 缺字段在哪里返回错误或恢复? | metadata / envelope 必填缺失在 entry validation reject;domain 必填缺失在 application validation reject / delayed / gap / quarantine;external dependency unavailable 进入 delayed / partial / retryable surface。 |
| 事务在哪里开始和提交? | Command accepted path、Consumer accepted path、Job mutation path、Outbox publication marker update 使用 `ObservationUnitOfWorkManager.begin()`;Query 不开启写事务。 |
| 哪些状态会修改? | Command / Consumer / Job 只能修改 Step 06 observation-owned truth、marker、history、projection / maintenance / delivery / snapshot state;Query 只读。 |
| 哪些事件会写入? | Accepted mutation 在同一 UoW 内构造 `ObservationOutboundEventPayloadSnapshot` 并 append outbox;publisher 只发布 stored snapshot。 |
| 每个处理流测试切口是什么? | 每条 flow 至少包含 accepted / duplicate / invalid input 或 missing dependency / boundary violation / no-write 或 not-visible / stale 分支。 |
| 是否存在跨 flow 事务 / 状态 / outbox 冲突? | 本步 final audit 检查: outbox snapshot immutability、Query no-write、Job no-repair、Consumer no external truth、report no signoff、stored result replay 一致。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 Step 09 | 只有 72 行,只写 8 条泛化 flow,远低于 L1-governance 2826 行和 L1-artifact 1897 行粒度 | 全量替换,按 Step 08 全协议清单展开 |
| 旧 Step 09 | 使用 `IngestObservationMaterialCommand`、`ObservationEnvelope`、metric / trace / hash chain 心智 | 降级为 historical material,改用 Step 08 当前协议和 Step 06 / 07 当前对象 / port |
| 旧 Step 09 | 只给一个 ingest 伪代码,没有逐接口 handler / service / port / domain / tx / outbox / test 切口 | 当前每个 flow 给入口、调用图、伪代码、事务、错误、状态 / 事件、副作用、测试和停审 |
| 旧 Step 09 | Query no-write 和 Job no-repair 只写原则,没有 port / response surface 绑定 | 当前 Query 和 Job flow 显式回指 Step 07 read service / maintenance service 和 Step 08 surface |
| 旧正式 `03-详细设计.md` | 仍是 historical material | 本步不装配正式文档,只提供回填草稿 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 为 60 个协议全部写完整长伪代码 | 最细 | 文档会超过可审查范围,且同构重复会掩盖差异 | 不采用 |
| B. 只写 10 个概要流族 | 篇幅短 | 不满足 Step 09 “每个协议独立处理流”要求,实现者仍需猜字段和端口 | 不采用 |
| C. 共享模板 + 独立 exact-flow card + 代表性伪代码 + per-batch stop-review | 覆盖完整,同时避免复制噪声 | 需要严格 closure audit | 采用；独立卡移至 `03_ddd_step_09_exact_flow_cards.md`，本文件模板仅解释共性顺序 |
| D. 在 Step 09 中补 DDL、retry policy、transport route | 看似更落地 | 越过 Step 11 / 13 / 14 边界 | 不采用 |

## 7. 结构化中间产物

### 7.1 Step 9 写入批次状态表

| 批次 | Flow 族 | 内容 | 状态 |
|---|---|---|---|
| 9.0 | shared flow discipline | Step 状态、输入、SOP 回答、诊断、取舍、flow inventory、共享模板 | done |
| 9.1 | Command flows | 16 张独立 exact-flow card；本文件 §8 的长 flow 作为解释性基线 | done_with_affected_open |
| 9.2 | Query flows | 14 张独立 exact-flow card；本文件 §9 的表作为解释性基线 | done_with_affected_open |
| 9.3 | Inbound Consumer flows | 9 张独立 exact-flow card；本文件 §10 的 shared consumer 顺序不得替代逐协议卡 | done_with_affected_open |
| 9.4 | Outbound Event append / publish | 12 张独立 exact-flow card；J01 发布边界单独记录 | done_with_affected_open |
| 9.5 | Operations Job flows | 9 张独立 exact-flow card，含 J01 publication 与 J02-J09 maintenance/delivery | done_with_affected_open |
| 9.6 | final audit | 60 项覆盖、cross-flow transaction/state/outbox/query/job/no-write closure；未决 affected 保留 | done_with_affected_open |

### 7.2 Flow inventory

#### 7.2.1 Command flow inventory

| Flow | 协议 DTO | Service | 目标对象 | 主要 port | 状态 / 副作用 | 停审状态 |
|---|---|---|---|---|---|---|
| `SubmitObservationMaterialFlow` | `SubmitObservationMaterialRequest` | `ObservationTruthWriteService.submit_observation_material` | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` | intake repo;source resolver;idempotency;stored result;outbox | receipt received/accepted/rejected/quarantined;intake event | pass_with_affected_open |
| `RecordSafetyDispositionFlow` | `RecordSafetyDispositionRequest` | `record_safety_disposition` | `SafetyDisposition`;`IntakeDecisionRecord` | intake repo;idempotency;outbox | safety pending -> safe/redacted/rejected/quarantined | pass_with_affected_open |
| `BindCorrelationContextFlow` | `BindCorrelationContextRequest` | `bind_correlation_context` | `CorrelationContext`;`CorrelationLinkRecord` | intake repo;correlation repo;idempotency;outbox | correlation unbound -> bound/partial/invalid | pass_with_affected_open |
| `RecordSafeSignalFlow` | `RecordSafeSignalRequest` | `record_safe_signal` | `SafeSignal`;`SignalRollupWindow`;`CorrelationLinkRecord` | correlation repo;runtime resolver;idempotency;outbox | signal candidate -> recorded/suppressed/stale;rollup stale | pass_with_affected_open |
| `AppendAuditProjectionFlow` | `AppendAuditProjectionRequest` | `append_audit_projection` | `AuditProjection`;`AuditAppendRecord` | audit repo;correlation repo;idempotency;outbox | projection pending -> appended/restricted | pass_with_affected_open |
| `LinkBodyFreeEvidenceFlow` | `LinkBodyFreeEvidenceRequest` | `link_body_free_evidence` | `EvidenceLinkage`;`AuditAppendRecord` | audit repo;evidence resolver;idempotency;outbox | linkage candidate -> linked/body-blocked/not-visible/stale | pass_with_affected_open |
| `PrepareReportHandoffFlow` | `PrepareReportHandoffRequest` | `prepare_report_handoff` | immutable `EvidenceIndexInputView`;`ReportHandoffRecord`;`HandoffLifecycleRecord` | handoff repo;audit repo;idempotency;outbox | validate/save input;handoff draft -> prepared/blocked | pass_with_affected_open |
| `EvaluateAuthenticityHintFlow` | `EvaluateAuthenticityHintRequest` | `evaluate_authenticity_hint` | `AuthenticityHint`;`HandoffLifecycleRecord` | handoff repo;audit repo;idempotency;outbox | hint unassessed -> real/placeholder/insufficient | pass_with_affected_open |
| `SetRetentionMarkerFlow` | `SetRetentionMarkerRequest` | `set_retention_marker` | `RetentionMarker`;`RetentionChangeRecord` | retention repo;idempotency;outbox | unmarked -> hold/release/conflict | pass_with_affected_open |
| `ProtectActiveReferenceFlow` | `ProtectActiveReferenceRequest` | `protect_active_reference` | `ActiveReferenceProtection`;`RetentionChangeRecord` | retention repo;idempotency;outbox | unprotected -> protected/conflicted | pass_with_affected_open |
| `DefineReplayScopeFlow` | `DefineReplayScopeRequest` | `define_replay_scope` | `ReplayScope`;`ReplayExecutionRecord` | retention repo;maintenance repo;idempotency;outbox | scope defined/approved/blocked | pass_with_affected_open |
| `RecordNoWriteViolationFlow` | `RecordNoWriteViolationRequest` | `record_no_write_violation` | `NoWriteViolation`;`NoWriteViolationRecord` | retention repo;idempotency;outbox | violation detected -> blocked/escalated/closed | pass_with_affected_open |
| `RecordGapStateFlow` | `RecordGapStateRequest` | `record_gap_state` | `GapState`;`DegradedOutputState`;`GapTransitionRecord` | retention repo;projection store;idempotency;outbox | gap open/ack/resolved/suppressed | pass_with_affected_open |
| `PrepareExternalAuditExportFlow` | `PrepareExternalAuditExportRequest` | `prepare_external_audit_export` | `ExternalAuditExportPreparation`;`PeripheralDeliveryState`;`PeripheralDeliveryRecord` | projection store;handoff/export ports later;idempotency;outbox | export draft -> prepared/blocked | pass_with_affected_open |
| `RegisterReferenceSnapshotFlow` | `RegisterReferenceSnapshotRequest` | `register_reference_snapshot` | `ReferenceSnapshotState`;`ReferenceRefreshRecord` | reference repo;resolver;idempotency;outbox | snapshot pending/resolved/stale/unresolved | pass_with_affected_open |
| `UpdateReferenceSnapshotStateFlow` | `UpdateReferenceSnapshotStateRequest` | `update_reference_snapshot_state` | `ReferenceSnapshotState`;`ReferenceRefreshRecord` | reference repo;idempotency;outbox | snapshot transition / refresh record | pass_with_affected_open |

#### 7.2.2 Query / Consumer / Outbound / Job flow inventory

| Flow family | Flow count | 主要 port | 状态 / 副作用 | 停审状态 |
|---|---:|---|---|---|
| read-only query flows | 14 | read service、truth repositories、projection store、visibility policy | read-only;visibility/freshness/missing/degraded surface | pass_with_affected_open |
| inbound consumer flows | 9 | inbound service、idempotency、intake/audit/reference/retention repositories、stored result | receipt / marker / snapshot / gap / history only;no external truth | pass_with_affected_open |
| outbound append / publication flows | 12 payload append + 1 publication job | outbox repository、payload snapshot builder、publication service、publisher | stored payload snapshot and publication state | pass_with_affected_open |
| operations job flows | 9 total: J01 publication + J02-J09 maintenance/delivery | maintenance service、projection/reference/retention/handoff/export ports、stored result | derived state / report / progress / delivery only | pass_with_affected_open |

### 7.2.3 Exact-flow closure binding

`03_ddd_step_09_exact_flow_cards.md` 是逐协议的唯一 closure index。本文件的 shared template、代表性伪代码和 inventory 只能解释共性顺序，不能替代 exact card。每个协议必须沿下表进入对应 card，再沿 card 的 affected owner 继续读取 Step 10~15 的 closure。

| 协议族 | 数量 | exact card 范围 | 当前权威状态 | 允许的解释 |
|---|---:|---|---|---|
| Command | 16 | C01-C16 | `defined_with_affected_open` | 可编码的 entry、domain、port、UoW 和 result 顺序已记录；owner gap 不得猜补 |
| Query | 14 | Q01-Q14 | `defined_with_affected_open` | committed read 与 strict no-write 已记录；read carrier / surface affected 仍开放 |
| Inbound Consumer | 9 | I01-I09 | `defined_with_affected_open` | header-before-payload、local landing、worker action 分离已记录；上游 schema/action/UoW affected 保留 |
| Outbound Event | 12 | E01-E12 | `defined_with_affected_open` | accepted UoW typed encoder 与 immutable snapshot 已记录；producer/binding affected 保留 |
| Operations Job | 9 | J01-J09 | `defined_with_affected_open` | J01 publication 与 J02-J09 maintenance/delivery 分开；claim/report/external phase affected 保留 |
| 合计 | 60 | C01-C16 + Q01-Q14 + I01-I09 + E01-E12 + J01-J09 | `60/60 recorded`, `0/60 unconditional complete` | 只表示设计记录存在，不表示实现、运行、测试或验收 |

### 7.3 Shared command transaction template

所有 accepted Command flow 必须按下列顺序编排。具体 command 可跳过不适用的 repository 或 history object,但不得改变 idempotency、truth / marker save、history、outbox snapshot、projection stale、stored result 的相对语义。

#### 函数级调用图: SharedCommandAcceptedPath

```text
[API handler]
  | call handle(ObservationCommandRequest<T> request)
  | static-map command_name + concrete body to ObservationCommandOperation
  | canonicalize stable digest;call ObservationOperationContextFactory.for_command(operation,metadata)
  v
[ObservationTruthWriteService]
  | tx begin ObservationUnitOfWorkManager.begin()
  | call ObservationIdempotencyRepository.reserve_or_load(context,tx)
  | branch Acquired/Replay/Conflict/InFlight before domain transition
  v
[Load and guard]
  | call get_*_with_version(...) or resolver.resolve_*(...)
  | call Step 6 policy guard
  v
[Domain object]
  | call Object::factory(...)
  | call object.transition(...)
  v
[Repository + Outbox + Result]
  | save changed object with expected_version
  | append history record
  | assign one ObservationCursor and wrap ObservationCommittedCursor::Observation for this UoW
  | call ObservationProjectionStore.record_committed_sources(...)
  | resolve exact outbound event binding from injected ExternalEffectBindingCatalog
  | append ObservationOutboxRecord with stored payload snapshot
  | call ObservationProjectionStore.mark_views_stale(...)
  | save StoredObservationResult and complete idempotency
  | tx commit
```

关键说明:
- 图表达所有 accepted Command 的固定事务顺序。
- 图不表达每个业务对象的具体状态转换矩阵,Step 10 继续展开。
- publisher 不在 command transaction 中发布事件,只追加 stored payload snapshot。

```rust
// [ObservationUnitOfWorkManager.begin()]
// 开启 accepted command 的唯一写事务。
let tx = unit_of_work.begin().await?;

// [ObservationIdempotencyRepository.reserve_or_load(ObservationOperationContext context, &dyn ObservationUnitOfWork tx)]
let reserve_outcome = idempotency_repo
    .reserve_or_load(context.clone(), tx.as_ref())
    .await?;

let reservation = match reserve_outcome {
    ObservationIdempotencyReserveOutcome::Acquired(reservation) => reservation,
    ObservationIdempotencyReserveOutcome::Replay { result_ref, .. } => {
        // [ObservationUnitOfWork.rollback()]
        unit_of_work.rollback(tx).await?;
        let stored_result = stored_result_repo
            .get_result(result_ref)
            .await?
            .ok_or(ApplicationError::CompletedReservationResultMissing)?;
        validate_stored_result_compatibility(&context, &stored_result)?;
        return stored_result.into_replayed_response();
    }
    ObservationIdempotencyReserveOutcome::Conflict { .. } => {
        unit_of_work.rollback(tx).await?;
        return Err(ApplicationError::IdempotencyConflict);
    }
    ObservationIdempotencyReserveOutcome::InFlight { .. } => {
        unit_of_work.rollback(tx).await?;
        return Err(ApplicationError::IdempotencyInFlight);
    }
};

// [DomainObject::factory(...)] and [domain_object.transition(...)]
// 具体对象由各 flow 卡指定。Domain errors retain their typed variant and are
// mapped without message parsing at the application boundary.
build_and_transition_domain_object(...).map_err(ApplicationError::Domain)?;

// [ObservationProjectionMembershipPlanner.plan_updates(...)]
// Include direct object changes and formal relation changes,so existing sources can
// enter or leave scopes even when their own domain row did not change.
let source_index_updates = projection_membership_planner
    .plan_updates(
        ProjectionSourceChangeSet {
            changed_items: changed_projection_sources,
            affected_relation_anchors,
            first_index_observed_at: operation_observed_at,
        },
        tx.as_ref(),
    )
    .await?;

// [ObservationUnitOfWork.assign_observation_cursor()]
// truth/state/history 已 staged 后分配;后续 outbox、stale marker 和 replay surface 共享该 cursor。
let observation_cursor = tx.assign_observation_cursor()?;
let committed_cursor = ObservationCommittedCursor::Observation(observation_cursor.clone());

// [ObservationProjectionStore.record_committed_sources(...)]
projection_store
    .record_committed_sources(
        source_index_updates,
        committed_cursor.clone(),
        tx.as_ref(),
    )
    .await?;

// [ObservationOutboxRepository.append(ObservationOutboxRecord record, ObservationOutboxPayloadSnapshot payload, &dyn ObservationUnitOfWork tx)]
outbox_repo
    .append(outbox_record, payload_snapshot, tx.as_ref())
    .await?;

// [ObservationStoredResultRepository.save_result(StoredObservationResult result, &dyn ObservationUnitOfWork tx)]
let result_ref = stored_result_repo
    .save_result(stored_result, tx.as_ref())
    .await?;

// [ObservationIdempotencyRepository.mark_completed(ObservationIdempotencyReservation reservation, StoredObservationResultRef result_ref, &dyn ObservationUnitOfWork tx)]
idempotency_repo
    .mark_completed(reservation, result_ref, tx.as_ref())
    .await?;

// [ObservationUnitOfWork.commit()]
unit_of_work.commit(tx).await?;
```

`plan_updates` 在当前accepted UoW内读取old membership rows和staged + committed typed relations,因此能处理“新evidence input使既有audit/evidence加入handoff scope”或“relation移除使未直接修改的source退出scope”等间接影响。`affected_relation_anchors`必须由每个flow显式提供before + after typed roots,不能只传new relation；例如handoff evidence input变化同时携带该handoff和旧/新audit subject roots。planner按source ref canonical排序并拒绝重复,已有source复用stable `source_observed_at`,首次source使用operation-scoped boundary time；合法输出可含`memberships=[]`表示full withdrawal。planner不分配cursor、不写index；真正写入仍在唯一cursor分配后由`record_committed_sources`完成。

| 步骤 | 必须使用的正式契约 | 禁止事项 |
|---|---|---|
| metadata / context | Step 08 `ObservationCommandMetadata`;Step 06 `ObservationOperationContext` | handler 不得绕过 context factory |
| idempotency | Step 07 `ObservationIdempotencyRepository`;`ObservationStoredResultRepository` | duplicate 不得重跑 domain transition |
| mutation read | Step 07 `get_*_with_version` / `find_*` / resolver port | 不得用 timestamp、page cursor 或 hard-coded version 充当 expected_version |
| domain transition | Step 06 object factory / method / policy | application 不得直接改字段绕过 domain |
| outbox | Step 07 `ObservationOutboxRepository.append`;Step 08 payload snapshot;Step 14 `ExternalEffectBindingCatalog` | accepted UoW 必须按 event name 冻结 binding ref；publisher 不得回查 current truth 或 current route 构造 payload |
| projection stale | Step 07 `ObservationProjectionStore.mark_views_stale` | 不得拼接 ad hoc view ref |
| stored result | Step 06 `StoredObservationResult`;Step 07 stored result port | accepted command 不得只返回内存 result |

### 7.4 Shared query read template

所有 public Query flow 保持 read-only。Query 可以读取 truth、projection、reference state、history、diagnostic、report 和 view state,但不得刷新 snapshot、重建 projection、append history、创建 outbox 或保存 stored result。

#### 函数级调用图: SharedQueryReadOnlyPath

```text
[API handler]
  | call handle(ObservationQueryRequest<T> request)
  | validate query_name <-> concrete body route
  | derive RequestDigest from normalized query_name + metadata + body
  | call ObservationOperationContextFactory.for_query(actor_ref,request_digest,trace_ref)
  | lossless-map visibility_scope_ref / consistency / requested_at into concrete input
  v
[ObservationReadService]
  | call read repository or ObservationProjectionStore.get_*(...)
  | call ReadVisibilityPolicy.assert_can_read(...)
  v
[Response assembler]
  | map domain/view to Step 08 public response DTO
  | attach ObservationQuerySurface visibility/freshness/degraded/missing
  v
[API handler]
  | return ObservationQueryResponse<T> or ObservationPublicPage<T>
```

关键说明:
- Query 不开启写事务。
- not-visible / stale / missing / rebuilding / disabled 是 response surface,不是后台修复触发器。
- 若 Query 需要 page,只能把 public page DTO 映射到 Step 07 application-local page helper。
- `DiagnosticRequestContextRef` 只关联一次 Query;diagnostic projection lookup 必须使用 request body 的 canonical `ObservationProjectionScope`。

```rust
// [ObservationReadService.get_observation_read_model(GetObservationReadModelInput input)]
// Query service 只读取 projection,不 refresh / repair。
let view = projection_store.get_observation_read_model(input.scope).await?;

// Visibility inputs are assembled from this request's metadata and the loaded view scope.
let surface = read_visibility_policy.assert_can_read(request_context, visibility)?;

// [ObservationQueryResponse<T>::from_surface(...)]
return Ok(ObservationQueryResponse {
    query_name,
    surface: query_surface,
    body: visible_body,
});
```

### 7.5 Shared inbound consumer template

Inbound consumer accepted path 写本地 observation-side receipt、marker、snapshot、projection input、handoff / delivery state、gap / stale marker 或 history。Consumer 不写外部业务 truth,不复制外部 body。

#### 函数级调用图: SharedConsumerAcceptedPath

```text
[Worker consumer]
  | call handle(ObservationInboundEventEnvelope<T> envelope)
  | validate source_event_ref + source_ref + optional source_version + schema_version + dedup_key
  | static-map consumer route;canonicalize digest excluding occurred_at/trace/delivery attempt
  v
[ObservationInboundEventService]
  | tx begin
  | call ObservationIdempotencyRepository.reserve_or_load(context,tx)
  | branch Acquired/Replay/Conflict/InFlight;source-event secondary unique applies atomically
  v
[Domain / repository]
  | map payload to local receipt / marker / snapshot / gap
  | save local state and history
  | assign observation cursor,or reference cursor for reference-only change
  | record committed typed source membership / source_observed_at / scope positions
  | resolve exact outbound event binding when a local committed event is emitted
  | append outbox snapshot when local committed fact changed
  | mark affected views stale with the assigned cursor
  | save consumer receipt and stored result
  | tx commit
```

关键说明:
- Payload 不得重复 envelope 或 source-version 字段。
- unsupported schema 不解析 payload,不写业务 state。
- duplicate replay 返回 stored `ObservationConsumerReceipt`,不得重写 snapshot 或 gap。
- old source version不得写local snapshot/projection/outbox；`occurred_at`不得替代source version。

### 7.6 Shared operations job template

Operations Job 使用 stored job report 支持 duplicate replay。Job body 只维护 outbox、projection、rollup、snapshot、gap、replay coordination、handoff / export preparation、progress view 或 publication state。

#### 函数级调用图: SharedJobMutationPath

```text
[Jobs entry]
  | call handle(ObservationJobRequest<T> request)
  | static-map job_name + concrete input to ObservationJobOperation
  | canonicalize stable digest excluding requested_at/job_execution_ref
  | call ObservationOperationContextFactory.for_job(operation,metadata)
  v
[ObservationMaintenanceService or ObservationPublicationService: start UoW]
  | reserve_or_load context;branch Acquired/Replay/Conflict/InFlight
  | on Acquired:freeze exact bounded ObservationJobExecutionPlan + relevant JobExecutionConfigSnapshot
  | external Job resolves consumer/event binding once and freezes the exact effect binding ref
  | create durable plan + ObservationJobReportDraft + target binding/progress
  | commit start UoW
  v
[Job body: zero or more item UoWs]
  | acquire global typed item claim and fresh fencing token
  | load only immutable plan item + committed facts / snapshots / markers / outbox
  | call policy guard
  | perform resolver / publisher / delivery call outside database UoW when applicable
  | begin short item UoW,versioned reload,register claim fence
  | save one plan item outcome + derived state / delivery / progress and report draft
  | commit item UoW
  v
[Finalize UoW]
  | acquire current execution claim;load immutable plan + report + target state
  | register fence;verify no item is Planned/Running,all outcomes valid,and report equals their canonical fold
  | transition report draft to one terminal JobReportState
  | save exact StoredObservationResult(JobReport)
  | complete idempotency
  | commit finalize UoW
```

关键说明:
- Job 不修 source truth,不生成 final verdict、signoff、真实 run id 或真实 evidence alias。
- duplicate job replay stored report,不重新扫描、不重新发布、不重建、不交付。
- nonterminal same-digest execution只能在prior claim正式Expired/Released后fenced resume,不得创建第二plan/report。
- publication job 更新 outbox publication state,不回滚 original command truth。
- 长任务不得持有跨 page、跨 batch 或跨外部调用的数据库事务;已提交 item 通过 report draft / progress refs 精确解释,finalize 失败不得撤销已提交 item。

### 7.7 Shared outbound append and publication template

Outbound Event 不作为同步 API 被调用。它是 Command / Consumer / Job accepted path 的 durable side effect。每个 payload 必须在 accepted transaction 内从 committed object / state / record 构造并作为 stored snapshot 保存。

#### 函数级调用图: SharedOutboundSnapshotAndPublishPath

```text
[Accepted mutation flow]
  | call ObservationOutboundPayloadBuilder.from_committed_change(...)
  | resolve OutboundEvent(event_name) in injected ExternalEffectBindingCatalog
  | call ObservationOutboxRepository.append(record, payload_snapshot, tx)
  v
[Worker publication loop]
  | call ObservationPublicationService.publish_observation_outbox(input)
  | start freezes ObservationOutboxRepository.list_eligible_with_payload(...)
  | acquire global outbox item claim/fence
  v
[ObservationEventPublisher]
  | call publish(ObservationPublicationToken token,stored payload)
  | unknown outcome -> probe_publication(same token)
  v
[Outbox repository]
  | tx begin
  | mark_published / mark_failed / mark_dead_letter with expected_version
  | tx commit
```

关键说明:
- Payload builder 的输入是 committed change,不是 current query result。
- Stored snapshot freezes the catalog-selected `effect_binding_ref`;entry and publisher cannot replace it with a current route。
- Publisher 只读取 stored payload snapshot,不得重新组装 event。
- publish failure 只影响 publication state,不得回滚 observation truth。

## 8. Command flow batch 9.1

### 8.1 Intake and signal command flows

#### 8.1.1 `SubmitObservationMaterialFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<SubmitObservationMaterialRequest>` |
| 入口函数 | `ObservationTruthWriteService.submit_observation_material(SubmitObservationMaterialInput input)` |
| 目标对象 | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` |
| 依赖 port | `ObservationIntakeRepository`;`ObservationSourceSummaryResolver`;`ObservationIdempotencyRepository`;`ObservationStoredResultRepository`;`ObservationOutboxRepository`;`ObservationProjectionStore`;`ClockPort`;`IdGeneratorPort` |
| 事务 | accepted / quarantined / rejected path 使用一个 write UoW;duplicate replay rollback 后读 stored result |
| outbound event | `ObservationReceiptChanged`;可选 `SafetyDispositionChanged` |

#### 函数级调用图: SubmitObservationMaterialFlow

```text
[API handler]
  | call handle(ObservationCommandRequest<SubmitObservationMaterialRequest> request)
  v
[ObservationTruthWriteService]
  | tx begin
  | call ObservationOperationContextFactory.for_command(SubmitObservationMaterial,...)
  | call ObservationIdempotencyRepository.reserve_or_load(context,tx)
  | branch Acquired/Replay/Conflict/InFlight before resolver or domain transition
  | call ObservationSourceSummaryResolver.resolve_observation_source(source_ref)
  v
[Domain]
  | call SafetyDisposition::evaluate(disposition_ref, receipt_ref, ReceivedMaterialSummary summary)
  | call IntakeAdmissionPolicy.evaluate(source_ref, purpose, disposition)
  | call ObservationReceipt::receive(receipt_ref, source_ref, purpose, received_at)
  | call receipt.accept(...) or receipt.quarantine(...) or receipt.reject(...)
  v
[Repositories]
  | save receipt + safety disposition + intake decision
  | append outbox payload snapshot
  | mark affected views stale
  | save stored result and complete idempotency
  | tx commit
```

```rust
// [ObservationReceipt::receive(ObservationReceiptRef receipt_ref, ObservationSourceRef source_ref, SubmissionPurpose purpose, ObservedAt received_at)]
let mut receipt = ObservationReceipt::receive(receipt_ref, request.source_ref, request.submission_purpose, clock.now());

// [SafetyDisposition::evaluate(SafetyDispositionRef disposition_ref, ObservationReceiptRef receipt_ref, ReceivedMaterialSummary summary)]
let mut disposition = SafetyDisposition::evaluate(disposition_ref, receipt.receipt_ref, summary);

// [IntakeAdmissionPolicy.evaluate(ObservationSourceRef source_ref, SubmissionPurpose purpose, SafetyDisposition disposition)]
let admission = intake_policy.evaluate(receipt.source_ref, receipt.submission_purpose, disposition)?;

// [ObservationReceipt.accept(SafetyDispositionRef disposition_ref, ActorSafeRef actor_ref)]
let decision_record = match admission {
    AdmissionDecision::Accepted => receipt.accept(disposition.disposition_ref, context.actor_ref)?,
    AdmissionDecision::Quarantined(reason) => receipt.quarantine(reason, context.actor_ref)?,
    AdmissionDecision::Rejected(reason) => receipt.reject(reason, context.actor_ref)?,
};
```

| 分支 | 处理口径 | 返回 surface |
|---|---|---|
| duplicate same digest | rollback,读取 stored `ObservationReceiptCommandResult` | `DuplicateReplayed` |
| unsupported source family | reject before mutation | `Rejected` + `InvalidReference` |
| resolver unavailable | no receipt mutation unless delayed receipt policy later confirms | `Delayed` |
| forbidden body detected | save quarantine disposition / decision if policy allows | `Quarantined` |
| accepted | save receipt / disposition / decision / outbox / stale marker / stored result | `Accepted` |

| 测试切口 | 断言 |
|---|---|
| accepted safe summary | receipt accepted, disposition saved, outbox snapshot exists |
| duplicate replay | no new receipt/outbox,stored result returned |
| forbidden body | quarantine or rejected surface,raw body not persisted |
| resolver unavailable | delayed surface,no source truth write |

#### 8.1.2 `RecordSafetyDispositionFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<RecordSafetyDispositionRequest>` |
| 入口函数 | `ObservationTruthWriteService.record_safety_disposition(RecordSafetyDispositionInput input)` |
| 目标对象 | `SafetyDisposition`;`IntakeDecisionRecord` |
| 依赖 port | `ObservationIntakeRepository`;idempotency;stored result;outbox;projection store |
| 事务 | load receipt / disposition with version,save transition and decision in one UoW |
| outbound event | `SafetyDispositionChanged`;可能触发 `ObservationReceiptChanged` |

处理流:
1. validate request metadata and `receipt_ref`.
2. reserve idempotency;duplicate returns stored `SafetyDispositionCommandResult`.
3. load receipt by `get_receipt_with_version` and current disposition by `find_safety_by_receipt`.
4. call `SafetyDisposition.allow_redacted(...)`, `reject_unsafe(...)` or `quarantine(...)` according to DTO state and policy.
5. call `ObservationReceipt.accept(...)`, `reject(...)` or `quarantine(...)` only if receipt state must follow disposition.
6. save disposition, receipt when changed, intake decision record, outbox snapshot and stored result.

| 错误 / 状态分支 | 处理 |
|---|---|
| missing receipt | reject `InvalidReference`,no mutation |
| invalid transition | rollback and return rejected surface |
| redaction marker missing | reject or quarantine according to policy |
| duplicate | no new state / outbox |

| 测试切口 | 断言 |
|---|---|
| redacted disposition | disposition state `Redacted`,receipt accepted when allowed |
| unsafe disposition | disposition rejected/quarantined,forbidden body not stored |
| invalid transition | repository save not called |

#### 8.1.3 `BindCorrelationContextFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<BindCorrelationContextRequest>` |
| 入口函数 | `ObservationTruthWriteService.bind_correlation_context(BindCorrelationContextInput input)` |
| 目标对象 | `CorrelationContext`;`CorrelationLinkRecord` |
| 依赖 port | `ObservationIntakeRepository`;`CorrelationSignalRepository`;idempotency;outbox;projection store |
| 事务 | receipt lookup + correlation save + link record + outbox in one UoW |
| outbound event | `DerivedProjectionChanged` or correlation-derived payload through `SafeSignalRecorded` later |

处理流:
1. reserve idempotency for `BindCorrelationContext`.
2. load receipt via `get_receipt_with_version`;reject if not accepted/degraded-allowed.
3. find existing correlation by receipt;duplicate semantic update is rejected unless same context.
4. call `CorrelationContext::from_receipt(context_ref, receipt_ref, source_ref, seed)`.
5. call `context.bind_source(source_ref, actor_ref)`;if runtime ref present later flows use `link_runtime_signal`.
6. save correlation with expected version,append `CorrelationLinkRecord`,mark read/diagnostic views stale,save stored result.

| 错误 / 状态分支 | 处理 |
|---|---|
| receipt missing | rejected `InvalidReference` |
| receipt quarantined/rejected | rejected or gap surface,不创建 bound context |
| partial hints | create `Partial` only when policy allows;otherwise rejected |
| duplicate | stored result replay |

| 测试切口 | 断言 |
|---|---|
| bound context | context saved as `Bound`,link record appended |
| quarantined receipt | no correlation saved |
| duplicate same digest | no second link record |

#### 8.1.4 `RecordSafeSignalFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<RecordSafeSignalRequest>` |
| 入口函数 | `ObservationTruthWriteService.record_safe_signal(RecordSafeSignalInput input)` |
| 目标对象 | `SafeSignal`;`SignalRollupWindow`;`CorrelationLinkRecord` |
| 依赖 port | `CorrelationSignalRepository`;`RuntimeSandboxSummaryResolver`;idempotency;outbox;projection store |
| 事务 | context lookup + signal save + optional rollup update + outbox/stale/result |
| outbound event | `SafeSignalRecorded`;`DerivedProjectionChanged` for rollup stale |

处理流:
1. validate `summary_ref` is a safe summary ref,not raw signal payload.
2. reserve idempotency.
3. load `CorrelationContext`;reject if invalid.
4. optional resolver check with `resolve_runtime_signal` / `resolve_sandbox_signal` when runtime ref exists.
5. call `SafeSignal::from_summary(signal_ref, context_ref, summary_ref, signal_kind)`.
6. call `SafeSignalPolicy.evaluate(context, summary_ref, signal_kind)` and then `signal.record(policy)`.
7. load / derive `SignalRollupWindow`;call `rollup.accept_signal(signal_ref)` and mark rollup stale/fresh according to policy.
8. save signal,rollup,correlation record,outbox payload snapshot,affected projections and stored result.

| 错误 / 状态分支 | 处理 |
|---|---|
| raw payload supplied | quarantine/reject before mutation |
| context missing/invalid | rejected |
| runtime resolver unavailable | delayed or signal stale according to policy |
| rollup save conflict | rollback all signal writes |

| 测试切口 | 断言 |
|---|---|
| accepted signal | signal recorded,outbox `SafeSignalRecorded` stored |
| stale runtime ref | signal marked stale or delayed,no raw body |
| rollup conflict | no partial signal persisted |

### 8.2 Audit, handoff, retention and reference command flows

#### 8.2.1 `AppendAuditProjectionFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<AppendAuditProjectionRequest>` |
| 入口函数 | `ObservationTruthWriteService.append_audit_projection(AppendAuditProjectionInput input)` |
| 目标对象 | `AuditProjection`;`AuditAppendRecord` |
| 依赖 port | `CorrelationSignalRepository`;`AuditEvidenceRepository`;idempotency;outbox;projection store |
| outbound event | `AuditProjectionAppended` |

处理流:
1. reserve idempotency and load correlation context.
2. create `AuditProjection::create(projection_ref, subject_ref, context_ref, source_audit_ref)`;`subject_ref` 必须来自 Step 08 typed input / trusted event,不得从 source audit body 推导。
3. apply visibility restriction when request visibility is restricted.
4. call `AuditProjection.append_fact(linkage_ref, actor_ref)` only when linkage exists;otherwise append projection input marker and gap if needed.
5. save projection and `AuditAppendRecord`;append outbox snapshot and mark evidence index / audit timeline stale.

| 分支 | 处理 |
|---|---|
| source audit ref missing | rejected,no projection |
| correlation missing | rejected or delayed with gap |
| visibility restricted | projection state `VisibilityRestricted`,not missing |

| 测试切口 | 断言 |
|---|---|
| append accepted | projection saved,append record,outbox snapshot |
| restricted visibility | response indicates restricted,not not-found |

#### 8.2.2 `LinkBodyFreeEvidenceFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<LinkBodyFreeEvidenceRequest>` |
| 入口函数 | `ObservationTruthWriteService.link_body_free_evidence(LinkBodyFreeEvidenceInput input)` |
| 目标对象 | `EvidenceLinkage`;`AuditAppendRecord` |
| 依赖 port | `AuditEvidenceRepository`;`GovernanceArtifactEvidenceResolver`;idempotency;outbox;projection store |
| outbound event | `EvidenceLinkageChanged`;possibly `AuditProjectionAppended` stale marker |

处理流:
1. reserve idempotency and load audit projection.
2. resolve evidence via `resolve_governance_evidence` or `resolve_artifact_evidence`.
3. create `EvidenceLinkage::candidate(linkage_ref, projection_ref, boundary_ref, evidence_purpose, digest_summary)`;linkage 必须持久化所属 projection ref 和消费目的。
4. call `BodyFreeLinkagePolicy.validate(boundary_ref, evidence_purpose)` and `linkage.link(policy)`.
5. call `EvidenceVisibilityPolicy.evaluate(linkage, consumer_scope)`;apply `mark_not_visible` or `mark_stale` when needed.
6. save linkage,append audit record,outbox snapshot,mark handoff/evidence-index projections stale.

| 分支 | 处理 |
|---|---|
| resolver returns body material | quarantine/reject,do not save body |
| digest missing | delayed,no linkage |
| not visible | save linkage state `NotVisible`,not missing |
| projection missing | rejected |

| 测试切口 | 断言 |
|---|---|
| body-free linked | linkage state `Linked`,digest summary only |
| body blocked | no evidence body persisted;quarantine surface |
| stale evidence | linkage stale and handoff projections stale |

#### 8.2.3 `PrepareReportHandoffFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<PrepareReportHandoffRequest>` |
| 入口函数 | `ObservationTruthWriteService.prepare_report_handoff(PrepareReportHandoffInput input)` |
| 目标对象 | immutable `EvidenceIndexInputView` snapshot;`ReportHandoffRecord`;`HandoffLifecycleRecord` |
| 依赖 port | `ReportHandoffRepository`;`AuditEvidenceRepository`;idempotency;outbox;projection store |
| outbound event | `ReportHandoffChanged` |

处理流:
1. reserve idempotency.
2. validate every linkage / audit projection / gap ref and visibility in `input.evidence_index_input` against committed audit/evidence/gap reads;the Query-generated view is a preview,not trusted truth.
3. call `ReportHandoffRepository.save_evidence_index_input(input.evidence_index_input, tx)` to save the exact immutable body-free snapshot;ref-only input is forbidden.
4. create `ReportHandoffRecord::draft(handoff_ref, handoff_scope_ref, consumer_ref, evidence_index_input.input_ref)`;scope and input identity enter the persisted relation,不得从 consumer 产品名推导。
5. call `HandoffReadinessPolicy.evaluate(record, evidence_index_input.visibility, no_write_policy)` and then `handoff.prepare(policy)` or `handoff.block(reason)`.
6. save handoff,lifecycle record,outbox snapshot and stored result in the same accepted UoW.

| 分支 | 处理 |
|---|---|
| evidence input missing / ref-only / constituent mismatch | rejected or gap surface;no snapshot or handoff committed |
| visibility blocked | handoff blocked,not ready |
| attempt to provide final verdict/signoff | rejected `BodyFreeBoundaryViolation` |

| 测试切口 | 断言 |
|---|---|
| ready handoff | state `Prepared`,readiness ready,outbox stored |
| missing evidence | blocked or gap,no final verdict |
| duplicate | no second lifecycle record |

#### 8.2.4 `EvaluateAuthenticityHintFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<EvaluateAuthenticityHintRequest>` |
| 入口函数 | `ObservationTruthWriteService.evaluate_authenticity_hint(EvaluateAuthenticityHintInput input)` |
| 目标对象 | `AuthenticityHint`;`HandoffLifecycleRecord` |
| 依赖 port | `ReportHandoffRepository`;`AuditEvidenceRepository`;idempotency;outbox |
| outbound event | `ReportHandoffChanged` |

处理流:
1. reserve idempotency and load handoff.
2. load evidence links and gap refs from request/repository.
3. call `AuthenticityHintPolicy.assess(evidence_index_input_ref, gap_refs)`.
4. create or update `AuthenticityHint` with immutable `handoff_ref`;call `confirm_real_evidence(...)` only when origin is backed by body-free real evidence ref;otherwise `mark_placeholder(...)` or insufficient.
5. attach hint to handoff and append lifecycle record.

| 分支 | 处理 |
|---|---|
| placeholder evidence | state `PlaceholderDetected`,not real evidence |
| insufficient material | state `Insufficient`,handoff remains blocked/pending |
| fake run id / evidence alias | rejected boundary violation |

| 测试切口 | 断言 |
|---|---|
| real evidence linked | hint state real with body-free evidence origin |
| placeholder | no real evidence alias emitted |
| missing handoff | rejected,no hint |

#### 8.2.5 `SetRetentionMarkerFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<SetRetentionMarkerRequest>` |
| 入口函数 | `ObservationTruthWriteService.set_retention_marker(SetRetentionMarkerInput input)` |
| 目标对象 | `RetentionMarker`;`RetentionChangeRecord` |
| 依赖 port | `RetentionGuardRepository`;idempotency;outbox;projection store |
| outbound event | `RetentionMarkerChanged` |

处理流:
1. reserve idempotency.
2. find existing marker by protected ref;create `RetentionMarker::for_observation(...)` if absent.
3. call `RetentionProtectionPolicy.evaluate(marker, active_protection)` to decide hold/release/conflict.
4. call `marker.place_hold(...)`, `mark_release_candidate(...)`, `mark_conflict(...)` or `mark_archive_eligible(...)`.
5. save marker,append retention record,outbox snapshot,mark affected handoff/read views stale.

| 分支 | 处理 |
|---|---|
| active protection exists | state `ActiveHold` or `Conflict`,no cleanup |
| release request with active consumer | conflict |
| duplicate | replay stored result |

| 测试切口 | 断言 |
|---|---|
| hold marker | marker active hold,outbox stored |
| release blocked | conflict recorded,no cleanup |

#### 8.2.6 `ProtectActiveReferenceFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<ProtectActiveReferenceRequest>` |
| 入口函数 | `ObservationTruthWriteService.protect_active_reference(ProtectActiveReferenceInput input)` |
| 目标对象 | `ActiveReferenceProtection`;`RetentionChangeRecord` |
| 依赖 port | `RetentionGuardRepository`;idempotency;outbox |
| outbound event | `RetentionMarkerChanged` |

处理流:
1. reserve idempotency.
2. load or create active protection for protected ref.
3. call `ActiveReferenceProtection.attach_consumer(consumer_ref)`.
4. ensure retention marker exists or mark affected marker stale.
5. save protection,append retention record,outbox snapshot,stored result.

| 分支 | 处理 |
|---|---|
| invalid consumer ref | rejected |
| protection expired | create new protection or conflict per policy |
| duplicate | no duplicate consumer entry |

| 测试切口 | 断言 |
|---|---|
| attach consumer | protection contains consumer,retention view stale |
| invalid ref | no save |

#### 8.2.7 `DefineReplayScopeFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<DefineReplayScopeRequest>` |
| 入口函数 | `ObservationTruthWriteService.define_replay_scope(DefineReplayScopeInput input)` |
| 目标对象 | `ReplayScope`;`ReplayExecutionRecord` |
| 依赖 port | `RetentionGuardRepository`;`ReferenceMaintenanceRepository`;idempotency;outbox |
| outbound event | `DerivedProjectionChanged` or replay-scope maintenance event |

处理流:
1. reserve idempotency.
2. validate target refs are observation/projection side only.
3. create `ReplayScope` with `allowed_effect`.
4. call `ReplayBoundaryPolicy.approve(scope, no_write_policy)`;block if source write would occur.
5. save replay scope and execution record;append outbox/stale marker.

| 分支 | 处理 |
|---|---|
| target includes source truth | no-write violation / blocked |
| empty target refs | rejected |
| policy blocks replay | scope `Blocked`,record reason |

| 测试切口 | 断言 |
|---|---|
| approved replay scope | scope saved,allowed effect observation-only |
| source repair attempt | violation recorded,no source write |

#### 8.2.8 `RecordNoWriteViolationFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<RecordNoWriteViolationRequest>` |
| 入口函数 | `ObservationTruthWriteService.record_no_write_violation(RecordNoWriteViolationInput input)` |
| 目标对象 | `NoWriteViolation`;`NoWriteViolationRecord` |
| 依赖 port | `RetentionGuardRepository`;idempotency;outbox |
| outbound event | `NoWriteViolationRecorded` |

处理流:
1. reserve idempotency.
2. create `NoWriteViolation::detect(violation_ref, trigger_context_ref, attempted_target)`.
3. call `NoWriteGuardPolicy.assert_no_source_write(context_ref, target_ref)`;expected result is failure that drives `violation.block(policy, actor_ref)`.
4. save violation and record in one repository call.
5. append outbox snapshot and stored result.

| 分支 | 处理 |
|---|---|
| missing attempted target | rejected |
| duplicate violation | replay or no-op according to idempotency |
| close/escalate intent | Step 10/12 refine transition legality |

| 测试切口 | 断言 |
|---|---|
| blocked violation | violation state `Blocked`,no compensation write |
| duplicate | no second record |

#### 8.2.9 `RecordGapStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<RecordGapStateRequest>` |
| 入口函数 | `ObservationTruthWriteService.record_gap_state(RecordGapStateInput input)` |
| 目标对象 | `GapState`;`DegradedOutputState`;`GapTransitionRecord` |
| 依赖 port | `RetentionGuardRepository`;`ObservationProjectionStore`;idempotency;outbox |
| outbound event | `GapStateChanged`;possibly `DerivedProjectionChanged` |

处理流:
1. reserve idempotency.
2. load existing gap by source;create `GapState::open(gap_ref, source_ref, gap_kind)` if absent.
3. call `GapClassificationPolicy.classify(...)` when request requires validation against snapshot / visibility.
4. if degraded reason exists,call `DegradedOutputPolicy.evaluate(...)` and save degraded output.
5. call `gap.acknowledge(...)`, `gap.mitigate(...)` or `gap.close(...)` according to input / policy.
6. save gap,degraded output,transition record,outbox snapshot and affected query/handoff/peripheral views stale.

| 分支 | 处理 |
|---|---|
| not-visible material | gap kind not-visible,not missing |
| unsafe output | degraded output blocked |
| duplicate | no duplicate transition |

| 测试切口 | 断言 |
|---|---|
| missing gap | gap open and query surface missing |
| not-visible gap | not-visible is distinguishable from missing |

#### 8.2.10 `PrepareExternalAuditExportFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<PrepareExternalAuditExportRequest>` |
| 入口函数 | `ObservationTruthWriteService.prepare_external_audit_export(PrepareExternalAuditExportInput input)` |
| 目标对象 | `ExternalAuditExportPreparation`;`PeripheralDeliveryState`;`PeripheralDeliveryRecord` |
| 依赖 port | `ObservationProjectionStore`;`RetentionGuardRepository`;idempotency;outbox |
| outbound event | `PeripheralDeliveryChanged` |

处理流:
1. reserve idempotency.
2. call `ObservationProjectionStore.get_peripheral_export_view_by_ref(input.export_view_ref)`;missing returns rejected/missing surface,not an inferred consumer/scope lookup.
3. require loaded `view.consumer_ref == input.consumer_ref` and `view.visibility` compatible with the request;then call `PeripheralExportPolicy.assert_export_allowed(consumer_ref, view_ref, visibility)`.
4. create `ExternalAuditExportPreparation` draft and call `prepare(policy)` or `block(reason)`.
5. create/update `PeripheralDeliveryState`;save delivery record,outbox snapshot,stored result.

| 分支 | 处理 |
|---|---|
| view not visible | blocked export,not missing |
| consumer invalid | rejected |
| attempt to pass final audit conclusion | rejected boundary violation |

| 测试切口 | 断言 |
|---|---|
| prepared export | preparation state prepared,no external truth write |
| blocked visibility | blocked delivery,gap surface |

#### 8.2.11 `RegisterReferenceSnapshotFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<RegisterReferenceSnapshotRequest>` |
| 入口函数 | `ObservationTruthWriteService.register_reference_snapshot(RegisterReferenceSnapshotInput input)` |
| 目标对象 | `ReferenceSnapshotState`;`ReferenceRefreshRecord` |
| 依赖 port | `ReferenceMaintenanceRepository`;`SubjectObservationResolver` / evidence / runtime resolvers as needed;idempotency;outbox |
| outbound event | `ReferenceSnapshotChanged` |

处理流:
1. reserve idempotency.
2. validate subject ref owner and adapter boundary.
3. create `ReferenceSnapshotState::pending(snapshot_ref, subject_ref)`.
4. if safe summary exists,call `snapshot.refresh(record, Some(summary_ref))`;otherwise state remains pending/stale/unresolved by freshness input.
5. save snapshot,refresh record,outbox snapshot and stale affected views.

| 分支 | 处理 |
|---|---|
| invalid subject | rejected |
| resolver unavailable | snapshot unavailable/unresolved,not success |
| summary contains body | quarantine/reject |

| 测试切口 | 断言 |
|---|---|
| registered resolved | snapshot state resolved,summary ref only |
| unresolved | explicit unresolved state,no external body |

#### 8.2.12 `UpdateReferenceSnapshotStateFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationCommandRequest<UpdateReferenceSnapshotStateRequest>` |
| 入口函数 | `ObservationTruthWriteService.update_reference_snapshot_state(UpdateReferenceSnapshotStateInput input)` |
| 目标对象 | `ReferenceSnapshotState`;`ReferenceRefreshRecord` |
| 依赖 port | `ReferenceMaintenanceRepository`;idempotency;outbox;projection store |
| outbound event | `ReferenceSnapshotChanged`;possibly `GapStateChanged` |

处理流:
1. reserve idempotency.
2. load snapshot with version.
3. according to requested state call `snapshot.refresh(...)`, `mark_stale(...)` or `mark_unresolved(...)`;invalid is recorded with reason ref.
4. save snapshot and refresh record with expected version.
5. append outbox snapshot,mark affected read/gap/handoff views stale and save stored result.

| 分支 | 处理 |
|---|---|
| snapshot missing | rejected / missing surface |
| stale -> resolved | requires safe summary ref |
| invalid state transition | rollback,rejected |

| 测试切口 | 断言 |
|---|---|
| mark stale | snapshot stale,outbox `ReferenceSnapshotChanged` |
| resolve without summary | rejected |

#### 8.2.13 Command batch stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 16 个 Command 是否均有独立 flow | pass_with_affected_open | §8.1~§8.2 与 exact cards C01-C16 覆盖；affected 不被隐藏 |
| DTO 构造是否回指 Step 08 | pass_with_affected_open | 每条 flow 使用 Step 08 request DTO；部分 upstream payload/reference owner 仍开放 |
| Domain method 是否回指 Step 06 | pass_with_affected_open | factory/transition 已记录；`S08-RECOVERY-CLASS-OWNER-01` 等 owner gap 后置 |
| port 是否回指 Step 07 | pass_with_affected_open | service/repository/resolver/outbox/projection/stored-result 面已记录；I03/I04/I05 least-authority slice 仍开放 |
| transaction / stored result / outbox 是否闭合 | pass_with_affected_open | shared 顺序已固定；`R06-F-AFFECT-UOW-01`、consumer completion/outbox surface 仍开放 |
| no-write / no raw body / no final verdict 是否闭合 | pass_with_affected_open | 设计红线已固定；实现级 dependency proof 和 external phase affected 仍待后续 owner |

## 9. Query flow batch 9.2

### 9.1 Shared authorized query flow

#### 函数级调用图: AuthorizedObservationQueryFlow

```text
[API handler]
  | call handle(ObservationQueryRequest<T> request)
  | derive request digest and call ObservationOperationContextFactory.for_query(...)
  | map public page request when needed
  v
[ObservationReadService]
  | call repository/projection read method
  | call ReadVisibilityPolicy.assert_can_read(...)
  | call DegradedOutputPolicy.evaluate(...) when gap/safety/visibility exists
  v
[Response assembler]
  | map view fields to Step 08 DTO
  | attach ObservationQuerySurface
  | return body/page or not-visible/missing/stale surface
```

关键说明:
- Query flow 不调用 UnitOfWork begin/commit。
- Query flow 不调用 resolver refresh、projection replace、outbox append 或 stored result save。
- Query flow 的 surface 由 Step 08 `ObservationQuerySurface` 表达。

### 9.2 Query flow table

| Flow | 协议 DTO | 入口函数 | 主要读取 port | Response DTO | empty / not-visible / stale / missing 处理 | 停审 |
|---|---|---|---|---|---|---|
| `GetObservationReceiptFlow` | `GetObservationReceiptRequest` | `get_observation_receipt` | `ObservationIntakeRepository.get_receipt_with_version`;`find_safety_by_receipt` | `ObservationReceiptView` | missing receipt -> `NotFound`;not-visible -> body none | pass |
| `GetIntakeStatusFlow` | `GetIntakeStatusRequest` | `get_intake_status` | `ObservationIntakeRepository.list_receipts_by_scope` | `ObservationPublicPage<IntakeStatusItemView>` | empty page valid;stale via surface | pass |
| `GetSafeSignalFlow` | `GetSafeSignalRequest` | `get_safe_signal` | `CorrelationSignalRepository.get_safe_signal_with_version`;`list_signals_by_context` | `SafeSignalProjectionView` or page | context missing -> missing;not-visible body none | pass |
| `GetSignalRollupFlow` | `GetSignalRollupRequest` | `get_signal_rollup` | `CorrelationSignalRepository.get_rollup_with_version`;`list_rollups_by_scope` | `SignalRollupView` or page | stale/rebuilding explicit via freshness | pass |
| `GetAuditTimelineFlow` | `GetAuditTimelineRequest` | `get_audit_timeline` | `AuditEvidenceRepository.page_audit_timeline` | `ObservationPublicPage<AuditTimelineEntryView>` | not-visible entry redacted/omitted;empty valid | pass |
| `GetEvidenceIndexInputFlow` | `GetEvidenceIndexInputRequest` | `get_evidence_index_input` | `AuditEvidenceRepository.list_evidence_linkages_by_scope`;`page_audit_timeline`;`RetentionGuardRepository.list_gaps_by_source` | `EvidenceIndexInputView` | missing linkage -> gap refs;not-visible explicit | pass |
| `GetReportHandoffFlow` | `GetReportHandoffRequest` | `get_report_handoff` | `ReportHandoffRepository.get_handoff_with_version`;`find_authenticity_hint_by_handoff` | `ReportHandoffView` | missing handoff -> not found;blocked readiness explicit | pass |
| `GetRetentionProtectionFlow` | `GetRetentionProtectionRequest` | `get_retention_protection` | `RetentionGuardRepository.find_retention_by_protected_ref`;`list_active_protections` | `RetentionProtectionView` | absent marker -> unmarked/missing per scope,no cleanup | pass |
| `GetObservationReadModelFlow` | `GetObservationReadModelRequest` | `get_observation_read_model` | `ObservationProjectionStore.get_observation_read_model`;`page_observation_read_models` | `ObservationReadModel` or page | stale/rebuilding/disabled via surface;no rebuild | pass |
| `GetDiagnosticViewFlow` | `GetDiagnosticViewRequest` | `get_diagnostic_view` | `ObservationProjectionStore.get_diagnostic_view(scope)`;Rebuilding时`get_rebuild_progress_by_ref(progress_ref)`;`ReferenceMaintenanceRepository.find_maintenance_by_target` / `get_maintenance_target_scope_binding` | `DiagnosticView` | canonical scope missing -> missing;unavailable -> availability surface;Rebuilding链路missing/mismatch -> consistency error;request context ref 不参与 lookup | pass |
| `GetGapStatusFlow` | `GetGapStatusRequest` | `get_gap_status` | `RetentionGuardRepository.get_gap_with_version`;`list_gaps_by_source`;`ObservationProjectionStore.get_gap_status` | `GapStatusView` or page | not-visible != missing;empty page valid | pass |
| `GetPeripheralExportViewFlow` | `GetPeripheralExportViewRequest` | `get_peripheral_export_view` | `ObservationProjectionStore.get_peripheral_export_view` | `DashboardAlertExportView` | disabled / blocked / not-visible explicit | pass |
| `GetReferenceSnapshotViewFlow` | `GetReferenceSnapshotViewRequest` | `get_reference_snapshot_view` | `ReferenceMaintenanceRepository.get_snapshot_with_version`;`ObservationProjectionStore.get_reference_snapshot_view` | `ReferenceSnapshotView` | unresolved/stale/invalid explicit | pass |
| `GetRebuildProgressFlow` | `GetRebuildProgressRequest` | `get_rebuild_progress` | `ObservationProjectionStore.get_rebuild_progress`;`ReferenceMaintenanceRepository.list_maintenance_by_scope` | `RebuildProgressView` | no progress -> not found or fresh target surface | pass |

### 9.3 Representative query pseudocode

```rust
// [ObservationReadService.get_diagnostic_view(GetDiagnosticViewInput input)]
// The projection is selected only by its canonical scope.
let requested_scope = input.scope.clone();
let versioned_view = projection_store
    .get_diagnostic_view(requested_scope.clone())
    .await?;
let view = match versioned_view {
    Some(versioned) => versioned.value,
    None => return Ok(ObservationQueryResult {
        view: None,
        visibility: VisibilitySurface::visible(),
        freshness: ObservationProjectionFreshnessSurface::Unknown,
        degraded: None,
        availability: ObservationAvailabilitySurface::Available,
        missing: Some(ObservationMissingSurface::NotFound),
        rebuild: None,
    }),
};

if view.scope != requested_scope {
    return Err(ApplicationError::ProjectionScopeMismatch);
}

// [DiagnosticRequestContext::for_query(...)]
// This object exists only for the current read and is never saved.
let request_context = DiagnosticRequestContext::for_query(
    input.request_context_ref,
    input.context.actor_ref,
    requested_scope.clone(),
    view.diagnostic_scope_ref.clone(),
    input.visibility_scope_ref,
    input.requested_at,
)?;

// [ReadVisibilityPolicy.assert_can_read(DiagnosticRequestContext, ReadVisibilityState)]
let visibility = read_visibility_policy
    .assert_can_read(request_context, request_visibility_state)?;
let freshness = view.freshness.clone();
let diagnostic_surface = map_diagnostic_state(
    view.diagnostic_freshness.clone(),
    view.visibility.degraded.clone(),
    view.gap_refs.first().cloned(),
)?;

// A persisted rebuilding marker must resolve through its generated progress ref.
// Missing or cross-target links are storage consistency failures,not "not found".
let rebuild = match &view.freshness {
    ObservationProjectionFreshnessSurface::Rebuilding {
        progress_ref: Some(progress_ref),
    } => {
        let progress = projection_store
            .get_rebuild_progress_by_ref(progress_ref.clone())
            .await?
            .ok_or(ApplicationError::RebuildProgressLinkMissing)?
            .value;
        let maintenance = reference_maintenance_repo
            .find_maintenance_by_target(progress.target_ref.clone())
            .await?
            .ok_or(ApplicationError::RebuildMaintenanceLinkMissing)?
            .value;
        let binding = reference_maintenance_repo
            .get_maintenance_target_scope_binding(progress.target_ref.clone())
            .await?
            .ok_or(ApplicationError::RebuildTargetBindingMissing)?;

        Some(validate_diagnostic_rebuild_linkage(
            &requested_scope,
            progress_ref,
            &progress,
            &maintenance,
            &binding,
        )?)
    }
    ObservationProjectionFreshnessSurface::Rebuilding { progress_ref: None } => {
        return Err(ApplicationError::RebuildProgressLinkMissing);
    }
    ObservationProjectionFreshnessSurface::Stale { marker_ref }
        if marker_ref != &view.freshness_marker_ref =>
    {
        return Err(ApplicationError::ProjectionFreshnessMarkerMismatch);
    }
    _ => None,
};

let merged_degraded = merge_degraded_surface(
    visibility.degraded.clone(),
    diagnostic_surface.degraded,
);
let mut response_visibility = visibility;
response_visibility.degraded = merged_degraded.clone();
let body_allowed = diagnostic_body_allowed(
    &input.consistency,
    &response_visibility,
    &view.freshness,
    &diagnostic_surface.availability,
    merged_degraded.as_ref(),
);
let response_view = body_allowed.then_some(view);

Ok(ObservationQueryResult {
    view: response_view,
    degraded: merged_degraded,
    visibility: response_visibility,
    freshness: freshness,
    availability: diagnostic_surface.availability,
    missing: None,
    rebuild,
})
```

`request_visibility_state` 是本次请求 metadata 对 persisted `DiagnosticView.visibility` 的只读 policy evaluation 结果。projection `freshness` 直接使用 persisted dual-watermark surface,不能从 diagnostic state猜 cursor位置。`map_diagnostic_state`只解释summary completeness:`Fresh/Stale`不额外降级;`Partial`必须复用 rebuild 时持久化的degraded surface,但不自动把projection标Stale;`Unavailable`产生availability Unavailable并可携带已存在gap ref。persisted `Rebuilding { progress_ref }` 必须按ref读取target-bound progress,再验证progress、maintenance、target binding与请求scope的完整链路；任何missing/mismatch都是consistency error,不得猜target、降级成普通missing或隐藏rebuild surface。

```rust
/// Pure application-local mapping;it carries no write intent.
pub struct DiagnosticQuerySurfaceMapping {
    pub degraded: Option<DegradedSurface>,
    pub availability: ObservationAvailabilitySurface,
}

/// Pure body gate applied after visibility,diagnostic,and rebuild surfaces are complete.
fn diagnostic_body_allowed(
    consistency: &ObservationConsistencyHint,
    visibility: &VisibilitySurface,
    freshness: &ObservationProjectionFreshnessSurface,
    availability: &ObservationAvailabilitySurface,
    degraded: Option<&DegradedSurface>,
) -> bool {
    if !visibility.is_visible() {
        return false;
    }

    let freshness_allows_body = match consistency {
        ObservationConsistencyHint::RequireFresh => {
            matches!(freshness, ObservationProjectionFreshnessSurface::Fresh)
        }
        ObservationConsistencyHint::AllowStale | ObservationConsistencyHint::BestEffort => {
            matches!(
                freshness,
                ObservationProjectionFreshnessSurface::Fresh
                    | ObservationProjectionFreshnessSurface::Stale { .. }
                    | ObservationProjectionFreshnessSurface::Rebuilding { .. }
            )
        }
    };
    if !freshness_allows_body {
        return false;
    }

    match availability {
        ObservationAvailabilitySurface::Available => true,
        ObservationAvailabilitySurface::Unavailable { .. }
            if matches!(consistency, ObservationConsistencyHint::BestEffort) =>
        {
            degraded.is_some_and(|surface| surface.limited_consumption_allowed)
        }
        ObservationAvailabilitySurface::Disabled { .. }
        | ObservationAvailabilitySurface::Unavailable { .. }
        | ObservationAvailabilitySurface::Failed { .. } => false,
    }
}
```

| pure helper | 签名 | 固定语义 |
|---|---|---|
| diagnostic summary surface mapper | `fn map_diagnostic_state(state: DiagnosticFreshnessState, persisted_degraded: Option<DegradedSurface>, unavailable_gap_ref: Option<GapStateRef>) -> Result<DiagnosticQuerySurfaceMapping, ApplicationError>` | `Fresh/Stale -> Available + no diagnostic degradation`;`Partial`要求`persisted_degraded=Some`;`Unavailable -> Unavailable{gap_ref}`。不得修改projection freshness。 |
| degraded surface merge | `fn merge_degraded_surface(request: Option<DegradedSurface>, diagnostic: Option<DegradedSurface>) -> Option<DegradedSurface>` | 单边存在则原样返回;双边存在按`GuardBlocked > SafetyLimited > UnresolvedReference > NotVisible > Stale`选主reason,`limited_consumption_allowed`取AND,主reason无gap时才复用另一方gap。不得隐藏blocked或生成新gap ref。 |
| rebuild linkage validator | `fn validate_diagnostic_rebuild_linkage(requested_scope: &ObservationProjectionScope, persisted_progress_ref: &RebuildProgressViewRef, progress: &RebuildProgressView, maintenance: &ProjectionMaintenanceState, binding: &MaintenanceTargetScopeBinding) -> Result<ObservationRebuildSurface, ApplicationError>` | 要求progress identity、`progress.rebuild.progress_ref`、progress freshness中的ref三者相同；progress/rebuild/maintenance/binding target相同；maintenance为`Rebuilding`且指向同progress；普通scope必须属于binding,`ByMaintenanceTarget(t)`必须满足`t == binding.target_ref`。成功只返回persisted `progress.rebuild`,不拼target/ref/cursor。 |
| consistency body gate | `fn diagnostic_body_allowed(consistency,visibility,freshness,availability,degraded) -> bool` | `RequireFresh`仅Fresh+visible+Available；`AllowStale`允许Fresh/Stale/Rebuilding的visible+Available committed body；`BestEffort`同样接受三种freshness,且只有existing degraded surface明确`limited_consumption_allowed=true`时才允许Unavailable body；Unknown/Disabled/Failed/blocked/not-visible一律无body。surface与rebuild仍原样返回。 |

request visibility evaluation 不得保存为共享授权 truth,也不得触发 projection replace、reference refresh、gap close、outbox append 或 read-access history append。`input.consistency` 只控制已经committed body是否可返回,不修改persisted freshness/availability/rebuild surface,也不能把 Query 升级成同步 rebuild。`RequireFresh`不等待；`AllowStale`不把stale/rebuilding改写成Fresh；`BestEffort`不构造placeholder或默认body。

```rust
// [ObservationReadService.get_evidence_index_input(GetEvidenceIndexInputInput input)]
// 读取 evidence index input,不构造真实 evidence alias,不读取 evidence body。
let linkages = audit_evidence_repo
    .list_evidence_linkages_by_scope(input.scope, input.page)
    .await?;

// [AuditEvidenceRepository.page_audit_timeline(AuditTimelineQuery query, ObservationRepositoryPage page)]
let timeline = audit_evidence_repo
    .page_audit_timeline(timeline_query, repo_page)
    .await?;

// [RetentionGuardRepository.list_gaps_by_source(GapSourceRef source_ref, ObservationRepositoryPage page)]
let gaps = retention_guard_repo
    .list_gaps_by_source(gap_source_ref, repo_page)
    .await?;

// [ReadVisibilityPolicy.assert_can_read(DiagnosticRequestContext context, ReadVisibilityState visibility)]
let visibility = read_visibility_policy.assert_can_read(request_context, read_visibility)?;

// [IdGeneratorPort.new_evidence_index_input_view_ref()]
// This allocates preview identity only;the Query still performs no repository write.
let input_ref = id_generator.new_evidence_index_input_view_ref();

// [EvidenceIndexInputView assembler]
Ok(ObservationQueryResponse {
    query_name: ObservationQueryName("GetEvidenceIndexInput".to_owned()),
    surface: ObservationQuerySurface::from_visibility_and_gaps(visibility, gaps),
    body: Some(EvidenceIndexInputView {
        input_ref,
        scope_ref: input.scope_ref,
        linkage_refs,
        audit_projection_refs,
        gap_refs,
        visibility,
    }),
})
```

### 9.4 Query error and surface mapping

| 分支 | 处理口径 | 禁止事项 |
|---|---|---|
| target missing | return `ObservationMissingSurface::NotFound` | 不创建 placeholder truth |
| not visible | `body = None`,visibility `NotVisible` | 不把 not-visible 写成 missing |
| stale projection | return stale freshness marker | 不触发 inline rebuild |
| rebuilding | 按persisted progress ref读取并校验progress/maintenance/binding/request scope,return exact rebuild surface | 不等待job完成,不猜target或拼progress surface |
| `RequireFresh` with stale/rebuilding/unknown | body none,保留exact freshness/availability/rebuild surface | 不等待、不写入、不把surface改成Fresh |
| `AllowStale` / `BestEffort` | 只按完整body gate返回已committed body | 不构造placeholder或用hint覆盖availability |
| dependency disabled | availability `Disabled` | 不启用配置 |
| query page cursor invalid | protocol error / rejected query surface | 不写 stored result |

### 9.5 Query stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 14 个 Query 是否均有 flow | pass_with_affected_open | §9.2 与 exact cards Q01-Q14 覆盖 |
| Query 是否 read-only | pass_with_affected_open | no-write 规则固定；least-authority carrier 和 surface mapper affected 仍开放 |
| page helper 是否映射 public -> application-local | pass_with_affected_open | shared mapping 已记录；cardinality/selector affected 按 Q card 保留 |
| visibility / freshness / missing / degraded surface 是否闭合 | pass_with_affected_open | 语义边界已固定；Q01-Q14 的 source/precedence affected 不得默认补齐 |
| Diagnostic Rebuilding ref/target/binding与consistency hint是否闭合 | pass_with_affected_open | read-only linkage 已记录；progress/target carrier affected 仍开放 |
| Query 是否不刷新 / 不修复 / 不反写 | pass | 所有分支禁止 inline rebuild / refresh / no-write |
| 测试切口是否覆盖 | pass_with_affected_open | planned cuts 已列出，但未执行且不替代未决 source proof |

## 10. Inbound Consumer flow batch 9.3

### 10.1 Shared consumer accepted flow

Consumer accepted path 必须先验证 Step 08 envelope,再进入 idempotency。任何 unsupported schema 或 missing envelope field 都不得解析 payload。进入 accepted path 后只能写本地 observation-side state。

```rust
// [Worker handler.validate(ObservationInboundEventEnvelope<T> envelope)]
validate_required(envelope.source_event_ref, envelope.source_ref, envelope.schema_version, envelope.dedup_key)?;

let event_identity = ObservationInboundEventIdentity {
    consumer: consumer_operation,
    producer_family: envelope.producer_family.clone(),
    source_event_ref: envelope.source_event_ref.clone(),
};
let context = operation_context_factory.for_inbound_event(
    event_identity,
    system_actor_ref,
    envelope.dedup_key.clone(),
    digest,
    envelope.trace_ref.clone(),
);

// [ObservationIdempotencyRepository.reserve_or_load(ObservationOperationContext context, &dyn ObservationUnitOfWork tx)]
let reserve_outcome = idempotency_repo
    .reserve_or_load(context.clone(), tx.as_ref())
    .await?;

let reservation = match reserve_outcome {
    ObservationIdempotencyReserveOutcome::Acquired(reservation) => reservation,
    ObservationIdempotencyReserveOutcome::Replay { result_ref, .. } => {
        unit_of_work.rollback(tx).await?;
        let stored_result = stored_result_repo
            .get_result(result_ref)
            .await?
            .ok_or(ApplicationError::CompletedReservationResultMissing)?;
        validate_stored_result_compatibility(&context, &stored_result)?;
        return stored_result.into_consumer_receipt();
    }
    ObservationIdempotencyReserveOutcome::Conflict { .. } => {
        unit_of_work.rollback(tx).await?;
        return Err(ApplicationError::IdempotencyConflict);
    }
    ObservationIdempotencyReserveOutcome::InFlight { .. } => {
        unit_of_work.rollback(tx).await?;
        return Err(ApplicationError::IdempotencyInFlight);
    }
};

// Compare source versions only through the producer adapter's typed comparator.
// occurred_at,local clock,and schema version never decide the winning source state.
enforce_source_version_monotonicity(
    envelope.source_version_ref.as_ref(),
    current_source_version.as_ref(),
)?;
```

| Consumer outcome | 事务 / 副作用 |
|---|---|
| `Accepted` | save local receipt / projection input / snapshot / marker / history;may append outbox snapshot |
| `Duplicate` | rollback and return stored receipt;no payload parse or mutation |
| `Delayed` | save delayed receipt only when policy needs retry marker;otherwise no mutation |
| `Rejected` | no truth mutation;store rejection surface if Step 12 chooses |
| `Quarantined` | save quarantine marker / receipt;no raw body |
| `DeadLettered` | save dead-letter ref only;no source truth write |
| `UnsupportedSchema` | no payload parse;no local truth mutation |
| `NoOp` | save no-op receipt if idempotency result required |

### 10.2 Consumer flow table

| Flow | Envelope payload | 入口函数 | 本地目标 | 主要 port | 关键分支 | 停审 |
|---|---|---|---|---|---|---|
| `ConsumeBusObservationMaterialFlow` | `BusObservationMaterialPayload` | `consume_bus_observation_material` | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` | intake repo;source resolver;idempotency;outbox | missing safe summary delayed;body quarantine | pass |
| `ConsumeSourceAuditMaterialFlow` | `SourceAuditMaterialPayload` | `consume_source_audit_material` | `AuditProjection`;`AuditAppendRecord`;gap marker | audit repo;correlation repo;idempotency;outbox | missing context gap/delayed | pass |
| `ConsumeIdentityObservationContextFlow` | `IdentityObservationContextPayload` | `consume_identity_observation_context` | `ReferenceSnapshotState`;`ReferenceRefreshRecord` | reference repo;subject resolver;idempotency;outbox | stale/unresolved snapshot | pass |
| `ConsumeGovernanceAuditContextFlow` | `GovernanceAuditContextPayload` | `consume_governance_audit_context` | evidence boundary snapshot;gap marker | reference repo;evidence resolver;idempotency;outbox | not-visible accepted with surface | pass |
| `ConsumeArtifactEvidenceContextFlow` | `ArtifactEvidenceContextPayload` | `consume_artifact_evidence_context` | `EvidenceLinkage` input marker;reference snapshot | audit repo;evidence resolver;reference repo | missing digest delayed;body quarantine | pass |
| `ConsumeRuntimeSignalSummaryFlow` | `RuntimeSignalSummaryPayload` | `consume_runtime_signal_summary` | `SafeSignal` input marker;reference snapshot | correlation repo;runtime resolver;reference repo | missing correlation partial/gap | pass |
| `ConsumeSandboxSignalSummaryFlow` | `SandboxSignalSummaryPayload` | `consume_sandbox_signal_summary` | `SafetyDisposition`;`SafeSignal` input marker | intake repo;correlation repo;sandbox resolver | unsafe quarantine;no receipt no-op/snapshot | pass |
| `ConsumeArchiveHandoffFeedbackFlow` | `ArchiveHandoffFeedbackPayload` | `consume_archive_handoff_feedback` | `HandoffLifecycleRecord`;delivery marker | handoff repo;reference repo;idempotency;outbox | unknown handoff delayed/dead-letter | pass |
| `ConsumeReportConsumerFeedbackFlow` | `ReportConsumerFeedbackPayload` | `consume_report_consumer_feedback` | `PeripheralDeliveryState`;`PeripheralDeliveryRecord`;`GapState` | retention repo;projection store;idempotency;outbox | gap kind opens gap;unknown delivery delayed | pass |

### 10.3 Representative consumer flow diagrams

#### 函数级调用图: ConsumeBusObservationMaterialFlow

```text
[Worker]
  | call handle(ObservationInboundEventEnvelope<BusObservationMaterialPayload> envelope)
  | validate envelope and schema version
  v
[ObservationInboundEventService]
  | tx begin
  | call ObservationOperationContextFactory.for_inbound_event(event_identity,...)
  | call ObservationIdempotencyRepository.reserve_or_load(context,tx)
  | branch Acquired/Replay/Conflict/InFlight;apply source-event secondary uniqueness
  | call ObservationSourceSummaryResolver.resolve_observation_source(source_ref)
  v
[Domain]
  | call ObservationReceipt::receive(...)
  | call SafetyDisposition::evaluate(...)
  | call ObservationReceipt.accept/quarantine/reject(...)
  v
[Repositories]
  | save local receipt / disposition / decision
  | append outbox snapshot
  | save consumer receipt and stored result
  | tx commit
```

#### 函数级调用图: ConsumeReferenceContextFlow

```text
[Worker]
  | call handle(ObservationInboundEventEnvelope<IdentityObservationContextPayload> envelope)
  v
[ObservationInboundEventService]
  | tx begin
  | call ObservationIdempotencyRepository.reserve_or_load(context,tx)
  | apply source-version monotonic guard before local state transition
  | call SubjectObservationResolver.resolve_subject_context(subject_ref)
  v
[Domain]
  | call ReferenceSnapshotState::pending(snapshot_ref, subject_ref)
  | call snapshot.refresh(record, safe_summary_ref)
  | or call snapshot.mark_stale / mark_unresolved
  v
[Repositories]
  | save snapshot + refresh record
  | mark affected read/handoff/gap views stale
  | save receipt and stored result
  | tx commit
```

### 10.4 Per-consumer branch notes

| Flow | accepted path | delayed / rejected / quarantine path |
|---|---|---|
| `ConsumeBusObservationMaterialFlow` | same as `SubmitObservationMaterialFlow` but actor comes from trusted producer envelope | unsupported schema no parse;forbidden body quarantine |
| `ConsumeSourceAuditMaterialFlow` | create audit projection input marker and append audit record | missing correlation creates gap/delayed,not source truth repair |
| `ConsumeIdentityObservationContextFlow` | register/refresh subject reference snapshot | unresolved subject saved as snapshot state,not missing identity truth |
| `ConsumeGovernanceAuditContextFlow` | save body-free governance evidence reference snapshot | governance decision/control truth not written |
| `ConsumeArtifactEvidenceContextFlow` | save linkage input marker with digest summary | artifact content/evidence body not persisted |
| `ConsumeRuntimeSignalSummaryFlow` | record safe signal input or reference snapshot | runtime execution result not written |
| `ConsumeSandboxSignalSummaryFlow` | update local safety/signal marker | sandbox execution body/result not written |
| `ConsumeArchiveHandoffFeedbackFlow` | record handoff lifecycle / delivery state | archive package truth not written |
| `ConsumeReportConsumerFeedbackFlow` | update peripheral delivery/gap state | report consumer truth not written |

### 10.5 Consumer stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 9 个 Consumer 是否均有 flow | pass_with_affected_open | §10.2 与 exact cards I01-I09 覆盖 |
| envelope validation 是否先于 payload parse | pass_with_affected_open | shared 顺序固定；I03/I04/I05 canonical schema affected 仍开放 |
| duplicate 是否 replay stored receipt | pass_with_affected_open | replay 规则固定；`S08-CONSUMER-INDETERMINATE-COMPLETION-01` 未关闭 |
| unsupported schema 是否不解析 payload | pass | no payload parse / no local truth mutation |
| Consumer 是否不写外部 truth | pass_with_affected_open | boundary 固定；I03/I04 dependency capability proof 仍开放 |
| raw body 是否 quarantine / reject | pass_with_affected_open | redaction-first 固定；具体 recovery/action mapper 仍按 affected owner 承接 |

## 11. Outbound Event append / publish batch 9.4

Outbound Event 是 accepted Command / Consumer / Job transaction 的 durable side effect。Step 09 定义 append helper、payload source 和 publication flow;transport topic、broker、retry policy 留给 Step 14 / Step 13。

### 11.1 Accepted mutation outbox append helper

```rust
// [ObservationOutboundPayloadBuilder.from_committed_change(CommittedObservationChange change)]
let outbox_ref = id_generator.new_outbox_record_ref();
let event_ref = id_generator.new_outbound_event_ref();
let payload_snapshot_ref = id_generator.new_outbox_payload_snapshot_ref();
let committed_at = clock.now();
let effect_binding = external_effect_binding_catalog.require(
    ExternalEffectBindingSubject::OutboundEvent(event_name.clone()),
    AdapterFamily::EventPublisher,
    ExternalEffectPhase::Publication,
)?;
let snapshot_input = ObservationOutboxSnapshotInput {
    event_name,
    effect_binding_ref: effect_binding.effect_binding_ref.clone(),
    committed_subject_ref: committed_subject_ref.clone(),
    trace_ref,
    payload,
};

// [ObservationOutboundEventPayloadSnapshot::from_input(...)]
// The builder creates the envelope and immutable bytes from committed material only.
let protocol_snapshot = payload_snapshot_builder.build(
    payload_snapshot_ref.clone(),
    outbox_ref.clone(),
    event_ref.clone(),
    schema_version,
    committed_cursor.clone(),
    committed_at.clone(),
    snapshot_input,
)?;

// [ObservationOutboxPayloadSnapshot::from_protocol_snapshot(...)]
// The binding is application-local stored metadata;it is not serialized into event bytes.
let payload_snapshot = ObservationOutboxPayloadSnapshot::from_protocol_snapshot(
    effect_binding.effect_binding_ref,
    protocol_snapshot,
);

// [ObservationOutboxRecord::pending(...)]
// Record and immutable snapshot share the same accepted-UoW timestamp.
let outbox_record = ObservationOutboxRecord::pending(
    outbox_ref,
    event_ref,
    committed_subject_ref,
    payload_snapshot_ref,
    committed_cursor,
    committed_at,
);

// [ObservationOutboxRepository.append(ObservationOutboxRecord record, ObservationOutboxPayloadSnapshot payload, &dyn ObservationUnitOfWork tx)]
outbox_repo.append(outbox_record, payload_snapshot, tx).await?;
```

| helper step | 规则 |
|---|---|
| event selection | accepted mutation flow chooses event name from changed object / record |
| binding selection | injected application catalog must resolve exactly one `OutboundEvent(event_name)` with `EventPublisher/Publication`;missing,duplicate or family/capability mismatch rolls back the accepted mutation |
| payload source | committed object / state / record after domain transition |
| identity source | outbox ref,event ref and payload snapshot ref come from `IdGeneratorPort`;tagged committed cursor wraps the one allocator result from the current UoW |
| payload storage | protocol snapshot maps one-to-one to the immutable application stored snapshot and has an exact byte digest |
| binding storage | application stored snapshot copies the exact `effect_binding_ref`;raw endpoint/topic/credential remains infra-private and is never serialized into payload bytes |
| timestamp | one `committed_at` value feeds envelope/snapshot `stored_at` and record `committed_at`;timestamp is metadata,not ordering authority |
| publisher behavior | publisher receives stored snapshot only |
| failure behavior | append failure rolls back accepted mutation;publish failure does not |

### 11.2 Outbound payload mapping

| Outbound Event | Payload DTO | Produced by flow | Committed source | Publication rule |
|---|---|---|---|---|
| `ObservationReceiptChanged` | `ObservationReceiptChangedPayload` | `SubmitObservationMaterialFlow`;`ConsumeBusObservationMaterialFlow`;`RecordSafetyDispositionFlow` | saved `ObservationReceipt` | stored snapshot only |
| `SafetyDispositionChanged` | `SafetyDispositionChangedPayload` | `RecordSafetyDispositionFlow`;sandbox consumer | saved `SafetyDisposition` | stored snapshot only |
| `SafeSignalRecorded` | `SafeSignalRecordedPayload` | `RecordSafeSignalFlow`;runtime/sandbox consumer | saved `SafeSignal` | stored snapshot only |
| `AuditProjectionAppended` | `AuditProjectionAppendedPayload` | `AppendAuditProjectionFlow`;source audit consumer | saved `AuditProjection` | stored snapshot only |
| `EvidenceLinkageChanged` | `EvidenceLinkageChangedPayload` | `LinkBodyFreeEvidenceFlow`;artifact/governance consumer | saved `EvidenceLinkage` | stored snapshot only |
| `ReportHandoffChanged` | `ReportHandoffChangedPayload` | `PrepareReportHandoffFlow`;`EvaluateAuthenticityHintFlow`;handoff delivery job | saved `ReportHandoffRecord` / `AuthenticityHint` | stored snapshot only |
| `RetentionMarkerChanged` | `RetentionMarkerChangedPayload` | `SetRetentionMarkerFlow`;`ProtectActiveReferenceFlow` | saved `RetentionMarker` / `ActiveReferenceProtection` | stored snapshot only |
| `NoWriteViolationRecorded` | `NoWriteViolationRecordedPayload` | `RecordNoWriteViolationFlow`;replay/export guard | saved `NoWriteViolation` | stored snapshot only |
| `GapStateChanged` | `GapStateChangedPayload` | `RecordGapStateFlow`;gap scan;feedback consumer | saved `GapState` / `DegradedOutputState` | stored snapshot only |
| `ReferenceSnapshotChanged` | `ReferenceSnapshotChangedPayload` | reference command / context consumer / refresh job | saved `ReferenceSnapshotState` | stored snapshot only |
| `DerivedProjectionChanged` | `DerivedProjectionChangedPayload` | rebuild / rollup / replay maintenance | saved `ProjectionMaintenanceState` / progress view | stored snapshot only |
| `PeripheralDeliveryChanged` | `PeripheralDeliveryChangedPayload` | export command / export job / feedback consumer | saved `PeripheralDeliveryState` | stored snapshot only |

### 11.3 `PublishObservationOutboxFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ObservationJobRequest<PublishObservationOutboxJobInput>` |
| 入口函数 | `ObservationPublicationService.publish_observation_outbox(PublishObservationOutboxInput input)` |
| 目标对象 | outbox publication state;`PublicationReceipt`;`DeadLetterRef` |
| 依赖 port | `ObservationOutboxRepository.list_eligible_with_payload`;`ObservationJobExecutionRepository`;`ObservationEventPublisher.publish/probe_publication`;`mark_published`;`mark_failed`;`mark_dead_letter`;idempotency;stored result |
| 事务 | listing is read-only;each publication state update uses expected_version in its own UoW or controlled batch UoW |
| job report | `PublishObservationOutboxJobOutput` + `ObservationJobReportSurface` |

#### 函数级调用图: PublishObservationOutboxFlow

```text
[Worker publication loop]
  | call publish_observation_outbox(PublishObservationOutboxInput input)
  v
[ObservationPublicationService]
  | start UoW freezes exact eligible outbox plan
  | for each plan item acquire global outbox claim/fencing token
  | call ObservationEventPublisher.publish(stable_token,payload_snapshot)
  v
[Outbox repository]
  | tx begin
  | call mark_published / mark_failed / mark_dead_letter(expected_version)
  | tx commit
  v
[Stored result]
  | save publication batch report
  | complete job idempotency
```

```rust
// Start UoW already froze these exact eligible items into the immutable execution plan.
// [ObservationOutboxRepository.list_eligible_with_payload(...)]
let page = outbox_repo
    .list_eligible_with_payload(
        vec![
            OutboxPublicationEligibility::Pending,
            OutboxPublicationEligibility::RetryableFailed,
        ],
        input.cursor,
        input.limit,
    )
    .await?;

for versioned_item in page.items {
    let item = versioned_item.value;
    let expected_version = versioned_item.version;
    let outbox_ref = item.record.outbox_ref;
    let effect_binding_ref = item.payload_snapshot.effect_binding_ref.clone();
    validate_planned_effect_binding(
        &immutable_plan_item,
        &effect_binding_ref,
        AdapterFamily::EventPublisher,
        ExternalEffectPhase::Publication,
    )?;
    let claim = job_execution_repo
        .acquire_item_claim(
            execution_ref.clone(),
            ObservationJobWorkKey::Outbox(outbox_ref.clone()),
        )
        .await?;
    let token = ObservationPublicationToken {
        effect_binding_ref,
        event_ref: item.record.event_ref.clone(),
        outbox_ref: outbox_ref.clone(),
        payload_digest: item.payload_snapshot.payload_digest.clone(),
        schema_version: item.payload_snapshot.schema_version.clone(),
    };
    // [ObservationEventPublisher.publish(ObservationPublicationToken token, ObservationOutboxPayloadSnapshot payload)]
    let publish_result = event_publisher
        .publish(token, item.payload_snapshot)
        .await;
    let tx = unit_of_work.begin().await?;
    job_execution_repo.register_fence(&claim, tx.as_ref())?;
    match publish_result {
        Ok(receipt) => {
            // [ObservationOutboxRepository.mark_published(...)]
            outbox_repo
                .mark_published(outbox_ref, receipt, expected_version, tx.as_ref())
                .await?;
        }
        Err(error) if error.is_retryable() => {
            // [ObservationOutboxRepository.mark_failed(...)]
            outbox_repo
                .mark_failed(
                    outbox_ref,
                    PublicationFailure::retryable(error),
                    expected_version,
                    tx.as_ref(),
                )
                .await?;
        }
        Err(error) => {
            // [ObservationOutboxRepository.mark_dead_letter(...)]
            outbox_repo
                .mark_dead_letter(
                    outbox_ref,
                    DeadLetterReason::from(error),
                    expected_version,
                    tx.as_ref(),
                )
                .await?;
        }
    }
    unit_of_work.commit(tx).await?;
}
```

| 分支 | 处理 |
|---|---|
| duplicate job | replay stored publication report;do not list or publish |
| nonterminal resume | reuse immutable plan;claim only unclassified/retryable items;do not relist |
| publisher success | mark published with expected version |
| retryable failure | mark failed retryable;do not mutate truth |
| permanent failure | mark dead-letter;do not mutate truth |
| payload corrupt | dead-letter protocol error;do not rebuild from current truth |
| binding missing / mismatched | no external call;retain durable item and classify consistency/manual recovery;never route through current default |
| publish / local finalize unknown | probe stable publication token;Unknown/Unsupported stops automatic resend |

| 测试切口 | 断言 |
|---|---|
| publish success | pending item marked published |
| retryable failure | truth unchanged,failed marker saved |
| duplicate job | publisher not called |
| payload corrupt | no repository read to reconstruct payload |
| route rotation after acceptance | old snapshot/token still selects the original binding ref;new destination receives no old event |

### 11.4 Outbound stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 12 个 outbound payload 是否映射到 committed source | pass_with_affected_open | §11.2 与 exact cards E01-E12 覆盖；I05/producer binding affected 保留 |
| accepted mutation 是否 append stored payload snapshot | pass_with_affected_open | helper 顺序固定；`S08-CONSUMER-OUTBOX-SURFACE-01` 等 landing affected 保留 |
| publisher 是否只读取 stored snapshot | pass | §11.3 固定，不允许 current-truth rebuild |
| publish failure 是否不回滚 original truth | pass_with_affected_open | local publication marker 语义固定；external phase/retry accounting 仍开放 |
| event payload 是否 body-free | pass | payload source 只含 refs/state/surface/digest，禁止 raw body |

## 12. Operations Job flow batch 9.5

### 12.1 Job flow table

| Flow | 协议 DTO | 入口函数 | 允许写入 | 主要 port | 禁止事项 | 停审 |
|---|---|---|---|---|---|---|
| `RebuildObservationReadModelsFlow` | `RebuildObservationReadModelsJobInput` | `rebuild_observation_read_models` | read model、diagnostic view、maintenance、progress | projection store;reference maintenance repo;idempotency;stored result | 不修 source truth | pass |
| `RebuildSignalRollupsFlow` | `RebuildSignalRollupsJobInput` | `rebuild_signal_rollups` | rollup window、rollup rebuild state、progress | correlation repo;reference maintenance repo;projection store | 不读取 raw metric / trace | pass |
| `RefreshReferenceSnapshotsFlow` | `RefreshReferenceSnapshotsJobInput` | `refresh_reference_snapshots` | reference snapshot、refresh record、reference view | reference repo;resolvers;projection store | 不复制 external body | pass |
| `ScanObservationGapsFlow` | `ScanObservationGapsJobInput` | `scan_observation_gaps` | gap state、gap scan record、gap status view | retention repo;projection store;reference repo | 不补造 source material | pass |
| `CoordinateObservationReplayFlow` | `CoordinateObservationReplayJobInput` | `coordinate_observation_replay` | replay coordination、execution record、maintenance state | retention repo;reference maintenance repo;projection store | 不绕过 no-write,不修 source | pass |
| `PrepareReportHandoffDeliveryFlow` | `PrepareReportHandoffDeliveryJobInput` | `prepare_report_handoff_delivery` | handoff lifecycle、delivery preparation marker、outbox | handoff repo;handoff delivery port;outbox | 不生成 final verdict/signoff/run id | pass |
| `PrepareExternalAuditExportDeliveryFlow` | `PrepareExternalAuditExportJobInput` | `prepare_external_audit_export_delivery` | export preparation、delivery state、delivery record | projection store;peripheral export delivery port;outbox | external audit / GRC 不成为 truth owner | pass |
| `RebuildPeripheralViewsFlow` | `RebuildPeripheralViewsJobInput` | `rebuild_peripheral_views` | peripheral view、delivery state、progress | projection store;retention repo;idempotency | 不反写核心 observation truth | pass |

### 12.2 Representative maintenance job diagrams

#### 函数级调用图: RebuildObservationReadModelsFlow

```text
[Jobs entry]
  | call handle(ObservationJobRequest<RebuildObservationReadModelsJobInput> request)
  v
[ObservationMaintenanceService]
  | start UoW:reserve_or_load,canonical-bind target/scopes,create report draft
  | create missing-target maintenance as Stale,or versioned load current state
  | resolve Scheduled or optional Approved Replay authorization and transition maintenance to Rebuilding
  | capture ByMaintenanceTarget(target),replace target progress as Rebuilding,commit
  | call DerivedMaintenancePolicy.assert_rebuild_allowed(target_ref,...)
  | for each canonical item_scope in input.scopes
  v
[Projection store]
  | acquire global ProjectionScope item claim/fencing token
  | begin one short item UoW and register claim fence
  | versioned reload immutable plan,target maintenance/report and current projection bundles
  | call ObservationProjectionSourceReader.capture(item_scope, item_tx)
  | receive bounded committed source items + dual watermarks + scope read fence
  | if a canonical lookup is missing,allocate each new view ref through IdGeneratorPort and stage its lookup binding
  | retain each current version as the corresponding expected_version
  | pure-build ObservationReadModel and DiagnosticProjectionReplacement from captured items only
  | call replace_observation_read_model(..., source_position, read_model_expected_version, tx)
  | call replace_diagnostic_view(..., source_position, diagnostic_expected_version, tx)
  | update report draft item refs;do not mark target progress Fresh here
  | validate read fence and tx commit
  v
[Target finalize UoW]
  | recapture ByMaintenanceTarget(target) and validate target-scope membership fence
  | verify every member read/diagnostic marker independently remains Fresh
  | replace target progress and complete/fail maintenance + report + stored result
  | complete idempotency and commit
```

start UoW 在进入 scope loop 前已经提交,不能与 item UoW 嵌套。它把 canonical sorted/unique `input.scopes` 原子绑定到 `target_ref`;首次 binding 同时从全部 member scope positions 初始化 `ByMaintenanceTarget(target_ref)` aggregate position/revision,同 UoW 的 target capture 必须 read-your-writes。既有 binding 必须完全匹配,不得在重试时悄悄扩大或缩小 target,也不得重置 aggregate position。每个 `item_scope` 独立 commit/rollback;某一 scope 失败只进入 report 的 failed/gap classification,不得回滚已提交 scope。target progress 只能用 `ObservationProjectionScope::ByMaintenanceTarget(target_ref)` 捕获的 source position 和 fence 更新,不得拿任一 item scope 的 fence 代表整个 target。

若 projection 不依赖某个 namespace,对应 `ProjectionSourcePosition` 字段为 `None`;若依赖但当前 position 无法确定,该 item 必须 failed/unavailable,不得用 `None` 冒充 fresh。`input.source_cursor` 只要求 captured observation position 不低于该值,不能作为 source item 过滤条件。capture 与 replace 必须使用同一个 item UoW;scope 过大、source item 超出实现上限、source timestamp 不完整、依赖未知或 fence 无法建立时整个 item 失败,不得分页截断、补默认 diagnostic window 后标 fresh。replace adapter 只把 applied watermark 推进到 captured position;并发相关 mutation 会使 fence validation / commit 冲突或留下更高 stale watermark,因此 first create 和 existing replace 都不会覆盖新 stale 信号。

#### Rebuild application-local pure helper signatures

| helper | 精确签名 | 成功条件 / 输出 | 失败条件 |
|---|---|---|---|
| bound-scope guard | `fn ensure_scope_is_bound(binding: &MaintenanceTargetScopeBinding, scope: &ObservationProjectionScope) -> Result<(), ApplicationError>` | scope 在 canonical binding 中恰好一次 | binding malformed或scope缺失 |
| writable-item guard | `fn ensure_rebuild_item_writable(maintenance: &ProjectionMaintenanceState, report: &ObservationJobReportDraft) -> Result<(), ApplicationError>` | maintenance为`Rebuilding`且report为`Draft` | terminal/report mismatch/target state漂移 |
| approved replay guard | `fn validate_approved_replay_target(scope: &ReplayScope, target_ref: &MaintenanceTargetRef) -> Result<(), ApplicationError>` | state为`Approved`,target被包含,allowed effect仅覆盖observation-derived maintenance | missing target、非Approved、effect越界 |
| minimum position guard | `fn ensure_captured_observation_position_at_least(snapshot: &ProjectionSourceSnapshot, minimum: &ObservationCursor) -> Result<(), ApplicationError>` | observation position存在且`>= minimum` | no-dependency/position missing/below minimum;不得过滤items |
| source-fence precheck | `fn validate_source_fence(snapshot: &ProjectionSourceSnapshot, scope: &ObservationProjectionScope, transaction_ref: &ObservationTransactionRef) -> Result<(), ApplicationError>` | snapshot scope、fence scope、transaction ref一致且record cursors不超过captured positions | 任一不匹配;commit-time validation仍由adapter执行 |
| read-model assembler | `fn assemble_observation_read_model(read_model_ref: ObservationReadModelRef, freshness_marker_ref: ProjectionFreshnessMarkerRef, scope: ObservationProjectionScope, items: &[ProjectionSourceRecord]) -> Result<ObservationReadModel, ApplicationError>` | 从完整typed items生成canonical receipt/signal/audit refs和visibility | required family缺失、item/ref不匹配、重复或forbidden state |
| diagnostic-summary assembler | `fn assemble_diagnostic_summary(summary_ref: DiagnosticSummaryRef, scope_ref: DiagnosticScopeRef, items: &[ProjectionSourceRecord]) -> Result<DiagnosticSummary, ApplicationError>` | 仅从captured signal/gap/no-write items生成canonical sets和summary completeness | member不属于captured set、状态无法解释或集合超限 |
| diagnostic-view assembler | `fn assemble_diagnostic_view(view_ref: DiagnosticViewRef, freshness_marker_ref: ProjectionFreshnessMarkerRef, scope: ObservationProjectionScope, diagnostic_scope: &DiagnosticScope, summary: &DiagnosticSummary) -> Result<DiagnosticView, ApplicationError>` | refs/scope/freshness/visibility/gaps与scope+summary一致 | scope/ref/freshness mismatch |

上述 helper 均为 application-local pure function,不访问 repository、resolver、clock、ID generator或外部 adapter。ID 必须在调用前生成；transaction/fence 的最终 authority仍属于 projection adapter commit validation。

```rust
// The start UoW has committed before this per-scope item UoW begins.
for item_scope in input.scopes.iter().cloned() {
    let item_claim = job_execution_repo
        .acquire_item_claim(
            execution_ref.clone(),
            ObservationJobWorkKey::ProjectionScope(item_scope.clone()),
        )
        .await?;
    let item_tx = uow_manager.begin().await?;
    job_execution_repo.register_fence(&item_claim, item_tx.as_ref())?;

// [ReferenceMaintenanceRepository.find_maintenance_by_target(MaintenanceTargetRef target_ref)]
let current_maintenance = reference_maintenance_repo
    .find_maintenance_by_target(input.target_ref.clone())
    .await?
    .ok_or(ApplicationError::MaintenanceTargetMissing)?;
let current_binding = reference_maintenance_repo
    .get_maintenance_target_scope_binding(input.target_ref.clone())
    .await?
    .ok_or(ApplicationError::MaintenanceTargetBindingMissing)?;
ensure_scope_is_bound(&current_binding, &item_scope)?;
let current_report = job_report_repo
    .get_report_with_version(started_report_ref.clone())
    .await?
    .ok_or(ApplicationError::JobReportMissing)?;
let current_plan = job_execution_repo
    .get_plan(current_report.value.plan_ref.clone())
    .await?
    .ok_or(ApplicationError::PersistenceInvariantViolation)?;
validate_plan_report_and_item(
    &current_plan.value,
    &current_report.value,
    &item_scope,
)?;
ensure_rebuild_item_writable(&current_maintenance.value, &current_report.value)?;

// [DerivedMaintenancePolicy.assert_rebuild_allowed(..., MaintenanceExecutionAuthorization authorization)]
let authorization = match input.replay_scope_ref.clone() {
    None => MaintenanceExecutionAuthorization::Scheduled,
    Some(scope_ref) => {
        let versioned_scope = retention_guard_repo
            .get_replay_scope_with_version(scope_ref)
            .await?
            .ok_or(ApplicationError::ReplayScopeMissing)?;
        validate_approved_replay_target(&versioned_scope.value, &input.target_ref)?;
        MaintenanceExecutionAuthorization::Replay(versioned_scope.value)
    }
};
derived_policy.assert_rebuild_allowed(
    input.target_ref.clone(),
    current_maintenance.value.clone(),
    authorization,
)?;

// [ObservationProjectionSourceReader.capture(ObservationProjectionScope scope, &dyn ObservationUnitOfWork tx)]
let source_snapshot = projection_source_reader
    .capture(item_scope.clone(), item_tx.as_ref())
    .await?;
if let Some(minimum_cursor) = input.source_cursor.as_ref() {
    ensure_captured_observation_position_at_least(&source_snapshot, minimum_cursor)?;
}

let current_read_model = projection_store
    .get_observation_read_model(item_scope.clone())
    .await?;
let current_diagnostic = projection_store
    .get_diagnostic_projection_with_version(item_scope.clone())
    .await?;
// Existing lookup refs are preserved;only first create allocates a new projection identity.
let read_model_ref = current_read_model
    .as_ref()
    .map(|versioned| versioned.value.read_model_ref.clone())
    .unwrap_or_else(|| id_generator.new_observation_read_model_ref());
let diagnostic_view_ref = current_diagnostic
    .as_ref()
    .map(|versioned| versioned.value.view.view_ref.clone())
    .unwrap_or_else(|| id_generator.new_diagnostic_view_ref());
let diagnostic_scope_ref = current_diagnostic
    .as_ref()
    .map(|versioned| versioned.value.scope.scope_ref.clone())
    .unwrap_or_else(|| id_generator.new_diagnostic_scope_ref());
let read_model_freshness_marker_ref = current_read_model
    .as_ref()
    .map(|versioned| versioned.value.freshness_marker_ref.clone())
    .unwrap_or_else(|| id_generator.new_projection_freshness_marker_ref());
let diagnostic_freshness_marker_ref = current_diagnostic
    .as_ref()
    .map(|versioned| versioned.value.view.freshness_marker_ref.clone())
    .unwrap_or_else(|| id_generator.new_projection_freshness_marker_ref());
let source_position = source_snapshot.source_position.clone();
let diagnostic_summary_ref = id_generator.new_diagnostic_summary_ref();
let read_model_expected_version = current_read_model
    .as_ref()
    .map(|versioned| versioned.version.clone());
let diagnostic_expected_version = current_diagnostic
    .as_ref()
    .map(|versioned| versioned.version.clone());

let item_transaction_ref = item_tx.transaction_ref();
validate_source_fence(
    &source_snapshot,
    &item_scope,
    &item_transaction_ref,
)?;
let read_model = assemble_observation_read_model(
    read_model_ref.clone(),
    read_model_freshness_marker_ref,
    item_scope.clone(),
    &source_snapshot.items,
)?;

// The assembler derives all fields from the complete captured set and explicit job scope.
let diagnostic_scope = DiagnosticScope::define(
    diagnostic_scope_ref,
    item_scope.clone(),
    source_snapshot.target_refs.clone(),
    source_snapshot.diagnostic_time_window.clone(),
    input.diagnostic_visibility_scope_ref.clone(),
)?;
let diagnostic_summary = assemble_diagnostic_summary(
    diagnostic_summary_ref,
    diagnostic_scope.scope_ref.clone(),
    &source_snapshot.items,
)?;
let diagnostic_view = assemble_diagnostic_view(
    diagnostic_view_ref.clone(),
    diagnostic_freshness_marker_ref,
    item_scope.clone(),
    &diagnostic_scope,
    &diagnostic_summary,
)?;
let diagnostic_replacement = DiagnosticProjectionReplacement {
    view: diagnostic_view,
    scope: diagnostic_scope,
    summary: diagnostic_summary,
};

// [ObservationProjectionStore.replace_observation_read_model(ObservationReadModel view, ProjectionSourcePosition source_position, Option<ObservationRepositoryVersion> expected_version, &dyn ObservationUnitOfWork tx)]
projection_store
    .replace_observation_read_model(read_model, source_position.clone(), read_model_expected_version, item_tx.as_ref())
    .await?;

// [ObservationProjectionStore.replace_diagnostic_view(DiagnosticProjectionReplacement replacement, ProjectionSourcePosition source_position, Option<ObservationRepositoryVersion> expected_version, &dyn ObservationUnitOfWork tx)]
projection_store
    .replace_diagnostic_view(diagnostic_replacement, source_position.clone(), diagnostic_expected_version, item_tx.as_ref())
    .await?;

    // Save this scope's report classification;target progress remains Rebuilding.
    let mut updated_report = current_report.value;
    updated_report.accept_fence(item_claim.fencing_token.clone())?;
    updated_report.record_scope_success(
        item_scope.clone(),
        read_model_ref,
        diagnostic_view_ref,
    )?;
    job_execution_repo
        .save_plan(
            updated_plan_with_scope_success,
            Some(current_plan.version),
            item_claim.fencing_token.clone(),
            item_tx.as_ref(),
        )
        .await?;
    job_report_repo
        .save_report(updated_report, Some(current_report.version), item_tx.as_ref())
        .await?;
    uow_manager.commit(item_tx).await?;
}
```

三个 assembler 都消费 `ProjectionSourceRecord`,从 `record.item` 读取typed object,从 `record.source_observed_at`计算diagnostic window/排序,从`record.committed_cursor`校验source position coverage;不得绕过wrapper直接补时间或cursor。`record_scope_success` 是 Step 11 要求的 application report update helper:它把 scope identity 与两个 generated view refs 作为一项成功分类加入 set,不得把同 scope 同时放入 failed set。当前plan、maintenance、binding和report必须在每个item UoW内重新读取；claim fence、source fence、view/report/plan expected version必须同时成立。代码片段省略的start/finalize assembler也必须遵循相同规则。

任一 capture/assembly/CAS/fence 失败时,先 rollback 该 item UoW,再开启独立 failure-accounting UoW,重新读取 Draft report并以typed `item_scope`、typed reason和gap refs调用`record_scope_failure`;不得为scope生成或拼接failure ref。failure UoW 不保存read model/diagnostic/progress,也不把scope记为成功。public `failed_refs` 只映射失败scope内部已存在的typed subject ref或formal failure/gap ref,不制造scope identity。若failure-accounting自身失败,Job停止继续调度并进入可恢复finalize/operations error,不得遗忘已尝试项。finalize只有在target membership未变、每个请求scope恰好有success/failure classification、所有成功scope的read model与diagnostic marker均未被更高stale watermark超越时,才能把maintenance/progress标为Fresh/Completed。否则maintenance保持/进入Failed或Stale,report为partial/failed,不得只因最后一个scope成功就标整个target Fresh。

#### 函数级调用图: PrepareReportHandoffDeliveryFlow

```text
[Jobs entry]
  | call handle(ObservationJobRequest<PrepareReportHandoffDeliveryJobInput> request)
  v
[ObservationMaintenanceService]
  | start UoW:Acquired reserve,resolve ReportConsumer binding from injected catalog
  | freeze one-item plan + JobExecutionConfigSnapshot/create report with exact effect binding ref
  | commit stable HandoffPreparationToken intent before external call
  | read exact handoff and immutable evidence index input from plan
  | call HandoffReadinessPolicy.evaluate(...)
  v
[ReportHandoffDeliveryPort]
  | no database UoW is open
  | call prepare_handoff(preparation_token,handoff,evidence_index_input)
  | unknown -> probe_handoff_preparation(same token);Unknown/Unsupported stops
  | short UoW: versioned reload,save prepared lifecycle/preparation ref and report progress,commit
  | commit stable HandoffDeliveryToken intent before delivery call
  | no database UoW is open
  | call deliver_handoff(delivery_token,preparation)
  | unknown -> probe_handoff_delivery(same token);known receipt is finalize-only
  v
[Repositories: finalize UoW]
  | versioned reload handoff and report draft
  | save delivered/failed handoff state and lifecycle record
  | append ReportHandoffChanged outbox snapshot
  | finalize job report,save exact stored result,complete idempotency
  | commit
```

关键说明:
- delivery receipt 不是验收签署。
- job report 中 `job_execution_ref` 不是真实 external run id。
- evidence index input 只含 body-free refs,不含真实 evidence alias。
- start UoW 必须按 exact `consumer_ref` 从 injected catalog解析 `ReportConsumer` binding，并把同一 `effect_binding_ref` 写入 config snapshot、plan material和 preparation token；delivery token只能从原 preparation/intent复制该 ref。
- prepare / deliver 外部调用期间不得持有数据库事务;stable intent token必须先持久化。外部成功后本地失败只重做finalize；unknown先probe,不得换token、换binding或重发,不得把 external receipt 当成本仓 truth 已提交。
- `PrepareExternalAuditExportDeliveryFlow`按 exact peripheral `consumer_ref` 解析 `PeripheralConsumer` binding，并使用对称`ExportPreparationToken` / `ExportDeliveryToken`和probe规则；不得从current view重建原package或使用current target替换原binding。

### 12.3 Per-job branch notes

| Flow | success path | partial / failure path |
|---|---|---|
| `RebuildObservationReadModelsFlow` | replace read model / diagnostic / progress from committed facts | stale/missing source becomes gap/progress failed refs,not source repair |
| `RebuildSignalRollupsFlow` | rebuild rollup from saved `SafeSignal` only | raw metric/trace unavailable is not queried |
| `RefreshReferenceSnapshotsFlow` | resolver returns safe summary,save snapshot/refresh record | unavailable/unresolved saved as snapshot state |
| `ScanObservationGapsFlow` | open/update/suppress gap states | missing expected source produces gap,not synthetic receipt |
| `CoordinateObservationReplayFlow` | coordinate observation-side replay and maintenance state | no-write block records violation/report |
| `PrepareReportHandoffDeliveryFlow` | prepare/deliver body-free handoff and append lifecycle | failed delivery updates handoff failed,not final verdict |
| `PrepareExternalAuditExportDeliveryFlow` | prepare/deliver body-free export package | blocked visibility creates failed/blocked delivery |
| `RebuildPeripheralViewsFlow` | rebuild dashboard/alert/export view from committed projections | peripheral stale does not write observation truth |

### 12.4 Job idempotency and report mapping

| Flow | duplicate behavior | report changed refs | report failed refs | gap refs |
|---|---|---|---|---|
| `RebuildObservationReadModelsFlow` | replay stored report | read model / diagnostic / progress refs | failed scope refs | missing/stale refs |
| `RebuildSignalRollupsFlow` | replay stored report | rollup window / rebuild refs | failed window refs | stale signal refs |
| `RefreshReferenceSnapshotsFlow` | replay stored report | refreshed snapshot refs | invalid/failed snapshot refs | unresolved refs |
| `ScanObservationGapsFlow` | replay stored report | opened/updated gap refs | failed source refs | opened gap refs |
| `CoordinateObservationReplayFlow` | replay stored report | coordination / execution refs | blocked target refs | no-write gap refs |
| `PrepareReportHandoffDeliveryFlow` | replay stored report | handoff / preparation refs | failed handoff refs | readiness gap refs |
| `PrepareExternalAuditExportDeliveryFlow` | replay stored report | delivery / preparation refs | failed export refs | visibility/policy gaps |
| `RebuildPeripheralViewsFlow` | replay stored report | dashboard export / progress refs | failed consumer refs | stale/missing refs |

### 12.5 Operations job stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 9 个 Job 是否均有 flow | pass_with_affected_open | §12.1 覆盖 J02-J09；J01 publication 在 §11.3，合计 J01-J09 |
| Job 是否有 input/output/report 和 duplicate replay | pass_with_affected_open | Step 08 DTO + §12.4；`S08-JOB-REPORT-REF-OWNER-01` 仍开放 |
| Job 是否不修 source truth | pass_with_affected_open | 每个 per-job note 固定 no-repair；J06/H13 与 external phase affected 保留 |
| handoff/export 是否不伪造 signoff/run id/evidence alias | pass | §12.2 明确，不生成真实验收事实 |
| Job mutation 是否受 UoW / stored result 约束 | pass_with_affected_open | shared template 已固定；claim/report/UoW affected 不得宣称已实现 |

## 13. Final audit batch 9.6

### 13.1 Flow coverage summary

> **Current authority:** 本节原有的 `pass` 只表示旧批次表列出协议，不足以证明逐接口闭口。
> 入口、owner、port、写集、结果、错误、测试切口和 affected 以
> `03_ddd_step_09_exact_flow_cards.md` 为准；本文件的 shared template 只表达共性顺序。

| Flow family | Step 08 count | Step 09 covered count | 结论 |
|---|---:|---:|---|
| Command | 16 | 16 | pass |
| Query | 14 | 14 | pass |
| Inbound Consumer | 9 | 9 | pass |
| Outbound Event payload append mapping | 12 | 12 | pass |
| Operations Job | 9 | 9 | pass |
| shared templates | 5 | 5 | pass |

说明:
- Operations Job 9 条包含 `PublishObservationOutboxFlow` 和 8 条 maintenance job。
- Query / Consumer / Outbound / Job 的重复结构用 shared template + flow table + representative diagram 收口,但没有遗漏任何 Step 08 public protocol。

### 13.2 Cross-flow closure audit

| 审计项 | 结论 | 依据 |
|---|---|---|
| command transaction order consistency | pass_with_affected_open | 所有 accepted mutation 遵循固定顺序；operation-specific cursor/record landing 缺口按 Step 11 / affected register 继续开放 |
| expected version source consistency | pass_with_affected_open | mutation save 仅使用 Step 07 versioned read；缺少 callable 的协议在 exact card 中 fail closed |
| outbox payload snapshot immutability | pass | payload 在 accepted mutation 内构造并持久化;publisher 只读 stored snapshot,不回查 current truth 重建 |
| external binding immutability | pass | accepted event按event name冻结binding ref；publication/handoff/export token从stored snapshot或Job start snapshot复制，config切换不重定向old effect |
| query no-write boundary | pass | 14 条 Query 均不 begin write UoW,不 save truth,不 append outbox,不 refresh snapshot,不触发 rebuild |
| inbound consumer no external truth boundary | pass | 9 条 Consumer 只写本地 receipt / marker / snapshot / gap / history,不写 Governance / Artifact / Identity / Runtime / Sandbox / Archive / Report truth |
| job no-repair boundary | pass_with_affected_open | 9 条 Job 卡已逐项记录 derived/progress/delivery/report/publication边界；J06 与外部 phase/claim owner仍开放 |
| report / handoff / export no-signoff boundary | pass | handoff/export 仅生成 body-free input、preparation、delivery marker 与 report;不伪造真实 `run_id`、验收签署、evidence alias |
| duplicate replay consistency | pass | Command / Consumer / Job duplicate 均 replay Step 06 stored result / receipt / report,不重跑 side effect |
| gap / degraded / stale surface consistency | pass | missing dependency、visibility block、stale projection、rebuild in progress 均以 Step 08 surface / gap / marker 表达,不由 read path 或 feedback path inline 修复 |
| phase boundary consistency | pass_with_affected_open | Step 09 只定义函数级流；状态、持久化、错误、并发和配置由后续 Step 反查，未决 owner 不被假定已实现 |
| Step 12 error/recovery definition-use | pass_with_affected_open | exact cards引用typed error/recovery owner；result-body、recovery-class、external-phase等 affected 继续开放 |

### 13.3 Design-side fixes made during Step 09

| 修正 | 范围 | 原因 |
|---|---|---|
| 将旧 72 行 Step 09 降级为 historical material,按 Step 08 inventory 全量重建 | 当前 Step 09 文件 | 旧稿仍使用 `IngestObservationMaterialCommand`、`ObservationEnvelope`、metric/trace/hash chain 心智,与当前 full-restart 真相源冲突 |
| 统一 command / consumer / job duplicate replay 口径为 stored result / stored receipt / stored report | 当前 Step 09 文件 | 避免实现端在不同入口重跑 mutation 或重新发布 side effect |
| 统一 publisher 口径为“只发布 stored payload snapshot” | 当前 Step 09 文件 | 闭合 no-write 与 payload immutability 边界,避免发布时回查 truth 拼 payload |
| 统一 Query 口径为 response surface only | 当前 Step 09 文件 | 明确 stale / missing / disabled / rebuilding 只能通过 surface 返回,不能在读路径自修复 |
| 回补 Step 06 application job carrier、maintenance authorization与projection identity helper | `03_ddd_step_06_object_contracts.md` | staged rebuild需要typed per-scope success/failure、Scheduled/Approved Replay区分和稳定projection ref |
| 回补 Step 07 query carrier、projection source/read-fence、target binding、diagnostic composite、versioned replace与job report ports | `03_ddd_step_07_trait_port_adapter_contracts.md` | 函数流必须有可调用的exact port/signature,且first create/replace/target finalize共享一致性证明 |
| 回补 Step 08 query request/result surface、diagnostic composite字段和rebuild Job schema | `03_ddd_step_08_protocol_contracts.md` | public input/output必须承接missing/not-visible/stale/rebuilding以及target-bound rebuild |
| Step 14反查回补outbox/external effect binding传播 | Step 08 / 当前文件 | 防止accepted event或已计划handoff/export在配置切换后被发送到新destination；raw route仍留在infra |
| Step 12反查补齐error owner、recovery class、public error/result-ref互斥 | Step 06 / 07 / 08 / 当前文件 | 既有函数分支现在可按typed enum映射,不再依赖未定义generic error或自由文本 |

上述回补已实际写入对应 Step 06 / 07 / 08 中间产物,不是待办或“无需回写”声明。Step 09 的后续反查若再次改变这些签名,必须同步更新本表。

### 13.4 Step 10~13 handoff items

| 后续 Step | 需要继续闭口的事项 |
|---|---|
| Step 10 state matrix | 为 `ObservationReceipt`、`SafetyDisposition`、`CorrelationContext`、`SafeSignal`、`AuditProjection`、`EvidenceLinkage`、`ReportHandoffRecord`、`AuthenticityHint`、`RetentionMarker`、`ActiveReferenceProtection`、`ReplayScope`、`NoWriteViolation`、`GapState`、`ReferenceSnapshotState`、publication state 明确合法迁移与 terminal state |
| Step 10 state matrix | 明确 `Delayed` / `Rejected` / `Quarantined` / `NoOp` / `DeadLettered` 在 command/consumer/job/report surface 上的状态主语和迁移守卫 |
| Step 11 persistence / consistency | 定义 truth、history、outbox payload snapshot、projection stale marker、stored result、delivery state 的原子持久化边界和 version/index 约束 |
| Step 12 error / recovery | 已由当前Step 12反查闭合idempotency conflict、unsupported schema、visibility blocked、resolver unavailable、handoff/export delivery failure、payload corrupt、commit unknown和consistency defect mapping |
| Step 13 concurrency / idempotency | 定义 outbox publication optimistic conflict retry、job partial batch replay、consumer dedup window、replay coordination re-entry、防重顺序约束 |

### 13.5 Step 09 completion checklist

| Checklist | 状态 |
|---|---|
| Step 08 全部 16 Command 已收口到函数级 flow | [x] |
| Step 08 全部 14 Query 已收口到 read-only flow | [x] |
| Step 08 全部 9 Inbound Consumer 已收口到 envelope/idempotency/local mutation flow | [x] |
| Step 08 全部 12 Outbound payload 已映射 committed source | [x] |
| publication flow 已与 append flow 分离并说明 stored snapshot rule | [x] |
| 9 个 Operations Job（J01-J09）均有独立 exact-flow card，并说明 duplicate replay / report surface / no-repair | [x] |
| 未越界提前写 Step 10~14 正式内容 | [x] |
| 正式 `03-详细设计.md` 仍未装配 | [x] |

## 14. 回填草稿

> 正式回填位置: `03-详细设计.md` §8 逐接口函数级处理流

正式 `03-详细设计.md` 在 Step 19 装配时,`§8` 建议按下列结构回填:

```markdown
## 8. 逐接口函数级处理流

### 8.1 共享处理模板
- Command accepted transaction template
- Query read-only template
- Inbound consumer accepted template
- Operations job mutation template
- Outbound append / publish template

### 8.2 Command flows
- intake and signal commands
- audit / evidence / handoff commands
- retention / replay / gap / reference commands

### 8.3 Query flows
- intake / signal / audit read models
- handoff / retention / gap / reference views
- diagnostic / peripheral export / rebuild progress views

### 8.4 Inbound consumer flows
- bus / source / identity / governance / artifact / runtime / sandbox / archive / report feedback consumers

### 8.5 Outbound event append and publication
- payload snapshot append helper
- 12 outbound payload mapping
- publish observation outbox

### 8.6 Operations jobs
- rebuild / refresh / gap scan / replay coordination
- handoff delivery / external audit export / peripheral rebuild

### 8.7 Cross-flow closure audit
- no-write / no external truth / stored snapshot / duplicate replay / later-step handoff
```

## 15. 待确认事项

| 项 | 当前判断 | 处理方式 |
|---|---|---|
| 是否存在阻塞 Step 09 完成的上游问题 | 否 | 当前可停审 |
| 是否需要在 Step 09 先定义状态矩阵细节 | 否 | 留给 Step 10 |
| 是否需要在 Step 09 先定义 DDL、index、retry interval、topic | 否 | 留给 Step 11 / Step 13 / Step 14 |
| 是否需要在 Step 09 修改正式 `03-详细设计.md` | 否 | 留给 Step 19 |

## 16. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 本步是否遵守“一个 Step 一个 Step,用户确认后再进入下一 Step” | 是 |
| 本步是否仅修改 Step 09 中间产物与台账,未提前推进正式 `03` 装配 | 是 |
| 本步是否保持 Observability 只承载观测与审计投影,不拥有业务 truth | 是 |
| log/metric/trace/audit event schema、redaction、correlation id、evidence linkage、retention marker、report handoff、no-write 边界是否在 flow 中体现 | 是 |
| 当前是否可进入 Step 10 | 可以,但必须等待用户确认；Step 10 只能读取 `03_ddd_step_09_exact_flow_cards.md` 作为逐协议输入 |

进入 Step 10 前必须先读取:
- `standards/document/详细设计讨论流程_SOP.md` Step 10
- `standards/document/详细设计书写规范.md` 中状态机 / 转换矩阵相关章节
- 本文件 `03_ddd_step_09_function_flows.md`
- `03_ddd_step_06_object_contracts.md`
- `03_ddd_step_07_trait_port_adapter_contracts.md`
- `03_ddd_step_08_protocol_contracts.md`
- `02_hld_step_08_processing_flows.md`
