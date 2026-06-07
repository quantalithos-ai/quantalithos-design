# Step 6. 设计测试场景与用例矩阵

> 本步把 Step 5 的覆盖编号族展开为可执行、可断言、可留证的用例矩阵。本步不定义 fixture、测试数据文件、CI 命令或验收裁决;这些内容分别留给 Step 7、Step 9 和 `06-验收标准.md`。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 6 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §6 测试场景与用例设计 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 用例编号族、证据编号族、FR / BR / AC 覆盖关系 |
| `03-详细设计.md` §7~§15 | 协议、处理流、状态、事务、错误、幂等、配置、观测和最小验证清单 |
| `03_ddd_step_08_protocol_contracts.md` | 18 Command、8 Query、7 Consumer、10 Event、6 Job 的正式协议名和 DTO / response surface |
| `03_ddd_step_09_function_flows.md` | 每个 flow 的加载、校验、状态副作用、UoW 和错误映射 |
| `03_ddd_step_10_state_matrix.md` | 正式状态机、合法转换、非法转换和跨对象副作用 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | UoW、rollback、outbox、trace、projection stale 和 no-write 规则 |
| `03_ddd_step_12_error_recovery.md` / `03_ddd_step_13_concurrency_idempotency.md` | 错误恢复、幂等、并发、commit unknown 和重入保护 |
| `04-配置设计.md` §6~§12 | profile、配置项、敏感配置、加载校验、失败模式和下游测试承接 |
| `测试方案讨论流程_SOP.md` Step 6 | 本步问题、期望表格和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 每个 P0 正向主线怎么执行? | 按 `CORE`、`MEMBER`、`FORMAL`、`PROMOTE`、`DEP`、`ITER`、`QUERY`、`OPS`、`CFG`、`NFR` 十个用例族展开;每个正向用例都指定入口、前置条件、输入 / 操作、预期结果和断言点。 |
| 每个关键反向和边界场景如何触发? | 在同一族内保留 reject / not visible / unresolved / dead-letter / failed marker / fail-fast 场景,不用“人工确认”替代自动化。 |
| 每个状态非法迁移如何断言? | 统一断言 `DomainError::InvalidStateTransition` 经 application 映射为 `ApplicationError::DomainRejected`,handler surface 为 `WorkProtocolError::DomainRejected`,且不写 truth、outbox 或 projection stale marker。 |
| 每个事务回滚和副作用如何验证? | 写路径断言 Project / Work / dependency / iteration truth、trace、audit、outbox、projection stale、command result save、idempotency complete 同 UoW;失败路径断言 rollback 后无 accepted truth / trace / outbox。 |
| 每个恢复场景如何复现? | 通过 duplicate request、same key different digest、publisher failure、resolver failure、projection rebuild failure、handoff failure、commit unknown 查询幂等记录和 job rerun 复现。 |
| 每个用例预期结果引用了哪些正式字段、状态、错误或事件? | 用例矩阵中的预期结果和断言点只引用 `ProjectLifecycleState`、`WorkItemState`、`PromoteResultState`、`DerivedFreshnessState`、`ReferenceResolutionStatus`、`OutboxPublicationState`、`ApplicationError::*`、`WorkProtocolError::*` 和正式 outbound event 名。 |
| 是否存在把后续 phase 状态或证据提前写入当前用例的问题? | 不提前写 production-like、config center、admin override、hot reload、secret provider、真实 MQ / durable store、外围增强 `FR-WORK-E01`~`E05` 或 `06` 的验收裁决。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧用例不能覆盖新版 18 Command、8 Query、7 Consumer、10 Event、6 Job 和配置矩阵 | 本步重新生成新版用例矩阵,不直接修改正式文档 |
| Step 5 | 只有覆盖族和证据族,没有执行步骤和断言点 | 本步把 `TC-WORK-*` 展开为可执行骨架 |
| `03-详细设计.md` §15 | 最小验证清单是切口级,不是用例级 | 本步把切口落到 `TC-WORK-*` |
| `04-配置设计.md` §12 | 已列配置测试承接,但还没有统一用例 ID | 本步用 `CFG` 和 `NFR` 族承接 profile、loader、sensitive、adapter、replay 和 no hot reload |

## 5. 改动前后对比

| 维度 | Step 5 后 | Step 6 收敛后 |
|---|---|---|
| 覆盖粒度 | FR / BR / AC 到场景族 | 场景族到可执行用例 |
| 断言面 | 证据编号族 | 每个 P0 用例都有字段 / 状态 / 错误 / 事件断言 |
| 反向场景 | 规则族说明 | reject、rollback、dead-letter、failed marker、not visible、fail-fast 场景进入矩阵 |
| 恢复场景 | 只在专项族保留 | duplicate、conflict、publisher failure、resolver failure、projection failure、handoff rerun 进入用例 |
| 上游影响 | 无 | 无;本步不新增协议、字段、状态或配置项 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 每个协议入口只写一个 happy path | 简洁 | 不能满足 reject / duplicate / rollback 最小验证 | 不采用 |
| 方案 B: 为每个 FR / BR / AC 单独写完整用例 | 追溯最细 | 用例爆炸,大量重复准备数据 | 不采用 |
| 方案 C: 以 Step 5 的编号族为主,每族覆盖正向、反向、状态、事务和证据;consumer / event 作为既有用例的断言矩阵 | 覆盖闭合且编号稳定 | Step 7 需要继续补 fixture 细节 | 采用 |

采用方案 C。

原因:

- `TC-WORK-*` 编号族已经和 `EV-WORK-*` 证据族对齐,不需要引入新的平行编号体系。
- Consumer 和 outbound event 是主业务流、job 或投影流的副作用 / 输入边界,适合在断言矩阵中明确覆盖到既有用例。
- 本步只需要可执行骨架,不应提前规定 fixture 文件、测试函数名、CI 阶段或验收 pass / fail 裁决。

## 7. 结构化中间产物

### 7.1 Command 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| `TC-WORK-CORE-001` | 显式创建 Project 和 Backlog | P0 | actor 合法;`CommandMetadata.request.idempotency_key` 存在;project id 未复用 | 调用 `CreateProject` | `Project.lifecycle_state = ProjectLifecycleState::Active`;`Backlog.backlog_state = BacklogState::Open`;enqueue `ProjectChanged` | Project、Backlog、`WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、derived views `Stale`、command result save、idempotency complete 同 UoW | 是 |
| `TC-WORK-CORE-002` | 隐式创建 Project 被拒绝 | P0 | 仅存在外部 owner / query ref,本地无 Project truth | 通过 Query 或相邻 ref 访问不存在 project,不调用 `CreateProject` | 返回 `Missing` 或 `NotFound`;不创建 Project / Backlog | ProjectRepository、BacklogRepository、outbox、trace 均无新增;不产生 `ProjectChanged` | 是 |
| `TC-WORK-CORE-003` | Project lifecycle 关闭和归档 | P0 | Project `Active` 或 `Closed`;Backlog `Open`;expected version 正确 | 调用 `UpdateProjectLifecycle` 到 `Closed` / `Archived` | Project lifecycle 转换;archive path 联动 Backlog `Archived`;enqueue `ProjectChanged` | `ProjectLifecycleState::Closed / Archived`;`BacklogState::Archived`;projection stale;version 匹配 | 是 |
| `TC-WORK-CORE-004` | CreateProject 幂等 duplicate | P0 | `TC-WORK-CORE-001` 已完成;保存 idempotency record 和 command result surface | 同 operation、same key、same digest 重放 `CreateProject` | 通过 `CommandResultRepository.get_result` 返回既有 `ProjectCommandResult` / `ApplicationResultRef`;receipt 标记 duplicate | 无新 Project、Backlog、trace、audit、outbox;idempotency duplicate 日志可见 | 是 |
| `TC-WORK-MEMBER-001` | AssignProjectMember 成功 | P0 | Project `Active`;identity member 可解析;capability snapshot 支持 responsibility spec | 调用 `AssignProjectMember` | 保存 `ProjectMember`;responsibility 为 `Proposed` 或 `Active`;enqueue `ProjectMemberChanged` | `ProjectMember.member_ref` 不等于 `ProjectMemberRef`;snapshot ref 保存;member / project views stale | 是 |
| `TC-WORK-MEMBER-002` | identity resolver unavailable / unresolved | P0 | Project 存在;identity adapter 返回 unresolved 或 unavailable | 调用 `AssignProjectMember` | 返回 `ExternalReferenceUnresolved` 或 retry surface;不保存 accepted member truth | 无 `ProjectMemberChanged`;无业务 trace / outbox;resolver failure metric 可见 | 是 |
| `TC-WORK-MEMBER-003` | 拒绝接管 identity truth / body | P0 | 输入包含 GlobalMemberRef 以外的 identity 正文或企图改 identity 生命周期 | 调用 `AssignProjectMember` 或 consumer contract | `WorkTruthPolicy` reject;不保存 identity body | `MemberCapabilitySnapshot` 只含 safe capability refs;log / audit / report 无 raw identity body | 是 |
| `TC-WORK-MEMBER-004` | Released 后恢复责任被拒绝 | P0 | ProjectMember `Released` | 调用 `UpdateProjectMemberResponsibility` 到 `Active` | `DomainError::InvalidStateTransition` -> `ApplicationError::DomainRejected` | member version 不变;无 trace、outbox、projection stale | 是 |
| `TC-WORK-FORMAL-001` | 创建正式 WorkItem | P0 | Project `Active`;Backlog `Open`;assignee policy 通过;source ref 可解析 | 调用 `CreateWorkItem` | `WorkItem.work_state = WorkItemState::Formalized`;加入 Backlog membership;enqueue `WorkItemChanged` | Work truth、source ref、trace、audit、outbox、board/search/member views stale | 是 |
| `TC-WORK-FORMAL-002` | conversation / runtime / process 直写 Work truth 被拒绝 | P0 | 相邻仓事件或 ref 存在;未调用 Work command | 尝试通过 external event 直接创建 / 修改 WorkItem | 不创建 `WorkItem` / `ChildWorkItem`;只允许 reference state、pending intake 或 stale marker | 无 `WorkItemChanged`;无 external body;consumer disposition 合法 | 是 |
| `TC-WORK-FORMAL-003` | Backlog maintenance lock 拒绝新增 WorkItem | P0 | Backlog `LockedForMaintenance` | 调用 `CreateWorkItem` | 返回 `ApplicationError::DomainRejected` | 无 WorkItem、membership、trace、outbox;Backlog version 不被错误推进 | 是 |
| `TC-WORK-FORMAL-004` | forbidden body absent | P0 | source resolver 返回 source summary / evidence ref | 调用 `CreateWorkItem`、`CreateChildWorkItem` 或 query / event schema 检查 | Work truth 和 event 只保存 ref / digest / summary,不保存 source body | Repository dump、`WorkItemChanged`、audit、report 中无 raw payload / ImplementationPlan body | 是 |
| `TC-WORK-FORMAL-005` | ChildWorkItem 创建与非法 parent | P0 | root WorkItem `Formalized`;另有 child 或 terminal work 作为非法 parent | 调用 `CreateChildWorkItem` | root parent 成功生成 `ChildWorkItem` `Formalized`;child / terminal parent 返回 reject | `WorkItemChanged`;parent ref 正确;非法 parent 无 truth / outbox | 是 |
| `TC-WORK-PROMOTE-001` | 请求 Work promotion | P0 | source ref 可追溯;reason / actor 存在;无 open duplicate promote | 调用 `RequestWorkPromotion` | `PromoteResult.result_state = PromoteResultState::PendingReview`;enqueue `PromoteResultRecorded` | source ref、reason、trace、audit、outbox、projection stale;不创建 Work truth | 是 |
| `TC-WORK-PROMOTE-002` | ReviewWorkPromotion accept | P0 | PromoteResult `PendingReview`;accepted work intent 合法 | 调用 `ReviewWorkPromotion` accept | `PromoteResultState::Accepted`;accept path 创建或绑定 `WorkItemState::Formalized` | promote decision record、optional WorkItem、`PromoteResultRecorded`、optional `WorkItemChanged` 同 UoW | 是 |
| `TC-WORK-PROMOTE-003` | ReviewWorkPromotion reject | P0 | PromoteResult `PendingReview`;reject reason 存在 | 调用 `ReviewWorkPromotion` reject | `PromoteResultState::Rejected`;不创建 WorkItem | decision record、`PromoteResultRecorded`;无 Work truth 新增 | 是 |
| `TC-WORK-PROMOTE-004` | runtime / ImplementationPlan 正文拒绝 | P0 | runtime promote source resolver 返回正文或 ImplementationPlan body | 调用 `RequestWorkPromotion` 或消费 runtime promote event | reject / unresolved / pending intake;不保存正文 | `WorkTruthPolicy::assert_no_external_body`;audit / report / outbox 无 raw runtime body | 是 |
| `TC-WORK-PROMOTE-005` | 并发 review 版本冲突 | P0 | 同一 PromoteResult `PendingReview`;两个 expected version | 并发调用 accept / reject | 只有一个成功;另一个 `VersionConflict` | losing path 无 trace / outbox / WorkItem;idempotency 不误判为 duplicate | 是 |
| `TC-WORK-DEP-001` | LinkWorkDependency 成功 | P0 | upstream / downstream 都是 formal work;graph 无环 | 调用 `LinkWorkDependency` | `DependencyState::Proposed` 或 `Active`;enqueue `WorkDependencyChanged` | dependency edge、history、trace、audit、outbox、projection stale | 是 |
| `TC-WORK-DEP-002` | dependency cycle reject | P0 | 现有 graph 中新增 edge 会形成环 | 调用 `LinkWorkDependency` | `DomainRejected` | 无 dependency、history、trace、outbox;cycle diagnostics 不进入 outbound payload | 是 |
| `TC-WORK-DEP-003` | UpdateWorkDependencyState | P0 | 一组 Dependency `Proposed`;一组 Dependency `Active`;evidence 或 change reason 合法 | 调用 `UpdateWorkDependencyState` 到 `Active` / `Satisfied` / `Waived` / `Cancelled` | `Proposed -> Active` 和 `Active -> terminal` 转换;enqueue `WorkDependencyChanged` | `Active` 要求 `DependencyChangeReasonKind::Activated`;`Satisfied` 要求 verified evidence;reason kind mismatch reject;terminal 后不能 reopen | 是 |
| `TC-WORK-DEP-004` | OpenWorkBlocker 成功 | P0 | blocked formal work 存在;cause ref 可追溯 | 调用 `OpenWorkBlocker` | `BlockerState::Open`;enqueue `WorkBlockerChanged` | blocker ref、cause ref、history、trace、outbox、projection stale | 是 |
| `TC-WORK-DEP-005` | ResolveWorkBlocker 与 evidence reject | P0 | Blocker `Open`;一组 verified evidence 和一组 missing / rejected evidence | 调用 `ResolveWorkBlocker` | verified evidence -> `BlockerState::Resolved` 且 `resolved_evidence_ref = Some(evidence_ref)`;missing / rejected -> `InvalidRequest` / `ExternalReferenceUnresolved` | success enqueue `WorkBlockerChanged`,event evidence from blocker truth;failure 无 truth / outbox;no evidence body | 是 |
| `TC-WORK-ITER-001` | OpenIteration 成功 | P0 | Project 可接受 iteration;process timebox ref 可追溯 | 调用 `OpenIteration` | `IterationState::Planning`;enqueue `IterationChanged` | timebox ref 只作为外部 ref;不改 process truth;projection stale | 是 |
| `TC-WORK-ITER-002` | CommitIterationScope 成功 | P0 | Iteration `Planning`;candidate work 均 `Formalized`;dependency gate 通过 | 调用 `CommitIterationScope` | `IterationState::Committed`;`CommitmentState::Committed`;work `Committed` | iteration、commitment、work marks、history、trace、outbox 同 UoW | 是 |
| `TC-WORK-ITER-003` | 非 formal candidate 拒绝 commit | P0 | candidate 中包含不存在、terminal 或非 formal work | 调用 `CommitIterationScope` | `ApplicationError::DomainRejected` 或 `InvalidRequest` | Iteration 仍 `Planning`;无 commitment、work mark、outbox | 是 |
| `TC-WORK-ITER-004` | UpdateIterationCommitment 成功 | P0 | Iteration 已有 `CommitmentState::Committed`;change set 合法 | 调用 `UpdateIterationCommitment` | `CommitmentState::Changed`;enqueue `IterationChanged` | commitment change record、projection stale、version 匹配 | 是 |
| `TC-WORK-ITER-005` | Iteration close / cancel 与非法 closed -> in_progress | P0 | Iteration `Committed` / `InProgress` / `Closed` | 调用 `UpdateIterationLifecycle` close、cancel 和非法 reopen | close path -> `IterationState::Closed`,commitment `Closed`;非法 reopen -> `DomainRejected` | `IterationChanged`;非法路径无 truth / outbox / stale marker | 是 |

