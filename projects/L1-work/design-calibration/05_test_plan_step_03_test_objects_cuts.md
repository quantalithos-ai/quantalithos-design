# Step 3. 抽取测试对象与测试切口

> 本步从概要设计和详细设计中抽取 `L1-work` 必须验证的测试对象与测试切口。本步不分配正式用例 ID、不设计测试数据、不定义 CI 门禁;这些内容分别留给 Step 6、Step 7 和 Step 9。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 3 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §3 测试对象与测试切口 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 确认新版 `00/01/02/03/04` 为测试主输入 |
| `05_test_plan_step_02_scope.md` | 确认 P0 / P1 / P2 测试范围和非范围 |
| `00-需求文档.md` §7 / §9 / §10 / §11 / §13 / §14 | 核心闭环、功能需求、业务规则、数据归属、非功能和验收方向 |
| `02-概要设计.md` §5 / §6 / §7 / §8 / §9 / §10 | 主要组成部分、关键对象、接口骨架、处理流、状态和异常边界 |
| `03-详细设计.md` §5 / §6 / §7 / §8 / §9 / §10 / §11 / §12 / §13 / §14 / §15 | 模块、对象、协议、flow、状态、事务、错误、幂等、配置和最小验证清单 |
| `04-配置设计.md` §6 / §7 / §8 / §9 / §11 / §12 | profile、配置项、敏感配置、加载校验、失效策略和测试承接 |
| `测试方案讨论流程_SOP.md` Step 3 | 本步问题、期望产物和进入下一步条件 |

## 3. SOP 问题回答

### 3.1 哪些 domain object / value object / policy 必须单测?

