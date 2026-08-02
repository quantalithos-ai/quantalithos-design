# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 围绕 Step 7 已收敛的 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 external / infrastructure port 骨架,说明关键接口如何穿过入口、application service、domain object / guard、port、persistence、projection、event relay 和 handoff 形成可继续详细设计的处理流。本步可以点名概要层 service / domain method / port 角色和参数类型骨架,但不写完整伪代码、完整函数签名、DTO / event schema、repository 方法、事务脚本、错误码、retry 参数、topic、配置 key、测试或实施 boundary。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 8 | 是。用户在 Step 7 审查点后回复“同意”,允许进入 Step 8。 |
| 项目级台账是否允许进入 Step 8 | 是。`project_execution_ledger.md` 记录 Step 7 已完成并等待用户审查,用户确认后允许进入 Step 8。 |
| 文档级 flow 是否允许进入 Step 8 | 是。`02_hld_calibration_flow.md` 记录 Step 8 `blocked_by_step_7_review`,用户确认后可进入。 |
| 是否已读取 Step 7 接口骨架 | 是。Step 7 §16 提供 Step 8 关键处理流候选和必须使用的 Step 6 对象。 |
| 是否已读取 Step 5 / Step 6 | 是。Step 5 提供六个主要组成部分和接缝;Step 6 提供关键对象、guard、status view、audit 和 event relay 主语。 |
| 是否已读取概要 SOP Step 8 | 是。Step 8 必须输出通用处理流骨架、按主要组成部分组织的处理流清单、关键接口 ASCII 图、关键设计点、未展开取舍、停审记录和跨处理流一致性审计。 |
| 是否已读取概要书写规范 §4.8 | 是。P0 Command、会改写本地状态的 Consumer、影响一致性或传播可靠性的 Job 必须有处理流;Query 可按复杂度决定是否独立展开。 |
| 是否发现阻塞 Step 8 的上游 blocker | 否。backend 组合、policy 来源矩阵、handoff ack 协议、material retention、failure taxonomy、event / outbox 产品、DB / object store / observability / GRC 产品仍是后续待确认,不阻塞概要处理流骨架。 |

---

## 2. 本步目标

本步把 Step 7 的接口骨架转成 `03-详细设计.md` 可以继续展开的关键处理流。

本步要回答:

- 每个关键 Command 如何从同步入口进入 application service、domain object / guard、truth persistence、audit / relay / projection marker。
- 每个关键 Query 如何只读读取 projection、status view、summary view、audit trace 或 derived view,并表达 stale / degraded / not-visible / unavailable。
- 每个关键 Inbound Event Consumer 如何验证 envelope、幂等、来源版本和 trace context,并只写 refs、snapshot、handoff state、control fact、stale marker 或 reconciliation marker。
- 每个关键 Operations Job 如何从已持久化 truth、handoff、relay、projection、reference state 或 guard state 出发,做发布、刷新、重试、重建、对账或保守回收。
- 哪些关键函数 / service / guard 调用可以在概要层点名,并且参数必须带类型名。
- 哪些完整函数调用链、错误映射、事务、retry、dead-letter、adapter outcome、DTO schema 和测试矩阵必须留给后续详细设计、配置设计、测试方案和实施计划。

