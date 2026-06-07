# Step 16. 定义测试切口与最小验证清单

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 16
- 回填章节:`03-详细设计.md` §5.15 测试切口与最小验证清单

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | `contracts` / `domain` / `application` / `infra` / `api` / `worker` / `jobs` 七个模块主轴 | 固定模块测试切口 |
| `03_ddd_step_08_protocol_contracts.md` | 18 个 Command、8 个 Query、7 个 Inbound Event、10 个 Outbound Event、6 个 Operations Job | 固定接口测试切口 |
| `03_ddd_step_09_function_flows.md` | 逐接口 flow、UoW、outbox、audit、projection、handoff 副作用 | 固定正向 / 异常验证路径 |
| `03_ddd_step_10_state_matrix.md` | 12 组正式状态机、合法转换、非法转换 | 固定状态机测试切口 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | repository、UnitOfWork、version、outbox、projection、reference、handoff 一致性 | 固定事务测试切口 |
| `03_ddd_step_12_error_recovery.md` | 错误模型、异常分支、恢复口径 | 固定 reject、retry、failed marker 测试 |
| `03_ddd_step_13_concurrency_idempotency.md` | 幂等、并发、重入和 commit unknown | 固定重复调用和冲突测试 |
| `03_ddd_step_15_observability_audit.md` | 日志、指标、审计、trace / handoff 字段边界 | 固定观测和 forbidden field 测试 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 16.1 | 文件骨架、SOP 问题回答、当前文档问题诊断 | [x] |
| 16.2 | 模块测试切口、接口测试切口 | [x] |
| 16.3 | 状态机、一致性 / 幂等 / 并发、观测测试切口 | [x] |
| 16.4 | 脚本契约、回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 每个模块至少需要哪些单元测试?

   回答:七个模块均需最小测试入口。`contracts` 测 DTO / event / job schema;`domain` 测对象不变量、policy 和状态机;`application` 测 flow 编排、UoW、幂等、错误映射;`infra` 测 fake repository / adapter / runtime builder 语义;`api` 测 handler validation 和 error mapping;`worker` 测 inbound dedup / dead-letter / outbox publish;`jobs` 测 job input、partial failure、report 和重跑。

2. 每个接口至少需要哪些正向和异常测试?

   回答:每个 Command 至少覆盖 success + invalid / domain reject + duplicate / conflict。每个 Query 至少覆盖 hit + missing / not visible / stale 或 failed surface + query no-write。每个 Inbound Event 至少覆盖 accepted + duplicate + dead-letter / unresolved。每个 Outbound Event 至少覆盖 payload schema + forbidden field absent + publish failure。每个 Job 至少覆盖 success + partial failure + rerun / idempotency。

3. 状态机合法转换和非法转换如何测试?

   回答:以 Step 10 的正式 enum 为唯一真相源。每组状态机至少测一条主线合法转换和一条非法转换,非法转换必须断言 `DomainError::InvalidStateTransition` 或对应 application / protocol error,并断言不写 accepted truth、outbox 或 projection stale。

4. 事务、一致性、幂等和并发如何验证?

   回答:使用 fake / in-memory repository、fake UoW、fake resolver / publisher / handoff adapter 注入 failure、version conflict、duplicate、different digest、commit unknown 和 worker crash 场景。测试必须断言 truth、audit、outbox、projection、reference、idempotency record 的副作用边界。

5. 哪些测试细节应留给测试方案?

   回答:完整测试矩阵、优先级、覆盖率目标、fixture 目录、mock 数据、CI 分层、真实 durable store / broker / sibling repo 联调、报告模板和执行排期留给 `05-测试方案.md`。本 Step 只定义最小验证入口和脚本契约。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 5 | 只有模块测试职责预告 | 本 Step 固定每个模块最小测试切口 |
