# Step 16. 定义测试切口与最小验证清单

> 本文件是 `projects/L1-conversation/03-详细设计.md` 的 Step 16 中间产物。
> 本步只收稳最小测试切口,不写完整测试方案、测试排期、覆盖率目标或环境矩阵。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
- 回填章节: `projects/L1-conversation/03-详细设计.md` §15 测试切口与最小验证清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | `contracts / domain / application / infra / api / worker / jobs` 模块主轴 | 固定模块测试切口 |
| `03_ddd_step_08_protocol_contracts.md` | 10 个 Command、11 个 Query、6 个 Inbound Consumer、9 个 Outbound Event、9 个 Operations Job | 固定接口测试切口 |
| `03_ddd_step_09_function_flows.md` | 每个 flow 的入口、事务、状态副作用、错误映射和测试提示 | 固定正向 / 异常测试来源 |
| `03_ddd_step_10_state_matrix.md` | 14 组正式状态 enum、转换矩阵和非法转换 | 固定状态机测试切口 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | repository、UnitOfWork、version、outbox、projection、handoff 事务口径 | 固定一致性测试切口 |
| `03_ddd_step_12_error_recovery.md` | 错误模型、恢复口径、quarantine、retry、failed evidence | 固定异常和恢复测试切口 |
| `03_ddd_step_13_concurrency_idempotency.md` | command / consumer / job 幂等、并发和重入保护 | 固定重复、冲突和 rerun 测试切口 |
| `03_ddd_step_15_observability_audit.md` | 日志、指标、审计、redaction 和 forbidden field 边界 | 固定观测和脱敏验证切口 |

已确认约束:

```text
本步只定义详细设计层的最小验证入口。
完整测试策略、优先级、覆盖率目标、fixture 管理、环境矩阵和执行排期留给 05-测试方案.md。
每个关键协议必须至少有正向和异常 / 边界测试切口。
状态机必须同时覆盖合法转换和非法转换。
```

## 3. SOP 问题回答

### 3.1 每个模块至少需要哪些单元测试？

