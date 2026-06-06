# Step 11. 定义持久化、事务与一致性契约

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 11
- 回填章节:`03-详细设计.md` §5.10 数据持久化、事务与一致性契约 / §8 事务与一致性 / §10 配置与外部依赖绑定

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §11 | 真相、快照、引用数据归属 | 固定本仓拥有与不得拥有的数据边界 |
| `01-架构设计.md` §9~§11 | 数据所有权、一致性策略、关键技术机制 | 固定核心 truth 强一致、外部快照 / projection / outbox 最终一致 |
| `02-概要设计.md` §8~§10 | 处理流、状态机、异常落点 | 固定每类写路径的持久化副作用 |
| `03_ddd_step_06_object_contracts.md` | domain object、state、history、outbox、projection object | 固定存储对象字段来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、UnitOfWork、idempotency、projection、reference、outbox port | 固定函数签名和 adapter 边界 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job DTO 和 page / result schema | 固定 public read / write surface |
| `03_ddd_step_09_function_flows.md` | 每条 flow 的事务顺序和错误回滚 | 固定事务边界 |
| `03_ddd_step_10_state_matrix.md` | 状态转换、非法转换和跨状态副作用 | 固定版本、outbox、projection stale、failed marker 规则 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 11.1 | 文件骨架、SOP 问题回答、数据所有权实现表、逻辑存储对象表 | [x] |
| 11.2 | Repository 函数表、版本 / 唯一键 / 索引规则 | [x] |
| 11.3 | 事务边界表、一致性策略、失败恢复口径 | [x] |
| 11.4 | 前序契约回填、回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 哪些数据对象由本仓拥有?

   回答:`Project`、`ProjectMember`、`Backlog`、`WorkItem` / `ChildWorkItem`、`WorkDependency`、`WorkBlocker`、`Iteration`、`IterationCommitment`、`PromoteResult`、Work 域 history / trace / outbox / idempotency / local projection freshness 和 handoff marker 由本仓拥有。它们是 L1-work 代码可创建、更新或归档的正式本地数据。

2. 哪些只是引用、快照或投影?

   回答:`GlobalMemberRef`、`MethodDefinitionRef`、`ProcessTimeboxRef`、`ExternalEvidenceRef`、`SourceWorkRef`、conversation / runtime / governance / artifact / archive / observability ref 只是引用。`MemberCapabilitySnapshot`、`MethodDefinitionSnapshot`、source / evidence / process 相关 reference state 是本地快照 / 解析状态。`ProjectBoardView`、`MemberWorkView`、`IterationSummaryView`、`WorkSearchProjection` 和 `ReconciliationReport` 是派生读模型或报告,不得成为业务 truth。

3. repository 函数如何命名,参数和返回是什么?

   回答:函数签名以 Step 7 为准。本 Step 不重命名 repository port,只把每个函数映射到逻辑存储对象、主键 / 索引、锁 / 事务和一致性语义。写函数必须接收 `&UnitOfWorkHandle`;需要覆盖已有记录的写函数必须接收 `expected_version: Version` 或 `Option<Version>`。

4. 哪些处理流需要事务,事务内必须完成哪些写入?

   回答:所有 Command、Inbound Event Consumer 和 Operations Job 写路径需要本地 UoW。核心 truth Command 必须在同一 UoW 内完成 truth save、正式定义的 history 或 trace、outbox enqueue、idempotency complete,以及有正式 public view identity 时的 projection stale marker。Query 不开写事务、不写 audit、不触发 rebuild。

5. 是否需要乐观锁、行锁、版本号、outbox 或 projection?

   回答:需要版本号和乐观锁。所有可变 truth、reference state、freshness state、outbox record、idempotency record、handoff marker 和 projection batch 均必须有可测试的 version / cursor / run marker。P0 不锁具体数据库、DDL 或行锁产品;实现必须通过 repository contract 表达 version conflict,不得 silent overwrite。核心 truth 写路径必须写 outbox;projection 由 stale marker 和 rebuild job 最终一致维护。

6. 如果事件发布或 projection 更新失败,如何恢复?

   回答:事件发布失败只更新 `OutboxPublicationState::Failed`,不回滚已成立 truth;retry 通过 `mark_pending_for_retry(...)` 或 retryable failed selection 恢复。projection rebuild 失败写 `DerivedFreshnessState::Failed`,query 返回 failed / stale surface,不得反写业务 truth。reference refresh 失败写 `ReferenceResolutionStatus::Failed` 或保留旧 snapshot + failed marker,不得补造外部 truth。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 7 repository trait | 函数签名完整,但未映射逻辑存储主键、唯一键、索引和版本字段 | 本 Step 补 logical collection / projection 契约表 |
| Step 9 flow | 已说明 UoW 顺序,但缺统一事务边界表 | 本 Step 按场景列出 begin / commit / rollback 和同事务写入 |
| Step 10 auxiliary state | freshness failed / reference failed / outbox retry 需要持久化入口 | 已回填 Step 6 / 7 / 9 的最小函数签名,并在本 Step 固定存储规则 |
| 架构设计 | 不锁具体数据库产品 | 本 Step 只定义逻辑存储契约和实现约束,不写强制 DDL |
| 旧详细设计 | 可能含 PostgreSQL / CTE / board projection 旧产品口径 | 本 Step 不继承旧产品选型,只承接新版 `00/01/02` 和本轮 Step |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据归属 | 架构层分为 truth / snapshot / ref / derived | 每个逻辑存储对象都有 owner、writer、reader 和一致性要求 | 支撑 infra adapter 落码 |
| repository | Step 7 有函数签名 | 增加函数到存储对象、锁、版本、错误的映射 | 支撑 contract tests |
| 事务 | Step 9 分散到各 flow | 统一事务边界表 | 防止 partial truth |
| projection / reference failure | Step 10 发现状态闭环缺口 | 补 `mark_rebuilding` / `mark_failed` / `mark_reference_failed` / retry method | 防止实现侧自行补设计 |
| 数据库产品 | 未锁定 | 仍不锁定,只锁逻辑 schema | 保持架构层不提前选型 |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在详细设计中写具体 SQL DDL | 实现直观 | 当前未锁数据库产品,容易把历史 PostgreSQL 口径误升为 truth | 不采用 |
| 只重复 Step 7 repository trait | 简洁 | 不能指导 adapter 主键、唯一键、版本和事务 | 不采用 |
| 写逻辑 collection / projection 契约 | 不锁产品,但能 1:1 实现 fake / durable adapter | 后续迁移脚本仍需实施计划或 infra 设计细化 | 采用 |
| outbox / projection 与 truth 同步强一致 | 简化读路径 | 会让 publisher / rebuild 失败回滚核心 truth | 不采用 |
| truth + outbox + stale marker 同 UoW,发布 / rebuild 最终一致 | 保证事实成立且传播可恢复 | 需要明确 failed / retry marker | 采用 |