### 7.2 Query 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| `TC-WORK-QUERY-001` | GetProjectWorkFacts hit / missing / not visible | P0 | 一个 visible project、一个 missing project、一个 unauthorized consumer | 调用 `GetProjectWorkFacts` | visible 返回 `ProjectWorkFactsView`;missing -> `Missing`;unauthorized -> `NotVisible` | Query no-write;不写 audit、outbox、idempotency、freshness marker | 是 |
| `TC-WORK-QUERY-002` | GetBacklog page / empty | P0 | Project + Backlog 存在;一页有 items、一页为空 | 调用 `GetBacklog` with `QueryMetadata.page` | 返回 `BacklogView`;empty page 返回 `Empty` 或 visible empty surface | page token / item refs 正确;query no-write | 是 |
| `TC-WORK-QUERY-003` | GetWorkItem visible / terminal surfaced | P0 | WorkItem / ChildWorkItem 存在;含 terminal state 样本 | 调用 `GetWorkItem` | 返回 `WorkItemView`;terminal state 正常可见;missing / not visible 有稳定 surface | `WorkItemState` 原样暴露为 view 字段;不复制 external body | 是 |
| `TC-WORK-QUERY-004` | ListMemberWork projection stale / failed | P0 | `MemberWorkView` projection 分别为 `Fresh`、`Stale`、`Rebuilding`、`Failed` | 调用 `ListMemberWork` | 返回 projection wrapper 或 stale / rebuilding / failed surface | `DerivedFreshnessState` 保留;不触发 rebuild;page 正确 | 是 |
| `TC-WORK-QUERY-005` | GetIterationSummary projection surface | P0 | Iteration summary projection present / missing / stale | 调用 `GetIterationSummary` | present 返回 summary;missing -> `Missing`;stale marker preserved | 不写 projection state;不自动 repair | 是 |
| `TC-WORK-QUERY-006` | SearchWork criteria / failed projection / no body copy | P0 | search projection prepared;另有 failed projection;criteria 含 `WorkSearchText` | 调用 `SearchWork` | 返回 `WorkSearchResult` 或 `Failed` surface | criteria validation;结果只含 Work refs / safe summary;无 source body | 是 |
| `TC-WORK-QUERY-007` | GetWorkTrace page / empty / not visible | P0 | trace records 存在;另有无 trace subject 和 unauthorized consumer | 调用 `GetWorkTrace` | records page、`Empty` 或 `NotVisible` | page token、trace subject、no-write、无 observability raw body | 是 |
| `TC-WORK-QUERY-008` | GetProjectBoardView board / rebuilding | P0 | board projection Fresh;另有 missing projection state | 调用 `GetProjectBoardView` | Fresh 返回 board;missing projection 返回 `Rebuilding` 或 `Missing` by freshness state | `DerivedFreshnessState` surface;query 不 enqueue `DerivedWorkViewChanged` | 是 |