| 模块 | 最小测试切口 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts` | DTO roundtrip、枚举值解析、metadata 校验 | Command / Query / Event / Job schema、必填字段、错误 DTO、禁止正文类字段 | contract unit test |
| `domain` | 对象构造、不变量、状态转换、policy | Conversation truth、scope、fact、manifestation、trace、projection、outbox、handoff 的合法 / 非法行为 | domain unit test |
| `application` | flow 编排、UnitOfWork、幂等、port 调用 | truth + outbox 同事务、duplicate / conflict、错误映射、审计 / evidence 副作用 | application service test |
| `infra` | in-memory repository、adapter、runtime builder | 唯一约束、version conflict、fake resolver / publisher / handoff 失败注入、config validation | adapter / repository test |
| `api` | command / query handler | route / JSON / actor / metadata / idempotency 解析和 HTTP error mapping | handler test |
| `worker` | inbound consumer、outbox worker、projection worker | event envelope、duplicate、quarantine、publish retry、projection stale | worker test |
| `jobs` | 9 个 operations job runner | job input、item transaction、partial failure、rerun、report / evidence 输出 | job runner test |

### 3.2 每个接口至少需要哪些正向和异常测试？

每个 Command 必须覆盖“成功提交 + 异常拒绝 + 幂等重复或冲突”。每个 Query 必须覆盖“命中 + not found / stale / visibility denied”。每个 Inbound Consumer 必须覆盖“合法事件 + duplicate + quarantine”。每个 Outbound Event 必须覆盖“payload schema 正确 + forbidden body 不泄露 + publish failure”。每个 Job 必须覆盖“成功批处理 + partial failure + rerun”。

具体清单见 §7.3。

### 3.3 状态机合法转换和非法转换如何测试？

状态机测试必须以 Step 10 的正式状态名为真相源。每组状态机至少验证一个主线合法转换和一个非法转换,且非法转换必须断言错误类型或 evidence,不能只断言 panic。

具体清单见 §7.4。

### 3.4 事务、一致性、幂等和并发如何验证？

| 验证方向 | 最小验证方式 |
|---|---|
| command truth + outbox 同事务 | 注入 outbox enqueue failure,断言 fact / scope / handoff truth 未提交 |
| consumer duplicate | 同 event id + source ref + idempotency key 重放,断言 skip 且不重复写 truth |
| outbox publish 重入 | publish 成功但状态写失败后 rerun,断言不重复 publish 或使用同 event id 补状态 |
| projection failure | rebuild 失败不回滚 truth,query 暴露 stale / failed marker |
| handoff failure | trace / archive handoff 失败只推进 retry / failed,不改 fact truth |
| idempotency conflict | same key different digest 返回 conflict evidence |
| version / sequence conflict | 并发 append / retract / cursor advance 只能一个成功 |
| forbidden body | 日志、审计、event、projection、handoff payload 均不得包含正文或 secret |

### 3.5 哪些测试细节应留给测试方案？

| 留给 `05-测试方案.md` 的内容 | 本步只定义 |
|---|---|
| 完整用例矩阵、优先级和覆盖率目标 | 最小测试入口 |
| fixture、seed、mock 数据和目录命名 | 需要验证的契约边界 |
| CI 分层、执行顺序、耗时和并行策略 | 脚本命令、输入输出和失败语义 |
| 真实数据库、真实 broker、真实外部仓联调 | P0 fake / in-memory 必须保持的语义 |
| 测试报告模板和验收报告内容 | artifact / report 根目录和报告生成契约 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 9 已有测试切口,但分散在 45 个 flow 下 | 实现者难以判断最低必须覆盖哪些场景 | 本步汇总为模块、接口、状态机、一致性四类测试入口 |
| Step 10 状态机完整,但缺少测试反查 | 非法转换可能漏测 | 本步按 14 组状态机列合法 / 非法切口 |
| Step 11~13 已定义事务、幂等和重入,但没有形成测试索引 | outbox rollback、publish 重入、handoff retry、cursor conflict 容易漏测 | 本步形成一致性 / 幂等 / 并发测试表 |
| Step 15 已定义观测和 forbidden field 边界 | 如果不测,日志或 diagnostic 仍可能泄露正文 | 本步加入 redaction / audit / metric 验证切口 |
| 详细设计容易扩写成完整测试方案 | 文档职责错位 | 本步只写最小验证清单和脚本契约 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 模块测试 | 只知道模块存在 | 每个模块都有最小测试切口 |
| 接口测试 | 协议和 flow 分散 | Command / Query / Consumer / Event / Job 逐项收口 |
| 状态机测试 | 只有转换矩阵 | 明确合法转换和非法转换测试入口 |
| 一致性测试 | 分散在事务、错误和幂等章节 | 统一抽取事务、幂等、并发、重入和 forbidden body 验证 |
| 脚本与报告 | 未在详细设计层约束 | 补充 gate / report / redaction check 脚本契约 |
| 文档边界 | 容易写成完整测试计划 | 明确测试方案继续展开 |

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否写完整测试方案 | 在详细设计中写完整矩阵 | 只写最小测试切口 | B | 完整测试方案属于 `05-测试方案.md` |
| 接口测试粒度 | 只按协议类别汇总 | 每个 Command / Query / Consumer / Event / Job 逐项列出 | B | 能避免实现阶段漏掉单个协议的异常分支 |
| 状态机测试方式 | 只测 happy path | 合法和非法转换都测 | B | 非法转换是详细设计契约的一部分 |
| fake / in-memory 是否降低语义 | fake 只要能跑通即可 | fake 必须保留失败、冲突、重试、quarantine 和 redaction 语义 | B | P0 可本地闭环,但不能伪装外部成功 |
| 是否定义测试脚本契约 | 全部留给实施计划 | 详细设计定义命令、输入、输出、失败语义 | B | 保证 artifact / report 来源稳定,但不写脚本代码 |

## 7. 结构化中间产物

### 7.1 测试切口总图

#### 测试切口图: detailed design contracts to test slices

```text
[Step 5 modules]
  | module unit tests
  v
[Step 8 protocols] ---> [API / consumer / event / job tests]
  |
  v
[Step 10 state matrix] ---> [legal / illegal transition tests]
  |
  v
[Step 11-13 consistency] ---> [tx / idempotency / concurrency tests]
  |
  v