### 8. 结构化中间产物

#### 8.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `Project` | `domain/project.rs` / `ProjectRepository` | `CreateProjectFlow`、`UpdateProjectLifecycleFlow` | command service、query service、projection rebuild、archive handoff | 与 Backlog archive / trace / outbox 同 UoW;version conflict 不覆盖 |
| `ProjectMember` | `domain/project.rs` / `ProjectMemberRepository` | `AssignProjectMemberFlow`、`UpdateProjectMemberResponsibilityFlow` | command service、authorization、projection rebuild | 不写 GlobalMember truth;member ref 唯一性按 project scoped key |
| `Backlog` | `domain/project.rs` / `BacklogRepository` | `CreateProjectFlow`、`UpdateBacklogAvailabilityFlow`、project archive path | work create、iteration commit、query、projection rebuild | Project create 同 UoW 创建;formal work membership 与 work create 同 UoW |
| `WorkItem` / `ChildWorkItem` | `domain/work_item.rs` / `WorkItemRepository` | create / lifecycle / iteration / promote flows | dependency、iteration、query、projection rebuild | root / child 统一 `FormalWorkRef`;lifecycle save 必须 expected_version |
| `PromoteResult` | `domain/promote.rs` / `PromoteRepository` | `RequestWorkPromotionFlow`、`ReviewWorkPromotionFlow` | promote service、query、projection rebuild | source ref 不含正文;accept path 与 created work 同 UoW |
| `PendingPromoteIntake` | `domain/promote.rs` / `PromoteRepository` | `ConsumeRuntimePromoteRequestedFlow` | promote service / operations inspection | 不是 promote truth;不 enqueue promote accepted event |
| `WorkDependency` / `WorkBlocker` | `domain/dependency.rs` / `DependencyRepository` | dependency / blocker command flows | policy、query、projection rebuild | graph snapshot 只用于 policy;history 与 state save 同 UoW |
| `Iteration` / `IterationCommitment` | `domain/iteration.rs` / `IterationRepository` | iteration command flows | command service、query、projection rebuild | commit path 同 UoW 更新 iteration、commitment、work marks |
| `WorkTraceRecord` / `WorkAuditTrail` | `domain/audit.rs` / `AuditRepository` | accepted truth command / handoff job | trace query、handoff job、archive handoff | trace 与 accepted truth 同 UoW;不保存 observability 正文 |
| `WorkOutboxRecord` | `domain/outbox.rs` / `WorkOutboxRepository` | accepted truth command、publish job | publish job、reconciliation | enqueue 与 truth 同 UoW;publish marker 独立 UoW;failure 不回滚 truth |
| `DerivedWorkViewState` / read projections | `domain/projection.rs` + `contracts/views.rs` / `ProjectionRepository` | command / consumer stale mark、rebuild job | query service、reconciliation | projection 可 stale / failed;只从 committed truth rebuild |
| `ReferenceResolutionState` / snapshots | `domain/reference.rs` / `ReferenceSnapshotRepository` | inbound consumers、reference refresh job | command policy、query、projection rebuild | 保存引用 / 快照摘要;不保存外部正文 |
| `IdempotencyRecord` | `application/idempotency.rs` / `IdempotencyRepository` | command / consumer / job service | same service duplicate handling | reserve / complete 与业务写入同 UoW;digest 冲突不得执行业务写 |
| `StoredCommandResult` | `application/results.rs` / `CommandResultRepository` | command service success path | same command service duplicate replay | command result save 必须与 accepted truth 和 idempotency complete 同 UoW;duplicate 不得从当前 truth 重建 |
| handoff markers | `domain/audit.rs` / `AuditRepository` | trace / archive handoff jobs | jobs、reconciliation | 只保存 handoff ref / marker,不接管 archive / observability 正文 |

#### 8.2 表 / collection / projection 契约表