| 类型 | 必测对象 | 主要切口 |
|---|---|---|
| truth object | `Project`、`ProjectMember`、`Backlog`、`WorkItem`、`ChildWorkItem`、`WorkDependency`、`WorkBlocker`、`Iteration`、`IterationCommitment`、`PromoteResult` | 构造、字段不变量、合法状态迁移、非法状态迁移、终态保护 |
| history / trace / outbox | `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、`PromoteDecisionRecord`、`DependencyChangeRecord`、`IterationChangeRecord` | 只能从 accepted truth change 形成;不得保存外部正文 |
| reference / snapshot | `MemberCapabilitySnapshot`、`MethodDefinitionSnapshot`、`ReferenceResolutionState`、`PendingPromoteIntake` | ref / snapshot / marker 边界;unresolved / failed 不补造外部 truth |
| projection support | `DerivedWorkViewState`、`ProjectBoardView`、`MemberWorkView`、`IterationSummaryView`、`WorkSearchProjection`、`ReconciliationReport` | 派生只读、stale / rebuilding / failed surface、rebuild 不反写真相 |
| policy | `WorkTruthPolicy`、`ProjectLifecyclePolicy`、`MemberResponsibilityPolicy`、`FormalWorkPolicy`、`BacklogAvailabilityPolicy`、`PromotePolicy`、`DependencyGraphPolicy`、`IterationCommitmentPolicy`、`CompletionEvidencePolicy`、`DerivedWorkViewPolicy` | accept / reject、边界外输入、forbidden body、completion evidence、dependency cycle、iteration scope |
| value object / DTO helper | typed id / ref、state / target / reason、Job scope、handoff target、public DTO 传递类型 | 构造、反序列化、字段缺失、引用混同、domain-only 类型不得暴露到 public DTO |

### 3.2 哪些 application service 必须做 service test?

| Service | 覆盖入口 | 主要切口 |
|---|---|---|
| `ProjectCommandService` | `CreateProject`、`UpdateProjectLifecycle`、`UpdateBacklogAvailability` | project + backlog 同 UoW、lifecycle、backlog maintenance、outbox rollback |
| `ProjectMemberCommandService` | `AssignProjectMember`、`UpdateProjectMemberResponsibility` | GlobalMemberRef / snapshot、responsibility 状态、identity 边界 |
| `WorkItemCommandService` | `CreateWorkItem`、`CreateChildWorkItem`、`UpdateWorkItemLifecycle` | formal work 边界、child boundary、completion evidence、terminal reject |
| `PromoteCommandService` | `RequestWorkPromotion`、`ReviewWorkPromotion` | pending promote、accept / reject、可选创建 WorkItem / ChildWorkItem、source ref only |
| `DependencyBlockerService` | `LinkWorkDependency`、`UpdateWorkDependencyState`、`OpenWorkBlocker`、`ResolveWorkBlocker` | dependency cycle、blocker evidence、history、version conflict |
| `IterationCommandService` | `OpenIteration`、`CommitIterationScope`、`UpdateIterationCommitment`、`UpdateIterationLifecycle` | process timebox ref、candidate scope、commitment freeze / change / close |
| `AuthorizedWorkQueryService` | 8 个 Query | authorization、not visible、stale / failed projection surface、query no-write |
| `WorkDerivedMaintenanceService` | 7 个 Consumer、6 个 Job 的 application orchestration | dedup、dead-letter、snapshot / reference marker、partial failure、rerun |

### 3.3 哪些 repository / adapter / worker 必须做集成测试?

| 对象 | 主要切口 |
|---|---|
| truth repository | optimistic version、unique key、transaction rollback、page / list 稳定排序 |
| `IdempotencyRepository` | same key same digest duplicate、same key different digest conflict、reserved in-flight、commit unknown 查询 |
| `UnitOfWork` fake / in-memory | truth、audit、outbox、projection stale、idempotency complete 同事务提交或回滚 |
| projection repository | stale / rebuilding / failed marker、replace scope、older cursor 不覆盖 newer freshness |
| reference snapshot repository | last good snapshot、unresolved / failed marker、refresh race |
| resolver adapter | fake / configured ref、not found、unavailable、forbidden body、failure injection |
| publisher adapter / outbox worker | publish success、partial failure、mark failed、dual publisher single winner |
| handoff adapter / handoff job | trace / archive handoff marker、failure report、no external body |
| config loader / runtime builder | defaults、JSON / env merge、typed validation、cross-field validation、forbidden boundary reject |
| API / worker / job entry | handler validation、event envelope / dedup、job metadata、error mapping、report / evidence output |

### 3.4 哪些 Command / Query / Event / Job 必须做协议和流程测试?

全部正式入口都必须进入测试对象清单:

| 类别 | 数量 | 必测入口 | 最小切口 |
|---|---:|---|---|
| Command | 18 | `CreateProject`、`UpdateProjectLifecycle`、`UpdateBacklogAvailability`、`AssignProjectMember`、`UpdateProjectMemberResponsibility`、`CreateWorkItem`、`CreateChildWorkItem`、`UpdateWorkItemLifecycle`、`RequestWorkPromotion`、`ReviewWorkPromotion`、`LinkWorkDependency`、`UpdateWorkDependencyState`、`OpenWorkBlocker`、`ResolveWorkBlocker`、`OpenIteration`、`CommitIterationScope`、`UpdateIterationCommitment`、`UpdateIterationLifecycle` | success、reject / error、duplicate / conflict |
| Query | 8 | `GetProjectWorkFacts`、`GetBacklog`、`GetWorkItem`、`ListMemberWork`、`GetIterationSummary`、`SearchWork`、`GetWorkTrace`、`GetProjectBoardView` | hit、missing / not visible / degraded、no-write |
| Inbound Event Consumer | 7 | `ConsumeIdentityMemberChanged`、`ConsumeMethodDefinitionChanged`、`ConsumeConversationWorkContextChanged`、`ConsumeProcessTimingChanged`、`ConsumeGovernanceDecisionChanged`、`ConsumeArtifactEvidenceChanged`、`ConsumeRuntimePromoteRequested` | accepted、duplicate、dead-letter / unresolved |
| Outbound Event | 9 | `ProjectChanged`、`ProjectMemberChanged`、`WorkItemChanged`、`PromoteResultRecorded`、`WorkDependencyChanged`、`WorkBlockerChanged`、`IterationChanged`、`WorkTraceAvailable`、`DerivedWorkViewChanged` | payload schema、forbidden field absent、publish failure |
| Operations Job | 6 | `PublishWorkOutbox`、`RebuildWorkProjections`、`RefreshExternalReferenceSnapshots`、`RunWorkReconciliation`、`PrepareWorkTraceHandoff`、`PrepareArchiveHandoff` | success、partial failure、rerun / idempotency |

### 3.5 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口?

| 切口族 | 必测内容 |
|---|---|
| 12 组状态机 | `ProjectLifecycleState`、`ProjectMemberResponsibilityState`、`BacklogState`、`WorkItemState`、`PromoteResultState`、`DependencyState`、`BlockerState`、`IterationState`、`CommitmentState`、`DerivedFreshnessState`、`ReferenceResolutionStatus`、`OutboxPublicationState` 的合法 / 非法转换 |
| 事务 | accepted truth、history / trace、outbox、projection stale、idempotency result 同 UoW;outbox enqueue / repository failure rollback |
| 幂等 | command duplicate / conflict、event redelivery / digest conflict、job rerun、commit unknown 先查 idempotency |
| 并发 | optimistic version conflict、unique create conflict、outbox dual publisher、projection rebuild race、reference refresh race |
| 恢复 | resolver unresolved / failed marker、publisher failed marker、handoff failed marker、projection stale / failed surface、reconciliation read-only report |
| no-write | Query、projection rebuild、reconciliation、report、search、workspace consumption 都不得改写业务 truth |

### 3.6 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口?

| 负向切口 | 必须验证 |
|---|---|
| Command 缺 `ActorContext`、`CommandMetadata` 或 `metadata.request.idempotency_key` | handler / application reject,不得进入 truth 写路径 |
| Query 缺 `ActorContext` 或 `QueryMetadata` | query reject 或 protocol error,不得写 audit / outbox / marker |
| Inbound Event 缺 event envelope、event id、source ref、dedup key 或 trace context | dead-letter / quarantine / retry marker,不得写核心 truth |
| Job 缺 job id、run metadata、system / operator actor 或 scope | job-level reject,不得 item-level 偷写 |
| DTO 使用 domain-only enum / ref 或字段级 schema 缺失 | contract test 失败,不得生成 placeholder |
| `SourceWorkRef`、`ExternalEvidenceRef`、`GlobalMemberRef`、`ProcessTimeboxRef`、`ImplementationPlanRef` 与正文混同 | reject 或 marker,不得保存相邻仓正文 |
| completion 缺 `ExternalEvidenceRef` | `UpdateWorkItemLifecycle` 完成路径 reject |
| iteration candidates 不是 `FormalWorkRefSet` 中正式工作 | `CommitIterationScope` reject |
| dependency 指向非正式 work、形成 cycle 或重复 edge | dependency / blocker flow reject |
| projection / query / reconciliation 试图写 Project、WorkItem、Iteration 或 dependency truth | fail test,不得只靠人工 review |
| config 试图关闭 metadata / idempotency / audit / outbox / visibility / forbidden body 边界 | config validation fail-fast |
| log / metric / audit / event / report 含 raw secret、raw payload、external body 或高基数字段 | redaction / observability check fail |

### 3.7 哪些状态名必须以详细设计正式 enum variant 为准?

测试方案和后续用例不得使用旧草案状态名或同义词替代正式状态。

| 状态机 | 正式 variant |
|---|---|
| `ProjectLifecycleState` | `Active`、`ReadOnly`、`Closed`、`Archived` |
| `ProjectMemberResponsibilityState` | `Proposed`、`Active`、`Paused`、`Released` |
| `BacklogState` | `Open`、`LockedForMaintenance`、`Archived` |
| `WorkItemState` | `Formalized`、`Committed`、`InProgress`、`Completed`、`Cancelled`、`Superseded` |
| `PromoteResultState` | `PendingReview`、`Accepted`、`Rejected`、`Superseded` |
| `DependencyState` | `Proposed`、`Active`、`Satisfied`、`Waived`、`Cancelled` |
| `BlockerState` | `Open`、`Mitigating`、`Resolved`、`Closed` |
| `IterationState` | `Planning`、`Committed`、`InProgress`、`Closed`、`Cancelled` |
| `CommitmentState` | `Candidate`、`Committed`、`Changed`、`Closed` |
| `DerivedFreshnessState` | `Fresh`、`Stale`、`Rebuilding`、`Failed` |
| `ReferenceResolutionStatus` | `Unresolved`、`Resolved`、`Stale`、`Failed` |
| `OutboxPublicationState` | `Pending`、`Published`、`Failed` |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` §1~§3 | 仍按旧草案列目标、策略和追溯,没有覆盖七模块、18 Command、8 Query、7 Consumer、9 Event、6 Job、12 状态机 | 本步降级旧内容,重建测试对象和切口 |
| 旧 `05-测试方案.md` §6 | 只列 `TC-001` 等旧用例,没有回指正式协议和状态 | 本步先抽对象和切口,Step 6 再重新分配稳定用例 ID |
| 旧 `05-测试方案.md` §9 | 旧性能阈值直接写硬指标 | 本步不纳入对象切口;Step 10 再作为非功能专项候选 |
| `03-详细设计.md` §15 | 已给最小验证摘要,但仍需测试方案展开对象层次 | 本步把摘要展开为测试对象总表 |
| `04-配置设计.md` §12 | 已要求 05 验证配置,旧 05 未覆盖 | 本步把配置加载 / 失败 / 敏感输出列为 P0 测试对象 |