| Step 8 / 9 | 每个协议和 flow 已有测试提示,但分散 | 本 Step 汇总 18 Command、8 Query、7 Consumer、10 Event、6 Job |
| Step 10 | 状态矩阵完整,但没有测试反查表 | 本 Step 为 12 组状态机补合法 / 非法测试入口 |
| Step 11 / 12 / 13 | 事务、错误、幂等、并发分散 | 本 Step 汇总一致性、恢复、重入测试入口 |
| Step 15 | 观测和字段边界已定义 | 本 Step 增加日志 / 指标 / 审计 / forbidden field 验证入口 |
| 详细设计边界 | 容易扩写成完整测试方案 | 本 Step 只写最小验证清单,不写排期和覆盖率目标 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块测试 | 只有职责预告 | 七个模块均有测试切口 | 支撑实施阶段 crate-by-crate 验证 |
| 接口测试 | 分散在协议和 flow | 按 Command / Query / Event / Job 汇总 | 防止漏掉单个入口 |
| 状态机测试 | 只有转换矩阵 | 每个状态机列合法和非法测试 | 支撑 domain 单测 |
| 一致性测试 | 分散在 Step 11~13 | 统一抽取 rollback、duplicate、conflict、rerun | 支撑 fake / service 测试 |
| 观测测试 | 只有埋点契约 | 增加 forbidden field 和低基数标签测试 | 防止日志 / metric 泄露 |
| 脚本契约 | 未固定 | 给出 gate / report / redaction check 最小契约 | 让实施计划和测试方案有稳定入口 |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在详细设计写完整测试方案 | 信息集中 | 越过测试方案职责,容易膨胀 | 不采用 |
| 只写模块级测试 | 简短 | 不能保证每个协议入口被覆盖 | 不采用 |
| 模块 + 接口 + 状态机 + 一致性分层 | 可反查详细设计契约 | 表格较长 | 采用 |
| fake adapter 只测 happy path | 实现快 | 无法验证恢复 / 幂等 / 失败 marker | 不采用 |
| fake adapter 必须支持 failure injection | 可本地验证 P0 语义 | fake 实现更严格 | 采用 |
| 指标测试包含资源 id | 容易定位 | 高基数且违反字段边界 | 不采用 |
| 观测测试只验证低基数标签和 forbidden field absent | 符合 Step 15 | 需要 trace / audit 关联定位 | 采用 |

### 8. 结构化中间产物

#### 8.1 测试切口总图

```text
Step 5 modules
  -> module / crate tests
Step 8 protocols + Step 9 flows
  -> command / query / consumer / event / job tests
Step 10 state matrix
  -> legal / illegal transition tests
Step 11-13 consistency
  -> transaction / idempotency / concurrency / rerun tests
Step 15 observability
  -> log / metric / audit / redaction tests
```

关键说明:

- 本图只表达详细设计契约到最小测试入口的映射。
- 本图不表达 CI 阶段、测试排期、覆盖率目标或测试数据组织。
- 每个测试切口必须能反查至少一个 `design-calibration/03_ddd_step_*` 中间产物。

#### 8.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_dto_schema_roundtrip` | Step 8 `contracts` | Command / Query / Event / Job / View / Error DTO 序列化、必填字段、version tag | contract unit |
| `contracts_metadata_enforcement` | Step 8 metadata | `CommandMetadata.request.idempotency_key` 必填;Query 不要求 idempotency | contract unit |
| `domain_object_invariants` | Step 6 对象契约 | Project、Backlog、Member、WorkItem、Promote、Dependency、Blocker、Iteration 构造和不变量 | domain unit |
| `domain_policy_accept_reject` | Step 6 policy | lifecycle、responsibility、formal work、promote、dependency、iteration policy accept / reject | domain unit |
| `domain_state_machine_transitions` | Step 10 状态矩阵 | 12 组状态机合法 / 非法转换 | domain unit |
| `domain_audit_outbox_records` | Step 6 audit / outbox | `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord` 只从 accepted truth change 形成 | domain unit |
| `application_command_orchestration` | Step 9 command template | UoW、idempotency、command result store、repository、audit、outbox、projection stale 调用顺序 | application service |
| `application_query_no_write` | Step 9 query template | Query 不开启写 UoW、不写 audit / outbox / idempotency / marker | application service |
| `application_error_mapping` | Step 12 错误模型 | domain / repository / resolver / publisher / handoff / UoW error 映射 | application service |
| `infra_repository_semantics` | Step 7 / 11 repository | in-memory repository 的 version、unique key、transaction rollback、page 行为 | repository test |
| `infra_adapter_failure_injection` | Step 7 / 14 adapter | resolver、publisher、handoff、clock、id generator failure 可注入并映射 | adapter test |
| `infra_runtime_builder_wiring` | Step 14 config | `WorkRuntimeConfig` validation、port wiring、禁止配置化边界 | config / integration |
| `api_handler_mapping` | Step 8 / 9 API | route / body 一致、actor / metadata 校验、protocol error response | handler test |
| `worker_consumer_and_outbox` | Step 8 / 9 worker | inbound envelope、dedup、dead-letter、outbox publish loop、mark failed | worker test |
| `jobs_runner_behavior` | Step 8 / 9 jobs | job metadata、page / batch、partial failure、report / marker、rerun | job runner test |
| `observability_forbidden_field` | Step 15 字段边界 | log / metric / audit / event / diagnostic 不含 external body、secret、raw body | observability test |