本表是逻辑存储契约,不是数据库产品 DDL。durable adapter 可以使用 SQL table、document collection 或 in-memory map,但必须保留主键、唯一键、索引和版本语义。

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `projects` | Project truth | PK `project_id`;unique `owner_ref` 可选按业务配置 | `owner_ref`、`lifecycle_state` | `version: Version` |
| `project_members` | 项目内成员承担 truth | PK `project_member_id`;unique `(project_id, member_ref)` for non-released current responsibility | `project_id`、`member_ref`、`responsibility_state` | `version` |
| `backlogs` | Project formal work universe | PK `backlog_id`;unique `project_id` | `project_id`、`backlog_state` | `version` |
| `backlog_formal_work` | Backlog membership | PK `(backlog_id, formal_work_ref)` | `formal_work_ref`、`backlog_id` | no independent version;owned by UoW write |
| `work_items` | Root WorkItem truth | PK `work_item_id`;unique formal ref variant | `backlog_id`、`assignee_ref`、`work_state` | `version` |
| `child_work_items` | ChildWorkItem truth | PK `child_work_item_id`;unique formal ref variant | `parent_work_item_id`、`work_state`、`source_ref`、`completion_ref` | `version` |
| `promote_results` | Promote decision truth | PK `promote_result_id`;latest by `source_ref` | `source_ref`、`result_state`、`created_work_ref` | `version` |
| `pending_promote_intakes` | Runtime promote intake marker | PK `source_event_id`;unique `source_ref` optional by policy | `source_ref` | no independent version or `version` for durable adapter |
| `work_dependencies` | Dependency truth | PK `dependency_id`;unique `(upstream_work_ref, downstream_work_ref)` for active relation | `upstream_work_ref`、`downstream_work_ref`、`dependency_state` | `version` |
| `work_blockers` | Blocker truth | PK `blocker_id` | `blocked_work_ref`、`blocker_state`、`cause_ref`、`resolved_evidence_ref` | `version` |
| `iterations` | Iteration truth | PK `iteration_id` | `project_id`、`timebox_ref`、`iteration_state` | `version` |
| `iteration_commitments` | Iteration commitment truth | PK `commitment_id`;unique active `iteration_id` | `iteration_id`、`commitment_state` | `version` |
| `promote_decision_records` | Promote history | PK `decision_id` | `result_ref`、`source_ref` | append-only, no overwrite |
| `dependency_change_records` | Dependency / blocker history | PK `change_id` | `relation_ref` | append-only |
| `iteration_change_records` | Iteration commitment history | PK `change_id` | `iteration_ref` | append-only;只由 commitment scope / work set change 形成 |
| `work_trace_records` | Work trace records | PK `trace_id` | `subject_ref`、`trace_context_ref` | append-only |
| `work_audit_trails` | Subject audit summary | PK `subject_ref` | `latest_trace_id` | `version` |
| `work_outbox_records` | Committed event publication | PK `outbox_id` | `publication_state`、`event_kind` | `version` |
| `derived_view_states` | Projection freshness | PK `view_ref` | `freshness_state`、`source_cursor` | `version` or cursor compare |
| `project_board_views` | Project board projection | PK `project_ref` | `source_cursor` | replaced by rebuild batch |
| `member_work_views` | Member work projection | PK `project_member_ref` | `project_id`、`source_cursor` | replaced by rebuild batch |
| `iteration_summary_views` | Iteration summary projection | PK `iteration_ref` | `project_id`、`source_cursor` | replaced by rebuild batch |
| `work_search_projection` | Search projection records | PK `search_record_ref`;unique `(project_id, formal_work_ref)` | search criteria fields、`source_cursor` | replaced by rebuild batch |
| `reference_resolution_states` | External reference resolution | PK `reference_ref` | `resolution_state`、`last_resolved_at` | `version` |
| `member_capability_snapshots` | Identity member snapshot | PK `member_ref` | snapshot state / updated cursor | `version` |
| `method_definition_snapshots` | Method definition snapshot | PK `definition_ref` | definition kind / updated cursor | `version` |
| `command_result_records` | Command duplicate replay result surface | PK `ApplicationResultRef`;unique `(operation,result_id)` | `operation`、`result_kind`、`created_at` | append-only;no optimistic update |
| `idempotency_records` | Command / event / job dedup | PK `(operation, idempotency_key)` | `request_digest`、`status`、`result_ref` | state version or atomic reservation |
| `trace_handoff_markers` | Observability handoff marker | PK `handoff_ref` or `trace_id` | handoff state / target | `version` optional |
| `archive_handoff_markers` | Archive handoff marker | PK `handoff_ref` | project / iteration / trace scope | `version` optional |

