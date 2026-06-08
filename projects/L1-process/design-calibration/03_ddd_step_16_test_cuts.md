# L1-process 03 DDD Step 16 测试切口与最小验证清单

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 书写规范: `standards/document/详细设计书写规范.md` §5.15
> 上游输入: `projects/L1-process/05-测试方案.md`;`projects/L1-process/06-验收标准.md`
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_05_module_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_09_function_flows.md`
> - `projects/L1-process/design-calibration/03_ddd_step_10_state_matrix.md`
> - `projects/L1-process/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
> - `projects/L1-process/design-calibration/03_ddd_step_12_error_recovery.md`
> - `projects/L1-process/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
> - `projects/L1-process/design-calibration/03_ddd_step_15_observability_audit.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 5 模块契约 | 七个 workspace member 与依赖方向 | 测试切口按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 分层 |
| Step 8 协议契约 | 13 个 Command、11 个 Query、7 个 inbound event、10 个 outbound event、7 个 operations job | 每个关键 public protocol 均需要正向和异常测试入口 |
| Step 9 函数流 | command / query / consumer / job 的调用链、事务和副作用 | 测试必须覆盖 success、duplicate、reject、partial failure、no-write 等路径 |
| Step 10 状态矩阵 | 16 组正式状态机和非法转换错误 | 状态机测试必须覆盖合法转换和非法转换 |
| Step 11 持久化一致性 | repository、UoW、operation result、outbox、projection、snapshot | 一致性测试必须断言 rollback、version conflict 和副作用边界 |
| Step 12 错误恢复 | public error surface、retryability、manual intervention | 错误测试必须覆盖 result missing、rollback failure、permanent publisher / handoff failure |
| Step 13 并发幂等 | operation namespace、key、digest、duplicate replay、commit unknown | 幂等测试必须验证 duplicate 不重放 domain / resolver / publisher / handoff |
| Step 15 观测审计 | 日志、指标、审计、trace 和 forbidden field | 观测测试必须覆盖 forbidden body、低基数指标和 config validation |

---

## 3. SOP 问题回答

1. 每个模块至少需要哪些单元测试?

   回答:`contracts` 测 DTO schema、metadata、receipt、event / job roundtrip;`domain` 测对象不变量、policy、state matrix;`application` 测 flow 编排、UoW、幂等、错误映射;`infra` 测 repository / adapter / runtime builder 语义;`api` 测 handler validation 和 protocol mapping;`worker` 测 inbound consumer 与 outbox publish;`jobs` 测 job validation、partial failure、report 和 duplicate replay。

2. 每个接口至少需要哪些正向和异常测试?

   回答:每个 Command 至少覆盖 success、duplicate replay、idempotency conflict、domain reject / repository conflict。每个 Query 至少覆盖 available、missing、not visible、degraded / unavailable 和 no-write。每个 inbound event 至少覆盖 accepted、duplicate、quarantine、delayed / noop。每个 outbound event 至少覆盖 payload mapping、forbidden body absent 和 publish failure marker。每个 job 至少覆盖 completed、duplicate、invalid input、partial failure。

3. 状态机合法转换和非法转换如何测试?

   回答:以 Step 10 的状态矩阵为唯一真相源。每组状态机至少覆盖一条主线合法转换、一条边界合法转换和一条非法转换。非法转换必须断言 Step 10 指定的 `DomainError` 或 Step 12 public mapping,并断言不写 success trace、outbox、projection marker 或 operation result。

4. 事务、一致性、幂等和并发如何验证?

   回答:通过 fake / in-memory repository、fake UoW、fake resolver / publisher / handoff port 注入 version conflict、storage unavailable、result store missing、commit unknown、same key same digest、same key different digest、per-item partial failure 和 rollback failure。测试必须断言 truth、trace、outbox、projection、snapshot、marker、idempotency、operation result 的写入顺序和 rollback 边界。