#### 8.3 Command 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `CreateProject_contract` | `CreateProjectFlow` | project + backlog + trace + outbox 同 UoW;owner missing、duplicate、id generator failure | API + application |
| `UpdateProjectLifecycle_contract` | `UpdateProjectLifecycleFlow` | Active / ReadOnly / Closed / Archived 转换;archive 联动 backlog;version conflict | API + application |
| `UpdateBacklogAvailability_contract` | `UpdateBacklogAvailabilityFlow` | Open <-> LockedForMaintenance;Archived 后拒绝;outbox rollback | API + application |
| `AssignProjectMember_contract` | `AssignProjectMemberFlow` | member responsibility created;capability unresolved、duplicate active key、resolver failure | API + application |
| `UpdateProjectMemberResponsibility_contract` | `UpdateProjectMemberResponsibilityFlow` | Proposed / Active / Paused / Released 转换;terminal reject、version conflict | API + application |
| `CreateWorkItem_contract` | `CreateWorkItemFlow` | root work formalized + backlog membership + trace / outbox;source unresolved、backlog locked | API + application |
| `CreateChildWorkItem_contract` | `CreateChildWorkItemFlow` | child work formalized;parent missing / not root、source unresolved、idempotency conflict | API + application |
| `UpdateWorkItemLifecycle_contract` | `UpdateWorkItemLifecycleFlow` | work lifecycle transition;completion evidence required、terminal transition reject | API + application |
| `RequestWorkPromotion_contract` | `RequestWorkPromotionFlow` | promote result pending review;source unresolved、duplicate、outbox rollback | API + application |
| `ReviewWorkPromotion_contract` | `ReviewWorkPromotionFlow` | accept / reject;accept path optional WorkItem;concurrent review version conflict | API + application |
| `LinkWorkDependency_contract` | `LinkWorkDependencyFlow` | dependency proposed / active;graph scope comes from `get_formal_work_scope(downstream)`;cycle rejected、duplicate edge、outbox rollback;project-board + resolvable member-work stale | API + application |
| `UpdateWorkDependencyState_contract` | `UpdateWorkDependencyStateFlow` | Proposed -> Active with `DependencyChangeReasonKind::Activated`;Active -> Satisfied / Waived / Cancelled;reason kind mismatch reject;terminal reject、version conflict;downstream relation views stale | API + application |
| `OpenWorkBlocker_contract` | `OpenWorkBlockerFlow` | blocker open + history + outbox;blocked work scope resolved;evidence unresolved、duplicate blocker;blocked project-board + resolvable member-work stale | API + application |
| `ResolveWorkBlocker_contract` | `ResolveWorkBlockerFlow` | blocker resolved path writes `resolved_evidence_ref`;evidence missing、closed reject、version conflict;blocked relation views stale | API + application |
| `OpenIteration_contract` | `OpenIterationFlow` | iteration planning;timebox unresolved、timebox summary project mismatch、timebox summary cannot open、missing digest fixture、project closed, duplicate | API + application |
| `CommitIterationScope_contract` | `CommitIterationScopeFlow` | iteration + commitment + root / child work marks same UoW;child candidate uses `ChildWorkItem::mark_committed(...)`;scope invalid、work version conflict | API + application |
| `UpdateIterationCommitment_contract` | `UpdateIterationCommitmentFlow` | commitment changed;closed commitment reject、work membership conflict | API + application |
| `UpdateIterationLifecycle_contract` | `UpdateIterationLifecycleFlow` | Planning / Committed / InProgress / Closed / Cancelled;`InProgress` / `Cancelled` require `change_reason`;`Closed` requires `close_reason`;close path uses `get_commitment_with_version(...)`;no `IterationChangeRecord` append;commitment version conflict;wrong reason field reject;illegal target reject | API + application |