#### 8.3 Repository 函数表

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `ProjectRepository.get(project_ref)` | 读取 Project truth | read-only, no UoW | `Option<Project>` | `RepositoryError` |
| `ProjectRepository.list_by_owner(owner_ref, page)` | 按 owner 列 project | read-only, page stable order | `Page<Project>` | `RepositoryError` |
| `ProjectRepository.create(project, &uow)` | 创建 Project | UoW required;PK / owner uniqueness atomic | `Version` | duplicate -> `RepositoryError::Conflict` |
| `ProjectRepository.save(project, expected_version, &uow)` | 保存 lifecycle change | UoW + optimistic version | `Version` | stale version -> `RepositoryError::VersionConflict` |
| `ProjectMemberRepository.get(member_ref)` | 读取项目成员承担 | read-only | `Option<ProjectMember>` | `RepositoryError` |
| `ProjectMemberRepository.get_by_member(project_ref, member_ref)` | 防重复承担 / authorization | read-only;must use project scoped index | `Option<ProjectMember>` | `RepositoryError` |
| `ProjectMemberRepository.create(project_member, &uow)` | 创建承担记录 | UoW;unique current `(project_id, member_ref)` | `Version` | conflict / unavailable |
| `ProjectMemberRepository.save(project_member, expected_version, &uow)` | 保存责任状态 | UoW + optimistic version | `Version` | version conflict |
| `BacklogRepository.get_by_project(project_ref)` | 找 Project backlog | read-only;unique project index | `Option<Backlog>` | `RepositoryError` |
| `BacklogRepository.get_by_project_with_version(project_ref)` | 找 Project backlog 并读取 optimistic version | read-only;unique project index;用于紧随其后的 linked save | `Option<(Backlog, Version)>` | `RepositoryError` |
| `BacklogRepository.contains_formal_work(backlog_ref, work_ref)` | 检查 formal work membership | read-only;membership index | `bool` | `RepositoryError` |
| `BacklogRepository.create(backlog, &uow)` | 创建 backlog | same UoW as Project create | `Version` | conflict |
| `BacklogRepository.save(backlog, expected_version, &uow)` | 保存 availability | UoW + optimistic version | `Version` | version conflict |
| `BacklogRepository.add_formal_work(backlog_ref, work_ref, &uow)` | 添加正式工作 membership | same UoW as work create / promote accept | `()` | duplicate membership may be idempotent only in duplicate replay path |
| `WorkItemRepository.get_formal_work(work_ref)` | 统一读取 root / child work | read-only | `Option<FormalWorkRecord>` | `RepositoryError` |
| `WorkItemRepository.get_formal_work_scope(work_ref)` | 读取 formal work 所属 project / backlog / assignee scope | read-only;must use backlog membership / parent root relation,not string parsing | `Option<FormalWorkScope>` | `RepositoryError` |
| `WorkItemRepository.get_formal_work_with_version(work_ref)` | 统一读取 root / child work 及 optimistic version | read-only;仅供紧随其后的 `save_formal_work(record, expected_version, &uow)` 写路径 | `Option<(FormalWorkRecord, Version)>` | `RepositoryError` |
| `WorkItemRepository.list_by_backlog(backlog_ref, page)` | 列 formal work refs | read-only, page stable order | `Page<FormalWorkRef>` | `RepositoryError` |
| `WorkItemRepository.create_work_item(work_item, &uow)` | 创建 root work | UoW;PK unique | `Version` | conflict |
| `WorkItemRepository.create_child_work_item(child, &uow)` | 创建 child work | UoW;PK unique;parent existence checked by service | `Version` | conflict |
| `WorkItemRepository.save_formal_work(record, expected_version, &uow)` | 保存 lifecycle / assignment | UoW + optimistic version per variant | `Version` | version conflict |
| `PromoteRepository.find_latest_by_source(source_ref)` | 按来源找 promote | read-only;source index | `Option<PromoteResult>` | `RepositoryError` |
| `PromoteRepository.create(result, &uow)` | 创建 promote result | UoW;PK unique | `Version` | conflict |
| `PromoteRepository.save(result, expected_version, &uow)` | 保存 promote decision | UoW + optimistic version | `Version` | version conflict |
| `PromoteRepository.append_decision(decision, &uow)` | 写 promote history | UoW;append-only | `()` | duplicate decision id conflict |
| `PromoteRepository.save_pending_intake(intake, &uow)` | 保存 runtime intake marker | UoW;source_event_id unique | `()` | duplicate source event id maps to dedup |
| `DependencyRepository.load_graph_snapshot(project_ref)` | 读取 dependency policy 图 | read-only;must include active dependency / blocker refs | `DependencyGraphSnapshot` | `RepositoryError` |
| `DependencyRepository.create_dependency(dependency, &uow)` | 创建 dependency | UoW;PK and active edge uniqueness | `Version` | conflict |
| `DependencyRepository.save_dependency(dependency, expected_version, &uow)` | 保存 dependency state | UoW + optimistic version | `Version` | version conflict |
| `DependencyRepository.create_blocker(blocker, &uow)` | 创建 blocker | UoW;PK unique | `Version` | conflict |
| `DependencyRepository.save_blocker(blocker, expected_version, &uow)` | 保存 blocker state | UoW + optimistic version | `Version` | version conflict |
| `DependencyRepository.append_change(change, &uow)` | 写 dependency / blocker history | UoW;append-only | `()` | conflict |
| `IterationRepository.create_iteration(iteration, &uow)` | 创建 iteration | UoW;PK unique;timebox uniqueness optional by project policy | `Version` | conflict |
| `IterationRepository.save_iteration(iteration, expected_version, &uow)` | 保存 iteration lifecycle | UoW + optimistic version | `Version` | version conflict |
| `IterationRepository.get_commitment_with_version(iteration_ref)` | 读取 commitment 及 optimistic version | read-only;仅供紧随其后的 `save_commitment(commitment, Some(version), &uow)` 写路径 | `Option<(IterationCommitment, Version)>` | `RepositoryError` |
| `IterationRepository.save_commitment(commitment, expected_version, &uow)` | 创建 / 更新 commitment | UoW;`None` only create;`Some` update | `Version` | version conflict |
| `IterationRepository.append_change(change, &uow)` | 写 iteration history | UoW;append-only | `()` | conflict |
| `AuditRepository.append_trace(record, &uow)` | 写 trace record | same UoW as accepted truth | `()` | conflict / unavailable |
| `AuditRepository.save_audit_trail(audit_trail, expected_version, &uow)` | 更新 audit summary | UoW + optional optimistic version | `Version` | version conflict |
| `AuditRepository.list_trace_records(subject_ref, page)` | 分页读 trace | read-only | `Page<WorkTraceRecord>` | `RepositoryError` |
| `AuditRepository.save_trace_handoff_marker(marker, &uow)` | 保存 observability handoff marker | job UoW;does not write observability body | `()` | conflict / unavailable |
| `AuditRepository.save_archive_handoff_marker(marker, &uow)` | 保存 archive handoff marker | job UoW;does not write archive body | `()` | conflict / unavailable |
| `WorkOutboxRepository.enqueue(record, &uow)` | 写待发布 outbox | same UoW as accepted truth | `()` | conflict / unavailable |
| `WorkOutboxRepository.list_pending(page)` | 读取待发布或 retryable failed records | read-only;must be stable order | `Page<WorkOutboxRecord>` | `RepositoryError` |
| `WorkOutboxRepository.mark_published(outbox_id, publication_ref, expected_version, &uow)` | 标记发布成功 | publish UoW + optimistic version | `Version` | version conflict |
| `WorkOutboxRepository.mark_failed(outbox_id, reason, expected_version, &uow)` | 标记发布失败 | publish UoW + optimistic version | `Version` | version conflict |
| `WorkOutboxRepository.mark_pending_for_retry(outbox_id, reason, expected_version, &uow)` | retry policy 接受后重新待发布 | retry UoW + optimistic version | `Version` | version conflict |
| `ProjectionRepository.get_*_view(ref)` | 读取 projection + freshness | read-only;must not rebuild | `Option<*Projection>` | `RepositoryError` |
| `ProjectionRepository.search_work(project_ref, criteria, page)` | 搜索 projection | read-only;projection only | `Page<WorkSearchProjection>` | `RepositoryError` |
| `ProjectionRepository.replace_project_views(batch, cursor, &uow)` | 从 truth snapshot 替换 projection batch | rebuild job UoW;atomic per project / projection_set | `()` | repository failure -> rollback |
| `ProjectionRepository.mark_stale(affected, cursor, &uow)` | 标记 projection stale | command / consumer UoW;idempotent for same or older cursor | `()` | `RepositoryError` |
| `ProjectionRepository.mark_rebuilding(affected, cursor, &uow)` | 标记 projection rebuilding | rebuild UoW;only stale / failed views | `()` | `RepositoryError` |
| `ProjectionRepository.mark_failed(affected, cursor, reason, &uow)` | 标记 projection failed | rebuild failure UoW;no truth write | `()` | `RepositoryError` |
| `ReferenceSnapshotRepository.save_reference_state(state, expected_version, &uow)` | 保存 reference state | consumer / job UoW + optional version | `Version` | version conflict |
| `ReferenceSnapshotRepository.save_member_snapshot(snapshot, expected_version, &uow)` | 保存 member snapshot | same UoW as reference resolved state | `Version` | version conflict |
| `ReferenceSnapshotRepository.save_method_snapshot(snapshot, expected_version, &uow)` | 保存 method snapshot | same UoW as reference resolved state | `Version` | version conflict |
| `ReferenceSnapshotRepository.mark_reference_failed(reference_ref, reason, occurred_at, expected_version, &uow)` | 保存 failed marker | UoW;preserve last snapshot | `Version` | version conflict |
| `ReferenceSnapshotRepository.list_stale_references(page)` | 列待刷新 refs | read-only;stable order | `Page<ExternalReferenceRef>` | `RepositoryError` |
| `WorkTruthSnapshotRepository.load_project_truth_snapshot(project_ref)` | 读取 committed truth rebuild snapshot | read-only;no projection fallback | `ProjectWorkTruthSnapshot` | `RepositoryError` |
| `WorkTruthSnapshotRepository.load_truth_cursor(project_ref)` | 读取 truth cursor | read-only;cursor != optimistic version | `WorkTruthCursor` | `RepositoryError` |
| `CommandResultRepository.save_result(result_ref, stored_result, &uow)` | 保存 public command result surface | same UoW as accepted command truth;must precede idempotency complete | `()` | `RepositoryError` |
| `CommandResultRepository.get_result(result_ref)` | 读取 duplicate replay result surface | read-only;no UoW;no truth reconstruction | `Option<StoredCommandResult>` | `RepositoryError` |
| `IdempotencyRepository.get(key, operation)` | 读取幂等记录用于 duplicate recovery / commit-status audit | read-only;no UoW | `Option<IdempotencyRecord>` | `IdempotencyError` |
| `IdempotencyRepository.reserve(key, operation, digest, &uow)` | reserve dedup key | same UoW as protected write | `IdempotencyReservation` | `IdempotencyError` |
| `IdempotencyRepository.complete(reservation, result_ref, &uow)` | 保存成功 result ref | same UoW as accepted writes | `()` | `IdempotencyError` |
| `IdempotencyRepository.mark_conflict(conflict, &uow)` | 记录 digest conflict | UoW;no business truth write | `()` | `IdempotencyError` |