5. 哪些测试细节应留给测试方案?

   回答:完整用例编号、优先级、覆盖率目标、fixture 数据集、真实 durable store / broker / sibling adapter 联调、CI job 分层、报告模板和执行排期留给 `05-测试方案.md`。本 Step 只定义详细设计可落码所需的最小验证入口。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| `05-测试方案.md` | 仍保留旧 template / frozen profile 口径,不能直接作为新版 03 真相源 | 本 Step 以当前 Step 8~15 为真相源,仅把测试方案作为方向性输入 |
| Step 8 / 9 | 每个 protocol / flow 的测试提示分散 | 本 Step 汇总 Command、Query、Event、Job 最小测试入口 |
| Step 10 | 状态矩阵已闭合,但缺测试反查清单 | 本 Step 给出 16 组状态机测试切口 |
| Step 11 / 12 / 13 | 事务、错误、幂等分散在不同 Step | 本 Step 汇总一致性、幂等、并发、重入和恢复测试 |
| Step 15 | 埋点字段边界已定义,但缺自动检查入口 | 本 Step 增加 forbidden field、低基数指标、redaction check 和 config validation 测试 |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 详细设计是否替代测试方案 | A. 写完整测试计划;B. 只写最小测试切口 | 采用 B。避免把测试方案的范围、排期和覆盖率目标混入详细设计 |
| 接口测试粒度 | A. 只按模块测试;B. 每个 public protocol 均有入口 | 采用 B。满足关键 Command / Query / Event / Job 正反向切口要求 |
| 状态机测试 | A. 只测 happy path;B. 合法和非法转换都测 | 采用 B。非法转换是实现可落码性的关键约束 |
| duplicate replay | A. 从 current truth 重算;B. 验证 operation result store replay | 采用 B。与 Step 12 / 13 一致 |
| fake adapter | A. 只模拟成功;B. 支持 failure injection | 采用 B。必须能验证 delayed、quarantine、partial failure、permanent failure |
| 观测测试 | A. 只检查日志存在;B. 检查字段边界和低基数标签 | 采用 B。避免 raw body / secret / high-cardinality label 泄露 |

---

## 6. 结构化中间产物

### 6.1 测试切口总图

```text
Step 5 module contracts
  -> module / crate test cuts
Step 8 protocol contracts + Step 9 function flows
  -> command / query / consumer / outbound event / job test cuts
Step 10 state matrix
  -> legal / illegal transition test cuts
Step 11-13 consistency and idempotency
  -> transaction / duplicate / conflict / rerun / commit unknown test cuts
Step 15 observability and audit
  -> log / metric / audit / redaction / script test cuts
```

规则:

- 每个测试切口必须能反查至少一个 `design-calibration/03_ddd_step_*.md` 中间产物。
- 本 Step 不定义测试排期、优先级、覆盖率阈值或具体 fixture 文件结构。
- Query 测试必须额外断言 no-write,不得通过 query 触发 projection rebuild、resolver refresh 或 reconciliation repair。