本步不新增 Step 7 未定义的正式接口,不新增 Step 6 未定义的正式关键对象,不把 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store、policy source truth 或 investigation lifecycle 混入 sandbox。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供六个主要组成部分、capability、非职责、接缝和处理流归属边界。 |
| `02_hld_step_06_key_objects.md` 和 4 个对象附录 | 已完成 | 提供 flow 中允许点名的对象、guard、status view、audit trace、event relay 和函数骨架。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command / Query / Consumer / Event / Job / Port 骨架、接口归属和 Step 8 反查清单。 |
| `projects/L4-sandbox/00-需求文档.md` §7 / §9 / §11 / §12 / §14 / §16 | 当前正式需求基线 | 提供 C-SBX-1~5、FR / BR / AC / VF、数据归属、接口依赖和红线。 |
| `projects/L4-sandbox/01-架构设计.md` §4 / §6 / §7 / §8 / §9 / §10 / §15 / §16 | 当前正式架构基线 | 提供职责边界、运行承载、依赖方向、数据所有权、一致性、通信方式和风险待确认。 |
| `standards/document/概要设计讨论流程_SOP.md` Step 8 | 已读取 | 约束处理流选择、图示、问题回答、停审和进入下一步条件。 |
| `standards/document/概要设计书写规范.md` §4.8 | 已读取 | 约束处理流 ASCII 图格式、关键设计点和未展开接口说明。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 约束 Step 文件必须包含问题回答、诊断、取舍、结构化产物、回填草稿和自检。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束处理流中字段来源、状态推进、引用解析、projection rebuild、handoff / relay 和 phase boundary 不得伪造。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 约束本仓除 `L0-core` 外不得把 sibling 或 backend 产品写成编译期依赖。 |
| L1 artifact / governance Step 8 样例 | 已读取 | 参考“通用路径 + 覆盖清单 + flow family + 停审 / 审计”的粒度。 |
| 旧 `README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于审计旧 service、backend、event、retry / replay 和 output / audit 混写风险,不得继承旧处理流。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`02` flow、Step 7、Step 5 / 6、正式 `00/01`、概要 SOP Step 8 和书写规范 §4.8。 | done | 确认用户已允许进入 Step 8,正式 `02` 不修改。 |
| 2 | 从 Step 7 §16 选择关键处理流并按主要组成部分归属。 | done | 形成 12 条关键处理流候选,覆盖 Command、Consumer、Job 和高复杂 Query / derived surface。 |
| 3 | 回答 Step 8 SOP 问题。 | done | 明确写路径、读路径、consumer path、job path、函数参数类型、独立展开规则和停审口径。 |
| 4 | 输出通用 Command / Query / Consumer / Job 处理流骨架。 | done | 作为未独立展开接口的公共处理流口径。 |
| 5 | 输出处理流覆盖清单和关键函数 / service / guard 参数骨架表。 | done | 保证接口没有因数量多而漏掉处理流口径。 |
| 6 | 按主要组成部分输出关键接口处理流 ASCII 图和关键设计点。 | done | 每条 flow 都回指 Step 7 接口和 Step 6 对象。 |
| 7 | 输出未展开处理流取舍、归属停审、跨处理流一致性审计、回填草稿和自检。 | done | Step 9 可继续收敛状态主语和迁移触发。 |
| 8 | 更新 `02_hld_calibration_flow.md` 和项目台账,并停在用户审查点。 | done | 不创建 Step 9 文件,不修改正式 `02-概要设计.md`。 |

---

## 5. SOP 问题回答

### 5.1 每个关键 Command 的写路径如何从入口进入 application service、domain object、persistence / relay?

`L4-sandbox` 的 Command 写路径共用以下顺序:

1. `Sandbox Sync Entry` 验证 `ActorContext` 或 `SystemActorContext`、`CommandMetadata`、`IdempotencyKey` 和 trace context。
2. application service 解析或读取 `ControlledExecutionContext`、外部 refs / safe summary、boundary requirement、policy snapshot、run / capture / handoff / failure / cleanup / redline 当前状态。
3. domain object / guard 进行受理、边界建立、policy fail-closed、run 承接、capture、handoff、control、failure、cleanup 或 redline 裁定。
4. `SandboxTruthPersistencePort` 保存 sandbox-owned truth、audit trace、relay marker、projection stale marker 或可重建 status view 来源。
5. `SandboxEventRelayRecord` 只为已提交 fact 创建 relay 记录;relay 发布失败不得回滚核心 truth。
6. Command 返回 command result / rejected / pending / duplicate replay surface,但不宣布下游 artifact、runtime、runner、observability、policy 或 investigation truth。

### 5.2 每个关键 Query 如何从入口读取 projection 或只读视图?

Query 只读,必须携带 `ActorContext` 和 `QueryMetadata`。简单 status / summary 读取走通用读路径;涉及 projection freshness、derived stale / rebuilding / failed、backend comparison、reconciliation finding、audit trace 分页或 degraded surface 的 Query 进入独立只读处理流。

Query 不刷新 refs、不重建 projection、不触发 handoff、不解除 cleanup guard、不修复 relay / reconciliation,也不把 missing / stale / unavailable 静默解释为 success。

### 5.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录?

Consumer 处理顺序为:

1. 验证 event envelope、source event id、source ref、schema version、dedup key、observed-at marker 和 trace context。
2. 判断来源是否属于 Step 7 允许的 caller refs、policy summary、backend capability、isolation backend lifecycle、handoff status、control request、investigation status 或 relay feedback。
3. 只写本地 `ReferenceResolutionState`、`PolicyApplicabilitySnapshot` stale marker、`BackendCapabilitySummary`、`HandoffFact` status、`ControlFact`、`CleanupGuard` reevaluation marker、`RedlineContainment` handoff marker、`SandboxEventRelayRecord` feedback 或 `SandboxReconciliationReport` marker。
4. 重复、乱序、unsupported version、来源不可用或外部正文越界只能形成 ignored / delayed / stale / failed / reconciliation finding,不得创建核心 success。

### 5.4 每个 Operations Job 如何基于已持久化事实做发布、重建或对账?

Operations Job 必须从已提交 sandbox truth、relay record、handoff fact、lease、cleanup guard、redline containment、reference state、projection stale marker、derived state 或 reconciliation scope 出发。

Job 可以维护 event relay、reference refresh、backend capability refresh、handoff retry、lease / orphan / cleanup / redline、projection / derived / reconciliation;不得创建新的受控执行语境,不得启动未受理执行,不得修复核心 truth,不得伪造 run_id、evidence alias、验收签署或 implementation boundary。

### 5.5 处理流中点名的关键函数调用,参数分别是什么类型?

本步只点名概要层函数 / service / guard 骨架,参数必须带类型名。正式函数签名、返回类型、错误映射和 trait 方法后移到 `03-详细设计.md`。

| 函数 / service / guard 骨架 | 参数类型骨架 | 使用流 |
|---|---|---|
| `ControlledExecutionContext.open_from_request(...)` | `ExecutionSourceRefSet source_refs`;`ExecutionResponsibilityContext responsibility_context`;`SandboxAuditTrace trace` | 受控执行请求受理 / 拒绝 |
| `ExecutionContextResolution.evaluate(...)` | `ContextReferenceResolution context_resolution`;`ControlledExecutionIntakeGuard intake_guard` | 受理、refs 解析 |
| `ExecutionEnvironmentIdentity.bind(...)` | `ControlledExecutionContext context`;`ContextRefSummarySet safe_summaries`;`SandboxAuditTrace trace` | 受理、identity bind |
| `ExternalBodyExclusionGuard.evaluate(...)` | `ReferenceResolutionState reference_state` | refs / safe summary 解析 |
| `BoundaryRequirementSet.compose(...)` | `ControlledExecutionContext context`;`ExecutionEnvironmentIdentity identity`;显式 boundary requirement carriers;validated profile / template refs;runtime generation ref | boundary requirement 合成;不得读取 policy 或由 capability 反向生成要求 |
| `BoundaryEstablishmentDecision.decide(...)` | `BoundaryRequirementSet requirement_set`;`BackendCapabilitySummary backend_summary`;`BoundaryCoherenceGuard coherence_guard` | boundary 建立 |
| `CoherentBoundary.establish(...)` | `BoundaryRequirementSet requirement_set`;`IsolationEnvironmentHandle isolation_handle`;`SandboxAuditTrace trace` | boundary 建立 |
| `PolicyApplicabilitySnapshot.create(...)` | `PolicySourceRefSet policy_source_refs`;`AuthorizationSummary authorization_summary`;`BoundaryRequirementSet boundary_requirement_set` | policy snapshot |
| `PolicyExecutionDecision.evaluate(...)` | `PolicyApplicabilitySnapshot policy_snapshot`;`FailClosedPolicyGuard fail_closed_guard`;`HighRiskActionMarkerSet high_risk_markers` | fail-closed 裁定 |
| `ControlledExecutionRun.start(...)` | `ControlledExecutionContext context`;`CoherentBoundary boundary`;`PolicyExecutionDecision policy_decision`;`IsolationEnvironmentHandle handle` | 受控执行运行承接 |
| `CaptureFact.record(...)` | `ControlledExecutionRun run`;`ExecutionOutputSummary output_summary`;`CaptureCompletenessGuard completeness_guard`;`SandboxAuditTrace trace` | capture 收口 |
| `HandoffFact.open(...)` | `CaptureFact capture`;`CapturedMaterialRefSet material_refs`;`ObservabilityMaterial observability_material`;`HandoffTargetRefSet target_refs` | material / observability handoff |
| `ControlConflictGuard.evaluate(...)` | `ControlFact incoming_control`;`ControlFact existing_control` | failure / control 收束 |
| `FailureClassification.classify(...)` | `FailureSourceMarkerSet source_markers`;`ControlledExecutionContext context`;`SandboxAuditTrace trace` | failure classification |
| `CleanupGuard.evaluate(...)` | `CaptureFact capture`;`HandoffFact handoff`;`InvestigationHandoffSummary investigation_summary` | cleanup readiness |
| `RedlineContainment.contain(...)` | `RedlineContainmentGuard guard`;`SandboxAuditTrace trace` | redline containment |
| `SandboxEventRelayRecord.open(...)` | `SandboxSourceFactRef source_fact_ref`;`EventRelayTargetRefSet target_refs`;`SandboxEventRelayKind relay_kind` | event relay 发布 |
| `SandboxReadProjection.create(...)` | `ControlledExecutionContext context`;`SandboxStatusViewRefSet status_view_refs` | read projection rebuild |
| `DerivedInspectPreviewTrendState.start_rebuild(...)` | `DerivedRebuildMarker rebuild_marker` | derived maintenance |
| `SandboxReconciliationReport.create(...)` | `SandboxReconciliationScopeRef scope_ref`;`SandboxTruthRefSet truth_refs`;`SandboxProjectionRefSet projection_refs` | reconciliation |

### 5.6 哪些处理步骤必须在概要设计点名,哪些完整函数调用链应留给详细设计?

概要设计必须点名:

- sync entry、async consumer、operations job 三类入口。
- truth / snapshot / reference / derived / forbidden body 分层。
- domain guard 在受理、boundary、policy、capture、handoff、control、cleanup、redline 和 derived read 中的位置。
- truth persistence、audit trace、projection stale marker、event relay record 和 handoff marker 的相对顺序。
- Consumer 不写核心 success、Query no-write、Job 不修复核心 truth、relay 失败不回滚 truth。

留给详细设计:

- 完整 request / response / event / job report schema。
- port trait 方法、repository 读写函数、UoW / transaction、optimistic version 和 idempotency store。
- adapter outcome enum、错误模型、retry / backoff / dead-letter、topic / outbox payload、分页、projection rebuild plan。
- fake / durable parity、测试切口、配置 key 和 implementation boundary。

### 5.7 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流?

本步独立展开 Step 7 §16 中的 12 条关键处理流:

- `OpenControlledExecutionContext` 受理 / 拒绝。
- `ConsumeCallerContextReferenceChanged` / `RefreshSandboxReferenceStates` refs / safe summary 解析与刷新。
- `EstablishExecutionBoundary` boundary requirement 合成与建立。
- `EvaluatePolicyExecution` policy snapshot 与 fail-closed 裁定。
- `StartControlledExecutionRun` 受控执行运行承接。
- `RecordCaptureResult` capture 和候选材料收口。
- `OpenMaterialHandoff` / `RetryPendingMaterialHandoffs` material / observability handoff。
- `SubmitSandboxControl` / `ClassifySandboxFailure` / `ConsumeSandboxControlRequested` failure / control 收束。
- `RunLeaseOrphanReaper` / `EvaluateCleanupReadiness` / `EvaluatePendingCleanupGuards` lease / orphan / cleanup / reaper。
- `RecordRedlineContainment` / `MaintainRedlineContainmentHandoffs` redline containment 与 investigation handoff。
- `GetSandboxReadProjection` / `GetDerivedInspectPreviewTrend` / `RebuildSandboxReadProjections` / `MaintainDerivedInspectPreviewTrend` / `RunSandboxReconciliation` projection / derived / reconciliation。
- `PublishSandboxEventRelay` / `ConsumeSandboxTruthRelayFeedback` event relay 发布与反馈。

这些 flow 覆盖全部 P0 Command,并为同构 Consumer / Job 提供独立 flow family。接口级覆盖详见 §11。

### 5.8 哪些 Query 可以只走通用读路径,哪些 Query 必须画独立处理流?

只走通用读路径的 Query:

- `GetSandboxExecutionStatus`
- `GetBoundaryStatus`
- `GetPolicyDecisionSummary`
- `GetCaptureSummary`
- `GetMaterialHandoffStatus`
- `GetFailureControlStatus`
- `GetCleanupReadiness`
- `GetRedlineContainmentStatus`
- `GetSandboxAuditTrace`

它们读取已存在 status view、summary view、audit projection 或 trace page,不触发 refresh、repair、handoff 或 cleanup。

独立处理的 Query:

- `GetSandboxReadProjection`
- `GetDerivedInspectPreviewTrend`
- `GetBackendCapabilityComparison`
- `GetSandboxReconciliationReport`

这些 Query 涉及 projection freshness、derived stale / rebuilding / failed、backend comparison degraded marker 或 reconciliation finding,必须明确 no-write 和 degraded surface。

### 5.9 每个处理流属于哪个主要组成部分,承接哪个接口,使用哪些关键对象?

本文件 §10 按六个主要组成部分组织处理流清单。所有处理流均回指 Step 7 接口和 Step 6 对象,不得引入新正式对象。

### 5.10 是否存在接口没有处理流口径、处理流点名对象未定义、处理流跨组成部分但接缝未说明?

当前没有 unresolved 冲突。需要持续保护的接缝:

- `OpenControlledExecutionContext` 只能建立受控执行语境和 execution identity,不得补写 identity / work / runtime 正文。
- `EstablishExecutionBoundary` 与 `StartControlledExecutionRun` 可以调用 `IsolationBackendPort`,但 backend SDK raw response 不成为 domain truth。
- `EvaluatePolicyExecution` 只消费给定 policy / authorization 摘要,不拥有 policy source truth。
- `RecordCaptureResult` 与 `OpenMaterialHandoff` 分离,避免 capture 直接升级为 artifact / observability truth。
- `SubmitSandboxControl`、`ClassifySandboxFailure`、cleanup 和 redline flow 不推进 runtime recover 或业务 replay。
- Query / derived / comparison / reconciliation 只能读或维护可重建 projection,不得反写核心 truth。
- `PublishSandboxEventRelay` 是 Job,不是 Command;发布反馈不回滚已成立 fact。

### 5.11 每个主要组成部分的处理流完成后是否通过停审?

本文件 §15 提供逐组成部分停审记录。六个主要组成部分当前均通过 Step 8 停审:接口有处理流口径,对象可反查,跨部分接缝已说明,未越层写完整实现。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 README / 旧 `02` 的旧 `SandboxService` 流程 | 容易把“service 调后端跑命令”写成单条旧流程,遗漏 identity、policy、capture、cleanup 和 redline。 | 改为 12 条关键处理流,每条回指 Step 7 接口和 Step 6 对象。 |
| 旧 Docker/gVisor/local_process 后端线索 | 容易让后端调用顺序反向决定概要处理流。 | 只通过 `BackendCapabilityPort` 和 `IsolationBackendPort` 表达 capability / handle 接缝。 |
| 旧 allowlist / policy lookup | 容易让 sandbox 自行决定 allowlist 或 policy truth。 | policy flow 只使用 `PolicySummaryPort`、`PolicyApplicabilitySnapshot` 和 fail-closed guard。 |
| 旧 output / audit / artifact 混写 | 容易让 capture 同时宣布 artifact、observability 和 runtime result。 | capture flow 与 handoff flow 分离,并用 `HandoffOwnershipGuard` 保护 ownership。 |
| 旧 retry / replay / cleanup 主线 | 容易把 replay 写成业务重放,把 cleanup 写成运维脚本。 | control、failure、lease、cleanup 和 redline 作为正式处理流,不推进 runtime recover。 |
| inspect / preview / trend 外围增强 | 容易成为隐藏写路径或核心验收前提。 | 全部归只读 Query / derived Job,并由 `DerivedReadOnlyGuard` 和 degraded surface 约束。 |

---

## 7. 处理流选择与复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否逐个接口画 50+ 张图 | 不采用 | Step 7 接口数量较多,逐接口机械重复会降低可审查性;本步采用关键 flow family 覆盖同构接口。 |
| 是否所有 P0 Command 有处理流 | 是 | 10 个 Command 均进入 12 条处理流中的独立 Command flow 或同构 command family。 |
| 是否所有会改写本地状态的 Consumer 有处理流 | 是 | Consumer 按 refs / policy / backend / lifecycle / handoff / control / investigation / relay feedback 分流覆盖,不直接写核心 success。 |
| 是否所有影响一致性或传播可靠性的 Job 有处理流 | 是 | relay、reference / capability refresh、handoff retry、lease / cleanup、redline handoff、projection / derived / reconciliation 均有 flow。 |
| 是否需要独立 Query flow | 需要少量独立展开 | derived / comparison / reconciliation / read projection 涉及 freshness、degraded 和 no-write surface,必须独立说明。 |
| 是否需要拆附录 | 暂不拆 | Step 8 较重,但仍可在单文件内保持可审查;后续正式 `02` 只摘录总览和关键图。 |

---

## 8. 通用处理流骨架

### 8.1 通用 Command 写路径

```text
====================================================================+
|                    Generic Sandbox Command Write Path              |
+====================================================================+
| Command request                                                     |
|   | ActorContext / SystemActorContext + CommandMetadata             |
|   | IdempotencyKey + trace context                                  |
|   v                                                                 |
| Sandbox Sync Entry                                                  |
|   | validate caller boundary, command context and duplicate surface  |
|   v                                                                 |
| Application Service                                                 |
|   | load refs / safe summaries / current sandbox truth / guards      |
|   v                                                                 |
| Domain Object + Guard                                               |
|   | apply accept / reject / establish / decide / capture / contain   |
|   v                                                                 |
| SandboxTruthPersistencePort                                         |
|   | save sandbox truth + audit trace + relay marker + stale marker   |
|   v                                                                 |
| Command Result + Relay Record                                       |
|   | return result surface; relay only committed fact                 |
+====================================================================+
```

关键设计点:

- Command 写路径只保存 sandbox-owned truth、refs、safe summary refs、audit trace、relay marker 和 projection stale marker。
- Command 不保存外部正文,不宣布下游 truth,不把 adapter raw response 变成 domain truth。
- duplicate replay surface、stored command result 和 exact persistence callable surface 后移到 `03-详细设计.md`。

### 8.2 通用 Query 只读路径

```text
+====================================================================+
|                    Generic Sandbox Query Read Path                 |
+====================================================================+
| Query request                                                       |
|   | ActorContext + QueryMetadata + scope / pagination / consistency |
|   v                                                                 |
| SandboxReadService                                                  |
|   | resolve read subject and load status / projection / audit view   |
|   v                                                                 |
| Read Visibility + Freshness Guard                                   |
|   | apply no-write rule; surface stale / degraded / not-visible      |
|   v                                                                 |
| Projection / Status / Trace View                                    |
|   | read only; no refresh, no repair, no handoff, no cleanup         |
|   v                                                                 |
| Query Response                                                      |
|   | return view / page + degraded markers + freshness markers        |
+====================================================================+
```

关键设计点:

- Query 不打开 truth 写路径,不调用 resolver refresh、projection rebuild、handoff retry 或 cleanup evaluation。
- stale、pending、failed、unavailable、not-visible 和 degraded 必须显式进入 response surface。
- 正式 visibility resolution、query DTO 和 projection lookup 后移到详细设计。

### 8.3 通用 Inbound Event Consumer 路径

```text
+====================================================================+
|                Generic Sandbox Inbound Consumer Path               |
+====================================================================+
| Inbound event envelope                                              |
|   | source event id + source ref + schema version + dedup key        |
|   | observed-at marker + trace context                              |
|   v                                                                 |
| Sandbox Async Consumer                                              |
|   | classify allowed external fact / summary / signal / feedback     |
|   v                                                                 |
| Reference / Snapshot / Marker Handler                               |
|   | update local refs, summary markers, handoff state or stale mark  |
|   v                                                                 |
| SandboxTruthPersistencePort / ProjectionPersistencePort             |
|   | save allowed local marker; reject body / unsupported version     |
|   v                                                                 |
| Consumer Receipt                                                    |
|   | accepted / duplicate / delayed / stale / rejected disposition    |
+====================================================================+
```

关键设计点:

- Consumer 不绕过 Command 直接创建 `ControlledExecutionContext`、`CoherentBoundary`、`PolicyExecutionDecision` 或 `CaptureFact` success。
- 外部正文、unsupported version、乱序和重复只能形成 receipt / marker / finding,不得伪造核心 fact。
- Consumer receipt schema、dedup persistence 和 trace subject mapper 后移到详细设计。

### 8.4 通用 Operations Job 维护路径

```text
+====================================================================+
|                    Generic Sandbox Operations Job Path             |
+====================================================================+
| Job input                                                           |
|   | JobMetadata + system / operator actor + job idempotency key      |
|   | JobAttemptMarker + trace context                                |
|   v                                                                 |
| Sandbox Operations Job                                              |
|   | load committed truth, relay, handoff, lease, guard or projection |
|   v                                                                 |
| Maintenance Guard / Port                                            |
|   | publish / refresh / retry / rebuild / reconcile / reap safely    |
|   v                                                                 |
| Persistence + Marker Update                                         |
|   | save job report source, updated marker, projection or relay      |
|   v                                                                 |
| Job Report                                                          |
|   | report changed refs, skipped refs, failed refs and degraded      |
+====================================================================+
```

关键设计点:

- Job 基于已持久化事实维护传播、派生、交接、对账和保守回收,不是业务 Command。
- Job 失败不得回滚核心 truth;需要人工、调查或下游 ack 的场景只能进入 pending / blocked / failed / retryable surface。
- Job report public schema、stored report duplicate replay 和 retry 参数后移到详细设计 / 配置 / 测试。

---

## 9. 按主要组成部分组织的关键处理流清单

| 主要组成部分 | 关键处理流 | 承接接口 | 使用对象 / guard |
|---|---|---|---|
| `Controlled execution intake and identity` | 受控执行请求受理 / 拒绝;refs / safe summary 解析与刷新 | `OpenControlledExecutionContext`;`ConsumeCallerContextReferenceChanged`;`RefreshSandboxReferenceStates` | `ControlledExecutionContext`;`ExecutionContextResolution`;`ExecutionEnvironmentIdentity`;`ControlledExecutionIntakeGuard`;`ContextReferenceResolution`;`ReferenceResolutionState`;`ExternalBodyExclusionGuard`;`SandboxAuditTrace` |
| `Boundary establishment and enforcement` | boundary requirement 合成与建立;backend capability / lifecycle 反馈收束 | `EstablishExecutionBoundary`;`ConsumeBackendCapabilitySummaryChanged`;`ConsumeIsolationBackendLifecycleSignal`;`RefreshBackendCapabilitySummaries` | `BoundaryRequirementSet`;`BackendCapabilitySummary`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`LeaseRecord`;`SandboxAuditTrace` |
| `Policy execution decision` | policy snapshot 与 fail-closed 裁定;policy summary stale 处理 | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged`;`PolicySummaryPort` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard`;`PolicyDecisionSummaryView`;`SandboxAuditTrace` |
| `Execution capture and material handoff` | 受控执行运行承接;capture 和候选材料收口;material / observability handoff | `StartControlledExecutionRun`;`RecordCaptureResult`;`OpenMaterialHandoff`;`ConsumeMaterialHandoffStatusChanged`;`ConsumeObservabilityHandoffStatusChanged`;`RetryPendingMaterialHandoffs` | `ControlledExecutionRun`;`CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`HandoffFact`;`CaptureCompletenessGuard`;`HandoffOwnershipGuard`;`SandboxEventRelayRecord`;`SandboxAuditTrace` |
| `Failure control and safety closure` | failure / control 收束;lease / orphan / cleanup / reaper;redline containment 与 investigation handoff | `SubmitSandboxControl`;`ClassifySandboxFailure`;`EvaluateCleanupReadiness`;`RecordRedlineContainment`;`ConsumeSandboxControlRequested`;`ConsumeInvestigationHandoffStatusChanged`;`RunLeaseOrphanReaper`;`EvaluatePendingCleanupGuards`;`MaintainRedlineContainmentHandoffs` | `FailureClassification`;`ControlFact`;`LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`RedlineContainment`;`ControlConflictGuard`;`CleanupSafetyGuard`;`RedlineContainmentGuard`;status views;`SandboxAuditTrace` |
| `Local reference, projection and derived support` | projection / derived / reconciliation 维护;event relay 发布与反馈;只读 read surface | `GetSandboxReadProjection`;`GetDerivedInspectPreviewTrend`;`GetBackendCapabilityComparison`;`GetSandboxReconciliationReport`;`PublishSandboxEventRelay`;`ConsumeSandboxTruthRelayFeedback`;`RebuildSandboxReadProjections`;`MaintainDerivedInspectPreviewTrend`;`RunSandboxReconciliation` | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport`;`SandboxEventRelayRecord`;`DerivedReadOnlyGuard`;`SandboxAuditTrace` |