#### 8.4 版本、唯一键与索引规则

| 规则 | 正式口径 | 适用对象 |
|---|---|---|
| optimistic version | 修改已有 truth / state 必须传 `expected_version`;adapter mismatch 返回 `RepositoryError::VersionConflict` | Project、ProjectMember、Backlog、WorkItem、PromoteResult、Dependency、Blocker、Iteration、Commitment、Outbox、Reference、Audit summary |
| create uniqueness | create 函数必须在 UoW 内原子检查 PK / unique key;冲突不得覆盖 | all `create_*` |
| append-only history | history / trace record 不允许 update;duplicate id 是 conflict | promote / dependency / iteration commitment history、trace |
| formal work identity | `FormalWorkRef::WorkItem(id)` 和 `FormalWorkRef::ChildWorkItem(id)` 共享查询面,但 durable storage 可分表 | work repository |
| formal work scope closure | 任何 flow 需要从 `FormalWorkRef` 得到 `ProjectRef` / `BacklogRef` / `ProjectMemberRef` 以读取 graph、校验 scope 或构造 projection stale 时,必须调用 `WorkItemRepository.get_formal_work_scope(...)`;不得实现 `project_ref_from(FormalWorkRef)`、解析 id 字符串或私自读取 storage join | WorkItemRepository / application services |
| backlog membership | membership 与 work truth 创建同 UoW;不得先加入 membership 后 create work 失败 | Backlog + WorkItem |
| source ref uniqueness | runtime intake 以 `source_event_id` dedup;promote result 以 `source_ref` 可查 latest,不强制唯一历史 | PromoteRepository |
| dependency graph index | active dependency edge `(upstream, downstream)` 不得重复;graph snapshot 只含 formal work refs | DependencyRepository |
| iteration active commitment | 一个 iteration 当前只能有一个 active commitment set;history 用 change record 追溯 | IterationRepository |
| outbox retry | `Failed -> Pending` 必须通过 `mark_pending_for_retry(...)` 或 adapter 等价 retry transaction,不得由 `list_pending` 静默改状态 | WorkOutboxRepository |
| projection cursor monotonicity | `mark_stale` 不能把 view cursor 倒退;older cursor no-op or version-safe ignore | ProjectionRepository |
| projection view identity closure | `mark_stale` 的 affected views 必须来自 Step 8 §9.2 已定义的 public `DerivedWorkViewRef`;没有 query / projection identity 的 truth 或 marker 不得临时派生 view ref | ProjectionRepository / function flows |
| projection rebuild replace | `replace_project_views` 必须以 committed truth snapshot + cursor 为输入;不得从旧 projection 推导 | ProjectionRepository |
| reference failed marker | failed marker 保留 last successful snapshot;不得删除 snapshot body summary | ReferenceSnapshotRepository |
| idempotency digest | `(operation, key)` unique;相同 digest duplicate 先返回 `ApplicationResultRef`;不同 digest conflict | IdempotencyRepository |
| command result identity | `ApplicationResultRef` 必须能读回 `StoredCommandResult`;stored result variant 必须匹配 operation | CommandResultRepository |
| page ordering | `Page<T>` 必须有稳定排序和 next token;不得依赖 map iteration order | all list / search funcs |