#### 8.4 Query / Event / Job 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetProjectWorkFacts_contract` | `GetProjectWorkFactsFlow` | truth summary hit;project missing、not visible、query no-write | query handler |
| `GetBacklog_contract` | `GetBacklogFlow` | backlog + page hit;empty page、project missing、query no-write | query handler |
| `GetWorkItem_contract` | `GetWorkItemFlow` | formal work visible;not found、not visible、terminal state surfaced | query handler |
| `ListMemberWork_contract` | `ListMemberWorkFlow` | projection page hit;stale / rebuilding / failed surface、invalid page | query handler |
| `GetIterationSummary_contract` | `GetIterationSummaryFlow` | iteration summary view;missing projection、stale marker preserved | query handler |
| `SearchWork_contract` | `SearchWorkFlow` | search page hit;failed projection surface、visibility filter、no body copy | query handler |
| `GetWorkTrace_contract` | `GetWorkTraceFlow` | trace records page;empty, not visible, no write side effect | query handler |
| `GetProjectBoardView_contract` | `GetProjectBoardViewFlow` | board projection hit;missing -> rebuilding / missing, query no rebuild | query handler |
| `EventSchemaVersion_contract` | inbound / outbound event envelopes | `EventSchemaVersion::v1()` roundtrip;outbound fixture uses `v1`;missing / unsupported inbound version dead-letters before business write | contract + consumer |
| `ConsumeIdentityMemberChanged_contract` | identity event consumer | member snapshot + reference state saved;duplicate, missing capability dead-letter;affected public views from repository are marked stale;empty affected view page writes no stale marker | consumer |
| `ConsumeMethodDefinitionChanged_contract` | method event consumer | method snapshot saved;duplicate, missing definition dead-letter;affected public views from repository are marked stale;empty affected view page writes no stale marker | consumer |
| `ConsumeConversationWorkContextChanged_contract` | conversation event consumer | source reference / pending source saved;source missing, unresolved marker | consumer |
| `ConsumeProcessTimingChanged_contract` | process event consumer | timebox reference state saved;missing timebox, duplicate | consumer |
| `ConsumeGovernanceDecisionChanged_contract` | governance event consumer | source / evidence reference state saved;missing both source/evidence dead-letter | consumer |
| `ConsumeArtifactEvidenceChanged_contract` | artifact event consumer | evidence reference state saved;missing evidence, digest mismatch | consumer |
| `ConsumeRuntimePromoteRequested_contract` | runtime promote consumer | pending promote intake saved;missing source / reason dead-letter | consumer |
| `ProjectChanged_event_schema` | outbound `ProjectChanged` | payload from `WorkOutboxSourceRef::Project` + committed Project + reason;no uncommitted truth;publish failure marker | contract + publisher |
| `BacklogChanged_event_schema` | outbound `BacklogChanged` | payload from `WorkOutboxSourceRef::Backlog` + committed Backlog + maintenance reason;no ProjectChanged reuse;publish failure marker | contract + publisher |
| `ProjectMemberChanged_event_schema` | outbound `ProjectMemberChanged` | project member refs and responsibility;no capability body | contract + publisher |
| `WorkItemChanged_event_schema` | outbound `WorkItemChanged` | work ref/state/source/evidence refs;no external body | contract + publisher |
| `PromoteResultRecorded_event_schema` | outbound `PromoteResultRecorded` | promote result / source / created work ref;publish failure marker | contract + publisher |
| `WorkDependencyChanged_event_schema` | outbound `WorkDependencyChanged` | dependency edge refs and state;cycle diagnostics absent | contract + publisher |
| `WorkBlockerChanged_event_schema` | outbound `WorkBlockerChanged` | blocker ref / evidence ref sourced from `WorkBlocker.resolved_evidence_ref`;no evidence body | contract + publisher |
| `IterationChanged_event_schema` | outbound `IterationChanged` | iteration / commitment / affected refs;no work body copy | contract + publisher |
| `WorkTraceAvailable_event_schema` | outbound `WorkTraceAvailable` | trace id / subject / optional handoff ref;no observability body | contract + publisher |
| `DerivedWorkViewChanged_event_schema` | outbound `DerivedWorkViewChanged` | view ref / freshness / source cursor;no projection body dump | contract + publisher |
| `PublishWorkOutbox_contract` | `PublishWorkOutboxFlow` | pending batch is `Page<Versioned<WorkOutboxRecord>>`;publish from typed `WorkOutboxSourceRef`;`mark_published` / `mark_failed` use same item version;source missing or event_kind/source mismatch marks failed without partial publish;partial failure、version conflict、rerun | job runner |
| `RebuildWorkProjections_contract` | `RebuildWorkProjectionsFlow` | rebuild from committed truth;failed marker, query surface | job runner |
| `RefreshExternalReferenceSnapshots_contract` | `RefreshExternalReferenceSnapshotsFlow` | stale refs refreshed;resolver unavailable, failed marker | job runner |
| `RunWorkReconciliation_contract` | `RunWorkReconciliationFlow` | read-only report;drift detected, no automatic repair | job runner |
| `PrepareWorkTraceHandoff_contract` | `PrepareWorkTraceHandoffFlow` | trace handoff marker saved;handoff failure, no observability body | job runner |
| `PrepareArchiveHandoff_contract` | `PrepareArchiveHandoffFlow` | archive marker saved;handoff failure, no archive body | job runner |