---

## 10. 处理流覆盖清单

| 接口 | 是否画独立处理流 | 处理流归属 / 原因 |
|---|---|---|
| `OpenControlledExecutionContext` | 是 | P0 Command;受控执行正式入口。 |
| `EstablishExecutionBoundary` | 是 | P0 Command;coherent boundary 和 backend capability 可落实性。 |
| `EvaluatePolicyExecution` | 是 | P0 Command;policy fail-closed。 |
| `StartControlledExecutionRun` | 是 | P0 Command;真实执行承接,但不等于 tools / runtime 执行语义。 |
| `RecordCaptureResult` | 是 | P0 Command;capture 和候选材料收口。 |
| `OpenMaterialHandoff` | 是 | P0 Command;显式 handoff 和 ownership 边界。 |
| `SubmitSandboxControl` | 是 | P0 Command;control fact 和 conflict guard。 |
| `ClassifySandboxFailure` | 是 | P0 Command;稳定 failure classification。 |
| `EvaluateCleanupReadiness` | 是 | P0 Command;cleanup guard。 |
| `RecordRedlineContainment` | 是 | P0 Command;security redline containment。 |
| `GetSandboxExecutionStatus` | 否 | 复用通用 Query 只读路径,读取 status view。 |
| `GetBoundaryStatus` | 否 | 复用通用 Query 只读路径,读取 boundary status;不触发 backend 建立。 |
| `GetPolicyDecisionSummary` | 否 | 复用通用 Query 只读路径,读取 summary view。 |
| `GetCaptureSummary` | 否 | 复用通用 Query 只读路径,读取 capture summary。 |
| `GetMaterialHandoffStatus` | 否 | 复用通用 Query 只读路径,读取 handoff status;不重试。 |
| `GetFailureControlStatus` | 否 | 复用通用 Query 只读路径,读取 failure / control status。 |
| `GetCleanupReadiness` | 否 | 复用通用 Query 只读路径,读取 cleanup readiness;不重新评估。 |
| `GetRedlineContainmentStatus` | 否 | 复用通用 Query 只读路径,读取 containment status。 |
| `GetSandboxAuditTrace` | 否 | 复用通用 Query 只读路径,读取 audit trace page;不替代 observability store。 |
| `GetSandboxReadProjection` | 是 | 涉及 projection freshness 和 degraded marker。 |
| `GetDerivedInspectPreviewTrend` | 是 | 涉及 derived read-only、stale / rebuilding / failed / unavailable。 |
| `GetBackendCapabilityComparison` | 是 | 涉及 backend comparison derived view,不选择后端。 |
| `GetSandboxReconciliationReport` | 是 | 涉及 finding / degraded surface,不修复 truth。 |
| `ConsumeCallerContextReferenceChanged` | 是 | 改写 reference state、context resolution 和 projection stale marker。 |
| `ConsumePolicySummaryChanged` | 是 | 改写 policy snapshot stale marker 和 reference state。 |
| `ConsumeBackendCapabilitySummaryChanged` | 是 | 改写 backend summary、reference state 和 boundary / comparison stale marker。 |
| `ConsumeIsolationBackendLifecycleSignal` | 是 | 改写 lease / orphan / failure / cleanup marker,但不拥有 backend lifecycle truth。 |
| `ConsumeMaterialHandoffStatusChanged` | 是 | 改写 handoff status 和 cleanup reevaluation marker。 |
| `ConsumeObservabilityHandoffStatusChanged` | 是 | 改写 relay / observability handoff marker。 |
| `ConsumeSandboxControlRequested` | 是 | 改写 control fact / conflict evaluation marker。 |
| `ConsumeInvestigationHandoffStatusChanged` | 是 | 改写 redline / cleanup investigation summary marker。 |
| `ConsumeSandboxTruthRelayFeedback` | 是 | 改写 relay record feedback 和 reconciliation marker。 |
| `SandboxExecutionContextChanged` 等 Outbound Events | 否 | 不单独画图;由 event relay 发布 flow 统一覆盖。 |
| `PublishSandboxEventRelay` | 是 | 影响传播可靠性。 |
| `RefreshSandboxReferenceStates` | 是 | 影响 refs / safe summary freshness。 |
| `RefreshBackendCapabilitySummaries` | 是 | 影响 boundary 可落实性和 comparison freshness。 |
| `RetryPendingMaterialHandoffs` | 是 | 影响 material / observability handoff 可靠性。 |
| `RunLeaseOrphanReaper` | 是 | 影响 lease、orphan、cleanup 和 safety closure。 |
| `EvaluatePendingCleanupGuards` | 是 | 影响 cleanup readiness 和材料保留。 |
| `MaintainRedlineContainmentHandoffs` | 是 | 影响 redline investigation handoff。 |
| `RebuildSandboxReadProjections` | 是 | 影响 query consistency。 |
| `MaintainDerivedInspectPreviewTrend` | 是 | 影响 derived freshness。 |
| `RunSandboxReconciliation` | 是 | 影响 reconciliation finding 和 degraded marker。 |