#### 8.5 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `CreateProjectFlow` | application service reserve idempotency 前后同一 UoW | Project、Backlog、trace、outbox、projection stale、command result save、idempotency complete 后 | id generation failure、domain reject、repository error、idempotency conflict、outbox enqueue failure、projection stale failure、command result save failure | idempotency reserve;Project create;Backlog create;trace append;outbox enqueue;projection stale;command result save;idempotency complete |
| Project lifecycle update | service load + domain transition 后开启 / 使用 UoW | Project save、optional Backlog archive、trace、outbox、stale、command result save、idempotency complete 后 | version conflict、illegal transition、Backlog archive failure、outbox failure、projection stale failure、command result save failure | Project save;archive path Backlog save;trace;outbox;projection stale;command result save;idempotency complete |
| Backlog availability update | service after request digest / reserve | Backlog save + side effects + command result 后 | illegal transition、version conflict、repository failure、command result save failure | Backlog save;trace;outbox;projection stale;command result save;idempotency complete |
| ProjectMember assign / update | service reserve idempotency | member create / save + side effects + command result 后 | member duplicate、snapshot unresolved、domain reject、version conflict、command result save failure | ProjectMember write;optional reference state;trace;outbox;projection stale;command result save;idempotency complete |
| WorkItem / ChildWorkItem create | service reserve idempotency | work create + membership + side effects + command result 后 | source / method unresolved、backlog closed、domain reject、membership failure、command result save failure | Work create;Backlog membership add;trace;outbox;projection stale;command result save;idempotency complete |
| WorkItem lifecycle update | service reserve idempotency | work save + side effects + command result 后 | evidence unresolved/rejected、illegal state、version conflict、command result save failure | Work save;trace;outbox;projection stale;command result save;idempotency complete |
| Request promote | service reserve idempotency | PromoteResult create + side effects + command result 后 | source invalid、duplicate conflict、domain reject、command result save failure | PromoteResult create;trace;outbox;command result save;idempotency complete;no projection stale because no P0 promote/intake public view identity |
| Review promote | service reserve idempotency | PromoteResult save + optional work create + decision record + side effects + command result 后 | source invalid、accept work create failure、version conflict、command result save failure、accept-created work view stale failure | PromoteResult save;optional WorkItem create;Backlog membership;decision record;trace;outbox;command result save;idempotency complete;accept path marks existing work views stale when formal work is created / bound;reject path no projection stale |
| Dependency / blocker command | service reserve idempotency | relation save + history + side effects + command result 后 | graph policy reject、evidence reject、version conflict、command result save failure | dependency/blocker write;resolve path persists `resolved_evidence_ref`;history;trace;outbox;projection stale;command result save;idempotency complete |
| Iteration open | service reserve idempotency | Iteration create + side effects + command result 后 | timebox unresolved、project gate reject、command result save failure | Iteration create;resolver summary validation only;trace;outbox;projection stale;command result save;idempotency complete;does not write process timebox reference state |
| Commit iteration scope | service reserve idempotency | iteration + commitment + work marks + side effects + command result 后 | non-formal candidate、dependency gate reject、version conflict、command result save failure | Iteration save;Commitment save;Work marks using `get_formal_work_with_version` as version source;IterationChangeRecord;trace;outbox;projection stale;command result save;idempotency complete |
| Update iteration commitment | service reserve idempotency | commitment save + history + side effects + command result 后 | closed commitment、invalid change set、version conflict、command result save failure | Commitment save;optional work membership / mark writes use `get_formal_work_with_version` as version source;IterationChangeRecord;trace;outbox;projection stale;command result save;idempotency complete |
| Update iteration lifecycle | service reserve idempotency | iteration save + optional commitment close + side effects + command result 后 | illegal state、commitment close failure、version conflict、command result save failure | Iteration save;close path Commitment save uses `get_commitment_with_version` as version source;trace;outbox;projection stale;command result save;idempotency complete;no `IterationChangeRecord` append |
| Inbound event consumer | consumer service after dedup key build | reference / snapshot / pending intake + stale when public view exists + idempotency complete 后 | missing envelope -> no UoW accepted;unsupported version dead-letter;repo failure rollback | idempotency reserve;reference / snapshot / intake writes;projection stale only for formally defined public `DerivedWorkViewRef`;idempotency complete |
| Publish outbox one record | publish service per record | mark published / failed 后 | outbox version conflict、repository failure | publication state update only;job report item result |
| Rebuild projections | job service after idempotency reserve and truth snapshot load | mark rebuilding + replace views + fresh marker + idempotency complete 后 | truth snapshot missing、build failure、replace failure、version conflict | idempotency reserve;mark rebuilding;replace projection batch;fresh marker;optional outbox;idempotency complete |
| Rebuild projection failure marker | failure handling UoW | mark failed + job result 后 | failed marker write failure | mark failed marker;job report failed |
| Refresh references | job service after idempotency reserve | snapshot/reference writes + stale + idempotency complete 后 | invalid scope、repository failure | idempotency reserve;resolved / failed reference state;affected projection stale;idempotency complete |
| Trace handoff | handoff job after idempotency reserve | handoff marker + optional outbox + idempotency complete 后 | handoff port failure when configured as blocking marker failure、repo failure | trace handoff marker;optional `WorkTraceAvailable` outbox;idempotency complete |
| Archive handoff | archive job after idempotency reserve | archive handoff marker + optional outbox + idempotency complete 后 | archive port failure、repo failure | archive handoff marker;optional outbox;idempotency complete |
| Query | no write UoW | not applicable | repository read failure maps query error / surface | none;read-only only |