[Step 15 observability] ---> [log / metric / audit / redaction tests]
```

关键说明:

- 图表达详细设计中各类契约如何落到最小测试入口。
- 图不表达测试执行顺序、CI 分层或完整测试报告结构。
- 每个测试切口都必须能反查至少一个 `design-calibration/03_ddd_step_*` 中间产物。

### 7.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_dto_roundtrip` | Step 8 协议契约 | Command / Query / Event / Job DTO 序列化、必填字段、错误 DTO、版本标签 | contract unit test |
| `domain_object_invariants` | Step 6 对象契约 | space、scope、fact、manifestation、trace、projection、outbox、handoff 构造和不变量 | domain unit test |
| `domain_state_transitions` | Step 10 状态矩阵 | 14 组状态机合法 / 非法转换 | domain unit test |
| `application_flow_orchestration` | Step 9 处理流 | service 调用 repository、policy、outbox、trace、idempotency 的顺序 | application service test |
| `application_error_mapping` | Step 12 错误恢复 | protocol / domain / repository / resolver / publish / handoff / job error 映射 | application service test |
| `infra_repository_semantics` | Step 7 / Step 11 port 与持久化 | in-memory store 的唯一键、version、transaction rollback 和 list / lock 行为 | repository test |
| `infra_adapter_failure_injection` | Step 14 外部依赖绑定 | resolver、publisher、handoff fake adapter 的 unresolved、retry、failed 行为 | adapter test |
| `api_handler_mapping` | Step 8 / Step 9 API flow | request -> command / query mapper、actor / metadata / idempotency 校验、HTTP error response | handler test |
| `worker_event_consumption` | Step 8 / Step 9 consumer flow | envelope、duplicate、quarantine、source ack failure、projection stale | worker test |
| `jobs_runner_behavior` | Step 8 / Step 9 job flow | job input、item transaction、partial failure、rerun、receipt / report ref | job runner test |
| `observability_redaction` | Step 15 可观测性 | 日志、审计、event、diagnostic 和 metric 不包含 forbidden body / secret | observability test |