---

## 11. 关键接口处理流

#### OpenControlledExecutionContext 处理流

```text
OpenControlledExecutionContext
  │
  ▼
Sandbox Sync Entry
  - 校验 ActorContext + CommandMetadata + IdempotencyKey
  - 拒绝匿名、旁路或缺少最小责任语境的请求
  │
  ▼
ControlledExecutionIntakeService
  - 读取 / 解析 ExecutionSourceRefSet 和 safe summary refs
  - 调用 ControlledExecutionContext.open_from_request(
      ExecutionSourceRefSet source_refs,
      ExecutionResponsibilityContext responsibility_context,
      SandboxAuditTrace trace)
  │
  ▼
ControlledExecutionContext / ExecutionContextResolution / ExecutionEnvironmentIdentity
  - 调用 ExecutionContextResolution.evaluate(
      ContextReferenceResolution context_resolution,
      ControlledExecutionIntakeGuard intake_guard)
  - 调用 ExecutionEnvironmentIdentity.bind(
      ControlledExecutionContext context,
      ContextRefSummarySet safe_summaries,
      SandboxAuditTrace trace)
  │
  ▼
SandboxTruthPersistencePort + Audit + Relay Marker
  - 保存 accepted / rejected / pending / unresolved 语境
  - 保存 execution identity、audit trace 和 projection stale marker
  │
  ▼
ControlledExecutionOpenResult / SandboxExecutionContextChanged
```

关键设计点:

- 本流只建立受控执行语境、resolution 和 execution environment identity,不保存 identity / work / runner / tool / runtime 正文。
- accepted 只说明 sandbox 正式入口成立,不代表 boundary、policy、run、capture 或 handoff 已完成。
- idempotency duplicate result、actor authority、command result store 和 exact rejection reason schema 留给详细设计。

#### ConsumeCallerContextReferenceChanged / RefreshSandboxReferenceStates 处理流

```text
ConsumeCallerContextReferenceChanged / RefreshSandboxReferenceStates
  │
  ▼
Sandbox Async Consumer / Operations Job
  - 校验 event envelope / source event id / dedup key / JobMetadata
  - 选择 caller refs、policy refs、investigation refs 或 tracked refs
  │
  ▼
ContextReferenceResolutionService
  - 调用 ContextReferenceResolverPort 读取 refs / safe summaries / missing markers
  - 调用 ExternalBodyExclusionGuard.evaluate(
      ReferenceResolutionState reference_state)
  │
  ▼
ReferenceResolutionState / ContextReferenceResolution
  - 标记 resolved / unresolved / stale / invalid / unavailable
  - 拒绝 external body marker,只保存 safe summary refs
  │
  ▼
SandboxProjectionPersistencePort + Audit Marker
  - 保存 reference state、context resolution 和 related stale markers
  │
  ▼
Consumer Receipt / Reference Refresh Report
```

关键设计点:

- 本流用于 refs 和 safe summary freshness,不得在 consumer 或 refresh job 中补造 `ControlledExecutionContext` success。
- 外部正文越界必须被 `ExternalBodyExclusionGuard` 明确拒绝或记录 marker,不能以排障便利进入 sandbox truth。
- resolver outcome enum、reference bundle key、dedup receipt 和 stale cursor 来源后移到详细设计。

#### EstablishExecutionBoundary 处理流