### 6.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | Step 8 `contracts` DTO | Command / Query / Event / Job / View / Error DTO roundtrip、required fields、enum variant 稳定性 | contract unit |
| `contracts_metadata_validation` | Step 8 metadata | Command idempotency key、Event dedup key、Job idempotency key 必填;Query 不携带 idempotency key | contract unit |
| `contracts_operation_digest_profile` | Step 13 key / digest schema | operation namespace、canonical digest、volatile metadata 排除 | contract unit |
| `domain_object_invariants` | Step 6 object contracts | runtime shape、profile、instance、activity、gate、checkpoint、recovery、rhythm、reference、outbox 构造和不变量 | domain unit |
| `domain_policy_accept_reject` | Step 6 policy contracts | shape adoption、profile tailoring、activity progression、gate resume、recovery、reference、trace / archive handoff policy accept / reject | domain unit |
| `domain_state_matrix_transitions` | Step 10 state matrix | 16 组状态机合法 / 非法转换和错误 variant | domain unit |
| `application_command_orchestration` | Step 9 command template | validate -> reserve -> load -> domain -> save truth / trace / outbox / result -> complete idempotency -> commit 顺序 | service test |
| `application_consumer_orchestration` | Step 9 consumer template | envelope validation、dedup、trusted source actor、snapshot / marker 写入和 duplicate receipt replay | service test |
| `application_job_orchestration` | Step 9 job template | job idempotency、per-item transaction、partial failure、stored receipt replay | service test |
| `application_error_mapping` | Step 12 error mapping | domain / repository / resolver / publisher / handoff / UoW / idempotency error 到 protocol surface | service test |
| `infra_repository_semantics` | Step 7 / 11 repository | `Versioned<T>`、`StorageVersion`、unique key、page、transaction rollback、operation result store | repository fake |
| `infra_adapter_failure_injection` | Step 7 / 14 adapter | resolver、publisher、handoff adapter 的 retryable / permanent / body rejected / digest mismatch 注入 | adapter fake |
| `infra_runtime_config_validation` | Step 14 config | `ProcessRuntimeConfig` validation、dependency binding、forbidden boundary 不可配置关闭 | config test |
| `api_handler_protocol_mapping` | Step 8 / 9 API | handler required fields、actor context、metadata validation、`ProcessApiError` mapping | handler test |
| `worker_consumer_and_outbox` | Step 8 / 9 worker | inbound event intake、dedup、quarantine / delayed / noop、outbox publish state update | worker test |
| `jobs_runner_contract` | Step 8 / 9 jobs | job input validation、scope handling、duplicate receipt、partial report、no source truth repair | job runner test |
| `observability_and_redaction_contract` | Step 15 observability | logs / metrics / audit / report 不含 raw body、secret、credential、archive package body | observability check |

### 6.3 Command 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `SyncRuntimeProcessShape_contract` | `SyncRuntimeProcessShapeFlow` | create / refresh success;duplicate replay;source unavailable;digest mismatch;no method body persisted | API + application |
| `AdoptProcessProfile_contract` | `AdoptProcessProfileFlow` | profile adoption success;duplicate;shape retired rejected;work context mismatch;result store failure rollback | API + application |
| `UpdateProcessProfileTailoring_contract` | `UpdateProcessProfileTailoringFlow` | switch tailoring success;duplicate;high-risk missing evidence;stale version conflict;retired profile reject | API + application |
| `StartProcessInstance_contract` | `StartProcessInstanceFlow` | structured `ProcessStartIntentRef` is validated against `ProcessShapeRepository.get_start_bootstrap_summary(profile.shape_ref, start_node_ref)`;summary supplies `ActivityKind` and optional gateway node/kind;initial activity / token / optional gateway bootstrap are created with generated ids;`ProcessInstance::start(profile, initial_activity_ref, actor)` sets current activity;no bootstrap `ActivityProgressionRecord`;duplicate;inactive profile;work context mismatch;missing start node;missing required gateway;gateway supplied when not required;gateway mismatch | API + application |
| `AdvanceProcessActivity_contract` | `AdvanceProcessActivityFlow` | structured `ActivityProgressionIntentRef` maps to ready/start/complete/skip/fail and token/gateway flow-control variants;activity method returns `ActivityTransitionOutcome`;progression record is built after changed token / gateway truth;expected position conflict;invalid activity state;gateway invalid route;duplicate | API + application |
| `RecordActivityFeedback_contract` | `RecordActivityFeedbackFlow` | feedback ref attach success;progression record built from outcome with empty token / gateway truth;duplicate;feedback mismatch;runtime body rejected;unresolved feedback | API + application |
| `OpenWaitingGate_contract` | `OpenWaitingGateFlow` | gate open success with `WaitingGateId` / `PauseContextId` / `WaitingGateChangeId` generated through `IdGeneratorPort`;duplicate;instance terminal;activity mismatch;missing resume requirement | API + application |
| `ResumeWaitingGate_contract` | `ResumeWaitingGateFlow` | resume success with `WaitingGateChangeId` generated for appended gate / instance change records;duplicate;decision mismatch;gate already terminal;missing pause context rejects without success side effects;token missing | API + application |
| `CreateProcessCheckpoint_contract` | `CreateProcessCheckpointFlow` | checkpoint success;duplicate;instance missing;activity not in instance;evidence invalid | API + application |
| `StartRecoveryAttempt_contract` | `StartRecoveryAttemptFlow` | recovery attempt success;duplicate;checkpoint expired;fork violation;instance terminal | API + application |
| `CompleteRecoveryAttempt_contract` | `CompleteRecoveryAttemptFlow` | applied / failed / abandoned result;duplicate;missing failure reason;missing abandon reason;conflicting reason fields;terminal attempt reject | API + application |
| `BindProcessTimebox_contract` | `BindProcessTimeboxFlow` | binding success with explicit `work_context_ref` resolution;duplicate;work context unavailable;external timebox unavailable;external timebox not in resolved work context;invalid binding;no Work truth mutation | API + application |
| `UpdateProcessStageState_contract` | `UpdateProcessStageStateFlow` | activate / pause / complete / skip success;duplicate;illegal transition;version conflict | API + application |