### 7.3 Consumer / Outbound Event 覆盖矩阵

Consumer 和 outbound event 不新增独立编号族;它们必须被既有 `TC-WORK-*` 用例覆盖并留同族证据。

| 协议对象 | 覆盖用例 | 触发方式 | 预期结果 | 断言点 |
|---|---|---|---|---|
| `ConsumeIdentityMemberChanged` | `TC-WORK-MEMBER-001` / `002` | identity member changed event | 保存 `MemberCapabilitySnapshot` / `ReferenceResolutionState` 或 dead-letter;正式 affected-view 读取面返回既有 public view 时 mark stale | duplicate 不重复 snapshot;missing capability dead-letter;no affected public views 不生成 stale marker |
| `ConsumeMethodDefinitionChanged` | `TC-WORK-FORMAL-002` / `QUERY-006` | method definition changed event | 保存 method snapshot / reference state;正式 affected-view 读取面返回既有 public view 时 mark stale | 不改 Work truth;missing definition dead-letter;no affected public views 不生成 stale marker |
| `ConsumeConversationWorkContextChanged` | `TC-WORK-FORMAL-002` / `PROMOTE-001` | conversation work context event | 保存 source reference / pending source marker | digest mismatch -> unresolved;不创建 Work truth |
| `ConsumeProcessTimingChanged` | `TC-WORK-ITER-001` / `QUERY-005` | process timing event | 保存 timebox reference state;可 mark iteration views stale | 不 open / close Iteration;missing timebox dead-letter |
| `ConsumeGovernanceDecisionChanged` | `TC-WORK-DEP-003` / `DEP-005` | governance decision event | 保存 source / evidence reference state | both missing -> dead-letter;不生成 governance truth |
| `ConsumeArtifactEvidenceChanged` | `TC-WORK-DEP-005` / `FORMAL-004` | artifact evidence event | evidence `Verified` -> resolved;`Rejected` -> stale / failed marker | 不直接 complete work;不保存 evidence body |
| `ConsumeRuntimePromoteRequested` | `TC-WORK-PROMOTE-001` / `PROMOTE-004` | runtime promote requested event | 保存 source reference 和 pending promote intake | 不调用 `PromoteResult::evaluate`;不 enqueue `PromoteResultRecorded` |
| `ProjectChanged` | `TC-WORK-CORE-001` / `003` | Project command enqueue 后 publish | topic `work.project.changed.v1`;payload from Project truth | payload 含 `ProjectLifecycleState`;无 workspace 正文 |
| `BacklogChanged` | `TC-WORK-CORE-003` / `FORMAL-003` | backlog availability command 或 project archive 联动后 publish | topic `work.backlog.changed.v1`;payload from Backlog truth | payload 含 `BacklogRef`、`ProjectRef`、`BacklogState`、`BacklogMaintenanceReason`;无 workspace / process 正文 |
| `ProjectMemberChanged` | `TC-WORK-MEMBER-001` | member command enqueue 后 publish | topic `work.project_member.changed.v1` | payload 含 responsibility state;无 capability body |
| `WorkItemChanged` | `TC-WORK-FORMAL-001` / `ITER-002` | work create / commit / lifecycle enqueue 后 publish | topic `work.formal_work.changed.v1` | payload 含 `FormalWorkRef`、`WorkItemState`、source / evidence ref |
| `PromoteResultRecorded` | `TC-WORK-PROMOTE-001`~`003` | promote command enqueue 后 publish | topic `work.promote_result.recorded.v1` | payload 含 result state、source ref、optional created work ref |
| `WorkDependencyChanged` | `TC-WORK-DEP-001` / `003` | dependency command enqueue 后 publish | topic `work.dependency.changed.v1` | payload 含 upstream / downstream / dependency state;无 cycle diagnostics |
| `WorkBlockerChanged` | `TC-WORK-DEP-004` / `005` | blocker command enqueue 后 publish | topic `work.blocker.changed.v1` | payload 含 blocker ref、state、optional evidence ref from `WorkBlocker.resolved_evidence_ref`;无 evidence body |
| `IterationChanged` | `TC-WORK-ITER-001` / `002` / `005` | iteration command enqueue 后 publish | topic `work.iteration.changed.v1` | payload 含 iteration / commitment refs;无 work body copy |
| `WorkTraceAvailable` | `TC-WORK-OPS-005` / `006` | handoff marker 生成后 optional enqueue | topic `work.trace.available.v1` | payload 只含 trace subject / handoff ref;无 observability body |
| `DerivedWorkViewChanged` | `TC-WORK-OPS-002` | projection rebuild 成功后 optional enqueue | topic `work.derived_view.changed.v1` | payload 含 view ref、freshness、source cursor;无 projection body dump |