```text
EstablishExecutionBoundary
  │
  ▼
Sandbox Sync Entry
  - 校验 ControlledExecutionContextRef + ExecutionEnvironmentIdentityRef
  - 校验 CommandMetadata + IdempotencyKey + trace context
  - 从generation-scoped runtime handle取得runtime generation
  - 使用builder注入的validated boundary profile / limit template
  - 校验显式四维 requirements
  │
  ▼
BoundaryEstablishmentService
  - 加载 ControlledExecutionContext、ExecutionEnvironmentIdentity
  - 拒绝context / identity / profile / template / generation错配
  - 调用 BoundaryRequirementSet.from_context_and_requirements(
      ControlledExecutionContext context,
      ExecutionEnvironmentIdentity identity,
      ResourceRequirementSet resource_requirements,
      FilesystemRequirementSet filesystem_requirements,
      NetworkRequirementSet network_requirements,
      ProcessRequirementSet process_requirements,
      BoundaryLifecycleRequirementSet lifecycle_requirements,
      SandboxOpaqueRef boundary_profile_ref,
      SandboxOpaqueRef limit_template_ref,
      SandboxOpaqueRef runtime_generation_ref)
  - 调用 BackendCapabilityPort 读取并校验 BackendCapabilitySummary
  │
  ▼
BoundaryEstablishmentDecision / CoherentBoundary
  - 调用 BoundaryEstablishmentDecision.decide(
      BoundaryRequirementSet requirement_set,
      BackendCapabilitySummary backend_summary,
      BoundaryCoherenceGuard coherence_guard)
  - 需要真实承载时调用 IsolationBackendPort 建立 handle
  - 调用 CoherentBoundary.establish(
      BoundaryRequirementSet requirement_set,
      IsolationEnvironmentHandle isolation_handle,
      SandboxAuditTrace trace)
  │
  ▼
SandboxTruthPersistencePort
  - 保存 requirement、decision、coherent boundary、handle 和 LeaseRecord
  - 保存 audit trace、boundary status stale marker 和 relay record
  │
  ▼
BoundaryEstablishmentResult / SandboxBoundaryChanged
```

关键设计点:

- coherent boundary 必须整体成立;resource / filesystem / network / process 任一必需限制不可落实时不能 silent degrade。
- `IsolationBackendPort` 只返回 handle / lifecycle summary / failure markers,backend SDK raw response 不进入 domain truth。
- 本流不得加载或消费 `PolicyApplicabilitySnapshot` / `PolicyExecutionDecision`;Policy flow 位于 Boundary 之后,读取已保存的 requirement / coherence 再做 fail-closed 裁定。
- backend capability matrix、adapter error mapping、lease window、release call 和 fake parity 留给详细设计 / 配置 / 测试。

#### EvaluatePolicyExecution 处理流

```text
EvaluatePolicyExecution
  │
  ▼
Sandbox Sync Entry
  - 校验 policy source refs、AuthorizationSummary 和 high-risk markers
  │
  ▼
PolicyExecutionService
  - 调用 PolicySummaryPort 读取给定 policy / authorization safe summary
  - 调用 PolicyApplicabilitySnapshot.create(
      PolicySourceRefSet policy_source_refs,
      AuthorizationSummary authorization_summary,
      BoundaryRequirementSet boundary_requirement_set)
  │
  ▼
PolicyExecutionDecision / HighRiskActionDecision
  - 调用 PolicyApplicabilityGuard 检查适用性
  - 调用 PolicyExecutionDecision.evaluate(
      PolicyApplicabilitySnapshot policy_snapshot,
      FailClosedPolicyGuard fail_closed_guard,
      HighRiskActionMarkerSet high_risk_markers)
  │
  ▼
SandboxTruthPersistencePort + Audit + Projection Marker
  - 保存 accepted / rejected / blocked / pending / fail-closed decision
  - 保存 high-risk action decision 和 policy summary stale marker
  │
  ▼
PolicyExecutionDecisionResult / SandboxPolicyDecisionChanged
```

关键设计点:

- sandbox 只消费给定 policy / authorization 摘要,不生成 policy definition、approval、allowlist、capability 或 DSL truth。
- missing、conflicted、unsupported、stale 或不可解析必须进入 rejected / pending / fail-closed surface,不得默认继续。
- policy source matrix、high-risk action taxonomy、unsupported reason schema 和 approval linkage 留给详细设计 / 配置 / 测试。

#### StartControlledExecutionRun 处理流

```text
StartControlledExecutionRun
  │
  ▼
Sandbox Sync Entry
  - 校验 context、coherent boundary、isolation handle 和 policy decision refs
  │
  ▼
ControlledExecutionCarrierService
  - 加载 ControlledExecutionContext、CoherentBoundary、PolicyExecutionDecision
  - 校验 policy accepted / allowed 和 boundary established
  - 调用 IsolationBackendPort 进入 launch / lifecycle control boundary
  │
  ▼
ControlledExecutionRun
  - 调用 ControlledExecutionRun.start(
      ControlledExecutionContext context,
      CoherentBoundary boundary,
      PolicyExecutionDecision policy_decision,
      IsolationEnvironmentHandle handle)
  - 记录 preparing / running / failed / terminated 初始运行事实
  │
  ▼
SandboxTruthPersistencePort + Audit + Relay Marker
  - 保存 run lifecycle fact、audit trace 和 run status stale marker
  │
  ▼
ControlledExecutionRunResult / SandboxRunChanged
```

关键设计点:

- 本流承接真实执行隔离层运行事实,不解释工具语义、不推进 runtime agent loop、不拥有 member host lifecycle。
- policy accepted 不等于 run started;run started 不等于 runtime ExecutionInstance completed。
- 同步启动还是排队准备、backend launch outcome、worker ownership 和 run heartbeat 留给详细设计 / 配置 / 实施计划。

#### RecordCaptureResult 处理流

```text
RecordCaptureResult
  │
  ▼
Sandbox Sync Entry / Capture Intake
  - 校验 ControlledExecutionRunRef、ExecutionOutputSummary 和 material refs
  - 校验 CommandMetadata + IdempotencyKey + trace context
  │
  ▼
CaptureHandoffService
  - 加载 ControlledExecutionRun 和当前 capture state
  - 调用 CaptureFact.record(
      ControlledExecutionRun run,
      ExecutionOutputSummary output_summary,
      CaptureCompletenessGuard completeness_guard,
      SandboxAuditTrace trace)
  │
  ▼
CaptureFact / CapturedMaterialRef / ObservabilityMaterial
  - 记录 complete / partial / failed / unavailable
  - 绑定 candidate material refs 和 observability material refs
  │
  ▼
SandboxTruthPersistencePort + Audit + Relay Marker
  - 保存 capture fact、material refs、observability material 和 summary stale marker
  │
  ▼
CaptureCommandResult / SandboxCaptureChanged
```

关键设计点:

- capture fact 只说明 sandbox 捕获了输出 / 候选材料 / 观测材料,不宣布 formal artifact、baseline、evidence 或 observability store truth。
- partial / failed / unavailable capture 必须可见,不能被 handoff 或 query 静默抹平。
- 大材料存储、redaction、digest、retention、material location 和 safe summary schema 留给详细设计 / 配置 / 测试。

#### OpenMaterialHandoff / RetryPendingMaterialHandoffs 处理流

```text
OpenMaterialHandoff / RetryPendingMaterialHandoffs
  │
  ▼
Sandbox Sync Entry / Operations Job
  - Command 校验 CaptureFactRef、material refs、target refs
  - Job 选择 pending / failed / retryable HandoffFact
  │
  ▼
CaptureHandoffService
  - 加载 CaptureFact、CapturedMaterialRefSet、ObservabilityMaterial
  - 调用 HandoffFact.open(
      CaptureFact capture,
      CapturedMaterialRefSet material_refs,
      ObservabilityMaterial observability_material,
      HandoffTargetRefSet target_refs)
  - 调用 HandoffOwnershipGuard.evaluate(HandoffFact handoff)
  │
  ▼
MaterialHandoffPort / ObservabilityMaterialPort / SandboxEventRelayRecord
  - 交接 candidate material / observability material refs
  - 调用 SandboxEventRelayRecord.open(
      SandboxSourceFactRef source_fact_ref,
      EventRelayTargetRefSet target_refs,
      SandboxEventRelayKind relay_kind)
  │
  ▼
SandboxTruthPersistencePort + Handoff Status View
  - 保存 handoff fact、relay record、pending / delivered / failed / retryable marker
  │
  ▼
MaterialHandoffCommandResult / Handoff Retry Report / SandboxMaterialHandoffChanged
```

关键设计点:

- handoff fact 是显式交接事实,不迁移下游 ownership;artifact、runtime、runner、observability 是否接收为正式 truth 由下游拥有。
- retry 只重试交接,不重新 capture、不伪造下游 ack、不清理未安全交接材料。
- handoff ack protocol、port outcome enum、retry / backoff、dead-letter、delivery receipt schema 留给详细设计 / 配置 / 测试。

#### SubmitSandboxControl / ClassifySandboxFailure / ConsumeSandboxControlRequested 处理流