#### 8.6 一致性策略表

| 一致性对象 | 策略 | 恢复口径 | 不允许 |
|---|---|---|---|
| Project + initial Backlog | 强一致,同 UoW 成立 | create failure rollback both | Project exists without Backlog in accepted result |
| Project archive + Backlog archive | 强一致 for archive path | archive 联动失败 rollback Project archive | Archived Project with Open Backlog |
| WorkItem + Backlog membership | 强一致,同 UoW | membership failure rollback work create | membership points to missing work |
| Promote accept + WorkItem create | 强一致 if accept creates formal work | work create failure rollback promote accepted | Accepted PromoteResult without created_work_ref |
| Iteration commit + Commitment + Work marks | 强一致 | any mark failure rollback whole commit | Iteration Committed while work not Committed |
| Dependency / blocker state + history | 强一致 | history append failure rollback state change | relation changed without change record |
| truth + trace + outbox | 强一致 on accepted truth command | outbox enqueue failure rollback truth | accepted truth without trace/outbox |
| truth + projection stale | 强一致 marker on command / consumer write when an affected public view identity exists | stale marker failure rollback command;consumer may retry | mark stale for undefined / ad hoc view identity |
| command result surface + idempotency complete | 强一致 on accepted command | result save failure rollback truth;complete 后必须可 duplicate replay | completed idempotency pointing to missing result surface |
| outbox publication | 最终一致 | publish failure -> `Failed`;retry -> `Pending`;no truth rollback | publisher failure deleting truth or outbox |
| projection rebuild | 最终一致 from committed truth | rebuild failure -> `Failed`;query exposes failed/stale | projection write modifies truth |
| reference snapshot | 最终一致 from upstream refs | resolver failure -> failed marker / stale old snapshot | external body copied into Work truth |
| idempotency | 强一致 with protected write | incomplete reservation rollback;duplicate returns stored result | duplicate replays domain transition |
| handoff | 最终一致 | handoff failure marker / retry by job | observability/archive body stored as Work truth |
| query surface | 只读一致性 | stale / failed / missing / not visible surface | query repair or writes truth |

#### 8.7 失败恢复口径

| 失败点 | 已提交内容 | 处理方式 | 后续恢复 |
|---|---|---|---|
| domain illegal transition | 无业务写入 | rollback UoW;return domain rejected | caller corrects request |
| repository version conflict | 无新业务写入 | rollback;return `VersionConflict` | caller reloads current version |
| outbox enqueue failure inside command | 无 accepted truth commit | rollback whole command | retry command with same idempotency key |
| projection stale marker failure inside command | 无 accepted truth commit | rollback whole command | retry command;adapter issue fixed |
| command result save failure inside command | 无 accepted truth commit | rollback whole command;do not complete idempotency | retry command with same idempotency key |
| publisher failure after truth committed | truth + outbox pending already committed | mark outbox `Failed` | retry publish via `mark_pending_for_retry` |
| projection rebuild build failure | truth unchanged | mark affected views `Failed`;job report failed | fix builder / data issue, rerun rebuild |
| projection replace failure | truth unchanged;old projection remains | rollback rebuild UoW;mark failed in failure UoW if possible | rerun rebuild |
| reference resolver failure | old snapshot remains | mark reference failed;job failed_refs | retry refresh |
| inbound event unsupported version | no business write | dead-letter / no accepted UoW | design / adapter upgrade |
| idempotency duplicate same digest | previous `ApplicationResultRef` exists | load `StoredCommandResult` via `CommandResultRepository`;overlay duplicate receipt | no new write |
| idempotency duplicate missing result surface | completed idempotency points to missing / wrong result | return `DuplicateResultMissing` -> temporarily unavailable;raise reconciliation | operator repair result store or investigate partial durable failure |
| idempotency conflict different digest | no business write | mark conflict;return conflict | caller changes key |
| UnitOfWork commit failure | adapter-specific unknown | surface `TemporarilyUnavailable`;do not publish side effects outside repository | reconciliation / idempotency audit required by Step 12 / 13 |

#### 8.8 Query consistency and projection surface

| Query type | Read source | Consistency surface | Write permission |
|---|---|---|---|
| Truth facts / trace query | truth repositories + audit repository | `Visible` / `Missing` / `NotVisible` | no write |
| Board / member / iteration views | projection wrapper + freshness state | `Visible` / `Empty` / `Stale` / `Rebuilding` / `Failed` / `NotVisible` | no write |
| Search | `WorkSearchProjection` + page info | stale / failed from freshness state or degraded marker | no write |
| Reconciliation inspection | truth cursor + projection state + outbox state + reference state | report only | no business truth write |

Query services must not open write UoW, must not enqueue outbox, and must not call `ProjectionRepository.mark_stale(...)`, `replace_project_views(...)`, `mark_rebuilding(...)`, or `mark_failed(...)`.

#### 8.9 Cursor, version and page token separation

| Type | Meaning | May be used for optimistic lock | May be exposed to public query |
|---|---|---|---|
| `Version` | per-record concurrency version | yes | only if explicit view DTO includes version |
| `WorkTruthCursor` | committed Work truth / rebuild source position | no | as projection marker / reconciliation marker |
| `PageToken` | pagination continuation | no | yes through public page DTO |
| `OutboxPublicationRef` | downstream publish result ref | no | only event / job report surface |
| `ApplicationResultRef` | stable result pointer for idempotency duplicate | no | command result / duplicate handling |