## 5. 改动前后对比

| 维度 | Step 2 后 | Step 3 收敛后 |
|---|---|---|
| P0 范围 | 知道要覆盖核心闭环、详细设计最小验证和配置 P0 profile | 明确对应的 domain object、service、repository、protocol、state、consistency、config 和 observability 切口 |
| 测试对象 | 仍是范围级描述 | 有可回指上游章节的对象 / 接口 / 状态 / 一致性总表 |
| 负向测试 | 只知道一票否决方向 | 明确字段缺失、DTO 构造失败、引用混同、forbidden body、no-write、config forbidden boundary 等负向切口 |
| 用例设计 | 尚未开始 | 仍不开始;Step 6 基于本步切口设计用例 |
| 测试层级 | 尚未分层 | 只给推荐测试层级,正式分层留给 Step 4 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接从旧 `TC-001` 继续扩展用例 | 改动少 | 会继承旧对象名、旧状态和不完整协议覆盖 | 不采用 |
| 方案 B: 完全复制 `03_ddd_step_16_test_cuts.md` | 覆盖完整 | 缺少测试方案范围裁剪,也没有承接 Step 1 / Step 2 的 P0/P1/P2 口径 | 不直接复制 |
| 方案 C: 以 Step 16 为真相源,按测试方案 SOP 重新抽对象与切口 | 能覆盖详细设计最小验证,同时保留测试方案职责边界 | 需要后续 Step 4~9 继续展开 | 采用 |
| 方案 D: 只按技术层级列 unit / integration / e2e | 简洁 | 会丢失业务主要组成部分和一票否决边界 | 不采用 |