```text
SubmitSandboxControl / ClassifySandboxFailure / ConsumeSandboxControlRequested
  │
  ▼
Sandbox Sync Entry / Async Control Consumer
  - 校验 control source、control kind、context ref、dedup key 和 trace context
  - Consumer 不把外部 control 直接当业务 recover
  │
  ▼
FailureControlService
  - 加载 existing ControlFact、run / capture / policy / boundary refs
  - 调用 ControlConflictGuard.evaluate(
      ControlFact incoming_control,
      ControlFact existing_control)
  - 调用 FailureClassification.classify(
      FailureSourceMarkerSet source_markers,
      ControlledExecutionContext context,
      SandboxAuditTrace trace)
  │
  ▼
ControlFact / FailureClassification / FailureControlStatusView
  - 记录 kill / cancel / deny / timeout / backend failure / redline-like marker
  - 记录 stable / conflict / terminal / pending 状态来源
  │
  ▼
SandboxTruthPersistencePort + Audit + Projection Marker
  - 保存 control fact、failure classification、failure status stale marker 和 relay record
  │
  ▼
SandboxControlCommandResult / FailureClassificationResult / SandboxFailureChanged
```

关键设计点:

- control fact 是 sandbox 收束事实,不是 runtime recover、business replay、operator UI action 或 member host lifecycle 事实。
- duplicate / conflict control 必须通过 `ControlConflictGuard` 表达,不能靠最后写入覆盖。
- failure taxonomy、control kind enum、terminal condition、adapter kill outcome 和 test matrix 留给 Step 9 / Step 10 / `03` / `05`。

#### RunLeaseOrphanReaper / EvaluateCleanupReadiness / EvaluatePendingCleanupGuards 处理流

```text
RunLeaseOrphanReaper / EvaluateCleanupReadiness / EvaluatePendingCleanupGuards
  │
  ▼
Sandbox Operations Job / Cleanup Command
  - Job 选择 expiring / expired LeaseRecord、orphan markers 或 pending CleanupGuard
  - Command 校验 capture、handoff 和 investigation summary refs
  │
  ▼
CleanupReaperService
  - 加载 LeaseRecord、IsolationEnvironmentHandle、CaptureFact、HandoffFact
  - 调用 CleanupGuard.evaluate(
      CaptureFact capture,
      HandoffFact handoff,
      InvestigationHandoffSummary investigation_summary)
  - 调用 CleanupSafetyGuard.evaluate(CleanupGuard cleanup_guard)
  │
  ▼
LeaseRecord / OrphanRecoveryRecord / CleanupGuard
  - 记录 active / expiring / expired / orphaned / recovered
  - 记录 cleanup allowed / blocked / pending / completed
  │
  ▼
IsolationBackendPort + SandboxTruthPersistencePort
  - 仅在 cleanup allowed 后释放或回收隔离环境
  - 保存 cleanup readiness、orphan recovery、audit trace 和 event marker
  │
  ▼
CleanupReadinessCommandResult / Reaper Report / SandboxCleanupChanged
```

关键设计点:

- cleanup / reaper 受 capture、handoff、investigation 和 redline guard 约束,不得先删证据。
- orphan recovery 只收束隔离层生命周期,不重写 runtime、artifact、observability 或 investigation truth。
- release adapter outcome、lease expiry policy、cleanup retention policy、reaper scheduling 和 safe deletion contract 留给详细设计 / 配置 / 测试。

#### RecordRedlineContainment / MaintainRedlineContainmentHandoffs 处理流

```text
RecordRedlineContainment / MaintainRedlineContainmentHandoffs
  │
  ▼
Sandbox Sync Entry / Redline Maintenance Job
  - 校验 context、boundary、redline kind、investigation summary 和 trace context
  - Job 选择 handoff-pending RedlineContainment
  │
  ▼
RedlineContainmentService
  - 加载 ControlledExecutionContext、CoherentBoundary、FailureClassification?
  - 调用 RedlineContainment.contain(
      RedlineContainmentGuard guard,
      SandboxAuditTrace trace)
  - 调用 InvestigationHandoffPort 交接 redline / failure / cleanup refs
  │
  ▼
RedlineContainment / RedlineContainmentView
  - 记录 detected / contained / handoff-pending / released / terminal
  - 记录 investigation summary refs 和 safety markers
  │
  ▼
SandboxTruthPersistencePort + Relay Marker
  - 保存 containment fact、handoff marker、audit trace 和 cleanup block marker
  │
  ▼
RedlineContainmentCommandResult / Redline Handoff Report / SandboxRedlineContainmentChanged
```

关键设计点:

- redline containment 是安全红线保守收束,不是调查生命周期、operator UI 或安全裁决正文。
- containment release / terminal 不得由 event feedback 或 query 隐式完成,必须有正式状态触发。
- redline taxonomy、release condition、investigation handoff outcome 和 safety review test gate 留给 Step 9 / Step 10 / `03` / `05` / `06`。

#### GetSandboxReadProjection / GetDerivedInspectPreviewTrend / GetBackendCapabilityComparison / GetSandboxReconciliationReport 处理流

```text
GetSandboxReadProjection / GetDerivedInspectPreviewTrend
GetBackendCapabilityComparison / GetSandboxReconciliationReport
  │
  ▼
SandboxReadService
  - 校验 ActorContext + QueryMetadata + scope / pagination / consistency hint
  - 加载 projection identity、derived state 或 reconciliation report ref
  │
  ▼
Derived Read Guard
  - 调用 DerivedReadOnlyGuard.evaluate(
      DerivedInspectPreviewTrendState derived_state)
  - 检查 projection freshness、degraded markers 和 visibility surface
  │
  ▼
SandboxReadProjection / DerivedInspectPreviewTrendView
BackendCapabilityComparisonView / SandboxReconciliationReport
  - 只读 view、trend、comparison 或 finding
  - 暴露 fresh / stale / rebuilding / failed / unavailable / degraded
  │
  ▼
Query Response
  - 返回 read projection、derived view、comparison view 或 reconciliation report
  - 不刷新 refs、不重建 projection、不修复 truth
```

关键设计点:

- derived / comparison / reconciliation 只能读取或解释已成立 truth 与 projection,不得作为 capture、handoff、cleanup 或 backend selection 的写路径。
- `GetBackendCapabilityComparison` 不选择正式后端,`GetSandboxReconciliationReport` 不修复 truth。
- projection identity、visibility resolution、page-level access、projection lookup 和 degraded mapper 留给详细设计。

#### RebuildSandboxReadProjections / MaintainDerivedInspectPreviewTrend / RunSandboxReconciliation 处理流

```text
RebuildSandboxReadProjections / MaintainDerivedInspectPreviewTrend / RunSandboxReconciliation
  │
  ▼
Sandbox Operations Job
  - 校验 JobMetadata + job idempotency key + cursor / scope
  - 加载 committed sandbox truth cursor、projection stale markers 或 derived markers
  │
  ▼
SandboxDerivedMaintenanceService
  - 调用 SandboxReadProjection.create(
      ControlledExecutionContext context,
      SandboxStatusViewRefSet status_view_refs)
  - 调用 DerivedInspectPreviewTrendState.start_rebuild(
      DerivedRebuildMarker rebuild_marker)
  - 调用 SandboxReconciliationReport.create(
      SandboxReconciliationScopeRef scope_ref,
      SandboxTruthRefSet truth_refs,
      SandboxProjectionRefSet projection_refs)
  │
  ▼
SandboxProjectionPersistencePort
  - 保存 rebuilt projection、derived state / view 或 reconciliation report
  - 标记 fresh / stale / failed / degraded
  │
  ▼
ProjectionChanged / DerivedViewChanged / ReconciliationFindingAvailable
```

关键设计点:

- rebuild 和 reconciliation 只能从 committed truth cursor / formal projection stale marker 出发,不得用 page cursor、timestamp 或 adapter error 自行反推 truth。
- job 可以暴露 findings 和 degraded markers,但修复必须走正式 Command / Job 规则。
- rebuild plan、truth cursor source、projection schema、job report schema 和 fake / durable parity 留给详细设计。

#### PublishSandboxEventRelay / ConsumeSandboxTruthRelayFeedback 处理流

```text
PublishSandboxEventRelay / ConsumeSandboxTruthRelayFeedback
  │
  ▼
Sandbox Operations Job / Relay Feedback Consumer
  - Job 选择 pending / failed / retryable SandboxEventRelayRecord
  - Consumer 校验 relay feedback envelope、event relay record ref 和 dedup key
  │
  ▼
EventRelayService
  - 调用 EventRelayPort 发布 outbound event ref、truth ref、change kind
  - 调用 SandboxEventRelayRecord.open(
      SandboxSourceFactRef source_fact_ref,
      EventRelayTargetRefSet target_refs,
      SandboxEventRelayKind relay_kind) for new relay records
  │
  ▼
SandboxEventRelayRecord / SandboxReconciliationReport Marker
  - 标记 delivered / failed / retryable / stale
  - 反馈异常时写 reconciliation marker,不回滚 source fact
  │
  ▼
SandboxTruthPersistencePort + Projection Marker
  - 保存 relay status、audit trace 和 derived / projection stale marker
  │
  ▼
Publication Report / Consumer Receipt
```

关键设计点:

- relay 发布基于已提交 sandbox fact;发布失败不回滚 `ControlledExecutionContext`、boundary、policy、capture、handoff、failure、cleanup 或 redline truth。
- feedback 只改变 relay record / reconciliation marker,不得重写 source fact。
- event payload schema、topic routing、outbox record save shape、publisher dispatch、dead-letter 和 delivery receipt 留给详细设计 / 测试。

---

## 12. 处理流与对象 / 接口对应关系