### 7.3 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `CreateConversationSpace_contract` | `CreateConversationSpaceFlow` | 成功创建 space / scope / visibility / outbox;缺 actor、重复 key、outbox rollback | API + application |
| `CloseConversationSpace_contract` | `CloseConversationSpaceFlow` | active -> closed / readonly;already closed、not found、outbox rollback | API + application |
| `UpdateParticipantScope_contract` | `UpdateParticipantScopeFlow` | scope change applied;invalid participant、duplicate key、version conflict | API + application |
| `UpdateVisibilityScope_contract` | `UpdateVisibilityScopeFlow` | visibility 更新并标记 projection stale;sealed 扩张拒绝、outbox rollback | API + application |
| `AppendConversationFact_contract` | `AppendConversationFactFlow` | fact / receipt / trace / outbox 同事务;policy reject、duplicate、forbidden payload | API + application |
| `RetractConversationFact_contract` | `RetractConversationFactFlow` | fact retracted、trace retained、outbox generated;terminal fact、not found、not authorized | API + application |
| `ManifestExternalFact_contract` | `ManifestExternalFactFlow` | manifestation / safe snapshot / optional fact / trace;resolver unresolved、visibility reject、no body copy | API + application |
| `CreateReviewAnchor_contract` | `CreateReviewAnchorFlow` | review anchor 保存并可追溯;target missing、visibility reject、outbox rollback | API + application |
| `RequestTraceHandoff_contract` | `RequestTraceHandoffFlow` | pending trace handoff + outbox;trace missing、retention reject、duplicate | API + application |
| `RequestArchiveHandoff_contract` | `RequestArchiveHandoffFlow` | pending archive handoff + outbox;scope invalid、policy reject、duplicate | API + application |
| `GetConversationReadModel_contract` | `GetConversationReadModelFlow` | authorized read;not visible、stale marker、query 不写入 | query handler |
| `ListConversationFacts_contract` | `ListConversationFactsFlow` | page success;visibility filter、invalid page、query 不写入 | query handler |
| `GetConversationFact_contract` | `GetConversationFactFlow` | found visible;not visible、not found、retracted marker | query handler |
| `GetConversationChangeCursor_contract` | `GetConversationChangeCursorFlow` | cursor found;cursor missing、stale projection | query handler |
| `PollConversationChanges_contract` | `PollConversationChangesFlow` | changes visible;empty page、cursor invalid / expired | query handler |
| `SearchConversationHistory_contract` | `SearchConversationHistoryFlow` | search success;stale index、visibility filter、forbidden body absent | query handler |
| `GetCrossDomainManifestation_contract` | `GetCrossDomainManifestationFlow` | visible manifestation;unresolved marker、not visible | query handler |
| `GetConversationTraceContext_contract` | `GetConversationTraceContextFlow` | trace visible;retention expired、not authorized、sensitive read audit | query handler |
| `GetReviewAnchor_contract` | `GetReviewAnchorFlow` | anchor visible;target hidden、not found、sensitive read audit | query handler |
| `GetConversationProjectionState_contract` | `GetConversationProjectionStateFlow` | fresh / stale / failed marker;not found、query 不 rebuild | query handler |
| `GetExternalReferenceProjection_contract` | `GetExternalReferenceProjectionFlow` | projection visible;unresolved refs、empty page | query handler |
| `ConsumeWorkContextChanged_contract` | `ConsumeWorkContextChangedFlow` | valid event updates / stales reference projection;duplicate、quarantine | consumer |
| `ConsumeGovernanceFactCommitted_contract` | `ConsumeGovernanceFactCommittedFlow` | manifestation candidate + snapshot + outbox;unresolved、duplicate | consumer |
| `ConsumeArtifactFactCommitted_contract` | `ConsumeArtifactFactCommittedFlow` | artifact ref projection updated;digest mismatch、quarantine、body absent | consumer |
| `ConsumeRuntimeResultCommitted_contract` | `ConsumeRuntimeResultCommittedFlow` | runtime result becomes fact + trace + outbox;forbidden reasoning body、duplicate | consumer |
| `ConsumeBridgeMappedFactReceived_contract` | `ConsumeBridgeMappedFactReceivedFlow` | mapped fact / manifestation;platform body absent、invalid mapping | consumer |
| `ConsumeIdentityActorChanged_contract` | `ConsumeIdentityActorChangedFlow` | read model / projection stale;actor unresolved、duplicate | consumer |
| `ConversationSpaceChangedEvent_contract` | `ConversationSpaceChangedPublishFlow` | payload refs and schema version;publish failed、duplicate event id | event + publisher |
| `ConversationScopeChangedEvent_contract` | `ConversationScopeChangedPublishFlow` | visibility marker and scope refs;redaction marker、publish failed | event + publisher |
| `ConversationFactAppendedEvent_contract` | `ConversationFactAppendedPublishFlow` | fact ref + receipt ref only;payload body absent、publish failed | event + publisher |
| `ConversationFactRetractedEvent_contract` | `ConversationFactRetractedPublishFlow` | retraction trace ref;downstream stale marker、publish failed | event + publisher |
| `CrossDomainManifestationChangedEvent_contract` | `CrossDomainManifestationChangedPublishFlow` | manifestation + safe snapshot refs;source body absent、unresolved | event + publisher |
| `ConversationChangeAvailableEvent_contract` | `ConversationChangeAvailablePublishFlow` | lightweight outbox / cursor refs;full fact body absent、publish failed | event + publisher |
| `TraceHandoffRequestedEvent_contract` | `TraceHandoffRequestedPublishFlow` | handoff payload ref only;observability receipt absent、publish failed | event + publisher |
| `ArchiveHandoffRequestedEvent_contract` | `ArchiveHandoffRequestedPublishFlow` | archive handoff refs;archive package body absent、publish failed | event + publisher |
| `ConversationProjectionStateChangedEvent_contract` | `ConversationProjectionStateChangedPublishFlow` | projection state event;truth state not leaked、transport failure evidence | event + publisher |
| `PublishConversationOutbox_contract` | `PublishConversationOutboxFlow` | batch publish and state update;partial failure、rerun、duplicate publish | job runner |
| `RebuildConversationReadModels_contract` | `RebuildConversationReadModelsFlow` | read model rebuild;empty scope、visibility failure、failed marker | job runner |
| `RebuildConversationSearchIndex_contract` | `RebuildConversationSearchIndexFlow` | search refs only;no body copy、failed marker | job runner |
| `MaintainConversationChangeCursors_contract` | `MaintainConversationChangeCursorsFlow` | cursor advances;outbox gap、invalid cursor、rerun | job runner |
| `RefreshExternalReferenceSnapshots_contract` | `RefreshExternalReferenceSnapshotsFlow` | safe snapshot refresh;resolver failure、digest mismatch、source body absent | job runner |
| `DeliverTraceHandoff_contract` | `DeliverTraceHandoffFlow` | handed off receipt ref;retryable failure、permanent failure、missing trace | job runner |
| `DeliverArchiveHandoff_contract` | `DeliverArchiveHandoffFlow` | archived package ref;retryable failure、permanent failure、missing trace | job runner |
| `ValidateConversationConsistency_contract` | `ValidateConversationConsistencyFlow` | report ref and issue count;missing read model issue、no automatic repair | job runner |
| `CleanupExpiredConversationCursors_contract` | `CleanupExpiredConversationCursorsFlow` | expired cursor deleted;active skipped、rerun idempotent | job runner |