#### 8.5 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `project_lifecycle_transitions` | `ProjectLifecycleState` | `Active -> ReadOnly -> Closed -> Archived`;`Archived -> Active` 拒绝 | domain unit |
| `member_responsibility_transitions` | `ProjectMemberResponsibilityState` | `Proposed -> Active <-> Paused -> Released`;`Released -> Active` 拒绝 | domain unit |
| `backlog_state_transitions` | `BacklogState` | `Open <-> LockedForMaintenance -> Archived`;`Archived -> Open` 拒绝 | domain unit |
| `work_item_state_transitions` | `WorkItemState` | `Formalized -> Committed -> InProgress -> Completed`;terminal -> active 拒绝 | domain unit |
| `promote_result_transitions` | `PromoteResultState` | `PendingReview -> Accepted / Rejected -> Superseded`;`Superseded -> Accepted` 拒绝 | domain unit |
| `dependency_state_transitions` | `DependencyState` | `Proposed -> Active -> Satisfied / Waived / Cancelled`;`activate` only accepts `Activated` reason;terminal reopen 拒绝 | domain unit |
| `blocker_state_transitions` | `BlockerState` | `Open -> Mitigating -> Resolved -> Closed`;`Closed -> Open` 拒绝 | domain unit |
| `iteration_state_transitions` | `IterationState` | `Planning -> Committed -> InProgress -> Closed`;`Closed -> InProgress` 拒绝 | domain unit |
| `commitment_state_transitions` | `CommitmentState` | `Candidate -> Committed -> Changed -> Closed`;`Closed -> Changed` 拒绝 | domain unit |
| `derived_freshness_transitions` | `DerivedFreshnessState` | `Fresh -> Stale -> Rebuilding -> Fresh / Failed`;query 不可改 fresh | projection test |
| `reference_resolution_transitions` | `ReferenceResolutionStatus` | `Unresolved -> Resolved -> Stale -> Resolved`;failed 保留 last good snapshot | reference test |
| `outbox_publication_transitions` | `OutboxPublicationState` | `Pending -> Published / Failed -> Pending`;`Published -> Pending` 拒绝;`event_kind/source_ref` mismatch -> failed marker | job / repository |