### 7.4 Operations Job 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| `TC-WORK-OPS-001` | PublishWorkOutbox success / partial failure | P0 | pending outbox records 存在;publisher 对部分记录返回 failure | 运行 `PublishWorkOutbox` | success -> `OutboxPublicationState::Published`;failure -> `Failed`;report 记录 failed refs | 不改业务 truth;publisher failure 不回滚已提交 command truth | 是 |
| `TC-WORK-OPS-002` | RebuildWorkProjections | P0 | committed truth snapshot 存在;projection set 合法 | 运行 `RebuildWorkProjections` | `DerivedFreshnessState::Rebuilding` -> `Fresh`;optional `DerivedWorkViewChanged` | projection replace 来自 committed truth;不从 projection 反推 truth | 是 |
| `TC-WORK-OPS-003` | RefreshExternalReferenceSnapshots | P0 | stale refs 或 explicit reference scope 存在;resolver 有 success / failure | 运行 `RefreshExternalReferenceSnapshots` | success 更新 snapshot / `ReferenceResolutionStatus`;failure 写 failed / stale marker | failed 保留 last good snapshot;affected views stale | 是 |
| `TC-WORK-OPS-004` | RunWorkReconciliation read-only report | P0 | truth、projection、outbox、reference states 各有 clean / gap 样本 | 运行 `RunWorkReconciliation` | 生成 `ReconciliationReport`;不自动修复 | 无 business truth、projection、outbox publication mutation;report 可解释 gap | 是 |
| `TC-WORK-OPS-005` | PrepareWorkTraceHandoff | P0 | trace records 存在;handoff port success / failure | 运行 `PrepareWorkTraceHandoff` | success 写 handoff marker;failure 写 failed refs;optional `WorkTraceAvailable` | 无 observability raw body;duplicate job 不重复 handoff body | 是 |
| `TC-WORK-OPS-006` | PrepareArchiveHandoff | P0 | archive scope 内有 Work summaries;archive port success / failure | 运行 `PrepareArchiveHandoff` | success 写 archive marker;failure 进入 report | 只传 summary / refs;不写 archive long-term body;idempotent rerun | 是 |