### 6.4 Query 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetRuntimeProcessShape_query` | `GetRuntimeProcessShapeFlow` | available、missing、not visible、stale snapshot marker、query no-write | query handler |
| `GetProcessProfile_query` | `GetProcessProfileFlow` | available、missing、not visible、degraded profile view、query no resolver call | query handler |
| `GetProcessInstance_query` | `GetProcessInstanceFlow` | available、missing、not visible、current activity / token refs stable | query handler |
| `GetActivityStatus_query` | `GetActivityStatusFlow` | activity view available、missing、feedback degraded、not visible | query handler |
| `GetWaitingGate_query` | `GetWaitingGateFlow` | waiting gate view available、missing pause context、decision degraded、not visible | query handler |
| `GetRecoveryStatus_query` | `GetRecoveryStatusFlow` | available empty、attempt missing、not visible、terminal state surface | query handler |
| `GetProcessTimeline_query` | `GetProcessTimelineFlow` | empty page、next cursor、filtered page、gap degraded、query no rebuild | query handler |
| `GetProcessProgressSummary_query` | `GetProcessProgressSummaryFlow` | fresh summary、stale summary、rebuilding / disabled surface、derived state only | query handler |
| `SearchProcessInstances_query` | `SearchProcessInstancesFlow` | result page、empty、visibility filter、stale / disabled projection | query handler |
| `GetProcessTrace_query` | `GetProcessTraceFlow` | trace page、filtered page、missing subject、no forbidden body | query handler |
| `GetReconciliationReport_query` | `GetReconciliationReportFlow` | clean report、has issues、missing report、query does not repair drift | query handler |