推荐方案 C。

原因:

- Step 3 的职责是对象与切口,不是完整用例矩阵。
- L1-work 的 P0 风险主要来自 truth 边界、状态、幂等、事务、配置和 forbidden body,不能只用 happy path E2E 覆盖。
- 多轮 L1-conversation 经验表明,字段级 schema、public DTO 传递类型、state enum 归属和 negative branch 若不进入测试切口,实现阶段容易停在“测试断言和设计契约不一致”。

## 7. 结构化中间产物

### 7.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `Project` / project lifecycle | `02` §5 / §9,`03` §6 / §9 | create、read-only、close、archive、implicit create reject | 项目主语不成立或被 workspace / process 吸收 | domain unit + command service |
| `ProjectMember` / responsibility | `02` §5 / §9,`03` §6 / §9 | GlobalMemberRef、capability snapshot、Proposed / Active / Paused / Released | Work 接管 identity truth | domain unit + service |
| `Backlog` | `02` §5 / §9,`03` §6 / §9 | empty backlog、open / maintenance lock / archive、formal work membership | Backlog 混入个人步骤或外部建议 | domain unit + integration |
| `WorkItem` / `ChildWorkItem` | `02` §5 / §8 / §9,`03` §6 / §7 / §8 | formalize、child boundary、completion evidence、terminal reject | 正式工作全集被 runtime / conversation 污染 | domain unit + API/service |
| `PromoteResult` / `PromoteDecisionRecord` | `02` §7 / §8 / §9,`03` §6 / §7 / §8 | request、accept、reject、supersede、created work ref | promote 绕过显式审查或保存 runtime 正文 | domain unit + service |
| `WorkDependency` / `WorkBlocker` | `02` §5 / §9 / §10,`03` §6 / §7 / §9 | dependency edge、cycle reject、blocker open / resolve、evidence required | 依赖 / 阻塞不可解释或形成错误图 | domain unit + service |
| `Iteration` / `IterationCommitment` | `02` §5 / §8 / §9,`03` §6 / §7 / §9 | timebox ref、candidate scope、commit、change、close / cancel | Iteration 变成 Backlog 全集或 process truth | domain unit + service |
| `WorkTraceRecord` / `WorkAuditTrail` | `03` §6 / §14 / §15 | accepted change 写 trace / audit;invalid request 不写 business audit | 关键变化不可追溯或泄露正文 | domain + observability |
| `WorkOutboxRecord` | `03` §6 / §10 / §15 | enqueue same UoW、publish state、failed marker、no rollback truth | 已成立事实不可传播或被错误回滚 | repository + worker |
| `ReferenceResolutionState` / snapshots | `02` §7 / §10,`03` §6 / §8 / §11 | resolved / unresolved / stale / failed、last good snapshot、no body | 相邻仓正文或假 truth 进入 Work | consumer + job |
| `DerivedWorkViewState` / projections | `02` §5 / §9,`03` §6 / §8 / §11 | stale、rebuilding、failed、query surface、rebuild no-write | 派生视图成为第二 truth | projection + query |
| contracts DTO / typed refs | `03` §6 / §7 | roundtrip、必填字段、public DTO 传递类型、domain-only type absent | 实现用 placeholder 或形成双真相 | contract unit |
| command services | `03` §8 / §10 / §12 / §13 | UoW、idempotency、version conflict、outbox rollback、error mapping | 写路径半提交或重复写 truth | service integration |
| query service | `03` §7 / §8 / §11 | hit、missing、not visible、stale / failed、no-write | 读路径修复或隐式创建 truth | service + handler |
| inbound consumers | `02` §7 / §8,`03` §7 / §8 / §12 | envelope、dedup、dead-letter、snapshot / marker only | 外部事件直接创建 Work truth | worker integration |
| outbound events | `02` §7,`03` §7 / §14 | payload schema、refs only、publish failure marker | 外部正文泄露或传播伪成功 | contract + publisher |
| operations jobs | `02` §7 / §8,`03` §7 / §8 / §11 | batch、partial failure、rerun、report、no repair truth | 维护任务反写真相 | job runner |
| state matrix | `02` §9,`03` §9 | 12 组合法 / 非法转换和正式 variant | 测试使用旧状态名或漏非法转换 | domain unit |
| transaction / consistency | `03` §10 / §11 | truth + trace + outbox + projection stale + idempotency 同 UoW | accepted truth 与副作用不一致 | service + repository |
| idempotency / concurrency | `03` §12 | duplicate、conflict、reserved in-flight、version conflict、commit unknown | 重复正式事实或盲重试 | service + fake UoW |
| configuration | `04` §6~§12 | defaults、strict JSON、env override、sensitive ref、forbidden boundary | 配置绕过核心边界或泄露 secret | config + integration |
| observability / redaction | `03` §14,`04` §8 / §11 | low-cardinality metric、safe log、audit refs only、raw body absent | 证据不可复核或敏感泄露 | observability check |