### 7.5 配置 / NFR 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| `TC-WORK-CFG-001` | `local-dev` profile 默认启动 | P0 | 无外部真实依赖 | 使用 defaults 加载 `local-dev` | `WorkRuntimeConfig` 通过 validate;fake / deterministic adapter 可装配 | profile、store、boundary、idempotency、external、outbox、jobs 默认值可判定 | 是 |
| `TC-WORK-CFG-002` | `ci-test` profile deterministic | P0 | CI fixture refs 可用 | 加载 `ci-test` config | deterministic clock / id / fake adapter 行为稳定 | config dump 只显示 key presence / redacted ref;无 secret value | 是 |
| `TC-WORK-CFG-003` | `integration-like` configured refs | P0 | endpoint / credential ref 完整;resolver 可返回 unavailable | 加载 `integration-like` config 并触发 resolver | 配置完整则启动;resolver unavailable 显式 unresolved / failed marker | `ExternalAdapterConfig` ref-only;无 raw credential | 是 |
| `TC-WORK-CFG-004` | `operations-replay` baseline digest | P0 | replay baseline / config digest 存在 | 运行 replay job 启动校验 | digest 匹配可执行;不匹配 fail-fast | 不修 truth;report / log 不泄露历史 raw payload | 是 |
| `TC-WORK-CFG-005` | defaults / JSON / env 优先级 | P0 | defaults、JSON、env 同时提供同一 key | load and validate | 高优先级覆盖低优先级;非法高优先级 fail-fast | 不静默回退低优先级值;记录 source kind 不记录 value | 是 |
| `TC-WORK-CFG-006` | malformed JSON / duplicate key | P0 | malformed config file 或 duplicate key | load config | startup fail-fast | 无 runtime builder 装配;错误报告不含 raw secret | 是 |
| `TC-WORK-CFG-007` | unknown key / alias conflict | P0 | config 含未知 key 或冲突 alias | load config | startup fail-fast | unsupported source / unknown key 可定位;不忽略 | 是 |
| `TC-WORK-CFG-008` | typed validation | P0 | duration、bool、enum、size、page、batch 输入非法 | load config | startup 或 job-run-start fail-fast | `boundary.max_page_limit`、`jobs.default_batch_size`、timeout 均正数且不超上限 | 是 |
| `TC-WORK-CFG-009` | cross-field validation | P0 | retry / timeout / retention 组合非法 | load config 或 run job | fail-fast | `reserved_record_max_age <= command_retention`;`max_delay >= base_delay`;retry window 可解释 | 是 |
| `TC-WORK-CFG-010` | raw secret / token reject | P0 | JSON / env 中出现 raw credential material | load config | startup fail-fast | config object、diagnostics、log、audit、report 无 raw secret | 是 |
| `TC-WORK-CFG-011` | raw payload / source body reject | P0 | source body / provider response body 出现在 config 或 report | load / execute boundary scan | reject 或 gate fail | forbidden output scan 命中阻断;只允许 ref / digest / summary | 是 |
| `TC-WORK-CFG-012` | redacted output gate | P0 | sensitive refs 存在;执行 command、job、report | 收集 log / audit / report / artifact | 只出现 redacted ref / key presence | 无 full env value、raw JSON sensitive value、raw payload | 是 |
| `TC-WORK-CFG-013` | configured adapter ref 缺失 | P0 | external / outbox / handoff adapter_kind configured,但 endpoint / credential ref 缺失 | load config | startup fail-fast | `ExternalAdapterConfig` 条件必填;runtime 不半装配 | 是 |
| `TC-WORK-CFG-014` | resolver unavailable marker | P0 | configured resolver 启动成功,运行时 unavailable | 调用 member / source / evidence / timebox flow | 显式 unresolved / failed marker,不造外部 truth | `ReferenceResolutionStatus` 或 command reject surface 正确 | 是 |
| `TC-WORK-CFG-015` | outbox publisher failure marker | P0 | outbox.publisher configured;publisher failure | 运行 `PublishWorkOutbox` | `OutboxPublicationState::Failed`;report failed refs | 不回滚 business truth;可重试 | 是 |
| `TC-WORK-CFG-016` | handoff target failure marker | P0 | trace / archive handoff target configured;port failure | 运行 handoff job | failed marker / failed report | 不保存 external body;duplicate rerun 幂等 | 是 |
| `TC-WORK-CFG-017` | unsupported config center / hot reload | P0 | config 声明 config center、admin override、hot reload 或 last-known-good 自动吞错 | startup 或 reload request | P0 unsupported fail-fast / reject;当前 runtime 不变 | no config center、no admin override、no core hot reload、no last-known-good | 是 |
| `TC-WORK-NFR-001` | 性能专项候选 | P1 输入 / Step 10 细化 | 核心 P0 用例有稳定 fixture | 采集 command / query / job 耗时样本 | 当前不设硬阈值;输出 Step 10 专项输入 | 不把旧性能数字写成 P0 验收硬门槛 | 是,专项 |
| `TC-WORK-NFR-002` | 可用性 / degraded surface | P0 | resolver / projection / publisher / handoff failure 样本 | 触发 failure path | core truth closure 不被外部失败破坏;query / job surface 可解释 | `TemporarilyUnavailable`、`Failed`、`Stale`、failed marker | 是 |
| `TC-WORK-NFR-003` | 安全与权限 | P0 | authorized / unauthorized consumer;forbidden body 样本 | 调用 command / query / job | unauthorized -> `NotVisible` / reject;forbidden output gate pass | 无 raw secret、raw token、raw payload、source body | 是 |
| `TC-WORK-NFR-004` | 幂等与一致性专项 | P0 | same key same digest / different digest / version conflict / commit unknown | 执行 command、consumer、job rerun | duplicate replay result;conflict reject;commit unknown 先查 idempotency | 无重复 truth / trace / outbox;`IdempotencyConflict` surface | 是 |
| `TC-WORK-NFR-005` | 可观测性字段边界 | P0 | accepted / rejected / failed / duplicate 场景 | 收集 structured log / metric / audit | low-cardinality metric;safe log;trace context 可关联 | 日志不含 secret / body;accepted truth change 有 trace / audit / outbox | 是 |

### 7.6 状态非法迁移用例表