| 处理流 | 主要接口 | Step 6 对象 | 主要 port / persistence | 输出 / marker |
|---|---|---|---|---|
| 受控执行请求受理 / 拒绝 | `OpenControlledExecutionContext` | `ControlledExecutionContext`;`ExecutionContextResolution`;`ExecutionEnvironmentIdentity`;`ControlledExecutionIntakeGuard`;`SandboxAuditTrace` | `ContextReferenceResolverPort`;`SandboxTruthPersistencePort` | `ControlledExecutionOpenResult`;`SandboxExecutionContextChanged`;projection stale marker |
| refs / safe summary 解析与刷新 | `ConsumeCallerContextReferenceChanged`;`RefreshSandboxReferenceStates` | `ContextReferenceResolution`;`ReferenceResolutionState`;`ExternalBodyExclusionGuard`;`SandboxAuditTrace` | `ContextReferenceResolverPort`;`SandboxProjectionPersistencePort` | consumer receipt;reference refresh report;stale markers |
| boundary requirement 合成与建立 | `EstablishExecutionBoundary` | `BoundaryRequirementSet`;`BackendCapabilitySummary`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`LeaseRecord` | `BackendCapabilityPort`;`IsolationBackendPort`;`SandboxTruthPersistencePort` | `BoundaryEstablishmentResult`;`SandboxBoundaryChanged`;lease marker |
| policy snapshot 与 fail-closed 裁定 | `EvaluatePolicyExecution`;`ConsumePolicySummaryChanged` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicyApplicabilityGuard`;`FailClosedPolicyGuard` | `PolicySummaryPort`;`SandboxTruthPersistencePort` | `PolicyExecutionDecisionResult`;`SandboxPolicyDecisionChanged`;policy stale marker |
| 受控执行运行承接 | `StartControlledExecutionRun` | `ControlledExecutionRun`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`PolicyExecutionDecision`;`SandboxAuditTrace` | `IsolationBackendPort`;`SandboxTruthPersistencePort` | `ControlledExecutionRunResult`;`SandboxRunChanged`;run status stale marker |
| capture 和候选材料收口 | `RecordCaptureResult` | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial`;`CaptureCompletenessGuard`;`CaptureSummaryView`;`SandboxAuditTrace` | `SandboxTruthPersistencePort`;material state carrier | `CaptureCommandResult`;`SandboxCaptureChanged`;capture summary stale marker |
| material / observability handoff | `OpenMaterialHandoff`;`RetryPendingMaterialHandoffs`;handoff status consumers | `HandoffFact`;`HandoffOwnershipGuard`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord`;`SandboxAuditTrace` | `MaterialHandoffPort`;`ObservabilityMaterialPort`;`EventRelayPort`;`SandboxTruthPersistencePort` | handoff result;handoff retry report;`SandboxMaterialHandoffChanged` |
| failure / control 收束 | `SubmitSandboxControl`;`ClassifySandboxFailure`;`ConsumeSandboxControlRequested` | `FailureClassification`;`ControlFact`;`ControlConflictGuard`;`FailureControlStatusView`;`SandboxAuditTrace` | `SandboxTruthPersistencePort`;`EventRelayPort` | control result;failure result;`SandboxFailureChanged`;`SandboxControlChanged` |
| lease / orphan / cleanup / reaper | `RunLeaseOrphanReaper`;`EvaluateCleanupReadiness`;`EvaluatePendingCleanupGuards` | `LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard`;`CleanupSafetyGuard`;`CleanupReadinessView`;`SandboxAuditTrace` | `IsolationBackendPort`;`InvestigationHandoffPort`;`SandboxTruthPersistencePort` | cleanup readiness;reaper report;`SandboxCleanupChanged` |
| redline containment 与 investigation handoff | `RecordRedlineContainment`;`MaintainRedlineContainmentHandoffs` | `RedlineContainment`;`RedlineContainmentGuard`;`RedlineContainmentView`;`ReferenceResolutionState`;`SandboxAuditTrace` | `InvestigationHandoffPort`;`EventRelayPort`;`SandboxTruthPersistencePort` | containment result;handoff report;`SandboxRedlineContainmentChanged` |
| projection / derived / reconciliation 读取与维护 | derived Query;`RebuildSandboxReadProjections`;`MaintainDerivedInspectPreviewTrend`;`RunSandboxReconciliation` | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView`;`SandboxReconciliationReport`;`DerivedReadOnlyGuard` | `SandboxProjectionPersistencePort`;`BackendCapabilityPort` | query response;projection / derived / reconciliation events |
| event relay 发布与反馈 | `PublishSandboxEventRelay`;`ConsumeSandboxTruthRelayFeedback`;Outbound Events | `SandboxEventRelayRecord`;`SandboxAuditTrace`;`SandboxReconciliationReport` | `EventRelayPort`;`SandboxTruthPersistencePort`;`SandboxProjectionPersistencePort` | publication report;consumer receipt;relay feedback marker |

---

## 13. 未展开独立处理流的取舍说明

| 接口 / 类别 | 取舍 | 原因 |
|---|---|---|
| 简单 status / summary Query | 不画独立图 | 已由通用 Query 只读路径覆盖;这些 Query 不包含 refresh、repair、handoff、cleanup 或 derived rebuild。 |
| `GetSandboxAuditTrace` | 不画独立图 | 只分页读取 `SandboxAuditTrace` / audit projection,不替代 observability store,与通用 Query 同构。 |
| 单个 Outbound Event | 不画独立图 | Outbound Event 由 `PublishSandboxEventRelay` 统一发布,逐 event 图会重复且容易提前写 payload / topic。 |
| `ConsumeMaterialHandoffStatusChanged` / `ConsumeObservabilityHandoffStatusChanged` | 不分别画两张图 | 已由 material / observability handoff flow 覆盖,差异只在 handoff target / status source。 |
| `ConsumeBackendCapabilitySummaryChanged` / `RefreshBackendCapabilitySummaries` | 并入 boundary / refs / derived flow | backend capability 只作为 boundary 判断和 comparison freshness 输入,不形成独立业务 truth flow。 |
| `ConsumeIsolationBackendLifecycleSignal` | 并入 boundary、failure、lease / cleanup flow | lifecycle signal 可能影响 lease、failure、cleanup,但不拥有 backend lifecycle truth。 |
| `ConsumeInvestigationHandoffStatusChanged` | 并入 cleanup 与 redline flow | investigation summary 只影响 cleanup guard / redline handoff marker,不拥有 investigation lifecycle。 |
| `RefreshSandboxReferenceStates` | 与 refs / safe summary flow 合并 | refresh 与 caller context consumer 共用 resolver、body exclusion 和 stale marker 规则。 |
| `RefreshBackendCapabilitySummaries` | 与 boundary / derived comparison flow 合并 | capability refresh 不建立 boundary,只更新 summary 和 stale markers。 |
| `SandboxProjectionChanged`;`SandboxDerivedViewChanged`;`SandboxReconciliationFindingAvailable` | 不画独立图 | 这些是 maintenance job 的输出结果,不应反向成为新的写路径。 |

未展开并不表示接口遗漏。上述接口均在 §10 覆盖清单和 §12 对应关系中有处理流口径,后续 `03-详细设计.md` 可在对应 flow family 下继续展开协议、函数、事务和测试。

---

## 14. 本步设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 `OpenControlledExecutionContext` 拆成两个独立 Command flow | 不拆 Command,但在 flow 内显式拆阶段 | Step 7 已把正式受理与 identity bind 合并为一个概要 Command;Step 8 通过 `ExecutionContextResolution` 和 `ExecutionEnvironmentIdentity.bind` 表达内部阶段。 |
| 是否把 `EstablishExecutionBoundary` 和 `StartControlledExecutionRun` 合并 | 不合并 | boundary 成立与受控执行承接必须分离,避免 boundary established 被误解为执行已经运行。 |
| 是否把 policy consumer 直接裁定 policy result | 不允许 | policy summary changed 只能产生 stale / snapshot marker;正式裁定仍走 `EvaluatePolicyExecution`。 |
| 是否让 capture flow 直接创建 handoff | 不采用 | capture 与 handoff 分层是核心边界;capture complete 不代表下游接收或 ownership 迁移。 |
| 是否让 cleanup / reaper 直接调用 backend release | 仅 allowed 后可以 | cleanup guard / safety guard / investigation summary 必须先成立,防止先删证据。 |
| 是否为每个 Query 画图 | 不采用 | 简单 status / summary 复用通用读路径;复杂 derived / reconciliation / comparison 独立展开。 |
| 是否在 flow 里写 repository / UoW / outbox trait 方法 | 不采用 | 概要层只点名 persistence / relay / projection 角色,完整 callable surface 属于详细设计。 |

---

## 15. 处理流归属停审记录

| 主要组成部分 | 结论 | 说明 |
|---|---|---|
| `Controlled execution intake and identity` | pass | intake / refs flow 均回指 context、resolution、identity、reference state 和 body exclusion guard;未保存外部正文或建立第二入口。 |
| `Boundary establishment and enforcement` | pass | boundary flow 覆盖 requirement、capability、decision、coherent boundary、handle 和 lease;未锁定后端产品或允许 silent degrade。 |
| `Policy execution decision` | pass | policy flow 覆盖 snapshot、decision、high-risk action 和 fail-closed guard;consumer 只标记 stale,未生成 policy source truth。 |
| `Execution capture and material handoff` | pass | run、capture、handoff 和 retry flow 保持分层;未把 candidate material 升格为 artifact / evidence / observability truth。 |
| `Failure control and safety closure` | pass | control、failure、lease、orphan、cleanup、reaper、redline 和 investigation handoff flow 均有正式对象承接;未推进 runtime recover 或业务 replay。 |
| `Local reference, projection and derived support` | pass | read projection、derived、backend comparison、reconciliation 和 relay flow 只读 / 维护可重建面;未反写核心 truth。 |

---