### 6.5 Event 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ConsumeMethodDefinitionChanged_event` | `MethodDefinitionChangedEvent` | accepted snapshot;duplicate;unsupported schema quarantine;source unavailable delayed;digest mismatch quarantine | consumer |
| `ConsumeWorkContextChanged_event` | `WorkContextChangedEvent` | accepted binding stale marker;duplicate;noop;source unavailable;no Work truth mutation | consumer |
| `ConsumeIdentityActorCapabilityChanged_event` | `IdentityActorCapabilityChangedEvent` | accepted actor capability snapshot;duplicate;missing actor quarantine;source unavailable delayed;capability stale marker | consumer |
| `ConsumeGovernanceDecisionChanged_event` | `GovernanceDecisionChangedEvent` | accepted decision marker;duplicate;decision mismatch noop;body rejected;does not resume gate | consumer |
| `ConsumeArtifactEvidenceChanged_event` | `ArtifactEvidenceChangedEvent` | accepted evidence marker;duplicate;digest mismatch quarantine;checkpoint stale marker;no artifact body persisted | consumer |
| `ConsumeRuntimeActivityFeedback_event` | `RuntimeActivityFeedbackEvent` | accepted pending marker;duplicate;feedback mismatch quarantine;source unavailable delayed;activity not completed by consumer | consumer |
| `ConsumeConversationContextChanged_event` | `ConversationContextChangedEvent` | accepted context marker;duplicate;noop;source unavailable;no conversation body persisted | consumer |
| `RuntimeProcessShapeChanged_outbound` | `RuntimeProcessShapeChangedEvent` | payload from committed `RuntimeShapeChanged`;forbidden method body absent;publish failure updates outbox only | publisher contract |
| `ProcessProfileChanged_outbound` | `ProcessProfileChangedEvent` | payload from committed `ProfileChanged`;profile state and refs stable;no tailoring body dump | publisher contract |
| `ProcessInstanceChanged_outbound` | `ProcessInstanceChangedEvent` | payload from committed `InstanceChanged`;instance state and current refs only | publisher contract |
| `ActivityProgressed_outbound` | `ActivityProgressedEvent` | payload from committed `ActivityProgressed`;feedback ref、`token_refs`、`gateway_ref`、`selected_route_ref` copied from same-transaction progression record;no runtime execution log | publisher contract |
| `WaitingGateChanged_outbound` | `WaitingGateChangedEvent` | payload from committed `WaitingGateChanged`;decision ref only;no governance decision body | publisher contract |
| `ProcessCheckpointCreated_outbound` | `ProcessCheckpointCreatedEvent` | payload from committed `CheckpointChanged`;evidence ref only;no artifact body | publisher contract |
| `RecoveryAttemptChanged_outbound` | `RecoveryAttemptChangedEvent` | payload from committed `RecoveryAttemptChanged`;failure / abandon reason matches committed attempt state;state and history refs stable | publisher contract |
| `ProcessTimingChanged_outbound` | `ProcessTimingChangedEvent` | payload from committed `TimingChanged`;timebox binding ref only;no Work truth mutation | publisher contract |
| `ProcessTraceAvailable_outbound` | `ProcessTraceAvailableEvent` | payload from committed `TraceAvailable`;publisher does not generate trace ad hoc;no observability body | publisher contract |
| `DerivedProcessViewChanged_outbound` | `DerivedProcessViewChangedEvent` | payload from committed `DerivedViewChanged`;source cursor / freshness stable;no projection body dump | publisher contract |

### 6.6 Operations Job 测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `PublishProcessOutbox_job` | `PublishProcessOutboxFlow` | publish success;retryable failure;permanent failure;duplicate job;invalid mapping rejected;truth not rolled back | job runner |
| `RebuildProcessProjections_job` | `RebuildProcessProjectionsFlow` | rebuild read model;rebuild timeline;projection failed marker;duplicate job;does not create business truth | job runner |
| `RefreshExternalContextSnapshots_job` | `RefreshExternalContextSnapshotsFlow` | refresh method / work / external context;sources unavailable partial;body rejected;duplicate job | job runner |
| `RunProcessReconciliation_job` | `RunProcessReconciliationFlow` | clean report;has issues;partial failure;duplicate;no repair | job runner |
| `PrepareProcessTraceHandoff_job` | `PrepareProcessTraceHandoffFlow` | delivered;retryable failure;permanent failure;duplicate;no observability body persisted | job runner |
| `PrepareProcessArchiveHandoff_job` | `PrepareProcessArchiveHandoffFlow` | archive delivered;partial failure;permanent failure;duplicate;no archive package body | job runner |
| `MaintainRecoveryAttempts_job` | `MaintainRecoveryAttemptsFlow` | abandon expired;skip fresh pending;partial failure;duplicate;no new process instance | job runner |