| 状态机 | 覆盖用例 | 非法触发 | 预期错误 | 副作用断言 |
|---|---|---|---|---|
| `ProjectLifecycleState` | `TC-WORK-CORE-003` | `Archived -> Active` | `DomainError::InvalidStateTransition` -> `ApplicationError::DomainRejected` | Project / Backlog version 不变;无 `ProjectChanged` |
| `ProjectMemberResponsibilityState` | `TC-WORK-MEMBER-004` | `Released -> Active` | 同上 | member 不变;无 `ProjectMemberChanged` |
| `BacklogState` | `TC-WORK-FORMAL-003` | `Archived -> Open` 或 locked 时 create work | 同上 | 无 WorkItem / membership / outbox |
| `WorkItemState` | `TC-WORK-FORMAL-005` / `ITER-003` | terminal work 作为 child parent 或 candidate | 同上 | 无 child work / commitment |
| `PromoteResultState` | `TC-WORK-PROMOTE-005` | accepted / rejected 后重复 review 使用旧 version | `VersionConflict` 或 `DomainRejected` | losing path 无 WorkItem / outbox |
| `DependencyState` | `TC-WORK-DEP-003` | terminal dependency reopen | `DomainRejected` | dependency history 不追加 |
| `BlockerState` | `TC-WORK-DEP-005` | resolved blocker 再 resolve | `DomainRejected` | blocker history 不追加 |
| `IterationState` | `TC-WORK-ITER-005` | `Closed -> InProgress` | `DomainRejected` | iteration / commitment 不变;无 `IterationChanged` |
| `CommitmentState` | `TC-WORK-ITER-004` | `Closed -> Changed` | `DomainRejected` | commitment 不变;无 projection stale |
| `DerivedFreshnessState` | `TC-WORK-QUERY-004` / `OPS-002` | Query 试图 repair stale / failed projection | 不适用,应只返回 surface | query no-write;只 job 可写 freshness |
| `ReferenceResolutionStatus` | `TC-WORK-OPS-003` | refresh failure 覆盖 last good snapshot | failed marker,不覆盖 last good | last successful snapshot 保留 |
| `OutboxPublicationState` | `TC-WORK-OPS-001` | `Published -> Pending` by stale publisher | version conflict / no-op | 不改 business truth;不重复 publish 成功记录 |

说明:

- `BlockerState::Mitigating` / `Closed` 和 `PromoteResultState::Superseded` 是详细设计中的 domain state,但当前 Step 8 / Step 9 P0 public protocol 没有显式开放对应写入口。本步不把它们写成 public command 用例;若实施计划开放这些入口,需先回写协议和 flow。

### 7.7 事务 / 幂等 / 并发 / 恢复用例表

| 测试用例 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据 ID |
|---|---|---|---|---|
| `TC-WORK-CORE-004` | `IdempotencyRepository.reserve / complete / get` + `CommandResultRepository.get_result` | same key same digest 返回既有 `ApplicationResultRef` / result surface;无新 truth / trace / outbox | duplicate request | `EV-WORK-CORE-004` |
| `TC-WORK-NFR-004` | same key different digest conflict | `IdempotencyConflict`;idempotency conflict marker / safe log | key reuse with changed request | `EV-WORK-NFR-004` |
| `TC-WORK-PROMOTE-005` | optimistic `Version` | losing request 返回 `VersionConflict` | concurrent accept / reject | `EV-WORK-PROMOTE-005` |
| `TC-WORK-ITER-002` | same UoW multi-object write | Iteration、Commitment、Work marks、outbox、trace、idempotency complete 一起提交 | dependency gate failure | `EV-WORK-ITER-002` |
| `TC-WORK-DEP-002` | domain reject rollback | no dependency history;no outbox | cycle detected | `EV-WORK-DEP-002` |
| `TC-WORK-OPS-001` | publisher failure recovery | `OutboxPublicationState::Failed`;retry 后单条 marker 更新 | bus publish fail | `EV-WORK-OPS-001` |
| `TC-WORK-OPS-002` | projection rebuild recovery | `DerivedFreshnessState::Failed` 后 retry -> `Rebuilding` / `Fresh` | projection build failure | `EV-WORK-OPS-002` |
| `TC-WORK-OPS-003` | reference refresh recovery | failed marker 保留 last good snapshot | resolver failure / version conflict | `EV-WORK-OPS-003` |
| `TC-WORK-OPS-005` / `006` | handoff rerun idempotent | duplicate job 通过 `JobResultRepository.get_report` 返回 existing report / marker | external handoff timeout | `EV-WORK-OPS-005` / `006` |
| `TC-WORK-NFR-004` | commit unknown recovery | retry 前调用 `IdempotencyRepository.get(key, operation)` | UoW commit status unknown | `EV-WORK-NFR-004` |

### 7.8 用例到设计契约断言矩阵