### 7.4 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `truth_state_transitions` | `ConversationTruthState` | `Open -> ReadOnly / Restricted / HandoffPending / Closed`;`Closed -> Open` 拒绝 | domain unit test |
| `space_lifecycle_transitions` | `ConversationSpaceLifecycleState` | `Active -> ReadOnly -> Closed -> Archived`;`Archived -> Active` 拒绝 | domain unit test |
| `participant_scope_transitions` | `ParticipantScopeState` | `Active -> Restricted -> Active`、`Active -> Closed`;`Closed -> Active` 拒绝 | domain unit test |
| `visibility_scope_transitions` | `VisibilityScopeState` | `Open -> Restricted -> Open`、`Open -> Sealed`;`Sealed -> Open` 拒绝 | domain unit test |
| `scope_change_outcome` | `ScopeChangeState` | `Applied -> Superseded`;`Rejected -> Applied` 拒绝 | domain unit test |
| `fact_lifecycle_transitions` | `ConversationFactState` | `Accepted -> VisibilityRestricted -> Accepted`、`Accepted -> Retracted`;`Retracted -> Accepted` 拒绝 | domain unit test |
| `append_receipt_outcome_immutable` | `FactAppendResult` | `Accepted / Duplicate / Rejected` 创建后不可变 | domain unit test |
| `manifestation_transitions` | `ManifestationState` | `Manifested -> Stale -> Manifested`、`Unresolved -> Manifested`;`Revoked -> Manifested` 拒绝 | domain unit test |
| `reference_resolution_transitions` | `ReferenceResolutionState` | `Pending -> Fresh / Unresolved`、`Fresh -> Stale`;`Invalid -> Fresh` 拒绝 | domain unit test |
| `projection_freshness_transitions` | `ProjectionFreshnessState` | `Fresh -> Stale -> Rebuilding -> Fresh / Failed`;query 不允许把 stale 改 fresh | projection test |
| `change_cursor_transitions` | `ConversationChangeCursorState` | `Active -> Stale / Expired / Invalidated`;expired / invalidated 不可续读 | projection test |
| `outbox_publication_transitions` | `ConversationOutboxPublicationState` | `Pending -> Published / RetryPending / Failed / Suppressed`;published 不回 pending | job test |
| `trace_retention_transitions` | `TraceRetentionState` | `Open -> Sealed -> HandoffPending -> Expired`;expired 不可重新 open | domain unit test |
| `trace_handoff_transitions` | `TraceHandoffState` | `Pending -> HandedOff / RetryPending / Failed / Cancelled`;handed off 不可 retry | job test |
| `archive_handoff_transitions` | `ArchiveHandoffState` | `Pending -> Archived / RetryPending / Failed / Cancelled`;archived 不可 retry | job test |

### 7.5 一致性 / 幂等测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_same_key_same_digest_returns_existing` | Step 13 幂等键表 | 重复 Command 返回已有 result / receipt | application test |
| `command_same_key_different_digest_conflicts` | Step 13 幂等冲突 | 同 key 不同 digest 返回 conflict evidence | application test |
| `command_outbox_enqueue_failure_rolls_back_truth` | Step 11 事务边界 | truth / trace / receipt / outbox 同事务回滚 | repository + service |
| `consumer_duplicate_event_skips_without_truth_duplication` | Step 13 consumer 幂等 | event id + source ref 重复时 skip | consumer test |
| `consumer_invalid_envelope_quarantines` | Step 12 quarantine | invalid envelope 不写 truth,写 quarantine evidence | consumer test |
| `runtime_forbidden_reasoning_body_rejected` | Step 15 forbidden field | runtime reasoning body 不进入 fact、trace、outbox、log、audit | consumer + observability |
| `bridge_platform_body_rejected` | Step 15 forbidden field | bridge message body 不进入 snapshot、event、diagnostic | consumer + observability |
| `resolver_unresolved_does_not_create_source_truth` | Step 12 resolver recovery | unresolved 只写 marker / evidence,不补造来源 truth | application / job |
| `digest_mismatch_records_evidence` | Step 12 digest mismatch | mismatch 进入 unresolved / manual evidence | resolver adapter |
| `outbox_publish_retry_does_not_rollback_truth` | Step 11 / 12 publish recovery | publish retry / failed 只改变 outbox 状态 | job test |
| `outbox_publish_success_state_write_rerun` | Step 13 重入保护 | 外部发布后状态写失败,rerun 不重复 publish 或用同 event id 补状态 | job test |
| `projection_rebuild_failure_exposes_failed_marker` | Step 11 projection recovery | rebuild 失败不改 truth,query 暴露 failed marker | job + query |
| `cursor_sequence_never_regresses` | Step 13 并发场景 | cursor advance 只能前进;outbox gap 标 stale | projection test |
| `fact_retract_double_submit` | Step 10 fact 状态机 | double retract 返回 existing / invalid transition,不重复 outbox | application test |
| `space_close_and_append_race` | Step 13 并发场景 | close 与 append 并发时 append 重新检查 truth state | concurrency test |
| `visibility_update_marks_read_side_stale` | Step 9 / 11 projection | visibility 更新导致 read model / cursor / reference stale | application + projection |
| `trace_handoff_failure_records_retry_or_failed` | Step 12 handoff recovery | handoff 失败不回滚 trace / fact truth | job test |
| `archive_handoff_success_keeps_package_ref_only` | Step 15 forbidden field | archive handoff 保存 `ArchivePackageRef`,不保存包正文 | job + observability |
| `job_rerun_returns_existing_receipt` | Step 13 job 幂等 | 同 job run id + key 返回 existing receipt | job test |
| `metrics_labels_are_low_cardinality` | Step 15 指标边界 | metric 标签不含 record id、payload digest 全量或 actor profile | observability test |