### 6.7 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `runtime_process_shape_state_transitions` | `RuntimeProcessShapeState` | `DraftIndexed -> Active -> Stale -> Active`;invalid / retired paths;`Retired -> Active` 拒绝 | domain unit |
| `process_profile_state_transitions` | `ProcessProfileState` | `Proposed -> Active -> Suspended -> Active`;switch shape;`Retired` 后拒绝 | domain unit |
| `process_instance_state_transitions` | `ProcessInstanceState` | commit-03-a:`NotStarted -> Running -> Completed / Cancelled` running subset and terminal guard;PH-04:`Waiting` / `Recovering` / `Failed` paths | domain unit |
| `activity_state_transitions` | `ActivityState` | `Planned -> Ready -> InProgress -> WaitingFeedback -> Completed`;consumer 不可 direct complete | domain unit |
| `token_state_transitions` | `TokenState` | `Active -> Waiting -> Active -> Consumed`;terminated token 不可 resume | domain unit |
| `gateway_state_transitions` | `GatewayState` | `PendingDecision -> RouteSelected` sets `selected_route_ref`;`RouteSelected -> Joined` retains selected route;pure join factory -> `PendingJoin`;`PendingJoin -> Joined` keeps selected route empty;invalid route -> `Invalid` clears it;joined 后拒绝改 route | domain unit |
| `waiting_gate_state_transitions` | `WaitingGateState` | `Waiting -> DecisionResolved -> Resumed`;cancel / expire path;consumer 不直接 resume | domain unit |
| `checkpoint_state_transitions` | `CheckpointState` | `Available -> Superseded / Invalid / Expired`;expired checkpoint 不可 recovery | domain unit |
| `recovery_attempt_state_transitions` | `RecoveryAttemptState` | `Pending -> Applied / Failed / Abandoned`;terminal attempt duplicate 不改变 state | domain unit |
| `stage_state_transitions` | `StageState` | `Pending -> Active -> Paused -> Active -> Completed`;`Completed -> Active` 拒绝 | domain unit |
| `timebox_binding_state_transitions` | `TimeboxBindingState` | `Active -> Stale -> Active`;released / invalid paths;released 后拒绝 stale | domain unit |
| `projection_freshness_state_transitions` | `ProjectionFreshnessState` | `Fresh -> Stale -> Rebuilding -> Fresh / Failed`;query 不得改 state | projection test |
| `reference_resolution_state_transitions` | `ReferenceResolutionLifecycleState` | unresolved / stale / unavailable -> resolved;invalid / digest mismatch 不写 resolved snapshot | reference test |
| `trace_handoff_state_transitions` | `TraceHandoffState` | prepared -> delivered / failed / cancelled;delivered 后不可重发 body | job / domain test |
| `outbox_publication_state_transitions` | `OutboxPublicationState` | pending -> published / retry pending / failed;published 后不回 pending | job / repository test |
| `reconciliation_result_state_transitions` | `ReconciliationResultState` | clean / has issues / failed / partial report;report 不修 truth | job test |
| `process_progress_state_derived_only` | `ProcessProgressState` | 只由 projection summary 派生;command 不直接迁移 | projection test |