| 测试用例 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据 ID |
|---|---|---|---|---|
| `TC-WORK-CORE-001`~`004` | `CreateProjectFlow`、`UpdateProjectLifecycleFlow`、`ProjectLifecycleState`、`BacklogState` | `Project.lifecycle_state`;`Backlog.backlog_state`;`ProjectChanged`;idempotency result | implicit create、duplicate、archive conflict | `EV-WORK-CORE-001`~`004` |
| `TC-WORK-MEMBER-001`~`004` | `AssignProjectMemberFlow`、`UpdateProjectMemberResponsibilityFlow`、`ProjectMemberResponsibilityState` | `ProjectMember.responsibility_state`;snapshot ref;`ProjectMemberChanged` | resolver unavailable、identity body、released resume | `EV-WORK-MEMBER-001`~`004` |
| `TC-WORK-FORMAL-001`~`005` | `CreateWorkItemFlow`、`CreateChildWorkItemFlow`、`WorkItemState`、`WorkTruthPolicy` | `work_state = Formalized`;Backlog membership;`WorkItemChanged` | direct external write、locked backlog、forbidden body、invalid parent | `EV-WORK-FORMAL-001`~`005` |
| `TC-WORK-PROMOTE-001`~`005` | `RequestWorkPromotionFlow`、`ReviewWorkPromotionFlow`、`PromoteResultState` | `PendingReview` / `Accepted` / `Rejected`;optional WorkItem;`PromoteResultRecorded` | runtime body、missing intent、version conflict | `EV-WORK-PROMOTE-001`~`005` |
| `TC-WORK-DEP-001`~`005` | dependency / blocker flows、`DependencyState`、`BlockerState` | dependency edge / blocker state / evidence ref / outbox | cycle、missing evidence、terminal reopen | `EV-WORK-DEP-001`~`005` |
| `TC-WORK-ITER-001`~`005` | iteration flows、`IterationState`、`CommitmentState`、`WorkItemState::Committed` | iteration / commitment / work marks same UoW;`IterationChanged` | non-formal candidate、closed reopen、version conflict | `EV-WORK-ITER-001`~`005` |
| `TC-WORK-QUERY-001`~`008` | Query flow、query response surface、no-write rule | `Missing`、`NotVisible`、`Empty`、`Stale`、`Rebuilding`、`Failed`;no audit / outbox | unauthorized、missing projection、failed projection | `EV-WORK-QUERY-001`~`008` |
| `TC-WORK-OPS-001`~`006` | job flows、outbox / projection / reference / reconciliation / handoff contracts | `OutboxPublicationState`;`DerivedFreshnessState`;`ReferenceResolutionStatus`;job report | publish failure、resolver failure、handoff failure、duplicate job | `EV-WORK-OPS-001`~`006` |
| `TC-WORK-CFG-001`~`017` | `WorkRuntimeConfig`、profile、loader、validation、sensitive boundary | profile、config source、ref-only sensitive、fail-fast / failed marker | malformed config、raw secret、unsupported hot reload | `EV-WORK-CFG-001`~`017` |
| `TC-WORK-NFR-001`~`005` | non-functional cuts、security、availability、idempotency、observability | degraded surface、safe log、metric、trace context、idempotency audit | performance hard threshold premature、secret leak、duplicate side effects | `EV-WORK-NFR-001`~`005` |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 5 覆盖族可以展开为 P0 可执行用例矩阵 | 否 | 测试设计细化,无设计契约变化 | 无 | 无回写 |
| Consumer / outbound event 使用既有用例承接,不新增新的顶层编号族 | 否 | 编号稳定性处理,不改变协议 | 无 | 无回写 |
| `BlockerState::Mitigating` / `Closed` 和 `PromoteResultState::Superseded` 不作为当前 public command 用例 | 否 | 遵守 Step 8 / Step 9 当前协议边界 | 无 | 无回写 |
| `TC-WORK-NFR-001` 只作为 Step 10 性能专项候选,不提前设硬阈值 | 否 | 测试专项承接,不改变验收 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果 Step 7 在设计 fixture 时发现某个用例缺少正式字段、状态、错误、event 或配置 schema,必须先记录为上游待回写或阻塞待确认。
```

## 9. 回填草稿

正式 `05-测试方案.md` §6 建议采用以下结构:

```text
6. 测试场景与用例设计
  6.1 用例设计原则
  6.2 Command 用例矩阵
  6.3 Query 用例矩阵
  6.4 Consumer / Outbound Event 覆盖矩阵
  6.5 Operations Job 用例矩阵
  6.6 配置 / NFR 用例矩阵
  6.7 状态非法迁移用例表
  6.8 事务 / 幂等 / 并发 / 恢复用例表
  6.9 用例到设计契约断言矩阵
  6.10 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §6.1 | 本中间产物 §3 / §6 |
| §6.2 | 本中间产物 §7.1 |
| §6.3 | 本中间产物 §7.2 |
| §6.4 | 本中间产物 §7.3 |
| §6.5 | 本中间产物 §7.4 |
| §6.6 | 本中间产物 §7.5 |
| §6.7 | 本中间产物 §7.6 |
| §6.8 | 本中间产物 §7.7 |
| §6.9 | 本中间产物 §7.8 |
| §6.10 | 本中间产物 §8 |

## 10. 待确认事项

无阻塞进入 Step 7 的待确认事项。

后续 Step 必须继续收口:

- Step 7 为每个 P0 用例设计 fixture、builder、fake adapter seed、状态隔离和清理规则。
- Step 8 把 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 映射到测试环境与配置矩阵。
- Step 9 把本步自动化候选落到 CI / release gate 层级。
- Step 10 判断 `TC-WORK-NFR-001` 是否形成性能专项硬阈值。
- Step 13 把 `EV-WORK-*` 证据 ID 落到测试报告和归档规则。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例可执行 | 通过 | 每个 P0 用例都有前置条件、输入 / 操作和预期结果 |
| P0 用例可断言 | 通过 | 每个 P0 用例都有正式字段 / 状态 / 错误 / event 断言 |
| P0 用例可留证 | 通过 | 每个用例映射到 `EV-WORK-*` 证据编号族 |
| 关键反向和边界场景覆盖 | 通过 | reject、dead-letter、failed marker、not visible、fail-fast、rollback 均进入矩阵 |
| 未提前写后续 phase 状态或证据 | 通过 | 未写 production-like、config center、hot reload、secret provider、验收裁决或外围增强硬覆盖 |