Implementation must not compare `WorkTruthCursor` as a record version, and must not use `PageToken` as an ordering truth.

### 9. 前序契约回填记录

本 Step 发现 Step 10 已记录的辅助状态持久化缺口,并以最小范围回填前序中间产物,使 Step 11 的持久化函数可 1:1 落码。

| 回填文件 | 回填内容 | 原因 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | `DerivedWorkViewState.mark_rebuilding(...)`、`mark_failed(...)`;`ReferenceResolutionState.mark_failed(...)`;`WorkOutboxRecord.mark_pending_for_retry(...)`;`ProjectionFailureReason`、`ReferenceFailureReason`、`OutboxRetryReason` | Step 10 状态矩阵需要正式 domain / reason schema |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `ProjectionRepository.mark_rebuilding(...)`、`mark_failed(...)`;`ReferenceSnapshotRepository.mark_reference_failed(...)`;`WorkOutboxRepository.mark_pending_for_retry(...)` | Step 11 需要 repository write entrypoint |
| `03_ddd_step_09_function_flows.md` | Rebuild flow 明确 mark rebuilding / mark failed;reference refresh failure 明确调用 `mark_reference_failed(...)` | Step 9 flow 与 Step 11 持久化入口对齐 |

### 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“结构化中间产物”“事务边界表”“一致性策略表”和“失败恢复口径”小节。

#### 5.10 数据持久化、事务与一致性契约

L1-work 的持久化设计只锁定逻辑存储契约,不锁定具体数据库产品或 DDL。实现可以使用 SQL table、document collection 或 in-memory adapter,但必须保留本章定义的主键、唯一键、索引、版本、UoW 和一致性语义。

数据分为四类:

| 类型 | 对象 | 一致性口径 |
|---|---|---|
| 业务 truth | Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、PromoteResult、Dependency、Blocker、Iteration、Commitment | 强一致,由 Command flow 在同一 UoW 内成立或 rollback |
| history / trace / outbox | promote / dependency / iteration commitment history、WorkTraceRecord、WorkOutboxRecord | accepted truth 同 UoW 写入;outbox publication 最终一致 |
| reference / snapshot | ReferenceResolutionState、MemberCapabilitySnapshot、MethodDefinitionSnapshot | 最终一致,不得复制外部正文 |
| projection / report / handoff | ProjectBoardView、MemberWorkView、IterationSummaryView、WorkSearchProjection、ReconciliationReport、handoff marker | 只读 / 可重建 / 最终一致,不得反写业务 truth |

写路径必须通过 `UnitOfWork`。所有修改已有 truth / state 的 repository 函数必须使用 optimistic version;version mismatch 映射为 repository version conflict,不得 silent overwrite。所有 Command、Inbound Event Consumer 和 Operations Job 的写入必须先 reserve idempotency key / dedup key,成功路径在同一 UoW 内 complete result ref。

核心 truth Command 的同事务写入顺序为:

```text
IdempotencyRepository.reserve(...)
  -> load truth / snapshot / reference as needed
  -> domain factory / transition
  -> save truth with expected_version
  -> append formally defined history and/or trace
  -> WorkOutboxRepository.enqueue(...)
  -> ProjectionRepository.mark_stale(...) when affected public DerivedWorkViewRef exists
  -> IdempotencyRepository.complete(...)
  -> UnitOfWork.commit()
```

Query 不开启写 UoW,不写 audit,不写 outbox,不触发 projection rebuild。Query 读取 stale / failed / rebuilding projection 时必须返回对应 surface,不能在读路径修复状态。

事件发布、projection rebuild、reference refresh、trace handoff 和 archive handoff 均为最终一致。发布失败只修改 `WorkOutboxRecord.publication_state`;projection rebuild 失败只修改 `DerivedWorkViewState.freshness_state`;reference refresh 失败只修改 `ReferenceResolutionState.resolution_state`;这些失败不得回滚或改写已成立业务 truth。

### 11. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD11-OPEN-001 | 具体 durable database / migration script | 本 Step 不锁产品,只锁逻辑 schema | 需在实施计划或 infra adapter design 中展开 |
| DDD11-OPEN-002 | `projects.owner_ref` 是否全局唯一 | Step 14 固定为 `WorkStoreConfig.project_owner_uniqueness`,默认不启用全局唯一;启用时由 repository unique policy 返回 conflict | 配置设计需给正式默认值和环境覆盖 |
| DDD11-OPEN-003 | durable adapter 是否需要 row lock / compare-and-swap 以外的 lock | Step 14 固定详细设计只要求 atomic reserve / expected version;具体 row lock 产品留给 durable adapter 配置 / 实施计划 | 不阻塞 P0 fake adapter |
| DDD11-OPEN-004 | projection replace 的 atomic scope 是 whole project 还是 projection_set | 当前要求 per project / projection_set atomic | 影响 durable adapter batch write granularity |
| DDD11-OPEN-005 | UnitOfWork commit failure 的 after-commit unknown recovery | Step 13 已补 `IdempotencyRepository.get(...)` 和 commit-status audit 口径;自动修复仍不在 P0 | 需要 Step 16 测试切口覆盖 unknown retry |

### 12. 进入下一步条件

- [x] 数据所有权实现表已覆盖 truth、snapshot、reference、projection、outbox、idempotency 和 handoff marker。
- [x] 表 / collection / projection 契约表已给出逻辑主键、唯一键、关键索引和版本字段。
- [x] Repository 函数表已映射锁 / 事务要求、返回和错误。
- [x] 事务边界表已覆盖 Command、Consumer、Outbound Publish、Operations Job 和 Query。
- [x] 一致性策略表已明确强一致 / 最终一致 / 禁止反写。
- [x] Step 10 暴露的 auxiliary state 持久化缺口已回填到 Step 6 / 7 / 9。