### 6.8 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_duplicate_same_key_same_digest` | Step 13 duplicate replay | 返回 stored command result;无新 truth、trace、outbox、resolver call | application |
| `command_same_key_different_digest_conflict` | Step 13 idempotency conflict | 返回 `ProcessApiError::IdempotencyConflict`;不进入 domain transition | application |
| `operation_namespace_isolation` | Step 13 operation namespace | 同 raw key 在不同 command / event / job operation 下不互相 duplicate | idempotency fake |
| `duplicate_result_missing_no_recompute` | Step 12 / 13 result missing | completed idempotency 指向缺失 result 时返回 result missing;不得从 current truth 重算 | application |
| `commit_unknown_same_key_recovery` | Step 13 commit unknown | retry same key 先读 idempotency / result store,不盲写第二次 truth | service + fake UoW |
| `operation_result_save_before_complete` | Step 11 / 13 UoW ordering | result save 失败时 rollback whole command;idempotency complete 不可见 | repository fake |
| `idempotency_complete_failure_rolls_back` | Step 11 / 13 UoW ordering | complete 失败时 truth / trace / outbox / result 不提交 | service + fake UoW |
| `rollback_failure_surfaces_manual_intervention` | Step 12 rollback failure | rollback failure 返回 temporary unavailable / alert evidence;不继续写补偿 truth | service + fake UoW |
| `expected_version_conflict_rolls_back` | Step 11 / 13 optimistic concurrency | stale `ExpectedVersion` / `StorageVersion` conflict 后无 partial writes | repository fake |
| `outbox_enqueue_failure_rolls_back_truth` | Step 11 outbox consistency | outbox save failure 时 accepted truth / trace / audit 不提交 | service |
| `query_no_write_side_effects` | Step 9 / 12 query rules | Query 不 begin write UoW、不调用 resolver、不修 projection | query service |
| `consumer_duplicate_event_replays_receipt` | Step 13 event dedup | duplicate event 返回 stored `ConsumerReceipt`;无重复 marker | worker |
| `consumer_digest_conflict_quarantine` | Step 12 / 13 event conflict | same dedup key different payload quarantine / conflict;不覆盖 snapshot | worker |
| `publisher_parallel_single_winner` | Step 13 publish concurrency | 并发 publisher 只有一个 mark_published;另一个按 version conflict skip / partial | worker |
| `projection_rebuild_race_preserves_newer_cursor` | Step 13 projection race | older cursor 不覆盖 newer fresh state | projection fake |
| `reference_refresh_preserves_last_good_snapshot` | Step 12 / 13 reference race | unavailable / digest mismatch 不删除 last good snapshot | reference fake |
| `handoff_duplicate_job_no_redelivery` | Step 13 handoff rerun | duplicate job 返回 stored `JobRunReceipt`;不重复调用 handoff adapter | job runner |
| `job_same_key_different_scope_conflict` | Step 13 job digest | same job key different scope 返回 `JobError::IdempotencyConflict`;不执行 item loop | job runner |
| `job_partial_failure_commits_successful_items` | Step 9 / 12 job rules | per-item transaction 成功项保留,失败项进入 report / partial receipt | job runner |
| `reconciliation_no_auto_repair` | Step 9 / 12 reconciliation | drift report 保存,truth / projection 不被自动修复 | job runner |

### 6.9 错误 / 配置 / 观测测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `invalid_request_no_uow` | Step 8 / 12 | required field / enum / metadata invalid 时不 begin UoW | handler test |
| `domain_reject_no_success_trace` | Step 10 / 12 | `InvalidStateTransition` / boundary violation 不写 success trace / outbox | domain + service |
| `source_unavailable_mapping` | Step 12 | command -> temporary unavailable;consumer -> delayed;job -> dependency unavailable / partial | service + adapter fake |
| `digest_mismatch_and_body_rejected` | Step 12 / 15 | digest mismatch / body rejected 不写 resolved marker;logs 不含 raw body | consumer / job |
| `publisher_retryable_failure_marker` | Step 12 / 15 | retryable publish failure -> outbox retry marker;source truth 不回滚 | worker |
| `publisher_permanent_failure_marker` | Step 12 / 15 | permanent publish failure -> outbox failed marker + report / audit evidence | worker |
| `handoff_retryable_failure_marker` | Step 12 / 15 | retryable handoff failure -> failed / retryable marker;不保存 external body | job runner |
| `handoff_permanent_failure_report` | Step 12 / 15 | permanent handoff failure -> partial report / manual intervention evidence | job runner |
| `config_validation_fail_fast` | Step 14 / 15 | invalid adapter kind、missing topic、invalid retention / retry config fail fast with structured log | config test |
| `forbidden_boundary_not_configurable` | Step 14 | config 不得关闭 metadata、idempotency、audit、outbox、visibility、redaction 边界 | config test |
| `logs_do_not_include_forbidden_body` | Step 15 | logs 不含 method / work / governance / artifact / runtime / conversation raw body | observability check |
| `metrics_low_cardinality_labels` | Step 15 | metric labels 不含 request ref、actor ref、subject ref、idempotency key、source event id | observability check |
| `audit_uses_refs_only` | Step 15 | audit 只记录 trace / truth / marker / report / receipt ref 和 counts | observability check |
| `redaction_scan_blocks_raw_secret` | Step 15 script contract | redaction checker 发现 raw secret / raw body / archive package body 时失败 | script test |