### 7.6 脚本契约表

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置、fake / in-memory 测试环境 | `artifacts/test/<run_id>` | 非 0 exit code,保留 failure summary 到 artifact root |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code,说明缺失 artifact 或报告生成失败 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | artifacts + reports | `reports/runs/<run_id>/redaction-check.md` | 发现 forbidden body、raw secret、raw payload 时失败 |

脚本约束:

- artifact root 固定为 `artifacts/test/<run_id>`,不得再额外加 `<project>` 层级。
- report root 固定为 `reports/`。
- 详细设计只定义命令契约、输入输出和失败语义;脚本实现留给实施阶段。

## 8. 回填草稿

> 本节不重复粘贴 §7 的完整表。正式 `03-详细设计.md` 生成 §15 时,应从本文件 §7 摘录。

正式文档 §15 建议采用以下结构:

```text
15. 测试切口与最小验证清单
  15.1 设计依据与边界
  15.2 模块测试切口汇总表
  15.3 接口测试切口汇总表
  15.4 状态机测试切口表
  15.5 一致性 / 幂等测试切口表
  15.6 脚本契约表
  15.7 留给测试方案继续展开的内容
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §15.1 | `design-calibration/03_ddd_step_16_test_slices.md` §2 / §3 / §6 |
| §15.2 | `design-calibration/03_ddd_step_16_test_slices.md` §7.2 |
| §15.3 | `design-calibration/03_ddd_step_16_test_slices.md` §7.3 |
| §15.4 | `design-calibration/03_ddd_step_16_test_slices.md` §7.4 |
| §15.5 | `design-calibration/03_ddd_step_16_test_slices.md` §7.5 |
| §15.6 | `design-calibration/03_ddd_step_16_test_slices.md` §7.6 |
| §15.7 | `design-calibration/03_ddd_step_16_test_slices.md` §3.5 |

## 9. 待确认事项

无。

本步未新增正式测试方案、覆盖率目标或环境矩阵;只定义详细设计层的最小验证入口和脚本命令契约。

## 10. 本步完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| SOP 应问问题已回答 | 通过 | §3 覆盖模块、接口、状态机、一致性和测试方案边界 |
| 模块测试切口汇总表已输出 | 通过 | §7.2 覆盖 7 个实现模块 |
| 接口测试切口汇总表已输出 | 通过 | §7.3 覆盖 Command / Query / Consumer / Outbound Event / Job |
| 状态机测试切口表已输出 | 通过 | §7.4 覆盖 Step 10 的 14 组状态机 |
| 一致性 / 幂等测试切口表已输出 | 通过 | §7.5 覆盖事务、幂等、并发、重入、forbidden field |
| 脚本契约表已输出 | 通过 | §7.6 约束 gate、report 和 redaction check |
| 未替代完整测试方案 | 通过 | 覆盖率、优先级、fixture、环境矩阵留给 `05-测试方案.md` |
| 可进入 Step 17 实施承接清单 | 通过 | 下一步可汇总实施前置阅读、承接项和跨文档一致性复核 |