### 7.2 业务主要组成部分到测试对象映射

| 业务主要组成部分 | P0 测试对象 | 关键切口 |
|---|---|---|
| Project subject management | `Project`、`Backlog`、`ProjectCommandService` | 显式建立项目主语、生命周期、backlog 联动 |
| Project member responsibility | `ProjectMember`、`MemberCapabilitySnapshot`、member commands | 承担事实、identity ref / snapshot、责任状态 |
| Formal work universe | `Backlog`、`WorkItem`、`ChildWorkItem`、formal work policies | 正式工作全集、child boundary、forbidden source |
| Promote / formalization boundary | `SourceWorkRef`、`PromoteResult`、`PromoteDecisionRecord`、promote commands | pending / accept / reject、runtime / artifact 正文排除 |
| Dependency / blocker coordination | `WorkDependency`、`WorkBlocker`、change records | dependency graph、cycle reject、evidence / reason |
| Iteration commitment | `Iteration`、`IterationCommitment`、iteration commands | process timebox ref、candidate scope、commitment state |
| Work consumption / trace | query views、`WorkTraceRecord`、`WorkAuditTrail` | authorized read、trace view、no-write |
| Derived consumption support | `DerivedWorkViewState`、board / member / search projections | stale / failed surface、rebuild no-write |
| Local reference / snapshot support | reference snapshots、resolvers、refresh jobs | ref-only、unresolved / failed marker、no external body |