#### 8.6 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_same_key_same_digest_replays_result` | Step 13 duplicate success | second request 通过 `CommandResultRepository.get_result` 返回同 result_ref,receipt 标记 duplicate,无新 truth / trace / outbox | application |
| `job_same_key_same_digest_replays_report` | Step 13 job duplicate success | second job run 通过 `JobResultRepository.get_report` 返回同 result_ref / stored report,不重新 scan / publish / handoff | jobs |
| `command_same_key_different_digest_conflicts` | Step 13 conflict | same key + different digest 返回 `IdempotencyConflict`,不得写业务 truth | application |
| `command_reserved_inflight_returns_unavailable` | Step 13 in-flight | reserved same digest 返回 temporarily unavailable,不重放 domain | idempotency fake |
| `command_duplicate_missing_result_surface` | Step 12 / 13 duplicate missing | completed idempotency 指向 missing / wrong stored result 时返回 temporarily unavailable,无业务写 | application + result store fake |
| `digest_excludes_volatile_metadata` | Step 13 digest 排除 | request_id / trace / requested_at 变化不改变 digest | contract unit |
| `accepted_truth_and_outbox_same_uow` | Step 11 UoW | truth、trace、audit、outbox、projection stale、command result save、idempotency complete 同事务 | repository + service |
| `outbox_enqueue_failure_rolls_back_truth` | Step 11 rollback | outbox enqueue failure 时 truth / audit 不提交 | repository + service |
| `version_conflict_rolls_back_side_effects` | Step 11 / 12 | stale expected_version 返回 `VersionConflict`,无 trace / outbox | application |
| `unique_create_conflict_does_not_replay_result` | Step 13 unique key | business unique conflict 不等同 idempotency duplicate | repository fake |
| `inbound_event_redelivery_skips` | Step 13 event dedup | same event key + digest -> AckDuplicate,无重复 snapshot | worker |
| `inbound_event_digest_conflict_dead_letters` | Step 13 event conflict | same event key + different payload -> dead-letter / conflict marker | worker |
| `outbox_dual_publisher_single_winner` | Step 13 outbox concurrency | 两个 publisher 只有一个 mark succeeds,另一方不改 truth | worker + repository |
| `projection_stale_vs_rebuild_race` | Step 13 projection race | older cursor 不覆盖 newer freshness | projection fake |
| `reference_refresh_race_preserves_last_good` | Step 13 reference race | failed / version conflict 保留 last successful snapshot | reference fake |
| `handoff_job_rerun_idempotent` | Step 13 handoff rerun | duplicate job 通过 `JobResultRepository.get_report` 返回 existing report / marker,不重复 handoff body | job runner |
| `commit_unknown_requires_idempotency_audit` | Step 13 commit unknown | retry 前调用 `IdempotencyRepository.get`,不得盲重放 domain | service + fake UoW |
| `query_never_repairs_projection` | Step 8 / 9 / 12 | stale / missing projection 只返回 surface,不触发 rebuild | query test |
| `reconciliation_is_read_only` | Step 8 / 9 / 12 | `RunWorkReconciliation` 生成 report,不修 business truth | job runner |

#### 8.7 错误 / 配置 / 观测测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `protocol_error_surface_stable` | Step 8 / 12 | `InvalidRequest`、`DomainRejected`、`NotFound`、`VersionConflict`、`IdempotencyConflict`、`TemporarilyUnavailable` 映射稳定 | contract + handler |
| `invalid_request_no_audit_outbox` | Step 12 | 缺 metadata / actor / idempotency key 时不写业务 audit / outbox | handler + service |
| `domain_reject_no_truth_side_effect` | Step 12 | invalid transition / policy reject rollback,无 trace / outbox | domain + application |
| `resolver_failure_does_not_create_external_truth` | Step 12 / 14 | resolver failure 只返回 reject / marker,不补造外部 truth | application / job |
| `publisher_failure_marks_outbox_failed_only` | Step 12 | publish failure 不回滚已提交 truth,只改 outbox marker | worker |
| `projection_failure_sets_failed_surface` | Step 12 | rebuild failure 写 failed marker,query 暴露 failed / stale | job + query |
| `handoff_failure_records_marker_or_report` | Step 12 / 15 | handoff failure 不写外部正文,只写 marker / report | job + observability |
| `runtime_config_rejects_forbidden_boundary` | Step 14 | config 不能关闭 metadata / idempotency / audit / outbox / visibility 边界 | config |
| `non_core_sibling_not_cargo_dependency` | Step 14 | 除 `core-contracts` 外 sibling repo 不进入 Cargo dependency | architecture check |
| `logs_do_not_include_forbidden_body` | Step 15 | logs 不含 raw request / response body、external body、secret | observability check |
| `metrics_are_low_cardinality` | Step 15 | metric labels 不含 record id、digest 全量、actor profile、free text | observability check |
| `audit_and_event_use_refs_only` | Step 15 | audit / event / handoff marker 只含 stable refs / marker refs | observability check |