### 6.10 脚本契约表

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置、测试环境 | `artifacts/test/<run_id>` | 非 0 exit code,且保留 failure report 到 artifact root |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code,且说明缺失 artifact 或报告生成失败 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | artifacts + reports | `reports/runs/<run_id>/redaction-check.md` | 发现 raw secret / raw body / forbidden package body 时失败 |

脚本契约规则:

- 参数名必须与实现仓目录规范一致。
- artifact root 固定为 `artifacts/test/<run_id>`。
- report root 固定为 `reports/`,单次运行输出到 `reports/runs/<run_id>`。
- 详细设计只定义命令契约、输入输出和失败语义,不写完整测试报告内容。
- redaction checker 必须覆盖 artifacts 和 reports,不得只扫描最终 markdown。

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_16_test_cuts.md`
>
> 延伸阅读:
> - Step 5 模块契约
> - Step 8 protocol schema
> - Step 9 function flows
> - Step 10 state matrix
> - Step 11 persistence consistency
> - Step 12 error recovery
> - Step 13 concurrency / idempotency
> - Step 15 observability / audit

`03-详细设计.md` §15 必须写入本 Step 的模块测试切口、接口测试切口、状态机测试切口、一致性 / 幂等 / 并发测试切口、错误 / 配置 / 观测测试切口和脚本契约表。详细设计只定义最小验证入口,不替代 `05-测试方案.md`。

最小验证必须覆盖 7 个模块、13 个 Command、11 个 Query、7 个 inbound event、10 个 outbound event、7 个 operations job、16 组正式状态机,以及 duplicate replay、idempotency conflict、result missing、version conflict、commit unknown、rollback failure、forbidden body、config validation、permanent publisher failure 和 permanent handoff failure。

---

## 8. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD16-OPEN-001 | `05-测试方案.md` 仍为旧口径 | 本 Step 不修测试方案,后续测试方案 SOP 需重建或校准 | 测试方案正式文档 |
| DDD16-OPEN-002 | durable store / broker / sibling adapter 集成环境 | 本 Step 只要求 fake / in-memory 能验证语义;真实环境由测试方案和实施计划定义 | 集成测试 |
| DDD16-OPEN-003 | redaction checker 的具体扫描规则 | 本 Step 固定脚本契约和失败语义;扫描模式由实现阶段补 | 脚本实现 |

无阻塞 Step 17 的待确认事项。

---

## 9. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 模块测试切口覆盖七个模块 | 通过 | 见 §6.2 |
| 每个关键 Command / Query / Event / Job 有正反向测试入口 | 通过 | 见 §6.3~§6.6 |
| 状态机覆盖合法和非法转换 | 通过 | 见 §6.7 |
| 一致性 / 幂等 / 并发覆盖 duplicate、conflict、version、commit unknown、rollback | 通过 | 见 §6.8 |
| 错误 / 配置 / 观测覆盖 forbidden body、config validation、permanent failure | 通过 | 见 §6.9 |
| 脚本契约包含 gate / report / redaction check | 通过 | 见 §6.10 |
| 未替代测试方案 | 通过 | 只定义最小验证入口 |