## 16. 跨处理流一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否覆盖 Step 7 §16 全部候选 flow | pass | 12 条候选均已在 §11 独立展开或作为同构 flow family 覆盖。 |
| P0 Command 是否都有独立处理流 | pass | Step 7 的 10 个 Command 均有独立 Command flow 或同构 flow family。 |
| 会改写本地状态的 Consumer 是否都有处理流口径 | pass | refs、policy、backend、lifecycle、handoff、control、investigation 和 relay feedback 均有 flow 归属。 |
| 影响一致性 / 传播可靠性的 Job 是否都有处理流口径 | pass | relay、refresh、handoff retry、reaper、cleanup、redline、projection、derived、reconciliation 均覆盖。 |
| 处理流点名对象是否都能回到 Step 6 | pass | 所有正式对象均来自 Step 6 主控或对象附录;service / port 只作为 Step 4 / Step 7 代码主体 / 接缝角色。 |
| 是否引入 Step 7 未定义的新正式接口 | pass | 未新增 API / consumer / event / job;只组合 Step 7 已定义接口。 |
| 是否越过 tools / runtime / member-service / runner 边界 | pass | run flow 明确不解释工具语义、不推进 runtime loop、不拥有 member host lifecycle 或 runner UI。 |
| 是否污染 artifact / observability / policy / investigation truth | pass | capture、handoff、observability、policy 和 investigation 均以 refs / summary / handoff / marker 交接。 |
| 是否保持 Command / Query / Consumer / Job 分类 | pass | 写核心 truth 走 Command;只读走 Query;外部事实走 Consumer;维护传播走 Job。 |
| 是否保护 cleanup / redline 安全红线 | pass | cleanup 先走 guard / safety / investigation summary;redline 必须 containment 和 investigation handoff marker。 |
| 是否提前进入详细设计 | pass | 未写完整函数签名、DTO、event schema、repository 方法、事务、SQL、错误码、retry、topic、配置 key、测试或实施 boundary。 |
| 是否为 Step 9 状态机保留明确触发 | pass | §17 给出状态主题和触发 flow,状态集合 / 迁移细节留给 Step 9。 |

---

## 17. Step 9 状态机反查清单

| 状态主题 | Step 8 触发处理流 | 预期 Step 9 主语 |
|---|---|---|
| intake accepted / rejected / pending / unresolved | `OpenControlledExecutionContext`;refs / safe summary flow | `ControlledExecutionContext`;`ExecutionContextResolution` |
| execution identity active / closed / invalidated | `OpenControlledExecutionContext`;backend lifecycle / cleanup / redline 后续状态收束 | `ExecutionEnvironmentIdentity` |
| reference resolved / unresolved / stale / invalid / unavailable | refs / safe summary 解析与刷新 | `ReferenceResolutionState`;`ContextReferenceResolution` |
| boundary required / established / rejected / pending / failed / released | `EstablishExecutionBoundary`;backend lifecycle signal;reaper flow | `BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle` |
| backend capability usable / stale / unsupported / unavailable | boundary flow;backend capability refresh / consumer;backend comparison query | `BackendCapabilitySummary`;`BackendCapabilityComparisonView` |
| policy accepted / rejected / blocked / pending / fail-closed | `EvaluatePolicyExecution`;policy summary stale flow | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` |
| controlled run preparing / running / completed / failed / terminated | `StartControlledExecutionRun`;capture;failure / control;backend lifecycle signal | `ControlledExecutionRun` |
| capture complete / partial / failed / unavailable | `RecordCaptureResult` | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterial` |
| handoff pending / delivered / failed / retryable | `OpenMaterialHandoff`;handoff status consumers;retry job | `HandoffFact`;`MaterialHandoffStatusView`;`SandboxEventRelayRecord` |
| failure / control stable / conflict / terminal | failure / control 收束 flow | `FailureClassification`;`ControlFact`;`FailureControlStatusView` |
| lease active / expiring / expired / orphaned / recovered | boundary flow;backend lifecycle signal;`RunLeaseOrphanReaper` | `LeaseRecord`;`OrphanRecoveryRecord` |
| cleanup allowed / blocked / pending / completed | `EvaluateCleanupReadiness`;`EvaluatePendingCleanupGuards`;investigation status consumer | `CleanupGuard`;`CleanupReadinessView` |
| redline detected / contained / handoff-pending / released / terminal | `RecordRedlineContainment`;`MaintainRedlineContainmentHandoffs`;investigation status consumer | `RedlineContainment`;`RedlineContainmentView` |
| projection fresh / stale / rebuilding / failed / unavailable | projection / derived maintenance flow;query flow | `SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`DerivedInspectPreviewTrendView` |
| relay pending / delivered / failed / retryable | event relay publish / feedback flow | `SandboxEventRelayRecord` |
| reconciliation clean / finding / degraded / stale | `RunSandboxReconciliation`;relay feedback;derived maintenance | `SandboxReconciliationReport` |

Step 9 必须从本表和 Step 6 状态候选继续收敛状态集合、允许迁移、禁止迁移和触发接口。不得在 Step 9 新增处理流中未出现的新状态主语;若发现必要新主语,必须先回到 Step 6 / Step 8 修正。

---

## 18. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §8 “关键处理流 / 重要函数数据流”引用本文件 §8 的四类通用处理流骨架。
- §8 摘录 §9 的按主要组成部分处理流清单,作为正式章节总览。
- §8 选择性摘录 §11 中 12 条关键处理流图;如果正式正文篇幅需要压缩,必须保留每个 flow 的边界、禁止事项和下游承接。
- §8 摘录 §10 或 §13 作为接口覆盖与未展开说明,避免读者误认为未画图的 Query / Event / Consumer / Job 被遗漏。
- §8 不搬入本文件 §6 的旧材料诊断全文,但应保留旧 `SandboxService` / backend / retry / output 线索为 historical material 的说明。
- §9 状态机必须引用本文件 §17 的状态机反查清单。

---

## 19. 待确认事项

| 待确认项 | 当前处理 | 后续落点 |
|---|---|---|
| Command result / duplicate replay / stored result surface | 当前只标注 Command 必须携带 idempotency key 和 result surface。 | `03-详细设计.md`;`05-测试方案.md` |
| `SandboxTruthPersistencePort` / `SandboxProjectionPersistencePort` callable surface | 当前只点名 persistence boundary,不写 repository / UoW 方法。 | `03-详细设计.md`;`07-实施计划.md` |
| backend launch / release / lifecycle outcome enum | 当前通过 `IsolationBackendPort` 和 markers 表达,不锁产品。 | `03`;`04`;`05`;`07` |
| policy source matrix 和 high-risk action taxonomy | 当前通过 given policy / authorization summary 与 fail-closed guard 表达。 | Step 9 / Step 10 / `03`;`05`;`06` |
| material storage、retention、safe summary、redaction、digest | 当前只表达 capture fact、material refs 和 handoff fact。 | `03`;`04`;`05`;`06`;`07` |
| event payload、topic、outbox schema、publisher dispatch | 当前只表达 relay record 和 publish / feedback flow。 | `03`;`05`;`07` |
| cleanup release 条件、redline release / terminal 条件 | 当前只表达 guard / containment / investigation handoff flow。 | Step 9 / Step 10 / `03`;`05`;`06` |
| derived projection identity、visibility resolution、degraded mapper | 当前只表达 read-only flow 和 degraded surface。 | `03`;`05`;`06` |

本步不新增阻塞 Step 9 的上游 blocker。上述待确认项均为概要层允许挂起项,不得在 Step 9 或正式 §8 中伪装成已确认协议、产品、测试、证据或实施结论。

---

## 20. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已输出通用 Command / Query / Consumer / Job 处理流骨架 | pass |
| 已按主要组成部分组织关键处理流清单 | pass |
| 已为 P0 Command 输出处理流图 | pass |
| 已为会改写本地状态的 Consumer 提供独立处理流口径 | pass |
| 已为影响查询一致性或传播可靠性的 Operations Job 提供处理流口径 | pass |
| 已为复杂 Query / derived read surface 输出独立只读处理流 | pass |
| 每条独立处理流均有 `text` 代码块和关键设计点 | pass |
| 点名函数 / service / guard 调用时参数均带类型名 | pass |
| 每条处理流均回指 Step 7 接口和 Step 6 对象 | pass |
| 未展开独立图的接口已有取舍说明 | pass |
| 已完成处理流归属停审记录 | pass |
| 已完成跨处理流一致性审计 | pass |
| 已输出 Step 9 状态机反查清单 | pass |
| 未写完整伪代码、完整 Rust 签名、DTO / event schema、repository、事务、错误码、retry、topic、配置 key、测试或实施 boundary | pass |
| 未修改正式 `projects/L4-sandbox/02-概要设计.md` | pass |
| 是否可以进入 Step 9 | 需要用户审查并明确确认后,才能进入 Step 9 `状态定义与状态流转`。 |

进入下一步条件:

```text
Step 8 `关键处理流 / 重要函数数据流` 已完成,gate_status = pass_wait_review。
等待用户审查本文件。
用户确认后,才能进入 Step 9 `状态定义与状态流转`。
```

---

## 21. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 审计结论 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 boundary依赖审计 | 本步原先在 `EstablishExecutionBoundary` 中先加载 policy snapshot,与正式 `Context -> Boundary -> Policy -> Run` 顺序形成循环。 | Boundary flow改为只消费accepted context、active identity、显式四维requirements、builder注入profile / template、generation-scoped runtime handle和capability;Policy flow继续消费已保存boundary requirement。 | 顺序恢复为单向依赖,不改变接口数量、对象族或正式阶段数。 |