#### 8.8 脚本契约表

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置、fake / in-memory profile | `artifacts/test/<run_id>` | 非 0 exit code,保留 failure summary 到 artifact root |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code,说明缺失 artifact 或报告生成失败 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | artifacts + reports | `reports/runs/<run_id>/redaction-check.md` | 发现 raw body、external body、secret、token 时失败 |

脚本约束:

- artifact root 固定为 `artifacts/test/<run_id>`,不得再额外加项目名层级。
- report root 固定为 `reports/`,单次运行输出到 `reports/runs/<run_id>`。
- 详细设计只定义命令契约、输入输出和失败语义;脚本实现、fixture 组织和 CI 排期留给实施计划与测试方案。

### 9. 前序契约回填记录

| 回填文件 | 回填内容 | 原因 |
|---|---|---|
| `03_ddd_calibration_flow.md` | Step 15 标为已完成,Step 16 标为待审核 | 反映当前进度 |
| `03_ddd_step_15_observability_audit.md` | Step 状态改为已确认 | 用户已审核通过 Step 15 |

### 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_16_test_cuts.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“模块测试切口汇总表”“Command 接口测试切口汇总表”“Query / Event / Job 接口测试切口汇总表”“状态机测试切口表”和“一致性 / 幂等 / 并发测试切口表”小节。

#### 5.15 测试切口与最小验证清单

L1-work 详细设计只定义最小测试入口,不替代 `05-测试方案.md`。完整测试矩阵、优先级、覆盖率目标、fixture 组织、CI 分层、真实 durable store / broker / sibling repo 联调和执行排期由测试方案继续展开。

最小验证必须覆盖七个模块、18 个 Command、8 个 Query、7 个 Inbound Event、10 个 Outbound Event、6 个 Operations Job、12 组状态机,以及事务、幂等、并发、错误恢复、配置边界和观测字段边界。

每个 Command 至少覆盖 success、reject / error 和 duplicate / conflict;每个 Query 至少覆盖 hit、missing / not visible / degraded 和 no-write;每个 Event / Job 至少覆盖 success、failure / dead-letter / partial failure 和 rerun / duplicate。状态机必须同时覆盖合法转换和非法转换。

### 11. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD16-OPEN-001 | `05-测试方案.md` 是否新建 | 本 Step 不替代测试方案 | 后续测试文档 |
| DDD16-OPEN-002 | 真实 durable store / broker 集成测试环境 | P0 以 fake / in-memory profile 验证语义 | 测试方案 / 实施计划 |
| DDD16-OPEN-003 | redaction check 的具体扫描规则 | 本 Step 只定义脚本契约和失败语义 | 实施阶段脚本 |

### 12. 进入下一步条件

- [x] 模块测试切口覆盖 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。
- [x] 接口测试切口覆盖 18 个 Command、8 个 Query、7 个 Inbound Event、10 个 Outbound Event、6 个 Operations Job。
- [x] 状态机测试切口覆盖 12 组正式状态机的合法和非法转换。
- [x] 一致性 / 幂等 / 并发测试切口覆盖 duplicate、conflict、version conflict、outbox、projection、reference、handoff、commit unknown。
- [x] 错误 / 配置 / 观测测试切口覆盖 no-write、forbidden field、low-cardinality metric 和 boundary config。
- [x] 明确本 Step 不写完整测试方案、覆盖率目标、CI 排期或 fixture 组织。