### 7.3 协议测试对象检查表

```text
18 Command
  -> contract DTO + handler validation + service flow + idempotency
8 Query
  -> contract DTO + authorization + projection surface + no-write
7 Inbound Event Consumer
  -> envelope + dedup + source mapping + dead-letter / marker
9 Outbound Event
  -> outbox source + schema + forbidden field absent + publish failure
6 Operations Job
  -> job input + batch / retry + partial failure + report / rerun
```

### 7.4 状态 / 一致性 / 恢复切口图

```text
Domain object method
  -> legal transition
  -> save truth in UoW
  -> append trace / audit
  -> enqueue outbox
  -> mark projection stale
  -> complete idempotency

Domain reject / metadata reject / version conflict
  -> no accepted truth
  -> no business trace
  -> no outbox
  -> stable error surface

External / publisher / handoff / projection failure
  -> explicit unresolved / failed / stale / report marker
  -> no fake success
  -> no rollback of accepted truth
```

关键说明:

- 图表达测试对象之间的验证链,不表达执行排期。
- 每个 P0 切口必须能回指 `03-详细设计.md` 或对应 `design-calibration/03_ddd_step_*`。
- Query、projection、reconciliation 和 report 只读 / 维护路径不得写业务 truth。

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 测试对象覆盖七模块、18 Command、8 Query、7 Consumer、9 Event、6 Job、12 状态机和配置 / 观测边界 | 否 | 测试对象抽取,无设计契约变化 | 无 | 无回写 |
| DTO 构造失败、字段缺失、引用混同、forbidden body 和 no-write 被列为负向测试切口 | 否 | 测试覆盖要求,不新增字段或错误 | 无 | 无回写 |
| 正式状态名必须使用 `03` 定义的 enum variant | 否 | 测试命名约束,不改变状态矩阵 | 无 | 无回写 |
| P1/P2 真实生产依赖、remote config、hot reload、容量模型仍不进入 P0 对象清单 | 否 | 范围裁剪,与 Step 2 一致 | 无 | 无回写 |

说明:

```text
本步没有改变需求、架构、概要、详细设计或配置设计。
如果 Step 4~6 在分层或用例设计时发现某个 P0 测试对象无法回指正式对象、协议、状态、错误或配置契约,必须记录为上游待回写或阻塞待确认,不能由测试方案自行补 schema。
```

## 9. 回填草稿

正式 `05-测试方案.md` §3 建议采用以下结构:

```text
3. 测试对象与测试切口
  3.1 测试对象抽取原则
  3.2 测试对象与测试切口总表
  3.3 业务主要组成部分到测试对象映射
  3.4 协议测试对象检查表
  3.5 状态 / 一致性 / 恢复切口
  3.6 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §3.1 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` §3 / §6 |
| §3.2 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` §7.1 |
| §3.3 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` §7.2 |
| §3.4 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` §7.3 |
| §3.5 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` §7.4 |
| §3.6 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 4 的待确认事项。

后续 Step 必须继续收口:

- Step 4 按本步测试对象制定测试策略与分层,避免所有风险堆到 E2E。
- Step 5 建立 FR / BR / AC 到测试对象和后续用例的覆盖矩阵。
- Step 6 为本步 P0 切口分配稳定用例 ID、步骤摘要、断言和 evidence ID。
- Step 7 设计 fixture / builder / fake adapter 数据,覆盖本步负向切口。
- Step 8 / Step 9 承接 `04` 的 profile、配置失败和自动化门禁。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 测试对象都有明确切口 | 通过 | 见 §7.1 |
| 覆盖详细设计 §15 最小验证清单 | 通过 | 七模块、协议、状态、事务、幂等、配置、观测均已进入切口 |
| 使用正式协议名和状态名 | 通过 | 见 §3.4 / §3.7 |
| 字段缺失、DTO 构造失败和引用混同进入负向切口 | 通过 | 见 §3.6 |
| 未提前定义用例 ID、测试数据或 CI 门禁 | 通过 | 留给 Step 6 / Step 7 / Step 9 |
